// frontend/src/components/WhatsNew.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css'; // Use panel.css for consistent styling

const WhatsNew = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        setError('You must log in first.');
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  if (!token) return <div>You must log in first.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="panel">
      <h1>What's New</h1>
      {posts.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post-card">
              <h3>{post.type === 'news' ? '📰 News' : post.type === 'offer' ? '🎉 Offer' : '🆕 Update'}</h3>
              <p>{new Date(post.date).toLocaleDateString()}</p>
              <p>{post.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhatsNew;