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
let ownerLeaseHeartbeatTimer = null;
let ownerLeaseRequired = true;
// Last-known descendant pids of the daemon child (excluding the child itself), refreshed by the
// process-tree monitor while the child is alive; the give-up reap path uses this to find an
// orphaned sidecar after the child has already exited.
let lastKnownDescendantPids = [];
const DURABLE_WRITE_UNAVAILABLE_CODES = new Set(['ENOSPC', 'EDQUOT', 'EROFS']);
const durableWriteWarnings = new Set();

function log(message) {
  process.stderr.write(`[mk-spec-memory-launcher] ${message}\n`);
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
  fs.writeFileSync(tmp, `${JSON.stringify(lease, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
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
  if (!existing) {
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

  // Re-read after reclaim so two launchers racing a stale lease cannot both act as owner.
  writeOwnerLeaseFile(lease);
  const reread = readOwnerLeaseFile(currentOwnerLeasePath);
  if (!reread || reread.ownerPid !== process.pid) {
    return {
      acquired: false,
      holder: reread || lease,
      classification: reread ? classifyOwnerLease(reread) : 'live-owner',
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
  const override = process.env.MEMORY_DB_PATH;
  const dir = override ? path.dirname(override) : resolvedDbDir();
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

  log(`confirmed-dead socket; reaping recorded context-server child pid ${childPid} before respawn`);
  signalProcess(childPid, 'SIGTERM');
  reapProcessTreeGroups(childPid, { signal: signalProcess });
  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
  let killed = false;
  if (!exitedAfterTerm) {
    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
    signalProcess(childPid, 'SIGKILL');
    await waitForPidExit(childPid, 1000);
    killed = true;
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

  // Compatibility symlink `.opencode/skill -> skills` removed: 096 packet cleaned
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

// Reap an orphaned sidecar on crash-loop give-up. The dominant RC-1 RSS lives in a
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
// Explicit caller options still win via the trailing spread (the 004 test injects its own writeLease).
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

async function acquireBootstrapLock(options = {}) {
  const requireLock = options.requireLock === true;
  fs.mkdirSync(dbDir, { recursive: true });
  const deadline = Date.now() + 120000;
  while (true) {
    try {
      fs.mkdirSync(lockDir);
      return true;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
      // Reclaim a stale lockdir left by a SIGKILL'd launcher (mtime-based; the lockdir records no pid),
      // so a crashed holder cannot block a requireLock respawn for the full 120s deadline.
      try {
        const ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
        if (ageMs > BOOTSTRAP_LOCK_STALE_MS) {
          log(`reclaiming stale bootstrap lock ${rel(lockDir)} (age ${Math.round(ageMs / 1000)}s)`);
          // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
          // racer wins the rename; a successor that mkdir'd a fresh lockDir after our stat
          // creates a new inode that our rename/rmSync cannot touch, so we never delete a
          // live successor lock. A losing racer's rename throws ENOENT and falls through to
          // the outer retry.
          const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
          fs.renameSync(lockDir, staleClaim);
          fs.rmSync(staleClaim, { recursive: true, force: true });
          continue;
        }
      } catch (statErr) {
        // stat/rename race — lock disappeared or was reclaimed by another launcher; retry mkdirSync
        if (statErr.code === 'ENOENT') continue;
        if (statErr.code === 'ENOTEMPTY') continue;
        throw statErr;
      }
      if (artifactsReady() && !requireLock) {
        return false;
      }
      if (Date.now() > deadline) {
        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
      }
      await sleep(1000);
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
  childProcess = spawn(process.execPath, [...nodeArgs, server], {
    cwd: root,
    env: {
      ...process.env,
      SPECKIT_BACKEND_ONLY: '1',
    },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
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
          supervisorRelaunchTimer = setTimeout(() => launchServer(), backoffMs);
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

async function shutdownLauncherForSignal(signal) {
  if (launcherShutdownInProgress) return;
  launcherShutdownInProgress = true;
  if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
  if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
  clearOwnerLeaseHeartbeat();
  hfControl.clearTimers();
  await hfControl.stopDemandListener();

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
  }
}

module.exports = {
  acquireModelServerRespawnLockFile,
  bridgeStdioThroughSessionProxy,
  buildLeaseObject,
  computeBackoffMs,
  createCrashLoopGuard,
  createModelServerSupervisor,
  getModelServerWatchdogConfig,
  getWatchdogConfig,
  isRespawnLockStale,
  launchModelServer,
  modelServerRespawnLockPath,
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
