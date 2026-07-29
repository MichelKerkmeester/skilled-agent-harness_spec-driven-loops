// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension Tests - Goal Context (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers only the logic testable headlessly, per the boundary rule that
// exactly one default-exported factory (no named exports) may leave this
// file: state read/render selection and the heuristic verifier via the
// shared goal core directly, plus the factory's export/registration shape
// via a dynamic import of the real file (its own real path, not the
// `.pi/extensions/` symlink -- Node resolves relative specifiers against a
// symlink's realpath by default, so the extension's internal dynamic
// import of the goal core cannot resolve in this direct-import context;
// that same condition doubles as a genuine fail-open-contract test for
// each handler). Full live event wiring through Pi itself, and the
// symlink-relative import path this file's internal `import()` actually
// depends on, are proven by the live smoke proof, not here.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_EXTENSION_PATH = join(__dirname, 'goal-context.ts');
const CORE_PATH = join(__dirname, '..', 'lib', 'goal-core.cjs');

// Fresh temp dir per test (not a single shared one) so a failed assertion in
// one test can never leave state that contaminates the next.
let stateDir;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-pi-test-'));
});

afterEach(() => {
  rmSync(stateDir, { recursive: true, force: true });
});

function opts() {
  return { stateDir };
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
  const { record } = core.setGoal({ objective: 'Ship the Pi goal extension', runtime: 'Pi' }, opts());
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
  core.setGoal({ objective: 'Pause me', runtime: 'pi' }, opts());
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
  return {
    registered,
    on(event, handler) {
      registered[event] = handler;
    },
    sendMessage() {
      // no-op: registration-shape tests never need delivery semantics
    },
  };
}

test('the module default-exports a single factory function', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  assert.equal(typeof mod.default, 'function');
  assert.deepEqual(Object.keys(mod).sort(), ['default']);
});

test('the factory registers input, session_start, and turn_end handlers', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  assert.equal(typeof pi.registered.input, 'function');
  assert.equal(typeof pi.registered.session_start, 'function');
  assert.equal(typeof pi.registered.turn_end, 'function');
});

// ─────────────────────────────────────────────────────────────────────────────
// FAIL-OPEN CONTRACT (direct-import context: the internal goal-core import
// cannot resolve here because it is written for the `.pi/extensions/`
// symlink base, not this file's own realpath -- see module header)
// ─────────────────────────────────────────────────────────────────────────────

test('input handler fails open to {action:"continue"} when the goal core cannot be loaded', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const result = await pi.registered.input(
    { type: 'input', text: 'what is my active goal?', source: 'interactive' },
    { cwd: process.cwd() },
  );
  assert.deepEqual(result, { action: 'continue' });
});

test('session_start handler fails open to undefined when the goal core cannot be loaded', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const result = await pi.registered.session_start({ type: 'session_start', reason: 'startup' }, { cwd: process.cwd() });
  assert.equal(result, undefined);
});

test('turn_end handler fails open to undefined when the goal core cannot be loaded', async () => {
  const mod = await import(pathToFileURL(REAL_EXTENSION_PATH).href);
  const pi = fakePi();
  mod.default(pi);
  const result = await pi.registered.turn_end(
    { type: 'turn_end', turnIndex: 0, message: { role: 'assistant', content: [{ type: 'text', text: 'done' }] }, toolResults: [] },
    { cwd: process.cwd() },
  );
  assert.equal(result, undefined);
});
