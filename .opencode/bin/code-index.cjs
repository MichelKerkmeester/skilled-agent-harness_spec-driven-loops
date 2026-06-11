#!/usr/bin/env node
// --------------------------------------------------------------------------
// COMPONENT: Code Index CLI Shim
// PURPOSE: Runs the built daemon-backed mk-code-index CLI.
// --------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const opencodeDir = path.resolve(__dirname, '..');
const skillDir = path.join(opencodeDir, 'skills', 'system-code-graph');
const sourceFiles = [
  path.join(skillDir, 'mcp_server', 'code-index-cli.ts'),
  path.join(skillDir, 'mcp_server', 'code-index-cli-manifest.ts'),
  path.join(skillDir, 'mcp_server', 'tool-schemas.ts'),
];
const cliDist = path.join(skillDir, 'mcp_server', 'dist', 'code-index-cli.js');
const sourceHashState = path.join(path.dirname(cliDist), '.code-index-cli-source-hash.json');
const defaultSocketDir = '/tmp/mk-code-index';
const socketFileName = 'daemon-ipc.sock';
const allowStale = process.env.SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE === '1';

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(69);
}

function hashSourceFiles(existingSources) {
  const hash = crypto.createHash('sha256');
  for (const filePath of [...existingSources].sort()) {
    hash.update(path.relative(skillDir, filePath));
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function readStoredSourceHash() {
  try {
    const parsed = JSON.parse(fs.readFileSync(sourceHashState, 'utf8'));
    return typeof parsed?.sourceHash === 'string' ? parsed.sourceHash : null;
  } catch {
    return null;
  }
}

function writeStoredSourceHash(sourceHash) {
  try {
    fs.mkdirSync(path.dirname(sourceHashState), { recursive: true });
    fs.writeFileSync(sourceHashState, `${JSON.stringify({ version: 1, sourceHash })}\n`);
  } catch {
    // Freshness metadata is an optimization; stale detection remains conservative.
  }
}

function ensureFreshDist() {
  if (!fs.existsSync(cliDist)) {
    if (allowStale) {
      process.stderr.write(`code-index dist entrypoint is missing but dev override is set: ${cliDist}\n`);
      return;
    }
    fail(`code-index dist entrypoint is missing: ${cliDist}. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.`);
  }
  if (allowStale) return;
  const existingSources = sourceFiles.filter((filePath) => fs.existsSync(filePath));
  if (existingSources.length === 0) return;
  const currentSourceHash = hashSourceFiles(existingSources);
  if (readStoredSourceHash() === currentSourceHash) return;
  const newestSourceMtime = Math.max(...existingSources.map((filePath) => fs.statSync(filePath).mtimeMs));
  const distMtime = fs.statSync(cliDist).mtimeMs;
  if (newestSourceMtime > distMtime) {
    fail('code-index dist entrypoint is stale. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.');
  }
  writeStoredSourceHash(currentSourceHash);
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
    fail(`code-index socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
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
