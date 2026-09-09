"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/content/profile";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="container-page relative">
        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-mono text-xs tracking-[0.2em] text-[var(--accent)]"
        >
          {profile.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance max-w-4xl text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl"
        >
          {profile.hero.headline}
        </motion.h1>

        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-balance text-lg text-[var(--muted)]"
        >
          {profile.hero.summary}
        </motion.p>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href={profile.hero.primaryCta.href}>
            <Button>{profile.hero.primaryCta.label}</Button>
          </a>
          <a href={profile.hero.secondaryCta.href}>
            <Button variant="secondary">{profile.hero.secondaryCta.label}</Button>
          </a>
        </motion.div>
      </div>

      <div className="container-page absolute bottom-10 hidden items-center gap-2 text-xs text-[var(--muted-2)] md:flex">
        <ArrowDown size={14} />
        Scroll to explore
      </div>
    </section>
  );
}
