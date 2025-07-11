# Invoice Management Backend

A NestJS backend application for managing clients, invoices, and personal business data.

## Features

- **Client Management**: Create, read, update, and delete client information
- **Invoice Management**: Full invoice lifecycle management with automatic numbering
- **Personal Data**: Manage your business information and settings
- **Database**: SQLite database with TypeORM
- **API Documentation**: Auto-generated Swagger documentation
- **Validation**: Request validation with class-validator
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd invoice-app/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run start:dev
   ```

The application will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## Database

The application uses SQLite as the database, which will be automatically created as `invoice_app.db` in the project root when you first run the application.

### Database Schema

#### Entities:
- **Client**: Client information and contact details
- **Invoice**: Invoice data with relationships to clients
- **PersonalData**: Your business information and settings

## API Endpoints

### Clients (`/clients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | Get all clients |
| GET | `/clients/:id` | Get client by ID |
| POST | `/clients` | Create new client |
| PATCH | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

### Invoices (`/invoices`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | Get all invoices |
| GET | `/invoices?status=draft` | Filter invoices by status |
| GET | `/invoices?clientId=uuid` | Filter invoices by client |
| GET | `/invoices/:id` | Get invoice by ID |
| GET | `/invoices/generate-number` | Generate new invoice number |
| POST | `/invoices` | Create new invoice |
| PATCH | `/invoices/:id` | Update invoice |
| PATCH | `/invoices/:id/status` | Update invoice status |
| DELETE | `/invoices/:id` | Delete invoice |

### Personal Data (`/personal-data`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/personal-data` | Get all personal data records |
| GET | `/personal-data/default` | Get default personal data |
| GET | `/personal-data/:id` | Get personal data by ID |
| POST | `/personal-data` | Create new personal data |
| POST | `/personal-data/create-or-update` | Create or update default |
| PATCH | `/personal-data/:id` | Update personal data |
| DELETE | `/personal-data/:id` | Delete personal data |

## Usage Examples

### 1. Create a Client

```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

### 2. Create Personal Data

```bash
curl -X POST http://localhost:3000/personal-data/create-or-update \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Your Name",
    "businessName": "Your Business",
    "email": "your@email.com",
    "phone": "+1234567890",
    "address": "Your Address",
    "city": "Your City",
    "state": "Your State",
    "zipCode": "12345",
    "country": "Your Country",
    "taxId": "TAX123456",
    "website": "https://yourbusiness.com"
  }'
```

### 3. Generate Invoice Number

```bash
curl -X GET http://localhost:3000/invoices/generate-number
```

### 4. Create an Invoice

```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-202412-0001",
    "clientId": "client-uuid-here",
    "issueDate": "2024-12-01",
    "dueDate": "2024-12-31",
    "description": "Monthly services",
    "items": [
      {
        "description": "Web development",
        "quantity": 40,
        "unitPrice": 50,
        "total": 2000
      },
      {
        "description": "Consulting",
        "quantity": 10,
        "unitPrice": 100,
        "total": 1000
      }
    ],
    "subtotal": 3000,
    "taxRate": 10,
    "taxAmount": 300,
    "total": 3300,
    "status": "draft",
    "terms": "Payment due within 30 days"
  }'
```

### 5. Update Invoice Status

```bash
curl -X PATCH http://localhost:3000/invoices/invoice-uuid-here/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'
```

## Invoice Status Options

- `draft` - Initial status
- `sent` - Invoice has been sent to client
- `paid` - Invoice has been paid
- `overdue` - Invoice is past due date
- `cancelled` - Invoice has been cancelled

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with auto-reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── entities/              # TypeORM entities
│   ├── client.entity.ts
│   ├── invoice.entity.ts
│   └── personal-data.entity.ts
├── modules/               # Feature modules
│   ├── clients/
│   │   ├── dto/
│   │   ├── clients.controller.ts
│   │   ├── clients.service.ts
│   │   └── clients.module.ts
│   ├── invoices/
│   │   ├── dto/
│   │   ├── invoices.controller.ts
│   │   ├── invoices.service.ts
│   │   └── invoices.module.ts
│   └── personal-data/
│       ├── dto/
│       ├── personal-data.controller.ts
│       ├── personal-data.service.ts
│       └── personal-data.module.ts
├── app.module.ts          # Main application module
└── main.ts               # Application entry point
```

## License

This project is licensed under the UNLICENSED License. 