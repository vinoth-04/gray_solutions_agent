import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronUp, Clock, User, ClipboardList, CheckCircle, Phone, Loader2 } from 'lucide-react';
import { startOutboundCall } from '../../api';

const PATIENTS = [
  { 
    id: 1, 
    initials: 'RK', 
    name: 'Rajesh Kumar', 
    phone: '+91 98765 43210', 
    lastVisit: '15 Jan 2024', 
    visits: 8, 
    treatments: ['Root Canal', 'Cleaning'], 
    status: 'Active',
    history: [
      { id: 101, date: '15 Jan 2024', time: '10:30 AM', treatment: 'Root Canal - Follow-up', doctor: 'Dr. Priya Sharma', outcome: 'Completed', status: 'Booked', ref: 'CL-2024-0115', notes: 'Patient reported no pain. Treatment successful.' },
      { id: 102, date: '08 Jan 2024', time: '11:15 AM', treatment: 'Root Canal - Session 2', doctor: 'Dr. Priya Sharma', outcome: 'Completed', status: 'Booked', ref: 'CL-2024-0108', notes: 'Second session completed. One more follow-up needed.' },
      { id: 103, date: '20 Dec 2023', time: '02:30 PM', treatment: 'Root Canal - Initial', doctor: 'Dr. Priya Sharma', outcome: 'Completed', status: 'Booked', ref: 'CL-2023-1220', notes: 'Started root canal treatment. Patient tolerated well.' },
      { id: 104, date: '10 Nov 2023', time: '09:00 AM', treatment: 'Dental Cleaning', doctor: 'Dr. Arun Patel', outcome: 'Completed', status: 'Booked', ref: 'CL-2023-1110', notes: 'Routine cleaning. Advised to improve flossing.' },
    ]
  },
  { id: 2, initials: 'LD', name: 'Lakshmi Devi', phone: '+91 98234 56789', lastVisit: '12 Jan 2024', visits: 5, treatments: ['Teeth Whitening', 'Cleaning'], status: 'Active' },
  { id: 3, initials: 'AM', name: 'Arjun Menon', phone: '+91 99876 54321', lastVisit: '10 Jan 2024', visits: 12, treatments: ['Braces', 'Cleaning', 'X-Ray'], status: 'Active' },
  { id: 4, initials: 'PI', name: 'Priya Iyer', phone: '+91 97654 32109', lastVisit: '08 Jan 2024', visits: 3, treatments: ['Filling', 'Cleaning'], status: 'Active' },
  { id: 5, initials: 'SB', name: 'Suresh Babu', phone: '+91 96543 21098', lastVisit: '05 Jan 2024', visits: 6, treatments: ['Extraction', 'Cleaning'], status: 'Active' },
  { id: 6, initials: 'AK', name: 'Anitha Krishnan', phone: '+91 95432 10987', lastVisit: '20 Nov 2023', visits: 4, treatments: ['Cleaning', 'Consultation'], status: 'Inactive' },
  { id: 7, initials: 'VP', name: 'Vijay Prakash', phone: '+91 94321 09876', lastVisit: '14 Jan 2024', visits: 9, treatments: ['Crown', 'Root Canal', 'Cleaning'], status: 'Active' },
];

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
       {status}
    </span>
  );
};

const Tag = ({ text }) => (
  <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md border border-gray-100 whitespace-nowrap">
    {text}
  </span>
);

const PatientHistory = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [callingId, setCallingId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCallNow = async (id, phone) => {
    try {
      setCallingId(id);
      await startOutboundCall(phone);
      alert(`Outbound call triggered for ${phone}`);
    } catch (err) {
      alert('Failed to trigger outbound call: ' + err.message);
    } finally {
      setCallingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
        <p className="text-sm text-gray-500 mt-1">Search and view complete patient treatment records</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
         
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient name or phone number..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400"
            />
         </div>

         <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex-1">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Treatment Type</label>
               <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none font-medium">
                  <option>All</option>
               </select>
            </div>
            <div className="flex-1">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Status</label>
               <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none font-medium">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
               </select>
            </div>
            <div className="flex-1 relative">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Last Visit From</label>
               <div className="relative">
                 <input type="text" placeholder="-/-/-" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                 <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
               </div>
            </div>
            <div className="flex-1 relative">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Last Visit To</label>
               <div className="relative">
                 <input type="text" placeholder="-/-/-" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                 <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
               </div>
            </div>
         </div>

         <div className="text-sm text-gray-400 font-medium pb-2">Showing <span className="font-bold text-gray-900">12</span> patients</div>

         <div className="overflow-x-auto -mx-6">
            <table className="w-full">
               <thead>
                  <tr className="bg-white">
                     <th className="pl-6 w-10"></th>
                     <th>Patient Name</th>
                     <th>Phone Number</th>
                     <th>Last Visit</th>
                     <th>Total Visits</th>
                     <th className="w-1/4">Treatment Types</th>
                     <th>Status</th>
                     <th className="pr-6 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                 {PATIENTS.map(patient => (
                   <React.Fragment key={patient.id}>
                     <tr 
                        className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${expandedId === patient.id ? 'bg-gray-50/30' : ''}`}
                     >
                        <td className="pl-6 py-4 text-gray-400 cursor-pointer" onClick={() => toggleExpand(patient.id)}>
                          {expandedId === patient.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[11px] font-bold shrink-0 shadow-inner">
                                 {patient.initials}
                              </div>
                              <span className="font-bold text-gray-900">{patient.name}</span>
                           </div>
                        </td>
                        <td className="text-gray-600 font-medium">{patient.phone}</td>
                        <td className="text-gray-600">{patient.lastVisit}</td>
                        <td>
                           <span className="px-2.5 py-1 bg-gray-100 text-gray-900 text-[11px] font-bold rounded-full">{patient.visits} visits</span>
                        </td>
                        <td>
                           <div className="flex flex-wrap gap-1.5">
                              {patient.treatments.map(t => <Tag key={t} text={t} />)}
                           </div>
                        </td>
                        <td><StatusBadge status={patient.status} /></td>
                        <td className="pr-6 text-right">
                           <button 
                             onClick={() => handleCallNow(patient.id, patient.phone)}
                             disabled={callingId === patient.id}
                             className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[11px] font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                           >
                             {callingId === patient.id ? (
                               <Loader2 size={12} className="animate-spin" />
                             ) : (
                               <Phone size={12} fill="currentColor" />
                             )}
                             Call Now
                           </button>
                        </td>
                     </tr>
                     {expandedId === patient.id && (
                       <tr className="bg-gray-50/30">
                         <td colSpan="7" className="px-6 py-6 border-b border-gray-100">
                           <div className="space-y-6 animate-in">
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                  <ClipboardList size={18} className="text-gray-400" /> Visit History
                                </h3>
                             </div>
                             <div className="grid grid-cols-1 gap-4">
                               {(patient.history || []).map((visit) => (
                                 <div key={visit.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                                   <div className="grid grid-cols-5 gap-6">
                                     <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Date & Time</span>
                                       <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> {visit.date}</span>
                                     </div>
                                     <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Treatment</span>
                                       <span className="text-xs font-bold text-gray-900 block truncate">{visit.treatment}</span>
                                     </div>
                                     <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Doctor</span>
                                       <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5"><User size={12} className="text-gray-400" /> {visit.doctor}</span>
                                     </div>
                                     <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Outcome</span>
                                       <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle size={12} /> {visit.outcome}</span>
                                     </div>
                                     <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Status</span>
                                       <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full w-fit block">{visit.status}</span>
                                     </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 pt-3 border-t border-gray-50">
                                      <div className="col-span-1 border-r border-gray-50 pr-4">
                                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Call Reference</span>
                                         <span className="text-xs font-mono text-gray-500">{visit.ref}</span>
                                      </div>
                                      <div className="col-span-4">
                                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Notes</span>
                                         <p className="text-xs text-gray-600 italic">"{visit.notes}"</p>
                                      </div>
                                   </div>
                                 </div>
                               ))}
                               {(!patient.history || patient.history.length === 0) && (
                                 <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                                   No visit history recorded for this patient.
                                 </div>
                               )}
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

export default PatientHistory;

