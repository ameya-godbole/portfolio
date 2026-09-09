"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  LogOut,
  Lock,
  Image,
  FileText,
  Video,
  CheckCircle2,
  AlertCircle,
  Award,
  Cloud,
  Server,
  Activity,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MediaFile = { name: string; url: string; size: number; type: string; preview?: string };
type MediaStore = Record<string, MediaFile[]>;
type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

type TabKey = "photos" | "documents" | "videos" | "certificates" | "snippets";

const TABS: { key: TabKey; label: string; icon: typeof Image; accept: string; color: string }[] = [
  { key: "photos", label: "Photos", icon: Image, accept: ".jpg,.jpeg,.png,.webp,.gif", color: "#3b82f6" },
  { key: "documents", label: "Documents", icon: FileText, accept: ".pdf,.docx,.txt", color: "#10b981" },
  { key: "videos", label: "Videos", icon: Video, accept: ".mp4,.mov,.webm", color: "#8b5cf6" },
  { key: "certificates", label: "Certificates", icon: Award, accept: ".jpg,.jpeg,.png,.webp,.gif,.pdf", color: "#f59e0b" },
  { key: "snippets", label: "Code Snippets", icon: Code2, accept: ".tf,.yml,.yaml,.py,.sh,.bash,.js,.ts,.go", color: "#06b6d4" },
];

const LANG_MAP: Record<string, { label: string; color: string }> = {
  tf:         { label: "Terraform",  color: "#7b42bc" },
  yml:        { label: "YAML",       color: "#cb171e" },
  yaml:       { label: "YAML",       color: "#cb171e" },
  py:         { label: "Python",     color: "#3572A5" },
  sh:         { label: "Shell",      color: "#89e051" },
  bash:       { label: "Bash",       color: "#89e051" },
  js:         { label: "JavaScript", color: "#f1e05a" },
  ts:         { label: "TypeScript", color: "#3178c6" },
  go:         { label: "Go",         color: "#00ADD8" },
  dockerfile: { label: "Docker",     color: "#384d54" },
};

function detectLang(filename: string): { label: string; color: string } {
  const lower = filename.toLowerCase();
  if (lower.includes("dockerfile")) return LANG_MAP.dockerfile;
  const ext = lower.split(".").pop() || "";
  return LANG_MAP[ext] || { label: ext.toUpperCase() || "Code", color: "#64748b" };
}

function CloudParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            background: `rgba(59,130,246,${0.3 + Math.random() * 0.4})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 60, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + Math.random() * 80}%`}
            y1={`${10 + Math.random() * 80}%`}
            x2={`${10 + Math.random() * 80}%`}
            y2={`${10 + Math.random() * 80}%`}
            stroke="var(--accent)"
            strokeWidth="0.5"
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </svg>
    </div>
  );
}

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <CloudParticles />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[var(--accent)]/20 via-purple-500/20 to-[var(--accent)]/20 blur-sm" />
        <div
          className="relative rounded-2xl border border-[var(--border-strong)] p-8"
          style={{ background: "rgba(17,17,19,0.8)", backdropFilter: "blur(24px)" }}
        >
          <div className="mb-8 text-center">
            <motion.div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]"
              animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.3)", "0 0 0px rgba(59,130,246,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock size={24} />
            </motion.div>
            <h1 className="mb-1 text-xl font-semibold">Admin Console</h1>
            <p className="text-sm text-[var(--muted)]">Authenticate to access media management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--muted-2)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]/50 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              {loading ? (
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Authenticating...
                </motion.span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileCard({
  file,
  onDelete,
}: {
  file: MediaFile;
  onDelete: (name: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
  const isVideo = ["mp4", "mov", "webm"].includes(ext);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${file.name}`, { method: "DELETE" });
      if (res.ok) onDelete(file.name);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative overflow-hidden rounded-xl border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_0_24px_rgba(59,130,246,0.08)]"
      style={{ background: "rgba(17,17,19,0.6)", backdropFilter: "blur(12px)" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-2)]">
        {isImage ? (
          <img src={file.url} alt={file.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : isVideo ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/10 to-[var(--surface)]">
            <Video size={32} className="text-purple-400/60" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/10 to-[var(--surface)]">
            <FileText size={32} className="text-emerald-400/60" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          <motion.button
            onClick={handleDelete}
            disabled={deleting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-red-500/90 p-2.5 text-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100"
            aria-label={`Delete ${file.name}`}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-medium text-[var(--foreground)]">
          {file.name.replace(/^\d+-/, "")}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-2)]">
            {ext.toUpperCase()}
          </span>
          <span className="font-mono text-[10px] text-[var(--muted-2)]">
            {formatSize(file.size)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SnippetCard({
  file,
  onDelete,
}: {
  file: MediaFile;
  onDelete: (name: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const lang = detectLang(file.name);
  const displayName = file.name.replace(/^\d+-/, "");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${file.name}`, { method: "DELETE" });
      if (res.ok) onDelete(file.name);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative overflow-hidden rounded-xl border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_0_24px_rgba(6,182,212,0.1)]"
      style={{ background: "rgba(17,17,19,0.6)", backdropFilter: "blur(12px)" }}
    >
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${lang.color}, ${lang.color}66)` }} />

      <div className="relative bg-[var(--surface)]/80 px-3 pt-3 pb-2">
        <div className="absolute right-2 top-2 z-10">
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold text-white"
            style={{ background: `${lang.color}cc` }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#fff", opacity: 0.7 }} />
            {lang.label}
          </span>
        </div>

        <div className="overflow-hidden rounded-md bg-[var(--background)] border border-[var(--border)] p-2">
          <pre className="overflow-hidden text-[10px] leading-[1.6] text-[var(--muted)]" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}>
            {file.preview ? (
              file.preview.split("\n").map((line: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <span className="w-4 shrink-0 select-none text-right text-[var(--muted-2)]/40">{i + 1}</span>
                  <span className="truncate">{line || " "}</span>
                </div>
              ))
            ) : (
              <span className="italic text-[var(--muted-2)]">No preview available</span>
            )}
          </pre>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[var(--foreground)]">{displayName}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--muted-2)]">
              {formatSize(file.size)}
            </span>
          </div>
        </div>
        <motion.button
          onClick={handleDelete}
          disabled={deleting}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="shrink-0 rounded-lg p-2 text-[var(--muted-2)] opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
          aria-label={`Delete ${displayName}`}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function UploadZone({
  tab,
  onUploadComplete,
}: {
  tab: (typeof TABS)[number];
  onUploadComplete: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const newUploads: UploadingFile[] = fileArr.map((f) => ({
        id: `${Date.now()}-${f.name}`,
        file: f,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploading((prev) => [...prev, ...newUploads]);

      for (const upload of newUploads) {
        const formData = new FormData();
        formData.append("file", upload.file);
        formData.append("type", tab.key);

        try {
          const progressInterval = setInterval(() => {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === upload.id && u.progress < 90
                  ? { ...u, progress: u.progress + 10 + Math.random() * 15 }
                  : u
              )
            );
          }, 200);

          const res = await fetch("/api/upload", { method: "POST", body: formData });
          clearInterval(progressInterval);

          if (res.ok) {
            setUploading((prev) =>
              prev.map((u) => (u.id === upload.id ? { ...u, progress: 100, status: "done" } : u))
            );
            onUploadComplete();
          } else {
            const err = await res.json();
            setUploading((prev) =>
              prev.map((u) =>
                u.id === upload.id ? { ...u, status: "error", error: err.error || "Upload failed" } : u
              )
            );
          }
        } catch {
          setUploading((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, status: "error", error: "Network error" } : u))
          );
        }
      }

      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => u.status === "uploading"));
      }, 3000);
    },
    [tab.key, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={dragging ? { borderColor: tab.color, boxShadow: `0 0 30px ${tab.color}22` } : {}}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300",
          dragging
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border-strong)] hover:border-[var(--muted-2)] hover:bg-[var(--surface)]/30"
        )}
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col items-center py-12 px-6 text-center">
          <motion.div
            animate={dragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: `${tab.color}15`, color: tab.color }}
          >
            <Upload size={24} />
          </motion.div>

          <p className="mb-1 text-sm font-medium text-[var(--foreground)]">
            {dragging ? "Drop files here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-[var(--muted-2)]">
            Accepted: {tab.accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}{tab.key === "snippets" ? ", Dockerfile" : ""}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-2)]">
            Max {tab.key === "videos" ? "50" : tab.key === "snippets" ? "5" : "10"}MB per file
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={tab.accept}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ boxShadow: `inset 0 0 40px ${tab.color}15` }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {uploading.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-3"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="truncate text-xs font-medium">{u.file.name}</span>
              <span className="ml-2 shrink-0">
                {u.status === "done" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </motion.span>
                )}
                {u.status === "error" && <AlertCircle size={16} className="text-red-400" />}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-3)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: u.status === "error"
                    ? "#ef4444"
                    : u.status === "done"
                    ? "#10b981"
                    : `linear-gradient(90deg, ${tab.color}, ${tab.color}cc)`,
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(u.progress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            {u.error && <p className="mt-1 text-[10px] text-red-400">{u.error}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("photos");
  const [media, setMedia] = useState<MediaStore>({});
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = (filename: string) => {
    setMedia((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].filter((f) => f.name !== filename);
      }
      return updated;
    });
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const files = media[activeTab] || [];
  const totalFiles = Object.values(media).reduce((sum, arr) => sum + arr.length, 0);
  const isSnippets = activeTab === "snippets";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <CloudParticles />

      <header
        className="sticky top-0 z-40 border-b border-[var(--border)]"
        style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(16px)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/10">
              <Cloud size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Media Console</h1>
              <p className="text-[10px] font-mono text-[var(--muted-2)] tracking-wider">ADMIN PANEL</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface)]/60 px-2 py-1">
                <Server size={10} className="text-[var(--muted-2)]" />
                <span className="font-mono text-[10px] text-[var(--muted-2)]">{totalFiles} assets</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface)]/60 px-2 py-1">
                <Activity size={10} className="text-[var(--muted-2)]" />
                <span className="font-mono text-[10px] text-[var(--muted-2)]">
                  {Object.keys(media).length} buckets
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]/40 px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count = (media[tab.key] || []).length;
            const isActive = activeTab === tab.key;

            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white shadow-lg"
                    : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)]"
                )}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${tab.color}cc, ${tab.color}88)`,
                        boxShadow: `0 4px 24px ${tab.color}33`,
                      }
                    : { background: "rgba(17,17,19,0.5)", backdropFilter: "blur(8px)" }
                }
              >
                <Icon size={16} />
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px]",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--surface-2)] text-[var(--muted-2)]"
                  )}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <UploadZone tab={currentTab} onUploadComplete={fetchMedia} />

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">
                  Uploaded {currentTab.label}
                </h2>
                <span className="font-mono text-xs text-[var(--muted-2)]">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </span>
              </div>

              {loading ? (
                <div className={cn(
                  "grid gap-4",
                  isSnippets
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                )}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={cn("animate-pulse rounded-xl bg-[var(--surface-2)]", isSnippets ? "h-48" : "aspect-[4/3]")} />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
                  <currentTab.icon size={32} className="mb-3 text-[var(--muted-2)]/40" />
                  <p className="text-sm text-[var(--muted)]">No {currentTab.label.toLowerCase()} uploaded yet</p>
                  <p className="mt-1 text-xs text-[var(--muted-2)]">
                    Drag and drop files above to get started
                  </p>
                </div>
              ) : (
                <motion.div
                  layout
                  className={cn(
                    "grid gap-4",
                    isSnippets
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  )}
                >
                  <AnimatePresence>
                    {files.map((file) =>
                      isSnippets ? (
                        <SnippetCard key={file.name} file={file} onDelete={handleDelete} />
                      ) : (
                        <FileCard key={file.name} file={file} onDelete={handleDelete} />
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/media").then((res) => {
      if (res.ok) setAuthed(true);
    }).catch(() => {});
  }, []);

  if (!authed) {
    return <LoginGate onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
