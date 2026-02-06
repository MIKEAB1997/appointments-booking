import { Shield } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Security Center Page
 * Route: /admin/security
 * Shows: OTP abuse, rate limits, IP flags
 */
export default function SecurityPage() {
  return (
    <PlaceholderPage
      title="Security Center"
      titleHe="מרכז אבטחה"
      description="ניטור ניסיונות OTP חשודים, Rate Limits ודגלי IP"
      icon={<Shield className="h-16 w-16" />}
    />
  );
}
