// EAST Flower Icon — 8 leaves in a circle
export function EastFlower({
  size = 48,           // outer container size (px)
  radius = 16,         // distance from center to each leaf (px)
  leafSize = 14,       // width/height of each leaf (px)
  leafColor = "var(--h-blue)",   // your existing brand var
  bg = "#FACC15",      // yellow-400
  className = "",
}) {
  const leaves = Array.from({ length: 8 });

  return (
    <div
      className={`relative grid place-items-center rounded-xl shadow-md ${className}`}
      style={{ width: size, height: size, background: bg, animation: "pop 900ms ease-out 1" }}
    >
      {/* center dot (optional) */}
      <div className="rounded-full bg-white/70" style={{ width: 6, height: 6 }} />

      {/* 8 radial leaves */}
      {leaves.map((_, i) => {
        const angle = (i * 360) / leaves.length; // 0..315 in 45° steps
        // Place at center, rotate -> push outwards -> rotate back so the tip points outward
        const transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`;
        return (
          <div
            key={i}
            className="absolute transition-transform duration-200 will-change-transform hover:scale-110"
            style={{
              left: "50%",
              top: "50%",
              transform,
              width: leafSize,
              height: leafSize,
              background: leafColor,
              borderTopLeftRadius: "0.25rem",  // tl-sm
              borderBottomRightRadius: "0.25rem", // br-sm
              borderTopRightRadius: "1.15rem",
              borderBottomLeftRadius: "1.15rem",
              boxShadow: "0 4px 10px -6px rgba(0,0,0,.35)",
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(.94); opacity: .0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
