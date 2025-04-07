// frontend/src/components/useDashboardData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useDashboardData = () => {
  const [userActivity, setUserActivity] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user activity
        const activityResponse = await axios.get('http://localhost:5000/api/user/activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserActivity(activityResponse.data);

        // Fetch transactions
        const transactionsResponse = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(transactionsResponse.data);

        // Fetch announcements (what's new)
        const whatsNewResponse = await axios.get('http://localhost:5000/api/whats-new', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWhatsNew(whatsNewResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please check your network connection and try again.');
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

  return { userActivity, transactions, whatsNew, loading, error };
};

export default useDashboardData;