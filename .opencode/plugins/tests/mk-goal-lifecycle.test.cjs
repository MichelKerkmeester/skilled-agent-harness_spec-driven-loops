// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Lifecycle Tests                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle events account usage and track prompt blocks. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdir, mkdtemp, readFile, readdir, rm, utimes, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { readContinuationEntries, restoreEnv } = require('./helpers/continuation-log.cjs');

const testDir = dirname(__filename);
const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;

async function loadPluginModule() {
  return import(pluginUrl);
}

async function importFreshPlugin(label) {
  return import(`${pluginUrl}?${label}-${Date.now()}-${Math.random()}`);
}

function nativeSessionEvent(type, sessionID) {
  return { type, properties: { info: { id: sessionID } } };
}

function nativeAssistantMessageUpdated(sessionID, messageID, tokens = {}) {
  return {
    type: 'message.updated',
    properties: {
      info: {
        id: messageID,
        sessionID,
        role: 'assistant',
        tokens,
      },
    },
  };
}

function nativeTextPartUpdated(sessionID, messageID, text, role) {
  return {
    type: 'message.part.updated',
    properties: {
      part: {
        id: `${messageID}-part`,
        sessionID,
        messageID,
        type: 'text',
        text,
        ...(role ? { role } : {}),
      },
    },
  };
}

async function withState(fn) {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-lifecycle-'));
  const originalAutonomy = process.env.MK_GOAL_AUTONOMY;
  const originalDebug = process.env.MK_GOAL_DEBUG;
  const originalDisabled = process.env.MK_GOAL_PLUGIN_DISABLED;

  try {
    return await fn({ helpers, pluginModule, stateDir });
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    restoreEnv('MK_GOAL_DEBUG', originalDebug);
    restoreEnv('MK_GOAL_PLUGIN_DISABLED', originalDisabled);
    await rm(stateDir, { recursive: true, force: true });
  }
}

async function readGoalEventEntries(stateDir) {
  try {
    const raw = await readFile(join(stateDir, '.goal-events.log'), 'utf8');
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

async function directorySnapshot(path) {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    return entries.map((entry) => `${entry.isDirectory() ? 'd' : 'f'}:${entry.name}`).sort();
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function createLifecycleGoal(helpers, stateDir) {
  await helpers.setGoal('session-life', 'Finish inside the token budget', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'event-goal',
    tokenBudget: 100,
  });
}

test('session.created keeps an active goal intact', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });

  await createLifecycleGoal(helpers, stateDir);
  await plugin.event({
    event: nativeSessionEvent('session.created', 'session-life'),
  });
  const goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.goalId, 'event-goal');
}));

test('native message headers charge tokens while only explicit assistant text parts become evidence', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await createLifecycleGoal(helpers, stateDir);
  const header = nativeAssistantMessageUpdated('session-life', 'native-msg-1', {
    input: 40,
    output: 20,
    reasoning: 5,
    cache: { read: 3, write: 2 },
  });

  await plugin.event({ event: header });
  let goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.tokensUsed, 70);
  assert.equal(goal.usageSource, 'opencode-native-tokens');
  assert.equal(goal.lastEvidence, null);

  await plugin.event({ event: nativeTextPartUpdated('session-life', 'native-msg-1', 'Role-less text is ignored') });
  await plugin.event({ event: nativeTextPartUpdated('session-life', 'native-msg-1', 'User text is ignored', 'user') });
  goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.lastEvidence, null);
  assert.equal(goal.tokensUsed, 70);

  await plugin.event({ event: nativeTextPartUpdated(
    'session-life',
    'native-msg-1',
    'The native implementation and tests are complete.',
    'assistant',
  ) });
  goal = await helpers.readGoal('session-life', { stateDir });
  assert.match(goal.lastEvidence, /native implementation and tests are complete/);
  assert.equal(goal.lastActivityMessageID, 'native-msg-1');
  assert.equal(goal.tokensUsed, 70);

  await plugin.event({ event: header });
  goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.tokensUsed, 70);
}));

test('usage ledger retains old message totals beyond 64 message ids', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-long-ledger', 'Deduplicate old cumulative usage', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'long-ledger-goal',
    tokenBudget: 1000,
  });
  for (let index = 0; index < 65; index += 1) {
    await plugin.event({
      event: nativeAssistantMessageUpdated('session-long-ledger', `native-ledger-${index}`, { output: 1 }),
    });
  }
  await plugin.event({
    event: nativeAssistantMessageUpdated('session-long-ledger', 'native-ledger-0', { output: 1 }),
  });
  let goal = await helpers.readGoal('session-long-ledger', { stateDir });
  assert.equal(goal.tokensUsed, 65);

  await plugin.event({
    event: nativeAssistantMessageUpdated('session-long-ledger', 'native-ledger-0', { output: 4 }),
  });
  goal = await helpers.readGoal('session-long-ledger', { stateDir });
  assert.equal(goal.tokensUsed, 68);
}));

test('message.updated accounts assistant usage once per message id', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
  await createLifecycleGoal(helpers, stateDir);

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
}));

test('message.updated performs one write cycle for one event', async () => {
  const writeCycleStateDir = await mkdtemp(join(tmpdir(), 'mk-goal-write-cycle-spy-'));
  try {
    const writeCycleModule = await importFreshPlugin('message-updated-write-cycle');
    const writeCycleHelpers = writeCycleModule.default.__test;
    const writeCycleMetrics = {};
    const writeCyclePlugin = await writeCycleModule.default({}, { stateDir: writeCycleStateDir, metrics: writeCycleMetrics });
    await writeCycleHelpers.setGoal('session-write-cycle', 'Merge message updates into one write', {
      stateDir: writeCycleStateDir,
      goalIdFactory: () => 'write-cycle-goal',
      tokenBudget: 200,
      metrics: writeCycleMetrics,
    });
    writeCycleMetrics.writeCycles = 0;
    await writeCyclePlugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID: 'session-write-cycle',
          info: { id: 'msg-write-cycle', role: 'assistant', content: 'One update', usage: { totalTokens: 5 } },
        },
      },
    });
    assert.equal(writeCycleMetrics.writeCycles, 1);
  } finally {
    await rm(writeCycleStateDir, { recursive: true, force: true });
  }
});

test('message.updated crosses the token budget and suppresses continuation', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
  await createLifecycleGoal(helpers, stateDir);

  await plugin.event({
    event: {
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
    },
  });
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

  const goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.status, 'budget_limited');
  assert.equal(goal.tokensUsed, 105);
  assert.equal(goal.continuationSuppressed, true);
  assert.equal(goal.continuationSuppressedReason, 'token budget reached');
}));

test('interleaved message totals are charged by delta', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
  await helpers.setGoal('session-interleaved-usage', 'Charge interleaved message totals by delta', {
    stateDir,
    nowMs: 1500,
    goalIdFactory: () => 'interleaved-usage-goal',
    tokenBudget: 100,
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-interleaved-usage',
        info: { id: 'msg-1', role: 'assistant', content: 'partial one', usage: { totalTokens: 40 } },
      },
    },
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-interleaved-usage',
        info: { id: 'msg-2', role: 'assistant', content: 'final two', usage: { totalTokens: 30 } },
      },
    },
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-interleaved-usage',
        info: { id: 'msg-1', role: 'assistant', content: 'final one', usage: { totalTokens: 80 } },
      },
    },
  });
  const goal = await helpers.readGoal('session-interleaved-usage', { stateDir });
  assert.equal(goal.tokensUsed, 110);
  assert.equal(goal.status, 'budget_limited');
  assert.equal(goal.continuationSuppressedReason, 'token budget reached');
}));

test('budget-limited goals do not charge later usage updates', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
  await createLifecycleGoal(helpers, stateDir);
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-life',
        info: { id: 'msg-1', role: 'assistant', content: 'The first implementation pass is complete.', usage: { totalTokens: 60, source: 'unit-usage' } },
      },
    },
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-life',
        info: { id: 'msg-2', role: 'assistant', content: 'The second pass crosses the budget.', usage: { totalTokens: 45, source: 'unit-usage' } },
      },
    },
  });
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

  const goal = await helpers.readGoal('session-life', { stateDir });
  assert.equal(goal.status, 'budget_limited');
  assert.equal(goal.tokensUsed, 105);
}));

test('budget-limited goals resume only after the budget is raised', async () => withState(async ({ helpers, stateDir }) => {
  const budgetGoal = await helpers.setGoal('session-budget-resume', 'Resume after budget increases', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'budget-resume-goal',
    tokenBudget: 100,
  });
  await helpers.writeGoalAtomic({
    ...budgetGoal,
    status: 'budget_limited',
    tokensUsed: 105,
    continuationSuppressed: true,
    continuationSuppressedReason: 'token budget reached',
  }, { stateDir });

  const rejectedResume = await helpers.executeGoalAction(
    { action: 'resume' },
    { sessionID: 'session-budget-resume' },
    { stateDir, nowMs: 2000, includeInjectionPreview: false },
  );
  assert.match(rejectedResume, /STATUS=FAIL ACTION=resume/);
  const stillLimitedGoal = await helpers.readGoal('session-budget-resume', { stateDir });
  assert.equal(stillLimitedGoal.status, 'budget_limited');
  assert.equal(stillLimitedGoal.continuationSuppressed, true);

  await helpers.writeGoalAtomic({
    ...stillLimitedGoal,
    tokenBudget: 200,
  }, { stateDir });
  const resumed = await helpers.executeGoalAction(
    { action: 'resume' },
    { sessionID: 'session-budget-resume' },
    { stateDir, nowMs: 3000, includeInjectionPreview: false },
  );
  assert.match(resumed, /STATUS=OK ACTION=resume/);
  assert.match(resumed, /status=active/);
  const activeGoal = await helpers.readGoal('session-budget-resume', { stateDir });
  assert.equal(activeGoal.status, 'active');
  assert.equal(activeGoal.continuationSuppressed, false);
  assert.equal(activeGoal.continuationSuppressedReason, null);
}));

test('same objective after a terminal state creates a reset goal', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
  await createLifecycleGoal(helpers, stateDir);
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-life',
        info: { id: 'msg-1', role: 'assistant', content: 'The first implementation pass is complete.', usage: { totalTokens: 60, source: 'unit-usage' } },
      },
    },
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-life',
        info: { id: 'msg-2', role: 'assistant', content: 'The second pass crosses the budget.', usage: { totalTokens: 45, source: 'unit-usage' } },
      },
    },
  });
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
}));

test('missing usage payload leaves tokens unchanged and records unavailable source', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
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

  const goal = await helpers.readGoal('session-unavailable', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.tokensUsed, 0);
  assert.equal(goal.usageSource, 'unavailable');
  assert.equal(goal.lastAccountedMessageID, null);
  assert.match(goal.lastEvidence, /No usage payload/);
}));

test('retryable provider usage errors mark the goal usage-limited', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
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

  const goal = await helpers.readGoal('session-usage-limited', { stateDir });
  assert.equal(goal.status, 'usage_limited');
  assert.equal(goal.continuationSuppressed, true);
  assert.equal(goal.continuationSuppressedReason, 'usage_limited');
}));

test('retry-after parsing honors explicit units before epoch heuristics', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 5000,
  });
  await helpers.setGoal('session-retry-seconds', 'Treat explicit seconds as a delta', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'retry-seconds-goal',
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-retry-seconds',
        info: {
          error: {
            status: 429,
            retryAfter: 1000000000001,
            message: 'rate limited',
          },
        },
      },
    },
  });
  const secondsGoal = await helpers.readGoal('session-retry-seconds', { stateDir });
  assert.equal(secondsGoal.providerRetryAfterMs, 1000000000006000);

  await helpers.setGoal('session-retry-ms', 'Treat explicit milliseconds as a delta', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'retry-ms-goal',
  });
  await plugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-retry-ms',
        info: {
          error: {
            status: 429,
            retryAfterMs: 1000000000001,
            message: 'rate limited',
          },
        },
      },
    },
  });
  const msGoal = await helpers.readGoal('session-retry-ms', { stateDir });
  assert.equal(msGoal.providerRetryAfterMs, 1000000005001);
}));

test('non-usage provider errors do not suppress an active goal', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
  });
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

  const goal = await helpers.readGoal('session-non-usage-error', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.continuationSuppressed, false);
}));

test('permission.asked marks the goal blocked by prompt', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-unavailable', 'Handle missing usage data', { stateDir, nowMs: 1000, goalIdFactory: () => 'usage-goal' });
  await plugin.event({
    event: {
      type: 'permission.asked',
      properties: { sessionID: 'session-unavailable' },
    },
  });

  const goal = await helpers.readGoal('session-unavailable', { stateDir });
  assert.equal(goal.blockedByPrompt, true);
}));

test('permission.replied clears blocked-by-prompt state', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-unavailable', 'Handle missing usage data', { stateDir, nowMs: 1000, goalIdFactory: () => 'usage-goal' });
  await plugin.event({ event: { type: 'permission.asked', properties: { sessionID: 'session-unavailable' } } });
  await plugin.event({
    event: {
      type: 'permission.replied',
      properties: { sessionID: 'session-unavailable' },
    },
  });

  const goal = await helpers.readGoal('session-unavailable', { stateDir });
  assert.equal(goal.blockedByPrompt, false);
}));

test('question.asked marks the goal blocked by prompt', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-unavailable', 'Handle missing usage data', { stateDir, nowMs: 1000, goalIdFactory: () => 'usage-goal' });
  await plugin.event({
    event: {
      type: 'question.asked',
      properties: { sessionID: 'session-unavailable' },
    },
  });

  const goal = await helpers.readGoal('session-unavailable', { stateDir });
  assert.equal(goal.blockedByPrompt, true);
}));

test('question.rejected clears blocked-by-prompt state', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-unavailable', 'Handle missing usage data', { stateDir, nowMs: 1000, goalIdFactory: () => 'usage-goal' });
  await plugin.event({ event: { type: 'question.asked', properties: { sessionID: 'session-unavailable' } } });
  await plugin.event({
    event: {
      type: 'question.rejected',
      properties: { sessionID: 'session-unavailable' },
    },
  });

  const goal = await helpers.readGoal('session-unavailable', { stateDir });
  assert.equal(goal.blockedByPrompt, false);
}));

test('session.deleted flushes volatile session status before later idle handling', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
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
  let debugEntries = await readGoalEventEntries(stateDir);
  assert.ok(debugEntries.some((entry) => entry.type === 'session.status' && entry.sid === 'session-status-flush'));

  await plugin.event({
    event: {
      type: 'session.deleted',
      properties: { sessionID: 'session-status-flush' },
    },
  });
  debugEntries = await readGoalEventEntries(stateDir);
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
  const continuationEntries = await readContinuationEntries(stateDir);
  assert.equal(continuationEntries.at(-1).decision, 'would_fire');
  assert.equal(continuationEntries.at(-1).reason, 'smoke_mode');
}));

test('malformed session deletion preserves another session verifier lock', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  let releaseVerifier;
  const verifierGate = new Promise((resolve) => {
    releaseVerifier = resolve;
  });
  let verifierCalls = 0;
  const plugin = await pluginModule.default({}, {
    stateDir,
    nowMs: 1000,
    verifierTimeoutMs: 500,
    supervisorVerifier: async () => {
      verifierCalls += 1;
      await verifierGate;
      return { verdict: 'not_met', reason: 'still active', confidence: 0.5, evidence: 'still active' };
    },
  });
  const goal = await helpers.setGoal('session-lock-preserved', 'Preserve verifier lock', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'lock-preserved-goal',
  });
  await helpers.writeGoalAtomic({ ...goal, lastEvidence: 'Evidence for the pending verifier' }, { stateDir });

  const firstIdle = plugin.event({
    event: { type: 'session.idle', properties: { sessionID: 'session-lock-preserved' } },
  });
  while (verifierCalls === 0) await new Promise((resolve) => setImmediate(resolve));
  await plugin.event({ event: { type: 'session.deleted', properties: {} } });
  const secondIdle = plugin.event({
    event: { type: 'session.idle', properties: { sessionID: 'session-lock-preserved' } },
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(verifierCalls, 1);
  releaseVerifier();
  await Promise.all([firstIdle, secondIdle]);
}));

test('verifier timeout releases the session lock for a later idle event', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  let verifierCalls = 0;
  const plugin = await pluginModule.default({}, {
    stateDir,
    verifierTimeoutMs: 20,
    supervisorVerifier: async () => {
      verifierCalls += 1;
      return new Promise(() => {});
    },
  });
  const goal = await helpers.setGoal('session-timeout-lock', 'Release verifier timeout lock', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'timeout-lock-goal',
  });
  await helpers.writeGoalAtomic({ ...goal, lastEvidence: 'Evidence for timeout lock release' }, { stateDir });

  await plugin.event({
    event: { type: 'session.idle', properties: { sessionID: 'session-timeout-lock' } },
  });
  await plugin.event({
    event: { type: 'session.idle', properties: { sessionID: 'session-timeout-lock' } },
  });
  assert.equal(verifierCalls, 2);
  const after = await helpers.readGoal('session-timeout-lock', { stateDir });
  assert.equal(after.status, 'active');
  assert.equal(after.lastVerifierReason, 'verifier_timeout');
}));

test('app.disposed flushes volatile state before later idle handling', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  process.env.MK_GOAL_AUTONOMY = 'smoke';
  process.env.MK_GOAL_DEBUG = '1';
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
  const debugEntries = await readGoalEventEntries(stateDir);
  assert.ok(debugEntries.some((entry) => entry.type === 'app.disposed'));
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-disposed-flush' },
    },
  });
  const continuationEntries = await readContinuationEntries(stateDir);
  assert.equal(continuationEntries.at(-1).decision, 'would_fire');
  assert.equal(continuationEntries.at(-1).reason, 'smoke_mode');
}));

test('event errors are written to the goal events log without debug enabled', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  delete process.env.MK_GOAL_DEBUG;
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
  const debugEntries = await readGoalEventEntries(stateDir);
  const errorEntry = debugEntries.find((entry) => entry.type === 'event_error');
  assert.ok(errorEntry);
  assert.equal(errorEntry.eventType, 'message.updated');
  assert.equal(errorEntry.sid, 'session-error-observable');
  assert.match(errorEntry.error, /Failed to read goal state/);
}));

test('session.deleted archives an existing goal file exactly', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
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
    event: nativeSessionEvent('session.deleted', 'session-archive-existing'),
  });
  assert.equal(await fileExists(archiveSourcePath), false);
  const archiveTargetRaw = await readFile(archiveTargetPath, 'utf8');
  assert.equal(JSON.parse(archiveTargetRaw).goalId, 'archive-existing-goal');
  assert.deepEqual(JSON.parse(archiveTargetRaw), JSON.parse(archiveSourceRaw));
}));

test('session deletion archive failures preserve active state and write an event error', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-archive-failure', 'Preserve state when archive fails', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'archive-failure-goal',
  });
  const sourcePath = helpers.goalPathForSession('session-archive-failure', { stateDir });
  await writeFile(join(stateDir, '.archive'), 'archive path blocker', 'utf8');

  await assert.doesNotReject(() => plugin.event({
    event: nativeSessionEvent('session.deleted', 'session-archive-failure'),
  }));
  assert.equal(await fileExists(sourcePath), true);
  const entries = await readGoalEventEntries(stateDir);
  assert.ok(entries.some((entry) => entry.type === 'event_error'
    && entry.eventType === 'session.deleted'
    && entry.sid === 'session-archive-failure'));
}));

test('session.deleted does not reject when the active goal file is missing', async () => withState(async ({ pluginModule, stateDir }) => {
  const archivePlugin = await pluginModule.default({}, { stateDir });
  await assert.doesNotReject(() => archivePlugin.event({
    event: {
      type: 'session.deleted',
      properties: { sessionID: 'session-archive-missing' },
    },
  }));
}));

test('disabled plugin events leave the state directory unchanged', async () => withState(async ({ pluginModule, stateDir }) => {
  const disabledStateDir = join(stateDir, 'disabled-inert');
  process.env.MK_GOAL_PLUGIN_DISABLED = '1';
  process.env.MK_GOAL_DEBUG = '1';
  const disabledPlugin = await pluginModule.default({}, { stateDir: disabledStateDir });
  const beforeDisabled = await directorySnapshot(disabledStateDir);
  await disabledPlugin.event({
    event: { type: 'session.created', properties: { sessionID: 'session-disabled-inert' } },
  });
  await disabledPlugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-disabled-inert',
        info: { id: 'disabled-msg', role: 'assistant', content: 'disabled', usage: { totalTokens: 1 } },
      },
    },
  });
  await disabledPlugin.event({
    event: { type: 'session.idle', properties: { sessionID: 'session-disabled-inert' } },
  });
  await disabledPlugin.event({
    event: { type: 'session.deleted', properties: { sessionID: 'session-disabled-inert' } },
  });
  assert.deepEqual(await directorySnapshot(disabledStateDir), beforeDisabled);
}));

test('disabled env flips apply per call to transform and tools', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const envFlipStateDir = join(stateDir, 'env-flip');
  const envFlipPlugin = await pluginModule.default({}, { stateDir: envFlipStateDir });
  await helpers.setGoal('session-env-flip', 'Env flips must apply per call', {
    stateDir: envFlipStateDir,
    goalIdFactory: () => 'env-flip-goal',
  });
  let envFlipOutput = { system: [] };
  await envFlipPlugin['experimental.chat.system.transform']({ sessionID: 'session-env-flip' }, envFlipOutput);
  assert.equal(envFlipOutput.system.length, 1);
  process.env.MK_GOAL_PLUGIN_DISABLED = '1';
  envFlipOutput = { system: [] };
  await envFlipPlugin['experimental.chat.system.transform']({ sessionID: 'session-env-flip' }, envFlipOutput);
  assert.deepEqual(envFlipOutput.system, []);
  const disabledToolResult = await envFlipPlugin.tool.mk_goal_status.execute({}, { sessionID: 'session-env-flip' });
  assert.match(disabledToolResult, /STATUS=FAIL/);
  assert.match(disabledToolResult, /code=PLUGIN_DISABLED/);
  restoreEnv('MK_GOAL_PLUGIN_DISABLED', undefined);
  envFlipOutput = { system: [] };
  await envFlipPlugin['experimental.chat.system.transform']({ sessionID: 'session-env-flip' }, envFlipOutput);
  assert.equal(envFlipOutput.system.length, 1);
  const enabledToolResult = await envFlipPlugin.tool.mk_goal_status.execute({}, { sessionID: 'session-env-flip' });
  assert.match(enabledToolResult, /STATUS=OK/);
}));

test('archive operations serialize with queued usage updates', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const archivePlugin = await pluginModule.default({}, { stateDir });
  for (let index = 0; index < 20; index += 1) {
    const raceSessionID = `session-archive-race-${index}`;
    const raceGoalID = `archive-race-goal-${index}`;
    await helpers.setGoal(raceSessionID, 'Archive must serialize with queued usage', {
      stateDir,
      nowMs: 5000 + index,
      goalIdFactory: () => raceGoalID,
    });
    const raceSourcePath = helpers.goalPathForSession(raceSessionID, { stateDir });
    const raceArchivePath = join(stateDir, '.archive', `${helpers.sessionKeyForSession(raceSessionID)}.json`);
    const usagePromise = helpers.accountUsage(raceSessionID, raceGoalID, {
      tokenDelta: 1,
      timeDeltaSeconds: 1,
      messageID: `race-msg-${index}`,
      usageSource: 'archive-race',
    }, { stateDir, nowMs: 6000 + index });
    const archivePromise = archivePlugin.event({
      event: {
        type: 'session.deleted',
        properties: { sessionID: raceSessionID },
      },
    });
    await Promise.all([usagePromise, archivePromise]);
    assert.equal(await fileExists(raceSourcePath), false);
    assert.equal(await fileExists(raceArchivePath), true);
  }
}));

test('archive pruning removes old archived files and keeps recent files', async () => withState(async ({ helpers, stateDir }) => {
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
  const pruneTriggerModule = await importFreshPlugin('archive-prune-existing');
  const pruneTriggerPlugin = await pruneTriggerModule.default({}, { stateDir });
  await pruneTriggerPlugin.event({
    event: {
      type: 'session.deleted',
      properties: { sessionID: 'session-archive-prune-trigger' },
    },
  });
  assert.equal(await fileExists(oldArchivePath), false);
  assert.equal(await fileExists(recentArchivePath), true);
}));

test('archive prune throttling runs pruning once in a throttle window', async () => {
  const pruneStateDir = await mkdtemp(join(tmpdir(), 'mk-goal-prune-spy-'));
  try {
    const pruneModule = await importFreshPlugin('archive-prune-throttle');
    const pruneHelpers = pruneModule.default.__test;
    const pruneMetrics = {};
    const prunePlugin = await pruneModule.default({}, { stateDir: pruneStateDir, metrics: pruneMetrics });
    await pruneHelpers.setGoal('session-prune-one', 'First archive prune', { stateDir: pruneStateDir, metrics: pruneMetrics });
    await pruneHelpers.setGoal('session-prune-two', 'Second archive skips prune', { stateDir: pruneStateDir, metrics: pruneMetrics });
    pruneMetrics.pruneArchive = 0;
    await prunePlugin.event({ event: { type: 'session.deleted', properties: { sessionID: 'session-prune-one' } } });
    await prunePlugin.event({ event: { type: 'session.deleted', properties: { sessionID: 'session-prune-two' } } });
    assert.equal(pruneMetrics.pruneArchive, 1);
  } finally {
    await rm(pruneStateDir, { recursive: true, force: true });
  }
});

test('orphan sweep archives stale active files and keeps recent files', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const archiveDir = join(stateDir, '.archive');
  await mkdir(archiveDir, { recursive: true, mode: 0o700 });
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
  const staleActiveDate = new Date(staleUpdatedAtMs);
  await utimes(staleActivePath, staleActiveDate, staleActiveDate);
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
}));

test('orphan sweep does not archive a goal refreshed after the stale read', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const archiveDir = join(stateDir, '.archive');
  await mkdir(archiveDir, { recursive: true, mode: 0o700 });
  const sessionID = 'session-orphan-refresh-race';
  const objective = 'Keep refreshed active state';
  const staleUpdatedAtMs = 1000;
  const freshUpdatedAtMs = 40 * 24 * 60 * 60 * 1000;
  const activePath = helpers.goalPathForSession(sessionID, { stateDir });
  const archivePath = join(archiveDir, `${helpers.sessionKeyForSession(sessionID)}.json`);
  let refreshPromise = null;
  const metrics = new Proxy({}, {
    get(target, property) {
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      if (property === 'sweepJsonParse' && !refreshPromise) {
        refreshPromise = helpers.setGoal(sessionID, objective, {
          stateDir,
          nowMs: freshUpdatedAtMs,
          goalIdFactory: () => 'orphan-refresh-race-goal',
        });
      }
      return true;
    },
  });

  await writeFile(activePath, JSON.stringify({
    sessionId: sessionID,
    goalId: 'orphan-refresh-race-goal',
    objective,
    status: 'active',
    createdAtMs: staleUpdatedAtMs,
    updatedAtMs: staleUpdatedAtMs,
  }), 'utf8');
  const staleActiveDate = new Date(staleUpdatedAtMs);
  await utimes(activePath, staleActiveDate, staleActiveDate);

  const sweepPlugin = await pluginModule.default({}, {
    stateDir,
    nowMs: freshUpdatedAtMs,
    metrics,
  });
  await sweepPlugin.event({
    event: {
      type: 'session.created',
      properties: { sessionID: 'session-sweep-refresh-race-trigger' },
    },
  });
  assert.ok(refreshPromise, 'sweep pre-archive read should trigger the queued fresh write');
  await refreshPromise;
  const activeGoal = await helpers.readGoal(sessionID, { stateDir });
  assert.equal(activeGoal?.status, 'active');
  assert.equal(activeGoal?.updatedAtMs, freshUpdatedAtMs);
  assert.equal(await fileExists(activePath), true);
  assert.equal(await fileExists(archivePath), false);
}));

test('orphan sweep prefilter avoids parsing fresh active files', async () => {
  const freshPrefilterStateDir = await mkdtemp(join(tmpdir(), 'mk-goal-sweep-prefilter-spy-'));
  try {
    const freshPrefilterModule = await importFreshPlugin('sweep-prefilter');
    const freshPrefilterHelpers = freshPrefilterModule.default.__test;
    const freshPrefilterMetrics = {};
    const freshPrefilterPlugin = await freshPrefilterModule.default({}, { stateDir: freshPrefilterStateDir, metrics: freshPrefilterMetrics });
    const freshPrefilterPath = freshPrefilterHelpers.goalPathForSession('session-fresh-prefilter', { stateDir: freshPrefilterStateDir });
    await mkdir(freshPrefilterStateDir, { recursive: true, mode: 0o700 });
    await writeFile(freshPrefilterPath, JSON.stringify({
      sessionId: 'session-fresh-prefilter',
      goalId: 'fresh-prefilter-goal',
      objective: 'Keep fresh files out of JSON parsing',
      status: 'active',
      createdAtMs: Date.now(),
      updatedAtMs: Date.now(),
    }), 'utf8');
    await freshPrefilterPlugin.event({
      event: { type: 'session.created', properties: { sessionID: 'session-fresh-prefilter-trigger' } },
    });
    assert.equal(freshPrefilterMetrics.sweepJsonParse || 0, 0);
  } finally {
    await rm(freshPrefilterStateDir, { recursive: true, force: true });
  }
});

test('orphan sweep throttle leaves later stale active files in place', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const archiveDir = join(stateDir, '.archive');
  await mkdir(archiveDir, { recursive: true, mode: 0o700 });
  const staleUpdatedAtMs = Date.now() - (40 * 24 * 60 * 60 * 1000);
  const staleActiveDate = new Date(staleUpdatedAtMs);
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
  await utimes(throttleFirstActivePath, staleActiveDate, staleActiveDate);
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
  await utimes(throttleSecondActivePath, staleActiveDate, staleActiveDate);
  await throttlePlugin.event({
    event: {
      type: 'session.created',
      properties: { sessionID: 'session-throttle-fresh-two' },
    },
  });
  assert.equal(await fileExists(throttleSecondActivePath), true);
  assert.equal(await fileExists(throttleSecondArchivePath), false);
}));
