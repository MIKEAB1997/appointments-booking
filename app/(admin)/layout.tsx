import { AdminLayout } from "@/components/layouts/admin-layout";

/**
 * Layout wrapper for all admin routes
 * Provides admin navigation and platform-wide context
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
