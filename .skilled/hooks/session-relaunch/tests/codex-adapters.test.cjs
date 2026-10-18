// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Relaunch Adapter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const CONTEXT_NUDGE_PATH = path.resolve(__dirname, '../codex/context-nudge.mjs');
const PROMPT_SEED_PATH = path.resolve(__dirname, '../codex/prompt-seed.mjs');
const STOP_ARM_PATH = path.resolve(__dirname, '../codex/stop-arm.mjs');
const USER_PROMPT_SUBMIT = require('./fixtures/codex-user-prompt-submit.json');
const STOP_PAYLOAD = require('./fixtures/codex-stop.json');
const ROLLOUT_CAPTURE = require('./fixtures/codex-rollout-token-count.json');
const SPAWN_RECORDER = path.resolve(__dirname, 'fixtures/codex-spawn-recorder.cjs');
const ROOT_PATH = path.resolve(__dirname, '../../../..');
const REGISTRY_PATH = path.join(
  ROOT_PATH,
  '.skilled',
  'skills',
  'system-spec-kit',
  'runtime',
  'cli',
  'runtime-mirrors',
  'hook-registry.json',
);
const SESSION_ID = 'codex-session-00000001';
const EXECUTABLE_FILE_MODE = 0o755;
const SEED_PROMPT = '[session-relaunch] claim and continue handoff /tmp/handoff.md'
  + ' | Spec folder: specs/hooks/001-example'
  + ' (carried from the handoff; Gate 3 answered in the sending session)';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-codex-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  const binDir = path.join(root, 'bin');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(binDir, { recursive: true });
  const psPath = path.join(binDir, 'ps');
  fs.writeFileSync(psPath, [
    '#!/usr/bin/env node',
    'process.stdout.write(`${process.ppid} ${process.env.CODEX_TEST_PARENT_PID}\\n`',
    '  + `${process.env.CODEX_TEST_PARENT_PID} ${process.env.CODEX_TEST_GRANDPARENT_PID}\\n`);',
    '',
  ].join('\n'));
  fs.chmodSync(psPath, EXECUTABLE_FILE_MODE);
  const env = {
    ...process.env,
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    REPO_ROOT: repoRoot,
    HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env'),
    PATH: `${binDir}${path.delimiter}${process.env.PATH || ''}`,
    CODEX_TEST_PARENT_PID: String(process.pid),
    CODEX_TEST_GRANDPARENT_PID: String(process.ppid),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SYSTEM_HOOKS_DISABLED',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
    'SESSION_RELAUNCH_THRESHOLD',
    'SESSION_RELAUNCH_WINDOW_TOKENS',
    'CODEX_PID',
    'CODEX_SESSION_ID',
    'CODEX_KILLER_ARGS_FILE',
    'NODE_OPTIONS',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, env };
}

function writeRollout(sandbox, inputTokens, modelContextWindow = 1000) {
  const record = clone(ROLLOUT_CAPTURE);
  const info = record.payload.info;
  info.last_token_usage.input_tokens = inputTokens;
  info.last_token_usage.cached_input_tokens = Math.floor(inputTokens / 2);
  info.total_token_usage.input_tokens = inputTokens;
  info.total_token_usage.cached_input_tokens = Math.floor(inputTokens / 2);
  info.model_context_window = modelContextWindow;
  const transcriptPath = path.join(sandbox.repoRoot, 'rollout.jsonl');
  fs.writeFileSync(transcriptPath, `${JSON.stringify(record)}\n`);
  return transcriptPath;
}

function createPendingRecord(sandbox, loopId, sessionId, status = 'pending') {
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true });
  const recordPath = path.join(stateDir, `relaunch-${loopId}.json`);
  const record = {
    version: 1,
    status,
    loopId,
    handoff: path.join(sandbox.repoRoot, 'handoff.md'),
    sessionId,
    runtime: 'codex',
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(recordPath, JSON.stringify(record));
  return { stateDir, recordPath, record };
}

function runAdapter(sandbox, adapterPath, payload) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [adapterPath], {
      cwd: sandbox.repoRoot,
      env: sandbox.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
    child.stdin.end(JSON.stringify(payload));
  });
}

test('context-nudge fires at threshold once and again at threshold plus 0.05', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeRollout(sandbox, 800);
  const payload = {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  };

  const first = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(first.code, 0, first.stderr);
  const firstOutput = JSON.parse(first.stdout.trim());
  assert.equal(firstOutput.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(firstOutput.hookSpecificOutput.additionalContext, /prepare --handoff.*--runtime 'codex'/);

  const repeated = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(repeated.code, 0, repeated.stderr);
  assert.equal(repeated.stdout, '');

  writeRollout(sandbox, 850);
  const nextLevel = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(nextLevel.code, 0, nextLevel.stderr);
  const nextOutput = JSON.parse(nextLevel.stdout.trim());
  assert.equal(nextOutput.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(nextOutput.hookSpecificOutput.additionalContext, /prepare --handoff.*--runtime 'codex'/);
});

test('Codex registrations assign each event a unique adapter', () => {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const concern = registry.hooks.find((entry) => entry.id === 'session-relaunch');
  assert.ok(concern, 'session-relaunch concern exists');
  const bindings = concern.bindings.codex;
  const scriptByEvent = Object.fromEntries(
    bindings.map(({ event, script }) => [event, script]),
  );

  assert.deepEqual(scriptByEvent, {
    UserPromptSubmit: '.skilled/hooks/session-relaunch/codex/prompt-seed.mjs',
    PostToolUse: '.skilled/hooks/session-relaunch/codex/context-nudge.mjs',
    Stop: '.skilled/hooks/session-relaunch/codex/stop-arm.mjs',
  });
  assert.equal(
    new Set(bindings.map(({ script }) => script)).size,
    bindings.length,
  );
});

test('PostToolUse adapter ignores UserPromptSubmit seed prompts', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: SEED_PROMPT,
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('UserPromptSubmit seed passes its carried folder to seedText', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runAdapter(sandbox, PROMPT_SEED_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: SEED_PROMPT,
  });

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(
    output.hookSpecificOutput.additionalContext,
    /\/speckit:resume specs\/hooks\/001-example/,
  );
});

test('UserPromptSubmit adapter nudges when a non-seed prompt crosses threshold', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeRollout(sandbox, 850);
  const result = await runAdapter(sandbox, PROMPT_SEED_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    prompt: 'Continue the current task',
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });

  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(output.hookSpecificOutput.additionalContext, /prepare --handoff.*--runtime 'codex'/);
});

test('Stop arms a matching pending record and spawns the killer with its transcript', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const transcriptPath = writeRollout(sandbox, 10);
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const spawnPath = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_PID = '999999';
  sandbox.env.CODEX_KILLER_ARGS_FILE = spawnPath;
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;
  const cwd = path.join(sandbox.root, 'live-cwd');
  fs.mkdirSync(cwd, { recursive: true });

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd,
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  const armed = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(armed.status, 'armed');
  assert.equal(armed.cwd, cwd);
  const spawned = JSON.parse(fs.readFileSync(spawnPath, 'utf8'));
  assert.equal(spawned.command, process.execPath);
  assert.ok(spawned.args[0].endsWith('killer.cjs'));
  assert.equal(spawned.args[spawned.args.indexOf('--loop-id') + 1], loopId);
  assert.equal(spawned.args[spawned.args.indexOf('--target-pid') + 1], String(process.pid));
  assert.equal(spawned.args[spawned.args.indexOf('--transcript') + 1], transcriptPath);
  assert.equal(spawned.options.detached, true);
});

test('Stop leaves a pending record untouched when the session does not match', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(
    sandbox,
    loopId,
    'another-session',
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_KILLER_ARGS_FILE = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(sandbox.env.CODEX_KILLER_ARGS_FILE), false);
});

test('Stop leaves a record for another loop untouched', async (t) => {
  const sandbox = createSandbox(t);
  const recordedLoopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(sandbox, recordedLoopId, SESSION_ID);
  sandbox.env.SKILLED_LOOP_ID = String(Number(recordedLoopId) + 1);
  sandbox.env.CODEX_KILLER_ARGS_FILE = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(sandbox.env.CODEX_KILLER_ARGS_FILE), false);
});

test('Stop ignores a record that is already armed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(
    sandbox,
    loopId,
    SESSION_ID,
    'armed',
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_KILLER_ARGS_FILE = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(sandbox.env.CODEX_KILLER_ARGS_FILE), false);
});

test('the kill switch silences Codex prompt and stop adapters', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeRollout(sandbox, 950);
  const nudge = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(nudge.code, 0, nudge.stderr);
  assert.equal(nudge.stdout, '');

  const seed = await runAdapter(sandbox, PROMPT_SEED_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    prompt: SEED_PROMPT,
    cwd: sandbox.repoRoot,
  });
  assert.equal(seed.code, 0, seed.stderr);
  assert.equal(seed.stdout, '');

  const loopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const spawnPath = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_KILLER_ARGS_FILE = spawnPath;
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;
  const stop = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
  });
  assert.equal(stop.code, 0, stop.stderr);
  assert.equal(stop.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(spawnPath), false);
});

test('Stop leaves the record pending when no ancestor matches the loop', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = '999999999';
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const spawnPath = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_KILLER_ARGS_FILE = spawnPath;
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(spawnPath), false);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /stop-arm-error stage=target-pid/);
});

test('Stop target lookup selects the ancestor directly below the loop', async () => {
  const module = await import(pathToFileURL(STOP_ARM_PATH).href);
  // Hook pid 41 sits below a transient bash 50, codex 60, then the loop 100.
  const table = '41 50\n50 60\n60 100\n100 1\n';
  assert.equal(module.findCodexPid('100', { pid: 41, processTable: table }), 60);
  assert.equal(module.findCodexPid('999', { pid: 41, processTable: table }), null);
});

test('Stop arms only a payload that names the Stop event', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const spawnPath = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_KILLER_ARGS_FILE = spawnPath;
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  for (const hookEventName of ['SessionEnd', undefined]) {
    const result = await runAdapter(sandbox, STOP_ARM_PATH, {
      ...STOP_PAYLOAD,
      hook_event_name: hookEventName,
      session_id: SESSION_ID,
      transcript_path: writeRollout(sandbox, 10),
    });
    assert.equal(result.code, 0, result.stderr);
    assert.equal(result.stdout, '');
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(fs.existsSync(spawnPath), false);
});

test('Stop leaves the record armed and logs when the killer spawn fails', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const fixturePath = path.join(sandbox.root, 'spawn-fail.cjs');
  fs.writeFileSync(fixturePath, [
    "'use strict';",
    "const childProcess = require('node:child_process');",
    "const { syncBuiltinESMExports } = require('node:module');",
    'const originalSpawn = childProcess.spawn;',
    'childProcess.spawn = function (command, args = []) {',
    "  if (typeof args[0] === 'string' && args[0].endsWith('killer.cjs')) {",
    "    throw new Error('spawn denied');",
    '  }',
    '  return originalSpawn.call(this, command, args);',
    '};',
    'syncBuiltinESMExports();',
    '',
  ].join('\n'));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.NODE_OPTIONS = `--require=${fixturePath}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'armed');
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /stop-arm-error stage=spawn/);
});

test('Stop logs an async killer spawn error and leaves the record armed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const fixturePath = path.join(sandbox.root, 'spawn-async-error.cjs');
  fs.writeFileSync(fixturePath, [
    "'use strict';",
    "const { EventEmitter } = require('node:events');",
    "const childProcess = require('node:child_process');",
    "const { syncBuiltinESMExports } = require('node:module');",
    'const originalSpawn = childProcess.spawn;',
    'childProcess.spawn = function (command, args = []) {',
    "  if (typeof args[0] === 'string' && args[0].endsWith('killer.cjs')) {",
    '    const child = new EventEmitter();',
    '    child.unref = () => child;',
    "    setImmediate(() => child.emit('error', new Error('spawn denied')));",
    '    return child;',
    '  }',
    '  return originalSpawn.call(this, command, args);',
    '};',
    'syncBuiltinESMExports();',
    '',
  ].join('\n'));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.NODE_OPTIONS = `--require=${fixturePath}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'armed');
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  const spawnErrors = fs.readFileSync(logPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('stop-arm-error stage=spawn'));
  assert.equal(spawnErrors.length, 1);
  assert.match(spawnErrors[0], /message=spawn_denied/);
});
