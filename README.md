# Invoice Management System

A modern, full-stack invoice management application built with NestJS (backend) and Vue.js (frontend). This system provides comprehensive tools for managing clients, invoices, and business data with features like PDF generation, multi-language support, and user authentication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-16%2B-brightgreen.svg)
![Vue.js](https://img.shields.io/badge/vue.js-3.x-brightgreen.svg)
![NestJS](https://img.shields.io/badge/nestjs-10.x-red.svg)

## 🚀 Features

### 🏢 Business Management
- **Client Management**: Complete CRUD operations for client information
- **Personal Data Management**: Manage your business information and settings
- **User Authentication**: Secure JWT-based authentication system

### 🔐 Authentication & Security
- **User Registration & Login**: Secure account creation and authentication
- **Password Reset**: Forgot password functionality with email reset links
- **Change Password**: Authenticated users can change their passwords
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption

### 📄 Invoice System
- **Invoice Creation**: Create detailed invoices with multiple line items
- **Automatic Calculations**: Real-time calculation of subtotals, taxes, and totals
- **Invoice Numbering**: Automatic invoice number generation
- **Status Tracking**: Track invoice status (Draft, Sent, Paid, Overdue, Cancelled)
- **PDF Generation**: Generate professional PDF invoices
- **Multi-language Support**: Invoice generation in English and Spanish

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Dashboard**: Overview of key metrics and quick actions
- **Real-time Updates**: Instant feedback and updates
- **Mobile Friendly**: Responsive design for all devices

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10.x
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with Passport.js
- **Password Reset**: Secure token-based reset with email integration
- **PDF Generation**: Puppeteer
- **Template Engine**: Handlebars
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Vue.js 3.x
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **UI Components**: Headless UI

## 📦 Project Structure

```
invoice-app/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── entities/       # Database entities
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication & password reset
│   │   │   ├── clients/    # Client management
│   │   │   ├── invoices/   # Invoice management
│   │   │   └── personal-data/ # Business data
│   │   └── main.ts         # Application entry point
│   ├── package.json
│   └── README.md
├── frontend/               # Vue.js client application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── views/          # Page components
│   │   │   └── auth/       # Authentication pages
│   │   ├── services/       # API services
│   │   ├── stores/         # Pinia stores
│   │   └── router/         # Vue Router config
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- Docker & Docker Compose (recommended)

### Option 1: Docker Deployment (Recommended)

```bash
git clone https://github.com/yourusername/invoice-management-system.git
cd invoice-management-system/invoice-app

# Copy environment template
cp docker.env.example .env

# Edit environment variables (change passwords and secrets!)
nano .env

# Start production environment
docker-compose up -d

# Check status
docker-compose ps
```

**Services will be available at:**
- **Application**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Direct Backend**: http://localhost:3000

### Option 2: Manual Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/invoice-management-system.git
cd invoice-management-system/invoice-app
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp env.example .env

# Start development server
npm run start:dev
```

The backend will be available at: http://localhost:3000
API documentation: http://localhost:3000/api

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3001

### 🐳 Docker Documentation

For detailed Docker setup, configuration, and management, see [DOCKER.md](DOCKER.md)

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# CORS Configuration
FRONTEND_URL="http://localhost:3001"

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:3000/api for interactive API documentation powered by Swagger.

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)
- `GET /auth/me` - Get current user profile

#### Clients
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `GET /clients/:id` - Get client by ID
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

#### Invoices
- `GET /invoices` - List all invoices (with filters)
- `POST /invoices` - Create new invoice
- `GET /invoices/:id` - Get invoice by ID
- `PATCH /invoices/:id` - Update invoice
- `GET /invoices/:id/pdf` - Download invoice PDF
- `GET /invoices/generate-number` - Generate invoice number

## 🔐 Password Reset Flow

### 1. Request Password Reset
User enters their email address on the forgot password page.

### 2. Email Sent
System generates a secure reset token and sends an email with a reset link.

### 3. Reset Password
User clicks the link and enters a new password.

### 4. Password Updated
System validates the token and updates the user's password.

### Development Mode
In development mode, the reset token is logged to the console for testing purposes.

## 🚀 Deployment

### Docker Deployment (Recommended)

The easiest way to deploy the application is using Docker:

```bash
# Production deployment
docker-compose up -d

# Development environment
docker-compose -f docker-compose.dev.yml up -d

# Scale services for high availability
docker-compose up -d --scale backend=3
```

**Features of Docker deployment:**
- 🐳 Complete containerization with PostgreSQL and Redis
- 🔄 Health checks and automatic restarts
- 📊 Built-in monitoring and logging
- 🔧 Easy backup and restore functionality
- 🚀 One-command deployment

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

### Manual Deployment

#### Backend Deployment
The backend is configured for deployment on platforms like Railway, Heroku, or any Node.js hosting service.

1. Set production environment variables
2. Configure PostgreSQL database
3. Build the application: `npm run build`
4. Start production server: `npm run start:prod`

#### Frontend Deployment
The frontend can be deployed on platforms like Vercel, Netlify, or any static hosting service.

1. Build the application: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables on your hosting platform

### Cloud Platforms

#### AWS ECS
```bash
# Build and push images
docker build -t your-registry/invoice-frontend ./frontend
docker build -t your-registry/invoice-backend ./backend
```

#### Google Cloud Run
```bash
# Deploy with Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

#### DigitalOcean App Platform
Use the included `docker-compose.yml` for app platform deployment.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Email integration for sending invoices
- [ ] Payment gateway integration
- [ ] Recurring invoices
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] Mobile application
- [ ] Two-factor authentication
- [ ] Social login integration

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Invoice Creation
![Invoice Creation](screenshots/invoice-creation.png)

### PDF Generation
![PDF Generation](screenshots/pdf-generation.png)

---

**Built with ❤️ using NestJS and Vue.js** 