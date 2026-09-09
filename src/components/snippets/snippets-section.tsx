"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp, FileCode2 } from "lucide-react";
import { snippets, type CodeSnippet } from "@/content/snippets";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const COLLAPSED_LINES = 15;

const langColors: Record<string, string> = {
  terraform: "var(--lang-terraform)",
  ansible: "var(--lang-ansible)",
  python: "var(--lang-python)",
  bash: "var(--lang-bash)",
  yaml: "var(--lang-yaml)",
  dockerfile: "var(--lang-docker)",
  go: "var(--lang-go)",
  javascript: "var(--lang-javascript)",
  typescript: "var(--lang-typescript)",
  other: "var(--lang-other)",
};

const langLabels: Record<string, string> = {
  terraform: "Terraform",
  ansible: "Ansible",
  python: "Python",
  bash: "Bash",
  yaml: "YAML",
  dockerfile: "Dockerfile",
  go: "Go",
  javascript: "JavaScript",
  typescript: "TypeScript",
  other: "Other",
};

type HighlightedToken = { text: string; color: string };

const kwSets: Record<string, { kw: string[]; builtin: string[]; str: RegExp; comment: RegExp }> = {
  terraform: {
    kw: ["resource", "data", "variable", "output", "module", "provider", "locals", "terraform"],
    builtin: ["aws_launch_template", "aws_autoscaling_group", "aws_security_group", "aws_ami", "aws_instance"],
    str: /"[^"]*"/g,
    comment: /#.*/g,
  },
  python: {
    kw: ["import", "from", "def", "class", "return", "if", "else", "for", "in", "with", "as", "try", "except", "raise", "not", "and", "or", "True", "False", "None"],
    builtin: ["print", "range", "len", "int", "str", "dict", "list", "set", "type", "isinstance"],
    str: /(?:"[^"]*"|'[^']*'|f"[^"]*"|f'[^']*')/g,
    comment: /#.*/g,
  },
  bash: {
    kw: ["if", "then", "else", "fi", "for", "do", "done", "while", "case", "esac", "function", "set", "export", "local", "readonly", "return", "exit", "echo", "read", "shift"],
    builtin: ["kubectl", "helm", "terraform", "docker", "git", "awk", "sed", "grep", "wc", "xargs"],
    str: /"[^"]*"/g,
    comment: /#.*/g,
  },
  ansible: {
    kw: ["name", "hosts", "become", "vars", "tasks", "handlers", "roles", "when", "register", "notify", "with_items", "loop", "block", "rescue", "always"],
    builtin: ["file", "get_url", "unarchive", "systemd", "apt", "yum", "copy", "template", "service", "command", "shell", "debug"],
    str: /"[^"]*"/g,
    comment: /#.*/g,
  },
  yaml: {
    kw: ["true", "false", "null", "yes", "no"],
    builtin: [],
    str: /"[^"]*"|'[^']*'/g,
    comment: /#.*/g,
  },
  dockerfile: {
    kw: ["FROM", "RUN", "CMD", "ENTRYPOINT", "COPY", "ADD", "ENV", "ARG", "WORKDIR", "EXPOSE", "VOLUME", "USER", "LABEL", "HEALTHCHECK"],
    builtin: [],
    str: /"[^"]*"/g,
    comment: /#.*/g,
  },
  go: {
    kw: ["package", "import", "func", "var", "const", "type", "struct", "interface", "return", "if", "else", "for", "range", "switch", "case", "defer", "go", "chan", "select", "break", "continue"],
    builtin: ["fmt", "log", "http", "os", "strings", "strconv", "errors", "context"],
    str: /"[^"]*"|`[^`]*`/g,
    comment: /\/\/.*/g,
  },
  javascript: {
    kw: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "default", "async", "await", "try", "catch", "throw", "new", "this"],
    builtin: ["console", "document", "window", "fetch", "Promise", "JSON", "Math", "Array", "Object"],
    str: /(?:"[^"]*"|'[^']*'|`[^`]*`)/g,
    comment: /\/\/.*/g,
  },
  typescript: {
    kw: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "default", "async", "await", "try", "catch", "throw", "new", "this", "type", "interface", "extends", "implements"],
    builtin: ["console", "document", "window", "fetch", "Promise", "JSON", "Math", "Array", "Object"],
    str: /(?:"[^"]*"|'[^']*'|`[^`]*`)/g,
    comment: /\/\/.*/g,
  },
};

function highlightLine(line: string, lang: string): HighlightedToken[] {
  const cfg = kwSets[lang] || kwSets.bash;
  const tokens: HighlightedToken[] = [];

  // Simple token-based highlighting
  const commentMatch = line.match(cfg.comment);
  if (commentMatch && lang !== "ansible") {
    const commentStart = line.indexOf(commentMatch[0]);
    if (commentStart === 0) {
      return [{ text: line, color: "#6a737d" }];
    }
    const before = line.slice(0, commentStart);
    const comment = line.slice(commentStart);
    return [...highlightLine(before, lang), { text: comment, color: "#6a737d" }];
  }

  // Split by words while preserving whitespace and symbols
  const parts = line.split(/(\s+|[{}()\[\]=,;:'"<>|&$!`@#])/);
  for (const part of parts) {
    if (!part) continue;
    if (cfg.kw.includes(part)) {
      tokens.push({ text: part, color: "#ff7b72" });
    } else if (cfg.builtin.includes(part)) {
      tokens.push({ text: part, color: "#d2a8ff" });
    } else if (/^["'`]/.test(part) || /^f["']/.test(part)) {
      tokens.push({ text: part, color: "#a5d6ff" });
    } else if (/^\d+$/.test(part)) {
      tokens.push({ text: part, color: "#79c0ff" });
    } else if (/^[{}()\[\]=,;:<>|&$!@#]$/.test(part)) {
      tokens.push({ text: part, color: "#8b949e" });
    } else {
      tokens.push({ text: part, color: "#c9d1d9" });
    }
  }

  return tokens;
}

function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lines = snippet.code.split("\n");
  const isLong = lines.length > COLLAPSED_LINES;
  const visibleLines = expanded ? lines : lines.slice(0, COLLAPSED_LINES);
  const color = langColors[snippet.language] || langColors.other;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet.code]);

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]"
      style={{ background: "#0d1117" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {snippet.filename && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-white/50">
              <FileCode2 size={12} />
              {snippet.filename}
            </span>
          )}
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
              color,
            }}
          >
            {langLabels[snippet.language] || snippet.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-relaxed">
          <code>
            {visibleLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-white/15">
                  {i + 1}
                </span>
                <span>
                  {highlightLine(line, snippet.language).map((tok, j) => (
                    <span key={j} style={{ color: tok.color }}>
                      {tok.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Expand/collapse */}
      {isLong && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex w-full items-center justify-center gap-1 border-t border-white/5 py-2.5 text-[11px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={12} /> Show all {lines.length} lines
            </>
          )}
        </button>
      )}
    </div>
  );
}

function SnippetCard({
  snippet,
  index,
}: {
  snippet: CodeSnippet;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const color = langColors[snippet.language] || langColors.other;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">{snippet.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{snippet.description}</p>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-[var(--muted-2)]">
          {snippet.createdAt}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] text-[var(--muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <CodeBlock snippet={snippet} />
    </motion.div>
  );
}

const allLanguages = Array.from(new Set(snippets.map((s) => s.language)));

export function SnippetsSection() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? snippets
      : snippets.filter((s) => s.language === filter);

  return (
    <section id="snippets" className="py-28 md:py-36">
      <div className="container-page">
        <Reveal>
          <p className="mb-3 font-mono text-xs tracking-widest text-[var(--accent)]">
            INFRASTRUCTURE AS CODE
          </p>
          <h2 className="mb-4 text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Code Snippets
          </h2>
          <p className="mb-10 max-w-lg text-[var(--muted)]">
            Real-world infrastructure code from production environments and
            automation projects.
          </p>
        </Reveal>

        {/* Filter bar */}
        <Reveal delay={0.05}>
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                filter === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
              )}
            >
              All
            </button>
            {allLanguages.map((lang) => {
              const color = langColors[lang] || langColors.other;
              const isActive = filter === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                  style={
                    isActive
                      ? {
                          borderColor: color,
                          background: `color-mix(in srgb, ${color} 10%, transparent)`,
                          color,
                        }
                      : undefined
                  }
                >
                  {langLabels[lang] || lang}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="space-y-12">
          {filtered.map((snippet, i) => (
            <SnippetCard key={snippet.id} snippet={snippet} index={i} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-[var(--muted)]">
              No snippets for this language yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
