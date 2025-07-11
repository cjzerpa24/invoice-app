#!/bin/bash

# Docker Production Environment Script for Invoice Management System
# Usage: ./scripts/docker-prod.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Check environment file
check_env() {
    if [ ! -f ".env" ]; then
        print_warning "No .env file found. Creating from template..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your production settings before starting"
            return 1
        else
            print_error "No .env.example file found. Please create .env file manually."
            return 1
        fi
    fi
}

# Build production images
build() {
    print_header "Building Production Images"
    docker-compose build --no-cache
    print_success "Production images built successfully"
}

# Start production environment
start() {
    print_header "Starting Production Environment"
    
    if ! check_env; then
        return 1
    fi
    
    docker-compose up -d
    
    echo ""
    print_success "Production environment started!"
    echo ""
    echo "Services available at:"
    echo "  Application: http://localhost:3000"
    echo "  API:         http://localhost:3000/api"
    echo "  Backend:     http://localhost:4001 (direct access)"
    echo ""
    print_warning "Remember to configure your reverse proxy/load balancer for production use"
    echo ""
}

# Stop production environment
stop() {
    print_header "Stopping Production Environment"
    docker-compose down
    print_success "Production environment stopped"
}

# Restart production environment
restart() {
    stop
    start
}

# Show logs
logs() {
    if [ -n "$2" ]; then
        docker-compose logs -f "$2"
    else
        docker-compose logs -f
    fi
}

# Execute command in backend container
backend_exec() {
    docker-compose exec backend "$@"
}

# Execute command in database container
db_exec() {
    docker-compose exec database "$@"
}

# Create database backup
backup() {
    print_header "Creating Database Backup"
    BACKUP_NAME="invoice_backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec database pg_dump -U invoice_user invoice_management > "backups/$BACKUP_NAME"
    print_success "Database backup created: backups/$BACKUP_NAME"
}

# Restore database backup
restore() {
    if [ -z "$2" ]; then
        print_error "Please provide backup file path"
        echo "Usage: $0 restore <backup_file>"
        return 1
    fi
    
    if [ ! -f "$2" ]; then
        print_error "Backup file not found: $2"
        return 1
    fi
    
    print_header "Restoring Database Backup"
    print_warning "This will overwrite the current database"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec -T database psql -U invoice_user -d invoice_management < "$2"
        print_success "Database restored from: $2"
    else
        print_warning "Operation cancelled"
    fi
}

# Update application (pull images and restart)
update() {
    print_header "Updating Production Application"
    docker-compose pull
    docker-compose up -d --force-recreate
    print_success "Application updated and restarted"
}

# Show status
status() {
    print_header "Production Environment Status"
    docker-compose ps
    echo ""
    print_header "Resource Usage"
    docker stats --no-stream
}

# Show health status
health() {
    print_header "Health Check Status"
    echo "Frontend Health:"
    curl -f http://localhost:3000/health 2>/dev/null && echo " ✓ OK" || echo " ✗ FAILED"
    echo ""
    echo "Backend Health:"
    curl -f http://localhost:4001/api 2>/dev/null && echo " ✓ OK" || echo " ✗ FAILED"
    echo ""
}

# Clean up production environment (DANGEROUS)
clean() {
    print_header "Cleaning Production Environment"
    print_error "WARNING: This will remove all containers, networks, and volumes"
    print_error "This will PERMANENTLY DELETE all your data!"
    read -p "Are you absolutely sure? Type 'DELETE' to continue: " -r
    if [[ $REPLY == "DELETE" ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Production environment cleaned (all data lost)"
    else
        print_warning "Operation cancelled"
    fi
}

# Show help
help() {
    echo "Invoice Management System - Production Docker Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build production images"
    echo "  start       Start production environment"
    echo "  stop        Stop production environment"
    echo "  restart     Restart production environment"
    echo "  update      Pull latest images and restart"
    echo "  logs [service]  Show logs (optionally for specific service)"
    echo "  backend [cmd]   Execute command in backend container"
    echo "  db [cmd]    Execute command in database container"
    echo "  backup      Create database backup"
    echo "  restore <file>  Restore database from backup"
    echo "  status      Show container status and resource usage"
    echo "  health      Check application health"
    echo "  clean       Clean up all containers and volumes (DANGEROUS)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs frontend"
    echo "  $0 backup"
    echo "  $0 restore backups/invoice_backup_20241201_120000.sql"
    echo "  $0 backend npm run typeorm:migration:run"
    echo ""
}

# Create backups directory if it doesn't exist
mkdir -p backups

# Main script logic
check_docker

case "${1:-help}" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    update)
        update
        ;;
    logs)
        logs "$@"
        ;;
    backend)
        shift
        backend_exec "$@"
        ;;
    db)
        shift
        db_exec "$@"
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$@"
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    clean)
        clean
        ;;
    help|*)
        help
        ;;
esac 