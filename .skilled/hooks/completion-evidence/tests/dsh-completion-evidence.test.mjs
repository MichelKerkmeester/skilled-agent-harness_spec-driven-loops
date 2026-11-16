// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Completion Evidence (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the fail-open throw policy of the completion
// evidence adapter on a stopping turn.

import assert from 'node:assert/strict';
import test from 'node:test';

import completionCore from '../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs';
import { ERROR_POLICY as completionPolicy, registerCompletionEvidence } from '../dsh/completion-evidence.mjs';
import { adapterHarness, enabled } from '../../shared/tests/dsh-plugin-harness.mjs';

test('parity: completion stop does not inject context when the shared core sees no claim', async () => {
  const { ctx, handlers } = adapterHarness();
  registerCompletionEvidence(ctx, { core: completionCore, isEnabled: enabled });
  const claimText = 'I will continue checking the work.';
  const expected = completionCore.detectCompletionClaim(claimText);
  assert.equal(expected, false);

  let injected = false;
  await handlers.get('agent/turn-stopping')({
    turn: 2,
    agent: {
      session: {
        snapshotEvents: () => [{
          type: 'assistant/message',
          data: { turn: 2, message: { role: 'assistant', content: [{ type: 'text', text: claimText }] } },
        }],
      },
      inject() { injected = true; },
    },
  });
  assert.equal(injected, false);
});

test('throw policy: completion evidence fails open and logs when its core throws', async () => {
  assert.equal(completionPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerCompletionEvidence(ctx, {
    core: { detectCompletionClaim() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  await handlers.get('agent/turn-stopping')({
    turn: 1,
    agent: {
      session: { snapshotEvents: () => [] },
      inject() { assert.fail('fail-open throw path must not inject'); },
    },
  });
  assert.equal(logs.length, 1);
});
