import { LayoutTemplate } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Templates Page
 * Route: /admin/templates
 * Shows: Manage, version, A/B test templates
 */
export default function TemplatesPage() {
  return (
    <PlaceholderPage
      title="Templates"
      titleHe="תבניות"
      description="ניהול תבניות אתר, גרסאות ובדיקות A/B"
      icon={<LayoutTemplate className="h-16 w-16" />}
    />
  );
}
