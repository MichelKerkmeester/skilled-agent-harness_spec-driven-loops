#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ VALIDATOR: OFFLINE LEARNING OVERLAY                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Drive real positive and falsifying overlay contract paths.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PHASE_ROOT = path.resolve(__dirname, '..');
const IMPLEMENTATION_ROOT = path.resolve(PHASE_ROOT, '..');
const REPO_ROOT = path.resolve(IMPLEMENTATION_ROOT, '../../../../../..');
const {
  DOMAIN_TAGS,
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  hashArtifact,
} = require(path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/lib/canonical.cjs'
));
const { parseRouteDecisionShape } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/lib/decision-contract.cjs'
));
const { scoreRouteGoldReadOnly } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/replay-driver.cjs'
));
const {
  DestinationExecutionPlane,
  prepareRoute,
} = require(path.join(
  IMPLEMENTATION_ROOT,
  '003-execution-verify-commit/lib/execution-plane.cjs'
));
const { routeSkillResources } = require(path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs'
));
const {
  INERT_WEIGHT,
  assertSingleGeneration,
  compileCandidateOverlay,
  createDormantActivation,
  effectiveTuple,
  ingestCorrectionRecords,
  makeBaseOnlyPolicy,
  promoteCandidate,
  rollbackPromotion,
  runRouteGoldReplay,
  validateCandidate,
} = require('../lib/correction-overlay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FIXTURE_FILE = path.join(PHASE_ROOT, 'fixtures', 'learning-overlay-cases.v1.json');
const MULTIMODE_POLICY_FILE = path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/fixtures/compiled-policy.multimode.json'
);
const N1_POLICY_FILE = path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/fixtures/compiled-policy.n1.json'
);
const SCORER_FILES = Object.freeze([
  'router-replay.cjs',
  'score-skill-benchmark.cjs',
  'load-playbook-scenarios.cjs',
]);
const SCORER_ROOT = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark'
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function scorerHashes() {
  return Object.fromEntries(SCORER_FILES.map((fileName) => [
    fileName,
    fileHash(path.join(SCORER_ROOT, fileName)),
  ]));
}

function expectCode(code, callback) {
  assert.throws(callback, (error) => error && error.code === code, `expected ${code}`);
  return code;
}

function scorerScenario(expectedIntents) {
  return {
    scenarioId: 'corrupted-overlay-observation',
    classKind: 'routing',
    hasIntentGold: true,
    hasResourceGold: true,
    expectedIntent: expectedIntents[0],
    expectedIntents,
    expectedResources: [],
    goldParseError: null,
    source: { shape: 'sk-doc' },
  };
}

function executionContext() {
  return {
    requestFactsHash: '1'.repeat(64),
    effectivePolicyHash: '2'.repeat(64),
    registryAuthorityHash: '3'.repeat(64),
    readSet: [{ resourceId: 'destination-config.v1', digest: '4'.repeat(64) }],
    authorityClass: 'read-only',
    preconditions: ['ready'],
    epoch: 10,
    expiresAtEpoch: 20,
  };
}

function evidenceDecision(destination) {
  return {
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind: 'single',
      targets: [{
        destinationId: destination.id,
        role: destination.role,
        authorityRef: destination.authorityRef,
        mutatesWorkspace: destination.mutatesWorkspace,
      }],
      basis: { kind: 'signal' },
      evidence: [],
      authority: 'WithheldUntilVerify',
    },
  };
}

function verifyEvidenceCannotCommit(basePolicy) {
  const evidence = basePolicy.destinations.find((destination) => destination.role === 'evidence');
  const context = executionContext();
  const prepared = prepareRoute(evidenceDecision(evidence), context);
  const leg = prepared.preparedLegs[0];
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const verification = plane.verify(leg, {
    ...context,
    currentEpoch: context.epoch,
    orderedTargets: leg.orderedTargets,
  }, {
    verifyCurrentAuthority() {
      return { state: 'READY' };
    },
  });
  expectCode('ROLE_CANNOT_COMMIT', () => plane.commit(leg, verification, {}, {
    timestamp: '2026-07-19T12:00:00.000Z',
    retentionUntilEpoch: 30,
  }));
  return 'ROLE_CANNOT_COMMIT';
}

function verifyCommitRequiresReady(basePolicy) {
  const actor = basePolicy.destinations.find((destination) => destination.role === 'actor');
  const context = executionContext();
  const prepared = prepareRoute(evidenceDecision(actor), context);
  const leg = prepared.preparedLegs[0];
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  expectCode('COMMIT_WITHOUT_READY', () => plane.commit(leg, null, {}, {
    timestamp: '2026-07-19T12:00:01.000Z',
    retentionUntilEpoch: 30,
  }));
  return 'COMMIT_WITHOUT_READY';
}

function promotionHardGates(basePolicy) {
  const negativeTargetFree = expectCode('NEGATIVE_TARGET_FORBIDDEN', () => (
    parseRouteDecisionShape({
      schemaVersion: 'V1',
      action: 'defer',
      defer: {
        reason: 'no-match',
        recovery: [],
        authority: 'Withheld',
        target: basePolicy.destinations[0].id,
      },
    })
  ));
  return {
    negativeTargetFree: { pass: true, code: negativeTargetFree },
    evidenceNeverCommits: { pass: true, code: verifyEvidenceCannotCommit(basePolicy) },
    commitRequiresVerify: { pass: true, code: verifyCommitRequiresReady(basePolicy) },
  };
}

function syntheticDestination(workflowMode) {
  return {
    id: {
      skillId: 'fixture-router',
      workflowMode,
      packetId: `packet-${workflowMode}`,
      packetKind: 'workflow',
      backendKind: 'native',
    },
    role: 'actor',
    authorityRef: `authority:${workflowMode}`,
    mutatesWorkspace: false,
  };
}

function syntheticPolicy(destinations, detectors = [], selectors = []) {
  const policy = {
    schemaVersion: 'V1',
    activationGeneration: 1,
    destinations,
    detectors,
    selectors,
    compositionRules: [],
    authorityGraph: [],
    thresholdPolicy: { kind: 'exact-admission', thresholds: [] },
    recoveryPolicy: { ladder: ['defer', 'reject'], userTurns: 0, handoffHops: 0 },
    provenancePolicy: { kind: 'offline-learned', sourceHashes: [] },
  };
  policy.basePolicyHash = computeBasePolicyHash(policy);
  policy.effectivePolicyHash = computeEffectivePolicyHash(policy);
  return policy;
}

function telemetryFor(sanitizedRecords) {
  return {
    source: 'real-correction-telemetry',
    corpusHash: hashArtifact(DOMAIN_TAGS.TypedRouteGoldV1, {
      schemaVersion: 'V1',
      partition: sanitizedRecords[0].partition,
      records: sanitizedRecords.map((record) => JSON.parse(JSON.stringify(record))),
    }),
    sampleSize: sanitizedRecords.length,
    baselineCorrect: 0,
    candidateCorrect: sanitizedRecords.length,
  };
}

function compileUnderLocale(locale, records, policy) {
  const original = String.prototype.localeCompare;
  const collator = new Intl.Collator(locale);
  String.prototype.localeCompare = function localeCompare(other) {
    return collator.compare(String(this), String(other));
  };
  try {
    return compileCandidateOverlay(records, policy);
  } finally {
    String.prototype.localeCompare = original;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function runValidation() {
  const fixtures = readJson(FIXTURE_FILE);
  const protectedBefore = scorerHashes();
  const basePolicy = makeBaseOnlyPolicy(readJson(MULTIMODE_POLICY_FILE));
  const baseBytesBefore = Buffer.from(canonicalize(basePolicy));
  const ingestion = ingestCorrectionRecords(fixtures.records, fixtures.retention);
  assert.strictEqual(ingestion.sanitizedRecords.length, 2);
  assert.deepStrictEqual(
    ingestion.excluded.map((item) => item.reason).sort(),
    ['privacy-filter', 'retention-policy']
  );

  const alternateIngestion = ingestCorrectionRecords(
    fixtures.divergentRecords,
    fixtures.alternateRetention
  );
  const primaryDivergentIngestion = ingestCorrectionRecords(
    fixtures.divergentRecords,
    fixtures.retention
  );
  const mixedPartitionRejection = expectCode('MIXED_CORPUS_PARTITION', () => (
    compileCandidateOverlay([
      ...primaryDivergentIngestion.sanitizedRecords,
      ...alternateIngestion.sanitizedRecords,
    ], basePolicy)
  ));
  const alternatePolicyIngestion = ingestCorrectionRecords(
    fixtures.divergentRecords,
    { ...fixtures.retention, maxAgeEpochs: fixtures.retention.maxAgeEpochs + 1 }
  );
  const mixedRetentionRejection = expectCode('MIXED_RETENTION_POLICY', () => (
    compileCandidateOverlay([
      ...primaryDivergentIngestion.sanitizedRecords,
      ...alternatePolicyIngestion.sanitizedRecords,
    ], basePolicy)
  ));

  const localeDestinations = [syntheticDestination('ä-mode'), syntheticDestination('z-mode')];
  const localePolicy = syntheticPolicy(localeDestinations);
  const localeRaw = localeDestinations.map((destination, index) => ({
    recordId: `locale-${index}`,
    kind: 'receipt',
    capturedAtEpoch: 115 + index,
    vocabulary: [`locale-token-${index}`],
    correctedDestinationId: destination.id,
    outcome: 'corrected',
    content: `locale ordering ${index}`,
  }));
  const localeCorpus = ingestCorrectionRecords(localeRaw, fixtures.retention).sanitizedRecords;
  assert.notStrictEqual(
    Math.sign(new Intl.Collator('en-US').compare('ä-mode', 'z-mode')),
    Math.sign(new Intl.Collator('sv-SE').compare('ä-mode', 'z-mode'))
  );
  const enLocaleCandidate = compileUnderLocale('en-US', localeCorpus, localePolicy);
  const svLocaleCandidate = compileUnderLocale('sv-SE', localeCorpus, localePolicy);
  assert.strictEqual(enLocaleCandidate.overlay.candidateId, svLocaleCandidate.overlay.candidateId);

  const compiled = compileCandidateOverlay(ingestion.sanitizedRecords, basePolicy);
  assert.strictEqual(compiled.status, 'candidate');
  assert.strictEqual(Object.isFrozen(compiled.overlay), true);
  assert.strictEqual(canonicalize(basePolicy), baseBytesBefore.toString('utf8'));
  assert.ok(compiled.overlay.adjustments.every((item) => !Object.hasOwn(item, 'weight')));
  assert.strictEqual(INERT_WEIGHT, 4);
  assert.throws(() => {
    compiled.overlay.adjustments[0].vocabulary.push('online mutation');
  }, TypeError);
  const mutableOverlayRejection = 'TypeError';

  const firstReplay = runRouteGoldReplay(compiled.overlay, basePolicy, fixtures.routeGold);
  const secondReplay = runRouteGoldReplay(compiled.overlay, basePolicy, fixtures.routeGold);
  assert.strictEqual(firstReplay.allPass, true);
  assert.strictEqual(canonicalize(firstReplay), canonicalize(secondReplay));
  assert.strictEqual(firstReplay.writeBackAttempts.length, 0);

  const noOverlayReplay = runRouteGoldReplay(null, basePolicy, fixtures.routeGold);
  const noOpBody = {
    schemaVersion: 'V1',
    basePolicyHash: basePolicy.basePolicyHash,
    adjustments: [],
  };
  const noOpCandidate = {
    ...noOpBody,
    candidateId: hashArtifact(DOMAIN_TAGS.CorrectionOverlayV1, noOpBody),
  };
  const noOpReplay = runRouteGoldReplay(noOpCandidate, basePolicy, fixtures.routeGold);
  assert.strictEqual(
    canonicalize(noOverlayReplay.rows.map((row) => row.decision)),
    canonicalize(noOpReplay.rows.map((row) => row.decision))
  );
  assert.strictEqual(
    canonicalize(noOverlayReplay.rows.map((row) => row.decision)),
    canonicalize(firstReplay.rows.map((row) => row.decision))
  );

  const callerGoldRejection = expectCode('CALLER_GOLD_FORBIDDEN', () => (
    runRouteGoldReplay(compiled.overlay, basePolicy, [{
      ...fixtures.routeGold[0],
      expectedIntents: ['implementation'],
    }])
  ));
  const divergentCompiled = compileCandidateOverlay(
    primaryDivergentIngestion.sanitizedRecords,
    basePolicy
  );
  const divergenceFixture = fixtures.routeGold.find((item) => (
    item.id === 'base-no-match-preserved'
  ));
  const preservedRouteFixture = fixtures.routeGold.find((item) => (
    item.id === 'base-implementation-route-preserved'
  ));
  const divergentReplay = runRouteGoldReplay(
    divergentCompiled.overlay,
    basePolicy,
    [divergenceFixture, preservedRouteFixture]
  );
  assert.strictEqual(divergentReplay.rows[0].baselineDecision.action, 'defer');
  assert.strictEqual(divergentReplay.rows[0].decision.action, 'route');
  assert.strictEqual(
    canonicalize(divergentReplay.rows[1].decision),
    canonicalize(divergentReplay.rows[1].baselineDecision)
  );
  assert.strictEqual(divergentReplay.allPass, false);

  const corruptedScorer = scoreRouteGoldReadOnly([{
    scenario: scorerScenario(['implementation']),
    observed: { observedIntents: ['figma'], observedResources: [] },
  }]);
  assert.strictEqual(corruptedScorer.verdicts[0].pass, false);

  const weighted = JSON.parse(JSON.stringify(compiled.overlay));
  weighted.adjustments[0].weight = 4;
  const weightRejection = expectCode(
    'OVERLAY_FIELD_FORBIDDEN',
    () => validateCandidate(weighted, basePolicy)
  );
  const widened = JSON.parse(JSON.stringify(compiled.overlay));
  widened.adjustments[0].destinationId.workflowMode = 'undeclared-destination';
  const wideningRejection = expectCode(
    'CANDIDATE_SET_WIDENED',
    () => validateCandidate(widened, basePolicy)
  );
  const forgedIdentity = { ...compiled.overlay, candidateId: '0'.repeat(64) };
  const identityRejection = expectCode(
    'CANDIDATE_ID_MISMATCH',
    () => validateCandidate(forgedIdentity, basePolicy)
  );

  const n1Policy = makeBaseOnlyPolicy(readJson(N1_POLICY_FILE));
  const n1 = compileCandidateOverlay(ingestion.sanitizedRecords, n1Policy);
  assert.deepStrictEqual(n1, {
    status: 'inert',
    overlay: null,
    reason: 'single-destination',
  });
  const n1Tuple = effectiveTuple(n1Policy, null, n1Policy.activationGeneration);
  assert.strictEqual(n1Tuple.effectivePolicyHash, computeEffectivePolicyHash(n1Tuple));

  const hardGateVerdicts = promotionHardGates(basePolicy);
  const activation = createDormantActivation(basePolicy);
  const expectedCurrent = activation.manifest.selectedPolicy;
  const approval = { ...fixtures.approval, candidateId: compiled.overlay.candidateId };
  const promotion = promoteCandidate({
    candidate: compiled.overlay,
    basePolicy,
    routeGold: fixtures.routeGold,
    approval,
    telemetryEvidence: fixtures.telemetryEvidence,
    sanitizedRecords: ingestion.sanitizedRecords,
    activation,
    expectedFencingEpoch: 0,
    expectedCurrent,
    aggregateScore: '1.000000',
    hardGateVerdicts,
  });
  assert.notStrictEqual(promotion.overlay.overlayHash, basePolicy.basePolicyHash);
  assert.strictEqual(promotion.tuple.effectivePolicyHash, computeEffectivePolicyHash(
    promotion.tuple
  ));
  assert.strictEqual(promotion.activePin.generation, basePolicy.activationGeneration + 1);
  assert.strictEqual(canonicalize(basePolicy), baseBytesBefore.toString('utf8'));

  const divergentApproval = {
    ...fixtures.approval,
    candidateId: divergentCompiled.overlay.candidateId,
  };
  const hardGateRejection = expectCode('ROUTE_GOLD_GATE_FAILED', () => promoteCandidate({
    candidate: divergentCompiled.overlay,
    basePolicy,
    routeGold: [divergenceFixture, preservedRouteFixture],
    approval: divergentApproval,
    telemetryEvidence: telemetryFor(primaryDivergentIngestion.sanitizedRecords),
    sanitizedRecords: primaryDivergentIngestion.sanitizedRecords,
    activation,
    expectedFencingEpoch: 0,
    expectedCurrent,
    aggregateScore: '999999.000000',
    hardGateVerdicts,
  }));
  const negativeGateRejection = expectCode('NEGATIVE_TARGET_GATE_FAILED', () => (
    promoteCandidate({
      candidate: compiled.overlay,
      basePolicy,
      routeGold: fixtures.routeGold,
      approval,
      telemetryEvidence: fixtures.telemetryEvidence,
      sanitizedRecords: ingestion.sanitizedRecords,
      activation,
      expectedFencingEpoch: 0,
      expectedCurrent,
      aggregateScore: '999999.000000',
      hardGateVerdicts: {
        ...hardGateVerdicts,
        negativeTargetFree: { pass: false, code: 'NEGATIVE_TARGET_FORBIDDEN' },
      },
    })
  ));
  const evidenceGateRejection = expectCode('EVIDENCE_COMMIT_GATE_FAILED', () => (
    promoteCandidate({
      candidate: compiled.overlay,
      basePolicy,
      routeGold: fixtures.routeGold,
      approval,
      telemetryEvidence: fixtures.telemetryEvidence,
      sanitizedRecords: ingestion.sanitizedRecords,
      activation,
      expectedFencingEpoch: 0,
      expectedCurrent,
      aggregateScore: '999999.000000',
      hardGateVerdicts: {
        ...hardGateVerdicts,
        evidenceNeverCommits: { pass: false, code: 'ROLE_CANNOT_COMMIT' },
      },
    })
  ));
  const verifyGateRejection = expectCode('VERIFY_GATE_FAILED', () => promoteCandidate({
    candidate: compiled.overlay,
    basePolicy,
    routeGold: fixtures.routeGold,
    approval,
    telemetryEvidence: fixtures.telemetryEvidence,
    sanitizedRecords: ingestion.sanitizedRecords,
    activation,
    expectedFencingEpoch: 0,
    expectedCurrent,
    aggregateScore: '999999.000000',
    hardGateVerdicts: {
      ...hardGateVerdicts,
      commitRequiresVerify: { pass: false, code: 'COMMIT_WITHOUT_READY' },
    },
  }));
  const approvalRejection = expectCode('INDEPENDENT_APPROVAL_REQUIRED', () => (
    promoteCandidate({
      candidate: compiled.overlay,
      basePolicy,
      routeGold: fixtures.routeGold,
      approval: { ...approval, approvedBy: approval.proposedBy },
      telemetryEvidence: fixtures.telemetryEvidence,
      sanitizedRecords: ingestion.sanitizedRecords,
      activation,
      expectedFencingEpoch: 0,
      expectedCurrent,
      aggregateScore: '1.000000',
      hardGateVerdicts,
    })
  ));
  const telemetryRejection = expectCode('TELEMETRY_GAIN_REQUIRED', () => promoteCandidate({
    candidate: compiled.overlay,
    basePolicy,
    routeGold: fixtures.routeGold,
    approval,
    telemetryEvidence: {
      ...fixtures.telemetryEvidence,
      candidateCorrect: fixtures.telemetryEvidence.baselineCorrect,
    },
    sanitizedRecords: ingestion.sanitizedRecords,
    activation,
    expectedFencingEpoch: 0,
    expectedCurrent,
    aggregateScore: '1.000000',
    hardGateVerdicts,
  }));
  const telemetryCorpusRejection = expectCode('TELEMETRY_CORPUS_MISMATCH', () => (
    promoteCandidate({
      candidate: compiled.overlay,
      basePolicy,
      routeGold: fixtures.routeGold,
      approval,
      telemetryEvidence: { ...fixtures.telemetryEvidence, corpusHash: '0'.repeat(64) },
      sanitizedRecords: ingestion.sanitizedRecords,
      activation,
      expectedFencingEpoch: 0,
      expectedCurrent,
      hardGateVerdicts,
    })
  ));
  const mixedGenerationRejection = expectCode('MIXED_GENERATIONS', () => (
    assertSingleGeneration([
      activation.manifest.selectedPolicy,
      promotion.state.manifest.selectedPolicy,
    ])
  ));
  const staleCasRejection = expectCode('MANIFEST_CAS_MISMATCH', () => promoteCandidate({
    candidate: compiled.overlay,
    basePolicy,
    routeGold: fixtures.routeGold,
    approval,
    telemetryEvidence: fixtures.telemetryEvidence,
    sanitizedRecords: ingestion.sanitizedRecords,
    activation,
    expectedFencingEpoch: 0,
    expectedCurrent: {
      effectivePolicyHash: expectedCurrent.effectivePolicyHash,
      generation: expectedCurrent.generation - 1,
    },
    hardGateVerdicts,
  }));
  const forgedOverlayBytes = JSON.parse(JSON.stringify(promotion.overlay));
  forgedOverlayBytes.adjustments[0].vocabulary.push('forged-vocabulary');
  const declaredHashMismatchRejection = expectCode('OVERLAY_HASH_MISMATCH', () => (
    effectiveTuple(basePolicy, forgedOverlayBytes, promotion.tuple.activationGeneration)
  ));
  const unretainedPromotion = { ...promotion };
  delete unretainedPromotion.retainedPriorArtifact;
  const unretainedRollbackRejection = expectCode('RETAINED_ARTIFACT_REQUIRED', () => (
    rollbackPromotion(unretainedPromotion)
  ));
  const rollback = rollbackPromotion(promotion);
  assert.strictEqual(rollback.byteExact, true);
  assert.strictEqual(rollback.restoredBytes.equals(rollback.priorBytes), true);
  assert.strictEqual(rollback.state.fencingEpoch, 2);
  assert.strictEqual(
    canonicalize(rollback.restoredArtifact),
    canonicalize(activation.retainedArtifact)
  );

  const routerObservation = routeSkillResources({
    skillRoot: path.join(REPO_ROOT, fixtures.producerComparison.skillRoot),
    taskText: fixtures.producerComparison.taskText,
  });
  assert.strictEqual(routerObservation.parseable, true);
  assert.strictEqual(routerObservation.intents.length, 1);
  const producerMode = routerObservation.intents[0];
  const producerDestination = syntheticDestination(producerMode);
  const producerPolicy = syntheticPolicy(
    [producerDestination, syntheticDestination('unused-mode')],
    [{ id: 'detector:producer', kind: 'exact', value: fixtures.producerComparison.taskText }],
    [{
      id: 'selector:producer',
      destinationId: producerDestination.id,
      detectorIds: ['detector:producer'],
    }]
  );
  const producerCorpus = ingestCorrectionRecords([{
    recordId: 'producer-comparison',
    kind: 'receipt',
    capturedAtEpoch: 117,
    vocabulary: [fixtures.producerComparison.taskText],
    correctedDestinationId: producerDestination.id,
    outcome: 'corrected',
    content: 'compare the protected producer with evaluator output',
  }], fixtures.retention).sanitizedRecords;
  const producerCandidate = compileCandidateOverlay(producerCorpus, producerPolicy).overlay;
  const producerFixture = {
    id: 'router-producer-equivalence',
    taskText: fixtures.producerComparison.taskText,
    observationKind: 'intent',
    leafPairs: routerObservation.resources.map((resource) => ({
      workflowMode: producerMode,
      leafResourceId: resource,
    })),
    manifestResources: routerObservation.resources.map((resource) => ({
      workflowMode: producerMode,
      leafResourceId: resource,
      resource,
    })),
  };
  const producerReplay = runRouteGoldReplay(
    producerCandidate,
    producerPolicy,
    [producerFixture]
  );
  assert.deepStrictEqual(
    producerReplay.rows[0].projection.observedIntents,
    routerObservation.intents
  );
  assert.deepStrictEqual(
    producerReplay.rows[0].projection.observedResources,
    routerObservation.resources
  );
  const protectedAfter = scorerHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);

  return {
    status: 'pass',
    identity: {
      basePolicyHash: basePolicy.basePolicyHash,
      overlayHash: promotion.overlay.overlayHash,
      effectivePolicyHash: promotion.tuple.effectivePolicyHash,
      generation: promotion.tuple.activationGeneration,
      reproducible: true,
      forgedCandidateRejected: identityRejection,
      declaredHashMismatchRejected: declaredHashMismatchRejection,
    },
    vocabularyOnly: {
      inertWeight: INERT_WEIGHT,
      candidateFields: Object.keys(compiled.overlay).sort(),
      adjustmentFields: Object.keys(compiled.overlay.adjustments[0]).sort(),
      injectedWeightRejected: weightRejection,
      mutableOverlayRejected: mutableOverlayRejection,
      localeIndependentCandidateHash: enLocaleCandidate.overlay.candidateId,
      mixedPartitionRejected: mixedPartitionRejection,
      mixedRetentionPolicyRejected: mixedRetentionRejection,
    },
    replay: {
      rows: firstReplay.rows.length,
      allPass: firstReplay.allPass,
      replayHash: firstReplay.replayHash,
      byteIdenticalRuns: canonicalize(firstReplay) === canonicalize(secondReplay),
      evaluatorPolicyHash: firstReplay.evaluatorPolicyHash,
      baseAndNoOpDecisionsByteIdentical: canonicalize(
        noOverlayReplay.rows.map((row) => row.decision)
      ) === canonicalize(noOpReplay.rows.map((row) => row.decision)),
      baseRoutesPreservedWithOverlay: canonicalize(
        noOverlayReplay.rows.map((row) => row.decision)
      ) === canonicalize(firstReplay.rows.map((row) => row.decision)),
      divergentRealEvaluatorAction: divergentReplay.rows[0].decision.action,
      divergentBaselineAction: divergentReplay.rows[0].baselineDecision.action,
      divergentBaseRoutePreserved: canonicalize(divergentReplay.rows[1].decision)
        === canonicalize(divergentReplay.rows[1].baselineDecision),
      divergentRouteGoldPass: divergentReplay.allPass,
      callerGoldRejected: callerGoldRejection,
      corruptedObservationPass: corruptedScorer.verdicts[0].pass,
      scorerWriteBackAttempts: firstReplay.writeBackAttempts,
      routerProducerCompared: true,
      routerProducerIntents: routerObservation.intents,
      routerProducerResources: routerObservation.resources,
      protectedHashes: protectedAfter,
    },
    promotion: {
      status: promotion.status,
      independentApprover: approval.approvedBy,
      hardGateHighAggregateRejected: hardGateRejection,
      negativeTargetGateRejected: negativeGateRejection,
      evidenceCommitGateRejected: evidenceGateRejection,
      verifyGateRejected: verifyGateRejection,
      samePersonApprovalRejected: approvalRejection,
      noGainRejected: telemetryRejection,
      unboundTelemetryRejected: telemetryCorpusRejection,
      mixedGenerationRejected: mixedGenerationRejection,
      staleCasRejected: staleCasRejection,
      servingAuthority: promotion.state.manifest.servingAuthority,
      shadowOnly: promotion.state.manifest.shadowOnly,
    },
    rollback: {
      byteExact: rollback.byteExact,
      fencingEpoch: rollback.state.fencingEpoch,
      restoredGeneration: rollback.state.manifest.selectedPolicy.generation,
      unretainedArtifactRejected: unretainedRollbackRejection,
      restoredArtifactIdentity: rollback.restoredArtifact.tuple.effectivePolicyHash,
    },
    privacy: {
      admitted: ingestion.sanitizedRecords.map((record) => record.recordId),
      excluded: ingestion.excluded,
      selfAttestedCleanRecordExcluded: ingestion.excluded.some((item) => (
        item.recordId === 'receipt-private-1' && item.reason === 'privacy-filter'
      )),
    },
    authority: {
      negativeTargetRejected: hardGateVerdicts.negativeTargetFree.code,
      evidenceCommitRejected: hardGateVerdicts.evidenceNeverCommits.code,
      commitWithoutReadyRejected: hardGateVerdicts.commitRequiresVerify.code,
      candidateWideningRejected: wideningRejection,
      candidateCountBefore: basePolicy.destinations.length,
      candidateCountAfter: basePolicy.destinations.length,
    },
    n1: {
      candidateCount: n1Policy.destinations.length,
      overlay: n1.overlay,
      provenancePolicy: n1Policy.provenancePolicy.kind,
      effectivePolicyHash: n1Tuple.effectivePolicyHash,
    },
    gates: {
      realEvaluatorRouteGold: firstReplay.allPass,
      noOpEquivalence: true,
      immutableScorer: canonicalize(protectedAfter) === canonicalize(protectedBefore),
      hardGatePreconditions: true,
      artifactAuthenticatedCas: true,
      singlePartitionCorpus: true,
      localeIndependentIdentity: true,
      producerParity: true,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

try {
  process.stdout.write(`${canonicalize(runValidation())}\n`);
} catch (error) {
  process.stderr.write(`[learning-overlay] ${error.stack || error.message}\n`);
  process.exitCode = 1;
}
