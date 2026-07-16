#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parent-skill-check-leaf-manifest.test — coverage for the 10a-10d guards  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the leaf-manifest.json guard chain in parent-skill-check.cjs: the
 * chain is opt-in per hub (only a committed leaf-manifest.json activates it),
 * and each guard code fails closed on its own class of drift without hiding
 * behind a single catch-all message.
 *
 * The checker resolves the leaf-resource contract library relative to the
 * target hub, never the repo root, so every fixture here carries its own
 * copy of the real library/generator under create-skill/scripts/. Fixtures
 * live under the OS temp directory and are built fresh per test; nothing
 * here reads or writes the real sk-doc hub.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const CHECKER_PATH = path.join(__dirname, '..', 'parent-skill-check.cjs');
const REAL_SK_DOC_ROOT = path.join(__dirname, '..', '..', '..', '..', 'skills', 'sk-doc');
const REAL_GENERATOR_PATH = path.join(REAL_SK_DOC_ROOT, 'create-skill', 'scripts', 'generate-leaf-manifest.cjs');
const REAL_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');

const MODE_A = 'demo-alpha';
const MODE_B = 'demo-beta';

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function makeTempHubDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-leaf-manifest-'));
}

// The generator/library resolve relative to the hub itself, so every fixture
// needs its own copy at the same relative path the real hub uses.
function installContractLibrary(hubRoot) {
  const libDir = path.join(hubRoot, 'create-skill', 'scripts', 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  fs.copyFileSync(REAL_GENERATOR_PATH, path.join(hubRoot, 'create-skill', 'scripts', 'generate-leaf-manifest.cjs'));
  fs.copyFileSync(REAL_CONTRACT_LIB_PATH, path.join(libDir, 'leaf-resource-contract.cjs'));
}

function writePacketCompanions(packetDir, packetSkillName) {
  fs.mkdirSync(path.join(packetDir, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(packetDir, 'SKILL.md'), `---\nname: ${packetSkillName}\n---\n# ${packetSkillName}\n`);
  fs.writeFileSync(path.join(packetDir, 'README.md'), `# ${packetSkillName}\n`);
  fs.writeFileSync(path.join(packetDir, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
}

function baseRegistry() {
  const toolSurface = { allowed: ['Read'], forbidden: ['Write', 'Edit', 'Task'], mutatesWorkspace: false, bashAllowlist: [] };
  return {
    skill: 'demo-hub',
    resourceContractVersion: 1,
    modes: [
      {
        workflowMode: MODE_A,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: 'create-skill',
        packetSkillName: 'create-skill',
        grandfatheredFolderMismatch: false,
        advisorRouting: { routingClass: 'metadata' },
      },
      {
        workflowMode: MODE_B,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: 'pkg-two',
        packetSkillName: 'pkg-two',
        grandfatheredFolderMismatch: false,
        advisorRouting: { routingClass: 'metadata' },
      },
    ],
  };
}

function baseHubRouter() {
  return {
    routerSignals: {
      [MODE_A]: { classes: ['demo'], resources: [] },
      [MODE_B]: { classes: ['demo'], resources: [] },
    },
    vocabularyClasses: { demo: {} },
    routerPolicy: {
      tieBreak: [MODE_A, MODE_B],
      defaultMode: MODE_A,
      outcomes: { single: true, orderedBundle: true, defer: true },
      bundleRules: [],
    },
  };
}

// A complete, canon-clean two-mode hub with a fresh, byte-consistent
// leaf-manifest.json, so PARENT_HUB_CHECK_STRICT=1 finds nothing from the
// pre-existing checks and only the new leaf-manifest guards are under test.
function buildCleanFixture() {
  const hubRoot = makeTempHubDir();
  const basename = path.basename(hubRoot);

  fs.writeFileSync(path.join(hubRoot, 'graph-metadata.json'), JSON.stringify({ skill_id: basename, family: 'sk-hub' }, null, 2));
  writeJson(path.join(hubRoot, 'mode-registry.json'), baseRegistry());
  writeJson(path.join(hubRoot, 'hub-router.json'), baseHubRouter());
  writeJson(path.join(hubRoot, 'description.json'), { name: basename, description: 'fixture hub', version: '0.0.0', keywords: ['fixture'] });
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), '---\nname: demo-hub\nallowed-tools: [Read]\n---\n# demo-hub\n');
  fs.mkdirSync(path.join(hubRoot, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
  fs.mkdirSync(path.join(hubRoot, 'manual_testing_playbook'), { recursive: true });
  fs.mkdirSync(path.join(hubRoot, 'benchmark'), { recursive: true });

  const packetA = path.join(hubRoot, 'create-skill');
  const packetB = path.join(hubRoot, 'pkg-two');
  fs.mkdirSync(path.join(packetA, 'references'), { recursive: true });
  fs.mkdirSync(path.join(packetB, 'references'), { recursive: true });
  fs.writeFileSync(path.join(packetA, 'references', 'hello.md'), '# hello\n');
  fs.writeFileSync(path.join(packetB, 'references', 'world.md'), '# world\n');
  writePacketCompanions(packetA, 'create-skill');
  writePacketCompanions(packetB, 'pkg-two');

  installContractLibrary(hubRoot);

  const generatorPath = path.join(hubRoot, 'create-skill', 'scripts', 'generate-leaf-manifest.cjs');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const generator = require(generatorPath);
  fs.writeFileSync(path.join(hubRoot, 'leaf-manifest.json'), generator.buildManifestBytes(hubRoot));

  return hubRoot;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER
// ─────────────────────────────────────────────────────────────────────────────

// parent-skill-check.cjs calls process.exit() unconditionally, so it must run
// as a child process rather than be require()'d in-process. PASS/INFO go to
// stdout and FAIL/WARN go to stderr, so both are combined for assertions.
function runChecker(hubRoot, envOverrides) {
  const result = spawnSync(process.execPath, [CHECKER_PATH, hubRoot], {
    encoding: 'utf8',
    env: { ...process.env, ...envOverrides },
  });
  return { status: result.status, stdout: `${result.stdout || ''}${result.stderr || ''}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: CLEAN MANIFEST
// ─────────────────────────────────────────────────────────────────────────────

function testCleanManifestPassesAllFourGuards() {
  const hubRoot = buildCleanFixture();
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /PASS: 10a-manifest-source/);
  assert.match(result.stdout, /PASS: 10b-byte-drift/);
  assert.match(result.stdout, /PASS: 10c-target-collision/);
  assert.match(result.stdout, /PASS: 10d-reachability/);
  assert.doesNotMatch(result.stdout, /FAIL: 10[abcd]/);
  assert.equal(result.status, 0, `expected a canon-clean fixture to exit 0:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: MANIFEST-SOURCE
// ─────────────────────────────────────────────────────────────────────────────

function testMissingResourceContractVersionFailsManifestSource() {
  const hubRoot = buildCleanFixture();
  const registryPath = path.join(hubRoot, 'mode-registry.json');
  const registry = readJson(registryPath);
  delete registry.resourceContractVersion;
  writeJson(registryPath, registry);

  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /FAIL: 10a-manifest-source:.*resourceContractVersion/);
  assert.match(result.stdout, /10b-byte-drift: skipped/);
  assert.match(result.stdout, /10c-target-collision: skipped/);
  assert.match(result.stdout, /10d-reachability: skipped/);
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: BYTE-DRIFT
// ─────────────────────────────────────────────────────────────────────────────

function testStaleManifestFailsByteDrift() {
  const hubRoot = buildCleanFixture();
  // A leaf added to disk after the manifest was committed is real drift: the
  // committed bytes no longer match what regeneration produces today.
  fs.writeFileSync(path.join(hubRoot, 'create-skill', 'references', 'extra.md'), '# extra\n');

  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /FAIL: 10b-byte-drift:.*stale/);
  assert.match(result.stdout, /PASS: 10a-manifest-source/);
  assert.match(result.stdout, /PASS: 10c-target-collision/);
  assert.match(result.stdout, /PASS: 10d-reachability/);
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TESTS: TARGET/COLLISION
// ─────────────────────────────────────────────────────────────────────────────

function testDuplicateCompositeFailsTargetCollision() {
  const hubRoot = buildCleanFixture();
  // An authored alias that claims the same (workflowMode, leafResourceId) an
  // on-disk file already claims is two sources fighting over one identity.
  writeJson(path.join(hubRoot, 'leaf-aliases.json'), [
    { workflowMode: MODE_A, leafResourceId: 'references/hello.md', diskPath: 'create-skill/references/hello.md' },
  ]);

  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /FAIL: 10c-target-collision:.*duplicate/i);
  assert.match(result.stdout, /PASS: 10a-manifest-source/);
  assert.match(result.stdout, /10b-byte-drift: skipped/);
  assert.match(result.stdout, /PASS: 10d-reachability/);
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. TESTS: REACHABILITY
// ─────────────────────────────────────────────────────────────────────────────

function testOrphanedManifestModeFailsReachability() {
  const hubRoot = buildCleanFixture();
  // Drop a mode from the registry after the manifest was generated: the
  // manifest still names a public mode the registry no longer declares.
  const registryPath = path.join(hubRoot, 'mode-registry.json');
  const registry = readJson(registryPath);
  registry.modes = registry.modes.filter((m) => m.workflowMode !== MODE_B);
  writeJson(registryPath, registry);

  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, new RegExp(`FAIL: 10d-reachability:.*${MODE_B}`));
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. RUN
// ─────────────────────────────────────────────────────────────────────────────

testCleanManifestPassesAllFourGuards();
testMissingResourceContractVersionFailsManifestSource();
testStaleManifestFailsByteDrift();
testDuplicateCompositeFailsTargetCollision();
testOrphanedManifestModeFailsReachability();
console.log('[parent-skill-check] leaf-manifest guard-chain coverage passed');
