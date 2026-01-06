import React from 'react';
import { Terminal, Code, Info } from 'lucide-react';

const Help = () => {
   return (
      <div className="w-full max-w-5xl mx-auto">
         <div className="mb-8">
            <h2 className="text-3xl font-light tracking-widest uppercase flex items-center gap-3">
               <Info size={32} className="text-primary" />
               Help & Documentation
            </h2>
         </div>

         {/* CLI Documentation */}
         <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-4">
               <Terminal className="text-primary" size={24} />
               <h3 className="text-xl font-semibold">Command Line Interface</h3>
            </div>

            <div className="space-y-6">
               {/* Create Alarm */}
               <div>
                  <h4 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                     <Code size={18} />
                     Create an Alarm
                  </h4>
                  <div className="bg-black/40 p-4 rounded-lg font-mono text-sm mb-2">
                     <div className="text-gray-400 mb-1"># Format:</div>
                     <div className="text-green-400">ginger-alarm --create-alarm "TIME" "LABEL" "SOUND"</div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                     <div className="bg-black/20 p-3 rounded-lg">
                        <div className="text-gray-400 mb-1">Examples:</div>
                        <code className="block mb-1">ginger-alarm --create-alarm "07:00" "Wake up" "alarm.mp3"</code>
                        <code className="block mb-1">ginger-alarm --create-alarm "18:30"</code>
                        <code className="block">ginger-alarm --create-alarm "12:00" "Lunch" "/path/to/sound.mp3"</code>
                     </div>
                  </div>
               </div>

               {/* Create Timer */}
               <div>
                  <h4 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                     <Code size={18} />
                     Create a Timer
                  </h4>
                  <div className="bg-black/40 p-4 rounded-lg font-mono text-sm mb-2">
                     <div className="text-gray-400 mb-1"># Format:</div>
                     <div className="text-green-400">ginger-alarm --create-timer DURATION_IN_SECONDS "LABEL"</div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                     <div className="bg-black/20 p-3 rounded-lg">
                        <div className="text-gray-400 mb-1">Examples:</div>
                        <code className="block mb-1">ginger-alarm --create-timer 900 "15 minute break"</code>
                        <code className="block mb-1">ginger-alarm --create-timer 300</code>
                        <code className="block mb-1">ginger-alarm --create-timer 1800 "30 minute workout"</code>
                        <code className="block">ginger-alarm --create-timer 3600 "1 hour study session"</code>
                     </div>
                  </div>
               </div>

               {/* Common Use Cases */}
               <div>
                  <h4 className="text-lg font-medium text-primary mb-2">Common Use Cases</h4>
                  <div className="bg-black/20 p-4 rounded-lg space-y-2 text-sm">
                     <div>
                        <div className="text-gray-400 font-semibold mb-1">Morning Routine:</div>
                        <code className="block text-green-400">ginger-alarm --create-alarm "06:30" "Wake up" "alarm.mp3"</code>
                        <code className="block text-green-400">ginger-alarm --create-alarm "07:00" "Breakfast"</code>
                     </div>
                     <div className="mt-3">
                        <div className="text-gray-400 font-semibold mb-1">Pomodoro Technique:</div>
                        <code className="block text-green-400">ginger-alarm --create-timer 1500 "25 min Pomodoro"</code>
                        <code className="block text-green-400">ginger-alarm --create-timer 300 "5 min break"</code>
                     </div>
                  </div>
               </div>

               {/* Notes */}
               <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-400 mb-2">📝 Notes:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                     <li>Time format for alarms: <code className="bg-black/40 px-2 py-1 rounded">"HH:MM"</code> in 24-hour format</li>
                     <li>Duration for timers: seconds (integer)</li>
                     <li>Sound files: Use pre-installed sounds or full path to custom audio files</li>
                     <li>Default sounds: <code className="bg-black/40 px-2 py-1 rounded">alarm.mp3</code>, <code className="bg-black/40 px-2 py-1 rounded">alarm.ogg</code></li>
                  </ul>
               </div>
            </div>
         </div>

         {/* Keyboard Shortcuts */}
         <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div className="bg-black/20 p-3 rounded-lg">
                  <kbd className="bg-white/10 px-2 py-1 rounded">Ctrl/Cmd + N</kbd>
                  <span className="text-gray-400 ml-2">New Alarm/Timer</span>
               </div>
               <div className="bg-black/20 p-3 rounded-lg">
                  <kbd className="bg-white/10 px-2 py-1 rounded">Esc</kbd>
                  <span className="text-gray-400 ml-2">Close Form/Dialog</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Help;
