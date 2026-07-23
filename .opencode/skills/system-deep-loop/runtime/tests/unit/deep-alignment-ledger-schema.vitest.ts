// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Ledger Schema Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizedLedgerErrorCodes,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE,
  DeepAlignmentEventStems,
  DeepAlignmentWireEventTypes,
  createDeepAlignmentEventRegistry,
  decideDeepAlignmentCompatibility,
  prepareDeepAlignmentEvent,
  upcastLegacyDeepAlignmentRecord,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import { createDeepReviewLedgerPayload } from '../../lib/deep-review-ledger-schema/index.js';
import {
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAlignmentEventInput,
  DeepAlignmentEventStem,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type {
  DeepReviewEventStem,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
} from '../../lib/deep-review-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'deep-alignment-shadow';
const AUDIT_LEDGER_ID = 'deep-alignment-shadow-authorization';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'deep-alignment-ledger-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createDeepAlignmentEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-alignment-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-deep-alignment-event', 'shadow-capability'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-alignment.ledger.')
        && input.capabilityId === 'deep-alignment:append'
        ? 'allow'
        : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-alignment.ledger.')
        && input.capabilityId === 'deep-alignment:append'
        ? 'allowed'
        : 'policy_denied',
      matchedRuleIds: ['known-deep-alignment-event', 'shadow-capability'],
    }),
  }]);
  const authorityProvider = (): typeof AUTHORITY => AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { registry, policies, ledger, gateway };
}

function replayMetadata(label: string): DeepAlignmentReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      authority: digest('authority'),
      configuration: digest('configuration'),
      subject: digest('subject'),
      upcast_path: digest('upcast-path'),
      verifier: digest('verifier'),
    },
  };
}

function targetReference(seed: string): JsonObject {
  return {
    targetId: `target-${seed}`,
    targetType: 'file',
    artifactRef: `artifact:${seed}`,
    sourceDigest: digest(`source:${seed}`),
    contentDigest: digest(`content:${seed}`),
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

function convergenceSignals(seed: string): JsonObject {
  return {
    noveltyRatio: 0.2,
    coverageRatio: 0.9,
    findingStabilityRatio: 0.8,
    evidenceDensityRatio: 0.7,
    hotspotSaturationRatio: 0.6,
    observationDigest: digest(`signals:${seed}`),
  };
}

function locator(seed: string): JsonObject {
  return {
    scheme: 'file',
    artifactRef: `artifact:${seed}`,
    locatorDigest: digest(`locator:${seed}`),
    selector: `symbol:${seed}`,
    revision: 'revision-1',
  };
}

function scopeFor<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
): DeepAlignmentScopeMap[TStem] {
  const base = {
    runId: 'run-1',
    sessionId: 'session-1',
    authorityEpochId: 'authority-epoch-2',
  };
  if (stem === 'deep_alignment.run_initialized'
    || stem === 'deep_alignment.run_resumed'
    || stem === 'deep_alignment.run_restarted') {
    return { ...base, generation: 1 } as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.protocol_plan_recorded') {
    return { ...base, protocolId: 'protocol-1' } as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.synthesis_started'
    || stem === 'deep_alignment.review_report_committed') {
    return {
      ...base,
      reportRevisionId: 'report-revision-1',
    } as DeepAlignmentScopeMap[TStem];
  }

  const iteration = {
    ...base,
    generation: 1,
    iterationId: 'iteration-1',
  };
  if (stem === 'deep_alignment.convergence_evaluated'
    || stem === 'deep_alignment.graph_convergence_evaluated'
    || stem === 'deep_alignment.blocked_stop_recorded'
    || stem === 'deep_alignment.pause_recorded') {
    return iteration as DeepAlignmentScopeMap[TStem];
  }

  const dimension = { ...iteration, dimensionId: 'alignment' };
  if (stem === 'deep_alignment.dimension_pass_started'
    || stem === 'deep_alignment.dimension_pass_completed'
    || stem === 'deep_alignment.recovery_started') {
    return dimension as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.finding_lineage_recorded'
    || stem === 'deep_alignment.finding_state_changed') {
    return { ...dimension, findingId: 'finding-1' } as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.known_deviation_recorded'
    || stem === 'deep_alignment.known_deviation_invalidated') {
    return {
      ...dimension,
      findingId: 'finding-1',
      deviationId: 'deviation-1',
    } as DeepAlignmentScopeMap[TStem];
  }

  const lane = { ...iteration, laneId: 'lane-schema' };
  if (stem === 'deep_alignment.lane_plan_recorded'
    || stem === 'deep_alignment.lane_started'
    || stem === 'deep_alignment.lane_completed'
    || stem === 'deep_alignment.applicability_coverage_recorded') {
    return lane as DeepAlignmentScopeMap[TStem];
  }
  const subject = { ...lane, subjectId: 'subject-1' };
  if (stem === 'deep_alignment.subject_snapshot_bound') {
    return subject as DeepAlignmentScopeMap[TStem];
  }
  const rule = { ...subject, ruleId: 'rule-1' };
  if (stem === 'deep_alignment.applicability_evaluated') {
    return rule as DeepAlignmentScopeMap[TStem];
  }
  const observation = { ...rule, observationId: 'observation-1' };
  if (stem === 'deep_alignment.observation_recorded'
    || stem === 'deep_alignment.observation_reconciled') {
    return observation as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.evidence_receipt_bound') {
    return { ...observation, evidenceId: 'evidence-1' } as DeepAlignmentScopeMap[TStem];
  }
  const candidate = { ...observation, candidateId: 'candidate-1' };
  if (stem === 'deep_alignment.finding_candidate_emitted') {
    return candidate as DeepAlignmentScopeMap[TStem];
  }
  const verification = {
    ...candidate,
    findingId: 'finding-1',
    verificationId: 'verification-1',
  };
  if (stem === 'deep_alignment.finding_verification_recorded'
    || stem === 'deep_alignment.claim_adjudication_recorded'
    || stem === 'deep_alignment.conformance_assessment_recorded') {
    return verification as DeepAlignmentScopeMap[TStem];
  }
  if (stem === 'deep_alignment.proof_witness_recorded'
    || stem === 'deep_alignment.authority_witness_replayed') {
    return { ...verification, proofId: 'proof-1' } as DeepAlignmentScopeMap[TStem];
  }
  return base as DeepAlignmentScopeMap[TStem];
}

function dataFor<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
): DeepAlignmentPayloadMap[TStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepAlignmentEventStem, JsonObject>> = {
    'deep_alignment.run_initialized': {
      target: targetReference('root'),
      lineageMode: 'fresh',
      maxIterations: 5,
      convergencePolicyVersion: 'convergence@1',
      reviewModeContractDigest: hash,
      initialReleaseReadinessState: 'not-assessed',
    },
    'deep_alignment.run_resumed': {
      priorTailDigest: hash,
      sourceSessionId: 'session-0',
      resumeReason: 'Resume after an operator-approved pause.',
      continuedFromRunId: 'run-0',
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-receipt-1',
    },
    'deep_alignment.run_restarted': {
      priorTailDigest: hash,
      archivedLineageId: 'lineage-0',
      restartReason: 'Restart after incompatible legacy state.',
      continuedFromRunId: 'run-0',
      compatibilityDecision: 'migrate',
      recoveryReceiptRef: 'recovery-receipt-2',
    },
    'deep_alignment.authority_reference_bound': {
      authorityId: 'authority-main',
      authorityCapsuleRef: 'authority-capsule-2',
      authoritySourceDigest: digest('authority-source'),
      compilerFingerprint: digest('authority-compiler'),
      profileDigest: digest('authority-profile'),
      ruleIrDigest: digest('rule-ir'),
      signatureDigest: digest('authority-signature'),
      expiresAt: '2027-07-23T10:00:00.000Z',
      rollbackRef: null,
    },
    'deep_alignment.authority_validation_recorded': {
      authorityReferenceEventId: 'event-4',
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
      validationReceiptRefs: ['receipt:authority-validation'],
      validatorFingerprint: digest('authority-validator'),
      validationDigest: digest('authority-validation'),
      blockedReasonCode: null,
    },
    'deep_alignment.authority_epoch_compatibility_recorded': {
      sourceAuthorityEpochId: 'authority-epoch-1',
      targetAuthorityEpochId: 'authority-epoch-2',
      compatibilityClass: 'compatible',
      direction: 'forward',
      affectedRuleIds: ['rule-1'],
      comparisonDigest: digest('epoch-comparison'),
      reasonCode: 'rule-semantics-preserved',
      orderedUpcastPath: [],
      ambiguous: false,
      lossy: false,
    },
    'deep_alignment.scope_resolved': {
      targetSetDigest: hash,
      scopeClass: 'targeted',
      selectedTargets: [targetReference('scope')],
      omittedHighRiskTargetRefs: ['target:generated'],
      discoveryMethodIds: ['changed-files', 'dependency-walk'],
      scopeEvidenceRefs: ['evidence:scope-1'],
    },
    'deep_alignment.dimension_ordered': {
      orderedDimensionIds: ['authority', 'schema', 'relational', 'reasoning'],
      riskRationale: 'Authority validity leads because all later conformance depends on it.',
      scopeEvidenceRefs: ['evidence:scope-1'],
      orderingPolicyVersion: 'dimension-order@1',
    },
    'deep_alignment.protocol_plan_recorded': {
      coreProtocolIds: ['protocol:authority'],
      overlayProtocolIds: ['protocol:conformance'],
      applicability: 'applicable',
      gateClass: 'required',
      contractVersion: 'review-contract@1',
      plannedEvidenceSourceRefs: ['source:authority', 'source:subject'],
      protocolPlanDigest: hash,
    },
    'deep_alignment.lane_plan_recorded': {
      laneKind: 'schema',
      orderedRuleIds: ['rule-1'],
      ruleIrRef: 'rule-ir:2',
      ruleIrDigest: digest('rule-ir'),
      verifierPolicyVersion: 'verifier-policy@1',
      budgetRef: 'budget:lane-schema',
      requiredEvidenceClasses: ['schema-witness'],
      planDigest: hash,
    },
    'deep_alignment.lane_started': {
      lanePlanEventId: 'event-10',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-5',
      authorityValidationDigest: digest('authority-validation'),
      status: 'started',
    },
    'deep_alignment.subject_snapshot_bound': {
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectType: 'file',
      subjectDigest: digest('subject-snapshot'),
      sourceVersionRef: 'source-version-1',
      capturedAt: TIMESTAMP,
      parentSnapshotRef: null,
      receiptRef: 'receipt:subject-snapshot',
    },
    'deep_alignment.applicability_evaluated': {
      predicateRef: 'predicate:rule-1',
      predicateDigest: digest('predicate'),
      targetFactRefs: ['target-fact:language'],
      targetFactDigest: digest('target-facts'),
      result: 'applicable',
      evaluatorFingerprint: digest('applicability-evaluator'),
      authorityValidationEventId: 'event-5',
      decisionDigest: digest('applicability-decision'),
      reasonCode: 'subject-matches-rule-domain',
    },
    'deep_alignment.dimension_pass_started': {
      passNumber: 1,
      targetRefs: ['target:subject-1'],
      filesReviewed: ['file:subject-1'],
      searchCoverageDigest: hash,
      passStatus: 'started',
      nextFocusRef: 'focus:rule-1',
    },
    'deep_alignment.observation_recorded': {
      applicabilityDecisionId: 'event-13',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      detectorFingerprint: digest('detector'),
      observationKind: 'schema',
      rawResultDigest: digest('raw-observation'),
      sourceDigest: digest('subject-source'),
      contentDigest: digest('subject-content'),
      evidenceClass: 'schema-witness',
      freshness: 'fresh',
      causalRelevance: 'direct',
      locator: locator('subject-1'),
      receiptRefs: ['receipt:observation'],
    },
    'deep_alignment.evidence_receipt_bound': {
      observationEventId: 'event-15',
      receiptRef: 'receipt:evidence-1',
      receiptDigest: digest('evidence-receipt'),
      evidenceClass: 'schema-witness',
      freshness: 'fresh',
      sourceDigest: digest('subject-source'),
      contentDigest: digest('subject-content'),
      toolFingerprint: digest('schema-tool'),
      capturedAt: TIMESTAMP,
    },
    'deep_alignment.observation_reconciled': {
      observationEventId: 'event-15',
      predecessorObservationEventId: 'event-14',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      reconciliationOutcome: 'confirmed',
      evidenceSetDigest: digest('evidence-set'),
      reconcilerFingerprint: digest('reconciler'),
      reasonCode: 'independent-receipt-confirmed',
    },
    'deep_alignment.finding_candidate_emitted': {
      observationEventId: 'event-15',
      applicabilityDecisionId: 'event-13',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      detectorFingerprint: digest('detector'),
      detectorBlindingDigest: digest('detector-blinding'),
      candidateClaimDigest: digest('candidate-claim'),
      findingClass: 'schema-nonconformance',
      rawImpact: 0.8,
      rawConfidence: 0.5,
      rawCandidateScore: 0.6,
      scorerFingerprint: digest('independent-scorer'),
      scoringPolicyVersion: 'alignment-score@1',
      semanticFingerprint: semanticFingerprint('candidate'),
      sourcePassEventId: 'event-14',
    },
    'deep_alignment.finding_verification_recorded': {
      candidateEventId: 'event-18',
      observationEventId: 'event-15',
      authorityValidationEventId: 'event-5',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      applicabilityDecisionId: 'event-13',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      verifierFingerprint: digest('independent-verifier'),
      verifierIndependenceDigest: digest('verifier-independence'),
      proofWitnessRefs: ['proof-1'],
      verificationMode: 'schema',
      result: 'confirmed',
      rawImpact: 0.8,
      rawConfidence: 0.75,
      evidenceStrength: 0.9,
      counterevidenceRefs: ['evidence:negative-control'],
      verificationDigest: digest('verification'),
    },
    'deep_alignment.proof_witness_recorded': {
      verificationEventId: 'event-19',
      witnessKind: 'positive',
      artifactRef: 'artifact:proof-1',
      witnessDigest: digest('proof-witness'),
      sourceDigest: digest('proof-source'),
      locator: locator('proof-1'),
      minimized: true,
      minimizerFingerprint: digest('proof-minimizer'),
      replayRecipeRef: 'recipe:proof-1',
      replayRecipeDigest: digest('proof-recipe'),
      outcome: 'supports',
      receiptRefs: ['receipt:proof-1'],
    },
    'deep_alignment.claim_adjudication_recorded': {
      candidateEventId: 'event-18',
      verificationEventId: 'event-19',
      observationEventId: 'event-15',
      claimDigest: digest('candidate-claim'),
      evidenceReceiptRefs: ['receipt:evidence-1'],
      proofWitnessRefs: ['proof-1'],
      counterevidenceRefs: ['evidence:negative-control'],
      verifierFingerprint: digest('independent-verifier'),
      assessorFingerprint: digest('independent-assessor'),
      authorityValidationEventId: 'event-5',
      applicabilityDecisionId: 'event-13',
      subjectSnapshotDigest: digest('subject-snapshot'),
      finalSeverity: 'P1',
      impact: 0.8,
      confidence: 0.85,
      outcome: 'accepted',
      transition: 'candidate-to-finding',
      adjudicationDigest: digest('adjudication'),
      predecessorAdjudicationEventId: null,
    },
    'deep_alignment.conformance_assessment_recorded': {
      adjudicationEventId: 'event-21',
      adjudicationPayloadDigest: digest('adjudication'),
      authorityValidationEventId: 'event-5',
      authorityValidationDigest: digest('authority-validation'),
      authorityStatus: 'valid',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      applicabilityDecisionId: 'event-13',
      applicabilityOutcome: 'applicable',
      verificationEventId: 'event-19',
      verifierFingerprint: digest('independent-verifier'),
      proofWitnessRefs: ['proof-1'],
      evidenceReceiptRefs: ['receipt:evidence-1'],
      conformanceStatus: 'non_conformant',
      impact: 0.8,
      confidence: 0.85,
      assessmentPolicyVersion: 'conformance@1',
      assessmentDigest: digest('conformance-assessment'),
    },
    'deep_alignment.finding_lineage_recorded': {
      priorFingerprint: semanticFingerprint('prior'),
      currentFingerprint: semanticFingerprint('current'),
      lineageRelation: 'updated',
      baselineStatus: 'present',
      evidenceSetDigest: hash,
      predecessorEventRef: 'event-21',
    },
    'deep_alignment.finding_state_changed': {
      priorFingerprint: semanticFingerprint('prior'),
      currentFingerprint: semanticFingerprint('current'),
      priorState: 'adjudicated',
      currentState: 'accepted',
      priorSeverity: 'none',
      currentSeverity: 'P1',
      adjudicationEventId: 'event-21',
      adjudicationPayloadDigest: digest('adjudication'),
      changeReason: 'Independent verification confirmed the authority violation.',
      evidenceSetDigest: hash,
      predecessorEventRef: 'event-23',
    },
    'deep_alignment.known_deviation_recorded': {
      originalFindingEventId: 'event-24',
      originalFindingDigest: digest('finding'),
      conformanceAssessmentEventId: 'event-22',
      authorityEpochRef: 'authority-epoch-2',
      verifierFingerprint: digest('independent-verifier'),
      issuerId: 'operator-1',
      rationale: 'A time-limited compatibility exception is active for this subject.',
      scopePredicateRef: 'predicate:deviation-scope',
      scopePredicateDigest: digest('deviation-scope'),
      subjectSnapshotDigest: digest('subject-snapshot'),
      expiresAt: '2026-08-23T10:00:00.000Z',
      invalidationConditionRefs: ['condition:authority-change', 'condition:expiry'],
      status: 'active',
    },
    'deep_alignment.known_deviation_invalidated': {
      deviationEventId: 'event-25',
      originalFindingEventId: 'event-24',
      authorityEpochRef: 'authority-epoch-2',
      verifierFingerprint: digest('independent-verifier'),
      subjectSnapshotDigest: digest('subject-snapshot'),
      invalidationTrigger: 'expired',
      invalidationEvidenceRefs: ['evidence:clock-receipt'],
      invalidationDigest: digest('deviation-invalidation'),
      reactivatedFindingEventId: 'event-24',
      invalidatedAt: TIMESTAMP,
    },
    'deep_alignment.applicability_coverage_recorded': {
      authorityValidationEventId: 'event-5',
      subjectSnapshotDigest: digest('subject-snapshot'),
      declaredApplicabilityEdgeRefs: ['edge:rule-1-subject-1'],
      applicableRuleIds: ['rule-1'],
      notApplicableRuleIds: ['rule-2'],
      unresolvedRuleIds: ['rule-3'],
      untestedRuleIds: ['rule-4'],
      blockedRuleIds: ['rule-5'],
      coverageDigest: digest('applicability-coverage'),
    },
    'deep_alignment.authority_witness_replayed': {
      sourceAuthorityEpochId: 'authority-epoch-1',
      targetAuthorityEpochId: 'authority-epoch-2',
      witnessEventId: 'event:old-proof-1',
      proofDigest: digest('old-proof'),
      affectedRuleIds: ['rule-1'],
      compatibilityClass: 'compatible',
      compatibilityDecisionEventId: 'event-6',
      replayOutcome: 'accepted',
      verifierFingerprint: digest('independent-verifier'),
      subjectSnapshotDigest: digest('subject-snapshot'),
      replayDigest: digest('witness-replay'),
    },
    'deep_alignment.dimension_pass_completed': {
      passNumber: 1,
      targetRefs: ['target:subject-1'],
      filesReviewed: ['file:subject-1'],
      searchCoverageDigest: hash,
      passStatus: 'complete',
      rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
      nextFocusRef: 'focus:convergence',
    },
    'deep_alignment.lane_completed': {
      lanePlanEventId: 'event-10',
      subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-5',
      applicabilityDecisionRefs: ['event-13'],
      observationRefs: ['event-15'],
      verificationRefs: ['event-19'],
      status: 'complete',
      counts: {
        applicable: 1,
        notApplicable: 0,
        unresolved: 0,
        untested: 0,
        blocked: 0,
        nonConformant: 1,
      },
      completionDigest: hash,
      blockedReasonCode: null,
    },
    'deep_alignment.convergence_evaluated': {
      rawSignals: convergenceSignals('raw'),
      weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: hash,
      protocolCoverageDigest: digest('protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 0.8,
      hotspotSaturation: 0.7,
      decision: 'converged',
      policyFingerprint: digest('convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
    },
    'deep_alignment.graph_convergence_evaluated': {
      rawSignals: convergenceSignals('graph-raw'),
      weightedSignals: convergenceSignals('graph-weighted'),
      dimensionCoverageDigest: hash,
      protocolCoverageDigest: digest('graph-protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 0.8,
      hotspotSaturation: 0.7,
      decision: 'converged',
      policyFingerprint: digest('graph-convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
      graphDecision: 'converged',
      graphDigest: digest('alignment-graph'),
    },
    'deep_alignment.blocked_stop_recorded': {
      blockedGateIds: ['gate:invalid-authority'],
      gateResults: [{
        gateId: 'gate:invalid-authority',
        status: 'fail',
        reasonCode: 'invalid-authority',
        evidenceDigest: hash,
      }],
      activeFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
      recoveryStrategy: 'revalidate-authority',
      targetDimensionId: 'authority',
      originatingConvergenceEventId: 'event-31',
      appendPosition: 33,
    },
    'deep_alignment.pause_recorded': {
      normalizedStopReason: 'operator-pause',
      sentinelCause: 'operator-request',
      fromIterationId: 'iteration-1',
      strategy: 'persist-and-pause',
      targetDimensionId: null,
      outcome: 'paused',
      lineageRef: 'lineage:pause-1',
      priorTailDigest: hash,
    },
    'deep_alignment.recovery_started': {
      normalizedStopReason: 'blocked-gate',
      recoveryCause: 'invalid-authority',
      fromIterationId: 'iteration-1',
      strategy: 'authority-revalidation',
      targetDimensionId: 'authority',
      outcome: 'recovery-started',
      lineageRef: 'lineage:recovery-1',
      priorTailDigest: hash,
      originatingPauseEventId: 'event-34',
    },
    'deep_alignment.synthesis_started': {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-35' },
      findingRegistryInputDigest: hash,
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: ['finding-2'],
      deferredFindingIds: ['finding-3'],
    },
    'deep_alignment.review_report_committed': {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-36' },
      findingRegistryInputDigest: hash,
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: ['finding-2'],
      deferredFindingIds: ['finding-3'],
      reportDigest: digest('report'),
      sectionManifest: {
        sectionIds: ['authority', 'conformance', 'deviations'],
        manifestDigest: digest('section-manifest'),
      },
      reportReceiptRef: 'report-receipt-1',
    },
    'deep_alignment.continuity_save_requested': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-37' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
    },
    'deep_alignment.continuity_save_completed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-38' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity'),
    },
    'deep_alignment.continuity_save_failed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-39' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      retryable: true,
      failureReasonCode: 'storage-unavailable',
    },
    'deep_alignment.run_completed': {
      terminalStatus: 'completed',
      convergenceEventId: 'event-31',
      synthesisEventId: 'event-36',
      reportEventId: 'event-37',
      continuityEventId: 'event-39',
      finalLedgerTailHash: hash,
      counts: { dimensions: 4, iterations: 1, candidates: 1, findings: 1, evidence: 1 },
      verdict: 'fail',
      completionReason: 'All required checks completed with one non-conformance.',
      incompleteReason: null,
    },
  };
  return data[stem] as DeepAlignmentPayloadMap[TStem];
}

function eventInput<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): DeepAlignmentEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'deep-alignment-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-alignment-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `deep-alignment-event-${index}`,
  };
}

function reviewScopeFor(
  reviewStem: DeepReviewEventStem,
  scope: Record<string, unknown>,
): JsonObject {
  const base = { runId: scope.runId as string, sessionId: scope.sessionId as string };
  if (reviewStem === 'deep_review.run_initialized'
    || reviewStem === 'deep_review.run_resumed'
    || reviewStem === 'deep_review.run_restarted') {
    return { ...base, generation: scope.generation as number };
  }
  if (reviewStem === 'deep_review.protocol_plan_recorded') {
    return { ...base, protocolId: scope.protocolId as string };
  }
  if (reviewStem === 'deep_review.synthesis_started'
    || reviewStem === 'deep_review.review_report_committed') {
    return { ...base, reportRevisionId: scope.reportRevisionId as string };
  }
  if (reviewStem === 'deep_review.finding_lineage_recorded'
    || reviewStem === 'deep_review.finding_state_changed') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
      dimensionId: scope.dimensionId as string,
      findingId: scope.findingId as string,
    };
  }
  if (reviewStem === 'deep_review.dimension_pass_started'
    || reviewStem === 'deep_review.dimension_pass_completed'
    || reviewStem === 'deep_review.recovery_started') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
      dimensionId: scope.dimensionId as string,
    };
  }
  if (reviewStem === 'deep_review.convergence_evaluated'
    || reviewStem === 'deep_review.graph_convergence_evaluated'
    || reviewStem === 'deep_review.blocked_stop_recorded'
    || reviewStem === 'deep_review.pause_recorded') {
    return {
      ...base,
      generation: scope.generation as number,
      iterationId: scope.iterationId as string,
    };
  }
  return base;
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'deep-alignment:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('deep-alignment-shadow-write', 1);
  return {
    requestId,
    mode: 'review',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'deep-alignment-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'deep-alignment-runtime',
    capabilityId,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest('authorization-evidence'),
  };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(
    await authorizationRequest(harness, event, requestId),
  );
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION, REPLAY, AND CLOSED SHAPES
// ───────────────────────────────────────────────────────────────────

describe('deep-alignment typed ledger schema', () => {
  it('authorizes, appends, and verifies every event stem through the real ledger', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of DeepAlignmentEventStems.entries()) {
      const index = offset + 1;
      const event = prepareDeepAlignmentEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(proof.decision.decision_id);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(DeepAlignmentEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type)).toEqual(
      DeepAlignmentEventStems.map((stem) => DeepAlignmentWireEventTypes[stem]),
    );
    for (const [index, entry] of verified.entries()) {
      const stem = DeepAlignmentEventStems[index];
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay).toEqual(replayMetadata(stem));
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('keeps all shared-backbone payloads accepted by the Deep Review contract', () => {
    const sharedEntries = Object.entries(DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE) as Array<
      [keyof typeof DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE, DeepReviewEventStem]
    >;
    expect(sharedEntries).toHaveLength(21);
    const reviewFactory = createDeepReviewLedgerPayload as unknown as (
      stem: DeepReviewEventStem,
      scope: DeepReviewScopeMap[DeepReviewEventStem],
      prevEventHash: string,
      replay: DeepReviewReplayMetadata,
      data: DeepReviewPayloadMap[DeepReviewEventStem],
    ) => { readonly data: JsonObject };

    for (const [alignmentStem, reviewStem] of sharedEntries) {
      const alignment = eventInput(alignmentStem, 1, '0'.repeat(64));
      const reviewPayload = reviewFactory(
        reviewStem,
        reviewScopeFor(
          reviewStem,
          alignment.scope as unknown as Record<string, unknown>,
        ) as DeepReviewScopeMap[DeepReviewEventStem],
        alignment.prevEventHash,
        alignment.replay as DeepReviewReplayMetadata,
        alignment.data as DeepReviewPayloadMap[DeepReviewEventStem],
      );
      expect(reviewPayload.data).toEqual(alignment.data);
    }
  });

  it('produces stable identity, payload digest, and replay metadata', () => {
    const registry = createDeepAlignmentEventRegistry();
    const input = eventInput('deep_alignment.run_initialized', 1, '0'.repeat(64));
    const first = prepareDeepAlignmentEvent(input, registry);
    const second = prepareDeepAlignmentEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(first.envelope.payload.payloadDigest);
    expect(second.envelope.payload.replay).toEqual(first.envelope.payload.replay);
  });

  it('rejects missing shared and event-specific scope identities', () => {
    const registry = createDeepAlignmentEventRegistry();
    const candidate = eventInput(
      'deep_alignment.finding_candidate_emitted',
      18,
      '0'.repeat(64),
    );
    for (const field of ['runId', 'authorityEpochId', 'candidateId'] as const) {
      const invalidScope = { ...candidate.scope } as Record<string, unknown>;
      delete invalidScope[field];
      expect(() => prepareDeepAlignmentEvent({
        ...candidate,
        scope: invalidScope as DeepAlignmentScopeMap[
          'deep_alignment.finding_candidate_emitted'
        ],
      }, registry)).toThrow();
    }
    expect(() => prepareDeepAlignmentEvent({
      ...candidate,
      scope: {
        ...candidate.scope,
        transitionAuthorizationRef: 'payload-must-not-own-authority',
      } as DeepAlignmentScopeMap['deep_alignment.finding_candidate_emitted'],
    }, registry)).toThrow();
  });

  it('rejects absent previous-event hashes and payload digest tampering', () => {
    const registry = createDeepAlignmentEventRegistry();
    const event = prepareDeepAlignmentEvent(
      eventInput('deep_alignment.run_initialized', 1, '0'.repeat(64)),
      registry,
    );
    const missingHash = { ...event.envelope.payload } as Record<string, unknown>;
    delete missingHash.prevEventHash;
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: missingHash as JsonObject,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: {
        ...event.envelope.payload,
        payloadDigest: 'f'.repeat(64),
      },
    }, registry)).toThrow();
  });

  it('rejects mutable bodies and prose smuggled into evidence fields', async () => {
    const harness = createHarness();
    const observation = eventInput(
      'deep_alignment.observation_recorded',
      15,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...observation,
      data: {
        ...observation.data,
        rawOutput: 'mutable analyzer output',
      } as DeepAlignmentPayloadMap['deep_alignment.observation_recorded'],
    }, harness.registry)).toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...observation,
      data: {
        ...observation.data,
        locator: {
          ...observation.data.locator,
          selector: 'A mutable source passage with many words that is evidence content rather than a stable structured selector for the observed subject.',
        },
      },
    }, harness.registry)).toThrow();
    const proof = eventInput('deep_alignment.proof_witness_recorded', 20, '0'.repeat(64));
    expect(() => prepareDeepAlignmentEvent({
      ...proof,
      data: {
        ...proof.data,
        locator: {
          ...proof.data.locator,
          sourceBody: 'mutable proof body',
        },
      },
    }, harness.registry)).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
  });

  it('rejects in-place observation, finding, and adjudication updates', () => {
    const registry = createDeepAlignmentEventRegistry();
    const observation = eventInput(
      'deep_alignment.observation_reconciled',
      17,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...observation,
      data: {
        ...observation.data,
        predecessorObservationEventId: observation.data.observationEventId,
      },
    }, registry)).toThrow();

    const lineage = eventInput(
      'deep_alignment.finding_lineage_recorded',
      23,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...lineage,
      data: {
        ...lineage.data,
        currentFingerprint: lineage.data.priorFingerprint,
        lineageRelation: 'updated',
      },
    }, registry)).toThrow();

    const state = eventInput('deep_alignment.finding_state_changed', 24, '0'.repeat(64));
    expect(() => prepareDeepAlignmentEvent({
      ...state,
      data: {
        ...state.data,
        currentState: state.data.priorState,
        currentSeverity: state.data.priorSeverity,
      },
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before append', async () => {
    const harness = createHarness();
    const event = prepareDeepAlignmentEvent(
      eventInput('deep_alignment.run_initialized', 1, '0'.repeat(64)),
      harness.registry,
    );
    const denied = await harness.gateway.authorize(
      await authorizationRequest(harness, event, 'denied-request', 'read-only'),
    );
    expect(denied.verdict).toBe('deny');
    await expect(harness.ledger.appendAuthorized(
      event,
      undefined as unknown as GatewayAllowProof,
    )).rejects.toMatchObject({ code: AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. ALIGNMENT-SPECIFIC SOUNDNESS
  // ─────────────────────────────────────────────────────────────────

  it('keeps observations and candidates non-verdict-bearing until adjudication', () => {
    const registry = createDeepAlignmentEventRegistry();
    const observation = eventInput(
      'deep_alignment.observation_recorded',
      15,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...observation,
      data: {
        ...observation.data,
        conformanceStatus: 'non_conformant',
      } as DeepAlignmentPayloadMap['deep_alignment.observation_recorded'],
    }, registry)).toThrow();

    const candidate = eventInput(
      'deep_alignment.finding_candidate_emitted',
      18,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...candidate,
      data: {
        ...candidate.data,
        finalSeverity: 'P0',
      } as DeepAlignmentPayloadMap['deep_alignment.finding_candidate_emitted'],
    }, registry)).toThrow();

    const adjudication = eventInput(
      'deep_alignment.claim_adjudication_recorded',
      21,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...adjudication,
      data: {
        ...adjudication.data,
        finalSeverity: 'P1',
        outcome: 'deferred',
      },
    }, registry)).toThrow();
    expect(() => prepareDeepAlignmentEvent(adjudication, registry)).not.toThrow();
  });

  it('blocks invalid authority from becoming a conformance assessment', () => {
    const registry = createDeepAlignmentEventRegistry();
    const validation = eventInput(
      'deep_alignment.authority_validation_recorded',
      5,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...validation,
      data: {
        ...validation.data,
        checks: { ...validation.data.checks, signature: 'fail' },
        authorityStatus: 'valid',
      },
    }, registry)).toThrow();

    const conformance = eventInput(
      'deep_alignment.conformance_assessment_recorded',
      22,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...conformance,
      data: {
        ...conformance.data,
        authorityStatus: 'invalid',
      } as unknown as DeepAlignmentPayloadMap[
        'deep_alignment.conformance_assessment_recorded'
      ],
    }, registry)).toThrow();
  });

  it('preserves explicit applicability and conformance outcomes', () => {
    const registry = createDeepAlignmentEventRegistry();
    const conformance = eventInput(
      'deep_alignment.conformance_assessment_recorded',
      22,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...conformance,
      data: {
        ...conformance.data,
        applicabilityOutcome: 'not_applicable',
        conformanceStatus: 'conformant',
      },
    }, registry)).toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...conformance,
      data: {
        ...conformance.data,
        applicabilityOutcome: 'not_applicable',
        conformanceStatus: 'not_applicable',
      },
    }, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...conformance,
      data: {
        ...conformance.data,
        applicabilityOutcome: 'unresolved',
        conformanceStatus: 'conformant',
      },
    }, registry)).toThrow();
  });

  it('requires proof, authority, subject, evidence, and verifier bindings', () => {
    const registry = createDeepAlignmentEventRegistry();
    const verification = eventInput(
      'deep_alignment.finding_verification_recorded',
      19,
      '0'.repeat(64),
    );
    for (const field of [
      'authorityValidationEventId',
      'subjectSnapshotDigest',
      'applicabilityDecisionId',
      'evidenceReceiptRefs',
      'verifierFingerprint',
      'proofWitnessRefs',
      'verificationMode',
    ] as const) {
      const invalid = { ...verification.data } as Record<string, unknown>;
      delete invalid[field];
      expect(() => prepareDeepAlignmentEvent({
        ...verification,
        data: invalid as unknown as DeepAlignmentPayloadMap[
          'deep_alignment.finding_verification_recorded'
        ],
      }, registry)).toThrow();
    }
  });

  it('keeps deviations chronological and coverage classes disjoint', () => {
    const registry = createDeepAlignmentEventRegistry();
    const invalidation = eventInput(
      'deep_alignment.known_deviation_invalidated',
      26,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...invalidation,
      data: {
        ...invalidation.data,
        reactivatedFindingEventId: null,
      },
    }, registry)).toThrow();

    const coverage = eventInput(
      'deep_alignment.applicability_coverage_recorded',
      27,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent({
      ...coverage,
      data: {
        ...coverage.data,
        blockedRuleIds: ['rule-1'],
      },
    }, registry)).toThrow();
  });

  it('rejects an authority-epoch compatibility record that compares an epoch to itself', () => {
    const registry = createDeepAlignmentEventRegistry();
    const compatibility = eventInput(
      'deep_alignment.authority_epoch_compatibility_recorded',
      6,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(compatibility, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...compatibility,
      data: {
        ...compatibility.data,
        targetAuthorityEpochId: compatibility.data.sourceAuthorityEpochId,
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.authority_epoch_compatibility_recorded',
    );
  });

  it('rejects an authority witness replay whose outcome contradicts compatibility', () => {
    const registry = createDeepAlignmentEventRegistry();
    const replay = eventInput(
      'deep_alignment.authority_witness_replayed',
      28,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(replay, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...replay,
      data: {
        ...replay.data,
        replayOutcome: 'degraded',
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.authority_witness_replayed',
    );
  });

  it('rejects a subject snapshot that names itself as its parent', () => {
    const registry = createDeepAlignmentEventRegistry();
    const snapshot = eventInput(
      'deep_alignment.subject_snapshot_bound',
      12,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(snapshot, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...snapshot,
      data: {
        ...snapshot.data,
        parentSnapshotRef: snapshot.data.subjectSnapshotRef,
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.subject_snapshot_bound',
    );
  });

  it('rejects a lane plan without an ordered rule set', () => {
    const registry = createDeepAlignmentEventRegistry();
    const lanePlan = eventInput(
      'deep_alignment.lane_plan_recorded',
      10,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(lanePlan, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...lanePlan,
      data: {
        ...lanePlan.data,
        orderedRuleIds: [],
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.lane_plan_recorded',
    );
  });

  it('rejects an applicability decision without target facts', () => {
    const registry = createDeepAlignmentEventRegistry();
    const applicability = eventInput(
      'deep_alignment.applicability_evaluated',
      13,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(applicability, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...applicability,
      data: {
        ...applicability.data,
        targetFactRefs: [],
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.applicability_evaluated',
    );
  });

  it('rejects a proof witness without a durable receipt', () => {
    const registry = createDeepAlignmentEventRegistry();
    const witness = eventInput(
      'deep_alignment.proof_witness_recorded',
      20,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(witness, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...witness,
      data: {
        ...witness.data,
        receiptRefs: [],
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.proof_witness_recorded',
    );
  });

  it('rejects a finding candidate scored by its own detector', () => {
    const registry = createDeepAlignmentEventRegistry();
    const candidate = eventInput(
      'deep_alignment.finding_candidate_emitted',
      18,
      '0'.repeat(64),
    );
    expect(() => prepareDeepAlignmentEvent(candidate, registry)).not.toThrow();
    expect(() => prepareDeepAlignmentEvent({
      ...candidate,
      data: {
        ...candidate.data,
        scorerFingerprint: candidate.data.detectorFingerprint,
      },
    }, registry)).toThrow(
      'Invalid closed-shape payload for deep_alignment.finding_candidate_emitted',
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. LEGACY COMPATIBILITY
  // ─────────────────────────────────────────────────────────────────

  it('covers every compatibility outcome and blocks unsafe inputs', () => {
    expect(decideDeepAlignmentCompatibility({
      format: 'deep-alignment-ledger',
      stem: 'deep_alignment.run_initialized',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideDeepAlignmentCompatibility({ type: 'progress', schemaVersion: 1 }).status)
      .toBe('compatible');
    expect(decideDeepAlignmentCompatibility({
      type: 'partial-observation',
      schemaVersion: 1,
    }).status).toBe('degraded');
    expect(decideDeepAlignmentCompatibility({
      type: 'iteration',
      schemaVersion: 1,
      runId: 'run-1',
      sessionId: 'session-1',
      authorityEpochId: 'authority-epoch-2',
      run: 1,
      lane: 'lane-schema',
    }).status).toBe('migrate');
    expect(decideDeepAlignmentCompatibility({
      type: 'event',
      event: 'verdict_changed',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    for (const unsafe of [
      { type: 'unknown', schemaVersion: 1 },
      { type: 'iteration', schemaVersion: 99 },
      { type: 'iteration', schemaVersion: 1, ambiguous: true },
      { type: 'iteration', schemaVersion: 1, lossy: true },
      { type: 'iteration', schemaVersion: 1, expired: true },
      { type: 'iteration', schemaVersion: 1, rolledBack: true },
      { type: 'iteration', schemaVersion: 1, mixedAuthority: true },
      {
        format: 'deep-alignment-ledger',
        stem: 'deep_alignment.unknown',
        eventVersion: 1,
      },
    ]) {
      expect(decideDeepAlignmentCompatibility(unsafe).status).toBe('blocked');
    }
  });

  it('upcasts registered legacy JSONL purely and drives the real append path', async () => {
    const record = {
      type: 'iteration',
      schemaVersion: 1,
      runId: 'run-1',
      sessionId: 'session-1',
      authorityEpochId: 'authority-epoch-2',
      run: 1,
      lane: 'lane-schema',
      status: 'complete',
      observations: ['legacy-observation'],
      verifications: ['legacy-verification'],
      counts: {
        applicable: 1,
        notApplicable: 0,
        unresolved: 0,
        untested: 0,
        blocked: 0,
        nonConformant: 1,
      },
    };
    const context = {
      scope: {
        runId: 'run-1',
        sessionId: 'session-1',
        authorityEpochId: 'authority-epoch-2',
        generation: 1,
        iterationId: 'iteration-1',
        laneId: 'lane-schema',
      },
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-iteration'),
    };
    const first = upcastLegacyDeepAlignmentRecord(record, context);
    const second = upcastLegacyDeepAlignmentRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('deep_alignment.lane_completed');
    if (first.targetStem !== 'deep_alignment.lane_completed') {
      throw new Error(first.targetStem);
    }
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(first.replay.final_digest).toBe(context.replay.final_digest);
    expect(record.observations).toEqual(['legacy-observation']);

    const harness = createHarness();
    const event = prepareDeepAlignmentEvent({
      stem: first.targetStem,
      scope: first.scope as DeepAlignmentScopeMap['deep_alignment.lane_completed'],
      prevEventHash: first.prevEventHash,
      replay: first.replay,
      data: first.data as unknown as DeepAlignmentPayloadMap['deep_alignment.lane_completed'],
      eventId: 'legacy-event-1',
      streamId: 'deep-alignment-legacy-run-1',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-alignment-legacy-upcaster', version: '1' },
      authorityEpoch: 1,
      correlationId: 'run-1',
      causationId: null,
      idempotencyKey: 'deep-alignment-legacy-event-1',
    }, harness.registry);
    const proof = await authorize(harness, event, 'legacy-upcast-request');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(first.data);
  });

  it('rejects unregistered envelope and payload versions without guessing', () => {
    const registry = createDeepAlignmentEventRegistry();
    const event = prepareDeepAlignmentEvent(
      eventInput('deep_alignment.run_initialized', 1, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...event.envelope,
      event_version: 2,
    }, registry)).toThrow();
    expect(decideDeepAlignmentCompatibility({
      format: 'deep-alignment-ledger',
      stem: 'deep_alignment.run_initialized',
      eventVersion: 2,
    })).toMatchObject({
      status: 'blocked',
      reasonCode: 'unknown-event-version',
      targetStem: null,
    });
  });
});
