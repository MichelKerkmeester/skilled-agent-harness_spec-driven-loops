// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Tests - Session Lifecycle (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the session-start advisories, the post-compaction re-prime and the
// session-stop autosave, each with its leaf gate, concern switch and fail-open policy.

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import {
  ADVISORY_CHECKS,
  ERROR_POLICY as advisoriesPolicy,
  advisoryCommand,
  registerSessionStartAdvisories,
} from '../adapters/session-start-advisories.mjs';
import { ERROR_POLICY as compactPolicy, registerSessionCompactContext } from '../adapters/session-compact-context.mjs';
import {
  ERROR_POLICY as stopPolicy,
  SESSION_STOP_PATH,
  registerSessionStopContext,
  runSessionStop,
} from '../adapters/session-stop-context.mjs';
import { disabled, enabled, fakeAgent, interactive, leaf, noticeText, plainNotice, pluginHarness } from './harness.mjs';

const REPO = '/fixture/checkout';

test('session-start advisories run every enabled guard and inject their warnings once', async () => {
  const ran = [];
  const { ctx, fire } = pluginHarness();
  registerSessionStartAdvisories(ctx, {
    runCheck: async ({ check }) => {
      ran.push(check.label);
      return check.label === 'git-worktree-guard' ? 'You are on the primary checkout.' : '';
    },
    isEnabled: (concern) => concern !== 'dist-freshness',
    isLeaf: interactive,
    createNotice: plainNotice,
    repoRoot: REPO,
  });
  const { agent, injected } = fakeAgent();
  await fire('agent/created', { agent, source: 'startup' });

  const expected = ADVISORY_CHECKS.map((check) => check.label).filter((label) => label !== 'check-dist-staleness');
  assert.deepEqual(ran.sort(), expected.sort());
  assert.equal(injected.length, 1);
  assert.equal(noticeText(injected[0]), 'git-worktree-guard: You are on the primary checkout.');
});

test('session-start advisories stay off in a fan-out leaf and on a resumed session', async () => {
  for (const [isLeaf, source] of [[leaf, 'startup'], [interactive, 'resume']]) {
    const ran = [];
    const { ctx, fire } = pluginHarness();
    registerSessionStartAdvisories(ctx, {
      runCheck: async ({ check }) => { ran.push(check.label); return 'warning'; },
      isEnabled: enabled,
      isLeaf,
      createNotice: plainNotice,
    });
    const { agent, injected } = fakeAgent();
    await fire('agent/created', { agent, source });
    assert.deepEqual(ran, []);
    assert.deepEqual(injected, []);
  }
});

test('throw policy: one failing guard is logged and the others still report', async () => {
  assert.equal(advisoriesPolicy, 'fail-open');
  const { ctx, fire, logs } = pluginHarness();
  registerSessionStartAdvisories(ctx, {
    runCheck: async ({ check }) => {
      if (check.label === 'check-git-hooks') throw new Error('fixture failure');
      return check.label === 'live-sync-follow' ? 'Live follow started.' : '';
    },
    isEnabled: enabled,
    isLeaf: interactive,
    createNotice: plainNotice,
  });
  const { agent, injected } = fakeAgent();
  await fire('agent/created', { agent, source: 'startup' });
  assert.equal(logs.length, 1);
  assert.equal(noticeText(injected[0]), 'live-sync-follow: Live follow started.');
});

test('session-start advisories call the same scripts Pi runs, from this checkout', () => {
  const byLabel = Object.fromEntries(ADVISORY_CHECKS.map((check) => [check.label, advisoryCommand(check, REPO)]));
  assert.deepEqual(byLabel['git-worktree-guard'], {
    command: 'bash', args: [path.join(REPO, '.skilled/bin/worktree-guard.sh')], detached: false,
  });
  assert.deepEqual(byLabel['check-dist-staleness'], {
    command: 'python3',
    args: [path.join(REPO, '.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh'), '--all'],
    detached: false,
  });
  assert.equal(byLabel['primary-reconcile'].detached, true);
  assert.deepEqual(byLabel['live-sync-follow'].args, [path.join(REPO, '.skilled/bin/git-live-follow.sh'), '--start']);
  assert.deepEqual(byLabel['install-codex-hooks'].args, [path.join(REPO, '.skilled/bin/install-codex-hooks.mjs'), '--check']);
  assert.deepEqual(
    ADVISORY_CHECKS.map((check) => check.concern).sort(),
    ['dist-freshness', 'git-hooks-check', 'git-worktree-guard', 'hook-install', 'live-follow', 'primary-reconcile'],
  );
});

test('session-start advisories register nothing when the session-lifecycle concern is off', () => {
  const { ctx, handlers } = pluginHarness();
  registerSessionStartAdvisories(ctx, { isEnabled: (concern) => concern !== 'session-lifecycle' });
  assert.equal(handlers.size, 0);
});

test('compaction context runs session-prime for a completed compaction and injects its output', async () => {
  const runs = [];
  const { ctx, fire } = pluginHarness();
  const { agent, injected } = fakeAgent({ id: 'session-compact', cwd: '/fixture/workspace' });
  registerSessionCompactContext(ctx, {
    core: { runSessionPrime: (input) => { runs.push(input); return 'Context was compacted.'; } },
    getAgent: (id) => (id === agent.id ? agent : undefined),
    isEnabled: enabled,
    createNotice: plainNotice,
  });
  await fire('session/event', agent.session, { type: 'compaction/end', data: { compactionId: 'c1', turn: 4 } });
  assert.deepEqual(runs, [{ sessionId: 'session-compact', projectDir: '/fixture/workspace', source: 'compact' }]);
  assert.equal(noticeText(injected[0]), 'Context was compacted.');

  await fire('session/event', agent.session, { type: 'compaction/end', data: { compactionId: 'c2', turn: 5, error: 'boom' } });
  await fire('session/event', agent.session, { type: 'compaction/summary', data: { compactionId: 'c3' } });
  assert.equal(runs.length, 1);
});

test('throw policy: compaction context fails open and logs when session-prime throws', async () => {
  assert.equal(compactPolicy, 'fail-open');
  const { ctx, fire, logs } = pluginHarness();
  const { agent, injected } = fakeAgent();
  registerSessionCompactContext(ctx, {
    core: { runSessionPrime() { throw new Error('fixture failure'); } },
    getAgent: () => agent,
    isEnabled: enabled,
    createNotice: plainNotice,
  });
  await fire('session/event', agent.session, { type: 'compaction/end', data: { compactionId: 'c1', turn: 1 } });
  assert.deepEqual(injected, []);
  assert.equal(logs.length, 1);
});

test('stop context runs session-stop for an interactive agent and never for a fan-out leaf', async () => {
  for (const [isLeaf, expected] of [[interactive, 1], [leaf, 0]]) {
    const runs = [];
    const { ctx, fire } = pluginHarness();
    registerSessionStopContext(ctx, {
      core: { runSessionStop: (input) => runs.push(input) },
      isEnabled: enabled,
      isLeaf,
    });
    const { agent } = fakeAgent({ id: 'session-stop', cwd: '/fixture/workspace' });
    await fire('agent/disposed', { agent });
    assert.equal(runs.length, expected);
    if (expected) assert.deepEqual(runs[0], { sessionId: 'session-stop', projectDir: '/fixture/workspace' });
  }
});

test('stop context hands session-stop the Stop payload Pi sends', () => {
  const calls = [];
  runSessionStop({ sessionId: 'session-stop', projectDir: '/fixture/workspace' }, (command, args, options) => {
    calls.push({ command, args, options });
    return { status: 0, stdout: '', stderr: '' };
  });
  assert.equal(calls[0].command, process.execPath);
  assert.deepEqual(calls[0].args, [SESSION_STOP_PATH]);
  assert.equal(calls[0].options.cwd, '/fixture/workspace');
  assert.deepEqual(JSON.parse(calls[0].options.input), {
    session_id: 'session-stop', cwd: '/fixture/workspace', hook_event_name: 'Stop',
  });
});

test('throw policy: stop context fails open and logs; its concern switch removes it', async () => {
  assert.equal(stopPolicy, 'fail-open');
  const { ctx, fire, logs } = pluginHarness();
  registerSessionStopContext(ctx, {
    core: { runSessionStop() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
    isLeaf: interactive,
  });
  const { agent } = fakeAgent();
  await fire('agent/disposed', { agent });
  assert.equal(logs.length, 1);

  const off = pluginHarness();
  registerSessionStopContext(off.ctx, { isEnabled: disabled });
  assert.equal(off.handlers.size, 0);
});
