// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Task Dispatch Guard (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the fail-open throw policy of the task
// dispatch guard adapter on a subagent hand-off.

import assert from 'node:assert/strict';
import test from 'node:test';

import taskDispatchCore from '../lib/dispatch-guard.cjs';
import { ERROR_POLICY as taskPolicy, registerTaskDispatchGuard } from '../dsh/task-dispatch-guard.mjs';
import { adapterHarness, allow, cleanup, enabled, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

test('parity: task dispatch guard allows an unknown hand-off identity', async () => {
  const directory = tempDir();
  try {
    const taskEnv = { AI_SESSION_CHILD: '1' };
    const request = {
      subagentType: 'unregistered-fixture-agent',
      prompt: 'Handle one ordinary local task.',
      sessionID: 'task-parity',
      projectDir: directory,
      env: taskEnv,
    };
    const expected = taskDispatchCore.evaluateDispatch(request);
    assert.equal(expected.decision, 'allow');

    const { ctx, handlers } = adapterHarness();
    registerTaskDispatchGuard(ctx, { core: taskDispatchCore, isEnabled: enabled, cwd: directory, env: taskEnv });
    const result = await handlers.get('tools/pre-execute')({
      name: 'subagent_fork',
      arguments: { agent_preset: request.subagentType, prompt: request.prompt },
      agent: { session: { id: request.sessionID, header: { cwd: directory } } },
    }, allow);
    assert.equal(result.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('throw policy: task dispatch guard fails open and logs when its core throws', async () => {
  assert.equal(taskPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerTaskDispatchGuard(ctx, {
    core: { evaluateDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/pre-execute')({
    name: 'subagent', arguments: { agent_preset: 'fixture-agent', prompt: 'Do one task.' },
  }, allow);
  assert.equal(result.kind, 'allow');
  assert.equal(logs.length, 1);
});
