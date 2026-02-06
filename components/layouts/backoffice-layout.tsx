"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Globe,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/use-auth";

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

/**
 * Navigation items for backoffice sidebar
 */
const navItems = [
  {
    href: "/dashboard",
    label: "לוח בקרה",
    icon: LayoutDashboard,
  },
  {
    href: "/calendar",
    label: "יומן",
    icon: Calendar,
  },
  {
    href: "/clients",
    label: "לקוחות",
    icon: Users,
  },
  {
    href: "/services",
    label: "שירותים",
    icon: Briefcase,
  },
  {
    href: "/website",
    label: "אתר העסק",
    icon: Globe,
  },
  {
    href: "/settings",
    label: "הגדרות",
    icon: Settings,
  },
];

/**
 * Backoffice layout for business owners/staff
 * Desktop: Sidebar navigation
 * Mobile: Bottom navigation + hamburger menu
 */
export function BackofficeLayout({ children }: BackofficeLayoutProps) {
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
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            N
          </div>
          <span className="font-bold text-lg">NextGen</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.fullName?.charAt(0) ?? "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName ?? "משתמש"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
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
          <span className="font-bold">NextGen</span>
          <div className="w-10" /> {/* Spacer for alignment */}
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
              <span className="font-bold">NextGen</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 touch-target"
                aria-label="סגור תפריט"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
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

        {/* Mobile bottom padding for nav */}
        <div className="h-16 lg:hidden" />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-bottom">
        <div className="flex items-center justify-around h-full">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full touch-target",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
