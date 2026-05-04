import {
  BarChart3,
  BookOpenCheck,
  LayoutDashboard,
  MapPin,
  ShieldUser,
  Wrench,
} from "lucide-react";
import type { Role } from "../types";

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

export const EMAIL_ROLE_MAP: Record<string, Role> = {
  "superadmin@gmail.com": "super_admin",
  "admin@gmail.com": "admin",
  "accountant@gmail.com": "accountant",
};

export const ROLE_MENU: Record<Role, NavItem[]> = {
  super_admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "User Management", path: "/dashboard/users", icon: ShieldUser },
    { label: "Services", path: "/dashboard/services", icon: Wrench },
    { label: "Bookings", path: "/dashboard/bookings", icon: BookOpenCheck },
    { label: "Locations", path: "/dashboard/locations", icon: MapPin },
    { label: "Statistics", path: "/dashboard/statistics", icon: BarChart3 },
  ],
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "User Management", path: "/dashboard/users", icon: ShieldUser },
    { label: "Bookings", path: "/dashboard/bookings", icon: BookOpenCheck },
    { label: "Locations", path: "/dashboard/locations", icon: MapPin },
  ],
  accountant: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Bookings", path: "/dashboard/bookings", icon: BookOpenCheck },
  ],
};
