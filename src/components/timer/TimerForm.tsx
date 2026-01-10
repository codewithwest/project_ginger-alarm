import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Music, Save } from 'lucide-react';
import SoundPicker from '../SoundPicker';

interface TimerFormProps {
  show: boolean;
  onClose: () => void;
  editingId: number | null;
  label: string;
  setLabel: (val: string) => void;
  mins: number;
  setMins: (val: number) => void;
  secs: number;
  setSecs: (val: number) => void;
  selectedSound: string;
  setSelectedSound: (val: string) => void;
  onSet: () => void;
  onSave: () => void;
  
  // Sound Picker Props
  showSoundPicker: boolean;
  setShowSoundPicker: (val: boolean) => void;
  sounds: any[];
  previewingSound: string | null;
  onTogglePreview: (sound: string | null) => void;
  onSoundPickerClose: () => void;
  soundPickerPage: number;
  setSoundPickerPage: (page: number | ((p: number) => number)) => void;
}

const TimerForm: React.FC<TimerFormProps> = ({
  show, onClose, editingId, label, setLabel, mins, setMins, secs, setSecs, 
  selectedSound, setSelectedSound, onSet, onSave,
  showSoundPicker, setShowSoundPicker, sounds, previewingSound, onTogglePreview, onSoundPickerClose, soundPickerPage, setSoundPickerPage
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-sm bg-[#0F0F0F]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl relative z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white border border-white/5"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h4 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">
                {editingId ? 'Edit Timer' : 'Timer Details'}
              </h4>
              <div className="w-12 h-1 bg-primary/40 mx-auto mt-2 rounded-full" />
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2 mb-1">
                  <Bell size={12} className="text-primary" />Label
                </label>
                <input
                  type="text"
                  value={label}
                  autoFocus
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold uppercase tracking-tight"
                  placeholder="Session Label"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block text-center mb-1">Mins</label>
                  <input
                    type="number"
                    value={mins}
                    onChange={(e) => setMins(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xl font-bold font-mono outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block text-center mb-1">Secs</label>
                  <input
                    type="number"
                    value={secs}
                    onChange={(e) => setSecs(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xl font-bold font-mono outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2 mb-1">
                  <Music size={12} className="text-secondary" />Sound Profile
                </label>
                <button
                  onClick={() => setShowSoundPicker(true)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-sm flex items-center justify-between group transition-all"
                >
                  <span className="text-white font-bold uppercase tracking-tight truncate pr-4">
                    {selectedSound.startsWith('/') 
                      ? 'External File' 
                      : sounds.find(s => s.value === selectedSound)?.label || selectedSound.replace(/\.[^/.]+$/, '')}
                  </span>
                  <div className="p-1.5 bg-secondary/20 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <Music size={14} />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onSet}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-all active:scale-95"
              >
                Preview Only
              </button>
              <button
                onClick={onSave}
                className="flex-1 bg-primary hover:bg-primary/90 p-4 rounded-2xl text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 shadow-2xl shadow-primary/40 transition-all active:scale-95 text-white"
              >
                <Save size={16} /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showSoundPicker && (
        <SoundPicker
          sounds={sounds}
          selectedSound={selectedSound}
          onSelect={(sound) => {
            setSelectedSound(sound);
            setShowSoundPicker(false);
            onSoundPickerClose();
          }}
          onClose={() => {
            setShowSoundPicker(false);
            onSoundPickerClose();
          }}
          previewingSound={previewingSound}
          onTogglePreview={onTogglePreview}
          page={soundPickerPage}
          setPage={setSoundPickerPage}
        />
      )}
    </AnimatePresence>
  );
};

export default TimerForm;
