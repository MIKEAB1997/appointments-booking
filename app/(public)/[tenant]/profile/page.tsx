import { UserCircle } from "lucide-react";
import { PublicLayout } from "@/components/layouts/public-layout";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Customer Profile Page
 * Route: /{tenant}/profile
 * Shows: My bookings + points + tier (registered only)
 */
export default function CustomerProfilePage() {
  return (
    <PublicLayout>
      <PlaceholderPage
        title="Customer Profile"
        titleHe="הפרופיל שלי"
        description="צפה בתורים, נקודות ודרגה שלך"
        icon={<UserCircle className="h-16 w-16" />}
      />
    </PublicLayout>
  );
}
