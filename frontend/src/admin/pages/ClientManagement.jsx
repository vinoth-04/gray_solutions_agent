import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AddNewClinicModal from '../components/AddNewClinicModal'; // We will create this next

const MOCK_CLINICS = [
  { id: 1, name: 'City Care Clinic', location: 'Chennai, Tamil Nadu', status: 'Active', date: 'Jan 15, 2024', calls: '487' },
  { id: 2, name: 'Metro Health Center', location: 'Mumbai, Maharashtra', status: 'Active', date: 'Feb 1, 2024', calls: '623' },
  { id: 3, name: 'Sunrise Medical Clinic', location: 'Bangalore, Karnataka', status: 'Trial', date: 'Mar 10, 2024', calls: '156' },
  { id: 4, name: 'Downtown Dental Care', location: 'Delhi, NCR', status: 'Paused', date: 'Jan 20, 2024', calls: '342' },
  { id: 5, name: 'Wellness Clinic Plus', location: 'Hyderabad, Telangana', status: 'Active', date: 'Feb 15, 2024', calls: '534' },
  { id: 6, name: 'Family Health Clinic', location: 'Pune, Maharashtra', status: 'Active', date: 'Jan 28, 2024', calls: '412' },
  { id: 7, name: 'Advanced Ortho Center', location: 'Kolkata, West Bengal', status: 'Deactivated', date: 'Dec 10, 2023', calls: '0' },
  { id: 8, name: 'Heart Care Specialty', location: 'Ahmedabad, Gujarat', status: 'Active', date: 'Feb 20, 2024', calls: '298' },
];

const StatusBadge = ({ status }) => {
  let bgColor, textColor;
  switch (status) {
    case 'Active':
      bgColor = 'bg-emerald-100'; textColor = 'text-emerald-700'; break;
    case 'Paused':
      bgColor = 'bg-amber-100'; textColor = 'text-amber-700'; break;
    case 'Trial':
      bgColor = 'bg-gray-100'; textColor = 'text-gray-700'; break;
    case 'Deactivated':
      bgColor = 'bg-rose-100'; textColor = 'text-rose-700'; break;
    default:
      bgColor = 'bg-gray-100'; textColor = 'text-gray-700';
  }
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const ClientManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClinics = MOCK_CLINICS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all clinic accounts and configurations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add New Clinic
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden m-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by clinic name or location..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none w-48"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Trial</option>
            <option>Paused</option>
            <option>Deactivated</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr className="bg-white">
                <th className="w-1/4">Clinic Name</th>
                <th className="w-1/4">Location</th>
                <th className="w-1/6">Status</th>
                <th className="w-1/6">Onboarding Date</th>
                <th className="w-1/6">Calls This Month</th>
                <th className="w-1/4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="group">
                  <td className="font-semibold text-gray-900">{clinic.name}</td>
                  <td>{clinic.location}</td>
                  <td><StatusBadge status={clinic.status} /></td>
                  <td>{clinic.date}</td>
                  <td className="font-medium text-gray-900">{clinic.calls}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-semibold hover:bg-gray-50 text-gray-700">View</button>
                      {clinic.status !== 'Deactivated' && (
                        <button className={`text-xs font-semibold ${clinic.status === 'Paused' ? 'text-emerald-600 hover:text-emerald-700' : 'text-amber-600 hover:text-amber-700'}`}>
                          {clinic.status === 'Paused' ? 'Resume' : 'Pause'}
                        </button>
                      )}
                      <button className="text-xs font-semibold text-rose-600 hover:text-rose-700">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <AddNewClinicModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ClientManagement;
