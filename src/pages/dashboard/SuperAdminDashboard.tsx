import React, { useEffect, useState } from 'react';
import { bookingsService, usersService } from '../../services/dataService';
import type { Booking } from '../../types';
import {
  Users as UsersIcon,
  Bookmark,
  DollarSign,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  AlertCircle,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const colorMap = {
  blue: {
    icon: 'bg-blue-50 text-primary',
    badge: 'bg-blue-50 text-primary',
    border: 'border-blue-100',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    badge: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
  },
  emerald: {
    icon: 'bg-green-50 text-secondary',
    badge: 'bg-green-50 text-secondary',
    border: 'border-green-100',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
  },
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: keyof typeof colorMap;
  badge?: string;
}> = ({ icon, label, value, color, badge }) => {
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-2xl  p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="font-heading text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {badge && (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${c.badge}`}>
          <ArrowUpRight size={11} />
          {badge}
        </span>
      )}
    </div>
  );
};

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { bar: string; dot: string; icon: React.ReactNode; badge: string }> = {
  confirmed:   { bar: 'bg-primary',      dot: 'bg-primary',      icon: <CheckCircle2 size={13} className="text-primary" />,      badge: 'bg-blue-50 text-primary' },
  checked_in:  { bar: 'bg-purple-500',   dot: 'bg-purple-500',   icon: <LogIn size={13} className="text-purple-500" />,          badge: 'bg-purple-50 text-purple-600' },
  pending:     { bar: 'bg-amber-400',    dot: 'bg-amber-400',    icon: <AlertCircle size={13} className="text-amber-500" />,     badge: 'bg-amber-50 text-amber-600' },
  checked_out: { bar: 'bg-gray-300',     dot: 'bg-gray-400',     icon: <LogOut size={13} className="text-gray-400" />,           badge: 'bg-gray-100 text-gray-500' },
  cancelled:   { bar: 'bg-red-400',      dot: 'bg-red-400',      icon: <XCircle size={13} className="text-red-400" />,           badge: 'bg-red-50 text-red-500' },
  completed:   { bar: 'bg-secondary',    dot: 'bg-secondary',    icon: <CheckCircle2 size={13} className="text-secondary" />,    badge: 'bg-green-50 text-secondary' },
};

const badgeClass: Record<string, string> = {
  confirmed:   'bg-blue-50 text-primary',
  checked_in:  'bg-purple-50 text-purple-600',
  pending:     'bg-amber-50 text-amber-600',
  checked_out: 'bg-gray-100 text-gray-500',
  cancelled:   'bg-red-50 text-red-500',
  completed:   'bg-green-50 text-secondary',
};

// ─── Status Breakdown ─────────────────────────────────────────────────────────
const StatusBreakdown: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const total = bookings.length || 1;
  const counts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const order = ['confirmed', 'checked_in', 'pending', 'completed', 'checked_out', 'cancelled'];
  const rows = order.filter(s => counts[s]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm font-bold text-gray-800 tracking-tight">Booking Status</h3>
        <BarChart3 size={16} className="text-gray-300" />
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(status => {
          const cfg = statusConfig[status] || { bar: 'bg-gray-200', icon: null };
          const pct = Math.round((counts[status] / total) * 100);
          return (
            <div key={status} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-28 shrink-0">
                {cfg.icon}
                <span className="text-xs text-gray-500 capitalize">{status.replace('_', ' ')}</span>
              </div>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="font-heading text-sm font-bold text-gray-700 w-4 text-right">{counts[status]}</span>
            </div>
          );
        })}
        {rows.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No bookings yet</p>
        )}
      </div>
    </div>
  );
};

// ─── Activity Feed ────────────────────────────────────────────────────────────
const recentActivities = [
  { text: 'New booking <b>B008</b> created for Sana Butt', time: '2 hours ago', dot: 'bg-secondary' },
  { text: 'Booking <b>B002</b> status changed to Checked In', time: '5 hours ago', dot: 'bg-primary' },
  { text: 'New accountant <b>Ayesha Noor</b> added to Branch A', time: 'Yesterday', dot: 'bg-amber-400' },
  { text: 'Booking <b>B005</b> cancelled by Kamran Mirza', time: 'Yesterday', dot: 'bg-red-400' },
];

const ActivityFeed: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-heading text-sm font-bold text-gray-800 tracking-tight">Recent Activity</h3>
      <Activity size={16} className="text-gray-300" />
    </div>
    <div className="flex flex-col">
      {recentActivities.map((a, i) => (
        <div key={i} className={`flex gap-3 py-3 ${i < recentActivities.length - 1 ? 'border-b border-gray-50' : ''}`}>
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
          <div>
            <p
              className="text-xs text-gray-600 leading-relaxed [&_b]:text-gray-800 [&_b]:font-semibold"
              dangerouslySetInnerHTML={{ __html: a.text }}
            />
            <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Recent Bookings Table ────────────────────────────────────────────────────
const RecentBookingsTable: React.FC<{ bookings: Booking[] }> = ({ bookings }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-heading text-sm font-bold text-gray-800 tracking-tight">Recent Bookings</h3>
      <a className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-blue-700 cursor-pointer transition-colors">
        View all <ChevronRight size={13} />
      </a>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {['ID', 'Customer', 'Hotel', 'Check-in', 'Amount', 'Status'].map(h => (
              <th key={h} className="text-left pb-3 px-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 first:pl-0 last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className={`hover:bg-gray-50/70 transition-colors ${i < bookings.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <td className="py-3 px-2 pl-0">
                <span className="font-heading text-xs font-bold text-primary">{b.id}</span>
              </td>
              <td className="py-3 px-2 text-sm font-medium text-gray-800">{b.customer_name}</td>
              <td className="py-3 px-2 text-sm text-gray-500 max-w-[120px] truncate">{b.hotel_name}</td>
              <td className="py-3 px-2 text-sm text-gray-500">
                {new Date(b.checkin_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </td>
              <td className="py-3 px-2">
                <span className="font-heading text-sm font-bold text-gray-800">
                  Rs {b.total_amount.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-2 pr-0">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${badgeClass[b.status] || 'bg-gray-100 text-gray-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[b.status]?.dot || 'bg-gray-400'}`} />
                  {b.status.replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-sm text-gray-400">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── SUPER ADMIN DASHBOARD ────────────────────────────────────────────────────
const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalAccountants: 0,
    activeBookings: 0,
    weekRevenue: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const users = await usersService.getAll();
      const allBookings = await bookingsService.getAll();

      const admins = users.filter(u => u.role === 'admin');
      const accountants = users.filter(u => u.role === 'accountant');
      const activeBookings = allBookings.filter(b =>
        ['confirmed', 'checked_in', 'pending'].includes(b.status)
      );
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekRevenue = allBookings
        .filter(b => new Date(b.booking_date) >= weekAgo)
        .reduce((s, b) => s + b.total_amount, 0);

      setStats({
        totalAdmins: admins.length,
        totalAccountants: accountants.length,
        activeBookings: activeBookings.length,
        weekRevenue,
      });
      setBookings(allBookings.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm gap-2">
        <Activity size={16} className="opacity-50 animate-pulse" />
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<UsersIcon size={18} />}
          label="Total Admins"
          value={stats.totalAdmins}
          color="blue"
          badge="2 active"
        />
        <StatCard
          icon={<UsersIcon size={18} />}
          label="Total Accountants"
          value={stats.totalAccountants}
          color="purple"
          badge="All active"
        />
        <StatCard
          icon={<Bookmark size={18} />}
          label="Active Bookings"
          value={stats.activeBookings}
          color="amber"
          badge={`${stats.activeBookings} confirmed`}
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="This Week Revenue"
          value={`Rs ${(stats.weekRevenue / 1000).toFixed(0)}K`}
          color="emerald"
          badge="8% vs last week"
        />
      </div>

      {/* ── Main Grid: table | right panels ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-4">

        {/* Left: Bookings Table */}
        <RecentBookingsTable bookings={bookings} />

        {/* Right: Status + Activity stacked */}
        <div className="flex flex-col gap-4">
          <StatusBreakdown bookings={bookings} />
          <ActivityFeed />
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
export { SuperAdminDashboard };