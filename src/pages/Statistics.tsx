import React, { useEffect, useState } from 'react';
import { bookingsService, usersService, servicesService } from '../services/dataService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  Bookmark,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState({
    totalHotels: 5,
    totalBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);
  const [branchPerformanceData, setBranchPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const bookings = await bookingsService.getAll();
      const users = await usersService.getAll();

      // Calculate basic stats
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, b) => sum + b.total_amount, 0);
      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      setStats({
        totalHotels: 5,
        totalBookings,
        totalRevenue,
        avgBookingValue,
      });

      // Revenue trend data (monthly)
      const monthlyRevenue: Record<string, number> = {};
      bookings.forEach((booking) => {
        const month = new Date(booking.booking_date).toLocaleDateString('en-US', {
          month: 'short',
        });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.total_amount;
      });

      const revenueChartData = Object.entries(monthlyRevenue)
        .map(([month, revenue]) => ({
          month,
          revenue,
        }))
        .slice(-12); // Last 12 months

      setRevenueData(revenueChartData);

      // Booking status breakdown
      const statusCounts = {
        pending: bookings.filter((b) => b.status === 'pending').length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      };

      const statusData = [
        { name: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
        { name: 'Confirmed', value: statusCounts.confirmed, color: '#3b82f6' },
        { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
        { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' },
      ];

      setBookingStatusData(statusData);

      // Branch performance
      const branchRevenue: Record<string, number> = {};
      bookings.forEach((booking) => {
        const branch = booking.hotel_name || 'Unknown';
        branchRevenue[branch] = (branchRevenue[branch] || 0) + booking.total_amount;
      });

      const branchData = Object.entries(branchRevenue)
        .map(([branch, revenue]) => ({
          branch,
          revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setBranchPerformanceData(branchData);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-12">Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistics & Analytics</h1>
        <p className="text-gray-600 mt-1">System-wide performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Building2 className="w-6 h-6 text-white" />}
          label="Total Hotels"
          value={stats.totalHotels}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Bookmark className="w-6 h-6 text-white" />}
          label="Total Bookings"
          value={stats.totalBookings}
          color="bg-purple-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          color="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          label="Avg Booking Value"
          value={`$${stats.avgBookingValue.toFixed(2)}`}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  name="Revenue"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Status Distribution</h3>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Branch Performance */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Hotels by Revenue</h3>
          {branchPerformanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Booking Status Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Status Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {bookingStatusData.map((status) => (
            <div key={status.name} className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">{status.name}</p>
              <p className="text-2xl font-bold mt-2" style={{ color: status.color }}>
                {status.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalBookings > 0
                  ? `${((status.value / stats.totalBookings) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
