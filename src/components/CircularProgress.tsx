

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bg?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 10, 
  color = "#4ade80", 
  bg = "#1a1e28", 
  label, 
  sublabel 
}: CircularProgressProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;
  const cx = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={bg} strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {label && <span style={{ fontSize: size * 0.16, fontWeight: 700, color: "#f0f2f5", lineHeight: 1 }} className="font-mono">{label}</span>}
        {sublabel && <span style={{ fontSize: size * 0.1, color: "#6b7585", marginTop: 2 }}>{sublabel}</span>}
      </div>
    </div>
  );
}
