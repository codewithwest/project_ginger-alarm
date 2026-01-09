import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Square, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="fixed h-full inset-0 z-50 flex items-center justify-center p-4">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
            onClick={onClose}
         />
         <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 bg-[#1A1A1A] border border-white/10 w-full max-w-md h-[60%]
            rounded-3xl p-6 overflow-hidden shadow-2xl flex flex-col gap-4"
         >

            <div className="flex items-center justify-between mb-6">
               <div className="flex flex-col">
                  <h3 className="text-xl font-light tracking-widest uppercase text-white">Select Sound</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        Page {page + 1} of {totalPages}
                     </span>
                  </div>
               </div>
               <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
               >
                  <X size={20} />
               </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6 min-h-[224px]">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={page}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -10 }}
                     transition={{ duration: 0.2 }}
                     className="grid grid-cols-2 gap-3 w-full col-span-2"

                  >
                     {currentPageSounds.map((sound) => (
                        <div
                           key={sound.value}
                           onClick={() => onSelect(sound.value)}
                           className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative group 
                              ${selectedSound === sound.value ?
                                 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                                 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                        >
                           <span className="text-sm font-medium truncate pr-8 text-white">{sound.label}</span>
                           <button
                              type="button"
                              data-testid={`play-${sound.value}`}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onTogglePreview(sound.value);
                              }}
                              className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${previewingSound === sound.value ?
                                 'bg-primary text-white scale-110 shadow-lg' :
                                 'bg-white/10 text-gray-400 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white'
                                 }`}
                           >
                              {previewingSound === sound.value ? (
                                 <Square size={12} fill="currentColor" />
                              ) : (
                                 <Play size={12} fill="currentColor" />
                              )}
                           </button>
                           <div className="text-[10px] text-gray-500 uppercase tracking-tighter">System Sound</div>
                        </div>
                     ))}
                  </motion.div>
               </AnimatePresence>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative">
               <div className="flex gap-1 z-10">
                  {Array.from({ length: totalPages }).map((_, i) => {
                     const isActive = page === i;

                     return (
                        <button
                           key={i}
                           type="button"
                           onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPage(i);
                           }}
                           className="p-2 rounded-full"
                           aria-current={isActive ? 'page' : undefined}
                        >
                           <div
                              className={`h-2 rounded-full transition-all duration-300 ${isActive
                                 ? 'bg-green-500 w-6'
                                 : 'bg-white/20 w-2 hover:bg-white/40 hover:px-2 hover:transition-all hover:duration-300 hover:ease-in-out'
                                 }`}
                           />

                        </button>
                     );
                  })}
               </div>

               <div className="absolute right-4 flex gap-2 z-[100000]">
                  <button
                     type="button"
                     data-testid="prev-page"
                     disabled={page === 0}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPage(p => Math.max(0, p - 1));
                     }}
                     className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-white"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button
                     type="button"
                     data-testid="next-page"
                     disabled={page >= totalPages - 1}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPage(p => Math.min(totalPages - 1, p + 1));
                     }}
                     className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-white"
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
