import React, { useState } from 'react';
import axios from 'axios';
import './CustomReports.css';

const CustomReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [asset, setAsset] = useState('');
  const [reports, setReports] = useState([]);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/analytics/custom-reports?startDate=${startDate}&endDate=${endDate}&asset=${asset}`
      );
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching custom reports:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/analytics/custom-reports/download?startDate=${startDate}&endDate=${endDate}&asset=${asset}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'custom_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading custom report:', error);
    }
  };

  return (
    <div>
      <h1>Custom Reports</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Asset:
          <input type="text" value={asset} onChange={(e) => setAsset(e.target.value)} placeholder="e.g., BTC" />
        </label>
        <button onClick={handleGenerateReport}>Generate Report</button>
      </form>
      {reports.length > 0 && (
        <div>
          <h2>Report Results</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Asset</th>
                <th>User</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.date}</td>
                  <td>{report.asset}</td>
                  <td>{report.user}</td>
                  <td>{report.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownloadReport}>Download Report</button>
        </div>
      )}
    </div>
  );
};

export default CustomReports;