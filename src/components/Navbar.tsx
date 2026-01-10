import { NavLink } from 'react-router-dom';
import { Clock, AlarmClock, Timer, Hourglass, Settings } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, offset }: { to: string; icon: any; label: string; offset: number }) => (
   <NavLink
      to={to}
      style={{ transform: `translateY(${offset}px)` }}
      className={({ isActive }) =>
         clsx(
            "flex flex-col items-center justify-center transition-all duration-300 transform preserve-3d group z-10 w-20",
            isActive
               ? "text-white"
               : "text-gray-00 hover:text-white"
         )
      }
   >
      {({ isActive }) => (
         <>
            <div className={clsx(
               "px-3 py-2 rounded-full transition-all duration-300",
               isActive ? "bg-white/20 shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-80" : "group-hover:bg-white/10"
            )}>
               <Icon size={28} className="transition-transform duration-300" />
            </div>
            <span className={clsx(
               "text-[8px] font-bold uppercase tracking-wider mt-1 transition-opacity duration-300",
               isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>{label}</span>
         </>
      )}
   </NavLink>
);

const Navbar = () => {
   return (
      <nav className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-10">
         {/* SVG Background - Deep Concave Arc with Material Depth */}
         <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full drop-shadow-[0_-15px_35px_rgba(0,0,0,0.7)]"
         >
            <defs>
               <linearGradient id="nav-bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(30, 30, 30, 0.85)" />
                  <stop offset="100%" stopColor="rgba(10, 10, 10, 0.98)" />
               </linearGradient>
               <linearGradient id="nav-rim-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                  <stop offset="40%" stopColor="rgba(255, 255, 255, 0.1)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
               </linearGradient>
            </defs>
            <path
               // Deep concave scoop that leaves enough thickness for icons
               // Top edge: starts at y=30, dips to y=65 in center
               // Bottom edge: y=100
               d="M 0,100 
                  L 100,100 
                  L 100,30 
                  C 80,30 70,65 50,65 
                  C 30,65 20,30 0,30 
                  Z"
               fill="url(#nav-bg-gradient)"
               className="backdrop-blur-[50px]"
            />
            {/* Main Specular Highlight Rim */}
            <path
               d="M 100,30 
                  C 80,30 70,65 50,65 
                  C 30,65 20,30 0,30"
               fill="none"
               stroke="url(#nav-rim-gradient)"
               strokeWidth="1.2"
            />
            {/* Internal separator or depth line */}
            <path
               d="M 100,32 
                  C 80,32 70,67 50,67 
                  C 30,67 20,32 0,32"
               fill="none"
               stroke="rgba(255, 255, 255, 0.05)"
               strokeWidth="0.5"
            />
         </svg>

         {/* Navigation Items - Shifted down to be fully submerged in the glass */}
         <div className="absolute inset-0 flex items-start justify-center gap-3 pt-36 px-12 pointer-events-auto">
            <NavItem to="/" icon={Clock} label="Clock" offset={3} />
            <NavItem to="/alarms" icon={AlarmClock} label="Alarm" offset={31} />
            <NavItem to="/timer" icon={Timer} label="Timer" offset={37} />
            <NavItem to="/stopwatch" icon={Hourglass} label="Stopwatch" offset={31} />
            <NavItem to="/settings" icon={Settings} label="Settings" offset={3} />
         </div>
      </nav>
   );
};

export default Navbar;
