import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface AuthErrorPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

/**
 * Auth Error Page
 * Route: /auth/error
 * Shows: Error message from auth callback
 */
export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { message } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">שגיאה בהתחברות</h1>
        <p className="text-muted-foreground">
          {message ?? "אירעה שגיאה בתהליך ההתחברות. נסה שוב."}
        </p>
        <div className="space-y-2">
          <Link
            href="/auth/login"
            className="block w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors touch-target"
          >
            נסה להתחבר שוב
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 rounded-lg border hover:bg-accent transition-colors touch-target"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </main>
  );
}
