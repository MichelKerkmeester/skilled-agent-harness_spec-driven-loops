'use strict';
const assert = require('node:assert');
const { sumRange } = require('./sum-range.js');

assert.strictEqual(sumRange(1, 4), 10);
assert.strictEqual(sumRange(3, 3), 3);
console.log('sum-range: 2 assertions passed');
