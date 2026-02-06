"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Filter,
  Clock,
  User,
  Phone,
  MoreVertical,
  X
} from "lucide-react";

// Types
interface Booking {
  id: string;
  time: string;
  duration: number;
  customer: string;
  phone: string;
  service: string;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  staffId?: string;
}

interface StaffMember {
  id: string;
  name: string;
  color: string;
}

// Demo data
const staffMembers: StaffMember[] = [
  { id: "1", name: "יעל", color: "violet" },
  { id: "2", name: "נועה", color: "rose" },
  { id: "3", name: "מיכל", color: "blue" },
];

// Generate demo bookings for a date
function generateBookingsForDate(date: Date): Booking[] {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 6) return []; // Saturday - closed

  const seed = date.getDate() + date.getMonth() * 31;
  const bookings: Booking[] = [];
  const services = ["מניקור ג'ל", "פדיקור ספא", "טיפול פנים", "איפור", "עיצוב גבות"];
  const names = ["שרה כהן", "דנה לוי", "מיכל אברהם", "רונית שמש", "יעל דוד", "נועה גולן", "תמר פרידמן"];
  const statuses: Array<"confirmed" | "pending" | "cancelled"> = ["confirmed", "confirmed", "confirmed", "pending", "cancelled"];

  const startHour = 9;
  const endHour = dayOfWeek === 5 ? 14 : 20;

  // Generate 4-8 bookings per day
  const bookingCount = 4 + (seed % 5);

  for (let i = 0; i < bookingCount; i++) {
    const hour = startHour + ((seed + i * 7) % (endHour - startHour));
    const minute = ((seed + i) % 2) * 30;
    const duration = [30, 45, 60, 75, 90][(seed + i) % 5] ?? 60;
    const serviceIndex = (seed + i) % services.length;
    const nameIndex = (seed + i * 3) % names.length;
    const statusIndex = (seed + i) % statuses.length;
    const staffIndex = (seed + i) % staffMembers.length;

    bookings.push({
      id: `${date.toISOString()}-${i}`,
      time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
      duration,
      customer: names[nameIndex] ?? "לקוח",
      phone: `05${(seed + i) % 10}-${String(1000000 + ((seed * i) % 9000000))}`,
      service: services[serviceIndex] ?? "שירות",
      status: statuses[statusIndex] ?? "confirmed",
      price: [80, 120, 150, 200, 250][(seed + i) % 5] ?? 100,
      staffId: staffMembers[staffIndex]?.id,
    });
  }

  return bookings.sort((a, b) => a.time.localeCompare(b.time));
}

// Generate week days
function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}

// Time slots (30 min intervals)
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

const statusColors = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  cancelled: "bg-gray-400",
};

const staffColors: Record<string, string> = {
  violet: "border-violet-500 bg-violet-50 dark:bg-violet-900/20",
  rose: "border-rose-500 bg-rose-50 dark:bg-rose-900/20",
  blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Get week days
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Get bookings for the week
  const weekBookings = useMemo(() => {
    const bookingsMap: Record<string, Booking[]> = {};
    weekDays.forEach((day) => {
      const dateKey = day.toISOString().split("T")[0];
      if (dateKey) {
        bookingsMap[dateKey] = generateBookingsForDate(day);
      }
    });
    return bookingsMap;
  }, [weekDays]);

  // Navigation
  const goToToday = () => setCurrentDate(new Date());

  const goToPrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - (view === "week" ? 7 : 1));
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (view === "week" ? 7 : 1));
    setCurrentDate(newDate);
  };

  // Get week range string
  const weekRange = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    if (!first || !last) return "";

    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()}-${last.getDate()} ${monthNames[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${first.getDate()} ${monthNames[first.getMonth()]} - ${last.getDate()} ${monthNames[last.getMonth()]} ${last.getFullYear()}`;
  }, [weekDays]);

  // Calculate booking position and height
  const getBookingStyle = (booking: Booking) => {
    const [hours, minutes] = booking.time.split(":").map(Number);
    const startMinutes = ((hours ?? 0) - 8) * 60 + (minutes ?? 0);
    const top = (startMinutes / 30) * 48; // 48px per 30min slot
    const height = (booking.duration / 30) * 48;
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
            >
              היום
            </button>
            <div className="flex items-center">
              <button
                onClick={goToPrev}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={goToNext}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {weekRange}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Staff Filter */}
            <div className="flex items-center gap-1">
              {staffMembers.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => setSelectedStaff(selectedStaff === staff.id ? null : staff.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    selectedStaff === staff.id || selectedStaff === null
                      ? `border-${staff.color}-500 bg-${staff.color}-100 text-${staff.color}-700`
                      : "border-gray-300 bg-gray-100 text-gray-400"
                  }`}
                  style={{
                    borderColor: selectedStaff === staff.id || selectedStaff === null
                      ? staff.color === "violet" ? "#8b5cf6" : staff.color === "rose" ? "#f43f5e" : "#3b82f6"
                      : undefined,
                    backgroundColor: selectedStaff === staff.id || selectedStaff === null
                      ? staff.color === "violet" ? "#ede9fe" : staff.color === "rose" ? "#ffe4e6" : "#dbeafe"
                      : undefined,
                  }}
                >
                  {staff.name[0]}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setView("day")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  view === "day"
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                יום
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  view === "week"
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                שבוע
              </button>
            </div>

            {/* Add Booking Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">תור חדש</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
            <div className="grid grid-cols-8">
              {/* Time column header */}
              <div className="w-16" />

              {/* Day headers */}
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString();
                const isSaturday = day.getDay() === 6;
                const dateKey = day.toISOString().split("T")[0] ?? "";
                const dayBookings = weekBookings[dateKey] ?? [];

                return (
                  <div
                    key={index}
                    className={`px-2 py-3 text-center border-r border-gray-100 dark:border-slate-800 ${
                      isSaturday ? "bg-gray-50 dark:bg-slate-800/50" : ""
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      isToday ? "text-violet-600" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {dayNames[day.getDay()]}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isToday
                        ? "w-10 h-10 mx-auto rounded-full bg-violet-500 text-white flex items-center justify-center"
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {day.getDate()}
                    </p>
                    {dayBookings.length > 0 && !isSaturday && (
                      <p className="text-xs text-gray-400 mt-1">
                        {dayBookings.filter(b => b.status !== "cancelled").length} תורים
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Grid */}
          <div className="relative">
            <div className="grid grid-cols-8">
              {/* Time Labels */}
              <div className="w-16">
                {timeSlots.map((time, index) => (
                  <div key={index} className="h-12 border-b border-gray-100 dark:border-slate-800 pr-2">
                    {index % 2 === 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIndex) => {
                const isSaturday = day.getDay() === 6;
                const dateKey = day.toISOString().split("T")[0] ?? "";
                const dayBookings = (weekBookings[dateKey] ?? []).filter(
                  (b) => !selectedStaff || b.staffId === selectedStaff
                );

                return (
                  <div
                    key={dayIndex}
                    className={`relative border-r border-gray-100 dark:border-slate-800 ${
                      isSaturday ? "bg-gray-50 dark:bg-slate-800/50" : ""
                    }`}
                  >
                    {/* Grid lines */}
                    {timeSlots.map((_, index) => (
                      <div
                        key={index}
                        className="h-12 border-b border-gray-100 dark:border-slate-800"
                      />
                    ))}

                    {/* Bookings */}
                    {!isSaturday && dayBookings.map((booking) => {
                      const style = getBookingStyle(booking);
                      const staff = staffMembers.find((s) => s.id === booking.staffId);

                      return (
                        <button
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`absolute left-1 right-1 rounded-lg border-r-4 p-2 text-right overflow-hidden transition-all hover:shadow-md ${
                            booking.status === "cancelled"
                              ? "bg-gray-100 dark:bg-slate-800 border-gray-400 opacity-50"
                              : staff
                              ? staffColors[staff.color] + ` border-${staff.color}-500`
                              : "bg-violet-50 dark:bg-violet-900/20 border-violet-500"
                          }`}
                          style={{
                            ...style,
                            borderRightColor: booking.status === "cancelled"
                              ? "#9ca3af"
                              : staff?.color === "violet" ? "#8b5cf6"
                              : staff?.color === "rose" ? "#f43f5e"
                              : staff?.color === "blue" ? "#3b82f6"
                              : "#8b5cf6",
                          }}
                        >
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {booking.customer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {booking.service}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[booking.status]}`} />
                            <span className="text-xs text-gray-400">{booking.time}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                פרטי התור
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedBooking.customer}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">
                    {selectedBooking.phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">שירות</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedBooking.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">שעה</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedBooking.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">משך</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedBooking.duration} דקות
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">מחיר</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₪{selectedBooking.price}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  התקשר
                </a>
                <button className="flex-1 py-2 px-4 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors">
                  ערוך תור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
