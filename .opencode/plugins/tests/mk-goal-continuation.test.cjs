// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Continuation Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify default-off autonomy gates and continuation caps.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chmod, mkdir, mkdtemp, readFile, rm, utimes, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { readContinuationEntries, restoreEnv } = require('./helpers/continuation-log.cjs');

const testDir = dirname(__filename);
const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;

async function loadPluginModule() {
  return import(pluginUrl);
}

async function withState(fn) {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-continuation-'));
  const originalAutonomy = process.env.MK_GOAL_AUTONOMY;
  const originalDebug = process.env.MK_GOAL_DEBUG;

  try {
    return await fn({ helpers, pluginModule, stateDir });
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    restoreEnv('MK_GOAL_DEBUG', originalDebug);
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

test('default autonomy suppresses continuation without logging', async () => withState(async ({ helpers, stateDir }) => {
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
  for (let index = 0; index < 5; index += 1) {
    result = await helpers.maybeContinueGoal('session-default', {
      stateDir,
      nowMs: 2100 + index,
      client: noFireClient,
    });
    assert.equal(result.reason, 'autonomy_disabled');
  }
  const entries = await readContinuationEntries(stateDir);
  assert.equal(entries.length, 0);
}));

test('passive autonomy remains a kill switch without logging', async () => withState(async ({ helpers, stateDir }) => {
  let promptCalls = 0;
  const noFireClient = {
    session: {
      async promptAsync() {
        promptCalls += 1;
      },
    },
  };

  process.env.MK_GOAL_AUTONOMY = 'passive';
  await helpers.setGoal('session-passive', 'Passive mode must remain a kill switch', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'passive-goal',
  });
  const result = await helpers.maybeContinueGoal('session-passive', {
    stateDir,
    nowMs: 2000,
    client: noFireClient,
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'autonomy_passive');
  assert.equal(promptCalls, 0);
  const entries = await readContinuationEntries(stateDir);
  assert.equal(entries.length, 0);
}));

test('smoke mode logs would-fire continuations and event metadata', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  let promptCalls = 0;
  const noFireClient = {
    session: {
      async promptAsync() {
        promptCalls += 1;
      },
    },
  };
  const pruneTestNowMs = 120 * 24 * 60 * 60 * 1000;
  const staleDate = new Date(0);
  await writeFile(join(stateDir, '.continuation.log'), '{"stale":true}\n', 'utf8');
  await writeFile(join(stateDir, '.goal-events.log'), '{"stale":true}\n', 'utf8');
  await utimes(join(stateDir, '.continuation.log'), staleDate, staleDate);
  await utimes(join(stateDir, '.goal-events.log'), staleDate, staleDate);

  process.env.MK_GOAL_AUTONOMY = 'smoke';
  await helpers.setGoal('session-smoke', 'Smoke mode logs without prompting', {
    stateDir,
    nowMs: pruneTestNowMs - 1000,
    goalIdFactory: () => 'smoke-goal',
  });
  const result = await helpers.maybeContinueGoal('session-smoke', {
    stateDir,
    nowMs: pruneTestNowMs,
    client: noFireClient,
  });
  assert.equal(result.decision, 'would_fire');
  assert.equal(result.reason, 'smoke_mode');
  assert.equal(promptCalls, 0);

  const smokePlugin = await pluginModule.default({ client: noFireClient }, {
    stateDir,
    nowMs: pruneTestNowMs + 100,
    autonomy: 'smoke',
  });
  await helpers.setGoal('session-smoke-event', 'Smoke mode logs through session idle', {
    stateDir,
    nowMs: pruneTestNowMs - 1000,
    goalIdFactory: () => 'smoke-event-goal',
  });
  await smokePlugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-smoke-event' },
    },
  });
  const entries = await readContinuationEntries(stateDir);
  assert.equal(entries.length, 2);
  assert.equal(entries.at(-1).sid, 'session-smoke-event');
  assert.equal(entries.at(-1).decision, 'would_fire');
  assert.equal(entries.at(-1).reason, 'smoke_mode');
  assert.equal(entries.at(-1).autoTurnsUsed, 0);
  assert.equal(entries.at(-1).goalId, 'smoke-event-goal');
  assert.match(entries.at(-1).ts, /^\d{4}-\d{2}-\d{2}T/);

  process.env.MK_GOAL_DEBUG = '1';
  await smokePlugin.event({
    event: {
      type: 'session.created',
      properties: { sessionID: 'session-smoke-event' },
    },
  });
  const eventEntries = await readGoalEventEntries(stateDir);
  assert.equal(eventEntries.length, 1);
  assert.equal(eventEntries[0].type, 'session.created');
  assert.equal(eventEntries[0].goalId, null);
  assert.match(eventEntries[0].ts, /^\d{4}-\d{2}-\d{2}T/);
}));

test('active autonomy dispatches promptAsync with the requested directory', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const promptRequests = [];
  const activeDirectory = join(stateDir, 'active-directory');
  await mkdir(activeDirectory, { recursive: true });
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
  const result = await helpers.maybeContinueGoal('session-active', {
    stateDir,
    nowMs: 3000,
    client: activeClient,
    directory: activeDirectory,
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
  assert.equal(promptRequests[0].query.directory, activeDirectory);
  assert.match(promptRequests[0].body.parts[0].text, /Submit the continuation prompt/);
  const goal = await helpers.readGoal('session-active', { stateDir });
  assert.equal(goal.autoTurnsUsed, 1);
}));

test('path-like continuation directory is preserved unchanged', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const pathLikeDirectory = join(stateDir, 'user:workspace', 'cafe\u0301');
  await mkdir(pathLikeDirectory, { recursive: true });
  const pathLikeRequests = [];
  await helpers.setGoal('session-path-like-directory', 'Preserve path-like continuation directory', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'path-like-directory-goal',
  });
  const result = await helpers.maybeContinueGoal('session-path-like-directory', {
    stateDir,
    nowMs: 3200,
    directory: pathLikeDirectory,
    client: {
      session: {
        async promptAsync(request) {
          pathLikeRequests.push(request);
        },
      },
    },
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-path-like-directory', 'idle']]),
    },
  });
  assert.equal(result.decision, 'fired');
  assert.equal(pathLikeRequests[0].query.directory, pathLikeDirectory);
}));

test('concurrent idle continuation attempts acquire only one prompt reservation', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const concurrentRequests = [];
  const concurrentClient = {
    session: {
      async promptAsync(request) {
        concurrentRequests.push(request);
      },
    },
  };
  const concurrentState = {
    inFlightContinuations: new Set(),
    blockedByPromptSessions: new Set(),
    sessionStatuses: new Map([['session-concurrent', 'idle']]),
  };
  await helpers.setGoal('session-concurrent', 'Only one concurrent idle continuation may fire', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'concurrent-goal',
  });
  const concurrentResults = await Promise.all(Array.from({ length: 20 }, () => helpers.maybeContinueGoal('session-concurrent', {
    stateDir,
    nowMs: 3200,
    client: concurrentClient,
    runtimeState: concurrentState,
  })));
  assert.equal(concurrentRequests.length, 1);
  assert.equal(concurrentResults.filter((entry) => entry.decision === 'fired').length, 1);
  assert.equal(concurrentResults.filter((entry) => entry.reason === 'continuation_in_flight').length, 19);
  const goal = await helpers.readGoal('session-concurrent', { stateDir });
  assert.equal(goal.autoTurnsUsed, 1);
}));

test('stale verifier results suppress the old continuation without prompting', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  let stalePromptCalls = 0;
  const staleGoalIds = ['stale-old-goal', 'stale-new-goal'];
  const staleOptions = {
    stateDir,
    nowMs: 3500,
    goalIdFactory: () => staleGoalIds.shift() || 'stale-extra-goal',
  };
  staleOptions.supervisorVerifier = async () => {
    await helpers.setGoal('session-stale-verifier', 'Replacement goal after verifier started', staleOptions);
    return {
      verdict: 'not_met',
      confidence: 0.9,
      reason: 'Old verifier result must not continue the new goal',
      evidence: 'Old evidence only',
    };
  };
  const stalePlugin = await pluginModule.default({
    client: {
      session: {
        async promptAsync() {
          stalePromptCalls += 1;
        },
      },
    },
  }, staleOptions);
  const staleOldGoal = await helpers.setGoal('session-stale-verifier', 'Original goal before verifier', staleOptions);
  await helpers.writeGoalAtomic({
    ...staleOldGoal,
    lastEvidence: 'Evidence for the original goal',
  }, { stateDir });
  await stalePlugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-stale-verifier' },
    },
  });
  const goal = await helpers.readGoal('session-stale-verifier', { stateDir });
  assert.equal(goal.goalId, 'stale-new-goal');
  assert.equal(goal.objective, 'Replacement goal after verifier started');
  assert.equal(stalePromptCalls, 0);
  const entries = await readContinuationEntries(stateDir);
  assert.equal(entries.at(-1).decision, 'suppressed');
  assert.equal(entries.at(-1).reason, 'stale_verifier_result');
}));

test('auto-turn cap suppresses further continuation and preserves usage count', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
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
  const result = await helpers.maybeContinueGoal('session-cap', {
    stateDir,
    nowMs: 4000,
    client: capClient,
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'auto_turn_cap_reached');
  const goal = await helpers.readGoal('session-cap', { stateDir });
  assert.equal(goal.autoTurnsUsed, 8);
}));

test('failed continuation write releases the in-flight reservation', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const promptRequests = [];
  const activeClient = {
    session: {
      async promptAsync(request) {
        promptRequests.push(request);
      },
    },
  };
  await helpers.setGoal('session-reserve-error', 'Release reservation after failed write', {
    stateDir,
    nowMs: 6000,
    goalIdFactory: () => 'reserve-error-goal',
  });
  const reservationState = {
    inFlightContinuations: new Set(),
    blockedByPromptSessions: new Set(),
    sessionStatuses: new Map([['session-reserve-error', 'idle']]),
  };
  await chmod(stateDir, 0o500);
  try {
    await assert.rejects(
      helpers.maybeContinueGoal('session-reserve-error', {
        stateDir,
        nowMs: 7000,
        client: activeClient,
        runtimeState: reservationState,
      }),
      { code: 'WRITE_GOAL_FAILED' },
    );
  } finally {
    await chmod(stateDir, 0o700);
  }
  assert.equal(reservationState.inFlightContinuations.has('session-reserve-error'), false);
}));

test('auto-turn cap remains unchanged on repeated suppression', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
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
  const result = await helpers.maybeContinueGoal('session-cap', {
    stateDir,
    nowMs: 5000,
    client: capClient,
  });
  assert.equal(result.decision, 'suppressed');
  const goal = await helpers.readGoal('session-cap', { stateDir });
  assert.equal(goal.autoTurnsUsed, 8);
}));

test('missing session id suppresses continuation', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const capClient = {
    session: {
      async promptAsync() {
        throw new Error('cap test should not prompt');
      },
    },
  };
  const result = await helpers.maybeContinueGoal(null, {
    stateDir,
    nowMs: 5000,
    client: capClient,
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'missing_session_id');
}));

test('missing promptAsync suppresses and records the reason', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  await helpers.setGoal('session-missing-client', 'Suppress when promptAsync is unavailable', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'missing-client-goal',
  });
  const result = await helpers.maybeContinueGoal('session-missing-client', {
    stateDir,
    nowMs: 5000,
    client: { session: {} },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'prompt_async_unavailable');
  const goal = await helpers.readGoal('session-missing-client', { stateDir });
  assert.equal(goal.continuationSuppressed, true);
  assert.equal(goal.continuationSuppressedReason, 'prompt_async_unavailable');
}));

test('in-flight runtime state suppresses duplicate continuation attempts', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  await helpers.setGoal('session-in-flight', 'Suppress duplicate continuation attempts', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'in-flight-goal',
  });
  const result = await helpers.maybeContinueGoal('session-in-flight', {
    stateDir,
    nowMs: 5000,
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(['session-in-flight']),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-in-flight', 'idle']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'continuation_in_flight');
  const goal = await helpers.readGoal('session-in-flight', { stateDir });
  assert.equal(goal.autoTurnsUsed, 0);
}));

test('blocked-by-prompt state suppresses continuation', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  const blockedGoal = await helpers.setGoal('session-blocked-prompt', 'Wait while permission is pending', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'blocked-prompt-goal',
  });
  await helpers.writeGoalAtomic({
    ...blockedGoal,
    blockedByPrompt: true,
  }, { stateDir });
  const result = await helpers.maybeContinueGoal('session-blocked-prompt', {
    stateDir,
    nowMs: 5000,
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-blocked-prompt', 'idle']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'permission_or_question_block');
  const goal = await helpers.readGoal('session-blocked-prompt', { stateDir });
  assert.equal(goal.continuationSuppressedReason, 'permission_or_question_block');
}));

test('busy session status suppresses continuation', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  await helpers.setGoal('session-runtime-busy', 'Do not continue while the runtime is busy', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'runtime-busy-goal',
  });
  const result = await helpers.maybeContinueGoal('session-runtime-busy', {
    stateDir,
    nowMs: 5000,
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-runtime-busy', 'busy']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'session_busy');
  const goal = await helpers.readGoal('session-runtime-busy', { stateDir });
  assert.equal(goal.continuationSuppressedReason, 'session_busy');
}));

test('continuation cooldown suppresses too-soon retries', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  const cooldownGoal = await helpers.setGoal('session-cooldown', 'Respect the continuation cooldown', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'cooldown-goal',
  });
  await helpers.writeGoalAtomic({
    ...cooldownGoal,
    lastContinuationAtMs: 4900,
  }, { stateDir });
  const result = await helpers.maybeContinueGoal('session-cooldown', {
    stateDir,
    nowMs: 5000,
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-cooldown', 'idle']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'cooldown');
}));

test('wall-clock cap suppresses continuation and records durable state', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  const wallClockGoal = await helpers.setGoal('session-wall-clock', 'Stop after the wall clock cap', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'wall-clock-goal',
  });
  await helpers.writeGoalAtomic({
    ...wallClockGoal,
    startedAtMs: 1000,
  }, { stateDir });
  const result = await helpers.maybeContinueGoal('session-wall-clock', {
    stateDir,
    nowMs: 1000 + (30 * 60 * 1000),
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-wall-clock', 'idle']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'wall_clock_cap_reached');
  const goal = await helpers.readGoal('session-wall-clock', { stateDir });
  assert.equal(goal.continuationSuppressed, true);
  assert.equal(goal.continuationSuppressedReason, 'wall_clock_cap_reached');
}));

test('token budget exhaustion suppresses continuation and logs the reason', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const activeClient = {
    session: {
      async promptAsync() {},
    },
  };
  const budgetGoal = await helpers.setGoal('session-budget', 'Stop when token budget is exhausted', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'budget-goal',
    tokenBudget: 100,
  });
  await helpers.writeGoalAtomic({
    ...budgetGoal,
    tokensUsed: 100,
  }, { stateDir });
  const result = await helpers.maybeContinueGoal('session-budget', {
    stateDir,
    nowMs: 5000,
    client: activeClient,
    runtimeState: {
      inFlightContinuations: new Set(),
      blockedByPromptSessions: new Set(),
      sessionStatuses: new Map([['session-budget', 'idle']]),
    },
  });
  assert.equal(result.decision, 'suppressed');
  assert.equal(result.reason, 'budget_exhausted');
  const goal = await helpers.readGoal('session-budget', { stateDir });
  assert.equal(goal.status, 'budget_limited');
  assert.equal(goal.continuationSuppressed, true);
  assert.equal(goal.continuationSuppressedReason, 'budget_exhausted');
  assert.equal(goal.autoTurnsUsed, 0);

  const entries = await readContinuationEntries(stateDir);
  assert.equal(entries.at(-1).reason, 'budget_exhausted');
  assert.equal(entries.at(-1).autoTurnsUsed, 0);
}));
