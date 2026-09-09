"use client";

import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-xs text-[var(--muted-2)] md:flex-row">
        <span>
          \u00A9 {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
        <a
          href={profile.resumeUrl}
          download
          onClick={() => track({ name: "resume_downloaded" })}
          className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          Download r\u00E9sum\u00E9
        </a>
      </div>
    </footer>
  );
}
