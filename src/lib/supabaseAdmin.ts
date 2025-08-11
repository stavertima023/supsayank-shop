import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    throw new Error("Supabase env not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE");
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}


