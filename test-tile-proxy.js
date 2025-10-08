#!/usr/bin/env node

/**
 * Validation script for the tile proxy endpoint
 * Tests that the endpoint exists and validates parameters correctly
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🧪 Testing Tile Proxy Endpoint...\n');

// Test cases
const tests = [
  {
    name: 'Valid tile coordinates',
    path: '/api/tiles/10/301/384.png',
    expectedStatus: [200, 500], // 200 if OSM is accessible, 500 if not (no internet)
    description: 'Should accept valid tile coordinates'
  },
  {
    name: 'Invalid zoom level',
    path: '/api/tiles/abc/301/384.png',
    expectedStatus: [400],
    description: 'Should reject non-numeric zoom'
  },
  {
    name: 'Out of range coordinates',
    path: '/api/tiles/10/9999/9999.png',
    expectedStatus: [400],
    description: 'Should reject coordinates outside valid range'
  }
];

let testsPassed = 0;
let testsFailed = 0;

function runTest(test, index) {
  return new Promise((resolve) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    console.log(`  ${test.description}`);
    console.log(`  Path: ${test.path}`);
    
    http.get(`${BASE_URL}${test.path}`, (res) => {
      const passed = test.expectedStatus.includes(res.statusCode);
      
      if (passed) {
        console.log(`  ✅ PASS (Status: ${res.statusCode})`);
        testsPassed++;
      } else {
        console.log(`  ❌ FAIL (Expected: ${test.expectedStatus.join(' or ')}, Got: ${res.statusCode})`);
        testsFailed++;
      }
      console.log();
      
      // Consume response data to free up memory
      res.resume();
      res.on('end', resolve);
    }).on('error', (err) => {
      console.log(`  ❌ ERROR: ${err.message}`);
      testsFailed++;
      console.log();
      resolve();
    });
  });
}

// Run tests sequentially
async function runAllTests() {
  for (let i = 0; i < tests.length; i++) {
    await runTest(tests[i], i);
  }
  
  // Summary
  console.log('━'.repeat(50));
  console.log('Test Summary:');
  console.log(`  Total: ${tests.length}`);
  console.log(`  ✅ Passed: ${testsPassed}`);
  console.log(`  ❌ Failed: ${testsFailed}`);
  console.log('━'.repeat(50));
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
    console.log('The tile proxy endpoint is configured correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the configuration.');
    process.exit(1);
  }
}

// Check if server is running first
http.get(`${BASE_URL}/`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Server is running\n');
    res.resume();
    runAllTests();
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
