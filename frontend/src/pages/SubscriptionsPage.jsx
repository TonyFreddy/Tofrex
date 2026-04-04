import { useEffect, useState } from "react";
import { Link } from "react-router";
import { axiosInstance }   from "../lib/axios";
import { useCreatorStore } from "../store/useCreatorStore";
import Layout from "../components/Layout";
import toast  from "react-hot-toast";

export default function SubscriptionsPage() {
  const [subs,    setSubs]  = useState([]);
  const [loading, setLoad]  = useState(true);
  const { cancelSubscription } = useCreatorStore();

  useEffect(() => {
    axiosInstance.get("/subscriptions/my")
      .then((r) => setSubs(r.data))
      .catch(() => toast.error("Erreur chargement"))
      .finally(() => setLoad(false));
  }, []);

  const handleCancel = async (creatorId, name) => {
    if (!window.confirm(`Annuler l'abonnement à ${name} ?`)) return;
    try {
      await cancelSubscription(creatorId);
      setSubs((prev) => prev.filter((s) => s.creatorId._id !== creatorId));
      toast.success("Abonnement annulé");
    } catch { toast.error("Erreur"); }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Mes abonnements</h1>
            <p className="text-sm mt-1" style={{ color: "#6b5fa8" }}>
              {subs.length} abonnement{subs.length !== 1 ? "s" : ""} actif{subs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/explore"
            className="text-sm px-4 py-2 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            + Explorer
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : subs.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
            <p className="text-5xl mb-4">📭</p>
            <p className="text-white font-bold text-xl mb-2">Aucun abonnement actif</p>
            <p className="text-sm mb-6" style={{ color: "#6b5fa8" }}>
              Abonne-toi à des créateurs pour voir leur contenu exclusif
            </p>
            <Link to="/explore"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              Explorer →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subs.map((sub) => {
              const creator = sub.creatorId;
              return (
                <div key={sub._id} className="rounded-2xl overflow-hidden"
                  style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
                  <div className="flex items-center justify-between p-4">
                    <Link to={`/creator/${creator._id}`} className="flex items-center gap-4">
                      <img src={creator.profilePic || "/avatar.png"} alt={creator.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                        style={{ border: "2px solid #7c3aed" }} />
                      <div>
                        <p className="font-bold text-white">{creator.fullName}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#4ade80" }}>✅ Abonnement actif</p>
                        {sub.expiresAt && (
                          <p className="text-xs mt-0.5" style={{ color: "#6b5fa8" }}>
                            Expire le {new Date(sub.expiresAt).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2 items-end">
                      <Link to={`/creator/${creator._id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                        Voir →
                      </Link>
                      <button onClick={() => handleCancel(creator._id, creator.fullName)}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold"
                        style={{ background: "#2e1515", color: "#f87171", border: "1px solid #7f1d1d" }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}