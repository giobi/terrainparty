#!/usr/bin/env node

/**
 * Comprehensive test to demonstrate the fix for issue:
 * "L'immagine esportata è sempre uguale e sbagliata"
 * 
 * This test proves that:
 * 1. Different geographic locations produce different heightmaps
 * 2. The same location produces the same heightmap (consistency)
 * 3. The heightmaps are valid PNG files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const OUTPUT_DIR = './test-output-final';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

function calculateHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function generateHeightmap(location, filename) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(location);
    
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
        const outputPath = path.join(OUTPUT_DIR, filename);
        const fileStream = fs.createWriteStream(outputPath);
        res.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(outputPath);
          const hash = calculateHash(outputPath);
          resolve({ path: outputPath, size: stats.size, hash });
        });
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔍 Testing Fix for: "L\'immagine esportata è sempre uguale"');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Test 1: Different locations produce different heightmaps
  console.log('Test 1: Different locations should produce DIFFERENT heightmaps');
  console.log('─'.repeat(63));
  
  const locations = [
    { name: 'Roma', coords: { north: 41.9462, south: 41.8330, east: 12.5458, west: 12.3962 } },
    { name: 'Milano', coords: { north: 45.5240, south: 45.4108, east: 9.2502, west: 9.1008 } },
    { name: 'Napoli', coords: { north: 40.8889, south: 40.7757, east: 14.3158, west: 14.1664 } }
  ];
  
  const results = [];
  for (const loc of locations) {
    process.stdout.write(`  Generating ${loc.name}... `);
    const result = await generateHeightmap(loc.coords, `heightmap-${loc.name.toLowerCase()}.png`);
    results.push({ ...loc, ...result });
    console.log(`✓ (${(result.size / 1024).toFixed(1)}KB, hash: ${result.hash.substring(0, 12)}...)`);
  }
  
  const hashes = results.map(r => r.hash);
  const uniqueHashes = new Set(hashes);
  
  if (uniqueHashes.size === hashes.length) {
    console.log('\n✅ PASS: All three locations produced DIFFERENT heightmaps!');
  } else {
    console.log('\n❌ FAIL: Some heightmaps are identical!');
    process.exit(1);
  }
  
  // Test 2: Same location produces consistent heightmaps
  console.log('\n\nTest 2: Same location should produce CONSISTENT heightmaps');
  console.log('─'.repeat(63));
  
  const testLoc = locations[0]; // Use Roma
  process.stdout.write(`  Generating ${testLoc.name} (1st time)... `);
  const result1 = await generateHeightmap(testLoc.coords, 'heightmap-consistency-1.png');
  console.log(`✓`);
  
  process.stdout.write(`  Generating ${testLoc.name} (2nd time)... `);
  const result2 = await generateHeightmap(testLoc.coords, 'heightmap-consistency-2.png');
  console.log(`✓`);
  
  if (result1.hash === result2.hash) {
    console.log('\n✅ PASS: Same location produces identical heightmaps!');
  } else {
    console.log('\n❌ FAIL: Same location produced different heightmaps!');
    process.exit(1);
  }
  
  // Test 3: Files are valid PNGs
  console.log('\n\nTest 3: Generated files should be valid PNG images');
  console.log('─'.repeat(63));
  
  let allValid = true;
  for (const result of results) {
    const buffer = fs.readFileSync(result.path);
    const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && 
                  buffer[2] === 0x4E && buffer[3] === 0x47;
    const status = isPNG ? '✓' : '✗';
    console.log(`  ${result.name.padEnd(10)} ${status} ${isPNG ? 'Valid PNG' : 'Invalid format'}`);
    allValid = allValid && isPNG;
  }
  
  if (allValid) {
    console.log('\n✅ PASS: All files are valid PNG images!');
  } else {
    console.log('\n❌ FAIL: Some files are not valid PNGs!');
    process.exit(1);
  }
  
  // Summary
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 SUCCESS: All tests passed!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n✓ Different locations produce different heightmaps');
  console.log('✓ Same location produces consistent heightmaps');
  console.log('✓ All files are valid PNG images');
  console.log('\n🐛 BUG FIXED: Heightmaps are now location-specific!');
  console.log(`📁 Test files saved in: ${OUTPUT_DIR}/\n`);
}

runTests().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
