import React, { useState } from 'react';
import axios from 'axios';
import './PostWhatsNew.css';

const PostWhatsNew = () => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/whats-new', { type, message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data) {
        setType('');
        setMessage('');
      }
    } catch (error) {
      console.error('Posting what\'s new failed:', error);
      setError('Posting what\'s new failed. Please try again.');
    }
  };

  return (
    <div className="post-whats-new">
      <h2>Post What's New</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="news">News</option>
          <option value="offer">Offer</option>
        </select>
        <textarea
          name="message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostWhatsNew;