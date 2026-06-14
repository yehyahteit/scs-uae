import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client (for client components)
export const supabaseBrowser = () =>
  createClientComponentClient<Database>()

// Server component client — lazy-imports cookies so it never runs in client bundles
export const supabaseServer = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cookies } = require('next/headers')
  return createServerComponentClient<Database>({ cookies })
}

// Service role client (for API routes — bypasses RLS)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Generic public client (anon) — no-store so Next.js never caches responses
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, opts) => fetch(url, { ...opts, cache: 'no-store' }),
  },
})
