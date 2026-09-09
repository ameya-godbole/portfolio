"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type Photo = { name: string; url: string; size: number };

function Lightbox({
  photos,
  index,
  onClose,
  onNav,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onNav]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ backdropFilter: "blur(24px)", background: "rgba(0,0,0,0.85)" }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>

      {/* Nav left */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(-1); }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={photo.url}
        src={photo.url}
        alt={photo.name}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Nav right */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(1); }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-white/70 backdrop-blur">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const reduceMotion = useReducedMotion();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        if (data.photos) setPhotos(data.photos);
      })
      .catch(() => {});
  }, []);

  const handleNav = useCallback(
    (dir: -1 | 1) => {
      if (lightboxIndex === null) return;
      setLightboxIndex((prev) => {
        if (prev === null) return null;
        const next = prev + dir;
        if (next < 0) return photos.length - 1;
        if (next >= photos.length) return 0;
        return next;
      });
    },
    [lightboxIndex, photos.length]
  );

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="relative py-28 md:py-36 overflow-hidden">
      {/* Circuit-board / grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
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
            GALLERY
          </p>
          <h2 className="mb-14 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Visual snapshots
          </h2>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.url}
              initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative mb-4 cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] break-inside-avoid"
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={photo.url}
                alt={photo.name.replace(/^\d+-/, "")}
                className="block w-full transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex w-full items-center justify-between">
                  <p className="truncate text-sm font-medium text-white">
                    {photo.name.replace(/^\d+-/, "")}
                  </p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={handleNav}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
