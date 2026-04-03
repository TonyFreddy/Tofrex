import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function UploadContentPage() {
  const navigate  = useNavigate();
  const authUser  = useAuthStore((s) => s.authUser);   // ✅ selector propre
  const { uploadPost } = useCreatorStore();
  const fileRef   = useRef(null);

  const [preview,   setPreview]   = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [mediaData, setMediaData] = useState(null);
  const [caption,   setCaption]   = useState("");
  const [isPremium, setIsPremium] = useState(true);
  const [loading,   setLoading]   = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type.startsWith("video") ? "video" : "image";
    setMediaType(type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMediaData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!mediaData)      return toast.error("Sélectionne un fichier");
    if (!authUser?._id)  return toast.error("Utilisateur non connecté");

    setLoading(true);
    try {
      await uploadPost({ caption, isPremium, mediaData, mediaType });
      toast.success("✅ Post publié !");
      navigate(`/creator/${authUser._id}`);
    } catch (err) {
      console.error("uploadPost error:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0617" }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#1a1030", border: "1px solid #2e2250" }}>

        <h1 className="text-xl font-bold text-white mb-4">📸 Nouveau Post</h1>

        {/* Zone upload */}
        <div
          className="relative rounded-xl overflow-hidden mb-4 flex items-center justify-center cursor-pointer"
          style={{ height: 240, background: "#0d0920", border: "2px dashed #2e2250" }}
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            mediaType === "video"
              ? <video src={preview} className="w-full h-full object-cover" controls />
              : <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center" style={{ color: "#6b5fa8" }}>
              <p className="text-4xl mb-2">+</p>
              <p className="text-sm">Photo ou vidéo</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Caption */}
        <textarea
          rows={2}
          placeholder="Légende (optionnelle)..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none outline-none mb-3"
          style={{ background: "#0d0920", border: "1px solid #2e2250" }}
        />

        {/* Toggle premium */}
        <div
          className="flex items-center justify-between mb-5 p-3 rounded-lg"
          style={{ background: "#0d0920", border: "1px solid #2e2250" }}
        >
          <div>
            <p className="text-sm font-semibold text-white">Contenu Premium 🔒</p>
            <p className="text-xs" style={{ color: "#6b5fa8" }}>
              Visible uniquement par tes abonnés
            </p>
          </div>
          <button
            onClick={() => setIsPremium(!isPremium)}
            className="w-12 h-6 rounded-full relative transition-all duration-300"
            style={{ background: isPremium ? "#7c3aed" : "#2e2250" }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
              style={{ left: isPremium ? "calc(100% - 20px)" : "4px" }}
            />
          </button>
        </div>

        {/* Bouton publier */}
        <button
          onClick={handleSubmit}
          disabled={loading || !mediaData}
          className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            opacity: loading || !mediaData ? 0.5 : 1,
          }}
        >
          {loading ? "Publication en cours..." : "Publier"}
        </button>
      </div>
    </div>
  );
}