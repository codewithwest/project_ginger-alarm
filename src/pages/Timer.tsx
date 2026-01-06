import React, { useState, useEffect } from 'react';
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
      <div className="w-full h-full flex flex-col items-center">
         {/* Timer Display and Controls (Unchanged) */}
         <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-8 mt-4">
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

         <div className="flex gap-4 mb-8">
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
         <div className="w-full max-w-sm mb-4">
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
               <div className="grid grid-cols-2 gap-3 h-32 overflow-y-auto pr-2 scrollbar-thin">
                  {timers.map((timer) => (
                     <div
                        key={timer.id}
                        onClick={() => setCustomTimer(timer.duration, timer.label)}
                        className={`bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center justify-between group cursor-pointer border border-white/5 transition-colors ${editingId === timer.id ? 'border-primary ring-1 ring-primary' : ''}`}
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
               </div>
            )}
         </div>

         {/* Custom Input Form */}
         {showForm && (
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full max-w-sm bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col gap-4 mb-6 relative"
            >
               <button
                  onClick={resetForm}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
               >
                  <X size={16} />
               </button>

               <h4 className="text-sm font-medium text-center mb-2">{editingId ? 'Edit Timer' : 'Set Custom Timer'}</h4>

               <div className="flex flex-col gap-1 mb-2">
                  <label className="text-xs text-gray-400">Label</label>
                  <input
                     type="text"
                     value={customLabel}
                     onChange={(e) => setCustomLabel(e.target.value)}
                     className="bg-black/40 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-secondary"
                     placeholder="Timer Name"
                  />
               </div>

               <div className="flex items-end justify-center gap-2">
                  <div className="flex flex-col">
                     <label className="text-xs text-gray-400 mb-1">Min</label>
                     <input
                        type="number"
                        value={customMins}
                        onChange={(e) => setCustomMins(parseInt(e.target.value) || 0)}
                        className="bg-black/40 rounded-lg p-2 text-center w-20 outline-none focus:ring-1 focus:ring-secondary"
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-xs text-gray-400 mb-1">Sec</label>
                     <input
                        type="number"
                        value={customSecs}
                        onChange={(e) => setCustomSecs(parseInt(e.target.value) || 0)}
                        className="bg-black/40 rounded-lg p-2 text-center w-20 outline-none focus:ring-1 focus:ring-secondary"
                     />
                  </div>
               </div>

               <div className="flex gap-2 mt-2">
                  <button
                     onClick={handleSet}
                     className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-sm"
                  >
                     Set Only
                  </button>
                  <button
                     onClick={saveTimer}
                     className="flex-1 bg-secondary/80 hover:bg-secondary p-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                     <Save size={16} /> {editingId ? 'Update' : 'Save'}
                  </button>
               </div>
            </motion.div>
         )}
      </div>
   );
};

export default Timer;

