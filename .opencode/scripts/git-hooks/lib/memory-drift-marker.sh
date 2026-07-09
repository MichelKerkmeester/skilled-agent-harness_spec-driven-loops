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

// Mirrors core/config.ts's computeDatabasePaths() precedence so the marker always
// lands in the same directory the consumer's resolveMemoryDriftMarkerPath() derives
// for the live, currently-open DB: SPEC_KIT_DB_DIR/SPECKIT_DB_DIR wins if set, else
// MEMORY_DB_PATH's parent directory if set, else the existing hardcoded default.
// With no override set this resolves to the exact same directory the hook
// always wrote to -- the precedence order only changes behavior when an
// override is actually set, so the common case is unaffected.
const defaultMarkerDir = path.join(repoRoot, '.opencode/skills/system-spec-kit/mcp_server/database');
const runtimeDbDir = (process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || '').trim();
const runtimeDbPath = (process.env.MEMORY_DB_PATH || '').trim();
const markerDir = runtimeDbDir
  ? path.resolve(runtimeDbDir)
  : runtimeDbPath
    ? path.dirname(path.resolve(runtimeDbPath))
    : defaultMarkerDir;
fs.mkdirSync(markerDir, { recursive: true });
const markerPath = path.join(markerDir, '.memory-drift-dirty-paths.json');

// A killed hook process can leave this lock directory orphaned between a
// successful mkdirSync and the finally-block release below. Without a
// staleness check every later invocation just retries for 5s and exits 0,
// so Layer 2 goes silently and permanently dead after one kill. Normal lock
// hold time is sub-second (a single short git-hook subprocess), so this sits
// comfortably above both that and the 5s wait budget while still recovering
// within a small, bounded number of commits after a kill.
const LOCK_STALE_MS = 45_000;

// Rename-then-remove so a lock a concurrent hook process is mid-acquiring is
// never destructively deleted out from under it -- only a confirmed-successful
// rename is treated as a reclaim.
function reclaimStaleLock(dir) {
  const reclaimedDir = `${dir}.reclaiming-${process.pid}-${Date.now()}`;
  try {
    fs.renameSync(dir, reclaimedDir);
  } catch (error) {
    return Boolean(error && error.code === 'ENOENT');
  }
  if (fs.existsSync(dir) || !fs.existsSync(reclaimedDir)) return false;
  try { fs.rmSync(reclaimedDir, { recursive: true, force: true }); } catch (_) {}
  return true;
}

const lockDir = `${markerPath}.lock`;
const started = Date.now();
while (true) {
  try {
    fs.mkdirSync(lockDir);
    break;
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      let stats = null;
      try { stats = fs.statSync(lockDir); } catch (_) { stats = null; }
      // A stat failure (dir vanished mid-check, permissions) can't confirm
      // staleness -- fail closed into the existing wait-and-retry behavior.
      if (stats && (Date.now() - stats.mtimeMs) > LOCK_STALE_MS) {
        if (reclaimStaleLock(lockDir)) continue;
      }
    }
    if (Date.now() - started > 5000) process.exit(0);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
  }
}

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
  try { fs.rmSync(lockDir, { recursive: true, force: true }); } catch (_) {}
}
NODE
}
