// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepResearchTransitionKinds,
  issueDeepResearchRunCertificate,
  parseDeepResearchCertificateBundle,
} from '../../lib/deep-research-certificates/index.js';
import {
  DeepResearchWireEventTypes,
  createDeepResearchEventRegistry,
  deepResearchEventDefinitions,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import {
  DeepResearchModeMigrationGate,
  DeepResearchRollbackSwitch,
  evaluateDeepResearchRollbackWindow,
} from '../../lib/deep-research-rollback-gate/index.js';
import {
  DEEP_RESEARCH_COMPARATOR_VERSION,
  DEEP_RESEARCH_LIFECYCLE_EVENT_MAP,
  DEEP_RESEARCH_MODE_GATE_INPUT_VERSION,
  DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
  DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_RESEARCH_VOLATILITY_ALLOWLIST,
  createDeepResearchModeGateInput,
} from '../../lib/deep-research-shadow-parity/index.js';
import {
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_ID,
  DEEP_RESEARCH_REDUCER_VERSION,
  createDeepResearchProjectionState,
  reduceDeepResearchVerifiedEvent,
} from '../../lib/deep-research-reducers/index.js';
import {
  DeepResearchArtifactKinds,
  createDeepResearchSealedArtifactStore,
  sealDeepResearchArtifact,
} from '../../lib/deep-research-sealed-artifacts/index.js';
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
  DeepResearchOfflineVerificationInput,
  DeepResearchTransitionReceiptInput,
  DeepResearchTransitionReceiptSubstrate,
} from '../../lib/deep-research-certificates/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type { DeepResearchProjectionState } from '../../lib/deep-research-reducers/index.js';
import type {
  DeepResearchLifecycleEvidenceRow,
  DeepResearchModeGateInput,
  DeepResearchModeMigrationCertificate,
  DeepResearchRollbackRequest,
  DeepResearchVersionBindings,
} from '../../lib/deep-research-rollback-gate/index.js';
import type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import type {
  DeepResearchParityCertificateEvidenceBinding,
  DeepResearchParityReceipt,
  DeepResearchResumeParityEvidence,
} from '../../lib/deep-research-shadow-parity/index.js';
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
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const BASE_SHA = '1'.repeat(40);
const CANDIDATE_SHA = '2'.repeat(40);
const CERTIFICATE_TIMESTAMP = '2026-07-21T18:00:00.000Z';
const CERTIFICATE_RUN_ID = 'rollback-gate-certificate-run';
const CERTIFICATE_LINEAGE_ID = 'rollback-gate-certificate-lineage';
const CERTIFICATE_STREAM_ID = 'rollback-gate-certificate-stream';
const TEST_PRODUCER = Object.freeze({ name: 'deep-research-rollback-gate-tests', version: '1' });
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

type ReplayProjection = DeepResearchProjectionState & JsonObject;

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
  const root = mkdtempSync(join(tmpdir(), `deep-research-rollback-gate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function hash(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function certificateReplayMetadata(): DeepResearchReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('certificate-event-replay'),
    replay_input_digests: { configuration: digest('certificate-configuration') },
  };
}

function certificateBaseScope(): DeepResearchScopeMap<'deep_research.run_initialized'> {
  return { runId: CERTIFICATE_RUN_ID, lineageId: CERTIFICATE_LINEAGE_ID };
}

function certificateIterationScope(): DeepResearchScopeMap<'deep_research.iteration_started'> {
  return { ...certificateBaseScope(), iteration: 1 };
}

function certificateEvent<TStem extends DeepResearchEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
): DeepResearchEventEnvelope<TStem> {
  return prepareDeepResearchEvent({
    stem,
    scope,
    prevEventHash: digest(`certificate-previous:${sequence}`),
    replay: certificateReplayMetadata(),
    data,
    eventId: `rollback-gate-certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: CERTIFICATE_STREAM_ID,
    streamSequence: sequence,
    occurredAt: CERTIFICATE_TIMESTAMP,
    recordedAt: CERTIFICATE_TIMESTAMP,
    producer: TEST_PRODUCER,
    authorityEpoch: 1,
    correlationId: 'rollback-gate-certificate-correlation',
    causationId: sequence === 1
      ? null
      : `rollback-gate-certificate-event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `rollback-gate-certificate-idempotency-${sequence}`,
  }, createDeepResearchEventRegistry()).envelope as DeepResearchEventEnvelope<TStem>;
}

function sourceCaptureData(): DeepResearchPayloadMap['deep_research.source_captured'] {
  return {
    sourceIdentityDigest: digest('certificate-source-identity'),
    locator: {
      scheme: 'url',
      locatorDigest: digest('certificate-source-locator'),
      selector: 'https://example.test/rollback-gate-source',
      revision: 'revision-1',
    },
    capturedAt: CERTIFICATE_TIMESTAMP,
    contentDigest: digest('certificate-source-content'),
    mediaType: 'text/html',
    retrievalReceiptRef: 'rollback-gate-retrieval-receipt',
    parentSourceVersionId: null,
    instructionScanResult: 'clean',
  };
}

function certificateProjectionEvents(): readonly DeepResearchLedgerEvent[] {
  const evidenceDigest = digest('certificate-evidence');
  const passage = {
    locatorDigest: evidenceDigest,
    selector: 'paragraph:1',
    passageDigest: evidenceDigest,
  };
  const events: DeepResearchLedgerEvent[] = [];
  let sequence = 1;
  const append = <TStem extends DeepResearchEventStem>(
    stem: TStem,
    scope: DeepResearchScopeMap[TStem],
    data: DeepResearchPayloadMap[TStem],
  ): void => {
    events.push(certificateEvent(stem, sequence, scope, data));
    sequence += 1;
  };
  append('deep_research.run_initialized', certificateBaseScope(), {
    generation: 1,
    charterDigest: evidenceDigest,
    configDigest: evidenceDigest,
    executorFingerprint: evidenceDigest,
    replayFingerprint: evidenceDigest,
    maxIterations: 4,
    convergencePolicyVersion: 'convergence@1',
  });
  append('deep_research.iteration_started', certificateIterationScope(), {
    focusRef: 'focus-1',
    stateTailDigest: evidenceDigest,
    strategyDigest: evidenceDigest,
    status: 'started',
  });
  append('deep_research.source_captured', {
    ...certificateIterationScope(),
    sourceVersionId: 'source-version-1',
  }, sourceCaptureData());
  append('deep_research.evidence_admission_decided', {
    ...certificateIterationScope(),
    sourceVersionId: 'source-version-1',
    evidenceId: 'evidence-1',
  }, {
    disposition: 'admit',
    passageLocators: [passage],
    atomicClaimRefs: ['claim-1'],
    derivativeSourceGroup: 'independent-1',
    admissionPolicyVersion: 'admission@1',
    contaminationStatus: 'clean',
    reasonCode: 'independent-primary',
  });
  append('deep_research.claim_asserted', {
    ...certificateIterationScope(),
    claimVersionId: 'claim-version-1',
  }, {
    claimId: 'claim-1',
    normalizedClaimDigest: digest('certificate-claim'),
    evidenceIds: ['evidence-1'],
    independenceGroup: 'independent-1',
    rawConfidence: 0.9,
    claimStatus: 'supported',
  });
  append('deep_research.iteration_completed', certificateIterationScope(), {
    status: 'complete',
    rawNewInfoRatio: 0.1,
    trustedEvidenceYield: 0.8,
    outputDigest: digest('certificate-iteration-output'),
    ruledOutApproachRefs: [],
    nextFocusCausationId: 'rollback-gate-certificate-event-005',
  });
  const convergenceEventId = `rollback-gate-certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.convergence_evaluated', certificateIterationScope(), {
    decision: 'converged',
    rawSignals: {
      newInfoRatio: 0.1,
      contradictionRisk: 0.1,
      citationDrift: 0.1,
      observationDigest: digest('certificate-raw-observation'),
    },
    trustedSignals: {
      evidenceYield: 0.8,
      independentSourceRatio: 0.9,
      supportedClaimRatio: 0.9,
      assessmentDigest: digest('certificate-trusted-assessment'),
    },
    qualityGateResults: {
      sourceDiversity: 'pass',
      contradictionResolution: 'pass',
      citationIntegrity: 'pass',
      policyVersion: 'quality@1',
      resultDigest: digest('certificate-quality-gates'),
    },
    blockerIds: [],
    policyFingerprint: digest('certificate-policy'),
    evaluatorFingerprint: digest('certificate-evaluator'),
    evidenceTailHash: digest('certificate-evidence-tail'),
    incompleteReason: null,
    recoveryReason: null,
  });
  append('deep_research.synthesis_started', certificateBaseScope(), {
    admittedLedgerRevision: 'ledger-revision-1',
    selectedClaimVersionSetDigest: digest('certificate-claim-set'),
    synthesisPolicyDigest: digest('certificate-synthesis-policy'),
    reportRevision: 'report-revision-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
  });
  const synthesisEventId = `rollback-gate-certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.synthesis_committed', certificateBaseScope(), {
    admittedLedgerRevision: 'ledger-revision-1',
    selectedClaimVersionSetDigest: digest('certificate-claim-set'),
    synthesisPolicyDigest: digest('certificate-synthesis-policy'),
    reportRevision: 'report-revision-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
    reportDigest: digest('certificate-research-report'),
    citationEventIds: ['rollback-gate-certificate-event-004'],
    synthesisReceiptRef: 'rollback-gate-synthesis-receipt',
  });
  append('deep_research.memory_save_requested', certificateBaseScope(), {
    targetPacket: 'packet-1',
    continuityPayloadDigest: digest('certificate-continuity-payload'),
    route: 'continuity',
    mergeMode: 'upsert',
    sourceEventRange: {
      firstEventId: 'rollback-gate-certificate-event-001',
      lastEventId: synthesisEventId,
    },
  });
  const memorySaveEventId = `rollback-gate-certificate-event-${String(sequence).padStart(3, '0')}`;
  append('deep_research.memory_save_completed', certificateBaseScope(), {
    targetPacket: 'packet-1',
    continuityPayloadDigest: digest('certificate-continuity-payload'),
    route: 'continuity',
    mergeMode: 'upsert',
    sourceEventRange: {
      firstEventId: 'rollback-gate-certificate-event-001',
      lastEventId: synthesisEventId,
    },
    persistenceReceiptRefs: ['rollback-gate-persistence-receipt'],
    continuityFingerprint: digest('certificate-continuity-fingerprint'),
  });
  append('deep_research.run_completed', certificateBaseScope(), {
    terminalStatus: 'completed',
    convergenceEventId,
    synthesisEventId,
    memorySaveEventId,
    finalLedgerTailHash: digest('certificate-ledger-tail'),
    counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 1 },
    completionReason: 'All required convergence and persistence evidence is present.',
    incompleteReason: null,
  });
  return Object.freeze(events);
}

async function certificateLedger(events: readonly DeepResearchLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepResearchEventDefinitions());
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
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepResearchEvent({
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
      `rollback-gate-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('Expected certificate fixture authorization');
    await ledger.appendAuthorized(prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({ rootDirectory, operationTimeoutMs: 5_000 });
  const ledgerLease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-research-certificate-writer',
    correlationId: 'deep-research-certificate-writer',
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
      mode: 'research',
      priorStateVersion: 'deep-research-certificate-state@1',
      priorStateFingerprint: digest('deep-research-certificate-state'),
      actorId: 'deep-research-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepResearchTransitionReceiptSubstrate = Object.freeze({
    writer,
    registry,
    producer: TEST_PRODUCER,
  });
  return { ledger, registry, receiptSubstrate };
}

function certificateReplayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepResearchWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepResearchVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_RESEARCH_REDUCER_ID,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function certificateInputMaterial(): DeepResearchInputArtifactMaterial {
  return {
    artifactId: 'rollback-gate-objective',
    materialDigest: digest('certificate-evidence'),
    materialRef: 'artifact:rollback-gate-objective',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('certificate-objective-locator'),
      selector: 'objective:1',
      revision: 'revision-1',
    },
    producerVersion: 'producer@1',
  };
}

function certificateSourceMaterial(): DeepResearchSourceArtifactMaterial {
  return {
    sourceVersionId: 'source-version-1',
    sourceIdentityDigest: digest('certificate-source-identity'),
    responseDigest: digest('certificate-source-content'),
    responseRef: 'artifact:rollback-gate-source',
    retrievalMetadataDigest: digest('certificate-retrieval-metadata'),
    extractionProfileDigest: digest('certificate-extraction-profile'),
    normalizedPassageDigests: [digest('certificate-passage')],
    locator: {
      scheme: 'url',
      locatorDigest: digest('certificate-source-locator'),
      selector: 'https://example.test/rollback-gate-source',
      revision: 'revision-1',
    },
    captureVersion: 'capture@1',
  };
}

function certificateAnalysisMaterial(): DeepResearchAnalysisArtifactMaterial {
  return {
    observationId: 'claim-1',
    observationDigest: digest('certificate-claim'),
    observationRef: 'artifact:rollback-gate-claim',
    sourceArtifactDigest: digest('certificate-source-content'),
    evidenceDigests: [digest('certificate-evidence')],
    status: 'supported',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('certificate-claim-locator'),
      selector: 'claim:1',
      revision: 'revision-1',
    },
    analysisVersion: 'analysis@1',
  };
}

function certificateConvergenceMaterial(): DeepResearchConvergenceArtifactMaterial {
  return {
    witnessId: 'rollback-gate-convergence-witness',
    snapshotDigest: digest('certificate-evidence-tail'),
    snapshotRef: 'artifact:rollback-gate-convergence',
    orderedInputDigests: [digest('certificate-claim')],
    evaluatorVersion: 'evaluator@1',
    decision: 'converged',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('certificate-convergence-locator'),
      selector: 'convergence:1',
      revision: 'revision-1',
    },
  };
}

function certificateSynthesisMaterial(): DeepResearchSynthesisArtifactMaterial {
  return {
    outputId: 'report-revision-1',
    outputDigest: digest('certificate-research-report'),
    outputRef: 'artifact:rollback-gate-report',
    orderedInputDigests: [digest('certificate-evidence-tail')],
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    outputRole: 'report',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('certificate-report-locator'),
      selector: 'report:1',
      revision: 'revision-1',
    },
  };
}

function certificateHandoffMaterial(
  finalReferenceSetDigest: string,
): DeepResearchMemoryHandoffArtifactMaterial {
  return {
    handoffId: 'rollback-gate-handoff',
    finalReferenceSetDigest,
    continuityPayloadDigest: digest('certificate-continuity-payload'),
    offeredViewDigest: digest('certificate-research-report'),
    offeredViewRef: 'artifact:rollback-gate-offered-view',
    targetPacket: 'packet-1',
    locator: {
      scheme: 'artifact',
      locatorDigest: digest('certificate-handoff-locator'),
      selector: 'handoff:1',
      revision: 'revision-1',
    },
    handoffVersion: 'handoff@1',
  };
}

async function certificateArtifacts(): Promise<Readonly<{
  store: ReturnType<typeof createDeepResearchSealedArtifactStore>;
  bindings: readonly DeepResearchSealedArtifactBinding[];
}>> {
  const store = createDeepResearchSealedArtifactStore({
    rootDirectory: temporaryRoot('certificate-artifacts'),
  });
  const objective = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.OBJECTIVE,
    certificateInputMaterial(),
  );
  const source = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.SOURCE_CAPTURE,
    certificateSourceMaterial(),
  );
  const analysis = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.ATOMIC_CLAIM,
    certificateAnalysisMaterial(),
  );
  const convergence = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.CONVERGENCE_WITNESS,
    certificateConvergenceMaterial(),
  );
  const synthesis = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.SYNTHESIS_REPORT,
    certificateSynthesisMaterial(),
  );
  const handoff = await sealDeepResearchArtifact(
    store,
    DeepResearchArtifactKinds.MEMORY_HANDOFF,
    certificateHandoffMaterial(digest([synthesis.reference.qualified_digest])),
  );
  return {
    store,
    bindings: Object.freeze([objective, source, analysis, convergence, synthesis, handoff]),
  };
}

function certificateTransitionInputs(
  bindings: readonly DeepResearchSealedArtifactBinding[],
  events: readonly DeepResearchLedgerEvent[],
): readonly DeepResearchTransitionReceiptInput[] {
  const artifact = (kind: DeepResearchSealedArtifactBinding['artifactKind']): string => {
    const binding = bindings.find((entry) => entry.artifactKind === kind);
    if (!binding) throw new Error(`Expected ${kind} artifact`);
    return binding.reference.qualified_digest;
  };
  const eventId = (stem: DeepResearchEventStem): string => {
    const event = events.find((entry) => entry.payload.stem === stem);
    if (!event) throw new Error(`Expected ${stem} event`);
    return event.event_id;
  };
  const objective = artifact(DeepResearchArtifactKinds.OBJECTIVE);
  const source = artifact(DeepResearchArtifactKinds.SOURCE_CAPTURE);
  const analysis = artifact(DeepResearchArtifactKinds.ATOMIC_CLAIM);
  const convergence = artifact(DeepResearchArtifactKinds.CONVERGENCE_WITNESS);
  const synthesis = artifact(DeepResearchArtifactKinds.SYNTHESIS_REPORT);
  const handoff = artifact(DeepResearchArtifactKinds.MEMORY_HANDOFF);
  return Object.freeze([
    {
      transitionKind: DeepResearchTransitionKinds.INIT,
      logicalOperationId: 'rollback-gate-init',
      attemptIds: ['rollback-gate-init-attempt'],
      resultEventId: eventId('deep_research.run_initialized'),
      inputArtifactQualifiedDigests: [],
      outputArtifactQualifiedDigests: [objective],
    },
    {
      transitionKind: DeepResearchTransitionKinds.GATHER,
      logicalOperationId: 'rollback-gate-gather',
      attemptIds: ['rollback-gate-gather-attempt'],
      resultEventId: eventId('deep_research.source_captured'),
      inputArtifactQualifiedDigests: [objective],
      outputArtifactQualifiedDigests: [source],
    },
    {
      transitionKind: DeepResearchTransitionKinds.ANALYZE,
      logicalOperationId: 'rollback-gate-analyze',
      attemptIds: ['rollback-gate-analyze-attempt'],
      resultEventId: eventId('deep_research.claim_asserted'),
      inputArtifactQualifiedDigests: [source],
      outputArtifactQualifiedDigests: [analysis],
    },
    {
      transitionKind: DeepResearchTransitionKinds.CONVERGENCE,
      logicalOperationId: 'rollback-gate-convergence',
      attemptIds: ['rollback-gate-convergence-attempt'],
      resultEventId: eventId('deep_research.convergence_evaluated'),
      inputArtifactQualifiedDigests: [analysis],
      outputArtifactQualifiedDigests: [convergence],
    },
    {
      transitionKind: DeepResearchTransitionKinds.SYNTHESIS,
      logicalOperationId: 'rollback-gate-synthesis',
      attemptIds: ['rollback-gate-synthesis-attempt'],
      resultEventId: eventId('deep_research.synthesis_committed'),
      inputArtifactQualifiedDigests: [convergence],
      outputArtifactQualifiedDigests: [synthesis],
    },
    {
      transitionKind: DeepResearchTransitionKinds.MEMORY_SAVE,
      logicalOperationId: 'rollback-gate-memory-save',
      attemptIds: ['rollback-gate-memory-save-attempt'],
      resultEventId: eventId('deep_research.memory_save_completed'),
      inputArtifactQualifiedDigests: [synthesis],
      outputArtifactQualifiedDigests: [handoff],
    },
  ]);
}

function certificateProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'rollback-gate-certificate-provider',
      key_id: 'rollback-gate-certificate-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

async function certificateVerificationInput(): Promise<Readonly<{
  verificationInput: DeepResearchOfflineVerificationInput<ReplayProjection>;
  artifactBindings: readonly DeepResearchSealedArtifactBinding[];
}>> {
  const projectionEvents = certificateProjectionEvents();
  const { ledger, registry, receiptSubstrate } = await certificateLedger(projectionEvents);
  const { store, bindings } = await certificateArtifacts();
  const providers = certificateProviders();
  const initialState = createDeepResearchProjectionState() as ReplayProjection;
  const replay: DeepResearchOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: certificateReplayComponentRegistry(),
    runId: CERTIFICATE_RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: projectionEvents.length,
    replay: {
      reducerId: DEEP_RESEARCH_REDUCER_ID,
      reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepResearchRunCertificate({
    runId: CERTIFICATE_RUN_ID,
    lineageId: CERTIFICATE_LINEAGE_ID,
    generation: 1,
    projectionEvents,
    artifactStore: store,
    artifactBindings: bindings,
    transitionReceipts: certificateTransitionInputs(bindings, projectionEvents),
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'rollback-gate-certificate-issuer',
    issuedAt: CERTIFICATE_TIMESTAMP,
  });
  return {
    artifactBindings: bindings,
    verificationInput: { bundle, projectionEvents, artifactStore: store, replay, providers },
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
  const anchorId = 'deep-research-rollback-anchor';
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
    drillId: 'deep-research-rollback-gate-drill',
    mode: 'deep-research',
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
    currentMode: 'deep-research',
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
      expectedMode: 'deep-research',
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

async function validModeGateInput(): Promise<DeepResearchModeGateInput<ReplayProjection>> {
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
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    },
  };
}

async function genuineGateEvidence(): Promise<Readonly<{
  gateInput: DeepResearchModeGateInput<ReplayProjection>;
  certificate: DeepResearchModeMigrationCertificate;
}>> {
  const gateInput = await validModeGateInput();
  const result = await new DeepResearchModeMigrationGate().evaluate(gateInput);
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
    classificationId: 'deep-research-rollback-classification',
    classifiedAt: '2026-07-22T12:00:00Z',
    classifierBuildId: 'rollback-gate-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
}

function resumeEvidence(): DeepResearchResumeParityEvidence {
  const lease = { runId: 'run-1', leaseId: 'lease-1', lineageId: 'lineage-1', generation: 1,
    deadlineAt: '2026-07-23T12:00:00Z', remainingMs: 60_000, replayFingerprint: hash('replay') };
  const decision = {
    decisionVersion: 1, decisionId: 'decision-1', decisionDigest: hash('decision'),
    authority: 'dark-evidence-only', legacyAuthority: 'unchanged', productionCompletion: false,
    compatibilityOutcome: 'exact', manifestDisposition: 'original', compatibility: [], branches: [],
    effects: [], invalidation: { changedSourceVersionIds: [], invalidatedEvidenceIds: [],
      invalidatedClaimVersionIds: [], reopenedQuestionIds: [], reopenedLogicalLeafIds: [],
      synthesisReopened: false }, lease, forensicReceiptDigests: [], verifiedArtifactDigests: [],
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
  overrides: Partial<DeepResearchResumeParityEvidence['legacyDecision']>,
): DeepResearchResumeParityEvidence {
  const evidence = resumeEvidence();
  return {
    ...evidence,
    legacyDecision: { ...evidence.legacyDecision, ...overrides },
    ledgerDecision: { ...evidence.ledgerDecision, ...overrides },
  };
}

function resumeEvidenceWithLedgerDecision(
  overrides: Partial<DeepResearchResumeParityEvidence['ledgerDecision']>,
): DeepResearchResumeParityEvidence {
  const evidence = resumeEvidence();
  return {
    ...evidence,
    ledgerDecision: { ...evidence.ledgerDecision, ...overrides },
  };
}

function migrationCertificate(): DeepResearchModeMigrationCertificate {
  const windowCore = { state: 'open' as const, elapsedCalendarDays: 1,
    successfulAuthoritativeExecutions: 0, minimumCalendarDays: 14 as const,
    minimumSuccessfulAuthoritativeExecutions: 5 as const, unresolvedEvidenceCount: 0,
    lowTraffic: false, windowClosed: false as const };
  const window = { ...windowCore, evaluationDigest: digest(windowCore) };
  const core = { schemaVersion: 1 as const, certificateKind: 'mode-migration-readiness' as const,
    mode: 'deep-research' as const, readiness: 'ready-for-phase-014-consideration' as const,
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
  parityReceipt: DeepResearchParityReceipt,
  verificationInput: DeepResearchOfflineVerificationInput<ReplayProjection>,
  artifactBindings: readonly DeepResearchSealedArtifactBinding[],
): readonly DeepResearchLifecycleEvidenceRow[] {
  const bundle = parseDeepResearchCertificateBundle(verificationInput.bundle);
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
  const kinds: readonly DeepResearchLifecycleEvidenceRow['kind'][] = [
    'init', 'gather-analyze', 'convergence', 'synthesis', 'memory-save', 'crash-resume',
    'source-refresh', 'quarantine', 'contradiction', 'incomplete-run',
  ];
  return kinds.map((kind, index) => {
    const identity = identities[index];
    if (identity === undefined) throw new Error('Lifecycle evidence fixture is incomplete');
    return { kind, ...identity, status: 'covered' };
  });
}

function emptyModeGateInput(): DeepResearchModeGateInput<JsonObject> {
  return {
    candidateSha: CANDIDATE_SHA, baseSha: BASE_SHA, sharedContractDigest: hash('shared'),
    writeSetDigest: hash('write-set'), versions: { eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-research-event@1', reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION },
    verifierIdentity: 'external-verifier', verifierVersion: '1',
    authority: { state: 'legacy_authoritative', epoch: 1 }, parity: null, sealedArtifacts: null,
    certificates: null, resumeEvidence: null, lifecycle: [], rollback: null,
    rollbackWindow: { openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions: [], unresolvedEvidenceCount: 0, lowTraffic: false }, unresolvedRiskIds: [],
  };
}

async function gatewayHarness(
  authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 },
  authorityUnavailable = false,
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
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
}

function parityEvidenceBinding(
  fixtureId: string,
  streamDigest: string,
  caseEvidenceDigest: string,
  referenceSetDigest: string,
  attestationDigest: string,
): DeepResearchParityCertificateEvidenceBinding {
  return { fixtureId, legacyStreamDigest: streamDigest, ledgerStreamDigest: streamDigest,
    legacyProjectionFingerprint: hash('projection'), ledgerProjectionFingerprint: hash('projection'),
    caseEvidenceDigest, referenceSetDigest, attestationFinalDigests: [attestationDigest] };
}

function comparatorConfigDigest(): string {
  return digest({ comparatorVersion: DEEP_RESEARCH_COMPARATOR_VERSION,
    lifecycleMap: DEEP_RESEARCH_LIFECYCLE_EVENT_MAP,
    volatilityAllowlist: DEEP_RESEARCH_VOLATILITY_ALLOWLIST,
    diffClasses: ['artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision'] });
}

function certificateBindings(manifestDigest: string, evidence: readonly DeepResearchParityCertificateEvidenceBinding[]): ParityCertificateBindings {
  return { candidate_build_digest: digest({ manifestDigest,
    schemaVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION }),
    harness_digest: digest({ legacy: 'runtime/lib/legacy-projections', ledger: 'runtime/lib/deep-research-reducers',
      shadow: 'runtime/lib/shadow-parity', resume: 'runtime/lib/deep-research-resume-adapter' }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({ reducerId: 'deep-research:shadow-parity-fold',
      reducerVersion: 'deep-research-shadow-parity-reducer@1',
      projectionVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION }),
    reducer_digest: digest({ reducerVersion: DEEP_RESEARCH_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({ adapterVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: DEEP_RESEARCH_LIFECYCLE_EVENT_MAP, certificateEvidenceBindings: evidence }),
    policy_version: 'deep-research-shadow-only@1' };
}

async function parityFixture(withAuthorizedAnchor: boolean) {
  const harness = await gatewayHarness();
  const event = createFixtureEvent(harness.registry, 1);
  const attestationDigest = hash('attestation');
  if (withAuthorizedAnchor) {
    const request = await createFixtureRequest(harness.ledger, event, harness.policies, 'parity-anchor', {
      mode: 'deep-research', evidenceDigest: attestationDigest,
    });
    expect((await harness.gateway.authorize(request)).verdict).toBe('allow');
  }
  const fixtureId = 'fixture-authenticated';
  const contractDigest = hash('contract');
  const manifest = compileParityCaseManifest({ baseSha: BASE_SHA,
    baselineRows: [{ scenarioId: fixtureId, mode: 'deep-research', contractDigest, disposition: 'protected' }],
    cases: [{ caseId: fixtureId, scenarioId: fixtureId, mode: 'deep-research', contractDigest,
      requiredObservations: ['ordered-transitions'], projectionIds: ['research'], timeoutMs: 1000,
      terminationPolicy: 'bounded' }] });
  const pass: ShadowParityCasePass = { ok: true, caseId: fixtureId, mode: 'deep-research',
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
  const issued = issueParityCertificate({ manifest, mode: 'deep-research', caseResults: [pass],
    bindings: certificateBindings(manifest.manifestDigest, [binding]) });
  if (!issued.ok) throw new Error(issued.refusal.message);
  const body = { schemaVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `receipt-${fixtureId}`, baseSha: BASE_SHA, runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: 'deep-research-event@1', reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    comparatorVersion: DEEP_RESEARCH_COMPARATOR_VERSION,
    projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
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
  const receipt: DeepResearchParityReceipt = { ...body, receiptDigest: digest(body) };
  const modeGateInput = createDeepResearchModeGateInput({ manifest, expectedFixtureIds: [fixtureId], receipts: [receipt] });
  expect(modeGateInput.schemaVersion).toBe(DEEP_RESEARCH_MODE_GATE_INPUT_VERSION);
  return { harness, manifest, receipt, modeGateInput };
}

afterEach(() => {
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
    const early = evaluateDeepResearchRollbackWindow({ openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z', executions, unresolvedEvidenceCount: 0, lowTraffic: false });
    expect(early).toMatchObject({ state: 'open', elapsedCalendarDays: 14,
      successfulAuthoritativeExecutions: 4, windowClosed: false });
    const ready = evaluateDeepResearchRollbackWindow({ openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z', executions: [...executions, {
        executionId: 'execution-6', authorityState: 'new_authoritative_reversible', authorityEpoch: 2,
        result: 'trusted-completion', certificateDigest: hash('execution-6') }],
      unresolvedEvidenceCount: 0, lowTraffic: false });
    expect(ready.state).toBe('eligible_to_close');
    expect(ready.windowClosed).toBe(false);
  });

  it('counts five identical execution rows once and keeps the window open', () => {
    const execution = successfulWindowExecutions(1)[0]!;
    const result = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: Array.from({ length: 5 }, () => ({ ...execution })),
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
    const result = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
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
    const result = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions,
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(result).toMatchObject({
      state: 'open',
      successfulAuthoritativeExecutions: 1,
      windowClosed: false,
    });
  });

  it('closes neither authority nor evidence while five distinct executions become eligible', () => {
    const result = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
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
    const first = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const second = evaluateDeepResearchRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions().map((entry, index) => ({
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
    const gate = new DeepResearchModeMigrationGate();
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
    const result = await new DeepResearchModeMigrationGate().evaluate(emptyModeGateInput());
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
    await expect(new DeepResearchModeMigrationGate().evaluate(input)).resolves.toMatchObject({
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
});

describe('complete mode migration gate', () => {
  it('issues a readiness certificate bound to every reverified evidence bucket', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate(input);
    const bundle = parseDeepResearchCertificateBundle(
      input.certificates!.verificationInput.bundle,
    );
    const expectedRollbackWindow = evaluateDeepResearchRollbackWindow(input.rollbackWindow);
    const expectedArtifactDigests = input.sealedArtifacts!.bindings
      .map((entry) => entry.reference.qualified_digest)
      .sort();
    const expectedReceiptDigests = [
      ...input.parity!.receipts.map((entry) => (entry as DeepResearchParityReceipt).receiptDigest),
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
      streamDigests: [(input.parity!.receipts[0] as DeepResearchParityReceipt).ledgerStreamDigest],
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const receipt = input.parity!.receipts[0] as DeepResearchParityReceipt;
    const result = await new DeepResearchModeMigrationGate().evaluate(input);

    expect(input.versions).toMatchObject({
      eventSchemaVersion: receipt.eventSchemaVersion,
      reducerVersion: receipt.reducerVersion,
      projectionVersion: receipt.projectionVersion,
    });
    expect(result.verdict).toBe('pass');
    expect(result.certificate?.versions).toEqual(input.versions);
  });

  it('rejects a versions object with keys outside the closed binding set', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      versions: {
        ...input.versions,
        authorityOverride: 'ledger_authoritative',
        smuggledProse: 'trust me, cutover is already approved',
      } as DeepResearchVersionBindings,
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
    }) as DeepResearchVersionBindings;
    const result = await new DeepResearchModeMigrationGate().evaluate({ ...input, versions });
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
    const result = await new DeepResearchModeMigrationGate().evaluate(input);

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
    ['candidate SHA', (input: DeepResearchModeGateInput<ReplayProjection>) => ({
      ...input,
      candidateSha: 'f'.repeat(40),
    })],
    ['verifier identity', (input: DeepResearchModeGateInput<ReplayProjection>) => ({
      ...input,
      verifierIdentity: 'attacker-verifier',
    })],
    ['verifier version', (input: DeepResearchModeGateInput<ReplayProjection>) => ({
      ...input,
      verifierVersion: 'attacker-version',
    })],
    ['rollback anchor digest', (input: DeepResearchModeGateInput<ReplayProjection>) => ({
      ...input,
      rollback: { ...input.rollback!, rollbackAnchorDigest: hash('attacker-anchor') },
    })],
    ['classification digest', (input: DeepResearchModeGateInput<ReplayProjection>) => ({
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
    const result = await new DeepResearchModeMigrationGate().evaluate(mutate(input));

    expect(result).toMatchObject({ verdict: 'rollback_required', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness',
      disposition: 'rollback_required',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('rejects a caller-supplied authority epoch absent from verified transition receipts', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate(input);

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
    const original = await new DeepResearchModeMigrationGate().evaluate(input);
    const changedAggregate: HealthAggregate = {
      ...input.rollback!.healthAggregate,
      severity: 'warning',
      observationId: 'replacement-health-observation',
      activeSignalIds: [hash('replacement-health-signal')],
      policyVersion: 'replacement-health-policy@1',
      policyDigest: hash('replacement-health-policy'),
    };
    const changed = await new DeepResearchModeMigrationGate().evaluate({
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

  it('rejects ten relabeled lifecycle rows sharing one fabricated identity', async () => {
    const input = await validModeGateInput();
    const lifecycle = input.lifecycle.map((row) => ({
      ...row,
      fixtureId: 'fabricated-fixture',
      eventDigest: hash('fabricated-event'),
      receiptDigest: hash('fabricated-receipt'),
    }));
    const result = await new DeepResearchModeMigrationGate().evaluate({ ...input, lifecycle });

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
    const result = await new DeepResearchModeMigrationGate().evaluate({ ...input, lifecycle });

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
    const result = await new DeepResearchModeMigrationGate().evaluate({ ...input, lifecycle });

    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_STALE',
    }));
  });

  it('accepts ten distinct lifecycle identities derived from verified evidence', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate(input);

    expect(new Set(input.lifecycle.map((row) => row.eventDigest)).size).toBe(10);
    expect(new Set(input.lifecycle.map((row) => row.receiptDigest)).size).toBe(10);
    expect(result.verdict).toBe('pass');
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'ready',
      reasonCode: null,
    }));
  });

  it('withholds the certificate when a bucket is missing or stale', async () => {
    const input = await validModeGateInput();
    const missing = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      sealedArtifacts: null,
    });
    const stale = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      baseSha: '3'.repeat(40),
    });

    expect(missing).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(missing.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      disposition: 'blocked',
      reasonCode: 'EVIDENCE_MISSING',
    }));
    expect(stale).toMatchObject({ verdict: 'blocked', certificate: null });
  });

  it('rejects an agreed blocked compatibility outcome as invalid resume evidence', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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

  it('rejects safe ledger branch work absent from the legacy resume decision', async () => {
    const input = await validModeGateInput();
    const result = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithLedgerDecision({
        branches: [{
          logicalLeafId: 'ledger-only-leaf',
          manifestRevision: 'manifest-1',
          retryKey: 'retry-ledger-only-leaf',
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: resumeEvidenceWithLedgerDecision({
        effects: [{
          effectId: 'ledger-only-effect',
          logicalEffectId: 'ledger-only-logical-effect',
          disposition: 'compensate',
          attemptRefs: ['ledger-only-effect-attempt'],
          nextAttemptId: null,
          decisionReason: 'The ledger path reports compensation absent from the legacy path.',
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: {
        ...evidence,
        ledgerDecision: {
          ...evidence.ledgerDecision,
          invalidation: {
            changedSourceVersionIds: ['source-version-ledger-only'],
            invalidatedEvidenceIds: ['evidence-ledger-only'],
            invalidatedClaimVersionIds: ['claim-ledger-only'],
            reopenedQuestionIds: ['question-ledger-only'],
            reopenedLogicalLeafIds: ['leaf-ledger-only'],
            synthesisReopened: true,
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
    const result = await new DeepResearchModeMigrationGate().evaluate({
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

  it('rejects unsafe component, branch, and effect resume dispositions', async () => {
    const input = await validModeGateInput();
    const unsafeDecisions: readonly Partial<DeepResearchResumeParityEvidence['legacyDecision']>[] = [
      { compatibility: [{ component: 'adapter', persistedVersion: '1', installedVersion: '2',
        outcome: 'pin-old-runtime', revision: 'compatibility@1',
        decisionReason: 'Only the pinned runtime can resume this state.' }] },
      { branches: [{ logicalLeafId: 'leaf-1', manifestRevision: 'manifest-1',
        retryKey: 'retry-1', disposition: 'reject', attemptId: null,
        evidenceEventIds: [], decisionReason: 'Branch resume is unsafe.' }] },
      { effects: [{ effectId: 'effect-1', logicalEffectId: 'logical-effect-1',
        disposition: 'blocked', attemptRefs: [], nextAttemptId: null,
        decisionReason: 'Effect state cannot be reconciled safely.' }] },
    ];

    for (const decision of unsafeDecisions) {
      const result = await new DeepResearchModeMigrationGate().evaluate({
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
    readonly transformReportedStaleWriterLease?: (
      lease: NonNullable<DeepResearchRollbackRequest['staleWriterLease']>,
    ) => unknown;
  }

  async function rollbackRequestFixture(
    capabilityId = 'write',
    destructiveIntent: DeepResearchRollbackRequest['destructiveIntent'] = 'none',
    operation: NonNullable<DeepResearchRollbackRequest['operation']> = 'rollback',
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
    const harness = await gatewayHarness(authority, gatewayUnavailable);
    const coordinator = new FencedLeaseCoordinator({ rootDirectory: temporaryRoot('fencing'), operationTimeoutMs: 1000 });
    const writerResource = claims.reportedWriterResource ?? {
      kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'deep-research-ledger-writer' },
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
      `rollback-${capabilityId}`, { mode: 'deep-research', capabilityId, evidenceDigest });
    const rollbackSwitch = new DeepResearchRollbackSwitch({ gateway: harness.gateway,
      fencingCoordinator: coordinator });
    const selfIssuedAuthorization = capabilityId === 'self-authorized-recovery'
      ? { issuer: 'deep-research', certificateDigest: digest({ capabilityId, operation }) }
      : undefined;
    const input = { configurationVersion, operation,
      currentAuthority, expectedAuthorityEpoch: 1, gateCertificate: certificate,
      gateInput, authorizationRequest, rollbackReason, admissionState: 'frozen',
      classificationManifest: classification,
      resumeEvidence: resume, writerResource, staleWriterLease, destructiveIntent,
      ...reportedCounts, rollbackAnchorDigest,
      selfIssuedAuthorization } as DeepResearchRollbackRequest;
    return { input, rollbackSwitch, coordinator };
  }

  async function request(
    capabilityId = 'write',
    destructiveIntent: DeepResearchRollbackRequest['destructiveIntent'] = 'none',
    operation: NonNullable<DeepResearchRollbackRequest['operation']> = 'rollback',
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

  it('denies a freshly authorized resource that is not the Deep Research ledger writer', async () => {
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

  it('authorizes the canonical Deep Research writer as the positive control', async () => {
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
    const rollbackSwitch = new DeepResearchRollbackSwitch({ gateway: harness.gateway,
      fencingCoordinator: coordinator });
    const gateInput = await validModeGateInput();
    const gateResult = await new DeepResearchModeMigrationGate().evaluate(gateInput);
    if (gateResult.certificate === null) throw new Error('Expected a genuine mode-gate certificate');
    const cases: readonly [DeepResearchRollbackRequest, string][] = [
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
    } as unknown as DeepResearchRollbackRequest;

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
      { mode: 'deep-research', authorityEpoch: 1 },
    );
    await expect(harness.gateway.authorize(staleRequest)).resolves.toMatchObject({
      verdict: 'deny',
      reasonCode: 'stale_authority_epoch',
    });
  });
});
