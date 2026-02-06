"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Calendar,
  ChevronLeft,
  Check,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  Shield
} from "lucide-react";

// Types
type Step = "service" | "datetime" | "details";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Demo data - matches the tenant page
const demoServices: Record<string, Service[]> = {
  "studio-fit": [
    { id: "1", name: "אימון אישי", description: "אימון אחד על אחד עם מאמן מוסמך", duration: 60, price: 200, category: "אימונים" },
    { id: "2", name: "יוגה פרטי", description: "שיעור יוגה אישי מותאם לרמתך", duration: 60, price: 180, category: "יוגה" },
    { id: "3", name: "פילאטיס מזרן", description: "אימון פילאטיס על מזרן", duration: 60, price: 150, category: "פילאטיס" },
    { id: "4", name: "אימון קבוצתי", description: "שיעור קבוצתי עד 8 משתתפים", duration: 45, price: 50, category: "קבוצתי" },
    { id: "5", name: "ייעוץ תזונה", description: "פגישת ייעוץ עם תזונאית", duration: 45, price: 250, category: "תזונה" },
  ],
  "bella-beauty": [
    { id: "1", name: "מניקור ג'ל", description: "מניקור עם לק ג'ל עמיד", duration: 60, price: 120, category: "ציפורניים" },
    { id: "2", name: "פדיקור ספא", description: "טיפול פדיקור מפנק כולל עיסוי", duration: 75, price: 150, category: "ציפורניים" },
    { id: "3", name: "טיפול פנים קלאסי", description: "ניקוי והזנה לעור הפנים", duration: 60, price: 200, category: "פנים" },
    { id: "4", name: "איפור ערב", description: "איפור מקצועי לאירועים", duration: 45, price: 250, category: "איפור" },
    { id: "5", name: "עיצוב גבות", description: "עיצוב גבות מקצועי", duration: 30, price: 80, category: "פנים" },
  ],
};

// Generate demo time slots with consistent randomness based on date
function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();

  // Saturday closed
  if (dayOfWeek === 6) return [];

  // Friday shorter hours
  const endHour = dayOfWeek === 5 ? 14 : 20;
  const startHour = 9;

  // Use date as seed for consistent availability
  const dateSeed = date.getDate() + date.getMonth() * 31;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      // Deterministic availability based on time and date
      const slotSeed = dateSeed + hour * 2 + (minute / 30);
      const available = (slotSeed % 10) > 3;
      slots.push({ time: timeStr, available });
    }
  }

  return slots;
}

// Format date for display
function formatDate(date: Date): string {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

  return `יום ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

// Generate next 14 days
function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  return days;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenant = params.tenant as string;

  // Get initial service from URL
  const initialServiceId = searchParams.get("service");

  // Get services for this tenant
  const services = demoServices[tenant] ?? demoServices["bella-beauty"] ?? [];

  // State
  const [step, setStep] = useState<Step>(initialServiceId ? "datetime" : "service");
  const [selectedService, setSelectedService] = useState<Service | null>(() => {
    if (initialServiceId && services.length > 0) {
      return services.find(s => s.id === initialServiceId) ?? null;
    }
    return null;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const categories = [...new Set(services.map(s => s.category))];

  // Get available dates and slots
  const availableDates = useMemo(() => getNextDays(14), []);
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(selectedDate);
  }, [selectedDate]);

  // Form validation
  const isDetailsValid =
    customerDetails.name.length >= 2 &&
    customerDetails.phone.length >= 9 &&
    customerDetails.email.includes("@");

  // Handlers
  const selectService = (service: Service) => {
    setSelectedService(service);
    setStep("datetime");
  };

  const selectDateTime = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store booking data and redirect to confirmation
    const bookingData = {
      service: selectedService,
      date: selectedDate.toISOString(),
      time: selectedTime,
      customer: customerDetails,
      tenant,
    };

    localStorage.setItem("lastBooking", JSON.stringify(bookingData));
    router.push(`/${tenant}/book/confirmed`);
  };

  // Step indicator
  const steps = [
    { id: "service", label: "שירות" },
    { id: "datetime", label: "תאריך ושעה" },
    { id: "details", label: "פרטים" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl px-4 h-14 flex items-center">
          <Link
            href={step === "service" ? `/${tenant}` : "#"}
            onClick={(e) => {
              if (step !== "service") {
                e.preventDefault();
                const prevStep = steps[currentStepIndex - 1];
                if (prevStep) setStep(prevStep.id as Step);
              }
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowRight className="h-5 w-5" />
            <span>חזרה</span>
          </Link>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      i < currentStepIndex
                        ? "bg-violet-500 text-white"
                        : i === currentStepIndex
                        ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 ring-2 ring-violet-500"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-400"
                    }`}
                  >
                    {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 ${i <= currentStepIndex ? "text-gray-900 dark:text-white font-medium" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 ${i < currentStepIndex ? "bg-violet-500" : "bg-gray-200 dark:bg-slate-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-2xl px-4 py-6">

        {/* Step 1: Select Service */}
        {step === "service" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">בחר שירות</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">איזה טיפול תרצה להזמין?</p>
            </div>

            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{category}</h3>
                <div className="space-y-3">
                  {services
                    .filter(s => s.category === category)
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => selectService(service)}
                        className="w-full text-right p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration} דקות</span>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900 dark:text-white">₪{service.price}</p>
                            <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:text-violet-500 mt-2 transition-colors" />
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === "datetime" && selectedService && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">בחר תאריך ושעה</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {selectedService.name} • {selectedService.duration} דקות
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                תאריך
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isSaturday = date.getDay() === 6;
                  const dayNames = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => !isSaturday && setSelectedDate(date)}
                      disabled={isSaturday}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        isSaturday
                          ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-violet-500 text-white shadow-lg"
                          : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-violet-300"
                      }`}
                    >
                      <div className="text-xs font-medium">{dayNames[date.getDay()]}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-violet-500" />
                  שעה
                </h3>

                {timeSlots.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    אין תורים פנויים בתאריך זה
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && selectDateTime(selectedDate, slot.time)}
                        disabled={!slot.available}
                        className={`py-3 rounded-lg text-sm font-medium transition-all ${
                          !slot.available
                            ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through"
                            : selectedTime === slot.time
                            ? "bg-violet-500 text-white shadow-lg"
                            : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-violet-300 text-gray-900 dark:text-white"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === "details" && selectedService && selectedDate && selectedTime && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">פרטי הזמנה</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">מלא את הפרטים שלך</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedService.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedDate)} בשעה {selectedTime}
                  </p>
                </div>
                <p className="font-bold text-lg text-violet-600">₪{selectedService.price}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4" />
                  שם מלא
                </label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="h-4 w-4" />
                  טלפון
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="050-1234567"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="h-4 w-4" />
                  אימייל
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  הערות (אופציונלי)
                </label>
                <textarea
                  value={customerDetails.notes}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="משהו שחשוב לנו לדעת?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all resize-none"
                />
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
              <Shield className="h-5 w-5 flex-shrink-0 text-emerald-500" />
              <p>
                הפרטים שלך מאובטחים ומשמשים רק לצורך ניהול התור. לא נשתף את המידע עם צדדים שלישיים.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      {step === "details" && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <div className="container mx-auto max-w-2xl">
            <button
              onClick={handleSubmit}
              disabled={!isDetailsValid || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  מאשר הזמנה...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  אישור הזמנה
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
