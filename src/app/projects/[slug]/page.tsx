import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { projects, getProjectBySlug, getAdjacentProject } from "@/content/projects";
import { profile } from "@/content/profile";
import { VideoPlayer } from "@/components/project-video/video-player";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: `${project.title} \u2014 ${profile.name}`,
      description: project.subtitle,
      images: [{ url: project.thumbnail }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.subtitle,
      images: [project.thumbnail],
    },
  };
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted-2)]">
        {label}
      </p>
      <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
        {children}
      </p>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getAdjacentProject(slug);

  return (
    <article className="py-32">
      <div className="container-page">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            {project.company} \u00b7 {project.year}
          </p>
          <h1 className="mb-4 max-w-3xl text-balance text-3xl font-medium tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mb-10 max-w-xl text-balance text-lg text-[var(--muted)]">
            {project.subtitle}
          </p>
        </Reveal>

        {project.video && (
          <Reveal delay={0.05}>
            <VideoPlayer video={project.video} slug={project.slug} className="mb-14" />
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <div className="space-y-6 md:sticky md:top-32">
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-[var(--muted-2)]">
                  Role
                </p>
                <p className="text-sm">{project.role}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-[var(--muted-2)]">
                  Team
                </p>
                <p className="text-sm">{project.team}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-[var(--muted-2)]">
                  Duration
                </p>
                <p className="text-sm">{project.duration}</p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-[var(--muted-2)]">
                  Technology
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>

              {(project.links?.github || project.links?.live) && (
                <div className="flex flex-col gap-2 pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      <GithubIcon size={14} /> View code
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      <ExternalLink size={14} /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <div className="space-y-12">
            <Reveal>
              <DetailBlock label="Problem">{project.problem}</DetailBlock>
            </Reveal>
            <Reveal delay={0.05}>
              <DetailBlock label="Context">{project.context}</DetailBlock>
            </Reveal>
            <Reveal delay={0.1}>
              <DetailBlock label="My contribution">{project.contribution}</DetailBlock>
            </Reveal>
            <Reveal delay={0.15}>
              <DetailBlock label="Approach">{project.approach}</DetailBlock>
            </Reveal>
            {project.architecture && (
              <Reveal delay={0.2}>
                <DetailBlock label="Architecture">{project.architecture}</DetailBlock>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--muted-2)]">
                  Outcomes
                </p>
                <ul className="space-y-2">
                  {project.outcomes.map((o) => (
                    <li key={o} className="text-[15px] text-[var(--muted)]">
                      \u2014 {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {project.metrics.length > 0 && (
              <Reveal delay={0.25}>
                <div className="flex flex-wrap gap-3">
                  {project.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--accent)]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {project.lessons && (
              <Reveal delay={0.3}>
                <DetailBlock label="Lessons learned">{project.lessons}</DetailBlock>
              </Reveal>
            )}
          </div>
        </div>

        {next && next.slug !== project.slug && (
          <div className="mt-28 border-t border-[var(--border)] pt-10">
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center justify-between"
            >
              <div>
                <p className="mb-1 text-xs uppercase tracking-widest text-[var(--muted-2)]">
                  Next project
                </p>
                <p className="text-xl font-medium tracking-tight group-hover:text-[var(--accent)]">
                  {next.title}
                </p>
              </div>
              <ArrowRight
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
