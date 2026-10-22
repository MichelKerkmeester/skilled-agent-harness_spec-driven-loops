// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Relaunch Adapter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CONTEXT_NUDGE_PATH = path.resolve(__dirname, '../claude/context-nudge.mjs');
const STOP_ARM_PATH = path.resolve(__dirname, '../claude/stop-arm.mjs');
const POST_TOOL_USE = require('./fixtures/payload-post-tool-use.json');
const USER_PROMPT_SUBMIT = require('./fixtures/payload-user-prompt-submit.json');
const STOP_PAYLOAD = require('./fixtures/payload-stop.json');
const { runNested } = require('./fixtures/nested-run.cjs');
const SESSION_ID = 'session-adapter-00000001';

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-adapter-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  const env = {
    ...process.env,
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
    HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env'),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_NAME',
    'CLAUDE_PID',
    'CLAUDE_CODE_SESSION_ID',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SESSION_RELAUNCH_THRESHOLD',
    'SESSION_RELAUNCH_WINDOW_TOKENS',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SYSTEM_SPEC_FOLDER',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, env };
}

function writeTranscript(sandbox, fillTokens) {
  const transcriptPath = path.join(sandbox.repoRoot, 'transcript.jsonl');
  const entry = {
    type: 'assistant',
    isSidechain: false,
    message: {
      model: 'claude-haiku-5-5',
      usage: {
        input_tokens: fillTokens,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
      },
    },
  };
  fs.writeFileSync(transcriptPath, `${JSON.stringify(entry)}\n`);
  return transcriptPath;
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

function createPendingRecord(sandbox, loopId, sessionId, handoffPath, status = 'pending') {
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true });
  const recordPath = path.join(stateDir, `relaunch-${loopId}.json`);
  const record = {
    version: 1,
    status,
    loopId: String(loopId),
    handoff: handoffPath,
    sessionId,
    runtime: 'claude',
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(recordPath, JSON.stringify(record));
  return { stateDir, recordPath, record };
}

function startTarget(sandbox) {
  return spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    stdio: 'ignore',
  });
}

function killChild(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  try {
    child.kill('SIGKILL');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

async function waitFor(predicate, timeoutMs = 1500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return predicate();
}

test('context-nudge fires at 0.80, suppresses the same level, and fires again at +0.05', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const payload = {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  };
  const first = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(first.code, 0, first.stderr);
  const firstOutput = JSON.parse(first.stdout.trim());
  assert.equal(firstOutput.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(
    firstOutput.hookSpecificOutput.additionalContext,
    /prepare --handoff.*--runtime 'claude'/,
  );
  assert.ok(firstOutput.hookSpecificOutput.additionalContext.includes(`--session '${SESSION_ID}'`));
  const repeated = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(repeated.code, 0, repeated.stderr);
  assert.equal(repeated.stdout, '');
  writeTranscript(sandbox, 850);
  const nextLevel = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(nextLevel.code, 0, nextLevel.stderr);
  const nextOutput = JSON.parse(nextLevel.stdout.trim());
  assert.equal(nextOutput.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(
    nextOutput.hookSpecificOutput.additionalContext,
    /prepare --handoff.*--runtime 'claude'/,
  );
});

test('a nested run gets the outside-the-loop nudge', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = String(process.pid);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const payload = {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  };
  const result = await runNested({
    argv: [CONTEXT_NUDGE_PATH],
    env: sandbox.env,
    cwd: sandbox.repoRoot,
    input: JSON.stringify(payload),
  });
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext;
  assert.ok(context.includes('cannot relaunch'), context);
  assert.doesNotMatch(context, /prepare --handoff/);
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  assert.match(fs.readFileSync(logPath, 'utf8'), /loop-nested-run/);
});

test('the loop runtime itself still gets the in-loop nudge', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = String(process.pid);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.match(
    JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext,
    /prepare --handoff.*--runtime 'claude'/,
  );
});

test('context-nudge stays silent for a sub-agent tool call', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    agent_id: 'a78dbc9773274be92',
    agent_type: 'fork',
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  assert.equal(fs.existsSync(stateFile), false, stateFile);
});

test('context-nudge still nudges the main session when agent_id is empty', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    agent_id: '',
    agent_type: 'fork',
  });
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  assert.equal(output.hookSpecificOutput.hookEventName, 'PostToolUse');
  assert.match(
    output.hookSpecificOutput.additionalContext,
    /prepare --handoff.*--runtime 'claude'/,
  );
  assert.ok(output.hookSpecificOutput.additionalContext.includes(`--session '${SESSION_ID}'`));
});

test('context-nudge carries the payload spec_folder into the note frontmatter', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    spec_folder: 'specs/hooks/001-session-relaunch',
  });
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext;
  assert.match(context, /^ +spec_folder: specs\/hooks\/001-session-relaunch$/m);
});

test('context-nudge emits nothing below the configured threshold', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 799);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('context-nudge emits nothing while this session already has a prepared handoff', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const loopId = 'claude-loop-prepared-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createPendingRecord(sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'));
  const transcriptPath = writeTranscript(sandbox, 900);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('context-nudge emits nothing at the hop limit', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.HOOK_FLAGS_CONFIG = path.join(sandbox.home, 'hook-flags.env');
  sandbox.env.SKILLED_LOOP_ID = 'claude-loop-hop-cap-0001';
  sandbox.env.SKILLED_LOOP_HOPS = '1';
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '1';
  const transcriptPath = writeTranscript(sandbox, 900);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('context-nudge emits nothing when the relaunch concern is disabled', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  const transcriptPath = writeTranscript(sandbox, 950);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('context-nudge emits nothing when session_id fails the charset gate', async (t) => {
  const sandbox = createSandbox(t);
  const badSessionId = 'session; echo injected';
  const seedPayload = {
    ...USER_PROMPT_SUBMIT,
    session_id: badSessionId,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff /real/handoff.md',
  };
  const seed = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, seedPayload);
  assert.equal(seed.code, 0, seed.stderr);
  assert.equal(seed.stdout, '');

  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  const transcriptPath = writeTranscript(sandbox, 950);
  const nudgePayload = {
    ...POST_TOOL_USE,
    session_id: badSessionId,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  };
  const nudge = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, nudgePayload);
  assert.equal(nudge.code, 0, nudge.stderr);
  assert.equal(nudge.stdout, '');
});

test('UserPromptSubmit relaunch seed receives claim and completion instructions', async (t) => {
  const sandbox = createSandbox(t);
  const payload = {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff /real/handoff.md',
  };
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(output.hookSpecificOutput.additionalContext, /claim/);
  assert.match(output.hookSpecificOutput.additionalContext, /complete/);
});

test('UserPromptSubmit seed resumes its carried packet folder', async (t) => {
  const sandbox = createSandbox(t);
  const specFolder = 'specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop';
  const prompt = '[session-relaunch] claim and continue handoff /real/handoff.md | Spec folder: ' + specFolder
    + ' (carried from the handoff; Gate 3 answered in the sending session)';
  const payload = {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt,
  };

  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  assert.ok(
    output.hookSpecificOutput.additionalContext.includes(`/speckit:resume ${specFolder}`),
    output.hookSpecificOutput.additionalContext,
  );
});

test('UserPromptSubmit seed carries Gate 3 Skip without a resume command', async (t) => {
  const sandbox = createSandbox(t);
  const prompt = '[session-relaunch] claim and continue handoff /real/handoff.md | Spec folder: none '
    + '(Gate 3 answered D, Skip, in the sending session)';
  const payload = {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt,
  };

  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  const context = output.hookSpecificOutput.additionalContext;
  assert.match(context, /Gate 3 is already answered Skip for this session/);
  assert.doesNotMatch(context, /\/speckit:resume/);
});

test('UserPromptSubmit seed without a suffix has no resume or Skip instruction', async (t) => {
  const sandbox = createSandbox(t);
  const payload = {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff /real/handoff.md',
  };

  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  const context = output.hookSpecificOutput.additionalContext;
  assert.doesNotMatch(context, /\/speckit:resume/);
  assert.doesNotMatch(context, /Gate 3 is already answered Skip/);
});

test('stop-arm arms a matching pending record, starts the killer lock, and prints nothing', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { stateDir, recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath);
  const transcriptPath = writeTranscript(sandbox, 10);
  const target = startTarget(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CLAUDE_PID = String(target.pid);
  const liveCwd = path.join(sandbox.root, 'live-cwd');
  fs.mkdirSync(liveCwd, { recursive: true });
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: liveCwd,
    background_tasks: [],
  };
  try {
    const result = await runAdapter(sandbox, STOP_ARM_PATH, payload);
    assert.equal(result.code, 0, result.stderr);
    assert.equal(result.stdout, '');
    const armed = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
    assert.equal(armed.status, 'armed');
    assert.equal(armed.cwd, liveCwd);
    assert.equal(
      await waitFor(() => fs.existsSync(path.join(stateDir, `killer-${loopId}.lock`))),
      true,
    );
  } finally {
    killChild(target);
    await waitFor(() => !fs.existsSync(path.join(stateDir, `killer-${loopId}.lock`)), 2500);
  }
});

test('stop-arm leaves a pending record alone when the relaunch concern is disabled', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { stateDir, recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath);
  const transcriptPath = writeTranscript(sandbox, 10);
  const target = startTarget(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.CLAUDE_PID = String(target.pid);
  sandbox.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  const liveCwd = path.join(sandbox.root, 'live-cwd');
  fs.mkdirSync(liveCwd, { recursive: true });
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: liveCwd,
    background_tasks: [],
  };
  try {
    const result = await runAdapter(sandbox, STOP_ARM_PATH, payload);
    assert.equal(result.code, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'pending');
    assert.equal(fs.existsSync(path.join(stateDir, `killer-${loopId}.lock`)), false);
  } finally {
    killChild(target);
  }
});

test("stop-arm leaves a nested run's pending record untouched", async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { stateDir, recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath);
  const transcriptPath = writeTranscript(sandbox, 10);
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    background_tasks: [],
  };
  const result = await runNested({
    argv: [STOP_ARM_PATH],
    env: sandbox.env,
    cwd: sandbox.repoRoot,
    input: JSON.stringify(payload),
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'pending');
  assert.equal(fs.existsSync(path.join(stateDir, `killer-${loopId}.lock`)), false);
});

test('stop-arm defers pending state when background tasks exist and logs the reason', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { stateDir, recordPath, record } = createPendingRecord(
    sandbox, loopId, SESSION_ID, handoffPath,
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    background_tasks: [{ task_id: 'task-1' }],
  };
  const result = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.match(
    fs.readFileSync(path.join(stateDir, 'relaunch.log'), 'utf8'),
    /deferred-background-tasks/,
  );
});

test('stop-arm logs missing-transcript-path and leaves the record pending', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { stateDir, recordPath, record } = createPendingRecord(
    sandbox, loopId, SESSION_ID, handoffPath,
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    background_tasks: [],
  };
  delete payload.transcript_path;
  const result = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  const log = fs.readFileSync(path.join(stateDir, 'relaunch.log'), 'utf8');
  assert.match(log, /missing-transcript-path/);
});

test('stop-arm logs an async killer spawn error and leaves the record armed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
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
    transcript_path: writeTranscript(sandbox, 10),
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

test('stop-arm logs a synchronous killer spawn throw and leaves the record armed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID);
  const fixturePath = path.join(sandbox.root, 'spawn-sync-throw.cjs');
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
    transcript_path: writeTranscript(sandbox, 10),
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
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
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
  assert.match(path.basename(match[1]), /^\d{8}T\d{6}Z-session-adapter-00000001\.md$/);
});

test('context-nudge resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SESSION_RELAUNCH_REPO_ROOT = 'relative-repo';
  const transcriptPath = writeTranscript(sandbox, 800);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
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
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = 'bogus';
  sandbox.env.HOOK_FLAGS_CONFIG = path.join(sandbox.root, 'hook-flags.env');
  fs.writeFileSync(sandbox.env.HOOK_FLAGS_CONFIG, 'SESSION_RELAUNCH_THRESHOLD=0.5\n');
  const transcriptPath = writeTranscript(sandbox, 600);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('UserPromptSubmit seed claims the absolute note path it carries', async (t) => {
  const sandbox = createSandbox(t);
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
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
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...USER_PROMPT_SUBMIT,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    prompt: '[session-relaunch] claim and continue handoff relative/handoff.md',
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('stop-arm makes no change without SKILLED_LOOP_ID and prints nothing', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'loop-without-environment';
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  const { recordPath } = createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath);
  const before = fs.readFileSync(recordPath, 'utf8');
  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    cwd: sandbox.repoRoot,
    background_tasks: [],
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(fs.readFileSync(recordPath, 'utf8'), before);
});

test('stop-arm spawns exactly one killer across repeated Stop payloads on a pending record', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath);
  const transcriptPath = writeTranscript(sandbox, 10);
  const spawnLog = installKillerSpawnRecorder(sandbox, '{ command, args, options }');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    background_tasks: [],
  };

  const first = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(first.code, 0, first.stderr);
  const lockPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `killer-${loopId}.lock`);
  fs.writeFileSync(lockPath, `${process.pid} ${new Date().toISOString()}\n`);
  const second = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(second.code, 0, second.stderr);

  const spawns = fs.readFileSync(spawnLog, 'utf8').trim().split('\n');
  assert.equal(spawns.length, 1);
});

test('stop-arm respawns one killer for an armed record whose killer is gone', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  fs.writeFileSync(handoffPath, 'handoff');
  createPendingRecord(sandbox, loopId, SESSION_ID, handoffPath, 'armed');
  const transcriptPath = writeTranscript(sandbox, 10);
  const spawnLog = installKillerSpawnRecorder(sandbox, '{ command, args, options }');
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: transcriptPath,
    cwd: sandbox.repoRoot,
    background_tasks: [],
  };

  const respawn = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(respawn.code, 0, respawn.stderr);
  const spawns = fs.readFileSync(spawnLog, 'utf8').trim().split('\n');
  assert.equal(spawns.length, 1);

  const lockPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `killer-${loopId}.lock`);
  fs.writeFileSync(lockPath, `${process.pid} ${new Date().toISOString()}\n`);
  const suppressed = await runAdapter(sandbox, STOP_ARM_PATH, payload);
  assert.equal(suppressed.code, 0, suppressed.stderr);
  assert.equal(fs.readFileSync(spawnLog, 'utf8').trim().split('\n').length, 1);
});

function installKillerSpawnRecorder(sandbox, recordExpression) {
  const recorderPath = path.join(sandbox.root, 'killer-spawn-recorder.cjs');
  const spawnLog = path.join(sandbox.root, 'killer-spawns.jsonl');
  fs.writeFileSync(recorderPath, [
    "'use strict';",
    "const fs = require('node:fs');",
    "const childProcess = require('node:child_process');",
    "const { syncBuiltinESMExports } = require('node:module');",
    'const originalSpawn = childProcess.spawn;',
    'childProcess.spawn = function (command, args = [], options = {}) {',
    "  if (typeof args[0] === 'string' && args[0].endsWith('killer.cjs')) {",
    '    fs.appendFileSync(',
    '      process.env.CLAUDE_KILLER_ARGS_FILE,',
    '      JSON.stringify(' + recordExpression + ') + "\\n",',
    '    );',
    '    return { unref() { return this; } };',
    '  }',
    '  return originalSpawn.call(this, command, args, options);',
    '};',
    'syncBuiltinESMExports();',
    '',
  ].join('\n'));
  sandbox.env.CLAUDE_KILLER_ARGS_FILE = spawnLog;
  sandbox.env.NODE_OPTIONS = `--require=${recorderPath}`;
  return spawnLog;
}

function installKillerRecorder(sandbox) {
  const spawnLog = installKillerSpawnRecorder(
    sandbox,
    '{ args, hookPid: process.pid, hookParent: process.ppid }',
  );
  return () => (fs.existsSync(spawnLog)
    ? fs.readFileSync(spawnLog, 'utf8').trim().split('\n').map((line) => JSON.parse(line))
    : []);
}

function targetPidOf(spawnRecord) {
  return spawnRecord.args[spawnRecord.args.indexOf('--target-pid') + 1];
}

test('stop-arm without CLAUDE_PID targets the loop child, never the hook parent', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  createPendingRecord(sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const spawns = installKillerRecorder(sandbox);

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 10),
    cwd: sandbox.repoRoot,
    background_tasks: [],
  });

  assert.equal(result.code, 0, result.stderr);
  const [spawned] = spawns();
  // The hook here runs directly under the loop, so the loop child is the hook itself;
  // The old fallback named its parent, which is the loop.
  assert.equal(targetPidOf(spawned), String(spawned.hookPid));
  assert.notEqual(targetPidOf(spawned), loopId);
});

test('stop-arm keeps a CLAUDE_PID inside the loop and drops one outside it', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  createPendingRecord(sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const spawns = installKillerRecorder(sandbox);
  const target = startTarget(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  const payload = {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 10),
    cwd: sandbox.repoRoot,
    background_tasks: [],
  };
  try {
    sandbox.env.CLAUDE_PID = String(target.pid);
    assert.equal((await runAdapter(sandbox, STOP_ARM_PATH, payload)).code, 0);
    assert.equal(targetPidOf(spawns()[0]), String(target.pid));

    createPendingRecord(sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'));
    sandbox.env.CLAUDE_PID = '1';
    assert.equal((await runAdapter(sandbox, STOP_ARM_PATH, payload)).code, 0);
    const second = spawns()[1];
    assert.equal(targetPidOf(second), String(second.hookPid));
  } finally {
    killChild(target);
  }
});

test('stop-arm leaves the record pending when no process below the loop can be found', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = '999999999';
  const { recordPath, record } = createPendingRecord(
    sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'),
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const spawns = installKillerRecorder(sandbox);

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 10),
    cwd: sandbox.repoRoot,
    background_tasks: [],
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  assert.deepEqual(spawns(), []);
  const log = fs.readFileSync(
    path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log'),
    'utf8',
  );
  assert.match(log, /stop-arm-error stage=target-pid/);
});

test('stop-arm defers an armed record with a dead killer while background tasks run', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const { stateDir } = createPendingRecord(
    sandbox, loopId, SESSION_ID, path.join(sandbox.repoRoot, 'handoff.md'), 'armed',
  );
  sandbox.env.SKILLED_LOOP_ID = loopId;
  const spawns = installKillerRecorder(sandbox);

  const result = await runAdapter(sandbox, STOP_ARM_PATH, {
    ...STOP_PAYLOAD,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 10),
    cwd: sandbox.repoRoot,
    background_tasks: [{ task_id: 'task-1' }],
  });

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(spawns(), []);
  assert.match(
    fs.readFileSync(path.join(stateDir, 'relaunch.log'), 'utf8'),
    /deferred-background-tasks/,
  );
});

test('context-nudge writes SYSTEM_SPEC_FOLDER into the note when the payload carries none', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'claude-nudge-loop-0001';
  sandbox.env.SESSION_RELAUNCH_WINDOW_TOKENS = '1000';
  sandbox.env.SESSION_RELAUNCH_THRESHOLD = '0.80';
  sandbox.env.SYSTEM_SPEC_FOLDER = 'specs/hooks/001-session-relaunch';
  const result = await runAdapter(sandbox, CONTEXT_NUDGE_PATH, {
    ...POST_TOOL_USE,
    session_id: SESSION_ID,
    transcript_path: writeTranscript(sandbox, 800),
    cwd: sandbox.repoRoot,
  });
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout.trim()).hookSpecificOutput.additionalContext;
  assert.match(context, /^ +spec_folder: specs\/hooks\/001-session-relaunch$/m);
});

const COMPACT_POINTER = path.resolve(__dirname, '../claude/compact-pointer.mjs');

function writeOpenNote(sandbox, sessionId = SESSION_ID) {
  const directory = path.join(sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const notePath = path.join(directory, `20261021T080000Z-${sessionId.slice(0, 8)}.md`);
  fs.writeFileSync(notePath, [
    '---',
    'status: open',
    `session_id: ${sessionId}`,
    'loop_id: ',
    'runtime: claude',
    `cwd: ${sandbox.repoRoot}`,
    'spec_folder: ',
    `created_at: ${new Date().toISOString()}`,
    '---',
    '## Goal', 'g', '## Done', 'd', '## Remaining work', 'r', '## In-flight state', 'i',
  ].join('\n'));
  return notePath;
}

function writeSessionTranscripts(sandbox, { forkBoundaryAgoMs } = {}) {
  const projectDir = path.join(sandbox.root, 'project');
  fs.mkdirSync(projectDir, { recursive: true });
  const parentPath = path.join(projectDir, `${SESSION_ID}.jsonl`);
  fs.writeFileSync(parentPath, `${JSON.stringify({ type: 'user' })}\n`);
  if (typeof forkBoundaryAgoMs !== 'number') return { parentPath, forkPath: null };

  // A fork inherits its parent's session id and files its own transcript under that
  // id's subagents directory, so a fork's compaction is not the parent's.
  const subagentsDir = path.join(projectDir, SESSION_ID, 'subagents');
  fs.mkdirSync(subagentsDir, { recursive: true });
  const forkPath = path.join(subagentsDir, 'agent-abc123.jsonl');
  const boundary = {
    type: 'system',
    subtype: 'compact_boundary',
    timestamp: new Date(Date.now() - forkBoundaryAgoMs).toISOString(),
    compactMetadata: { trigger: 'auto' },
  };
  fs.writeFileSync(forkPath, `${JSON.stringify(boundary)}\n`);
  return { parentPath, forkPath };
}

function compactPayload(source = 'compact', transcriptPath) {
  const payload = { hook_event_name: 'SessionStart', source, session_id: SESSION_ID };
  if (!transcriptPath) return payload;
  return { ...payload, transcript_path: transcriptPath };
}

test('compact-pointer points a compacted session at its open note and resets the nudge level', async (t) => {
  const sandbox = createSandbox(t);
  const notePath = writeOpenNote(sandbox);
  const { parentPath } = writeSessionTranscripts(sandbox);
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, '{"level":2}\n');

  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('compact', parentPath));
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout).hookSpecificOutput.additionalContext;
  assert.match(context, /^\[session-relaunch\] This session was compacted after it wrote a handoff note/);
  assert.ok(context.includes(`claim '${notePath}' --session '${SESSION_ID}'`), context);
  assert.deepEqual(JSON.parse(fs.readFileSync(stateFile, 'utf8')), { level: 0 });
});

test('compact-pointer adds nothing on a fresh start or when no note is open', async (t) => {
  const sandbox = createSandbox(t);
  writeOpenNote(sandbox);
  const startup = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('startup'));
  assert.equal(startup.code, 0, startup.stderr);
  assert.equal(startup.stdout, '');

  const empty = createSandbox(t);
  const { parentPath } = writeSessionTranscripts(empty);
  const compacted = await runAdapter(
    empty, COMPACT_POINTER, compactPayload('compact', parentPath),
  );
  assert.equal(compacted.code, 0, compacted.stderr);
  assert.equal(compacted.stdout, '');
});

test('compact-pointer leaves a note alone while its hop is prepared', async (t) => {
  const sandbox = createSandbox(t);
  const notePath = writeOpenNote(sandbox);
  createPendingRecord(sandbox, '7001', SESSION_ID, notePath);
  sandbox.env.SKILLED_LOOP_ID = '7001';
  const { parentPath } = writeSessionTranscripts(sandbox);
  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('compact', parentPath));
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('compact-pointer stays silent for a fork that just compacted', async (t) => {
  const sandbox = createSandbox(t);
  writeOpenNote(sandbox);
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, '{"level":2}\n');
  const { parentPath } = writeSessionTranscripts(sandbox, { forkBoundaryAgoMs: 300 });

  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('compact', parentPath));
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(stateFile, 'utf8')), { level: 2 });
});

test('compact-pointer still points the parent when a fork compacted long ago', async (t) => {
  const sandbox = createSandbox(t);
  const notePath = writeOpenNote(sandbox);
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, '{"level":2}\n');
  const { parentPath } = writeSessionTranscripts(sandbox, { forkBoundaryAgoMs: 60000 });

  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('compact', parentPath));
  assert.equal(result.code, 0, result.stderr);
  const context = JSON.parse(result.stdout).hookSpecificOutput.additionalContext;
  assert.ok(context.includes(`claim '${notePath}' --session '${SESSION_ID}'`), context);
  assert.deepEqual(JSON.parse(fs.readFileSync(stateFile, 'utf8')), { level: 0 });
});

test('compact-pointer stays silent when the transcript path names a fork file', async (t) => {
  const sandbox = createSandbox(t);
  writeOpenNote(sandbox);
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, '{"level":2}\n');
  const { forkPath } = writeSessionTranscripts(sandbox, { forkBoundaryAgoMs: 60000 });

  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload('compact', forkPath));
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(stateFile, 'utf8')), { level: 2 });
});

test('compact-pointer skips and logs when the payload has no transcript path', async (t) => {
  const sandbox = createSandbox(t);
  writeOpenNote(sandbox);
  const stateFile = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `nudge-${SESSION_ID}.json`);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, '{"level":2}\n');

  const result = await runAdapter(sandbox, COMPACT_POINTER, compactPayload());
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(fs.readFileSync(stateFile, 'utf8')), { level: 2 });
  const log = fs.readFileSync(
    path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log'),
    'utf8',
  );
  assert.match(log, /compact-pointer-skipped/);
  assert.match(log, /reason=no-transcript/);
});
