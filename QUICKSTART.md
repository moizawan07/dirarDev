# Admin Panel Quick Start Guide

## Installation & Running

### 1. Ensure dependencies are installed
```bash
npm install
```

### 2. Start Development Server

**Option A: Using CMD (Recommended on Windows)**
```cmd
npm run dev
```

**Option B: Bypass PowerShell Execution Policy**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm run dev
```

**Option C: Using Node.js Command**
```bash
node node_modules/.bin/vite
```

### 3. Access the Application
Open your browser and go to `http://localhost:5173`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@gmail.com | password |
| Admin | admin@gmail.com | password |
| Accountant | accountant@gmail.com | password |

## What's Included

### ✅ Complete RBAC System
- 3 user roles with different permissions
- Role-based menu visibility
- Protected routes
- Session persistence

### ✅ Authentication
- Static email-based login
- localStorage session management
- Beautiful login page with demo account selector

### ✅ 6 Main Modules

1. **Dashboard** (Role-based views)
   - Super Admin: System-wide stats
   - Admin: Branch stats
   - Accountant: Basic stats

2. **User Management**
   - Create, Edit, Delete users
   - Role-based filtering
   - Branch assignment

3. **Services Management** (Super Admin only)
   - CRUD for hotel services
   - Status toggle
   - Price management

4. **Bookings Management**
   - Full CRUD
   - Generate printable booking slips
   - Download slip as text file
   - Status management

5. **Location Management**
   - Assign locations to users
   - Role-based assignment rules
   - Branch filtering

6. **Statistics** (Super Admin only)
   - Revenue trends (Line chart)
   - Booking status distribution (Pie chart)
   - Top hotels by revenue (Bar chart)
   - Key metrics

### ✅ UI Features
- Responsive design (Mobile, Tablet, Desktop)
- Dynamic sidebar with role-based menu
- Active route highlighting
- User info in topbar
- Mobile hamburger menu
- Clean, modern design with Tailwind CSS
- Toast notifications

## File Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── layouts/
│   └── DashboardLayout.tsx
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── dashboard/
│   │   └── DashboardPages.tsx
│   ├── UserManagement.tsx
│   ├── ServiceManagement.tsx
│   ├── BookingManagement.tsx
│   ├── LocationManagement.tsx
│   └── Statistics.tsx
├── routes/
│   └── router.tsx
├── services/
│   └── dataService.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx

public/data/
├── users.json
├── services.json
├── bookings.json
└── locations.json
```

## Key Features Explained

### Authentication
- No backend required (MVP)
- Static credentials
- Role-based on email
- Session stored in localStorage

### Protected Routes
Routes automatically redirect unauthorized users:
- Unauthenticated → Login
- Wrong role → Dashboard

### Dynamic Sidebar
Sidebar menu changes based on user role:
- **Super Admin**: All menu items visible
- **Admin**: No Services or Statistics
- **Accountant**: Only Dashboard and Bookings

### Booking Slip Generation
1. Go to Bookings page
2. Click print icon to generate printable slip
3. Click download icon to save as text file

### Statistics & Charts
- Revenue trend over time
- Booking status breakdown
- Top hotels by revenue
- Responsive charts with Recharts

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router v7** - Routing
- **Context API** - State management
- **Recharts** - Charts
- **Lucide React** - Icons
- **Vite** - Build tool

## Next Steps for Production

1. **Backend Integration**
   - Replace JSON files with API calls
   - Implement proper authentication (JWT)
   - Add database (PostgreSQL, MongoDB)

2. **Enhanced Features**
   - Real-time notifications
   - Email notifications
   - Advanced PDF generation
   - User activity logs
   - Two-factor authentication

3. **Security**
   - Rate limiting
   - Input validation
   - CSRF protection
   - Secure password hashing

4. **Performance**
   - Data pagination
   - Lazy loading
   - Caching strategy
   - Image optimization

## Troubleshooting

### Dev Server Won't Start
- Try using cmd.exe instead of PowerShell
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Login Not Working
- Check browser console for errors
- Ensure email matches exactly (case-sensitive)
- Password is "password" for all accounts
- Try clearing localStorage and refreshing

### Charts Not Showing
- Ensure bookings.json has data
- Check browser console for errors
- Verify Recharts is installed

### Sidebar Not Visible
- Verify you're logged in
- Check if user role is set correctly
- Try logging out and back in

## Support & Documentation

Full documentation available in:
- `SYSTEM_DOCUMENTATION.md` - Complete system guide
- Code comments - Inline documentation
- TypeScript types - Self-documenting code

## License

MIT - Free to use for commercial purposes
