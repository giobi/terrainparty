# Frequently Asked Questions (FAQ)

## General Questions

### What is Terrain Party?
Terrain Party is a web tool that generates heightmap images for Cities Skylines 2. You select a location on a map, and it creates a grayscale PNG file representing the terrain elevation that you can import into the game.

### Is this free to use?
Yes! Terrain Party is completely free and open source.

### Do I need to create an account?
No account needed. Just visit the website and start generating heightmaps.

### Is my data stored or tracked?
No. All generation happens in real-time, and nothing is saved. We don't track users or store any data.

## Using Terrain Party

### What size area can I select?
The tool generates a 12.6km × 12.6km area, which is the standard map size for Cities Skylines 2.

### Can I select a different size?
Currently, only the 12.6km × 12.6km size is supported, as this is the standard for Cities Skylines 2. Custom sizes may be added in the future.

### How accurate is the terrain?
The current version uses synthetic terrain generation based on geographic coordinates. While not geographically accurate, it creates realistic-looking terrain patterns. Future versions will support real elevation data.

### Can I use real-world elevation data?
The system is designed to support real elevation data from various APIs. This feature is planned for a future update with fallback to synthetic terrain when APIs are unavailable.

### How long does it take to generate a heightmap?
Generation typically takes 2-5 seconds, depending on server load and your internet connection.

### What format is the output?
The output is a PNG image file (1081×1081 pixels, grayscale, 8-bit).

### Can I download multiple heightmaps?
Yes! You can generate and download as many heightmaps as you want.

## Cities Skylines 2 Integration

### How do I import the heightmap into CS2?
1. Open Cities Skylines 2
2. Start a new game
3. Look for "Import Heightmap" or "Custom Terrain" option
4. Select your downloaded PNG file
5. The terrain will be generated!

### Why 1081×1081 pixels?
This is the resolution Cities Skylines 2 uses for heightmaps. Each pixel represents approximately 11.66 meters of terrain.

### Can I use these heightmaps in the original Cities Skylines?
These are specifically formatted for Cities Skylines 2. The original Cities Skylines may use different specifications.

### The heightmap looks wrong in CS2. What should I do?
- Verify the file is 1081×1081 pixels
- Check that it's a grayscale PNG
- Try selecting a different area
- Make sure you're using the latest version of CS2

### Can I edit the heightmap before importing?
Yes! You can edit the PNG in any image editor (Photoshop, GIMP, etc.) to:
- Smooth terrain
- Add or remove mountains
- Flatten areas
- Adjust elevation ranges

## Technical Questions

### What technology does this use?
- **Frontend**: HTML5, CSS3, JavaScript (Canvas API)
- **Backend**: Node.js, Express, Sharp
- **Map**: Custom Web Mercator projection

### Can this run without a server?
Yes! The application can be deployed serverlessly using:
- GitHub Pages (frontend)
- Cloudflare Workers (backend)

Or use platforms with auto-managed infrastructure:
- Vercel (one-click deploy)
- Netlify
- Railway

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for easiest setup or [SERVERLESS_DEPLOYMENT.md](SERVERLESS_DEPLOYMENT.md) for fully serverless.

### Why doesn't it use a map library like Leaflet?
The current implementation uses a lightweight canvas-based map to avoid external dependencies and ensure it works in restricted environments. This makes the app more portable and faster to load.

### Can I run this locally?
Yes! Clone the repository and run:
```bash
npm install
npm start
```
Then open `http://localhost:3000`

### Is the source code available?
Yes! Terrain Party is open source. Check the GitHub repository.

### Can I contribute to the project?
Absolutely! Pull requests are welcome. See the GitHub repository for contribution guidelines.

## Deployment & Hosting

### Do I need a server to run this?
**Technically yes, but practically no!** The app uses serverless functions that auto-scale:
- No traditional 24/7 server needed
- Runs only when generating heightmaps
- Zero server management
- Free or very cheap hosting

### Can I deploy this on Vercel?
**Yes!** Vercel is the recommended platform:
- One-click deployment
- Free tier (100GB bandwidth/month)
- Auto-scaling
- Zero configuration

Click the "Deploy to Vercel" button in the README or see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

### What about Netlify, Railway, or Render?
All work great! The app is compatible with:
- ✅ Vercel
- ✅ Netlify  
- ✅ Railway
- ✅ Render
- ✅ Fly.io

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for platform comparison.

### How much does hosting cost?
**Free for most usage:**
- Vercel free tier: 100GB bandwidth/month (~200k-400k downloads)
- Netlify free tier: 100GB bandwidth/month
- Railway: $5 free credit/month

For typical usage (hundreds to thousands of downloads/month), you'll stay in the free tier.

### Can I use my own domain?
Yes! All platforms support custom domains:
1. Deploy to your chosen platform
2. Go to project settings
3. Add your domain
4. Update DNS records
5. Done!

## Browser & Compatibility

### What browsers are supported?
Any modern browser:
- Chrome/Chromium (recommended)
- Firefox
- Edge
- Safari

### Does it work on mobile?
The interface works on mobile browsers, though the experience is better on desktop due to map navigation.

### Do I need to install anything?
No installation needed. Just visit the website in your browser.

### Why is the map blank?
- Check your internet connection
- Refresh the page
- Try a different browser
- Disable ad blockers (they may block map rendering)

## Troubleshooting

### The download button is disabled
Make sure you've selected an area first:
1. Click "Select Area (Click Map)"
2. Click anywhere on the map
3. The download button should become active

### My download failed
- Check your internet connection
- Try selecting a different area
- Refresh the page and try again
- Check browser console for errors

### The heightmap is all black or all white
This might indicate an issue with elevation normalization. Try:
- Selecting a different location
- Refreshing the page
- Reporting the issue with coordinates

### Generation is taking too long
- Normal generation: 2-5 seconds
- If it takes longer:
  - Check your internet connection
  - Refresh and try again
  - Server might be under heavy load

### I get a "Server Error" message
- Try again in a few minutes
- The server might be restarting or under maintenance
- Check if the service status is reported

## Performance

### How many heightmaps can I generate?
There's no limit! Generate as many as you need.

### Is there a rate limit?
Currently no rate limits, but excessive use may be throttled to ensure fair access for all users.

### Can I use the API programmatically?
Yes! The API endpoint is available:
```bash
curl -X POST http://localhost:3000/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{"north":40.75,"south":40.74,"east":-74.00,"west":-74.01}' \
  --output heightmap.png
```

### How much bandwidth does this use?
- Initial page load: ~15KB
- Each heightmap download: ~40-250KB
- Total per session: <1MB typically

## Advanced Usage

### Can I automate heightmap generation?
Yes, using the API endpoint. Example Python script:
```python
import requests

bounds = {
    "north": 40.75,
    "south": 40.74,
    "east": -74.00,
    "west": -74.01
}

response = requests.post(
    'http://localhost:3000/api/generate-heightmap',
    json=bounds
)

with open('heightmap.png', 'wb') as f:
    f.write(response.content)
```

### Can I batch generate multiple locations?
Yes, by using the API endpoint in a loop. Example:
```bash
for loc in "40.75,-74.00" "34.05,-118.25" "51.50,-0.12"; do
    IFS=',' read lat lon <<< "$loc"
    curl -X POST http://localhost:3000/api/generate-heightmap \
      -H "Content-Type: application/json" \
      -d "{\"north\":$lat,\"south\":$lat-0.01,\"east\":$lon,\"west\":$lon-0.01}" \
      --output "heightmap_${lat}_${lon}.png"
done
```

### Can I modify the terrain generation algorithm?
Yes! The code is open source. You can:
- Fork the repository
- Modify `generateSyntheticElevation()` in server.js
- Deploy your own version

### How do I find good locations?
Tips for finding interesting locations:
- **Coastal cities**: San Francisco, Miami, Sydney
- **Mountains**: Denver, Innsbruck, Kathmandu
- **Rivers**: New York, London, Paris
- **Islands**: Hawaii, Iceland, Japan
- **Varied terrain**: Switzerland, New Zealand, Norway

## Privacy & Legal

### What data do you collect?
None. No cookies, no tracking, no analytics.

### Can I use the generated heightmaps commercially?
The heightmaps are generated from public data and can be used freely in Cities Skylines 2 and other projects.

### What's the license?
The code is licensed under ISC (similar to MIT). See LICENSE file.

### Who made this?
Terrain Party is inspired by the original terrain.party website, recreated for Cities Skylines 2.

## Future Features

### Will you add real elevation data?
Yes! This is planned for a future update with multiple data source options.

### Can you add X feature?
Feature requests are welcome! Submit an issue on GitHub with your suggestion.

### Will there be a mobile app?
Not currently planned, but the web interface works on mobile browsers.

### Plans for other game formats?
Currently focused on Cities Skylines 2, but other formats could be added based on demand.

## Support

### How do I report a bug?
1. Check if it's a known issue
2. Submit a GitHub issue with:
   - Description of the problem
   - Steps to reproduce
   - Browser and OS info
   - Screenshots if applicable

### How do I request a feature?
Submit a GitHub issue with:
- Feature description
- Use case
- Why it would be helpful

### Where can I get help?
- Read this FAQ
- Check the documentation
- Submit a GitHub issue
- Check existing issues for solutions

### Is there a community?
Check the GitHub repository for:
- Discussions
- Issues
- Pull requests
- Community contributions

## Miscellaneous

### Why "Terrain Party"?
The name is inspired by the original terrain.party website, which pioneered web-based heightmap generation.

### What happened to the original terrain.party?
The original site went offline. This is a recreation specifically for Cities Skylines 2.

### Can I self-host this?
Yes! The code is open source. Clone and deploy on your own server.

### Does this work offline?
No, it requires internet for:
- Map rendering
- Server API calls

A future version could support offline mode with cached data.

### How can I support this project?
- Star the GitHub repository
- Share with other CS2 players
- Contribute code or documentation
- Report bugs and suggest features

---

Still have questions? Open an issue on GitHub!
