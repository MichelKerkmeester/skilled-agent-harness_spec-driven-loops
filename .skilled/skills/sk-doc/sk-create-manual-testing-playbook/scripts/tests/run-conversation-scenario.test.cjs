#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Conversation Runner Integration Suite
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Integration suite for the conversation runner.
 *
 * The suite drives the real runner against a line-mode stand-in subject in real tmux, because the
 * parts that break are the ones a unit test cannot reach: key sequences, prompt detection, the
 * settle window and the teardown that has to leave no server and no process behind. It also covers
 * every refusal, which must be decided before anything starts.
 *
 * Run it outside any sandbox: tmux needs a local socket.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const runnerPath = path.resolve(__dirname, '..', 'run-conversation-scenario.cjs');
const runner = require(runnerPath);
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'conversation-runner-'));
const FAKE_ENV = { CONVERSATION_RUNNER_FAKE: '1' };
const state = {};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create one temporary folder for a group.
 *
 * @param {string} label - Short name used in the folder name.
 * @returns {string} Folder path.
 */
function tempDir(label) {
  return fs.mkdtempSync(path.join(ROOT, `${label}-`));
}

/**
 * Create a throwaway git repository whose watched state folder already holds a file. An append to
 * that existing file is what the snapshot has to notice, so the file has to be there first.
 *
 * @param {string} label - Short name used in the folder name.
 * @returns {string} Repository root.
 */
function makeRepo(label) {
  const dir = tempDir(label);
  fs.mkdirSync(path.join(dir, 'specs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'specs', 'seed.md'), 'seed\n');
  const watched = path.join(dir, '.skilled', 'skills', '.state', 'decision-capture');
  fs.mkdirSync(watched, { recursive: true });
  fs.writeFileSync(path.join(watched, 'queue.md'), 'first\n');
  const init = spawnSync('git', ['init', '-q'], { cwd: dir, encoding: 'utf8' });
  assert.strictEqual(init.status, 0, `git init failed: ${init.stderr}`);
  return dir;
}

/** A missing specs root and no watched state folders produce an empty snapshot. */
function emptyRepoSnapshot() {
  const repo = tempDir('empty-snapshot-repo');
  assert.deepStrictEqual(runner.snapshotRepo(repo, []), []);
}

/**
 * Write a scenario file holding one conversation block.
 *
 * @param {string} dir - Folder for the file.
 * @param {string} name - File name.
 * @param {Object} script - Conversation script.
 * @returns {string} Scenario path.
 */
function writeScenario(dir, name, script) {
  const fence = '\x60'.repeat(3);
  const body = [
    `# Scenario: ${name}`,
    '',
    '## 3. TEST',
    '',
    '### Conversation Script',
    '',
    `${fence}json conversation`,
    JSON.stringify(script, null, 2),
    fence,
    '',
  ].join('\n');
  const file = path.join(dir, name);
  fs.writeFileSync(file, body);
  return file;
}

/**
 * Run the runner to completion.
 *
 * @param {string[]} args - Arguments after the script name.
 * @param {Object} [options] - Extra environment and deadline.
 * @returns {{code: number, stdout: string, stderr: string}} Outcome.
 */
function runCli(args, options = {}) {
  const result = spawnSync(process.execPath, [runnerPath, ...args], {
    encoding: 'utf8',
    timeout: options.timeout || 180000,
    env: { ...process.env, ...FAKE_ENV, ...(options.env || {}) },
  });
  return { code: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

/**
 * Start the runner without waiting for it.
 *
 * @param {string[]} args - Arguments after the script name.
 * @returns {Object} Child process.
 */
function spawnCli(args) {
  return spawn(process.execPath, [runnerPath, ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...FAKE_ENV },
  });
}

/**
 * Read a runtime's result document.
 *
 * @param {string} out - Evidence root.
 * @param {string} runtime - Runtime id.
 * @returns {Object} Parsed result.
 */
function readResult(out, runtime) {
  const file = path.join(out, runtime, 'result.json');
  assert.ok(fs.existsSync(file), `missing evidence: ${file}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Test whether a private socket still answers.
 *
 * @param {string} socket - Socket name.
 * @returns {boolean} True when a session still exists on it.
 */
function socketAlive(socket) {
  const result = spawnSync('tmux', ['-L', socket, 'list-sessions'], { encoding: 'utf8' });
  return result.status === 0;
}

/**
 * List running stand-in subjects. The command line is read rather than a process group, because a
 * group id is unknown once the runner that owned it has been killed.
 *
 * @param {string} [scope] - A session id or a folder path unique to one test; empty scans every
 *   subject on the machine.
 * @returns {string[]} Matching `ps` lines.
 */
function subjectProcesses(scope) {
  const ps = spawnSync('ps', ['-eo', 'pid=,command='], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return String(ps.stdout || '')
    .split('\n')
    .filter((line) => line.includes('fake-subject.cjs'))
    .filter((line) => !scope || line.includes(scope))
    .map((line) => line.trim());
}

/**
 * Find processes whose command line carries a unique test marker.
 *
 * @param {string} marker - Unique argument passed to the setup process.
 * @returns {number[]} Matching process ids.
 */
function markedProcessPids(marker) {
  const pattern = `[${marker[0]}]${marker.slice(1)}`;
  const result = spawnSync('pgrep', ['-f', pattern], { encoding: 'utf8' });
  if (result.status === 1) return [];
  assert.strictEqual(result.status, 0, `pgrep failed: ${result.stderr}`);
  return String(result.stdout || '').trim().split('\n').filter(Boolean).map(Number);
}

/**
 * Poll a predicate until it holds.
 *
 * @param {() => boolean} predicate - Condition to wait for.
 * @param {number} timeoutMs - Longest wait.
 * @param {string} label - Failure message.
 * @returns {Promise<void>} Resolves once the condition holds.
 */
async function waitFor(predicate, timeoutMs, label) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`timed out waiting for ${label}`);
}

/**
 * Test whether tmux is installed.
 *
 * @returns {boolean} True when the binary answers.
 */
function tmuxAvailable() {
  const result = spawnSync('tmux', ['-V'], { encoding: 'utf8' });
  return result.status === 0;
}

/**
 * Check the filesystem entry because a dead server can still leave its socket file behind.
 *
 * @param {string} socket - Socket name passed to `-L`.
 * @returns {string} Filesystem path for the private socket.
 */
function tmuxSocketPath(socket) {
  const tempDir = process.env.TMUX_TMPDIR || '/tmp';
  return path.join(tempDir, `tmux-${process.getuid()}`, socket);
}

/**
 * Use captured terminal text so parser checks need no live runtime.
 *
 * @param {string} name - Fixture filename.
 * @returns {string} Captured screen text.
 */
function readQuestionScreen(name) {
  const file = path.join(__dirname, 'fixtures', 'question-screens', name);
  return fs.readFileSync(file, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GROUPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every refusal. None of these may reach tmux, so they run without it.
 */
function refusals() {
  const dir = tempDir('refusals');
  const repo = makeRepo('refusals-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'ok.md', {
    runtimes: ['claude-code'],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const base = ['--scenario', scenario, '--runtime', 'fake', '--out', out, '--repo-root', repo];

  const missingScratch = runCli(base);
  assert.strictEqual(missingScratch.code, 2, 'a missing --scratch is a usage error');
  assert.match(missingScratch.stderr, /--scratch is required/);

  const insideRepo = runCli([...base, '--scratch', path.join(repo, 'scratch')]);
  assert.strictEqual(insideRepo.code, 2, 'a scratch inside the repository is refused');
  assert.match(insideRepo.stderr, /SCRATCH_INSIDE_REPO/);
  assert.ok(!fs.existsSync(path.join(repo, 'scratch')), 'a refusal creates nothing');

  const symlinkScratch = path.join(dir, 'symlink-scratch');
  fs.mkdirSync(symlinkScratch);
  fs.writeFileSync(path.join(symlinkScratch, '.conversation-scratch'), 'marked\n');
  fs.symlinkSync(repo, path.join(symlinkScratch, 'fake'));
  const repoEntriesBeforeSymlink = fs.readdirSync(repo).sort();
  const repoSnapshotBeforeSymlink = runner.snapshotRepo(repo, ['decision-capture']);
  const symlinkProject = runCli([...base, '--scratch', symlinkScratch]);
  assert.strictEqual(symlinkProject.code, 2, 'a runtime project symlink is refused');
  assert.match(symlinkProject.stderr, /PROJECT_ESCAPED/);
  assert.ok(symlinkProject.stderr.includes(fs.realpathSync(repo)), 'the refusal names the resolved repository path');
  assert.deepStrictEqual(
    fs.readdirSync(repo).sort(),
    repoEntriesBeforeSymlink,
    'a symlink refusal writes nothing into the repository',
  );
  assert.deepStrictEqual(
    runner.snapshotRepo(repo, ['decision-capture']),
    repoSnapshotBeforeSymlink,
    'a symlink refusal leaves watched repository state unchanged',
  );
  assert.strictEqual(fs.existsSync(path.join(repo, '.conversation-scratch')), false);

  const dirtyScratch = path.join(dir, 'dirty');
  fs.mkdirSync(dirtyScratch);
  fs.writeFileSync(path.join(dirtyScratch, 'notes.txt'), 'unrelated work\n');
  const unmarked = runCli([...base, '--scratch', dirtyScratch]);
  assert.strictEqual(unmarked.code, 2, 'a non-empty scratch without the marker is refused');
  assert.match(unmarked.stderr, /SCRATCH_UNMARKED/);

  const failingSetup = writeScenario(dir, 'failing-setup.md', {
    runtimes: ['claude-code'],
    setup: ['exit 7'],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const setupRun = runCli([
    '--scenario', failingSetup,
    '--runtime', 'fake',
    '--out', out,
    '--repo-root', repo,
    '--scratch', path.join(dir, 'setup-scratch'),
  ]);
  assert.strictEqual(setupRun.code, 2, 'a failing setup command is refused');
  assert.match(setupRun.stderr, /SETUP_FAILED/);

  const setupWritesRepo = writeScenario(dir, 'setup-writes-repo.md', {
    runtimes: ['claude-code'],
    setup: ['touch "$CONVERSATION_REPO_ROOT/specs/setup-created.txt"'],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const setupOut = path.join(dir, 'setup-changed-out');
  const setupChanged = runCli([
    '--scenario', setupWritesRepo,
    '--runtime', 'fake',
    '--out', setupOut,
    '--repo-root', repo,
    '--scratch', path.join(dir, 'setup-changed-scratch'),
  ]);
  assert.strictEqual(setupChanged.code, 2, 'setup repository writes are refused');
  assert.match(setupChanged.stderr, /refused \(SETUP_CHANGED_REPO\):/);
  const setupBefore = path.join(setupOut, 'setup-repo-before.txt');
  const setupAfter = path.join(setupOut, 'setup-repo-after.txt');
  assert.ok(fs.existsSync(setupBefore), 'the setup baseline snapshot is saved');
  assert.ok(fs.existsSync(setupAfter), 'the post-setup snapshot is saved');
  assert.notStrictEqual(
    fs.readFileSync(setupBefore, 'utf8'),
    fs.readFileSync(setupAfter, 'utf8'),
    'the setup snapshots show the repository change',
  );
  assert.match(fs.readFileSync(setupAfter, 'utf8'), /setup-created\.txt/);

  const escapingSetup = writeScenario(dir, 'escaping-setup.md', {
    runtimes: ['claude-code'],
    setup: ['ln -s /tmp specs'],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const containmentRun = runCli([
    '--scenario', escapingSetup,
    '--runtime', 'fake',
    '--out', out,
    '--repo-root', repo,
    '--scratch', path.join(dir, 'escape-scratch'),
  ]);
  assert.strictEqual(containmentRun.code, 2, 'a linked specs folder is refused');
  assert.match(containmentRun.stderr, /CONTAINMENT_ESCAPED/);

  const reusedOut = path.join(dir, 'reused-out');
  fs.mkdirSync(path.join(reusedOut, 'fake'), { recursive: true });
  fs.writeFileSync(path.join(reusedOut, 'fake', 'result.json'), '{"verdict":"PASS"}\n');
  const reuse = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--out', reusedOut,
    '--repo-root', repo,
    '--scratch', path.join(dir, 'reuse-scratch'),
  ]);
  assert.strictEqual(reuse.code, 2, 'a non-empty evidence folder needs --overwrite');
  assert.match(reuse.stderr, /without --overwrite/);
  assert.strictEqual(
    fs.readFileSync(path.join(reusedOut, 'fake', 'result.json'), 'utf8'),
    '{"verdict":"PASS"}\n',
    'a refusal leaves the previous evidence alone',
  );
}

/** A setup skip records the blocker and evidence without starting the fake subject. */
function setupExit77SkipsRuntime() {
  const dir = tempDir('setup-skip');
  const repo = makeRepo('setup-skip-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'setup-skip.md', {
    runtimes: ['claude-code'],
    setup: ['echo fixture missing; exit 77'],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--out', out,
    '--repo-root', repo,
    '--scratch', scratch,
  ]);

  assert.strictEqual(run.code, 0, `a setup skip exits 0: ${run.stderr}`);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'SKIP', 'the runtime is skipped');
  assert.strictEqual(result.blocker, 'fixture missing', 'the setup output names the blocker');
  assert.deepStrictEqual(result.turns, [], 'the subject has no recorded turns');
  assert.match(
    fs.readFileSync(path.join(out, 'matrix.md'), 'utf8'),
    /\| fake \| SKIP \| 0\/1 \| fixture missing \| fake \|/,
    'the runtime matrix records the skipped row and blocker',
  );
  assert.ok(
    fs.existsSync(path.join(scratch, 'fake', '.conversation-scratch')),
    'the guarded scratch project remains available',
  );
  assert.match(
    fs.readFileSync(path.join(out, 'fake', 'setup.log'), 'utf8'),
    /fixture missing/,
    'the setup output is retained as evidence',
  );
  assert.strictEqual(
    fs.existsSync(path.join(out, 'fake', 'actions.jsonl')),
    false,
    'the subject action log is absent because it was not launched',
  );
  assert.strictEqual(
    fs.existsSync(path.join(out, 'fake', 'raw-pane.log')),
    false,
    'the subject pane log is absent because it was not launched',
  );
}

/** All runtime paths must pass before overwrite or setup changes anything. */
function multiRuntimeGuardsBeforeSideEffects() {
  const dir = tempDir('multi-runtime-guard');
  const repo = makeRepo('multi-runtime-guard-repo');
  const out = path.join(dir, 'out');
  const fakeOut = path.join(out, 'fake');
  fs.mkdirSync(fakeOut, { recursive: true });
  fs.writeFileSync(path.join(fakeOut, 'marker.txt'), 'keep\n');

  const scratch = path.join(dir, 'scratch');
  fs.mkdirSync(scratch);
  fs.writeFileSync(path.join(scratch, '.conversation-scratch'), 'marked\n');
  const outsideProject = tempDir('outside-codex-project');
  fs.symlinkSync(outsideProject, path.join(scratch, 'codex'), 'dir');

  const fakeBin = path.join(dir, 'bin');
  fs.mkdirSync(fakeBin);
  const codexBin = path.join(fakeBin, 'codex');
  fs.writeFileSync(codexBin, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(codexBin, 0o755);

  const scenario = writeScenario(dir, 'multi-runtime-guard.md', {
    runtimes: ['codex'],
    setup: ['touch setup-ran'],
    turns: [{ id: 'unused', send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake,codex',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
    '--overwrite',
  ], { env: { PATH: `${fakeBin}${path.delimiter}${process.env.PATH || ''}` } });

  assert.strictEqual(run.code, 2, `an escaping later runtime is refused: ${run.stderr}`);
  assert.match(run.stderr, /PROJECT_ESCAPED/);
  assert.strictEqual(fs.readFileSync(path.join(fakeOut, 'marker.txt'), 'utf8'), 'keep\n');
  assert.strictEqual(fs.existsSync(path.join(scratch, 'fake', 'setup-ran')), false);
}

/**
 * A full conversation: single select, multi select, Other, a chat reply, a restart and a
 * compaction, with each answer landing in the project's answer file.
 */
function fakeSubjectRun() {
  const dir = tempDir('fake-run');
  const repo = makeRepo('fake-run-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'conversation.md', {
    runtimes: ['claude-code'],
    turns: [
      {
        id: 'single',
        send: 'ask single Which color|red,green,blue',
        delay_ms: 0,
        timeout_ms: 20000,
        questions: [{ match: 'color', answer: { select: ['green'] }, delay_ms: 0 }],
        check: 'grep -qx green answers.txt',
      },
      {
        id: 'multi',
        send: 'ask multi Pick|a,b,c',
        delay_ms: 0,
        timeout_ms: 20000,
        questions: [{ match: 'Pick', answer: { select: ['a', 'c'], multi: true }, delay_ms: 0 }],
        check: "grep -qx 'a, c' answers.txt",
      },
      {
        id: 'other',
        send: 'ask other Your name|bob,ann',
        delay_ms: 0,
        timeout_ms: 20000,
        questions: [{ match: 'name', answer: { other: 'zoe' }, delay_ms: 0 }],
        check: 'grep -qx zoe answers.txt',
      },
      {
        id: 'reply',
        send: 'chat What is your name',
        delay_ms: 0,
        timeout_ms: 20000,
        questions: [{ match: 'your name', answer: { reply: 'zed' }, delay_ms: 0 }],
        check: 'grep -qx zed answers.txt',
      },
      {
        id: 'restart',
        action: 'restart',
        delay_ms: 0,
        timeout_ms: 40000,
        check: 'test $(wc -l < session.log) -ge 2',
      },
      {
        id: 'compact',
        action: 'compact',
        delay_ms: 0,
        timeout_ms: 20000,
        check: 'test -s answers.txt',
      },
    ],
  });

  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
    '--seed', '7',
  ]);
  assert.strictEqual(run.code, 0, `run should pass: ${run.stdout}\n${run.stderr}`);

  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'PASS');
  assert.deepStrictEqual(
    result.turns.map((turn) => turn.status),
    ['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS'],
  );
  assert.strictEqual(result.seed, 7);
  assert.match(result.session_id, /^[0-9a-f-]{36}$/);

  const answers = fs
    .readFileSync(path.join(scratch, 'fake', 'answers.txt'), 'utf8')
    .trim()
    .split('\n');
  assert.deepStrictEqual(answers, ['green', 'a, c', 'zoe', 'zed'], 'each answer is recorded once');
  assert.strictEqual(
    fs.readFileSync(path.join(scratch, 'fake', 'session.log'), 'utf8').trim().split('\n').length,
    2,
    'the restart relaunched the same session',
  );

  state.fakeRun = { out, scratch, repo, result };
}

/**
 * A check runs after the turn's own evidence is written, so it can read the raw pane slice and the
 * full plain-text scrollback from its evidence folder.
 */
function checkReadsTurnEvidence() {
  const dir = tempDir('check-evidence');
  const repo = makeRepo('check-evidence-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'check-evidence.md', {
    runtimes: ['claude-code'],
    turns: [{
      id: 'reads-evidence',
      send: 'hello evidence',
      delay_ms: 0,
      timeout_ms: 20000,
      check: 'test -s "$CONVERSATION_TURN_DIR/raw-pane.log" '
        + '&& test -s "$CONVERSATION_TURN_DIR/history.txt"',
    }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `run should pass: ${run.stdout}\n${run.stderr}`);

  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'PASS');
  assert.deepStrictEqual(result.turns.map((turn) => turn.status), ['PASS']);
  assert.match(
    fs.readFileSync(path.join(out, 'fake', 'turns', 'reads-evidence', 'history.txt'), 'utf8'),
    /ok: hello evidence/,
    'the history holds the scrollback the check ran against',
  );
}

/** Literal punctuation and option-looking text must arrive unchanged at the fake subject. */
function literalTextSends() {
  const dir = tempDir('literal-text');
  const repo = makeRepo('literal-text-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(dir, 'out');
  const expected = ['-x dash', 'ok;', ';'];
  const checkFor = (values) => (
    `printf '%s\\n' ${values.map((value) => `'${JSON.stringify(value)}'`).join(' ')} | cmp -s - received.txt`
  );
  const scenario = writeScenario(dir, 'literal-text.md', {
    runtimes: ['claude-code'],
    turns: expected.map((send, index) => ({
      id: `literal-${index + 1}`,
      send,
      delay_ms: 0,
      timeout_ms: 20000,
      check: checkFor(expected.slice(0, index + 1)),
    })),
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `literal text run should pass: ${run.stdout}\n${run.stderr}`);
  assert.strictEqual(readResult(out, 'fake').verdict, 'PASS');
  const received = fs.readFileSync(path.join(scratch, 'fake', 'received.txt'), 'utf8')
    .trimEnd()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.deepStrictEqual(received, expected, 'the fake subject received each exact input string once');
}

/** Startup keys are sent only after the fake trust screen has completed its redraw. */
function startupScreenWaitsForRedraw() {
  const dir = tempDir('startup-redraw');
  const repo = makeRepo('startup-redraw-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'startup-redraw.md', {
    runtimes: ['claude-code'],
    env: { CONVERSATION_FAKE_STARTUP_REDRAW: '1' },
    turns: [{
      id: 'after-startup',
      send: 'hello after startup',
      delay_ms: 0,
      timeout_ms: 20000,
      check: 'grep -qx trusted startup-choice.txt',
    }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `run should pass: ${run.stdout}\n${run.stderr}`);

  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'PASS');
  assert.deepStrictEqual(result.turns.map((turn) => turn.status), ['PASS']);
  assert.strictEqual(
    fs.readFileSync(path.join(scratch, 'fake', 'startup-choice.txt'), 'utf8'),
    'trusted\n',
    'the startup choice was accepted after the final drawing',
  );
}

/**
 * A question asked in plain chat, with no dialog, is answered once the screen settles, and only
 * text the subject wrote after the turn's own typed line counts as that question. The evidence
 * folder sits inside the repository's `specs/`, so the run also shows that the runner's own
 * evidence writes are not reported as a repository change.
 */
function chatQuestionAtSettle() {
  const dir = tempDir('prose');
  const repo = makeRepo('prose-repo');
  const scratch = path.join(dir, 'scratch');
  const out = path.join(repo, 'specs', 'runs');
  const scenario = writeScenario(dir, 'prose.md', {
    runtimes: ['claude-code'],
    turns: [
      {
        id: 'prose',
        send: 'prose So far you picked the colours green and teal. Do you want to keep them?',
        delay_ms: 0,
        timeout_ms: 20000,
        questions: [{ match: '[Kk]eep', answer: { reply: 'yes' }, delay_ms: 0 }],
        check: 'grep -qx yes answers.txt',
      },
    ],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `run should pass: ${run.stdout}\n${run.stderr}`);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'PASS');
  assert.strictEqual(result.repo.changed, false, 'evidence inside specs is not a repository change');
  assert.deepStrictEqual(
    fs.readFileSync(path.join(scratch, 'fake', 'answers.txt'), 'utf8').trim().split('\n'),
    ['yes'],
    'the chat reply is sent once',
  );

  const send = 'Ask me in plain chat whether I want to keep the selected colours.';
  const earlier = 'Do you want to keep them?\n❯ yes\n';
  assert.doesNotMatch(
    runner.textAfterSentLine(`${earlier}❯ ${send}\n\n⏺ Saved to answers.txt.\n❯ `, send),
    /[Kk]eep/,
    'a question from before the typed line is not this turn\'s question',
  );
  assert.match(
    runner.textAfterSentLine(`${earlier}❯ ${send}\n\n⏺ Do you want to keep them?\n❯ `, send),
    /[Kk]eep/,
    'a question after the typed line is found',
  );
}

/** A question the script never expected fails the turn. */
function unexpectedQuestion() {
  const dir = tempDir('unexpected');
  const repo = makeRepo('unexpected-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'unexpected.md', {
    runtimes: ['claude-code'],
    turns: [{ id: 'surprise', send: 'chat Tell me a secret', delay_ms: 0, timeout_ms: 20000, check: 'true' }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 1, 'a failed turn exits 1');
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'FAIL');
  assert.strictEqual(result.turns[0].reason, 'UNEXPECTED_QUESTION');
  assert.ok(fs.existsSync(path.join(out, 'fake', 'turns', 'surprise', 'screen.txt')));
}

/** A turn that cannot settle inside its budget fails as TIMEOUT. */
function timeoutTurn() {
  const dir = tempDir('timeout');
  const repo = makeRepo('timeout-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'timeout.md', {
    runtimes: ['claude-code'],
    turns: [{ id: 'slow', send: 'hello', delay_ms: 0, timeout_ms: 400, check: 'true' }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 1);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.turns[0].reason, 'TIMEOUT');
  assert.ok(fs.existsSync(path.join(out, 'fake', 'turns', 'slow', 'screen.txt')));
}

/** A check that reports skip marks the turn SKIP and the run keeps going. */
function skipAndContinue() {
  const dir = tempDir('skip');
  const repo = makeRepo('skip-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'skip.md', {
    runtimes: ['claude-code'],
    turns: [
      { id: 'skipped', send: 'hello', delay_ms: 0, check: 'echo blocked by marker; exit 77' },
      { id: 'after', send: 'hello', delay_ms: 0, check: 'true' },
    ],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `a skipped turn does not fail the run: ${run.stderr}`);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.turns[0].status, 'SKIP');
  assert.strictEqual(result.turns[0].blocker, 'blocked by marker');
  assert.strictEqual(result.turns[1].status, 'PASS');
  assert.strictEqual(result.verdict, 'PASS');
}

/** A retried turn records both attempts and passes on the second. */
function retryOnSecondAttempt() {
  const dir = tempDir('retry');
  const repo = makeRepo('retry-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'retry.md', {
    runtimes: ['claude-code'],
    turns: [
      {
        id: 'flaky',
        send: 'hello',
        delay_ms: 0,
        retry: 1,
        check: 'if [ -f flag ]; then exit 0; else touch flag; exit 1; fi',
      },
    ],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 0, `the retry should pass: ${run.stderr}`);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.turns[0].status, 'PASS');
  assert.strictEqual(result.turns[0].attempts, 2);
  const checkpoints = fs
    .readFileSync(path.join(out, 'fake', 'checkpoints.tsv'), 'utf8')
    .trim()
    .split('\n');
  assert.strictEqual(checkpoints.length, 3, 'header plus both attempts');
  assert.match(checkpoints[1], /^flaky\tFAIL\t1\t/);
  assert.match(checkpoints[2], /^flaky\tPASS\t2\t/);
}

/** A check that overruns its deadline fails the turn and the later turn never runs. */
function checkTimeoutStopsTheRun() {
  const dir = tempDir('check-timeout');
  const repo = makeRepo('check-timeout-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'check-timeout.md', {
    runtimes: ['claude-code'],
    turns: [
      { id: 'stuck', send: 'hello', delay_ms: 0, check: 'sleep 30' },
      { id: 'later', send: 'hello', delay_ms: 0, check: 'true' },
    ],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ], { env: { CONVERSATION_CHECK_TIMEOUT_MS: '1500' } });
  assert.strictEqual(run.code, 1);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.turns[0].status, 'FAIL');
  assert.strictEqual(result.turns[0].reason, 'CHECK_TIMEOUT');
  assert.strictEqual(result.cleanup.childrenGone, true);
  assert.strictEqual(result.turns[1].status, 'FAIL');
  assert.ok(
    fs.readFileSync(path.join(out, 'fake', 'checkpoints.tsv'), 'utf8').includes('later\tNOT_RUN'),
    'a turn after the failure is recorded NOT_RUN',
  );
}

/** An append to a watched file that already existed fails the run as REPO_CHANGED. */
function repoChanged() {
  const dir = tempDir('repo-changed');
  const repo = makeRepo('repo-changed-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'repo-changed.md', {
    runtimes: ['claude-code'],
    turns: [
      {
        id: 'append',
        send: 'hello',
        delay_ms: 0,
        check: 'printf x >> "$CONVERSATION_REPO_ROOT/.skilled/skills/.state/decision-capture/queue.md"',
      },
    ],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  assert.strictEqual(run.code, 1, 'a repository write fails the run');
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'FAIL');
  assert.strictEqual(result.blocker, 'REPO_CHANGED');
  assert.strictEqual(result.repo.changed, true);
  const before = fs.readFileSync(path.join(out, 'fake', 'repo-before.txt'), 'utf8');
  const after = fs.readFileSync(path.join(out, 'fake', 'repo-after.txt'), 'utf8');
  assert.notStrictEqual(before, after, 'both snapshots are saved and they differ');
  assert.match(after, /queue\.md/);
  const matrix = fs.readFileSync(path.join(out, 'matrix.md'), 'utf8');
  assert.match(matrix, /\| fake \| FAIL \| 1\/1 \| REPO_CHANGED \|/);

  const specsRepo = makeRepo('repo-changed-specs-repo');
  const specsOut = path.join(dir, 'specs-out');
  const specsScenario = writeScenario(dir, 'repo-changed-specs.md', {
    runtimes: ['claude-code'],
    turns: [{
      id: 'create-spec',
      send: 'hello',
      delay_ms: 0,
      check: 'printf new > "$CONVERSATION_REPO_ROOT/specs/created-by-check.md"',
    }],
  });
  const specsRun = runCli([
    '--scenario', specsScenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'specs-scratch'),
    '--out', specsOut,
    '--repo-root', specsRepo,
  ]);
  assert.strictEqual(specsRun.code, 1, 'a specs write fails the run');
  const specsResult = readResult(specsOut, 'fake');
  assert.strictEqual(specsResult.verdict, 'FAIL');
  assert.strictEqual(specsResult.blocker, 'REPO_CHANGED');
  assert.strictEqual(fs.readFileSync(path.join(specsRepo, 'specs', 'created-by-check.md'), 'utf8'), 'new');
}

/** An unreadable watched directory fails closed instead of looking like an unchanged snapshot. */
function unreadableSnapshotFails() {
  const dir = tempDir('snapshot-incomplete');
  const repo = makeRepo('snapshot-incomplete-repo');
  const unreadable = path.join(repo, 'specs', 'unreadable');
  fs.mkdirSync(unreadable);
  fs.writeFileSync(path.join(unreadable, 'hidden.md'), 'hidden\n');
  const originalMode = fs.statSync(unreadable).mode & 0o777;
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'snapshot-incomplete.md', {
    runtimes: ['claude-code'],
    turns: [{ id: 'check', send: 'hello', delay_ms: 0, check: 'true' }],
  });

  let run;
  try {
    fs.chmodSync(unreadable, 0);
    run = runCli([
      '--scenario', scenario,
      '--runtime', 'fake',
      '--scratch', path.join(dir, 'scratch'),
      '--out', out,
      '--repo-root', repo,
    ]);
  } finally {
    fs.chmodSync(unreadable, originalMode);
  }

  assert.strictEqual(run.code, 1, 'an incomplete repository snapshot fails the runtime');
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'FAIL');
  assert.strictEqual(result.blocker, 'SNAPSHOT_INCOMPLETE');
}

/** Hook trust changes are removed while pre-existing Codex hook state is restored. */
async function hookTrustUndone() {
  const dir = tempDir('hook-trust');
  const repo = makeRepo('hook-trust-repo');
  const scratch = path.join(dir, 'scratch');
  const codexHome = path.join(dir, 'codex-home');
  const out = path.join(dir, 'out');
  const config = path.join(codexHome, 'config.toml');
  const guard = await runner.guardScratch({ scratch, repoRoot: repo, runtime: 'fake' });
  assert.strictEqual(guard.ok, true, guard.message || 'scratch project guard should pass');
  const project = fs.realpathSync(guard.project);
  const oldKey = `${project}/.codex/hooks.json:stop:0:0`;
  const missingKey = `${project}/.codex/hooks.json:session_start:1:0`;
  const addedKey = `${project}/.codex/hooks.json:session_start:0:0`;
  const outsideKey = '/elsewhere/.codex/hooks.json:stop:0:0';
  const originalConfig = [
    `[hooks.state."${oldKey}"]`,
    'trusted_hash = "sha256:old"',
    '',
    `[hooks.state."${missingKey}"]`,
    'trusted_hash = "sha256:missing"',
    '',
  ].join('\n');
  const missingEntry = [
    `[hooks.state."${missingKey}"]`,
    'trusted_hash = "sha256:missing"',
    '',
  ].join('\n');
  fs.mkdirSync(codexHome, { recursive: true });
  fs.writeFileSync(config, originalConfig);

  const scenario = writeScenario(dir, 'hook-trust.md', {
    runtimes: ['claude-code'],
    trust_hooks: true,
    turns: [{
      id: 'change-hooks',
      send: 'hello',
      delay_ms: 0,
      check: [
        `sed 's/sha256:old/sha256:new/' "$CODEX_HOME/config.toml" > "$CODEX_HOME/config.next"`,
        'mv "$CODEX_HOME/config.next" "$CODEX_HOME/config.toml"',
        `printf '[hooks.state."%s"]\\ntrusted_hash = "sha256:new"\\n' `
          + `"$PWD/.codex/hooks.json:session_start:0:0" >> "$CODEX_HOME/config.toml"`,
        `printf '[hooks.state."${outsideKey}"]\\ntrusted_hash = "sha256:outside"\\n' >> "$CODEX_HOME/config.toml"`,
        `node -e 'const fs = require("fs"); const file = process.env.CODEX_HOME + "/config.toml"; `
          + `const text = fs.readFileSync(file, "utf8"); `
          + `fs.writeFileSync(file, text.replace(${JSON.stringify(missingEntry)}, ""));'`,
      ].join(' && '),
    }],
  });
  const run = runCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', scratch,
    '--out', out,
    '--repo-root', repo,
  ], { env: { CODEX_HOME: codexHome } });
  assert.strictEqual(run.code, 0, `hook trust should be undone: ${run.stdout}\n${run.stderr}`);
  const result = readResult(out, 'fake');
  assert.strictEqual(result.verdict, 'PASS');
  const outsideEntry = `[hooks.state."${outsideKey}"]\ntrusted_hash = "sha256:outside"\n`;
  assert.strictEqual(
    fs.readFileSync(config, 'utf8'),
    `${originalConfig}${outsideEntry}`,
    'the run restores its own trust table and preserves the outside-project table byte-for-byte',
  );
  const hookTrust = JSON.parse(fs.readFileSync(path.join(out, 'fake', 'hook-trust.json'), 'utf8'));
  assert.strictEqual(hookTrust.ok, true);
  assert.ok(hookTrust.added.includes(addedKey));
  assert.ok(hookTrust.removed.includes(addedKey));
  assert.ok(hookTrust.changed.includes(oldKey));
  assert.deepStrictEqual(hookTrust.missing, [missingKey]);
  assert.ok(hookTrust.restored.includes(oldKey));
  assert.deepStrictEqual(hookTrust.outside_project, [outsideKey]);
  assert.deepStrictEqual(result.hook_trust, hookTrust);

  const noTrustOut = path.join(dir, 'no-trust-out');
  const noTrustScenario = writeScenario(dir, 'hook-trust-opt-out.md', {
    runtimes: ['claude-code'],
    turns: [{ id: 'no-change', send: 'hello', delay_ms: 0, check: 'true' }],
  });
  const configBeforeNoTrust = fs.readFileSync(config, 'utf8');
  const noTrustRun = runCli([
    '--scenario', noTrustScenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'no-trust-scratch'),
    '--out', noTrustOut,
    '--repo-root', repo,
  ], { env: { CODEX_HOME: codexHome } });
  assert.strictEqual(noTrustRun.code, 0, `opt-out run should pass: ${noTrustRun.stdout}\n${noTrustRun.stderr}`);
  const noTrustResult = readResult(noTrustOut, 'fake');
  assert.strictEqual(noTrustResult.hook_trust, null);
  assert.strictEqual(fs.readFileSync(config, 'utf8'), configBeforeNoTrust);
  assert.strictEqual(fs.existsSync(path.join(noTrustOut, 'fake', 'hook-trust.json')), false);
}

/** Every evidence file the run promises exists and the action log is well formed. */
function evidenceFiles() {
  const { out } = state.fakeRun;
  const runtimeDir = path.join(out, 'fake');
  const expected = [
    'result.json',
    'actions.jsonl',
    'raw-pane.log',
    'setup.log',
    'repo-before.txt',
    'repo-after.txt',
    'checkpoints.tsv',
    path.join('turns', 'single', 'screen.txt'),
    path.join('turns', 'single', 'question-1.txt'),
    path.join('turns', 'single', 'check.txt'),
    path.join('turns', 'single', 'raw-pane.log'),
    path.join('turns', 'restart', 'screen.txt'),
    path.join('turns', 'compact', 'check.txt'),
    path.join('..', 'matrix.md'),
  ];
  for (const relative of expected) {
    const file = path.join(runtimeDir, relative);
    assert.ok(fs.existsSync(file), `missing evidence file: ${file}`);
  }

  const actions = fs
    .readFileSync(path.join(runtimeDir, 'actions.jsonl'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.ok(actions.length >= 6, 'one entry per keystroke group');
  assert.ok(actions.every((entry) => typeof entry.time === 'string' && entry.turn));
  assert.ok(actions.some((entry) => entry.kind === 'exit'), 'the restart logged its exit keys');
  assert.ok(actions.some((entry) => entry.kind === 'compact'), 'the compaction logged its key');

  const matrix = fs.readFileSync(path.join(out, 'matrix.md'), 'utf8');
  assert.match(matrix, /\| fake \| PASS \| 6\/6 \|/);
}

/** Nothing the run started is still alive once it returns. */
function cleanupLeavesNothing() {
  const { result } = state.fakeRun;
  assert.strictEqual(
    socketAlive(result.socket),
    false,
    `private socket ${result.socket} still answers`,
  );
  assert.strictEqual(
    fs.existsSync(tmuxSocketPath(result.socket)),
    false,
    `private socket file ${result.socket} still exists`,
  );
  const survivors = subjectProcesses(result.session_id);
  assert.deepStrictEqual(survivors, [], 'no subject process outlived the run');
}

/** Catch terminal-screen drift without launching a live runtime. */
function adapterScreens() {
  const adapter = runner.ADAPTERS['claude-code'];
  const expectedQuestion = {
    text: 'Which areas would you like me to focus on in this repository?',
    options: ['Documentation', 'Tests', 'Code quality'],
    multi: true,
  };
  assert.strictEqual(adapter.probed, true, 'Claude Code is marked probed');
  assert.deepStrictEqual(adapter.launch({ sessionId: 'probe-session' }), [
    'claude',
    '--session-id',
    'probe-session',
    '--dangerously-skip-permissions',
  ]);
  assert.deepStrictEqual(adapter.resume({ sessionId: 'probe-session' }), [
    'claude',
    '--resume',
    'probe-session',
    '--dangerously-skip-permissions',
  ]);
  assert.strictEqual(adapter.ready.test('❯'), true, 'the empty prompt line marks ready');
  assert.strictEqual(adapter.busy.test('✻ Baked for 5s'), true, 'the spinner marks busy');
  assert.strictEqual(
    adapter.busy.test('✻ Baked for 5s · done 5:45 AM'),
    false,
    'the settled spinner is not busy',
  );
  assert.deepStrictEqual(
    adapter.parseQuestion(readQuestionScreen('claude-code.txt')),
    expectedQuestion,
  );
  assert.deepStrictEqual(
    adapter.parseQuestion(readQuestionScreen('claude-code-multi-before-submit.txt')),
    expectedQuestion,
  );

  const single = adapter.parseQuestion(readQuestionScreen('claude-code-single.txt'));
  assert.deepStrictEqual(single, {
    text: 'Which should I work on first in this repository: tests or code quality?',
    options: ['Tests', 'Code quality'],
    multi: false,
  });
  // A live dialog ended its question line with a hint sentence, not a question mark.
  const hinted = adapter.parseQuestion(readQuestionScreen('claude-code-other.txt'));
  assert.deepStrictEqual(hinted, {
    text: 'What custom colour do you want? Choose "Other" to type your own.',
    options: ['purple', 'orange'],
    multi: false,
  });
  for (const name of [
    'claude-code-ready.txt',
    'claude-code-trust.txt',
    'claude-code-review.txt',
  ]) {
    assert.strictEqual(
      adapter.parseQuestion(readQuestionScreen(name)),
      null,
      `${name} is not a question`,
    );
  }

  assert.deepStrictEqual(
    adapter.answerKeys(expectedQuestion, { select: ['Tests', 'Code quality'] }),
    [
      { key: 'Down' },
      { key: 'Enter' },
      { key: 'Down' },
      { key: 'Enter' },
      { key: 'Down' },
      { key: 'Down' },
      { key: 'Enter' },
    ],
  );
  // The review screen is confirmed by the confirm step, never by the answer keys.
  const review = readQuestionScreen('claude-code-review.txt');
  assert(adapter.confirmDetect.test(review), 'review screen is confirmed');
  assert.deepStrictEqual(adapter.confirm, [{ key: 'Enter' }]);
  assert(!adapter.confirmDetect.test(readQuestionScreen('claude-code.txt')), 'a question is not a review');
  assert.deepStrictEqual(
    adapter.answerKeys(single, { other: 'Security' }),
    [
      { key: 'Down' },
      { key: 'Down' },
      { text: 'Security' },
      { key: 'Enter' },
    ],
  );
  assert.deepStrictEqual(adapter.startup, [{ key: 'Down' }, { key: 'Enter' }]);
  assert.strictEqual(
    adapter.startupDetect.test(readQuestionScreen('claude-code-trust.txt')),
    true,
    'the trust screen triggers startup keys',
  );

  openCodeScreens();
  codexScreens();
  piScreens();
  devinScreens();

  const runtimes = Object.entries(runner.ADAPTERS).filter(([id]) => id !== 'fake');
  state.probed = runtimes.filter(([, runtime]) => runtime.probed).length;
  state.pending = runtimes.length - state.probed;
}

/** Keep quota detection limited to the recorded usage-limit screen. */
function quotaScreen() {
  const quotaLine = runner.detectQuotaScreen(readQuestionScreen('codex-quota.txt'));
  assert.ok(
    quotaLine && quotaLine.toLowerCase().includes('usage limit'),
    'the Codex usage-limit screen is detected',
  );

  const screenDir = path.join(__dirname, 'fixtures', 'question-screens');
  for (const entry of fs.readdirSync(screenDir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === 'codex-quota.txt') continue;
    assert.strictEqual(
      runner.detectQuotaScreen(readQuestionScreen(entry.name)),
      null,
      `${entry.name} is not a quota screen`,
    );
  }
}

/** Devin's recorded dialog screens, its trust screen and its idle and busy lines. */
function devinScreens() {
  const adapter = runner.ADAPTERS.devin;
  assert.strictEqual(adapter.probed, true, 'Devin is marked probed');
  assert.deepStrictEqual(adapter.resume({}), ['devin', '--continue', '--permission-mode', 'dangerous']);
  const multi = adapter.parseQuestion(readQuestionScreen('devin.txt'));
  assert.deepStrictEqual(multi, {
    text: 'Which should I try next to resolve the `mk devin` hook issue? (multi-select)',
    options: ['Build runtime package', 'Inspect hook config', 'Check npm logs'],
    multi: true,
  });
  const single = adapter.parseQuestion(readQuestionScreen('devin-single.txt'));
  assert.deepStrictEqual(
    single,
    { text: 'Which colour do you choose?', options: ['red', 'green', 'blue'], multi: false },
  );
  // While Other is typed the rows lose their numbers, so no new question is reported.
  for (const name of ['devin-ready.txt', 'devin-trust.txt', 'devin-other.txt']) {
    assert.strictEqual(adapter.parseQuestion(readQuestionScreen(name)), null, `${name} is not a question`);
  }
  assert(adapter.startupScreens[0].detect.test(readQuestionScreen('devin-trust.txt')), 'the trust screen is passed');
  const ready = readQuestionScreen('devin-ready.txt');
  assert(ready.split('\n').some((line) => adapter.ready.test(line)), 'the input line marks ready');
  assert(
    !readQuestionScreen('devin-trust.txt').split('\n').some((line) => adapter.ready.test(line)),
    'a trust row is not ready',
  );
  assert(!adapter.busy.test(ready), 'the idle screen is not busy');
  assert(adapter.busy.test('⠉⠁ Thinking · 2s (esc twice to interrupt)'), 'the thinking line marks busy');
  assert(adapter.keyAfterTextMs > 0, 'Enter waits until typed text is no longer read as a paste');

  assert.deepStrictEqual(adapter.answerKeys(single, { select: ['green'] }), [{ key: 'Down' }, { key: 'Enter' }]);
  assert.deepStrictEqual(
    adapter.answerKeys(multi, { select: ['Build runtime package', 'Check npm logs'], multi: true }),
    [{ key: 'Space' }, { key: 'Down' }, { key: 'Down' }, { key: 'Space' }, { key: 'Enter' }],
  );
  assert.deepStrictEqual(
    adapter.answerKeys(single, { other: 'teal' }),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Down' }, { text: 'teal' }, { key: 'Enter' }],
  );
}

/** Pi's recorded dialog screens, its pick-list multi-select and its idle and busy lines. */
function piScreens() {
  const adapter = runner.ADAPTERS.pi;
  assert.strictEqual(adapter.probed, true, 'Pi is marked probed');
  assert.deepStrictEqual(adapter.exitKeys, [{ text: '/quit' }, { key: 'Enter' }]);
  const multi = adapter.parseQuestion(readQuestionScreen('pi.txt'));
  assert.deepStrictEqual(multi, {
    text: 'Next focus: Which of these should I focus on next?',
    options: ['Explore the codebase', 'Review recent changes', 'Run the test suite'],
    multi: true,
  });
  const single = adapter.parseQuestion(readQuestionScreen('pi-single.txt'));
  assert.deepStrictEqual(
    single,
    { text: 'Color: Which colour do you prefer?', options: ['Red', 'Green', 'Blue'], multi: false },
  );
  assert.strictEqual(
    adapter.parseQuestion(readQuestionScreen('pi-multi-picked.txt')).text,
    multi.text,
    'a dialog with one pick made is the same question',
  );
  for (const name of ['pi-ready.txt', 'pi-other.txt']) {
    assert.strictEqual(adapter.parseQuestion(readQuestionScreen(name)), null, `${name} is not a choice dialog`);
  }
  const ready = readQuestionScreen('pi-ready.txt');
  assert(ready.split('\n').some((line) => adapter.ready.test(line)), 'the input box marks ready');
  assert(!adapter.busy.test(ready), 'the idle screen is not busy');
  assert(
    adapter.busy.test(' ✶ Thundering… (thought for 1s · ↓ 193 tokens · 1s)'),
    'the spinner line marks busy',
  );

  assert.deepStrictEqual(adapter.answerKeys(single, { select: ['green'] }), [{ key: 'Down' }, { key: 'Enter' }]);
  assert.deepStrictEqual(
    adapter.answerKeys(multi, { select: ['Explore the codebase', 'Run the test suite'], multi: true }),
    [{ key: 'Enter' }, { key: 'Down' }, { key: 'Enter' }, { key: 'Down' }, { key: 'Down' }, { key: 'Enter' }],
    'each pick starts from the top and the answer ends on Done',
  );
  assert.deepStrictEqual(
    adapter.answerKeys(single, { other: 'teal' }),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Down' }, { key: 'Enter' }, { text: 'teal' }, { key: 'Enter' }],
  );

  // The ask_user_question dialog: Space toggles, the answer is sent from Submit, and the
  // free-text row takes typed text directly.
  const dialog = adapter.parseQuestion(readQuestionScreen('pi-dialog-multi.txt'));
  assert.deepStrictEqual(dialog, {
    text: 'Which sizes would you like? (Select all that apply)',
    options: ['Small', 'Medium', 'Large'],
    multi: true,
    dialog: true,
  });
  assert.deepStrictEqual(
    adapter.answerKeys(dialog, { select: ['small', 'large'], multi: true }),
    [
      { key: 'Space' }, { key: 'Down' }, { key: 'Down' }, { key: 'Space' },
      { key: 'Down' }, { key: 'Down' }, { key: 'Enter' },
    ],
  );
  const dialogSingle = adapter.parseQuestion(readQuestionScreen('pi-dialog-single.txt'));
  assert.deepStrictEqual(
    dialogSingle,
    { text: 'Which colour would you like?', options: ['Red', 'Green', 'Blue'], multi: false, dialog: true },
  );
  assert.deepStrictEqual(adapter.answerKeys(dialogSingle, { select: ['green'] }), [{ key: 'Down' }, { key: 'Enter' }]);
  assert.deepStrictEqual(
    adapter.answerKeys(dialogSingle, { other: 'teal' }),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Down' }, { text: 'teal' }, { key: 'Enter' }],
  );
}

/** Codex's recorded screens: its single-choice dialog, its note row and its startup screens. */
function codexScreens() {
  const adapter = runner.ADAPTERS.codex;
  const launch = adapter.launch({});
  const resume = adapter.resume({});
  assert.strictEqual(adapter.probed, true, 'Codex is marked probed');
  assert.deepStrictEqual(resume.slice(0, 3), ['codex', 'resume', '--last']);
  for (const argv of [launch, resume]) {
    assert(!argv.includes('--dangerously-bypass-approvals-and-sandbox'), 'Codex keeps its sandbox enabled');
    assert(argv.includes('workspace-write'), 'Codex uses the workspace-write sandbox');
  }
  const question = adapter.parseQuestion(readQuestionScreen('codex.txt'));
  assert.deepStrictEqual(question, {
    text: 'Which areas should I focus on? Select any that apply, or type several answers.',
    options: ['Writing', 'Research', 'Coding'],
    multi: false,
  });
  assert.deepStrictEqual(
    adapter.parseQuestion(readQuestionScreen('codex-other.txt')),
    question,
    'typing a note keeps the dialog',
  );
  for (const name of ['codex-trust.txt', 'codex-hooks.txt', 'codex-update.txt']) {
    assert.strictEqual(adapter.parseQuestion(readQuestionScreen(name)), null, `${name} is not a question`);
    const matches = adapter.startupScreens.filter((entry) => entry.detect.test(readQuestionScreen(name)));
    assert.strictEqual(matches.length, 1, `${name} matches exactly one startup screen`);
  }
  const update = adapter.startupScreens.find((entry) => entry.detect.test(readQuestionScreen('codex-update.txt')));
  assert.deepStrictEqual(update.keys, [{ key: 'Down' }, { key: 'Enter' }], 'the update offer is skipped');
  const hooks = adapter.startupScreens.find((entry) => entry.detect.test(readQuestionScreen('codex-hooks.txt')));
  const screen = readQuestionScreen('codex-hooks.txt');
  const project = tempDir('codex-hook-count');
  const hooksFile = path.join(project, '.codex', 'hooks.json');
  fs.mkdirSync(path.dirname(hooksFile), { recursive: true });
  const handler = { type: 'command', command: 'true' };
  fs.writeFileSync(hooksFile, JSON.stringify({
    hooks: {
      SessionStart: [{ hooks: [handler, handler] }, { hooks: [handler] }],
      Stop: [{ hooks: [handler] }],
    },
  }));
  assert.strictEqual(
    runner.countProjectHookHandlers(project),
    4,
    'the helper sums handlers across event arrays and entries',
  );
  assert.strictEqual(
    runner.countProjectHookHandlers(tempDir('codex-hook-count-missing')),
    0,
    'a missing hooks file counts as zero',
  );

  fs.writeFileSync(hooksFile, JSON.stringify({ hooks: { SessionStart: [{ hooks: Array(7).fill(handler) }] } }));
  const matchingHooks = { trustHooks: true, project };
  assert.deepStrictEqual(hooks.keys(matchingHooks, screen), [{ key: 'Down' }, { key: 'Enter' }]);
  assert.strictEqual(matchingHooks.hookTrustRefused, undefined, 'matching project handlers allow Trust all');

  fs.writeFileSync(hooksFile, JSON.stringify({ hooks: { SessionStart: [{ hooks: Array(6).fill(handler) }] } }));
  const outsideHooks = { trustHooks: true, project };
  assert.deepStrictEqual(
    hooks.keys(outsideHooks, screen),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Enter' }],
    'more displayed hooks than project handlers continues without trusting',
  );
  assert.strictEqual(outsideHooks.hookTrustRefused, true);

  const unreadableCount = { trustHooks: true, project };
  assert.deepStrictEqual(
    hooks.keys(unreadableCount, screen.replace(/7 hooks are new or changed\./, 'unknown hooks are new or changed.')),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Enter' }],
    'an unreadable screen count continues without trusting',
  );
  assert.strictEqual(unreadableCount.hookTrustRefused, true);

  const optOutHooks = { project };
  assert.deepStrictEqual(hooks.keys(optOutHooks, screen), [{ key: 'Down' }, { key: 'Down' }, { key: 'Enter' }]);
  assert.strictEqual(
    optOutHooks.hookTrustRefused,
    undefined,
    'explicitly declining hook trust does not mark a refusal',
  );

  const busy = [
    '› Use your question tool',
    '• Working (4s • esc to interrupt)',
    '› Ask Codex to do anything',
    '  GPT-6-Luna max fast · Context 0% used',
  ].join('\n');
  const idle = [
    '› Use your question tool',
    '  Worked for 38s • 06:35',
    '› Ask Codex to do anything',
    '  GPT-6-Luna max fast · Context 3% used',
  ].join('\n');
  assert.strictEqual(adapter.busyAnywhere, true);
  assert(adapter.keyAfterTextMs > 0, 'Enter waits until typed text is no longer read as a paste');
  for (const name of ['codex-trust.txt', 'codex-hooks.txt', 'codex-update.txt']) {
    const lines = readQuestionScreen(name).split('\n');
    assert(!lines.some((line) => adapter.ready.test(line)), `${name} is not a ready prompt`);
  }
  assert(idle.split('\n').some((line) => adapter.ready.test(line)), 'the prompt line marks ready');
  assert(adapter.busy.test(busy) && !adapter.busy.test(idle), 'the working line above the prompt marks busy');

  assert.deepStrictEqual(adapter.answerKeys(question, { select: ['research'] }), [{ key: 'Down' }, { key: 'Enter' }]);
  const note = [{ key: 'Down' }, { key: 'Down' }, { key: 'Down' }, { key: 'Tab' }];
  assert.deepStrictEqual(
    adapter.answerKeys(question, { other: 'teal' }),
    [...note, { text: 'teal' }, { key: 'Enter' }],
  );
  assert.deepStrictEqual(
    adapter.answerKeys(question, { select: ['Writing', 'Coding'], multi: true }),
    [...note, { text: 'Writing, Coding' }, { key: 'Enter' }],
    'several choices go into the note',
  );
}

/** OpenCode's recorded dialog screens parse into their question, and its answers use its keys. */
function openCodeScreens() {
  const adapter = runner.ADAPTERS.opencode;
  assert.strictEqual(adapter.probed, true, 'OpenCode is marked probed');
  const launch = adapter.launch({ sessionId: '90157edc-64c0-41aa-b923-c6098f000000' });
  assert.deepStrictEqual(launch, ['opencode', '--standalone', '--auto', '--session', 'ses_90157edc64c041aab923c6098f']);
  assert.deepStrictEqual(adapter.resume({ sessionId: '90157edc-64c0-41aa-b923-c6098f000000' }), launch);

  const multi = adapter.parseQuestion(readQuestionScreen('opencode.txt'));
  assert.deepStrictEqual(multi, {
    text: 'Which of these areas would you like me to focus on? (Select all that apply)',
    options: ['Code review', 'New feature', 'Tests'],
    multi: true,
  });
  const single = adapter.parseQuestion(readQuestionScreen('opencode-single.txt'));
  assert.deepStrictEqual(single, {
    text: 'Which colour do you prefer?',
    options: ['Red', 'Green', 'Blue'],
    multi: false,
  });
  // A live question wrapped onto two lines; a scenario's match is written against the whole sentence.
  const wrapped = adapter.parseQuestion(readQuestionScreen('opencode-wrapped.txt'));
  assert.deepStrictEqual(wrapped, {
    text: "What's the URL of the site I should onboard the diagram skin from? If you'd like, include 1–2 extra "
      + "pages (landing + docs/blog) and I'll merge the palette and font signals across them.",
    options: ['One URL — I\'ll paste it', 'Two or three URLs'],
    multi: false,
  });
  // The model writes its own labels, so a scripted label also selects the one option containing it.
  const labels = ['A) Existing packet', 'D) Skip documentation (Recommended)', 'Skip - no spec folder needed'];
  assert.strictEqual(runner.findOptionIndex(labels, 'a) existing packet'), 0, 'an exact label wins, ignoring case');
  assert.strictEqual(runner.findOptionIndex(labels.slice(0, 2), 'Skip'), 1, 'one containing option is chosen');
  assert.throws(() => runner.findOptionIndex(labels, 'Skip'), /option ambiguous: Skip/);
  assert.throws(() => runner.findOptionIndex(labels, 'Archive'), /option not on screen: Archive/);
  for (const name of ['opencode-ready.txt', 'opencode-review.txt']) {
    assert.strictEqual(adapter.parseQuestion(readQuestionScreen(name)), null, `${name} is not a question`);
  }
  const ready = readQuestionScreen('opencode-ready.txt').split('\n');
  assert(ready.some((line) => adapter.ready.test(line)), 'the idle footer marks ready');
  assert(!adapter.busy.test(ready.join('\n')), 'the idle screen is not busy');
  assert(
    adapter.busy.test('   ■■■■■■⬝⬝ esc interrupt      ctrl+p commands'),
    'the progress footer marks busy',
  );
  assert(
    !adapter.ready.test('   ■■■■■■⬝⬝ esc interrupt      ctrl+p commands'),
    'a busy footer is not ready',
  );

  assert.deepStrictEqual(adapter.answerKeys(single, { select: ['green'] }), [{ key: 'Down' }, { key: 'Enter' }]);
  assert.deepStrictEqual(
    adapter.answerKeys(multi, { select: ['Code review', 'Tests'] }),
    [{ key: 'Enter' }, { key: 'Down' }, { key: 'Down' }, { key: 'Enter' }, { key: 'Tab' }, { key: 'Enter' }],
  );
  assert.deepStrictEqual(
    adapter.answerKeys(single, { other: 'teal' }),
    [{ key: 'Down' }, { key: 'Down' }, { key: 'Down' }, { key: 'Enter' }, { text: 'teal' }, { key: 'Enter' }],
  );
  assert.throws(() => adapter.answerKeys(single, { select: ['purple'] }), /option not on screen/);

  // A question that offers only the free-text row is still answered through that row.
  const freeOnly = adapter.parseQuestion([
    '  ┃  What custom colour do you want? Type your colour below.',
    '  ┃',
    '  ┃  1. Type your own answer',
    '  ┃',
    '  ┃  ↑↓ select  enter submit  esc dismiss',
  ].join('\n'));
  assert.deepStrictEqual(
    freeOnly,
    { text: 'What custom colour do you want? Type your colour below.', options: [], multi: false },
  );
  assert.deepStrictEqual(
    adapter.answerKeys(freeOnly, { other: 'teal' }),
    [{ key: 'Enter' }, { text: 'teal' }, { key: 'Enter' }],
  );
}

/** An interrupted run still tears its pane and server down. */
async function sigintCleansUp() {
  const dir = tempDir('sigint');
  const repo = makeRepo('sigint-repo');
  const out = path.join(dir, 'out');
  const scenario = writeScenario(dir, 'sigint.md', {
    runtimes: ['claude-code'],
    turns: [{ id: 'waiting', send: 'hello', delay_ms: 60000, timeout_ms: 90000, check: 'true' }],
  });
  assert.deepStrictEqual(subjectProcesses(path.basename(dir)), [], 'no subject is running before this group');

  const child = spawnCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', out,
    '--repo-root', repo,
  ]);
  let stdout = '';
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.on('data', () => {});

  await waitFor(() => subjectProcesses(path.basename(dir)).length > 0, 30000, 'the subject to start');
  const socket = `conv-${child.pid}-fake`;
  assert.strictEqual(socketAlive(socket), true, 'the subject runs on its private socket');

  child.kill('SIGINT');
  const code = await new Promise((resolve) => {
    child.on('exit', (exitCode) => resolve(exitCode));
  });
  assert.strictEqual(code, 130, `an interrupted run exits 130, saw ${code}: ${stdout}`);
  assert.strictEqual(socketAlive(socket), false, 'the interrupted run killed its server');
  assert.deepStrictEqual(subjectProcesses(path.basename(dir)), [], 'the interrupted run left no subject process');
}

/** An interrupt during setup kills the command's process group before tmux starts. */
async function setupSigintCleansUp() {
  const dir = tempDir('setup-sigint');
  const repo = makeRepo('setup-sigint-repo');
  const marker = `conversation-setup-sigint-${process.pid}-${Date.now()}`;
  const scenario = writeScenario(dir, 'setup-sigint.md', {
    runtimes: ['claude-code'],
    setup: [`exec -a ${marker} sleep 300`],
    turns: [{ send: 'hello', delay_ms: 0, check: 'true' }],
  });
  assert.deepStrictEqual(markedProcessPids(marker), [], 'the unique setup process is absent before the run');

  const child = spawnCli([
    '--scenario', scenario,
    '--runtime', 'fake',
    '--scratch', path.join(dir, 'scratch'),
    '--out', path.join(dir, 'out'),
    '--repo-root', repo,
  ]);
  let code = null;
  let processesAfterExit = [];
  try {
    await waitFor(() => markedProcessPids(marker).length > 0, 10000, 'the setup sleep to start');
    child.kill('SIGINT');
    code = await new Promise((resolve) => child.once('exit', resolve));
    await waitFor(() => markedProcessPids(marker).length === 0, 5000, 'the setup sleep to stop');
    processesAfterExit = markedProcessPids(marker);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGINT');
      await waitFor(
        () => child.exitCode !== null || child.signalCode !== null,
        5000,
        'the interrupted setup runner to exit',
      );
    }
    for (const pid of markedProcessPids(marker)) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    }
  }
  assert.strictEqual(code, 130, `an interrupted setup exits 130, saw ${code}`);
  assert.deepStrictEqual(processesAfterExit, [], 'no marked setup process remains after the runner exits');
}

/** Verify policy escaping and macOS write denial without starting tmux. */
function sandboxPolicyCheck() {
  assert.strictEqual(
    runner.sandboxPolicy(['/a "b"']),
    '(version 1)(allow default)(deny file-write* (subpath "/a \\"b\\""))',
  );
  if (process.platform !== 'darwin') {
    state.sandboxPolicySkipReason = 'sandbox-exec enforcement requires macOS';
    return;
  }

  const dir = tempDir('sandbox-policy');
  const repo = path.join(dir, 'repo');
  const scratch = path.join(dir, 'scratch');
  fs.mkdirSync(repo);
  fs.mkdirSync(scratch);
  const result = spawnSync('/usr/bin/sandbox-exec', [
    '-p',
    runner.sandboxPolicy([fs.realpathSync(repo)]),
    '/bin/sh',
    '-c',
    'echo a > "$1/x"; echo b > "$2/y"',
    'sh',
    scratch,
    repo,
  ], { encoding: 'utf8' });
  if (result.error) throw result.error;
  // A seatbelt sandbox cannot nest inside another one, so a test suite already
  // running under a sandbox cannot apply this profile at all. The refusal is
  // about the outer environment, not the policy under test, so report a skip
  // instead of a failure that would blame the runner.
  if (result.status !== 0 && String(result.stderr).includes('sandbox_apply')) {
    state.sandboxPolicySkipReason = 'sandbox-exec cannot apply a profile inside another sandbox';
    return;
  }
  assert.ok(fs.existsSync(path.join(scratch, 'x')), result.stderr);
  assert.strictEqual(
    fs.existsSync(path.join(repo, 'y')),
    false,
    `repository write was not blocked: ${result.stderr}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SUITE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Report each result on one line so failures stay identifiable in the suite output.
 *
 * @param {string} name - Group name.
 * @param {() => (void|Promise<void>)} body - Group body.
 * @param {string|(() => string)} [passMessage] - Optional line for a group's output
 *   contract, or a function that builds it once the group has run.
 * @returns {Promise<void>} Resolves when the group passes.
 */
async function group(name, body, passMessage = `PASS ${name}`) {
  try {
    await body();
    const line = typeof passMessage === 'function' ? passMessage() : passMessage;
    process.stdout.write(`${line}\n`);
  } catch (error) {
    process.stdout.write(`FAIL ${name}: ${error.message}\n`);
    throw error;
  }
}

/**
 * Run every group in order, then remove the temporary tree on success.
 *
 * @returns {Promise<void>} Resolves when the suite passes.
 */
async function runSuite() {
  process.stdout.write(`conversation runner suite: ${ROOT}\n`);
  const hasTmux = tmuxAvailable();
  if (!hasTmux) {
    process.stdout.write('SKIP: tmux not found\n');
  }
  await group('sandbox policy', sandboxPolicyCheck, () => (
    state.sandboxPolicySkipReason
      ? `SKIP sandbox policy: ${state.sandboxPolicySkipReason}`
      : 'PASS sandbox policy'
  ));
  await group('empty repository snapshot', emptyRepoSnapshot);
  await group(hasTmux ? 'refusals' : 'refusals (no tmux needed)', refusals);
  await group('setup exit 77 skips runtime', setupExit77SkipsRuntime);
  await group('multi-runtime guards before side effects', multiRuntimeGuardsBeforeSideEffects);
  await group('setup SIGINT cleans up', setupSigintCleansUp);
  if (hasTmux) {
    await group('fake subject conversation', fakeSubjectRun);
    await group('check reads turn evidence', checkReadsTurnEvidence);
    await group('literal text sends', literalTextSends);
    await group('startup screen waits for redraw', startupScreenWaitsForRedraw);
    await group('chat question at settle', chatQuestionAtSettle);
    await group('unexpected question', unexpectedQuestion);
    await group('turn timeout', timeoutTurn);
    await group('check skip continues', skipAndContinue);
    await group('retry on second attempt', retryOnSecondAttempt);
    await group('check timeout stops the run', checkTimeoutStopsTheRun);
    await group('repo changed', repoChanged);
    await group('unreadable snapshot fails closed', unreadableSnapshotFails);
    await group('hook trust undone', hookTrustUndone);
    await group('evidence files', evidenceFiles);
    await group('cleanup leaves nothing', cleanupLeavesNothing);
    await group('SIGINT cleans up', sigintCleansUp);
  }
  await group(
    'adapter screens',
    adapterScreens,
    () => (state.pending === 0
      ? `adapter screens: PASS (${state.probed} runtimes)`
      : `adapter screens: PASS (${state.probed} runtimes probed, ${state.pending} pending)`),
  );
  await group('quota screen', quotaScreen);
  fs.rmSync(ROOT, { recursive: true, force: true });
  process.stdout.write('PASS conversation runner suite\n');
}

runSuite().catch((error) => {
  process.stderr.write(`${error && error.stack ? error.stack : error}\n`);
  process.stdout.write(`kept failed suite artifacts in ${ROOT}\n`);
  process.exit(1);
});
