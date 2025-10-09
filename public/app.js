// Map implementation with OpenStreetMap tiles
let canvas, ctx;
let mapCenter = { lat: 40.7128, lon: -74.0060 }; // Default: New York
let zoom = 10;
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };
let selectionBox = null;
let currentBounds = null;
let isSelecting = false;
let tileCache = new Map(); // Cache for loaded tiles
let loadingTiles = new Set(); // Track tiles being loaded
let terrainScale = 50; // Default terrain scale

// Map projection utilities (Web Mercator)
function latLonToPixel(lat, lon, zoom) {
    const scale = 256 * Math.pow(2, zoom);
    const x = (lon + 180) / 360 * scale;
    const latRad = lat * Math.PI / 180;
    const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale;
    return { x, y };
}

function pixelToLatLon(x, y, zoom) {
    const scale = 256 * Math.pow(2, zoom);
    const lon = x / scale * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / scale;
    const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    return { lat, lon };
}

function getMapPixelCenter() {
    return latLonToPixel(mapCenter.lat, mapCenter.lon, zoom);
}

function screenToLatLon(screenX, screenY) {
    const centerPixel = getMapPixelCenter();
    const dx = screenX - canvas.width / 2;
    const dy = screenY - canvas.height / 2;
    return pixelToLatLon(centerPixel.x + dx, centerPixel.y + dy, zoom);
}

// Initialize the map
function initMap() {
    canvas = document.getElementById('map');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onMapClick);
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        zoom = Math.min(18, zoom + 1);
        drawMap();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        zoom = Math.max(2, zoom - 1);
        drawMap();
    });
    
    // Scale slider
    const scaleSlider = document.getElementById('scaleSlider');
    const scaleValue = document.getElementById('scaleValue');
    scaleSlider.addEventListener('input', (e) => {
        terrainScale = parseFloat(e.target.value);
        scaleValue.textContent = terrainScale;
    });
    
    // Fetch and display version
    fetchVersion();
    
    drawMap();
    console.log('Map initialized');
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMap();
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw OpenStreetMap tiles
    drawMapTiles();
    
    // Draw selection box if exists
    if (selectionBox) {
        drawSelectionBox();
    }
    
    // Update map info
    updateMapInfo();
}

function drawMapTiles() {
    const tileSize = 256;
    const centerPixel = getMapPixelCenter();
    
    // Calculate which tiles we need to display
    const startX = Math.floor((centerPixel.x - canvas.width / 2) / tileSize);
    const startY = Math.floor((centerPixel.y - canvas.height / 2) / tileSize);
    const endX = Math.ceil((centerPixel.x + canvas.width / 2) / tileSize);
    const endY = Math.ceil((centerPixel.y + canvas.height / 2) / tileSize);
    
    // Draw each tile
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            drawTile(x, y, tileSize);
        }
    }
}

function drawTile(tileX, tileY, tileSize) {
    // Validate tile coordinates
    const maxTile = Math.pow(2, zoom);
    if (tileX < 0 || tileX >= maxTile || tileY < 0 || tileY >= maxTile) {
        return;
    }
    
    const tileKey = `${zoom}/${tileX}/${tileY}`;
    const centerPixel = getMapPixelCenter();
    
    // Calculate screen position for this tile
    const screenX = (tileX * tileSize - centerPixel.x) + canvas.width / 2;
    const screenY = (tileY * tileSize - centerPixel.y) + canvas.height / 2;
    
    // Check if tile is in cache
    if (tileCache.has(tileKey)) {
        const img = tileCache.get(tileKey);
        if (img.complete && img.naturalHeight !== 0) {
            ctx.drawImage(img, screenX, screenY, tileSize, tileSize);
        }
    } else if (!loadingTiles.has(tileKey)) {
        // Load tile if not already loading
        loadingTiles.add(tileKey);
        const img = new Image();
        
        img.onload = () => {
            tileCache.set(tileKey, img);
            loadingTiles.delete(tileKey);
            drawMap(); // Redraw when tile loads
        };
        
        img.onerror = () => {
            loadingTiles.delete(tileKey);
            console.log(`Failed to load tile: ${tileKey}`);
            // Draw placeholder for failed tiles
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(screenX, screenY, tileSize, tileSize);
            ctx.strokeStyle = '#1a1a1a';
            ctx.strokeRect(screenX, screenY, tileSize, tileSize);
        };
        
        // Try proxy first, fallback to direct OSM if proxy fails
        // Format: /api/tiles/{z}/{x}/{y}.png
        img.src = `/api/tiles/${zoom}/${tileX}/${tileY}.png`;
        
        // Draw loading placeholder
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(screenX, screenY, tileSize, tileSize);
        ctx.strokeStyle = '#34495e';
        ctx.strokeRect(screenX, screenY, tileSize, tileSize);
    }
}

function drawSelectionBox() {
    if (!selectionBox) return;
    
    const { topLeft, bottomRight } = selectionBox;
    const x = topLeft.x;
    const y = topLeft.y;
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    
    // Fill
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    ctx.fillRect(x, y, width, height);
    
    // Border
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Corner markers
    const markerSize = 10;
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x - markerSize/2, y - markerSize/2, markerSize, markerSize);
    ctx.fillRect(x + width - markerSize/2, y - markerSize/2, markerSize, markerSize);
    ctx.fillRect(x - markerSize/2, y + height - markerSize/2, markerSize, markerSize);
    ctx.fillRect(x + width - markerSize/2, y + height - markerSize/2, markerSize, markerSize);
}

function updateMapInfo() {
    const info = document.getElementById('mapCoords');
    info.textContent = `Lat: ${mapCenter.lat.toFixed(4)}, Lon: ${mapCenter.lon.toFixed(4)} | Zoom: ${zoom}`;
}

function onMouseDown(e) {
    isDragging = true;
    lastMousePos = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
}

function onMouseMove(e) {
    if (!isDragging) return;
    
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    // Convert pixel movement to lat/lon movement
    const scale = 256 * Math.pow(2, zoom);
    const lonDelta = -dx * 360 / scale;
    const centerPixel = getMapPixelCenter();
    const newCenterPixel = { x: centerPixel.x - dx, y: centerPixel.y - dy };
    const newCenter = pixelToLatLon(newCenterPixel.x, newCenterPixel.y, zoom);
    
    mapCenter = newCenter;
    lastMousePos = { x: e.clientX, y: e.clientY };
    
    drawMap();
}

function onMouseUp(e) {
    isDragging = false;
    canvas.style.cursor = 'move';
}

function onWheel(e) {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY);
    zoom = Math.max(2, Math.min(18, zoom + delta));
    drawMap();
}

// Handle map clicks to place selection rectangle
function onMapClick(e) {
    if (!isSelecting || isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedLatLon = screenToLatLon(x, y);
    placeSelectionRectangle(clickedLatLon);
    
    isSelecting = false;
    document.getElementById('selectAreaBtn').textContent = '📍 Select Area (Click Map)';
    document.getElementById('selectAreaBtn').disabled = false;
    document.getElementById('downloadBtn').disabled = false;
}

// Calculate bounds for a 12.6km x 12.6km square centered at given point
function calculateBounds(center) {
    const lat = center.lat;
    const lon = center.lon;
    
    // 12.6km = 12600 meters
    const distance = 12600; // meters
    const halfDistance = distance / 2;
    
    // Calculate offsets in degrees
    const latOffset = (halfDistance / 111320);
    const lonOffset = (halfDistance / (111320 * Math.cos(lat * Math.PI / 180)));
    
    return {
        north: lat + latOffset,
        south: lat - latOffset,
        east: lon + lonOffset,
        west: lon - lonOffset
    };
}

// Place selection rectangle on the map
function placeSelectionRectangle(center) {
    currentBounds = calculateBounds(center);
    
    // Convert bounds to screen coordinates
    const nw = latLonToPixel(currentBounds.north, currentBounds.west, zoom);
    const se = latLonToPixel(currentBounds.south, currentBounds.east, zoom);
    const mapPixelCenter = getMapPixelCenter();
    
    const topLeft = {
        x: canvas.width / 2 + (nw.x - mapPixelCenter.x),
        y: canvas.height / 2 + (nw.y - mapPixelCenter.y)
    };
    
    const bottomRight = {
        x: canvas.width / 2 + (se.x - mapPixelCenter.x),
        y: canvas.height / 2 + (se.y - mapPixelCenter.y)
    };
    
    selectionBox = { topLeft, bottomRight, center };
    
    drawMap();
    updateCoordinatesDisplay(center);
    showStatus('Area selected! Click "Download Heightmap" to generate.', 'success');
}

// Update the coordinates display
function updateCoordinatesDisplay(center) {
    const coordsElement = document.getElementById('centerCoords');
    coordsElement.innerHTML = `<strong>Center:</strong> ${center.lat.toFixed(4)}°, ${center.lon.toFixed(4)}°`;
}

// Show status message
function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';
    
    if (type !== 'info') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Clear selection
function clearSelection() {
    selectionBox = null;
    currentBounds = null;
    
    drawMap();
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('centerCoords').innerHTML = '<strong>Center:</strong> Click map to select';
    document.getElementById('status').style.display = 'none';
    isSelecting = false;
    document.getElementById('selectAreaBtn').textContent = '📍 Select Area (Click Map)';
    document.getElementById('selectAreaBtn').disabled = false;
}

// Download heightmap
async function downloadHeightmap() {
    if (!currentBounds) {
        showStatus('Please select an area first!', 'error');
        return;
    }

    try {
        document.querySelector('.loading').classList.add('active');
        document.getElementById('downloadBtn').disabled = true;
        showStatus('Generating heightmap... This may take a few minutes.', 'info');

        const requestData = {
            ...currentBounds,
            scale: terrainScale
        };

        const response = await fetch('/api/generate-heightmap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate heightmap');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `heightmap_${currentBounds.north.toFixed(4)}_${currentBounds.west.toFixed(4)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showStatus('Heightmap downloaded successfully!', 'success');

    } catch (error) {
        console.error('Error downloading heightmap:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        document.querySelector('.loading').classList.remove('active');
        document.getElementById('downloadBtn').disabled = false;
    }
}

// Fetch and display version
async function fetchVersion() {
    try {
        const response = await fetch('/api/version');
        if (response.ok) {
            const data = await response.json();
            const versionElement = document.getElementById('versionInfo');
            versionElement.textContent = `v${data.version}`;
            versionElement.title = `Version: ${data.version}\nUpdated: ${new Date(data.timestamp).toLocaleString()}`;
            console.log('Frontend version:', data.version);
        }
    } catch (error) {
        console.log('Could not fetch version:', error);
    }
}

// Event listeners
document.getElementById('selectAreaBtn').addEventListener('click', () => {
    isSelecting = true;
    document.getElementById('selectAreaBtn').textContent = '📍 Click on map to select area...';
    document.getElementById('selectAreaBtn').disabled = true;
    showStatus('Click anywhere on the map to place your 12.6km × 12.6km selection.', 'info');
});

document.getElementById('downloadBtn').addEventListener('click', downloadHeightmap);
document.getElementById('clearBtn').addEventListener('click', clearSelection);

// Initialize on page load
window.addEventListener('load', initMap);
