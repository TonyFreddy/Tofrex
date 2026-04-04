import { Link, useLocation } from "react-router";
import { useAuthStore }    from "../store/useAuthStore";
import { useCreatorStore } from "../store/useCreatorStore";
import { SparklesIcon }    from "lucide-react";

export default function Sidebar() {
  const location  = useLocation();
  const authUser  = useAuthStore((s) => s.authUser);
  const logout    = useAuthStore((s) => s.logout);
  const unread    = useCreatorStore((s) => s.unreadNotifs);

  const links = [
    { to: "/feed",          icon: "🏠", label: "Accueil" },
    { to: "/explore",       icon: "🔍", label: "Explorer" },
    { to: "/notifications", icon: "🔔", label: "Notifications", badge: unread },
    { to: "/chat",          icon: "💬", label: "Messages" },
    { to: "/subscriptions", icon: "⭐", label: "Abonnements" },
    { to: `/profile/${authUser?._id}`, icon: "👤", label: "Mon profil" },
  ];

  const creatorLinks = authUser?.isCreator
    ? [
        { to: `/creator/${authUser._id}`, icon: "🎨", label: "Ma page créateur" },
        { to: "/upload",                  icon: "➕", label: "Publier" },
      ]
    : [{ to: "/become-creator", icon: "🚀", label: "Devenir créateur" }];

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-40"
      style={{ background: "#0d0920", borderRight: "1px solid rgba(124,58,237,0.15)" }}>

      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#7c3aed,#c4992a)", boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Tofrex</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <Link key={l.to} to={l.to}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group"
            style={{
              background: isActive(l.to) ? "rgba(124,58,237,0.2)" : "transparent",
              color:      isActive(l.to) ? "#a78bfa" : "#6b5fa8",
            }}
            onMouseEnter={(e) => { if (!isActive(l.to)) e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
            onMouseLeave={(e) => { if (!isActive(l.to)) e.currentTarget.style.background = "transparent"; }}>
            <span className="text-xl">{l.icon}</span>
            <span className="font-semibold text-sm"
              style={{ color: isActive(l.to) ? "#a78bfa" : "#9d91b8" }}>
              {l.label}
            </span>
            {l.badge > 0 && (
              <span className="absolute right-3 top-3 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white"
                style={{ background: "#7c3aed" }}>{l.badge}</span>
            )}
          </Link>
        ))}

        {/* Séparateur */}
        <div className="my-3" style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }} />

        {creatorLinks.map((l) => (
          <Link key={l.to} to={l.to}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{
              background: isActive(l.to) ? "rgba(124,58,237,0.2)" : "transparent",
              color:      isActive(l.to) ? "#a78bfa" : "#6b5fa8",
            }}
            onMouseEnter={(e) => { if (!isActive(l.to)) e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
            onMouseLeave={(e) => { if (!isActive(l.to)) e.currentTarget.style.background = "transparent"; }}>
            <span className="text-xl">{l.icon}</span>
            <span className="font-semibold text-sm"
              style={{ color: isActive(l.to) ? "#a78bfa" : "#9d91b8" }}>
              {l.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(124,58,237,0.08)" }}>
          <img src={authUser?.profilePic || "/avatar.png"} alt="avatar"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            style={{ border: "2px solid #7c3aed" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{authUser?.fullName}</p>
            <p className="text-xs truncate" style={{ color: "#6b5fa8" }}>{authUser?.email}</p>
          </div>
          <button onClick={logout}
            className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
            style={{ color: "#f87171", background: "rgba(127,29,29,0.3)" }}
            title="Déconnexion">
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}