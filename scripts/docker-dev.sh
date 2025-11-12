#!/bin/bash

# Docker Development Environment Script for Invoice Management System
# Usage: ./scripts/docker-dev.sh [command]

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

# Build development images
build() {
    print_header "Building Development Images"
    docker-compose -f docker-compose.dev.yml build --no-cache
    print_success "Development images built successfully"
}

# Start development environment
start() {
    print_header "Starting Development Environment"
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ""
    print_success "Development environment started!"
    echo ""
    echo "Services available at:"
    echo "  Frontend:  http://localhost:3001"
    echo "  Backend:   http://localhost:4001"
    echo "  API Docs:  http://localhost:4001/api"
    echo "  Database:  localhost:5433"
    echo "  pgAdmin:   http://localhost:8080"
    echo "  Redis:     localhost:6380"
    echo ""
    echo "pgAdmin credentials:"
    echo "  Email:     admin@invoice.local"
    echo "  Password:  admin123"
    echo ""
}

# Stop development environment
stop() {
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped"
}

# Restart development environment
restart() {
    stop
    start
}

# Show logs
logs() {
    if [ -n "$2" ]; then
        docker-compose -f docker-compose.dev.yml logs -f "$2"
    else
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# Execute command in backend container
backend_exec() {
    docker-compose -f docker-compose.dev.yml exec backend-dev "$@"
}

# Execute command in database container
db_exec() {
    docker-compose -f docker-compose.dev.yml exec database "$@"
}

# Clean up development environment
clean() {
    print_header "Cleaning Development Environment"
    print_warning "This will remove all containers, networks, and volumes"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_success "Development environment cleaned"
    else
        print_warning "Operation cancelled"
    fi
}

# Show status
status() {
    print_header "Development Environment Status"
    docker-compose -f docker-compose.dev.yml ps
}

# Show help
help() {
    echo "Invoice Management System - Development Docker Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build development images"
    echo "  start       Start development environment"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  logs [service]  Show logs (optionally for specific service)"
    echo "  backend [cmd]   Execute command in backend container"
    echo "  db [cmd]    Execute command in database container"
    echo "  status      Show container status"
    echo "  clean       Clean up all containers, networks, and volumes"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend-dev"
    echo "  $0 backend npm run test"
    echo "  $0 db psql -U invoice_user -d invoice_management_dev"
    echo ""
}

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
    status)
        status
        ;;
    clean)
        clean
        ;;
    help|*)
        help
        ;;
esac 