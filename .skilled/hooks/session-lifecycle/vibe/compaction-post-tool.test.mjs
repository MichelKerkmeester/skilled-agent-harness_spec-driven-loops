// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Compaction Post-Tool Binding Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Runs the binding the way Vibe does: one post_tool payload on stdin, one
// optional context line on stdout. The session root holds the journal shape
// Vibe writes, with a model call whose fill sits past the window the case
// configures. Every path a case writes to is a folder the case created, so no
// case depends on another or on the caller's shell.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { withoutRelaunchSwitches } = require('../../session-handover/tests/fixtures/relaunch-env.cjs');

const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
const BINDING = join(HOOK_DIR, 'compaction-post-tool.mjs');
const SESSION_ID = '7b1e0d1a-5f2a-4f3d-9a58-1c0f2e3b4a65';
const LOOP_ID = '777';
const GENERATION = '0000000000000061';
const JOURNAL_NAME = '0000000000000001.jsonl';
const WINDOW_TOKENS = 1000;
const FILL_TOKENS = 100;

// A live session may export any of these, so each case starts from a clean
// relaunch state and sets only the values it needs.
const INHERITED_NAMES = [
  'SKILLED_LOOP_ID',
  'SKILLED_LOOP_HOPS',
  'SESSION_HANDOVER_THRESHOLD',
  'SESSION_HANDOVER_WINDOW_TOKENS',
  'SESSION_HANDOVER_MAX_HOPS',
  'SESSION_HANDOVER_MAX_AGE_MIN',
  'SESSION_HANDOVER_REPO_ROOT',
  'AI_SESSION_CHILD',
  'SYSTEM_SPEC_FOLDER',
  'VIBE_SPEC_FOLDER',
  'SYSTEM_IN_SESSION_HANDOVER_ENABLED',
  'SYSTEM_IN_SESSION_HANDOVER_DISABLED',
  'SYSTEM_IN_SESSION_HANDOVER_VIBE_ENABLED',
];

function makeTempDir(t, prefix) {
  const dir = mkdtempSync(join(os.tmpdir(), prefix));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/**
 * Write a session root holding one main-chain model call.
 *
 * @param {import('node:test').TestContext} t - The running test.
 * @returns {string} The session root a hook receives as `transcript_path`.
 */
function writeSession(t) {
  const root = makeTempDir(t, 'vibe-compaction-session-');
  mkdirSync(join(root, 'journal'), { recursive: true });
  writeFileSync(join(root, 'CURRENT'), JSON.stringify({ generation: GENERATION }));
  const generationDir = join(root, 'generations', GENERATION);
  mkdirSync(generationDir, { recursive: true });
  writeFileSync(
    join(generationDir, 'runtime-state.json'),
    JSON.stringify({
      core_settings: { context: { model_facts: { compaction_threshold: WINDOW_TOKENS } } },
    }),
  );
  writeFileSync(
    join(root, 'journal', JOURNAL_NAME),
    `${JSON.stringify({
      type: 'action_result',
      payload: {
        result: { result: { usage: { input_tokens: FILL_TOKENS, output_tokens: 11 } } },
      },
    })}\n`,
  );
  return root;
}

/**
 * Build the environment one case runs under, with its state inside a temp folder.
 *
 * @param {import('node:test').TestContext} t - The running test.
 * @returns {NodeJS.ProcessEnv} The spawned hook's environment.
 */
function sandboxEnv(t) {
  const root = makeTempDir(t, 'vibe-compaction-state-');
  const env = withoutRelaunchSwitches(process.env);
  for (const name of INHERITED_NAMES) delete env[name];
  env.XDG_RUNTIME_DIR = join(root, 'runtime');
  env.SESSION_HANDOVER_REPO_ROOT = join(root, 'repo');
  env.HOOK_FLAGS_CONFIG = join(root, 'hook-flags.env');
  env.SKILLED_LOOP_ID = LOOP_ID;
  // A one-token window puts the measured fill far past the nudge threshold.
  env.SESSION_HANDOVER_WINDOW_TOKENS = '1';
  mkdirSync(env.XDG_RUNTIME_DIR, { recursive: true });
  return env;
}

function postToolPayload(session, project) {
  return {
    hook_event_name: 'post_tool',
    session_id: SESSION_ID,
    parent_session_id: null,
    transcript_path: session,
    cwd: project,
    agent_name: 'default',
    turn_id: 'turn-1',
    tool_name: 'shell',
  };
}

function runBinding(payload, env) {
  return spawnSync(process.execPath, [BINDING], {
    input: JSON.stringify(payload),
    env,
    encoding: 'utf8',
  });
}

test('a post_tool call past the threshold carries the hand-over command', (t) => {
  const session = writeSession(t);
  const project = makeTempDir(t, 'vibe-compaction-project-');
  const env = { ...sandboxEnv(t), SYSTEM_SESSION_HANDOVER_ENABLED: '1' };

  const result = runBinding(postToolPayload(session, project), env);

  assert.equal(result.status, 0, result.stderr);
  const lines = result.stdout.trim().split('\n');
  assert.equal(lines.length, 1);
  const output = JSON.parse(lines[0]);
  assert.match(output.hook_specific_output.additional_context, /prepare --handoff/);
});

test('the switch off silences the post_tool hand-over', (t) => {
  const session = writeSession(t);
  const project = makeTempDir(t, 'vibe-compaction-project-');
  const env = { ...sandboxEnv(t), SYSTEM_SESSION_HANDOVER_DISABLED: '1' };

  const result = runBinding(postToolPayload(session, project), env);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});
