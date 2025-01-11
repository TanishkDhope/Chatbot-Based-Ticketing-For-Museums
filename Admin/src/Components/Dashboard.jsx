// src/components/Dashboard.js
import React from 'react';
//import './Dashboard.css'; // Add styles in Dashboard.css

const Dashboard = () => {
  return (
    <main className="main-content">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h2>Total Tickets Sold</h2>
          <p>1,234</p>
        </div>
        <div className="card">
          <h2>Total Revenue</h2>
          <p>$12,345</p>
        </div>
        <div className="card">
          <h2>Total Visitors</h2>
          <p>567</p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
