import { Building } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

interface TenantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Tenant Detail Page
 * Route: /admin/tenants/{id}
 * Shows: Edit tenant + impersonation (with audit)
 */
export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title="Tenant Detail"
      titleHe="פרטי עסק"
      description={`עריכת עסק ${id}, התחזות ויומן פעילות`}
      icon={<Building className="h-16 w-16" />}
    />
  );
}
