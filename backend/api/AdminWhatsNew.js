// frontend/src/components/AdminWhatsNew.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css'; // Use panel.css for consistent styling

const AdminWhatsNew = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ type: 'news', message: '' });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        setError('You must log in first.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/whats-new', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts.');
      }
    };
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors
    try {
      const response = await axios.post('http://localhost:5000/api/admin/whats-new', newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts([response.data, ...posts]); // Add new post to top
      setNewPost({ type: 'news', message: '' });
      alert('Update posted successfully.');
    } catch (err) {
      console.error('Error posting update:', err);
      setError('Failed to post update. Admin privileges required.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  if (!token) return <p>You must log in first.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Manage What's New</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" value={newPost.type} onChange={handleInputChange}>
            <option value="news">News</option>
            <option value="offer">Special Offer</option>
            <option value="update">Platform Update</option>
          </select>
        </label>
        <br />
        <label>
          Message:
          <textarea
            name="message"
            value={newPost.message}
            onChange={handleInputChange}
            placeholder="Enter your announcement here"
            required
          />
        </label>
        <br />
        <button type="submit">Publish Update</button>
      </form>
      {error && <p>{error}</p>}
      <h3>Published Announcements</h3>
      {posts.length === 0 ? (
        <p>No announcements yet</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.type === 'news' ? '📰 News' : post.type === 'offer' ? '🎉 Offer' : '🆕 Update'} -{' '}
              {new Date(post.date).toLocaleDateString()} - {post.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminWhatsNew;