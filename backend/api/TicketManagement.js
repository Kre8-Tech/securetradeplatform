// frontend/src/components/TicketManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleUpdateTicket = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/support/tickets/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets(tickets.map(ticket => (ticket.id === id ? { ...ticket, status } : ticket)));
      alert('Ticket status updated successfully.');
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket status.');
    }
  };

  if (!token) return <div>You must log in first.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="panel">
      <h1>Support Tickets</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.userId}</td>
              <td>{ticket.description}</td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleUpdateTicket(ticket.id, 'Closed')}>Close Ticket</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketManagement;