import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { isSupabaseConfigured } from './client'

export { isSupabaseConfigured }

// Fast client for public data reading (No cookie overhead, super fast ~20-50ms)
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null

  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Authenticated server client for admin session handling
export async function createClientServer() {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const cookieStore = await cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server Component read-only fallback
            }
          },
        },
      }
    )
  } catch (err) {
    console.warn('Failed to initialize server Supabase client:', err)
    return null
  }
}
