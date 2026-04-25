import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Login from '../components/Login';
import AdminLayout from './components/AdminLayout';
import './admin.css';

// Lazy loading or direct imports of pages
import Home from './pages/Home';
import ClientManagement from './pages/ClientManagement';
import CallLogs from './pages/CallLogs';
import Escalations from './pages/Escalations';
import SystemHealth from './pages/SystemHealth';
import TeamManagement from './pages/TeamManagement';
import Settings from './pages/Settings';

const AdminApp = () => {
  const { isAuthenticated, user, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={(e, p) => login(e, p)} type="Admin" />;
  }

  // Role Guard: Prevents Vendors from accessing the Admin portal
  if (user?.type !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Home />} />
        <Route path="clients" element={<ClientManagement />} />
        <Route path="call-logs" element={<CallLogs />} />
        <Route path="escalations" element={<Escalations />} />
        <Route path="health" element={<SystemHealth />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;

