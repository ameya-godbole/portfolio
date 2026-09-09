"use client";

import {
  Cloud,
  Container,
  FileCode2,
  Box,
  Wrench,
  Rocket,
  Anchor,
  Code2,
  Settings,
  BarChart3,
  Activity,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CloudTool = {
  name: string;
  category: string;
  Icon: LucideIcon;
};

const tools: CloudTool[] = [
  { name: "AWS", category: "Cloud", Icon: Cloud },
  { name: "Kubernetes", category: "Orchestration", Icon: Container },
  { name: "Terraform", category: "IaC", Icon: FileCode2 },
  { name: "Docker", category: "Containers", Icon: Box },
  { name: "Jenkins", category: "CI/CD", Icon: Wrench },
  { name: "Spinnaker", category: "Delivery", Icon: Rocket },
  { name: "Helm", category: "Packaging", Icon: Anchor },
  { name: "Python", category: "Scripting", Icon: Code2 },
  { name: "Ansible", category: "Config Mgmt", Icon: Settings },
  { name: "Splunk", category: "Observability", Icon: BarChart3 },
  { name: "Grafana", category: "Monitoring", Icon: Activity },
  { name: "Linux", category: "OS", Icon: Terminal },
];

function BadgeItem({ tool }: { tool: CloudTool }) {
  const { name, category, Icon } = tool;
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 transition-colors duration-200 hover:border-[var(--accent)]/30">
      <Icon size={16} className="text-[var(--accent)]" />
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-tight">{name}</span>
        <span className="text-[10px] leading-tight text-[var(--muted-2)]">
          {category}
        </span>
      </div>
    </div>
  );
}

export function CloudBadges() {
  const doubled = [...tools, ...tools];

  return (
    <section className="overflow-hidden border-y border-[var(--border)] py-6">
      <div
        className="flex gap-4"
        style={{
          animation: "marquee-scroll 40s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((tool, i) => (
          <BadgeItem key={`${tool.name}-${i}`} tool={tool} />
        ))}
      </div>
    </section>
  );
}
