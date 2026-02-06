import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Creates a Supabase admin client with service role key
 *
 * WARNING: This client bypasses Row Level Security (RLS)
 * Only use in:
 * - Server-side code (Route Handlers, Server Actions)
 * - Admin operations that require elevated privileges
 * - Background jobs / cron tasks
 *
 * NEVER expose this client to the browser/client-side
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase admin environment variables. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  // Validate we're on the server
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminClient must only be called on the server. " +
        "Never use the service role key in client-side code."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
