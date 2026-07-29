// ─────────────────────────────────────────────────────────────────────────────
// MODULE: Devin goal-hook adapter test suite (node --test)
// ─────────────────────────────────────────────────────────────────────────────
// Covers goal-inject.mjs (UserPromptSubmit), goal-session-start.mjs
// (SessionStart), and goal-verify.mjs (Stop) against the shared goal core.
// Every test spawns the adapter as a real child process with a crafted stdin
// payload and MK_GOAL_STATE_DIR pointed at a fresh temp directory, so the
// real .opencode/skills/.goal-state/ tree is never touched.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const INJECT_PATH = fileURLToPath(new URL('./goal-inject.mjs', import.meta.url));
const SESSION_START_PATH = fileURLToPath(new URL('./goal-session-start.mjs', import.meta.url));
const VERIFY_PATH = fileURLToPath(new URL('./goal-verify.mjs', import.meta.url));
const GOAL_CLI_PATH = fileURLToPath(new URL('../bin/goal.cjs', import.meta.url));

const NOT_MET_MESSAGE = 'I am still blocked on this and cannot proceed further with the widget.';
const MET_MESSAGE = 'Ship the widget is done, completed and verified with tests passing.';

let stateDir;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-devin-test-'));
});

afterEach(() => {
  rmSync(stateDir, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isolatedEnv(overrides = {}) {
  const env = { ...process.env };
  delete env.MK_GOAL_PLUGIN_DISABLED;
  return { ...env, MK_GOAL_STATE_DIR: stateDir, ...overrides };
}

function setGoal(objective = 'Ship the widget') {
  execFileSync(process.execPath, [GOAL_CLI_PATH, 'set', objective], { env: isolatedEnv(), encoding: 'utf8' });
}

function pauseGoal() {
  execFileSync(process.execPath, [GOAL_CLI_PATH, 'pause'], { env: isolatedEnv(), encoding: 'utf8' });
}

function turnsUsed() {
  const out = execFileSync(process.execPath, [GOAL_CLI_PATH, 'show'], { env: isolatedEnv(), encoding: 'utf8' });
  const line = out.split('\n').find((entry) => entry.startsWith('turns_used='));
  return line ? Number(line.slice('turns_used='.length)) : null;
}

function runHook(hookPath, payload, envOverrides = {}) {
  return execFileSync(process.execPath, [hookPath], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    env: isolatedEnv(envOverrides),
    encoding: 'utf8',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// goal-inject.mjs (UserPromptSubmit)
// ─────────────────────────────────────────────────────────────────────────────

test('goal-inject.mjs injects the active_goal brief for an active goal and increments turnsUsed', () => {
  setGoal('Ship the widget');
  assert.equal(turnsUsed(), 0);
  const stdout = runHook(INJECT_PATH, { hook_event_name: 'UserPromptSubmit', session_id: 's1', prompt: 'go', cwd: process.cwd() });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.ok(parsed.hookSpecificOutput.additionalContext.startsWith('[active_goal:'));
  assert.ok(parsed.hookSpecificOutput.additionalContext.includes('objective: Ship the widget'));
  assert.equal(turnsUsed(), 1);
});

test('goal-inject.mjs emits nothing when no goal is set', () => {
  const stdout = runHook(INJECT_PATH, { hook_event_name: 'UserPromptSubmit', session_id: 's1', prompt: 'go', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

test('goal-inject.mjs emits nothing for a paused goal', () => {
  setGoal('Ship the widget');
  pauseGoal();
  const stdout = runHook(INJECT_PATH, { hook_event_name: 'UserPromptSubmit', session_id: 's1', prompt: 'go', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

test('goal-inject.mjs emits nothing when the goal plugin is disabled', () => {
  setGoal('Ship the widget');
  const stdout = runHook(
    INJECT_PATH,
    { hook_event_name: 'UserPromptSubmit', session_id: 's1', prompt: 'go', cwd: process.cwd() },
    { MK_GOAL_PLUGIN_DISABLED: '1' },
  );
  assert.equal(stdout.trim(), '');
  assert.equal(turnsUsed(), 0);
});

test('goal-inject.mjs fails open on malformed stdin', () => {
  const stdout = runHook(INJECT_PATH, '{not-json');
  assert.equal(stdout.trim(), '');
});

test('goal-inject.mjs fails open when the prompt field is missing', () => {
  setGoal('Ship the widget');
  const stdout = runHook(INJECT_PATH, { hook_event_name: 'UserPromptSubmit', session_id: 's1', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

// ─────────────────────────────────────────────────────────────────────────────
// goal-session-start.mjs (SessionStart)
// ─────────────────────────────────────────────────────────────────────────────

test('goal-session-start.mjs restores the active_goal brief without incrementing turnsUsed', () => {
  setGoal('Ship the widget');
  const stdout = runHook(SESSION_START_PATH, { hook_event_name: 'SessionStart', session_id: 's1', cwd: process.cwd() });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.ok(parsed.hookSpecificOutput.additionalContext.includes('objective: Ship the widget'));
  assert.equal(turnsUsed(), 0);
});

test('goal-session-start.mjs emits nothing when no goal is set', () => {
  const stdout = runHook(SESSION_START_PATH, { hook_event_name: 'SessionStart', session_id: 's1', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

test('goal-session-start.mjs emits nothing for a paused goal', () => {
  setGoal('Ship the widget');
  pauseGoal();
  const stdout = runHook(SESSION_START_PATH, { hook_event_name: 'SessionStart', session_id: 's1', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

test('goal-session-start.mjs emits nothing when the goal plugin is disabled', () => {
  setGoal('Ship the widget');
  const stdout = runHook(
    SESSION_START_PATH,
    { hook_event_name: 'SessionStart', session_id: 's1', cwd: process.cwd() },
    { MK_GOAL_PLUGIN_DISABLED: '1' },
  );
  assert.equal(stdout.trim(), '');
});

test('goal-session-start.mjs fails open when session_id is missing', () => {
  setGoal('Ship the widget');
  const stdout = runHook(SESSION_START_PATH, { hook_event_name: 'SessionStart', cwd: process.cwd() });
  assert.equal(stdout.trim(), '');
});

// ─────────────────────────────────────────────────────────────────────────────
// goal-verify.mjs (Stop)
// ─────────────────────────────────────────────────────────────────────────────

test('goal-verify.mjs blocks with a continuation reason on a not-met transcript with budget remaining', () => {
  setGoal('Ship the widget');
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.decision, 'block');
  assert.ok(typeof parsed.reason === 'string' && parsed.reason.length > 0);
  assert.ok(parsed.reason.includes('Ship the widget'));
  assert.equal(turnsUsed(), 1);
});

test('goal-verify.mjs approves (no block) on a met transcript', () => {
  setGoal('Ship the widget');
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    last_assistant_message: MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs approves when stop_hook_active signals an already-forced continuation (loop guard)', () => {
  setGoal('Ship the widget');
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: true,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
  assert.equal(turnsUsed(), 0);
});

test('goal-verify.mjs approves when the goal plugin is disabled', () => {
  setGoal('Ship the widget');
  const stdout = runHook(
    VERIFY_PATH,
    {
      hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
      last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
    },
    { MK_GOAL_PLUGIN_DISABLED: '1' },
  );
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs approves when no goal is active', () => {
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs approves for a paused goal', () => {
  setGoal('Ship the widget');
  pauseGoal();
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs falls back to the transcript_path file when last_assistant_message is absent', () => {
  setGoal('Ship the widget');
  const transcriptPath = join(stateDir, 'transcript.json');
  writeFileSync(transcriptPath, JSON.stringify({
    schema_version: 1,
    session_id: 's1',
    steps: [
      { step_id: 1, source: 'user', message: 'go' },
      { step_id: 2, source: 'agent', message: NOT_MET_MESSAGE },
    ],
  }));
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    transcript_path: transcriptPath, cwd: process.cwd(),
  });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.decision, 'block');
});

test('goal-verify.mjs stops blocking once the iteration budget is exhausted', () => {
  setGoal('Ship the widget');
  // Default cap is 20 (DEFAULT_MAX_AUTO_TURNS) when the goal record carries no
  // explicit maxAutoTurns; drive turnsUsed up to it via repeated not-met Stops.
  for (let i = 0; i < 20; i += 1) {
    runHook(VERIFY_PATH, {
      hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
      last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
    });
  }
  assert.equal(turnsUsed(), 20);
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', session_id: 's1', stop_hook_active: false,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs fails open on malformed stdin', () => {
  setGoal('Ship the widget');
  const stdout = runHook(VERIFY_PATH, '{not-json');
  assert.equal(stdout.trim(), '');
});

test('goal-verify.mjs approves when session_id is missing', () => {
  setGoal('Ship the widget');
  const stdout = runHook(VERIFY_PATH, {
    hook_event_name: 'Stop', stop_hook_active: false,
    last_assistant_message: NOT_MET_MESSAGE, cwd: process.cwd(),
  });
  assert.equal(stdout.trim(), '');
});
