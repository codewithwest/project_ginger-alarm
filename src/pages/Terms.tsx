import React from 'react';

const Terms = () => {
   return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-white/5 rounded-xl border border-white/10">
         <h2 className="text-3xl font-light mb-6">Terms & Conditions</h2>
         <div className="space-y-4 text-sm text-gray-300">
            <p>Welcome to Ginger Alarm. By using this application, you agree to the following terms.</p>
            <p><strong>Usage:</strong> This app is provided "as is". We are not responsible for any missed alarms or consequences thereof.</p>
            <p><strong>Modifications:</strong> We reserve the right to modify these terms at any time.</p>
         </div>
      </div>
   );
};

export default Terms;
