// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Turn End Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the post_agent composer and the turn-start composer as Vibe runs them:
// one JSON payload on stdin, one optional deny or context line on stdout. The
// session roots are copies of the recorded post_agent journal fixture, with the
// reply and the tool catalog rewritten per case, so every decision is made on a
// journal Vibe actually wrote. The marker root and the project root are temp
// folders, so no case depends on another or on the caller's shell.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { composeTurnEnd } from './turn-end.mjs';
import { armHandoverTurnEnd } from '../../session-handover/vibe/handover-parts.mjs';

const require = createRequire(import.meta.url);
const core = require('../../ask-surface-guard/lib/ask-surface-core.cjs');
const { withoutRelaunchSwitches } = require('../../session-handover/tests/fixtures/relaunch-env.cjs');

const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
const TURN_END = join(HOOK_DIR, 'turn-end.mjs');
const TURN_START = join(HOOK_DIR, 'turn-start.mjs');
const REPO_ROOT = resolve(HOOK_DIR, '../../../..');
const SESSION_FIXTURE = join(
  REPO_ROOT,
  '.skilled/hooks/shared/tests/session-readers/fixtures/vibe/post-agent',
);
const SESSION_ID = '83423691-aa25-a878-594d-e688f1e788e9';
const JOURNAL_NAME = '0000000000000001.jsonl';
const PENDING_ADVISORY_RELATIVE_PATH = '.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt';

const MENU_REPLY = [
  'Both files can take the change.',
  '',
  'Which one should I update?',
  'A) src/parser.ts',
  'B) src/lexer.ts',
].join('\n');
const CLAIM_REPLY = 'Implemented the parser change and finished the task.';
const ADVISORY_DETAIL = 'claimed done but no implementation-summary.md recorded in a missing packet; reread the request and confirm each outcome it asks for is met or named not done';

// The kill switches and the hop count an operator may export for a live session
// would otherwise decide these cases, so every spawn starts from a clean flag
// state, a fresh session's zero hops and a nonexistent flag file.
const FLAG_NAMES = [
  'SESSION_HANDOVER_MAX_HOPS',
  'SKILLED_LOOP_HOPS',
  'SYSTEM_HOOKS_DISABLED',
  'SYSTEM_ASK_SURFACE_DISABLED',
  'SYSTEM_COMPLETION_DISABLED',
  'SYSTEM_COMPLETION_SENTINEL_DISABLED',
  'SYSTEM_SPECKIT_COMPLETION_DISABLED',
  'SYSTEM_SKILL_ADVISOR_DISABLED',
  'SYSTEM_SESSION_HANDOVER_DISABLED',
  'SYSTEM_SESSION_HANDOVER_ENABLED',
  'SYSTEM_SESSION_HANDOVER_VIBE_ENABLED',
];

function makeTempDir(t, prefix) {
  const dir = mkdtempSync(join(os.tmpdir(), prefix));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/**
 * Copy the recorded post_agent journal into a fresh session root and
 * rewrite the reply, and optionally the tool catalog, for one case.
 *
 * @param {import('node:test').TestContext} t - The running test.
 * @param {{reply?: string, questionTool?: boolean}} [options] - The case's reply and catalog.
 * @returns {string} The session root a hook receives as `transcript_path`.
 */
function copySession(t, { reply = 'probe-ok', questionTool = false } = {}) {
  const root = makeTempDir(t, 'vibe-turn-end-session-');
  mkdirSync(join(root, 'journal'), { recursive: true });
  copyFileSync(join(SESSION_FIXTURE, 'meta.json'), join(root, 'meta.json'));

  const source = readFileSync(join(SESSION_FIXTURE, 'journal', JOURNAL_NAME), 'utf8');
  const records = source.trim().split('\n').map((line) => JSON.parse(line));
  for (const record of records) {
    const command = record.payload?.input?.command;
    if (command && command.type === 'completion_succeeded') {
      command.result.parts = [{ type: 'text', text: reply }];
    }
    const catalog = record.payload?.request?.model_input?.tool_catalog;
    if (questionTool && catalog && Array.isArray(catalog.tools)) {
      catalog.tools = [...catalog.tools, { name: 'ask_user_question', description: 'Ask the operator a question.' }];
    }
  }
  writeFileSync(
    join(root, 'journal', JOURNAL_NAME),
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
  );
  return root;
}

// Vibe appends the deny reason as a user message and retries the same turn id.
function appendRetryUserMessage(root) {
  const journalPath = join(root, 'journal', JOURNAL_NAME);
  const records = readFileSync(journalPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  const turn = records.find((record) => record.type === 'action_intent')?.payload?.request?.turn_id;
  const sequence = Math.max(...records.map((record) => record.sequence)) + 1;
  records.push({
    sequence,
    type: 'projection_delta',
    payload: {
      delta: [{
        op: 'append_entry',
        entry: {
          id: `user-retry-${sequence}`,
          type: 'message',
          role: 'user',
          sessionId: SESSION_ID,
          turnId: turn,
          content: [{ type: 'text', text: `${core.repromptFor('vibe')}` }],
          createdAt: Date.now(),
          generationStatus: 'completed',
        },
      }],
    },
  });
  writeFileSync(journalPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
}

/**
 * Run one hook as Vibe runs it, with the caller's flag state removed.
 *
 * @param {string} hook - The hook script to spawn.
 * @param {object|string} payload - The payload, or raw stdin text.
 * @param {{env?: Record<string, string>, tmpDir?: string}} [options] - Extra env and the marker root.
 * @returns {{status: number|null, stdout: string, stderr: string}} The run.
 */
function runHook(hook, payload, { env = {}, tmpDir } = {}) {
  const spawnedEnv = { ...process.env, ...env };
  for (const name of FLAG_NAMES) delete spawnedEnv[name];
  for (const [name, value] of Object.entries(env)) spawnedEnv[name] = value;
  if (!('AI_SESSION_CHILD' in env)) delete spawnedEnv.AI_SESSION_CHILD;
  if (!('VIBE_SPEC_FOLDER' in env)) delete spawnedEnv.VIBE_SPEC_FOLDER;
  if (tmpDir) {
    spawnedEnv.TMPDIR = tmpDir;
    spawnedEnv.HOOK_FLAGS_CONFIG = join(tmpDir, 'hook-flags.env');
  }
  return spawnSync(process.execPath, [hook], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    env: spawnedEnv,
    encoding: 'utf8',
  });
}

function postAgentPayload(sessionRoot, projectDir, overrides = {}) {
  return {
    session_id: SESSION_ID,
    transcript_path: sessionRoot,
    cwd: projectDir,
    parent_session_id: null,
    hook_event_name: 'post_agent',
    agent_name: 'default',
    ...overrides,
  };
}

function preAgentPayload(projectDir) {
  return {
    hook_event_name: 'pre_agent',
    session_id: 'session-turn-start',
    parent_session_id: null,
    transcript_path: join(projectDir, 'session.jsonl'),
    cwd: projectDir,
    agent_name: 'default',
    turn_id: 'turn-start-1',
    prompt: 'Continue.',
  };
}

function pendingAdvisoryPath(projectDir) {
  return join(projectDir, PENDING_ADVISORY_RELATIVE_PATH);
}

test('a prose-menu turn is denied once with the Vibe reprompt', (t) => {
  const session = copySession(t, { reply: MENU_REPLY, questionTool: true });
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const markers = makeTempDir(t, 'vibe-turn-end-markers-');

  const result = runHook(TURN_END, postAgentPayload(session, project), { tmpDir: markers });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    decision: 'deny',
    reason: core.repromptFor('vibe'),
  });
  assert.match(JSON.parse(result.stdout).reason, /`ask_user_question`/);

  const fires = readFileSync(join(project, '.skilled/skills/.state/ask-surface/fires.jsonl'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.equal(fires.length, 1);
  assert.equal(fires[0].runtime, 'vibe');
});

test('the same turn key a second time prints nothing', (t) => {
  const session = copySession(t, { reply: MENU_REPLY, questionTool: true });
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const markers = makeTempDir(t, 'vibe-turn-end-markers-');
  const payload = postAgentPayload(session, project);

  const first = runHook(TURN_END, payload, { tmpDir: markers });
  assert.equal(first.status, 0, first.stderr);
  assert.notEqual(first.stdout, '');

  const second = runHook(TURN_END, payload, { tmpDir: markers });
  assert.equal(second.status, 0, second.stderr);
  assert.equal(second.stdout, '');
});

test('a retry that keeps the turn id is not reprompted again', (t) => {
  const session = copySession(t, { reply: MENU_REPLY, questionTool: true });
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const markers = makeTempDir(t, 'vibe-turn-end-markers-');

  const first = runHook(TURN_END, postAgentPayload(session, project), { tmpDir: markers });
  assert.equal(first.status, 0, first.stderr);
  assert.notEqual(first.stdout, '');

  appendRetryUserMessage(session);
  const retry = runHook(TURN_END, postAgentPayload(session, project), { tmpDir: markers });
  assert.equal(retry.status, 0, retry.stderr);
  assert.equal(retry.stdout, '');
});

test('a child or subagent session is never reprompted', (t) => {
  const session = copySession(t, { reply: MENU_REPLY, questionTool: true });
  const project = makeTempDir(t, 'vibe-turn-end-project-');

  const child = runHook(TURN_END, postAgentPayload(session, project), {
    env: { AI_SESSION_CHILD: '1' },
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout, '');

  const subagent = runHook(
    TURN_END,
    postAgentPayload(session, project, { parent_session_id: 'parent-session' }),
    { tmpDir: makeTempDir(t, 'vibe-turn-end-markers-') },
  );
  assert.equal(subagent.status, 0, subagent.stderr);
  assert.equal(subagent.stdout, '');
});

test('a session whose catalog lacks the question tool is never reprompted', (t) => {
  const session = copySession(t, { reply: MENU_REPLY, questionTool: false });
  const project = makeTempDir(t, 'vibe-turn-end-project-');

  const result = runHook(TURN_END, postAgentPayload(session, project), {
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a completion claim writes one pending advisory and no deny', (t) => {
  const session = copySession(t, { reply: CLAIM_REPLY });
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const specFolder = join(makeTempDir(t, 'vibe-turn-end-packet-'), 'missing-packet');

  const result = runHook(TURN_END, postAgentPayload(session, project), {
    env: { VIBE_SPEC_FOLDER: specFolder },
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');

  const pending = readFileSync(pendingAdvisoryPath(project), 'utf8');
  assert.match(pending, /no implementation-summary\.md/);
  assert.match(pending, /reread the request/);
});

test('the pending advisory is delivered once and deleted', (t) => {
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const pending = pendingAdvisoryPath(project);
  mkdirSync(dirname(pending), { recursive: true });
  writeFileSync(pending, `${ADVISORY_DETAIL}\n`);
  const env = { SYSTEM_SKILL_ADVISOR_DISABLED: '1' };

  const first = runHook(TURN_START, preAgentPayload(project), {
    env,
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(first.status, 0, first.stderr);
  const context = JSON.parse(first.stdout).hook_specific_output.additional_context;
  assert.match(context, /^\[completion-evidence\] claimed done/);
  assert.equal(existsSync(pending), false);

  const second = runHook(TURN_START, preAgentPayload(project), {
    env,
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(second.status, 0, second.stderr);
  assert.equal(second.stdout, '');
});

test('malformed input exits 0 and prints nothing', () => {
  const result = runHook(TURN_END, 'not json');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a missing journal exits 0 and prints nothing', (t) => {
  const empty = makeTempDir(t, 'vibe-turn-end-empty-');
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const result = runHook(TURN_END, postAgentPayload(empty, project), {
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a throwing part prints nothing and the later part still runs', async () => {
  const payload = postAgentPayload('/nonexistent-session', '/nonexistent-project');

  assert.equal(await composeTurnEnd(payload, {
    parts: [() => { throw new Error('part failure'); }],
  }), null);

  assert.deepEqual(await composeTurnEnd(payload, {
    parts: [
      () => { throw new Error('part failure'); },
      () => ({ decision: 'deny', reason: 'kept' }),
    ],
  }), { decision: 'deny', reason: 'kept' });
});

test('the hand-over part arms nothing while its switch is off', (t) => {
  const session = copySession(t, { reply: 'probe-ok' });
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const runtimeDir = makeTempDir(t, 'vibe-turn-end-runtime-');
  const stateDir = join(runtimeDir, 'skilled-relaunch');
  mkdirSync(stateDir, { recursive: true });
  const recordPath = join(stateDir, 'relaunch-555.json');
  const record = {
    version: 1,
    status: 'pending',
    loopId: '555',
    handoff: join(project, 'handoff.md'),
    sessionId: SESSION_ID,
    runtime: 'vibe',
    name: null,
    cwd: project,
    hops: 0,
    preparedAt: new Date().toISOString(),
  };
  writeFileSync(recordPath, JSON.stringify(record));

  const result = runHook(TURN_END, postAgentPayload(session, project), {
    env: { SKILLED_LOOP_ID: '555', XDG_RUNTIME_DIR: runtimeDir },
    tmpDir: makeTempDir(t, 'vibe-turn-end-markers-'),
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.deepEqual(JSON.parse(readFileSync(recordPath, 'utf8')), record);
});

// The composer stops at the first deny, so the hand-over part must never run on a turn
// Vibe sends back: arming there would end a session whose turn is still going.
test('a deny ahead of the hand-over part keeps the record pending', async (t) => {
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const root = makeTempDir(t, 'vibe-turn-end-handover-');
  const runtimeDir = join(root, 'runtime');
  mkdirSync(runtimeDir, { recursive: true });

  const loopId = '555';
  const env = {
    ...withoutRelaunchSwitches(process.env),
    XDG_RUNTIME_DIR: runtimeDir,
    SESSION_HANDOVER_REPO_ROOT: join(root, 'repo'),
    HOOK_FLAGS_CONFIG: join(root, 'hook-flags.env'),
    SYSTEM_SESSION_HANDOVER_ENABLED: '1',
    SKILLED_LOOP_ID: loopId,
  };
  for (const name of [
    'SKILLED_LOOP_HOPS',
    'SESSION_HANDOVER_THRESHOLD',
    'SESSION_HANDOVER_WINDOW_TOKENS',
    'SESSION_HANDOVER_MAX_HOPS',
    'AI_SESSION_CHILD',
  ]) {
    delete env[name];
  }

  // The record is armed by a part that has everything it needs, so a pending record
  // afterwards can only mean the deny short-circuited the part.
  const stateDir = join(runtimeDir, 'skilled-relaunch');
  mkdirSync(stateDir, { recursive: true });
  const recordPath = join(stateDir, `relaunch-${loopId}.json`);
  writeFileSync(recordPath, JSON.stringify({
    version: 1,
    status: 'pending',
    loopId,
    handoff: join(project, 'handoff.md'),
    sessionId: SESSION_ID,
    runtime: 'vibe',
    name: null,
    cwd: project,
    hops: 0,
    preparedAt: new Date().toISOString(),
  }));

  const session = copySession(t, { reply: 'probe-ok' });
  const payload = postAgentPayload(session, project);

  // configPath() reads the live environment, not the one handed to the part.
  const previousFlagsConfig = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = env.HOOK_FLAGS_CONFIG;
  t.after(() => {
    if (previousFlagsConfig === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = previousFlagsConfig;
  });

  let handoverRan = false;
  const spawns = [];
  const deny = await composeTurnEnd(payload, {
    parts: [
      () => ({ decision: 'deny', reason: 'x' }),
      (value) => {
        handoverRan = true;
        return armHandoverTurnEnd(value, {
          env,
          pid: 41,
          processTable: '41 50\n50 60\n60 555\n555 1\n',
          spawn: (command, args, options) => {
            spawns.push({ command, args, options });
            return { unref() {} };
          },
        });
      },
    ],
  });

  assert.deepEqual(deny, { decision: 'deny', reason: 'x' });
  assert.equal(handoverRan, false);
  assert.equal(spawns.length, 0);
  assert.equal(JSON.parse(readFileSync(recordPath, 'utf8')).status, 'pending');

  const source = readFileSync(TURN_END, 'utf8');
  const partsLine = source.split('\n').find((line) => line.includes('const PARTS = ['));
  assert.ok(partsLine, 'turn-end.mjs declares the part list');
  assert.match(partsLine, /handoverPart\];\s*$/);
});

// The two turn-end parts write under the payload's cwd, so a payload that names
// a folder that does not exist must not make either part create one.
const { buildCompletionPart } = require(
  '../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs',
);
const { buildAskSurfacePart } = await import('../../ask-surface-guard/vibe/ask-surface-post-agent.mjs');

function completionDependencies() {
  return {
    evidence: {
      evaluateCompletionEvidence: () => ({ decision: 'advise', detail: ADVISORY_DETAIL }),
      appendAdvisoryLog: () => {},
    },
    readClaim: async () => 'Done: the change is complete.',
    enabled: () => true,
    env: { VIBE_SPEC_FOLDER: 'specs/example' },
  };
}

test('the completion part writes its pending advisory under an existing payload folder', async (t) => {
  const project = makeTempDir(t, 'vibe-turn-end-project-');
  const result = await buildCompletionPart(
    { hook_event_name: 'post_agent', cwd: project },
    completionDependencies(),
  );
  assert.equal(result.advisory, ADVISORY_DETAIL);
  assert.match(readFileSync(pendingAdvisoryPath(project), 'utf8'), /claimed done/);
});

test('the completion part creates nothing under a payload folder that does not exist', async (t) => {
  const missing = join(makeTempDir(t, 'vibe-turn-end-project-'), 'missing');
  const result = await buildCompletionPart(
    { hook_event_name: 'post_agent', cwd: missing },
    completionDependencies(),
  );
  assert.equal(result.advisory, ADVISORY_DETAIL);
  assert.equal(existsSync(missing), false);
});

test('the ask-surface part still denies but logs no fire under a payload folder that does not exist', (t) => {
  const missing = join(makeTempDir(t, 'vibe-turn-end-project-'), 'missing');
  const fires = [];
  const result = buildAskSurfacePart(
    { hook_event_name: 'post_agent', cwd: missing, session_id: SESSION_ID },
    {
      askCore: {
        CONCERN: core.CONCERN,
        evaluateTurn: () => ({ verdict: 'fire' }),
        markTurn: () => true,
        recordFire: (projectDir) => { fires.push(projectDir); return true; },
        repromptFor: core.repromptFor,
      },
      load: () => ({ ok: true, entries: [], journalRecords: [], turn: 'turn-1', source: { sessionId: SESSION_ID } }),
      enabled: () => true,
      env: {},
    },
  );
  assert.equal(result.decision, 'deny');
  assert.deepEqual(fires, []);
  assert.equal(existsSync(missing), false);
});

const hookFlags = require('../../shared/hook-flags.cjs');

// Points the flag reader at a scratch hook-flags.env, so these tests never read
// the operator's own file, and sets live environment keys for one test. Both
// are restored afterwards.
function useLiveSwitches(t, flagFileContents, liveEnv = {}) {
  const dir = makeTempDir(t, 'vibe-turn-end-flags-');
  const file = join(dir, 'hook-flags.env');
  writeFileSync(file, flagFileContents);
  const keys = { HOOK_FLAGS_CONFIG: file, ...liveEnv };
  const previous = Object.fromEntries(Object.keys(keys).map((key) => [key, process.env[key]]));
  Object.assign(process.env, keys);
  hookFlags._resetConfigCache();
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    hookFlags._resetConfigCache();
  });
  return dir;
}

// A firing turn with the real switch reader, so the only thing that can stop
// the deny is a kill switch the reader finds.
function askSurfaceWithLiveSwitch(t, flagFileContents) {
  const dir = useLiveSwitches(t, flagFileContents);
  return buildAskSurfacePart(
    { hook_event_name: 'post_agent', cwd: dir, session_id: SESSION_ID },
    {
      askCore: {
        CONCERN: core.CONCERN,
        evaluateTurn: () => ({ verdict: 'fire' }),
        markTurn: () => true,
        recordFire: () => true,
        repromptFor: core.repromptFor,
      },
      load: () => ({ ok: true, entries: [], journalRecords: [], turn: 'turn-1', source: { sessionId: SESSION_ID } }),
      markerDir: dir,
    },
  );
}

test('the live ask-surface part denies when hook-flags.env holds no switch', (t) => {
  assert.equal(askSurfaceWithLiveSwitch(t, '')?.decision, 'deny');
});

test('a kill switch saved to hook-flags.env still silences the live ask-surface part', (t) => {
  assert.equal(askSurfaceWithLiveSwitch(t, `${hookFlags.concernFlag(core.CONCERN)}=1\n`), null);
});

// A claimed-done turn read through the live environment and the real switch
// reader, so only a kill switch the reader finds can drop the advisory.
async function completionWithLiveSwitch(t, flagFileContents) {
  const project = useLiveSwitches(t, flagFileContents, { VIBE_SPEC_FOLDER: 'specs/example' });
  const { enabled, env, ...dependencies } = completionDependencies();
  return buildCompletionPart({ hook_event_name: 'post_agent', cwd: project }, dependencies);
}

test('the live completion part records its advisory when hook-flags.env holds no switch', async (t) => {
  assert.equal((await completionWithLiveSwitch(t, ''))?.advisory, ADVISORY_DETAIL);
});

test('a kill switch saved to hook-flags.env still silences the live completion part', async (t) => {
  assert.equal(await completionWithLiveSwitch(t, `${hookFlags.concernFlag('completion')}=1\n`), null);
});
