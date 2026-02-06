import { Mail } from "lucide-react";
import { PublicLayout } from "@/components/layouts/public-layout";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * OTP Verification Page
 * Route: /{tenant}/book/verify
 * Shows: Magic link / code input + progress bar + gamification preview
 */
export default function BookingVerifyPage() {
  return (
    <PublicLayout>
      <PlaceholderPage
        title="OTP Verification"
        titleHe="אימות אימייל"
        description="שלחנו לך קוד אימות לאימייל. הזן את הקוד או לחץ על הקישור שקיבלת."
        icon={<Mail className="h-16 w-16" />}
      />
    </PublicLayout>
  );
}
