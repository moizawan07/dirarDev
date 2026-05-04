import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../services/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "dummy-token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // ── Dummy flow (remove when API is ready) ─────────────────────────────
    if (token === "dummy-token") {
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
      return;
    }

    // ── Real API call ─────────────────────────────────────────────────────
    setLoading(true);
    try {
      const { data } = await resetPasswordApi({ token, password, confirmPassword });
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to reset password. Please try again.";
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
        <div
          className="rounded-2xl p-8 shadow-2xl border"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderColor: "rgba(20, 71, 230, 0.12)",
          }}
        >
          {/* Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: "var(--primary)" }}
            >
              <KeyRound className="text-white" size={26} />
            </div>
            <h1
              className="font-heading text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Reset Password
            </h1>
            <p
              className="text-sm mt-1 text-center max-w-xs"
              style={{ color: "#6b7280" }}
            >
              Choose a strong new password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  id="new-password"
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
                    (e.currentTarget.style.borderColor = "rgba(20, 71, 230, 0.2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--primary)" }}
                />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all duration-200 font-body"
                  style={{
                    borderColor: "rgba(20, 71, 230, 0.2)",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(20, 71, 230, 0.2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password strength hint */}
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Must be at least 6 characters.
            </p>

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
                  Resetting…
                </span>
              ) : (
                <>
                  <KeyRound size={17} />
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="flex justify-center mt-6">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
              style={{ color: "var(--primary)" }}
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
