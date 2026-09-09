export default function Loading() {
  return (
    <div className="container-page py-32">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-[var(--surface-2)]" />
      <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-[var(--surface-2)]" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--surface-2)]" />
    </div>
  );
}
