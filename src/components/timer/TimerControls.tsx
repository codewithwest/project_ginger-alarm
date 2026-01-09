import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onToggle, onReset }) => {
  return (
    <div className="flex gap-4 mb-2 shrink-0">
      <button
        onClick={onToggle}
        className={clsx(
          "p-4 rounded-full transition-all active:scale-95 shadow-xl",
          isRunning ? "bg-red-500/80 hover:bg-red-500" : "bg-primary/80 hover:bg-primary"
        )}
      >
        {isRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
      </button>
      <button
        onClick={onReset}
        className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-white"
      >
        <RotateCcw size={28} />
      </button>
    </div>
  );
};

export default TimerControls;
