import React from 'react';

interface TimerDisplayProps {
  timeLeft: number;
  initialTime: number;
  label: string;
  formatTime: (seconds: number) => string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, initialTime, label, formatTime }) => {
  const progress = (timeLeft / initialTime) * 100;

  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-2 mt-4 shrink-0">
      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
      <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-secondary transition-all duration-1000"
          strokeDasharray="754"
          strokeDashoffset={754 - (754 * progress) / 100}
        />
      </svg>
      <div className="text-6xl font-mono font-bold tracking-tighter drop-shadow-2xl z-10">
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm text-gray-400 mt-2 z-10 uppercase tracking-widest">{label}</div>
    </div>
  );
};

export default TimerDisplay;
