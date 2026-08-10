// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension Tests - Goal Context (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the default-exported factory, native current-session command,
// lifecycle identity binding, fail-open behavior, and shared-core rendering.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_EXTENSION_PATH = join(__dirname, 'goal-context.ts');
const CORE_PATH = join(__dirname, '..', 'lib', 'goal-core.cjs');
const PROMPT_PATH = join(__dirname, '..', '..', '..', '..', '.pi', 'prompts', 'goal-pi.md');

// Fresh temp dir per test (not a single shared one) so a failed assertion in
// one test can never leave state that contaminates the next.
let stateDir;
let previousStateDir;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-pi-test-'));
  previousStateDir = process.env.MK_GOAL_STATE_DIR;
  process.env.MK_GOAL_STATE_DIR = stateDir;
});

afterEach(() => {
  if (previousStateDir === undefined) delete process.env.MK_GOAL_STATE_DIR;
  else process.env.MK_GOAL_STATE_DIR = previousStateDir;
  rmSync(stateDir, { recursive: true, force: true });
});

function opts(sessionId = 'test-session', runtime = 'pi') {
  return {
    stateDir,
    scope: { workspace: stateDir, runtime, sessionId },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER SELECTION (core-facing, isolated MK_GOAL_STATE_DIR)
// ─────────────────────────────────────────────────────────────────────────────

test('renderGoalBrief renders the active_goal block for an active goal, parameterized for Pi', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  // The Role line is baked into goal.goalPrompt at setGoal()-time from the
  // `runtime` label passed then -- renderGoalBrief's own `runtimeLabel`
  // argument does not re-derive it, so this exercises the "Pi" label the
  // way a goal actually set for a Pi session would carry it.
  const { record } = core.setGoal(
    { objective: 'Ship the Pi goal extension', runtimeLabel: 'Pi' },
    opts(),
  );
  const goal = core.readGoalRecord(opts());
  const brief = core.renderGoalBrief({ goal, runtimeLabel: 'Pi' });
  assert.match(brief, /^\[active_goal:/);
  assert.match(brief, /status: active/);
  assert.match(brief, /Role: Focused Pi execution agent/);
  assert.match(brief, new RegExp(record.goalId));
});

test('renderGoalBrief returns empty string when no goal is active', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const goal = core.readGoalRecord(opts());
  assert.equal(goal, null);
  assert.equal(core.renderGoalBrief({ goal, runtimeLabel: 'Pi' }), '');
});

test('renderGoalBrief returns empty string for a paused goal', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Pause me', runtimeLabel: 'Pi' }, opts());
  core.pauseGoal({ reason: 'testing' }, opts());
  const goal = core.readGoalRecord(opts());
  assert.equal(goal.status, 'paused');
  assert.equal(core.renderGoalBrief({ goal, runtimeLabel: 'Pi' }), '');
});

test('isPluginDisabled respects MK_GOAL_PLUGIN_DISABLED without touching real state', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  assert.equal(core.isPluginDisabled({}), false);
  assert.equal(core.isPluginDisabled({ MK_GOAL_PLUGIN_DISABLED: '1' }), true);
});

// ─────────────────────────────────────────────────────────────────────────────
// HEURISTIC VERIFIER (core-facing, crafted transcript text)
// ─────────────────────────────────────────────────────────────────────────────

test('verifyGoalHeuristic: short evidence is unclear', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const goal = { objective: 'Ship the Pi goal extension' };
  const verdict = core.verifyGoalHeuristic({ goal, transcriptText: 'ok' });
  assert.equal(verdict.verdict, 'unclear');
});

test('verifyGoalHeuristic: blocking language is not-met even with completion words present', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const goal = { objective: 'Ship the Pi goal extension' };
  const transcriptText = 'The Pi goal extension is done, but tests are still failing and blocked on a fixture.';
  const verdict = core.verifyGoalHeuristic({ goal, transcriptText });
  assert.equal(verdict.verdict, 'not-met');
});

test('verifyGoalHeuristic: explicit completion tied to the objective is met', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const goal = { objective: 'Ship the Pi goal extension symlink' };
  const transcriptText = 'The Pi goal extension symlink work is completed and verified against the live session.';
  const verdict = core.verifyGoalHeuristic({ goal, transcriptText });
  assert.equal(verdict.verdict, 'met');
});

test('verifyGoalHeuristic: completion language with no objective-specific evidence stays unclear', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const goal = { objective: 'Ship the Pi goal extension symlink' };
  const transcriptText = 'Everything here is done, completed, and verified.';
  const verdict = core.verifyGoalHeuristic({ goal, transcriptText });
  assert.equal(verdict.verdict, 'unclear');
});

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY SHAPE + REGISTRATION (imports the real file directly)
// ─────────────────────────────────────────────────────────────────────────────

function fakePi() {
  const registered = {};
  const commands = {};
  const notifications = [];
  return {
    registered,
    commands,
    notifications,
    on(event, handler) {
      registered[event] = handler;
    },
    registerCommand(name, command) {
      commands[name] = command;
    },
    async exec(command, args, options = {}) {
      try {
        const stdout = execFileSync(command, args, {
          cwd: options.cwd,
          env: process.env,
          encoding: 'utf8',
          timeout: options.timeout,
        });
        return { stdout, stderr: '', code: 0, killed: false };
      } catch (error) {
        return {
          stdout: error.stdout || '',
          stderr: error.stderr || '',
          code: error.status ?? 1,
          killed: Boolean(error.killed),
        };
      }
    },
    sendMessage() {
      // Message delivery is asserted only through scoped state in these tests.
    },
  };
}

function fakeContext(sessionId, cwd = process.cwd()) {
  return {
    cwd,
    hasUI: true,
    sessionManager: { getSessionId: () => sessionId },
    ui: {
      notify(message, level) {
        this.notifications?.push?.({ message, level });
      },
    },
  };
}

function commandContext(pi, sessionId) {
  const context = fakeContext(sessionId);
  context.ui.notify = (message, level) => pi.notifications.push({ message, level });
  return context;
}

test('the module default-exports a single factory function', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  assert.equal(typeof mod.default, 'function');
  assert.deepEqual(Object.keys(mod).sort(), ['default']);
});

test('the factory registers lifecycle handlers and the native goal-pi command', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  assert.equal(typeof pi.registered.input, 'function');
  assert.equal(typeof pi.registered.session_start, 'function');
  assert.equal(typeof pi.registered.turn_end, 'function');
  assert.equal(typeof pi.commands['goal-pi']?.handler, 'function');
});

// ─────────────────────────────────────────────────────────────────────────────
// NATIVE SESSION BINDING
// ─────────────────────────────────────────────────────────────────────────────

test('two Pi input contexts inject only their own active goal', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Pi goal A', runtimeLabel: 'Pi' }, opts('session-a'));
  core.setGoal({ objective: 'Pi goal B', runtimeLabel: 'Pi' }, opts('session-b'));
  core.setGoal({ objective: 'Cursor collision canary' }, opts('session-a', 'cursor'));

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const event = { type: 'input', text: 'continue', source: 'interactive' };
  const resultA = await pi.registered.input(event, fakeContext('session-a'));
  const resultB = await pi.registered.input(event, fakeContext('session-b'));

  assert.equal(resultA.action, 'transform');
  assert.match(resultA.text, /objective: Pi goal A/);
  assert.doesNotMatch(resultA.text, /Pi goal B/);
  assert.doesNotMatch(resultA.text, /Cursor collision canary/);
  assert.equal(resultB.action, 'transform');
  assert.match(resultB.text, /objective: Pi goal B/);
  assert.doesNotMatch(resultB.text, /Pi goal A/);
});

test('same Pi session resumes its goal while a new session starts unbound', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Resume canary' }, opts('resume-session'));
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);

  const firstPi = fakePi();
  mod.default(firstPi);
  const first = await firstPi.registered.input(
    { type: 'input', text: 'continue', source: 'interactive' },
    fakeContext('resume-session'),
  );

  const resumedPi = fakePi();
  mod.default(resumedPi);
  const resumed = await resumedPi.registered.input(
    { type: 'input', text: 'continue', source: 'interactive' },
    fakeContext('resume-session'),
  );
  const forked = await resumedPi.registered.input(
    { type: 'input', text: 'continue', source: 'interactive' },
    fakeContext('fork-session'),
  );

  assert.match(first.text, /objective: Resume canary/);
  assert.match(resumed.text, /objective: Resume canary/);
  assert.deepEqual(forked, { action: 'continue' });
});

test('turn_end in one Pi session leaves the other session byte-equivalent', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Pi goal A' }, opts('session-a'));
  core.setGoal({ objective: 'Pi goal B' }, opts('session-b'));
  const sessionBPath = core.resolveGoalScope(opts('session-b')).statePath;
  const before = readFileSync(sessionBPath, 'utf8');

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  await pi.registered.turn_end(
    {
      type: 'turn_end',
      turnIndex: 0,
      message: { role: 'assistant', content: [{ type: 'text', text: 'Work continues.' }] },
      toolResults: [],
    },
    fakeContext('session-a'),
  );

  assert.equal(core.showGoal(opts('session-a')).turnsUsed, 1);
  assert.equal(readFileSync(sessionBPath, 'utf8'), before);
});

test('missing Pi identity fails open without selecting or writing a goal', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Bound goal' }, opts('bound-session'));
  const before = readdirSync(stateDir).sort();

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const result = await pi.registered.input(
    { type: 'input', text: 'continue', source: 'interactive' },
    fakeContext(''),
  );

  assert.deepEqual(result, { action: 'continue' });
  assert.deepEqual(readdirSync(stateDir).sort(), before);
});

test('legacy-only state never injects into a Pi session', async () => {
  const legacyPath = join(stateDir, 'active-goal.json');
  const legacyBytes = JSON.stringify({
    goalId: 'goal-pi-legacy',
    objective: 'Legacy must stay quarantined',
    status: 'active',
  });
  writeFileSync(legacyPath, legacyBytes, { mode: 0o600 });

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const result = await pi.registered.input(
    { type: 'input', text: 'continue', source: 'interactive' },
    fakeContext('session-a'),
  );

  assert.deepEqual(result, { action: 'continue' });
  assert.equal(readFileSync(legacyPath, 'utf8'), legacyBytes);
});

test('native goal-pi management writes and shows the current Pi session only', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const command = pi.commands['goal-pi'];

  await command.handler('set Native session goal', commandContext(pi, 'session-a'));
  await command.handler('show', commandContext(pi, 'session-a'));

  const stored = core.showGoal(opts('session-a'));
  assert.equal(stored.objective, 'Native session goal');
  assert.match(stored.goalPrompt, /Role: Focused Pi execution agent/);
  assert.equal(core.showGoal(opts('session-b')), null);
  assert.match(pi.notifications[0].message, /^STATUS=OK ACTION=set/m);
  assert.match(pi.notifications[1].message, /^STATUS=OK ACTION=show/m);
});

test('native goal-pi management binds pause, resume, complete, and history to one session', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const command = pi.commands['goal-pi'];
  const context = commandContext(pi, 'lifecycle-session');

  await command.handler('set Lifecycle goal', context);
  await command.handler('pause waiting', context);
  assert.equal(core.showGoal(opts('lifecycle-session')).status, 'paused');
  await command.handler('resume', context);
  assert.equal(core.showGoal(opts('lifecycle-session')).status, 'active');
  await command.handler('complete', context);
  assert.equal(core.showGoal(opts('lifecycle-session')), null);
  await command.handler('history', context);

  assert.match(pi.notifications.at(-1).message, /^STATUS=OK ACTION=history/m);
  assert.match(pi.notifications.at(-1).message, /archive_count=1/);
});

test('native goal-pi management migrates legacy state only to the current session', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  writeFileSync(join(stateDir, 'active-goal.json'), JSON.stringify({
    goalId: 'goal-pi-native-legacy',
    objective: 'Explicit Pi migration',
    status: 'active',
    createdAtMs: 1,
    updatedAtMs: 1,
  }), { mode: 0o600 });

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  await pi.commands['goal-pi'].handler('legacy-migrate', commandContext(pi, 'migration-session'));

  assert.equal(core.showGoal(opts('migration-session')).objective, 'Explicit Pi migration');
  assert.match(core.showGoal(opts('migration-session')).goalPrompt, /Role: Focused Pi execution agent/);
  assert.equal(core.showGoal(opts('other-session')), null);
  assert.match(pi.notifications.at(-1).message, /legacy_migrated=true/);
});

test('native binding overrides user-supplied scope flags', async () => {
  const core = (await import(pathToFileURL(CORE_PATH).href)).default;
  core.setGoal({ objective: 'Session B goal' }, opts('session-b'));
  const sessionBPath = core.resolveGoalScope(opts('session-b')).statePath;
  const before = readFileSync(sessionBPath, 'utf8');

  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  await pi.commands['goal-pi'].handler(
    'set Session A goal --runtime cursor --session session-b --workspace /tmp',
    commandContext(pi, 'session-a'),
  );

  assert.equal(core.showGoal(opts('session-a')).objective, 'Session A goal');
  assert.equal(readFileSync(sessionBPath, 'utf8'), before);
  assert.equal(core.showGoal(opts('session-b', 'cursor')), null);
});

test('native goal-pi management rejects missing identity without writing', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);

  await pi.commands['goal-pi'].handler('set Must not persist', commandContext(pi, ''));

  assert.deepEqual(readdirSync(stateDir), []);
  assert.match(pi.notifications[0].message, /code=MISSING_SESSION_ID/);
});

test('the Pi prompt fallback never invokes the unbound manage CLI', () => {
  const prompt = readFileSync(PROMPT_PATH, 'utf8');
  assert.match(prompt, /registers the authoritative `\/goal-pi` command/);
  assert.doesNotMatch(prompt, /MK_GOAL_RUNTIME_LABEL=/);
  assert.doesNotMatch(prompt, /node\s+\.opencode\/hooks\/goal\/bin\/goal\.cjs/);
});
