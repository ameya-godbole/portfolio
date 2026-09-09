"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { profile, type Testimonial } from "@/content/profile";
import { Reveal } from "@/components/ui/reveal";

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors duration-300 hover:border-[var(--border-strong)]"
    >
      <Quote
        size={24}
        className="mb-4 text-[var(--accent)] opacity-40"
        aria-hidden
      />
      <blockquote className="mb-6 text-[15px] leading-relaxed text-[var(--muted)]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] font-mono text-xs font-medium text-[var(--accent)]">
          {testimonial.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-xs text-[var(--muted-2)]">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const testimonials = profile.testimonials;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            TESTIMONIALS
          </p>
          <h2 className="mb-14 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            What people say
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          )}
        </div>
      </div>
    </section>
  );
}
