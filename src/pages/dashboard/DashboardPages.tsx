import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsService, usersService } from '../../services/dataService';
import type { Booking, User } from '../../types';
import {
  TrendingUp,
  Users as UsersIcon,
  Building2,
  Bookmark,
  DollarSign,
  Calendar,
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalAccountants: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const users = await usersService.getAll();
      const allBookings = await bookingsService.getAll();

      const admins = users.filter((u) => u.role === 'admin');
      const accountants = users.filter((u) => u.role === 'accountant');

      setStats({
        totalAdmins: admins.length,
        totalAccountants: accountants.length,
        totalHotels: 5, // Static value for MVP
        totalBookings: allBookings.length,
        totalRevenue: allBookings.reduce((sum, b) => sum + b.total_amount, 0),
      });

      setBookings(allBookings.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          label="Total Admins"
          value={stats.totalAdmins}
          color="bg-blue-500"
        />
        <StatCard
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          label="Total Accountants"
          value={stats.totalAccountants}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Building2 className="w-6 h-6 text-white" />}
          label="Total Hotels"
          value={stats.totalHotels}
          color="bg-green-500"
        />
        <StatCard
          icon={<Bookmark className="w-6 h-6 text-white" />}
          label="Total Bookings"
          value={stats.totalBookings}
          color="bg-orange-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Hotel
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Check-in
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{booking.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{booking.hotel_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(booking.checkin_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                    ${booking.total_amount}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    branchBookings: 0,
    branchAccountants: 0,
    branchRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allBookings = await bookingsService.getAll();
      const allUsers = await usersService.getAll();

      // Filter by branch
      const branchBookings = allBookings.length; // Simplified for MVP
      const branchAccountants = allUsers.filter(
        (u) => u.role === 'accountant' && u.branch === user?.branch
      ).length;
      const branchRevenue = allBookings.reduce((sum, b) => sum + b.total_amount, 0);

      setStats({
        branchBookings,
        branchAccountants,
        branchRevenue,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900">
          Welcome, <strong>{user?.name}</strong> | Branch: <strong>{user?.branch}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Bookmark className="w-6 h-6 text-white" />}
          label="Branch Bookings"
          value={stats.branchBookings}
          color="bg-blue-500"
        />
        <StatCard
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          label="Accountants"
          value={stats.branchAccountants}
          color="bg-purple-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          label="Branch Revenue"
          value={`$${stats.branchRevenue}`}
          color="bg-green-500"
        />
      </div>
    </div>
  );
};

const AccountantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allBookings = await bookingsService.getAll();

      const today = new Date().toISOString().split('T')[0];
      const todayBookings = allBookings.filter((b) => b.booking_date === today).length;
      const pendingBookings = allBookings.filter((b) => b.status === 'pending').length;
      const completedBookings = allBookings.filter((b) => b.status === 'completed').length;

      setStats({
        todayBookings,
        pendingBookings,
        completedBookings,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-900">
          Welcome, <strong>{user?.name}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          label="Today's Bookings"
          value={stats.todayBookings}
          color="bg-blue-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          label="Pending Bookings"
          value={stats.pendingBookings}
          color="bg-orange-500"
        />
        <StatCard
          icon={<Bookmark className="w-6 h-6 text-white" />}
          label="Completed Bookings"
          value={stats.completedBookings}
          color="bg-green-500"
        />
      </div>
    </div>
  );
};

export { SuperAdminDashboard, AdminDashboard, AccountantDashboard };
