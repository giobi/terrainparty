# Terrain Party - CS2 Heightmap Generator

A web application that replicates the functionality of terrain.party for Cities Skylines 2. This tool allows you to select any 12.6km × 12.6km area on OpenStreetMap and download a grayscale heightmap PNG suitable for importing into Cities Skylines 2.

## Features

- 🗺️ Interactive OpenStreetMap interface
- 📏 Precise 12.6km × 12.6km area selection
- 🏔️ Real elevation data using Open-Elevation API
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

## Technical Details

- **Map Size**: Exactly 12.6km × 12.6km (as required by Cities Skylines 2)
- **Output Format**: Grayscale PNG, 1081×1081 pixels
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

## License

ISC

## Credits

This project is inspired by the original terrain.party website, recreated for Cities Skylines 2 heightmap generation.
