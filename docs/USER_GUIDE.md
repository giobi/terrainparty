# Terrain Party - User Guide

Welcome to Terrain Party! This guide will help you generate heightmaps for Cities Skylines 2.

## What is Terrain Party?

Terrain Party is a web application that allows you to select any location in the world and download a heightmap (terrain elevation data) formatted specifically for Cities Skylines 2. The heightmap is a grayscale image where darker pixels represent lower elevations and lighter pixels represent higher elevations.

## Quick Start

### Getting Started in 3 Steps

1. **Find Your Location**: Navigate the interactive map to find the area you want to use in Cities Skylines 2
2. **Select the Area**: Click the "Select Area" button, then click on the map where you want to center your 12.6km × 12.6km square
3. **Download**: Click "Download Heightmap" to generate and download your PNG file

### What You'll Get

- A grayscale PNG image
- Size: 1081 × 1081 pixels
- Represents: 12.6km × 12.6km area (the standard size for Cities Skylines 2)
- Ready to import directly into Cities Skylines 2

## Using the Map

### Navigation

**Pan (Move Around)**
- Click and drag on the map to move around
- Use your mouse to explore different areas

**Zoom**
- Use the **+** and **-** buttons in the top-left corner
- Or use your mouse wheel to zoom in and out
- Zoom in to see more detail, zoom out to see more area

**Current Location**
- Check the bottom-left corner to see your current latitude, longitude, and zoom level
- Example: "Lat: 40.7128, Lon: -74.0060 | Zoom: 10"

### Selecting Your Area

1. Click the blue **"Select Area (Click Map)"** button
2. The button will change to show you're in selection mode
3. Click anywhere on the map to place your 12.6km square
4. You'll see:
   - A blue square showing your selected area
   - The center coordinates displayed in the controls panel
   - The "Download Heightmap" button will turn green and become clickable

### Downloading Your Heightmap

1. After selecting an area, click the green **"Download Heightmap"** button
2. Wait a few seconds while the heightmap is generated
   - You'll see a loading spinner and status message
3. The PNG file will download automatically to your computer
4. The file will be named like: `heightmap_40.7699_-74.0807.png`

### Starting Over

- Click the red **"Clear Selection"** button to remove your selection
- You can then select a different area

## Understanding the Controls Panel

The right-side panel shows important information:

### How to Use
Step-by-step instructions for using the tool

### Area Information
- **Area Size**: Always 12.6 km × 12.6 km (Cities Skylines 2 standard)
- **Output**: 1081×1081 px PNG
- **Center**: Shows the coordinates of your selected area (or "Click map to select")

### Buttons
- **Blue Button**: Select Area - Enter selection mode
- **Green Button**: Download Heightmap - Generate and download your file
- **Red Button**: Clear Selection - Remove your selection and start over

## Importing to Cities Skylines 2

Once you've downloaded your heightmap:

1. Open Cities Skylines 2
2. Start a new game or create a new map
3. Look for the "Import Heightmap" or "Custom Terrain" option
4. Select your downloaded PNG file
5. The terrain will be generated based on the heightmap!

### Tips for Best Results

- **Zoom Level**: Use zoom level 10-13 for most cities
- **Coastal Areas**: Select areas that include both land and water for interesting maps
- **Mountainous Regions**: Great for challenging gameplay with elevation changes
- **Flat Areas**: Good for building large cities with fewer constraints

## Understanding Heightmaps

### What is a Heightmap?

A heightmap is an image that represents terrain elevation:
- **Black (dark)**: Low elevation (valleys, sea level)
- **White (light)**: High elevation (mountains, hills)
- **Gray**: Medium elevation

### Technical Details

- **Format**: PNG (Portable Network Graphics)
- **Color Mode**: Grayscale (256 shades of gray)
- **Resolution**: 1081 × 1081 pixels
- **Coverage**: 12.6km × 12.6km
- **Detail Level**: Each pixel represents approximately 11.66 meters

## Troubleshooting

### The map won't load
- Check your internet connection
- Refresh the page
- Make sure you're using a modern web browser (Chrome, Firefox, Edge, Safari)

### The download button is disabled
- Make sure you've selected an area first
- Click "Select Area" then click on the map

### The heightmap looks wrong in Cities Skylines 2
- Make sure you selected the correct area
- Try a different location
- Verify the file is 1081×1081 pixels

### The download is taking a long time
- Generation usually takes 2-5 seconds
- Larger files may take longer
- If it's taking more than 30 seconds, try refreshing and selecting again

## Examples

### Creating a Coastal City
1. Navigate to a coastal area (e.g., San Francisco, Miami, Sydney)
2. Select an area that includes both ocean and land
3. Download and import into CS2
4. You'll get natural harbors and waterfront areas

### Creating a Mountain City
1. Navigate to a mountainous region (e.g., Denver, Innsbruck, Kathmandu)
2. Select an area with varied elevation
3. Download and import into CS2
4. You'll get challenging terrain with valleys and peaks

### Creating a River City
1. Navigate to an area with a major river (e.g., New York, London, Paris)
2. Center your selection on the river
3. Download and import into CS2
4. You'll get natural water features dividing your city

## Tips for Power Users

### Finding Interesting Locations
- Search for specific coordinates online
- Look for areas with varied terrain
- Consider real-world cities you want to recreate
- Experiment with different zoom levels

### Multiple Downloads
- You can download as many heightmaps as you want
- Each download is independent
- Files are named with their coordinates

### Coordinate Reference
- The tool uses standard latitude/longitude (WGS84)
- Positive latitude = North, Negative = South
- Positive longitude = East, Negative = West

## Privacy & Data

- No data is stored on our servers
- No account or login required
- All processing happens in real-time
- Your selections are not saved

## Support

If you need help:
1. Check this documentation first
2. Review the technical documentation (see ARCHITECTURE.md)
3. Check the GitHub repository for updates
4. Report issues on the GitHub issues page

## Credits

This tool is inspired by the original terrain.party website, recreated specifically for Cities Skylines 2 heightmap generation.

---

**Have fun building your cities!** 🏙️🏔️
