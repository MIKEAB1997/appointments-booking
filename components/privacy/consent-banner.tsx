"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings } from "lucide-react";
import {
  shouldShowConsentDialog,
  acceptAllConsent,
  acceptEssentialOnly,
  saveConsentPreferences,
  type ConsentPreferences,
} from "@/lib/privacy";

/**
 * Cookie Consent Banner
 * GDPR compliant consent management
 */
export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<Partial<ConsentPreferences>>({
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if consent dialog should be shown
    if (shouldShowConsentDialog()) {
      // Small delay to not block initial render
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllConsent();
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    acceptEssentialOnly();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences(preferences);
    setIsVisible(false);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === "essential" || key === "lastUpdated" || key === "version") return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Banner */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Cookie className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white">הגדרות פרטיות</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">ניהול קובצי Cookie</p>
          </div>
          <button
            onClick={handleAcceptEssential}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!showSettings ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                אנו משתמשים ב-cookies כדי לשפר את חווית השימוש שלך. ניתן לקרוא על כך ב
                <Link href="/privacy" className="text-violet-600 hover:underline mx-1">
                  מדיניות הפרטיות
                </Link>
                שלנו.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  אשר הכל
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  הגדרות
                </button>
              </div>

              <button
                onClick={handleAcceptEssential}
                className="w-full mt-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                דחה (חיוניים בלבד)
              </button>
            </>
          ) : (
            <>
              {/* Settings Mode */}
              <div className="space-y-3 mb-4">
                {/* Essential - always on */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">חיוניים</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      נדרשים לפעולת האתר
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium">
                    תמיד פעיל
                  </div>
                </div>

                {/* Analytics */}
                <button
                  onClick={() => togglePreference("analytics")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-right"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">אנליטיקה</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      עוזר לנו לשפר את השירות
                    </p>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full transition-colors ${
                      preferences.analytics ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow mt-1 transition-transform ${
                        preferences.analytics ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </button>

                {/* Marketing */}
                <button
                  onClick={() => togglePreference("marketing")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-right"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">שיווק</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      הצעות ומבצעים מותאמים אישית
                    </p>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full transition-colors ${
                      preferences.marketing ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow mt-1 transition-transform ${
                        preferences.marketing ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </button>

                {/* Personalization */}
                <button
                  onClick={() => togglePreference("personalization")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-right"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">התאמה אישית</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      שמירת העדפות והגדרות
                    </p>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full transition-colors ${
                      preferences.personalization ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow mt-1 transition-transform ${
                        preferences.personalization ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  חזרה
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  שמור העדפות
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
