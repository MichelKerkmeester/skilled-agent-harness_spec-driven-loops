#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: CANONICAL COMPILED-ROUTE MANIFEST                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { after, before, describe, test } = require('node:test');

const manifestContract = require('../lib/compiled-route-manifest.cjs');
const status = require('../compiled-route-status.cjs');
const sync = require('../compiled-route-sync.cjs');
const resolver = require('../lib/compiled-routing/011-runtime-engine/lib/resolve.cjs');
const engine = require('../lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CLI_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-manifest.cjs');
const ROUTE_CLI_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route.cjs');
const SYNC_PATH = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-sync.cjs');
const SOURCE_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-code');
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-manifest-'));
const PRIMARY_HUB = `manifest-test-${process.pid}`;
const RACE_HUB = `manifest-race-${process.pid}`;
const FIXED_HUBS = Object.keys(engine.HUB_CHILD).sort();
const ROUTER_INPUTS = ['SKILL.md', 'mode-registry.json', 'hub-router.json'];
const GENERATED_HUBS = new Set([PRIMARY_HUB, RACE_HUB]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function manifestDirectory(hubId) {
  return path.dirname(manifestContract.canonicalManifestPath({ hubId }).absolutePath);
}

function removeManifestDirectory(hubId) {
  fs.rmSync(manifestDirectory(hubId), { recursive: true, force: true });
}

function createParentFixture(hubId, options = {}) {
  GENERATED_HUBS.add(hubId);
  const fixtureRoot = path.join(TEMP_ROOT, hubId);
  fs.mkdirSync(fixtureRoot, { recursive: true });
  const skillSource = fs.readFileSync(path.join(SOURCE_ROOT, 'SKILL.md'), 'utf8');
  const skillMarkdown = options.compilerInvalid
    ? '# Parent hub without a fallback checklist\n'
    : skillSource.replace(/^name:\s*sk-code$/m, `name: ${hubId}`);
  const registry = JSON.parse(fs.readFileSync(path.join(SOURCE_ROOT, 'mode-registry.json'), 'utf8'));
  const hubRouter = JSON.parse(fs.readFileSync(path.join(SOURCE_ROOT, 'hub-router.json'), 'utf8'));
  registry.skill = options.registrySkill || hubId;
  hubRouter.skill = options.routerSkill || hubId;
  fs.writeFileSync(path.join(fixtureRoot, 'SKILL.md'), skillMarkdown);
  fs.writeFileSync(path.join(fixtureRoot, 'mode-registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
  fs.writeFileSync(path.join(fixtureRoot, 'hub-router.json'), `${JSON.stringify(hubRouter, null, 2)}\n`);
  return fixtureRoot;
}

function runManifestCli(args) {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return {
    ...result,
    json: result.stdout.trim() ? JSON.parse(result.stdout) : null,
  };
}

function runManifestCliAsync(args) {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [CLI_PATH, ...args], {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => {
      resolvePromise({ code, stdout, stderr, json: JSON.parse(stdout) });
    });
  });
}

function routeSentinel(hubId) {
  const result = spawnSync(
    process.execPath,
    [ROUTE_CLI_PATH, '--hub', hubId, '--prompt', 'quality review of the code'],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: { ...process.env, SPECKIT_COMPILED_ROUTING: '1' },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function validManifestBytes(hash = 'a'.repeat(64)) {
  return Buffer.from(`${JSON.stringify({
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: hash, generation: 1 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  })}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('canonical compiled-route manifest', { concurrency: false }, () => {
  let primaryRoot;
  let originalInputs;
  let originalManifestBytes;
  let preMintSentinel;

  before(() => {
    primaryRoot = createParentFixture(PRIMARY_HUB);
    originalInputs = Object.fromEntries(ROUTER_INPUTS.map((name) => [
      name,
      fs.readFileSync(path.join(primaryRoot, name)),
    ]));
    removeManifestDirectory(PRIMARY_HUB);
    removeManifestDirectory(RACE_HUB);
    preMintSentinel = routeSentinel(PRIMARY_HUB);
  });

  after(() => {
    for (const hubId of GENERATED_HUBS) removeManifestDirectory(hubId);
    fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
    delete process.env.SPECKIT_COMPILED_ROUTING;
  });

  test('rejects unsafe identities and reports a missing safe manifest', () => {
    for (const hubId of ['../escape', '/absolute', 'Upper-Case', 'two--hyphens', '.']) {
      assert.throws(
        () => manifestContract.canonicalManifestPath({ hubId }),
        /unsafe-path/,
      );
    }
    const missing = manifestContract.checkCanonicalManifestFreshness({
      hubId: PRIMARY_HUB,
      skillRoot: primaryRoot,
    });
    assert.equal(missing.causeCode, 'missing-manifest');
    assert.equal(missing.manifestValid, false);
    assert.equal(missing.fresh, false);
  });

  test('fails closed on root, registry, source-link, and compiler errors', () => {
    const wrongRootHub = `wrong-root-${process.pid}`;
    GENERATED_HUBS.add(wrongRootHub);
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: wrongRootHub,
      skillRoot: primaryRoot,
    }).causeCode, 'hub-mismatch');

    const mismatchHub = `manifest-mismatch-${process.pid}`;
    const mismatchRoot = createParentFixture(mismatchHub, { registrySkill: 'different-hub' });
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: mismatchHub,
      skillRoot: mismatchRoot,
    }).causeCode, 'hub-mismatch');

    const routerMismatchHub = `router-mismatch-${process.pid}`;
    const routerMismatchRoot = createParentFixture(routerMismatchHub, {
      routerSkill: 'different-hub',
    });
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: routerMismatchHub,
      skillRoot: routerMismatchRoot,
    }).causeCode, 'hub-mismatch');

    const missingInputHub = `missing-input-${process.pid}`;
    const missingInputRoot = createParentFixture(missingInputHub);
    fs.rmSync(path.join(missingInputRoot, 'hub-router.json'));
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: missingInputHub,
      skillRoot: missingInputRoot,
    }).causeCode, 'invalid-input');

    const malformedInputHub = `malformed-input-${process.pid}`;
    const malformedInputRoot = createParentFixture(malformedInputHub);
    fs.writeFileSync(path.join(malformedInputRoot, 'mode-registry.json'), '{broken');
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: malformedInputHub,
      skillRoot: malformedInputRoot,
    }).causeCode, 'invalid-input');

    const linkedHub = `manifest-linked-${process.pid}`;
    const linkedRoot = createParentFixture(linkedHub);
    fs.rmSync(path.join(linkedRoot, 'SKILL.md'));
    fs.symlinkSync(path.join(SOURCE_ROOT, 'SKILL.md'), path.join(linkedRoot, 'SKILL.md'));
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: linkedHub,
      skillRoot: linkedRoot,
    }).causeCode, 'unsafe-path');

    const rootLinkHub = `manifest-root-link-${process.pid}`;
    GENERATED_HUBS.add(rootLinkHub);
    const rootLink = path.join(TEMP_ROOT, 'links', rootLinkHub);
    fs.mkdirSync(path.dirname(rootLink), { recursive: true });
    fs.symlinkSync(primaryRoot, rootLink, 'dir');
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: rootLinkHub,
      skillRoot: rootLink,
    }).causeCode, 'unsafe-path');

    const compilerHub = `manifest-compiler-${process.pid}`;
    const compilerRoot = createParentFixture(compilerHub, { compilerInvalid: true });
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: compilerHub,
      skillRoot: compilerRoot,
    }).causeCode, 'compile-error');

    const activationLinkHub = `manifest-activation-link-${process.pid}`;
    const activationLinkRoot = createParentFixture(activationLinkHub);
    const activationLinkTarget = path.join(TEMP_ROOT, 'activation-link-target');
    fs.mkdirSync(activationLinkTarget);
    fs.symlinkSync(activationLinkTarget, manifestDirectory(activationLinkHub), 'dir');
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: activationLinkHub,
      skillRoot: activationLinkRoot,
    }).causeCode, 'unsafe-path');
    removeManifestDirectory(activationLinkHub);

    const traversalHub = `manifest-traversal-${process.pid}`;
    const traversalRoot = createParentFixture(traversalHub);
    assert.equal(manifestContract.mintCanonicalManifest({
      hubId: traversalHub,
      skillRoot: `${traversalRoot}/../${traversalHub}`,
    }).causeCode, 'unsafe-path');
  });

  test('mints one inert generation-one manifest through the CLI', () => {
    const result = runManifestCli([
      'mint', '--hub', PRIMARY_HUB, '--skill-root', primaryRoot,
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      {
        created: result.json.created,
        manifestValid: result.json.manifestValid,
        fresh: result.json.fresh,
        causeCode: result.json.causeCode,
      },
      { created: true, manifestValid: true, fresh: true, causeCode: 'fresh' },
    );
    assert.equal(path.isAbsolute(result.json.manifestPath), false);
    assert.equal(result.stdout.includes(TEMP_ROOT), false);
    const manifestPath = manifestContract.canonicalManifestPath({ hubId: PRIMARY_HUB });
    originalManifestBytes = fs.readFileSync(manifestPath.absolutePath);
    const manifest = JSON.parse(originalManifestBytes);
    assert.deepEqual(Object.keys(manifest).sort(), [
      'schemaVersion', 'selectedPolicy', 'servingAuthority', 'shadowOnly',
    ]);
    assert.equal(manifest.schemaVersion, 'V1');
    assert.equal(manifest.selectedPolicy.generation, 1);
    assert.equal(manifest.servingAuthority, 'legacy');
    assert.equal(manifest.shadowOnly, true);
    assert.match(manifest.selectedPolicy.effectivePolicyHash, /^[a-f0-9]{64}$/);
  });

  test('keeps routing byte-identical across mint and rejects duplicate mint', () => {
    assert.equal(routeSentinel(PRIMARY_HUB), preMintSentinel);
    assert.equal(preMintSentinel, `${JSON.stringify({
      servingAuthority: 'legacy',
      hubId: PRIMARY_HUB,
    })}\n`);
    const duplicate = runManifestCli([
      'mint', '--hub', PRIMARY_HUB, '--skill-root', primaryRoot,
    ]);
    assert.equal(duplicate.status, 1);
    assert.equal(duplicate.json.causeCode, 'already-exists');
    assert.equal(duplicate.json.created, false);
    assert.deepEqual(
      fs.readFileSync(manifestContract.canonicalManifestPath({ hubId: PRIMARY_HUB }).absolutePath),
      originalManifestBytes,
    );
  });

  test('returns fresh in compact and pretty form, then detects all input drift axes', () => {
    const compact = runManifestCli([
      'freshness', '--hub', PRIMARY_HUB, '--skill-root', primaryRoot,
    ]);
    const pretty = runManifestCli([
      'freshness', '--hub', PRIMARY_HUB, '--skill-root', primaryRoot, '--pretty',
    ]);
    assert.equal(compact.status, 0);
    assert.equal(pretty.status, 0);
    assert.deepEqual(pretty.json, compact.json);
    assert.equal(compact.json.causeCode, 'fresh');
    const pythonConsumer = spawnSync(
      'python3',
      ['-c', 'import json,sys; value=json.load(sys.stdin); assert value["fresh"] is True'],
      { input: compact.stdout, encoding: 'utf8' },
    );
    assert.equal(pythonConsumer.status, 0, pythonConsumer.stderr);

    const alternateRoot = path.join(TEMP_ROOT, 'alternate', PRIMARY_HUB);
    fs.mkdirSync(alternateRoot, { recursive: true });
    for (const fileName of ROUTER_INPUTS) {
      fs.writeFileSync(path.join(alternateRoot, fileName), originalInputs[fileName]);
    }
    const alternate = manifestContract.checkCanonicalManifestFreshness({
      hubId: PRIMARY_HUB,
      skillRoot: alternateRoot,
    });
    assert.equal(alternate.causeCode, 'fresh');
    assert.equal(alternate.currentPolicyHash, compact.json.currentPolicyHash);

    for (const fileName of ROUTER_INPUTS) {
      const inputPath = path.join(primaryRoot, fileName);
      fs.writeFileSync(inputPath, Buffer.concat([originalInputs[fileName], Buffer.from('\n')]));
      const drifted = runManifestCli([
        'freshness', '--hub', PRIMARY_HUB, '--skill-root', primaryRoot,
      ]);
      assert.equal(drifted.status, 1, fileName);
      assert.equal(drifted.json.causeCode, 'stale-manifest', fileName);
      assert.equal(drifted.json.manifestValid, true, fileName);
      fs.writeFileSync(inputPath, originalInputs[fileName]);
    }
  });

  test('reports malformed manifests without compiling or rewriting them', () => {
    const malformedHub = `manifest-malformed-${process.pid}`;
    const malformedRoot = createParentFixture(malformedHub);
    const manifestPath = manifestContract.canonicalManifestPath({ hubId: malformedHub }).absolutePath;
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, '{broken');
    const beforeBytes = fs.readFileSync(manifestPath);
    const result = manifestContract.checkCanonicalManifestFreshness({
      hubId: malformedHub,
      skillRoot: malformedRoot,
    });
    assert.equal(result.causeCode, 'invalid-manifest');
    assert.equal(result.manifestValid, false);
    assert.deepEqual(fs.readFileSync(manifestPath), beforeBytes);
    removeManifestDirectory(malformedHub);
  });

  test('keeps serving cause separate from manifest freshness in status', () => {
    delete process.env.SPECKIT_COMPILED_ROUTING;
    const record = status.computeHubStatus(PRIMARY_HUB, { skillRoot: primaryRoot });
    assert.equal(record.servingAuthority, 'legacy');
    assert.equal(record.causeCode, 'legacy-authority');
    assert.deepEqual(record.manifestFreshness, {
      manifestValid: true,
      fresh: true,
      causeCode: 'fresh',
      currentPolicyHash: record.effectivePolicyHash,
    });
    assert.equal(status.knownHubs().includes(PRIMARY_HUB), true);

    fs.writeFileSync(
      path.join(primaryRoot, 'SKILL.md'),
      Buffer.concat([originalInputs['SKILL.md'], Buffer.from('\n')]),
    );
    const stale = status.computeHubStatus(PRIMARY_HUB, { skillRoot: primaryRoot });
    assert.equal(stale.causeCode, 'legacy-authority');
    assert.equal(stale.manifestFreshness.causeCode, 'stale-manifest');
    fs.writeFileSync(path.join(primaryRoot, 'SKILL.md'), originalInputs['SKILL.md']);
  });

  test('preserves the external manifest across the sync capture/restore round trip', () => {
    const canonicalPath = manifestContract.canonicalManifestPath({
      hubId: PRIMARY_HUB,
    }).absolutePath;
    const beforeBytes = fs.readFileSync(canonicalPath);
    const roundTripRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'activation-round-trip-'));
    const fixturePath = path.join(roundTripRoot, PRIMARY_HUB, 'manifest.json');
    fs.mkdirSync(path.dirname(fixturePath));
    fs.writeFileSync(fixturePath, beforeBytes);
    const fixedManifestPath = path.join(roundTripRoot, 'sk-code', 'manifest.json');
    fs.mkdirSync(path.dirname(fixedManifestPath));
    fs.writeFileSync(fixedManifestPath, validManifestBytes());
    const captured = sync.captureExternalActivationManifests(roundTripRoot);
    assert.deepEqual(captured.map((entry) => entry.hubId), [PRIMARY_HUB]);
    fs.rmSync(roundTripRoot, { recursive: true, force: true });
    fs.mkdirSync(roundTripRoot);
    sync.restoreExternalActivationManifests(captured, roundTripRoot);
    assert.deepEqual(fs.readFileSync(fixturePath), beforeBytes);
    fs.rmSync(roundTripRoot, { recursive: true, force: true });
    assert.deepEqual(fs.readFileSync(canonicalPath), beforeBytes);
    assert.equal(fs.existsSync(CLI_PATH), true);

    const check = spawnSync(process.execPath, [SYNC_PATH, '--check'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.equal(check.status, 0, check.stderr);
    assert.match(check.stdout, /all 7 hubs resolve/);
    const verify = spawnSync(process.execPath, [SYNC_PATH, '--verify'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.equal(verify.status, 0, verify.stderr);
    assert.match(verify.stdout, /all 7 hubs resolve; 0 reads under \.opencode\/specs/);
  });

  test('fails sync capture and restore closed on invalid or conflicting entries', () => {
    const invalidRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'activation-invalid-'));
    const invalidHub = 'invalid-retained-hub';
    fs.mkdirSync(path.join(invalidRoot, invalidHub));
    fs.writeFileSync(path.join(invalidRoot, invalidHub, 'manifest.json'), '{broken');
    assert.throws(
      () => sync.captureExternalActivationManifests(invalidRoot),
      /sync-conflict/,
    );

    const conflictRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'activation-conflict-'));
    const conflictHub = 'conflicting-retained-hub';
    const conflictPath = path.join(conflictRoot, conflictHub, 'manifest.json');
    fs.mkdirSync(path.dirname(conflictPath));
    fs.writeFileSync(conflictPath, validManifestBytes('b'.repeat(64)));
    assert.throws(
      () => sync.restoreExternalActivationManifests([{
        hubId: conflictHub,
        manifestBytes: validManifestBytes('c'.repeat(64)),
        manifestFingerprint: 'unused',
      }], conflictRoot),
      /sync-conflict/,
    );
    const linkedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'activation-linked-'));
    const linkedHub = 'linked-retained-hub';
    const linkedPath = path.join(linkedRoot, linkedHub, 'manifest.json');
    const linkedTarget = path.join(TEMP_ROOT, 'linked-retained-manifest.json');
    fs.mkdirSync(path.dirname(linkedPath));
    fs.writeFileSync(linkedTarget, validManifestBytes());
    fs.symlinkSync(linkedTarget, linkedPath);
    assert.throws(
      () => sync.restoreExternalActivationManifests([{
        hubId: linkedHub,
        manifestBytes: validManifestBytes(),
        manifestFingerprint: 'unused',
      }], linkedRoot),
      /sync-conflict/,
    );
    fs.rmSync(invalidRoot, { recursive: true, force: true });
    fs.rmSync(conflictRoot, { recursive: true, force: true });
    fs.rmSync(linkedRoot, { recursive: true, force: true });
  });

  test('uses atomic create-if-absent under concurrent writers', async () => {
    const raceRoot = createParentFixture(RACE_HUB);
    removeManifestDirectory(RACE_HUB);
    const args = ['mint', '--hub', RACE_HUB, '--skill-root', raceRoot];
    const results = await Promise.all([
      runManifestCliAsync(args),
      runManifestCliAsync(args),
    ]);
    assert.deepEqual(results.map((result) => result.code).sort(), [0, 1]);
    assert.deepEqual(
      results.map((result) => result.json.causeCode).sort(),
      ['already-exists', 'fresh'],
    );
    assert.equal(results.find((result) => result.code === 0).json.created, true);
    assert.equal(results.find((result) => result.code === 1).json.created, false);
    removeManifestDirectory(RACE_HUB);
  });

  test('refuses an existing committed manifest before reading source inputs', () => {
    const manifestPath = manifestContract.canonicalManifestPath({ hubId: 'sk-code' }).absolutePath;
    const beforeBytes = fs.readFileSync(manifestPath);
    const result = manifestContract.mintCanonicalManifest({
      hubId: 'sk-code',
      skillRoot: path.join(TEMP_ROOT, 'does-not-exist'),
    });
    assert.equal(result.causeCode, 'already-exists');
    assert.equal(result.created, false);
    assert.deepEqual(fs.readFileSync(manifestPath), beforeBytes);
  });

  test('keeps fixed routing maps unchanged; default cohort now serves the 7 promoted hubs compiled', () => {
    delete process.env.SPECKIT_COMPILED_ROUTING;
    assert.equal(resolver.DEFAULT_ON_HUBS.size, 7);
    assert.equal(Object.prototype.hasOwnProperty.call(engine.HUB_CHILD, PRIMARY_HUB), false);
    assert.equal(resolver.resolveRoute(PRIMARY_HUB, 'quality review'), null);
    const records = status.computeAllStatus({ probeEngine: false });
    for (const hubId of FIXED_HUBS) {
      const record = records.find((candidate) => candidate.hubId === hubId);
      assert.ok(record, hubId);
      assert.equal(record.causeCode, 'compiled-serving', hubId);
      assert.equal(typeof record.manifestFreshness, 'object', hubId);
    }
  });

  test('refreshes a stale manifest to fresh through the CLI, bumping generation and preserving defaults', () => {
    const refreshHub = `manifest-refresh-${process.pid}`;
    const refreshRoot = createParentFixture(refreshHub);
    removeManifestDirectory(refreshHub);
    const minted = manifestContract.mintCanonicalManifest({ hubId: refreshHub, skillRoot: refreshRoot });
    assert.equal(minted.created, true, minted.causeCode);
    assert.equal(minted.selectedPolicy.generation, 1);

    const skillPath = path.join(refreshRoot, 'SKILL.md');
    const originalSkillMarkdown = fs.readFileSync(skillPath);
    fs.writeFileSync(skillPath, Buffer.concat([originalSkillMarkdown, Buffer.from('\n')]));
    const stale = manifestContract.checkCanonicalManifestFreshness({
      hubId: refreshHub,
      skillRoot: refreshRoot,
    });
    assert.equal(stale.causeCode, 'stale-manifest');
    assert.equal(stale.selectedPolicy.generation, 1);

    const refreshed = runManifestCli(['refresh', '--hub', refreshHub, '--skill-root', refreshRoot]);
    assert.equal(refreshed.status, 0, refreshed.stderr);
    assert.equal(refreshed.json.refreshed, true);
    assert.equal(refreshed.json.fresh, true);
    assert.equal(refreshed.json.causeCode, 'fresh');
    assert.equal(refreshed.json.selectedPolicy.generation, 2);
    assert.notEqual(
      refreshed.json.selectedPolicy.effectivePolicyHash,
      minted.selectedPolicy.effectivePolicyHash,
    );

    const manifestPath = manifestContract.canonicalManifestPath({ hubId: refreshHub }).absolutePath;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.servingAuthority, 'legacy');
    assert.equal(manifest.shadowOnly, true);
    assert.equal(manifest.selectedPolicy.generation, 2);

    // Restoring the pre-drift input now drifts the *refreshed* (post-drift)
    // manifest in turn, proving the new hash truly captured the drifted
    // content rather than reusing the generation-one hash under a new number.
    fs.writeFileSync(skillPath, originalSkillMarkdown);
    const afterRestore = manifestContract.checkCanonicalManifestFreshness({
      hubId: refreshHub,
      skillRoot: refreshRoot,
    });
    assert.equal(afterRestore.causeCode, 'stale-manifest');
  });

  test('a concurrent serving-authority flip during refresh is preserved, not reverted', () => {
    const raceHub = `manifest-refresh-race-${process.pid}`;
    const raceRoot = createParentFixture(raceHub);
    removeManifestDirectory(raceHub);
    const minted = manifestContract.mintCanonicalManifest({ hubId: raceHub, skillRoot: raceRoot });
    assert.equal(minted.created, true, minted.causeCode);
    assert.equal(minted.selectedPolicy.generation, 1);

    const manifestPath = manifestContract.canonicalManifestPath({ hubId: raceHub }).absolutePath;
    // Drift the source so the refresh genuinely recompiles to a new hash at gen 2.
    const skillPath = path.join(raceRoot, 'SKILL.md');
    fs.writeFileSync(skillPath, Buffer.concat([fs.readFileSync(skillPath), Buffer.from('\n')]));

    // Simulate a concurrent writer that flips servingAuthority legacy->compiled in
    // the window AFTER the refresh snapshots the manifest but BEFORE it writes: on
    // the first manifest read, hand back the pre-flip bytes, then flip the on-disk
    // file. A refresh that trusts its stale snapshot reverts the flip; a refresh
    // that re-reads serving state before writing preserves it.
    const realReadFileSync = fs.readFileSync;
    let manifestReads = 0;
    fs.readFileSync = function patchedReadFileSync(target, ...rest) {
      const bytes = realReadFileSync.call(fs, target, ...rest);
      const isManifest = typeof target === 'string'
        && path.resolve(target) === path.resolve(manifestPath);
      if (isManifest && manifestReads++ === 0) {
        const flipped = {
          ...JSON.parse(realReadFileSync.call(fs, manifestPath, 'utf8')),
          servingAuthority: 'compiled',
          shadowOnly: false,
        };
        fs.writeFileSync(manifestPath, Buffer.from(JSON.stringify(flipped)));
      }
      return bytes;
    };
    let refreshed;
    try {
      refreshed = manifestContract.refreshCanonicalManifest({ hubId: raceHub, skillRoot: raceRoot });
    } finally {
      fs.readFileSync = realReadFileSync;
    }
    assert.equal(refreshed.refreshed, true, refreshed.causeCode);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    // The concurrent flip must survive...
    assert.equal(manifest.servingAuthority, 'compiled');
    assert.equal(manifest.shadowOnly, false);
    // ...while the refresh still did its job (generation bumped, hash recompiled).
    assert.equal(manifest.selectedPolicy.generation, 2);
    assert.notEqual(
      manifest.selectedPolicy.effectivePolicyHash,
      minted.selectedPolicy.effectivePolicyHash,
    );
    removeManifestDirectory(raceHub);
  });

  test('refuses to refresh unsafe hub identities and a missing manifest without writing anything', () => {
    for (const hubId of ['../escape', '/absolute', 'Upper-Case', 'two--hyphens', '.']) {
      const result = manifestContract.refreshCanonicalManifest({ hubId, skillRoot: primaryRoot });
      assert.equal(result.causeCode, 'unsafe-path', hubId);
      assert.equal(result.refreshed, false, hubId);
      assert.equal(result.manifestValid, false, hubId);
      assert.equal(result.fresh, false, hubId);
    }

    const neverMintedHub = `manifest-refresh-missing-${process.pid}`;
    const neverMintedRoot = createParentFixture(neverMintedHub);
    removeManifestDirectory(neverMintedHub);
    const missing = manifestContract.refreshCanonicalManifest({
      hubId: neverMintedHub,
      skillRoot: neverMintedRoot,
    });
    assert.equal(missing.causeCode, 'missing-manifest');
    assert.equal(missing.refreshed, false);
    assert.equal(missing.manifestValid, false);
    assert.equal(
      fs.existsSync(manifestContract.canonicalManifestPath({ hubId: neverMintedHub }).absolutePath),
      false,
    );

    const cliMissing = runManifestCli([
      'refresh', '--hub', neverMintedHub, '--skill-root', neverMintedRoot,
    ]);
    assert.equal(cliMissing.status, 1);
    assert.equal(cliMissing.json.causeCode, 'missing-manifest');
    assert.equal(cliMissing.json.refreshed, false);
  });

  test('preserves a non-default shadowOnly value through refresh rather than hardcoding it', () => {
    const preserveHub = `manifest-refresh-preserve-${process.pid}`;
    const preserveRoot = createParentFixture(preserveHub);
    removeManifestDirectory(preserveHub);
    const manifestPath = manifestContract.canonicalManifestPath({ hubId: preserveHub }).absolutePath;
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, `${JSON.stringify({
      schemaVersion: 'V1',
      selectedPolicy: { effectivePolicyHash: 'a'.repeat(64), generation: 3 },
      servingAuthority: 'legacy',
      shadowOnly: false,
    })}\n`);

    const result = manifestContract.refreshCanonicalManifest({
      hubId: preserveHub,
      skillRoot: preserveRoot,
    });
    assert.equal(result.refreshed, true, result.causeCode);
    assert.equal(result.fresh, true, result.causeCode);
    assert.equal(result.selectedPolicy.generation, 4);
    assert.notEqual(result.selectedPolicy.effectivePolicyHash, 'a'.repeat(64));

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.servingAuthority, 'legacy');
    assert.equal(manifest.shadowOnly, false);
    assert.equal(manifest.selectedPolicy.generation, 4);
  });

  test('keeps the CLI thin, machine-readable, and usage-safe', () => {
    const usage = runManifestCli(['mint', '--hub', PRIMARY_HUB]);
    assert.equal(usage.status, 2);
    assert.equal(usage.stdout, '');
    assert.match(usage.stderr, /^usage:/);
    const source = fs.readFileSync(
      path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-route-manifest.cjs'),
      'utf8',
    );
    assert.match(source, /registry-compiler\.cjs/);
    assert.match(source, /compileRegistry\(\{/);
    assert.match(source, /checkCanonicalManifestFreshness\(\{ hubId, skillRoot \}\)/);
    assert.doesNotMatch(source, /computeEffectivePolicyHash/);
  });
});
