import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl ? 'Present' : 'Missing'}, Key: ${supabaseAnonKey ? 'Present' : 'Missing'}`)
}

// Client-side Supabase client (for use in client components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for use in server components)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}