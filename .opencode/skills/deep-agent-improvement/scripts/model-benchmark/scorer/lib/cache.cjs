'use strict';

/**
 * lib/cache.cjs
 *
 * Atomic, append-only cache layer for the 002-eval-rig pipeline.
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
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');
const CACHE_ROOT = path.join(PACKET_ROOT, 'cache');
const VALID_KINDS = new Set(['det', 'grader']);
const LOCK_TTL_MS = 5 * 60 * 1000;
const LOCK_RETRY_INTERVAL_MS = 50;
const LOCK_WAIT_MAX_MS = 5 * 60 * 1000;
const GRADER_MODEL_BUILD_HASH_PLACEHOLDER = 'claude-sonnet-4.6@2026-04-01';

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function canonicalConcat(parts) {
  // Pipe-delimited canonical concatenation; pipes inside parts are escaped.
  return parts
    .map((p) => String(p === undefined || p === null ? '' : p).replace(/\|/g, '\\|'))
    .join('|');
}

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

function ensureKindDir(kind) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  const dir = path.join(CACHE_ROOT, kind);
  fs.mkdirSync(dir, { recursive: true });
  const indexFile = path.join(dir, 'index.jsonl');
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, '', { flag: 'wx' });
  }
  return dir;
}

function lockDir(kind, key) {
  return path.join(CACHE_ROOT, kind, `.lock-${key}`);
}

function blobPath(kind, key) {
  return path.join(CACHE_ROOT, kind, `${key}.out.md`);
}

function indexPath(kind) {
  return path.join(CACHE_ROOT, kind, 'index.jsonl');
}

function acquireLock(kind, key) {
  ensureKindDir(kind);
  const lockPath = lockDir(kind, key);
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

function writeAtomic(kind, key, outputText, metadata) {
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
  const lockPath = acquireLock(kind, key);
  try {
    const target = blobPath(kind, key);
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
    fs.appendFileSync(indexPath(kind), row, 'utf8');
    return { key, target, kind };
  } finally {
    releaseLock(lockPath);
  }
}

function read(kind, key) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  const target = blobPath(kind, key);
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

function cacheHit(kind, key) {
  return fs.existsSync(blobPath(kind, key));
}

function readIndex(kind) {
  ensureKindDir(kind);
  const raw = fs.readFileSync(indexPath(kind), 'utf8');
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

function rebuildIndex(kind) {
  if (!VALID_KINDS.has(kind)) {
    throw new Error(`unknown cache kind: ${kind}`);
  }
  ensureKindDir(kind);
  const dir = path.join(CACHE_ROOT, kind);
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
  const tmp = `${indexPath(kind)}.tmp.${process.pid}.${Date.now()}`;
  fs.writeFileSync(tmp, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''), 'utf8');
  fs.renameSync(tmp, indexPath(kind));
  return { kind, rebuilt_count: rows.length };
}

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
