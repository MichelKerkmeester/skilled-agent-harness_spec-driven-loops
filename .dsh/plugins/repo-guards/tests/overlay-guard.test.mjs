// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Tests - Overlay Guard (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the deny for an overlay-owned write, apply_patch path reading, note
// logging, the kill switch and the fail-open throw policy.

import assert from 'node:assert/strict';
import test from 'node:test';

import overlayCore from '../../../../.skilled/hooks/overlay-guard/lib/overlay-guard.cjs';

import { ERROR_POLICY, registerOverlayGuard } from '../adapters/overlay-guard.mjs';
import { disabled, enabled, pluginHarness } from './harness.mjs';

const allow = async () => ({ kind: 'allow' });

function stubCore(decision, seen = []) {
  return {
    fileFieldPath: overlayCore.fileFieldPath,
    pathsFromPatch: overlayCore.pathsFromPatch,
    evaluateWrite(request) {
      seen.push(request);
      return decision;
    },
  };
}

function call(name, args, cwd = '/fixture/workspace') {
  return { name, arguments: args, agent: { session: { id: 'overlay-session', header: { cwd } } } };
}

test('overlay guard denies a write to a path the overlay owns', async () => {
  const seen = [];
  const { ctx, fire } = pluginHarness();
  registerOverlayGuard(ctx, {
    core: stubCore({ decision: 'deny', reason: 'overlay owns vendor/x.md', notes: [] }, seen),
    isEnabled: enabled,
  });
  const result = await fire('tools/pre-execute', call('write', { path: 'vendor/x.md', content: 'x' }), allow);
  assert.deepEqual(result, { kind: 'deny', reason: 'overlay owns vendor/x.md' });
  assert.deepEqual(seen[0].paths, ['vendor/x.md']);
  assert.equal(seen[0].sessionDir, '/fixture/workspace');
});

test('overlay guard reads every path an apply_patch body names', async () => {
  const seen = [];
  const { ctx, fire } = pluginHarness();
  registerOverlayGuard(ctx, { core: stubCore({ decision: 'allow', reason: null, notes: [] }, seen), isEnabled: enabled });
  const patch = '*** Begin Patch\n*** Update File: a.md\n*** Add File: b.md\n*** End Patch';
  const result = await fire('tools/pre-execute', call('apply_patch', { patch }), allow);
  assert.equal(result.kind, 'allow');
  assert.deepEqual(seen[0].paths, ['a.md', 'b.md']);
});

test('overlay guard ignores tools that write no file and honors its kill switch', async () => {
  const seen = [];
  const { ctx, fire } = pluginHarness();
  registerOverlayGuard(ctx, { core: stubCore({ decision: 'deny', reason: 'no', notes: [] }, seen), isEnabled: enabled });
  assert.equal((await fire('tools/pre-execute', call('bash', { command: 'ls' }), allow)).kind, 'allow');
  assert.equal(seen.length, 0);

  const off = pluginHarness();
  registerOverlayGuard(off.ctx, { core: stubCore({ decision: 'deny', reason: 'no', notes: [] }), isEnabled: disabled });
  assert.equal(off.handlers.size, 0);
});

test('throw policy: overlay guard fails open and logs when its core throws', async () => {
  assert.equal(ERROR_POLICY, 'fail-open');
  const { ctx, fire, logs } = pluginHarness();
  registerOverlayGuard(ctx, {
    core: { ...stubCore(null), evaluateWrite() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await fire('tools/pre-execute', call('edit', { path: 'x.md' }), allow);
  assert.equal(result.kind, 'allow');
  assert.equal(logs.length, 1);
});

test('overlay guard logs the notes the core attaches to an allowed write', async () => {
  const { ctx, fire, logs } = pluginHarness();
  registerOverlayGuard(ctx, {
    core: stubCore({ decision: 'allow', reason: null, notes: ['overlay-guard: could not judge x.md, allowing'] }),
    isEnabled: enabled,
  });
  const result = await fire('tools/pre-execute', call('edit', { path: 'x.md' }), allow);
  assert.equal(result.kind, 'allow');
  assert.deepEqual(logs.map((entry) => entry.message), ['overlay-guard: could not judge x.md, allowing']);
});
