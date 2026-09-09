import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
