# Docker Development Environment Script for Invoice Management System (PowerShell)
# Usage: .\scripts\docker-dev.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Get script directory and project directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
Set-Location $ProjectDir

# Colors for output
function Write-Header($message) {
    Write-Host "`n=== $message ===" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success($message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

# Check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        exit 1
    }
}

# Build development images
function Build-Images {
    Write-Header "Building Development Images"
    docker-compose -f docker-compose.dev.yml build --no-cache
    Write-Success "Development images built successfully"
}

# Start development environment
function Start-Environment {
    Write-Header "Starting Development Environment"
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Host ""
    Write-Success "Development environment started!"
    Write-Host ""
    Write-Host "Services available at:"
    Write-Host "  Frontend:  http://localhost:3001"
    Write-Host "  Backend:   http://localhost:4001"
    Write-Host "  API Docs:  http://localhost:4001/api"
    Write-Host "  Database:  localhost:5433"
    Write-Host "  pgAdmin:   http://localhost:8080"
    Write-Host "  Redis:     localhost:6380"
    Write-Host ""
    Write-Host "pgAdmin credentials:"
    Write-Host "  Email:     admin@invoice.local"
    Write-Host "  Password:  admin123"
    Write-Host ""
}

# Stop development environment
function Stop-Environment {
    Write-Header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    Write-Success "Development environment stopped"
}

# Restart development environment
function Restart-Environment {
    Stop-Environment
    Start-Environment
}

# Show logs
function Show-Logs {
    if ($Arguments.Count -gt 0) {
        docker-compose -f docker-compose.dev.yml logs -f $Arguments[0]
    } else {
        docker-compose -f docker-compose.dev.yml logs -f
    }
}

# Execute command in backend container
function Invoke-BackendCommand {
    docker-compose -f docker-compose.dev.yml exec backend-dev $Arguments
}

# Execute command in database container
function Invoke-DatabaseCommand {
    docker-compose -f docker-compose.dev.yml exec database $Arguments
}

# Clean up development environment
function Clear-Environment {
    Write-Header "Cleaning Development Environment"
    Write-Warning "This will remove all containers, networks, and volumes"
    $confirm = Read-Host "Are you sure? (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        Write-Success "Development environment cleaned"
    } else {
        Write-Warning "Operation cancelled"
    }
}

# Show status
function Show-Status {
    Write-Header "Development Environment Status"
    docker-compose -f docker-compose.dev.yml ps
}

# Show help
function Show-Help {
    Write-Host "Invoice Management System - Development Docker Script (PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\scripts\docker-dev.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  build       Build development images"
    Write-Host "  start       Start development environment"
    Write-Host "  stop        Stop development environment"
    Write-Host "  restart     Restart development environment"
    Write-Host "  logs [service]  Show logs (optionally for specific service)"
    Write-Host "  backend [cmd]   Execute command in backend container"
    Write-Host "  db [cmd]    Execute command in database container"
    Write-Host "  status      Show container status"
    Write-Host "  clean       Clean up all containers, networks, and volumes"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\scripts\docker-dev.ps1 start"
    Write-Host "  .\scripts\docker-dev.ps1 logs backend-dev"
    Write-Host "  .\scripts\docker-dev.ps1 backend npm run test"
    Write-Host "  .\scripts\docker-dev.ps1 db psql -U invoice_user -d invoice_management_dev"
    Write-Host ""
}

# Main script logic
Test-Docker

switch ($Command.ToLower()) {
    "build" { Build-Images }
    "start" { Start-Environment }
    "stop" { Stop-Environment }
    "restart" { Restart-Environment }
    "logs" { Show-Logs }
    "backend" { Invoke-BackendCommand }
    "db" { Invoke-DatabaseCommand }
    "status" { Show-Status }
    "clean" { Clear-Environment }
    default { Show-Help }
} 