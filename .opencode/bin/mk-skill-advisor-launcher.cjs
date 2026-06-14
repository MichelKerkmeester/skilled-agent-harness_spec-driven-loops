#!/usr/bin/env node
// [mk-skill-advisor-launcher] MCP child-process launcher for the mk-skill-advisor
// server (system-skill-advisor). Loads project-local env overrides, ensures dist
// artifacts are built and current, serializes concurrent starts via a filesystem
// bootstrap lock with mtime-based staleness detection, then spawns the advisor MCP
// server child. All stderr lines are tagged with the bracketed module prefix for ops
// grepping. See .opencode/skills/system-skill-advisor/ for the standalone skill.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const mss = loadModelServerSupervisionModule();

const root = path.resolve(__dirname, '..', '..');
const opencodeDir = path.join(root, '.opencode');

function loadModelServerSupervisionModule() {
  try {
    return require('./lib/model-server-supervision.cjs');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return null;
  }
}

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
for (const fname of ['.env.local', '.env']) {
  const p = path.join(root, fname);
  if (fs.existsSync(p)) {
    const n = loadEnvFile(p);
    if (n > 0) process.stderr.write(`[mk-skill-advisor-launcher] loaded ${n} env(s) from ${fname}\n`);
  }
}

let skillsDir = path.join(opencodeDir, 'skills');
let kitDir = path.join(skillsDir, 'system-skill-advisor');
let mcpDir = path.join(kitDir, 'mcp_server');
let dbDir = path.join(mcpDir, 'database');
let lockDir = path.join(dbDir, '.mk-skill-advisor-launcher.lockdir');
const PID_FILE_NAME = '.mk-skill-advisor-launcher.json';
const OWNER_LEASE_FILE_NAME = '.skill-advisor-owner.json';
let stateFile = path.join(dbDir, PID_FILE_NAME);
let systemSpecKitDbDir = path.join(skillsDir, 'system-spec-kit', 'mcp_server', 'database');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const BOOTSTRAP_LOCK_TIMEOUT_MS = 120000;
const BOOTSTRAP_LOCK_STALE_MS = 300000;
const RESPAWN_REAP_GRACE_MS = 7000;
const SOURCE_DIRS = ['handlers', 'lib', 'schemas', 'tools'];
const CHILD_ENV_ALLOWLIST = new Set([
  'PATH',
  'HOME',
  'USER',
  'LOGNAME',
  'SHELL',
  'TMPDIR',
  'TEMP',
  'TMP',
  'LANG',
  'LC_ALL',
  'CI',
  'VITEST',
  'MK_SKILL_ADVISOR_DB_DIR',
  'MK_SKILL_ADVISOR_TRUST_DEFAULT',
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'SPECKIT_RUNTIME',
  'SPECKIT_ADVISOR_FRESHNESS',
  'SPECKIT_ADVISOR_DOC_TRIGGERS',
  'SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW',
  'SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW',
  'MK_SKILL_ADVISOR_HOOK_DISABLED',
  'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
  'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  'SPECKIT_CODEX_HOOK_TIMEOUT_MS',
  'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC',
  'SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST',
  'SPECKIT_ADVISOR_SHADOW_DELTA_PATH',
  'SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED',
  // Documented lane-weight tuning overrides; without these allowlist entries
  // the scorer's env reader never sees them under normal daemon supervision
  // and the advertised tuning path is silently dead. Both the live and the
  // shadow lane-weight overrides are read by lane-registry.
  'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON',
  'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON',
  'SPECKIT_METRICS_ENABLED',
  'SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS',
  'SPECKIT_IPC_SOCKET_DIR',
  'SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED',
  'SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN',
  'HF_EMBEDDINGS_MODEL',
  'HF_EMBED_SERVER_URL',
  'SPECKIT_LAUNCHER_BRIDGE_DISABLED',
  'SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN',
  'SPECKIT_MAX_SECONDARY_CLIENTS',
]);
let childProcess = null;
let leaseStartedAt = null;
let ownerLeasePid = null;
let ownerLeaseHeartbeatTimer = null;
let ownerLeaseRequired = true;
let launcherShutdownInProgress = false;
let pendingBootstrapReapPid = null;

function log(message) {
  process.stderr.write(`[mk-skill-advisor-launcher] ${message}\n`);
}

function loadBridgeModule() {
  try {
    return require('./lib/launcher-ipc-bridge.cjs');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return {
      getIpcSocketPath(_serviceName, options = {}) {
        if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
          return process.env.SPECKIT_IPC_SOCKET_DIR;
        }
        const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
          ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
          : path.resolve(options.dbDir ?? resolvedAdvisorDbDir());
        return path.join(socketDir, 'daemon-ipc.sock');
      },
      async maybeBridgeLeaseHolder({ leaseResult, legacyReport }) {
        if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' && legacyReport) {
          legacyReport(leaseResult);
          return { action: 'report', reason: 'bridge-disabled' };
        }
        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
        return { action: 'report', reason: 'bridge-module-missing' };
      },
    };
  }
}

let sessionProxyModule = null;
let skillAdvisorFrameClassifier = null;

function loadSessionProxyModule() {
  if (sessionProxyModule) return sessionProxyModule;
  try {
    sessionProxyModule = require('./lib/launcher-session-proxy.cjs');
    return sessionProxyModule;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return null;
  }
}

const SKILL_ADVISOR_REPLAYABLE_TOOL_NAMES = new Set([
  'advisor_recommend',
  'advisor_status',
  'skill_graph_query',
  'skill_graph_status',
  'skill_graph_validate',
]);
const SKILL_ADVISOR_UNSAFE_TOOL_NAMES = new Set([
  // advisor_validate can persist outcome records when outcomeEvents is present, so it
  // must not replay across reconnect. advisor_recommend stays replayable; one duplicate
  // shadow delta is acceptable to keep routing available during backend recycle.
  'advisor_validate',
  'advisor_rebuild',
  'skill_graph_scan',
  'skill_graph_propagate_enhances',
]);

function classifySkillAdvisorFrame(frame) {
  const proxyModule = loadSessionProxyModule();
  if (!proxyModule || typeof proxyModule.createClassifyFrame !== 'function') return false;
  if (!skillAdvisorFrameClassifier) {
    skillAdvisorFrameClassifier = proxyModule.createClassifyFrame({
      replayableToolNames: SKILL_ADVISOR_REPLAYABLE_TOOL_NAMES,
      unsafeToolNames: SKILL_ADVISOR_UNSAFE_TOOL_NAMES,
    });
  }
  return skillAdvisorFrameClassifier(frame);
}

function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
  const proxyModule = loadSessionProxyModule();
  if (!proxyModule || typeof proxyModule.createSessionProxy !== 'function') {
    throw new Error('launcher-session-proxy.cjs is unavailable');
  }
  const createProxy = options.createProxy ?? proxyModule.createSessionProxy;
  const sessionProxy = createProxy({
    socketPath,
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    log,
    classify: classifySkillAdvisorFrame,
  });
  return sessionProxy.start();
}

// Gate verbose error/path logging behind MK_SKILL_ADVISOR_DEBUG.
// Operationally-important events keep using log(); error stacks + DB-path traces use debug().
function debug(message) {
  if (process.env.MK_SKILL_ADVISOR_DEBUG === '1') {
    process.stderr.write(`[mk-skill-advisor-launcher] [debug] ${message}\n`);
  }
}

function createChildEnv(sourceEnv = process.env) {
  return Object.fromEntries(
    Object.entries(sourceEnv).filter(([key, value]) => CHILD_ENV_ALLOWLIST.has(key) && typeof value === 'string'),
  );
}

function refreshPaths() {
  skillsDir = path.join(opencodeDir, 'skills');
  kitDir = path.join(skillsDir, 'system-skill-advisor');
  mcpDir = path.join(kitDir, 'mcp_server');
  dbDir = path.join(mcpDir, 'database');
  lockDir = path.join(dbDir, '.mk-skill-advisor-launcher.lockdir');
  stateFile = path.join(dbDir, PID_FILE_NAME);
  systemSpecKitDbDir = path.join(skillsDir, 'system-spec-kit', 'mcp_server', 'database');
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

function advisorDbPath() {
  return path.join(resolvedAdvisorDbDir(), 'skill-graph.sqlite');
}

function resolvedAdvisorDbDir() {
  const overrideDbDir = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  return overrideDbDir
    ? canonicalizePath(overrideDbDir)
    : canonicalizePath(dbDir);
}

function writeState(payload) {
  ensureCanonicalDir(dbDir);
  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
}

function leasePath() {
  return path.join(resolvedAdvisorDbDir(), PID_FILE_NAME);
}

function ownerLeasePath() {
  return path.join(resolvedAdvisorDbDir(), OWNER_LEASE_FILE_NAME);
}

function readLeaseFile(filePath = leasePath()) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
    // Missing or corrupt launcher lease files are treated as already clear.
  }
  return null;
}

function leaseHeldFromFile(filePath = leasePath(), legacyPath = null) {
  const lease = readLeaseFile(filePath);
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
    throw error;
  }
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
    canonicalDbDir: resolvedAdvisorDbDir(),
  };
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

async function reapOwnerBeforeRespawn(ownerPid) {
  const liveness = processLiveness(ownerPid);
  if (liveness === 'unknown-eperm') {
    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
  }
  if (liveness === 'dead') {
    return { allowed: true, reason: 'owner-already-dead' };
  }

  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
  try {
    process.kill(ownerPid, 'SIGTERM');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
  if (!exitedAfterTerm) {
    log(`skill-advisor daemon pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
    try {
      process.kill(ownerPid, 'SIGKILL');
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
    await waitForPidExit(ownerPid, 1000);
    if (processLiveness(ownerPid) !== 'dead') {
      return { allowed: false, reason: 'owner-reap-timeout' };
    }
  }
  return { allowed: true, reason: 'owner-reaped' };
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
    if (isChildRunning(childProcess)) childProcess.kill('SIGTERM');
    clearAllLeaseFiles();
    process.exit(128);
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

function reportLeaseHeld(leaseResult) {
  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
}

function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
}

function resolveRespawnTargetPid(leaseResult) {
  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
  if (Number.isInteger(lease?.childPid) && lease.childPid > 0) return lease.childPid;
  return Number.isInteger(leaseResult.ownerPid) && leaseResult.ownerPid > 0 ? leaseResult.ownerPid : null;
}

function socketPathUsable(socketPath) {
  return typeof socketPath === 'string'
    && socketPath.length > 0
    && (socketPath.startsWith('tcp://') || fs.existsSync(socketPath));
}

function scheduleBootstrapReap(pid) {
  if (Number.isInteger(pid) && pid > 0) {
    pendingBootstrapReapPid = pid;
  }
}

async function respawnAfterDeadSocket(leaseResult, decision) {
  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
  }

  const targetPid = resolveRespawnTargetPid(leaseResult);
  if (!Number.isInteger(targetPid) || targetPid <= 0) {
    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
    return { action: 'report', reason: 'missing-daemon-pid', socketPath: decision.socketPath };
  }

  let bootstrapLockHeld = false;
  try {
    bootstrapLockHeld = await acquireBootstrapLock();
    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
    const currentTargetPid = Number.isInteger(currentLease?.childPid) && currentLease.childPid > 0
      ? currentLease.childPid
      : leaseResult.ownerPid;
    if (Number.isInteger(currentTargetPid) && currentTargetPid > 0 && currentTargetPid !== targetPid) {
      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
    }

    const previousOwner = readOwnerLeaseFile();
    const reapResult = await reapOwnerBeforeRespawn(targetPid);
    if (!reapResult.allowed) {
      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
    }

    if (previousOwner?.ownerPid && previousOwner.ownerPid !== process.pid) {
      await waitForPidExit(previousOwner.ownerPid, RESPAWN_REAP_GRACE_MS + 1000);
      if (processLiveness(previousOwner.ownerPid) === 'dead') {
        clearOwnerLeaseFileIfOwner(previousOwner.ownerPid);
      }
    }
    clearOwnerLeaseFileIfOwner(targetPid);
    if (ownsOwnerLeaseFile(process.pid)) {
      clearOwnerLeaseFile();
    }

    const ownerLease = buildOwnerLease(process.pid);
    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
      const holder = readOwnerLeaseFile();
      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
    }
    ownerLeasePid = process.pid;
    startOwnerLeaseHeartbeat(process.pid);

    buildIfNeeded([]);
    leaseStartedAt = new Date().toISOString();
    writeLeaseFile();
    const launched = launchServer();
    return launched
      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
      : { action: 'report', reason: 'launch-skipped', socketPath: decision.socketPath };
  } finally {
    if (bootstrapLockHeld) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
  }
}

function leaseResultForOwnerLease(ownerLease) {
  const launcherLease = leaseHeldFromFile();
  if (launcherLease.held && launcherLease.ownerPid === ownerLease.ownerPid) {
    return launcherLease;
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

async function bridgeOrReportLeaseHeld(leaseResult) {
  const { maybeBridgeLeaseHolder } = loadBridgeModule();
  const decision = await maybeBridgeLeaseHolder({
    serviceName: 'mk-skill-advisor',
    leaseResult,
    loggerPrefix: 'mk-skill-advisor-launcher',
    dbDir: resolvedAdvisorDbDir(),
    bridge: bridgeStdioThroughSessionProxy,
    legacyReport: reportLeaseHeld,
  });
  if (decision && decision.action === 'respawn') {
    return await respawnAfterDeadSocket(leaseResult, decision);
  }
  return decision;
}

async function checkStrictSingleWriter() {
  const ownerLeaseResult = acquireOwnerLeaseFile();
  if (!ownerLeaseResult.acquired) {
    log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
    await bridgeOrReportLeaseHeld(leaseResultForOwnerLease(ownerLeaseResult.holder));
    return true;
  }
  startOwnerLeaseHeartbeat(process.pid);

  const launcherLease = leaseHeldFromFile();
  if (launcherLease.held && !launcherLease.staleReclaimable) {
    clearOwnerLeaseFile();
    await bridgeOrReportLeaseHeld(launcherLease);
    return true;
  }
  if (launcherLease.staleReclaimable) {
    log('staleReclaimed: true');
    const staleLease = readLeaseFile();
    const staleChildPid = Number.isInteger(staleLease?.childPid) && staleLease.childPid > 0
      ? staleLease.childPid
      : null;
    if (staleChildPid && processLiveness(staleChildPid) !== 'dead') {
      const staleChildLeaseResult = {
        held: true,
        ownerPid: staleChildPid,
        staleReclaimable: false,
        startedAt: staleLease.startedAt ?? new Date(0).toISOString(),
        legacyPath: null,
        socketPath: typeof staleLease.socketPath === 'string' ? staleLease.socketPath : null,
      };
      if (socketPathUsable(staleChildLeaseResult.socketPath)) {
        const decision = await bridgeOrReportLeaseHeld(staleChildLeaseResult);
        if (decision?.action === 'bridge' || decision?.action === 'respawn') {
          return true;
        }
        if (decision?.reason !== 'no-bridge-socket') {
          clearOwnerLeaseFile();
          return true;
        }
      }
      scheduleBootstrapReap(staleChildPid);
      log(`stale launcher lease recorded live childPid=${staleChildPid}; deferring reap until bootstrap lock is held`);
    } else if (staleChildPid) {
      scheduleBootstrapReap(staleChildPid);
    }
  }

  try {
    const daemonLeasePath = path.join(mcpDir, 'dist', 'mcp_server', 'lib', 'daemon', 'lease.js');
    const leaseModule = require(daemonLeasePath);
    const leaseResult = leaseModule.isLeaseHeld(root);
    const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
    if (leaseResult.held && !leaseResult.staleReclaimable) {
      clearOwnerLeaseFile();
      await bridgeOrReportLeaseHeld(leaseResult);
      return true;
    }
    if (leaseResult.staleReclaimable) {
      log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
    }
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      log(`daemon lease check failed: ${error.message}`);
    }
  }

  return false;
}

function resolveSessionProxySocketPath() {
  const { getIpcSocketPath } = loadBridgeModule();
  return getIpcSocketPath('mk-skill-advisor', { dbDir: resolvedAdvisorDbDir() });
}

function writeLeaseFile(childPid = childProcess?.pid ?? null) {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), path.basename(leasePath()));
  const tmp = `${currentLeasePath}.tmp.${process.pid}`;
  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
  const payload = {
    pid: process.pid,
    ownerPid: process.pid,
    startedAt: leaseStartedAt,
    socketPath: resolveSessionProxySocketPath(),
  };
  if (Number.isInteger(childPid) && childPid > 0) payload.childPid = childPid;
  fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, currentLeasePath);
}

function clearLeaseFile() {
  try {
    const lease = readLeaseFile();
    if (lease && (lease.pid === process.pid || lease.pid === childProcess?.pid)) {
      fs.unlinkSync(leasePath());
    }
  } catch {
    // Idempotent cleanup.
  }
}

function clearAllLeaseFiles() {
  clearLeaseFile();
  clearOwnerLeaseFile();
}

function isModelServerEnabled() {
  return process.env.SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED === '1';
}

function requireModelServerSupervision() {
  if (!mss) {
    throw new Error('model-server-supervision.cjs is unavailable');
  }
  return mss;
}

function resolveModelServerSocketPath(env = process.env, options = {}) {
  return requireModelServerSupervision().resolveModelServerSocketPath(env, {
    ...options,
    dbDir: options.dbDir || (() => systemSpecKitDbDir),
  });
}

function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
  const pidDir = socketPath.startsWith('tcp://') ? systemSpecKitDbDir : path.dirname(socketPath);
  return path.join(pidDir, requireModelServerSupervision().HF_MODEL_SERVER_PID_FILE_NAME);
}

function writeSharedModelServerPid(pid) {
  const socketPath = resolveModelServerSocketPath();
  const pidPath = sharedModelServerPidPath(socketPath);
  if (!Number.isInteger(pid) || pid <= 0) {
    try {
      fs.unlinkSync(pidPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return;
  }

  const currentPidPath = path.join(ensureCanonicalDir(path.dirname(pidPath)), path.basename(pidPath));
  const tmp = `${currentPidPath}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify({
    pid,
    startedAt: new Date().toISOString(),
    ownerLauncher: 'mk-skill-advisor',
    socketPath,
  }, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, currentPidPath);
}

function readSharedModelServerPid() {
  try {
    const parsed = JSON.parse(fs.readFileSync(sharedModelServerPidPath(), 'utf8'));
    if (Number.isInteger(parsed.pid) && parsed.pid > 0) return parsed.pid;
  } catch {
    // Advisor never falls back to its own launcher lease for model-server ownership.
  }
  return null;
}

const hfControl = mss ? mss.createModelServerControl({
  log,
  env: process.env,
  rootDir: root,
  opencodeDir,
  dbDir: () => systemSpecKitDbDir,
  getLauncherShutdownInProgress: () => launcherShutdownInProgress,
  onRssBreach: (cfg = {}) => {
    void (async () => {
      hfControl.clearTimers();
      await hfControl.stopDemandListener();
      await shutdownModelServerRoot('RSS ceiling sustained', cfg.graceMs);
    })().catch((error) => {
      log(`model-server RSS cleanup failed: ${error.message}`);
      debug(error.stack || error.message);
      writeSharedModelServerPid(null);
    });
  },
  bridge: loadBridgeModule(),
  writeModelServerPid: writeSharedModelServerPid,
  readModelServerPid: readSharedModelServerPid,
}) : null;

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

function signalModelServerRoot(pid, signal) {
  const child = hfControl?.getChild?.();
  if (child?.pid === pid && isChildRunning(child)) {
    child.kill(signal);
    return;
  }
  try {
    process.kill(pid, signal);
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

async function shutdownModelServerRoot(reason, graceMs = RESPAWN_REAP_GRACE_MS) {
  if (!hfControl) return;
  const child = hfControl.getChild?.();
  const pid = child?.pid ?? hfControl.getPid() ?? readSharedModelServerPid();
  if (!Number.isInteger(pid) || pid <= 0) {
    writeSharedModelServerPid(null);
    return;
  }

  log(`${reason}; sending SIGTERM to hf-model-server pid ${pid}`);
  signalModelServerRoot(pid, 'SIGTERM');
  hfControl.reapProcessTree(pid);
  const exitedAfterTerm = child?.pid === pid
    ? await waitForChildExit(child, graceMs)
    : await waitForPidExit(pid, graceMs);
  if (!exitedAfterTerm && processLiveness(pid) !== 'dead') {
    log(`hf-model-server pid ${pid} exceeded ${graceMs}ms grace; sending SIGKILL`);
    signalModelServerRoot(pid, 'SIGKILL');
    if (child?.pid === pid) {
      await waitForChildExit(child, 1000);
    } else {
      await waitForPidExit(pid, 1000);
    }
  }
  writeSharedModelServerPid(null);
}

async function shutdownModelServerForLauncherExit() {
  if (!isModelServerEnabled()) return;
  if (!hfControl) throw new Error('SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1 but model-server supervision lib is unavailable');
  launcherShutdownInProgress = true;
  hfControl.clearTimers();
  await hfControl.stopDemandListener();
  await shutdownModelServerRoot('launcher exiting');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    env: createChildEnv(),
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

function serverEntrypoint() {
  return path.join(mcpDir, 'dist', 'mcp_server', 'advisor-server.js');
}

function requiredArtifacts() {
  return [
    serverEntrypoint(),
  ];
}

function latestSourceMtimeMs() {
  let latest = 0;
  const candidates = [
    path.join(mcpDir, 'advisor-server.ts'),
    path.join(mcpDir, 'package.json'),
    path.join(mcpDir, 'tsconfig.json'),
    path.join(mcpDir, 'tsconfig.build.json'),
    ...SOURCE_DIRS.map((dir) => path.join(mcpDir, dir)),
  ];

  const visit = (candidate) => {
    if (!exists(candidate)) return;
    const stat = fs.statSync(candidate);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(candidate)) {
        visit(path.join(candidate, entry));
      }
      return;
    }
    if (candidate.endsWith('.ts') || candidate.endsWith('.json')) {
      latest = Math.max(latest, stat.mtimeMs);
    }
  };

  for (const candidate of candidates) {
    visit(candidate);
  }
  return latest;
}

function artifactsReady() {
  const artifacts = requiredArtifacts();
  if (!artifacts.every(exists)) {
    return false;
  }

  const sourceMtime = latestSourceMtimeMs();
  if (sourceMtime === 0) {
    return true;
  }
  return artifacts.every((artifact) => fs.statSync(artifact).mtimeMs >= sourceMtime);
}

function buildIfNeeded(actions) {
  if (artifactsReady()) {
    return;
  }

  if (!exists(kitDir)) {
    throw new Error(`system-skill-advisor not found at ${rel(kitDir)}`);
  }

  actions.push('installed dependencies and built @spec-kit/system-skill-advisor MCP server');
  const installCommand = exists(path.join(mcpDir, 'package-lock.json')) ? 'ci' : 'install';
  run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: mcpDir });
  run('npm', ['run', 'build'], { cwd: mcpDir });

  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
  if (missing.length > 0) {
    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
  }
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

function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
  if (!exists(lockDir)) {
    return false;
  }
  let ageMs;
  try {
    ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  // A lock dir is reclaimable as soon as its recorded holder is provably dead —
  // an mtime TTL alone would otherwise wedge every new session for up to staleMs
  // after a launcher is SIGKILLed or crashes while holding the lock. The mtime
  // age stays as the fallback for lock dirs with no readable pid stamp (legacy
  // dirs) and for a holder whose liveness cannot be determined.
  const ownerPid = readBootstrapLockOwnerPid();
  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
  if (!ownerDead && ageMs <= staleMs) {
    return false;
  }
  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
  try {
    fs.renameSync(lockDir, staleClaim);
    fs.rmSync(staleClaim, { recursive: true, force: true });
    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `${Math.round(ageMs / 1000)}s old`;
    log(`reclaimed stale bootstrap lock at ${rel(lockDir)} (${reason})`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTEMPTY') return false;
    throw error;
  }
}

async function acquireBootstrapLock(options = {}) {
  fs.mkdirSync(dbDir, { recursive: true });
  const deadline = Date.now() + (options.timeoutMs ?? BOOTSTRAP_LOCK_TIMEOUT_MS);
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
      if (Date.now() > deadline) {
        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
      }
      await sleep(retrySleepMs);
    }
  }
}

function launchServer() {
  if (ownerLeaseRequired && !ownsOwnerLeaseFile(process.pid)) {
    log('launchServer skipped: skill-advisor owner lease is absent or owned by another launcher');
    return false;
  }
  const server = serverEntrypoint();
  childProcess = spawn(process.execPath, [server], {
    cwd: root,
    env: createChildEnv(),
    stdio: 'inherit',
  });

  childProcess.on('exit', (code, signal) => {
    void (async () => {
      await shutdownModelServerForLauncherExit();
      if (signal) {
        // Clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
        clearAllLeaseFiles();
        process.kill(process.pid, signal);
        return;
      }
      clearAllLeaseFiles();
      process.exit(code ?? 0);
    })().catch((error) => {
      log(`shutdown cleanup failed: ${error.message}`);
      debug(error.stack || error.message);
      clearAllLeaseFiles();
      process.exit(code ?? 1);
    });
  });

  childProcess.on('error', (error) => {
    log(`child process error: ${error.message}`);
    debug(error.stack || error.message);
    process.exit(1);
  });

  writeLeaseFile(childProcess.pid);
  return true;
}

function installSignalHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
    process.on(signal, () => {
      void (async () => {
        if (launcherShutdownInProgress) return;
        launcherShutdownInProgress = true;
        await shutdownModelServerForLauncherExit();
        if (childProcess && !childProcess.killed) {
          childProcess.kill(signal);
          const exited = await waitForChildExit(childProcess, 5000);
          if (!exited && isChildRunning(childProcess)) {
            childProcess.kill('SIGKILL');
          }
        }
        clearAllLeaseFiles();
        process.exit(128);
      })().catch((error) => {
        log(`signal shutdown failed: ${error.message}`);
        debug(error.stack || error.message);
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
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    installSignalHandlers();
    // Lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearAllLeaseFiles);
    refreshPaths();
    debug(`DB: ${advisorDbPath()}`);

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER);
    ownerLeaseRequired = strictSingleWriter;
    if (strictSingleWriter) {
      if (await checkStrictSingleWriter()) return;
    } else {
      log('MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    }

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
      if (Number.isInteger(pendingBootstrapReapPid) && pendingBootstrapReapPid > 0) {
        // The bootstrap lock is held through replacement launch, so stale-child cleanup
        // and spawn share one serialization point without a separate respawn lock.
        const reapResult = await reapOwnerBeforeRespawn(pendingBootstrapReapPid);
        if (!reapResult.allowed) {
          log(`stale launcher lease reap skipped; ${reapResult.reason} for daemonPid=${pendingBootstrapReapPid}`);
          clearOwnerLeaseFile();
          return;
        }
        pendingBootstrapReapPid = null;
      }
      buildIfNeeded(actions);
      writeState({
        command: 'mk-skill-advisor-launcher',
        start: started,
        end: now(),
        status: 'ready',
        actions,
        server: rel(serverEntrypoint()),
        database: rel(advisorDbPath()),
      });

      // PID guard write + reprobe stay inside the bootstrap-lock critical section.
      // Closes the visual race window: two
      // launchers cannot simultaneously pass the strict-single-writer check and race to write
      // their PID guards because both writers serialize on the bootstrap lock.
      if (strictSingleWriter && !ownsOwnerLeaseFile(process.pid)) {
        log('bootstrap reprobe lost owner lease before PID guard write');
        return;
      }
      writeLeaseFile();
      const reprobe = readLeaseFile();
      if (!reprobe || reprobe.pid !== process.pid) {
        const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
        clearOwnerLeaseFile();
        process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
        return;
      }
    }

    const launched = launchServer();
    if (!launched) return;
    if (isModelServerEnabled()) {
      if (!hfControl) throw new Error('SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1 but model-server supervision lib is unavailable');
      void hfControl.startDemandListener().catch((error) => {
        log(error.stack || error.message);
      });
    }
  } catch (error) {
    try {
      writeState({
        command: 'mk-skill-advisor-launcher',
        start: started,
        end: now(),
        status: 'failed',
        actions,
        error: error.message,
      });
    } catch {
      // If state logging itself fails, stderr still carries the actionable error.
    }
    log(`launcher failed: ${error.message}`);
    debug(error.stack || error.message);
    process.exit(1);
  } finally {
    if (lockHeld) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
  }
}

function configureLauncherPathsForTesting(nextPaths) {
  if (nextPaths.skillsDir) skillsDir = nextPaths.skillsDir;
  if (nextPaths.kitDir) kitDir = nextPaths.kitDir;
  if (nextPaths.mcpDir) mcpDir = nextPaths.mcpDir;
  if (nextPaths.dbDir) dbDir = nextPaths.dbDir;
  if (nextPaths.lockDir) lockDir = nextPaths.lockDir;
  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;
  systemSpecKitDbDir = nextPaths.systemSpecKitDbDir || path.join(skillsDir, 'system-spec-kit', 'mcp_server', 'database');
}

if (require.main === module) {
  void main();
}

module.exports = {
  acquireBootstrapLock,
  artifactsReady,
  bridgeStdioThroughSessionProxy,
  classifyOwnerLease,
  classifySkillAdvisorFrame,
  configureLauncherPathsForTesting,
  createChildEnv,
  latestSourceMtimeMs,
  ownerLeasePath,
  readOwnerLeaseFile,
  removeStaleBootstrapLock,
  SKILL_ADVISOR_REPLAYABLE_TOOL_NAMES,
  SKILL_ADVISOR_UNSAFE_TOOL_NAMES,
};
