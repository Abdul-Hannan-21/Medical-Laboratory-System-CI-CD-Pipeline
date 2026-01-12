# Kubernetes Deployment

This directory contains Kubernetes deployment manifests for the Medical Laboratory System.

## Files

- `deployment.yaml.example` - Example Kubernetes deployment, service, and ingress configuration

## Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Helm (optional, for package management)
- cert-manager (for SSL certificates)

## Deployment

### 1. Create Namespace

```bash
kubectl create namespace medical-lab
```

### 2. Create Secrets

```bash
kubectl create secret generic medical-lab-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=redis-url='redis://...' \
  --from-literal=jwt-secret='your-secret' \
  --namespace=medical-lab
```

### 3. Create Image Pull Secret (if using private registry)

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=your-username \
  --docker-password=your-token \
  --namespace=medical-lab
```

### 4. Deploy Application

```bash
kubectl apply -f deployment.yaml.example -n medical-lab
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n medical-lab

# Check services
kubectl get services -n medical-lab

# Check ingress
kubectl get ingress -n medical-lab

# View logs
kubectl logs -f deployment/medical-lab-app -n medical-lab
```

## Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment medical-lab-app --replicas=5 -n medical-lab
```

## Rolling Update

```bash
# Update image
kubectl set image deployment/medical-lab-app \
  app=ghcr.io/your-org/medical-lab-app:v1.0.1 \
  -n medical-lab

# Check rollout status
kubectl rollout status deployment/medical-lab-app -n medical-lab
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/medical-lab-app -n medical-lab

# Rollback to previous version
kubectl rollout undo deployment/medical-lab-app -n medical-lab
```

