// frontend/src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './AdminDashboard.css';
import FinancialPerformance from './FinancialPerformance';
import PredictiveAnalytics from './PredictiveAnalytics';
import TradingInsights from './TradingInsights';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!token) {
        setError('You must log in first.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics. Please check the server.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Transactions:', response.data); // Log the response
        setTransactions(Array.isArray(response.data) ? response.data : []); // Ensure transactions is always an array
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setTransactions([]); // Fallback to an empty array
      }
    };

    fetchMetrics();
    fetchTransactions();
  }, [token]);

  if (!token) return <Navigate to="/login" />;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">
        {/* Analytics Tile */}
        <div className="tile analytics" style={{ gridRow: '1', gridColumn: '1' }}>
          <h2>Analytics</h2>
          <FinancialPerformance />
        </div>

        {/* Financial Performance Tile */}
        <div className="tile financial-performance" style={{ gridRow: '1', gridColumn: '2' }}>
          <h2>Financial Performance</h2>
          <PredictiveAnalytics />
        </div>

        {/* Predictive Analytics Tile */}
        <div className="tile predictive-analytics" style={{ gridRow: '2', gridColumn: '1' }}>
          <h2>Predictive Analytics</h2>
          <TradingInsights />
        </div>

        {/* Trading Insights Tile */}
        <div className="tile trading-insights" style={{ gridRow: '2', gridColumn: '2' }}>
          <h2>Trading Insights</h2>
          <TradingInsights />
        </div>

        {/* Current Transactions Tile */}
        <div className="tile transactions" style={{ gridRow: '3', gridColumn: '1 / span 2' }}>
          <h2>Current Transactions</h2>
          <ul>
            {transactions.slice(0, 10).map((transaction) => (
              <li key={transaction.id}>
                {transaction.id}: {transaction.amount} - {transaction.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;