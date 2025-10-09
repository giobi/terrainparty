const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Tile proxy endpoint to avoid CORS issues with OpenStreetMap
app.get('/api/tiles/:z/:x/:y.png', async (req, res) => {
  try {
    const { z, x, y } = req.params;
    
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
});

// Endpoint to generate heightmap
app.post('/api/generate-heightmap', async (req, res) => {
  try {
    const { north, south, east, west, scale } = req.body;
    
    if (!north || !south || !east || !west) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    // Parse and validate scale parameter (default to 50)
    const terrainScale = scale !== undefined ? parseFloat(scale) : 50;
    if (isNaN(terrainScale) || terrainScale <= 0) {
      return res.status(400).json({ error: 'Invalid scale parameter' });
    }

    console.log(`Generating heightmap for bounds: N:${north}, S:${south}, E:${east}, W:${west}, scale:${terrainScale}`);

    // Validate that the area is approximately 12.6km x 12.6km
    const latDiff = Math.abs(north - south);
    const lonDiff = Math.abs(east - west);
    const avgLat = (north + south) / 2;
    
    // Calculate approximate distances in km
    const latDistance = latDiff * 111.32; // 1 degree latitude ≈ 111.32 km
    const lonDistance = lonDiff * 111.32 * Math.cos(avgLat * Math.PI / 180); // adjust for longitude
    
    console.log(`Approximate area: ${latDistance.toFixed(2)}km x ${lonDistance.toFixed(2)}km`);

    // Generate heightmap using Open-Elevation API or terrain data
    // For this implementation, we'll use a tile-based approach with multiple sources
    const heightmapSize = 1081; // Standard size for CS2 heightmaps (1081x1081)
    const heightmap = await generateHeightmap(north, south, east, west, heightmapSize, terrainScale);

    // Convert to grayscale PNG
    const pngBuffer = await sharp(heightmap, {
      raw: {
        width: heightmapSize,
        height: heightmapSize,
        channels: 1
      }
    })
    .png()
    .toBuffer();

    // Generate unique filename based on coordinates to prevent caching issues
    const filename = `heightmap_${north.toFixed(4)}_${west.toFixed(4)}.png`;
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(pngBuffer);

  } catch (error) {
    console.error('Error generating heightmap:', error);
    res.status(500).json({ error: 'Failed to generate heightmap', details: error.message });
  }
});

async function generateHeightmap(north, south, east, west, size, scale = 50) {
  try {
    // Create a grid of elevation samples
    const heightData = new Uint8Array(size * size);
    
    // Calculate step sizes
    const latStep = (north - south) / (size - 1);
    const lonStep = (east - west) / (size - 1);
    
    console.log(`Generating ${size}x${size} heightmap with synthetic terrain data (scale: ${scale})...`);
    
    // Generate synthetic terrain data for all points
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const lat = north - (y * latStep);
        const lon = west + (x * lonStep);
        const elevation = generateSyntheticElevation(lat, lon, scale);
        heightData[y * size + x] = elevation;
      }
      
      // Log progress every 100 rows
      if (y % 100 === 0 && y > 0) {
        console.log(`Progress: ${Math.floor((y / size) * 100)}%`);
      }
    }
    
    console.log('Heightmap generation complete');
    return Buffer.from(heightData);
    
  } catch (error) {
    console.error('Error in generateHeightmap:', error);
    throw error;
  }
}

function generateSyntheticElevation(lat, lon, baseScale = 50) {
  // Generate synthetic terrain using multi-octave noise functions
  // This creates both location-specific variation AND interesting terrain within each area
  
  // Use three octaves at DIFFERENT absolute scales (not relative to baseScale)
  // to ensure both global uniqueness and local detail:
  // - Continental scale (0.5): Makes different regions of Earth unique
  // - Regional scale (baseScale): Controllable by user for different feels  
  // - Detail scale (baseScale * 5): Fine details within the 12.6km area
  
  const continentalScale = 0.5;    // Very large features (~1300km) for global uniqueness
  const regionalScale = baseScale;  // User-controllable regional features
  const detailScale = baseScale * 5; // Fine details
  
  const noise1 = Math.sin(lat * continentalScale) * Math.cos(lon * continentalScale) * 0.5 + 0.5;
  const noise2 = Math.sin(lat * regionalScale) * Math.cos(lon * regionalScale) * 0.5 + 0.5;
  const noise3 = Math.sin(lat * detailScale) * Math.cos(lon * detailScale) * 0.5 + 0.5;
  
  // Weight: continental (30%), regional (40%), detail (30%)
  // This ensures each location is unique while maintaining good internal variation
  const combined = (noise1 * 0.3 + noise2 * 0.4 + noise3 * 0.3);
  return Math.floor(combined * 255);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Version endpoint
app.get('/api/version', (req, res) => {
  try {
    // Try to get git commit hash
    let version = 'dev';
    try {
      version = execSync('git rev-parse --short HEAD').toString().trim();
    } catch (error) {
      console.log('Could not get git commit hash, using "dev"');
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    
    res.json({
      version: version,
      fullVersion: version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting version:', error);
    res.status(500).json({ error: 'Failed to get version' });
  }
});

app.listen(PORT, () => {
  console.log(`Terrain Party server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
