import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { env } from './env'

// Debug: Log what we're using to create the client
console.log('🔧 Creating Supabase client with:')
console.log('  URL:', env.NEXT_PUBLIC_SUPABASE_URL)
console.log('  Key length:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 'undefined')
console.log('  Key starts with:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'undefined')

// Client-side Supabase client (for use in client components)
export const supabase = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL || 'https://ermyyqopbhbuqqgpotpg.supabase.co',
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Server-side Supabase client (for use in server components)
export const createServerClient = () => {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || '',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}