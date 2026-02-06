import { CreditCard } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Billing & Plans Page
 * Route: /admin/billing
 * Shows: Plans, invoices, payment failures
 */
export default function BillingPage() {
  return (
    <PlaceholderPage
      title="Billing & Plans"
      titleHe="חיוב ותוכניות"
      description="ניהול תוכניות מחיר, חשבוניות וכשלי תשלום"
      icon={<CreditCard className="h-16 w-16" />}
    />
  );
}
