import axios from "axios";

// ─── Base URL ────────────────────────────────────────────────────────────────
// When your real API is ready, just update this one value.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attaches the Bearer token (if present) to every request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Handles 401 Unauthorized globally – clears storage and redirects to /login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
