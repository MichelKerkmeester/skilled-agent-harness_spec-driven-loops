// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch CLI Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { specFolderFromSeed } = require('../lib/nudge.cjs');

const CLI_PATH = path.resolve(__dirname, '../bin/session-relaunch.cjs');
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop';
const CHILD_SPEC_FOLDER = `${SPEC_FOLDER}/001-claude-relaunch-loop`;
const SPEC_FOLDER_CASES = [
  { folder: 'specs/hooks/001-example', valid: true },
  { folder: CHILD_SPEC_FOLDER, valid: true },
  { folder: 'specs/hooks/session-relaunch', valid: false },
  { folder: 'specs/hooks/../001-example', valid: false },
];
const SPEC_FOLDER_SUFFIX = ` | Spec folder: ${SPEC_FOLDER}`
  + ' (carried from the handoff; Gate 3 answered in the sending session)';
const SKIP_SPEC_FOLDER_SUFFIX = ' | Spec folder: none'
  + ' (Gate 3 answered D, Skip, in the sending session)';
const SESSION_ID = 'session-cli-00000001';
const LOOP_ID = 'loop-cli-00000001';
const NOW = new Date('2026-10-16T12:00:00.000Z');

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-cli-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  const binDir = path.join(root, 'bin');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(binDir, { recursive: true });
  const psPath = path.join(binDir, 'ps');
  fs.writeFileSync(
    psPath,
    [
      '#!/bin/sh',
      'if [ -n "$SESSION_RELAUNCH_TEST_PS_SLEEP" ]; then sleep "$SESSION_RELAUNCH_TEST_PS_SLEEP"; fi',
      'if [ -n "$SESSION_RELAUNCH_TEST_RUNTIME_PID" ]; then',
      '  printf "%s %s node\\n" "$SESSION_RELAUNCH_TEST_RUNTIME_PID" "$SKILLED_LOOP_ID"',
      '  printf "%s %s bash\\n" "$SESSION_RELAUNCH_TEST_BUSY_PID" '
        + '"$SESSION_RELAUNCH_TEST_RUNTIME_PID"',
      '  printf "%s %s node\\n" "$PPID" "$SESSION_RELAUNCH_TEST_RUNTIME_PID"',
      'else',
      '  printf "%s\\n" "$SESSION_RELAUNCH_TEST_PS_OUTPUT"',
      'fi',
      'printf "%s\\n" "$SESSION_RELAUNCH_TEST_EXTRA_PS_OUTPUT"',
      'exit "${SESSION_RELAUNCH_TEST_PS_EXIT_CODE:-0}"',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  const env = {
    ...process.env,
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
    PATH: [binDir, process.env.PATH || ''].join(path.delimiter),
    SESSION_RELAUNCH_TEST_PS_OUTPUT: '',
    SESSION_RELAUNCH_TEST_PS_EXIT_CODE: '0',
    SESSION_RELAUNCH_TEST_PS_SLEEP: '',
    SESSION_RELAUNCH_TEST_RUNTIME_PID: '',
    SESSION_RELAUNCH_TEST_BUSY_PID: '',
    SESSION_RELAUNCH_TEST_EXTRA_PS_OUTPUT: '',
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_RUNTIME',
    'SKILLED_LOOP_NAME',
    'CLAUDE_PID',
    'CLAUDE_CODE_SESSION_ID',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SESSION_RELAUNCH_MAX_AGE_MIN',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, binDir, env };
}

function handoffText(
  status = 'open',
  specFolder = SPEC_FOLDER,
  claimedBy,
) {
  return [
    '---',
    `status: ${status}`,
    `session_id: ${SESSION_ID}`,
    ...(claimedBy === undefined ? [] : [`claimed_by: ${claimedBy}`]),
    `loop_id: ${LOOP_ID}`,
    'runtime: claude',
    `cwd: ${path.sep}tmp${path.sep}session-relaunch`,
    `spec_folder: ${specFolder}`,
    `created_at: ${NOW.toISOString()}`,
    '---',
    '## Goal',
    'Finish the relaunch loop.',
    '## Done',
    'The hook payloads are captured.',
    '## Remaining work',
    'Implement the core and adapters.',
    '## In-flight state',
    'No child process is running.',
  ].join('\n');
}

function handoffDirectory(sandbox) {
  return path.join(
    sandbox.repoRoot,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
  );
}

function writeHandoff(sandbox, {
  status = 'open',
  fileName = 'handoff.md',
  specFolder = SPEC_FOLDER,
  claimedBy,
} = {}) {
  const handoffPath = path.join(handoffDirectory(sandbox), fileName);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, handoffText(status, specFolder, claimedBy));
  return handoffPath;
}

function relaunchPath(sandbox, loopId = LOOP_ID) {
  return path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );
}

function writeRelaunchRecord(sandbox, record) {
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true });
  const filePath = relaunchPath(sandbox, record.loopId);
  fs.writeFileSync(filePath, JSON.stringify(record));
  return filePath;
}

function runCli(sandbox, args, env = sandbox.env) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: sandbox.repoRoot,
    env,
    encoding: 'utf8',
    timeout: 5000,
  });
}

function startRuntime(sandbox, script) {
  return new Promise((resolve, reject) => {
    const runtime = spawn(process.execPath, ['-e', script], {
      cwd: sandbox.repoRoot,
      env: sandbox.env,
      detached: true,
      stdio: 'ignore',
    });
    runtime.once('spawn', () => setTimeout(() => resolve(runtime), 150));
    runtime.once('error', reject);
  });
}

function stopProcessGroup(runtime) {
  if (!runtime || !runtime.pid) return;
  try {
    process.kill(-runtime.pid, 'SIGKILL');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

function startLoopAncestorPrepare(sandbox, t, { busyShell = false } = {}) {
  const runtimeSource = `
    const { spawn } = require('node:child_process');
    const environment = {
      ...process.env,
      PATH: process.env.TEST_REAL_PATH,
      SESSION_RELAUNCH_TEST_RUNTIME_PID: String(process.pid),
    };
    const startCli = () => {
      const cliEnvironment = {
        ...environment,
        SESSION_RELAUNCH_TEST_BUSY_PID: busy ? String(busy.pid) : '',
      };
      const cliShell = spawn(
        'bash',
        [
          '-c',
          '"$NODE_EXE" "$CLI_PATH" prepare --handoff "$HANDOFF_PATH" --session "$SESSION_ID"',
        ],
        { cwd: process.cwd(), env: cliEnvironment, stdio: ['ignore', 'pipe', 'pipe'] },
      );
      let stdout = '';
      let stderr = '';
      cliShell.stdout.on('data', (chunk) => { stdout += chunk; });
      cliShell.stderr.on('data', (chunk) => { stderr += chunk; });
      cliShell.on('close', (code, signal) => {
        if (busy && busy.exitCode === null) busy.kill('SIGKILL');
        process.stdout.write(JSON.stringify({ code, signal, stdout, stderr }));
        process.exitCode = code ?? 1;
      });
    };
    const busy = process.env.BUSY_SHELL === '1'
      ? spawn('bash', ['-c', 'sleep 30; true'], {
        cwd: process.cwd(), env: environment, stdio: 'ignore'
      })
      : null;
    if (busy) busy.once('spawn', startCli);
    else startCli();
  `;
  const wrapperSource = `
    const { spawn } = require('node:child_process');
    const environment = {
      ...process.env,
      SKILLED_LOOP_ID: String(process.pid),
      NODE_EXE: process.execPath,
      TEST_REAL_PATH: process.env.TEST_REAL_PATH,
      BUSY_SHELL: process.env.BUSY_SHELL
    };
    const runtime = spawn(process.execPath, ['-e', process.env.RUNTIME_SOURCE], {
      cwd: process.cwd(), env: environment, stdio: ['ignore', 'pipe', 'pipe']
    });
    runtime.stdout.pipe(process.stdout);
    runtime.stderr.pipe(process.stderr);
    runtime.on('close', (code, signal) => { process.exitCode = code ?? 1; });
  `;
  const wrapper = spawn(process.execPath, ['-e', wrapperSource], {
    cwd: sandbox.repoRoot,
    env: {
      ...sandbox.env,
      PATH: sandbox.env.PATH,
      TEST_REAL_PATH: sandbox.env.PATH,
      RUNTIME_SOURCE: runtimeSource,
      BUSY_SHELL: busyShell ? '1' : '0',
      CLI_PATH,
      HANDOFF_PATH: sandbox.handoffPath,
      SESSION_ID,
    },
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';
  wrapper.stdout.on('data', (chunk) => { stdout += chunk; });
  wrapper.stderr.on('data', (chunk) => { stderr += chunk; });
  const completed = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      stopProcessGroup(wrapper);
      reject(new Error('loop ancestor process chain did not exit'));
    }, 7000);
    wrapper.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    wrapper.once('close', (code, signal) => {
      clearTimeout(timer);
      let report = null;
      try {
        report = JSON.parse(stdout);
      } catch {}
      resolve({ code, signal, stdout, stderr, report });
    });
  });
  t.after(() => stopProcessGroup(wrapper));
  return completed;
}

test('prepare exits zero under the loop with a Claude process that has no children', async (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const runtime = await startRuntime(sandbox, 'setInterval(() => {}, 1000);');
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_HOPS = '2';
  sandbox.env.SKILLED_LOOP_NAME = 'named-session';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(runtime.pid);
  try {
    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
    assert.equal(result.status, 0, result.stderr);
    const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
    assert.equal(record.status, 'pending');
    assert.equal(record.hops, 2);
    assert.equal(record.name, 'named-session');
  } finally {
    stopProcessGroup(runtime);
  }
});

// A runtime that surfaces stdout but not the exit status leaves a silent success looking
// like a command that never ran, so the run that arms the record also says so.
test('prepare under the loop prints the prepared handoff and the stop instruction', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    '[session-relaunch] handoff prepared; stop now and end this turn.'
      + ' The loop ends this session when it goes idle and a fresh session continues from '
      + `${handoffPath}.\n`,
  );
});

// A record written past the hop cap can only be declined by the wrapper, yet its killer
// still ends the session, so prepare has to decline before it arms anything.
test('prepare declines at the hop limit without writing a relaunch record', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_HOPS = '1';
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '1';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 3, result.stderr);
  assert.ok(
    result.stdout.includes(
      '[session-relaunch] hop limit reached; continue in this session'
        + ' (auto-compaction remains the fallback)',
    ),
    result.stdout,
  );
  assert.ok(
    result.stdout.includes(
      'skilled-loop claude "[session-relaunch] claim and continue handoff '
        + `${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
    ),
    result.stdout,
  );
  assert.equal(fs.existsSync(relaunchPath(sandbox)), false);
  const log = fs.readFileSync(
    path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log'),
    'utf8',
  );
  assert.match(log, new RegExp(`prepare-declined loopId=${LOOP_ID} reason=hop-cap`));
  assert.match(fs.readFileSync(handoffPath, 'utf8'), /^status: open$/m);
});

test('prepare still arms a pending record below the hop limit', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_HOPS = '0';
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '1';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 0, result.stderr);
  const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
  assert.equal(record.status, 'pending');
  assert.equal(record.hops, 0);
});

test('prepare records the runtime from SKILLED_LOOP_RUNTIME', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'pi';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ]);

  assert.equal(result.status, 0, result.stderr);
  const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
  assert.equal(record.runtime, 'pi');
});

test('prepare requires --session for Codex despite a Claude session env', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /session id is required through --session/);
});

test('prepare accepts every runtime the wrapper can launch', (t) => {
  for (const runtime of ['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin']) {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.SKILLED_LOOP_RUNTIME = runtime;
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(process.pid);

    const result = runCli(sandbox, [
      'prepare',
      '--handoff',
      handoffPath,
      '--session',
      SESSION_ID,
    ]);

    assert.equal(result.status, 0, `${runtime}: ${result.stderr}`);
    const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
    assert.equal(record.runtime, runtime);
  }
});

test('prepare exits two for an unknown SKILLED_LOOP_RUNTIME', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'unknown';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /SKILLED_LOOP_RUNTIME/);
});

test('prepare succeeds when its result log cannot be written', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const stateDirectory = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(path.join(stateDirectory, 'relaunch.log'), { recursive: true });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8')).status, 'pending');
});

test('prepare exits two for an invalid handoff note', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { status: 'claimed' });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = 'not-a-pid';
  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /handoff status must be open, found claimed/);
});

test('prepare exits two when CLAUDE_PID has a live bash child', async (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const runtimeScript = [
    "const { spawn } = require('node:child_process');",
    "const child = spawn('bash', ['-c', 'sleep 30; wait'], { stdio: 'ignore' });",
    'setInterval(() => {}, 1000);',
  ].join(' ');
  const runtime = await startRuntime(sandbox, runtimeScript);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(runtime.pid);
  sandbox.env.SESSION_RELAUNCH_TEST_PS_OUTPUT = [
    String(runtime.pid + 1),
    String(runtime.pid),
    '/bin/bash',
  ].join(' ');
  try {
    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /child|shell|busy/i);
  } finally {
    stopProcessGroup(runtime);
  }
});

for (const shellCommand of ['fish', '-zsh']) {
  test(`prepare exits two for a live ${shellCommand} child of the Claude process`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    const runtimePid = 900001;
    const childPid = 900002;
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(runtimePid);
    sandbox.env.SESSION_RELAUNCH_TEST_PS_OUTPUT = [
      `${runtimePid} 1 node`,
      `${childPid} ${runtimePid} ${shellCommand}`,
    ].join('\n');

    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

    assert.equal(result.status, 2, result.stderr);
    assert.ok(
      result.stderr.includes(`live shell child (${shellCommand}, pid ${childPid})`),
      result.stderr,
    );
  });
}

test('prepare ignores an inherited Claude shell child for a Codex loop', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = '424242';
  sandbox.env.SESSION_RELAUNCH_TEST_EXTRA_PS_OUTPUT = [
    '424242 1 node',
    '424243 424242 bash',
  ].join('\n');

  const result = await startLoopAncestorPrepare(sandbox, t);

  assert.equal(result.report?.code, 0, result.stderr || result.stdout);
  const stateDirectory = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  const stateFile = fs.readdirSync(stateDirectory)
    .find((name) => /^relaunch-\d+\.json$/.test(name));
  assert.ok(stateFile, 'prepare should write the loop record');
  const record = JSON.parse(fs.readFileSync(path.join(stateDirectory, stateFile), 'utf8'));
  assert.equal(record.runtime, 'codex');
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  assert.doesNotMatch(fs.readFileSync(logPath, 'utf8'), /running-work-check-skipped/);
});

test('prepare refuses a live shell child of the Codex loop runtime', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = await startLoopAncestorPrepare(sandbox, t, { busyShell: true });

  assert.equal(result.report?.code, 2, result.stderr || result.stdout);
  assert.match(result.report?.stderr || '', /Codex still has a live shell child \(bash/);
});

test('prepare names the runtime when ps fails', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SESSION_RELAUNCH_TEST_PS_EXIT_CODE = '1';

  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /could not inspect Codex child processes: ps exited 1/);
});

test('prepare gives up on a hung ps instead of stalling the hook', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SESSION_RELAUNCH_TEST_PS_SLEEP = '8';

  const startedAt = Date.now();
  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ]);
  const elapsed = Date.now() - startedAt;

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /could not inspect Codex child processes: spawnSync ps/);
  assert.ok(elapsed < 4000, `the ps read must be bounded, took ${elapsed}ms`);
});

test('prepare refuses a live shell child without CLAUDE_PID', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_HOPS = '0';
  const result = await startLoopAncestorPrepare(sandbox, t, { busyShell: true });
  assert.equal(result.report?.code, 2, result.stderr || result.stdout);
  assert.match(result.report?.stderr || '', /live shell child \(bash/);
});

test('prepare logs running-work-check-skipped when SKILLED_LOOP_ID has no ancestor', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const loopId = '987654321';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 0, result.stderr);
  assert.match(fs.readFileSync(logPath, 'utf8'), /running-work-check-skipped/);
});

test('prepare exits three outside the loop and prints the manual claim command', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = 'not-a-pid';
  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  const manualCommand = [
    'skilled-loop claude "[session-relaunch] ',
    `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
  ].join('');
  assert.equal(result.status, 3, result.stderr);
  assert.ok(result.stdout.includes(manualCommand), result.stdout);
});

for (const { label, specFolder } of [
  { label: 'none', specFolder: 'none' },
  { label: 'empty', specFolder: '' },
]) {
  test(`prepare carries the ${label} answer in the exit-three command`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { specFolder });
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = 'not-a-pid';
    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
    const suffix = specFolder === 'none' ? SKIP_SPEC_FOLDER_SUFFIX : '';
    const manualCommand = `skilled-loop claude "[session-relaunch] claim and continue handoff `
      + `${handoffPath}${suffix}"`;

    assert.equal(result.status, 3, result.stderr);
    assert.equal(result.stdout, `${manualCommand}\n`);
  });
}

test('prepare outside the loop refuses a spec folder it cannot carry', (t) => {
  const sandbox = createSandbox(t);
  const oldPath = writeHandoff(sandbox, {
    status: 'claimed',
    fileName: 'old.md',
    claimedBy: SESSION_ID,
  });
  const handoffPath = writeHandoff(sandbox, {
    fileName: 'new.md',
    specFolder: '../escape',
  });
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /spec_folder/);
  assert.match(result.stderr, /repo-relative packet path, none, or empty/);
  assert.equal(result.stdout, '');
  assert.match(fs.readFileSync(oldPath, 'utf8'), /^status: claimed$/m);
});

test('prepare under the loop refuses a spec folder it cannot carry', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: '../escape' });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /spec_folder/);
  assert.match(result.stderr, /repo-relative packet path, none, or empty/);
  assert.equal(fs.existsSync(relaunchPath(sandbox)), false);
});

for (const { label, specFolder } of [
  { label: 'parent packet path', specFolder: SPEC_FOLDER },
  { label: 'child packet path', specFolder: CHILD_SPEC_FOLDER },
  { label: 'none', specFolder: 'none' },
  { label: 'empty', specFolder: '' },
]) {
  test(`prepare under the loop accepts a ${label} spec folder answer`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { specFolder });
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(process.pid);

    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

    assert.equal(result.status, 0, result.stderr);
    const record = JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8'));
    assert.equal(record.status, 'pending');
  });
}

for (const { folder, valid } of SPEC_FOLDER_CASES) {
  test(`nudge and CLI agree on the spec folder ${folder}`, (t) => {
    const seed = `[session-relaunch] claim /tmp/handoff.md | Spec folder: ${folder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)';
    assert.equal(specFolderFromSeed(seed), valid ? folder : '');

    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { specFolder: folder });
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(process.pid);

    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

    assert.equal(result.status, valid ? 0 : 2, result.stderr);
  });
}

for (const specFolder of [
  'specs/hooks/session-relaunch',
  'specs/hooks',
  'specs/hooks/23-x',
]) {
  test(`prepare under the loop rejects ${specFolder}`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { specFolder });
    sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(process.pid);

    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /spec_folder/);
    assert.equal(fs.existsSync(relaunchPath(sandbox)), false);
  });
}

test('prepare resolves an absolute note under the CLI repository from a subdirectory', (t) => {
  const sandbox = createSandbox(t);
  sandbox.repoRoot = fs.realpathSync(sandbox.repoRoot);
  const copiedCli = path.join(
    sandbox.repoRoot,
    '.skilled',
    'hooks',
    'session-relaunch',
    'bin',
    'session-relaunch.cjs',
  );
  const copiedCore = path.join(
    sandbox.repoRoot,
    '.skilled',
    'hooks',
    'session-relaunch',
    'lib',
    'relaunch-core.cjs',
  );
  const copiedNudge = path.join(
    sandbox.repoRoot,
    '.skilled',
    'hooks',
    'session-relaunch',
    'lib',
    'nudge.cjs',
  );
  const copiedHookFlags = path.join(
    sandbox.repoRoot,
    '.skilled',
    'hooks',
    'shared',
    'hook-flags.cjs',
  );
  const copiedEnvAliases = path.join(
    sandbox.repoRoot,
    '.skilled',
    'hooks',
    'shared',
    'env-aliases.cjs',
  );
  fs.mkdirSync(path.dirname(copiedCli), { recursive: true });
  fs.mkdirSync(path.dirname(copiedCore), { recursive: true });
  fs.mkdirSync(path.dirname(copiedHookFlags), { recursive: true });
  fs.copyFileSync(CLI_PATH, copiedCli);
  fs.copyFileSync(path.resolve(__dirname, '../lib/relaunch-core.cjs'), copiedCore);
  fs.copyFileSync(path.resolve(__dirname, '../lib/nudge.cjs'), copiedNudge);
  fs.copyFileSync(path.resolve(__dirname, '../../shared/hook-flags.cjs'), copiedHookFlags);
  fs.copyFileSync(
    path.resolve(__dirname, '../../shared/env-aliases.cjs'),
    copiedEnvAliases,
  );
  const handoffPath = writeHandoff(sandbox);
  const subdirectory = path.join(sandbox.repoRoot, 'nested', 'working-directory');
  fs.mkdirSync(subdirectory, { recursive: true });
  const environment = { ...sandbox.env };
  delete environment.SESSION_RELAUNCH_REPO_ROOT;
  environment.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  environment.CLAUDE_PID = 'not-a-pid';
  const result = spawnSync(process.execPath, [
    copiedCli,
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ], {
    cwd: subdirectory,
    env: environment,
    encoding: 'utf8',
    timeout: 5000,
  });

  assert.equal(result.status, 3, result.stderr);
  assert.equal(result.stdout, [
    'skilled-loop claude "[session-relaunch] claim and continue handoff ',
    `${handoffPath}${SPEC_FOLDER_SUFFIX}"\n`,
  ].join(''));
});

test('prepare supersedes claimed notes under the loop and exits zero', (t) => {
  const sandbox = createSandbox(t);
  const oldPaths = [
    writeHandoff(sandbox, {
      status: 'claimed',
      fileName: 'old-one.md',
      claimedBy: SESSION_ID,
    }),
    writeHandoff(sandbox, {
      status: 'claimed',
      fileName: 'old-two.md',
      claimedBy: SESSION_ID,
    }),
  ];
  const handoffPath = writeHandoff(sandbox, { fileName: 'new.md' });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 0, result.stderr);
  oldPaths.forEach((oldPath) => {
    const oldNote = fs.readFileSync(oldPath, 'utf8');
    assert.match(oldNote, /^status: done$/m);
    assert.match(oldNote, /^completed_at: .+$/m);
    assert.match(oldNote, /^superseded_by: new\.md$/m);
  });
  const supersededLines = fs.readFileSync(logPath, 'utf8')
    .trimEnd()
    .split('\n')
    .filter((line) => / superseded(?: |$)/.test(line));
  assert.equal(supersededLines.length, oldPaths.length);
});

test('prepare supersedes claimed notes outside the loop and exits three', (t) => {
  const sandbox = createSandbox(t);
  const oldPath = writeHandoff(sandbox, {
    status: 'claimed',
    fileName: 'old.md',
    claimedBy: SESSION_ID,
  });
  const handoffPath = writeHandoff(sandbox, { fileName: 'new.md' });
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 3, result.stderr);
  assert.match(fs.readFileSync(oldPath, 'utf8'), /^status: done$/m);
  assert.match(fs.readFileSync(oldPath, 'utf8'), /^superseded_by: new\.md$/m);
  assert.equal(
    fs.readFileSync(logPath, 'utf8').split('\n')
      .filter((line) => / superseded(?: |$)/.test(line)).length,
    1,
  );
});

test('prepare refusal leaves claimed notes untouched', (t) => {
  const sandbox = createSandbox(t);
  const oldPath = writeHandoff(sandbox, {
    status: 'claimed',
    fileName: 'old.md',
    claimedBy: SESSION_ID,
  });
  const handoffPath = writeHandoff(sandbox, { fileName: 'new.md' });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = 'not-a-pid';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 2, result.stderr);
  assert.match(fs.readFileSync(oldPath, 'utf8'), /^status: claimed$/m);
  assert.equal(fs.existsSync(logPath), false);
});

test('prepare names the selected runtime in its exit-three command', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'opencode';

  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ]);
  const manualCommand = [
    'skilled-loop opencode --prompt "[session-relaunch] ',
    `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
  ].join('');

  assert.equal(result.status, 3, result.stderr);
  assert.ok(result.stdout.includes(manualCommand), result.stdout);
});

test('prepare prints the hermes chat form as its exit-three command', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'hermes';

  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
  ]);
  const manualCommand = [
    'skilled-loop hermes chat -q "[session-relaunch] ',
    `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
  ].join('');

  assert.equal(result.status, 3, result.stderr);
  assert.equal(result.stdout, `${manualCommand}\n`);
});

test('prepare --runtime hermes prints the hermes manual claim command', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);

  const result = runCli(sandbox, [
    'prepare',
    '--handoff',
    handoffPath,
    '--session',
    SESSION_ID,
    '--runtime',
    'hermes',
  ]);
  const manualCommand = [
    'skilled-loop hermes chat -q "[session-relaunch] ',
    `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
  ].join('');

  assert.equal(result.status, 3, result.stderr);
  assert.equal(result.stdout, `${manualCommand}\n`);
});

test('prepare exits two for an unknown --runtime value', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--runtime', 'bogus']);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /--runtime must be one of/);
});

test('prepare exits two when --runtime conflicts with the loop runtime', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--runtime', 'hermes']);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /--runtime hermes conflicts with SKILLED_LOOP_RUNTIME codex/);
});

test('should-relaunch exits zero and prints JSON for an armed fresh record', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  writeRelaunchRecord(sandbox, {
    version: 1,
    status: 'armed',
    loopId: LOOP_ID,
    handoff: handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: 'cli-session',
    cwd: sandbox.repoRoot,
    hops: 1,
    armedAt: new Date().toISOString(),
  });
  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout.trim(), /^\{.*\}$/);
  const output = JSON.parse(result.stdout.trim());
  assert.deepEqual(output, {
    relaunch: true,
    reason: null,
    cwd: sandbox.repoRoot,
    handoff: handoffPath,
    name: 'cli-session',
    runtime: 'claude',
    hops: 1,
  });
});

test('should-relaunch exits one and prints the pending decline reason as JSON', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, { version: 1, status: 'pending', loopId: LOOP_ID, hops: 0 });
  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout.trim(), /^\{.*\}$/);
  assert.equal(JSON.parse(result.stdout.trim()).reason, 'not-armed');
});

test('should-relaunch prints no-file JSON when the runtime directory is a file', (t) => {
  const sandbox = createSandbox(t);
  const runtimeFile = path.join(sandbox.root, 'runtime-file');
  fs.writeFileSync(runtimeFile, 'not a directory');
  const env = { ...sandbox.env, XDG_RUNTIME_DIR: runtimeFile };

  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID], env);
  const lines = result.stdout.trim().split(/\r?\n/);

  assert.equal(result.status, 1, result.stderr);
  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    relaunch: false,
    reason: 'no-file',
    cwd: null,
    handoff: null,
    name: null,
    runtime: null,
    hops: null,
  });
});

test('claim exits zero and prints the claimed note body', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const result = runCli(sandbox, ['claim', handoffPath, '--session', SESSION_ID]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Finish the relaunch loop/);
  assert.match(fs.readFileSync(handoffPath, 'utf8'), /^status: claimed$/m);
});

test('claim requires --session for Codex despite a Claude session env', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'codex';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = runCli(sandbox, ['claim', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /session id is required through --session/);
  assert.match(fs.readFileSync(handoffPath, 'utf8'), /^status: open$/m);
});

test('complete exits zero for a claimed note', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { status: 'claimed' });
  const result = runCli(sandbox, ['complete', handoffPath]);
  assert.equal(result.status, 0, result.stderr);
});

test('claim --help prints the claim usage on stdout and exits zero', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['claim', '--help']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /claim <handoff-path> \[--session <session-id>\]/);
  assert.equal(result.stderr, '');
});

test('-h after a subcommand prints the full usage listing', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['prepare', '-h']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /prepare --handoff <handoff-path>/);
  assert.match(result.stdout, /consume --loop-id <loop-id>/);
});

// Both declines print the same claim command and exit 3, so the summary has to name
// the hop limit beside the outside-a-loop case or a reader takes one path for both.
test('prepare usage names the outside-a-loop and hop-limit declines', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['prepare', '-h']);

  assert.equal(result.status, 0, result.stderr);
  const summary = result.stdout
    .split('\n')
    .find((line) => line.includes('Validate the note and arm the relaunch'));
  assert.ok(summary, result.stdout);
  assert.match(summary, /outside a loop/);
  assert.match(summary, /hop limit/);
  assert.match(summary, /exits 3/);
});

test('no subcommand prints every subcommand syntax on stdout and exits zero', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, []);

  assert.equal(result.status, 0, result.stderr);
  for (const syntax of [
    'prepare --handoff <handoff-path>',
    'should-relaunch --loop-id <loop-id>',
    'claim <handoff-path>',
    'complete <handoff-path>',
    'consume --loop-id <loop-id>',
  ]) {
    assert.ok(result.stdout.includes(syntax), `${syntax}: ${result.stdout}`);
  }
});

test('an unknown subcommand exits two and lists the commands on stderr', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['claaim', 'x']);

  assert.equal(result.status, 2);
  assert.match(
    result.stderr,
    /command must be prepare, should-relaunch, claim, complete, or consume/,
  );
  assert.match(result.stderr, /claim <handoff-path>/);
  assert.equal(result.stdout, '');
});

test('complete names its usage line for an option it does not take', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['complete', '--handoff', 'x']);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /unknown option --handoff/);
  assert.match(result.stderr, /complete <handoff-path>/);
  assert.doesNotMatch(result.stderr, /Usage: node /);
});

test('should-relaunch prints one no-file JSON line for a corrupt record', (t) => {
  const sandbox = createSandbox(t);
  const filePath = relaunchPath(sandbox);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '{invalid');

  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  const lines = result.stdout.trim().split(/\r?\n/);
  assert.equal(result.status, 1, result.stderr);
  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    relaunch: false,
    reason: 'no-file',
    cwd: null,
    handoff: null,
    name: null,
    runtime: null,
    hops: null,
  });
});

test('should-relaunch accepts zero max hops and defaults invalid values', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const armedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  writeRelaunchRecord(sandbox, {
    status: 'armed',
    loopId: LOOP_ID,
    handoff: handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
    armedAt,
  });
  const args = ['should-relaunch', '--loop-id', LOOP_ID];

  const zeroResult = runCli(sandbox, args, {
    ...sandbox.env,
    SESSION_RELAUNCH_MAX_HOPS: '0',
  });
  assert.equal(zeroResult.status, 1, zeroResult.stderr);
  assert.equal(JSON.parse(zeroResult.stdout).reason, 'hop-cap');

  for (const value of [undefined, '', '-1', 'invalid']) {
    const env = { ...sandbox.env };
    if (value === undefined) delete env.SESSION_RELAUNCH_MAX_HOPS;
    else env.SESSION_RELAUNCH_MAX_HOPS = value;
    const result = runCli(sandbox, args, env);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).relaunch, true);
  }
});

test('should-relaunch accepts zero max age and defaults invalid values', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const armedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  writeRelaunchRecord(sandbox, {
    status: 'armed',
    loopId: LOOP_ID,
    handoff: handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
    armedAt,
  });
  const args = ['should-relaunch', '--loop-id', LOOP_ID];

  const zeroResult = runCli(sandbox, args, {
    ...sandbox.env,
    SESSION_RELAUNCH_MAX_AGE_MIN: '0',
  });
  assert.equal(zeroResult.status, 1, zeroResult.stderr);
  assert.equal(JSON.parse(zeroResult.stdout).reason, 'stale');

  for (const value of [undefined, '', '-1', 'invalid']) {
    const env = { ...sandbox.env };
    if (value === undefined) delete env.SESSION_RELAUNCH_MAX_AGE_MIN;
    else env.SESSION_RELAUNCH_MAX_AGE_MIN = value;
    const result = runCli(sandbox, args, env);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).relaunch, true);
  }
});

test('consume exits zero and removes the relaunch file', (t) => {
  const sandbox = createSandbox(t);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(filePath), false);
});

test('consume returns the handoff path and its spec folder', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    handoff: handoffPath,
    spec_folder: SPEC_FOLDER,
    note: 'open',
  });
  assert.equal(fs.existsSync(filePath), false);
});

test('consume preserves a Gate 3 Skip as a valid spec-folder value', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: 'none' });
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    handoff: handoffPath,
    spec_folder: 'none',
    note: 'open',
  });
  assert.equal(fs.existsSync(filePath), false);
  assert.equal(fs.existsSync(logPath), false);
});

test('consume leaves an empty spec folder unanswered without logging a drop', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: '' });
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: handoffPath, spec_folder: '', note: 'open' });
  assert.equal(fs.existsSync(logPath), false);
});

test('consume drops a spec folder invalidated after prepare', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: CHILD_SPEC_FOLDER });
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(process.pid);

  const prepareResult = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
  assert.equal(prepareResult.status, 0, prepareResult.stderr);

  fs.writeFileSync(
    handoffPath,
    fs.readFileSync(handoffPath, 'utf8').replace(
      `spec_folder: ${CHILD_SPEC_FOLDER}`,
      'spec_folder: specs/hooks/session-relaunch',
    ),
  );

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  const logLines = fs.existsSync(logPath)
    ? fs.readFileSync(logPath, 'utf8').trimEnd().split(/\r?\n/)
    : [];

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: handoffPath, spec_folder: '', note: 'open' });
  assert.equal(
    logLines.filter((line) => /\sspec-folder-dropped(?:\s|$)/.test(line)).length,
    1,
  );
});

test('consume logs a spec folder carried by any frontmatter line', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const malformedHandoff = fs.readFileSync(handoffPath, 'utf8')
    .replace(
      `spec_folder: ${SPEC_FOLDER}`,
      'spec_folder:\nspec_folder: specs/x\nunparseable frontmatter',
    );
  fs.writeFileSync(handoffPath, malformedHandoff);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  const logLines = fs.existsSync(logPath)
    ? fs.readFileSync(logPath, 'utf8').trimEnd().split(/\r?\n/)
    : [];

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: handoffPath, spec_folder: '', note: 'invalid' });
  assert.equal(
    logLines.filter((line) => /\sspec-folder-dropped(?:\s|$)/.test(line)).length,
    1,
  );
  assert.equal(fs.existsSync(filePath), false);
});

test('prepare logs supersede-failed when the handoffs directory cannot be read', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const script = [
    "const fs = require('node:fs');",
    'const realReaddirSync = fs.readdirSync;',
    'fs.readdirSync = function (target, ...args) {',
    "  if (String(target).endsWith('handoffs')) {",
    "    const error = new Error('permission denied');",
    "    error.code = 'EACCES';",
    '    throw error;',
    '  }',
    '  return realReaddirSync.call(this, target, ...args);',
    '};',
    `process.exitCode = require(${JSON.stringify(CLI_PATH)}).main(`,
    "  ['prepare', '--handoff', process.env.HANDOFF_PATH],",
    ');',
    '',
  ].join('\n');

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: sandbox.repoRoot,
    env: {
      ...sandbox.env,
      SKILLED_LOOP_ID: LOOP_ID,
      CLAUDE_CODE_SESSION_ID: SESSION_ID,
      HANDOFF_PATH: handoffPath,
    },
    encoding: 'utf8',
    timeout: 5000,
  });
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  const logLines = fs.existsSync(logPath)
    ? fs.readFileSync(logPath, 'utf8').trimEnd().split(/\r?\n/)
    : [];
  const supersedeFailedLines = logLines
    .filter((line) => /\ssupersede-failed(?:\s|$)/.test(line));

  assert.equal(result.status, 0, result.stderr);
  assert.equal(supersedeFailedLines.length, 1);
  assert.match(supersedeFailedLines[0], /EACCES|permission_denied/);
});

test('consume prints JSON and exits zero when dropped-folder logging fails', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  fs.writeFileSync(
    handoffPath,
    fs.readFileSync(handoffPath, 'utf8').replace(
      `spec_folder: ${SPEC_FOLDER}`,
      'spec_folder: specs/../x',
    ),
  );
  const stateDirectory = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(path.join(stateDirectory, 'relaunch.log'), { recursive: true });
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
  });

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: handoffPath, spec_folder: '', note: 'open' });
  assert.equal(fs.existsSync(filePath), false);
});

test('claim names a missing handoffs directory', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = path.join(handoffDirectory(sandbox), 'handoff.md');
  const result = runCli(sandbox, ['claim', handoffPath, '--session', SESSION_ID]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoffs directory is missing/);
});

test('claim reports a missing note inside the handoffs directory', (t) => {
  const sandbox = createSandbox(t);
  const directory = handoffDirectory(sandbox);
  fs.mkdirSync(directory, { recursive: true });
  const missingPath = path.join(directory, 'missing.md');

  const result = runCli(sandbox, ['claim', missingPath, '--session', SESSION_ID]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoff note not found/);
  assert.ok(result.stderr.includes(missingPath));
});

test('claim refuses a ../ handoff path outside the handoffs directory', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = `${handoffDirectory(sandbox)}${path.sep}..${path.sep}outside.md`;
  const result = runCli(sandbox, ['claim', handoffPath, '--session', SESSION_ID]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoff path must be inside/);
});

test('consume keeps a valid answer from a note whose frontmatter no longer parses', (t) => {
  for (const specFolder of ['none', CHILD_SPEC_FOLDER]) {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { specFolder });
    fs.writeFileSync(
      handoffPath,
      fs.readFileSync(handoffPath, 'utf8').replace('runtime: claude', 'runtime claude'),
    );
    writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed', handoff: handoffPath });

    const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
    const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      JSON.parse(result.stdout),
      { handoff: handoffPath, spec_folder: specFolder, note: 'invalid' },
    );
    assert.equal(fs.existsSync(logPath), false, specFolder);
  }
});

test('consume reports a missing note and a note that is no longer open', (t) => {
  const sandbox = createSandbox(t);
  const missingPath = path.join(handoffDirectory(sandbox), 'gone.md');
  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed', handoff: missingPath });
  let result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: missingPath, spec_folder: '', note: 'missing' });

  const claimedPath = writeHandoff(sandbox, { status: 'claimed', claimedBy: SESSION_ID });
  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed', handoff: claimedPath });
  result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).note, 'claimed');

  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed' });
  result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID]);
  assert.deepEqual(JSON.parse(result.stdout), { handoff: '', spec_folder: '', note: 'missing' });
});

test('claim refuses a note reached through a symlinked handoffs directory', (t) => {
  const sandbox = createSandbox(t);
  const elsewhere = path.join(sandbox.root, 'elsewhere');
  fs.mkdirSync(elsewhere);
  fs.writeFileSync(path.join(elsewhere, 'handoff.md'), handoffText());
  fs.mkdirSync(path.dirname(handoffDirectory(sandbox)), { recursive: true });
  fs.symlinkSync(elsewhere, handoffDirectory(sandbox));

  const result = runCli(sandbox, [
    'claim',
    path.join(handoffDirectory(sandbox), 'handoff.md'),
    '--session',
    SESSION_ID,
  ]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoffs directory must be a real directory inside the repository/);
  assert.match(fs.readFileSync(path.join(elsewhere, 'handoff.md'), 'utf8'), /^status: open$/m);
});

test('claim refuses a handoffs directory whose parent links outside the repository', (t) => {
  const sandbox = createSandbox(t);
  const elsewhere = path.join(sandbox.root, 'elsewhere-state');
  fs.mkdirSync(path.join(elsewhere, 'handoffs'), { recursive: true });
  fs.writeFileSync(path.join(elsewhere, 'handoffs', 'handoff.md'), handoffText());
  fs.mkdirSync(path.join(sandbox.repoRoot, '.skilled', 'skills', '.state'), { recursive: true });
  fs.symlinkSync(
    elsewhere,
    path.join(sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch'),
  );

  const result = runCli(sandbox, [
    'claim',
    path.join(handoffDirectory(sandbox), 'handoff.md'),
    '--session',
    SESSION_ID,
  ]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoffs directory must be a real directory inside the repository/);
});
