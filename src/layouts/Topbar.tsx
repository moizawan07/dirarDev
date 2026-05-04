import {
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  pageTitle: string;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const Topbar = ({
  pageTitle,
  collapsed,
  onToggleSidebar,
}: TopbarProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      style={{
        height: 72,
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleSidebar}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          border: "1.5px solid rgba(0,0,0,0.09)",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#6b7280",
          transition: "all 0.2s ease",
        }}
      >
        {collapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </button>

      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "Roboto",
            fontSize: 19,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {pageTitle}
        </h1>

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            margin: 0,
          }}
        >
          {new Date().toLocaleDateString()}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: searchFocused ? "#fff" : "#f8fafc",
          border: `1.5px solid ${
            searchFocused ? "var(--primary)" : "rgba(0,0,0,0.08)"
          }`,
          borderRadius: 12,
          padding: "8px 14px",
          width: searchFocused ? 260 : 200,
        }}
      >
        <Search size={15} />

        <input
          type="text"
          placeholder="Search..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
          }}
        />

        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowNotif(!showNotif)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1.5px solid rgba(0,0,0,0.08)",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <Bell size={18} />

          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--secondary)",
            }}
          />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 12px 6px 6px",
          borderRadius: 12,
          border: "1.5px solid rgba(0,0,0,0.08)",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {initials}
        </div>

        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {user?.name || "Admin"}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
            {user?.role || "Administrator"}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;