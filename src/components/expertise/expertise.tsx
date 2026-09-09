"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, Cloud, Brain, Users } from "lucide-react";
import { expertise, type ExpertiseArea } from "@/content/expertise";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const iconMap = {
  code: Code2,
  cloud: Cloud,
  brain: Brain,
  users: Users,
};

function SkillChip({ label, delay }: { label: string; delay: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
    >
      {label}
    </motion.span>
  );
}

function ExpertiseCard({ area, index }: { area: ExpertiseArea; index: number }) {
  const reduceMotion = useReducedMotion();
  const Icon = iconMap[area.icon] || Code2;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative h-full overflow-hidden bg-[var(--background)] p-8 transition-colors duration-300",
        "hover:bg-[var(--surface)]"
      )}
    >
      {/* Accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100" />

      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--muted-2)]">{area.index}</span>
        <motion.div
          whileHover={reduceMotion ? undefined : { rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon
            size={20}
            className="text-[var(--muted-2)] transition-colors duration-300 group-hover:text-[var(--accent)]"
          />
        </motion.div>
      </div>

      <h3 className="mb-2 text-lg font-medium tracking-tight">{area.title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">{area.description}</p>

      <div className="flex flex-wrap gap-2">
        {area.technologies.map((t, i) => (
          <SkillChip key={t} label={t} delay={index * 0.1 + i * 0.05} />
        ))}
      </div>
    </motion.div>
  );
}

export function Expertise() {
  return (
    <section id="expertise" className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            EXPERTISE
          </p>
          <h2 className="mb-4 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            What I bring to a team
          </h2>
          <p className="mb-14 max-w-lg text-[var(--muted)]">
            Deep specialization across the full stack — from system design to shipping polished products.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          {expertise.map((area, i) => (
            <ExpertiseCard key={area.id} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
