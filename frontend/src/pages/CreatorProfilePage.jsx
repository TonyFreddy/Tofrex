import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const LockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function CreatorProfilePage() {
  const { creatorId }   = useParams();
  const [searchParams]  = useSearchParams();
  const authUser = useAuthStore((s) => s.authUser);

  const {
    creator, posts, isSubscribed, isOwner, isLoading,
    fetchCreatorProfile, subscribeToCreator, sendTip, deletePost,
  } = useCreatorStore();

  const [tipModal,   setTipModal]   = useState(false);
  const [tipAmount,  setTipAmount]  = useState(5);
  const [tipMsg,     setTipMsg]     = useState("");
  const [tipLoading, setTipLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (!creatorId) return;
    fetchCreatorProfile(creatorId);

    if (searchParams.get("subscribed") === "true") toast.success("🎉 Abonnement activé !");
    if (searchParams.get("tipped")     === "true") toast.success("💸 Tip envoyé, merci !");
  }, [creatorId]);

  const handleSubscribe = async () => {
    setSubLoading(true);
    try {
      await subscribeToCreator(creatorId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      setSubLoading(false);
    }
  };

  const handleTip = async () => {
    if (tipAmount < 1) return toast.error("Minimum $1");
    setTipLoading(true);
    try {
      await sendTip(creatorId, tipAmount, tipMsg);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      setTipLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Supprimer ce post définitivement ?")) return;
    try {
      await deletePost(postId);
      toast.success("Post supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0617" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen flex items-center justify-center text-white"
      style={{ background: "#0a0617" }}>
      Créateur introuvable
    </div>
  );

  const user         = creator.userId;
  const priceDisplay = `$${(creator.monthlyPrice / 100).toFixed(2)}/mois`;

  return (
    <div className="min-h-screen" style={{ background: "#0a0617" }}>

      {/* Cover */}
      <div className="relative h-48 w-full"
        style={{ background: creator.coverImage ? undefined : "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
        {creator.coverImage && (
          <img src={creator.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">

        {/* Avatar + nom */}
        <div className="flex items-end gap-4 -mt-12 mb-4">
          <img
            src={user.profilePic || "/avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 object-cover"
            style={{ borderColor: "#0a0617" }}
          />
          <div className="pb-2">
            <h1 className="text-xl font-bold text-white">{user.fullName}</h1>
            <p className="text-sm" style={{ color: "#9d8ec7" }}>{priceDisplay}</p>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-sm mb-5" style={{ color: "#c4b5fd" }}>{creator.bio}</p>
        )}

        {/* Boutons actions */}
        {!isOwner ? (
          <div className="flex gap-3 mb-6">
            {isSubscribed ? (
              <div className="flex-1 py-2 rounded-xl text-center font-semibold text-green-400"
                style={{ background: "#0d1f0d", border: "1px solid #166534" }}>
                ✅ Abonné
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={subLoading}
                className="flex-1 py-2 rounded-xl font-semibold text-white transition-opacity"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  opacity: subLoading ? 0.6 : 1,
                }}
              >
                {subLoading ? "Redirection..." : `S'abonner — ${priceDisplay}`}
              </button>
            )}
            <button
              onClick={() => setTipModal(true)}
              className="px-5 py-2 rounded-xl font-semibold text-white"
              style={{ background: "#1a1030", border: "1px solid #2e2250" }}
            >
              💸 Tip
            </button>
          </div>
        ) : (
          <div className="flex gap-3 mb-6">
            <Link
              to="/upload"
              className="flex-1 py-2 rounded-xl text-center font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              + Nouveau post
            </Link>
          </div>
        )}

        {/* Grille de posts */}
        {posts.length === 0 ? (
          <p className="text-center text-sm mt-10" style={{ color: "#6b5fa8" }}>
            Aucun post pour l'instant.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative rounded-xl overflow-hidden"
                style={{
                  aspectRatio: "1/1",
                  background: "#1a1030",
                  border: "1px solid #2e2250",
                }}
              >
                {post.locked ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                    style={{ color: "#6b5fa8" }}>
                    <LockIcon />
                    <p className="text-xs text-center px-2">
                      Abonne-toi pour voir ce contenu
                    </p>
                  </div>
                ) : post.mediaType === "video" ? (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover" />
                )}

                {post.isPremium && !post.locked && (
                  <span
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                    style={{ background: "#7c3aed" }}
                  >
                    Premium
                  </span>
                )}

                {isOwner && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full text-white"
                    style={{ background: "#7f1d1d" }}
                  >
                    Supprimer
                  </button>
                )}

                {post.caption && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-white truncate"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    {post.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tip */}
      {tipModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }}>

            <h2 className="text-lg font-bold text-white mb-4">
              💸 Envoyer un tip à {user.fullName}
            </h2>

            <label className="block text-sm mb-1" style={{ color: "#c4b5fd" }}>Montant ($)</label>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white">$</span>
              <input
                type="number"
                min={1}
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 text-white outline-none"
                style={{ background: "#0d0920", border: "1px solid #2e2250" }}
              />
            </div>

            {/* Raccourcis montants */}
            <div className="flex gap-2 mb-4">
              {[1, 5, 10, 20].map((v) => (
                <button
                  key={v}
                  onClick={() => setTipAmount(v)}
                  className="flex-1 py-1 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ background: tipAmount === v ? "#7c3aed" : "#2e2250" }}
                >
                  ${v}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Message (optionnel)"
              value={tipMsg}
              onChange={(e) => setTipMsg(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-white text-sm outline-none mb-4"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setTipModal(false)}
                className="flex-1 py-2 rounded-xl text-white font-semibold"
                style={{ background: "#2e2250" }}
              >
                Annuler
              </button>
              <button
                onClick={handleTip}
                disabled={tipLoading}
                className="flex-1 py-2 rounded-xl font-semibold text-white transition-opacity"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  opacity: tipLoading ? 0.6 : 1,
                }}
              >
                {tipLoading ? "..." : `Envoyer $${tipAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}