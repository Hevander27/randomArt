// Harvard Art Museums API key
// In a real application, you would want to store this in a .env file
const apiKey = 'YOUR_API_KEY';

// Function to fetch a random artwork
export const fetchRandomArtwork = async (banList) => {
  // Get a random page number between 1 and 100
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
  
  // Check if data exists and has records
  if (data && data.records && data.records.length > 0) {
    // Get the first record
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
      return fetchRandomArtwork(banList);
    } else {
      return newArtwork;
    }
  } else {
    // If no records were found, try again with fewer restrictions
    if (banList.length > 0) {
      console.log('No results found with current ban list. Trying with fewer restrictions.');
      // This is a simplification - in a real app, you might want to be more strategic
      // about which ban list items to temporarily ignore
      return null;
    }
    return null;
  }
};