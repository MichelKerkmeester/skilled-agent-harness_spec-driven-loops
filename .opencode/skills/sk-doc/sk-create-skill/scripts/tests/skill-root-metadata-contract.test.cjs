#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-root-metadata-contract.test — class contract + fleet gate coverage ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the two halves of the root-metadata contract: the pure classifier
 * (class discrimination, required/forbidden sets, overlay scoping) and the
 * fleet gate that applies it (root discovery from the authored marker, nested
 * identity detection, generated-file freshness, and --fix write scoping).
 *
 * The fleet assertions run against the real skills tree rather than a fixture
 * so the committed contract cannot drift away from the fleet it governs: if a
 * root changes class or stops conforming, this test fails before any consumer
 * notices. Negative cases use synthetic roots in a temp dir, since the point is
 * to prove the gate rejects shapes that must never reach the fleet.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const contract = require('../lib/skill-root-metadata-contract.cjs');
const gate = require('../ci-skill-root-metadata.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..');

/** The fleet's expected class map. A change here is a deliberate act. */
const EXPECTED_CLASSES = {
  'cli-external-orchestration': contract.CLASS_HUB,
  'mcp-code-mode': contract.CLASS_STANDALONE,
  'mcp-tooling': contract.CLASS_HUB,
  'sk-code': contract.CLASS_HUB,
  'sk-design': contract.CLASS_HUB,
  'sk-doc': contract.CLASS_HUB,
  'sk-git': contract.CLASS_STANDALONE,
  'sk-prompt': contract.CLASS_HUB,
  'system-deep-loop': contract.CLASS_HUB,
  'system-skill-advisor': contract.CLASS_STANDALONE,
  'system-spec-kit': contract.CLASS_STANDALONE,
};

let tmpRoot = null;

function makeTmpSkillsDir() {
  if (!tmpRoot) tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-root-contract-'));
  return fs.mkdtempSync(path.join(tmpRoot, 'skills-'));
}

/** Build a synthetic skill root with the named metadata files present. */
function makeRoot(skillsDir, skillId, files) {
  const dir = path.join(skillsDir, skillId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, contract.SKILL_MARKER), `# ${skillId}\n`);
  for (const [name, body] of Object.entries(files || {})) {
    const full = path.join(dir, name);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, typeof body === 'string' ? body : `${JSON.stringify(body, null, 2)}\n`);
  }
  return dir;
}

function codesOf(result) {
  return result.violations.map((v) => v.code).sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function testDiscriminatorDecidesClass() {
  const hub = contract.classifyPresence({ 'mode-registry.json': true, 'hub-router.json': true });
  assert.equal(hub.skillClass, contract.CLASS_HUB);

  const standalone = contract.classifyPresence({});
  assert.equal(standalone.skillClass, contract.CLASS_STANDALONE);

  // Exactly one half of the coupled declaration is not a third class.
  for (const half of contract.DISCRIMINATOR_FILES) {
    const partial = contract.classifyPresence({ [half]: true });
    assert.equal(partial.skillClass, null, `${half} alone must not classify`);
    assert.match(partial.reason, /partial hub declaration/);
  }
}

function testClassificationIgnoresGeneratedOutput() {
  // Classification must not consult generated files, or a root whose manifest
  // was never written would classify differently after regeneration and the
  // gate could never report the manifest as missing.
  const withManifest = contract.classifyPresence({ 'leaf-manifest.json': true });
  const without = contract.classifyPresence({});
  assert.equal(withManifest.skillClass, without.skillClass);
}

function testPresenceAcceptsIterableOrMap() {
  const fromList = contract.classifyPresence(['mode-registry.json', 'hub-router.json']);
  assert.equal(fromList.skillClass, contract.CLASS_HUB);
  const normalized = contract.normalizePresence(['description.json']);
  assert.equal(normalized['description.json'], true);
  assert.equal(normalized['hub-router.json'], false);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REQUIRED / FORBIDDEN / OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

function testHubRequiresItsFullSet() {
  const missingDescription = contract.evaluateRoot('some-hub', {
    'mode-registry.json': true,
    'hub-router.json': true,
    'graph-metadata.json': true,
    'leaf-manifest.json': true,
    'command-metadata.json': true,
  });
  assert.deepEqual(codesOf(missingDescription), ['MISSING_REQUIRED_FILE']);
  assert.equal(missingDescription.violations[0].file, 'description.json');

  // command-metadata is optional for a hub: a hub that owns no slash commands
  // carries no command surface, so its absence is conformant, not a violation.
  const noCommands = contract.evaluateRoot('some-hub', {
    'mode-registry.json': true,
    'hub-router.json': true,
    'graph-metadata.json': true,
    'description.json': true,
    'leaf-manifest.json': true,
  });
  assert.deepEqual(noCommands.violations, []);
}

function testStandaloneRequiresItsFullSet() {
  const bare = contract.evaluateRoot('some-standalone', { 'graph-metadata.json': true });
  const files = bare.violations.map((v) => v.file).sort();
  assert.deepEqual(files, ['leaf-aliases.json', 'leaf-manifest.config.json', 'leaf-manifest.json']);
  // Generated absences are reported under their own code so --fix knows which
  // findings it is allowed to resolve by writing.
  const generated = bare.violations.filter((v) => v.code === 'MISSING_GENERATED_FILE').map((v) => v.file).sort();
  assert.deepEqual(generated, ['leaf-aliases.json', 'leaf-manifest.json']);
}

function testForbiddenFilesAreRejectedPerClass() {
  const hubWithConfig = contract.evaluateRoot('some-hub', {
    'mode-registry.json': true,
    'hub-router.json': true,
    'graph-metadata.json': true,
    'description.json': true,
    'leaf-manifest.json': true,
    'command-metadata.json': true,
    'leaf-manifest.config.json': true,
  });
  assert.deepEqual(codesOf(hubWithConfig), ['FORBIDDEN_FILE']);
  assert.equal(hubWithConfig.violations[0].file, 'leaf-manifest.config.json');

  const standaloneWithDescription = contract.evaluateRoot('some-standalone', {
    'graph-metadata.json': true,
    'leaf-manifest.config.json': true,
    'leaf-manifest.json': true,
    'leaf-aliases.json': true,
    'description.json': true,
  });
  assert.deepEqual(codesOf(standaloneWithDescription), ['FORBIDDEN_FILE']);
  assert.equal(standaloneWithDescription.violations[0].file, 'description.json');

  // Command metadata binds commands to registry modes a standalone lacks.
  const standaloneWithCommands = contract.evaluateRoot('some-standalone', {
    'graph-metadata.json': true,
    'leaf-manifest.config.json': true,
    'leaf-manifest.json': true,
    'leaf-aliases.json': true,
    'command-metadata.json': true,
  });
  assert.deepEqual(codesOf(standaloneWithCommands), ['FORBIDDEN_FILE']);
  assert.equal(standaloneWithCommands.violations[0].file, 'command-metadata.json');
}

function testCommandMetadataIsUniformAcrossHubs() {
  // The command surface is class policy, not a per-root overlay: the same
  // conforming hub presence map passes regardless of which hub carries it.
  const conformingHub = {
    'mode-registry.json': true,
    'hub-router.json': true,
    'graph-metadata.json': true,
    'description.json': true,
    'leaf-manifest.json': true,
    'command-metadata.json': true,
  };
  assert.deepEqual(contract.evaluateRoot('sk-design', conformingHub).violations, []);
  assert.deepEqual(contract.evaluateRoot('sk-doc', conformingHub).violations, []);
  assert.deepEqual(contract.OVERLAY_FILES, {});
}

function testGeneratedIsClassSensitive() {
  // Aliases are derivable for a standalone root and authored for a hub. A
  // caller that ignores class would happily overwrite a hub's real remaps.
  assert.equal(contract.isGenerated('leaf-aliases.json', contract.CLASS_STANDALONE), true);
  assert.equal(contract.isGenerated('leaf-aliases.json', contract.CLASS_HUB), false);
  assert.equal(contract.isGenerated('leaf-manifest.json', contract.CLASS_HUB), true);
  assert.equal(contract.isGenerated('description.json', contract.CLASS_HUB), false);
  assert.throws(() => contract.isGenerated('leaf-manifest.json', 'Z'), /unknown skill class/);
}

function testLegalFilesForClass() {
  // Command metadata is class policy now, so every hub's legal set carries it.
  assert.ok(contract.legalFilesForClass(contract.CLASS_HUB, 'sk-design').includes('command-metadata.json'));
  assert.ok(contract.legalFilesForClass(contract.CLASS_HUB, 'sk-doc').includes('command-metadata.json'));
  assert.ok(contract.legalFilesForClass(contract.CLASS_HUB, 'sk-doc').includes('leaf-aliases.json'));
  assert.ok(!contract.legalFilesForClass(contract.CLASS_STANDALONE, 'sk-git').includes('command-metadata.json'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FLEET CONFORMANCE
// ─────────────────────────────────────────────────────────────────────────────

function testFleetDiscoveryUsesTheAuthoredMarker() {
  const roots = gate.findSkillRoots(SKILLS_DIR).map((d) => path.basename(d));
  assert.deepEqual(roots, Object.keys(EXPECTED_CLASSES).sort());
}

function testEveryFleetRootConformsToItsExpectedClass() {
  for (const [skillId, expectedClass] of Object.entries(EXPECTED_CLASSES)) {
    const result = gate.checkRoot(path.join(SKILLS_DIR, skillId));
    assert.equal(result.skillClass, expectedClass, `${skillId} class`);
    assert.deepEqual(
      result.violations, [],
      `${skillId} must conform: ${result.violations.map((v) => v.message).join('; ')}`,
    );
  }
}

function testFleetAliasProjectionsAreIdentityForStandaloneRoots() {
  for (const [skillId, skillClass] of Object.entries(EXPECTED_CLASSES)) {
    if (skillClass !== contract.CLASS_STANDALONE) continue;
    const rows = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, skillId, 'leaf-aliases.json'), 'utf8'));
    assert.ok(Array.isArray(rows) && rows.length > 0, `${skillId} aliases non-empty`);
    for (const row of rows) {
      assert.equal(row.leafResourceId, row.diskPath, `${skillId} alias must be an identity row`);
      assert.equal(row.workflowMode, skillId, `${skillId} alias mode`);
    }
  }
}

function testHubAliasesStayAuthored() {
  // sk-doc is the fleet's proof that hub aliases carry information no generator
  // can infer: rows that relocate a mode's resource into the shared tree.
  const rows = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, 'sk-doc', 'leaf-aliases.json'), 'utf8'));
  assert.ok(rows.some((row) => row.leafResourceId !== row.diskPath),
    'sk-doc must retain at least one relocating alias row');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GATE BEHAVIOUR
// ─────────────────────────────────────────────────────────────────────────────

function testGateFlagsUnclassifiableRoot() {
  const skillsDir = makeTmpSkillsDir();
  makeRoot(skillsDir, 'half-declared', { 'mode-registry.json': { modes: [] } });
  const result = gate.checkRoot(path.join(skillsDir, 'half-declared'));
  assert.equal(result.skillClass, null);
  assert.deepEqual(codesOf(result), ['UNCLASSIFIABLE_ROOT']);
}

function testGateDetectsNestedIdentity() {
  const skillsDir = makeTmpSkillsDir();
  makeRoot(skillsDir, 'nested-id', {
    'graph-metadata.json': { skill_id: 'nested-id' },
    'leaf-manifest.config.json': { workflowMode: 'nested-id' },
    'references/a.md': '# a\n',
    'some-packet/graph-metadata.json': { skill_id: 'nested-id-packet' },
  });
  const result = gate.checkRoot(path.join(skillsDir, 'nested-id'));
  assert.ok(codesOf(result).includes('NESTED_IDENTITY'));
}

function testGateIgnoresSameNamedContinuityMetadata() {
  // The spec tree uses these filenames for a wholly separate continuity schema.
  // A nested file lacking every skill-shaped key is a neighbour, not a rival.
  const skillsDir = makeTmpSkillsDir();
  makeRoot(skillsDir, 'continuity-neighbour', {
    'graph-metadata.json': { skill_id: 'continuity-neighbour' },
    'leaf-manifest.config.json': { workflowMode: 'continuity-neighbour' },
    'references/a.md': '# a\n',
    'notes/graph-metadata.json': { packet: 'something', status: 'Planned', children_ids: [] },
  });
  const result = gate.checkRoot(path.join(skillsDir, 'continuity-neighbour'));
  assert.ok(!codesOf(result).includes('NESTED_IDENTITY'));
}

function testGateRejectsUnknownGraphMetadataKey() {
  const skillsDir = makeTmpSkillsDir();
  const dir = makeRoot(skillsDir, 'unknown-graph-key', {
    'graph-metadata.json': { skill_id: 'unknown-graph-key', manual: { related_to: [] } },
    'leaf-manifest.config.json': { workflowMode: 'unknown-graph-key' },
    'references/a.md': '# a\n',
  });
  gate.checkRoot(dir, { fix: true });

  const result = gate.checkRoot(dir);
  assert.equal(result.status, 'fail');
  const violation = result.violations.find((v) => v.code === 'GRAPH_METADATA_UNKNOWN_KEY');
  assert.ok(violation);
  assert.match(violation.message, /manual/);
}

function testGateAllowsKnownGraphMetadataExtra() {
  const skillsDir = makeTmpSkillsDir();
  const dir = makeRoot(skillsDir, 'known-graph-extra', {
    'graph-metadata.json': { skill_id: 'known-graph-extra', importance_tier: 'important' },
    'leaf-manifest.config.json': { workflowMode: 'known-graph-extra' },
    'references/a.md': '# a\n',
  });

  const result = gate.checkRoot(dir, { fix: true });
  assert.equal(result.status, 'pass');
  assert.ok(!codesOf(result).includes('GRAPH_METADATA_UNKNOWN_KEY'));
}

function testGateDetectsStaleGeneratedManifest() {
  const skillsDir = makeTmpSkillsDir();
  const dir = makeRoot(skillsDir, 'stale-manifest', {
    'graph-metadata.json': { skill_id: 'stale-manifest' },
    'leaf-manifest.config.json': { workflowMode: 'stale-manifest' },
    'references/a.md': '# a\n',
  });
  // Write a manifest, then add a leaf so the committed bytes fall behind.
  gate.checkRoot(dir, { fix: true });
  fs.writeFileSync(path.join(dir, 'references', 'b.md'), '# b\n');

  const stale = gate.checkRoot(dir);
  const staleCodes = stale.violations.filter((v) => v.code === 'STALE_GENERATED_FILE').map((v) => v.file).sort();
  assert.deepEqual(staleCodes, ['leaf-aliases.json', 'leaf-manifest.json']);

  // --fix resolves both, and a second pass is clean, proving idempotence.
  const fixed = gate.checkRoot(dir, { fix: true });
  assert.deepEqual(fixed.violations, []);
  assert.deepEqual(fixed.written.sort(), ['leaf-aliases.json', 'leaf-manifest.json']);
  assert.deepEqual(gate.checkRoot(dir).violations, []);
}

function testFixNeverWritesAuthoredFiles() {
  const skillsDir = makeTmpSkillsDir();
  const dir = makeRoot(skillsDir, 'authored-only', {
    'graph-metadata.json': { skill_id: 'authored-only' },
    'references/a.md': '# a\n',
  });
  // No manifest config: the generator cannot run, and --fix must not invent one.
  const result = gate.checkRoot(dir, { fix: true });
  assert.equal(fs.existsSync(path.join(dir, 'leaf-manifest.config.json')), false);
  assert.ok(codesOf(result).includes('MISSING_REQUIRED_FILE'));
  assert.ok(codesOf(result).includes('MANIFEST_REGENERATION_FAILED'));
}

function testFixDoesNotTouchHubAliases() {
  const skillsDir = makeTmpSkillsDir();
  const authored = [{ workflowMode: 'm', leafResourceId: 'references/x.md', diskPath: 'shared/references/x.md' }];
  const dir = makeRoot(skillsDir, 'hub-aliases', {
    'graph-metadata.json': { skill_id: 'hub-aliases' },
    'description.json': { name: 'hub-aliases', description: 'd', version: '1.0.0', keywords: [] },
    'mode-registry.json': { modes: [{ workflowMode: 'm', packet: '.' }] },
    'hub-router.json': { skill: 'hub-aliases' },
    'leaf-aliases.json': authored,
    'references/x.md': '# x\n',
    'shared/references/x.md': '# shared x\n',
  });
  const before = fs.readFileSync(path.join(dir, 'leaf-aliases.json'));
  gate.checkRoot(dir, { fix: true });
  const after = fs.readFileSync(path.join(dir, 'leaf-aliases.json'));
  assert.equal(Buffer.compare(before, after), 0, 'hub aliases must survive --fix untouched');
}

function testAliasProjectionIsDeterministicAndSetPreserving() {
  const manifest = Buffer.from(`${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'only', packet: '.', leaves: ['assets/b.md', 'references/a.md'] }],
  }, null, 2)}\n`);
  const first = gate.buildAliasBytes(manifest);
  const second = gate.buildAliasBytes(manifest);
  assert.equal(Buffer.compare(first, second), 0);
  const rows = JSON.parse(first.toString('utf8'));
  assert.deepEqual(rows.map((r) => r.leafResourceId), ['assets/b.md', 'references/a.md']);
  assert.ok(rows.every((r) => r.leafResourceId === r.diskPath && r.workflowMode === 'only'));
}

function testGateRunExitsNonZeroOnViolations() {
  const skillsDir = makeTmpSkillsDir();
  makeRoot(skillsDir, 'broken', { 'mode-registry.json': { modes: [] } });
  const originalWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  let code;
  try {
    code = gate.run({ skillsDir, format: 'json', fix: false });
  } finally {
    process.stdout.write = originalWrite;
  }
  assert.equal(code, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. RUN
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 6b. COMMAND-METADATA CORE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const commandSchema = require('../lib/command-metadata-schema.cjs');

function validEntry(overrides) {
  return Object.assign({
    command: '/demo:run',
    ownerMode: 'demo-mode',
    description: 'Run the demo workflow.',
    argumentHint: '<target> [:auto]',
    userIntent: { job: 'I want to run the demo.', ownedSignals: ['run the demo'] },
    choreography: [
      { order: 1, skill: 'demo', resource: 'SKILL.md', action: 'load the hub' },
      { order: 2, skill: 'demo-mode', resource: 'demo-mode/SKILL.md', action: 'apply to $ARGUMENTS' },
    ],
  }, overrides);
}

function schemaCodes(entries, extra) {
  return commandSchema.validateCommandMetadata(entries, Object.assign({
    skillId: 'demo', registryModes: ['demo-mode'],
  }, extra)).map((v) => v.code).sort();
}

function testCommandSchemaAcceptsValidAndEmpty() {
  assert.deepEqual(schemaCodes([]), []);
  assert.deepEqual(schemaCodes([validEntry()]), []);
  // Unknown extension fields are deliberately legal — the design hub's richer
  // shape must keep validating without the core knowing its fields.
  assert.deepEqual(schemaCodes([validEntry({ registerPolicy: { accepted: ['brand'] } })]), []);
  // Choreography order is relative, not one-based: a step numbered 0 is legal.
  assert.deepEqual(schemaCodes([validEntry({
    choreography: [
      { order: 0, skill: 'demo', resource: 'SKILL.md', action: 'load' },
      { order: 1, skill: 'demo', resource: 'SKILL.md', action: 'apply' },
    ],
  })]), []);
}

function testCommandSchemaRejectsCoreViolations() {
  assert.deepEqual(schemaCodes('nope'), ['COMMAND_METADATA_NOT_ARRAY']);
  assert.deepEqual(schemaCodes([{}]).includes('MISSING_FIELD'), true);
  assert.deepEqual(schemaCodes([validEntry({ command: 'create:skill' })]), ['BAD_COMMAND_ID']);
  assert.deepEqual(schemaCodes([validEntry({ ownerMode: 'ghost' })]), ['UNKNOWN_OWNER_MODE']);
  assert.deepEqual(schemaCodes([validEntry(), validEntry()]).includes('DUPLICATE_COMMAND'), true);
  const clash = [
    validEntry(),
    validEntry({ command: '/demo:other', userIntent: { job: 'other job here', ownedSignals: ['Run The Demo'] } }),
  ];
  assert.ok(schemaCodes(clash).includes('DUPLICATE_OWNED_SIGNAL'), 'signal dedup must be case-insensitive');
  assert.deepEqual(schemaCodes([validEntry({ userIntent: { job: 'j', ownedSignals: [] } })]), ['BAD_USER_INTENT']);
  assert.deepEqual(schemaCodes([validEntry({ choreography: [] })]), ['BAD_CHOREOGRAPHY']);
  assert.deepEqual(schemaCodes([validEntry({
    choreography: [
      { order: 2, skill: 'demo', resource: 'SKILL.md', action: 'load' },
      { order: 1, skill: 'demo', resource: 'SKILL.md', action: 'apply' },
    ],
  })]), ['CHOREOGRAPHY_ORDER']);
}

function testCommandSchemaUsesInjectedProbes() {
  const missingResource = commandSchema.validateCommandMetadata([validEntry()], {
    skillId: 'demo', registryModes: ['demo-mode'], resourceExists: () => false,
  });
  assert.ok(missingResource.some((v) => v.code === 'CHOREOGRAPHY_RESOURCE_MISSING'));
  const missingCommand = commandSchema.validateCommandMetadata([validEntry()], {
    skillId: 'demo', registryModes: ['demo-mode'], commandExists: () => false,
  });
  assert.ok(missingCommand.some((v) => v.code === 'COMMAND_FILE_MISSING'));
  assert.equal(commandSchema.commandDefinitionRelPath('/create:skill'), 'create/skill.md');
  assert.equal(commandSchema.commandDefinitionRelPath('/doctor'), 'doctor.md');
}

function testCommandSchemaRejectsWithinEntryDuplicateSignal() {
  // A command listing the same signal twice is dead weight, not cross-command
  // ambiguity — it must be flagged under its own code, not silently accepted.
  const codes = schemaCodes([validEntry({
    userIntent: { job: 'I want to run the demo.', ownedSignals: ['run the demo', 'Run The Demo'] },
  })]);
  assert.deepEqual(codes, ['DUPLICATE_OWNED_SIGNAL_WITHIN_ENTRY']);
}

function testGateRejectsNonDirectorySkillsDir() {
  // A regular file passed as --skills-dir used to be swallowed into a
  // false-green zero-root pass; it must now exit 2 ("cannot run").
  const skillsDir = makeTmpSkillsDir();
  const filePath = path.join(skillsDir, 'not-a-dir');
  fs.writeFileSync(filePath, 'x');
  const originalWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = () => true;
  let code;
  try {
    code = gate.run({ skillsDir: filePath, format: 'json', fix: false });
  } finally {
    process.stderr.write = originalWrite;
  }
  assert.equal(code, 2);
}

try {
  testDiscriminatorDecidesClass();
  testClassificationIgnoresGeneratedOutput();
  testPresenceAcceptsIterableOrMap();
  testHubRequiresItsFullSet();
  testStandaloneRequiresItsFullSet();
  testForbiddenFilesAreRejectedPerClass();
  testCommandMetadataIsUniformAcrossHubs();
  testGeneratedIsClassSensitive();
  testLegalFilesForClass();
  testFleetDiscoveryUsesTheAuthoredMarker();
  testEveryFleetRootConformsToItsExpectedClass();
  testFleetAliasProjectionsAreIdentityForStandaloneRoots();
  testHubAliasesStayAuthored();
  testGateFlagsUnclassifiableRoot();
  testGateDetectsNestedIdentity();
  testGateIgnoresSameNamedContinuityMetadata();
  testGateRejectsUnknownGraphMetadataKey();
  testGateAllowsKnownGraphMetadataExtra();
  testGateDetectsStaleGeneratedManifest();
  testFixNeverWritesAuthoredFiles();
  testFixDoesNotTouchHubAliases();
  testAliasProjectionIsDeterministicAndSetPreserving();
  testGateRunExitsNonZeroOnViolations();
  testCommandSchemaAcceptsValidAndEmpty();
  testCommandSchemaRejectsCoreViolations();
  testCommandSchemaUsesInjectedProbes();
  testCommandSchemaRejectsWithinEntryDuplicateSignal();
  testGateRejectsNonDirectorySkillsDir();
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('[sk-doc] skill-root-metadata contract + fleet gate coverage passed');
