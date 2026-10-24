// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch CLI Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const core = require('../lib/relaunch-core.cjs');
const { specFolderFromSeed } = require('../lib/nudge.cjs');
const { runNested } = require('./fixtures/nested-run.cjs');

// The suite also runs from inside a looped session, whose wrapper exports these variables,
// and every sandbox copies this environment into the CLI it spawns.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('SKILLED_LOOP_')) delete process.env[key];
}

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
      'if [ -n "$SESSION_RELAUNCH_TEST_PS_SLEEP" ]; then'
        + ' sleep "$SESSION_RELAUNCH_TEST_PS_SLEEP"; fi',
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
    HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env'),
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
    'SESSION_RELAUNCH_GOAL',
    'SESSION_RELAUNCH_GOAL_PACKET',
    'OPENCODE_GOAL_STATE_DIR',
    'CLAUDE_CONFIG_DIR',
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
  createSpecFolder = true,
} = {}) {
  const handoffPath = path.join(handoffDirectory(sandbox), fileName);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, handoffText(status, specFolder, claimedBy));
  // prepare and keep refuse a packet the repository does not hold, so a note names a real one.
  if (createSpecFolder && core.validSpecFolder(specFolder)) {
    fs.mkdirSync(path.join(sandbox.repoRoot, specFolder), { recursive: true });
  }
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

// The nested detection walks the live process table, so these runs keep the real ps
// instead of the stub the sandbox puts first on PATH.
function nestedRunEnv(sandbox) {
  return {
    ...sandbox.env,
    PATH: process.env.PATH,
    SKILLED_LOOP_ID: String(process.pid),
    SKILLED_LOOP_RUNTIME: 'claude',
  };
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
  const loopPid = 900000;
  sandbox.env.SKILLED_LOOP_ID = String(loopPid);
  sandbox.env.SKILLED_LOOP_HOPS = '2';
  sandbox.env.SKILLED_LOOP_NAME = 'named-session';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(runtime.pid);
  sandbox.env.SESSION_RELAUNCH_TEST_RUNTIME_PID = String(runtime.pid);
  try {
    const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);
    assert.equal(result.status, 0, result.stderr);
    const record = JSON.parse(
      fs.readFileSync(relaunchPath(sandbox, String(loopPid)), 'utf8'),
    );
    assert.equal(record.status, 'pending');
    assert.equal(record.hops, 2);
    assert.equal(record.name, 'named-session');
    const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
    assert.doesNotMatch(fs.readFileSync(logPath, 'utf8'), /running-work-check-skipped/);
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
  for (const runtime of core.RUNTIMES) {
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
  assert.ok(
    result.stderr.includes(`SKILLED_LOOP_RUNTIME must be one of ${core.RUNTIMES.join(', ')}`),
    result.stderr,
  );
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

test('prepare exits two for an invalid CLAUDE_PID under the loop', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = '900000';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = 'not-a-pid';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /CLAUDE_PID must be a positive process id/);
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
  const loopPid = 900000;
  sandbox.env.SKILLED_LOOP_ID = String(loopPid);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = String(runtime.pid);
  sandbox.env.SESSION_RELAUNCH_TEST_PS_OUTPUT = [
    `${runtime.pid} ${loopPid} node`,
    `${runtime.pid + 1} ${runtime.pid} /bin/bash`,
  ].join('\n');
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
    const loopPid = 900000;
    const runtimePid = 900001;
    const childPid = 900002;
    sandbox.env.SKILLED_LOOP_ID = String(loopPid);
    sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
    sandbox.env.CLAUDE_PID = String(runtimePid);
    sandbox.env.SESSION_RELAUNCH_TEST_PS_OUTPUT = [
      `${runtimePid} ${loopPid} node`,
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

// CLAUDE_PID is kept only while it names a process below the loop, the rule the killer
// target follows. One inherited from an outer session points at that session's runtime,
// whose shell children say nothing about this loop's runtime.
test('prepare checks the loop child, not a CLAUDE_PID outside the loop', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const loopPid = 900000;
  sandbox.env.SKILLED_LOOP_ID = String(loopPid);
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = '424242';
  // The fake ps puts this CLI below the runtime 900001, which the loop started.
  sandbox.env.SESSION_RELAUNCH_TEST_RUNTIME_PID = '900001';
  sandbox.env.SESSION_RELAUNCH_TEST_EXTRA_PS_OUTPUT = [
    '424242 1 node',
    '424243 424242 bash',
  ].join('\n');

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    JSON.parse(fs.readFileSync(relaunchPath(sandbox, String(loopPid)), 'utf8')).status,
    'pending',
  );
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  assert.doesNotMatch(fs.readFileSync(logPath, 'utf8'), /running-work-check-skipped/);
});

test('prepare refuses a live shell child when CLAUDE_PID is outside the loop', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_ID = '900000';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.CLAUDE_PID = '424242';
  sandbox.env.SESSION_RELAUNCH_TEST_RUNTIME_PID = '900001';
  sandbox.env.SESSION_RELAUNCH_TEST_BUSY_PID = '900002';
  sandbox.env.SESSION_RELAUNCH_TEST_EXTRA_PS_OUTPUT = '424242 1 node';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /Claude still has a live shell child \(bash, pid 900002\)/);
});

// The wrapper exports a template that repeats the launch options, and drops to the plain
// command when a carried value holds the placeholder. The command printed in-session takes
// the same fallback, so it says so on stderr instead of silently losing those options.
test('prepare warns and prints the plain command when the template cannot be filled', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: '' });
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SKILLED_LOOP_MANUAL_TEMPLATE = 'skilled-loop claude --name "@@HANDOFF@@" '
    + '"[session-relaunch] claim and continue handoff @@HANDOFF@@"';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 3, result.stderr);
  assert.equal(
    result.stdout,
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}"\n`,
  );
  assert.match(
    result.stderr,
    /^\[session-relaunch\] warning: SKILLED_LOOP_MANUAL_TEMPLATE holds 2 @@HANDOFF@@ placeholders/m,
  );
});

test('prepare prints a usable manual template without a warning', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { specFolder: '' });
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;
  sandbox.env.SKILLED_LOOP_MANUAL_TEMPLATE = 'skilled-loop claude --model opus '
    + '"[session-relaunch] claim and continue handoff @@HANDOFF@@"';

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath]);

  assert.equal(result.status, 3, result.stderr);
  assert.equal(
    result.stdout,
    'skilled-loop claude --model opus "[session-relaunch] claim and continue handoff '
      + `${handoffPath}"\n`,
  );
  assert.equal(result.stderr, '');
});

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

test('prepare refuses a live shell child of the Pi loop runtime', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'pi';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = await startLoopAncestorPrepare(sandbox, t, { busyShell: true });

  assert.equal(result.report?.code, 2, result.stderr || result.stdout);
  assert.match(result.report?.stderr || '', /Pi still has a live shell child \(bash/);
});

test('prepare refuses a live shell child of the OpenCode loop runtime', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.handoffPath = writeHandoff(sandbox);
  sandbox.env.SKILLED_LOOP_RUNTIME = 'opencode';
  sandbox.env.CLAUDE_CODE_SESSION_ID = SESSION_ID;

  const result = await startLoopAncestorPrepare(sandbox, t, { busyShell: true });

  assert.equal(result.report?.code, 2, result.stderr || result.stdout);
  assert.match(result.report?.stderr || '', /Opencode still has a live shell child \(bash/);
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

test('prepare and keep refuse a spec folder the repository does not hold', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { createSpecFolder: false });
  const message = `spec_folder ${SPEC_FOLDER} does not exist in this repository`;

  for (const args of [
    ['prepare', '--handoff', handoffPath, '--session', SESSION_ID],
    ['keep', '--handoff', handoffPath, '--session', SESSION_ID],
  ]) {
    const result = runCli(sandbox, args);
    assert.equal(result.status, 2, `${args[0]}: ${result.stdout}`);
    assert.ok(result.stderr.includes(message), result.stderr);
  }
  assert.equal(fs.existsSync(path.join(handoffDirectory(sandbox), '..', 'hop-history.log')), false);
});

test('prepare and keep accept a spec folder that only the note cwd checkout holds', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { createSpecFolder: false });
  const worktree = path.join(path.dirname(sandbox.repoRoot), 'worktree');
  fs.mkdirSync(path.join(worktree, SPEC_FOLDER), { recursive: true });
  const note = fs.readFileSync(handoffPath, 'utf8')
    .replace(/^cwd: .*$/m, `cwd: ${worktree}`);
  fs.writeFileSync(handoffPath, note);

  const prepared = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(prepared.status, 3, prepared.stderr);
  assert.ok(prepared.stdout.includes(SPEC_FOLDER_SUFFIX), prepared.stdout);

  const kept = runCli(sandbox, ['keep', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.doesNotMatch(kept.stderr, /does not exist in this repository/);
});

test('prepare refuses a spec folder that is a file, and accepts the real folder', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { createSpecFolder: false });
  fs.mkdirSync(path.dirname(path.join(sandbox.repoRoot, SPEC_FOLDER)), { recursive: true });
  fs.writeFileSync(path.join(sandbox.repoRoot, SPEC_FOLDER), 'not a folder');

  const refused = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(refused.status, 2, refused.stdout);
  assert.match(refused.stderr, /does not exist in this repository/);

  fs.rmSync(path.join(sandbox.repoRoot, SPEC_FOLDER));
  fs.mkdirSync(path.join(sandbox.repoRoot, SPEC_FOLDER));
  const accepted = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(accepted.status, 3, accepted.stderr);
  assert.ok(accepted.stdout.includes(SPEC_FOLDER_SUFFIX), accepted.stdout);
});

test('prepare from a nested run prints the manual command and exits 3', async (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const result = await runNested({
    argv: [
      CLI_PATH,
      'prepare',
      '--handoff', handoffPath,
      '--session', SESSION_ID,
      '--runtime', 'claude',
    ],
    env: nestedRunEnv(sandbox),
    cwd: sandbox.repoRoot,
  });
  const manualCommand = 'skilled-loop claude "[session-relaunch] '
    + `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`;
  assert.equal(result.code, 3, result.stderr);
  assert.ok(result.stdout.includes(manualCommand), result.stdout);
  assert.equal(fs.existsSync(relaunchPath(sandbox, String(process.pid))), false);
});

test('keep from a nested run behaves as outside the loop', async (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const result = await runNested({
    argv: [CLI_PATH, 'keep', '--handoff', handoffPath, '--session', SESSION_ID],
    env: nestedRunEnv(sandbox),
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /note kept; this session cannot relaunch, so keep working/);
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
  fs.copyFileSync(
    path.resolve(__dirname, '../lib/hop-history.cjs'),
    path.join(path.dirname(copiedNudge), 'hop-history.cjs'),
  );
  fs.copyFileSync(
    path.resolve(__dirname, '../lib/withdraw.cjs'),
    path.join(path.dirname(copiedNudge), 'withdraw.cjs'),
  );
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
    .find((line) => line.includes('Validate the note and'));
  assert.ok(summary, result.stdout);
  // Prepare writes a pending record. The runtime's own stop or idle event arms it.
  assert.match(summary, /pending record/);
  assert.doesNotMatch(summary, /arm the relaunch/);
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
    /command must be one of prepare, should-relaunch, keep, claim, complete, consume, cancel, hand-over, history\n/,
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

test('cancel disarms the loop prepared hand-over named by the loop environment', (t) => {
  const sandbox = createSandbox(t);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'pending',
    handoff: path.join(sandbox.repoRoot, 'handoff.md'),
  });

  const result = runCli(sandbox, ['cancel'], { ...sandbox.env, SKILLED_LOOP_ID: LOOP_ID });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /cancelled the prepared hand-over for handoff\.md/);
  const stored = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.equal(stored.status, 'disarmed');
  assert.equal(stored.disarmReason, 'cancelled');
  // A disarmed record is one no arm path takes again.
  assert.equal(
    core.armableRecord(stored, { loopId: LOOP_ID, sessionId: stored.sessionId }).armable,
    false,
  );
});

test('cancel exits one when the loop has no prepared hand-over', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'disarmed' });

  const result = runCli(sandbox, ['cancel', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /no prepared hand-over to cancel/);
});

function historyEvents(sandbox) {
  const historyPath = path.join(handoffDirectory(sandbox), '..', 'hop-history.log');
  if (!fs.existsSync(historyPath)) return [];
  return fs.readFileSync(historyPath, 'utf8').split('\n').filter(Boolean)
    .map((line) => line.split('\t')[1]);
}

test('cancel from a nested run without a loop id refuses and leaves the outer hand-over armed', async (t) => {
  const sandbox = createSandbox(t);
  const outerLoopId = String(process.pid);
  const handoffPath = writeHandoff(sandbox);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: outerLoopId,
    status: 'pending',
    handoff: handoffPath,
    sessionId: SESSION_ID,
  });

  const result = await runNested({
    argv: [CLI_PATH, 'cancel'],
    env: nestedRunEnv(sandbox),
    cwd: sandbox.repoRoot,
  });

  assert.equal(result.code, 2, result.stderr);
  assert.match(result.stderr, /--loop-id is required outside a loop/);
  assert.equal(JSON.parse(fs.readFileSync(filePath, 'utf8')).status, 'pending');
  assert.deepEqual(historyEvents(sandbox), []);
});

test('cancel from a nested run honors an explicit loop id', async (t) => {
  const sandbox = createSandbox(t);
  const outerLoopId = String(process.pid);
  const filePath = writeRelaunchRecord(sandbox, {
    loopId: outerLoopId,
    status: 'pending',
    handoff: writeHandoff(sandbox),
    sessionId: SESSION_ID,
  });

  const result = await runNested({
    argv: [CLI_PATH, 'cancel', '--loop-id', outerLoopId],
    env: nestedRunEnv(sandbox),
    cwd: sandbox.repoRoot,
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(fs.readFileSync(filePath, 'utf8')).disarmReason, 'cancelled');
});

test('cancel records a withdrawn hop and grants the session one more nudge', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: handoffPath,
    sessionId: SESSION_ID,
  });

  const result = runCli(sandbox, ['cancel'], { ...sandbox.env, SKILLED_LOOP_ID: LOOP_ID });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(historyEvents(sandbox), ['withdrawn']);
  const history = fs.readFileSync(path.join(handoffDirectory(sandbox), '..', 'hop-history.log'), 'utf8');
  assert.equal(history.trim().split('\t')[7], SESSION_ID.slice(0, 8));
  const nudgeState = JSON.parse(fs.readFileSync(
    path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`),
    'utf8',
  ));
  assert.deepEqual(nudgeState.rearm, { pending: true });
});

test('a cancel that finds nothing to cancel records no withdrawn hop', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'disarmed', sessionId: SESSION_ID });

  const result = runCli(sandbox, ['cancel', '--loop-id', LOOP_ID]);

  assert.equal(result.status, 1, result.stderr);
  assert.deepEqual(historyEvents(sandbox), []);
  assert.equal(
    fs.existsSync(path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`)),
    false,
  );
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

// A withdraw rewrites the record under its lock, so the unlink that ends it has to wait for
// the same lock or it can remove a record a withdraw is mid-way through replacing.
test('consume removes the relaunch file under the record lock', (t) => {
  const sandbox = createSandbox(t);
  const filePath = writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed' });
  const probePath = path.join(sandbox.root, 'unlink-probe.json');
  const preloadPath = path.join(sandbox.root, 'unlink-probe.cjs');
  fs.writeFileSync(preloadPath, `
    const fs = require('node:fs');
    const realUnlinkSync = fs.unlinkSync;
    fs.unlinkSync = (target, ...rest) => {
      if (String(target) === ${JSON.stringify(filePath)}) {
        fs.writeFileSync(${JSON.stringify(probePath)}, JSON.stringify({
          lockHeld: fs.existsSync(${JSON.stringify(`${filePath}.lock`)}),
        }));
      }
      return realUnlinkSync(target, ...rest);
    };
  `);

  const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID], {
    ...sandbox.env,
    NODE_OPTIONS: `--require=${preloadPath}`,
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(filePath), false);
  assert.deepEqual(JSON.parse(fs.readFileSync(probePath, 'utf8')), { lockHeld: true });
  assert.equal(fs.existsSync(`${filePath}.lock`), false);
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
  assert.deepEqual(
    JSON.parse(result.stdout),
    { handoff: handoffPath, spec_folder: '', note: 'open' },
  );
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
  assert.deepEqual(
    JSON.parse(result.stdout),
    { handoff: handoffPath, spec_folder: '', note: 'open' },
  );
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
  assert.deepEqual(
    JSON.parse(result.stdout),
    { handoff: handoffPath, spec_folder: '', note: 'invalid' },
  );
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
  assert.deepEqual(
    JSON.parse(result.stdout),
    { handoff: handoffPath, spec_folder: '', note: 'open' },
  );
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
  assert.deepEqual(
    JSON.parse(result.stdout),
    { handoff: missingPath, spec_folder: '', note: 'missing' },
  );

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

// ─────────────────────────────────────────────────────────────────────────────
// GOAL PACKET
// ─────────────────────────────────────────────────────────────────────────────

const GOAL_PACKET = SPEC_FOLDER;
const GOAL_HEADLINE = '# Goal: Session relaunch loop';
const GOAL_CLAIM_LINE = `Goal packet: ${GOAL_PACKET}`;
const GOAL_RECORD_RUNTIMES = ['opencode', 'pi', 'devin', 'cursor', 'hermes'];

function writeGoalFile(root, packet = GOAL_PACKET) {
  fs.mkdirSync(path.join(root, packet), { recursive: true });
  fs.writeFileSync(path.join(root, packet, 'goal.md'), `${GOAL_HEADLINE}\n`);
}

function writeGoalRecord(sandbox, runtime, record = { status: 'active', packetPath: GOAL_PACKET }) {
  const goalCore = require('../../goal/lib/goal-core.cjs');
  // The state directory marks the checkout as the workspace the record reader resolves.
  fs.mkdirSync(path.join(sandbox.repoRoot, '.skilled', 'skills'), { recursive: true });
  const filePath = runtime === 'opencode'
    ? path.join(
      goalCore.resolveStateDir({ workspace: sandbox.repoRoot }),
      `${createHash('sha256').update(SESSION_ID, 'utf8').digest('hex')}.json`,
    )
    : goalCore.statePath({
      scope: { workspace: sandbox.repoRoot, runtime, sessionId: SESSION_ID },
    });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(record));
}

function writeClaudeGoalLog(sandbox, entries) {
  const configDirectory = path.join(sandbox.root, 'claude-config');
  const logPath = path.join(configDirectory, 'projects', '-project', `${SESSION_ID}.jsonl`);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, entries.map((entry) => JSON.stringify(entry)).join('\n'));
  sandbox.env.CLAUDE_CONFIG_DIR = configDirectory;
}

function setNoteField(handoffPath, line) {
  const text = fs.readFileSync(handoffPath, 'utf8');
  fs.writeFileSync(handoffPath, text.replace(/^(spec_folder: .*)$/m, `$1\n${line}`));
}

function noteGoalPacket(handoffPath) {
  return core.parseHandoff(fs.readFileSync(handoffPath, 'utf8')).frontmatter.goal_packet;
}

// One row per sender runtime: how the goal is made findable for that runtime.
const GOAL_SENDER_CASES = [
  ...GOAL_RECORD_RUNTIMES.map((runtime) => ({
    runtime,
    arrange: (sandbox) => writeGoalRecord(sandbox, runtime),
  })),
  { runtime: 'codex', arrange: () => {} },
  {
    runtime: 'claude',
    arrange: (sandbox) => writeClaudeGoalLog(sandbox, [{
      type: 'attachment',
      attachment: { type: 'goal_status', met: false, sentinel: true, condition: `${GOAL_HEADLINE}\n` },
    }]),
  },
];

for (const command of ['prepare', 'keep']) {
  for (const { runtime, arrange } of GOAL_SENDER_CASES) {
    test(`${command} records the ${runtime} sender's goal packet in the note`, (t) => {
      const sandbox = createSandbox(t);
      const handoffPath = writeHandoff(sandbox);
      writeGoalFile(sandbox.repoRoot);
      arrange(sandbox);

      const result = runCli(sandbox, [
        command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', runtime,
      ]);

      assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
      assert.equal(noteGoalPacket(handoffPath), GOAL_PACKET);
      assert.match(fs.readFileSync(handoffPath, 'utf8'), /^status: open$/m);
    });
  }

  test(`${command} leaves goal_packet out when the sender had no goal`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    writeGoalFile(sandbox.repoRoot);
    const before = fs.readFileSync(handoffPath, 'utf8');

    for (const runtime of ['opencode', 'pi']) {
      const result = runCli(sandbox, [
        command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', runtime,
      ]);
      assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
    }

    assert.equal(fs.readFileSync(handoffPath, 'utf8'), before);
  });

  test(`${command} leaves the field empty for a sender whose goal record is unreadable`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    writeGoalFile(sandbox.repoRoot);
    writeGoalRecord(sandbox, 'pi');
    fs.writeFileSync(
      require('../../goal/lib/goal-core.cjs').statePath({
        scope: { workspace: sandbox.repoRoot, runtime: 'pi', sessionId: SESSION_ID },
      }),
      '{broken',
    );

    const result = runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'pi',
    ]);

    assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
    assert.equal(noteGoalPacket(handoffPath), undefined);
  });

  test(`${command} writes no goal_packet when SESSION_RELAUNCH_GOAL is 0`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    writeGoalFile(sandbox.repoRoot);
    writeGoalRecord(sandbox, 'opencode');
    sandbox.env.SESSION_RELAUNCH_GOAL = '0';

    const result = runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'opencode',
    ]);

    assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
    assert.equal(noteGoalPacket(handoffPath), undefined);
  });

  test(`${command} reads the goal switch from the hook flags file too`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    writeGoalFile(sandbox.repoRoot);
    writeGoalRecord(sandbox, 'opencode');
    fs.writeFileSync(sandbox.env.HOOK_FLAGS_CONFIG, 'SESSION_RELAUNCH_GOAL=0\n');

    runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'opencode',
    ]);

    assert.equal(noteGoalPacket(handoffPath), undefined);
  });

  test(`${command} keeps a goal_packet the sender wrote instead of resolving another`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    writeGoalFile(sandbox.repoRoot);
    const written = `${CHILD_SPEC_FOLDER}`;
    writeGoalFile(sandbox.repoRoot, written);
    setNoteField(handoffPath, `goal_packet: ${written}`);
    writeGoalRecord(sandbox, 'opencode');

    const result = runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'opencode',
    ]);

    assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
    assert.equal(noteGoalPacket(handoffPath), written);
  });

  test(`${command} accepts a goal packet that only the note cwd checkout holds`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    const worktree = path.join(path.dirname(sandbox.repoRoot), 'worktree');
    writeGoalFile(worktree);
    fs.writeFileSync(
      handoffPath,
      fs.readFileSync(handoffPath, 'utf8').replace(/^cwd: .*$/m, `cwd: ${worktree}`),
    );
    setNoteField(handoffPath, `goal_packet: ${GOAL_PACKET}`);

    const result = runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'pi',
    ]);

    assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
  });

  test(`${command} refuses a goal_packet that is not a repo packet holding goal.md`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    const outside = path.join(sandbox.root, 'outside');
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'goal.md'), GOAL_HEADLINE);
    const linked = 'specs/hooks/030-linked-packet';
    fs.mkdirSync(path.join(sandbox.repoRoot, 'specs/hooks'), { recursive: true });
    fs.symlinkSync(outside, path.join(sandbox.repoRoot, linked));
    const cases = [
      { value: '../outside', reason: /goal_packet must be the repo-relative packet path/ },
      { value: outside, reason: /goal_packet must be the repo-relative packet path/ },
      { value: `${GOAL_PACKET} ${CHILD_SPEC_FOLDER}`, reason: /goal_packet must be the repo-relative/ },
      { value: 'specs/hooks/../024-other', reason: /goal_packet must be the repo-relative/ },
      { value: linked, reason: /goal_packet .* resolves outside the repository/ },
      { value: GOAL_PACKET, reason: /goal_packet .* holds no goal\.md in this repository/ },
    ];

    for (const { value, reason } of cases) {
      setNoteField(handoffPath, `goal_packet: ${value}`);
      const result = runCli(sandbox, [
        command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'pi',
      ]);
      assert.equal(result.status, 2, `${value}: ${result.stdout}${result.stderr}`);
      assert.match(result.stderr, reason, value);
      fs.writeFileSync(handoffPath, handoffText());
    }
  });

  test(`${command} treats an empty goal_packet like an absent one`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox);
    setNoteField(handoffPath, 'goal_packet: ');

    const result = runCli(sandbox, [
      command, '--handoff', handoffPath, '--session', SESSION_ID, '--runtime', 'pi',
    ]);

    assert.equal(result.status, command === 'prepare' ? 3 : 0, result.stderr);
  });
}

test('prepare under the loop records the goal packet and still arms the record', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  writeGoalFile(sandbox.repoRoot);
  writeGoalRecord(sandbox, 'pi');
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SKILLED_LOOP_RUNTIME = 'pi';
  sandbox.env.CLAUDE_PID = String(process.pid);

  const result = runCli(sandbox, ['prepare', '--handoff', handoffPath, '--session', SESSION_ID]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(noteGoalPacket(handoffPath), GOAL_PACKET);
  assert.equal(JSON.parse(fs.readFileSync(relaunchPath(sandbox), 'utf8')).status, 'pending');
});

test('claim prints the goal packet after the note body', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  writeGoalFile(sandbox.repoRoot);
  setNoteField(handoffPath, `goal_packet: ${GOAL_PACKET}`);

  const result = runCli(sandbox, ['claim', handoffPath, '--session', SESSION_ID]);

  assert.equal(result.status, 0, result.stderr);
  const lines = result.stdout.trimEnd().split('\n');
  assert.match(lines.at(-1), new RegExp(`^${GOAL_CLAIM_LINE} \\(.*goal\\.md\\)$`));
  assert.match(result.stdout, /Implement the core and adapters\./);
});

test('claim prints no goal packet for an older note, a switch that is off or a lost goal.md', (t) => {
  const sandbox = createSandbox(t);
  writeGoalFile(sandbox.repoRoot);
  const olderNote = writeHandoff(sandbox, { fileName: 'older.md' });
  const claimed = runCli(sandbox, ['claim', olderNote, '--session', SESSION_ID]);
  assert.equal(claimed.status, 0, claimed.stderr);
  assert.doesNotMatch(claimed.stdout, /Goal packet/);

  const switchedOff = writeHandoff(sandbox, { fileName: 'off.md' });
  setNoteField(switchedOff, `goal_packet: ${GOAL_PACKET}`);
  const off = runCli(sandbox, ['claim', switchedOff, '--session', SESSION_ID], {
    ...sandbox.env, SESSION_RELAUNCH_GOAL: '0',
  });
  assert.equal(off.status, 0, off.stderr);
  assert.doesNotMatch(off.stdout, /Goal packet/);
  assert.match(off.stdout, /Finish the relaunch loop/);

  const lost = writeHandoff(sandbox, { fileName: 'lost.md' });
  setNoteField(lost, `goal_packet: ${GOAL_PACKET}`);
  fs.rmSync(path.join(sandbox.repoRoot, GOAL_PACKET, 'goal.md'));
  const lostResult = runCli(sandbox, ['claim', lost, '--session', SESSION_ID]);
  assert.equal(lostResult.status, 0, lostResult.stderr);
  assert.doesNotMatch(lostResult.stdout, /Goal packet/);
  assert.match(lostResult.stdout, /Finish the relaunch loop/);
});

test('consume reports the goal packet only while the switch is on and the packet holds goal.md', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  writeGoalFile(sandbox.repoRoot);
  setNoteField(handoffPath, `goal_packet: ${GOAL_PACKET}`);
  const consume = (env = sandbox.env) => {
    writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed', handoff: handoffPath });
    const result = runCli(sandbox, ['consume', '--loop-id', LOOP_ID], env);
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };

  assert.deepEqual(consume(), {
    handoff: handoffPath, spec_folder: SPEC_FOLDER, note: 'open', goal_packet: GOAL_PACKET,
  });
  assert.deepEqual(consume({ ...sandbox.env, SESSION_RELAUNCH_GOAL: '0' }), {
    handoff: handoffPath, spec_folder: SPEC_FOLDER, note: 'open',
  });
  fs.rmSync(path.join(sandbox.repoRoot, GOAL_PACKET, 'goal.md'));
  assert.deepEqual(consume(), {
    handoff: handoffPath, spec_folder: SPEC_FOLDER, note: 'open',
  });
});

test('the usage text names the goal packet on claim and consume', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['--help']);

  assert.match(result.stdout, /print its body, then the goal packet it carries/);
  assert.match(result.stdout, /its spec folder and its goal packet/);
});
