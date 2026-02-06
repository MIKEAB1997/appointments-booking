import { CalendarX } from "lucide-react";
import { PublicLayout } from "@/components/layouts/public-layout";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

interface ManageBookingPageProps {
  params: Promise<{
    tenant: string;
    id: string;
  }>;
}

/**
 * Reschedule / Cancel Page
 * Route: /{tenant}/profile/manage/{id}
 * Shows: Change or cancel booking with policy display
 */
export default async function ManageBookingPage({ params }: ManageBookingPageProps) {
  const { id } = await params;

  return (
    <PublicLayout>
      <PlaceholderPage
        title="Reschedule / Cancel"
        titleHe="שינוי או ביטול תור"
        description={`ניהול תור מספר ${id}. ניתן לשנות או לבטל בהתאם למדיניות הביטולים.`}
        icon={<CalendarX className="h-16 w-16" />}
      />
    </PublicLayout>
  );
}
