import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bot, Bell, Plug, Loader2 } from 'lucide-react';
const Settings = () => {
  const [config, setConfig] = useState({
    clinic_name: "Chennai Dental Care",
    llm_model: "gpt-4o-mini",
    languages: ["English", "Tamil"]
  });
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
       <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-gray-300" size={32} />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Loading Settings...</p>
       </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your clinic configuration and preferences retrieved from backend</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200">
         <button className="flex items-center gap-2 pb-4 pt-2 border-b-2 border-gray-900 text-gray-900 font-bold text-sm">
            <SettingsIcon size={16} /> General
         </button>
         <button className="flex items-center gap-2 pb-4 pt-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            <Bot size={16} /> AI Agent
         </button>
         <button className="flex items-center gap-2 pb-4 pt-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            <Bell size={16} /> Notifications
         </button>
         <button className="flex items-center gap-2 pb-4 pt-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            <Plug size={16} /> Integrations
         </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
         <div className="p-8 space-y-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">General Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clinic Name</label>
                  <input type="text" defaultValue={config?.clinic_name || "Chennai Dental Care"} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm transition-colors focus:border-gray-400 focus:ring-0" />
               </div>
               
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary AI Model</label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600 font-mono">
                     {config?.llm_model || 'gpt-4o-mini'}
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Operating Hours</label>
                  <div className="space-y-3">
                     {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                       <div key={day} className="flex items-center gap-4">
                         <span className="w-24 text-sm text-gray-600">{day}</span>
                         <span className="w-16 flex justify-center">
                            <span className="px-3 py-1 bg-gray-900 text-white text-[11px] font-bold rounded-md">Open</span>
                         </span>
                         <div className="flex items-center gap-3">
                            <input type="text" defaultValue="09:00" className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center" />
                            <span className="text-gray-400 text-sm">to</span>
                            <input type="text" defaultValue={idx === 5 ? "14:00" : "18:00"} className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center" />
                         </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language Preference</label>
                  <div className="flex items-center gap-3">
                     {config?.languages?.map(lang => (
                       <button key={lang} className="px-5 py-2 bg-gray-900 text-white font-semibold text-sm rounded-lg border border-gray-900 shadow-sm transition-colors">
                         {lang}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="pt-6">
                  <button className="px-6 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-gray-800 transition-colors">
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Settings;
