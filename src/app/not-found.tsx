import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">404</p>
      <h1 className="mb-4 text-balance text-2xl font-medium tracking-tight md:text-3xl">
        Looks like this page took a wrong turn.
      </h1>
      <p className="mb-8 max-w-sm text-[var(--muted)]">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </section>
  );
}
