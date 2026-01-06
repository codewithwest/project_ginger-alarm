import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, AlarmClock, Timer, Hourglass, Settings } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
   <NavLink
      to={to}
      className={({ isActive }) =>
         clsx(
            "flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all duration-300 transform preserve-3d group",
            isActive
               ? "bg-white/20 shadow-[0_0_20px_rgba(99,102,241,0.5)] translate-z-10 scale-110 text-white"
               : "hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105"
         )
      }
   >
      <div className="relative z-10">
         <Icon size={28} className="mb-1 transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <span className="text-xs font-medium tracking-wide">{label}</span>
   </NavLink>
);

const Navbar = () => {
   return (
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
         <div className="flex items-center gap-4 px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl perspective-1000">
            <NavItem to="/" icon={Clock} label="Clock" />
            <NavItem to="/alarms" icon={AlarmClock} label="Alarm" />
            <NavItem to="/timer" icon={Timer} label="Timer" />
            <NavItem to="/stopwatch" icon={Hourglass} label="Stopwatch" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
         </div>
      </nav>
   );
};

export default Navbar;
