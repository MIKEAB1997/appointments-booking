import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security";

/**
 * Booking Confirmation API
 * POST /api/bookings/[id]/confirm - Confirm a pending booking
 *
 * This can be called by:
 * 1. Customer clicking confirmation link in email/SMS
 * 2. Business owner manually confirming
 */

interface ConfirmBookingBody {
  confirmation_code?: string; // Required for customer self-confirmation
  confirmed_by?: "customer" | "business";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`booking_confirm_${clientIp}`, 20, 60000);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const body: ConfirmBookingBody = await request.json().catch(() => ({}));

    // Get existing booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, tenants:tenant_id(name)")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if already confirmed
    if (booking.status === "confirmed") {
      return NextResponse.json({
        success: true,
        data: booking,
        message: "Booking is already confirmed",
      });
    }

    // Check if cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot confirm a cancelled booking" },
        { status: 400 }
      );
    }

    // Check if in the past
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { error: "Cannot confirm a booking that has already passed" },
        { status: 400 }
      );
    }

    // If customer is confirming, validate confirmation code
    if (body.confirmed_by === "customer" || body.confirmation_code) {
      if (body.confirmation_code !== booking.confirmation_code) {
        return NextResponse.json(
          { error: "Invalid confirmation code" },
          { status: 400 }
        );
      }
    }

    // Update booking status to confirmed
    const { data: confirmedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmed_by: body.confirmed_by ?? "customer",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error confirming booking:", updateError);
      return NextResponse.json(
        { error: "Failed to confirm booking", details: updateError.message },
        { status: 500 }
      );
    }

    // TODO: Send confirmation notification to business

    return NextResponse.json({
      success: true,
      data: confirmedBooking,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings/[id]/confirm
 * Alternative confirmation via URL (for email links)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Confirmation code required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get booking and validate code
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, tenants:tenant_id(name, slug)")
      .eq("id", id)
      .eq("confirmation_code", code)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Invalid booking or confirmation code" },
        { status: 404 }
      );
    }

    // Already confirmed
    if (booking.status === "confirmed") {
      // Redirect to confirmation page
      const tenantSlug = booking.tenants?.slug ?? "app";
      return NextResponse.redirect(
        new URL(`/${tenantSlug}/book/confirmed?already=true`, url.origin)
      );
    }

    // Cannot confirm cancelled booking
    if (booking.status === "cancelled") {
      return NextResponse.redirect(
        new URL(`/${booking.tenants?.slug ?? "app"}/book?error=cancelled`, url.origin)
      );
    }

    // Confirm the booking
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmed_by: "customer",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error confirming booking via link:", updateError);
      return NextResponse.redirect(
        new URL(`/${booking.tenants?.slug ?? "app"}/book?error=failed`, url.origin)
      );
    }

    // Redirect to success page
    const tenantSlug = booking.tenants?.slug ?? "app";
    return NextResponse.redirect(
      new URL(`/${tenantSlug}/book/confirmed`, url.origin)
    );
  } catch (error) {
    console.error("Booking confirmation GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
