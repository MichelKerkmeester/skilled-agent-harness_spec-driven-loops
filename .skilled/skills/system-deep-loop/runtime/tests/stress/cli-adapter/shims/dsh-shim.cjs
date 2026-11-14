#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: DeepSeek Harness CLI Adapter Shim
// ───────────────────────────────────────────────────────────────────
'use strict';

const { spawn } = require('node:child_process');
const {
  appendFileSync,
  lstatSync,
  realpathSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} = require('node:path');

const DSH_VERSION = '0.2.2-rc.3';
const SHIM_KIND = 'cli-deepseek-harness';

function readControl() {
  const controlPath = join(process.env.HOME || process.cwd(), '.cli-adapter-control.json');
  try {
    return JSON.parse(readFileSync(controlPath, 'utf8'));
  } catch {
    return {};
  }
}

function emitEvent(event) {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

function emitSession() {
  emitEvent({
    type: 'session',
    session_id: process.env.SPECKIT_FANOUT_LINEAGE_ID || 'shim-session',
  });
}

function emitStatus(message) {
  emitEvent({ type: 'status', message });
}

function isPathWithin(root, candidate) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === '' || (
    pathFromRoot !== '..'
    && !pathFromRoot.startsWith(`..${sep}`)
    && !isAbsolute(pathFromRoot)
  );
}

function safeWritePath(filePath, rootPath) {
  const root = realpathSync(rootPath);
  const parent = realpathSync(dirname(resolve(filePath)));
  if (!isPathWithin(root, parent)) {
    throw new Error('shim write path escapes its fixture root');
  }
  const target = join(parent, basename(filePath));
  if (!isPathWithin(root, target) || target === root) {
    throw new Error('shim write path escapes its fixture root');
  }
  try {
    if (lstatSync(target).isSymbolicLink()) {
      throw new Error('shim write path cannot be a symbolic link');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return target;
}

function lineageArtifactRoot(stateDir) {
  if (!stateDir) return null;
  const currentDir = realpathSync(process.cwd());
  const lineageDir = realpathSync(resolve(dirname(stateDir)));
  if (lineageDir !== currentDir) {
    throw new Error('shim lineage artifacts must stay in the current fixture directory');
  }
  return lineageDir;
}

function emitCompleted(message, artifactDir) {
  if (artifactDir) {
    writeFileSync(safeWritePath(join(artifactDir, 'research.md'), artifactDir), '# Shim research\n', 'utf8');
    writeFileSync(safeWritePath(join(artifactDir, 'review-report.md'), artifactDir), '# Shim review\n', 'utf8');
  }
  emitSession();
  emitStatus(message);
  emitEvent({ type: 'final', reason: { kind: 'completed' } });
}

function runDshShim() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--version') {
    process.stdout.write(`${DSH_VERSION}\n`);
    return;
  }

  const control = readControl();
  const mode = control.mode || process.env.CLI_ADAPTER_SHIM_MODE || 'success';
  const capturePath = control.capturePath || process.env.CLI_ADAPTER_SHIM_CAPTURE;
  const pidPath = control.pidPath || process.env.CLI_ADAPTER_SHIM_PID_FILE;
  const stdin = readFileSync(0, 'utf8');
  const stateDir = process.env.SPECKIT_DEEPSEEK_HARNESS_STATE_DIR;
  const fixtureRoot = dirname(realpathSync(process.env.HOME || process.cwd()));
  const safeCapturePath = capturePath ? safeWritePath(capturePath, fixtureRoot) : null;
  const safePidPath = pidPath ? safeWritePath(pidPath, fixtureRoot) : null;
  const artifactDir = lineageArtifactRoot(stateDir);

  function capture(extra = {}) {
    if (!safeCapturePath) return;
    appendFileSync(safeCapturePath, `${JSON.stringify({
      kind: SHIM_KIND,
      pid: process.pid,
      cwd: process.cwd(),
      args,
      stdin,
      env: {
        AI_SESSION_CHILD: process.env.AI_SESSION_CHILD || null,
        SYSTEM_SPEC_GATE_ENFORCE: process.env.SYSTEM_SPEC_GATE_ENFORCE || null,
        SYSTEM_SPEC_GATE_DISABLED: process.env.SYSTEM_SPEC_GATE_DISABLED || null,
        SPECKIT_FANOUT_LINEAGE_ID: process.env.SPECKIT_FANOUT_LINEAGE_ID || null,
      },
      ...extra,
    })}\n`, 'utf8');
  }

  function keylessFailure() {
    emitSession();
    emitStatus('provider credential missing');
    emitEvent({
      type: 'final',
      reason: {
        kind: 'error',
        error: { code: 'MISSING_CREDENTIAL' },
      },
    });
    process.exitCode = 1;
  }

  function errorEvent() {
    emitSession();
    emitStatus('request failed');
    emitEvent({
      type: 'error',
      error: {
        code: 'MODEL_NOT_FOUND',
        message: `${SHIM_KIND} model not found or insufficient balance`,
      },
    });
    emitEvent({ type: 'final', reason: { kind: 'completed' } });
  }

  function missingFinal() {
    emitSession();
    emitStatus('429 rate limit: throttled');
  }

  capture();
  if (safePidPath) writeFileSync(safePidPath, JSON.stringify({ root: process.pid }), 'utf8');

  switch (mode) {
    case 'success':
      emitCompleted('shim-success', artifactDir);
      break;
    case 'keyless-failure':
    case 'auth-denial':
      keylessFailure();
      break;
    case 'error-event':
    case 'model-not-found':
      errorEvent();
      break;
    case 'missing-final':
    case 'rate-limit':
      missingFinal();
      break;
    case 'stdin-wait':
      emitCompleted(`stdin-closed:${stdin.length}`, artifactDir);
      break;
    case 'timeout':
      emitSession();
      emitStatus('shim timeout');
      setInterval(() => {}, 1_000);
      break;
    case 'signal-exit':
      process.kill(process.pid, 'SIGTERM');
      break;
    case 'orphan-tree': {
      emitSession();
      emitStatus('shim orphan tree');
      const child = spawn(process.execPath, ['-e', [
        "const { spawn } = require('node:child_process');",
        "const grandchild = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });",
        "process.stdout.write(String(grandchild.pid) + '\\n');",
        'setInterval(() => {}, 1000);',
      ].join('')], { stdio: ['ignore', 'pipe', 'ignore'] });
      child.stdout.once('data', (chunk) => {
        const grandchildPid = Number(String(chunk).trim());
        if (safePidPath) {
          writeFileSync(safePidPath, JSON.stringify({
            root: process.pid,
            child: child.pid,
            grandchild: grandchildPid,
          }), 'utf8');
        }
        capture({ childPid: child.pid, grandchildPid });
      });
      setInterval(() => {}, 1_000);
      break;
    }
    default:
      process.stderr.write(`unknown shim mode: ${mode}\n`);
      process.exitCode = 64;
  }
}

runDshShim();
