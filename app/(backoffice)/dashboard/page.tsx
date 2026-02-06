"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Phone,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from "lucide-react";

// Demo data - In production comes from Supabase
const todayBookings = [
  {
    id: "1",
    time: "09:00",
    endTime: "10:00",
    customer: "שרה כהן",
    phone: "050-1234567",
    service: "מניקור ג'ל",
    status: "confirmed" as const,
    price: 120,
  },
  {
    id: "2",
    time: "10:30",
    endTime: "11:30",
    customer: "דנה לוי",
    phone: "052-9876543",
    service: "פדיקור ספא",
    status: "confirmed" as const,
    price: 150,
  },
  {
    id: "3",
    time: "12:00",
    endTime: "13:00",
    customer: "מיכל אברהם",
    phone: "054-5551234",
    service: "טיפול פנים",
    status: "pending" as const,
    price: 200,
  },
  {
    id: "4",
    time: "14:00",
    endTime: "14:45",
    customer: "רונית שמש",
    phone: "050-7778899",
    service: "איפור ערב",
    status: "confirmed" as const,
    price: 250,
  },
  {
    id: "5",
    time: "15:30",
    endTime: "16:00",
    customer: "יעל דוד",
    phone: "053-1112233",
    service: "עיצוב גבות",
    status: "cancelled" as const,
    price: 80,
  },
];

const stats = {
  todayBookings: 5,
  todayRevenue: 720,
  weeklyBookings: 28,
  weeklyRevenue: 4250,
  newClients: 3,
  returningRate: 78,
};

const actionCards = [
  {
    id: "1",
    type: "reminder",
    title: "3 לקוחות לא אישרו",
    description: "שלח תזכורת ללקוחות שלא אישרו את התור",
    action: "שלח תזכורת",
    icon: AlertCircle,
    color: "amber",
  },
  {
    id: "2",
    type: "gap",
    title: "פער ביומן מחר",
    description: "יש לך 2 שעות פנויות ב-14:00-16:00",
    action: "פרסם הנחה",
    icon: Clock,
    color: "blue",
  },
  {
    id: "3",
    type: "atrisk",
    title: "5 לקוחות בסיכון",
    description: "לא הגיעו מעל 60 יום",
    action: "צפה ברשימה",
    icon: Users,
    color: "rose",
  },
];

const statusColors = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels = {
  confirmed: "מאושר",
  pending: "ממתין",
  cancelled: "בוטל",
};

export default function DashboardPage() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Get current time for timeline indicator
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Format today's date
  const today = new Date();
  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  const formattedDate = `יום ${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">שלום! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          צפה ביומן
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-violet-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayBookings}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">תורים היום</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₪{stats.todayRevenue}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">הכנסות היום</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +3
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newClients}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">לקוחות חדשים</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-rose-600 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" />
              -2%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.returningRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">לקוחות חוזרים</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">לוח זמנים - היום</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {todayBookings.filter(b => b.status !== "cancelled").length} תורים
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {todayBookings.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${
                  booking.status === "cancelled" ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Time */}
                  <div className="text-center w-16 flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white">{booking.time}</p>
                    <p className="text-xs text-gray-400">{booking.endTime}</p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {booking.customer}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.service}</p>
                  </div>

                  {/* Price & Actions */}
                  <div className="text-left flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white">₪{booking.price}</p>
                    <div className="flex gap-1 mt-2">
                      <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Booking */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800">
            <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-700 dark:hover:text-violet-400 transition-colors font-medium">
              + הוסף תור חדש
            </button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white">פעולות מומלצות</h2>

          {actionCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = {
              amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
              blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
              rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-600",
            };

            return (
              <div
                key={card.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">{card.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{card.description}</p>
                    <button className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
                      {card.action}
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-4">סיכום שבועי</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-violet-100">תורים</span>
                <span className="font-bold">{stats.weeklyBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-violet-100">הכנסות</span>
                <span className="font-bold">₪{stats.weeklyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-violet-100">ממוצע לתור</span>
                <span className="font-bold">₪{Math.round(stats.weeklyRevenue / stats.weeklyBookings)}</span>
              </div>
            </div>
            <Link
              href="/reports"
              className="mt-4 block text-center py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
            >
              צפה בדוחות מלאים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
