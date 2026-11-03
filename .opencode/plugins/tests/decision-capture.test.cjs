// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Capture OpenCode Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_PATH = path.join(__dirname, '..', 'decision-capture.js');
const CAPTURE_CORE_URL = pathToFileURL(path.resolve(
  __dirname,
  '../../../.skilled/hooks/decision-capture/lib/capture-core.mjs',
)).href;
const SWEEP_URL = pathToFileURL(path.resolve(
  __dirname,
  '../../../.skilled/hooks/decision-capture/bin/sweep-opencode.mjs',
)).href;
const DISABLED_ENV = 'SYSTEM_DECISION_CAPTURE_DISABLED';
const SESSION_ID = 'ses_capture_test';
const QUESTION = 'Which fruit should I name in my reply?';
const QUESTION_DATA = {
  question: QUESTION,
  header: 'Fruit choice',
  options: [{ label: 'apple' }, { label: 'pear' }, { label: 'plum' }],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function createProject(t) {
  const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'decision-capture-'));
  t.after(() => fs.rmSync(projectDir, { recursive: true, force: true }));
  return projectDir;
}

async function createHooks(projectDir) {
  const pluginModule = await import(pathToFileURL(PLUGIN_PATH).href);
  return pluginModule.default.server({ directory: projectDir });
}

function questionInput({
  tool = 'question',
  sessionID = SESSION_ID,
  callID = 'call_capture_test',
  questions = [QUESTION_DATA],
} = {}) {
  return { tool, sessionID, callID, args: { questions } };
}

function questionOutput(answers = [['pear']]) {
  return { title: '', output: { answers }, metadata: { answers } };
}

async function readQueue(projectDir, sessionId = SESSION_ID) {
  const captureCore = await import(CAPTURE_CORE_URL);
  return captureCore.readQueue(projectDir, sessionId);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CAPTURE CASES
// ─────────────────────────────────────────────────────────────────────────────

test('an answered question queues the save-time key and answer', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);
  const output = questionOutput();

  await hooks['tool.execute.after'](questionInput(), output);

  const records = await readQueue(projectDir);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, `opencode:${SESSION_ID}:call_capture_test:0`);
  assert.equal(records[0].answer, 'pear');
  assert.equal(records[0].source, 'hook');
  assert.deepEqual(output.output, { answers: [['pear']] });
});

test('a multi-label answer is joined with comma-space', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);

  await hooks['tool.execute.after'](questionInput(), questionOutput([['a', 'b']]));

  const records = await readQueue(projectDir);
  assert.equal(records.length, 1);
  assert.equal(records[0].answer, 'a, b');
});

test('other tools, missing answers, malformed payloads and the kill switch queue nothing', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);

  await hooks['tool.execute.after'](
    questionInput({ tool: 'bash', callID: 'call_other_tool' }),
    questionOutput(),
  );
  await hooks['tool.execute.after'](
    questionInput({ callID: 'call_missing_answers' }),
    { output: { answers: [['pear']] }, metadata: {} },
  );
  await hooks['tool.execute.after'](
    questionInput({ callID: 'call_malformed_questions', questions: 'not-an-array' }),
    questionOutput(),
  );
  await hooks['tool.execute.after'](
    questionInput({ callID: 'call_malformed_answer' }),
    questionOutput([['pear', null]]),
  );

  const previousDisabled = process.env[DISABLED_ENV];
  process.env[DISABLED_ENV] = '1';
  try {
    await hooks['tool.execute.after'](
      questionInput({ callID: 'call_disabled' }),
      questionOutput(),
    );
    const output = { system: [], output: 'unchanged' };
    await hooks['experimental.chat.system.transform']({ sessionID: SESSION_ID }, output);
    assert.deepEqual(output.system, []);
    assert.equal(output.output, 'unchanged');
  } finally {
    if (previousDisabled === undefined) delete process.env[DISABLED_ENV];
    else process.env[DISABLED_ENV] = previousDisabled;
  }

  assert.deepEqual(await readQueue(projectDir), []);
});

test('the same answered call twice queues one line', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);
  const input = questionInput();
  const output = questionOutput();

  await hooks['tool.execute.after'](input, output);
  await hooks['tool.execute.after'](input, output);

  const records = await readQueue(projectDir);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, `opencode:${SESSION_ID}:call_capture_test:0`);
});

test('two pending answers produce one system line, then none on the next transform', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);

  await hooks['tool.execute.after'](
    questionInput({ callID: 'call_first_answer' }),
    questionOutput(),
  );
  await hooks['tool.execute.after'](
    questionInput({ callID: 'call_second_answer' }),
    questionOutput(),
  );

  const output = { system: [], output: 'unchanged' };
  await hooks['experimental.chat.system.transform']({ sessionID: SESSION_ID }, output);
  assert.deepEqual(output.system, [
    "2 operator answer(s) captured this session are not in a decision record yet. Run /speckit:save with --full-auto to record them; the save's transcript sweep offers chat answers, and an answer already in a hand-written table is matched with match-decision-table.",
  ]);
  assert.equal(output.output, 'unchanged');

  const nextOutput = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: SESSION_ID }, nextOutput);
  assert.deepEqual(nextOutput.system, []);
});

test('a save-time reader record for the same call is not duplicated', async (t) => {
  const projectDir = createProject(t);
  const hooks = await createHooks(projectDir);
  const sessionId = SESSION_ID;
  const callID = 'call_reader_first';
  const sweep = await import(SWEEP_URL);
  const captureCore = await import(CAPTURE_CORE_URL);
  const readerRecords = sweep.openCodeAnswerRecords({
    parts: [{
      type: 'tool',
      tool: 'question',
      callID,
      state: {
        status: 'completed',
        input: { questions: [QUESTION_DATA] },
        metadata: { answers: [['pear']] },
      },
    }],
    sessionId,
    now: '2026-11-02T00:00:00.000Z',
  });
  captureCore.appendRecords(projectDir, sessionId, readerRecords);

  await hooks['tool.execute.after'](
    questionInput({ callID }),
    questionOutput(),
  );

  const records = await readQueue(projectDir, sessionId);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, `opencode:${sessionId}:${callID}:0`);
  assert.equal(records[0].answer, 'pear');
  assert.equal(records[0].source, 'transcript');
});
