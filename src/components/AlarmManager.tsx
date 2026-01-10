import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Ban } from "lucide-react";

const AlarmManager = () => {
   const [alarms, setAlarms] = useState<any[]>([]);
   const [ringingAlarm, setRingingAlarm] = useState<any | null>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const duckedAudiosRef = useRef<HTMLAudioElement[]>([]);

   // Load alarms initially and periodically
   useEffect(() => {
      loadAlarms();
      const dbPoll = setInterval(loadAlarms, 2000);
      return () => clearInterval(dbPoll);
   }, []);

   const loadAlarms = async () => {
      const data = await window.electronAPI.getAlarms();
      setAlarms(data);
   };

   // Check alarms every second
   useEffect(() => {
      const interval = setInterval(() => {
         const now = new Date();
         const currentTime = now
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

         if (ringingAlarm) return; // already ringing

         alarms.forEach((alarm) => {
            if (alarm.active && alarm.time === currentTime && now.getSeconds() === 0) {
               triggerAlarm(alarm);
            }
         });
      }, 1000);
      return () => clearInterval(interval);
   }, [alarms, ringingAlarm]);

   // Smooth fade helper
   const fadeAudio = (audio: HTMLAudioElement, from: number, to: number, duration = 300) => {
      const step = 50;
      const delta = (to - from) / (duration / step);
      let volume = from;
      const interval = setInterval(() => {
         volume += delta;
         audio.volume = Math.min(Math.max(volume, 0), 1);
         if ((delta > 0 && volume >= to) || (delta < 0 && volume <= to)) {
            clearInterval(interval);
            audio.volume = to;
         }
      }, step);
   };

   // Start alarm with ducking
   const startAlarm = (soundPath: string) => {
      // Duck other audio elements in the app
      const otherAudios = Array.from(document.querySelectorAll("audio"))
         .filter((a: any) => !a.src.includes(soundPath)) as HTMLAudioElement[];

      duckedAudiosRef.current = otherAudios;
      otherAudios.forEach((a) => fadeAudio(a, a.volume, 0.2, 300));

      // Create alarm audio
      const audio = new Audio(soundPath);
      audio.volume = 0.75;
      audio.loop = true;
      audio.play().catch((e) => console.error("Alarm play error:", e));

      return audio;
   };

   const triggerAlarm = async (alarm: any) => {
      setRingingAlarm(alarm);

      let soundPath = alarm.sound
         ? alarm.sound.startsWith("/")
            ? `file://${alarm.sound}`
            : `/sounds/${alarm.sound}`
         : "/sounds/default.ogg";

      // Check custom file exists
      if (alarm.sound && alarm.sound.startsWith("/")) {
         const exists = await window.electronAPI.checkFileExists(alarm.sound);
         if (!exists) {
            console.warn(`Custom sound missing: ${alarm.sound}. Using default.`);
            soundPath = "/sounds/default.ogg";
         }
      }

      // Stop previous alarm
      if (audioRef.current) {
         audioRef.current.pause();
         audioRef.current.currentTime = 0;
      }

      const audio = startAlarm(soundPath);

      audio.onerror = () => {
         console.error(`Error playing sound: ${soundPath}. Using default.`);
         if (soundPath !== "/sounds/default.ogg") {
            audio.src = "/sounds/default.ogg";
            audio.play();
         }
      };

      audioRef.current = audio;

      // Desktop notification
      if (Notification.permission === "granted") {
         new Notification("ALARM", { body: `${alarm.label || "Alarm"} is ringing!` });
      }
   };

   const stopAlarm = () => {
      // Stop alarm audio
      if (audioRef.current) {
         audioRef.current.pause();
         audioRef.current.currentTime = 0;
      }

      // Restore ducked audio smoothly
      duckedAudiosRef.current.forEach((a) => fadeAudio(a, a.volume, 1, 300));
      duckedAudiosRef.current = [];

      setRingingAlarm(null);
   };

   return (
      <AnimatePresence>
         {ringingAlarm && (
            <motion.div
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.5 }}
               className="inset-0 z-[100] fixed flex items-center justify-center bg-black/60 backdrop-blur-sm scrollbar-width-none"
            >
               <div className="bg-gray-900 border border-t-white/20 border-b-black/40 border-x-white/10 rounded-3xl p-8 w-80 shadow-[0_0_50px_rgba(255,0,0,0.4)] flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 animate-pulse">
                     <Bell size={40} className="text-red-500" />
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">{ringingAlarm.time}</h2>
                  <p className="text-gray-400 mb-8 text-lg">{ringingAlarm.label}</p>

                  <button
                     onClick={stopAlarm}
                     className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-red-500/50 transition-all active:scale-95 flex items-center gap-2"
                  >
                     <Ban size={24} /> STOP
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default AlarmManager;
