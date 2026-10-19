// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Session Relaunch Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const PLUGIN_PATH = path.join(REPO_ROOT, '.skilled', 'plugins', 'session-relaunch.js');
const CORE_PATH = path.join(
  REPO_ROOT,
  '.skilled',
  'hooks',
  'session-relaunch',
  'lib',
  'relaunch-core.cjs',
);
const OPENCODE_CAPTURE = require(
  '../../hooks/session-relaunch/tests/fixtures/opencode-assistant-message-updated.json',
);
const core = require(CORE_PATH);
const nudge = require('../../hooks/session-relaunch/lib/nudge.cjs');
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
  'SYSTEM_SPEC_FOLDER',
  'XDG_RUNTIME_DIR',
  'HOOK_FLAGS_CONFIG',
];

function setupEnv(t) {
  const previous = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-opencode-'));
  process.env.XDG_RUNTIME_DIR = root;
  process.env.HOOK_FLAGS_CONFIG = path.join(root, 'hook-flags.env');
  process.env.SESSION_RELAUNCH_THRESHOLD = '0.8';
  // The note root is the repo root, never the session directory, so each test points
  // the repo root at its own sandbox to keep note files out of the real state dir.
  process.env.SESSION_RELAUNCH_REPO_ROOT = root;
  delete process.env.SYSTEM_SESSION_RELAUNCH_DISABLED;
  delete process.env.SYSTEM_HOOKS_DISABLED;
  delete process.env.MK_HOOKS_DISABLED;
  delete process.env.SESSION_RELAUNCH_WINDOW_TOKENS;
  delete process.env.SKILLED_LOOP_ID;
  delete process.env.SKILLED_LOOP_HOPS;
  delete process.env.SESSION_RELAUNCH_MAX_HOPS;
  delete process.env.SYSTEM_SPEC_FOLDER;
  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true });
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  return root;
}

function stubSpawn(t) {
  const calls = [];
  const children = [];
  const unrefCalls = [];
  t.mock.method(childProcess, 'spawn', (...args) => {
    calls.push(args);
    const child = new EventEmitter();
    child.unref = () => {
      unrefCalls.push(args);
      return child;
    };
    children.push(child);
    return child;
  });
  return { calls, children, unrefCalls };
}

function setBunRuntime(t) {
  const descriptor = Object.getOwnPropertyDescriptor(process.versions, 'bun');
  Object.defineProperty(process.versions, 'bun', {
    value: '1.3.14',
    configurable: true,
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(process.versions, 'bun', descriptor);
    else delete process.versions.bun;
  });
}

async function loadPlugin(ctx) {
  const moduleUrl = `${pathToFileURL(PLUGIN_PATH).href}?test=${Date.now()}-${Math.random()}`;
  return (await import(moduleUrl)).default(ctx);
}

function transform(hooks, sessionID, model = { limit: { context: 200000 } }) {
  const output = { system: [] };
  return Promise.resolve(
    hooks['experimental.chat.system.transform']({ sessionID, model }, output),
  ).then(() => output.system);
}

function assistantEvent(sessionID, id, input) {
  return { event: {
    type: 'message.updated',
    properties: {
      sessionID,
      info: { id, role: 'assistant', time: { completed: 1 }, tokens: { input } },
    },
  } };
}

function notePathFromNudge(text) {
  const match = text.match(/Write the handoff note at '([^']+)'/);
  assert.ok(match);
  return match[1];
}

function writeHandoffNote(notePath, sessionID) {
  fs.mkdirSync(path.dirname(notePath), { recursive: true });
  fs.writeFileSync(notePath, `---\nsession_id: ${sessionID}\n---\n`);
}

async function startLoopNudge(t, sessionID) {
  const root = setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const loopId = 'opencode-loop-nudge-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  const hooks = await loadPlugin({ directory: root });

  await hooks.event(assistantEvent(sessionID, 'assistant-at-threshold', 90));
  const active = await transform(hooks, sessionID);
  assert.equal(active.length, 1);
  return { root, loopId, hooks, active, notePath: notePathFromNudge(active[0]) };
}

test('kill switch stops an active OpenCode nudge', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-active-kill-switch-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-kill-switch', 90));
  assert.equal((await transform(hooks, sessionID)).length, 1);

  process.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('hook flags written after plugin load silence the next event', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  fs.writeFileSync(path.join(root, 'hook-flags.env'),
    'SYSTEM_SESSION_RELAUNCH_DISABLED=1\n');
  const sessionID = 'ses-live-flags-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: {
      sessionID,
      info: {
        id: 'live-flags-assistant',
        role: 'assistant',
        time: { completed: 1 },
        tokens: { input: 90 },
      },
    },
  } });
  assert.deepEqual(await transform(hooks, sessionID, { limit: { context: 100 } }), []);
});

test('active nudge appears on three consecutive system transforms', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '21805';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: OPENCODE_CAPTURE });
  const sessionID = OPENCODE_CAPTURE.properties.sessionID;
  const first = await transform(hooks, sessionID);
  const second = await transform(hooks, sessionID);
  const third = await transform(hooks, sessionID);

  assert.equal(first.length, 1);
  assert.match(first[0], /session-relaunch/);
  assert.deepEqual(second, first);
  assert.deepEqual(third, first);
  assert.equal(nudge.readState(sessionID, process.env), 1);
});

test('a five-point re-nudge replaces active text and keeps its note path', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '200';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-renudge-session-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-at-80', 160));
  const first = await transform(hooks, sessionID);
  await hooks.event(assistantEvent(sessionID, 'assistant-at-85', 170));
  const replacement = await transform(hooks, sessionID);
  const later = await transform(hooks, sessionID);

  assert.match(first[0], /80% full/);
  assert.match(replacement[0], /85% full/);
  assert.notEqual(replacement[0], first[0]);
  assert.equal(notePathFromNudge(replacement[0]), notePathFromNudge(first[0]));
  assert.deepEqual(later, replacement);
  assert.equal(nudge.readState(sessionID, process.env), 2);
});

test('OpenCode nudge includes the save step when SYSTEM_SPEC_FOLDER is unset', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-unset-spec-folder-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-unset-spec-folder', 90));
  const active = await transform(hooks, sessionID);

  assert.equal(active.length, 1);
  assert.match(
    active[0],
    /\n2\. When a spec packet is bound to this session, save its continuity first/,
  );
  assert.ok(
    active[0].includes(
      'node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/'
        + "generate-context.js --stdin --full-auto '<spec-folder>'",
    ),
  );
  assert.equal(active[0].includes('/speckit:save'), false);
});

test('outside a loop, active nudge stops after its planned note file appears', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: root });
  const sessionID = 'ses-note-created-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-before-note', 90));
  const first = await transform(hooks, sessionID);
  assert.equal(first.length, 1);
  assert.deepEqual(await transform(hooks, sessionID), first);

  const notePath = notePathFromNudge(first[0]);
  fs.mkdirSync(path.dirname(notePath), { recursive: true });
  fs.writeFileSync(notePath, 'status: open\n');
  assert.deepEqual(await transform(hooks, sessionID), []);

  process.env.SKILLED_LOOP_ID = 'invalid/loop-id';
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('loop nudge continues after its handoff file exists without a relaunch record', async (t) => {
  const sessionID = 'ses-loop-no-record-0001';
  const { hooks, active, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);

  assert.deepEqual(await transform(hooks, sessionID), active);
});

test('loop nudge stops for matching pending and armed records', async (t) => {
  const sessionID = 'ses-loop-matching-record-0001';
  const { root, loopId, hooks, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);
  const pending = core.preparePending({
    loopId,
    handoffPath: notePath,
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: root,
    env: process.env,
  });

  assert.equal(pending.status, 'pending');
  assert.deepEqual(await transform(hooks, sessionID), []);
  assert.equal(core.arm({ loopId, cwd: root, env: process.env }).status, 'armed');
  assert.deepEqual(await transform(hooks, sessionID), []);
});
test('a usage above threshold queues no nudge while this session has a prepared handoff', async (t) => {
  const root = setupEnv(t);
  const sessionID = 'ses-loop-prepared-0001';
  const loopId = 'opencode-loop-prepared-0001';
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  process.env.SKILLED_LOOP_ID = loopId;
  const hooks = await loadPlugin({ directory: root });
  core.preparePending({
    loopId,
    handoffPath: path.join(root, 'handoff.md'),
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: root,
    env: process.env,
  });

  await hooks.event(assistantEvent(sessionID, 'assistant-at-threshold', 90));

  assert.deepEqual(await transform(hooks, sessionID), []);
  // The recorded level proves nothing was queued, not just that delivery was
  // withheld: a queued nudge advances the level even when the transform hides it.
  assert.equal(nudge.readState(sessionID, process.env), 0);
});

test('a hop count at the cap queues no nudge', async (t) => {
  const root = setupEnv(t);
  const sessionID = 'ses-loop-hop-cap-0001';
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  process.env.SKILLED_LOOP_ID = 'opencode-loop-hop-cap-0001';
  process.env.SKILLED_LOOP_HOPS = '1';
  process.env.SESSION_RELAUNCH_MAX_HOPS = '1';
  const hooks = await loadPlugin({ directory: root });

  await hooks.event(assistantEvent(sessionID, 'assistant-at-threshold', 90));

  assert.deepEqual(await transform(hooks, sessionID), []);
  // The recorded level proves nothing was queued, not just that delivery was
  // withheld: a queued nudge advances the level even when the transform hides it.
  assert.equal(nudge.readState(sessionID, process.env), 0);
});

test('a stale armed record no longer suppresses the loop nudge', async (t) => {
  const sessionID = 'ses-loop-stale-armed-0001';
  const { root, loopId, hooks, active, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);
  core.preparePending({
    loopId,
    handoffPath: notePath,
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: root,
    env: process.env,
  });
  const armedAt = new Date(Date.now() - 11 * 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: root, env: process.env, now: armedAt }).status, 'armed');

  process.env.SESSION_RELAUNCH_MAX_AGE_MIN = '60';
  assert.deepEqual(await transform(hooks, sessionID), []);

  delete process.env.SESSION_RELAUNCH_MAX_AGE_MIN;
  assert.deepEqual(await transform(hooks, sessionID), active);
});

test('a zero max age makes any armed record stale for the nudge check', async (t) => {
  const sessionID = 'ses-loop-zero-max-age-0001';
  const { root, loopId, hooks, active, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);
  core.preparePending({
    loopId,
    handoffPath: notePath,
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: root,
    env: process.env,
  });
  const armedAt = new Date(Date.now() - 60 * 1000);
  assert.equal(core.arm({ loopId, cwd: root, env: process.env, now: armedAt }).status, 'armed');

  process.env.SESSION_RELAUNCH_MAX_AGE_MIN = '0';
  assert.deepEqual(await transform(hooks, sessionID), active);
});

test('loop nudge continues for a record owned by another session', async (t) => {
  const sessionID = 'ses-loop-other-record-0001';
  const otherSessionID = 'ses-loop-record-owner-0001';
  const { root, loopId, hooks, active, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);
  core.preparePending({
    loopId,
    handoffPath: notePath,
    sessionId: otherSessionID,
    runtime: 'opencode',
    cwd: root,
    env: process.env,
  });

  assert.deepEqual(await transform(hooks, sessionID), active);
});

test('kill switch suppresses an in-loop nudge before handoff preparation', async (t) => {
  const sessionID = 'ses-loop-kill-switch-0001';
  const { hooks, notePath } = await startLoopNudge(t, sessionID);
  writeHandoffNote(notePath, sessionID);

  process.env.SYSTEM_SESSION_RELAUNCH_DISABLED = '1';
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('an active nudge is not injected into another session', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-nudge-owner-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-owner', 90));
  assert.equal((await transform(hooks, sessionID)).length, 1);
  assert.deepEqual(await transform(hooks, 'ses-no-nudge-0001'), []);
});

test('a restarted plugin repeats its persisted nudge at the threshold', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const sessionID = 'ses-restarted-nudge-0001';
  nudge.writeState(sessionID, 1, process.env);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event(assistantEvent(sessionID, 'assistant-at-repeat-threshold', 80));
  const output = await transform(hooks, sessionID);

  assert.equal(output.length, 1);
  assert.match(output[0], /80% full/);
  assert.equal(nudge.readState(sessionID, process.env), 1);
});

test('a restarted nudge reuses a matching handoff note', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const sessionID = 'ses-reused-handoff-0001';
  nudge.writeState(sessionID, 1, process.env);
  const handoffsDir = path.join(
    root,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
  );
  fs.mkdirSync(handoffsDir, { recursive: true });
  const suffix = `${sessionID.slice(0, 8)}.md`;
  const wrongPath = path.join(handoffsDir, `20261016T000000Z-${suffix}`);
  const donePath = path.join(handoffsDir, `20261016T120000Z-${suffix}`);
  const notePath = path.join(handoffsDir, `20261017T000000Z-${suffix}`);
  fs.writeFileSync(
    wrongPath,
    '---\nsession_id: ses-other-handoff-0001\nstatus: open\n---\n',
  );
  fs.writeFileSync(donePath, `---\nsession_id: ${sessionID}\nstatus: done\n---\n`);
  fs.writeFileSync(
    notePath,
    `---\n  session_id :  ${sessionID}  \nstatus: open\n---\n`,
  );
  const hooks = await loadPlugin({ directory: root });
  const existsSync = fs.existsSync.bind(fs);
  const checkedPaths = [];
  t.mock.method(fs, 'existsSync', (filePath, ...args) => {
    checkedPaths.push(filePath);
    return existsSync(filePath, ...args);
  });

  await hooks.event(assistantEvent(sessionID, 'assistant-after-restart', 90));
  const output = await transform(hooks, sessionID);

  assert.deepEqual(output, []);
  assert.equal(checkedPaths[checkedPaths.length - 1], notePath);
  assert.equal(nudge.readState(sessionID, process.env), 1);
});

test('a restarted nudge ignores a closed handoff note and plans a fresh path', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const sessionID = 'ses-closed-handoff-0001';
  nudge.writeState(sessionID, 1, process.env);
  const handoffsDir = path.join(
    root,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
  );
  fs.mkdirSync(handoffsDir, { recursive: true });
  const donePath = path.join(
    handoffsDir,
    `20261016T000000Z-${sessionID.slice(0, 8)}.md`,
  );
  fs.writeFileSync(donePath, `---\nsession_id: ${sessionID}\nstatus: done\n---\n`);
  const hooks = await loadPlugin({ directory: root });

  await hooks.event(assistantEvent(sessionID, 'assistant-closed-note', 90));
  const output = await transform(hooks, sessionID);

  assert.equal(output.length, 1);
  assert.notEqual(notePathFromNudge(output[0]), donePath);
});

test('SESSION_RELAUNCH_WINDOW_TOKENS overrides the model window', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '200';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-window-override-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: {
      sessionID,
      info: { id: 'msg-window-override', role: 'assistant', time: { completed: 1 },
        tokens: { input: 150 } },
    },
  } });

  assert.deepEqual(await transform(hooks, sessionID, { limit: { context: 100 } }), []);
});

test('seed stays pending across later text parts', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-session-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-user', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-user',
        type: 'text',
        text: '[session-relaunch] claim and continue handoff /workspace/note.md',
      },
    },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: { messageID: 'msg-seed-user', type: 'text', text: 'more' },
    },
  } });
  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-user', role: 'user' } },
  } });

  const first = await transform(hooks, sessionID);
  const second = await transform(hooks, sessionID);
  assert.equal(first.length, 1);
  assert.match(first[0], /claim/);
  assert.ok(first[0].includes("claim '/workspace/note.md'"));
  assert.deepEqual(second, first);
});

test('OpenCode uses the carried spec folder and keeps the suffixed note path intact', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SYSTEM_SPEC_FOLDER = 'specs/from-environment';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-spec-folder-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-spec-folder', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-spec-folder',
        type: 'text',
        text: '[session-relaunch] claim and continue handoff /workspace/note.md'
          + ' | Spec folder: specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters'
          + ' (carried from the handoff; Gate 3 answered in the sending session)',
      },
    },
  } });
  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-spec-folder', role: 'user' } },
  } });

  const [seedText] = await transform(hooks, sessionID);

  assert.match(seedText, /claim '\/workspace\/note\.md'/);
  assert.match(
    seedText,
    /\/speckit:resume specs\/hooks\/023-session-relaunch-loop\/002-pi-opencode-adapters/,
  );
  assert.doesNotMatch(seedText, /specs\/from-environment/);
});

test('the seed repeats on every transform until the note is closed', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-repeat-0001';
  const notePath = path.join(root, 'repeat-note.md');
  const writeNote = (status) => fs.writeFileSync(
    notePath,
    `---\nsession_id: ${sessionID}\nstatus: ${status}\n---\n`,
  );

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-repeat', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-repeat',
        type: 'text',
        text: `[session-relaunch] claim and continue handoff ${notePath}`,
      },
    },
  } });
  writeNote('open');

  const first = await transform(hooks, sessionID);
  const second = await transform(hooks, sessionID);
  assert.equal(first.length, 1);
  assert.ok(first[0].includes(`claim '${notePath}'`), first[0]);
  assert.deepEqual(second, first);

  writeNote('done');
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('a claimed note pushes one completion reminder instead of the claim text', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-claimed-0001';
  const notePath = path.join(root, 'claimed-note.md');
  fs.writeFileSync(notePath, `---\nsession_id: ${sessionID}\nstatus: claimed\n---\n`);

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-claimed', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-claimed',
        type: 'text',
        text: `[session-relaunch] claim and continue handoff ${notePath}`,
      },
    },
  } });

  const output = await transform(hooks, sessionID);

  assert.equal(output.length, 1);
  const reminder = output[0];
  assert.equal(reminder.split('\n').length, 1, reminder);
  assert.ok(
    reminder.startsWith(`[session-relaunch] This session claimed handoff note ${notePath}.`),
    reminder,
  );
  assert.ok(reminder.includes(`complete '${notePath}'`), reminder);
  assert.ok(reminder.endsWith('` to close the note.'), reminder);
  assert.equal(reminder.includes("claim '"), false);
  assert.equal(reminder.includes('Write the handoff note'), false);

  assert.deepEqual(await transform(hooks, sessionID), output);
});

test('a done note clears the seed and pushes nothing', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-done-0001';
  const notePath = path.join(root, 'done-note.md');
  const writeNote = (status) => fs.writeFileSync(
    notePath,
    `---\nsession_id: ${sessionID}\nstatus: ${status}\n---\n`,
  );

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-done', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-done',
        type: 'text',
        text: `[session-relaunch] claim and continue handoff ${notePath}`,
      },
    },
  } });
  writeNote('done');

  assert.deepEqual(await transform(hooks, sessionID), []);

  // Reopening the same note proves the seed was cleared, not merely silent.
  writeNote('open');
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('a repeated seed message update keeps the seed while a new user message clears it', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-repeat-user-0001';
  const notePath = path.join(root, 'open-note.md');
  fs.writeFileSync(notePath, `---\nsession_id: ${sessionID}\nstatus: open\n---\n`);
  const userEvent = (id) => ({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id, role: 'user' } },
  } });

  await hooks.event(userEvent('msg-seed-open'));
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-open',
        type: 'text',
        text: `[session-relaunch] claim and continue handoff ${notePath}`,
      },
    },
  } });
  const first = await transform(hooks, sessionID);

  await hooks.event(userEvent('msg-seed-open'));
  assert.deepEqual(await transform(hooks, sessionID), first);

  await hooks.event(userEvent('msg-after-seed'));
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('a different user message clears the pending seed', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-reset-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-old', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-old',
        type: 'text',
        text: '[session-relaunch] claim and continue handoff /workspace/old-note.md',
      },
    },
  } });
  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-new', role: 'user' } },
  } });

  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('interleaved sessions keep their own seed and nudge text', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionA = 'ses-interleave-a-0001';
  const sessionB = 'ses-interleave-b-0001';
  const seedA = '[session-relaunch] claim and continue handoff /tmp/a-note.md';
  const seedB = '[session-relaunch] claim and continue handoff /tmp/b-note.md';

  const userEvent = (sessionID, id) => ({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id, role: 'user' } },
  } });
  const seedEvent = (sessionID, id, text) => ({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: { messageID: id, type: 'text', text },
    },
  } });
  const assistantEvent = (sessionID, id, input) => ({ event: {
    type: 'message.updated',
    properties: {
      sessionID,
      info: {
        id,
        role: 'assistant',
        time: { completed: 1 },
        tokens: { input },
      },
    },
  } });

  await hooks.event(userEvent(sessionA, 'user-a'));
  await hooks.event(userEvent(sessionB, 'user-b'));
  await hooks.event(seedEvent(sessionB, 'user-b', seedB));
  await hooks.event(seedEvent(sessionA, 'user-a', seedA));
  await hooks.event(assistantEvent(sessionA, 'assistant-a', 90));
  await hooks.event(assistantEvent(sessionB, 'assistant-b', 85));

  const outputA = (await transform(hooks, sessionA)).join('\n');
  const outputB = (await transform(hooks, sessionB)).join('\n');
  assert.match(outputA, /a-note\.md/);
  assert.match(outputA, new RegExp(`session_id: ${sessionA}`));
  assert.doesNotMatch(outputA, /b-note\.md|session_id: ses-interleave-b/);
  assert.match(outputB, /b-note\.md/);
  assert.match(outputB, new RegExp(`session_id: ${sessionB}`));
  assert.doesNotMatch(outputB, /a-note\.md|session_id: ses-interleave-a/);
});

test('recently active session survives the session-state cap', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const activeID = 'ses-active-lru-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID: activeID, info: { id: 'active-user', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.updated',
    properties: {
      sessionID: activeID,
      info: {
        id: 'active-assistant',
        role: 'assistant',
        time: { completed: 1 },
        tokens: { input: 90 },
      },
    },
  } });
  for (let index = 0; index < 999; index += 1) {
    const sessionID = `ses-fill-${index}`;
    await hooks.event({ event: {
      type: 'message.updated',
      properties: {
        sessionID,
        info: { id: `user-${index}`, role: 'user' },
      },
    } });
  }
  await hooks.event({ event: {
    type: 'message.updated',
    properties: {
      sessionID: activeID,
      info: {
        id: 'active-assistant-second',
        role: 'assistant',
        time: { completed: 1 },
        tokens: { input: 90 },
      },
    },
  } });
  await hooks.event({ event: {
    type: 'message.updated',
    properties: {
      sessionID: 'ses-over-cap',
      info: { id: 'over-cap-user', role: 'user' },
    },
  } });

  const output = await transform(hooks, activeID);
  assert.equal(output.length, 1);
  assert.match(output[0], new RegExp(`session_id: ${activeID}`));
});

test(
  'session.idle arms a matching record and spawns the killer without a transcript',
  async (t) => {
  setupEnv(t);
  const spawn = stubSpawn(t);
  const loopId = 'opencode-loop-0001';
  const sessionID = 'ses_eb7937bc3ffeKQrJWCjyWiOfRn';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });

  const record = core.readRelaunchFile(loopId, process.env);
  assert.equal(record.status, 'armed');
  assert.equal(record.cwd, '/workspace/opencode');
  assert.equal(spawn.calls.length, 1);
  const [, args, options] = spawn.calls[0];
  assert.ok(args.includes('--target-pid'));
  assert.ok(args.includes(String(process.pid)));
  assert.equal(args.includes('--transcript'), false);
  assert.equal(options.detached, true);
    assert.equal(options.stdio, 'ignore');
    assert.equal(spawn.unrefCalls.length, 1);
  },
);

test(
  'session.idle respawns one killer for an armed record whose killer is gone',
  async (t) => {
  const root = setupEnv(t);
  const spawn = stubSpawn(t);
  const loopId = 'opencode-loop-respawn-0001';
  const sessionID = 'ses-respawn-session-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  core.arm({ loopId, cwd: '/workspace/opencode', env: process.env });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });
  assert.equal(spawn.calls.length, 1);

  const stateDir = path.join(root, 'skilled-relaunch');
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(
    path.join(stateDir, `killer-${loopId}.lock`),
    `${process.pid} ${new Date().toISOString()}\n`,
  );
  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });
  assert.equal(spawn.calls.length, 1);
  assert.equal(core.readRelaunchFile(loopId, process.env).status, 'armed');
  },
);

test('session.idle uses node under Bun and ignores killer spawn errors', async (t) => {
  setupEnv(t);
  const spawn = stubSpawn(t);
  setBunRuntime(t);
  const loopId = 'opencode-bun-loop-0001';
  const sessionID = 'ses-bun-killer-session-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });

  const record = core.readRelaunchFile(loopId, process.env);
  const [command, args, options] = spawn.calls[0];
  assert.equal(record.status, 'armed');
  assert.equal(command, 'node');
  assert.equal(path.basename(args[0]), 'killer.cjs');
  assert.ok(args.includes('--target-pid'));
  assert.equal(options.detached, true);
  assert.equal(spawn.children[0].listenerCount('error'), 1);
  assert.doesNotThrow(() => {
    spawn.children[0].emit('error', new Error('node was not found'));
  });
  assert.equal(core.readRelaunchFile(loopId, process.env).status, 'armed');
});

test('session.idle logs a killer spawn error and leaves the record armed', async (t) => {
  const root = setupEnv(t);
  const spawn = stubSpawn(t);
  const loopId = 'opencode-spawn-error-0001';
  const sessionID = 'ses-spawn-error-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await hooks.event({ event: { type: 'session.idle', properties: { sessionID } } });
  spawn.children[0].emit('error', new Error('spawn denied'));

  assert.equal(core.readRelaunchFile(loopId, process.env).status, 'armed');
  const logPath = path.join(root, 'skilled-relaunch', 'relaunch.log');
  const spawnErrors = fs.readFileSync(logPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('session-idle-arm-error stage=spawn'));
  assert.equal(spawnErrors.length, 1);
  assert.match(spawnErrors[0], /message=spawn_denied/);
});

test('session.idle logs a synchronous killer spawn throw and leaves the record armed', async (t) => {
  const root = setupEnv(t);
  const spawnCalls = [];
  t.mock.method(childProcess, 'spawn', (...args) => {
    spawnCalls.push(args);
    throw new Error('sync spawn denied');
  });
  const loopId = 'opencode-spawn-sync-error-0001';
  const sessionID = 'ses-spawn-sync-error-0001';
  process.env.SKILLED_LOOP_ID = loopId;
  core.preparePending({
    loopId,
    handoffPath: '/workspace/opencode/handoff.md',
    sessionId: sessionID,
    runtime: 'opencode',
    cwd: '/workspace/opencode',
    env: process.env,
  });
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await assert.doesNotReject(() => hooks.event({
    event: { type: 'session.idle', properties: { sessionID } },
  }));

  assert.equal(spawnCalls.length, 1);
  assert.equal(core.readRelaunchFile(loopId, process.env).status, 'armed');
  const logPath = path.join(root, 'skilled-relaunch', 'relaunch.log');
  const spawnErrors = fs.readFileSync(logPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('session-idle-arm-error stage=spawn'));
  assert.equal(spawnErrors.length, 1);
  assert.match(spawnErrors[0], /message=sync_spawn_denied/);
});

test('the planned note path lands under the env repo root, not the session directory', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-note-path-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-note-path', 90));
  const active = await transform(hooks, sessionID);
  const notePath = notePathFromNudge(active[0]);

  assert.equal(
    path.dirname(notePath),
    path.join(
      root,
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
  assert.equal(notePath.startsWith(`${path.sep}workspace${path.sep}`), false);
  assert.match(path.basename(notePath), /^\d{8}T\d{6}Z-ses-note\.md$/);
});

test('a relative SESSION_RELAUNCH_REPO_ROOT still yields an absolute planned note path', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  process.env.SESSION_RELAUNCH_REPO_ROOT = 'relative-repo';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-relative-root-0001';

  await hooks.event(assistantEvent(sessionID, 'assistant-relative-root', 90));
  const active = await transform(hooks, sessionID);
  const notePath = notePathFromNudge(active[0]);

  assert.equal(path.isAbsolute(notePath), true, notePath);
  assert.equal(
    path.dirname(notePath),
    path.join(
      process.cwd(),
      'relative-repo',
      '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
    ),
  );
});

test('an invalid env threshold never falls through to the config file', async (t) => {
  const root = setupEnv(t);
  stubSpawn(t);
  fs.writeFileSync(
    path.join(root, 'hook-flags.env'),
    'SESSION_RELAUNCH_THRESHOLD=0.5\n',
  );
  process.env.SESSION_RELAUNCH_THRESHOLD = 'bogus';
  process.env.SESSION_RELAUNCH_WINDOW_TOKENS = '100';
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-invalid-threshold-01';

  await hooks.event(assistantEvent(sessionID, 'assistant-invalid-threshold', 60));
  assert.deepEqual(await transform(hooks, sessionID), []);
});

test('a seed path with a literal backslash round-trips unchanged', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-escape-0001';

  await hooks.event({ event: {
    type: 'message.updated',
    properties: { sessionID, info: { id: 'msg-seed-escape', role: 'user' } },
  } });
  await hooks.event({ event: {
    type: 'message.part.updated',
    properties: {
      sessionID,
      part: {
        messageID: 'msg-seed-escape',
        type: 'text',
        text: '[session-relaunch] claim and continue handoff /tmp/we\\"ird.md',
      },
    },
  } });

  const [seedText] = await transform(hooks, sessionID);
  assert.ok(seedText.includes('/tmp/we\\"ird.md'), seedText);
});

test('a relative or untrimmed seed path falls back to the placeholder', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });
  const sessionID = 'ses-seed-invalid-path';

  const seed = async (id, text) => {
    await hooks.event({ event: {
      type: 'message.updated',
      properties: { sessionID, info: { id, role: 'user' } },
    } });
    await hooks.event({ event: {
      type: 'message.part.updated',
      properties: {
        sessionID,
        part: { messageID: id, type: 'text', text },
      },
    } });
    const [seedText] = await transform(hooks, sessionID);
    assert.ok(seedText.includes("claim '<handoff-path>'"), seedText);
  };

  await seed(
    'msg-seed-relative',
    '[session-relaunch] claim and continue handoff relative/handoff.md',
  );
  await seed(
    'msg-seed-untrimmed',
    '[session-relaunch] claim and continue handoff /workspace/note.md ',
  );
});

test('malformed plugin events and transforms never throw', async (t) => {
  setupEnv(t);
  stubSpawn(t);
  const hooks = await loadPlugin({ directory: '/workspace/opencode' });

  await assert.doesNotReject(() => hooks.event({}));
  await assert.doesNotReject(() => hooks.event({
    event: { type: 'message.updated', properties: null },
  }));
  await assert.doesNotReject(() => hooks.event({ event: null }));
  await assert.doesNotReject(async () => {
    await hooks['experimental.chat.system.transform']({}, {});
  });
});
