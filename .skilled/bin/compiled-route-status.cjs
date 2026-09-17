#!/usr/bin/env node
'use strict';

// Per-hub compiled-routing serving-status probe.
//
// The legacy sentinel collapses four distinct causes — flag not permitting,
// missing manifest, a hub intentionally on legacy authority, and a genuinely
// broken engine — into one signal, so a drifted hub reads identically to a
// broken one. This probe emits a stable per-hub JSON contract with a causeCode
// that separates expected drift from breakage, reading only the promoted runtime
// closure (never the spec tree).
//
// Contract (one object per hub):
//   { hubId, servingAuthority, shadowOnly, selectedPolicy: { generation },
//     effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode,
//     manifestFreshness: { manifestValid, fresh, causeCode, currentPolicyHash } }
//
// causeCode:
//   'compiled-serving'  flag permits + manifest is compiled + engine routes the
//                       selected generation (genuinely served compiled)
//   'flag-off'          manifest is compiled but the flag does not permit it (drift/expected)
//   'legacy-authority'  the hub's manifest is on legacy authority (drift/expected)
//   'missing-manifest'  no manifest for the hub (drift/expected)
//   'stale-manifest'    manifest is compiled but no longer matches the current
//                       policy, so the resolver falls back to legacy (drift/expected)
//   'identity-mismatch' the engine routed a generation other than the one the
//                       manifest selected, so the resolver falls back to legacy (drift)
//   'engine-throw'      flag permits + manifest is compiled but the engine throws (BROKEN)
//
// Usage: compiled-route-status.cjs --hub <hubId> | --all [--no-probe] [--pretty]

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const {
  checkCanonicalManifestFreshness,
  evaluateManifestFreshness,
  isCanonicalHubId,
  validateCanonicalManifestBytes,
} = require('./lib/compiled-route-manifest.cjs');
const {
  resolveRuntimePaths,
} = require('./lib/compiled-route-layout.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
let cachedRuntimeModules = null;

function clearRuntimeRequireCache(runtimeRoot) {
  const root = path.resolve(runtimeRoot);
  for (const cachePath of Object.keys(require.cache)) {
    const relative = path.relative(root, cachePath);
    if (relative === '' || (relative && !relative.startsWith('..') && !path.isAbsolute(relative))) {
      delete require.cache[cachePath];
    }
  }
}

// Resolve one layout verdict per status operation. The runtime directory inode
// changes on atomic publication, which invalidates long-lived module bindings
// without reloading modules repeatedly while one generation remains active.
function runtimeModules(runtimeRoot = RUNTIME_ROOT) {
  const binding = resolveRuntimePaths(runtimeRoot);
  if (!binding) return { binding: null, resolver: null, engine: null };
  if (!cachedRuntimeModules
    || cachedRuntimeModules.binding.runtimeRoot !== binding.runtimeRoot
    || cachedRuntimeModules.binding.rootIdentity !== binding.rootIdentity) {
    if (cachedRuntimeModules) clearRuntimeRequireCache(binding.runtimeRoot);
    let resolver = null;
    let engine = null;
    try { resolver = require(binding.resolverPath); } catch { /* Fail closed below. */ }
    try { engine = require(binding.enginePath); } catch { /* Fail closed below. */ }
    cachedRuntimeModules = { binding, resolver, engine };
  }
  return cachedRuntimeModules;
}

// Single-source the tri-state flag semantics and the hub set from the promoted
// runtime, so the probe's flag verdict can never diverge from what actually
// serves. Both are loaded defensively: a probe should degrade, not throw.
function loadResolver(runtimeRoot = RUNTIME_ROOT) {
  return runtimeModules(runtimeRoot).resolver;
}
function loadEngine(runtimeRoot = RUNTIME_ROOT) {
  return runtimeModules(runtimeRoot).engine;
}

function knownHubs(activationRoot, runtimeRoot = RUNTIME_ROOT, runtime = runtimeModules(runtimeRoot)) {
  const selectedActivationRoot = activationRoot || (runtime.binding && runtime.binding.activationRoot);
  const engine = runtime.engine;
  const hubs = new Set(engine && engine.HUB_CHILD ? Object.keys(engine.HUB_CHILD) : []);
  // Activation discovery is observability-only and never expands serving eligibility.
  try {
    for (const entry of fs.readdirSync(selectedActivationRoot, { withFileTypes: true })) {
      if (entry.isDirectory() && isCanonicalHubId(entry.name)) hubs.add(entry.name);
    }
  } catch { /* A missing activation root contributes no observable hubs. */ }
  return [...hubs].sort();
}

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function fenceEpochFor(hubId, activationRoot) {
  if (!isCanonicalHubId(hubId)) return null;
  const fencePath = path.join(activationRoot, hubId, 'fence-state.json');
  try { return readJson(fencePath).fencingEpoch ?? null; } catch { return null; }
}

function readStatusManifest(hubId, activationRoot) {
  if (!isCanonicalHubId(hubId)) throw new Error('unsafe hub identity');
  const resolvedRoot = path.resolve(activationRoot);
  const manifestPath = path.resolve(resolvedRoot, hubId, 'manifest.json');
  const relative = path.relative(resolvedRoot, manifestPath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('unsafe manifest path');
  }
  const realRoot = fs.realpathSync(resolvedRoot);
  const directoryPath = path.dirname(manifestPath);
  const directoryStats = fs.lstatSync(directoryPath);
  if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
    throw new Error('unsafe manifest directory');
  }
  const realDirectory = fs.realpathSync(directoryPath);
  const directoryRelative = path.relative(realRoot, realDirectory);
  if (directoryRelative.startsWith('..') || path.isAbsolute(directoryRelative)) {
    throw new Error('unsafe manifest directory');
  }
  const manifestStats = fs.lstatSync(manifestPath);
  if (manifestStats.isSymbolicLink() || !manifestStats.isFile()) {
    throw new Error('unsafe manifest file');
  }
  return fs.readFileSync(manifestPath);
}

function flagPermits(hubId, resolver = loadResolver()) {
  if (resolver && typeof resolver.flagPermitsCompiled === 'function') {
    try { return resolver.flagPermitsCompiled(hubId); } catch { return false; }
  }
  // Conservative fallback: only the explicit force-on value permits compiled.
  return process.env.SPECKIT_COMPILED_ROUTING === '1';
}

function baseRecord(hubId, activationRoot) {
  return {
    hubId,
    servingAuthority: 'legacy',
    shadowOnly: null,
    selectedPolicy: { generation: null },
    effectivePolicyHash: null,
    fenceEpoch: fenceEpochFor(hubId, activationRoot),
    manifestFingerprint: null,
    causeCode: 'missing-manifest',
    manifestFreshness: {
      manifestValid: false,
      fresh: false,
      causeCode: 'missing-manifest',
      currentPolicyHash: null,
    },
  };
}

function freshnessSummary(result) {
  return {
    manifestValid: result.manifestValid,
    fresh: result.fresh,
    causeCode: result.causeCode,
    currentPolicyHash: result.currentPolicyHash,
  };
}

function manifestFreshnessFor(hubId, manifestBytes, skillRoot, engine = loadEngine()) {
  if (engine && engine.HUB_CHILD && engine.HUB_CHILD[hubId]
    && typeof engine.loadHubEngine === 'function') {
    try {
      const currentPolicy = engine.loadHubEngine(hubId).snapshot.policy;
      return evaluateManifestFreshness({ hubId, currentPolicy, manifestBytes });
    } catch {
      const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes });
      return {
        manifestValid: inspected.manifestValid,
        fresh: false,
        causeCode: 'compile-error',
        currentPolicyHash: null,
      };
    }
  }
  const resolvedSkillRoot = skillRoot
    || path.join(REPO_ROOT, '.opencode', 'skills', hubId);
  return checkCanonicalManifestFreshness({
    hubId,
    skillRoot: resolvedSkillRoot,
    manifestBytes,
  });
}

// Compute one hub's serving status. `probeEngine` opts into an actual engine
// load+route so a genuine throw surfaces as 'engine-throw' rather than a false
// 'compiled-serving'. Wired prompt-time surfaces pass probeEngine:false (no
// engine load, no spawn); the CLI probes by default.
function computeHubStatus(hubId, {
  probeEngine = true,
  activationRoot,
  skillRoot,
  runtimeRoot = RUNTIME_ROOT,
  _runtime,
} = {}) {
  const runtime = _runtime || runtimeModules(runtimeRoot);
  const selectedActivationRoot = activationRoot || (runtime.binding && runtime.binding.activationRoot)
    || path.join(path.resolve(runtimeRoot), '010-live-activation', 'activation');
  const record = baseRecord(hubId, selectedActivationRoot);
  let manifestBytes;
  try { manifestBytes = readStatusManifest(hubId, selectedActivationRoot); } catch {
    return record; // missing-manifest
  }
  record.manifestFingerprint = crypto.createHash('sha256').update(manifestBytes).digest('hex');
  record.manifestFreshness = freshnessSummary(
    manifestFreshnessFor(hubId, manifestBytes, skillRoot, runtime.engine),
  );
  let manifest;
  try { manifest = JSON.parse(manifestBytes.toString('utf8')); } catch {
    record.causeCode = 'missing-manifest';
    return record;
  }
  record.shadowOnly = typeof manifest.shadowOnly === 'boolean' ? manifest.shadowOnly : null;
  record.selectedPolicy = { generation: manifest.selectedPolicy?.generation ?? null };
  record.effectivePolicyHash = manifest.selectedPolicy?.effectivePolicyHash ?? null;
  const manifestAuthority = manifest.servingAuthority || 'legacy';

  if (manifestAuthority !== 'compiled') {
    record.causeCode = 'legacy-authority';
    return record;
  }
  if (!flagPermits(hubId, runtime.resolver)) {
    record.causeCode = 'flag-off';
    return record;
  }
  // A manifest that no longer matches the current policy cannot be served: the
  // resolver's serve-time identity binding rejects it and falls back to legacy.
  // Reporting compiled serving here would be a false green over a legacy hot path.
  if (record.manifestFreshness && record.manifestFreshness.fresh === false) {
    record.causeCode = 'stale-manifest';
    return record;
  }
  if (probeEngine) {
    const engine = runtime.engine;
    let probed;
    try {
      if (!engine || typeof engine.compiledRoute !== 'function') throw new Error('engine unavailable');
      probed = engine.compiledRoute(hubId, 'compiled-route-status probe');
    } catch {
      record.causeCode = 'engine-throw';
      return record;
    }
    // Mirror the resolver's identity binding exactly: routing through a snapshot
    // other than the one the manifest selected means the hot path serves legacy,
    // so the probe must not claim compiled serving.
    const selected = manifest.selectedPolicy || {};
    if (!probed
      || probed.effectivePolicyHash !== selected.effectivePolicyHash
      || probed.generation !== selected.generation) {
      record.causeCode = 'identity-mismatch';
      return record;
    }
  }
  record.servingAuthority = 'compiled';
  record.causeCode = 'compiled-serving';
  return record;
}

function computeAllStatus(opts = {}) {
  const runtimeRoot = opts.runtimeRoot || RUNTIME_ROOT;
  const runtime = runtimeModules(runtimeRoot);
  const activationRoot = opts.activationRoot || (runtime.binding && runtime.binding.activationRoot);
  return knownHubs(activationRoot, runtimeRoot, runtime)
    .map((hubId) => computeHubStatus(hubId, { ...opts, runtimeRoot, activationRoot, _runtime: runtime }));
}

function runtimeBindingFor(runtimeRoot = RUNTIME_ROOT) {
  return runtimeModules(runtimeRoot).binding;
}

function main() {
  const args = process.argv.slice(2);
  const pretty = args.includes('--pretty');
  const probeEngine = !args.includes('--no-probe');
  const hubIdx = args.indexOf('--hub');
  const stringify = (v) => (pretty ? JSON.stringify(v, null, 2) : JSON.stringify(v));

  if (hubIdx >= 0) {
    const hubId = args[hubIdx + 1];
    if (!hubId) { process.stderr.write('usage: compiled-route-status.cjs --hub <hubId> | --all\n'); process.exit(2); }
    process.stdout.write(`${stringify(computeHubStatus(hubId, { probeEngine }))}\n`);
    return;
  }
  if (args.includes('--all')) {
    process.stdout.write(`${stringify(computeAllStatus({ probeEngine }))}\n`);
    return;
  }
  process.stderr.write('usage: compiled-route-status.cjs --hub <hubId> | --all [--no-probe] [--pretty]\n');
  process.exit(2);
}

if (require.main === module) {
  try { main(); } catch (e) { process.stderr.write(`STATUS FAILED: ${e && e.message}\n`); process.exit(1); }
}

module.exports = {
  computeHubStatus,
  computeAllStatus,
  knownHubs,
  runtimeBindingFor,
  RUNTIME_ROOT,
};
