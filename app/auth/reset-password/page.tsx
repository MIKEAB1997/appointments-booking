"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, Loader2, KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const dynamic = 'force-dynamic';

/**
 * Password Reset Page
 * Route: /auth/reset-password
 * Shows: Form to set new password after clicking reset link
 */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return false;
    }
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await updatePassword(password);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      setError(result.error ?? "שגיאה בעדכון הסיסמה. נסה שוב.");
    }
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md w-full space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            הסיסמה עודכנה בהצלחה!
          </h1>
          <p className="text-gray-600 text-lg">
            מעביר אותך לדף הבית...
          </p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-500" />
        </div>
      </main>
    );
  }

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
            בחר סיסמה חדשה
          </h1>
          <p className="text-gray-600">
            הזן סיסמה חדשה לחשבון שלך
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-100/50 p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                סיסמה חדשה
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="לפחות 6 תווים"
                  required
                  autoFocus
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                אימות סיסמה
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="הזן שוב את הסיסמה"
                required
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
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-lg shadow-amber-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  מעדכן...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  עדכן סיסמה
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה להתחברות
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">טוען...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
