# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Password Reset Functionality**
  - Forgot password feature with email reset links
  - Secure token-based password reset system
  - Password reset email service (development mode logs to console)
  - Reset token expiration (1 hour)
  - Frontend components for forgot password and reset password flows

- **Change Password Feature**
  - Authenticated users can change their passwords
  - Current password verification
  - Frontend component for password change
  - User dropdown menu in navigation

- **Enhanced Authentication**
  - Additional password reset fields in User entity
  - Email service for password reset notifications
  - Secure token generation and validation
  - Environment configuration for email services

### Changed
- Updated User entity with password reset fields
- Enhanced auth store with password reset methods
- Improved navigation with user dropdown menu
- Updated environment configuration examples

### Technical
- Added crypto-based token generation for password reset
- Implemented email service infrastructure
- Enhanced security with token expiration
- Added comprehensive password validation

## [1.0.0] - 2024-12-01

### Added
- **Authentication System**
  - JWT-based authentication
  - User registration and login
  - Protected routes and API endpoints

- **Client Management**
  - Complete CRUD operations for clients
  - Client information with contact details
  - Address and business information storage

- **Invoice Management**
  - Create, edit, and delete invoices
  - Multiple line items per invoice
  - Automatic calculations (subtotal, tax, total)
  - Invoice status tracking (Draft, Sent, Paid, Overdue, Cancelled)
  - Automatic invoice number generation

- **PDF Generation**
  - Professional PDF invoice generation
  - Multi-language support (English and Spanish)
  - Customizable invoice templates
  - Download and preview functionality

- **Personal Data Management**
  - Business information configuration
  - Bank details and payment instructions
  - Default invoice terms and conditions
  - Logo and signature support

- **Frontend Features**
  - Modern Vue.js 3 application
  - Responsive design with Tailwind CSS
  - Real-time form validation
  - Dashboard with key metrics
  - Intuitive user interface

- **Backend Features**
  - NestJS REST API
  - TypeORM with SQLite/PostgreSQL support
  - Swagger API documentation
  - Input validation and error handling
  - Modular architecture

### Technical
- **Database**: SQLite for development, PostgreSQL for production
- **Backend**: NestJS 10.x with TypeScript
- **Frontend**: Vue.js 3.x with Composition API
- **Styling**: Tailwind CSS with custom components
- **Build Tools**: Vite for frontend, standard NestJS build for backend
- **PDF Engine**: Puppeteer with Handlebars templates
- **Authentication**: JWT with Passport.js strategies

### Security
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment-based configuration

---

## Release Notes Format

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements 