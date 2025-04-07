// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import CourierDashboard from './components/CourierDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Transactions from './components/Transactions';
import Notifications from './components/Notifications';
import SearchMerchants from './components/SearchMerchants';
import WhatsNew from './components/WhatsNew';
import AdminWhatsNew from './components/AdminWhatsNew';
import Blocked from './components/Blocked';
import Unauthorized from './components/Unauthorized';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import UserStats from './components/UserStats';
import SystemHealth from './components/SystemHealth';
import UserPreferences from './components/UserPreferences';
import Support from './components/Support';
import TicketManagement from './components/TicketManagement'; // Import the TicketManagement component
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    }
  }, [token, role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'customer':
        return '/customer-dashboard';
      case 'courier':
        return '/courier-dashboard';
      case 'merchant':
        return '/merchant-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <div className="app-container">
        {token && <Sidebar role={role} handleLogout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
            <Route path="/register" element={<Register setToken={setToken} setRole={setRole} />} />
            <Route path="/blocked" element={<Blocked />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/user-preferences"
              element={
                <ProtectedRoute>
                  <UserPreferences />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={token ? <Navigate to={getDashboardPath()} /> : <Navigate to="/login" />}
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courier-dashboard"
              element={
                <ProtectedRoute role="courier">
                  <CourierDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/merchant-dashboard"
              element={
                <ProtectedRoute role="merchant">
                  <MerchantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute role="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-merchants"
              element={
                <ProtectedRoute>
                  <SearchMerchants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/whats-new"
              element={
                <ProtectedRoute>
                  <WhatsNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support-tickets"
              element={
                <ProtectedRoute role="admin">
                  <TicketManagement />
                </ProtectedRoute>
              }
            /> {/* Added route for Ticket Management */}
            <Route
              path="/manage-whats-new"
              element={
                <ProtectedRoute role="admin">
                  <AdminWhatsNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-stats"
              element={
                <ProtectedRoute role="admin">
                  <UserStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/system-health"
              element={
                <ProtectedRoute role="admin">
                  <SystemHealth />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;