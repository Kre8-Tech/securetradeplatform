// frontend/src/components/UserPreferences.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPreferences.css';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'GMT+2',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/user/preferences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreferences(response.data);
      } catch (err) {
        setError('Failed to load preferences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [token]);

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/user/preferences', preferences, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Preferences updated successfully!');
    } catch (err) {
      setError('Failed to update preferences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.patch('http://localhost:5000/api/user/change-password', { newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Password changed successfully!');
    } catch (err) {
      setError('Failed to change password. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.patch('http://localhost:5000/api/user/change-username', { newUsername }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Username changed successfully!');
    } catch (err) {
      setError('Failed to change username. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-preferences">
      <h1>User Preferences</h1>
      {error && <p className="error">{error}</p>}

      <div className="tabs">
        <button onClick={() => setActiveTab('general')} className={activeTab === 'general' ? 'active' : ''}>
          General Settings
        </button>
        <button onClick={() => setActiveTab('security')} className={activeTab === 'security' ? 'active' : ''}>
          Security
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="preferences-form">
          <label>
            Theme:
            <select name="theme" value={preferences.theme} onChange={handlePreferenceChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label>
            Notifications:
            <input
              type="checkbox"
              name="notifications"
              checked={preferences.notifications}
              onChange={handlePreferenceChange}
            />
          </label>

          <label>
            Language:
            <select name="language" value={preferences.language} onChange={handlePreferenceChange}>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="sw">Swahili</option>
              <option value="ha">Hausa</option>
              <option value="ig">Igbo</option>
              <option value="yo">Yoruba</option>
              <option value="am">Amharic</option>
              <option value="ar">Arabic</option>
            </select>
          </label>

          <label>
            Timezone:
            <select name="timezone" value={preferences.timezone} onChange={handlePreferenceChange}>
              <option value="GMT+2">GMT+2</option>
              <option value="GMT+1">GMT+1</option>
              <option value="GMT">GMT</option>
            </select>
          </label>

          <button onClick={handleSavePreferences} disabled={loading}>
            {loading ? 'Updating...' : 'Update Preferences'}
          </button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="preferences-form">
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button onClick={handlePasswordChange} disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>

          <label>
            New Username:
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </label>

          <button onClick={handleUsernameChange} disabled={loading}>
            {loading ? 'Updating...' : 'Change Username'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPreferences;