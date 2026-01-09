import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Square, ChevronLeft, ChevronRight, Music2 } from 'lucide-react';

interface SoundPickerProps {
   sounds: { label: string; value: string }[];
   selectedSound: string;
   onSelect: (sound: string) => void;
   onClose: () => void;
   previewingSound: string | null;
   onTogglePreview: (soundValue: string | null) => void;
   page: number;
   setPage: (page: number | ((p: number) => number)) => void;
}

const SoundPicker = ({
   sounds,
   selectedSound,
   onSelect,
   onClose,
   previewingSound,
   onTogglePreview,
   page,
   setPage
}: SoundPickerProps) => {
   const itemsPerPage = 8;
   const totalPages = Math.max(1, Math.ceil(sounds.length / itemsPerPage));

   // Safety check for out-of-bounds page
   useEffect(() => {
      setPage((p) => Math.min(Math.max(p, 0), totalPages - 1));
   }, [totalPages, setPage]);

   const currentPageSounds = sounds.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

   // Stop sound on unmount
   useEffect(() => {
      return () => {
         onTogglePreview(null);
      };
   }, [onTogglePreview]);

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent backdrop-blur-md z-0"
            onClick={onClose}
         />
         
         <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-[#0F0F0F]/80 border border-white/10 w-full max-w-lg 
            rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-2xl h-[70vh] max-h-[600px]"
         >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-2xl text-primary ring-1 ring-primary/30">
                     <Music2 size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold tracking-tight text-white m-0">Sound Picker</h3>
                     <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold opacity-60">
                        {sounds.length} Sounds Available
                     </p>
                  </div>
               </div>
               <button
                  type="button"
                  onClick={onClose}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white border border-white/5"
               >
                  <X size={20} />
               </button>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-hidden px-8 relative">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={page}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                     className="grid grid-cols-2 gap-4 h-full py-4 content-start items-start"
                  >
                     {currentPageSounds.map((sound) => (
                        <motion.div
                           key={sound.value}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => onSelect(sound.value)}
                           className={`group relative p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-3 h-20 overflow-hidden
                              ${selectedSound === sound.value ?
                                 'bg-primary/20 border-primary ring-1 ring-primary/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]' :
                                 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                        >
                           <div className={`p-2 rounded-xl transition-all ${selectedSound === sound.value ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                              <Music2 size={16} />
                           </div>
                           
                           <div className="flex flex-col flex-1 min-w-0 pr-6">
                              <span className="text-sm font-bold truncate text-white uppercase tracking-tight">{sound.label}</span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">System</span>
                           </div>

                           <button
                              type="button"
                              data-testid={`play-${sound.value}`}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onTogglePreview(sound.value);
                              }}
                              className={`absolute right-4 p-2.5 rounded-2xl transition-all ${previewingSound === sound.value ?
                                 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' :
                                 'bg-white/10 text-gray-500 hover:text-white'
                                 }`}
                           >
                              {previewingSound === sound.value ? (
                                 <Square size={14} fill="currentColor" />
                              ) : (
                                 <Play size={14} fill="currentColor" />
                              )}
                           </button>

                           {selectedSound === sound.value && (
                              <motion.div 
                                 layoutId="active-highlight"
                                 className="absolute left-0 w-1.5 h-8 bg-primary rounded-r-full"
                              />
                           )}
                        </motion.div>
                     ))}
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Footer / Navigation */}
            <div className="p-8 pt-4 flex items-center justify-between border-t border-white/5 bg-black/20">
               <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                     <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        className="py-4 px-1 group"
                        aria-current={page === i ? 'page' : undefined}
                     >
                        <div
                           className={`h-1.5 rounded-full transition-all duration-300 ${page === i
                              ? 'bg-green-500 w-8 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                              : 'bg-white/10 w-2 group-hover:bg-white/30'
                              }`}
                        />
                     </button>
                  ))}
               </div>

               <div className="flex gap-3">
                  <button
                     type="button"
                     data-testid="prev-page"
                     disabled={page === 0}
                     onClick={() => setPage(p => Math.max(0, p - 1))}
                     className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5 text-white shadow-xl active:scale-90"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button
                     type="button"
                     data-testid="next-page"
                     disabled={page >= totalPages - 1}
                     onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                     className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5 text-white shadow-xl active:scale-90"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export default SoundPicker;
