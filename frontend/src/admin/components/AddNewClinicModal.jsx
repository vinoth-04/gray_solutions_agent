import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const AddNewClinicModal = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const Stepper = () => {
    const steps = [
      { num: 1, label: 'Clinic Details' },
      { num: 2, label: 'Phone Assignment' },
      { num: 3, label: 'Agent Config' },
      { num: 4, label: 'Review & Activate' }
    ];

    return (
      <div className="flex items-center justify-center mb-12">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                s.num < step 
                  ? 'bg-gray-900 text-white' 
                  : s.num === step 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {s.num < step ? <Check size={18} /> : s.num}
              </div>
              <span className={`text-[11px] font-semibold text-center mt-1 absolute mt-12 w-24 ${
                s.num <= step ? 'text-gray-900' : 'text-gray-400'
              }`}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-24 h-0.5 mx-4 ${s.num < step ? 'bg-gray-900' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold mb-6">Clinic Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Clinic Name <span className="text-rose-500">*</span></label>
          <input type="text" placeholder="Enter clinic name" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address <span className="text-rose-500">*</span></label>
          <input type="text" placeholder="Street address" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-rose-500">*</span></label>
            <input type="text" placeholder="City" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specialisation <span className="text-rose-500">*</span></label>
            <select className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none">
              <option>Select specialisation</option>
              <option>Dental</option>
              <option>Orthopedic</option>
              <option>Pediatric</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Contact Name <span className="text-rose-500">*</span></label>
            <input type="text" placeholder="Contact person name" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number <span className="text-rose-500">*</span></label>
             <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-rose-500">*</span></label>
           <input type="email" placeholder="clinic@example.com" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
       <h3 className="text-lg font-bold mb-6">Phone Number Assignment</h3>
       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-start gap-3">
         <div className="mt-0.5 text-gray-500 text-xs text-center border border-gray-300 w-4 h-4 rounded-full flex items-center justify-center font-serif">i</div>
         <p className="text-sm text-gray-600">Select an available Exotel DID to assign to this clinic. This number will be used for all incoming calls.</p>
       </div>
       <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Available Phone Numbers <span className="text-rose-500">*</span></label>
          <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none mb-1 text-gray-600">
             <option>Select a phone number</option>
             <option>+91 80 4567 8900</option>
             <option>+91 80 4567 8901</option>
          </select>
          <p className="text-xs text-gray-500">6 unassigned numbers available</p>
       </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-8">
       <h3 className="text-lg font-bold">Agent Configuration</h3>
       
       <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name <span className="text-rose-500">*</span></label>
            <input type="text" placeholder="e.g., Maya, Priya, Assistant" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm mb-1" />
            <p className="text-[11px] text-gray-500">What the AI introduces itself as</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Language Preference <span className="text-rose-500">*</span></label>
            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none">
              <option>Tamil</option>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
       </div>

       <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Operating Hours <span className="text-rose-500">*</span></label>
          <div className="space-y-3">
             {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
               <div key={day} className="flex items-center">
                 <span className="w-24 text-sm text-gray-700 capitalize">{day}</span>
                 <input type="text" defaultValue="9:00 AM - 6:00 PM" className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
               </div>
             ))}
             <div className="flex items-center">
               <span className="w-24 text-sm text-gray-700 capitalize">saturday</span>
               <input type="text" defaultValue="9:00 AM - 2:00 PM" className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
             </div>
             <div className="flex items-center">
               <span className="w-24 text-sm text-gray-700 capitalize">sunday</span>
               <input type="text" defaultValue="Closed" className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
             </div>
          </div>
       </div>

       <div>
         <h4 className="font-semibold text-gray-900 mb-1 text-sm">Custom FAQ Inputs</h4>
         <p className="text-xs text-gray-500 mb-4">Provide information the AI agent can use to answer common questions</p>
         
         <div className="space-y-4">
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Clinic Address (for directions)</label>
              <input type="text" placeholder="Full address with landmarks" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Common Treatments</label>
              <textarea placeholder="List common treatments offered, e.g., General checkup, Dental cleaning, Root canal, etc." className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm h-20 resize-none" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pricing Information (if applicable)</label>
              <textarea placeholder="General pricing ranges or consultation fees" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm h-20 resize-none" />
           </div>
         </div>
       </div>
    </div>
  );

  const Step4 = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={32} strokeWidth={3} />
      </div>
      <h3 className="text-xl font-bold mb-2">Ready to Activate</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">Please review the details in the previous steps. Once you activate, the clinic will be fully functional on the platform.</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 flex items-center shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="ml-4">
           <h2 className="text-2xl font-bold text-gray-900">Add New Clinic</h2>
           <p className="text-sm text-gray-500 mt-1">Onboard a new clinic to the platform</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-12 py-10 mb-8 pt-6">
             <Stepper />
             {step === 1 && <Step1 />}
             {step === 2 && <Step2 />}
             {step === 3 && <Step3 />}
             {step === 4 && <Step4 />}

             {/* Footer Actions */}
             <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
               <button 
                 onClick={prevStep} 
                 disabled={step === 1}
                 className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2 text-gray-700"
               >
                 <ArrowLeft size={16} /> Back
               </button>
               {step < 4 ? (
                 <button 
                   onClick={nextStep}
                   className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                 >
                   Continue <span className="text-lg leading-none">&rarr;</span>
                 </button>
               ) : (
                 <button 
                   onClick={onClose}
                   className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                 >
                   Activate Clinic
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClinicModal;
