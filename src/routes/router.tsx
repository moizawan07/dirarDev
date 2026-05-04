import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import type { Role } from "../types";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardHome from "../pages/dashboard/DashboardHome";
import UsersPage from "../pages/dashboard/UsersPage";
import ServicesPage from "../pages/dashboard/ServicesPage";
import BookingsPage from "../pages/dashboard/BookingsPage";
import LocationsPage from "../pages/dashboard/LocationsPage";
import StatisticsPage from "../pages/dashboard/StatisticsPage";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Role[];
}) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRouter = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <GuestRoute><Login /></GuestRoute> },
    { path: "/forgot-password", element: <GuestRoute><ForgotPassword /></GuestRoute> },
    { path: "/reset-password", element: <GuestRoute><ResetPassword /></GuestRoute> },
    {
      path: "/dashboard",
      element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
      children: [
        { index: true, element: <DashboardHome /> },
        { path: "users", element: <ProtectedRoute allowedRoles={["super_admin", "admin"]}><UsersPage /></ProtectedRoute> },
        { path: "services", element: <ProtectedRoute allowedRoles={["super_admin"]}><ServicesPage /></ProtectedRoute> },
        { path: "bookings", element: <BookingsPage /> },
        { path: "locations", element: <ProtectedRoute allowedRoles={["super_admin", "admin"]}><LocationsPage /></ProtectedRoute> },
        { path: "statistics", element: <ProtectedRoute allowedRoles={["super_admin"]}><StatisticsPage /></ProtectedRoute> },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
