import { useState } from 'react'
import './App.css'

function App() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Replace with your actual Harvard Art Museums API key
  const apiKey = '8b6eae4f-b722-4f23-8d9a-3981ad255873';

  const fetchArtwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get a random page number
      const randomPage = Math.floor(Math.random() * 100) + 1;
      
      // Create URL with query parameters
      let url = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=1&page=${randomPage}&hasimage=1`;
      
      // Add ban list parameters to URL
      banList.forEach(ban => {
        const [type, value] = ban.split(':');
        if (type === 'culture') {
          url += `&culture=${encodeURIComponent(value === 'Unidentified' ? 'Unidentified' : `!${value}`)}`;
        } else if (type === 'technique') {
          url += `&technique=${encodeURIComponent(value === 'Unidentified' ? 'Unidentified' : `!${value}`)}`;
        } else if (type === 'period') {
          url += `&period=${encodeURIComponent(value === 'Unidentified' ? 'Unidentified' : `!${value}`)}`;
        }
      });
      
      console.log('Fetching from:', url);
      
      // Make API call
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.records && data.records.length > 0) {
        const newArtwork = data.records[0];
        
        // Check if this artwork should be banned
        const shouldBeBanned = banList.some(ban => {
          const [type, value] = ban.split(':');
          return (
            (type === 'culture' && newArtwork.culture === value) ||
            (type === 'technique' && newArtwork.technique === value) ||
            (type === 'period' && newArtwork.period === value)
          );
        });
        
        if (shouldBeBanned) {
          // If the artwork should be banned, try again
          fetchArtwork();
        } else {
          // Set the artwork and add to history
          setArtwork(newArtwork);
          setHistory(prevHistory => [...prevHistory, newArtwork]);
        }
      } else {
        setError('Could not find artwork. Try relaxing your ban list.');
      }
    } catch (err) {
      setError('Error fetching artwork: ' + err.message);
      console.error('Error fetching artwork:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add an attribute to the ban list
  const addToBanList = (type, value) => {
    if (value && !banList.includes(`${type}:${value}`)) {
      setBanList([...banList, `${type}:${value}`]);
    }
  };

  // Remove an attribute from the ban list
  const removeFromBanList = (banItem) => {
    setBanList(banList.filter(item => item !== banItem));
  };

  return (
    <div className="app-container">
      <h1>Harvard Art Discovery</h1>
      <p>Discover random artworks. Click on attributes to ban them from future results.</p>
      
      <button 
        onClick={fetchArtwork} 
        disabled={loading}
        className="discover-button"
      >
        {loading ? 'Loading...' : 'Discover New Artwork'}
      </button>
      
      {error && <p className="error-message">{error}</p>}
      
      {/* Ban List Section */}
      <div className="ban-list">
        <h2>Ban List</h2>
        {banList.length === 0 ? (
          <p>No attributes banned yet. Click on any attribute below to ban it.</p>
        ) : (
          <ul>
            {banList.map((ban, index) => {
              const [type, value] = ban.split(':');
              return (
                <li key={index} onClick={() => removeFromBanList(ban)} className="ban-item">
                  <strong>{type}:</strong> {value} (click to remove)
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Artwork Display */}
      {artwork && (
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
                onClick={() => addToBanList('culture', artwork.culture || 'Unidentified')}
                className="clickable-attribute"
              >
                {artwork.culture || 'Unidentified'}
              </span>
            </p>
            
            <p>
              <strong>Technique: </strong>
              <span 
                onClick={() => addToBanList('technique', artwork.technique || 'Unidentified')}
                className="clickable-attribute"
              >
                {artwork.technique || 'Unidentified'}
              </span>
            </p>
            
            <p>
              <strong>Period: </strong>
              <span 
                onClick={() => addToBanList('period', artwork.period || 'Unidentified')}
                className="clickable-attribute"
              >
                {artwork.period || 'Unidentified'}
              </span>
            </p>
            
            <p><strong>Date: </strong>{artwork.dated || 'Unknown'}</p>
          </div>
        </div>
      )}
      
      {/* History Section */}
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
    </div>
  )
}

export default App