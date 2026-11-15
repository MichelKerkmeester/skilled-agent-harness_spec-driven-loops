#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Mistral Vibe CLI Adapter Shim
// ───────────────────────────────────────────────────────────────────
'use strict';

const { spawn } = require('node:child_process');
const {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const { dirname, join } = require('node:path');

const VIBE_VERSION = '3.1.2';
const SHIM_KIND = 'cli-mistral-vibe';

function flagValue(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
}

function readControl() {
  const controlPath = join(process.env.HOME || process.cwd(), '.cli-adapter-control.json');
  try {
    return JSON.parse(readFileSync(controlPath, 'utf8'));
  } catch {
    return {};
  }
}

// An explicit VIBE_SHIM_EXIT wins so the direct command-shape cases can pin any status;
// the stress modes otherwise choose their own realistic fallback.
function shimExitCode(fallback) {
  const raw = process.env.VIBE_SHIM_EXIT;
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : fallback;
}

// Vibe's export record is the run's own verdict, so the shim writes one whose exit_code
// agrees with the process status it is about to report. A caller that suppresses the
// export exercises the adapter's "clean exit, no record" failure path.
function writeExport(outputDir, exitCode) {
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'export.json'), `${JSON.stringify({
    exit_code: exitCode,
    outcome: exitCode === 0 ? 'finished' : 'partial',
  }, null, 2)}\n`, 'utf8');
}

function runVibeShim() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--version') {
    process.stdout.write(`${VIBE_VERSION}\n`);
    return;
  }

  const control = readControl();
  const mode = control.mode || process.env.CLI_ADAPTER_SHIM_MODE || 'success';
  const capturePath = control.capturePath
    || process.env.CLI_ADAPTER_SHIM_CAPTURE
    || process.env.VIBE_SHIM_CAPTURE;
  const pidPath = control.pidPath || process.env.CLI_ADAPTER_SHIM_PID_FILE;
  const stdin = readFileSync(0, 'utf8');
  // The fan-out advertises the per-replica state dir one level below the lineage; a
  // direct call has no state dir and runs from the lineage itself.
  const stateDir = process.env.SPECKIT_MISTRAL_VIBE_STATE_DIR;
  const lineageDir = stateDir ? dirname(stateDir) : process.cwd();
  const outputDir = flagValue(args, '--output-dir');

  function capture(extra = {}) {
    if (!capturePath) return;
    appendFileSync(capturePath, `${JSON.stringify({
      kind: SHIM_KIND,
      pid: process.pid,
      cwd: process.cwd(),
      args,
      stdin,
      env: {
        VIBE_HOME: process.env.VIBE_HOME || null,
        MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || null,
        AI_SESSION_CHILD: process.env.AI_SESSION_CHILD || null,
        SYSTEM_SPEC_GATE_ENFORCE: process.env.SYSTEM_SPEC_GATE_ENFORCE || null,
        SYSTEM_SPEC_GATE_DISABLED: process.env.SYSTEM_SPEC_GATE_DISABLED || null,
        SPECKIT_FANOUT_LINEAGE_ID: process.env.SPECKIT_FANOUT_LINEAGE_ID || null,
        VIBE_SPEC_FOLDER: process.env.VIBE_SPEC_FOLDER || null,
        SPECKIT_DIST_AUTO_REBUILD: process.env.SPECKIT_DIST_AUTO_REBUILD || null,
      },
      ...extra,
    })}\n`, 'utf8');
  }

  function writeArtifacts() {
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(join(lineageDir, 'research.md'), '# Shim research\n', 'utf8');
    writeFileSync(join(lineageDir, 'review-report.md'), '# Shim review\n', 'utf8');
  }

  function finish(exitCode) {
    if (outputDir && process.env.VIBE_SHIM_NO_EXPORT !== '1') writeExport(outputDir, exitCode);
    process.exitCode = exitCode;
  }

  function diagnostic(message, fallbackExitCode) {
    const exitCode = shimExitCode(fallbackExitCode);
    process.stdout.write(`${message}\n`);
    process.stderr.write(`${message}\n`);
    finish(exitCode);
  }

  capture();
  if (pidPath) writeFileSync(pidPath, JSON.stringify({ root: process.pid }), 'utf8');

  switch (mode) {
    case 'success':
      writeArtifacts();
      finish(shimExitCode(0));
      process.stdout.write('shim-success\n');
      break;
    case 'auth-denial':
      diagnostic(`${SHIM_KIND} OAuth authentication unavailable`, 3);
      break;
    case 'model-not-found':
      diagnostic(`${SHIM_KIND} model not found or insufficient balance`, 3);
      break;
    case 'rate-limit':
      diagnostic(`${SHIM_KIND} 429 rate limit: throttled`, 3);
      break;
    case 'stdin-wait':
      writeArtifacts();
      finish(shimExitCode(0));
      process.stdout.write(`stdin-closed:${stdin.length}\n`);
      break;
    case 'timeout':
      setInterval(() => {}, 1_000);
      break;
    case 'signal-exit':
      process.kill(process.pid, 'SIGTERM');
      break;
    case 'orphan-tree': {
      const child = spawn(process.execPath, ['-e', [
        "const { spawn } = require('node:child_process');",
        "const grandchild = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });",
        "process.stdout.write(String(grandchild.pid) + '\\n');",
        'setInterval(() => {}, 1000);',
      ].join('')], { stdio: ['ignore', 'pipe', 'ignore'] });
      child.stdout.once('data', (chunk) => {
        const grandchild = Number(String(chunk).trim());
        if (pidPath) {
          writeFileSync(pidPath, JSON.stringify({
            root: process.pid,
            child: child.pid,
            grandchild,
          }), 'utf8');
        }
        capture({ childPid: child.pid, grandchildPid: grandchild });
      });
      setInterval(() => {}, 1_000);
      break;
    }
    default:
      diagnostic(`unknown shim mode: ${mode}`, 64);
  }
}

runVibeShim();
