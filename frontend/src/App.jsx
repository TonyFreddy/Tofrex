import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";

import PageLoader          from "./components/PageLoader";
import HomePage            from "./pages/HomePage";
import LoginPage           from "./pages/LoginPage";
import SignUpPage          from "./pages/SignUpPage";
import ChatPage            from "./pages/ChatPage";
import BecomeCreatorPage   from "./pages/BecomeCreatorPage";
import CreatorProfilePage  from "./pages/CreatorProfilePage";
import UploadContentPage   from "./pages/UploadContentPage";

function App() {
  const authUser       = useAuthStore((s) => s.authUser);
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);
  const checkAuth      = useAuthStore((s) => s.checkAuth);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen" style={{ background: "#0a0617" }}>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/login"          element={!authUser ? <LoginPage />          : <Navigate to="/chat" />} />
        <Route path="/signup"         element={!authUser ? <SignUpPage />         : <Navigate to="/chat" />} />
        <Route path="/chat"           element={authUser  ? <ChatPage />           : <Navigate to="/login" />} />
        <Route path="/become-creator" element={authUser  ? <BecomeCreatorPage />  : <Navigate to="/login" />} />
        <Route path="/creator/:creatorId" element={authUser ? <CreatorProfilePage /> : <Navigate to="/login" />} />
        <Route path="/upload"         element={authUser  ? <UploadContentPage />  : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        toastOptions={{
          style: {
            background: "#1a1030",
            color: "#e8e0ff",
            border: "1px solid #2e2250",
          },
        }}
      />
    </div>
  );
}

export default App;