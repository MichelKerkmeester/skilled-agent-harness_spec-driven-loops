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

const require = createRequire(import.meta.url);
const core = require('../../ask-surface-guard/lib/ask-surface-core.cjs');

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

// The kill switches an operator may export for a live session would otherwise
// decide these cases, so every spawn starts from a clean flag state and a
// nonexistent flag file.
const FLAG_NAMES = [
  'SYSTEM_HOOKS_DISABLED',
  'SYSTEM_ASK_SURFACE_DISABLED',
  'SYSTEM_COMPLETION_DISABLED',
  'SYSTEM_COMPLETION_SENTINEL_DISABLED',
  'SYSTEM_SPECKIT_COMPLETION_DISABLED',
  'SYSTEM_SKILL_ADVISOR_DISABLED',
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
