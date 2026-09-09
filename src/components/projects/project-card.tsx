"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/content/projects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function VideoThumbnail({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (project.video?.provider === "local" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setHovering(true);
  }, [project.video]);

  const handleMouseLeave = useCallback(() => {
    if (project.video?.provider === "local" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setHovering(false);
  }, [project.video]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={project.thumbnail}
        alt={`${project.title} preview`}
        fill
        sizes="(min-width: 768px) 320px, 100vw"
        className={cn(
          "object-cover transition-all duration-500",
          hovering && project.video?.provider === "local" ? "opacity-0" : "group-hover:scale-105"
        )}
      />

      {project.video?.provider === "local" && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            hovering ? "opacity-100" : "opacity-0"
          )}
          muted
          playsInline
          loop
          preload="none"
          poster={project.thumbnail}
        >
          <source src={project.video.src} type="video/mp4" />
        </video>
      )}

      {project.video && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          hovering ? "opacity-0" : "opacity-100"
        )}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/90 text-[var(--accent-foreground)] backdrop-blur-sm">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
      )}

      {project.video?.duration && (
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {project.video.duration}
        </span>
      )}
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border-b border-[var(--border)] py-10 first:pt-0 last:border-0"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1.1fr_1.4fr] md:items-center md:gap-10">
        <span className="font-mono text-xs text-[var(--muted-2)]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <VideoThumbnail project={project} />

        <div>
          {/* Role badge, year, company */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--accent-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
              {project.role}
            </span>
            <span className="text-xs text-[var(--muted-2)]">
              {project.company} \u00B7 {project.year}
            </span>
          </div>

          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-xl font-medium tracking-tight md:text-2xl">
              {project.title}
            </h3>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--accent)]"
              aria-hidden
            />
          </div>
          <p className="mb-4 max-w-md text-sm text-[var(--muted)]">{project.subtitle}</p>

          {/* Tech stack chips */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge className="text-[var(--muted-2)]">+{project.technologies.length - 5}</Badge>
            )}
          </div>

          {/* Metrics + CTA */}
          <div className="flex items-center gap-4">
            {project.metrics[0] && (
              <p className="text-sm font-medium text-[var(--accent)]">{project.metrics[0]}</p>
            )}
            <span className="text-xs font-medium text-[var(--muted)] transition-colors group-hover:text-[var(--foreground)]">
              View case study \u2192
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
