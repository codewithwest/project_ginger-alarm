import React from 'react';

const Privacy = () => {
   return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-white/5 rounded-xl border border-white/10">
         <h2 className="text-3xl font-light mb-6">Privacy Policy</h2>
         <div className="space-y-4 text-sm text-gray-300">
            <p>Welcome to Ginger Alarm. We respect your privacy.</p>
            <p><strong>Data Collection:</strong> We do not collect any personal data. Your alarms and timers are stored locally on your device.</p>
            <p><strong>Synchronization:</strong> If you use the sync feature, your data is transmitted securely to our servers solely for the purpose of synchronizing across your devices.</p>
         </div>
      </div>
   );
};

export default Privacy;
