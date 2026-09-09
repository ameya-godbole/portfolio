"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experience } from "@/content/experience";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Experience() {
  const [activeId, setActiveId] = useState<string | undefined>(experience[0]?.id);

  return (
    <section id="experience" className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            CAREER
          </p>
          <h2 className="mb-14 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Experience
          </h2>
        </Reveal>

        <ol className="space-y-3">
          {experience.map((role, i) => {
            const isOpen = activeId === role.id;
            return (
              <Reveal key={role.id} delay={i * 0.04}>
                <li className="border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
                  <h3>
                    <button
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`role-panel-${role.id}`}
                      onClick={() => setActiveId(isOpen ? undefined : role.id)}
                    >
                      <span className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                        <span className="font-mono text-xs text-[var(--muted-2)] md:w-32">
                          {role.startDate} — {role.endDate}
                        </span>
                        <span className="text-base font-medium md:text-lg">
                          {role.role}
                        </span>
                        <span className="text-sm text-[var(--muted)]">
                          {role.company}
                        </span>
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "shrink-0 text-[var(--muted)] transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>
                  </h3>

                  <motion.div
                    id={`role-panel-${role.id}`}
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 pt-1">
                      <p className="mb-2 text-sm text-[var(--muted-2)]">{role.location}</p>
                      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
                        {role.summary}
                      </p>

                      {role.responsibilities.length > 0 && (
                        <div className="mb-5">
                          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted-2)]">
                            Responsibilities
                          </p>
                          <ul className="space-y-1.5">
                            {role.responsibilities.map((r) => (
                              <li key={r} className="text-sm text-[var(--muted)]">
                                — {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {role.achievements.length > 0 && (
                        <div className="mb-5">
                          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted-2)]">
                            Achievements
                          </p>
                          <ul className="space-y-1.5">
                            {role.achievements.map((a) => (
                              <li key={a} className="text-sm text-[var(--muted)]">
                                — {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {role.impactMetrics.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-2">
                          {role.impactMetrics.map((m) => (
                            <span
                              key={m}
                              className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {role.technologies.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
