#!/usr/bin/env node
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATH SETUP
// ─────────────────────────────────────────────────────────────────────────────

const repoRoot = path.resolve(__dirname, '..', '..');
const smokeScript = path.join(__dirname, 'cli-offline-smoke.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. SMOKE SCRIPT EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

const result = spawnSync(process.execPath, [smokeScript, '--format', 'json'], {
  cwd: repoRoot,
  encoding: 'utf8',
  timeout: 60_000,
  maxBuffer: 1024 * 1024 * 10,
  stdio: ['ignore', 'pipe', 'pipe'],
});

assert.strictEqual(result.status, 0, result.stderr || result.stdout);
const payload = JSON.parse(result.stdout);
assert.strictEqual(payload.status, 'ok');
assert.strictEqual(payload.daemonRequired, false);
assert.strictEqual(payload.buildRequired, false);
assert.strictEqual(payload.scanRequired, false);

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRANSPORT RESULT ASSERTIONS
// ─────────────────────────────────────────────────────────────────────────────

const expected = new Map([
  ['spec-memory', 37],
  ['code-index', 8],
  ['skill-advisor', 9],
]);

for (const row of payload.results) {
  assert.strictEqual(row.ok, true, `${row.name} smoke row failed`);
  assert.strictEqual(row.count, expected.get(row.name), `${row.name} count mismatch`);
  assert.strictEqual(row.freshness, 'fresh', `${row.name} freshness mismatch`);
  assert.strictEqual(row.daemonFree, true, `${row.name} used a daemon socket`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BRIDGE CLASSIFY ASSERTIONS
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
  const memoryBridge = await import('../skills/system-spec-kit/mcp-server/plugin-bridges/mk-spec-memory-bridge.mjs');
  const codeGraphBridge = await import('../skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs');
  const advisorBridge = await import('../skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs');

  for (const classify of [memoryBridge.classifyCliFailure, codeGraphBridge.classifyCliFailure]) {
    const stale = classify(69, 'dist entrypoint is stale. Run a build.', false);
    assert.strictEqual(stale.error, 'dist_stale_rebuild_required');
    assert.strictEqual(stale.metadata.staleDist, true);
    assert.strictEqual(stale.metadata.rebuildRequired, true);
    assert.strictEqual(stale.retryable, false);
  }

  const advisorStale = advisorBridge.classifyCliStaleDist(69, 'skill-advisor dist entrypoint is stale. Run a build.');
  assert.strictEqual(advisorStale.state, 'dist_stale_rebuild_required');
  assert.strictEqual(advisorStale.stderr, '[stderr-present]');
  assert.strictEqual(advisorStale.rebuildRequired, true);
})().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`);
  process.exit(1);
});
