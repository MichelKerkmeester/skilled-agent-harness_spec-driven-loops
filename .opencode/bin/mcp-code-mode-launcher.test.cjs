#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ mcp-code-mode-launcher.test — Launcher behavior tests                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { describe, test } = require('node:test');
const {
  main,
  SERVER_ENTRYPOINT_PATH,
  SERVER_MANIFEST_PATH,
} = require('./mcp-code-mode-launcher.cjs');
const { resolveNodeInterpreter } = require('./lib/node-engine-resolver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
const LAUNCHER_PATH = path.join(__dirname, 'mcp-code-mode-launcher.cjs');
const REQUIRED_NODE_RANGE = '>=24.0.0 <25.0.0';
const INITIALIZE_REQUEST = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'launcher-test', version: '1' },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROCESS TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function createEmptyConfigPath() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-code-mode-launcher-'));
  return {
    directory,
    configPath: path.join(directory, 'missing-config.json'),
  };
}

function runInitialize(command, argumentsList, configPath) {
  return spawnSync(command, argumentsList, {
    cwd: REPOSITORY_ROOT,
    env: { ...process.env, UTCP_CONFIG_FILE: configPath },
    input: `${INITIALIZE_REQUEST}\n`,
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 1024 * 1024 * 10,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function createClosingChild(exitCode, signal = null) {
  const child = new EventEmitter();
  child.killed = false;
  child.kill = () => {
    child.killed = true;
  };
  queueMicrotask(() => child.emit('close', exitCode, signal));
  return child;
}

// The vendored server manifest and build output are untracked, so a checkout
// that has not installed the server cannot exercise a real launch. Skipping
// with the reason keeps that state legible instead of failing the gate.
const INSTALLED_SERVER_SKIP = fs.existsSync(SERVER_MANIFEST_PATH)
  && fs.existsSync(SERVER_ENTRYPOINT_PATH)
  ? false
  : 'the vendored server is not installed in this checkout';

function resolvedInterpreter() {
  const resolution = resolveNodeInterpreter({ manifestPath: SERVER_MANIFEST_PATH });
  assert.equal(resolution.range, REQUIRED_NODE_RANGE);
  assert.ok(resolution.path, 'A satisfying Node interpreter is required for live launch tests');
  return resolution;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROTOCOL EQUIVALENCE
// ─────────────────────────────────────────────────────────────────────────────

describe('mcp code mode launcher', () => {
  test('returns the same initialize response as direct server launch', {
    skip: INSTALLED_SERVER_SKIP,
  }, () => {
    const { directory, configPath } = createEmptyConfigPath();
    try {
      const resolution = resolvedInterpreter();
      const direct = runInitialize(resolution.path, [SERVER_ENTRYPOINT_PATH], configPath);
      const launched = runInitialize(process.execPath, [LAUNCHER_PATH], configPath);

      assert.equal(direct.status, 0, direct.stderr || direct.stdout);
      assert.equal(launched.status, 0, launched.stderr || launched.stdout);
      assert.deepEqual(JSON.parse(launched.stdout.trim()), JSON.parse(direct.stdout.trim()));
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  // The entrypoint argument is the identity consumed by the cleanup matchers.
  test('keeps the server entrypoint in the launched command line', {
    skip: INSTALLED_SERVER_SKIP,
  }, async () => {
    const resolution = resolvedInterpreter();
    let invocation;

    const exitCode = await main({
      resolveInterpreter: () => resolution,
      spawnProcess: (nodePath, argumentsList, options) => {
        invocation = { nodePath, argumentsList, options };
        return createClosingChild(0);
      },
      serverArguments: [],
      terminateOnSignal: false,
    });

    assert.equal(exitCode, 0);
    assert.equal(invocation.nodePath, resolution.path);
    assert.equal(invocation.argumentsList[0], SERVER_ENTRYPOINT_PATH);
    assert.match(invocation.argumentsList.join(' '), /mcp-code-mode\/mcp-server\/dist\/index\.js/);
    assert.equal(invocation.options.stdio, 'inherit');
  });

  // The refusal path must stop before a child process can be created.
  test('fails loudly and starts no server when resolution is unsatisfied', () => {
    const script = [
      `const { main } = require(${JSON.stringify(LAUNCHER_PATH)});`,
      `main({ resolveInterpreter: () => ({ path: null, range: ${JSON.stringify(REQUIRED_NODE_RANGE)}, reason: 'unsatisfied' }), spawnProcess: () => { process.stdout.write('SERVER_STARTED'); } }).then((exitCode) => process.exit(exitCode));`,
    ].join('\n');
    const result = spawnSync(process.execPath, ['-e', script], {
      cwd: REPOSITORY_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`no Node interpreter satisfies ${REQUIRED_NODE_RANGE.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`));
    assert.match(result.stderr, /resolution reason: unsatisfied/);
    assert.doesNotMatch(result.stdout, /SERVER_STARTED/);
  });

  test('returns the server exit status to the caller', {
    skip: INSTALLED_SERVER_SKIP,
  }, async () => {
    const resolution = resolvedInterpreter();
    const exitCode = await main({
      resolveInterpreter: () => resolution,
      spawnProcess: () => createClosingChild(37),
      serverArguments: [],
      terminateOnSignal: false,
    });

    assert.equal(exitCode, 37);
  });
});
