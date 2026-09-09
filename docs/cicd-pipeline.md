# CI/CD Pipeline — Architecture & Reference

> "There's a developer push to GitHub, which triggers a GitHub Actions pipeline. Then, build with Maven. Run tests. Build Docker image, push to Amazon ECR. Deploy to AWS EC2. Secrets are provided at runtime from HashiCorp Vault, not baked into the pipeline. That keeps your CI in build and test, and your CD in publish and deploy. Clean, and nicely structured."
> — Ameya Godbole

---

## Pipeline Overview

```
Developer
    │
    ▼ git push
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions                               │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐  │
│  │  Checkout│──▶│Maven Build│──▶│   Test   │──▶│ Docker Build│  │
│  └──────────┘   └──────────┘   └──────────┘   └──────┬──────┘  │
│                                                        │         │
│  ◀──────────── CI (Build & Test) ────────────────────▶│         │
└───────────────────────────────────────────────────────┼─────────┘
                                                         │
                    ┌────────────────────────────────────┘
                    ▼
         ┌──────────────────┐
         │   Amazon ECR     │  ◀── Docker image pushed
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐      ┌──────────────────┐
         │   AWS EC2        │ ◀────│  HashiCorp Vault  │
         │   (Deploy)       │      │  (Secrets at      │
         └──────────────────┘      │   runtime)        │
                                   └──────────────────┘
◀─────────────── CD (Publish & Deploy) ────────────────▶
```

The pipeline is split into two clear phases:

- **CI (Continuous Integration):** Checkout → Build → Test — validates that the code compiles and all tests pass.
- **CD (Continuous Delivery):** Docker Build → Push to ECR → Vault Secrets → Deploy to EC2 — publishes the artifact and deploys it to infrastructure.

This separation ensures that build failures never trigger a deployment, and that application secrets never touch the CI environment.

---

## Stage Breakdown

### 1. Trigger — Developer Push

The pipeline is triggered by Git events:

| Event | Branch | Pipeline Scope |
|---|---|---|
| `push` | `main` | Full pipeline (CI + CD) |
| `push` | `develop` | CI only (build & test) |
| `pull_request` | `main` | CI only (build & test) |

#### Branch Strategy

```
feature/add-monitoring
         │
         ▼  PR (code review + CI checks)
      develop  ─────────────────────────▶  CI runs on push
         │
         ▼  PR (approval required)
       main  ───────────────────────────▶  Full CI + CD pipeline
```

- **`feature/*`** — short-lived branches for individual changes. Developers create PRs against `develop` or `main`.
- **`develop`** — integration branch. Pushes trigger CI only (no deployment). Used for validating merged feature work.
- **`main`** — production branch. Merges trigger the full pipeline including Docker build, ECR push, and EC2 deployment.

#### Protected Branch Rules on `main`

- Require pull request before merging
- Require at least 1 approval
- Require status checks to pass (build-and-test job)
- Require branches to be up to date before merging
- No force pushes
- No deletions

---

### 2. CI — Continuous Integration

#### Stage: Checkout

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

- Uses `actions/checkout@v4` for reliable, cached repository cloning.
- `fetch-depth: 0` fetches full Git history — required for accurate versioning (e.g., commit-count-based version numbers, changelog generation).
- Shallow clones (`fetch-depth: 1`) would break `git describe` and SonarCloud's new-code detection.

#### Stage: Maven Build

```yaml
- name: Set up Java 17
  uses: actions/setup-java@v4
  with:
    java-version: '17'
    distribution: temurin
    cache: maven

- name: Build with Maven
  run: mvn clean package -DskipTests --batch-mode
```

- **Java 17** (Eclipse Temurin distribution) — LTS release, widely supported.
- `actions/setup-java@v4` handles JDK installation and Maven dependency caching (`cache: maven` caches `~/.m2/repository`).
- `mvn clean package -DskipTests` compiles source, processes resources, and packages the JAR without running tests (tests run in the next stage for clearer failure reporting).
- `--batch-mode` suppresses interactive prompts and progress output for cleaner CI logs.
- **Artifact produced:** `target/*.jar` — the packaged application, uploaded for the Docker build stage.

#### Stage: Test

```yaml
- name: Run tests
  run: mvn test --batch-mode
```

- Runs the full test suite via Maven Surefire.
- **JUnit reports** are published using `dorny/test-reporter@v1`, providing inline test results directly in the GitHub PR checks UI.
- **Code coverage** is measured via **JaCoCo** (Java Code Coverage):
  - Minimum threshold: **80% line coverage**.
  - Build fails if coverage drops below the threshold, preventing regressions.
  - Coverage report is generated as HTML and can be uploaded as an artifact for review.
- **SonarCloud scan** (optional):
  - Static analysis for code smells, bugs, vulnerabilities, and duplications.
  - Quality gate must pass for the PR to be mergeable.
  - Configured via `sonar-project.properties` or Maven plugin.

**Test report visibility:**

```yaml
- name: Publish test report
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: JUnit Tests
    path: target/surefire-reports/*.xml
    reporter: java-junit
```

The `if: always()` ensures reports are published even when tests fail — critical for debugging broken builds.

---

### 3. CD — Continuous Delivery

CD stages only run on pushes to `main` (production deployments). This is enforced with:

```yaml
if: github.ref == 'refs/heads/main'
```

#### Stage: Docker Build

```dockerfile
# Multi-stage Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY target/*.jar app.jar

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/app.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- **Multi-stage build** keeps the final image small — only the JRE and JAR are included (no JDK, no Maven, no source code).
- Image is tagged with two tags:
  - `{ECR_REGISTRY}/{repo}:{git-sha-short}` — immutable, traceable to exact commit
  - `{ECR_REGISTRY}/{repo}:latest` — rolling tag for convenience
- Build args (non-secret configuration like `APP_VERSION`) can be injected at build time. **Secrets are never passed as build args.**

#### Stage: Push to Amazon ECR

```yaml
- name: Configure AWS credentials (OIDC)
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::${{ vars.AWS_ACCOUNT_ID }}:role/github-actions-ecr
    aws-region: ${{ env.AWS_REGION }}

- name: Login to Amazon ECR
  uses: aws-actions/amazon-ecr-login@v2
```

- **AWS authentication via OIDC** — no long-lived AWS access keys stored in GitHub Secrets. GitHub's OIDC provider generates short-lived tokens that assume an IAM role.
- **Required GitHub Variables** (non-secret, stored in repository variables):
  - `AWS_ACCOUNT_ID` — the 12-digit AWS account number
  - `AWS_REGION` — defaults to `eu-west-1` in the pipeline
- The IAM role `github-actions-ecr` has a trust policy scoped to the specific repository and branch:

  ```json
  {
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:sub": "repo:ameya-godbole/portfolio:ref:refs/heads/main"
      }
    }
  }
  ```

- The role's IAM policy grants only ECR push permissions — nothing else.

#### Stage: Image Scanning (Trivy)

```yaml
- name: Scan image for vulnerabilities (Trivy)
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.IMAGE }}
    format: table
    exit-code: 1
    severity: CRITICAL
```

- **Trivy** scans the Docker image for known vulnerabilities in OS packages and application dependencies.
- `exit-code: 1` fails the pipeline if any **CRITICAL** severity CVEs are found.
- Scan runs after the image is built but the deploy is gated on this step passing.

#### Stage: HashiCorp Vault — Secrets at Runtime

```yaml
- name: Fetch secrets from HashiCorp Vault
  uses: hashicorp/vault-action@v3
  with:
    url: ${{ env.VAULT_ADDR }}
    method: jwt
    role: github-actions-deploy
    secrets: |
      secret/data/prod/app DB_URL | DB_URL ;
      secret/data/prod/app DB_PASSWORD | DB_PASSWORD ;
      secret/data/prod/app APP_SECRET_KEY | APP_SECRET_KEY
```

This is the critical security design decision:

- **Application secrets are NOT stored in GitHub Secrets.** They live exclusively in HashiCorp Vault.
- **Vault authenticates via JWT/OIDC** — GitHub Actions provides a JWT that Vault validates against its configured OIDC provider. No Vault tokens are stored in GitHub.
- **Secrets fetched at deploy time:**
  - `DB_URL` — database connection string
  - `DB_PASSWORD` — database password
  - `APP_SECRET_KEY` — application signing key
  - Additional secrets as needed
- **Vault policies enforce least-privilege:**
  - The `github-actions-deploy` role can only read from `secret/data/prod/app`.
  - Different environments (`dev`, `staging`, `prod`) have separate Vault paths and roles.
- **Dynamic secrets** (where possible): Vault can generate short-lived database credentials that auto-expire, eliminating password rotation concerns.

**Why Vault instead of GitHub Secrets?**

| Concern | GitHub Secrets | HashiCorp Vault |
|---|---|---|
| Centralised management | ❌ Per-repo | ✅ Single source of truth |
| Audit trail | ❌ Limited | ✅ Full audit log |
| Dynamic secrets | ❌ No | ✅ Yes (DB creds, AWS STS) |
| Rotation | ❌ Manual | ✅ Automatic |
| Access policies | ❌ Repo-level | ✅ Fine-grained paths |
| Cross-environment | ❌ Env-scoped secrets | ✅ Path-based separation |

#### Stage: Deploy to AWS EC2

```yaml
- name: Deploy to EC2
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ vars.EC2_HOST }}
    username: ec2-user
    key: ${{ secrets.EC2_SSH_KEY }}
    envs: IMAGE_TAG,AWS_ACCOUNT_ID,DB_URL,DB_PASSWORD,APP_SECRET_KEY
    script: |
      aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com
      docker pull $AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/portfolio-app:$IMAGE_TAG
      docker stop app || true
      docker rm app || true
      docker run -d --name app --restart unless-stopped -p 8080:8080 -e DB_URL="$DB_URL" -e DB_PASSWORD="$DB_PASSWORD" -e APP_SECRET_KEY="$APP_SECRET_KEY" $AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/portfolio-app:$IMAGE_TAG
      sleep 10
      curl -f http://localhost:8080/health || (docker stop app && exit 1)
```

Deployment steps:

1. **ECR Login** — authenticate Docker on the EC2 instance.
2. **Pull new image** — downloads the image tagged with the current commit SHA.
3. **Stop old container** — gracefully stops the running container.
4. **Run new container** — starts the new version with secrets passed as environment variables.
5. **Health check** — waits 10s, then hits `/health`.

---

## Security Principles

1. No secrets in pipeline YAML
2. IAM OIDC for AWS authentication
3. Vault dynamic secrets
4. Image scanning with Trivy
5. Branch protection
6. Least-privilege IAM policies

---

*Last updated: September 2026*
