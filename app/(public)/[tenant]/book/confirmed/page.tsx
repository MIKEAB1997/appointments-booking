"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  Clock,
  Bell,
  Share2,
  Download,
  Home
} from "lucide-react";

interface BookingData {
  service: {
    name: string;
    duration: number;
    price: number;
  };
  date: string;
  time: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  tenant: string;
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

  return `יום ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Business names map
const businessNames: Record<string, string> = {
  "studio-fit": "Studio Fit",
  "bella-beauty": "Bella Beauty",
};

export default function BookingConfirmedPage() {
  const params = useParams();
  const tenant = params.tenant as string;
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Get booking data from localStorage
    const storedBooking = localStorage.getItem("lastBooking");
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking));
    }

    // Hide animation after a delay
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const businessName = businessNames[tenant] ?? tenant;
  const confirmationNumber = `NG${Date.now().toString().slice(-6)}`;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">לא נמצאה הזמנה</p>
          <Link
            href={`/${tenant}`}
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            חזרה לעמוד העסק
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <div className="text-center animate-bounce-slow">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200/50">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <p className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">התור הוזמן בהצלחה!</p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-lg px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            התור הוזמן בהצלחה!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            מספר אישור: <span className="font-mono font-semibold">{confirmationNumber}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">פרטי התור</h2>

          <div className="space-y-4">
            {/* Service */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{booking.service.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ב-{businessName}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.date)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">בשעה {booking.time} • {booking.service.duration} דקות</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600 dark:text-gray-400">סה״כ לתשלום</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₪{booking.service.price}</span>
            </div>
          </div>
        </div>

        {/* Reminder Card */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Bell className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">תזכורת תישלח אליך</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              נשלח לך הודעה ל-{booking.customer.email} יום לפני התור
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="h-5 w-5" />
            שמור ליומן
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Share2 className="h-5 w-5" />
            שתף
          </button>
        </div>

        {/* Back to Business */}
        <Link
          href={`/${tenant}`}
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Home className="h-5 w-5" />
          חזרה לעמוד העסק
        </Link>

        {/* Cancellation Notice */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          ניתן לבטל או לשנות את התור עד 24 שעות לפני המועד.
          <br />
          <Link href={`/${tenant}/profile`} className="text-violet-600 hover:text-violet-700">
            ניהול התורים שלי
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
