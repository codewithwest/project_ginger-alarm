import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
   const [version, setVersion] = useState('1.0.0');

   useEffect(() => {
      window.electronAPI.getVersion().then(setVersion);
   }, []);

   return (
      <footer className="w-full text-center text-xs text-gray-500 mt-auto pt-8 pb-4">
         <div className="flex justify-center gap-4 mb-2">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
         </div>
         <p>&copy; {new Date().getFullYear()} Ginger Alarm. v{version}</p>
      </footer>
   );
};

export default Footer;
