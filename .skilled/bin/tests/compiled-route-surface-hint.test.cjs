#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Surface Hint Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { after, test } = require('node:test');

const ENGINE_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing', '014-runtime-engine', 'lib');
const FRONT_DOOR = path.join(__dirname, '..', 'compiled-route.cjs');
const { compiledRoute } = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));

const WEBFLOW_TESTING = 'Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.';
const WEBFLOW_LANGUAGE = 'Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.';
const OBSIDIAN_WEBFLOW = 'obsidian plugin webflow implementation';
const REVIEW_TWO_SURFACES = 'pr review webflow implementation opencode typescript';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// A temporary activation root whose sk-code manifest selects the policy the
// engine compiles right now. The cases test hint ordering, so they must not
// depend on whether the committed manifest has been re-minted yet.
const ACTIVATION_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'surface-hint-activation-'));
const selected = compiledRoute('sk-code', WEBFLOW_TESTING);
fs.mkdirSync(path.join(ACTIVATION_ROOT, 'sk-code'));
fs.writeFileSync(path.join(ACTIVATION_ROOT, 'sk-code', 'manifest.json'), JSON.stringify({
  servingAuthority: 'compiled',
  selectedPolicy: { effectivePolicyHash: selected.effectivePolicyHash, generation: selected.generation },
}));
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACTIVATION_ROOT;
// Compiled routing is default-on. Clear the flag so an operator's shell cannot
// turn every answer into the legacy sentinel.
delete process.env.SPECKIT_COMPILED_ROUTING;
const { resolveRoute } = require(path.join(ENGINE_DIR, 'resolve.cjs'));

after(() => fs.rmSync(ACTIVATION_ROOT, { recursive: true, force: true }));

function modes(route) {
  return route.targets.map((target) => target.workflowMode);
}

function runFrontDoor(args) {
  return spawnSync(process.execPath, [FRONT_DOOR, ...args], { encoding: 'utf8', env: { ...process.env } });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

test('without a hint the tie-break order decides the lead surface', () => {
  const route = resolveRoute('sk-code', WEBFLOW_TESTING);
  assert.equal(route.action, 'route');
  assert.equal(route.selectionKind, 'orderedBundle');
  assert.deepEqual(modes(route), ['sk-code-opencode', 'sk-code-webflow']);
});

test('a hinted surface the prompt matched leads the bundle', () => {
  for (const prompt of [WEBFLOW_TESTING, WEBFLOW_LANGUAGE]) {
    const route = resolveRoute('sk-code', prompt, { surfaceHint: 'WEBFLOW' });
    assert.equal(route.selectionKind, 'orderedBundle');
    assert.deepEqual(modes(route), ['sk-code-webflow', 'sk-code-opencode']);
  }
  const collision = resolveRoute('sk-code', OBSIDIAN_WEBFLOW, { surfaceHint: 'sk-code-webflow' });
  assert.equal(collision.selectionKind, 'orderedBundle');
  assert.deepEqual(modes(collision), ['sk-code-webflow', 'sk-code-obsidian']);
});

test('a hint the prompt did not match, UNKNOWN or an unknown name changes nothing', () => {
  const plain = resolveRoute('sk-code', WEBFLOW_TESTING);
  for (const surfaceHint of ['OBSIDIAN', 'UNKNOWN', 'not-a-surface', '']) {
    assert.deepEqual(resolveRoute('sk-code', WEBFLOW_TESTING, { surfaceHint }), plain);
  }
});

test('a workflow mode keeps first place and only the surfaces reorder', () => {
  const route = resolveRoute('sk-code', REVIEW_TWO_SURFACES, { surfaceHint: 'WEBFLOW' });
  assert.equal(route.selectionKind, 'surfaceBundle');
  assert.deepEqual(modes(route), ['sk-code-review', 'sk-code-webflow', 'sk-code-opencode']);
});

test('a hub without surface packets ignores the hint', () => {
  for (const hubId of ['sk-doc', 'mcp-tooling']) {
    for (const prompt of ['create a new skill and validate the docs', 'use the figma mcp transport']) {
      assert.deepEqual(compiledRoute(hubId, prompt, { surfaceHint: 'WEBFLOW' }), compiledRoute(hubId, prompt));
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONT DOOR
// ─────────────────────────────────────────────────────────────────────────────

test('the front door passes --surface-hint through and keeps stdout to one route line', () => {
  const plain = runFrontDoor(['--hub', 'sk-code', '--prompt', WEBFLOW_TESTING]);
  const hinted = runFrontDoor(['--hub', 'sk-code', '--prompt', WEBFLOW_TESTING, '--surface-hint', 'WEBFLOW']);
  const invalid = runFrontDoor(['--hub', 'sk-code', '--prompt', WEBFLOW_TESTING, '--surface-hint', 'not-a-surface']);
  for (const run of [plain, hinted, invalid]) {
    assert.equal(run.status, 0);
    assert.equal(run.stderr, '');
  }
  assert.deepEqual(modes(JSON.parse(hinted.stdout)), ['sk-code-webflow', 'sk-code-opencode']);
  assert.equal(invalid.stdout, plain.stdout);
});
