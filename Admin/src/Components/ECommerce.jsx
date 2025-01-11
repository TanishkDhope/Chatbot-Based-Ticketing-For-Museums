// src/components/ECommerce.js
import React from 'react';
//import './ECommerce.css'; // Add styles in ECommerce.css

const ECommerce = () => {
  return (
    <main className="main-content">
      <h1>E-Commerce</h1>
      <div className="e-commerce">
        <h2>Souvenir Items</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example item */}
            <tr>
              <td>Keychain</td>
              <td>$5</td>
              <td>100</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
            {/* More items */}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ECommerce;
