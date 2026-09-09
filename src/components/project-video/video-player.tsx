"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import type { ProjectVideo } from "@/content/projects";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function YouTubeEmbed({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const videoId = extractYouTubeId(src);

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center bg-[var(--surface)] text-sm text-[var(--muted)]">
        Invalid YouTube URL
      </div>
    );
  }

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="group relative aspect-video w-full overflow-hidden"
        aria-label={`Play video: ${alt}`}
      >
        <img
          src={poster}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play size={24} fill="currentColor" />
          </span>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
      className="aspect-video w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={alt}
    />
  );
}

function VimeoEmbed({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const vimeoId = extractVimeoId(src);

  if (!vimeoId) {
    return (
      <div className="flex aspect-video items-center justify-center bg-[var(--surface)] text-sm text-[var(--muted)]">
        Invalid Vimeo URL
      </div>
    );
  }

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="group relative aspect-video w-full overflow-hidden"
        aria-label={`Play video: ${alt}`}
      >
        <img
          src={poster}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play size={24} fill="currentColor" />
          </span>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
      className="aspect-video w-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title={alt}
    />
  );
}

function LocalVideo({
  video,
  slug,
  autoplayOnHover,
}: {
  video: ProjectVideo;
  slug: string;
  autoplayOnHover?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showPoster, setShowPoster] = useState(true);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
      setShowPoster(false);
      track({ name: "project_video_played", slug });
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [slug]);

  const handleMouseEnter = useCallback(() => {
    if (!autoplayOnHover || !ref.current) return;
    ref.current.play();
    setPlaying(true);
    setShowPoster(false);
  }, [autoplayOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (!autoplayOnHover || !ref.current) return;
    ref.current.pause();
    setPlaying(false);
  }, [autoplayOnHover]);

  const toggleFullscreen = useCallback(() => {
    if (ref.current?.requestFullscreen) {
      ref.current.requestFullscreen();
    }
  }, []);

  return (
    <div
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={ref}
        className="aspect-video w-full bg-black"
        poster={video.poster}
        preload="none"
        playsInline
        muted={muted}
        aria-label={video.alt}
        onPlay={() => { setPlaying(true); setShowPoster(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setShowPoster(true); }}
      >
        <source src={video.src} type="video/mp4" />
        {video.caption && <track kind="captions" src={video.caption} default />}
      </video>

      {/* Poster overlay with play button */}
      {showPoster && !playing && (
        <button
          onClick={toggle}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg transition-transform duration-300 hover:scale-110">
            <Play size={24} fill="currentColor" />
          </span>
          {video.duration && (
            <span className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2 py-1 font-mono text-xs text-white">
              {video.duration}
            </span>
          )}
        </button>
      )}

      {/* Custom controls bar */}
      {!showPoster && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="text-white/90 hover:text-white"
          >
            {playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            onClick={() => {
              if (ref.current) ref.current.muted = !muted;
              setMuted(!muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-white/90 hover:text-white"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
            className="text-white/90 hover:text-white"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export function VideoPlayer({
  video,
  slug,
  className,
  autoplayOnHover,
  compact,
}: {
  video: ProjectVideo;
  slug: string;
  className?: string;
  autoplayOnHover?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg)] bg-black", className)}>
      {video.provider === "youtube" && (
        <YouTubeEmbed src={video.src} poster={video.poster} alt={video.alt} />
      )}
      {video.provider === "vimeo" && (
        <VimeoEmbed src={video.src} poster={video.poster} alt={video.alt} />
      )}
      {(video.provider === "local" || video.provider === "mux") && (
        <LocalVideo
          video={video}
          slug={slug}
          autoplayOnHover={autoplayOnHover}
        />
      )}
    </div>
  );
}
