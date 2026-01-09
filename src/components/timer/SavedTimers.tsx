import React from 'react';
import { motion } from 'framer-motion';
import { PenIcon, Trash2, Plus, Music } from 'lucide-react';

interface SavedTimersProps {
  timers: any[];
  onSelect: (timer: any) => void;
  onEdit: (timer: any) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
  editingId: number | null;
  formatTime: (seconds: number) => string;
  showAddButton: boolean;
}

const SavedTimers: React.FC<SavedTimersProps> = ({ 
  timers, onSelect, onEdit, onDelete, onAddClick, editingId, formatTime, showAddButton 
}) => {
  return (
    <div className="w-full max-w-md px-6 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Saved Sessions</h3>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-xl shadow-lg transition-all active:scale-95 shadow-[0_10px_80px_rgba(239,68,68,0.6)]"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="no-scrollbar grid grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
        {timers.map((timer) => (
     
          <motion.div
            key={timer.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(timer)}
            className={`bg-white/5 hover:bg-white/10 p-4 rounded-2xl 
               flex items-center justify-between group cursor-pointer
               border border-white/5 transition-all ${editingId === timer.id ? 'border-primary ring-1 ring-primary/50' : ''}`}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-bold truncate text-white uppercase tracking-tight">{timer.label}</span>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest opacity-60">
                <span>{formatTime(timer.duration)}</span>
                {timer.sound && (
                  <>
                    <span className="opacity-40">•</span>
                    <Music size={10} className="shrink-0" />
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(timer); }} 
                className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <PenIcon size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(timer.id); }} 
                className="p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SavedTimers;
