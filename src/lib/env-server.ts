import { z } from 'zod'

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').refine(
    (key) => key.startsWith('sk-'),
    'OpenAI API key must start with "sk-"'
  ),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

export const serverEnv = serverEnvSchema.parse(process.env)
