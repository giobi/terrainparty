# Browser Caching Fix Summary

## Issue
Users reported that "the map downloaded is always grey, always the same file" regardless of the location selected.

## Root Cause
The issue was caused by **browser caching**, not by the heightmap generation algorithm (which was already fixed with scale=0.5):

1. **Static filename**: The server always returned `filename="heightmap.png"` in the Content-Disposition header
2. **No cache-control headers**: The response lacked cache-prevention headers
3. **Browser behavior**: Browsers cached the first downloaded heightmap and served it for all subsequent requests

## Solution
Added cache-control headers and dynamic filenames to prevent browser caching:

### Changes in `server.js` and `api/generate-heightmap.js`:

```javascript
// BEFORE:
res.setHeader('Content-Type', 'image/png');
res.setHeader('Content-Disposition', 'attachment; filename="heightmap.png"');
res.send(pngBuffer);

// AFTER:
const filename = `heightmap_${north.toFixed(4)}_${west.toFixed(4)}.png`;

res.setHeader('Content-Type', 'image/png');
res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
res.setHeader('Pragma', 'no-cache');
res.setHeader('Expires', '0');
res.send(pngBuffer);
```

## What Changed

### 1. Dynamic Filenames
Each location now gets a unique filename based on its coordinates:
- New York: `heightmap_40.7583_-74.0983.png`
- London: `heightmap_51.5700_-0.2005.png`
- Tokyo: `heightmap_35.7360_139.6496.png`

### 2. Cache-Control Headers
Three headers work together to prevent caching:
- `Cache-Control: no-cache, no-store, must-revalidate` - Modern browsers
- `Pragma: no-cache` - HTTP/1.0 browsers
- `Expires: 0` - Additional cache prevention

## Testing
Comprehensive tests confirm the fix:

✅ Different locations produce different heightmaps  
✅ Same location produces consistent heightmaps  
✅ All responses have unique filenames  
✅ All responses have no-cache headers  
✅ Browser cannot serve stale cached responses  

## Impact
- **Minimal code change**: Only 6 lines added per file (12 total)
- **No breaking changes**: Existing functionality unchanged
- **Immediate effect**: Users can now download unique heightmaps for different locations
- **User-friendly**: Unique filenames help identify downloads

## Why This Fix Works

### Problem Scenario (Before):
1. User selects Rome and downloads → Browser saves as "heightmap.png"
2. User selects Milan and downloads → Browser sees same filename, serves cached file
3. Result: User gets Rome heightmap again

### Fixed Scenario (After):
1. User selects Rome and downloads → Browser saves as "heightmap_41.9462_12.3962.png"
2. Browser receives no-cache headers → Cannot cache the response
3. User selects Milan and downloads → New request to server with new coordinates
4. Server generates new heightmap with unique filename "heightmap_45.5240_9.1008.png"
5. Result: User gets correct Milan heightmap

## Files Modified
1. `server.js` - Lines 109-117
2. `api/generate-heightmap.js` - Lines 95-103

## Backward Compatibility
✅ Fully backward compatible - no API changes, only response headers modified
