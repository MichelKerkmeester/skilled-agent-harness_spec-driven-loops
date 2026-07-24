// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createDeepAlignmentEventRegistry,
  prepareDeepAlignmentEvent,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_REDUCER_SURFACE,
  DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION,
  createDeepAlignmentProjectionState,
  foldDeepAlignmentEvents,
  isDeepFrozenProjection,
  projectDeepAlignmentLegacyView,
  reduceDeepAlignmentVerifiedEvent,
  verifyDeepAlignmentReducerSurface,
} from '../../lib/deep-alignment-reducers/index.js';
import { reduceSharedReviewLoopBackbone } from '../../lib/deep-review-reducers/index.js';
import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAlignmentEventInput,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_STREAM_ID = 'deep-alignment-run';
const registry = createDeepAlignmentEventRegistry();

interface EventIdentity {
  readonly eventId?: string;
  readonly streamId?: string;
  readonly streamSequence?: number;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function replayMetadata(label: string): DeepAlignmentReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      authority: digest('authority'),
      configuration: digest('configuration'),
      subject: digest('subject'),
      verifier: digest('verifier'),
    },
  };
}

function semanticFingerprint(seed: string): SemanticFingerprintParts {
  return {
    algorithmVersion: 'semantic-fingerprint@1',
    semanticAnchorDigest: digest(`anchor:${seed}`),
    normalizedContextDigest: digest(`context:${seed}`),
    programSliceDigest: digest(`slice:${seed}`),
    renameMapVersion: 'rename-map@1',
    baselineState: 'present',
  };
}

function convergenceSignals(seed: string): DeepAlignmentPayloadMap[
  'deep_alignment.convergence_evaluated'
]['rawSignals'] {
  return {
    noveltyRatio: 0,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(`signals:${seed}`),
  };
}

function event<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  index: number,
  scope: DeepAlignmentScopeMap[TStem],
  data: DeepAlignmentPayloadMap[TStem],
  identity: EventIdentity = {},
  previousHash = digest(`tail:${index - 1}`),
): DeepAlignmentLedgerEvent {
  const eventId = identity.eventId ?? `event-${index}`;
  const streamSequence = identity.streamSequence ?? index;
  const input: DeepAlignmentEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: previousHash,
    replay: replayMetadata(eventId),
    data,
    eventId,
    streamId: identity.streamId ?? RUN_STREAM_ID,
    streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-alignment-shadow-reducer', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: streamSequence === 1 ? null : `event-${streamSequence - 1}`,
    idempotencyKey: `deep-alignment-reducer-${eventId}`,
  };
  return prepareDeepAlignmentEvent(input, registry).envelope as DeepAlignmentLedgerEvent;
}

function baseScope(): {
  readonly runId: string;
  readonly sessionId: string;
  readonly authorityEpochId: string;
} {
  return {
    runId: 'run-1',
    sessionId: 'session-1',
    authorityEpochId: 'authority-epoch-1',
  };
}

function iterationScope(): {
  readonly runId: string;
  readonly sessionId: string;
  readonly authorityEpochId: string;
  readonly generation: number;
  readonly iterationId: string;
} {
  return { ...baseScope(), generation: 1, iterationId: 'iteration-1' };
}

function laneScope(): {
  readonly runId: string;
  readonly sessionId: string;
  readonly authorityEpochId: string;
  readonly generation: number;
  readonly iterationId: string;
  readonly laneId: string;
} {
  return { ...iterationScope(), laneId: 'lane-1' };
}

function subjectScope(observationId = 'observation-1'): {
  readonly runId: string;
  readonly sessionId: string;
  readonly authorityEpochId: string;
  readonly generation: number;
  readonly iterationId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly observationId: string;
} {
  return {
    ...laneScope(),
    subjectId: 'subject-1',
    ruleId: 'rule-1',
    observationId,
  };
}

function runInitialized(index = 1): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.run_initialized',
    index,
    { ...baseScope(), generation: 1 },
    {
      target: {
        targetId: 'target-root',
        targetType: 'repository',
        artifactRef: 'artifact:repository',
        sourceDigest: digest('target-source'),
        contentDigest: digest('target-content'),
      },
      lineageMode: 'fresh',
      maxIterations: 4,
      convergencePolicyVersion: 'alignment-convergence@1',
      reviewModeContractDigest: digest('alignment-contract'),
      initialReleaseReadinessState: 'not-assessed',
    },
  );
}

function authorityReference(index = 2): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.authority_reference_bound',
    index,
    baseScope(),
    {
      authorityId: 'authority-main',
      authorityCapsuleRef: 'authority-capsule-1',
      authoritySourceDigest: digest('authority-source'),
      compilerFingerprint: digest('authority-compiler'),
      profileDigest: digest('authority-profile'),
      ruleIrDigest: digest('rule-ir'),
      signatureDigest: digest('authority-signature'),
      expiresAt: '2027-07-23T10:00:00.000Z',
      rollbackRef: null,
    },
  );
}

function authorityValidation(index = 3): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.authority_validation_recorded',
    index,
    baseScope(),
    {
      authorityReferenceEventId: 'event-2',
      checks: {
        parse: 'pass',
        type: 'pass',
        capability: 'pass',
        ruleTests: 'pass',
        coverage: 'pass',
        expiry: 'pass',
        rollback: 'pass',
        signature: 'pass',
        mixAndMatch: 'pass',
        resultDigest: digest('authority-checks'),
      },
      authorityStatus: 'valid',
      validationReceiptRefs: ['receipt:authority'],
      validatorFingerprint: digest('authority-validator'),
      validationDigest: digest('authority-validation'),
      blockedReasonCode: null,
    },
  );
}

function scopeResolved(index = 4): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.scope_resolved',
    index,
    baseScope(),
    {
      targetSetDigest: digest('target-set'),
      scopeClass: 'targeted',
      selectedTargets: [{
        targetId: 'target-file',
        targetType: 'file',
        artifactRef: 'artifact:src/alignment.ts',
        sourceDigest: digest('alignment-source'),
        contentDigest: digest('alignment-content'),
      }],
      omittedHighRiskTargetRefs: [],
      discoveryMethodIds: ['changed-files'],
      scopeEvidenceRefs: ['evidence:scope'],
    },
  );
}

function dimensionOrdered(index = 5): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.dimension_ordered',
    index,
    baseScope(),
    {
      orderedDimensionIds: ['alignment'],
      riskRationale: 'Authority-backed alignment is the only required dimension.',
      scopeEvidenceRefs: ['evidence:scope'],
      orderingPolicyVersion: 'dimension-order@1',
    },
  );
}

function lanePlan(index = 6): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.lane_plan_recorded',
    index,
    laneScope(),
    {
      laneKind: 'schema',
      orderedRuleIds: ['rule-1'],
      ruleIrRef: 'rule-ir:1',
      ruleIrDigest: digest('rule-ir'),
      verifierPolicyVersion: 'verifier-policy@1',
      budgetRef: 'budget:lane-1',
      requiredEvidenceClasses: ['schema-witness'],
      planDigest: digest('lane-plan'),
    },
  );
}

function laneStarted(index = 7): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.lane_started',
    index,
    laneScope(),
    {
      lanePlanEventId: 'event-6',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-3',
      authorityValidationDigest: digest('authority-validation'),
      status: 'started',
    },
  );
}

function subjectSnapshot(index = 8): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.subject_snapshot_bound',
    index,
    { ...laneScope(), subjectId: 'subject-1' },
    {
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectType: 'file',
      subjectDigest: digest('subject-snapshot'),
      sourceVersionRef: 'source-version-1',
      capturedAt: TIMESTAMP,
      parentSnapshotRef: null,
      receiptRef: 'receipt:subject',
    },
  );
}

function applicability(index = 9): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.applicability_evaluated',
    index,
    { ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1' },
    {
      predicateRef: 'predicate:rule-1',
      predicateDigest: digest('predicate'),
      targetFactRefs: ['target-fact:language'],
      targetFactDigest: digest('target-facts'),
      result: 'applicable',
      evaluatorFingerprint: digest('applicability-evaluator'),
      authorityValidationEventId: 'event-3',
      decisionDigest: digest('applicability-decision'),
      reasonCode: 'subject-matches-rule',
    },
  );
}

function passStarted(index = 10): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.dimension_pass_started',
    index,
    { ...iterationScope(), dimensionId: 'alignment' },
    {
      passNumber: 1,
      targetRefs: ['target:subject-1'],
      filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage'),
      passStatus: 'started',
      nextFocusRef: 'focus:rule-1',
    },
  );
}

function observation(
  index = 11,
  observationId = 'observation-1',
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.observation_recorded',
    index,
    subjectScope(observationId),
    {
      applicabilityDecisionId: 'event-9',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      detectorFingerprint: digest(`detector:${observationId}`),
      observationKind: 'schema',
      rawResultDigest: digest(`raw:${observationId}`),
      sourceDigest: digest('subject-source'),
      contentDigest: digest(`content:${observationId}`),
      evidenceClass: 'schema-witness',
      freshness: 'fresh',
      causalRelevance: 'direct',
      locator: {
        scheme: 'file',
        artifactRef: 'artifact:subject-1',
        locatorDigest: digest(`locator:${observationId}`),
        selector: `symbol:${observationId}`,
        revision: 'revision-1',
      },
      receiptRefs: [`receipt:${observationId}`],
    },
  );
}

function applicabilityCoverage(index = 12): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.applicability_coverage_recorded',
    index,
    laneScope(),
    {
      authorityValidationEventId: 'event-3',
      subjectSnapshotDigest: digest('subject-snapshot'),
      declaredApplicabilityEdgeRefs: ['edge:rule-1-subject-1'],
      applicableRuleIds: ['rule-1'],
      notApplicableRuleIds: [],
      unresolvedRuleIds: [],
      untestedRuleIds: [],
      blockedRuleIds: [],
      coverageDigest: digest('applicability-coverage'),
    },
  );
}

function passCompleted(index = 13): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.dimension_pass_completed',
    index,
    { ...iterationScope(), dimensionId: 'alignment' },
    {
      passNumber: 1,
      targetRefs: ['target:subject-1'],
      filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage'),
      passStatus: 'complete',
      rawFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
      nextFocusRef: 'focus:convergence',
    },
  );
}

function laneCompleted(
  index = 14,
  verificationRefs: string[] = [],
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.lane_completed',
    index,
    laneScope(),
    {
      lanePlanEventId: 'event-6',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-3',
      applicabilityDecisionRefs: ['event-9'],
      observationRefs: ['event-11'],
      verificationRefs,
      status: 'complete',
      counts: {
        applicable: 1,
        notApplicable: 0,
        unresolved: 0,
        untested: 0,
        blocked: 0,
        nonConformant: verificationRefs.length,
      },
      completionDigest: digest('lane-completion'),
      blockedReasonCode: null,
    },
  );
}

function convergence(
  index = 15,
  overrides: Partial<DeepAlignmentPayloadMap[
    'deep_alignment.convergence_evaluated'
  ]> = {},
  identity: EventIdentity = {},
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.convergence_evaluated',
    index,
    iterationScope(),
    {
      rawSignals: convergenceSignals('raw'),
      weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: digest('dimension-coverage'),
      protocolCoverageDigest: digest('protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 1,
      hotspotSaturation: 1,
      decision: 'converged',
      policyFingerprint: digest('convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
      ...overrides,
    },
    identity,
  );
}

function synthesis(index = 16): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.synthesis_started',
    index,
    { ...baseScope(), reportRevisionId: 'report-1' },
    {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-15' },
      findingRegistryInputDigest: digest('registry-input'),
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
    },
  );
}

function report(index = 17): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.review_report_committed',
    index,
    { ...baseScope(), reportRevisionId: 'report-1' },
    {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-16' },
      findingRegistryInputDigest: digest('registry-input'),
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
      reportDigest: digest('report'),
      sectionManifest: {
        sectionIds: ['authority', 'alignment'],
        manifestDigest: digest('section-manifest'),
      },
      reportReceiptRef: 'receipt:report',
    },
  );
}

function continuityRequested(index = 18): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.continuity_save_requested',
    index,
    baseScope(),
    {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-17' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
    },
  );
}

function continuityCompleted(index = 19): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.continuity_save_completed',
    index,
    baseScope(),
    {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-18' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['receipt:continuity'],
      continuityFingerprint: digest('continuity'),
    },
  );
}

function runCompleted(
  index = 20,
  references: {
    readonly convergenceEventId?: string;
    readonly synthesisEventId?: string;
    readonly reportEventId?: string;
    readonly continuityEventId?: string;
  } = {},
): DeepAlignmentLedgerEvent {
  const previousHash = digest(`tail:${index - 1}`);
  return event(
    'deep_alignment.run_completed',
    index,
    baseScope(),
    {
      terminalStatus: 'completed',
      convergenceEventId: references.convergenceEventId ?? 'event-15',
      synthesisEventId: references.synthesisEventId ?? 'event-16',
      reportEventId: references.reportEventId ?? 'event-17',
      continuityEventId: references.continuityEventId ?? 'event-19',
      finalLedgerTailHash: previousHash,
      counts: { dimensions: 1, iterations: 1, candidates: 0, findings: 0, evidence: 1 },
      verdict: 'pass',
      completionReason: 'All required alignment checks completed.',
      incompleteReason: null,
    },
    {},
    previousHash,
  );
}

function successfulEvents(): DeepAlignmentLedgerEvent[] {
  return [
    runInitialized(),
    authorityReference(),
    authorityValidation(),
    scopeResolved(),
    dimensionOrdered(),
    lanePlan(),
    laneStarted(),
    subjectSnapshot(),
    applicability(),
    passStarted(),
    observation(),
    applicabilityCoverage(),
    passCompleted(),
    laneCompleted(),
    convergence(),
    synthesis(),
    report(),
    continuityRequested(),
    continuityCompleted(),
    runCompleted(),
  ];
}

function evidenceReceipt(
  index = 12,
  observationId = 'observation-1',
  evidenceId = 'evidence-1',
  observationEventId = 'event-11',
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.evidence_receipt_bound',
    index,
    { ...subjectScope(observationId), evidenceId },
    {
      observationEventId,
      receiptRef: `receipt:${evidenceId}`,
      receiptDigest: digest(`receipt:${evidenceId}`),
      evidenceClass: 'schema-witness',
      freshness: 'fresh',
      sourceDigest: digest('subject-source'),
      contentDigest: digest(`content:${observationId}`),
      toolFingerprint: digest(`tool:${evidenceId}`),
      capturedAt: TIMESTAMP,
    },
  );
}

function findingCandidate(
  index = 13,
  options: {
    readonly evidenceReceiptRefs?: string[];
    readonly sourcePassEventId?: string;
    readonly candidateClaimDigest?: string;
  } = {},
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.finding_candidate_emitted',
    index,
    { ...subjectScope(), candidateId: 'candidate-1' },
    {
      observationEventId: 'event-11',
      applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: options.evidenceReceiptRefs ?? ['receipt:evidence-1'],
      detectorFingerprint: digest('detector:observation-1'),
      detectorBlindingDigest: digest('detector-blinding'),
      candidateClaimDigest: options.candidateClaimDigest ?? digest('candidate-claim'),
      findingClass: 'security-schema',
      rawImpact: 0.2,
      rawConfidence: 0.2,
      rawCandidateScore: 0.2,
      scorerFingerprint: digest('independent-scorer'),
      scoringPolicyVersion: 'alignment-score@1',
      semanticFingerprint: semanticFingerprint('candidate'),
      sourcePassEventId: options.sourcePassEventId ?? 'event-10',
    },
  );
}

function verification(index = 14): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.finding_verification_recorded',
    index,
    {
      ...subjectScope(),
      candidateId: 'candidate-1',
      findingId: 'finding-1',
      verificationId: 'verification-1',
    },
    {
      candidateEventId: 'event-13',
      observationEventId: 'event-11',
      authorityValidationEventId: 'event-3',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      verifierFingerprint: digest('independent-verifier'),
      verifierIndependenceDigest: digest('verifier-independence'),
      proofWitnessRefs: ['proof-1'],
      verificationMode: 'schema',
      result: 'confirmed',
      rawImpact: 0.2,
      rawConfidence: 0.2,
      evidenceStrength: 1,
      counterevidenceRefs: [],
      verificationDigest: digest('verification'),
    },
  );
}

function proofWitness(index = 15): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.proof_witness_recorded',
    index,
    {
      ...subjectScope(),
      candidateId: 'candidate-1',
      findingId: 'finding-1',
      verificationId: 'verification-1',
      proofId: 'proof-1',
    },
    {
      verificationEventId: 'event-14',
      witnessKind: 'positive',
      artifactRef: 'artifact:proof-1',
      witnessDigest: digest('proof-witness'),
      sourceDigest: digest('proof-source'),
      locator: {
        scheme: 'file',
        artifactRef: 'artifact:proof-1',
        locatorDigest: digest('proof-locator'),
        selector: 'symbol:proof',
        revision: 'revision-1',
      },
      minimized: true,
      minimizerFingerprint: digest('proof-minimizer'),
      replayRecipeRef: 'recipe:proof-1',
      replayRecipeDigest: digest('proof-recipe'),
      outcome: 'supports',
      receiptRefs: ['receipt:evidence-1'],
    },
  );
}

function adjudication(
  index = 16,
  findingId = 'finding-1',
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.claim_adjudication_recorded',
    index,
    {
      ...subjectScope(),
      candidateId: 'candidate-1',
      findingId,
      verificationId: 'verification-1',
    },
    {
      candidateEventId: 'event-13',
      verificationEventId: 'event-14',
      observationEventId: 'event-11',
      claimDigest: digest('candidate-claim'),
      evidenceReceiptRefs: ['receipt:evidence-1'],
      proofWitnessRefs: ['proof-1'],
      counterevidenceRefs: [],
      verifierFingerprint: digest('independent-verifier'),
      assessorFingerprint: digest('independent-assessor'),
      authorityValidationEventId: 'event-3',
      applicabilityDecisionId: 'event-9',
      subjectSnapshotDigest: digest('subject-snapshot'),
      finalSeverity: 'P2',
      impact: 0.2,
      confidence: 0.2,
      outcome: 'accepted',
      transition: 'candidate-to-finding',
      adjudicationDigest: digest(`adjudication:${findingId}`),
      predecessorAdjudicationEventId: null,
    },
  );
}

function assessment(index = 17): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.conformance_assessment_recorded',
    index,
    {
      ...subjectScope(),
      candidateId: 'candidate-1',
      findingId: 'finding-1',
      verificationId: 'verification-1',
    },
    {
      adjudicationEventId: 'event-16',
      adjudicationPayloadDigest: digest('adjudication:finding-1'),
      authorityValidationEventId: 'event-3',
      authorityValidationDigest: digest('authority-validation'),
      authorityStatus: 'valid',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      applicabilityDecisionId: 'event-9',
      applicabilityOutcome: 'applicable',
      verificationEventId: 'event-14',
      verifierFingerprint: digest('independent-verifier'),
      proofWitnessRefs: ['proof-1'],
      evidenceReceiptRefs: ['receipt:evidence-1'],
      conformanceStatus: 'non_conformant',
      impact: 0.2,
      confidence: 0.2,
      assessmentPolicyVersion: 'conformance@1',
      assessmentDigest: digest('assessment'),
    },
  );
}

function hardVetoEvents(): DeepAlignmentLedgerEvent[] {
  return [
    runInitialized(),
    authorityReference(),
    authorityValidation(),
    scopeResolved(),
    dimensionOrdered(),
    lanePlan(),
    laneStarted(),
    subjectSnapshot(),
    applicability(),
    passStarted(),
    observation(),
    evidenceReceipt(),
    findingCandidate(),
    verification(),
    proofWitness(),
    adjudication(),
    assessment(),
    applicabilityCoverage(18),
    passCompleted(19),
    laneCompleted(20, ['event-14']),
    convergence(21),
  ];
}

function pauseOnAuxiliaryStream(
  streamId: string,
  streamSequence = 1,
): DeepAlignmentLedgerEvent {
  return event(
    'deep_alignment.pause_recorded',
    1,
    iterationScope(),
    {
      normalizedStopReason: 'operator-pause',
      sentinelCause: 'operator-request',
      fromIterationId: 'iteration-1',
      strategy: 'persist-and-pause',
      targetDimensionId: null,
      outcome: 'paused',
      lineageRef: 'lineage:pause',
      priorTailDigest: digest('pause-tail'),
    },
    {
      eventId: `pause-${streamId}`,
      streamId,
      streamSequence,
    },
  );
}

function verifiedEvent(typedEvent: DeepAlignmentLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(typedEvent), registry);
  const hash = digest(typedEvent.event_id);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'deep-alignment-shadow',
    sequence: typedEvent.stream_sequence,
    prev_record_hash: digest(`previous-frame:${typedEvent.stream_sequence}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'deep-alignment-shadow-authorization',
      audit_sequence: typedEvent.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision-${typedEvent.event_id}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'deep-alignment-shadow',
      sequence: typedEvent.stream_sequence,
      event_id: typedEvent.event_id,
      event_type: typedEvent.event_type,
      event_version: typedEvent.event_version,
      stream_id: typedEvent.stream_id,
      stream_sequence: typedEvent.stream_sequence,
      committed_at: TIMESTAMP,
    },
    canonical_event_bytes: Buffer.from(read.effective.canonicalBytes).toString('base64'),
    record_hash: hash,
  };
  return Object.freeze({ frame: Object.freeze(frame), event: read });
}

// ───────────────────────────────────────────────────────────────────
// 2. REDUCER CONTRACT TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-alignment reducers and projections', () => {
  it('replays identical real typed events to identical frozen projections', () => {
    const events = successfulEvents();
    const first = foldDeepAlignmentEvents(events);
    const second = foldDeepAlignmentEvents(events);

    expect(first.outcome).toBe('projected');
    expect(second.outcome).toBe('projected');
    if (first.outcome !== 'projected' || second.outcome !== 'projected') return;
    expect(first.projection).toEqual(second.projection);
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(isDeepFrozenProjection(first.projection)).toBe(true);
    expect(first.projection.status.state).toBe('complete');
  });

  it('uses causal input order for earlier- and later-sorting auxiliary streams', () => {
    const events = successfulEvents();
    const before = foldDeepAlignmentEvents([
      ...events.slice(0, 11),
      pauseOnAuxiliaryStream('aaaa-pause'),
      ...events.slice(11),
    ]);
    const after = foldDeepAlignmentEvents([
      ...events.slice(0, 11),
      pauseOnAuxiliaryStream('zzzz-pause'),
      ...events.slice(11),
    ]);

    expect(before.outcome).toBe('projected');
    expect(after.outcome).toBe('projected');
    if (before.outcome !== 'projected' || after.outcome !== 'projected') return;
    expect(before.projection.run.initializationEventId).toBe('event-1');
    expect(after.projection.run.initializationEventId).toBe('event-1');
    expect(before.projection.reviewLoop).toEqual(after.projection.reviewLoop);
    expect(before.projection.conformance).toEqual(after.projection.conformance);
    expect(before.projection.status.state).toBe(after.projection.status.state);
    expect(before.projection.status.state).toBe('complete');
  });

  it('fails closed on a per-stream sequence gap through the real fold', () => {
    const events = successfulEvents();
    const result = foldDeepAlignmentEvents([
      ...events.slice(0, 11),
      pauseOnAuxiliaryStream('auxiliary-pause', 2),
      ...events.slice(11),
    ]);

    expect(result).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('rejects an impossible status transition through the real fold', () => {
    expect(() => foldDeepAlignmentEvents([
      ...successfulEvents().slice(0, 16),
      pauseOnAuxiliaryStream('deep-alignment-run', 17),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status.provenance',
    }));
  });

  it('rejects a candidate whose source pass was never captured', () => {
    expect(() => foldDeepAlignmentEvents([
      runInitialized(),
      authorityReference(),
      authorityValidation(),
      scopeResolved(),
      dimensionOrdered(),
      lanePlan(),
      laneStarted(),
      subjectSnapshot(),
      applicability(),
      passStarted(),
      observation(),
      evidenceReceipt(),
      findingCandidate(13, { sourcePassEventId: 'phantom-pass' }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'conformance.candidates',
    }));
  });

  it('rejects a receipt borrowed from another observation owner', () => {
    expect(() => foldDeepAlignmentEvents([
      runInitialized(),
      authorityReference(),
      authorityValidation(),
      scopeResolved(),
      dimensionOrdered(),
      lanePlan(),
      laneStarted(),
      subjectSnapshot(),
      applicability(),
      passStarted(),
      observation(),
      evidenceReceipt(),
      observation(13, 'observation-2'),
      evidenceReceipt(14, 'observation-2', 'evidence-2', 'event-13'),
      findingCandidate(15, { evidenceReceiptRefs: ['receipt:evidence-2'] }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'conformance.candidates',
    }));
  });

  it('rejects candidate identity collision with conflicting immutable content', () => {
    expect(() => foldDeepAlignmentEvents([
      runInitialized(),
      authorityReference(),
      authorityValidation(),
      scopeResolved(),
      dimensionOrdered(),
      lanePlan(),
      laneStarted(),
      subjectSnapshot(),
      applicability(),
      passStarted(),
      observation(),
      evidenceReceipt(),
      findingCandidate(),
      findingCandidate(14, { candidateClaimDigest: digest('renamed-claim') }),
    ])).toThrowError(expect.objectContaining({
      code: 'identity-conflict',
      field: 'conformance.candidates.candidateId',
    }));
  });

  it('rejects a finding rename during re-adjudication', () => {
    const renamed = event(
      'deep_alignment.claim_adjudication_recorded',
      17,
      {
        ...subjectScope(),
        candidateId: 'candidate-1',
        findingId: 'finding-renamed',
        verificationId: 'verification-1',
      },
      {
        ...adjudication().payload.data,
        finalSeverity: 'none',
        transition: 'finding-reaffirmed',
        predecessorAdjudicationEventId: 'event-16',
      },
    );
    expect(() => foldDeepAlignmentEvents([
      ...hardVetoEvents().slice(0, 16),
      renamed,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'conformance.adjudications',
    }));
  });

  it('keeps an open hard veto blocking and recomputes severity from current facts', () => {
    const result = foldDeepAlignmentEvents(hardVetoEvents());

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.conformance.findings[0]).toMatchObject({
      findingId: 'finding-1',
      hardVeto: true,
      derivedSeverity: 'P0',
    });
    expect(result.projection.reviewLoop.eligibility).not.toBe('STOP_ELIGIBLE');
    expect(result.projection.reviewLoop.blockerIds).toContain('hard-veto:finding-1');
    expect(result.projection.status.state).toBe('blocked');
  });

  it('recomputes terminal blockers from current state after clean convergence', () => {
    expect(() => foldDeepAlignmentEvents([
      ...successfulEvents().slice(0, 15),
      evidenceReceipt(16),
      findingCandidate(17),
      synthesis(18),
      report(19),
      continuityRequested(20),
      continuityCompleted(21),
      runCompleted(22, {
        convergenceEventId: 'event-15',
        synthesisEventId: 'event-18',
        reportEventId: 'event-19',
        continuityEventId: 'event-21',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status.state',
    }));
  });

  it('requires the latest convergence on the established run stream', () => {
    expect(() => foldDeepAlignmentEvents([
      ...successfulEvents().slice(0, 15),
      convergence(16, {
        stopCandidate: false,
      }),
      synthesis(17),
      report(18),
      continuityRequested(19),
      continuityCompleted(20),
      runCompleted(21, {
        convergenceEventId: 'event-15',
        synthesisEventId: 'event-17',
        reportEventId: 'event-18',
        continuityEventId: 'event-20',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));

    const auxiliaryEvaluation = convergence(
      1,
      {
        decision: 'blocked',
        blockerIds: ['auxiliary-only-blocker'],
        stopCandidate: false,
      },
      {
        eventId: 'auxiliary-convergence',
        streamId: 'zzzz-auxiliary-convergence',
        streamSequence: 1,
      },
    );
    const result = foldDeepAlignmentEvents([
      ...successfulEvents().slice(0, 15),
      auxiliaryEvaluation,
      ...successfulEvents().slice(15),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.status.state).toBe('complete');
    expect(result.projection.reviewLoop.terminalDecision).toBe('pass');
    expect(result.projection.reviewLoop.evaluations.at(-1)?.producerEventId)
      .toBe('auxiliary-convergence');
  });

  it('matches the pure-fold oracle through the real verified-event reducer surface', () => {
    const events = successfulEvents();
    const initial = createDeepAlignmentProjectionState();
    verifyDeepAlignmentReducerSurface(
      DEEP_ALIGNMENT_REDUCER_SURFACE,
      verifiedEvent(events[0]),
      initial,
    );
    let reduced = initial as typeof initial & JsonObject;
    for (const typedEvent of events) {
      reduced = reduceDeepAlignmentVerifiedEvent(
        verifiedEvent(typedEvent),
        reduced,
      ).state;
    }
    const oracle = foldDeepAlignmentEvents(events);

    expect(oracle.outcome).toBe('projected');
    if (oracle.outcome !== 'projected') return;
    expect(reduced).toEqual(oracle.projection);
  });

  it('consumes the shared review-loop backbone with alignment mode configuration', () => {
    const direct = reduceSharedReviewLoopBackbone({
      requiredDimensionIds: ['alignment'],
      completedDimensionIds: ['alignment'],
      unresolvedObligationIds: [],
      explicitBlockerIds: [],
      blockingFindingIds: [],
      hardVetoFindingIds: [],
      p0p1ResolutionState: 'resolved',
      findingStability: 'stable',
      decision: 'converged',
      stopCandidate: true,
      graphDecision: null,
    });
    const folded = foldDeepAlignmentEvents(successfulEvents().slice(0, 15));

    expect(DEEP_ALIGNMENT_SHARED_REVIEW_LOOP_CONFIGURATION.mode).toBe('alignment');
    expect(direct).toEqual({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      blockerIds: [],
    });
    expect(folded.outcome).toBe('projected');
    if (folded.outcome !== 'projected') return;
    expect({
      eligibility: folded.projection.reviewLoop.eligibility,
      outcome: folded.projection.reviewLoop.outcome,
      blockerIds: folded.projection.reviewLoop.blockerIds,
    }).toEqual(direct);
  });

  it('projects the complete frozen legacy comparison surface without changing authority', () => {
    const result = foldDeepAlignmentEvents(successfulEvents());

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    const legacy = projectDeepAlignmentLegacyView(result.projection);
    const expectedStructure = {
      iteration: result.projection.reviewLoop.currentIterationId,
      status: result.projection.status.state,
      terminalDecision: result.projection.reviewLoop.terminalDecision,
      lanes: result.projection.lanePlan.lanes,
      applicability: result.projection.applicability.decisions,
      verdicts: result.projection.conformance.laneVerdicts,
      artifacts: result.projection.artifactIndex.artifacts,
      projectionHealth: result.projection.status.health,
    };

    expect(legacy).toEqual({
      authority: 'shadow-only',
      legacyAuthority: 'unchanged',
      ...expectedStructure,
      parityFingerprint: sha256Bytes(canonicalBytes(expectedStructure)),
    });
    expect(isDeepFrozenProjection(legacy)).toBe(true);
  });

  it('fails closed on projection version and checkpoint-tail mismatches', () => {
    expect(foldDeepAlignmentEvents([runInitialized()], {
      expectedSchemaVersion: 'unknown-projection@9',
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['projection-schema-mismatch'],
    });
    const projected = foldDeepAlignmentEvents([runInitialized()]);
    expect(projected.outcome).toBe('projected');
    if (projected.outcome !== 'projected') return;
    expect(foldDeepAlignmentEvents([], {
      checkpoint: {
        ...projected.checkpoint,
        sourceTailEventDigest: digest('forged-tail'),
      },
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('rejects a typed event with a forged replay fingerprint', () => {
    const forged = structuredClone(runInitialized()) as DeepAlignmentLedgerEvent;
    (forged.payload.replay as { final_digest: string }).final_digest =
      digest('forged-replay');

    expect(() => foldDeepAlignmentEvents([forged])).toThrowError(
      expect.objectContaining({
        code: 'event-schema-invalid',
        field: 'event',
      }),
    );
  });

  it('rejects invalid causal reordering before partial replay can succeed', () => {
    expect(foldDeepAlignmentEvents([...successfulEvents()].reverse())).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });
});
