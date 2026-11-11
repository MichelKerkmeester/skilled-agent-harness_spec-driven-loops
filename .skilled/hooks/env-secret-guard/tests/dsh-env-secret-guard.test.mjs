// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - env-secret-guard (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the deny for a dotenv read, write and shell read with the real core,
// the session directory hand-off, the kill switch and the fail-open policy.

import assert from 'node:assert/strict';
import test from 'node:test';

import guardCore from '../lib/env-secret-guard.cjs';

import { ERROR_POLICY, registerEnvSecretGuard } from '../dsh/env-secret-guard.mjs';
import { allow, disabled, enabled, pluginHarness } from '../../shared/tests/dsh-plugin-harness.mjs';

function call(name, args, cwd = '/fixture/workspace') {
  return { name, arguments: args, agent: { session: { id: 'env-session', header: { cwd } } } };
}

test('env secret guard denies read, write, patch and shell access to a dotenv file', async () => {
  const { ctx, fire } = pluginHarness();
  registerEnvSecretGuard(ctx, { isEnabled: enabled });
  for (const [name, args] of [
    ['read', { path: '.env' }],
    ['write', { path: '.env.local', content: 'X=1' }],
    ['apply_patch', { patch: '*** Begin Patch\n*** Update File: .env\n*** End Patch' }],
    ['bash', { command: 'cat .env' }],
  ]) {
    const result = await fire('tools/pre-execute', call(name, args), allow);
    assert.equal(result.kind, 'deny', name);
    assert.match(result.reason, /dotenv file/);
  }
  assert.equal((await fire('tools/pre-execute', call('read', { path: '.env.example' }), allow)).kind, 'allow');
});

test('env secret guard judges paths against the session working directory', async () => {
  const seen = [];
  const { ctx, fire } = pluginHarness();
  const core = {
    ...guardCore,
    evaluateToolCall(request) {
      seen.push(request);
      return { decision: 'allow', reason: null };
    },
  };
  registerEnvSecretGuard(ctx, { core, isEnabled: enabled });
  await fire('tools/pre-execute', call('read', { path: 'a.ts' }, '/session/dir'), allow);
  assert.equal(seen[0].cwd, '/session/dir');
  assert.equal(seen[0].tool, 'read');
});

test('env secret guard registers nothing when its kill switch is set', () => {
  const { ctx, handlers } = pluginHarness();
  registerEnvSecretGuard(ctx, { isEnabled: disabled });
  assert.equal(handlers.size, 0);
});

test('throw policy: env secret guard fails open and logs when its core throws', async () => {
  assert.equal(ERROR_POLICY, 'fail-open');
  const { ctx, fire, logs } = pluginHarness();
  const core = { ...guardCore, evaluateToolCall() { throw new Error('fixture failure'); } };
  registerEnvSecretGuard(ctx, { core, isEnabled: enabled });
  const result = await fire('tools/pre-execute', call('read', { path: '.env' }), allow);
  assert.equal(result.kind, 'allow');
  assert.equal(logs.length, 1);
});

test('env secret guard adds a notice after a call whose result holds a dotenv value', async () => {
  const { ctx, fire } = pluginHarness();
  const seen = [];
  const watch = {
    snapshotDotenv() {},
    reviewToolResult(call) {
      seen.push(call);
      return { message: call.output === 'leak' ? 'env-secret-guard: notice' : null };
    },
  };
  registerEnvSecretGuard(ctx, { watch, isEnabled: enabled, createNotice: async (text) => ({ text }) });
  const accept = async () => ({ kind: 'accept' });
  const flagged = await fire('tools/post-execute', call('bash', { command: 'node x.js' }, '/session/dir'), { content: 'leak' }, accept);
  assert.deepEqual(flagged.additionalContexts, [{ text: 'env-secret-guard: notice' }]);
  assert.equal(seen[0].cwd, '/session/dir');
  const clean = await fire('tools/post-execute', call('bash', { command: 'ls' }), { content: 'ok' }, accept);
  assert.equal(clean.additionalContexts, undefined);
});
