#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parent-skill-check-root-router.test — coverage for the check-12 contract  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the root-router two-state check (12) in parent-skill-check.cjs: a
 * canon-clean hub with a compliant stage1-only or active root ROUTER.md passes
 * at exit 0, and each of the eight negative shapes fails at exactly its stable
 * RRC code with a nonzero exit. The fixtures carry isolated copies of the real
 * contract libraries at the sibling sk-doc topology the checker resolves from,
 * so nothing here touches a live hub.
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
const REAL_GENERATOR_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
const REAL_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');
const REAL_ROOT_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'skill-root-metadata-contract.cjs');
const REAL_ROOT_ROUTER_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'root-router-contract.cjs');
const REAL_S_CLASS_DEFAULTS_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 's-class-config-defaults.json');

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
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-root-router-'));
  const hubRoot = path.join(fixtureRoot, 'demo-hub');
  fs.mkdirSync(hubRoot);
  return hubRoot;
}

function installContractLibrary(hubRoot) {
  const scriptsDir = path.join(path.dirname(hubRoot), 'sk-doc', 'sk-create-skill', 'scripts');
  const libDir = path.join(scriptsDir, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  fs.copyFileSync(REAL_GENERATOR_PATH, path.join(scriptsDir, 'generate-leaf-manifest.cjs'));
  fs.copyFileSync(REAL_CONTRACT_LIB_PATH, path.join(libDir, 'leaf-resource-contract.cjs'));
  fs.copyFileSync(REAL_ROOT_CONTRACT_LIB_PATH, path.join(libDir, 'skill-root-metadata-contract.cjs'));
  fs.copyFileSync(REAL_ROOT_ROUTER_CONTRACT_LIB_PATH, path.join(libDir, 'root-router-contract.cjs'));
  fs.copyFileSync(REAL_S_CLASS_DEFAULTS_PATH, path.join(libDir, 's-class-config-defaults.json'));
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

function stage1Router() {
  return [
    '---',
    'title: demo-hub Surface Router — stage-one only',
    'version: 1.0.0.0',
    'router_state: stage1-only',
    'skill_pointer: SKILL.md',
    '---',
    '# demo-hub Surface Router',
    '```python',
    'DEFAULT_RESOURCE = []',
    '',
    'INTENT_SIGNALS = {}',
    '',
    'RESOURCE_MAP = {}',
    '',
    'SHARED_CONTROL_RESOURCES = []',
    '```',
    '',
  ].join('\n');
}

// An active router whose two intents map to the two packets' real leaf files,
// so every path resolves on disk and dual-reads to a committed manifest pair.
function activeRouter({ defaults = '[]', pathForBeta = 'pkg-two/references/world.md', sharedControls = null } = {}) {
  return [
    '---',
    'title: demo-hub Surface Router — active',
    'version: 1.0.0.0',
    'router_state: active',
    'skill_pointer: SKILL.md',
    '---',
    '# demo-hub Surface Router',
    '```python',
    `DEFAULT_RESOURCE = ${defaults}`,
    '',
    'INTENT_SIGNALS = {',
    '    "ALPHA": {"weight": 4, "keywords": ["alpha intent"]},',
    '    "BETA": {"weight": 4, "keywords": ["beta intent"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    '    "ALPHA": ["create-skill/references/hello.md"],',
    `    "BETA": ["${pathForBeta}"],`,
    '}',
    ...(sharedControls === null ? [] : ['', `SHARED_CONTROL_RESOURCES = ${sharedControls}`]),
    '```',
    '',
  ].join('\n');
}

function buildCleanFixture({ routerContent = stage1Router() } = {}) {
  const hubRoot = makeTempHubDir();
  const basename = path.basename(hubRoot);

  fs.writeFileSync(path.join(hubRoot, 'graph-metadata.json'), JSON.stringify({ skill_id: basename, family: 'sk-hub' }, null, 2));
  writeJson(path.join(hubRoot, 'mode-registry.json'), baseRegistry());
  writeJson(path.join(hubRoot, 'hub-router.json'), baseHubRouter());
  writeJson(path.join(hubRoot, 'description.json'), { name: basename, description: 'fixture hub', version: '0.0.0', keywords: ['fixture'] });
  writeJson(path.join(hubRoot, 'command-metadata.json'), []);
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), '---\nname: demo-hub\nallowed-tools: [Read]\n---\n# demo-hub\n');
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), routerContent);
  fs.mkdirSync(path.join(hubRoot, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
  fs.mkdirSync(path.join(hubRoot, 'manual-testing-playbook'), { recursive: true });
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

  const generatorPath = path.join(path.dirname(hubRoot), 'sk-doc', 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const generator = require(generatorPath);
  fs.writeFileSync(path.join(hubRoot, 'leaf-manifest.json'), generator.buildManifestBytes(hubRoot));

  return hubRoot;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER
// ─────────────────────────────────────────────────────────────────────────────

function runChecker(hubRoot, envOverrides) {
  const result = spawnSync(process.execPath, [CHECKER_PATH, hubRoot], {
    encoding: 'utf8',
    env: { ...process.env, ...envOverrides },
  });
  return { status: result.status, stdout: `${result.stdout || ''}${result.stderr || ''}` };
}

// The checker FAILs a canon check once per violation; the negative fixtures
// must trip exactly one 12a line at the intended code.
function assertOnlyRouterViolation(stdout, code, label) {
  const routerLines = stdout.split('\n').filter((line) => line.startsWith('FAIL: 12a-router-contract:'));
  assert.equal(routerLines.length, 1, `${label}: expected exactly one 12a FAIL, got:\n${stdout}`);
  assert.match(routerLines[0], new RegExp(code), `${label}: expected ${code} in "${routerLines[0]}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: POSITIVES
// ─────────────────────────────────────────────────────────────────────────────

function testStage1OnlyPasses() {
  const hubRoot = buildCleanFixture();
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /PASS: 12a-router-contract: root ROUTER\.md conforms to the two-state contract \(stage1-only\)/);
  assert.doesNotMatch(result.stdout, /FAIL: 12a-router-contract:/);
  assert.equal(result.status, 0, `expected a stage1-only fixture to exit 0:\n${result.stdout}`);
}

function testActivePasses() {
  const hubRoot = buildCleanFixture({ routerContent: activeRouter() });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /PASS: 12a-router-contract: root ROUTER\.md conforms to the two-state contract \(active\)/);
  assert.doesNotMatch(result.stdout, /FAIL: 12a-router-contract:/);
  assert.equal(result.status, 0, `expected an active fixture to exit 0:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: NEGATIVES (one code per fixture)
// ─────────────────────────────────────────────────────────────────────────────

function testMissingRouterFailsRRC001() {
  const hubRoot = buildCleanFixture();
  fs.rmSync(path.join(hubRoot, 'ROUTER.md'));
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-001', 'missing root router');
  assert.notEqual(result.status, 0);
}

function testMalformedStateFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace(/router_state: stage1-only\n/, ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'malformed state');
  assert.notEqual(result.status, 0);
}

function testDualSourceFailsRRC003() {
  const hubRoot = buildCleanFixture();
  fs.mkdirSync(path.join(hubRoot, 'shared', 'references'), { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'shared', 'references', 'smart-routing.md'), '# legacy\n');
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-003', 'dual source');
  assert.notEqual(result.status, 0);
}

function testKeyMismatchFailsRRC004() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter().replace(
      '    "BETA": ["pkg-two/references/world.md"],\n',
      '',
    ),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-004', 'active key mismatch');
  assert.notEqual(result.status, 0);
}

function testStage1NonEmptyFailsRRC005() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace(
      'INTENT_SIGNALS = {}',
      'INTENT_SIGNALS = {\n    "ALPHA": {"weight": 4, "keywords": ["alpha intent"]},\n}',
    ),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-005', 'stage1-only non-empty maps');
  assert.notEqual(result.status, 0);
}

function testUnresolvedLeafFailsRRC006() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter({ pathForBeta: 'pkg-two/references/missing.md' }),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-006', 'unresolved leaf');
  assert.notEqual(result.status, 0);
}

function testMissingSkillPointerFailsRRC007() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace(/skill_pointer: SKILL.md\n/, ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-007', 'missing skill pointer');
  assert.notEqual(result.status, 0);
}

function testLegacyStageTwoDefaultFailsRRC008() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter({ defaults: '["shared/references/smart-routing.md"]' }),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-008', 'legacy stage-two default residue');
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: DECLARATION SHAPE, POINTER EXACTNESS, CONTAINMENT, KEY OWNERSHIP
// ─────────────────────────────────────────────────────────────────────────────

function testStage1MissingIntentSignalsFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('INTENT_SIGNALS = {}', ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only missing INTENT_SIGNALS declaration');
  assert.notEqual(result.status, 0);
}

function testStage1MissingResourceMapFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('RESOURCE_MAP = {}', ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only missing RESOURCE_MAP declaration');
  assert.notEqual(result.status, 0);
}

function testStage1MissingDefaultResourceFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('DEFAULT_RESOURCE = []', ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only missing DEFAULT_RESOURCE declaration');
  assert.notEqual(result.status, 0);
}

function testStage1MissingSharedControlsFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('SHARED_CONTROL_RESOURCES = []', ''),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only missing SHARED_CONTROL_RESOURCES declaration');
  assert.notEqual(result.status, 0);
}

function testStage1UnbalancedIntentSignalsFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('INTENT_SIGNALS = {}', 'INTENT_SIGNALS = {'),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only unbalanced INTENT_SIGNALS');
  assert.notEqual(result.status, 0);
}

function testStage1MalformedDefaultResourceFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('DEFAULT_RESOURCE = []', 'DEFAULT_RESOURCE = ['),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'stage1-only unbalanced DEFAULT_RESOURCE');
  assert.notEqual(result.status, 0);
}

function testVersionNotFourPartFailsRRC002() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('version: 1.0.0.0', 'version: 1.0.0'),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-002', 'non-four-part version');
  assert.notEqual(result.status, 0);
}

function testSkillPointerNotRootFailsRRC007() {
  const hubRoot = buildCleanFixture({
    routerContent: stage1Router().replace('skill_pointer: SKILL.md', 'skill_pointer: ../sibling/SKILL.md'),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-007', 'non-root skill pointer');
  assert.notEqual(result.status, 0);
}

function testActiveEmptyResourceListFailsRRC004() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter().replace(
      '    "BETA": ["pkg-two/references/world.md"],\n',
      '    "BETA": [],\n',
    ),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-004', 'active key with empty resource list');
  assert.notEqual(result.status, 0);
}

function testSharedControlTraversalFailsRRC004() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter({ sharedControls: '["shared/../../outside.md"]' }),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-004', 'shared-control path traversal');
  assert.notEqual(result.status, 0);
}

function testMappedPathTraversalFailsRRC006() {
  const hubRoot = buildCleanFixture({
    routerContent: activeRouter({ pathForBeta: '../outside.md' }),
  });
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assertOnlyRouterViolation(result.stdout, 'RRC-006', 'mapped resource path traversal');
  assert.notEqual(result.status, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. RUN
// ─────────────────────────────────────────────────────────────────────────────

testStage1OnlyPasses();
testActivePasses();
testMissingRouterFailsRRC001();
testMalformedStateFailsRRC002();
testDualSourceFailsRRC003();
testKeyMismatchFailsRRC004();
testStage1NonEmptyFailsRRC005();
testUnresolvedLeafFailsRRC006();
testMissingSkillPointerFailsRRC007();
testLegacyStageTwoDefaultFailsRRC008();
testStage1MissingIntentSignalsFailsRRC002();
testStage1MissingResourceMapFailsRRC002();
testStage1MissingDefaultResourceFailsRRC002();
testStage1MissingSharedControlsFailsRRC002();
testStage1UnbalancedIntentSignalsFailsRRC002();
testStage1MalformedDefaultResourceFailsRRC002();
testVersionNotFourPartFailsRRC002();
testSkillPointerNotRootFailsRRC007();
testActiveEmptyResourceListFailsRRC004();
testSharedControlTraversalFailsRRC004();
testMappedPathTraversalFailsRRC006();
console.log('[parent-skill-check] root-router contract fixtures passed');
