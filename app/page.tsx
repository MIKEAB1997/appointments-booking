import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BusinessGrid } from "@/components/marketplace/business-grid";

/**
 * Home Page - Customer Marketplace
 * Shows businesses by location with search and filtering
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative h-10 w-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                N
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              NextGen
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              התחברות
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
            >
              הרשמה
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-8 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>גלה את העסקים הטובים ביותר באזורך</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              הזמן תור ב
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              שניות ספורות
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            כושר, ביוטי, ספא ועוד - מצא את המקום המושלם והזמן תור עכשיו.
            בלי שיחות טלפון, בלי המתנה.
          </p>
        </div>
      </section>

      {/* Business Grid with Search & Filters */}
      <section className="relative z-10 px-4 pb-32">
        <div className="container mx-auto">
          <BusinessGrid />
        </div>
      </section>

      {/* Business Owner CTA - Fixed at bottom */}
      <footer className="fixed bottom-0 inset-x-0 z-50">
        <div className="bg-gradient-to-t from-white via-white to-white/0 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/0 pt-8 pb-4 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">יש לך עסק?</p>
                  <p className="text-slate-400 text-sm">הצטרף ל-NextGen והגדל את העסק שלך</p>
                </div>
              </div>
              <Link
                href="/auth/business"
                className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                כניסה לבעלי עסקים
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
