# Heightmap Format for Cities Skylines 2

## Overview
This application generates heightmaps in the format required by Cities Skylines 2 (CS2).

## Specifications

### Image Format
- **File Type**: PNG (Portable Network Graphics)
- **Color Mode**: Grayscale
- **Bit Depth**: 8-bit (256 levels)
- **Dimensions**: 1081 × 1081 pixels

### Map Dimensions
- **Physical Size**: 12.6 km × 12.6 km (12,600 meters square)
- **This matches**: CS2's standard map size requirement

### Elevation Encoding
- **Black (0)**: Lowest elevation
- **White (255)**: Highest elevation
- **Gray values**: Intermediate elevations

The grayscale value represents the height at that point on the terrain:
- Value 0 (black) = minimum elevation
- Value 127 (mid-gray) = mid-range elevation
- Value 255 (white) = maximum elevation

## Importing into Cities Skylines 2

1. Generate your heightmap using this tool
2. Save the PNG file
3. In CS2, create a new map
4. Import the heightmap PNG file
5. The terrain will be generated based on the heightmap

## Technical Notes

### Coordinate System
The heightmap uses a standard Web Mercator projection (EPSG:3857) for coordinate calculations.

### Resolution
With 1081×1081 pixels covering 12.6km × 12.6km:
- Each pixel represents approximately 11.66 meters
- This provides sufficient detail for most terrain features

### Elevation Range
The synthetic terrain generator normalizes elevations to the full 0-255 range. When real elevation data is available (via Open-Elevation API), elevations are normalized from -500m to +9000m to the 0-255 grayscale range.

## Example Usage

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser
# Navigate to http://localhost:3000

# Select an area on the map
# Download the heightmap

# Import into Cities Skylines 2
```

## API Endpoint

### POST /api/generate-heightmap

Generates a heightmap for the specified bounds.

**Request Body:**
```json
{
  "north": 40.7699,
  "south": 40.6567,
  "east": -73.9313,
  "west": -74.0807
}
```

**Response:**
- Content-Type: image/png
- Binary PNG data (1081×1081 grayscale image)

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{"north":40.7699,"south":40.6567,"east":-73.9313,"west":-74.0807}' \
  --output heightmap.png
```
