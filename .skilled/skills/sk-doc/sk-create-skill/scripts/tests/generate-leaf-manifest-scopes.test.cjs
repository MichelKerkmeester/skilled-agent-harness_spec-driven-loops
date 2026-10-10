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
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const GENERATOR = path.join(__dirname, '..', 'generate-leaf-manifest.cjs');
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
// 6. LOCAL TOOL CACHES
// ─────────────────────────────────────────────────────────────────────────────

// A tool cache such as .pytest_cache is ignored by git and exists only on the
// machine that ran the tool, so it must never shift a manifest. A dot-named
// file is still an authored leaf, which is why the .gitkeep stays listed.
function testDotNamedDirectoryDoesNotChangeManifest() {
  const skillDir = makeTmpDir('dot-dir');
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'mode-a', packet: 'packet-a' }],
  }, null, 2)}\n`);
  writeFile(skillDir, 'packet-a/references/a.md', '# a\n');
  writeFile(skillDir, 'packet-a/references/.gitkeep', '');
  const withoutCache = generator.buildManifestBytes(skillDir);

  writeFile(skillDir, 'packet-a/references/.pytest_cache/CACHEDIR.TAG', 'Signature: 8a477f597d28d172789f06886806bc55\n');
  writeFile(skillDir, 'packet-a/references/.pytest_cache/v/cache/nodeids', '[]\n');
  assert.equal(Buffer.compare(generator.buildManifestBytes(skillDir), withoutCache), 0);

  const leaves = JSON.parse(withoutCache.toString('utf8')).modes[0].leaves;
  assert.deepEqual(leaves, ['references/.gitkeep', 'references/a.md']);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. STARTING-ROOT CONTAINMENT
// ─────────────────────────────────────────────────────────────────────────────

// A link entry found inside a walk is resolved and must stay inside the skill.
// The starting root and every declared scope are read before any entry is
// checked, so a link at that position needs the same containment; otherwise an
// outside directory is enumerated as if it belonged to the skill.
function makeOutsideTarget(label) {
  const outside = makeTmpDir(label);
  writeFile(outside, 'secret.md', '# outside\n');
  return outside;
}

function testLinkedDefaultRootOutsideSkillFails() {
  const skillDir = makeTmpDir('root-outside');
  const outside = makeOutsideTarget('root-outside-target');
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'mode-a', packet: 'packet-a' }],
  }, null, 2)}\n`);
  writeFile(skillDir, 'packet-a/assets/keep.md', '# keep\n');
  fs.symlinkSync(outside, path.join(skillDir, 'packet-a', 'references'), 'dir');
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'LEAF_SYMLINK_OUT_OF_ROOT' && /packet-a\/references/.test(error.message),
  );
}

// The fixture has one mode, so its declared scope is the only path to the link.
// A second, unscoped mode would walk the link as a nested entry and be refused
// by that older check, which would hide whether the scope itself is contained.
function makeSingleModeHub(label) {
  const skillDir = makeTmpDir(label);
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'mode-a', packet: 'packet-a' }],
  }, null, 2)}\n`);
  writeFile(skillDir, 'packet-a/references/a.md', '# a\n');
  return skillDir;
}

function testLinkedDeclaredScopeOutsideSkillFails() {
  const skillDir = makeSingleModeHub('scope-outside');
  const outside = makeOutsideTarget('scope-outside-target');
  fs.symlinkSync(outside, path.join(skillDir, 'packet-a', 'references', 'ext'), 'dir');
  writeScopes(skillDir, [{ workflowMode: 'mode-a', leafScopes: ['references/ext'] }]);
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'LEAF_SYMLINK_OUT_OF_ROOT' && /references\/ext/.test(error.message),
  );
}

function testLinkedFileScopeOutsideSkillFails() {
  const skillDir = makeSingleModeHub('file-scope-outside');
  const outside = makeOutsideTarget('file-scope-outside-target');
  fs.symlinkSync(path.join(outside, 'secret.md'), path.join(skillDir, 'packet-a', 'references', 'linked.md'));
  writeScopes(skillDir, [{ workflowMode: 'mode-a', leafScopes: ['references/linked.md'] }]);
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'LEAF_SYMLINK_OUT_OF_ROOT' && /linked\.md/.test(error.message),
  );
}

// The packet folder itself can be the link. Its starting root then resolves outside
// the skill through the packet, so the containment check must follow every component,
// not only the last one. The generate path and the check path both refuse it.
function testLinkedPacketFolderOutsideSkillFails() {
  const skillDir = makeTmpDir('packet-link');
  const outsidePacket = makeTmpDir('packet-link-target');
  writeFile(outsidePacket, 'references/secret.md', '# outside\n');
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'mode-a', packet: 'packet-a' }],
  }, null, 2)}\n`);
  fs.symlinkSync(outsidePacket, path.join(skillDir, 'packet-a'), 'dir');
  assert.throws(
    () => generator.buildManifestBytes(skillDir),
    (error) => error.code === 'LEAF_SYMLINK_OUT_OF_ROOT' && /packet-a\/references/.test(error.message),
  );

  writeFile(skillDir, 'leaf-manifest.json', '{}\n');
  const result = childProcess.spawnSync(process.execPath, [GENERATOR, '--check', skillDir], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /leaf root escapes the skill root/);
}

// The containment check refuses only links that leave the skill. A root that is
// a link to a directory inside the skill keeps walking as it always did.
function testLinkedRootInsideSkillStillWalks() {
  const skillDir = makeTmpDir('root-inside');
  writeFile(skillDir, 'mode-registry.json', `${JSON.stringify({
    resourceContractVersion: 1,
    modes: [{ workflowMode: 'mode-a', packet: 'packet-a' }],
  }, null, 2)}\n`);
  writeFile(skillDir, 'packet-a/shared-real/x.md', '# x\n');
  fs.symlinkSync(path.join(skillDir, 'packet-a', 'shared-real'), path.join(skillDir, 'packet-a', 'references'), 'dir');
  assert.deepEqual(readManifest(skillDir).modes[0].leaves, ['references/x.md']);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MANIFEST WRITE
// ─────────────────────────────────────────────────────────────────────────────

// A manifest that is a link names a file the skill does not own. The write refuses
// it, so the file behind the link keeps its bytes and the link stays a link.
function testLinkedManifestWriteIsRefused() {
  const skillDir = makeSingleModeHub('manifest-link');
  const outsideFile = path.join(makeOutsideTarget('manifest-link-target'), 'secret.md');
  const before = fs.readFileSync(outsideFile, 'utf8');
  const manifest = path.join(skillDir, 'leaf-manifest.json');
  fs.symlinkSync(outsideFile, manifest);
  assert.throws(
    () => generator.runWrite(skillDir),
    (error) => /symbolic link, not followed/.test(error.message),
  );
  assert.equal(fs.readFileSync(outsideFile, 'utf8'), before);
  assert.equal(fs.lstatSync(manifest).isSymbolicLink(), true);
}

// The command line reports the same refusal through a non-zero exit.
function testLinkedManifestWriteExitsNonZero() {
  const skillDir = makeSingleModeHub('manifest-link-cli');
  const outsideFile = path.join(makeOutsideTarget('manifest-link-cli-target'), 'secret.md');
  const before = fs.readFileSync(outsideFile, 'utf8');
  fs.symlinkSync(outsideFile, path.join(skillDir, 'leaf-manifest.json'));
  const result = childProcess.spawnSync(process.execPath, [GENERATOR, '--write', skillDir], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link, not followed/);
  assert.equal(fs.readFileSync(outsideFile, 'utf8'), before);
}

// A dangling manifest link is refused before anything is built, and the missing file it
// names is not created by the refusal.
function testDanglingManifestWriteIsRefused() {
  const skillDir = makeSingleModeHub('manifest-dangling');
  const missing = path.join(makeTmpDir('manifest-dangling-target'), 'secret.md');
  const manifest = path.join(skillDir, 'leaf-manifest.json');
  fs.symlinkSync(missing, manifest);
  assert.throws(
    () => generator.runWrite(skillDir),
    (error) => /symbolic link, not followed/.test(error.message),
  );
  assert.equal(fs.existsSync(missing), false);
  assert.equal(fs.lstatSync(manifest).isSymbolicLink(), true);
}

// A committed manifest that already matches its regeneration passes --check with exit 0
// and leaves its bytes alone, so a gate run over an unchanged skill changes nothing.
function testCheckOnUnchangedSkillIsNoOp() {
  const skillDir = makeSingleModeHub('check-unchanged');
  const manifest = path.join(skillDir, 'leaf-manifest.json');
  fs.writeFileSync(manifest, generator.buildManifestBytes(skillDir));
  const before = fs.readFileSync(manifest);
  const result = childProcess.spawnSync(process.execPath, [GENERATOR, '--check', skillDir], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /leaf-manifest\.json OK/);
  assert.equal(Buffer.compare(fs.readFileSync(manifest), before), 0);
}

// A committed manifest that no longer matches its packet fails --check with exit 1 and
// names the staleness, and the check leaves the committed bytes alone.
function testCheckOnStaleManifestFails() {
  const skillDir = makeSingleModeHub('check-stale');
  const manifest = path.join(skillDir, 'leaf-manifest.json');
  fs.writeFileSync(manifest, generator.buildManifestBytes(skillDir));
  writeFile(skillDir, 'packet-a/references/b.md', '# b\n');
  const before = fs.readFileSync(manifest);
  const result = childProcess.spawnSync(process.execPath, [GENERATOR, '--check', skillDir], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stdout);
  assert.match(result.stderr, /leaf-manifest\.json is stale/);
  assert.equal(Buffer.compare(fs.readFileSync(manifest), before), 0);
}

// The link check runs before the manifest is built, so a link that appears while the
// build reads the registry is not seen by it. The write must still leave the file behind
// that link alone: the temporary file is renamed over the path, which replaces the link
// itself instead of writing through it.
function testManifestSwappedToLinkDuringBuildKeepsOutsideFile() {
  const skillDir = makeSingleModeHub('manifest-swap');
  const outsideFile = path.join(makeOutsideTarget('manifest-swap-target'), 'secret.md');
  const before = fs.readFileSync(outsideFile, 'utf8');
  const manifest = path.join(skillDir, 'leaf-manifest.json');
  const registry = path.join(skillDir, 'mode-registry.json');
  const realReadFileSync = fs.readFileSync;
  let swapped = false;
  fs.readFileSync = function readThenSwap(file, ...rest) {
    const text = realReadFileSync.call(this, file, ...rest);
    if (!swapped && path.resolve(String(file)) === registry) {
      swapped = true;
      fs.symlinkSync(outsideFile, manifest);
    }
    return text;
  };
  try {
    generator.runWrite(skillDir);
  } finally {
    fs.readFileSync = realReadFileSync;
  }
  assert.equal(swapped, true);
  assert.equal(fs.readFileSync(outsideFile, 'utf8'), before);
  assert.equal(fs.lstatSync(manifest).isSymbolicLink(), false);
  assert.deepEqual(fs.readdirSync(skillDir).filter((name) => name.endsWith('.tmp')), []);
  assert.ok(fs.readFileSync(manifest).equals(generator.buildManifestBytes(skillDir)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. RUN
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
  testDotNamedDirectoryDoesNotChangeManifest();
  testLinkedDefaultRootOutsideSkillFails();
  testLinkedDeclaredScopeOutsideSkillFails();
  testLinkedFileScopeOutsideSkillFails();
  testLinkedPacketFolderOutsideSkillFails();
  testLinkedRootInsideSkillStillWalks();
  testLinkedManifestWriteIsRefused();
  testLinkedManifestWriteExitsNonZero();
  testDanglingManifestWriteIsRefused();
  testCheckOnUnchangedSkillIsNoOp();
  testCheckOnStaleManifestFails();
  testManifestSwappedToLinkDuringBuildKeepsOutsideFile();
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('[sk-doc] leaf-manifest scope contract coverage passed');
