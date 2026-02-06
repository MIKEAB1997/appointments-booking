"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Building2, TrendingUp, Calendar, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Business Owner Auth Page
 * Route: /auth/business
 * Shows: Business owner login/registration with Google OAuth + Email
 */
export default function BusinessAuthPage() {
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mark as business registration
    localStorage.setItem("pendingBusinessOwner", "true");

    const result = await signIn(email);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error ?? "שגיאה בשליחת הקוד. נסה שוב.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    // Mark as business registration
    localStorage.setItem("pendingBusinessOwner", "true");

    const result = await signInWithGoogle();

    if (!result.success) {
      setIsGoogleLoading(false);
      setError(result.error ?? "שגיאה בהתחברות עם Google. נסה שוב.");
    }
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            בדוק את האימייל שלך
          </h1>
          <p className="text-gray-600 text-lg">
            שלחנו קישור להתחברות ל-<strong className="text-gray-800">{email}</strong>
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-violet-100">
            <p className="text-sm text-gray-500">
              לא קיבלת? בדוק בתיקיית הספאם או{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2"
              >
                נסה שוב
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-white rounded-full" />
        </div>

        <div className="relative max-w-lg text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              הצמיחו את העסק שלכם עם NextGen
            </h2>
            <p className="text-xl text-white/80">
              פלטפורמת הזמנת התורים המתקדמת בישראל
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">יומן חכם</h3>
                <p className="text-white/70">ניהול תורים אוטומטי עם תזכורות ללקוחות</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">ניהול לקוחות</h3>
                <p className="text-white/70">כרטיס לקוח עם היסטוריה והעדפות</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">דוחות וניתוחים</h3>
                <p className="text-white/70">נתונים בזמן אמת על ביצועי העסק</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-sm font-bold text-amber-900">מ</div>
                <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-sm font-bold text-emerald-900">ש</div>
                <div className="w-10 h-10 rounded-full bg-rose-400 border-2 border-white flex items-center justify-center text-sm font-bold text-rose-900">ד</div>
              </div>
              <div className="text-sm">
                <p className="font-semibold">500+ עסקים</p>
                <p className="text-white/70">כבר משתמשים ב-NextGen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 mb-2">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              כניסה לבעלי עסקים
            </h1>
            <p className="text-gray-600 text-lg">
              נהל את העסק שלך מכל מקום
            </p>
          </div>

          {/* Mobile Benefits */}
          <div className="lg:hidden bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-violet-100">
            <div className="flex items-center justify-around text-center">
              <div>
                <Calendar className="h-6 w-6 text-violet-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">יומן חכם</p>
              </div>
              <div>
                <Users className="h-6 w-6 text-violet-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">ניהול לקוחות</p>
              </div>
              <div>
                <TrendingUp className="h-6 w-6 text-violet-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">דוחות</p>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-violet-100/50 p-8 border border-white/50">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? "מתחבר..." : "המשך עם Google"}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 text-gray-500">או התחבר עם אימייל</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  כתובת אימייל
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@business.com"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
                  dir="ltr"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    שלח קישור התחברות
                  </>
                )}
              </button>
            </form>

            {/* New Business Link */}
            <p className="text-center text-gray-600 mt-6">
              רוצה לפתוח עסק חדש?{" "}
              <Link
                href="/auth/business/signup"
                className="text-violet-600 hover:text-violet-700 font-semibold underline underline-offset-2"
              >
                הירשם עכשיו
              </Link>
            </p>
          </div>

          {/* Customer Link */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              מחפש להזמין תור?{" "}
              <Link
                href="/auth/login"
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                כניסה ללקוחות
              </Link>
            </p>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 font-medium transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
