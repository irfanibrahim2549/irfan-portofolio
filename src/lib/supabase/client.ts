import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  if (url.includes('your-project-ref') || url.includes('placeholder')) return false
  if (!url.startsWith('https://')) return false
  return true
}

export function createClient() {
  const url = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : 'https://placeholder.supabase.co'
  const key = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : 'placeholder-anon-key'

  return createBrowserClient(url, key)
}
