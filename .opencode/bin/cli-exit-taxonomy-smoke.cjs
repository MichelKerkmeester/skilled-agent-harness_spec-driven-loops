#!/usr/bin/env node
'use strict';

// Daemon-free exit-code and envelope taxonomy smoke for the three CLI
// shims. The sibling cli-offline-smoke.cjs proves list-tools counts; this
// script proves the FAILURE contract: warm-only refusals exit 75, usage
// and trust refusals exit 64, and failure envelopes stay parseable JSON
// (or usage text) rather than stack traces. Every case runs in a sandbox
// socket dir so no daemon is ever spawned or contacted.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');

const SHIMS = {
  'spec-memory': path.join(__dirname, 'spec-memory.cjs'),
  'code-index': path.join(__dirname, 'code-index.cjs'),
  'skill-advisor': path.join(__dirname, 'skill-advisor.cjs'),
};

const CASES = [
  // Warm-only reads with no daemon must refuse retryably (75), never spawn.
  { name: 'spec-memory warm-only read exits 75', shim: 'spec-memory', args: ['memory_stats', '--json', '{}', '--warm-only', '--format', 'json'], expectExit: 75, expectJsonStatus: 'error' },
  { name: 'code-index warm-only read exits 75', shim: 'code-index', args: ['code_graph_status', '--warm-only', '--format', 'json'], expectExit: 75, expectJsonStatus: 'error' },
  { name: 'skill-advisor warm-only read exits 75', shim: 'skill-advisor', args: ['advisor_recommend', '--json', '{"prompt":"taxonomy smoke"}', '--warm-only', '--format', 'json'], expectExit: 75, expectJsonStatus: 'error' },
  // Unknown commands are usage errors (64).
  { name: 'spec-memory unknown command exits 64', shim: 'spec-memory', args: ['no_such_tool', '--format', 'json'], expectExit: 64 },
  { name: 'code-index unknown command exits 64', shim: 'code-index', args: ['no_such_tool', '--format', 'json'], expectExit: 64 },
  { name: 'skill-advisor unknown command exits 64', shim: 'skill-advisor', args: ['no_such_tool', '--format', 'json'], expectExit: 64 },
  // Trust refusal: advisor mutations without --trusted fail closed (64)
  // before any IPC frame, so this stays daemon-free.
  { name: 'skill-advisor untrusted mutation exits 64', shim: 'skill-advisor', args: ['skill_graph_scan', '--format', 'json'], expectExit: 64 },
  // Mutation-intent guard: a bare apply is refused as usage (64) before
  // any daemon contact — default rescan routing must be opted into.
  { name: 'code-index bare apply guarded exits 64', shim: 'code-index', args: ['code_graph_apply', '--format', 'json'], expectExit: 64 },
];

function parseArgs(argv) {
  const options = { format: 'text', timeoutMs: 20_000 };
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

function parseJson(text) {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function runCase(testCase, timeoutMs) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-taxonomy-smoke-'));
  const socketDir = path.join(sandbox, 'sock');
  try {
    const result = spawnSync(process.execPath, [SHIMS[testCase.shim], ...testCase.args], {
      cwd: repoRoot,
      env: {
        ...process.env,
        SPECKIT_IPC_SOCKET_DIR: socketDir,
        SPECKIT_DAEMON_REELECTION: '0',
      },
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024 * 10,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Failure envelopes route to stderr when stdout is piped; accept either.
    const payload = parseJson(result.stdout) ?? parseJson(result.stderr);
    const exitOk = result.status === testCase.expectExit;
    const envelopeOk = testCase.expectJsonStatus === undefined
      || payload?.status === testCase.expectJsonStatus;
    const daemonFree = !fs.existsSync(path.join(socketDir, 'daemon-ipc.sock'));

    return {
      name: testCase.name,
      ok: exitOk && envelopeOk && daemonFree,
      exitCode: result.status,
      expectedExit: testCase.expectExit,
      envelopeStatus: payload?.status ?? null,
      daemonFree,
      signal: result.signal,
    };
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const results = CASES.map((testCase) => runCase(testCase, options.timeoutMs));
  const ok = results.every((entry) => entry.ok);
  const payload = { status: ok ? 'ok' : 'error', data: { cases: results } };

  if (options.format === 'json') {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  } else {
    for (const entry of results) {
      process.stdout.write(`${entry.ok ? 'PASS' : 'FAIL'} ${entry.name} (exit ${entry.exitCode}, expected ${entry.expectedExit})\n`);
    }
    process.stdout.write(`${ok ? 'OK' : 'FAILED'}: ${results.filter((entry) => entry.ok).length}/${results.length} taxonomy cases\n`);
  }
  process.exit(ok ? 0 : 1);
}

main();
