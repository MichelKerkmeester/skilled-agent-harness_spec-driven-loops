#!/usr/bin/env node
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// MODULE: Skill advisor CLI versus MCP parity harness
// ─────────────────────────────────────────────────────────────────────────────
//
// The CLI front door and the MCP surface answer over different transports but
// must return the same payload for the same call. This harness drives a frozen
// case set through both, removes the fields that legitimately differ between
// two independent calls, and reports the remaining paths per case. A case whose
// every remaining path ends with an allowlisted suffix is reported as
// allowlisted rather than a divergence; any uncovered path keeps it differed.
// It measures and names a divergence; it never repairs one.

const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Every spawn and every JSON-RPC request is bounded so one hung backend cannot
// stall the whole run.
const CALL_TIMEOUT_MS = 30_000;

// Unix domain sockets reject paths beyond the sun_path limit on Darwin, which
// is 104 bytes, so the isolated socket directory stays deliberately short.
const ISOLATION_SOCKET_DIR = '/tmp/adv-parity';

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const cliEntry = path.join(repoRoot, '.opencode', 'bin', 'skill-advisor.cjs');
const mcpEntry = path.join(repoRoot, '.opencode', 'bin', 'system-skill-advisor-launcher.cjs');
const databaseSource = path.join(
  repoRoot, '.opencode', 'skills', 'system-skill-advisor', 'runtime', 'database', 'skill-graph.sqlite',
);
const inputsPath = path.join(
  repoRoot, 'specs', 'system-skill-advisor', '025-mcp-decommission-cli-front-door',
  '003-cli-front-door-parity', 'parity', 'frozen-inputs.json',
);
const defaultReportPath = path.join(
  repoRoot, 'specs', 'system-skill-advisor', '025-mcp-decommission-cli-front-door',
  '003-cli-front-door-parity', 'parity', 'report.json',
);

// The frozen case set stays machine-portable by carrying placeholders for the
// two values that depend on the run: the repository under test, and a prompt
// sized one character past the schema maximum.
const ARG_SUBSTITUTIONS = {
  '${WORKSPACE_ROOT}': repoRoot,
  '${LONG_PROMPT_10001}': 'a'.repeat(10_001),
};

const spawnedChildren = new Set();
let isolationEnv = null;
let isolationDbDir = null;
let cleanupStarted = false;

// ─────────────────────────────────────────────────────────────────────────────
// 2. SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// Success payloads are JSON on stdout; structured failures are JSON on stderr.
// Reading stdout first and stderr second keeps an error answer comparable
// instead of treating it as a missing payload.
function parsePayload(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

// The CLI parses flag values as JSON scalars, so a boolean or number reaches
// the tool as its typed value rather than as a string.
function cliFlagValue(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function stripVolatile(value, volatileKeys) {
  if (Array.isArray(value)) return value.map((entry) => stripVolatile(entry, volatileKeys));
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      if (volatileKeys.has(key)) continue;
      result[key] = stripVolatile(entry, volatileKeys);
    }
    return result;
  }
  return value;
}

// Paths are reported, not values, so a report stays stable while the payloads
// themselves contain machine-local state. The root marker is `$`.
function collectDiffPaths(left, right, at, out) {
  if (left === right) return;
  const leftIsObject = left !== null && typeof left === 'object';
  const rightIsObject = right !== null && typeof right === 'object';
  if (!leftIsObject || !rightIsObject || Array.isArray(left) !== Array.isArray(right)) {
    out.push(at);
    return;
  }
  if (Array.isArray(left)) {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const childPath = `${at}[${index}]`;
      if (index >= left.length || index >= right.length) {
        out.push(childPath);
        continue;
      }
      collectDiffPaths(left[index], right[index], childPath, out);
    }
    return;
  }
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    const childPath = at === '$' ? `$.${key}` : `${at}.${key}`;
    const inLeft = Object.prototype.hasOwnProperty.call(left, key);
    const inRight = Object.prototype.hasOwnProperty.call(right, key);
    if (!inLeft || !inRight) {
      out.push(childPath);
      continue;
    }
    collectDiffPaths(left[key], right[key], childPath, out);
  }
}

function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (exited) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.off('exit', onExit);
      resolve(exited);
    };
    const onExit = () => finish(true);
    const timer = setTimeout(() => finish(false), timeoutMs);
    child.once('exit', onExit);
  });
}

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return Boolean(error) && error.code === 'EPERM';
  }
}

function signalPid(pid, signal) {
  try {
    process.kill(pid, signal);
  } catch {
    // Already gone; cleanup stays idempotent.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROCESS TRACKING AND SHUTDOWN
// ─────────────────────────────────────────────────────────────────────────────

function trackChild(child) {
  spawnedChildren.add(child);
  child.once('exit', () => { spawnedChildren.delete(child); });
  return child;
}

async function stopChild(child, graceful) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  try { child.stdin.end(); } catch { /* stdin may already be closed */ }
  try {
    child.kill(graceful ? 'SIGTERM' : 'SIGKILL');
  } catch {
    return;
  }
  const exited = await waitForExit(child, graceful ? 3000 : 1000);
  if (!exited && child.exitCode === null && child.signalCode === null) {
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
    await waitForExit(child, 1000);
  }
}

// A mutating case must never reach the checked-in database. The isolated copy
// lives in a directory this script owns, and the socket directory moves with
// it so an isolated daemon can never be mistaken for the shared one.
function prepareIsolation() {
  fs.mkdirSync(ISOLATION_SOCKET_DIR, { recursive: true, mode: 0o700 });
  isolationDbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-parity-db-'));
  fs.copyFileSync(databaseSource, path.join(isolationDbDir, 'skill-graph.sqlite'));
  isolationEnv = {
    SPECKIT_IPC_SOCKET_DIR: ISOLATION_SOCKET_DIR,
    SYSTEM_SKILL_ADVISOR_DB_DIR: isolationDbDir,
  };
}

// The CLI starts its backend detached, so this harness removes the isolated
// backend through the lease files that backend wrote inside its own directory.
async function reapIsolatedBackend() {
  if (!isolationDbDir) return;
  const pids = new Set();
  for (const leaseFile of ['.system-skill-advisor-launcher.json', '.skill-advisor-owner.json']) {
    const lease = readJson(path.join(isolationDbDir, leaseFile));
    if (!lease) continue;
    for (const key of ['pid', 'childPid', 'ownerPid']) {
      if (Number.isInteger(lease[key]) && lease[key] > 0) pids.add(lease[key]);
    }
  }
  for (const pid of pids) signalPid(pid, 'SIGTERM');
  if (pids.size > 0) await sleep(1500);
  for (const pid of pids) {
    if (isPidAlive(pid)) signalPid(pid, 'SIGKILL');
  }
  await sleep(200);
  fs.rmSync(isolationDbDir, { recursive: true, force: true });
}

async function cleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  const children = [...spawnedChildren];
  for (const child of children) {
    try { child.stdin.end(); } catch { /* already closed */ }
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
  }
  await Promise.all(children.map((child) => waitForExit(child, 1000)));
  await reapIsolatedBackend();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE TWO SURFACES
// ─────────────────────────────────────────────────────────────────────────────

async function runCli(command, args, extraEnv) {
  const argv = [cliEntry, command, '--format', 'json'];
  for (const [key, value] of Object.entries(args || {})) {
    argv.push(`--${key}`, cliFlagValue(value));
  }
  const child = trackChild(childProcess.spawn(process.execPath, argv, {
    cwd: repoRoot,
    env: { ...process.env, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  }));
  let stdout = '';
  let stderr = '';
  let timedOut = false;
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const timer = setTimeout(() => {
    timedOut = true;
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
  }, CALL_TIMEOUT_MS);
  const exitCode = await new Promise((resolve) => {
    let settled = false;
    const finish = (code) => {
      if (settled) return;
      settled = true;
      resolve(code);
    };
    child.once('error', () => finish(-1));
    child.once('close', (code) => finish(code === null ? -1 : code));
  });
  clearTimeout(timer);
  return { exitCode, stdout, stderr, timedOut };
}

function createRpcClient(child, readStderr) {
  const pending = new Map();
  let nextId = 1;
  let buffer = '';
  let closed = false;

  const rejectAll = (error) => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    pending.clear();
  };

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    buffer += chunk;
    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      newlineIndex = buffer.indexOf('\n');
      if (!line) continue;
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        // Diagnostic lines can share stdout with the protocol; skip them.
        continue;
      }
      if (!message || !Object.prototype.hasOwnProperty.call(message, 'id')) continue;
      const entry = pending.get(message.id);
      if (!entry) continue;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.error) {
        entry.reject(new Error(`JSON-RPC ${message.error.code}: ${message.error.message}`));
      } else {
        entry.resolve(message.result);
      }
    }
  });

  child.once('exit', (code, signal) => {
    closed = true;
    const detail = readStderr().trim().split('\n').filter(Boolean).slice(-2).join(' | ');
    rejectAll(new Error(`backend exited (code=${code}, signal=${signal})${detail ? `: ${detail}` : ''}`));
  });
  child.once('error', (error) => {
    closed = true;
    rejectAll(error);
  });

  return {
    request(method, params) {
      if (closed) return Promise.reject(new Error('backend is not running'));
      const id = nextId;
      nextId += 1;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`${method} timed out after ${CALL_TIMEOUT_MS}ms`));
        }, CALL_TIMEOUT_MS);
        pending.set(id, { resolve, reject, timer });
        child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      });
    },
    notify(method, params) {
      if (closed) return;
      const frame = params === undefined
        ? { jsonrpc: '2.0', method }
        : { jsonrpc: '2.0', method, params };
      child.stdin.write(`${JSON.stringify(frame)}\n`);
    },
  };
}

function extractToolPayload(result) {
  if (result && Array.isArray(result.content)) {
    for (const entry of result.content) {
      if (entry && typeof entry.text === 'string') return parsePayload(entry.text);
    }
  }
  return result;
}

async function callMcp(command, args, extraEnv) {
  const child = trackChild(childProcess.spawn(process.execPath, [mcpEntry], {
    cwd: repoRoot,
    env: { ...process.env, ...extraEnv },
    stdio: ['pipe', 'pipe', 'pipe'],
  }));
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { stderr += chunk; });

  const isolated = Boolean(extraEnv && extraEnv.SYSTEM_SKILL_ADVISOR_DB_DIR);
  try {
    const rpc = createRpcClient(child, () => stderr);
    await rpc.request('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'parity-harness', version: '1' },
    });
    rpc.notify('notifications/initialized');
    const result = await rpc.request('tools/call', { name: command, arguments: args });
    return extractToolPayload(result);
  } finally {
    // A shared backend must not be signaled to shut down from a read-only run,
    // while an isolated backend owns private state and may exit gracefully.
    await stopChild(child, isolated);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CASE EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

// Replace placeholders in string argument values at any depth, before either
// surface is invoked. An unknown placeholder skips its case rather than being
// sent: a literal dollar-brace string would reach a backend as ordinary data,
// and the mismatch it produced would read as a transport divergence.
function substituteArgs(value, unresolvedTokens) {
  if (typeof value === 'string') {
    for (const token of value.match(/\$\{[^}]*\}/g) || []) {
      if (!Object.prototype.hasOwnProperty.call(ARG_SUBSTITUTIONS, token)) {
        unresolvedTokens.add(token);
      }
    }
    let result = value;
    for (const [token, replacement] of Object.entries(ARG_SUBSTITUTIONS)) {
      if (result.includes(token)) result = result.split(token).join(replacement);
    }
    return result;
  }
  if (Array.isArray(value)) return value.map((entry) => substituteArgs(entry, unresolvedTokens));
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = substituteArgs(entry, unresolvedTokens);
    }
    return result;
  }
  return value;
}

// A suffix names a difference class: a leaf path ends with `.cache.hit`, the root
// marker is `$`. A malformed entry is dropped, leaving its paths uncovered.
function allowlistIdsForPath(diffPath, allowlist) {
  const ids = [];
  for (const entry of allowlist) {
    if (diffPath.endsWith(entry.pathSuffix)) ids.push(entry.id);
  }
  return ids;
}

function readAllowlist(inputs) {
  const entries = Array.isArray(inputs.allowlist) ? inputs.allowlist : [];
  return entries
    .filter((entry) => entry && typeof entry.id === 'string' && typeof entry.pathSuffix === 'string')
    .map((entry) => ({ id: entry.id, pathSuffix: entry.pathSuffix }));
}

async function runCase(entry, volatileKeys, allowlist) {
  const id = String(entry.id ?? entry.command ?? 'case');
  const command = String(entry.command ?? '');
  const args = entry.args && typeof entry.args === 'object' ? entry.args : {};
  const extraEnv = entry.mutates === true && isolationEnv ? isolationEnv : {};
  const diffPaths = [];

  const unresolvedTokens = new Set();
  const resolvedArgs = substituteArgs(args, unresolvedTokens);
  if (unresolvedTokens.size > 0) {
    for (const token of unresolvedTokens) diffPaths.push(`<skipped:unresolved-token:${token}>`);
    return { id, command, match: false, diffPaths, cliExit: null };
  }

  const cliRun = await runCli(command, resolvedArgs, extraEnv);
  if (cliRun.timedOut) diffPaths.push('<cli-timeout>');
  let cliPayload = parsePayload(cliRun.stdout);
  if (cliPayload === undefined) cliPayload = parsePayload(cliRun.stderr);
  if (cliPayload === undefined) diffPaths.push('<cli-payload>');

  let mcpPayload;
  try {
    mcpPayload = await callMcp(command, resolvedArgs, extraEnv);
  } catch {
    diffPaths.push('<mcp-invocation>');
  }

  if (diffPaths.length === 0) {
    collectDiffPaths(
      stripVolatile(cliPayload, volatileKeys),
      stripVolatile(mcpPayload, volatileKeys),
      '$',
      diffPaths,
    );
  }

  const allowlistIds = [];
  let coveredByAllowlist = diffPaths.length > 0;
  for (const diffPath of diffPaths) {
    const ids = allowlistIdsForPath(diffPath, allowlist);
    if (ids.length === 0) coveredByAllowlist = false;
    for (const allowlistId of ids) {
      if (!allowlistIds.includes(allowlistId)) allowlistIds.push(allowlistId);
    }
  }
  const outcome = diffPaths.length === 0
    ? 'matched'
    : (coveredByAllowlist ? 'allowlisted' : 'differed');

  return {
    id,
    command,
    outcome,
    diffPaths,
    allowlistIds,
    cliExit: cliRun.exitCode,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

function parseHarnessArgv(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--report') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) throw new Error('--report requires a path');
      options.report = value;
      index += 1;
      continue;
    }
    const inline = token.match(/^--report=(.*)$/);
    if (inline) {
      if (!inline[1]) throw new Error('--report requires a path');
      options.report = inline[1];
      continue;
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return options;
}

async function main() {
  const options = parseHarnessArgv(process.argv.slice(2));
  const reportPath = options.report ? path.resolve(process.cwd(), options.report) : defaultReportPath;
  const inputs = readJson(inputsPath);
  if (!inputs || !Array.isArray(inputs.cases)) throw new Error(`unreadable parity input set: ${inputsPath}`);
  const volatileKeys = new Set(Array.isArray(inputs.volatileFields) ? inputs.volatileFields : []);
  const allowlist = readAllowlist(inputs);

  if (inputs.cases.some((entry) => entry && entry.mutates === true)) prepareIsolation();

  const results = [];
  try {
    for (const entry of inputs.cases) {
      results.push(await runCase(entry, volatileKeys, allowlist));
    }
  } finally {
    await cleanup();
  }

  const matched = results.filter((entry) => entry.outcome === 'matched').length;
  const allowlisted = results.filter((entry) => entry.outcome === 'allowlisted').length;
  const differed = results.length - matched - allowlisted;
  const report = {
    total: results.length,
    matched,
    allowlisted,
    differed,
    cases: results,
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(
    `parity: ${matched} matched, ${allowlisted} allowlisted, ${differed} differed\n`,
  );
  process.exitCode = report.differed === 0 ? 0 : 1;
}

process.on('exit', () => {
  for (const child of spawnedChildren) {
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
  }
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    cleanup().finally(() => process.exit(1));
  });
}

main().catch(async (error) => {
  process.stderr.write(`parity harness failed: ${error && error.message ? error.message : String(error)}\n`);
  await cleanup();
  process.exitCode = 2;
});
