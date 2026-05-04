import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import UsersPage from "../pages/dashboard/UsersPage";

// ─── Auth Guard ───────────────────────────────────────────────────────────────
// Protects routes that require authentication.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── Guest Guard ──────────────────────────────────────────────────────────────
// Redirects already-authenticated users away from auth pages.
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <ResetPassword />
      </GuestRoute>
    ),
  },
  {
    // DashboardLayout renders <Outlet /> — React Router injects the matched
    // child route into that slot automatically. Do NOT pass children as JSX.
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "users", element: <UsersPage /> },
      // Add more pages here as you build them:
      // { path: "reports",   element: <ReportsPage />   },
      // { path: "documents", element: <DocumentsPage /> },
      // { path: "settings",  element: <SettingsPage />  },
    ],
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#fff",
            color: "#111827",
            border: "1px solid rgba(20, 71, 230, 0.15)",
            borderRadius: "12px",
            fontFamily: "'Open Sans', sans-serif",
            fontSize: "14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#89c441",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
