import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  PhoneCall, 
  AlertTriangle, 
  HeartPulse, 
  Users, 
  Settings 
} from 'lucide-react';
import { useAuth } from '../../components/AuthContext';

const NAV_ITEMS = [
  { id: 'Home', path: '/admin', icon: LayoutDashboard },
  { id: 'Client Management', path: '/admin/clients', icon: Building2 },
  { id: 'Call Logs', path: '/admin/call-logs', icon: PhoneCall },
  { id: 'Escalations', path: '/admin/escalations', icon: AlertTriangle },
  { id: 'System Health', path: '/admin/health', icon: HeartPulse },
  { id: 'Team Management', path: '/admin/team', icon: Users },
  { id: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-console flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-1.5 rounded flex items-center justify-center">
               <Building2 size={16} className="text-white" />
            </div>
            <h1 className="text-[17px] font-bold text-gray-900">Admin Console</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`
              }
            >
              <item.icon size={18} strokeWidth={2} />
              {item.id}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gray-50 min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-gray-700">Admin User</span>
             <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2">
               Logout
             </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
