# Ameya Godbole — Portfolio Website

A modern, production-ready portfolio website built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Designed to showcase cloud & DevOps engineering expertise through an interactive, content-driven experience.

## Overview

The portfolio is a single-page application with the following sections:

| Section | Description |
|---|---|
| **Hero** | Animated intro with name, headline, and CTA |
| **Cloud Badges** | AWS, Azure, Kubernetes, Terraform certification badges |
| **Showreel** | Featured demo reel / video showcase |
| **About** | Bio, snapshot numbers, and professional summary |
| **Gallery** | Photo gallery with lightbox |
| **Documents** | Downloadable résumé, certs, and reference docs |
| **Projects** | Video-first project cards (local / YouTube / Vimeo) |
| **Terminal** | Interactive terminal emulator showcasing CLI fluency |
| **Code Snippets** | Syntax-highlighted code samples |
| **Experience** | Accordion-style career timeline |
| **Expertise** | Animated skill grid with categorised chips |
| **Certifications** | Certificate cards with verification links |
| **Testimonials** | Colleague and manager endorsements |
| **Contact** | Form with server-side validation and spam protection |

---

## Quick Start

```bash
git clone https://github.com/ameya-godbole/portfolio
cd portfolio
npm install
npm run dev
# Open http://localhost:3000
```

### Other Commands

```bash
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript compiler check (if configured)
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ADMIN_PASSWORD` | `portfolio2024` | Password for the `/admin` upload panel |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL used for SEO meta tags, Open Graph, and sitemap generation |

Create a `.env.local` file in the project root for local development:

```env
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** `ADMIN_PASSWORD` should be changed from the default before any public deployment.

---

## Content Files

All site content lives in `src/content/`. Edit these TypeScript files to update the portfolio — no CMS required.

### `src/content/profile.ts`

Central profile configuration:

- **Name & headline** — displayed in the Hero section
- **About text** — rendered in the About section
- **Snapshot numbers** — key stats (years of experience, projects delivered, etc.)
- **Contact details** — email, phone, LinkedIn, GitHub URLs
- **SEO metadata** — title, description, Open Graph image, keywords

### `src/content/experience.ts`

Work history rendered as an accordion timeline. Each entry is an object with:

- Company name, role, dates
- Location
- Description / bullet points of responsibilities and achievements
- Tech stack tags

**To add a new role:** add a new object to the exported array. The most recent entry should be first.

### `src/content/projects.ts`

Project showcase with video support. Each project can include:

- Title, description, tech stack tags
- Thumbnail image path
- Video source: local file (`/videos/...`), YouTube URL, or Vimeo URL
- Live URL and source code URL
- Featured flag (featured projects get larger cards)

### `src/content/expertise.ts`

Skill categories displayed as an animated grid. Each category has:

- Category name (e.g., "Cloud & Infrastructure", "CI/CD & Automation")
- Array of skill chips with name and optional proficiency level

### `src/content/certifications.ts`

Certificates and accolades. Each entry includes:

- Certificate name, issuing authority
- Date earned, expiry date (if applicable)
- Verification URL
- Badge image path

### `src/content/snippets.ts`

Code snippets showcase. Each snippet has:

- Title and description
- Language (for syntax highlighting)
- Code string
- Tags

---

## Adding a Project

1. **Add the entry** to `src/content/projects.ts`:

   ```typescript
   {
     title: 'Kubernetes Auto-Scaler',
     description: 'Custom HPA controller for cost-optimised scaling...',
     techStack: ['Go', 'Kubernetes', 'Prometheus'],
     thumbnail: '/images/projects/k8s-autoscaler.png',
     video: '/videos/k8s-autoscaler-demo.mp4',  // or YouTube/Vimeo URL
     liveUrl: 'https://github.com/ameya-godbole/k8s-autoscaler',
     sourceUrl: 'https://github.com/ameya-godbole/k8s-autoscaler',
     featured: true,
   }
   ```

2. **Drop the video** into `public/videos/` (for local video files).

3. **Add the thumbnail** to `public/images/projects/`.

4. **Restart dev server** if it's running — content files are imported at build time.

---

## Admin Panel (`/admin`)

The admin panel at `/admin` provides a browser-based upload interface for managing media and content assets without touching code.

### Authentication

- **Default password:** `portfolio2024`
- **To change:** set the `ADMIN_PASSWORD` environment variable (see [Environment Variables](#environment-variables))
- Session-based auth; password checked server-side

### Upload Tabs

| Tab | Purpose | Upload destination |
|---|---|---|
| **Photos** | Gallery images, profile photos | `public/images/` |
| **Documents** | Résumé, PDFs, reference letters | `public/documents/` |
| **Videos** | Project demos, showreel clips | `public/videos/` |
| **Certificates** | Certification badges and images | `public/images/certifications/` |
| **Code Snippets** | `.ts`, `.py`, `.sh` files for the snippets section | `public/snippets/` |

Uploaded files are written to the `public/` directory and are immediately available at their corresponding URL paths.

---

## Deployment (Vercel)

The recommended deployment target is [Vercel](https://vercel.com) — zero-config for Next.js.

### Steps

1. Go to [vercel.com/new](https://vercel.com/new) and import the `ameya-godbole/portfolio` repository.

2. Add environment variables in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `ADMIN_PASSWORD` | Your secure password |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` (or custom domain) |

3. Click **Deploy**. Vercel auto-detects the Next.js framework and handles build settings.

4. *(Optional)* Add a custom domain under **Settings → Domains**.

### Automatic Deployments

- Every push to `main` triggers a production deployment.
- Pull requests get preview deployments with unique URLs.
- Environment variables can be scoped per environment (Production / Preview / Development).

---

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and delivery. The pipeline follows a clean separation:

- **CI (Build & Test):** Checkout → Maven Build → Test → Artifact
- **CD (Publish & Deploy):** Docker Build → Push to Amazon ECR → Secrets from HashiCorp Vault → Deploy to AWS EC2

Key design principles:

- **No secrets baked into the pipeline** — application secrets are fetched from HashiCorp Vault at deploy time
- **IAM OIDC** for AWS authentication (no long-lived access keys)
- **Image scanning** with Trivy before push
- **Health-check gated deploys** with automatic rollback

📖 **Full pipeline architecture and reference:** [`docs/cicd-pipeline.md`](docs/cicd-pipeline.md)

🔧 **Pipeline YAML:** [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Deployment | Vercel / Docker + AWS EC2 |
| CI/CD | GitHub Actions |
| Secrets | HashiCorp Vault |
| Container Registry | Amazon ECR |
| Infra Auth | AWS IAM OIDC |

---

## Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # GitHub Actions pipeline
├── docs/
│   └── cicd-pipeline.md         # Pipeline deep-dive reference
├── public/
│   ├── images/                  # Static images (gallery, projects, certs)
│   ├── videos/                  # Local video files
│   ├── documents/               # Downloadable PDFs
│   └── snippets/                # Code snippet files
├── src/
│   ├── app/                     # Next.js app router pages
│   │   ├── admin/               # Admin upload panel
│   │   └── ...
│   ├── components/              # React components (sections, UI)
│   ├── content/                 # ← Edit these to update site content
│   │   ├── profile.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── expertise.ts
│   │   ├── certifications.ts
│   │   └── snippets.ts
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utilities, helpers
├── .env.local                   # Local environment variables (git-ignored)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

---

## License

Private repository. All rights reserved.

---

## Author

**Ameya Godbole** — DevOps & Cloud Engineer

- 🌐 [LinkedIn](https://linkedin.com/in/ameya-godbole1)
- 💻 [GitHub](https://github.com/ameya-godbole)
