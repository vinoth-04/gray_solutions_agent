import React, { useState, useEffect } from 'react';
import { Phone, CalendarDays, Clock, Bot, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStats, getAppointments } from '../../api';

const StatusBadge = ({ status }) => {
  let styles = '';
  const s = status || 'Booked';
  if (s === 'Booked') styles = 'bg-emerald-100 text-emerald-800';
  else if (s === 'Rescheduled') styles = 'bg-amber-100 text-amber-800';
  else if (s === 'Cancelled') styles = 'bg-rose-100 text-rose-800';
  
  return <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${styles}`}>{s}</span>;
}

const StatCard = ({ icon: Icon, value, label, valueDetails, loading }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
    <div className={`p-3 rounded-lg w-fit bg-gray-50 text-gray-600 mb-6`}>
      <Icon size={20} strokeWidth={2} />
    </div>
    <div className="flex items-center gap-2 mb-1">
       {valueDetails}
       {loading ? (
         <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-lg" />
       ) : (
         <div className="text-3xl font-bold text-gray-900">{value}</div>
       )}
    </div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </div>
);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, aptData] = await Promise.all([
          getStats(),
          getAppointments(5) // Just get latest 5 for home
        ]);
        setStats(statsData);
        setAppointments(aptData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Phone} 
          value={stats?.call_logs?.total_calls || '0'} 
          label="Total Calls Handled" 
          loading={loading}
        />
        <StatCard 
          icon={CalendarDays} 
          value={stats?.appointments?.total || '0'} 
          label="AI Booked Appointments" 
          loading={loading}
        />
        <StatCard 
          icon={Clock} 
          value={stats?.appointments?.today || '0'} 
          label="Appointments Today" 
          loading={loading}
        />
        <StatCard 
          icon={Bot} 
          value="Active" 
          label="Live Call Status" 
          loading={loading}
          valueDetails={<span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />}
        />
      </div>

      <Link to="/escalations" className="block bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-center gap-4 text-amber-900 hover:bg-[#fef3c7] transition-colors group">
         <div className="p-1.5 bg-[#fde68a] text-amber-700 rounded-md">
            <AlertTriangle size={18} />
         </div>
         <div className="font-semibold text-sm flex-1">View unresolved escalations requiring attention</div>
         <div className="text-amber-700 opacity-60 group-hover:opacity-100 transition-opacity font-bold">&rarr;</div>
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden m-0">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent AI Bookings</h2>
          <Link to="/appointments" className="text-sm font-semibold text-gray-900 hover:text-gray-600 underline underline-offset-2">View All</Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-gray-300" size={32} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Syncing with DB...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr className="bg-white">
                  <th className="w-1/4">Patient Name</th>
                  <th className="w-1/6">Date</th>
                  <th className="w-1/6">Time</th>
                  <th className="w-1/4">Contact Number</th>
                  <th className="w-1/6">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="font-semibold text-gray-900">{apt.name}</td>
                    <td className="text-gray-500">{apt.appointment_date}</td>
                    <td className="text-gray-500">{apt.appointment_time?.split(':').slice(0, 2).join(':')}</td>
                    <td className="text-gray-600">{apt.phone}</td>
                    <td><StatusBadge status={apt.call_status} /></td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-gray-400 font-medium">No appointments found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
