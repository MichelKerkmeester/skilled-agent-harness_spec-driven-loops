#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: CLI Offline Smoke                                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Daemon-free list-tools + cwd-independence smoke check for the   ║
// ║ spec-memory, code-index, and skill-advisor CLI shims.                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const repoRoot = path.resolve(__dirname, '..', '..');
const socketFileName = 'daemon-ipc.sock';
const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_BUFFER_BYTES = 1024 * 1024 * 10;
const CHECKS = [
  { name: 'spec-memory', shim: path.join(__dirname, 'spec-memory.cjs'), expectedCount: 39 },
  { name: 'code-index', shim: path.join(__dirname, 'code-index.cjs'), expectedCount: 8 },
  { name: 'skill-advisor', shim: path.join(__dirname, 'skill-advisor.cjs'), expectedCount: 9 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { format: 'text', timeoutMs: DEFAULT_TIMEOUT_MS };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--format') {
      options.format = argv[index + 1] === 'json' ? 'json' : 'text';
      index += 1;
    } else if (value === '--json') {
      options.format = 'json';
    } else if (value === '--timeout-ms') {
      const parsed = Number.parseInt(argv[index + 1], 10);
      if (Number.isFinite(parsed) && parsed > 0) options.timeoutMs = parsed;
      index += 1;
    }
  }
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SMOKE CHECK HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function classifyFreshness(exitCode, stderr) {
  if (exitCode === 69 && /dist entrypoint is (stale|missing)/i.test(stderr)) {
    return 'dist_stale_rebuild_required';
  }
  if (exitCode === 0) return 'fresh';
  return 'unknown';
}

function parseJson(stdout) {
  try {
    return JSON.parse(stdout || '{}');
  } catch {
    return null;
  }
}

// Spawn a shim's offline `list-tools` from a chosen working directory.
// `list-tools` needs no daemon, so this exercises pure path resolution.
function spawnListTools(check, cwd, timeoutMs) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-offline-smoke-'));
  const socketDir = path.join(sandbox, 'sock');
  try {
    const result = spawnSync(process.execPath, [check.shim, 'list-tools', '--format', 'json'], {
      cwd,
      env: {
        ...process.env,
        SPECKIT_IPC_SOCKET_DIR: socketDir,
        SPECKIT_DAEMON_REELECTION: '0',
      },
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: MAX_BUFFER_BYTES,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const payload = parseJson(result.stdout);
    return {
      payload,
      exitCode: result.status,
      signal: result.signal,
      stderr: result.stderr ?? '',
      daemonFree: !fs.existsSync(path.join(socketDir, socketFileName)),
    };
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

function runCheck(check, timeoutMs) {
  const run = spawnListTools(check, repoRoot, timeoutMs);
  const count = run.payload?.data?.count;
  const freshness = classifyFreshness(run.exitCode, run.stderr);
  const ok = run.exitCode === 0
    && run.payload?.status === 'ok'
    && count === check.expectedCount
    && run.daemonFree;

  return {
    name: check.name,
    ok,
    status: run.payload?.status ?? null,
    count: typeof count === 'number' ? count : null,
    expectedCount: check.expectedCount,
    freshness,
    exitCode: run.exitCode,
    signal: run.signal,
    daemonFree: run.daemonFree,
    stderr: run.stderr ? '[stderr-present]' : null,
  };
}

// Prove each shim resolves its entrypoint from the script's own location, not
// the caller's cwd: run `list-tools` from an unrelated temp directory and
// require the same offline success + tool count as the repo-root baseline.
function runCwdIndependenceCheck(check, timeoutMs) {
  const unrelatedCwd = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-cwd-indep-'));
  try {
    const run = spawnListTools(check, unrelatedCwd, timeoutMs);
    const count = run.payload?.data?.count;
    const freshness = classifyFreshness(run.exitCode, run.stderr);
    const ok = run.exitCode === 0
      && run.payload?.status === 'ok'
      && count === check.expectedCount
      && run.daemonFree;

    return {
      name: check.name,
      ok,
      status: run.payload?.status ?? null,
      count: typeof count === 'number' ? count : null,
      expectedCount: check.expectedCount,
      freshness,
      exitCode: run.exitCode,
      signal: run.signal,
      daemonFree: run.daemonFree,
      cwd: '[unrelated-temp-dir]',
      stderr: run.stderr ? '[stderr-present]' : null,
    };
  } finally {
    fs.rmSync(unrelatedCwd, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OUTPUT RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function renderText(payload) {
  const lines = [
    `CLI offline smoke: ${payload.status.toUpperCase()}`,
    `scenario=${payload.scenario}`,
  ];
  for (const result of payload.results) {
    lines.push(`${result.name}: ${result.ok ? 'ok' : 'fail'} count=${result.count ?? 'n/a'}/${result.expectedCount} freshness=${result.freshness} daemonFree=${result.daemonFree}`);
  }
  lines.push(`scenario=${payload.cwdIndependence.scenario}`);
  for (const result of payload.cwdIndependence.results) {
    lines.push(`${result.name}: ${result.ok ? 'ok' : 'fail'} count=${result.count ?? 'n/a'}/${result.expectedCount} cwd=${result.cwd} daemonFree=${result.daemonFree}`);
  }
  return `${lines.join('\n')}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const options = parseArgs(process.argv.slice(2));
  const results = CHECKS.map((check) => runCheck(check, options.timeoutMs));
  const cwdResults = CHECKS.map((check) => runCwdIndependenceCheck(check, options.timeoutMs));
  const ok = results.every((result) => result.ok)
    && cwdResults.every((result) => result.ok);
  const payload = {
    status: ok ? 'ok' : 'fail',
    scenario: 'cli-list-tools-parity',
    daemonRequired: false,
    buildRequired: false,
    scanRequired: false,
    results,
    cwdIndependence: {
      scenario: 'cli-cwd-independent-resolution',
      results: cwdResults,
    },
  };

  process.stdout.write(options.format === 'json' ? `${JSON.stringify(payload, null, 2)}\n` : renderText(payload));
  process.exit(ok ? 0 : 1);
}

main();
