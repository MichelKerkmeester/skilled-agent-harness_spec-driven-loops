// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Spec Gate (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers shared-core parity and the throw policy of the spec-gate classify and
// enforce adapters, operator-only classification and the ask delivery record.

import assert from 'node:assert/strict';
import test from 'node:test';

import * as specGateCore from '../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';
import { ERROR_POLICY as classifyPolicy, registerSpecGateClassify } from '../dsh/spec-gate-classify.mjs';
import { ERROR_POLICY as enforcePolicy, registerSpecGateEnforce } from '../dsh/spec-gate-enforce.mjs';
import { adapterHarness, allow, cleanup, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

test('parity: spec classification defers an open gate without stopping the model step', async () => {
  const directory = tempDir();
  try {
    const env = {};
    const prompt = 'I need to create a new file for this change.';
    const sessionID = specGateCore.resolveSessionKey({ sessionId: 'classify-parity' });
    const expected = specGateCore.runClassifyGate({ prompt, sessionID, projectDir: directory, env, runtimeLabel: 'DSH' });
    assert.ok(expected.question);

    const { ctx, handlers } = adapterHarness();
    registerSpecGateClassify(ctx, {
      core: specGateCore,
      env,
      cwd: directory,
      createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
    });
    const result = await handlers.get('agent/pre-step')({
      agent: { session: { id: 'classify-parity', header: { cwd: directory } } },
      messages: [{ role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: prompt }] }],
    }, async () => ({ kind: 'enter', messages: [] }));
    assert.equal(result.kind, 'enter');
    assert.equal(result.messages.length, 1);
    assert.match(result.messages[0].content[0].text, /first file mutation/);
  } finally {
    cleanup(directory);
  }
});

test('spec classification reads only what the operator typed, never an injected notice', async () => {
  const directory = tempDir();
  try {
    const env = {};
    const prompt = 'I need to create a new file for this change.';
    const operator = (text) => ({ role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text }] });
    const injected = (text) => ({ role: 'user', source: { kind: 'repo-guards' }, content: [{ type: 'text', text }] });
    const { ctx, handlers } = adapterHarness();
    registerSpecGateClassify(ctx, {
      core: specGateCore,
      env,
      cwd: directory,
      createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
    });
    const step = (sessionId, messages) => handlers.get('agent/pre-step')({
      agent: { session: { id: sessionId, header: { cwd: directory } } },
      messages,
    }, async () => ({ kind: 'enter', messages: [] }));

    // A session-context notice spliced in after the prompt must not hide the prompt.
    const prompted = await step('classify-operator', [operator(prompt), injected('Session context received.')]);
    assert.equal(prompted.messages.length, 1);
    assert.match(prompted.messages[0].content[0].text, /first file mutation/);

    // A notice that reads like a mutation request is not the operator asking for one.
    const noticeOnly = await step('classify-notice', [injected(prompt)]);
    assert.equal(noticeOnly.messages.length, 0);
  } finally {
    cleanup(directory);
  }
});

test('parity: spec enforcement allows a child-session mutation under the shared core', async () => {
  const directory = tempDir();
  try {
    const env = { AI_SESSION_CHILD: '1' };
    const sessionID = specGateCore.resolveSessionKey({ sessionId: 'enforce-parity' });
    const expected = specGateCore.runEnforceGate({
      tool: 'bash', filePath: undefined, sessionID, projectDir: directory, env, runtimeKey: 'dsh',
    });
    assert.equal(expected.decision, 'allow');

    const { ctx, handlers } = adapterHarness();
    registerSpecGateEnforce(ctx, { core: specGateCore, env, cwd: directory });
    const result = await handlers.get('tools/pre-execute')({
      name: 'bash', arguments: { command: 'echo ready' },
      agent: { session: { id: 'enforce-parity', header: { cwd: directory } } },
    }, allow);
    assert.equal(result.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('throw policy: spec classification fails open and logs when its core throws', async () => {
  assert.equal(classifyPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerSpecGateClassify(ctx, {
    core: {
      ...specGateCore,
      runClassifyGate() { throw new Error('fixture failure'); },
    },
    cwd: process.cwd(),
  });
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'classify-throw', header: { cwd: process.cwd() } } },
    messages: [{ role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'Please make a new file.' }] }],
  }, async () => ({ kind: 'enter', messages: [] }));
  assert.equal(result.kind, 'enter');
  assert.equal(logs.length, 1);
});

test('throw policy: spec enforcement fails closed and logs when its core throws', async () => {
  assert.equal(enforcePolicy, 'fail-closed');
  const { ctx, handlers, logs } = adapterHarness();
  registerSpecGateEnforce(ctx, {
    core: {
      resolveSessionKey: specGateCore.resolveSessionKey,
      runEnforceGate() { throw new Error('fixture failure'); },
    },
  });
  let delegated = false;
  const result = await handlers.get('tools/pre-execute')({
    name: 'write', arguments: { path: 'notes.txt' },
    agent: { session: { id: 'enforce-throw', header: { cwd: process.cwd() } } },
  }, async () => { delegated = true; return { kind: 'allow' }; });
  assert.equal(result.kind, 'deny');
  assert.equal(delegated, false);
  assert.equal(logs.length, 1);
});

test('spec enforcement records the notice it delivers through ask, and only then', async () => {
  let observed = 0;
  const verdicts = [
    { decision: 'advise', detail: 'Choose a spec folder.', gateOpenUndelivered: true },
    { decision: 'advise', detail: 'Choose a spec folder.', gateOpenUndelivered: false },
  ];
  const { ctx, handlers } = adapterHarness();
  registerSpecGateEnforce(ctx, {
    core: {
      resolveSessionKey: specGateCore.resolveSessionKey,
      runEnforceGate() { return { ...verdicts.shift(), observe() { observed += 1; } }; },
    },
  });
  const call = { name: 'write', arguments: { path: 'notes.txt' }, agent: { session: { id: 'enforce-observe' } } };
  const asked = await handlers.get('tools/pre-execute')(call, allow);
  assert.equal(asked.kind, 'ask');
  assert.equal(observed, 1);
  const passed = await handlers.get('tools/pre-execute')(call, allow);
  assert.equal(passed.kind, 'allow');
  assert.equal(observed, 1);
});
