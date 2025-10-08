#!/bin/bash
# Troubleshooting script for Terrain Party
# Tests tile providers and diagnoses map loading issues

echo "🔍 Terrain Party - Tile Provider Diagnostics"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: CARTO tiles
echo "📡 Testing CARTO tiles..."
CARTO_URL="https://a.basemaps.cartocdn.com/rastertiles/voyager/10/301/384.png"
CARTO_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$CARTO_URL" 2>/dev/null)

if [ "$CARTO_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ CARTO tiles: Working${NC} (HTTP $CARTO_RESPONSE)"
else
    echo -e "${RED}✗ CARTO tiles: Failed${NC} (HTTP $CARTO_RESPONSE)"
fi
echo ""

# Test 2: OpenStreetMap tiles
echo "📡 Testing OpenStreetMap tiles..."
OSM_URL="https://tile.openstreetmap.org/10/301/384.png"
OSM_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 -A "TerrainParty-Diagnostic/1.0" "$OSM_URL" 2>/dev/null)

if [ "$OSM_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ OpenStreetMap tiles: Working${NC} (HTTP $OSM_RESPONSE)"
else
    echo -e "${RED}✗ OpenStreetMap tiles: Failed${NC} (HTTP $OSM_RESPONSE)"
fi
echo ""

# Test 3: Local server (if running)
echo "🖥️  Testing local server..."
if curl -s --connect-timeout 5 http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Local server: Running${NC}"
    
    # Test tile proxy
    PROXY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://localhost:3000/api/tiles/10/301/384.png" 2>/dev/null)
    if [ "$PROXY_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✓ Tile proxy: Working${NC} (HTTP $PROXY_RESPONSE)"
    else
        echo -e "${RED}✗ Tile proxy: Failed${NC} (HTTP $PROXY_RESPONSE)"
    fi
else
    echo -e "${YELLOW}⚠ Local server: Not running${NC}"
    echo "  Run 'npm start' to start the server"
fi
echo ""

# Test 4: DNS resolution
echo "🌐 Testing DNS resolution..."
for domain in "a.basemaps.cartocdn.com" "tile.openstreetmap.org"; do
    if nslookup "$domain" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ DNS for $domain: OK${NC}"
    else
        echo -e "${RED}✗ DNS for $domain: Failed${NC}"
    fi
done
echo ""

# Summary
echo "==========================================="
echo "📊 Summary"
echo "==========================================="

if [ "$CARTO_RESPONSE" = "200" ] && [ "$OSM_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ All tile providers are working${NC}"
    echo ""
    echo "If your map still doesn't load:"
    echo "1. Check browser console (F12) for errors"
    echo "2. Disable ad-blockers temporarily"
    echo "3. Try a different browser"
    echo "4. Check docs/TILE_PROVIDERS.md for more help"
elif [ "$CARTO_RESPONSE" = "200" ]; then
    echo -e "${YELLOW}⚠ CARTO works, OSM doesn't${NC}"
    echo ""
    echo "This is OK! CARTO is the primary provider."
    echo "The app will use CARTO tiles and work normally."
elif [ "$OSM_RESPONSE" = "200" ]; then
    echo -e "${YELLOW}⚠ OSM works, CARTO doesn't${NC}"
    echo ""
    echo "This is OK! The app will use OSM as fallback."
    echo "Map will work but might be slower."
else
    echo -e "${RED}✗ Both tile providers failed${NC}"
    echo ""
    echo "Possible causes:"
    echo "1. Internet connection issues"
    echo "2. Firewall blocking map tile servers"
    echo "3. Corporate proxy blocking external requests"
    echo ""
    echo "Solutions:"
    echo "1. Check your internet connection"
    echo "2. Try from a different network"
    echo "3. Check firewall/proxy settings"
    echo "4. Contact your network administrator"
fi

echo ""
echo "For more help, see:"
echo "- docs/TILE_PROVIDERS.md (English)"
echo "- docs/PERCHE_NON_GOOGLE_MAPS.md (Italian)"
echo "- docs/FAQ.md"
