// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Capability Tests                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify additive operator-facing goal plugin capabilities.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdir, mkdtemp, readFile, readdir, rm, utimes, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { restoreEnv } = require('./helpers/continuation-log.cjs');

const testDir = dirname(__filename);
const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;
const opencodeRoot = join(testDir, '..', '..');

async function loadPluginModule() {
  return import(pluginUrl);
}

async function withState(fn) {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-capabilities-'));
  const originalAutonomy = process.env.MK_GOAL_AUTONOMY;
  const originalMaxAutoTurns = process.env.MK_GOAL_MAX_AUTO_TURNS;
  const originalMaxWallMs = process.env.MK_GOAL_MAX_WALL_MS;

  try {
    return await fn({ helpers, pluginModule, stateDir });
  } finally {
    restoreEnv('MK_GOAL_AUTONOMY', originalAutonomy);
    restoreEnv('MK_GOAL_MAX_AUTO_TURNS', originalMaxAutoTurns);
    restoreEnv('MK_GOAL_MAX_WALL_MS', originalMaxWallMs);
    await rm(stateDir, { recursive: true, force: true });
  }
}

function activeRuntimeState(sessionID) {
  return {
    inFlightContinuations: new Set(),
    blockedByPromptSessions: new Set(),
    sessionStatuses: new Map([[sessionID, 'idle']]),
  };
}

test('history lists archived goals and leaves active state untouched', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  const emptyHistory = await plugin.tool.mk_goal.execute({ action: 'history' }, {});
  assert.match(emptyHistory, /STATUS=OK ACTION=history/);
  assert.match(emptyHistory, /archive_count=0/);
  assert.deepEqual(await readdir(stateDir), []);

  await helpers.setGoal('session-history', 'Archive and list this goal', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'history-goal',
  });
  await plugin.event({ event: { type: 'session.deleted', properties: { sessionID: 'session-history' } } });
  const history = await plugin.tool.mk_goal.execute({ action: 'history' }, {});
  assert.match(history, /archive_count=1/);
  assert.match(history, /archive_0_goal_id="history-goal"/);
  assert.match(history, /archive_0_objective="Archive and list this goal"/);
  assert.equal(await helpers.readGoal('session-history', { stateDir }), null);
}));

test('doctor and health report counts, log sizes, last sweep, and orphan candidates read-only', async () => withState(async ({ helpers, stateDir }) => {
  const archiveDir = join(stateDir, '.archive');
  await mkdir(archiveDir, { recursive: true, mode: 0o700 });
  await helpers.setGoal('session-health-active', 'Active health goal', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'health-active-goal',
  });
  await writeFile(join(archiveDir, 'archived.json'), '{"goalId":"archived"}\n', 'utf8');
  await writeFile(join(stateDir, '.continuation.log'), '{"decision":"suppressed"}\n', 'utf8');
  await writeFile(join(stateDir, '.goal-events.log'), '{"type":"session.created"}\n', 'utf8');

  const stalePath = helpers.goalPathForSession('session-health-stale', { stateDir });
  const staleUpdatedAtMs = Date.now() - (40 * 24 * 60 * 60 * 1000);
  await writeFile(stalePath, JSON.stringify({
    sessionId: 'session-health-stale',
    goalId: 'health-stale-goal',
    objective: 'Stale health candidate',
    status: 'active',
    createdAtMs: staleUpdatedAtMs,
    updatedAtMs: staleUpdatedAtMs,
  }), 'utf8');
  const staleDate = new Date(staleUpdatedAtMs);
  await utimes(stalePath, staleDate, staleDate);

  const doctor = await helpers.executeGoalAction(
    { action: 'doctor' },
    {},
    { stateDir, runtimeState: { lastSweepAtMs: 12345 } },
  );
  assert.match(doctor, /STATUS=OK ACTION=doctor/);
  assert.match(doctor, /active_state_file_count=2/);
  assert.match(doctor, /archive_file_count=1/);
  assert.match(doctor, /continuation_log_bytes=26/);
  assert.match(doctor, /goal_events_log_bytes=27/);
  assert.match(doctor, /last_sweep_at_ms=12345/);
  assert.match(doctor, /orphan_candidate_count=1/);

  const health = await helpers.executeGoalAction({ action: 'health' }, {}, { stateDir });
  assert.match(health, /STATUS=OK ACTION=health/);
}));

test('resume reactivates paused and usage-limited goals but rejects terminal resurrection', async () => withState(async ({ helpers, stateDir }) => {
  const ctx = { sessionID: 'session-resume' };
  await helpers.executeGoalAction({ action: 'set', objective: 'Resume round trip' }, ctx, { stateDir, nowMs: 1000, includeInjectionPreview: false });
  await helpers.executeGoalAction({ action: 'pause', reason: 'operator pause' }, ctx, { stateDir, nowMs: 2000, includeInjectionPreview: false });
  let resume = await helpers.executeGoalAction({ action: 'resume' }, ctx, { stateDir, nowMs: 3000, includeInjectionPreview: false });
  assert.match(resume, /STATUS=OK ACTION=resume/);
  assert.match(resume, /status=active/);
  let goal = await helpers.readGoal(ctx.sessionID, { stateDir });
  assert.equal(goal.continuationSuppressed, false);
  assert.equal(goal.continuationSuppressedReason, null);

  await helpers.writeGoalAtomic({
    ...goal,
    status: 'usage_limited',
    continuationSuppressed: true,
    continuationSuppressedReason: 'usage_limited',
    providerRetryAfterMs: 5000,
  }, { stateDir });
  resume = await helpers.executeGoalAction({ action: 'resume' }, ctx, { stateDir, nowMs: 4000, includeInjectionPreview: false });
  assert.match(resume, /STATUS=OK ACTION=resume/);
  goal = await helpers.readGoal(ctx.sessionID, { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.providerRetryAfterMs, null);

  await helpers.executeGoalAction({ action: 'complete' }, ctx, { stateDir, nowMs: 5000, includeInjectionPreview: false });
  const rejected = await helpers.executeGoalAction({ action: 'resume' }, ctx, { stateDir, nowMs: 6000, includeInjectionPreview: false });
  assert.match(rejected, /STATUS=FAIL ACTION=resume/);
  assert.match(rejected, /code=INVALID_STATUS_TRANSITION/);
  goal = await helpers.readGoal(ctx.sessionID, { stateDir });
  assert.equal(goal.status, 'complete');
}));

test('token budget appears in status and invalid set budgets fail closed', async () => withState(async ({ helpers, stateDir }) => {
  const ctx = { sessionID: 'session-budget-status' };
  const set = await helpers.executeGoalAction(
    { action: 'set', objective: 'Budget status goal', tokenBudget: 321 },
    ctx,
    { stateDir, nowMs: 1000, includeInjectionPreview: false },
  );
  assert.match(set, /STATUS=OK ACTION=set/);
  assert.match(set, /token_budget=321/);
  assert.match(set, /budget_token_budget=321/);

  const invalid = await helpers.executeGoalAction(
    { action: 'set', objective: 'Invalid budget status goal', tokenBudget: 0 },
    ctx,
    { stateDir, nowMs: 2000, includeInjectionPreview: false },
  );
  assert.match(invalid, /STATUS=FAIL ACTION=set/);
  assert.match(invalid, /code=INVALID_TOKEN_BUDGET/);
}));

test('env caps configure new goals and status exposes remaining budgets', async () => withState(async ({ helpers, stateDir }) => {
  process.env.MK_GOAL_MAX_AUTO_TURNS = '3';
  process.env.MK_GOAL_MAX_WALL_MS = '4000';
  process.env.MK_GOAL_AUTONOMY = 'active';
  const ctx = { sessionID: 'session-env-caps' };
  await helpers.executeGoalAction({ action: 'set', objective: 'Use env caps' }, ctx, { stateDir, nowMs: 1000, includeInjectionPreview: false });
  const status = await helpers.executeGoalStatus(ctx, { stateDir, nowMs: 2000, includeInjectionPreview: false });
  assert.match(status, /max_auto_turns=3/);
  assert.match(status, /remaining_auto_turns=3/);
  assert.match(status, /max_wall_ms=4000/);
  assert.match(status, /remaining_wall_ms=3000/);

  const cappedGoal = await helpers.readGoal(ctx.sessionID, { stateDir });
  await helpers.writeGoalAtomic({ ...cappedGoal, autoTurnsUsed: 3 }, { stateDir });
  const result = await helpers.maybeContinueGoal(ctx.sessionID, {
    stateDir,
    nowMs: 2500,
    client: { session: { async promptAsync() {} } },
    runtimeState: activeRuntimeState(ctx.sessionID),
  });
  assert.equal(result.reason, 'auto_turn_cap_reached');
}));

test('provider-limit detection accepts 429 variants and quota patterns only', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  const cases = [
    { name: 'strict-number', error: { name: 'APIError', data: { statusCode: 429 } }, limited: true },
    { name: 'string-code', error: { name: 'APIError', data: { statusCode: '429' } }, limited: true },
    { name: 'other-class-status', error: { name: 'ProviderError', status: 429 }, limited: true },
    { name: 'quota-message', error: { name: 'ProviderError', message: 'insufficient quota for this request' }, limited: true },
    { name: 'non-limit-status', error: { name: 'ProviderError', statusCode: 400, message: 'bad request' }, limited: false },
    { name: 'non-limit-message', error: { name: 'ProviderAuthError', data: { message: 'bad key' } }, limited: false },
  ];

  for (const testCase of cases) {
    const sessionID = `session-provider-${testCase.name}`;
    const plugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
    await helpers.setGoal(sessionID, `Provider matrix ${testCase.name}`, {
      stateDir,
      nowMs: 1000,
      goalIdFactory: () => `provider-${testCase.name}`,
    });
    await plugin.event({
      event: {
        type: 'message.updated',
        properties: {
          sessionID,
          info: { error: testCase.error },
        },
      },
    });
    const goal = await helpers.readGoal(sessionID, { stateDir });
    assert.equal(goal.status, testCase.limited ? 'usage_limited' : 'active', testCase.name);
    assert.equal(goal.continuationSuppressed, testCase.limited, testCase.name);
  }
}));

test('retry-after deadline recovers lazily and malformed payloads stay suppressed', async () => withState(async ({ helpers, pluginModule, stateDir }) => {
  process.env.MK_GOAL_AUTONOMY = 'active';
  const retryPlugin = await pluginModule.default({}, { stateDir, nowMs: 1000 });
  await helpers.setGoal('session-retry-after', 'Recover after retry-after', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'retry-after-goal',
  });
  await retryPlugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-retry-after',
        info: { error: { name: 'APIError', data: { statusCode: 429, retryAfter: 1 } } },
      },
    },
  });
  let goal = await helpers.readGoal('session-retry-after', { stateDir });
  assert.equal(goal.status, 'usage_limited');
  assert.equal(goal.providerRetryAfterMs, 2000);
  let promptCalls = 0;
  const recovered = await helpers.maybeContinueGoal('session-retry-after', {
    stateDir,
    nowMs: 2500,
    client: { session: { async promptAsync() { promptCalls += 1; } } },
    runtimeState: activeRuntimeState('session-retry-after'),
  });
  assert.equal(recovered.decision, 'fired');
  assert.equal(promptCalls, 1);
  goal = await helpers.readGoal('session-retry-after', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.continuationSuppressed, false);
  assert.equal(goal.providerRetryAfterMs, null);

  const malformedPlugin = await pluginModule.default({}, { stateDir, nowMs: 3000 });
  await helpers.setGoal('session-retry-malformed', 'Stay suppressed after malformed retry-after', {
    stateDir,
    nowMs: 3000,
    goalIdFactory: () => 'retry-malformed-goal',
  });
  await malformedPlugin.event({
    event: {
      type: 'message.updated',
      properties: {
        sessionID: 'session-retry-malformed',
        info: { error: { name: 'APIError', data: { statusCode: 429, retryAfter: 'not-a-date' } } },
      },
    },
  });
  const malformed = await helpers.maybeContinueGoal('session-retry-malformed', {
    stateDir,
    nowMs: 10000,
    client: { session: { async promptAsync() { throw new Error('must stay suppressed'); } } },
    runtimeState: activeRuntimeState('session-retry-malformed'),
  });
  goal = await helpers.readGoal('session-retry-malformed', { stateDir });
  assert.equal(goal.status, 'usage_limited');
  assert.equal(goal.providerRetryAfterMs, null);
  assert.equal(malformed.reason, 'goal_not_active');
}));

test('goal command documentation routes new verbs and budget validation', async () => {
  const commandDoc = await readFile(join(opencodeRoot, 'commands', 'goal-opencode.md'), 'utf8');
  assert.match(commandDoc, /set <objective> \[--budget N\]/);
  assert.match(commandDoc, /mk_goal\(\{ action: "history" \}\)/);
  assert.match(commandDoc, /mk_goal\(\{ action: "doctor" \}\)/);
  assert.match(commandDoc, /mk_goal\(\{ action: "health" \}\)/);
  assert.match(commandDoc, /mk_goal\(\{ action: "resume" \}\)/);
  assert.match(commandDoc, /code=INVALID_TOKEN_BUDGET/);
});
