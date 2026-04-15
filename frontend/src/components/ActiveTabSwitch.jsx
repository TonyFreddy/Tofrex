import { useChatStore } from "../store/useChatStore";

const tabs = [
  {
    key: "chats",
    label: "Chats",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#a78bfa" : "rgba(255,255,255,0.35)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 15, height: 15, transition: "stroke 0.2s" }}
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#a78bfa" : "rgba(255,255,255,0.35)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 15, height: 15, transition: "stroke 0.2s" }}
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-2 px-4 py-3">
      {tabs.map(({ key, label, icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              color: active ? "#e8e0ff" : "rgba(255,255,255,0.35)",
              background: active ? "rgba(124,58,237,0.15)" : "transparent",
              border: active
                ? "1px solid rgba(124,58,237,0.35)"
                : "1px solid transparent",
            }}
          >
            {icon(active)}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default ActiveTabSwitch;