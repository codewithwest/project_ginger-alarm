import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import clsx from 'clsx';

const Stopwatch = () => {
   const [time, setTime] = useState(0);
   const [isRunning, setIsRunning] = useState(false);
   const [laps, setLaps] = useState<number[]>([]);

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning) {
         interval = setInterval(() => setTime((t) => t + 10), 10);
      }
      return () => clearInterval(interval);
   }, [isRunning]);

   const formatTime = (ms: number) => {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      const cent = Math.floor((ms % 1000) / 10);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
   };

   const handleLap = () => {
      setLaps([time, ...laps]);
   };

   return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
         <div className="text-8xl font-mono font-bold mb-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {formatTime(time)}
         </div>

         <div className="flex gap-4 mb-8">
            <button
               onClick={() => setIsRunning(!isRunning)}
               className={clsx(
                  "w-16 h-16 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-lg",
                  isRunning ? "bg-red-500/80 hover:bg-red-500" : "bg-green-500/80 hover:bg-green-500"
               )}
            >
               {isRunning ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
            </button>

            <button
               onClick={handleLap}
               disabled={!isRunning}
               className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-all active:scale-95"
            >
               <Flag />
            </button>

            <button
               onClick={() => { setIsRunning(false); setTime(0); setLaps([]); }}
               className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
            >
               <RotateCcw />
            </button>
         </div>

         <div className="w-full max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
            {laps.map((lapTime, index) => (
               <div key={index} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5 px-6">
                  <span className="text-gray-400">Lap {laps.length - index}</span>
                  <span className="font-mono">{formatTime(lapTime)}</span>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Stopwatch;
