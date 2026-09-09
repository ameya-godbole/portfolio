import { Hero } from "@/components/hero/hero";
import { Snapshot } from "@/components/hero/snapshot";
import { Showreel } from "@/components/showreel/showreel";
import { About } from "@/components/about/about";
import { ProjectsSection } from "@/components/projects/projects-section";
import { Experience } from "@/components/experience/experience";
import { Expertise } from "@/components/expertise/expertise";
import { Testimonials } from "@/components/testimonials/testimonials";
import { Contact } from "@/components/contact/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Snapshot />
      <Showreel />
      <About />
      <ProjectsSection />
      <Experience />
      <Expertise />
      <Testimonials />
      <Contact />
    </>
  );
}
