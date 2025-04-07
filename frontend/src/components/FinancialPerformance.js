// frontend/src/components/FinancialPerformance.js
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './AdminDashboard.css'; // Use centralized CSS

const FinancialPerformance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/financial-performance')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching financial performance:', error));
  }, []);

  return (
    <div className="financial-performance">
      <h2>Financial Performance</h2>
      <div className="chart-container">
        <AreaChart width={600} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </div>
    </div>
  );
};

export default FinancialPerformance;