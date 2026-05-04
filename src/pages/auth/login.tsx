import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { loginApi } from "../../services/authApi";

// ─── Dummy credentials (remove once real API is ready) ───────────────────────
const DUMMY_EMAIL = "admin@gmail.com";
const DUMMY_PASSWORD = "123456";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    // ── Dummy login check ─────────────────────────────────────────────────
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      localStorage.setItem("token", "dummy-token-123");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Admin", email: DUMMY_EMAIL, role: "admin" })
      );
      toast.success("Welcome back, Admin! 👋");
      navigate("/dashboard");
      return;
    }

    // ── Real API call (activate when backend is ready) ────────────────────
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message || "Logged in successfully!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 blur-3xl"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/2 translate-y-1/2 blur-3xl"
        style={{ background: "var(--secondary)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl border"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderColor: "rgba(20, 71, 230, 0.12)",
          }}
        >
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: "var(--primary)" }}
            >
              <LogIn className="text-white" size={26} />
            </div>
            <h1
              className="font-heading text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 font-body focus:ring-2"
                  style={{
                    borderColor: "rgba(20, 71, 230, 0.2)",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(20, 71, 230, 0.2)")
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all duration-200 font-body"
                  style={{
                    borderColor: "rgba(20, 71, 230, 0.2)",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(20, 71, 230, 0.2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "#9ca3af" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: "var(--primary)" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70"
              style={{
                background: loading
                  ? "#93a5f5"
                  : "linear-gradient(135deg, var(--primary))",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>
                  <LogIn size={17} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs mt-6" style={{ color: "#9ca3af" }}>
            Demo: <span className="font-semibold">admin@gmail.com</span> /{" "}
            <span className="font-semibold">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;