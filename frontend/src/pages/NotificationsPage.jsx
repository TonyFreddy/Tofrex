import { useEffect } from "react";
import { Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import Layout from "../components/Layout";

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markNotifsRead } = useCreatorStore();

  useEffect(() => {
    fetchNotifications();
    markNotifsRead();
  }, [fetchNotifications, markNotifsRead]);

  const icons = { subscription: "⭐", tip: "💸", like: "❤️" };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
            <p className="text-5xl mb-4">🔔</p>
            <p className="text-white font-bold text-xl">Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: n.read ? "#1a1030" : "rgba(124,58,237,0.1)",
                  border: `1px solid ${n.read ? "#2e2250" : "rgba(124,58,237,0.3)"}`,
                }}>
                <span className="text-2xl">{icons[n.type]}</span>
                {n.fromId && (
                  <img src={n.fromId.profilePic || "/avatar.png"} alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{n.message}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b5fa8" }}>
                    {new Date(n.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#7c3aed" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}