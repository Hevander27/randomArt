import React from 'react';
import '../styles/ArtworkCard.css';

const ArtworkCard = ({ artwork, onAddToBan }) => {
  return (
    <div className="artwork-container">
      <h2>{artwork.title || 'Untitled'}</h2>
      
      {artwork.primaryimageurl && (
        <img 
          src={artwork.primaryimageurl} 
          alt={artwork.title || 'Artwork'} 
          className="artwork-image"
        />
      )}
      
      <div className="artwork-details">
        <p>
          <strong>Culture: </strong>
          <span 
            onClick={() => onAddToBan('culture', artwork.culture || 'Unidentified')}
            className="clickable-attribute"
          >
            {artwork.culture || 'Unidentified'}
          </span>
        </p>
        
        <p>
          <strong>Technique: </strong>
          <span 
            onClick={() => onAddToBan('technique', artwork.technique || 'Unidentified')}
            className="clickable-attribute"
          >
            {artwork.technique || 'Unidentified'}
          </span>
        </p>
        
        <p>
          <strong>Period: </strong>
          <span 
            onClick={() => onAddToBan('period', artwork.period || 'Unidentified')}
            className="clickable-attribute"
          >
            {artwork.period || 'Unidentified'}
          </span>
        </p>
        
        <p><strong>Date: </strong>{artwork.dated || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default ArtworkCard;