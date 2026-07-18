#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Recovery Ladder Validation Harness                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const {
  DEFER_REASONS,
  RUNG_NAMES,
  evaluateRecovery,
} = require('../lib/recovery-ladder.cjs');
const {
  buildTypedRouteGold,
  projectCompatibility,
} = require('../lib/compatibility-projector.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');
const IMPLEMENTATION_ROOT = path.resolve(PHASE_ROOT, '..');
const REPO_ROOT = path.resolve(PHASE_ROOT, '../../../../../../..');
const FIXTURE_PATH = path.join(PHASE_ROOT, 'fixtures', 'recovery-cases.v1.json');
const TYPED_GOLD_PATH = path.join(PHASE_ROOT, 'fixtures', 'typed-route-gold.v1.json');
const CONTRACT_PATH = path.join(PHASE_ROOT, 'recovery-ladder.v1.json');
const SCORE_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'score-skill-benchmark.cjs'
);
const ROUTER_REPLAY_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'router-replay.cjs'
);
const PLAYBOOK_LOADER_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'load-playbook-scenarios.cjs'
);
const ROUTE_DECISION_SCHEMA_PATH = path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/schemas/route-decision.v1.schema.json'
);
const BUDGET_SCHEMA_PATH = path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/schemas/uncertainty-budget.v1.schema.json'
);
const TRUSTED_DIGESTS = Object.freeze({
  [ROUTER_REPLAY_PATH]: 'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  [SCORE_PATH]: 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  [PLAYBOOK_LOADER_PATH]: '249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde',
  [ROUTE_DECISION_SCHEMA_PATH]: '6b776b2fbdaf43996511d2d096bcc172d287d5a86609dd6c9dcd4013f481f5a7',
  [BUDGET_SCHEMA_PATH]: '353a9cee567fc6e612e1c3f17088eb2bf30a88bbcf745923552361b136539b2c',
});
const REPLAY_RUNS = 25;
const CHILD_RUNS = 3;

let assertionCount = 0;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function check(value, message) {
  assertionCount += 1;
  assert.ok(value, message);
}

function equal(actual, expected, message) {
  assertionCount += 1;
  assert.deepStrictEqual(actual, expected, message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function digestValue(value) {
  return crypto.createHash('sha256').update(canonicalize(value)).digest('hex');
}

function clone(value) {
  return JSON.parse(canonicalize(value));
}

function makeRoute(candidate) {
  return {
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind: 'single',
      targets: [clone(candidate.target)],
      basis: { kind: 'signal' },
      evidence: [],
      authority: 'WithheldUntilVerify',
    },
  };
}

function makeHandoffSource(reason) {
  return {
    schemaVersion: 'V1',
    action: 'defer',
    defer: {
      reason,
      recovery: reason === 'handoff-required' ? ['handoff'] : [],
      authority: 'Withheld',
    },
  };
}

function hydrateInput(fixture, scenarioId, rawInput) {
  const candidates = fixture.candidates;
  const input = clone(rawInput);
  input.requestId = scenarioId;

  if (input.confidentCandidateRef) {
    const candidate = candidates[input.confidentCandidateRef];
    input.confidentDecision = makeRoute(candidate);
    input.confidentCompatibility = clone(candidate.compatibility);
  }
  if (input.exactCandidateRef) input.exactCandidate = clone(candidates[input.exactCandidateRef]);
  if (input.rankedCandidateRef) input.rankedCandidate = clone(candidates[input.rankedCandidateRef]);
  if (input.clarify?.legalLocalCandidateRef) {
    input.clarify.legalLocalCandidate = clone(
      candidates[input.clarify.legalLocalCandidateRef]
    );
  }
  if (input.handoff) {
    input.handoff.sourceDecision = makeHandoffSource(input.handoff.sourceReason);
    input.handoff.candidate = input.handoff.candidateRef
      ? clone(candidates[input.handoff.candidateRef])
      : null;
  }
  return input;
}

function hydrateCase(fixture, fixtureCase) {
  return hydrateInput(fixture, fixtureCase.scenarioId, fixtureCase.input);
}

function decisionReason(decision) {
  if (decision.action === 'defer') return decision.defer.reason;
  if (decision.action === 'reject') return decision.reject.reason;
  return undefined;
}

function containsKey(value, forbiddenKeys) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some((item) => containsKey(item, forbiddenKeys));
  if (Object.keys(value).some((key) => forbiddenKeys.has(key))) return true;
  return Object.values(value).some((item) => containsKey(item, forbiddenKeys));
}

function assertDecisionContract(decision) {
  equal(decision.schemaVersion, 'V1', 'decision schema version');
  check(['route', 'clarify', 'defer', 'reject'].includes(decision.action), 'closed action');
  equal(Object.keys(decision).sort(), ['action', 'schemaVersion', decision.action].sort(), 'branch keys');

  if (decision.action === 'route') {
    const route = decision.route;
    equal(route.selectionKind, 'single', 'single selection');
    equal(route.authority, 'WithheldUntilVerify', 'route authority withheld');
    equal(route.targets.length, 1, 'route has one target');
    ['clarify', 'handoff', 'recovery', 'budgetRef', 'question', 'alternatives'].forEach((field) => {
      check(!Object.hasOwn(route, field), `route has no ${field} artifact`);
    });
    return;
  }

  check(
    !containsKey(
      decision,
      new Set(['target', 'targets', 'tool', 'tools', 'destination', 'destinationId', 'authorityRef'])
    ),
    `${decision.action} is target-free`
  );
  equal(decision[decision.action].authority, 'Withheld', `${decision.action} authority`);

  if (decision.action === 'clarify') {
    const alternatives = decision.clarify.alternatives;
    check(alternatives.length >= 2 && alternatives.length <= 4, 'clarify options bounded');
    equal(alternatives.at(-1), 'none_of_these', 'clarify has terminal alternative');
  }
  if (decision.action === 'defer') {
    check(DEFER_REASONS.includes(decision.defer.reason), 'defer reason is closed');
  }
  if (decision.action === 'reject') {
    check(['invalid', 'forbidden'].includes(decision.reject.reason), 'reject reason is closed');
  }
}

function assertBudgetContract(budget) {
  equal(budget.requestId, budget.contract.budgetId.slice('budget:'.length), 'budget request identity');
  equal(budget.contract.schemaVersion, 'V1', 'budget schema version');
  equal(budget.contract.userTurns, 1, 'shared user-turn limit');
  equal(budget.contract.handoffHops, 1, 'handoff hop limit');
  equal(new Set(budget.contract.visited).size, budget.contract.visited.length, 'visited unique');
  check(budget.userTurnsUsed >= 0 && budget.userTurnsUsed <= 1, 'user-turn counter finite');
  check(budget.handoffHopsUsed >= 0 && budget.handoffHopsUsed <= 1, 'hop counter finite');
}

function assertResultBudget(result) {
  equal(result.budgetState, result.budget, 'budgetState carrier matches budget view');
  assertBudgetContract(result.budgetState);
}

function assertTypedGold(row) {
  equal(row.schemaVersion, 'V1', 'typed gold schema version');
  check(/^[a-f0-9]{64}$/.test(row.effectivePolicyHash), 'policy hash is a digest');
  check(/^[a-f0-9]{64}$/.test(row.projectionHash), 'projection hash is a digest');
  row.observedResources.forEach((item) => {
    check(typeof item.intent === 'string' && item.intent.length > 0, 'typed resource intent');
    check(typeof item.resource === 'string' && item.resource.length > 0, 'typed resource path');
  });
  equal(
    row.projectionHash,
    computeProjectionHash('TypedRouteGoldV1', row),
    'typed gold projection hash'
  );
}

function assertExpectedResult(label, expected, result) {
  equal(result.decision.action, expected.action, `${label} action`);
  equal(result.trace.rungInvocations, expected.rungInvocations, `${label} rungs`);
  equal(result.trace.terminalRung, expected.terminalRung, `${label} terminal rung`);
  equal(result.trace.terminalReason, expected.terminalReason, `${label} reason`);
  equal(result.trace.rankCalls, expected.rankCalls, `${label} rank calls`);
  equal(result.trace.rescoreCalls, expected.rescoreCalls, `${label} rescores`);
  equal(result.trace.handoffAttempts, expected.handoffAttempts, `${label} handoffs`);
  equal(result.budgetState.userTurnsUsed, expected.userTurnsUsed, `${label} turns`);
  equal(result.budgetState.handoffHopsUsed, expected.handoffHopsUsed, `${label} hops`);
  equal(
    result.trace.ownershipTransfers.length,
    expected.ownershipTransfers,
    `${label} transfers`
  );
  equal(
    result.trace.downstreamNeedsInputAttempts,
    expected.downstreamNeedsInputAttempts,
    `${label} downstream input`
  );
  equal(result.ownerId, expected.ownerId, `${label} owner`);
  if (expected.decisionReason) {
    equal(
      decisionReason(result.decision),
      expected.decisionReason,
      `${label} decision reason`
    );
  }
}

function assertExpected(fixtureCase, result) {
  assertExpectedResult(fixtureCase.scenarioId, fixtureCase.expected, result);
}

function evaluateImmutable(input, label) {
  const before = canonicalize(input);
  const result = evaluateRecovery(input);
  equal(canonicalize(input), before, `${label} input remained immutable`);
  return result;
}

function executeCases(fixture) {
  return fixture.cases.map((fixtureCase) => {
    const input = hydrateCase(fixture, fixtureCase);
    const stepResults = [evaluateImmutable(input, `${fixtureCase.scenarioId} step 1`)];
    if (fixtureCase.continuationInput) {
      check(
        !Object.hasOwn(fixtureCase.continuationInput, 'budgetState'),
        `${fixtureCase.scenarioId} continuation does not pre-seed state`
      );
      const continuation = hydrateInput(
        fixture,
        fixtureCase.scenarioId,
        fixtureCase.continuationInput
      );
      continuation.budgetState = clone(stepResults[0].budgetState);
      equal(
        continuation.budgetState,
        stepResults[0].budgetState,
        `${fixtureCase.scenarioId} threads returned budgetState`
      );
      stepResults.push(evaluateImmutable(continuation, `${fixtureCase.scenarioId} step 2`));
    }
    const result = stepResults.at(-1);
    const observation = projectCompatibility(result);
    const typedGold = buildTypedRouteGold({
      scenarioId: fixtureCase.scenarioId,
      effectivePolicyHash: fixture.effectivePolicyHash,
      result,
      observation,
    });
    return { fixtureCase, result, stepResults, observation, typedGold };
  });
}

function scorerScenario(row) {
  return {
    scenarioId: row.fixtureCase.scenarioId,
    classKind: 'router',
    hasIntentGold: true,
    expectedIntent: row.fixtureCase.gold.expectedIntents[0],
    expectedIntents: row.fixtureCase.gold.expectedIntents,
    hasResourceGold: true,
    expectedResources: row.fixtureCase.gold.expectedResources,
    forbiddenResources: [],
    source: { shape: 'sk-doc' },
  };
}

function runReadOnlyScorer(rows) {
  const payload = rows.map((row) => ({
    scenario: scorerScenario(row),
    observed: row.observation,
  }));
  const script = String.raw`
    'use strict';
    const fs = require('fs');
    const blocked = ['appendFileSync','mkdirSync','renameSync','rmSync','unlinkSync','writeFileSync'];
    for (const name of blocked) fs[name] = () => { throw new Error('write-attempt:' + name); };
    const scorer = require(process.env.SCORE_PATH);
    if (typeof scorer.evaluateRouteGold !== 'function') throw new Error('missing evaluateRouteGold');
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { input += chunk; });
    process.stdin.on('end', () => {
      const rows = JSON.parse(input);
      const verdicts = rows.map((row) => scorer.evaluateRouteGold(row));
      process.stdout.write(JSON.stringify(verdicts));
    });
  `;
  const child = spawnSync(process.execPath, ['-e', script], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      SCORE_PATH,
    },
    input: JSON.stringify(payload),
    encoding: 'utf8',
  });
  equal(child.status, 0, `read-only scorer exited cleanly: ${child.stderr}`);
  const verdicts = JSON.parse(child.stdout);
  equal(verdicts.length, rows.length, 'scorer returned every row');
  verdicts.forEach((verdict, index) => {
    equal(verdict.applicable, true, `${rows[index].fixtureCase.scenarioId} scorer applicable`);
    equal(verdict.pass, true, `${rows[index].fixtureCase.scenarioId} scorer verdict`);
  });

  const corrupted = clone(payload[0]);
  corrupted.observed.observedIntents = ['corrupted-intent'];
  const falsifier = spawnSync(process.execPath, ['-e', script], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      SCORE_PATH,
    },
    input: JSON.stringify([corrupted]),
    encoding: 'utf8',
  });
  equal(falsifier.status, 0, 'scorer falsifier executed');
  const [falsifierVerdict] = JSON.parse(falsifier.stdout);
  equal(falsifierVerdict.pass, false, 'corrupted projection fails real scorer');
  equal(falsifierVerdict.intentOk, false, 'falsifier fails the intent lane');
  return verdicts;
}

function assertNoNameBranch() {
  const files = [
    path.join(PHASE_ROOT, 'lib', 'recovery-ladder.cjs'),
    path.join(PHASE_ROOT, 'lib', 'compatibility-projector.cjs'),
  ];
  const patterns = [
    /if\s*\([\s\S]{0,180}skillId[\s\S]{0,180}['"][^'"]+['"][\s\S]{0,80}\)/,
    /switch\s*\([^)]*skillId[^)]*\)/,
    /skillId[\s\S]{0,120}\?[\s\S]{0,120}:/,
  ];
  files.forEach((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    check(!source.includes('router-local'), `${path.basename(filePath)} has no fixture destination`);
    check(!source.includes('router-remote'), `${path.basename(filePath)} has no fixture destination`);
    patterns.forEach((pattern) => {
      check(!pattern.test(source), `${path.basename(filePath)} has no destination-name branch`);
    });
  });
}

function snapshotProtectedFiles() {
  return Object.fromEntries(Object.keys(TRUSTED_DIGESTS).map((filePath) => [filePath, sha256(filePath)]));
}

function assertProtectedFiles(snapshot) {
  for (const [filePath, trustedDigest] of Object.entries(TRUSTED_DIGESTS)) {
    equal(snapshot[filePath], trustedDigest, `${path.basename(filePath)} trusted digest`);
    equal(sha256(filePath), trustedDigest, `${path.basename(filePath)} unchanged`);
  }
}

function runChildReplay() {
  const child = spawnSync(process.execPath, [__filename, '--child'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  equal(child.status, 0, `child replay exited cleanly: ${child.stderr}`);
  return JSON.parse(child.stdout);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function childMain() {
  const fixture = readJson(FIXTURE_PATH);
  const rows = executeCases(fixture);
  process.stdout.write(JSON.stringify(rows.map((row) => ({
    scenarioId: row.fixtureCase.scenarioId,
    resultHash: digestValue(row.result),
    projectionHash: row.typedGold.projectionHash,
  }))));
}

function typedGoldMain() {
  const fixture = readJson(FIXTURE_PATH);
  const rows = executeCases(fixture);
  process.stdout.write(`${JSON.stringify(rows.map((row) => row.typedGold), null, 2)}\n`);
}

function main() {
  const protectedBefore = snapshotProtectedFiles();
  assertProtectedFiles(protectedBefore);

  const contract = readJson(CONTRACT_PATH);
  const fixture = readJson(FIXTURE_PATH);
  const typedGoldFixtures = readJson(TYPED_GOLD_PATH);
  equal(contract.rungs, RUNG_NAMES, 'declarative and executable rung order match');
  equal(contract.budget.userTurns, 1, 'declarative shared budget');
  equal(contract.budget.handoffHops, 1, 'declarative hop budget');
  equal(contract.budget.sharedBy, ['clarify', 'handoff'], 'one budget serves both rungs');
  equal(contract.budget.downstreamNeedsInputReopensTurn, false, 'downstream input is terminal');
  equal(contract.budget.continuationField, 'budgetState', 'continuation carrier is symmetric');
  equal(contract.budget.threadedCountersMonotonic, true, 'threaded counters are monotonic');
  equal(contract.budget.unthreadedAcceptedAnswer, 'reject-invalid', 'unthreaded answer is rejected');
  equal(contract.autoRoute.certificateValidatorAvailable, false, 'auto-route stays inert');
  equal(contract.autoRoute.withoutValidator, 'fall-through', 'rank cannot auto-route');

  const rows = executeCases(fixture);
  equal(
    rows.map((row) => row.typedGold),
    typedGoldFixtures,
    'replayed typed gold matches checked-in fixtures'
  );
  rows.forEach((row) => {
    if (row.fixtureCase.firstExpected) {
      assertExpectedResult(
        `${row.fixtureCase.scenarioId} first call`,
        row.fixtureCase.firstExpected,
        row.stepResults[0]
      );
    }
    assertExpected(row.fixtureCase, row.result);
    row.stepResults.forEach((stepResult) => {
      assertDecisionContract(stepResult.decision);
      assertResultBudget(stepResult);
    });
    assertTypedGold(row.typedGold);
  });

  const baselineHashes = rows.map((row) => ({
    scenarioId: row.fixtureCase.scenarioId,
    resultHash: digestValue(row.result),
    projectionHash: row.typedGold.projectionHash,
  }));
  for (let run = 1; run < REPLAY_RUNS; run += 1) {
    const replayRows = executeCases(fixture).map((row) => ({
      scenarioId: row.fixtureCase.scenarioId,
      resultHash: digestValue(row.result),
      projectionHash: row.typedGold.projectionHash,
    }));
    equal(replayRows, baselineHashes, `deterministic replay run ${run + 1}`);
  }
  for (let run = 0; run < CHILD_RUNS; run += 1) {
    equal(runChildReplay(), baselineHashes, `cross-process replay ${run + 1}`);
  }

  const byId = new Map(rows.map((row) => [row.fixtureCase.scenarioId, row]));
  const confident = byId.get('confident-route-bypasses-ladder').result;
  equal(confident.trace.rungInvocations, [], 'confident route invokes zero rungs');

  const malformedConfident = byId.get('malformed-confident-negative-is-rejected').result;
  equal(malformedConfident.decision.action, 'reject', 'malformed confident negative is not echoed');
  equal(malformedConfident.decision.reject.reason, 'invalid', 'malformed confident negative is typed');
  equal(malformedConfident.trace.rungInvocations, [], 'confident validation precedes the ladder');

  const exact = byId.get('nonconfident-exact-route').result;
  equal(exact.trace.handoffAttempts, 0, 'direct route attempts no handoff');
  equal(exact.trace.ownershipTransfers, [], 'direct route emits no handoff artifact');

  const rankedWithoutCertificate = byId.get('rank-without-certificate-clarifies').result;
  equal(rankedWithoutCertificate.trace.rankCalls, 1, 'rank evidence path was exercised');
  equal(rankedWithoutCertificate.decision.action, 'clarify', 'rank alone cannot auto-route');
  equal(
    rankedWithoutCertificate.decision.clarify.alternatives.at(-1),
    'none_of_these',
    'clarify includes the terminal alternative'
  );

  const missingGate = byId.get('missing-gate-is-rejected-before-ranking').result;
  equal(missingGate.trace.rankCalls, 0, 'missing eligibility proof never ranks');
  equal(missingGate.trace.terminalReason, 'eligibility-unproven', 'missing gate fails closed');

  const partialGate = byId.get('partial-gate-defers-before-ranking').result;
  equal(partialGate.trace.rankCalls, 0, 'missing authority and freshness proofs never rank');
  equal(partialGate.decision.defer.reason, 'evidence-unavailable', 'partial gate is a typed defer');

  const acceptedClarification = byId.get('accepted-clarification-rescores-once');
  equal(acceptedClarification.stepResults.length, 2, 'accepted clarification crosses a turn boundary');
  equal(acceptedClarification.stepResults[0].decision.action, 'clarify', 'first call asks');
  equal(acceptedClarification.stepResults[0].budgetState.userTurnsUsed, 1, 'ask pays the turn');
  equal(acceptedClarification.result.trace.rescoreCalls, 1, 'threaded answer rescored exactly once');
  equal(acceptedClarification.result.budgetState.userTurnsUsed, 1, 'rescore spends no new turn');
  equal(acceptedClarification.result.decision.action, 'route', 'discriminating answer routes locally');

  const unthreadedAnswer = byId.get('unthreaded-accepted-answer-is-rejected').result;
  equal(unthreadedAnswer.trace.rescoreCalls, 0, 'unthreaded answer is not rescored');
  equal(
    unthreadedAnswer.trace.callerContractViolations,
    ['clarification-budget-state-required'],
    'unthreaded re-entry is detected'
  );

  const clarifyHandoff = byId.get('clarify-then-handoff-spends-one-budget').result;
  equal(clarifyHandoff.decision.action, 'reject', 'clarify then handoff exhausts the one shared turn');
  equal(clarifyHandoff.trace.rescoreCalls, 0, 'no answer is supplied so nothing is rescored');
  equal(clarifyHandoff.trace.handoffAttempts, 1, 'the handoff rung is actually reached after the clarify');
  equal(clarifyHandoff.budgetState.userTurnsUsed, 1, 'the single shared turn is spent by the clarify, not doubled');
  equal(clarifyHandoff.budgetState.handoffHopsUsed, 0, 'no hop is granted once the shared budget is spent');
  equal(
    clarifyHandoff.trace.terminalReason,
    'handoff-shared-budget-exhausted',
    'clarify and handoff draw from one shared budget'
  );

  const threadedHandoff = byId.get('second-handoff-hop-is-refused');
  const [firstHandoff, secondHop] = threadedHandoff.stepResults;
  equal(threadedHandoff.stepResults.length, 2, 'handoff budget is exercised across re-entry');
  equal(firstHandoff.budgetState.userTurnsUsed, 1, 'first handoff spends one turn');
  equal(firstHandoff.budgetState.handoffHopsUsed, 1, 'first handoff accepts one hop');
  equal(secondHop.budgetState.userTurnsUsed, 1, 'threaded re-entry does not reset turns');
  equal(secondHop.budgetState.handoffHopsUsed, 1, 'threaded re-entry does not reset hops');
  equal(
    firstHandoff.budgetState.userTurnsUsed
      + (secondHop.budgetState.userTurnsUsed - firstHandoff.budgetState.userTurnsUsed),
    1,
    'combined accepted user-turn increments equal one'
  );
  equal(
    firstHandoff.budgetState.handoffHopsUsed
      + (secondHop.budgetState.handoffHopsUsed - firstHandoff.budgetState.handoffHopsUsed),
    1,
    'combined accepted handoff increments equal one'
  );
  equal(secondHop.trace.handoffAttempts, 1, 'second hop was actually attempted');
  equal(secondHop.trace.terminalReason, 'handoff-hop-limit', 'second hop refusal reason');

  const visited = byId.get('visited-handoff-destination-is-refused').result;
  equal(visited.trace.handoffAttempts, 1, 'visited handoff was actually attempted');
  equal(
    visited.trace.terminalReason,
    'handoff-visited-destination',
    'visited refusal reason'
  );

  const downstream = byId.get('handoff-needs-input-does-not-reopen-turn').result;
  equal(downstream.trace.downstreamNeedsInputAttempts, 1, 'downstream input path exercised');
  equal(downstream.budgetState.userTurnsUsed, 1, 'downstream input does not allocate a turn');
  equal(
    downstream.trace.ownershipTransfers[0].completionClaimed,
    false,
    'handoff does not claim completion'
  );

  const acceptedHandoffCase = byId.get('handoff-acceptance-transfers-ownership').fixtureCase;
  const policyDeniedInput = hydrateCase(fixture, acceptedHandoffCase);
  policyDeniedInput.handoff.policyPermits = false;
  const policyDenied = evaluateRecovery(policyDeniedInput);
  equal(policyDenied.trace.handoffAttempts, 1, 'policy-denied handoff was attempted');
  equal(policyDenied.trace.terminalReason, 'handoff-policy-forbidden', 'policy refusal reason');
  equal(policyDenied.decision.reject.reason, 'forbidden', 'policy refusal is typed');

  const sameDestinationInput = hydrateCase(fixture, acceptedHandoffCase);
  sameDestinationInput.currentDestinationId = sameDestinationInput.handoff.namedCandidateId;
  const sameDestination = evaluateRecovery(sameDestinationInput);
  equal(sameDestination.trace.handoffAttempts, 1, 'same-destination handoff was attempted');
  equal(
    sameDestination.trace.terminalReason,
    'handoff-candidate-not-distinct-viable',
    'handoff requires a distinct candidate'
  );

  const zeroSignal = byId.get('zero-signal-idle-no-default-union');
  check(!Object.hasOwn(zeroSignal.fixtureCase.input, 'deferReason'), 'zero signal supplies no reason');
  equal(zeroSignal.result.decision.defer.reason, 'idle', 'module classifies zero signal as idle');
  equal(zeroSignal.observation, { observedIntents: [], observedResources: [] }, 'zero-signal empty projection');

  const invalidRequest = byId.get('invalid-request-reaches-reject-rung');
  equal(invalidRequest.fixtureCase.input.invalid, true, 'reject fixture carries an invalidity fact');
  equal(invalidRequest.result.decision.reject.reason, 'invalid', 'invalidity fact reaches reject');

  const targetlessClarify = byId.get('targetless-clarify-candidate-defers').result;
  equal(targetlessClarify.decision.defer.reason, 'no-match', 'targetless candidate falls through');
  equal(targetlessClarify.budgetState.userTurnsUsed, 0, 'targetless candidate spends no turn');
  check(!targetlessClarify.trace.rungInvocations.includes('reject'), 'targetless candidate does not throw');

  const observedDeferReasons = new Set(
    rows
      .filter((row) => row.result.decision.action === 'defer')
      .map((row) => row.result.decision.defer.reason)
  );
  equal([...observedDeferReasons].sort(), [...DEFER_REASONS].sort(), 'all defer reasons exercised');

  runReadOnlyScorer(rows);
  assertNoNameBranch();
  assertProtectedFiles(protectedBefore);

  process.stdout.write(
    `SC-001 shadow-partial: ${rows.length}/${rows.length} projected rows passed the real read-only scorer; `
      + `${REPLAY_RUNS} in-process and ${CHILD_RUNS} cross-process replays were hash-identical\n`
  );
  process.stdout.write(
    'SC-002 pass: max userTurnsUsed=1, max handoffHopsUsed=1; threaded re-entry, hop, and visited refusals exercised\n'
  );
  process.stdout.write(
    'SC-003 pass: every clarify/defer/reject decision is target-free with authority Withheld\n'
  );
  process.stdout.write('SC-004 pass: confident route invoked zero ladder rungs\n');
  process.stdout.write(
    'SC-005 pass: protected scorer/router/loader and frozen schema digests are unchanged\n'
  );
  process.stdout.write(
    `SUMMARY status=shadow-partial cases=${rows.length} assertions=${assertionCount} `
      + `typedGold=${rows.length} scorerPass=${rows.length} userTurnMax=1 hopMax=1\n`
  );
}

if (process.argv.includes('--print-typed-gold')) {
  typedGoldMain();
} else if (process.argv.includes('--child')) {
  childMain();
} else {
  main();
}
