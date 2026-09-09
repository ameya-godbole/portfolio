"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, Medal, ExternalLink, Eye, X, Shield } from "lucide-react";
import {
  certificates,
  accolades,
  type Certificate,
  type Accolade,
} from "@/content/certifications";
import { Reveal } from "@/components/ui/reveal";

const statusConfig = {
  certified: { label: "Certified", bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  "in-progress": { label: "In Progress", bg: "rgba(234,179,8,0.12)", color: "#eab308" },
  expired: { label: "Expired", bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
};

const accoladeIcons = { trophy: Trophy, star: Star, award: Award, medal: Medal };

function CertCard({ cert, index }: { cert: Certificate; index: number }) {
  const reduceMotion = useReducedMotion();
  const [lightbox, setLightbox] = useState(false);
  const status = statusConfig[cert.status];
  const initials = cert.issuer
    .split(/[\s()]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1"
        style={{
          borderColor: `${cert.issuerColor}30`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${cert.issuerColor}70`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${cert.issuerColor}15`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${cert.issuerColor}30`;
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Gradient top edge */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${cert.issuerColor}, ${cert.issuerColor}60)`,
          }}
        />

        <div className="flex flex-1 flex-col p-5">
          {/* Thumbnail / initials placeholder */}
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)]"
            style={{ background: `${cert.issuerColor}15` }}
          >
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.name}
                className="h-full w-full rounded-[var(--radius-md)] object-cover"
              />
            ) : (
              <span
                className="text-lg font-bold"
                style={{ color: cert.issuerColor }}
              >
                {initials}
              </span>
            )}
          </div>

          <h3 className="mb-1 text-sm font-medium leading-snug">{cert.name}</h3>
          <p className="mb-2 text-xs text-[var(--muted-2)]">{cert.issuer}</p>

          {cert.issueDate && (
            <p className="mb-1 text-[11px] text-[var(--muted-2)]">
              Issued {cert.issueDate}
              {cert.expiryDate && <> \u00b7 Expires {cert.expiryDate}</>}
            </p>
          )}

          {cert.credentialId && (
            <p className="mb-3 font-mono text-[10px] text-[var(--muted-2)]">
              ID: {cert.credentialId}
            </p>
          )}

          {/* Status badge */}
          <div className="mb-4 mt-auto">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ background: status.bg, color: status.color }}
            >
              <Shield size={10} />
              {status.label}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {cert.image && (
              <button
                onClick={() => setLightbox(true)}
                className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
              >
                <Eye size={12} /> View
              </button>
            )}
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
              >
                <ExternalLink size={12} /> Verify
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && cert.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              onClick={() => setLightbox(false)}
            >
              <X size={24} />
            </button>
            <img
              src={cert.image}
              alt={cert.name}
              className="max-h-[80vh] max-w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccoladeCard({ acc, index }: { acc: Accolade; index: number }) {
  const reduceMotion = useReducedMotion();
  const Icon = accoladeIcons[acc.icon] || Trophy;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-300 hover:border-[var(--border-strong)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)]">
        <Icon size={18} className="text-[var(--accent)]" />
      </div>
      <div>
        <h4 className="text-sm font-medium">{acc.title}</h4>
        <p className="mb-1 text-xs text-[var(--muted-2)]">
          {acc.issuer} \u00b7 {acc.date}
        </p>
        <p className="text-[13px] leading-relaxed text-[var(--muted)]">
          {acc.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            CREDENTIALS
          </p>
          <h2 className="mb-14 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Certifications &amp; Accolades
          </h2>
        </Reveal>

        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {accolades.length > 0 && (
          <>
            <Reveal>
              <h3 className="mb-6 text-lg font-medium tracking-tight">
                Accolades &amp; Recognition
              </h3>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {accolades.map((acc, i) => (
                <AccoladeCard key={acc.id} acc={acc} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
