import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Server, Save, CheckCircle2 } from 'lucide-react';
import { SettingsDTO } from '../shared/ipc';

const Settings = () => {
   const [serverUrl, setServerUrl] = useState('');
   const [syncId, setSyncId] = useState('');
   const [isSyncing, setIsSyncing] = useState(false);
   const [lastSync, setLastSync] = useState<string | null>(null);
   const [showSavedFeedback, setShowSavedFeedback] = useState(false);

   useEffect(() => {
      const loadSettings = async () => {
         try {
            const settings = await window.electronAPI.getSettings();
            console.log("Settings loaded", settings);
            if (settings) {
               setServerUrl(settings.serverUrl || '');
               setSyncId(settings.syncId || '');
            }
         } catch (error) {
            console.error("Error loading settings", error);
         }
      };

      loadSettings();
   }, []);

   useEffect(() => {
      const autoPopulate = async () => {
         if (syncId.length >= 3) {
            try {
               // Defensive check for the API bridge
               if (!window.electronAPI.getSettingsBySyncId) {
                  console.warn("getSettingsBySyncId API not available in this build yet");
                  return;
               }

               const saved = await window.electronAPI.getSettingsBySyncId(syncId);
               if (saved && saved.serverUrl && !serverUrl) {
                  setServerUrl(saved.serverUrl);
                  console.log("Auto-populated URL for", syncId);
               }
            } catch (e) {
               console.error("Auto-populate error", e);
            }
         }
      };

      const timer = setTimeout(autoPopulate, 500);
      return () => clearTimeout(timer);
   }, [syncId]);

   const handleSave = async () => {
      console.log("Saving settings", { serverUrl, syncId });
      try {
         await window.electronAPI.updateSettings({ serverUrl, syncId });
         setShowSavedFeedback(true);
         setTimeout(() => setShowSavedFeedback(false), 3000);
      } catch (error) {
         console.error("Error saving settings", error);
      }
   };

   const handleSync = async () => {
      console.log("Syncing settings", { serverUrl, syncId });
      setIsSyncing(true);
      try {
         const result = await window.electronAPI.syncData(serverUrl, syncId);
         if (result.success) {
            setLastSync(`Last sync: ${new Date().toLocaleTimeString()}`);
         } else {
            setLastSync("Sync failed: " + result.error);
         }
      } catch (error) {
         console.error("Sync error", error);
         setLastSync("Sync error: check connection");
      } finally {
         setIsSyncing(false);
      }
   };

   return (
      <div className="w-full h-full max-w-2xl mx-auto flex items-center justify-center p-4">
         <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase top-11 z-10 justify-center items-center left-1/2 transform -translate-x-1/2 w-full">
            <h2 className="text-3xl font-light tracking-widest uppercase">Settings</h2>
         </div>

         <div className="bg-white/5 p-8 rounded-3xl w-full border border-white/10 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                     <Server size={14} className="text-primary" /> Backend Server URL
                  </label>
                  <input
                     type="text"
                     placeholder="https://your-api.com"
                     value={serverUrl}
                     onChange={(e) => setServerUrl(e.target.value)}
                     className="w-full bg-black/40 border border-white/5 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all placeholder:text-gray-600"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                     Sync ID (User Identifier)
                  </label>
                  <input
                     type="text"
                     placeholder="Your unique ID"
                     value={syncId}
                     onChange={(e) => setSyncId(e.target.value)}
                     className="w-full bg-black/40 border border-white/5 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all placeholder:text-gray-600"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 italic">Used to coordinate alarms across devices.</p>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button
                  onClick={handleSave}
                  className="flex-1 bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 group border border-white/5"
               >
                  <Save size={18} className="group-hover:scale-110 transition-transform" /> 
                  <span className="font-medium">Save Settings</span>
               </button>
               <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex-1 bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
               >
                  <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                  <span className="font-medium">{isSyncing ? "Syncing..." : "Sync Now"}</span>
               </button>
            </div>

            <AnimatePresence>
               {(lastSync || showSavedFeedback) && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="flex flex-col items-center gap-2"
                  >
                     {showSavedFeedback && (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                           <CheckCircle2 size={16} /> Settings saved successfully
                        </div>
                     )}
                     {lastSync && (
                        <div className={`text-xs ${lastSync.startsWith('Sync failed') ? 'text-red-400' : 'text-gray-500'}`}>
                           {lastSync}
                        </div>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
};

export default Settings;
