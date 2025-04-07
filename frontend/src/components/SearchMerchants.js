// frontend/src/components/SearchMerchants.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Panel.css'; // Use panel.css for consistent styling

const SearchMerchants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setError('Please enter a search query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/merchants/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMerchants(response.data);
    } catch (err) {
      setError('Failed to fetch merchants. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h1>Search Merchants</h1>
      <form onSubmit={handleSearch}>
        <label>
          Search:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter merchant name or location"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : merchants.length > 0 ? (
        <ul>
          {merchants.map((merchant) => (
            <li key={merchant.id} className="merchant-card">
              <h2>{merchant.name}</h2>
              <p>Email: {merchant.email}</p>
              <p>Role: {merchant.role}</p>
              <p>Location: {merchant.location}</p>
              <p>Contact: {merchant.contact}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No merchants found.</p>
      )}
    </div>
  );
};

export default SearchMerchants;