import { CreditCard } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Payments & Packages Page
 * Route: /payments
 * Shows: Payment management (Phase 2-3)
 */
export default function PaymentsPage() {
  return (
    <PlaceholderPage
      title="Payments & Packages"
      titleHe="תשלומים וחבילות"
      description="ניהול תשלומים, חבילות וכרטיסיות (בקרוב - Phase 2-3)"
      icon={<CreditCard className="h-16 w-16" />}
    />
  );
}
