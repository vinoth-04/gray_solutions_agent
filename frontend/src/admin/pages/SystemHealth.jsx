import React from 'react';
import { CheckCircle2, Phone, Mic, Speaker, Database, BrainCircuit, Calendar as CalendarIcon, Clock } from 'lucide-react';

const SERVICES = [
  { name: 'Telecalling Service', desc: 'Voice calling infrastructure', icon: Phone, status: 'Operational', time: 'Last checked 2 minutes ago' },
  { name: 'Speech-to-Text', desc: 'Audio transcription service', icon: Mic, status: 'Operational', time: 'Last checked 1 minute ago' },
  { name: 'LLM', desc: 'AI language model processing', icon: BrainCircuit, status: 'Operational', time: 'Last checked 3 minutes ago' },
  { name: 'Text-to-Speech', desc: 'Voice synthesis service', icon: Speaker, status: 'Operational', time: 'Last checked 2 minutes ago' },
  { name: 'Database', desc: 'Data storage and retrieval', icon: Database, status: 'Operational', time: 'Last checked 1 minute ago' },
];

const INCIDENTS = [
  { status: 'Resolved', service: 'Speech-to-Text', issue: 'Increased latency in transcription processing', start: '2024-01-15 14:23', end: '2024-01-15 14:45', duration: '22 minutes' },
  { status: 'Resolved', service: 'Telecalling Service (Exotel)', issue: 'Intermittent connection issues', start: '2024-01-14 09:15', end: '2024-01-14 09:38', duration: '23 minutes' },
  { status: 'Resolved', service: 'Database', issue: 'Scheduled maintenance completed', start: '2024-01-13 02:00', end: '2024-01-13 02:45', duration: '45 minutes' }
];

const StatusBadge = ({ status }) => (
  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold w-fit">
    <CheckCircle2 size={12} strokeWidth={3} /> {status}
  </span>
);

const SystemHealth = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor platform service status</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start gap-4">
        <div className="mt-0.5 text-emerald-600"><CheckCircle2 size={24} /></div>
        <div>
           <h3 className="text-lg font-bold text-emerald-800">All Systems Operational</h3>
           <p className="text-emerald-700 text-sm mt-1">All platform services are running normally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map(svc => (
           <div key={svc.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between h-48">
             <div className="flex items-start gap-4 mb-4">
               <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                 <svc.icon size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">{svc.name}</h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">{svc.desc}</p>
               </div>
             </div>
             <div>
                <StatusBadge status={svc.status} />
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-5 font-medium">
                  <Clock size={12} /> {svc.time}
                </div>
             </div>
           </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Incidents</h2>
            <p className="text-sm text-gray-500">Past service disruptions and resolutions</p>
         </div>
         <div className="divide-y divide-gray-100">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="p-6">
                 <div className="flex items-center gap-4 mb-3">
                    <StatusBadge status={inc.status} />
                    <span className="font-bold text-gray-900">{inc.service}</span>
                 </div>
                 <p className="text-sm text-gray-700 mb-4">{inc.issue}</p>
                 <div className="flex items-center gap-6 text-[12px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-gray-400" /> {inc.start}</div>
                    <div className="text-gray-400">&rarr;</div>
                    <div className="flex items-center gap-1.5">{inc.end}</div>
                    <div className="flex items-center gap-1.5 ml-4"><Clock size={14} className="text-gray-400"/> Duration: {inc.duration}</div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SystemHealth;
