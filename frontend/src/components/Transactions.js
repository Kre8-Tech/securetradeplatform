// frontend/src/components/Transactions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paymentMode: '',
    creatorEmail: '',
    creatorPhone: '',
    otherPartyEmail: '',
    otherPartyPhone: '',
    courier: ''
  });
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors
    const { description, amount, paymentMode, creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, courier } = formData;

    if (!description || !amount || !paymentMode || !creatorEmail || !creatorPhone || !otherPartyEmail || !otherPartyPhone) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/transactions',
        { description, amount, paymentMode, creatorEmail, creatorPhone, otherPartyEmail, otherPartyPhone, courier },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions([...transactions, response.data]);
      setFormData({
        description: '',
        amount: '',
        paymentMode: '',
        creatorEmail: '',
        creatorPhone: '',
        otherPartyEmail: '',
        otherPartyPhone: '',
        courier: ''
      });
      alert('Transaction added successfully.');
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.response?.data?.message || 'Failed to add transaction.');
    }
  };

  if (!token) return <div>You must log in first.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="panel">
      <h1>Transactions</h1>
      {role === 'admin' ? (
        <p>Admin View: All Transactions</p>
      ) : (
        <p>User View: Your Transactions</p>
      )}

      {/* Add Transaction Form */}
      <form onSubmit={handleAddTransaction}>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            required
          />
        </label>
        <label>
          Payment Mode:
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Payment Mode</option>
            <option value="TNM Mpamba">TNM Mpamba</option>
            <option value="Airtel Money">Airtel Money</option>
            <option value="National Bank">National Bank</option>
            <option value="Standard Bank">Standard Bank</option>
            <option value="FDH Bank">FDH Bank</option>
            <option value="NBS Bank">NBS Bank</option>
            <option value="Ecobank">Ecobank</option>
            <option value="FMB">FMB</option>
          </select>
        </label>
        <label>
          Your Email:
          <input
            type="email"
            name="creatorEmail"
            value={formData.creatorEmail}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
          />
        </label>
        <label>
          Your Phone:
          <input
            type="text"
            name="creatorPhone"
            value={formData.creatorPhone}
            onChange={handleInputChange}
            placeholder="Your Phone"
            required
          />
        </label>
        <label>
          Other Party Email:
          <input
            type="email"
            name="otherPartyEmail"
            value={formData.otherPartyEmail}
            onChange={handleInputChange}
            placeholder="Other Party Email"
            required
          />
        </label>
        <label>
          Other Party Phone:
          <input
            type="text"
            name="otherPartyPhone"
            value={formData.otherPartyPhone}
            onChange={handleInputChange}
            placeholder="Other Party Phone"
            required
          />
        </label>
        <label>
          Courier:
          <input
            type="text"
            name="courier"
            value={formData.courier}
            onChange={handleInputChange}
            placeholder="Courier (Optional)"
          />
        </label>
        <button type="submit">Add Transaction</button>
      </form>
      {error && <p className="error">{error}</p>}

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount (MWK)</th>
            <th>Payment Mode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.paymentMode}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;