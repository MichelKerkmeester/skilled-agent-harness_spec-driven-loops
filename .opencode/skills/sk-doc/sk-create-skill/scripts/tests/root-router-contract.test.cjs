#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ root-router-contract.test — coverage for the two-state ROUTER.md contract ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the root-router contract library end to end: every positive shape
 * passes, every one of the eight negative codes (RRC-001..RRC-008) fires on
 * exactly the fixture meant to trigger it, path identity goes through the
 * leaf-resource contract rather than a private re-implementation, and the
 * hub-shared control carve-out only ever exempts a declared, mapped, on-disk
 * `shared/` path from typed-pair enforcement.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const routerContract = require('../lib/root-router-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Two declared modes whose packets carry one leaf each; a hub-relative on-disk
// probe that is authoritative per test via an allow/deny set.
const DECLARED_MODES = [
  { workflowMode: 'alpha', packet: 'pack-a' },
  { workflowMode: 'beta', packet: 'pack-b' },
];

const MANIFEST = {
  resourceContractVersion: 1,
  modes: [
    { workflowMode: 'alpha', packet: 'pack-a', leaves: ['references/a.md'] },
    { workflowMode: 'beta', packet: 'pack-b', leaves: ['references/b.md'] },
  ],
};

// The on-disk truth for the fixture: every path under pack-a/pack-b exists,
// plus the shared-alias target the alias test resolves through and the two
// hub-shared control paths the shared-control fixtures declare.
const ON_DISK = new Set([
  'pack-a/references/a.md',
  'pack-b/references/b.md',
  'shared/references/a.md',
  'shared/references/shared-standard.md',
  'shared/references/never-mapped.md',
  'SKILL.md',
]);

const diskProbe = (p) => ON_DISK.has(p);

/**
 * Build a ROUTER.md document from a state and explicit machine collections.
 * Omitting intents/resources/defaults yields the empty stage-one-only form;
 * passing a string replaces it verbatim, so tests control the exact machine
 * bytes the parser must read. SHARED_CONTROL_RESOURCES is always emitted so
 * the fixture keeps the real machine-block shape every router carries.
 */
function routerText(state, { intents, resources, defaults = '[]', pointer = 'SKILL.md', sharedControls = '[]', version = '1.0.0.0' } = {}) {
  // version === null omits the version line; intents/resources/defaults/
  // sharedControls === null omit that machine collection so fixtures can
  // build the exact malformed or missing declarations they must reject.
  const frontmatterLines = ['---', 'title: fixture router'];
  if (version !== null) frontmatterLines.push(`version: ${version}`);
  frontmatterLines.push(`router_state: ${state}`, `skill_pointer: ${pointer}`, '---');
  const frontmatter = frontmatterLines.join('\n');
  const intentsBlock = intents === undefined ? 'INTENT_SIGNALS = {}' : (intents === null ? '' : `INTENT_SIGNALS = ${intents}`);
  const resourcesBlock = resources === undefined ? 'RESOURCE_MAP = {}' : (resources === null ? '' : `RESOURCE_MAP = ${resources}`);
  const defaultsLine = defaults === null ? '' : `DEFAULT_RESOURCE = ${defaults}`;
  const sharedLine = sharedControls === null ? '' : `SHARED_CONTROL_RESOURCES = ${sharedControls}`;
  return `${frontmatter}\n\n# Fixture Router\n\n` +
    '## 1. OVERVIEW\n\nThe fixture hub surface router.\n\n' +
    '## 2. INTENT MODEL\n\nThe fixture intents this router selects.\n\n' +
    '## 3. MACHINE-READABLE ROUTER\n\n' +
    '```python\n' +
    `${defaultsLine}\n\n` +
    `${intentsBlock}\n\n` +
    `${resourcesBlock}\n\n` +
    `${sharedLine}\n` +
    '```\n';
}

const ACTIVE_INTENTS = `{
    "ALPHA": {"weight": 4, "keywords": ["alpha"]},
    "BETA": {"weight": 4, "keywords": ["beta"]},
}`;

const ACTIVE_RESOURCES = `{
    "ALPHA": ["pack-a/references/a.md"],
    "BETA": ["pack-b/references/b.md"],
}`;

function validate(options) {
  return routerContract.validateRootRouter({
    declaredModes: DECLARED_MODES,
    manifest: MANIFEST,
    resolveOnDisk: diskProbe,
    ...options,
  });
}

function codesOf(result) {
  return result.violations.map((v) => v.code);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. POSITIVES
// ─────────────────────────────────────────────────────────────────────────────

function testStage1OnlyPositive() {
  const result = validate({ routerText: routerText('stage1-only') });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'stage1-only');
  assert.deepEqual(result.violations, []);
}

function testActivePositive() {
  const result = validate({
    routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES }),
  });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'active');
  assert.deepEqual(result.violations, []);
}

function testActivePositiveThroughSharedAlias() {
  const aliasEntries = [
    { workflowMode: 'alpha', leafResourceId: 'references/a.md', diskPath: 'shared/references/a.md' },
  ];
  const result = validate({
    aliasEntries,
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["shared/references/a.md"],\n}',
    }),
  });
  // The shared alias is the identity source for the mapped path; it is a real
  // leaf of the alpha mode even though it lives under the hub's shared tier.
  assert.equal(result.ok, true, JSON.stringify(result));
}

// A hub-shared control document is the one deliberate carve-out from typed-pair
// enforcement: declared under SHARED_CONTROL_RESOURCES, mapped by an intent,
// and present on disk, it loads without a manifest pair.
function testActiveSharedControlPositive() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md", "shared/references/shared-standard.md"],\n}',
      sharedControls: '["shared/references/shared-standard.md"]',
    }),
  });
  // shared-standard.md is on disk, appears in no alias and in no manifest pair;
  // only the explicit declaration exempts it from the typed-pair check.
  assert.equal(result.ok, true, JSON.stringify(result));
}

function testActiveSharedControlMustStartWithShared() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n}',
      sharedControls: '["pack-a/references/a.md"]',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testActiveSharedControlUnusedDeclaration() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n}',
      sharedControls: '["shared/references/never-mapped.md"]',
    }),
  });
  // never-mapped.md exists on disk but no RESOURCE_MAP entry references it.
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testActiveSharedControlMissingOnDisk() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["shared/references/missing.md"],\n}',
      sharedControls: '["shared/references/missing.md"]',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testActiveUndeclaredSharedPathStillEnforced() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["shared/references/a.md"],\n}',
    }),
  });
  // shared/references/a.md is on disk and has no authored alias, and it is not
  // declared, so it must still dual-read to a manifest pair — and fails closed.
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testStage1OnlySharedControlNonEmpty() {
  const result = validate({
    routerText: routerText('stage1-only', {
      sharedControls: '["shared/references/shared-standard.md"]',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-005'), JSON.stringify(result.violations));
}

// The exact machine-block shape the stage1-only generator emits: four named
// collections including the empty shared-control list, inside a python fence.
const REAL_STAGE1_SHAPE = [
  '---',
  'title: demo-hub Surface Router — stage-one only',
  'version: 1.0.0.0',
  'router_state: stage1-only',
  'skill_pointer: SKILL.md',
  '---',
  '# demo-hub Surface Router',
  '```python',
  '# Leafless by construction: stage-one mode selection is the whole routing story.',
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

function testRealShapeStage1OnlyFixture() {
  const result = validate({ routerText: REAL_STAGE1_SHAPE });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'stage1-only');
}

function testRealShapeActiveSharedControlFixture() {
  const text = [
    '---',
    'title: demo-hub Surface Router — active',
    'version: 1.0.0.0',
    'router_state: active',
    'skill_pointer: SKILL.md',
    '---',
    '# demo-hub Surface Router',
    '',
    '## 1. OVERVIEW',
    '',
    'The demo-hub surface router.',
    '',
    '## 2. INTENT MODEL',
    '',
    'The demo-hub intents this router selects.',
    '',
    '## 3. MACHINE-READABLE ROUTER',
    '```python',
    'DEFAULT_RESOURCE = []',
    '',
    'INTENT_SIGNALS = {',
    '    "ALPHA": {"weight": 4, "keywords": ["alpha"]},',
    '    "BETA": {"weight": 4, "keywords": ["beta"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    '    "ALPHA": ["pack-a/references/a.md"],',
    '    "BETA": ["shared/references/shared-standard.md"],',
    '}',
    '',
    'SHARED_CONTROL_RESOURCES = ["shared/references/shared-standard.md"]',
    '```',
    '',
  ].join('\n');
  const result = validate({ routerText: text });
  // The packet-owned leaf still must be a committed manifest pair while the
  // declared hub-shared control document skips that check entirely.
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'active');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NEGATIVES: ONE STABLE CODE PER FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

function testMissingRootRouter() {
  const result = validate({ routerText: null });
  assert.equal(result.ok, false);
  assert.ok(codesOf(result).includes('RRC-001'), JSON.stringify(result.violations));
  // Only RRC-001 when nothing else is wrong: a clean hub-router default and no
  // legacy file leave the missing file as the sole finding.
  assert.deepEqual(codesOf(result), ['RRC-001'], JSON.stringify(result.violations));
}

function testMalformedStateAbsent() {
  const text = routerText('active').replace(/router_state: active\n/, '');
  const result = validate({ routerText: text });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testMalformedStateUnknown() {
  const text = routerText('active').replace('router_state: active', 'router_state: beta-only');
  const result = validate({ routerText: text });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testMalformedStateDuplicated() {
  const text = routerText('active').replace(
    'router_state: active',
    'router_state: active\nrouter_state: stage1-only',
  );
  const result = validate({ routerText: text });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testDualSource() {
  const result = validate({
    routerText: routerText('stage1-only'),
    legacyFiles: ['shared/references/smart-routing.md'],
  });
  assert.ok(codesOf(result).includes('RRC-003'), JSON.stringify(result.violations));
}

function testActiveEmptyMaps() {
  const result = validate({ routerText: routerText('active') });
  assert.equal(result.ok, false);
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testActiveKeyMismatch() {
  const result = validate({
    routerText: routerText('active', {
      intents: ACTIVE_INTENTS,
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-004').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyNonEmpty() {
  const result = validate({
    routerText: routerText('stage1-only', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-005'), JSON.stringify(result.violations));
}

function testStage1OnlyNonEmptyDefault() {
  const result = validate({
    routerText: routerText('stage1-only', { defaults: '["shared/README.md"]' }),
  });
  assert.ok(codesOf(result).includes('RRC-005'), JSON.stringify(result.violations));
}

function testUnresolvedPathNotOnDisk() {
  const result = validate({
    routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES }),
    resolveOnDisk: (p) => p !== 'pack-a/references/a.md',
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testUnresolvedPathNotInManifest() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/nope.md"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testUnresolvedPathNoDeclaredMode() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["mystery/references/x.md"],\n}',
    }),
  });
  // The path exists on disk and matches no declared mode or authored alias, so
  // the identity boundary itself fails closed.
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testManifestMissingMakesEveryPairMissing() {
  const result = validate({
    manifest: null,
    routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

function testMissingSkillPointer() {
  const text = routerText('stage1-only').replace(/skill_pointer: SKILL.md\n/, '');
  const result = validate({ routerText: text });
  assert.ok(codesOf(result).includes('RRC-007'), JSON.stringify(result.violations));
}

function testUnresolvableSkillPointer() {
  const result = validate({
    routerText: routerText('stage1-only', { pointer: 'does-not-exist.md' }),
  });
  assert.ok(codesOf(result).includes('RRC-007'), JSON.stringify(result.violations));
}

function testLegacyHubRouterDefaultResidue() {
  const result = validate({
    routerText: routerText('stage1-only'),
    hubRouterDefaultResource: ['shared/references/smart-routing.md', 'mode-registry.json'],
  });
  assert.ok(codesOf(result).includes('RRC-008'), JSON.stringify(result.violations));
}

function testLegacyStageTwoDefaultResidue() {
  const result = validate({
    routerText: routerText('active', {
      intents: ACTIVE_INTENTS,
      resources: ACTIVE_RESOURCES,
      defaults: '["references/smart-routing.md"]',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-008'), JSON.stringify(result.violations));
}

// A mapped path must never identify the root control document itself as a
// routable leaf: the leaf contract rejects a non-leaf shape, so the pair
// boundary fails closed instead of the router turning into its own leaf.
function testRouterNeverARoutedLeaf() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["ROUTER.md"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

// The same fixture bytes must produce the same codes on every run; this is the
// determinism contract the fixture matrix and the doctor rely on.
function testDeterministicRepeatedRun() {
  const text = routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES });
  const first = validate({ routerText: text });
  const second = validate({ routerText: text });
  assert.deepEqual(first.violations, second.violations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NEGATIVES: DECLARATION SHAPE (RRC-002), POINTER EXACTNESS (RRC-007),
//    HUB CONTAINMENT (RRC-006), KEY OWNERSHIP (RRC-004)
// ─────────────────────────────────────────────────────────────────────────────

// A stage1-only router must DECLARE its stage-two collections as readable
// empty blocks. A missing declaration, an unbalanced brace, or a value that is
// not a dictionary at all would otherwise collapse to "empty" and hide the
// author's intent — the runtime would silently read it as an empty map too.

function testStage1OnlyMissingIntentSignals() {
  const result = validate({ routerText: routerText('stage1-only', { intents: null }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyMissingResourceMap() {
  const result = validate({ routerText: routerText('stage1-only', { resources: null }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyMissingDefaultResource() {
  const result = validate({ routerText: routerText('stage1-only', { defaults: null }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyMissingSharedControlResources() {
  const result = validate({ routerText: routerText('stage1-only', { sharedControls: null }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

// An opener with no closing brace of its own — the scanner must not borrow a
// closer from a later collection and bless the truncated declaration as empty.
function testStage1OnlyUnbalancedIntentSignals() {
  const result = validate({ routerText: routerText('stage1-only', { intents: '{' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyMalformedDefaultResource() {
  const result = validate({ routerText: routerText('stage1-only', { defaults: '[' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testStage1OnlyNonDictIntentSignals() {
  const result = validate({ routerText: routerText('stage1-only', { intents: '42' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

// The version is part of the same declaration block as router_state: exactly
// one four-part numeric value is required in both states.

function testVersionMissing() {
  const result = validate({ routerText: routerText('stage1-only', { version: null }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testVersionDuplicated() {
  const result = validate({ routerText: routerText('stage1-only', { version: '1.0.0.0\nversion: 2.0.0.0' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

function testVersionThreePart() {
  const result = validate({ routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES, version: '1.0.0' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testVersionNonNumeric() {
  const result = validate({ routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES, version: '1.0.0.beta' }) });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

// The pointer must name the root SKILL.md exactly; a pointer to any other path
// would name a foreign or nested document as the hub entry point.
function testSkillPointerNotRoot() {
  const result = validate({ routerText: routerText('stage1-only', { pointer: '../sibling/SKILL.md' }) });
  assert.ok(codesOf(result).includes('RRC-007'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-007').length, 1, JSON.stringify(result.violations));
}

function testSkillPointerNestedPath() {
  const result = validate({ routerText: routerText('stage1-only', { pointer: 'shared/SKILL.md' }) });
  assert.ok(codesOf(result).includes('RRC-007'), JSON.stringify(result.violations));
}

// An active router routes leaves; every RESOURCE_MAP key must own at least one
// path, and every mapped path must stay inside the hub directory.

function testActiveResourceKeyEmptyList() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": [],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-004').length, 1, JSON.stringify(result.violations));
}

function testActiveResourceKeyNotAList() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": "pack-a/references/a.md",\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-004').length, 1, JSON.stringify(result.violations));
}

function testMappedResourcePathTraversal() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n    "BETA": {"weight": 4, "keywords": ["beta"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n    "BETA": ["../outside.md"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-006').length, 1, JSON.stringify(result.violations));
}

function testMappedResourcePathAbsolute() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n    "BETA": {"weight": 4, "keywords": ["beta"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n    "BETA": ["/etc/passwd"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-006'), JSON.stringify(result.violations));
}

// A declared shared control must be a hub-contained shared/... path; a
// traversal string must never reach the disk probe or the exemption set.
function testSharedControlTraversal() {
  const result = validate({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n}',
      sharedControls: '["shared/../../outside.md"]',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-004').length, 1, JSON.stringify(result.violations));
}

// An active router whose map declaration itself is unreadable must not pass
// as a mere empty map; the malformed declaration is its own finding.
function testActiveMalformedIntentSignals() {
  const result = validate({
    routerText: routerText('active', {
      intents: '42',
      resources: '{\n    "ALPHA": ["pack-a/references/a.md"],\n}',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testActiveMalformedDefaultResource() {
  const result = validate({
    routerText: routerText('active', {
      intents: ACTIVE_INTENTS,
      resources: ACTIVE_RESOURCES,
      defaults: '[',
    }),
  });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
  assert.equal(codesOf(result).filter((c) => c === 'RRC-002').length, 1, JSON.stringify(result.violations));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RUN
// ─────────────────────────────────────────────────────────────────────────────

testStage1OnlyPositive();
testActivePositive();
testActivePositiveThroughSharedAlias();
testActiveSharedControlPositive();
testActiveSharedControlMustStartWithShared();
testActiveSharedControlUnusedDeclaration();
testActiveSharedControlMissingOnDisk();
testActiveUndeclaredSharedPathStillEnforced();
testStage1OnlySharedControlNonEmpty();
testRealShapeStage1OnlyFixture();
testRealShapeActiveSharedControlFixture();
testMissingRootRouter();
testMalformedStateAbsent();
testMalformedStateUnknown();
testMalformedStateDuplicated();
testDualSource();
testActiveEmptyMaps();
testActiveKeyMismatch();
testStage1OnlyNonEmpty();
testStage1OnlyNonEmptyDefault();
testUnresolvedPathNotOnDisk();
testUnresolvedPathNotInManifest();
testUnresolvedPathNoDeclaredMode();
testManifestMissingMakesEveryPairMissing();
testMissingSkillPointer();
testUnresolvableSkillPointer();
testLegacyHubRouterDefaultResidue();
testLegacyStageTwoDefaultResidue();
testRouterNeverARoutedLeaf();
testDeterministicRepeatedRun();
testStage1OnlyMissingIntentSignals();
testStage1OnlyMissingResourceMap();
testStage1OnlyMissingDefaultResource();
testStage1OnlyMissingSharedControlResources();
testStage1OnlyUnbalancedIntentSignals();
testStage1OnlyMalformedDefaultResource();
testStage1OnlyNonDictIntentSignals();
testVersionMissing();
testVersionDuplicated();
testVersionThreePart();
testVersionNonNumeric();
testSkillPointerNotRoot();
testSkillPointerNestedPath();
testActiveResourceKeyEmptyList();
testActiveResourceKeyNotAList();
testMappedResourcePathTraversal();
testMappedResourcePathAbsolute();
testSharedControlTraversal();
testActiveMalformedIntentSignals();
testActiveMalformedDefaultResource();

function testMissingProseSectionRaisesRRC009() {
  // A router with a valid machine block but no orienting prose still parses and
  // routes, so only the section check catches its regression into a bare block.
  const withProse = validate({
    routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES }),
  });
  assert.ok(
    !codesOf(withProse).includes('RRC-009'),
    'a router carrying OVERVIEW + INTENT MODEL must not raise RRC-009',
  );

  const noProse = [
    '---', 'title: fixture router', 'version: 1.0.0.0',
    'router_state: active', 'skill_pointer: SKILL.md', '---',
    '', '# Fixture Router', '', '## 1. MACHINE-READABLE ROUTER', '',
    '```python', 'DEFAULT_RESOURCE = []', '',
    `INTENT_SIGNALS = ${ACTIVE_INTENTS}`, '',
    `RESOURCE_MAP = ${ACTIVE_RESOURCES}`, '',
    'SHARED_CONTROL_RESOURCES = []', '```', '',
  ].join('\n');
  const codes = codesOf(validate({ routerText: noProse }));
  assert.ok(
    codes.includes('RRC-009'),
    `a router missing OVERVIEW/INTENT MODEL must raise RRC-009 (got ${codes.join(', ') || 'none'})`,
  );
}
testMissingProseSectionRaisesRRC009();
console.log('[root-router-contract] all positive and negative fixtures passed');
