#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('node:child_process');
const { appendFileSync, existsSync, readFileSync, writeFileSync } = require('node:fs');
const { basename } = require('node:path');

const args = process.argv.slice(2);
const executableName = basename(process.argv[1] || '');

if (executableName === 'pkill') {
  const reapCapturePath = process.env.CLI_ADAPTER_REAP_CAPTURE;
  if (reapCapturePath) appendFileSync(reapCapturePath, `${JSON.stringify(args)}\n`, 'utf8');
  const systemPkill = ['/usr/bin/pkill', '/bin/pkill'].find((candidate) => existsSync(candidate));
  if (!systemPkill) process.exit(127);
  const result = spawnSync(systemPkill, args, { stdio: 'ignore' });
  process.exit(result.status ?? 1);
}

const mode = process.env.CLI_ADAPTER_SHIM_MODE || 'success';
const capturePath = process.env.CLI_ADAPTER_SHIM_CAPTURE;
const pidPath = process.env.CLI_ADAPTER_SHIM_PID_FILE;
const stdin = readFileSync(0, 'utf8');
const outputIndex = args.indexOf('-o');
const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : undefined;

function capture(extra = {}) {
  if (!capturePath) return;
  writeFileSync(capturePath, JSON.stringify({
    pid: process.pid,
    cwd: process.cwd(),
    args,
    stdin,
    env: {
      AI_SESSION_CHILD: process.env.AI_SESSION_CHILD || null,
      MK_SPEC_GATE_ENFORCE: process.env.MK_SPEC_GATE_ENFORCE || null,
      MK_SPEC_GATE_DISABLED: process.env.MK_SPEC_GATE_DISABLED || null,
    },
    ...extra,
  }));
}

function writeLastMessage(message) {
  if (outputPath) writeFileSync(outputPath, message, 'utf8');
}

if (args[0] === 'login' && args[1] === 'status') {
  capture({ preflight: 'auth' });
  process.stdout.write('Logged in\n');
  process.exit(0);
}

capture();

switch (mode) {
  case 'success':
    writeLastMessage('shim-success');
    process.stdout.write('completed\n');
    break;
  case 'auth-denial':
    process.stderr.write('401 Unauthorized: not authenticated\n');
    process.exitCode = 1;
    break;
  case 'model-not-found':
    process.stderr.write('model not found or insufficient balance\n');
    process.exitCode = 1;
    break;
  case 'rate-limit':
    process.stderr.write('429 rate limit: throttled\n');
    process.exitCode = 1;
    break;
  case 'stdin-wait':
    writeLastMessage(stdin.length > 0 ? 'stdin-closed' : 'stdin-closed-empty');
    break;
  case 'timeout':
    setInterval(() => {}, 1_000);
    break;
  case 'malformed-output':
    writeLastMessage('{not-json');
    break;
  case 'missing-artifact':
    process.stdout.write('completed-without-last-message\n');
    break;
  case 'non-zero':
    process.stderr.write('synthetic non-zero exit\n');
    process.exitCode = 23;
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
      const grandchildPid = Number(String(chunk).trim());
      if (pidPath) {
        writeFileSync(pidPath, JSON.stringify({
          root: process.pid,
          child: child.pid,
          grandchild: grandchildPid,
        }));
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
