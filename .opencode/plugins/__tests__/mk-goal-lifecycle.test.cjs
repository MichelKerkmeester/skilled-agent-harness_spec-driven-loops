// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Lifecycle Tests                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle events account usage and track prompt blocks. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const testDir = dirname(__filename);
  const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;
  const pluginModule = await import(pluginUrl);
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-lifecycle-'));

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
    let goal = await helpers.readGoal('session-life', { stateDir });
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
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
