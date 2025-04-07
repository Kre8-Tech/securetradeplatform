import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserStats.css';

const UserStats = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must log in first.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/analytics/user-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserStats(response.data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load user stats. Please check the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-stats">
      <h2>User Stats</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{userStats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{userStats.activeUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Blocked Users</h3>
          <p>{userStats.blockedUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Red-Flagged Users</h3>
          <p>{userStats.redFlaggedUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;