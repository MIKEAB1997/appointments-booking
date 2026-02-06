import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Tenant } from "@/lib/supabase/types";

// Cookie name for storing tenant context
const TENANT_COOKIE_NAME = "x-tenant-id";
const TENANT_SLUG_COOKIE_NAME = "x-tenant-slug";

// Header names for tenant context
const TENANT_HEADER_NAME = "x-tenant-id";
const TENANT_SLUG_HEADER_NAME = "x-tenant-slug";

/**
 * Tenant context containing resolved tenant information
 */
export interface TenantContext {
  id: string;
  slug: string;
  name: string;
  vertical: Tenant["vertical"];
  status: Tenant["status"];
  logoUrl: string | null;
}

/**
 * Extract tenant slug from hostname (subdomain)
 * e.g., "studio.nextgen.co.il" -> "studio"
 */
export function getTenantSlugFromHostname(hostname: string): string | null {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "nextgen.co.il";

  // Check if it's a subdomain of the app domain
  if (hostname.endsWith(`.${appDomain}`)) {
    const slug = hostname.replace(`.${appDomain}`, "");
    // Exclude common subdomains
    if (!["www", "api", "admin", "app"].includes(slug)) {
      return slug;
    }
  }

  return null;
}

/**
 * Get tenant by slug from database
 * Uses admin client to bypass RLS for initial tenant lookup
 */
export async function getTenantBySlug(
  slug: string
): Promise<TenantContext | null> {
  try {
    const adminClient = createAdminClient();

    const { data: rawTenant, error } = await adminClient
      .from("tenants")
      .select("id, slug, name, vertical, status, logo_url")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    // Type assertion for the response
    const tenant = rawTenant as {
      id: string;
      slug: string;
      name: string;
      vertical: Tenant["vertical"];
      status: Tenant["status"];
      logo_url: string | null;
    } | null;

    if (error || !tenant) {
      return null;
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      vertical: tenant.vertical,
      status: tenant.status,
      logoUrl: tenant.logo_url,
    };
  } catch {
    return null;
  }
}

/**
 * Get tenant by ID from database
 */
export async function getTenantById(
  tenantId: string
): Promise<TenantContext | null> {
  try {
    const adminClient = createAdminClient();

    const { data: rawTenant, error } = await adminClient
      .from("tenants")
      .select("id, slug, name, vertical, status, logo_url")
      .eq("id", tenantId)
      .single();

    // Type assertion for the response
    const tenant = rawTenant as {
      id: string;
      slug: string;
      name: string;
      vertical: Tenant["vertical"];
      status: Tenant["status"];
      logo_url: string | null;
    } | null;

    if (error || !tenant) {
      return null;
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      vertical: tenant.vertical,
      status: tenant.status,
      logoUrl: tenant.logo_url,
    };
  } catch {
    return null;
  }
}

/**
 * Get current tenant context from request
 * Reads from cookies or headers set by middleware
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  try {
    // Try to get from headers first (set by middleware)
    const headerStore = await headers();
    const tenantId = headerStore.get(TENANT_HEADER_NAME);
    const tenantSlug = headerStore.get(TENANT_SLUG_HEADER_NAME);

    if (tenantId) {
      return getTenantById(tenantId);
    }

    if (tenantSlug) {
      return getTenantBySlug(tenantSlug);
    }

    // Fall back to cookies
    const cookieStore = await cookies();
    const tenantIdCookie = cookieStore.get(TENANT_COOKIE_NAME);
    const tenantSlugCookie = cookieStore.get(TENANT_SLUG_COOKIE_NAME);

    if (tenantIdCookie?.value) {
      return getTenantById(tenantIdCookie.value);
    }

    if (tenantSlugCookie?.value) {
      return getTenantBySlug(tenantSlugCookie.value);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate user has access to tenant
 * Returns true if user belongs to tenant or is admin
 */
export async function validateTenantAccess(
  tenantId: string,
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data: rawUser, error } = await supabase
      .from("users")
      .select("id, role, tenant_id")
      .eq("auth_id", userId)
      .single();

    // Type assertion for the response
    const user = rawUser as {
      id: string;
      role: string;
      tenant_id: string | null;
    } | null;

    if (error || !user) {
      return false;
    }

    // Admins have access to all tenants
    if (user.role === "admin") {
      return true;
    }

    // User must belong to the tenant
    return user.tenant_id === tenantId;
  } catch {
    return false;
  }
}

/**
 * Set tenant context in cookies (for use in middleware)
 */
export function createTenantCookies(tenant: TenantContext) {
  return [
    {
      name: TENANT_COOKIE_NAME,
      value: tenant.id,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      },
    },
    {
      name: TENANT_SLUG_COOKIE_NAME,
      value: tenant.slug,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      },
    },
  ];
}
