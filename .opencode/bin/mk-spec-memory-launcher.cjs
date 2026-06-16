#!/usr/bin/env node
// [mk-spec-memory-launcher] MCP child-process launcher for the mk-spec-memory server.
// Loads project-local env overrides, ensures dist artifacts are built and current,
// serializes concurrent starts via a filesystem bootstrap lock, then spawns the
// context-server.js child. All stderr lines are tagged with the bracketed module
// prefix for ops grepping.

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const mss = require('./lib/model-server-supervision.cjs');
const { createSessionProxy } = require('./lib/launcher-session-proxy.cjs');

const {
  RESPAWN_REAP_GRACE_MS,
  HF_MODEL_SERVER_PID_FILE_NAME,
  acquireRespawnLockFileAt: acquireSharedRespawnLockFileAt,
  buildLeaseObject: buildSharedLeaseObject,
  canonicalizePath,
  computeBackoffMs,
  createCrashLoopGuard,
  createModelServerSupervisor: baseCreateModelServerSupervisor,
  defaultProcessRowsRunner,
  getCrashLoopConfig,
  getModelServerWatchdogConfig,
  getWatchdogConfig,
  isChildRunning,
  isRespawnLockStale,
  ensureCanonicalDir,
  normalizeWatchdogGraceMs,
  parseProcessRows,
  processLiveness,
  releaseRespawnLockFile,
  sampleProcessTreeRssMb,
  shouldAbortRelaunchOnFire,
  shouldSkipLaunch,
  signalProcess,
  superviseChildExit,
  waitForPidExit,
} = mss;

const root = path.resolve(__dirname, '..', '..');
const opencodeDir = path.join(root, '.opencode');

// Load project-local env overrides BEFORE spawning the MCP child. .env.local wins over
// .env, both are gitignored. Existing process.env wins over file values (do not override).
// Minimal parser — no external dependency.
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  let count = 0;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    // Strip matching outer quotes (single or double)
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
      count++;
    }
  }
  return count;
}

function isStrictModeDisabled(value) {
  if (value === undefined || value === null) return false;
  const v = String(value).trim().toLowerCase();
  return v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '';
}

let skillsDir = path.join(opencodeDir, 'skills');
let legacySkillDir = path.join(opencodeDir, 'skill');
let kitDir = path.join(skillsDir, 'system-spec-kit');
let dbDir = path.join(kitDir, 'mcp_server', 'database');
let lockDir = path.join(dbDir, '.mk-spec-memory-launcher.lockdir');
const PID_FILE_NAME = '.mk-spec-memory-launcher.json';
const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
let stateFile = path.join(dbDir, PID_FILE_NAME);
let canonicalCodeGraphDbDir = path.join(skillsDir, 'system-code-graph', 'mcp_server', 'database');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
// Generously above any realistic cold-cache build (npm ci + 2 tsc workspace builds) so the reclaim
// only fires for a genuinely abandoned lockdir, never a slow-but-live build holder.
const BOOTSTRAP_LOCK_STALE_MS = 300000;
let childProcess = null;
let ownerLeasePid = null;
let leaseStartedAt = null;
let launcherShutdownInProgress = false;
let rssBreachSelfExitInProgress = false;
let rssWatchdogTimer = null;
let crashLoopGuard = null;
let supervisorRelaunchTimer = null;
// The MCP host (Claude Code / OpenCode) spawns this launcher directly, so the host is the
// launcher's parent. When the host disposes its session the launcher is orphaned and its
// ppid changes (reparents to 1 / a subreaper). Captured once at startup so the relaunch
// path can tell "owning runtime went away" apart from a genuine daemon crash.
const LAUNCHER_INITIAL_PPID = process.ppid;
let ownerLeaseHeartbeatTimer = null;
let ownerLeaseRequired = true;
// Last-known descendant pids of the daemon child (excluding the child itself), refreshed by the
// process-tree monitor while the child is alive; the give-up reap path uses this to find an
// orphaned sidecar after the child has already exited.
let lastKnownDescendantPids = [];
const DURABLE_WRITE_UNAVAILABLE_CODES = new Set(['ENOSPC', 'EDQUOT', 'EROFS']);
const durableWriteWarnings = new Set();
// Daemon exit code meaning "another live process holds the database
// single-writer lock". Never counts toward the crash loop: the right move is
// bridging to the live owner (or a bounded retry while a maintenance script
// finishes), not relaunching a doomed second writer. Mirrored in
// mcp_server context-server (EXIT_DB_LOCK_HELD).
const EXIT_DB_LOCK_HELD = 86;
const DB_LOCK_HELD_MAX_RETRIES = 3;
let dbLockHeldRetries = 0;

function log(message) {
  process.stderr.write(`[mk-spec-memory-launcher] ${message}\n`);
  persistLauncherLogLine(`${new Date().toISOString()} [pid ${process.pid}] ${message}\n`);
}

function isDurableWriteUnavailable(error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  return DURABLE_WRITE_UNAVAILABLE_CODES.has(code);
}

function logDurableWriteUnavailableOnce(operation, targetPath, error) {
  const code = error && typeof error === 'object' ? error.code : 'UNKNOWN';
  const key = `${operation}:${targetPath}:${code}`;
  if (durableWriteWarnings.has(key)) return;
  durableWriteWarnings.add(key);
  const detail = error instanceof Error ? error.message : String(error ?? code);
  log(`${operation} skipped for ${rel(targetPath)}: ${code} ${detail}`);
}

// Persistent launcher log: log() writes to stderr, which the MCP host captures inconsistently; it
// ALSO appends here so an owner-disposal race or daemon flap is attributable after the fact from a
// durable file. The append is best-effort and size-bounded — a logging failure must never affect the
// launcher, and the file rotates to a single previous generation once it crosses the cap so it cannot
// grow without bound.
function launcherLogIsEnabled(env = process.env) {
  return env.SPECKIT_LAUNCHER_LOG !== '0';
}
function launcherLogMaxBytes(env = process.env) {
  return parsePositiveInteger(env.SPECKIT_LAUNCHER_LOG_MAX_BYTES, 1024 * 1024);
}
function resolveLauncherLogPath(env = process.env, baseDir = dbDir) {
  const override = env.SPECKIT_LAUNCHER_LOG_PATH;
  return typeof override === 'string' && override.trim()
    ? override.trim()
    : path.join(baseDir, '.mk-spec-memory-launcher.log');
}
function shouldRotateLauncherLog(currentSizeBytes, maxBytes) {
  return Number.isFinite(currentSizeBytes) && Number.isFinite(maxBytes) && currentSizeBytes > maxBytes;
}
function persistLauncherLogLine(line) {
  if (!launcherLogIsEnabled()) return;
  let target;
  try {
    target = resolveLauncherLogPath();
    try {
      const { size } = fs.statSync(target);
      if (shouldRotateLauncherLog(size, launcherLogMaxBytes())) {
        try {
          // Rotate to a DISTINCT sibling. A `.log` path keeps a `.prev.log` (still matched by the
          // *.log gitignore); any other operator-overridden path appends `.prev` so a non-`.log`
          // suffix still rotates instead of renaming the file onto itself and growing without bound.
          const rotated = target.endsWith('.log') ? target.replace(/\.log$/, '.prev.log') : `${target}.prev`;
          fs.renameSync(target, rotated);
        } catch {
          // Best-effort rotation: if the rename fails, keep appending to the current file.
        }
      }
    } catch (statErr) {
      if (statErr.code !== 'ENOENT') throw statErr;
    }
    fs.appendFileSync(target, line, { mode: 0o600 });
  } catch (error) {
    if (target && isDurableWriteUnavailable(error)) {
      logDurableWriteUnavailableOnce('launcher-log-append', target, error);
      return;
    }
    // Logging must never break the launcher.
  }
}

// Daemon re-election (on by default; set SPECKIT_DAEMON_REELECTION=0 or off to restore kill-on-disposal).
// When enabled the owner spawns the daemon detached and, on its own shutdown, RELEASES the daemon
// (leaves it running for a live secondary to bridge to) instead of killing it, so a session ending does
// not tear the shared backend out from under other sessions. A fresh session that finds the released
// daemon under a stale lease ADOPTS it through the bridge when the recorded child is alive and bridgeable;
// it reaps and respawns only when that daemon is dead or unbridgeable, so the database keeps a single
// writer either way. Disabling collapses every path below to the prior behavior (daemon tied to the owner,
// killed on shutdown). A released daemon reparents to pid 1, bounded by its idle self-exit, so the orphan
// sweeper bounds any leak.
function daemonReelectionEnabled(env = process.env) {
  return env.SPECKIT_DAEMON_REELECTION !== '0' && env.SPECKIT_DAEMON_REELECTION !== 'off';
}
function contextServerSpawnIo(reelectionEnabled) {
  return reelectionEnabled
    ? { detached: true, stdio: ['ignore', 'ignore', 'ignore'] }
    : { detached: false, stdio: ['ignore', 'ignore', 'inherit'] };
}
function shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon } = {}) {
  return Boolean(enabled) && Boolean(hasLiveDaemon);
}

function cleanupTmpFile(tmpPath) {
  try {
    fs.unlinkSync(tmpPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      // Best-effort cleanup only; the original durable-write failure is more useful.
    }
  }
}

function writeAtomicJsonFile(targetPath, payload, operation) {
  const currentPath = path.join(ensureCanonicalDir(path.dirname(targetPath)), path.basename(targetPath));
  const tmp = `${currentPath}.tmp.${process.pid}`;
  try {
    fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
    fs.renameSync(tmp, currentPath);
    return true;
  } catch (error) {
    cleanupTmpFile(tmp);
    if (isDurableWriteUnavailable(error)) {
      logDurableWriteUnavailableOnce(operation, currentPath, error);
      return false;
    }
    throw error;
  }
}

function loadProjectEnvFiles() {
  for (const fname of ['.env.local', '.env']) {
    const p = path.join(root, fname);
    if (fs.existsSync(p)) {
      const n = loadEnvFile(p);
      if (n > 0) process.stderr.write(`[mk-spec-memory-launcher] loaded ${n} env(s) from ${fname}\n`);
    }
  }
}

function parsePositiveInteger(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function loadBridgeModule() {
  try {
    return require('./lib/launcher-ipc-bridge.cjs');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return {
      async maybeBridgeLeaseHolder({ leaseResult }) {
        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
        return { action: 'report', reason: 'bridge-module-missing' };
      },
    };
  }
}

function resolveSessionProxySocketPath() {
  const { getIpcSocketPath } = loadBridgeModule();
  return getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
}

// Bridge a secondary (non-lease-holder) launcher's client stdio to the daemon through
// the reconnecting session proxy, so 2nd+ clients survive a daemon recycle transparently
// like the lease holder does — instead of the raw bridge that severs on recycle. Each
// secondary launcher process gets its own proxy instance (its own pendingRequests and
// cached-initialize state) because it owns its own stdio. The proxy owns stdout and emits
// JSON-RPC errors on failure, so the raw bridge's onError stdout marker is intentionally
// unused here (it would corrupt the MCP stream). createProxy is injectable for tests.
function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
  const createProxy = options.createProxy ?? createSessionProxy;
  const sessionProxy = createProxy({
    socketPath,
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    log,
  });
  return sessionProxy.start();
}

function refreshPaths() {
  skillsDir = path.join(opencodeDir, 'skills');
  legacySkillDir = path.join(opencodeDir, 'skill');
  kitDir = path.join(skillsDir, 'system-spec-kit');
  dbDir = path.join(kitDir, 'mcp_server', 'database');
  lockDir = path.join(dbDir, '.mk-spec-memory-launcher.lockdir');
  stateFile = path.join(dbDir, PID_FILE_NAME);
  canonicalCodeGraphDbDir = path.join(skillsDir, 'system-code-graph', 'mcp_server', 'database');
}

function exists(p) {
  return fs.existsSync(p);
}

function writeState(payload) {
  fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
}

function resolvedDbDir() {
  return canonicalizePath(dbDir);
}

function leasePath() {
  return path.join(resolvedDbDir(), PID_FILE_NAME);
}

function ownerLeasePath() {
  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
}

function legacyLeasePaths() {
  return [
    path.join(opencodeDir, 'skill', 'system-spec-kit', 'mcp_server', 'database', PID_FILE_NAME),
  ].map(canonicalizePath);
}

function readLeaseFile(filePath = leasePath()) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
    // Missing or corrupt lease files are treated as no active lease.
  }
  return null;
}

function readOwnerLeaseFile(filePath = ownerLeasePath()) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (
      Number.isInteger(parsed.ownerPid) &&
      Number.isInteger(parsed.ppid) &&
      typeof parsed.executablePath === 'string' &&
      typeof parsed.startedAtIso === 'string' &&
      typeof parsed.lastHeartbeatIso === 'string' &&
      Number.isInteger(parsed.ttlMs) &&
      typeof parsed.canonicalDbDir === 'string'
    ) {
      return parsed;
    }
  } catch {
    // Missing or corrupt owner leases are treated as no active owner.
  }
  return null;
}

function writeOwnerLeaseFile(lease) {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
  const tmp = `${currentLeasePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
  // fsync the temp file before the atomic rename so the lease contents survive a crash, matching
  // the durability of the exclusive write path; a renamed-but-unsynced lease can resurface empty
  // after power loss and break ownership detection.
  let fd;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') fs.closeSync(fd);
  }
  fs.renameSync(tmp, currentLeasePath);
}

function writeOwnerLeaseFileExclusive(lease) {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
  let fd;
  try {
    fd = fs.openSync(currentLeasePath, 'wx', 0o600);
    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
    fs.fsyncSync(fd);
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  } finally {
    if (typeof fd === 'number') fs.closeSync(fd);
  }
}

function buildOwnerLease(ownerPid = process.pid) {
  return {
    ownerPid,
    ppid: process.ppid,
    executablePath: process.execPath,
    startedAtIso: new Date().toISOString(),
    lastHeartbeatIso: new Date().toISOString(),
    ttlMs: 60000,
    canonicalDbDir: resolvedDbDir(),
  };
}

function readParentPid(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  if (process.platform === 'linux') {
    try {
      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
      const match = status.match(/^PPid:\s+(\d+)$/m);
      return match ? Number.parseInt(match[1], 10) : null;
    } catch {
      return null;
    }
  }
  const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  if (result.status !== 0 || !result.stdout) return null;
  const parsed = Number.parseInt(result.stdout.trim(), 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function classifyOwnerLease(lease) {
  const liveness = processLiveness(lease.ownerPid);
  if (liveness === 'dead') return 'stale-pid';
  if (liveness === 'unknown-eperm') return 'unknown-eperm';

  const actualPpid = readParentPid(lease.ownerPid);
  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
    return 'ppid-1-orphan';
  }

  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
  if (!Number.isFinite(heartbeatMs) || Date.now() - heartbeatMs > ttlMs * 2) {
    return 'stale-heartbeat-reclaim';
  }

  return 'live-owner';
}

function acquireOwnerLeaseFile() {
  const currentOwnerLeasePath = ownerLeasePath();
  const existing = readOwnerLeaseFile(currentOwnerLeasePath);

  if (existing) {
    const classification = classifyOwnerLease(existing);
    if (classification === 'live-owner' || classification === 'unknown-eperm') {
      return { acquired: false, holder: existing, classification };
    }
    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
  }

  const lease = buildOwnerLease(process.pid);
  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
  // only one racer can win: the loser's exclusive create hits EEXIST and returns
  // acquired:false instead of last-writer-wins overwriting the winner's lease.
  if (existing) {
    try {
      fs.unlinkSync(currentOwnerLeasePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (!writeOwnerLeaseFileExclusive(lease)) {
    const holder = readOwnerLeaseFile(currentOwnerLeasePath);
    return {
      acquired: false,
      holder: holder || lease,
      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
    };
  }
  ownerLeasePid = process.pid;
  return { acquired: true, lease, reclaimed: existing };
}

function refreshOwnerLeaseFile(ownerPid, patch = {}) {
  const lease = readOwnerLeaseFile();
  if (!lease || lease.ownerPid !== ownerPid) return false;
  const nextOwnerPid = patch.ownerPid ?? ownerPid;
  writeOwnerLeaseFile({
    ...lease,
    ...patch,
    lastHeartbeatIso: new Date().toISOString(),
  });
  const reread = readOwnerLeaseFile();
  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
  ownerLeasePid = nextOwnerPid;
  return true;
}

function clearOwnerLeaseHeartbeat() {
  if (ownerLeaseHeartbeatTimer) {
    clearInterval(ownerLeaseHeartbeatTimer);
    ownerLeaseHeartbeatTimer = null;
  }
}

function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
  clearOwnerLeaseHeartbeat();
  const lease = readOwnerLeaseFile();
  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
  const intervalMs = Math.max(1000, Math.floor(ttlMs / 2));
  ownerLeaseHeartbeatTimer = setInterval(() => {
    if (refreshOwnerLeaseFile(ownerPid)) return;
    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
    clearOwnerLeaseHeartbeat();
    void shutdownLauncherForSignal('SIGTERM').catch((error) => {
      log(error.stack || error.message);
      clearAllLeaseFiles();
      process.exit(128);
    });
  }, intervalMs);
  ownerLeaseHeartbeatTimer.unref?.();
}

function ownsOwnerLeaseFile(ownerPid = process.pid) {
  const lease = readOwnerLeaseFile();
  return lease?.ownerPid === ownerPid;
}

function clearOwnerLeaseFile() {
  if (!Number.isInteger(ownerLeasePid)) return;
  try {
    const lease = readOwnerLeaseFile();
    if (lease && lease.ownerPid === ownerLeasePid
        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
      fs.unlinkSync(ownerLeasePath());
    }
  } catch {
    // Idempotent cleanup.
  } finally {
    clearOwnerLeaseHeartbeat();
    ownerLeasePid = null;
  }
}

function clearOwnerLeaseFileIfOwner(ownerPid) {
  try {
    const lease = readOwnerLeaseFile();
    if (lease && lease.ownerPid === ownerPid
        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
      fs.unlinkSync(ownerLeasePath());
    }
  } catch {
    // Idempotent cleanup.
  }
}

function leaseHeldFromFile(filePath, legacyPath = null) {
  const lease = readLeaseFile(filePath);
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  // Surface the owner-recorded socket path so the bridge can prefer it over recomputing one that
  // may diverge under a different SPECKIT_IPC_SOCKET_DIR. Null when the lease predates this field.
  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
    throw error;
  }
}

function isLeaseHeld() {
  const primary = leaseHeldFromFile(leasePath());
  if (primary.held) return primary;

  for (const legacyPath of legacyLeasePaths()) {
    if (legacyPath === leasePath()) continue;
    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
    if (legacy.held || legacy.staleReclaimable) return legacy;
  }

  return primary;
}

function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
}

function writeLeaseHeldJsonRpcError(leaseResult, reason) {
  process.stdout.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id: null,
    error: {
      code: -32001,
      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
      data: { retryable: true },
    },
  })}\n`);
}

function bridgeReadiness(leaseResult) {
  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
    return { ready: false, reason: 'bridge-disabled' };
  }
  const storedSocketPath = leaseResult.socketPath;
  if (
    typeof storedSocketPath === 'string' &&
    storedSocketPath.length > 0 &&
    (storedSocketPath.startsWith('tcp://') || fs.existsSync(storedSocketPath))
  ) {
    return { ready: true, socketPath: storedSocketPath };
  }
  const { getIpcSocketPath } = loadBridgeModule();
  if (typeof getIpcSocketPath !== 'function') {
    return { ready: false, reason: 'bridge-module-missing' };
  }
  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
    return { ready: false, reason: 'no-bridge-socket' };
  }
  return { ready: true, socketPath };
}

function leaseResultForOwnerLease(ownerLease) {
  const pidLeaseResult = isLeaseHeld();
  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
    return pidLeaseResult;
  }
  return {
    held: true,
    ownerPid: ownerLease.ownerPid,
    staleReclaimable: false,
    startedAt: ownerLease.startedAtIso,
    legacyPath: null,
    socketPath: null,
  };
}

function respawnLockPath() {
  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
}

function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
}

function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
  return acquireSharedRespawnLockFileAt(lockPath, label, { log, rel });
}

function acquireRespawnLockFile() {
  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
}

function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
}

const UNCLEAN_SHUTDOWN_MARKER = '.unclean-shutdown';

// The context-server writes `.unclean-shutdown` on every DB open and removes it only after a
// successful WAL checkpoint + db.close(). The launcher uses its presence to tell whether a reaped
// child handed off the DB cleanly. Mirror the writer's location: the marker lives in the resolved
// DB dir, or — when MEMORY_DB_PATH relocates the DB — that path's dirname. Best-effort: a wrong
// guess only forfeits the clean-close confirmation; the replacement daemon's boot still self-heals.
function uncleanShutdownMarkerPath() {
  // Mirror the daemon's full path precedence, not just MEMORY_DB_PATH:
  // the daemon resolves its database dir from SPEC_KIT_DB_DIR /
  // SPECKIT_DB_DIR before falling back to the packaged default, and the
  // marker lives beside whatever database it actually opened. Checking the
  // static dir under a dir override silently forfeits clean-close detection.
  const fileOverride = process.env.MEMORY_DB_PATH?.trim();
  if (fileOverride) {
    return path.join(path.dirname(fileOverride), UNCLEAN_SHUTDOWN_MARKER);
  }
  const dirOverride = process.env.SPEC_KIT_DB_DIR?.trim() || process.env.SPECKIT_DB_DIR?.trim();
  const dir = dirOverride ? path.resolve(root, dirOverride) : resolvedDbDir();
  return path.join(dir, UNCLEAN_SHUTDOWN_MARKER);
}

function uncleanMarkerPresent() {
  try {
    return fs.existsSync(uncleanShutdownMarkerPath());
  } catch {
    return false;
  }
}

// A reap is a verified clean DB handoff only when the child exited on SIGTERM (not SIGKILL) AND the
// clean-shutdown marker is gone (close_db ran its checkpoint + close). Anything else means the
// replacement daemon will open a possibly-dirty shadow and must rebuild it at boot.
function cleanCloseAfterReap({ killed, markerPresent }) {
  return !killed && !markerPresent;
}

async function reapLeaseChildBeforeRespawn(childPid) {
  const liveness = processLiveness(childPid);
  if (liveness === 'unknown-eperm') {
    return { allowed: false, reason: 'child-liveness-unknown-eperm' };
  }
  if (liveness === 'dead') {
    return {
      allowed: true,
      reaped: false,
      cleanClose: cleanCloseAfterReap({ killed: false, markerPresent: uncleanMarkerPresent() }),
      reason: 'child-already-dead',
    };
  }

  log(`reaping recorded context-server child pid ${childPid} before respawn`);
  signalProcess(childPid, 'SIGTERM');
  reapProcessTreeGroups(childPid, { signal: signalProcess });
  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
  let killed = false;
  if (!exitedAfterTerm) {
    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
    signalProcess(childPid, 'SIGKILL');
    const exitedAfterKill = await waitForPidExit(childPid, 1000);
    killed = true;
    if (!exitedAfterKill) {
      // The child outlived SIGKILL within the grace window (uninterruptible state, or a pid we can
      // no longer confirm). Refuse to hand the database to a replacement while the recorded writer
      // may still be alive, so a caller never spawns a second writer onto the same WAL.
      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
      return { allowed: false, reason: 'child-kill-unconfirmed' };
    }
  }

  // Clean-close barrier: verify the child closed the DB cleanly (marker removed) before handing the
  // DB to a replacement daemon. If it did not (graceful close timed out, or we had to SIGKILL), log
  // it so the corruption window is visible — the replacement daemon's boot FTS auto-heal rebuilds the
  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
  const markerPresent = uncleanMarkerPresent();
  const cleanClose = cleanCloseAfterReap({ killed, markerPresent });
  if (!cleanClose) {
    log(`reaped context-server child pid ${childPid} WITHOUT a verified clean DB close (killed=${killed}, uncleanMarkerPresent=${markerPresent}); the replacement daemon will rebuild the FTS shadow at boot`);
  }
  return { allowed: true, reaped: true, cleanClose, reason: 'child-reaped' };
}

async function reapOwnerBeforeRespawn(ownerPid) {
  const liveness = processLiveness(ownerPid);
  if (liveness === 'unknown-eperm') {
    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
  }
  if (liveness === 'dead') {
    return { allowed: true, reason: 'owner-already-dead' };
  }

  // A socket probe cannot distinguish a genuinely-dead daemon from one that merely
  // refused the connection at its client cap (both look "closed before reply"). Before
  // killing a process that is still ALIVE, require the owner lease to be heartbeat-stale
  // too: a daemon that has refreshed its lease within its TTL is serving clients, not
  // dead, and must never be reaped on a socket-probe-only verdict regardless of cap.
  const currentOwner = readOwnerLeaseFile();
  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
    log(`spec-memory owner pid ${ownerPid} is heartbeat-fresh (live-owner); refusing socket-probe reap (likely cap-refusal, not death)`);
    return { allowed: false, reason: 'owner-heartbeat-fresh' };
  }

  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
  signalProcess(ownerPid, 'SIGTERM');
  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
  if (!exitedAfterTerm) {
    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
    signalProcess(ownerPid, 'SIGKILL');
    await waitForPidExit(ownerPid, 1000);
  }
  return { allowed: true, reason: 'owner-reaped' };
}

async function respawnAfterDeadSocket(leaseResult, decision) {
  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
  }

  const ownerPid = leaseResult.ownerPid;
  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
  }

  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
  const childPid = lease?.childPid;
  if (!Number.isInteger(childPid) || childPid <= 0) {
    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
  }

  let bootstrapLockHeld = false;
  let respawnLock = null;
  try {
    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
    respawnLock = acquireRespawnLockFile();
    if (!respawnLock.acquired) {
      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
    }

    const currentOwner = readOwnerLeaseFile();
    if (currentOwner?.ownerPid !== ownerPid) {
      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
    }

    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
    }

    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
    if (!ownerReapResult.allowed) {
      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
    }

    clearOwnerLeaseFileIfOwner(ownerPid);
    const ownerLease = buildOwnerLease(process.pid);
    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
      const holder = readOwnerLeaseFile();
      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
    }
    ownerLeasePid = process.pid;

    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
    if (!reapResult.allowed) {
      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
    }

    buildIfNeeded([]);
    leaseStartedAt = new Date().toISOString();
    writeLeaseFile();
    launchServer();
    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
  } finally {
    releaseRespawnLockFile(respawnLock);
    if (bootstrapLockHeld) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
  }
}

async function bridgeOrReportLeaseHeld(leaseResult) {
  const readiness = bridgeReadiness(leaseResult);
  if (!readiness.ready) {
    writeLeaseHeldJsonRpcError(leaseResult, readiness.reason);
    return { action: 'report', reason: readiness.reason };
  }
  const { maybeBridgeLeaseHolder } = loadBridgeModule();
  const decision = await maybeBridgeLeaseHolder({
    serviceName: 'mk-spec-memory',
    leaseResult,
    loggerPrefix: 'mk-spec-memory-launcher',
    dbDir: resolvedDbDir(),
    bridge: bridgeStdioThroughSessionProxy,
  });
  if (decision && decision.action === 'respawn') {
    return await respawnAfterDeadSocket(leaseResult, decision);
  }
  return decision;
}

async function bridgeOrReportLeaseHeldAndExit(leaseResult) {
  const decision = await bridgeOrReportLeaseHeld(leaseResult);
  if (!decision || decision.action === 'report') {
    clearOwnerLeaseFile();
    process.exit(0);
  }
  return decision;
}

function resolveModelServerSocketPath(env = process.env, options = {}) {
  return mss.resolveModelServerSocketPath(env, {
    ...options,
    dbDir: options.dbDir || resolvedDbDir,
  });
}

function getContextServerPid() {
  return isChildRunning(childProcess) ? childProcess.pid : null;
}

// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
// `socketPath` records the IPC path this owner actually listens on so a secondary launcher prefers
// it over recomputing one that can diverge under a different SPECKIT_IPC_SOCKET_DIR.
function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
}

function writeLeaseFile(childPid = getContextServerPid(), modelServerPid = hfControl.getPid()) {
  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
  return writeAtomicJsonFile(leasePath(), payload, 'lease write');
}

function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
  const pidDir = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
  return path.join(pidDir, HF_MODEL_SERVER_PID_FILE_NAME);
}

function writeSharedModelServerPid(pid) {
  const socketPath = resolveModelServerSocketPath();
  const pidPath = sharedModelServerPidPath(socketPath);
  if (!Number.isInteger(pid) || pid <= 0) {
    try {
      fs.unlinkSync(pidPath);
    } catch (error) {
      if (error.code === 'ENOENT') return true;
      if (isDurableWriteUnavailable(error)) {
        logDurableWriteUnavailableOnce('shared model-server pid clear', pidPath, error);
        return false;
      }
      throw error;
    }
    return true;
  }

  return writeAtomicJsonFile(pidPath, {
    pid,
    startedAt: new Date().toISOString(),
    ownerLauncher: 'mk-spec-memory',
    socketPath,
  }, 'shared model-server pid write');
}

function readSharedModelServerPid() {
  const pidPath = sharedModelServerPidPath();
  try {
    const parsed = JSON.parse(fs.readFileSync(pidPath, 'utf8'));
    if (Number.isInteger(parsed.pid) && parsed.pid > 0) return parsed.pid;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      // Corrupt pid files are treated like absent pid files; the respawn lock still serializes recovery.
    }
  }

  const lease = readLeaseFile();
  return Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0 ? lease.modelServerPid : null;
}

const hfControl = mss.createModelServerControl({
  log,
  env: process.env,
  rootDir: root,
  opencodeDir,
  dbDir: resolvedDbDir,
  getLauncherShutdownInProgress: () => launcherShutdownInProgress,
  onRssBreach: (cfg) => recycleDaemonInPlace(cfg.graceMs),
  bridge: loadBridgeModule(),
  writeModelServerPid: (pid) => writeSharedModelServerPid(pid),
  readModelServerPid: () => readSharedModelServerPid(),
  writeLease: () => writeLeaseFile(),
});

function clearLeaseFile() {
  try {
    const lease = readLeaseFile();
    if (launcherShutdownInProgress && Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0) {
      try {
        hfControl.reapProcessTree(lease.modelServerPid);
      } catch {
        // Lease cleanup must remain best-effort even if a final process-tree read fails.
      }
    }
    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
  } catch {
    // Idempotent cleanup.
  }
}

function clearAllLeaseFiles() {
  clearLeaseFile();
  clearOwnerLeaseFile();
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function enforceStandaloneCodeGraphDb(actions) {
  const current = process.env.SPECKIT_CODE_GRAPH_DB_DIR;
  const resolvedCurrent = current ? path.resolve(current) : null;
  const resolvedCanonical = path.resolve(canonicalCodeGraphDbDir);
  const specKitRoot = path.resolve(kitDir);

  if (!resolvedCurrent || isInside(specKitRoot, resolvedCurrent)) {
    process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedCanonical;
    actions.push(
      `set SPECKIT_CODE_GRAPH_DB_DIR=${rel(resolvedCanonical)} for standalone system-code-graph storage`
    );
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout) {
    process.stderr.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited ${result.status}`);
  }
}

function ensureLayout(actions) {
  if (!exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
    fs.renameSync(legacySkillDir, skillsDir);
    fs.symlinkSync('skills', legacySkillDir, 'dir');
    actions.push('promoted .opencode/skill to .opencode/skills and created compatibility symlink');
    refreshPaths();
    return;
  }

  if (exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
    const backup = path.join(opencodeDir, `skill_legacy_backup_${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`);
    fs.renameSync(legacySkillDir, backup);
    fs.symlinkSync('skills', legacySkillDir, 'dir');
    actions.push(`moved legacy .opencode/skill to ${rel(backup)} and created compatibility symlink`);
    refreshPaths();
    return;
  }

  // Compatibility symlink `.opencode/skill -> skills` removed; a prior cleanup cleaned
  // up consumers of the singular path, so the bridge no longer needs to be
  // recreated on every MCP startup. Migration paths above (rename / move-aside)
  // still create the symlink when an actual legacy singular dir is present.
}

function requiredArtifacts() {
  return [
    path.join(kitDir, 'mcp_server', 'dist', 'context-server.js'),
    path.join(kitDir, 'scripts', 'dist', 'graph', 'backfill-graph-metadata.js'),
    path.join(kitDir, 'scripts', 'dist', 'spec-folder', 'generate-description.js'),
  ];
}

function artifactsReady() {
  return requiredArtifacts().every(exists);
}

function buildIfNeeded(actions) {
  if (artifactsReady()) {
    return;
  }

  if (!exists(kitDir)) {
    throw new Error(`system-spec-kit not found at ${rel(kitDir)}`);
  }

  actions.push('installed dependencies and built @spec-kit/mcp-server plus @spec-kit/scripts');
  const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
  run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
  run('npm', ['run', 'build', '--workspace=@spec-kit/mcp-server'], { cwd: kitDir });
  run('npm', ['run', 'build', '--workspace=@spec-kit/scripts'], { cwd: kitDir });

  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
  if (missing.length > 0) {
    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
  }
}

function getContextServerNodeArgs() {
  const nodeArgs = [];
  const rawOldSpaceMb = process.env.SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB;
  if (rawOldSpaceMb === undefined || rawOldSpaceMb === null || String(rawOldSpaceMb).trim() === '') {
    return nodeArgs;
  }

  const parsedOldSpaceMb = Number.parseInt(String(rawOldSpaceMb).trim(), 10);
  if (!Number.isFinite(parsedOldSpaceMb) || parsedOldSpaceMb <= 0) {
    log(`ignoring invalid SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB=${JSON.stringify(rawOldSpaceMb)}`);
    return nodeArgs;
  }

  nodeArgs.push(`--max-old-space-size=${parsedOldSpaceMb}`);
  log(`applying context-server V8 old-space cap: ${parsedOldSpaceMb} MB`);
  return nodeArgs;
}

function waitForChildExit(child, timeoutMs) {
  if (!isChildRunning(child)) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (exited) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.off('exit', onExit);
      resolve(exited);
    };
    const onExit = () => finish(true);
    const timer = setTimeout(() => finish(false), timeoutMs);
    timer.unref?.();
    child.once('exit', onExit);
  });
}

// Refresh the before-death descendant snapshot from a live process-tree walk. Called periodically by
// the monitor while the child is alive. On an unknown/permission-denied read (null), the previous
// snapshot is KEPT (a transient ps failure must not erase the only handle on an orphan-able sidecar).
function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner) {
  return mss.refreshDescendantSnapshot(childPid, runner, {
    snapshotPids: lastKnownDescendantPids,
    snapshot: {
      set: (pids) => {
        lastKnownDescendantPids = pids;
      },
    },
  });
}

// Reap an orphaned sidecar on crash-loop give-up. The dominant RSS risk lives in a
// forked-detached sidecar GRANDCHILD; on hard daemon death it re-parents to pid 1, so a fresh walk
// anchored on the (now-dead, ps-absent) childPid finds nothing. We therefore reap the UNION of any
// still-live childPid subtree (the not-yet-reparented case) and the before-death snapshot
// (`lastKnownDescendantPids`), filtered to currently-alive, signalable pids. The signal-0 alive gate
// bounds (but cannot fully eliminate) pid-reuse risk; the snapshot is at most one monitor tick old.
function reapProcessTreeGroups(childPid, options = {}) {
  return mss.reapProcessTreeGroups(childPid, {
    ...options,
    snapshotPids: options.snapshotPids ?? lastKnownDescendantPids,
    signal: options.signal || signalProcess,
  });
}

// Dependency seam mirrors the launcher's other supervision helpers (startRssWatchdog,
// reapProcessTreeGroups): production callers pass only graceMs, so deps default to the live
// closures and runtime behavior is unchanged; tests inject fakes to assert lease handling.
async function recycleDaemonInPlace(graceMs, deps = {}) {
  const ctx = {
    getContextChild: deps.getContextChild ?? (() => childProcess),
    hfControl: deps.hfControl ?? hfControl,
    isChildRunning: deps.isChildRunning ?? isChildRunning,
    waitForChildExit: deps.waitForChildExit ?? waitForChildExit,
    clearLease: deps.clearLease ?? clearLeaseFile,
    clearWatchdog: deps.clearWatchdog ?? (() => { if (rssWatchdogTimer) clearInterval(rssWatchdogTimer); }),
    isRecycleInProgress: deps.isRecycleInProgress ?? (() => rssBreachSelfExitInProgress),
    setRecycleInProgress: deps.setRecycleInProgress ?? ((value) => { rssBreachSelfExitInProgress = value; }),
    log: deps.log ?? log,
  };
  if (ctx.isRecycleInProgress()) return;
  ctx.setRecycleInProgress(true);
  ctx.clearWatchdog();
  ctx.hfControl.clearTimers();
  await ctx.hfControl.stopDemandListener();
  const modelServerChild = ctx.hfControl.getChild();
  if (ctx.isChildRunning(modelServerChild)) {
    ctx.log(`RSS ceiling sustained; sending SIGTERM to hf-model-server pid ${modelServerChild.pid} before daemon recycle`);
    modelServerChild.kill('SIGTERM');
    ctx.hfControl.reapProcessTree(modelServerChild.pid);
    const modelExitedAfterTerm = await ctx.waitForChildExit(modelServerChild, graceMs);
    if (!modelExitedAfterTerm && ctx.isChildRunning(modelServerChild)) {
      ctx.log(`hf-model-server pid ${modelServerChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before daemon recycle`);
      modelServerChild.kill('SIGKILL');
      await ctx.waitForChildExit(modelServerChild, 1000);
    }
  }
  const contextChild = ctx.getContextChild();
  if (!ctx.isChildRunning(contextChild)) {
    ctx.clearLease();
    ctx.setRecycleInProgress(false);
    return;
  }

  ctx.log(`RSS ceiling sustained; sending SIGTERM to context-server pid ${contextChild.pid} before daemon recycle`);
  contextChild.kill('SIGTERM');
  const exitedAfterTerm = await ctx.waitForChildExit(contextChild, graceMs);
  if (!exitedAfterTerm && ctx.isChildRunning(contextChild)) {
    ctx.log(`context-server pid ${contextChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before daemon recycle`);
    contextChild.kill('SIGKILL');
    await ctx.waitForChildExit(contextChild, 1000);
  }
  // Keep the lease held across an in-place recycle. The launcher process stays alive and the
  // lease is keyed on its (still-live) pid, so the replacement daemon is respawned by the child
  // exit handler's scheduleRelaunch backoff. Clearing the lease here would open a window — until
  // relaunch rewrites childPid — where a concurrent launcher reads no lease and passes the
  // single-writer gate, producing a competing daemon. Relaunch (writeLeaseFile) rewrites childPid.
}

function startRssWatchdog(childPid, options = {}) {
  return mss.startRssWatchdog(childPid, {
    ...options,
    timerState: options.timerState || {
      get: () => rssWatchdogTimer,
      set: (timer) => {
        rssWatchdogTimer = timer;
      },
    },
    snapshot: options.snapshot || {
      set: (pids) => {
        lastKnownDescendantPids = pids;
      },
    },
    log: options.log || log,
    onBreach: options.onBreach || ((breachConfig) => recycleDaemonInPlace(breachConfig.graceMs)),
  });
}

// Launcher-local factory that pre-seeds the launcher-aware defaults (writeLease/shouldExitLauncher/
// onRssBreach) the shared lib intentionally leaves as generic no-ops. Keeps the launcher's exported
// createModelServerSupervisor + launchModelServer(options) seam byte-equivalent to pre-extraction HEAD.
// Explicit caller options still win via the trailing spread for targeted writeLease injection.
function createModelServerSupervisor(options = {}) {
  return baseCreateModelServerSupervisor({
    writeLease: () => writeLeaseFile(),
    shouldExitLauncher: () => launcherShutdownInProgress,
    onRssBreach: (cfg) => recycleDaemonInPlace(cfg.graceMs),
    ...options,
  });
}

function launchModelServer(options = null) {
  if (options && typeof options === 'object') {
    return createModelServerSupervisor(options).launch();
  }
  return hfControl.launch();
}

function startModelServerDemandListener(options = {}) {
  return hfControl.startDemandListener(options);
}

function stopModelServerDemandListener() {
  return hfControl.stopDemandListener();
}

const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';

// Returns the pid recorded inside the lock dir, or null when no readable pid
// stamp exists (legacy lock dirs, or a holder that died before stamping).
function readBootstrapLockOwnerPid() {
  try {
    const raw = fs.readFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), 'utf8').trim();
    const pid = Number.parseInt(raw, 10);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

// Reclaim a stale bootstrap lockdir. A lock is reclaimable as soon as its
// recorded holder is provably dead; the mtime TTL is only a fallback for lock
// dirs with no readable pid stamp (legacy dirs) or a holder whose liveness
// cannot be determined. Without the dead-holder check, a holder killed less than
// BOOTSTRAP_LOCK_STALE_MS ago wedges every requireLock respawn for the full wait
// deadline (the TTL exceeds the deadline by design for a slow-but-live build).
function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
  let ageMs;
  try {
    ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTEMPTY') return false;
    throw error;
  }
  const ownerPid = readBootstrapLockOwnerPid();
  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
  if (!ownerDead && ageMs <= staleMs) {
    return false;
  }
  // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
  // racer wins the rename; a successor that mkdir'd a fresh lockDir after our stat
  // creates a new inode that our rename/rmSync cannot touch, so we never delete a
  // live successor lock. A losing racer's rename throws ENOENT and falls through to
  // the outer retry.
  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
  try {
    fs.renameSync(lockDir, staleClaim);
    fs.rmSync(staleClaim, { recursive: true, force: true });
    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
    log(`reclaiming stale bootstrap lock ${rel(lockDir)} (${reason})`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTEMPTY') return false;
    throw error;
  }
}

async function acquireBootstrapLock(options = {}) {
  const requireLock = options.requireLock === true;
  fs.mkdirSync(dbDir, { recursive: true });
  const deadline = Date.now() + (options.timeoutMs ?? 120000);
  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
  const retrySleepMs = options.retrySleepMs ?? 1000;
  while (true) {
    try {
      fs.mkdirSync(lockDir);
      // Stamp the holder pid so a later launcher can reclaim this lock the
      // instant we die, instead of waiting out the mtime TTL. Best-effort: a
      // failed stamp degrades to the TTL path, never blocks acquisition.
      try {
        fs.writeFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), String(process.pid), { mode: 0o600 });
      } catch { /* TTL fallback covers an unstamped lock */ }
      return true;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
      if (removeStaleBootstrapLock(staleMs)) {
        continue;
      }
      if (artifactsReady() && !requireLock) {
        return false;
      }
      if (Date.now() > deadline) {
        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
      }
      await sleep(retrySleepMs);
    }
  }
}

function launchServer() {
  if (ownerLeaseRequired && !ownsOwnerLeaseFile(process.pid)) {
    log('launchServer skipped: spec-memory owner lease is absent or owned by another launcher');
    return false;
  }
  if (shouldSkipLaunch(childProcess)) {
    log('launchServer skipped: a context-server child is already running in this launcher process');
    return false;
  }
  if (!crashLoopGuard) crashLoopGuard = createCrashLoopGuard(getCrashLoopConfig());
  if (supervisorRelaunchTimer) {
    clearTimeout(supervisorRelaunchTimer);
    supervisorRelaunchTimer = null;
  }
  const server = path.join(kitDir, 'mcp_server', 'dist', 'context-server.js');
  const nodeArgs = getContextServerNodeArgs();
  const reelectionEnabled = daemonReelectionEnabled();
  const spawnIo = contextServerSpawnIo(reelectionEnabled);
  childProcess = spawn(process.execPath, [...nodeArgs, server], {
    cwd: root,
    env: {
      ...process.env,
      SPECKIT_BACKEND_ONLY: '1',
    },
    stdio: spawnIo.stdio,
    detached: spawnIo.detached,
  });
  // Re-election only: let the launcher exit without keeping the detached daemon tethered to it.
  if (reelectionEnabled) childProcess.unref();
  const childPid = childProcess.pid;
  const refreshed = refreshOwnerLeaseFile(process.pid);
  if (!refreshed) {
    log('owner lease refresh failed after child spawn; launcher pid remains the recorded owner');
  }
  startOwnerLeaseHeartbeat(process.pid);
  writeLeaseFile(childPid);
  startRssWatchdog(childPid);

  childProcess.on('exit', (code, signal) => {
    if (launcherShutdownInProgress) {
      return;
    }
    if (code === EXIT_DB_LOCK_HELD) {
      void handleDbLockHeldChildExit();
      return;
    }
    const result = superviseChildExit(
      { code, signal, childPid, intentional: false },
      {
        crashLoopGuard,
        clearLease: clearAllLeaseFiles,
        reapProcessGroup: reapProcessTreeGroups,
        mirrorSignal: (exitSignal) => process.kill(process.pid, exitSignal),
        exit: (exitCode) => process.exit(exitCode),
        scheduleRelaunch: (backoffMs) => {
          log(`context-server child exited code=${code ?? 'null'} signal=${signal ?? 'null'}; relaunching in ${backoffMs}ms`);
          supervisorRelaunchTimer = setTimeout(() => {
            // Owner-disposal race guard: by the time the backoff fires, re-check that this
            // launcher is still live AND its owning runtime is still present. Respawning the
            // daemon under a disposing session is what produced the SIGTERM/relaunch flap that
            // dropped every bridged session's transport. Crash-recovery and RSS-recycle are
            // unaffected — both run with the owning runtime alive and no shutdown in progress.
            if (shouldAbortRelaunchOnFire({ shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LAUNCHER_INITIAL_PPID })) {
              log('relaunch aborted: launcher shutting down or owning runtime gone; releasing lease and exiting');
              clearAllLeaseFiles();
              process.exit(0);
              return;
            }
            launchServer();
          }, backoffMs);
          supervisorRelaunchTimer.unref?.();
        },
      },
    );
    if (result.action === 'give-up') {
      log(`context-server crash loop detected after ${result.deathsInWindow} deaths; clearing lease and mirroring child exit`);
    }
  });

  childProcess.on('error', (error) => {
    log(error.stack || error.message);
    process.exit(1);
  });
  if (rssBreachSelfExitInProgress) {
    rssBreachSelfExitInProgress = false;
  }
  return true;
}

// Pure decision for the exit-86 flow (exported for tests). A lease whose
// owner is THIS launcher is NOT a bridge target: in supervised mode the
// pid-lease records the launcher's own pid, so after its child exits 86 the
// lease still reads "held by a live owner" — us. Bridging would deep-probe
// our own dead socket and route into a self-reap. Only a DIFFERENT live
// owner is bridgeable; a self-held lease means a non-daemon process (e.g. a
// standalone save mid-run) owns the database lock, so retry in place.
function decideDbLockHeldAction({ leaseHeld, leaseOwnerPid, selfPid, attempt, maxRetries }) {
  if (attempt > maxRetries + 2) return { action: 'report', reason: 'db-lock-held-persistent' };
  if (leaseHeld && leaseOwnerPid !== selfPid) return { action: 'bridge' };
  if (attempt <= maxRetries) return { action: 'retry', backoffMs: 2000 * 2 ** (attempt - 1) };
  return { action: 'report', reason: 'db-lock-held' };
}

// The daemon refused to become a second writer on a database another live
// process holds. Prefer bridging to that owner; when the holder is not a
// bridgeable daemon (e.g. a maintenance script mid-run), retry the launch a
// few times so a short-lived holder can finish, then report and exit clean.
async function handleDbLockHeldChildExit() {
  dbLockHeldRetries += 1;
  const leaseResult = isLeaseHeld();
  const decision = decideDbLockHeldAction({
    leaseHeld: leaseResult.held,
    leaseOwnerPid: leaseResult.ownerPid,
    selfPid: process.pid,
    attempt: dbLockHeldRetries,
    maxRetries: DB_LOCK_HELD_MAX_RETRIES,
  });
  if (decision.action === 'bridge') {
    log(`context-server exited: database single-writer lock held; bridging to live owner pid=${leaseResult.ownerPid}`);
    await bridgeOrReportLeaseHeldAndExit(leaseResult);
    return;
  }
  if (decision.action === 'retry') {
    log(`database single-writer lock held by a non-bridgeable holder; retrying launch in ${decision.backoffMs}ms (attempt ${dbLockHeldRetries}/${DB_LOCK_HELD_MAX_RETRIES})`);
    if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
    supervisorRelaunchTimer = setTimeout(() => {
      // Abort if the owning runtime vanished (shutdown in progress, or the launcher
      // was reparented to init without a SIGTERM) — same guard as the primary
      // backoff-relaunch path, so neither relaunches a daemon under a disposed session.
      if (shouldAbortRelaunchOnFire({ shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LAUNCHER_INITIAL_PPID })) return;
      launchServer();
    }, decision.backoffMs);
    if (supervisorRelaunchTimer.unref) supervisorRelaunchTimer.unref();
    return;
  }
  log('database single-writer lock still held after launch retries; reporting and exiting');
  writeLeaseHeldJsonRpcError(
    { ownerPid: leaseResult.ownerPid ?? 'unknown', startedAt: leaseResult.startedAt ?? new Date().toISOString() },
    decision.reason,
  );
  clearAllLeaseFiles();
  process.exit(0);
}

async function shutdownLauncherForSignal(signal) {
  if (launcherShutdownInProgress) return;
  launcherShutdownInProgress = true;
  if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
  if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
  clearOwnerLeaseHeartbeat();
  hfControl.clearTimers();
  await hfControl.stopDemandListener();

  // Re-election release path (on by default): release the detached context-server for a live secondary to adopt
  // instead of killing it. Reap only the non-adoptable model-server, KEEP the daemon lease (its socket
  // stays findable for adoption), drop only OWNERSHIP, and exit without killing the daemon. When the
  // flag is off this branch is skipped and the original kill path below runs unchanged.
  if (shouldReleaseDaemonForReelection({ enabled: daemonReelectionEnabled(), hasLiveDaemon: isChildRunning(childProcess) })) {
    const releasedModelServer = hfControl.getChild();
    if (isChildRunning(releasedModelServer)) {
      hfControl.reapProcessTree(releasedModelServer.pid);
      releasedModelServer.kill(signal);
      // Escalate to SIGKILL if the non-adoptable model-server does not exit within the grace window,
      // so the release path does not leave a wedged sidecar behind on its way out.
      const exited = await waitForChildExit(releasedModelServer, RESPAWN_REAP_GRACE_MS);
      if (!exited && isChildRunning(releasedModelServer)) {
        releasedModelServer.kill('SIGKILL');
      }
    }
    log('daemon re-election: releasing context-server for adoption (not killing); dropping ownership lease only');
    // The process 'exit' handler clears BOTH leases; detach it first so the daemon lease (its socket
    // path) survives for a secondary to adopt. Ownership is still dropped explicitly below.
    process.removeListener('exit', clearAllLeaseFiles);
    clearOwnerLeaseFile();
    process.exit(0);
    return;
  }

  const children = [];
  if (isChildRunning(childProcess)) {
    children.push({ child: childProcess, label: 'context-server' });
  }
  const modelServerChild = hfControl.getChild();
  if (isChildRunning(modelServerChild)) {
    children.push({ child: modelServerChild, label: 'hf-model-server' });
  }

  if (children.length === 0) {
    clearAllLeaseFiles();
    process.exit(128);
    return;
  }

  for (const { child, label } of children) {
    if (label === 'hf-model-server') {
      hfControl.reapProcessTree(child.pid);
    }
    child.kill(signal);
  }

  const exited = await Promise.race([
    Promise.all(children.map(({ child }) => waitForChildExit(child, RESPAWN_REAP_GRACE_MS))).then((results) => results.every(Boolean)),
    sleep(RESPAWN_REAP_GRACE_MS).then(() => false),
  ]);
  if (!exited) {
    for (const { child } of children) {
      if (isChildRunning(child)) child.kill('SIGKILL');
    }
  }
  clearAllLeaseFiles();
  process.exit(128);
}

function installSignalHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
    process.on(signal, () => {
      void shutdownLauncherForSignal(signal).catch((error) => {
        log(error.stack || error.message);
        clearAllLeaseFiles();
        process.exit(128);
      });
    });
  }
  process.on('uncaughtException', (err) => {
    try {
      clearAllLeaseFiles();
    } catch {
      // Preserve default uncaughtException crash behavior.
    }
    throw err;
  });
}

async function main() {
  loadProjectEnvFiles();
  const started = now();
  const actions = [];
  let lockHeld = false;
  let staleRespawnLock = null;

  try {
    installSignalHandlers();
    // Lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearAllLeaseFiles);
    refreshPaths();

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER);
    ownerLeaseRequired = strictSingleWriter;
    if (strictSingleWriter) {
      const legacyLeaseResult = isLeaseHeld();
      if (legacyLeaseResult.held && legacyLeaseResult.legacyPath && !legacyLeaseResult.staleReclaimable) {
        await bridgeOrReportLeaseHeldAndExit(legacyLeaseResult);
        return;
      }
    }

    ensureLayout(actions);
    refreshPaths();
    enforceStandaloneCodeGraphDb(actions);

    if (strictSingleWriter) {
      const ownerLeaseResult = acquireOwnerLeaseFile();
      if (!ownerLeaseResult.acquired) {
        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
        return;
      }

      const leaseResult = isLeaseHeld();
      if (leaseResult.held && !leaseResult.staleReclaimable) {
        clearOwnerLeaseFile();
        await bridgeOrReportLeaseHeldAndExit(leaseResult);
        return;
      }
      if (leaseResult.staleReclaimable) {
        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
        // A re-election daemon released by a disposing owner (or orphaned by a crashed owner) stays
        // alive under this stale lease, which records the live daemon as childPid. ADOPT it: if the
        // daemon is still alive and its recorded socket is bridgeable, bridge to the live socket
        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
        // when the daemon is genuinely gone.
        const staleLease = readLeaseFile(leaseResult.legacyPath || leasePath());
        const orphanChildPid = staleLease?.childPid;
        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0 && processLiveness(orphanChildPid) !== 'dead') {
          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
          const readiness = bridgeReadiness(adoptResult);
          if (readiness.ready) {
            // A live pid that still owns its socket can be WEDGED: its event loop is starved, so the
            // kernel accepts the connection into the listen backlog but the daemon never services a
            // request. bridgeReadiness only proves the socket file exists — adopting on that alone
            // bridges every client into a dead end, and the launcher can never recover because the pid
            // stays alive forever and is never reaped. Require a real JSON-RPC reply (the same deep
            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
            // busy-but-responsive daemon) before adopting. A non-responsive daemon falls through to the
            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
            const { probeLeaseHolderWithRetries } = loadBridgeModule();
            let probe;
            try {
              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
                onRetry: (attempt, total, result) => log(`stale-reclaim adopt probe ${attempt}/${total} not alive (${result.reason}); retrying`),
              });
            } catch (error) {
              // The probe resolves to a status even on socket failure; a thrown error means the probe
              // infrastructure itself failed. Treat that as not-alive so control falls through to
              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
              probe = { status: 'dead', reason: `probe-threw: ${error instanceof Error ? error.message : String(error)}` };
            }
            if (probe.status === 'alive') {
              log(`stale-reclaim adopting live daemon pid ${orphanChildPid} via bridge instead of reaping`);
              clearOwnerLeaseFile();
              await bridgeOrReportLeaseHeldAndExit(adoptResult);
              return;
            }
            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
          }
        }
        // Daemon is dead, unbridgeable, or alive but failing its liveness probe. Reclaiming an existing STALE owner lease is a
        // non-exclusive write (the owner-lease O_EXCL above only covers the no-prior-lease case), so
        // two fresh launchers racing a crashed owner could both reach the reap and spawn. Take the
        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
        // the loser bails and reconnects.
        staleRespawnLock = acquireRespawnLockFile();
        if (!staleRespawnLock.acquired) {
          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
          clearOwnerLeaseFile();
          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
          process.exit(0);
        }
        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0) {
          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
          // a racing launcher may have reaped this same orphan and spawned a fresh daemon (recording a
          // new childPid) before we acquired the lock. Reaping now would tear down that replacement and
          // risk a second writer, so if the recorded lease no longer names the orphan we snapshotted,
          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
          const recheckLease = readLeaseFile(leaseResult.legacyPath || leasePath());
          if (recheckLease && recheckLease.childPid !== orphanChildPid) {
            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
            releaseRespawnLockFile(staleRespawnLock);
            staleRespawnLock = null;
            clearOwnerLeaseFile();
            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
            process.exit(0);
          }
          const reap = await reapLeaseChildBeforeRespawn(orphanChildPid);
          if (!reap.allowed) {
            // Cannot confirm the released daemon is gone (EPERM, or it outlived SIGKILL); spawning
            // now would create a second writer, so report the lease as held and let the host
            // reconnect instead.
            log(`stale-reclaim aborted: ${reap.reason} for childPid=${orphanChildPid}; reporting lease held`);
            releaseRespawnLockFile(staleRespawnLock);
            staleRespawnLock = null;
            clearOwnerLeaseFile();
            writeLeaseHeldJsonRpcError(leaseResult, reap.reason);
            process.exit(0);
          }
        }
      }
    } else {
      log('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    }

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
      buildIfNeeded(actions);
      writeState({
        command: 'mk-spec-memory-launcher',
        start: started,
        end: now(),
        status: 'ready',
        actions,
        server: rel(path.join(kitDir, 'mcp_server', 'dist', 'context-server.js')),
      });
      fs.rmSync(lockDir, { recursive: true, force: true });
      lockHeld = false;
    }

    writeLeaseFile();
    const reprobe = readLeaseFile();
    if (!reprobe || reprobe.pid !== process.pid) {
      const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
      clearOwnerLeaseFile();
      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
      process.exit(0);
    }
    const launched = launchServer();
    // Reap + spawn critical section is over; let other respawn paths proceed.
    if (staleRespawnLock) {
      releaseRespawnLockFile(staleRespawnLock);
      staleRespawnLock = null;
    }
    if (!launched) return;
    if (launched) {
      const sessionProxy = createSessionProxy({
        socketPath: resolveSessionProxySocketPath(),
        stdin: process.stdin,
        stdout: process.stdout,
        log,
      });
      await sessionProxy.start();
    }
    void startModelServerDemandListener().catch((error) => {
      log(`hf-model-server demand listener failed: ${error.stack || error.message}`);
    });
  } catch (error) {
    try {
      writeState({
        command: 'mk-spec-memory-launcher',
        start: started,
        end: now(),
        status: 'failed',
        actions,
        error: error.message,
      });
    } catch {
      // If state logging itself fails, stderr still carries the actionable error.
    }
    log(error.stack || error.message);
    process.exit(1);
  } finally {
    if (lockHeld) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
    if (staleRespawnLock) {
      releaseRespawnLockFile(staleRespawnLock);
      staleRespawnLock = null;
    }
  }
}

function configureLauncherPathsForTesting(nextPaths) {
  if (nextPaths.skillsDir) skillsDir = nextPaths.skillsDir;
  if (nextPaths.kitDir) kitDir = nextPaths.kitDir;
  if (nextPaths.dbDir) dbDir = nextPaths.dbDir;
  if (nextPaths.lockDir) lockDir = nextPaths.lockDir;
  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;
}

module.exports = {
  acquireBootstrapLock,
  acquireModelServerRespawnLockFile,
  acquireOwnerLeaseFile,
  artifactsReady,
  bridgeStdioThroughSessionProxy,
  buildLeaseObject,
  buildOwnerLease,
  classifyOwnerLease,
  clearOwnerLeaseFile,
  configureLauncherPathsForTesting,
  ownerLeasePath,
  readBootstrapLockOwnerPid,
  readOwnerLeaseFile,
  reapOwnerBeforeRespawn,
  removeStaleBootstrapLock,
  computeBackoffMs,
  decideDbLockHeldAction,
  EXIT_DB_LOCK_HELD,
  contextServerSpawnIo,
  createCrashLoopGuard,
  daemonReelectionEnabled,
  createModelServerSupervisor,
  getModelServerWatchdogConfig,
  getWatchdogConfig,
  isRespawnLockStale,
  launchModelServer,
  launcherLogIsEnabled,
  launcherLogMaxBytes,
  modelServerRespawnLockPath,
  persistLauncherLogLine,
  resolveLauncherLogPath,
  shouldRotateLauncherLog,
  normalizeWatchdogGraceMs,
  parseProcessRows,
  processLiveness,
  reapProcessTreeGroups,
  refreshDescendantSnapshot,
  resolvedDbDir,
  uncleanShutdownMarkerPath,
  uncleanMarkerPresent,
  cleanCloseAfterReap,
  reapLeaseChildBeforeRespawn,
  recycleDaemonInPlace,
  resolveModelServerSocketPath,
  sampleProcessTreeRssMb,
  shouldAbortRelaunchOnFire,
  shouldReleaseDaemonForReelection,
  shouldSkipLaunch,
  signalProcess,
  startModelServerDemandListener,
  startRssWatchdog,
  stopModelServerDemandListener,
  superviseChildExit,
  writeLeaseFile,
  writeSharedModelServerPid,
};

if (require.main === module) {
  void main();
}
