// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Classifier Injection Screen (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the fail-open throw policy of the injection
// screen adapter on fetched results.

import assert from 'node:assert/strict';
import test from 'node:test';

import * as injectionCore from '../lib/classifier-injection-advisory.mjs';
import { ERROR_POLICY as injectionPolicy, registerClassifierInjectionScreen } from '../dsh/classifier-injection-screen.mjs';
import { accept, adapterHarness, enabled } from '../../shared/tests/dsh-plugin-harness.mjs';

test('parity: injection screen preserves a fetched result with no text to screen', async () => {
  const expectedText = injectionCore.fetchedText([]);
  const expected = await injectionCore.screenAdvisory(expectedText);
  assert.equal(expected, null);

  const { ctx, handlers } = adapterHarness();
  registerClassifierInjectionScreen(ctx, {
    core: injectionCore,
    isEnabled: enabled,
    createNotice: async () => assert.fail('unexpected injection advisory'),
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'web_fetch', arguments: { url: 'https://example.invalid' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts, undefined);
});

test('throw policy: injection screening fails open and logs when its core throws', async () => {
  assert.equal(injectionPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerClassifierInjectionScreen(ctx, {
    core: {
      fetchedText() { return 'fixture text'; },
      screenAdvisory() { throw new Error('fixture failure'); },
    },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'mcp__sample__lookup', arguments: {} }, { content: [{ type: 'text', text: 'fixture text' }] }, accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(logs.length, 1);
});
