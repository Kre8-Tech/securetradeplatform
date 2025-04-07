//Overviewmetrics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './OverviewMetrics.css';

const OverviewMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [tradeDistribution, setTradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch metrics overview
        const metricsRes = await axios.get('http://localhost:5000/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(metricsRes.data);

        // Fetch user growth data
        const userGrowthRes = await axios.get('http://localhost:5000/api/analytics/user-growth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserGrowth(userGrowthRes.data);

        // Fetch revenue trends data
        const revenueTrendsRes = await axios.get('http://localhost:5000/api/analytics/revenue-trends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueTrends(revenueTrendsRes.data);

        // Fetch trade distribution data
        const tradeDistributionRes = await axios.get('http://localhost:5000/api/analytics/trade-distribution', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTradeDistribution(tradeDistributionRes.data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="overview-metrics">
      <h2>Platform Metrics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : metrics ? (
        <>
          <div className="metrics-container">
            <div className="metric-card">
              <h3>Total Users</h3>
              <p>{metrics.totalUsers}</p>
            </div>
            <div className="metric-card">
              <h3>Active Users</h3>
              <p>{metrics.activeUsers}</p>
            </div>
            <div className="metric-card">
              <h3>Total Trades</h3>
              <p>{metrics.totalTrades}</p>
            </div>
            <div className="metric-card">
              <h3>Total Revenue</h3>
              <p>${metrics.totalRevenue}</p>
            </div>
            <div className="metric-card uptime">
              <h3>Platform Uptime</h3>
              <p>{metrics.platformUptime}%</p>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="chart-card">
            <h3>User Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trends Chart */}
          <div className="chart-card">
            <h3>Revenue Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Distribution Chart */}
          <div className="chart-card">
            <h3>Trade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tradeDistribution}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No metrics data available.</p>
      )}
    </div>
  );
};

export default OverviewMetrics;
