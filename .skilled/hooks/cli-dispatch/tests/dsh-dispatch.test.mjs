// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Dispatch (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the throw policy of the dispatch audit and
// dispatch preflight adapters, and the preflight reading this checkout's rules.

import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import * as dispatchAuditCore from '../lib/dispatch-audit.mjs';
import * as dispatchRuleCore from '../lib/dispatch-rule-checks.mjs';
import { ERROR_POLICY as auditPolicy, registerDispatchAudit } from '../dsh/dispatch-audit.mjs';
import { ERROR_POLICY as preflightPolicy, registerDispatchPreflightLint } from '../dsh/dispatch-preflight-lint.mjs';
import { accept, adapterHarness, allow, enabled, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

test('parity: dispatch audit observes the shared core verdict without blocking bash', async () => {
  const command = 'echo ready';
  const expected = dispatchAuditCore.inspectDispatch(command);
  assert.equal(expected.kind, 'none');

  const { ctx, handlers } = adapterHarness();
  registerDispatchAudit(ctx, { core: dispatchAuditCore, isEnabled: enabled });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command }, callId: 'audit-1' },
    { content: [{ type: 'text', text: 'ready' }] },
    accept,
  );
  assert.equal(result.kind, 'accept');
});

test('parity: dispatch preflight allows a command with no shared-core violations', async () => {
  const command = 'echo ready';
  const expected = dispatchRuleCore.evaluateDispatch(command, path.join(process.cwd(), '.skilled', 'skills'));
  assert.deepEqual(expected, []);

  const { ctx, handlers } = adapterHarness();
  registerDispatchPreflightLint(ctx, { core: dispatchRuleCore, isEnabled: enabled });
  const result = await handlers.get('tools/pre-execute')({ name: 'bash', arguments: { command } }, allow);
  assert.equal(result.kind, 'allow');
});

test('preflight reads the hard rules of this checkout even when the session runs outside it', async () => {
  const outside = tempDir();
  try {
    const command = 'dsh --profile headless --json -';
    const expected = dispatchRuleCore.evaluateDispatch(command, path.join(REPO_ROOT, '.skilled', 'skills'));
    assert.ok(expected.length > 0, 'an unguarded dsh dispatch must violate a hard rule');

    const { ctx, handlers } = adapterHarness();
    registerDispatchPreflightLint(ctx, { core: dispatchRuleCore, isEnabled: enabled });
    const result = await handlers.get('tools/pre-execute')(
      { name: 'bash', arguments: { command }, agent: { session: { header: { cwd: outside } } } },
      allow,
    );
    assert.equal(result.kind, 'deny');
  } finally {
    rmSync(outside, { recursive: true, force: true });
  }
});

test('throw policy: dispatch audit fails open and logs when its core throws', async () => {
  assert.equal(auditPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerDispatchAudit(ctx, {
    core: { recordDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'echo ready' } }, { content: [] }, accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(logs.length, 1);
});

test('throw policy: dispatch preflight fails closed and logs when its core throws', async () => {
  assert.equal(preflightPolicy, 'fail-closed');
  const { ctx, handlers, logs } = adapterHarness();
  registerDispatchPreflightLint(ctx, {
    core: { evaluateDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  let delegated = false;
  const result = await handlers.get('tools/pre-execute')(
    { name: 'bash', arguments: { command: 'echo ready' } },
    async () => { delegated = true; return { kind: 'allow' }; },
  );
  assert.equal(result.kind, 'deny');
  assert.equal(delegated, false);
  assert.equal(logs.length, 1);
});
