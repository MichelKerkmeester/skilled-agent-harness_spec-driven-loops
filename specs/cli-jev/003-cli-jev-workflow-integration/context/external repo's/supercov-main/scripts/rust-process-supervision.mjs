import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(
  repository,
  `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`,
);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-supervision-'));

function waitFor(path, timeoutMs = 5_000) {
  const started = Date.now();
  return new Promise((resolveReady, reject) => {
    const poll = () => {
      if (existsSync(path)) return resolveReady();
      if (Date.now() - started >= timeoutMs)
        return reject(new Error(`timed out waiting for ${path}`));
      setTimeout(poll, 10);
    };
    poll();
  });
}

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === 'ESRCH') return false;
    throw error;
  }
}

async function waitForProcessExit(pid, timeoutMs = 5_000) {
  const started = Date.now();
  while (processExists(pid)) {
    if (Date.now() - started >= timeoutMs)
      throw new Error(`process ${pid} survived its Supercov supervisor`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
}

try {
  const touched = resolve(temporary, 'invalid-started');
  const invalid = spawnSync(
    binary,
    ['__supervise', '--', process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(touched)}, 'bad')`],
    {
      cwd: temporary,
      encoding: 'utf8',
      env: { ...process.env, SUPERCOV_COMMAND_TIMEOUT_MS: '1.5' },
    },
  );
  assert.equal(invalid.status, 2, invalid.stderr);
  assert.match(invalid.stderr, /positive integer number of milliseconds/);
  assert.equal(existsSync(touched), false, 'invalid configuration spawned the command');

  const timeout = spawnSync(
    binary,
    [
      '__supervise',
      '--',
      process.execPath,
      '-e',
      'setInterval(() => {}, 1000)',
      'private-argument-must-not-appear',
    ],
    {
      cwd: temporary,
      encoding: 'utf8',
      timeout: 10_000,
      env: {
        ...process.env,
        SUPERCOV_DIAGNOSTIC_INTERVAL_MS: '25',
        SUPERCOV_COMMAND_TIMEOUT_MS: '100',
      },
    },
  );
  assert.equal(timeout.status, 124, timeout.stderr);
  assert.match(timeout.stderr, /command still running after/);
  assert.match(timeout.stderr, /terminating process group/);
  assert.doesNotMatch(timeout.stderr, /private-argument-must-not-appear/);

  if (process.platform !== 'win32') {
    const ready = resolve(temporary, 'ready');
    const descendantReady = resolve(temporary, 'descendant-ready');
    const parentTerminated = resolve(temporary, 'parent-terminated');
    const descendantTerminated = resolve(temporary, 'descendant-terminated');
    const descendantProgram = [
      "const fs=require('node:fs')",
      `process.on('SIGTERM',()=>{fs.writeFileSync(${JSON.stringify(descendantTerminated)},'yes');process.exit(0)})`,
      `fs.writeFileSync(${JSON.stringify(descendantReady)},'yes')`,
      'setInterval(()=>{},1000)',
    ].join(';');
    const parentProgram = [
      "const fs=require('node:fs')",
      "const {spawn}=require('node:child_process')",
      `const child=spawn(process.execPath,['-e',${JSON.stringify(descendantProgram)}],{stdio:'ignore'})`,
      `process.on('SIGTERM',()=>{fs.writeFileSync(${JSON.stringify(parentTerminated)},'yes');setTimeout(()=>process.exit(0),100)})`,
      `fs.writeFileSync(${JSON.stringify(ready)},String(child.pid))`,
      'setInterval(()=>{},1000)',
    ].join(';');
    const supervised = spawn(
      binary,
      ['__supervise', '--', process.execPath, '-e', parentProgram],
      {
        cwd: temporary,
        stdio: ['ignore', 'ignore', 'pipe'],
        env: { ...process.env, SUPERCOV_DIAGNOSTIC_INTERVAL_MS: '60000' },
      },
    );
    let signalStderr = '';
    supervised.stderr.setEncoding('utf8');
    supervised.stderr.on('data', (chunk) => { signalStderr += chunk; });
    await waitFor(ready);
    await waitFor(descendantReady);
    supervised.kill('SIGTERM');
    const signalResult = await new Promise((resolveExit, reject) => {
      const safety = setTimeout(() => {
        supervised.kill('SIGKILL');
        reject(new Error(`signal forwarding hung: ${signalStderr}`));
      }, 10_000);
      supervised.once('exit', (code, signal) => {
        clearTimeout(safety);
        resolveExit({ code, signal });
      });
    });
    assert.deepEqual(signalResult, { code: 143, signal: null });
    assert.equal(readFileSync(parentTerminated, 'utf8'), 'yes');
    assert.equal(readFileSync(descendantTerminated, 'utf8'), 'yes');

    const killReady = resolve(temporary, 'kill-ready');
    const escaped = resolve(temporary, 'escaped-after-parent-kill');
    const killDescendantProgram = [
      "const fs=require('node:fs')",
      `setTimeout(()=>fs.writeFileSync(${JSON.stringify(escaped)},'escaped'),750)`,
      'setInterval(()=>{},1000)',
    ].join(';');
    const killParentProgram = [
      "const fs=require('node:fs')",
      "const {spawn}=require('node:child_process')",
      `const child=spawn(process.execPath,['-e',${JSON.stringify(killDescendantProgram)}],{stdio:'ignore'})`,
      `fs.writeFileSync(${JSON.stringify(killReady)},JSON.stringify({parent:process.pid,descendant:child.pid}))`,
      'setInterval(()=>{},1000)',
    ].join(';');
    const killedSupervisor = spawn(
      binary,
      ['__supervise', '--', process.execPath, '-e', killParentProgram],
      {
        cwd: temporary,
        stdio: 'ignore',
        env: { ...process.env, SUPERCOV_DIAGNOSTIC_INTERVAL_MS: '60000' },
      },
    );
    await waitFor(killReady);
    const killedTree = JSON.parse(readFileSync(killReady, 'utf8'));
    assert.equal(killedSupervisor.kill('SIGKILL'), true);
    await new Promise((resolveExit) => killedSupervisor.once('exit', resolveExit));
    await Promise.all([
      waitForProcessExit(killedTree.parent),
      waitForProcessExit(killedTree.descendant),
    ]);
    await new Promise((resolveWait) => setTimeout(resolveWait, 850));
    assert.equal(
      existsSync(escaped),
      false,
      'a descendant escaped after uncatchable Supercov supervisor death',
    );
  }

  console.log(
    `[rust-process-supervision] pre-spawn validation, sanitized diagnostics, explicit timeout 124${process.platform === 'win32' ? '' : ', cooperative full-tree signal forwarding, and SIGKILL parent-death containment'}`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
