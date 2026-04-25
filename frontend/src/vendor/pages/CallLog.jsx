import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Phone } from 'lucide-react';

const MOCK_CALLS = [
  { 
    id: 1, 
    caller: '+91 98765 43210', 
    date: 'Jan 24, 2025 · 05:42 PM', 
    duration: '2m 14s', 
    lang: 'Tamil', 
    intent: 'Book Appointment', 
    outcome: 'Resolved',
    transcriptSummary: 'Patient called to book a regular cleaning. AI successfully checked the clinic schedule for next Tuesday and booked a 9:00 AM slot.',
    reasoning: 'AI matched the "cleaning" request to the "General Checkup" treatment type and verified availability using the check_availability tool.'
  },
  { id: 2, caller: '+91 87654 32109', date: 'Jan 24, 2025 · 04:58 PM', duration: '1m 47s', lang: 'English', intent: 'Cancel Appointment', outcome: 'Resolved' },
  { id: 3, caller: '+91 76543 21098', date: 'Jan 24, 2025 · 04:15 PM', duration: '3m 02s', lang: 'Tamil', intent: 'Reschedule Appointment', outcome: 'Transferred' },
  { id: 4, caller: '+91 65432 10987', date: 'Jan 24, 2025 · 03:30 PM', duration: '0m 38s', lang: 'English', intent: 'Enquiry', outcome: 'Escalated' },
  { id: 5, caller: '+91 54321 09876', date: 'Jan 24, 2025 · 02:55 PM', duration: '0m 00s', lang: 'Tamil', intent: 'Unknown', outcome: 'Missed' },
  { id: 6, caller: '+91 43210 98765', date: 'Jan 24, 2025 · 01:20 PM', duration: '1m 55s', lang: 'English', intent: 'Check Slot', outcome: 'Resolved' },
  { id: 7, caller: '+91 32109 87654', date: 'Jan 24, 2025 · 12:10 PM', duration: '2m 30s', lang: 'Tamil', intent: 'Book Appointment', outcome: 'Resolved' },
  { id: 8, caller: '+91 21098 76543', date: 'Jan 24, 2025 · 11:05 AM', duration: '1m 12s', lang: 'English', intent: 'Cancel Appointment', outcome: 'Resolved' },
];

const FilterPills = ({ label, options, active }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
      {options.map(opt => (
        <button 
          key={opt}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${opt === active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const OutcomeBadge = ({ outcome }) => {
  let bgColor, textColor;
  switch(outcome) {
    case 'Resolved': bgColor = 'bg-emerald-100'; textColor = 'text-emerald-700'; break;
    case 'Transferred': bgColor = 'bg-amber-100'; textColor = 'text-amber-700'; break;
    case 'Escalated': bgColor = 'bg-rose-100'; textColor = 'text-rose-700'; break;
    case 'Missed': bgColor = 'bg-gray-100'; textColor = 'text-gray-700'; break;
    default: bgColor = 'bg-gray-100'; textColor = 'text-gray-700';
  }
  return <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${bgColor} ${textColor}`}>{outcome}</span>;
}

const CallLog = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Call Log</h1>
        <p className="text-sm text-gray-500 mt-1">Review all AI-handled calls and their outcomes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
        {/* Filters Top Bar */}
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-100 pb-6 mb-2">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input type="text" placeholder="-/-/-" className="w-32 pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
              </div>
              <span className="text-gray-400 text-sm">to</span>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input type="text" placeholder="-/-/-" className="w-32 pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
              </div>
           </div>

           <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
           
           <FilterPills label="Outcome" options={['All', 'Resolved', 'Transferred', 'Escalated', 'Missed']} active="All" />
           
           <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

           <FilterPills label="Language" options={['All', 'Tamil', 'English']} active="All" />

           <div className="ml-auto text-xs text-gray-400 font-medium pt-2 md:pt-0">
             10 results
           </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="pl-6">Caller Number</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Language</th>
                <th>Intent</th>
                <th>Outcome</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_CALLS.map((call) => (
                <React.Fragment key={call.id}>
                  <tr 
                    onClick={() => toggleExpand(call.id)}
                    className={`border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${expandedId === call.id ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
                  >
                    <td className="pl-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-gray-50 rounded-full text-gray-500"><Phone size={12} fill="currentColor" /></div>
                          <span className="font-semibold text-gray-900">{call.caller}</span>
                       </div>
                    </td>
                    <td className="text-gray-500">{call.date}</td>
                    <td className="text-gray-500 py-4">
                       <div className="flex items-center gap-1.5 h-full">
                         <span className="text-gray-400 text-[10px]">⏰</span> {call.duration}
                       </div>
                    </td>
                    <td className="text-gray-600">
                       <div className="flex items-center gap-1.5">
                         <span className="text-gray-400 font-serif text-[10px] font-bold">文A</span> {call.lang}
                       </div>
                    </td>
                    <td className="text-gray-600">{call.intent}</td>
                    <td><OutcomeBadge outcome={call.outcome} /></td>
                    <td className="pr-6 text-gray-400">
                      {expandedId === call.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                  </tr>
                  {expandedId === call.id && (
                    <tr className="bg-gray-50/30">
                      <td colSpan="7" className="px-6 py-4 border-b border-gray-100">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 animate-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">
                            <div className="space-y-3">
                               <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transcript Summary</h4>
                               <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                                 "{call.transcriptSummary || "Detailed transcript summary is unavailable for this log."}"
                               </p>
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">AI Decision Note</h4>
                               <p className="text-sm text-gray-600">
                                 {call.reasoning || "No automated process notes exist for this interaction."}
                               </p>
                               <div className="pt-2">
                                  <button className="text-xs font-bold text-gray-900 underline underline-offset-4 hover:text-gray-600">View Full Transcript &rarr;</button>
                               </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CallLog;

