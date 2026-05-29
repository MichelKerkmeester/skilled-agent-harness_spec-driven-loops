#!/usr/bin/env node
// [mk-spec-memory-launcher] MCP child-process launcher for the mk-spec-memory server.
// Loads project-local env overrides, ensures dist artifacts are built and current,
// serializes concurrent starts via a filesystem bootstrap lock, then spawns the
// context-server.js child. All stderr lines are tagged with the bracketed module
// prefix for ops grepping. See .opencode/specs/.../014/052-mk-spec-memory-rename for
// the rename packet that established this name.

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

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
let stateFile = path.join(dbDir, PID_FILE_NAME);
let canonicalCodeGraphDbDir = path.join(skillsDir, 'system-code-graph', 'mcp_server', 'database');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const SHUTDOWN_DEADLINE_MS = 5000;
const DEFAULT_WATCHDOG_GRACE_MS = 7000;
const RESPAWN_REAP_GRACE_MS = 7000;
// A respawn lock older than this (or held by a dead pid) is reclaimable — so a launcher SIGKILL'd
// during the reap window cannot permanently wedge all future respawns. Must exceed the max reap
// window (RESPAWN_REAP_GRACE_MS + SIGKILL wait + bootstrap-lock time) with margin.
const RESPAWN_LOCK_STALE_MS = 60000;
// Generously above any realistic cold-cache build (npm ci + 2 tsc workspace builds) so the reclaim
// only fires for a genuinely abandoned lockdir, never a slow-but-live build holder.
const BOOTSTRAP_LOCK_STALE_MS = 300000;
const DEFAULT_WATCHDOG_INTERVAL_MS = 15000;
const DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES = 3;
// Tracking-only cadence when the RSS self-exit watchdog is NOT enabled: still sample the process
// tree periodically so the crash-loop give-up reap (REQ-007) has a before-death descendant snapshot
// to reap from (a forked-detached sidecar re-parents to pid 1 on hard daemon death, so a fresh walk
// anchored on the dead childPid would find nothing).
const DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS = 30000;
const DEFAULT_CRASH_LOOP_MAX_DEATHS = 3;
const DEFAULT_CRASH_LOOP_WINDOW_MS = 60000;
const DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS = 250;
const DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS = 5000;
const HF_MODEL_SERVER_SOCKET_FILE_NAME = 'hf-embed.sock';
const HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME = 'hf-embed-respawn.lock';
const MODEL_SERVER_DEMAND_STATUS = 503;
let childProcess = null;
let leaseStartedAt = null;
let launcherShutdownInProgress = false;
let rssBreachSelfExitInProgress = false;
let rssWatchdogTimer = null;
let crashLoopGuard = null;
let supervisorRelaunchTimer = null;
let modelServerSupervisor = null;
let modelServerDemandServer = null;
let modelServerDemandTarget = null;
// Last-known descendant pids of the daemon child (excluding the child itself), refreshed by the
// process-tree monitor while the child is alive; the give-up reap path uses this to find an
// orphaned sidecar after the child has already exited.
let lastKnownDescendantPids = [];

function log(message) {
  process.stderr.write(`[mk-spec-memory-launcher] ${message}\n`);
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

function isPermissionError(error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  if (code === 'EPERM' || code === 'EACCES') return true;
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /operation not permitted|permission denied/i.test(message);
}

function parseProcessRows(input) {
  if (Array.isArray(input)) {
    return input
      .map((row) => ({
        pid: Number(row.pid),
        ppid: Number(row.ppid),
        rss: Number(row.rss),
      }))
      .filter((row) => Number.isFinite(row.pid) && Number.isFinite(row.ppid) && Number.isFinite(row.rss));
  }

  return String(input ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [pid, ppid, rss] = line.split(/\s+/).map((value) => Number.parseInt(value, 10));
      return { pid, ppid, rss };
    })
    .filter((row) => Number.isFinite(row.pid) && Number.isFinite(row.ppid) && Number.isFinite(row.rss));
}

function defaultProcessRowsRunner() {
  const result = spawnSync('ps', ['-eo', 'pid=,ppid=,rss='], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const error = new Error(result.stderr || `ps exited ${result.status}`);
    error.code = result.status === 1 && /operation not permitted|permission denied/i.test(result.stderr || '') ? 'EPERM' : 'PS_FAILED';
    throw error;
  }
  return result.stdout;
}

function resolveProcessTreeRows(childPid, runner = defaultProcessRowsRunner) {
  if (!Number.isInteger(childPid) || childPid <= 0) return null;

  let rows;
  try {
    rows = parseProcessRows(runner());
  } catch (error) {
    if (isPermissionError(error)) return null;
    throw error;
  }

  const byPid = new Map();
  const childrenByPpid = new Map();
  for (const row of rows) {
    byPid.set(row.pid, row);
    const children = childrenByPpid.get(row.ppid) || [];
    children.push(row);
    childrenByPpid.set(row.ppid, children);
  }
  if (!byPid.has(childPid)) return null;

  const subtree = [];
  const stack = [childPid];
  const seen = new Set();
  while (stack.length > 0) {
    const pid = stack.pop();
    if (seen.has(pid)) continue;
    seen.add(pid);
    const row = byPid.get(pid);
    if (row) subtree.push(row);
    for (const child of childrenByPpid.get(pid) || []) {
      stack.push(child.pid);
    }
  }

  return subtree;
}

function sampleProcessTreeRssMb(childPid, runner = defaultProcessRowsRunner) {
  const rows = resolveProcessTreeRows(childPid, runner);
  if (!rows) return null;
  const rssKb = rows.reduce((sum, row) => sum + Math.max(0, row.rss), 0);
  return rssKb / 1024;
}

function normalizeWatchdogGraceMs(rawGraceMs, warn = log, envName = 'SPECKIT_LAUNCHER_RSS_GRACE_MS') {
  const parsed = parsePositiveInteger(rawGraceMs, DEFAULT_WATCHDOG_GRACE_MS);
  if (parsed > SHUTDOWN_DEADLINE_MS) return parsed;
  warn(`${envName}=${JSON.stringify(rawGraceMs)} is <= ${SHUTDOWN_DEADLINE_MS}; using ${DEFAULT_WATCHDOG_GRACE_MS}ms`);
  return DEFAULT_WATCHDOG_GRACE_MS;
}

function getWatchdogConfig(env = process.env, warn = log, options = {}) {
  const envNames = {
    maxRssMb: options.maxRssMbEnv || 'SPECKIT_CONTEXT_SERVER_MAX_RSS_MB',
    selfExit: options.selfExitEnv || 'SPECKIT_LAUNCHER_RSS_SELF_EXIT',
    intervalMs: options.intervalMsEnv || 'SPECKIT_LAUNCHER_RSS_WATCHDOG_INTERVAL_MS',
    consecutiveBreaches: options.consecutiveBreachesEnv || 'SPECKIT_LAUNCHER_RSS_CONSECUTIVE_BREACHES',
    graceMs: options.graceMsEnv || 'SPECKIT_LAUNCHER_RSS_GRACE_MS',
  };
  const rawMaxRssMb = env[envNames.maxRssMb];
  const maxRssMb = rawMaxRssMb === undefined || rawMaxRssMb === null || String(rawMaxRssMb).trim() === ''
    ? null
    : Number.parseFloat(String(rawMaxRssMb).trim());
  // REQ-008: host relaunch after clean launcher exit is unconfirmed, so RSS-breach self-exit is explicit opt-in only.
  const enabled = Number.isFinite(maxRssMb) && maxRssMb > 0 && env[envNames.selfExit] === '1';
  return {
    enabled,
    maxRssMb,
    intervalMs: parsePositiveInteger(env[envNames.intervalMs], DEFAULT_WATCHDOG_INTERVAL_MS),
    consecutiveBreaches: parsePositiveInteger(env[envNames.consecutiveBreaches], DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES),
    graceMs: normalizeWatchdogGraceMs(env[envNames.graceMs], warn, envNames.graceMs),
    maxRssMbEnv: envNames.maxRssMb,
    selfExitEnv: envNames.selfExit,
  };
}

function getModelServerWatchdogConfig(env = process.env, warn = log) {
  return getWatchdogConfig(env, warn, {
    maxRssMbEnv: 'SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB',
    selfExitEnv: 'SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT',
  });
}

function computeBackoffMs(deathsInWindow, initialBackoffMs, maxBackoffMs) {
  const exponent = Math.max(0, deathsInWindow - 1);
  return Math.min(maxBackoffMs, initialBackoffMs * (2 ** exponent));
}

function createCrashLoopGuard(options = {}) {
  const maxDeaths = parsePositiveInteger(options.maxDeaths, DEFAULT_CRASH_LOOP_MAX_DEATHS);
  const windowMs = parsePositiveInteger(options.windowMs, DEFAULT_CRASH_LOOP_WINDOW_MS);
  const initialBackoffMs = parsePositiveInteger(options.initialBackoffMs, DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS);
  const maxBackoffMs = parsePositiveInteger(options.maxBackoffMs, DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS);
  const nowMs = typeof options.now === 'function' ? options.now : () => Date.now();
  const deaths = [];

  return {
    recordDeath() {
      const current = nowMs();
      deaths.push(current);
      while (deaths.length > 0 && current - deaths[0] > windowMs) deaths.shift();
      const deathsInWindow = deaths.length;
      return {
        deathsInWindow,
        giveUp: deathsInWindow >= maxDeaths,
        backoffMs: computeBackoffMs(deathsInWindow, initialBackoffMs, maxBackoffMs),
      };
    },
  };
}

function getCrashLoopConfig(env = process.env) {
  return {
    maxDeaths: parsePositiveInteger(env.SPECKIT_LAUNCHER_CRASH_LOOP_MAX_DEATHS, DEFAULT_CRASH_LOOP_MAX_DEATHS),
    windowMs: parsePositiveInteger(env.SPECKIT_LAUNCHER_CRASH_LOOP_WINDOW_MS, DEFAULT_CRASH_LOOP_WINDOW_MS),
    initialBackoffMs: parsePositiveInteger(env.SPECKIT_LAUNCHER_CRASH_LOOP_INITIAL_BACKOFF_MS, DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS),
    maxBackoffMs: parsePositiveInteger(env.SPECKIT_LAUNCHER_CRASH_LOOP_MAX_BACKOFF_MS, DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS),
  };
}

function superviseChildExit(event, actions) {
  if (event.intentional) {
    actions.clearLease();
    actions.exit(event.code ?? 0);
    return { action: 'intentional-exit' };
  }

  const decision = actions.crashLoopGuard.recordDeath();
  if (decision.giveUp) {
    actions.clearLease();
    actions.reapProcessGroup(event.childPid);
    if (event.signal) {
      actions.mirrorSignal(event.signal);
    } else {
      actions.exit(event.code ?? 1);
    }
    return { action: 'give-up', deathsInWindow: decision.deathsInWindow };
  }

  actions.scheduleRelaunch(decision.backoffMs);
  return { action: 'relaunch', deathsInWindow: decision.deathsInWindow, backoffMs: decision.backoffMs };
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

function canonicalizePath(pathValue) {
  const resolvedPath = path.resolve(pathValue);
  try {
    return fs.realpathSync.native(resolvedPath);
  } catch (error) {
    if (error.code === 'ENOENT') return resolvedPath;
    throw error;
  }
}

function ensureCanonicalDir(dirPath) {
  fs.mkdirSync(canonicalizePath(dirPath), { recursive: true, mode: 0o700 });
  return canonicalizePath(dirPath);
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

function leaseHeldFromFile(filePath, legacyPath = null) {
  const lease = readLeaseFile(filePath);
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath };
    // 016/006/009: mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
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

function respawnLockPath() {
  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
}

function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
  const lockDirPath = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
  return path.join(lockDirPath, HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME);
}

// A respawn lock is reclaimable if its payload is unparseable, its recorded holder pid is dead, or it
// is older than the stale threshold. The pid-liveness check is primary; the age check is a backstop
// against pid-reuse / a hung holder. (mirrors mk-code-index's owner-lease stale-pid reclaim.)
function isRespawnLockStale(raw, options = {}) {
  const liveness = options.liveness || processLiveness;
  const nowMs = typeof options.nowMs === 'number' ? options.nowMs : Date.now();
  const staleMs = typeof options.staleMs === 'number' ? options.staleMs : RESPAWN_LOCK_STALE_MS;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return true;
  }
  const pid = parsed && parsed.pid;
  if (Number.isInteger(pid) && pid > 0 && liveness(pid) === 'dead') return true;
  const startedAtMs = parsed && parsed.startedAt ? Date.parse(parsed.startedAt) : NaN;
  if (Number.isFinite(startedAtMs) && nowMs - startedAtMs > staleMs) return true;
  return false;
}

function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
  const currentLockPath = path.join(ensureCanonicalDir(path.dirname(lockPath)), path.basename(lockPath));
  const tryOpen = () => {
    const fd = fs.openSync(currentLockPath, 'wx', 0o600);
    fs.writeFileSync(fd, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8');
    fs.fsyncSync(fd);
    return { acquired: true, fd, path: currentLockPath };
  };
  try {
    return tryOpen();
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  // EEXIST: reclaim if the existing lock is stale (dead holder / unparseable / aged out), then retry
  // once. The bootstrap lock already serialized us, and wx is atomic, so the reclaim cannot duplicate.
  let raw = '';
  try {
    raw = fs.readFileSync(currentLockPath, 'utf8');
  } catch (readErr) {
    if (readErr.code !== 'ENOENT') throw readErr;
  }
  if (raw === '' || isRespawnLockStale(raw)) {
    try {
      fs.unlinkSync(currentLockPath);
    } catch (unlinkErr) {
      if (unlinkErr.code !== 'ENOENT') throw unlinkErr;
    }
    try {
      const reclaimed = tryOpen();
      log(`reclaimed stale ${label} lock ${rel(currentLockPath)}`);
      return reclaimed;
    } catch (retryErr) {
      if (retryErr.code !== 'EEXIST') throw retryErr;
    }
  }
  return { acquired: false, path: currentLockPath };
}

function acquireRespawnLockFile() {
  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
}

function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
  return acquireRespawnLockFileAt(modelServerRespawnLockPath(socketPath), 'hf-model-server respawn');
}

function releaseRespawnLockFile(lock) {
  if (!lock || !lock.acquired) return;
  try {
    if (typeof lock.fd === 'number') fs.closeSync(lock.fd);
  } finally {
    try {
      fs.unlinkSync(lock.path);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

function processLiveness(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return 'dead';
  try {
    process.kill(pid, 0);
    return 'alive';
  } catch (error) {
    if (error.code === 'ESRCH') return 'dead';
    if (error.code === 'EPERM') return 'unknown-eperm';
    return 'alive';
  }
}

async function waitForPidExit(pid, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (processLiveness(pid) === 'dead') return true;
    await sleep(100);
  }
  return processLiveness(pid) === 'dead';
}

async function reapLeaseChildBeforeRespawn(childPid) {
  const liveness = processLiveness(childPid);
  if (liveness === 'unknown-eperm') {
    return { allowed: false, reason: 'child-liveness-unknown-eperm' };
  }
  if (liveness === 'dead') {
    return { allowed: true, reaped: false, reason: 'child-already-dead' };
  }

  log(`confirmed-dead socket; reaping recorded context-server child pid ${childPid} before respawn`);
  signalProcess(childPid, 'SIGTERM');
  reapProcessTreeGroups(childPid, { signal: signalProcess });
  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
  if (!exitedAfterTerm) {
    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
    signalProcess(childPid, 'SIGKILL');
    await waitForPidExit(childPid, 1000);
  }
  return { allowed: true, reaped: true, reason: 'child-reaped' };
}

async function respawnAfterDeadSocket(leaseResult, decision) {
  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
  }

  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
  const childPid = lease?.childPid;
  if (!Number.isInteger(childPid) || childPid <= 0) {
    log('confirmed-dead socket but lease has no childPid; phase-006 gate keeps respawn inert');
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

    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
    }

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
  const { maybeBridgeLeaseHolder } = loadBridgeModule();
  const decision = await maybeBridgeLeaseHolder({
    serviceName: 'mk-spec-memory',
    leaseResult,
    loggerPrefix: 'mk-spec-memory-launcher',
    dbDir: resolvedDbDir(),
  });
  if (decision && decision.action === 'respawn') {
    return await respawnAfterDeadSocket(leaseResult, decision);
  }
  return decision;
}

function normalizeModelServerTarget(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const raw = value.trim();
  if (raw.startsWith('tcp://')) return raw;
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    const url = new URL(raw);
    return `tcp://${url.hostname}:${url.port || (url.protocol === 'https:' ? '443' : '80')}`;
  }
  if (raw.startsWith('unix://')) return path.resolve(raw.slice('unix://'.length));
  return path.resolve(raw);
}

function resolveModelServerSocketPath(env = process.env, options = {}) {
  const explicitTarget = normalizeModelServerTarget(options.listenTarget || env.HF_EMBED_SERVER_URL);
  if (explicitTarget) return explicitTarget;
  if (env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) return env.SPECKIT_IPC_SOCKET_DIR;

  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(options.dbDir || resolvedDbDir());
  return path.join(socketDir, HF_MODEL_SERVER_SOCKET_FILE_NAME);
}

function getContextServerPid() {
  return isChildRunning(childProcess) ? childProcess.pid : null;
}

function getModelServerPid() {
  return modelServerSupervisor ? modelServerSupervisor.getPid() : null;
}

// Pure lease-payload builder (exported for tests). `childPid` and `modelServerPid` are ADDITIVE
// fields present only when the corresponding launcher-owned child exists; existing readers consume
// only pid/startedAt/ownerPid and ignore the extra fields.
function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null) {
  const payload = {
    pid: process.pid,
    startedAt: startedAt || new Date().toISOString(),
    ownerPid: process.pid,
  };
  if (Number.isInteger(childPid) && childPid > 0) {
    payload.childPid = childPid;
  }
  if (Number.isInteger(modelServerPid) && modelServerPid > 0) {
    payload.modelServerPid = modelServerPid;
  }
  return payload;
}

function writeLeaseFile(childPid = getContextServerPid(), modelServerPid = getModelServerPid()) {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
  const tmp = currentLeasePath + '.tmp.' + process.pid;
  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid);
  fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, currentLeasePath);
}

function clearLeaseFile() {
  try {
    const lease = readLeaseFile();
    if (launcherShutdownInProgress && Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0) {
      try {
        modelServerSupervisor?.reapProcessTree(lease.modelServerPid);
      } catch {
        // Lease cleanup must remain best-effort even if a final process-tree read fails.
      }
    }
    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
  } catch {
    // Idempotent cleanup.
  }
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

function isChildRunning(child) {
  return child && child.exitCode === null && child.signalCode === null;
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

function signalProcess(pid, signal) {
  try {
    process.kill(pid, signal);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH' || error.code === 'EPERM') return false;
    throw error;
  }
}

// Refresh the before-death descendant snapshot from a live process-tree walk. Called periodically by
// the monitor while the child is alive. On an unknown/permission-denied read (null), the previous
// snapshot is KEPT (a transient ps failure must not erase the only handle on an orphan-able sidecar).
function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner) {
  const rows = resolveProcessTreeRows(childPid, runner);
  if (rows === null) return lastKnownDescendantPids;
  lastKnownDescendantPids = rows.map((row) => row.pid).filter((pid) => pid !== childPid && pid > 1);
  return lastKnownDescendantPids;
}

// Reap an orphaned sidecar on crash-loop give-up (REQ-007). The dominant RC-1 RSS lives in a
// forked-detached sidecar GRANDCHILD; on hard daemon death it re-parents to pid 1, so a fresh walk
// anchored on the (now-dead, ps-absent) childPid finds nothing. We therefore reap the UNION of any
// still-live childPid subtree (the not-yet-reparented case) and the before-death snapshot
// (`lastKnownDescendantPids`), filtered to currently-alive, signalable pids. The signal-0 alive gate
// bounds (but cannot fully eliminate) pid-reuse risk; the snapshot is at most one monitor tick old.
function reapProcessTreeGroups(childPid, options = {}) {
  const runner = options.runner || defaultProcessRowsRunner;
  const signal = options.signal || signalProcess;
  const snapshotPids = Array.isArray(options.snapshotPids) ? options.snapshotPids : lastKnownDescendantPids;

  const liveRows = resolveProcessTreeRows(childPid, runner);
  const liveDescendants = liveRows ? liveRows.map((row) => row.pid).filter((pid) => pid !== childPid) : [];

  const candidates = [...new Set([...liveDescendants, ...snapshotPids])].filter(
    (pid) => Number.isInteger(pid) && pid > 1 && pid !== childPid && pid !== process.pid && signal(pid, 0),
  );
  if (candidates.length === 0) return;

  for (const pid of candidates) {
    if (process.platform !== 'win32') signal(-pid, 'SIGTERM');
    signal(pid, 'SIGTERM');
  }
  setTimeout(() => {
    for (const pid of candidates) {
      if (process.platform !== 'win32') signal(-pid, 'SIGKILL');
      signal(pid, 'SIGKILL');
    }
  }, 1000).unref();
}

async function recycleViaGracefulSelfExit(graceMs) {
  if (rssBreachSelfExitInProgress) return;
  rssBreachSelfExitInProgress = true;
  launcherShutdownInProgress = true;
  if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
  modelServerSupervisor?.clearTimers();
  if (modelServerDemandServer) {
    await stopModelServerDemandListener();
  }
  const modelServerChild = modelServerSupervisor?.getChild();
  if (isChildRunning(modelServerChild)) {
    log(`RSS ceiling sustained; sending SIGTERM to hf-model-server pid ${modelServerChild.pid} before launcher self-exit`);
    modelServerChild.kill('SIGTERM');
    modelServerSupervisor.reapProcessTree(modelServerChild.pid);
    const modelExitedAfterTerm = await waitForChildExit(modelServerChild, graceMs);
    if (!modelExitedAfterTerm && isChildRunning(modelServerChild)) {
      log(`hf-model-server pid ${modelServerChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before launcher self-exit`);
      modelServerChild.kill('SIGKILL');
      await waitForChildExit(modelServerChild, 1000);
    }
  }
  if (!isChildRunning(childProcess)) {
    clearLeaseFile();
    process.exit(0);
    return;
  }

  log(`RSS ceiling sustained; sending SIGTERM to context-server pid ${childProcess.pid} before launcher self-exit`);
  childProcess.kill('SIGTERM');
  const exitedAfterTerm = await waitForChildExit(childProcess, graceMs);
  if (!exitedAfterTerm && isChildRunning(childProcess)) {
    log(`context-server pid ${childProcess.pid} exceeded ${graceMs}ms grace; sending SIGKILL before launcher self-exit`);
    childProcess.kill('SIGKILL');
    await waitForChildExit(childProcess, 1000);
  }
  clearLeaseFile();
  process.exit(0);
}

function startRssWatchdog(childPid, options = {}) {
  const timerState = options.timerState || {
    get: () => rssWatchdogTimer,
    set: (timer) => {
      rssWatchdogTimer = timer;
    },
  };
  const existingTimer = timerState.get();
  if (existingTimer) {
    clearInterval(existingTimer);
    timerState.set(null);
  }
  const logger = options.log || log;
  const label = options.label || 'context-server';
  const runner = options.runner || defaultProcessRowsRunner;
  const snapshot = options.snapshot || {
    set: (pids) => {
      lastKnownDescendantPids = pids;
    },
  };
  const config = options.config || getWatchdogConfig(process.env, logger);
  if (!config.enabled && config.maxRssMb !== null && Number.isFinite(config.maxRssMb) && config.maxRssMb > 0) {
    logger(`RSS watchdog ceiling configured but ${config.selfExitEnv}=1 is not set; breach self-exit remains disabled (descendant tracking still active for crash-loop reap)`);
  }

  // The monitor ALWAYS runs (slower cadence when only tracking) so the crash-loop give-up reap has a
  // before-death descendant snapshot even when the RSS-breach self-exit is disabled (the default).
  const tickMs = config.enabled ? config.intervalMs : DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS;
  let consecutiveBreaches = 0;
  const timer = setInterval(() => {
    const rows = resolveProcessTreeRows(childPid, runner);
    if (rows === null) {
      // unknown / permission-denied / dead read: keep the prior snapshot, reset the breach streak
      consecutiveBreaches = 0;
      return;
    }
    snapshot.set(rows.map((row) => row.pid).filter((pid) => pid !== childPid && pid > 1));
    if (!config.enabled) return;
    const rssMb = rows.reduce((sum, row) => sum + Math.max(0, row.rss), 0) / 1024;
    if (rssMb <= config.maxRssMb) {
      consecutiveBreaches = 0;
      return;
    }
    consecutiveBreaches++;
    logger(`${label} process tree RSS ${rssMb.toFixed(1)} MB exceeds ${config.maxRssMb} MB (${consecutiveBreaches}/${config.consecutiveBreaches})`);
    if (consecutiveBreaches >= config.consecutiveBreaches) {
      const onBreach = options.onBreach || ((breachConfig) => recycleViaGracefulSelfExit(breachConfig.graceMs));
      void onBreach(config);
    }
  }, tickMs);
  timer.unref?.();
  timerState.set(timer);
  return timer;
}

function createModelServerSupervisor(options = {}) {
  const state = {
    child: options.child || null,
    crashLoopGuard: options.crashLoopGuard || null,
    relaunchTimer: null,
    rssWatchdogTimer: null,
    lastKnownDescendantPids: [],
  };
  const spawnFn = options.spawnFn || spawn;
  const logger = options.log || log;
  const env = options.env || process.env;
  const rootDir = options.rootDir || root;
  const modelServerPath = options.modelServerPath || path.join(opencodeDir, 'bin', 'hf-model-server.cjs');
  const writeLease = options.writeLease || (() => writeLeaseFile());
  const crashLoopConfig = options.crashLoopConfig || (() => getCrashLoopConfig(env));
  const watchdogConfig = options.watchdogConfig || (() => getModelServerWatchdogConfig(env, logger));
  const processRowsRunner = options.processRowsRunner || defaultProcessRowsRunner;
  const signal = options.signal || signalProcess;
  const liveness = options.liveness || processLiveness;
  const waitForExit = options.waitForExit || waitForPidExit;
  const setTimer = options.setTimeout || setTimeout;
  const clearTimer = options.clearTimeout || clearTimeout;
  const shouldExitLauncher = options.shouldExitLauncher || (() => launcherShutdownInProgress);
  const onRssBreach = options.onRssBreach || ((config) => recycleViaGracefulSelfExit(config.graceMs));

  function getPid() {
    return isChildRunning(state.child) ? state.child.pid : null;
  }

  function clearTimers() {
    if (state.relaunchTimer) {
      clearTimer(state.relaunchTimer);
      state.relaunchTimer = null;
    }
    if (state.rssWatchdogTimer) {
      clearInterval(state.rssWatchdogTimer);
      state.rssWatchdogTimer = null;
    }
  }

  function reapProcessTree(childPid) {
    reapProcessTreeGroups(childPid, {
      runner: processRowsRunner,
      signal,
      snapshotPids: state.lastKnownDescendantPids,
    });
  }

  async function reapBeforeRespawn(childPid) {
    const pidState = liveness(childPid);
    if (pidState === 'unknown-eperm') {
      return { allowed: false, reason: 'model-server-liveness-unknown-eperm' };
    }
    if (pidState === 'dead') {
      return { allowed: true, reaped: false, reason: 'model-server-already-dead' };
    }

    logger(`confirmed-dead hf-embed socket; reaping recorded hf-model-server pid ${childPid} before respawn`);
    signal(childPid, 'SIGTERM');
    reapProcessTree(childPid);
    const exitedAfterTerm = await waitForExit(childPid, RESPAWN_REAP_GRACE_MS);
    if (!exitedAfterTerm) {
      logger(`hf-model-server pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
      signal(childPid, 'SIGKILL');
      await waitForExit(childPid, 1000);
    }
    return { allowed: true, reaped: true, reason: 'model-server-reaped' };
  }

  function scheduleDemandListener() {
    if (options.startDemandListener === false) return;
    void startModelServerDemandListener().catch((error) => {
      logger(`hf-model-server demand listener restart failed: ${error.stack || error.message}`);
    });
  }

  function launch() {
    if (shouldSkipLaunch(state.child)) {
      logger('launchModelServer skipped: an hf-model-server child is already running in this launcher process');
      return false;
    }
    if (!state.crashLoopGuard) state.crashLoopGuard = createCrashLoopGuard(crashLoopConfig());
    if (state.relaunchTimer) {
      clearTimer(state.relaunchTimer);
      state.relaunchTimer = null;
    }

    state.child = spawnFn(process.execPath, [modelServerPath], {
      cwd: rootDir,
      env,
      stdio: 'inherit',
    });
    const childPid = state.child.pid;
    if (!Number.isInteger(childPid) || childPid <= 0) {
      logger('launchModelServer failed: spawned hf-model-server child has no pid');
      return false;
    }
    writeLease();
    startRssWatchdog(childPid, {
      config: watchdogConfig(),
      label: 'hf-model-server',
      runner: processRowsRunner,
      log: logger,
      timerState: {
        get: () => state.rssWatchdogTimer,
        set: (timer) => {
          state.rssWatchdogTimer = timer;
        },
      },
      snapshot: {
        set: (pids) => {
          state.lastKnownDescendantPids = pids;
        },
      },
      onBreach: onRssBreach,
    });

    state.child.on('exit', (code, signalCode) => {
      if (shouldExitLauncher()) {
        return;
      }
      const result = superviseChildExit(
        { code, signal: signalCode, childPid, intentional: false },
        {
          crashLoopGuard: state.crashLoopGuard,
          clearLease: () => {
            state.child = null;
            writeLease();
          },
          reapProcessGroup: reapProcessTree,
          mirrorSignal: (exitSignal) => logger(`hf-model-server crash loop exhausted after signal ${exitSignal}; daemon remains running`),
          exit: (exitCode) => logger(`hf-model-server crash loop exhausted with exit ${exitCode}; daemon remains running`),
          scheduleRelaunch: (backoffMs) => {
            logger(`hf-model-server child exited code=${code ?? 'null'} signal=${signalCode ?? 'null'}; relaunching in ${backoffMs}ms`);
            state.relaunchTimer = setTimer(() => launch(), backoffMs);
            state.relaunchTimer.unref?.();
          },
        },
      );
      if (result.action === 'give-up') {
        logger(`hf-model-server crash loop detected after ${result.deathsInWindow} deaths; modelServerPid removed from lease`);
        scheduleDemandListener();
      }
    });

    state.child.on('error', (error) => {
      logger(error.stack || error.message);
    });
    return true;
  }

  return {
    clearTimers,
    getChild: () => state.child,
    getPid,
    getSnapshotPids: () => [...state.lastKnownDescendantPids],
    launch,
    reapBeforeRespawn,
    reapProcessTree,
  };
}

function getModelServerSupervisor() {
  if (!modelServerSupervisor) {
    modelServerSupervisor = createModelServerSupervisor();
  }
  return modelServerSupervisor;
}

function launchModelServer(options = null) {
  if (options && typeof options === 'object') {
    return createModelServerSupervisor(options).launch();
  }
  return getModelServerSupervisor().launch();
}

function writeDemandResponse(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
  });
  response.end(body);
}

function unlinkModelServerSocket(socketPath) {
  if (socketPath.startsWith('tcp://')) return;
  try {
    fs.unlinkSync(socketPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function releaseModelServerDemandListenerForSpawn() {
  const server = modelServerDemandServer;
  const target = modelServerDemandTarget;
  modelServerDemandServer = null;
  modelServerDemandTarget = null;
  if (target) unlinkModelServerSocket(target);
  if (server) {
    server.close(() => undefined);
  }
}

async function stopModelServerDemandListener() {
  const server = modelServerDemandServer;
  const target = modelServerDemandTarget;
  modelServerDemandServer = null;
  modelServerDemandTarget = null;
  if (!server) {
    if (target) unlinkModelServerSocket(target);
    return;
  }
  await new Promise((resolve) => {
    server.close(() => resolve());
  });
  if (target) unlinkModelServerSocket(target);
}

async function reapRecordedModelServerBeforeRespawn(socketPath) {
  const lease = readLeaseFile();
  const modelServerPid = lease?.modelServerPid;
  if (!Number.isInteger(modelServerPid) || modelServerPid <= 0) {
    return { allowed: true, reaped: false, reason: 'missing-model-server-pid' };
  }

  const respawnLock = acquireModelServerRespawnLockFile(socketPath);
  if (!respawnLock.acquired) {
    return { allowed: false, reason: 'model-server-respawn-lock-held', lockPath: respawnLock.path };
  }
  try {
    return await getModelServerSupervisor().reapBeforeRespawn(modelServerPid);
  } finally {
    releaseRespawnLockFile(respawnLock);
  }
}

async function prepareModelServerDemandTarget(socketPath) {
  if (socketPath.startsWith('tcp://')) {
    return { shouldListen: true };
  }
  fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
  if (!fs.existsSync(socketPath)) {
    return { shouldListen: true };
  }

  const { probeModelServer } = loadBridgeModule();
  if (typeof probeModelServer === 'function') {
    const probe = await probeModelServer(socketPath, { timeoutMs: 1000 });
    if (probe.status === 'alive') {
      return { shouldListen: false, reason: 'model-server-alive' };
    }
  }

  const reapResult = await reapRecordedModelServerBeforeRespawn(socketPath);
  if (!reapResult.allowed) {
    return { shouldListen: false, reason: reapResult.reason };
  }
  unlinkModelServerSocket(socketPath);
  return { shouldListen: true, reason: reapResult.reason };
}

function handleModelServerDemand(request, response) {
  const routePath = new URL(request.url || '/', 'http://127.0.0.1').pathname;
  log(`hf-model-server demand received ${request.method || 'GET'} ${routePath}; spawning launcher-owned sibling`);
  releaseModelServerDemandListenerForSpawn();
  const launched = launchModelServer();
  writeDemandResponse(response, MODEL_SERVER_DEMAND_STATUS, {
    state: 'loading',
    modelServerLaunchRequested: true,
    launched,
  });
}

async function startModelServerDemandListener(options = {}) {
  if (modelServerDemandServer || getModelServerPid()) {
    return { started: false, reason: 'already-owned' };
  }

  const socketPath = options.socketPath || resolveModelServerSocketPath();
  const prepared = options.skipPrepare ? { shouldListen: true } : await prepareModelServerDemandTarget(socketPath);
  if (!prepared.shouldListen) {
    log(`hf-model-server demand listener skipped: ${prepared.reason}`);
    return { started: false, reason: prepared.reason, socketPath };
  }

  const server = http.createServer(handleModelServerDemand);
  await new Promise((resolve, reject) => {
    let reclaimedStaleSocket = false;
    const onError = (error) => {
      // Mirror the model server's listen path: a stale hf-embed.sock left by a crashed listener
      // surfaces as EADDRINUSE. Unlink it once and retry so a prior crash cannot silently disable
      // lazy embeds until a manual restart.
      if (error && error.code === 'EADDRINUSE' && !socketPath.startsWith('tcp://') && !reclaimedStaleSocket) {
        reclaimedStaleSocket = true;
        unlinkModelServerSocket(socketPath);
        server.listen(socketPath);
        return;
      }
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.on('error', onError);
    server.once('listening', onListening);
    if (socketPath.startsWith('tcp://')) {
      const url = new URL(socketPath);
      server.listen(Number.parseInt(url.port, 10), url.hostname || '127.0.0.1');
    } else {
      server.listen(socketPath);
    }
  });

  if (!socketPath.startsWith('tcp://')) {
    fs.chmodSync(socketPath, 0o600);
  }
  modelServerDemandServer = server;
  modelServerDemandTarget = socketPath;
  log(`hf-model-server lazy demand listener ready at ${socketPath}`);
  return { started: true, socketPath };
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
          fs.rmSync(lockDir, { recursive: true, force: true });
          continue;
        }
      } catch (statErr) {
        if (statErr.code === 'ENOENT') continue;
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

// Duplicate-spawn guard (REQ-004): skip a launch only while a child is CURRENTLY running, so the
// crash-loop supervisor's legitimate sequential relaunch (after the prior child has EXITED) is still
// allowed. A one-shot "ever launched" flag would permanently disable F1's relaunch path.
function shouldSkipLaunch(child) {
  return Boolean(child && isChildRunning(child));
}

function launchServer() {
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
    env: process.env,
    stdio: 'inherit',
  });
  const childPid = childProcess.pid;
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
        clearLease: clearLeaseFile,
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
  return true;
}

async function shutdownLauncherForSignal(signal) {
  if (launcherShutdownInProgress) return;
  launcherShutdownInProgress = true;
  if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
  if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
  modelServerSupervisor?.clearTimers();
  await stopModelServerDemandListener();

  const children = [];
  if (isChildRunning(childProcess)) {
    children.push({ child: childProcess, label: 'context-server' });
  }
  const modelServerChild = modelServerSupervisor?.getChild();
  if (isChildRunning(modelServerChild)) {
    children.push({ child: modelServerChild, label: 'hf-model-server' });
  }

  if (children.length === 0) {
    clearLeaseFile();
    process.exit(128);
    return;
  }

  for (const { child, label } of children) {
    if (label === 'hf-model-server') {
      modelServerSupervisor.reapProcessTree(child.pid);
    }
    child.kill(signal);
  }

  const exited = await Promise.race([
    Promise.all(children.map(({ child }) => waitForChildExit(child, 5000))).then((results) => results.every(Boolean)),
    sleep(5000).then(() => false),
  ]);
  if (!exited) {
    for (const { child } of children) {
      if (isChildRunning(child)) child.kill('SIGKILL');
    }
  }
  clearLeaseFile();
  process.exit(128);
}

function installSignalHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
    process.on(signal, () => {
      void shutdownLauncherForSignal(signal).catch((error) => {
        log(error.stack || error.message);
        clearLeaseFile();
        process.exit(128);
      });
    });
  }
  process.on('uncaughtException', (err) => {
    try {
      clearLeaseFile();
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
    // REQ-011: lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearLeaseFile);
    refreshPaths();

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER);
    if (strictSingleWriter) {
      const leaseResult = isLeaseHeld();
      if (leaseResult.held && !leaseResult.staleReclaimable) {
        await bridgeOrReportLeaseHeld(leaseResult);
        return;
      }
      if (leaseResult.staleReclaimable) {
        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
      }
    } else {
      log('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    }

    ensureLayout(actions);
    refreshPaths();
    enforceStandaloneCodeGraphDb(actions);

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
    }

    writeLeaseFile();
    const reprobe = readLeaseFile();
    if (!reprobe || reprobe.pid !== process.pid) {
      const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
      process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
      process.exit(0);
    }
    launchServer();
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
  resolveModelServerSocketPath,
  sampleProcessTreeRssMb,
  shouldSkipLaunch,
  signalProcess,
  startModelServerDemandListener,
  startRssWatchdog,
  stopModelServerDemandListener,
  superviseChildExit,
};

if (require.main === module) {
  void main();
}
