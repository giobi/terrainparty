#!/usr/bin/env node

/**
 * Test script to verify heightmaps have proper terrain variation
 * This ensures downloaded heightmaps aren't grey squares
 */

const http = require('http');
const sharp = require('sharp');

const PORT = process.env.PORT || 3000;

console.log('🧪 Testing Heightmap Variation...\n');

// Test locations
const testLocations = [
  { name: 'New York', bounds: { north: 40.75, south: 40.74, east: -74.00, west: -74.01 } },
  { name: 'London', bounds: { north: 51.51, south: 51.50, east: -0.12, west: -0.13 } },
  { name: 'Tokyo', bounds: { north: 35.69, south: 35.68, east: 139.77, west: 139.76 } }
];

async function testHeightmap(name, bounds) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(bounds);
    
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
    
    console.log(`Testing ${name}...`);
    
    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.log(`  ❌ FAIL: Status ${res.statusCode}`);
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          
          // Verify it's a valid PNG
          if (!buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
            console.log(`  ❌ FAIL: Not a valid PNG`);
            reject(new Error('Invalid PNG'));
            return;
          }
          
          // Analyze the image
          const img = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
          const { data, info } = img;
          
          // Calculate statistics
          let min = 255, max = 0, sum = 0, count = 0;
          for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            sum += r;
            min = Math.min(min, r);
            max = Math.max(max, r);
            count++;
          }
          
          const range = max - min;
          const avg = Math.round(sum / count);
          
          console.log(`  Size: ${info.width}x${info.height}`);
          console.log(`  Range: ${min} - ${max} (${range})`);
          console.log(`  Avg: ${avg}`);
          
          // Check if there's good variation (not a grey square)
          // A proper heightmap should have at least 100 points of variation
          if (range < 100) {
            console.log(`  ❌ FAIL: Insufficient variation (grey square)\n`);
            reject(new Error('Insufficient variation'));
          } else {
            console.log(`  ✅ PASS: Good terrain variation\n`);
            resolve({ name, range, avg, min, max });
          }
        } catch (error) {
          console.log(`  ❌ FAIL: ${error.message}\n`);
          reject(error);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`  ❌ ERROR: ${err.message}\n`);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;
  
  for (const location of testLocations) {
    try {
      await testHeightmap(location.name, location.bounds);
      passed++;
    } catch (error) {
      failed++;
    }
  }
  
  // Summary
  console.log('━'.repeat(50));
  console.log('Test Summary:');
  console.log(`  Total: ${testLocations.length}`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log('━'.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    console.log('Heightmaps have proper terrain variation (not grey squares).');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed.');
    console.log('Heightmaps may still appear as grey squares.');
    process.exit(1);
  }
}

// Check if server is running first
http.get(`http://localhost:${PORT}/`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Server is running\n');
    res.resume();
    runTests();
  } else {
    console.log('❌ Server returned unexpected status\n');
    process.exit(1);
  }
}).on('error', (err) => {
  console.log('❌ Server is not running or not accessible\n');
  console.log(`   Error: ${err.message}\n`);
  console.log('Please start the server with: npm start');
  process.exit(1);
});
