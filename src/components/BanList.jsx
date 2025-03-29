import React from 'react';
import '../styles/BanList.css';

const BanList = ({ banList, onRemove }) => {
  return (
    <div className="ban-list">
      <h2>Ban List</h2>
      {banList.length === 0 ? (
        <p>No attributes banned yet. Click on any attribute below to ban it.</p>
      ) : (
        <ul>
          {banList.map((ban, index) => {
            const [type, value] = ban.split(':');
            return (
              <li key={index} onClick={() => onRemove(ban)} className="ban-item">
                <strong>{type}:</strong> {value} (click to remove)
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BanList;