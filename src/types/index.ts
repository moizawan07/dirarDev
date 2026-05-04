export type Role = "super_admin" | "admin" | "accountant";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  branch: string;
  location: string;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: Role;
  branch: string;
  location: string;
}

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  price: number;
  status: "active" | "inactive";
}

export interface BookingRecord {
  id: number;
  customer_name: string;
  hotel_name: string;
  room_type: string;
  booking_date: string;
  checkin_date: string;
  checkout_date: string;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  branch: string;
  location: string;
  created_by_user_id: number;
}

export interface LocationRecord {
  id: number;
  user_id: number;
  assigned_location: string;
  branch: string;
}
