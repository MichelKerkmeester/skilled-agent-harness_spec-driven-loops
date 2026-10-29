#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ root-router-contract.test — coverage for the two-state ROUTER.md contract ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the root-router contract library end to end: every positive shape
 * passes, every one of the nine negative codes (RRC-001..RRC-009) fires on
 * exactly the fixture meant to trigger it, path identity goes through the
 * leaf-resource contract rather than a private re-implementation, and the
 * hub-shared control carve-out only ever exempts a declared, mapped, on-disk
 * `shared/` path from typed-pair enforcement. The hub, standalone and packet
 * profiles each run the same contract, with the non-hub classes held to the
 * active state and every non-hub finding naming its own target.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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
  'references/standalone-a.md',
  'references/standalone-b.md',
  'references/packet-a.md',
  'manual-testing-playbook/manual-testing-playbook.md',
  'feature-catalog/feature-catalog.md',
  // The same stem under a folder that does not match it is an ordinary
  // document, so the package-index exemption must never reach these.
  'assets/feature-catalog.md',
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

// A standalone root has no registry, so its manifest is its mode list and its
// generated alias projection is the identity bridge for its local leaves.
const STANDALONE_MODES = [{ workflowMode: 'standalone', packet: '.' }];
const STANDALONE_MANIFEST = {
  resourceContractVersion: 1,
  modes: [{ workflowMode: 'standalone', packet: '.', leaves: ['references/standalone-a.md'] }],
};
const STANDALONE_ALIASES = [
  { workflowMode: 'standalone', leafResourceId: 'references/standalone-a.md', diskPath: 'references/standalone-a.md' },
];

// A packet names its leaves packet-locally too, and its hub supplies the mode
// that owns them; the manifest's registered leaf is the identity source, so a
// packet router needs no authored alias bridge of its own.
const PACKET_MODES = [{ workflowMode: 'alpha', packet: 'pack-a' }];
const PACKET_MANIFEST = {
  resourceContractVersion: 1,
  modes: [{ workflowMode: 'alpha', packet: 'pack-a', leaves: ['references/packet-a.md'] }],
};

/** A one-intent active router that maps one local leaf path. */
function leafRouterText(leafPath) {
  return routerText('active', {
    intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
    resources: `{\n    "ALPHA": ["${leafPath}"],\n}`,
  });
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

function validateStandalone(options) {
  return routerContract.validateRootRouter({
    targetClass: routerContract.TARGET_CLASS_STANDALONE,
    targetName: 'sk-standalone',
    declaredModes: STANDALONE_MODES,
    manifest: STANDALONE_MANIFEST,
    aliasEntries: STANDALONE_ALIASES,
    resolveOnDisk: diskProbe,
    ...options,
  });
}

function validatePacket(options) {
  return routerContract.validateRootRouter({
    targetClass: routerContract.TARGET_CLASS_PACKET,
    targetName: 'pack-a',
    declaredModes: PACKET_MODES,
    manifest: PACKET_MANIFEST,
    manifest: PACKET_MANIFEST,
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

function testStandaloneActivePositive() {
  const result = validateStandalone({ routerText: leafRouterText('references/standalone-a.md') });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'active');
  assert.deepEqual(result.violations, []);
}

function testStandaloneRoutesToItsPackageIndex() {
  // The generator leaves a package index out of the manifest, so a standalone
  // router that names one passes, and a hub router that names it still fails.
  for (const page of ['manual-testing-playbook/manual-testing-playbook.md', 'feature-catalog/feature-catalog.md']) {
    const routed = validateStandalone({ routerText: leafRouterText(page) });
    assert.equal(routed.ok, true, JSON.stringify(routed.violations));
    const hub = validate({ routerText: leafRouterText(page) });
    assert.equal(hub.ok, false, JSON.stringify(hub.violations));
  }
}

// The exemption is the index page of the folder it sits in, so the same stem
// under any other folder is a document with no typed pair.
function testStandaloneAssetsFeatureCatalogIsNotAPackageIndex() {
  const result = validateStandalone({ routerText: leafRouterText('assets/feature-catalog.md') });
  assert.deepEqual(codesOf(result), ['RRC-006'], JSON.stringify(result.violations));
}

// A packet owns no root directory to index, so it is never exempt either.
function testPacketPackageIndexIsNotAPackageIndex() {
  const result = validatePacket({ routerText: leafRouterText('feature-catalog/feature-catalog.md') });
  assert.deepEqual(codesOf(result), ['RRC-006'], JSON.stringify(result.violations));
}

function testPacketActivePositive() {
  const result = validatePacket({ routerText: leafRouterText('references/packet-a.md') });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.state, 'active');
  assert.deepEqual(result.violations, []);
}

// A packet or standalone router written the way its own pseudocode reads it:
// any machine lines, no hub-style map pair required.
function nonHubRouterText(machineLines) {
  return '---\ntitle: fixture router\nversion: 1.0.0.0\nrouter_state: active\nskill_pointer: SKILL.md\n---\n\n' +
    '# Fixture Router\n\n## 1. OVERVIEW\n\nThe fixture packet router.\n\n' +
    '## 2. INTENT MODEL\n\nThe fixture intents.\n\n## 3. MACHINE ROUTER\n\n```python\n' +
    `${machineLines.join('\n')}\n` + '```\n';
}

const LOWER_INTENT_MODEL = 'INTENT_MODEL = {\n    "alpha": {"weight": 4, "keywords": ["alpha"]},\n}';

function testPacketIntentModelWithResourceMapPasses() {
  const result = validatePacket({
    routerText: nonHubRouterText([
      'INTENT_MODEL = {\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      'RESOURCE_MAP = {\n    "ALPHA": ["references/packet-a.md"],\n}',
    ]),
  });
  assert.deepEqual(result.violations, [], JSON.stringify(result.violations));
}

function testPacketLowerCaseIntentModelAlonePasses() {
  const result = validatePacket({ routerText: nonHubRouterText(['DEFAULT_RESOURCE = "references/packet-a.md"', LOWER_INTENT_MODEL]) });
  assert.deepEqual(result.violations, [], JSON.stringify(result.violations));
}

function testPacketWithNoMapPasses() {
  const result = validatePacket({ routerText: nonHubRouterText(['UNKNOWN_FALLBACK = {"load_level": "UNKNOWN_FALLBACK"}']) });
  assert.deepEqual(result.violations, [], JSON.stringify(result.violations));
}

function testPacketEmptyDeclaredResourceMapFails() {
  const result = validatePacket({ routerText: nonHubRouterText([LOWER_INTENT_MODEL, 'RESOURCE_MAP = {}']) });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testPacketDeclaringBothIntentNamesFails() {
  const result = validatePacket({
    routerText: nonHubRouterText([
      'INTENT_SIGNALS = {\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      LOWER_INTENT_MODEL,
    ]),
  });
  assert.ok(codesOf(result).includes('RRC-002'), JSON.stringify(result.violations));
}

function testPacketMismatchedKeysFailWhenBothMapsExist() {
  const result = validatePacket({
    routerText: nonHubRouterText([LOWER_INTENT_MODEL, 'RESOURCE_MAP = {\n    "BETA": ["references/packet-a.md"],\n}']),
  });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testHubWithIntentModelStillNeedsSignals() {
  const result = validate({ routerText: nonHubRouterText([LOWER_INTENT_MODEL]) });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

const SIGNALS_WITH_DESIGN = 'INTENT_SIGNALS = {\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n'
  + '    "DESIGN": {"weight": 4, "keywords": ["design tokens"]},\n}';
const ALPHA_MAP = 'RESOURCE_MAP = {\n    "ALPHA": ["references/packet-a.md"],\n}';
const ALPHA_DESIGN_EMPTY_MAP = 'RESOURCE_MAP = {\n    "ALPHA": ["references/packet-a.md"],\n    "DESIGN": [],\n}';
const NO_LOAD_DESIGN = 'NO_LOAD_INTENTS = ("DESIGN",)';

// A signal-only intent passes only when NO_LOAD_INTENTS names it, whether it
// is missing from RESOURCE_MAP or maps to an empty list.
function testPacketNoLoadIntentPasses() {
  for (const map of [ALPHA_MAP, ALPHA_DESIGN_EMPTY_MAP]) {
    const listed = validatePacket({ routerText: nonHubRouterText([SIGNALS_WITH_DESIGN, NO_LOAD_DESIGN, map]) });
    assert.deepEqual(listed.violations, [], JSON.stringify(listed.violations));
    const unlisted = validatePacket({ routerText: nonHubRouterText([SIGNALS_WITH_DESIGN, map]) });
    assert.deepEqual(codesOf(unlisted), ['RRC-004'], JSON.stringify(unlisted.violations));
  }
}

function testNoLoadIntentMisuseFails() {
  const unknown = validatePacket({
    routerText: nonHubRouterText([SIGNALS_WITH_DESIGN, 'NO_LOAD_INTENTS = ("DESIGN", "GAMMA")', ALPHA_MAP]),
  });
  assert.ok(unknown.violations.some((v) => v.code === 'RRC-004' && /"GAMMA"/.test(v.message)), JSON.stringify(unknown.violations));
  const mapped = validatePacket({
    routerText: nonHubRouterText([SIGNALS_WITH_DESIGN, 'NO_LOAD_INTENTS = ("ALPHA", "DESIGN")', ALPHA_MAP]),
  });
  assert.ok(mapped.violations.some((v) => v.code === 'RRC-004' && /"ALPHA"/.test(v.message)), JSON.stringify(mapped.violations));
  const hub = validate({
    routerText: routerText('active', { intents: ACTIVE_INTENTS, resources: ACTIVE_RESOURCES }).replace('```python\n', `\`\`\`python\n${NO_LOAD_DESIGN}\n`),
  });
  assert.ok(hub.violations.some((v) => v.code === 'RRC-004' && /may not declare NO_LOAD_INTENTS/.test(v.message)), JSON.stringify(hub.violations));
}

const INSTALL_MAP = 'RESOURCE_MAP = {\n    "ALPHA": ["references/packet-a.md"],\n    "INSTALL": ["INSTALL-GUIDE.md"],\n}';
const INSTALL_SIGNALS = 'INTENT_SIGNALS = {\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n'
  + '    "INSTALL": {"weight": 6, "keywords": ["install"]},\n}';
const ROOT_INSTALL = 'ROOT_RESOURCES = ("INSTALL-GUIDE.md",)';
const withInstallOnDisk = (p) => p === 'INSTALL-GUIDE.md' || diskProbe(p);

// A root file is exempt from the typed-pair rule only when it is declared,
// referenced and present in the router's own folder.
function testPacketRootResourcePasses() {
  const result = validatePacket({
    routerText: nonHubRouterText([INSTALL_SIGNALS, ROOT_INSTALL, INSTALL_MAP]),
    resolveOnDisk: withInstallOnDisk,
    resolveInOwnRoot: (p) => p === 'INSTALL-GUIDE.md',
  });
  assert.deepEqual(result.violations, [], JSON.stringify(result.violations));
}

function testRootResourceGuardsStillFail() {
  const own = (p) => p === 'INSTALL-GUIDE.md';
  const undeclared = validatePacket({
    routerText: nonHubRouterText([INSTALL_SIGNALS, INSTALL_MAP]), resolveOnDisk: withInstallOnDisk, resolveInOwnRoot: own,
  });
  assert.deepEqual(codesOf(undeclared), ['RRC-006'], JSON.stringify(undeclared.violations));
  // Present only at the hub root, which a packet's ordinary probe would accept.
  const hubOnly = validatePacket({
    routerText: nonHubRouterText([INSTALL_SIGNALS, ROOT_INSTALL, INSTALL_MAP]), resolveOnDisk: withInstallOnDisk, resolveInOwnRoot: () => false,
  });
  assert.ok(codesOf(hubOnly).includes('RRC-006'), JSON.stringify(hubOnly.violations));
  const noProbe = validatePacket({
    routerText: nonHubRouterText([INSTALL_SIGNALS, ROOT_INSTALL, INSTALL_MAP]), resolveOnDisk: withInstallOnDisk,
  });
  assert.ok(codesOf(noProbe).includes('RRC-006'), JSON.stringify(noProbe.violations));
  const nested = validatePacket({
    routerText: nonHubRouterText([INSTALL_SIGNALS, 'ROOT_RESOURCES = ("references/packet-a.md",)', INSTALL_MAP]),
    resolveOnDisk: withInstallOnDisk, resolveInOwnRoot: own,
  });
  assert.ok(nested.violations.some((v) => v.code === 'RRC-004' && /single markdown file name/.test(v.message)), JSON.stringify(nested.violations));
}

const TUPLE_MODEL = 'INTENT_MODEL = {\n    "APPS": {"keywords": [("app research", 4), ("competitor", 3)]},\n'
  + '    "FLOWS": {"keywords": [("user flow", 4)]},\n}';
const MIRROR_SIGNALS = 'INTENT_SIGNALS = {\n    "APPS": {"weight": 4, "keywords": ["app research", "competitor"]},\n'
  + '    "FLOWS": {"weight": 4, "keywords": ["user flow"]},\n}';
const APPS_FLOWS_MAP = 'RESOURCE_MAP = {\n    "APPS": ["references/packet-a.md"],\n    "FLOWS": ["references/packet-a.md"],\n}';

// Both intent maps may stand only as an exact mirror: same keys, same keywords.
function testPacketMirroredIntentMapsPass() {
  const result = validatePacket({ routerText: nonHubRouterText([TUPLE_MODEL, MIRROR_SIGNALS, APPS_FLOWS_MAP]) });
  assert.deepEqual(result.violations, [], JSON.stringify(result.violations));
}

function testPacketDriftedIntentMirrorFails() {
  const missingKeyword = MIRROR_SIGNALS.replace(', "competitor"', '');
  const drifted = validatePacket({ routerText: nonHubRouterText([TUPLE_MODEL, missingKeyword, APPS_FLOWS_MAP]) });
  assert.ok(codesOf(drifted).includes('RRC-002'), JSON.stringify(drifted.violations));
  const renamed = MIRROR_SIGNALS.replace('"FLOWS"', '"JOURNEYS"');
  const rekeyed = validatePacket({ routerText: nonHubRouterText([TUPLE_MODEL, renamed, APPS_FLOWS_MAP]) });
  assert.ok(codesOf(rekeyed).includes('RRC-002'), JSON.stringify(rekeyed.violations));
}

// A commented-out name or keyword is not one the runtime reads, and an
// apostrophe inside a comment must not open a string.
function testCommentsAreNotEntries() {
  const commentedNoLoad = 'NO_LOAD_INTENTS = (\n    "DESIGN",\n    # "GAMMA" was retired\n)';
  const noLoad = validatePacket({ routerText: nonHubRouterText([SIGNALS_WITH_DESIGN, commentedNoLoad, ALPHA_MAP]) });
  assert.deepEqual(noLoad.violations, [], JSON.stringify(noLoad.violations));
  const commentedKeyword = MIRROR_SIGNALS.replace('"competitor"]},', '"competitor"]},  # it\'s "rival" in the old model');
  const mirror = validatePacket({ routerText: nonHubRouterText([TUPLE_MODEL, commentedKeyword, APPS_FLOWS_MAP]) });
  assert.deepEqual(mirror.violations, [], JSON.stringify(mirror.violations));
}

// A list named in prose outside the fenced machine block declares nothing.
function testProseNameListIsNotDeclared() {
  const text = nonHubRouterText([SIGNALS_WITH_DESIGN, ALPHA_MAP])
    .replace('## 3. MACHINE ROUTER', 'NO_LOAD_INTENTS = ("DESIGN",) is how a packet opts out.\n\n## 3. MACHINE ROUTER');
  const result = validatePacket({ routerText: text });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
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
// 5b. TARGET CLASSES: STANDALONE AND PACKET
// ─────────────────────────────────────────────────────────────────────────────

function testStandaloneActiveEmptyMaps() {
  const result = validateStandalone({ routerText: routerText('active') });
  assert.ok(codesOf(result).includes('RRC-004'), JSON.stringify(result.violations));
}

function testStandaloneStage1OnlyRejected() {
  const result = validateStandalone({ routerText: routerText('stage1-only') });
  assert.deepEqual(codesOf(result), ['RRC-002'], JSON.stringify(result.violations));
  const message = result.violations[0].message;
  assert.match(message, /^sk-standalone: /);
  assert.match(message, /standalone skill/);
  assert.doesNotMatch(message, /hub root/);
}

function testPacketStage1OnlyRejected() {
  const result = validatePacket({ routerText: routerText('stage1-only') });
  assert.deepEqual(codesOf(result), ['RRC-002'], JSON.stringify(result.violations));
  const message = result.violations[0].message;
  assert.match(message, /^pack-a: /);
  assert.match(message, /mode packet/);
  assert.doesNotMatch(message, /hub root/);
}

function testStandaloneMissingRouterNamesTarget() {
  const result = validateStandalone({ routerText: null });
  assert.deepEqual(codesOf(result), ['RRC-001'], JSON.stringify(result.violations));
  assert.match(result.violations[0].message, /^sk-standalone: /);
  assert.doesNotMatch(result.violations[0].message, /hub root/);
}

function testPacketMissingRouterNamesTarget() {
  const result = validatePacket({ routerText: null });
  assert.deepEqual(codesOf(result), ['RRC-001'], JSON.stringify(result.violations));
  assert.match(result.violations[0].message, /^pack-a: /);
  assert.doesNotMatch(result.violations[0].message, /hub root/);
}

function testNonHubFindingsNeverNameTheHubRoot() {
  const result = validateStandalone({
    routerText: routerText('active', {
      intents: '{\n    "ALPHA": {"weight": 4, "keywords": ["alpha"]},\n}',
      resources: '{\n    "ALPHA": ["shared/references/shared-standard.md"],\n}',
      sharedControls: '["pack-a/references/a.md"]',
      pointer: 'nested/SKILL.md',
    }),
  });
  assert.ok(result.violations.length >= 2, JSON.stringify(result.violations));
  const messages = result.violations.map((violation) => violation.message).join('\n');
  assert.match(messages, /^sk-standalone: /m);
  assert.doesNotMatch(messages, /hub root/);
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
testStandaloneActivePositive();
testStandaloneRoutesToItsPackageIndex();
testStandaloneAssetsFeatureCatalogIsNotAPackageIndex();
testPacketPackageIndexIsNotAPackageIndex();
testPacketActivePositive();
testPacketIntentModelWithResourceMapPasses();
testPacketLowerCaseIntentModelAlonePasses();
testPacketWithNoMapPasses();
testPacketEmptyDeclaredResourceMapFails();
testPacketDeclaringBothIntentNamesFails();
testPacketMismatchedKeysFailWhenBothMapsExist();
testHubWithIntentModelStillNeedsSignals();
testPacketNoLoadIntentPasses();
testNoLoadIntentMisuseFails();
testPacketRootResourcePasses();
testRootResourceGuardsStillFail();
testPacketMirroredIntentMapsPass();
testPacketDriftedIntentMirrorFails();
testCommentsAreNotEntries();
testProseNameListIsNotDeclared();
testStandaloneActiveEmptyMaps();
testStandaloneStage1OnlyRejected();
testPacketStage1OnlyRejected();
testStandaloneMissingRouterNamesTarget();
testPacketMissingRouterNamesTarget();
testNonHubFindingsNeverNameTheHubRoot();

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

// ─────────────────────────────────────────────────────────────────────────────
// 7. UNPROVISIONED-TREE LOAD FAILURE
// ─────────────────────────────────────────────────────────────────────────────

// The shared frontmatter parser is built, not committed, so a tree that has
// never been provisioned fails to load the library. A temp directory has no
// ancestor node_modules, which reproduces that fresh-clone resolution failure.

/** Stage the library and its one local require outside the repository. */
function stageLibraryCopy(dir) {
  const libDir = path.join(dir, 'lib');
  fs.mkdirSync(libDir);
  for (const name of ['root-router-contract.cjs', 'leaf-resource-contract.cjs']) {
    fs.copyFileSync(path.join(__dirname, '..', 'lib', name), path.join(libDir, name));
  }
  return path.join(libDir, 'root-router-contract.cjs');
}

// Require the staged library in a child process and surface only the thrown
// message, so a stack frame in stderr can only come from the message itself.
function requireStagedLibrary(libPath) {
  const script = [
    'try {',
    `  require(${JSON.stringify(libPath)});`,
    '  process.exit(3);',
    '} catch (err) {',
    '  process.stderr.write(String(err && err.message));',
    '  process.exit(1);',
    '}',
  ].join('\n');
  const env = { ...process.env };
  delete env.NODE_PATH;
  return spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', env });
}

function testUnprovisionedTreeNamesProvisionCommand() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'root-router-contract-'));
  try {
    const child = requireStagedLibrary(stageLibraryCopy(dir));
    assert.equal(child.status, 1, `expected the load to fail, got ${child.status}: ${child.stderr}`);
    const message = child.stderr.trim();
    assert.match(
      message,
      /worktree-naming\.sh provision/,
      `the failure must name the provision command: ${message}`,
    );
    assert.equal(message.split('\n').length, 1, `the failure must be one line: ${message}`);
    assert.ok(!/^[ \t]+at /m.test(message), `the failure must carry no stack frame: ${message}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Only the shared package's own resolution failure is relabeled: a different
// missing module keeps its own name even when the shared package is present.
function testUnrelatedMissingModuleKeepsItsOwnError() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'root-router-contract-'));
  try {
    const libPath = stageLibraryCopy(dir);
    const fakeParser = path.join(
      dir, 'node_modules', '@spec-kit', 'shared', 'frontmatter', 'parse-frontmatter.js',
    );
    fs.mkdirSync(path.dirname(fakeParser), { recursive: true });
    fs.writeFileSync(fakeParser, "require('a-different-missing-module');\n");

    const child = requireStagedLibrary(libPath);
    assert.equal(child.status, 1, `expected the load to fail, got ${child.status}: ${child.stderr}`);
    assert.match(
      child.stderr,
      /a-different-missing-module/,
      `the original error must surface unchanged: ${child.stderr}`,
    );
    assert.ok(
      !/worktree-naming\.sh provision/.test(child.stderr),
      `an unrelated missing module must not be relabeled: ${child.stderr}`,
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

testUnprovisionedTreeNamesProvisionCommand();
testUnrelatedMissingModuleKeepsItsOwnError();
console.log('[root-router-contract] all positive and negative fixtures passed');
