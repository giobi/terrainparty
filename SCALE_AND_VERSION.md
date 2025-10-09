# Scale Parameter and Version Display Implementation

## Summary

This implementation adds two requested features to the Terrain Party application:

1. **Adjustable Scale Parameter** - User control over terrain variation (default: 500)
2. **Version Display** - Git commit hash displayed in UI for frontend update verification

## Features Implemented

### 1. Scale Parameter Control

**UI Component:**
- Slider control (100-2000) in the right panel
- Real-time value display showing current scale
- Labels: "Smooth (100)", current value, "Rough (2000)"
- Help text: "Adjust terrain variation. Default: 500"

**API Changes:**
- Added `scale` parameter to POST `/api/generate-heightmap`
- Parameter is optional, defaults to 500 if not provided
- Validated to ensure it's a positive number
- Passed through to the synthetic elevation function

**Terrain Characteristics by Scale:**
- **100**: Smooth terrain, subtle variation (Range ~59)
- **500**: Balanced terrain, good variation (Range ~158) - **Default**
- **1000**: Rough terrain, high variation (Range ~170)
- **2000**: Maximum variation (Range ~170)

### 2. Version Display

**UI Display:**
- Version shown in bottom-right corner of map attribution area
- Format: `v{shortHash}` (e.g., `ve48ad04`)
- Tooltip shows full version and timestamp on hover

**API Endpoint:**
- New endpoint: GET `/api/version`
- Returns JSON with version info
- On Vercel: Uses `VERCEL_GIT_COMMIT_SHA` environment variable
- Locally: Uses `git rev-parse --short HEAD`
- Fallback: Returns "dev" if git not available

**Response Format:**
```json
{
  "version": "e48ad04",
  "fullVersion": "e48ad04",
  "timestamp": "2025-10-09T07:41:12.856Z"
}
```

## Files Modified

### API Functions (Vercel Serverless)
- **`api/generate-heightmap.js`**:
  - Added `scale` parameter with default value 500
  - Updated `generateSyntheticElevation()` to accept baseScale parameter
  - Added validation for scale parameter
  - Updated logging to show scale value

- **`api/version.js`** (NEW):
  - New serverless function for version endpoint
  - Uses Vercel environment variables when available

### Server (Local Development)
- **`server.js`**:
  - Added `scale` parameter support (matching API)
  - Added `/api/version` endpoint
  - Uses `child_process.execSync` to get git commit hash
  - Updated `generateSyntheticElevation()` function

### Frontend
- **`public/index.html`**:
  - Added scale slider control in controls panel
  - Added version display in map attribution area
  - New info-box for terrain scale with labels

- **`public/app.js`**:
  - Added `terrainScale` variable (default: 500)
  - Added slider event listener to update scale
  - Added `fetchVersion()` function to get and display version
  - Modified `downloadHeightmap()` to include scale in request
  - Version fetched on page load

## Testing Results

### Scale Parameter Validation
```
Scale 100:  Range=59  (Smooth terrain)
Scale 500:  Range=158 (Balanced - Default)
Scale 1000: Range=170 (Rough terrain)
Scale 2000: Range=170 (Maximum variation)
```

### Existing Tests
- ✅ All existing tests pass
- ✅ Heightmap variation test passes (range > 100)
- ✅ Default behavior maintained (scale=500 when not specified)

### Version Endpoint
- ✅ Returns git commit hash locally
- ✅ Shows version in UI on page load
- ✅ Displays in correct format: `ve48ad04`

## Usage Examples

### API Request with Custom Scale
```bash
curl -X POST http://localhost:3000/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{
    "north": 40.75,
    "south": 40.74,
    "east": -74.00,
    "west": -74.01,
    "scale": 1000
  }' \
  --output heightmap.png
```

### Check Version
```bash
curl http://localhost:3000/api/version
```

## Backward Compatibility

- ✅ **Fully backward compatible**
- ✅ Scale parameter is optional
- ✅ Defaults to 500 if not provided
- ✅ Existing API calls work without modification
- ✅ No breaking changes

## Deployment Notes

### Vercel Environment Variables
For the version to display correctly on Vercel, the platform automatically provides:
- `VERCEL_GIT_COMMIT_SHA` - Full commit SHA
- Falls back to showing short hash from first 7 characters

### Local Development
- Version automatically fetched from git
- Falls back to "dev" if git is not available or repo is not a git repository

## UI Screenshot

![Scale Control and Version Display](https://github.com/user-attachments/assets/9492c553-5e55-4774-b792-73ae86644352)

The screenshot shows:
1. **Terrain Scale slider** in the right panel with value 500
2. **Version display** (ve48ad04) in the bottom-right corner

## Benefits

1. **User Control**: Users can adjust terrain to match their preferences
2. **Smoother Workflow**: No need to regenerate if terrain is too rough/smooth
3. **Version Tracking**: Easy to verify frontend is up-to-date
4. **Debugging**: Version info helps with troubleshooting
5. **Flexibility**: Same location can produce different terrain styles
6. **Transparency**: Users can see exactly what version they're using
