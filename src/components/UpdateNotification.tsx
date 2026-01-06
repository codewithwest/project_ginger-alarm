import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';

const UpdateNotification = () => {
   const [updateAvailable, setUpdateAvailable] = useState(false);
   const [updateDownloaded, setUpdateDownloaded] = useState(false);

   useEffect(() => {
      window.electronAPI.onUpdateAvailable(() => {
         setUpdateAvailable(true);
      });

      window.electronAPI.onUpdateDownloaded(() => {
         setUpdateAvailable(false);
         setUpdateDownloaded(true);
      });
   }, []);

   const handleInstall = () => {
      window.electronAPI.installUpdate();
   };

   return (
      <AnimatePresence>
         {updateAvailable && (
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
            >
               <RefreshCw size={18} className="animate-spin" />
               <span className="text-sm font-medium">Downloading update...</span>
            </motion.div>
         )}

         {updateDownloaded && (
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
            >
               <Download size={18} />
               <span className="text-sm font-medium">Update ready!</span>
               <button
                  onClick={handleInstall}
                  className="ml-2 bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-xs font-semibold transition-colors"
               >
                  Install & Restart
               </button>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default UpdateNotification;
