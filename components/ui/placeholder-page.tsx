import { cn } from "@/lib/utils/cn";

interface PlaceholderPageProps {
  title: string;
  titleHe: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Placeholder page component for routes not yet implemented
 * Shows the screen name and "Coming soon" message
 */
export function PlaceholderPage({
  title,
  titleHe,
  description,
  icon,
  className,
}: PlaceholderPageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-6 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground/50">{icon}</div>
      )}
      <h1 className="text-2xl font-bold mb-2">{titleHe}</h1>
      <p className="text-sm text-muted-foreground mb-4">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-md">{description}</p>
      )}
      <div className="mt-6 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
        בקרוב...
      </div>
    </div>
  );
}
