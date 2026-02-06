"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Clock,
  Scissors,
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  Check,
  Loader2,
  Sparkles,
  Plus,
  Trash2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Types
type BusinessVertical = "beauty" | "fitness";
type Step = 1 | 2 | 3 | 4 | 5;

interface WorkingHour {
  day: string;
  dayHe: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface BusinessData {
  // Step 1 - Basic Info
  name: string;
  vertical: BusinessVertical | "";
  description: string;

  // Step 2 - Contact
  email: string;
  phone: string;
  address: string;
  city: string;

  // Step 3 - Working Hours
  workingHours: WorkingHour[];

  // Step 4 - Services
  services: Service[];
}

const defaultWorkingHours: WorkingHour[] = [
  { day: "sunday", dayHe: "ראשון", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "monday", dayHe: "שני", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "tuesday", dayHe: "שלישי", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "wednesday", dayHe: "רביעי", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "thursday", dayHe: "חמישי", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "friday", dayHe: "שישי", isOpen: true, openTime: "09:00", closeTime: "14:00" },
  { day: "saturday", dayHe: "שבת", isOpen: false, openTime: "10:00", closeTime: "14:00" },
];

const beautyServices = [
  { name: "תספורת נשים", duration: 60, price: 150 },
  { name: "תספורת גברים", duration: 30, price: 80 },
  { name: "צבע שיער", duration: 120, price: 350 },
  { name: "מניקור", duration: 45, price: 100 },
  { name: "פדיקור", duration: 60, price: 120 },
  { name: "טיפול פנים", duration: 60, price: 200 },
  { name: "איפור", duration: 45, price: 180 },
  { name: "עיצוב גבות", duration: 20, price: 50 },
];

const fitnessServices = [
  { name: "אימון אישי", duration: 60, price: 200 },
  { name: "יוגה פרטי", duration: 60, price: 180 },
  { name: "פילאטיס פרטי", duration: 60, price: 180 },
  { name: "אימון קבוצתי", duration: 45, price: 50 },
  { name: "ייעוץ תזונה", duration: 45, price: 250 },
  { name: "עיסוי ספורט", duration: 60, price: 300 },
  { name: "אימון HIIT", duration: 45, price: 80 },
  { name: "אימון קרוספיט", duration: 60, price: 100 },
];

const cities = [
  "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "פתח תקווה",
  "אשדוד", "נתניה", "באר שבע", "בני ברק", "רמת גן",
  "הרצליה", "רעננה", "כפר סבא", "חולון", "גבעתיים",
];

export default function BusinessSignupPage() {
  const { signIn, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    vertical: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    workingHours: defaultWorkingHours,
    services: [],
  });

  // Step validation
  const isStep1Valid = businessData.name.length >= 2 && businessData.vertical !== "";
  const isStep2Valid = businessData.email.includes("@") && businessData.phone.length >= 9 && businessData.city !== "";
  const isStep3Valid = businessData.workingHours.some(h => h.isOpen);
  const isStep4Valid = businessData.services.length >= 1;

  // Update business data
  const updateField = <K extends keyof BusinessData>(field: K, value: BusinessData[K]) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
  };

  // Working hours handlers
  const toggleDay = (index: number) => {
    const newHours = [...businessData.workingHours];
    const current = newHours[index];
    if (current) {
      newHours[index] = { ...current, isOpen: !current.isOpen };
      updateField("workingHours", newHours);
    }
  };

  const updateHour = (index: number, field: "openTime" | "closeTime", value: string) => {
    const newHours = [...businessData.workingHours];
    const current = newHours[index];
    if (current) {
      newHours[index] = { ...current, [field]: value };
      updateField("workingHours", newHours);
    }
  };

  // Service handlers
  const addService = (service: { name: string; duration: number; price: number }) => {
    const newService: Service = {
      id: Date.now().toString(),
      ...service,
      description: "",
    };
    updateField("services", [...businessData.services, newService]);
  };

  const removeService = (id: string) => {
    updateField("services", businessData.services.filter(s => s.id !== id));
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    updateField("services", businessData.services.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Navigation
  const nextStep = () => {
    if (step < 5) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  // Submit
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Store business data in localStorage for after auth
      localStorage.setItem("pendingBusinessSetup", JSON.stringify(businessData));
      localStorage.setItem("pendingBusinessOwner", "true");

      // Send magic link
      const result = await signIn(businessData.email);

      if (!result.success) {
        setError(result.error ?? "שגיאה בשליחת הקוד");
        setIsLoading(false);
        return;
      }

      // Move to success step
      setStep(5);
    } catch {
      setError("שגיאה בלתי צפויה. נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    localStorage.setItem("pendingBusinessSetup", JSON.stringify(businessData));
    localStorage.setItem("pendingBusinessOwner", "true");

    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error ?? "שגיאה בהרשמה עם Google");
      setIsLoading(false);
    }
  };

  // Step indicator
  const steps = [
    { num: 1, label: "פרטי העסק" },
    { num: 2, label: "פרטי קשר" },
    { num: 3, label: "שעות פעילות" },
    { num: 4, label: "שירותים" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth/business" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
            <ArrowRight className="h-4 w-4" />
            חזרה
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            פתיחת עסק חדש
          </h1>
          <p className="text-gray-600 mt-2">הגדר את העסק שלך ב-4 שלבים פשוטים</p>
        </div>

        {/* Progress Steps */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 px-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s.num
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1 ${step >= s.num ? "text-violet-600 font-medium" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${step > s.num ? "bg-violet-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50">

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">פרטי העסק</h2>

              {/* Business Type Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">סוג העסק</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("vertical", "beauty")}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      businessData.vertical === "beauty"
                        ? "border-rose-500 bg-rose-50 shadow-lg"
                        : "border-gray-200 hover:border-rose-300 hover:bg-rose-50/50"
                    }`}
                  >
                    <Scissors className={`h-8 w-8 mx-auto mb-2 ${businessData.vertical === "beauty" ? "text-rose-500" : "text-gray-400"}`} />
                    <p className={`font-semibold ${businessData.vertical === "beauty" ? "text-rose-700" : "text-gray-600"}`}>ביוטי</p>
                    <p className="text-xs text-gray-500 mt-1">מספרות, ציפורניים, ספא</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("vertical", "fitness")}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      businessData.vertical === "fitness"
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <Dumbbell className={`h-8 w-8 mx-auto mb-2 ${businessData.vertical === "fitness" ? "text-blue-500" : "text-gray-400"}`} />
                    <p className={`font-semibold ${businessData.vertical === "fitness" ? "text-blue-700" : "text-gray-600"}`}>כושר</p>
                    <p className="text-xs text-gray-500 mt-1">חדר כושר, יוגה, פילאטיס</p>
                  </button>
                </div>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700">
                  שם העסק
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="לדוגמה: סטודיו פיט"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                  תיאור קצר (אופציונלי)
                </label>
                <textarea
                  id="description"
                  value={businessData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="ספר על העסק שלך בכמה מילים..."
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">פרטי קשר</h2>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  <Mail className="inline h-4 w-4 ml-1" />
                  אימייל
                </label>
                <input
                  id="email"
                  type="email"
                  value={businessData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  dir="ltr"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  <Phone className="inline h-4 w-4 ml-1" />
                  טלפון
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={businessData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="050-1234567"
                  dir="ltr"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline h-4 w-4 ml-1" />
                  עיר
                </label>
                <select
                  id="city"
                  value={businessData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all bg-white"
                >
                  <option value="">בחר עיר</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                  כתובת (אופציונלי)
                </label>
                <input
                  id="address"
                  type="text"
                  value={businessData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="רחוב, מספר בית"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 3: Working Hours */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">שעות פעילות</h2>
              <p className="text-gray-500 text-sm mb-6">הגדר את ימי ושעות הפעילות של העסק</p>

              <div className="space-y-3">
                {businessData.workingHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    {/* Day toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDay(index)}
                      className={`w-20 py-2 rounded-lg font-medium text-sm transition-all ${
                        hour.isOpen
                          ? "bg-violet-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {hour.dayHe}
                    </button>

                    {/* Time inputs */}
                    {hour.isOpen ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) => updateHour(index, "openTime", e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <span className="text-gray-400">עד</span>
                        <input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => updateHour(index, "closeTime", e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">סגור</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Services */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">שירותים</h2>
              <p className="text-gray-500 text-sm mb-6">בחר את השירותים שהעסק שלך מציע</p>

              {/* Quick add suggestions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">הוסף שירותים מומלצים:</p>
                <div className="flex flex-wrap gap-2">
                  {(businessData.vertical === "beauty" ? beautyServices : fitnessServices)
                    .filter(s => !businessData.services.some(existing => existing.name === s.name))
                    .slice(0, 6)
                    .map((service) => (
                      <button
                        key={service.name}
                        type="button"
                        onClick={() => addService(service)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-violet-100 text-gray-600 hover:text-violet-600 text-sm transition-all"
                      >
                        <Plus className="h-3 w-3" />
                        {service.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Selected services */}
              {businessData.services.length > 0 && (
                <div className="space-y-3 mt-6">
                  <p className="text-sm font-medium text-gray-600">השירותים שלך:</p>
                  {businessData.services.map((service) => (
                    <div key={service.id} className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, "name", e.target.value)}
                            className="w-full font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none pb-1"
                          />
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <input
                                type="number"
                                value={service.duration}
                                onChange={(e) => updateService(service.id, "duration", parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded border border-gray-200 text-sm text-center"
                              />
                              <span className="text-sm text-gray-500">דקות</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">₪</span>
                              <input
                                type="number"
                                value={service.price}
                                onChange={(e) => updateService(service.id, "price", parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 rounded border border-gray-200 text-sm text-center"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(service.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add custom service */}
              <button
                type="button"
                onClick={() => addService({ name: "שירות חדש", duration: 60, price: 100 })}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                הוסף שירות מותאם אישית
              </button>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 mb-6">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">כמעט סיימנו!</h2>
              <p className="text-gray-600 mb-6">
                שלחנו קישור לאימות ל-<strong>{businessData.email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                לחץ על הקישור במייל כדי להשלים את פתיחת העסק
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  step === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ArrowRight className="h-5 w-5" />
                הקודם
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 2 && !isStep2Valid) ||
                    (step === 3 && !isStep3Valid)
                  }
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  הבא
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading || !isStep4Valid}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isStep4Valid}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        סיום והרשמה
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
