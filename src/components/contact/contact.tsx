import { Mail, Calendar } from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function Contact() {
  return (
    <section id="contact" className="py-28 md:py-36">
      <div className="container-page grid grid-cols-1 gap-16 md:grid-cols-2">
        <Reveal>
          <div>
            <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
              CONTACT
            </p>
            <h2 className="mb-4 text-balance text-3xl font-medium tracking-tight md:text-4xl">
              {profile.contact.headline}
            </h2>
            <p className="mb-10 max-w-sm text-[var(--muted)]">{profile.contact.subline}</p>

            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  <Mail size={16} /> {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  <LinkedinIcon size={16} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  <GithubIcon size={16} /> GitHub
                </a>
              </li>
              {profile.calendly && (
                <li>
                  <a
                    href={profile.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[var(--foreground)] hover:text-[var(--accent)]"
                  >
                    <Calendar size={16} /> Book a call
                  </a>
                </li>
              )}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
