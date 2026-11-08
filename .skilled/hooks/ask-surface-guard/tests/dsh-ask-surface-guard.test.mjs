// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Ask Surface Guard Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { ERROR_POLICY, isHeadlessSession, registerAskSurfaceGuard } from '../dsh/ask-surface-guard.mjs';
import { cleanup, disabled, enabled, fakeAgent, interactive, leaf, noticeText, plainNotice, pluginHarness, tempDir } from '../../shared/tests/dsh-plugin-harness.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const menu = JSON.parse(readFileSync(path.join(here, '..', 'fixtures', 'prose-menu-lettered.json'), 'utf8')).lastMessage;

function assistant(turn, content) {
  return { type: 'assistant/message', data: { turn, message: { role: 'assistant', content } } };
}

function setup(t, { events, isEnabled = enabled, isHeadless = interactive } = {}) {
  const markerDir = tempDir('ask-surface-dsh-');
  t.after(() => cleanup(markerDir));
  const harness = pluginHarness();
  registerAskSurfaceGuard(harness.ctx, { isEnabled, isHeadless, createReprompt: plainNotice, markerDir });
  const { agent } = fakeAgent({ id: 'session-dsh', cwd: markerDir, events });
  const steered = [];
  agent.steer = (message) => { steered.push(message); };
  return { ...harness, agent, steered };
}

test('the guard fails open', () => {
  assert.equal(ERROR_POLICY, 'fail-open');
});

test('a turn closing on a prose menu is steered once, and a second stop in that turn is not', async (t) => {
  const { fire, agent, steered } = setup(t, { events: [assistant(3, [{ type: 'text', text: menu }])] });
  await fire('agent/turn-stopping', { agent, turn: 3 });
  await fire('agent/turn-stopping', { agent, turn: 3 });
  assert.equal(steered.length, 1);
  assert.match(noticeText(steered[0]), /ask_user_question/);
});

test('an ask_user_question call in the turn passes the menu', async (t) => {
  const events = [
    { type: 'tool/call', data: { turn: 3, name: 'ask_user_question' } },
    assistant(3, [{ type: 'text', text: menu }]),
  ];
  const { fire, agent, steered } = setup(t, { events });
  await fire('agent/turn-stopping', { agent, turn: 3 });
  assert.equal(steered.length, 0);
});

test('a headless leaf has no question tool, so it is never steered', async (t) => {
  const { fire, agent, steered } = setup(t, { events: [assistant(3, [{ type: 'text', text: menu }])], isHeadless: leaf });
  await fire('agent/turn-stopping', { agent, turn: 3 });
  assert.equal(steered.length, 0);
});

test('a headless profile, a fan-out leaf and a child session count as headless', () => {
  const never = () => false;
  assert.equal(isHeadlessSession(['dsh', '--profile', 'headless'], {}, never), true);
  assert.equal(isHeadlessSession(['dsh', '--profile=headless'], {}, never), true);
  assert.equal(isHeadlessSession(['dsh', 'web'], {}, leaf), true);
  assert.equal(isHeadlessSession(['dsh', 'web'], { AI_SESSION_CHILD: '1' }, never), true);
  assert.equal(isHeadlessSession(['dsh', 'web'], {}, never), false);
});

test('the kill switch registers no handler', (t) => {
  const { handlers } = setup(t, { isEnabled: disabled });
  assert.equal(handlers.size, 0);
});

test('a throwing session read is logged, not raised', async (t) => {
  const { fire, logs } = setup(t);
  const agent = { session: { snapshotEvents() { throw new Error('boom'); } }, steer() {} };
  await fire('agent/turn-stopping', { agent, turn: 1 });
  assert.equal(logs.length, 1);
});
