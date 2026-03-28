import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "#0a0617" }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
 
      {/* Ambient orb — violet top left */}
      <div className="absolute pointer-events-none"
        style={{
          top: "-10%", left: "-10%",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(109,40,217,0.25) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
 
      {/* Ambient orb — gold bottom right */}
      <div className="absolute pointer-events-none"
        style={{
          bottom: "-10%", right: "-10%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(196,153,42,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
 
      {/* Ambient orb — violet center */}
      <div className="absolute pointer-events-none"
        style={{
          top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
 
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
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