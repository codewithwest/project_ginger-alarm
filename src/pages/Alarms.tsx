import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Volume2, Save, Pencil, Play, Square, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Alarms = () => {
   const [alarms, setAlarms] = useState<any[]>([]);
   const [newTime, setNewTime] = useState('07:00');
   const [newLabel, setNewLabel] = useState('Wake up');
   const [newSound, setNewSound] = useState('alarm.mp3');
   const [editingId, setEditingId] = useState<number | null>(null);
   const [fileMissing, setFileMissing] = useState(false);

   const [showForm, setShowForm] = useState(false);
   const [availableSounds, setAvailableSounds] = useState<{ label: string; value: string }[]>([]);
   const [showSoundPicker, setShowSoundPicker] = useState(false);
   const [previewingSound, setPreviewingSound] = useState<string | null>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);

   useEffect(() => {
      loadAlarms();
      loadSounds();
      if (Notification.permission !== 'granted') {
         Notification.requestPermission();
      }
   }, []);

   // Alarm triggering extracted to Global AlarmManager

   const loadAlarms = async () => {
      const data = await window.electronAPI.getAlarms();
      setAlarms(data);
   };

   const handleSave = async () => {
      if (!newTime) return;

      if (editingId) {
         await window.electronAPI.updateAlarm(editingId, newTime, newLabel, newSound);
      } else {
         await window.electronAPI.addAlarm(newTime, newLabel, newSound);
      }

      loadAlarms();
      resetForm();
   };

   const startEdit = async (alarm: any) => {
      setNewTime(alarm.time);
      setNewLabel(alarm.label);
      setNewSound(alarm.sound || 'alarm.mp3');
      setEditingId(alarm.id);
      setShowForm(true);

      if (alarm.sound && alarm.sound.startsWith('/')) {
         const exists = await window.electronAPI.checkFileExists(alarm.sound);
         setFileMissing(!exists);
      } else {
         setFileMissing(false);
      }
   };

   const resetForm = () => {
      setNewTime('07:00');
      setNewLabel('Wake up');
      setNewSound('alarm.mp3');
      setEditingId(null);
      setShowForm(false);
      setFileMissing(false);
   };

   const handleDelete = async (id: number) => {
      await window.electronAPI.deleteAlarm(id);
      loadAlarms();
      if (editingId === id) resetForm();
   };

   const handleToggle = async (id: number, active: boolean) => {
      await window.electronAPI.toggleAlarm(id, active ? 1 : 0);
      loadAlarms();
   };

   const loadSounds = async () => {
      const sounds = await window.electronAPI.getGingerAlarmSounds();
      setAvailableSounds(sounds);
   };

   const togglePreview = (soundValue: string | null) => {
      if (!soundValue || previewingSound === soundValue) {
         if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
         }
         setPreviewingSound(null);
      } else {
         setPreviewingSound(soundValue);
         if (audioRef.current) {
            audioRef.current.src = `./sounds/${soundValue}`;
            audioRef.current.play();
         }
      }
   };

   return (
      <div className="no-scrollbar w-full max-w-5xl mx-auto h-full overflow-hidden">
         <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase top-11 z-10 flex justify-center items-center left-1/2 transform -translate-x-1/2 space-x-4 items-center mb-8 px-4 w-full">
            <h2 className="text-3xl font-light tracking-widest uppercase">Alarms</h2>
            {!showForm && (
               <button
                  onClick={() => { resetForm(); setShowForm(true); }}
                  className="bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-primary/50 transition-all active:scale-95"
               >
                  <Plus size={24} />
               </button>
            )}
         </div>

         {showForm && (
            <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-4 mb-8 overflow-hidden"
            >
               <h4 className="text-sm font-medium text-gray-400">{editingId ? 'Edit Alarm' : 'New Alarm'}</h4>
               <div className="flex gap-4 items-end">
                  <div className="flex-1">
                     <label className="text-xs text-gray-400 block mb-1">Time</label>
                     <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full bg-black/20 rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary h-10" />
                  </div>
                  <div className="flex-[2]">
                     <label className="text-xs text-gray-400 block mb-1">Label</label>
                     <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="w-full bg-black/20 rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary h-10" />
                  </div>
               </div>

               <div className="flex gap-4 items-end">
                  <div className="flex-1">
                     <label className="text-xs text-gray-400 block mb-1">Sound</label>
                     <div className="flex gap-2">
                        <button
                           onClick={() => setShowSoundPicker(true)}
                           className="flex-1 bg-black/20 rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary h-10 text-white text-left px-3 hover:bg-black/30 transition-colors flex items-center justify-between"
                        >
                           <span className="truncate">
                              {newSound.startsWith('/') ? 'External File' : availableSounds.find(s => s.value === newSound)?.label || newSound}
                           </span>
                           <Volume2 size={16} className="text-gray-400" />
                        </button>
                        <button
                           onClick={async () => {
                              try {
                                 const file = await window.electronAPI.selectAudioFile();
                                 if (file) {
                                    setNewSound(file);
                                    setFileMissing(false);
                                 }
                              } catch (err) {
                                 console.error("Browse failed:", err);
                              }
                           }}
                           className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-sm truncate max-w-[100px] flex items-center justify-center transition-colors"
                           title={newSound.startsWith('/') ? newSound : "BrowseExternal"}
                        >
                           {newSound.startsWith('/') ? '...' + newSound.slice(-10) : 'Browse'}
                        </button>
                     </div>
                     {fileMissing && <span className="text-red-500 text-[10px] mt-1 block">⚠️ File not found: {newSound}</span>}
                  </div>

                  <button onClick={handleSave} className="bg-primary hover:bg-indigo-500 text-white p-2 rounded-lg h-10 px-4 flex items-center justify-center gap-2 transition-colors">
                     {editingId ? <Save size={18} /> : <Plus size={20} />}
                     {editingId ? 'Update' : 'Add'}
                  </button>
                  <button onClick={resetForm} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg h-10 px-4 flex items-center justify-center transition-colors">
                     Cancel
                  </button>
               </div>
            </motion.div>
         )}

         <div className="no-scrollbar mt-10 space-y-2 h-full overflow-y-scroll scrollbar-thin pr-1">
            {alarms.map((alarm) => (
               <motion.div
                  key={alarm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors ${editingId === alarm.id ? 'border-primary ring-1 ring-primary' : ''}`}
               >
                  <div>
                     <div className="text-4xl font-light">{alarm.time}</div>
                     <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <span>{alarm.label}</span>
                        {alarm.sound && <Volume2 size={12} className="opacity-70" />}
                     </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                     <label className="relative inline-flex items-center cursor-pointer mr-2">
                        <input
                           type="checkbox"
                           checked={!!alarm.active}
                           onChange={(e) => handleToggle(alarm.id, e.target.checked)}
                           className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                     </label>
                     <button onClick={() => startEdit(alarm)} className="text-gray-500 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Pencil size={18} />
                     </button>
                     <button onClick={() => handleDelete(alarm.id)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={20} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>

         {showSoundPicker && (
            <SoundPicker
               sounds={availableSounds}
               selectedSound={newSound}
               onSelect={(sound: string) => {
                  setNewSound(sound);
                  setShowSoundPicker(false);
                  togglePreview(null); // Stop sound on select
                  setFileMissing(false);
               }}
               onClose={() => {
                  setShowSoundPicker(false);
                  togglePreview(null); // Stop sound on close
               }}
               previewingSound={previewingSound}
               onTogglePreview={togglePreview}
            />
         )}

         <audio ref={audioRef} onEnded={() => setPreviewingSound(null)} />
      </div>
   );
};

const SoundPicker = ({
   sounds, selectedSound, onSelect, onClose, previewingSound, onTogglePreview
}: any) => {
   const [page, setPage] = useState(0);
   const itemsPerPage = 8;
   const totalPages = Math.ceil(sounds.length / itemsPerPage);
   const currentPageSounds = sounds.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

   // Safety reset if page is out of bounds (e.g. sounds filtered)
   useEffect(() => {
      if (page >= totalPages && totalPages > 0) {
         setPage(totalPages - 1);
      }
   }, [sounds.length, totalPages, page]);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
         />
         <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-3xl p-6 relative overflow-hidden shadow-2xl"
         >
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-light tracking-widest uppercase">Select Sound</h3>
               <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X size={20} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 min-h-[224px]">
               {currentPageSounds.map((sound: any) => (
                  <div
                     key={sound.value}
                     onClick={() => onSelect(sound.value)}
                     className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group 
                        ${selectedSound === sound.value ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                           'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                  >
                     <span className="text-sm font-medium truncate pr-8">{sound.label}</span>
                     <button
                        type="button"
                        onClick={(e) => {
                           e.stopPropagation();
                           onTogglePreview(sound.value);
                        }}
                        className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${previewingSound === sound.value ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-white/10 text-gray-400 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white'}`}
                     >
                        {previewingSound === sound.value ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                     </button>
                     <div className="text-[10px] text-gray-500 uppercase tracking-tighter">System Sound</div>
                  </div>
               ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                     <button
                        key={i}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPage(i); }}
                        className="group p-1.5 -m-1.5"
                        title={`Page ${i + 1}`}
                     >
                        <div className={`w-2 h-2 rounded-full transition-all group-hover:bg-white/40 ${page === i ? 'bg-primary w-5' : 'bg-white/20'}`} />
                     </button>
                  ))}
               </div>
               <div className="flex gap-2">
                  <button
                     type="button"
                     disabled={page === 0}
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPage(p => Math.max(0, p - 1)); }}
                     className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button
                     type="button"
                     disabled={page >= totalPages - 1}
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPage(p => Math.min(totalPages - 1, p + 1)); }}
                     className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export default Alarms;
