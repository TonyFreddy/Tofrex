import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore }    from "../store/useAuthStore";
import Layout from "../components/Layout";
import toast  from "react-hot-toast";

export default function CreatorProfilePage() {
  const { creatorId }  = useParams();
  const [searchParams] = useSearchParams();
  const authUser       = useAuthStore((s) => s.authUser);

  const {
    creator, posts, isSubscribed, isOwner, subscriberCount,
    isLoading, fetchCreatorProfile, deletePost,
    verifySubscription, verifyTip,
  } = useCreatorStore();

  const [tipModal,    setTipModal]    = useState(false);
  const [tipAmount,   setTipAmount]   = useState(1000);
  const [tipMsg,      setTipMsg]      = useState("");
  const [tipLoading,  setTipLoading]  = useState(false);
  const [subLoading,  setSubLoading]  = useState(false);
  const [activeTab,   setActiveTab]   = useState("all");

  useEffect(() => {
    if (!creatorId) return;
    fetchCreatorProfile(creatorId);
    if (searchParams.get("subscribed") === "true") toast.success("🎉 Abonnement activé !");
  }, [creatorId, fetchCreatorProfile, searchParams]);

  // Charger KKiaPay script
  useEffect(() => {
    if (!document.getElementById("kkiapay-script")) {
      const s = document.createElement("script");
      s.id    = "kkiapay-script";
      s.src   = "https://cdn.kkiapay.me/k.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const openKkiapay = (amount, onSuccess) => {
    if (!window.openKkiapayWidget) return toast.error("KKiaPay non chargé, réessaie.");
    window.openKkiapayWidget({
      amount,
      key:     import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
      sandbox: import.meta.env.VITE_KKIAPAY_SANDBOX !== "false",
      name:    authUser?.fullName || "",
    });
    window.addSuccessListener(async (response) => {
      await onSuccess(response.transactionId);
    });
  };

  const handleSubscribe = () => {
    if (!creator) return;
    setSubLoading(true);
    openKkiapay(creator.monthlyPrice, async (txId) => {
      try {
        await verifySubscription(creatorId, txId);
        toast.success("🎉 Abonnement activé !");
        fetchCreatorProfile(creatorId);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur paiement");
      } finally { setSubLoading(false); }
    });
    setTimeout(() => setSubLoading(false), 3000);
  };

  const handleTip = () => {
    if (tipAmount < 100) return toast.error("Minimum 100 XOF");
    setTipLoading(true);
    openKkiapay(tipAmount, async (txId) => {
      try {
        await verifyTip(creatorId, txId, tipMsg);
        toast.success("💸 Tip envoyé !");
        setTipModal(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur");
      } finally { setTipLoading(false); }
    });
    setTimeout(() => setTipLoading(false), 3000);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Supprimer ce post ?")) return;
    try { await deletePost(postId); toast.success("Post supprimé"); }
    catch { toast.error("Erreur"); }
  };

  if (isLoading) return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
      </div>
    </Layout>
  );

  if (!creator) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white text-xl font-bold mb-4">Créateur introuvable</p>
        <Link to="/explore" className="px-5 py-2 rounded-xl text-white font-semibold"
          style={{ background: "#7c3aed" }}>← Explorer</Link>
      </div>
    </Layout>
  );

  const user         = creator.userId;
  const priceDisplay = `${creator.monthlyPrice?.toLocaleString()} XOF/mois`;
  const filteredPosts = posts.filter((p) => {
    if (activeTab === "premium") return p.isPremium;
    if (activeTab === "free")    return !p.isPremium;
    return true;
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-10">

        {/* Cover */}
        <div className="relative w-full" style={{ height: 200 }}>
          <div className="w-full h-full"
            style={{ background: creator.coverImage ? undefined : "linear-gradient(135deg,#2d1b69,#7c3aed,#4f46e5)" }}>
            {creator.coverImage && <img src={creator.coverImage} alt="cover" className="w-full h-full object-cover" />}
          </div>
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, #0a0617 100%)" }} />
        </div>

        <div className="px-4">
          {/* Avatar + name */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="p-1 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#c4992a)" }}>
              <img src={user.profilePic || "/avatar.png"} alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4"
                style={{ borderColor: "#0a0617" }} />
            </div>
            {isOwner && (
              <Link to="/upload"
                className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                ➕ Publier
              </Link>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>

          {/* Stats */}
          <div className="flex gap-6 my-3">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{posts.length}</p>
              <p className="text-xs" style={{ color: "#6b5fa8" }}>Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{subscriberCount}</p>
              <p className="text-xs" style={{ color: "#6b5fa8" }}>Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#a78bfa" }}>{priceDisplay}</p>
              <p className="text-xs" style={{ color: "#6b5fa8" }}>Abonnement</p>
            </div>
          </div>

          {creator.bio && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: "#c4b5fd" }}>{creator.bio}</p>
          )}

          {/* Actions */}
          {!isOwner && (
            <div className="flex gap-3 mb-6">
              {isSubscribed ? (
                <div className="flex-1 py-3 rounded-xl text-center font-bold text-green-400 text-sm"
                  style={{ background: "#0d1f0d", border: "1px solid #166534" }}>
                  ✅ Abonné
                </div>
              ) : (
                <button onClick={handleSubscribe} disabled={subLoading}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", opacity: subLoading ? 0.6 : 1 }}>
                  {subLoading ? "En cours..." : `🔓 S'abonner — ${priceDisplay}`}
                </button>
              )}
              <button onClick={() => setTipModal(true)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
                💸 Tip
              </button>
              <Link to={`/chat`}
                className="px-4 py-3 rounded-xl font-bold text-sm text-white flex items-center"
                style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
                💬
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="flex gap-3 mb-6">
              <button onClick={() => window.location.href = "/upload"}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                ➕ Nouveau post
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "#1a1030" }}>
            {[
              { key: "all",     label: "Tous" },
              { key: "premium", label: "🔒 Premium" },
              { key: "free",    label: "🆓 Gratuit" },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: activeTab === t.key ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "transparent",
                  color:      activeTab === t.key ? "#fff" : "#6b5fa8",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-white font-semibold">Aucun post</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {filteredPosts.map((post) => (
                <div key={post._id} className="relative rounded-lg overflow-hidden"
                  style={{ aspectRatio: "1/1", background: "#1a1030" }}>
                  {post.locked ? (
                    <div className="w-full h-full flex flex-col items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#1a1030,#0d0920)" }}>
                      <span className="text-2xl">🔒</span>
                    </div>
                  ) : post.mediaType === "video" ? (
                    <video src={post.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  {post.isPremium && !post.locked && (
                    <span className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded-full font-bold text-white"
                      style={{ background: "#7c3aed", fontSize: 10 }}>⭐</span>
                  )}
                  {isOwner && (
                    <button onClick={() => handleDelete(post._id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ background: "rgba(127,29,29,0.9)" }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tip Modal */}
      {tipModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">💸 Envoyer un tip</h2>
              <button onClick={() => setTipModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: "#2e2250" }}>✕</button>
            </div>

            <p className="text-sm mb-4" style={{ color: "#6b5fa8" }}>à {user.fullName}</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[500, 1000, 2000, 5000].map((v) => (
                <button key={v} onClick={() => setTipAmount(v)}
                  className="py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: tipAmount === v ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#2e2250" }}>
                  {v.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }}>
              <input type="number" min={100} value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="flex-1 bg-transparent text-white text-xl font-bold outline-none" />
              <span className="text-sm font-semibold" style={{ color: "#6b5fa8" }}>XOF</span>
            </div>

            <input type="text" placeholder="Message (optionnel)" value={tipMsg}
              onChange={(e) => setTipMsg(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none mb-5"
              style={{ background: "#0d0920", border: "1px solid #2e2250" }} />

            <button onClick={handleTip} disabled={tipLoading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-opacity"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", opacity: tipLoading ? 0.6 : 1 }}>
              {tipLoading ? "En cours..." : `Envoyer ${tipAmount.toLocaleString()} XOF`}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}