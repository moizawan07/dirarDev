import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Users Management",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/documents": "Documents",
  "/dashboard/settings": "Settings",
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
        overflow: "hidden",
      }}
    >
      {/* Sidebar — only receives collapsed; toggle lives in Topbar */}
      <Sidebar collapsed={collapsed} />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Topbar
          pageTitle={pageTitle}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        {/* Dynamic content — Outlet renders the active child route */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
