import { Bell, Search, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  pageTitle: string;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const Topbar = ({ pageTitle, collapsed, onToggleSidebar }: TopbarProps) => {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      style={{
        height: 72,
        background: "var(--background)",
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
      {/* ── Sidebar Toggle (left) ─────────────────────────────────────── */}
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
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
          e.currentTarget.style.color = "var(--primary)";
          e.currentTarget.style.background = "rgba(20,71,230,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
          e.currentTarget.style.color = "#6b7280";
          e.currentTarget.style.background = "#f8fafc";
        }}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      {/* ── Page Title ───────────────────────────────────────────────── */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "Roboto",
            fontSize: 19,
            fontWeight: 700,
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          {pageTitle}
        </h1>
        <p style={{ fontFamily: "Open Sans", fontSize: 12, color: "#9ca3af", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* ── Search ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: searchFocused ? "#fff" : "#f8fafc",
          border: `1.5px solid ${searchFocused ? "var(--primary)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 12,
          padding: "8px 14px",
          transition: "all 0.2s ease",
          width: searchFocused ? 260 : 200,
        }}
      >
        <Search size={15} style={{ color: searchFocused ? "var(--primary)" : "#9ca3af", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            fontFamily: "Open Sans",
            color: "var(--foreground)",
            width: "100%",
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#9ca3af" }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Notifications ────────────────────────────────────────────── */}
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
            color: "#6b7280",
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
            e.currentTarget.style.color = "#6b7280";
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
              border: "2px solid var(--background)",
            }}
          />
        </button>

        {showNotif && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 300,
              background: "var(--background)",
              borderRadius: 16,
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: 16,
              zIndex: 100,
            }}
          >
            <p style={{ fontFamily: "Roboto", fontWeight: 600, fontSize: 14, margin: "0 0 12px", color: "var(--foreground)" }}>
              Notifications
            </p>
            {[
              { title: "New user registered", time: "2 min ago", color: "var(--primary)" },
              { title: "Report generated", time: "1 hr ago", color: "var(--secondary)" },
              { title: "System update available", time: "3 hrs ago", color: "#f59e0b" },
            ].map((n, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p style={{ fontFamily: "Open Sans", fontSize: 13, margin: 0, color: "var(--foreground)" }}>{n.title}</p>
                  <p style={{ fontFamily: "Open Sans", fontSize: 11, margin: 0, color: "#9ca3af" }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── User Avatar ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 12px 6px 6px",
          borderRadius: 12,
          border: "1.5px solid rgba(0,0,0,0.08)",
          background: "#f8fafc",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")}
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
            fontSize: 13,
            fontFamily: "Roboto",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <p style={{ fontFamily: "Roboto", fontSize: 13, fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
            {user?.name || "Admin"}
          </p>
          <p style={{ fontFamily: "Open Sans", fontSize: 11, margin: 0, color: "#9ca3af" }}>
            {(user?.role || "administrator").replace("_", " ")}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
