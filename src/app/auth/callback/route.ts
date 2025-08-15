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
    
    // Check if user needs to complete onboarding
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', data.user?.id)
        .single()

      if (!profile?.onboarding_completed) {
        console.log('📝 User needs onboarding, redirecting...')
        return NextResponse.redirect(requestUrl.origin + '/onboarding')
      } else {
        console.log('🚀 User completed onboarding, redirecting to dashboard...')
        return NextResponse.redirect(requestUrl.origin + '/dashboard')
      }
    } catch (profileError) {
      console.error('❌ Error checking profile:', profileError)
      // If profile check fails, redirect to onboarding to be safe
      return NextResponse.redirect(requestUrl.origin + '/onboarding')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error)
    return NextResponse.redirect(requestUrl.origin + '/login?error=callback_error')
  }
}
