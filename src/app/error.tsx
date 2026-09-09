"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">ERROR</p>
      <h1 className="mb-4 text-balance text-2xl font-medium tracking-tight md:text-3xl">
        Something went wrong.
      </h1>
      <p className="mb-8 max-w-sm text-[var(--muted)]">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
