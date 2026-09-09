import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/reveal";

export function Snapshot() {
  return (
    <section className="border-y border-[var(--border)]">
      <div className="container-page grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
        {profile.snapshot.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05}>
            <div>
              <div className="text-3xl font-medium tracking-tight md:text-4xl">
                {item.value}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">{item.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
