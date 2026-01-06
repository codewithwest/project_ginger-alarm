import React, { JSX } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WorldClock from './pages/WorldClock';
import Alarms from './pages/Alarms';
import Timer from './pages/Timer';
import Stopwatch from './pages/Stopwatch';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import ReleaseNotes from './pages/ReleaseNotes';

const App = (): JSX.Element => {
   return (
      <HashRouter>
         <Layout>
            <Routes>
               <Route path="/" element={<WorldClock />} />
               <Route path="/alarms" element={<Alarms />} />
               <Route path="/timer" element={<Timer />} />
               <Route path="/stopwatch" element={<Stopwatch />} />
               <Route path="/settings" element={<Settings />} />
               <Route path="/privacy" element={<Privacy />} />
               <Route path="/terms" element={<Terms />} />
               <Route path="/help" element={<Help />} />
               <Route path="/release-notes" element={<ReleaseNotes />} />
            </Routes>
         </Layout>
      </HashRouter>
   );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);