#!/usr/bin/env node
// [mk-code-index-launcher] MCP child-process launcher for the mk-code-index server
// (system-code-graph). Loads project-local env overrides, applies the maintainer-mode
// INDEX_* override when SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true, auto-migrates the
// code-graph database from the legacy skill-local location (mcp_server/database/) to the
// standalone shared location (.opencode/.spec-kit/code-graph/database/), ensures dist
// artifacts are built and current, serializes concurrent starts via a filesystem bootstrap
// lock, sets SPECKIT_CODE_GRAPH_DB_DIR for the child process (operator override wins),
// then spawns the code-graph MCP server child. All stderr lines are tagged with the
// bracketed module prefix for ops grepping. See .opencode/skills/system-code-graph/ for
// the standalone skill that owns the server source.

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const opencodeDir = path.join(root, '.opencode');
const BLOCKED_CHILD_ENV_RE = /^(NODE_|npm_|NPM_)/;
const DOTENV_ALLOW_RE = /^(SPECKIT_CODE_GRAPH_|SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN$|MK_CODE_INDEX_|COCOINDEX_BIN_PATH$)/;

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
    // The minimal parser is line-oriented; embedded \n in a quoted value would
    // already have terminated the line, but defend explicitly.
    if (val.includes('\n') || val.includes('\0')) {
      process.stderr.write(`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n`);
      continue;
    }
    if (!DOTENV_ALLOW_RE.test(key)) {
      process.stderr.write(`[mk-code-index-launcher] env ${key} from ${path.basename(filePath)} is not allowlisted; skipping\n`);
      continue;
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
    if (n > 0) process.stderr.write(`[mk-code-index-launcher] loaded ${n} env(s) from ${fname}\n`);
  }
}

// Maintainer-mode override: when SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true is set in
// .env.local (gitignored maintainer-only file), force all 5 INDEX_* flags to "true"
// regardless of what the runtime's MCP config injected. Committed configs ship "false"
// defaults (end-user safe); the maintainer flips this one flag locally to enable
// indexing of .opencode/{skills,agents,commands,specs,plugins} on their machine only.
// Per-call code_graph_scan args (includeSkills, etc.) still override env for fine-grained
// control. See ENV_REFERENCE.md § GRAPH and packet 014/007-mcp-topology-pivot.
if (process.env.SPECKIT_CODE_GRAPH_MAINTAINER_MODE === 'true') {
  const INDEX_KEYS = [
    'SPECKIT_CODE_GRAPH_INDEX_SKILLS',
    'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
    'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
    'SPECKIT_CODE_GRAPH_INDEX_SPECS',
    'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
  ]
  for (const key of INDEX_KEYS) {
    process.env[key] = 'true';
  }
  process.stderr.write(
    '[mk-code-index-launcher] MAINTAINER_MODE=true: forcing all 5 INDEX_* to "true"\n'
  );
}

let skillsDir = path.join(opencodeDir, 'skills');
let legacySkillDir = path.join(opencodeDir, 'skill');
let kitDir = path.join(skillsDir, 'system-code-graph');
// DB lives at the standalone shared location; SPECKIT_CODE_GRAPH_DB_DIR overrides.
// Legacy location (mcp_server/database/) is auto-migrated on first startup.
let dbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
let lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
const PID_FILE_NAME = '.mk-code-index-launcher.json';
const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
let stateFile = path.join(dbDir, PID_FILE_NAME);

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
let childProcess = null;
let ownerLeasePid = null;

function log(message) {
  process.stderr.write(`[mk-code-index-launcher] ${message}\n`);
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
  kitDir = path.join(skillsDir, 'system-code-graph');
  dbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
  lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
  stateFile = path.join(dbDir, PID_FILE_NAME);
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

function canonicalizeExistingPrefix(pathValue) {
  const resolvedPath = path.resolve(pathValue);
  if (fs.existsSync(resolvedPath)) return fs.realpathSync.native(resolvedPath);

  const segments = [];
  let current = resolvedPath;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) return resolvedPath;
    segments.unshift(path.basename(current));
    current = parent;
  }
  return path.join(fs.realpathSync.native(current), ...segments);
}

function isWithinBase(basePath, candidatePath) {
  return candidatePath === basePath || candidatePath.startsWith(`${basePath}${path.sep}`);
}

function isWithinRoot(candidatePath, requireCanonical = false) {
  const canonicalRoot = fs.realpathSync.native(path.resolve(root));
  const normalizedCandidate = canonicalizeExistingPrefix(candidatePath);
  if (!isWithinBase(canonicalRoot, normalizedCandidate)) return false;
  if (!requireCanonical && !fs.existsSync(path.resolve(candidatePath))) return true;
  const candidate = canonicalizePath(candidatePath);
  return isWithinBase(canonicalRoot, candidate);
}

function assertPathWithinRoot(candidatePath, label, requireCanonical = false) {
  if (!isWithinRoot(candidatePath, requireCanonical)) {
    throw new Error(`${label} must stay within workspace root ${root}: ${candidatePath}`);
  }
}

function ensureCanonicalDir(dirPath) {
  assertPathWithinRoot(dirPath, 'code graph DB directory');
  fs.mkdirSync(path.resolve(dirPath), { recursive: true, mode: 0o700 });
  assertPathWithinRoot(dirPath, 'code graph DB directory', true);
  return canonicalizePath(dirPath);
}

function writeState(payload) {
  fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
}

function resolvedDbDir() {
  const candidate = process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir;
  assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR');
  if (fs.existsSync(candidate)) assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR', true);
  return canonicalizePath(candidate);
}

function leasePath() {
  return path.join(resolvedDbDir(), PID_FILE_NAME);
}

function ownerLeasePath() {
  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
}

function legacyLeasePaths() {
  return [
    path.join(opencodeDir, 'skills', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
    path.join(opencodeDir, 'skill', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
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
  const canonicalDbDir = resolvedDbDir();
  const currentOwnerLeasePath = ownerLeasePath();
  const existing = readOwnerLeaseFile(currentOwnerLeasePath);

  if (existing) {
    const classification = classifyOwnerLease(existing);
    if (classification === 'live-owner' || classification === 'unknown-eperm') {
      return { acquired: false, holder: existing, classification };
    }
    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
  }

  const lease = {
    ownerPid: process.pid,
    ppid: process.ppid,
    executablePath: process.execPath,
    startedAtIso: new Date().toISOString(),
    lastHeartbeatIso: new Date().toISOString(),
    ttlMs: 60000,
    canonicalDbDir,
  };
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
  ownerLeasePid = process.pid;
  return { acquired: true, lease, reclaimed: existing };
}

function refreshOwnerLeaseFile(ownerPid, patch = {}) {
  const lease = readOwnerLeaseFile();
  if (!lease || lease.ownerPid !== ownerPid) return false;
  writeOwnerLeaseFile({
    ...lease,
    ...patch,
    lastHeartbeatIso: new Date().toISOString(),
  });
  ownerLeasePid = patch.ownerPid ?? ownerPid;
  return true;
}

function clearOwnerLeaseFile() {
  if (!Number.isInteger(ownerLeasePid)) return;
  try {
    const lease = readOwnerLeaseFile();
    if (lease && lease.ownerPid === ownerLeasePid) fs.unlinkSync(ownerLeasePath());
  } catch {
    // Idempotent cleanup.
  } finally {
    ownerLeasePid = null;
  }
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
    serviceName: 'mk-code-index',
    leaseResult,
    loggerPrefix: 'mk-code-index-launcher',
    dbDir: resolvedDbDir(),
  });
}

function writeLeaseFile() {
  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
  const tmp = currentLeasePath + '.tmp.' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2), { mode: 0o600 });
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

function clearAllLeaseFiles() {
  clearLeaseFile();
  clearOwnerLeaseFile();
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    env: buildChildEnv(),
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

function buildChildEnv(extra = {}) {
  const nextEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (BLOCKED_CHILD_ENV_RE.test(key)) continue;
    nextEnv[key] = value;
  }
  return { ...nextEnv, ...extra };
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
    path.join(kitDir, 'mcp_server', 'dist', 'index.js'),
  ];
}

function artifactsReady() {
  return requiredArtifacts().every(exists);
}

function localTscEntrypoint() {
  return path.join(kitDir, 'node_modules', 'typescript', 'bin', 'tsc');
}

function buildIfNeeded(actions) {
  if (artifactsReady()) {
    return;
  }

  if (!exists(kitDir)) {
    throw new Error(`mk-code-index skill (system-code-graph directory) not found at ${rel(kitDir)}`);
  }

  actions.push('installed dependencies and built @spec-kit/system-code-graph MCP server');
  if (!exists(localTscEntrypoint())) {
    const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
    run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
  }
  run(process.execPath, [localTscEntrypoint(), '-p', 'tsconfig.json'], { cwd: kitDir });

  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
  if (missing.length > 0) {
    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
  }
}

async function acquireBootstrapLock() {
  fs.mkdirSync(dbDir, { recursive: true });
  const deadline = Date.now() + 120000;
  const STALE_LOCK_MS = 5 * 60 * 1000; // 5 minutes — covers SIGKILL'd prior launchers
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
      // Detect stale lockdir from SIGKILL'd predecessor.
      // Existing process should refresh the dir; an mtime older than 5min
      // implies the holder is gone. Remove and retry.
      try {
        const lockStat = fs.statSync(lockDir);
        if (Date.now() - lockStat.mtimeMs > STALE_LOCK_MS) {
          process.stderr.write(
            `[mk-code-index-launcher] stale bootstrap lock (mtime ${Math.round((Date.now() - lockStat.mtimeMs) / 1000)}s old); reclaiming ${rel(lockDir)}\n`
          );
          fs.rmSync(lockDir, { recursive: true, force: true });
          continue;
        }
      } catch {
        // stat race — lock disappeared; loop and retry mkdirSync
      }
      if (Date.now() > deadline) {
        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
      }
      await sleep(1000);
    }
  }
}

function launchServer() {
  // Set DB dir for the child process (operator-set env var wins).
  if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR) {
    process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedDbDir();
  }

  const server = path.join(kitDir, 'mcp_server', 'dist', 'index.js');
  childProcess = spawn(process.execPath, [server], {
    cwd: root,
    env: buildChildEnv(),
    stdio: 'inherit',
  });

  if (typeof childProcess.pid === 'number') {
    const refreshed = refreshOwnerLeaseFile(process.pid, {
      ownerPid: childProcess.pid,
      ppid: process.pid,
      executablePath: process.execPath,
    });
    if (!refreshed) {
      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
    }
  }

  childProcess.on('exit', (code, signal) => {
    if (signal) {
      // council P1-Seat2: clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
      clearAllLeaseFiles();
      process.kill(process.pid, signal);
      return;
    }
    clearAllLeaseFiles();
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
          clearAllLeaseFiles();
          process.exit(128);
        }, 5000).unref();
        return;
      }
      clearAllLeaseFiles();
      process.exit(128);
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

(async () => {
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    installSignalHandlers();
    // REQ-011: lease cleanup runs unconditionally regardless of child termination path.
    process.on('exit', clearAllLeaseFiles);
    refreshPaths();
    ensureLayout(actions);
    refreshPaths();

    // Auto-migrate DB from legacy skill-local location to standalone shared location.
    // The legacy DB is preserved as a backup (copy, not move).
    const legacyDbDir = path.join(kitDir, 'mcp_server', 'database');
    if (!exists(dbDir) && exists(path.join(legacyDbDir, 'code-graph.sqlite'))) {
      fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
      const dbFiles = [
        'code-graph.sqlite',
        'code-graph.sqlite-shm',
        'code-graph.sqlite-wal',
        '.code-graph-readiness.json',
        '.mk-code-index-launcher.json',
      ];
      for (const file of dbFiles) {
        const src = path.join(legacyDbDir, file);
        const dst = path.join(dbDir, file);
        if (exists(src)) {
          fs.copyFileSync(src, dst);
        }
      }
      process.stderr.write(
        `[mk-code-index-launcher] migrated DB from ${rel(legacyDbDir)} to ${rel(dbDir)} (legacy preserved)\n`
      );
    }

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
    if (strictSingleWriter) {
      const ownerLeaseResult = acquireOwnerLeaseFile();
      if (!ownerLeaseResult.acquired) {
        process.stdout.write(
          `LEASE_HELD_BY:${ownerLeaseResult.holder.ownerPid} startedAt=${ownerLeaseResult.holder.startedAtIso} classification=${ownerLeaseResult.classification}\n`
        );
        return;
      }

      const leaseResult = isLeaseHeld();
      if (leaseResult.held && !leaseResult.staleReclaimable) {
        clearOwnerLeaseFile();
        bridgeOrReportLeaseHeld(leaseResult);
        return;
      }
      if (leaseResult.staleReclaimable) {
        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
      }
    } else {
      log('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    }

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
      buildIfNeeded(actions);
      log(`ready: ${JSON.stringify({ start: started, end: now(), actions, server: rel(path.join(kitDir, 'mcp_server', 'dist', 'index.js')) })}`);
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
    log(`failed: ${JSON.stringify({ start: started, end: now(), actions, error: error.message })}`);
    log(error.stack || error.message);
    process.exit(1);
  } finally {
    if (lockHeld) {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
  }
})();
