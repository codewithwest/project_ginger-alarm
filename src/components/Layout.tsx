import React from 'react';
import Navbar from './Navbar';
import Background3D from './Background3D';
import Footer from './Footer';

import AlarmManager from './AlarmManager';
import NetworkStatus from './NetworkStatus';
import UpdateNotification from './UpdateNotification';
import TitleBar from './TitleBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      //make the window rounded
      <div className="relative flex-col h-full w-full inset-0 align-center 
      overflow-hidden text-white rounded-full flex justify-center items-center">
         <Background3D />
         
            <NetworkStatus />
            <AlarmManager />
         <UpdateNotification />
         <header className="absolute w-full h-full top-0 z-2">
            <TitleBar />
         </header>
         {/* Main Content Area - Positioned to be visible between header/footer */}
         <div className="h-[80%] w-[70%] z-20 flex 
         flex-col scrollbar-width-none items-center">
            <main className="w-full h-full flex flex-col items-center 
            overflow-hidden scrollbar-width-none">
               {children}
            </main>
            <div className="z-100 bottom-0 left-10 right-10 h-[11%] flex items-center justify-center pointer-events-none">
               <Footer />
            </div>
         </div>

         <Navbar />
      </div>
   );
};



export default Layout;
