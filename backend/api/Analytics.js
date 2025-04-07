import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [financialData, setFinancialData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tradeData, setTradeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const financial = await axios.get('http://localhost:5000/api/metrics/financial', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userActivity = await axios.get('http://localhost:5000/api/metrics/user-activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trade = await axios.get('http://localhost:5000/api/metrics/trade', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFinancialData(financial.data);
        setUserData(userActivity.data);
        setTradeData(trade.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="analytics-dashboard">
      <h1>Platform Analytics</h1>

      {financialData && (
        <div className="metric-card">
          <h2>Financial Overview</h2>
          <LineChart width={600} height={300} data={financialData.monthlyTrends}>
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
          </LineChart>
        </div>
      )}

      {userData && (
        <div className="metric-card">
          <h2>User Activity</h2>
          <BarChart width={600} height={300} data={userData.actions}>
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      )}

      {tradeData?.regionalDistribution && (
        <div className="metric-card">
          <h2>Regional Trade Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={tradeData.regionalDistribution}
              dataKey="volume"
              nameKey="region"
              cx="50%"
              cy="50%"
              outerRadius={120}
            >
              {tradeData.regionalDistribution.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default Analytics;
