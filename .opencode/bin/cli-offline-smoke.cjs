#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const socketFileName = 'daemon-ipc.sock';
const checks = [
  { name: 'spec-memory', shim: path.join(__dirname, 'spec-memory.cjs'), expectedCount: 37 },
  { name: 'code-index', shim: path.join(__dirname, 'code-index.cjs'), expectedCount: 8 },
  { name: 'skill-advisor', shim: path.join(__dirname, 'skill-advisor.cjs'), expectedCount: 9 },
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

function runCheck(check, timeoutMs) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-offline-smoke-'));
  const socketDir = path.join(sandbox, 'sock');
  try {
    const result = spawnSync(process.execPath, [check.shim, 'list-tools', '--format', 'json'], {
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

    const payload = parseJson(result.stdout);
    const count = payload?.data?.count;
    const daemonSocket = path.join(socketDir, socketFileName);
    const freshness = classifyFreshness(result.status, result.stderr ?? '');
    const ok = result.status === 0
      && payload?.status === 'ok'
      && count === check.expectedCount
      && !fs.existsSync(daemonSocket);

    return {
      name: check.name,
      ok,
      status: payload?.status ?? null,
      count: typeof count === 'number' ? count : null,
      expectedCount: check.expectedCount,
      freshness,
      exitCode: result.status,
      signal: result.signal,
      daemonFree: !fs.existsSync(daemonSocket),
      stderr: result.stderr ? '[stderr-present]' : null,
    };
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

function renderText(payload) {
  const lines = [
    `CLI offline smoke: ${payload.status.toUpperCase()}`,
    `scenario=${payload.scenario}`,
  ];
  for (const result of payload.results) {
    lines.push(`${result.name}: ${result.ok ? 'ok' : 'fail'} count=${result.count ?? 'n/a'}/${result.expectedCount} freshness=${result.freshness} daemonFree=${result.daemonFree}`);
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const results = checks.map((check) => runCheck(check, options.timeoutMs));
  const ok = results.every((result) => result.ok);
  const payload = {
    status: ok ? 'ok' : 'fail',
    scenario: 'cli-list-tools-parity',
    daemonRequired: false,
    buildRequired: false,
    scanRequired: false,
    results,
  };

  process.stdout.write(options.format === 'json' ? `${JSON.stringify(payload, null, 2)}\n` : renderText(payload));
  process.exit(ok ? 0 : 1);
}

main();
