// frontend/src/components/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleBlockUnblock = async (id, blocked) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${id}/block`,
        { blocked: !blocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => (user.id === id ? { ...user, blocked: !blocked } : user)));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status.');
    }
  };

  const handleRedFlag = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${id}/redflag`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => (user.id === id ? { ...user, redFlagged: true } : user)));
      alert('User red-flagged successfully.');
    } catch (err) {
      console.error('Error red-flagging user:', err);
      setError('Failed to red-flag user.');
    }
  };

  if (!token) return <div>You must log in first.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="panel">
      <h1>User Management</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-card">
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.blocked ? 'Blocked' : 'Active'}</p>
            <button onClick={() => handleBlockUnblock(user.id, user.blocked)} className={user.blocked ? 'unblock' : 'block'}>
              {user.blocked ? 'Unblock' : 'Block'}
            </button>
            <button onClick={() => handleRedFlag(user.id)} className="red-flag" disabled={user.redFlagged}>
              {user.redFlagged ? 'Red-Flagged' : 'Red Flag'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;