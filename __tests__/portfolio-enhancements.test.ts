import * as fs from "fs";
import * as path from "path";

const SRC = path.join(__dirname, "..", "src");
const APP = path.join(SRC, "app");
const COMP = path.join(SRC, "components");
const CONTENT = path.join(SRC, "content");

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  \u2717 ${name}: ${msg}`);
    process.exitCode = 1;
  }
}

function expect(val: unknown) {
  return {
    toBe(expected: unknown) {
      if (val !== expected) throw new Error(`Expected ${expected}, got ${val}`);
    },
    toContain(str: string) {
      if (typeof val !== "string" || !val.includes(str))
        throw new Error(`Expected string to contain "${str}"`);
    },
    toBeGreaterThan(n: number) {
      if (typeof val !== "number" || val <= n)
        throw new Error(`Expected ${val} > ${n}`);
    },
    toBeLessThan(n: number) {
      if (typeof val !== "number" || val >= n)
        throw new Error(`Expected ${val} < ${n}`);
    },
  };
}

console.log("\n=== File structure ===");
const requiredFiles = [
  "app/globals.css", "app/layout.tsx", "app/page.tsx", "app/admin/page.tsx",
  "components/hero/hero.tsx", "components/hero/snapshot.tsx",
  "components/ai-assistant/ai-assistant.tsx", "components/ui/cloud-badges.tsx",
  "components/terminal/terminal.tsx", "components/certifications/certifications.tsx",
  "components/snippets/snippets-section.tsx", "components/navigation/navbar.tsx",
  "content/certifications.ts", "content/snippets.ts",
];
for (const f of requiredFiles) {
  test(`${f} exists`, () => expect(fs.existsSync(path.join(SRC, f))).toBe(true));
}

console.log("\n=== globals.css ===");
const css = fs.readFileSync(path.join(APP, "globals.css"), "utf-8");
test("bg-grid", () => expect(css).toContain(".bg-grid"));
test("bg-circuit", () => expect(css).toContain(".bg-circuit"));
test("pulse-glow keyframes", () => expect(css).toContain("@keyframes pulse-glow"));
test("float keyframes", () => expect(css).toContain("@keyframes float"));
test("data-flow keyframes", () => expect(css).toContain("@keyframes data-flow"));
test("scrollbar styling", () => expect(css).toContain("::-webkit-scrollbar"));
test("lang-terraform var", () => expect(css).toContain("--lang-terraform"));
test("lang-python var", () => expect(css).toContain("--lang-python"));
test("lang-bash var", () => expect(css).toContain("--lang-bash"));
test("lang-docker var", () => expect(css).toContain("--lang-docker"));

console.log("\n=== Hero ===");
const hero = fs.readFileSync(path.join(COMP, "hero/hero.tsx"), "utf-8");
test("floating nodes SVG", () => { expect(hero).toContain("<svg"); expect(hero).toContain("<circle"); });
test("scanline overlay", () => expect(hero).toContain("repeating-linear-gradient"));
test("typewriter cursor", () => expect(hero).toContain("typewriter-cursor"));

console.log("\n=== Snapshot ===");
const snap = fs.readFileSync(path.join(COMP, "hero/snapshot.tsx"), "utf-8");
test("client component", () => expect(snap).toContain('"use client"'));
test("IntersectionObserver", () => expect(snap).toContain("IntersectionObserver"));
test("count-up", () => expect(snap).toContain("requestAnimationFrame"));
test("glow effect", () => expect(snap).toContain("count-glow"));

console.log("\n=== AI Assistant ===");
const ai = fs.readFileSync(path.join(COMP, "ai-assistant/ai-assistant.tsx"), "utf-8");
test("quick actions", () => { expect(ai).toContain("What's Ameya's stack?"); expect(ai).toContain("Show me CI/CD projects"); });
test("hardcoded responses", () => expect(ai).toContain("Kubernetes, Helm, Terraform"));
test("fallback response", () => expect(ai).toContain("I'm Ameya's AI assistant"));
test("pulse-glow", () => expect(ai).toContain("pulse-glow"));
test("glassmorphism", () => expect(ai).toContain("backdropFilter"));

console.log("\n=== Cloud Badges ===");
const badges = fs.readFileSync(path.join(COMP, "ui/cloud-badges.tsx"), "utf-8");
for (const t of ["AWS","Kubernetes","Terraform","Docker","Jenkins","Spinnaker","Helm","Python","Ansible","Splunk","Grafana","Linux"]) {
  test(`badge: ${t}`, () => expect(badges).toContain(`"${t}"`));
}
test("marquee animation", () => expect(badges).toContain("marquee-scroll"));

console.log("\n=== Terminal ===");
const term = fs.readFileSync(path.join(COMP, "terminal/terminal.tsx"), "utf-8");
test("traffic lights", () => { expect(term).toContain("#ff5f57"); expect(term).toContain("#febc2e"); expect(term).toContain("#28c840"); });
test("commands", () => { expect(term).toContain("terraform init"); expect(term).toContain("kubectl get pods"); });
test("dark bg", () => expect(term).toContain("#0d1117"));

console.log("\n=== Certifications ===");
const certs = fs.readFileSync(path.join(COMP, "certifications/certifications.tsx"), "utf-8");
const certData = fs.readFileSync(path.join(CONTENT, "certifications.ts"), "utf-8");
test("section id", () => expect(certs).toContain('id="certifications"'));
test("CREDENTIALS eyebrow", () => expect(certs).toContain("CREDENTIALS"));
test("status badges", () => { expect(certs).toContain("Certified"); expect(certs).toContain("In Progress"); });
test("lightbox", () => expect(certs).toContain("lightbox"));
test("verify", () => expect(certs).toContain("Verify"));
test("accolades", () => expect(certs).toContain("Accolades"));
test("6 certificates", () => expect((certData.match(/id: "cert-/g) || []).length).toBe(6));
test("2 accolades", () => expect((certData.match(/id: "acc-/g) || []).length).toBe(2));
test("issuer colors", () => { expect(certData).toContain("#0078d4"); expect(certData).toContain("#ff9900"); expect(certData).toContain("#ea4335"); });

console.log("\n=== Code Snippets ===");
const snips = fs.readFileSync(path.join(COMP, "snippets/snippets-section.tsx"), "utf-8");
const snipData = fs.readFileSync(path.join(CONTENT, "snippets.ts"), "utf-8");
test("section id", () => expect(snips).toContain('id="snippets"'));
test("eyebrow", () => expect(snips).toContain("INFRASTRUCTURE AS CODE"));
test("filter languages", () => { expect(snips).toContain("Terraform"); expect(snips).toContain("Python"); expect(snips).toContain("Bash"); });
test("clipboard copy", () => expect(snips).toContain("navigator.clipboard.writeText"));
test("Copied!", () => expect(snips).toContain("Copied!"));
test("expand/collapse", () => { expect(snips).toContain("Show all"); expect(snips).toContain("Show less"); });
test("line numbers", () => expect(snips).toContain("i + 1"));
test("dark code bg", () => expect(snips).toContain("#0d1117"));
test("lang color vars", () => { expect(snips).toContain("var(--lang-terraform)"); expect(snips).toContain("var(--lang-python)"); });
test("4 snippets in data", () => expect((snipData.match(/id: "snip-/g) || []).length).toBe(4));
test("terraform file", () => expect(snipData).toContain("ec2-autoscaling.tf"));
test("python file", () => expect(snipData).toContain("ec2_snapshots.py"));
test("bash file", () => expect(snipData).toContain("k8s-health-check.sh"));

console.log("\n=== Navbar ===");
const nav = fs.readFileSync(path.join(COMP, "navigation/navbar.tsx"), "utf-8");
test("Certifications link", () => expect(nav).toContain("#certifications"));
test("Snippets link", () => expect(nav).toContain("#snippets"));

console.log("\n=== Layout ===");
const layout = fs.readFileSync(path.join(APP, "layout.tsx"), "utf-8");
test("imports AiAssistant", () => expect(layout).toContain("AiAssistant"));
test("AiAssistant after Footer", () => {
  expect(layout.indexOf("<AiAssistant")).toBeGreaterThan(layout.indexOf("<Footer"));
});

console.log("\n=== Page ordering ===");
const page = fs.readFileSync(path.join(APP, "page.tsx"), "utf-8");
test("all sections present", () => { expect(page).toContain("CloudBadges"); expect(page).toContain("TerminalSection"); expect(page).toContain("SnippetsSection"); expect(page).toContain("Certifications"); });
test("Badges between Snapshot/Showreel", () => { expect(page.indexOf("<CloudBadges")).toBeGreaterThan(page.indexOf("<Snapshot")); expect(page.indexOf("<CloudBadges")).toBeLessThan(page.indexOf("<Showreel")); });
test("Terminal between Projects/Snippets", () => { expect(page.indexOf("<TerminalSection")).toBeGreaterThan(page.indexOf("<ProjectsSection")); expect(page.indexOf("<TerminalSection")).toBeLessThan(page.indexOf("<SnippetsSection")); });
test("Snippets between Terminal/Experience", () => { expect(page.indexOf("<SnippetsSection")).toBeGreaterThan(page.indexOf("<TerminalSection")); expect(page.indexOf("<SnippetsSection")).toBeLessThan(page.indexOf("<Experience")); });
test("Certs after Expertise before Testimonials", () => { expect(page.indexOf("<Certifications")).toBeGreaterThan(page.indexOf("<Expertise")); expect(page.indexOf("<Certifications")).toBeLessThan(page.indexOf("<Testimonials")); });

console.log("\n=== Admin ===");
const admin = fs.readFileSync(path.join(APP, "admin/page.tsx"), "utf-8");
test("Certificates tab", () => expect(admin).toContain("certificates"));
test("Code Snippets tab", () => expect(admin).toContain("snippets"));
test("cert upload accepts", () => expect(admin).toContain(".jpg,.jpeg,.png,.pdf"));
test("snippet upload accepts", () => expect(admin).toContain(".tf,.yml,.yaml,.py,.sh,.js,.ts,.go"));
test("paste code mode", () => expect(admin).toContain("Paste Code"));
test("language auto-detect", () => expect(admin).toContain("langFromExt"));
test("delete functionality", () => expect(admin).toContain("Trash2"));

console.log("\n" + (process.exitCode ? "\u274c SOME TESTS FAILED" : "\u2705 ALL TESTS PASSED") + "\n");
