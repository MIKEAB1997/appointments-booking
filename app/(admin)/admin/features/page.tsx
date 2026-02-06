import { Flag } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Feature Flags Page
 * Route: /admin/features
 * Shows: Beta/rollout toggles
 */
export default function FeaturesPage() {
  return (
    <PlaceholderPage
      title="Feature Flags"
      titleHe="Feature Flags"
      description="ניהול פיצ'רים בבטא והפעלה הדרגתית"
      icon={<Flag className="h-16 w-16" />}
    />
  );
}
