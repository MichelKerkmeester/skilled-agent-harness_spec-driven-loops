// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// The fixtures follow the journal shapes the reader replays: a projection delta
// that appends the tool effect, and the action intent that reserved the call.
// Every queue case runs in an isolated project directory.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { appendRecords, readQueue, toolSourceKey } from '../lib/capture-core.mjs';
import { sweepVibeSession, vibeAnswerRecords } from './sweep-vibe.mjs';

const SESSION_ID = '08b32b11-0d8a-bb26-2385-86bb47a2ca7d';
const CALL_ID = 'chatcmpl-tool-6f1c2a77000040008000000000000001';
const ACTION_ID = '590e0b0b-f497-5dbe-820c-2f41336c4cde';
const TURN_ID = 'turn-b72dd1f0707d41156142737776cebcbd';
const NOW = '2026-11-14T12:00:00.000Z';

const QUESTION = {
  question: 'Which route should the cache take?',
  header: 'Route',
  options: [{ label: 'Direct', description: 'One hop.' }, { label: 'Via proxy', description: 'Two hops.' }],
  multiSelect: false,
};

function answered({ answer, questions = [QUESTION], extra = {} } = {}) {
  return {
    toolUseId: CALL_ID,
    toolInput: { questions },
    toolResponse: {
      answers: [{ question: questions[0].question, answer, ...extra }],
      cancelled: false,
    },
    sessionId: SESSION_ID,
    source: 'hook',
    now: NOW,
  };
}

function journalRecords() {
  return [
    {
      type: 'projection_delta',
      payload: {
        delta: [
          { op: 'set_envelope', state: { latestTurn: { id: TURN_ID } } },
          {
            op: 'append_entry',
            entry: {
              id: `effect-${ACTION_ID}`,
              type: 'effect',
              turnId: TURN_ID,
              detail: {
                kind: 'tool',
                toolName: 'ui.ask_user_question',
                input: { questions: [QUESTION] },
              },
              state: {
                status: 'completed',
                output: {
                  content: [],
                  structured_content: {
                    answers: [{ question: QUESTION.question, answer: 'Direct', isOther: false }],
                    cancelled: false,
                  },
                  type: 'success',
                },
                outputText: '',
              },
            },
          },
        ],
      },
    },
    {
      type: 'action_intent',
      payload: {
        request: {
          action_id: ACTION_ID,
          call_id: CALL_ID,
          turn_id: TURN_ID,
          type: 'provided_tool_call',
        },
      },
    },
  ];
}

function withSandbox(run) {
  const rootDir = mkdtempSync(join(tmpdir(), 'vibe-sweep-'));
  const projectDir = join(rootDir, 'project');
  mkdirSync(projectDir);
  try {
    return run({ rootDir, projectDir: realpathSync(projectDir) });
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

function writeSession(rootDir) {
  const sessionDir = join(rootDir, 'session');
  mkdirSync(join(sessionDir, 'journal'), { recursive: true });
  writeFileSync(
    join(sessionDir, 'meta.json'),
    JSON.stringify({ session_id: SESSION_ID, environment: { working_directory: '/fixture/project' } }),
  );
  writeFileSync(
    join(sessionDir, 'journal', '0000000000000001.jsonl'),
    journalRecords().map((record) => JSON.stringify(record)).join('\n') + '\n',
  );
  return sessionDir;
}

test('an answered question becomes one record keyed by its call id', () => {
  const records = vibeAnswerRecords(answered({ answer: 'Direct' }));
  assert.equal(records.length, 1);
  assert.equal(records[0].key, toolSourceKey('vibe', SESSION_ID, CALL_ID, 0));
  assert.equal(records[0].runtime, 'vibe');
  assert.equal(records[0].question, QUESTION.question);
  assert.equal(records[0].answer, 'Direct');
  assert.deepEqual(records[0].options, ['Direct', 'Via proxy']);
  assert.equal(records[0].source, 'hook');
});

test('an Other answer keeps the text the operator typed, under either flag spelling', () => {
  const typed = 'Straight to the database';
  const snake = vibeAnswerRecords(answered({ answer: typed, extra: { is_other: true } }));
  const camel = vibeAnswerRecords(answered({ answer: typed, extra: { isOther: true } }));
  assert.equal(snake.length, 1);
  assert.equal(snake[0].answer, typed);
  assert.equal(camel[0].key, snake[0].key);
  assert.equal(camel[0].answer, typed);
});

test('a multi-select answer keeps every label and the flag', () => {
  const multiSelect = { ...QUESTION, question: 'Which routes should the cache allow?', multiSelect: true };
  const [record] = vibeAnswerRecords(answered({
    answer: 'Direct, Via proxy',
    questions: [multiSelect],
  }));
  assert.equal(record.answer, 'Direct, Via proxy');
  assert.equal(record.multi_select, true);
});

test('a cancelled or unanswered question queues nothing', () => {
  assert.deepEqual(vibeAnswerRecords({
    ...answered({ answer: 'Direct' }),
    toolResponse: { answers: [], cancelled: true },
  }), []);
  assert.deepEqual(vibeAnswerRecords(answered({ answer: '' })), []);
});

test('the sweep writes the key the hook writes, once', () => {
  withSandbox(({ rootDir, projectDir }) => {
    const transcriptPath = writeSession(rootDir);

    const first = sweepVibeSession({ projectDir, transcriptPath, now: NOW });
    assert.equal(first.session_id, SESSION_ID);
    assert.equal(first.recovered, 1);
    assert.equal(first.pending.length, 1);
    assert.equal(readQueue(projectDir, SESSION_ID)[0].key, toolSourceKey('vibe', SESSION_ID, CALL_ID, 0));

    const second = sweepVibeSession({ projectDir, transcriptPath, now: NOW });
    assert.equal(second.recovered, 0);
    assert.equal(readQueue(projectDir, SESSION_ID).length, 1);

    // The live hook already queued this answer, so the sweep adds nothing.
    const hookProject = join(rootDir, 'hook-project');
    mkdirSync(hookProject);
    appendRecords(hookProject, SESSION_ID, vibeAnswerRecords(answered({ answer: 'Direct' })));
    const afterHook = sweepVibeSession({ projectDir: hookProject, transcriptPath, now: NOW });
    assert.equal(afterHook.recovered, 0);
    assert.equal(readQueue(hookProject, SESSION_ID).length, 1);
  });
});

test('the CLI finds a session under the unified folder', () => {
  withSandbox(({ rootDir, projectDir }) => {
    const sessionsRoot = join(rootDir, 'sessions');
    const sessionDir = join(sessionsRoot, 'unified', SESSION_ID);
    mkdirSync(join(sessionDir, 'journal'), { recursive: true });
    writeFileSync(
      join(sessionDir, 'meta.json'),
      JSON.stringify({ session_id: SESSION_ID, environment: { working_directory: projectDir } }),
    );
    writeFileSync(
      join(sessionDir, 'journal', '0000000000000001.jsonl'),
      journalRecords().map((record) => JSON.stringify(record)).join('\n') + '\n',
    );
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('./sweep-vibe.mjs', import.meta.url))], {
      cwd: projectDir,
      encoding: 'utf8',
      env: { ...process.env, HOME: rootDir, MISTRAL_VIBE_SESSION_ROOT: sessionsRoot },
      timeout: 20000,
    });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).session_id, SESSION_ID);
  });
});

test('the session whose lease a calling process holds wins over a newer one', () => {
  withSandbox(({ rootDir, projectDir }) => {
    const sessionsRoot = join(rootDir, 'sessions');
    for (const id of [SESSION_ID, 'newer-session']) {
      const sessionDir = join(sessionsRoot, 'unified', id);
      mkdirSync(join(sessionDir, 'journal'), { recursive: true });
      writeFileSync(
        join(sessionDir, 'meta.json'),
        JSON.stringify({ session_id: id, environment: { working_directory: projectDir } }),
      );
      writeFileSync(
        join(sessionDir, 'journal', '0000000000000001.jsonl'),
        journalRecords().map((record) => JSON.stringify(record)).join('\n') + '\n',
      );
    }
    const older = new Date('2026-11-01T00:00:00Z');
    utimesSync(join(sessionsRoot, 'unified', SESSION_ID, 'journal'), older, older);
    mkdirSync(join(sessionsRoot, 'active'), { recursive: true });
    writeFileSync(
      join(sessionsRoot, 'active', `${SESSION_ID}.lock.json`),
      JSON.stringify({ lease_version: 1, session_id: SESSION_ID, process_id: process.pid }),
    );
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('./sweep-vibe.mjs', import.meta.url))], {
      cwd: projectDir,
      encoding: 'utf8',
      env: { ...process.env, HOME: rootDir, MISTRAL_VIBE_SESSION_ROOT: sessionsRoot },
      timeout: 20000,
    });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).session, join(sessionsRoot, 'unified', SESSION_ID));
  });
});
