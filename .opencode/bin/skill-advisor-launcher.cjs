#!/usr/bin/env node
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
for (const fname of ['.env.local', '.env']) {
  const p = path.join(root, fname);
  if (fs.existsSync(p)) {
    const n = loadEnvFile(p);
    if (n > 0) process.stderr.write(`[skill-advisor-launcher] loaded ${n} env(s) from ${fname}\n`);
  }
}

let skillsDir = path.join(opencodeDir, 'skills');
let kitDir = path.join(skillsDir, 'system-skill-advisor');
let mcpDir = path.join(kitDir, 'mcp_server');
let dbDir = path.join(mcpDir, 'database');
let lockDir = path.join(dbDir, '.skill-advisor-launcher.lockdir');
let stateFile = path.join(dbDir, '.skill-advisor-launcher.json');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
let childProcess = null;

function log(message) {
  process.stderr.write(`[skill-advisor-launcher] ${message}\n`);
}

function refreshPaths() {
  skillsDir = path.join(opencodeDir, 'skills');
  kitDir = path.join(skillsDir, 'system-skill-advisor');
  mcpDir = path.join(kitDir, 'mcp_server');
  dbDir = path.join(mcpDir, 'database');
  lockDir = path.join(dbDir, '.skill-advisor-launcher.lockdir');
  stateFile = path.join(dbDir, '.skill-advisor-launcher.json');
}

function exists(p) {
  return fs.existsSync(p);
}

function advisorDbPath() {
  const resolvedDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR
    ? path.resolve(process.env.SYSTEM_SKILL_ADVISOR_DB_DIR)
    : dbDir;
  return path.join(resolvedDbDir, 'skill-graph.sqlite');
}

function writeState(payload) {
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
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

function serverEntrypoint() {
  return path.join(mcpDir, 'dist', 'system-skill-advisor', 'mcp_server', 'advisor-server.js');
}

function requiredArtifacts() {
  return [
    serverEntrypoint(),
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
  const server = serverEntrypoint();
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

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    if (childProcess && !childProcess.killed) {
      childProcess.kill(signal);
      setTimeout(() => process.exit(128), 5000).unref();
      return;
    }
    process.exit(128);
  });
}

(async () => {
  const started = now();
  const actions = [];
  let lockHeld = false;

  try {
    refreshPaths();
    log(`DB: ${advisorDbPath()}`);

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
      buildIfNeeded(actions);
      writeState({
        command: 'skill-advisor-launcher',
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
        command: 'skill-advisor-launcher',
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
