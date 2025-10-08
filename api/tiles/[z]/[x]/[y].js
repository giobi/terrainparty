// Vercel serverless function for tile proxy
// This handles: /api/tiles/{z}/{x}/{y}.png

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { z, x, y } = req.query;
    
    // Validate tile coordinates
    const zoom = parseInt(z);
    const tileX = parseInt(x);
    const tileY = parseInt(y);
    
    if (isNaN(zoom) || isNaN(tileX) || isNaN(tileY)) {
      return res.status(400).send('Invalid tile coordinates');
    }
    
    const maxTile = Math.pow(2, zoom);
    if (tileX < 0 || tileX >= maxTile || tileY < 0 || tileY >= maxTile) {
      return res.status(400).send('Tile coordinates out of range');
    }
    
    // Fetch tile from tile servers
    // Using multiple providers with fallback for better reliability
    const tileProviders = [
      // CartoDB Voyager - Free, no API key required, better for production
      `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tileX}/${tileY}.png`,
      // OpenStreetMap - Fallback option
      `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`
    ];
    
    let lastError;
    for (const tileUrl of tileProviders) {
      try {
        const response = await axios.get(tileUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'TerrainParty/1.0',
            'Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : 'https://terrainparty.vercel.app/'
          },
          timeout: 10000
        });
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        return res.send(response.data);
      } catch (error) {
        lastError = error;
        console.log(`Failed to fetch from ${tileUrl.split('/')[2]}, trying next provider...`);
        continue;
      }
    }
    
    // If all providers fail, throw the last error
    throw lastError;
  } catch (error) {
    console.error('Error fetching tile:', error.message);
    res.status(500).send('Failed to fetch tile');
  }
};
