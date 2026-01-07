import React from 'react';
import Navbar from './Navbar';
import Background3D from './Background3D';
import Footer from './Footer';

import AlarmManager from './AlarmManager';
import NetworkStatus from './NetworkStatus';
import UpdateNotification from './UpdateNotification';

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      //make the window rounded
      <div className="absolute w-full h-full inset-0 align-center overflow-hidden text-white rounded-full flex justify-center items-center">
         <Background3D />
         <NetworkStatus />
         <AlarmManager />
         <UpdateNotification />

         <div className="relative h-[80%] w-[60%] m-8 inset-0 z-10 overflow-hidden flex flex-col scrollbar-width-none">
            <main className="flex-1 flex flex-col items-center justify-center p-8 w-full mx-auto relative z-20 scrollbar-width-none">
               {children}
            </main>
            <div className="pb-32 w-full">
               <Footer />
            </div>
         </div>

         <Navbar />
      </div>
   );
};

export default Layout;
