/**
 * EXPERTISE
 * -----------------------------------------------------------------------
 * Organized around outcomes, not a flat technology list. Add or edit
 * categories here — only include technologies you actually use.
 * -----------------------------------------------------------------------
 */

export type ExpertiseArea = {
  id: string;
  index: string;
  title: string;
  description: string;
  technologies: string[];
  icon: "code" | "cloud" | "brain" | "users";
};

export const expertise: ExpertiseArea[] = [
  {
    id: "cloud-platforms",
    index: "01",
    title: "Cloud Platforms",
    description: "Designing and operating cloud infrastructure on AWS and Azure — from VPCs and IAM to managed PaaS services and cost-optimised architectures.",
    technologies: ["AWS EC2", "S3", "RDS", "Lambda", "Route53", "Elastic Beanstalk", "CloudFormation", "Azure Data Factory", "Azure Cloud"],
    icon: "cloud",
  },
  {
    id: "devops-cicd",
    index: "02",
    title: "DevOps & CI/CD",
    description: "Building reliable, automated delivery pipelines that go from code commit to production with quality gates, artifact management, and zero-touch deployments.",
    technologies: ["Jenkins", "Spinnaker", "AWS CodePipeline", "GitHub Actions", "Terraform", "Ansible", "Chef", "Helm", "Docker"],
    icon: "code",
  },
  {
    id: "kubernetes-containers",
    index: "03",
    title: "Kubernetes & Containers",
    description: "Managing Kubernetes clusters at scale — upgrades, RBAC, Helm chart deployments, and building container-based delivery workflows.",
    technologies: ["Kubernetes", "Helm", "Docker", "ECS", "AWS EKS", "Linux"],
    icon: "cloud",
  },
  {
    id: "observability-scripting",
    index: "04",
    title: "Observability & Scripting",
    description: "Keeping production systems legible through monitoring, alerting, and automation scripting — so teams can act on signals, not noise.",
    technologies: ["Splunk", "Dynatrace", "Nagios", "Grafana", "Prometheus", "Python", "Bash", "Boto3"],
    icon: "brain",
  },
];
