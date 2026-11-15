// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Turn Start Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_agent composer as Vibe runs it: one JSON payload on stdin, the
// context on stdout. The advisor part is stubbed for the delivered case and
// exercised for real in the skip cases, where it must return before it reaches
// the advisor. A child session, a subagent and a blank prompt get nothing, a
// throwing part leaves the others intact, and malformed input exits 0 silently.
// The save nudge runs against a throwaway queue, so the one rising turn and the
// quiet turn at the same count are both observed on real queue state.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { appendRecords, toolSourceKey } from '../../decision-capture/lib/capture-core.mjs';
import { ADVISOR_RUNTIME, buildAdvisorPart } from '../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs';
import { PARTS, buildSaveNudgePart, composeTurnStart, handoverWithdrawPart } from './turn-start.mjs';

const HOOK = join(dirname(fileURLToPath(import.meta.url)), 'turn-start.mjs');
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const SESSION_FIXTURE = join(
  REPO_ROOT,
  '.skilled/hooks/shared/tests/session-readers/fixtures/vibe/post-agent',
);

/**
 * Runs the composer as Vibe runs it, under an environment that carries none of
 * the caller's child markers, so the result does not depend on the shell the
 * suite runs in.
 * @param {object} payload - The Vibe pre_agent payload.
 * @param {Record<string, string>} extraEnv - Variables the case sets.
 * @returns {{status: number|null, stdout: string, stderr: string}} The run.
 */
function runComposer(payload, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  if (!('AI_SESSION_CHILD' in extraEnv)) delete env.AI_SESSION_CHILD;
  return spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env,
    encoding: 'utf8',
  });
}

function payloadFor(overrides = {}) {
  return {
    hook_event_name: 'pre_agent',
    session_id: 'session-composer',
    parent_session_id: null,
    transcript_path: '/tmp/session-composer.jsonl',
    cwd: REPO_ROOT,
    agent_name: 'default',
    turn_id: 'turn-1',
    prompt: 'Fix the parser.',
    ...overrides,
  };
}

test('a main-session prompt carries the advisor brief', async () => {
  const brief = 'Advisor: route sk-code\nDirectives: keep comments durable';
  const seen = [];
  const payload = payloadFor();
  const text = await composeTurnStart(payload, {
    parts: [() => buildAdvisorPart(payload, {
      run: async (input) => {
        seen.push(input);
        return { hookSpecificOutput: { additionalContext: brief } };
      },
      env: {},
      read: () => '',
      write: () => {},
    })],
  });

  assert.equal(text, brief);
  assert.equal(ADVISOR_RUNTIME, 'vibe');
  assert.equal(seen[0].prompt, 'Fix the parser.');
  assert.equal(seen[0].session_id, 'session-composer');
  assert.equal(seen[0].hook_event_name, 'UserPromptSubmit');
  assert.equal(seen[0].cwd, REPO_ROOT);
});

test('a blank prompt gets nothing', () => {
  const result = runComposer(payloadFor({ prompt: '   ' }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a child session gets nothing', () => {
  const result = runComposer(payloadFor(), { AI_SESSION_CHILD: '1' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a subagent gets nothing', () => {
  const result = runComposer(payloadFor({ parent_session_id: 'parent-session' }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a throwing part leaves the other parts intact', async () => {
  const text = await composeTurnStart(payloadFor(), {
    parts: [
      () => { throw new Error('fixture failure'); },
      () => 'Advisor: kept',
    ],
  });
  assert.equal(text, 'Advisor: kept');
});

test('malformed input exits 0 and prints nothing', () => {
  const result = spawnSync(process.execPath, [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

/**
 * Runs a case in a throwaway project directory, so its queue and nudge cursor
 * stay out of the checkout.
 * @param {(projectDir: string) => void} run - The case.
 */
function withQueueProject(run) {
  const projectDir = mkdtempSync(join(tmpdir(), 'vibe-turn-start-'));
  try {
    return run(projectDir);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

// The nudge only counts records the save has not consumed; the rest of the row
// is what any producer would write, so the queue accepts it as pending.
function queueOneAnswer(projectDir, sessionId) {
  appendRecords(projectDir, sessionId, [{
    key: toolSourceKey('vibe', sessionId, 'call-1', 0),
    kind: 'tool',
    runtime: 'vibe',
    session_id: sessionId,
    tool_use_id: 'call-1',
    question_index: 0,
    question: 'Which route?',
    header: 'Route',
    options: ['A', 'B'],
    multi_select: false,
    answer: 'A',
    source: 'hook',
    captured_at: '2026-11-14T12:00:00.000Z',
  }]);
}

test('a new pending answer injects one save reminder', () => {
  withQueueProject((projectDir) => {
    const sessionId = 'session-nudge-rise';
    queueOneAnswer(projectDir, sessionId);

    const text = buildSaveNudgePart(payloadFor({ cwd: projectDir, session_id: sessionId }));

    assert.match(text, /^\[decision-capture\] 1 operator answer\(s\)[^\n]*\/speckit:save/);
    assert.equal(text.includes('\n'), false);
  });
});

test('the next turn at the same pending count injects nothing', () => {
  withQueueProject((projectDir) => {
    const sessionId = 'session-nudge-quiet';
    queueOneAnswer(projectDir, sessionId);
    const payload = payloadFor({ cwd: projectDir, session_id: sessionId });

    assert.match(buildSaveNudgePart(payload), /^\[decision-capture\] 1 /);
    assert.equal(buildSaveNudgePart(payload), '');
  });
});

test('the hand-over part adds nothing while its switch is off', (t) => {
  // The recorded session sits past the threshold once the window is pinned to one token,
  // so the hand-over part would nudge here if its switch were on.
  const projectDir = mkdtempSync(join(tmpdir(), 'vibe-turn-start-off-'));
  t.after(() => rmSync(projectDir, { recursive: true, force: true }));
  const env = {
    ...process.env,
    SYSTEM_SKILL_ADVISOR_DISABLED: '1',
    HOOK_FLAGS_CONFIG: join(projectDir, 'hook-flags.env'),
    SESSION_HANDOVER_REPO_ROOT: projectDir,
    XDG_RUNTIME_DIR: projectDir,
    SESSION_HANDOVER_THRESHOLD: '0.80',
    SESSION_HANDOVER_WINDOW_TOKENS: '1',
    SKILLED_LOOP_ID: 'vibe-turn-start-off-loop',
  };
  for (const name of [
    'AI_SESSION_CHILD',
    'SESSION_HANDOVER_MAX_HOPS',
    'SKILLED_LOOP_HOPS',
    'SYSTEM_HOOKS_DISABLED',
    'SYSTEM_SESSION_HANDOVER_DISABLED',
    'SYSTEM_SESSION_HANDOVER_ENABLED',
    'SYSTEM_SESSION_HANDOVER_VIBE_ENABLED',
  ]) delete env[name];
  const payload = payloadFor({ cwd: projectDir, transcript_path: SESSION_FIXTURE });

  const off = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env,
    encoding: 'utf8',
  });
  assert.equal(off.status, 0, off.stderr);
  assert.equal(off.stdout, '');

  const on = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env: { ...env, SYSTEM_SESSION_HANDOVER_VIBE_ENABLED: '1' },
    encoding: 'utf8',
  });
  assert.equal(on.status, 0, on.stderr);
  assert.match(
    JSON.parse(on.stdout).hook_specific_output.additional_context,
    /prepare --handoff/,
  );
});

test('the hand-over withdraw step runs before every other turn-start part', () => {
  assert.equal(PARTS[0], handoverWithdrawPart);
});
