import { Users, TrendingUp, FileText, BarChart3, ArrowUpRight, Activity } from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "4,281",
    change: "+12.5%",
    positive: true,
    icon: Users,
    color: "var(--primary)",
    bg: "rgba(20,71,230,0.08)",
  },
  {
    label: "Revenue",
    value: "$28,450",
    change: "+8.2%",
    positive: true,
    icon: TrendingUp,
    color: "var(--secondary)",
    bg: "rgba(137,196,65,0.1)",
  },
  {
    label: "Documents",
    value: "1,034",
    change: "+3.1%",
    positive: true,
    icon: FileText,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    label: "Reports",
    value: "318",
    change: "-2.4%",
    positive: false,
    icon: BarChart3,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
];

const recentActivity = [
  { user: "Ahmed Ali",    action: "Created a new document",  time: "2 min ago",  avatar: "AA" },
  { user: "Sara Hassan",  action: "Updated user profile",    time: "15 min ago", avatar: "SH" },
  { user: "Omar Khalid",  action: "Generated a report",      time: "1 hr ago",   avatar: "OK" },
  { user: "Lina Nasser",  action: "Uploaded 3 files",        time: "3 hrs ago",  avatar: "LN" },
  { user: "Karim Yousuf", action: "Deactivated an account",  time: "5 hrs ago",  avatar: "KY" },
];

const DashboardHome = () => {
  return (
    <div>
      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {stats.map(({ label, value, change, positive, icon: Icon, color, bg }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "22px 20px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={21} style={{ color }} />
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "Open Sans",
                  color: positive ? "var(--secondary)" : "#ef4444",
                  background: positive ? "rgba(137,196,65,0.1)" : "rgba(239,68,68,0.1)",
                  padding: "4px 9px",
                  borderRadius: 20,
                }}
              >
                <ArrowUpRight
                  size={13}
                  style={{ transform: positive ? "none" : "rotate(180deg)" }}
                />
                {change}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Roboto",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "Open Sans",
                  fontSize: 13,
                  color: "#9ca3af",
                  margin: "2px 0 0",
                }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom section ──────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent Activity */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Activity size={18} style={{ color: "var(--primary)" }} />
            <h2
              style={{
                fontFamily: "Roboto",
                fontSize: 16,
                fontWeight: 700,
                margin: 0,
                color: "var(--foreground)",
              }}
            >
              Recent Activity
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    fontFamily: "Roboto",
                    flexShrink: 0,
                  }}
                >
                  {item.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Roboto", fontSize: 13, fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
                    {item.user}
                  </p>
                  <p style={{ fontFamily: "Open Sans", fontSize: 12, margin: 0, color: "#9ca3af" }}>
                    {item.action}
                  </p>
                </div>
                <span style={{ fontFamily: "Open Sans", fontSize: 11, color: "#cbd5e1" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 8px 30px rgba(20,71,230,0.3)",
          }}
        >
          <h2 style={{ fontFamily: "Roboto", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>
            System Overview
          </h2>
          <p style={{ fontFamily: "Open Sans", fontSize: 12, margin: "0 0 24px", opacity: 0.7 }}>
            Current platform health
          </p>

          {[
            { label: "Server Uptime",  value: "99.9%", bar: 99 },
            { label: "Storage Used",   value: "64%",   bar: 64 },
            { label: "Active Sessions",value: "82%",   bar: 82 },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Open Sans", fontSize: 12, opacity: 0.8 }}>{item.label}</span>
                <span style={{ fontFamily: "Roboto", fontSize: 12, fontWeight: 700 }}>{item.value}</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.bar}%`,
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
