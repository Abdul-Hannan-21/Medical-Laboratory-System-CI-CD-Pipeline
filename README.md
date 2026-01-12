# Medical Laboratory Test Booking and Result Management System - CI/CD Pipeline

This repository contains a comprehensive CI/CD pipeline configuration for a Medical Laboratory Test Booking and Result Management System. The pipeline ensures secure, reliable, and compliant deployments while maintaining high code quality standards.

## 🏥 Overview

This CI/CD pipeline is designed specifically for medical/healthcare applications with:
- **Security-first approach** - Multiple security scanning stages
- **Compliance readiness** - Designed to support HIPAA and other healthcare regulations
- **Comprehensive testing** - Unit, integration, and health checks
- **Multi-environment support** - Staging and production deployments
- **Containerization** - Docker-based builds and deployments

## 📋 Pipeline Stages

### 1. **Code Quality & Linting**
- ESLint/TSLint for JavaScript/TypeScript projects
- Flake8, Black, isort for Python projects
- Code formatting checks
- Runs on every pull request and push

### 2. **Security Scanning**
- **Trivy** - Container and filesystem vulnerability scanning
- **npm audit** - Node.js dependency vulnerability checks
- **pip-audit** - Python package security audits
- **SARIF** report uploads to GitHub Security tab

### 3. **Unit Testing**
- Automated test execution
- Code coverage reporting
- Multi-OS testing support
- Coverage reports uploaded to Codecov

### 4. **Integration Testing**
- Database integration tests (PostgreSQL, MySQL)
- Redis cache testing
- API endpoint validation
- Service dependencies verification

### 5. **Build**
- Docker image building
- Multi-platform builds (amd64, arm64)
- Image tagging with semantic versioning
- Registry push automation

### 6. **Deployment**
- **Staging** - Automatic deployment on `develop` branch
- **Production** - Manual approval required for `main` branch
- Environment-specific configurations
- Rollback capabilities

### 7. **Health Checks**
- Post-deployment health endpoint validation
- Automated service verification
- Alerting on failures

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (if using Node.js) or Python 3.11+ (if using Python)
- Git
- GitHub/GitLab account with repository access

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pipeline
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Verify services are running**
   ```bash
   docker-compose ps
   curl http://localhost:3000/health
   ```

### Running Tests Locally

```bash
# Unit tests
npm test  # or pytest tests/unit/

# Integration tests
npm run test:integration  # or pytest tests/integration/

# Linting
npm run lint  # or flake8 .
```

## 🔧 Configuration

### GitHub Actions

The pipeline is configured in `.github/workflows/ci-cd.yml`. Key features:

- **Triggers**: Push to main/develop, pull requests, releases
- **Matrix builds**: Multi-OS and multi-version testing
- **Caching**: npm/pip dependency caching for faster builds
- **Artifacts**: Test reports, coverage, security scans

#### Required Secrets

Configure these in GitHub Settings > Secrets:

- `GITHUB_TOKEN` - Automatically provided
- `STAGING_API_KEY` - API key for staging environment
- `STAGING_DB_URL` - Database connection string for staging
- `PRODUCTION_API_KEY` - API key for production environment
- `PRODUCTION_DB_URL` - Database connection string for production

### GitLab CI

The pipeline is configured in `.gitlab-ci.yml`. Key features:

- **Manual deployments** - Production requires manual approval
- **Built-in security scanning** - SAST reports
- **Coverage tracking** - Built-in coverage reports
- **Container registry** - Automatic image pushing

#### Required Variables

Configure these in GitLab Settings > CI/CD > Variables:

- `DATABASE_URL` - Database connection strings
- `JWT_SECRET` - JWT signing secret
- `API_KEY` - API authentication key

### Docker Configuration

#### Build Arguments

- `BUILD_DATE` - Build timestamp
- `VCS_REF` - Git commit SHA
- `VERSION` - Application version

#### Environment Variables

- `NODE_ENV` - Environment (development/staging/production)
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT secret key
- `API_KEY` - API authentication key

## 🔒 Security Considerations

### Healthcare Compliance (HIPAA)

This pipeline is designed with healthcare data security in mind:

1. **Encryption at rest** - All database volumes are encrypted
2. **Encryption in transit** - TLS/SSL for all connections
3. **Access controls** - Non-root containers, least privilege
4. **Audit logging** - All actions are logged
5. **Vulnerability scanning** - Automated security checks
6. **Secret management** - Secrets stored in secure vaults

### Security Best Practices

- ✅ All secrets stored in CI/CD secrets management
- ✅ Container images scanned for vulnerabilities
- ✅ Dependencies audited regularly
- ✅ Non-root user in containers
- ✅ Health checks for service monitoring
- ✅ Network isolation between services

## 📊 Monitoring and Observability

### Health Endpoints

The application should expose a `/health` endpoint that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Monitoring Stack (Optional)

The `docker-compose.yml` includes optional monitoring services:
- **Prometheus** - Metrics collection (port 9090)
- **Grafana** - Visualization and dashboards (port 3001)

## 🏗️ Deployment Environments

### Staging

- **Branch**: `develop`
- **URL**: https://staging.medical-lab.example.com
- **Auto-deploy**: Yes (on push)
- **Database**: Separate staging database
- **Purpose**: Pre-production testing

### Production

- **Branch**: `main`
- **URL**: https://medical-lab.example.com
- **Auto-deploy**: No (requires manual approval)
- **Database**: Production database (HIPAA compliant)
- **Purpose**: Live patient data

## 📝 Customization

### Adding a New Test Suite

1. Add test files to `tests/` directory
2. Update package.json scripts or pytest configuration
3. Pipeline will automatically detect and run tests

### Adding Security Scans

1. Add new scan tools to the `security-scan` job
2. Configure tool-specific settings
3. Update `.trivyignore` or `.snyk` as needed

### Custom Deployment Scripts

Replace the placeholder deployment commands in:
- `.github/workflows/ci-cd.yml` (deploy-staging, deploy-production jobs)
- `.gitlab-ci.yml` (deploy-staging, deploy-production stages)

Example for Kubernetes:
```yaml
- name: Deploy to Kubernetes
  run: |
    kubectl apply -f k8s/staging/
    kubectl rollout status deployment/medical-lab-app -n staging
```

Example for Terraform:
```yaml
- name: Deploy with Terraform
  run: |
    terraform init
    terraform plan -var-file=staging.tfvars
    terraform apply -auto-approve -var-file=staging.tfvars
```

## 🐛 Troubleshooting

### Pipeline Fails on Security Scan

- Review the vulnerability report
- Update dependencies if safe
- Add exceptions to `.trivyignore` if acceptable (document why)

### Tests Failing Locally but Passing in CI

- Check database connections
- Verify environment variables
- Ensure test data is properly seeded

### Docker Build Fails

- Verify Dockerfile syntax
- Check for missing dependencies
- Review build logs for specific errors

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass
4. Update documentation
5. Create a pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues or questions:
- Create an issue in the repository
- Contact the DevOps team
- Review the documentation

---

**⚠️ Important**: This is a medical system handling sensitive patient data. All deployments must be reviewed and approved by authorized personnel. Never bypass security checks or deploy without proper authorization.
