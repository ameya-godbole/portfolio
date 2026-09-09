import { getFeaturedProjects } from "@/content/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";

export function ProjectsSection() {
  const featured = getFeaturedProjects();

  return (
    <section id="projects" className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            SELECTED WORK
          </p>
          <h2 className="mb-14 max-w-xl text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Projects that turned complex problems into measurable outcomes.
          </h2>
        </Reveal>

        <div>
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
