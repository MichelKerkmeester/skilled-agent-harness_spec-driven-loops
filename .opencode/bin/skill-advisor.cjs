#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const opencodeDir = path.resolve(__dirname, '..');
const mcpServerDir = path.join(opencodeDir, 'skills', 'system-skill-advisor', 'mcp_server');
const cliDist = path.join(mcpServerDir, 'dist', 'mcp_server', 'skill-advisor-cli.js');
const sourceHashState = path.join(path.dirname(cliDist), '.skill-advisor-cli-source-hash.json');
const defaultSocketDir = '/tmp/mk-skill-advisor';
const socketFileName = 'daemon-ipc.sock';
const allowStale = process.env.MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE === '1'
  || process.env.SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE === '1';

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(69);
}

function sourceCandidates() {
  const candidates = [
    path.join(mcpServerDir, 'skill-advisor-cli.ts'),
    path.join(mcpServerDir, 'skill-advisor-cli-manifest.ts'),
    path.join(mcpServerDir, 'tsconfig.json'),
    path.join(mcpServerDir, 'tsconfig.build.json'),
    path.join(mcpServerDir, 'schemas', 'advisor-tool-schemas.ts'),
    path.join(mcpServerDir, 'tools'),
  ];
  const files = [];

  const visit = (candidate) => {
    if (!fs.existsSync(candidate)) return;
    const stat = fs.statSync(candidate);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(candidate)) {
        visit(path.join(candidate, entry));
      }
      return;
    }
    if (candidate.endsWith('.ts') || candidate.endsWith('.json')) {
      files.push(candidate);
    }
  };

  for (const candidate of candidates) visit(candidate);
  return files;
}

function hashSourceFiles(existingSources) {
  const hash = crypto.createHash('sha256');
  for (const filePath of [...existingSources].sort()) {
    hash.update(path.relative(mcpServerDir, filePath));
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
    fail(`skill-advisor dist entrypoint is missing: ${cliDist}. Run the skill-advisor TypeScript build.`);
  }
  if (allowStale) return;
  const sources = sourceCandidates();
  if (sources.length === 0) return;
  const currentSourceHash = hashSourceFiles(sources);
  if (readStoredSourceHash() === currentSourceHash) return;
  const sourceMtime = Math.max(...sources.map((filePath) => fs.statSync(filePath).mtimeMs));
  const distMtime = fs.statSync(cliDist).mtimeMs;
  if (sourceMtime > distMtime) {
    fail('skill-advisor dist entrypoint is stale. Run the skill-advisor TypeScript build.');
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
  process.exit(75);
}

process.exit(result.status ?? 1);
