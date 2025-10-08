# Serverless Deployment Guide

## Can Terrain Party Run Serverlessly?

**Yes!** Terrain Party can be deployed as a serverless application using GitHub Pages for the frontend and Cloudflare Workers for the backend.

## Architecture Comparison

### Current Architecture (Server-based)
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Express   │
│   Server    │
│ (Node.js)   │
└─────────────┘
```

### Serverless Architecture
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ↓                 ↓
┌─────────────┐   ┌──────────────┐
│GitHub Pages │   │  Cloudflare  │
│  (Static)   │   │   Worker     │
└─────────────┘   └──────────────┘
```

## Benefits of Serverless

### Cost
- ✅ **GitHub Pages**: FREE
- ✅ **Cloudflare Workers**: FREE tier (100,000 requests/day)
- ✅ **No server hosting costs**
- ✅ **Pay only for what you use**

### Scalability
- ✅ **Automatic scaling**: Handles traffic spikes
- ✅ **Global CDN**: Fast worldwide
- ✅ **No server management**
- ✅ **Zero downtime deployments**

### Performance
- ✅ **Edge computing**: Processing close to users
- ✅ **CDN caching**: Static assets cached globally
- ✅ **Low latency**: Sub-100ms response times
- ✅ **No cold starts** (with Cloudflare Workers)

## Implementation Plan

### Phase 1: Frontend on GitHub Pages

The frontend (HTML, CSS, JavaScript) can be deployed to GitHub Pages as-is!

**Steps**:
1. Create a `gh-pages` branch
2. Copy `public/` contents to root
3. Update API endpoint URL
4. Push to GitHub
5. Enable GitHub Pages in repository settings

**Example URL**: `https://giobi.github.io/tarrainparty/`

### Phase 2: Backend on Cloudflare Workers

The backend needs to be rewritten for Cloudflare Workers environment.

**Key Changes**:
- Replace Express with Cloudflare Workers API
- Replace Sharp with browser-compatible image library
- Adapt heightmap generation for edge computing

## Cloudflare Worker Implementation

### Worker Code Structure

```javascript
// worker.js
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST' && request.url.endsWith('/api/generate-heightmap')) {
      return handleHeightmapRequest(request);
    }
    return new Response('Not Found', { status: 404 });
  }
}

async function handleHeightmapRequest(request) {
  const bounds = await request.json();
  const heightmap = generateHeightmap(bounds);
  const png = await createPNG(heightmap);
  
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

### PNG Generation in Workers

Cloudflare Workers don't support Sharp, but we can use:

**Option 1: Canvas API (Browser-like)**
```javascript
const canvas = new OffscreenCanvas(1081, 1081);
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(1081, 1081);

for (let i = 0; i < heightData.length; i++) {
  const val = heightData[i];
  imageData.data[i * 4] = val;     // R
  imageData.data[i * 4 + 1] = val; // G
  imageData.data[i * 4 + 2] = val; // B
  imageData.data[i * 4 + 3] = 255; // A
}

ctx.putImageData(imageData, 0, 0);
const blob = await canvas.convertToBlob({ type: 'image/png' });
```

**Option 2: PNG.js Library**
```javascript
import { PNG } from 'pngjs/browser';

const png = new PNG({ width: 1081, height: 1081, colorType: 0 });
for (let i = 0; i < heightData.length; i++) {
  png.data[i] = heightData[i];
}

const buffer = PNG.sync.write(png);
```

**Option 3: WebAssembly**
- Compile image processing to WASM
- High performance
- Works in Workers environment

## Step-by-Step Serverless Migration

### Step 1: Prepare Frontend

**Update `public/app.js`**:
```javascript
// Change API endpoint
const API_ENDPOINT = 'https://terrain-party-worker.yourname.workers.dev';

async function downloadHeightmap() {
  const response = await fetch(`${API_ENDPOINT}/api/generate-heightmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentBounds)
  });
  // ... rest of code
}
```

### Step 2: Create Cloudflare Worker

**File: `worker.js`**
```javascript
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Handle heightmap generation
    if (request.method === 'POST') {
      try {
        const bounds = await request.json();
        
        // Validate bounds
        if (!bounds.north || !bounds.south || !bounds.east || !bounds.west) {
          return new Response('Invalid bounds', { status: 400 });
        }

        // Generate heightmap
        const heightData = generateHeightmap(bounds);
        
        // Create PNG
        const pngBuffer = await createPNG(heightData);
        
        return new Response(pngBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
}

function generateHeightmap(bounds) {
  const size = 1081;
  const heightData = new Uint8Array(size * size);
  
  const latStep = (bounds.north - bounds.south) / (size - 1);
  const lonStep = (bounds.east - bounds.west) / (size - 1);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const lat = bounds.north - (y * latStep);
      const lon = bounds.west + (x * lonStep);
      const elevation = generateSyntheticElevation(lat, lon);
      heightData[y * size + x] = elevation;
    }
  }
  
  return heightData;
}

function generateSyntheticElevation(lat, lon) {
  const scale = 100;
  const noise = Math.sin(lat * scale) * Math.cos(lon * scale) * 0.5 + 0.5;
  const noise2 = Math.sin(lat * scale * 2.5) * Math.cos(lon * scale * 2.5) * 0.25 + 0.5;
  const combined = (noise * 0.7 + noise2 * 0.3);
  return Math.floor(combined * 255);
}

async function createPNG(heightData) {
  // Use browser Canvas API
  const canvas = new OffscreenCanvas(1081, 1081);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(1081, 1081);
  
  for (let i = 0; i < heightData.length; i++) {
    const val = heightData[i];
    imageData.data[i * 4] = val;     // R
    imageData.data[i * 4 + 1] = val; // G
    imageData.data[i * 4 + 2] = val; // B
    imageData.data[i * 4 + 3] = 255; // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return await blob.arrayBuffer();
}
```

**File: `wrangler.toml`**
```toml
name = "terrain-party-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
workers_dev = false
route = "terrain-party-worker.yourname.workers.dev/*"
```

### Step 3: Deploy to Cloudflare

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
wrangler deploy
```

### Step 4: Deploy Frontend to GitHub Pages

```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Copy public files
cp public/* .

# Update API endpoint in app.js
# (Edit app.js to point to your Cloudflare Worker)

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Step 5: Enable GitHub Pages

1. Go to repository settings
2. Navigate to "Pages" section
3. Select "gh-pages" branch
4. Save

Your site will be live at: `https://yourusername.github.io/tarrainparty/`

## Limitations & Considerations

### Cloudflare Workers Limitations

**Request Limits**:
- CPU time: 50ms (free tier)
- Memory: 128 MB
- Response size: 10 MB (enough for our PNGs)

**Solutions**:
- Optimize heightmap generation
- Use paid tier if needed ($5/month for unlimited CPU)

### PNG Generation

**Sharp is not available** in Workers, but alternatives exist:
- Browser Canvas API (OffscreenCanvas)
- PNG.js library
- WebAssembly PNG encoder

### Performance

**Serverless Performance**:
- Initial generation: 50-200ms (edge computing)
- Global latency: <100ms
- Concurrent requests: Automatic scaling

**Server Performance** (current):
- Generation: 2-3 seconds
- Single server location
- Manual scaling required

## Cost Comparison

### Current (Server-based)
- **Development**: $0 (local)
- **Production**: $5-20/month (VPS/hosting)
- **Traffic**: Additional costs for high traffic

### Serverless
- **GitHub Pages**: $0 (free for public repos)
- **Cloudflare Workers**: 
  - Free tier: 100,000 requests/day
  - Paid tier: $5/month unlimited
- **Total**: $0-5/month

## Migration Checklist

- [ ] Create worker.js with heightmap generation
- [ ] Implement PNG generation for Workers
- [ ] Test worker locally with Miniflare
- [ ] Deploy worker to Cloudflare
- [ ] Update frontend API endpoint
- [ ] Test CORS configuration
- [ ] Deploy frontend to GitHub Pages
- [ ] Update repository README
- [ ] Test complete flow
- [ ] Monitor performance and errors

## Testing Serverless Setup

### Local Testing

```bash
# Install Miniflare (local Workers environment)
npm install -g miniflare

# Run worker locally
miniflare worker.js --watch
```

### Production Testing

```bash
# Test worker endpoint
curl -X POST https://terrain-party-worker.yourname.workers.dev/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{"north":40.75,"south":40.74,"east":-74.00,"west":-74.01}' \
  --output test.png
```

## Monitoring & Analytics

### Cloudflare Dashboard
- Request count
- Error rate
- CPU time usage
- Bandwidth

### GitHub Pages
- Traffic analytics
- Popular pages
- Referrer data

## Future Enhancements

### Serverless Additions

1. **Caching**
   - Cache popular locations
   - Cloudflare Cache API
   - Reduce computation

2. **Database**
   - Store generated heightmaps
   - Cloudflare KV or Durable Objects
   - Instant retrieval for cached maps

3. **Authentication**
   - Rate limiting per user
   - API keys for heavy users
   - Usage tracking

4. **Analytics**
   - Track popular locations
   - Monitor performance
   - User behavior insights

## Conclusion

**Serverless deployment is highly recommended** for Terrain Party:

✅ **Cost-effective**: Free or very cheap
✅ **Scalable**: Automatic scaling
✅ **Fast**: Edge computing
✅ **Reliable**: High availability
✅ **Simple**: No server management

The migration is straightforward and offers significant benefits over traditional server hosting.

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Canvas API in Workers](https://developers.cloudflare.com/workers/runtime-apis/web-standards/)

---

Ready to go serverless! 🚀
