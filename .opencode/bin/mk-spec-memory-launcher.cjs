#!/usr/bin/env node
// [mk-spec-memory-launcher] MCP child-process launcher for the mk-spec-memory server.
// Loads project-local env overrides, ensures dist artifacts are built and current,
// serializes concurrent starts via a filesystem bootstrap lock, then spawns the
// context-server.js child. All stderr lines are tagged with the bracketed module
// prefix for ops grepping. See .opencode/specs/.../014/052-mk-spec-memory-rename for
// the rename packet that established this name.

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
    if (n > 0) process.stderr.write(`[mk-spec-memory-launcher] loaded ${n} env(s) from ${fname}\n`);
  }
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
let childProcess = null;

function log(message) {
  process.stderr.write(`[mk-spec-memory-launcher] ${message}\n`);
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
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
}

function leasePath() {
  return path.join(dbDir, PID_FILE_NAME);
}

function readLeaseFile() {
  try {
    const raw = fs.readFileSync(leasePath(), 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
    // Missing or corrupt lease files are treated as no active lease.
  }
  return null;
}

function isLeaseHeld() {
  const lease = readLeaseFile();
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false };
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true };
    throw error;
  }
}

function writeLeaseFile() {
  fs.mkdirSync(dbDir, { recursive: true });
  const tmp = leasePath() + '.tmp.' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2));
  fs.renameSync(tmp, leasePath());
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
  const server = path.join(kitDir, 'mcp_server', 'dist', 'context-server.js');
  childProcess = spawn(process.execPath, [server], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  childProcess.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  childProcess.on('error', (error) => {
    log(error.stack || error.message);
    process.exit(1);
  });
}

function installSignalHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
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
        }, 5000).unref();
        return;
      }
      clearLeaseFile();
      process.exit(128);
    });
  }
}

(async () => {
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    installSignalHandlers();
    refreshPaths();
    ensureLayout(actions);
    refreshPaths();
    enforceStandaloneCodeGraphDb(actions);

    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER);
    if (strictSingleWriter) {
      const leaseResult = isLeaseHeld();
      if (leaseResult.held && !leaseResult.staleReclaimable) {
        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid}\n`);
        process.exit(0);
      }
      if (leaseResult.staleReclaimable) {
        log('staleReclaimed: true');
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
    }

    writeLeaseFile();
    const reprobe = readLeaseFile();
    if (!reprobe || reprobe.pid !== process.pid) {
      process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'}\n`);
      process.exit(0);
    }
    const onExit = () => clearLeaseFile();
    process.on('exit', onExit);

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
})();
