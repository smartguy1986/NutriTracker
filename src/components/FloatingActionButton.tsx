import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/add-meal')}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-apple-blue to-blue-500 text-white rounded-full px-6 py-4 shadow-[0_8px_30px_rgba(10,132,255,0.4)] flex items-center gap-2 border border-white/10 z-50 backdrop-blur-md"
    >
      <PlusIcon className="w-6 h-6" />
      <span className="font-bold tracking-wide">Add Meal</span>
    </motion.button>
  );
}
