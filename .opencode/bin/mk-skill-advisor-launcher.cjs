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
let stateFile = path.join(dbDir, '.mk-skill-advisor-launcher.json');
let systemSpecKitDbDir = path.join(skillsDir, 'system-spec-kit', 'mcp_server', 'database');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const BOOTSTRAP_LOCK_TIMEOUT_MS = 120000;
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
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'SPECKIT_RUNTIME',
  'SPECKIT_ADVISOR_FRESHNESS',
  'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
  'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  'SPECKIT_CODEX_HOOK_TIMEOUT_MS',
  'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC',
  'SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST',
  'SPECKIT_ADVISOR_SHADOW_DELTA_PATH',
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
let launcherShutdownInProgress = false;

function log(message) {
  process.stderr.write(`[mk-skill-advisor-launcher] ${message}\n`);
}

function loadBridgeModule() {
  try {
    return require('./lib/launcher-ipc-bridge.cjs');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    return {
      maybeBridgeLeaseHolder({ leaseResult, legacyReport }) {
        if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' && legacyReport) {
          legacyReport(leaseResult);
          return true;
        }
        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
        return true;
      },
    };
  }
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
  stateFile = path.join(dbDir, '.mk-skill-advisor-launcher.json');
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
  return path.join(resolvedAdvisorDbDir(), '.mk-skill-advisor-launcher.json');
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
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath };
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
    throw error;
  }
}

function reportLeaseHeld(leaseResult) {
  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
}

function bridgeOrReportLeaseHeld(leaseResult) {
  const { maybeBridgeLeaseHolder } = loadBridgeModule();
  return maybeBridgeLeaseHolder({
    serviceName: 'mk-skill-advisor',
    leaseResult,
    loggerPrefix: 'mk-skill-advisor-launcher',
    dbDir: resolvedAdvisorDbDir(),
    legacyReport: reportLeaseHeld,
  });
}

function checkStrictSingleWriter() {
  const launcherLease = leaseHeldFromFile();
  if (launcherLease.held && !launcherLease.staleReclaimable) {
    bridgeOrReportLeaseHeld(launcherLease);
    return true;
  }
  if (launcherLease.staleReclaimable) {
    log('staleReclaimed: true');
  }

  try {
    const daemonLeasePath = path.join(mcpDir, 'dist', 'mcp_server', 'lib', 'daemon', 'lease.js');
    const leaseModule = require(daemonLeasePath);
    const leaseResult = leaseModule.isLeaseHeld(root);
    const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
    if (leaseResult.held && !leaseResult.staleReclaimable) {
      bridgeOrReportLeaseHeld(leaseResult);
      return true;
    }
    if (leaseResult.staleReclaimable) {
      log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
    }
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      debug(`lease check failed: ${error.message}`);
    }
  }

  return false;
}

function writeLeaseFile() {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), path.basename(leasePath()));
  const tmp = `${currentLeasePath}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2), { mode: 0o600 });
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
  onRssBreach: () => {
    hfControl.clearTimers();
    const pid = hfControl.getPid();
    if (pid) hfControl.reapProcessTree(pid);
    void hfControl.stopDemandListener();
    writeSharedModelServerPid(null);
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

async function shutdownModelServerForLauncherExit() {
  if (!isModelServerEnabled()) return;
  if (!hfControl) throw new Error('SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1 but model-server supervision lib is unavailable');
  launcherShutdownInProgress = true;
  hfControl.clearTimers();
  await hfControl.stopDemandListener();
  const pid = hfControl.getPid();
  if (pid) hfControl.reapProcessTree(pid);
  writeSharedModelServerPid(null);
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

function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_TIMEOUT_MS) {
  if (!exists(lockDir)) {
    return false;
  }
  const ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
  if (ageMs <= staleMs) {
    return false;
  }
  fs.rmSync(lockDir, { recursive: true, force: true });
  log(`removed stale bootstrap lock at ${rel(lockDir)} (${Math.round(ageMs / 1000)}s old)`);
  return true;
}

async function acquireBootstrapLock(options = {}) {
  fs.mkdirSync(dbDir, { recursive: true });
  const deadline = Date.now() + (options.timeoutMs ?? BOOTSTRAP_LOCK_TIMEOUT_MS);
  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_TIMEOUT_MS;
  const retrySleepMs = options.retrySleepMs ?? 1000;
  while (true) {
    try {
      fs.mkdirSync(lockDir);
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
        // council P1-Seat2: clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
        clearLeaseFile();
        process.kill(process.pid, signal);
        return;
      }
      clearLeaseFile();
      process.exit(code ?? 0);
    })().catch((error) => {
      log(`shutdown cleanup failed: ${error.message}`);
      debug(error.stack || error.message);
      clearLeaseFile();
      process.exit(code ?? 1);
    });
  });

  childProcess.on('error', (error) => {
    log(`child process error: ${error.message}`);
    debug(error.stack || error.message);
    process.exit(1);
  });
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
        clearLeaseFile();
        process.exit(128);
      })().catch((error) => {
        log(`signal shutdown failed: ${error.message}`);
        debug(error.stack || error.message);
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
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    installSignalHandlers();
    // Lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearLeaseFile);
    refreshPaths();
    debug(`DB: ${advisorDbPath()}`);

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER);
    if (strictSingleWriter) {
      if (checkStrictSingleWriter()) return;
    } else {
      log('MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    }

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
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
      if (strictSingleWriter && checkStrictSingleWriter()) return;
      writeLeaseFile();
      const reprobe = readLeaseFile();
      if (!reprobe || reprobe.pid !== process.pid) {
        const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
        process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
        return;
      }
    }

    launchServer();
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
  configureLauncherPathsForTesting,
  createChildEnv,
  latestSourceMtimeMs,
  removeStaleBootstrapLock,
};
