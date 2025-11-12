# 🐳 Docker Deployment Guide

This guide covers how to deploy the Invoice Management System using Docker and Docker Compose.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- At least 4GB RAM available for containers
- Git (for cloning the repository)

## 🏗️ Architecture Overview

The Docker setup includes:

- **Frontend**: Vue.js app served by Nginx (Port 3000)
- **Backend**: NestJS API server (Port 4001)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)
- **Proxy**: Nginx handles routing and serves static files

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │  Database   │
│  (Vue.js)   │◄──►│  (NestJS)   │◄──►│(PostgreSQL) │
│   Nginx     │    │             │    │             │
│   :3000     │    │   :4001     │    │   :5432     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │    Redis    │
                  │   :6379     │
                  └─────────────┘
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd invoice-app

# Copy environment template
cp docker.env.example .env

# Edit environment variables
nano .env  # or your preferred editor
```

### 2. Production Deployment

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Your application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Direct Backend**: http://localhost:4001
- **Database**: localhost:5432

### 3. Development Environment

For development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps
```

Development services:
- **Frontend**: http://localhost:3001 (with hot reload)
- **Backend**: http://localhost:4001 (with hot reload)
- **Database**: localhost:5433
- **pgAdmin**: http://localhost:8080
- **Redis**: localhost:6380

## 📁 File Structure

```
invoice-app/
├── docker-compose.yml           # Production setup
├── docker-compose.dev.yml       # Development setup
├── docker.env.example          # Environment template
├── scripts/
│   ├── docker-dev.sh           # Development management script
│   └── docker-prod.sh          # Production management script
├── backend/
│   ├── Dockerfile              # Production backend image
│   ├── Dockerfile.dev          # Development backend image
│   ├── .dockerignore           # Backend build exclusions
│   └── src/health-check.js     # Health check script
├── frontend/
│   ├── Dockerfile              # Frontend production image
│   ├── nginx.conf              # Nginx configuration
│   └── .dockerignore           # Frontend build exclusions
└── backups/                    # Database backups (created automatically)
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp docker.env.example .env
```

Key variables to configure:

```env
# Database
DATABASE_URL=postgresql://invoice_user:CHANGE_THIS_PASSWORD@database:5432/invoice_management

# Security
JWT_SECRET=GENERATE_A_SECURE_32_CHARACTER_SECRET_KEY

# Application
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
```

### Production Security

For production deployment:

1. **Change default passwords**:
   ```env
   DB_PASSWORD=your_secure_database_password
   JWT_SECRET=your_32_character_minimum_jwt_secret
   ```

2. **Configure CORS**:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
   ```

3. **Set secure database credentials**:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   ```

## 🛠️ Management Scripts

### Development Script

```bash
# Make executable (Linux/Mac)
chmod +x scripts/docker-dev.sh

# Available commands
./scripts/docker-dev.sh start      # Start development environment
./scripts/docker-dev.sh stop       # Stop development environment
./scripts/docker-dev.sh logs       # View all logs
./scripts/docker-dev.sh backend    # Execute command in backend
./scripts/docker-dev.sh db         # Execute command in database
./scripts/docker-dev.sh clean      # Clean up everything
```

### Production Script

```bash
# Make executable (Linux/Mac)
chmod +x scripts/docker-prod.sh

# Available commands
./scripts/docker-prod.sh start     # Start production environment
./scripts/docker-prod.sh backup    # Create database backup
./scripts/docker-prod.sh health    # Check application health
./scripts/docker-prod.sh update    # Update and restart services
```

## 📊 Monitoring and Maintenance

### Health Checks

All containers include health checks:

```bash
# Check container health
docker-compose ps

# Manual health check
curl http://localhost:3000/health
curl http://localhost:4001/api
```

### Database Backups

```bash
# Create backup
./scripts/docker-prod.sh backup

# Restore from backup
./scripts/docker-prod.sh restore backups/invoice_backup_20241201_120000.sql
```

### Log Management

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database

# Limit log output
docker-compose logs --tail=100 backend
```

### Resource Monitoring

```bash
# Check resource usage
docker stats

# Detailed container info
docker-compose ps -a
```

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :4001

# Change ports in docker-compose.yml if needed
```

#### Database Connection Issues
```bash
# Check database logs
docker-compose logs database

# Connect to database manually
docker-compose exec database psql -U invoice_user -d invoice_management
```

#### Frontend Build Issues
```bash
# Rebuild frontend image
docker-compose build --no-cache frontend

# Check build logs
docker-compose logs frontend
```

#### Backend API Issues
```bash
# Check backend logs
docker-compose logs backend

# Execute commands in backend
docker-compose exec backend npm run typeorm:migration:run
```

### Performance Optimization

#### Database Performance
```bash
# Monitor database performance
docker-compose exec database psql -U invoice_user -d invoice_management -c "SELECT * FROM pg_stat_activity;"
```

#### Memory Usage
```bash
# Limit container memory (in docker-compose.yml)
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## 🚀 Production Deployment

### Docker Swarm (Recommended for production)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml invoice-stack

# Scale services
docker service scale invoice-stack_backend=3
```

### Kubernetes

See `k8s/` directory for Kubernetes manifests (if available).

### Cloud Deployment

#### AWS ECS
```bash
# Build and push images
docker build -t your-registry/invoice-frontend ./frontend
docker build -t your-registry/invoice-backend ./backend
docker push your-registry/invoice-frontend
docker push your-registry/invoice-backend
```

#### Google Cloud Run
```bash
# Deploy frontend
gcloud run deploy invoice-frontend \
  --image your-registry/invoice-frontend \
  --platform managed \
  --port 80

# Deploy backend
gcloud run deploy invoice-backend \
  --image your-registry/invoice-backend \
  --platform managed \
  --port 4001
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Change all default passwords
- [ ] Use secure JWT secrets (32+ characters)
- [ ] Enable HTTPS with reverse proxy
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable log monitoring
- [ ] Use secrets management for sensitive data
- [ ] Configure resource limits
- [ ] Enable security headers
- [ ] Regular security updates

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs -f`
3. Check container status: `docker-compose ps`
4. Create an issue in the repository with:
   - Docker version: `docker --version`
   - Docker Compose version: `docker-compose --version`
   - Error logs
   - Steps to reproduce

---

**Happy Dockerizing! 🐳** 