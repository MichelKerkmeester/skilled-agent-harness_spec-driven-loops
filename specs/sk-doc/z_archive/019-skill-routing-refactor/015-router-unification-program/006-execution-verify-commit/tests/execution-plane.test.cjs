// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: Destination-Local Execution Plane                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise real protocol transitions and hard-failure paths.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  DestinationExecutionPlane,
  prepareRoute,
} = require('../lib/execution-plane.cjs');

/* ─────────────────────────────────────────────────────────────
   2. FIXTURES AND HELPERS
──────────────────────────────────────────────────────────────── */

const FIXTURE_FILE = path.resolve(__dirname, '..', 'fixtures', 'execution-route-gold.v1.json');

function readFixtures() {
  return JSON.parse(fs.readFileSync(FIXTURE_FILE, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentBindings(context, orderedTargets, overrides = {}) {
  return {
    ...clone(context),
    currentEpoch: context.epoch,
    orderedTargets,
    ...overrides,
  };
}

function destinationAdapter(options = {}) {
  const state = options.state || 'READY';
  const atomicity = options.atomicity || 'atomic';
  return {
    atomicity,
    verifyCurrentAuthority() {
      return { state, reason: options.reason || null };
    },
    acquireLocalAuthority() {
      return { state: 'ACQUIRED', handle: Object.freeze({ issuer: 'destination-local' }) };
    },
    performEffect(input) {
      if (typeof options.effect === 'function') return options.effect(input);
      return 'committed';
    },
  };
}

function expectCode(assertionState, code, callback) {
  assert.throws(callback, (error) => {
    assertionState.count += 1;
    return error && error.code === code;
  }, `expected ${code}`);
}

function check(assertionState, actual, expected, message) {
  assertionState.count += 1;
  assert.deepStrictEqual(actual, expected, message);
}

function target(overrides) {
  return {
    destinationId: {
      skillId: overrides.skillId,
      workflowMode: overrides.workflowMode,
      packetId: overrides.packetId,
      packetKind: overrides.packetKind || 'workflow',
      backendKind: overrides.backendKind || 'native',
    },
    role: overrides.role || 'actor',
    authorityRef: overrides.authorityRef || `destination:${overrides.workflowMode}`,
    mutatesWorkspace: overrides.mutatesWorkspace,
  };
}

function routeDecision(targets, selectionKind) {
  return {
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind,
      targets,
      basis: { kind: 'signal' },
      evidence: [],
      authority: 'WithheldUntilVerify',
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   3. BEHAVIOR TESTS
──────────────────────────────────────────────────────────────── */

function testFrozenProofBindings(assertionState, fixture) {
  const decisionBefore = JSON.stringify(fixture.decision);
  const contextBefore = JSON.stringify(fixture.context);
  const first = prepareRoute(fixture.decision, fixture.context).preparedLegs[0].proof;
  const second = prepareRoute(fixture.decision, fixture.context).preparedLegs[0].proof;
  check(assertionState, Object.keys(first).sort(), [
    'attestation',
    'destinationId',
    'epoch',
    'expiresAtEpoch',
    'idempotencyKey',
    'proofHash',
    'readSet',
    'schemaVersion',
  ], 'proof must retain the frozen field set');
  check(assertionState, first.readSet.map((entry) => entry.resourceId), [
    'request-facts.v1',
    'effective-policy.v1',
    'registry-authority.v1',
    'ordered-targets.v1',
    'authority-class.v1',
    'preconditions.v1',
    'destination-config.v1',
  ], 'proof read-set must bind every required input');
  check(assertionState, first.proofHash, fixture.expectedProofHash, 'proof hash oracle');
  check(assertionState, second.proofHash, first.proofHash, 'prepare must be deterministic');
  check(assertionState, Object.hasOwn(first, 'authority'), false, 'proof must carry no authority');
  check(assertionState, JSON.stringify(fixture.decision), decisionBefore, 'prepare must not mutate decision');
  check(assertionState, JSON.stringify(fixture.context), contextBefore, 'prepare must not mutate context');
  return { proofHash: first.proofHash, boundResources: first.readSet.length };
}

function testStaleProofTransitions(assertionState, fixture) {
  const prepared = prepareRoute(fixture.decision, fixture.context);
  const leg = prepared.preparedLegs[0];
  const driftCases = [
    { effectivePolicyHash: fixture.drift.effectivePolicyHash },
    { requestFactsHash: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
    { registryAuthorityHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
    {
      readSet: [{
        resourceId: 'destination-config.v1',
        digest: '0000000000000000000000000000000000000000000000000000000000000000',
      }],
    },
    { authorityClass: 'different-authority' },
    { preconditions: ['different-precondition'] },
    {
      orderedTargets: [{
        ...clone(leg.target),
        destinationId: { ...clone(leg.target.destinationId), workflowMode: 'different-target' },
      }],
    },
  ];
  let effectCount = 0;
  for (const drift of driftCases) {
    const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
    const current = currentBindings(fixture.context, leg.orderedTargets, drift);
    const verification = plane.verify(leg, current, destinationAdapter({
      effect() {
        effectCount += 1;
        return 'should-not-run';
      },
    }));
    check(assertionState, verification.state, 'STALE_PROOF', 'bound drift must be stale');
    expectCode(assertionState, 'COMMIT_WITHOUT_READY', () => plane.commit(
      leg,
      verification,
      destinationAdapter(),
      { timestamp: '2026-07-18T12:00:00.000Z', retentionUntilEpoch: 40 }
    ));
  }

  const superseded = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch + 1 });
  const supersededResult = superseded.verify(
    leg,
    currentBindings(fixture.context, leg.orderedTargets),
    destinationAdapter()
  );
  check(assertionState, supersededResult.state, 'STALE_PROOF', 'superseded proof must be stale');
  check(assertionState, supersededResult.reasons.includes('generation'), true, 'generation reason');

  const expired = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
  const expiredResult = expired.verify(
    leg,
    currentBindings(fixture.context, leg.orderedTargets, {
      currentEpoch: fixture.context.expiresAtEpoch + 1,
    }),
    destinationAdapter()
  );
  check(assertionState, expiredResult.state, 'STALE_PROOF', 'expired proof must be stale');
  check(assertionState, expiredResult.reasons.includes('expiry'), true, 'expiry reason');
  check(assertionState, effectCount, 0, 'stale paths must never perform an effect');
  return { state: expiredResult.state, effectCount };
}

function testDuplicateCollapse(assertionState, fixture) {
  const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
  const prepared = plane.prepare(fixture.decision, fixture.context);
  const leg = prepared.preparedLegs[0];
  const verification = plane.verify(
    leg,
    currentBindings(fixture.context, leg.orderedTargets),
    destinationAdapter()
  );
  check(assertionState, verification.state, 'READY', 'fresh proof must reach READY');
  let effectCount = 0;
  const adapter = destinationAdapter({
    effect() {
      effectCount += 1;
      return { effectCount };
    },
  });
  const options = { timestamp: '2026-07-18T12:00:01.000Z', retentionUntilEpoch: 50 };
  const first = plane.commit(leg, verification, adapter, options);
  const second = plane.commit(leg, verification, adapter, options);
  check(assertionState, first.duplicate, false, 'first submission must execute');
  check(assertionState, second.duplicate, true, 'duplicate submission must collapse');
  assertionState.count += 1;
  assert.strictEqual(second.receipt, first.receipt, 'duplicate must return the original receipt');
  check(assertionState, effectCount, 1, 'duplicate key must produce exactly one effect');
  check(assertionState, plane.ledger.counts().entries, 1, 'duplicate key must produce one receipt');
  return { effectCount, receiptCount: plane.ledger.counts().entries, receipt: first.receipt };
}

function testClosedVerifyStates(assertionState, fixture) {
  const states = ['READY', 'NEEDS_INPUT', 'DEFER', 'REJECT'];
  const observed = [];
  for (const state of states) {
    const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
    const leg = plane.prepare(fixture.decision, fixture.context).preparedLegs[0];
    const result = plane.verify(
      leg,
      currentBindings(fixture.context, leg.orderedTargets),
      destinationAdapter({ state })
    );
    observed.push(result.state);
  }
  check(assertionState, observed, states, 'destination results must preserve the closed state set');
  return observed;
}

function testNegativeAndBareProofGuards(assertionState, fixture) {
  for (const action of ['clarify', 'defer', 'reject']) {
    const branch = action === 'clarify'
      ? { question: 'Choose', budgetRef: 'budget', alternatives: ['a', 'b'], authority: 'Withheld' }
      : action === 'defer'
        ? { reason: 'no-match', recovery: [], authority: 'Withheld' }
        : { reason: 'forbidden', authority: 'Withheld' };
    const result = prepareRoute({ schemaVersion: 'V1', action, [action]: branch }, fixture.context);
    check(assertionState, result.preparedLegs.length, 0, `${action} must emit no proof`);
  }
  expectCode(assertionState, 'NEGATIVE_DECISION_INVALID', () => prepareRoute({
    schemaVersion: 'V1',
    action: 'defer',
    defer: { reason: 'no-match', recovery: [], authority: 'Withheld' },
    targets: fixture.decision.route.targets,
  }, fixture.context));

  const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
  const leg = plane.prepare(fixture.decision, fixture.context).preparedLegs[0];
  const adapter = destinationAdapter();
  const options = { timestamp: '2026-07-18T12:00:02.000Z', retentionUntilEpoch: 50 };
  expectCode(assertionState, 'COMMIT_WITHOUT_READY', () => plane.commit(leg, null, adapter, options));
  expectCode(assertionState, 'COMMIT_WITHOUT_READY', () => plane.commit(
    leg,
    leg.proof,
    adapter,
    options
  ));
  expectCode(assertionState, 'COMMIT_WITHOUT_READY', () => plane.commit(
    leg,
    {
      state: 'READY',
      proofHash: leg.proof.proofHash,
      planId: leg.planId,
      sequence: leg.sequence,
      targetKey: 'forged',
    },
    adapter,
    options
  ));
}

function testOrderingAndFencing(assertionState, context) {
  const readOnly = target({
    skillId: 'hub-a', workflowMode: 'inspect', packetId: 'inspect', mutatesWorkspace: false,
  });
  const firstMutation = target({
    skillId: 'hub-a', workflowMode: 'write', packetId: 'write', mutatesWorkspace: true,
  });
  const secondMutation = target({
    skillId: 'hub-a', workflowMode: 'publish', packetId: 'publish', role: 'transport',
    mutatesWorkspace: true,
  });
  const decision = routeDecision([firstMutation, readOnly, secondMutation], 'orderedBundle');
  const bundleContext = { ...clone(context), epoch: 40, expiresAtEpoch: 45 };
  const plane = new DestinationExecutionPlane({ planningEpoch: bundleContext.epoch });
  const prepared = plane.prepare(decision, bundleContext);
  const [readLeg, firstMutationLeg, laterMutationLeg] = prepared.preparedLegs;
  check(assertionState, readLeg.target.mutatesWorkspace, false, 'read-only leg must sort first');
  check(assertionState, firstMutationLeg.target.mutatesWorkspace, true, 'mutation follows reads');

  const readyMutation = plane.verify(
    firstMutationLeg,
    currentBindings(bundleContext, firstMutationLeg.orderedTargets),
    destinationAdapter()
  );
  expectCode(assertionState, 'ORDERING_BLOCKED', () => plane.commit(
    firstMutationLeg,
    readyMutation,
    destinationAdapter(),
    { timestamp: '2026-07-18T12:00:03.000Z', retentionUntilEpoch: 60 }
  ));

  const readyRead = plane.verify(
    readLeg,
    currentBindings(bundleContext, readLeg.orderedTargets),
    destinationAdapter()
  );
  const readCommit = plane.commit(
    readLeg,
    readyRead,
    destinationAdapter(),
    { timestamp: '2026-07-18T12:00:04.000Z', retentionUntilEpoch: 60 }
  );
  check(assertionState, readCommit.fencingEpoch, 40, 'read-only commit must not advance epoch');

  const mutationCommit = plane.commit(
    firstMutationLeg,
    readyMutation,
    destinationAdapter(),
    { timestamp: '2026-07-18T12:00:05.000Z', retentionUntilEpoch: 60 }
  );
  check(assertionState, mutationCommit.fencingEpoch, 41, 'mutation must open a new epoch');
  check(assertionState, mutationCommit.invalidatedLaterLegs, [2], 'later prepared leg must be fenced');
  const fencedVerification = plane.verify(
    laterMutationLeg,
    currentBindings(bundleContext, laterMutationLeg.orderedTargets, { currentEpoch: 41 }),
    destinationAdapter()
  );
  check(assertionState, fencedVerification.state, 'STALE_PROOF', 'fenced leg must re-prepare');
  return {
    orderedMutationIndex: firstMutationLeg.sequence,
    invalidatedLaterLegs: mutationCommit.invalidatedLaterLegs,
    fencedState: fencedVerification.state,
    protocolPath: mutationCommit.protocolPath,
  };
}

function testEvidenceRole(assertionState, context) {
  const evidence = target({
    skillId: 'hub-b', workflowMode: 'evidence', packetId: 'evidence', role: 'evidence',
    mutatesWorkspace: false,
  });
  const decision = routeDecision([evidence], 'single');
  const evidenceContext = { ...clone(context), epoch: 50, expiresAtEpoch: 52 };
  const plane = new DestinationExecutionPlane({ planningEpoch: evidenceContext.epoch });
  const leg = plane.prepare(decision, evidenceContext).preparedLegs[0];
  const ready = plane.verify(
    leg,
    currentBindings(evidenceContext, leg.orderedTargets),
    destinationAdapter()
  );
  expectCode(assertionState, 'ROLE_CANNOT_COMMIT', () => plane.commit(
    leg,
    ready,
    destinationAdapter(),
    { timestamp: '2026-07-18T12:00:06.000Z', retentionUntilEpoch: 60 }
  ));
  const resolved = plane.resolveEvidence(leg, ready);
  check(assertionState, resolved.state, 'RESOLVED_READ_ONLY', 'evidence must resolve without commit');
}

function testAdapterDisable(assertionState, fixture) {
  let effectCount = 0;
  const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
  const prepared = plane.prepare(fixture.decision, fixture.context);
  const leg = prepared.preparedLegs[0];
  const ready = plane.verify(
    leg,
    currentBindings(fixture.context, leg.orderedTargets),
    destinationAdapter()
  );
  plane.disablePreEffectAdapter();
  const disabledPrepare = plane.prepare(fixture.decision, fixture.context);
  check(assertionState, disabledPrepare.preparedLegs.length, 0, 'disabled adapter emits no proof');
  expectCode(assertionState, 'ADAPTER_DISABLED', () => plane.commit(
    leg,
    ready,
    destinationAdapter({ effect() { effectCount += 1; } }),
    { timestamp: '2026-07-18T12:00:07.000Z', retentionUntilEpoch: 50 }
  ));
  check(assertionState, effectCount, 0, 'disable drill must prevent the effect');
  return { preparedProofsAfterDisable: 0, effectCount };
}

function testNonAtomicRecoveryBoundary(assertionState, fixture) {
  let effectCount = 0;
  const plane = new DestinationExecutionPlane({ planningEpoch: fixture.context.epoch });
  const leg = plane.prepare(fixture.decision, fixture.context).preparedLegs[0];
  const ready = plane.verify(
    leg,
    currentBindings(fixture.context, leg.orderedTargets),
    destinationAdapter()
  );
  const adapter = destinationAdapter({
    atomicity: 'non-atomic',
    effect() {
      effectCount += 1;
      const error = new Error('external destination outcome is unknown');
      error.code = 'EXTERNAL_EFFECT_FAILED';
      throw error;
    },
  });
  const options = { timestamp: '2026-07-18T12:00:09.000Z', retentionUntilEpoch: 60 };
  expectCode(assertionState, 'EXTERNAL_EFFECT_FAILED', () => plane.commit(
    leg,
    ready,
    adapter,
    options
  ));
  expectCode(assertionState, 'IDEMPOTENCY_PENDING', () => plane.commit(
    leg,
    ready,
    adapter,
    options
  ));
  check(assertionState, effectCount, 1, 'pending non-atomic retry must not repeat the effect');
  check(assertionState, plane.ledger.counts().pending, 1, 'destination must own pending recovery');
  return { effectCount, pendingReceipts: plane.ledger.counts().pending };
}

function testSamePathAtDifferentCardinality(assertionState, directFixture) {
  const singlePlane = new DestinationExecutionPlane({ planningEpoch: directFixture.context.epoch });
  const singlePrepared = singlePlane.prepare(directFixture.decision, directFixture.context);
  const singleLeg = singlePrepared.preparedLegs[0];
  const singleReady = singlePlane.verify(
    singleLeg,
    currentBindings(directFixture.context, singleLeg.orderedTargets),
    destinationAdapter()
  );
  const singleCommit = singlePlane.commit(
    singleLeg,
    singleReady,
    destinationAdapter(),
    { timestamp: '2026-07-18T12:00:08.000Z', retentionUntilEpoch: 60 }
  );
  check(
    assertionState,
    singleCommit.protocolPath,
    ['PREPARE', 'VERIFY', 'COMMIT'],
    'single routes use the complete protocol'
  );
  return singleCommit.protocolPath;
}

/* ─────────────────────────────────────────────────────────────
   4. TEST RUNNER
──────────────────────────────────────────────────────────────── */

function runTests() {
  const assertions = { count: 0 };
  const fixtures = readFixtures();
  const staleFixture = fixtures.cases.find((fixture) => fixture.id === 'stale-proof-rejected');
  const duplicateFixture = fixtures.cases.find((fixture) => (
    fixture.id === 'duplicate-key-single-receipt'
  ));
  const directFixture = fixtures.cases.find((fixture) => (
    fixture.id === 'direct-route-carrying-no-forbidden-handoff-artifacts'
  ));

  const proofBindings = testFrozenProofBindings(assertions, staleFixture);
  const stale = testStaleProofTransitions(assertions, staleFixture);
  const duplicate = testDuplicateCollapse(assertions, duplicateFixture);
  const verifyStates = testClosedVerifyStates(assertions, directFixture);
  testNegativeAndBareProofGuards(assertions, directFixture);
  const fencing = testOrderingAndFencing(assertions, directFixture.context);
  testEvidenceRole(assertions, directFixture.context);
  const disableDrill = testAdapterDisable(assertions, directFixture);
  const nonAtomicRecovery = testNonAtomicRecoveryBoundary(assertions, directFixture);
  const singlePath = testSamePathAtDifferentCardinality(assertions, directFixture);
  check(assertions, fencing.protocolPath, singlePath, 'single and bundle legs use one protocol path');

  return {
    assertions: assertions.count,
    proofBindings,
    stale,
    duplicate,
    verifyStates: ['STALE_PROOF', ...verifyStates.slice(0, 1), ...verifyStates.slice(1)],
    fencing,
    disableDrill,
    nonAtomicRecovery,
    singlePath,
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS AND ENTRY POINT
──────────────────────────────────────────────────────────────── */

module.exports = { runTests };

if (require.main === module) {
  try {
    process.stdout.write(`${JSON.stringify(runTests())}\n`);
  } catch (error) {
    process.stderr.write(`[execution-plane-test] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
