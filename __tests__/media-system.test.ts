import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync, existsSync } from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "..");

describe("Media Management System - File Structure", () => {
  it("upload directories exist", () => {
    const dirs = ["photos", "documents", "videos", "certificates", "snippets"];
    for (const dir of dirs) {
      const dirPath = path.join(projectRoot, "public", "uploads", dir);
      expect(existsSync(dirPath)).toBe(true);
    }
  });

  it("gitkeep files exist in upload directories", () => {
    const dirs = ["photos", "documents", "videos", "certificates", "snippets"];
    for (const dir of dirs) {
      const gitkeep = path.join(projectRoot, "public", "uploads", dir, ".gitkeep");
      expect(existsSync(gitkeep)).toBe(true);
    }
  });
});

describe("Media Management System - API Routes", () => {
  it("upload route exists and exports POST", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "upload", "route.ts");
    expect(existsSync(routePath)).toBe(true);
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("export async function POST");
    expect(content).toContain("snippets");
    expect(content).toContain("certificates");
    expect(content).toContain(".tf");
    expect(content).toContain(".yml");
    expect(content).toContain(".py");
    expect(content).toContain(".go");
    expect(content).toContain("dockerfile");
  });

  it("media list route exists and exports GET", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "media", "route.ts");
    expect(existsSync(routePath)).toBe(true);
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("export async function GET");
    expect(content).toContain("snippets");
    expect(content).toContain("certificates");
    expect(content).toContain("preview");
  });

  it("media delete route exists and exports DELETE", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "media", "[filename]", "route.ts");
    expect(existsSync(routePath)).toBe(true);
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("export async function DELETE");
    expect(content).toContain("snippets");
    expect(content).toContain("certificates");
  });

  it("login route exists and exports POST", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "admin", "login", "route.ts");
    expect(existsSync(routePath)).toBe(true);
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("export async function POST");
    expect(content).toContain("ADMIN_PASSWORD");
    expect(content).toContain("portfolio2024");
    expect(content).toContain("admin_session");
  });

  it("logout route exists and exports POST", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "admin", "logout", "route.ts");
    expect(existsSync(routePath)).toBe(true);
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("export async function POST");
    expect(content).toContain("admin_session");
    expect(content).toContain("maxAge: 0");
  });
});

describe("Media Management System - Middleware", () => {
  it("middleware exists and protects admin/upload routes", () => {
    const mwPath = path.join(projectRoot, "src", "middleware.ts");
    expect(existsSync(mwPath)).toBe(true);
    const content = readFileSync(mwPath, "utf-8");
    expect(content).toContain("/admin");
    expect(content).toContain("/api/upload");
    expect(content).toContain("admin_session");
  });
});

describe("Media Management System - Components", () => {
  it("admin page exists with all tabs including snippets and certificates", () => {
    const adminPath = path.join(projectRoot, "src", "app", "admin", "page.tsx");
    expect(existsSync(adminPath)).toBe(true);
    const content = readFileSync(adminPath, "utf-8");
    expect(content).toContain('"photos"');
    expect(content).toContain('"documents"');
    expect(content).toContain('"videos"');
    expect(content).toContain('"certificates"');
    expect(content).toContain('"snippets"');
    expect(content).toContain("Code Snippets");
    expect(content).toContain("SnippetCard");
    expect(content).toContain("detectLang");
    expect(content).toContain("LoginGate");
    expect(content).toContain("CloudParticles");
  });

  it("admin page has language detection with colors", () => {
    const adminPath = path.join(projectRoot, "src", "app", "admin", "page.tsx");
    const content = readFileSync(adminPath, "utf-8");
    expect(content).toContain("Terraform");
    expect(content).toContain("Python");
    expect(content).toContain("TypeScript");
    expect(content).toContain("Go");
    expect(content).toContain("Docker");
    expect(content).toContain("Shell");
    expect(content).toContain("YAML");
    expect(content).toContain("JavaScript");
  });

  it("admin page SnippetCard shows code preview", () => {
    const adminPath = path.join(projectRoot, "src", "app", "admin", "page.tsx");
    const content = readFileSync(adminPath, "utf-8");
    expect(content).toContain("file.preview");
    expect(content).toContain("No preview available");
  });

  it("gallery component exists with lightbox and masonry layout", () => {
    const galleryPath = path.join(projectRoot, "src", "components", "gallery", "gallery.tsx");
    expect(existsSync(galleryPath)).toBe(true);
    const content = readFileSync(galleryPath, "utf-8");
    expect(content).toContain("Lightbox");
    expect(content).toContain("columns-1");
    expect(content).toContain("sm:columns-2");
    expect(content).toContain("lg:columns-3");
    expect(content).toContain("id=\"gallery\"");
    expect(content).toContain("/api/media");
  });

  it("documents component exists with styled cards", () => {
    const docsPath = path.join(projectRoot, "src", "components", "documents", "documents.tsx");
    expect(existsSync(docsPath)).toBe(true);
    const content = readFileSync(docsPath, "utf-8");
    expect(content).toContain("id=\"documents\"");
    expect(content).toContain("getDocColor");
    expect(content).toContain("Download");
    expect(content).toContain("/api/media");
  });
});

describe("Media Management System - Integration", () => {
  it("page.tsx includes Gallery and Documents", () => {
    const pagePath = path.join(projectRoot, "src", "app", "page.tsx");
    const content = readFileSync(pagePath, "utf-8");
    expect(content).toContain('import { Gallery }');
    expect(content).toContain('import { Documents }');
    expect(content).toContain("<Gallery />");
    expect(content).toContain("<Documents />");
  });

  it("navbar includes Gallery and Documents links", () => {
    const navPath = path.join(projectRoot, "src", "components", "navigation", "navbar.tsx");
    const content = readFileSync(navPath, "utf-8");
    expect(content).toContain('#gallery');
    expect(content).toContain('#documents');
    expect(content).toContain('"Gallery"');
    expect(content).toContain('"Documents"');
  });

  it("showreel checks for uploaded videos", () => {
    const showreelPath = path.join(projectRoot, "src", "components", "showreel", "showreel.tsx");
    const content = readFileSync(showreelPath, "utf-8");
    expect(content).toContain("/api/media");
    expect(content).toContain("data.videos");
  });

  it("page.tsx preserves all existing components", () => {
    const pagePath = path.join(projectRoot, "src", "app", "page.tsx");
    const content = readFileSync(pagePath, "utf-8");
    expect(content).toContain("<Hero />");
    expect(content).toContain("<Snapshot />");
    expect(content).toContain("<CloudBadges />");
    expect(content).toContain("<Showreel />");
    expect(content).toContain("<About />");
    expect(content).toContain("<ProjectsSection />");
    expect(content).toContain("<TerminalSection />");
    expect(content).toContain("<SnippetsSection />");
    expect(content).toContain("<Experience />");
    expect(content).toContain("<Expertise />");
    expect(content).toContain("<Certifications />");
    expect(content).toContain("<Testimonials />");
    expect(content).toContain("<Contact />");
  });
});

describe("Media Management System - Upload API Validation", () => {
  it("upload route validates snippet file extensions", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "upload", "route.ts");
    const content = readFileSync(routePath, "utf-8");
    const snippetExts = [".tf", ".yml", ".yaml", ".py", ".sh", ".bash", ".js", ".ts", ".go", ".dockerfile"];
    for (const ext of snippetExts) {
      expect(content).toContain(ext);
    }
  });

  it("upload route has 5MB limit for snippets", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "upload", "route.ts");
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("snippets: 5 * 1024 * 1024");
  });

  it("media route reads snippet preview (first 5 lines)", () => {
    const routePath = path.join(projectRoot, "src", "app", "api", "media", "route.ts");
    const content = readFileSync(routePath, "utf-8");
    expect(content).toContain("slice(0, 5)");
    expect(content).toContain("preview");
  });
});
