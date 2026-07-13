import { motion } from 'framer-motion';

interface HeaderProps {
  score: number;
  weight: number;
}

export function Header({ score, weight }: HeaderProps) {
  const date = new Date();
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
      className="pt-10 pb-6 flex justify-between items-center"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Today</h1>
        <p className="text-apple-blue font-medium mt-1">
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>
      <div className="flex gap-3">
        <div className="bg-apple-lightGray/80 backdrop-blur-md px-3 py-1.5 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-sm">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Score</span>
          <span className="text-apple-green font-bold text-sm">{score}</span>
        </div>
        <div className="bg-apple-lightGray/80 backdrop-blur-md px-3 py-1.5 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-sm">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Weight</span>
          <span className="text-white font-bold text-sm">{weight}kg</span>
        </div>
      </div>
    </motion.header>
  );
}
