#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ leaf-resource-contract.test — unit coverage for the contract library     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the byte-stable generation contract: normalization to the typed
 * pair, composite-key stability (including the legitimate cross-mode
 * same-filename case versus a real within-mode collision), the containment
 * invariant (including a rejection case for an out-of-root / prefix-stripped
 * input), canonical-byte determinism, and dual-read of a real legacy sk-doc
 * fixture string.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const contract = require('../lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const SK_DOC_ROOT = path.join(__dirname, '..', '..', '..');
const REGISTRY_PATH = path.join(SK_DOC_ROOT, 'mode-registry.json');
const DOC_QUALITY_FIXTURE_PATH = path.join(
  SK_DOC_ROOT, 'manual_testing_playbook', 'intent_detection', 'doc_quality.md',
);

function readRegistryModes() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  return registry.modes.map((mode) => ({ workflowMode: mode.workflowMode, packet: mode.packet }));
}

// Pull the literal `expected_resources` list items out of a real sk-doc
// playbook fixture's frontmatter, so the dual-read test exercises an actual
// committed legacy string rather than a hand-typed guess.
function readExpectedResources(fixturePath) {
  const text = fs.readFileSync(fixturePath, 'utf8');
  const block = /expected_resources:\s*\n((?:\s*-\s*.+\n?)+)/.exec(text);
  assert.ok(block, `fixture missing expected_resources block: ${fixturePath}`);
  return block[1]
    .split('\n')
    .map((line) => /^\s*-\s*(.+?)\s*$/.exec(line))
    .filter(Boolean)
    .map((m) => m[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS: NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function testNormalizationToTypedPair() {
  assert.deepEqual(
    contract.makeTypedPair('create-readme', 'references/README.md'),
    { workflowMode: 'create-readme', leafResourceId: 'references/README.md' },
  );
  // Leading "./" and backslashes are stripped/normalized, not rejected.
  assert.deepEqual(
    contract.makeTypedPair('create-skill', './assets/skill/skill_md_template.md'),
    { workflowMode: 'create-skill', leafResourceId: 'assets/skill/skill_md_template.md' },
  );
  assert.equal(contract.normalizeLeafResourceId('references\\hvr_rules.md'), 'references/hvr_rules.md');
}

function testMakeTypedPairRejectsEmptyWorkflowMode() {
  assert.throws(() => contract.makeTypedPair('', 'references/x.md'), contract.ContractError);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS: COMPOSITE KEY
// ─────────────────────────────────────────────────────────────────────────────

function testCompositeKeyStability() {
  const pair = { workflowMode: 'create-changelog', leafResourceId: 'references/README.md' };
  const keyA = contract.compositeKey(pair);
  const keyB = contract.compositeKey({ workflowMode: 'create-changelog', leafResourceId: 'references/README.md' });
  assert.equal(keyA, keyB, 'the same logical pair must always produce the same composite key');
  assert.deepEqual(contract.parseCompositeKey(keyA), pair, 'parseCompositeKey must round-trip compositeKey');
}

function testCompositeUniquenessIsPerModeNotGlobal() {
  // Ten packets legitimately share references/README.md. That is NOT a
  // collision because uniqueness is enforced on the composite pair.
  const tenPackets = ['create-skill', 'create-readme', 'create-agent', 'create-command',
    'create-feature-catalog', 'create-manual-testing-playbook', 'create-benchmark',
    'create-flowchart', 'create-changelog', 'create-diff'];
  const pairs = tenPackets.map((workflowMode) => ({ workflowMode, leafResourceId: 'references/README.md' }));
  assert.deepEqual(contract.findDuplicateComposites(pairs), [], 'same leaf across different modes must not collide');

  // A real duplicate: the same mode claiming the same leaf twice.
  const withRealDupe = [...pairs, { workflowMode: 'create-skill', leafResourceId: 'references/README.md' }];
  const dupes = contract.findDuplicateComposites(withRealDupe);
  assert.equal(dupes.length, 1, 'a within-mode repeat of the same leaf must be reported as a duplicate');
  assert.deepEqual(contract.parseCompositeKey(dupes[0]), { workflowMode: 'create-skill', leafResourceId: 'references/README.md' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: CONTAINMENT
// ─────────────────────────────────────────────────────────────────────────────

function testContainmentRejectsTraversalAndAbsolutePaths() {
  assert.throws(() => contract.assertContainment('../../etc/passwd'), { code: 'PATH_TRAVERSAL' });
  assert.throws(() => contract.assertContainment('references/../../../etc/passwd'), { code: 'PATH_TRAVERSAL' });
  assert.throws(() => contract.assertContainment('/etc/passwd'), { code: 'ABSOLUTE_PATH' });
  assert.throws(() => contract.assertContainment('scripts/leaf-resource-contract.cjs'), { code: 'OUT_OF_ROOT' });
}

// A hub-qualified or shared-prefixed string must only convert through a
// declared mode or alias. An unrecognized prefix must fail closed instead of
// being generically stripped down to something that happens to look like a
// leaf id.
function testDualReadDoesNotGenericallyStripUnrecognizedPrefixes() {
  const declaredModes = [{ workflowMode: 'create-skill', packet: 'create-skill' }];
  const result = contract.dualReadLegacyResource({
    raw: 'not-a-declared-packet/references/x.md',
    declaredModes,
    aliasEntries: [],
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'UNRECOGNIZED_LEGACY_SHAPE');

  // An out-of-root traversal string must not resolve even if it happens to
  // contain a declared packet name somewhere in the middle.
  const traversal = contract.dualReadLegacyResource({
    raw: '../../create-skill/references/../../etc/passwd',
    declaredModes,
    aliasEntries: [],
  });
  assert.equal(traversal.ok, false);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: CANONICAL BYTES
// ─────────────────────────────────────────────────────────────────────────────

function testCanonicalBytesAreDeterministic() {
  const manifestA = contract.buildManifest({
    resourceContractVersion: 1,
    modeEntries: [
      { workflowMode: 'create-readme', packet: 'create-readme', leaves: ['references/README.md', 'assets/readme/install_guide_template.md'] },
      { workflowMode: 'create-agent', packet: 'create-agent', leaves: ['assets/agent_template.md', 'references/README.md'] },
    ],
  });
  // Same logical input, different insertion order (modes reversed, leaves reversed).
  const manifestB = contract.buildManifest({
    resourceContractVersion: 1,
    modeEntries: [
      { workflowMode: 'create-agent', packet: 'create-agent', leaves: ['references/README.md', 'assets/agent_template.md'] },
      { workflowMode: 'create-readme', packet: 'create-readme', leaves: ['assets/readme/install_guide_template.md', 'references/README.md'] },
    ],
  });

  const bytesA = contract.canonicalManifestBytes(manifestA);
  const bytesB = contract.canonicalManifestBytes(manifestB);
  assert.ok(Buffer.compare(bytesA, bytesB) === 0, 'the same logical manifest must always serialize to identical bytes');
  assert.equal(contract.digestManifestBytes(bytesA), contract.digestManifestBytes(bytesB));

  // A trailing-newline, sorted-key discipline: exactly one trailing newline,
  // and top-level keys appear in sorted order in the byte stream.
  const text = bytesA.toString('utf8');
  assert.ok(text.endsWith('\n') && !text.endsWith('\n\n'), 'exactly one trailing newline');
  assert.ok(text.indexOf('"modes"') < text.indexOf('"resourceContractVersion"'), 'top-level keys must be sorted');

  // A genuinely different manifest must not collide.
  const manifestC = contract.buildManifest({
    resourceContractVersion: 1,
    modeEntries: [{ workflowMode: 'create-agent', packet: 'create-agent', leaves: ['references/README.md'] }],
  });
  assert.notEqual(contract.digestManifestBytes(contract.canonicalManifestBytes(manifestC)), contract.digestManifestBytes(bytesA));
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: DUAL-READ OF A REAL LEGACY FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

function testDualReadOfRealLegacyFixtureString() {
  const declaredModes = readRegistryModes();
  const expectedResources = readExpectedResources(DOC_QUALITY_FIXTURE_PATH);

  // doc_quality.md's gold list mixes plain packet-root-relative strings with
  // one packet-qualified legacy string that names a different sk-doc packet
  // (create-quality-control) than the one the fixture file itself lives
  // under. That packet-qualified shape is the real legacy string this test
  // proves dual-read resolves correctly.
  const qualified = expectedResources.find((r) => r.startsWith('create-quality-control/'));
  assert.ok(qualified, 'expected a create-quality-control/-qualified legacy string in doc_quality.md gold');

  const result = contract.dualReadLegacyResource({ raw: qualified, declaredModes, aliasEntries: [] });
  assert.equal(result.ok, true, `dual-read must resolve the real legacy fixture string: ${qualified}`);
  assert.equal(result.pair.workflowMode, 'create-quality-control');
  assert.equal(result.pair.leafResourceId, qualified.slice('create-quality-control/'.length));
  assert.ok(result.pair.leafResourceId.startsWith('references/') || result.pair.leafResourceId.startsWith('assets/'));

  // The remaining plain entries in the same fixture are already canonical
  // and must dual-read as-is when the caller supplies the fixture's own mode.
  const plain = expectedResources.find((r) => (r.startsWith('references/') || r.startsWith('assets/')) && r !== qualified);
  if (plain) {
    const plainResult = contract.dualReadLegacyResource({ raw: plain, workflowMode: 'create-quality-control', declaredModes, aliasEntries: [] });
    assert.equal(plainResult.ok, true);
    assert.equal(plainResult.pair.leafResourceId, plain);
  }
}

// A real shared-alias case (create-changelog's shared template) resolves
// only through an authored alias entry, never through generic prefix
// stripping of "../shared/".
function testDualReadOfSharedAliasRequiresAuthoredEntry() {
  const raw = '../shared/assets/changelog_template.md';
  const noAlias = contract.dualReadLegacyResource({ raw, declaredModes: [], aliasEntries: [] });
  assert.equal(noAlias.ok, false, 'a shared-prefixed string must not resolve without an authored alias');

  const aliasEntries = [{ workflowMode: 'create-changelog', leafResourceId: 'assets/changelog_template.md', diskPath: 'shared/assets/changelog_template.md' }];
  const withAlias = contract.dualReadLegacyResource({ raw, declaredModes: [], aliasEntries });
  assert.equal(withAlias.ok, true);
  assert.deepEqual(withAlias.pair, { workflowMode: 'create-changelog', leafResourceId: 'assets/changelog_template.md' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. RUN
// ─────────────────────────────────────────────────────────────────────────────

testNormalizationToTypedPair();
testMakeTypedPairRejectsEmptyWorkflowMode();
testCompositeKeyStability();
testCompositeUniquenessIsPerModeNotGlobal();
testContainmentRejectsTraversalAndAbsolutePaths();
testDualReadDoesNotGenericallyStripUnrecognizedPrefixes();
testCanonicalBytesAreDeterministic();
testDualReadOfRealLegacyFixtureString();
testDualReadOfSharedAliasRequiresAuthoredEntry();
console.log('[sk-doc] leaf-resource-contract unit coverage passed');
