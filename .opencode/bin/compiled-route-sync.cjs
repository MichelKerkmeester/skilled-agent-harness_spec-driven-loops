#!/usr/bin/env node
'use strict';

// Build/copy step for the promoted compiled-routing runtime closure.
//
// The authored source of the runtime resolver, the engine loader, the activation
// manifests, and every per-hub bundle lives under the mutable spec tree. Serving
// from there couples the runtime to spec-folder churn: a single renumber can
// sever routing fleet-wide. This tool promotes the closure to a stable runtime
// path so nothing on the serving path ever reads under `.opencode/specs`.
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
const Module = require('module');

const {
  isCanonicalHubId,
  validateCanonicalManifestBytes,
} = require('./lib/compiled-route-manifest.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');
const IMPL_ROOT = path.join(
  REPO_ROOT,
  '.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program',
  '007-unified-refactor-implementation',
);
const AUTHORED_RESOLVER = path.join(IMPL_ROOT, '011-runtime-engine', 'lib', 'resolve.cjs');
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
const ACTIVATION_ROOT = path.join(RUNTIME_ROOT, '010-live-activation', 'activation');
const PROMOTED_RESOLVER = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'resolve.cjs');
const MANIFEST_PATH = path.join(RUNTIME_ROOT, 'serving-closure.manifest.json');

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
function traceClosure(resolverPath) {
  const probe = instrument();
  const priorFlag = process.env.SPECKIT_COMPILED_ROUTING;
  process.env.SPECKIT_COMPILED_ROUTING = '1';
  const resolved = {};
  try {
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

function underImplRoot(abs) {
  const rel = path.relative(IMPL_ROOT, abs);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function underSpecs(abs) {
  const rel = path.relative(SPECS_ROOT, abs);
  return rel === '' || (rel && !rel.startsWith('..') && !path.isAbsolute(rel));
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

function build() {
  const { touched, resolved } = traceClosure(AUTHORED_RESOLVER);
  const closureFiles = [...touched]
    .filter(underImplRoot)
    .filter((abs) => { try { return fs.statSync(abs).isFile(); } catch { return false; } })
    .sort();

  const unresolved = HUBS.filter((h) => !resolved[h]);
  if (unresolved.length > 0) {
    throw new Error(`authored closure failed to resolve hubs: ${unresolved.join(', ')}`);
  }
  const externalManifests = captureExternalActivationManifests();

  fs.rmSync(RUNTIME_ROOT, { recursive: true, force: true });
  const copied = [];
  for (const abs of closureFiles) {
    const rel = path.relative(IMPL_ROOT, abs);
    const dest = path.join(RUNTIME_ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    copied.push(rel);
  }
  // Status inputs. The serving path never reads fence-state, so the trace does
  // not capture it, but the status probe reports fenceEpoch from it. Promote it
  // alongside the manifests so the probe reads it from the stable runtime path
  // rather than the spec tree.
  const statusInputs = [];
  for (const hub of HUBS) {
    const rel = path.join('010-live-activation', 'activation', hub, 'fence-state.json');
    const src = path.join(IMPL_ROOT, rel);
    if (fs.existsSync(src)) {
      const dest = path.join(RUNTIME_ROOT, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copied.push(rel);
      statusInputs.push(rel);
    }
  }
  restoreExternalActivationManifests(externalManifests);

  const manifest = {
    schemaVersion: 'V1',
    generatedFrom: path.relative(REPO_ROOT, IMPL_ROOT),
    runtimeRoot: path.relative(REPO_ROOT, RUNTIME_ROOT),
    hubs: HUBS,
    fileCount: copied.length,
    files: copied,
  };
  fs.mkdirSync(RUNTIME_ROOT, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(`promoted ${copied.length} closure files -> ${path.relative(REPO_ROOT, RUNTIME_ROOT)}\n`);
  return manifest;
}

function verify() {
  if (!fs.existsSync(PROMOTED_RESOLVER)) {
    throw new Error(`promoted resolver missing at ${PROMOTED_RESOLVER}; run the sync build first`);
  }
  const { touched, resolved } = traceClosure(PROMOTED_RESOLVER);
  const specReads = [...touched].filter(underSpecs).sort();
  const unresolved = HUBS.filter((h) => !resolved[h]);
  const errors = [];
  if (specReads.length > 0) {
    errors.push(`serving path read ${specReads.length} path(s) under .opencode/specs:\n  ${specReads.map((p) => path.relative(REPO_ROOT, p)).join('\n  ')}`);
  }
  if (unresolved.length > 0) {
    errors.push(`promoted closure failed to resolve hubs: ${unresolved.join(', ')}`);
  }
  if (errors.length > 0) {
    process.stderr.write(`MOVE-SIMULATION FAILED:\n${errors.join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write(`move-simulation OK: all ${HUBS.length} hubs resolve; 0 reads under .opencode/specs\n`);
}

function check() {
  const { touched, resolved } = traceClosure(AUTHORED_RESOLVER);
  const closureFiles = [...touched].filter(underImplRoot).sort();
  process.stdout.write(`${closureFiles.length} closure files under authored root\n`);
  for (const abs of closureFiles) process.stdout.write(`  ${path.relative(IMPL_ROOT, abs)}\n`);
  const unresolved = HUBS.filter((h) => !resolved[h]);
  process.stdout.write(unresolved.length ? `UNRESOLVED: ${unresolved.join(', ')}\n` : `all ${HUBS.length} hubs resolve\n`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--verify')) return verify();
  if (args.includes('--check')) return check();
  return build();
}

if (require.main === module) {
  try { main(); } catch (e) { process.stderr.write(`SYNC FAILED: ${e && e.message}\n`); process.exit(1); }
}

module.exports = {
  ACTIVATION_ROOT,
  build,
  captureExternalActivationManifests,
  restoreExternalActivationManifests,
  verify,
  RUNTIME_ROOT,
  PROMOTED_RESOLVER,
  IMPL_ROOT,
  HUBS,
};
