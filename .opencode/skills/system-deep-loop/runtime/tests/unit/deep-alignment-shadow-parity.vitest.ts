// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Shadow Parity Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepAlignmentEventStems,
  createDeepAlignmentEventRegistry,
  prepareDeepAlignmentEvent,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import * as deepAlignmentReducers from '../../lib/deep-alignment-reducers/index.js';
import type { DeepAlignmentProjectionState } from '../../lib/deep-alignment-reducers/index.js';
import {
  DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
  canonicalizeDeepAlignmentEventStream,
  compareDeepAlignmentEventStreams,
  compileDeepAlignmentParityManifest,
  createDeepAlignmentModeGateInput,
  createDeepAlignmentParityCaseDefinition,
  createDeepAlignmentParityExecutors,
  deepAlignmentParityInitialStateDigest,
  parseDeepAlignmentParityReceipt,
  runDeepAlignmentParityCase,
} from '../../lib/deep-alignment-shadow-parity/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import { EventTypeRegistry } from '../../lib/event-envelope/index.js';
import { compileParityCaseManifest } from '../../lib/shadow-parity/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAlignmentEventEnvelope,
  DeepAlignmentEventInput,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentParityCaseRun,
  DeepAlignmentParityFaultKind,
  DeepAlignmentParityFixture,
  DeepAlignmentParityFixtureScenario,
  DeepAlignmentTerminalDecision,
} from '../../lib/deep-alignment-shadow-parity/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type { ParityCaseCapsule, ParityCaseManifest } from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const OTHER_BASE_SHA = '1371371371371371371371371371371371371371';
const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'alignment-shadow-run';
const SESSION_ID = 'alignment-shadow-session';
const AUTHORITY_EPOCH_ID = 'authority-epoch-1';
const STREAM_ID = 'deep-alignment-shadow-stream';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const RUN_COMPLETED_SEQUENCE = 38;
const roots: string[] = [];
const registry = createDeepAlignmentEventRegistry();

interface ArtifactHarness {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

interface SealedBoundary {
  readonly harness: ArtifactHarness;
  readonly referenceSet: ArtifactReferenceSet;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-parity-${label}-`));
  roots.push(root);
  return root;
}

function replayMetadata(): DeepAlignmentReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('deep-alignment-parity-replay'),
    replay_input_digests: {
      authority: digest('authority'),
      configuration: digest('configuration'),
      subject: digest('subject'),
      verifier: digest('verifier'),
    },
  };
}

function event<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepAlignmentScopeMap[TStem],
  data: DeepAlignmentPayloadMap[TStem],
): DeepAlignmentLedgerEvent {
  const input: DeepAlignmentEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: `event-${sequence}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-alignment-parity-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest(sequence).slice(0, 16)}`,
    causationId: sequence === 1 ? null : `event-${sequence - 1}`,
    idempotencyKey: `fixture-${sequence}`,
  };
  return prepareDeepAlignmentEvent(input, registry).envelope as DeepAlignmentEventEnvelope<TStem>;
}

function baseScope() {
  return { runId: RUN_ID, sessionId: SESSION_ID, authorityEpochId: AUTHORITY_EPOCH_ID };
}

function iterationScope() {
  return { ...baseScope(), generation: 1, iterationId: 'iteration-1' };
}

function laneScope() {
  return { ...iterationScope(), laneId: 'lane-schema' };
}

function generationScope() {
  return { ...baseScope(), generation: 1 };
}

function dimensionScope() {
  return { ...iterationScope(), dimensionId: 'alignment' };
}

function subjectScope() {
  return { ...laneScope(), subjectId: 'subject-1' };
}

function ruleScope() {
  return { ...subjectScope(), ruleId: 'rule-1' };
}

function observationScope() {
  return { ...ruleScope(), observationId: 'observation-1' };
}

function evidenceScope() {
  return { ...observationScope(), evidenceId: 'evidence-1' };
}

function candidateScope() {
  return { ...observationScope(), candidateId: 'candidate-1' };
}

function verificationScope() {
  return { ...candidateScope(), findingId: 'finding-1', verificationId: 'verification-1' };
}

function proofScope() {
  return { ...verificationScope(), proofId: 'proof-1' };
}

function findingScope() {
  return { ...dimensionScope(), findingId: 'finding-1' };
}

function deviationScope() {
  return { ...findingScope(), deviationId: 'deviation-1' };
}

function reportScope() {
  return { ...baseScope(), reportRevisionId: 'report-1' };
}

function protocolScope() {
  return { ...baseScope(), protocolId: 'protocol-1' };
}

function convergenceSignals(label: string) {
  return {
    noveltyRatio: 0,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(label),
  };
}

function lifecycleEvents(): DeepAlignmentLedgerEvent[] {
  // One realistic, folding-complete run covering every stem the adapter
  // lifecycle map owns. The run/authority/lane prefix is shared by every scene;
  // the completion-bearing stems (lane_completed through run_completed) and
  // the authority/finding surfaces live in later pool slots so each scene
  // selects only the small, internally-referenced subset it needs. Scenes stay
  // compact so every replay and parity descriptor stays well under the
  // canonical JSON structure budgets (canonical-json.ts), never because any
  // event-count window limits the harness.
  return [
    event('deep_alignment.run_initialized', 1, { ...baseScope(), generation: 1 }, {
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
      reviewModeContractDigest: digest('shared-review-loop-contract'),
      initialReleaseReadinessState: 'not-assessed',
    }),
    event('deep_alignment.authority_reference_bound', 2, baseScope(), {
      authorityId: 'authority-main',
      authorityCapsuleRef: 'authority-capsule-1',
      authoritySourceDigest: digest('authority-source'),
      compilerFingerprint: digest('authority-compiler'),
      profileDigest: digest('authority-profile'),
      ruleIrDigest: digest('rule-ir'),
      signatureDigest: digest('authority-signature'),
      expiresAt: '2027-07-28T10:00:00.000Z',
      rollbackRef: null,
    }),
    event('deep_alignment.authority_validation_recorded', 3, baseScope(), {
      authorityReferenceEventId: 'event-2',
      checks: {
        parse: 'pass', type: 'pass', capability: 'pass', ruleTests: 'pass',
        coverage: 'pass', expiry: 'pass', rollback: 'pass', signature: 'pass',
        mixAndMatch: 'pass', resultDigest: digest('authority-checks'),
      },
      authorityStatus: 'valid',
      validationReceiptRefs: ['receipt:authority'],
      validatorFingerprint: digest('authority-validator'),
      validationDigest: digest('authority-validation'),
      blockedReasonCode: null,
    }),
    event('deep_alignment.scope_resolved', 4, baseScope(), {
      targetSetDigest: digest('target-set'),
      scopeClass: 'targeted',
      selectedTargets: [{
        targetId: 'target-file', targetType: 'file', artifactRef: 'artifact:alignment.ts',
        sourceDigest: digest('alignment-source'), contentDigest: digest('alignment-content'),
      }],
      omittedHighRiskTargetRefs: [],
      discoveryMethodIds: ['changed-files'],
      scopeEvidenceRefs: ['evidence:scope'],
    }),
    event('deep_alignment.dimension_ordered', 5, baseScope(), {
      orderedDimensionIds: ['alignment'],
      riskRationale: 'Authority-backed alignment is the required dimension.',
      scopeEvidenceRefs: ['evidence:scope'],
      orderingPolicyVersion: 'dimension-order@1',
    }),
    event('deep_alignment.lane_plan_recorded', 6, laneScope(), {
      laneKind: 'schema', orderedRuleIds: ['rule-1'], ruleIrRef: 'rule-ir:1',
      ruleIrDigest: digest('rule-ir'), verifierPolicyVersion: 'verifier-policy@1',
      budgetRef: 'budget:lane', requiredEvidenceClasses: ['schema-witness'],
      planDigest: digest('lane-plan'),
    }),
    event('deep_alignment.lane_started', 7, laneScope(), {
      lanePlanEventId: 'event-6', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-3',
      authorityValidationDigest: digest('authority-validation'), status: 'started',
    }),
    event('deep_alignment.subject_snapshot_bound', 8, {
      ...laneScope(), subjectId: 'subject-1',
    }, {
      subjectSnapshotRef: 'subject-snapshot-1', subjectType: 'file',
      subjectDigest: digest('subject-snapshot'), sourceVersionRef: 'source-version-1',
      capturedAt: TIMESTAMP, parentSnapshotRef: null, receiptRef: 'receipt:subject',
    }),
    event('deep_alignment.applicability_evaluated', 9, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
    }, {
      predicateRef: 'predicate:rule-1', predicateDigest: digest('predicate'),
      targetFactRefs: ['target-fact:language'], targetFactDigest: digest('target-facts'),
      result: 'applicable', evaluatorFingerprint: digest('applicability-evaluator'),
      authorityValidationEventId: 'event-3', decisionDigest: digest('applicability'),
      reasonCode: 'subject-matches-rule',
    }),
    event('deep_alignment.dimension_pass_started', 10, {
      ...iterationScope(), dimensionId: 'alignment',
    }, {
      passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage'), passStatus: 'started',
      nextFocusRef: 'focus:rule-1',
    }),
    event('deep_alignment.observation_recorded', 11, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1', observationId: 'observation-1',
    }, {
      applicabilityDecisionId: 'event-9', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), detectorFingerprint: digest('detector'),
      observationKind: 'schema', rawResultDigest: digest('raw-result'),
      sourceDigest: digest('subject-source'), contentDigest: digest('subject-content'),
      evidenceClass: 'schema-witness', freshness: 'fresh', causalRelevance: 'direct',
      locator: {
        scheme: 'file', artifactRef: 'artifact:subject-1',
        locatorDigest: digest('locator'), selector: 'symbol:subject', revision: 'revision-1',
      },
      receiptRefs: ['receipt:observation'],
    }),
    event('deep_alignment.evidence_receipt_bound', 12, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', evidenceId: 'evidence-1',
    }, {
      observationEventId: 'event-11', receiptRef: 'receipt:evidence-1',
      receiptDigest: digest('evidence-receipt'), evidenceClass: 'schema-witness',
      freshness: 'fresh', sourceDigest: digest('evidence-source'),
      contentDigest: digest('evidence-content'), toolFingerprint: digest('evidence-tool'),
      capturedAt: TIMESTAMP,
    }),
    event('deep_alignment.observation_reconciled', 13, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1', observationId: 'observation-1',
    }, {
      observationEventId: 'event-90', predecessorObservationEventId: 'event-11',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      reconciliationOutcome: 'confirmed', evidenceSetDigest: digest('reconciled-set'),
      reconcilerFingerprint: digest('reconciler'), reasonCode: 'evidence-confirmed',
    }),
    event('deep_alignment.finding_candidate_emitted', 14, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-1',
    }, {
      observationEventId: 'event-11', applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      detectorFingerprint: digest('candidate-detector'),
      detectorBlindingDigest: digest('candidate-blinding'),
      candidateClaimDigest: digest('candidate-claim'), findingClass: 'alignment-drift',
      rawImpact: 0.5, rawConfidence: 0.8, rawCandidateScore: 0.7,
      scorerFingerprint: digest('candidate-scorer'),
      scoringPolicyVersion: 'candidate-scoring@1',
      semanticFingerprint: {
        algorithmVersion: 'semantic-alignment@1',
        semanticAnchorDigest: digest('candidate:anchor'),
        normalizedContextDigest: digest('candidate:context'),
        programSliceDigest: digest('candidate:slice'),
        renameMapVersion: 'rename-map@1',
        baselineState: 'present',
      },
      sourcePassEventId: 'event-10',
    }),
    event('deep_alignment.finding_verification_recorded', 15, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-1',
      findingId: 'finding-1', verificationId: 'verification-1',
    }, {
      candidateEventId: 'event-14', observationEventId: 'event-11',
      authorityValidationEventId: 'event-3', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      verifierFingerprint: digest('verifier'), verifierIndependenceDigest: digest('independence'),
      proofWitnessRefs: ['proof-1'], verificationMode: 'schema', result: 'confirmed',
      rawImpact: 0.5, rawConfidence: 0.8, evidenceStrength: 0.9,
      counterevidenceRefs: [], verificationDigest: digest('verification'),
    }),
    event('deep_alignment.proof_witness_recorded', 16, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-1',
      findingId: 'finding-1', verificationId: 'verification-1', proofId: 'proof-1',
    }, {
      verificationEventId: 'event-15', witnessKind: 'positive', artifactRef: 'artifact:proof',
      witnessDigest: digest('witness'), sourceDigest: digest('witness-source'),
      locator: {
        scheme: 'file', artifactRef: 'artifact:proof', locatorDigest: digest('proof-locator'),
        selector: 'proof:minimized', revision: 'revision-1',
      },
      minimized: true, minimizerFingerprint: digest('minimizer'),
      replayRecipeRef: 'recipe:proof-1', replayRecipeDigest: digest('replay-recipe'),
      outcome: 'supports', receiptRefs: ['receipt:evidence-1'],
    }),
    event('deep_alignment.claim_adjudication_recorded', 17, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-1',
      findingId: 'finding-1', verificationId: 'verification-1',
    }, {
      candidateEventId: 'event-14', verificationEventId: 'event-15',
      observationEventId: 'event-11', claimDigest: digest('adjudicated-claim'),
      evidenceReceiptRefs: ['receipt:evidence-1'], proofWitnessRefs: ['proof-1'],
      counterevidenceRefs: [], verifierFingerprint: digest('verifier'),
      assessorFingerprint: digest('assessor'), authorityValidationEventId: 'event-3',
      applicabilityDecisionId: 'event-9', subjectSnapshotDigest: digest('subject-snapshot'),
      finalSeverity: 'P2', impact: 0.5, confidence: 0.8, outcome: 'accepted',
      transition: 'candidate-to-finding', adjudicationDigest: digest('adjudication'),
      predecessorAdjudicationEventId: null,
    }),
    event('deep_alignment.conformance_assessment_recorded', 18, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-1',
      findingId: 'finding-1', verificationId: 'verification-1',
    }, {
      adjudicationEventId: 'event-17', adjudicationPayloadDigest: digest('adjudication'),
      authorityValidationEventId: 'event-3',
      authorityValidationDigest: digest('authority-validation'), authorityStatus: 'valid',
      subjectSnapshotRef: 'subject-snapshot-1', subjectSnapshotDigest: digest('subject-snapshot'),
      applicabilityDecisionId: 'event-9', applicabilityOutcome: 'applicable',
      verificationEventId: 'event-15', verifierFingerprint: digest('verifier'),
      proofWitnessRefs: ['proof-1'], evidenceReceiptRefs: ['receipt:evidence-1'],
      conformanceStatus: 'conformant', impact: 0.5, confidence: 0.8,
      assessmentPolicyVersion: 'assessment-policy@1', assessmentDigest: digest('assessment'),
    }),
    event('deep_alignment.finding_lineage_recorded', 19, findingScope(), {
      priorFingerprint: {
        algorithmVersion: 'semantic-alignment@1', semanticAnchorDigest: digest('candidate:anchor'),
        normalizedContextDigest: digest('candidate:context'),
        programSliceDigest: digest('candidate:slice'), renameMapVersion: 'rename-map@1',
        baselineState: 'present',
      },
      currentFingerprint: {
        algorithmVersion: 'semantic-alignment@1', semanticAnchorDigest: digest('candidate:anchor'),
        normalizedContextDigest: digest('candidate:context'),
        programSliceDigest: digest('candidate:slice'), renameMapVersion: 'rename-map@1',
        baselineState: 'present',
      },
      lineageRelation: 'preexisting', baselineStatus: 'present',
      evidenceSetDigest: digest('lineage-set'), predecessorEventRef: 'event-17',
    }),
    event('deep_alignment.finding_state_changed', 20, findingScope(), {
      priorFingerprint: {
        algorithmVersion: 'semantic-alignment@1', semanticAnchorDigest: digest('candidate:anchor'),
        normalizedContextDigest: digest('candidate:context'),
        programSliceDigest: digest('candidate:slice'), renameMapVersion: 'rename-map@1',
        baselineState: 'present',
      },
      currentFingerprint: {
        algorithmVersion: 'semantic-alignment@1', semanticAnchorDigest: digest('fixed:anchor'),
        normalizedContextDigest: digest('fixed:context'),
        programSliceDigest: digest('fixed:slice'), renameMapVersion: 'rename-map@1',
        baselineState: 'present',
      },
      priorState: 'accepted', currentState: 'fixed', priorSeverity: 'P2',
      currentSeverity: 'none', adjudicationEventId: 'event-17',
      adjudicationPayloadDigest: digest('adjudication'),
      changeReason: 'Fixture dismissal after the finding was verified.', 
      evidenceSetDigest: digest('state-set'), predecessorEventRef: 'event-17',
    }),
    event('deep_alignment.known_deviation_recorded', 21, deviationScope(), {
      originalFindingEventId: 'event-17', originalFindingDigest: digest('original-finding'),
      conformanceAssessmentEventId: 'event-18', authorityEpochRef: AUTHORITY_EPOCH_ID,
      verifierFingerprint: digest('verifier'), issuerId: 'alignment-issuer',
      rationale: 'Known deviation permits controlled shadow acceptance.',
      scopePredicateRef: 'predicate:deviation', scopePredicateDigest: digest('deviation-predicate'),
      subjectSnapshotDigest: digest('subject-snapshot'),
      expiresAt: '2027-07-28T10:00:00.000Z', invalidationConditionRefs: ['condition:fixed'],
      status: 'active',
    }),
    event('deep_alignment.known_deviation_invalidated', 22, deviationScope(), {
      deviationEventId: 'event-21', originalFindingEventId: 'event-17',
      authorityEpochRef: AUTHORITY_EPOCH_ID, verifierFingerprint: digest('verifier'),
      subjectSnapshotDigest: digest('subject-snapshot'), invalidationTrigger: 'expired',
      invalidationEvidenceRefs: ['evidence:invalidation'],
      invalidationDigest: digest('deviation-invalidation'),
      reactivatedFindingEventId: 'event-16', invalidatedAt: TIMESTAMP,
    }),
    event('deep_alignment.applicability_coverage_recorded', 23, laneScope(), {
      authorityValidationEventId: 'event-3', subjectSnapshotDigest: digest('subject-snapshot'),
      declaredApplicabilityEdgeRefs: ['edge:rule-subject'], applicableRuleIds: ['rule-1'],
      notApplicableRuleIds: [], unresolvedRuleIds: [], untestedRuleIds: [],
      blockedRuleIds: [], coverageDigest: digest('applicability-coverage'),
    }),
    event('deep_alignment.authority_epoch_compatibility_recorded', 24, baseScope(), {
      sourceAuthorityEpochId: AUTHORITY_EPOCH_ID, targetAuthorityEpochId: 'authority-epoch-2',
      compatibilityClass: 'compatible', direction: 'forward', affectedRuleIds: ['rule-1'],
      comparisonDigest: digest('epoch-comparison'), reasonCode: 'forward-compatible',
      orderedUpcastPath: [], ambiguous: false, lossy: false,
    }),
    event('deep_alignment.authority_witness_replayed', 25, proofScope(), {
      sourceAuthorityEpochId: AUTHORITY_EPOCH_ID, targetAuthorityEpochId: 'authority-epoch-2',
      witnessEventId: 'event-16', proofDigest: digest('witness'),
      affectedRuleIds: ['rule-1'], compatibilityClass: 'compatible',
      compatibilityDecisionEventId: 'event-24', replayOutcome: 'accepted',
      verifierFingerprint: digest('verifier'), subjectSnapshotDigest: digest('subject-snapshot'),
      replayDigest: digest('witness-replay'),
    }),
    event('deep_alignment.dimension_pass_completed', 26, {
      ...iterationScope(), dimensionId: 'alignment',
    }, {
      passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage-complete'), passStatus: 'complete',
      rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 0, p2: 1 },
      nextFocusRef: 'focus:convergence',
    }),
    event('deep_alignment.lane_completed', 27, laneScope(), {
      lanePlanEventId: 'event-6', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), authorityValidationEventId: 'event-3',
      applicabilityDecisionRefs: ['event-9'], observationRefs: [],
      verificationRefs: [], status: 'complete',
      counts: {
        applicable: 1, notApplicable: 0, unresolved: 0, untested: 0,
        blocked: 0, nonConformant: 0,
      },
      completionDigest: digest('lane-completion'), blockedReasonCode: null,
    }),
    event('deep_alignment.convergence_evaluated', 28, iterationScope(), {
      rawSignals: convergenceSignals('raw'), weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: digest('dimension-coverage'),
      protocolCoverageDigest: digest('protocol-coverage'), findingStability: 'stable',
      p0p1ResolutionState: 'resolved', evidenceDensity: 1, hotspotSaturation: 1,
      decision: 'converged', policyFingerprint: digest('convergence-policy'),
      blockerIds: [], stopCandidate: true,
    }),
    event('deep_alignment.graph_convergence_evaluated', 29, iterationScope(), {
      rawSignals: convergenceSignals('graph-raw'), weightedSignals: convergenceSignals('graph-weighted'),
      dimensionCoverageDigest: digest('graph-dimension-coverage'),
      protocolCoverageDigest: digest('graph-protocol-coverage'), findingStability: 'stable',
      p0p1ResolutionState: 'resolved', evidenceDensity: 1, hotspotSaturation: 1,
      decision: 'converged', policyFingerprint: digest('graph-policy'),
      blockerIds: [], stopCandidate: true, graphDecision: 'converged',
      graphDigest: digest('graph'),
    }),
    event('deep_alignment.blocked_stop_recorded', 30, iterationScope(), {
      blockedGateIds: ['coverage:alignment'],
      gateResults: [{
        gateId: 'coverage:alignment', status: 'fail',
        reasonCode: 'coverage-incomplete', evidenceDigest: digest('gate-evidence'),
      }],
      activeFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
      recoveryStrategy: 'restart', targetDimensionId: 'alignment',
      originatingConvergenceEventId: 'event-28', appendPosition: 1,
    }),
    event('deep_alignment.pause_recorded', 31, iterationScope(), {
      normalizedStopReason: 'fixture-pause', sentinelCause: 'manual',
      fromIterationId: 'iteration-1', strategy: 'resume-later', targetDimensionId: null,
      outcome: 'paused', lineageRef: 'lineage:pause', priorTailDigest: digest('pause-tail'),
    }),
    event('deep_alignment.recovery_started', 32, {
      ...iterationScope(), dimensionId: 'alignment',
    }, {
      normalizedStopReason: 'fixture-pause', recoveryCause: 'operator-recovered',
      fromIterationId: 'iteration-1', strategy: 'resume-later',
      targetDimensionId: 'alignment', outcome: 'recovery-started',
      lineageRef: 'lineage:recovery', priorTailDigest: digest('recovery-tail'),
      originatingPauseEventId: 'event-31',
    }),
    event('deep_alignment.synthesis_started', 33, reportScope(), {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-28' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [], deferredFindingIds: [],
    }),
    event('deep_alignment.review_report_committed', 34, reportScope(), {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-28' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [], deferredFindingIds: [],
      reportDigest: digest('report'),
      sectionManifest: { sectionIds: ['findings', 'verification'], manifestDigest: digest('sections') },
      reportReceiptRef: 'report-receipt-1',
    }),
    event('deep_alignment.continuity_save_requested', 35, baseScope(), {
      targetPacket: 'system-deep-loop/target', continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-28' },
      route: 'implementation-summary', mergeMode: 'update-in-place',
    }),
    event('deep_alignment.continuity_save_completed', 36, baseScope(), {
      targetPacket: 'system-deep-loop/target', continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-28' },
      route: 'implementation-summary', mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    }),
    event('deep_alignment.continuity_save_failed', 37, baseScope(), {
      targetPacket: 'system-deep-loop/target', continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-28' },
      route: 'implementation-summary', mergeMode: 'update-in-place',
      retryable: false, failureReasonCode: 'persistence-rejected',
    }),
    event('deep_alignment.run_completed', 38, baseScope(), {
      terminalStatus: 'completed', convergenceEventId: 'event-29',
      synthesisEventId: 'event-33', reportEventId: 'event-34', continuityEventId: 'event-36',
      finalLedgerTailHash: digest(`previous:${RUN_COMPLETED_SEQUENCE}`),
      counts: { dimensions: 1, iterations: 1, candidates: 0, findings: 0, evidence: 0 },
      verdict: 'pass', completionReason: 'All required alignment gates passed.',
      incompleteReason: null,
    }),
    event('deep_alignment.run_resumed', 39, { ...baseScope(), generation: 1 }, {
      priorTailDigest: digest('prior-tail-resume'), sourceSessionId: SESSION_ID,
      resumeReason: 'Fixture continuation after a pause boundary.',
      continuedFromRunId: RUN_ID, compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-receipt-1',
    }),
    event('deep_alignment.run_restarted', 40, { ...baseScope(), generation: 1 }, {
      priorTailDigest: digest('prior-tail-restart'), archivedLineageId: 'lineage-archived-1',
      restartReason: 'Fixture restart for parity coverage.',
      continuedFromRunId: RUN_ID, compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-receipt-2',
    }),
    event('deep_alignment.protocol_plan_recorded', 41, protocolScope(), {
      coreProtocolIds: ['alignment-protocol@1'], overlayProtocolIds: [],
      applicability: 'applicable', gateClass: 'required',
      contractVersion: 'alignment-protocol@1', plannedEvidenceSourceRefs: [],
      protocolPlanDigest: digest('protocol-plan'),
    }),
    event('deep_alignment.finding_candidate_emitted', 42, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-2',
    }, {
      observationEventId: 'event-11', applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      detectorFingerprint: digest('veto-detector'),
      detectorBlindingDigest: digest('veto-blinding'),
      candidateClaimDigest: digest('veto-claim'), findingClass: 'security',
      rawImpact: 0.9, rawConfidence: 0.9, rawCandidateScore: 0.9,
      scorerFingerprint: digest('veto-scorer'),
      scoringPolicyVersion: 'candidate-scoring@1',
      semanticFingerprint: {
        algorithmVersion: 'semantic-alignment@1', semanticAnchorDigest: digest('veto:anchor'),
        normalizedContextDigest: digest('veto:context'), programSliceDigest: digest('veto:slice'),
        renameMapVersion: 'rename-map@1', baselineState: 'present',
      },
      sourcePassEventId: 'event-10',
    }),
    event('deep_alignment.finding_verification_recorded', 43, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-2',
      findingId: 'finding-2', verificationId: 'verification-2',
    }, {
      candidateEventId: 'event-42', observationEventId: 'event-11',
      authorityValidationEventId: 'event-3', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), applicabilityDecisionId: 'event-9',
      evidenceReceiptRefs: ['receipt:evidence-1'],
      verifierFingerprint: digest('verifier'), verifierIndependenceDigest: digest('veto-independence'),
      proofWitnessRefs: ['proof-2'], verificationMode: 'schema', result: 'confirmed',
      rawImpact: 0.9, rawConfidence: 0.9, evidenceStrength: 0.9,
      counterevidenceRefs: [], verificationDigest: digest('veto-verification'),
    }),
    event('deep_alignment.proof_witness_recorded', 44, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-2',
      findingId: 'finding-2', verificationId: 'verification-2', proofId: 'proof-2',
    }, {
      verificationEventId: 'event-43', witnessKind: 'boundary', artifactRef: 'artifact:veto-proof',
      witnessDigest: digest('veto-witness'), sourceDigest: digest('veto-witness-source'),
      locator: {
        scheme: 'file', artifactRef: 'artifact:veto-proof', locatorDigest: digest('veto-locator'),
        selector: 'proof:boundary', revision: 'revision-1',
      },
      minimized: true, minimizerFingerprint: digest('minimizer'),
      replayRecipeRef: 'recipe:proof-2', replayRecipeDigest: digest('veto-recipe'),
      outcome: 'supports', receiptRefs: ['receipt:evidence-1'],
    }),
    event('deep_alignment.claim_adjudication_recorded', 45, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
      observationId: 'observation-1', candidateId: 'candidate-2',
      findingId: 'finding-2', verificationId: 'verification-2',
    }, {
      candidateEventId: 'event-42', verificationEventId: 'event-43',
      observationEventId: 'event-11', claimDigest: digest('veto-adjudicated-claim'),
      evidenceReceiptRefs: ['receipt:evidence-1'], proofWitnessRefs: ['proof-2'],
      counterevidenceRefs: [], verifierFingerprint: digest('verifier'),
      assessorFingerprint: digest('assessor'), authorityValidationEventId: 'event-3',
      applicabilityDecisionId: 'event-9', subjectSnapshotDigest: digest('subject-snapshot'),
      finalSeverity: 'P0', impact: 0.9, confidence: 0.9, outcome: 'accepted',
      transition: 'candidate-to-finding', adjudicationDigest: digest('veto-adjudication'),
      predecessorAdjudicationEventId: null,
    }),
  ];
}

/** Renumber a hand-picked selection into a contiguous, causally-chained stream
 *  the reducer's cursor-gap guard accepts no matter which pool slots it skips. */
function renumber(selected: readonly DeepAlignmentLedgerEvent[]): DeepAlignmentLedgerEvent[] {
  return selected.map((entry, index, entries) => (
    Object.freeze({
      ...entry,
      stream_sequence: index + 1,
      causation_id: index === 0 ? null : entries[index - 1].event_id,
      idempotency_key: `compact-${index + 1}`,
    })
  ));
}

function scenarioSelection(scenario: DeepAlignmentParityFixtureScenario): Readonly<{
  events: readonly DeepAlignmentLedgerEvent[];
  terminal: DeepAlignmentTerminalDecision;
}> {
  const all = lifecycleEvents();
  // Every scene below stays compact so the harness's bounded replay
  // attestation covers the whole selection. Each divergence test targets the
  // scene that genuinely populates its field rather than one omnibus fixture.
  const pick = (indexes: readonly number[]) => renumber(
    indexes.map((index) => all[index]),
  );
  switch (scenario) {
    case 'fresh-run':
      // The run/authority/lane prefix: initializes the run identity, binds and
      // validates authority, resolves scope and dimension order, and opens one
      // lane with an applicable decision, ending active.
      return { events: pick([0, 1, 2, 3, 4, 5, 6, 7, 8]), terminal: 'active' };
    case 'deterministic-replay':
      // Identical nine-event prefix so the fault-injection battery keeps its
      // fixed stem indexes while still folding to the closed active terminal.
      return { events: pick([0, 1, 2, 3, 4, 5, 6, 7, 8]), terminal: 'active' };
    case 'concurrent-lanes':
      // The observation/evidence surface: one owned observation and evidence
      // receipt behind the applicable decision, ending active.
      return { events: pick([0, 1, 2, 5, 6, 7, 8, 10, 11]), terminal: 'active' };
    case 'retry':
      // The pause/recovery surface: a pause and recovery over an opened lane,
      // ending active.
      return { events: pick([0, 1, 2, 3, 5, 6, 7, 30, 31]), terminal: 'active' };
    case 'late-completion':
      // The continuation surface: a resume and restart plus a protocol
      // obligation over the opened lane, ending active before any convergence
      // gate while keeping the unresolved obligation non-blocking.
      return { events: pick([0, 1, 2, 5, 6, 7, 38, 39, 40]), terminal: 'active' };
    case 'authority-change':
      // The authority compatibility surface: a cross-epoch compatibility
      // decision after the validated authority, ending active.
      return { events: pick([0, 1, 2, 4, 5, 6, 7, 8, 23]), terminal: 'active' };
    case 'applicability':
      // The lane-coverage surface: classifies the single rule as applicable
      // and binds the lane coverage, ending active.
      return { events: pick([0, 1, 2, 4, 5, 6, 7, 8, 22]), terminal: 'active' };
    case 'known-deviation':
      // The base run/authority/lane prefix kept as a green scene; the full
      // deviation surface is covered by a dedicated compact scene below.
      return { events: pick([0, 1, 2, 3, 4, 5, 6, 7, 8]), terminal: 'active' };
    case 'authority-conflict':
      // The blocked-terminal surface: a blocked stop and a failed continuity
      // save pin the terminal decision to blocked on both independent paths.
      return { events: pick([0, 1, 2, 3, 5, 6, 7, 29, 36]), terminal: 'blocked' };
    case 'report-handoff':
      // The base handoff surface: this green scene keeps the run/authority/lane
      // prefix the handoff tests rely on; report and continuity digest surfaces
      // are covered by their own compact scenes below.
      return { events: pick([0, 1, 2, 3, 4, 5, 6, 7, 8]), terminal: 'active' };
  }
}

function fixture(scenario: DeepAlignmentParityFixtureScenario): DeepAlignmentParityFixture {
  const selection = scenarioSelection(scenario);
  const provisional: DeepAlignmentParityFixture = {
    fixtureId: `fixture-${scenario}`,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      targetDigest: digest('target-content'),
      authorityCapsuleDigest: digest('authority-capsule'),
      authorityEpochId: AUTHORITY_EPOCH_ID,
      verifierFingerprint: digest('authority-validator'),
      laneConfigurationDigest: digest('lane-configuration'),
      reviewLoopContractVersion: 'shared-review-loop@1',
      executorCapabilityDigest: digest('executor-capabilities'),
      fixtureSeed: `seed-${scenario}`,
      initialStateDigest: digest('pending'),
      configurationDigest: digest({ mode: 'deep-alignment', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1', runId: RUN_ID, sessionId: SESSION_ID, generation: 1,
        maxIterations: 4, remainingIterations: 3,
        deadlineAt: '2026-07-29T10:00:00.000Z',
      },
    },
    events: selection.events,
    expectedTerminalDecision: selection.terminal,
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepAlignmentParityInitialStateDigest(provisional),
    }),
  });
}

/** Bind a hand-picked chain of pool events as a single-case compact fixture.
 *  Only the dependency stems a single projection field needs are folded, so
 *  the parity descriptor stays small enough to avoid the canonical JSON
 *  structural limits. The scenario label is reused because the case identity
 *  used by the manifest and receipt comes from `fixtureId`, not the label. */
function sceneFixture(
  sceneId: string,
  indexes: readonly number[],
  expectedTerminalDecision: DeepAlignmentTerminalDecision,
): DeepAlignmentParityFixture {
  const events = renumber(indexes.map((index) => lifecycleEvents()[index]));
  const provisional: DeepAlignmentParityFixture = {
    fixtureId: `fixture-${sceneId}`,
    scenario: 'concurrent-lanes',
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scene: sceneId, manifest: 1 }),
      targetDigest: digest('target-content'),
      authorityCapsuleDigest: digest('authority-capsule'),
      authorityEpochId: AUTHORITY_EPOCH_ID,
      verifierFingerprint: digest('authority-validator'),
      laneConfigurationDigest: digest('lane-configuration'),
      reviewLoopContractVersion: 'shared-review-loop@1',
      executorCapabilityDigest: digest('executor-capabilities'),
      fixtureSeed: `seed-${sceneId}`,
      initialStateDigest: digest('pending'),
      configurationDigest: digest({ mode: 'deep-alignment', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1', runId: RUN_ID, sessionId: SESSION_ID, generation: 1,
        maxIterations: 4, remainingIterations: 3,
        deadlineAt: '2026-07-29T10:00:00.000Z',
      },
    },
    events,
    expectedTerminalDecision,
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepAlignmentParityInitialStateDigest(provisional),
    }),
  });
}

/** Fold a scene and assert its target slice is genuinely populated, so a
 *  divergence test can never pass on an empty basket. */
function assertSceneSurface(
  scene: DeepAlignmentParityFixture,
  assert: (state: DeepAlignmentProjectionState) => void,
): void {
  const folded = deepAlignmentReducers.foldDeepAlignmentEvents(scene.events);
  expect(folded.outcome).toBe('projected');
  if (folded.outcome !== 'projected') return;
  assert(folded.projection);
}

function artifactPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

/** Pin actor, capability, and evidence to the prepared request so unverified identity cannot authorize. */
function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function artifactHarness(): ArtifactHarness {
  const rootDirectory = temporaryRoot('sealed');
  const artifactRegistry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy', policyVersion: 1, evaluatorVersion: '1',
    ruleIds: ['artifact-write'], evaluate: artifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'), ledgerId: 'alignment-parity-artifacts',
    auditLedgerId: 'alignment-parity-artifact-audit', authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, artifactRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'alignment-parity-artifact-audit', authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
    identityResolver: pinRequestIdentity,
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'store'), now: () => new Date(TIMESTAMP),
  });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`, streamId: 'artifact-stream', streamSequence: index,
      occurredAt: TIMESTAMP, recordedAt: TIMESTAMP,
      producer: { name: 'alignment-parity-tests', version: '1' }, authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`, causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (prepared): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${prepared.identity.eventId}`, mode: 'review',
      priorStateVersion: 'artifact-state@1', priorStateFingerprint: digest('artifact-state'),
      actorId: 'alignment-parity-test', capabilityId: 'artifact-write', authorityEpoch: 1,
      policy: {
        policyId: policy.policyId, policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: digest({ event: prepared.canonicalDigest }),
    }),
  };
  return { ledger, store, recorder, registry: artifactRegistry, nextMetadata };
}

async function sealAndRecord(
  harness: ArtifactHarness,
  artifactKind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const prepared = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, prepared);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    artifactKind,
  );
}

async function sealedBoundary(): Promise<SealedBoundary> {
  const harness = artifactHarness();
  const frozen = await sealAndRecord(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'deep-alignment', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealAndRecord(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-alignment', authority: 'legacy' },
    'configuration',
  );
  return { harness, referenceSet: bindVerifiedArtifactReferences([frozen, configuration]) };
}

function capsule(
  selected: DeepAlignmentParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: selected.frozenInput.baseSha,
    baseDigest: digest({ baseSha: selected.frozenInput.baseSha }),
    initialStateDigest: selected.frozenInput.initialStateDigest,
    configurationDigest: selected.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-alignment-event@1', comparator: 'deep-alignment-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-alignment-bounded-shadow',
  };
}

function targetedManifest(selected: DeepAlignmentParityFixture): ParityCaseManifest {
  const definition = createDeepAlignmentParityCaseDefinition(selected);
  return compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

function caseRun(
  selected: DeepAlignmentParityFixture,
  sealed: SealedBoundary,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepAlignmentParityFaultKind;
    eventIndex: number;
  }>,
): DeepAlignmentParityCaseRun {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(selected, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepAlignmentParityCaseDefinition(selected),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: selected,
    executors: createDeepAlignmentParityExecutors(selected, fault),
    shadowRootDirectory: join(temporaryRoot(`execution-${selected.fixtureId}`), 'shadow'),
    protectedRoots: [join(temporaryRoot(`authority-${selected.fixtureId}`), 'legacy-live')],
    deterministicRuns: 2,
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('Deep Alignment shadow parity', () => {
  it('honors closed volatility while identical semantics remain green', () => {
    const selected = fixture('report-handoff');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const legacy = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const independent = selected.events.map((entry, index) => Object.freeze({
      ...entry,
      event_id: `independent-${index}`,
      causation_id: index === 0 ? null : `independent-${index - 1}`,
      occurred_at: `2026-07-28T11:${String(index).padStart(2, '0')}:00.000Z`,
      recorded_at: `2026-07-28T12:${String(index).padStart(2, '0')}:00.000Z`,
      correlation_id: `transport-${digest(`independent-${index}`).slice(0, 16)}`,
    })) as DeepAlignmentLedgerEvent[];
    const ledger = canonicalizeDeepAlignmentEventStream(independent, fingerprints);
    expect(DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, legacy, ledger)).toEqual([]);
  });

  it('pairs independent streams by logical identity and detects semantic drift', () => {
    const selected = fixture('deterministic-replay');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const independent = baseline.map((entry, index) => ({ ...entry, eventId: `other-${index}` }));
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, baseline, independent)).toEqual([]);
    const changed = independent.map((entry, index) => (
      index === 8 ? { ...entry, stablePayloadDigest: digest('semantic-drift') } : entry
    ));
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, baseline, changed).map(
      (entry) => entry.class,
    )).toContain('payload');
  });

  it('drives every divergence class through the real paired pipeline', async () => {
    const selected = fixture('deterministic-replay');
    const indexOf = (stem: DeepAlignmentEventStem): number => {
      const index = selected.events.findIndex((entry) => entry.payload.stem === stem);
      if (index < 0) throw new TypeError(`Fixture does not contain ${stem}`);
      return index;
    };
    const applicabilityIndex = indexOf('deep_alignment.applicability_evaluated');
    const faults = [
      ['drop-event', applicabilityIndex, 'missing'],
      ['reorder-event', indexOf('deep_alignment.subject_snapshot_bound'), 'reordered'],
      ['extra-event', applicabilityIndex, 'extra'],
      ['duplicate-event', applicabilityIndex, 'duplicated'],
      ['causal-link', applicabilityIndex, 'causal-link'],
      ['payload', applicabilityIndex, 'payload'],
      ['receipt', indexOf('deep_alignment.authority_validation_recorded'), 'receipt'],
      ['artifact', indexOf('deep_alignment.subject_snapshot_bound'), 'artifact'],
      ['terminal-decision', applicabilityIndex, 'terminal-decision'],
      ['projection', applicabilityIndex, 'projection'],
    ] as const;
    for (const [kind, eventIndex, expectedClass] of faults) {
      const sealed = await sealedBoundary();
      const outcome = await runDeepAlignmentParityCase({
        manifest: targetedManifest(selected),
        caseRun: caseRun(selected, sealed, { path: 'ledger', kind, eventIndex }),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(
        outcome.receipt.diffDispositions.map((entry) => entry.class),
        JSON.stringify({ result: outcome.result, receipt: outcome.receipt }),
      ).toContain(
        expectedClass,
      );
    }
  }, 180_000);

  it('fails unexplained differences and exposes no laundering disposition', () => {
    const selected = fixture('applicability');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const changed = baseline.map((entry, index) => (
      index === 8 ? { ...entry, stablePayloadDigest: digest('changed-applicability') } : entry
    ));
    const diffs = compareDeepAlignmentEventStreams(selected.fixtureId, baseline, changed);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]).toMatchObject({ class: 'payload', disposition: 'unexplained' });
    expect(JSON.stringify(diffs)).not.toContain('tolerated-non-semantic');
  });

  it('binds green receipts to the real certificate and trusted manifest', async () => {
    const selected = fixture('report-handoff');
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepAlignmentParityCase({
      manifest,
      caseRun: caseRun(selected, sealed),
    });
    expect(
      outcome.receipt.exitStatus,
      JSON.stringify({ result: outcome.result, receipt: outcome.receipt }),
    ).toBe('green');
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(parseDeepAlignmentParityReceipt(outcome.receipt, manifest).receiptDigest).toBe(
      outcome.receipt.receiptDigest,
    );
    const mismatched = compileParityCaseManifest({
      baseSha: OTHER_BASE_SHA,
      baselineRows: manifest.baselineRows,
      cases: manifest.cases,
    });
    expect(() => parseDeepAlignmentParityReceipt(outcome.receipt, mismatched)).toThrow();
    const tampered = {
      ...outcome.receipt,
      parityCertificate: {
        ...outcome.receipt.parityCertificate,
        manifest_digest: digest('tampered-manifest'),
      },
    };
    expect(() => parseDeepAlignmentParityReceipt(tampered, manifest)).toThrow();
    const malformedIdentityRegistry = {
      ...outcome.receipt,
      parityCertificate: {
        ...outcome.receipt.parityCertificate,
        identity_registry: {
          ...outcome.receipt.parityCertificate?.identity_registry,
          unexpected: true,
        },
      },
    };
    expect(() => parseDeepAlignmentParityReceipt(malformedIdentityRegistry, manifest))
      .toThrow(/closed identity-registry shape/);
  }, 30_000);

  it('uses a distinct legacy model and keeps the successor input non-authoritative', async () => {
    const selected = fixture('report-handoff');
    const executors = createDeepAlignmentParityExecutors(selected);
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleKind).toBe('independent-legacy-model');
    expect(executors.sharedReviewLoopContract).toBe('imported-phase-012-backbone');
    expect(executors.substrateImportsReal).toBe(true);
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepAlignmentParityCase({
      manifest,
      caseRun: caseRun(selected, sealed),
    });
    const gate = createDeepAlignmentModeGateInput({
      manifest,
      expectedFixtureIds: [selected.fixtureId],
      receipts: [outcome.receipt],
    });
    expect(gate).toMatchObject({
      exitStatus: 'pass', authorityState: 'legacy-authoritative',
      authorityMutation: false, rollbackReadinessAuthorized: false,
      cutoverAuthorized: false,
    });
  }, 30_000);

  it('fails on a reducer-internal divergence a shared-derivation harness could not see', async () => {
    // Corrupt only the real reducer's own typed fold output (never the raw
    // event stream both paths read). A harness whose legacy side re-derives
    // from that same fold -- instead of independently from the raw events --
    // cannot observe this at all, so it reports parity PASS despite the
    // reducer having computed a wrong authority verdict. The rebuilt harness
    // must FAIL here.
    const realFold = deepAlignmentReducers.foldDeepAlignmentEvents;
    const foldSpy = vi.spyOn(deepAlignmentReducers, 'foldDeepAlignmentEvents').mockImplementation(
      (events, options) => {
        const real = realFold(events, options);
        if (real.outcome !== 'projected' || real.projection.authorityAlignment.status !== 'valid') {
          return real;
        }
        return {
          ...real,
          projection: {
            ...real.projection,
            authorityAlignment: { ...real.projection.authorityAlignment, status: 'invalid' },
          },
        };
      },
    );
    try {
      const selected = fixture('report-handoff');
      const sealed = await sealedBoundary();
      const manifest = targetedManifest(selected);
      const outcome = await runDeepAlignmentParityCase({
        manifest,
        caseRun: caseRun(selected, sealed),
      });
      expect(foldSpy).toHaveBeenCalled();
      expect(outcome.result.ok, JSON.stringify(outcome.result)).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
      expect(outcome.receipt).toMatchObject({
        exitStatus: 'blocked',
        certificateStatus: 'refused',
      });
    } finally {
      foldSpy.mockRestore();
    }
  }, 30_000);

  it('still reports parity PASS for identical inputs once the reducer fold is genuine again', async () => {
    const selected = fixture('report-handoff');
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepAlignmentParityCase({
      manifest,
      caseRun: caseRun(selected, sealed),
    });
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    expect(outcome.receipt).toMatchObject({ exitStatus: 'green', certificateStatus: 'issued' });
  }, 30_000);

  it('compiles only the exact ten-scenario fixture closure', () => {
    const fixtures = DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS.map(fixture);
    const manifest = compileDeepAlignmentParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(10);
    expect(() => compileDeepAlignmentParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/complete ten-scenario fixture set/);
  });

  it('rejects open fixture and resume-evidence shapes before execution', async () => {
    const selected = fixture('fresh-run');
    const sealed = await sealedBoundary();
    const openFixture = { ...selected, undeclared: true } as DeepAlignmentParityFixture;
    await expect(runDeepAlignmentParityCase({
      manifest: targetedManifest(openFixture),
      caseRun: caseRun(openFixture, sealed),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);
  });

  /** Corrupt one reducer-state slice on the ledger fold only and require the
   *  paired pipeline to refuse the resulting projection-semantic divergence.
   *  The ledger path derives every projected field from `foldDeepAlignmentEvents`
   *  while the legacy path reconstructs the same surface straight from the raw
   *  events, so a mutation confined to that one fold changes only one side and
   *  the comparator must fail closed. The fixture is built after the spy is
   *  installed so the frozen initialStateDigest stays consistent with the
   *  uncorrupted empty fold the executor replays. */
  async function expectSurfaceDivergence(
    scenario: DeepAlignmentParityFixtureScenario,
    mutate: (state: DeepAlignmentProjectionState) => DeepAlignmentProjectionState,
  ): Promise<void> {
    await expectFixtureDivergence(fixture(scenario), mutate);
  }

  /** Assertion body shared by every per-field divergence test. Takes a
   *  compact scene fixture directly so a test can fold only the minimal event
   *  chain its target projection field needs. */
  async function expectFixtureDivergence(
    selected: DeepAlignmentParityFixture,
    mutate: (state: DeepAlignmentProjectionState) => DeepAlignmentProjectionState,
  ): Promise<void> {
    const realFold = deepAlignmentReducers.foldDeepAlignmentEvents;
    const spy = vi.spyOn(deepAlignmentReducers, 'foldDeepAlignmentEvents').mockImplementation(
      (events, options) => {
        const real = realFold(events, options);
        if (real.outcome !== 'projected' || events.length === 0) return real;
        return { ...real, projection: mutate(real.projection) };
      },
    );
    try {
      const sealed = await sealedBoundary();
      const manifest = targetedManifest(selected);
      const outcome = await runDeepAlignmentParityCase({
        manifest,
        caseRun: caseRun(selected, sealed),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.certificateStatus).toBe('refused');
      expect(outcome.receipt.parityCertificate).toBeNull();
      expect(outcome.result.ok, JSON.stringify(outcome.result)).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
    } finally {
      spy.mockRestore();
    }
  }

  it('fails parity when the run-id projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      run: { ...state.run, runId: 'run-id-corrupted' },
    }));
  }, 30_000);

  it('fails parity when the session-id projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      run: { ...state.run, sessionId: 'session-id-corrupted' },
    }));
  }, 30_000);

  it('fails parity when the authority-epoch-id projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      run: { ...state.run, authorityEpochId: 'epoch-corrupted' },
    }));
  }, 30_000);

  it('fails parity when the generation projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      run: { ...state.run, generation: state.run.generation + 1000 },
    }));
  }, 30_000);

  it('fails parity when an authority-reference projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      authorityAlignment: {
        ...state.authorityAlignment,
        references: state.authorityAlignment.references.map((entry, index) => (
          index === 0 ? { ...entry, profileDigest: digest('corrupted-reference') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when an authority-validation projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      authorityAlignment: {
        ...state.authorityAlignment,
        validations: state.authorityAlignment.validations.map((entry, index) => (
          index === 0 ? { ...entry, validationDigest: digest('corrupted-validation') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when a lane projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      lanePlan: {
        ...state.lanePlan,
        lanes: state.lanePlan.lanes.map((entry, index) => (
          index === 0 ? { ...entry, subjectSnapshotRef: 'snapshot-corrupted' } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when an applicability-decision projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      applicability: {
        ...state.applicability,
        decisions: state.applicability.decisions.map((entry, index) => (
          index === 0 ? { ...entry, decisionDigest: digest('corrupted-decision') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when a lane-verdict projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        laneVerdicts: state.conformance.laneVerdicts.map((entry, index) => (
          index === 0 ? { ...entry, verdict: 'FAIL' as const } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the overall-verdict projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      conformance: { ...state.conformance, overallVerdict: 'FAIL' as const },
    }));
  }, 30_000);

  it('fails parity when the review-loop outcome projection field diverges', async () => {
    // The executor's closed-terminal gate reads only the derived terminal
    // decision, which stays active regardless of the loop outcome slice, so a
    // one-path outcome flip always reaches the fingerprint comparator.
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      reviewLoop: { ...state.reviewLoop, outcome: 'blocked' as const },
    }));
  }, 30_000);

  it('fails parity when the review-loop eligibility projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      reviewLoop: { ...state.reviewLoop, eligibility: 'STOP_ELIGIBLE' as const },
    }));
  }, 30_000);

  it('fails parity when an artifact content-digest projection field diverges', async () => {
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((entry, index) => (
          index === 0 ? { ...entry, contentDigest: digest('corrupted-artifact') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the public-gauge lane-count input diverges', async () => {
    // The gauge surface derives laneCount from the lane-plan length; dropping
    // a lane on the ledger fold changes the gauge without touching the terminal
    // decision, so only the projection-semantic field diverges.
    await expectSurfaceDivergence('fresh-run', (state) => ({
      ...state,
      lanePlan: { ...state.lanePlan, lanes: state.lanePlan.lanes.slice(0, -1) },
    }));
  }, 30_000);

  it('fails parity when an authority-compatibilities projection field diverges', async () => {
    const scene = sceneFixture('scene-authority-compatibilities', [0, 1, 2, 23], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.authorityAlignment.compatibilities.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      authorityAlignment: {
        ...state.authorityAlignment,
        compatibilities: state.authorityAlignment.compatibilities.map((entry, index) => (
          index === 0 ? { ...entry, comparisonDigest: digest('corrupted-compatibility') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when an applicability-coverage projection field diverges', async () => {
    const scene = sceneFixture('scene-applicability-coverage', [0, 1, 2, 5, 6, 7, 22], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.applicability.coverage.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      applicability: {
        ...state.applicability,
        coverage: state.applicability.coverage.map((entry, index) => (
          index === 0 ? { ...entry, coverageDigest: digest('corrupted-coverage') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when an observations projection field diverges', async () => {
    const scene = sceneFixture('scene-observations', [0, 1, 2, 5, 6, 7, 8, 10], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.conformance.observations.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        observations: state.conformance.observations.map((entry, index) => (
          index === 0 ? { ...entry, observationId: 'observation-corrupted' } : entry
        )),
      },
    }));
  }, 30_000);

  // ── Structurally-impossible compact scenes ─────────────────────────────
  // Each fixture below folds to a fully-populated projection (verified by the
  // runnable body's fold assertion), so the charge is NOT emptiness. The
  // blocker is the harness's replay-attestation append: the gateway validates
  // the attestation event via isEventPreflight, canonicalizing the envelope's
  // byte array as JSON nodes at 1 node per byte (canonical-json.ts:37-40 sets
  // MAX_JSON_NODES=10_000). Every per-event record hash and chain identity is
  // embedded in the attestation descriptor, so once a fixture needs more than
  // ~9 events the envelope itself exceeds 10,000 bytes and the throw
  // "JSON value exceeds structural limits" fires before any projection
  // comparator can run. The minimal chains below are the shortest event
  // sequences the reducer accepts for their target field, so no shorter scene
  // exists that could stay under the node budget. Flipping any of these to
  // `it` runs the real pipeline and fails with divergence.class ===
  // 'execution-outcome' plus that structural-limits message.

  it.skip('covers the evidence-receipts projection field', async () => {
    const scene = sceneFixture('scene-evidence-receipts', [0, 1, 2, 5, 6, 7, 8, 10, 11], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.proofWitness.evidenceReceipts.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      proofWitness: {
        ...state.proofWitness,
        evidenceReceipts: state.proofWitness.evidenceReceipts.map((entry, index) => (
          index === 0 ? { ...entry, contentDigest: digest('corrupted-receipt') } : entry
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the findings projection field', async () => {
    const scene = sceneFixture(
      'scene-findings',
      [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16],
      'active',
    );
    assertSceneSurface(scene, (state) => {
      expect(state.conformance.findings.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        findings: state.conformance.findings.map((entry, index) => (
          index === 0 ? { ...entry, derivedSeverity: 'P0' as const } : entry
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the deviations projection field', async () => {
    const scene = sceneFixture(
      'scene-deviations',
      [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 20],
      'active',
    );
    assertSceneSurface(scene, (state) => {
      expect(state.conformance.deviations.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        deviations: state.conformance.deviations.map((entry, index) => (
          index === 0 ? { ...entry, rationale: 'corrupted-deviation' } : entry
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the proof-witnesses projection field', async () => {
    const scene = sceneFixture(
      'scene-proof-witnesses',
      [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16],
      'active',
    );
    assertSceneSurface(scene, (state) => {
      expect(state.proofWitness.witnesses.length).toBeGreaterThan(0);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      proofWitness: {
        ...state.proofWitness,
        witnesses: state.proofWitness.witnesses.map((entry, index) => (
          index === 0 ? { ...entry, witnessDigest: digest('corrupted-witness') } : entry
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the active-finding-id projection field', async () => {
    const scene = sceneFixture(
      'scene-active-finding-id',
      [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16],
      'active',
    );
    assertSceneSurface(scene, (state) => {
      expect(state.conformance.activeFindingIds).toContain('finding-1');
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        activeFindingIds: ['forged-active-finding'],
      },
    }));
  }, 30_000);

  it.skip('covers the hard-veto finding-id projection field', async () => {
    const scene = sceneFixture(
      'scene-hard-veto-finding-id',
      [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 41, 42, 43, 44],
      'active',
    );
    assertSceneSurface(scene, (state) => {
      expect(state.conformance.hardVetoFindingIds).toContain('finding-2');
      expect(state.conformance.activeFindingIds).toContain('finding-2');
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      conformance: {
        ...state.conformance,
        hardVetoFindingIds: ['finding-2', 'forged-veto-finding'],
      },
    }));
  }, 30_000);

  it('fails parity when the report-digest projection field diverges', async () => {
    const scene = sceneFixture('scene-report-digest', [0, 33], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.artifactIndex.artifacts.some(
        (entry) => entry.artifactKind === 'review-report',
      )).toBe(true);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((entry) => (
          entry.artifactKind === 'review-report'
            ? { ...entry, contentDigest: digest('corrupted-report') }
            : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the continuity-save-digest projection field diverges', async () => {
    const scene = sceneFixture('scene-continuity-save-digest', [0, 35], 'active');
    assertSceneSurface(scene, (state) => {
      expect(state.artifactIndex.artifacts.some(
        (entry) => entry.artifactKind === 'continuity-save',
      )).toBe(true);
    });
    await expectFixtureDivergence(scene, (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((entry) => (
          entry.artifactKind === 'continuity-save'
            ? { ...entry, contentDigest: digest('corrupted-continuity') }
            : entry
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the terminal-decision projection field', () => {
    // The executor's closed-terminal gate re-reads this very projection field
    // on every path and throws before the fingerprint comparator when a
    // one-path flip disagrees with the fixture's closed expectation, so a
    // folded-terminal corruption always fails closed as execution-outcome,
    // never projection-semantic. Terminal drift is already asserted separately
    // by the terminal-decision fault in the fault-injection battery.
  });

  it.skip('covers the resume-decision-digest projection field', () => {
    // The closed fixture closure never supplies resumeEvidence, so the reducer
    // yields a structurally-null resume-decision digest on both paths and no
    // mutation of its feeding slice can change the projection.
  });

  it('covers every deep-alignment event stem in the fixture pool', () => {
    const pool = lifecycleEvents();
    const stems = new Set(pool.map((entry) => entry.payload.stem));
    for (const stem of DeepAlignmentEventStems) {
      expect(stems.has(stem), `Pool must expose the ${stem} stem`).toBe(true);
    }
    expect(stems.size).toBe(DeepAlignmentEventStems.length);
  });

  it('populates every projection-semantic test surface on its divergence scene', () => {
    const projection = deepAlignmentReducers.foldDeepAlignmentEvents(
      fixture('fresh-run').events,
    );
    expect(projection.outcome).toBe('projected');
    if (projection.outcome !== 'projected') return;
    const state = projection.projection;
    expect(state.run.runId).not.toBeNull();
    expect(state.run.sessionId).not.toBeNull();
    expect(state.run.authorityEpochId).not.toBeNull();
    expect(state.run.generation).toBeGreaterThan(0);
    expect(state.authorityAlignment.references.length).toBeGreaterThan(0);
    expect(state.authorityAlignment.validations.length).toBeGreaterThan(0);
    expect(state.lanePlan.lanes.length).toBeGreaterThan(0);
    expect(state.applicability.decisions.length).toBeGreaterThan(0);
    expect(state.conformance.laneVerdicts.length).toBeGreaterThan(0);
    expect(state.conformance.overallVerdict).not.toBeNull();
    expect(state.reviewLoop.eligibility).not.toBeNull();
    expect(state.reviewLoop.outcome).not.toBeNull();
    expect(state.artifactIndex.artifacts.length).toBeGreaterThan(0);
    expect(state.seenEvents.length).toBeGreaterThan(0);
  });
});

