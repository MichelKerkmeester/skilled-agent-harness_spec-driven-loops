// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Tests - Decision Capture (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers live and late-reply answer capture under the key a sweep would use,
// the idle save reminder, and the fail-open throw policy and kill switch.

import assert from 'node:assert/strict';
import test from 'node:test';

import { dshAnswerRecords } from '../../../../.skilled/hooks/decision-capture/bin/sweep-dsh.mjs';

import { ERROR_POLICY, registerDecisionCapture } from '../adapters/decision-capture.mjs';
import { disabled, enabled, fakeAgent, noticeText, plainNotice, pluginHarness } from './harness.mjs';

const QUESTIONS = [{
  id: 'engine',
  question: 'Which storage engine should the cache use?',
  header: 'Storage',
  options: [{ label: 'SQLite (Recommended)', description: 'One file.' }, { label: 'Postgres', description: 'A server.' }],
}];

function askCall(agent, callId = 'call-ask-1') {
  return { name: 'ask_user_question', callId, arguments: { questions: QUESTIONS }, agent };
}

function harnessWithCore(overrides = {}) {
  const appended = [];
  const core = {
    appendRecords(projectDir, sessionId, records) {
      appended.push({ projectDir, sessionId, records });
      return { appended: records.length };
    },
    takeNudge: () => 0,
    ...overrides,
  };
  const harness = pluginHarness();
  registerDecisionCapture(harness.ctx, { core, isEnabled: enabled, createNotice: plainNotice });
  return { ...harness, appended };
}

test('decision capture queues an answered question under the key a sweep would use', async () => {
  const { fire, appended } = harnessWithCore();
  const { agent } = fakeAgent({ id: 'session-ask', cwd: '/fixture/workspace' });
  const value = { answers: [{ id: 'engine', selected: ['SQLite (Recommended)'] }] };
  await fire('tools/result', askCall(agent), { isError: false, value, content: [] });

  assert.equal(appended.length, 1);
  assert.equal(appended[0].projectDir, '/fixture/workspace');
  assert.equal(appended[0].sessionId, 'session-ask');
  const [record] = appended[0].records;
  assert.equal(record.question, 'Which storage engine should the cache use?');
  assert.equal(record.answer, 'SQLite (Recommended)');
  assert.equal(record.runtime, 'dsh');
  assert.equal(record.source, 'hook');

  const swept = dshAnswerRecords({
    callId: 'call-ask-1', args: { questions: QUESTIONS }, value, sessionId: 'session-ask', source: 'transcript',
  });
  assert.equal(swept[0].key, record.key);
});

test('decision capture reads the answer from the result text when no value is attached', async () => {
  const { fire, appended } = harnessWithCore();
  const { agent } = fakeAgent();
  const text = JSON.stringify({ answers: [{ id: 'engine', selected: [], custom: 'DuckDB' }] });
  await fire('tools/result', askCall(agent), { isError: false, content: [{ type: 'text', text }] });
  assert.equal(appended[0].records[0].answer, 'DuckDB');
});

test('decision capture skips a failed, pending or unrelated call', async () => {
  const { fire, appended } = harnessWithCore();
  const { agent } = fakeAgent();
  await fire('tools/result', askCall(agent), { isError: true, content: [] });
  await fire('tools/result', askCall(agent), { isError: false, value: { pending: true, callId: 'p1' }, content: [] });
  await fire('tools/result', { name: 'bash', callId: 'c', arguments: { command: 'ls' }, agent }, { isError: false, content: [] });
  assert.deepEqual(appended, []);
});

test('decision capture queues a late reply to a timed question from the session feed', async () => {
  const { fire, appended } = harnessWithCore();
  const { agent } = fakeAgent({ id: 'session-late', cwd: '/fixture/workspace' });
  const reply = {
    kind: 'answer_to_pending_question',
    tool: 'ask_user_question',
    callId: 'call-ask-9',
    questions: QUESTIONS,
    answers: [{ id: 'engine', selected: ['Postgres'] }],
  };
  await fire('session/event', agent.session, {
    type: 'user/message',
    data: {
      role: 'user',
      id: 'u9',
      source: { kind: 'user-question-reply', callId: 'call-ask-9', outcome: 'answered' },
      content: [{ type: 'text', text: JSON.stringify(reply) }],
    },
  });
  await fire('session/event', agent.session, { type: 'user/message', data: { role: 'user', source: { kind: 'user' }, content: [] } });

  assert.equal(appended.length, 1);
  assert.equal(appended[0].sessionId, 'session-late');
  assert.equal(appended[0].records[0].answer, 'Postgres');
  assert.equal(appended[0].records[0].source, 'hook');
});

test('decision capture reminds the operator through the next prompt once answers wait', async () => {
  let pending = 2;
  const { fire } = harnessWithCore({ takeNudge: () => { const count = pending; pending = 0; return count; } });
  const { agent, injected } = fakeAgent();
  await fire('agent/status', { agent, status: 'running' });
  assert.deepEqual(injected, []);
  await fire('agent/status', { agent, status: 'idle' });
  assert.match(noticeText(injected[0]), /2 operator answer\(s\).*\/speckit:save/s);
  await fire('agent/status', { agent, status: 'idle' });
  assert.equal(injected.length, 1);
});

test('throw policy: decision capture fails open and logs; its kill switch removes it', async () => {
  assert.equal(ERROR_POLICY, 'fail-open');
  const { fire, logs } = harnessWithCore({ appendRecords() { throw new Error('fixture failure'); } });
  const { agent } = fakeAgent();
  await fire('tools/result', askCall(agent), {
    isError: false, value: { answers: [{ id: 'engine', selected: ['Postgres'] }] }, content: [],
  });
  assert.equal(logs.length, 1);

  const off = pluginHarness();
  registerDecisionCapture(off.ctx, { isEnabled: disabled });
  assert.equal(off.handlers.size, 0);
});
