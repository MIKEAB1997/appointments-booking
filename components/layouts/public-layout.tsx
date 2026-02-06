"use client";

import Link from "next/link";
import Image from "next/image";
import { useTenant } from "@/hooks/use-tenant";

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Public layout for customer-facing tenant pages
 * Shows tenant branding in header
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  const { tenant, isLoading } = useTenant();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          {/* Tenant Logo/Name */}
          <Link href="/" className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-shimmer" />
            ) : tenant?.logoUrl ? (
              <Image
                src={tenant.logoUrl}
                alt={tenant.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {tenant?.name?.charAt(0) ?? "N"}
              </div>
            )}
            <span className="font-semibold">
              {isLoading ? (
                <span className="inline-block h-5 w-24 bg-muted animate-shimmer rounded" />
              ) : (
                tenant?.name ?? "NextGen"
              )}
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA Button */}
          <Link
            href={tenant ? `/${tenant.slug}/book` : "/"}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors touch-target"
          >
            הזמנת תור
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 px-4">
        <div className="container flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <p>
            {tenant?.name ?? "העסק"} - כל הזכויות שמורות
          </p>
          <p className="text-xs">
            מופעל על ידי{" "}
            <Link href="/" className="underline hover:text-foreground">
              NextGen
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
