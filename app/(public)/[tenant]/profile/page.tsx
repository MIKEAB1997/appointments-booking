"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Trophy,
  Flame,
  Gift,
  Calendar,
  Clock,
  ChevronLeft,
  Award,
  TrendingUp,
  Sparkles,
  Crown,
  Zap,
  Heart,
  Target,
  Medal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Edit3,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { PublicLayout } from "@/components/layouts/public-layout";
import { useAuth } from "@/hooks/use-auth";

// Tier definitions with Waze-like progression
const TIERS = [
  { name: "מתחיל", nameEn: "Starter", minPoints: 0, color: "gray", icon: Star },
  { name: "חבר", nameEn: "Member", minPoints: 100, color: "emerald", icon: Award },
  { name: "VIP", nameEn: "VIP", minPoints: 500, color: "amber", icon: Crown },
  { name: "פלטינום", nameEn: "Platinum", minPoints: 1500, color: "violet", icon: Sparkles },
  { name: "אלופים", nameEn: "Champion", minPoints: 5000, color: "rose", icon: Trophy },
];

// Achievement badges
const ACHIEVEMENTS = [
  { id: "first_booking", name: "הזמנה ראשונה", icon: Calendar, color: "emerald", description: "ביצעת את ההזמנה הראשונה שלך" },
  { id: "loyal_5", name: "לקוח נאמן", icon: Heart, color: "rose", description: "5 ביקורים באותו עסק" },
  { id: "streak_3", name: "סטריק של 3", icon: Flame, color: "orange", description: "3 שבועות רצופים עם תורים" },
  { id: "early_bird", name: "ציפור מוקדמת", icon: Zap, color: "amber", description: "הזמנת תור לפני 9:00 בבוקר" },
  { id: "reviewer", name: "מבקר מקצועי", icon: Star, color: "blue", description: "כתבת 5 ביקורות" },
  { id: "referral", name: "שגריר", icon: Gift, color: "violet", description: "הזמנת חבר שביצע הזמנה" },
  { id: "perfect_10", name: "מושלם!", icon: Target, color: "teal", description: "10 תורים ללא ביטול" },
  { id: "vip_unlock", name: "VIP", icon: Crown, color: "amber", description: "הגעת לדרגת VIP" },
];

// Demo user data
const DEMO_USER = {
  id: "user_1",
  name: "ישראל ישראלי",
  email: "israel@example.com",
  phone: "050-1234567",
  avatarUrl: null,
  points: 720,
  totalVisits: 15,
  streak: 3,
  tier: "VIP",
  joinedAt: "2024-06-15",
  achievements: ["first_booking", "loyal_5", "streak_3", "early_bird"],
  bookings: [
    { id: "1", service: "תספורת גברים", date: "2025-02-10", time: "10:00", status: "upcoming", price: 80 },
    { id: "2", service: "צביעת שיער", date: "2025-02-03", time: "14:30", status: "completed", price: 250 },
    { id: "3", service: "תספורת גברים", date: "2025-01-27", time: "11:00", status: "completed", price: 80 },
    { id: "4", service: "טיפול פנים", date: "2025-01-15", time: "16:00", status: "cancelled", price: 180 },
    { id: "5", service: "תספורת גברים", date: "2025-01-08", time: "09:30", status: "completed", price: 80 },
  ],
};

function getTierInfo(points: number) {
  let currentTier = TIERS[0];
  let nextTier: typeof TIERS[0] | null = TIERS[1];

  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) {
      currentTier = TIERS[i];
      nextTier = TIERS[i + 1] || null;
      break;
    }
  }

  const pointsToNext = nextTier ? nextTier.minPoints - points : 0;
  const progressPercent = nextTier
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return { currentTier, nextTier, pointsToNext, progressPercent };
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    upcoming: { label: "קרוב", color: "bg-blue-100 text-blue-700", icon: Clock },
    completed: { label: "הושלם", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    cancelled: { label: "בוטל", color: "bg-gray-100 text-gray-500", icon: XCircle },
    pending: { label: "ממתין", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  }[status] || { label: status, color: "bg-gray-100 text-gray-700", icon: AlertCircle };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

/**
 * Customer Profile Page - Responsive Desktop & Mobile
 * Route: /{tenant}/profile
 * Shows: Points, tier, achievements, booking history (Waze-like gamification)
 */
export default function CustomerProfilePage() {
  const params = useParams();
  const tenant = params.tenant as string;
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "achievements">("overview");

  // Use demo data for now
  const userData = DEMO_USER;
  const tierInfo = getTierInfo(userData.points);

  const getTierColor = (colorName: string) => {
    const colors: Record<string, string> = {
      gray: "from-gray-400 to-gray-500",
      emerald: "from-emerald-400 to-emerald-600",
      amber: "from-amber-400 to-amber-600",
      violet: "from-violet-400 to-violet-600",
      rose: "from-rose-400 to-rose-600",
    };
    return colors[colorName] || colors.gray;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Sidebar - Profile Card */}
              <div className="col-span-4 xl:col-span-3">
                <div className="sticky top-8 space-y-6">
                  {/* Profile Card */}
                  <div className={`bg-gradient-to-br ${getTierColor(tierInfo.currentTier.color)} rounded-3xl p-6 text-white shadow-xl`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        {userData.avatarUrl ? (
                          <img src={userData.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="text-4xl font-bold">{userData.name.charAt(0)}</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold">{userData.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <tierInfo.currentTier.icon className="h-5 w-5" />
                        <span className="font-medium">{tierInfo.currentTier.name}</span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-6 w-6" />
                        <span className="text-4xl font-bold">{userData.points}</span>
                      </div>
                      <span className="text-white/80">נקודות</span>
                    </div>

                    {/* Progress to next tier */}
                    {tierInfo.nextTier && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-white/80 mb-2">
                          <span>{tierInfo.currentTier.name}</span>
                          <span>{tierInfo.nextTier.name}</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${tierInfo.progressPercent}%` }}
                          />
                        </div>
                        <p className="text-sm text-white/80 mt-2 text-center">
                          עוד {tierInfo.pointsToNext} נקודות
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                          <Calendar className="h-5 w-5" />
                          <span className="text-2xl font-bold">{userData.totalVisits}</span>
                        </div>
                        <span className="text-xs text-gray-500">ביקורים</span>
                      </div>
                      <div className="text-center border-x border-gray-100">
                        <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                          <Flame className="h-5 w-5" />
                          <span className="text-2xl font-bold">{userData.streak}</span>
                        </div>
                        <span className="text-xs text-gray-500">סטריק</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-violet-600 mb-1">
                          <Medal className="h-5 w-5" />
                          <span className="text-2xl font-bold">{userData.achievements.length}</span>
                        </div>
                        <span className="text-xs text-gray-500">הישגים</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 p-3 rounded-xl text-gray-600">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-sm truncate">{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl text-gray-600">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm" dir="ltr">{userData.phone}</span>
                      </div>
                      <hr className="my-2" />
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                        <Edit3 className="h-5 w-5 text-gray-400" />
                        <span>עריכת פרטים</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <span>הגדרות</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>התנתק</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-8 xl:col-span-9">
                {/* Back Link */}
                <Link href={`/${tenant}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
                  <ChevronLeft className="h-5 w-5" />
                  חזרה לעסק
                </Link>

                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm mb-6 w-fit">
                  {[
                    { id: "overview", label: "סקירה", icon: TrendingUp },
                    { id: "bookings", label: "תורים", icon: Calendar },
                    { id: "achievements", label: "הישגים", icon: Trophy },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === "overview" && (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Streak Banner */}
                      {userData.streak >= 2 && (
                        <div className="col-span-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 text-white">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                              <Flame className="h-9 w-9" />
                            </div>
                            <div>
                              <h3 className="font-bold text-2xl">{userData.streak} שבועות רצופים!</h3>
                              <p className="text-white/80">המשך כך לקבל בונוס נקודות</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recent Achievements */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-gray-800 text-lg">הישגים אחרונים</h3>
                          <button onClick={() => setActiveTab("achievements")} className="text-sm text-amber-600 font-medium">
                            הצג הכל
                          </button>
                        </div>
                        <div className="flex gap-4">
                          {userData.achievements.slice(0, 4).map((achievementId) => {
                            const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
                            if (!achievement) return null;
                            return (
                              <div key={achievementId} className="flex-1 text-center">
                                <div className={`w-14 h-14 mx-auto rounded-2xl bg-${achievement.color}-100 flex items-center justify-center mb-2`}>
                                  <achievement.icon className={`h-7 w-7 text-${achievement.color}-600`} />
                                </div>
                                <span className="text-xs text-gray-600">{achievement.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Upcoming Booking */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">התור הקרוב</h3>
                        {userData.bookings.filter(b => b.status === "upcoming").slice(0, 1).map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-7 w-7 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{booking.service}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.date).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
                                {" · "}
                                {booking.time}
                              </p>
                            </div>
                            <span className="text-xl font-bold text-gray-800">₪{booking.price}</span>
                          </div>
                        ))}
                        {userData.bookings.filter(b => b.status === "upcoming").length === 0 && (
                          <div className="text-center py-6 text-gray-500">
                            <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                            <p>אין תורים קרובים</p>
                          </div>
                        )}
                      </div>

                      {/* Points Guide */}
                      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">איך צוברים נקודות?</h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium block">הזמנת תור</span>
                              <span className="text-emerald-600 font-bold">+10 נקודות</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Star className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium block">כתיבת ביקורת</span>
                              <span className="text-amber-600 font-bold">+25 נקודות</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                              <Gift className="h-6 w-6 text-violet-600" />
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium block">הזמנת חבר</span>
                              <span className="text-violet-600 font-bold">+100 נקודות</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                              <Flame className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium block">סטריק שבועי</span>
                              <span className="text-orange-600 font-bold">×2 נקודות</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "bookings" && (
                    <div className="bg-white rounded-2xl shadow-sm">
                      {userData.bookings.length === 0 ? (
                        <div className="p-12 text-center">
                          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">אין תורים עדיין</p>
                          <Link
                            href={`/${tenant}/book`}
                            className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl"
                          >
                            הזמן תור
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {userData.bookings.map((booking) => (
                            <div key={booking.id} className="p-5 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                booking.status === "upcoming" ? "bg-blue-100" :
                                booking.status === "completed" ? "bg-emerald-100" : "bg-gray-100"
                              }`}>
                                <Calendar className={`h-7 w-7 ${
                                  booking.status === "upcoming" ? "text-blue-600" :
                                  booking.status === "completed" ? "text-emerald-600" : "text-gray-400"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-lg">{booking.service}</h4>
                                <p className="text-gray-500">
                                  {new Date(booking.date).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
                                  {" · "}
                                  {booking.time}
                                </p>
                              </div>
                              <div className="text-left">
                                <span className="text-2xl font-bold text-gray-800">₪{booking.price}</span>
                                <div className="mt-2">
                                  <StatusBadge status={booking.status} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "achievements" && (
                    <div className="grid grid-cols-4 gap-4">
                      {ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = userData.achievements.includes(achievement.id);
                        return (
                          <div
                            key={achievement.id}
                            className={`p-6 rounded-2xl text-center transition-all ${
                              isUnlocked ? "bg-white shadow-sm" : "bg-gray-100 opacity-60"
                            }`}
                          >
                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                              isUnlocked ? `bg-${achievement.color}-100` : "bg-gray-200"
                            }`}>
                              <achievement.icon className={`h-8 w-8 ${
                                isUnlocked ? `text-${achievement.color}-600` : "text-gray-400"
                              }`} />
                            </div>
                            <h4 className={`font-semibold ${isUnlocked ? "text-gray-800" : "text-gray-500"}`}>
                              {achievement.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                            {isUnlocked && (
                              <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">
                                <CheckCircle className="h-4 w-4 inline mr-1" />
                                הושג!
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden pb-20">
          {/* Header */}
          <div className={`bg-gradient-to-br ${getTierColor(tierInfo.currentTier.color)} text-white pt-8 pb-24 px-4`}>
            <div className="max-w-lg mx-auto">
              {/* Top bar */}
              <div className="flex justify-between items-center mb-6">
                <Link href={`/${tenant}`} className="p-2 -mr-2 hover:bg-white/20 rounded-xl transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-lg font-bold">הפרופיל שלי</h1>
                <button className="p-2 -ml-2 hover:bg-white/20 rounded-xl transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              {/* Profile info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {userData.avatarUrl ? (
                    <img src={userData.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <span className="text-3xl font-bold">{userData.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <tierInfo.currentTier.icon className="h-5 w-5" />
                    <span className="font-medium">{tierInfo.currentTier.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card - overlapping header */}
          <div className="px-4 -mt-16">
            <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-6">
              {/* Points & Tier */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 text-amber-500" />
                  <span className="text-4xl font-bold text-gray-800">{userData.points}</span>
                  <span className="text-lg text-gray-500">נקודות</span>
                </div>

                {tierInfo.nextTier && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{tierInfo.currentTier.name}</span>
                      <span>{tierInfo.nextTier.name}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getTierColor(tierInfo.currentTier.color)} rounded-full transition-all duration-500`}
                        style={{ width: `${tierInfo.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      עוד <strong className="text-gray-700">{tierInfo.pointsToNext}</strong> נקודות לדרגה הבאה
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                    <Calendar className="h-5 w-5" />
                    <span className="text-2xl font-bold">{userData.totalVisits}</span>
                  </div>
                  <span className="text-xs text-gray-500">ביקורים</span>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                    <Flame className="h-5 w-5" />
                    <span className="text-2xl font-bold">{userData.streak}</span>
                  </div>
                  <span className="text-xs text-gray-500">שבועות רצופים</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-violet-600 mb-1">
                    <Medal className="h-5 w-5" />
                    <span className="text-2xl font-bold">{userData.achievements.length}</span>
                  </div>
                  <span className="text-xs text-gray-500">הישגים</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 mt-6">
            <div className="max-w-lg mx-auto">
              <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm">
                {[
                  { id: "overview", label: "סקירה", icon: TrendingUp },
                  { id: "bookings", label: "תורים", icon: Calendar },
                  { id: "achievements", label: "הישגים", icon: Trophy },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Tab Content */}
          <div className="px-4 mt-6">
            <div className="max-w-lg mx-auto space-y-4">
              {activeTab === "overview" && (
                <>
                  {/* Streak Banner */}
                  {userData.streak >= 2 && (
                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                          <Flame className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{userData.streak} שבועות רצופים!</h3>
                          <p className="text-white/80 text-sm">המשך כך לקבל בונוס נקודות</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Achievements */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">הישגים אחרונים</h3>
                      <button onClick={() => setActiveTab("achievements")} className="text-sm text-amber-600 font-medium">
                        הצג הכל
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {userData.achievements.slice(0, 4).map((achievementId) => {
                        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
                        if (!achievement) return null;
                        return (
                          <div key={achievementId} className="flex-shrink-0 w-16 text-center">
                            <div className={`w-14 h-14 mx-auto rounded-2xl bg-${achievement.color}-100 flex items-center justify-center mb-1`}>
                              <achievement.icon className={`h-7 w-7 text-${achievement.color}-600`} />
                            </div>
                            <span className="text-xs text-gray-600 line-clamp-2">{achievement.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Points Guide */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">איך צוברים נקודות?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">הזמנת תור</span>
                        </div>
                        <span className="text-emerald-600 font-bold">+10 נקודות</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Star className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">כתיבת ביקורת</span>
                        </div>
                        <span className="text-amber-600 font-bold">+25 נקודות</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">הזמנת חבר</span>
                        </div>
                        <span className="text-violet-600 font-bold">+100 נקודות</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "bookings" && (
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                  {userData.bookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">אין תורים עדיין</p>
                      <Link
                        href={`/${tenant}/book`}
                        className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl"
                      >
                        הזמן תור
                      </Link>
                    </div>
                  ) : (
                    userData.bookings.map((booking) => (
                      <div key={booking.id} className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          booking.status === "upcoming" ? "bg-blue-100" :
                          booking.status === "completed" ? "bg-emerald-100" : "bg-gray-100"
                        }`}>
                          <Calendar className={`h-6 w-6 ${
                            booking.status === "upcoming" ? "text-blue-600" :
                            booking.status === "completed" ? "text-emerald-600" : "text-gray-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{booking.service}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString("he-IL", { day: "numeric", month: "short" })}
                            {" · "}
                            {booking.time}
                          </p>
                        </div>
                        <div className="text-left">
                          <span className="text-lg font-bold text-gray-800">₪{booking.price}</span>
                          <div className="mt-1">
                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="grid grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = userData.achievements.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-2xl text-center transition-all ${
                          isUnlocked ? "bg-white shadow-sm" : "bg-gray-100 opacity-60"
                        }`}
                      >
                        <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-2 ${
                          isUnlocked ? `bg-${achievement.color}-100` : "bg-gray-200"
                        }`}>
                          <achievement.icon className={`h-7 w-7 ${
                            isUnlocked ? `text-${achievement.color}-600` : "text-gray-400"
                          }`} />
                        </div>
                        <h4 className={`font-semibold text-sm ${isUnlocked ? "text-gray-800" : "text-gray-500"}`}>
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                        {isUnlocked && (
                          <span className="inline-block mt-2 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            הושג!
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Account Actions - Mobile */}
              <div className="bg-white rounded-2xl shadow-sm p-4 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl text-gray-600">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl text-gray-600">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span dir="ltr">{userData.phone}</span>
                  </div>
                  <hr className="my-2" />
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                    <Edit3 className="h-5 w-5 text-gray-400" />
                    <span>עריכת פרטים</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>התנתק</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
