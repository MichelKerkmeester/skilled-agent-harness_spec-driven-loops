// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Continuation Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify default-off autonomy gates and continuation caps.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { chmod, mkdtemp, readFile, rm } = require('node:fs/promises');
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

    const smokePlugin = await pluginModule.default({ client: noFireClient }, {
      stateDir,
      nowMs: 2100,
      autonomy: 'smoke',
    });
    await helpers.setGoal('session-smoke-event', 'Smoke mode logs through session idle', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'smoke-event-goal',
    });
    await smokePlugin.event({
      event: {
        type: 'session.idle',
        properties: { sessionID: 'session-smoke-event' },
      },
    });
    entries = await readContinuationEntries(stateDir);
    assert.deepEqual(entries.at(-1), {
      sid: 'session-smoke-event',
      decision: 'would_fire',
      reason: 'smoke_mode',
      autoTurnsUsed: 0,
    });

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
    goal = await helpers.readGoal('session-stale-verifier', { stateDir });
    assert.equal(goal.goalId, 'stale-new-goal');
    assert.equal(goal.objective, 'Replacement goal after verifier started');
    assert.equal(stalePromptCalls, 0);
    entries = await readContinuationEntries(stateDir);
    assert.equal(entries.at(-1).decision, 'suppressed');
    assert.equal(entries.at(-1).reason, 'stale_verifier_result');

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

    result = await helpers.maybeContinueGoal('session-cap', {
      stateDir,
      nowMs: 5000,
      client: capClient,
    });
    assert.equal(result.decision, 'suppressed');
    goal = await helpers.readGoal('session-cap', { stateDir });
    assert.equal(goal.autoTurnsUsed, 8);

    result = await helpers.maybeContinueGoal(null, {
      stateDir,
      nowMs: 5000,
      client: capClient,
    });
    assert.equal(result.decision, 'suppressed');
    assert.equal(result.reason, 'missing_session_id');

    await helpers.setGoal('session-missing-client', 'Suppress when promptAsync is unavailable', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'missing-client-goal',
    });
    result = await helpers.maybeContinueGoal('session-missing-client', {
      stateDir,
      nowMs: 5000,
      client: { session: {} },
    });
    assert.equal(result.decision, 'suppressed');
    assert.equal(result.reason, 'prompt_async_unavailable');
    goal = await helpers.readGoal('session-missing-client', { stateDir });
    assert.equal(goal.continuationSuppressed, true);
    assert.equal(goal.continuationSuppressedReason, 'prompt_async_unavailable');

    await helpers.setGoal('session-in-flight', 'Suppress duplicate continuation attempts', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'in-flight-goal',
    });
    result = await helpers.maybeContinueGoal('session-in-flight', {
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
    goal = await helpers.readGoal('session-in-flight', { stateDir });
    assert.equal(goal.autoTurnsUsed, 0);

    const blockedGoal = await helpers.setGoal('session-blocked-prompt', 'Wait while permission is pending', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'blocked-prompt-goal',
    });
    await helpers.writeGoalAtomic({
      ...blockedGoal,
      blockedByPrompt: true,
    }, { stateDir });
    result = await helpers.maybeContinueGoal('session-blocked-prompt', {
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
    goal = await helpers.readGoal('session-blocked-prompt', { stateDir });
    assert.equal(goal.continuationSuppressedReason, 'permission_or_question_block');

    await helpers.setGoal('session-runtime-busy', 'Do not continue while the runtime is busy', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'runtime-busy-goal',
    });
    result = await helpers.maybeContinueGoal('session-runtime-busy', {
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
    goal = await helpers.readGoal('session-runtime-busy', { stateDir });
    assert.equal(goal.continuationSuppressedReason, 'session_busy');

    const cooldownGoal = await helpers.setGoal('session-cooldown', 'Respect the continuation cooldown', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'cooldown-goal',
    });
    await helpers.writeGoalAtomic({
      ...cooldownGoal,
      lastContinuationAtMs: 4900,
    }, { stateDir });
    result = await helpers.maybeContinueGoal('session-cooldown', {
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

    const wallClockGoal = await helpers.setGoal('session-wall-clock', 'Stop after the wall clock cap', {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => 'wall-clock-goal',
    });
    await helpers.writeGoalAtomic({
      ...wallClockGoal,
      startedAtMs: 1000,
    }, { stateDir });
    result = await helpers.maybeContinueGoal('session-wall-clock', {
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
    goal = await helpers.readGoal('session-wall-clock', { stateDir });
    assert.equal(goal.continuationSuppressed, true);
    assert.equal(goal.continuationSuppressedReason, 'wall_clock_cap_reached');

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
    result = await helpers.maybeContinueGoal('session-budget', {
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
    goal = await helpers.readGoal('session-budget', { stateDir });
    assert.equal(goal.status, 'budget_limited');
    assert.equal(goal.continuationSuppressed, true);
    assert.equal(goal.continuationSuppressedReason, 'budget_exhausted');
    assert.equal(goal.autoTurnsUsed, 0);

    entries = await readContinuationEntries(stateDir);
    assert.equal(entries.at(-1).reason, 'budget_exhausted');
    assert.equal(entries.at(-1).autoTurnsUsed, 0);
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    await rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
