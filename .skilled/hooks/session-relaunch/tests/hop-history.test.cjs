// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Hop History Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const core = require('../lib/relaunch-core.cjs');
const hopHistory = require('../lib/hop-history.cjs');

const CLI_PATH = path.resolve(__dirname, '../bin/session-relaunch.cjs');
const SESSION_ID = 'session-history-0001';
const LOOP_ID = 'loop-history-0001';
const GOAL = 'Update the creator prompt page.';

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-history-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const binDir = path.join(root, 'bin');
  for (const directory of [repoRoot, xdgRuntimeDir, binDir]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const noticeLog = path.join(root, 'osascript.log');
  fs.writeFileSync(
    path.join(binDir, 'osascript'),
    `#!/bin/sh\nprintf '%s\\n' "$*" >> '${noticeLog}'\n`,
    { mode: 0o755 },
  );
  const flagsFile = path.join(root, 'hook-flags.env');
  fs.writeFileSync(flagsFile, '');
  const env = {
    ...process.env,
    HOME: root,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
    HOOK_FLAGS_CONFIG: flagsFile,
    PATH: [binDir, process.env.PATH || ''].join(path.delimiter),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_RUNTIME',
    'CLAUDE_CODE_SESSION_ID',
    'SESSION_RELAUNCH_NOTIFY_HOPS',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SESSION_RELAUNCH_MAX_AGE_MIN',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, env, flagsFile, noticeLog };
}

function stateDirectory(sandbox) {
  return path.join(sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch');
}

function historyLines(sandbox) {
  const historyPath = path.join(stateDirectory(sandbox), 'hop-history.log');
  if (!fs.existsSync(historyPath)) return [];
  return fs.readFileSync(historyPath, 'utf8').split('\n').filter(Boolean);
}

function seedHistory(sandbox, count) {
  const historyPath = path.join(stateDirectory(sandbox), 'hop-history.log');
  fs.mkdirSync(path.dirname(historyPath), { recursive: true });
  const lines = [];
  for (let index = 1; index <= count; index += 1) {
    lines.push([
      new Date(Date.UTC(2024, 0, index)).toISOString(),
      'claimed',
      'claude',
      `hop ${index}`,
      sandbox.repoRoot,
      `goal ${index}`,
      'handoff.md',
    ].join('\t'));
  }
  fs.writeFileSync(historyPath, `${lines.join('\n')}\n`);
}

function writeNote(sandbox, fileName = 'handoff.md') {
  const handoffPath = path.join(stateDirectory(sandbox), 'handoffs', fileName);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, [
    '---',
    'status: open',
    `session_id: ${SESSION_ID}`,
    `loop_id: ${LOOP_ID}`,
    'runtime: claude',
    `cwd: ${sandbox.repoRoot}`,
    'spec_folder: ',
    `created_at: ${new Date().toISOString()}`,
    '---',
    '## Goal',
    GOAL,
    '## Done',
    'Read the screenshots.',
    '## Remaining work',
    'Rewrite the page.',
    '## In-flight state',
    'Nothing is running.',
  ].join('\n'));
  return handoffPath;
}

function armRecord(sandbox, handoffPath) {
  core.preparePending({
    loopId: LOOP_ID,
    handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    cwd: sandbox.repoRoot,
    hops: 2,
    env: sandbox.env,
  });
  core.arm({ loopId: LOOP_ID, cwd: sandbox.repoRoot, env: sandbox.env });
}

function runCli(sandbox, args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    encoding: 'utf8',
    timeout: 5000,
  });
}

test('a relaunch decision records a hand-over line with the note goal and hop number', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);
  armRecord(sandbox, handoffPath);

  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 0, result.stderr);

  const lines = historyLines(sandbox);
  assert.equal(lines.length, 1);
  const fields = lines[0].split('\t');
  assert.equal(fields[1], 'handed-over');
  assert.equal(fields[2], 'claude');
  assert.equal(fields[3], 'hop 3');
  assert.equal(fields[4], sandbox.repoRoot);
  assert.equal(fields[5], GOAL);
  assert.equal(fields[6], 'handoff.md');
});

test('a declined relaunch records nothing', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  assert.equal(result.status, 1);
  assert.deepEqual(historyLines(sandbox), []);
});

test('claim and complete record the receiving session picking the note up and finishing it', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);

  assert.equal(runCli(sandbox, ['claim', handoffPath, '--session', 'receiver-0001']).status, 0);
  assert.equal(runCli(sandbox, ['complete', handoffPath]).status, 0);

  const events = historyLines(sandbox).map((line) => line.split('\t')[1]);
  assert.deepEqual(events, ['claimed', 'done']);
});

test('history prints the latest lines and says when no hop is recorded yet', (t) => {
  const sandbox = createSandbox(t);
  const empty = runCli(sandbox, ['history']);
  assert.equal(empty.status, 0, empty.stderr);
  assert.match(empty.stdout, /no hop recorded yet/);

  const handoffPath = writeNote(sandbox);
  runCli(sandbox, ['claim', handoffPath, '--session', 'receiver-0001']);
  runCli(sandbox, ['complete', handoffPath]);

  const latest = runCli(sandbox, ['history', '--last', '1']);
  assert.equal(latest.status, 0, latest.stderr);
  const printed = latest.stdout.trim().split('\n');
  assert.equal(printed.length, 1);
  assert.match(printed[0], /done/);
  assert.match(printed[0], new RegExp(GOAL.replace('.', '\\.')));
});

test('a zero count reads no history lines', (t) => {
  const sandbox = createSandbox(t);
  seedHistory(sandbox, 3);
  assert.deepEqual(hopHistory.readHistory({ env: sandbox.env, last: 0 }), []);
});

test('a negative count reads the default number of newest lines', (t) => {
  const sandbox = createSandbox(t);
  const seeded = hopHistory.DEFAULT_HISTORY_LINES + 3;
  seedHistory(sandbox, seeded);

  const lines = hopHistory.readHistory({ env: sandbox.env, last: -5 });
  assert.equal(lines.length, hopHistory.DEFAULT_HISTORY_LINES);
  assert.match(lines[0], new RegExp(`goal ${seeded - hopHistory.DEFAULT_HISTORY_LINES + 1}\\b`));
  assert.match(lines.at(-1), new RegExp(`goal ${seeded}\\b`));
});

test('a whole count reads that many of the newest lines', (t) => {
  const sandbox = createSandbox(t);
  seedHistory(sandbox, 5);

  const lines = hopHistory.readHistory({ env: sandbox.env, last: 2 });
  assert.equal(lines.length, 2);
  assert.match(lines[0], /goal 4\b/);
  assert.match(lines[1], /goal 5\b/);
});

test('history rejects a --last value that is not a positive whole number', (t) => {
  const sandbox = createSandbox(t);
  const result = runCli(sandbox, ['history', '--last', 'zero']);
  assert.equal(result.status, 2);
});

test('the hand-over notice stays off by default', (t) => {
  const sandbox = createSandbox(t);
  armRecord(sandbox, writeNote(sandbox));
  assert.equal(runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]).status, 0);
  assert.equal(fs.existsSync(sandbox.noticeLog), false);
});

test('the hand-over notice fires once the switch is set in the hook-flags file', (t) => {
  const sandbox = createSandbox(t);
  fs.writeFileSync(sandbox.flagsFile, 'SESSION_RELAUNCH_NOTIFY_HOPS=1\n');
  armRecord(sandbox, writeNote(sandbox));
  assert.equal(runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]).status, 0);

  const notice = fs.readFileSync(sandbox.noticeLog, 'utf8');
  assert.match(notice, /Session handed over/);
  assert.match(notice, /claude/);
  assert.match(notice, /Update the creator prompt page/);
});

test('a killer timeout records a timed-out line', async (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);
  hopHistory.recordHop('timed-out', handoffPath, { env: sandbox.env });
  const fields = historyLines(sandbox)[0].split('\t');
  assert.equal(fields[1], 'timed-out');
  assert.equal(fields[5], GOAL);
});
