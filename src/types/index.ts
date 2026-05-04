// Role types
export type UserRole = 'super_admin' | 'admin' | 'accountant';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  location?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

// Auth type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
   branch?: string;
}

// Service type
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt?: string;
}

// Booking type
export interface Booking {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  hotel_name: string;
  room_type: string;
  booking_date: string;
  checkin_date: string;
  checkout_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_by?: string;
  createdAt?: string;
}

// Location type
export interface Location {
  id: string;
  user: string;
  assigned_location: string;
  branch: string;
  createdAt?: string;
}

// Dashboard stats type
export interface DashboardStats {
  total_admins?: number;
  total_accountants?: number;
  total_hotels?: number;
  total_bookings?: number;
  total_revenue?: number;
  branch_bookings?: number;
  branch_revenue?: number;
  today_bookings?: number;
  pending_bookings?: number;
  completed_bookings?: number;
}
