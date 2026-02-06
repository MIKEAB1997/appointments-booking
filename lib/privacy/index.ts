/**
 * Privacy and Consent Management for NextGen
 * GDPR/CCPA compliant data handling
 */

// ============================================================
// Consent Types
// ============================================================

export type ConsentType =
  | "essential"     // Required for app to function
  | "analytics"     // Usage analytics
  | "marketing"     // Marketing communications
  | "personalization"; // Personalized experience

export interface ConsentPreferences {
  essential: true; // Always true - required
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  lastUpdated: string;
  version: string;
}

const CONSENT_STORAGE_KEY = "nextgen_consent_preferences";
const CONSENT_VERSION = "1.0";

// ============================================================
// Consent Management
// ============================================================

/**
 * Get default consent preferences
 */
export function getDefaultConsent(): ConsentPreferences {
  return {
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
    lastUpdated: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

/**
 * Get stored consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const preferences = JSON.parse(stored) as ConsentPreferences;

    // Check if version matches
    if (preferences.version !== CONSENT_VERSION) {
      // Version mismatch - require new consent
      return null;
    }

    return preferences;
  } catch {
    return null;
  }
}

/**
 * Save consent preferences
 */
export function saveConsentPreferences(preferences: Partial<ConsentPreferences>): ConsentPreferences {
  const current = getConsentPreferences() ?? getDefaultConsent();

  const updated: ConsentPreferences = {
    ...current,
    ...preferences,
    essential: true, // Always required
    lastUpdated: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
  }

  return updated;
}

/**
 * Accept all consent
 */
export function acceptAllConsent(): ConsentPreferences {
  return saveConsentPreferences({
    analytics: true,
    marketing: true,
    personalization: true,
  });
}

/**
 * Accept only essential consent
 */
export function acceptEssentialOnly(): ConsentPreferences {
  return saveConsentPreferences({
    analytics: false,
    marketing: false,
    personalization: false,
  });
}

/**
 * Check if user has given consent
 */
export function hasConsent(type: ConsentType): boolean {
  const preferences = getConsentPreferences();
  if (!preferences) return type === "essential";
  return preferences[type] === true;
}

/**
 * Check if consent dialog should be shown
 */
export function shouldShowConsentDialog(): boolean {
  return getConsentPreferences() === null;
}

// ============================================================
// Data Retention
// ============================================================

export interface DataRetentionPolicy {
  bookings: number;      // Days to keep booking data
  analytics: number;     // Days to keep analytics
  logs: number;          // Days to keep logs
  deletedAccounts: number; // Days before permanent deletion
}

export const DEFAULT_RETENTION_POLICY: DataRetentionPolicy = {
  bookings: 365 * 2,     // 2 years
  analytics: 365,        // 1 year
  logs: 90,              // 90 days
  deletedAccounts: 30,   // 30 days grace period
};

// ============================================================
// Data Export (Right to Portability)
// ============================================================

export interface UserDataExport {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  bookings: Array<{
    id: string;
    service: string;
    date: string;
    status: string;
  }>;
  preferences: ConsentPreferences | null;
  exportDate: string;
}

/**
 * Format user data for export
 */
export function formatDataForExport(data: Partial<UserDataExport>): string {
  const exportData: UserDataExport = {
    profile: data.profile ?? {
      fullName: "",
      email: "",
      phone: "",
      createdAt: "",
    },
    bookings: data.bookings ?? [],
    preferences: getConsentPreferences(),
    exportDate: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

// ============================================================
// Data Deletion (Right to Erasure)
// ============================================================

/**
 * Clear all local user data
 */
export function clearLocalUserData(): void {
  if (typeof window === "undefined") return;

  // List of all app-related localStorage keys
  const keysToRemove = [
    CONSENT_STORAGE_KEY,
    "lastBooking",
    "pendingRegistration",
    "pendingBusinessSetup",
    "pendingBusinessOwner",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Clear session storage
  sessionStorage.clear();
}

/**
 * Request account deletion
 * In production, this would trigger a server-side deletion flow
 */
export function requestAccountDeletion(): { success: boolean; message: string } {
  // Clear local data immediately
  clearLocalUserData();

  return {
    success: true,
    message: "בקשת מחיקת החשבון התקבלה. החשבון יימחק תוך 30 יום.",
  };
}

// ============================================================
// Privacy Policy Helpers
// ============================================================

export interface PrivacyPolicySection {
  title: string;
  content: string;
}

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    title: "איסוף מידע",
    content: "אנו אוספים מידע שאתה מספק לנו ישירות, כגון שם, אימייל, טלפון ופרטי הזמנות.",
  },
  {
    title: "שימוש במידע",
    content: "המידע משמש לניהול הזמנות, שליחת תזכורות, ושיפור השירות.",
  },
  {
    title: "שיתוף מידע",
    content: "אנו משתפים מידע רק עם בעלי העסקים שאצלם הזמנת תור, ולא עם צדדים שלישיים אחרים.",
  },
  {
    title: "אבטחת מידע",
    content: "אנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע שלך.",
  },
  {
    title: "זכויותיך",
    content: "יש לך זכות לגשת למידע שלך, לתקן אותו, או לבקש את מחיקתו.",
  },
];

// ============================================================
// Cookie Categories
// ============================================================

export interface CookieInfo {
  name: string;
  purpose: string;
  duration: string;
  type: ConsentType;
}

export const COOKIES_USED: CookieInfo[] = [
  {
    name: "session",
    purpose: "שמירת מצב התחברות",
    duration: "7 ימים",
    type: "essential",
  },
  {
    name: "preferences",
    purpose: "שמירת העדפות משתמש",
    duration: "שנה",
    type: "personalization",
  },
  {
    name: "analytics",
    purpose: "מעקב אנונימי אחר שימוש",
    duration: "30 ימים",
    type: "analytics",
  },
];

// ============================================================
// Anonymization Helpers
// ============================================================

/**
 * Anonymize email for display
 * example@domain.com -> e***@d***.com
 */
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***.***";

  const [domainName, tld] = domain.split(".");
  if (!domainName || !tld) return `${local[0]}***@***.***`;

  return `${local[0]}***@${domainName[0]}***.${tld}`;
}

/**
 * Anonymize phone number
 * 0501234567 -> 050***4567
 */
export function anonymizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.length < 7) return "***";

  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-4);
  return `${prefix}***${suffix}`;
}

/**
 * Anonymize name
 * ישראל ישראלי -> י. י.
 */
export function anonymizeName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => (p[0] ?? "") + ".").join(" ");
}
