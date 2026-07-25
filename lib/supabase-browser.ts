import { createClient as createBrowserClient } from "@supabase/supabase-js";

// ponytail: no RLS/no auth for now; add auth/RLS when multi-user needed
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);