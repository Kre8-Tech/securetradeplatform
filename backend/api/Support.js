// frontend/src/components/Support.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Support.css';

const Support = () => {
  const [activeTab, setActiveTab] = useState('ticket');
  const [ticketDescription, setTicketDescription] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/support/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  const handleOpenTicket = async (e) => {
    e.preventDefault();
    setError('');

    if (!ticketDescription) {
      setError('Ticket description is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/support/ticket', {
        description: ticketDescription,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets([...tickets, response.data.ticket]);
      setTicketDescription('');
      alert('Ticket opened successfully: ' + response.data.message);
    } catch (err) {
      console.error('Error opening ticket:', err);
      setError('Failed to open ticket. Please try again later.');
    }
  };

  return (
    <div className="support-container">
      <h1>Support</h1>
      {error && <p className="error">{error}</p>}
      <div className="tabs">
        <button onClick={() => setActiveTab('ticket')} className={activeTab === 'ticket' ? 'active' : ''}>
          Open a Ticket
        </button>
        <button onClick={() => setActiveTab('tickets')} className={activeTab === 'tickets' ? 'active' : ''}>
          My Tickets
        </button>
      </div>

      {activeTab === 'ticket' && (
        <form onSubmit={handleOpenTicket}>
          <label>
            Ticket Description:
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Describe your issue..."
              required
            />
          </label>
          <button type="submit">Submit Ticket</button>
        </form>
      )}

      {activeTab === 'tickets' && (
        <div>
          <h2>My Tickets</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.status}</td>
                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Support;