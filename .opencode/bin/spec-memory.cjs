#!/usr/bin/env node
// --------------------------------------------------------------------------
// COMPONENT: Spec Memory CLI Shim
// PURPOSE: Runs the built daemon-backed mk-spec-memory CLI.
// --------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const opencodeDir = path.resolve(__dirname, '..');
const cliSource = path.join(opencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'spec-memory-cli.ts');
const cliDist = path.join(opencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'dist', 'spec-memory-cli.js');
const defaultSocketDir = '/tmp/mk-spec-memory';
const socketFileName = 'daemon-ipc.sock';
const allowStale = process.env.SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE === '1';

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(69);
}

function ensureFreshDist() {
  if (!fs.existsSync(cliDist)) {
    fail(`spec-memory dist entrypoint is missing: ${cliDist}. Run npm run build --workspace=@spec-kit/mcp-server.`);
  }
  if (allowStale || !fs.existsSync(cliSource)) return;
  const sourceMtime = fs.statSync(cliSource).mtimeMs;
  const distMtime = fs.statSync(cliDist).mtimeMs;
  if (sourceMtime > distMtime) {
    fail(`spec-memory dist entrypoint is stale. Run npm run build --workspace=@spec-kit/mcp-server.`);
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

ensureSocketDir();
ensureFreshDist();

const result = spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], {
  cwd: path.dirname(opencodeDir),
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
  process.exit(75);
}

process.exit(result.status ?? 1);
