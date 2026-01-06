import React, { useEffect, useState } from 'react';

const NetworkStatus = () => {
   // 0 = offline, 1 = online (green), 2 = syncing/checking (yellow?) - sticking to red/green for now
   const [isOnline, setIsOnline] = useState(false);

   useEffect(() => {
      const updateStatus = () => setIsOnline(navigator.onLine);

      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);

      // Initial check
      updateStatus();

      // Listen for sync results from main process to confirm "real" connectivity
      // For now, navigator.onLine is a good baseline + "sync-success" could pulse green?
      // Let's keep it simple: Network Connection Status.

      return () => {
         window.removeEventListener('online', updateStatus);
         window.removeEventListener('offline', updateStatus);
      };
   }, []);

   return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
         <span className={`block w-3 h-3 rounded-full shadow-md transition-colors duration-500 ${isOnline ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`} />
         {/* Optional: <span className="text-xs text-white/50">{isOnline ? 'Online' : 'Offline'}</span> */}
      </div>
   );
};

export default NetworkStatus;
