import { SparklesIcon } from "lucide-react";
 
const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      {/* Image */}
      <img
        src="/message.svg"
        alt="No conversation"
        className="w-48 h-48 object-contain mb-6 opacity-90"
      />
 
      {/* Icon badge */}
      <div className="size-16 bg-violet-500/10 border border-violet-500/25 rounded-full flex items-center justify-center mb-5">
        <SparklesIcon className="size-8 text-violet-400" strokeWidth={1.5} />
      </div>
 
      <h3 className="text-xl font-semibold text-[#f5f0ff] mb-2">
        Select a conversation
      </h3>
      <p className="text-[#7a6e9a] max-w-md text-sm leading-relaxed">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
 
      {/* Decorative pills */}
      <div className="flex gap-3 mt-6">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          ✦ Secure
        </span>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
          Real-time
        </span>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          ✦ Private
        </span>
      </div>
    </div>
  );
};
 
export default NoConversationPlaceholder;