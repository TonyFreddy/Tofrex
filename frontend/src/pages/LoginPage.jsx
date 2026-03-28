import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { SparklesIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#0a0617" }}>

      {/* Left — form side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 py-16 relative">

        {/* Subtle left glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 60%)" }}
        />

        <div className="relative z-10 max-w-md w-full mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #c4992a)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}
            >
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: "#f5f0ff", letterSpacing: "-0.02em" }}>
              Tofrex
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3" style={{ color: "#f5f0ff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              Welcome back
            </h1>
            <p className="text-base" style={{ color: "#6b5f8a" }}>
              Sign in to continue your conversations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2" style={{ color: "#9d91b8" }}>Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a4e7a" }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="johndoe@gmail.com"
                  className="w-full py-3 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    color: "#e8e0ff",
                  }}
                  onFocus={e => e.target.style.border = "1px solid rgba(124,58,237,0.6)"}
                  onBlur={e => e.target.style.border = "1px solid rgba(124,58,237,0.2)"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: "#9d91b8" }}>Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a4e7a" }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full py-3 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    color: "#e8e0ff",
                  }}
                  onFocus={e => e.target.style.border = "1px solid rgba(124,58,237,0.6)"}
                  onBlur={e => e.target.style.border = "1px solid rgba(124,58,237,0.2)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 0 30px rgba(124,58,237,0.35)",
              }}
              onMouseEnter={e => e.target.style.boxShadow = "0 0 40px rgba(124,58,237,0.55)"}
              onMouseLeave={e => e.target.style.boxShadow = "0 0 30px rgba(124,58,237,0.35)"}
            >
              {isLoggingIn ? (
                <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
              ) : "Sign In →"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center" style={{ color: "#6b5f8a" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium transition-colors" style={{ color: "#c4992a" }}
              onMouseEnter={e => e.target.style.color = "#e8c547"}
              onMouseLeave={e => e.target.style.color = "#c4992a"}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right — visual side */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ borderLeft: "1px solid rgba(124,58,237,0.12)" }}
      >
        {/* Background glow */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.18) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2"
          style={{ background: "radial-gradient(ellipse at 40% 100%, rgba(196,153,42,0.1) 0%, transparent 60%)" }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center px-12">
          <img src="/login.svg" alt="Login" className="w-full max-w-sm mx-auto mb-10 drop-shadow-2xl" />

          <h2 className="text-2xl font-bold mb-3" style={{ color: "#f5f0ff", letterSpacing: "-0.02em" }}>
            Connect anytime, anywhere
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6b5f8a" }}>
            Premium real-time messaging for everyone
          </p>

          <div className="flex justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(196,153,42,0.12)", color: "#c4992a", border: "1px solid rgba(196,153,42,0.25)" }}>
              ✦ Free
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>
              Real-time
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(196,153,42,0.12)", color: "#c4992a", border: "1px solid rgba(196,153,42,0.25)" }}>
              ✦ Private
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;