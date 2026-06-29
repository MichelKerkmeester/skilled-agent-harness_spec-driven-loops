// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Supervisor Tests                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify verifier verdicts map to durable goal state safely.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join } = require('node:path');
const { pathToFileURL } = require('node:url');

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

async function main() {
  const testDir = dirname(__filename);
  const pluginUrl = pathToFileURL(join(testDir, '..', 'mk-goal.js')).href;
  const pluginModule = await import(pluginUrl);
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

    let goal = await helpers.readGoal('session-met', { stateDir });
    assert.equal(goal.status, 'complete');
    assert.equal(goal.completionSource, 'supervisor');
    assert.equal(goal.lastVerifierVerdict, 'met');
    assert.equal(goal.lastVerifierConfidence, 0.92);
    assert.doesNotMatch(goal.lastEvidence, /plain-secret/);
    assert.doesNotMatch(goal.lastEvidence, /sk-test/);

    const statusOutput = await plugin.tool.mk_goal_status.execute({}, { sessionID: 'session-met' });
    assert.match(statusOutput, /budget_tokens_used=0/);
    assert.match(statusOutput, /budget_token_budget=none/);
    assert.match(statusOutput, /budget_usage_source=unavailable/);
    assert.match(statusOutput, /verifier_last_verdict=met/);
    assert.doesNotMatch(statusOutput, /plain-secret/);
    assert.doesNotMatch(statusOutput, /sk-test/);

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

    goal = await helpers.readGoal('session-blocked', { stateDir });
    assert.equal(goal.status, 'blocked');
    assert.equal(goal.completionSource, null);
    assert.equal(goal.lastVerifierVerdict, 'blocked');

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

    goal = await helpers.readGoal('session-ambiguous', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.lastVerifierVerdict, 'not_met');
    assert.equal(goal.iterations, 1);

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

    goal = await helpers.readGoal('session-absent', { stateDir });
    assert.equal(goal.status, 'active');
    assert.equal(goal.lastVerifierVerdict, 'not_met');
    assert.equal(goal.iterations, 1);
    assert.equal(verifierCalls, 3);
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
