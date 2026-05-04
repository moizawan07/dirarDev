import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "User Management",
  "/dashboard/services": "Services",
  "/dashboard/bookings": "Bookings",
  "/dashboard/locations": "Locations",
  "/dashboard/statistics": "Statistics",
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Topbar
          pageTitle={pageTitle}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <main style={{ flex: 1, padding: "22px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
