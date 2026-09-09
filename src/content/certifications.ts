export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  issuerColor: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  status: "certified" | "in-progress" | "expired";
  image?: string;
  verifyUrl?: string;
};

export type Accolade = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: "trophy" | "star" | "award" | "medal";
};

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    issuerColor: "#0078d4",
    issueDate: "2022",
    status: "certified",
    credentialId: "Add your credential ID",
    verifyUrl: "",
  },
  {
    id: "cert-2",
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services (Udemy)",
    issuerColor: "#ff9900",
    issueDate: "2021",
    status: "certified",
    credentialId: "Add your credential ID",
    verifyUrl: "",
  },
  {
    id: "cert-3",
    name: "AWS Certified Solutions Architect \u2014 Associate",
    issuer: "Amazon Web Services",
    issuerColor: "#ff9900",
    issueDate: "",
    status: "in-progress",
    verifyUrl: "",
  },
  {
    id: "cert-4",
    name: "Jenkins CI/CD",
    issuer: "KodeKloud",
    issuerColor: "#22c55e",
    issueDate: "2021",
    status: "certified",
    credentialId: "Add your credential ID",
    verifyUrl: "",
  },
  {
    id: "cert-5",
    name: "Shell Scripts for Beginners",
    issuer: "KodeKloud",
    issuerColor: "#22c55e",
    issueDate: "2021",
    status: "certified",
    verifyUrl: "",
  },
  {
    id: "cert-6",
    name: "Fundamentals of Digital Marketing",
    issuer: "Google Digital Garage",
    issuerColor: "#ea4335",
    issueDate: "2021",
    status: "certified",
    verifyUrl: "",
  },
];

export const accolades: Accolade[] = [
  {
    id: "acc-1",
    title: "Zero-Downtime Kubernetes Migration",
    issuer: "Ericsson",
    date: "2025",
    description:
      "Led a zero-downtime Kubernetes cluster upgrade across production environments, recognised by the Platform Engineering team.",
    icon: "trophy",
  },
  {
    id: "acc-2",
    title: "Cloud Migration Delivery",
    issuer: "Mastercard",
    date: "2024",
    description:
      "Successfully delivered legacy-to-AWS cloud migration on schedule with no unplanned downtime, acknowledged by engineering leadership.",
    icon: "star",
  },
];
