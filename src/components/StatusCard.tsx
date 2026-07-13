import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  colorClass: string;
  delay?: number;
}

export function StatusCard({ title, value, subtitle, icon, colorClass, delay = 0 }: StatusCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, type: 'spring' }}
      whileTap={{ scale: 0.95 }}
      className={`bg-apple-lightGray/60 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-lg flex items-center gap-4 cursor-pointer`}
    >
      <div className={`p-3 rounded-2xl ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{value}</h3>
        <p className="text-gray-400 text-xs font-medium">{title}</p>
        <p className="text-gray-500 text-[10px] mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}
