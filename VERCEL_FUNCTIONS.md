# Vercel Serverless Functions Structure

This project is now properly configured for Vercel serverless deployment.

## Directory Structure

```
api/
├── generate-heightmap.js              # POST /api/generate-heightmap
└── tiles/
    └── [z]/
        └── [x]/
            └── [y].js                 # GET /api/tiles/{z}/{x}/{y}.png

public/
├── index.html                         # Main application
└── app.js                            # Frontend JavaScript

server.js                              # Local development server (Express)
vercel.json                            # Vercel configuration
```

## How It Works

### On Vercel (Production)
- Static files (HTML, CSS, JS, images) are served from `public/` directory
- API endpoints are handled by serverless functions in `api/` directory
- Each API route is a separate serverless function
- No Express.js server running

### Local Development
- Run `npm start` to start Express.js server on port 3000
- Server serves static files and handles API routes
- Same behavior as production, but using Express

## API Endpoints

### GET /api/tiles/:z/:x/:y.png
Proxies map tile requests to CARTO (primary) and OpenStreetMap (fallback).

**Parameters:**
- `z` - Zoom level (0-18)
- `x` - Tile X coordinate
- `y` - Tile Y coordinate

**Response:** PNG image

### POST /api/generate-heightmap
Generates heightmap for Cities Skylines 2.

**Body:**
```json
{
  "north": 40.75,
  "south": 40.74,
  "east": -74.00,
  "west": -74.01
}
```

**Response:** PNG file (1081x1081 pixels, grayscale)

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Vercel auto-detects `vercel.json` configuration
3. Deploy! No additional configuration needed

### Local Testing
```bash
npm install
npm start
# Open http://localhost:3000
```

## Why This Structure?

Vercel uses serverless functions, not traditional Node.js servers. Each API endpoint needs to be a separate file that exports a function. This structure:

- ✅ Works correctly on Vercel
- ✅ Scales automatically
- ✅ Zero configuration needed
- ✅ Fast cold starts
- ✅ Proper tile caching

## Troubleshooting

If tiles don't load on Vercel:
1. Check Vercel function logs
2. Verify API routes are deployed
3. Test: `curl https://your-app.vercel.app/api/tiles/10/301/384.png`
4. Check browser console for errors

## Migration Note

This is a breaking change from the previous Express-based structure. The old `server.js` is kept for local development only. Vercel now uses the `api/` directory for serverless functions.
