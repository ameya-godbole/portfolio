export type ExperienceEntry = {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  impactMetrics: string[];
  technologies: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "role-1",
    company: "Ericsson",
    role: "DevOps Engineer",
    location: "Dublin, Ireland",
    startDate: "May 2025",
    endDate: "Present",
    summary:
      "Lead product releases and manage Kubernetes infrastructure for Ericsson's Product Staging team, collaborating with external customers and cross-functional stakeholders to deliver reliable, automated deployments.",
    responsibilities: [
      "Lead end-to-end product releases in collaboration with external customers and product owners",
      "Manage Kubernetes clusters — configurations, upgrades, and access administration",
      "Design and configure CI/CD pipelines using Spinnaker for the Product Staging team",
      "Test and deploy artifacts (primarily Helm charts) across staging environments",
      "Create and manage cloud infrastructure using Terraform",
      "Automate workflows to ensure pipeline stability and robustness",
      "Develop KPIs and dashboards for release management visibility",
      "Perform Linux system administration across production servers",
    ],
    achievements: [
      "Reduced manual release steps by automating Helm chart deployment workflows via Spinnaker",
      "Improved Kubernetes cluster reliability through structured upgrade runbooks and zero-downtime procedures",
    ],
    impactMetrics: ["Zero-downtime K8s upgrades", "Automated release pipelines", "Cross-customer release coordination"],
    technologies: ["Kubernetes", "Helm", "Spinnaker", "Terraform", "Linux", "CI/CD", "Docker"],
  },
  {
    id: "role-2",
    company: "Mastercard",
    role: "BizOps Engineer",
    location: "Dublin, Ireland",
    startDate: "Feb 2023",
    endDate: "Jul 2024",
    summary:
      "Delivered cloud migration and DevSecOps automation for Mastercard's internal platforms, migrating legacy systems to AWS and maintaining production reliability as an on-call engineer.",
    responsibilities: [
      "Migrated legacy systems to AWS using EC2, S3, and RDS",
      "Developed Infrastructure as Code using Terraform and AWS CloudFormation",
      "Automated deployments via Jenkins pipelines triggered by Git pushes, interacting with ECS and RDS through Python/Bash scripts",
      "Applied DevSecOps principles: vulnerability monitoring, patching, and Kubernetes cluster management",
      "Maintained and configured Jenkins for CI across multiple projects",
      "Monitored production infrastructure and applications using Splunk, BlazeMeter, and Dynatrace",
      "Served as on-call resource for ITSM and infrastructure incident management",
    ],
    achievements: [
      "Successfully migrated legacy monolith workloads to AWS with no unplanned downtime",
      "Reduced deployment cycle time by replacing manual steps with automated Jenkins + Python pipelines",
    ],
    impactMetrics: ["AWS cloud migration delivered", "Automated CI/CD pipelines", "On-call ITSM coverage"],
    technologies: ["AWS", "Terraform", "CloudFormation", "Jenkins", "Docker", "Kubernetes", "Splunk", "Dynatrace", "Python", "Bash"],
  },
  {
    id: "role-3",
    company: "Synechron",
    role: "Jr. DevOps Engineer",
    location: "Pune, India",
    startDate: "Jul 2022",
    endDate: "Nov 2022",
    summary:
      "Worked on a cloud migration project using Azure Data Factory, moving on-premises data workloads to Azure cloud and monitoring production servers for stability.",
    responsibilities: [
      "Built and configured Azure Data Factory pipelines for on-premises to Azure cloud data migration",
      "Monitored and troubleshot issues on production servers",
      "Collaborated with data engineering teams on ETL workflow design",
    ],
    achievements: [
      "Delivered data migration pipelines on schedule, enabling cloud-first data workloads",
    ],
    impactMetrics: ["On-prem to Azure migration", "ADF pipeline delivery"],
    technologies: ["Azure Data Factory", "Azure Cloud", "ETL", "SQL", "Linux"],
  },
  {
    id: "role-4",
    company: "ShaaySoft",
    role: "Cloud Engineer",
    location: "Pune, India",
    startDate: "Jan 2019",
    endDate: "Nov 2020",
    summary:
      "Modernised cloud architecture for client workloads on AWS, built CI/CD pipelines using Jenkins and Ansible, and automated infrastructure operations with Python and Boto3.",
    responsibilities: [
      "Provisioned and managed AWS services: EC2, IAM, S3, Route53, VPC, Lambda, Auto Scaling",
      "Built CI/CD pipelines using Jenkins integrated with Git and Ansible",
      "Automated infrastructure operations using Python (Boto3) — EC2 lifecycle, S3 snapshots, backups",
      "Used Chef cookbooks to accelerate application provisioning",
      "Monitored infrastructure and services with Nagios for high availability",
      "Managed security using IAM Users, Policies, and Permissions",
      "Handled storage lifecycle with S3, Glacier, and versioning",
    ],
    achievements: [
      "Modernised cloud architecture improving security posture and operational efficiency",
      "Reduced manual operations through Python/Boto3 automation scripts",
    ],
    impactMetrics: ["AWS architecture modernisation", "Automated backup & lifecycle management"],
    technologies: ["AWS", "Python", "Boto3", "Jenkins", "Ansible", "Chef", "Nagios", "Git", "Linux", "Terraform"],
  },
];
