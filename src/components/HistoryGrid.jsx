import React from 'react';
import '../styles/HistoryGrid.css';

const HistoryGrid = ({ history }) => {
  return (
    <div className="history-section">
      <h2>History</h2>
      {history.length === 0 ? (
        <p>No history yet. Click the Discover button to see artworks.</p>
      ) : (
        <div className="history-grid">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              {item.primaryimageurl && (
                <img 
                  src={item.primaryimageurl} 
                  alt={item.title || 'Artwork'} 
                  className="history-image"
                />
              )}
              <p>{item.title || 'Untitled'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryGrid;