#!/usr/bin/env node
// [mk-skill-advisor-launcher] MCP child-process launcher for the mk-skill-advisor
// server (system-skill-advisor). Loads project-local env overrides, ensures dist
// artifacts are built and current, serializes concurrent starts via a filesystem
// bootstrap lock with mtime-based staleness detection, then spawns the advisor MCP
// server child. All stderr lines are tagged with the bracketed module prefix for ops
// grepping. See .opencode/skills/system-skill-advisor/ for the standalone skill.

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
]);
let childProcess = null;

function log(message) {
  process.stderr.write(`[mk-skill-advisor-launcher] ${message}\n`);
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

function readLeaseFile() {
  try {
    const parsed = JSON.parse(fs.readFileSync(leasePath(), 'utf8'));
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
    // Missing or corrupt launcher lease files are treated as already clear.
  }
  return null;
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
  return path.join(mcpDir, 'dist', 'system-skill-advisor', 'mcp_server', 'advisor-server.js');
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
      if (artifactsReady()) {
        return false;
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
    if (signal) {
      // council P1-Seat2: clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
      clearLeaseFile();
      process.kill(process.pid, signal);
      return;
    }
    clearLeaseFile();
    process.exit(code ?? 0);
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
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    installSignalHandlers();
    // REQ-011: lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearLeaseFile);
    refreshPaths();
    log(`DB: ${advisorDbPath()}`);

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER);
    if (strictSingleWriter) {
      try {
        const leasePath = path.join(mcpDir, 'dist', 'system-skill-advisor', 'mcp_server', 'lib', 'daemon', 'lease.js');
        const leaseModule = require(leasePath);
        const leaseResult = leaseModule.isLeaseHeld(root);
        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
        if (leaseResult.held && !leaseResult.staleReclaimable) {
          const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
          process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
          process.exit(0);
        }
        if (leaseResult.staleReclaimable) {
          log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
        }
      } catch (error) {
        if (error.code !== 'MODULE_NOT_FOUND') {
          log(`lease check failed: ${error.message}`);
        }
      }
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
    }

    launchServer();
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
    log(error.stack || error.message);
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
