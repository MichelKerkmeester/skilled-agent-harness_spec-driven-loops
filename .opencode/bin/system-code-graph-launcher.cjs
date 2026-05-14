#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const opencodeDir = path.join(root, '.opencode');

// 014-local-embeddings-setup-a / 003-mcp-config-rollout:
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
    if (n > 0) process.stderr.write(`[system-code-graph-launcher] loaded ${n} env(s) from ${fname}\n`);
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
    '[system-code-graph-launcher] MAINTAINER_MODE=true: forcing all 5 INDEX_* to "true"\n'
  );
}

let skillsDir = path.join(opencodeDir, 'skills');
let legacySkillDir = path.join(opencodeDir, 'skill');
let kitDir = path.join(skillsDir, 'system-code-graph');
let dbDir = path.join(kitDir, 'mcp_server', 'database');
let lockDir = path.join(dbDir, '.system-code-graph-launcher.lockdir');
let stateFile = path.join(dbDir, '.system-code-graph-launcher.json');

const rel = (p) => path.relative(root, p) || '.';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
let childProcess = null;

function log(message) {
  process.stderr.write(`[system-code-graph-launcher] ${message}\n`);
}

function refreshPaths() {
  skillsDir = path.join(opencodeDir, 'skills');
  legacySkillDir = path.join(opencodeDir, 'skill');
  kitDir = path.join(skillsDir, 'system-code-graph');
  dbDir = path.join(kitDir, 'mcp_server', 'database');
  lockDir = path.join(dbDir, '.system-code-graph-launcher.lockdir');
  stateFile = path.join(dbDir, '.system-code-graph-launcher.json');
}

function exists(p) {
  return fs.existsSync(p);
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

function buildIfNeeded(actions) {
  if (artifactsReady()) {
    return;
  }

  if (!exists(kitDir)) {
    throw new Error(`system-code-graph not found at ${rel(kitDir)}`);
  }

  actions.push('installed dependencies and built @spec-kit/system-code-graph MCP server');
  const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
  run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
  run('npx', ['tsc', '-p', 'tsconfig.json'], { cwd: kitDir });

  const direct = path.join(kitDir, 'mcp_server', 'dist', 'index.js');
  const nested = path.join(kitDir, 'dist', 'system-code-graph', 'mcp_server', 'index.js');
  if (!exists(direct) && exists(nested)) {
    fs.mkdirSync(path.dirname(direct), { recursive: true });
    fs.writeFileSync(direct, "import '../../dist/system-code-graph/mcp_server/index.js';\n");
  }

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
  const server = path.join(kitDir, 'mcp_server', 'dist', 'index.js');
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
    ensureLayout(actions);
    refreshPaths();

    lockHeld = await acquireBootstrapLock();
    if (lockHeld) {
      buildIfNeeded(actions);
      writeState({
        command: 'system-code-graph-launcher',
        start: started,
        end: now(),
        status: 'ready',
        actions,
        server: rel(path.join(kitDir, 'mcp_server', 'dist', 'index.js')),
      });
    }

    launchServer();
  } catch (error) {
    try {
      writeState({
        command: 'system-code-graph-launcher',
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
