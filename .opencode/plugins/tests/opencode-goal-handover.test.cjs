// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: opencode-goal Hand-Over Bind Tests                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: A relaunched OpenCode session that was handed a goal packet is   ║
// ║          bound to it at session start, only when it has no goal of its   ║
// ║          own, and never through chat text.                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

const { restoreEnv } = require('./helpers/continuation-log.cjs');

const testDir = dirname(__filename);
const pluginUrl = pathToFileURL(join(testDir, '..', 'opencode-goal.js')).href;
const PACKET = 'specs/t/001-fixture';
const HAND_OVER_ENV = ['SESSION_RELAUNCH_GOAL_PACKET', 'SESSION_RELAUNCH_GOAL'];

async function loadHelpers(pluginModule) {
  const coreModule = await import(pathToFileURL(join(testDir, '..', 'lib', 'opencode-goal-core.js')).href);
  return coreModule.getGoalCore(pluginModule.default.server);
}

async function writePacket(root, rel, { gitMarker = true } = {}) {
  const dir = join(root, rel);
  await mkdir(dir, { recursive: true });
  if (gitMarker) await mkdir(join(root, '.git'), { recursive: true });
  await writeFile(join(dir, 'goal.md'), [
    '---', 'title: "Goal: fixture"', 'session_id: "SECRET"', '---',
    '<!-- ANCHOR:directive -->', '**Objective:** Ship it.', '<!-- /ANCHOR:directive -->',
    '<!-- ANCHOR:completion -->', '- [ ] HANDOVER_CRITERION', '<!-- /ANCHOR:completion -->',
    '<!-- ANCHOR:log -->', '| Item | State | Evidence |', '|---|---|---|', '<!-- /ANCHOR:log -->', '',
  ].join('\n'), 'utf8');
}

// The hand-over variables are captured and cleared around every case, so a suite run inside a
// relaunched session cannot bind a goal into a case that never asked for one.
async function withWorkspace(fn) {
  const pluginModule = await import(pluginUrl);
  const helpers = await loadHelpers(pluginModule);
  const workspace = await mkdtemp(join(tmpdir(), 'opencode-goal-handover-ws-'));
  const stateDir = await mkdtemp(join(tmpdir(), 'opencode-goal-handover-state-'));
  const saved = Object.fromEntries(HAND_OVER_ENV.map((name) => [name, process.env[name]]));
  for (const name of HAND_OVER_ENV) delete process.env[name];
  const originalDisabled = process.env.OPENCODE_GOAL_PLUGIN_DISABLED;
  delete process.env.OPENCODE_GOAL_PLUGIN_DISABLED;
  const newPlugin = () => pluginModule.default.server({ directory: workspace }, { stateDir });
  try {
    await writePacket(workspace, PACKET);
    return await fn({ helpers, workspace, stateDir, newPlugin });
  } finally {
    for (const name of HAND_OVER_ENV) restoreEnv(name, saved[name]);
    restoreEnv('OPENCODE_GOAL_PLUGIN_DISABLED', originalDisabled);
    await rm(workspace, { recursive: true, force: true });
    await rm(stateDir, { recursive: true, force: true });
  }
}

function sessionCreated(sessionID, parentID) {
  return { type: 'session.created', properties: { info: { id: sessionID, ...(parentID ? { parentID } : {}) } } };
}

test('a receiver with no goal is bound to the hand-over packet at session start and injects from goal.md', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  const plugin = await newPlugin();
  await plugin.event({ event: sessionCreated('receiver') });

  const goal = await helpers.readGoal('receiver', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.packetPath, PACKET);

  const output = { system: [] };
  await plugin['experimental.chat.system.transform']({ sessionID: 'receiver' }, output);
  const injected = output.system.join('\n');
  assert.match(injected, new RegExp(`Execute ${PACKET}/goal.md`));
  assert.ok(!injected.includes('SECRET'));
}));

test('a second session start with the same id changes nothing', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  await (await newPlugin()).event({ event: sessionCreated('twice-session') });
  const path = helpers.goalPathForSession('twice-session', { stateDir });
  const before = await readFile(path, 'utf8');
  assert.equal(JSON.parse(before).packetPath, PACKET);
  await (await newPlugin()).event({ event: sessionCreated('twice-session') });
  assert.equal(await readFile(path, 'utf8'), before);
}));

test('an active or paused goal of the session is kept byte for byte', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  await helpers.setGoal('own-active', 'The operator own goal', { stateDir });
  await helpers.setGoal('own-paused', 'The operator paused goal', { stateDir });
  await helpers.markGoalStatus('own-paused', 'paused', { stateDir });
  for (const sessionID of ['own-active', 'own-paused']) {
    const path = helpers.goalPathForSession(sessionID, { stateDir });
    const before = await readFile(path, 'utf8');
    const plugin = await newPlugin();
    await plugin.event({ event: sessionCreated(sessionID) });
    assert.equal(await readFile(path, 'utf8'), before, sessionID);
  }
}));

test('a goal that was cleared in this session is not handed back at the next start', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  await helpers.setGoal('cleared-session', 'Abandoned work', { stateDir });
  await helpers.clearGoal('cleared-session', { stateDir });
  assert.equal(await helpers.readGoal('cleared-session', { stateDir }), null);
  const plugin = await newPlugin();
  await plugin.event({ event: sessionCreated('cleared-session') });
  assert.equal(await helpers.readGoal('cleared-session', { stateDir }), null);
}));

test('a record that cannot be parsed counts as a goal and is left alone', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  await mkdir(stateDir, { recursive: true });
  const path = helpers.goalPathForSession('broken-session', { stateDir });
  await writeFile(path, '{not json', 'utf8');
  const plugin = await newPlugin();
  await plugin.event({ event: sessionCreated('broken-session') });
  assert.equal(await readFile(path, 'utf8'), '{not json');
}));

test('no variable, an empty one or the switch off binds nothing', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  const cases = [
    ['no-variable', {}],
    ['empty-variable', { SESSION_RELAUNCH_GOAL_PACKET: '' }],
    ['switch-off', { SESSION_RELAUNCH_GOAL_PACKET: PACKET, SESSION_RELAUNCH_GOAL: '0' }],
    ['switch-word', { SESSION_RELAUNCH_GOAL_PACKET: PACKET, SESSION_RELAUNCH_GOAL: 'off' }],
  ];
  for (const [sessionID, env] of cases) {
    Object.assign(process.env, env);
    const plugin = await newPlugin();
    await plugin.event({ event: sessionCreated(sessionID) });
    assert.equal(await helpers.readGoal(sessionID, { stateDir }), null, sessionID);
    for (const name of HAND_OVER_ENV) delete process.env[name];
  }
}));

test('a missing, escaping or linked-out packet binds nothing', async () => withWorkspace(async ({ helpers, stateDir, workspace, newPlugin }) => {
  const outside = await mkdtemp(join(tmpdir(), 'opencode-goal-handover-outside-'));
  try {
    await writePacket(outside, 'pkt', { gitMarker: false });
    await symlink(join(outside, 'pkt'), join(workspace, 'specs', 't', 'linked-out'));
    await mkdir(join(workspace, 'specs', 't', 'empty'), { recursive: true });
    const bad = ['specs/t/missing', 'specs/t/empty', '../outside', 'specs/t/../../../outside', join(workspace, 'specs', 't', 'empty'), 'specs/t/linked-out'];
    for (const [index, packet] of bad.entries()) {
      process.env.SESSION_RELAUNCH_GOAL_PACKET = packet;
      const plugin = await newPlugin();
      await plugin.event({ event: sessionCreated(`bad-${index}`) });
      assert.equal(await helpers.readGoal(`bad-${index}`, { stateDir }), null, packet);
    }
    const written = (await readdir(stateDir)).filter((name) => name.endsWith('.json'));
    assert.deepEqual(written, []);
  } finally {
    await rm(outside, { recursive: true, force: true });
  }
}));

test('only the first top-level session of the process is the receiver', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  const plugin = await newPlugin();
  await plugin.event({ event: sessionCreated('child-session', 'parent-session') });
  assert.equal(await helpers.readGoal('child-session', { stateDir }), null, 'a child session is not a receiver');
  await plugin.event({ event: sessionCreated('first-top-level') });
  await plugin.event({ event: sessionCreated('second-top-level') });
  assert.equal((await helpers.readGoal('first-top-level', { stateDir })).packetPath, PACKET);
  assert.equal(await helpers.readGoal('second-top-level', { stateDir }), null);
}));

test('the plugin kill switch stops the hand-over bind', async () => withWorkspace(async ({ helpers, stateDir, newPlugin }) => {
  process.env.SESSION_RELAUNCH_GOAL_PACKET = PACKET;
  const plugin = await newPlugin();
  process.env.OPENCODE_GOAL_PLUGIN_DISABLED = '1';
  await plugin.event({ event: sessionCreated('disabled-session') });
  delete process.env.OPENCODE_GOAL_PLUGIN_DISABLED;
  assert.equal(await helpers.readGoal('disabled-session', { stateDir }), null);
}));
