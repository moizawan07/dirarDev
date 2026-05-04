import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: "var(--primary)" }}
      >
        <LayoutDashboard className="text-white" size={30} />
      </div>

      <h1 className="font-heading text-3xl font-bold" style={{ color: "var(--foreground)" }}>
        Dashboard
      </h1>

      <p className="text-sm" style={{ color: "#6b7280" }}>
        Welcome back,{" "}
        <span className="font-semibold" style={{ color: "var(--primary)" }}>
          {user?.name || user?.email || "User"}
        </span>
        ! 🎉
      </p>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all duration-200 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--primary))",
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;