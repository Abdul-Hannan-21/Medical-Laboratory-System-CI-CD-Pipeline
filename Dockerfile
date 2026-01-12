# Multi-stage Dockerfile for Medical Laboratory System
# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for building)
RUN npm ci

# Copy application code
COPY . .

# Build the application (if you have a build step)
# RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

# Alternative Python-based Dockerfile (uncomment if using Python)
# FROM python:3.11-slim AS builder
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --user --no-cache-dir -r requirements.txt
# 
# FROM python:3.11-slim
# WORKDIR /app
# RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
# COPY --from=builder /root/.local /home/appuser/.local
# COPY --chown=appuser:appuser . .
# USER appuser
# ENV PATH=/home/appuser/.local/bin:$PATH
# EXPOSE 8000
# CMD ["python", "app.py"]

