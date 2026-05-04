import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", end: true },
  { label: "Users Management", icon: Users, path: "/dashboard/users", end: false },
  { label: "Reports", icon: BarChart3, path: "/dashboard/reports", end: false },
  { label: "Documents", icon: FileText, path: "/dashboard/documents", end: false },
  { label: "Settings", icon: Settings, path: "/dashboard/settings", end: false },
];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: collapsed ? 72 : 256,
        minWidth: collapsed ? 72 : 256,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "var(--background)",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(20,71,230,0.3)",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Roboto" }}>D</span>
        </div>
        <div
          style={{
            overflow: "hidden",
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 200,
            transition: "opacity 0.25s ease, max-width 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 17, fontFamily: "Roboto", margin: 0 }}>
            Dirar
          </p>
          <p style={{ color: "#9ca3af", fontSize: 11, fontFamily: "Open Sans", margin: 0 }}>
            Admin Panel
          </p>
        </div>
      </div>

      {/* <div>
        <image href="/assets/images/logo.jpeg"/>
      </div> */}

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {!collapsed && (
          <p
            style={{
              color: "#9ca3af",
              fontSize: 10,
              fontFamily: "Open Sans",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 12px 4px",
              margin: 0,
            }}
          >
            Main Menu
          </p>
        )}

        {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              margin: "2px 0",
              borderRadius: 10,
              textDecoration: "none",
              background: isActive ? "var(--primary)" : "transparent",
              color: isActive ? "#fff" : "#6b7280",
              transition: "all 0.2s ease",
              justifyContent: collapsed ? "center" : "flex-start",
              boxShadow: isActive ? "0 4px 12px rgba(20,71,230,0.25)" : "none",
              position: "relative",
              overflow: "hidden",
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: "60%",
                      background: "rgba(255,255,255,0.8)",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}
                <Icon size={19} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "Open Sans",
                    whiteSpace: "nowrap",
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : 200,
                    overflow: "hidden",
                    transition: "opacity 0.2s ease, max-width 0.3s ease",
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: Logout only ───────────────────────────────────────── */}
      <div style={{ padding: "8px", borderTop: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 12px",
            borderRadius: 10,
            width: "100%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#9ca3af",
            transition: "all 0.2s ease",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <LogOut size={19} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Open Sans",
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : 200,
              overflow: "hidden",
              transition: "opacity 0.2s ease, max-width 0.3s ease",
            }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
