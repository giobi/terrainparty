# Fix: Grey Square Heightmap Issue

## Problem
Downloaded heightmaps from the Vercel app were appearing as grey squares with no visible terrain variation.

## Root Cause
The synthetic elevation function used a scale factor of 0.5, which was designed to create unique patterns for different geographic locations across large distances (~1300km). However, the app generates heightmaps for small 12.6km × 12.6km areas (~0.01 degrees).

Within such small areas, the sine/cosine functions with scale 0.5 produced almost identical values everywhere, resulting in a nearly uniform grey image:

**Before Fix:**
- Min value: 193
- Max value: 194
- Range: **1** (essentially no variation)
- File size: ~1.6KB (PNG compression is very effective on uniform images)

## Solution
Increased the base scale from 0.5 to 500 and implemented multi-octave noise for more interesting terrain features:

```javascript
// OLD (scale 0.5 - grey square)
const scale = 0.5;
const noise = Math.sin(lat * scale) * Math.cos(lon * scale) * 0.5 + 0.5;
const noise2 = Math.sin(lat * scale * 2.5) * Math.cos(lon * scale * 2.5) * 0.25 + 0.5;
const combined = (noise * 0.7 + noise2 * 0.3);
```

```javascript
// NEW (scale 500 - visible terrain)
const baseScale = 500;

// Three octaves for varied terrain features
const scale1 = baseScale;        // Large features
const scale2 = baseScale * 2.5;  // Medium features  
const scale3 = baseScale * 5;    // Fine details

const noise1 = Math.sin(lat * scale1) * Math.cos(lon * scale1) * 0.5 + 0.5;
const noise2 = Math.sin(lat * scale2) * Math.cos(lon * scale2) * 0.25 + 0.5;
const noise3 = Math.sin(lat * scale3) * Math.cos(lon * scale3) * 0.125 + 0.5;

const combined = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
```

**After Fix:**
- Min value: 54
- Max value: 212
- Range: **158** (excellent variation)
- File size: ~34KB (more data due to variation)

## Test Results

### Different Locations Produce Different Patterns
Each geographic location now has visible terrain variation within its 12.6km area:

| Location | Min | Max | Range | Average |
|----------|-----|-----|-------|---------|
| New York | 54  | 212 | 158   | 129     |
| London   | 42  | 190 | 148   | 124     |
| Tokyo    | 62  | 200 | 138   | 125     |
| Sydney   | 54  | 199 | 145   | 124     |

### Same Location Produces Consistent Results
The function is deterministic - requesting the same location multiple times produces identical heightmaps:
- ✅ MD5 hash verification confirms consistency
- ✅ Important for caching and user experience

## Benefits

1. **Visible Terrain**: Heightmaps now show clear elevation patterns instead of grey squares
2. **Location-Specific**: Each area still has unique terrain based on its coordinates
3. **Deterministic**: Same location always produces the same heightmap
4. **Backward Compatible**: No API changes, only improved output quality
5. **Better Compression**: PNG files are slightly larger due to actual data variation

## Files Modified

- `api/generate-heightmap.js` - Vercel serverless function
- `server.js` - Local development server
- `test-heightmap-variation.js` - New automated test (NEW)

## Testing

Run the automated test to verify heightmaps have proper variation:

```bash
npm start  # In one terminal
node test-heightmap-variation.js  # In another terminal
```

Expected output:
```
🧪 Testing Heightmap Variation...
✅ Server is running

Testing New York...
  Size: 1081x1081
  Range: 54 - 212 (158)
  Avg: 129
  ✅ PASS: Good terrain variation

[... more locations ...]

🎉 All tests passed!
Heightmaps have proper terrain variation (not grey squares).
```

## Impact

**Before:** Users downloading heightmaps from any location saw grey squares
**After:** Users now see proper terrain variation suitable for Cities Skylines 2

This fix ensures the app works as intended on Vercel deployments!
