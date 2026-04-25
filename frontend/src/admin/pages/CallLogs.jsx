import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_CALLS = [
  { 
    id: 1, 
    clinic: 'Chennai Dental Care', 
    caller: '+91 98765 43210', 
    date: 'Jan 15, 2025 10:23 AM', 
    duration: '3m 45s', 
    lang: 'Tamil', 
    intent: 'Book Appointment', 
    outcome: 'Resolved',
    transcriptSummary: 'Caller requested a dental cleaning appointment. AI checked available slots for next week and confirmed booking for January 22nd at 2:00 PM.',
    intentDecision: 'Intent classified as appointment_booking with high confidence (0.94). Caller provided preferred date range and treatment type.',
    toolCalled: 'check_slot() → book_slot(date="2025-01-22", time="14:00", treatment="cleaning")'
  },
  { 
    id: 2, 
    clinic: 'Coimbatore Ortho Clinic', 
    caller: '+91 98765 43211', 
    date: 'Jan 15, 2025 10:15 AM', 
    duration: '2m 12s', 
    lang: 'English', 
    intent: 'Reschedule Appointment', 
    outcome: 'Resolved' 
  },
  { id: 3, clinic: 'Chennai Dental Care', caller: '+91 98765 43212', date: 'Jan 15, 2025 09:58 AM', duration: '5m 31s', lang: 'Both', intent: 'General Inquiry', outcome: 'Transferred' },
  { id: 4, clinic: 'Madurai Pediatric Center', caller: '+91 98765 43213', date: 'Jan 15, 2025 09:42 AM', duration: '1m 54s', lang: 'Tamil', intent: 'Cancel Appointment', outcome: 'Resolved' },
  { id: 5, clinic: 'Trichy ENT Specialists', caller: '+91 98765 43214', date: 'Jan 15, 2025 09:28 AM', duration: '4m 18s', lang: 'English', intent: 'Emergency Inquiry', outcome: 'Escalated' },
  { id: 6, clinic: 'Coimbatore Ortho Clinic', caller: '+91 98765 43215', date: 'Jan 15, 2025 09:10 AM', duration: '0m 00s', lang: 'Tamil', intent: 'Unknown', outcome: 'Missed' },
  { id: 7, clinic: 'Chennai Dental Care', caller: '+91 98765 43216', date: 'Jan 15, 2025 08:55 AM', duration: '3m 02s', lang: 'Tamil', intent: 'Check Availability', outcome: 'Resolved' },
];

const OutcomeBadge = ({ outcome }) => {
  let bgColor, textColor;
  switch(outcome) {
    case 'Resolved':
      bgColor = 'bg-emerald-100'; textColor = 'text-emerald-700'; break;
    case 'Transferred':
      bgColor = 'bg-gray-100'; textColor = 'text-gray-700'; break;
    case 'Escalated':
      bgColor = 'bg-amber-100'; textColor = 'text-amber-700'; break;
    case 'Missed':
      bgColor = 'bg-rose-100'; textColor = 'text-rose-700'; break;
    default:
      bgColor = 'bg-gray-100'; textColor = 'text-gray-700';
  }
  return <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${bgColor} ${textColor}`}>{outcome}</span>;
}

const CallLogs = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Call Logs</h1>
        <p className="text-sm text-gray-500 mt-1">View all calls across all clinics</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-100">
          <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none text-gray-700 font-medium">
                <option>All Clinics</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Date Range</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none text-gray-700 font-medium">
                <option>Today</option>
                <option>Last 7 Days</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Outcome</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none text-gray-700 font-medium">
                <option>All Outcomes</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Language</label>
             <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none text-gray-700 font-medium">
                <option>All Languages</option>
             </select>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">15</span> calls</div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 text-gray-700">
              <Download size={16} /> Export CSV
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="pl-6">Clinic Name</th>
                <th>Caller Number</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Language</th>
                <th>Intent</th>
                <th>Outcome</th>
                <th className="pr-6 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CALLS.map(call => (
                <React.Fragment key={call.id}>
                  <tr 
                    className={`cursor-pointer transition-colors ${expandedId === call.id ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
                    onClick={() => toggleExpand(call.id)}
                  >
                    <td className="pl-6 font-semibold text-gray-900">{call.clinic}</td>
                    <td className="text-gray-900">{call.caller}</td>
                    <td>{call.date}</td>
                    <td>{call.duration}</td>
                    <td>{call.lang}</td>
                    <td className="text-gray-900">{call.intent}</td>
                    <td><OutcomeBadge outcome={call.outcome} /></td>
                    <td className="pr-6 text-gray-400">
                      {expandedId === call.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                  </tr>
                  {expandedId === call.id && (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 bg-gray-50/30 border-b border-gray-100">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Transcript Summary</h4>
                               <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                 {call.transcriptSummary || "No summary available for this call."}
                               </p>
                            </div>
                            <div className="space-y-4">
                               <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LLM Intent Decision</h4>
                                  <p className="text-sm text-gray-700 font-medium">
                                    {call.intentDecision || "No decision data available."}
                                  </p>
                               </div>
                               <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tool Called</h4>
                                  <code className="text-[13px] bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 block w-full font-mono border border-gray-100">
                                    {call.toolCalled || "No tools were triggered."}
                                  </code>
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

export default CallLogs;

