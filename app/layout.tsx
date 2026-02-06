import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

/**
 * Heebo font - Hebrew-optimized Google Font
 * Used as the default font throughout the app
 */
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

/**
 * Default metadata for the app
 * Individual pages can override these values
 */
export const metadata: Metadata = {
  title: {
    default: "NextGen - ניהול תורים וצמיחה עסקית",
    template: "%s | NextGen",
  },
  description:
    "מערכת SaaS לניהול תורים, נוכחות דיגיטלית ושימור לקוחות לעסקי כושר וביוטי",
  keywords: [
    "ניהול תורים",
    "כושר",
    "ביוטי",
    "הזמנת תורים",
    "SaaS",
    "עסקים קטנים",
  ],
  authors: [{ name: "NextGen" }],
  creator: "NextGen",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "NextGen",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Viewport configuration for PWA and mobile optimization
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Root layout component
 * Sets up RTL direction, Hebrew language, and theme provider
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Preconnect to Supabase for faster loading */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${heebo.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
