import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panel.css';
import { format, isSameDay } from 'date-fns';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setError('You must log in first.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDownload = async (id, format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/download/${id}?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report.');
    }
  };

  return (
    <div className="panel">
      <h1>Reports</h1>
      <div>
        <label htmlFor="date-selector">Select Date:</label>
        <input
          type="date"
          id="date-selector"
          value={selectedDate || ''} // Ensure it's never null
          onChange={handleDateChange}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {reports
            .filter(report => !selectedDate || isSameDay(new Date(report.date), new Date(selectedDate)))
            .map((report) => (
              <li key={report.id} className="report-card">
                <h2>{report.title}</h2>
                <p>Date: {format(new Date(report.date), 'yyyy-MM-dd')}</p>
                <p>{report.content}</p>
                <div>
                  <button onClick={() => handleDownload(report.id, 'csv')} className="download-csv">
                    Download CSV
                  </button>
                  <button onClick={() => handleDownload(report.id, 'pdf')} className="download-pdf">
                    Download PDF
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Reports;