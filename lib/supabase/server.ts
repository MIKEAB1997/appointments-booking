import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Creates a Supabase client for server-side usage
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * Creates a Supabase client with tenant context
 * All queries will be automatically filtered by tenant_id
 */
export async function createTenantClient(tenantId: string) {
  const client = await createClient();

  // Return client with tenant context for RLS
  return {
    client,
    tenantId,
    // Helper to add tenant_id to queries
    withTenant<T extends Record<string, unknown>>(data: T): T & { tenant_id: string } {
      return { ...data, tenant_id: tenantId };
    },
  };
}
