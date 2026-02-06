import { User } from "lucide-react";
import { PublicLayout } from "@/components/layouts/public-layout";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Details Input Page
 * Route: /{tenant}/book/details
 * Shows: Name + Email form
 */
export default function BookingDetailsPage() {
  return (
    <PublicLayout>
      <PlaceholderPage
        title="Details Input"
        titleHe="פרטי ההזמנה"
        description="הזן את שמך ואימייל להשלמת ההזמנה"
        icon={<User className="h-16 w-16" />}
      />
    </PublicLayout>
  );
}
