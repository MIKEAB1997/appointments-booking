import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Reports Page
 * Route: /reports
 * Shows: Weekly + monthly reports (Phase 2)
 */
export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      titleHe="דוחות"
      description="דוחות שבועיים וחודשיים - תפוסה, ביטולים, לקוחות חדשים וחוזרים"
      icon={<BarChart3 className="h-16 w-16" />}
    />
  );
}
