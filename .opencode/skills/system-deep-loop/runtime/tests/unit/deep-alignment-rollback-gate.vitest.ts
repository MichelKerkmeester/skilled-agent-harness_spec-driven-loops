// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  DeepAlignmentTransitionKinds,
  issueDeepAlignmentRunCertificate,
  parseDeepAlignmentCertificateBundle,
} from '../../lib/deep-alignment-certificates/index.js';
import {
  DeepAlignmentWireEventTypes,
  createDeepAlignmentEventRegistry,
  deepAlignmentEventDefinitions,
  prepareDeepAlignmentEvent,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  DEEP_ALIGNMENT_REDUCER_ID,
  DEEP_ALIGNMENT_REDUCER_VERSION,
  createDeepAlignmentProjectionState,
  reduceDeepAlignmentVerifiedEvent,
} from '../../lib/deep-alignment-reducers/index.js';
import {
  DeepAlignmentModeMigrationGate,
  DeepAlignmentRollbackSwitch,
  evaluateDeepAlignmentRollbackWindow,
} from '../../lib/deep-alignment-rollback-gate/index.js';
import {
  DEEP_ALIGNMENT_COMPARATOR_VERSION,
  DEEP_ALIGNMENT_LIFECYCLE_EVENT_MAP,
  DEEP_ALIGNMENT_MODE_GATE_INPUT_VERSION,
  DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
  DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
  createDeepAlignmentModeGateInput,
} from '../../lib/deep-alignment-shadow-parity/index.js';
import {
  DeepAlignmentArtifactKinds,
  createDeepAlignmentSealedArtifactStore,
  deepAlignmentDependency,
  sealDeepAlignmentArtifact,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
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
import { compileParityCaseManifest, issueParityCertificate } from '../../lib/shadow-parity/index.js';
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
  DeepAlignmentCertificateBundle,
  DeepAlignmentOfflineVerificationInput,
  DeepAlignmentTransitionReceiptInput,
  DeepAlignmentTransitionReceiptSubstrate,
} from '../../lib/deep-alignment-certificates/index.js';
import type {
  DeepAlignmentEventEnvelope,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type { DeepAlignmentProjectionState } from '../../lib/deep-alignment-reducers/index.js';
import type {
  DeepAlignmentLifecycleEvidenceRow,
  DeepAlignmentModeGateInput,
  DeepAlignmentModeMigrationCertificate,
  DeepAlignmentRollbackRequest,
  DeepAlignmentVersionBindings,
} from '../../lib/deep-alignment-rollback-gate/index.js';
import type {
  DeepAlignmentParityCertificateEvidenceBinding,
  DeepAlignmentParityReceipt,
  DeepAlignmentResumeParityEvidence,
} from '../../lib/deep-alignment-shadow-parity/index.js';
import type {
  DeepAlignmentArtifactDependency,
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentSealedArtifactBinding,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { HealthAggregate } from '../../lib/health-degeneration-harness/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { ProtectedResourceIdentity } from '../../lib/locks-and-fencing/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { CertificationProfile } from '../../lib/receipts-and-effect-recovery/index.js';
import type {
  DrillInputBindings,
  InflightClassificationManifest as RollbackClassificationManifest,
  Phase014RollbackEvidenceInput,
  RollbackDrillClock,
  RollbackDrillManifest,
  RollbackDrillOptions,
  RollbackLaneState,
} from '../../lib/rollback-drills/index.js';
import type { ParityCertificateBindings, ShadowParityCasePass } from '../../lib/shadow-parity/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

type ReplayProjection = DeepAlignmentProjectionState & JsonObject;

interface CertificateScenario {
  readonly bundle: DeepAlignmentCertificateBundle;
  readonly verification: DeepAlignmentOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepAlignmentSealedArtifactStore>;
  readonly bindings: readonly DeepAlignmentSealedArtifactBinding[];
}

interface RetainedCounts {
  readonly retainedEventCountBefore: number;
  readonly retainedEventCountAfter: number;
  readonly retainedArtifactCountBefore: number;
  readonly retainedArtifactCountAfter: number;
}

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const BASE_SHA = '1'.repeat(40);
const TIMESTAMP = '2026-07-27T10:00:00.000Z';
const RUN_ID = 'alignment-rollback-gate-run';
const SESSION_ID = 'alignment-rollback-gate-session';
const STREAM_ID = 'alignment-rollback-gate-stream';
const AUTHORITY_EPOCH_ID = 'authority-epoch-1';
const SUBJECT_DIGEST = digest('subject-snapshot');
const APPLICABILITY_DECISION_DIGEST = digest('applicability-decision');
const DIMENSION_COVERAGE_DIGEST = digest('dimension-coverage');
const REPORT_DIGEST = digest('report');
const CONTINUITY_PAYLOAD_DIGEST = digest('continuity-payload');
const TEST_PRODUCER = Object.freeze({ name: 'deep-alignment-rollback-gate-tests', version: '1' });
const DEFAULT_RETAINED_COUNTS: RetainedCounts = Object.freeze({
  retainedEventCountBefore: 20,
  retainedEventCountAfter: 20,
  retainedArtifactCountBefore: 24,
  retainedArtifactCountAfter: 24,
});
const ROLLBACK_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'deep-alignment-rollback-gate-provider',
  key_id: 'deep-alignment-rollback-gate-key',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const ROLLBACK_PROVIDER = createHmacCertificationProvider(
  ROLLBACK_PROFILE,
  'deep-alignment-rollback-gate-secret-more-than-thirty-two-bytes',
);
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-rollback-gate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function replayMetadata(): DeepAlignmentReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('event-replay'),
    replay_input_digests: {
      authority: digest('authority'),
      configuration: digest('configuration'),
      subject: digest('subject'),
      verifier: digest('verifier'),
    },
  };
}

function baseScope() {
  return { runId: RUN_ID, sessionId: SESSION_ID, authorityEpochId: AUTHORITY_EPOCH_ID };
}

function iterationScope() {
  return { ...baseScope(), generation: 1, iterationId: 'iteration-1' };
}

function laneScope() {
  return { ...iterationScope(), laneId: 'lane-1' };
}

function subjectScope() {
  return {
    ...laneScope(),
    subjectId: 'subject-1',
    ruleId: 'rule-1',
    observationId: 'observation-1',
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

function createEvent<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepAlignmentScopeMap[TStem],
  data: DeepAlignmentPayloadMap[TStem],
): DeepAlignmentEventEnvelope<TStem> {
  const eventId = `alignment-gate-event-${String(sequence).padStart(3, '0')}`;
  return prepareDeepAlignmentEvent({
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: TEST_PRODUCER,
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: sequence === 1
      ? null
      : `alignment-gate-event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `alignment-gate-event-${sequence}`,
  }, createDeepAlignmentEventRegistry()).envelope as DeepAlignmentEventEnvelope<TStem>;
}

function projectionEvents(): readonly DeepAlignmentLedgerEvent[] {
  const events: DeepAlignmentLedgerEvent[] = [];
  const append = <TStem extends DeepAlignmentEventStem>(
    stem: TStem,
    scope: DeepAlignmentScopeMap[TStem],
    data: DeepAlignmentPayloadMap[TStem],
  ): void => {
    events.push(createEvent(stem, events.length + 1, scope, data));
  };
  append('deep_alignment.run_initialized', { ...baseScope(), generation: 1 }, {
    target: {
      targetId: 'target-root', targetType: 'repository', artifactRef: 'artifact:repository',
      sourceDigest: digest('target-source'), contentDigest: digest('target-content'),
    },
    lineageMode: 'fresh', maxIterations: 4,
    convergencePolicyVersion: 'alignment-convergence@1',
    reviewModeContractDigest: digest('alignment-contract'),
    initialReleaseReadinessState: 'not-assessed',
  });
  append('deep_alignment.authority_reference_bound', baseScope(), {
    authorityId: 'authority-main', authorityCapsuleRef: 'authority-capsule-1',
    authoritySourceDigest: digest('authority-source'), compilerFingerprint: digest('authority-compiler'),
    profileDigest: digest('authority-profile'), ruleIrDigest: digest('rule-ir'),
    signatureDigest: digest('authority-signature'), expiresAt: '2027-07-27T10:00:00.000Z',
    rollbackRef: null,
  });
  append('deep_alignment.authority_validation_recorded', baseScope(), {
    authorityReferenceEventId: 'alignment-gate-event-002',
    checks: {
      parse: 'pass', type: 'pass', capability: 'pass', ruleTests: 'pass', coverage: 'pass',
      expiry: 'pass', rollback: 'pass', signature: 'pass', mixAndMatch: 'pass',
      resultDigest: digest('authority-checks'),
    },
    authorityStatus: 'valid', validationReceiptRefs: ['receipt:authority'],
    validatorFingerprint: digest('authority-validator'),
    validationDigest: digest('authority-validation'), blockedReasonCode: null,
  });
  append('deep_alignment.scope_resolved', baseScope(), {
    targetSetDigest: digest('target-set'), scopeClass: 'targeted',
    selectedTargets: [{
      targetId: 'target-file', targetType: 'file', artifactRef: 'artifact:src/alignment.ts',
      sourceDigest: digest('alignment-source'), contentDigest: digest('alignment-content'),
    }],
    omittedHighRiskTargetRefs: [], discoveryMethodIds: ['changed-files'],
    scopeEvidenceRefs: ['evidence:scope'],
  });
  append('deep_alignment.dimension_ordered', baseScope(), {
    orderedDimensionIds: ['alignment'],
    riskRationale: 'Authority-backed alignment is the required dimension.',
    scopeEvidenceRefs: ['evidence:scope'], orderingPolicyVersion: 'dimension-order@1',
  });
  append('deep_alignment.lane_plan_recorded', laneScope(), {
    laneKind: 'schema', orderedRuleIds: ['rule-1'], ruleIrRef: 'rule-ir:1',
    ruleIrDigest: digest('rule-ir'), verifierPolicyVersion: 'verifier-policy@1',
    budgetRef: 'budget:lane-1', requiredEvidenceClasses: ['schema-witness'],
    planDigest: digest('lane-plan'),
  });
  append('deep_alignment.lane_started', laneScope(), {
    lanePlanEventId: 'alignment-gate-event-006', subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'alignment-gate-event-003',
    authorityValidationDigest: digest('authority-validation'), status: 'started',
  });
  append('deep_alignment.subject_snapshot_bound', { ...laneScope(), subjectId: 'subject-1' }, {
    subjectSnapshotRef: 'subject-snapshot-1', subjectType: 'file', subjectDigest: SUBJECT_DIGEST,
    sourceVersionRef: 'source-version-1', capturedAt: TIMESTAMP, parentSnapshotRef: null,
    receiptRef: 'receipt:subject',
  });
  append('deep_alignment.applicability_evaluated', {
    ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
  }, {
    predicateRef: 'predicate:rule-1', predicateDigest: digest('predicate'),
    targetFactRefs: ['target-fact:language'], targetFactDigest: digest('target-facts'),
    result: 'applicable', evaluatorFingerprint: digest('applicability-evaluator'),
    authorityValidationEventId: 'alignment-gate-event-003',
    decisionDigest: APPLICABILITY_DECISION_DIGEST, reasonCode: 'subject-matches-rule',
  });
  append('deep_alignment.dimension_pass_started', {
    ...iterationScope(), dimensionId: 'alignment',
  }, {
    passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
    searchCoverageDigest: digest('pass-coverage'), passStatus: 'started',
    nextFocusRef: 'focus:rule-1',
  });
  append('deep_alignment.observation_recorded', subjectScope(), {
    applicabilityDecisionId: 'alignment-gate-event-009', subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST, detectorFingerprint: digest('detector'),
    observationKind: 'schema', rawResultDigest: digest('raw-observation'),
    sourceDigest: digest('subject-source'), contentDigest: digest('observation-content'),
    evidenceClass: 'schema-witness', freshness: 'fresh', causalRelevance: 'direct',
    locator: {
      scheme: 'file', artifactRef: 'artifact:subject-1', locatorDigest: digest('observation-locator'),
      selector: 'symbol:observation-1', revision: 'revision-1',
    },
    receiptRefs: ['receipt:observation-1'],
  });
  append('deep_alignment.applicability_coverage_recorded', laneScope(), {
    authorityValidationEventId: 'alignment-gate-event-003', subjectSnapshotDigest: SUBJECT_DIGEST,
    declaredApplicabilityEdgeRefs: ['edge:rule-1-subject-1'], applicableRuleIds: ['rule-1'],
    notApplicableRuleIds: [], unresolvedRuleIds: [], untestedRuleIds: [], blockedRuleIds: [],
    coverageDigest: digest('applicability-coverage'),
  });
  append('deep_alignment.dimension_pass_completed', {
    ...iterationScope(), dimensionId: 'alignment',
  }, {
    passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
    searchCoverageDigest: digest('pass-coverage'), passStatus: 'complete',
    rawFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
    nextFocusRef: 'focus:convergence',
  });
  append('deep_alignment.lane_completed', laneScope(), {
    lanePlanEventId: 'alignment-gate-event-006', subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'alignment-gate-event-003',
    applicabilityDecisionRefs: ['alignment-gate-event-009'],
    observationRefs: ['alignment-gate-event-011'], verificationRefs: [], status: 'complete',
    counts: { applicable: 1, notApplicable: 0, unresolved: 0, untested: 0, blocked: 0,
      nonConformant: 0 },
    completionDigest: digest('lane-completion'), blockedReasonCode: null,
  });
  append('deep_alignment.convergence_evaluated', iterationScope(), {
    rawSignals: convergenceSignals('raw'), weightedSignals: convergenceSignals('weighted'),
    dimensionCoverageDigest: DIMENSION_COVERAGE_DIGEST,
    protocolCoverageDigest: digest('protocol-coverage'), findingStability: 'stable',
    p0p1ResolutionState: 'resolved', evidenceDensity: 1, hotspotSaturation: 1,
    decision: 'converged', policyFingerprint: digest('convergence-policy'), blockerIds: [],
    stopCandidate: true,
  });
  append('deep_alignment.synthesis_started', { ...baseScope(), reportRevisionId: 'report-1' }, {
    finalizedEventRange: { firstEventId: 'alignment-gate-event-001',
      lastEventId: 'alignment-gate-event-015' },
    findingRegistryInputDigest: digest('registry-input'),
    deduplicationPolicyDigest: digest('dedup-policy'),
    verdictInputDigests: [digest('verdict-input')], unresolvedFindingIds: [], deferredFindingIds: [],
  });
  append('deep_alignment.review_report_committed', {
    ...baseScope(), reportRevisionId: 'report-1',
  }, {
    finalizedEventRange: { firstEventId: 'alignment-gate-event-001',
      lastEventId: 'alignment-gate-event-016' },
    findingRegistryInputDigest: digest('registry-input'),
    deduplicationPolicyDigest: digest('dedup-policy'),
    verdictInputDigests: [digest('verdict-input')], unresolvedFindingIds: [], deferredFindingIds: [],
    reportDigest: REPORT_DIGEST,
    sectionManifest: { sectionIds: ['authority', 'alignment'],
      manifestDigest: digest('section-manifest') }, reportReceiptRef: 'receipt:report',
  });
  append('deep_alignment.continuity_save_requested', baseScope(), {
    targetPacket: 'system-deep-loop/target', continuityPayloadDigest: CONTINUITY_PAYLOAD_DIGEST,
    sourceEventRange: { firstEventId: 'alignment-gate-event-001',
      lastEventId: 'alignment-gate-event-017' },
    route: 'implementation-summary', mergeMode: 'update-in-place',
  });
  append('deep_alignment.continuity_save_completed', baseScope(), {
    targetPacket: 'system-deep-loop/target', continuityPayloadDigest: CONTINUITY_PAYLOAD_DIGEST,
    sourceEventRange: { firstEventId: 'alignment-gate-event-001',
      lastEventId: 'alignment-gate-event-018' },
    route: 'implementation-summary', mergeMode: 'update-in-place',
    persistenceReceiptRefs: ['receipt:continuity'], continuityFingerprint: digest('continuity'),
  });
  append('deep_alignment.run_completed', baseScope(), {
    terminalStatus: 'completed', convergenceEventId: 'alignment-gate-event-015',
    synthesisEventId: 'alignment-gate-event-016', reportEventId: 'alignment-gate-event-017',
    continuityEventId: 'alignment-gate-event-019', finalLedgerTailHash: digest('previous:20'),
    counts: { dimensions: 1, iterations: 1, candidates: 0, findings: 0, evidence: 1 },
    verdict: 'pass', completionReason: 'All required alignment checks completed.',
    incompleteReason: null,
  });
  return Object.freeze(events);
}

async function authorizedLedger(events: readonly DeepAlignmentLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepAlignmentEventDefinitions());
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('certificate-ledger');
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
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepAlignmentEvent({
      stem: event.payload.stem, scope: event.payload.scope,
      prevEventHash: event.payload.prevEventHash, replay: event.payload.replay,
      data: event.payload.data, eventId: event.event_id, streamId: event.stream_id,
      streamSequence: event.stream_sequence, occurredAt: event.occurred_at,
      recordedAt: event.recorded_at, producer: event.producer,
      authorityEpoch: event.authority_epoch, correlationId: event.correlation_id,
      causationId: event.causation_id, idempotencyKey: event.idempotency_key,
    }, registry);
    const request = await createFixtureRequest(
      ledger,
      prepared,
      policies,
      `alignment-gate-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('Expected certificate authorization');
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({ rootDirectory, operationTimeoutMs: 5_000 });
  const ledgerLease = coordinator.acquire({
    resource: { kind: ProtectedResourceKinds.LEDGER, components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM },
    ownerId: 'deep-alignment-certificate-writer',
    correlationId: 'deep-alignment-certificate-writer',
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: { writer: new FencedLedgerWriter(coordinator), currentLease: () => ledgerLease },
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'alignment', priorStateVersion: 'deep-alignment-certificate-state@1',
      priorStateFingerprint: digest('deep-alignment-certificate-state'),
      actorId: 'deep-alignment-certificate-writer', capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch, policyId: 'fixture-capability-policy',
      policyVersion: 1, evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepAlignmentTransitionReceiptSubstrate = Object.freeze({
    writer,
    registry,
    producer: TEST_PRODUCER,
  });
  return { ledger, receiptSubstrate, registry };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepAlignmentWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepAlignmentVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_ALIGNMENT_REDUCER_ID,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function baseMaterial(artifactKind: DeepAlignmentArtifactKind, suffix = 'primary') {
  return {
    artifactId: `${artifactKind}-${suffix}`,
    authorityEpochId: AUTHORITY_EPOCH_ID,
    materialDigest: digest(`${artifactKind}:${suffix}:material`),
    materialRef: `artifact:${artifactKind}:${suffix}`,
    dependencies: [] as readonly DeepAlignmentArtifactDependency[],
    locator: {
      scheme: 'artifact' as const,
      artifactRef: `artifact:${artifactKind}:${suffix}`,
      locatorDigest: digest(`${artifactKind}:${suffix}:locator`),
      selector: `artifact:${suffix}`,
      revision: 'revision-1',
    },
    producerVersion: 'producer@1',
  };
}

async function seal(
  store: ReturnType<typeof createDeepAlignmentSealedArtifactStore>,
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
): Promise<DeepAlignmentSealedArtifactBinding> {
  return sealDeepAlignmentArtifact(
    store,
    artifactKind,
    material as never,
  ) as Promise<DeepAlignmentSealedArtifactBinding>;
}

async function sealedFixture() {
  const artifactStore = createDeepAlignmentSealedArtifactStore({
    rootDirectory: temporaryRoot('certificate-artifacts'),
  });
  const bindings: DeepAlignmentSealedArtifactBinding[] = [];
  const add = async (
    kind: DeepAlignmentArtifactKind,
    material: DeepAlignmentArtifactMaterial,
  ) => {
    const binding = await seal(artifactStore, kind, material);
    bindings.push(binding);
    return binding;
  };
  const dependency = (
    kind: DeepAlignmentArtifactKind,
    binding: DeepAlignmentSealedArtifactBinding,
  ) => deepAlignmentDependency(kind, binding.reference);

  const authorityMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE),
    materialRef: 'authority-capsule-1',
    authorityId: 'authority-main',
    authoritySourceDigest: digest('authority-source'),
    publisherId: 'publisher-1',
    compilerFingerprint: digest('authority-compiler'),
    ruleManifestDigest: digest('rule-manifest'),
    applicabilityPolicyDigest: digest('applicability-policy'),
    capabilityDigest: digest('authority-capability'),
    coverageDigest: digest('authority-coverage'),
    signatureDigest: digest('authority-signature'),
    expiresAt: '2099-01-01T00:00:00.000Z',
    rollbackRef: null,
    status: 'valid' as const,
  };
  const authority = await add(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, authorityMaterial);
  const laneMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION),
    laneId: 'lane-1',
    artifactClass: 'standard',
    scopeDigest: digest('lane-scope'),
    adapterContractDigest: digest('adapter-contract'),
    selectedCorpusDigest: digest('selected-corpus'),
    omittedScopeDigest: digest('omitted-scope'),
    unresolvedScopeDigest: digest('unresolved-scope'),
    protectedFilesDigest: digest('protected-files'),
  };
  const lane = await add(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, laneMaterial);
  const ruleMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.RULE_MANIFEST),
    manifestId: 'rule-manifest-1',
    orderedRuleIds: ['rule-1'],
    compilerFingerprint: digest('authority-compiler'),
    ruleIrDigest: digest('rule-ir'),
    applicabilityPolicyDigest: digest('applicability-policy'),
    ruleSchemaVersion: 'rules@1',
  };
  const rule = await add(DeepAlignmentArtifactKinds.RULE_MANIFEST, ruleMaterial);
  const targetMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT),
    targetId: 'target-root',
    laneId: 'lane-1',
    subjectId: 'subject-1',
    subjectType: 'file' as const,
    sourceVersionDigest: digest('source-version'),
    subjectDigest: SUBJECT_DIGEST,
    parentSnapshotDigest: null,
    snapshotDigest: SUBJECT_DIGEST,
    capturedAt: TIMESTAMP,
  };
  const target = await add(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, targetMaterial);
  const applicabilityMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION),
    materialDigest: APPLICABILITY_DECISION_DIGEST,
    dependencies: [dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target)],
    decisionId: 'alignment-gate-event-009',
    laneId: 'lane-1',
    subjectId: 'subject-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    predicateDigest: digest('predicate'),
    targetFactDigest: digest('target-facts'),
    authorityValidationDigest: digest('authority-validation'),
    evaluatorFingerprint: digest('applicability-evaluator'),
    result: 'applicable' as const,
    reasonCode: 'subject-matches-rule',
  };
  const applicability = await add(
    DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    applicabilityMaterial,
  );
  const discoveryMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST),
    manifestId: 'discovery-manifest-1',
    laneId: 'lane-1',
    adapterContractDigest: digest('adapter-contract'),
    selectedScopeDigest: digest('target-set'),
    artifactDigests: [digest('discovered-artifact')],
    omittedScopeDigest: digest('omitted-scope'),
    unresolvedScopeDigest: digest('unresolved-scope'),
    corpusPartitionDigest: digest('corpus-partition'),
    watermarkDigest: digest('discovery-watermark'),
  };
  const discovery = await add(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, discoveryMaterial);
  const verificationDependencies = [
    dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target),
    dependency(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, applicability),
  ];
  const detectorMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.DETECTOR_INPUT),
    dependencies: verificationDependencies,
    inputId: 'detector-input-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    applicabilityDecisionDigest: applicability.reference.content_digest,
    inputDigest: digest('detector-input'),
    sourceDigest: digest('detector-source'),
    producerFingerprint: digest('detector'),
    evidenceDigests: [digest('detector-evidence')],
    inputRole: 'detector' as const,
  };
  const detector = await add(DeepAlignmentArtifactKinds.DETECTOR_INPUT, detectorMaterial);
  const verifierMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.VERIFIER_INPUT),
    dependencies: verificationDependencies,
    inputId: 'verifier-input-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    applicabilityDecisionDigest: applicability.reference.content_digest,
    inputDigest: digest('verifier-input'),
    sourceDigest: digest('verifier-source'),
    producerFingerprint: digest('verifier'),
    evidenceDigests: [digest('verifier-evidence')],
    inputRole: 'verifier' as const,
  };
  const verifier = await add(DeepAlignmentArtifactKinds.VERIFIER_INPUT, verifierMaterial);
  const witnessMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.WITNESS_MATRIX),
    dependencies: [dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target)],
    matrixId: 'witness-matrix-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    witnessKinds: ['conforming', 'violating', 'boundary', 'relational', 'stateful'] as const,
    witnessDigests: [digest('witness')],
    replayRecipeDigests: [digest('witness-replay')],
    coverageGapDigests: [],
    sourceAuthorityEpochId: null,
    verifierFingerprint: digest('verifier'),
  };
  const witness = await add(DeepAlignmentArtifactKinds.WITNESS_MATRIX, witnessMaterial);
  const findingMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.FINDING_EVIDENCE),
    dependencies: [
      dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target),
      dependency(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, authority),
      dependency(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, applicability),
    ],
    findingId: 'finding-closure-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    authorityDigest: authority.reference.content_digest,
    applicabilityDecisionDigest: applicability.reference.content_digest,
    observationDigest: digest('observation'),
    reProbeReceiptDigest: digest('re-probe'),
    evidenceDigests: [digest('finding-evidence')],
    verifierFingerprint: digest('verifier'),
    verifiedLevel: 'verified' as const,
    evidenceClass: 'deterministic' as const,
    severity: 'none' as const,
    confidence: 1,
  };
  const finding = await add(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, findingMaterial);
  const exceptionMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION),
    dependencies: [
      dependency(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, finding),
      dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target),
      dependency(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, authority),
    ],
    exceptionId: 'exception-closure-1',
    findingDigest: finding.reference.content_digest,
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: target.reference.content_digest,
    authorityDigest: authority.reference.content_digest,
    ownerId: 'owner-1',
    issuerId: 'publisher-1',
    justificationReason: 'Bounded exception evidence retained for closure verification.',
    scopeDigest: digest('exception-scope'),
    verifierFingerprint: digest('verifier'),
    issuedAt: TIMESTAMP,
    expiresAt: '2099-01-01T00:00:00.000Z',
    status: 'active' as const,
    invalidationTriggers: ['authority-changed', 'subject-changed'] as const,
    invalidationReason: null,
  };
  const governedException = await add(
    DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
    exceptionMaterial,
  );
  const convergenceDependencies = [
    dependency(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, lane),
    dependency(DeepAlignmentArtifactKinds.RULE_MANIFEST, rule),
    dependency(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, applicability),
    dependency(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, discovery),
    dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target),
    dependency(DeepAlignmentArtifactKinds.DETECTOR_INPUT, detector),
    dependency(DeepAlignmentArtifactKinds.VERIFIER_INPUT, verifier),
    dependency(DeepAlignmentArtifactKinds.WITNESS_MATRIX, witness),
    dependency(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, finding),
    dependency(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, governedException),
  ];
  const convergenceMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT),
    dependencies: convergenceDependencies,
    snapshotId: 'convergence-1',
    laneId: 'lane-1',
    orderedInputDigests: convergenceDependencies.map((entry) => entry.reference.content_digest),
    coverageDigest: DIMENSION_COVERAGE_DIGEST,
    stabilityDigest: digest('stability'),
    findingsViewDigest: finding.reference.content_digest,
    exceptionViewDigest: governedException.reference.content_digest,
    unresolvedFindingDigests: [finding.reference.content_digest],
    laneVerdict: 'conformant' as const,
    evaluatorVersion: 'evaluator@1',
    watermarkDigest: digest('convergence-watermark'),
  };
  const convergence = await add(
    DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT,
    convergenceMaterial,
  );
  const reportMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT),
    materialDigest: REPORT_DIGEST,
    dependencies: [
      dependency(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, convergence),
      dependency(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, finding),
      dependency(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, governedException),
    ],
    reportId: 'report-1',
    laneId: 'lane-1',
    orderedInputDigests: [
      convergence.reference.content_digest,
      finding.reference.content_digest,
      governedException.reference.content_digest,
    ],
    convergenceSnapshotDigest: convergence.reference.content_digest,
    findingsViewDigest: finding.reference.content_digest,
    exceptionViewDigest: governedException.reference.content_digest,
    unresolvedFindingDigests: [finding.reference.content_digest],
    laneVerdict: 'conformant' as const,
    overallVerdict: 'conformant' as const,
    reportDigest: REPORT_DIGEST,
    reportRef: 'artifact:alignment-report-1',
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  };
  const report = await add(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, reportMaterial);
  const handoffMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF),
    dependencies: [
      dependency(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, lane),
      dependency(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, finding),
      dependency(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, report),
    ],
    handoffId: 'handoff-1',
    handoffRole: 'save' as const,
    referenceSetDigest: digest([report.reference.qualified_digest]),
    priorLineageDigest: digest('prior-lineage'),
    driftDigest: digest('drift'),
    affectedLaneDigests: [lane.reference.content_digest],
    affectedFindingDigests: [finding.reference.content_digest],
    continuityPayloadDigest: CONTINUITY_PAYLOAD_DIGEST,
    offeredViewDigest: report.reference.content_digest,
    offeredViewRef: 'artifact:alignment-report-1',
    targetPacket: 'system-deep-loop/target',
    driftStatus: 'unchanged' as const,
    handoffVersion: 'handoff@1',
  };
  const handoff = await add(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, handoffMaterial);

  const authorityValidation = await add(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, {
    ...authorityMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, 'validation'),
    authorityId: 'authority-validation-evidence',
    materialRef: 'authority-capsule-validation',
  });
  const dimensionLane = await add(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, {
    ...laneMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'dimension'),
  });
  const subjectTarget = await add(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, {
    ...targetMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, 'subject'),
    subjectDigest: SUBJECT_DIGEST,
  });
  const passStartDiscovery = await add(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, {
    ...discoveryMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, 'pass-start'),
    manifestId: 'discovery-pass-start',
  });
  const coverageApplicability = await add(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, {
    ...applicabilityMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, 'coverage'),
    dependencies: applicabilityMaterial.dependencies,
    decisionId: 'coverage-decision',
    materialDigest: digest('coverage-decision'),
  });
  const passCompleteDiscovery = await add(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, {
    ...discoveryMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, 'pass-complete'),
    manifestId: 'discovery-pass-complete',
  });
  const laneComplete = await add(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, {
    ...laneMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'complete'),
  });
  const synthesisConvergence = await add(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, {
    ...convergenceMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'synthesis'),
    dependencies: convergenceMaterial.dependencies,
    snapshotId: 'convergence-synthesis',
  });
  const continuityHandoff = await add(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, {
    ...handoffMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'continuity'),
    dependencies: handoffMaterial.dependencies,
    handoffId: 'handoff-continuity',
  });
  const completionReport = await add(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, {
    ...reportMaterial,
    ...baseMaterial(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'completion'),
    materialDigest: REPORT_DIGEST,
    dependencies: reportMaterial.dependencies,
    reportId: 'report-completion',
    reportDigest: REPORT_DIGEST,
  });
  return {
    artifactStore,
    bindings: Object.freeze(bindings),
    eventOutputs: Object.freeze([
      lane,
      authority,
      authorityValidation,
      discovery,
      dimensionLane,
      rule,
      target,
      subjectTarget,
      applicability,
      passStartDiscovery,
      detector,
      coverageApplicability,
      passCompleteDiscovery,
      laneComplete,
      convergence,
      synthesisConvergence,
      report,
      handoff,
      continuityHandoff,
      completionReport,
    ]),
    completionInputs: Object.freeze([verifier, witness, finding, governedException]),
  };
}

function transitionInputs(
  outputs: readonly DeepAlignmentSealedArtifactBinding[],
  completionInputs: readonly DeepAlignmentSealedArtifactBinding[],
): readonly DeepAlignmentTransitionReceiptInput[] {
  const kinds = [
    DeepAlignmentTransitionKinds.INIT,
    DeepAlignmentTransitionKinds.AUTHORITY,
    DeepAlignmentTransitionKinds.AUTHORITY,
    DeepAlignmentTransitionKinds.SCOPE,
    DeepAlignmentTransitionKinds.SCOPE,
    DeepAlignmentTransitionKinds.LANE,
    DeepAlignmentTransitionKinds.LANE,
    DeepAlignmentTransitionKinds.SUBJECT,
    DeepAlignmentTransitionKinds.APPLICABILITY,
    DeepAlignmentTransitionKinds.PASS,
    DeepAlignmentTransitionKinds.OBSERVATION,
    DeepAlignmentTransitionKinds.COVERAGE,
    DeepAlignmentTransitionKinds.PASS,
    DeepAlignmentTransitionKinds.LANE,
    DeepAlignmentTransitionKinds.CONVERGENCE,
    DeepAlignmentTransitionKinds.SYNTHESIS,
    DeepAlignmentTransitionKinds.REPORT,
    DeepAlignmentTransitionKinds.CONTINUITY,
    DeepAlignmentTransitionKinds.CONTINUITY,
    DeepAlignmentTransitionKinds.COMPLETION,
  ] as const;
  return Object.freeze(kinds.map((transitionKind, index) => ({
    transitionKind,
    logicalOperationId: `alignment-logical-operation-${index + 1}`,
    attemptIds: [`alignment-attempt-${index + 1}`],
    resultEventId: `alignment-gate-event-${String(index + 1).padStart(3, '0')}`,
    inputArtifactQualifiedDigests: transitionKind === DeepAlignmentTransitionKinds.COMPLETION
      ? completionInputs.map((binding) => binding.reference.qualified_digest)
      : [],
    outputArtifactQualifiedDigests: [outputs[index]!.reference.qualified_digest],
  })));
}

function certificationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-alignment-gate-test-provider',
      key_id: 'deep-alignment-gate-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

async function certificateScenario(): Promise<CertificateScenario> {
  const events = projectionEvents();
  const { ledger, receiptSubstrate, registry } = await authorizedLedger(events);
  const artifacts = await sealedFixture();
  const providers = certificationProviders();
  const initialState = createDeepAlignmentProjectionState() as ReplayProjection;
  const replay: DeepAlignmentOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: DEEP_ALIGNMENT_REDUCER_ID,
      reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepAlignmentRunCertificate({
    runId: RUN_ID,
    sessionId: SESSION_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: artifacts.artifactStore,
    artifactBindings: artifacts.bindings,
    transitionReceipts: transitionInputs(artifacts.eventOutputs, artifacts.completionInputs),
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'deep-alignment-gate-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    artifactStore: artifacts.artifactStore,
    bindings: artifacts.bindings,
    verification: { bundle, projectionEvents: events, artifactStore: artifacts.artifactStore,
      replay, providers },
  };
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
    verifier: 'alignment-rollback-gate-verifier',
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
  const anchorId = 'deep-alignment-rollback-anchor';
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
    drillId: 'deep-alignment-rollback-gate-drill',
    mode: 'deep-alignment',
    baseSha: digest('rollback-base-commit').slice(0, 40),
    candidateSha: digest('rollback-candidate-commit').slice(0, 40),
    policyVersion: 'rollback-policy@1',
    verifierIdentity: 'alignment-rollback-gate-verifier',
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

async function rollbackEvidence(
  classificationDigest: string,
): Promise<Readonly<{
  evidence: Phase014RollbackEvidenceInput;
  candidateSha: string;
  verifierIdentity: string;
  verifierVersion: string;
  rollbackAnchorDigest: string;
  sharedContractDigest: string;
  writeSetDigest: string;
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
    currentMode: 'deep-alignment',
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
    temporaryRoot('rollback-certificate'),
    'rollback-certificate.json',
    certificate,
  );
  return {
    evidence: {
      certificatePath,
      expectedMode: 'deep-alignment',
      currentBindings,
      certificationProvider: ROLLBACK_PROVIDER,
    },
    candidateSha: facts.candidateSha,
    verifierIdentity: facts.verifierIdentity,
    verifierVersion: certificate.certification.verifier_version,
    rollbackAnchorDigest: facts.bindings.rollbackAsset,
    sharedContractDigest: facts.bindings.receiptContract,
    writeSetDigest: facts.bindings.candidate,
  };
}

function proofFor(rowId: string, disposition: keyof typeof InflightDisposition): DispositionProof {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return {
        kind: 'upcast', adjacentChainComplete: true, pure: true, deterministic: true,
        sideEffectFree: true, sourceBytesPreserved: true, immutableIdentityPreserved: true,
        replayEquivalent: true, sourceBytesDigest: digest(`${rowId}:source`),
        effectiveStateDigest: digest(`${rowId}:effective`),
        registryDigest: digest(`${rowId}:registry`),
        chainIdentitiesDigest: digest(`${rowId}:chain`),
      };
    case InflightDisposition.PIN:
      return {
        kind: 'pin', legacyWriterSoleAuthority: true, legacyCompletionAvailable: true,
        boundedCompletion: true, timedOut: false, terminalBoundary: 'legacy-terminal-receipt',
        terminalReceiptRequired: true,
      };
    case InflightDisposition.FORK:
      return {
        kind: 'fork', executionNamespace: `shadow-${rowId}`, effectNamespace: `effects-${rowId}`,
        shadowOnlySink: true, livePublicationEnabled: false, sourceStateUnchanged: true,
        authorityUnaffected: true, budgetsUnaffected: true,
      };
    case InflightDisposition.MIGRATE:
      return {
        kind: 'migrate', quiescentCheckpoint: true, transactionalSnapshot: true,
        atomicImport: true, reversible: true, identityPreserved: true, orderPreserved: true,
        idempotencyPreserved: true, budgetsPreserved: true, receiptsPreserved: true,
        pendingWorkPreserved: true, checkpointDigest: digest(`${rowId}:checkpoint`),
        restorationReceiptDigest: digest(`${rowId}:restoration`),
      };
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
    rowId: row.id,
    isPresent: !block,
    stateDigest: digest(`${row.id}:state`),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(`${row.id}:schema`),
    lifecyclePoint: row.lifecycle,
    authorityState: 'legacy_authoritative',
    authorityEpoch: 7,
    mutability: row.mutability,
    leaseState: pin ? 'active' : 'none',
    activeLeaseCount: pin ? 1 : 0,
    leaseSetDigest: digest(`${row.id}:leases`),
    pendingEffectsState: pin ? 'active-legacy' : 'none',
    pendingEffectSetDigest: digest(`${row.id}:effects`),
    identityCoverage: true,
    orderCoverage: true,
    idempotencyCoverage: true,
    budgetCoverage: true,
    receiptCoverage: true,
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: `anchor-${row.id}`,
      digest: digest(`${row.id}:anchor`),
      retained: true,
      restorable: true,
      minimumRetentionDays: 14,
      minimumSuccessfulRuns: 5,
    },
    verifier: {
      verified: true,
      receiptDigest: digest(`${row.id}:verifier`),
      replayFingerprintDigest: policy.disposition === InflightDisposition.UPCAST
        ? digest(`${row.id}:replay`)
        : null,
      rollbackScenarioDigest: digest(`${row.id}:rollback`),
      parityCaseDigest: policy.disposition === InflightDisposition.FORK
        ? digest(`${row.id}:parity`)
        : null,
    },
    proof: proofFor(row.id, policy.disposition),
  };
}

function classificationManifest(): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: 'deep-alignment-rollback-classification',
    classifiedAt: '2026-07-28T12:00:00Z',
    classifierBuildId: 'deep-alignment-rollback-gate-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
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
  unavailable = false,
  omitIdentityResolver = false,
) {
  const rootDirectory = temporaryRoot('gateway');
  const registry = createFixtureEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'fixture-capability-policy',
    policyVersion: 1,
    evaluatorVersion: 'deep-alignment-rollback-gate-tests@1',
    ruleIds: ['external-authority-required', 'externally-authorized-recovery'],
    evaluate: (input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult => {
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
  const authorityProvider = unavailable
    ? () => { throw new Error('authority unavailable'); }
    : () => authority;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
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
): DeepAlignmentParityCertificateEvidenceBinding {
  return {
    fixtureId,
    legacyStreamDigest: streamDigest,
    ledgerStreamDigest: streamDigest,
    legacyProjectionFingerprint: digest('parity-projection'),
    ledgerProjectionFingerprint: digest('parity-projection'),
    caseEvidenceDigest,
    referenceSetDigest,
    attestationFinalDigests: [attestationDigest],
  };
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_ALIGNMENT_COMPARATOR_VERSION,
    lifecycleMap: DEEP_ALIGNMENT_LIFECYCLE_EVENT_MAP,
    volatilityAllowlist: DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
    logicalIdentityFields: [
      'eventType', 'logicalRunId', 'authorityEpochId', 'logicalLaneId',
      'logicalSubjectId', 'logicalRuleId', 'logicalFindingId', 'stepKey',
      'producerSequence',
    ],
    diffClasses: [
      'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision',
    ],
  });
}

function parityCertificateBindings(
  manifestDigest: string,
  evidence: readonly DeepAlignmentParityCertificateEvidenceBinding[],
): ParityCertificateBindings {
  return {
    candidate_build_digest: digest({
      manifestDigest,
      schemaVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-alignment-reducers',
      sharedReviewLoop: 'runtime/lib/deep-review-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-alignment-resume-adapter',
      certificates: 'runtime/lib/deep-alignment-certificates',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: 'deep-alignment:shadow-parity-fold',
      reducerVersion: 'deep-alignment-shadow-parity-reducer@1',
      projectionVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      adapterVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: DEEP_ALIGNMENT_LIFECYCLE_EVENT_MAP,
      certificateEvidenceBindings: evidence,
    }),
    policy_version: 'deep-alignment-shadow-only@1',
  };
}

async function parityFixture(authorized: boolean) {
  const harness = await gatewayHarness();
  const event = createFixtureEvent(harness.registry, 1);
  const attestationDigest = digest('parity-attestation');
  if (authorized) {
    const request = await createFixtureRequest(
      harness.ledger,
      event,
      harness.policies,
      'deep-alignment-parity-anchor',
      { mode: 'deep-alignment', evidenceDigest: attestationDigest },
    );
    expect((await harness.gateway.authorize(request)).verdict).toBe('allow');
  }
  const fixtureId = 'alignment-normal-completion';
  const contractDigest = digest('deep-alignment-parity-contract');
  const manifest = compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: fixtureId,
      mode: 'deep-alignment',
      contractDigest,
      disposition: 'protected',
    }],
    cases: [{
      caseId: fixtureId,
      scenarioId: fixtureId,
      mode: 'deep-alignment',
      contractDigest,
      requiredObservations: ['ordered-transitions'],
      projectionIds: ['alignment'],
      timeoutMs: 1_000,
      terminationPolicy: 'bounded',
    }],
  });
  const pass: ShadowParityCasePass = {
    ok: true,
    caseId: fixtureId,
    mode: 'deep-alignment',
    referenceSetDigest: digest('parity-reference'),
    capsuleDigest: digest('parity-capsule'),
    runs: [1, 2].map((runIndex) => ({
      runIndex,
      legacy: {
        finalDigest: attestationDigest, descriptorDigest: digest('parity-descriptor'),
        storedDigest: digest('parity-stored'), effectiveEventDigest: digest('parity-effective'),
        projectionDigest: digest('parity-projection'),
        replayContractDigest: digest('parity-replay-contract'),
        sealedInputDigest: digest('parity-sealed'), attestationSequence: runIndex,
        descriptor: {
          upcaster_registry_digest: digest('parity-upcaster-registry'),
          ordered_chain_identities: [],
        } as never,
      },
      dark: {
        finalDigest: attestationDigest, descriptorDigest: digest('parity-descriptor'),
        storedDigest: digest('parity-stored'), effectiveEventDigest: digest('parity-effective'),
        projectionDigest: digest('parity-projection'),
        replayContractDigest: digest('parity-replay-contract'),
        sealedInputDigest: digest('parity-sealed'), attestationSequence: runIndex,
        descriptor: {
          upcaster_registry_digest: digest('parity-upcaster-registry'),
          ordered_chain_identities: [],
        } as never,
      },
      observationDigest: digest('parity-observation'),
      legacyProjectionDigest: digest('parity-projection'),
      darkProjectionDigest: digest('parity-projection'),
      runEvidenceDigest: digest(`parity-run-${runIndex}`),
    })),
    evidenceDigest: digest('parity-case-evidence'),
    openDivergenceCount: 0,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  };
  const binding = parityEvidenceBinding(
    fixtureId,
    event.canonicalDigest,
    pass.evidenceDigest,
    pass.referenceSetDigest,
    attestationDigest,
  );
  const issued = issueParityCertificate({
    manifest,
    mode: 'deep-alignment',
    caseResults: [pass],
    bindings: parityCertificateBindings(manifest.manifestDigest, [binding]),
  });
  if (!issued.ok) throw new Error(issued.refusal.message);
  const body = {
    schemaVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `receipt-${fixtureId}`,
    baseSha: BASE_SHA,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: 'deep-alignment-event@1',
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    comparatorVersion: DEEP_ALIGNMENT_COMPARATOR_VERSION,
    projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId,
    legacyStreamDigest: event.canonicalDigest,
    ledgerStreamDigest: event.canonicalDigest,
    legacyProjectionFingerprint: digest('parity-projection'),
    ledgerProjectionFingerprint: digest('parity-projection'),
    exitStatus: 'green' as const,
    diffDispositions: [],
    parityCertificate: issued.certificate,
    certificateEvidenceBindings: [binding],
    parityCertificateDigest: issued.certificate.certificate_digest,
    certificateStatus: 'issued' as const,
    certificateRefusalCode: null,
    genericDivergenceId: null,
    genericDivergenceClass: null,
    authorityState: 'legacy-authoritative' as const,
    authorityMutation: false as const,
    cutoverCertificate: false as const,
    reproducibilityDigest: digest({
      baseSha: BASE_SHA,
      runManifestDigest: manifest.manifestDigest,
      fixtureId,
      legacyStreamDigest: event.canonicalDigest,
      ledgerStreamDigest: event.canonicalDigest,
      legacyProjectionFingerprint: digest('parity-projection'),
      ledgerProjectionFingerprint: digest('parity-projection'),
      diffDispositions: [],
    }),
  };
  const receipt: DeepAlignmentParityReceipt = { ...body, receiptDigest: digest(body) };
  const modeGateInput = createDeepAlignmentModeGateInput({
    manifest,
    expectedFixtureIds: [fixtureId],
    receipts: [receipt],
  });
  expect(modeGateInput.schemaVersion).toBe(DEEP_ALIGNMENT_MODE_GATE_INPUT_VERSION);
  return { harness, manifest, receipt, modeGateInput };
}

function healthyAggregate(): HealthAggregate {
  return {
    schemaVersion: 1,
    aggregateId: 'deep-alignment-rollback-gate-health',
    state: 'healthy',
    severity: 'info',
    observationId: 'deep-alignment-rollback-gate-health-observation',
    activeSignalIds: [],
    policyVersion: 'health-policy@1',
    policyDigest: digest('health-policy'),
  };
}

function resumeEvidence(bundle: DeepAlignmentCertificateBundle): DeepAlignmentResumeParityEvidence {
  const decision = {
    decisionVersion: 1,
    decisionId: 'resume-decision-1',
    decisionDigest: digest('resume-decision-1'),
    authority: 'dark-evidence-only',
    legacyAuthority: 'unchanged',
    productionCompletion: false,
    reuseDisposition: 'exact-reuse',
    compatibilityOutcome: 'exact',
    manifestDisposition: 'original',
    compatibility: [],
    branches: [],
    effects: [],
    invalidation: {
      targetChanged: false,
      authorityChanged: false,
      verifierChanged: false,
      reopenedLaneIds: [],
      invalidatedFindingIds: [],
      reopenedObligationIds: [],
      reopenedProofIds: [],
      convergenceReopened: false,
      reportReopened: false,
    },
    lease: {
      runId: RUN_ID,
      sessionId: SESSION_ID,
      leaseId: 'resume-lease-1',
      generation: 1,
      deadlineAt: '2026-07-28T12:00:00Z',
      remainingMs: 60_000,
      replayFingerprint: digest('resume-replay'),
    },
    priorCertificateDigest: bundle.certificate.certificateDigest,
    receiptChainDigest: bundle.certificate.body.receiptChainDigest,
    artifactSetDigest: bundle.certificate.body.artifactSetDigest,
    decisionReason: 'Verified alignment continuity evidence is reusable.',
  } as const;
  return {
    legacyDecision: decision,
    ledgerDecision: {
      ...decision,
      decisionId: 'resume-decision-2',
      decisionDigest: digest('resume-decision-2'),
    },
    legacyEventTailDigest: digest('resume-tail'),
    ledgerEventTailDigest: digest('resume-tail'),
    legacyFreshProjectionFingerprint: digest('resume-projection'),
    ledgerFreshProjectionFingerprint: digest('resume-projection'),
  };
}

function lifecycleRows(
  parityReceipt: DeepAlignmentParityReceipt,
  scenario: CertificateScenario,
): readonly DeepAlignmentLifecycleEvidenceRow[] {
  const bundle = parseDeepAlignmentCertificateBundle(scenario.bundle);
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
    ...scenario.bindings.map((entry) => ({
      fixtureId: entry.artifactKind,
      eventDigest: entry.reference.content_digest,
      receiptDigest: entry.reference.descriptor_digest,
    })),
  ];
  const kinds: readonly DeepAlignmentLifecycleEvidenceRow['kind'][] = [
    'init',
    'authority',
    'lane-scope',
    'applicability',
    'observation-evidence',
    'finding-verification-proof',
    'adjudication-conformance',
    'deviation-witness',
    'coverage',
    'convergence',
    'synthesis-report',
    'crash-resume',
    'blocked-stop',
    'continuity-handoff',
  ];
  return kinds.map((kind, index) => {
    const identity = identities[index];
    if (!identity) throw new Error('Lifecycle evidence fixture is incomplete');
    return { kind, ...identity, status: 'covered' };
  });
}

function successfulWindowExecutions(count = 5) {
  return Array.from({ length: count }, (_, index) => ({
    executionId: `successful-alignment-execution-${index + 1}`,
    authorityState: 'new_authoritative_reversible' as const,
    authorityEpoch: 2,
    result: 'trusted-completion' as const,
    certificateDigest: digest(`successful-alignment-certificate-${index + 1}`),
  }));
}

let validInputPromise: Promise<DeepAlignmentModeGateInput<ReplayProjection>> | null = null;

async function buildValidModeGateInput(): Promise<DeepAlignmentModeGateInput<ReplayProjection>> {
  const parity = await parityFixture(true);
  const certificate = await certificateScenario();
  const classification = classificationManifest();
  const rollback = await rollbackEvidence(classification.finalDigest);
  return {
    candidateSha: rollback.candidateSha,
    baseSha: BASE_SHA,
    sharedContractDigest: rollback.sharedContractDigest,
    writeSetDigest: rollback.writeSetDigest,
    versions: {
      eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-alignment-event@1',
      reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
      projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    },
    verifierIdentity: rollback.verifierIdentity,
    verifierVersion: rollback.verifierVersion,
    authority: { state: 'legacy_authoritative', epoch: 1 },
    parity: {
      manifest: parity.manifest,
      modeGateInput: parity.modeGateInput,
      receipts: [parity.receipt],
      authorizationAuditRootDirectory: parity.harness.rootDirectory,
      authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    },
    sealedArtifacts: {
      store: certificate.artifactStore,
      bindings: certificate.bindings,
    },
    certificates: { verificationInput: certificate.verification },
    resumeEvidence: resumeEvidence(certificate.bundle),
    lifecycle: lifecycleRows(parity.receipt, certificate),
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
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    },
    unresolvedRiskIds: [],
  };
}

async function validModeGateInput(): Promise<DeepAlignmentModeGateInput<ReplayProjection>> {
  validInputPromise ??= buildValidModeGateInput();
  return validInputPromise;
}

async function genuineGateEvidence(): Promise<Readonly<{
  gateInput: DeepAlignmentModeGateInput<ReplayProjection>;
  certificate: DeepAlignmentModeMigrationCertificate;
}>> {
  const gateInput = await validModeGateInput();
  const result = await new DeepAlignmentModeMigrationGate().evaluate(gateInput);
  if (!result.certificate) throw new Error(`Expected genuine gate evidence: ${JSON.stringify(result)}`);
  return { gateInput, certificate: result.certificate };
}

interface RollbackFixtureClaims {
  readonly capabilityId?: string;
  readonly gatewayUnavailable?: boolean;
  readonly operation?: NonNullable<DeepAlignmentRollbackRequest['operation']>;
  readonly staleFenceToken?: number;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly transformLease?: (
    lease: NonNullable<DeepAlignmentRollbackRequest['staleWriterLease']>,
  ) => unknown;
  readonly omitIdentityResolver?: boolean;
}

async function rollbackRequestFixture(
  claims: RollbackFixtureClaims = {},
): Promise<Readonly<{
  input: DeepAlignmentRollbackRequest;
  rollbackSwitch: DeepAlignmentRollbackSwitch;
  coordinator: FencedLeaseCoordinator;
}>> {
  const authority: AuthoritySnapshot = { state: 'new_authoritative_reversible', epoch: 1 };
  const harness = await gatewayHarness(authority, claims.gatewayUnavailable ?? false, claims.omitIdentityResolver === true);
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory: temporaryRoot('rollback-fencing'),
    operationTimeoutMs: 1_000,
  });
  const writerResource = claims.writerResource ?? {
    kind: ProtectedResourceKinds.WRITER,
    components: { writerId: 'deep-alignment-ledger-writer' },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  } as const;
  const issuedLease = await coordinator.acquire({
    resource: writerResource,
    ownerId: 'stale-deep-alignment-writer',
    correlationId: 'stale-deep-alignment-writer',
    ttlMs: 60_000,
    acquireTimeoutMs: 1_000,
  });
  await coordinator.release(issuedLease);
  const staleWriterLease = claims.transformLease
    ? claims.transformLease(issuedLease)
    : claims.staleFenceToken === undefined
      ? issuedLease
      : { ...issuedLease, fenceToken: claims.staleFenceToken };
  const gateEvidence = await genuineGateEvidence();
  const classification = classificationManifest();
  const resume = gateEvidence.gateInput.resumeEvidence!;
  const operation = claims.operation ?? 'rollback';
  const rollbackReason = 'Health evidence requires non-destructive legacy restoration.';
  const retainedCounts = DEFAULT_RETAINED_COUNTS;
  const evidenceDigest = digest({
    configurationVersion: 'rollback-policy@1',
    operation,
    rollbackReason,
    currentAuthorityState: authority.state,
    currentAuthorityEpoch: authority.epoch,
    expectedAuthorityEpoch: authority.epoch,
    gateCertificateDigest: gateEvidence.certificate.certificateDigest,
    admissionState: 'frozen',
    classificationDigest: classification.finalDigest,
    resumeEvidenceDigest: digest(resume),
    writerResourceDigest: canonicalizeProtectedResource(writerResource).resourceDigest,
    staleWriterLeaseDigest: digest(staleWriterLease),
    destructiveIntent: 'none',
    rollbackAnchorDigest: gateEvidence.certificate.rollbackAnchorDigest,
    ...retainedCounts,
  });
  const event = createFixtureEvent(harness.registry, 1);
  const capabilityId = claims.capabilityId ?? 'externally-authorized-recovery';
  const authorizationRequest = await createFixtureRequest(
    harness.ledger,
    event,
    harness.policies,
    `deep-alignment-rollback-${capabilityId}`,
    { mode: 'deep-alignment', capabilityId, evidenceDigest },
  );
  const input = {
    configurationVersion: 'rollback-policy@1',
    operation,
    currentAuthority: authority,
    expectedAuthorityEpoch: authority.epoch,
    gateCertificate: gateEvidence.certificate,
    gateInput: gateEvidence.gateInput,
    authorizationRequest,
    rollbackReason,
    admissionState: 'frozen',
    classificationManifest: classification,
    resumeEvidence: resume,
    writerResource,
    staleWriterLease,
    destructiveIntent: 'none',
    ...retainedCounts,
    rollbackAnchorDigest: gateEvidence.certificate.rollbackAnchorDigest,
  } as DeepAlignmentRollbackRequest;
  return {
    input,
    rollbackSwitch: new DeepAlignmentRollbackSwitch({
      gateway: harness.gateway,
      fencingCoordinator: coordinator,
    }),
    coordinator,
  };
}

function forgedMigrationCertificate(
  genuine: DeepAlignmentModeMigrationCertificate,
): DeepAlignmentModeMigrationCertificate {
  const { certificateDigest: ignored, ...core } = genuine;
  void ignored;
  const forgedCore = {
    ...core,
    candidateSha: 'f'.repeat(40),
  };
  return {
    ...forgedCore,
    certificateDigest: digest(forgedCore),
  };
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

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('deep alignment rollback window', () => {
  it('requires both minimum days and five distinct trusted executions', () => {
    const early = evaluateDeepAlignmentRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-14T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const sparse = evaluateDeepAlignmentRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(4),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const ready = evaluateDeepAlignmentRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(early).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 5 });
    expect(sparse).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 4 });
    expect(ready).toMatchObject({
      state: 'eligible_to_close',
      elapsedCalendarDays: 14,
      successfulAuthoritativeExecutions: 5,
      windowClosed: false,
    });
  });

  it.each([
    ['one repeated execution id', successfulWindowExecutions().map((entry) => ({
      ...entry,
      executionId: 'one-execution',
    }))],
    ['one repeated certificate digest', successfulWindowExecutions().map((entry) => ({
      ...entry,
      certificateDigest: digest('one-certificate'),
    }))],
    ['five duplicate rows', Array.from({ length: 5 }, () => successfulWindowExecutions(1)[0]!)],
  ] as const)('deduplicates %s before thresholding', (_label, executions) => {
    expect(evaluateDeepAlignmentRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    })).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 1 });
  });

  it('deduplicates an execution-certificate identity component transitively', () => {
    const executions = [
      { ...successfulWindowExecutions(1)[0]!, executionId: 'execution-a',
        certificateDigest: digest('certificate-a') },
      { ...successfulWindowExecutions(1)[0]!, executionId: 'execution-a',
        certificateDigest: digest('certificate-b') },
      { ...successfulWindowExecutions(1)[0]!, executionId: 'execution-b',
        certificateDigest: digest('certificate-b') },
      ...successfulWindowExecutions(2).map((entry, index) => ({
        ...entry,
        executionId: `independent-${index}`,
        certificateDigest: digest(`independent-${index}`),
      })),
    ];
    expect(evaluateDeepAlignmentRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions, unresolvedEvidenceCount: 0, lowTraffic: false,
    })).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 3 });
  });

  it('extends the window for low traffic or unresolved evidence without closing authority', () => {
    for (const overrides of [{ lowTraffic: true }, { unresolvedEvidenceCount: 1 }]) {
      expect(evaluateDeepAlignmentRollbackWindow({
        openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
        executions: successfulWindowExecutions(), unresolvedEvidenceCount: 0, lowTraffic: false,
        ...overrides,
      })).toMatchObject({ state: 'extended', windowClosed: false });
    }
  });

  it.each([
    ['invalid opened time', { openedAt: 'not-a-time' }],
    ['backward interval', { evaluatedAt: '2026-06-01T00:00:00Z' }],
    ['negative unresolved count', { unresolvedEvidenceCount: -1 }],
    ['non-boolean traffic', { lowTraffic: 'no' }],
    ['malformed execution', { executions: [{ executionId: '' }] }],
    ['unknown authority state', {
      executions: [{
        ...successfulWindowExecutions(1)[0]!,
        authorityState: 'caller-declared-authority',
      }],
    }],
    ['unknown top-level field', { unboundAuthorityHint: true }],
  ])('returns a typed denial for %s', (_label, overrides) => {
    const input = {
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
      ...overrides,
    } as never;
    expect(evaluateDeepAlignmentRollbackWindow(input)).toEqual({
      state: 'invalid',
      reasonCode: 'EVIDENCE_MALFORMED',
      windowClosed: false,
      evaluationDigest: null,
    });
  });
});

describe('deep alignment independent mode migration gate', () => {
  it('re-derives a passing certificate through real audit, replay, store, verifier, and drill', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate(input);
    expect(result, JSON.stringify(result)).toMatchObject({ verdict: 'pass' });
    expect(result.certificate).toMatchObject({
      mode: 'deep-alignment',
      candidateSha: input.candidateSha,
      baseSha: input.baseSha,
      sharedContractDigest: input.sharedContractDigest,
      writeSetDigest: input.writeSetDigest,
      authorityMutation: false,
      rollbackWindowClosed: false,
      cutoverCertificate: false,
      rollbackAnchorDigest: input.rollback!.rollbackAnchorDigest,
    });
    expect(result.certificate?.dispositions).toHaveLength(5);
    expect(result.certificate?.dispositions.every((entry) => entry.disposition === 'ready')).toBe(true);
  }, 60_000);

  it('treats the reported parity verdict as input rather than authority', async () => {
    const input = await validModeGateInput();
    const reported = input.parity!.modeGateInput as Record<string, unknown>;
    const { gateInputDigest: ignored, ...reportedBody } = reported;
    void ignored;
    const blockedBody = {
      ...reportedBody,
      exitStatus: 'blocked',
      blockingReasonCode: 'FIXTURE_FAILURE',
    };
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      parity: {
        ...input.parity!,
        modeGateInput: { ...blockedBody, gateInputDigest: digest(blockedBody) },
      },
    });
    expect(result).toMatchObject({ verdict: 'pass' });
  }, 60_000);

  it('fails a green receipt over forged evidence at the real authorization audit', async () => {
    const input = await validModeGateInput();
    const forged = await parityFixture(false);
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      parity: {
        manifest: forged.manifest,
        modeGateInput: forged.modeGateInput,
        receipts: [forged.receipt],
        authorizationAuditRootDirectory: forged.harness.rootDirectory,
        authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      },
    });
    expect(forged.receipt.exitStatus).toBe('green');
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      disposition: 'blocked',
      reasonCode: 'AUTHORIZED_PARITY_EVIDENCE_MISSING',
    }));
  }, 60_000);

  it('fails a green receipt when deterministic certificate replay is forged', async () => {
    const input = await validModeGateInput();
    const bundle = structuredClone(
      input.certificates!.verificationInput.bundle,
    ) as DeepAlignmentCertificateBundle;
    bundle.certificate.body.replayFingerprint = digest('tampered-replay');
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      certificates: {
        verificationInput: { ...input.certificates!.verificationInput, bundle },
      },
    });
    expect((input.parity!.receipts[0] as DeepAlignmentParityReceipt).exitStatus).toBe('green');
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      reasonCode: 'CERTIFICATE_RECEIPT_INVALID',
    }));
  }, 60_000);

  it('rejects a caller-forged base SHA against the parity manifest', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      baseSha: 'f'.repeat(40),
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      reasonCode: 'EVIDENCE_STALE',
    }));
  }, 60_000);

  it('rejects an incomplete sealed-artifact kind set through real store reads', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      sealedArtifacts: {
        ...input.sealedArtifacts!,
        bindings: input.sealedArtifacts!.bindings.filter((binding) => (
          binding.artifactKind !== DeepAlignmentArtifactKinds.WITNESS_MATRIX
        )),
      },
    });
    expect(result).toMatchObject({ verdict: 'not_ready', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'sealed_artifacts',
      reasonCode: 'SEALED_ARTIFACT_INVALID',
    }));
  }, 60_000);

  it.each([
    ['candidate SHA', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, candidateSha: 'f'.repeat(40),
    })],
    ['shared contract', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, sharedContractDigest: digest('forged-shared-contract'),
    })],
    ['write set', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, writeSetDigest: digest('forged-write-set'),
    })],
    ['verifier identity', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, verifierIdentity: 'forged-verifier',
    })],
    ['verifier version', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, verifierVersion: 'forged-version',
    })],
    ['rollback anchor', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input, rollback: { ...input.rollback!, rollbackAnchorDigest: digest('forged-anchor') },
    })],
    ['classification', (input: DeepAlignmentModeGateInput<ReplayProjection>) => ({
      ...input,
      rollback: {
        ...input.rollback!,
        classificationManifest: createClassificationManifest({
          classificationId: 'forged-classification',
          classifiedAt: '2026-07-28T12:00:00Z',
          classifierBuildId: 'forged',
          censusBytes: CENSUS_BYTES,
          evidence: CENSUS.rows.map(evidenceFor),
        }).manifest,
      },
    })],
  ] as const)('rejects a caller-forged %s against the verified drill', async (_label, mutate) => {
    const result = await new DeepAlignmentModeMigrationGate().evaluate(
      mutate(await validModeGateInput()),
    );
    expect(result).toMatchObject({ verdict: 'rollback_required', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      reasonCode: 'EVIDENCE_STALE',
    }));
  }, 60_000);

  it.each([
    ['event schema version', { eventSchemaVersion: 'forged-event@999' }],
    ['reducer version', { reducerVersion: 'forged-reducer@999' }],
    ['projection version', { projectionVersion: 'forged-projection@999' }],
  ] as const)('rejects a forged %s against authenticated parity receipts', async (_label, patch) => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      versions: { ...input.versions, ...patch },
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      reasonCode: 'EVIDENCE_STALE',
    }));
  }, 60_000);

  it('rejects forged envelope and authority epochs against replayed events and receipts', async () => {
    const input = await validModeGateInput();
    for (const changed of [
      { ...input, versions: { ...input.versions, eventEnvelopeVersion: 999 } },
      { ...input, authority: { ...input.authority, epoch: 999 } },
    ]) {
      const result = await new DeepAlignmentModeMigrationGate().evaluate(changed);
      expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
      expect(result.dispositions).toContainEqual(expect.objectContaining({
        input: 'certificates_receipts',
        reasonCode: 'EVIDENCE_STALE',
      }));
    }
  }, 60_000);

  it('rejects unknown version and top-level fields before certificate issuance', async () => {
    const input = await validModeGateInput();
    const versionResult = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      versions: { ...input.versions, authorityOverride: 'approve' } as DeepAlignmentVersionBindings,
    });
    const topLevelResult = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      unboundAuthorityHint: 'approve',
    } as DeepAlignmentModeGateInput<ReplayProjection>);
    expect(versionResult).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(topLevelResult).toMatchObject({ verdict: 'blocked', certificate: null });
  }, 60_000);

  it('binds the complete health aggregate into the resulting certificate digest', async () => {
    const input = await validModeGateInput();
    const original = await new DeepAlignmentModeMigrationGate().evaluate(input);
    const changed = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      rollback: {
        ...input.rollback!,
        healthAggregate: {
          ...input.rollback!.healthAggregate,
          severity: 'warning',
          observationId: 'replacement-observation',
          policyDigest: digest('replacement-policy'),
        },
      },
    });
    expect(changed).toMatchObject({ verdict: 'pass' });
    expect(changed.certificate?.certificateDigest).not.toBe(original.certificate?.certificateDigest);
  }, 60_000);

  it('requires a green health aggregate before rollback readiness', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      rollback: {
        ...input.rollback!,
        healthAggregate: {
          ...input.rollback!.healthAggregate,
          state: 'critical',
          severity: 'critical',
        },
      },
    });
    expect(result).toMatchObject({ verdict: 'rollback_required', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      reasonCode: 'HEALTH_NOT_GREEN',
    }));
  }, 60_000);

  it.each([
    ['one unresolved risk', ['unresolved-risk-1']],
    ['multiple unresolved risks', ['risk-alpha', 'risk-beta']],
    ['malformed risk token', ['', 'valid-risk']],
  ] as const)('blocks an otherwise passing gate with %s', async (_label, unresolvedRiskIds) => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      unresolvedRiskIds,
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
  }, 60_000);

  it.each([
    ['one repeated real identity', 'LIFECYCLE_INCOMPLETE'],
    ['one unauthenticated identity', 'EVIDENCE_STALE'],
  ] as const)('rejects lifecycle substitution with %s', async (kind, reasonCode) => {
    const input = await validModeGateInput();
    const first = input.lifecycle[0]!;
    const lifecycle = kind === 'one repeated real identity'
      ? input.lifecycle.map((row) => ({ ...first, kind: row.kind }))
      : input.lifecycle.map((row, index) => index === input.lifecycle.length - 1
        ? { ...row, eventDigest: digest('unauthenticated-event'),
            receiptDigest: digest('unauthenticated-receipt') }
        : row);
    const result = await new DeepAlignmentModeMigrationGate().evaluate({ ...input, lifecycle });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      reasonCode,
    }));
  }, 60_000);

  it('compares complete resume semantics rather than selected summary fields', async () => {
    const input = await validModeGateInput();
    const resume = input.resumeEvidence!;
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: {
        ...resume,
        ledgerDecision: {
          ...resume.ledgerDecision,
          invalidation: {
            ...resume.ledgerDecision.invalidation,
            authorityChanged: true,
            reopenedProofIds: ['ledger-only-proof'],
          },
        },
      },
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      reasonCode: 'RESUME_INVALID',
    }));
  }, 60_000);

  it.each([
    ['null input', null, 'rollback_required'],
    ['array input', [], 'blocked'],
    ['forbidden prototype', Object.create({ authority: 'approve' }), 'blocked'],
    ['non-finite nested input', {
      rollbackWindow: { evaluatedAt: Number.POSITIVE_INFINITY },
    }, 'blocked'],
  ] as const)('never throws for malformed %s', async (_label, malformed, verdict) => {
    const result = await new DeepAlignmentModeMigrationGate().evaluate(
      malformed as DeepAlignmentModeGateInput<ReplayProjection>,
    );
    expect(result).toMatchObject({ verdict, certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      disposition: 'rollback_required',
      reasonCode: 'EVIDENCE_MALFORMED',
    }));
  });

  it('maps every absent evidence bucket to its typed fail-closed disposition', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAlignmentModeMigrationGate().evaluate({
      ...input,
      parity: null,
      sealedArtifacts: null,
      certificates: null,
      resumeEvidence: null,
      lifecycle: [],
      rollback: null,
    });
    expect(result.certificate).toBeNull();
    expect(result.dispositions.map((entry) => [entry.input, entry.disposition, entry.reasonCode]))
      .toEqual([
        ['shadow_parity', 'blocked', 'EVIDENCE_MISSING'],
        ['sealed_artifacts', 'not_ready', 'EVIDENCE_MISSING'],
        ['certificates_receipts', 'blocked', 'EVIDENCE_MISSING'],
        ['lifecycle_resume', 'blocked', 'RESUME_INVALID'],
        ['rollback_readiness', 'rollback_required', 'EVIDENCE_MISSING'],
      ]);
  }, 60_000);
});

describe('deep alignment externally authorized rollback switch', () => {
  it('authorizes only the real external gateway path and remains additive-dark', async () => {
    const allowedFixture = await rollbackRequestFixture();
    const allowed = await allowedFixture.rollbackSwitch.requestRollback(allowedFixture.input);
    expect(allowed).toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied',
      certificate: expect.objectContaining({
        mode: 'deep-alignment',
        admissionFrozen: true,
        staleWriterDenied: true,
        eventDeletionCount: 0,
        artifactRewriteCount: 0,
        authorityMutation: false,
        phase014RestorationRequired: true,
      }),
    });

    const deniedFixture = await rollbackRequestFixture({
      capabilityId: 'self-authorized-recovery',
    });
    const denied = await deniedFixture.rollbackSwitch.requestRollback(deniedFixture.input);
    expect(denied).toMatchObject({
      disposition: 'denied',
      reasonCode: 'AUTHORIZATION_DENIED',
      certificate: null,
      authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied',
    });
    expect(denied.gatewayDecisionId).toMatch(/^decision-/u);
  }, 60_000);

  it.each([
    'rollback',
    'unquarantine',
    'verifier-replacement',
    'authority-restoration',
  ] as const)('denies self-authorized %s through the real policy registry', async (operation) => {
    const fixture = await rollbackRequestFixture({
      capabilityId: 'self-authorized-recovery',
      operation,
    });
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'AUTHORIZATION_DENIED',
      certificate: null,
    });
    expect(result.gatewayDecisionId).toMatch(/^decision-/u);
  }, 60_000);

  it('rejects a self-consistent invented migration certificate and accepts the genuine control', async () => {
    const fixture = await rollbackRequestFixture();
    const genuine = fixture.input.gateCertificate!;
    const forged = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      gateCertificate: forgedMigrationCertificate(genuine),
    });
    const control = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(forged).toMatchObject({
      disposition: 'denied',
      reasonCode: 'ABSENT_GATE_CERTIFICATE',
      certificate: null,
    });
    expect(control).toMatchObject({
      disposition: 'authorized',
      reasonCode: null,
      certificate: expect.objectContaining({ certificateKind: 'non-destructive-rollback' }),
    });
  }, 60_000);

  it.each([
    ['configurationVersion', (input: DeepAlignmentRollbackRequest) => ({
      ...input, configurationVersion: 'different-policy@1',
    }), 'EVIDENCE_INCOMPLETE'],
    ['operation', (input: DeepAlignmentRollbackRequest) => ({
      ...input, operation: 'unquarantine' as const,
    }), 'EVIDENCE_INCOMPLETE'],
    ['currentAuthority', (input: DeepAlignmentRollbackRequest) => ({
      ...input, currentAuthority: { state: 'cutover_ready', epoch: 1 },
    }), 'EVIDENCE_INCOMPLETE'],
    ['expectedAuthorityEpoch', (input: DeepAlignmentRollbackRequest) => ({
      ...input, expectedAuthorityEpoch: 2,
    }), 'STALE_AUTHORITY_EPOCH'],
    ['authorizationRequest', (input: DeepAlignmentRollbackRequest) => ({
      ...input,
      authorizationRequest: {
        ...input.authorizationRequest!,
        evidenceDigest: digest('forged-authorization-evidence'),
      },
    }), 'EVIDENCE_INCOMPLETE'],
    ['rollbackReason', (input: DeepAlignmentRollbackRequest) => ({
      ...input, rollbackReason: 'Changed after authorization.',
    }), 'EVIDENCE_INCOMPLETE'],
    ['admissionState', (input: DeepAlignmentRollbackRequest) => ({
      ...input, admissionState: 'open' as const,
    }), 'EVIDENCE_INCOMPLETE'],
    ['classificationManifest', (input: DeepAlignmentRollbackRequest) => ({
      ...input,
      classificationManifest: createClassificationManifest({
        classificationId: 'replacement-classification',
        classifiedAt: '2026-07-28T12:00:00Z',
        classifierBuildId: 'replacement',
        censusBytes: CENSUS_BYTES,
        evidence: CENSUS.rows.map(evidenceFor),
      }).manifest,
    }), 'EVIDENCE_INCOMPLETE'],
    ['resumeEvidence', (input: DeepAlignmentRollbackRequest) => ({
      ...input,
      resumeEvidence: {
        ...input.resumeEvidence!,
        legacyEventTailDigest: digest('replacement-tail'),
      },
    }), 'EVIDENCE_INCOMPLETE'],
    ['writerResource', (input: DeepAlignmentRollbackRequest) => ({
      ...input,
      writerResource: {
        kind: ProtectedResourceKinds.WRITER,
        components: { writerId: 'replacement-writer' },
        atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      },
    }), 'EVIDENCE_INCOMPLETE'],
    ['rollbackAnchorDigest', (input: DeepAlignmentRollbackRequest) => ({
      ...input, rollbackAnchorDigest: digest('replacement-anchor'),
    }), 'EVIDENCE_INCOMPLETE'],
    ['retainedEventCountBefore', (input: DeepAlignmentRollbackRequest) => ({
      ...input, retainedEventCountBefore: 777, retainedEventCountAfter: 777,
    }), 'EVIDENCE_INCOMPLETE'],
    ['retainedArtifactCountBefore', (input: DeepAlignmentRollbackRequest) => ({
      ...input, retainedArtifactCountBefore: 777, retainedArtifactCountAfter: 777,
    }), 'EVIDENCE_INCOMPLETE'],
    ['destructiveIntent', (input: DeepAlignmentRollbackRequest) => ({
      ...input, destructiveIntent: 'truncate-ledger' as const,
    }), 'DESTRUCTIVE_ROLLBACK_REJECTED'],
  ] as const)('rejects a post-authorization %s change with %s', async (
    _field,
    mutate,
    reasonCode,
  ) => {
    const fixture = await rollbackRequestFixture();
    const result = await fixture.rollbackSwitch.requestRollback(mutate(fixture.input));
    expect(result).toMatchObject({ disposition: 'denied', reasonCode, certificate: null });
  }, 60_000);

  it('rejects a post-certificate gate-input health swap', async () => {
    const fixture = await rollbackRequestFixture();
    const gateInput = fixture.input.gateInput!;
    const result = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      gateInput: {
        ...gateInput,
        rollback: {
          ...gateInput.rollback!,
          healthAggregate: {
            ...gateInput.rollback!.healthAggregate,
            observationId: 'post-certificate-observation',
            policyDigest: digest('post-certificate-policy'),
          },
        },
      },
    });
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'ABSENT_GATE_CERTIFICATE',
      certificate: null,
    });
  }, 60_000);

  it('binds stale lease identity rather than accepting resource membership', async () => {
    const fixture = await rollbackRequestFixture();
    const replacementLease = await fixture.coordinator.acquire({
      resource: fixture.input.writerResource!,
      ownerId: 'replacement-stale-writer',
      correlationId: 'replacement-stale-writer',
      ttlMs: 60_000,
      acquireTimeoutMs: 1_000,
    });
    await fixture.coordinator.release(replacementLease);
    const result = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      staleWriterLease: replacementLease,
    });
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  }, 60_000);

  it('requires stale-token supersession against the real coordinator high-water mark', async () => {
    const staleFixture = await rollbackRequestFixture({ staleFenceToken: 10_000 });
    const denied = await staleFixture.rollbackSwitch.requestRollback(staleFixture.input);
    expect(denied).toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });

    const controlFixture = await rollbackRequestFixture();
    const priorToken = controlFixture.input.staleWriterLease!.fenceToken;
    const allowed = await controlFixture.rollbackSwitch.requestRollback(controlFixture.input);
    expect(allowed).toMatchObject({ disposition: 'authorized', reasonCode: null });
    expect(allowed.certificate?.writerFenceToken).toBeGreaterThan(priorToken);
  }, 60_000);

  it('rejects a freshly authorized resource not owned by the alignment writer', async () => {
    const fixture = await rollbackRequestFixture({
      writerResource: {
        kind: ProtectedResourceKinds.WRITER,
        components: { writerId: 'unrelated-ledger-writer' },
        atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      },
    });
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  }, 60_000);

  it.each([
    ['empty identity', (lease: object) => ({ ...lease, leaseId: '' })],
    ['wrong identity types', (lease: object) => ({
      ...lease, ownerId: 42, correlationId: {},
    })],
    ['unparseable timestamp', (lease: object) => ({
      ...lease, renewedAt: 'not-a-time',
    })],
    ['non-monotonic timestamp', (lease: object) => ({
      ...lease,
      acquiredAt: '2026-07-28T12:00:00Z',
      renewedAt: '2026-07-28T11:59:59Z',
      expiresAt: '2026-07-28T12:01:00Z',
    })],
    ['non-finite token', (lease: object) => ({
      ...lease, fenceToken: Number.POSITIVE_INFINITY,
    })],
    ['unknown lease field', (lease: object) => ({
      ...lease, authorityOverride: true,
    })],
  ])('returns WRITER_FENCE_FAILED for %s without throwing', async (_label, mutate) => {
    const fixture = await rollbackRequestFixture();
    const result = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      staleWriterLease: mutate(fixture.input.staleWriterLease!) as never,
    });
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  }, 60_000);

  it('returns typed denials for malformed certificate, resume, and lease evidence', async () => {
    const fixture = await rollbackRequestFixture();
    for (const variant of ['circular', 'non-finite'] as const) {
      const cases: readonly [DeepAlignmentRollbackRequest, string][] = [
        [{
          ...fixture.input,
          gateCertificate: malformedEvidence(fixture.input.gateCertificate!, variant),
        }, 'ABSENT_GATE_CERTIFICATE'],
        [{
          ...fixture.input,
          resumeEvidence: malformedEvidence(fixture.input.resumeEvidence!, variant),
        }, 'EVIDENCE_INCOMPLETE'],
        [{
          ...fixture.input,
          staleWriterLease: malformedEvidence(fixture.input.staleWriterLease!, variant),
        }, 'WRITER_FENCE_FAILED'],
      ];
      for (const [input, reasonCode] of cases) {
        await expect(fixture.rollbackSwitch.requestRollback(input)).resolves.toMatchObject({
          disposition: 'denied',
          reasonCode,
          certificate: null,
        });
      }
    }
  }, 60_000);

  it.each([
    ['null request', null],
    ['array request', []],
    ['forbidden prototype', Object.create({ inheritedAuthority: true })],
    ['unknown request field', { unboundAuthorityHint: true }],
  ])('returns EVIDENCE_INCOMPLETE for %s without throwing', async (_label, malformed) => {
    const fixture = await rollbackRequestFixture();
    const input = _label === 'unknown request field'
      ? { ...fixture.input, ...(malformed as object) }
      : malformed;
    await expect(fixture.rollbackSwitch.requestRollback(
      input as DeepAlignmentRollbackRequest,
    )).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  }, 60_000);

  it('keeps the real acquire-contention fence against a live competing writer', async () => {
    const fixture = await rollbackRequestFixture();
    const competingLease = await fixture.coordinator.acquire({
      resource: fixture.input.writerResource!,
      ownerId: 'live-competing-writer',
      correlationId: 'live-competing-writer',
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
  }, 60_000);

  it.each([
    ['truncate-ledger', 'DESTRUCTIVE_ROLLBACK_REJECTED'],
    ['rewrite-sealed-artifact', 'DESTRUCTIVE_ROLLBACK_REJECTED'],
    ['non-reproduction-proof', 'DESTRUCTIVE_ROLLBACK_REJECTED'],
  ] as const)('rejects destructive intent %s with %s', async (intent, reasonCode) => {
    const fixture = await rollbackRequestFixture();
    const result = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      destructiveIntent: intent,
    });
    expect(result).toMatchObject({ disposition: 'denied', reasonCode, certificate: null });
  }, 60_000);

  it('maps a real authority-provider outage to GATEWAY_FAILURE', async () => {
    const fixture = await rollbackRequestFixture({ gatewayUnavailable: true });
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({
      disposition: 'denied',
      reasonCode: 'GATEWAY_FAILURE',
      certificate: null,
    });
  }, 60_000);

  it('fails closed with exact typed codes for every early request boundary', async () => {
    const fixture = await rollbackRequestFixture();
    const cases: readonly [DeepAlignmentRollbackRequest, string][] = [
      [{}, 'MISSING_CONFIGURATION'],
      [{ configurationVersion: 'v1', operation: 'not-real' as never,
        currentAuthority: { state: 'legacy_authoritative', epoch: 1 },
        expectedAuthorityEpoch: 1 }, 'UNKNOWN_STATE'],
      [{ configurationVersion: 'v1', operation: 'rollback',
        currentAuthority: { state: 'legacy_authoritative', epoch: 1 },
        expectedAuthorityEpoch: 2 }, 'STALE_AUTHORITY_EPOCH'],
      [{ configurationVersion: 'v1', operation: 'rollback',
        currentAuthority: { state: 'legacy_authoritative', epoch: 1 },
        expectedAuthorityEpoch: 1, gateCertificate: null }, 'ABSENT_GATE_CERTIFICATE'],
      [{ ...fixture.input, rollbackReason: '' }, 'EVIDENCE_INCOMPLETE'],
      [{ ...fixture.input, retainedEventCountAfter: 19 }, 'DESTRUCTIVE_ROLLBACK_REJECTED'],
    ];
    for (const [input, reasonCode] of cases) {
      expect(await fixture.rollbackSwitch.requestRollback(input)).toMatchObject({
        disposition: 'denied',
        reasonCode,
        authorityState: 'legacy_authoritative',
        ledgerAuthority: 'denied',
        certificate: null,
      });
    }
  }, 60_000);

  it('rejects a stale writer epoch at the real transition gateway high-water mark', async () => {
    const harness = await gatewayHarness({ state: 'legacy_authoritative', epoch: 2 });
    const staleEvent = createFixtureEvent(harness.registry, 1, { authority_epoch: 1 });
    const staleRequest: TransitionAuthorizationRequest = await createFixtureRequest(
      harness.ledger,
      staleEvent,
      harness.policies,
      'stale-writer-after-restoration',
      { mode: 'deep-alignment', authorityEpoch: 1 },
    );
    await expect(harness.gateway.authorize(staleRequest)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: 'stale_authority_epoch',
    });
  });

  it('emits no rollback certificate and mutates no rollback state when identity is unverified', async () => {
    const fixture = await rollbackRequestFixture({ omitIdentityResolver: true });
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
