import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

/**
 * Auth result type
 */
export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Session user with tenant context
 */
export interface SessionUser {
  id: string;
  authId: string;
  email: string;
  fullName: string;
  role: UserRole;
  tenantId: string | null;
  avatarUrl: string | null;
}

/**
 * Send OTP magic link to email
 */
export async function signInWithOtp(email: string): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redirect to auth callback after verification
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOtp(
  email: string,
  token: string
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Get current session (server-side)
 */
export async function getSession() {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Get current user with tenant context (server-side)
 */
export async function getUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Fetch user profile from users table
    const { data: rawProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .single();

    // Type assertion for the response
    const userProfile = rawProfile as {
      id: string;
      email: string;
      full_name: string;
      role: UserRole;
      tenant_id: string | null;
      avatar_url: string | null;
    } | null;

    if (profileError || !userProfile) {
      // User exists in auth but not in users table
      // This can happen for new users - return basic info
      return {
        id: authUser.id,
        authId: authUser.id,
        email: authUser.email ?? "",
        fullName: authUser.user_metadata?.full_name ?? "",
        role: "customer" as UserRole,
        tenantId: null,
        avatarUrl: authUser.user_metadata?.avatar_url ?? null,
      };
    }

    return {
      id: userProfile.id,
      authId: authUser.id,
      email: userProfile.email,
      fullName: userProfile.full_name,
      role: userProfile.role,
      tenantId: userProfile.tenant_id,
      avatarUrl: userProfile.avatar_url,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  // Admin has access to everything
  if (user.role === "admin") {
    return true;
  }

  // Owner has access to owner, staff, customer routes
  if (user.role === "owner" && ["owner", "staff", "customer"].includes(requiredRole)) {
    return true;
  }

  // Staff has access to staff and customer routes
  if (user.role === "staff" && ["staff", "customer"].includes(requiredRole)) {
    return true;
  }

  return user.role === requiredRole;
}

/**
 * Check if user belongs to specific tenant
 */
export async function belongsToTenant(tenantId: string): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  // Admins can access all tenants
  if (user.role === "admin") {
    return true;
  }

  return user.tenantId === tenantId;
}
