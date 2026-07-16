// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ leaf-resource-contract — pure sk-doc leaf-resource identity contract     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * leaf-resource-contract.cjs — pure library owning the public identity of a
 * hub packet's leaf resources.
 *
 * A hub packet's own router resolves resources as packet-root-relative paths
 * (`references/...`, `assets/...`). A hub's router separately selects a
 * `workflowMode`. Nothing upstream of this library ever paired the two, so
 * every caller (fixtures, replay, dispatch, guards) invented its own answer to
 * "what is this resource called," and those answers disagreed. This library
 * is the single conversion boundary: it takes a packet-local resource path
 * plus the workflowMode that resolved it and returns one typed pair,
 * `{ workflowMode, leafResourceId }`, that every consumer can compare byte
 * for byte.
 *
 * Uniqueness is enforced on that pair, not on `leafResourceId` alone, because
 * the same local filename (e.g. `references/README.md`) legitimately repeats
 * across unrelated packets. A `leafResourceId` must always stay inside its
 * own packet root; a caller that hands in a hub-qualified or shared-prefixed
 * string can only resolve it through an explicitly declared mode or alias,
 * never through generic prefix stripping, so an unrecognized shape fails
 * closed instead of silently guessing a root.
 *
 * No filesystem access happens here. Callers own reading `mode-registry.json`
 * / `leaf-aliases.json` and walking packet directories; this module only
 * shapes and validates the strings they hand it.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A leafResourceId must start under one of these packet-root-relative roots.
const LEAF_ROOTS = Object.freeze(['references/', 'assets/']);

// Bumped only when the shape of the typed pair or the manifest it feeds
// changes in a way older consumers cannot read unmodified.
const CONTRACT_VERSION = 1;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS
// ─────────────────────────────────────────────────────────────────────────────

class ContractError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ContractError';
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NORMALIZATION + CONTAINMENT
// ─────────────────────────────────────────────────────────────────────────────

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

/**
 * Validate that a string is already a well-formed, contained leafResourceId:
 * relative, no `.`/`..` segments, and rooted under `references/` or `assets/`.
 * Throws a ContractError on any violation; returns the value unchanged
 * otherwise, so callers can use this as a guard on data they already trust.
 *
 * @param {string} leafResourceId - Candidate packet-root-relative resource id.
 * @returns {string} The same, validated leafResourceId.
 */
function assertContainment(leafResourceId) {
  if (typeof leafResourceId !== 'string' || leafResourceId.length === 0) {
    throw new ContractError('EMPTY_LEAF_ID', 'leafResourceId must be a non-empty string');
  }
  const value = toPosix(leafResourceId);
  if (value.startsWith('/') || /^[A-Za-z]:\//.test(value)) {
    throw new ContractError('ABSOLUTE_PATH', `leafResourceId must be relative, not absolute: ${leafResourceId}`);
  }
  const segments = value.split('/');
  if (segments.some((s) => s === '..')) {
    throw new ContractError('PATH_TRAVERSAL', `leafResourceId must not contain ".." segments: ${leafResourceId}`);
  }
  if (segments.some((s) => s === '' || s === '.')) {
    throw new ContractError('MALFORMED_PATH', `leafResourceId must not contain empty or "." segments: ${leafResourceId}`);
  }
  if (!LEAF_ROOTS.some((root) => value.startsWith(root))) {
    throw new ContractError('OUT_OF_ROOT', `leafResourceId must begin with "references/" or "assets/": ${leafResourceId}`);
  }
  return value;
}

/**
 * Normalize a packet-local resource path (as returned by a packet's own
 * router) into a canonical leafResourceId: forward slashes, no leading `./`,
 * then run through the containment check.
 *
 * @param {string} rawLocalPath - Packet-local resource path.
 * @returns {string} Canonical leafResourceId.
 */
function normalizeLeafResourceId(rawLocalPath) {
  const stripped = toPosix(String(rawLocalPath == null ? '' : rawLocalPath)).replace(/^\.\//, '');
  return assertContainment(stripped);
}

/**
 * The single conversion boundary from (workflowMode, packet-local path) to
 * the canonical public identity. No emitter is expected to build a typed
 * pair any other way.
 *
 * @param {string} workflowMode - The hub workflow mode that resolved this resource.
 * @param {string} rawLocalPath - Packet-local resource path.
 * @returns {{workflowMode: string, leafResourceId: string}} The typed pair.
 */
function makeTypedPair(workflowMode, rawLocalPath) {
  if (typeof workflowMode !== 'string' || workflowMode.length === 0) {
    throw new ContractError('EMPTY_WORKFLOW_MODE', 'workflowMode must be a non-empty string');
  }
  return { workflowMode, leafResourceId: normalizeLeafResourceId(rawLocalPath) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMPOSITE KEY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the stable composite key for a typed pair. Uniqueness is enforced on
 * this pair, not on leafResourceId alone, since the same local filename
 * legitimately repeats across unrelated packets/modes.
 *
 * @param {{workflowMode: string, leafResourceId: string}} pair - Typed pair.
 * @returns {string} Stable composite key.
 */
function compositeKey(pair) {
  if (!pair || typeof pair.workflowMode !== 'string' || typeof pair.leafResourceId !== 'string') {
    throw new ContractError('INVALID_PAIR', 'compositeKey requires { workflowMode, leafResourceId } strings');
  }
  return JSON.stringify([pair.workflowMode, pair.leafResourceId]);
}

/**
 * Reverse of compositeKey: recover the typed pair from a composite key.
 *
 * @param {string} key - A key produced by compositeKey().
 * @returns {{workflowMode: string, leafResourceId: string}} The typed pair.
 */
function parseCompositeKey(key) {
  let parsed;
  try {
    parsed = JSON.parse(key);
  } catch {
    throw new ContractError('INVALID_COMPOSITE_KEY', `not a composite key: ${key}`);
  }
  if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== 'string' || typeof parsed[1] !== 'string') {
    throw new ContractError('INVALID_COMPOSITE_KEY', `not a composite key: ${key}`);
  }
  return { workflowMode: parsed[0], leafResourceId: parsed[1] };
}

/**
 * Find composite keys that repeat within a list of typed pairs. A duplicate
 * here is a real collision (the same mode claiming the same leaf twice), not
 * the expected cross-mode repetition of a filename like `references/README.md`.
 *
 * @param {Array<{workflowMode: string, leafResourceId: string}>} pairs - Typed pairs.
 * @returns {string[]} Composite keys that appear more than once.
 */
function findDuplicateComposites(pairs) {
  const seen = new Set();
  const dupes = new Set();
  for (const pair of pairs || []) {
    const key = compositeKey(pair);
    if (seen.has(key)) dupes.add(key);
    seen.add(key);
  }
  return [...dupes];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DUAL-READ (legacy string bridge)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a hub-relative, packet-qualified legacy string (`<packet>/references/...`
 * or `<packet>/assets/...`) into a typed pair, but only when `<packet>` matches
 * a declared mode's own `packet` field. Declared-mode matching keeps this from
 * degrading into generic prefix stripping: an unrecognized leading segment
 * never resolves.
 *
 * @param {string} raw - Candidate legacy resource string.
 * @param {Array<{workflowMode: string, packet: string}>} declaredModes - Hub registry modes.
 * @returns {{workflowMode: string, leafResourceId: string}|null} Resolved pair, or null if no declared mode matches.
 */
function resolvePacketQualified(raw, declaredModes) {
  const value = toPosix(String(raw == null ? '' : raw));
  for (const mode of declaredModes || []) {
    if (!mode || !mode.packet || !mode.workflowMode) continue;
    const prefix = `${mode.packet}/`;
    if (!value.startsWith(prefix)) continue;
    try {
      return makeTypedPair(mode.workflowMode, value.slice(prefix.length));
    } catch {
      // This candidate's remainder is not a valid leaf id under that mode;
      // keep trying other declared modes instead of failing the whole probe.
    }
  }
  return null;
}

/**
 * Resolve a shared-prefixed legacy string (e.g. `../shared/assets/x.md`) into
 * a typed pair, but only via an explicit, authored alias entry. No content
 * living under a hub's shared/ tier is ever inferred as belonging to a mode.
 * An authored `leaf-aliases.json` is the only source of that mapping.
 *
 * @param {string} raw - Candidate legacy resource string.
 * @param {Array<{workflowMode: string, leafResourceId: string, diskPath: string}>} aliasEntries - Authored aliases.
 * @returns {{workflowMode: string, leafResourceId: string}|null} Resolved pair, or null if no alias matches.
 */
function resolveSharedAlias(raw, aliasEntries) {
  const value = toPosix(String(raw == null ? '' : raw)).replace(/^(\.\.\/)+/, '');
  for (const alias of aliasEntries || []) {
    if (!alias || typeof alias.diskPath !== 'string') continue;
    const diskPath = toPosix(alias.diskPath);
    if (value === diskPath || value.endsWith(`/${diskPath}`)) {
      return makeTypedPair(alias.workflowMode, alias.leafResourceId);
    }
  }
  return null;
}

/**
 * Dual-read a resource string that may already be canonical, packet-qualified,
 * or shared-prefixed, into one typed pair. Tries, in order: the already-typed
 * shape (when workflowMode is supplied), a declared-mode packet-qualified
 * match, then an authored shared alias. Returns a non-throwing discriminated
 * result so a caller can probe many legacy strings without try/catch noise;
 * an unrecognized shape reports `ok:false` rather than guessing.
 *
 * @param {Object} args - Dual-read inputs.
 * @param {string} args.raw - Candidate legacy or canonical resource string.
 * @param {string} [args.workflowMode] - Known workflowMode, if the caller already has one.
 * @param {Array<{workflowMode: string, packet: string}>} [args.declaredModes] - Hub registry modes.
 * @param {Array<{workflowMode: string, leafResourceId: string, diskPath: string}>} [args.aliasEntries] - Authored aliases.
 * @returns {{ok: true, pair: {workflowMode: string, leafResourceId: string}}|{ok: false, code: string, message: string}} Result.
 */
function dualReadLegacyResource({ raw, workflowMode, declaredModes, aliasEntries } = {}) {
  if (typeof raw !== 'string' || raw.length === 0) {
    return { ok: false, code: 'EMPTY_INPUT', message: 'raw resource string is empty' };
  }

  if (workflowMode) {
    try {
      return { ok: true, pair: makeTypedPair(workflowMode, raw) };
    } catch {
      // Not already canonical under the supplied workflowMode; fall through
      // to the declared legacy shapes below.
    }
  }

  const packetQualified = resolvePacketQualified(raw, declaredModes);
  if (packetQualified) return { ok: true, pair: packetQualified };

  const sharedAlias = resolveSharedAlias(raw, aliasEntries);
  if (sharedAlias) return { ok: true, pair: sharedAlias };

  return { ok: false, code: 'UNRECOGNIZED_LEGACY_SHAPE', message: `no declared mode or alias resolves this string: ${raw}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CANONICAL BYTES + DIGEST
// ─────────────────────────────────────────────────────────────────────────────

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortDeep(value[key]);
    return out;
  }
  return value;
}

/**
 * Serialize a manifest object into byte-stable bytes: keys sorted recursively,
 * fixed 2-space indent, a single trailing newline. The same logical manifest
 * always produces identical bytes regardless of property insertion order, so
 * a generator's `--check` mode can compare against a committed file byte for
 * byte instead of doing a semantic diff.
 *
 * @param {Object} manifestObject - Manifest to serialize.
 * @returns {Buffer} UTF-8 encoded, byte-stable manifest bytes.
 */
function canonicalManifestBytes(manifestObject) {
  const sorted = sortDeep(manifestObject);
  const json = JSON.stringify(sorted, null, 2);
  return Buffer.from(`${json}\n`, 'utf8');
}

/**
 * SHA-256 hex digest of manifest bytes (typically the output of
 * canonicalManifestBytes).
 *
 * @param {Buffer|string} bytes - Bytes to digest.
 * @returns {string} Hex-encoded SHA-256 digest.
 */
function digestManifestBytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

/**
 * Assemble a canonical manifest object from raw per-mode leaf lists: dedupes
 * and validates each mode's leaves through normalizeLeafResourceId, sorts
 * leaves within a mode and sorts modes by workflowMode. Pure; does not touch
 * the filesystem or attach a generation timestamp, so the result stays a
 * function of its logical input only.
 *
 * @param {Object} args - Manifest inputs.
 * @param {number} [args.resourceContractVersion] - Contract version to record.
 * @param {Array<{workflowMode: string, packet: string, leaves: string[]}>} args.modeEntries - Raw per-mode leaf lists.
 * @returns {{resourceContractVersion: number, modes: Array<{workflowMode: string, packet: string, leaves: string[]}>}} Canonical manifest.
 */
function buildManifest({ resourceContractVersion = CONTRACT_VERSION, modeEntries } = {}) {
  const modes = (modeEntries || [])
    .map((entry) => ({
      workflowMode: entry.workflowMode,
      packet: entry.packet,
      leaves: [...new Set((entry.leaves || []).map((leaf) => normalizeLeafResourceId(leaf)))].sort(),
    }))
    .sort((a, b) => a.workflowMode.localeCompare(b.workflowMode));
  return { resourceContractVersion, modes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ContractError,
  CONTRACT_VERSION,
  LEAF_ROOTS,
  assertContainment,
  normalizeLeafResourceId,
  makeTypedPair,
  compositeKey,
  parseCompositeKey,
  findDuplicateComposites,
  resolvePacketQualified,
  resolveSharedAlias,
  dualReadLegacyResource,
  canonicalManifestBytes,
  digestManifestBytes,
  buildManifest,
};
