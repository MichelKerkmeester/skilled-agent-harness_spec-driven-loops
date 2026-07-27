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
const runtimeLayout = require('../lib/compiled-route-layout.cjs');
const promotedRuntimeRoot = path.join(__dirname, '..', 'lib', 'compiled-routing');
const runtimeEnginePath = runtimeLayout.enginePathFor(promotedRuntimeRoot);
if (!runtimeEnginePath) throw new Error('no coherent compiled-routing layout');
const runtimeEngineRoot = path.dirname(runtimeEnginePath);
const resolver = require(path.join(runtimeEngineRoot, 'resolve.cjs'));
const engine = require(path.join(runtimeEngineRoot, 'compiled-route.cjs'));

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

function buildFreshRuntime(runtimeRoot) {
  const first = sync.build({ runtimeRoot });
  assert.equal(first.rollbackRoot, null, 'fresh build has no prior closure');
  assert.match(
    sync.verifyRoot(runtimeRoot, { emit: false }).message,
    /all 7 hubs resolve; 0 reads under \.opencode\/specs/,
  );
}

function buildRetainedPublication(runtimeRoot) {
  buildFreshRuntime(runtimeRoot);
  const publication = sync.build({ runtimeRoot });
  assert.ok(publication.rollbackRoot, 'publication retained a rollback');
  return publication;
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
    const staleHubs = FIXED_HUBS.map((hubId) => status.computeHubStatus(hubId, { probeEngine: false }))
      .filter((record) => record.causeCode !== 'compiled-serving')
      .map((record) => record.hubId);
    assert.deepEqual(staleHubs, staleHubs.length === 0 ? [] : ['cli-external-orchestration']);
    assert.equal(verify.status, staleHubs.length === 0 ? 0 : 1, verify.stderr);
    assert.match(
      staleHubs.length === 0 ? verify.stdout : verify.stderr,
      staleHubs.length === 0
        ? /all 7 hubs resolve; 0 reads under \.opencode\/specs/
        : /cli-external-orchestration/,
    );
  });

  test('publishes the current authored topology atomically into an isolated runtime', () => {
    const sandbox = fs.mkdtempSync(path.join(
      path.dirname(sync.RUNTIME_ROOT),
      'compiled-route-sync-test-',
    ));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const sentinelPath = path.join(runtimeRoot, 'prior-serving-sentinel.txt');
    buildFreshRuntime(runtimeRoot);
    fs.writeFileSync(sentinelPath, 'prior-serving');
    try {
      assert.equal(fs.existsSync(sync.AUTHORED_RESOLVER), true);
      assert.match(sync.AUTHORED_RESOLVER, /015-router-unification-program\/014-runtime-engine\/lib\/resolve\.cjs$/);

      const { manifest, rollbackRoot } = sync.build({ runtimeRoot });
      assert.equal(
        manifest.generatedFrom,
        path.relative(REPO_ROOT, sync.IMPL_ROOT),
      );
      assert.equal(fs.existsSync(path.join(runtimeRoot, sync.CURRENT_LAYOUT.resolver)), true);
      assert.equal(fs.existsSync(path.join(runtimeRoot, '011-runtime-engine', 'lib', 'resolve.cjs')), false);
      assert.equal(fs.existsSync(sentinelPath), false);
      // The prior closure is retained as a rollback sibling until finalize.
      assert.ok(rollbackRoot && rollbackRoot.startsWith(runtimeRoot), 'rollback sibling path returned');
      assert.equal(fs.existsSync(rollbackRoot), true);
      const sandboxEntries = fs.readdirSync(sandbox).sort();
      assert.ok(sandboxEntries.includes('compiled-routing'), 'serving root present');
      assert.ok(sandboxEntries.some((e) => e.startsWith('compiled-routing.rollback-')), 'rollback sibling retained');
      assert.match(
        sync.verifyRoot(runtimeRoot, { emit: false }).message,
        /all 7 hubs resolve; 0 reads under \.opencode\/specs/,
      );
      // finalize removes the rollback sibling after reconciling external state.
      const finalized = sync.finalize(rollbackRoot, runtimeRoot);
      assert.equal(finalized.finalized, true);
      assert.equal(fs.existsSync(rollbackRoot), false);
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('leaves an existing runtime untouched when the authored source is unavailable', () => {
    const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-sync-source-failure-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const sentinelPath = path.join(runtimeRoot, 'prior-serving-sentinel.txt');
    fs.mkdirSync(runtimeRoot);
    fs.writeFileSync(sentinelPath, 'prior-serving');
    try {
      assert.throws(
        () => sync.build({ sourceRoot: path.join(sandbox, 'missing-source'), runtimeRoot }),
        /authored resolver missing/,
      );
      assert.equal(fs.readFileSync(sentinelPath, 'utf8'), 'prior-serving');
      assert.deepEqual(fs.readdirSync(sandbox), ['compiled-routing']);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('refuses to replace an existing root that is not a verified closure', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-invalid-prior-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const sentinelPath = path.join(runtimeRoot, 'prior-serving-sentinel.txt');
    fs.mkdirSync(runtimeRoot);
    fs.writeFileSync(sentinelPath, 'prior-serving');
    try {
      assert.throws(
        () => sync.build({ runtimeRoot }),
        /promoted resolver missing at no coherent layout/,
      );
      assert.equal(fs.readFileSync(sentinelPath, 'utf8'), 'prior-serving');
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('aborts at staging-verify failure without touching the serving root', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-staging-fail-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const sentinelPath = path.join(runtimeRoot, 'prior-serving-sentinel.txt');
    buildFreshRuntime(runtimeRoot);
    fs.writeFileSync(sentinelPath, 'prior-serving');
    try {
      assert.throws(
        () => sync.build({ runtimeRoot, _testFailVerify: 'staging' }),
        /test-only staging verify failure/,
      );
      // The prior serving root is byte-identical: nothing was renamed or deleted.
      assert.equal(fs.readFileSync(sentinelPath, 'utf8'), 'prior-serving');
      // No rollback sibling was created (publication never started).
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('restores the exact prior closure when post-publish verification fails', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-postpublish-fail-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const sentinelPath = path.join(runtimeRoot, 'prior-serving-sentinel.txt');
    const markerDir = path.join(runtimeRoot, 'prior-only-marker');
    buildFreshRuntime(runtimeRoot);
    fs.mkdirSync(markerDir);
    fs.writeFileSync(sentinelPath, 'prior-serving');
    try {
      assert.throws(
        () => sync.build({ runtimeRoot, _testFailVerify: 'post-publish' }),
        /test-only post-publish verify failure/,
      );
      // The prior closure is restored byte-identical: sentinel and marker survive.
      assert.equal(fs.readFileSync(sentinelPath, 'utf8'), 'prior-serving');
      assert.equal(fs.existsSync(markerDir), true);
      // The failed new root and the rollback sibling are both gone.
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('a concurrent external manifest created during publication survives finalize', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-concurrent-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    buildFreshRuntime(runtimeRoot);
    fs.writeFileSync(path.join(runtimeRoot, 'prior-serving-sentinel.txt'), 'prior-serving');
    const concurrentHub = `concurrent-external-${process.pid}`;
    try {
      const { rollbackRoot } = sync.build({ runtimeRoot });
      assert.ok(rollbackRoot, 'rollback retained');
      // Simulate a writer that created an inert external manifest in the OLD
      // (rollback) root's activation store after capture but before finalize.
      const rollbackActivation = runtimeLayout.activationRootFor(rollbackRoot);
      fs.mkdirSync(path.join(rollbackActivation, concurrentHub), { recursive: true });
      fs.writeFileSync(
        path.join(rollbackActivation, concurrentHub, 'manifest.json'),
        validManifestBytes('c'.repeat(64)),
      );
      const servingActivation = runtimeLayout.activationRootFor(runtimeRoot);
      assert.equal(fs.existsSync(path.join(servingActivation, concurrentHub, 'manifest.json')), false);
      const result = sync.finalize(rollbackRoot, runtimeRoot);
      assert.deepEqual(result.reconciled, [concurrentHub]);
      // The concurrent manifest was copied forward into the new serving root.
      const forwarded = fs.readFileSync(path.join(servingActivation, concurrentHub, 'manifest.json'));
      assert.equal(forwarded.toString(), validManifestBytes('c'.repeat(64)).toString());
      // The rollback sibling is gone.
      assert.equal(fs.existsSync(rollbackRoot), false);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('revert swaps the retained rollback back into the serving root', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-revert-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      // Build #1 establishes a real coherent prior closure. runtimeRoot does not
      // exist yet, so this build has no prior to roll back.
      const first = sync.build({ runtimeRoot });
      assert.equal(first.rollbackRoot, null, 'first build has no prior to roll back');
      const priorResolver = path.join(runtimeRoot, sync.CURRENT_LAYOUT.resolver);
      assert.equal(fs.existsSync(priorResolver), true);

      // Build #2 treats #1 as the prior closure and retains it as rollback.
      const { rollbackRoot } = sync.build({ runtimeRoot });
      assert.ok(rollbackRoot, 'second build retained rollback');
      // The rollback carries the #1 prior closure's resolver (a real closure).
      assert.equal(fs.existsSync(path.join(rollbackRoot, sync.CURRENT_LAYOUT.resolver)), true);

      // A failed post-publish gate triggers revert: rollback moves back into place.
      sync.revert(rollbackRoot, runtimeRoot);
      assert.equal(fs.existsSync(rollbackRoot), false);
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
      // The restored prior closure is a real coherent closure and still verifies.
      assert.match(
        sync.verifyRoot(runtimeRoot, { emit: false }).message,
        /all 7 hubs resolve; 0 reads under \.opencode\/specs/,
      );
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('rejects arbitrary, symlinked, and stale rollback paths without mutation', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-path-safety-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      const { rollbackRoot } = buildRetainedPublication(runtimeRoot);
      const arbitraryRoot = path.join(sandbox, 'unrelated-directory');
      fs.mkdirSync(arbitraryRoot);
      assert.throws(
        () => sync.finalize(arbitraryRoot, runtimeRoot),
        /rollback root name does not match/,
      );
      const linkedRoot = `${runtimeRoot}.rollback-999-998`;
      fs.symlinkSync(rollbackRoot, linkedRoot);
      assert.throws(
        () => sync.finalize(linkedRoot, runtimeRoot),
        /rollback root must be a real directory/,
      );
      fs.rmSync(linkedRoot);
      const staleRoot = `${runtimeRoot}.rollback-999-999`;
      fs.renameSync(rollbackRoot, staleRoot);
      assert.throws(
        () => sync.finalize(staleRoot, runtimeRoot),
        /not bound to the active publication/,
      );
      fs.renameSync(staleRoot, rollbackRoot);
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(rollbackRoot), true);
      sync.finalize(rollbackRoot, runtimeRoot);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('three-way reconciliation preserves a serving-only external update', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-serving-update-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const externalHub = `serving-update-${process.pid}`;
    try {
      buildFreshRuntime(runtimeRoot);
      const initialActivation = runtimeLayout.activationRootFor(runtimeRoot);
      const initialPath = path.join(initialActivation, externalHub, 'manifest.json');
      fs.mkdirSync(path.dirname(initialPath), { recursive: true });
      fs.writeFileSync(initialPath, validManifestBytes('a'.repeat(64)));
      const { rollbackRoot } = sync.build({ runtimeRoot });
      const servingPath = path.join(runtimeLayout.activationRootFor(runtimeRoot), externalHub, 'manifest.json');
      fs.writeFileSync(servingPath, validManifestBytes('b'.repeat(64)));
      const result = sync.finalize(rollbackRoot, runtimeRoot);
      assert.deepEqual(result.reconciled, []);
      assert.equal(fs.readFileSync(servingPath).toString(), validManifestBytes('b'.repeat(64)).toString());
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('failed finalize and revert verification retain both recoverable roots', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-verify-fail-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      let publication = buildRetainedPublication(runtimeRoot);
      assert.throws(
        () => sync.finalize(publication.rollbackRoot, runtimeRoot, { _testFailVerify: 'finalize' }),
        /test-only finalize verify failure/,
      );
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(publication.rollbackRoot), true);
      sync.finalize(publication.rollbackRoot, runtimeRoot);

      publication = sync.build({ runtimeRoot });
      assert.throws(
        () => sync.revert(publication.rollbackRoot, runtimeRoot, { _testFailVerify: 'revert-post' }),
        /test-only revert-post verify failure/,
      );
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(publication.rollbackRoot), true);
      sync.finalize(publication.rollbackRoot, runtimeRoot);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('closure fingerprints reject code-byte drift in the retained rollback', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-content-drift-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      const publication = buildRetainedPublication(runtimeRoot);
      const rollbackEngine = path.join(publication.rollbackRoot, runtimeLayout.CURRENT_LAYOUT.engine);
      const originalBytes = fs.readFileSync(rollbackEngine);
      fs.writeFileSync(rollbackEngine, Buffer.concat([originalBytes, Buffer.from('\n// modified bytes\n')]));
      assert.throws(
        () => sync.revert(publication.rollbackRoot, runtimeRoot),
        /rollback closure does not match the retained prior closure/,
      );
      fs.writeFileSync(rollbackEngine, originalBytes);
      sync.finalize(publication.rollbackRoot, runtimeRoot);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('finalize and revert cleanup resume after individual removal failures', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-cleanup-resume-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const realRmSync = fs.rmSync;
    try {
      let publication = buildRetainedPublication(runtimeRoot);
      let failFinalizeRemoval = true;
      fs.rmSync = function patchedFinalizeRemoval(target, ...rest) {
        if (failFinalizeRemoval && path.resolve(String(target)) === path.resolve(publication.rollbackRoot)) {
          failFinalizeRemoval = false;
          const error = new Error('seeded finalize cleanup failure');
          error.code = 'EACCES';
          throw error;
        }
        return realRmSync.call(fs, target, ...rest);
      };
      assert.throws(
        () => sync.finalize(publication.rollbackRoot, runtimeRoot),
        /seeded finalize cleanup failure/,
      );
      fs.rmSync = realRmSync;
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(publication.rollbackRoot), true);
      assert.equal(fs.existsSync(runtimeLayout.publicationLockPathFor(runtimeRoot)), true);
      assert.equal(sync.finalize(publication.rollbackRoot, runtimeRoot).resumedCleanup, true);

      publication = sync.build({ runtimeRoot });
      const publicationId = path.basename(publication.rollbackRoot)
        .slice(`${path.basename(runtimeRoot)}.rollback-`.length);
      const failedRoot = `${runtimeRoot}.failed-${publicationId}`;
      let failRevertRemoval = true;
      fs.rmSync = function patchedRevertRemoval(target, ...rest) {
        if (failRevertRemoval && path.resolve(String(target)) === path.resolve(failedRoot)) {
          failRevertRemoval = false;
          const error = new Error('seeded revert cleanup failure');
          error.code = 'EACCES';
          throw error;
        }
        return realRmSync.call(fs, target, ...rest);
      };
      assert.throws(
        () => sync.revert(publication.rollbackRoot, runtimeRoot),
        /seeded revert cleanup failure/,
      );
      fs.rmSync = realRmSync;
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(failedRoot), true);
      assert.equal(fs.existsSync(runtimeLayout.publicationLockPathFor(runtimeRoot)), true);
      assert.equal(sync.revert(publication.rollbackRoot, runtimeRoot).resumedCleanup, true);
      assert.deepEqual(fs.readdirSync(sandbox).sort(), ['compiled-routing']);
    } finally {
      fs.rmSync = realRmSync;
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('terminal cleanup resumes lock failure without deleting newer publication state', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-terminal-resume-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    const lockPath = runtimeLayout.publicationLockPathFor(runtimeRoot);
    const statePath = path.join(runtimeRoot, '.compiled-route-publication.json');
    const realRmSync = fs.rmSync;
    try {
      let publication = buildRetainedPublication(runtimeRoot);
      let failLockRemoval = true;
      fs.rmSync = function patchedLockRemoval(target, ...rest) {
        if (failLockRemoval && path.resolve(String(target)) === path.resolve(lockPath)) {
          failLockRemoval = false;
          throw new Error('seeded publication lock removal failure');
        }
        return realRmSync.call(fs, target, ...rest);
      };
      assert.throws(
        () => sync.finalize(publication.rollbackRoot, runtimeRoot),
        /seeded publication lock removal failure/,
      );
      fs.rmSync = realRmSync;
      assert.equal(fs.existsSync(lockPath), true);
      assert.equal(fs.existsSync(publication.rollbackRoot), false);
      assert.equal(sync.finalize(publication.rollbackRoot, runtimeRoot).resumedCleanup, true);

      publication = sync.build({ runtimeRoot });
      let nestedPublication = null;
      fs.rmSync = function patchedUnlock(target, ...rest) {
        const result = realRmSync.call(fs, target, ...rest);
        if (!nestedPublication && path.resolve(String(target)) === path.resolve(lockPath)) {
          nestedPublication = sync.build({ runtimeRoot });
        }
        return result;
      };
      sync.finalize(publication.rollbackRoot, runtimeRoot);
      fs.rmSync = realRmSync;
      assert.ok(nestedPublication && nestedPublication.rollbackRoot, 'nested publication acquired the released lock');
      assert.equal(fs.existsSync(lockPath), true);
      assert.equal(fs.existsSync(nestedPublication.rollbackRoot), true);
      assert.equal(fs.existsSync(statePath), true);
      const nestedState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      assert.equal(
        nestedState.rollbackBasename,
        path.basename(nestedPublication.rollbackRoot),
      );
      sync.finalize(nestedPublication.rollbackRoot, runtimeRoot);
    } finally {
      fs.rmSync = realRmSync;
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('rename failures retain a serving root and recoverable publication state', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-sync-rename-recovery-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      buildFreshRuntime(runtimeRoot);
      const installPublication = sync.build({
        runtimeRoot,
        _testFailRename: ['staging-install', 'staging-install-rollback-restore'],
      });
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(installPublication.rollbackRoot), true);
      assert.match(sync.verifyRoot(runtimeRoot, { emit: false }).message, /all 7 hubs resolve/);
      sync.finalize(installPublication.rollbackRoot, runtimeRoot);

      assert.throws(
        () => sync.build({
          runtimeRoot,
          _testFailVerify: 'post-publish',
          _testFailRename: 'post-publish-restore',
        }),
        /verified new root was restored and the rollback retained/,
      );
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.match(sync.verifyRoot(runtimeRoot, { emit: false }).message, /all 7 hubs resolve/);
      let rollbackRoot = fs.readdirSync(sandbox)
        .map((entry) => path.join(sandbox, entry))
        .find((entry) => entry.startsWith(`${runtimeRoot}.rollback-`));
      assert.ok(rollbackRoot, 'rollback retained after failed restoration');
      sync.finalize(rollbackRoot, runtimeRoot);

      buildFreshRuntime(path.join(sandbox, 'fallback-runtime'));
      const fallbackRuntime = path.join(sandbox, 'fallback-runtime');
      assert.throws(
        () => sync.build({
          runtimeRoot: fallbackRuntime,
          _testFailVerify: 'post-publish',
          _testFailRename: ['post-publish-restore', 'post-publish-new-restore'],
        }),
        /verified prior root was reinstalled/,
      );
      assert.equal(fs.existsSync(fallbackRuntime), true);
      assert.match(sync.verifyRoot(fallbackRuntime, { emit: false }).message, /all 7 hubs resolve/);

      const retainedRuntime = path.join(sandbox, 'retained-runtime');
      buildFreshRuntime(retainedRuntime);
      assert.throws(
        () => sync.build({
          runtimeRoot: retainedRuntime,
          _testFailRename: [
            'staging-install',
            'staging-install-rollback-restore',
            'staging-install-fallback',
          ],
        }),
        /rollback and staging remain recoverable/,
      );
      const retainedEntries = fs.readdirSync(sandbox).map((entry) => path.join(sandbox, entry));
      const retainedRollback = retainedEntries.find((entry) => entry.startsWith(`${retainedRuntime}.rollback-`));
      const retainedStaging = retainedEntries.find((entry) => entry.startsWith(`${retainedRuntime}.staging-`));
      assert.ok(retainedRollback, 'verified rollback retained');
      assert.ok(retainedStaging, 'verified staging retained');
      assert.equal(fs.existsSync(runtimeLayout.publicationLockPathFor(retainedRuntime)), true);
      fs.renameSync(retainedStaging, retainedRuntime);
      sync.finalize(retainedRollback, retainedRuntime);

      const publication = sync.build({ runtimeRoot });
      rollbackRoot = publication.rollbackRoot;
      assert.throws(
        () => sync.revert(rollbackRoot, runtimeRoot, { _testFailRename: 'revert-install' }),
        /test-only revert-install rename failure/,
      );
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.equal(fs.existsSync(rollbackRoot), true);
      assert.match(sync.verifyRoot(runtimeRoot, { emit: false }).message, /all 7 hubs resolve/);
      sync.finalize(rollbackRoot, runtimeRoot);

      const recoveryPublication = sync.build({ runtimeRoot });
      assert.throws(
        () => sync.revert(recoveryPublication.rollbackRoot, runtimeRoot, {
          _testFailVerify: 'revert-post',
          _testFailRename: 'revert-current-restore',
        }),
        /verified prior root remains serving/,
      );
      assert.equal(fs.existsSync(runtimeRoot), true);
      assert.match(sync.verifyRoot(runtimeRoot, { emit: false }).message, /all 7 hubs resolve/);
      assert.equal(sync.revert(recoveryPublication.rollbackRoot, runtimeRoot).resumedCleanup, true);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('long-lived status rebinding follows an atomic generation replacement', () => {
    const sandbox = fs.mkdtempSync(path.join(path.dirname(sync.RUNTIME_ROOT), 'compiled-route-status-rebind-'));
    const runtimeRoot = path.join(sandbox, 'compiled-routing');
    try {
      fs.cpSync(sync.RUNTIME_ROOT, runtimeRoot, { recursive: true });
      const beforeBinding = status.runtimeBindingFor(runtimeRoot);
      const before = status.computeHubStatus('cli-external-orchestration', {
        runtimeRoot,
        probeEngine: false,
      });
      assert.ok(['legacy', 'current'].includes(beforeBinding.id), 'fixture binds a known layout');
      const beforeCause = before.causeCode;
      const publication = sync.build({ runtimeRoot });
      const afterBinding = status.runtimeBindingFor(runtimeRoot);
      const after = status.computeHubStatus('cli-external-orchestration', {
        runtimeRoot,
        probeEngine: false,
      });
      assert.equal(afterBinding.id, 'current');
      assert.notEqual(afterBinding.rootIdentity, beforeBinding.rootIdentity);
      assert.equal(after.causeCode, 'compiled-serving');
      void after;
      sync.revert(publication.rollbackRoot, runtimeRoot);
      const restoredBinding = status.runtimeBindingFor(runtimeRoot);
      const restored = status.computeHubStatus('cli-external-orchestration', {
        runtimeRoot,
        probeEngine: false,
      });
      assert.equal(restoredBinding.id, beforeBinding.id);
      assert.notEqual(restoredBinding.rootIdentity, afterBinding.rootIdentity);
      assert.equal(restored.causeCode, beforeCause);

      const missingRuntime = path.join(sandbox, 'missing-manifest-runtime');
      fs.cpSync(sync.RUNTIME_ROOT, missingRuntime, { recursive: true });
      fs.rmSync(path.join(
        runtimeLayout.activationRootFor(missingRuntime),
        'cli-external-orchestration',
        'manifest.json',
      ));
      assert.throws(
        () => sync.build({ runtimeRoot: missingRuntime }),
        /promoted closure failed to resolve hubs: cli-external-orchestration/,
      );

      const malformedRuntime = path.join(sandbox, 'malformed-manifest-runtime');
      fs.cpSync(sync.RUNTIME_ROOT, malformedRuntime, { recursive: true });
      const malformedPath = path.join(
        runtimeLayout.activationRootFor(malformedRuntime),
        'cli-external-orchestration',
        'manifest.json',
      );
      fs.writeFileSync(malformedPath, '{broken');
      assert.throws(
        () => sync.build({ runtimeRoot: malformedRuntime }),
        /promoted closure failed to resolve hubs: cli-external-orchestration/,
      );

      const invalidRuntime = path.join(sandbox, 'invalid-manifest-runtime');
      fs.cpSync(sync.RUNTIME_ROOT, invalidRuntime, { recursive: true });
      const invalidPath = path.join(
        runtimeLayout.activationRootFor(invalidRuntime),
        'cli-external-orchestration',
        'manifest.json',
      );
      fs.writeFileSync(invalidPath, `${JSON.stringify({
        schemaVersion: 'V1',
        selectedPolicy: { effectivePolicyHash: 'bad', generation: 5 },
        servingAuthority: 'compiled',
        shadowOnly: false,
      })}\n`);
      assert.throws(
        () => sync.build({ runtimeRoot: invalidRuntime }),
        /promoted closure failed to resolve hubs: cli-external-orchestration/,
      );
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('canonical manifest writers refuse mutation while publication is locked', () => {
    const lockPath = manifestContract.PUBLICATION_LOCK_PATH;
    const hubId = `publication-lock-${process.pid}`;
    const skillRoot = createParentFixture(hubId);
    assert.equal(fs.existsSync(lockPath), false, 'no active live publication lock');
    fs.writeFileSync(lockPath, '{"publicationId":"test"}\n', { flag: 'wx', mode: 0o600 });
    try {
      const minted = manifestContract.mintCanonicalManifest({ hubId, skillRoot });
      assert.equal(minted.causeCode, 'publication-locked');
      const refreshed = manifestContract.refreshCanonicalManifest({ hubId: PRIMARY_HUB, skillRoot: primaryRoot });
      assert.equal(refreshed.causeCode, 'publication-locked');
      assert.equal(fs.existsSync(manifestContract.canonicalManifestPath({ hubId }).absolutePath), false);
    } finally {
      fs.rmSync(lockPath, { force: true });
    }
  });

  test('canonical manifest writers hold the shared lock through their atomic write', () => {
    const lockPath = manifestContract.PUBLICATION_LOCK_PATH;
    const hubId = `publication-writer-lease-${process.pid}`;
    const skillRoot = createParentFixture(hubId);
    removeManifestDirectory(hubId);
    assert.equal(fs.existsSync(lockPath), false, 'no active live publication lock');
    const manifestPath = manifestContract.canonicalManifestPath({ hubId }).absolutePath;
    const realWriteFileSync = fs.writeFileSync;
    let observed = false;
    fs.writeFileSync = function patchedWriteFileSync(target, ...rest) {
      if (path.resolve(String(target)) === path.resolve(manifestPath)) {
        observed = true;
        assert.equal(fs.existsSync(lockPath), true);
        assert.throws(
          () => realWriteFileSync.call(fs, lockPath, '{}\n', { flag: 'wx', mode: 0o600 }),
          (error) => error && error.code === 'EEXIST',
        );
      }
      return realWriteFileSync.call(fs, target, ...rest);
    };
    try {
      const minted = manifestContract.mintCanonicalManifest({ hubId, skillRoot });
      assert.equal(minted.created, true, minted.causeCode);
      assert.equal(observed, true);
      assert.equal(fs.existsSync(lockPath), false);
    } finally {
      fs.writeFileSync = realWriteFileSync;
      if (fs.existsSync(lockPath)) {
        const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
        if (lock.kind === 'manifest-writer' && lock.pid === process.pid) {
          fs.rmSync(lockPath);
        }
      }
      removeManifestDirectory(hubId);
    }
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
      ['fresh', 'publication-locked'],
    );
    assert.equal(results.find((result) => result.code === 0).json.created, true);
    assert.equal(results.find((result) => result.code === 1).json.created, false);
    const retry = runManifestCli(args);
    assert.equal(retry.status, 1);
    assert.equal(retry.json.causeCode, 'already-exists');
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

  test('keeps fixed routing maps unchanged and reports only authorized pre-publication drift', () => {
    delete process.env.SPECKIT_COMPILED_ROUTING;
    assert.equal(resolver.DEFAULT_ON_HUBS.size, 7);
    assert.equal(Object.prototype.hasOwnProperty.call(engine.HUB_CHILD, PRIMARY_HUB), false);
    assert.equal(resolver.resolveRoute(PRIMARY_HUB, 'quality review'), null);
    const records = status.computeAllStatus({ probeEngine: false });
    const staleHubs = [];
    for (const hubId of FIXED_HUBS) {
      const record = records.find((candidate) => candidate.hubId === hubId);
      assert.ok(record, hubId);
      assert.equal(
        ['compiled-serving', 'stale-manifest'].includes(record.causeCode),
        true,
        hubId,
      );
      if (record.causeCode !== 'compiled-serving') staleHubs.push(hubId);
      assert.equal(typeof record.manifestFreshness, 'object', hubId);
    }
    assert.deepEqual(staleHubs, staleHubs.length === 0 ? [] : ['cli-external-orchestration']);
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
    const mixedSyncMode = spawnSync(process.execPath, [SYNC_PATH, '--check', '--verify'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.equal(mixedSyncMode.status, 2);
    assert.equal(mixedSyncMode.stdout, '');
    assert.match(mixedSyncMode.stderr, /choose exactly one mode/);
    const trailingSyncArgument = spawnSync(process.execPath, [SYNC_PATH, '--check', 'unexpected'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.equal(trailingSyncArgument.status, 2);
    assert.equal(trailingSyncArgument.stdout, '');
    assert.match(trailingSyncArgument.stderr, /^usage:/);
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
