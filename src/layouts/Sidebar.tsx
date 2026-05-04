import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Bookmark,
  MapPin,
  BarChart3,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
}

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["super_admin", "admin", "accountant"],
  },
  {
    label: "User Management",
    icon: Users,
    path: "/users",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Services",
    icon: Package,
    path: "/services",
    roles: ["super_admin"],
  },
  {
    label: "Bookings",
    icon: Bookmark,
    path: "/bookings",
    roles: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Locations",
    icon: MapPin,
    path: "/locations",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Statistics",
    icon: BarChart3,
    path: "/statistics",
    roles: ["super_admin"],
  },
];

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();

  const userRole = getUserRole();

  const visibleItems = SIDEBAR_ITEMS.filter((item) =>
    item.roles.includes(userRole || "")
  );

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
        background: "white",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
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
          }}
        >
          <span style={{ color: "#fff", fontWeight: 800 }}>D</span>
        </div>

        {!collapsed && (
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>Dirar</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
              Admin Panel
            </p>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {visibleItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              margin: "4px 0",
              borderRadius: 10,
              textDecoration: "none",
              background: isActive ? "var(--primary)" : "transparent",
              color: isActive ? "#fff" : "#6b7280",
              justifyContent: collapsed ? "center" : "flex-start",
            })}
          >
            <Icon size={19} />

            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: "8px",
          borderTop: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 12px",
            width: "100%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogOut size={19} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;