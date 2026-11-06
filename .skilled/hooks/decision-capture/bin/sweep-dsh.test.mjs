// ───────────────────────────────────────────────────────────────────
// MODULE: DeepSeek Harness Session Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// The session events follow the harness's declared `tool/call` and `tool/result`
// shapes and the `ask_user_question` answer JSON. Every CLI case uses an isolated
// project, HOME and DSH_HOME.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { zstdCompressSync } from 'node:zlib';

import { queueFile, readQueue, toolSourceKey } from '../lib/capture-core.mjs';
import { decodeSessionLog, dshAnswerRecords, recoveredRecords } from './sweep-dsh.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-dsh.mjs');
const SESSION_ID = 'session-5f1c2a77-0000-4000-8000-000000000001';
const NOW = '2026-11-06T12:00:00.000Z';
const CLI_TIMEOUT_MS = 20000;

const QUESTION = {
  id: 'engine',
  question: 'Which storage engine should the cache use?',
  header: 'Storage',
  options: [{ label: 'SQLite (Recommended)', description: 'One file.' }, { label: 'Postgres', description: 'A server.' }],
};

function sessionEvents(cwd, { answer = { answers: [{ id: 'engine', selected: ['SQLite (Recommended)'] }] }, isError = false } = {}) {
  const callArguments = JSON.stringify({ questions: [QUESTION] });
  return [
    { type: 'session', version: 4, id: SESSION_ID, createdAt: 1, cwd, isSeeded: false, delegationDepth: 0 },
    { type: 'user/message', seq: 1, data: { role: 'user', id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Add a cache.' }] } },
    { type: 'assistant/message', seq: 2, data: { turn: 1, step: 1, message: { role: 'assistant', id: 'a1', content: [{ type: 'tool-call', id: 'call-ask-1', name: 'ask_user_question', arguments: callArguments }] } } },
    { type: 'tool/call', seq: 3, data: { turn: 1, step: 1, callId: 'call-ask-1', name: 'ask_user_question', arguments: callArguments } },
    {
      type: 'tool/result',
      seq: 4,
      data: {
        turn: 1,
        step: 1,
        message: { role: 'tool', toolCallId: 'call-ask-1', isError, content: [{ type: 'text', text: JSON.stringify(answer) }] },
      },
    },
    { type: 'assistant/message', seq: 5, data: { turn: 1, step: 2, message: { role: 'assistant', id: 'a2', content: [{ type: 'text', text: 'Should the cache expire entries after one hour?' }] } } },
    { type: 'user/message', seq: 6, data: { role: 'user', id: 'u2', source: { kind: 'user' }, content: [{ type: 'text', text: 'Yes, one hour.' }] } },
    { type: 'user/message', seq: 7, data: { role: 'user', id: 'u3', source: { kind: 'runtime-context' }, content: [{ type: 'text', text: 'Current runtime context.' }] } },
  ];
}

function jsonl(events) {
  return events.map((event) => JSON.stringify(event)).join('\n') + '\n';
}

// The harness appends one Zstandard frame per batch, so a real log is several frames back to back.
function framedLog(events) {
  const text = jsonl(events);
  const cut = text.indexOf('\n', Math.floor(text.length / 2)) + 1;
  return Buffer.concat([zstdCompressSync(Buffer.from(text.slice(0, cut))), zstdCompressSync(Buffer.from(text.slice(cut)))]);
}

function withSandbox(run) {
  const rootDir = mkdtempSync(join(tmpdir(), 'dsh-sweep-'));
  const projectDir = join(rootDir, 'project');
  const homeDir = join(rootDir, 'home');
  const dshHome = join(rootDir, 'dsh-home');
  mkdirSync(projectDir);
  mkdirSync(homeDir);
  mkdirSync(dshHome);
  try {
    return run({ projectDir: realpathSync(projectDir), homeDir, dshHome });
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
}

function writeSession(dshHome, cwd, content, fileName = 'session.v4.jsonl.zstd', sessionDir = SESSION_ID) {
  const projectKey = '--' + cwd.replace(/^\/+/, '').replaceAll('/', '-') + '--';
  const directory = join(dshHome, 'sessions', projectKey, sessionDir);
  mkdirSync(directory, { recursive: true });
  const filePath = join(directory, fileName);
  writeFileSync(filePath, content);
  return filePath;
}

function runSweep(projectDir, homeDir, dshHome, args = []) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    env: { ...process.env, HOME: homeDir, DSH_HOME: dshHome },
    timeout: CLI_TIMEOUT_MS,
  });
}

test('a multi-frame Zstandard log decodes to every line, and a skippable frame is ignored', () => {
  const events = sessionEvents('/fixture/project');
  const skippable = Buffer.alloc(12);
  skippable.writeUInt32LE(0x184d2a50, 0);
  skippable.writeUInt32LE(4, 4);
  const decoded = decodeSessionLog(Buffer.concat([framedLog(events), skippable]), 'session.v4.jsonl.zstd');
  assert.equal(decoded, jsonl(events));
  assert.equal(decodeSessionLog(Buffer.from(jsonl(events)), 'session.v4.jsonl'), jsonl(events));
});

test('an answered question becomes one record keyed by its call id', () => {
  const records = recoveredRecords(sessionEvents('/fixture/project'), SESSION_ID, NOW);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, toolSourceKey('dsh', SESSION_ID, 'call-ask-1', 0));
  assert.equal(records[0].question, QUESTION.question);
  assert.equal(records[0].answer, 'SQLite (Recommended)');
  assert.deepEqual(records[0].options, ['SQLite (Recommended)', 'Postgres']);
  assert.equal(records[0].source, 'transcript');
});

test('a failed or pending question queues nothing', () => {
  assert.deepEqual(recoveredRecords(sessionEvents('/p', { isError: true }), SESSION_ID, NOW), []);
  assert.deepEqual(recoveredRecords(sessionEvents('/p', { answer: { pending: true, callId: 'x' } }), SESSION_ID, NOW), []);
});

test('a multi-select answer keeps every label and the flag the tool spells as multi_select', () => {
  const [record] = dshAnswerRecords({
    callId: 'call-multi',
    args: JSON.stringify({ questions: [{ ...QUESTION, multi_select: true }] }),
    value: JSON.stringify({ answers: [{ id: 'engine', selected: ['SQLite (Recommended)', 'Postgres'], custom: 'DuckDB' }] }),
    sessionId: SESSION_ID,
    source: 'transcript',
    now: NOW,
  });
  assert.equal(record.answer, 'SQLite (Recommended), Postgres, DuckDB');
  assert.equal(record.multi_select, true);
});

test('a late reply to a timed question is recovered under the call it answers', () => {
  const events = sessionEvents('/p', { answer: { pending: true, callId: 'call-ask-1', message: 'Still waiting.' } });
  const reply = {
    kind: 'answer_to_pending_question',
    tool: 'ask_user_question',
    callId: 'call-ask-1',
    questions: [QUESTION],
    answers: [{ id: 'engine', selected: ['Postgres'] }],
  };
  events.push({
    type: 'user/message',
    seq: 8,
    data: {
      role: 'user',
      id: 'u4',
      source: { kind: 'user-question-reply', callId: 'call-ask-1', outcome: 'answered' },
      content: [{ type: 'text', text: JSON.stringify(reply) }],
    },
  });
  const records = recoveredRecords(events, SESSION_ID, NOW);
  assert.equal(records.length, 1);
  assert.equal(records[0].key, toolSourceKey('dsh', SESSION_ID, 'call-ask-1', 0));
  assert.equal(records[0].answer, 'Postgres');
});

test('the CLI finds the newest session of this project and queues its answer once', () => {
  withSandbox(({ projectDir, homeDir, dshHome }) => {
    writeSession(dshHome, projectDir, framedLog(sessionEvents(projectDir)));
    const first = runSweep(projectDir, homeDir, dshHome);
    assert.equal(first.status, 0, first.stderr);
    const summary = JSON.parse(first.stdout);
    assert.equal(summary.session_id, SESSION_ID);
    assert.equal(summary.recovered, 1);
    assert.equal(summary.pending.length, 1);
    assert.equal(summary.chat_candidates.length, 1);
    assert.equal(readQueue(projectDir, SESSION_ID).length, 1);

    const second = runSweep(projectDir, homeDir, dshHome);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(JSON.parse(second.stdout).recovered, 0);
    assert.equal(readQueue(projectDir, SESSION_ID).length, 1);
  });
});

test('a session recorded for another project is skipped', () => {
  withSandbox(({ projectDir, homeDir, dshHome }) => {
    writeSession(dshHome, projectDir, framedLog(sessionEvents('/somewhere/else')));
    const result = runSweep(projectDir, homeDir, dshHome);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.throws(() => readFileSync(queueFile(projectDir, SESSION_ID)));
  });
});

test('an explicit raw session log is read, and a missing one reports an error', () => {
  withSandbox(({ projectDir, homeDir, dshHome }) => {
    const raw = writeSession(dshHome, projectDir, jsonl(sessionEvents(projectDir)), 'session.v4.jsonl');
    const result = runSweep(projectDir, homeDir, dshHome, ['--session', raw]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).recovered, 1);

    const missing = runSweep(projectDir, homeDir, dshHome, ['--session', join(dshHome, 'missing.jsonl')]);
    assert.equal(missing.status, 1);
    assert.match(JSON.parse(missing.stdout).error, /missing\.jsonl|ENOENT/);
  });
});
