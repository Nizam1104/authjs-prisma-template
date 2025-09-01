import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

export async function getSupabaseClient() {
  const session = await auth()
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${session?.supabaseAccessToken}` } },
    }
  )
}
