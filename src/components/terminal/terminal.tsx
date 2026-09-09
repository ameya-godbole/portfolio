"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

type TermLine = { type: "cmd" | "out" | "blank"; text: string };

const sequence: TermLine[] = [
  { type: "cmd", text: "$ terraform init" },
  { type: "out", text: "\u2713 Initializing provider plugins..." },
  { type: "out", text: "\u2713 Terraform initialized successfully" },
  { type: "blank", text: "" },
  { type: "cmd", text: "$ kubectl get pods -n production" },
  { type: "out", text: "NAME                    READY   STATUS    RESTARTS" },
  { type: "out", text: "api-server-7d4f9c       1/1     Running   0" },
  { type: "out", text: "worker-6b8dc5           1/1     Running   0" },
  { type: "blank", text: "" },
  { type: "cmd", text: "$ helm upgrade --install portfolio ./charts" },
  {
    type: "out",
    text: 'Release "portfolio" has been upgraded. Happy Helming!',
  },
  { type: "blank", text: "" },
  { type: "cmd", text: "$ git push origin main" },
  { type: "out", text: "\u2713 CI pipeline triggered" },
  { type: "out", text: "\u2713 Tests passed (47/47)" },
  { type: "out", text: "\u2713 Deployed to production in 4m 32s" },
];

export function TerminalSection() {
  const reduceMotion = useReducedMotion();
  const [lines, setLines] = useState<{ text: string; type: string }[]>([]);
  const [charIdx, setCharIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const resetAndStart = useCallback(() => {
    setLines([]);
    setCharIdx(0);
    setLineIdx(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          resetAndStart();
        }
      },
      { threshold: 0.3 }
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [resetAndStart]);

  useEffect(() => {
    if (!isTyping) return;
    if (lineIdx >= sequence.length) {
      setIsTyping(false);
      const t = setTimeout(() => {
        started.current = false;
        resetAndStart();
        started.current = true;
      }, 4000);
      return () => clearTimeout(t);
    }

    const current = sequence[lineIdx];

    if (current.type === "blank") {
      setLines((prev) => [...prev, { text: "", type: "blank" }]);
      const t = setTimeout(() => setLineIdx((p) => p + 1), 200);
      return () => clearTimeout(t);
    }

    if (current.type === "out") {
      setLines((prev) => [...prev, { text: current.text, type: "out" }]);
      const t = setTimeout(() => setLineIdx((p) => p + 1), 120);
      return () => clearTimeout(t);
    }

    // cmd: typewriter
    if (charIdx === 0) {
      setLines((prev) => [...prev, { text: "", type: "cmd" }]);
    }

    if (charIdx < current.text.length) {
      const t = setTimeout(() => {
        setLines((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            text: current.text.slice(0, charIdx + 1),
            type: "cmd",
          };
          return copy;
        });
        setCharIdx((p) => p + 1);
      }, reduceMotion ? 5 : 35);
      return () => clearTimeout(t);
    }

    // line done
    const t = setTimeout(() => {
      setCharIdx(0);
      setLineIdx((p) => p + 1);
    }, 400);
    return () => clearTimeout(t);
  }, [isTyping, lineIdx, charIdx, reduceMotion, resetAndStart]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            LIVE DEMO
          </p>
          <h2 className="mb-10 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Day in the terminal
          </h2>
        </Reveal>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]"
          style={{ background: "#0d1117" }}
        >
          {/* Scanline overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)",
            }}
          />

          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-white/30">
              ameya@cloud ~ /production
            </span>
          </div>

          <div
            ref={containerRef}
            className="max-h-[360px] overflow-y-auto p-5 font-mono text-sm leading-relaxed"
          >
            {lines.map((line, i) => {
              if (line.type === "blank") return <div key={i} className="h-4" />;
              return (
                <div
                  key={i}
                  style={{
                    color: line.type === "cmd" ? "#22c55e" : "#8b949e",
                  }}
                >
                  {line.text}
                  {line.type === "cmd" &&
                    i === lines.length - 1 &&
                    isTyping && (
                      <span
                        className="ml-0.5 inline-block h-4 w-1.5 align-middle"
                        style={{
                          background: "#22c55e",
                          animation: "terminal-blink 0.8s step-end infinite",
                        }}
                      />
                    )}
                </div>
              );
            })}
            {!isTyping && (
              <div style={{ color: "#22c55e" }}>
                <span
                  className="inline-block h-4 w-1.5 align-middle"
                  style={{
                    background: "#22c55e",
                    animation: "terminal-blink 0.8s step-end infinite",
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
