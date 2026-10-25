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

function handOverArgs(handoffPath, hop = 3) {
  return ['hand-over', '--handoff', handoffPath, '--hop', String(hop), '--runtime', 'claude'];
}

test('hand-over records a hand-over line with the note goal and hop number', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);
  armRecord(sandbox, handoffPath);

  const decision = runCli(sandbox, ['should-relaunch', '--loop-id', LOOP_ID]);
  assert.equal(decision.status, 0, decision.stderr);
  // The wrapper can still decline after an approved decision, so the decision records nothing.
  assert.deepEqual(historyLines(sandbox), []);

  const result = runCli(sandbox, handOverArgs(handoffPath));
  assert.equal(result.status, 0, result.stderr);
  // The wrapper reads nothing from it, so a stdout that never parses cannot hold the hop back.
  assert.equal(result.stdout, '');
  // The record is consume's to remove, so hand-over leaves it for that one call.
  assert.equal(fs.existsSync(core.relaunchFilePath(LOOP_ID, sandbox.env)), true);

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

test('hand-over records nothing when the note is no longer open', (t) => {
  const sandbox = createSandbox(t);
  fs.writeFileSync(sandbox.flagsFile, 'SESSION_RELAUNCH_NOTIFY_HOPS=1\n');
  const handoffPath = writeNote(sandbox);
  armRecord(sandbox, handoffPath);
  core.claimHandoff(handoffPath, { sessionId: SESSION_ID });

  const result = runCli(sandbox, handOverArgs(handoffPath));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(historyLines(sandbox), []);
  assert.equal(fs.existsSync(sandbox.noticeLog), false);
});

test('hand-over refuses a note outside the handoffs directory and records nothing', (t) => {
  const sandbox = createSandbox(t);
  fs.writeFileSync(sandbox.flagsFile, 'SESSION_RELAUNCH_NOTIFY_HOPS=1\n');
  const elsewhere = path.join(sandbox.root, 'elsewhere.md');
  fs.copyFileSync(writeNote(sandbox), elsewhere);

  const result = runCli(sandbox, handOverArgs(elsewhere));
  assert.equal(result.status, 2);
  assert.match(result.stderr, /handoff path must be inside the session-relaunch handoffs directory/);
  assert.deepEqual(historyLines(sandbox), []);
  assert.equal(fs.existsSync(sandbox.noticeLog), false);
});

test('hand-over rejects a hop that is not a positive whole number', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);
  for (const hop of ['0', '-1', 'two', '1.5']) {
    const result = runCli(sandbox, handOverArgs(handoffPath, hop));
    assert.equal(result.status, 2, hop);
  }
  assert.deepEqual(historyLines(sandbox), []);
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

  // The claim names its session, so a note its own writer claimed reads differently
  // from a hand-over; the done line has no session to name.
  const [claimedLine, doneLine] = historyLines(sandbox);
  assert.equal(claimedLine.split('\t')[7], 'receiver');
  assert.equal(doneLine.split('\t').length, 7);
  const printed = runCli(sandbox, ['history']);
  assert.equal(printed.status, 0, printed.stderr);
  assert.match(printed.stdout, /claimed\s+claude\s+repo by receiver\s/);
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
  assert.equal(runCli(sandbox, handOverArgs(writeNote(sandbox))).status, 0);
  assert.equal(fs.existsSync(sandbox.noticeLog), false);
});

test('the hand-over notice fires once the switch is set in the hook-flags file', (t) => {
  const sandbox = createSandbox(t);
  fs.writeFileSync(sandbox.flagsFile, 'SESSION_RELAUNCH_NOTIFY_HOPS=1\n');
  assert.equal(runCli(sandbox, handOverArgs(writeNote(sandbox))).status, 0);

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

test('keep outside the loop records a note-kept line and prints the claim command', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);

  const kept = runCli(sandbox, ['keep', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(kept.status, 0, kept.stderr);
  assert.match(kept.stdout, /note kept; this session cannot relaunch, so keep working/);
  assert.ok(kept.stdout.includes(`claim '${handoffPath}' --session '${SESSION_ID}'`), kept.stdout);
  assert.deepEqual(historyLines(sandbox).map((line) => line.split('\t')[1]), ['note-kept']);

  const inside = runCli(sandbox, ['keep', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(inside.status, 0, inside.stderr);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const refused = runCli(sandbox, ['keep', '--handoff', handoffPath, '--session', SESSION_ID]);
  assert.equal(refused.status, 2);
  assert.match(refused.stderr, /runs under skilled-loop; run prepare instead/);
  assert.equal(historyLines(sandbox).length, 2);
});

test('history adds an open-notes line until the note is claimed', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox, '20261020T040936Z-session-.md');

  const open = runCli(sandbox, ['history']);
  assert.equal(open.status, 0, open.stderr);
  assert.match(open.stdout, /no hop recorded yet/);
  assert.match(
    open.stdout,
    /^open notes: 1 handoff note not claimed yet, oldest 20261020T040936Z-session-\.md$/m,
  );

  runCli(sandbox, ['claim', handoffPath, '--session', 'receiver-0001']);
  assert.equal(runCli(sandbox, ['history']).stdout.includes('open notes:'), false);
});

test('history renders a withdrawn line with the session that withdrew the hand-over', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);

  assert.equal(
    hopHistory.recordHop('withdrawn', handoffPath, { env: sandbox.env, session: SESSION_ID }),
    true,
  );

  const [line] = hopHistory.readHistory({ env: sandbox.env });
  assert.match(line, /withdrawn\s+claude\s+repo by session-\s/);
  assert.match(line, /\[handoff\.md\]$/);
});

test('open notes report a withdrawn note apart from one nobody has claimed', (t) => {
  const sandbox = createSandbox(t);
  const withdrawnPath = writeNote(sandbox, '20261020T040936Z-session-a.md');
  writeNote(sandbox, '20261021T040936Z-session-b.md');
  hopHistory.recordHop('withdrawn', withdrawnPath, { env: sandbox.env, session: SESSION_ID });

  assert.deepEqual(
    hopHistory.openNotes({ env: sandbox.env }).map(({ name, withdrawn }) => [name, withdrawn]),
    [['20261020T040936Z-session-a.md', true], ['20261021T040936Z-session-b.md', false]],
  );
  assert.equal(
    hopHistory.openNotesLine({ env: sandbox.env }),
    'open notes: 1 handoff note not claimed yet, oldest 20261021T040936Z-session-b.md;'
      + ' 1 withdrawn note still with its session',
  );
});

test('open notes that are all withdrawn say only that', (t) => {
  const sandbox = createSandbox(t);
  for (const name of ['20261020T040936Z-session-a.md', '20261021T040936Z-session-b.md']) {
    hopHistory.recordHop('withdrawn', writeNote(sandbox, name), { env: sandbox.env });
  }

  const line = hopHistory.openNotesLine({ env: sandbox.env });
  assert.equal(line, 'open notes: 2 withdrawn notes still with their sessions');
  const printed = runCli(sandbox, ['history']);
  assert.match(printed.stdout, /^open notes: 2 withdrawn notes still with their sessions$/m);
  assert.doesNotMatch(printed.stdout, /not claimed yet/);
});

test('a note handed over again after a withdrawal counts as unclaimed work again', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeNote(sandbox);
  hopHistory.recordHop('withdrawn', handoffPath, { env: sandbox.env });
  hopHistory.recordHop('handed-over', handoffPath, { env: sandbox.env, hop: 1 });

  assert.equal(
    hopHistory.openNotesLine({ env: sandbox.env }),
    'open notes: 1 handoff note not claimed yet, oldest handoff.md',
  );
});

test('a history file written before withdrawn existed still reads', (t) => {
  const sandbox = createSandbox(t);
  seedHistory(sandbox, 2);
  writeNote(sandbox);

  assert.equal(hopHistory.readHistory({ env: sandbox.env }).length, 2);
  assert.equal(
    hopHistory.openNotesLine({ env: sandbox.env }),
    'open notes: 1 handoff note not claimed yet, oldest handoff.md',
  );
});
