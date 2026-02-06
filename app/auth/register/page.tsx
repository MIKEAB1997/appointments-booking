"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, UserPlus, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Register Page
 * Route: /auth/register
 * Shows: Customer registration form with Google OAuth + Email
 */
export default function RegisterPage() {
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Store registration data in localStorage to complete after email verification
    localStorage.setItem(
      "pendingRegistration",
      JSON.stringify({ fullName, phone, email })
    );

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

    // Store registration data for Google sign up completion
    if (fullName || phone) {
      localStorage.setItem(
        "pendingRegistration",
        JSON.stringify({ fullName, phone })
      );
    }

    const result = await signInWithGoogle();

    if (!result.success) {
      setIsGoogleLoading(false);
      setError(result.error ?? "שגיאה בהרשמה עם Google. נסה שוב.");
    }
    // If successful, user will be redirected by Supabase
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            בדוק את האימייל שלך
          </h1>
          <p className="text-gray-600 text-lg">
            שלחנו קישור לאימות ל-<strong className="text-gray-800">{email}</strong>
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-100">
            <p className="text-sm text-gray-500">
              לא קיבלת? בדוק בתיקיית הספאם או{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200/50 mb-2">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            הרשמה ל-NextGen
          </h1>
          <p className="text-gray-600 text-lg">
            צור חשבון ותתחיל להזמין תורים בקלות
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-100/50 p-8 border border-white/50">
          {/* Benefits */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm">הזמנת תורים מכל מקום, בכל שעה</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm">תזכורות אוטומטיות לפני התור</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm">ניהול היסטוריית התורים שלך</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
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
            {isGoogleLoading ? "נרשם..." : "הירשם עם Google"}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500">או הירשם עם אימייל</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                שם מלא
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ישראל ישראלי"
                required
                autoFocus
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                טלפון נייד
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                כתובת אימייל
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
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
              disabled={isLoading || !email || !fullName || !phone}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  נרשם...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  צור חשבון
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            כבר יש לך חשבון?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2"
            >
              התחבר כאן
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-gray-500">
          בהרשמה אתה מסכים ל
          <Link href="/terms" className="text-gray-600 hover:text-gray-800 underline mx-1">
            תנאי השימוש
          </Link>
          ול
          <Link href="/privacy" className="text-gray-600 hover:text-gray-800 underline mx-1">
            מדיניות הפרטיות
          </Link>
        </p>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
