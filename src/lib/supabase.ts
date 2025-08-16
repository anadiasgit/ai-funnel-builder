import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { clientEnv } from './env-client'

// Debug: Log what we're using to create the client
console.log('🔧 Creating Supabase client with:')
console.log('  URL:', clientEnv.NEXT_PUBLIC_SUPABASE_URL)
console.log('  Key length:', clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY.length)
console.log('  Key starts with:', clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...')

// Client-side Supabase client (for use in client components)
export const supabase = createBrowserClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Server-side Supabase client (for use in server components)
export const createServerClient = () => {
  // This will be imported in server-side code only
  const { serverEnv } = require('./env-server')
  return createClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY
  )
}