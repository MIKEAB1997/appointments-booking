import { BackofficeLayout } from "@/components/layouts/backoffice-layout";

/**
 * Layout wrapper for all backoffice routes
 * Provides sidebar navigation and user context
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BackofficeLayout>{children}</BackofficeLayout>;
}
