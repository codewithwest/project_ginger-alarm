import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Save, Trash2, Plus, X, PenIcon } from 'lucide-react';
import clsx from 'clsx';

const Timer = () => {
   const [timeLeft, setTimeLeft] = useState(15 * 60);
   const [initialTime, setInitialTime] = useState(15 * 60);
   const [isRunning, setIsRunning] = useState(false);
   const [customMins, setCustomMins] = useState(15);
   const [customSecs, setCustomSecs] = useState(0);
   const [timers, setTimers] = useState<any[]>([]);
   const [showForm, setShowForm] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);

   const [customLabel, setCustomLabel] = useState('My Timer');
   const [currentTimerLabel, setCurrentTimerLabel] = useState('Timer');

   useEffect(() => {
      loadTimers();
   }, []);

   const loadTimers = async () => {
      const saved = await window.electronAPI.getTimers();
      setTimers(saved);
   };

   const saveTimer = async () => {
      const duration = customMins * 60 + customSecs;
      if (duration > 0) {
         if (editingId) {
            await window.electronAPI.updateTimer(editingId, duration, customLabel || `${customMins}m ${customSecs}s`);
            // If we are editing the currently active timer, update the label immediately
            if (currentTimerLabel === timers.find(t => t.id === editingId)?.label) {
               setCurrentTimerLabel(customLabel || `${customMins}m ${customSecs}s`);
            }
         } else {
            await window.electronAPI.addTimer(duration, customLabel || `${customMins}m ${customSecs}s`);
         }
         loadTimers();
         resetForm();
      }
   };

   const startEdit = (timer: any) => {
      const mins = Math.floor(timer.duration / 60);
      const secs = timer.duration % 60;
      setCustomMins(mins);
      setCustomSecs(secs);
      setCustomLabel(timer.label);
      setEditingId(timer.id);
      setShowForm(true);
   };

   const resetForm = () => {
      setCustomMins(15);
      setCustomSecs(0);
      setCustomLabel('My Timer');
      setEditingId(null);
      setShowForm(false);
   };

   const deleteTimer = async (id: number) => {
      await window.electronAPI.deleteTimer(id);
      loadTimers();
      if (editingId === id) resetForm();
   };

   const setCustomTimer = (duration: number, label: string = 'Timer') => {
      setIsRunning(false);
      setInitialTime(duration);
      setTimeLeft(duration);
      setCustomMins(Math.floor(duration / 60));
      setCustomSecs(duration % 60);
      setCurrentTimerLabel(label);
   };

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning && timeLeft > 0) {
         interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      } else if (timeLeft === 0) {
         setIsRunning(false);
      }
      return () => clearInterval(interval);
   }, [isRunning, timeLeft]);

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const progress = (timeLeft / initialTime) * 100;

   // Handle set button click inside the form
   const handleSet = () => {
      setCustomTimer(customMins * 60 + customSecs, customLabel);
      setShowForm(false);
   };

   return (
      <div className="w-full h-full flex flex-col items-center scrollbar-width-none">
           <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase top-11 z-10 flex justify-center items-center left-1/2 transform -translate-x-1/2 space-x-4 items-center mb-8 px-4 w-full">
                     <h2 className="text-3xl font-light tracking-widest uppercase">Timer</h2>
                  </div>
         {/* Timer Display and Controls */}
         <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-2 mt-4">
            {/* ... SVG content ... */}
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
            <div className="text-sm text-gray-400 mt-2 z-10 uppercase tracking-widest">{currentTimerLabel}</div>
         </div>

         <div className="flex gap-4 mb-2">
            <button
               onClick={() => setIsRunning(!isRunning)}
               className={clsx(
                  "p-4 rounded-full transition-all active:scale-95 shadow-xl",
                  isRunning ? "bg-red-500/80 hover:bg-red-500" : "bg-primary/80 hover:bg-primary"
               )}
            >
               {isRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>
            <button
               onClick={() => { setIsRunning(false); setTimeLeft(initialTime); }}
               className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-white"
            >
               <RotateCcw size={28} />
            </button>
         </div>

         {/* Saved Timers & Add Button */}
         <div className="w-full max-w-sm mb-2">
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Saved Timers</h3>
               {!showForm && (
                  <button
                     onClick={() => { resetForm(); setShowForm(true); }}
                     className="bg-primary/80 hover:bg-primary text-white p-2 rounded-full shadow-lg hover:shadow-primary/50 transition-all active:scale-95 flex items-center justify-center"
                  >
                     <Plus size={20} />
                  </button>
               )}
            </div>

            {!showForm && (
               <div className=" no-scrollbar grid grid-cols-2 gap-3 
               h-34 overflow-y-auto pr-2 scrollbar-thin 
               shadow-[inset_0px_-7px_10px_-12px_rgba(255,0,0,0.5)]


               ">
                  {timers.map((timer) => (
                     <div
                        key={timer.id}
                        onClick={() => setCustomTimer(timer.duration, timer.label)}
                        className={`bg-white/5 hover:bg-white/10 p-2 rounded-lg 
                           flex items-center justify-between group cursor-pointer
                           h-[1/2]
                           border border-white/5 transition-colors ${editingId === timer.id ? 'border-primary ring-1 ring-primary' : ''}`}
                     >
                        <div className="flex flex-col gap-2">
                           <span className="flex-1 text-sm">{timer.label}</span>
                           <span className="text-xs text-gray-400">{formatTime(timer.duration)}</span>
                        </div>
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                           {/* Explicit Edit Icon */}
                           <button onClick={(e) => { e.stopPropagation(); startEdit(timer); }} className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity">
                              <PenIcon size={14} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); deleteTimer(timer.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                  ))}
                  {/* <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t 
                  from-gray-200 to-transparent pointer-events-none"></div> */}
               </div>
            )}
         </div>

         {/* Custom Input Form - Modal Design */}
         <AnimatePresence>
            {showForm && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={resetForm}
                     className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     className="w-full max-w-sm bg-gray-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-2xl relative z-10"
                  >
                     <button
                        onClick={resetForm}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                     >
                        <X size={20} />
                     </button>

                     <h4 className="text-lg font-bold text-center mb-2 tracking-tight">
                        {editingId ? 'Edit Timer' : 'Set Custom Timer'}
                     </h4>

                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Label</label>
                        <input
                           type="text"
                           value={customLabel}
                           autoFocus
                           onChange={(e) => setCustomLabel(e.target.value)}
                           className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                           placeholder="Timer Name"
                        />
                     </div>

                     <div className="flex items-end justify-center gap-4 py-2">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold text-center">Min</label>
                           <input
                              type="number"
                              value={customMins}
                              onChange={(e) => setCustomMins(parseInt(e.target.value) || 0)}
                              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center w-24 text-lg font-mono outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                           />
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold text-center">Sec</label>
                           <input
                              type="number"
                              value={customSecs}
                              onChange={(e) => setCustomSecs(parseInt(e.target.value) || 0)}
                              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center w-24 text-lg font-mono outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                           />
                        </div>
                     </div>

                     <div className="flex gap-3 mt-4">
                        <button
                           onClick={handleSet}
                           className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                        >
                           Set Only
                        </button>
                        <button
                           onClick={saveTimer}
                           className="flex-1 bg-primary hover:bg-primary/90 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                           <Save size={18} /> {editingId ? 'Update' : 'Save'}
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default Timer;

