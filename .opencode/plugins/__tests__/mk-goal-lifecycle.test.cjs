// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Lifecycle Tests                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle events account usage and track prompt blocks. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const testDir = dirname(__filename);
  const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;
  const pluginModule = await import(pluginUrl);
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-lifecycle-'));
  const originalAutonomy = process.env.MK_GOAL_AUTONOMY;
  const originalDebug = process.env.MK_GOAL_DEBUG;

  async function readGoalEventEntries() {
    try {
      const raw = await readFile(join(stateDir, '.goal-events.log'), 'utf8');
      return raw.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
    } catch (error) {
      if (error?.code === 'ENOENT') return [];
      throw error;
    }
  }

  async function readContinuationEntries() {
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

  try {
    const plugin = await pluginModule.default({}, {
      stateDir,
      nowMs: 1000,
    });

    await helpers.setGoal('session-life', 'Finish inside the token budget', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'event-goal',
      tokenBudget: 100,
    });

    await plugin.event({
      event: {
        type: 'session.created',
        properties: { sessionID: 'session-life' },
      },
    });
    let goal = await helpers.readGoal('session-life', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.goalId, 'event-goal');

    const firstMessage = {
      type: 'message.updated',
      properties: {
        sessionID: 'session-life',
        info: {
          id: 'msg-1',
          role: 'assistant',
          content: 'The first implementation pass is complete.',
          usage: {
            totalTokens: 60,
            source: 'unit-usage',
          },
        },
      },
    };

    await plugin.event({ event: firstMessage });
    goal = await helpers.readGoal('session-life', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.tokensUsed, 60);
    assert.equal(goal.usageSource, 'unit-usage');
    assert.equal(goal.lastAccountedMessageID, 'msg-1');
    assert.equal(goal.lastActivityMessageID, 'msg-1');
    assert.match(goal.lastEvidence, /first implementation pass/);

    await plugin.event({ event: firstMessage });
    goal = await helpers.readGoal('session-life', { stateDir });
    assert.equal(goal.tokensUsed, 60);

    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-life',
          info: {
            id: 'msg-2',
            role: 'assistant',
            content: 'The second pass crosses the budget.',
            usage: {
              totalTokens: 45,
              source: 'unit-usage',
            },
          },
        },
      },
    });

    goal = await helpers.readGoal('session-life', { stateDir });
    assert.equal(goal.status, 'budget_limited');
    assert.equal(goal.tokensUsed, 105);
    assert.equal(goal.continuationSuppressed, true);
    assert.equal(goal.continuationSuppressedReason, 'token budget reached');

    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-life',
          info: {
            id: 'msg-3',
            role: 'assistant',
            content: 'This update must not charge after the budget stop.',
            usage: {
              totalTokens: 30,
              source: 'unit-usage',
            },
          },
        },
      },
    });

    goal = await helpers.readGoal('session-life', { stateDir });
    assert.equal(goal.status, 'budget_limited');
    assert.equal(goal.tokensUsed, 105);

    const resetGoal = await helpers.setGoal('session-life', 'Finish inside the token budget', {
      stateDir,
      nowMs: 2000,
      goalIdFactory: () => 'reset-goal',
    });
    assert.equal(resetGoal.status, 'active');
    assert.equal(resetGoal.goalId, 'reset-goal');
    assert.equal(resetGoal.tokensUsed, 0);
    assert.ok(resetGoal.tokensUsed < resetGoal.tokenBudget);
    assert.equal(resetGoal.timeUsedSeconds, 0);
    assert.equal(resetGoal.lastAccountedMessageID, null);
    assert.equal(resetGoal.continuationSuppressed, false);
    assert.equal(resetGoal.completionSource, null);

    await helpers.setGoal('session-unavailable', 'Handle missing usage data', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'usage-goal',
      tokenBudget: 50,
    });

    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-unavailable',
          info: {
            id: 'msg-empty',
            role: 'assistant',
            content: 'No usage payload was supplied.',
          },
        },
      },
    });

    goal = await helpers.readGoal('session-unavailable', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.tokensUsed, 0);
    assert.equal(goal.usageSource, 'unavailable');
    assert.equal(goal.lastAccountedMessageID, null);
    assert.match(goal.lastEvidence, /No usage payload/);

    await plugin.event({
      event: {
        type: 'permission.asked',
        properties: { sessionID: 'session-unavailable' },
      },
    });

    goal = await helpers.readGoal('session-unavailable', { stateDir });
    assert.equal(goal.blockedByPrompt, true);

    await plugin.event({
      event: {
        type: 'permission.replied',
        properties: { sessionID: 'session-unavailable' },
      },
    });

    goal = await helpers.readGoal('session-unavailable', { stateDir });
    assert.equal(goal.blockedByPrompt, false);

    await plugin.event({
      event: {
        type: 'question.asked',
        properties: { sessionID: 'session-unavailable' },
      },
    });

    goal = await helpers.readGoal('session-unavailable', { stateDir });
    assert.equal(goal.blockedByPrompt, true);

    await plugin.event({
      event: {
        type: 'question.rejected',
        properties: { sessionID: 'session-unavailable' },
      },
    });

    goal = await helpers.readGoal('session-unavailable', { stateDir });
    assert.equal(goal.blockedByPrompt, false);

    process.env.MK_GOAL_AUTONOMY = 'smoke';
    process.env.MK_GOAL_DEBUG = '1';
    await helpers.setGoal('session-status-flush', 'Flush volatile session status on delete', {
      stateDir,
      nowMs: 3000,
      goalIdFactory: () => 'status-flush-goal',
    });
    await plugin.event({
      event: {
        type: 'session.status',
        properties: {
          sessionID: 'session-status-flush',
          status: 'busy',
        },
      },
    });
    let debugEntries = await readGoalEventEntries();
    assert.ok(debugEntries.some((entry) => entry.type === 'session.status' && entry.sid === 'session-status-flush'));

    await plugin.event({
      event: {
        type: 'session.deleted',
        properties: { sessionID: 'session-status-flush' },
      },
    });
    debugEntries = await readGoalEventEntries();
    assert.ok(debugEntries.some((entry) => entry.type === 'session.deleted' && entry.sid === 'session-status-flush'));
    await plugin.event({
      event: {
        type: 'session.idle',
        properties: { sessionID: 'session-status-flush' },
      },
    });
    let continuationEntries = await readContinuationEntries();
    assert.equal(continuationEntries.at(-1).decision, 'would_fire');
    assert.equal(continuationEntries.at(-1).reason, 'smoke_mode');

    await helpers.setGoal('session-disposed-flush', 'Flush all volatile state on disposal', {
      stateDir,
      nowMs: 4000,
      goalIdFactory: () => 'disposed-flush-goal',
    });
    await plugin.event({
      event: {
        type: 'session.status',
        properties: {
          sessionID: 'session-disposed-flush',
          status: 'busy',
        },
      },
    });
    await plugin.event({
      event: { type: 'app.disposed' },
    });
    debugEntries = await readGoalEventEntries();
    assert.ok(debugEntries.some((entry) => entry.type === 'app.disposed'));
    await plugin.event({
      event: {
        type: 'session.idle',
        properties: { sessionID: 'session-disposed-flush' },
      },
    });
    continuationEntries = await readContinuationEntries();
    assert.equal(continuationEntries.at(-1).decision, 'would_fire');
    assert.equal(continuationEntries.at(-1).reason, 'smoke_mode');

    await helpers.ensureGoalStateDir({ stateDir });
    await writeFile(
      helpers.goalPathForSession('session-error-observable', { stateDir }),
      '{ invalid json',
      'utf8',
    );
    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-error-observable',
          info: {
            id: 'msg-error',
            role: 'assistant',
            content: 'This event forces a read failure.',
            usage: { totalTokens: 1 },
          },
        },
      },
    });
    debugEntries = await readGoalEventEntries();
    const errorEntry = debugEntries.find((entry) => entry.type === 'event_error');
    assert.ok(errorEntry);
    assert.equal(errorEntry.eventType, 'message.updated');
    assert.equal(errorEntry.sid, 'session-error-observable');
    assert.match(errorEntry.error, /Failed to read goal state/);
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    restoreEnv('MK_GOAL_DEBUG', originalDebug);
    await rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
