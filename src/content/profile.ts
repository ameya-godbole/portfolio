export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export const profile = {
  name: "Ameya Godbole",
  initials: "AG",
  title: "DevOps & Cloud Engineer",
  location: "Dublin, Ireland",
  email: "ameyagodbole1@gmail.com",
  linkedin: "https://www.linkedin.com/in/ameya-godbole1/",
  github: "https://github.com/ameya-godbole",
  calendly: "",
  resumeUrl: "/resume.pdf",

  hero: {
    eyebrow: "DEVOPS • CLOUD • INFRASTRUCTURE",
    headline: "I build the infrastructure that keeps products running at scale.",
    summary:
      "DevOps & Cloud Engineer with 7+ years of experience designing CI/CD pipelines, managing Kubernetes clusters, and migrating workloads to AWS and Azure. I turn complex infrastructure challenges into automated, observable, and reliable systems.",
    primaryCta: { label: "Explore my work", href: "#projects" },
    secondaryCta: { label: "Let's connect", href: "#contact" },
  },

  snapshot: [
    { value: "7+", label: "Years of IT experience" },
    { value: "4+", label: "Cloud platforms & tools shipped" },
    { value: "10+", label: "CI/CD pipelines built" },
    { value: "2", label: "Countries worked in" },
  ],

  about: {
    statement: "I build infrastructure that teams rely on — from pipelines to platforms.",
    paragraphs: [
      "I started my career in industrial engineering before finding my way into cloud and DevOps — a journey that gave me an unusual appreciation for systems thinking, bottleneck analysis, and continuous improvement. Over 7 years I've gone from writing SQL scripts and ETL pipelines to managing Kubernetes clusters at Ericsson and migrating legacy systems to AWS at Mastercard.",
      "I'm drawn to the messy, ambiguous problems: a legacy monolith that needs to move to cloud without downtime, a release process that's too manual, an infrastructure that nobody fully understands. I enjoy making those systems legible, automated, and robust.",
      "I work best at the intersection of engineering and operations — talking to product owners and customers about requirements in the morning, then writing Terraform and debugging Helm charts in the afternoon. I care about observability, clean IaC, and handing off systems that other engineers actually enjoy working with.",
      "Outside of work I'm preparing for the AWS Certified Solutions Architect Associate exam and exploring Go for infrastructure tooling.",
    ],
    currentlyFocusedOn: [
      "Kubernetes & Helm",
      "Infrastructure as Code",
      "CI/CD automation",
      "Cloud-native platforms",
      "AWS Solutions Architect",
    ],
  },

  contact: {
    headline: "Have an interesting infrastructure challenge?",
    subline: "I'm open to conversations about senior DevOps, cloud engineering, and platform engineering roles.",
  },

  testimonials: [
    {
      id: "t1",
      quote: "Ameya has a rare ability to take a sprawling, undocumented infrastructure and turn it into something clean, automated, and well-understood. His Terraform work at Mastercard saved us weeks of manual effort.",
      name: "Senior Engineering Manager",
      role: "Engineering",
      company: "Mastercard",
      avatar: "",
    },
    {
      id: "t2",
      quote: "One of the most dependable engineers on the team. Ameya led our Kubernetes upgrade cycle with zero downtime and thorough runbooks. He's the person you want on call.",
      name: "Platform Engineering Lead",
      role: "Platform Engineering",
      company: "Ericsson",
      avatar: "",
    },
    {
      id: "t3",
      quote: "Ameya bridged the gap between the DevOps team and product stakeholders better than anyone I've worked with. He translates technical constraints into plain language without losing accuracy.",
      name: "Product Owner",
      role: "Product",
      company: "Ericsson",
      avatar: "",
    },
  ],

  seo: {
    siteName: "Ameya Godbole — DevOps & Cloud Engineer",
    description:
      "Ameya Godbole is a DevOps & Cloud Engineer with 7+ years of experience in Kubernetes, CI/CD, Terraform, AWS, and Azure — based in Dublin, Ireland.",
    url: "https://ameyagodbole.dev",
    ogImage: "/images/og-cover.jpg",
    twitterHandle: "@ameya_godbole",
  },
};
