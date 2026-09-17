// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Research State Reducer Sparkline Tests                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const assert = require('node:assert/strict');
const { renderSparkline } = require('./reduce-state.cjs');

const BLOCKS = Array.from('▁▂▃▄▅▆▇█');

function blockRank(char) {
  return BLOCKS.indexOf(char);
}

function firstRank(sparkline) {
  return blockRank(Array.from(sparkline)[0]);
}

function lastRank(sparkline) {
  return blockRank(Array.from(sparkline).at(-1));
}

function assertFixedWidth(sparkline, width = 20) {
  assert.equal(Array.from(sparkline).length, width);
}

function testGrowth() {
  const sparkline = renderSparkline([0.1, 0.3, 0.6, 0.9]);
  assertFixedWidth(sparkline);
  assert.ok(firstRank(sparkline) < lastRank(sparkline), sparkline);
}

function testDecay() {
  const sparkline = renderSparkline([0.9, 0.6, 0.3, 0.1]);
  assertFixedWidth(sparkline);
  assert.ok(firstRank(sparkline) > lastRank(sparkline), sparkline);
}

function testFlat() {
  const sparkline = renderSparkline([0.4, 0.4, 0.4, 0.4]);
  const chars = Array.from(sparkline);
  assertFixedWidth(sparkline);
  assert.equal(new Set(chars).size, 1);
}

testGrowth();
testDecay();
testFlat();

process.stdout.write('renderSparkline tests passed\n');
