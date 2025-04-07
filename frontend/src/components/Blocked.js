// frontend/src/components/Blocked.js
import React from 'react';
import './Blocked.css';

const Blocked = () => {
  return (
    <div className="blocked-container">
      <h1>Your Account is Blocked</h1>
      <p>Please complete your payment to activate your account.</p>
      <p>Contact admin on WhatsApp: <a href="https://wa.me/265992329064">+265992329064</a></p>
    </div>
  );
};

export default Blocked;