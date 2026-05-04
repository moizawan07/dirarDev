import axiosInstance from "./axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message: string;
}

// ─── Auth API functions ───────────────────────────────────────────────────────
// All auth-related endpoints live here.
// When the real backend is ready, update BASE_URL in axiosInstance.ts only.

export const loginApi = (payload: LoginPayload) =>
  axiosInstance.post<AuthResponse>("/auth/login", payload);

export const forgotPasswordApi = (payload: ForgotPasswordPayload) =>
  axiosInstance.post<{ message: string }>("/auth/forgot-password", payload);

export const resetPasswordApi = (payload: ResetPasswordPayload) =>
  axiosInstance.post<{ message: string }>("/auth/reset-password", payload);

export const logoutApi = () =>
  axiosInstance.post<{ message: string }>("/auth/logout");
