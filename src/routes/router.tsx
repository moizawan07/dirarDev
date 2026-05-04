import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  SuperAdminDashboard,
  AdminDashboard,
  AccountantDashboard,
} from '../pages/dashboard/DashboardPages';
import UserManagement from '../pages/UserManagement';
import ServiceManagement from '../pages/ServiceManagement';
import BookingManagement from '../pages/BookingManagement';
import LocationManagement from '../pages/LocationManagement';
import Statistics from '../pages/Statistics';
import Login from '../pages/auth/login';

const AppRouter: React.FC = () => {
  const { isAuthenticated, getUserRole } = useAuth();
  const userRole = getUserRole();

  // Dashboard component selection based on role
  const getDashboardComponent = () => {
    switch (userRole) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#fff',
            color: '#111827',
            border: '1px solid rgba(20, 71, 230, 0.15)',
            borderRadius: '12px',
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#89c441',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={getDashboardComponent()} />
        </Route>

        {/* User Management - Super Admin & Admin */}
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserManagement />} />
        </Route>

        {/* Services Management - Super Admin Only */}
        <Route
          path="/services"
          element={
            <ProtectedRoute requiredRoles={['super_admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ServiceManagement />} />
        </Route>

        {/* Bookings Management - All Roles */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookingManagement />} />
        </Route>

        {/* Location Management - Super Admin & Admin */}
        <Route
          path="/locations"
          element={
            <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LocationManagement />} />
        </Route>

        {/* Statistics - Super Admin Only */}
        <Route
          path="/statistics"
          element={
            <ProtectedRoute requiredRoles={['super_admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Statistics />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </>
  );
};

export default AppRouter;
