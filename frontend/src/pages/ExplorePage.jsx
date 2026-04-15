import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCreatorStore } from "../store/useCreatorStore";
import Layout from "../components/Layout";

export default function ExplorePage() {
  const { creators, fetchAllCreators, isLoading } = useCreatorStore();
  const [search, setSearch] = useState("");

  useEffect(() => { fetchAllCreators(); }, [fetchAllCreators]);

  const filtered = creators.filter((c) =>
    c.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Explorer</h1>
          <p className="text-sm" style={{ color: "#6b5fa8" }}>Découvre des créateurs de contenu exclusif</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input type="text" placeholder="Rechercher un créateur..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-11 pr-4 py-3 text-white outline-none text-sm"
            style={{ background: "#1a1030", border: "1px solid #2e2250" }} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white font-bold text-xl">Aucun créateur trouvé</p>
            <p className="text-sm mt-2 mb-6" style={{ color: "#6b5fa8" }}>Sois le premier à créer un profil !</p>
            <Link to="/become-creator"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              Devenir créateur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((creator) => {
              const user = creator.userId;
              if (!user) return null;
              return (
                <Link key={creator._id} to={`/creator/${user._id}`}
                  className="rounded-2xl overflow-hidden block transition-all"
                  style={{ background: "#1a1030", border: "1px solid #2e2250" }}
                  onMouseEnter={(e) => e.currentTarget.style.border = "1px solid #7c3aed"}
                  onMouseLeave={(e) => e.currentTarget.style.border = "1px solid #2e2250"}>
                  {/* Cover */}
                  <div className="h-28 w-full"
                    style={{ background: creator.coverImage ? undefined : "linear-gradient(135deg,#2d1b69,#7c3aed)" }}>
                    {creator.coverImage && <img src={creator.coverImage} alt="cover" className="w-full h-full object-cover" />}
                  </div>
                  {/* Info */}
                  <div className="px-4 pb-4 -mt-6">
                    <img src={user.profilePic || "/avatar.png"} alt={user.fullName}
                      className="w-14 h-14 rounded-full border-4 object-cover mb-2"
                      style={{ borderColor: "#1a1030" }} />
                    <p className="font-bold text-white">{user.fullName}</p>
                    {creator.bio && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "#6b5fa8" }}>{creator.bio}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>
                        {creator.monthlyPrice.toLocaleString()} <span className="text-xs font-normal">XOF/mois</span>
                      </span>
                      <span className="text-xs px-3 py-1.5 rounded-full font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                        Voir →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}