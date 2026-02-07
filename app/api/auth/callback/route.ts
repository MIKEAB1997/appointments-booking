import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Auth callback handler for Supabase magic link/OAuth verification
 * This route is called when user clicks the magic link or completes OAuth
 *
 * It handles:
 * 1. Exchanging the code for a session
 * 2. Creating user profile if it doesn't exist
 * 3. Processing pending business registration
 * 4. Redirecting to appropriate destination
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();

    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to error page with message
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent(error.message)}`,
          requestUrl.origin
        )
      );
    }

    // If we have a session, ensure user profile exists
    if (sessionData?.user) {
      const authUser = sessionData.user;

      // Check if user profile exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", authUser.id)
        .single();

      if (!existingUser) {
        // Create new user profile
        const fullName = authUser.user_metadata?.full_name ||
                         authUser.user_metadata?.name ||
                         authUser.email?.split("@")[0] ||
                         "משתמש";

        const avatarUrl = authUser.user_metadata?.avatar_url ||
                          authUser.user_metadata?.picture ||
                          null;

        // Determine role - check cookie for business owner flag
        const cookieStore = await cookies();
        const pendingBusinessOwner = cookieStore.get("pendingBusinessOwner")?.value === "true";
        const role = pendingBusinessOwner ? "owner" : "customer";

        // Create user record
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            auth_id: authUser.id,
            email: authUser.email,
            full_name: fullName,
            phone: authUser.user_metadata?.phone || null,
            avatar_url: avatarUrl,
            role: role,
            tenant_id: null, // Will be set when business is created
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating user profile:", createError);
        }

        // If this is a business owner, redirect to complete business setup
        if (pendingBusinessOwner && newUser) {
          // Clear the cookie
          const response = NextResponse.redirect(
            new URL("/auth/business/complete-setup", requestUrl.origin)
          );
          response.cookies.delete("pendingBusinessOwner");
          return response;
        }
      }
    }
  }

  // Redirect to the intended destination or dashboard
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
