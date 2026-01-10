import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../../package.json';

const Footer = () => {
   return (
      <footer className="w-full text-center text-xs text-gray-500 mt-auto pt-8 pb-4">
         <div className="flex justify-center gap-4 mb-2">
            <Link to="/release-notes" className="hover:text-white transition-colors">Release Notes</Link>
            <span>|</span>
            <Link to="/help" className="hover:text-white transition-colors">Help & CLI</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
         </div>
         <p>&copy; {new Date().getFullYear()} Ginger Alarm. v{version}</p>
      </footer>
   );
};

export default Footer;
