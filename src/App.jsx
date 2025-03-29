import React, { useState, useEffect } from 'react';
import ArtworkCard from './components/ArtworkCard';
import BanList from './components/BanList';
import DiscoverButton from './components/DiscoverButton';
import HistoryGrid from './components/HistoryGrid';
import { fetchRandomArtwork } from './services/artService';
import './styles/App.css';

function App() {
  // State variables
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  // Function to get a new artwork
  const handleDiscover = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newArtwork = await fetchRandomArtwork(banList);
      
      if (newArtwork) {
        setArtwork(newArtwork);
        setHistory(prevHistory => [...prevHistory, newArtwork]);
      } else {
        setError('Could not find artwork. Try relaxing your ban list.');
      }
    } catch (err) {
      setError('Error fetching artwork. Please try again.');
      console.error('Error fetching artwork:', err);
    } finally {
      setIsLoading(false);
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
    <div className="App">
      <header className="App-header">
        <h1>Art Discovery</h1>
        <p>Discover random artworks from the Harvard Art Museums. Click on attributes to ban them from future results.</p>
        
        <DiscoverButton 
          onClick={handleDiscover} 
          isLoading={isLoading} 
        />
        
        {error && <p className="error">{error}</p>}
        
        <BanList 
          banList={banList} 
          onRemove={removeFromBanList} 
        />
        
        {artwork && (
          <ArtworkCard 
            artwork={artwork} 
            onAddToBan={addToBanList} 
          />
        )}
        
        <HistoryGrid history={history} />
      </header>
    </div>
  );
}

export default App;