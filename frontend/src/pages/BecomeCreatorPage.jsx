import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore }    from "../store/useAuthStore";
import Layout from "../components/Layout";
import toast  from "react-hot-toast";

export default function BecomeCreatorPage() {
  const navigate          = useNavigate();
  const authUser          = useAuthStore((s) => s.authUser);
  const checkAuth         = useAuthStore((s) => s.checkAuth);
  const { becomeCreator } = useCreatorStore();

  const [bio,     setBio]   = useState("");
  const [price,   setPrice] = useState(1000);
  const [loading, setLoad]  = useState(false);

  const handleSubmit = async () => {
    if (!price || price < 500) return toast.error("Prix minimum : 500 XOF/mois");
    setLoad(true);
    try {
      await becomeCreator({ bio, monthlyPrice: price });
      await checkAuth();
      toast.success("🎉 Profil créateur activé !");
      navigate(`/creator/${authUser._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    } finally { setLoad(false); }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            🚀
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Deviens créateur</h1>
          <p className="text-sm" style={{ color: "#6b5fa8" }}>
            Publie du contenu exclusif et monétise ton audience
          </p>
        </div>

        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: "#1a1030", border: "1px solid #2e2250" }}>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "#c4b5fd" }}>
              Biographie
            </label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)}
              placeholder="Parle de toi, de ton contenu, de tes passions..."
              className="w-full rounded-xl px-4 py-3 text-white text-sm resize-none outline-none"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }} />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "#c4b5fd" }}>
              Prix abonnement mensuel (XOF)
            </label>
            <div className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }}>
              <input type="number" min={500} value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="flex-1 bg-transparent text-2xl font-bold text-white outline-none" />
              <span className="font-semibold" style={{ color: "#6b5fa8" }}>XOF/mois</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[500, 1000, 2000, 5000].map((v) => (
                <button key={v} onClick={() => setPrice(v)}
                  className="py-2 rounded-lg text-xs font-bold text-white transition-all"
                  style={{ background: price === v ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#2e2250" }}>
                  {v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Avantages */}
          <div className="p-4 rounded-xl" style={{ background: "#0d0920", border: "1px solid #2e2250" }}>
            <p className="text-sm font-bold text-white mb-3">Ce que tu obtiens :</p>
            {[
              "Publie photos et vidéos exclusives",
              "Tes abonnés paient via KKiaPay",
              "Reçois des tips de tes fans",
              "Contenu verrouillé pour non-abonnés",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                <span className="text-sm" style={{ color: "#9d8ec7" }}>{item}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white text-base transition-opacity"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Activation..." : "🚀 Activer mon profil créateur"}
          </button>
        </div>
      </div>
    </Layout>
  );
}