// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Lifecycle Tests                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle events account usage and track prompt blocks. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { mkdir, mkdtemp, readFile, rm, utimes, writeFile } = require('node:fs/promises');
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

  async function fileExists(path) {
    try {
      await readFile(path, 'utf8');
      return true;
    } catch (error) {
      if (error?.code === 'ENOENT') return false;
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

    await helpers.setGoal('session-usage-limited', 'Stop when provider usage is limited', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'usage-limited-goal',
    });
    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-usage-limited',
          info: {
            error: {
              name: 'APIError',
              data: {
                statusCode: 429,
                message: 'rate limited',
                isRetryable: true,
              },
            },
          },
        },
      },
    });

    goal = await helpers.readGoal('session-usage-limited', { stateDir });
    assert.equal(goal.status, 'usage_limited');
    assert.equal(goal.continuationSuppressed, true);
    assert.equal(goal.continuationSuppressedReason, 'usage_limited');

    await helpers.setGoal('session-non-usage-error', 'Ignore non-usage provider errors', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'non-usage-error-goal',
    });
    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-non-usage-error',
          info: {
            error: {
              name: 'ProviderAuthError',
              data: {
                providerID: 'openai',
                message: 'bad key',
              },
            },
          },
        },
      },
    });

    goal = await helpers.readGoal('session-non-usage-error', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.continuationSuppressed, false);

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
    await helpers.setGoal('session-status-flush', 'Flush volatile session status on delete after archive', {
      stateDir,
      nowMs: 3100,
      goalIdFactory: () => 'status-flush-goal-restored',
    });
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

    const archivePlugin = await pluginModule.default({}, { stateDir });
    await helpers.setGoal('session-archive-existing', 'Archive this goal state', {
      stateDir,
      goalIdFactory: () => 'archive-existing-goal',
    });
    const archiveSourcePath = helpers.goalPathForSession('session-archive-existing', { stateDir });
    const archiveTargetPath = join(
      stateDir,
      '.archive',
      `${helpers.sessionKeyForSession('session-archive-existing')}.json`,
    );
    const archiveSourceRaw = await readFile(archiveSourcePath, 'utf8');
    await archivePlugin.event({
      event: {
        type: 'session.deleted',
        properties: { sessionID: 'session-archive-existing' },
      },
    });
    assert.equal(await fileExists(archiveSourcePath), false);
    const archiveTargetRaw = await readFile(archiveTargetPath, 'utf8');
    assert.equal(JSON.parse(archiveTargetRaw).goalId, 'archive-existing-goal');
    assert.deepEqual(JSON.parse(archiveTargetRaw), JSON.parse(archiveSourceRaw));

    await assert.doesNotReject(() => archivePlugin.event({
      event: {
        type: 'session.deleted',
        properties: { sessionID: 'session-archive-missing' },
      },
    }));

    const archiveDir = join(stateDir, '.archive');
    await mkdir(archiveDir, { recursive: true, mode: 0o700 });
    const oldArchivePath = join(archiveDir, 'old-archive.json');
    const recentArchivePath = join(archiveDir, 'recent-archive.json');
    await writeFile(oldArchivePath, '{"goalId":"old-archive"}\n', 'utf8');
    await writeFile(recentArchivePath, '{"goalId":"recent-archive"}\n', 'utf8');
    const oldArchiveDate = new Date(Date.now() - (120 * 24 * 60 * 60 * 1000));
    await utimes(oldArchivePath, oldArchiveDate, oldArchiveDate);
    await helpers.setGoal('session-archive-prune-trigger', 'Trigger archive pruning', {
      stateDir,
      goalIdFactory: () => 'archive-prune-trigger-goal',
    });
    await archivePlugin.event({
      event: {
        type: 'session.deleted',
        properties: { sessionID: 'session-archive-prune-trigger' },
      },
    });
    assert.equal(await fileExists(oldArchivePath), false);
    assert.equal(await fileExists(recentArchivePath), true);

    const staleUpdatedAtMs = Date.now() - (40 * 24 * 60 * 60 * 1000);
    const recentUpdatedAtMs = Date.now();
    const staleSessionID = 'session-orphan-stale';
    const recentSessionID = 'session-orphan-recent';
    const staleActivePath = helpers.goalPathForSession(staleSessionID, { stateDir });
    const recentActivePath = helpers.goalPathForSession(recentSessionID, { stateDir });
    const staleArchivePath = join(archiveDir, `${helpers.sessionKeyForSession(staleSessionID)}.json`);
    await writeFile(staleActivePath, JSON.stringify({
      sessionId: staleSessionID,
      goalId: 'orphan-stale-goal',
      objective: 'Archive stale active state',
      status: 'active',
      createdAtMs: staleUpdatedAtMs,
      updatedAtMs: staleUpdatedAtMs,
    }), 'utf8');
    await writeFile(recentActivePath, JSON.stringify({
      sessionId: recentSessionID,
      goalId: 'orphan-recent-goal',
      objective: 'Keep recent active state',
      status: 'active',
      createdAtMs: recentUpdatedAtMs,
      updatedAtMs: recentUpdatedAtMs,
    }), 'utf8');
    const sweepPlugin = await pluginModule.default({}, { stateDir });
    await sweepPlugin.event({
      event: {
        type: 'session.created',
        properties: { sessionID: 'session-sweep-fresh' },
      },
    });
    assert.equal(await fileExists(staleActivePath), false);
    assert.equal(await fileExists(staleArchivePath), true);
    assert.equal(await fileExists(recentActivePath), true);

    const throttlePlugin = await pluginModule.default({}, { stateDir });
    const throttleFirstSessionID = 'session-throttle-first';
    const throttleSecondSessionID = 'session-throttle-second';
    const throttleFirstActivePath = helpers.goalPathForSession(throttleFirstSessionID, { stateDir });
    const throttleSecondActivePath = helpers.goalPathForSession(throttleSecondSessionID, { stateDir });
    const throttleFirstArchivePath = join(archiveDir, `${helpers.sessionKeyForSession(throttleFirstSessionID)}.json`);
    const throttleSecondArchivePath = join(archiveDir, `${helpers.sessionKeyForSession(throttleSecondSessionID)}.json`);
    await writeFile(throttleFirstActivePath, JSON.stringify({
      sessionId: throttleFirstSessionID,
      goalId: 'throttle-first-goal',
      objective: 'Archive on first sweep',
      status: 'active',
      createdAtMs: staleUpdatedAtMs,
      updatedAtMs: staleUpdatedAtMs,
    }), 'utf8');
    await throttlePlugin.event({
      event: {
        type: 'session.created',
        properties: { sessionID: 'session-throttle-fresh-one' },
      },
    });
    assert.equal(await fileExists(throttleFirstActivePath), false);
    assert.equal(await fileExists(throttleFirstArchivePath), true);
    await writeFile(throttleSecondActivePath, JSON.stringify({
      sessionId: throttleSecondSessionID,
      goalId: 'throttle-second-goal',
      objective: 'Remain active during throttle window',
      status: 'active',
      createdAtMs: staleUpdatedAtMs,
      updatedAtMs: staleUpdatedAtMs,
    }), 'utf8');
    await throttlePlugin.event({
      event: {
        type: 'session.created',
        properties: { sessionID: 'session-throttle-fresh-two' },
      },
    });
    assert.equal(await fileExists(throttleSecondActivePath), true);
    assert.equal(await fileExists(throttleSecondArchivePath), false);
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
