#!/usr/bin/env node
'use strict';

const { spawn } = require('node:child_process');
const {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const { dirname, join } = require('node:path');

const STATE_ENV_BY_KIND = Object.freeze({
  'cli-opencode': 'SPECKIT_OPENCODE_STATE_DIR',
  'cli-pi': 'SPECKIT_PI_STATE_DIR',
  'cli-claude-code': 'SPECKIT_CLAUDE_CODE_STATE_DIR',
  'cli-devin': 'SPECKIT_DEVIN_STATE_DIR',
  'cli-cursor': 'SPECKIT_CURSOR_STATE_DIR',
});

function runAdapterShim(kind) {
  const args = process.argv.slice(2);
  const controlPath = join(process.env.HOME || process.cwd(), '.cli-adapter-control.json');
  let control = {};
  try {
    control = JSON.parse(readFileSync(controlPath, 'utf8'));
  } catch {
    control = {};
  }
  const mode = control.mode || process.env.CLI_ADAPTER_SHIM_MODE || 'success';
  const capturePath = control.capturePath || process.env.CLI_ADAPTER_SHIM_CAPTURE;
  const pidPath = control.pidPath || process.env.CLI_ADAPTER_SHIM_PID_FILE;
  const stdin = readFileSync(0, 'utf8');
  const stateDir = process.env[STATE_ENV_BY_KIND[kind]];
  const lineageDir = stateDir ? dirname(stateDir) : process.cwd();

  function capture(extra = {}) {
    if (!capturePath) return;
    appendFileSync(capturePath, `${JSON.stringify({
      kind,
      pid: process.pid,
      cwd: process.cwd(),
      args,
      stdin,
      env: {
        AI_SESSION_CHILD: process.env.AI_SESSION_CHILD || null,
        MK_SPEC_GATE_ENFORCE: process.env.MK_SPEC_GATE_ENFORCE || null,
        MK_SPEC_GATE_DISABLED: process.env.MK_SPEC_GATE_DISABLED || null,
        CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR || null,
        USER: process.env.USER || null,
        LOGNAME: process.env.LOGNAME || null,
        OPENCODE_API_KEY: process.env.OPENCODE_API_KEY || null,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || null,
        CLAUDE_CODE_SESSION_ID: process.env.CLAUDE_CODE_SESSION_ID || null,
        DEVIN_API_KEY: process.env.DEVIN_API_KEY || null,
        CURSOR_AUTH_TOKEN: process.env.CURSOR_AUTH_TOKEN || null,
      },
      ...extra,
    })}\n`, 'utf8');
  }

  function writeArtifacts() {
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(join(lineageDir, 'research.md'), '# Shim research\n', 'utf8');
    writeFileSync(join(lineageDir, 'review-report.md'), '# Shim review\n', 'utf8');
  }

  function diagnostic(message, exitCode = 1) {
    process.stdout.write(`${message}\n`);
    process.stderr.write(`${message}\n`);
    process.exitCode = exitCode;
  }

  capture();
  if (pidPath) writeFileSync(pidPath, JSON.stringify({ root: process.pid }), 'utf8');

  switch (mode) {
    case 'success':
      writeArtifacts();
      process.stdout.write(kind === 'cli-opencode'
        ? '{"type":"text","part":{"providerID":"shim","modelID":"success"}}\n'
        : 'shim-success\n');
      break;
    case 'auth-denial':
      diagnostic(`${kind} OAuth authentication unavailable`);
      break;
    case 'model-not-found':
      diagnostic(`${kind} model not found or insufficient balance`);
      break;
    case 'rate-limit':
      diagnostic(`${kind} 429 rate limit: throttled`);
      break;
    case 'stdin-wait':
      writeArtifacts();
      process.stdout.write(`stdin-closed:${stdin.length}\n`);
      break;
    case 'timeout':
      setInterval(() => {}, 1_000);
      break;
    case 'malformed-output':
      writeArtifacts();
      process.stdout.write('{not-json\n');
      break;
    case 'missing-artifact':
      process.stdout.write('completed-without-artifact\n');
      break;
    case 'non-zero-artifact':
      writeArtifacts();
      diagnostic(`${kind} provider diagnostic retained`, 23);
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

module.exports = { runAdapterShim };
