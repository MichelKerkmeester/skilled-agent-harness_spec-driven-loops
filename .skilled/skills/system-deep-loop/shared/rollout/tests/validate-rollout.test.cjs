// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-rollout tests — guard evidence-bearing command promotions        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { validateRolloutConfig } = require('../validate-rollout.cjs');

function completeFixEntry() {
  return {
    mode: 'fix',
    evidence: {
      captureManifest: { commands: ['deep/review'] },
      fallbackHash: 'sha256:test-fixture',
      comparatorRuns: [{ status: 'green' }],
      baselineDivergence: { unexpected: 0 },
    },
  };
}

function testRepairedRolloutPasses() {
  const configPath = path.join(__dirname, '..', 'command-injection-rollout.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  assert.deepEqual(validateRolloutConfig(config), { valid: true, errors: [] });
}

function testCompleteFixEntryPasses() {
  const result = validateRolloutConfig({ 'deep/review': completeFixEntry() });
  assert.deepEqual(result, { valid: true, errors: [] });
}

function testMissingEvidenceFails() {
  for (const field of ['captureManifest', 'fallbackHash', 'comparatorRuns', 'baselineDivergence']) {
    const entry = completeFixEntry();
    delete entry.evidence[field];

    const result = validateRolloutConfig({ 'deep/review': entry });
    assert.equal(result.valid, false, `${field} must be required`);
    assert.match(result.errors[0], new RegExp(field));
  }
}

function testLegacyFixStringFails() {
  const result = validateRolloutConfig({ 'deep/review': 'fix' });
  assert.equal(result.valid, false);
  assert.match(result.errors[0], /captureManifest/);
}

testRepairedRolloutPasses();
testCompleteFixEntryPasses();
testMissingEvidenceFails();
testLegacyFixStringFails();

console.log('[command-injection-rollout] validate-rollout tests passed (12 assertions)');
