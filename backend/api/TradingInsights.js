// frontend/src/components/TradingInsights.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TradingInsights.css';

const TradingInsights = () => {
  const [tradingInsights, setTradingInsights] = useState({
    tradeVolume: [],
    successRate: [],
  });

  useEffect(() => {
    const fetchTradingInsights = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/trading-insights', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Trading Insights:', response.data); // Log the response
        setTradingInsights({
          tradeVolume: response.data.tradeVolume || [],
          successRate: response.data.successRate || [],
        });
      } catch (err) {
        console.error('Error fetching trading insights:', err);
        setTradingInsights({
          tradeVolume: [],
          successRate: [],
        }); // Fallback to empty arrays
      }
    };

    fetchTradingInsights();
  }, []);

  return (
    <div className="trading-insights">
      <h2>Trading Insights</h2>
      <div>
        <h3>Trade Volume</h3>
        <ul>
          {tradingInsights.tradeVolume.map((item) => (
            <li key={item.asset}>
              {item.asset}: {item.volume}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Success Rate</h3>
        <ul>
          {tradingInsights.successRate.map((item) => (
            <li key={item.name}>
              {item.name}: {item.value}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradingInsights;