import { useState } from "react";
import { useParams, Link } from "react-router";
import { useAuthStore }    from "../store/useAuthStore";
import Layout from "../components/Layout";
import toast  from "react-hot-toast";

export default function ProfilePage() {
  const { userId }    = useParams();
  const authUser      = useAuthStore((s) => s.authUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isMe          = authUser?._id === userId;

  const [editing,    setEditing]    = useState(false);
  const [fullName,   setFullName]   = useState(authUser?.fullName || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview,    setPreview]    = useState(authUser?.profilePic || "");
  const [loading,    setLoading]    = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setProfilePic(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ fullName, profilePic });
      toast.success("Profil mis à jour !");
      setEditing(false);
    } catch { toast.error("Erreur"); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Cover placeholder */}
        <div className="h-40 rounded-2xl mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#2d1b69,#7c3aed)" }} />

        {/* Avatar */}
        <div className="flex items-end justify-between -mt-12 px-2 mb-6">
          <div className="relative">
            <img src={preview || "/avatar.png"} alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: "#0a0617" }} />
            {editing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-sm"
                style={{ background: "#7c3aed" }}>
                📷
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            )}
          </div>
          {isMe && !editing && (
            <button onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
              Modifier le profil
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 mb-6">
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white outline-none"
              style={{ background: "#1a1030", border: "1px solid #2e2250" }} />
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: "#2e2250" }}>Annuler</button>
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", opacity: loading ? 0.6 : 1 }}>
                {loading ? "..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{authUser?.fullName}</h1>
            <p className="text-sm" style={{ color: "#6b5fa8" }}>{authUser?.email}</p>
          </div>
        )}

        {/* Creator CTA */}
        {isMe && (
          <div className="rounded-2xl p-5" style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
            {authUser?.isCreator ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">🎨 Tu es créateur</p>
                  <p className="text-xs mt-1" style={{ color: "#6b5fa8" }}>Gère ton contenu et tes abonnés</p>
                </div>
                <Link to={`/creator/${authUser._id}`}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  Ma page
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">🚀 Devenir créateur</p>
                  <p className="text-xs mt-1" style={{ color: "#6b5fa8" }}>Monétise ton contenu</p>
                </div>
                <Link to="/become-creator"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  Commencer
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}