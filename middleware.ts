import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/calendar",
  "/clients",
  "/services",
  "/website",
  "/settings",
  "/reports",
  "/payments",
];

/**
 * Routes that require admin role
 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Routes that should skip middleware processing
 */
const SKIP_ROUTES = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/manifest.json",
  "/sw.js",
];

/**
 * Main middleware function
 * Handles:
 * 1. Tenant resolution from subdomain or path
 * 2. Auth session refresh
 * 3. Route protection
 */
export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Skip static files and API routes
  if (SKIP_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Create response to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session - IMPORTANT: Must be called to keep session alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // === TENANT RESOLUTION ===
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "nextgen.co.il";
  let tenantSlug: string | null = null;

  // Production: Extract from subdomain
  if (hostname.endsWith(`.${appDomain}`)) {
    tenantSlug = hostname.replace(`.${appDomain}`, "");
    // Exclude reserved subdomains
    if (["www", "api", "admin", "app"].includes(tenantSlug)) {
      tenantSlug = null;
    }
  }

  // Development: Support path-based routing for localhost
  // e.g., /demo-studio/book -> tenant = "demo-studio"
  if (!tenantSlug && (hostname === "localhost" || hostname.includes("127.0.0.1"))) {
    const pathSegments = pathname.split("/").filter(Boolean);

    // Check if first segment could be a tenant slug (not a reserved route)
    const firstSegment = pathSegments[0];
    if (
      firstSegment &&
      !PROTECTED_ROUTES.some((r) => r.slice(1) === firstSegment) &&
      !ADMIN_ROUTES.some((r) => r.slice(1) === firstSegment) &&
      !["auth", "api", "_next"].includes(firstSegment)
    ) {
      // For public tenant routes like /[tenant]/... the slug comes from the path param
      // We'll set it in headers for the page to pick up
      tenantSlug = firstSegment;
    }
  }

  // Set tenant context in headers for downstream use
  if (tenantSlug) {
    response.headers.set("x-tenant-slug", tenantSlug);
  }

  // === ROUTE PROTECTION ===

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route requires admin role
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access for admin routes
  if (isAdminRoute && user) {
    // Fetch user role from database
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (!userProfile || userProfile.role !== "admin") {
      // Not an admin - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else if (isAdminRoute && !user) {
    // Not authenticated - redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
