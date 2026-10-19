// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Adapter Conformance Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// One case table runs through every adapter, so a decision that drifts in one
// runtime fails here instead of surfacing as a different hop on that runtime alone.
// The Pi extension needs a TypeScript loader and mirrors these cases in its vitest suite.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const { spawn, spawnSync } = childProcess;
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const core = require('../lib/relaunch-core.cjs');

const HOOK_ROOT = path.resolve(__dirname, '..');
const OPENCODE_PLUGIN = path.resolve(HOOK_ROOT, '../../../.opencode/plugins/session-relaunch.js');
const ROLLOUT_CAPTURE = require('./fixtures/codex-rollout-token-count.json');
const SESSION_ID = 'conformance-session-0001';
const LOOP_ID = 'conformance-loop-0001';
const NOTE_PATH = '/workspace/handoffs/note.md';
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation';
const CARRIED = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SEED = `[session-relaunch] claim and continue handoff ${NOTE_PATH}`;
const WINDOW_TOKENS = 1000;
const FILL_TOKENS = 900;
// Arm cases run under a numeric loop, because a target lookup reads the loop id as a pid.
// The hook pid 41 sits below a transient shell 50 and the runtime 60 that loop 100 started.
const ARM_LOOP_ID = '100';
const ARM_HOOK_PID = 41;
const ARM_PROCESS_TABLE = '41 50\n50 60\n60 100\n100 1\n';
const STALE_ARM_AGE_MS = 20 * 60 * 1000;
const ENV_KEYS = [
  'SYSTEM_SESSION_RELAUNCH_DISABLED',
  'SYSTEM_HOOKS_DISABLED',
  'MK_HOOKS_DISABLED',
  'SESSION_RELAUNCH_THRESHOLD',
  'SESSION_RELAUNCH_WINDOW_TOKENS',
  'SESSION_RELAUNCH_MAX_AGE_MIN',
  'SESSION_RELAUNCH_MAX_HOPS',
  'SESSION_RELAUNCH_REPO_ROOT',
  'SKILLED_LOOP_ID',
  'SKILLED_LOOP_HOPS',
  'SKILLED_LOOP_RUNTIME',
  'SYSTEM_SPEC_FOLDER',
  'XDG_RUNTIME_DIR',
  'HOOK_FLAGS_CONFIG',
  'CLAUDE_PID',
];

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-conformance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const env = { ...process.env };
  for (const key of ENV_KEYS) delete env[key];
  Object.assign(env, {
    XDG_RUNTIME_DIR: path.join(root, 'runtime'),
    SESSION_RELAUNCH_REPO_ROOT: root,
    HOOK_FLAGS_CONFIG: path.join(root, 'hook-flags.env'),
    SESSION_RELAUNCH_THRESHOLD: '0.8',
    SESSION_RELAUNCH_WINDOW_TOKENS: String(WINDOW_TOKENS),
  });
  return { root, env };
}

function runHook(scriptPath, env, payload, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code) => {
      if (code !== 0) reject(new Error(`${scriptPath} exited ${code}: ${stderr}`));
      else resolve(stdout);
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

function hookContext(stdout) {
  return stdout.trim() ? JSON.parse(stdout).hookSpecificOutput.additionalContext : '';
}

function claudeTranscript(root) {
  const transcriptPath = path.join(root, 'claude-transcript.jsonl');
  fs.writeFileSync(transcriptPath, `${JSON.stringify({
    type: 'assistant',
    isSidechain: false,
    message: {
      model: 'claude-haiku-5-5',
      usage: { input_tokens: FILL_TOKENS, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    },
  })}\n`);
  return transcriptPath;
}

function codexRollout(root) {
  const record = JSON.parse(JSON.stringify(ROLLOUT_CAPTURE));
  const { info } = record.payload;
  info.last_token_usage.input_tokens = FILL_TOKENS;
  info.last_token_usage.cached_input_tokens = 0;
  info.total_token_usage.input_tokens = FILL_TOKENS;
  info.total_token_usage.cached_input_tokens = 0;
  info.model_context_window = WINDOW_TOKENS;
  const transcriptPath = path.join(root, 'codex-rollout.jsonl');
  fs.writeFileSync(transcriptPath, `${JSON.stringify(record)}\n`);
  return transcriptPath;
}

async function withProcessEnv(env, callback) {
  const previous = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) {
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
  }
  try {
    return await callback();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function recordSpawns(spawns) {
  return (command, args, options) => {
    spawns.push({ command, args, options });
    return { unref() {} };
  };
}

function importAdapter(...segments) {
  return import(pathToFileURL(path.join(HOOK_ROOT, ...segments)).href);
}

function killerArgument(spawned, flag) {
  return spawned.args[spawned.args.indexOf(flag) + 1];
}

async function loadOpenCodePlugin(directory) {
  const url = `${pathToFileURL(OPENCODE_PLUGIN).href}?conformance=${Date.now()}-${Math.random()}`;
  // The default export is the dual OpenCode plugin; `server` is the v1 factory the host calls.
  return (await import(url)).default.server({ directory });
}

async function openCodeSystem(hooks) {
  const output = { system: [] };
  await hooks['experimental.chat.system.transform'](
    { sessionID: SESSION_ID, model: { limit: { context: WINDOW_TOKENS } } },
    output,
  );
  return output.system.join('\n');
}

// Each driver answers three questions the same way: what a first prompt adds to the
// model's context, what a turn at 90% fill adds, and which killers the stop event starts.
// An empty string means nothing was added.
const ADAPTERS = {
  claude: {
    runtime: 'claude',
    seed: async ({ env, root }, prompt) => hookContext(await runHook(
      path.join(HOOK_ROOT, 'claude', 'context-nudge.mjs'),
      env,
      { hook_event_name: 'UserPromptSubmit', session_id: SESSION_ID, cwd: root, prompt },
      root,
    )),
    nudge: async ({ env, root }) => hookContext(await runHook(
      path.join(HOOK_ROOT, 'claude', 'context-nudge.mjs'),
      env,
      {
        hook_event_name: 'PostToolUse',
        session_id: SESSION_ID,
        cwd: root,
        transcript_path: claudeTranscript(root),
      },
      root,
    )),
    killerTarget: '60',
    arm: async ({ env, root }, { cwd, processTable }) => {
      const spawns = [];
      const { armPendingRecord } = await importAdapter('claude', 'stop-arm.mjs');
      await armPendingRecord(
        {
          hook_event_name: 'Stop',
          session_id: SESSION_ID,
          cwd,
          transcript_path: claudeTranscript(root),
          background_tasks: [],
        },
        { env, pid: ARM_HOOK_PID, processTable, spawn: recordSpawns(spawns) },
      );
      return spawns;
    },
  },
  codex: {
    runtime: 'codex',
    seed: async ({ env, root }, prompt) => hookContext(await runHook(
      path.join(HOOK_ROOT, 'codex', 'prompt-seed.mjs'),
      env,
      { hook_event_name: 'UserPromptSubmit', session_id: SESSION_ID, cwd: root, prompt },
      root,
    )),
    nudge: async ({ env, root }) => hookContext(await runHook(
      path.join(HOOK_ROOT, 'codex', 'context-nudge.mjs'),
      env,
      {
        hook_event_name: 'PostToolUse',
        session_id: SESSION_ID,
        cwd: root,
        transcript_path: codexRollout(root),
      },
      root,
    )),
    killerTarget: '60',
    arm: async ({ env, root }, { cwd, processTable }) => {
      const spawns = [];
      const { armPendingRecord } = await importAdapter('codex', 'stop-arm.mjs');
      await armPendingRecord(
        { hook_event_name: 'Stop', session_id: SESSION_ID, cwd, transcript_path: codexRollout(root) },
        { env, pid: ARM_HOOK_PID, processTable, spawn: recordSpawns(spawns) },
      );
      return spawns;
    },
  },
  hermes: {
    runtime: 'hermes',
    seed: async ({ env, root }, prompt) => JSON.parse(await runHook(
      path.join(HOOK_ROOT, 'hermes', 'context-nudge.mjs'),
      env,
      { session_id: SESSION_ID, cwd: root, is_first_turn: true, user_message: prompt },
      root,
    )).context,
    nudge: async ({ env, root }) => JSON.parse(await runHook(
      path.join(HOOK_ROOT, 'hermes', 'context-nudge.mjs'),
      env,
      {
        session_id: SESSION_ID,
        cwd: root,
        is_first_turn: false,
        user_message: 'continue',
        usage: { input_tokens: FILL_TOKENS },
      },
      root,
    )).context,
    killerTarget: '60',
    arm: async ({ env }, { cwd, processTable }) => {
      const spawns = [];
      const { armPendingRecord } = await importAdapter('hermes', 'session-end-arm.mjs');
      await armPendingRecord(
        { hook_event_name: 'on_session_end', session_id: SESSION_ID, cwd },
        { env, pid: ARM_HOOK_PID, processTable, spawn: recordSpawns(spawns) },
      );
      return spawns;
    },
  },
  opencode: {
    runtime: 'opencode',
    seed: ({ env, root }, prompt) => withProcessEnv(env, async () => {
      const hooks = await loadOpenCodePlugin(root);
      await hooks.event({ event: {
        type: 'message.updated',
        properties: { sessionID: SESSION_ID, info: { id: 'user-1', role: 'user' } },
      } });
      await hooks.event({ event: {
        type: 'message.part.updated',
        properties: { sessionID: SESSION_ID, part: { messageID: 'user-1', type: 'text', text: prompt } },
      } });
      return openCodeSystem(hooks);
    }),
    nudge: ({ env, root }) => withProcessEnv(env, async () => {
      const hooks = await loadOpenCodePlugin(root);
      await hooks.event({ event: {
        type: 'message.updated',
        properties: {
          sessionID: SESSION_ID,
          info: { id: 'assistant-1', role: 'assistant', time: { completed: 1 }, tokens: { input: FILL_TOKENS } },
        },
      } });
      return openCodeSystem(hooks);
    }),
    // The plugin runs inside the runtime, so the runtime it ends is its own process.
    killerTarget: String(process.pid),
    arm: ({ env }, { cwd }) => withProcessEnv(env, async () => {
      const spawns = [];
      const realSpawn = childProcess.spawn;
      childProcess.spawn = recordSpawns(spawns);
      try {
        const hooks = await loadOpenCodePlugin(cwd);
        await hooks.event({ event: { type: 'session.idle', properties: { sessionID: SESSION_ID } } });
      } finally {
        childProcess.spawn = realSpawn;
      }
      return spawns;
    }),
  },
};

const SEED_CASES = [
  {
    name: 'a well-formed seed adds the claim command and resumes the carried packet',
    prompt: `${SEED} | Spec folder: ${SPEC_FOLDER}${CARRIED}`,
    check: (text) => {
      assert.ok(text.includes(`claim '${NOTE_PATH}' --session '${SESSION_ID}'`), text);
      assert.ok(text.includes(`/speckit:resume ${SPEC_FOLDER}`), text);
      assert.ok(text.includes('node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs'), text);
    },
  },
  {
    name: 'a seed with a relative note path adds nothing',
    prompt: '[session-relaunch] claim and continue handoff relative/note.md',
    check: (text) => assert.equal(text, ''),
  },
  {
    name: 'a seed carrying an invalid spec folder claims without resuming it',
    prompt: `${SEED} | Spec folder: specs/not-a-packet${CARRIED}`,
    check: (text) => {
      assert.ok(text.includes(`claim '${NOTE_PATH}'`), text);
      assert.equal(text.includes('/speckit:resume'), false, text);
    },
  },
];

const NUDGE_CASES = [
  {
    name: 'a nudge writes the bound packet from SYSTEM_SPEC_FOLDER into the note',
    setup: ({ env }) => { env.SYSTEM_SPEC_FOLDER = SPEC_FOLDER; },
    check: (text, runtime) => {
      assert.match(text, new RegExp(`^ +spec_folder: ${SPEC_FOLDER}$`, 'm'));
      assert.ok(text.includes(`--runtime '${runtime}'`), text);
    },
  },
  {
    name: 'a nudge drops an invalid spec folder instead of writing it into the note',
    setup: ({ env }) => { env.SYSTEM_SPEC_FOLDER = `${SPEC_FOLDER}\nstatus: done`; },
    check: (text) => {
      assert.match(text, /^ +spec_folder: $/m);
      assert.equal(/^ +status: done$/m.test(text), false, text);
    },
  },
  {
    name: 'a nudge stays silent while this session has a pending handoff',
    setup: ({ env, root }, runtime) => {
      env.SKILLED_LOOP_ID = LOOP_ID;
      core.preparePending({
        loopId: LOOP_ID,
        handoffPath: path.join(root, 'note.md'),
        sessionId: SESSION_ID,
        runtime,
        cwd: root,
        env,
      });
    },
    check: (text) => assert.equal(text, ''),
  },
  {
    name: 'a nudge stays silent at the hop cap',
    setup: ({ env }) => {
      env.SKILLED_LOOP_ID = LOOP_ID;
      env.SKILLED_LOOP_HOPS = '2';
      env.SESSION_RELAUNCH_MAX_HOPS = '2';
    },
    check: (text) => assert.equal(text, ''),
  },
];

function prepareArmRecord({ env, root }, { runtime, sessionId = SESSION_ID, armedAgoMs } = {}) {
  env.SKILLED_LOOP_ID = ARM_LOOP_ID;
  core.preparePending({
    loopId: ARM_LOOP_ID,
    handoffPath: path.join(root, 'note.md'),
    sessionId,
    runtime,
    cwd: root,
    env,
  });
  if (armedAgoMs !== undefined) {
    core.arm({ loopId: ARM_LOOP_ID, cwd: root, env, now: Date.now() - armedAgoMs });
  }
  return core.readRelaunchFile(ARM_LOOP_ID, env);
}

function assertUntouched({ record, before, spawns }) {
  assert.deepEqual(record, before);
  assert.deepEqual(spawns, []);
}

const ARM_CASES = [
  {
    name: "an arm turns this session's pending record armed from the live cwd and starts one killer",
    setup: (sandbox, runtime) => prepareArmRecord(sandbox, { runtime }),
    check: ({ record, spawns, cwd }, adapter) => {
      assert.equal(record.status, 'armed');
      assert.equal(record.cwd, cwd);
      assert.equal(spawns.length, 1);
      assert.equal(killerArgument(spawns[0], '--loop-id'), ARM_LOOP_ID);
      assert.equal(killerArgument(spawns[0], '--target-pid'), adapter.killerTarget);
    },
  },
  {
    name: 'a re-arm restamps an armed record whose killer is gone, so the wrapper still relaunches it',
    setup: (sandbox, runtime) => prepareArmRecord(sandbox, { runtime, armedAgoMs: STALE_ARM_AGE_MS }),
    check: ({ record, spawns, cwd }) => {
      assert.equal(record.status, 'armed');
      assert.equal(record.cwd, cwd);
      assert.deepEqual(core.shouldRelaunch(record), { relaunch: true });
      assert.equal(spawns.length, 1);
    },
  },
  {
    name: 'an arm leaves a pending record from another session untouched',
    setup: (sandbox, runtime) => prepareArmRecord(sandbox, { runtime, sessionId: 'another-session-0001' }),
    check: assertUntouched,
  },
  {
    name: 'an arm leaves a pending record prepared for another runtime untouched',
    setup: (sandbox, runtime) => prepareArmRecord(sandbox, {
      runtime: runtime === 'claude' ? 'codex' : 'claude',
    }),
    check: assertUntouched,
  },
  {
    name: 'an arm leaves the record pending when no process below the loop is found',
    looksUpTarget: true,
    processTable: '41 50\n50 1\n',
    setup: (sandbox, runtime) => prepareArmRecord(sandbox, { runtime }),
    check: assertUntouched,
  },
];

for (const [name, adapter] of Object.entries(ADAPTERS)) {
  for (const seedCase of SEED_CASES) {
    test(`${name}: ${seedCase.name}`, async (t) => {
      const sandbox = createSandbox(t);
      seedCase.check(await adapter.seed(sandbox, seedCase.prompt), adapter.runtime);
    });
  }
  for (const nudgeCase of NUDGE_CASES) {
    test(`${name}: ${nudgeCase.name}`, async (t) => {
      const sandbox = createSandbox(t);
      nudgeCase.setup(sandbox, adapter.runtime);
      nudgeCase.check(await adapter.nudge(sandbox), adapter.runtime);
    });
  }
  for (const armCase of ARM_CASES) {
    // A runtime that signals its own process never looks a target up, so it has no such case.
    if (armCase.looksUpTarget && adapter.killerTarget === String(process.pid)) continue;
    test(`${name}: ${armCase.name}`, async (t) => {
      const sandbox = createSandbox(t);
      const before = armCase.setup(sandbox, adapter.runtime);
      const cwd = path.join(sandbox.root, 'live-cwd');
      const spawns = await adapter.arm(sandbox, {
        cwd,
        processTable: armCase.processTable ?? ARM_PROCESS_TABLE,
      });
      armCase.check({
        record: core.readRelaunchFile(ARM_LOOP_ID, sandbox.env),
        before,
        spawns,
        cwd,
      }, adapter);
    });
  }
}

// A hook entrypoint acts only when started as a script, so a test or another module can
// import it, and reach its exports, without the import reading stdin or ending the process.
const ENTRYPOINTS = [
  ['claude', 'context-nudge.mjs'],
  ['claude', 'stop-arm.mjs'],
  ['codex', 'context-nudge.mjs'],
  ['codex', 'prompt-seed.mjs'],
  ['codex', 'stop-arm.mjs'],
  ['hermes', 'context-nudge.mjs'],
  ['hermes', 'session-end-arm.mjs'],
];

for (const segments of ENTRYPOINTS) {
  test(`${segments.join('/')} does nothing when imported`, (t) => {
    const sandbox = createSandbox(t);
    const moduleUrl = pathToFileURL(path.join(HOOK_ROOT, ...segments)).href;
    const source = `await import(${JSON.stringify(moduleUrl)});`
      + ' await new Promise((resolve) => setTimeout(resolve, 300));'
      + " process.stdout.write('still running');";
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      env: sandbox.env,
      input: '',
      encoding: 'utf8',
      timeout: 5000,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, 'still running');
  });
}
