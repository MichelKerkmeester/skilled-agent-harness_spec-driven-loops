#!/usr/bin/env node
'use strict';

// Build/copy step for the promoted compiled-routing runtime closure.
//
// The authored source of the runtime resolver, engine loader, activation
// manifests, and per-hub bundles lives under a mutable documentation tree. This
// tool traces that source and promotes the closure to a stable runtime path so
// serving never depends on the authored location.
//
// It does not hand-enumerate the closure. It instruments `require` resolution and
// file reads, drives the authored resolver across every hub with the flag forced
// on, and copies exactly the files the serving path actually touches — preserving
// each file's location relative to the authored root so the byte-identical copies
// keep resolving their own dependencies. That makes the promoted set complete by
// construction and immune to a missed transitive read.
//
// Modes:
//   (default)   trace the authored closure and (re)build the promoted mirror
//   --verify    trace the PROMOTED closure and assert no path reads under
//               `.opencode/specs` while every hub still resolves (the move
//               simulation: if the serving graph never touches the spec tree,
//               relocating the spec tree cannot affect it)
//   --check     print the traced closure without writing anything

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Module = require('module');

const {
  isCanonicalHubId,
  validateCanonicalManifestBytes,
} = require('./lib/compiled-route-manifest.cjs');
const layout = require('./lib/compiled-route-layout.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPECS_ROOT = fs.realpathSync(path.join(REPO_ROOT, '.opencode', 'specs'));
const IMPL_ROOT = path.join(
  SPECS_ROOT,
  'sk-doc/019-skill-routing-refactor/015-router-unification-program',
);
const CURRENT_LAYOUT = Object.freeze({
  activation: '013-live-activation',
  resolver: path.join('014-runtime-engine', 'lib', 'resolve.cjs'),
});
const AUTHORED_RESOLVER = path.join(IMPL_ROOT, CURRENT_LAYOUT.resolver);
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
const ACTIVATION_ROOT = activationRootFor(RUNTIME_ROOT);
const PROMOTED_RESOLVER = promotedResolverFor(RUNTIME_ROOT);
const PUBLICATION_STATE_FILE = '.compiled-route-publication.json';
const PUBLICATION_STATE_SCHEMA = 'V1';

const HUBS = [
  'sk-code',
  'system-deep-loop',
  'mcp-tooling',
  'cli-external-orchestration',
  'sk-prompt',
  'sk-design',
  'sk-doc',
];

// Diverse probes maximize the branches (route/clarify/defer) the engine walks,
// so no conditionally-loaded module is missed by the trace.
const PROBES = [
  'quality review of the code',
  'design a distinctive interface with motion',
  'run a deep research loop with convergence',
  'improve this prompt with a framework',
  'create a new skill and validate the docs',
  'use the figma mcp transport',
  'commit and open a pull request',
];

function instrument() {
  const touched = new Set();
  const record = (p) => {
    if (typeof p !== 'string') return;
    try {
      const abs = path.isAbsolute(p) ? p : path.resolve(p);
      touched.add(abs);
    } catch { /* ignore un-resolvable */ }
  };
  const origResolveFilename = Module._resolveFilename;
  Module._resolveFilename = function patched(request, parent, ...rest) {
    const resolved = origResolveFilename.call(this, request, parent, ...rest);
    record(resolved);
    return resolved;
  };
  const origReadSync = fs.readFileSync;
  fs.readFileSync = function patched(p, ...rest) { record(p); return origReadSync.call(this, p, ...rest); };
  const origExists = fs.existsSync;
  fs.existsSync = function patched(p, ...rest) { record(p); return origExists.call(this, p, ...rest); };
  const origRead = fs.readFile;
  fs.readFile = function patched(p, ...rest) { record(p); return origRead.call(this, p, ...rest); };
  return {
    touched,
    restore() {
      Module._resolveFilename = origResolveFilename;
      fs.readFileSync = origReadSync;
      fs.existsSync = origExists;
      fs.readFile = origRead;
    },
  };
}

// Drive the resolver across every hub and return the set of absolute paths the
// serving path touched. `resolverPath` selects the authored or promoted graph.
function clearRequireCache(root) {
  const resolvedRoot = path.resolve(root);
  for (const cachePath of Object.keys(require.cache)) {
    const relative = path.relative(resolvedRoot, cachePath);
    if (relative === '' || (relative && !relative.startsWith('..') && !path.isAbsolute(relative))) {
      delete require.cache[cachePath];
    }
  }
}

function traceClosure(resolverPath, closureRoot = path.resolve(resolverPath, '..', '..', '..')) {
  const probe = instrument();
  const priorFlag = process.env.SPECKIT_COMPILED_ROUTING;
  process.env.SPECKIT_COMPILED_ROUTING = '1';
  const resolved = {};
  try {
    clearRequireCache(closureRoot);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { resolveRoute } = require(resolverPath);
    for (const hub of HUBS) {
      let decision = null;
      for (const prompt of PROBES) {
        const route = resolveRoute(hub, prompt);
        if (route) decision = route;
      }
      resolved[hub] = decision;
    }
  } finally {
    if (priorFlag === undefined) delete process.env.SPECKIT_COMPILED_ROUTING;
    else process.env.SPECKIT_COMPILED_ROUTING = priorFlag;
    probe.restore();
  }
  return { touched: probe.touched, resolved };
}

function underRoot(root, abs) {
  const rel = path.relative(root, abs);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function underSpecs(abs) {
  const rel = path.relative(SPECS_ROOT, abs);
  return rel === '' || (rel && !rel.startsWith('..') && !path.isAbsolute(rel));
}

// Coherent probing: the activation root and resolver come from the SAME
// generation the runtime actually serves (see compiled-route-layout.cjs), so
// capture/verify never mix a current resolver with legacy activation state.
// build() still copies the current authored topology via CURRENT_LAYOUT above;
// these helpers only detect what an existing runtime root serves.
function activationRootFor(runtimeRoot) {
  return layout.activationRootFor(runtimeRoot);
}

function promotedResolverFor(runtimeRoot) {
  return layout.resolverPathFor(runtimeRoot);
}

function sha256Bytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function readSafeFile(filePath, label) {
  const stats = fs.lstatSync(filePath);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error(`${label} must be a real file`);
  }
  return fs.readFileSync(filePath);
}

function closureFingerprint(runtimeRoot) {
  const manifestPath = path.join(runtimeRoot, 'serving-closure.manifest.json');
  const manifestBytes = readSafeFile(manifestPath, 'serving closure manifest');
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch {
    throw new Error('serving closure manifest is not valid JSON');
  }
  if (!manifest || manifest.schemaVersion !== 'V1' || !Array.isArray(manifest.files)
    || !manifest.files.every((entry) => typeof entry === 'string' && entry)) {
    throw new Error('serving closure manifest failed contract validation');
  }
  const files = [...new Set(manifest.files)].sort();
  if (files.length !== manifest.files.length) {
    throw new Error('serving closure manifest contains duplicate files');
  }
  const root = fs.realpathSync(validateRealDirectory(runtimeRoot, 'serving root'));
  const hash = crypto.createHash('sha256');
  hash.update('serving-closure-v2\0');
  hash.update(manifestBytes);
  for (const relativePath of files) {
    const absolutePath = path.resolve(root, relativePath);
    if (!underRoot(root, absolutePath)) {
      throw new Error(`serving closure manifest contains unsafe path ${relativePath}`);
    }
    const realPath = fs.realpathSync(absolutePath);
    if (!underRoot(root, realPath)) {
      throw new Error(`serving closure file escaped the runtime root: ${relativePath}`);
    }
    const stats = fs.lstatSync(absolutePath);
    if (stats.isSymbolicLink() || !stats.isFile()) {
      throw new Error(`serving closure entry must be a real file: ${relativePath}`);
    }
    hash.update('\0path\0');
    hash.update(relativePath.split(path.sep).join('/'));
    hash.update('\0mode\0');
    hash.update(String(stats.mode & 0o777));
    hash.update('\0sha256\0');
    hash.update(sha256Bytes(fs.readFileSync(absolutePath)));
  }
  return hash.digest('hex');
}

function validateRealDirectory(directoryPath, label) {
  const resolved = path.resolve(directoryPath);
  const stats = fs.lstatSync(resolved);
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw new Error(`${label} must be a real directory`);
  }
  return resolved;
}

function validateRollbackContractPath(rollbackRoot, runtimeRoot, { requireRollback = true } = {}) {
  if (!rollbackRoot) throw new Error('rollback root path is required');
  const runtimeResolved = validateRealDirectory(runtimeRoot, 'serving root');
  const rollbackResolved = path.resolve(rollbackRoot);
  if (path.dirname(runtimeResolved) !== path.dirname(rollbackResolved)) {
    throw new Error('rollback root must be a serving-root sibling');
  }
  const expectedPrefix = `${path.basename(runtimeResolved)}.rollback-`;
  const rollbackName = path.basename(rollbackResolved);
  const suffix = rollbackName.startsWith(expectedPrefix)
    ? rollbackName.slice(expectedPrefix.length)
    : '';
  if (!/^\d+-\d+$/.test(suffix)) {
    throw new Error('rollback root name does not match the publication contract');
  }
  if (!fs.existsSync(rollbackResolved)) {
    if (requireRollback) throw new Error('rollback root does not exist');
    return { runtimeRoot: runtimeResolved, rollbackRoot: rollbackResolved, publicationId: suffix };
  }
  validateRealDirectory(rollbackResolved, 'rollback root');
  const runtimeParent = fs.realpathSync(path.dirname(runtimeResolved));
  const rollbackParent = fs.realpathSync(path.dirname(rollbackResolved));
  if (runtimeParent !== rollbackParent) {
    throw new Error('rollback root escaped the serving-root parent');
  }
  return { runtimeRoot: runtimeResolved, rollbackRoot: rollbackResolved, publicationId: suffix };
}

function validateRollbackRoot(rollbackRoot, runtimeRoot) {
  return validateRollbackContractPath(rollbackRoot, runtimeRoot, { requireRollback: true });
}

function publicationStatePath(runtimeRoot) {
  return path.join(runtimeRoot, PUBLICATION_STATE_FILE);
}

function writePublicationState(runtimeRoot, state) {
  fs.writeFileSync(
    publicationStatePath(runtimeRoot),
    `${JSON.stringify(state, null, 2)}\n`,
    { flag: 'wx', mode: 0o600 },
  );
}

function replacePublicationState(runtimeRoot, state) {
  const statePath = publicationStatePath(runtimeRoot);
  const tempPath = `${statePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, `${JSON.stringify(state, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    fs.renameSync(tempPath, statePath);
  } finally {
    fs.rmSync(tempPath, { force: true });
  }
}

function readPublicationState(runtimeRoot) {
  const bytes = readSafeFile(publicationStatePath(runtimeRoot), 'publication state');
  let state;
  try {
    state = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('publication state is not valid JSON');
  }
  const phase = state && (state.phase || 'active');
  if (!state || state.schemaVersion !== PUBLICATION_STATE_SCHEMA
    || typeof state.publicationId !== 'string'
    || !/^\d+-\d+$/.test(state.publicationId)
    || typeof state.runtimeRoot !== 'string'
    || typeof state.rollbackBasename !== 'string'
    || !/^[a-f0-9]{64}$/.test(state.priorClosureFingerprint || '')
    || !/^[a-f0-9]{64}$/.test(state.currentClosureFingerprint || '')
    || !state.baselineExternalManifests
    || typeof state.baselineExternalManifests !== 'object'
    || Array.isArray(state.baselineExternalManifests)
    || !Object.values(state.baselineExternalManifests)
      .every((value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value))) {
    throw new Error('publication state failed contract validation');
  }
  if (!['active', 'finalize-cleanup', 'revert-cleanup'].includes(phase)) {
    throw new Error('publication state has an invalid phase');
  }
  if (phase === 'revert-cleanup'
    && (typeof state.cleanupRootBasename !== 'string'
      || state.cleanupRootBasename !== `${path.basename(state.runtimeRoot)}.failed-${state.publicationId}`)) {
    throw new Error('publication state has an invalid cleanup root');
  }
  return { ...state, phase };
}

function acquirePublicationLock(runtimeRoot, publicationId) {
  const lockPath = layout.publicationLockPathFor(runtimeRoot);
  const payload = {
    schemaVersion: PUBLICATION_STATE_SCHEMA,
    kind: 'publication',
    publicationId,
    runtimeRoot: path.resolve(runtimeRoot),
    pid: process.pid,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(lockPath, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  return lockPath;
}

function readLockRecord(runtimeRoot) {
  const lockPath = layout.publicationLockPathFor(runtimeRoot);
  const bytes = readSafeFile(lockPath, 'publication lock');
  let lock;
  try {
    lock = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('publication lock is not valid JSON');
  }
  if (!lock || lock.schemaVersion !== PUBLICATION_STATE_SCHEMA) {
    throw new Error('publication lock failed contract validation');
  }
  return { lock, lockPath };
}

function readPublicationLock(runtimeRoot) {
  const record = readLockRecord(runtimeRoot);
  const { lock } = record;
  if (lock.kind !== 'publication'
    || typeof lock.publicationId !== 'string'
    || path.resolve(lock.runtimeRoot || '') !== path.resolve(runtimeRoot)) {
    throw new Error('publication lock failed contract validation');
  }
  return record;
}

function releasePublicationLock(runtimeRoot, publicationId) {
  const { lock, lockPath } = readPublicationLock(runtimeRoot);
  if (lock.publicationId !== publicationId) {
    throw new Error('publication lock belongs to another publication');
  }
  fs.rmSync(lockPath);
}

function syncConflict(hubId) {
  throw new Error(`sync-conflict: external activation manifest for ${hubId}`);
}

function activationManifestPath(activationRoot, hubId) {
  if (!isCanonicalHubId(hubId)) syncConflict(String(hubId));
  const root = path.resolve(activationRoot);
  const manifestPath = path.resolve(root, hubId, 'manifest.json');
  const relative = path.relative(root, manifestPath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) syncConflict(hubId);
  return manifestPath;
}

function safeActivationRoot(activationRoot, create = false) {
  const resolvedRoot = path.resolve(activationRoot);
  if (create) fs.mkdirSync(resolvedRoot, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(resolvedRoot)) return null;
  const rootStats = fs.lstatSync(resolvedRoot);
  if (rootStats.isSymbolicLink() || !rootStats.isDirectory()) {
    syncConflict('activation-root');
  }
  return { resolvedRoot, realRoot: fs.realpathSync(resolvedRoot) };
}

function ensureSafeManifestDirectory(root, manifestPath, hubId) {
  const directoryPath = path.dirname(manifestPath);
  if (fs.existsSync(directoryPath)) {
    const directoryStats = fs.lstatSync(directoryPath);
    if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
      syncConflict(hubId);
    }
  } else {
    fs.mkdirSync(directoryPath, { recursive: true, mode: 0o700 });
  }
  const relative = path.relative(root.realRoot, fs.realpathSync(directoryPath));
  if (relative.startsWith('..') || path.isAbsolute(relative)) syncConflict(hubId);
}

function readSafeManifestBytes(manifestPath, hubId) {
  let manifestStats;
  try {
    manifestStats = fs.lstatSync(manifestPath);
  } catch {
    syncConflict(hubId);
  }
  if (manifestStats.isSymbolicLink() || !manifestStats.isFile()) syncConflict(hubId);
  try {
    return fs.readFileSync(manifestPath);
  } catch {
    syncConflict(hubId);
  }
}

function validateExternalManifest(hubId, manifestBytes) {
  const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes });
  const manifest = inspected.manifest;
  if (!inspected.manifestValid
    || manifest.servingAuthority !== 'legacy'
    || manifest.shadowOnly !== true
    || manifest.selectedPolicy.generation !== 1) {
    syncConflict(hubId);
  }
  return inspected;
}

/**
 * Snapshot inert manifests that are not part of the fixed promoted closure.
 *
 * @param {string} activationRoot - Activation store to inspect.
 * @returns {Array<Object>} Byte-preserving manifest snapshots.
 */
function captureExternalActivationManifests(activationRoot = ACTIVATION_ROOT) {
  const root = safeActivationRoot(activationRoot);
  if (!root) return [];
  const captured = [];
  for (const entry of fs.readdirSync(root.resolvedRoot, { withFileTypes: true })) {
    if (HUBS.includes(entry.name)) continue;
    if (entry.isSymbolicLink()) syncConflict(entry.name);
    if (!entry.isDirectory()) continue;
    if (!isCanonicalHubId(entry.name)) syncConflict(entry.name);
    const directoryPath = path.join(root.resolvedRoot, entry.name);
    const directoryRelative = path.relative(root.realRoot, fs.realpathSync(directoryPath));
    if (directoryRelative.startsWith('..') || path.isAbsolute(directoryRelative)) {
      syncConflict(entry.name);
    }
    const manifestPath = activationManifestPath(root.resolvedRoot, entry.name);
    const manifestBytes = readSafeManifestBytes(manifestPath, entry.name);
    const inspected = validateExternalManifest(entry.name, manifestBytes);
    captured.push({
      hubId: entry.name,
      manifestBytes: Buffer.from(manifestBytes),
      manifestFingerprint: inspected.manifestFingerprint,
    });
  }
  return captured.sort((left, right) => left.hubId.localeCompare(right.hubId));
}

/**
 * Restore captured manifests without replacing an existing destination.
 *
 * @param {Array<Object>} captured - Snapshots returned by the capture helper.
 * @param {string} activationRoot - Activation store to restore into.
 * @returns {void}
 */
function restoreExternalActivationManifests(
  captured,
  activationRoot = ACTIVATION_ROOT,
) {
  if (!Array.isArray(captured)) syncConflict('capture');
  const root = safeActivationRoot(activationRoot, true);
  for (const entry of captured) {
    if (!entry || !Buffer.isBuffer(entry.manifestBytes)) {
      syncConflict(entry && entry.hubId ? entry.hubId : 'capture');
    }
    validateExternalManifest(entry.hubId, entry.manifestBytes);
    const manifestPath = activationManifestPath(root.resolvedRoot, entry.hubId);
    ensureSafeManifestDirectory(root, manifestPath, entry.hubId);
    if (fs.existsSync(manifestPath)) {
      const currentBytes = readSafeManifestBytes(manifestPath, entry.hubId);
      if (!currentBytes.equals(entry.manifestBytes)) syncConflict(entry.hubId);
      continue;
    }
    try {
      fs.writeFileSync(manifestPath, entry.manifestBytes, { flag: 'wx', mode: 0o600 });
    } catch (error) {
      if (!error || error.code !== 'EEXIST') {
        syncConflict(entry.hubId);
      }
      const currentBytes = readSafeManifestBytes(manifestPath, entry.hubId);
      if (!currentBytes.equals(entry.manifestBytes)) syncConflict(entry.hubId);
    }
    if (!readSafeManifestBytes(manifestPath, entry.hubId).equals(entry.manifestBytes)) {
      syncConflict(entry.hubId);
    }
  }
}

function externalManifestMap(runtimeRoot) {
  const captured = captureExternalActivationManifests(activationRootFor(runtimeRoot));
  return new Map(captured.map((entry) => [entry.hubId, entry]));
}

function baselineExternalFingerprints(captured) {
  return Object.fromEntries(captured.map((entry) => [entry.hubId, entry.manifestFingerprint]));
}

function writeExternalManifestAtomic(activationRoot, entry, expectedFingerprint) {
  validateExternalManifest(entry.hubId, entry.manifestBytes);
  const root = safeActivationRoot(activationRoot, true);
  const manifestPath = activationManifestPath(root.resolvedRoot, entry.hubId);
  ensureSafeManifestDirectory(root, manifestPath, entry.hubId);
  const exists = fs.existsSync(manifestPath);
  const currentFingerprint = exists
    ? sha256Bytes(readSafeManifestBytes(manifestPath, entry.hubId))
    : null;
  if (currentFingerprint !== expectedFingerprint) {
    throw new Error(`sync-conflict: external activation manifest changed for ${entry.hubId}`);
  }
  if (!exists) {
    fs.writeFileSync(manifestPath, entry.manifestBytes, { flag: 'wx', mode: 0o600 });
  } else {
    const tempPath = `${manifestPath}.tmp-${process.pid}-${Date.now()}`;
    try {
      fs.writeFileSync(tempPath, entry.manifestBytes, { flag: 'wx', mode: 0o600 });
      const latestFingerprint = sha256Bytes(readSafeManifestBytes(manifestPath, entry.hubId));
      if (latestFingerprint !== expectedFingerprint) {
        throw new Error(`sync-conflict: external activation manifest changed for ${entry.hubId}`);
      }
      fs.renameSync(tempPath, manifestPath);
    } finally {
      fs.rmSync(tempPath, { force: true });
    }
  }
  if (!readSafeManifestBytes(manifestPath, entry.hubId).equals(entry.manifestBytes)) {
    throw new Error(`sync-conflict: external activation manifest write failed for ${entry.hubId}`);
  }
}

// Carry any activation manifest that is NOT one of the fleet's own hubs across a
// root swap, so a shadow-registered outsider is not lost when the fleet closure is
// republished wholesale. A manifest already present in the target is left alone —
// the target is the newer side, and this tool never deletes an activation manifest.
function carryExternalManifests(sourceRoot, targetRoot) {
  const source = externalManifestMap(sourceRoot);
  if (source.size === 0) return [];
  const target = externalManifestMap(targetRoot);
  const targetActivation = activationRootFor(targetRoot);
  const carried = [];
  for (const hubId of [...source.keys()].sort()) {
    if (target.has(hubId)) continue;
    writeExternalManifestAtomic(targetActivation, source.get(hubId), null);
    carried.push(hubId);
  }
  return carried;
}

function validatePublicationBinding(rollbackRoot, runtimeRoot) {
  const validated = validateRollbackRoot(rollbackRoot, runtimeRoot);
  const state = readPublicationState(validated.runtimeRoot);
  const { lock } = readPublicationLock(validated.runtimeRoot);
  if (state.phase !== 'active'
    || state.publicationId !== validated.publicationId
    || lock.publicationId !== validated.publicationId
    || path.resolve(state.runtimeRoot) !== validated.runtimeRoot
    || state.rollbackBasename !== path.basename(validated.rollbackRoot)) {
    throw new Error('rollback root is not bound to the active publication');
  }
  if (closureFingerprint(validated.runtimeRoot) !== state.currentClosureFingerprint) {
    throw new Error('serving closure changed after publication');
  }
  if (closureFingerprint(validated.rollbackRoot) !== state.priorClosureFingerprint) {
    throw new Error('rollback closure does not match the retained prior closure');
  }
  return { ...validated, state };
}

function terminalPublicationBinding(rollbackRoot, runtimeRoot, phase) {
  const validated = validateRollbackContractPath(rollbackRoot, runtimeRoot, { requireRollback: false });
  const state = readPublicationState(validated.runtimeRoot);
  if (state.phase !== phase) return null;
  if (state.publicationId !== validated.publicationId
    || path.resolve(state.runtimeRoot) !== validated.runtimeRoot
    || state.rollbackBasename !== path.basename(validated.rollbackRoot)) {
    throw new Error('cleanup request is not bound to the terminal publication state');
  }
  return { ...validated, state };
}

function releaseTerminalPublicationLock(binding) {
  const lockPath = layout.publicationLockPathFor(binding.runtimeRoot);
  if (!fs.existsSync(lockPath)) return false;
  const { lock } = readLockRecord(binding.runtimeRoot);
  if (lock.kind === 'manifest-writer') return false;
  if (lock.kind !== 'publication'
    || lock.publicationId !== binding.publicationId
    || path.resolve(lock.runtimeRoot || '') !== binding.runtimeRoot) {
    throw new Error('terminal cleanup found an unrelated publication lock');
  }
  releasePublicationLock(binding.runtimeRoot, binding.publicationId);
  return true;
}

// Clear only the record this cleanup owns. Leaving a terminal record behind points
// every later finalize at a rollback directory that no longer exists — but a newer
// publication can claim the same path while this one releases its lock, and that
// newer record must survive.
function clearOwnedPublicationState(binding) {
  const statePath = publicationStatePath(binding.runtimeRoot);
  let current;
  try {
    current = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch {
    return;
  }
  if (!current || current.publicationId !== binding.publicationId) return;
  fs.rmSync(statePath, { force: true });
}

function resumeFinalizeCleanup(rollbackRoot, runtimeRoot) {
  const binding = terminalPublicationBinding(rollbackRoot, runtimeRoot, 'finalize-cleanup');
  if (!binding) return null;
  const lockPath = layout.publicationLockPathFor(binding.runtimeRoot);
  const hasPublicationLock = fs.existsSync(lockPath)
    && readLockRecord(binding.runtimeRoot).lock.kind === 'publication';
  if (hasPublicationLock
    && closureFingerprint(binding.runtimeRoot) !== binding.state.currentClosureFingerprint) {
    throw new Error('serving closure changed before finalize cleanup');
  }
  if (fs.existsSync(binding.rollbackRoot)) {
    validateRealDirectory(binding.rollbackRoot, 'rollback root');
    if (closureFingerprint(binding.rollbackRoot) !== binding.state.priorClosureFingerprint) {
      throw new Error('rollback closure changed before finalize cleanup');
    }
    fs.rmSync(binding.rollbackRoot, { recursive: true });
  }
  releaseTerminalPublicationLock(binding);
  clearOwnedPublicationState(binding);
  return { finalized: true, reconciled: [], resumedCleanup: true };
}

function resumeRevertCleanup(rollbackRoot, runtimeRoot) {
  const binding = terminalPublicationBinding(rollbackRoot, runtimeRoot, 'revert-cleanup');
  if (!binding) return null;
  const cleanupRoot = path.join(path.dirname(binding.runtimeRoot), binding.state.cleanupRootBasename);
  const lockPath = layout.publicationLockPathFor(binding.runtimeRoot);
  const hasPublicationLock = fs.existsSync(lockPath)
    && readLockRecord(binding.runtimeRoot).lock.kind === 'publication';
  if (hasPublicationLock
    && closureFingerprint(binding.runtimeRoot) !== binding.state.priorClosureFingerprint) {
    throw new Error('restored closure changed before revert cleanup');
  }
  if (fs.existsSync(cleanupRoot)) {
    validateRealDirectory(cleanupRoot, 'displaced serving root');
    if (path.dirname(fs.realpathSync(cleanupRoot)) !== path.dirname(fs.realpathSync(binding.runtimeRoot))) {
      throw new Error('displaced serving root escaped the runtime parent');
    }
    if (closureFingerprint(cleanupRoot) !== binding.state.currentClosureFingerprint) {
      throw new Error('displaced serving closure changed before revert cleanup');
    }
    fs.rmSync(cleanupRoot, { recursive: true });
  }
  releaseTerminalPublicationLock(binding);
  clearOwnedPublicationState(binding);
  return { reverted: true, reconciled: [], resumedCleanup: true };
}

function verifyRoot(runtimeRoot, { emit = true, allowStaleManifests = false } = {}) {
  const resolverPath = promotedResolverFor(runtimeRoot);
  if (!resolverPath || !fs.existsSync(resolverPath)) {
    throw new Error(`promoted resolver missing at ${resolverPath || 'no coherent layout'}; run the sync build first`);
  }
  const { touched, resolved } = traceClosure(resolverPath, runtimeRoot);
  const specReads = [...touched].filter(underSpecs).sort();
  const unresolved = HUBS.filter((h) => !resolved[h]);
  const allowedStale = [];
  const blockedUnresolved = [];
  if (allowStaleManifests && unresolved.length > 0) {
    const status = require('./compiled-route-status.cjs');
    for (const hubId of unresolved) {
      const record = status.computeHubStatus(hubId, { runtimeRoot, probeEngine: false });
      if (record.causeCode === 'stale-manifest'
        && record.manifestFreshness
        && record.manifestFreshness.manifestValid === true) {
        allowedStale.push(hubId);
      } else {
        blockedUnresolved.push(hubId);
      }
    }
  } else {
    blockedUnresolved.push(...unresolved);
  }
  const errors = [];
  if (specReads.length > 0) {
    errors.push(`serving path read ${specReads.length} path(s) under .opencode/specs:\n  ${specReads.map((p) => path.relative(REPO_ROOT, p)).join('\n  ')}`);
  }
  if (blockedUnresolved.length > 0) {
    errors.push(`promoted closure failed to resolve hubs: ${blockedUnresolved.join(', ')}`);
  }
  if (errors.length > 0) {
    throw new Error(`MOVE-SIMULATION FAILED:\n${errors.join('\n')}`);
  }
  const message = allowedStale.length > 0
    ? `move-simulation OK: ${HUBS.length - allowedStale.length}/${HUBS.length} hubs resolve; ${allowedStale.length} validated stale-manifest rollback fallback(s): ${allowedStale.join(', ')}; 0 reads under .opencode/specs`
    : `move-simulation OK: all ${HUBS.length} hubs resolve; 0 reads under .opencode/specs`;
  if (emit) process.stdout.write(`${message}\n`);
  return { resolved, touched, allowedStale, message };
}

// Verify a candidate runtime root, unless a test-only failure injection is
// active. `_testFailVerify` deterministically throws at the named verify phase
// so the destructive staging-abort and post-publish-rollback branches can be
// exercised; it has no effect when undefined and is never set by the CLI.
function verifyPhase(root, phase, failPhase, options = {}) {
  if (failPhase === phase) {
    throw new Error(`test-only ${phase} verify failure`);
  }
  return verifyRoot(root, { emit: false, ...options });
}

function renamePhase(source, destination, phase, failPhase) {
  const shouldFail = Array.isArray(failPhase) ? failPhase.includes(phase) : failPhase === phase;
  if (shouldFail) {
    throw new Error(`test-only ${phase} rename failure`);
  }
  fs.renameSync(source, destination);
}

function build({
  sourceRoot = IMPL_ROOT,
  runtimeRoot = RUNTIME_ROOT,
  _testFailVerify,
  _testFailRename,
} = {}) {
  const runtimeResolved = path.resolve(runtimeRoot);
  const authoredResolver = path.join(sourceRoot, CURRENT_LAYOUT.resolver);
  if (!fs.existsSync(authoredResolver)) {
    throw new Error(`authored resolver missing at ${authoredResolver}`);
  }
  const { touched, resolved } = traceClosure(authoredResolver, sourceRoot);
  const closureFiles = [...touched]
    .filter((abs) => underRoot(sourceRoot, abs))
    .filter((abs) => { try { return fs.statSync(abs).isFile(); } catch { return false; } })
    .sort();

  const unresolved = HUBS.filter((h) => !resolved[h]);
  if (unresolved.length > 0) {
    throw new Error(`authored closure failed to resolve hubs: ${unresolved.join(', ')}`);
  }
  if (closureFiles.length === 0) {
    throw new Error('authored closure is empty');
  }
  const publicationId = `${process.pid}-${Date.now()}`;
  const stagingRoot = `${runtimeResolved}.staging-${publicationId}`;
  const rollbackRoot = `${runtimeResolved}.rollback-${publicationId}`;
  if (fs.existsSync(stagingRoot) || fs.existsSync(rollbackRoot)) {
    throw new Error('sync staging or rollback path already exists');
  }

  const lockPath = acquirePublicationLock(runtimeResolved, publicationId);
  let priorMoved = false;
  let published = false;
  let retainLock = false;
  let retainStaging = false;
  try {
    const hasPrior = fs.existsSync(runtimeResolved);
    let priorClosureFingerprint = null;
    if (hasPrior) {
      validateRealDirectory(runtimeResolved, 'serving root');
      verifyRoot(runtimeResolved, { emit: false, allowStaleManifests: true });
      priorClosureFingerprint = closureFingerprint(runtimeResolved);
    }
    const externalManifests = captureExternalActivationManifests(activationRootFor(runtimeResolved));
    const copied = [];
    for (const abs of closureFiles) {
      const rel = path.relative(sourceRoot, abs);
      const dest = path.join(stagingRoot, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(abs, dest);
      copied.push(rel);
    }
    // The resolver does not read fence state, but the status probe reports it.
    for (const hub of HUBS) {
      const rel = path.join(CURRENT_LAYOUT.activation, 'activation', hub, 'fence-state.json');
      const src = path.join(sourceRoot, rel);
      if (fs.existsSync(src)) {
        const dest = path.join(stagingRoot, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        copied.push(rel);
      }
    }
    restoreExternalActivationManifests(
      externalManifests,
      path.join(stagingRoot, CURRENT_LAYOUT.activation, 'activation'),
    );

    const manifest = {
      schemaVersion: 'V1',
      generatedFrom: path.relative(REPO_ROOT, sourceRoot),
      runtimeRoot: path.relative(REPO_ROOT, runtimeResolved),
      hubs: HUBS,
      fileCount: copied.length,
      files: copied,
    };
    fs.mkdirSync(stagingRoot, { recursive: true });
    fs.writeFileSync(
      path.join(stagingRoot, 'serving-closure.manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    if (hasPrior) {
      writePublicationState(stagingRoot, {
        schemaVersion: PUBLICATION_STATE_SCHEMA,
        publicationId,
        runtimeRoot: runtimeResolved,
        rollbackBasename: path.basename(rollbackRoot),
        priorClosureFingerprint,
        currentClosureFingerprint: closureFingerprint(stagingRoot),
        baselineExternalManifests: baselineExternalFingerprints(externalManifests),
      });
    }
    verifyPhase(stagingRoot, 'staging', _testFailVerify);

    if (hasPrior) {
      fs.renameSync(runtimeResolved, rollbackRoot);
      priorMoved = true;
    }
    try {
      renamePhase(stagingRoot, runtimeResolved, 'staging-install', _testFailRename);
      published = true;
    } catch (installError) {
      if (!priorMoved) throw installError;
      // One recovery attempt: put the prior closure back where it was. If even that
      // fails, stop guessing — both the prior and the staged closure are still on
      // disk under known names, so retain them and report what happened. These are
      // sibling renames inside one writable directory; a cascade of them failing
      // means something is wrong that another rename will not fix.
      try {
        renamePhase(
          rollbackRoot,
          runtimeResolved,
          'staging-install-rollback-restore',
          _testFailRename,
        );
        priorMoved = false;
      } catch (restoreError) {
        // Leave `priorMoved` set so the finally-block net reinstates the prior
        // closure: without a serving root every hub loses compiled routing, and
        // that net is the last thing standing between a failed swap and an empty
        // runtime path.
        retainLock = true;
        retainStaging = true;
        throw new Error(`staging installation failed and the prior closure could not be restored; both roots remain on disk: ${installError.message}; ${restoreError.message}`);
      }
      throw installError;
    }

    try {
      verifyPhase(runtimeResolved, 'post-publish', _testFailVerify);
    } catch (error) {
      const failedRoot = `${runtimeResolved}.failed-${publicationId}`;
      fs.renameSync(runtimeResolved, failedRoot);
      published = false;
      if (priorMoved) {
        // One recovery attempt, mirroring the install path: reinstate the prior
        // closure. If that fails, retain the lock and leave the displaced root under
        // its `.failed-<id>` name so both closures stay recoverable by hand.
        try {
          renamePhase(rollbackRoot, runtimeResolved, 'post-publish-restore', _testFailRename);
          priorMoved = false;
        } catch (restoreError) {
          retainLock = true;
          throw new Error(`post-publish verification failed and the prior closure could not be restored; the displaced root is retained as ${path.basename(failedRoot)}: ${error.message}; ${restoreError.message}`);
        }
      }
      if (fs.existsSync(failedRoot)) fs.rmSync(failedRoot, { recursive: true, force: true });
      throw error;
    }

    // Rollback is RETAINED until the operator runs the post-publish status,
    // parity, kill-switch, and scorer gates and then calls finalize() (or
    // revert() on a failed gate). Deleting it here would make exact rollback
    // unrecoverable for those gates — the publication contract holds the prior
    // closure recoverable until every post-publish gate is green.
    const retainedRollback = priorMoved ? rollbackRoot : null;
    priorMoved = false;
    retainLock = Boolean(retainedRollback);
    process.stdout.write(`promoted ${copied.length} closure files -> ${path.relative(REPO_ROOT, runtimeResolved)}\n`);
    if (retainedRollback) {
      process.stdout.write(`rollback retained at ${path.relative(REPO_ROOT, retainedRollback)}\n`);
      process.stdout.write(`run status/parity/kill-switch/scorer gates, then: --finalize ${retainedRollback}\n`);
      process.stdout.write(`on a failed gate:              --revert ${retainedRollback}\n`);
    } else {
      process.stdout.write('no prior closure to roll back\n');
    }
    return { manifest, rollbackRoot: retainedRollback };
  } finally {
    if (!retainStaging && fs.existsSync(stagingRoot)) fs.rmSync(stagingRoot, { recursive: true, force: true });
    if (!published && priorMoved && !fs.existsSync(runtimeResolved) && fs.existsSync(rollbackRoot)) {
      fs.renameSync(rollbackRoot, runtimeResolved);
    }
    if (!retainLock && fs.existsSync(lockPath)) {
      releasePublicationLock(runtimeResolved, publicationId);
    }
  }
}

function reconcileActivation(rollbackRoot, runtimeRoot = RUNTIME_ROOT) {
  const binding = validatePublicationBinding(rollbackRoot, runtimeRoot);
  return carryExternalManifests(binding.rollbackRoot, binding.runtimeRoot);
}

function finalize(rollbackRoot, runtimeRoot = RUNTIME_ROOT, { _testFailVerify } = {}) {
  const resumed = resumeFinalizeCleanup(rollbackRoot, runtimeRoot);
  if (resumed) return resumed;
  const binding = validatePublicationBinding(rollbackRoot, runtimeRoot);
  const reconciled = carryExternalManifests(binding.rollbackRoot, binding.runtimeRoot);
  verifyPhase(binding.runtimeRoot, 'finalize', _testFailVerify);
  replacePublicationState(binding.runtimeRoot, {
    ...binding.state,
    phase: 'finalize-cleanup',
  });
  const result = resumeFinalizeCleanup(rollbackRoot, runtimeRoot);
  return { ...result, reconciled };
}

function revert(rollbackRoot, runtimeRoot = RUNTIME_ROOT, { _testFailVerify, _testFailRename } = {}) {
  const resumed = resumeRevertCleanup(rollbackRoot, runtimeRoot);
  if (resumed) return resumed;
  const binding = validatePublicationBinding(rollbackRoot, runtimeRoot);
  const reconciled = carryExternalManifests(binding.runtimeRoot, binding.rollbackRoot);
  verifyPhase(binding.rollbackRoot, 'revert-pre', _testFailVerify, { allowStaleManifests: true });
  const failedRoot = `${binding.runtimeRoot}.failed-${binding.publicationId}`;
  if (fs.existsSync(failedRoot)) throw new Error('failed-root path already exists');
  replacePublicationState(binding.rollbackRoot, {
    ...binding.state,
    phase: 'revert-cleanup',
    cleanupRootBasename: path.basename(failedRoot),
  });
  fs.renameSync(binding.runtimeRoot, failedRoot);
  let rollbackInstalled = false;
  try {
    renamePhase(binding.rollbackRoot, binding.runtimeRoot, 'revert-install', _testFailRename);
    rollbackInstalled = true;
    verifyPhase(binding.runtimeRoot, 'revert-post', _testFailVerify, { allowStaleManifests: true });
  } catch (error) {
    if (rollbackInstalled) {
      try {
        fs.renameSync(binding.runtimeRoot, binding.rollbackRoot);
      } catch (recoveryError) {
        throw new Error(`revert verification failed and rollback recovery could not move the restored root aside: ${recoveryError.message}`);
      }
    }
    try {
      renamePhase(failedRoot, binding.runtimeRoot, 'revert-current-restore', _testFailRename);
    } catch (recoveryError) {
      try {
        fs.renameSync(binding.rollbackRoot, binding.runtimeRoot);
      } catch (fallbackError) {
        throw new Error(`revert failed and neither verified closure could be restored: ${recoveryError.message}; ${fallbackError.message}`);
      }
      throw new Error(`revert failed; the displaced current root could not be restored, so the verified prior root remains serving: ${recoveryError.message}`);
    }
    throw error;
  }
  const result = resumeRevertCleanup(rollbackRoot, runtimeRoot);
  return { ...result, reconciled };
}

function verify({ runtimeRoot = RUNTIME_ROOT } = {}) {
  return verifyRoot(runtimeRoot);
}

function check({ sourceRoot = IMPL_ROOT } = {}) {
  const authoredResolver = path.join(sourceRoot, CURRENT_LAYOUT.resolver);
  if (!fs.existsSync(authoredResolver)) {
    throw new Error(`authored resolver missing at ${authoredResolver}`);
  }
  const { touched, resolved } = traceClosure(authoredResolver, sourceRoot);
  const closureFiles = [...touched]
    .filter((abs) => underRoot(sourceRoot, abs))
    .filter((abs) => { try { return fs.statSync(abs).isFile(); } catch { return false; } })
    .sort();
  const unresolved = HUBS.filter((h) => !resolved[h]);
  if (unresolved.length > 0) {
    throw new Error(`authored closure failed to resolve hubs: ${unresolved.join(', ')}`);
  }
  if (closureFiles.length === 0) {
    throw new Error('authored closure is empty');
  }
  process.stdout.write(`${closureFiles.length} closure files under authored root\n`);
  for (const abs of closureFiles) process.stdout.write(`  ${path.relative(sourceRoot, abs)}\n`);
  process.stdout.write(`all ${HUBS.length} hubs resolve\n`);
}

const USAGE = `Usage: compiled-route-sync.cjs [--verify|--check|--finalize <path>|--revert <path>|--help]

Modes:
  (no args)                 trace the authored closure and (re)build the
                            promoted mirror; leaves a rollback sibling in place
  --verify                  trace the PROMOTED closure and assert no path reads
                            under .opencode/specs while every hub still resolves
  --check                   print the traced closure without writing anything
  --finalize <rollback>     reconcile concurrent external manifests from the
                            retained rollback into the serving root, then remove
                            the rollback. Run only after post-publish gates pass
  --revert <rollback>       swap the retained rollback back into the serving
                            root. Run when a post-publish gate fails
  --help, -h                show this usage message and exit (no build)
`;

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    process.exit(0);
  }
  const requestedModes = ['--verify', '--check', '--finalize', '--revert']
    .filter((mode) => args.includes(mode));
  if (requestedModes.length > 1) {
    process.stderr.write(`choose exactly one mode, got: ${requestedModes.join(', ')}\n`);
    process.exit(2);
  }
  if (args.includes('--verify')) {
    if (args.length !== 1) { process.stderr.write('usage: compiled-route-sync.cjs --verify\n'); process.exit(2); }
    return verify();
  }
  if (args.includes('--check')) {
    if (args.length !== 1) { process.stderr.write('usage: compiled-route-sync.cjs --check\n'); process.exit(2); }
    return check();
  }
  const finalizeIdx = args.indexOf('--finalize');
  if (finalizeIdx >= 0) {
    const rollbackRoot = args[finalizeIdx + 1];
    if (!rollbackRoot) { process.stderr.write('usage: compiled-route-sync.cjs --finalize <rollback-root>\n'); process.exit(2); }
    if (args.length !== 2) { process.stderr.write('usage: compiled-route-sync.cjs --finalize <rollback-root>\n'); process.exit(2); }
    const result = finalize(rollbackRoot);
    process.stdout.write(`finalized rollback ${path.relative(REPO_ROOT, rollbackRoot)}; reconciled ${result.reconciled.length} external manifest(s)\n`);
    return;
  }
  const revertIdx = args.indexOf('--revert');
  if (revertIdx >= 0) {
    const rollbackRoot = args[revertIdx + 1];
    if (!rollbackRoot) { process.stderr.write('usage: compiled-route-sync.cjs --revert <rollback-root>\n'); process.exit(2); }
    if (args.length !== 2) { process.stderr.write('usage: compiled-route-sync.cjs --revert <rollback-root>\n'); process.exit(2); }
    revert(rollbackRoot);
    process.stdout.write(`reverted serving root from rollback ${path.relative(REPO_ROOT, rollbackRoot)}\n`);
    return;
  }
  if (args.length > 0) {
    process.stderr.write(`unknown argument(s): ${args.join(' ')}\n\n${USAGE}`);
    process.exit(2);
  }
  return build();
}

if (require.main === module) {
  try { main(); } catch (e) { process.stderr.write(`SYNC FAILED: ${e && e.message}\n`); process.exit(1); }
}

module.exports = {
  ACTIVATION_ROOT,
  AUTHORED_RESOLVER,
  build,
  captureExternalActivationManifests,
  check,
  CURRENT_LAYOUT,
  finalize,
  reconcileActivation,
  restoreExternalActivationManifests,
  revert,
  verify,
  verifyRoot,
  RUNTIME_ROOT,
  PROMOTED_RESOLVER,
  IMPL_ROOT,
  HUBS,
};
