// ───────────────────────────────────────────────────────────────────
// MODULE: Hermes Session Relaunch Adapter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');
const test = require('node:test');

const fixturesDir = path.join(__dirname, 'fixtures');
const contextAdapter = path.join(__dirname, '..', 'hermes', 'context-nudge.mjs');
const armAdapter = path.join(__dirname, '..', 'hermes', 'session-end-arm.mjs');
const usage = require('../lib/context-usage.cjs');
const core = require('../lib/relaunch-core.cjs');

function sandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hermes-relaunch-'));
  const env = { ...process.env, XDG_RUNTIME_DIR: path.join(root, 'runtime') };
  for (const key of [
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SESSION_RELAUNCH_THRESHOLD',
    'SESSION_RELAUNCH_WINDOW_TOKENS',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SYSTEM_SPEC_FOLDER',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, env };
}

function runAdapter(filePath, env, payload) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [filePath], {
      cwd: process.cwd(),
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(JSON.stringify(payload));
  });
}

function captured(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf8'));
}

function makePending(env, loopId, sessionId, runtime = 'hermes') {
  return core.preparePending({
    loopId,
    handoffPath: path.join(os.tmpdir(), 'handoff.md'),
    sessionId,
    runtime,
    cwd: process.cwd(),
    env,
  });
}

test('Hermes captured payload fixtures retain shapes and redact identifiers', () => {
  const fixtures = [
    'hermes-on-session-start.json',
    'hermes-on-session-end.json',
    'hermes-on-session-finalize.json',
    'hermes-pre-api-request.json',
    'hermes-post-api-request.json',
    'hermes-pre-verify.json',
    'hermes-usage.json',
  ].map(captured);
  assert.equal(fixtures[4].extra.usage.input_tokens, 2048);
  assert.equal(fixtures[4].session_id, 'session-redacted');
  assert.equal(fixtures[4].extra.base_url, 'https://api.invalid');
  assert.equal(fixtures[6].session_id, 'session-redacted');
  assert.ok(fixtures.every((entry) => !JSON.stringify(entry).includes('/Users/')));
});

test('Hermes usage counts input and cache tokens, not output tokens', () => {
  assert.equal(usage.fillFromHermesUsage(captured('hermes-usage.json')), 11587);
  assert.equal(usage.fillFromHermesUsage({ input_tokens: 5, output_tokens: 900 }), 5);
});

test('seed first turn receives the handoff instructions and carried folder', async (t) => {
  const env = sandbox(t).env;
  const folder = 'specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes';
  const payload = {
    user_message: '[session-relaunch] claim and continue handoff /tmp/handoff.md'
      + ` | Spec folder: ${folder}`
      + ' (carried from the handoff; Gate 3 answered in the sending session)',
    is_first_turn: true,
    session_id: 'session-a',
    cwd: process.cwd(),
  };
  const result = await runAdapter(contextAdapter, env, payload);
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.match(output.context, /claim/);
  assert.ok(output.context.includes(`/speckit:resume ${folder}`));
});

test('context nudge fires once at threshold and once at threshold plus five points', async (t) => {
  const env = sandbox(t).env;
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '2560';
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const payload = {
    user_message: 'continue work',
    is_first_turn: false,
    session_id: 'session-a',
    cwd: process.cwd(),
    usage: { input_tokens: 2048, output_tokens: 9000 },
  };
  const first = await runAdapter(contextAdapter, env, payload);
  assert.equal(first.code, 0, first.stderr);
  const firstOutput = JSON.parse(first.stdout);
  assert.match(firstOutput.context, /prepare --handoff.*--runtime 'hermes'/);
  assert.equal(firstOutput.windowTokens, 2560);
  assert.equal(firstOutput.windowSource, 'environment');

  const repeated = await runAdapter(contextAdapter, env, payload);
  assert.equal(repeated.code, 0, repeated.stderr);
  assert.equal(JSON.parse(repeated.stdout).context, '');

  const next = await runAdapter(contextAdapter, env, {
    ...payload,
    usage: { input_tokens: 2176 },
  });
  assert.equal(next.code, 0, next.stderr);
  assert.match(JSON.parse(next.stdout).context, /prepare --handoff.*--runtime 'hermes'/);
});

test('context nudge stays quiet while this session already has a prepared handoff', async (t) => {
  const env = sandbox(t).env;
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '2560';
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const loopId = 'hermes-loop-prepared-0001';
  env.SKILLED_LOOP_ID = loopId;
  makePending(env, loopId, 'session-a');

  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue work',
    is_first_turn: false,
    session_id: 'session-a',
    cwd: process.cwd(),
    usage: { input_tokens: 2048 },
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).context, '');
});

test('context nudge stays quiet at the hop limit', async (t) => {
  const { root, env } = sandbox(t);
  env.HOOK_FLAGS_CONFIG = path.join(root, 'hook-flags.env');
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '2560';
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  env.SKILLED_LOOP_ID = 'hermes-loop-hop-cap-0001';
  env.SKILLED_LOOP_HOPS = '1';
  env.SESSION_RELAUNCH_MAX_HOPS = '1';

  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue work',
    is_first_turn: false,
    session_id: 'session-a',
    cwd: process.cwd(),
    usage: { input_tokens: 2048 },
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).context, '');
});

test('reported and default Hermes windows identify their source', async (t) => {
  const env = sandbox(t).env;
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const reported = await runAdapter(contextAdapter, env, {
    user_message: 'continue',
    session_id: 'session-b',
    usage: { input_tokens: 800 },
    model_context_window: 1000,
  });
  assert.equal(reported.code, 0, reported.stderr);
  assert.equal(JSON.parse(reported.stdout).windowSource, 'hermes');

  const fallback = await runAdapter(contextAdapter, env, {
    user_message: 'continue',
    session_id: 'session-c',
    usage: { input_tokens: 160000 },
  });
  assert.equal(fallback.code, 0, fallback.stderr);
  assert.equal(JSON.parse(fallback.stdout).windowTokens, 200000);
  assert.equal(JSON.parse(fallback.stdout).windowSource, 'default');
});

test('the session relaunch kill switch silences the context adapter', async (t) => {
  const env = sandbox(t).env;
  env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue',
    session_id: 'session-a',
    usage: { input_tokens: 190000 },
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).context, '');
});

test('session end arms only a matching pending Hermes loop and detaches its killer', async (t) => {
  const sandboxed = sandbox(t);
  const loopId = '1234';
  sandboxed.env.SKILLED_LOOP_ID = loopId;
  makePending(sandboxed.env, loopId, 'session-a');
  const module = await import(pathToFileURL(armAdapter).href);
  const calls = [];
  const result = await module.armPendingRecord(
    { session_id: 'session-a', cwd: process.cwd() },
    {
      env: sandboxed.env,
      targetPid: 4321,
      spawn(command, args, options) {
        calls.push({ command, args, options });
        return { unref() { calls.push({ unref: true }); } };
      },
    },
  );
  assert.equal(result.status, 'armed');
  assert.equal(core.readRelaunchFile(loopId, sandboxed.env).status, 'armed');
  assert.equal(calls[0].command, process.execPath);
  assert.ok(calls[0].args[0].endsWith('/lib/killer.cjs'));
  assert.deepEqual(calls[0].args.slice(1), [
    '--loop-id', loopId, '--target-pid', '4321',
  ]);
  assert.equal(calls[0].options.detached, true);
  assert.equal(calls[0].options.stdio, 'ignore');
  assert.deepEqual(calls[1], { unref: true });
  fs.writeFileSync(
    path.join(core.stateDir(sandboxed.env), `killer-${loopId}.lock`),
    `${process.pid} ${new Date().toISOString()}\n`,
  );
  assert.equal(
    await module.armPendingRecord(
      { session_id: 'session-a' },
      { env: sandboxed.env, targetPid: 4321 },
    ),
    null,
  );
  assert.equal(calls.length, 2);
});

test('session end respawns one killer for an armed record whose killer is gone', async (t) => {
  const sandboxed = sandbox(t);
  const loopId = '4321';
  sandboxed.env.SKILLED_LOOP_ID = loopId;
  makePending(sandboxed.env, loopId, 'session-e');
  const module = await import(pathToFileURL(armAdapter).href);
  await module.armPendingRecord(
    { session_id: 'session-e' },
    { env: sandboxed.env, targetPid: 4321, spawn() { return { unref() {} }; } },
  );
  assert.equal(core.readRelaunchFile(loopId, sandboxed.env).status, 'armed');

  const calls = [];
  const respawned = await module.armPendingRecord(
    { session_id: 'session-e' },
    {
      env: sandboxed.env,
      targetPid: 4321,
      spawn(command, args, options) {
        calls.push({ command, args, options });
        return { unref() { calls.push({ unref: true }); } };
      },
    },
  );
  assert.equal(respawned.status, 'armed');
  assert.ok(calls[0].args[0].endsWith('/lib/killer.cjs'));
  assert.equal(calls.length, 2);
});

test('Hermes target lookup selects the ancestor directly below the loop process', async () => {
  const module = await import(pathToFileURL(armAdapter).href);
  const table = '41 50\n50 60\n60 100\n100 1\n';
  assert.equal(module.findHermesPid('100', { pid: 41, processTable: table }), 60);
  assert.equal(module.findHermesPid('999', { pid: 41, processTable: table }), null);
});

test('session end arms only on a matching or absent event name', async (t) => {
  const sandboxed = sandbox(t);
  const loopId = '554';
  sandboxed.env.SKILLED_LOOP_ID = loopId;
  makePending(sandboxed.env, loopId, 'session-b');
  const module = await import(pathToFileURL(armAdapter).href);
  const calls = [];
  const deps = {
    env: sandboxed.env,
    targetPid: 4321,
    spawn() { calls.push('spawn'); return { unref() {} }; },
  };

  const refused = await module.armPendingRecord(
    { session_id: 'session-b', hook_event_name: 'pre_tool_call' },
    deps,
  );
  assert.equal(refused, null);
  assert.deepEqual(calls, []);
  assert.equal(core.readRelaunchFile(loopId, sandboxed.env).status, 'pending');

  const armed = await module.armPendingRecord(
    { session_id: 'session-b', hook_event_name: 'on_session_end' },
    deps,
  );
  assert.equal(armed.status, 'armed');
  assert.deepEqual(calls, ['spawn']);
});

test('session end leaves the record armed and logs when the spawn throws', async (t) => {
  const sandboxed = sandbox(t);
  const loopId = '555';
  sandboxed.env.SKILLED_LOOP_ID = loopId;
  makePending(sandboxed.env, loopId, 'session-c');
  const module = await import(pathToFileURL(armAdapter).href);
  const result = await module.armPendingRecord(
    { session_id: 'session-c' },
    {
      env: sandboxed.env,
      targetPid: 4321,
      spawn() { throw new Error('spawn denied'); },
    },
  );
  assert.equal(result.status, 'armed');
  assert.equal(core.readRelaunchFile(loopId, sandboxed.env).status, 'armed');
  const logPath = path.join(core.stateDir(sandboxed.env), 'relaunch.log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /session-end-arm-error stage=spawn/);
});

test('session end keeps the record armed on an asynchronous spawn error', async (t) => {
  const sandboxed = sandbox(t);
  const loopId = '556';
  sandboxed.env.SKILLED_LOOP_ID = loopId;
  makePending(sandboxed.env, loopId, 'session-d');
  const module = await import(pathToFileURL(armAdapter).href);
  const child = new EventEmitter();
  child.unref = () => {};
  const result = await module.armPendingRecord(
    { session_id: 'session-d' },
    { env: sandboxed.env, targetPid: 4321, spawn: () => child },
  );
  assert.equal(result.status, 'armed');
  child.emit('error', new Error('spawn denied'));
  assert.equal(core.readRelaunchFile(loopId, sandboxed.env).status, 'armed');
  const logPath = path.join(core.stateDir(sandboxed.env), 'relaunch.log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /session-end-arm-error stage=spawn/);
});

test('context nudge plans the handoff note under the resolved repo root', async (t) => {
  const sandboxed = sandbox(t);
  const env = sandboxed.env;
  env.SESSION_RELAUNCH_REPO_ROOT = sandboxed.root;
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '2560';
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue work',
    is_first_turn: false,
    session_id: 'session-note-path-01',
    cwd: process.cwd(),
    usage: { input_tokens: 2048 },
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  const match = output.context.match(/Write the handoff note at '([^']+)'/);
  assert.ok(match);
  assert.equal(
    path.dirname(match[1]),
    path.join(
      sandboxed.root,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
  assert.match(path.basename(match[1]), /^\d{8}T\d{6}Z-session-\.md$/);
});

test('context nudge resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path', async (t) => {
  const sandboxed = sandbox(t);
  const env = sandboxed.env;
  env.SESSION_RELAUNCH_REPO_ROOT = 'relative-repo';
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '2560';
  env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue work',
    is_first_turn: false,
    session_id: 'session-note-path-02',
    cwd: process.cwd(),
    usage: { input_tokens: 2048 },
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  const match = output.context.match(/Write the handoff note at '([^']+)'/);
  assert.ok(match);
  assert.equal(path.isAbsolute(match[1]), true, match[1]);
  assert.equal(
    path.dirname(match[1]),
    path.join(
      process.cwd(),
      'relative-repo',
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
});

test('context nudge keeps the default threshold when the env switch is invalid', async (t) => {
  const sandboxed = sandbox(t);
  const env = sandboxed.env;
  env.HOOK_FLAGS_CONFIG = path.join(sandboxed.root, 'hook-flags.env');
  fs.writeFileSync(env.HOOK_FLAGS_CONFIG, 'SESSION_RELAUNCH_THRESHOLD=0.5\n');
  env.SESSION_RELAUNCH_THRESHOLD = 'bogus';
  env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const result = await runAdapter(contextAdapter, env, {
    user_message: 'continue',
    is_first_turn: false,
    session_id: 'session-threshold-pin',
    cwd: process.cwd(),
    usage: { input_tokens: 600 },
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).context, '');
});

test('a seed with a relative or untrimmed handoff path gets no context', async (t) => {
  const env = sandbox(t).env;
  for (const notePath of [
    'relative/handoff.md',
    '/tmp/trailing-space.md ',
    ' /tmp/leading-space.md',
    '/tmp/line\nbreak.md',
  ]) {
    const result = await runAdapter(contextAdapter, env, {
      user_message: '[session-relaunch] claim and continue handoff ' + notePath,
      is_first_turn: true,
      session_id: 'session-seed-invalid',
      cwd: process.cwd(),
    });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).context, '', JSON.stringify(notePath));
  }
});

test('a seed path with a literal backslash round-trips unchanged', async (t) => {
  const env = sandbox(t).env;
  const result = await runAdapter(contextAdapter, env, {
    user_message: '[session-relaunch] claim and continue handoff /tmp/we\\"ird.md',
    is_first_turn: true,
    session_id: 'session-seed-escape',
    cwd: process.cwd(),
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.ok(output.context.includes('/tmp/we\\"ird.md'), output.context);
});

test('session end ignores mismatched, non-Hermes, and disabled records', async (t) => {
  const sandboxed = sandbox(t);
  const module = await import(pathToFileURL(armAdapter).href);
  const calls = [];
  const deps = {
    env: sandboxed.env,
    targetPid: 4321,
    spawn() { calls.push('spawn'); return { unref() {} }; },
  };

  sandboxed.env.SKILLED_LOOP_ID = '111';
  makePending(sandboxed.env, '111', 'session-a');
  assert.equal(await module.armPendingRecord({ session_id: 'other' }, deps), null);
  assert.equal(core.readRelaunchFile('111', sandboxed.env).status, 'pending');

  sandboxed.env.SKILLED_LOOP_ID = '222';
  makePending(sandboxed.env, '222', 'session-a', 'claude');
  assert.equal(await module.armPendingRecord({ session_id: 'session-a' }, deps), null);

  sandboxed.env.SKILLED_LOOP_ID = '333';
  makePending(sandboxed.env, '333', 'session-a');
  sandboxed.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  assert.equal(await module.armPendingRecord({ session_id: 'session-a' }, deps), null);
  assert.deepEqual(calls, []);
});
