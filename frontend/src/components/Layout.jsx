import Sidebar   from "./Sidebar";
import MobileNav from "./MobileNav";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#0a0617" }}>
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}