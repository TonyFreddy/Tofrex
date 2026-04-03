import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function BecomeCreatorPage() {
  const navigate    = useNavigate();
  const authUser    = useAuthStore((s) => s.authUser);
  const checkAuth   = useAuthStore((s) => s.checkAuth);
  const { becomeCreator } = useCreatorStore();

  const [bio, setBio]               = useState("");
  const [monthlyPrice, setPrice]    = useState(5);
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    if (!monthlyPrice || monthlyPrice < 1)
      return toast.error("Prix minimum : $1/mois");

    setLoading(true);
    try {
      await becomeCreator({ bio, monthlyPrice });
      await checkAuth(); // refresh authUser.isCreator
      toast.success("🎉 Tu es maintenant créateur !");
      navigate(`/creator/${authUser._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0617" }}>
      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ background: "#1a1030", border: "1px solid #2e2250" }}>

        <h1 className="text-2xl font-bold text-white mb-1">Devenir Créateur</h1>
        <p className="text-sm mb-6" style={{ color: "#9d8ec7" }}>
          Monétise ton contenu auprès d'une audience mondiale.
        </p>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: "#c4b5fd" }}>
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Présente-toi à tes futurs abonnés..."
            className="w-full rounded-lg px-4 py-2 text-white text-sm resize-none outline-none"
            style={{ background: "#0d0920", border: "1px solid #2e2250" }}
          />
        </div>

        {/* Prix */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" style={{ color: "#c4b5fd" }}>
            Prix abonnement mensuel (USD)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">$</span>
            <input
              type="number"
              min={1}
              value={monthlyPrice}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg px-4 py-2 text-white outline-none"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: "#6b5fa8" }}>
            Stripe prélève 2.9% + $0.30 par transaction
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Création en cours..." : "🚀 Créer mon profil créateur"}
        </button>
      </div>
    </div>
  );
}