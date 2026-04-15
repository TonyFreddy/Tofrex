import { Link, useLocation } from "react-router";
import { useAuthStore }    from "../store/useAuthStore";
import { useCreatorStore } from "../store/useCreatorStore";

export default function MobileNav() {
  const authUser   = useAuthStore((s) => s.authUser);
  const unread     = useCreatorStore((s) => s.unreadNotifs);
  const { pathname } = useLocation();

  const links = [
    { to: "/feed",           icon: "🏠", label: "Accueil" },
    { to: "/explore",        icon: "🔍", label: "Explorer" },
    { to: "/notifications",  icon: "🔔", label: "Notifs", badge: unread },
    { to: "/chat",           icon: "💬", label: "Messages" },
    { to: `/profile/${authUser?._id}`, icon: "👤", label: "Profil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{ background: "rgba(13,9,32,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(124,58,237,0.15)" }}>
      {links.map((l) => {
        const active = pathname === l.to || pathname.startsWith(l.to + "/");
        return (
          <Link key={l.to} to={l.to}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 relative"
            style={{ color: active ? "#a78bfa" : "#4a3f6b" }}>
            <span className="text-xl">{l.icon}</span>
            <span className="text-xs font-medium">{l.label}</span>
            {l.badge > 0 && (
              <span className="absolute top-2 right-1/4 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
                style={{ background: "#7c3aed", fontSize: 9 }}>{l.badge}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}