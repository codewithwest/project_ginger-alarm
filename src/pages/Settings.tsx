import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Server, Save } from 'lucide-react';

const Settings = () => {
   const [serverUrl, setServerUrl] = useState('http://localhost:3000');
   const [syncId, setSyncId] = useState('user-default');
   const [isSyncing, setIsSyncing] = useState(false);
   const [lastSync, setLastSync] = useState<string | null>(null);

   useEffect(() => {
      // Load settings from local storage or IPC if you had a settings store
      // For now, we'll just use local state defaults or localStorage
      const savedUrl = localStorage.getItem('serverUrl');
      const savedSyncId = localStorage.getItem('syncId');
      if (savedUrl) setServerUrl(savedUrl);
      if (savedSyncId) setSyncId(savedSyncId);
   }, []);

   const handleSave = () => {
      localStorage.setItem('serverUrl', serverUrl);
      localStorage.setItem('syncId', syncId);
      // Notify main process about settings update if needed
      window.electronAPI.updateSettings(serverUrl, syncId);
   };

   const handleSync = async () => {
      setIsSyncing(true);
      try {
         const result = await window.electronAPI.syncData(serverUrl, syncId);
         if (result.success) {
            setLastSync(new Date().toLocaleTimeString());
         } else {
            console.error("Sync failed", result.error);
         }
      } catch (error) {
         console.error("Sync error", error);
      } finally {
         setIsSyncing(false);
      }
   };

   return (
      <div className="w-full h-full max-w-2xl mx-auto flex items-center justify-center ">
          <div className="absolute flex gap-3 text-3xl font-light tracking-widest uppercase top-11 z-10 flex justify-center items-center left-1/2 transform -translate-x-1/2 space-x-4 items-center mb-8 px-4 w-full">
            <h2 className="text-3xl font-light tracking-widest uppercase">Settings</h2>
           
         </div>

         <div className="bg-white/5 p-6 rounded-2xl w-full border items-center border-white/10 space-y-6 m-auto">
            <div className="space-y-2">
               <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Server size={16} /> Backend Server URL
               </label>
               <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full bg-black/20 rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary text-white"
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm text-gray-400">Sync ID (User Identifier)</label>
               <input
                  type="text"
                  value={syncId}
                  onChange={(e) => setSyncId(e.target.value)}
                  className="w-full bg-black/20 rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary text-white"
               />
            </div>

            <div className="flex gap-4 pt-4">
               <button
                  onClick={handleSave}
                  className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
               >
                  <Save size={18} /> Save Settings
               </button>
               <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex-1 bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
               >
                  <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "Syncing..." : "Sync Now"}
               </button>
            </div>

            {lastSync && (
               <div className="text-center text-xs text-green-400 mt-2">
                  Last successful sync: {lastSync}
               </div>
            )}
         </div>
      </div>
   );
};

export default Settings;
