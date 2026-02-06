import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { validateEmail, validatePhone, validateName, rateLimit } from "@/lib/security";
import type { Booking, Service } from "@/lib/supabase/types";

/**
 * Booking API Routes
 * GET /api/bookings - List bookings (with filters)
 * POST /api/bookings - Create a new booking
 */

// Local type for service with duration field
type ServiceWithDuration = Service & { duration?: number };

// Types for booking data
interface CreateBookingBody {
  tenant_id: string;
  service_id: string;
  staff_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string; // ISO date string
  booking_time: string; // HH:mm format
  notes?: string;
}

interface BookingFilters {
  tenant_id?: string;
  staff_id?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  date_from?: string;
  date_to?: string;
  customer_email?: string;
  limit?: number;
  offset?: number;
}

/**
 * GET /api/bookings
 * List bookings with optional filters
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);

    // Parse query parameters for filters
    const filters: BookingFilters = {
      tenant_id: url.searchParams.get("tenant_id") ?? undefined,
      staff_id: url.searchParams.get("staff_id") ?? undefined,
      status: url.searchParams.get("status") as BookingFilters["status"] ?? undefined,
      date_from: url.searchParams.get("date_from") ?? undefined,
      date_to: url.searchParams.get("date_to") ?? undefined,
      customer_email: url.searchParams.get("customer_email") ?? undefined,
      limit: url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : 50,
      offset: url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset")!) : 0,
    };

    // Build query
    let query = supabase
      .from("bookings")
      .select(`
        *,
        services:service_id (
          id,
          name,
          duration,
          price,
          color
        ),
        staff:staff_id (
          id,
          name
        )
      `)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    // Apply filters
    if (filters.tenant_id) {
      query = query.eq("tenant_id", filters.tenant_id);
    }

    if (filters.staff_id) {
      query = query.eq("staff_id", filters.staff_id);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.date_from) {
      query = query.gte("booking_date", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("booking_date", filters.date_to);
    }

    if (filters.customer_email) {
      query = query.eq("customer_email", filters.customer_email);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        count: bookings?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimitResult = rateLimit(`booking_create_${clientIp}`, 10, 60000); // 10 requests per minute

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const body: CreateBookingBody = await request.json();

    // Validate required fields
    if (!body.tenant_id || !body.service_id || !body.customer_name ||
        !body.customer_email || !body.customer_phone ||
        !body.booking_date || !body.booking_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate input data
    const emailValidation = validateEmail(body.customer_email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid email address", details: emailValidation.error },
        { status: 400 }
      );
    }

    const phoneValidation = validatePhone(body.customer_phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid phone number", details: phoneValidation.error },
        { status: 400 }
      );
    }

    const nameValidation = validateName(body.customer_name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid customer name", details: nameValidation.error },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const bookingDateTime = new Date(`${body.booking_date}T${body.booking_time}`);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { error: "Cannot book appointments in the past" },
        { status: 400 }
      );
    }

    // Check for service existence and get duration
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("id, duration_minutes, price, buffer_minutes")
      .eq("id", body.service_id)
      .eq("tenant_id", body.tenant_id)
      .eq("is_active", true)
      .single();

    const service = serviceData as { id: string; duration_minutes: number; price: number | null; buffer_minutes: number } | null;

    if (serviceError || !service) {
      return NextResponse.json(
        { error: "Service not found or inactive" },
        { status: 404 }
      );
    }

    // Calculate end time based on service duration
    const startTime = new Date(`${body.booking_date}T${body.booking_time}`);
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);
    const endTimeStr = endTime.toTimeString().slice(0, 5);

    // Check for conflicting bookings
    const { data: conflicts, error: conflictError } = await supabase
      .from("bookings")
      .select("id")
      .eq("tenant_id", body.tenant_id)
      .eq("booking_date", body.booking_date)
      .neq("status", "cancelled")
      .or(`staff_id.eq.${body.staff_id ?? "null"}`)
      .gte("booking_time", body.booking_time)
      .lt("booking_time", endTimeStr);

    if (!conflictError && conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: "Time slot is no longer available" },
        { status: 409 }
      );
    }

    // Generate confirmation code
    const confirmationCode = `NG${Date.now().toString().slice(-8)}`;

    // Create the booking
    const bookingData = {
      tenant_id: body.tenant_id,
      service_id: body.service_id,
      staff_id: body.staff_id ?? null,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      booking_date: body.booking_date,
      booking_time: body.booking_time,
      end_time: endTimeStr,
      notes: body.notes ?? null,
      status: "pending" as const,
      confirmation_code: confirmationCode,
      price: service.price,
    };

    const { data: booking, error: createError } = await supabase
      .from("bookings")
      .insert(bookingData as never)
      .select()
      .single();

    if (createError) {
      console.error("Error creating booking:", createError);
      return NextResponse.json(
        { error: "Failed to create booking", details: createError.message },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email/SMS to customer
    // TODO: Send notification to business owner

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
