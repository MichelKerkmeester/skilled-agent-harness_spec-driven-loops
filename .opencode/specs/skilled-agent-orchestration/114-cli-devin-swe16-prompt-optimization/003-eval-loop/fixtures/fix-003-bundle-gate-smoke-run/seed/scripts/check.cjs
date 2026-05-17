const { defineConfig } = require('vitest/config');

const config = defineConfig({});

if (!config || typeof config !== 'object') {
  console.error('FAIL: defineConfig({}) did not return a valid config object');
  process.exit(1);
}

console.log('PASS: defineConfig({}) returned valid config');
process.exit(0);
