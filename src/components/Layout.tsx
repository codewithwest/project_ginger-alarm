import React from 'react';
import Navbar from './Navbar';
import Background3D from './Background3D';
import Footer from './Footer';

import AlarmManager from './AlarmManager';
import NetworkStatus from './NetworkStatus';
import UpdateNotification from './UpdateNotification';

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="w-full h-full overflow-hidden text-white">
         <Background3D />
         <NetworkStatus />
         <AlarmManager />
         <UpdateNotification />

         <div className="absolute inset-0 z-10 overflow-y-auto scrollbar-hide flex flex-col">
            <main className="flex-1 flex flex-col items-center justify-center p-8 w-full  mx-auto relative z-20">
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
