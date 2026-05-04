# Hotel Admin Panel - RBAC MVP System

## Overview

A complete Role-Based Access Control (RBAC) Admin Panel System for Hotel/Booking Management built with React, Vite, TypeScript, and Tailwind CSS.

## System Architecture

### Three User Roles

1. **Super Admin**
   - Full system access
   - Dashboard with system-wide statistics
   - User Management (Create/Edit/Delete Admins & Accountants)
   - Services Management (CRUD)
   - Bookings Management
   - Location Management (assign locations to Admins)
   - Statistics & Analytics with charts

2. **Admin**
   - Branch-level management
   - Dashboard with branch-specific data
   - User Management (Create/Edit/Delete Accountants only)
   - Bookings Management
   - Location Management (assign locations to Accountants)
   - Cannot manage Super Admin or view system profit analytics

3. **Accountant**
   - Limited management
   - Dashboard with basic booking statistics
   - Bookings Management (view/create bookings)
   - Cannot view analytics or manage users/services/locations

## Authentication

### Static Login Credentials (MVP)

The system uses static email-based role detection. Default password is `password` for all accounts.

**Demo Accounts:**
- **Super Admin**: `superadmin@gmail.com`
- **Admin**: `admin@gmail.com`
- **Accountant**: `accountant@gmail.com`

Additional test accounts available:
- `admin2@gmail.com` (Admin for Branch B)
- `accountant2@gmail.com` (Accountant for Branch B)

### Login Features
- Responsive login page with demo account selector
- Role-based authentication stored in Context API
- Persistent login using localStorage
- Protected routes based on user role

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx          # Route protection wrapper
├── context/
│   └── AuthContext.tsx             # Auth state management
├── layouts/
│   └── DashboardLayout.tsx         # Main dashboard layout
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx           # Login page
│   ├── dashboard/
│   │   └── DashboardPages.tsx      # Role-specific dashboards
│   ├── UserManagement.tsx
│   ├── ServiceManagement.tsx
│   ├── BookingManagement.tsx
│   ├── LocationManagement.tsx
│   └── Statistics.tsx
├── routes/
│   └── router.tsx                  # Route configuration
├── services/
│   ├── authApi.ts                  # Auth API (existing)
│   ├── axiosInstance.ts            # Axios setup (existing)
│   └── dataService.ts              # Data fetching services
├── types/
│   └── index.ts                    # TypeScript types
├── App.tsx                         # Root component
├── main.tsx                        # Entry point
└── index.css                       # Global styles
```

## Data Storage

All data is stored as static JSON files in `public/data/`:

- `users.json` - User accounts
- `services.json` - Hotel services
- `bookings.json` - Booking records
- `locations.json` - Location assignments

## Features

### Dashboard
- **Super Admin**: Shows total admins, accountants, hotels, bookings, and revenue
- **Admin**: Shows branch bookings, branch accountants, and branch revenue
- **Accountant**: Shows today's bookings, pending bookings, and completed bookings

### User Management
- Create, read, update, delete users
- Role-based filtering (Super Admin sees all, Admin sees only Accountants)
- User status tracking
- Branch and location assignment

### Services Management (Super Admin Only)
- CRUD operations for hotel services
- Price management
- Active/Inactive toggle
- Grid and card view

### Bookings Management
- Full CRUD for bookings
- Booking slip generation (printable)
- Download booking slip as text file
- Status management (Pending, Confirmed, Completed, Cancelled)
- Customer information tracking
- Revenue calculation

### Location Management
- Assign locations to users
- Branch-based filtering
- User role-based assignment rules

### Statistics (Super Admin Only)
- Revenue trend charts
- Booking status distribution (pie chart)
- Top hotels by revenue (bar chart)
- System-wide metrics
- Key performance indicators

### Dynamic Sidebar
- Menu items shown based on user role
- Active route highlighting
- Mobile-responsive with collapsible menu
- User info and logout

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toast Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd dirarDev
npm install
```

### Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Usage Guide

### Login Flow

1. Navigate to the login page
2. Select a demo account or enter credentials
3. Default password: `password`
4. Click "Login"

### Dashboard Features

#### Super Admin Dashboard
- View system-wide statistics
- Access all management modules
- Manage users and services
- View profit analytics

#### Admin Dashboard
- View branch-specific data
- Manage accountants in their branch
- Manage bookings
- Assign locations

#### Accountant Dashboard
- View booking statistics
- Create and manage bookings
- Limited access to system features

### Booking Slip Generation

1. Go to Bookings page
2. Find the booking in the table
3. Click the print icon to generate and print slip
4. Click download icon to save as text file

The slip includes:
- Booking confirmation details
- Customer information
- Hotel and room details
- Check-in/out dates
- Total amount

### Sidebar Navigation

- Click menu items to navigate between pages
- Menu items are role-based (some hidden for certain roles)
- Mobile: Click hamburger menu to open/close
- Active page is highlighted in blue

## Key Components

### AuthContext (`src/context/AuthContext.tsx`)
Manages authentication state and provides:
- `user` - Current authenticated user
- `isAuthenticated` - Boolean flag
- `login(email, password)` - Login function
- `logout()` - Logout function
- `getUserRole()` - Get current user role

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
Wraps routes to:
- Check if user is authenticated
- Verify user role matches required roles
- Redirect unauthorized users

### Data Services (`src/services/dataService.ts`)
Provides functions to:
- Fetch JSON data from public/data/
- Filter data by role, status, branch, etc.
- Get users, services, bookings, locations

### DashboardLayout (`src/layouts/DashboardLayout.tsx`)
Main dashboard wrapper with:
- Responsive sidebar with role-based menu
- Topbar with user info and date
- Mobile hamburger menu
- Logout functionality

## Styling & Responsive Design

- Mobile-first approach
- Fully responsive layout
- Tailwind CSS utility classes
- Consistent color scheme:
  - Primary: Blue (#2563eb)
  - Success: Green (#10b981)
  - Warning: Orange (#f59e0b)
  - Error: Red (#ef4444)

## Future Enhancements

For production deployment, consider:

1. **Backend Integration**
   - Replace static JSON with API endpoints
   - Real database (PostgreSQL, MongoDB, etc.)
   - JWT authentication

2. **Features to Add**
   - Real-time notifications
   - Email notifications
   - PDF generation library (pdfkit)
   - Advanced filtering and search
   - Bulk operations
   - User activity logs
   - Two-factor authentication

3. **Performance**
   - Data caching/pagination
   - Lazy loading of components
   - Image optimization

4. **Security**
   - Rate limiting
   - CSRF protection
   - Input validation
   - Secure password hashing

## Troubleshooting

### Bookings not loading?
- Ensure `public/data/bookings.json` exists
- Check browser console for errors
- Clear localStorage and try again

### Sidebar not showing?
- Check if you're authenticated
- Verify user role is set correctly
- Try logging out and back in

### Charts not displaying?
- Ensure Recharts is installed
- Check console for errors
- Verify data exists in bookings.json

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this project for commercial purposes.

## Support

For issues or questions, refer to the code comments and TypeScript types for detailed information about each component's functionality.
