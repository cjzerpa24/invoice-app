# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- GitHub Actions CI/CD pipeline
- Project documentation

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