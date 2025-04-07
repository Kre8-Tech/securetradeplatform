// frontend/src/components/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerDashboard.css';
import WhatsNew from './WhatsNew';

const CustomerDashboard = () => {
  const [userActivity, setUserActivity] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await axios.get('http://localhost:5000/api/user/activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserActivity(Array.isArray(activityResponse.data) ? activityResponse.data : []);

        const transactionsResponse = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(Array.isArray(transactionsResponse.data) ? transactionsResponse.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check your network connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('You must log in first.');
      setLoading(false);
    }
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="customer-dashboard">
      <h1>Customer Dashboard</h1>
      <div className="dashboard-content">
        <div className="tile">
          <h2>Your Activity</h2>
          <ul>
            {userActivity.map((activity) => (
              <li key={activity.id}>{activity.action}</li>
            ))}
          </ul>
        </div>
        <div className="tile">
          <h2>What's New</h2>
          <WhatsNew />
        </div>
        <div className="tile">
          <h2>Your Transactions</h2>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.description}: {transaction.amount} - {transaction.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;