import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import { Toaster }   from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";

import PageLoader         from "./components/PageLoader";
import HomePage           from "./pages/HomePage";
import LoginPage          from "./pages/LoginPage";
import SignUpPage         from "./pages/SignUpPage";
import FeedPage           from "./pages/FeedPage";
import ExplorePage        from "./pages/ExplorePage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import BecomeCreatorPage  from "./pages/BecomeCreatorPage";
import UploadContentPage  from "./pages/UploadContentPage";
import SubscriptionsPage  from "./pages/SubscriptionsPage";
import NotificationsPage  from "./pages/NotificationsPage";
import ProfilePage        from "./pages/ProfilePage";
import ChatPage           from "./pages/ChatPage";

function App() {
  const authUser       = useAuthStore((s) => s.authUser);
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);
  const checkAuth      = useAuthStore((s) => s.checkAuth);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  if (isCheckingAuth) return <PageLoader />;

  const P = (el) => authUser ? el : <Navigate to="/login" />;

  return (
    <div className="min-h-screen" style={{ background: "#0a0617" }}>
      <Routes>
        {/* Public */}
        <Route path="/"       element={authUser ? <Navigate to="/feed" /> : <HomePage />} />
        <Route path="/login"  element={!authUser ? <LoginPage />  : <Navigate to="/feed" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/feed" />} />

        {/* Auth requis */}
        <Route path="/feed"               element={P(<FeedPage />)} />
        <Route path="/explore"            element={P(<ExplorePage />)} />
        <Route path="/notifications"      element={P(<NotificationsPage />)} />
        <Route path="/chat"               element={P(<ChatPage />)} />
        <Route path="/subscriptions"      element={P(<SubscriptionsPage />)} />
        <Route path="/profile/:userId"    element={P(<ProfilePage />)} />
        <Route path="/become-creator"     element={P(<BecomeCreatorPage />)} />
        <Route path="/upload"             element={P(<UploadContentPage />)} />
        <Route path="/creator/:creatorId" element={P(<CreatorProfilePage />)} />
      </Routes>

      <Toaster toastOptions={{
        style: { background: "#1a1030", color: "#e8e0ff", border: "1px solid #2e2250" }
      }} />
    </div>
  );
}

export default App;