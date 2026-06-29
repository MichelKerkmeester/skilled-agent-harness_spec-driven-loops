// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Continuation Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify default-off autonomy gates and continuation caps.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function readContinuationEntries(stateDir) {
  try {
    const raw = await readFile(join(stateDir, '.continuation.log'), 'utf8');
    return raw.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

async function main() {
  const testDir = dirname(__filename);
  const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;
  const pluginModule = await import(pluginUrl);
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-continuation-'));
  const originalAutonomy = process.env.MK_GOAL_AUTONOMY;

  try {
    delete process.env.MK_GOAL_AUTONOMY;
    let promptCalls = 0;
    const noFireClient = {
      session: {
        async promptAsync() {
          promptCalls += 1;
        },
      },
    };

    await helpers.setGoal('session-default', 'Stay passive unless explicitly enabled', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'default-goal',
    });
    let result = await helpers.maybeContinueGoal('session-default', {
      stateDir,
      nowMs: 2000,
      client: noFireClient,
    });
    assert.equal(result.decision, 'suppressed');
    assert.equal(result.reason, 'autonomy_disabled');
    assert.equal(promptCalls, 0);
    let entries = await readContinuationEntries(stateDir);
    assert.deepEqual(entries.at(-1), {
      sid: 'session-default',
      decision: 'suppressed',
      reason: 'autonomy_disabled',
      autoTurnsUsed: 0,
    });

    process.env.MK_GOAL_AUTONOMY = 'passive';
    await helpers.setGoal('session-passive', 'Passive mode must remain a kill switch', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'passive-goal',
    });
    result = await helpers.maybeContinueGoal('session-passive', {
      stateDir,
      nowMs: 2000,
      client: noFireClient,
    });
    assert.equal(result.decision, 'suppressed');
    assert.equal(result.reason, 'autonomy_passive');
    assert.equal(promptCalls, 0);

    process.env.MK_GOAL_AUTONOMY = 'smoke';
    await helpers.setGoal('session-smoke', 'Smoke mode logs without prompting', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'smoke-goal',
    });
    result = await helpers.maybeContinueGoal('session-smoke', {
      stateDir,
      nowMs: 2000,
      client: noFireClient,
    });
    assert.equal(result.decision, 'would_fire');
    assert.equal(result.reason, 'smoke_mode');
    assert.equal(promptCalls, 0);

    process.env.MK_GOAL_AUTONOMY = 'active';
    const promptRequests = [];
    const activeClient = {
      session: {
        async promptAsync(request) {
          promptRequests.push(request);
        },
      },
    };
    await helpers.setGoal('session-active', 'Submit the continuation prompt', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'active-goal',
    });
    result = await helpers.maybeContinueGoal('session-active', {
      stateDir,
      nowMs: 3000,
      client: activeClient,
      directory: '/tmp/mk-goal-test',
      runtimeState: {
        inFlightContinuations: new Set(),
        blockedByPromptSessions: new Set(),
        sessionStatuses: new Map([['session-active', 'idle']]),
      },
    });
    assert.equal(result.decision, 'fired');
    assert.equal(result.reason, 'prompt_async_sent');
    assert.equal(promptRequests.length, 1);
    assert.equal(promptRequests[0].path.id, 'session-active');
    assert.equal(promptRequests[0].query.directory, '/tmp/mk-goal-test');
    assert.match(promptRequests[0].body.parts[0].text, /Submit the continuation prompt/);
    let goal = await helpers.readGoal('session-active', { stateDir });
    assert.equal(goal.autoTurnsUsed, 1);

    const cappedGoal = await helpers.setGoal('session-cap', 'Stop at the auto-turn cap', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'cap-goal',
    });
    await helpers.writeGoalAtomic({
      ...cappedGoal,
      autoTurnsUsed: 8,
      maxAutoTurns: 8,
    }, { stateDir });
    const capClient = {
      session: {
        async promptAsync() {
          throw new Error('cap test should not prompt');
        },
      },
    };
    result = await helpers.maybeContinueGoal('session-cap', {
      stateDir,
      nowMs: 4000,
      client: capClient,
    });
    assert.equal(result.decision, 'suppressed');
    assert.equal(result.reason, 'auto_turn_cap_reached');
    goal = await helpers.readGoal('session-cap', { stateDir });
    assert.equal(goal.autoTurnsUsed, 8);

    result = await helpers.maybeContinueGoal('session-cap', {
      stateDir,
      nowMs: 5000,
      client: capClient,
    });
    assert.equal(result.decision, 'suppressed');
    goal = await helpers.readGoal('session-cap', { stateDir });
    assert.equal(goal.autoTurnsUsed, 8);

    entries = await readContinuationEntries(stateDir);
    assert.equal(entries.at(-1).autoTurnsUsed, 8);
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    await rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
