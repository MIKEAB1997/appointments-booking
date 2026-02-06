import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Availability API
 * GET /api/bookings/availability - Check available time slots
 *
 * Query params:
 * - tenant_id: Required - The business ID
 * - service_id: Required - The service to book
 * - date: Required - Date to check (YYYY-MM-DD)
 * - staff_id: Optional - Filter by specific staff member
 */

interface TimeSlot {
  time: string;
  available: boolean;
  staffId?: string;
  staffName?: string;
}

interface BusinessHours {
  day: number; // 0-6 (Sunday-Saturday)
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Local type for service data from query
interface ServiceData {
  id: string;
  name: string;
  duration: number;
  buffer_before: number | null;
  buffer_after: number | null;
}

// Default business hours (will be fetched from DB in production)
const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { day: 0, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Sunday
  { day: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Monday
  { day: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Tuesday
  { day: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Wednesday
  { day: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Thursday
  { day: 5, isOpen: false, openTime: "09:00", closeTime: "14:00" }, // Friday
  { day: 6, isOpen: false, openTime: "00:00", closeTime: "00:00" }, // Saturday
];

/**
 * Generate time slots for a given date
 */
function generateTimeSlots(
  date: Date,
  serviceDuration: number,
  businessHours: BusinessHours,
  existingBookings: Array<{ booking_time: string; end_time: string }>,
  bufferBefore: number = 0,
  bufferAfter: number = 0
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  if (!businessHours.isOpen) {
    return slots;
  }

  const openParts = businessHours.openTime.split(":").map(Number);
  const closeParts = businessHours.closeTime.split(":").map(Number);
  const openHour = openParts[0] ?? 9;
  const openMinute = openParts[1] ?? 0;
  const closeHour = closeParts[0] ?? 18;
  const closeMinute = closeParts[1] ?? 0;

  // Generate slots every 15 minutes
  const slotInterval = 15;
  const totalDuration = serviceDuration + bufferBefore + bufferAfter;

  const startMinutes = openHour * 60 + openMinute;
  const endMinutes = closeHour * 60 + closeMinute - totalDuration;

  // Check if date is today and adjust start time
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  let currentMinutes = startMinutes;

  if (isToday) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    // Round up to next slot and add 30 min buffer
    const minStart = Math.ceil((nowMinutes + 30) / slotInterval) * slotInterval;
    currentMinutes = Math.max(startMinutes, minStart);
  }

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    // Calculate end time for this slot
    const slotEndMinutes = currentMinutes + totalDuration;
    const endHours = Math.floor(slotEndMinutes / 60);
    const endMins = slotEndMinutes % 60;
    const endTimeStr = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

    // Check if slot conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = booking.booking_time;
      const bookingEnd = booking.end_time;

      // Check for overlap
      return (
        (timeStr >= bookingStart && timeStr < bookingEnd) ||
        (endTimeStr > bookingStart && endTimeStr <= bookingEnd) ||
        (timeStr <= bookingStart && endTimeStr >= bookingEnd)
      );
    });

    slots.push({
      time: timeStr,
      available: !hasConflict,
    });

    currentMinutes += slotInterval;
  }

  return slots;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get("tenant_id");
    const serviceId = url.searchParams.get("service_id");
    const dateStr = url.searchParams.get("date");
    const staffId = url.searchParams.get("staff_id");

    // Validate required params
    if (!tenantId || !serviceId || !dateStr) {
      return NextResponse.json(
        { error: "Missing required parameters: tenant_id, service_id, date" },
        { status: 400 }
      );
    }

    // Validate date format
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Don't allow checking dates more than 60 days in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) {
      return NextResponse.json(
        { error: "Cannot check availability more than 60 days in advance" },
        { status: 400 }
      );
    }

    // Don't allow checking past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return NextResponse.json(
        { error: "Cannot check availability for past dates" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get service details
    const { data: serviceData } = await supabase
      .from("services")
      .select("id, name, duration, buffer_before, buffer_after")
      .eq("id", serviceId)
      .eq("tenant_id", tenantId)
      .eq("is_active", true)
      .single();

    const service = serviceData as ServiceData | null;

    // For demo, use default service if not found
    const serviceDuration = service?.duration ?? 60;
    const bufferBefore = service?.buffer_before ?? 0;
    const bufferAfter = service?.buffer_after ?? 5;

    // Get business hours for this day (using defaults for demo)
    const dayOfWeek = date.getDay();
    const businessHours = DEFAULT_BUSINESS_HOURS.find((h) => h.day === dayOfWeek) ?? {
      day: dayOfWeek,
      isOpen: false,
      openTime: "09:00",
      closeTime: "18:00",
    };

    // Get existing bookings for this date
    let bookingsQuery = supabase
      .from("bookings")
      .select("booking_time, end_time, staff_id")
      .eq("tenant_id", tenantId)
      .eq("booking_date", dateStr)
      .neq("status", "cancelled");

    if (staffId) {
      bookingsQuery = bookingsQuery.eq("staff_id", staffId);
    }

    const { data: existingBookings } = await bookingsQuery;

    // For demo purposes, generate some mock blocked times based on date
    const demoBlockedTimes: Array<{ booking_time: string; end_time: string }> = [];

    // Create deterministic "booked" slots based on date
    const dateSeed = date.getDate() + date.getMonth() * 31;
    const blockedSlots = [
      { hour: 9, available: dateSeed % 3 !== 0 },
      { hour: 10, available: dateSeed % 2 === 0 },
      { hour: 11, available: true },
      { hour: 12, available: dateSeed % 4 !== 0 },
      { hour: 13, available: true },
      { hour: 14, available: dateSeed % 5 === 0 },
      { hour: 15, available: true },
      { hour: 16, available: dateSeed % 3 === 0 },
      { hour: 17, available: dateSeed % 2 !== 0 },
    ];

    blockedSlots.forEach(({ hour, available }) => {
      if (!available) {
        demoBlockedTimes.push({
          booking_time: `${hour.toString().padStart(2, "0")}:00`,
          end_time: `${(hour + 1).toString().padStart(2, "0")}:00`,
        });
      }
    });

    // Combine real bookings with demo blocked times
    const allBlockedTimes = [
      ...(existingBookings ?? []),
      ...demoBlockedTimes,
    ];

    // Generate available time slots
    const timeSlots = generateTimeSlots(
      date,
      serviceDuration,
      businessHours,
      allBlockedTimes,
      bufferBefore,
      bufferAfter
    );

    return NextResponse.json({
      success: true,
      data: {
        date: dateStr,
        isOpen: businessHours.isOpen,
        businessHours: {
          open: businessHours.openTime,
          close: businessHours.closeTime,
        },
        service: {
          id: serviceId,
          name: service?.name ?? "Service",
          duration: serviceDuration,
        },
        slots: timeSlots,
        availableCount: timeSlots.filter((s) => s.available).length,
        totalCount: timeSlots.length,
      },
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
