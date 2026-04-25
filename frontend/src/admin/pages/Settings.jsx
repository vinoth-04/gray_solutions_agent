import React from 'react';
import { Pencil } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-level configuration</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Company Profile</h2>
            <p className="text-sm text-gray-500">Gray AI platform information</p>
         </div>
         <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" defaultValue="Gray AI" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Support Email</label>
                  <input type="email" defaultValue="support@gray.ai" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
                  <input type="text" defaultValue="www.gray.ai" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                  <input type="text" defaultValue="+91 80 4567 8900" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
               </div>
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
               <input type="text" defaultValue="Bangalore, Karnataka, India" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
               <h2 className="text-lg font-bold text-gray-900">Default Agent Configuration</h2>
               <p className="text-sm text-gray-500">Template for new clinic onboarding</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 text-gray-700">
               <Pencil size={14} /> Edit Template
            </button>
         </div>
         <div className="p-6 space-y-8">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-3">Operating Hours</label>
               <div className="space-y-3 max-w-sm">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, idx) => (
                    <div key={day} className="flex items-center gap-3">
                      <div className="flex items-center w-28 gap-2">
                         <input type="checkbox" defaultChecked className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900" />
                         <span className="text-sm text-gray-700 capitalize">{day}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                         <input type="text" defaultValue="09:00" className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-center" />
                         <span className="text-gray-500 text-sm">to</span>
                         <input type="text" defaultValue={idx === 5 ? "14:00" : "18:00"} className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-center" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                      <div className="flex items-center w-28 gap-2">
                         <input type="checkbox" className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900" />
                         <span className="text-sm text-gray-700 capitalize">sunday</span>
                      </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Language Preference</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm appearance-none">
                     <option>Tamil</option>
                     <option>English</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Agent Name</label>
                  <input type="text" defaultValue="AI Assistant" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
               </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-3">Default FAQs</label>
               <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                     <div className="font-bold text-sm text-gray-900 mb-1">What are your operating hours?</div>
                     <div className="text-sm text-gray-600">We are open Monday to Friday from 9 AM to 6 PM, and Saturday from 9 AM to 2 PM.</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                     <div className="font-bold text-sm text-gray-900 mb-1">How do I book an appointment?</div>
                     <div className="text-sm text-gray-600">You can book an appointment by calling us or through our AI assistant.</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                     <div className="font-bold text-sm text-gray-900 mb-1">Do you accept insurance?</div>
                     <div className="text-sm text-gray-600">Yes, we accept most major insurance plans. Please check with us for specific coverage.</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
        <div className="mt-0.5 text-gray-500 text-xs text-center border border-gray-400 w-[18px] h-[18px] rounded-full flex items-center justify-center font-serif">i</div>
        <div>
           <h4 className="text-sm font-bold text-gray-900 mb-1">About Default Configuration</h4>
           <p className="text-sm text-gray-600">
             This template will pre-fill Step 3 of the onboarding flow when adding new clinics. Admins can customize these settings for each clinic during onboarding.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
