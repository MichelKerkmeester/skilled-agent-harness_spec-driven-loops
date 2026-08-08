// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Certificate Contract Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES,
  DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER,
  DeepAlignmentCertificateFailureCodes,
  DeepAlignmentTransitionKinds,
  issueDeepAlignmentRunCertificate,
  parseDeepAlignmentCertificateBundle,
  verifyDeepAlignmentCertificateOffline,
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
  DeepAlignmentArtifactKinds,
  createDeepAlignmentSealedArtifactStore,
  deepAlignmentDependency,
  sealDeepAlignmentArtifact,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
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
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';
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
  DeepAlignmentArtifactDependency,
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentSealedArtifactBinding,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

type ReplayProjection = DeepAlignmentProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepAlignmentCertificateBundle;
  readonly verification: DeepAlignmentOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepAlignmentSealedArtifactStore>;
  readonly materials: ReadonlyMap<DeepAlignmentArtifactKind, DeepAlignmentArtifactMaterial>;
  readonly primaryBindings: ReadonlyMap<
    DeepAlignmentArtifactKind,
    DeepAlignmentSealedArtifactBinding
  >;
}

interface ScenarioOptions {
  readonly terminalStatus?: 'completed' | 'incomplete';
}

const TIMESTAMP = '2026-07-27T10:00:00.000Z';
const RUN_ID = 'alignment-certificate-run-1';
const SESSION_ID = 'alignment-certificate-session-1';
const STREAM_ID = 'deep-alignment-certificate-run-1';
const AUTHORITY_EPOCH_ID = 'authority-epoch-1';
const SUBJECT_DIGEST = digest('subject-snapshot');
const APPLICABILITY_DECISION_DIGEST = digest('applicability-decision');
const DIMENSION_COVERAGE_DIGEST = digest('dimension-coverage');
const REPORT_DIGEST = digest('report');
const CONTINUITY_PAYLOAD_DIGEST = digest('continuity-payload');
const TEST_PRODUCER = Object.freeze({
  name: 'deep-alignment-certificate-tests',
  version: '1',
});
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-certificate-${label}-`));
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
  return {
    runId: RUN_ID,
    sessionId: SESSION_ID,
    authorityEpochId: AUTHORITY_EPOCH_ID,
  };
}

function iterationScope() {
  return {
    ...baseScope(),
    generation: 1,
    iterationId: 'iteration-1',
  };
}

function laneScope() {
  return {
    ...iterationScope(),
    laneId: 'lane-1',
  };
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
  const eventId = `alignment-certificate-event-${String(sequence).padStart(3, '0')}`;
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
      : `alignment-certificate-event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `alignment-certificate-event-${sequence}`,
  }, createDeepAlignmentEventRegistry()).envelope as DeepAlignmentEventEnvelope<TStem>;
}

function projectionEvents(
  options: ScenarioOptions = {},
): readonly DeepAlignmentLedgerEvent[] {
  const events: DeepAlignmentLedgerEvent[] = [];
  const append = <TStem extends DeepAlignmentEventStem>(
    stem: TStem,
    scope: DeepAlignmentScopeMap[TStem],
    data: DeepAlignmentPayloadMap[TStem],
  ): void => {
    events.push(createEvent(stem, events.length + 1, scope, data));
  };

  append('deep_alignment.run_initialized', {
    ...baseScope(),
    generation: 1,
  }, {
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
  });
  append('deep_alignment.authority_reference_bound', baseScope(), {
    authorityId: 'authority-main',
    authorityCapsuleRef: 'authority-capsule-1',
    authoritySourceDigest: digest('authority-source'),
    compilerFingerprint: digest('authority-compiler'),
    profileDigest: digest('authority-profile'),
    ruleIrDigest: digest('rule-ir'),
    signatureDigest: digest('authority-signature'),
    expiresAt: '2027-07-27T10:00:00.000Z',
    rollbackRef: null,
  });
  append('deep_alignment.authority_validation_recorded', baseScope(), {
    authorityReferenceEventId: 'alignment-certificate-event-002',
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
  });
  append('deep_alignment.scope_resolved', baseScope(), {
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
  });
  append('deep_alignment.dimension_ordered', baseScope(), {
    orderedDimensionIds: ['alignment'],
    riskRationale: 'Authority-backed alignment is the required dimension.',
    scopeEvidenceRefs: ['evidence:scope'],
    orderingPolicyVersion: 'dimension-order@1',
  });
  append('deep_alignment.lane_plan_recorded', laneScope(), {
    laneKind: 'schema',
    orderedRuleIds: ['rule-1'],
    ruleIrRef: 'rule-ir:1',
    ruleIrDigest: digest('rule-ir'),
    verifierPolicyVersion: 'verifier-policy@1',
    budgetRef: 'budget:lane-1',
    requiredEvidenceClasses: ['schema-witness'],
    planDigest: digest('lane-plan'),
  });
  append('deep_alignment.lane_started', laneScope(), {
    lanePlanEventId: 'alignment-certificate-event-006',
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'alignment-certificate-event-003',
    authorityValidationDigest: digest('authority-validation'),
    status: 'started',
  });
  append('deep_alignment.subject_snapshot_bound', {
    ...laneScope(),
    subjectId: 'subject-1',
  }, {
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectType: 'file',
    subjectDigest: SUBJECT_DIGEST,
    sourceVersionRef: 'source-version-1',
    capturedAt: TIMESTAMP,
    parentSnapshotRef: null,
    receiptRef: 'receipt:subject',
  });
  append('deep_alignment.applicability_evaluated', {
    ...laneScope(),
    subjectId: 'subject-1',
    ruleId: 'rule-1',
  }, {
    predicateRef: 'predicate:rule-1',
    predicateDigest: digest('predicate'),
    targetFactRefs: ['target-fact:language'],
    targetFactDigest: digest('target-facts'),
    result: 'applicable',
    evaluatorFingerprint: digest('applicability-evaluator'),
    authorityValidationEventId: 'alignment-certificate-event-003',
    decisionDigest: APPLICABILITY_DECISION_DIGEST,
    reasonCode: 'subject-matches-rule',
  });
  append('deep_alignment.dimension_pass_started', {
    ...iterationScope(),
    dimensionId: 'alignment',
  }, {
    passNumber: 1,
    targetRefs: ['target:subject-1'],
    filesReviewed: ['file:subject-1'],
    searchCoverageDigest: digest('pass-coverage'),
    passStatus: 'started',
    nextFocusRef: 'focus:rule-1',
  });
  append('deep_alignment.observation_recorded', subjectScope(), {
    applicabilityDecisionId: 'alignment-certificate-event-009',
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    detectorFingerprint: digest('detector'),
    observationKind: 'schema',
    rawResultDigest: digest('raw-observation'),
    sourceDigest: digest('subject-source'),
    contentDigest: digest('observation-content'),
    evidenceClass: 'schema-witness',
    freshness: 'fresh',
    causalRelevance: 'direct',
    locator: {
      scheme: 'file',
      artifactRef: 'artifact:subject-1',
      locatorDigest: digest('observation-locator'),
      selector: 'symbol:observation-1',
      revision: 'revision-1',
    },
    receiptRefs: ['receipt:observation-1'],
  });
  append('deep_alignment.applicability_coverage_recorded', laneScope(), {
    authorityValidationEventId: 'alignment-certificate-event-003',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    declaredApplicabilityEdgeRefs: ['edge:rule-1-subject-1'],
    applicableRuleIds: ['rule-1'],
    notApplicableRuleIds: [],
    unresolvedRuleIds: [],
    untestedRuleIds: [],
    blockedRuleIds: [],
    coverageDigest: digest('applicability-coverage'),
  });
  append('deep_alignment.dimension_pass_completed', {
    ...iterationScope(),
    dimensionId: 'alignment',
  }, {
    passNumber: 1,
    targetRefs: ['target:subject-1'],
    filesReviewed: ['file:subject-1'],
    searchCoverageDigest: digest('pass-coverage'),
    passStatus: 'complete',
    rawFindingCounts: {
      candidates: 0,
      adjudicated: 0,
      p0: 0,
      p1: 0,
      p2: 0,
    },
    nextFocusRef: 'focus:convergence',
  });
  append('deep_alignment.lane_completed', laneScope(), {
    lanePlanEventId: 'alignment-certificate-event-006',
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'alignment-certificate-event-003',
    applicabilityDecisionRefs: ['alignment-certificate-event-009'],
    observationRefs: ['alignment-certificate-event-011'],
    verificationRefs: [],
    status: 'complete',
    counts: {
      applicable: 1,
      notApplicable: 0,
      unresolved: 0,
      untested: 0,
      blocked: 0,
      nonConformant: 0,
    },
    completionDigest: digest('lane-completion'),
    blockedReasonCode: null,
  });
  append('deep_alignment.convergence_evaluated', iterationScope(), {
    rawSignals: convergenceSignals('raw'),
    weightedSignals: convergenceSignals('weighted'),
    dimensionCoverageDigest: DIMENSION_COVERAGE_DIGEST,
    protocolCoverageDigest: digest('protocol-coverage'),
    findingStability: 'stable',
    p0p1ResolutionState: 'resolved',
    evidenceDensity: 1,
    hotspotSaturation: 1,
    decision: 'converged',
    policyFingerprint: digest('convergence-policy'),
    blockerIds: [],
    stopCandidate: true,
  });
  append('deep_alignment.synthesis_started', {
    ...baseScope(),
    reportRevisionId: 'report-1',
  }, {
    finalizedEventRange: {
      firstEventId: 'alignment-certificate-event-001',
      lastEventId: 'alignment-certificate-event-015',
    },
    findingRegistryInputDigest: digest('registry-input'),
    deduplicationPolicyDigest: digest('dedup-policy'),
    verdictInputDigests: [digest('verdict-input')],
    unresolvedFindingIds: [],
    deferredFindingIds: [],
  });
  append('deep_alignment.review_report_committed', {
    ...baseScope(),
    reportRevisionId: 'report-1',
  }, {
    finalizedEventRange: {
      firstEventId: 'alignment-certificate-event-001',
      lastEventId: 'alignment-certificate-event-016',
    },
    findingRegistryInputDigest: digest('registry-input'),
    deduplicationPolicyDigest: digest('dedup-policy'),
    verdictInputDigests: [digest('verdict-input')],
    unresolvedFindingIds: [],
    deferredFindingIds: [],
    reportDigest: REPORT_DIGEST,
    sectionManifest: {
      sectionIds: ['authority', 'alignment'],
      manifestDigest: digest('section-manifest'),
    },
    reportReceiptRef: 'receipt:report',
  });
  append('deep_alignment.continuity_save_requested', baseScope(), {
    targetPacket: 'system-deep-loop/target',
    continuityPayloadDigest: CONTINUITY_PAYLOAD_DIGEST,
    sourceEventRange: {
      firstEventId: 'alignment-certificate-event-001',
      lastEventId: 'alignment-certificate-event-017',
    },
    route: 'implementation-summary',
    mergeMode: 'update-in-place',
  });
  append('deep_alignment.continuity_save_completed', baseScope(), {
    targetPacket: 'system-deep-loop/target',
    continuityPayloadDigest: CONTINUITY_PAYLOAD_DIGEST,
    sourceEventRange: {
      firstEventId: 'alignment-certificate-event-001',
      lastEventId: 'alignment-certificate-event-018',
    },
    route: 'implementation-summary',
    mergeMode: 'update-in-place',
    persistenceReceiptRefs: ['receipt:continuity'],
    continuityFingerprint: digest('continuity'),
  });
  const terminalStatus = options.terminalStatus ?? 'completed';
  append('deep_alignment.run_completed', baseScope(), {
    terminalStatus,
    convergenceEventId: 'alignment-certificate-event-015',
    synthesisEventId: 'alignment-certificate-event-016',
    reportEventId: 'alignment-certificate-event-017',
    continuityEventId: 'alignment-certificate-event-019',
    finalLedgerTailHash: digest('previous:20'),
    counts: {
      dimensions: 1,
      iterations: 1,
      candidates: 0,
      findings: 0,
      evidence: 1,
    },
    verdict: terminalStatus === 'completed' ? 'pass' : 'incomplete',
    completionReason: terminalStatus === 'completed'
      ? 'All required alignment checks completed.'
      : null,
    incompleteReason: terminalStatus === 'incomplete'
      ? 'The run stopped without a terminal passing disposition.'
      : null,
  });
  return Object.freeze(events);
}

async function authorizedLedger(events: readonly DeepAlignmentLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepAlignmentEventDefinitions());
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
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepAlignmentEvent({
      stem: event.payload.stem,
      scope: event.payload.scope,
      prevEventHash: event.payload.prevEventHash,
      replay: event.payload.replay,
      data: event.payload.data,
      eventId: event.event_id,
      streamId: event.stream_id,
      streamSequence: event.stream_sequence,
      occurredAt: event.occurred_at,
      recordedAt: event.recorded_at,
      producer: event.producer,
      authorityEpoch: event.authority_epoch,
      correlationId: event.correlation_id,
      causationId: event.causation_id,
      idempotencyKey: event.idempotency_key,
    }, registry);
    const request = await createFixtureRequest(
      ledger,
      prepared,
      policies,
      `alignment-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new Error('Expected fixture authorization');
    }
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
  });
  const ledgerLease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-alignment-certificate-writer',
    correlationId: 'deep-alignment-certificate-writer',
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => ledgerLease,
    },
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'alignment',
      priorStateVersion: 'deep-alignment-certificate-state@1',
      priorStateFingerprint: digest('deep-alignment-certificate-state'),
      actorId: 'deep-alignment-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
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

function baseMaterial(
  artifactKind: DeepAlignmentArtifactKind,
  suffix = 'primary',
) {
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
    rootDirectory: temporaryRoot('artifacts'),
  });
  const bindings: DeepAlignmentSealedArtifactBinding[] = [];
  const materials = new Map<DeepAlignmentArtifactKind, DeepAlignmentArtifactMaterial>();
  const primaryBindings = new Map<
    DeepAlignmentArtifactKind,
    DeepAlignmentSealedArtifactBinding
  >();
  const addPrimary = async (
    kind: DeepAlignmentArtifactKind,
    material: DeepAlignmentArtifactMaterial,
  ) => {
    const binding = await seal(artifactStore, kind, material);
    bindings.push(binding);
    materials.set(kind, material);
    primaryBindings.set(kind, binding);
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
  const authority = await addPrimary(
    DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
    authorityMaterial,
  );
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
  const lane = await addPrimary(
    DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
    laneMaterial,
  );
  const ruleMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.RULE_MANIFEST),
    manifestId: 'rule-manifest-1',
    orderedRuleIds: ['rule-1'],
    compilerFingerprint: digest('authority-compiler'),
    ruleIrDigest: digest('rule-ir'),
    applicabilityPolicyDigest: digest('applicability-policy'),
    ruleSchemaVersion: 'rules@1',
  };
  const rule = await addPrimary(
    DeepAlignmentArtifactKinds.RULE_MANIFEST,
    ruleMaterial,
  );
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
  const target = await addPrimary(
    DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
    targetMaterial,
  );
  const applicabilityMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION),
    materialDigest: APPLICABILITY_DECISION_DIGEST,
    dependencies: [dependency(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, target)],
    decisionId: 'alignment-certificate-event-009',
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
  const applicability = await addPrimary(
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
  const discovery = await addPrimary(
    DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST,
    discoveryMaterial,
  );
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
  const detector = await addPrimary(
    DeepAlignmentArtifactKinds.DETECTOR_INPUT,
    detectorMaterial,
  );
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
  const verifier = await addPrimary(
    DeepAlignmentArtifactKinds.VERIFIER_INPUT,
    verifierMaterial,
  );
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
  const witness = await addPrimary(
    DeepAlignmentArtifactKinds.WITNESS_MATRIX,
    witnessMaterial,
  );
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
  const finding = await addPrimary(
    DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
    findingMaterial,
  );
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
  const exception = await addPrimary(
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
    dependency(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, exception),
  ];
  const convergenceMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT),
    dependencies: convergenceDependencies,
    snapshotId: 'convergence-1',
    laneId: 'lane-1',
    orderedInputDigests: convergenceDependencies.map(
      (entry) => entry.reference.content_digest,
    ),
    coverageDigest: DIMENSION_COVERAGE_DIGEST,
    stabilityDigest: digest('stability'),
    findingsViewDigest: finding.reference.content_digest,
    exceptionViewDigest: exception.reference.content_digest,
    unresolvedFindingDigests: [finding.reference.content_digest],
    laneVerdict: 'conformant' as const,
    evaluatorVersion: 'evaluator@1',
    watermarkDigest: digest('convergence-watermark'),
  };
  const convergence = await addPrimary(
    DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT,
    convergenceMaterial,
  );
  const reportMaterial = {
    ...baseMaterial(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT),
    materialDigest: REPORT_DIGEST,
    dependencies: [
      dependency(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, convergence),
      dependency(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, finding),
      dependency(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, exception),
    ],
    reportId: 'report-1',
    laneId: 'lane-1',
    orderedInputDigests: [
      convergence.reference.content_digest,
      finding.reference.content_digest,
      exception.reference.content_digest,
    ],
    convergenceSnapshotDigest: convergence.reference.content_digest,
    findingsViewDigest: finding.reference.content_digest,
    exceptionViewDigest: exception.reference.content_digest,
    unresolvedFindingDigests: [finding.reference.content_digest],
    laneVerdict: 'conformant' as const,
    overallVerdict: 'conformant' as const,
    reportDigest: REPORT_DIGEST,
    reportRef: 'artifact:alignment-report-1',
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  };
  const report = await addPrimary(
    DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
    reportMaterial,
  );
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
  const handoff = await addPrimary(
    DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF,
    handoffMaterial,
  );

  const extras: DeepAlignmentSealedArtifactBinding[] = [];
  const addExtra = async (
    kind: DeepAlignmentArtifactKind,
    material: DeepAlignmentArtifactMaterial,
  ) => {
    const binding = await seal(artifactStore, kind, material);
    bindings.push(binding);
    extras.push(binding);
    return binding;
  };
  const authorityValidation = await addExtra(
    DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
    {
      ...authorityMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, 'validation'),
      authorityId: 'authority-validation-evidence',
      materialRef: 'authority-capsule-validation',
    },
  );
  const dimensionLane = await addExtra(
    DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
    {
      ...laneMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'dimension'),
    },
  );
  const subjectTarget = await addExtra(
    DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
    {
      ...targetMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, 'subject'),
      subjectDigest: SUBJECT_DIGEST,
    },
  );
  const passStartDiscovery = await addExtra(
    DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST,
    {
      ...discoveryMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, 'pass-start'),
      manifestId: 'discovery-pass-start',
    },
  );
  const coverageApplicability = await addExtra(
    DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    {
      ...applicabilityMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, 'coverage'),
      dependencies: applicabilityMaterial.dependencies,
      decisionId: 'coverage-decision',
      materialDigest: digest('coverage-decision'),
    },
  );
  const passCompleteDiscovery = await addExtra(
    DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST,
    {
      ...discoveryMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, 'pass-complete'),
      manifestId: 'discovery-pass-complete',
    },
  );
  const laneComplete = await addExtra(
    DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
    {
      ...laneMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'complete'),
    },
  );
  const synthesisConvergence = await addExtra(
    DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT,
    {
      ...convergenceMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'synthesis'),
      dependencies: convergenceMaterial.dependencies,
      snapshotId: 'convergence-synthesis',
    },
  );
  const continuityHandoff = await addExtra(
    DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF,
    {
      ...handoffMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'continuity'),
      dependencies: handoffMaterial.dependencies,
      handoffId: 'handoff-continuity',
    },
  );
  const completionReport = await addExtra(
    DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
    {
      ...reportMaterial,
      ...baseMaterial(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'completion'),
      materialDigest: REPORT_DIGEST,
      dependencies: reportMaterial.dependencies,
      reportId: 'report-completion',
      reportDigest: REPORT_DIGEST,
    },
  );
  return {
    artifactStore,
    bindings: Object.freeze(bindings),
    materials,
    primaryBindings,
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
    completionInputs: Object.freeze([verifier, witness, finding, exception]),
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
    resultEventId: `alignment-certificate-event-${String(index + 1).padStart(3, '0')}`,
    inputArtifactQualifiedDigests: transitionKind === DeepAlignmentTransitionKinds.COMPLETION
      ? completionInputs.map((binding) => binding.reference.qualified_digest)
      : [],
    outputArtifactQualifiedDigests: [
      (outputs[index] as DeepAlignmentSealedArtifactBinding).reference.qualified_digest,
    ],
  })));
}

function certificationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-alignment-test-provider',
      key_id: 'deep-alignment-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

async function scenario(options: ScenarioOptions = {}): Promise<Scenario> {
  const events = projectionEvents(options);
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
      replayInputDigests: {
        initial_state: digest(initialState),
      },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepAlignmentRunCertificate({
    runId: RUN_ID,
    sessionId: SESSION_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: artifacts.artifactStore,
    artifactBindings: artifacts.bindings,
    transitionReceipts: transitionInputs(
      artifacts.eventOutputs,
      artifacts.completionInputs,
    ),
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'deep-alignment-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    artifactStore: artifacts.artifactStore,
    materials: artifacts.materials,
    primaryBindings: artifacts.primaryBindings,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: artifacts.artifactStore,
      replay,
      providers,
    },
  };
}

function replaceReference(
  references: readonly string[],
  prior: string,
  replacement: string,
): readonly string[] {
  return references.map((reference) => reference === prior ? replacement : reference);
}

function bundleWithBinding(
  fixture: Scenario,
  prior: DeepAlignmentSealedArtifactBinding,
  replacement: DeepAlignmentSealedArtifactBinding,
): DeepAlignmentCertificateBundle {
  const priorQualifiedDigest = prior.reference.qualified_digest;
  const replacementQualifiedDigest = replacement.reference.qualified_digest;
  const claims = fixture.bundle.certificate.body.artifactClaims.map((claim) => (
    claim.binding.reference.qualified_digest === priorQualifiedDigest
      ? {
          binding: replacement,
          descriptorDigest: replacement.reference.descriptor_digest,
          contentDigest: replacement.reference.content_digest,
          canonicalizationVersion: replacement.reference.canonicalization_version,
        }
      : claim
  ));
  const receipts = fixture.bundle.receipts.map((receipt) => ({
    ...receipt,
    facts: {
      ...receipt.facts,
      inputArtifactQualifiedDigests: replaceReference(
        receipt.facts.inputArtifactQualifiedDigests,
        priorQualifiedDigest,
        replacementQualifiedDigest,
      ),
      outputArtifactQualifiedDigests: replaceReference(
        receipt.facts.outputArtifactQualifiedDigests,
        priorQualifiedDigest,
        replacementQualifiedDigest,
      ),
    },
  }));
  return {
    ...fixture.bundle,
    certificate: {
      ...fixture.bundle.certificate,
      body: {
        ...fixture.bundle.certificate.body,
        artifactClaims: claims,
        artifactSetDigest: digest(claims),
      },
    },
    receipts,
  };
}

function bundleWithAdditionalBinding(
  bundle: DeepAlignmentCertificateBundle,
  binding: DeepAlignmentSealedArtifactBinding,
  options: Readonly<{
    authorizedReceiptIndex?: number;
  }> = {},
): DeepAlignmentCertificateBundle {
  const claims = [...bundle.certificate.body.artifactClaims];
  const claim = {
    binding,
    descriptorDigest: binding.reference.descriptor_digest,
    contentDigest: binding.reference.content_digest,
    canonicalizationVersion: binding.reference.canonicalization_version,
  };
  claims.push(claim);
  const receipts = bundle.receipts.map((receipt, index) => (
    index === options.authorizedReceiptIndex
      ? {
          ...receipt,
          facts: {
            ...receipt.facts,
            outputArtifactQualifiedDigests: [
              ...receipt.facts.outputArtifactQualifiedDigests,
              binding.reference.qualified_digest,
            ],
          },
        }
      : receipt
  ));
  return {
    ...bundle,
    certificate: {
      ...bundle.certificate,
      body: {
        ...bundle.certificate.body,
        artifactClaims: claims,
        artifactSetDigest: digest(claims),
      },
    },
    receipts,
  };
}

function verificationWithBundle(
  fixture: Scenario,
  bundle: DeepAlignmentCertificateBundle,
) {
  return {
    ...fixture.verification,
    bundle,
  };
}

async function verifyClosureTamper(
  fixture: Scenario,
  rule: (typeof DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES)[number],
  tamper: 'fabricated' | 'wrong-kind',
) {
  const material = fixture.materials.get(rule.containingArtifactKind);
  const binding = fixture.primaryBindings.get(rule.containingArtifactKind);
  if (!material || !binding) {
    throw new Error(`Missing closure fixture ${rule.containingArtifactKind}.${rule.field}`);
  }
  const directProvenanceField = (
    rule.containingArtifactKind === DeepAlignmentArtifactKinds.FINDING_EVIDENCE
    && rule.field === 'authorityDigest'
  ) || (
    rule.containingArtifactKind === DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION
    && (rule.field === 'findingDigest' || rule.field === 'authorityDigest')
  );
  if (directProvenanceField) {
    const priorDigest = material[rule.field as keyof DeepAlignmentArtifactMaterial];
    const referenced = [...fixture.primaryBindings.values()].find((candidate) => (
      candidate.reference.content_digest === priorDigest
      && rule.expectedArtifactKinds.includes(candidate.artifactKind)
    ));
    if (!referenced) throw new Error(`Missing direct provenance fixture for ${rule.field}`);
    let replacement: DeepAlignmentSealedArtifactBinding;
    if (tamper === 'wrong-kind') {
      const wrong = [...fixture.primaryBindings.values()].find((candidate) => (
        !rule.expectedArtifactKinds.includes(candidate.artifactKind)
      ));
      if (!wrong) throw new Error(`Missing direct wrong-kind fixture for ${rule.field}`);
      replacement = wrong;
    } else {
      const referencedMaterial = fixture.materials.get(referenced.artifactKind);
      if (!referencedMaterial) {
        throw new Error(`Missing direct fabricated material for ${rule.field}`);
      }
      const derived = fixture.artifactStore.derive(
        referenced.artifactKind,
        {
          ...referencedMaterial,
          artifactId: `${referencedMaterial.artifactId}-never-published-${rule.field}`,
        },
        {
          canonicalizationVersion: referenced.reference.canonicalization_version,
        },
      );
      replacement = {
        ...referenced,
        eventReference: `artifact:${derived.reference.qualified_digest}`,
        reference: derived.reference,
      };
    }
    return verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(
        fixture,
        bundleWithBinding(fixture, referenced, replacement),
      ),
    );
  }
  let replacementDigest: string;
  let dependencies = [...material.dependencies];
  if (tamper === 'fabricated') {
    replacementDigest = digest(`fabricated:${rule.containingArtifactKind}:${rule.field}`);
  } else {
    const wrong = [...fixture.primaryBindings.values()].find((candidate) => (
      !rule.expectedArtifactKinds.includes(candidate.artifactKind)
    ));
    if (!wrong) throw new Error(`Missing wrong-kind fixture for ${rule.field}`);
    replacementDigest = wrong.reference.content_digest;
    if (!dependencies.some((entry) => (
      entry.reference.qualified_digest === wrong.reference.qualified_digest
    ))) {
      dependencies.push(deepAlignmentDependency(wrong.artifactKind, wrong.reference));
    }
  }
  const prior = material[rule.field as keyof DeepAlignmentArtifactMaterial];
  const replacementValue = rule.cardinality === 'array'
    ? [
        replacementDigest,
        ...(Array.isArray(prior) ? prior.slice(1) : []),
      ]
    : replacementDigest;
  const altered = {
    ...material,
    artifactId: `${material.artifactId}-${tamper}-${rule.field}`,
    dependencies,
    [rule.field]: replacementValue,
  } as DeepAlignmentArtifactMaterial;
  const alteredBinding = await seal(
    fixture.artifactStore,
    rule.containingArtifactKind,
    altered,
  );
  const bundle = bundleWithBinding(fixture, binding, alteredBinding);
  return verifyDeepAlignmentCertificateOffline(
    verificationWithBundle(fixture, bundle),
  );
}

let validFixture: Scenario;

beforeAll(async () => {
  validFixture = await scenario();
}, 60_000);

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('deep alignment certificates and receipts', () => {
  it('issues and independently verifies one complete dark evidence bundle', async () => {
    const result = await verifyDeepAlignmentCertificateOffline(validFixture.verification);
    expect(result).toMatchObject({
      verdict: 'valid',
      certificateDigest: validFixture.bundle.certificate.certificateDigest,
    });
    expect(validFixture.bundle.certificate.body.authority).toBe('dark-evidence-only');
    expect(validFixture.bundle.receipts).toHaveLength(20);
  });

  it('exports the complete alignment transition vocabulary without execution authority', () => {
    expect(Object.values(DeepAlignmentTransitionKinds)).toEqual([
      'init',
      'authority',
      'scope',
      'lane',
      'subject',
      'applicability',
      'dimension-pass',
      'observation',
      'candidate',
      'evidence',
      'verification',
      'proof',
      'adjudication',
      'conformance',
      'lineage',
      'deviation',
      'witness-replay',
      'coverage',
      'convergence',
      'blocked-stop',
      'synthesis',
      'report',
      'continuity',
      'completion',
      'recovery',
    ]);
    expect(DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER).toEqual([
      'init',
      'authority',
      'scope',
      'lane',
      'subject',
      'applicability',
      'dimension-pass',
      'observation',
      'coverage',
      'convergence',
      'synthesis',
      'report',
      'continuity',
      'completion',
    ]);
  });

  it('freezes every predecessor-deferred plain-digest closure field', () => {
    const keys = DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES.map((rule) => (
      `${rule.containingArtifactKind}.${rule.field}`
    ));
    expect(keys).toEqual([
      `${DeepAlignmentArtifactKinds.APPLICABILITY_DECISION}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.DETECTOR_INPUT}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.DETECTOR_INPUT}.applicabilityDecisionDigest`,
      `${DeepAlignmentArtifactKinds.VERIFIER_INPUT}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.VERIFIER_INPUT}.applicabilityDecisionDigest`,
      `${DeepAlignmentArtifactKinds.WITNESS_MATRIX}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.FINDING_EVIDENCE}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.FINDING_EVIDENCE}.authorityDigest`,
      `${DeepAlignmentArtifactKinds.FINDING_EVIDENCE}.applicabilityDecisionDigest`,
      `${DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION}.findingDigest`,
      `${DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION}.subjectSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION}.authorityDigest`,
      `${DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT}.orderedInputDigests`,
      `${DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT}.findingsViewDigest`,
      `${DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT}.exceptionViewDigest`,
      `${DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT}.unresolvedFindingDigests`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.orderedInputDigests`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.convergenceSnapshotDigest`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.findingsViewDigest`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.exceptionViewDigest`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.unresolvedFindingDigests`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.reportDigest`,
      `${DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF}.affectedLaneDigests`,
      `${DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF}.affectedFindingDigests`,
      `${DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF}.offeredViewDigest`,
    ]);
  });

  it.each(DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES)(
    'declares a closed expected-kind set for $containingArtifactKind.$field',
    (rule) => {
      expect(rule.expectedArtifactKinds.length).toBeGreaterThan(0);
      expect(rule.expectedArtifactKinds.every((kind) => (
        Object.values(DeepAlignmentArtifactKinds).includes(kind)
      ))).toBe(true);
      expect(['array', 'scalar']).toContain(rule.cardinality);
      expect(typeof rule.allowEmpty).toBe('boolean');
    },
  );

  it.each(DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES)(
    'rejects a wrong-kind sealed digest at $containingArtifactKind.$field through the offline verifier',
    async (rule) => {
      const result = await verifyClosureTamper(validFixture, rule, 'wrong-kind');
      expect(result).toMatchObject({
        verdict: 'invalid',
        code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      });
      if (result.verdict === 'valid') return;
      if (result.evidenceLocation.includes(rule.field)) return;
      expect(result.evidenceLocation).toMatch(/^artifact:/u);
    },
  );

  it.each(DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES)(
    'rejects a fabricated digest at $containingArtifactKind.$field through the offline verifier',
    async (rule) => {
      const result = await verifyClosureTamper(validFixture, rule, 'fabricated');
      expect(['invalid', 'unverifiable']).toContain(result.verdict);
      if (result.verdict === 'valid') return;
      expect(result.code).toBe(DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID);
      if (result.evidenceLocation.includes(rule.field)) return;
      expect(result.evidenceLocation).toMatch(/^artifact:/u);
    },
  );

  it('rejects a correct-kind named digest from a different authority epoch', async () => {
    const applicabilityBinding = validFixture.primaryBindings.get(
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    );
    if (!applicabilityBinding) {
      throw new Error('Missing authority-epoch closure fixture');
    }
    vi.doMock('../../lib/deep-alignment-sealed-artifacts/index.js', async (importOriginal) => {
      const actual = await importOriginal<
        typeof import('../../lib/deep-alignment-sealed-artifacts/index.js')
      >();
      return {
        ...actual,
        readDeepAlignmentArtifact: async (
          ...args: Parameters<typeof actual.readDeepAlignmentArtifact>
        ) => {
          const verified = await actual.readDeepAlignmentArtifact(...args);
          if (
            verified.binding.reference.qualified_digest
            !== applicabilityBinding.reference.qualified_digest
          ) {
            return verified;
          }
          const capsule = JSON.parse(
            new TextDecoder().decode(Uint8Array.from(verified.bytes)),
          ) as JsonObject & { material: JsonObject };
          return {
            ...verified,
            bytes: canonicalBytes({
              ...capsule,
              material: {
                ...capsule.material,
                authorityEpochId: 'authority-epoch-stale',
              },
            }),
          };
        },
      };
    });
    try {
      const epochVerifier = await import(
        '../../lib/deep-alignment-certificates/deep-alignment-certificates.js?epoch-guard'
      );
      const result = await epochVerifier.verifyDeepAlignmentCertificateOffline(
        validFixture.verification,
      );
      expect(result).toMatchObject({
        verdict: 'invalid',
        code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
        evidenceLocation: `artifact:${DeepAlignmentArtifactKinds.APPLICABILITY_DECISION}:subjectSnapshotDigest:0`,
        failureReason: 'Named digest resolves across a stale authority epoch',
      });
    } finally {
      vi.doUnmock('../../lib/deep-alignment-sealed-artifacts/index.js');
    }
  });

  it('rejects a correct-kind named digest that is not predecessor-ordered', async () => {
    const applicabilityMaterial = validFixture.materials.get(
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    );
    const applicabilityBinding = validFixture.primaryBindings.get(
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    );
    const laterTarget = validFixture.bundle.certificate.body.artifactClaims.find(
      (claim, index) => (
        claim.binding.artifactKind === DeepAlignmentArtifactKinds.TARGET_SNAPSHOT
        && index > validFixture.bundle.certificate.body.artifactClaims.findIndex(
          (candidate) => candidate.binding.reference.qualified_digest
            === applicabilityBinding?.reference.qualified_digest,
        )
      ),
    )?.binding;
    if (!applicabilityMaterial || !applicabilityBinding || !laterTarget) {
      throw new Error('Missing predecessor-order closure fixture');
    }
    const alteredApplicability = await seal(
      validFixture.artifactStore,
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
      {
        ...applicabilityMaterial,
        artifactId: `${applicabilityMaterial.artifactId}-reordered`,
        dependencies: [
          deepAlignmentDependency(
            DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
            laterTarget.reference,
          ),
        ],
        subjectSnapshotDigest: laterTarget.reference.content_digest,
      } as DeepAlignmentArtifactMaterial,
    );
    const bundle = bundleWithBinding(
      validFixture,
      applicabilityBinding,
      alteredApplicability,
    );
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: `artifact:${DeepAlignmentArtifactKinds.APPLICABILITY_DECISION}:subjectSnapshotDigest:0`,
      failureReason: 'Named digest dependency is stale, reordered, or not predecessor-owned',
    });
  });

  it('rejects a correct-kind predecessor omitted from the container dependencies', async () => {
    const applicabilityMaterial = validFixture.materials.get(
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    );
    const applicabilityBinding = validFixture.primaryBindings.get(
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
    );
    if (!applicabilityMaterial || !applicabilityBinding) {
      throw new Error('Missing dependency-ownership closure fixture');
    }
    const alteredApplicability = await seal(
      validFixture.artifactStore,
      DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
      {
        ...applicabilityMaterial,
        artifactId: `${applicabilityMaterial.artifactId}-unowned`,
        dependencies: [],
      } as DeepAlignmentArtifactMaterial,
    );
    const bundle = bundleWithBinding(
      validFixture,
      applicabilityBinding,
      alteredApplicability,
    );
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: `artifact:${DeepAlignmentArtifactKinds.APPLICABILITY_DECISION}:subjectSnapshotDigest:0`,
      failureReason: 'Named digest is not owned by the containing artifact dependency closure',
    });
  });

  it('rejects a sealed artifact absent from every authorized transition receipt', async () => {
    const laneMaterial = validFixture.materials.get(
      DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
    );
    if (!laneMaterial) throw new Error('Missing transition-ownership fixture');
    const unownedLane = await seal(
      validFixture.artifactStore,
      DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
      {
        ...laneMaterial,
        ...baseMaterial(
          DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
          'without-transition-owner',
        ),
      } as DeepAlignmentArtifactMaterial,
    );
    const bundle = bundleWithAdditionalBinding(validFixture.bundle, unownedLane);
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.AUTHORIZATION_INVALID,
      evidenceLocation: `artifact:${unownedLane.reference.qualified_digest}`,
      failureReason: 'Every sealed artifact must be owned by an authorized transition receipt',
    });
  });

  it('rejects a LANE_CONFIGURATION artifact whose lane does not match its lane_completed event scope', async () => {
    const laneCompletedReceipt = validFixture.bundle.receipts.find((receipt) => (
      receipt.facts.resultEventType === DeepAlignmentWireEventTypes['deep_alignment.lane_completed']
    ));
    if (!laneCompletedReceipt) throw new Error('Missing lane_completed transition receipt fixture');
    const originalQualifiedDigest = laneCompletedReceipt.facts.outputArtifactQualifiedDigests[0];
    const originalClaim = validFixture.bundle.certificate.body.artifactClaims.find(
      (claim) => claim.binding.reference.qualified_digest === originalQualifiedDigest,
    );
    if (!originalClaim) throw new Error('Missing lane_completed output claim fixture');
    const laneMaterial = validFixture.materials.get(DeepAlignmentArtifactKinds.LANE_CONFIGURATION);
    if (!laneMaterial) throw new Error('Missing lane material fixture');
    const crossLaneBinding = await seal(
      validFixture.artifactStore,
      DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
      {
        ...laneMaterial,
        ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'cross-lane-decoy'),
        laneId: 'lane-2',
      } as DeepAlignmentArtifactMaterial,
    );
    const bundle = bundleWithBinding(validFixture, originalClaim.binding, crossLaneBinding);
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      evidenceLocation: 'transition:lane:outputs',
    });
  });

  it('accepts a LANE_CONFIGURATION artifact whose lane matches its lane_completed event scope', async () => {
    const laneCompletedEvent = validFixture.verification.projectionEvents.find(
      (event) => event.payload.stem === 'deep_alignment.lane_completed',
    );
    if (laneCompletedEvent?.payload.stem !== 'deep_alignment.lane_completed') {
      throw new Error('Missing lane_completed event fixture');
    }
    const laneCompletedReceipt = validFixture.bundle.receipts.find((receipt) => (
      receipt.facts.resultEventType === DeepAlignmentWireEventTypes['deep_alignment.lane_completed']
    ));
    if (!laneCompletedReceipt) throw new Error('Missing lane_completed transition receipt fixture');
    const outputQualifiedDigest = laneCompletedReceipt.facts.outputArtifactQualifiedDigests[0];
    const outputClaim = validFixture.bundle.certificate.body.artifactClaims.find(
      (claim) => claim.binding.reference.qualified_digest === outputQualifiedDigest,
    );
    if (!outputClaim || outputClaim.binding.artifactKind !== DeepAlignmentArtifactKinds.LANE_CONFIGURATION) {
      throw new Error('Missing lane_completed LANE_CONFIGURATION output fixture');
    }
    // The valid-fixture lane_completed transition genuinely binds a LANE_CONFIGURATION
    // output for the same lane the event's scope names, so tightening the correspondence
    // check to require that binding must not break this already-legitimate flow.
    expect(laneCompletedEvent.payload.scope.laneId).toBe('lane-1');
    const result = await verifyDeepAlignmentCertificateOffline(validFixture.verification);
    expect(result.verdict).toBe('valid');
  });

  it('rejects ambiguous reducer ownership of the active authority capsule', async () => {
    const authorityMaterial = validFixture.materials.get(
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
    );
    if (!authorityMaterial) throw new Error('Missing reducer-ownership fixture');
    const duplicateAuthority = await seal(
      validFixture.artifactStore,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      {
        ...authorityMaterial,
        ...baseMaterial(
          DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
          'duplicate-reducer-owner',
        ),
        authorityId: authorityMaterial.authorityId,
        materialRef: authorityMaterial.materialRef,
      } as DeepAlignmentArtifactMaterial,
    );
    const bundle = bundleWithAdditionalBinding(
      validFixture.bundle,
      duplicateAuthority,
      { authorizedReceiptIndex: 0 },
    );
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.AUTHORIZATION_INVALID,
      evidenceLocation: 'artifact:authority-owner',
      failureReason: 'The active authority must resolve to exactly one reducer-owned sealed capsule',
    });
  });

  it('returns unverifiable when the offline store has pruned referenced bytes', async () => {
    const prunedStore = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('pruned-store'),
    });
    const result = await verifyDeepAlignmentCertificateOffline({
      ...validFixture.verification,
      artifactStore: prunedStore,
    });
    expect(result).toMatchObject({
      verdict: 'unverifiable',
      code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
    });
  });

  it('rejects a forged wrong-kind binding during verified store reads', async () => {
    const target = validFixture.primaryBindings.get(
      DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
    );
    const authority = validFixture.primaryBindings.get(
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
    );
    if (!target || !authority) throw new Error('Missing forged-binding fixture');
    const bundle = bundleWithBinding(validFixture, target, authority);
    const result = await verifyDeepAlignmentCertificateOffline(
      verificationWithBundle(validFixture, bundle),
    );
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
    });
  });

  it('rejects a genuine non-PASS lifecycle at the terminal verifier guard', async () => {
    const fixture = await scenario({ terminalStatus: 'incomplete' });
    const terminalReceipt = fixture.bundle.receipts.at(-1);
    expect(terminalReceipt?.facts.resultDisposition).toBe('incomplete');
    expect(fixture.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    const result = await verifyDeepAlignmentCertificateOffline(fixture.verification);
    expect(result).toMatchObject({
      verdict: 'incomplete',
      code: DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      evidenceLocation: 'certificate:lifecycle',
    });
  }, 60_000);

  it('keeps empty closure arrays explicit rather than treating absence as success', () => {
    const optionalArrays = DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES
      .filter((rule) => rule.allowEmpty)
      .map((rule) => `${rule.containingArtifactKind}.${rule.field}`);
    expect(optionalArrays).toEqual([
      `${DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT}.unresolvedFindingDigests`,
      `${DeepAlignmentArtifactKinds.ALIGNMENT_REPORT}.unresolvedFindingDigests`,
      `${DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF}.affectedLaneDigests`,
      `${DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF}.affectedFindingDigests`,
    ]);
  });

  it('fails closed through the offline verifier on an unparseable bundle', async () => {
    const result = await verifyDeepAlignmentCertificateOffline({
      bundle: { bundleVersion: 1, certificate: {}, receipts: [] },
    } as never);
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepAlignmentCertificateFailureCodes.CERTIFICATE_INVALID);
    expect(result.evidenceDigest).toMatch(/^[a-f0-9]{64}$/u);
  });

  it('rejects unknown bundle fields before any evidence can be trusted', () => {
    expect(() => parseDeepAlignmentCertificateBundle({
      bundleVersion: 1,
      certificate: {},
      receipts: [],
      authoritative: true,
    })).toThrow();
  });

  it('publishes typed failure codes for every fail-closed verifier boundary', () => {
    expect(Object.values(DeepAlignmentCertificateFailureCodes)).toEqual([
      'ARTIFACT_INVALID',
      'AUTHORIZATION_INVALID',
      'CERTIFICATE_INVALID',
      'CERTIFICATION_INVALID',
      'CONVERGENCE_INVALID',
      'EVIDENCE_INCOMPLETE',
      'LEDGER_INVALID',
      'PROJECTION_INVALID',
      'RECEIPT_CHAIN_INVALID',
      'RECEIPT_MISSING',
      'REPLAY_INVALID',
      'STATUS_INVALID',
      'UNSUPPORTED_VERSION',
    ]);
  });
});
