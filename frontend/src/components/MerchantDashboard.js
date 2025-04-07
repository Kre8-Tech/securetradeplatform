// frontend/src/components/MerchantDashboard.js
import React from 'react';
import useDashboardData from './useDashboardData';
import UserActivity from './UserActivity';
import Transactions from './Transactions';
import WhatsNew from './WhatsNew';
import './MerchantDashboard.css';

const MerchantDashboard = () => {
  const { userActivity, transactions, whatsNew, loading, error } = useDashboardData();

  return (
    <div className="merchant-dashboard">
      <h1>Merchant Dashboard</h1>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}
          <div className="dashboard-content">
            <div className="top-row">
              <div className="tile">
                <h2>Your Activity</h2>
                <UserActivity activity={userActivity} />
              </div>
              <div className="tile">
                <h2>What's New</h2>
                <WhatsNew content={whatsNew} />
              </div>
            </div>
            <div className="bottom-row">
              <div className="tile large">
                <h2>Your Transactions</h2>
                <Transactions transactions={transactions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MerchantDashboard;