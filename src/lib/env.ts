import { z } from 'zod'

const envSchema = z.object({
  // Database - Make these REQUIRED, not optional
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // OpenAI - Make this REQUIRED
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').refine(
    (key) => key.startsWith('sk-'),
    'OpenAI API key must start with "sk-"'
  ),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
})

// Debug: Log what we're getting from process.env
console.log('🔍 Raw environment variables:')
console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET')
console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET')

// Parse and validate - this will throw an error if any required env vars are missing
export const env = envSchema.parse(process.env)

console.log('✅ Environment variables validated successfully!')

// Export individual environment variables for convenience
export const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY,
  NODE_ENV,
  NEXT_PUBLIC_APP_URL,
} = env
