// contexts/AuthContext.tsx - FIXED VERSION
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
          // Wait a moment for the database trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          try {
            // Check if user has completed onboarding
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single()

            const currentPath = window.location.pathname
            
            if (!profile?.onboarding_completed) {
              // Only redirect if not already on onboarding page
              if (currentPath !== '/onboarding') {
                router.push('/onboarding')
              }
            } else {
              // Only redirect to dashboard if not already there and not on main page
              if (currentPath !== '/dashboard' && currentPath !== '/') {
                router.push('/dashboard')
              }
            }
          } catch (error) {
            console.error('Error checking profile:', error)
            // If anything goes wrong, redirect to onboarding to be safe
            const currentPath = window.location.pathname
            if (currentPath !== '/onboarding') {
              router.push('/onboarding')
            }
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
    console.log('🔍 Starting signup process...')
    console.log('  Email:', email)
    console.log('  User data:', userData)
    
    try {
      // Just create the user - the database trigger will handle profile creation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // This gets stored in user_metadata and used by the trigger
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      console.log('🔍 Signup response:')
      console.log('  Data:', data)
      console.log('  Error:', error)
      console.log('  Session:', data.session)
      console.log('  User:', data.user)
      
      if (error) {
        console.error('❌ Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
      } else if (data.user && !data.session) {
        console.log('📧 Email confirmation required - user created but no session')
        // This means email confirmation is required
      } else if (data.session) {
        console.log('✅ User signed up and session created immediately')
      }
      
      return { user: data.user, error }
    } catch (err) {
      console.error('❌ Signup exception:', err)
      return { user: null, error: { message: 'Unexpected error during signup' } as AuthError }
    }
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
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { user: data, error }
  }

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { user: data, error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
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