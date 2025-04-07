// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar'; // Import your NavBar component

const Layout = ({ handleLogout }) => {
  return (
    <div>
      <NavBar role="admin" handleLogout={handleLogout} /> {/* Pass handleLogout to NavBar */}
      <div className="content">
        <Outlet /> {/* This is where the main content will be rendered */}
      </div>
    </div>
  );
};

export default Layout;