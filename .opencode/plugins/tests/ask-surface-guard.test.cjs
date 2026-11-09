// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Guard OpenCode Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

const PLUGIN_URL = pathToFileURL(path.join(__dirname, '..', 'ask-surface-guard.js')).href;
const MENU = JSON.parse(fs.readFileSync(path.resolve(
  __dirname,
  '../../../.skilled/hooks/ask-surface-guard/fixtures/prose-menu-lettered.json',
), 'utf8')).lastMessage;

function fakeClient(messages) {
  const prompts = [];
  return {
    prompts,
    session: {
      messages: async () => ({ data: messages }),
      promptAsync: async (options) => {
        prompts.push(options);
        messages.push({
          info: { role: 'user', id: `reprompt-${prompts.length}` },
          parts: [{ type: 'text', text: options.body.parts[0].text }],
        });
      },
    },
  };
}

async function hooksFor(t, client) {
  const markerDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ask-surface-opencode-'));
  t.after(() => fs.rmSync(markerDir, { recursive: true, force: true }));
  const { AskSurfaceGuardPlugin } = await import(PLUGIN_URL);
  return AskSurfaceGuardPlugin({ directory: markerDir, client }, { markerDir });
}

const idle = { event: { type: 'session.idle', properties: { sessionID: 'ses_ask' } } };
const userThenMenu = [
  { info: { role: 'user', id: 'm1' }, parts: [{ type: 'text', text: 'pick one' }] },
  { info: { role: 'assistant', id: 'm2' }, parts: [{ type: 'text', text: MENU }] },
];

test.beforeEach(() => {
  process.env.HOOK_FLAGS_CONFIG = '/nonexistent/hook-flags.env';
  delete process.env.SYSTEM_ASK_SURFACE_DISABLED;
  delete process.env.SYSTEM_HOOKS_DISABLED;
});

test('a turn ending in a prose menu is prompted once with the question tool', async (t) => {
  const client = fakeClient(userThenMenu);
  const hooks = await hooksFor(t, client);
  await hooks.event(idle);
  await hooks.event(idle);
  assert.equal(client.prompts.length, 1);
  assert.equal(client.prompts[0].path.id, 'ses_ask');
  assert.match(client.prompts[0].body.parts[0].text, /`question`/);
});

test('a send-back reprompt does not become a new operator turn', async (t) => {
  const messages = [...userThenMenu];
  const client = fakeClient(messages);
  const hooks = await hooksFor(t, client);
  await hooks.event(idle);

  messages.push({ info: { role: 'assistant', id: 'm3' }, parts: [{ type: 'text', text: MENU }] });
  await hooks.event(idle);
  assert.equal(client.prompts.length, 1);
});

test('a genuine new operator message may be sent back again', async (t) => {
  const messages = [...userThenMenu];
  const client = fakeClient(messages);
  const hooks = await hooksFor(t, client);
  await hooks.event(idle);
  messages.push(
    { info: { role: 'user', id: 'm4' }, parts: [{ type: 'text', text: 'new choice' }] },
    { info: { role: 'assistant', id: 'm5' }, parts: [{ type: 'text', text: MENU }] },
  );
  await hooks.event(idle);
  assert.equal(client.prompts.length, 2);
});

test('a turn that called the question tool is left alone', async (t) => {
  const client = fakeClient([
    userThenMenu[0],
    { info: { role: 'assistant', id: 'm2' }, parts: [{ type: 'tool', tool: 'question' }, { type: 'text', text: MENU }] },
  ]);
  const hooks = await hooksFor(t, client);
  await hooks.event(idle);
  assert.equal(client.prompts.length, 0);
});

test('the kill switch and a failing client both leave the session idle', async (t) => {
  process.env.SYSTEM_ASK_SURFACE_DISABLED = '1';
  const client = fakeClient(userThenMenu);
  await (await hooksFor(t, client)).event(idle);
  assert.equal(client.prompts.length, 0);

  delete process.env.SYSTEM_ASK_SURFACE_DISABLED;
  const broken = { session: { messages: async () => { throw new Error('down'); }, promptAsync: async () => { throw new Error('unreachable'); } } };
  await (await hooksFor(t, broken)).event(idle);
});
