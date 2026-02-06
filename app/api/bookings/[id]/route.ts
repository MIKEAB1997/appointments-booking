import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security";

/**
 * Single Booking API Routes
 * GET /api/bookings/[id] - Get booking details
 * PATCH /api/bookings/[id] - Update booking (reschedule, change status)
 * DELETE /api/bookings/[id] - Cancel booking
 */

interface UpdateBookingBody {
  status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  booking_date?: string;
  booking_time?: string;
  staff_id?: string;
  notes?: string;
}

/**
 * GET /api/bookings/[id]
 * Get a single booking by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services:service_id (
          id,
          name,
          description,
          duration,
          price,
          color
        ),
        staff:staff_id (
          id,
          name
        ),
        tenants:tenant_id (
          id,
          name,
          slug
        )
      `)
      .eq("id", id)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Booking GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[id]
 * Update booking (status, reschedule, etc.)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body: UpdateBookingBody = await request.json();

    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, services:service_id(duration)")
      .eq("id", id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Prevent modifications to cancelled or completed bookings (except for status updates by admin)
    if (
      existingBooking.status === "cancelled" ||
      existingBooking.status === "completed"
    ) {
      // Only allow status changes
      if (body.booking_date || body.booking_time || body.staff_id) {
        return NextResponse.json(
          { error: "Cannot modify a cancelled or completed booking" },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) {
      const validStatuses = ["pending", "confirmed", "cancelled", "completed", "no_show"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes;
    }

    if (body.staff_id) {
      updates.staff_id = body.staff_id;
    }

    // Handle rescheduling
    if (body.booking_date || body.booking_time) {
      const newDate = body.booking_date ?? existingBooking.booking_date;
      const newTime = body.booking_time ?? existingBooking.booking_time;

      // Validate new date/time is not in the past
      const newDateTime = new Date(`${newDate}T${newTime}`);
      if (newDateTime < new Date()) {
        return NextResponse.json(
          { error: "Cannot reschedule to a past time" },
          { status: 400 }
        );
      }

      // Calculate new end time
      const serviceDuration = existingBooking.services?.duration ?? 60;
      const startTime = new Date(`${newDate}T${newTime}`);
      const endTime = new Date(startTime.getTime() + serviceDuration * 60000);
      const endTimeStr = endTime.toTimeString().slice(0, 5);

      // Check for conflicts (excluding this booking)
      const { data: conflicts } = await supabase
        .from("bookings")
        .select("id")
        .eq("tenant_id", existingBooking.tenant_id)
        .eq("booking_date", newDate)
        .neq("id", id)
        .neq("status", "cancelled")
        .gte("booking_time", newTime)
        .lt("booking_time", endTimeStr);

      if (conflicts && conflicts.length > 0) {
        return NextResponse.json(
          { error: "New time slot is not available" },
          { status: 409 }
        );
      }

      updates.booking_date = newDate;
      updates.booking_time = newTime;
      updates.end_time = endTimeStr;
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating booking:", updateError);
      return NextResponse.json(
        { error: "Failed to update booking", details: updateError.message },
        { status: 500 }
      );
    }

    // TODO: Send notification about update to customer and business

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Booking PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel a booking
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const url = new URL(request.url);
    const reason = url.searchParams.get("reason") ?? "Customer request";

    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if booking is already cancelled
    if (existingBooking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Check if booking is in the past
    const bookingDateTime = new Date(
      `${existingBooking.booking_date}T${existingBooking.booking_time}`
    );
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { error: "Cannot cancel a booking that has already passed" },
        { status: 400 }
      );
    }

    // Soft delete - update status to cancelled
    const { data: cancelledBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error cancelling booking:", updateError);
      return NextResponse.json(
        { error: "Failed to cancel booking", details: updateError.message },
        { status: 500 }
      );
    }

    // TODO: Send cancellation notification to customer and business
    // TODO: Free up the time slot

    return NextResponse.json({
      success: true,
      data: cancelledBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Booking DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
