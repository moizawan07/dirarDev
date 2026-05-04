import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../services/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    // ── Dummy check (remove when API is ready) ────────────────────────────
    if (email === "admin@gmail.com") {
      toast.success("Password reset link sent! Check your inbox.");
      setSent(true);
      return;
    }

    // ── Real API call ─────────────────────────────────────────────────────
    setLoading(true);
    try {
      const { data } = await forgotPasswordApi({ email });
      toast.success(data.message || "Password reset link sent!");
      setSent(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Something went wrong. Please try again.";
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
              <Mail className="text-white" size={26} />
            </div>
            <h1
              className="font-heading text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Forgot Password
            </h1>
            <p
              className="text-sm mt-1 text-center max-w-xs"
              style={{ color: "#6b7280" }}
            >
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="forgot-email"
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
                    id="forgot-email"
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 font-body"
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
                    Sending…
                  </span>
                ) : (
                  <>
                    <SendHorizonal size={17} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success state */
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(137, 196, 65, 0.15)" }}
              >
                <SendHorizonal
                  size={30}
                  style={{ color: "var(--secondary)" }}
                />
              </div>
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                Check your inbox!
              </p>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                A reset link has been sent to{" "}
                <span className="font-semibold">{email}</span>.
              </p>
            </div>
          )}

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

export default ForgotPassword;
