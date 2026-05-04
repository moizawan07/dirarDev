import { createContext, useMemo, useState, type ReactNode } from "react";
import usersSeed from "../data/users.json";
import { EMAIL_ROLE_MAP } from "../constants/rbac";
import type { AuthUser, Role, UserRecord } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AUTH_KEY = "hotel_auth_user";
const TOKEN_KEY = "hotel_auth_token";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const users = usersSeed as UserRecord[];

const readStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser());

  const login = (email: string) => {
    const normalized = email.trim().toLowerCase();
    const role = EMAIL_ROLE_MAP[normalized];

    if (!role) {
      return false;
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === normalized);
    const authUser: AuthUser = matchedUser ?? {
      id: Date.now(),
      name: role.replace("_", " ").toUpperCase(),
      email: normalized,
      role,
      branch: role === "super_admin" ? "Head Office" : "Dubai Marina",
      location: role === "super_admin" ? "Dubai Downtown" : "Marina Tower",
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    localStorage.setItem(TOKEN_KEY, "static-token");
    setUser(authUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole: (roles: Role[]) => Boolean(user && roles.includes(user.role)),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

