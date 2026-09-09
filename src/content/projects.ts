/**
 * PROJECTS
 * -----------------------------------------------------------------------
 * Add a new project by adding an object to this array. The homepage grid
 * and /projects/[slug] detail pages are generated from this data.
 *
 * Video provider is abstracted: use "local" for /public/videos files,
 * "youtube" for YouTube URLs, "vimeo" for Vimeo URLs.
 * -----------------------------------------------------------------------
 */

export type ProjectVideo = {
  provider: "local" | "mux" | "vimeo" | "youtube";
  src: string;
  poster: string;
  duration?: string;
  caption?: string;
  alt: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  year: string;
  role: string;
  team: string;
  duration: string;
  featured: boolean;
  thumbnail: string;
  video?: ProjectVideo;
  problem: string;
  context: string;
  contribution: string;
  approach: string;
  architecture?: string;
  outcomes: string[];
  metrics: string[];
  technologies: string[];
  lessons?: string;
  links?: { github?: string; live?: string; caseStudy?: string };
};

export const projects: Project[] = [
  {
    id: "project-1",
    slug: "lift-shift-to-aws",
    title: "Lift & Shift to AWS",
    subtitle: "Migrated a legacy web application from VM to AWS S3 and Tomcat app server.",
    company: "ShaaySoft",
    year: "2020",
    role: "Cloud Engineer",
    team: "2 engineers",
    duration: "3 months",
    featured: true,
    thumbnail: "/images/projects/placeholder-1.jpg",
    video: {
      provider: "local",
      src: "/videos/lift-shift.mp4",
      poster: "/images/projects/placeholder-1.jpg",
      duration: "2:00",
      alt: "Demo of the Lift and Shift migration to AWS",
    },
    problem:
      "A client's web application was running on an ageing on-premises virtual machine with no redundancy, manual deployments, and no monitoring. Downtime events were causing business disruption.",
    context:
      "The client needed a low-risk cloud migration path that preserved the existing application architecture while immediately improving availability and operability.",
    contribution:
      "Designed and executed the full migration plan — from VM inventory to Route53 DNS cutover. Set up S3 for static assets, Tomcat on EC2 for the app server, and Maven for build automation.",
    approach:
      "Used a lift-and-shift strategy to minimise code changes. Moved static assets to S3, deployed the app to EC2-hosted Tomcat, managed DNS via Route53, and automated builds with Maven.",
    outcomes: [
      "Application migrated with zero unplanned downtime",
      "Eliminated single point of failure by introducing EC2 Auto Scaling",
      "Deployment time reduced from hours to minutes with automated Maven builds",
    ],
    metrics: ["Zero unplanned downtime during migration", "Deployment time cut by ~70%"],
    technologies: ["AWS EC2", "S3", "Route 53", "Tomcat", "Maven", "Linux"],
    lessons:
      "Thorough pre-migration inventory and DNS TTL planning are the most underrated parts of any lift-and-shift. The technical migration was straightforward; the cutover coordination was the real work.",
    links: {},
  },
  {
    id: "project-2",
    slug: "ci-cd-git-jenkins-ansible",
    title: "CI/CD with Git, Jenkins & Ansible",
    subtitle: "End-to-end continuous deployment pipeline integrating GitHub, Jenkins, and Ansible.",
    company: "ShaaySoft",
    year: "2020",
    role: "Cloud Engineer",
    team: "2 engineers",
    duration: "2 months",
    featured: true,
    thumbnail: "/images/projects/placeholder-2.jpg",
    video: {
      provider: "local",
      src: "/videos/cicd-pipeline.mp4",
      poster: "/images/projects/placeholder-2.jpg",
      duration: "2:00",
      alt: "Walkthrough of the CI/CD pipeline architecture",
    },
    problem:
      "Deployments were manual, error-prone, and undocumented. Every release required an engineer to SSH into servers and run scripts by hand, causing inconsistency and occasional production outages.",
    context:
      "The team needed a reliable, repeatable deployment process that could be triggered automatically on code push and would apply consistent configuration to all target servers.",
    contribution:
      "Designed the full pipeline from Git push to production deployment. Configured Jenkins to listen for GitHub webhooks, trigger builds, and invoke Ansible playbooks for server configuration.",
    approach:
      "Jenkins served as the orchestration layer: on push to main, it pulled the latest code, ran tests, built the artifact, then triggered Ansible playbooks to configure servers and deploy. All pipeline config was stored as code.",
    outcomes: [
      "Eliminated manual deployment steps — full pipeline runs in under 5 minutes",
      "Consistent server configuration enforced via Ansible roles",
      "Deployment confidence improved significantly; rollbacks made trivial",
    ],
    metrics: ["Deployment time: manual hours → ~5 minutes", "100% of deployments automated post-implementation"],
    technologies: ["GitHub", "Jenkins", "Ansible", "Linux", "Bash", "AWS EC2"],
    lessons:
      "Idempotent Ansible playbooks are non-negotiable. The first version had side effects on re-run; refactoring for idempotency added a day of work but saved far more in debugging later.",
    links: {},
  },
  {
    id: "project-3",
    slug: "rearchitect-aws-paas",
    title: "Re-architecting Web App on AWS PaaS",
    subtitle: "Restructured a Lift & Shift workload onto managed AWS PaaS services using IaC.",
    company: "ShaaySoft",
    year: "2020",
    role: "Cloud Engineer",
    team: "2 engineers",
    duration: "2 months",
    featured: true,
    thumbnail: "/images/projects/placeholder-3.jpg",
    video: {
      provider: "local",
      src: "/videos/rearchitect-aws.mp4",
      poster: "/images/projects/placeholder-3.jpg",
      duration: "2:00",
      alt: "Architecture walkthrough of the re-architected AWS PaaS stack",
    },
    problem:
      "After the initial Lift & Shift, the application was on EC2 but still required significant manual ops work. The team wanted to reduce operational overhead by leveraging managed services.",
    context:
      "The goal was to evolve the architecture from IaaS to PaaS, reducing the team's server management burden while improving scalability and cost efficiency.",
    contribution:
      "Redesigned the infrastructure using Elastic Beanstalk for the app tier, RDS for the database, ElastiCache for session caching, and ActiveMQ for async messaging. All provisioned via Terraform.",
    approach:
      "Replaced EC2 + manual config with Elastic Beanstalk managed environments. Migrated the database to RDS with automated backups. Introduced ElastiCache for session management and ActiveMQ for decoupled messaging.",
    outcomes: [
      "Reduced ops overhead — no more manual EC2 patching or server management",
      "Improved scalability through Elastic Beanstalk auto-scaling",
      "All infrastructure reproducible from Terraform in under 15 minutes",
    ],
    metrics: ["Infrastructure provisioning: hours → 15 minutes via Terraform", "Ops overhead significantly reduced with PaaS services"],
    technologies: ["AWS Elastic Beanstalk", "RDS", "ElastiCache", "ActiveMQ", "Terraform", "CloudFormation"],
    lessons:
      "Moving to PaaS is mostly a mindset shift — you give up some control but gain a lot of reliability. The hardest part was migrating stateful session data to ElastiCache without disrupting users.",
    links: {},
  },
  {
    id: "project-4",
    slug: "ci-aws-codepipeline",
    title: "Continuous Integration on AWS",
    subtitle: "Native AWS CI pipeline using CodeCommit, CodeBuild, CodePipeline, and SonarCloud.",
    company: "Mastercard",
    year: "2023",
    role: "BizOps Engineer",
    team: "3 engineers",
    duration: "3 months",
    featured: false,
    thumbnail: "/images/projects/placeholder-1.jpg",
    video: {
      provider: "local",
      src: "/videos/aws-ci.mp4",
      poster: "/images/projects/placeholder-1.jpg",
      duration: "2:00",
      alt: "AWS CodePipeline CI flow walkthrough",
    },
    problem:
      "The team was using a fragmented mix of external tools for source control, build, and code review — increasing cognitive overhead and making compliance audits difficult.",
    context:
      "Mastercard's internal teams needed a unified, auditable CI pipeline that kept code and build artifacts within AWS boundaries for compliance and security reasons.",
    contribution:
      "Designed and implemented the full pipeline: CodeCommit for source control, CodeBuild for compilation and testing, SonarCloud for static analysis, CheckStyle for style enforcement, and CodeArtifact for dependency management. Artifacts published to S3.",
    approach:
      "Structured the pipeline in three stages — source (CodeCommit), review (SonarCloud + CheckStyle via CodeBuild), and build/publish (artifact to S3 via CodePipeline). All config managed as IaC.",
    outcomes: [
      "Single unified pipeline replacing three separate tools",
      "Code quality gates automated — no build passes without SonarCloud approval",
      "Artifacts fully auditable and versioned in S3 + CodeArtifact",
    ],
    metrics: ["3 tools consolidated into 1 pipeline", "100% of builds pass quality gates before artifact publish"],
    technologies: ["AWS CodeCommit", "AWS CodeBuild", "AWS CodePipeline", "AWS CodeArtifact", "SonarCloud", "CheckStyle", "S3"],
    lessons:
      "SonarCloud integration is straightforward; getting teams to accept quality gates as a blocker rather than a suggestion is the harder organisational problem.",
    links: {},
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getAdjacentProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return projects[0];
  return projects[(index + 1) % projects.length];
}
