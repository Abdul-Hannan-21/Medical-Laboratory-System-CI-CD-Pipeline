# CI/CD Pipeline Structure

This document provides an overview of the complete CI/CD pipeline structure for the Medical Laboratory Test Booking and Result Management System.

## 📁 Project Structure

```
pipeline/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml              # Main CI/CD pipeline
│       ├── code-quality.yml       # Code quality checks
│       └── security-audit.yml     # Security auditing workflows
├── .gitlab-ci.yml                 # GitLab CI configuration
├── k8s/
│   ├── deployment.yaml.example    # Kubernetes deployment manifests
│   └── README.md                  # Kubernetes deployment guide
├── .dockerignore                  # Docker ignore patterns
├── .gitignore                     # Git ignore patterns
├── .snyk                          # Snyk security configuration
├── .trivyignore                   # Trivy vulnerability ignore list
├── Dockerfile                     # Multi-stage Docker build file
├── docker-compose.yml             # Local development environment
├── healthcheck.js                 # Health check script
├── nginx.conf.example             # Nginx reverse proxy configuration
├── prometheus.yml.example         # Prometheus monitoring configuration
├── README.md                      # Main documentation
├── DEPLOYMENT.md                  # Deployment guide
└── PIPELINE_STRUCTURE.md          # This file
```

## 🔄 Pipeline Flow

### GitHub Actions Workflow (.github/workflows/ci-cd.yml)

```
┌─────────────────┐
│   Code Push/PR  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Lint       │     │ Security Scan   │     │  Unit Tests     │
│  (ESLint/Flake8)│     │  (Trivy/Audit)  │     │   (Jest/pytest) │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │ Integration     │
                    │ Tests           │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Build Docker   │
                    │     Image       │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │ Deploy Staging  │      │ Deploy Prod     │
    │  (auto)         │      │  (manual)       │
    └────────┬────────┘      └────────┬────────┘
             │                        │
             └────────────┬───────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Health Check   │
                 └─────────────────┘
```

### GitLab CI Workflow

Similar flow with manual deployment gates and built-in SAST scanning.

## 🎯 Pipeline Stages Explained

### 1. Lint Stage
- **Purpose**: Ensure code quality and consistency
- **Tools**: ESLint, Flake8, Black, isort
- **Triggers**: Every PR and push
- **Fail Strategy**: Warning (does not block deployment)

### 2. Security Scan Stage
- **Purpose**: Identify vulnerabilities early
- **Tools**: Trivy, npm audit, pip-audit
- **Triggers**: Every PR and push
- **Reports**: SARIF format, uploaded to security tab
- **Fail Strategy**: Warning (review required)

### 3. Unit Tests Stage
- **Purpose**: Verify individual components work correctly
- **Coverage**: Target 80%+ code coverage
- **Reports**: Coverage reports uploaded to Codecov
- **Fail Strategy**: Blocks deployment if critical tests fail

### 4. Integration Tests Stage
- **Purpose**: Verify components work together
- **Services**: PostgreSQL, MySQL, Redis containers
- **Tests**: API endpoints, database operations, cache
- **Fail Strategy**: Blocks deployment

### 5. Build Stage
- **Purpose**: Create deployable artifacts
- **Output**: Docker images tagged with version and SHA
- **Platforms**: linux/amd64, linux/arm64
- **Registry**: GitHub Container Registry (ghcr.io)

### 6. Deploy Staging Stage
- **Purpose**: Test in production-like environment
- **Trigger**: Automatic on `develop` branch
- **Environment**: Staging environment
- **Verification**: Health checks and smoke tests

### 7. Deploy Production Stage
- **Purpose**: Deploy to live environment
- **Trigger**: Manual approval required
- **Environment**: Production environment
- **Pre-requisites**: All tests pass, security scans clean

### 8. Health Check Stage
- **Purpose**: Verify deployment success
- **Check**: HTTP health endpoint
- **Response**: 200 OK expected
- **Alert**: Notify on failure

## 🔐 Security Features

1. **Secret Management**
   - All secrets stored in CI/CD vaults
   - No secrets in code or logs
   - Rotated regularly

2. **Vulnerability Scanning**
   - Container image scanning
   - Dependency auditing
   - SAST (Static Application Security Testing)

3. **Access Control**
   - Non-root containers
   - Least privilege principle
   - Network isolation

4. **Compliance**
   - HIPAA-ready configuration
   - Audit logging
   - Data encryption (at rest and in transit)

## 🛠️ Customization Guide

### Adding a New Test Framework

1. Add test dependencies to `package.json` or `requirements.txt`
2. Create test scripts in CI/CD workflows
3. Update coverage reporting configuration

### Adding a New Deployment Target

1. Add new deployment job to workflow file
2. Configure environment-specific variables
3. Add health check endpoints

### Modifying Build Process

1. Update `Dockerfile` for build changes
2. Modify build job in CI/CD workflow
3. Update `docker-compose.yml` if needed

## 📊 Monitoring Integration

The pipeline integrates with:
- **Codecov**: Code coverage tracking
- **GitHub Security**: Vulnerability reporting
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Health Checks**: Automated monitoring

## 🚦 Pipeline Status Badges

Add these badges to your README:

```markdown
![CI/CD Pipeline](https://github.com/your-org/medical-lab/workflows/Medical%20Laboratory%20System%20CI/CD%20Pipeline/badge.svg)
![Security Scan](https://github.com/your-org/medical-lab/workflows/Security%20Audit/badge.svg)
![Code Quality](https://github.com/your-org/medical-lab/workflows/Code%20Quality%20Checks/badge.svg)
```

## 📝 Next Steps

1. **Configure Secrets**: Set up all required secrets in GitHub/GitLab
2. **Customize Workflows**: Adjust for your specific deployment targets
3. **Set Up Monitoring**: Configure Prometheus and Grafana
4. **Test Pipeline**: Run pipeline on a test branch
5. **Document Procedures**: Update deployment runbooks
6. **Train Team**: Ensure team understands pipeline workflow

## 🔗 Related Documentation

- [Main README](./README.md) - Overview and quick start
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Kubernetes Guide](./k8s/README.md) - K8s deployment guide

---

**Last Updated**: 2024
**Maintained By**: DevOps Team

