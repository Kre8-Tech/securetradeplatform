// frontend/src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h3>SecureTradePortal</h3>

      {/* Dashboard Link for All Users */}
      <Link to={role === 'admin' ? '/admin-dashboard' : role === 'customer' ? '/customer-dashboard' : role === 'merchant' ? '/merchant-dashboard' : '/courier-dashboard'}>
        Dashboard
      </Link>

      {/* Admin-Specific Links */}
      {role === 'admin' && (
        <>
          <Link to="/user-management">User Management</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/manage-whats-new">Manage What's New</Link>
          <Link to="/support-tickets">Support Tickets</Link> {/* Added Ticket Management Link */}
        </>
      )}

      {/* Common Links for All Users */}
      <Link to="/transactions">Transactions</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/search-merchants">Search Merchants</Link>
      <Link to="/whats-new">What's New</Link>
      <Link to="/support">Support</Link>

      {/* User Preferences Link */}
      <Link to="/user-preferences">User Preferences</Link>

      {/* Logout Button */}
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Sidebar;