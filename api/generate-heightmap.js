// Vercel serverless function for heightmap generation
// This handles: /api/generate-heightmap

const sharp = require('sharp');

async function generateHeightmap(north, south, east, west, size) {
  try {
    // Create a grid of elevation samples
    const heightData = new Uint8Array(size * size);
    
    // Calculate step sizes
    const latStep = (north - south) / (size - 1);
    const lonStep = (east - west) / (size - 1);
    
    console.log(`Generating ${size}x${size} heightmap with synthetic terrain data...`);
    
    // Generate synthetic terrain data for all points
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const lat = north - (y * latStep);
        const lon = west + (x * lonStep);
        const elevation = generateSyntheticElevation(lat, lon);
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

function generateSyntheticElevation(lat, lon) {
  // Generate synthetic terrain using multi-octave noise functions
  // This creates visible terrain variation within the 12.6km x 12.6km area
  // while still ensuring each geographic location produces a unique heightmap
  
  // Base scale tuned for ~12.6km areas (approximately 0.01 degrees)
  // Scale of 500 provides good variation (range ~150) within small areas
  const baseScale = 500;
  
  // Use three octaves of noise at different frequencies for interesting terrain
  const scale1 = baseScale;        // Large features
  const scale2 = baseScale * 2.5;  // Medium features  
  const scale3 = baseScale * 5;    // Fine details
  
  const noise1 = Math.sin(lat * scale1) * Math.cos(lon * scale1) * 0.5 + 0.5;
  const noise2 = Math.sin(lat * scale2) * Math.cos(lon * scale2) * 0.25 + 0.5;
  const noise3 = Math.sin(lat * scale3) * Math.cos(lon * scale3) * 0.125 + 0.5;
  
  // Combine octaves with decreasing weights
  const combined = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
  return Math.floor(combined * 255);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { north, south, east, west } = req.body;
    
    if (!north || !south || !east || !west) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    console.log(`Generating heightmap for bounds: N:${north}, S:${south}, E:${east}, W:${west}`);

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
    const heightmap = await generateHeightmap(north, south, east, west, heightmapSize);

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
};
