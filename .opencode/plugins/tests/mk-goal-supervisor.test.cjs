// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Supervisor Tests                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify verifier verdicts map to durable goal state safely.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

const testDir = dirname(__filename);
const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;

async function loadPluginModule() {
  return import(pluginUrl);
}

async function writeGoalWithEvidence(helpers, sessionID, stateDir, evidence) {
  const goal = await helpers.setGoal(sessionID, `Verify ${sessionID}`, {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => `${sessionID}-goal`,
  });
  await helpers.writeGoalAtomic({
    ...goal,
    lastEvidence: evidence,
  }, { stateDir });
}

async function writeGoalWithObjectiveAndEvidence(helpers, sessionID, stateDir, objective, evidence) {
  const goal = await helpers.setGoal(sessionID, objective, {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => `${sessionID}-goal`,
  });
  await helpers.writeGoalAtomic({
    ...goal,
    lastEvidence: evidence,
  }, { stateDir });
}

async function withVerifierEnv(value, fn) {
  const previous = process.env.MK_GOAL_VERIFIER;
  if (value === null) delete process.env.MK_GOAL_VERIFIER;
  else process.env.MK_GOAL_VERIFIER = value;
  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.MK_GOAL_VERIFIER;
    else process.env.MK_GOAL_VERIFIER = previous;
  }
}

async function withSupervisor(fn) {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-supervisor-'));
  let verifierCalls = 0;

  try {
    const plugin = await pluginModule.default({}, {
      stateDir,
      nowMs: 2000,
      supervisorVerifier: async ({ sessionID }) => {
        verifierCalls += 1;
        if (sessionID === 'session-met') {
          return {
            verdict: 'met',
            confidence: 0.92,
            reason: 'Evidence proves completion',
            evidence: 'Tests passed with api_key=plain-secret and sk-test1234567890',
          };
        }
        if (sessionID === 'session-blocked') {
          return {
            verdict: 'blocked',
            confidence: 0.8,
            reason: 'Needs user approval',
            evidence: 'Permission prompt is waiting',
          };
        }
        return {
          verdict: 'maybe',
          confidence: 0.4,
          reason: 'Ambiguous evidence',
          evidence: 'Assistant claims progress but gives no proof',
        };
      },
    });
    return await fn({ getVerifierCalls: () => verifierCalls, helpers, plugin, stateDir });
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

test('met verifier verdict completes the goal and redacts evidence', async () => withSupervisor(async ({ helpers, plugin, stateDir }) => {
  await writeGoalWithEvidence(
    helpers,
    'session-met',
    stateDir,
    'Assistant transcript says the checks passed.',
  );
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-met' },
    },
  });

  const goal = await helpers.readGoal('session-met', { stateDir });
  assert.equal(goal.status, 'complete');
  assert.equal(goal.completionSource, 'supervisor');
  assert.equal(goal.lastVerifierVerdict, 'met');
  assert.equal(goal.lastVerifierConfidence, 0.92);
  assert.equal(goal.lastVerifierSource, 'injected');
  assert.doesNotMatch(goal.lastEvidence, /plain-secret/);
  assert.doesNotMatch(goal.lastEvidence, /sk-test/);

  const statusOutput = await plugin.tool.mk_goal_status.execute({}, { sessionID: 'session-met' });
  assert.match(statusOutput, /budget_tokens_used=0/);
  assert.match(statusOutput, /budget_token_budget=none/);
  assert.match(statusOutput, /budget_usage_source=unavailable/);
  assert.match(statusOutput, /verifier_last_verdict=met/);
  assert.match(statusOutput, /verifier_source=injected/);
  assert.doesNotMatch(statusOutput, /plain-secret/);
  assert.doesNotMatch(statusOutput, /sk-test/);
}));

test('verifier evidence redacts common key blocks and high-entropy secrets conservatively', async () => withSupervisor(async ({ helpers, stateDir }) => {
  const secretCases = [
    {
      sessionID: 'session-google-key',
      leaked: 'AIzaSyD3vRx9ABCDabcdEFGHijklMNOPqrstUVW',
      pattern: /AIzaSyD3vRx9ABCDabcdEFGHijklMNOPqrstUVW/,
    },
    {
      sessionID: 'session-pem-key',
      leaked: '-----BEGIN PRIVATE KEY-----\nMIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJe\n-----END PRIVATE KEY-----',
      pattern: /BEGIN PRIVATE KEY|MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJe|END PRIVATE KEY/,
    },
    {
      sessionID: 'session-entropy-key',
      leaked: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      pattern: /0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef/,
    },
  ];

  for (const entry of secretCases) {
    await writeGoalWithEvidence(helpers, entry.sessionID, stateDir, 'Assistant transcript says the checks passed.');
    await helpers.maybeVerifyGoal(entry.sessionID, {
      stateDir,
      nowMs: 2000,
      supervisorVerifier: async () => ({
        verdict: 'met',
        confidence: 0.9,
        reason: 'Evidence proves completion',
        evidence: entry.leaked,
      }),
    });
    const goal = await helpers.readGoal(entry.sessionID, { stateDir });
    assert.equal(goal.status, 'complete');
    assert.doesNotMatch(goal.lastEvidence, entry.pattern);
    assert.match(goal.lastEvidence, /\[secret-redacted\]/);
  }

  await writeGoalWithEvidence(
    helpers,
    'session-non-secret-evidence',
    stateDir,
    'commit abc1234 updated ordinary prose without secrets',
  );
  await helpers.maybeVerifyGoal('session-non-secret-evidence', {
    stateDir,
    nowMs: 3000,
    supervisorVerifier: async () => ({
      verdict: 'met',
      confidence: 0.9,
      reason: 'Evidence proves completion',
      evidence: 'commit abc1234 updated ordinary prose without secrets',
    }),
  });
  const nonSecretGoal = await helpers.readGoal('session-non-secret-evidence', { stateDir });
  assert.match(nonSecretGoal.lastEvidence, /commit abc1234 updated ordinary prose without secrets/);
  assert.doesNotMatch(nonSecretGoal.lastEvidence, /\[secret-redacted\]/);
}));

test('blocked verifier verdict marks the goal blocked without completion source', async () => withSupervisor(async ({ helpers, plugin, stateDir }) => {
  await writeGoalWithEvidence(
    helpers,
    'session-blocked',
    stateDir,
    'Assistant transcript says approval is required.',
  );
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-blocked' },
    },
  });

  const goal = await helpers.readGoal('session-blocked', { stateDir });
  assert.equal(goal.status, 'blocked');
  assert.equal(goal.completionSource, null);
  assert.equal(goal.lastVerifierVerdict, 'blocked');
  assert.equal(goal.lastVerifierSource, 'injected');
}));

test('ambiguous verifier verdict keeps the goal active and increments iterations', async () => withSupervisor(async ({ helpers, plugin, stateDir }) => {
  await writeGoalWithEvidence(
    helpers,
    'session-ambiguous',
    stateDir,
    'Assistant transcript is too vague.',
  );
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-ambiguous' },
    },
  });

  const goal = await helpers.readGoal('session-ambiguous', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.lastVerifierVerdict, 'not_met');
  assert.equal(goal.lastVerifierSource, 'injected');
  assert.equal(goal.iterations, 1);
}));

test('absent evidence defaults to not_met without calling the verifier', async () => withSupervisor(async ({ helpers, plugin, stateDir }) => {
  await helpers.setGoal('session-absent', 'No evidence should default not met', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'session-absent-goal',
  });
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-absent' },
    },
  });

  const goal = await helpers.readGoal('session-absent', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.lastVerifierVerdict, 'not_met');
  assert.equal(goal.lastVerifierSource, 'injected');
  assert.equal(goal.iterations, 1);
}));

test('default heuristic verifier completes only explicit objective-specific evidence', async () => withVerifierEnv(null, async () => {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-default-heuristic-'));
  try {
    const plugin = await pluginModule.default({}, { stateDir, nowMs: 2000 });
    await writeGoalWithObjectiveAndEvidence(
      helpers,
      'session-default-met',
      stateDir,
      'Implement payment webhook validation',
      'Implemented payment webhook validation. Tests passed for payment webhook validation.',
    );
    await plugin.event({ event: { type: 'session.idle', properties: { sessionID: 'session-default-met' } } });

    const goal = await helpers.readGoal('session-default-met', { stateDir });
    assert.equal(goal.status, 'complete');
    assert.equal(goal.lastVerifierVerdict, 'met');
    assert.equal(goal.lastVerifierSource, 'default-heuristic');
    const statusOutput = await plugin.tool.mk_goal_status.execute({}, { sessionID: 'session-default-met' });
    assert.match(statusOutput, /verifier_source=default-heuristic/);
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}));

test('default heuristic verifier rejects adversarial weak and mixed evidence', async () => withVerifierEnv(null, async () => {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-default-negative-'));
  const cases = [
    {
      name: 'empty evidence',
      evidence: '',
      expectedReason: /No verifier evidence is available/,
    },
    {
      name: 'different objective',
      evidence: 'Completed dashboard filtering and tests passed for dashboard filtering.',
      expectedReason: /does not reference the goal objective/,
    },
    {
      name: 'mixed completion and failure',
      evidence: 'Implemented payment webhook validation, but tests failed with an error.',
      expectedReason: /blocking or incomplete-work/,
    },
    {
      name: 'generic closing remark',
      evidence: 'Done!',
      expectedReason: /too short/,
    },
    {
      name: 'truncated weak completion',
      evidence: 'Completed payment webhook...',
      expectedReason: /appears truncated/,
    },
    {
      name: 'objective repeated without completion',
      evidence: 'Payment webhook validation is the current objective.',
      expectedReason: /lacks an explicit completion signal/,
    },
    {
      name: 'investigation only',
      evidence: 'Investigated payment webhook validation and found the relevant files.',
      expectedReason: /lacks an explicit completion signal/,
    },
    {
      name: 'todo after completion phrase',
      evidence: 'Payment webhook validation completed. TODO run the tests before calling this done.',
      expectedReason: /blocking or incomplete-work/,
    },
  ];

  try {
    for (const [index, entry] of cases.entries()) {
      const sessionID = `session-negative-${index}`;
      await writeGoalWithObjectiveAndEvidence(
        helpers,
        sessionID,
        stateDir,
        'Implement payment webhook validation',
        entry.evidence,
      );
      const result = await helpers.maybeVerifyGoal(sessionID, { stateDir, nowMs: 2000 + index });
      const goal = await helpers.readGoal(sessionID, { stateDir });
      assert.equal(result.verdict, 'not_met', entry.name);
      assert.equal(result.verifierSource, 'default-heuristic', entry.name);
      assert.equal(goal.status, 'active', entry.name);
      assert.equal(goal.lastVerifierVerdict, 'not_met', entry.name);
      assert.equal(goal.lastVerifierSource, 'default-heuristic', entry.name);
      assert.match(goal.lastVerifierReason, entry.expectedReason, entry.name);
    }
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}));

test('llm verifier mode blocks when isolated session APIs are unavailable', async () => withVerifierEnv('llm', async () => {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-llm-missing-'));
  try {
    await writeGoalWithObjectiveAndEvidence(
      helpers,
      'session-llm-missing',
      stateDir,
      'Implement payment webhook validation',
      'Implemented payment webhook validation. Tests passed for payment webhook validation.',
    );
    const result = await helpers.maybeVerifyGoal('session-llm-missing', { stateDir, nowMs: 2000 });
    const goal = await helpers.readGoal('session-llm-missing', { stateDir });

    assert.equal(result.verdict, 'blocked');
    assert.equal(result.verifierSource, 'default-llm');
    assert.equal(goal.status, 'blocked');
    assert.equal(goal.lastVerifierSource, 'default-llm');
    assert.match(goal.lastVerifierReason, /isolated session APIs unavailable/);
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}));

test('llm verifier uses a response-returning isolated session and deletes it', async () => withVerifierEnv('llm', async () => {
  const pluginModule = await loadPluginModule();
  const helpers = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-llm-success-'));
  const calls = [];
  const client = {
    session: {
      async create(request) {
        calls.push(['create', request]);
        return { id: 'session-llm-verifier-temp' };
      },
      async prompt(request) {
        calls.push(['prompt', request]);
        assert.equal(request.path.id, 'session-llm-verifier-temp');
        assert.notEqual(request.path.id, 'session-llm-met');
        assert.match(request.body.parts[0].text, /Implement payment webhook validation/);
        return {
          info: { id: 'verifier-response', role: 'assistant' },
          parts: [{
            type: 'text',
            text: '{"verdict":"met","confidence":0.91,"reason":"LLM judged completion","evidence":"payment webhook validation tests passed"}',
          }],
        };
      },
      async delete(request) {
        calls.push(['delete', request]);
      },
      async promptAsync() {
        throw new Error('promptAsync must not be used by the verifier');
      },
    },
  };

  try {
    await writeGoalWithObjectiveAndEvidence(
      helpers,
      'session-llm-met',
      stateDir,
      'Implement payment webhook validation',
      'Implemented payment webhook validation. Tests passed for payment webhook validation.',
    );
    const result = await helpers.maybeVerifyGoal('session-llm-met', { stateDir, nowMs: 2000, client });
    const goal = await helpers.readGoal('session-llm-met', { stateDir });

    assert.deepEqual(calls.map(([name]) => name), ['create', 'prompt', 'delete']);
    assert.equal(calls[2][1].path.id, 'session-llm-verifier-temp');
    assert.equal(result.verdict, 'met');
    assert.equal(result.verifierSource, 'default-llm');
    assert.equal(goal.status, 'complete');
    assert.equal(goal.lastVerifierConfidence, 0.91);
    assert.equal(goal.lastVerifierSource, 'default-llm');
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}));

test('same-millisecond goal mutation makes a pending verifier result stale', async () => withSupervisor(async ({ helpers, stateDir }) => {
  await writeGoalWithEvidence(helpers, 'session-same-ms-stale', stateDir, 'Evidence before verification');
  let resolveVerifier;
  let markVerifierStarted;
  const verifierStarted = new Promise((resolve) => {
    markVerifierStarted = resolve;
  });
  const verifierGate = new Promise((resolve) => {
    resolveVerifier = resolve;
  });
  const verification = helpers.maybeVerifyGoal('session-same-ms-stale', {
    stateDir,
    nowMs: 2000,
    supervisorVerifier: async () => {
      markVerifierStarted();
      await verifierGate;
      return {
        verdict: 'met',
        confidence: 0.95,
        reason: 'Old evidence appeared complete',
        evidence: 'Old evidence appeared complete',
      };
    },
  });
  await verifierStarted;
  const beforeMutation = await helpers.readGoal('session-same-ms-stale', { stateDir });
  await helpers.accountUsage('session-same-ms-stale', beforeMutation.goalId, {
    messageID: 'same-ms-message',
    tokenDelta: 5,
    usageSource: 'test',
  }, { stateDir, nowMs: 2000 });
  resolveVerifier();

  const result = await verification;
  const goal = await helpers.readGoal('session-same-ms-stale', { stateDir });
  assert.equal(result.stale, true);
  assert.equal(goal.status, 'active');
  assert.equal(goal.tokensUsed, 5);
  assert.equal(goal.lastVerifierVerdict, 'not_evaluated');
  assert.equal(goal.verifierRunID, null);
}));

test('verifier timeout returns promptly, keeps the goal active, and ignores late settlement', async () => withSupervisor(async ({ helpers, stateDir }) => {
  await writeGoalWithEvidence(helpers, 'session-verifier-timeout', stateDir, 'Evidence for a verifier that hangs');
  let resolveLateVerifier;
  const lateVerifier = new Promise((resolve) => {
    resolveLateVerifier = resolve;
  });
  const startedAt = Date.now();
  const result = await helpers.maybeVerifyGoal('session-verifier-timeout', {
    stateDir,
    verifierTimeoutMs: 20,
    supervisorVerifier: async () => lateVerifier,
  });
  assert.ok(Date.now() - startedAt < 500);
  assert.equal(result.timedOut, true);
  assert.equal(result.reason, 'verifier_timeout');
  let goal = await helpers.readGoal('session-verifier-timeout', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.lastVerifierReason, 'verifier_timeout');

  resolveLateVerifier({
    verdict: 'met',
    confidence: 1,
    reason: 'Late completion must be ignored',
    evidence: 'Late completion must be ignored',
  });
  await new Promise((resolve) => setImmediate(resolve));
  goal = await helpers.readGoal('session-verifier-timeout', { stateDir });
  assert.equal(goal.status, 'active');
  assert.equal(goal.lastVerifierReason, 'verifier_timeout');
}));

test('verifier is called exactly for the three evidence-backed sessions', async () => withSupervisor(async ({ getVerifierCalls, helpers, plugin, stateDir }) => {
  await writeGoalWithEvidence(helpers, 'session-met', stateDir, 'Assistant transcript says the checks passed.');
  await plugin.event({ event: { type: 'session.idle', properties: { sessionID: 'session-met' } } });
  await writeGoalWithEvidence(helpers, 'session-blocked', stateDir, 'Assistant transcript says approval is required.');
  await plugin.event({ event: { type: 'session.idle', properties: { sessionID: 'session-blocked' } } });
  await writeGoalWithEvidence(helpers, 'session-ambiguous', stateDir, 'Assistant transcript is too vague.');
  await plugin.event({ event: { type: 'session.idle', properties: { sessionID: 'session-ambiguous' } } });

  await helpers.setGoal('session-absent', 'No evidence should default not met', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'session-absent-goal',
  });
  await plugin.event({
    event: {
      type: 'session.idle',
      properties: { sessionID: 'session-absent' },
    },
  });
  assert.equal(getVerifierCalls(), 3);
}));

test('verifier result envelopes use one key set for early and applied paths', async () => withSupervisor(async ({ helpers, stateDir }) => {
  const earlyResult = await helpers.maybeVerifyGoal('session-missing', { stateDir });
  await writeGoalWithEvidence(helpers, 'session-envelope', stateDir, 'Evidence is present.');
  const appliedResult = await helpers.maybeVerifyGoal('session-envelope', {
    stateDir,
    nowMs: 3000,
    supervisorVerifier: async () => ({
      verdict: 'not_met',
      confidence: 0.5,
      reason: 'Still in progress',
      evidence: 'Evidence is present.',
    }),
  });

  assert.deepEqual(Object.keys(earlyResult).sort(), Object.keys(appliedResult).sort());
  assert.deepEqual(Object.keys(earlyResult).sort(), [
    'confidence',
    'currentGoalId',
    'evidence',
    'goalId',
    'reason',
    'stale',
    'timedOut',
    'verdict',
    'verifierRunID',
    'verifierSource',
  ]);
}));

test('status transitions reject terminal resurrection and preserve known valid transitions', async () => withSupervisor(async ({ helpers, stateDir }) => {
  const pausedGoal = await helpers.setGoal('session-status-paused', 'Pause remains valid', {
    stateDir,
    nowMs: 1000,
    goalIdFactory: () => 'status-paused-goal',
  });
  const pausedResult = await helpers.markGoalStatus(pausedGoal.sessionId, 'paused', { stateDir, nowMs: 2000 });
  assert.equal(pausedResult.status, 'paused');

  const completeGoal = await helpers.setGoal('session-status-complete', 'Complete remains valid', {
    stateDir,
    nowMs: 3000,
    goalIdFactory: () => 'status-complete-goal',
  });
  const completeResult = await helpers.markGoalStatus(completeGoal.sessionId, 'complete', { stateDir, nowMs: 4000 });
  assert.equal(completeResult.status, 'complete');

  await assert.rejects(
    helpers.markGoalStatus(completeGoal.sessionId, 'active', { stateDir, nowMs: 5000 }),
    { code: 'INVALID_STATUS_TRANSITION' },
  );
  await assert.rejects(
    helpers.markGoalStatus(completeGoal.sessionId, 'paused', { stateDir, nowMs: 6000 }),
    { code: 'INVALID_STATUS_TRANSITION' },
  );
}));
