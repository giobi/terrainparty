#!/usr/bin/env node

/**
 * Simple validation script for the terrain.party server
 * Tests that the server is running and can generate heightmaps
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const OUTPUT_DIR = './test-output';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

console.log('🧪 Testing Terrain Party Server...\n');

// Test 1: Check if server is running
console.log('Test 1: Checking if server is running...');
http.get(`http://localhost:${PORT}/`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Server is running\n');
    
    // Test 2: Generate a small test heightmap
    console.log('Test 2: Generating test heightmap...');
    
    const postData = JSON.stringify({
      north: 40.75,
      south: 40.74,
      east: -74.00,
      west: -74.01
    });
    
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/generate-heightmap',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        const outputPath = path.join(OUTPUT_DIR, 'test-heightmap.png');
        const fileStream = fs.createWriteStream(outputPath);
        
        let totalBytes = 0;
        res.on('data', (chunk) => {
          totalBytes += chunk.length;
        });
        
        res.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          
          // Verify the file
          const stats = fs.statSync(outputPath);
          console.log(`✅ Heightmap generated successfully`);
          console.log(`   File size: ${Math.round(stats.size / 1024)}KB`);
          console.log(`   Location: ${outputPath}\n`);
          
          // Test 3: Verify PNG header
          console.log('Test 3: Verifying PNG format...');
          const buffer = fs.readFileSync(outputPath);
          const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
          
          if (isPNG) {
            console.log('✅ Valid PNG format\n');
            console.log('🎉 All tests passed!\n');
            console.log('The terrain.party server is working correctly.');
            console.log('You can now use the web interface at http://localhost:' + PORT);
          } else {
            console.log('❌ Invalid PNG format\n');
            process.exit(1);
          }
        });
      } else {
        console.log(`❌ Failed to generate heightmap (Status: ${res.statusCode})\n`);
        process.exit(1);
      }
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error: ${err.message}\n`);
      process.exit(1);
    });
    
    req.write(postData);
    req.end();
    
  } else {
    console.log(`❌ Server returned status: ${res.statusCode}\n`);
    process.exit(1);
  }
}).on('error', (err) => {
  console.log('❌ Server is not running or not accessible\n');
  console.log(`   Error: ${err.message}\n`);
  console.log('Please start the server with: npm start');
  process.exit(1);
});
