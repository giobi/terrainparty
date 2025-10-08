# Tile Provider Changes - Fixing Map Visibility on Vercel

## Issue
The map was not displaying on Vercel deployments, showing only a dark background without any map tiles.

## Root Cause
OpenStreetMap's standard tile server (`tile.openstreetmap.org`) has strict usage policies:
- ❌ Not intended for production use
- ❌ Not recommended for high-traffic sites
- ❌ May rate-limit or block requests from cloud hosting providers
- ❌ Can be blocked by ad-blockers and browser extensions

From [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/):
> "The standard tile layer is not intended for production use or for applications which generate high traffic."

## Solution
Switch to **CARTO** as the primary tile provider with **OpenStreetMap** as fallback.

### Why CARTO?
- ✅ Free tier with no API key required
- ✅ Specifically designed for production use
- ✅ Better reliability on cloud platforms (Vercel, Netlify, Railway)
- ✅ Uses OpenStreetMap data (same map quality)
- ✅ Handles high traffic without rate limiting
- ✅ Works reliably with ad-blockers enabled

## Changes Made

### 1. Server-Side Tile Proxy (`server.js`)

**Before:**
```javascript
// Fetch tile from OpenStreetMap
const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

const response = await axios.get(tileUrl, {
  responseType: 'arraybuffer',
  headers: {
    'User-Agent': 'TerrainParty/1.0'
  },
  timeout: 10000
});
```

**After:**
```javascript
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
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(response.data);
  } catch (error) {
    lastError = error;
    console.log(`Failed to fetch from ${tileUrl.split('/')[2]}, trying next provider...`);
    continue;
  }
}

// If all providers fail, throw the last error
throw lastError;
```

### 2. Attribution Update (`public/index.html`)

**Before:**
```html
<div class="map-attribution">
    © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors
</div>
```

**After:**
```html
<div class="map-attribution">
    © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | 
    © <a href="https://carto.com/attributions" target="_blank">CARTO</a>
</div>
```

## Benefits

### For Users
- ✅ Map displays reliably on Vercel and other cloud platforms
- ✅ Works with ad-blockers enabled
- ✅ Faster tile loading times
- ✅ Better uptime (multiple providers)

### For Developers
- ✅ No API key management needed
- ✅ No configuration changes required
- ✅ Automatic fallback to OSM if CARTO fails
- ✅ Follows best practices for production deployments

## Testing

### Local Testing
```bash
npm install
npm start
# Open http://localhost:3000 and verify map tiles load
```

### Vercel Testing
After deployment to Vercel:
1. Open your Vercel deployment URL
2. Verify map tiles are visible
3. Check browser console for no tile loading errors
4. Test map interactions (pan, zoom, select area)

## Compliance

This change follows:
- ✅ OpenStreetMap Tile Usage Policy (use appropriate tile servers for production)
- ✅ CARTO Terms of Service (free tier for public web applications)
- ✅ Proper attribution for both data providers
- ✅ Best practices for cloud deployments

## References
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
- [OpenStreetMap Wiki - Tile Servers](https://wiki.openstreetmap.org/wiki/Tile_servers)
- [CARTO Basemaps](https://carto.com/basemaps/)
- [Deploying Slippy Maps](https://wiki.openstreetmap.org/wiki/Deploying_your_own_Slippy_Map)
