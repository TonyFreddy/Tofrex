import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export default function PostCard({ post, onSubscribe }) {
  const authUser = useAuthStore((s) => s.authUser);
  const [likes, setLikes]   = useState(post.likes?.length || 0);
  const [liked, setLiked]   = useState(post.likes?.includes(authUser?._id));

  const handleLike = async () => {
    try {
      const res = await axiosInstance.post(`/creators/posts/${post._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {
      toast.error("Erreur");
    }
  };

  const creator = post.creatorId;

  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: "#1a1030", border: "1px solid #2e2250" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/creator/${creator._id}`} className="flex items-center gap-3">
          <img src={creator.profilePic || "/avatar.png"} alt={creator.fullName}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "2px solid #7c3aed" }} />
          <div>
            <p className="text-sm font-bold text-white">{creator.fullName}</p>
            <p className="text-xs" style={{ color: "#6b5fa8" }}>
              {new Date(post.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </Link>
        {post.isPremium && (
          <span className="text-xs px-2 py-1 rounded-full font-bold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            ⭐ Premium
          </span>
        )}
      </div>

      {/* Media */}
      {post.locked ? (
        <div className="relative flex items-center justify-center"
          style={{ height: 300, background: "linear-gradient(135deg,#1a1030,#0d0920)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
            <span className="text-5xl">🔒</span>
            <p className="font-bold text-white text-lg">Contenu Premium</p>
            <p className="text-sm" style={{ color: "#6b5fa8" }}>
              Abonne-toi pour accéder à ce contenu exclusif
            </p>
            <button onClick={() => onSubscribe && onSubscribe(creator._id)}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              S'abonner
            </button>
          </div>
        </div>
      ) : post.mediaType === "video" ? (
        <video src={post.mediaUrl} className="w-full max-h-[500px] object-contain" controls
          style={{ background: "#000" }} />
      ) : (
        <img src={post.mediaUrl} alt={post.caption} className="w-full max-h-[500px] object-cover" />
      )}

      {/* Footer */}
      <div className="px-4 py-3">
        {post.caption && (
          <p className="text-sm mb-3" style={{ color: "#c4b5fd" }}>{post.caption}</p>
        )}
        {!post.locked && (
          <div className="flex items-center gap-4">
            <button onClick={handleLike}
              className="flex items-center gap-1.5 text-sm transition-all"
              style={{ color: liked ? "#f43f5e" : "#6b5fa8" }}>
              <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
              <span className="font-semibold">{likes}</span>
            </button>
            <Link to={`/creator/${creator._id}`}
              className="text-sm flex items-center gap-1.5"
              style={{ color: "#6b5fa8" }}>
              <span>💬</span>
              <span>Commenter</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}