#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const opencodeDir = path.resolve(__dirname, '..');
const mcpServerDir = path.join(opencodeDir, 'skills', 'system-skill-advisor', 'mcp_server');
const cliDist = path.join(mcpServerDir, 'dist', 'mcp_server', 'skill-advisor-cli.js');
const { checkPackageFreshness } = require(path.join(opencodeDir, 'skills', 'system-spec-kit', 'scripts', 'lib', 'dist-freshness.cjs'));
const defaultSocketDir = '/tmp/mk-skill-advisor';
const socketFileName = 'daemon-ipc.sock';
const allowStale = process.env.MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE === '1'
  || process.env.SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE === '1';
const EXIT_PROTOCOL = 69;
const EXIT_RETRYABLE = 75;

function requestedFormat(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--format') return argv[index + 1] || 'json';
    const inline = token.match(/^--format=(.*)$/);
    if (inline) return inline[1];
  }
  return 'json';
}

function requestedWarmOnly(argv) {
  return argv.some((token) => token === '--warm-only' || token === '--warm-only=true' || token === '--warm-only=1');
}

function fail(message, exitCode = EXIT_PROTOCOL, fields = {}) {
  const format = requestedFormat(process.argv.slice(2));
  if (format === 'json' || format === 'jsonl') {
    const payload = {
      status: 'error',
      error: message,
      exitCode,
      ...fields,
    };
    process.stderr.write(`${format === 'jsonl' ? JSON.stringify(payload) : JSON.stringify(payload, null, 2)}\n`);
  } else {
    process.stderr.write(`${message}\n`);
  }
  process.exit(exitCode);
}

function ensureFreshDist() {
  const result = checkPackageFreshness('system-skill-advisor/mcp_server', {
    workspaceRoot: path.dirname(opencodeDir),
    entry: 'skill-advisor-cli',
    allowStale,
  });
  if (result.status === 'missing' || result.stale) {
    const warmOnly = requestedWarmOnly(process.argv.slice(2));
    fail(result.message, warmOnly ? EXIT_RETRYABLE : EXIT_PROTOCOL, warmOnly ? { staleDistWarning: result.message } : {});
  }
  if (result.status === 'error') {
    process.stderr.write(`WARNING: ${result.message}\n`);
  }
}

function ensureSocketDir() {
  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
  }
  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  if (socketDir.startsWith('tcp://')) return;
  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  const socketPath = path.join(path.resolve(socketDir), socketFileName);
  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
    fail(`skill-advisor socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
  }
}

ensureSocketDir();
ensureFreshDist();

const result = spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], {
  cwd: path.dirname(opencodeDir),
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
  process.exit(EXIT_RETRYABLE);
}

process.exit(result.status ?? 1);
