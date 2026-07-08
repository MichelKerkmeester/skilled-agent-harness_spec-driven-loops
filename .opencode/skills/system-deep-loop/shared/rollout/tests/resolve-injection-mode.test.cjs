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

function testEnvOverridePrecedence() {
  withConfig({ 'deep/review': 'fallback' }, (configPath) => {
    const env = { [OVERRIDE_ENV]: 'deep/review:fix' };

    assert.equal(resolveInjectionMode('deep/review', { configPath, env }), 'fix');
    assert.equal(resolveInjectionMode('/deep:review', { configPath, env }), 'fix');
    assert.equal(resolveInjectionMode('deep/research', { configPath, env }), 'fallback');
  });
}

testDefaultFallback();
testJsonOverride();
testEnvOverridePrecedence();

console.log('[command-injection-rollout] resolve-injection-mode tests passed');
