import { motion } from 'framer-motion';

interface NutritionRingProps {
  label: string;
  current: number;
  max: number;
  color: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
}

export function NutritionRing({ 
  label, 
  current, 
  max, 
  color, 
  unit = 'g', 
  size = 80, 
  strokeWidth = 8 
}: NutritionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center">
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
            transition={{ duration: 1.5, ease: "easeOut", type: "spring" }}
            className={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold">{current}</span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-medium mt-2">{label}</span>
      <span className="text-[10px] text-gray-500">{max}{unit}</span>
    </div>
  );
}
