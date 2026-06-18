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
const HF_MODEL_SERVER_GIVEUP_FILE_NAME = 'hf-embed-giveup.json';
const MODEL_SERVER_DEMAND_STATUS = 503;
const DEFAULT_MODEL_SERVER_GIVEUP_COOLDOWN_MS = 60000;
const DURABLE_WRITE_UNAVAILABLE_CODES = new Set(['ENOSPC', 'EDQUOT', 'EROFS']);
const durableWriteWarnings = new Set();

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

function isDurableWriteUnavailable(error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  return DURABLE_WRITE_UNAVAILABLE_CODES.has(code);
}

function logDurableWriteUnavailableOnce(logger, operation, targetPath, error, rel = (p) => p) {
  const code = error && typeof error === 'object' ? error.code : 'UNKNOWN';
  const key = `${operation}:${targetPath}:${code}`;
  if (durableWriteWarnings.has(key)) return;
  durableWriteWarnings.add(key);
  const detail = error instanceof Error ? error.message : String(error ?? code);
  logger(`${operation} skipped for ${rel(targetPath)}: ${code} ${detail}`);
}

function cleanupTmpFile(tmpPath, fsApi = fs) {
  try {
    fsApi.unlinkSync(tmpPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      // Best-effort cleanup only; the original durable-write failure is more useful.
    }
  }
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

function getModelServerIdleConfig(env = process.env) {
  const rawIdleMin = env.SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN;
  const idleMin = rawIdleMin === undefined || rawIdleMin === null || String(rawIdleMin).trim() === ''
    ? 0
    : Number.parseFloat(String(rawIdleMin).trim());
  const enabled = Number.isFinite(idleMin) && idleMin > 0;
  return {
    enabled,
    timeoutMs: enabled ? idleMin * 60000 : 0,
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

function getModelServerGiveUpCooldownMs(env = process.env) {
  return parsePositiveInteger(env.SPECKIT_HF_MODEL_SERVER_GIVEUP_COOLDOWN_MS, DEFAULT_MODEL_SERVER_GIVEUP_COOLDOWN_MS);
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

// A scheduled daemon relaunch must be ABORTED when its backoff fires under a dying owner.
// The MCP host spawns the launcher directly, so a parent pid that no longer matches the value
// captured at startup (or has reparented to the init/subreaper pid 1) means the owning session
// disposed; respawning then would only flap the daemon under a runtime that is going away and
// drop every bridged transport. Crash-recovery and RSS-recycle fire with the owner alive and a
// matching ppid, so this stays a no-op for them.
function shouldAbortRelaunchOnFire({ shuttingDown, currentPpid, initialPpid } = {}) {
  return Boolean(shuttingDown) || currentPpid !== initialPpid || currentPpid === 1;
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

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function assertSunPathLimit(socketPath) {
  if (socketPath.startsWith('tcp://')) return;
  const byteLength = Buffer.byteLength(socketPath);
  // sun_path is a 104-byte field on macOS INCLUDING the NUL terminator, so the longest path that
  // actually binds is 103 bytes. Reject at 104 to avoid an EINVAL that would otherwise pass this guard.
  if (byteLength <= 103) return;
  throw codedError(
    'ESUNPATHTOOLONG',
    `hf-model-server socket path exceeds the conservative 104-byte sun_path limit (${byteLength} bytes): ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory.`,
  );
}

function assertSocketDirOwnership(socketPath, options = {}) {
  if (socketPath.startsWith('tcp://')) return;
  const statApi = options.statApi || fs;
  const getuid = options.getuid;
  const socketDir = path.dirname(socketPath);
  let dirStat = null;
  try {
    dirStat = statApi.lstatSync(socketDir);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (dirStat) {
    if (dirStat.isSymbolicLink()) {
      throw codedError('ESOCKETDIRSYMLINK', `Refusing to use symlinked SPECKIT_IPC_SOCKET_DIR for hf-model-server socket: ${socketDir}`);
    }
    const uid = typeof getuid === 'function' ? getuid() : undefined;
    if (Number.isInteger(uid) && Number.isInteger(dirStat.uid) && dirStat.uid !== uid) {
      throw codedError('ESOCKETDIRFOREIGN', `Refusing to use hf-model-server socket directory owned by uid ${dirStat.uid}; current uid is ${uid}: ${socketDir}`);
    }
  }

  try {
    const socketStat = statApi.lstatSync(socketPath);
    if (socketStat.isSymbolicLink()) {
      throw codedError('ESOCKETSYMLINK', `Refusing to unlink or bind through symlinked hf-model-server socket node: ${socketPath}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath(), options = {}) {
  const rawDbDir = typeof options.dbDir === 'function' ? options.dbDir() : options.dbDir;
  const lockDirPath = socketPath.startsWith('tcp://')
    ? path.resolve(rawDbDir || path.join(defaultOpencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'))
    : path.dirname(socketPath);
  return path.join(lockDirPath, HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME);
}

function modelServerGiveUpPath(socketPath = resolveModelServerSocketPath(), options = {}) {
  const rawDbDir = typeof options.dbDir === 'function' ? options.dbDir() : options.dbDir;
  const giveUpDirPath = socketPath.startsWith('tcp://')
    ? path.resolve(rawDbDir || path.join(defaultOpencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'))
    : path.dirname(socketPath);
  return path.join(giveUpDirPath, HF_MODEL_SERVER_GIVEUP_FILE_NAME);
}

function writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, options = {}) {
  const logger = options.log || defaultLog;
  const rel = options.rel || ((p) => p);
  const fsApi = { ...fs, ...(options.fs || {}) };
  const giveUpPath = path.join(ensureCanonicalDir(path.dirname(modelServerGiveUpPath(socketPath, options))), HF_MODEL_SERVER_GIVEUP_FILE_NAME);
  if (!Number.isFinite(giveUpUntilMs) || giveUpUntilMs <= 0) {
    try {
      fsApi.unlinkSync(giveUpPath);
    } catch (error) {
      if (error.code === 'ENOENT') return true;
      if (isDurableWriteUnavailable(error)) {
        logDurableWriteUnavailableOnce(logger, 'hf-model-server give-up clear', giveUpPath, error, rel);
        return false;
      }
      throw error;
    }
    return true;
  }

  const tmp = `${giveUpPath}.tmp.${process.pid}`;
  try {
    fsApi.writeFileSync(tmp, `${JSON.stringify({
      giveUpUntil: giveUpUntilMs,
      writtenAt: new Date().toISOString(),
      pid: process.pid,
    }, null, 2)}\n`, { mode: 0o600 });
    fsApi.renameSync(tmp, giveUpPath);
    return true;
  } catch (error) {
    cleanupTmpFile(tmp, fsApi);
    if (isDurableWriteUnavailable(error)) {
      logDurableWriteUnavailableOnce(logger, 'hf-model-server give-up write', giveUpPath, error, rel);
      return false;
    }
    throw error;
  }
}

function nowMsFromOptions(options = {}) {
  if (typeof options.nowMs === 'function') return options.nowMs();
  if (typeof options.nowMs === 'number') return options.nowMs;
  return Date.now();
}

function modelServerGiveUpStaleMs(options = {}) {
  const giveUpCooldownMs = parsePositiveInteger(options.giveUpCooldownMs, getModelServerGiveUpCooldownMs(options.env || process.env));
  const staleMs = parsePositiveInteger(options.staleMs, RESPAWN_LOCK_STALE_MS);
  return Math.max(staleMs, giveUpCooldownMs);
}

function isModelServerGiveUpStale(parsed, options = {}) {
  const liveness = options.liveness || processLiveness;
  if (liveness(parsed?.pid) === 'dead') return true;

  const writtenAtMs = parsed?.writtenAt ? Date.parse(parsed.writtenAt) : NaN;
  if (!Number.isFinite(writtenAtMs)) return false;
  return nowMsFromOptions(options) - writtenAtMs > modelServerGiveUpStaleMs(options);
}

function unlinkBestEffort(filePath, fsApi = fs) {
  try {
    fsApi.unlinkSync(filePath);
  } catch {
    // Best-effort stale-state cleanup.
  }
}

function readModelServerGiveUpUntil(socketPath, options = {}) {
  const fsApi = { ...fs, ...(options.fs || {}) };
  const giveUpPath = modelServerGiveUpPath(socketPath, options);
  try {
    const parsed = JSON.parse(fsApi.readFileSync(giveUpPath, 'utf8'));
    if (isModelServerGiveUpStale(parsed, options)) {
      unlinkBestEffort(giveUpPath, fsApi);
      return null;
    }
    return Number.isFinite(parsed?.giveUpUntil) && parsed.giveUpUntil > 0 ? parsed.giveUpUntil : null;
  } catch {
    return null;
  }
}

// ── Maintenance-active marker ────────────────────────────────────────────────
// A background index scan can legitimately keep the daemon's event loop busy for
// stretches, so a competing launcher's deep liveness probe sees an unresponsive
// socket and would reap+respawn the daemon mid-scan (killing the scan). The
// daemon writes this marker beside its DB and refreshes it on a timer; the
// launcher uses it to tell "busy-by-design" from "wedged": a fresh marker naming
// the live daemon child means ADOPT, not reap. A genuinely wedged daemon cannot
// fire its refresh timer, so the marker expires and normal reaping resumes.
const MAINTENANCE_MARKER_FILE_NAME = '.maintenance-active.json';

function maintenanceMarkerPath(dbDir) {
  return path.join(dbDir, MAINTENANCE_MARKER_FILE_NAME);
}

function readMaintenanceMarker(dbDir, options = {}) {
  const fsApi = { ...fs, ...(options.fs || {}) };
  try {
    const parsed = JSON.parse(fsApi.readFileSync(maintenanceMarkerPath(dbDir), 'utf8'));
    if (Number.isInteger(parsed?.childPid) && parsed.childPid > 0 && Number.isFinite(parsed?.activeUntilMs)) {
      return parsed;
    }
  } catch {
    // Missing or corrupt marker => treat as no active maintenance.
  }
  return null;
}

// Pure adopt-vs-reap decision. Returns true only when a fresh marker names this
// exact live child. Fail-safe toward reaping: a missing/expired marker, a
// childPid mismatch, or a non-'alive' child all fall through to the normal reap
// path so a stale marker can never pin a genuinely dead or wedged daemon.
function shouldAdoptDespiteProbe(options = {}) {
  const { marker, childPid, childLiveness } = options;
  if (!marker) return false;
  if (!Number.isInteger(childPid) || childPid <= 0) return false;
  if (marker.childPid !== childPid) return false;
  if (!(Number.isFinite(marker.activeUntilMs) && marker.activeUntilMs > nowMsFromOptions(options))) return false;
  if (childLiveness !== 'alive') return false;
  return true;
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
  const hasPid = Number.isInteger(pid) && pid > 0;
  if (hasPid && liveness(pid) === 'dead') return true;
  // A live demand listener deliberately holds this lock across its whole bind + idle-listener
  // window, which can exceed RESPAWN_LOCK_STALE_MS. Bound staleness to listener liveness: only let the
  // wall-clock age expire the lock when the recorded owner is NOT confirmably alive (absent/invalid pid,
  // or an EPERM-opaque pid we cannot prove is ours). If the owner pid is alive, it still owns the lock —
  // never reclaim it from under a live owner on age alone.
  if (hasPid && liveness(pid) === 'alive') return false;
  const startedAtMs = parsed && parsed.startedAt ? Date.parse(parsed.startedAt) : NaN;
  if (Number.isFinite(startedAtMs) && nowMs - startedAtMs > staleMs) return true;
  return false;
}

function acquireRespawnLockFileAt(lockPath, label = 'respawn', options = {}) {
  const logger = options.log || defaultLog;
  const rel = options.rel || ((p) => p);
  const fsApi = { ...fs, ...(options.fs || {}) };
  const currentLockPath = path.join(ensureCanonicalDir(path.dirname(lockPath)), path.basename(lockPath));
  const tryOpen = () => {
    let fd = null;
    try {
      fd = fsApi.openSync(currentLockPath, 'wx', 0o600);
      fsApi.writeFileSync(fd, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8');
      fsApi.fsyncSync(fd);
      return { acquired: true, fd, path: currentLockPath };
    } catch (error) {
      if (typeof fd === 'number') {
        try {
          fsApi.closeSync(fd);
        } catch {
          // Close failure is secondary to the durable-write failure.
        }
        cleanupTmpFile(currentLockPath, fsApi);
      }
      if (isDurableWriteUnavailable(error)) {
        logDurableWriteUnavailableOnce(logger, `${label} lock acquire`, currentLockPath, error, rel);
        return { acquired: false, path: currentLockPath, reason: 'durable-write-unavailable' };
      }
      throw error;
    }
  };
  try {
    const opened = tryOpen();
    if (!opened.acquired) return opened;
    return opened;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  let raw = '';
  try {
    raw = fsApi.readFileSync(currentLockPath, 'utf8');
  } catch (readErr) {
    if (readErr.code !== 'ENOENT') throw readErr;
  }
  if (raw === '' || isRespawnLockStale(raw, options)) {
    // Atomically CLAIM the stale lock via rename before deleting it, then re-open
    // exclusively. A bare unlink+open is not mutually exclusive: two racers can
    // interleave (A unlink, A open/holds, B unlink removes A's fresh lock, B
    // open/holds) and both believe they hold the exclusive lock. Renaming a path
    // only one racer can win serializes the reclaim — a loser's rename throws
    // ENOENT and falls through to return acquired:false.
    const staleClaim = `${currentLockPath}.stale.${process.pid}.${Date.now()}`;
    try {
      fsApi.renameSync(currentLockPath, staleClaim);
    } catch (renameErr) {
      if (renameErr.code === 'ENOENT') return { acquired: false, path: currentLockPath };
      throw renameErr;
    }
    try {
      fsApi.unlinkSync(staleClaim);
    } catch (unlinkErr) {
      if (unlinkErr.code !== 'ENOENT') throw unlinkErr;
    }
    try {
      const reclaimed = tryOpen();
      if (!reclaimed.acquired) return reclaimed;
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

function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null, socketPath = null) {
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
  // Record the owner's actual IPC socket path so a secondary launcher bridges to the path the
  // owner truly listens on, instead of recomputing one that can diverge under a different
  // SPECKIT_IPC_SOCKET_DIR (e.g. worktree env). Optional + additive: leases without it fall back
  // to recomputation, so existing readers and the other launchers are unaffected.
  if (typeof socketPath === 'string' && socketPath.length > 0) {
    payload.socketPath = socketPath;
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
  const writeGiveUpUntil = options.writeGiveUpUntil || (() => true);
  const giveUpCooldownMs = parsePositiveInteger(options.giveUpCooldownMs, getModelServerGiveUpCooldownMs(env));
  const nowMs = typeof options.nowMs === 'function' ? options.nowMs : () => Date.now();

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
        writeGiveUpUntil(nowMs() + giveUpCooldownMs);
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
  const nowMs = typeof deps.nowMs === 'function' ? deps.nowMs : () => Date.now();
  const giveUpCooldownMs = parsePositiveInteger(deps.giveUpCooldownMs, getModelServerGiveUpCooldownMs(env));
  const idleConfig = deps.idleConfig || getModelServerIdleConfig(env);
  const setIntervalFn = deps.setInterval || setInterval;
  const clearIntervalFn = deps.clearInterval || clearInterval;
  const statApi = deps.statApi || fs;
  const getuid = typeof deps.getuid === 'function' ? deps.getuid : () => process.getuid?.();
  const state = {
    demandServer: null,
    demandTarget: null,
    demandRespawnLock: null,
    supervisor: null,
    lastKnownDescendantPids: [],
    idleTimer: null,
    idleTickInFlight: false,
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

  function writeGiveUpUntil(giveUpUntilMs) {
    const socketPath = resolveSocketPath();
    if (typeof deps.writeGiveUpUntil === 'function') {
      return deps.writeGiveUpUntil(giveUpUntilMs, socketPath);
    }
    return writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, { dbDir, log: logger });
  }

  function readGiveUpUntil(socketPath = resolveSocketPath()) {
    if (typeof deps.readGiveUpUntil === 'function') return deps.readGiveUpUntil(socketPath);
    return readModelServerGiveUpUntil(socketPath, {
      dbDir,
      env,
      giveUpCooldownMs,
      liveness,
      nowMs,
    });
  }

  function activeGiveUpCooldown(socketPath = resolveSocketPath()) {
    const giveUpUntil = readGiveUpUntil(socketPath);
    const current = nowMs();
    if (!Number.isFinite(giveUpUntil) || giveUpUntil <= current) return null;
    return {
      giveUpUntil,
      retryAfterMs: Math.max(1, giveUpUntil - current),
    };
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
        writeGiveUpUntil,
        giveUpCooldownMs,
        crashLoopConfig: deps.crashLoopConfig || (() => getCrashLoopConfig(env)),
        watchdogConfig: deps.watchdogConfig || (() => getModelServerWatchdogConfig(env, logger)),
        processRowsRunner,
        signal,
        liveness: deps.liveness || processLiveness,
        waitForExit: deps.waitForExit || waitForPidExit,
        setTimeout: deps.setTimeout || setTimeout,
        clearTimeout: deps.clearTimeout || clearTimeout,
        nowMs,
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

  function respawnLockBlockedReason(lock) {
    return lock?.reason === 'durable-write-unavailable'
      ? 'model-server-respawn-lock-unwritable'
      : 'model-server-respawn-lock-held';
  }

  function clearRecoveredGiveUpCooldown() {
    writeGiveUpUntil(null);
  }

  function armGiveUpCooldown() {
    writeGiveUpUntil(nowMs() + giveUpCooldownMs);
  }

  function disarmIdleMonitor() {
    if (!state.idleTimer) return;
    clearIntervalFn(state.idleTimer);
    state.idleTimer = null;
  }

  async function tickIdleMonitor() {
    if (state.idleTickInFlight) return;
    state.idleTickInFlight = true;
    try {
      const pid = getPid();
      if (!Number.isInteger(pid) || pid <= 0) return;
      const probeModelServer = deps.bridge && deps.bridge.probeModelServer;
      if (typeof probeModelServer !== 'function') return;
      let probe;
      try {
        probe = await probeModelServer(resolveSocketPath(), { timeoutMs: 1000 });
      } catch {
        return;
      }
      if (!probe || probe.status !== 'alive') return;
      const health = probe.health && typeof probe.health === 'object' ? probe.health : null;
      const inFlight = Number(health?.inFlight);
      if (Number.isFinite(inFlight) && inFlight > 0) return;
      const lastSuccessfulEmbedAt = health?.lastSuccessfulEmbedAt;
      if (lastSuccessfulEmbedAt === null || lastSuccessfulEmbedAt === undefined) return;
      const lastSuccessfulEmbedAtMs = Number(lastSuccessfulEmbedAt);
      if (!Number.isFinite(lastSuccessfulEmbedAtMs) || lastSuccessfulEmbedAtMs <= 0) return;
      if (nowMs() - lastSuccessfulEmbedAtMs < idleConfig.timeoutMs) return;

      const supervisor = getSupervisor();
      supervisor.clearTimers();
      // reapProcessTree() reaps DESCENDANTS only (reapProcessTreeGroups filters pid !== childPid),
      // so the model-server ROOT process survived idle eviction — the lease was cleared but the resident
      // was orphaned. Route the root reap through reapBeforeRespawn(): the single root-liveness authority
      // that signals the root pid (SIGTERM -> reap tree -> grace -> SIGKILL) exactly like the respawn path.
      // It short-circuits cleanly if the root is already dead / EPERM-opaque, so the lease is still cleared.
      await supervisor.reapBeforeRespawn(pid);
      writeModelServerPid(null);
      state.supervisor = null;
      // The re-arm can legitimately reject (a sibling reclaimed the socket via the EADDRINUSE
      // live-resident guard, or a perimeter assertion tripped). Swallow it here: the interval
      // driver calls this via `void tickIdleMonitor()` (no .catch), so an escaping rejection would
      // crash the launcher (Node defaults unhandled rejections to throw). The monitor self-heals
      // on the next tick / next embed demand re-arms the listener lazily.
      await startModelServerDemandListener().catch((error) => {
        logger(`hf-model-server idle re-arm failed (will retry on next demand): ${error && error.message ? error.message : error}`);
      });
    } finally {
      state.idleTickInFlight = false;
    }
  }

  function armIdleMonitor() {
    if (!idleConfig.enabled || state.idleTimer) return;
    const intervalMs = Math.min(idleConfig.timeoutMs, 60000);
    state.idleTimer = setIntervalFn(() => {
      void tickIdleMonitor();
    }, intervalMs);
    state.idleTimer.unref?.();
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
    disarmIdleMonitor();
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
      return { allowed: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
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
      if (!lock.acquired) return { shouldListen: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
      return { shouldListen: true };
    }
    assertSunPathLimit(socketPath);
    // Keep SPECKIT_IPC_SOCKET_DIR fail-closed: never mkdir/unlink through a symlinked or foreign-owned perimeter.
    assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
    fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
    let deadProbeReason = null;
    if (fs.existsSync(socketPath)) {
      const probeModelServer = deps.bridge && deps.bridge.probeModelServer;
      if (typeof probeModelServer === 'function') {
        const probe = await probeModelServer(socketPath, { timeoutMs: 1000 });
        if (probe.status === 'alive') {
          if (probe.reason === 'health-ready') clearRecoveredGiveUpCooldown();
          return { shouldListen: false, reason: 'model-server-alive' };
        }
        deadProbeReason = probe.reason;
      }
    }

    // The respawn lock is intentionally held across the bind + idle-listener window (released only on
    // demand-driven spawn, shutdown, or listen failure) so a second launcher sharing this socket loses
    // cleanly with 'model-server-respawn-lock-held' instead of racing the bind. (Lock LIFETIME differs
    // from the single-launcher path by design; the wx-open + UDS-bind primitives are unchanged.)
    const lock = acquireDemandRespawnLock(socketPath);
    if (!lock.acquired) return { shouldListen: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
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
    if (reapResult.reaped && (deadProbeReason === 'loading-wedged' || deadProbeReason === 'health-error')) {
      armGiveUpCooldown();
    }
    unlinkModelServerSocket(socketPath);
    return { shouldListen: true, reason: reapResult.reason };
  }

  function handleModelServerDemand(request, response) {
    const routePath = new URL(request.url || '/', 'http://127.0.0.1').pathname;
    // A launcher liveness probe must never be treated as embed demand. A sibling launcher's
    // boot-time health check would otherwise wake — and on a host where the local model is
    // unsupported, crash-loop — a model server that no consumer actually needs. Genuine consumers
    // never send this marker, so their lazy wake-on-demand path is unaffected.
    const probeMarker = request.headers && request.headers['x-speckit-probe'];
    if (typeof probeMarker === 'string' && probeMarker.toLowerCase() === 'liveness') {
      writeDemandResponse(response, MODEL_SERVER_DEMAND_STATUS, {
        state: 'no-resident',
        reason: 'liveness-probe',
      });
      return;
    }
    const cooldown = activeGiveUpCooldown(state.demandTarget || resolveSocketPath());
    if (cooldown) {
      logger(`hf-model-server demand received ${request.method || 'GET'} ${routePath}; crash-loop cooldown active for ${cooldown.retryAfterMs}ms`);
      writeDemandResponse(response, MODEL_SERVER_DEMAND_STATUS, {
        state: 'error',
        reason: 'crash-loop-cooldown',
        retryAfterMs: cooldown.retryAfterMs,
      });
      return;
    }
    logger(`hf-model-server demand received ${request.method || 'GET'} ${routePath}; spawning launcher-owned sibling`);
    releaseModelServerDemandListenerForSpawn({ keepRespawnLock: true });
    const launched = getSupervisor().launch();
    releaseDemandRespawnLock();
    if (!launched) {
      // launch() returned false (spawn produced no pid, or a child is already running). The
      // demand server was already torn down above and the respawn lock released, so without re-arming
      // the launcher is stranded — no listener, no resident, and no scheduled relaunch (the child
      // 'exit' handler is never wired when there is no valid child). Re-arm the lazy demand listener so
      // a later demand can retry. Fire-and-forget with a .catch: the interval/HTTP context has no
      // awaiter, and startModelServerDemandListener() self-guards via already-owned / lock-held when a
      // sibling won the race.
      logger('hf-model-server demand-driven launch produced no resident; re-arming lazy demand listener');
      void startModelServerDemandListener().catch((error) => {
        logger(`hf-model-server demand listener re-arm after spawn failure failed (will retry on next demand): ${error && error.message ? error.message : error}`);
      });
    }
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
            // The re-assert + reclaim runs inside this 'error' handler, which fires in a
            // microtask — a synchronous throw here would ESCAPE the Promise executor instead of
            // rejecting it. Wrap so a perimeter violation (symlinked node, etc.) or unlink failure
            // fails the listener closed (rejects → outer catch releases the lock and rethrows).
            try {
              assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
              unlinkModelServerSocket(socketPath);
              server.listen(socketPath);
            } catch (reclaimError) {
              server.off('listening', onListening);
              reject(reclaimError);
            }
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
    armIdleMonitor();
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
      disarmIdleMonitor();
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
  DEFAULT_MODEL_SERVER_GIVEUP_COOLDOWN_MS,
  HF_MODEL_SERVER_SOCKET_FILE_NAME,
  HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME,
  HF_MODEL_SERVER_PID_FILE_NAME,
  HF_MODEL_SERVER_GIVEUP_FILE_NAME,
  MAINTENANCE_MARKER_FILE_NAME,
  MODEL_SERVER_DEMAND_STATUS,
  maintenanceMarkerPath,
  readMaintenanceMarker,
  shouldAdoptDespiteProbe,
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
  getModelServerGiveUpCooldownMs,
  getModelServerIdleConfig,
  getModelServerWatchdogConfig,
  getWatchdogConfig,
  assertSocketDirOwnership,
  assertSunPathLimit,
  isDurableWriteUnavailable,
  isChildRunning,
  isPermissionError,
  isRespawnLockStale,
  modelServerGiveUpPath,
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
  shouldAbortRelaunchOnFire,
  shouldSkipLaunch,
  signalProcess,
  startRssWatchdog,
  superviseChildExit,
  unlinkModelServerSocket,
  waitForPidExit,
  readModelServerGiveUpUntil,
  writeDemandResponse,
  writeModelServerGiveUpUntil,
};
