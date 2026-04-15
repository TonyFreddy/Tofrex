import { Link } from "react-router";
import { SparklesIcon, ZapIcon, ShieldCheckIcon, ImageIcon, UsersIcon, MessageCircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

const features = [
  {
    icon: <ZapIcon className="w-6 h-6" style={{ color: "#a78bfa" }} />,
    title: "Real-time messaging",
    desc: "Messages delivered instantly with zero delay thanks to Socket.IO.",
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" style={{ color: "#a78bfa" }} />,
    title: "Secure & private",
    desc: "JWT authentication and encrypted sessions keep your conversations safe.",
  },
  {
    icon: <ImageIcon className="w-6 h-6" style={{ color: "#a78bfa" }} />,
    title: "Image sharing",
    desc: "Share images instantly with Cloudinary-powered uploads.",
  },
  {
    icon: <UsersIcon className="w-6 h-6" style={{ color: "#a78bfa" }} />,
    title: "Online presence",
    desc: "See who's online in real time and never miss a conversation.",
  },
];

const steps = [
  { number: "01", title: "Create your account", desc: "Sign up in seconds, no credit card required." },
  { number: "02", title: "Find your contacts", desc: "Connect with anyone already on the platform." },
  { number: "03", title: "Start chatting", desc: "Send messages and images in real time." },
];

function FloatingOrb({ style }) {
  return <div className="absolute pointer-events-none rounded-full" style={style} />;
}

function HomePage() {
  const authUser = useAuthStore((s) => s.authUser);
  const logout   = useAuthStore((s) => s.logout);
  const heroRef  = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: "#0a0617" }}>

      {/* Background orbs */}
      <FloatingOrb style={{ top: "-5%", left: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%)" }} />
      <FloatingOrb style={{ bottom: "10%", right: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(196,153,42,0.12) 0%, transparent 70%)" }} />
      <FloatingOrb style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-20 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #c4992a)", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ color: "#f5f0ff", letterSpacing: "-0.02em" }}>Tofrex</span>
        </div>

        <div className="flex items-center gap-4">
          {authUser ? (
            // ✅ Utilisateur connecté
            <>
              <Link to="/chat"
                className="text-sm font-medium px-5 py-2 rounded-xl transition-all"
                style={{ color: "#9d91b8", border: "1px solid rgba(124,58,237,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#f5f0ff"}
                onMouseLeave={e => e.currentTarget.style.color = "#9d91b8"}
              >
                💬 Chat
              </Link>
              {authUser.isCreator ? (
                <Link to={`/creator/${authUser._id}`}
                  className="text-sm font-medium px-5 py-2 rounded-xl transition-all"
                  style={{ color: "#9d91b8", border: "1px solid rgba(124,58,237,0.2)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#f5f0ff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9d91b8"}
                >
                  🎨 Mon profil créateur
                </Link>
              ) : (
                <Link to="/become-creator"
                  className="text-sm font-medium px-5 py-2 rounded-xl transition-all"
                  style={{ color: "#9d91b8", border: "1px solid rgba(124,58,237,0.2)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#f5f0ff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9d91b8"}
                >
                  🚀 Devenir créateur
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            // ✅ Utilisateur non connecté
            <>
              <Link to="/login"
                className="text-sm font-medium px-5 py-2 rounded-xl transition-all"
                style={{ color: "#9d91b8" }}
                onMouseEnter={e => e.target.style.color = "#f5f0ff"}
                onMouseLeave={e => e.target.style.color = "#9d91b8"}
              >
                Sign In
              </Link>
              <Link to="/signup"
                className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 20px rgba(124,58,237,0.35)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.6)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.35)"}
              >
                Get Started →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live & free for everyone
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: "#f5f0ff", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          Chat without{" "}
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #c4992a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            limits
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-xl mb-10" style={{ color: "#6b5f8a", lineHeight: 1.7 }}>
          Real-time messaging, image sharing, and online presence — all in one sleek, secure platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {authUser ? (
            <>
              <Link to="/chat"
                className="text-base font-semibold px-8 py-3.5 rounded-xl text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)"}
              >
                💬 Aller au chat →
              </Link>
              {!authUser.isCreator && (
                <Link to="/become-creator"
                  className="text-base font-medium px-8 py-3.5 rounded-xl transition-all"
                  style={{ color: "#9d91b8", border: "1px solid rgba(124,58,237,0.2)" }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)"; e.currentTarget.style.color = "#f5f0ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.2)"; e.currentTarget.style.color = "#9d91b8"; }}
                >
                  🚀 Devenir créateur
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/signup"
                className="text-base font-semibold px-8 py-3.5 rounded-xl text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)"}
              >
                Start for free →
              </Link>
              <Link to="/login"
                className="text-base font-medium px-8 py-3.5 rounded-xl transition-all"
                style={{ color: "#9d91b8", border: "1px solid rgba(124,58,237,0.2)" }}
                onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)"; e.currentTarget.style.color = "#f5f0ff"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.2)"; e.currentTarget.style.color = "#9d91b8"; }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mock chat UI */}
        <div className="mt-20 w-full max-w-2xl rounded-2xl overflow-hidden reveal opacity-0 translate-y-8 transition-all duration-700"
          style={{ border: "1px solid rgba(124,58,237,0.2)", background: "rgba(18,9,42,0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: "#e8e0ff" }}>Alex</p>
              <p className="text-xs" style={{ color: "#4ade80" }}>● Online</p>
            </div>
          </div>
          <div className="px-5 py-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex-shrink-0" />
              <div className="px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-xs" style={{ background: "rgba(124,58,237,0.2)", color: "#e8e0ff" }}>
                Hey! Did you see the new update? 🚀
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="px-4 py-2.5 rounded-2xl rounded-tr-none text-sm max-w-xs text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                Yes! Real-time is insane 🔥
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex-shrink-0" />
              <div className="px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-xs" style={{ background: "rgba(124,58,237,0.2)", color: "#e8e0ff" }}>
                Let's catch up later tonight 👍
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}>
            <div className="flex-1 rounded-xl px-4 py-2.5 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)", color: "#6b5f8a" }}>
              Type a message...
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              <MessageCircleIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-20 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f5f0ff", letterSpacing: "-0.03em" }}>
              Everything you need
            </h2>
            <p className="text-base" style={{ color: "#6b5f8a" }}>Built for speed, security, and simplicity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl reveal opacity-0 translate-y-8 transition-all duration-700"
                style={{ background: "rgba(18,9,42,0.6)", border: "1px solid rgba(124,58,237,0.15)", backdropFilter: "blur(8px)", transitionDelay: `${i * 100}ms` }}
                onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(124,58,237,0.4)"}
                onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(124,58,237,0.15)"}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.15)" }}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "#e8e0ff" }}>{f.title}</h3>
                <p className="text-sm" style={{ color: "#6b5f8a", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 md:px-20 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f5f0ff", letterSpacing: "-0.03em" }}>
              Up and running in 3 steps
            </h2>
            <p className="text-base" style={{ color: "#6b5f8a" }}>No complexity, just conversations.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 p-8 rounded-2xl text-center reveal opacity-0 translate-y-8 transition-all duration-700"
                style={{ background: "rgba(18,9,42,0.6)", border: "1px solid rgba(124,58,237,0.15)", transitionDelay: `${i * 150}ms` }}>
                <div className="text-4xl font-bold mb-4" style={{ background: "linear-gradient(135deg, #7c3aed, #c4992a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.number}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "#e8e0ff" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: "#6b5f8a", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 px-6 md:px-20 py-24">
        <div className="max-w-2xl mx-auto text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="p-12 rounded-3xl" style={{ background: "rgba(18,9,42,0.8)", border: "1px solid rgba(124,58,237,0.25)", backdropFilter: "blur(12px)" }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f5f0ff", letterSpacing: "-0.03em" }}>
              Ready to connect?
            </h2>
            <p className="text-base mb-8" style={{ color: "#6b5f8a" }}>
              Join and start messaging in seconds. Free forever.
            </p>
            {authUser ? (
              <Link to="/chat"
                className="inline-block text-base font-semibold px-10 py-4 rounded-xl text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)"}
              >
                💬 Aller au chat →
              </Link>
            ) : (
              <Link to="/signup"
                className="inline-block text-base font-semibold px-10 py-4 rounded-xl text-white transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.65)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.4)"}
              >
                Create your account →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-20 py-8" style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #c4992a)" }}>
              <SparklesIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "#f5f0ff" }}>Tofrex</span>
          </div>
          <p className="text-xs" style={{ color: "#3d3459" }}>© 2026 Tofrex. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;