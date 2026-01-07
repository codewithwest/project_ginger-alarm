import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Search, Globe2 } from 'lucide-react';
import { timezoneData, getTimezoneWithOffset } from '../utils/timezoneData';

const CityClock = ({ city, zone, onDelete }: { city: string; zone: string; onDelete?: () => void }) => {
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
         className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square transition-all preserve-3d group relative"
      >
         {onDelete && (
            <button
               onClick={onDelete}
               className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
            >
               <Trash2 size={16} />
            </button>
         )}
         <div className="text-4xl font-bold mb-2 group-hover:translate-z-10 transition-transform">
            {localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
         <div className="text-gray-400 group-hover:text-gray-200 group-hover:translate-z-5 transition-transform">{city}</div>
         <div className="text-xs text-gray-500 mt-2">{localTime.toLocaleDateString()}</div>
      </motion.div>
   );
};

const WorldClock = () => {
   const [clocks, setClocks] = useState<any[]>([]);
   const [showForm, setShowForm] = useState(false);
   const [newCity, setNewCity] = useState('');
   const [newZone, setNewZone] = useState('');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedRegion, setSelectedRegion] = useState<string>('America');

   // Load clocks from database
   useEffect(() => {
      loadClocks();
   }, []);

   const loadClocks = async () => {
      const saved = await window.electronAPI.getWorldClocks();

      // If no clocks saved, initialize with defaults
      if (saved.length === 0) {
         const defaults = [
            { city: 'New York', timezone: 'America/New_York', removable: 0 },
            { city: 'London', timezone: 'Europe/London', removable: 0 },
            { city: 'Tokyo', timezone: 'Asia/Tokyo', removable: 0 },
            { city: 'Sydney', timezone: 'Australia/Sydney', removable: 0 },
            { city: 'Dubai', timezone: 'Asia/Dubai', removable: 0 },
            { city: 'Paris', timezone: 'Europe/Paris', removable: 0 }
         ];

         for (const clock of defaults) {
            await window.electronAPI.addWorldClock(clock.city, clock.timezone, clock.removable);
         }

         loadClocks(); // Reload to get IDs
      } else {
         setClocks(saved);
      }
   };

   const addClock = async () => {
      if (newCity && newZone) {
         try {
            // Test if timezone is valid
            new Date().toLocaleString("en-US", { timeZone: newZone });

            await window.electronAPI.addWorldClock(newCity, newZone, 1);
            loadClocks();

            setNewCity('');
            setNewZone('');
            setSearchTerm('');
            setShowForm(false);
         } catch (e) {
            alert('Invalid timezone selection');
         }
      }
   };

   const removeClock = async (id: number) => {
      await window.electronAPI.deleteWorldClock(id);
      loadClocks();
   };

   const filteredTimezones = timezoneData[selectedRegion as keyof typeof timezoneData]?.filter(tz =>
      tz.toLowerCase().includes(searchTerm.toLowerCase())
   ) || [];

   const handleTimezoneSelect = (timezone: string) => {
      setNewZone(timezone);
      // Auto-fill city name from timezone if not already set
      if (!newCity) {
         const cityName = timezone.split('/').pop()?.replace(/_/g, ' ') || '';
         setNewCity(cityName);
      }
   };

   return (
      <div className="w-full max-w-6xl mx-auto">
         <div className="absolute fixed top-10 ml-30 flex justify-between items-center mb-8 z-50">
            <h2 className="text-3xl font-light tracking-widest uppercase flex items-center gap-3">
               <Globe2 size={32} className="text-primary" />
               World Clock
            </h2>
            {!showForm && (
               <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-primary/50 transition-all active:scale-95"
               >
                  <Plus size={20} />
               </button>
            )}
         </div>

         {showForm && (
            <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 overflow-hidden"
            >
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add Custom Timezone</h3>
                  <button onClick={() => { setShowForm(false); setNewCity(''); setNewZone(''); setSearchTerm(''); }} className="text-gray-400 hover:text-white">
                     <X size={20} />
                  </button>
               </div>

               <div className="grid gap-4">
                  {/* City Name Input */}
                  <div>
                     <label className="text-xs text-gray-400 block mb-2">City/Label</label>
                     <input
                        type="text"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        placeholder="e.g., Los Angeles"
                        className="w-full bg-black/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                     />
                  </div>

                  {/* Region Selector */}
                  <div>
                     <label className="text-xs text-gray-400 block mb-2">Select Region</label>
                     <div className="grid grid-cols-4 gap-2">
                        {Object.keys(timezoneData).map(region => (
                           <button
                              key={region}
                              onClick={() => setSelectedRegion(region)}
                              className={`p-2 rounded-lg text-sm transition-colors ${selectedRegion === region
                                 ? 'bg-primary text-white'
                                 : 'bg-white/10 hover:bg-white/20'
                                 }`}
                           >
                              {region}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Timezone Search & Select */}
                  <div>
                     <label className="text-xs text-gray-400 block mb-2">Search & Select Timezone</label>
                     <div className="relative mb-2">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                           type="text"
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                           placeholder="Search timezone..."
                           className="w-full bg-black/20 rounded-lg p-3 pl-10 outline-none focus:ring-2 focus:ring-primary"
                        />
                     </div>

                     <div className="max-h-48 overflow-y-auto bg-black/40 rounded-lg border border-white/10">
                        {filteredTimezones.length > 0 ? (
                           filteredTimezones.map(tz => (
                              <button
                                 key={tz}
                                 onClick={() => handleTimezoneSelect(tz)}
                                 className={`w-full text-left p-3 hover:bg-white/10 transition-colors text-sm ${newZone === tz ? 'bg-primary/20 border-l-2 border-primary' : ''
                                    }`}
                              >
                                 {getTimezoneWithOffset(tz)}
                              </button>
                           ))
                        ) : (
                           <div className="p-4 text-center text-gray-500 text-sm">
                              No timezones found
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Selected Timezone Display */}
                  {newZone && (
                     <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Selected Timezone:</div>
                        <div className="font-mono text-sm text-primary">{newZone}</div>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                     <button
                        onClick={addClock}
                        disabled={!newCity || !newZone}
                        className="flex-1 bg-primary hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                     >
                        <Plus size={18} />
                        Add Clock
                     </button>
                     <button
                        onClick={() => { setShowForm(false); setNewCity(''); setNewZone(''); setSearchTerm(''); }}
                        className="px-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </motion.div>
         )}

         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 opacity-90">
            {clocks.map(clock => (
               <CityClock
                  key={clock.id}
                  city={clock.city}
                  zone={clock.timezone}
                  onDelete={() => removeClock(clock.id)}
               />
            ))}
         </div>
      </div>
   );
};

export default WorldClock;
