import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import { useAuthStore }    from "../store/useAuthStore";
import Layout from "../components/Layout";
import toast  from "react-hot-toast";

export default function UploadContentPage() {
  const navigate       = useNavigate();
  const authUser       = useAuthStore((s) => s.authUser);
  const { uploadPost } = useCreatorStore();
  const fileRef        = useRef(null);

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
    reader.onloadend = () => { setPreview(reader.result); setMediaData(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!mediaData)     return toast.error("Sélectionne un fichier");
    if (!authUser?._id) return toast.error("Non connecté");
    setLoading(true);
    try {
      await uploadPost({ caption, isPremium, mediaData, mediaType });
      toast.success("✅ Post publié !");
      navigate(`/creator/${authUser._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur upload");
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link to={`/creator/${authUser?._id}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ background: "#1a1030" }}>←</Link>
          <h1 className="text-2xl font-bold text-white">Nouveau post</h1>
        </div>

        {/* Upload zone */}
        <div className="rounded-2xl overflow-hidden mb-5 cursor-pointer relative"
          style={{ height: 320, background: "#1a1030", border: `2px dashed ${preview ? "#7c3aed" : "#2e2250"}` }}
          onClick={() => !preview && fileRef.current?.click()}>
          {preview ? (
            mediaType === "video"
              ? <video src={preview} className="w-full h-full object-cover" controls />
              : <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: "#0d0920" }}>📸</div>
              <p className="font-bold text-white">Ajouter une photo ou vidéo</p>
              <p className="text-sm" style={{ color: "#6b5fa8" }}>JPG, PNG, MP4 acceptés</p>
            </div>
          )}
          {preview && (
            <button onClick={(e) => { e.stopPropagation(); setPreview(null); setMediaData(null); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full text-white flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)" }}>✕</button>
          )}
          {preview && (
            <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-full text-white"
              style={{ background: "rgba(124,58,237,0.8)" }}>Changer</button>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" style={{ color: "#c4b5fd" }}>Légende</label>
          <textarea rows={3} placeholder="Décris ton contenu..." value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-white text-sm resize-none outline-none"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }} />
        </div>

        {/* Toggle premium */}
        <div className="flex items-center justify-between p-4 rounded-xl mb-6"
          style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
          <div>
            <p className="font-bold text-white text-sm">
              {isPremium ? "🔒 Contenu Premium" : "🆓 Contenu Gratuit"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6b5fa8" }}>
              {isPremium ? "Abonnés uniquement" : "Visible par tous"}
            </p>
          </div>
          <button onClick={() => setIsPremium(!isPremium)}
            className="w-14 h-7 rounded-full relative transition-all duration-300"
            style={{ background: isPremium ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#2e2250" }}>
            <span className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300"
              style={{ left: isPremium ? "calc(100% - 24px)" : "4px" }} />
          </button>
        </div>

        <button onClick={handleSubmit} disabled={loading || !mediaData}
          className="w-full py-4 rounded-xl font-bold text-white text-base"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", opacity: loading || !mediaData ? 0.4 : 1 }}>
          {loading ? "Publication..." : "Publier le post"}
        </button>
      </div>
    </Layout>
  );
}