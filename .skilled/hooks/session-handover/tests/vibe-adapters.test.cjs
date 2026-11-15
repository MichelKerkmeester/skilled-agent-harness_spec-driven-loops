// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Handover Adapter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PARTS_PATH = path.resolve(__dirname, '../vibe/handover-parts.mjs');
const USER_PROMPT_SUBMIT = require('./fixtures/codex-user-prompt-submit.json');
const STOP_PAYLOAD = require('./fixtures/codex-stop.json');
const { withoutRelaunchSwitches } = require('./fixtures/relaunch-env.cjs');
const nudge = require('../lib/nudge.cjs');
const core = require('../lib/relaunch-core.cjs');

const SESSION_ID = 'vibe-session-00000001';
const OTHER_SESSION_ID = 'vibe-session-00000002';
const LOOP_ID = '100';
const HOOK_PID = 41;
const PROCESS_TABLE = '41 50\n50 60\n60 100\n100 1\n';
const TARGET_PID = '60';
const WINDOW_TOKENS = 1000;
const VIBE_GENERATION = '0000000000000061';

let partsPromise = null;

function loadParts() {
  if (partsPromise === null) {
    partsPromise = import(pathToFileURL(PARTS_PATH).href);
  }
  return partsPromise;
}

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-handover-vibe-adapters-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  const env = {
    ...withoutRelaunchSwitches(process.env),
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_HANDOVER_REPO_ROOT: repoRoot,
    HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env'),
    // The relaunch hooks are off until opted in; these cases exercise them on.
    SYSTEM_SESSION_HANDOVER_ENABLED: '1',
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SYSTEM_SESSION_HANDOVER_DISABLED',
    'SESSION_HANDOVER_THRESHOLD',
    'SESSION_HANDOVER_WINDOW_TOKENS',
    'SESSION_HANDOVER_MAX_HOPS',
    'AI_SESSION_CHILD',
    'SYSTEM_SPEC_FOLDER',
    'NODE_OPTIONS',
  ]) delete env[key];
  env.SYSTEM_SESSION_HANDOVER_ENABLED = '1';

  // configPath() reads the live environment, so the sandbox flags file is installed around
  // the direct module calls instead of a child process.
  const previousFlagsConfig = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = env.HOOK_FLAGS_CONFIG;
  t.after(() => {
    if (previousFlagsConfig === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previousFlagsConfig;
    fs.rmSync(root, { recursive: true, force: true });
  });
  return { root, repoRoot, xdgRuntimeDir, home, env };
}

function createVibeSession(t, sandbox) {
  const sessionRoot = fs.mkdtempSync(path.join(sandbox.root, 'vibe-session-'));
  t.after(() => fs.rmSync(sessionRoot, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(sessionRoot, 'CURRENT'),
    JSON.stringify({ generation: VIBE_GENERATION }),
  );
  const generationDirectory = path.join(sessionRoot, 'generations', VIBE_GENERATION);
  fs.mkdirSync(generationDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(generationDirectory, 'runtime-state.json'),
    JSON.stringify({
      core_settings: { context: { model_facts: { compaction_threshold: WINDOW_TOKENS } } },
    }),
  );
  fs.mkdirSync(path.join(sessionRoot, 'journal'), { recursive: true });
  return sessionRoot;
}

function vibeModelCall(inputTokens) {
  return JSON.stringify({
    type: 'action_result',
    payload: {
      result: {
        result: {
          usage: { input_tokens: inputTokens, output_tokens: 11, cached_input_tokens: 19200 },
        },
      },
    },
  });
}

function writeVibeSegment(sessionRoot, name, lines) {
  fs.writeFileSync(
    path.join(sessionRoot, 'journal', name),
    lines.map((line) => `${line}\n`).join(''),
  );
}

function payloadFor(sandbox, sessionRoot, eventName, overrides = {}) {
  const base = eventName === 'post_agent' ? STOP_PAYLOAD : USER_PROMPT_SUBMIT;
  const payload = {
    ...base,
    hook_event_name: eventName,
    session_id: SESSION_ID,
    transcript_path: sessionRoot,
    cwd: sandbox.repoRoot,
    parent_session_id: null,
    ...overrides,
  };
  if (eventName !== 'pre_agent') delete payload.prompt;
  return payload;
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
    runtime: 'vibe',
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(recordPath, JSON.stringify(record));
  return { stateDir, recordPath, record };
}

function recordSpawns(spawns) {
  return (command, args, options) => {
    spawns.push({ command, args, options });
    return { unref() {} };
  };
}

test('turn-start nudges past the threshold and stays quiet below it', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'vibe-nudge-loop-0001';
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { buildHandoverContextPart } = await loadParts();

  const above = createVibeSession(t, sandbox);
  writeVibeSegment(above, '0000000000000001.jsonl', [vibeModelCall(850)]);
  const nudged = await buildHandoverContextPart(
    payloadFor(sandbox, above, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.match(nudged, /prepare --handoff.*--runtime 'vibe'/);

  const below = createVibeSession(t, sandbox);
  writeVibeSegment(below, '0000000000000001.jsonl', [vibeModelCall(700)]);
  const quiet = await buildHandoverContextPart(
    payloadFor(sandbox, below, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.equal(quiet, '');
});

test('post_tool nudges and leaves an armed hand-over untouched', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-post-tool-loop-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(
    sandbox,
    loopId,
    OTHER_SESSION_ID,
    'armed',
  );
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-post-tool';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(850)]);
  const { buildHandoverContextPart } = await loadParts();
  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool'),
    { env: sandbox.env },
  );

  assert.match(text, /prepare --handoff.*--runtime 'vibe'/);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
});

test('a claim seed expands at pre_agent and beats a nudge', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = 'vibe-seed-loop-0001';
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const notePath = path.join(sandbox.root, 'handoff.md');
  const prompt = `[session-handover] claim and continue handoff ${notePath}`
    + ' | Spec folder: specs/hooks/001-example'
    + ' (carried from the handoff; Gate 3 answered in the sending session)';
  const { buildHandoverContextPart } = await loadParts();

  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt }),
    { env: sandbox.env },
  );

  assert.ok(text.includes(`claim '${notePath}'`), text);
  assert.ok(text.includes('/speckit:resume specs/hooks/001-example'), text);
  assert.ok(!text.includes('prepare --handoff'), text);
});

test('pre_agent withdraws an armed hand-over and answers with the notice alone', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-withdraw-loop-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID, 'armed');
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-withdraw';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart } = await loadParts();
  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );

  assert.equal(text, nudge.WITHDRAWN_NOTICE);
  assert.ok(!text.includes('prepare --handoff'), text);
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'disarmed');
  assert.equal(stored.disarmReason, 'user-message');
});

test('the early withdraw step disarms first and the context part still answers with the notice', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-early-withdraw-loop-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID, 'armed');
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-early-withdraw';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, withdrawBeforeTurnStart } = await loadParts();
  const payload = payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' });

  assert.equal(withdrawBeforeTurnStart(payload, { env: sandbox.env }), true);
  const early = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(early.status, 'disarmed');
  assert.equal(early.disarmReason, 'user-message');

  const text = await buildHandoverContextPart(payload, { env: sandbox.env });
  assert.equal(text, nudge.WITHDRAWN_NOTICE);
});

test('a pre_agent with no prompt leaves an armed hand-over armed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-withdraw-noprompt-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID, 'armed');
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-noprompt';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, withdrawBeforeTurnStart } = await loadParts();
  const payload = payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: '  ' });

  assert.equal(withdrawBeforeTurnStart(payload, { env: sandbox.env }), false);
  const text = await buildHandoverContextPart(payload, { env: sandbox.env });

  assert.ok(!text.includes(nudge.WITHDRAWN_NOTICE), text);
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'armed');
});

test('the withdraw prompt still records the re-arm floor', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-withdraw-floor-loop-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID, 'armed');
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-withdraw-floor';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(850)]);
  const { buildHandoverContextPart } = await loadParts();
  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );

  // The withdraw alone leaves the grant pending; the decision on the same prompt turns it
  // into a floor one nudge step above this fill, so the next nudge waits for real growth.
  assert.equal(text, nudge.WITHDRAWN_NOTICE);
  const state = JSON.parse(
    fs.readFileSync(path.join(core.stateDir(sandbox.env), `nudge-${SESSION_ID}.json`), 'utf8'),
  );
  assert.equal(state.rearm.pending, undefined);
  assert.equal(state.rearm.floor, 0.9);
});

test('turn end arms the record and spawns the killer on the journal folder', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  const older = path.join(sessionRoot, 'journal', '0000000000000001.jsonl');
  const newest = path.join(sessionRoot, 'journal', '0000000000000002.jsonl');
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);
  writeVibeSegment(sessionRoot, '0000000000000002.jsonl', [vibeModelCall(200)]);
  fs.utimesSync(older, new Date('2026-01-01T00:00:00.000Z'), new Date('2026-01-01T00:00:00.000Z'));
  fs.utimesSync(newest, new Date('2026-01-01T00:00:10.000Z'), new Date('2026-01-01T00:00:10.000Z'));

  const spawns = [];
  const { armHandoverTurnEnd } = await loadParts();
  const result = await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent'),
    {
      env: sandbox.env,
      pid: HOOK_PID,
      processTable: PROCESS_TABLE,
      spawn: recordSpawns(spawns),
    },
  );

  assert.equal(result, null);
  assert.equal(spawns.length, 1);
  const [spawned] = spawns;
  assert.equal(spawned.command, process.execPath);
  assert.ok(spawned.args[0].endsWith('killer.cjs'));
  assert.equal(spawned.args[spawned.args.indexOf('--loop-id') + 1], LOOP_ID);
  assert.equal(spawned.args[spawned.args.indexOf('--target-pid') + 1], TARGET_PID);
  assert.equal(spawned.args[spawned.args.indexOf('--transcript') + 1], path.join(sessionRoot, 'journal'));
  assert.equal(spawned.options.detached, true);
  assert.equal(spawned.options.env, sandbox.env);
  const armed = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(armed.status, 'armed');
  assert.equal(armed.runtime, 'vibe');
});

test('a turn end that cannot arm marks the record deferred and the next prompt withdraws it', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);

  const spawns = [];
  const { armHandoverTurnEnd, buildHandoverContextPart } = await loadParts();
  await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent'),
    {
      env: sandbox.env,
      pid: HOOK_PID,
      processTable: '41 50\n50 1\n',
      spawn: recordSpawns(spawns),
    },
  );

  assert.equal(spawns.length, 0);
  const parked = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(parked.status, 'pending');
  assert.ok(parked.deferredAt, 'the record carries a deferred mark');

  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.equal(text, nudge.WITHDRAWN_NOTICE);
  const withdrawn = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(withdrawn.status, 'disarmed');
});

test('a pending record without a deferred mark survives the next prompt', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);

  const { buildHandoverContextPart } = await loadParts();
  await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
});

test('turn end ignores a journal lock and arms the killer on the journal folder', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  const segment = path.join(sessionRoot, 'journal', '0000000000000001.jsonl');
  const lock = path.join(sessionRoot, 'journal', 'lock');
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(200)]);
  fs.writeFileSync(lock, '');
  fs.utimesSync(segment, new Date('2026-01-01T00:00:00.000Z'), new Date('2026-01-01T00:00:00.000Z'));
  fs.utimesSync(lock, new Date('2026-01-01T00:00:10.000Z'), new Date('2026-01-01T00:00:10.000Z'));

  const spawns = [];
  const { armHandoverTurnEnd } = await loadParts();
  await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent'),
    {
      env: sandbox.env,
      pid: HOOK_PID,
      processTable: PROCESS_TABLE,
      spawn: recordSpawns(spawns),
    },
  );

  assert.equal(spawns.length, 1);
  const [spawned] = spawns;
  assert.equal(spawned.args[spawned.args.indexOf('--transcript') + 1], path.join(sessionRoot, 'journal'));
});

test('a subagent post_tool payload never nudges', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart } = await loadParts();

  const text = await buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool', { parent_session_id: 'parent-session' }),
    { env: sandbox.env },
  );
  assert.equal(text, '');
});

test('a forked main session still nudges at turn start and arms at turn end', async (t) => {
  const nudgeBox = createSandbox(t);
  nudgeBox.env.SKILLED_LOOP_ID = LOOP_ID;
  nudgeBox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  nudgeBox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const nudgeRoot = createVibeSession(t, nudgeBox);
  writeVibeSegment(nudgeRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, armHandoverTurnEnd } = await loadParts();

  const text = await buildHandoverContextPart(
    payloadFor(nudgeBox, nudgeRoot, 'pre_agent', {
      prompt: 'Continue the current task',
      parent_session_id: 'parent-session',
    }),
    { env: nudgeBox.env },
  );
  assert.ok(text.includes('prepare --handoff'), text);

  const armBox = createSandbox(t);
  armBox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(armBox, LOOP_ID, SESSION_ID);
  const armRoot = createVibeSession(t, armBox);
  writeVibeSegment(armRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);
  const spawns = [];
  await armHandoverTurnEnd(
    payloadFor(armBox, armRoot, 'post_agent', { parent_session_id: 'parent-session' }),
    { env: armBox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns(spawns) },
  );
  assert.equal(spawns.length, 1);
  assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).status, 'armed');
});

test('the switch silences both parts', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  sandbox.env.SYSTEM_SESSION_HANDOVER_DISABLED = '1';
  const { recordPath, record } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, armHandoverTurnEnd } = await loadParts();
  const spawns = [];
  const dependencies = {
    env: sandbox.env,
    pid: HOOK_PID,
    processTable: PROCESS_TABLE,
    spawn: recordSpawns(spawns),
  };

  assert.equal(
    await buildHandoverContextPart(
      payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
      dependencies,
    ),
    '',
  );
  assert.equal(
    await armHandoverTurnEnd(payloadFor(sandbox, sessionRoot, 'post_agent'), dependencies),
    null,
  );
  assert.equal(spawns.length, 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);

  delete sandbox.env.SYSTEM_SESSION_HANDOVER_DISABLED;
  sandbox.env.SYSTEM_SESSION_HANDOVER_VIBE_ENABLED = '0';
  assert.equal(
    await buildHandoverContextPart(
      payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
      dependencies,
    ),
    '',
  );
});

test('the turn-start step records the session id for its loop', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(100)]);
  const { withdrawBeforeTurnStart } = await loadParts();

  assert.equal(core.readVibeSessionId({ loopId: LOOP_ID, env: sandbox.env }), null);
  withdrawBeforeTurnStart(
    payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' }),
    { env: sandbox.env },
  );
  assert.equal(core.readVibeSessionId({ loopId: LOOP_ID, env: sandbox.env }), SESSION_ID);
  assert.equal(core.readVibeSessionId({ loopId: 'another-loop', env: sandbox.env }), null);
});

test('a nudge another hook is delivering stays quiet, and a stale claim is taken over', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const stateDir = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const claimPath = path.join(stateDir, `nudge-${SESSION_ID}.claim`);
  const { buildHandoverContextPart } = await loadParts();
  const postTool = () => buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool'),
    { env: sandbox.env },
  );

  fs.writeFileSync(claimPath, '');
  assert.equal(await postTool(), '');
  assert.equal(nudge.readState(SESSION_ID, sandbox.env), 0);

  const old = new Date(Date.now() - 60000);
  fs.utimesSync(claimPath, old, old);
  const text = await postTool();
  assert.ok(text.includes('prepare --handoff'), text);
  assert.equal(fs.existsSync(claimPath), false);
  assert.equal(nudge.readState(SESSION_ID, sandbox.env), 1);
});

test('a hook whose decision predates another hook\'s nudge decides again under the claim', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(820)]);
  const { buildHandoverContextPart } = await loadParts();
  const postTool = () => buildHandoverContextPart(
    payloadFor(sandbox, sessionRoot, 'post_tool'),
    { env: sandbox.env },
  );

  assert.ok((await postTool()).includes('prepare --handoff'));
  assert.equal(nudge.readState(SESSION_ID, sandbox.env), 1);

  // The second hook made its first decision before the first hook wrote its level.
  const realDecision = nudge.nudgeDecision;
  let calls = 0;
  nudge.nudgeDecision = (options) => {
    calls += 1;
    return calls === 1 ? { nudge: true, level: 1, reason: 'threshold' } : realDecision(options);
  };
  t.after(() => { nudge.nudgeDecision = realDecision; });

  assert.equal(await postTool(), '');
  assert.equal(calls, 2);
});

test('a turn end with no transcript path marks the record deferred', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const sessionRoot = createVibeSession(t, sandbox);
  const { armHandoverTurnEnd } = await loadParts();

  await armHandoverTurnEnd(
    payloadFor(sandbox, sessionRoot, 'post_agent', { transcript_path: '' }),
    { env: sandbox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns([]) },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
  assert.ok(stored.deferredAt, 'the record carries a deferred mark');
});

test('a turn end whose session has no journal segment marks the record deferred', async (t) => {
  const sandbox = createSandbox(t);
  sandbox.env.SKILLED_LOOP_ID = LOOP_ID;
  const { recordPath } = createPendingRecord(sandbox, LOOP_ID, SESSION_ID);
  const emptyRoot = path.join(sandbox.root, 'empty-vibe-session');
  fs.mkdirSync(path.join(emptyRoot, 'journal'), { recursive: true });
  const { armHandoverTurnEnd } = await loadParts();

  await armHandoverTurnEnd(
    payloadFor(sandbox, emptyRoot, 'post_agent'),
    { env: sandbox.env, pid: HOOK_PID, processTable: PROCESS_TABLE, spawn: recordSpawns([]) },
  );
  const stored = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(stored.status, 'pending');
  assert.ok(stored.deferredAt, 'the record carries a deferred mark');
});
