// src/components/BusinessMetrics.js
import React from 'react';
//import './BusinessMetrics.css'; // Add styles in BusinessMetrics.css

const BusinessMetrics = () => {
  return (
    <main className="main-content">
      <h1>Business Metrics</h1>
      <div className="metrics">
        <div className="metric-card">
          <h2>Revenue Trends</h2>
          {/* Placeholder for chart */}
          <div className="chart-placeholder">Chart here</div>
        </div>
        <div className="metric-card">
          <h2>Sales Breakdown</h2>
          {/* Placeholder for chart */}
          <div className="chart-placeholder">Chart here</div>
        </div>
      </div>
    </main>
  );
}

export default BusinessMetrics;
