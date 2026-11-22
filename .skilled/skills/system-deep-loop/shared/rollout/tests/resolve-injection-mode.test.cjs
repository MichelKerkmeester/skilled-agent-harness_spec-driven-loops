// -----------------------------------------------------------------------------
// COMPONENT: command-injection rollout resolver tests
// PURPOSE: Pin default, JSON, and environment precedence for rollout mode lookup.
// -----------------------------------------------------------------------------
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { OVERRIDE_ENV, resolveInjectionMode } = require('../resolve-injection-mode.cjs');

function withConfig(modeMap, run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-injection-rollout-'));
  const configPath = path.join(root, 'command-injection-rollout.json');

  try {
    fs.writeFileSync(configPath, `${JSON.stringify(modeMap, null, 2)}\n`, 'utf8');
    run(configPath);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function withRawConfig(rawText, run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-injection-rollout-'));
  const configPath = path.join(root, 'command-injection-rollout.json');

  try {
    if (rawText !== null) fs.writeFileSync(configPath, rawText, 'utf8');
    run(configPath);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function testDefaultFallback() {
  withConfig({}, (configPath) => {
    assert.equal(resolveInjectionMode('deep/review', { configPath, env: {} }), 'fallback');
    assert.equal(resolveInjectionMode('/deep:review', { configPath, env: {} }), 'fallback');
    assert.equal(resolveInjectionMode('unknown/command', { configPath, env: {} }), 'fallback');
  });
}

function testJsonOverride() {
  withConfig({ 'deep/review': 'fix' }, (configPath) => {
    assert.equal(resolveInjectionMode('deep/review', { configPath, env: {} }), 'fix');
    assert.equal(resolveInjectionMode('/deep:review', { configPath, env: {} }), 'fix');
  });
}

function testEvidenceBearingJsonEntry() {
  withConfig({
    'deep/review': {
      mode: 'fix',
      evidence: {
        captureManifest: { commands: ['deep/review'] },
        fallbackHash: 'sha256:test-fixture',
        comparatorRuns: [{ status: 'green' }],
        baselineDivergence: { unexpected: 0 },
      },
    },
  }, (configPath) => {
    assert.equal(resolveInjectionMode('deep/review', { configPath, env: {} }), 'fix');
  });
}

function testEnvOverridePrecedence() {
  withConfig({ 'deep/review': 'fallback' }, (configPath) => {
    const env = { [OVERRIDE_ENV]: 'deep/review:fix' };

    assert.equal(resolveInjectionMode('deep/review', { configPath, env }), 'fix');
    assert.equal(resolveInjectionMode('/deep:review', { configPath, env }), 'fix');
    assert.equal(resolveInjectionMode('deep/research', { configPath, env }), 'fallback');
  });
}

// A missing config file is the unconfigured rollout posture, so it still resolves to fallback.
function testMissingConfigFallsBack() {
  withRawConfig(null, (configPath) => {
    assert.equal(resolveInjectionMode('deep/review', { configPath, env: {} }), 'fallback');
  });
}

// A config file that exists but cannot be read as a JSON object is an operator error.
// Swallowing it would quietly resolve every command to fallback, so it must surface.
function testMalformedConfigThrows() {
  withRawConfig('{ "deep/review": "fix", }\n', (configPath) => {
    assert.throws(
      () => resolveInjectionMode('deep/review', { configPath, env: {} }),
      (error) => error.message.startsWith('[command-injection-rollout]') && error.message.includes(configPath),
    );
  });
  withRawConfig('["deep/review"]\n', (configPath) => {
    assert.throws(() => resolveInjectionMode('deep/review', { configPath, env: {} }), /must hold a JSON object/);
  });
}

testDefaultFallback();
testJsonOverride();
testEvidenceBearingJsonEntry();
testEnvOverridePrecedence();
testMissingConfigFallsBack();
testMalformedConfigThrows();

console.log('[command-injection-rollout] resolve-injection-mode tests passed (12 assertions)');
