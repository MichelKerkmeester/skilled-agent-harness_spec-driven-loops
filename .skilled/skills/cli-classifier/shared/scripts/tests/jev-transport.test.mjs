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

const CHOICE_ARGS = ['choice', '--provider', 'openrouter', '-q', 'Which option?', '-o', 'a=First', '-o', 'b=Second'];
const CHOICE_ARGS_WITHOUT_PROVIDER = ['choice', '-q', 'Which option?', '-o', 'a=First', '-o', 'b=Second'];
const OFFICIAL_CHOICE_ARGS = ['choice', '--provider', 'official', '-q', 'Which option?', '-o', 'a=First', '-o', 'b=Second'];
const STATE_TEXT = 'the state text';
const CLASSIFIER_MODEL = { id: 'typesafe/jev-1.13' };
const OFFICIAL_CLASSIFIER_MODEL = { id: 'jev-latest' };
const SKIP = {
  package: 'skip: pi transport unavailable (package), using jev CLI',
  version: 'skip: pi transport unavailable (version), using jev CLI',
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
function stubPiPackage(root, version = '0.99.2') {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'pi'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: '@earendil-works/pi-coding-agent', version }),
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

function successfulChoiceResult() {
  return {
    stopReason: 'stop',
    answers: { answer: { type: 'choice', choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
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

test('resolve_transport_environment_kill_switch_overrides_pi_option', () => {
  assert.deepEqual(S.resolveTransport('pi', { JEV_TRANSPORT: 'jev' }), { transport: 'jev', line: null });
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
    { provider: 'official', question: 'Q', keys: ['a', 'b'], criteria: { a: 'A', b: 'B' } },
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

test('spawn_call_official_provider_maps_to_typesafe_jev_latest', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub();
  const runtime = runtimeStub({
    known: [OFFICIAL_CLASSIFIER_MODEL],
    classify: async () => successfulChoiceResult(),
  });
  const outcome = await S.spawnClassifierCall(
    callOptions({
      args: OFFICIAL_CHOICE_ARGS,
      env: { PATH: bin, JEV_PROVIDER: 'openrouter' },
      report,
      transport: 'pi',
    }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(spawn.calls.length, 0);
  assert.deepEqual(runtime.calls.model, [
    { type: 'classifier', providerId: 'typesafe', modelId: 'jev-latest' },
  ]);
  assert.deepEqual(runtime.calls.available, [{ type: 'classifier', providerId: 'typesafe' }]);
  assert.deepEqual(runtime.calls.classify[0].model, {
    type: 'classifier',
    provider: 'typesafe',
    id: 'jev-latest',
  });
  assert.equal(JSON.parse(outcome.stdout).model, 'jev-latest');
  assert.deepEqual(lines, []);
});

test('spawn_call_omitted_provider_defaults_to_official_pi', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub({
    known: [OFFICIAL_CLASSIFIER_MODEL],
    classify: async () => successfulChoiceResult(),
  });

  const outcome = await S.spawnClassifierCall(
    callOptions({
      args: CHOICE_ARGS_WITHOUT_PROVIDER,
      env: { PATH: bin },
      report,
      transport: 'pi',
    }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(spawn.calls.length, 0);
  assert.deepEqual(runtime.calls.model, [
    { type: 'classifier', providerId: 'typesafe', modelId: 'jev-latest' },
  ]);
  assert.equal(JSON.parse(outcome.stdout).model, 'jev-latest');
  assert.deepEqual(lines, []);
});

test('spawn_call_omitted_provider_uses_openrouter_environment_for_pi', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const { lines, report } = collector();
  const spawn = spawnStub();
  const runtime = runtimeStub({
    classify: async () => ({
      stopReason: 'stop',
      answers: { answer: { type: 'choice', choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
    }),
  });

  await S.spawnClassifierCall(
    callOptions({
      args: CHOICE_ARGS_WITHOUT_PROVIDER,
      env: { PATH: bin, JEV_PROVIDER: 'openrouter' },
      report,
      transport: 'pi',
    }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(spawn.calls.length, 0);
  assert.deepEqual(runtime.calls.model, [
    { type: 'classifier', providerId: 'openrouter', modelId: 'typesafe/jev-1.13' },
  ]);
  assert.deepEqual(runtime.calls.available, [{ type: 'classifier', providerId: 'openrouter' }]);
  assert.equal(runtime.calls.classify.length, 1);
  assert.equal(runtime.calls.classify[0].model.provider, 'openrouter');
  assert.equal(runtime.calls.classify[0].model.id, 'typesafe/jev-1.13');
  assert.deepEqual(lines, []);
});

test('spawn_call_vercel_and_custom_providers_stay_on_the_cli', async () => {
  for (const provider of ['vercel', 'custom']) {
    const bin = stubPiPackage(tempDir('pi'));
    const { lines, report } = collector();
    const spawn = spawnStub({ stdout: '{"ok":true}\n' });
    const runtime = runtimeStub();
    const args = provider === 'custom'
      ? ['choice', '--provider', provider, ...CHOICE_ARGS_WITHOUT_PROVIDER.slice(1)]
      : CHOICE_ARGS_WITHOUT_PROVIDER;
    const env = provider === 'custom'
      ? { PATH: bin, JEV_PROVIDER: 'official' }
      : { PATH: bin, JEV_PROVIDER: provider };

    await S.spawnClassifierCall(
      callOptions({ args, env, report, transport: 'pi' }),
      { spawn: spawn.spawnFn, runtime },
    );

    assert.equal(spawn.calls.length, 1, provider);
    assert.deepEqual(spawn.calls[0].args, args, provider);
    assert.deepEqual(runtime.calls.model, [], provider);
    assert.deepEqual(runtime.calls.available, [], provider);
    assert.deepEqual(runtime.calls.classify, [], provider);
    assert.deepEqual(lines, [], provider);
  }
});

test('spawn_call_environment_kill_switch_forces_cli_over_pi_option', async () => {
  const env = { PATH: '/nonexistent', JEV_TRANSPORT: 'jev' };
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub();
  const outcome = await S.spawnClassifierCall(
    callOptions({ env, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(outcome.stdout, '{"ok":true}\n');
  assert.equal(spawn.calls.length, 1);
  assert.deepEqual(runtime.calls.model, []);
  assert.deepEqual(lines, []);
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

test('spawn_call_builds_and_preflights_one_runtime_for_three_pi_calls', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  let builds = 0;
  let runtime;
  const createRuntime = () => {
    builds += 1;
    runtime = runtimeStub({
      classify: async () => ({
        stopReason: 'stop',
        answers: { answer: { choice: 'b', probabilities: { a: 0.25, b: 0.7 }, confidence: 0.9 } },
      }),
    });
    return runtime;
  };
  const spawn = spawnStub();
  const { lines, report } = collector();

  for (let index = 0; index < 3; index += 1) {
    await S.spawnClassifierCall(
      callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
      { spawn: spawn.spawnFn, createRuntime },
    );
  }

  assert.equal(builds, 1);
  assert.equal(runtime.calls.model.length, 1);
  assert.equal(runtime.calls.available.length, 1);
  assert.equal(runtime.calls.classify.length, 3);
  assert.equal(spawn.calls.length, 0);
  assert.deepEqual(lines, []);
});

test('spawn_call_preflight_cache_is_scoped_to_path_and_provider', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  let builds = 0;
  let runtime;
  const createRuntime = () => {
    builds += 1;
    runtime = runtimeStub({
      known: [CLASSIFIER_MODEL, OFFICIAL_CLASSIFIER_MODEL],
      classify: async () => successfulChoiceResult(),
    });
    return runtime;
  };
  const spawn = spawnStub();
  const { lines, report } = collector();

  for (const provider of ['official', 'openrouter', 'official']) {
    await S.spawnClassifierCall(
      callOptions({
        args: CHOICE_ARGS_WITHOUT_PROVIDER,
        env: { PATH: bin, JEV_PROVIDER: provider },
        report,
        transport: 'pi',
      }),
      { spawn: spawn.spawnFn, createRuntime },
    );
  }

  assert.equal(builds, 1);
  assert.deepEqual(runtime.calls.model, [
    { type: 'classifier', providerId: 'typesafe', modelId: 'jev-latest' },
    { type: 'classifier', providerId: 'openrouter', modelId: 'typesafe/jev-1.13' },
  ]);
  assert.deepEqual(runtime.calls.available, [
    { type: 'classifier', providerId: 'typesafe' },
    { type: 'classifier', providerId: 'openrouter' },
  ]);
  assert.deepEqual(runtime.calls.classify.map(({ model }) => model.provider), [
    'typesafe',
    'openrouter',
    'typesafe',
  ]);
  assert.equal(spawn.calls.length, 0);
  assert.deepEqual(lines, []);
});

test('spawn_call_preflight_failure_is_checked_and_reported_once', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  let builds = 0;
  let runtime;
  const createRuntime = () => {
    builds += 1;
    runtime = runtimeStub({ available: [] });
    return runtime;
  };
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const { lines, report } = collector();

  for (let index = 0; index < 3; index += 1) {
    await S.spawnClassifierCall(
      callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
      { spawn: spawn.spawnFn, createRuntime },
    );
  }

  assert.equal(builds, 1);
  assert.equal(runtime.calls.model.length, 1);
  assert.equal(runtime.calls.available.length, 1);
  assert.equal(spawn.calls.length, 3);
  assert.deepEqual(lines, [SKIP.credential]);
});

test('spawn_call_skips_an_unpinned_pi_package_version', async () => {
  const bin = stubPiPackage(tempDir('pi'), '0.99.1');
  const { lines, report } = collector();
  const spawn = spawnStub({ stdout: '{"ok":true}\n' });
  const runtime = runtimeStub();

  await S.spawnClassifierCall(
    callOptions({ env: { PATH: bin }, report, transport: 'pi' }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.deepEqual(lines, [SKIP.version]);
  assert.equal(spawn.calls.length, 1);
  assert.deepEqual(runtime.calls.model, []);
});

test('spawn_call_pi_and_cli_fallback_share_one_timeout_budget', async () => {
  const bin = stubPiPackage(tempDir('pi'));
  const runtime = runtimeStub({
    classify: () => new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('backend refused')), 75);
    }),
  });
  const spawn = spawnStub({ close: false });
  const start = Date.now();
  const outcome = await S.spawnClassifierCall(
    callOptions({ env: { PATH: bin }, timeoutMs: 150, transport: 'pi', report: () => {} }),
    { spawn: spawn.spawnFn, runtime },
  );

  assert.equal(outcome.timedOut, true);
  assert.equal(spawn.calls.length, 1);
  assert.ok(Date.now() - start < 195, `combined attempt took ${Date.now() - start}ms`);
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
