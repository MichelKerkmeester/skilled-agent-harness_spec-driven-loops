// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CANONICAL COMPILED-ROUTE MANIFEST                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const layout = require('./compiled-route-layout.cjs');

// A private root binding names one closure this module must serve: runtime
// paths, activation root, require cache and writer lock all derive from it.
// The binding is realpath-canonicalized so every spelling of one closure — a
// symlink alias, a relative path, a trailing slash — resolves to one lock and
// one cache root. Without a binding the default promoted runtime root is used.
// The variable name is shared with bin/compiled-route-manifest.cjs; the CLI
// clears it for default operations and sets it only inside the isolated child
// process it spawns for explicit roots.
const RUNTIME_ROOT_OVERRIDE_ENV = process.env.SPECKIT_COMPILED_ROUTING_MANIFEST_RUNTIME_ROOT;
const RUNTIME_ROOT_OVERRIDDEN = Boolean(RUNTIME_ROOT_OVERRIDE_ENV);

// Canonicalize an explicitly bound runtime root to its real path so a symlink
// alias and its target directory derive the same writer lock, require-cache
// boundary and activation store. A root that cannot be realpath'd (missing
// target) keeps its resolved path and fails the coherence gate downstream.
function canonicalRuntimeRoot(value) {
  const resolved = path.resolve(value);
  try {
    return fs.realpathSync(resolved);
  } catch {
    return resolved;
  }
}

const RUNTIME_ROOT = RUNTIME_ROOT_OVERRIDE_ENV
  ? canonicalRuntimeRoot(RUNTIME_ROOT_OVERRIDE_ENV)
  : path.join(__dirname, 'compiled-routing');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const PUBLICATION_LOCK_PATH = layout.publicationLockPathFor(RUNTIME_ROOT);
const HUB_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const MANIFEST_KEYS = ['schemaVersion', 'selectedPolicy', 'servingAuthority', 'shadowOnly'];
const SELECTED_POLICY_KEYS = ['effectivePolicyHash', 'generation'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function contractError(causeCode) {
  const error = new Error(causeCode);
  error.causeCode = causeCode;
  return error;
}

let cachedRuntimeContext = null;

function clearRuntimeRequireCache() {
  const root = path.resolve(RUNTIME_ROOT);
  for (const cachePath of Object.keys(require.cache)) {
    const relative = path.relative(root, cachePath);
    if (relative === '' || (relative && !relative.startsWith('..') && !path.isAbsolute(relative))) {
      delete require.cache[cachePath];
    }
  }
}

function runtimePaths({ allowLegacyFallback = false } = {}) {
  // An explicitly selected runtime root names one specific closure: it must
  // never silently fall back to a legacy layout, because a root without a
  // coherent compiled-routing layout there is a configuration error.
  const fallback = allowLegacyFallback && !RUNTIME_ROOT_OVERRIDDEN;
  return layout.resolveRuntimePaths(RUNTIME_ROOT, { allowLegacyFallback: fallback });
}

function activationRoot() {
  const binding = runtimePaths({ allowLegacyFallback: true });
  if (!binding) throw contractError('invalid-runtime-root');
  return binding.activationRoot;
}

function runtimeContext() {
  const binding = runtimePaths();
  if (!binding) throw contractError('compile-error');
  if (!cachedRuntimeContext || cachedRuntimeContext.rootIdentity !== binding.rootIdentity) {
    clearRuntimeRequireCache();
    cachedRuntimeContext = {
      ...binding,
      compiler: require(binding.compilerPath),
      engine: require(binding.enginePath),
    };
  }
  return cachedRuntimeContext;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function artifactBytes(value) {
  return runtimeContext().compiler.artifactBytes(value);
}

// A writer lease whose holder died would otherwise block every future mint and
// refresh forever, with no escape but deleting the file by hand. Reclaim only an
// abandoned WRITER lease: an abandoned publication lease may sit over a runtime
// that is still mid-swap, so that one stays for an operator to clear explicitly.
function abandonedWriterLease() {
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(PUBLICATION_LOCK_PATH, 'utf8'));
  } catch {
    return false;
  }
  if (!lock || lock.kind !== 'manifest-writer') return false;
  if (!Number.isInteger(lock.pid) || lock.pid === process.pid) return false;
  try {
    process.kill(lock.pid, 0);
    return false;
  } catch (error) {
    return Boolean(error) && error.code === 'ESRCH';
  }
}

function acquireManifestWriterLease(operation) {
  const token = `writer-${process.pid}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  const payload = {
    schemaVersion: 'V1',
    kind: 'manifest-writer',
    token,
    operation,
    pid: process.pid,
    createdAt: new Date().toISOString(),
  };
  const write = () => fs.writeFileSync(
    PUBLICATION_LOCK_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    { flag: 'wx', mode: 0o600 },
  );
  try {
    write();
  } catch (error) {
    if (!error || error.code !== 'EEXIST') throw error;
    if (!abandonedWriterLease()) return null;
    try {
      fs.rmSync(PUBLICATION_LOCK_PATH);
      write();
    } catch (retryError) {
      if (retryError && retryError.code === 'EEXIST') return null;
      throw retryError;
    }
  }
  return token;
}

function releaseManifestWriterLease(token) {
  const stats = fs.lstatSync(PUBLICATION_LOCK_PATH);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error('manifest writer lock is not a real file');
  }
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(PUBLICATION_LOCK_PATH, 'utf8'));
  } catch {
    throw new Error('manifest writer lock is invalid');
  }
  if (lock.kind !== 'manifest-writer' || lock.token !== token) {
    throw new Error('manifest writer lock ownership changed');
  }
  fs.rmSync(PUBLICATION_LOCK_PATH);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(value, expected) {
  if (!isPlainObject(value)) return false;
  const actual = Object.keys(value).sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

/**
 * Check whether a hub identifier is safe for canonical activation storage.
 *
 * @param {unknown} hubId - Candidate hub identifier.
 * @returns {boolean} Whether the identifier is canonical hyphen-case.
 */
function isCanonicalHubId(hubId) {
  return typeof hubId === 'string' && HUB_ID_PATTERN.test(hubId);
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function relativeManifestPath(absolutePath) {
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join('/');
}

function selectedPolicyFrom(manifest) {
  if (!manifest || !isPlainObject(manifest.selectedPolicy)) {
    return { effectivePolicyHash: null, generation: null };
  }
  return {
    effectivePolicyHash: manifest.selectedPolicy.effectivePolicyHash ?? null,
    generation: manifest.selectedPolicy.generation ?? null,
  };
}

function resultRecord({
  hubId,
  causeCode,
  manifestValid = false,
  fresh = false,
  manifest = null,
  manifestFingerprint = null,
  currentPolicyHash = null,
  manifestPath = null,
  created,
  refreshed,
}) {
  const result = {
    hubId: typeof hubId === 'string' ? hubId : null,
    manifestPath,
    manifestValid,
    fresh,
    causeCode,
    selectedPolicy: selectedPolicyFrom(manifest),
    currentPolicyHash,
    manifestFingerprint,
  };
  if (typeof created === 'boolean') result.created = created;
  if (typeof refreshed === 'boolean') result.refreshed = refreshed;
  return result;
}

function failureRecord(hubId, causeCode, options = {}) {
  let manifestPath = null;
  try {
    manifestPath = canonicalManifestPath({ hubId }).manifestPath;
  } catch {
    // Unsafe identities do not receive a synthesized path.
  }
  return resultRecord({ hubId, causeCode, manifestPath, ...options });
}

function normalizeCurrentPolicy(currentPolicy) {
  if (!isPlainObject(currentPolicy)) return null;
  const generation = currentPolicy.activationGeneration ?? currentPolicy.generation;
  if (!Number.isSafeInteger(generation) || generation < 1) return null;
  if (!HASH_PATTERN.test(currentPolicy.effectivePolicyHash || '')) return null;
  return { effectivePolicyHash: currentPolicy.effectivePolicyHash, generation };
}

function safeManifestLocationExists(absolutePath) {
  const currentActivationRoot = activationRoot();
  let activationStats;
  try {
    activationStats = fs.lstatSync(currentActivationRoot);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw contractError('invalid-manifest');
  }
  if (activationStats.isSymbolicLink() || !activationStats.isDirectory()) {
    throw contractError('unsafe-path');
  }
  const realActivationRoot = fs.realpathSync(currentActivationRoot);
  const directoryPath = path.dirname(absolutePath);
  let directoryStats;
  try {
    directoryStats = fs.lstatSync(directoryPath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw contractError('invalid-manifest');
  }
  if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
    throw contractError('unsafe-path');
  }
  if (!isContained(realActivationRoot, fs.realpathSync(directoryPath))) {
    throw contractError('unsafe-path');
  }
  let manifestStats;
  try {
    manifestStats = fs.lstatSync(absolutePath);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw contractError('invalid-manifest');
  }
  if (manifestStats.isSymbolicLink() || !manifestStats.isFile()) {
    throw contractError('unsafe-path');
  }
  if (!isContained(realActivationRoot, fs.realpathSync(absolutePath))) {
    throw contractError('unsafe-path');
  }
  return true;
}

function readManifestBytes(absolutePath) {
  try {
    if (!safeManifestLocationExists(absolutePath)) return null;
    return fs.readFileSync(absolutePath);
  } catch (error) {
    if (error && error.causeCode) throw error;
    if (error && error.code === 'ENOENT') return null;
    throw contractError('invalid-manifest');
  }
}

/**
 * Validate canonical manifest structure without evaluating policy freshness.
 *
 * @param {Object} input - Hub identity and candidate bytes.
 * @returns {Object} Structural validity, parsed manifest, and fingerprint.
 */
function validateCanonicalManifestBytes({ hubId, manifestBytes }) {
  if (!isCanonicalHubId(hubId) || !Buffer.isBuffer(manifestBytes)) {
    return { manifestValid: false, manifest: null, manifestFingerprint: null };
  }
  const manifestFingerprint = sha256(manifestBytes);
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch {
    return { manifestValid: false, manifest: null, manifestFingerprint };
  }
  const selectedPolicy = manifest && manifest.selectedPolicy;
  const manifestValid = hasExactKeys(manifest, MANIFEST_KEYS)
    && manifest.schemaVersion === 'V1'
    && (manifest.servingAuthority === 'legacy' || manifest.servingAuthority === 'compiled')
    && typeof manifest.shadowOnly === 'boolean'
    && hasExactKeys(selectedPolicy, SELECTED_POLICY_KEYS)
    && Number.isSafeInteger(selectedPolicy.generation)
    && selectedPolicy.generation >= 1
    && HASH_PATTERN.test(selectedPolicy.effectivePolicyHash || '');
  return { manifestValid, manifest: manifestValid ? manifest : null, manifestFingerprint };
}

function ensureSafeSkillRoot(hubId, skillRoot) {
  if (typeof skillRoot !== 'string' || !skillRoot.trim()) {
    throw contractError('invalid-input');
  }
  if (skillRoot.includes('\0') || skillRoot.split(/[\\/]+/).includes('..')) {
    throw contractError('unsafe-path');
  }
  const resolvedRoot = path.resolve(skillRoot);
  let realRoot;
  let rootStats;
  try {
    rootStats = fs.lstatSync(resolvedRoot);
    realRoot = fs.realpathSync(resolvedRoot);
  } catch {
    throw contractError('invalid-input');
  }
  if (rootStats.isSymbolicLink()) throw contractError('unsafe-path');
  if (!rootStats.isDirectory()) throw contractError('invalid-input');
  if (path.basename(resolvedRoot) !== hubId || path.basename(realRoot) !== hubId) {
    throw contractError('hub-mismatch');
  }
  return realRoot;
}

function readOwnedFile(realRoot, fileName) {
  const candidate = path.join(realRoot, fileName);
  if (!isContained(realRoot, candidate)) throw contractError('unsafe-path');
  let stats;
  try {
    stats = fs.lstatSync(candidate);
  } catch {
    throw contractError('invalid-input');
  }
  if (stats.isSymbolicLink() || !stats.isFile()) throw contractError('unsafe-path');
  const realFile = fs.realpathSync(candidate);
  if (!isContained(realRoot, realFile)) throw contractError('unsafe-path');
  return fs.readFileSync(realFile);
}

function ensureActivationDirectory(directoryPath) {
  const currentActivationRoot = activationRoot();
  fs.mkdirSync(currentActivationRoot, { recursive: true, mode: 0o700 });
  const activationStats = fs.lstatSync(currentActivationRoot);
  if (activationStats.isSymbolicLink() || !activationStats.isDirectory()) {
    throw contractError('unsafe-path');
  }
  const realActivationRoot = fs.realpathSync(currentActivationRoot);
  if (fs.existsSync(directoryPath)) {
    const directoryStats = fs.lstatSync(directoryPath);
    if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
      throw contractError('unsafe-path');
    }
  }
  fs.mkdirSync(directoryPath, { recursive: true, mode: 0o700 });
  const realDirectory = fs.realpathSync(directoryPath);
  if (!isContained(realActivationRoot, realDirectory)) throw contractError('unsafe-path');
}

function causeFrom(error, fallback = 'invalid-input') {
  return error && typeof error.causeCode === 'string' ? error.causeCode : fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the only writable activation-manifest path for a hub.
 *
 * @param {Object} input - Hub identity.
 * @param {string} input.hubId - Hyphen-case hub identifier.
 * @returns {{absolutePath: string, manifestPath: string}} Canonical paths.
 */
function canonicalManifestPath({ hubId }) {
  if (!isCanonicalHubId(hubId)) throw contractError('unsafe-path');
  const currentActivationRoot = activationRoot();
  const directoryPath = path.resolve(currentActivationRoot, hubId);
  const absolutePath = path.join(directoryPath, 'manifest.json');
  if (!isContained(currentActivationRoot, absolutePath)) throw contractError('unsafe-path');
  return { absolutePath, manifestPath: relativeManifestPath(absolutePath) };
}

function loadCanonicalRouterInputs({ hubId, skillRoot }) {
  if (!isCanonicalHubId(hubId)) throw contractError('unsafe-path');
  const realRoot = ensureSafeSkillRoot(hubId, skillRoot);
  const sourceBytes = {
    'SKILL.md': readOwnedFile(realRoot, 'SKILL.md'),
    'hub-router.json': readOwnedFile(realRoot, 'hub-router.json'),
    'mode-registry.json': readOwnedFile(realRoot, 'mode-registry.json'),
  };
  let registry;
  let hubRouter;
  try {
    registry = JSON.parse(sourceBytes['mode-registry.json'].toString('utf8'));
    hubRouter = JSON.parse(sourceBytes['hub-router.json'].toString('utf8'));
  } catch {
    throw contractError('invalid-input');
  }
  if (registry.skill !== hubId || hubRouter.skill !== hubId) {
    throw contractError('hub-mismatch');
  }
  return {
    hubRouter,
    registry,
    skillMarkdown: sourceBytes['SKILL.md'].toString('utf8'),
    sourceBytes,
  };
}

function compileCanonicalParent({ hubId, skillRoot, generation }) {
  const inputs = loadCanonicalRouterInputs({ hubId, skillRoot });
  try {
    return runtimeContext().compiler.compileRegistry({ activationGeneration: generation, ...inputs }).policy;
  } catch (error) {
    if (error && error.causeCode) throw error;
    throw contractError('compile-error');
  }
}

// Every graduated hub in HUB_CHILD owns a bespoke
// shadow-child registry-compiler.cjs with its own packetKind vocabulary,
// vocabulary-ownership rules, and bundle-rule generation -- structurally
// different from the generic 001-sk-code compiler compileCanonicalParent
// falls back to below. Recompiling a graduated hub's inputs through that
// generic compiler either throws (PACKET_KIND_UNSUPPORTED on packetKinds
// the generic PACKET_AUTHORITY map never learned, e.g. mcp-tooling's/
// cli-external-orchestration's 'transport') or silently yields a different
// basePolicyHash (different vocabulary/composition-rule construction), so
// the freshness check can never agree with compiled-route-status.cjs's
// loadHubEngine-sourced verdict for those hubs. This reuses the identical
// cached snapshot the runtime engine and Lane C parity already compute, so
// the two views read the same policy and cannot diverge.

/**
 * Prefer a graduated hub's own compiled shadow-child snapshot over the
 * generic canonical compiler for a freshness comparison. Returns undefined
 * (never throws for a routing reason) when hubId has no registered shadow
 * child, or when skillRoot resolves somewhere other than that hub's
 * canonical skill folder, so scaffolding and fixture-driven callers keep
 * today's generic-compiler behavior unchanged.
 *
 * @param {Object} input - Hub identity and authored source root.
 * @param {string} input.hubId - Hyphen-case hub identifier.
 * @param {string} input.skillRoot - Candidate authored source root.
 * @returns {Object|undefined} The shadow-child's compiled policy, or undefined.
 */
function shadowChildPolicyFor({ hubId, skillRoot }) {
  const { engine } = runtimeContext();
  if (!Object.prototype.hasOwnProperty.call(engine.HUB_CHILD, hubId)) return undefined;
  let realSkillRoot;
  let realCanonicalRoot;
  try {
    realSkillRoot = fs.realpathSync(path.resolve(skillRoot));
    realCanonicalRoot = fs.realpathSync(path.join(REPO_ROOT, '.opencode', 'skills', hubId));
  } catch {
    return undefined;
  }
  if (realSkillRoot !== realCanonicalRoot) return undefined;
  try {
    return engine.loadHubEngine(hubId).snapshot.policy;
  } catch {
    throw contractError('compile-error');
  }
}

/**
 * Compare a structurally valid manifest with an already compiled policy.
 *
 * @param {Object} input - Manifest identity and current policy.
 * @param {string} input.hubId - Hub identifier.
 * @param {Object} input.currentPolicy - Current compiled policy snapshot.
 * @returns {Object} Stable manifest validity and freshness record.
 */
function evaluateManifestFreshness({ hubId, currentPolicy, manifestBytes: suppliedBytes }) {
  let paths;
  try {
    paths = canonicalManifestPath({ hubId });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'unsafe-path'));
  }
  let manifestBytes = suppliedBytes;
  try {
    if (manifestBytes === undefined) manifestBytes = readManifestBytes(paths.absolutePath);
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'invalid-manifest'));
  }
  if (manifestBytes === null) return failureRecord(hubId, 'missing-manifest');
  const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes });
  if (!inspected.manifestValid) {
    return failureRecord(hubId, 'invalid-manifest', inspected);
  }
  const normalizedPolicy = normalizeCurrentPolicy(currentPolicy);
  if (!normalizedPolicy) {
    return failureRecord(hubId, 'invalid-input', {
      ...inspected,
      manifestValid: true,
      manifest: inspected.manifest,
    });
  }
  const selectedPolicy = inspected.manifest.selectedPolicy;
  const fresh = selectedPolicy.generation === normalizedPolicy.generation
    && selectedPolicy.effectivePolicyHash === normalizedPolicy.effectivePolicyHash;
  return resultRecord({
    hubId,
    manifestPath: paths.manifestPath,
    manifestValid: true,
    fresh,
    causeCode: fresh ? 'fresh' : 'stale-manifest',
    manifest: inspected.manifest,
    currentPolicyHash: normalizedPolicy.effectivePolicyHash,
    manifestFingerprint: inspected.manifestFingerprint,
  });
}

/**
 * Recompile current hub inputs at the selected generation and check freshness.
 *
 * @param {Object} input - Hub identity and authored source root.
 * @returns {Object} Stable manifest validity and freshness record.
 */
function checkCanonicalManifestFreshness({ hubId, skillRoot, manifestBytes: suppliedBytes }) {
  let paths;
  try {
    paths = canonicalManifestPath({ hubId });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'unsafe-path'));
  }
  let manifestBytes = suppliedBytes;
  try {
    if (manifestBytes === undefined) manifestBytes = readManifestBytes(paths.absolutePath);
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'invalid-manifest'));
  }
  if (manifestBytes === null) return failureRecord(hubId, 'missing-manifest');
  const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes });
  if (!inspected.manifestValid) {
    return failureRecord(hubId, 'invalid-manifest', inspected);
  }
  let currentPolicy;
  try {
    currentPolicy = shadowChildPolicyFor({ hubId, skillRoot }) ?? compileCanonicalParent({
      hubId,
      skillRoot,
      generation: inspected.manifest.selectedPolicy.generation,
    });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error), {
      ...inspected,
      manifestValid: true,
      manifest: inspected.manifest,
    });
  }
  return evaluateManifestFreshness({ hubId, currentPolicy, manifestBytes });
}

/**
 * Atomically create an inert generation-one manifest and verify it immediately.
 *
 * @param {Object} input - Hub identity and final authored source root.
 * @returns {Object} Stable mint result with a created flag.
 */
function mintCanonicalManifestUnlocked({ hubId, skillRoot }) {
  let paths;
  try {
    paths = canonicalManifestPath({ hubId });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'unsafe-path'), { created: false });
  }
  if (fs.existsSync(paths.absolutePath)) {
    try {
      const manifestBytes = readManifestBytes(paths.absolutePath);
      const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes });
      return failureRecord(hubId, 'already-exists', {
        ...inspected,
        manifestValid: inspected.manifestValid,
        manifest: inspected.manifest,
        created: false,
      });
    } catch (error) {
      return failureRecord(hubId, causeFrom(error), { created: false });
    }
  }
  let currentPolicy;
  try {
    currentPolicy = compileCanonicalParent({ hubId, skillRoot, generation: 1 });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error), { created: false });
  }
  const manifest = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: currentPolicy.effectivePolicyHash,
      generation: 1,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const manifestBytes = artifactBytes(manifest);
  let created = false;
  try {
    ensureActivationDirectory(path.dirname(paths.absolutePath));
    fs.writeFileSync(paths.absolutePath, manifestBytes, { flag: 'wx', mode: 0o600 });
    created = true;
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      const existingBytes = readManifestBytes(paths.absolutePath);
      const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes: existingBytes });
      return failureRecord(hubId, 'already-exists', {
        ...inspected,
        manifestValid: inspected.manifestValid,
        manifest: inspected.manifest,
        created: false,
      });
    }
    return failureRecord(hubId, causeFrom(error), { created });
  }
  return {
    ...checkCanonicalManifestFreshness({ hubId, skillRoot }),
    created: true,
  };
}

// The writer lease lives beside the runtime root, so an incoherent override
// root must fail before a lock file can be created next to a tree that cannot
// serve it. The default root keeps its historical legacy-fallback behavior.
function runtimeRootCoherent() {
  return !RUNTIME_ROOT_OVERRIDDEN || Boolean(runtimePaths());
}

function mintCanonicalManifest(input) {
  if (!runtimeRootCoherent()) {
    return failureRecord(input && input.hubId, 'invalid-runtime-root', { created: false });
  }
  const lease = acquireManifestWriterLease('mint');
  if (!lease) return failureRecord(input && input.hubId, 'publication-locked', { created: false });
  try {
    return mintCanonicalManifestUnlocked(input);
  } finally {
    releaseManifestWriterLease(lease);
  }
}

/**
 * Recompile current hub inputs one generation ahead and overwrite an existing
 * manifest in place, preserving servingAuthority and shadowOnly untouched.
 * Refuses a missing manifest outright — use mintCanonicalManifest for that.
 *
 * @param {Object} input - Hub identity and current authored source root.
 * @returns {Object} Stable freshness record with a refreshed flag.
 */
function refreshCanonicalManifestUnlocked({ hubId, skillRoot }) {
  let paths;
  try {
    paths = canonicalManifestPath({ hubId });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'unsafe-path'), { refreshed: false });
  }
  let existingBytes;
  try {
    existingBytes = readManifestBytes(paths.absolutePath);
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'invalid-manifest'), { refreshed: false });
  }
  if (existingBytes === null) {
    return failureRecord(hubId, 'missing-manifest', { refreshed: false });
  }
  const inspected = validateCanonicalManifestBytes({ hubId, manifestBytes: existingBytes });
  if (!inspected.manifestValid) {
    return failureRecord(hubId, 'invalid-manifest', { ...inspected, refreshed: false });
  }
  const existingManifest = inspected.manifest;
  const newGeneration = existingManifest.selectedPolicy.generation + 1;
  let currentPolicy;
  try {
    // Prefer a graduated hub's own shadow-child snapshot, exactly as the freshness
    // check does. The generic canonical compiler throws on those hubs' packet kinds
    // (or yields a different hash), so refreshing through it can never produce a
    // manifest the resolver's serve-time identity binding will accept.
    currentPolicy = shadowChildPolicyFor({ hubId, skillRoot })
      ?? compileCanonicalParent({ hubId, skillRoot, generation: newGeneration });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error), {
      ...inspected,
      manifestValid: true,
      manifest: inspected.manifest,
      refreshed: false,
    });
  }
  // Re-read the manifest's serving state as late as possible. A concurrent flip of
  // servingAuthority/shadowOnly during the (slow) compile above must survive this
  // refresh, so carry forward the CURRENT on-disk values rather than the snapshot
  // taken before the compile. A vanished or corrupt manifest here means another
  // writer is mid-operation — fail closed instead of clobbering it.
  let latest;
  try {
    const latestBytes = readManifestBytes(paths.absolutePath);
    if (latestBytes === null) {
      return failureRecord(hubId, 'missing-manifest', { refreshed: false });
    }
    latest = validateCanonicalManifestBytes({ hubId, manifestBytes: latestBytes });
  } catch (error) {
    return failureRecord(hubId, causeFrom(error, 'invalid-manifest'), { refreshed: false });
  }
  if (!latest.manifestValid) {
    return failureRecord(hubId, 'invalid-manifest', { ...latest, refreshed: false });
  }
  const manifest = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: currentPolicy.effectivePolicyHash,
      // Select the generation the compiled policy actually carries, normalizing
      // because a snapshot names it `activationGeneration`. Selecting any other
      // value leaves the identity binding mismatched and the hub silently on legacy.
      generation: normalizeCurrentPolicy(currentPolicy)?.generation ?? newGeneration,
    },
    servingAuthority: latest.manifest.servingAuthority,
    shadowOnly: latest.manifest.shadowOnly,
  };
  const manifestBytes = artifactBytes(manifest);
  let tempPath = null;
  try {
    ensureActivationDirectory(path.dirname(paths.absolutePath));
    // Publish atomically: write a unique temp sibling then rename over the target so
    // a concurrent reader never observes a half-written manifest and two publishers
    // cannot interleave a partial file.
    tempPath = `${paths.absolutePath}.tmp-${process.pid}-${newGeneration}`;
    fs.writeFileSync(tempPath, manifestBytes, { flag: 'wx', mode: 0o600 });
    fs.renameSync(tempPath, paths.absolutePath);
  } catch (error) {
    if (tempPath) fs.rmSync(tempPath, { force: true });
    return failureRecord(hubId, causeFrom(error), { refreshed: false });
  }
  return {
    ...checkCanonicalManifestFreshness({ hubId, skillRoot }),
    refreshed: true,
  };
}

function refreshCanonicalManifest(input) {
  if (!runtimeRootCoherent()) {
    return failureRecord(input && input.hubId, 'invalid-runtime-root', { refreshed: false });
  }
  const lease = acquireManifestWriterLease('refresh');
  if (!lease) return failureRecord(input && input.hubId, 'publication-locked', { refreshed: false });
  try {
    return refreshCanonicalManifestUnlocked(input);
  } finally {
    releaseManifestWriterLease(lease);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  get ACTIVATION_ROOT() { return activationRoot(); },
  PUBLICATION_LOCK_PATH,
  canonicalManifestPath,
  checkCanonicalManifestFreshness,
  evaluateManifestFreshness,
  isCanonicalHubId,
  mintCanonicalManifest,
  refreshCanonicalManifest,
  validateCanonicalManifestBytes,
};
