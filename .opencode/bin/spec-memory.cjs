#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Spec Memory CLI Shim                                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Runs the built daemon-backed mk-spec-memory CLI.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const opencodeDir = path.resolve(__dirname, '..');
const mcpServerDir = path.join(opencodeDir, 'skills', 'system-spec-kit', 'mcp_server');
const cliDist = path.join(mcpServerDir, 'dist', 'spec-memory-cli.js');
const { checkPackageFreshness } = require(path.join(opencodeDir, 'skills', 'system-spec-kit', 'scripts', 'lib', 'dist-freshness.cjs'));
const defaultSocketDir = '/tmp/mk-spec-memory';
const socketFileName = 'daemon-ipc.sock';
const allowStale = process.env.SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE === '1';
const EXIT_PROTOCOL = 69;
const EXIT_RETRYABLE = 75;
const FRESHNESS_EXEMPT_COMMANDS = new Set(['completion']);

function requestedFormat(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--format') return argv[index + 1] || 'json';
    const inline = token.match(/^--format=(.*)$/);
    if (inline) return inline[1];
  }
  return 'json';
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

function nodeWarningArgs() {
  return process.allowedNodeEnvironmentFlags?.has('--disable-warning')
    ? ['--disable-warning=ExperimentalWarning']
    : ['--no-warnings'];
}

function isFreshnessExemptArgv(argv) {
  const command = argv[0];
  return command === '--help'
    || command === '-h'
    || command === '--version'
    || command === '-v'
    || FRESHNESS_EXEMPT_COMMANDS.has(command);
}

function readShimVersion() {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(mcpServerDir, 'package.json'), 'utf8'));
    return typeof parsed.version === 'string' ? parsed.version : '0.0.0';
  } catch (_) {
    return '0.0.0';
  }
}

function handleShimMetaArgv(argv) {
  const command = argv[0];
  if (command === '--version' || command === '-v') {
    process.stdout.write(`${readShimVersion()}\n`);
    process.exit(0);
  }
  if (command === '--help' || command === '-h') {
    process.stdout.write([
      'spec-memory — daemon-backed Spec Kit Memory CLI',
      '',
      'Usage:',
      '  spec-memory <tool-name> --json <payload> [--format json|jsonl|text] [--warm-only]',
      '  spec-memory list-tools [--format json|text]',
      '  spec-memory completion bash|zsh',
      '  spec-memory --version',
      '',
      'Stale dist handling:',
      '  Tool calls refuse stale dist with exit 75; stale-dist is a non-retryable subcase.',
    ].join('\n'));
    process.stdout.write('\n');
    process.exit(0);
  }
}

function ensureFreshDist() {
  const result = checkPackageFreshness('system-spec-kit/mcp_server', {
    workspaceRoot: path.dirname(opencodeDir),
    entry: 'spec-memory-cli',
    allowStale,
  });
  if (result.status === 'missing' || result.stale) {
    const message = `${result.message}\nExit 75 subcase: stale-dist is non-retryable; rebuild before retrying this CLI call.`;
    fail(message, EXIT_RETRYABLE, { staleDistWarning: message, retryable: false, retryableSubcase: 'stale_dist' });
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
    fail(`spec-memory socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
  }
}

const shimArgv = process.argv.slice(2);
handleShimMetaArgv(shimArgv);
ensureSocketDir();
if (!isFreshnessExemptArgv(shimArgv)) {
  ensureFreshDist();
}

const result = spawnSync(process.execPath, [...nodeWarningArgs(), cliDist, ...shimArgv], {
  cwd: path.dirname(opencodeDir),
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
  process.exit(75);
}

process.exit(result.status ?? 1);
