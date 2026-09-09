# Personal Portfolio

A modern, production-ready portfolio website built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and **Framer Motion**.

## Features

- ✅ Dark / light theme with smooth toggle
- ✅ Video-first project showcase (local, YouTube, Vimeo support)
- ✅ Featured showreel / demo reel section
- ✅ Animated expertise grid with skill chips
- ✅ Testimonials section
- ✅ Accordion-style career timeline
- ✅ Contact form with server-side validation & spam protection
- ✅ SEO: Open Graph, Twitter Cards, JSON-LD, sitemap, robots.txt
- ✅ Accessible: skip-to-content, ARIA attributes, reduced-motion support
- ✅ Mobile-first responsive design
- ✅ Analytics abstraction (ready for PostHog / Plausible / Vercel Analytics)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## How to Customize

### 1. Update your profile

Edit **`src/content/profile.ts`** — this controls:
- Name, title, location, email
- Hero section copy (headline, summary, CTAs)
- Snapshot metrics (years of experience, projects shipped, etc.)
- About section paragraphs and focus areas
- Testimonials / recommendations
- Contact section copy
- SEO metadata (site name, description, OG image, Twitter handle)

### 2. Add your experience

Edit **`src/content/experience.ts`** — each entry in the array becomes a row in the career timeline. Include:
- Company, role, dates, location
- Summary, responsibilities, achievements
- Impact metrics and technologies

### 3. Add projects

Edit **`src/content/projects.ts`** — each entry generates:
- A card on the homepage
- A full `/projects/[slug]` detail page

#### Adding a project with video

```typescript
{
  id: "my-project",
  slug: "my-project",
  title: "My Project",
  subtitle: "A one-line description.",
  // ... other fields ...
  video: {
    // Local video file (place in /public/videos/)
    provider: "local",
    src: "/videos/my-project.mp4",
    poster: "/images/projects/my-project-poster.jpg",
    duration: "2:30",
    alt: "Demo of my project",

    // OR YouTube
    // provider: "youtube",
    // src: "https://www.youtube.com/watch?v=VIDEO_ID",

    // OR Vimeo
    // provider: "vimeo",
    // src: "https://vimeo.com/VIDEO_ID",
  },
}
```

### 4. Update expertise areas

Edit **`src/content/expertise.ts`** — organized around outcomes, not a flat technology list. Each area has an icon, description, and technology list.

### 5. Update the showreel

Edit the `showreelData` object in **`src/components/showreel/showreel.tsx`** to point to your demo reel video.

### 6. Add your resume

Place your résumé PDF at **`public/resume.pdf`**.

### 7. Add project images

Place project thumbnails/posters in **`public/images/projects/`**.

### 8. Add project videos

Place local video files in **`public/videos/`**.

## Connecting Services

### Contact Form Email Delivery

The contact form (`src/app/actions/contact.ts`) validates and processes submissions server-side. To send emails:

1. Install a provider: `npm install resend` (or `@sendgrid/mail`, `postmark`, etc.)
2. Add your API key to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```
3. Wire up the send call in `contact.ts` (see the TODO comment in the file).

### Analytics

The analytics abstraction (`src/lib/analytics.ts`) provides a `track()` function that logs to console in development. To connect a real provider:

- **PostHog**: Install `posthog-js`, initialize in layout, dispatch events in `analytics.ts`
- **Plausible**: Add the script tag in layout, use `window.plausible()` in `dispatch()`
- **Vercel Analytics**: Install `@vercel/analytics`, add `<Analytics />` to layout

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com/new
```

Environment variables to set in Vercel:
- `RESEND_API_KEY` (if using Resend for contact form)

## Project Structure

```
src/
├── app/
│   ├── actions/contact.ts      # Server action for contact form
│   ├── projects/[slug]/page.tsx # Dynamic project detail pages
│   ├── globals.css              # Design tokens & base styles
│   ├── layout.tsx               # Root layout with fonts, nav, footer
│   └── page.tsx                 # Homepage composition
├── components/
│   ├── about/                   # About section
│   ├── contact/                 # Contact section + form
│   ├── experience/              # Career timeline
│   ├── expertise/               # Skills grid
│   ├── footer/                  # Site footer
│   ├── hero/                    # Hero + snapshot metrics
│   ├── navigation/              # Navbar with theme toggle
│   ├── project-video/           # Video player (local/YouTube/Vimeo)
│   ├── projects/                # Project cards + section
│   ├── showreel/                # Featured video reel
│   ├── testimonials/            # Testimonials grid
│   └── ui/                      # Shared UI primitives
├── content/
│   ├── experience.ts            # Career timeline data
│   ├── expertise.ts             # Skills & expertise data
│   ├── profile.ts               # Personal info, hero, about, SEO
│   └── projects.ts              # Project case studies
└── lib/
    ├── analytics.ts             # Analytics abstraction
    └── utils.ts                 # cn() and helpers
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **Framer Motion** for animations
- **Lucide React** for icons
- **Zod** for form validation
- **class-variance-authority** for component variants
