"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Download, File } from "lucide-react";

type DocFile = { name: string; url: string; size: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "#3b82f6";
  if (ext === "docx" || ext === "doc") return "#10b981";
  return "#8b5cf6";
}

function getDocLabel(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase() || "FILE";
  return ext;
}

export function Documents() {
  const reduceMotion = useReducedMotion();
  const [docs, setDocs] = useState<DocFile[]>([]);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        if (data.documents) setDocs(data.documents);
      })
      .catch(() => {});
  }, []);

  if (docs.length === 0) return null;

  return (
    <section id="documents" className="relative py-28 md:py-36 overflow-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-page relative">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            RESOURCES
          </p>
          <h2 className="mb-14 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Documents & files
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc, i) => {
            const color = getDocColor(doc.name);
            const displayName = doc.name.replace(/^\d+-/, "");

            return (
              <motion.a
                key={doc.url}
                href={doc.url}
                download
                initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[var(--border-strong)]"
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: color,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <FileText size={22} style={{ color }} />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{displayName}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
                      style={{ background: `${color}cc` }}
                    >
                      {getDocLabel(doc.name)}
                    </span>
                    <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-2)]">
                      {formatSize(doc.size)}
                    </span>
                  </div>
                </div>

                {/* Download button */}
                <motion.div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors group-hover:border-[var(--accent)]/30 group-hover:text-[var(--accent)]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="inline-flex"
                    initial={false}
                    whileHover={{ y: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Download size={16} />
                  </motion.div>
                </motion.div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
