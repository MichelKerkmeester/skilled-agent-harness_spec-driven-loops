// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ cache.cjs — atomic append-only cache layer for the eval pipeline          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Atomic, append-only cache layer for the eval-rig pipeline.
 * Two cache kinds live side by side under cache/:
 *   cache/det/      Deterministic check results (regex-checkable; grader-independent).
 *   cache/grader/   Grader-call results (depend on rubric_version + grader_model_build_hash).
 *
 * Storage model:
 *   cache/<kind>/index.jsonl        Append-only index, one JSON row per entry.
 *   cache/<kind>/<key>.out.md       Atomic blob storage (temp+rename), one file per key.
 *
 * Concurrency model:
 *   cache/<kind>/.lock-<key>/       Mkdir-based advisory lock; POSIX atomic mkdir.
 *                                    5-minute TTL stale-lock auto-clear.
 *
 * Cache keys are 32-char SHA-256 hex prefixes derived from canonicalized input bundles.
 *
 * Grader model build hash: hardcoded placeholder "claude-sonnet-4.6@2026-04-01" today.
 * TODO: replace with the real API model-version header captured at dispatch time
 *       (read from response headers when the grader call lands).
 *
 * The cache root is run-scoped. write_atomic / read / cache_hit / read_index /
 * rebuild_index accept an optional final cacheRoot argument. When omitted they
 * fall back to the legacy in-repo CACHE_ROOT so existing callers keep working,
 * but run-scoped callers (the grader harness) pass a per-run outputs directory
 * instead of writing into a shared in-repo location that is trusted on the
 * cache-hit path.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PACKET_ROOT = path.resolve(__dirname, '..');
const CACHE_ROOT = path.join(PACKET_ROOT, 'cache');
const VALID_KINDS = new Set(['det', 'grader']);
const LOCK_TTL_MS = 5 * 60 * 1000;
const LOCK_RETRY_INTERVAL_MS = 50;
const LOCK_WAIT_MAX_MS = 5 * 60 * 1000;
const GRADER_MODEL_BUILD_HASH_PLACEHOLDER = 'claude-sonnet-4.6@2026-04-01';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function canonicalConcat(parts) {
  // Pipe-delimited canonical concatenation; pipes inside parts are escaped.
  return parts
    .map((p) => String(p === undefined || p === null ? '' : p).replace(/\|/g, '\\|'))
    .join('|');
}

/**
 * Derive a deterministic-check cache key from its canonicalized input bundle.
 *
 * @param {Object} input - Key components.
 * @param {string} input.variant_hash - Variant identity hash.
 * @param {string} input.fixture_id - Fixture identifier.
 * @param {string} input.check_name - Deterministic check name.
 * @param {string} [input.check_version] - Check version (defaults to '1.0.0').
 * @returns {string} 32-char SHA-256 hex prefix.
 */
function deriveDetKey({ variant_hash, fixture_id, check_name, check_version }) {
  if (!variant_hash || !fixture_id || !check_name) {
    throw new Error('derive_det_key requires variant_hash, fixture_id, check_name');
  }
  const concat = canonicalConcat([
    'det:v1',
    variant_hash,
    fixture_id,
    check_name,
    check_version || '1.0.0',
  ]);
  return sha256Hex(concat).slice(0, 32);
}

/**
 * Derive a grader-call cache key from its canonicalized input bundle.
 *
 * @param {Object} input - Key components.
 * @param {string} input.variant_hash - Variant identity hash.
 * @param {string} input.fixture_id - Fixture identifier.
 * @param {string} input.rubric_version - Rubric version.
 * @param {string} [input.grader_model_build_hash] - Grader model build hash (defaults to placeholder).
 * @param {string} input.dim_id - Scoring dimension id.
 * @param {string} input.swe16_output_hash - Hash of the candidate output under grade.
 * @returns {string} 32-char SHA-256 hex prefix.
 */
function deriveGraderKey({
  variant_hash,
  fixture_id,
  rubric_version,
  grader_model_build_hash,
  dim_id,
  swe16_output_hash,
}) {
  if (
    !variant_hash ||
    !fixture_id ||
    !rubric_version ||
    !dim_id ||
    !swe16_output_hash
  ) {
    throw new Error(
      'derive_grader_key requires variant_hash, fixture_id, rubric_version, dim_id, swe16_output_hash'
    );
  }
  const buildHash = grader_model_build_hash || GRADER_MODEL_BUILD_HASH_PLACEHOLDER;
  const concat = canonicalConcat([
    'grader:v1',
    rubric_version,
    variant_hash,
    fixture_id,
    dim_id,
    swe16_output_hash,
    buildHash,
  ]);
  return sha256Hex(concat).slice(0, 32);
}

// Resolve the active cache root. Callers may pass a run-scoped dir;
// undefined falls back to the legacy in-repo CACHE_ROOT for backward compatibility.
function resolveCacheRoot(cacheRoot) {
  return cacheRoot ? path.resolve(cacheRoot) : CACHE_ROOT;
}

function ensureKindDir(kind, cacheRoot) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  const dir = path.join(resolveCacheRoot(cacheRoot), kind);
  fs.mkdirSync(dir, { recursive: true });
  const indexFile = path.join(dir, 'index.jsonl');
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, '', { flag: 'wx' });
  }
  return dir;
}

function lockDir(kind, key, cacheRoot) {
  return path.join(resolveCacheRoot(cacheRoot), kind, `.lock-${key}`);
}

function blobPath(kind, key, cacheRoot) {
  return path.join(resolveCacheRoot(cacheRoot), kind, `${key}.out.md`);
}

function indexPath(kind, cacheRoot) {
  return path.join(resolveCacheRoot(cacheRoot), kind, 'index.jsonl');
}

function acquireLock(kind, key, cacheRoot) {
  ensureKindDir(kind, cacheRoot);
  const lockPath = lockDir(kind, key, cacheRoot);
  const start = Date.now();
  while (Date.now() - start < LOCK_WAIT_MAX_MS) {
    try {
      fs.mkdirSync(lockPath, { recursive: false });
      return lockPath;
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
      // Stale-lock check.
      try {
        const st = fs.statSync(lockPath);
        if (Date.now() - st.mtimeMs > LOCK_TTL_MS) {
          // Force-clear stale lock and retry.
          fs.rmSync(lockPath, { recursive: true, force: true });
          continue;
        }
      } catch (_) {
        // Lock disappeared between EEXIST and stat; retry immediately.
        continue;
      }
      // Active lock; sleep and retry.
      const sleepEnd = Date.now() + LOCK_RETRY_INTERVAL_MS;
      while (Date.now() < sleepEnd) {
        // Busy-wait short interval to keep this dependency-free.
      }
    }
  }
  throw new Error(`acquireLock timeout for ${kind}:${key}`);
}

function releaseLock(lockPath) {
  try {
    fs.rmSync(lockPath, { recursive: true, force: true });
  } catch (_) {
    // best-effort
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Atomically write a cache blob and append its index row under a per-key lock.
 *
 * @param {string} kind - Cache kind ('det' or 'grader').
 * @param {string} key - Cache key.
 * @param {string} outputText - Blob body text to persist.
 * @param {Object} [metadata] - Extra metadata merged into the blob header and index row.
 * @param {string} [cacheRoot] - Optional run-scoped cache root; falls back to legacy CACHE_ROOT.
 * @returns {{key: string, target: string, kind: string}} Write descriptor.
 */
function writeAtomic(kind, key, outputText, metadata, cacheRoot) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('key required');
  }
  if (typeof outputText !== 'string') {
    throw new Error('outputText must be a string');
  }
  const meta = metadata || {};
  const lockPath = acquireLock(kind, key, cacheRoot);
  try {
    const target = blobPath(kind, key, cacheRoot);
    // Compose a JSON-comment header so the blob is self-describing.
    const header = '<!-- cache-meta ' + JSON.stringify({
      kind,
      key,
      created_at: new Date().toISOString(),
      ...meta,
    }) + ' -->\n';
    const payload = header + outputText;
    const tmp = `${target}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    fs.writeFileSync(tmp, payload, 'utf8');
    fs.renameSync(tmp, target);

    // Append index row atomically (append is POSIX-atomic for small writes).
    const row = JSON.stringify({
      key,
      created_at: new Date().toISOString(),
      ...meta,
    }) + '\n';
    fs.appendFileSync(indexPath(kind, cacheRoot), row, 'utf8');
    return { key, target, kind };
  } finally {
    releaseLock(lockPath);
  }
}

/**
 * Read a cache blob and split its self-describing metadata header from the body.
 *
 * @param {string} kind - Cache kind ('det' or 'grader').
 * @param {string} key - Cache key.
 * @param {string} [cacheRoot] - Optional run-scoped cache root; falls back to legacy CACHE_ROOT.
 * @returns {?{key: string, kind: string, metadata: Object, body: string}} Entry, or null if absent.
 */
function read(kind, key, cacheRoot) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  const target = blobPath(kind, key, cacheRoot);
  if (!fs.existsSync(target)) {
    return null;
  }
  const raw = fs.readFileSync(target, 'utf8');
  const headerMatch = raw.match(/^<!-- cache-meta (.+?) -->\n/);
  let metadata = {};
  let body = raw;
  if (headerMatch) {
    try {
      metadata = JSON.parse(headerMatch[1]);
    } catch (_) {
      metadata = { parse_error: true };
    }
    body = raw.slice(headerMatch[0].length);
  }
  return { key, kind, metadata, body };
}

/**
 * Report whether a cache blob exists for the given kind and key.
 *
 * @param {string} kind - Cache kind ('det' or 'grader').
 * @param {string} key - Cache key.
 * @param {string} [cacheRoot] - Optional run-scoped cache root; falls back to legacy CACHE_ROOT.
 * @returns {boolean} True when the blob exists.
 */
function cacheHit(kind, key, cacheRoot) {
  return fs.existsSync(blobPath(kind, key, cacheRoot));
}

/**
 * Read and parse the append-only index for a cache kind.
 *
 * @param {string} kind - Cache kind ('det' or 'grader').
 * @param {string} [cacheRoot] - Optional run-scoped cache root; falls back to legacy CACHE_ROOT.
 * @returns {Array<Object>} Parsed index rows (malformed lines marked with parse_error).
 */
function readIndex(kind, cacheRoot) {
  ensureKindDir(kind, cacheRoot);
  const raw = fs.readFileSync(indexPath(kind, cacheRoot), 'utf8');
  if (!raw.trim()) {
    return [];
  }
  const rows = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch (err) {
      rows.push({ parse_error: true, raw: line });
    }
  }
  return rows;
}

/**
 * Rebuild the index for a cache kind by reconstructing it from blob headers.
 *
 * @param {string} kind - Cache kind ('det' or 'grader').
 * @param {string} [cacheRoot] - Optional run-scoped cache root; falls back to legacy CACHE_ROOT.
 * @returns {{kind: string, rebuilt_count: number}} Rebuild summary.
 */
function rebuildIndex(kind, cacheRoot) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  ensureKindDir(kind, cacheRoot);
  const dir = path.join(resolveCacheRoot(cacheRoot), kind);
  const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.out.md'));
  const rows = [];
  for (const f of entries) {
    const blob = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = blob.match(/^<!-- cache-meta (.+?) -->\n/);
    let metadata = {};
    if (m) {
      try {
        metadata = JSON.parse(m[1]);
      } catch (_) {
        metadata = { parse_error: true };
      }
    }
    const key = f.replace(/\.out\.md$/, '');
    rows.push({
      key,
      reconstructed: true,
      reconstructed_at: new Date().toISOString(),
      ...metadata,
    });
  }
  const tmp = `${indexPath(kind, cacheRoot)}.tmp.${process.pid}.${Date.now()}`;
  fs.writeFileSync(tmp, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''), 'utf8');
  fs.renameSync(tmp, indexPath(kind, cacheRoot));
  return { kind, rebuilt_count: rows.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // exports as snake_case to match the spec contract
  derive_det_key: deriveDetKey,
  derive_grader_key: deriveGraderKey,
  write_atomic: writeAtomic,
  read,
  cache_hit: cacheHit,
  read_index: readIndex,
  rebuild_index: rebuildIndex,
  // constants used by other modules
  PACKET_ROOT,
  CACHE_ROOT,
  GRADER_MODEL_BUILD_HASH_PLACEHOLDER,
  LOCK_TTL_MS,
};
