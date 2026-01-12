# Deployment Guide - Medical Laboratory System

This guide provides step-by-step instructions for deploying the Medical Laboratory Test Booking and Result Management System.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Docker and Docker Compose installed
- [ ] Access to the deployment environment
- [ ] Required secrets and environment variables configured
- [ ] Database backup strategy in place
- [ ] SSL certificates for HTTPS
- [ ] Domain name configured
- [ ] Monitoring and alerting set up

## 🔐 Security Checklist

For medical systems, security is critical:

- [ ] All secrets are stored in secure vaults (not in code)
- [ ] SSL/TLS certificates are valid and properly configured
- [ ] Database encryption at rest is enabled
- [ ] Network isolation is configured
- [ ] Access logs are enabled and monitored
- [ ] Backup and disaster recovery plan is in place
- [ ] HIPAA compliance measures are verified

## 🚀 Deployment Steps

### 1. Pre-Deployment

#### 1.1 Backup Current System
```bash
# Backup database
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup application files
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/app
```

#### 1.2 Verify Environment Variables
```bash
# Check all required environment variables are set
env | grep -E "DATABASE_URL|JWT_SECRET|API_KEY"
```

#### 1.3 Update Configuration Files
- Review `docker-compose.yml` for environment-specific settings
- Update `nginx.conf` with correct domain names
- Verify SSL certificate paths

### 2. Staging Deployment

#### 2.1 Deploy to Staging

**Using GitHub Actions:**
1. Push changes to `develop` branch
2. Monitor GitHub Actions workflow
3. Verify staging deployment at staging URL

**Using GitLab CI:**
1. Push changes to `develop` branch
2. Go to CI/CD > Pipelines
3. Click "Run pipeline" and select `develop`
4. Manually trigger deployment job when ready

**Manual Deployment:**
```bash
# Clone and checkout develop branch
git clone <repository-url>
cd pipeline
git checkout develop

# Build and deploy
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Verify deployment
curl https://staging.medical-lab.example.com/health
```

#### 2.2 Verify Staging Deployment

```bash
# Check container status
docker-compose ps

# Check application logs
docker-compose logs -f app

# Run health check
curl https://staging.medical-lab.example.com/health

# Verify database connectivity
docker-compose exec postgres psql -U lab_user -d medical_lab_db -c "SELECT version();"
```

#### 2.3 Run Staging Tests

- [ ] User authentication works
- [ ] Test booking functionality
- [ ] Result upload works
- [ ] Email notifications are sent
- [ ] All API endpoints respond correctly
- [ ] Database operations work as expected

### 3. Production Deployment

#### 3.1 Pre-Production Checklist

- [ ] All staging tests passed
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Rollback plan prepared
- [ ] Team notified of deployment window
- [ ] Monitoring dashboards ready

#### 3.2 Deploy to Production

**Using GitHub Actions:**
1. Merge to `main` branch (or create release)
2. Go to Actions tab
3. Review and approve production deployment
4. Monitor deployment progress

**Using GitLab CI:**
1. Merge to `main` branch
2. Go to CI/CD > Pipelines
3. Click "Play" on deploy-production job
4. Confirm deployment

**Manual Deployment:**
```bash
# Clone and checkout main branch
git clone <repository-url>
cd pipeline
git checkout main

# Pull latest changes
git pull origin main

# Stop existing services (gracefully)
docker-compose down

# Backup before deployment
# ... backup steps ...

# Build new images
docker-compose build --no-cache

# Start services
docker-compose up -d

# Verify deployment
curl https://medical-lab.example.com/health
```

#### 3.3 Post-Deployment Verification

```bash
# Check service health
curl https://medical-lab.example.com/health

# Verify database
docker-compose exec postgres psql -U lab_user -d medical_lab_db

# Check logs for errors
docker-compose logs --tail=100 app

# Monitor resource usage
docker stats
```

### 4. Post-Deployment Tasks

#### 4.1 Smoke Tests

Run critical user journeys:
- [ ] Login/authentication
- [ ] Book a test
- [ ] View test results
- [ ] Download reports

#### 4.2 Monitor

- [ ] Check application metrics in Grafana
- [ ] Review error logs
- [ ] Verify all services are healthy
- [ ] Check database performance
- [ ] Monitor API response times

#### 4.3 Documentation

- [ ] Update deployment log
- [ ] Document any issues encountered
- [ ] Update version number
- [ ] Notify team of successful deployment

## 🔄 Rollback Procedure

If issues are detected:

### Quick Rollback

```bash
# Stop current version
docker-compose down

# Pull previous version
git checkout <previous-commit-hash>
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d

# Verify rollback
curl https://medical-lab.example.com/health
```

### Database Rollback

```bash
# Restore from backup
psql -h $DB_HOST -U $DB_USER $DB_NAME < backup_YYYYMMDD_HHMMSS.sql
```

## 📊 Monitoring and Maintenance

### Daily Checks

- [ ] Service health status
- [ ] Error log review
- [ ] Database performance
- [ ] Disk space usage
- [ ] Certificate expiry (SSL)

### Weekly Tasks

- [ ] Security scan review
- [ ] Performance metrics analysis
- [ ] Backup verification
- [ ] Dependency updates review

### Monthly Tasks

- [ ] Full security audit
- [ ] Disaster recovery drill
- [ ] Capacity planning review
- [ ] Compliance review

## 🐛 Troubleshooting

### Common Issues

**Issue: Container won't start**
```bash
# Check logs
docker-compose logs app

# Verify environment variables
docker-compose config
```

**Issue: Database connection fails**
```bash
# Check database is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U lab_user -d medical_lab_db
```

**Issue: Health check failing**
```bash
# Check application logs
docker-compose logs app | grep -i error

# Verify port is exposed
netstat -tuln | grep 3000
```

## 📞 Support Contacts

- **DevOps Team**: devops@medical-lab.example.com
- **On-Call Engineer**: +1-XXX-XXX-XXXX
- **Emergency Escalation**: emergency@medical-lab.example.com

## 🔗 Additional Resources

- [Main README](./README.md)
- [CI/CD Pipeline Documentation](./README.md#-pipeline-stages)
- [Security Guidelines](./README.md#-security-considerations)

---

**⚠️ IMPORTANT**: For medical systems, any production deployment must be approved by authorized personnel and scheduled during maintenance windows when possible.

