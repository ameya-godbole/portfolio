export type CodeSnippet = {
  id: string;
  title: string;
  description: string;
  language:
    | "terraform"
    | "ansible"
    | "python"
    | "bash"
    | "yaml"
    | "dockerfile"
    | "go"
    | "javascript"
    | "typescript"
    | "other";
  code: string;
  tags: string[];
  filename?: string;
  createdAt: string;
};

export const snippets: CodeSnippet[] = [
  {
    id: "snip-1",
    title: "Terraform AWS EC2 with Auto Scaling",
    description:
      "Provisions an EC2 instance with Auto Scaling Group, Launch Template, and CloudWatch alarms.",
    language: "terraform",
    filename: "ec2-autoscaling.tf",
    tags: ["AWS", "EC2", "IaC", "Auto Scaling"],
    createdAt: "2024",
    code: `resource "aws_launch_template" "app" {
  name_prefix   = "app-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(templatefile("userdata.sh", {
    app_version = var.app_version
  }))

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "app-server", Environment = var.environment }
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "app-asg"
  desired_capacity    = 2
  min_size            = 1
  max_size            = 6
  vpc_zone_identifier = var.private_subnet_ids

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  health_check_type         = "ELB"
  health_check_grace_period = 300
}`,
  },
  {
    id: "snip-2",
    title: "Ansible Playbook \u2014 Deploy App",
    description:
      "Idempotent playbook to install dependencies, deploy artifact, and restart service.",
    language: "ansible",
    filename: "deploy.yml",
    tags: ["Ansible", "CI/CD", "Deployment"],
    createdAt: "2020",
    code: `---
- name: Deploy application
  hosts: app_servers
  become: yes
  vars:
    app_version: "{{ lookup('env', 'APP_VERSION') }}"
    app_dir: /opt/myapp

  tasks:
    - name: Ensure app directory exists
      file:
        path: "{{ app_dir }}"
        state: directory
        owner: deploy
        mode: '0755'

    - name: Download application artifact
      get_url:
        url: "s3://my-artifacts/app-{{ app_version }}.tar.gz"
        dest: "/tmp/app.tar.gz"

    - name: Extract artifact
      unarchive:
        src: "/tmp/app.tar.gz"
        dest: "{{ app_dir }}"
        remote_src: yes

    - name: Restart application service
      systemd:
        name: myapp
        state: restarted
        enabled: yes`,
  },
  {
    id: "snip-3",
    title: "Python Boto3 \u2014 EC2 Snapshot Automation",
    description:
      "Automatically creates snapshots of all EBS volumes tagged for backup.",
    language: "python",
    filename: "ec2_snapshots.py",
    tags: ["Python", "Boto3", "AWS", "Automation"],
    createdAt: "2020",
    code: `import boto3
from datetime import datetime

def create_snapshots():
    ec2 = boto3.client('ec2', region_name='eu-west-1')
    
    volumes = ec2.describe_volumes(
        Filters=[{'Name': 'tag:Backup', 'Values': ['true']}]
    )['Volumes']
    
    for volume in volumes:
        vol_id = volume['VolumeId']
        tags = {t['Key']: t['Value'] for t in volume.get('Tags', [])}
        
        snapshot = ec2.create_snapshot(
            VolumeId=vol_id,
            Description=f"Auto-backup {tags.get('Name', vol_id)} {datetime.now():%Y-%m-%d}",
            TagSpecifications=[{
                'ResourceType': 'snapshot',
                'Tags': [
                    {'Key': 'Name', 'Value': f"backup-{tags.get('Name', vol_id)}"},
                    {'Key': 'CreatedBy', 'Value': 'automation'},
                ]
            }]
        )
        print(f"Created snapshot {snapshot['SnapshotId']} for {vol_id}")

if __name__ == '__main__':
    create_snapshots()`,
  },
  {
    id: "snip-4",
    title: "Bash \u2014 Kubernetes Health Check",
    description:
      "Checks pod health across namespaces and alerts on CrashLoopBackOff or pending pods.",
    language: "bash",
    filename: "k8s-health-check.sh",
    tags: ["Kubernetes", "Bash", "Monitoring"],
    createdAt: "2025",
    code: `#!/bin/bash
set -euo pipefail

NAMESPACES=$(kubectl get ns -o jsonpath='{.items[*].metadata.name}')
ISSUES=0

for NS in $NAMESPACES; do
  UNHEALTHY=$(kubectl get pods -n "$NS" --no-headers 2>/dev/null | \\
    awk '$3 ~ /CrashLoopBackOff|Error|Pending|OOMKilled/ {print $1, $3}')
  
  if [ -n "$UNHEALTHY" ]; then
    echo "\u26a0\ufe0f  Issues in namespace: $NS"
    echo "$UNHEALTHY" | while read pod status; do
      echo "   \u2192 $pod ($status)"
    done
    ISSUES=$((ISSUES + 1))
  fi
done

if [ $ISSUES -eq 0 ]; then
  echo "\u2705 All pods healthy across $( echo "$NAMESPACES" | wc -w) namespaces"
else
  echo "\u274c Found issues in $ISSUES namespace(s)"
  exit 1
fi`,
  },
];
