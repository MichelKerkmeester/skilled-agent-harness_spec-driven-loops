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
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { appendRecords, toolSourceKey } from '../../decision-capture/lib/capture-core.mjs';
import { ADVISOR_RUNTIME, buildAdvisorPart } from '../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs';
import { PARTS, buildSaveNudgePart, composeTurnStart, handoverWithdrawPart } from './turn-start.mjs';

const hookFlags = createRequire(import.meta.url)('../../shared/hook-flags.cjs');

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

test('the head receipt lands in the state folder the injected environment names', async () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'vibe-advisor-receipts-'));
  try {
    const head = 'Advisor: route sk-code';
    const options = {
      run: async () => ({ hookSpecificOutput: { additionalContext: head } }),
      env: { SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: stateDir },
      isEnabled: () => true,
    };
    const payload = payloadFor({ session_id: 'session-receipt-env' });

    assert.equal(await buildAdvisorPart(payload, options), head);
    assert.equal(readdirSync(join(stateDir, 'vibe-turn-start')).length, 1);
    assert.equal(await buildAdvisorPart(payload, options), '');
  } finally {
    rmSync(stateDir, { recursive: true, force: true });
  }
});

// The receipt folder can sit in a temp directory other users share, so a file
// planted at the receipt path must not redirect the write, and a folder others
// can write to holds no receipt at all.
test('a symlink planted at the head receipt path is replaced, never written through', async () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'vibe-advisor-receipts-'));
  try {
    const receiptDir = join(stateDir, 'vibe-turn-start');
    mkdirSync(receiptDir, { mode: 0o700 });
    const victim = join(stateDir, 'victim.txt');
    writeFileSync(victim, 'untouched');
    const digest = createHash('sha256').update('session-receipt-link').digest('hex').slice(0, 16);
    symlinkSync(victim, join(receiptDir, `${digest}.head`));
    const options = {
      run: async () => ({ hookSpecificOutput: { additionalContext: 'Advisor: route sk-code' } }),
      env: { SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: stateDir },
      isEnabled: () => true,
    };

    await buildAdvisorPart(payloadFor({ session_id: 'session-receipt-link' }), options);
    assert.equal(readFileSync(victim, 'utf8'), 'untouched');
  } finally {
    rmSync(stateDir, { recursive: true, force: true });
  }
});

test('a receipt folder other users can write to holds no head receipt', async () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'vibe-advisor-receipts-'));
  try {
    const receiptDir = join(stateDir, 'vibe-turn-start');
    mkdirSync(receiptDir);
    chmodSync(receiptDir, 0o777);
    const head = 'Advisor: route sk-code';
    const options = {
      run: async () => ({ hookSpecificOutput: { additionalContext: head } }),
      env: { SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: stateDir },
      isEnabled: () => true,
    };
    const payload = payloadFor({ session_id: 'session-receipt-open' });

    assert.equal(await buildAdvisorPart(payload, options), head);
    assert.equal(readdirSync(receiptDir).length, 0);
    assert.equal(await buildAdvisorPart(payload, options), head);
  } finally {
    rmSync(stateDir, { recursive: true, force: true });
  }
});

// Points the flag reader at a scratch hook-flags.env, so these tests never read
// the operator's own file, and restores the reader afterwards.
function useFlagFile(t, contents) {
  const dir = mkdtempSync(join(tmpdir(), 'vibe-advisor-flags-'));
  const file = join(dir, 'hook-flags.env');
  writeFileSync(file, contents);
  const previous = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = file;
  hookFlags._resetConfigCache();
  t.after(() => {
    if (previous === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previous;
    hookFlags._resetConfigCache();
    rmSync(dir, { recursive: true, force: true });
  });
}

test('an injected environment that kills the advisor gets nothing', async (t) => {
  useFlagFile(t, '');
  let calls = 0;
  const text = await buildAdvisorPart(payloadFor({ session_id: 'session-injected-kill' }), {
    run: async () => { calls += 1; return { hookSpecificOutput: { additionalContext: 'Advisor: route sk-code' } }; },
    env: { [hookFlags.concernFlag('skill-advisor')]: '1' },
  });
  assert.equal(text, '');
  assert.equal(calls, 0);
});

test('a kill switch saved to hook-flags.env still silences the live advisor', async (t) => {
  useFlagFile(t, `${hookFlags.concernFlag('skill-advisor')}=1\n`);
  let calls = 0;
  const text = await buildAdvisorPart(payloadFor({ session_id: 'session-file-kill' }), {
    run: async () => { calls += 1; return { hookSpecificOutput: { additionalContext: 'Advisor: route sk-code' } }; },
  });
  assert.equal(text, '');
  assert.equal(calls, 0);
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
