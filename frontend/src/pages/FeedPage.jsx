import { useEffect } from "react";
import { Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import Layout   from "../components/Layout";
import PostCard  from "../components/Postcard";
import { useNavigate } from "react-router";

export default function FeedPage() {
  const navigate  = useNavigate();
  const { feed, fetchFeed, isLoading } = useCreatorStore();

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const handleSubscribe = (creatorId) => navigate(`/creator/${creatorId}`);

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Accueil</h1>
          <Link to="/explore"
            className="text-sm px-4 py-2 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            + Explorer
          </Link>
        </div>

        {/* Stories bar (créateurs abonnés) */}
        <div className="mb-6">
          <StoriesBar />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }}>
            <p className="text-5xl mb-4">📭</p>
            <p className="text-white font-bold text-xl mb-2">Ton feed est vide</p>
            <p className="text-sm mb-6" style={{ color: "#6b5fa8" }}>
              Abonne-toi à des créateurs pour voir leur contenu ici
            </p>
            <Link to="/explore"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              Explorer des créateurs →
            </Link>
          </div>
        ) : (
          feed.map((post) => (
            <PostCard key={post._id} post={post} onSubscribe={handleSubscribe} />
          ))
        )}
      </div>
    </Layout>
  );
}

function StoriesBar() {
  const { creators, fetchAllCreators } = useCreatorStore();
  useEffect(() => { fetchAllCreators(); }, [fetchAllCreators]);

  const limited = creators.slice(0, 10);
  if (limited.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
      {limited.map((c) => {
        const user = c.userId;
        if (!user) return null;
        return (
          <Link key={c._id} to={`/creator/${user._id}`}
            className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="p-0.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#7c3aed,#c4992a)" }}>
              <img src={user.profilePic || "/avatar.png"} alt={user.fullName}
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: "#0a0617" }} />
            </div>
            <p className="text-xs font-medium truncate w-16 text-center"
              style={{ color: "#9d8ec7" }}>
              {user.fullName.split(" ")[0]}
            </p>
          </Link>
        );
      })}
    </div>
  );
}