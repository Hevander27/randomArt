import React from 'react';
import '../styles/DiscoverButton.css';

const DiscoverButton = ({ onClick, isLoading }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className="discover-button"
    >
      {isLoading ? 'Loading...' : 'Discover New Artwork'}
    </button>
  );
};

export default DiscoverButton;