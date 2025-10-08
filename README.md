# Terrain Party - CS2 Heightmap Generator

A web application that replicates the functionality of terrain.party for Cities Skylines 2. This tool allows you to select any 12.6km × 12.6km area on OpenStreetMap and download a grayscale heightmap PNG suitable for importing into Cities Skylines 2.

## 🚀 Quick Deploy

Deploy this application instantly to your preferred platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/giobi/tarrainparty)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/giobi/tarrainparty)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/giobi/tarrainparty)

**No server management required!** All platforms offer free tiers perfect for this application.

**Note**: If the one-click deploy creates an empty repository, please see the [troubleshooting guide](docs/VERCEL_DEPLOYMENT.md#empty-repository-after-one-click-deploy) for solutions.

See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Features

- 🗺️ Interactive map with real OpenStreetMap tiles
- 📏 Precise 12.6km × 12.6km area selection
- 🏔️ Elevation data generation (synthetic terrain with real data support)
- 📥 Download heightmaps as PNG (1081×1081 pixels)
- 🎮 Ready for Cities Skylines 2 import

## Installation

1. Clone this repository:
```bash
git clone https://github.com/giobi/tarrainparty.git
cd tarrainparty
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Navigate the Map**: Use the OpenStreetMap interface to find your desired location
2. **Select Area**: Click the "Select Area" button, then click on the map to place a 12.6km × 12.6km square
3. **Download**: Click "Download Heightmap" to generate and download the grayscale PNG
4. **Import to CS2**: Use the downloaded PNG file as a heightmap in Cities Skylines 2

## Deployment Options

### Option 1: Vercel/Netlify/Railway (Recommended) ✅

**One-click deployment** - No server setup required!

- ✅ **Free tier** available on all platforms
- ✅ **Auto-scaling** - Handles any traffic
- ✅ **Zero maintenance** - Platform manages everything
- ✅ **Global CDN** - Fast worldwide
- ✅ **HTTPS** included

Click the deploy buttons above or see [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed instructions.

### Option 2: Serverless (GitHub Pages + Cloudflare Workers)

Deploy with **zero hosting costs**:
- Frontend on GitHub Pages (FREE)
- Backend on Cloudflare Workers (FREE tier: 100k requests/day)

See [docs/SERVERLESS_DEPLOYMENT.md](docs/SERVERLESS_DEPLOYMENT.md) for complete guide.

### Option 3: Traditional Server

Deploy on any VPS or cloud provider:
```bash
npm install
npm start
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#deployment) for details.

## Technical Details

- **Map Size**: Exactly 12.6km × 12.6km (as required by Cities Skylines 2)
- **Output Format**: Grayscale PNG, 1081×1081 pixels
- **Map Tiles**: OpenStreetMap tiles served via server-side proxy (avoids CORS issues)
- **Elevation Data**: Fetched from Open-Elevation API (with fallback to synthetic terrain)
- **Elevation Range**: Normalized to 0-255 grayscale values

## Requirements

- Node.js 14 or higher
- npm or yarn
- Internet connection for map tiles and elevation data

## Dependencies

- **express**: Web server framework
- **axios**: HTTP client for API requests
- **sharp**: Image processing library
- **leaflet**: Interactive map library (frontend)

## Testing

Run the test suite to verify the server is working correctly:

```bash
# Start the server first
npm start

# In another terminal, run tests
npm test                      # Test heightmap generation
node test-tile-proxy.js       # Test tile proxy endpoint
```

The tests will verify:
- Server is running and accessible
- Heightmap generation works correctly
- Tile proxy endpoint validates parameters properly
- Generated files are valid PNG format

## License

ISC

## Credits

This project is inspired by the original terrain.party website, recreated for Cities Skylines 2 heightmap generation.
