#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ generate-leaf-manifest-scopes.test — per-mode leaf scoping coverage      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the authored leaf-scopes contract: two workflow modes fanned onto
 * one physical packet must each resolve their own leaves instead of the whole
 * shared corpus, a collision must fail generation before a manifest is
 * written, and a malformed scope must fail closed rather than silently
 * widening or emptying a mode's leaf set.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const generator = require('../generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

let tmpRoot = null;

function makeTmpDir(label) {
  if (!tmpRoot) tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-scopes-'));
  return fs.mkdtempSync(path.join(tmpRoot, `${label}-`));
}

function writeFile(root, relativePath, content) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// One packet, two modes: the N-to-1 fan-out shape the scopes contract exists
// for. Without scopes both modes walk the whole packet and collide.
function makeSharedPacketHub(label) {
  const skillDir = makeTmpDir(label);
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [
      { workflowMode: 'lane-a', packet: 'shared-packet' },
      { workflowMode: 'lane-b', packet: 'shared-packet' },
    ],
  }, null, 2)}\n`);
  writeFile(skillDir, 'shared-packet/references/lane-a/a.md', '# a\n');
  writeFile(skillDir, 'shared-packet/references/lane-b/b.md', '# b\n');
  writeFile(skillDir, 'shared-packet/references/shared/s.md', '# s\n');
  writeFile(skillDir, 'shared-packet/assets/lane-a/x.md', '# x\n');
  writeFile(skillDir, 'shared-packet/assets/lane-b/y.md', '# y\n');
  return skillDir;
}

function readManifest(skillDir) {
  return JSON.parse(generator.buildManifestBytes(skillDir).toString('utf8'));
}

function writeScopes(skillDir, payload) {
  writeFile(skillDir, 'leaf-scopes.json', `${JSON.stringify(payload, null, 2)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COLLISION DETECTION
// ─────────────────────────────────────────────────────────────────────────────

// Without authored scopes, both modes resolve the shared packet's whole
// corpus, so the generator must refuse to write identical typed routes.
function testUnscopedSharedPacketFailsGeneration() {
  const skillDir = makeSharedPacketHub('unscoped');
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => {
      assert.equal(error.code, 'MODE_LEAF_SET_COLLISION');
      assert.match(error.message, /"lane-a"/);
      assert.match(error.message, /"lane-b"/);
      assert.match(error.message, /leaf-scopes\.json/);
      return true;
    },
  );
}

// The registry-less standalone path has exactly one mode, so a manifest with
// distinct packets still generates without any scope file.
function testDistinctPacketsGenerateWithoutScopes() {
  const skillDir = makeTmpDir('distinct');
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [
      { workflowMode: 'mode-a', packet: 'packet-a' },
      { workflowMode: 'mode-b', packet: 'packet-b' },
    ],
  }, null, 2)}\n`);
  writeFile(skillDir, 'packet-a/references/a.md', '# a\n');
  writeFile(skillDir, 'packet-b/references/b.md', '# b\n');

  const manifest = readManifest(skillDir);
  assert.deepEqual(manifest.modes.map((mode) => mode.leaves), [['references/a.md'], ['references/b.md']]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCOPED GENERATION
// ─────────────────────────────────────────────────────────────────────────────

function testScopesSplitSharedPacketByLane() {
  const skillDir = makeSharedPacketHub('scoped');
  writeScopes(skillDir, [
    { workflowMode: 'lane-a', leafScopes: ['assets/lane-a', 'references/lane-a', 'references/shared'] },
    { workflowMode: 'lane-b', leafScopes: ['assets/lane-b', 'references/lane-b', 'references/shared'] },
  ]);

  const manifest = readManifest(skillDir);
  const byMode = new Map(manifest.modes.map((mode) => [mode.workflowMode, mode.leaves]));
  assert.deepEqual(byMode.get('lane-a'), [
    'assets/lane-a/x.md',
    'references/lane-a/a.md',
    'references/shared/s.md',
  ]);
  assert.deepEqual(byMode.get('lane-b'), [
    'assets/lane-b/y.md',
    'references/lane-b/b.md',
    'references/shared/s.md',
  ]);
  // The union still registers the whole packet: a lane is narrowed, never
  // orphaned, and the shared control leaf is addressable from both lanes.
  const union = new Set([...(byMode.get('lane-a') || []), ...(byMode.get('lane-b') || [])]);
  assert.deepEqual([...union].sort(), [
    'assets/lane-a/x.md',
    'assets/lane-b/y.md',
    'references/lane-a/a.md',
    'references/lane-b/b.md',
    'references/shared/s.md',
  ]);

  // Regeneration is a pure function of the corpus + scope file.
  assert.equal(Buffer.compare(generator.buildManifestBytes(skillDir), generator.buildManifestBytes(skillDir)), 0);
}

// A file scope names exactly one leaf, so a mode can own a single document
// without claiming the directory around it.
function testFileScopeContributesExactlyThatLeaf() {
  const skillDir = makeSharedPacketHub('file-scope');
  writeScopes(skillDir, {
    scopes: [
      { workflowMode: 'lane-a', leafScopes: ['references/lane-a/a.md'] },
      { workflowMode: 'lane-b', leafScopes: ['references/lane-b'] },
    ],
  });

  const byMode = new Map(readManifest(skillDir).modes.map((mode) => [mode.workflowMode, mode.leaves]));
  assert.deepEqual(byMode.get('lane-a'), ['references/lane-a/a.md']);
  assert.deepEqual(byMode.get('lane-b'), ['references/lane-b/b.md']);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FAIL-CLOSED SCOPES
// ─────────────────────────────────────────────────────────────────────────────

function testScopeDeclaredForUnknownModeFails() {
  const skillDir = makeSharedPacketHub('orphan-scope');
  writeScopes(skillDir, [{ workflowMode: 'ghost-lane', leafScopes: ['references/lane-a'] }]);
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'ORPHAN_LEAF_SCOPE_MODE' && /ghost-lane/.test(error.message),
  );
}

function testMissingScopePathFails() {
  const skillDir = makeSharedPacketHub('missing-scope');
  writeScopes(skillDir, [{ workflowMode: 'lane-a', leafScopes: ['references/no-such-lane'] }]);
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'MISSING_LEAF_SCOPE' && /no-such-lane/.test(error.message),
  );
}

function testScopeEscapingPacketOrRootFails() {
  const skillDir = makeSharedPacketHub('bad-scope');
  writeScopes(skillDir, [{ workflowMode: 'lane-a', leafScopes: ['references/../../outside'] }]);
  assert.throws(() => generator.buildManifestBytes(skillDir), (error) => error.code === 'LEAF_SCOPE_TRAVERSAL');

  writeScopes(skillDir, [{ workflowMode: 'lane-a', leafScopes: ['mode-registry.json'] }]);
  assert.throws(() => generator.buildManifestBytes(skillDir), (error) => error.code === 'OUT_OF_ROOT_LEAF_SCOPE');

  writeScopes(skillDir, [{ workflowMode: 'lane-a', leafScopes: ['/references/lane-a'] }]);
  assert.throws(() => generator.buildManifestBytes(skillDir), (error) => error.code === 'ABSOLUTE_LEAF_SCOPE');
}

function testDuplicateScopeModeFails() {
  const skillDir = makeSharedPacketHub('duplicate-scope');
  writeScopes(skillDir, [
    { workflowMode: 'lane-a', leafScopes: ['references/lane-a'] },
    { workflowMode: 'lane-a', leafScopes: ['assets/lane-a'] },
  ]);
  assert.throws(() => generator.buildManifestBytes(skillDir), (error) => error.code === 'DUPLICATE_LEAF_SCOPE_MODE');
}

function testEmptyScopesArrayFails() {
  const skillDir = makeSharedPacketHub('empty-scope');
  writeScopes(skillDir, { scopes: [{ workflowMode: 'lane-a', leafScopes: [] }] });
  assert.throws(() => generator.buildManifestBytes(skillDir), (error) => error.code === 'MALFORMED_LEAF_SCOPES');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RUN
// ─────────────────────────────────────────────────────────────────────────────

try {
  testUnscopedSharedPacketFailsGeneration();
  testDistinctPacketsGenerateWithoutScopes();
  testScopesSplitSharedPacketByLane();
  testFileScopeContributesExactlyThatLeaf();
  testScopeDeclaredForUnknownModeFails();
  testMissingScopePathFails();
  testScopeEscapingPacketOrRootFails();
  testDuplicateScopeModeFails();
  testEmptyScopesArrayFails();
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('[sk-doc] leaf-manifest scope contract coverage passed');
