"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#expertise", label: "Expertise" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-[var(--background)]/70 border-b border-[var(--border)] py-3"
          : "py-5"
      )}
    >
      <nav className="container-page flex items-center justify-between" aria-label="Primary">
        <Link
          href="#top"
          className="text-sm font-semibold tracking-tight text-[var(--foreground)]"
        >
          {profile.initials}
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-[var(--foreground)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <a href="#contact">
            <Button size="sm">Let&rsquo;s connect</Button>
          </a>
        </div>

        <button
          className="md:hidden text-[var(--foreground)]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden container-page mt-4 pb-4">
          <ul className="flex flex-col gap-4 text-base">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
