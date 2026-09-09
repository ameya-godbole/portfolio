"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useState, useRef, useCallback } from "react";

type ShowreelConfig = {
  provider: "local" | "youtube" | "vimeo";
  src: string;
  poster: string;
  title: string;
  subtitle: string;
};

const showreelData: ShowreelConfig = {
  provider: "local",
  src: "/videos/showreel.mp4",
  poster: "/images/projects/placeholder-1.jpg",
  title: "See my work in action",
  subtitle: "A curated walkthrough of key projects, architectural decisions, and outcomes \u2014 in under 3 minutes.",
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function Showreel() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    if (showreelData.provider === "local" && videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      setPlaying(true);
    }
  }, []);

  const youtubeId = showreelData.provider === "youtube" ? extractYouTubeId(showreelData.src) : null;
  const vimeoId = showreelData.provider === "vimeo" ? extractVimeoId(showreelData.src) : null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex items-center gap-3">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <p className="font-mono text-xs tracking-widest text-[var(--accent)]">
              FEATURED REEL
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-black">
            {!playing ? (
              <button
                onClick={handlePlay}
                className="group relative block w-full"
                aria-label={`Play showreel: ${showreelData.title}`}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={showreelData.poster}
                    alt="Showreel preview"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-2xl shadow-[var(--accent)]/20 md:h-24 md:w-24"
                  >
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-medium text-white md:text-2xl">
                    {showreelData.title}
                  </h3>
                  <p className="max-w-md text-center text-sm text-white/70">
                    {showreelData.subtitle}
                  </p>
                </div>
              </button>
            ) : (
              <div className="aspect-video w-full">
                {showreelData.provider === "local" && (
                  <video
                    ref={videoRef}
                    className="h-full w-full"
                    autoPlay
                    controls
                    playsInline
                    onEnded={() => setPlaying(false)}
                  >
                    <source src={showreelData.src} type="video/mp4" />
                  </video>
                )}
                {showreelData.provider === "youtube" && youtubeId && (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={showreelData.title}
                  />
                )}
                {showreelData.provider === "vimeo" && vimeoId && (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                    className="h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={showreelData.title}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
