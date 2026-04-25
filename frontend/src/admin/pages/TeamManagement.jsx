import React, { useState } from 'react';
import { XCircle, X } from 'lucide-react';

const MOCK_TEAM = [
  { id: 1, initials: 'RK', name: 'Rajesh Kumar', email: 'rajesh.kumar@gray.ai', role: 'Admin', login: '2024-01-15 16:45' },
  { id: 2, initials: 'PS', name: 'Priya Sharma', email: 'priya.sharma@gray.ai', role: 'Admin', login: '2024-01-15 15:30' },
  { id: 3, initials: 'AP', name: 'Arun Patel', email: 'arun.patel@gray.ai', role: 'Viewer', login: '2024-01-15 14:20' },
  { id: 4, initials: 'MR', name: 'Meera Reddy', email: 'meera.reddy@gray.ai', role: 'Admin', login: '2024-01-15 13:15' },
  { id: 5, initials: 'VS', name: 'Vikram Singh', email: 'vikram.singh@gray.ai', role: 'Viewer', login: '2024-01-14 18:50' },
  { id: 6, initials: 'AD', name: 'Anjali Desai', email: 'anjali.desai@gray.ai', role: 'Viewer', login: '2024-01-14 17:30' },
  { id: 7, initials: 'KI', name: 'Karthik Iyer', email: 'karthik.iyer@gray.ai', role: 'Admin', login: '2024-01-14 16:10' },
  { id: 8, initials: 'SN', name: 'Sneha Nair', email: 'sneha.nair@gray.ai', role: 'Viewer', login: '2024-01-13 19:25' },
];

const RoleBadge = ({ role }) => {
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-md ${
      role === 'Admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
    }`}>
      {role}
    </span>
  );
};

const AddTeamMemberModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
           <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
           </button>
        </div>
        <div className="p-6 space-y-5">
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input type="text" placeholder="Enter full name" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" placeholder="email@gray.ai" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none">
                 <option>Viewer</option>
                 <option>Admin</option>
              </select>
           </div>
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
             Credentials will be auto-generated and sent to the provided email address.
           </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
           <button className="px-5 py-2 bg-gray-400 text-white rounded-lg text-sm font-semibold cursor-not-allowed">Add Member</button>
        </div>
      </div>
    </div>
  );
};

const TeamManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage Gray internal team access</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden m-0">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr className="bg-white">
                <th className="w-1/3">Name</th>
                <th className="w-1/4">Email</th>
                <th className="w-1/6">Role</th>
                <th className="w-1/6">Last Login</th>
                <th className="w-1/6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TEAM.map((member) => (
                <tr key={member.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                         {member.initials}
                       </div>
                       <span className="font-semibold text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td>{member.email}</td>
                  <td><RoleBadge role={member.role} /></td>
                  <td className="text-gray-500">{member.login}</td>
                  <td className="text-right">
                     <button className="flex items-center justify-end gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                       <XCircle size={14} /> Revoke Access
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
        <div className="mt-0.5 text-gray-500 text-xs text-center border border-gray-400 w-[18px] h-[18px] rounded-full flex items-center justify-center font-serif">i</div>
        <div>
           <h4 className="text-sm font-bold text-gray-900 mb-1">Access Roles</h4>
           <p className="text-sm text-gray-600">
             <span className="font-bold text-gray-900">Admin:</span> Full access to all features including client management and system settings. 
             {' '}
             <span className="font-bold text-gray-900">Viewer:</span> Read-only access to dashboards and reports.
           </p>
        </div>
      </div>

      {isModalOpen && <AddTeamMemberModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default TeamManagement;
