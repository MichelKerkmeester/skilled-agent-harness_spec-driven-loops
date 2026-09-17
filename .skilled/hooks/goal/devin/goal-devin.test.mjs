// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ goal-devin tests — injection envelope, reminder, fail-open on bad input   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../lib/goal-core.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK_PATH = join(__dirname, 'goal-inject.mjs');

let stateDir;
let workspace;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-devin-state-'));
  workspace = mkdtempSync(join(tmpdir(), 'goal-devin-ws-'));
  mkdirSync(join(workspace, '.git'));
});

afterEach(() => {
  rmSync(stateDir, { recursive: true, force: true });
  rmSync(workspace, { recursive: true, force: true });
});

function opts(sessionId = 'devin-session') {
  return { stateDir, scope: { workspace, runtime: 'devin', sessionId } };
}

function payload(extra = {}) {
  return JSON.stringify({ session_id: 'devin-session', hook_event_name: 'UserPromptSubmit', cwd: workspace, ...extra });
}

function runHook(input, envOverrides = {}) {
  try {
    const stdout = execFileSync('node', [HOOK_PATH], {
      input,
      env: { ...process.env, OPENCODE_GOAL_STATE_DIR: stateDir, OPENCODE_GOAL_PLUGIN_DISABLED: undefined, ...envOverrides },
      encoding: 'utf8',
    });
    return { stdout, status: 0 };
  } catch (error) {
    return { stdout: error.stdout || '', status: error.status };
  }
}

function writePacket(rel) {
  const dir = join(workspace, rel);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'goal.md'), [
    '---', 'title: "Goal: fixture"', '_memory:', '  continuity:', '    session_dedup:', '      session_id: "SECRET"', '---',
    '<!-- ANCHOR:directive -->', '**Objective:** Ship it.', '<!-- /ANCHOR:directive -->',
    '<!-- ANCHOR:completion -->', '- [ ] tests pass', '<!-- /ANCHOR:completion -->',
    '<!-- ANCHOR:log -->', '| Item | State | Evidence |', '|---|---|---|', '<!-- /ANCHOR:log -->', '',
  ].join('\n'), 'utf8');
}

test('emits the brief as additionalContext for an active goal and keeps the event name', () => {
  core.setGoal({ objective: 'Ship the widget' }, opts());
  const { stdout, status } = runHook(payload({ hook_event_name: 'SessionStart' }));
  assert.equal(status, 0);
  const response = JSON.parse(stdout);
  assert.equal(response.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.ok(response.hookSpecificOutput.additionalContext.startsWith('[active_goal:'));
});

test('a bound packet renders from the file without frontmatter and carries the reminder while unresent', () => {
  writePacket('specs/t/001-fixture');
  core.bindGoal({ packetPath: 'specs/t/001-fixture' }, opts());
  const first = JSON.parse(runHook(payload()).stdout).hookSpecificOutput.additionalContext;
  assert.ok(first.includes('objective: Execute specs/t/001-fixture/goal.md.'));
  assert.ok(!first.includes('SECRET'));
  assert.ok(first.includes('[goal_resend_pending]'));
  core.noteResent(opts());
  const second = JSON.parse(runHook(payload()).stdout).hookSpecificOutput.additionalContext;
  assert.ok(!second.includes('[goal_resend_pending]'));
});

test('emits an empty object with no goal, with a paused goal, when disabled, and on malformed stdin', () => {
  assert.equal(runHook(payload()).stdout, '{}');
  core.setGoal({ objective: 'Ship the widget' }, opts());
  core.pauseGoal({ reason: 'hold' }, opts());
  assert.equal(runHook(payload()).stdout, '{}');
  core.resumeGoal(opts());
  assert.equal(runHook(payload(), { OPENCODE_GOAL_PLUGIN_DISABLED: '1' }).stdout, '{}');
  assert.equal(runHook('not json').stdout, '{}');
  assert.equal(runHook(JSON.stringify({ hook_event_name: 'UserPromptSubmit', cwd: workspace })).stdout, '{}');
});
