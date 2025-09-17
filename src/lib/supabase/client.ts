import { createBrowserClient } from "@supabase/ssr";

export function getBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing supabase URL or supabase Key");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}


