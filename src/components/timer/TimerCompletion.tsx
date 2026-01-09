import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface TimerCompletionProps {
  show: boolean;
  label: string;
  overtimeSeconds: number;
  formatOvertime: (seconds: number) => string;
  onDismiss: () => void;
}

const TimerCompletion: React.FC<TimerCompletionProps> = ({ 
  show, label, overtimeSeconds, formatOvertime, onDismiss 
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent backdrop-blur-xl"
          />
           <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            className="relative z-10 bg-red-500/10 border-2 border-red-500/50 p-12 rounded-2xl flex flex-col 
            items-center justify-center gap-6 shadow-[0_0_100px_rgba(239,68,68,0.3)] backdrop-blur-2xl max-w-[380px] w-full"
          >
            <div className="p-6 bg-red-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.6)]">
              <Bell size={48} className="text-white" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Timer Done!</h3>
              <p className="text-red-400 font-bold uppercase tracking-[0.3em] text-xs opacity-80">{label}</p>
            </div>

            <div className="text-7xl font-mono font-black text-white tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {formatOvertime(overtimeSeconds)}
            </div>

            <button
              onClick={onDismiss}
              className="w-full bg-white text-black hover:bg-gray-200 p-5 rounded-full text-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
            >
              Stop
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TimerCompletion;
