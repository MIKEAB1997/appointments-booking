import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

/**
 * Audit Logs Page
 * Route: /admin/audit
 * Shows: All system-wide logged actions
 */
export default function AuditPage() {
  return (
    <PlaceholderPage
      title="Audit Logs"
      titleHe="יומן פעילות"
      description="כל הפעולות שנרשמו במערכת - שינויי מחיר, מדיניות, תבניות והרשאות"
      icon={<FileText className="h-16 w-16" />}
    />
  );
}
