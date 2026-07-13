import { motion } from 'framer-motion';

interface CalorieRingProps {
  current: number;
  max: number;
}

export function CalorieRing({ current, max }: CalorieRingProps) {
  const size = 240;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            className="text-white/10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "circOut" }}
            className="text-brand-cyan"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ filter: 'drop-shadow(0px 0px 12px #00F0FF)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs tracking-[0.2em] text-brand-gray uppercase mb-1">Consumed</span>
          <span className="text-5xl font-bold tracking-tighter text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{current}</span>
          <span className="text-xs tracking-widest text-brand-cyan mt-1" style={{ textShadow: '0 0 8px #00F0FF' }}>/ {max} KCAL</span>
        </div>
      </div>
    </div>
  );
}
