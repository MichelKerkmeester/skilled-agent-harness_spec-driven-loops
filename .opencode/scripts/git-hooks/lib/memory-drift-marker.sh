#!/usr/bin/env bash
# Shared memory-index drift marker writer for git lifecycle hooks.

mark_memory_drift_from_diff() {
  if [ "${SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK:-0}" = "1" ]; then
    return 0
  fi

  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
  if [ -z "$repo_root" ]; then
    return 0
  fi

  local diff_output
  diff_output="$(git diff-tree --no-commit-id -r -M --name-status "$@" -- .opencode/specs 2>/dev/null || true)"
  if [ -z "$diff_output" ]; then
    return 0
  fi

  if ! command -v node >/dev/null 2>&1; then
    return 0
  fi

  MEMORY_DRIFT_DIFF="$diff_output" \
  MEMORY_DRIFT_REPO_ROOT="$repo_root" \
  MEMORY_DRIFT_SOURCE="$(basename "$0")" \
  node <<'NODE'
const fs = require('node:fs');
const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');

const diff = process.env.MEMORY_DRIFT_DIFF || '';
const repoRoot = process.env.MEMORY_DRIFT_REPO_ROOT || '';
const source = process.env.MEMORY_DRIFT_SOURCE || 'git-hook';
if (!repoRoot || !diff.trim()) process.exit(0);

const entries = [];
for (const line of diff.split(/\r?\n/)) {
  const parts = line.split('\t');
  const status = parts[0] || '';
  if (status.startsWith('R') && parts[1] && parts[2]) {
    entries.push({ kind: 'rename', oldPath: parts[1], newPath: parts[2], source });
  } else if (status === 'D' && parts[1]) {
    entries.push({ kind: 'delete', oldPath: parts[1], source });
  }
}
if (entries.length === 0) process.exit(0);

function realpathAllowMissing(targetPath) {
  const resolvedPath = path.resolve(targetPath);
  if (fs.existsSync(resolvedPath)) {
    return fs.realpathSync(resolvedPath);
  }

  const parentPath = path.dirname(resolvedPath);
  if (parentPath === resolvedPath) {
    return resolvedPath;
  }

  return path.join(realpathAllowMissing(parentPath), path.basename(resolvedPath));
}

function isPathInside(candidate, prefix) {
  const relative = path.relative(prefix, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

// Keep database-path precedence, symlink canonicalization, and safety boundaries
// identical to the consumer so both processes address the same marker namespace.
const defaultMarkerDir = path.join(repoRoot, '.opencode/skills/system-spec-kit/mcp_server/database');
const runtimeDbDir = (process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || '').trim();
const runtimeDbPath = (process.env.MEMORY_DB_PATH || '').trim();
const resolvedRuntimeDbPath = runtimeDbPath
  ? path.resolve(process.cwd(), runtimeDbPath)
  : null;
const databaseDir = runtimeDbDir
  ? path.resolve(process.cwd(), runtimeDbDir)
  : resolvedRuntimeDbPath
    ? path.dirname(resolvedRuntimeDbPath)
    : defaultMarkerDir;
const markerDir = realpathAllowMissing(databaseDir);
const allowedPrefixes = [process.cwd(), os.homedir()].map(realpathAllowMissing);
try {
  const tmpDir = os.tmpdir();
  allowedPrefixes.push(realpathAllowMissing(tmpDir));
} catch { /* os.tmpdir may be unavailable in test environments */ }
if (!allowedPrefixes.some((prefix) => isPathInside(markerDir, prefix))) {
  throw new Error(
    `Database directory "${markerDir}" is outside the allowed project, home, and temporary directories. ` +
    `Set SPEC_KIT_DB_DIR to a path within one of those boundaries.`
  );
}
fs.mkdirSync(markerDir, { recursive: true });
const markerPath = path.join(markerDir, '.memory-drift-dirty-paths.json');

// The startup recovery sweep uses these exact lock constants and owner shape.
// A live PID remains authoritative even when a paused process cannot heartbeat;
// stale timestamps only make missing or invalid ownership reclaimable.
const LOCK_STALE_MS = 45_000;
const LOCK_HEARTBEAT_MS = 15_000;
const LOCK_WAIT_MS = 25;
const LOCK_WAIT_TIMEOUT_MS = 5_000;
const LOCK_OWNER_FILENAME = 'owner.json';

function parseLockOwner(raw) {
  try {
    const owner = JSON.parse(raw);
    return owner
      && owner.version === 1
      && Number.isSafeInteger(owner.pid)
      && owner.pid > 0
      && typeof owner.token === 'string'
      && owner.token.length > 0
      && typeof owner.heartbeatAt === 'string'
      ? owner
      : null;
  } catch (_) {
    return null;
  }
}

function readLockSnapshot(dir) {
  let stats;
  try {
    stats = fs.statSync(dir);
  } catch (_) {
    return null;
  }

  let rawOwner = null;
  try {
    rawOwner = fs.readFileSync(path.join(dir, LOCK_OWNER_FILENAME), 'utf8');
  } catch (error) {
    if (!error || error.code !== 'ENOENT') return null;
  }
  return { stats, rawOwner, owner: rawOwner === null ? null : parseLockOwner(rawOwner) };
}

function ownerLiveness(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error && error.code === 'ESRCH') return false;
    if (error && error.code === 'EPERM') return true;
    return null;
  }
}

function writeLockOwner(dir, owner) {
  const nextOwner = { ...owner, heartbeatAt: new Date().toISOString() };
  const ownerPath = path.join(dir, LOCK_OWNER_FILENAME);
  const tempPath = path.join(dir, `.owner-${owner.pid}-${owner.token}.tmp`);
  try {
    fs.writeFileSync(tempPath, `${JSON.stringify(nextOwner)}\n`, 'utf8');
    fs.renameSync(tempPath, ownerPath);
    const now = new Date();
    fs.utimesSync(dir, now, now);
    return nextOwner;
  } catch (error) {
    try { fs.unlinkSync(tempPath); } catch (_) {}
    throw error;
  }
}

function restoreMovedLock(movedDir, dir) {
  try {
    fs.renameSync(movedDir, dir);
  } catch (_) {
    // A replacement lock wins; leave the mismatched directory untouched.
  }
}

// Rename-then-remove so a lock a concurrent hook process is mid-acquiring is
// never removed by path after another owner acquires it. The snapshot check
// also prevents a stale observation from deleting a successor's live lock.
function reclaimEligibleLock(dir, snapshot) {
  const reclaimedDir = `${dir}.reclaiming-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(dir, reclaimedDir);
  } catch (_) {
    return false;
  }

  const movedSnapshot = readLockSnapshot(reclaimedDir);
  if (!movedSnapshot || movedSnapshot.rawOwner !== snapshot.rawOwner) {
    restoreMovedLock(reclaimedDir, dir);
    return false;
  }
  try { fs.rmSync(reclaimedDir, { recursive: true, force: true }); } catch (_) {}
  return true;
}

function releaseOwnedLock(dir, token) {
  const snapshot = readLockSnapshot(dir);
  if (!snapshot || !snapshot.owner || snapshot.owner.token !== token) return;

  const releasingDir = `${dir}.releasing-${process.pid}-${token}`;
  try {
    fs.renameSync(dir, releasingDir);
  } catch (_) {
    return;
  }
  const movedSnapshot = readLockSnapshot(releasingDir);
  if (!movedSnapshot || !movedSnapshot.owner || movedSnapshot.owner.token !== token) {
    restoreMovedLock(releasingDir, dir);
    return;
  }
  try { fs.rmSync(releasingDir, { recursive: true, force: true }); } catch (_) {}
}

function abandonUninitializedLock(dir) {
  const abandonedDir = `${dir}.abandoned-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(dir, abandonedDir);
    fs.rmSync(abandonedDir, { recursive: true, force: true });
  } catch (_) {}
}

const lockDir = `${markerPath}.lock`;
const lockOwner = {
  version: 1,
  pid: process.pid,
  token: crypto.randomUUID(),
  heartbeatAt: '',
};
const started = Date.now();
while (true) {
  try {
    fs.mkdirSync(lockDir);
    try {
      Object.assign(lockOwner, writeLockOwner(lockDir, lockOwner));
    } catch (_) {
      abandonUninitializedLock(lockDir);
      process.exit(0);
    }
    break;
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      const snapshot = readLockSnapshot(lockDir);
      if (snapshot) {
        const liveness = snapshot.owner ? ownerLiveness(snapshot.owner.pid) : null;
        const isMissingOwnerStale = !snapshot.owner
          && (Date.now() - snapshot.stats.mtimeMs) > LOCK_STALE_MS;
        if ((liveness === false || isMissingOwnerStale) && reclaimEligibleLock(lockDir, snapshot)) {
          continue;
        }
      }
    }
    if (Date.now() - started > LOCK_WAIT_TIMEOUT_MS) process.exit(0);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, LOCK_WAIT_MS);
  }
}

const heartbeatTimer = setInterval(() => {
  const snapshot = readLockSnapshot(lockDir);
  if (!snapshot || !snapshot.owner || snapshot.owner.token !== lockOwner.token) return;
  try { Object.assign(lockOwner, writeLockOwner(lockDir, lockOwner)); } catch (_) {}
}, LOCK_HEARTBEAT_MS);
heartbeatTimer.unref();

try {
  let current = { version: 1, entries: [] };
  try {
    current = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
  } catch (_) {
    current = { version: 1, entries: [] };
  }
  if (!current || current.version !== 1 || !Array.isArray(current.entries)) {
    current = { version: 1, entries: [] };
  }

  const now = new Date().toISOString();
  const byKey = new Map();
  const keyFor = (entry) => entry.kind === 'rename'
    ? `rename:${entry.oldPath}->${entry.newPath}`
    : `delete:${entry.oldPath}`;
  for (const entry of current.entries) byKey.set(keyFor(entry), entry);
  for (const entry of entries) byKey.set(keyFor(entry), { ...entry, observedAt: now });

  const payload = {
    version: 1,
    updatedAt: now,
    entries: Array.from(byKey.values()),
  };
  const tempPath = `${markerPath}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, markerPath);
} finally {
  clearInterval(heartbeatTimer);
  releaseOwnedLock(lockDir, lockOwner.token);
}
NODE
}
