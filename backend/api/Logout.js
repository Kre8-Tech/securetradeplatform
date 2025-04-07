import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    console.log('Token cleared from localStorage'); // Debugging

    // Redirect to the login page after a short delay
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 1000); // 1-second delay before redirecting

    return () => clearTimeout(timeout); // Cleanup the timeout
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logged Out</h2>
      <p>You have been successfully logged out.</p>
      <p>Redirecting to the login page...</p>
    </div>
  );
};

export default Logout;