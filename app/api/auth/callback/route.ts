import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for Supabase magic link verification
 * This route is called when user clicks the magic link in their email
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to error page with message
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent(error.message)}`,
          requestUrl.origin
        )
      );
    }
  }

  // Redirect to the intended destination or dashboard
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
