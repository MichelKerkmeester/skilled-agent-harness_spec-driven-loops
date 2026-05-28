#!/usr/bin/env node
// [mk-spec-memory-launcher] MCP child-process launcher for the mk-spec-memory server.
// Loads project-local env overrides, ensures dist artifacts are built and current,
// serializes concurrent starts via a filesystem bootstrap lock, then spawns the
// context-server.js child. All stderr lines are tagged with the bracketed module
// prefix for ops grepping. See .opencode/specs/.../014/052-mk-spec-memory-rename for
// the rename packet that established this name.

'use strict';

const fs = require('fs');
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
let childProcess = null;
let leaseStartedAt = null;
let launcherShutdownInProgress = false;
let rssBreachSelfExitInProgress = false;
let rssWatchdogTimer = null;
let crashLoopGuard = null;
let supervisorRelaunchTimer = null;
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

function normalizeWatchdogGraceMs(rawGraceMs, warn = log) {
  const parsed = parsePositiveInteger(rawGraceMs, DEFAULT_WATCHDOG_GRACE_MS);
  if (parsed > SHUTDOWN_DEADLINE_MS) return parsed;
  warn(`SPECKIT_LAUNCHER_RSS_GRACE_MS=${JSON.stringify(rawGraceMs)} is <= ${SHUTDOWN_DEADLINE_MS}; using ${DEFAULT_WATCHDOG_GRACE_MS}ms`);
  return DEFAULT_WATCHDOG_GRACE_MS;
}

function getWatchdogConfig(env = process.env, warn = log) {
  const rawMaxRssMb = env.SPECKIT_CONTEXT_SERVER_MAX_RSS_MB;
  const maxRssMb = rawMaxRssMb === undefined || rawMaxRssMb === null || String(rawMaxRssMb).trim() === ''
    ? null
    : Number.parseFloat(String(rawMaxRssMb).trim());
  // REQ-008: host relaunch after clean launcher exit is unconfirmed, so RSS-breach self-exit is explicit opt-in only.
  const enabled = Number.isFinite(maxRssMb) && maxRssMb > 0 && env.SPECKIT_LAUNCHER_RSS_SELF_EXIT === '1';
  return {
    enabled,
    maxRssMb,
    intervalMs: parsePositiveInteger(env.SPECKIT_LAUNCHER_RSS_WATCHDOG_INTERVAL_MS, DEFAULT_WATCHDOG_INTERVAL_MS),
    consecutiveBreaches: parsePositiveInteger(env.SPECKIT_LAUNCHER_RSS_CONSECUTIVE_BREACHES, DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES),
    graceMs: normalizeWatchdogGraceMs(env.SPECKIT_LAUNCHER_RSS_GRACE_MS, warn),
  };
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
      maybeBridgeLeaseHolder({ leaseResult }) {
        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
        return true;
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

function bridgeOrReportLeaseHeld(leaseResult) {
  const { maybeBridgeLeaseHolder } = loadBridgeModule();
  return maybeBridgeLeaseHolder({
    serviceName: 'mk-spec-memory',
    leaseResult,
    loggerPrefix: 'mk-spec-memory-launcher',
    dbDir: resolvedDbDir(),
  });
}

// Pure lease-payload builder (exported for tests). `childPid` is an ADDITIVE field present only when
// a real daemon child has been spawned; existing readers consume only pid/startedAt and ignore it.
function buildLeaseObject(childPid = null, startedAt = leaseStartedAt) {
  const payload = {
    pid: process.pid,
    startedAt: startedAt || new Date().toISOString(),
    ownerPid: process.pid,
  };
  if (Number.isInteger(childPid) && childPid > 0) {
    payload.childPid = childPid;
  }
  return payload;
}

function writeLeaseFile(childPid = null) {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
  const tmp = currentLeasePath + '.tmp.' + process.pid;
  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
  const payload = buildLeaseObject(childPid, leaseStartedAt);
  fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, currentLeasePath);
}

function clearLeaseFile() {
  try {
    const lease = readLeaseFile();
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

function startRssWatchdog(childPid) {
  if (rssWatchdogTimer) {
    clearInterval(rssWatchdogTimer);
    rssWatchdogTimer = null;
  }
  const config = getWatchdogConfig(process.env, log);
  if (!config.enabled && config.maxRssMb !== null && Number.isFinite(config.maxRssMb) && config.maxRssMb > 0) {
    log('RSS watchdog ceiling configured but SPECKIT_LAUNCHER_RSS_SELF_EXIT=1 is not set; breach self-exit remains disabled (descendant tracking still active for crash-loop reap)');
  }

  // The monitor ALWAYS runs (slower cadence when only tracking) so the crash-loop give-up reap has a
  // before-death descendant snapshot even when the RSS-breach self-exit is disabled (the default).
  const tickMs = config.enabled ? config.intervalMs : DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS;
  let consecutiveBreaches = 0;
  rssWatchdogTimer = setInterval(() => {
    const rows = resolveProcessTreeRows(childPid);
    if (rows === null) {
      // unknown / permission-denied / dead read: keep the prior snapshot, reset the breach streak
      consecutiveBreaches = 0;
      return;
    }
    lastKnownDescendantPids = rows.map((row) => row.pid).filter((pid) => pid !== childPid && pid > 1);
    if (!config.enabled) return;
    const rssMb = rows.reduce((sum, row) => sum + Math.max(0, row.rss), 0) / 1024;
    if (rssMb <= config.maxRssMb) {
      consecutiveBreaches = 0;
      return;
    }
    consecutiveBreaches++;
    log(`context-server process tree RSS ${rssMb.toFixed(1)} MB exceeds ${config.maxRssMb} MB (${consecutiveBreaches}/${config.consecutiveBreaches})`);
    if (consecutiveBreaches >= config.consecutiveBreaches) {
      void recycleViaGracefulSelfExit(config.graceMs);
    }
  }, tickMs);
  rssWatchdogTimer.unref?.();
}

async function acquireBootstrapLock() {
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
      if (artifactsReady()) {
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
}

function installSignalHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
    process.on(signal, () => {
      if (childProcess && !childProcess.killed) {
        launcherShutdownInProgress = true;
        if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
        if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
        childProcess.once('exit', () => {
          clearLeaseFile();
          process.exit(128);
        });
        childProcess.kill(signal);
        setTimeout(() => {
          if (childProcess && childProcess.exitCode === null && childProcess.signalCode === null) {
            childProcess.kill('SIGKILL');
          }
          clearLeaseFile();
          process.exit(128);
        }, 5000).unref();
        return;
      }
      clearLeaseFile();
      process.exit(128);
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
        bridgeOrReportLeaseHeld(leaseResult);
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
  buildLeaseObject,
  computeBackoffMs,
  createCrashLoopGuard,
  getWatchdogConfig,
  normalizeWatchdogGraceMs,
  parseProcessRows,
  reapProcessTreeGroups,
  refreshDescendantSnapshot,
  sampleProcessTreeRssMb,
  signalProcess,
  superviseChildExit,
};

if (require.main === module) {
  void main();
}
