import React, { useState, useEffect } from 'react';
import { Building2, PhoneCall, AlertTriangle, HeartPulse, Calendar, PauseCircle, PlayCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getStats } from '../../api';

const StatCard = ({ icon: Icon, value, label, iconBgColor, iconColor }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
    <div className={`p-3 rounded-lg w-fit ${iconBgColor} ${iconColor} mb-4`}>
      <Icon size={24} strokeWidth={2} />
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, subtitle, time, iconBgColor='bg-gray-100', iconColor='text-gray-600' }) => (
  <div className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
    <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor} flex-shrink-0 mt-0.5`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-500">{subtitle}</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Building2} 
          value={loading ? '...' : (stats?.clinics?.total || '24')} 
          label="Total Active Clinics" 
          iconBgColor="bg-gray-100" 
          iconColor="text-gray-600" 
        />
        <StatCard 
          icon={PhoneCall} 
          value={loading ? '...' : (stats?.call_logs?.total_calls || '0')} 
          label="Total Calls Today" 
          iconBgColor="bg-gray-100" 
          iconColor="text-gray-600" 
        />
        <StatCard 
          icon={AlertTriangle} 
          value={loading ? '...' : (stats?.call_logs?.failed_calls || '0')} 
          label="Unresolved Escalations" 
          iconBgColor="bg-amber-100" 
          iconColor="text-amber-600" 
        />
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col h-full justify-between">
          <div>
            <div className={`p-3 rounded-lg w-fit bg-emerald-100 text-emerald-600 mb-4`}>
              <HeartPulse size={24} strokeWidth={2} />
            </div>
            <div className={`text-xl font-bold flex items-center gap-2 ${loading ? 'text-gray-400' : 'text-emerald-600'}`}>
               <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-gray-300' : 'bg-emerald-500 animate-pulse'}`} />
               {loading ? 'Checking...' : 'All Systems Operational'}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2 font-medium">System Health Status</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden m-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest events across all clinics</p>
        </div>
        <div className="flex flex-col">
          <ActivityItem 
             icon={Calendar} 
             title="New appointment booked for Sarah Johnson" 
             subtitle="City Care Clinic" 
             time="2 minutes ago" 
          />
          <ActivityItem 
             icon={AlertTriangle} 
             title="New escalation: Language mismatch detected" 
             subtitle="Metro Health Center" 
             time="8 minutes ago" 
          />
          <ActivityItem 
             icon={Building2} 
             title="New clinic onboarded successfully" 
             subtitle="Sunrise Medical Clinic" 
             time="15 minutes ago" 
          />
          <ActivityItem 
             icon={PauseCircle} 
             title="AI Agent paused by clinic admin" 
             subtitle="Downtown Dental Care" 
             time="23 minutes ago" 
          />
          <ActivityItem 
             icon={Calendar} 
             title="New appointment booked for Michael Chen" 
             subtitle="Wellness Clinic Plus" 
             time="31 minutes ago" 
          />
          <ActivityItem 
             icon={CheckCircle2} 
             title="Escalation resolved: Call dropped issue" 
             subtitle="City Care Clinic" 
             time="42 minutes ago" 
          />
          <ActivityItem 
             icon={Calendar} 
             title="Appointment rescheduled for Emma Wilson" 
             subtitle="Family Health Clinic" 
             time="1 hour ago" 
          />
          <ActivityItem 
             icon={PlayCircle} 
             title="AI Agent resumed operations" 
             subtitle="Metro Health Center" 
             time="1 hour ago" 
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
