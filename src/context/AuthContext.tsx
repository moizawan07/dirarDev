import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  getUserRole: () => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Static user database
const STATIC_USERS = {
  'superadmin@gmail.com': {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    role: 'super_admin' as UserRole,
  },
  'admin@gmail.com': {
    id: '2',
    name: 'Admin',
    email: 'admin@gmail.com',
    role: 'admin' as UserRole,
  },
  'accountant@gmail.com': {
    id: '3',
    name: 'Accountant',
    email: 'accountant@gmail.com',
    role: 'accountant' as UserRole,
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Try to restore from localStorage
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string): boolean => {
    // Static password for all users (MVP)
    if (password !== 'password') {
      return false;
    }

    const foundUser = STATIC_USERS[email as keyof typeof STATIC_USERS];
    if (!foundUser) {
      return false;
    }

    setUser(foundUser);
    localStorage.setItem('auth_user', JSON.stringify(foundUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  const getUserRole = useCallback((): UserRole | null => {
    return user?.role ?? null;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
