import React, { useState, useEffect, useRef, useCallback } from 'react';
import TimerDisplay from '../components/timer/TimerDisplay';
import TimerControls from '../components/timer/TimerControls';
import SavedTimers from '../components/timer/SavedTimers';
import TimerForm from '../components/timer/TimerForm';
import TimerCompletion from '../components/timer/TimerCompletion';

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

   // Sound Picker State
   const [showSoundPicker, setShowSoundPicker] = useState(false);
   const [selectedSound, setSelectedSound] = useState('default.ogg');
   const [sounds, setSounds] = useState<{ label: string; value: string }[]>([]);
   const [previewingSound, setPreviewingSound] = useState<string | null>(null);
   const [soundPickerPage, setSoundPickerPage] = useState(0);

   // Audio Refs (matching Alarms.tsx usage for reliability)
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const ringingAudioRef = useRef<HTMLAudioElement | null>(null);

   // Parity with Alarms.tsx: Use ref for current previewing sound string
   const previewingSoundRef = useRef<string | null>(null);
   useEffect(() => {
      previewingSoundRef.current = previewingSound;
   }, [previewingSound]);

   // Completion & Overtime State
   const [isCompleted, setIsCompleted] = useState(false);
   const [overtimeSeconds, setOvertimeSeconds] = useState(0);

   useEffect(() => {
      loadTimers();
      loadSounds();
   }, []);

   const loadSounds = async () => {
      const availableSounds = await window.electronAPI.getGingerAlarmSounds();
      setSounds(availableSounds || []);
   };

   const loadTimers = async () => {
      const saved = await window.electronAPI.getTimers();
      setTimers(saved);
   };

   const saveTimer = async () => {
      const duration = customMins * 60 + customSecs;
      if (duration > 0) {
         if (editingId) {
            await window.electronAPI.updateTimer(
               editingId, duration, customLabel || `${customMins}m ${customSecs}s`,
               selectedSound 
            );
            if (currentTimerLabel === timers.find(t => t.id === editingId)?.label) {
               setCurrentTimerLabel(customLabel || `${customMins}m ${customSecs}s`);
            }
         } else {
            await window.electronAPI.addTimer(duration, customLabel || `${customMins}m ${customSecs}s`, selectedSound);
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
      setSelectedSound(timer.sound || 'default.ogg');
      setEditingId(timer.id);
      setShowForm(true);
   };

   const resetForm = () => {
      setCustomMins(15);
      setCustomSecs(0);
      setCustomLabel('My Timer');
      setSelectedSound('default.ogg');
      setEditingId(null);
      setShowForm(false);
      setShowSoundPicker(false);
   };

   const deleteTimer = async (id: number) => {
      await window.electronAPI.deleteTimer(id);
      loadTimers();
      if (editingId === id) resetForm();
   };

   const stopRinging = useCallback(() => {
      if (ringingAudioRef.current) {
         ringingAudioRef.current.pause();
         ringingAudioRef.current.currentTime = 0;
      }
   }, []);

   const setCustomTimer = (duration: number, label: string = 'Timer', sound: string = 'default.ogg') => {
      setIsRunning(false);
      setIsCompleted(false);
      setOvertimeSeconds(0);
      stopRinging();
      setInitialTime(duration);
      setTimeLeft(duration);
      setCustomMins(Math.floor(duration / 60));
      setCustomSecs(duration % 60);
      setCurrentTimerLabel(label);
      setSelectedSound(sound);
   };

   const startRinging = useCallback(() => {
      
      if (!ringingAudioRef.current) return;
      ringingAudioRef.current.src = `./sounds/${selectedSound}`;
      ringingAudioRef.current.loop = true;
      ringingAudioRef.current.play().catch((e: any) => console.error("Ringing failed:", e));
   }, [selectedSound]);

   const handleDismiss = () => {
      setIsCompleted(false);
      setOvertimeSeconds(0);
      stopRinging();
      setTimeLeft(initialTime);
      setIsRunning(false);
   };

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning && timeLeft > 0) {
         interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      } else if (isRunning && timeLeft === 0) {
         if (!isCompleted) {
            setIsCompleted(true);
            startRinging();
         }
         interval = setInterval(() => setOvertimeSeconds((os) => os + 1), 1000);
      }
      return () => clearInterval(interval);
   }, [isRunning, timeLeft, isCompleted, startRinging]);

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const formatOvertime = (seconds: number) => {
      return `-${formatTime(seconds)}`;
   };

   // Handle set button click inside the form
   const handleSet = () => {
      setCustomTimer(customMins * 60 + customSecs, customLabel, selectedSound);
      setShowForm(false);
   };

   const togglePreview = useCallback((soundValue: string | null) => {
      const currentPreviewing = previewingSoundRef.current;
      if (!soundValue || currentPreviewing === soundValue) {
         if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
         }
         setPreviewingSound(null);
      } else {
         setPreviewingSound(soundValue);
         if (audioRef.current) {
            audioRef.current.src = `./sounds/${soundValue}`;
            audioRef.current.play().catch((e: any) => console.error("Preview failed:", e));
         }
      }
   }, []);

   // Cleanup audio on unmount
   useEffect(() => {
      return () => {
         if (audioRef.current) audioRef.current.pause();
         if (ringingAudioRef.current) ringingAudioRef.current.pause();
      };
   }, []);

   return (
      <div className="w-full h-full flex flex-col items-center scrollbar-width-none overflow-y-auto no-scrollbar">
         <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase top-11 z-10 flex justify-center 
         items-center left-1/2 transform -translate-x-1/2 space-x-4 items-center mb-8 px-4 w-full">
            <h2 className="text-3xl font-light tracking-widest uppercase">Timer</h2>
         </div>

         <TimerDisplay 
            timeLeft={timeLeft} 
            initialTime={initialTime} 
            label={currentTimerLabel} 
            formatTime={formatTime} 
         />

         <TimerControls 
            isRunning={isRunning} 
            onToggle={() => setIsRunning(!isRunning)} 
            onReset={() => { setIsRunning(false); setTimeLeft(initialTime); }} 
         />

         <SavedTimers 
            timers={timers} 
            onSelect={(t) => setCustomTimer(t.duration, t.label, t.sound)} 
            onEdit={startEdit} 
            onDelete={deleteTimer} 
            onAddClick={() => { resetForm(); setShowForm(true); }} 
            editingId={editingId} 
            formatTime={formatTime} 
            showAddButton={!showForm} 
         />

         <TimerForm 
            show={showForm} 
            onClose={resetForm} 
            editingId={editingId} 
            label={customLabel} 
            setLabel={setCustomLabel} 
            mins={customMins} 
            setMins={setCustomMins} 
            secs={customSecs} 
            setSecs={setCustomSecs} 
            selectedSound={selectedSound} 
            setSelectedSound={setSelectedSound} 
            onSet={handleSet} 
            onSave={saveTimer} 
            onSoundPickerClose={() => togglePreview(null)}
            showSoundPicker={showSoundPicker} 
            setShowSoundPicker={setShowSoundPicker} 
            sounds={sounds} 
            previewingSound={previewingSound} 
            onTogglePreview={togglePreview} 
            soundPickerPage={soundPickerPage} 
            setSoundPickerPage={setSoundPickerPage} 
         />

         <TimerCompletion 
            show={isCompleted} 
            label={currentTimerLabel} 
            overtimeSeconds={overtimeSeconds} 
            formatOvertime={formatOvertime} 
            onDismiss={handleDismiss} 
         />

         {/* Audio Elements for reliable playback */}
         <audio ref={audioRef} onEnded={() => setPreviewingSound(null)} />
         <audio ref={ringingAudioRef} />
      </div>
   );
};

export default Timer;
