#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: COLD-START FAIL-OPEN MEASUREMENT
// ───────────────────────────────────────────────────────────────────
//
// Measures whether a session's first prompt receives an advisor brief when no
// daemon socket exists yet. Every run gets a fresh socket directory, so a warm
// daemon cannot answer the hook and the run stays cold. The hook is the Claude
// prompt hook, fed the same payload shape the host sends.
//
// A run fails open when its first additionalContext line is not a live or
// stale advisor head. The last line counts those runs.
//
// Usage (from the repository root):
//   node cold-start.mjs [--runs 5] [--warm]

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const HOOK_PATH = join(ROOT, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
const CLI_PATH = join(ROOT, '.skilled/bin/skill-advisor.cjs');
const PROMPT = 'create a readme for the utils folder';
const SOCKET_PREFIX = 'ssa-cold-';
const WARM_WAIT_MS = 3000;
const TERM_GRACE_MS = 200;
const HOOK_TIMEOUT_MS = 30000;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  let runs = 5;
  let warm = false;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--runs') {
      runs = Number.parseInt(argv[index + 1] ?? '', 10);
      index += 1;
    } else if (token === '--warm') {
      warm = true;
    } else {
      throw new Error(`unknown argument: ${token}`);
    }
  }
  if (!Number.isInteger(runs) || runs < 1) {
    throw new Error('--runs needs a positive integer');
  }
  return { runs, warm };
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function payloadFor(index) {
  return JSON.stringify({
    prompt: PROMPT,
    cwd: ROOT,
    hook_event_name: 'UserPromptSubmit',
    session_id: `cold-${index}`,
  });
}

function firstHead(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return '<none>';
  }
  const context = parsed?.hookSpecificOutput?.additionalContext;
  if (typeof context !== 'string' || context.length === 0) {
    return '<none>';
  }
  return context.split('\n')[0].trim() || '<none>';
}

function isFailOpen(head) {
  return !(head.startsWith('Advisor: live') || head.startsWith('Advisor: stale'));
}

// A detached warm starts the daemon the hook would otherwise start itself, so
// the wait models a host that primes the advisor at session start.
function warmDaemon(socketDir) {
  const child = spawn(
    process.execPath,
    [CLI_PATH, 'advisor_status', '--workspace-root', ROOT, '--format', 'json', '--no-warm-only'],
    {
      cwd: ROOT,
      env: { ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir },
      detached: true,
      stdio: 'ignore',
    },
  );
  child.unref();
}

// Only a process whose displayed command line names this run's socket directory
// may be signalled. The operator's shared daemon names a different directory, so
// it can never match and is never touched.
function terminateRunProcesses(socketDir) {
  const listing = spawnSync('ps', ['eww', '-ax', '-o', 'pid=,command='], { encoding: 'utf8' });
  if (listing.status !== 0 || typeof listing.stdout !== 'string') {
    return;
  }
  const pids = listing.stdout
    .split('\n')
    .filter((line) => line.includes(socketDir))
    .map((line) => Number.parseInt(line.trim().split(/\s+/)[0], 10))
    .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);
  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // The process already exited, so there is nothing left to stop.
    }
  }
  if (pids.length > 0) {
    sleepSync(TERM_GRACE_MS);
  }
}

function measure(socketDir, index) {
  const started = Date.now();
  let stdout = '';
  try {
    stdout = execFileSync(process.execPath, [HOOK_PATH], {
      cwd: ROOT,
      env: { ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir },
      input: payloadFor(index),
      encoding: 'utf8',
      timeout: HOOK_TIMEOUT_MS,
    });
  } catch (error) {
    stdout = typeof error.stdout === 'string' ? error.stdout : '';
  }
  return { ms: Date.now() - started, head: firstHead(stdout) };
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────
async function main() {
  const { runs, warm } = parseArgs(process.argv.slice(2));
  let failed = 0;
  for (let index = 1; index <= runs; index += 1) {
    const socketDir = mkdtempSync(join(tmpdir(), SOCKET_PREFIX));
    if (warm) {
      warmDaemon(socketDir);
      await new Promise((resolve) => setTimeout(resolve, WARM_WAIT_MS));
    }
    const { ms, head } = measure(socketDir, index);
    if (isFailOpen(head)) {
      failed += 1;
    }
    process.stdout.write(`run ${index}: ${ms} ms | ${head}\n`);
    terminateRunProcesses(socketDir);
    rmSync(socketDir, { recursive: true, force: true });
  }
  process.stdout.write(`fail-open ${failed} of ${runs}\n`);
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────
main().catch((error) => {
  process.stderr.write(`[cold-start] ${error.message}\n`);
  process.exit(1);
});
