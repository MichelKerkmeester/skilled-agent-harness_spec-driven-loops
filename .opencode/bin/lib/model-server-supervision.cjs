// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Model Server Supervision                                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Shared hf-model-server launcher supervision for OpenCode MCPs   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const defaultRoot = path.resolve(__dirname, '..', '..', '..');
const defaultOpencodeDir = path.join(defaultRoot, '.opencode');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SHUTDOWN_DEADLINE_MS = 5000;
const RESPAWN_REAP_GRACE_MS = 7000;
const RESPAWN_LOCK_STALE_MS = 60000;
const DEFAULT_WATCHDOG_GRACE_MS = 7000;
const DEFAULT_WATCHDOG_INTERVAL_MS = 15000;
const DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES = 3;
const DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS = 30000;
const DEFAULT_CRASH_LOOP_MAX_DEATHS = 3;
const DEFAULT_CRASH_LOOP_WINDOW_MS = 60000;
const DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS = 250;
const DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS = 5000;
const HF_MODEL_SERVER_SOCKET_FILE_NAME = 'hf-embed.sock';
const HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME = 'hf-embed-respawn.lock';
const HF_MODEL_SERVER_PID_FILE_NAME = 'hf-embed.pid';
const MODEL_SERVER_DEMAND_STATUS = 503;

function defaultLog(message) {
  process.stderr.write(`[model-server-supervision] ${message}\n`);
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

function normalizeWatchdogGraceMs(rawGraceMs, warn = defaultLog, envName = 'SPECKIT_LAUNCHER_RSS_GRACE_MS') {
  const parsed = parsePositiveInteger(rawGraceMs, DEFAULT_WATCHDOG_GRACE_MS);
  if (parsed > SHUTDOWN_DEADLINE_MS) return parsed;
  warn(`${envName}=${JSON.stringify(rawGraceMs)} is <= ${SHUTDOWN_DEADLINE_MS}; using ${DEFAULT_WATCHDOG_GRACE_MS}ms`);
  return DEFAULT_WATCHDOG_GRACE_MS;
}

function getWatchdogConfig(env = process.env, warn = defaultLog, options = {}) {
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

function getModelServerWatchdogConfig(env = process.env, warn = defaultLog) {
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

function signalProcess(pid, signal) {
  try {
    process.kill(pid, signal);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH' || error.code === 'EPERM') return false;
    throw error;
  }
}

function isChildRunning(child) {
  return child && child.exitCode === null && child.signalCode === null;
}

function shouldSkipLaunch(child) {
  return Boolean(child && isChildRunning(child));
}

function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner, options = {}) {
  const snapshot = Array.isArray(options.snapshotPids) ? options.snapshotPids : [];
  const rows = resolveProcessTreeRows(childPid, runner);
  if (rows === null) return snapshot;
  const pids = rows.map((row) => row.pid).filter((pid) => pid !== childPid && pid > 1);
  if (options.snapshot && typeof options.snapshot.set === 'function') {
    options.snapshot.set(pids);
  }
  return pids;
}

function reapProcessTreeGroups(childPid, options = {}) {
  const runner = options.runner || defaultProcessRowsRunner;
  const signal = options.signal || signalProcess;
  const snapshotPids = Array.isArray(options.snapshotPids) ? options.snapshotPids : [];

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

function startRssWatchdog(childPid, options = {}) {
  let fallbackTimer = null;
  const timerState = options.timerState || {
    get: () => fallbackTimer,
    set: (timer) => {
      fallbackTimer = timer;
    },
  };
  const existingTimer = timerState.get();
  if (existingTimer) {
    clearInterval(existingTimer);
    timerState.set(null);
  }
  const logger = options.log || defaultLog;
  const label = options.label || 'context-server';
  const runner = options.runner || defaultProcessRowsRunner;
  let fallbackSnapshotPids = [];
  const snapshot = options.snapshot || {
    set: (pids) => {
      fallbackSnapshotPids = pids;
    },
    get: () => fallbackSnapshotPids,
  };
  const config = options.config || getWatchdogConfig(process.env, logger);
  if (!config.enabled && config.maxRssMb !== null && Number.isFinite(config.maxRssMb) && config.maxRssMb > 0) {
    logger(`RSS watchdog ceiling configured but ${config.selfExitEnv}=1 is not set; breach self-exit remains disabled (descendant tracking still active for crash-loop reap)`);
  }

  const tickMs = config.enabled ? config.intervalMs : DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS;
  let consecutiveBreaches = 0;
  const timer = setInterval(() => {
    const rows = resolveProcessTreeRows(childPid, runner);
    if (rows === null) {
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
      const onBreach = options.onBreach || (() => undefined);
      void onBreach(config);
    }
  }, tickMs);
  timer.unref?.();
  timerState.set(timer);
  return timer;
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

  const rawDbDir = typeof options.dbDir === 'function' ? options.dbDir() : options.dbDir;
  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(rawDbDir || path.join(defaultOpencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'));
  return path.join(socketDir, HF_MODEL_SERVER_SOCKET_FILE_NAME);
}

function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath(), options = {}) {
  const rawDbDir = typeof options.dbDir === 'function' ? options.dbDir() : options.dbDir;
  const lockDirPath = socketPath.startsWith('tcp://')
    ? path.resolve(rawDbDir || path.join(defaultOpencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'))
    : path.dirname(socketPath);
  return path.join(lockDirPath, HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME);
}

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

function acquireRespawnLockFileAt(lockPath, label = 'respawn', options = {}) {
  const logger = options.log || defaultLog;
  const rel = options.rel || ((p) => p);
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
  let raw = '';
  try {
    raw = fs.readFileSync(currentLockPath, 'utf8');
  } catch (readErr) {
    if (readErr.code !== 'ENOENT') throw readErr;
  }
  if (raw === '' || isRespawnLockStale(raw, options)) {
    try {
      fs.unlinkSync(currentLockPath);
    } catch (unlinkErr) {
      if (unlinkErr.code !== 'ENOENT') throw unlinkErr;
    }
    try {
      const reclaimed = tryOpen();
      logger(`reclaimed stale ${label} lock ${rel(currentLockPath)}`);
      return reclaimed;
    } catch (retryErr) {
      if (retryErr.code !== 'EEXIST') throw retryErr;
    }
  }
  return { acquired: false, path: currentLockPath };
}

function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath(), options = {}) {
  return acquireRespawnLockFileAt(
    modelServerRespawnLockPath(socketPath, options),
    'hf-model-server respawn',
    options,
  );
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

function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null) {
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

function createModelServerSupervisor(options = {}) {
  const state = {
    child: options.child || null,
    crashLoopGuard: options.crashLoopGuard || null,
    relaunchTimer: null,
    rssWatchdogTimer: null,
    lastKnownDescendantPids: [],
  };
  const spawnFn = options.spawnFn || spawn;
  const logger = options.log || defaultLog;
  const env = options.env || process.env;
  const rootDir = options.rootDir || defaultRoot;
  const modelServerPath = options.modelServerPath || path.join(defaultOpencodeDir, 'bin', 'hf-model-server.cjs');
  const writeLease = options.writeLease || (() => undefined);
  const crashLoopConfig = options.crashLoopConfig || (() => getCrashLoopConfig(env));
  const watchdogConfig = options.watchdogConfig || (() => getModelServerWatchdogConfig(env, logger));
  const processRowsRunner = options.processRowsRunner || defaultProcessRowsRunner;
  const signal = options.signal || signalProcess;
  const liveness = options.liveness || processLiveness;
  const waitForExit = options.waitForExit || waitForPidExit;
  const setTimer = options.setTimeout || setTimeout;
  const clearTimer = options.clearTimeout || clearTimeout;
  const shouldExitLauncher = options.shouldExitLauncher || (() => false);
  const onRssBreach = options.onRssBreach || (() => undefined);

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
    void options.startDemandListener().catch((error) => {
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
    writeLease(childPid);
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
            writeLease(null);
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

function createModelServerControl(deps = {}) {
  const logger = deps.log || defaultLog;
  const env = deps.env || process.env;
  const rootDir = deps.rootDir || defaultRoot;
  const opencodeDir = deps.opencodeDir || path.join(rootDir, '.opencode');
  const dbDir = deps.dbDir || (() => path.join(opencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'));
  const modelServerPath = deps.modelServerPath || path.join(opencodeDir, 'bin', 'hf-model-server.cjs');
  const signal = deps.signal || signalProcess;
  const processRowsRunner = deps.processRowsRunner || defaultProcessRowsRunner;
  const liveness = deps.liveness || processLiveness;
  const state = {
    demandServer: null,
    demandTarget: null,
    demandRespawnLock: null,
    supervisor: null,
    lastKnownDescendantPids: [],
  };

  const resolveSocketPath = (options = {}) => {
    if (typeof deps.resolveSocketPath === 'function') return deps.resolveSocketPath(options);
    return resolveModelServerSocketPath(env, {
      ...options,
      dbDir,
    });
  };

  function writeModelServerPid(pid) {
    if (typeof deps.writeModelServerPid === 'function') deps.writeModelServerPid(pid);
    if (typeof deps.writeLease === 'function') deps.writeLease(pid);
  }

  function readModelServerPid() {
    if (typeof deps.readModelServerPid === 'function') return deps.readModelServerPid();
    return null;
  }

  function getSupervisor() {
    if (!state.supervisor) {
      state.supervisor = createModelServerSupervisor({
        spawnFn: deps.spawnFn,
        child: deps.child,
        crashLoopGuard: deps.crashLoopGuard,
        env,
        rootDir,
        modelServerPath,
        log: logger,
        writeLease: writeModelServerPid,
        crashLoopConfig: deps.crashLoopConfig || (() => getCrashLoopConfig(env)),
        watchdogConfig: deps.watchdogConfig || (() => getModelServerWatchdogConfig(env, logger)),
        processRowsRunner,
        signal,
        liveness: deps.liveness || processLiveness,
        waitForExit: deps.waitForExit || waitForPidExit,
        setTimeout: deps.setTimeout || setTimeout,
        clearTimeout: deps.clearTimeout || clearTimeout,
        shouldExitLauncher: deps.getLauncherShutdownInProgress || (() => false),
        onRssBreach: deps.onRssBreach || (() => undefined),
        startDemandListener: () => startModelServerDemandListener(),
      });
    }
    return state.supervisor;
  }

  function getPid() {
    return state.supervisor ? state.supervisor.getPid() : null;
  }

  function releaseDemandRespawnLock() {
    releaseRespawnLockFile(state.demandRespawnLock);
    state.demandRespawnLock = null;
  }

  function acquireDemandRespawnLock(socketPath) {
    if (state.demandRespawnLock?.acquired) {
      return state.demandRespawnLock;
    }
    const lock = acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
    if (lock.acquired) {
      state.demandRespawnLock = lock;
    }
    return lock;
  }

  function releaseModelServerDemandListenerForSpawn(options = {}) {
    const server = state.demandServer;
    const target = state.demandTarget;
    state.demandServer = null;
    state.demandTarget = null;
    if (target) unlinkModelServerSocket(target);
    if (server) {
      server.close(() => undefined);
    }
    if (!options.keepRespawnLock) releaseDemandRespawnLock();
  }

  async function stopModelServerDemandListener() {
    const server = state.demandServer;
    const target = state.demandTarget;
    state.demandServer = null;
    state.demandTarget = null;
    try {
      if (!server) {
        if (target) unlinkModelServerSocket(target);
        return;
      }
      await new Promise((resolve) => {
        server.close(() => resolve());
      });
      if (target) unlinkModelServerSocket(target);
    } finally {
      releaseDemandRespawnLock();
    }
  }

  async function reapRecordedModelServerBeforeRespawn(socketPath, options = {}) {
    const lock = options.lock || acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
    if (!lock.acquired) {
      return { allowed: false, reason: 'model-server-respawn-lock-held', lockPath: lock.path };
    }
    try {
      const modelServerPid = readModelServerPid();
      if (!Number.isInteger(modelServerPid) || modelServerPid <= 0) {
        return { allowed: true, reaped: false, reason: 'missing-model-server-pid' };
      }
      return await getSupervisor().reapBeforeRespawn(modelServerPid);
    } finally {
      if (!options.lock) releaseRespawnLockFile(lock);
    }
  }

  async function prepareModelServerDemandTarget(socketPath) {
    if (socketPath.startsWith('tcp://')) {
      const lock = acquireDemandRespawnLock(socketPath);
      if (!lock.acquired) return { shouldListen: false, reason: 'model-server-respawn-lock-held', lockPath: lock.path };
      return { shouldListen: true };
    }
    fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
    if (fs.existsSync(socketPath)) {
      const probeModelServer = deps.bridge && deps.bridge.probeModelServer;
      if (typeof probeModelServer === 'function') {
        const probe = await probeModelServer(socketPath, { timeoutMs: 1000 });
        if (probe.status === 'alive') {
          return { shouldListen: false, reason: 'model-server-alive' };
        }
      }
    }

    // The respawn lock is intentionally held across the bind + idle-listener window (released only on
    // demand-driven spawn, shutdown, or listen failure) so a second launcher sharing this socket loses
    // cleanly with 'model-server-respawn-lock-held' instead of racing the bind. (Lock LIFETIME differs
    // from the phase-004 single-launcher path by design; the wx-open + UDS-bind primitives are unchanged.)
    const lock = acquireDemandRespawnLock(socketPath);
    if (!lock.acquired) return { shouldListen: false, reason: 'model-server-respawn-lock-held', lockPath: lock.path };
    let reapResult;
    if (fs.existsSync(socketPath)) {
      reapResult = await reapRecordedModelServerBeforeRespawn(socketPath, { lock });
    } else {
      // No socket file yet — but a sibling launcher may have JUST spawned the server: launch() writes the
      // shared hf-embed.pid synchronously before the child binds, so during the spawn->bind window the pid
      // is live while the socket is absent. Respect a live recorded pid so we do not clobber a booting
      // resident (the demand lock can be momentarily free right after a sibling's spawn).
      const recordedPid = readModelServerPid();
      if (Number.isInteger(recordedPid) && recordedPid > 0 && liveness(recordedPid) !== 'dead') {
        releaseDemandRespawnLock();
        return { shouldListen: false, reason: 'model-server-booting' };
      }
      reapResult = { allowed: true, reaped: false, reason: 'missing-model-server-pid' };
    }
    if (!reapResult.allowed) {
      releaseDemandRespawnLock();
      return { shouldListen: false, reason: reapResult.reason, lockPath: reapResult.lockPath };
    }
    unlinkModelServerSocket(socketPath);
    return { shouldListen: true, reason: reapResult.reason };
  }

  function handleModelServerDemand(request, response) {
    const routePath = new URL(request.url || '/', 'http://127.0.0.1').pathname;
    logger(`hf-model-server demand received ${request.method || 'GET'} ${routePath}; spawning launcher-owned sibling`);
    releaseModelServerDemandListenerForSpawn({ keepRespawnLock: true });
    const launched = getSupervisor().launch();
    releaseDemandRespawnLock();
    writeDemandResponse(response, MODEL_SERVER_DEMAND_STATUS, {
      state: 'loading',
      modelServerLaunchRequested: true,
      launched,
    });
  }

  async function startModelServerDemandListener(options = {}) {
    if (state.demandServer || getPid()) {
      return { started: false, reason: 'already-owned' };
    }

    const socketPath = options.socketPath || resolveSocketPath();
    const prepared = options.skipPrepare ? { shouldListen: true } : await prepareModelServerDemandTarget(socketPath);
    if (!prepared.shouldListen) {
      logger(`hf-model-server demand listener skipped: ${prepared.reason}`);
      return { started: false, reason: prepared.reason, socketPath, lockPath: prepared.lockPath };
    }

    const server = (deps.httpCreateServer || http.createServer)(handleModelServerDemand);
    try {
      await new Promise((resolve, reject) => {
        let reclaimedStaleSocket = false;
        const onError = (error) => {
          if (error && error.code === 'EADDRINUSE' && !socketPath.startsWith('tcp://') && !reclaimedStaleSocket) {
            // Only reclaim a CONFIRMED-STALE socket. If the shared pid still records a live resident,
            // a sibling launcher's server bound first — do not unlink its live socket (it serves embeds
            // for everyone). Reject so this launcher backs off rather than clobbering a working server.
            const recordedPid = readModelServerPid();
            if (Number.isInteger(recordedPid) && recordedPid > 0 && liveness(recordedPid) !== 'dead') {
              server.off('listening', onListening);
              reject(new Error(`hf-model-server socket ${socketPath} owned by a live resident (pid ${recordedPid}); not reclaiming`));
              return;
            }
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
    } catch (error) {
      releaseDemandRespawnLock();
      throw error;
    }

    if (!socketPath.startsWith('tcp://')) {
      fs.chmodSync(socketPath, 0o600);
    }
    state.demandServer = server;
    state.demandTarget = socketPath;
    logger(`hf-model-server lazy demand listener ready at ${socketPath}`);
    return { started: true, socketPath };
  }

  return {
    start: startModelServerDemandListener,
    startDemandListener: startModelServerDemandListener,
    stopDemandListener: stopModelServerDemandListener,
    releaseDemandListenerForSpawn: releaseModelServerDemandListenerForSpawn,
    launch: () => getSupervisor().launch(),
    getPid,
    getChild: () => (state.supervisor ? state.supervisor.getChild() : null),
    getSnapshotPids: () => (state.supervisor ? state.supervisor.getSnapshotPids() : [...state.lastKnownDescendantPids]),
    clearTimers: () => {
      if (state.supervisor) state.supervisor.clearTimers();
    },
    reapProcessTree: (childPid) => getSupervisor().reapProcessTree(childPid),
    reapBeforeRespawn: (childPid) => getSupervisor().reapBeforeRespawn(childPid),
    reapRecordedBeforeRespawn: reapRecordedModelServerBeforeRespawn,
    resolveSocketPath,
  };
}

module.exports = {
  SHUTDOWN_DEADLINE_MS,
  RESPAWN_REAP_GRACE_MS,
  RESPAWN_LOCK_STALE_MS,
  DEFAULT_WATCHDOG_GRACE_MS,
  DEFAULT_WATCHDOG_INTERVAL_MS,
  DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES,
  DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS,
  DEFAULT_CRASH_LOOP_MAX_DEATHS,
  DEFAULT_CRASH_LOOP_WINDOW_MS,
  DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS,
  DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS,
  HF_MODEL_SERVER_SOCKET_FILE_NAME,
  HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME,
  HF_MODEL_SERVER_PID_FILE_NAME,
  MODEL_SERVER_DEMAND_STATUS,
  acquireModelServerRespawnLockFile,
  acquireRespawnLockFileAt,
  buildLeaseObject,
  canonicalizePath,
  computeBackoffMs,
  createCrashLoopGuard,
  createModelServerControl,
  createModelServerSupervisor,
  defaultProcessRowsRunner,
  ensureCanonicalDir,
  getCrashLoopConfig,
  getModelServerWatchdogConfig,
  getWatchdogConfig,
  isChildRunning,
  isPermissionError,
  isRespawnLockStale,
  modelServerRespawnLockPath,
  normalizeModelServerTarget,
  normalizeWatchdogGraceMs,
  parseProcessRows,
  processLiveness,
  reapProcessTreeGroups,
  refreshDescendantSnapshot,
  releaseRespawnLockFile,
  resolveModelServerSocketPath,
  resolveProcessTreeRows,
  sampleProcessTreeRssMb,
  shouldSkipLaunch,
  signalProcess,
  startRssWatchdog,
  superviseChildExit,
  unlinkModelServerSocket,
  waitForPidExit,
  writeDemandResponse,
};
