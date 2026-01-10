import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

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

   // Calculate lap durations
   const lapDurations = laps.map((lap, i) =>
      i < laps.length - 1 ? lap - laps[i + 1] : lap
   );

   // Fastest lap duration
   const fastestLap = Math.min(...lapDurations);

   const getLapTimeDiff = (lapDuration: number, prevLapDuration: number) => {
      const diff = prevLapDuration - lapDuration; // previous minus current
      if (diff > 0) {
         // current lap is faster → negative split
         return `-${formatTime(diff)}`;
      } else if (diff < 0) {
         // current lap is slower
         return `+${formatTime(Math.abs(diff))}`;
      } else {
         // same duration
         return formatTime(0);
      }
   };

   return (
      <div className="w-full h-full max-w-xl mx-auto flex flex-col items-center">
         <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase 
           top-11 z-10 flex justify-center items-center left-1/2 transform -translate-x-1/2 space-x-4 items-center mb-8 px-4 w-full">
            <h2 className="text-3xl font-light tracking-widest uppercase">Stopwatch</h2>

         </div>
         <div className="text-8xl font-mono font-bold mt-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
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

         <div className="w-full max-h-80 overflow-y-auto no-scrollbar pb-2">
            <AnimatePresence initial={false}  >
               {laps.map((lapTime, index) => {
                  const lapDuration = lapDurations[index];
                  const isFastest = lapDuration === fastestLap;

                  const prevDuration =
                     index < lapDurations.length - 1
                        ? lapDurations[index + 1]
                        : null;

                  return (
                     <motion.div
                        key={lapTime} // IMPORTANT: stable key for animation
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex justify-between items-center p-4 px-6 rounded-xl border ${isFastest
                           ? "bg-green-500/10 border-green-400/30 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
                           : "bg-white/5 border-white/5 mb-1"
                           }`}
                     >
                        {/* Lap label */}
                        <span className="text-gray-400">
                           Lap {laps.length - index}
                        </span>

                        {/* Total time */}
                        <span className="font-mono">
                           {formatTime(lapTime)}
                        </span>

                        {/* Lap duration + diff */}
                        <div className="flex flex-col items-end font-mono">
                           <span
                              className={
                                 isFastest ? "text-green-400 font-semibold" : ""
                              }
                           >
                              {formatTime(lapDuration)}
                           </span>
                           <span>
                              {index < laps.length - 1
                                 ? getLapTimeDiff(lapDurations[index], lapDurations[index + 1])
                                 : formatTime(lapDurations[index])}


                           </span>

                        </div>
                     </motion.div>
                  );
               })}
            </AnimatePresence>
         </div>

      </div >
   );
};

export default Stopwatch;
