# Invoice Management Frontend

A modern Vue.js frontend application for managing clients, invoices, and personal business data. Built with Vue 3, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of clients, invoices, and quick actions
- **Client Management**: Complete CRUD operations for client data
- **Invoice Management**: Create, edit, and track invoices with automatic calculations
- **Personal Data**: Manage business information and settings
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive design with Tailwind CSS

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Date-fns** - Date utility library
- **Headless UI** - Unstyled, fully accessible UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on localhost:3000

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd invoice-app/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3001

## API Integration

The frontend is configured to communicate with the NestJS backend API:

- **Backend URL**: http://localhost:3000
- **Proxy Configuration**: All `/api/*` requests are proxied to the backend
- **CORS**: Enabled for cross-origin requests

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable components
├── router/             # Vue Router configuration
├── services/           # API service layer
├── views/              # Page components
│   ├── Dashboard.vue   # Main dashboard
│   ├── clients/        # Client management
│   │   ├── ClientList.vue
│   │   └── ClientForm.vue
│   ├── invoices/       # Invoice management
│   │   ├── InvoiceList.vue
│   │   └── InvoiceForm.vue
│   └── PersonalDataForm.vue
├── App.vue            # Root component
├── main.js           # Application entry point
└── style.css         # Global styles
```

## Key Features

### Dashboard
- Real-time statistics (total clients, invoices, pending/overdue)
- Quick action buttons for common tasks
- Navigation to all major sections

### Client Management
- List all clients with search and filtering
- Create new clients with complete contact information
- Edit existing client details
- Delete clients with confirmation
- View client-associated invoices

### Invoice Management
- List invoices with status filtering
- Create invoices with multiple line items
- Automatic invoice number generation
- Calculate subtotals, taxes, and totals automatically
- Update invoice status (draft, sent, paid, overdue, cancelled)
- Edit and delete invoices
- Client selection and association

### Personal Data
- Manage business information
- Configure default invoice terms
- Set up payment instructions
- Store business assets (logo, signature URLs)
- Address and contact information

## API Endpoints Used

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices (with filtering)
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PATCH /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/generate-number` - Generate invoice number

### Personal Data
- `GET /api/personal-data/default` - Get default personal data
- `POST /api/personal-data/create-or-update` - Create or update personal data

## Styling

The application uses Tailwind CSS for styling with:

- **Custom Color Palette**: Primary blue theme
- **Component Classes**: Reusable button, form, and table styles
- **Responsive Design**: Mobile-first approach
- **Consistent Spacing**: Tailwind utility classes
- **Modern UI Components**: Cards, modals, and navigation

## Form Validation

- **Client Side Validation**: Real-time validation with error messages
- **Server Side Integration**: Displays backend validation errors
- **Required Field Indicators**: Visual cues for mandatory fields
- **Email Validation**: Format checking for email addresses
- **Number Validation**: Proper handling of numeric inputs

## Navigation

- **Vue Router**: Single Page Application routing
- **Active State**: Visual indication of current page
- **Breadcrumbs**: Clear navigation hierarchy
- **Back Buttons**: Easy navigation between forms and lists

## Error Handling

- **API Error Display**: User-friendly error messages
- **Loading States**: Visual feedback during API calls
- **Offline Handling**: Graceful degradation
- **Validation Feedback**: Real-time form validation

## Development

### Adding New Features

1. Create new Vue components in appropriate directories
2. Add routes to `src/router/index.js`
3. Create API service methods in `src/services/api.js`
4. Update navigation in `App.vue` if needed

### Customizing Styles

1. Modify Tailwind configuration in `tailwind.config.js`
2. Add custom styles in `src/style.css`
3. Use Tailwind utility classes for component styling

### Testing

The application is designed to work seamlessly with the NestJS backend. Ensure the backend is running before testing frontend functionality.

## Production Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

## License

This project is licensed under the UNLICENSED License. 