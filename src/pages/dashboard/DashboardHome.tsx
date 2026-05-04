import { BookOpenCheck, DollarSign, Hotel, Users } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const DashboardHome = () => {
  const { user } = useAuth();
  const { users, bookings } = useData();

  const roleStats = useMemo(() => {
    if (!user) return [];
    const branchBookings = bookings.filter((b) => b.branch === user.branch);
    const branchRevenue = branchBookings.reduce((sum, b) => sum + b.total_amount, 0);

    if (user.role === "super_admin") {
      return [
        { label: "Total Admins", value: users.filter((u) => u.role === "admin").length, icon: Users },
        { label: "Total Accountants", value: users.filter((u) => u.role === "accountant").length, icon: Users },
        { label: "Total Hotels", value: new Set(bookings.map((b) => b.hotel_name)).size, icon: Hotel },
        { label: "Total Bookings", value: bookings.length, icon: BookOpenCheck },
        { label: "Total Revenue", value: `$${bookings.reduce((s, b) => s + b.total_amount, 0).toLocaleString()}`, icon: DollarSign },
      ];
    }

    if (user.role === "admin") {
      return [
        { label: "Branch Bookings", value: branchBookings.length, icon: BookOpenCheck },
        { label: "Branch Accountants", value: users.filter((u) => u.role === "accountant" && u.branch === user.branch).length, icon: Users },
        { label: "Branch Revenue", value: `$${branchRevenue.toLocaleString()}`, icon: DollarSign },
      ];
    }

    const today = new Date().toISOString().slice(0, 10);
    const ownBookings = bookings.filter((b) => b.created_by_user_id === user.id);
    return [
      { label: "Today Bookings", value: ownBookings.filter((b) => b.booking_date === today).length, icon: BookOpenCheck },
      { label: "Pending Bookings", value: ownBookings.filter((b) => b.status === "pending").length, icon: BookOpenCheck },
      { label: "Completed Bookings", value: ownBookings.filter((b) => b.status === "completed").length, icon: BookOpenCheck },
    ];
  }, [bookings, user, users]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
      {roleStats.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{card.label}</p>
              <Icon size={18} color="var(--primary)" />
            </div>
            <h3 style={{ margin: "12px 0 0", fontSize: 28 }}>{card.value}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardHome;
