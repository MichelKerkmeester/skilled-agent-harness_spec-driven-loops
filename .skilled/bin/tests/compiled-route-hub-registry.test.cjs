#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: COMPILED-ROUTE HUB REGISTRY                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// The set of compiled-route hubs is data: one registry file names each hub and its
// rollout folder. These tests pin that every runtime consumer derives its hub list
// from that file, that a consumer repository can add a hub by appending one entry
// without editing any code file, and that a malformed registry is refused by name.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const BIN = path.resolve(__dirname, '..');
const RUNTIME_ROOT = path.join(BIN, 'lib', 'compiled-routing');
const ENGINE_LIB = path.join(RUNTIME_ROOT, '014-runtime-engine', 'lib');
const REGISTRY_FILE = path.join(RUNTIME_ROOT, 'hub-registry.json');
const READER = path.join(ENGINE_LIB, 'hub-registry.cjs');
const CASES = require('./fixtures/hub-registry/registry-cases.json');
// Inside the repository so a copied rollout harness still finds the skill tree by
// walking up; the folder is ignored by git.
const SANDBOX_ROOT = path.join(__dirname, '.sandboxes');

// The hubs that serve compiled routing today, in registry order.
const EXPECTED_HUBS = [
  ['sk-code', '009-parent-hub-rollout/001-sk-code'],
  ['system-deep-loop', '009-parent-hub-rollout/002-system-deep-loop'],
  ['mcp-tooling', '009-parent-hub-rollout/003-mcp-tooling'],
  ['cli-external-orchestration', '009-parent-hub-rollout/004-cli-external-orchestration'],
  ['cli-classifier', '009-parent-hub-rollout/008-cli-classifier'],
  ['sk-doc', '009-parent-hub-rollout/007-sk-doc'],
  ['sk-design', '009-parent-hub-rollout/009-sk-design'],
  ['mcp-browser-use', '009-parent-hub-rollout/010-mcp-browser-use'],
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readRegistry(file = REGISTRY_FILE) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sandbox(t, prefix) {
  fs.mkdirSync(SANDBOX_ROOT, { recursive: true });
  const dir = fs.mkdtempSync(path.join(SANDBOX_ROOT, prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function tempDir(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

// Copy the whole promoted runtime closure, the way a consumer repository vendors it.
function copyRuntime(destination) {
  fs.cpSync(RUNTIME_ROOT, destination, { recursive: true });
  return destination;
}

function appendHub(runtimeRoot, entry) {
  const file = path.join(runtimeRoot, 'hub-registry.json');
  const registry = readRegistry(file);
  registry.hubs.push(entry);
  fs.writeFileSync(file, `${JSON.stringify(registry, null, 2)}\n`);
}

function codeFilesUnder(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (/\.(c|m)?js$/.test(entry.name)) out.push(path.relative(root, abs));
    }
  };
  walk(root);
  return out.sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('the registry is the one source of the compiled-route hub set', () => {
  test('the registry lists today\'s eight hubs in order, all default-on, as plain JSON', () => {
    const text = fs.readFileSync(REGISTRY_FILE, 'utf8');
    const registry = JSON.parse(text);
    assert.equal(registry.schemaVersion, 'V1');
    assert.deepEqual(registry.hubs.map((h) => [h.id, h.rolloutChild]), EXPECTED_HUBS);
    assert.ok(registry.hubs.every((h) => h.defaultOn === true));
    // The json-entry overlay writes JSON.stringify(value, null, 2) plus a newline, so
    // the registry must already be in that layout for an appended entry to round-trip.
    assert.equal(text, `${JSON.stringify(registry, null, 2)}\n`);
  });

  test('the engine map, the default-on cohort, the guard and the sync all equal the registry', () => {
    const registry = readRegistry();
    const ids = registry.hubs.map((h) => h.id);
    const { HUB_CHILD } = require(path.join(ENGINE_LIB, 'compiled-route.cjs'));
    const { DEFAULT_ON_HUBS } = require(path.join(ENGINE_LIB, 'resolve.cjs'));
    const guard = require(path.join(BIN, 'compiled-route-guard.cjs'));
    const sync = require(path.join(BIN, 'compiled-route-sync.cjs'));

    assert.ok(Object.isFrozen(HUB_CHILD));
    assert.deepEqual(Object.entries(HUB_CHILD), registry.hubs.map((h) => [h.id, h.rolloutChild]));
    assert.ok(DEFAULT_ON_HUBS instanceof Set);
    assert.deepEqual([...DEFAULT_ON_HUBS], registry.hubs.filter((h) => h.defaultOn).map((h) => h.id));
    assert.ok(Array.isArray(guard.HUBS));
    assert.deepEqual(guard.HUBS, [...ids].sort());
    assert.ok(Array.isArray(sync.HUBS));
    assert.deepEqual(sync.HUBS, ids);
  });

  test('the promoted registry and its reader match their authored copies', () => {
    const sync = require(path.join(BIN, 'compiled-route-sync.cjs'));
    for (const rel of ['hub-registry.json', path.join('014-runtime-engine', 'lib', 'hub-registry.cjs')]) {
      const authored = path.join(sync.IMPL_ROOT, rel);
      assert.ok(fs.existsSync(authored), `authored copy missing: ${rel}`);
      assert.ok(fs.readFileSync(authored).equals(fs.readFileSync(path.join(RUNTIME_ROOT, rel))), `${rel} drifted`);
    }
    const manifest = readRegistry(path.join(RUNTIME_ROOT, 'serving-closure.manifest.json'));
    assert.ok(manifest.files.includes('hub-registry.json'));
    assert.ok(manifest.files.includes(path.join('014-runtime-engine', 'lib', 'hub-registry.cjs')));
    assert.deepEqual(manifest.hubs, EXPECTED_HUBS.map(([id]) => id));
  });

  test('an unregistered hub is still unknown to the engine', () => {
    const { compiledRoute } = require(path.join(ENGINE_LIB, 'compiled-route.cjs'));
    assert.throws(() => compiledRoute('sk-git', 'commit and open a pull request'), /unknown hub: sk-git/);
  });
});

describe('a consumer adds a hub with one registry entry and no code edit', () => {
  test('an appended default-on hub routes through its cloned rollout folder', (t) => {
    const root = copyRuntime(path.join(sandbox(t, 'hub-registry-consumer-'), 'compiled-routing'));
    const before = codeFilesUnder(root).map((rel) => [rel, fs.readFileSync(path.join(root, rel))]);
    // A stand-in rollout folder: the browser hub's compiled engine under a new name.
    fs.cpSync(
      path.join(root, '009-parent-hub-rollout', '010-mcp-browser-use'),
      path.join(root, '009-parent-hub-rollout', '011-sk-git'),
      { recursive: true },
    );
    appendHub(root, { id: 'sk-git', rolloutChild: '009-parent-hub-rollout/011-sk-git', defaultOn: true });

    const engine = require(path.join(root, '014-runtime-engine', 'lib', 'compiled-route.cjs'));
    const resolver = require(path.join(root, '014-runtime-engine', 'lib', 'resolve.cjs'));
    assert.equal(engine.HUB_CHILD['sk-git'], '009-parent-hub-rollout/011-sk-git');
    assert.deepEqual(Object.keys(engine.HUB_CHILD), [...EXPECTED_HUBS.map(([id]) => id), 'sk-git']);
    assert.ok(resolver.DEFAULT_ON_HUBS.has('sk-git'));
    const route = engine.compiledRoute('sk-git', 'open the page in the browser and take a screenshot');
    assert.equal(route.hubId, 'sk-git');
    assert.ok(['route', 'clarify', 'defer', 'reject'].includes(route.action));
    // Default-on is eligibility, not authority: with no activation manifest the hub
    // still serves legacy routing.
    assert.equal(resolver.resolveRoute('sk-git', 'open the page in the browser'), null);

    // Every code file of the vendored closure is byte-identical to what shipped.
    for (const [rel, bytes] of before) {
      assert.ok(fs.readFileSync(path.join(root, rel)).equals(bytes), `${rel} was edited`);
    }
  });

  test('an appended defaultOn:false hub is eligible but not in the default-on cohort', (t) => {
    const root = copyRuntime(path.join(sandbox(t, 'hub-registry-opt-in-'), 'compiled-routing'));
    appendHub(root, { id: 'sk-git', rolloutChild: '009-parent-hub-rollout/011-sk-git', defaultOn: false });
    const engine = require(path.join(root, '014-runtime-engine', 'lib', 'compiled-route.cjs'));
    const resolver = require(path.join(root, '014-runtime-engine', 'lib', 'resolve.cjs'));
    assert.ok(Object.prototype.hasOwnProperty.call(engine.HUB_CHILD, 'sk-git'));
    assert.equal(resolver.DEFAULT_ON_HUBS.has('sk-git'), false);
    assert.equal(resolver.DEFAULT_ON_HUBS.size, EXPECTED_HUBS.length);
  });
});

describe('a malformed registry is refused with an error naming the file', () => {
  test('the shared valid fixture parses to its eligible and default-on sets', () => {
    const { parseHubRegistry } = require(READER);
    const hubs = parseHubRegistry(JSON.stringify(CASES.valid.registry), 'fixture.json');
    assert.deepEqual(hubs.map((h) => h.id), CASES.valid.eligible);
    assert.deepEqual(hubs.filter((h) => h.defaultOn).map((h) => h.id), CASES.valid.defaultOn);
  });

  for (const testCase of CASES.invalid) {
    test(`refuses ${testCase.name}`, (t) => {
      const { loadHubRegistry } = require(READER);
      const file = path.join(tempDir(t, 'hub-registry-invalid-'), 'hub-registry.json');
      fs.writeFileSync(file, testCase.text !== undefined ? testCase.text : JSON.stringify(testCase.registry));
      assert.throws(() => loadHubRegistry(file), (error) => {
        assert.ok(error.message.includes(file), error.message);
        assert.ok(error.message.includes(testCase.error), error.message);
        return true;
      });
    });
  }

  test('refuses a missing registry by path', (t) => {
    const { loadHubRegistry } = require(READER);
    const file = path.join(tempDir(t, 'hub-registry-missing-'), 'hub-registry.json');
    assert.throws(() => loadHubRegistry(file), (error) => error.message.includes(file));
  });

  test('a duplicate entry in a vendored closure stops the engine from loading', (t) => {
    const root = copyRuntime(path.join(tempDir(t, 'hub-registry-dup-'), 'compiled-routing'));
    appendHub(root, { id: 'sk-code', rolloutChild: '009-parent-hub-rollout/001-sk-code', defaultOn: true });
    assert.throws(
      () => require(path.join(root, '014-runtime-engine', 'lib', 'compiled-route.cjs')),
      /duplicate hub id "sk-code"/,
    );
  });
});
