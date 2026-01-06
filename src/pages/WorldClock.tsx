import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CityClock = ({ city, zone }: { city: string; zone: string }) => {
   const [time, setTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   const localTime = new Date(time.toLocaleString("en-US", { timeZone: zone }));

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         whileHover={{ scale: 1.05, rotateX: 5 }}
         className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square transition-all preserve-3d group"
      >
         <div className="text-4xl font-bold mb-2 group-hover:translate-z-10 transition-transform">
            {localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
         <div className="text-gray-400 group-hover:text-gray-200 group-hover:translate-z-5 transition-transform">{city}</div>
         <div className="text-xs text-gray-500 mt-2">{localTime.toLocaleDateString()}</div>
      </motion.div>
   );
};

const WorldClock = () => {
   return (
      <div className="w-full max-w-4xl mx-auto">
         <h2 className="text-3xl font-light mb-8 text-center tracking-widest uppercase">World Clock</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 opacity-90">
            <CityClock city="New York" zone="America/New_York" />
            <CityClock city="London" zone="Europe/London" />
            <CityClock city="Tokyo" zone="Asia/Tokyo" />
            <CityClock city="Sydney" zone="Australia/Sydney" />
            <CityClock city="Dubai" zone="Asia/Dubai" />
            <CityClock city="Paris" zone="Europe/Paris" />
         </div>
      </div>
   );
};

export default WorldClock;
