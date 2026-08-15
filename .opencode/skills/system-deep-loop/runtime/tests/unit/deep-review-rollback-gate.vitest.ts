// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import { createHash } from 'node:crypto';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepReviewTransitionKinds,
  issueDeepReviewRunCertificate,
  parseDeepReviewCertificateBundle,
} from '../../lib/deep-review-certificates/index.js';
import {
  DeepReviewWireEventTypes,
  createDeepReviewEventRegistry,
  deepReviewEventDefinitions,
  prepareDeepReviewEvent,
} from '../../lib/deep-review-ledger-schema/index.js';
import {
  DeepReviewModeMigrationGate,
  DeepReviewRollbackSwitch,
  evaluateDeepReviewRollbackWindow,
} from '../../lib/deep-review-rollback-gate/index.js';
import {
  DEEP_REVIEW_COMPARATOR_VERSION,
  DEEP_REVIEW_LIFECYCLE_EVENT_MAP,
  DEEP_REVIEW_MODE_GATE_INPUT_VERSION,
  DEEP_REVIEW_PARITY_PROJECTION_VERSION,
  DEEP_REVIEW_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_REVIEW_VOLATILITY_ALLOWLIST,
  createDeepReviewModeGateInput,
} from '../../lib/deep-review-shadow-parity/index.js';
import {
  DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
  DEEP_REVIEW_REDUCER_ID,
  DEEP_REVIEW_REDUCER_VERSION,
  createDeepReviewProjectionState,
  reduceDeepReviewVerifiedEvent,
} from '../../lib/deep-review-reducers/index.js';
import {
  DeepReviewArtifactKinds,
  createDeepReviewSealedArtifactStore,
  sealDeepReviewArtifact,
} from '../../lib/deep-review-sealed-artifacts/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';
import {
  AuthorizedEvidenceWriter,
  CertificationProviderRegistry,
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
} from '../../lib/replay-fingerprint/index.js';
import { InitialArtifactKinds } from '../../lib/sealed-reference-artifacts/index.js';
import {
  DetectorByFaultFixture,
  ROLLBACK_DRILL_SCHEMA_VERSION,
  RollbackFaultFixtures,
  classificationManifestDigest,
  createRollbackDrillCertificate,
  rollbackAnchorDigest,
  runRollbackDrill,
  writeImmutableRollbackCertificate,
} from '../../lib/rollback-drills/index.js';
import {
  FROZEN_CENSUS_ROW_POLICIES,
  InflightDisposition,
  createClassificationManifest,
} from '../../lib/inflight-state-classification/index.js';
import {
  compileParityCaseManifest,
  issueParityCertificate,
} from '../../lib/shadow-parity/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepReviewOfflineVerificationInput,
  DeepReviewTransitionReceiptInput,
  DeepReviewTransitionReceiptSubstrate,
} from '../../lib/deep-review-certificates/index.js';
import type {
  DeepReviewEventEnvelope,
  DeepReviewEventInput,
  DeepReviewEventStem,
  DeepReviewLedgerEvent,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-review-ledger-schema/index.js';
import type { DeepReviewProjectionState } from '../../lib/deep-review-reducers/index.js';
import type {
  DeepReviewLifecycleEvidenceRow,
  DeepReviewModeGateInput,
  DeepReviewModeMigrationCertificate,
  DeepReviewRollbackRequest,
  DeepReviewVersionBindings,
} from '../../lib/deep-review-rollback-gate/index.js';
import type {
  DeepReviewArtifactDependency,
  DeepReviewArtifactKind,
  DeepReviewArtifactMaterial,
  DeepReviewConvergenceArtifactMaterial,
  DeepReviewCandidateArtifactMaterial,
  DeepReviewPassArtifactMaterial,
  DeepReviewResumeArtifactMaterial,
  DeepReviewScopeArtifactMaterial,
  DeepReviewSealedArtifactBinding,
  DeepReviewSynthesisArtifactMaterial,
} from '../../lib/deep-review-sealed-artifacts/index.js';
import type {
  DeepReviewParityCertificateEvidenceBinding,
  DeepReviewParityReceipt,
  DeepReviewResumeParityEvidence,
} from '../../lib/deep-review-shadow-parity/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { HealthAggregate } from '../../lib/health-degeneration-harness/index.js';
import type { ProtectedResourceIdentity } from '../../lib/locks-and-fencing/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type {
  CertificationProfile,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type {
  DrillInputBindings,
  InflightClassificationManifest as RollbackClassificationManifest,
  RollbackDrillClock,
  RollbackDrillManifest,
  RollbackDrillOptions,
  RollbackLaneState,
  Phase014RollbackEvidenceInput,
} from '../../lib/rollback-drills/index.js';
import type { ParityCertificateBindings, ShadowParityCasePass } from '../../lib/shadow-parity/index.js';

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const BASE_SHA = '1'.repeat(40);
const CANDIDATE_SHA = '2'.repeat(40);
const CERTIFICATE_TIMESTAMP = '2026-07-21T18:00:00.000Z';
const CERTIFICATE_RUN_ID = 'rollback-gate-certificate-run';
const CERTIFICATE_LINEAGE_ID = 'rollback-gate-certificate-lineage';
const CERTIFICATE_STREAM_ID = 'rollback-gate-certificate-stream';
const TEST_PRODUCER = Object.freeze({ name: 'deep-review-rollback-gate-tests', version: '1' });
const TIMESTAMP = CERTIFICATE_TIMESTAMP;
const RUN_ID = CERTIFICATE_RUN_ID;
const SESSION_ID = 'rollback-gate-certificate-session';
const STREAM_ID = CERTIFICATE_STREAM_ID;
const PRODUCER = TEST_PRODUCER;
const ROLLBACK_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'rollback-gate-drill-provider',
  key_id: 'rollback-gate-drill-key',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const ROLLBACK_PROVIDER = createHmacCertificationProvider(
  ROLLBACK_PROFILE,
  'rollback-gate-drill-secret-with-more-than-thirty-two-bytes',
);
const temporaryRoots: string[] = [];

type ReplayProjection = DeepReviewProjectionState & JsonObject;

interface Scenario {
  readonly bundle: ReturnType<typeof parseDeepReviewCertificateBundle>;
  readonly verification: DeepReviewOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepReviewSealedArtifactStore>;
  readonly bindings: readonly DeepReviewSealedArtifactBinding[];
  readonly materialsByQualifiedDigest: ReadonlyMap<string, DeepReviewArtifactMaterial>;
}

interface ScenarioOptions {
  readonly adjudicationOutcome?: 'accepted' | 'rejected';
  readonly continuityEffect?: 'durable' | 'retry-unknown';
  readonly convergenceDecision?: 'converged' | 'incomplete';
  readonly maxIterations?: number;
  readonly terminalStatus?: 'blocked' | 'completed' | 'incomplete';
  readonly unresolvedFindingIds?: readonly string[];
  readonly deferredFindingIds?: readonly string[];
}

interface RetainedCounts {
  readonly retainedEventCountBefore: number;
  readonly retainedEventCountAfter: number;
  readonly retainedArtifactCountBefore: number;
  readonly retainedArtifactCountAfter: number;
}

const DEFAULT_RETAINED_COUNTS: RetainedCounts = Object.freeze({
  retainedEventCountBefore: 9,
  retainedEventCountAfter: 9,
  retainedArtifactCountBefore: 6,
  retainedArtifactCountAfter: 6,
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-review-rollback-gate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function hash(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function replayMetadata(label: string): DeepReviewReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`event-replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
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

function convergenceSignals(seed: string): DeepReviewPayloadMap[
  'deep_review.convergence_evaluated'
]['rawSignals'] {
  return {
    noveltyRatio: 0.1,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(`signals:${seed}`),
  };
}

function event<TStem extends DeepReviewEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepReviewScopeMap[TStem],
  data: DeepReviewPayloadMap[TStem],
): DeepReviewEventEnvelope<TStem> {
  const input: DeepReviewEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(stem),
    data,
    eventId: `review-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: PRODUCER,
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: sequence === 1
      ? null
      : `review-event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `review-event-${sequence}`,
  };
  return prepareDeepReviewEvent(
    input,
    createDeepReviewEventRegistry(),
  ).envelope as DeepReviewEventEnvelope<TStem>;
}

function projectionEvents(
  options: ScenarioOptions = {},
): readonly DeepReviewLedgerEvent[] {
  const events: DeepReviewLedgerEvent[] = [];
  let sequence = 1;
  const append = <TStem extends DeepReviewEventStem>(
    stem: TStem,
    scope: DeepReviewScopeMap[TStem],
    data: DeepReviewPayloadMap[TStem],
  ): void => {
    events.push(event(stem, sequence, scope, data));
    sequence += 1;
  };
  const runScope = { runId: RUN_ID, sessionId: SESSION_ID };
  const generationScope = { ...runScope, generation: 1 };
  const iterationScope = { ...generationScope, iterationId: 'iteration-1' };
  const dimensionScope = { ...iterationScope, dimensionId: 'correctness' };
  const candidateScope = { ...dimensionScope, candidateId: 'candidate-1' };

  append('deep_review.run_initialized', generationScope, {
    target: {
      targetId: 'target-root',
      targetType: 'repository',
      artifactRef: 'artifact:repository',
      sourceDigest: digest('target-source'),
      contentDigest: digest('target-content'),
    },
    lineageMode: 'fresh',
    maxIterations: options.maxIterations ?? 4,
    convergencePolicyVersion: 'review-convergence@1',
    reviewModeContractDigest: digest('review-contract'),
    initialReleaseReadinessState: 'not-assessed',
  });
  append('deep_review.scope_resolved', runScope, {
    targetSetDigest: digest('target-set'),
    scopeClass: 'targeted',
    selectedTargets: [{
      targetId: 'target-file',
      targetType: 'file',
      artifactRef: 'artifact:src/review.ts',
      sourceDigest: digest('review-source'),
      contentDigest: digest('review-content'),
    }],
    omittedHighRiskTargetRefs: [],
    discoveryMethodIds: ['changed-files'],
    scopeEvidenceRefs: ['scope-evidence-1'],
  });
  append('deep_review.dimension_ordered', runScope, {
    orderedDimensionIds: ['correctness'],
    riskRationale: 'Correctness is the required fixture dimension.',
    scopeEvidenceRefs: ['scope-evidence-1'],
    orderingPolicyVersion: 'dimension-order@1',
  });
  append('deep_review.dimension_pass_started', dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: digest('pass-started'),
    passStatus: 'started',
    nextFocusRef: 'focus:evidence',
  });
  append('deep_review.dimension_pass_completed', dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: digest('pass-complete'),
    passStatus: 'complete',
    rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 0, p2: 1 },
    nextFocusRef: 'focus:convergence',
  });
  append('deep_review.finding_candidate_emitted', candidateScope, {
    targetRefs: ['target:src/review.ts'],
    evidenceRefs: ['evidence-1'],
    claimTextDigest: digest('candidate-claim'),
    findingClass: 'correctness-defect',
    impact: 0.5,
    rawConfidence: 0.8,
    rawCandidateScore: 0.7,
    actionability: 0.8,
    reachability: 0.7,
    exploitability: 0.4,
    evidenceType: 'test',
    evidenceScope: 'direct',
    rawObservationDigest: digest('candidate-observation'),
    semanticFingerprint: semanticFingerprint('candidate'),
    sourcePassEventId: 'review-event-005',
  });
  append('deep_review.evidence_observed', {
    ...candidateScope,
    evidenceId: 'evidence-1',
  }, {
    locator: {
      scheme: 'file',
      artifactRef: 'artifact:src/review.ts',
      locatorDigest: digest('locator'),
      selector: 'function:reviewCandidate',
      startLine: 20,
      endLine: 28,
      revision: 'revision-1',
    },
    observationKind: 'test-result',
    rawResultDigest: digest('test-result'),
    sourceDigest: digest('evidence-source'),
    contentDigest: digest('evidence-content'),
    toolFingerprint: digest('test-tool'),
    analyzerFingerprint: digest('test-analyzer'),
    independentEvidenceClass: 'independent-test',
    causalProximityStatus: 'direct',
    stabilityStatus: 'stable',
    relevanceStatus: 'relevant',
    supersedesEvidenceEventId: null,
  });
  append('deep_review.claim_adjudication_recorded', {
    ...candidateScope,
    findingId: 'finding-1',
  }, {
    claimDigest: digest('adjudicated-claim'),
    evidenceRefs: ['evidence-1'],
    counterevidenceSoughtRefs: ['counterevidence-1'],
    alternativeExplanationDigest: digest('alternative'),
    finalSeverity: options.adjudicationOutcome === 'rejected' ? 'none' : 'P2',
    impact: 0.5,
    confidence: 0.8,
    downgradeTrigger: 'none',
    transition: options.adjudicationOutcome === 'rejected'
      ? 'candidate-to-rejected'
      : 'candidate-to-finding',
    validatorFingerprint: digest('validator'),
    adjudicationOutcome: options.adjudicationOutcome ?? 'accepted',
    predecessorAdjudicationEventId: null,
  });
  append('deep_review.finding_lineage_recorded', {
    ...dimensionScope,
    findingId: 'finding-1',
  }, {
    priorFingerprint: semanticFingerprint('candidate'),
    currentFingerprint: semanticFingerprint('lineage'),
    lineageRelation: 'updated',
    baselineStatus: 'present',
    evidenceSetDigest: digest('lineage-evidence'),
    predecessorEventRef: 'review-event-008',
  });
  append('deep_review.review_depth_recorded', iterationScope, {
    reviewDepthSchemaVersion: 'review-depth@1',
    applicability: 'applicable',
    targetSelectionDigest: digest('depth-targets'),
    requiredBugClasses: ['state-corruption'],
    coveredBugClasses: ['state-corruption'],
    ruledOutBugClasses: [],
    deferredBugClasses: [],
    blockedBugClasses: [],
    searchLedgerRowDigests: [digest('search-row')],
    graphStatus: 'available',
    semanticSearchStatus: 'available',
  });
  append('deep_review.convergence_evaluated', iterationScope, {
    rawSignals: convergenceSignals('raw'),
    weightedSignals: convergenceSignals('weighted'),
    dimensionCoverageDigest: digest('dimension-coverage'),
    protocolCoverageDigest: digest('protocol-coverage'),
    findingStability: 'stable',
    p0p1ResolutionState: 'resolved',
    evidenceDensity: 1,
    hotspotSaturation: 1,
    decision: options.convergenceDecision ?? 'converged',
    policyFingerprint: digest('convergence-policy'),
    blockerIds: [],
    stopCandidate: options.convergenceDecision !== 'incomplete',
  });
  append('deep_review.synthesis_started', {
    ...runScope,
    reportRevisionId: 'report-1',
  }, {
    finalizedEventRange: {
      firstEventId: 'review-event-001',
      lastEventId: 'review-event-011',
    },
    findingRegistryInputDigest: digest('finding-registry'),
    deduplicationPolicyDigest: digest('deduplication'),
    verdictInputDigests: [digest('verdict-input')],
    unresolvedFindingIds: [...(options.unresolvedFindingIds ?? [])],
    deferredFindingIds: [...(options.deferredFindingIds ?? [])],
  });
  append('deep_review.review_report_committed', {
    ...runScope,
    reportRevisionId: 'report-1',
  }, {
    finalizedEventRange: {
      firstEventId: 'review-event-001',
      lastEventId: 'review-event-012',
    },
    findingRegistryInputDigest: digest('finding-registry'),
    deduplicationPolicyDigest: digest('deduplication'),
    verdictInputDigests: [digest('verdict-input')],
    unresolvedFindingIds: [...(options.unresolvedFindingIds ?? [])],
    deferredFindingIds: [...(options.deferredFindingIds ?? [])],
    reportDigest: digest('report'),
    sectionManifest: {
      sectionIds: ['findings', 'verification'],
      manifestDigest: digest('report-sections'),
    },
    reportReceiptRef: 'report-receipt-1',
  });
  append('deep_review.continuity_save_requested', runScope, {
    targetPacket: 'system-deep-loop/target',
    continuityPayloadDigest: digest('continuity-payload'),
    sourceEventRange: {
      firstEventId: 'review-event-001',
      lastEventId: 'review-event-013',
    },
    route: 'implementation-summary',
    mergeMode: 'update-in-place',
  });
  if (options.continuityEffect === 'retry-unknown') {
    append('deep_review.continuity_save_failed', runScope, {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: {
        firstEventId: 'review-event-001',
        lastEventId: 'review-event-014',
      },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      retryable: true,
      failureReasonCode: 'provider-result-unknown',
    });
  } else {
    append('deep_review.continuity_save_completed', runScope, {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: {
        firstEventId: 'review-event-001',
        lastEventId: 'review-event-014',
      },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    });
  }
  const terminalStatus = options.terminalStatus ?? 'completed';
  append('deep_review.run_completed', runScope, {
    terminalStatus,
    convergenceEventId: 'review-event-011',
    synthesisEventId: 'review-event-012',
    reportEventId: 'review-event-013',
    continuityEventId: 'review-event-015',
    finalLedgerTailHash: digest('previous:16'),
    counts: { dimensions: 1, iterations: 1, candidates: 1, findings: 1, evidence: 1 },
    verdict: terminalStatus === 'completed'
      ? 'pass'
      : terminalStatus === 'blocked'
        ? 'blocked'
        : 'incomplete',
    completionReason: terminalStatus === 'completed'
      ? 'All required typed gates passed.'
      : null,
    incompleteReason: terminalStatus === 'completed'
      ? null
      : terminalStatus === 'blocked'
        ? 'Required lifecycle evidence is blocked.'
        : 'The run reached its bounded terminal without trusted completion.',
  });
  return Object.freeze(events);
}

function supersedingEvidenceEvents(): readonly DeepReviewLedgerEvent[] {
  const events = [...projectionEvents().slice(0, 7)];
  events.push(event('deep_review.evidence_reconciled', 8, {
    runId: RUN_ID,
    sessionId: SESSION_ID,
    generation: 1,
    iterationId: 'iteration-1',
    dimensionId: 'correctness',
    candidateId: 'candidate-1',
    evidenceId: 'evidence-1',
  }, {
    locator: {
      scheme: 'file',
      artifactRef: 'artifact:src/review.ts',
      locatorDigest: digest('locator-reconciled'),
      selector: 'function:reviewCandidate',
      startLine: 20,
      endLine: 28,
      revision: 'revision-2',
    },
    observationKind: 'test-result',
    rawResultDigest: digest('test-result-reconciled'),
    sourceDigest: digest('evidence-source-reconciled'),
    contentDigest: digest('evidence-content-reconciled'),
    toolFingerprint: digest('test-tool'),
    analyzerFingerprint: digest('test-analyzer'),
    independentEvidenceClass: 'independent-test',
    causalProximityStatus: 'direct',
    stabilityStatus: 'stable',
    relevanceStatus: 'relevant',
    supersedesEvidenceEventId: 'review-event-007',
    reconciliationOutcome: 'superseded',
    evidenceSetDigest: digest('evidence-set-reconciled'),
  }));
  return Object.freeze(events);
}

async function authorizedLedger(events: readonly DeepReviewLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepReviewEventDefinitions());
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('ledger');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    identityResolver: pinRequestIdentity,
  }, ledger, policies);
  for (const [index, ledgerEvent] of events.entries()) {
    const prepared = prepareDeepReviewEvent({
      stem: ledgerEvent.payload.stem,
      scope: ledgerEvent.payload.scope,
      prevEventHash: ledgerEvent.payload.prevEventHash,
      replay: ledgerEvent.payload.replay,
      data: ledgerEvent.payload.data,
      eventId: ledgerEvent.event_id,
      streamId: ledgerEvent.stream_id,
      streamSequence: ledgerEvent.stream_sequence,
      occurredAt: ledgerEvent.occurred_at,
      recordedAt: ledgerEvent.recorded_at,
      producer: ledgerEvent.producer,
      authorityEpoch: ledgerEvent.authority_epoch,
      correlationId: ledgerEvent.correlation_id,
      causationId: ledgerEvent.causation_id,
      idempotencyKey: ledgerEvent.idempotency_key,
    }, registry);
    const request = await createFixtureRequest(
      ledger,
      prepared,
      policies,
      `review-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('Expected fixture authorization');
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
  });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-review-certificate-writer',
    correlationId: 'deep-review-certificate-writer',
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => lease,
    },
    gateway,
    policies,
    registry,
    authorizationContext: (prepared) => ({
      mode: 'review',
      priorStateVersion: 'deep-review-certificate-state@1',
      priorStateFingerprint: digest('deep-review-certificate-state'),
      actorId: 'deep-review-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: prepared.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: prepared.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepReviewTransitionReceiptSubstrate = Object.freeze({
    writer,
    registry,
    producer: PRODUCER,
  });
  return { ledger, receiptSubstrate, registry };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepReviewWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, eventRead) => {
        const verified = { event: eventRead } as unknown as VerifiedLedgerEvent;
        return reduceDeepReviewVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_REVIEW_REDUCER_ID,
    reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function locator(label: string) {
  return {
    scheme: 'file' as const,
    locatorDigest: digest(`locator:${label}`),
    selector: `src/review.ts:${label.length + 1}#${label}`,
    revision: 'revision-1',
  };
}

function dependency(binding: DeepReviewSealedArtifactBinding): DeepReviewArtifactDependency {
  return {
    artifactKind: binding.artifactKind,
    reference: binding.reference,
  };
}

async function sealedArtifacts(options: ScenarioOptions = {}) {
  const store = createDeepReviewSealedArtifactStore({
    rootDirectory: temporaryRoot('artifacts'),
  });
  const bindings: DeepReviewSealedArtifactBinding[] = [];
  const materialsByQualifiedDigest = new Map<string, DeepReviewArtifactMaterial>();
  const seal = async <TKind extends DeepReviewArtifactKind>(
    artifactKind: TKind,
    material: DeepReviewArtifactMaterialByKind[TKind],
  ): Promise<DeepReviewSealedArtifactBinding<TKind>> => {
    const binding = await sealDeepReviewArtifact(store, artifactKind, material);
    bindings.push(binding);
    materialsByQualifiedDigest.set(binding.reference.qualified_digest, material);
    return binding;
  };
  const scopeArtifact = async (
    artifactKind: Extract<
      DeepReviewArtifactKind,
      | 'deep-review-target-snapshot'
      | 'deep-review-scope-reference-set'
      | 'deep-review-review-contract'
      | 'deep-review-context-snapshot'
      | 'deep-review-capability-commitment'
      | 'deep-review-prompt-rubric'
      | 'deep-review-policy-input'
    >,
    eventStem: DeepReviewEventStem,
    eventId: string,
  ) => {
    const backing = await store.seal(InitialArtifactKinds.FIXTURE, {
      label: artifactKind,
      runId: RUN_ID,
    });
    return seal(artifactKind, {
      artifactId: `${artifactKind}-1`,
      eventStem,
      eventId,
      authorityEpoch: 1,
      materialDigest: backing.artifact.reference.content_digest,
      materialRef: `artifact:${backing.artifact.reference.qualified_digest}`,
      dependencies: [{
        artifactKind: InitialArtifactKinds.FIXTURE,
        reference: backing.artifact.reference,
      }],
      locator: locator(artifactKind),
      producerVersion: 'scope-producer@1',
    });
  };

  const target = await scopeArtifact(
    DeepReviewArtifactKinds.TARGET_SNAPSHOT,
    'deep_review.run_initialized',
    'review-event-001',
  );
  const scope = await scopeArtifact(
    DeepReviewArtifactKinds.SCOPE_REFERENCE_SET,
    'deep_review.scope_resolved',
    'review-event-002',
  );
  const reviewContract = await scopeArtifact(
    DeepReviewArtifactKinds.REVIEW_CONTRACT,
    'deep_review.run_initialized',
    'review-event-001',
  );
  const context = await scopeArtifact(
    DeepReviewArtifactKinds.CONTEXT_SNAPSHOT,
    'deep_review.dimension_ordered',
    'review-event-003',
  );
  const capability = await scopeArtifact(
    DeepReviewArtifactKinds.CAPABILITY_COMMITMENT,
    'deep_review.run_initialized',
    'review-event-001',
  );
  const rubric = await scopeArtifact(
    DeepReviewArtifactKinds.PROMPT_RUBRIC,
    'deep_review.run_initialized',
    'review-event-001',
  );
  const policy = await scopeArtifact(
    DeepReviewArtifactKinds.POLICY_INPUT,
    'deep_review.run_initialized',
    'review-event-001',
  );
  const passMaterial = (
    passId: string,
    eventStem: DeepReviewEventStem,
    eventId: string,
  ): DeepReviewArtifactMaterialByKind['deep-review-dimension-pass'] => ({
    passId,
    eventStem,
    eventId,
    authorityEpoch: 1,
    orderedInputDigests: [target.reference.content_digest],
    selectedTargetDigests: [target.reference.content_digest],
    searchLedgerDigest: scope.reference.content_digest,
    diagnosticsDigest: context.reference.content_digest,
    observationDigests: [context.reference.content_digest],
    graphEventDigest: context.reference.content_digest,
    iterationDigest: reviewContract.reference.content_digest,
    deltaDigest: context.reference.content_digest,
    dependencies: [
      dependency(target),
      dependency(scope),
      dependency(context),
      dependency(reviewContract),
    ],
    locator: locator(passId),
    passVersion: 'pass@1',
  });
  const passStarted = await seal(
    DeepReviewArtifactKinds.DIMENSION_PASS,
    passMaterial('pass-started', 'deep_review.dimension_pass_started', 'review-event-004'),
  );
  const passCompleted = await seal(
    DeepReviewArtifactKinds.DIMENSION_PASS,
    passMaterial('pass-completed', 'deep_review.dimension_pass_completed', 'review-event-005'),
  );
  const candidateMaterial = (
    candidateId: string,
    eventStem: DeepReviewEventStem,
    eventId: string,
    predecessor: DeepReviewSealedArtifactBinding,
  ): DeepReviewArtifactMaterialByKind['deep-review-candidate-evidence'] => ({
    candidateId,
    eventStem,
    eventId,
    authorityEpoch: 1,
    claimDigest: predecessor.reference.content_digest,
    evidenceDigests: [predecessor.reference.content_digest],
    intermediateFactDigests: [predecessor.reference.content_digest],
    reproductionDigest: predecessor.reference.content_digest,
    refutationDigest: predecessor.reference.content_digest,
    rawScore: 0.8,
    confidence: 0.8,
    impact: 0.5,
    reachability: 0.7,
    exploitability: 0.4,
    evidenceStrength: 'substantial',
    evidenceScope: 'targeted',
    dependencies: [dependency(predecessor)],
    locator: locator(candidateId),
    candidateVersion: 'candidate@1',
  });
  const candidate = await seal(
    DeepReviewArtifactKinds.CANDIDATE_EVIDENCE,
    candidateMaterial(
      'candidate-1',
      'deep_review.finding_candidate_emitted',
      'review-event-006',
      passCompleted,
    ),
  );
  const observedEvidence = await seal(
    DeepReviewArtifactKinds.CANDIDATE_EVIDENCE,
    candidateMaterial(
      'candidate-evidence-1',
      'deep_review.evidence_observed',
      'review-event-007',
      passCompleted,
    ),
  );
  const adjudicationMaterial = (
    candidateId: string,
    eventStem: DeepReviewEventStem,
    eventId: string,
  ): DeepReviewArtifactMaterialByKind['deep-review-adjudication-evidence'] => ({
    ...candidateMaterial(candidateId, eventStem, eventId, candidate),
    dependencies: [dependency(candidate)],
    claimDigest: candidate.reference.content_digest,
    evidenceDigests: [candidate.reference.content_digest],
    intermediateFactDigests: [candidate.reference.content_digest],
    reproductionDigest: candidate.reference.content_digest,
    refutationDigest: candidate.reference.content_digest,
  });
  const adjudication = await seal(
    DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE,
    adjudicationMaterial(
      'adjudication-1',
      'deep_review.claim_adjudication_recorded',
      'review-event-008',
    ),
  );
  const lineage = await seal(
    DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE,
    adjudicationMaterial(
      'lineage-1',
      'deep_review.finding_lineage_recorded',
      'review-event-009',
    ),
  );
  const reviewDepth = await seal(
    DeepReviewArtifactKinds.DIMENSION_PASS,
    passMaterial('review-depth', 'deep_review.review_depth_recorded', 'review-event-010'),
  );
  const convergence = await seal(DeepReviewArtifactKinds.CONVERGENCE_WITNESS, {
    witnessId: 'convergence-1',
    eventStem: 'deep_review.convergence_evaluated',
    eventId: 'review-event-011',
    authorityEpoch: 1,
    orderedInputDigests: [
      passCompleted.reference.content_digest,
      candidate.reference.content_digest,
      adjudication.reference.content_digest,
    ],
    stateHistoryDigest: digest('state-history'),
    findingsRegistryInputDigest: digest('findings-registry'),
    coverageDigest: digest('dimension-coverage'),
    gateResultDigests: Array.from(
      { length: 9 },
      () => adjudication.reference.content_digest,
    ),
    graphConvergenceDigest: digest('graph-convergence'),
    decision: 'converged',
    recoveryDecision: 'none',
    dependencies: [
      dependency(passCompleted),
      dependency(candidate),
      dependency(adjudication),
    ],
    locator: locator('convergence'),
    evaluatorVersion: 'convergence@1',
  });
  const synthesisMaterial = (
    outputId: string,
    eventStem: DeepReviewEventStem,
    eventId: string,
  ): DeepReviewArtifactMaterialByKind['deep-review-synthesis-view'] => ({
    outputId,
    eventStem,
    eventId,
    authorityEpoch: 1,
    orderedInputDigests: [convergence.reference.content_digest],
    findingsRegistryDigest: digest('finding-registry'),
    dashboardDigest: digest('dashboard'),
    resourceMapDigest: null,
    reportDigest: passCompleted.reference.content_digest,
    unresolvedFindingDigests: [],
    verdict: 'pass',
    advisoryState: 'advisory',
    reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    projectionVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    dependencies: [dependency(convergence), dependency(passCompleted)],
    locator: locator(outputId),
  });
  const synthesis = await seal(
    DeepReviewArtifactKinds.SYNTHESIS_VIEW,
    synthesisMaterial('synthesis-1', 'deep_review.synthesis_started', 'review-event-012'),
  );
  const report = await seal(
    DeepReviewArtifactKinds.SYNTHESIS_REPORT,
    synthesisMaterial('report-1', 'deep_review.review_report_committed', 'review-event-013'),
  );
  const resumeMaterial = (
    handoffId: string,
    eventStem: DeepReviewEventStem,
    eventId: string,
  ): DeepReviewArtifactMaterialByKind['deep-review-resume-handoff'] => ({
    handoffId,
    eventStem,
    eventId,
    authorityEpoch: 1,
    priorReferenceSetDigest: report.reference.content_digest,
    changedInputDigest: target.reference.content_digest,
    affectedFindingDigests: [adjudication.reference.content_digest],
    affectedReportDigests: [report.reference.content_digest],
    continuityPointer: `deep-review/${handoffId}`,
    driftDisposition: 'unchanged',
    dependencies: [dependency(report), dependency(target)],
    locator: locator(handoffId),
    handoffVersion: 'handoff@1',
  });
  const continuityRequested = await seal(
    DeepReviewArtifactKinds.RESUME_HANDOFF,
    resumeMaterial(
      'continuity-requested',
      'deep_review.continuity_save_requested',
      'review-event-014',
    ),
  );
  const continuityCompleted = await seal(
    DeepReviewArtifactKinds.RESUME_HANDOFF,
    resumeMaterial(
      'continuity-completed',
      options.continuityEffect === 'retry-unknown'
        ? 'deep_review.continuity_save_failed'
        : 'deep_review.continuity_save_completed',
      'review-event-015',
    ),
  );
  const completion = await seal(
    DeepReviewArtifactKinds.RESUME_HANDOFF,
    resumeMaterial('completion', 'deep_review.run_completed', 'review-event-016'),
  );
  return {
    store,
    bindings: Object.freeze(bindings),
    materialsByQualifiedDigest,
    receiptArtifacts: {
      target,
      reviewContract,
      capability,
      rubric,
      policy,
      scope,
      context,
      passStarted,
      passCompleted,
      candidate,
      observedEvidence,
      adjudication,
      lineage,
      reviewDepth,
      convergence,
      synthesis,
      report,
      continuityRequested,
      continuityCompleted,
      completion,
    },
  };
}

function transitionInputs(
  artifacts: Awaited<ReturnType<typeof sealedArtifacts>>['receiptArtifacts'],
): readonly DeepReviewTransitionReceiptInput[] {
  const q = (binding: DeepReviewSealedArtifactBinding) => (
    binding.reference.qualified_digest
  );
  return Object.freeze([
    {
      transitionKind: DeepReviewTransitionKinds.INIT,
      logicalOperationId: 'operation-init',
      attemptIds: ['attempt-init-1'],
      resultEventId: 'review-event-001',
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [
        q(artifacts.target),
        q(artifacts.reviewContract),
        q(artifacts.capability),
        q(artifacts.rubric),
        q(artifacts.policy),
      ],
    },
    {
      transitionKind: DeepReviewTransitionKinds.SCOPE,
      logicalOperationId: 'operation-scope',
      attemptIds: ['attempt-scope-1'],
      resultEventId: 'review-event-002',
      inputArtifactQualifiedDigests: [q(artifacts.target)],
      outputArtifactQualifiedDigests: [q(artifacts.scope)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.SCOPE,
      logicalOperationId: 'operation-dimension-order',
      attemptIds: ['attempt-dimension-order-1'],
      resultEventId: 'review-event-003',
      inputArtifactQualifiedDigests: [q(artifacts.scope)],
      outputArtifactQualifiedDigests: [q(artifacts.context)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.PASS,
      logicalOperationId: 'operation-pass-start',
      attemptIds: ['attempt-pass-start-1'],
      resultEventId: 'review-event-004',
      inputArtifactQualifiedDigests: [q(artifacts.target), q(artifacts.scope)],
      outputArtifactQualifiedDigests: [q(artifacts.passStarted)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.PASS,
      logicalOperationId: 'operation-pass-complete',
      attemptIds: ['attempt-pass-complete-1'],
      resultEventId: 'review-event-005',
      inputArtifactQualifiedDigests: [q(artifacts.passStarted)],
      outputArtifactQualifiedDigests: [q(artifacts.passCompleted)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.CANDIDATE,
      logicalOperationId: 'operation-candidate',
      attemptIds: ['attempt-candidate-1'],
      resultEventId: 'review-event-006',
      inputArtifactQualifiedDigests: [q(artifacts.passCompleted)],
      outputArtifactQualifiedDigests: [q(artifacts.candidate)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.EVIDENCE,
      logicalOperationId: 'operation-evidence',
      attemptIds: ['attempt-evidence-1'],
      resultEventId: 'review-event-007',
      inputArtifactQualifiedDigests: [q(artifacts.passCompleted), q(artifacts.candidate)],
      outputArtifactQualifiedDigests: [q(artifacts.observedEvidence)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.ADJUDICATION,
      logicalOperationId: 'operation-adjudication',
      attemptIds: ['attempt-adjudication-1'],
      resultEventId: 'review-event-008',
      inputArtifactQualifiedDigests: [q(artifacts.candidate), q(artifacts.observedEvidence)],
      outputArtifactQualifiedDigests: [q(artifacts.adjudication)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.LINEAGE,
      logicalOperationId: 'operation-lineage',
      attemptIds: ['attempt-lineage-1'],
      resultEventId: 'review-event-009',
      inputArtifactQualifiedDigests: [q(artifacts.adjudication)],
      outputArtifactQualifiedDigests: [q(artifacts.lineage)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.REVIEW_DEPTH,
      logicalOperationId: 'operation-review-depth',
      attemptIds: ['attempt-review-depth-1'],
      resultEventId: 'review-event-010',
      inputArtifactQualifiedDigests: [q(artifacts.passCompleted), q(artifacts.adjudication)],
      outputArtifactQualifiedDigests: [q(artifacts.reviewDepth)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.CONVERGENCE,
      logicalOperationId: 'operation-convergence',
      attemptIds: ['attempt-convergence-1'],
      resultEventId: 'review-event-011',
      inputArtifactQualifiedDigests: [
        q(artifacts.reviewDepth),
        q(artifacts.candidate),
        q(artifacts.adjudication),
      ],
      outputArtifactQualifiedDigests: [q(artifacts.convergence)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.SYNTHESIS,
      logicalOperationId: 'operation-synthesis',
      attemptIds: ['attempt-synthesis-1'],
      resultEventId: 'review-event-012',
      inputArtifactQualifiedDigests: [q(artifacts.convergence)],
      outputArtifactQualifiedDigests: [q(artifacts.synthesis)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.REPORT,
      logicalOperationId: 'operation-report',
      attemptIds: ['attempt-report-1'],
      resultEventId: 'review-event-013',
      inputArtifactQualifiedDigests: [q(artifacts.synthesis)],
      outputArtifactQualifiedDigests: [q(artifacts.report)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.CONTINUITY,
      logicalOperationId: 'operation-continuity-request',
      attemptIds: ['attempt-continuity-request-1'],
      resultEventId: 'review-event-014',
      inputArtifactQualifiedDigests: [q(artifacts.report)],
      outputArtifactQualifiedDigests: [q(artifacts.continuityRequested)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.CONTINUITY,
      logicalOperationId: 'operation-continuity-complete',
      attemptIds: ['attempt-continuity-complete-1'],
      resultEventId: 'review-event-015',
      inputArtifactQualifiedDigests: [q(artifacts.continuityRequested)],
      outputArtifactQualifiedDigests: [q(artifacts.continuityCompleted)],
    },
    {
      transitionKind: DeepReviewTransitionKinds.COMPLETION,
      logicalOperationId: 'operation-completion',
      attemptIds: ['attempt-completion-1'],
      resultEventId: 'review-event-016',
      inputArtifactQualifiedDigests: [q(artifacts.continuityCompleted)],
      outputArtifactQualifiedDigests: [q(artifacts.completion)],
    },
  ]);
}

function certificationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-review-test-provider',
      key_id: 'deep-review-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

async function createScenario(
  options: ScenarioOptions = {},
): Promise<Scenario> {
  const events = projectionEvents(options);
  const { ledger, receiptSubstrate, registry } = await authorizedLedger(events);
  const artifacts = await sealedArtifacts(options);
  const providers = certificationProviders();
  const initialState = createDeepReviewProjectionState() as ReplayProjection;
  const replay: DeepReviewOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: DEEP_REVIEW_REDUCER_ID,
      reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepReviewRunCertificate({
    runId: RUN_ID,
    sessionId: SESSION_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: artifacts.store,
    artifactBindings: artifacts.bindings,
    transitionReceipts: transitionInputs(artifacts.receiptArtifacts),
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'deep-review-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    artifactStore: artifacts.store,
    bindings: artifacts.bindings,
    materialsByQualifiedDigest: artifacts.materialsByQualifiedDigest,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: artifacts.store,
      replay,
      providers,
    },
  };
}

async function certificateVerificationInput(): Promise<Readonly<{
  verificationInput: DeepReviewOfflineVerificationInput<ReplayProjection>;
  artifactBindings: readonly DeepReviewSealedArtifactBinding[];
}>> {
  const scenario = await createScenario();
  return { verificationInput: scenario.verification, artifactBindings: scenario.bindings };
}

class RollbackGateClock implements RollbackDrillClock {
  #instant: number;

  public constructor(instant = '2026-07-10T00:00:00.000Z') {
    this.#instant = Date.parse(instant);
  }

  public now(): Date {
    return new Date(this.#instant);
  }

  public advance(milliseconds: number): void {
    this.#instant += milliseconds;
  }
}

function rollbackDrillClassification(): RollbackClassificationManifest {
  const rows = CENSUS.rows.map((row) => ({
    rowId: row.id,
    stateDigest: digest(`rollback-state:${row.id}`),
    shapeVersion: 'census-v1',
    lifecyclePoint: row.lifecycle,
    authorityEpoch: 7,
    mutability: row.mutability,
    activeLeaseIds: [],
    pendingEffectIds: [],
    identityCoverageComplete: true,
    orderCoverageComplete: true,
    rollbackAnchorDigest: digest(`rollback-anchor:${row.id}`),
    disposition: 'UPCAST' as const,
    reasonCode: 'sandbox-upcast-covered',
    verifier: 'rollback-gate-drill-verifier',
    terminalReceiptId: null,
    isQuiescent: true,
  }));
  return { expectedRowIds: rows.map((row) => row.rowId), rows };
}

function rollbackDrillManifest(clock: RollbackGateClock): RollbackDrillManifest {
  const classification = rollbackDrillClassification();
  const anchorState: RollbackLaneState = {
    facts: ['sealed-anchor-fact'],
    artifacts: { seed: 'stable' },
    completedSteps: 1,
  };
  const anchorId = 'deep-review-rollback-anchor';
  const anchorDigest = rollbackAnchorDigest(anchorId, anchorState);
  const bindings: DrillInputBindings = {
    adapterRegistry: digest('rollback-adapter-registry'),
    base: digest('rollback-base'),
    candidate: digest('rollback-candidate'),
    classificationManifest: classificationManifestDigest(classification),
    contractDefectLedger: digest('rollback-contract-defect-ledger'),
    eventSchemaCensus: digest('rollback-event-schema-census'),
    fingerprintContract: digest('rollback-fingerprint-contract'),
    modeRegistry: digest('rollback-mode-registry'),
    parityCertificate: digest('rollback-parity-certificate'),
    phaseTree: digest('rollback-phase-tree'),
    policy: digest('rollback-policy'),
    projectionContract: digest('rollback-projection-contract'),
    receiptContract: digest('rollback-receipt-contract'),
    rollbackAsset: anchorDigest,
  };
  const now = clock.now().getTime();
  return {
    schemaVersion: ROLLBACK_DRILL_SCHEMA_VERSION,
    drillId: 'deep-review-rollback-gate-drill',
    mode: 'deep-review',
    baseSha: digest('rollback-base-commit').slice(0, 40),
    candidateSha: digest('rollback-candidate-commit').slice(0, 40),
    policyVersion: 'rollback-policy@1',
    verifierIdentity: 'rollback-gate-drill-verifier',
    startingAuthorityEpoch: 7,
    legacyWriterId: 'legacy-writer',
    spineWriterId: 'spine-writer',
    bindings,
    parityUnresolvedDivergences: 0,
    classification,
    rollbackAnchor: { anchorId, state: anchorState, digest: anchorDigest },
    workload: {
      factIds: ['continued-fact-a', 'continued-fact-b'],
      artifactName: 'result.json',
      artifactContent: '{"status":"complete"}',
    },
    rollbackWindow: {
      openedAt: new Date(now - 9 * 24 * 60 * 60 * 1_000).toISOString(),
      successfulAuthoritativeRuns: 5,
      minimumCalendarDays: 14,
      minimumSuccessfulRuns: 5,
      stricterDeadlineAt: new Date(now + 60 * 60 * 1_000).toISOString(),
    },
    fault: {
      fixture: RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH,
      expectedDetector: DetectorByFaultFixture[RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH],
      cutPoint: 'after-durable-spine-work',
      timeoutMs: 100,
    },
  };
}

async function phase014Evidence(
  classificationDigest: string,
): Promise<Readonly<{
  evidence: Phase014RollbackEvidenceInput;
  candidateSha: string;
  verifierIdentity: string;
  verifierVersion: string;
  rollbackAnchorDigest: string;
}>> {
  const clock = new RollbackGateClock();
  const manifest = rollbackDrillManifest(clock);
  const sandboxRoot = mkdtempSync(join(tmpdir(), 'deep-loop-rollback-drill-'));
  temporaryRoots.push(sandboxRoot);
  const protectedRoot = temporaryRoot('rollback-protected');
  const protectedFile = join(protectedRoot, 'live-authority.json');
  writeFileSync(protectedFile, '{"state":"legacy_authoritative","epoch":41}\n', { mode: 0o600 });
  const options: RollbackDrillOptions = {
    manifest,
    currentMode: 'deep-review',
    currentBindings: manifest.bindings,
    sandboxRoot,
    protectedPaths: [{ id: 'live-authority', path: protectedFile }],
    certificationProvider: ROLLBACK_PROVIDER,
    certificationProfile: ROLLBACK_PROFILE,
    clock,
  };
  const result = await runRollbackDrill(options);
  const currentBindings = Object.freeze({
    ...result.certificate.facts.bindings,
    classificationManifest: classificationDigest,
  });
  const facts = Object.freeze({
    ...result.certificate.facts,
    bindings: currentBindings,
    classificationDigest,
  });
  const certificate = await createRollbackDrillCertificate(
    facts,
    ROLLBACK_PROVIDER,
    ROLLBACK_PROFILE,
  );
  const certificatePath = writeImmutableRollbackCertificate(
    temporaryRoot('aligned-rollback-certificate'),
    'rollback-certificate.json',
    certificate,
  );
  return {
    evidence: {
      certificatePath,
      expectedMode: 'deep-review',
      currentBindings,
      certificationProvider: ROLLBACK_PROVIDER,
    },
    candidateSha: facts.candidateSha,
    verifierIdentity: facts.verifierIdentity,
    verifierVersion: certificate.certification.verifier_version,
    rollbackAnchorDigest: facts.bindings.rollbackAsset,
  };
}

function healthyAggregate(): HealthAggregate {
  return {
    schemaVersion: 1,
    aggregateId: 'rollback-gate-health-aggregate',
    state: 'healthy',
    severity: 'info',
    observationId: 'rollback-gate-health-observation',
    activeSignalIds: [],
    policyVersion: 'health-policy@1',
    policyDigest: digest('health-policy'),
  };
}

function successfulWindowExecutions(count = 5) {
  return Array.from({ length: count }, (_, index) => ({
    executionId: `successful-execution-${index + 1}`,
    authorityState: 'new_authoritative_reversible' as const,
    authorityEpoch: 2,
    result: 'trusted-completion' as const,
    certificateDigest: hash(`successful-certificate-${index + 1}`),
  }));
}

let validModeGateInputPromise: Promise<DeepReviewModeGateInput<ReplayProjection>> | null = null;

async function buildValidModeGateInput(): Promise<DeepReviewModeGateInput<ReplayProjection>> {
  const parity = await parityFixture(true);
  const certificate = await certificateVerificationInput();
  const classification = classificationManifest();
  const rollback = await phase014Evidence(classification.finalDigest);
  return {
    ...emptyModeGateInput(),
    candidateSha: rollback.candidateSha,
    verifierIdentity: rollback.verifierIdentity,
    verifierVersion: rollback.verifierVersion,
    parity: {
      manifest: parity.manifest,
      modeGateInput: parity.modeGateInput,
      receipts: [parity.receipt],
      authorizationAuditRootDirectory: parity.harness.rootDirectory,
      authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    },
    sealedArtifacts: {
      store: certificate.verificationInput.artifactStore,
      bindings: certificate.artifactBindings,
    },
    certificates: { verificationInput: certificate.verificationInput },
    resumeEvidence: resumeEvidence(),
    lifecycle: lifecycleRows(
      parity.receipt,
      certificate.verificationInput,
      certificate.artifactBindings,
    ),
    rollback: {
      phase014Evidence: rollback.evidence,
      classificationManifest: classification,
      healthAggregate: healthyAggregate(),
      rollbackAnchorDigest: rollback.rollbackAnchorDigest,
    },
    rollbackWindow: {
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      authenticatedExecutions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    },
  };
}

async function validModeGateInput(): Promise<DeepReviewModeGateInput<ReplayProjection>> {
  validModeGateInputPromise ??= buildValidModeGateInput();
  return validModeGateInputPromise;
}

async function genuineGateEvidence(): Promise<Readonly<{
  gateInput: DeepReviewModeGateInput<ReplayProjection>;
  certificate: DeepReviewModeMigrationCertificate;
}>> {
  const gateInput = await validModeGateInput();
  const result = await new DeepReviewModeMigrationGate().evaluate(gateInput);
  if (result.certificate === null) throw new Error('Expected a genuine mode-gate certificate');
  return { gateInput, certificate: result.certificate };
}

function proofFor(rowId: string, disposition: keyof typeof InflightDisposition): DispositionProof {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return { kind: 'upcast', adjacentChainComplete: true, pure: true, deterministic: true,
        sideEffectFree: true, sourceBytesPreserved: true, immutableIdentityPreserved: true,
        replayEquivalent: true, sourceBytesDigest: hash(`${rowId}:source`),
        effectiveStateDigest: hash(`${rowId}:effective`), registryDigest: hash(`${rowId}:registry`),
        chainIdentitiesDigest: hash(`${rowId}:chain`) };
    case InflightDisposition.PIN:
      return { kind: 'pin', legacyWriterSoleAuthority: true, legacyCompletionAvailable: true,
        boundedCompletion: true, timedOut: false, terminalBoundary: 'legacy-terminal-receipt',
        terminalReceiptRequired: true };
    case InflightDisposition.FORK:
      return { kind: 'fork', executionNamespace: `shadow-${rowId}`,
        effectNamespace: `effects-${rowId}`, shadowOnlySink: true,
        livePublicationEnabled: false, sourceStateUnchanged: true, authorityUnaffected: true,
        budgetsUnaffected: true };
    case InflightDisposition.MIGRATE:
      return { kind: 'migrate', quiescentCheckpoint: true, transactionalSnapshot: true,
        atomicImport: true, reversible: true, identityPreserved: true, orderPreserved: true,
        idempotencyPreserved: true, budgetsPreserved: true, receiptsPreserved: true,
        pendingWorkPreserved: true, checkpointDigest: hash(`${rowId}:checkpoint`),
        restorationReceiptDigest: hash(`${rowId}:restoration`) };
    case InflightDisposition.BLOCK:
      return { kind: 'block', veto: 'execution-control-must-drain' };
  }
}

function evidenceFor(row: StateBackendCensusRow): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES[
    row.id as keyof typeof FROZEN_CENSUS_ROW_POLICIES
  ];
  const pin = policy.disposition === InflightDisposition.PIN;
  const block = policy.disposition === InflightDisposition.BLOCK;
  return {
    rowId: row.id, isPresent: !block, stateDigest: hash(`${row.id}:state`),
    shapeVersion: '1', shapeStatus: 'registered', schemaDigest: hash(`${row.id}:schema`),
    lifecyclePoint: row.lifecycle, authorityState: 'legacy_authoritative', authorityEpoch: 7,
    mutability: row.mutability, leaseState: pin ? 'active' : 'none', activeLeaseCount: pin ? 1 : 0,
    leaseSetDigest: hash(`${row.id}:leases`), pendingEffectsState: pin ? 'active-legacy' : 'none',
    pendingEffectSetDigest: hash(`${row.id}:effects`), identityCoverage: true, orderCoverage: true,
    idempotencyCoverage: true, budgetCoverage: true, receiptCoverage: true,
    pendingWorkCoverage: true, isCorrupt: false,
    rollbackAnchor: { anchorId: `anchor-${row.id}`, digest: hash(`${row.id}:anchor`), retained: true,
      restorable: true, minimumRetentionDays: 14, minimumSuccessfulRuns: 5 },
    verifier: { verified: true, receiptDigest: hash(`${row.id}:verifier`),
      replayFingerprintDigest: policy.disposition === InflightDisposition.UPCAST
        ? hash(`${row.id}:replay`) : null,
      rollbackScenarioDigest: hash(`${row.id}:rollback`),
      parityCaseDigest: policy.disposition === InflightDisposition.FORK
        ? hash(`${row.id}:parity`) : null },
    proof: proofFor(row.id, policy.disposition),
  };
}

function classificationManifest(): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: 'deep-review-rollback-classification',
    classifiedAt: '2026-07-22T12:00:00Z',
    classifierBuildId: 'rollback-gate-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
}

function resumeEvidence(): DeepReviewResumeParityEvidence {
  const lease = { runId: 'run-1', sessionId: 'session-1', leaseId: 'lease-1', generation: 1,
    deadlineAt: '2026-07-23T12:00:00Z', remainingMs: 60_000, replayFingerprint: hash('replay') };
  const decision = {
    decisionVersion: 1, decisionId: 'decision-1', decisionDigest: hash('decision'),
    authority: 'dark-evidence-only', legacyAuthority: 'unchanged', productionCompletion: false,
    reuseDisposition: 'exact-reuse', compatibilityOutcome: 'exact', manifestDisposition: 'original',
    compatibility: [], passes: [], effects: [], invalidation: { targetChanged: false,
      reopenedDimensionIds: [], invalidatedFindingIds: [], reopenedObligationIds: [],
      convergenceReopened: false, reportReopened: false }, lease,
    priorCertificateDigest: hash('prior-certificate'), receiptChainDigest: hash('receipt-chain'),
    artifactSetDigest: hash('artifact-set'),
    decisionReason: 'Verified continuity evidence is reusable.',
  } as const;
  return {
    legacyDecision: decision,
    ledgerDecision: { ...decision, decisionId: 'decision-2', decisionDigest: hash('decision-2') },
    legacyEventTailDigest: hash('tail'), ledgerEventTailDigest: hash('tail'),
    legacyFreshProjectionFingerprint: hash('projection'),
    ledgerFreshProjectionFingerprint: hash('projection'),
  };
}

function resumeEvidenceWithDecision(
  overrides: Partial<DeepReviewResumeParityEvidence['legacyDecision']>,
): DeepReviewResumeParityEvidence {
  const evidence = resumeEvidence();
  return {
    ...evidence,
    legacyDecision: { ...evidence.legacyDecision, ...overrides },
    ledgerDecision: { ...evidence.ledgerDecision, ...overrides },
  };
}

function resumeEvidenceWithLedgerDecision(
  overrides: Partial<DeepReviewResumeParityEvidence['ledgerDecision']>,
): DeepReviewResumeParityEvidence {
  const evidence = resumeEvidence();
  return {
    ...evidence,
    ledgerDecision: { ...evidence.ledgerDecision, ...overrides },
  };
}

function migrationCertificate(): DeepReviewModeMigrationCertificate {
  const windowCore = { state: 'open' as const, elapsedCalendarDays: 1,
    successfulAuthoritativeExecutions: 0, minimumCalendarDays: 14 as const,
    minimumSuccessfulAuthoritativeExecutions: 5 as const, unresolvedEvidenceCount: 0,
    lowTraffic: false, windowClosed: false as const };
  const window = { ...windowCore, evaluationDigest: digest(windowCore) };
  const core = { schemaVersion: 1 as const, certificateKind: 'mode-migration-readiness' as const,
    mode: 'deep-review' as const, readiness: 'ready-for-phase-014-consideration' as const,
    candidateSha: CANDIDATE_SHA, baseSha: BASE_SHA, sharedContractDigest: hash('shared'),
    writeSetDigest: hash('write-set'), versions: { eventEnvelopeVersion: 1,
      eventSchemaVersion: 'event@1', reducerVersion: 'reducer@1', projectionVersion: 'projection@1' },
    fixtureIds: ['fixture-1'], streamDigests: [hash('stream')], artifactDigests: [hash('artifact')],
    receiptDigests: [hash('receipt')], runCertificateDigest: hash('run-certificate'),
    replayFingerprint: hash('replay-fingerprint'), verifierIdentity: 'external-verifier', verifierVersion: '1',
    authorityState: 'legacy_authoritative' as const, authorityEpoch: 1,
    rollbackAnchorDigest: hash('rollback-anchor'), rollbackWindow: window, dispositions: [],
    unresolvedRiskIds: [], authorityMutation: false as const, rollbackWindowClosed: false as const,
    cutoverCertificate: false as const };
  return Object.freeze({ ...core, certificateDigest: digest(core) });
}

function lifecycleRows(
  parityReceipt: DeepReviewParityReceipt,
  verificationInput: DeepReviewOfflineVerificationInput<ReplayProjection>,
  artifactBindings: readonly DeepReviewSealedArtifactBinding[],
): readonly DeepReviewLifecycleEvidenceRow[] {
  const bundle = parseDeepReviewCertificateBundle(verificationInput.bundle);
  const identities = [
    {
      fixtureId: parityReceipt.fixtureId,
      eventDigest: parityReceipt.ledgerStreamDigest,
      receiptDigest: parityReceipt.receiptDigest,
    },
    ...bundle.receipts.map((entry) => ({
      fixtureId: entry.facts.transitionId,
      eventDigest: entry.facts.resultEventDigest,
      receiptDigest: entry.receiptDigest,
    })),
    ...artifactBindings.map((entry) => ({
      fixtureId: entry.artifactKind,
      eventDigest: entry.reference.content_digest,
      receiptDigest: entry.reference.descriptor_digest,
    })),
  ];
  const kinds: readonly DeepReviewLifecycleEvidenceRow['kind'][] = [
    'init', 'scope', 'dimension-pass', 'candidate-evidence', 'adjudication-findings',
    'severity-projection', 'convergence', 'synthesis', 'review-report', 'crash-resume',
    'blocked-stop', 'continuity-handoff',
  ];
  return kinds.map((kind, index) => {
    const identity = identities[index];
    if (identity === undefined) throw new Error('Lifecycle evidence fixture is incomplete');
    return { kind, ...identity, status: 'covered' };
  });
}

function emptyModeGateInput(): DeepReviewModeGateInput<JsonObject> {
  return {
    candidateSha: CANDIDATE_SHA, baseSha: BASE_SHA, sharedContractDigest: hash('shared'),
    writeSetDigest: hash('write-set'), versions: { eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-review-event@1', reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
      projectionVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION },
    verifierIdentity: 'external-verifier', verifierVersion: '1',
    authority: { state: 'legacy_authoritative', epoch: 1 }, parity: null, sealedArtifacts: null,
    certificates: null, resumeEvidence: null, lifecycle: [], rollback: null,
    rollbackWindow: { openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions: [], unresolvedEvidenceCount: 0, lowTraffic: false }, unresolvedRiskIds: [],
  };
}

function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

async function gatewayHarness(
  authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 },
  authorityUnavailable = false,
  omitIdentityResolver = false,
) {
  const rootDirectory = temporaryRoot('gateway');
  const registry = createFixtureEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'fixture-capability-policy',
    policyVersion: 1,
    evaluatorVersion: 'rollback-gate-tests@1',
    ruleIds: ['external-authority-required', 'externally-authorized-recovery'],
    evaluate: (
      input: Readonly<PolicyEvaluationInput>,
    ): PolicyEvaluationResult => {
      if (input.capabilityId === 'self-authorized-recovery') {
        return {
          verdict: 'deny',
          reasonCode: 'policy_denied',
          matchedRuleIds: ['external-authority-required'],
        };
      }
      if (input.capabilityId === 'write' || input.capabilityId === 'externally-authorized-recovery') {
        return {
          verdict: 'allow',
          reasonCode: 'allowed',
          matchedRuleIds: ['externally-authorized-recovery'],
        };
      }
      return { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: [] };
    },
  }]);
  const authorityProvider = authorityUnavailable
    ? () => { throw new Error('authority unavailable'); }
    : () => authority;
  const ledger = new AppendOnlyLedger({ rootDirectory, ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider }, registry);
  const gateway = new TransitionAuthorizationGateway({ rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider,
    identityResolver: omitIdentityResolver ? undefined : pinRequestIdentity,
  }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
}

function parityEvidenceBinding(
  fixtureId: string,
  streamDigest: string,
  caseEvidenceDigest: string,
  referenceSetDigest: string,
  attestationDigest: string,
): DeepReviewParityCertificateEvidenceBinding {
  return { fixtureId, legacyStreamDigest: streamDigest, ledgerStreamDigest: streamDigest,
    legacyProjectionFingerprint: hash('projection'), ledgerProjectionFingerprint: hash('projection'),
    caseEvidenceDigest, referenceSetDigest, attestationFinalDigests: [attestationDigest] };
}

function comparatorConfigDigest(): string {
  return digest({ comparatorVersion: DEEP_REVIEW_COMPARATOR_VERSION,
    lifecycleMap: DEEP_REVIEW_LIFECYCLE_EVENT_MAP,
    volatilityAllowlist: DEEP_REVIEW_VOLATILITY_ALLOWLIST,
    diffClasses: ['artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision'] });
}

function certificateBindings(manifestDigest: string, evidence: readonly DeepReviewParityCertificateEvidenceBinding[]): ParityCertificateBindings {
  return { candidate_build_digest: digest({ manifestDigest,
    schemaVersion: DEEP_REVIEW_SHADOW_PARITY_SCHEMA_VERSION }),
    harness_digest: digest({ legacy: 'runtime/lib/legacy-projections', ledger: 'runtime/lib/deep-review-reducers',
      shadow: 'runtime/lib/shadow-parity', resume: 'runtime/lib/deep-review-resume-adapter' }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({ reducerId: 'deep-review:shadow-parity-fold',
      reducerVersion: 'deep-review-shadow-parity-reducer@1',
      projectionVersion: DEEP_REVIEW_PARITY_PROJECTION_VERSION }),
    reducer_digest: digest({ reducerVersion: DEEP_REVIEW_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({ adapterVersion: DEEP_REVIEW_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: DEEP_REVIEW_LIFECYCLE_EVENT_MAP, certificateEvidenceBindings: evidence }),
    policy_version: 'deep-review-shadow-only@1' };
}

async function parityFixture(withAuthorizedAnchor: boolean) {
  const harness = await gatewayHarness();
  const event = createFixtureEvent(harness.registry, 1);
  const attestationDigest = hash('attestation');
  if (withAuthorizedAnchor) {
    const request = await createFixtureRequest(harness.ledger, event, harness.policies, 'parity-anchor', {
      mode: 'deep-review', evidenceDigest: attestationDigest,
    });
    expect((await harness.gateway.authorize(request)).verdict).toBe('allow');
  }
  const fixtureId = 'fixture-authenticated';
  const contractDigest = hash('contract');
  const manifest = compileParityCaseManifest({ baseSha: BASE_SHA,
    baselineRows: [{ scenarioId: fixtureId, mode: 'deep-review', contractDigest, disposition: 'protected' }],
    cases: [{ caseId: fixtureId, scenarioId: fixtureId, mode: 'deep-review', contractDigest,
      requiredObservations: ['ordered-transitions'], projectionIds: ['research'], timeoutMs: 1000,
      terminationPolicy: 'bounded' }] });
  const pass: ShadowParityCasePass = { ok: true, caseId: fixtureId, mode: 'deep-review',
    referenceSetDigest: hash('reference'), capsuleDigest: hash('capsule'), runs: [1, 2].map((runIndex) => ({
      runIndex, legacy: { finalDigest: attestationDigest, descriptorDigest: hash('descriptor'),
        storedDigest: hash('stored'), effectiveEventDigest: hash('effective'), projectionDigest: hash('projection'),
        replayContractDigest: hash('replay-contract'), sealedInputDigest: hash('sealed'), attestationSequence: runIndex,
        descriptor: {} as never }, dark: { finalDigest: attestationDigest, descriptorDigest: hash('descriptor'),
        storedDigest: hash('stored'), effectiveEventDigest: hash('effective'), projectionDigest: hash('projection'),
        replayContractDigest: hash('replay-contract'), sealedInputDigest: hash('sealed'), attestationSequence: runIndex,
        descriptor: {} as never }, observationDigest: hash('observation'), legacyProjectionDigest: hash('projection'),
      darkProjectionDigest: hash('projection'), runEvidenceDigest: hash(`run-${runIndex}`) })),
    evidenceDigest: hash('case-evidence'), openDivergenceCount: 0,
    authorityState: 'legacy_authoritative', authorityMutation: false };
  const binding = parityEvidenceBinding(fixtureId, event.canonicalDigest, pass.evidenceDigest,
    pass.referenceSetDigest, attestationDigest);
  const issued = issueParityCertificate({ manifest, mode: 'deep-review', caseResults: [pass],
    bindings: certificateBindings(manifest.manifestDigest, [binding]) });
  if (!issued.ok) throw new Error(issued.refusal.message);
  const body = { schemaVersion: DEEP_REVIEW_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `receipt-${fixtureId}`, baseSha: BASE_SHA, runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: 'deep-review-event@1', reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    comparatorVersion: DEEP_REVIEW_COMPARATOR_VERSION,
    projectionVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(), fixtureId,
    legacyStreamDigest: event.canonicalDigest, ledgerStreamDigest: event.canonicalDigest,
    legacyProjectionFingerprint: hash('projection'), ledgerProjectionFingerprint: hash('projection'),
    exitStatus: 'green' as const, diffDispositions: [], parityCertificate: issued.certificate,
    certificateEvidenceBindings: [binding], parityCertificateDigest: issued.certificate.certificate_digest,
    certificateStatus: 'issued' as const, certificateRefusalCode: null, genericDivergenceId: null,
    genericDivergenceClass: null, authorityState: 'legacy-authoritative' as const,
    authorityMutation: false as const, cutoverCertificate: false as const,
    reproducibilityDigest: digest({ baseSha: BASE_SHA, runManifestDigest: manifest.manifestDigest,
      fixtureId, legacyStreamDigest: event.canonicalDigest, ledgerStreamDigest: event.canonicalDigest,
      legacyProjectionFingerprint: hash('projection'), ledgerProjectionFingerprint: hash('projection'),
      diffDispositions: [] }) };
  const receipt: DeepReviewParityReceipt = { ...body, receiptDigest: digest(body) };
  const modeGateInput = createDeepReviewModeGateInput({ manifest, expectedFixtureIds: [fixtureId], receipts: [receipt] });
  expect(modeGateInput.schemaVersion).toBe(DEEP_REVIEW_MODE_GATE_INPUT_VERSION);
  return { harness, manifest, receipt, modeGateInput };
}

afterAll(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) {
      try {
        chmodSync(root, 0o700);
      } catch {
        // The root may already be removed by the substrate under test.
      }
      rmSync(root, { recursive: true, force: true });
    }
  }
});

describe('rollback window', () => {
  it('requires both minimums and excludes incomplete or abstained executions', () => {
    const executions = ['trusted-completion', 'trusted-completion', 'trusted-completion',
      'trusted-completion', 'incomplete', 'abstained'].map((result, index) => ({
      executionId: `execution-${index}`, authorityState: 'new_authoritative_reversible' as const,
      authorityEpoch: 2, result: result as 'trusted-completion' | 'incomplete' | 'abstained',
      certificateDigest: hash(`execution-${index}`) }));
    const early = evaluateDeepReviewRollbackWindow({ openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z', executions, authenticatedExecutions: executions,
      unresolvedEvidenceCount: 0, lowTraffic: false });
    expect(early).toMatchObject({ state: 'open', elapsedCalendarDays: 14,
      successfulAuthoritativeExecutions: 4, windowClosed: false });
    const readyExecutions = [...executions, {
        executionId: 'execution-6', authorityState: 'new_authoritative_reversible', authorityEpoch: 2,
        result: 'trusted-completion', certificateDigest: hash('execution-6') }];
    const ready = evaluateDeepReviewRollbackWindow({ openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z', executions: readyExecutions,
      authenticatedExecutions: readyExecutions,
      unresolvedEvidenceCount: 0, lowTraffic: false });
    expect(ready.state).toBe('eligible_to_close');
    expect(ready.windowClosed).toBe(false);
  });

  it('counts five identical execution rows once and keeps the window open', () => {
    const execution = successfulWindowExecutions(1)[0]!;
    const result = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: Array.from({ length: 5 }, () => ({ ...execution })),
      authenticatedExecutions: [execution],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({
      state: 'open',
      successfulAuthoritativeExecutions: 1,
      windowClosed: false,
    });
  });

  it('counts one shared certificate digest once across five execution ids', () => {
    const sharedCertificateDigest = hash('shared-successful-certificate');
    const executions = successfulWindowExecutions().map((entry) => ({
      ...entry,
      certificateDigest: sharedCertificateDigest,
    }));
    const result = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
      authenticatedExecutions: executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({
      state: 'open',
      successfulAuthoritativeExecutions: 1,
      windowClosed: false,
    });
  });

  it('counts one execution id once across five certificate digests', () => {
    const executions = successfulWindowExecutions().map((entry, index) => ({
      ...entry,
      executionId: 'shared-successful-execution',
      certificateDigest: hash(`ambiguous-successful-certificate-${index}`),
    }));
    const result = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
      authenticatedExecutions: executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({
      state: 'open',
      successfulAuthoritativeExecutions: 1,
      windowClosed: false,
    });
  });

  it('does not count execution rows without matching authenticated evidence', () => {
    const executions = successfulWindowExecutions(2);
    const result = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
      authenticatedExecutions: [],
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    } as never);

    expect(result).toMatchObject({
      state: 'open',
      successfulAuthoritativeExecutions: 0,
      windowClosed: false,
    });
  });

  it('closes neither authority nor evidence while five distinct executions become eligible', () => {
    const result = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      authenticatedExecutions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({
      state: 'eligible_to_close',
      successfulAuthoritativeExecutions: 5,
      windowClosed: false,
    });
  });

  it('binds the complete rollback-window input when equivalent summaries use different evidence', () => {
    const first = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      authenticatedExecutions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const second = evaluateDeepReviewRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions().map((entry, index) => ({
        ...entry,
        executionId: `replacement-execution-${index + 1}`,
        certificateDigest: hash(`replacement-certificate-${index + 1}`),
      })),
      authenticatedExecutions: successfulWindowExecutions().map((entry, index) => ({
        ...entry,
        executionId: `replacement-execution-${index + 1}`,
        certificateDigest: hash(`replacement-certificate-${index + 1}`),
      })),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });

    expect(second).toMatchObject({
      state: first.state,
      elapsedCalendarDays: first.elapsedCalendarDays,
      successfulAuthoritativeExecutions: first.successfulAuthoritativeExecutions,
    });
    expect(second.evaluationDigest).not.toBe(first.evaluationDigest);
  });
});

describe('independent parity authentication', () => {
  it('blocks a forged green handoff without audit evidence and accepts the real gateway anchor', async () => {
    const gate = new DeepReviewModeMigrationGate();
    for (const withAuthorizedAnchor of [false, true]) {
      const fixture = await parityFixture(withAuthorizedAnchor);
      const input = { ...emptyModeGateInput(), parity: { manifest: fixture.manifest,
        modeGateInput: fixture.modeGateInput, receipts: [fixture.receipt],
        authorizationAuditRootDirectory: fixture.harness.rootDirectory,
        authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID } };
      const result = await gate.evaluate(input);
      const parity = result.dispositions.find((entry) => entry.input === 'shadow_parity');
      expect(parity?.disposition).toBe(withAuthorizedAnchor ? 'ready' : 'blocked');
      expect(parity?.reasonCode).toBe(withAuthorizedAnchor ? null : 'AUTHORIZED_PARITY_EVIDENCE_MISSING');
    }
  });

  it('maps every absent gate-table link to its specified fail-closed disposition', async () => {
    const result = await new DeepReviewModeMigrationGate().evaluate(emptyModeGateInput());
    expect(result.certificate).toBeNull();
    expect(result.dispositions.map((entry) => [entry.input, entry.disposition])).toEqual([
      ['shadow_parity', 'blocked'], ['sealed_artifacts', 'not_ready'],
      ['certificates_receipts', 'blocked'], ['lifecycle_resume', 'blocked'],
      ['rollback_readiness', 'rollback_required'],
    ]);
  });

  it('turns malformed verifier and rollback-window inputs into blocking dispositions', async () => {
    const input = { ...emptyModeGateInput(), certificates: { verificationInput: {} as never },
      rollbackWindow: { ...emptyModeGateInput().rollbackWindow, evaluatedAt: 'not-a-time' } };
    await expect(new DeepReviewModeMigrationGate().evaluate(input)).resolves.toMatchObject({
      verdict: 'rollback_required',
      certificate: null,
      dispositions: expect.arrayContaining([
        expect.objectContaining({ input: 'certificates_receipts', disposition: 'blocked',
          reasonCode: 'CERTIFICATE_RECEIPT_INVALID' }),
        expect.objectContaining({ input: 'rollback_readiness', disposition: 'rollback_required',
          reasonCode: 'EVIDENCE_MALFORMED' }),
      ]),
    });
  });

  it('returns a typed blocked result for a null top-level caller value', async () => {
    await expect(new DeepReviewModeMigrationGate().evaluate(null as never)).resolves.toMatchObject({
      verdict: 'blocked',
      certificate: null,
      dispositions: expect.arrayContaining([
        expect.objectContaining({ reasonCode: 'EVIDENCE_MALFORMED' }),
      ]),
    });
  });

  it('does not adopt the authenticated parity handoff exit status as authority', async () => {
    const input = await validModeGateInput();
    const reported = input.parity!.modeGateInput as Record<string, unknown>;
    const { gateInputDigest: ignoredDigest, ...reportedBody } = reported;
    void ignoredDigest;
    const blockedBody = {
      ...reportedBody,
      exitStatus: 'blocked',
      blockingReasonCode: 'FIXTURE_FAILURE',
    };
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      parity: {
        ...input.parity!,
        modeGateInput: {
          ...blockedBody,
          gateInputDigest: digest(blockedBody),
        },
      },
    });

    expect(result).toMatchObject({ verdict: 'pass' });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      disposition: 'ready',
      reasonCode: null,
    }));
  });
});

describe('complete mode migration gate', () => {
  it('issues a readiness certificate bound to every reverified evidence bucket', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate(input);
    const bundle = parseDeepReviewCertificateBundle(
      input.certificates!.verificationInput.bundle,
    );
    const expectedRollbackWindow = evaluateDeepReviewRollbackWindow(input.rollbackWindow);
    const expectedArtifactDigests = input.sealedArtifacts!.bindings
      .map((entry) => entry.reference.qualified_digest)
      .sort();
    const expectedReceiptDigests = [
      ...input.parity!.receipts.map((entry) => (entry as DeepReviewParityReceipt).receiptDigest),
      ...bundle.receipts.map((entry) => entry.receiptDigest),
    ].sort();

    expect(result.verdict).toBe('pass');
    expect(result.certificate).not.toBeNull();
    expect(result.certificate).toMatchObject({
      candidateSha: input.candidateSha,
      baseSha: input.baseSha,
      sharedContractDigest: input.sharedContractDigest,
      writeSetDigest: input.writeSetDigest,
      versions: input.versions,
      fixtureIds: [input.parity!.manifest.cases[0]!.caseId],
      streamDigests: [(input.parity!.receipts[0] as DeepReviewParityReceipt).ledgerStreamDigest],
      artifactDigests: expectedArtifactDigests,
      receiptDigests: expectedReceiptDigests,
      runCertificateDigest: bundle.certificate.certificateDigest,
      replayFingerprint: bundle.certificate.body.replayFingerprint,
      rollbackWindow: expectedRollbackWindow,
      authorityMutation: false,
      rollbackWindowClosed: false,
      cutoverCertificate: false,
    });
    expect(result.certificate?.dispositions).toHaveLength(5);
    expect(result.certificate?.dispositions.every((entry) => entry.disposition === 'ready')).toBe(true);
  });

  it.each([
    ['one unresolved risk', ['unresolved-risk-1']],
    ['multiple unresolved risks', ['risk-alpha', 'risk-beta', 'risk-gamma']],
    ['a malformed risk alongside a valid risk', ['', 'valid-token']],
  ] as const)('blocks an otherwise passing gate with %s', async (_label, unresolvedRiskIds) => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      unresolvedRiskIds,
    });

    expect(result.verdict).not.toBe('pass');
    expect(result.verdict).toBe('blocked');
    expect(result.certificate).toBeNull();
  });

  it.each([
    ['event schema version', { eventSchemaVersion: 'fabricated-event-schema@999' }],
    ['reducer version', { reducerVersion: 'fabricated-reducer@999' }],
    ['projection version', { projectionVersion: 'fabricated-projection@999' }],
    ['complete version tuple', {
      eventSchemaVersion: 'fabricated-event-schema@999',
      reducerVersion: 'fabricated-reducer@999',
      projectionVersion: 'fabricated-projection@999',
    }],
  ] as const)('rejects a top-level %s not carried by every parity receipt', async (_label, overrides) => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      versions: { ...input.versions, ...overrides },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('accepts the exact event, reducer, and projection versions carried by parity receipts', async () => {
    const input = await validModeGateInput();
    const receipt = input.parity!.receipts[0] as DeepReviewParityReceipt;
    const result = await new DeepReviewModeMigrationGate().evaluate(input);

    expect(input.versions).toMatchObject({
      eventSchemaVersion: receipt.eventSchemaVersion,
      reducerVersion: receipt.reducerVersion,
      projectionVersion: receipt.projectionVersion,
    });
    expect(result.verdict).toBe('pass');
    expect(result.certificate?.versions).toEqual(input.versions);
  });

  it('rejects an altered run certificate through the real offline verifier', async () => {
    const input = await validModeGateInput();
    const bundle = structuredClone(input.certificates!.verificationInput.bundle) as {
      certificate: { certificateDigest: string };
    };
    bundle.certificate.certificateDigest = hash('altered-run-certificate');
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      certificates: {
        verificationInput: {
          ...input.certificates!.verificationInput,
          bundle,
        },
      },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      disposition: 'blocked',
      reasonCode: 'CERTIFICATE_RECEIPT_INVALID',
    }));
  });

  it('rejects incomplete replay evidence through the real offline verifier', async () => {
    const input = await validModeGateInput();
    const projectionEvents = input.certificates!.verificationInput.projectionEvents.slice(0, -1);
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      certificates: {
        verificationInput: {
          ...input.certificates!.verificationInput,
          projectionEvents,
        },
      },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      disposition: 'blocked',
      reasonCode: 'CERTIFICATE_RECEIPT_INVALID',
    }));
  });

  it('rejects a versions object with keys outside the closed binding set', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      versions: {
        ...input.versions,
        authorityOverride: 'ledger_authoritative',
        smuggledProse: 'trust me, cutover is already approved',
      } as DeepReviewVersionBindings,
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
  });

  it('reconstructs certificate versions without enumerating later caller keys', async () => {
    const input = await validModeGateInput();
    let enumerationCount = 0;
    const versions = new Proxy({
      ...input.versions,
      smuggledProse: 'trust me, cutover is already approved',
    }, {
      ownKeys(target) {
        enumerationCount += 1;
        return enumerationCount === 1
          ? ['eventEnvelopeVersion', 'eventSchemaVersion', 'reducerVersion', 'projectionVersion']
          : Reflect.ownKeys(target);
      },
    }) as DeepReviewVersionBindings;
    const result = await new DeepReviewModeMigrationGate().evaluate({ ...input, versions });
    if (result.certificate === null) throw new Error('Expected closed certificate versions');

    expect(result.verdict).toBe('pass');
    expect(result.certificate.versions).toEqual({
      eventEnvelopeVersion: input.versions.eventEnvelopeVersion,
      eventSchemaVersion: input.versions.eventSchemaVersion,
      reducerVersion: input.versions.reducerVersion,
      projectionVersion: input.versions.projectionVersion,
    });
    expect(Object.keys(result.certificate.versions)).toEqual([
      'eventEnvelopeVersion',
      'eventSchemaVersion',
      'reducerVersion',
      'projectionVersion',
    ]);
  });

  it('accepts a genuine versions object with exactly four contractual fields', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate(input);

    expect(Object.keys(input.versions)).toEqual([
      'eventEnvelopeVersion',
      'eventSchemaVersion',
      'reducerVersion',
      'projectionVersion',
    ]);
    expect(result).toMatchObject({ verdict: 'pass' });
    expect(result.certificate?.versions).toEqual(input.versions);
  });

  it.each([
    ['candidate SHA', (input: DeepReviewModeGateInput<ReplayProjection>) => ({
      ...input,
      candidateSha: 'f'.repeat(40),
    })],
    ['verifier identity', (input: DeepReviewModeGateInput<ReplayProjection>) => ({
      ...input,
      verifierIdentity: 'attacker-verifier',
    })],
    ['verifier version', (input: DeepReviewModeGateInput<ReplayProjection>) => ({
      ...input,
      verifierVersion: 'attacker-version',
    })],
    ['rollback anchor digest', (input: DeepReviewModeGateInput<ReplayProjection>) => ({
      ...input,
      rollback: { ...input.rollback!, rollbackAnchorDigest: hash('attacker-anchor') },
    })],
    ['classification digest', (input: DeepReviewModeGateInput<ReplayProjection>) => ({
      ...input,
      rollback: {
        ...input.rollback!,
        classificationManifest: createClassificationManifest({
          classificationId: 'attacker-classification',
          classifiedAt: '2026-07-22T12:00:00Z',
          classifierBuildId: 'rollback-gate-tests',
          censusBytes: CENSUS_BYTES,
          evidence: CENSUS.rows.map(evidenceFor),
        }).manifest,
      },
    })],
  ] as const)('rejects a caller-supplied %s that contradicts the verified rollback drill', async (
    _label,
    mutate,
  ) => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate(mutate(input));

    expect(result).toMatchObject({ verdict: 'rollback_required', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      disposition: 'rollback_required',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('rejects a caller-supplied authority epoch absent from verified transition receipts', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      authority: { ...input.authority, epoch: input.authority.epoch + 1 },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('rejects a caller-supplied envelope version absent from verified ledger events', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      versions: { ...input.versions, eventEnvelopeVersion: 999 },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('accepts the evidence values exactly proven by the verified rollback drill', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate(input);

    expect(result).toMatchObject({ verdict: 'pass' });
    expect(result.certificate).toMatchObject({
      candidateSha: input.candidateSha,
      verifierIdentity: input.verifierIdentity,
      verifierVersion: input.verifierVersion,
      authorityEpoch: input.authority.epoch,
      rollbackAnchorDigest: input.rollback!.rollbackAnchorDigest,
    });
  });

  it('binds the complete health aggregate rather than only its aggregate id', async () => {
    const input = await validModeGateInput();
    const original = await new DeepReviewModeMigrationGate().evaluate(input);
    const changedAggregate: HealthAggregate = {
      ...input.rollback!.healthAggregate,
      severity: 'warning',
      observationId: 'replacement-health-observation',
      activeSignalIds: [hash('replacement-health-signal')],
      policyVersion: 'replacement-health-policy@1',
      policyDigest: hash('replacement-health-policy'),
    };
    const changed = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      rollback: { ...input.rollback!, healthAggregate: changedAggregate },
    });
    const originalDisposition = original.dispositions.find(
      (entry) => entry.input === 'rollback_readiness',
    );
    const changedDisposition = changed.dispositions.find(
      (entry) => entry.input === 'rollback_readiness',
    );

    expect(changedAggregate.aggregateId).toBe(input.rollback!.healthAggregate.aggregateId);
    expect(changed).toMatchObject({ verdict: 'pass' });
    expect(changedDisposition?.evidenceDigest).not.toBe(originalDisposition?.evidenceDigest);
    expect(changed.certificate?.certificateDigest).not.toBe(original.certificate?.certificateDigest);
  });

  it('rejects twelve relabeled lifecycle rows sharing one fabricated identity', async () => {
    const input = await validModeGateInput();
    const lifecycle = input.lifecycle.map((row) => ({
      ...row,
      fixtureId: 'fabricated-fixture',
      eventDigest: hash('fabricated-event'),
      receiptDigest: hash('fabricated-receipt'),
    }));
    const result = await new DeepReviewModeMigrationGate().evaluate({ ...input, lifecycle });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'LIFECYCLE_INCOMPLETE',
    }));
  });

  it('rejects one genuine lifecycle identity reused under all required kinds', async () => {
    const input = await validModeGateInput();
    const genuine = input.lifecycle[0];
    if (genuine === undefined) throw new Error('Expected genuine lifecycle evidence');
    const lifecycle = input.lifecycle.map((row) => ({ ...genuine, kind: row.kind }));
    const result = await new DeepReviewModeMigrationGate().evaluate({ ...input, lifecycle });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'LIFECYCLE_INCOMPLETE',
    }));
  });

  it('rejects a distinct lifecycle row whose identity is absent from verified evidence', async () => {
    const input = await validModeGateInput();
    const lifecycle = input.lifecycle.map((row, index) => index === input.lifecycle.length - 1
      ? {
          ...row,
          fixtureId: 'unauthenticated-lifecycle-row',
          eventDigest: hash('unauthenticated-lifecycle-event'),
          receiptDigest: hash('unauthenticated-lifecycle-receipt'),
        }
      : row);
    const result = await new DeepReviewModeMigrationGate().evaluate({ ...input, lifecycle });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('accepts twelve distinct lifecycle identities derived from verified evidence', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate(input);

    expect(new Set(input.lifecycle.map((row) => row.eventDigest)).size).toBe(12);
    expect(new Set(input.lifecycle.map((row) => row.receiptDigest)).size).toBe(12);
    expect(result.verdict).toBe('pass');
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'ready',
      reasonCode: null,
    }));
  });

  it('withholds the certificate when a bucket is missing or stale', async () => {
    const input = await validModeGateInput();
    const missing = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      sealedArtifacts: null,
    });
    const stale = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      baseSha: '3'.repeat(40),
    });

    expect(missing).toMatchObject({ verdict: 'not_ready', certificate: null });
    expect(missing.dispositions).toContainEqual(expect.objectContaining({
      input: 'sealed_artifacts',
      disposition: 'not_ready',
      reasonCode: 'EVIDENCE_MISSING',
    }));
    expect(stale).toMatchObject({ verdict: 'blocked', certificate: null });
  });

  it('rejects an agreed blocked compatibility outcome as invalid resume evidence', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithDecision({ compatibilityOutcome: 'blocked' }),
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects an agreed manifest rejection as invalid resume evidence', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithDecision({ manifestDisposition: 'reject' }),
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('accepts agreed compatible restart evidence when every gate bucket is ready', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithDecision({
        compatibilityOutcome: 'compatible',
        manifestDisposition: 'restart',
      }),
    });

    expect(result.verdict).toBe('pass');
    expect(result.certificate).not.toBeNull();
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'ready',
      reasonCode: null,
    }));
  });

  it('rejects literal resume disagreement even when both values are individually safe', async () => {
    const input = await validModeGateInput();
    const evidence = resumeEvidence();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: {
        ...evidence,
        ledgerDecision: { ...evidence.ledgerDecision, compatibilityOutcome: 'compatible' },
      },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects safe ledger pass work absent from the legacy resume decision', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithLedgerDecision({
        passes: [{
          logicalPassId: 'ledger-only-pass',
          iterationId: 'iteration-1',
          dimensionId: 'correctness',
          passNumber: 1,
          manifestRevision: 'manifest-1',
          retryKey: 'retry-ledger-only-pass',
          disposition: 'reexecute',
          attemptId: 'ledger-only-attempt',
          evidenceEventIds: ['ledger-only-event'],
          decisionReason: 'The ledger path reports work absent from the legacy path.',
        }],
      }),
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects safe ledger effect work absent from the legacy resume decision', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithLedgerDecision({
        effects: [{
          effectId: 'ledger-only-effect',
          logicalEffectId: 'ledger-only-logical-effect',
          applicationState: 'not-applied',
          disposition: 'reexecute',
          attemptRefs: ['ledger-only-effect-attempt'],
          nextAttemptId: null,
          decisionReason: 'The ledger path reports work absent from the legacy path.',
        }],
      }),
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects a safe ledger compatibility migration absent from the legacy decision', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithLedgerDecision({
        compatibility: [{
          component: 'adapter',
          persistedVersion: 'adapter@1',
          installedVersion: 'adapter@2',
          outcome: 'migrate',
          revision: 'compatibility@2',
          decisionReason: 'The ledger path reports a migration absent from the legacy path.',
        }],
      }),
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects ledger invalidation and synthesis reopening absent from the legacy decision', async () => {
    const input = await validModeGateInput();
    const evidence = resumeEvidence();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: {
        ...evidence,
        ledgerDecision: {
          ...evidence.ledgerDecision,
          invalidation: {
            targetChanged: true,
            reopenedDimensionIds: ['correctness'],
            invalidatedFindingIds: ['finding-ledger-only'],
            reopenedObligationIds: ['obligation-ledger-only'],
            convergenceReopened: true,
            reportReopened: true,
          },
        },
      },
    });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'RESUME_INVALID',
    }));
  });

  it('accepts structurally identical safe resume decisions as the positive control', async () => {
    const input = await validModeGateInput();
    const result = await new DeepReviewModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidence(),
    });

    expect(result).toMatchObject({ verdict: 'pass' });
    expect(result.certificate).not.toBeNull();
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'ready',
      reasonCode: null,
    }));
  });

  it('rejects unsafe component, pass, and effect resume dispositions', async () => {
    const input = await validModeGateInput();
    const unsafeDecisions: readonly Partial<DeepReviewResumeParityEvidence['legacyDecision']>[] = [
      { compatibility: [{ component: 'adapter', persistedVersion: '1', installedVersion: '2',
        outcome: 'pin-old-runtime', revision: 'compatibility@1',
        decisionReason: 'Only the pinned runtime can resume this state.' }] },
      { passes: [{ logicalPassId: 'pass-1', iterationId: 'iteration-1',
        dimensionId: 'correctness', passNumber: 1, manifestRevision: 'manifest-1',
        retryKey: 'retry-1', disposition: 'reject', attemptId: null,
        evidenceEventIds: [], decisionReason: 'Branch resume is unsafe.' }] },
      { effects: [{ effectId: 'effect-1', logicalEffectId: 'logical-effect-1',
        applicationState: 'unknown', disposition: 'blocked', attemptRefs: [], nextAttemptId: null,
        decisionReason: 'Effect state cannot be reconciled safely.' }] },
    ];

    for (const decision of unsafeDecisions) {
      const result = await new DeepReviewModeMigrationGate().evaluate({
        ...input,
        resumeEvidence: resumeEvidenceWithDecision(decision),
      });
      expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
      expect(result.dispositions).toContainEqual(expect.objectContaining({
        input: 'lifecycle_resume',
        disposition: 'blocked',
        reasonCode: 'RESUME_INVALID',
      }));
    }
  });
});

describe('externally authorized non-destructive rollback', () => {
  interface RollbackFixtureClaims {
    readonly reportedAuthorityState?: string;
    readonly authorizedAuthorityState?: string;
    readonly reportedConfigurationVersion?: string;
    readonly authorizedConfigurationVersion?: string;
    readonly reportedWriterResource?: ProtectedResourceIdentity;
    readonly authorizedWriterResource?: ProtectedResourceIdentity;
    readonly reportedStaleWriterFenceToken?: number;
    readonly reportedRollbackAnchorDigest?: string;
    readonly authorizedRollbackAnchorDigest?: string;
    readonly omitIdentityResolver?: boolean;
    readonly transformReportedStaleWriterLease?: (
      lease: NonNullable<DeepReviewRollbackRequest['staleWriterLease']>,
    ) => unknown;
  }

  async function rollbackRequestFixture(
    capabilityId = 'write',
    destructiveIntent: DeepReviewRollbackRequest['destructiveIntent'] = 'none',
    operation: NonNullable<DeepReviewRollbackRequest['operation']> = 'rollback',
    gatewayUnavailable = false,
    certificateProvenance: 'genuine' | 'forged' = 'genuine',
    preparedGateEvidence?: Awaited<ReturnType<typeof genuineGateEvidence>>,
    reportedCounts: RetainedCounts = DEFAULT_RETAINED_COUNTS,
    authorizedCounts: RetainedCounts = reportedCounts,
    claims: RollbackFixtureClaims = {},
  ) {
    const authority: AuthoritySnapshot = { state: 'new_authoritative_reversible', epoch: 1 };
    const currentAuthority = {
      state: claims.reportedAuthorityState ?? authority.state,
      epoch: authority.epoch,
    };
    const configurationVersion = claims.reportedConfigurationVersion ?? 'rollback-policy@1';
    const harness = await gatewayHarness(authority, gatewayUnavailable, claims.omitIdentityResolver === true);
    const coordinator = new FencedLeaseCoordinator({ rootDirectory: temporaryRoot('fencing'), operationTimeoutMs: 1000 });
    const writerResource = claims.reportedWriterResource ?? {
      kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'deep-review-ledger-writer' },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    } as const;
    const issuedStaleWriterLease = await coordinator.acquire({ resource: writerResource, ownerId: 'stale-ledger-writer',
      correlationId: 'stale-ledger-writer', ttlMs: 60_000, acquireTimeoutMs: 1000 });
    await coordinator.release(issuedStaleWriterLease);
    const staleWriterLease = claims.transformReportedStaleWriterLease
      ? claims.transformReportedStaleWriterLease(issuedStaleWriterLease)
      : (claims.reportedStaleWriterFenceToken === undefined
        ? issuedStaleWriterLease
        : Object.freeze({
          ...issuedStaleWriterLease,
          fenceToken: claims.reportedStaleWriterFenceToken,
        }));
    const gateEvidence = preparedGateEvidence ?? await genuineGateEvidence();
    const gateInput = gateEvidence.gateInput;
    const certificate = certificateProvenance === 'genuine'
      ? gateEvidence.certificate
      : migrationCertificate();
    const classification = classificationManifest();
    const resume = resumeEvidence();
    const rollbackReason = 'Health degeneration requires a non-destructive legacy restoration rehearsal.';
    const rollbackAnchorDigest = claims.reportedRollbackAnchorDigest
      ?? certificate.rollbackAnchorDigest;
    const evidenceDigest = digest({
      configurationVersion: claims.authorizedConfigurationVersion ?? configurationVersion,
      operation,
      rollbackReason,
      currentAuthorityState: claims.authorizedAuthorityState ?? currentAuthority.state,
      currentAuthorityEpoch: currentAuthority.epoch,
      gateCertificateDigest: certificate.certificateDigest,
      classificationDigest: classification.finalDigest, resumeEvidenceDigest: digest(resume),
      writerResourceDigest: canonicalizeProtectedResource(
        claims.authorizedWriterResource ?? writerResource,
      ).resourceDigest,
      staleWriterLeaseDigest: digest(staleWriterLease),
      rollbackAnchorDigest: claims.authorizedRollbackAnchorDigest ?? rollbackAnchorDigest,
      ...authorizedCounts });
    const event = createFixtureEvent(harness.registry, 1);
    const authorizationRequest = await createFixtureRequest(harness.ledger, event, harness.policies,
      `rollback-${capabilityId}`, { mode: 'deep-review', capabilityId, evidenceDigest });
    const rollbackSwitch = new DeepReviewRollbackSwitch({ gateway: harness.gateway,
      fencingCoordinator: coordinator });
    const input = { configurationVersion, operation,
      currentAuthority, expectedAuthorityEpoch: 1, gateCertificate: certificate,
      gateInput, authorizationRequest, rollbackReason, admissionState: 'frozen',
      classificationManifest: classification,
      resumeEvidence: resume, writerResource, staleWriterLease, destructiveIntent,
      ...reportedCounts, rollbackAnchorDigest } as DeepReviewRollbackRequest;
    return { input, rollbackSwitch, coordinator };
  }

  async function request(
    capabilityId = 'write',
    destructiveIntent: DeepReviewRollbackRequest['destructiveIntent'] = 'none',
    operation: NonNullable<DeepReviewRollbackRequest['operation']> = 'rollback',
    gatewayUnavailable = false,
    certificateProvenance: 'genuine' | 'forged' = 'genuine',
    preparedGateEvidence?: Awaited<ReturnType<typeof genuineGateEvidence>>,
  ) {
    const fixture = await rollbackRequestFixture(
      capabilityId,
      destructiveIntent,
      operation,
      gatewayUnavailable,
      certificateProvenance,
      preparedGateEvidence,
    );
    return fixture.rollbackSwitch.requestRollback(fixture.input);
  }

  function malformedEvidence<T extends object>(
    value: T,
    variant: 'circular' | 'non-finite',
  ): T {
    const malformed = { ...value } as Record<string, unknown>;
    malformed.malformedEvidence = variant === 'circular'
      ? malformed
      : Number.POSITIVE_INFINITY;
    return malformed as unknown as T;
  }

  it('denies every self-authorized recovery class in the real gateway and lets the external control reach fencing', async () => {
    const gateEvidence = await genuineGateEvidence();
    for (const operation of ['rollback', 'unquarantine', 'verifier-replacement', 'authority-restoration'] as const) {
      const denied = await request(
        'self-authorized-recovery',
        'none',
        operation,
        false,
        'genuine',
        gateEvidence,
      );
      expect(denied).toMatchObject({ disposition: 'denied', reasonCode: 'AUTHORIZATION_DENIED',
        authorityState: 'legacy_authoritative', ledgerAuthority: 'denied' });
      expect(denied.gatewayDecisionId).toMatch(/^decision-/u);
    }
    const allowed = await request(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      gateEvidence,
    );
    expect(allowed).toMatchObject({ disposition: 'authorized', reasonCode: null,
      authorityState: 'legacy_authoritative', ledgerAuthority: 'denied' });
    expect(allowed.certificate).toMatchObject({ admissionFrozen: true, staleWriterDenied: true,
      eventDeletionCount: 0, artifactRewriteCount: 0, restoredAuthorityEpoch: 2,
      authorityMutation: false, phase014RestorationRequired: true });
  });

  it('rejects a self-consistent invented migration certificate and accepts the gate-issued control', async () => {
    const gateEvidence = await genuineGateEvidence();
    await expect(request(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'forged',
      gateEvidence,
    ))
      .resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'ABSENT_GATE_CERTIFICATE',
        certificate: null,
      });
    await expect(request(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      gateEvidence,
    ))
      .resolves.toMatchObject({
        disposition: 'authorized',
        reasonCode: null,
        certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
      });
  });

  it('resolves malformed gate certificates to a fail-closed denial', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const gateCertificate = fixture.input.gateCertificate;
    if (!gateCertificate) throw new Error('Expected a genuine gate certificate');

    for (const variant of ['circular', 'non-finite'] as const) {
      await expect(fixture.rollbackSwitch.requestRollback({
        ...fixture.input,
        gateCertificate: malformedEvidence(gateCertificate, variant),
      })).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'ABSENT_GATE_CERTIFICATE',
        certificate: null,
      });
    }
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
    });
  });

  it('resolves malformed resume evidence to a fail-closed denial', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const resume = fixture.input.resumeEvidence;
    if (!resume) throw new Error('Expected rollback resume evidence');

    for (const variant of ['circular', 'non-finite'] as const) {
      await expect(fixture.rollbackSwitch.requestRollback({
        ...fixture.input,
        resumeEvidence: malformedEvidence(resume, variant),
      })).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'EVIDENCE_INCOMPLETE',
        certificate: null,
      });
    }
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
    });
  });

  it('resolves malformed stale-writer evidence to a fail-closed denial', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const staleWriterLease = fixture.input.staleWriterLease;
    if (!staleWriterLease) throw new Error('Expected a stale-writer lease');

    for (const variant of ['circular', 'non-finite'] as const) {
      await expect(fixture.rollbackSwitch.requestRollback({
        ...fixture.input,
        staleWriterLease: malformedEvidence(staleWriterLease, variant),
      })).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'WRITER_FENCE_FAILED',
        certificate: null,
      });
    }
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
    });
  });

  it('resolves forbidden-prototype, unknown-field, and wrong-shape requests without throwing', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const inherited = Object.create(fixture.input) as DeepReviewRollbackRequest;
    const forbiddenKey = { ...fixture.input } as DeepReviewRollbackRequest;
    Object.defineProperty(forbiddenKey, '__proto__', {
      value: { notContractual: true },
      enumerable: true,
    });
    const cases = [
      null,
      [],
      inherited,
      forbiddenKey,
    ] as unknown as readonly DeepReviewRollbackRequest[];

    for (const input of cases) {
      await expect(fixture.rollbackSwitch.requestRollback(input)).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'EVIDENCE_INCOMPLETE',
        certificate: null,
      });
    }
  });

  it('denies a request anchor that differs from the reverified certificate anchor', async () => {
    const mismatchedAnchorDigest = hash('request-only-rollback-anchor');
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        reportedRollbackAnchorDigest: mismatchedAnchorDigest,
        authorizedRollbackAnchorDigest: mismatchedAnchorDigest,
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('binds retained counts to the external authorization and denies altered replay values', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
    );
    const authorized = await fixture.rollbackSwitch.requestRollback(fixture.input);
    const replayed = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      retainedEventCountBefore: 777,
      retainedEventCountAfter: 777,
    });

    expect(authorized).toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ retainedEventCount: 9, retainedArtifactCount: 6 }),
    });
    expect(replayed).toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('denies an exact authorization replay whose writer resource is swapped', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const unrelatedWriterResource = {
      kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'unrelated-ledger-writer' },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    } as const;

    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      writerResource: unrelatedWriterResource,
    })).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('denies a freshly authorized resource that is not the Deep Review ledger writer', async () => {
    const unrelatedWriterResource = {
      kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'unrelated-ledger-writer' },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    } as const;
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        reportedWriterResource: unrelatedWriterResource,
        authorizedWriterResource: unrelatedWriterResource,
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('binds the stale writer lease identity into the authorization evidence', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const replacementLease = await fixture.coordinator.acquire({
      resource: fixture.input.writerResource!,
      ownerId: 'replacement-stale-ledger-writer',
      correlationId: 'replacement-stale-ledger-writer',
      ttlMs: 60_000,
      acquireTimeoutMs: 1_000,
    });
    await fixture.coordinator.release(replacementLease);

    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      staleWriterLease: replacementLease,
    })).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('records the canonical fenced writer resource in the rollback certificate', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const writerResourceDigest = canonicalizeProtectedResource(
      fixture.input.writerResource,
    ).resourceDigest;

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ writerResourceDigest }),
    });
  });

  it('authorizes the canonical Deep Review writer as the positive control', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const writerResource = canonicalizeProtectedResource(fixture.input.writerResource);

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({
        writerResourceDigest: writerResource.resourceDigest,
        staleWriterDenied: true,
      }),
    });
  });

  it('denies an authorization-bound stale lease token that the coordinator never issued', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      { reportedStaleWriterFenceToken: 10_000 },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('denies an authorization-bound stale lease whose required fields have wrong types', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        transformReportedStaleWriterLease: (lease) => ({
          ...lease,
          leaseId: 987_654_321,
          ownerId: { claimed: 'stale-ledger-writer' },
          correlationId: ['stale-ledger-writer'],
          acquiredAt: 'not-an-iso-timestamp',
          renewedAt: 'not-an-iso-timestamp',
          expiresAt: 'not-an-iso-timestamp',
        }),
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('denies empty or non-string identities in an authorization-bound stale lease', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        transformReportedStaleWriterLease: (lease) => ({
          ...lease,
          leaseId: '',
          ownerId: 42,
          correlationId: {},
        }),
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('denies unparseable timestamps in an authorization-bound stale lease', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        transformReportedStaleWriterLease: (lease) => ({
          ...lease,
          renewedAt: 'not-an-iso-timestamp',
        }),
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('denies non-monotonic timestamps in an authorization-bound stale lease', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        transformReportedStaleWriterLease: (lease) => ({
          ...lease,
          acquiredAt: '2026-07-23T12:00:00.000Z',
          renewedAt: '2026-07-23T11:59:59.000Z',
          expiresAt: '2026-07-23T12:01:00.000Z',
        }),
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  });

  it('certifies a well-formed caller-attested predecessor only after strict supersession', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const staleWriterLease = fixture.input.staleWriterLease;
    if (!staleWriterLease) throw new Error('Expected the rollback fixture to include a stale lease');
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);

    expect(result).toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ staleWriterDenied: true }),
    });
    if (!result.certificate) throw new Error('Expected an authorized rollback certificate');
    expect(result.certificate.writerFenceToken).toBeGreaterThan(staleWriterLease.fenceToken);
  });

  it('keeps the real acquire-contention fence against a live competing writer', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');
    const writerResource = fixture.input.writerResource;
    if (!writerResource) throw new Error('Expected the rollback fixture to include a writer resource');
    const competingLease = await fixture.coordinator.acquire({
      resource: writerResource,
      ownerId: 'live-competing-ledger-writer',
      correlationId: 'live-competing-ledger-writer',
      ttlMs: 60_000,
      acquireTimeoutMs: 1_000,
    });

    try {
      await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
        disposition: 'denied',
        reasonCode: 'WRITER_FENCE_FAILED',
        certificate: null,
      });
    } finally {
      await fixture.coordinator.release(competingLease);
    }
  });

  it('sources the rollback authority state from the gateway decision, not a bound caller label', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        reportedAuthorityState: 'cutover_ready',
        authorizedAuthorityState: 'cutover_ready',
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({
        fromAuthorityState: 'new_authoritative_reversible',
        fromAuthorityEpoch: 1,
      }),
    });
  });

  it('sources the rollback policy version from the gateway decision, not a bound caller label', async () => {
    const falseConfigurationVersion = 'nonexistent-emergency-policy@999-self-declared';
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      {
        reportedConfigurationVersion: falseConfigurationVersion,
        authorizedConfigurationVersion: falseConfigurationVersion,
      },
    );

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ policyVersion: '1' }),
    });
  });

  it('rejects a post-authorization authority-state claim change through the evidence digest', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');

    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      currentAuthority: { state: 'cutover_ready', epoch: 1 },
    })).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('rejects a post-authorization configuration-version claim change through the evidence digest', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');

    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      configurationVersion: 'nonexistent-emergency-policy@999-self-declared',
    })).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  });

  it('records the gateway authority and policy on the unchanged positive control', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery');

    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({
        policyVersion: '1',
        fromAuthorityState: 'new_authoritative_reversible',
        fromAuthorityEpoch: 1,
        restoredAuthorityEpoch: 2,
      }),
    });
  });

  it('denies a post-certificate health aggregate swap and authorizes the unchanged control', async () => {
    const gateEvidence = await genuineGateEvidence();
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      gateEvidence,
    );
    const changedGateInput = {
      ...fixture.input.gateInput!,
      rollback: {
        ...fixture.input.gateInput!.rollback!,
        healthAggregate: {
          ...fixture.input.gateInput!.rollback!.healthAggregate,
          observationId: 'post-certificate-health-observation',
          policyDigest: hash('post-certificate-health-policy'),
        },
      },
    };
    const denied = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      gateInput: changedGateInput,
    });
    const authorized = await fixture.rollbackSwitch.requestRollback(fixture.input);

    expect(denied).toMatchObject({
      disposition: 'denied',
      reasonCode: 'ABSENT_GATE_CERTIFICATE',
      certificate: null,
    });
    expect(authorized).toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
    });
  });

  it.each(['truncate-ledger', 'rewrite-sealed-artifact', 'non-reproduction-proof'] as const)(
    'rejects the destructive %s path before a rollback certificate exists', async (intent) => {
      const result = await request('write', intent);
      expect(result).toMatchObject({ disposition: 'denied',
        reasonCode: 'DESTRUCTIVE_ROLLBACK_REJECTED', certificate: null,
        authorityState: 'legacy_authoritative', ledgerAuthority: 'denied' });
    },
  );

  it('maps an authority-provider outage from the real gateway to a fail-closed denial', async () => {
    await expect(request('write', 'none', 'rollback', true)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'GATEWAY_FAILURE', certificate: null,
      authorityState: 'legacy_authoritative', ledgerAuthority: 'denied',
    });
  });

  it('fails closed for missing configuration, unknown state, stale epoch, and absent gate certificate', async () => {
    const harness = await gatewayHarness(FIXTURE_AUTHORITY);
    const coordinator = new FencedLeaseCoordinator({ rootDirectory: temporaryRoot('guards') });
    const rollbackSwitch = new DeepReviewRollbackSwitch({ gateway: harness.gateway,
      fencingCoordinator: coordinator });
    const gateInput = await validModeGateInput();
    const gateResult = await new DeepReviewModeMigrationGate().evaluate(gateInput);
    if (gateResult.certificate === null) throw new Error('Expected a genuine mode-gate certificate');
    const cases: readonly [DeepReviewRollbackRequest, string][] = [
      [{}, 'MISSING_CONFIGURATION'],
      [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: { state: 'unknown', epoch: 1 },
        expectedAuthorityEpoch: 1 }, 'UNKNOWN_STATE'],
      [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: FIXTURE_AUTHORITY,
        expectedAuthorityEpoch: 2 }, 'STALE_AUTHORITY_EPOCH'],
      [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: FIXTURE_AUTHORITY,
        expectedAuthorityEpoch: 1, gateCertificate: null }, 'ABSENT_GATE_CERTIFICATE'],
      [{ configurationVersion: 'v1', operation: 'rollback', currentAuthority: FIXTURE_AUTHORITY,
        expectedAuthorityEpoch: 1, gateCertificate: gateResult.certificate, gateInput },
      'EVIDENCE_INCOMPLETE'],
    ];
    for (const [input, reasonCode] of cases) {
      expect(await rollbackSwitch.requestRollback(input)).toMatchObject({ disposition: 'denied',
        reasonCode, authorityState: 'legacy_authoritative', ledgerAuthority: 'denied', certificate: null });
    }
  });

  it('denies an operation outside the closed rollback operation set', async () => {
    const fixture = await rollbackRequestFixture();
    const input = {
      ...fixture.input,
      operation: 'not-a-real-operation',
    } as unknown as DeepReviewRollbackRequest;

    await expect(fixture.rollbackSwitch.requestRollback(input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'UNKNOWN_STATE',
      certificate: null,
    });
  });

  it('rejects a stale writer epoch at the real transition gateway after restoration advances the epoch', async () => {
    const harness = await gatewayHarness({ state: 'legacy_authoritative', epoch: 2 });
    const staleEvent = createFixtureEvent(harness.registry, 1, { authority_epoch: 1 });
    const staleRequest: TransitionAuthorizationRequest = await createFixtureRequest(
      harness.ledger,
      staleEvent,
      harness.policies,
      'stale-writer-after-restoration',
      { mode: 'deep-review', authorityEpoch: 1 },
    );
    await expect(harness.gateway.authorize(staleRequest)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: 'stale_authority_epoch',
    });
  });

  it('emits no rollback certificate and mutates no rollback state when identity is unverified', async () => {
    const fixture = await rollbackRequestFixture(
      'externally-authorized-recovery',
      'none',
      'rollback',
      false,
      'genuine',
      undefined,
      DEFAULT_RETAINED_COUNTS,
      DEFAULT_RETAINED_COUNTS,
      { omitIdentityResolver: true },
    );
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'AUTHORIZATION_DENIED',
      authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied',
      certificate: null,
    });
    expect(result.certificate).toBeNull();
  });
});
