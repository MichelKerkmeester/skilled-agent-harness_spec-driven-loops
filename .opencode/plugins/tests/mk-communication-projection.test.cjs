// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-communication-projection Regression Tests                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the projection adapter's gate matrix (enablement x kill-    ║
// ║          switch), the message-id snapshot / byte-exact restore contract, ║
// ║          the fail-open boundary, and the no-terminal-output guarantee -- ║
// ║          against hermetic fixtures, no live OpenCode session or live     ║
// ║          provider required. The projection path is exercised through the ║
// ║          injectable core; the real projectMessage() integration asserts  ║
// ║          the seam fails open to the byte-exact original when no          ║
// ║          transcript is available.                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const DISABLED_ENV = 'MK_COMMUNICATION_PROJECTION_DISABLED';
const ENABLE_ENV = 'COMMUNICATION_PROJECTION_ENABLED';
const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'mk-communication-projection.js')).href;
const distUrl = pathToFileURL(path.join(
  __dirname,
  '..', '..',
  'skills', 'sk-communication', 'cli-communication-projection', 'dist', 'index.js',
)).href;

async function loadPlugin() {
  return import(pluginUrl);
}

async function getTestSurface() {
  const { default: Plugin } = await loadPlugin();
  return Plugin.__test;
}

function textPart(id, text, messageID = 'msg-1') {
  return { id, sessionID: 'sess-1', messageID, type: 'text', text };
}

function reasoningPart(id, text, messageID = 'msg-1') {
  return { id, sessionID: 'sess-1', messageID, type: 'reasoning', text, time: { start: 0 } };
}

function toolPart(id, messageID = 'msg-1') {
  return {
    id,
    sessionID: 'sess-1',
    messageID,
    type: 'tool',
    callID: 'call-1',
    tool: 'read',
    state: { status: 'completed', input: {}, output: '', title: '', metadata: {}, time: { start: 0, end: 1 } },
  };
}

function makeInput(messageID = 'msg-1') {
  return { sessionID: 'sess-1', messageID };
}

async function withEnv(key, value, fn) {
  const prev = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env[key];
    else process.env[key] = prev;
  }
}

async function runTrapped(callback) {
  const calls = [];
  const original = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    stdout: process.stdout.write,
    stderr: process.stderr.write,
  };
  console.log = (m) => calls.push(`log:${m}`);
  console.error = (m) => calls.push(`error:${m}`);
  console.warn = (m) => calls.push(`warn:${m}`);
  process.stdout.write = (chunk) => { calls.push(`stdout:${chunk}`); return true; };
  process.stderr.write = (chunk) => { calls.push(`stderr:${chunk}`); return true; };
  try {
    await callback();
  } finally {
    console.log = original.log;
    console.error = original.error;
    console.warn = original.warn;
    process.stdout.write = original.stdout;
    process.stderr.write = original.stderr;
  }
  return calls;
}

function makeProjectStub({ status = 'projection', text = 'projected text', throws = false } = {}) {
  const calls = [];
  const fn = async (input) => {
    calls.push(input);
    if (throws) throw new Error('boom');
    return { status, text, mode: status === 'projection' ? 'atomic-replace' : 'exact-original-only' };
  };
  fn.calls = calls;
  return fn;
}

function coreWith(__test, overrides) {
  const project = overrides.projectMessage ?? makeProjectStub();
  const core = __test.createProjectionCore({
    projectMessage: project,
    isProjectionEnabled: overrides.isProjectionEnabled ?? (() => true),
    isHookEnabled: overrides.isHookEnabled ?? (() => true),
  });
  return { core, project };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PART HELPERS
// ─────────────────────────────────────────────────────────────────────────────

test('isTextPart accepts only text parts carrying a string', async () => {
  const __test = await getTestSurface();
  assert.equal(__test.isTextPart(textPart('p1', 'hello')), true);
  assert.equal(__test.isTextPart(reasoningPart('p2', 'thinking')), false);
  assert.equal(__test.isTextPart(toolPart('p3')), false);
  assert.equal(__test.isTextPart(null), false);
  assert.equal(__test.isTextPart({ type: 'text' }), false);
});

test('extractText joins text parts and returns null when none exist', async () => {
  const __test = await getTestSurface();
  assert.equal(__test.extractText([textPart('p1', 'a'), textPart('p2', 'b')]), 'a\nb');
  assert.equal(__test.extractText([toolPart('p1')]), null);
  assert.equal(__test.extractText([]), null);
});

test('applyProjection replaces the first text part and preserves non-text parts', async () => {
  const __test = await getTestSurface();
  const parts = [toolPart('t1'), textPart('a1', 'original'), reasoningPart('r1', 'think'), textPart('a2', 'extra')];
  const projected = __test.applyProjection(parts, 'projected');
  assert.equal(projected.length, 3);
  assert.deepEqual(projected[0], toolPart('t1'));
  assert.equal(projected[1].text, 'projected');
  assert.equal(projected[1].id, 'a1');
  assert.deepEqual(projected[2], reasoningPart('r1', 'think'));
  assert.equal(__test.applyProjection([toolPart('t1')], 'x'), null);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SNAPSHOT MAP
// ─────────────────────────────────────────────────────────────────────────────

test('snapshot map stores once, reads clones, and evicts oldest at bound', async () => {
  const __test = await getTestSurface();
  const map = __test.createSnapshotMap(2);
  assert.equal(map.set('a', [textPart('p1', 'one')]), true);
  assert.equal(map.set('a', [textPart('p2', 'two')]), false);
  assert.equal(map.set('b', [textPart('p3', 'three')]), true);
  assert.equal(map.set('c', [textPart('p4', 'four')]), true);
  assert.equal(map.has('a'), false);
  assert.equal(map.has('b'), true);
  assert.equal(map.has('c'), true);
  const got = map.get('b');
  assert.equal(got[0].text, 'three');
  got[0].text = 'mutated';
  assert.equal(map.get('b')[0].text, 'three');
  assert.equal(map.get('missing'), null);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. INPUT CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

test('buildProjectionInput encodes the exact text and a completed assistant event', async () => {
  const __test = await getTestSurface();
  const input = __test.buildProjectionInput({
    sessionID: 'sess-1',
    messageID: 'msg-1',
    text: 'hello world',
    now: '2026-08-14T00:00:00.000Z',
  });
  assert.equal(input.generation.key.runtime, 'opencode');
  assert.equal(input.generation.key.sessionId, 'sess-1');
  assert.equal(input.generation.key.messageId, 'msg-1');
  const decoded = Buffer.from(input.generation.exactOriginal.bytesBase64, 'base64').toString('utf8');
  assert.equal(decoded, 'hello world');
  assert.equal(input.events.length, 1);
  assert.equal(input.events[0].event.kind, 'assistant-message');
  assert.equal(input.events[0].event.terminalStatus, 'completed');
  assert.equal(input.events[0].event.canonicalPayloadRef, input.generation.exactOriginal.originalId);
  assert.equal(input.context.transcript, null);
  assert.equal(input.context.noContextFallback, 'exact-original');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROJECTION CORE -- gate matrix, restore, and fail-open
// ─────────────────────────────────────────────────────────────────────────────

test('enabled: a projection replaces the text parts', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub({ text: 'projected text' });
  const { core } = coreWith(__test, { projectMessage: project });
  const parts = [textPart('a1', 'original text'), toolPart('t1')];
  const output = { parts };
  await core.chatMessage(makeInput(), output);
  assert.equal(project.calls.length, 1);
  assert.equal(output.parts[0].text, 'projected text');
  assert.deepEqual(output.parts[1], toolPart('t1'));
});

test('enabled: an exact-original outcome leaves the parts byte-identical', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub({ status: 'exact-original', text: 'original text' });
  const { core } = coreWith(__test, { projectMessage: project });
  const parts = [textPart('a1', 'original text')];
  const original = structuredClone(parts);
  const output = { parts };
  await core.chatMessage(makeInput(), output);
  assert.equal(project.calls.length, 1);
  assert.deepEqual(output.parts, original);
});

test('a thrown projectMessage error fails open and leaves the parts byte-identical', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub({ throws: true });
  const { core } = coreWith(__test, { projectMessage: project });
  const parts = [textPart('a1', 'original text')];
  const original = structuredClone(parts);
  const output = { parts };
  await assert.doesNotReject(core.chatMessage(makeInput(), output));
  assert.deepEqual(output.parts, original);
});

test('enablement off: projectMessage is never called and parts stay untouched', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub();
  const { core } = coreWith(__test, { projectMessage: project, isProjectionEnabled: () => false });
  const parts = [textPart('a1', 'original text')];
  const output = { parts };
  await core.chatMessage(makeInput(), output);
  assert.equal(project.calls.length, 0);
  assert.equal(output.parts[0].text, 'original text');
});

test('kill-switch off: projectMessage is never called and parts stay untouched', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub();
  const { core } = coreWith(__test, { projectMessage: project, isHookEnabled: () => false });
  const parts = [textPart('a1', 'original text')];
  const output = { parts };
  await core.chatMessage(makeInput(), output);
  assert.equal(project.calls.length, 0);
  assert.equal(output.parts[0].text, 'original text');
});

test('a second invocation for the same message restores the original from the snapshot', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub({ text: 'projected text' });
  const { core } = coreWith(__test, { projectMessage: project });
  const original = [textPart('a1', 'original text')];
  const output = { parts: structuredClone(original) };
  await core.chatMessage(makeInput(), output);
  assert.equal(output.parts[0].text, 'projected text');
  assert.equal(project.calls.length, 1);
  await core.chatMessage(makeInput(), output);
  assert.equal(project.calls.length, 1);
  assert.deepEqual(output.parts, original);
});

test('malformed output.parts does not throw into the session', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub();
  const { core } = coreWith(__test, { projectMessage: project });
  await assert.doesNotReject(core.chatMessage(makeInput(), undefined));
  await assert.doesNotReject(core.chatMessage(makeInput(), { parts: 'not-an-array' }));
  assert.equal(project.calls.length, 0);
});

test('no message identity leaves the parts untouched', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub();
  const { core } = coreWith(__test, { projectMessage: project });
  const parts = [{ type: 'text', text: 'no id here' }];
  const output = { parts };
  await core.chatMessage({ sessionID: '' }, output);
  assert.equal(project.calls.length, 0);
  assert.equal(output.parts[0].text, 'no id here');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. REAL PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

test('the plugin factory registers the chat.message hook', async () => {
  const { default: Plugin } = await loadPlugin();
  const hooks = await Plugin({ directory: __dirname });
  assert.equal(typeof hooks['chat.message'], 'function');
});

test('the real plugin fails open to the byte-exact original with enablement on and no transcript', async () => {
  const { default: Plugin } = await loadPlugin();
  const hooks = await Plugin({ directory: __dirname });
  const parts = [textPart('a1', 'original text')];
  const original = structuredClone(parts);
  const output = { parts };
  await withEnv(DISABLED_ENV, undefined, () => withEnv(ENABLE_ENV, '1', async () => {
    await hooks['chat.message'](makeInput(), output);
  }));
  assert.deepEqual(output.parts, original);
});

test('the real plugin is a no-op when the kill-switch is set', async () => {
  const { default: Plugin } = await loadPlugin();
  const hooks = await Plugin({ directory: __dirname });
  const parts = [textPart('a1', 'original text')];
  const original = structuredClone(parts);
  const output = { parts };
  await withEnv(DISABLED_ENV, '1', () => withEnv(ENABLE_ENV, '1', async () => {
    await hooks['chat.message'](makeInput(), output);
  }));
  assert.deepEqual(output.parts, original);
});

test('the plugin writes nothing to stdout or stderr', async () => {
  const __test = await getTestSurface();
  const project = makeProjectStub({ text: 'projected text' });
  const { core } = coreWith(__test, { projectMessage: project });
  const output = { parts: [textPart('a1', 'original text')] };
  const calls = await runTrapped(() => core.chatMessage(makeInput(), output));
  assert.deepEqual(calls, []);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOCAL PROVIDER LOADER PATH -- real entrypoint with injected loader config
// ─────────────────────────────────────────────────────────────────────────────

test('an injected loader config projects the rewritten text through the real plugin', async () => {
  const dist = await import(distUrl);
  const now = '2026-08-14T00:00:00.000Z';
  const transport = async (request) => {
    const messages = request.body.messages;
    const user = messages.find((entry) => entry.role === 'user').content;
    return {
      status: 200,
      body: {
        done: true,
        message: { content: user.replace('deploy', 'ship').replace(' now', ' today') },
      },
    };
  };
  const config = dist.parseLocalProjectionConfig(
    { enabled: true, localProvider: { kind: 'ollama', model: 'llama3.2' } },
    { now, transport },
  );
  assert.ok(config !== null, 'the loader must produce a config for a valid block');
  const __test = await getTestSurface();
  const core = __test.createProjectionCore({
    projectMessage: dist.projectMessage,
    isProjectionEnabled: () => true,
    isHookEnabled: () => true,
    loadProjectionConfig: () => config,
  });
  const parts = [textPart('a1', 'deploy the release build now.')];
  const output = { parts };
  await withEnv(ENABLE_ENV, '1', () => core.chatMessage(makeInput(), output));
  assert.equal(output.parts[0].text, 'ship the release build today.');
});

test('a null loader config keeps the real plugin byte-exact', async () => {
  const dist = await import(distUrl);
  const __test = await getTestSurface();
  const core = __test.createProjectionCore({
    projectMessage: dist.projectMessage,
    isProjectionEnabled: () => true,
    isHookEnabled: () => true,
    loadProjectionConfig: () => null,
  });
  const parts = [textPart('a1', 'deploy the release build now.')];
  const original = structuredClone(parts);
  const output = { parts };
  await withEnv(ENABLE_ENV, '1', () => core.chatMessage(makeInput(), output));
  assert.deepEqual(output.parts, original);
});
