import React from 'react';
import { Building2, Phone, Clock, FileText, AlertTriangle, RotateCcw } from 'lucide-react';

const ESCALATIONS = [
  { id: '#1001', clinic: 'City Care Clinic', location: 'Chennai, Tamil Nadu', type: 'Language Mismatch', caller: '+91 98765 11111', time: '2024-03-15 03:15 PM', notes: 'Caller spoke in mixed Tamil-English dialect. Language recognition confidence was below threshold.' },
  { id: '#1002', clinic: 'Metro Health Center', location: 'Mumbai, Maharashtra', type: 'Unrecognised Query', caller: '+91 98765 22222', time: '2024-03-15 02:45 PM', notes: 'Caller asked about specific insurance policy coverage details not in knowledge base.' },
  { id: '#1003', clinic: 'Sunrise Medical Clinic', location: 'Bangalore, Karnataka', type: 'Call Dropped', caller: '+91 98765 33333', time: '2024-03-15 01:30 PM', notes: 'Connection lost during appointment booking process. Caller did not call back.' },
  { id: '#1004', clinic: 'Family Health Clinic', location: 'Pune, Maharashtra', type: 'Other', caller: '+91 98765 44444', time: '2024-03-15 12:20 PM', notes: 'Caller requested emergency consultation. System correctly escalated to staff but no response recorded.' },
  { id: '#1005', clinic: 'Wellness Clinic Plus', location: 'Hyderabad, Telangana', type: 'Language Mismatch', caller: '+91 98765 55555', time: '2024-03-15 11:45 AM', notes: 'Caller spoke in Telugu. Clinic language preference set to English only.' },
  { id: '#1006', clinic: 'Heart Care Specialty', location: 'Ahmedabad, Gujarat', type: 'Unrecognised Query', caller: '+91 98765 66666', time: '2024-03-15 10:30 AM', notes: 'Caller inquired about specific cardiac procedure not listed in clinic services.' },
];

const EscalationCard = ({ esc }) => {
  let badgeColor;
  switch(esc.type) {
    case 'Language Mismatch': badgeColor = 'bg-amber-100 text-amber-800'; break;
    case 'Call Dropped': badgeColor = 'bg-rose-100 text-rose-800'; break;
    default: badgeColor = 'bg-gray-100 text-gray-800'; break;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <Building2 size={14} className="text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900">{esc.clinic}</h3>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${badgeColor}`}>
            {esc.type}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-5 ml-8">{esc.location}</div>

        <div className="space-y-4 text-sm mt-2 ml-1">
          <div className="flex items-start gap-3">
             <div className="p-1.5 bg-gray-50 rounded-full mt-0.5"><Phone size={12} className="text-gray-500" /></div>
             <div>
               <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Caller Number</div>
               <div className="text-gray-900 font-medium">{esc.caller}</div>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <div className="p-1.5 bg-gray-50 rounded-full mt-0.5"><Clock size={12} className="text-gray-500" /></div>
             <div>
               <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Escalation Time</div>
               <div className="text-gray-900">{esc.time}</div>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <div className="p-1.5 bg-gray-50 rounded-full mt-0.5"><FileText size={12} className="text-gray-500" /></div>
             <div>
               <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Notes</div>
               <div className="text-gray-700 leading-relaxed text-[13px]">{esc.notes}</div>
             </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex justify-between items-center text-xs">
         <div className="flex items-center gap-1.5 text-amber-600 font-medium">
           <AlertTriangle size={14} /> Awaiting vendor resolution
         </div>
         <div className="text-gray-400 font-mono">{esc.id}</div>
      </div>
    </div>
  );
};

const Escalations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Escalations</h1>
        <p className="text-sm text-gray-500 mt-1">View all unresolved escalations across all clinics</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex gap-4 border-b border-gray-100 pb-6">
          <div className="w-64">
             <label className="block text-xs font-semibold text-gray-700 mb-1">Filter by Clinic</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none">
                <option>All Clinics</option>
             </select>
          </div>
          <div className="w-64">
             <label className="block text-xs font-semibold text-gray-700 mb-1">Filter by Reason</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none">
                <option>All Reasons</option>
             </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 text-gray-700">
                <RotateCcw size={14} /> Reset Filters
              </button>
              <div className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">15</span> unresolved escalations</div>
           </div>
           <div className="text-xs flex items-center gap-1 text-gray-400">
               <AlertTriangle size={12} /> Resolution is handled by clinic vendors
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {ESCALATIONS.map(esc => <EscalationCard key={esc.id} esc={esc} />)}
      </div>
    </div>
  );
};

export default Escalations;
