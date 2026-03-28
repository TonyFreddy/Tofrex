
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full flex overflow-hidden rounded-3xl relative"
      style={{
        background: "rgba(15, 10, 30, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 0 80px rgba(124, 58, 237, 0.15), 0 0 40px rgba(196, 153, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "10%",
        right: "10%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), rgba(196, 153, 42, 0.4), transparent)",
        borderRadius: "999px",
      }} />
 
      {children}
    </div>
  );
}
 
export default BorderAnimatedContainer;
