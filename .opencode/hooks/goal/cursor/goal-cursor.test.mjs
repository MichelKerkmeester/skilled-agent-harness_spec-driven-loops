// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Cursor goal-inject hook test suite (node --test)               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Injection-when-active, no-op-when-none/paused/disabled, and      ║
// ║          fail-open-on-malformed-stdin coverage for goal-inject.mjs.       ║
// ║          Every case points MK_GOAL_STATE_DIR at a fresh temp directory    ║
// ║          so the real `.opencode/skills/.goal-state/` tree is never       ║
// ║          touched, and every hook invocation runs as a real spawned       ║
// ║          process (execFileSync) so stdin/stdout/exit-code behavior is    ║
// ║          exercised exactly as Cursor would drive it.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../lib/goal-core.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK_PATH = join(__dirname, 'goal-inject.mjs');
const STDIN_PAYLOAD = JSON.stringify({ session_id: 'test-session', workspace_roots: ['/tmp/does-not-matter'] });

let stateDir;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-cursor-test-'));
});

afterEach(() => {
  rmSync(stateDir, { recursive: true, force: true });
});

function opts() {
  return { stateDir };
}

function runHook(input, envOverrides = {}) {
  try {
    const stdout = execFileSync('node', [HOOK_PATH], {
      input,
      env: { ...process.env, MK_GOAL_STATE_DIR: stateDir, MK_GOAL_PLUGIN_DISABLED: undefined, ...envOverrides },
      encoding: 'utf8',
    });
    return { stdout, status: 0 };
  } catch (error) {
    return { stdout: error.stdout || '', status: error.status, stderr: error.stderr || '' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE GOAL -> INJECTS
// ─────────────────────────────────────────────────────────────────────────────

test('injects the active_goal brief as agent_message when a goal is active', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  const { stdout, status } = runHook(STDIN_PAYLOAD);
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.equal(response.permission, 'allow');
  assert.ok(typeof response.agent_message === 'string' && response.agent_message.length > 0);
  assert.ok(response.agent_message.startsWith('[active_goal:'));
  assert.ok(response.agent_message.includes('objective: Ship the widget'));
  // goal_prompt's Role line is baked in once at setGoal() time from the
  // goal-setting runtime's label, not re-derived from the reading adapter's
  // renderGoalBrief({runtimeLabel}) call — a shared goal-core.cjs detail
  // (renderGoalBrief's runtimeLabel param is currently unused there), so
  // this asserts the runtime-agnostic Role-line shape rather than hardcoding
  // a capitalized "Cursor" that only this adapter's own call site requests.
  assert.ok(response.agent_message.includes('execution agent operating under the active session goal'));
  assert.ok(response.agent_message.trimEnd().endsWith('[/active_goal]'));
});

test('records a turn touch when injecting an active goal', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  runHook(STDIN_PAYLOAD);
  const record = core.showGoal(opts());
  assert.equal(record.turnsUsed, 1);
  assert.equal(record.runtime, 'cursor');
});

// ─────────────────────────────────────────────────────────────────────────────
// NO-OP CASES: none / paused / disabled
// ─────────────────────────────────────────────────────────────────────────────

test('no-op when no goal is set', () => {
  const { stdout, status } = runHook(STDIN_PAYLOAD);
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

test('no-op when the active goal is paused', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  core.pauseGoal({ reason: 'blocked on review' }, opts());
  const { stdout, status } = runHook(STDIN_PAYLOAD);
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

test('no-op when the goal plugin is disabled, even with an active goal', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  const { stdout, status } = runHook(STDIN_PAYLOAD, { MK_GOAL_PLUGIN_DISABLED: '1' });
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

test('no-op when the goal is cleared', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  core.clearGoal(opts());
  const { stdout, status } = runHook(STDIN_PAYLOAD);
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

// ─────────────────────────────────────────────────────────────────────────────
// FAIL-OPEN: malformed / missing stdin, corrupt state
// ─────────────────────────────────────────────────────────────────────────────

test('fails open on malformed stdin (not JSON)', () => {
  // execFileSync only exposes stderr via the thrown error on a non-zero
  // exit; not throwing here (status 0, parseable stdout) is itself the
  // "never throws" proof for this case.
  const { stdout, status } = runHook('this is not json{{{');
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

test('fails open on empty stdin', () => {
  const { stdout, status } = runHook('');
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});

test('fails open on a JSON payload missing every expected field', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  const { stdout, status } = runHook('{}');
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.equal(response.permission, 'allow');
  // workspace_roots absent -> falls back to process.cwd(); MK_GOAL_STATE_DIR
  // still resolves the same isolated state dir, so this still injects.
  assert.ok(typeof response.agent_message === 'string');
});

test('fails open (never throws) when the shared state file is corrupt JSON', () => {
  core.setGoal({ objective: 'Ship the widget', runtime: 'cursor' }, opts());
  const statePath = core.statePath(core.resolveStateDir(opts()));
  require('node:fs').writeFileSync(statePath, '{not valid json', 'utf8');
  const { stdout, status } = runHook(STDIN_PAYLOAD);
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.deepEqual(response, { permission: 'allow' });
});
