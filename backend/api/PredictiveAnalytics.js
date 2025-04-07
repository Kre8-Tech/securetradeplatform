// frontend/src/components/PredictiveAnalytics.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './AdminDashboard.css'; // Use centralized CSS

const PredictiveAnalytics = () => {
  const [assetPricePredictions, setAssetPricePredictions] = useState([]);
  const [userChurnPredictions, setUserChurnPredictions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/predictive-analytics')
      .then((response) => response.json())
      .then((data) => {
        setAssetPricePredictions(data.assetPricePredictions);
        setUserChurnPredictions(data.userChurnPredictions);
      })
      .catch((error) => console.error('Error fetching predictive analytics:', error));
  }, []);

  return (
    <div className="predictive-analytics">
      <h2>Predictive Analytics</h2>

      <div className="chart-container">
        <h3>Asset Price Predictions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={assetPricePredictions}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="predictedPrice" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>User Churn Predictions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userChurnPredictions}>
            <XAxis dataKey="userId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="churnProbability" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;