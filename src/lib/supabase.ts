import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  throw new Error("Supabase API key is missing (neither publishable nor anon key found)");
}

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL.trim(),
  supabaseKey.trim()
);

// Admin client for server-side operations (e.g. storage uploads)
export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL.trim(), env.SUPABASE_SERVICE_ROLE_KEY.trim())
  : supabase; // Fallback to anon client if secret key is missing (local dev)
