import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

export function About() {
  return (
    <section id="about" className="py-28 md:py-36">
      <div className="container-page grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Reveal>
          <h2 className="text-balance text-2xl font-medium leading-snug tracking-tight md:sticky md:top-32 md:text-3xl">
            {profile.about.statement}
          </h2>
        </Reveal>

        <div className="space-y-6">
          {profile.about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-balance text-[15px] leading-relaxed text-[var(--muted)] md:text-base">
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--muted-2)]">
                Currently focused on
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.about.currentlyFocusedOn.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
