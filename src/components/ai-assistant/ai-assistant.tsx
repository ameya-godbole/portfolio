"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

const quickActions = [
  "What's Ameya's stack?",
  "Show me CI/CD projects",
  "Is Ameya open to work?",
] as const;

const responses: Record<string, string> = {
  "What's Ameya's stack?":
    "Ameya's core stack includes Kubernetes, Helm, Terraform, AWS, Spinnaker, Jenkins, Docker, Python (Boto3), and Splunk for observability. He's currently deepening his AWS Solutions Architect knowledge.",
  "Show me CI/CD projects":
    "Ameya has built 3 notable CI/CD pipelines: a Jenkins+Ansible deployment pipeline at ShaaySoft, a native AWS CodePipeline at Mastercard, and Spinnaker-based release pipelines at Ericsson. Check the Projects section for full case studies.",
  "Is Ameya open to work?":
    "Yes! Ameya is open to senior DevOps, Cloud Engineering, and Platform Engineering roles in Dublin and remotely. Hit the Contact section to reach out.",
};

const fallback =
  "I'm Ameya's AI assistant \u2014 I can tell you about his experience, projects, and skills. Try one of the quick questions above!";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function reply(userText: string) {
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setTyping(true);
    setTimeout(() => {
      const answer = responses[userText] ?? fallback;
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      setTyping(false);
    }, 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    reply(trimmed);
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
        style={{ animation: open ? undefined : "pulse-glow 3s ease-in-out infinite" }}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            style={{
              background: "rgba(17,17,19,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              maxHeight: "min(520px, calc(100vh - 8rem))",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3.5">
              <Sparkles size={16} className="text-[var(--accent)]" />
              <span className="text-sm font-medium">AI Assistant</span>
              <span className="ml-auto rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] text-green-400">
                Online
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: 200 }}>
              {messages.length === 0 && (
                <p className="mb-3 text-center text-xs text-[var(--muted-2)]">
                  Ask me about Ameya&rsquo;s experience
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-[var(--accent)] text-white"
                        : "bg-white/5 text-[var(--muted)]"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-xl bg-white/5 px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--muted-2)]"
                        style={{
                          animation: `float 1.2s ease-in-out ${d * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick actions */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-3">
                {quickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => reply(q)}
                    className="rounded-full border border-[var(--accent)]/30 px-3 py-1.5 text-[11px] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/5 px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ameya\u2026"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-2)]"
              />
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-opacity hover:opacity-90"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
