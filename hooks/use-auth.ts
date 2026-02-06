"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { UserRole, User } from "@/lib/supabase/types";

/**
 * Client-side user with tenant context
 */
export interface ClientUser {
  id: string;
  authId: string;
  email: string;
  fullName: string;
  role: UserRole;
  tenantId: string | null;
  avatarUrl: string | null;
}

/**
 * Auth hook return type
 */
export interface UseAuthReturn {
  user: ClientUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

/**
 * Client-side authentication hook
 * Use this in Client Components to access auth state and methods
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Fetch user profile from users table
  const fetchUserProfile = useCallback(
    async (authUser: SupabaseUser): Promise<ClientUser | null> => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", authUser.id)
          .single();

        const userProfile = data as User | null;

        if (error || !userProfile) {
          // Return basic info if no profile exists yet
          return {
            id: authUser.id,
            authId: authUser.id,
            email: authUser.email ?? "",
            fullName:
              (authUser.user_metadata?.full_name as string | undefined) ?? "",
            role: "customer" as UserRole,
            tenantId: null,
            avatarUrl:
              (authUser.user_metadata?.avatar_url as string | undefined) ??
              null,
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
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        if (currentSession?.user) {
          const userProfile = await fetchUserProfile(currentSession.user);
          setUser(userProfile);
        }
      } catch {
        // Session fetch failed
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);

      if (currentSession?.user) {
        const userProfile = await fetchUserProfile(currentSession.user);
        setUser(userProfile);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  /**
   * Send magic link to email
   */
  const signIn = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
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
    },
    [supabase]
  );

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
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
  }, [supabase]);

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: message };
    }
  }, [supabase]);

  return {
    user,
    session,
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
  };
}
