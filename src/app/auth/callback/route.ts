// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('🔐 Auth callback received:', { 
    code: code ? 'present' : 'missing',
    origin: requestUrl.origin,
    pathname: requestUrl.pathname
  })

  if (!code) {
    console.error('❌ No code parameter in auth callback')
    return NextResponse.redirect(requestUrl.origin + '/login?error=no_code')
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    
    console.log('🔄 Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Error exchanging code for session:', error)
      return NextResponse.redirect(requestUrl.origin + '/login?error=session_error')
    }
    
    console.log('✅ Session created successfully for user:', data.user?.email)
    console.log('🔍 User metadata:', data.user?.user_metadata)
    console.log('🔍 User ID:', data.user?.id)
    console.log('🔍 User created at:', data.user?.created_at)
    console.log('🔍 Is new user?', data.user?.created_at === data.user?.last_sign_in_at)
    
    // Wait a moment for database triggers to create the profile
    console.log('⏳ Waiting for profile creation...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if user needs to complete onboarding
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', data.user?.id)
        .single()

      let profile = profileData
      let needsOnboarding = true

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        console.log('📝 Profile not found, creating new profile...')
        
        // Try to create profile with retry logic
        let newProfile = null
        let createError = null
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`📝 Profile creation attempt ${attempt}/3...`)
          
          const { data: profileData, error: attemptError } = await supabase
            .from('profiles')
            .insert({
              id: data.user?.id,
              email: data.user?.email,
              full_name: data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || 'New User',
              company_name: data.user?.user_metadata?.company_name || '',
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (attemptError) {
            console.error(`❌ Profile creation attempt ${attempt} failed:`, attemptError)
            createError = attemptError
            
            if (attempt < 3) {
              console.log(`⏳ Waiting before retry...`)
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } else {
            console.log(`✅ Profile created successfully on attempt ${attempt}:`, profileData)
            newProfile = profileData
            createError = null
            break
          }
        }

        if (createError) {
          console.error('❌ All profile creation attempts failed:', createError)
          console.error('❌ Profile creation details:', {
            user_id: data.user?.id,
            email: data.user?.email,
            metadata: data.user?.user_metadata
          })
          // Continue with onboarding even if profile creation fails
          profile = null
        } else {
          profile = newProfile
        }
      } else if (profileError) {
        console.error('❌ Error fetching profile:', profileError)
        console.error('❌ Profile fetch error details:', profileError)
        // If there's another error, redirect to onboarding to be safe
        return NextResponse.redirect(requestUrl.origin + '/onboarding')
      }

      // Determine if user needs onboarding
      if (profile && profile.onboarding_completed) {
        needsOnboarding = false
      }

      // Always redirect to onboarding if no profile or onboarding not completed
      if (needsOnboarding) {
        console.log('📝 User needs onboarding, redirecting...')
        console.log('📝 Profile state:', { profile, onboarding_completed: profile?.onboarding_completed })
        return NextResponse.redirect(requestUrl.origin + '/onboarding')
      } else {
        console.log('🚀 User completed onboarding, redirecting to dashboard...')
        return NextResponse.redirect(requestUrl.origin + '/dashboard')
      }
    } catch (profileError) {
      console.error('❌ Unexpected error in profile handling:', profileError)
      // If anything goes wrong, redirect to onboarding to be safe
      return NextResponse.redirect(requestUrl.origin + '/onboarding')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error)
    return NextResponse.redirect(requestUrl.origin + '/login?error=callback_error')
  }
}
