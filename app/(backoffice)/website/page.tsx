import { Globe } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Website Builder Page
 * Route: /website
 * Shows: Template picker + block editor + preview
 */
export default function WebsitePage() {
  return (
    <PlaceholderPage
      title="Website Builder"
      titleHe="בניית האתר"
      description="בחר תבנית, ערוך בלוקים וצפה בתצוגה מקדימה של אתר העסק"
      icon={<Globe className="h-16 w-16" />}
    />
  );
}
