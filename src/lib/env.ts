import { z } from 'zod'

const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)

// Validate OpenAI API key format (starts with 'sk-')
if (!env.OPENAI_API_KEY.startsWith('sk-')) {
  throw new Error('Invalid OpenAI API key format. Must start with "sk-"')
}

// Export individual environment variables for convenience
export const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY,
  NODE_ENV,
  NEXT_PUBLIC_APP_URL,
} = env
