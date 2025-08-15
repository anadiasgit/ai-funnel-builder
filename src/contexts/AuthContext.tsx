// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError, PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface UserData {
  full_name?: string
  company_name?: string
  [key: string]: unknown
}

interface ProfileUpdates {
  full_name?: string
  company_name?: string
  business_type?: string
  industry?: string
  experience_level?: string
  goals?: string[]
  onboarding_completed?: boolean
  updated_at?: string
  [key: string]: unknown
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, userData?: UserData) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ user: { provider: string; url: string | null } | null; error: AuthError | null }>
  signInWithGithub: () => Promise<{ user: { provider: string; url: string | null } | null; error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: ProfileUpdates) => Promise<{ error: PostgrestError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user profile exists, create if it doesn't
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single()

          if (!profile) {
            // Create profile for OAuth users
            await supabase.from('profiles').insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
              company_name: session.user.user_metadata?.company_name || '',
              onboarding_completed: false
            })
            router.push('/onboarding')
          } else if (!profile.onboarding_completed) {
            router.push('/onboarding')
          } else {
            router.push('/dashboard')
          }
        }

        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string, userData?: UserData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (data.user && !error) {
      // Create profile record
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: userData?.full_name || '',
        company_name: userData?.company_name || '',
        onboarding_completed: false
      })
    }

    return { user: data.user, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { user: data.user, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { user: data, error }
  }

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { user: data, error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    })
    return { error }
  }

  const updateProfile = async (updates: ProfileUpdates) => {
    if (!user) return { error: { message: 'No user found' } as PostgrestError }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      signInWithGithub,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}