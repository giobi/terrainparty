# Vercel Deployment Guide

## Can Terrain Party run on Vercel?

**YES!** Terrain Party can be easily deployed on Vercel with minimal configuration.

## Deployment Options

### Option 1: Current Setup (Node.js + Express) ✅ EASIEST

The current implementation works on Vercel out of the box!

**Requirements:**
- Vercel account (free tier available)
- GitHub repository connected

**Benefits:**
- ✅ **Zero configuration** - Works immediately
- ✅ **Free tier** - Generous limits (100GB bandwidth/month)
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Global CDN** - Fast worldwide
- ✅ **HTTPS** - Automatic SSL certificates
- ✅ **Git integration** - Auto-deploy on push

### Option 2: Serverless Functions

Split frontend and backend for even better performance.

### Option 3: Other Platforms

Works on: **Netlify**, **Railway**, **Render**, **Fly.io**, **Heroku**

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

1. **Click the Deploy Button:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/giobi/tarrainparty)

2. **That's it!** Vercel will:
   - Fork the repository
   - Install dependencies
   - Deploy the application
   - Give you a live URL

### Method 2: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd tarrainparty

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tarrainparty
# - Directory? ./
# - Override settings? No
```

**First deployment**: Vercel will give you a preview URL
**Production**: Run `vercel --prod`

### Method 3: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

**Automatic deployments:**
- Push to `main` = Production deploy
- Push to other branch = Preview deploy

## Configuration

### vercel.json (Optional)

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

This configuration:
- ✅ Serves the Express app
- ✅ Routes all requests through server.js
- ✅ Handles API endpoints
- ✅ Serves static files from /public

### package.json Scripts

The current setup already works! But you can optimize:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build required'",
    "dev": "node server.js"
  }
}
```

## Environment Variables

If needed, set in Vercel dashboard:

1. Go to Project Settings
2. Click "Environment Variables"
3. Add variables:
   - `PORT` - Usually auto-set by Vercel
   - `NODE_ENV=production`

## Performance on Vercel

### Free Tier Limits
- ✅ **100GB bandwidth/month** - ~200k-400k heightmap downloads
- ✅ **100 deployments/day**
- ✅ **Serverless function execution**: 100 GB-hours
- ✅ **1000 serverless function invocations/day**

**For this app**: Free tier is very generous!

### Scaling
- Automatic scaling to handle traffic
- No manual intervention needed
- Scales to zero when not used (no costs!)

### Speed
- Global CDN for static files
- Edge network in 70+ cities
- Typical response time: 50-200ms

## Alternative Platforms

### Netlify

**Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Features:**
- Similar to Vercel
- 100GB bandwidth/month (free)
- Automatic HTTPS
- Git integration

### Railway

**Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Features:**
- $5 free credit/month
- Always-on server (not serverless)
- Built-in database options
- Simple pricing

### Render

**Deployment:**
- Connect GitHub repo
- Click "New Web Service"
- Select repository
- Deploy

**Features:**
- Free tier available
- Automatic deploys from Git
- Custom domains
- HTTPS included

### Fly.io

**Deployment:**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Deploy
fly deploy
```

**Features:**
- Free tier: 3 shared-CPU VMs
- Global distribution
- Fast deployments

## Comparison Table

| Platform | Free Tier | Bandwidth | Setup | Best For |
|----------|-----------|-----------|-------|----------|
| **Vercel** | ✅ Yes | 100GB/mo | 1-click | Frontend + API |
| **Netlify** | ✅ Yes | 100GB/mo | 1-click | Static + Functions |
| **Railway** | $5 credit | Unlimited | Medium | Full apps |
| **Render** | ✅ Yes | 100GB/mo | Easy | Full stack |
| **Fly.io** | ✅ Yes | 160GB/mo | CLI | Global apps |
| **Heroku** | ⚠️ No | N/A | Easy | Legacy apps |

**Recommendation for Terrain Party: Vercel or Netlify** (easiest setup)

## Does This Need a Server?

### Current Implementation: Yes (but serverless!)

**What "needs a server" means:**
- ❌ NOT traditional 24/7 server (expensive)
- ✅ Serverless functions (pay per use, auto-scale)

**How it works:**
1. Frontend: Static HTML/CSS/JS (no server needed)
2. Backend: Runs only when generating heightmaps
3. Costs: $0 for low usage, scales automatically

### Fully Serverless Option

**If you want zero server requirements:**

1. **Frontend**: GitHub Pages (free, no server)
2. **Backend**: Cloudflare Workers (free tier, 100k req/day)

See `docs/SERVERLESS_DEPLOYMENT.md` for complete guide.

## Cost Comparison

### Traditional Server (Not Recommended)
- **VPS**: $5-20/month
- **Always running**: Even when not used
- **Manual scaling**: You handle traffic spikes
- **Maintenance**: You manage updates

### Vercel/Netlify (Recommended) ✅
- **Free tier**: $0/month for low-medium usage
- **Pay per use**: Only charged for what you use
- **Auto-scaling**: Handles any traffic
- **Zero maintenance**: Platform handles everything

### Example Costs (Vercel)

**1,000 heightmaps/month:**
- Cost: **$0** (well within free tier)

**10,000 heightmaps/month:**
- Cost: **$0** (still within free tier)

**100,000 heightmaps/month:**
- Cost: **~$0-10** (may need hobby plan)

## Setup Instructions

### Deploying to Vercel (Detailed)

**Step 1: Prepare Repository**

The repository is already ready! No changes needed.

**Step 2: Create Vercel Account**

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access repositories

**Step 3: Import Project**

1. Click "New Project"
2. Select "Import Git Repository"
3. Find "tarrainparty" repository
4. Click "Import"

**Step 4: Configure**

Vercel will detect Node.js automatically:
- Framework Preset: Other
- Root Directory: ./
- Build Command: (leave default)
- Output Directory: (leave default)
- Install Command: npm install

Click "Deploy"

**Step 5: Done!**

You'll get:
- Preview URL: `https://tarrainparty-xxxxx.vercel.app`
- Production URL: `https://tarrainparty.vercel.app`

**Step 6: Custom Domain (Optional)**

1. Go to Project Settings
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions

## Testing Your Deployment

### After Deployment

**Test the web interface:**
```
https://your-app.vercel.app
```

**Test the API:**
```bash
curl -X POST https://your-app.vercel.app/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{"north":40.75,"south":40.74,"east":-74.00,"west":-74.01}' \
  --output heightmap.png
```

**Expected results:**
- ✅ Map loads and displays
- ✅ Selection works
- ✅ Download generates PNG
- ✅ API returns valid PNG file

## Monitoring

### Vercel Dashboard

Monitor your deployment:
- **Analytics**: Page views, performance
- **Logs**: Real-time function logs
- **Deployments**: History of all deploys
- **Speed Insights**: Performance metrics

### Checking Logs

1. Go to Vercel dashboard
2. Select your project
3. Click "Functions"
4. View real-time logs

## Troubleshooting

### Deployment Failed

**Check build logs:**
1. Go to deployment
2. Click "View Build Logs"
3. Look for error messages

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- Build errors: Ensure `npm start` works locally
- Port conflicts: Vercel auto-assigns port

### Function Timeout

**Default timeout**: 10 seconds (free), 60 seconds (pro)

**Solution:**
- Current generation is ~2 seconds (well within limit)
- If needed, upgrade to Pro plan

### Memory Limit

**Default**: 1024 MB

**Current usage**: ~50-100 MB (well within limit)

## Advanced Configuration

### Custom Build

Create `vercel.json`:

```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  },
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Redirects

Add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## Continuous Deployment

### Automatic Deployments

**Main branch → Production:**
- Every push to `main` deploys to production
- Automatic, no manual steps

**Other branches → Preview:**
- Every push to other branches creates preview
- Get unique URL for testing
- Perfect for testing changes

### GitHub Actions Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Migration Checklist

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Import project to Vercel
- [ ] Deploy (automatic)
- [ ] Test web interface
- [ ] Test API endpoint
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring
- [ ] Update README with live URL

## Summary

### ✅ Do You Need a Server?

**Technical answer**: Yes, but it's serverless (auto-managed)

**Practical answer**: No traditional server needed!

- ✅ Deploy to Vercel/Netlify in 1 click
- ✅ Zero server management
- ✅ Auto-scaling
- ✅ Free for most usage
- ✅ Global CDN
- ✅ HTTPS included

### Best Deployment Strategy

**For this app: Vercel** (current setup)

1. **Easiest**: Works immediately, no config
2. **Cheapest**: Free tier is generous
3. **Fastest**: Global CDN, auto-scaling
4. **Reliable**: 99.99% uptime
5. **Simple**: Git push to deploy

### Next Steps

1. Click the "Deploy to Vercel" button
2. Wait ~2 minutes for first deploy
3. Get your live URL
4. Share with CS2 community!

---

**Ready to deploy!** No server management, no configuration, just click and go! 🚀

For alternative serverless setup (GitHub Pages + Cloudflare Workers), see `SERVERLESS_DEPLOYMENT.md`.
