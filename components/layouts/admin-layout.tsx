"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  LayoutTemplate,
  Shield,
  Flag,
  FileText,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Navigation items for admin sidebar
 */
const navItems = [
  {
    href: "/admin/tenants",
    label: "עסקים",
    icon: Building2,
  },
  {
    href: "/admin/billing",
    label: "חיוב ותוכניות",
    icon: CreditCard,
  },
  {
    href: "/admin/templates",
    label: "תבניות",
    icon: LayoutTemplate,
  },
  {
    href: "/admin/security",
    label: "אבטחה",
    icon: Shield,
  },
  {
    href: "/admin/features",
    label: "Feature Flags",
    icon: Flag,
  },
  {
    href: "/admin/audit",
    label: "יומן פעילות",
    icon: FileText,
  },
];

/**
 * Admin layout for platform administrators
 * Similar structure to backoffice but with admin-specific navigation
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-e bg-card">
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center text-destructive-foreground font-bold">
            A
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        {/* Back to App Link */}
        <div className="px-4 py-2 border-b">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            חזרה לאפליקציה
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-sm font-medium text-destructive">
                {user?.fullName?.charAt(0) ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName ?? "Admin"}
              </p>
              <p className="text-xs text-muted-foreground">מנהל מערכת</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors touch-target"
          >
            <LogOut className="h-5 w-5" />
            התנתקות
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ms-2 touch-target"
            aria-label="פתח תפריט"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-destructive">Admin Panel</span>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className="fixed inset-y-0 start-0 w-72 bg-card border-e shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b">
              <span className="font-bold text-destructive">Admin Panel</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 touch-target"
                aria-label="סגור תפריט"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Back Link */}
            <div className="px-4 py-2 border-b">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                חזרה לאפליקציה
              </Link>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 inset-x-0 p-4 border-t bg-card">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors touch-target"
              >
                <LogOut className="h-5 w-5" />
                התנתקות
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ps-64">
        {/* Mobile top padding */}
        <div className="h-14 lg:hidden" />

        {/* Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
