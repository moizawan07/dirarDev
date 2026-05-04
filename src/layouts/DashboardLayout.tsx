import React, { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Users Management",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/documents": "Documents",
  "/dashboard/settings": "Settings",
};

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f9fafb",
      }}
    >
      <Sidebar collapsed={collapsed} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar
          pageTitle={pageTitle}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            marginTop: 2,
            padding: 24,
            background: "var(--background)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;