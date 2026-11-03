// ───────────────────────────────────────────────────────────────────
// MODULE: Operator Decision Capture Tests
// ───────────────────────────────────────────────────────────────────
// Each test builds a throwaway project directory, so the queue is written
// where the test can inspect it and nothing reaches this repository's state.
// The adapter test is the only one that spawns a process: it proves the hook
// entry point fails open and prints nothing, which the core cannot show.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

import {
  QUEUE_RELATIVE_DIR,
  appendRecords,
  isProcessQuestion,
  normalizeAskUserQuestion,
  pendingRecords,
  queueDir,
  queueFile,
  readQueue,
  takeNudge,
  toolSourceKey,
} from './capture-core.mjs';
import { devinAnswerRecords } from '../bin/sweep-devin.mjs';
import { openCodeAnswerRecords } from '../bin/sweep-opencode.mjs';
import { recoveredRecords, sweepPiTranscript } from '../bin/sweep-pi.mjs';
import { sweepTranscript } from '../bin/sweep-transcript.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ADAPTER = join(HERE, '..', 'claude', 'ask-capture-posttooluse.mjs');
const DEVIN_ADAPTER = join(HERE, '..', 'devin', 'ask-capture-posttooluse.mjs');
const OPEN_CODE_PLUGIN_URL = pathToFileURL(
  join(HERE, '..', '..', '..', '..', '.opencode', 'plugins', 'decision-capture.js'),
).href;
const NOW = '2026-11-01T12:00:00.000Z';

// The product question keeps a double space and a trailing space on purpose:
// the queue has to reproduce what the operator saw and typed, byte for byte.
const PRODUCT_QUESTION = 'Which  colour should the badge use? ';
const PRODUCT_ANSWER = ' Amber ';

function withProject(run) {
  const projectDir = mkdtempSync(join(tmpdir(), 'decision-capture-'));
  try {
    return run(projectDir);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

function capture(overrides = {}) {
  return normalizeAskUserQuestion({
    runtime: 'claude',
    sessionId: 's1',
    toolUseId: 't1',
    source: 'hook',
    now: NOW,
    ...overrides,
  });
}

function hookEnv() {
  const env = { ...process.env };
  for (const name of [
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'SYSTEM_DECISION_CAPTURE_DISABLED',
    'CLAUDE_PROJECT_DIR',
  ]) {
    delete env[name];
  }
  return env;
}

test('a two-question payload becomes two records with exact keys and text', () => {
  withProject((projectDir) => {
    const secondQuestion = 'Which store owns the\tdelivery queue?';
    const records = capture({
      toolInput: {
        questions: [
          {
            question: PRODUCT_QUESTION,
            header: 'Badge',
            options: [{ label: 'Amber', description: 'Warm' }, { label: 'Teal' }],
            multiSelect: false,
          },
          {
            question: secondQuestion,
            header: 'Ownership',
            options: [{ label: 'core' }, { label: 'cli' }],
            multiSelect: true,
          },
        ],
      },
      toolResponse: {
        answers: {
          [PRODUCT_QUESTION]: PRODUCT_ANSWER,
          [secondQuestion]: ['core', 'cli'],
        },
      },
    });

    assert.equal(records.length, 2);
    assert.deepEqual(records.map((record) => record.key), [
      toolSourceKey('claude', 's1', 't1', 0),
      toolSourceKey('claude', 's1', 't1', 1),
    ]);
    assert.equal(records[0].question, PRODUCT_QUESTION);
    assert.equal(records[0].answer, PRODUCT_ANSWER);
    assert.deepEqual(records[0].options, ['Amber', 'Teal']);
    assert.equal(records[0].multi_select, false);
    assert.equal(records[0].kind, 'tool');
    assert.equal(records[0].runtime, 'claude');
    assert.equal(records[0].session_id, 's1');
    assert.equal(records[0].tool_use_id, 't1');
    assert.equal(records[0].question_index, 0);
    assert.equal(records[0].source, 'hook');
    assert.equal(records[0].captured_at, NOW);
    assert.equal(records[1].question, secondQuestion);
    assert.equal(records[1].answer, 'core, cli');
    assert.equal(records[1].multi_select, true);

    appendRecords(projectDir, 's1', records);
    assert.equal(readQueue(projectDir, 's1').length, 2);
  });
});

test('appending the same records twice appends them once', () => {
  withProject((projectDir) => {
    const records = capture({
      toolInput: {
        questions: [
          { question: PRODUCT_QUESTION, header: 'Badge', options: [], multiSelect: false },
          { question: 'Which store owns the queue?', header: 'Owner', options: [], multiSelect: false },
        ],
      },
      toolResponse: {
        answers: { [PRODUCT_QUESTION]: PRODUCT_ANSWER, 'Which store owns the queue?': 'core' },
      },
    });

    assert.deepEqual(appendRecords(projectDir, 's1', records), { appended: 2, skipped: 0 });
    assert.deepEqual(appendRecords(projectDir, 's1', records), { appended: 0, skipped: 2 });
    assert.equal(readQueue(projectDir, 's1').length, 2);
    const lines = readFileSync(queueFile(projectDir, 's1'), 'utf8').trim().split('\n');
    assert.equal(lines.length, 2);
  });
});

test('a malformed payload returns no records and writes no file', () => {
  withProject((projectDir) => {
    assert.deepEqual(capture({ toolInput: null, toolResponse: null }), []);
    assert.deepEqual(
      capture({ toolInput: { questions: 'not an array' }, toolResponse: { answers: {} } }),
      [],
    );
    assert.deepEqual(
      capture({
        toolInput: { questions: [{ question: 'Which store owns the queue?', options: [] }] },
        toolResponse: {},
      }),
      [],
    );

    assert.equal(existsSync(queueDir(projectDir)), false);
    assert.equal(existsSync(queueFile(projectDir, 's1')), false);
  });
});

test('process questions are dropped and a product question is kept', () => {
  withProject((projectDir) => {
    const gateQuestion = 'Which documentation folder should this change use?';
    const worktreeQuestion = 'Which git worktree should I use?';
    const permissionQuestion = 'May I commit and push these changes?';
    const productQuestion = 'Which colour should the badge use?';

    const records = capture({
      toolInput: {
        questions: [
          {
            question: gateQuestion,
            header: 'Gate 3',
            options: [{ label: 'A) Existing' }, { label: 'B) New' }, { label: 'D) Skip' }],
            multiSelect: false,
          },
          {
            question: worktreeQuestion,
            header: 'Workspace',
            options: [{ label: 'A) Create a git worktree' }, { label: 'B) Work on current branch' }],
            multiSelect: false,
          },
          {
            question: permissionQuestion,
            header: 'Ship',
            options: [{ label: 'Yes' }, { label: 'No' }],
            multiSelect: false,
          },
          {
            question: productQuestion,
            header: 'Badge',
            options: [{ label: 'Amber' }, { label: 'Teal' }],
            multiSelect: false,
          },
        ],
      },
      toolResponse: {
        answers: {
          [gateQuestion]: 'A) Existing',
          [worktreeQuestion]: 'B) Work on current branch',
          [permissionQuestion]: 'Yes',
          [productQuestion]: 'Amber',
        },
      },
    });

    assert.equal(records.length, 1);
    assert.equal(records[0].question, productQuestion);
    assert.equal(records[0].answer, 'Amber');
    assert.equal(records[0].question_index, 3);
    assert.equal(records[0].key, toolSourceKey('claude', 's1', 't1', 3));

    appendRecords(projectDir, 's1', records);
    assert.equal(readQueue(projectDir, 's1').length, 1);
  });
});

// Two shapes seen in real sessions: a workspace question that names the choice only
// in its options, and a product question whose subject is the process questions.
test('the offered choices decide a process question, not the words it mentions', () => {
  assert.equal(isProcessQuestion({
    question: 'The build needs a git workspace choice before it can start. Where should it run?',
    header: 'Workspace',
    options: ['A) Create a git worktree', 'B) Work on current branch'],
  }), true);
  assert.equal(isProcessQuestion({
    question: 'Record process questions (Gate 3, worktree vs branch, commit/push permission)?',
    header: 'Process',
    options: ['One-line class (rec.)', 'Record in full', 'Filter out'],
  }), false);
  assert.equal(isProcessQuestion({
    question: 'Build now, where?',
    header: 'Build',
    options: ['B) New 042-decision-capture (rec.)', 'C) Child of 009', 'Later'],
  }), true);
});

// Also from real sessions: a work-item menu where one item happens to start with
// "Commit", and a question that really asks when to ship.
test('a commit or push option marks a process question only when the question is about shipping', () => {
  assert.equal(isProcessQuestion({
    question: 'Which category of drift/fixes from the audit would you like to work on first?',
    header: 'Work focus',
    options: ['Fix broken configs & paths', 'Commit orca & sync Hermes', 'Fix SYNC & doc drift'],
  }), false);
  assert.equal(isProcessQuestion({
    question: 'When should the decision-capture build be committed to main?',
    header: 'Commit',
    options: ['After the probe settles (Recommended)', 'Commit and push now', 'Hold for my review'],
  }), true);
});

// A real Devin session asked the documentation question in its own words, with no
// lettered menu, so the offer of a new packet is what gives it away.
test('an unlettered offer of a new packet marks the documentation question', () => {
  assert.equal(isProcessQuestion({
    question: 'Where should this work be documented?',
    header: 'Packet',
    options: ['New packet (057)', 'Extend 056'],
  }), true);
});

test('pendingRecords leaves out a key recorded as consumed', () => {
  withProject((projectDir) => {
    const records = capture({
      toolInput: {
        questions: [
          { question: PRODUCT_QUESTION, header: 'Badge', options: [], multiSelect: false },
          { question: 'Which store owns the queue?', header: 'Owner', options: [], multiSelect: false },
        ],
      },
      toolResponse: {
        answers: { [PRODUCT_QUESTION]: PRODUCT_ANSWER, 'Which store owns the queue?': 'core' },
      },
    });
    appendRecords(projectDir, 's1', records);

    mkdirSync(queueDir(projectDir), { recursive: true, mode: 0o700 });
    writeFileSync(
      join(queueDir(projectDir), 'consumed.jsonl'),
      `${JSON.stringify({ key: records[0].key, packet: 'demo-packet', id: 'Q001', at: NOW })}\n`,
    );

    const pending = pendingRecords(projectDir, 's1');
    assert.equal(pending.length, 1);
    assert.equal(pending[0].key, records[1].key);
  });
});

test('takeNudge reports a rising count once and then stays quiet', () => {
  withProject((projectDir) => {
    const records = capture({
      toolInput: {
        questions: [
          { question: PRODUCT_QUESTION, header: 'Badge', options: [], multiSelect: false },
          { question: 'Which store owns the queue?', header: 'Owner', options: [], multiSelect: false },
        ],
      },
      toolResponse: {
        answers: { [PRODUCT_QUESTION]: PRODUCT_ANSWER, 'Which store owns the queue?': 'core' },
      },
    });
    appendRecords(projectDir, 's1', records);

    assert.equal(takeNudge(projectDir, 's1'), 2);
    assert.equal(takeNudge(projectDir, 's1'), 0);
  });
});

// A save can consume only some answers, for example when the others target an
// unresolved packet. The next answer captured after that is still news.
test('takeNudge reports a new answer after a save consumed only part of the queue', () => {
  withProject((projectDir) => {
    const questions = ['Which badge colour?', 'Which badge size?', 'Which badge shape?'];
    const records = capture({
      toolInput: {
        questions: questions.map((question) => ({ question, header: 'Badge', options: [], multiSelect: false })),
      },
      toolResponse: { answers: Object.fromEntries(questions.map((question) => [question, 'yes'])) },
    });
    appendRecords(projectDir, 's1', records);
    assert.equal(takeNudge(projectDir, 's1'), 3);

    writeFileSync(
      join(queueDir(projectDir), 'consumed.jsonl'),
      `${JSON.stringify({ key: records[0].key, packet: 'demo-packet', id: 'Q001', at: NOW })}\n`,
    );
    assert.equal(takeNudge(projectDir, 's1'), 0);

    appendRecords(projectDir, 's1', capture({
      toolUseId: 't2',
      toolInput: { questions: [{ question: 'Which badge border?', header: 'Badge', options: [], multiSelect: false }] },
      toolResponse: { answers: { 'Which badge border?': 'thin' } },
    }));
    assert.equal(takeNudge(projectDir, 's1'), 3);
  });
});

test('takeNudge leaves no state behind for a session with nothing captured', () => {
  withProject((projectDir) => {
    assert.equal(takeNudge(projectDir, 'quiet'), 0);
    assert.equal(existsSync(queueDir(projectDir)), false);
  });
});

test('the Claude adapter records one line and fails open on bad stdin', () => {
  withProject((projectDir) => {
    const payload = {
      tool_name: 'AskUserQuestion',
      session_id: 's1',
      tool_use_id: 't1',
      cwd: projectDir,
      tool_input: {
        questions: [
          {
            question: 'Which colour should the badge use?',
            header: 'Badge',
            options: [{ label: 'Amber' }, { label: 'Teal' }],
            multiSelect: false,
          },
        ],
      },
      tool_response: { answers: { 'Which colour should the badge use?': 'Amber' } },
    };

    const good = spawnSync(process.execPath, [ADAPTER], {
      input: JSON.stringify(payload),
      encoding: 'utf8',
      env: hookEnv(),
      timeout: 15000,
    });
    assert.equal(good.status, 0);
    assert.equal(good.stdout, '');

    const lines = readFileSync(queueFile(projectDir, 's1'), 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
    const record = JSON.parse(lines[0]);
    assert.equal(record.key, toolSourceKey('claude', 's1', 't1', 0));
    assert.equal(record.answer, 'Amber');

    const bad = spawnSync(process.execPath, [ADAPTER], {
      input: 'not json',
      encoding: 'utf8',
      env: hookEnv(),
      timeout: 15000,
    });
    assert.equal(bad.status, 0);
    assert.equal(bad.stdout, '');
    assert.equal(readFileSync(queueFile(projectDir, 's1'), 'utf8').trim().split('\n').length, 1);
  });
});

// The fixture is a payload Claude Code really sent this hook, with only its
// paths and ids replaced. A synthetic payload can only repeat what the test's
// author believed the shape to be; this one fails if the adapter reads a key
// Claude does not send.
test('the adapter queues one record from a real Claude PostToolUse payload', () => {
  withProject((projectDir) => {
    const fixture = JSON.parse(readFileSync(
      join(HERE, '..', 'claude', 'fixtures', 'claude-posttooluse-askuserquestion.json'),
      'utf8',
    ));
    // Claude reports the shell's current directory as cwd, which a session can
    // move below the project, so the queue has to follow CLAUDE_PROJECT_DIR the
    // way the Stop hook that counts it does.
    const subdir = join(projectDir, 'nested', 'workdir');
    mkdirSync(subdir, { recursive: true });
    const payload = { ...fixture, cwd: subdir };
    const [question] = Object.keys(fixture.tool_response.answers);

    const run = spawnSync(process.execPath, [ADAPTER], {
      input: JSON.stringify(payload),
      encoding: 'utf8',
      env: { ...hookEnv(), CLAUDE_PROJECT_DIR: projectDir },
      timeout: 15000,
    });
    assert.equal(run.status, 0);
    assert.equal(run.stdout, '');
    assert.equal(existsSync(join(subdir, '.skilled')), false);

    const records = readQueue(projectDir, fixture.session_id);
    assert.equal(records.length, 1);
    assert.equal(records[0].key, toolSourceKey('claude', fixture.session_id, fixture.tool_use_id, 0));
    assert.equal(records[0].question, question);
    assert.equal(records[0].answer, fixture.tool_response.answers[question]);
    assert.deepEqual(records[0].options, ['Probe answer A', 'Probe answer B']);
  });
});

// The hook and the sweep can capture the same answer at once from separate
// processes. Each checks the file for the key before writing, so only the lock
// stops both from seeing it absent and writing it twice.
test('concurrent appends of the same keys from separate processes write each key once', async () => {
  const { spawn } = await import('node:child_process');
  const projectDir = mkdtempSync(join(tmpdir(), 'decision-capture-'));
  try {
    const core = join(HERE, 'capture-core.mjs');
    const script = `
      const { appendRecords } = await import(${JSON.stringify(`file://${core}`)});
      const writer = process.argv[1];
      for (let i = 0; i < 25; i += 1) {
        appendRecords(${JSON.stringify(projectDir)}, 's1', [{ key: 'k-' + i, writer, answer: 'x'.repeat(2000) }]);
      }`;
    const runs = Array.from({ length: 8 }, (_, writer) => new Promise((resolve) => {
      const child = spawn(process.execPath, ['--input-type=module', '-e', script, String(writer)], { stdio: 'ignore' });
      child.on('exit', resolve);
    }));
    const codes = await Promise.all(runs);
    assert.deepEqual(codes, Array(8).fill(0));

    const lines = readFileSync(queueFile(projectDir, 's1'), 'utf8').trim().split('\n');
    assert.equal(lines.length, 25);
    const keys = new Set(lines.map((line) => JSON.parse(line).key));
    assert.equal(keys.size, 25);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
});

function writeJsonLines(projectDir, fileName, entries) {
  const transcriptPath = join(projectDir, fileName);
  writeFileSync(transcriptPath, entries.map((entry) => JSON.stringify(entry)).join('\n') + '\n');
  return transcriptPath;
}

function assertBothCaptureOrders({ sessionId, expectedKeys, live, reader }) {
  const sortedExpectedKeys = [...expectedKeys].sort();

  for (const [order, first, second] of [
    ['live then reader', live, reader],
    ['reader then live', reader, live],
  ]) {
    withProject((projectDir) => {
      first(projectDir);
      second(projectDir);

      const path = queueFile(projectDir, sessionId);
      const lines = existsSync(path)
        ? readFileSync(path, 'utf8').split('\n').filter((line) => line.trim() !== '')
        : [];
      const records = readQueue(projectDir, sessionId);

      assert.equal(lines.length, sortedExpectedKeys.length, order + ' line count');
      assert.equal(records.length, sortedExpectedKeys.length, order + ' record count');
      assert.deepEqual(
        records.map((record) => record.key).sort(),
        sortedExpectedKeys,
        order + ' keys',
      );
    });
  }
}

function runAdapter(adapter, payload) {
  const run = spawnSync(process.execPath, [adapter], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15000,
  });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout, '');
}

function runOpenCodeHook(projectDir, input, output) {
  const script = [
    'import plugin from ' + JSON.stringify(OPEN_CODE_PLUGIN_URL) + ';',
    "let inputText = '';",
    'for await (const chunk of process.stdin) inputText += chunk;',
    'const payload = JSON.parse(inputText);',
    'const hooks = await plugin.server({ directory: payload.projectDir });',
    "await hooks['tool.execute.after'](payload.input, payload.output);",
  ].join('\n');
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    input: JSON.stringify({ projectDir, input, output }),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15000,
  });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout, '');
}

function claudeTranscriptEntries(payload) {
  return [
    {
      type: 'assistant',
      sessionId: payload.session_id,
      uuid: 'assistant-question',
      message: {
        content: [{
          type: 'tool_use',
          id: payload.tool_use_id,
          name: 'AskUserQuestion',
          input: payload.tool_input,
        }],
      },
    },
    {
      type: 'user',
      sessionId: payload.session_id,
      uuid: 'user-answer',
      message: { content: [{ type: 'tool_result', tool_use_id: payload.tool_use_id }] },
      toolUseResult: payload.tool_response,
    },
  ];
}

function piLinesForCall(fixture, callId) {
  const assistant = fixture.lines.find((line) => (
    line?.message?.role === 'assistant'
    && line.message.content?.some((item) => item?.id === callId)
  ));
  const result = fixture.lines.find((line) => (
    line?.message?.role === 'toolResult'
    && line.message.toolCallId === callId
  ));
  assert.ok(assistant);
  assert.ok(result);
  return [fixture.lines[0], assistant, result];
}

function devinPayloadForTranscript(transcript, projectDir) {
  const [step] = transcript.steps;
  const [call] = step.tool_calls;
  const [result] = step.observation.results;
  return {
    tool_name: 'ask_user_question',
    session_id: transcript.session_id,
    tool_use_id: call.tool_call_id,
    cwd: projectDir,
    tool_input: call.arguments,
    tool_response: { output: result.content },
  };
}

test('Claude hook and transcript sweep deduplicate answered and empty calls in either order', () => {
  const fixture = JSON.parse(readFileSync(
    join(HERE, '..', 'claude', 'fixtures', 'claude-posttooluse-askuserquestion.json'),
    'utf8',
  ));
  const sessionId = 'claude-ordering-session';
  const toolUseId = 'claude-ordering-call';
  const [question] = fixture.tool_input.questions;
  const makePayload = (answer) => ({
    tool_name: 'AskUserQuestion',
    session_id: sessionId,
    tool_use_id: toolUseId,
    tool_input: { questions: fixture.tool_input.questions },
    tool_response: { answers: { [question.question]: answer } },
  });
  const answeredPayload = makePayload(fixture.tool_response.answers[question.question]);
  const answeredKey = toolSourceKey('claude', sessionId, toolUseId, 0);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [answeredKey],
    live: (projectDir) => runAdapter(ADAPTER, { ...answeredPayload, cwd: projectDir }),
    reader: (projectDir) => {
      const transcriptPath = writeJsonLines(
        projectDir,
        'claude.jsonl',
        claudeTranscriptEntries(answeredPayload),
      );
      sweepTranscript({ projectDir, transcriptPath, now: NOW });
    },
  });

  const emptyPayload = makePayload('');
  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [],
    live: (projectDir) => runAdapter(ADAPTER, { ...emptyPayload, cwd: projectDir }),
    reader: (projectDir) => {
      const transcriptPath = writeJsonLines(
        projectDir,
        'claude-empty.jsonl',
        claudeTranscriptEntries(emptyPayload),
      );
      sweepTranscript({ projectDir, transcriptPath, now: NOW });
    },
  });
});

test('Pi live mapping and transcript sweep deduplicate answers and ignore cancelled calls in either order', () => {
  const fixture = JSON.parse(readFileSync(
    join(HERE, '..', 'bin', 'fixtures', 'pi-ask-user-question.json'),
    'utf8',
  ));
  const sessionId = fixture.lines[0].id;
  const answeredLines = piLinesForCall(fixture, 'call_fixture_1');
  const answeredRecords = recoveredRecords(answeredLines, sessionId, NOW)
    .map((record) => ({ ...record, source: 'hook' }));
  assert.equal(answeredRecords.length, 1);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: answeredRecords.map((record) => record.key),
    live: (projectDir) => appendRecords(projectDir, sessionId, answeredRecords),
    reader: (projectDir) => {
      const transcriptPath = writeJsonLines(projectDir, 'pi.jsonl', answeredLines);
      sweepPiTranscript({ projectDir, transcriptPath, now: NOW });
    },
  });

  const cancelledLines = piLinesForCall(fixture, 'call_fixture_7');
  const cancelledRecords = recoveredRecords(cancelledLines, sessionId, NOW)
    .map((record) => ({ ...record, source: 'hook' }));
  assert.equal(cancelledRecords.length, 0);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [],
    live: (projectDir) => appendRecords(projectDir, sessionId, cancelledRecords),
    reader: (projectDir) => {
      const transcriptPath = writeJsonLines(projectDir, 'pi-cancelled.jsonl', cancelledLines);
      sweepPiTranscript({ projectDir, transcriptPath, now: NOW });
    },
  });
});

test('OpenCode plugin and answer reader deduplicate answered calls and ignore calls without answer lists', () => {
  const parts = JSON.parse(readFileSync(
    join(HERE, '..', 'bin', 'fixtures', 'opencode-question-parts.json'),
    'utf8',
  ));
  const sessionId = 'opencode-ordering-session';
  const answeredPart = { ...parts[0], sessionID: sessionId, callID: 'opencode-ordering-call' };
  const answeredRecords = openCodeAnswerRecords({ parts: [answeredPart], sessionId, now: NOW });
  assert.equal(answeredRecords.length, answeredPart.state.input.questions.length);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: answeredRecords.map((record) => record.key),
    live: (projectDir) => runOpenCodeHook(projectDir, {
      tool: 'question',
      sessionID: sessionId,
      callID: answeredPart.callID,
      args: answeredPart.state.input,
    }, { metadata: { answers: answeredPart.state.metadata.answers } }),
    reader: (projectDir) => appendRecords(
      projectDir,
      sessionId,
      openCodeAnswerRecords({ parts: [answeredPart], sessionId, now: NOW }),
    ),
  });

  const missingAnswerMetadata = { ...answeredPart.state.metadata };
  delete missingAnswerMetadata.answers;
  const unansweredPart = {
    ...answeredPart,
    callID: 'opencode-no-answer-call',
    state: { ...answeredPart.state, metadata: missingAnswerMetadata },
  };
  assert.deepEqual(openCodeAnswerRecords({ parts: [unansweredPart], sessionId, now: NOW }), []);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [],
    live: (projectDir) => runOpenCodeHook(projectDir, {
      tool: 'question',
      sessionID: sessionId,
      callID: unansweredPart.callID,
      args: unansweredPart.state.input,
    }, { metadata: unansweredPart.state.metadata }),
    reader: (projectDir) => appendRecords(
      projectDir,
      sessionId,
      openCodeAnswerRecords({ parts: [unansweredPart], sessionId, now: NOW }),
    ),
  });
});

test('OpenCode capture keys stay exact for skipped answers and near-miss ids', () => {
  const parts = JSON.parse(readFileSync(
    join(HERE, '..', 'bin', 'fixtures', 'opencode-question-parts.json'),
    'utf8',
  ));
  const sessionId = 'opencode-exact-session';
  const [first, , third] = parts[0].state.metadata.answers;
  const partialPart = {
    ...parts[0],
    sessionID: sessionId,
    callID: 'opencode-exact-call',
    state: {
      ...parts[0].state,
      metadata: { ...parts[0].state.metadata, answers: [first, [], third] },
    },
  };
  const liveInput = (callID, sessionID) => ({
    tool: 'question',
    sessionID,
    callID,
    args: partialPart.state.input,
  });
  const liveOutput = { metadata: { answers: partialPart.state.metadata.answers } };
  const readerRecords = () => openCodeAnswerRecords({ parts: [partialPart], sessionId, now: NOW });

  // One skipped question in a multi-question call leaves the others' keys intact.
  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [
      toolSourceKey('opencode', sessionId, partialPart.callID, 0),
      toolSourceKey('opencode', sessionId, partialPart.callID, 2),
    ],
    live: (projectDir) => runOpenCodeHook(projectDir, liveInput(partialPart.callID, sessionId), liveOutput),
    reader: (projectDir) => appendRecords(projectDir, sessionId, readerRecords()),
  });

  // Keys match exactly, so ids that differ only in case or prefix are never merged.
  for (const nearMissCallId of [partialPart.callID.toUpperCase(), 'call_' + partialPart.callID]) {
    withProject((projectDir) => {
      appendRecords(projectDir, sessionId, readerRecords());
      runOpenCodeHook(projectDir, liveInput(nearMissCallId, sessionId), liveOutput);
      assert.equal(readQueue(projectDir, sessionId).length, 4, nearMissCallId);
    });
  }

  // A live session id that differs from the stored one writes its own queue.
  withProject((projectDir) => {
    appendRecords(projectDir, sessionId, readerRecords());
    runOpenCodeHook(projectDir, liveInput(partialPart.callID, 'opencode-other-session'), liveOutput);
    assert.equal(readQueue(projectDir, sessionId).length, 2);
    assert.equal(readQueue(projectDir, 'opencode-other-session').length, 2);
  });
});

test('Devin hook and answer reader deduplicate answered and skipped calls in either order', () => {
  const fixture = JSON.parse(readFileSync(
    join(HERE, '..', 'bin', 'fixtures', 'devin-transcript.json'),
    'utf8',
  ));
  const sessionId = 'devin-ordering-session';
  const sourceStep = fixture.steps[1];
  const answeredTranscript = { session_id: sessionId, steps: [sourceStep] };
  const answeredRecords = devinAnswerRecords({
    transcript: answeredTranscript,
    sessionId,
    now: NOW,
  });
  assert.equal(answeredRecords.length, 1);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: answeredRecords.map((record) => record.key),
    live: (projectDir) => runAdapter(
      DEVIN_ADAPTER,
      devinPayloadForTranscript(answeredTranscript, projectDir),
    ),
    reader: (projectDir) => appendRecords(
      projectDir,
      sessionId,
      devinAnswerRecords({ transcript: answeredTranscript, sessionId, now: NOW }),
    ),
  });

  const [sourceResult] = sourceStep.observation.results;
  const newline = sourceResult.content.indexOf('\n');
  const answerMap = JSON.parse(sourceResult.content.slice(newline + 1));
  const [question] = sourceStep.tool_calls[0].arguments.questions;
  const skippedContent = sourceResult.content.slice(0, newline + 1) + JSON.stringify({
    ...answerMap,
    [question.question]: { selected: [], skipped: true },
  });
  const skippedStep = {
    ...sourceStep,
    observation: {
      ...sourceStep.observation,
      results: [{ ...sourceResult, content: skippedContent }],
    },
  };
  const skippedTranscript = { session_id: sessionId, steps: [skippedStep] };
  assert.deepEqual(
    devinAnswerRecords({ transcript: skippedTranscript, sessionId, now: NOW }),
    [],
  );

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: [],
    live: (projectDir) => runAdapter(
      DEVIN_ADAPTER,
      devinPayloadForTranscript(skippedTranscript, projectDir),
    ),
    reader: (projectDir) => appendRecords(
      projectDir,
      sessionId,
      devinAnswerRecords({ transcript: skippedTranscript, sessionId, now: NOW }),
    ),
  });
});

test('Devin call ids carrying # still give one key the decision-record writer accepts', () => {
  // The writer's own source-key pattern, mirrored so a key it would reject fails here first.
  const WRITER_SOURCE_KEY = /^[A-Za-z0-9:._-]+$/u;
  const fixture = JSON.parse(readFileSync(
    join(HERE, '..', 'bin', 'fixtures', 'devin-transcript.json'),
    'utf8',
  ));
  const sessionId = 'clover-ceder';
  const realCallId = 'ask_user_question:0#94b3c0de11aa4f0e9b7d2c5e8f1a3b6d';
  const sourceStep = fixture.steps[1];
  const [sourceResult] = sourceStep.observation.results;
  const step = {
    ...sourceStep,
    tool_calls: [{ ...sourceStep.tool_calls[0], tool_call_id: realCallId }],
    observation: {
      ...sourceStep.observation,
      results: [{ ...sourceResult, source_call_id: realCallId }],
    },
  };
  const transcript = { session_id: sessionId, steps: [step] };
  const records = devinAnswerRecords({ transcript, sessionId, now: NOW });

  assert.equal(records.length, 1);
  assert.match(records[0].key, WRITER_SOURCE_KEY);
  assert.equal(records[0].key, `devin:${sessionId}:ask_user_question:0.94b3c0de11aa4f0e9b7d2c5e8f1a3b6d:0`);

  assertBothCaptureOrders({
    sessionId,
    expectedKeys: records.map((record) => record.key),
    live: (projectDir) => runAdapter(
      DEVIN_ADAPTER,
      devinPayloadForTranscript(transcript, projectDir),
    ),
    reader: (projectDir) => appendRecords(
      projectDir,
      sessionId,
      devinAnswerRecords({ transcript, sessionId, now: NOW }),
    ),
  });
});

test('chat source keys preserve four segments and accept an optional fifth segment', async () => {
  const { chatSourceKey } = await import('./capture-core.mjs');

  assert.equal(chatSourceKey('claude', 's', 'a', 'u'), 'claude:s:chat:a:u');
  assert.equal(chatSourceKey('claude', 's', 'a', 'u', 'pabc'), 'claude:s:chat:a:u:pabc');
});
