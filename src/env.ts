import { z } from 'zod'

const envSchema = z.object({
  VITE_TMDB_API_URL: z.string().url(),
  VITE_TMDB_API_KEY: z.string(),
  VITE_TMDB_API_TOKEN: z.string(),
})

const env = envSchema.safeParse(import.meta.env)

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format())
  throw new Error('Invalid environment variables')
}

export const {
  VITE_TMDB_API_URL,
  VITE_TMDB_API_KEY,
  VITE_TMDB_API_TOKEN
} = env.data