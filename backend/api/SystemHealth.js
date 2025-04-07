import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SystemHealth.css';

const SystemHealth = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystemHealth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must log in first.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/analytics/system-health', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSystemHealth(response.data);
      } catch (err) {
        console.error('Error fetching system health:', err);
        setError('Failed to load system health. Please check the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemHealth();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="system-health">
      <h2>System Health</h2>
      <div className="health-container">
        <div className="health-card">
          <h3>Platform Uptime</h3>
          <p>{systemHealth.platformUptime}%</p>
        </div>
        <div className="health-card">
          <h3>Server Load</h3>
          <p>{systemHealth.serverLoad}%</p>
        </div>
        <div className="health-card">
          <h3>Active Sessions</h3>
          <p>{systemHealth.activeSessions}</p>
        </div>
        <div className="health-card">
          <h3>Database Status</h3>
          <p>{systemHealth.databaseStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;