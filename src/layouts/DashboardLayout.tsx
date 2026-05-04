import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Bookmark,
  MapPin,
  BarChart3,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['super_admin', 'admin', 'accountant'],
  },
  {
    label: 'User Management',
    path: '/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Services',
    path: '/services',
    icon: <Package className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    label: 'Bookings',
    path: '/bookings',
    icon: <Bookmark className="w-5 h-5" />,
    roles: ['super_admin', 'admin', 'accountant'],
  },
  {
    label: 'Locations',
    path: '/locations',
    icon: <MapPin className="w-5 h-5" />,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Statistics',
    path: '/statistics',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['super_admin'],
  },
];

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter sidebar items based on user role
  const visibleItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(userRole || ''));

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 md:w-64'
        } transition-all duration-300 bg-gray-900 text-white flex flex-col fixed md:relative h-full z-40`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Hotel Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-800 p-4 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Logged In As</p>
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <p className="text-xs text-blue-400 mt-1 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 md:flex-none">
            <h2 className="text-xl font-bold text-gray-900">
              {SIDEBAR_ITEMS.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
