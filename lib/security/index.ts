/**
 * Security utilities for NextGen
 * Input validation, sanitization, and rate limiting
 */

// ============================================================
// Input Validation
// ============================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Israeli phone number
 * Supports formats: 0501234567, 050-1234567, +972501234567
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  // Israeli mobile: starts with 05X and has 10 digits
  // Or international format: +972 5X XXXXXXX
  const israeliMobile = /^0[5][0-9]{8}$/;
  const internationalMobile = /^\+972[5][0-9]{8}$/;
  return israeliMobile.test(cleaned) || internationalMobile.test(cleaned);
}

/**
 * Validate Hebrew/English name (2-50 characters)
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  // Allow Hebrew, English, spaces, and common name characters
  const nameRegex = /^[\u0590-\u05FFa-zA-Z\s\-'\.]+$/;
  return nameRegex.test(trimmed);
}

/**
 * Validate business name (2-100 characters)
 */
export function isValidBusinessName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;
  // Allow Hebrew, English, numbers, spaces, and common business name characters
  const nameRegex = /^[\u0590-\u05FFa-zA-Z0-9\s\-'\.&]+$/;
  return nameRegex.test(trimmed);
}

/**
 * Validate URL slug (lowercase letters, numbers, hyphens)
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
}

/**
 * Validate price (positive number)
 */
export function isValidPrice(price: number): boolean {
  return typeof price === "number" && price >= 0 && price <= 100000;
}

/**
 * Validate duration in minutes (5-480 minutes)
 */
export function isValidDuration(minutes: number): boolean {
  return typeof minutes === "number" && minutes >= 5 && minutes <= 480;
}

// ============================================================
// Input Sanitization
// ============================================================

/**
 * Sanitize user input by removing dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML/XML
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Sanitize phone number to standard format
 */
export function sanitizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Convert international format to local
  if (cleaned.startsWith("+972")) {
    cleaned = "0" + cleaned.slice(4);
  }

  return cleaned;
}

/**
 * Generate a safe slug from a business name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\u0590-\u05FF]/g, "") // Remove Hebrew characters
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50); // Limit length
}

// ============================================================
// Rate Limiting (Client-side tracking)
// ============================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if an action is rate limited
 * Returns true if the action should be blocked
 */
export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

/**
 * Get remaining requests for a rate limit key
 */
export function getRateLimitRemaining(
  key: string,
  maxRequests: number
): number {
  const entry = rateLimitStore.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - entry.count);
}

/**
 * Clear rate limit for a key (e.g., after successful action)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ============================================================
// CSRF Protection
// ============================================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for server-side
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Store CSRF token in session storage
 */
export function storeCSRFToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("csrf_token", token);
  }
}

/**
 * Get stored CSRF token
 */
export function getStoredCSRFToken(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("csrf_token");
  }
  return null;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getStoredCSRFToken();
  return storedToken !== null && storedToken === token && token.length === 64;
}

// ============================================================
// XSS Prevention
// ============================================================

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] ?? char);
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return "";
  }
  return url;
}

// ============================================================
// Password Validation (for future use)
// ============================================================

/**
 * Check password strength
 * Returns: 'weak' | 'medium' | 'strong'
 */
export function checkPasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";

  let score = 0;

  // Length bonus
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

// ============================================================
// Form Validation Helper
// ============================================================

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate booking form data
 */
export function validateBookingForm(data: {
  name: string;
  phone: string;
  email: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isValidName(data.name)) {
    errors.name = "נא להזין שם תקין (2-50 תווים)";
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = "נא להזין מספר טלפון ישראלי תקין";
  }

  if (!isValidEmail(data.email)) {
    errors.email = "נא להזין כתובת אימייל תקינה";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate business registration form
 */
export function validateBusinessForm(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isValidBusinessName(data.name)) {
    errors.name = "נא להזין שם עסק תקין (2-100 תווים)";
  }

  if (!isValidEmail(data.email)) {
    errors.email = "נא להזין כתובת אימייל תקינה";
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = "נא להזין מספר טלפון ישראלי תקין";
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = "נא לבחור עיר";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================
// Aliases for backward compatibility
// ============================================================

// Validation wrapper functions that return objects with isValid and error
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const valid = isValidEmail(email);
  return { isValid: valid, error: valid ? undefined : "נא להזין כתובת אימייל תקינה" };
}

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const valid = isValidPhone(phone);
  return { isValid: valid, error: valid ? undefined : "נא להזין מספר טלפון ישראלי תקין" };
}

export function validateName(name: string): { isValid: boolean; error?: string } {
  const valid = isValidName(name);
  return { isValid: valid, error: valid ? undefined : "נא להזין שם תקין (2-50 תווים)" };
}

// Rate limit wrapper that returns object with allowed property
export function rateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean } {
  const limited = isRateLimited(key, maxRequests, windowMs);
  return { allowed: !limited };
}

export const generateCsrfToken = generateCSRFToken;
