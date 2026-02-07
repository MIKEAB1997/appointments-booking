"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, Loader2, Sparkles, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = 'force-dynamic';

type AuthMethod = "password" | "magic-link";

/**
 * Login Page
 * Route: /auth/login
 * Shows: Email/Password login + Magic link option + Google OAuth
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("next") ?? "/dashboard";

  const { signIn, signInWithPassword, signInWithGoogle, resetPassword } = useAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signInWithPassword(email, password);

    setIsLoading(false);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.error ?? "שגיאה בהתחברות. נסה שוב.");
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn(email);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setSuccessMessage("שלחנו קישור להתחברות לאימייל שלך");
    } else {
      setError(result.error ?? "שגיאה בשליחת הקוד. נסה שוב.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("יש להזין כתובת אימייל");
      return;
    }
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(email);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setSuccessMessage("שלחנו קישור לאיפוס סיסמה לאימייל שלך");
    } else {
      setError(result.error ?? "שגיאה בשליחת הקישור. נסה שוב.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const result = await signInWithGoogle();

    if (!result.success) {
      setIsGoogleLoading(false);
      setError(result.error ?? "שגיאה בהתחברות עם Google. נסה שוב.");
    }
    // If successful, user will be redirected by Supabase
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            בדוק את האימייל שלך
          </h1>
          <p className="text-gray-600 text-lg">
            {successMessage}
          </p>
          <p className="text-gray-500">
            נשלח ל-<strong className="text-gray-800">{email}</strong>
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-gray-500">
              לא קיבלת? בדוק בתיקיית הספאם או{" "}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setSuccessMessage("");
                }}
                className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-2"
              >
                נסה שוב
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (showForgotPassword) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200/50 mb-2">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              שכחת סיסמה?
            </h1>
            <p className="text-gray-600">
              הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-100/50 p-8 border border-white/50">
            <form onSubmit={handleForgotPassword} className="space-y-5">
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
                  autoFocus
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
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
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-amber-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    שלח קישור לאיפוס
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
              }}
              className="w-full mt-4 text-center text-gray-600 hover:text-gray-800 font-medium"
            >
              חזרה להתחברות
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200/50 mb-2">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            ברוכים הבאים
          </h1>
          <p className="text-gray-600 text-lg">
            התחבר לחשבון שלך
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-100/50 p-8 border border-white/50">
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500">או</span>
            </div>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setAuthMethod("password")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                authMethod === "password"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="h-4 w-4" />
              סיסמה
            </button>
            <button
              onClick={() => setAuthMethod("magic-link")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                authMethod === "magic-link"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="h-4 w-4" />
              קישור חד-פעמי
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={authMethod === "password" ? handlePasswordLogin : handleMagicLinkLogin} className="space-y-4">
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
                autoFocus
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
                dir="ltr"
              />
            </div>

            {authMethod === "password" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    סיסמה
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    שכחת סיסמה?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-50 transition-all duration-200 text-gray-800 placeholder:text-gray-400 pl-12"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || (authMethod === "password" && !password)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {authMethod === "password" ? "מתחבר..." : "שולח..."}
                </>
              ) : (
                <>
                  {authMethod === "password" ? (
                    <>
                      <Lock className="h-5 w-5" />
                      התחבר
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      שלח קישור התחברות
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
            אין לך חשבון?{" "}
            <Link
              href="/auth/register"
              className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2"
            >
              הירשם עכשיו
            </Link>
          </p>
        </div>

        {/* Business Owner Link */}
        <div className="text-center space-y-3">
          <p className="text-gray-600">
            בעל עסק?{" "}
            <Link
              href="/auth/business"
              className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2"
            >
              התחבר לניהול העסק
            </Link>
          </p>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">טוען...</div>}>
      <LoginContent />
    </Suspense>
  );
}
