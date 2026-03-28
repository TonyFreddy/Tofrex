import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
 
function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
 
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* Sidebar */}
        <div className="w-80 bg-[#12092a]/70 backdrop-blur-sm flex flex-col border-r border-[#1e1535]">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#2e2250] scrollbar-track-transparent">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>
 
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-[#0f0a1e]/60 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
 
export default ChatPage;