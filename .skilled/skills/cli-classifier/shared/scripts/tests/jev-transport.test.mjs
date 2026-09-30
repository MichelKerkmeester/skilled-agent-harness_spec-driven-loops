// ───────────────────────────────────────────────────────────────────
// MODULE: Jev Transport Tests
// ───────────────────────────────────────────────────────────────────
// Both backends are stubs: a recorded child-process factory and a recorded
// classifier runtime. No test opens a socket, calls a model or needs a key.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import * as S from '../jev-transport.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ───────────────────────────────────────────────────────────────────

const CHOICE_ARGS = ['choice', '--provider', 'official', '-q', 'Which option?', '-o', 'a=First', '-o', 'b=Second'];
const STATE_TEXT = 'the state text';
const CLASSIFIER_MODEL = { id: 'typesafe/jev-1.13' };
const SKIP = {
  package: 'skip: pi transport unavailable (package), using jev CLI',
  model: 'skip: pi transport unavailable (model), using jev CLI',
  credential: 'skip: pi transport unavailable (credential), using jev CLI',
  backend: 'skip: pi transport unavailable (backend), using jev CLI',
};

// Fresh temp directory whose name marks it as a fixture.
function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `jevtransport-${prefix}-`));
}

// The `pi` a fixture PATH finds must belong to the package by name, so the
// executable sits inside a tree whose manifest names it.
function stubPiPackage(root) {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'pi'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: '@earendil-works/pi-coding-agent', version: '0.99.1' }),
  );
  return bin;
}

// Minimal pipe stand-in: the spawn port only sets an encoding and reads data.
function fakeStream() {
  const stream = new EventEmitter();
  stream.setEncoding = () => {};
  return stream;
}

// One fake child, with its stdin text and outcome recorded. Listeners attach
// after spawn() returns, so data, error and close are emitted on the next tick;
// a child with close false never closes, which is what a timeout test needs.
function spawnStub({ stdout = '', stderr = '', code = 0, error = null, close = true } = {}) {
  const calls = [];
  const stdin = [];
  const killed = [];
  const spawnFn = (file, args, opts) => {
    calls.push({ file, args, opts });
    const child = new EventEmitter();
    child.stdout = fakeStream();
    child.stderr = fakeStream();
    child.stdin = { on: () => {}, end: (text) => { stdin.push(text); } };
    child.kill = (signal) => { killed.push(signal); };
    setImmediate(() => {
      if (error !== null) {
        child.emit('error', error);
        return;
      }
      if (stdout !== '') child.stdout.emit('data', stdout);
      if (stderr !== '') child.stderr.emit('data', stderr);
      if (close) child.emit('close', code);
    });
    return child;
  };
  return { spawnFn, calls, stdin, killed };
}

// One classifier runtime: the catalog read, the model lookup and the classify
// call. Without an injected classify the call rejects, so a test that never
// means to reach Pi fails loudly if the transport does.
function runtimeStub({ known = [CLASSIFIER_MODEL], available = known, classify } = {}) {
  const calls = { model: [], available: [], classify: [] };
  return {
    calls,
    getModelOfType: (type, providerId, modelId) => {
      calls.model.push({ type, providerId, modelId });
      return known.some((entry) => entry.id === modelId) ? { type, provider: providerId, id: modelId } : undefined;
    },
    getAvailableOfType: async (type, providerId) => {
      calls.available.push({ type, providerId });
      return available;
    },
    classify: (model, context, options) => {
      calls.classify.push({ model, context, options });
      return classify === undefined
        ? Promise.reject(new Error('classify must not be called here'))
        : classify(model, context, options);
    },
  };
}

// Collects the lines a call reports, so a test can pin what the caller sees.
function collector() {
  const lines = [];
  return { lines, report: (line) => lines.push(line) };
}

function callOptions(overrides = {}) {
  return {
    file: '/usr/bin/jev',
    args: CHOICE_ARGS,
    stdin: STATE_TEXT,
    env: { PATH: '/nonexistent' },
    timeoutMs: 1000,
    ...overrides,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. TRANSPORT SELECTION
// ───────────────────────────────────────────────────────────────────

test('resolve_transport_defaults_to_cli', () => {
  assert.deepEqual(S.resolveTransport(undefined, {}), { transport: 'jev', line: null });
});

test('resolve_transport_reads_the_environment', () => {
  assert.deepEqual(S.resolveTransport(undefined, { JEV_TRANSPORT: 'pi' }), { transport: 'pi', line: null });
});

test('resolve_transport_option_wins_over_the_environment', () => {
  assert.deepEqual(S.resolveTransport('jev', { JEV_TRANSPORT: 'pi' }), { transport: 'jev', line: null });
});

test('resolve_transport_empty_value_is_unset', () => {
  assert.deepEqual(S.resolveTransport('', { JEV_TRANSPORT: '' }), { transport: 'jev', line: null });
});

test('resolve_transport_unknown_value_names_itself', () => {
  assert.deepEqual(S.resolveTransport('auto', {}), {
    transport: 'jev',
    line: "skip: unknown transport 'auto', using jev CLI",
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. REQUEST MAPPING
// ───────────────────────────────────────────────────────────────────

test('choice_request_parses_the_cli_arguments', () => {
  assert.deepEqual(
    S.choiceRequestFrom(['choice', '--provider', 'official', '-q', 'Q', '-o', 'a=A', '-o', 'b=B']),
    { question: 'Q', keys: ['a', 'b'], criteria: { a: 'A', b: 'B' } },
  );
});

test('choice_request_rejects_any_other_invocation', () => {
  const rejected = [
    ['noul', '-q', 'Q'],
    ['auth', 'test', '--provider', 'official'],
    ['choice', '--pretty', '-q', 'Q', '-o', 'a=A'],
    ['choice', '-s', '-', '-q', 'Q', '-o', 'a=A'],
    ['choice', '--state', '-', '-q', 'Q', '-o', 'a=A'],
    ['choice', '--value', '-q', 'Q', '-o', 'a=A'],
    ['choice', '--endpoint', 'https://example.invalid', '-q', 'Q', '-o', 'a=A'],
    ['choice', '-q', 'Q'],
  ];
  for (const args of rejected) assert.equal(S.choiceRequestFrom(args), null, args.join(' '));
});

test('classifier_context_carries_the_state_and_ordered_criteria', () => {
  const request = { question: 'Q', keys: ['a', 'b'], criteria: { a: 'A', b: 'B' } };
  const context = S.classifierContextFor(request, 'the row prompt');
  assert.deepEqual(context, {
    state: { request: 'the row prompt' },
    questions: { answer: { type: 'choice', instructions: 'Q', criteria: { a: 'A', b: 'B' } } },
  });
  assert.deepEqual(Object.keys(context.questions.answer.criteria), ['a', 'b']);
});

// ───────────────────────────────────────────────────────────────────
// 5. PAYLOAD MAPPING
// ───────────────────────────────────────────────────────────────────

test('choice_payload_matches_the_cli_shape', () => {
  const answer = {
    stopReason: 'stop',
    answers: {
      answer: { choice: 'b', probabilities: { a: 0.25, b: 0.7, none: 0.05 }, confidence: 0.9 },
    },
  };
  const payload = S.choicePayloadFor(answer, ['a', 'b'], 'typesafe/jev-1.13');
  assert.deepEqual(payload, {
    answers: { answer: { choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    model: 'typesafe/jev-1.13',
  });
  assert.deepEqual(Object.keys(payload.answers.answer.probabilities), ['a', 'b']);
});

test('choice_payload_rejects_a_partial_or_foreign_pick', () => {
  const partial = { answers: { answer: { choice: 'a', probabilities: { a: 0.5 }, confidence: 0.9 } } };
  const foreign = { answers: { answer: { choice: 'c', probabilities: { a: 0.4, b: 0.6 }, confidence: 0.9 } } };
  const nonNumber = { answers: { answer: { choice: 'a', probabilities: { a: '0.5', b: 0.5 }, confidence: 0.9 } } };
  assert.equal(S.choicePayloadFor(partial, ['a', 'b'], 'typesafe/jev-1.13'), null);
  assert.equal(S.choicePayloadFor(foreign, ['a', 'b'], 'typesafe/jev-1.13'), null);
  assert.equal(S.choicePayloadFor(nonNumber, ['a', 'b'], 'typesafe/jev-1.13'), null);
});

// ───────────────────────────────────────────────────────────────────
// 6. CALL SPAWN
// ───────────────────────────────────────────────────────────────────

test('spawn_call_switch_off_is_the_cli_spawn', async () => {
  const env = { PATH: '/nonexistent' };
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n', code: 0 });
  const runtime = runtimeStub();
  const outcome = await S.spawnClassifierCall(
    callOptions({ env, report }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(outcome.code, 0);
  assert.equal(outcome.stdout, '{"ok":true}\n');
  assert.equal(outcome.stderr, '');
  assert.equal(outcome.timedOut, false);
  assert.equal(typeof outcome.wallMs, 'number');

  assert.equal(spawn.calls.length, 1);
  assert.equal(spawn.calls[0].file, '/usr/bin/jev');
  assert.deepEqual(spawn.calls[0].args, CHOICE_ARGS);
  assert.equal(spawn.calls[0].opts.env, env);
  assert.deepEqual(spawn.calls[0].opts.stdio, ['pipe', 'pipe', 'pipe']);
  assert.equal(Object.hasOwn(spawn.calls[0].opts, 'cwd'), false);
  assert.deepEqual(spawn.stdin, [STATE_TEXT]);

  assert.deepEqual(lines, []);
  assert.deepEqual(runtime.calls.model, []);
  assert.deepEqual(runtime.calls.available, []);
  assert.deepEqual(runtime.calls.classify, []);
});

test('spawn_call_switch_on_answers_through_pi', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const env = { PATH: bin };
  const { lines, report } = collector();
  const spawn = spawnStub();
  const runtime = runtimeStub({
    classify: async () => ({
      stopReason: 'stop',
      answers: { answer: { type: 'choice', choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    }),
  });
  const outcome = await S.spawnClassifierCall(
    callOptions({ env, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(spawn.calls.length, 0);
  assert.equal(runtime.calls.classify.length, 1);
  assert.deepEqual(runtime.calls.classify[0].model, {
    type: 'classifier',
    provider: 'openrouter',
    id: 'typesafe/jev-1.13',
  });
  assert.deepEqual(runtime.calls.classify[0].context, {
    state: { request: STATE_TEXT },
    questions: { answer: { type: 'choice', instructions: 'Which option?', criteria: { a: 'First', b: 'Second' } } },
  });
  assert.deepEqual(Object.keys(runtime.calls.classify[0].options), ['signal']);
  assert.equal(runtime.calls.classify[0].options.signal instanceof AbortSignal, true);

  assert.equal(outcome.code, 0);
  assert.equal(outcome.stdout, `${JSON.stringify({
    answers: { answer: { choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    model: 'typesafe/jev-1.13',
  })}\n`);
  assert.equal(outcome.stderr, '');
  assert.equal(outcome.timedOut, false);
  assert.equal(typeof outcome.wallMs, 'number');
  assert.deepEqual(lines, []);
});

test('spawn_call_environment_switch_answers_through_pi', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const env = { PATH: bin, JEV_TRANSPORT: 'pi' };
  const { lines, report } = collector();
  const spawn = spawnStub();
  const runtime = runtimeStub({
    classify: async () => ({
      stopReason: 'stop',
      answers: { answer: { type: 'choice', choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    }),
  });
  const outcome = await S.spawnClassifierCall(
    callOptions({ env, report }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(spawn.calls.length, 0);
  assert.equal(runtime.calls.classify.length, 1);

  assert.equal(outcome.code, 0);
  assert.equal(outcome.stdout, `${JSON.stringify({
    answers: { answer: { choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    model: 'typesafe/jev-1.13',
  })}\n`);
  assert.equal(outcome.stderr, '');
  assert.equal(outcome.timedOut, false);
  assert.equal(typeof outcome.wallMs, 'number');
  assert.deepEqual(lines, []);
});

test('spawn_call_package_gate_falls_back', async () => {
  const env = { PATH: tempDir('empty') };
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub();
  const outcome = await S.spawnClassifierCall(
    callOptions({ env, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.deepEqual(lines, [SKIP.package]);
  assert.equal(spawn.calls.length, 1);
  assert.equal(outcome.stdout, '{"ok":true}\n');
  assert.deepEqual(runtime.calls.model, []);
  assert.deepEqual(runtime.calls.available, []);
  assert.deepEqual(runtime.calls.classify, []);
});

test('spawn_call_model_gate_falls_back', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub({ known: [], available: [] });
  const outcome = await S.spawnClassifierCall(
    callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.deepEqual(lines, [SKIP.model]);
  assert.equal(spawn.calls.length, 1);
  assert.equal(outcome.stdout, '{"ok":true}\n');
  assert.deepEqual(runtime.calls.available, []);
  assert.deepEqual(runtime.calls.classify, []);
});

test('spawn_call_credential_gate_falls_back', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub({ available: [] });
  const outcome = await S.spawnClassifierCall(
    callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.deepEqual(lines, [SKIP.credential]);
  assert.equal(spawn.calls.length, 1);
  assert.equal(outcome.stdout, '{"ok":true}\n');
  assert.deepEqual(runtime.calls.classify, []);
});

test('spawn_call_backend_refusal_falls_back', async () => {
  const refusals = [
    async () => { throw new Error('backend refused'); },
    async () => ({ stopReason: 'error', answers: {} }),
  ];
  for (const classify of refusals) {
    const bin = stubPiPackage(tempDir('pi'));
    const { lines, report } = collector();
    const spawn = spawnStub({ stdout: '{"ok":true}\n' });
    const runtime = runtimeStub({ classify });
    const outcome = await S.spawnClassifierCall(
      callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
      { spawn: spawn.spawnFn, runtime },
    );

    assert.deepEqual(lines, [SKIP.backend]);
    assert.equal(spawn.calls.length, 1);
    assert.equal(outcome.stdout, '{"ok":true}\n');
    assert.equal(runtime.calls.classify.length, 1);
  }
});

test('spawn_call_partial_map_falls_back', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub({
    classify: async () => ({
      stopReason: 'stop',
      answers: { answer: { type: 'choice', choice: 'a', probabilities: { a: 0.5 }, confidence: 0.9 } },
    }),
  });
  const outcome = await S.spawnClassifierCall(
    callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.deepEqual(lines, [SKIP.backend]);
  assert.equal(spawn.calls.length, 1);
  assert.equal(outcome.stdout, '{"ok":true}\n');
});

test('spawn_call_never_reaches_pi_for_another_type', async () => {
  const invocations = [
    ['score', '-q', 'Q', '-l', 'a', '-l', 'b'],
    ['auth', 'test', '--provider', 'official'],
  ];
  for (const args of invocations) {
    const { lines, report } = collector();
    const spawn = spawnStub();
    const runtime = runtimeStub();
    await S.spawnClassifierCall(
      callOptions({ args, report, transport: 'pi' }),
      { spawn: spawn.spawnFn, runtime },
    );

    assert.deepEqual(lines, []);
    assert.equal(spawn.calls.length, 1);
    assert.deepEqual(spawn.calls[0].args, args);
    assert.deepEqual(runtime.calls.model, []);
    assert.deepEqual(runtime.calls.available, []);
    assert.deepEqual(runtime.calls.classify, []);
  }
});

test('spawn_call_times_out_like_the_caller', async () => {
  const { lines } = collector();
  const spawn = spawnStub({ close: false });
  const outcome = await S.spawnClassifierCall(
    callOptions({ timeoutMs: 25, report: (line) => lines.push(line) }),
    { spawn: spawn.spawnFn },
  );

  assert.equal(outcome.code, null);
  assert.equal(outcome.timedOut, true);
  assert.equal(outcome.stdout, '');
  assert.equal(outcome.stderr, '');
  assert.deepEqual(spawn.killed, ['SIGKILL']);
  assert.deepEqual(lines, []);
});

test('spawn_call_spawn_error_is_127', async () => {
  const spawn = spawnStub({ error: new Error('spawn jev ENOENT') });
  const outcome = await S.spawnClassifierCall(callOptions(), { spawn: spawn.spawnFn });

  assert.equal(outcome.code, 127);
  assert.equal(outcome.stderr, 'spawn jev ENOENT');
  assert.equal(outcome.timedOut, false);
});

// ───────────────────────────────────────────────────────────────────
// 7. COMMONJS REACH
// ───────────────────────────────────────────────────────────────────

test('module_requires_from_commonjs', async () => {
  const require = createRequire(import.meta.url);
  const warnings = [];
  const onWarning = (warning) => warnings.push(warning);
  process.on('warning', onWarning);
  let required;
  try {
    required = require('../jev-transport.mjs');
    await new Promise((resolve) => setImmediate(resolve));
  } finally {
    process.off('warning', onWarning);
  }

  assert.deepEqual(warnings, []);
  assert.deepEqual(Object.keys(required).sort(), [
    'choicePayloadFor',
    'choiceRequestFrom',
    'classifierContextFor',
    'resolveTransport',
    'spawnClassifierCall',
  ]);
  for (const value of Object.values(required)) assert.equal(typeof value, 'function');
});
