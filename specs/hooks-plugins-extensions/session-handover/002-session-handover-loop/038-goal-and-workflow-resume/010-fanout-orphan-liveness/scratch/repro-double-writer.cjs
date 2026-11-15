#!/usr/bin/env node
'use strict';

// Reproduce two concurrent writers in one lineage directory: the first runner is
// killed while its detached shim keeps running, then the same fan-out command
// runs again against the same ledger. Everything happens under a temporary root
// with a shim in place of the real executor, so no model session is started.

const {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const { spawn } = require('node:child_process');

function findRepoRoot(startDir) {
  let current = resolve(startDir);
  for (;;) {
    const candidate = join(current, '.skilled', 'skills', 'system-deep-loop', 'runtime', 'scripts', 'fanout-run.cjs');
    if (existsSync(candidate)) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error('Could not locate the repository root');
    }
    current = parent;
  }
}

const repoRoot = findRepoRoot(__dirname);
const runtimeRoot = join(repoRoot, '.skilled', 'skills', 'system-deep-loop', 'runtime');
const fanoutScript = join(runtimeRoot, 'scripts', 'fanout-run.cjs');
const shimDir = join(runtimeRoot, 'tests', 'stress', 'cli-adapter', 'shims');

const root = mkdtempSync(join(tmpdir(), 'fanout-repro-'));
const binDir = join(root, 'bin');
const homeDir = join(root, 'home');
const capturePath = join(root, 'capture.jsonl');
const pidPath = join(root, 'pids.json');

mkdirSync(binDir, { recursive: true });
mkdirSync(homeDir, { recursive: true });
copyFileSync(join(shimDir, 'opencode-shim.cjs'), join(binDir, 'opencode'));
copyFileSync(join(shimDir, 'adapter-shim-core.cjs'), join(binDir, 'adapter-shim-core.cjs'));
chmodSync(join(binDir, 'opencode'), 0o755);
writeFileSync(join(homeDir, '.cli-adapter-control.json'), JSON.stringify({
  mode: 'timeout',
  capturePath,
  pidPath,
}), 'utf8');

const specFolder = 'specs/fanout-repro';
const baseArtifactDir = join(root, specFolder, 'research', 'artifacts');
const ledgerPath = join(baseArtifactDir, 'orchestration-status.log');
mkdirSync(baseArtifactDir, { recursive: true });

const args = [
  '--spec-folder', specFolder,
  '--loop-type', 'research',
  '--fanout-config-json', JSON.stringify({
    executors: [{
      label: 'repro',
      kind: 'cli-opencode',
      model: 'anthropic/claude-opus-4-8',
      reasoningEffort: 'high',
      iterations: 1,
    }],
    concurrency: 1,
    maxRetries: 0,
  }),
  '--base-artifact-dir', baseArtifactDir,
  '--allow-single-lineage',
];

const env = {
  ...process.env,
  HOME: homeDir,
  PATH: `${binDir}:${process.env.PATH || ''}`,
  CLI_ADAPTER_SHIM_MODE: 'timeout',
  CLI_ADAPTER_SHIM_CAPTURE: capturePath,
  CLI_ADAPTER_SHIM_PID_FILE: pidPath,
  SYSTEM_SPEC_GATE_ENFORCE: '0',
  AI_SESSION_CHILD: '1',
};

function readCaptures() {
  if (!existsSync(capturePath)) return [];
  return readFileSync(capturePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readLedgerRecords() {
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function waitFor(predicate, timeoutMs) {
  return new Promise((resolvePromise, rejectPromise) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      if (predicate()) {
        resolvePromise();
        return;
      }
      if (Date.now() >= deadline) {
        rejectPromise(new Error(`Timed out after ${timeoutMs}ms`));
        return;
      }
      setTimeout(tick, 20);
    };
    tick();
  });
}

function pidIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function signalGroup(pid, signal) {
  if (process.platform !== 'win32') {
    try {
      process.kill(-pid, signal);
      return;
    } catch {
      // Fall through to a direct kill when the target never became a group leader.
    }
  }
  try {
    process.kill(pid, signal);
  } catch {
    // The process already exited.
  }
}

function spawnRunner() {
  return spawn(process.execPath, [fanoutScript, ...args], {
    cwd: root,
    env,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'ignore', 'ignore'],
  });
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolvePromise) => {
    let settled = false;
    const finish = (code, timedOut) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise({ code, timedOut });
    };
    const timer = setTimeout(() => {
      finish(null, true);
    }, timeoutMs);
    child.once('close', (code) => finish(code, false));
    child.once('error', () => finish(null, false));
  });
}

async function main() {
  let firstRunner;
  let secondRunner;
  let secondRunnerExit = { code: null, timedOut: false };
  try {
    firstRunner = spawnRunner();
    await waitFor(() => readCaptures().length >= 1, 15_000);
    signalGroup(firstRunner.pid, 'SIGKILL');
    await waitForExit(firstRunner, 5_000);

    secondRunner = spawnRunner();
    secondRunnerExit = await waitForExit(secondRunner, 10_000);
    if (secondRunnerExit.timedOut) {
      signalGroup(secondRunner.pid, 'SIGKILL');
      await waitForExit(secondRunner, 5_000);
    }

    const captures = readCaptures();
    const records = readLedgerRecords();
    process.stdout.write(`captures=${captures.length}\n`);
    for (const capture of captures) {
      process.stdout.write(`pid=${capture.pid} alive=${pidIsAlive(capture.pid)}\n`);
    }
    process.stdout.write(`second runner exit=${secondRunnerExit.code}\n`);
    for (const record of records.filter((entry) => entry.event === 'orphan_requeued')) {
      process.stdout.write(`orphan_requeued ${JSON.stringify(record)}\n`);
    }
  } finally {
    if (firstRunner && firstRunner.pid !== undefined) {
      signalGroup(firstRunner.pid, 'SIGKILL');
    }
    if (secondRunner && secondRunner.pid !== undefined) {
      signalGroup(secondRunner.pid, 'SIGKILL');
    }
    for (const capture of readCaptures()) {
      signalGroup(capture.pid, 'SIGKILL');
    }
    rmSync(root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error && error.message ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
