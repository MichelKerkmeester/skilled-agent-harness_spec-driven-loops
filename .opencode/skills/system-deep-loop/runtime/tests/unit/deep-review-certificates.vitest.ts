// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Certificate Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES,
  DeepReviewCertificateFailureCodes,
  DeepReviewTransitionKinds,
  issueDeepReviewRunCertificate,
  parseDeepReviewCertificateBundle,
  verifyDeepReviewCertificateOffline,
} from '../../lib/deep-review-certificates/index.js';
import {
  DeepReviewWireEventTypes,
  createDeepReviewEventRegistry,
  deepReviewEventDefinitions,
  prepareDeepReviewEvent,
} from '../../lib/deep-review-ledger-schema/index.js';
import {
  DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
  DEEP_REVIEW_REDUCER_ID,
  DEEP_REVIEW_REDUCER_VERSION,
  createDeepReviewProjectionState,
  foldDeepReviewEvents,
  reduceDeepReviewVerifiedEvent,
} from '../../lib/deep-review-reducers/index.js';
import {
  DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
  DeepReviewArtifactKinds,
  createDeepReviewSealedArtifactStore,
  sealDeepReviewArtifact,
} from '../../lib/deep-review-sealed-artifacts/index.js';
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
  InitialArtifactKinds,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';
import type {
  DeepReviewCertificateBundle,
  DeepReviewNamedDigestClosureRule,
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
  DeepReviewArtifactDependency,
  DeepReviewArtifactKind,
  DeepReviewArtifactMaterial,
  DeepReviewSealedArtifactBinding,
} from '../../lib/deep-review-sealed-artifacts/index.js';
import type {
  DeepReviewArtifactMaterialByKind,
} from '../../lib/deep-review-sealed-artifacts/deep-review-sealed-artifact-types.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';

type ReplayProjection = DeepReviewProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepReviewCertificateBundle;
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

const TIMESTAMP = '2026-07-27T12:00:00.000Z';
const RUN_ID = 'deep-review-certificate-run-1';
const SESSION_ID = 'deep-review-certificate-session-1';
const STREAM_ID = 'deep-review-certificate-stream-1';
const PRODUCER = Object.freeze({ name: 'deep-review-certificate-tests', version: '1' });
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-review-certificate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
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
    await ledger.appendAuthorized(prepared, authorization.proof);
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
    coverageDigest: digest('coverage'),
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
    findingsRegistryDigest: digest('findings-registry'),
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

function cloneBundle(bundle: DeepReviewCertificateBundle): DeepReviewCertificateBundle {
  return structuredClone(bundle);
}

function replaceClaims(
  bundle: DeepReviewCertificateBundle,
  artifactClaims: DeepReviewCertificateBundle['certificate']['body']['artifactClaims'],
): DeepReviewCertificateBundle {
  const candidate = cloneBundle(bundle);
  const body = {
    ...candidate.certificate.body,
    artifactClaims,
    artifactSetDigest: digest(artifactClaims),
  };
  return {
    ...candidate,
    certificate: {
      ...candidate.certificate,
      body,
    },
  };
}

async function bundleWithClosureTamper(
  scenario: Scenario,
  rule: DeepReviewNamedDigestClosureRule,
  mode: 'fabricated' | 'wrong-kind',
): Promise<DeepReviewCertificateBundle> {
  const claimIndex = scenario.bundle.certificate.body.artifactClaims.findIndex(
    (claim) => claim.binding.artifactKind === rule.containingArtifactKind,
  );
  if (claimIndex < 0) throw new Error(`Missing containing artifact ${rule.containingArtifactKind}`);
  const originalClaim = scenario.bundle.certificate.body.artifactClaims[claimIndex]!;
  const originalMaterial = scenario.materialsByQualifiedDigest.get(
    originalClaim.binding.reference.qualified_digest,
  );
  if (!originalMaterial) throw new Error('Missing original artifact material');
  const material = structuredClone(originalMaterial) as Record<string, unknown>;
  let replacementDigest: string;
  if (mode === 'fabricated') {
    replacementDigest = digest(`never-sealed:${rule.containingArtifactKind}:${rule.field}`);
  } else {
    const wrongClaim = scenario.bundle.certificate.body.artifactClaims.find((claim) => (
      !rule.expectedArtifactKinds.includes(claim.binding.artifactKind)
      && claim.binding.reference.qualified_digest
        !== originalClaim.binding.reference.qualified_digest
    ));
    if (!wrongClaim) throw new Error('Missing wrong-kind fixture artifact');
    replacementDigest = wrongClaim.contentDigest;
    const dependencies = material.dependencies as DeepReviewArtifactDependency[];
    dependencies.push(dependency(wrongClaim.binding));
  }
  if (rule.cardinality === 'array') {
    const values = [...material[rule.field] as string[]];
    values[0] = replacementDigest;
    material[rule.field] = values;
  } else {
    material[rule.field] = replacementDigest;
  }
  const replacementBinding = await sealDeepReviewArtifact(
    scenario.artifactStore,
    rule.containingArtifactKind,
    material as never,
  );
  const claims = [...scenario.bundle.certificate.body.artifactClaims];
  claims[claimIndex] = {
    binding: replacementBinding,
    descriptorDigest: replacementBinding.reference.descriptor_digest,
    contentDigest: replacementBinding.reference.content_digest,
    canonicalizationVersion: DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
  };
  return replaceClaims(scenario.bundle, Object.freeze(claims));
}

async function verifyBundle(
  scenario: Scenario,
  bundle: DeepReviewCertificateBundle,
) {
  return verifyDeepReviewCertificateOffline({
    ...scenario.verification,
    bundle,
  });
}

let scenario: Scenario;

beforeAll(async () => {
  scenario = await createScenario();
}, 120_000);

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('deep-review certificates and receipts', () => {
  it('issues and independently verifies a valid dark-only run certificate', async () => {
    const result = await verifyBundle(scenario, scenario.bundle);
    expect(result.verdict).toBe('valid');
    expect(scenario.bundle.certificate.body.authority).toBe('dark-evidence-only');
    expect(scenario.bundle.receipts).toHaveLength(projectionEvents().length);
  });

  it('rejects trusted completion for an explicitly incomplete lifecycle', async () => {
    const incomplete = await createScenario({
      convergenceDecision: 'incomplete',
      terminalStatus: 'incomplete',
    });

    expect(incomplete.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    expect(incomplete.bundle.certificate.body.statusEvidence).toMatchObject({
      state: 'incomplete',
      terminal: true,
    });
    expect(incomplete.bundle.certificate.body.convergenceEvidence.outcome).toBe('incomplete');
    expect(incomplete.bundle.receipts.at(-1)?.facts.resultDisposition).toBe('incomplete');

    const result = await verifyBundle(incomplete, incomplete.bundle);
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE);
    expect(result.evidenceLocation).toBe('certificate:lifecycle');
  }, 120_000);

  it('keeps a blocked terminal run non-trusted', async () => {
    const blocked = await createScenario({ terminalStatus: 'blocked' });

    expect(blocked.bundle.certificate.body.lifecycleResult).toBe('failed');
    expect(blocked.bundle.certificate.body.statusEvidence).toMatchObject({
      state: 'failed',
      terminal: true,
    });
    expect(blocked.bundle.receipts.at(-1)?.facts.resultDisposition).toBe('blocked');

    const result = await verifyBundle(blocked, blocked.bundle);
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE);
    expect(result.evidenceLocation).toBe('certificate:lifecycle');
  }, 120_000);

  it('preserves rejected and unresolved findings without upgrading them to pass', async () => {
    const rejected = await createScenario({
      adjudicationOutcome: 'rejected',
      convergenceDecision: 'incomplete',
      terminalStatus: 'incomplete',
      unresolvedFindingIds: ['finding-1'],
      deferredFindingIds: ['finding-deferred-1'],
    });
    const adjudicationReceipt = rejected.bundle.receipts.find(
      (receipt) => receipt.facts.transitionKind === DeepReviewTransitionKinds.ADJUDICATION,
    );
    expect(adjudicationReceipt?.facts.resultDisposition).toBe('incomplete');
    expect(rejected.bundle.certificate.body.lifecycleResult).toBe('incomplete');

    const synthesisEvent = rejected.verification.projectionEvents.find(
      (candidate) => candidate.payload.stem === 'deep_review.synthesis_started',
    );
    if (synthesisEvent?.payload.stem !== 'deep_review.synthesis_started') {
      throw new Error('Expected pinned synthesis evidence');
    }
    expect(synthesisEvent.payload.data.unresolvedFindingIds).toEqual(['finding-1']);
    expect(synthesisEvent.payload.data.deferredFindingIds).toEqual(['finding-deferred-1']);

    const reportEvent = rejected.verification.projectionEvents.find(
      (candidate) => candidate.payload.stem === 'deep_review.review_report_committed',
    );
    if (reportEvent?.payload.stem !== 'deep_review.review_report_committed') {
      throw new Error('Expected pinned report evidence');
    }
    expect(reportEvent.payload.data.unresolvedFindingIds).toEqual(['finding-1']);
    expect(reportEvent.payload.data.deferredFindingIds).toEqual(['finding-deferred-1']);

    const result = await verifyBundle(rejected, rejected.bundle);
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE);
  }, 120_000);

  it('retains superseding late evidence alongside its predecessor', () => {
    const folded = foldDeepReviewEvents(supersedingEvidenceEvents());
    expect(folded.outcome).toBe('projected');
    if (folded.outcome !== 'projected') {
      throw new Error('Expected superseding evidence fixture to project');
    }

    const evidence = folded.projection.findingLedger.evidence;
    expect(evidence).toHaveLength(2);
    expect(evidence.some((entry) => entry.producerEventId === 'review-event-007')).toBe(true);
    expect(evidence.find(
      (entry) => entry.producerEventId === 'review-event-008',
    )?.supersedesEvidenceEventId).toBe('review-event-007');
  });

  it('keeps retryable unknown effects in doubt and recovery-required', async () => {
    const retryUnknown = await createScenario({
      continuityEffect: 'retry-unknown',
      terminalStatus: 'incomplete',
    });
    const effectReceipt = retryUnknown.bundle.receipts.find(
      (receipt) => receipt.facts.resultEventId === 'review-event-015',
    );
    expect(effectReceipt?.facts.resultDisposition).toBe('in_doubt');
    expect(effectReceipt?.facts.dispositionReason).toContain('reconciliation');
    expect(retryUnknown.bundle.certificate.body.lifecycleResult).toBe('incomplete');

    const result = await verifyBundle(retryUnknown, retryUnknown.bundle);
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE);
    expect(result.evidenceLocation).toBe('certificate:lifecycle');
  }, 120_000);

  it('distinguishes max-iteration incomplete termination from completion', async () => {
    const bounded = await createScenario({
      maxIterations: 1,
      convergenceDecision: 'incomplete',
      terminalStatus: 'incomplete',
    });
    const initialization = bounded.verification.projectionEvents[0];
    if (initialization?.payload.stem !== 'deep_review.run_initialized') {
      throw new Error('Expected pinned initialization evidence');
    }

    expect(initialization.payload.data.maxIterations).toBe(1);
    expect(bounded.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    expect(bounded.bundle.certificate.body.lifecycleResult).not.toBe(
      scenario.bundle.certificate.body.lifecycleResult,
    );
    expect(bounded.bundle.certificate.body.statusEvidence.state).toBe('incomplete');
    expect(scenario.bundle.certificate.body.statusEvidence.state).toBe('complete');

    const result = await verifyBundle(bounded, bounded.bundle);
    expect(result.verdict).toBe('incomplete');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE);
  }, 120_000);

  it('returns unverifiable when a separate offline store lacks referenced bytes', async () => {
    const prunedStore = createDeepReviewSealedArtifactStore({
      rootDirectory: temporaryRoot('pruned'),
    });
    const result = await verifyDeepReviewCertificateOffline({
      ...scenario.verification,
      artifactStore: prunedStore,
    });
    expect(result.verdict).toBe('unverifiable');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.ARTIFACT_INVALID);
  });

  it.each(DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES)(
    'rejects a fabricated never-sealed digest for $containingArtifactKind.$field',
    async (rule) => {
      const bundle = await bundleWithClosureTamper(scenario, rule, 'fabricated');
      const result = await verifyBundle(scenario, bundle);
      expect(result.verdict).toBe('invalid');
      if (result.verdict === 'valid') return;
      expect(result.code).toBe(DeepReviewCertificateFailureCodes.ARTIFACT_INVALID);
      expect(result.evidenceLocation).toContain(rule.field);
    },
  );

  it.each(DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES)(
    'rejects a wrong-kind sealed digest for $containingArtifactKind.$field',
    async (rule) => {
      const bundle = await bundleWithClosureTamper(scenario, rule, 'wrong-kind');
      const result = await verifyBundle(scenario, bundle);
      expect(result.verdict).toBe('invalid');
      if (result.verdict === 'valid') return;
      expect(result.code).toBe(DeepReviewCertificateFailureCodes.ARTIFACT_INVALID);
      expect(result.evidenceLocation).toContain(rule.field);
    },
  );

  it('fails closed on a forged certificate artifact binding', async () => {
    const candidate = cloneBundle(scenario.bundle);
    const claims = [...candidate.certificate.body.artifactClaims];
    claims[0] = {
      ...claims[0]!,
      binding: claims[1]!.binding,
    };
    const result = await verifyBundle(scenario, replaceClaims(candidate, claims));
    expect(result.verdict).toBe('invalid');
  });

  it('rejects mutated artifact claims through the real verified-read path', async () => {
    const candidate = cloneBundle(scenario.bundle);
    const claims = [...candidate.certificate.body.artifactClaims];
    claims[0] = { ...claims[0]!, contentDigest: digest('mutated-content') };
    const result = await verifyBundle(scenario, replaceClaims(candidate, claims));
    expect(result.verdict).toBe('invalid');
  });

  it('rejects stale artifact epochs against authorized ledger provenance', async () => {
    const targetClaim = scenario.bundle.certificate.body.artifactClaims.find(
      (claim) => claim.binding.artifactKind === DeepReviewArtifactKinds.TARGET_SNAPSHOT,
    )!;
    const targetMaterial = structuredClone(
      scenario.materialsByQualifiedDigest.get(
        targetClaim.binding.reference.qualified_digest,
      )!,
    ) as Record<string, unknown>;
    targetMaterial.authorityEpoch = 2;
    const stale = await sealDeepReviewArtifact(
      scenario.artifactStore,
      DeepReviewArtifactKinds.TARGET_SNAPSHOT,
      targetMaterial as never,
    );
    const claims = scenario.bundle.certificate.body.artifactClaims.map((claim) => (
      claim === targetClaim
        ? {
            binding: stale,
            descriptorDigest: stale.reference.descriptor_digest,
            contentDigest: stale.reference.content_digest,
            canonicalizationVersion: DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
          }
        : claim
    ));
    const result = await verifyBundle(scenario, replaceClaims(scenario.bundle, claims));
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.AUTHORIZATION_INVALID);
  });

  it('rejects reordered transition receipts', async () => {
    const candidate = cloneBundle(scenario.bundle);
    const bundle = { ...candidate, receipts: [...candidate.receipts].reverse() };
    const result = await verifyBundle(scenario, bundle);
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID);
  });

  it('rejects an unauthorized artifact provenance reference', async () => {
    const claim = scenario.bundle.certificate.body.artifactClaims.find(
      (entry) => entry.binding.artifactKind === DeepReviewArtifactKinds.TARGET_SNAPSHOT,
    )!;
    const material = structuredClone(
      scenario.materialsByQualifiedDigest.get(claim.binding.reference.qualified_digest)!,
    ) as Record<string, unknown>;
    material.eventId = 'never-authorized-event';
    const unauthorized = await sealDeepReviewArtifact(
      scenario.artifactStore,
      DeepReviewArtifactKinds.TARGET_SNAPSHOT,
      material as never,
    );
    const claims = scenario.bundle.certificate.body.artifactClaims.map((entry) => (
      entry === claim
        ? {
            binding: unauthorized,
            descriptorDigest: unauthorized.reference.descriptor_digest,
            contentDigest: unauthorized.reference.content_digest,
            canonicalizationVersion: DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
          }
        : entry
    ));
    const result = await verifyBundle(scenario, replaceClaims(scenario.bundle, claims));
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.AUTHORIZATION_INVALID);
  });

  it('rejects a broken predecessor receipt chain', async () => {
    const candidate = cloneBundle(scenario.bundle);
    const receipts = [...candidate.receipts];
    receipts[1] = {
      ...receipts[1]!,
      facts: { ...receipts[1]!.facts, priorReceiptDigest: null },
    };
    const result = await verifyBundle(scenario, { ...candidate, receipts });
    expect(result.verdict).toBe('invalid');
    if (result.verdict === 'valid') return;
    expect(result.code).toBe(DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID);
  });

  it('rejects a forged authorization-decision digest in a receipt', async () => {
    const candidate = cloneBundle(scenario.bundle);
    const receipts = [...candidate.receipts];
    receipts[0] = {
      ...receipts[0]!,
      facts: {
        ...receipts[0]!.facts,
        authorizationDecisionDigest: digest('forged-authorization'),
      },
    };
    const result = await verifyBundle(scenario, { ...candidate, receipts });
    expect(result.verdict).toBe('invalid');
  });

  it('parses the closed bundle and rejects authority widening', () => {
    expect(parseDeepReviewCertificateBundle(scenario.bundle)).toEqual(scenario.bundle);
    const candidate = cloneBundle(scenario.bundle) as unknown as {
      certificate: { body: Record<string, unknown> };
    };
    candidate.certificate.body.authority = 'authoritative';
    expect(() => parseDeepReviewCertificateBundle(candidate)).toThrow();
  });
});
