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
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
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
    'SESSION_RELAUNCH_MAX_HOPS',
    'CODEX_PID',
    'CODEX_SESSION_ID',
    'CODEX_KILLER_ARGS_FILE',
    'NODE_OPTIONS',
    'SYSTEM_SPEC_FOLDER',
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

test('context-nudge carries the payload spec_folder into the note frontmatter', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeRollout(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    spec_folder: 'specs/hooks/001-session-relaunch',
  });
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext;
  assert.match(context, /^ +spec_folder: specs\/hooks\/001-session-relaunch$/m);
});

test('context-nudge emits nothing while this session already has a prepared handoff', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const loopId = 'codex-loop-prepared-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createPendingRecord(sandbox, loopId, SESSION_ID);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 900),
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('context-nudge emits nothing at the hop limit', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SKILLED_LOOP_ID = 'codex-loop-hop-cap-0001';
  sandbox.env.SKILLED_LOOP_HOPS = '1';
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '1';
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 900),
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
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

test('Stop ignores an armed record whose killer lock owner is alive', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const { recordPath, record } = createPendingRecord(
    sandbox,
    loopId,
    SESSION_ID,
    'armed',
  );
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.writeFileSync(
    path.join(stateDir, `killer-${loopId}.lock`),
    `${process.pid} ${new Date().toISOString()}\n`,
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

test('Stop respawns one killer for an armed record whose killer is gone', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.ppid);
  const transcriptPath = writeRollout(sandbox, 10);
  const { recordPath } = createPendingRecord(
    sandbox,
    loopId,
    SESSION_ID,
    'armed',
  );
  const spawnPath = path.join(sandbox.root, 'killer-args.json');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CODEX_PID = '999999';
  sandbox.env.CODEX_KILLER_ARGS_FILE = spawnPath;
  sandbox.env.NODE_OPTIONS = `--require=${SPAWN_RECORDER}`;

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
  });

  assert.equal(result.code, 0, result.stderr);
  assert.equal(fs.existsSync(spawnPath), true);
  const spawned = JSON.parse(fs.readFileSync(spawnPath, 'utf8'));
  assert.equal(spawned.args[spawned.args.indexOf('--loop-id') + 1], loopId);
  const armed = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(armed.status, 'armed');
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

test('Stop signals the loop child it finds above a transient shell, and arms nothing without one', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = '100';
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID);
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const { armPendingRecord } = await import(pathToFileURL(STOP_ARM_PATH).href);
  const spawns = [];
  const spawnKiller = (command, args, options) => {
    spawns.push({ command, args, options });
    return { unref() {} };
  };
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeRollout(sandbox, 10),
  };

  // Hook pid 41 sits below a transient bash 50, codex 60, then the loop 100.
  const armed = await armPendingRecord(payload, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 50\n50 60\n60 100\n100 1\n',
    spawn: spawnKiller,
  });
  assert.equal(armed.status, 'armed');
  assert.equal(spawns.length, 1);
  assert.equal(spawns[0].args[spawns[0].args.indexOf('--target-pid') + 1], '60');

  const { record } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const unmatched = await armPendingRecord(payload, {
    env: sandbox.env,
    pid: 41,
    processTable: '41 50\n50 1\n',
    spawn: spawnKiller,
  });
  assert.equal(unmatched, null);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.equal(spawns.length, 1);
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

test('context-nudge plans the handoff note under the resolved repo root', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeRollout(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  const match = output.hookSpecificOutput.additionalContext
    .match(/Write the handoff note at '([^']+)'/);
  assert.ok(match);
  assert.equal(
    path.dirname(match[1]),
    path.join(
      sandbox.repoRoot,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
  assert.match(path.basename(match[1]), /^\d{8}T\d{6}Z-codex-se\.md$/);
});

test('context-nudge resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_REPO_ROOT = 'relative-repo';
  const transcriptPath = writeRollout(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  const match = output.hookSpecificOutput.additionalContext
    .match(/Write the handoff note at '([^']+)'/);
  assert.ok(match);
  assert.equal(path.isAbsolute(match[1]), true, match[1]);
  assert.equal(
    path.dirname(match[1]),
    path.join(
      fs.realpathSync(sandbox.repoRoot),
      'relative-repo',
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
});

test('context-nudge keeps the default threshold when the env switch is invalid', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = 'bogus';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  fs.writeFileSync(sandbox.env.HOOK_FLAGS_CONFIG, 'SESSION_RELAUNCH_THRESHOLD=0.5\n');
  const transcriptPath = writeRollout(sandbox, 600);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    hook_event_name: 'PostToolUse',
    prompt: undefined,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('UserPromptSubmit seed claims the absolute note path it carries', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runAdapter(sandbox, PROMPT_SEED_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff /real/handoff.md',
  });
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext;
  assert.ok(context.includes("claim '/real/handoff.md'"), context);
  assert.ok(!context.includes("claim '<handoff-path>'"), context);
});

test('UserPromptSubmit seed with a relative note path emits nothing', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runAdapter(sandbox, PROMPT_SEED_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff relative/handoff.md',
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});
