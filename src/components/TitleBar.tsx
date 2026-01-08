import { X } from 'lucide-react';

const TitleBar = () => {
   return (
      <div className="fixed top-0 h-20 flex flex-col items-center justify-center bg-white/5 
         backdrop-blur-2xl border-b border-white/5 title-bar shadow-2xl relative z-50">
         <span className="text-[13px] uppercase tracking-[0.5em] text-gray-300 font-black select-none opacity-50">
            Ginger Alarm
         </span>
         {/* Close button */}
         <div className="absolute right-4 top-1/2 transform -translate-y-1/2 
            bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/10 
            rounded-full w-12 h-12 flex items-center justify-center cursor-pointer">
            <X size={24} onClick={() => {}}/>
         </div>
      </div>
   );
}

export default TitleBar;
