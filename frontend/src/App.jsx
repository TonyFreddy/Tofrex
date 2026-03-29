import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen" style={{ background: "#0a0617" }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
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