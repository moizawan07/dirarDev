import { useMemo } from "react";
import { BarChart, Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData } from "../../context/DataContext";

const StatisticsPage = () => {
  const { bookings } = useData();

  const totals = useMemo(() => {
    const hotels = new Set(bookings.map((b) => b.hotel_name)).size;
    const revenue = bookings.reduce((sum, b) => sum + b.total_amount, 0);
    const statusMap = bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    }, {});

    const trend = Object.entries(
      bookings.reduce<Record<string, number>>((acc, b) => {
        acc[b.booking_date] = (acc[b.booking_date] ?? 0) + b.total_amount;
        return acc;
      }, {}),
    ).map(([date, amount]) => ({ date, amount }));

    const branchPerformance = Object.entries(
      bookings.reduce<Record<string, number>>((acc, b) => {
        acc[b.branch] = (acc[b.branch] ?? 0) + b.total_amount;
        return acc;
      }, {}),
    ).map(([branch, revenueByBranch]) => ({ branch, revenue: revenueByBranch }));

    return { hotels, revenue, statusMap, trend, branchPerformance };
  }, [bookings]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>Total Hotels: {totals.hotels}</div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>Total Bookings: {bookings.length}</div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>Total Revenue: ${totals.revenue}</div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
          Status: P {totals.statusMap.pending ?? 0} / C {totals.statusMap.completed ?? 0} / X {totals.statusMap.cancelled ?? 0}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, height: 320 }}>
        <h3>Revenue Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={totals.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#0B73B7" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, height: 320 }}>
        <h3>Branch Performance</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={totals.branchPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#89c441" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsPage;
