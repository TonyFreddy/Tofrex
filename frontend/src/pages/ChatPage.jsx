import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div
      className="fixed inset-0 w-full flex"
      style={{ background: "#0a0617" }}
    >
      {/* Lueur violette gauche */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Lueur dorée bas-droite */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, rgba(196,153,42,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sidebar */}
      <div className="relative z-10 w-80 bg-[#12092a]/70 backdrop-blur-sm flex flex-col border-r border-[#1e1535]">
        <div className="flex-shrink-0">
          <ProfileHeader />
          <ActiveTabSwitch />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#2e2250] scrollbar-track-transparent">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* Zone chat */}
      <div className="relative z-10 flex-1 flex flex-col bg-[#0f0a1e]/60 backdrop-blur-sm overflow-hidden">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;