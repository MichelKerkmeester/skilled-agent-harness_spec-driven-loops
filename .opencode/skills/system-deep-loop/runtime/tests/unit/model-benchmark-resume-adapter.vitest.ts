// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Certificate Tests
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import {
  chmodSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it, vi } from 'vitest';

vi.setConfig({ testTimeout: 86_400_000 });

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepImprovementCommonTransitionKinds,
  issueDeepImprovementCommonRunCertificate,
} from '../../lib/deep-improvement-common-certificates/index.js';
import {
  ModelBenchmarkCertificateFailureCodes,
  MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
  ModelBenchmarkTransitionKinds,
  issueModelBenchmarkRunCertificate,
  verifyModelBenchmarkCertificateOffline,
} from '../../lib/model-benchmark-certificates/index.js';
import {
  MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  ModelBenchmarkWireEventTypes,
  createModelBenchmarkEventRegistry,
  modelBenchmarkEventDefinitions,
  prepareModelBenchmarkEvent,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_PROJECTION_CODEC_VERSION,
  MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  MODEL_BENCHMARK_REDUCER_ID,
  MODEL_BENCHMARK_REDUCER_VERSION,
  createModelBenchmarkProjectionState,
  foldModelBenchmarkEvents,
  modelBenchmarkProjectionIntegrityDigest,
  reduceModelBenchmarkVerifiedEvent,
} from '../../lib/model-benchmark-reducers/index.js';
import {
  MODEL_BENCHMARK_CONTINUITY_LADDER,
  MODEL_BENCHMARK_RESUME_ADAPTER_VERSION,
  ModelBenchmarkResumeAdapter,
  modelBenchmarkMigrationRegistryDigest,
  modelBenchmarkResumeFingerprintDigest,
  parseModelBenchmarkResumeRequest,
} from '../../lib/model-benchmark-resume-adapter/index.js';
import {
  ModelBenchmarkArtifactKinds,
  createModelBenchmarkSealedArtifactStore,
  sealModelBenchmarkArtifact,
} from '../../lib/model-benchmark-sealed-artifacts/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonEventRegistry,
  deepImprovementCommonEventDefinitions,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
  DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
  createDeepImprovementCommonProjectionState,
  reduceDeepImprovementCommonVerifiedEvent,
} from '../../lib/deep-improvement-common-reducers/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  AuthorizedEvidenceWriter,
  CertificationProviderRegistry,
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
  effectConfirmationBindsIntent,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
} from '../../lib/replay-fingerprint/index.js';
import { InitialArtifactKinds } from '../../lib/sealed-reference-artifacts/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';
import type {
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkOfflineVerificationInput,
  ModelBenchmarkTransitionReceiptInput,
  ModelBenchmarkTransitionReceiptSubstrate,
} from '../../lib/model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkEventEnvelope,
  ModelBenchmarkEventInput,
  ModelBenchmarkEventStem,
  ModelBenchmarkLedgerEvent,
  ModelBenchmarkPayloadMap,
  ModelBenchmarkReplayMetadata,
  ModelBenchmarkScopeMap,
  ModelBenchmarkSpecificEventStem,
  TaskLineage,
  TrialMatrixKey,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkProjectionCheckpoint,
  ModelBenchmarkProjectionState,
} from '../../lib/model-benchmark-reducers/index.js';
import type {
  ModelBenchmarkMigrationRegistry,
  ModelBenchmarkResumeCompatibilityComponent,
  ModelBenchmarkResumeComponentFact,
  ModelBenchmarkResumeRequest,
} from '../../lib/model-benchmark-resume-adapter/index.js';
import type {
  ModelBenchmarkArtifactDependency,
  ModelBenchmarkArtifactKind,
  ModelBenchmarkArtifactMaterial,
  ModelBenchmarkSealedArtifactBinding,
} from '../../lib/model-benchmark-sealed-artifacts/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonTransitionReceiptInput,
  DeepImprovementCommonTransitionReceiptSubstrate,
} from '../../lib/deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonEventEnvelope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonScopeMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type { DeepImprovementCommonProjectionState } from '../../lib/deep-improvement-common-reducers/index.js';
import type {
  DeepImprovementBaselineInputMaterial,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementRawTrialOutputMaterial,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type {
  EffectConfirmationPayload,
  EffectIntentPayload,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';

type ReplayProjection = DeepImprovementCommonProjectionState & JsonObject;
type ModelReplayProjection = ModelBenchmarkProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly store: ReturnType<typeof createModelBenchmarkSealedArtifactStore>;
  readonly bindings: readonly DeepImprovementCommonSealedArtifactBinding[];
}

interface ScenarioOptions {
  readonly completeCommonRun?: boolean;
  readonly namedDigest?: 'fabricated' | 'wrong-kind';
  readonly namedDigestField?: 'unresolved' | 'veto';
  readonly staleCanary?: boolean;
  readonly unauthorizedOrigin?: boolean;
}

const TIMESTAMP = '2026-07-23T09:00:00.000Z';
const VERIFICATION_TIME = '2026-07-23T09:30:00.000Z';
const RUN_ID = 'certificate-run-1';
const LINEAGE_ID = 'lineage-1';
const CANDIDATE_ID = 'candidate-1';
const EVALUATION_EPOCH_ID = 'evaluation-epoch-1';
const CANARY_EPOCH_ID = 'canary-epoch-1';
const CANARY_SUITE_ID = 'canary-suite-1';
const PROMOTION_ID = 'promotion-1';
const BASELINE_ID = 'baseline-1';
const STREAM_ID = 'deep-improvement-common-certificate-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];
const fixedNow = () => new Date('2026-07-23T09:15:00.000Z');

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-improvement-common-certificate-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function replayMetadata() {
  return {
    fingerprint_version: 1,
    final_digest: digest('replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  } as const;
}

function scopeFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'model-benchmark' as const,
  };
  const candidate = { ...base, candidateId: CANDIDATE_ID };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
      fixtureId: 'fixture-1',
      observationId: 'observation-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: CANARY_EPOCH_ID,
      canarySuiteId: CANARY_SUITE_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return {
      ...candidate,
      promotionId: PROMOTION_ID,
      baselineId: BASELINE_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as DeepImprovementCommonScopeMap[TStem];
  }
  return base as DeepImprovementCommonScopeMap[TStem];
}

function createEvent<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  sequence: number,
  data: DeepImprovementCommonPayloadMap[TStem],
  previous: DeepImprovementCommonLedgerEvent | null,
): DeepImprovementCommonEventEnvelope<TStem> {
  const prepared = prepareDeepImprovementCommonEvent({
    stem,
    scope: scopeFor(stem),
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: replayMetadata(),
    data,
    eventId: `certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-certificate-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `certificate-event-${sequence}`,
  }, createDeepImprovementCommonEventRegistry());
  return prepared.envelope as DeepImprovementCommonEventEnvelope<TStem>;
}

function append<TStem extends DeepImprovementCommonEventStem>(
  events: DeepImprovementCommonLedgerEvent[],
  stem: TStem,
  data: DeepImprovementCommonPayloadMap[TStem],
): DeepImprovementCommonEventEnvelope<TStem> {
  const event = createEvent(stem, events.length + 1, data, events.at(-1) ?? null);
  events.push(event);
  return event;
}

function scoreVector() {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: 0.91,
      normalizedScore: 0.91,
      weight: 1,
    }],
    aggregateScore: 0.91,
    uncertainty: 0.05,
  };
}

function happyEvents(options: ScenarioOptions = {}): readonly DeepImprovementCommonLedgerEvent[] {
  const events: DeepImprovementCommonLedgerEvent[] = [];
  append(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:deep-improvement',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const proposal = append(events, 'deep_improvement_common.candidate_proposed', {
    proposalRef: 'proposal:candidate-1',
    proposalDigest: digest('proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null,
    targetRef: 'target:agent-1',
    targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  });
  append(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: proposal.event_id,
    proposalPayloadDigest: proposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const epoch = append(events, 'deep_improvement_common.evaluation_epoch_sealed', {
    evaluatorRef: 'evaluator:independent-1',
    evaluatorCapsuleDigest: digest('evaluator-capsule'),
    fixtureSetRef: 'profile:heldout-1',
    fixtureSetDigest: digest('fixture-set'),
    scorePolicyVersion: 'score-policy@1',
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    evaluationBudgetRef: 'budget:evaluation-1',
  });
  const evaluationStarted = append(events, 'deep_improvement_common.evaluation_started', {
    epochSealedEventId: epoch.event_id,
    epochPayloadDigest: epoch.payload.payloadDigest,
    executionReceiptRef: 'receipt:evaluation-start-1',
    fixtureCount: 1,
    evaluatorFingerprint: digest('evaluator-fingerprint'),
  });
  const observation = append(events, 'deep_improvement_common.evaluation_observation_recorded', {
    evaluationStartedEventId: evaluationStarted.event_id,
    evaluatorRef: 'evaluator:independent-1',
    fixtureRef: 'fixture:heldout-1',
    rawObservationRef: 'observation:raw-1',
    rawObservationDigest: digest('raw-observation'),
    executionReceiptRef: 'receipt:observation-1',
    observationOutcome: 'pass',
  });
  const normalized = append(events, 'deep_improvement_common.evaluation_normalized', {
    observationEventIds: [observation.event_id],
    observationSetDigest: digest('observation-set'),
    scorePolicyVersion: 'score-policy@1',
    scorerFingerprint: digest('scorer'),
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    scoreVector: scoreVector(),
    normalizationReceiptRef: 'receipt:normalization-1',
  });
  const verificationRequested = append(
    events,
    'deep_improvement_common.evaluation_verification_requested',
    {
      normalizedEventId: normalized.event_id,
      normalizedPayloadDigest: normalized.payload.payloadDigest,
      verificationPolicyVersion: 'verification-policy@1',
      verifierRef: 'verifier:independent-1',
      reasonCode: 'promotion-bound-score',
    },
  );
  append(events, 'deep_improvement_common.evaluation_verification_recorded', {
    requestEventId: verificationRequested.event_id,
    verifierRef: 'verifier:independent-1',
    verificationOutcome: 'confirmed',
    verificationEvidenceRef: 'evidence:verification-1',
    verificationEvidenceDigest: digest('verification-evidence'),
    verificationReceiptRef: 'receipt:verification-1',
  });
  const suite = append(events, 'deep_improvement_common.canary_suite_sealed', {
    suiteRef: 'canary-suite:sealed-1',
    suiteDigest: digest('canary-suite'),
    canaryPolicyVersion: 'canary-policy@1',
    fixtureCount: 2,
    protectedMaterialRef: 'protected:canary-1',
    protectedMaterialDigest: digest('protected-canary'),
  });
  const canary = append(events, 'deep_improvement_common.canary_executed', {
    suiteSealedEventId: suite.event_id,
    suitePayloadDigest: suite.payload.payloadDigest,
    executionReceiptRef: 'receipt:canary-execution-1',
    canaryObservationRef: 'canary-observation:1',
    canaryObservationDigest: digest('canary-observation'),
    outcome: 'pass',
  });
  const gate = append(events, 'deep_improvement_common.canary_gate_passed', {
    executionEventIds: [canary.event_id],
    evidenceSetDigest: digest('canary-evidence'),
    policyVersion: 'canary-gate@1',
    policyFingerprint: digest('canary-policy'),
    decisionReceiptRef: 'receipt:canary-pass-1',
  });
  const promotion = append(events, 'deep_improvement_common.promotion_proposed', {
    normalizedEventId: normalized.event_id,
    normalizedPayloadDigest: normalized.payload.payloadDigest,
    canaryGateEventId: gate.event_id,
    canaryGatePayloadDigest: gate.payload.payloadDigest,
    proposalPolicyVersion: 'promotion-proposal@1',
    requestedRollout: 'shadow',
    evidenceSetDigest: digest('promotion-evidence'),
  });
  const authorization = append(events, 'deep_improvement_common.promotion_authorized', {
    proposalEventId: promotion.event_id,
    proposalPayloadDigest: promotion.payload.payloadDigest,
    externalAuthorizationRef: 'transition-authorization:decision-1',
    externalAuthorizationDigest: digest('authorization'),
    authorizationPolicyVersion: 'promotion-authorization@1',
    authorizationReceiptRef: 'receipt:promotion-authorization-1',
  });
  const rollout = append(events, 'deep_improvement_common.promotion_shadow_started', {
    authorizationEventId: authorization.event_id,
    authorizationPayloadDigest: authorization.payload.payloadDigest,
    rolloutRef: 'rollout:shadow-1',
    rolloutDigest: digest('rollout'),
    startedAt: TIMESTAMP,
  });
  append(events, 'deep_improvement_common.promotion_completed', {
    authorizationEventId: authorization.event_id,
    rolloutEventIds: [rollout.event_id],
    evidenceSetDigest: digest('promotion-completion-evidence'),
    completionReceiptRef: 'receipt:promotion-completion-1',
    completedAt: TIMESTAMP,
  });
  if (options.completeCommonRun !== false) {
    const prior = events.at(-1) as DeepImprovementCommonLedgerEvent;
    append(events, 'deep_improvement_common.run_completed', {
      terminalOutcome: 'completed',
      stopReason: 'converged',
      sessionOutcome: 'promoted',
      finalLedgerTailHash: digest(prior),
      counts: {
        candidates: 1,
        evaluations: 1,
        observations: 1,
        canaryRuns: 1,
        promotions: 1,
      },
      completionEvidenceRefs: ['evidence:completion-1'],
    });
  }
  return Object.freeze(events);
}

async function authorizedLedger(events: readonly DeepImprovementCommonLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(
    deepImprovementCommonEventDefinitions(),
  );
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('ledger');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepImprovementCommonEvent({
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
      `certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new Error(`Expected fixture authorization at ${index}: ${JSON.stringify(authorization)}`);
    }
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
    now: fixedNow,
  });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-improvement-certificate-writer',
    correlationId: 'deep-improvement-certificate-writer',
    ttlMs: 3_600_000,
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
    authorizationContext: (event) => ({
      mode: 'improvement',
      priorStateVersion: 'deep-improvement-certificate-state@1',
      priorStateFingerprint: digest('deep-improvement-certificate-state'),
      actorId: 'deep-improvement-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepImprovementCommonTransitionReceiptSubstrate = {
    writer,
    registry,
    producer: { name: 'deep-improvement-certificate-tests', version: '1' },
  };
  return { ledger, registry, receiptSubstrate };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepImprovementCommonWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepImprovementCommonVerifiedEvent(
          verified,
          state,
        ).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function providers(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-improvement-test-provider',
      key_id: 'deep-improvement-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

function origin(
  events: readonly DeepImprovementCommonLedgerEvent[],
  stem: DeepImprovementCommonEventStem,
  unauthorized = false,
) {
  const event = events.find((candidate) => candidate.payload.stem === stem);
  if (!event) throw new Error(`Missing origin ${stem}`);
  return {
    eventStem: stem,
    eventId: unauthorized ? 'event-never-authorized' : event.event_id,
    payloadDigest: event.payload.payloadDigest,
  };
}

function locator(label: string) {
  return {
    scheme: 'artifact' as const,
    locatorDigest: digest(`locator:${label}`),
    selector: `artifact:${label}`,
    revision: 'revision-1',
  };
}

function dependency(purpose: string, reference: SealedArtifactReference) {
  return { purpose, reference };
}

async function sealedArtifacts(
  events: readonly DeepImprovementCommonLedgerEvent[],
  options: ScenarioOptions,
) {
  const store = createModelBenchmarkSealedArtifactStore({
    rootDirectory: temporaryRoot('artifacts'),
  });
  const fixtures = await Promise.all(
    Array.from({ length: 12 }, async (_, index) => (
      store.seal(InitialArtifactKinds.FIXTURE, { fixture: index + 1 })
    )),
  );
  const fixture = (index: number) => {
    const value = fixtures[index]?.artifact.reference;
    if (!value) throw new Error(`Missing fixture ${index}`);
    return value;
  };
  const evaluatorMaterial: DeepImprovementEvaluatorCapsuleMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'evaluator-capsule-1',
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    evaluatorImplementationDigest: digest('evaluator-capsule'),
    evaluatorSchemaDigest: digest('evaluator-schema'),
    rubricDigest: digest('rubric'),
    policyDigest: digest('policy'),
    fixtureManifestDigest: digest('fixture-set'),
    hiddenAnchorCommitmentDigest: digest('hidden-anchor'),
    calibrationDigest: digest('calibration'),
    normalizationDigest: digest('normalization'),
    environmentDigest: digest('environment'),
    capabilityDigest: digest('capability'),
    visibilityPolicy: {
      candidateView: 'verdict-band',
      hiddenFixtures: 'withheld',
      exactScores: 'withheld',
      evaluatorInternals: 'withheld',
      terminalEvidence: 'withheld',
    },
    budgetPolicy: {
      maxQueries: 20,
      maxBytes: 4096,
      maxWallClockMs: 1000,
      maxCostMicros: 5000,
    },
    dependencyReferences: [dependency('fixture', fixture(0))],
    originEvent: origin(
      events,
      'deep_improvement_common.evaluation_epoch_sealed',
      options.unauthorizedOrigin,
    ),
    producerVersion: 'evaluator-producer@1',
    locator: locator('evaluator'),
  };
  const evaluator = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    evaluatorMaterial,
  );
  const candidateMaterial: DeepImprovementCandidateInputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'candidate-input-1',
    candidateId: CANDIDATE_ID,
    lineageId: LINEAGE_ID,
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    parentCandidateReference: null,
    mutationOperatorReference: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    profileScopeDigest: digest('profile'),
    modelConfigurationDigest: digest('model'),
    promptConfigurationDigest: digest('prompt'),
    toolConfigurationDigest: digest('tools'),
    selectedFixtureManifestDigest: digest('fixture-set'),
    seed: 7,
    sourceArtifactReferences: [fixture(1)],
    dependencyReferences: [
      dependency('evaluator', evaluator.reference),
      dependency('source', fixture(1)),
    ],
    originEvent: origin(events, 'deep_improvement_common.candidate_generated'),
    producerVersion: 'candidate-producer@1',
    locator: locator('candidate'),
  };
  const candidate = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
    candidateMaterial,
  );
  const baselineMaterial: DeepImprovementBaselineInputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'baseline-input-1',
    baselineId: BASELINE_ID,
    lineageId: LINEAGE_ID,
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    incumbentReference: fixture(2),
    profileScopeDigest: digest('profile'),
    modelConfigurationDigest: digest('baseline-model'),
    promptConfigurationDigest: digest('baseline-prompt'),
    toolConfigurationDigest: digest('baseline-tools'),
    selectedFixtureManifestDigest: digest('fixture-set'),
    seed: 7,
    sourceArtifactReferences: [fixture(2)],
    dependencyReferences: [
      dependency('evaluator', evaluator.reference),
      dependency('incumbent', fixture(2)),
    ],
    originEvent: origin(events, 'deep_improvement_common.candidate_generated'),
    producerVersion: 'baseline-producer@1',
    locator: locator('baseline'),
  };
  const baseline = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
    baselineMaterial,
  );
  const rawMaterial: DeepImprovementRawTrialOutputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'raw-trial-output-1',
    trialId: 'trial-1',
    candidateInputReference: candidate.reference,
    baselineInputReference: baseline.reference,
    evaluatorCapsuleReference: evaluator.reference,
    evaluationEpochId: EVALUATION_EPOCH_ID,
    fixtureId: 'fixture:heldout-1',
    caseObservations: [{
      caseId: 'case-1',
      outputDigest: digest('case-output'),
      outputReference: fixture(3),
      scoreVectorDigest: digest('score-vector'),
    }],
    rawScoreVector: scoreVector(),
    traceReferences: [fixture(4)],
    usage: {
      inputTokens: 10,
      outputTokens: 5,
      totalTokens: 15,
      costMicros: 30,
      latencyMs: 50,
    },
    executionEnvironmentDigest: digest('execution-environment'),
    integrityObservations: [{
      status: 'confirmed',
      detectorDigest: digest('integrity-detector'),
      evidenceDigest: digest('integrity-evidence'),
    }],
    normalizationVersion: 'normalization@1',
    dependencyReferences: [
      dependency('candidate', candidate.reference),
      dependency('baseline', baseline.reference),
      dependency('evaluator', evaluator.reference),
      dependency('output', fixture(3)),
      dependency('trace', fixture(4)),
    ],
    originEvent: origin(
      events,
      'deep_improvement_common.evaluation_observation_recorded',
    ),
    producerVersion: 'trial-producer@1',
    locator: locator('raw-trial'),
  };
  const raw = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
    rawMaterial,
  );
  const canaryMaterial: DeepImprovementCanaryEpochMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'canary-epoch-1',
    canaryEpochId: CANARY_EPOCH_ID,
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    suiteId: CANARY_SUITE_ID,
    lifecycle: 'active',
    suiteManifestDigest: digest('canary-suite'),
    hiddenAnchorCommitmentDigest: digest('hidden-anchor'),
    adversarialSuiteDigest: digest('adversarial'),
    metamorphicSuiteDigest: digest('metamorphic'),
    crossDomainSuiteDigest: digest('cross-domain'),
    leakagePolicy: {
      literalLeakDetection: 'required',
      semanticLeakDetection: 'required',
      candidateVisibleContent: 'withheld',
    },
    freshnessWindowSeconds: 3600,
    sealedAt: '2026-07-23T09:00:00.000Z',
    expiresAt: options.staleCanary
      ? '2026-07-23T09:15:00.000Z'
      : '2026-07-23T10:00:00.000Z',
    supersedesReference: null,
    dependencyReferences: [dependency('evaluator', evaluator.reference)],
    originEvent: origin(events, 'deep_improvement_common.canary_suite_sealed'),
    producerVersion: 'canary-producer@1',
    locator: locator('canary'),
  };
  const canary = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    canaryMaterial,
  );
  const namedDigest = options.namedDigest === 'fabricated'
    ? digest('never-sealed')
    : options.namedDigest === 'wrong-kind'
      ? evaluator.reference.content_digest
      : null;
  const refs = [
    candidate.reference,
    baseline.reference,
    evaluator.reference,
    canary.reference,
    fixture(5),
    fixture(6),
    fixture(7),
    fixture(8),
    fixture(9),
    fixture(10),
    fixture(11),
    fixture(0),
  ] as const;
  const promotionMaterial: DeepImprovementPromotionEvidenceMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1',
    artifactId: 'promotion-evidence-1',
    promotionId: PROMOTION_ID,
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    candidateInputReference: refs[0],
    baselineInputReference: refs[1],
    evaluatorCapsuleReference: refs[2],
    canaryEpochReference: refs[3],
    targetRepairEvidenceReference: refs[4],
    baselinePreservationEvidenceReference: refs[5],
    criticalDimensionEvidenceReference: refs[6],
    evaluatorIntegrityEvidenceReference: refs[7],
    canaryOutcomeEvidenceReference: refs[8],
    uncertaintyEvidenceReference: refs[9],
    costEvidenceReference: refs[10],
    rollbackTargetReference: refs[11],
    targetRepair: 'pass',
    baselinePreservation: 'pass',
    criticalDimensions: 'pass',
    evaluatorIntegrity: 'pass',
    canaryOutcome: 'pass',
    uncertaintyLowerBound: 0.8,
    uncertaintyThreshold: 0.7,
    costMicros: 30,
    costLimitMicros: 100,
    unresolvedEvidenceDigests: namedDigest === null || options.namedDigestField === 'veto'
      ? []
      : [namedDigest],
    vetoEvidenceDigests: namedDigest !== null && options.namedDigestField === 'veto'
      ? [namedDigest]
      : [],
    admissibility: namedDigest === null ? 'eligible' : 'ineligible',
    dependencyReferences: refs.map((reference, index) => (
      dependency(`promotion-${index}`, reference)
    )),
    originEvent: origin(events, 'deep_improvement_common.promotion_proposed'),
    producerVersion: 'promotion-producer@1',
    locator: locator('promotion'),
  };
  const promotion = await sealDeepImprovementCommonArtifact(
    store,
    DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    promotionMaterial,
  );
  return {
    store,
    bindings: Object.freeze([
      candidate,
      baseline,
      evaluator,
      raw,
      canary,
      promotion,
    ]) as readonly DeepImprovementCommonSealedArtifactBinding[],
  };
}

function transitionInputs(
  events: readonly DeepImprovementCommonLedgerEvent[],
  bindings: readonly DeepImprovementCommonSealedArtifactBinding[],
): readonly DeepImprovementCommonTransitionReceiptInput[] {
  const reference = (kind: DeepImprovementCommonSealedArtifactBinding['artifactKind']) => {
    const match = bindings.find((binding) => binding.artifactKind === kind);
    if (!match) throw new Error(`Missing binding ${kind}`);
    return match.reference.qualified_digest;
  };
  const eventId = (stem: DeepImprovementCommonEventStem) => {
    const match = events.find((event) => event.payload.stem === stem);
    if (!match) throw new Error(`Missing event ${stem}`);
    return match.event_id;
  };
  const candidate = reference(DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT);
  const baseline = reference(DeepImprovementCommonArtifactKinds.BASELINE_INPUT);
  const evaluator = reference(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE);
  const raw = reference(DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT);
  const canary = reference(DeepImprovementCommonArtifactKinds.CANARY_EPOCH);
  const promotion = reference(DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE);
  const make = (
    transitionKind: DeepImprovementCommonTransitionReceiptInput['transitionKind'],
    stem: DeepImprovementCommonEventStem,
    inputs: readonly string[],
    outputs: readonly string[],
  ): DeepImprovementCommonTransitionReceiptInput => ({
    transitionKind,
    logicalOperationId: `logical:${transitionKind}`,
    effectIdempotencyKey: `effect:${transitionKind}`,
    attemptNumber: 1,
    resultEventId: eventId(stem),
    inputArtifactQualifiedDigests: inputs,
    outputArtifactQualifiedDigests: outputs,
    evidenceArtifactQualifiedDigests: [],
  });
  return Object.freeze([
    make(
      DeepImprovementCommonTransitionKinds.CANDIDATE_GENERATED,
      'deep_improvement_common.candidate_generated',
      [],
      [candidate, baseline],
    ),
    make(
      DeepImprovementCommonTransitionKinds.EVALUATOR_EPOCH_ESTABLISHED,
      'deep_improvement_common.evaluation_epoch_sealed',
      [candidate],
      [evaluator],
    ),
    make(
      DeepImprovementCommonTransitionKinds.EVALUATION_STARTED,
      'deep_improvement_common.evaluation_started',
      [candidate, evaluator],
      [],
    ),
    make(
      DeepImprovementCommonTransitionKinds.CANDIDATE_SCORED,
      'deep_improvement_common.evaluation_normalized',
      [candidate, baseline, evaluator],
      [raw],
    ),
    make(
      DeepImprovementCommonTransitionKinds.CANARY_CHECKED,
      'deep_improvement_common.canary_gate_passed',
      [raw, evaluator],
      [canary],
    ),
    make(
      DeepImprovementCommonTransitionKinds.PROMOTION_PROPOSED,
      'deep_improvement_common.promotion_proposed',
      [candidate, baseline, raw, canary],
      [promotion],
    ),
    make(
      DeepImprovementCommonTransitionKinds.PROMOTION_AUTHORIZED,
      'deep_improvement_common.promotion_authorized',
      [promotion],
      [],
    ),
    make(
      DeepImprovementCommonTransitionKinds.GUARDED_PROMOTION,
      'deep_improvement_common.promotion_completed',
      [promotion],
      [],
    ),
  ]);
}

async function scenario(options: ScenarioOptions = {}): Promise<Scenario> {
  const events = happyEvents(options);
  const { ledger, registry, receiptSubstrate } = await authorizedLedger(events);
  const { store, bindings } = await sealedArtifacts(events, options);
  const certificationProviders = providers();
  const initialState = createDeepImprovementCommonProjectionState() as ReplayProjection;
  const replay: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepImprovementCommonRunCertificate({
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: store,
    artifactBindings: bindings,
    transitionReceipts: transitionInputs(events, bindings),
    replay,
    certificationProfile: certificationProviders.inspect()[0]!,
    providers: certificationProviders,
    receiptSubstrate,
    serviceVersion: 'deep-improvement-common-certificates@1',
    issuer: 'deep-improvement-certificate-issuer',
    issuedAt: TIMESTAMP,
    verificationTime: VERIFICATION_TIME,
  });
  return {
    bundle,
    store,
    bindings,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: store,
      replay,
      providers: certificationProviders,
      verificationTime: VERIFICATION_TIME,
    },
  };
}

afterAll(() => {
  vi.setConfig({ testTimeout: 30_000 });
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

const modelRegistry = createModelBenchmarkEventRegistry();
const MATRIX_DIGEST = digest('matrix-1');
const WORKLOAD_DIGEST = digest('workload-profile-1');

function modelReplayMetadata(): ModelBenchmarkReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('model-replay'),
    replay_input_digests: {
      configuration: digest('model-configuration'),
      evaluator: digest('model-evaluator'),
    },
  };
}

function trialMatrixKey(): TrialMatrixKey {
  return {
    candidateId: CANDIDATE_ID,
    modelFingerprint: digest('model-1'),
    executionPath: 'provider/direct',
    taskInstanceId: 'task-1',
    taskFamilyId: 'family-1',
    pairedBlockId: 'pair-1',
    protocolVariant: 'standard',
    seed: 7,
    perturbationId: 'none',
    workloadProfileId: 'workload-1',
    promptRecipeFingerprint: digest('prompt-1'),
    routeFingerprint: digest('route-1'),
    frameworkFingerprint: digest('framework-1'),
    toolRecipeFingerprint: digest('tools-1'),
    attempt: 1,
  };
}

function taskLineage(): TaskLineage {
  return {
    sourceCutoffAt: TIMESTAMP,
    visibility: 'sealed',
    proposerVisibility: 'blind',
    oracleVisibility: 'blind',
    parentCaseId: null,
    firstExposureAt: null,
    disclosedAt: null,
    retiredAt: null,
    replacementCaseId: null,
  };
}

function modelBaseScope() {
  return {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'model-benchmark' as const,
  };
}

function modelScope<TStem extends ModelBenchmarkSpecificEventStem>(
  stem: TStem,
): ModelBenchmarkScopeMap[TStem] {
  const base = modelBaseScope();
  const key = trialMatrixKey();
  if (stem === 'model_benchmark.benchmark_capsule_sealed') {
    return { ...base, capsuleId: 'capsule-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.workload_snapshot_sealed') {
    return { ...base, workloadSnapshotId: 'workload-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.benchmark_design_declared') {
    return { ...base, designId: 'design-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.trial_block_declared') {
    return { ...base, trialBlockId: 'block-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem.startsWith('model_benchmark.trial_')
    || stem === 'model_benchmark.score_vector_observed'
    || stem === 'model_benchmark.usage_observed'
    || stem === 'model_benchmark.judge_observation_recorded') {
    return {
      ...base,
      trialId: 'trial-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
      candidateId: key.candidateId,
      modelFingerprint: key.modelFingerprint,
      executionPath: key.executionPath,
      pairedBlockId: key.pairedBlockId,
    } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.contamination_evidence_recorded') {
    return {
      ...base,
      caseId: 'case-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
    } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.judge_calibration_sealed') {
    return { ...base, judgeCalibrationId: 'calibration-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.validity_plan_sealed'
    || stem === 'model_benchmark.validity_card_derived'
    || stem === 'model_benchmark.validity_unknown_recorded') {
    return { ...base, validityPlanId: 'validity-plan-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.selection_evidence_sealed'
    || stem === 'model_benchmark.selection_reduction_requested') {
    return { ...base, evidenceSetId: 'evidence-set-1' } as ModelBenchmarkScopeMap[TStem];
  }
  return base as ModelBenchmarkScopeMap[TStem];
}

function appendModel<TStem extends ModelBenchmarkSpecificEventStem>(
  events: ModelBenchmarkLedgerEvent[],
  stem: TStem,
  data: ModelBenchmarkPayloadMap[TStem],
): ModelBenchmarkEventEnvelope<TStem> {
  const previous = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const input: ModelBenchmarkEventInput<TStem> = {
    stem,
    scope: modelScope(stem),
    data,
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: modelReplayMetadata(),
    eventId: `model-event-${String(sequence).padStart(3, '0')}`,
    streamId: 'model-benchmark-certificate-run-1',
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'model-benchmark-certificate-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `model-event-${sequence}`,
  };
  const prepared = prepareModelBenchmarkEvent(input, modelRegistry);
  events.push(prepared.envelope as ModelBenchmarkEventEnvelope<TStem>);
  return prepared.envelope as ModelBenchmarkEventEnvelope<TStem>;
}

interface ModelEventOptions {
  readonly contaminationStatus?: 'clean' | 'confirmed' | 'suspected' | 'unknown';
  readonly hardFloorStatus?: 'fail' | 'not-applicable' | 'pass' | 'unknown';
  readonly includeValidityUnknown?: boolean;
  readonly lateContaminationStatus?: 'confirmed' | 'suspected' | 'unknown';
  readonly omitRunClosed?: boolean;
  readonly terminalOutcome?: 'aborted' | 'completed' | 'quarantined';
  readonly trialOutcome?: 'completed' | 'rejected' | 'unknown';
  readonly validityState?: 'invalid' | 'unknown' | 'valid';
}

function modelEvents(options: ModelEventOptions = {}): readonly ModelBenchmarkLedgerEvent[] {
  const events: ModelBenchmarkLedgerEvent[] = [];
  const commonHash = digest('model-fixture');
  const declared = appendModel(events, 'model_benchmark.run_declared', {
    generation: 1,
    benchmarkRecipeRef: 'benchmark-recipe:1',
    benchmarkRecipeDigest: commonHash,
    evaluatorServiceRef: 'service:evaluator',
    canaryServiceRef: 'service:canary',
    promotionServiceRef: 'service:promotion',
    sharedServiceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: commonHash,
  });
  const capsule = appendModel(events, 'model_benchmark.benchmark_capsule_sealed', {
    capsuleRef: 'capsule:1',
    capsuleDigest: commonHash,
    taskSetDigest: commonHash,
    taskLineage: taskLineage(),
    canarySuiteRef: 'canary:1',
    canarySuiteDigest: commonHash,
    sealReceiptRef: 'receipt:capsule',
  });
  const workload = appendModel(events, 'model_benchmark.workload_snapshot_sealed', {
    workloadSnapshotRef: 'workload:1',
    workloadSnapshotDigest: commonHash,
    taskFamilyIds: ['family-1'],
    caseCount: 1,
    workloadProfileVersion: 'workload@1',
    snapshotAt: TIMESTAMP,
    sealReceiptRef: 'receipt:workload',
  });
  appendModel(events, 'model_benchmark.run_started', {
    declarationEventId: declared.event_id,
    declarationPayloadDigest: declared.payload.payloadDigest,
    capsuleEventId: capsule.event_id,
    capsulePayloadDigest: capsule.payload.payloadDigest,
    workloadEventId: workload.event_id,
    workloadPayloadDigest: workload.payload.payloadDigest,
    executionReceiptRef: 'receipt:start',
    startedAt: TIMESTAMP,
  });
  appendModel(events, 'model_benchmark.trial_block_declared', {
    taskFamilyId: 'family-1',
    candidateIds: [CANDIDATE_ID],
    modelFingerprints: [trialMatrixKey().modelFingerprint],
    executionPaths: [trialMatrixKey().executionPath],
    pairedBlockIds: [trialMatrixKey().pairedBlockId],
    protocolVariants: [trialMatrixKey().protocolVariant],
    seed: trialMatrixKey().seed,
    perturbationId: trialMatrixKey().perturbationId,
    workloadProfileId: trialMatrixKey().workloadProfileId,
    blockDigest: commonHash,
  });
  if (options.trialOutcome === 'rejected') {
    appendModel(events, 'model_benchmark.trial_case_rejected', {
      trialMatrixKey: trialMatrixKey(),
      caseRef: 'case:1',
      caseDigest: commonHash,
      taskLineage: taskLineage(),
      admissionPolicyVersion: 'admission@1',
      admissionReasonCode: 'ineligible',
      rejectionEvidenceRef: 'rejection:1',
      rejectionEvidenceDigest: digest('rejection'),
    });
  } else {
    appendModel(events, 'model_benchmark.trial_case_admitted', {
      trialMatrixKey: trialMatrixKey(),
      caseRef: 'case:1',
      caseDigest: commonHash,
      taskLineage: taskLineage(),
      admissionPolicyVersion: 'admission@1',
      admissionReasonCode: 'eligible',
    });
  }
  const dispatched = appendModel(events, 'model_benchmark.trial_dispatched', {
    trialMatrixKey: trialMatrixKey(),
    inputRef: 'input:1',
    inputDigest: commonHash,
    dispatchReceiptRef: 'receipt:dispatch',
    dispatchReceiptDigest: commonHash,
    dispatchedAt: TIMESTAMP,
  });
  const completed = appendModel(events, 'model_benchmark.trial_completed', {
    trialMatrixKey: trialMatrixKey(),
    dispatchedEventId: dispatched.event_id,
    dispatchedPayloadDigest: dispatched.payload.payloadDigest,
    rawResultRef: 'raw-result:1',
    rawResultDigest: digest('raw-result'),
    inputDigest: commonHash,
    outputDigest: digest('raw-output'),
    completionReceiptRef: 'receipt:complete',
    completedAt: TIMESTAMP,
  });
  if (options.trialOutcome === 'unknown') {
    appendModel(events, 'model_benchmark.trial_unknown', {
      trialMatrixKey: trialMatrixKey(),
      dispatchedEventId: dispatched.event_id,
      reasonCode: 'provider-timeout',
      lastReceiptRef: 'receipt:unknown',
      evidenceDigest: digest('unknown-effect'),
      observedAt: TIMESTAMP,
    });
  }
  const observation = appendModel(events, 'model_benchmark.trial_observation_recorded', {
    trialMatrixKey: trialMatrixKey(),
    completedEventId: completed.event_id,
    completedPayloadDigest: completed.payload.payloadDigest,
    inputDigest: commonHash,
    rawOutputRef: 'raw-output:1',
    rawOutputDigest: digest('raw-output'),
    evaluatorObservationRef: 'observation:1',
    evaluatorObservationDigest: digest('observation'),
    executionReceiptRef: 'receipt:observation',
  });
  const score = appendModel(events, 'model_benchmark.score_vector_observed', {
    trialMatrixKey: trialMatrixKey(),
    observationEventId: observation.event_id,
    observationPayloadDigest: observation.payload.payloadDigest,
    scorePolicyVersion: 'score@1',
    scoreWriteBackendRef: MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
    scoreVector: {
      components: [{
        dimensionCode: 'quality',
        rawScore: 0.95,
        hardFloorStatus: options.hardFloorStatus ?? 'pass',
        measurementStatus: 'observed',
        uncertainty: 0.05,
        observationRef: 'observation:quality',
        observationDigest: digest('quality'),
      }],
      evaluatorContractHash: digest('evaluator-contract'),
      evaluatorFingerprint: digest('evaluator'),
    },
    scoringReceiptRef: 'receipt:score',
  });
  appendModel(events, 'model_benchmark.usage_observed', {
    trialMatrixKey: trialMatrixKey(),
    observationEventId: observation.event_id,
    usage: {
      inputTokens: 10,
      outputTokens: 20,
      reasoningTokens: 5,
      cacheReadTokens: 1,
      cacheWriteTokens: 1,
      retryCount: 0,
      realizedCostMicrounits: 100,
      currencyCode: 'USD',
    },
    latency: {
      ttftMs: 10,
      interTokenP50Ms: 2,
      endToEndMs: 100,
      tailP95Ms: 150,
    },
    usageReceiptRef: 'receipt:usage',
    usageReceiptDigest: digest('usage'),
  });
  const judge = appendModel(events, 'model_benchmark.judge_observation_recorded', {
    trialMatrixKey: trialMatrixKey(),
    scoreEventId: score.event_id,
    scorePayloadDigest: score.payload.payloadDigest,
    blindedJudgeRef: 'judge:blind-1',
    judgeFamilyCode: 'quality',
    judgeBuildFingerprint: digest('judge-build'),
    promptDigest: digest('judge-prompt'),
    contextDigest: digest('judge-context'),
    toolDigest: digest('judge-tools'),
    calibrationSliceId: 'calibration-slice-1',
    orderProbeOutcome: 'pass',
    styleProbeOutcome: 'pass',
    confidence: 0.9,
    uncertainty: 0.1,
    abstained: false,
    disagreementState: 'resolved',
    observationRef: 'judge-observation:1',
    observationDigest: digest('judge-observation'),
  });
  appendModel(events, 'model_benchmark.judge_calibration_sealed', {
    blindedJudgeRef: 'judge:blind-1',
    judgeFamilyCode: 'quality',
    judgeBuildFingerprint: digest('judge-build'),
    calibrationSliceId: 'calibration-slice-1',
    calibrationRef: 'calibration:1',
    calibrationDigest: digest('calibration'),
    orderProbeDigest: digest('order-probe'),
    styleProbeDigest: digest('style-probe'),
    calibrationPolicyVersion: 'calibration@1',
    sealReceiptRef: 'receipt:calibration',
  });
  const contamination = appendModel(events, 'model_benchmark.contamination_evidence_recorded', {
    contaminationStatus: options.contaminationStatus ?? 'clean',
    detectorFingerprint: digest('contamination-detector'),
    evidenceRef: 'contamination-evidence:1',
    evidenceDigest: digest('contamination-evidence'),
    exposureEventIds: [],
    reasonCode: 'checked',
  });
  appendModel(events, 'model_benchmark.benchmark_design_declared', {
    designRef: 'design:1',
    designDigest: MATRIX_DIGEST,
    candidateIds: [CANDIDATE_ID],
    taskFamilyIds: ['family-1'],
    pairedBlockIds: ['pair-1'],
    protocolVariants: ['standard'],
    familyQuotaPolicyVersion: 'quota@1',
    designPolicyVersion: 'design@1',
  });
  appendModel(events, 'model_benchmark.validity_plan_sealed', {
    validityPlanRef: 'validity-plan:1',
    validityPlanDigest: digest('validity-plan'),
    requiredEvidenceCodes: ['score', 'judge', 'contamination'],
    hardBlockerCodes: ['hard-floor', 'contamination'],
    validityPolicyVersion: 'validity@1',
    sealReceiptRef: 'receipt:validity-plan',
  });
  if (options.includeValidityUnknown) {
    appendModel(events, 'model_benchmark.validity_unknown_recorded', {
      unknownCode: 'evidence-pending',
      requiredEvidenceRefs: ['evidence:pending'],
      evidenceSetDigest: digest('pending-evidence'),
      blocker: true,
      recordedAt: TIMESTAMP,
    });
  }
  const validity = appendModel(events, 'model_benchmark.validity_card_derived', {
    state: options.validityState ?? 'valid',
    evidenceEventIds: [score.event_id, judge.event_id, contamination.event_id],
    evidenceSetDigest: digest('validity-evidence'),
    blockerCodes: options.validityState === 'invalid' ? ['invalid-calibration'] : [],
    uncertainty: 0.05,
    derivationPolicyVersion: 'validity@1',
    derivationReceiptRef: 'receipt:validity',
  });
  const selection = appendModel(events, 'model_benchmark.selection_evidence_sealed', {
    evidenceEventIds: [score.event_id, judge.event_id, contamination.event_id],
    evidenceSetDigest: digest('selection-evidence'),
    manifestRef: 'manifest:selection',
    manifestDigest: digest('selection-manifest'),
    validityCardEventIds: [validity.event_id],
    sealedAt: TIMESTAMP,
    sealReceiptRef: 'receipt:selection',
  });
  appendModel(events, 'model_benchmark.selection_reduction_requested', {
    sealedEvidenceEventId: selection.event_id,
    sealedEvidencePayloadDigest: selection.payload.payloadDigest,
    reducerContractVersion: 'model-benchmark-reducer@1',
    requestReceiptRef: 'receipt:reduction',
    requestedAt: TIMESTAMP,
  });
  if (options.lateContaminationStatus) {
    appendModel(events, 'model_benchmark.contamination_evidence_recorded', {
      contaminationStatus: options.lateContaminationStatus,
      detectorFingerprint: digest('late-contamination-detector'),
      evidenceRef: 'contamination-evidence:late',
      evidenceDigest: digest('late-contamination-evidence'),
      exposureEventIds: [],
      reasonCode: 'late-evidence',
    });
  }
  if (!options.omitRunClosed) {
    const prior = events.at(-1) as ModelBenchmarkLedgerEvent;
    appendModel(events, 'model_benchmark.run_closed', {
      terminalOutcome: options.terminalOutcome ?? 'completed',
      finalLedgerTailHash: digest(prior),
      counts: {
        admittedTrials: options.trialOutcome === 'rejected' ? 0 : 1,
        completedTrials: 1,
        failedTrials: 0,
        unknownTrials: options.trialOutcome === 'unknown' ? 1 : 0,
        invalidatedTrials: 0,
      },
      completionEvidenceRefs: ['evidence:completion'],
      closedAt: TIMESTAMP,
    });
  }
  return Object.freeze(events);
}

async function authorizedModelLedger(events: readonly ModelBenchmarkLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(
    modelBenchmarkEventDefinitions(),
  );
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('model-ledger');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareModelBenchmarkEvent({
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
      `model-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new Error(`Expected model fixture authorization at ${index}`);
    }
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
    now: fixedNow,
  });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'model-benchmark-certificate-writer',
    correlationId: 'model-benchmark-certificate-writer',
    ttlMs: 3_600_000,
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
    authorizationContext: (event) => ({
      mode: 'improvement',
      priorStateVersion: 'model-benchmark-certificate-state@1',
      priorStateFingerprint: digest('model-benchmark-certificate-state'),
      actorId: 'model-benchmark-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: ModelBenchmarkTransitionReceiptSubstrate = {
    writer,
    registry,
    producer: { name: 'model-benchmark-certificate-tests', version: '1' },
  };
  return { ledger, registry, receiptSubstrate };
}

function modelReplayComponentRegistry(): ReplayComponentRegistry<ModelReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ModelReplayProjection>(
    Object.values(ModelBenchmarkWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
      reduce: (state: Readonly<ModelReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceModelBenchmarkVerifiedEvent(
          verified,
          state,
        ).state as ModelReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: MODEL_BENCHMARK_REDUCER_ID,
    reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
    projectionSchemaVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function modelOrigin(
  events: readonly ModelBenchmarkLedgerEvent[],
  stem: ModelBenchmarkEventStem,
) {
  const event = events.find((candidate) => candidate.payload.stem === stem);
  if (!event) throw new Error(`Missing model origin ${stem}`);
  return {
    eventStem: stem,
    eventId: event.event_id,
    payloadDigest: event.payload.payloadDigest,
  };
}

function modelArtifactBase(
  events: readonly ModelBenchmarkLedgerEvent[],
  artifactId: string,
  originStem: ModelBenchmarkEventStem,
  dependencies: readonly ModelBenchmarkArtifactDependency[] = [],
) {
  return {
    schemaVersion: 'model-benchmark-artifact@1',
    artifactId,
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    visibility: 'sealed' as const,
    dependencyReferences: dependencies,
    originEvent: modelOrigin(events, originStem),
    producerVersion: 'model-benchmark-certificate-producer@1',
    locator: locator(`model:${artifactId}`),
    freshnessExpiresAt: '2026-07-23T10:00:00.000Z',
  };
}

function modelUsage() {
  return {
    inputTokens: 10,
    outputTokens: 20,
    reasoningTokens: 5,
    cacheReadTokens: 1,
    cacheWriteTokens: 1,
    realizedCostMicros: 100,
    errorCostMicros: 0,
    abstentionCostMicros: 0,
  };
}

function modelLatency() {
  return {
    ttftMs: 10,
    interTokenP50Ms: 2,
    endToEndMs: 100,
    tailP95Ms: 150,
    throughputTokensPerSecond: 20,
    sloViolationCount: 0,
  };
}

interface ModelArtifacts {
  readonly bindings: readonly ModelBenchmarkSealedArtifactBinding[];
  readonly materials: ReadonlyMap<ModelBenchmarkArtifactKind, ModelBenchmarkArtifactMaterial>;
}

async function sealModelArtifacts(
  events: readonly ModelBenchmarkLedgerEvent[],
  store: ReturnType<typeof createModelBenchmarkSealedArtifactStore>,
): Promise<ModelArtifacts> {
  const fixtureBindings = await Promise.all(
    Array.from({ length: 10 }, (_, index) => (
      store.seal(InitialArtifactKinds.FIXTURE, { fixture: `model-${index + 1}` })
    )),
  );
  const fixture = (index: number): SealedArtifactReference => {
    const reference = fixtureBindings[index]?.artifact.reference;
    if (!reference) throw new Error(`Missing model fixture ${index}`);
    return reference;
  };
  const materials = new Map<ModelBenchmarkArtifactKind, ModelBenchmarkArtifactMaterial>();
  const bindings: ModelBenchmarkSealedArtifactBinding[] = [];
  const seal = async (
    kind: ModelBenchmarkArtifactKind,
    material: ModelBenchmarkArtifactMaterial,
  ) => {
    const binding = await sealModelBenchmarkArtifact(store, kind, material);
    materials.set(kind, material);
    bindings.push(binding);
    return binding;
  };
  const visibilityPolicy = {
    candidateView: 'verdict-band' as const,
    hiddenCaseContent: 'withheld' as const,
    exactScores: 'withheld' as const,
    protectedJudgeEvidence: 'withheld' as const,
    evaluatorInternals: 'withheld' as const,
    terminalEvidence: 'withheld' as const,
  };
  const recipeMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'recipe-1', 'model_benchmark.run_declared', [
      dependency('fixture-manifest', fixture(0)),
    ]),
    profileId: 'design-1',
    profileVersion: 'profile@1',
    mode: 'model-benchmark',
    modelDescriptorsDigest: digest('models'),
    executorDescriptorsDigest: digest('executors'),
    frameworkDigest: digest('framework'),
    promptReferenceDigest: digest('prompt-reference'),
    fixtureManifestDigest: digest('fixtures'),
    taskFamilyManifestDigest: digest('task-families'),
    samplePolicyDigest: digest('sample-policy'),
    seedPolicyDigest: digest('seed-policy'),
    matrixOrderingDigest: digest('matrix-order'),
    scoringConfigurationDigest: digest('scoring-config'),
    correctnessGateDigest: digest('correctness-gate'),
    reportingGroupCode: 'reporting-default',
    workloadProfileDigest: WORKLOAD_DIGEST,
    visibilityPolicy,
    modelExecutionCrossing: 'independent',
  };
  const recipe = await seal(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, recipeMaterial);
  const cellMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'cell-1', 'model_benchmark.trial_dispatched', [
      dependency('fixture', fixture(1)),
    ]),
    runId: RUN_ID,
    cellId: 'cell-1',
    matrixMembership: {
      matrixDigest: MATRIX_DIGEST,
      modelId: 'model-1',
      executorId: 'executor-1',
      taskFamilyId: 'family-1',
      taskInstanceId: 'task-1',
      anchorClass: 'common-anchor',
      pairedBlockId: 'pair-1',
      trialMatrixKey: trialMatrixKey(),
    },
    modelDescriptorDigest: digest('model-1'),
    executorDescriptorDigest: digest('executor-1'),
    providerIdentityDigest: digest('provider'),
    buildVariantDigest: digest('build'),
    resolvedCapabilityDigest: digest('capability'),
    permissionFingerprintDigest: digest('permission'),
    workflowPrefixDigest: digest('workflow'),
    environmentSnapshotDigest: digest('environment'),
    frameworkTemplateDigest: digest('framework-template'),
    fixtureDigest: digest('fixture'),
    sampleId: 'sample-1',
    seed: 7,
    promptVisibilityPolicy: 'sealed',
    workloadProfileDigest: WORKLOAD_DIGEST,
    prerequisiteReferences: [fixture(1)],
  };
  const cell = await seal(ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, cellMaterial);
  const runMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'run-manifest-1', 'model_benchmark.run_started', [
      dependency('recipe', recipe.reference),
      dependency('cell', cell.reference),
    ]),
    runId: RUN_ID,
    recipeReference: recipe.reference,
    recipeDigest: recipe.reference.content_digest,
    modelSetDigest: digest('model-set'),
    executorSetDigest: digest('executor-set'),
    frameworkDigest: digest('framework'),
    fixtureManifestDigest: digest('fixtures'),
    samplePolicyDigest: digest('sample-policy'),
    seedPolicyDigest: digest('seed-policy'),
    matrixOrderingDigest: digest('matrix-order'),
    scoringPolicyDigest: digest('scoring-policy'),
    workloadProfileDigest: WORKLOAD_DIGEST,
    matrixMembershipDigest: MATRIX_DIGEST,
    cellReferences: [cell.reference],
    reportingGroupCode: 'reporting-default',
    completeness: 'complete',
  };
  const run = await seal(ModelBenchmarkArtifactKinds.RUN_MANIFEST, runMaterial);
  const rawMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(
      events,
      'raw-output-1',
      'model_benchmark.trial_observation_recorded',
      [
        dependency('input', cell.reference),
        dependency('response', fixture(2)),
        dependency('trajectory', fixture(3)),
        dependency('tool-trace', fixture(4)),
        dependency('item-observation', fixture(5)),
      ],
    ),
    runId: RUN_ID,
    cellId: 'cell-1',
    matrixDigest: MATRIX_DIGEST,
    inputReference: cell.reference,
    responseDigest: fixture(2).content_digest,
    responseReference: fixture(2),
    trajectoryDigest: fixture(3).content_digest,
    trajectoryReference: fixture(3),
    toolTraceDigest: fixture(4).content_digest,
    toolTraceReference: fixture(4),
    itemObservationReferences: [fixture(5)],
    scoreVectorDigest: digest('score-vector'),
    judgeObservationDigest: digest('judge-observation'),
    usageStatus: 'complete',
    usage: modelUsage(),
    latency: modelLatency(),
    errorCode: null,
    abstained: false,
    retryCount: 0,
    integrityStatus: 'confirmed',
    workloadProfileDigest: WORKLOAD_DIGEST,
  };
  const raw = await seal(ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, rawMaterial);
  const scoringMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'scoring-matrix-1', 'model_benchmark.score_vector_observed', [
      dependency('run', run.reference),
      dependency('raw', raw.reference),
    ]),
    runReference: run.reference,
    matrixDigest: MATRIX_DIGEST,
    rawObservationReferences: [raw.reference],
    itemRowsDigest: digest('item-rows'),
    familyRowsDigest: digest('family-rows'),
    modelExecutorCrossingsDigest: digest('crossings'),
    anchorMembershipDigest: digest('anchor-membership'),
    adaptiveDiagnosticMembershipDigest: digest('diagnostic-membership'),
    rubricAxisObservationsDigest: digest('rubric-observations'),
    judgeCalibrationDigest: digest('judge-calibration'),
    pairedDeltasDigest: digest('paired-deltas'),
    uncertaintyDigest: digest('uncertainty'),
    multiplicityTreatmentDigest: digest('multiplicity'),
    selectionState: 'WINNER',
    winnerModelId: 'model-1',
  };
  const scoring = await seal(ModelBenchmarkArtifactKinds.SCORING_MATRIX, scoringMaterial);
  const anchorMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'anchor-1', 'model_benchmark.benchmark_design_declared', [
      dependency('run', run.reference),
      dependency('anchor-case', fixture(6)),
    ]),
    runReference: run.reference,
    matrixDigest: MATRIX_DIGEST,
    commonAnchorReferences: [fixture(6)],
    taskFamilyIds: ['family-1'],
    familyCoverageDigest: digest('family-coverage'),
    selectionPolicyDigest: digest('anchor-selection-policy'),
    confirmatoryStatus: 'confirmatory',
    exclusionReasonCodes: [],
  };
  const anchor = await seal(
    ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    anchorMaterial,
  );
  const diagnosticMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'diagnostic-1', 'model_benchmark.benchmark_design_declared', [
      dependency('run', run.reference),
      dependency('diagnostic-case', fixture(7)),
    ]),
    runReference: run.reference,
    matrixDigest: MATRIX_DIGEST,
    selectedCaseReferences: [fixture(7)],
    familyQuotaDigest: digest('family-quota'),
    informationInputsDigest: digest('information-inputs'),
    selectionPolicyDigest: digest('diagnostic-policy'),
    propensityDigest: digest('propensity'),
    confirmatoryStatus: 'non-confirmatory',
    exclusionReasonCodes: [],
  };
  const diagnostic = await seal(
    ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
    diagnosticMaterial,
  );
  const validityMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'validity-1', 'model_benchmark.judge_calibration_sealed', [
      dependency('judge-calibration', fixture(8)),
    ]),
    matrixDigest: MATRIX_DIGEST,
    candidateId: CANDIDATE_ID,
    taskFamilyId: 'family-1',
    judgeCalibrationReference: fixture(8),
    judgeCalibrationDigest: fixture(8).content_digest,
    rubricAxisValidationDigest: digest('rubric-axis-validation'),
    oracleUncertainty: 0.05,
    protocolRobustnessDigest: digest('protocol-robustness'),
    validityPolicyDigest: digest('validity-policy'),
    validityState: 'valid',
    blockerCodes: [],
  };
  const validity = await seal(ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, validityMaterial);
  const contaminationMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(
      events,
      'contamination-1',
      'model_benchmark.contamination_evidence_recorded',
      [dependency('contamination-evidence', fixture(9))],
    ),
    caseId: 'case-1',
    sourceDate: '2025-01-01T00:00:00.000Z',
    firstExposureAt: null,
    disclosureAt: null,
    retiredAt: null,
    caseVisibility: 'sealed',
    contaminationStatus: 'clean',
    matchedEvidenceDigest: digest('matched-evidence'),
    semanticEvidenceDigest: digest('semantic-evidence'),
    disclosureEvidenceDigest: digest('disclosure-evidence'),
    replacementCaseReference: null,
    referenceModelDifficultyDigest: digest('reference-model-difficulty'),
    evidenceReferences: [fixture(9)],
  };
  const contamination = await seal(
    ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
    contaminationMaterial,
  );
  const workloadMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(events, 'workload-1', 'model_benchmark.workload_snapshot_sealed', [
      dependency('run', run.reference),
    ]),
    runReference: run.reference,
    workloadProfileDigest: WORKLOAD_DIGEST,
    contextLength: 100,
    concurrency: 2,
    trafficShapeDigest: digest('traffic-shape'),
    outputLength: 20,
    prefixReuseRatio: 0.25,
    multiTurnCount: 1,
    latency: modelLatency(),
    usageStatus: 'complete',
    usage: modelUsage(),
    switchingOverheadMicros: 4,
  };
  const workload = await seal(ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE, workloadMaterial);
  const selectionMaterial: ModelBenchmarkArtifactMaterial = {
    ...modelArtifactBase(
      events,
      'selection-1',
      'model_benchmark.selection_evidence_sealed',
      [
        dependency('matrix', scoring.reference),
        dependency('validity', validity.reference),
        dependency('workload', workload.reference),
        dependency('anchor', anchor.reference),
        dependency('diagnostic', diagnostic.reference),
      ],
    ),
    matrixReference: scoring.reference,
    matrixDigest: MATRIX_DIGEST,
    validityEvidenceReferences: [validity.reference],
    workloadEvidenceReferences: [workload.reference],
    anchorEvidenceReference: anchor.reference,
    diagnosticEvidenceReference: diagnostic.reference,
    reductionPolicyDigest: digest('reduction-policy'),
    evidenceCompleteness: 'complete',
    qualityGateStatus: 'pass',
    operationalGateStatus: 'pass',
    selectionState: 'WINNER',
  };
  await seal(ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE, selectionMaterial);
  return {
    bindings: Object.freeze(bindings),
    materials,
  };
}

function modelTransitionInputs(
  events: readonly ModelBenchmarkLedgerEvent[],
  bindings: readonly ModelBenchmarkSealedArtifactBinding[],
): readonly ModelBenchmarkTransitionReceiptInput[] {
  const reference = (kind: ModelBenchmarkArtifactKind) => {
    const match = bindings.find((binding) => binding.artifactKind === kind);
    if (!match) throw new Error(`Missing model binding ${kind}`);
    return match.reference.qualified_digest;
  };
  const eventId = (stem: ModelBenchmarkEventStem) => {
    const match = events.find((event) => event.payload.stem === stem);
    if (!match) throw new Error(`Missing model event ${stem}`);
    return match.event_id;
  };
  const recipe = reference(ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE);
  const run = reference(ModelBenchmarkArtifactKinds.RUN_MANIFEST);
  const cell = reference(ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT);
  const raw = reference(ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT);
  const matrix = reference(ModelBenchmarkArtifactKinds.SCORING_MATRIX);
  const anchor = reference(ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION);
  const diagnostic = reference(
    ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  );
  const validity = reference(ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE);
  const contamination = reference(ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE);
  const workload = reference(ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE);
  const selection = reference(ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE);
  const make = (
    transitionKind: ModelBenchmarkTransitionReceiptInput['transitionKind'],
    stem: ModelBenchmarkEventStem,
    inputs: readonly string[],
    outputs: readonly string[],
    evidence: readonly string[],
  ): ModelBenchmarkTransitionReceiptInput => ({
    transitionKind,
    logicalOperationId: `logical:${transitionKind}`,
    effectIdempotencyKey: `effect:${transitionKind}`,
    attemptNumber: 1,
    resultEventId: eventId(stem),
    inputArtifactQualifiedDigests: inputs,
    outputArtifactQualifiedDigests: outputs,
    evidenceArtifactQualifiedDigests: evidence,
  });
  return Object.freeze([
    make(
      ModelBenchmarkTransitionKinds.BENCHMARK_STARTED,
      'model_benchmark.run_started',
      [recipe, anchor, workload],
      [run],
      [],
    ),
    make(
      ModelBenchmarkTransitionKinds.MODEL_CELL_STARTED,
      'model_benchmark.trial_dispatched',
      [run],
      [cell],
      [recipe, anchor, workload],
    ),
    make(
      ModelBenchmarkTransitionKinds.MODEL_CELL_COMPLETED,
      'model_benchmark.trial_observation_recorded',
      [cell],
      [raw],
      [],
    ),
    make(
      ModelBenchmarkTransitionKinds.SCORE_MATRIX_REDUCED,
      'model_benchmark.score_vector_observed',
      [raw],
      [matrix],
      [anchor, workload],
    ),
    make(
      ModelBenchmarkTransitionKinds.JUDGE_CALIBRATED,
      'model_benchmark.judge_calibration_sealed',
      [matrix],
      [validity],
      [],
    ),
    make(
      ModelBenchmarkTransitionKinds.CONTAMINATION_CHECKED,
      'model_benchmark.contamination_evidence_recorded',
      [raw],
      [contamination],
      [],
    ),
    make(
      ModelBenchmarkTransitionKinds.DIAGNOSTIC_TAIL_ALLOCATED,
      'model_benchmark.benchmark_design_declared',
      [matrix],
      [diagnostic],
      [anchor],
    ),
    make(
      ModelBenchmarkTransitionKinds.SELECTION_PROPOSED,
      'model_benchmark.selection_evidence_sealed',
      [matrix, validity, contamination, diagnostic],
      [selection],
      [anchor, workload],
    ),
  ]);
}

interface ModelScenario {
  readonly artifacts: ModelArtifacts;
  readonly bundle: ModelBenchmarkCertificateBundle;
  readonly common: Scenario;
  readonly events: readonly ModelBenchmarkLedgerEvent[];
  readonly verification: ModelBenchmarkOfflineVerificationInput<ModelReplayProjection>;
}

let validModelFixture: Promise<ModelScenario> | null = null;

function validModelScenario(): Promise<ModelScenario> {
  validModelFixture ??= modelScenario();
  return validModelFixture;
}

async function modelScenario(
  options: ModelEventOptions = {},
  existingCommon?: Scenario,
): Promise<ModelScenario> {
  const common = existingCommon ?? await scenario();
  const events = modelEvents(options);
  const { ledger, registry, receiptSubstrate } = await authorizedModelLedger(events);
  const artifacts = await sealModelArtifacts(events, common.store);
  const certificationProviders = common.verification.providers;
  const initialState = createModelBenchmarkProjectionState() as ModelReplayProjection;
  const replay: ModelBenchmarkOfflineVerificationInput<ModelReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: modelReplayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: MODEL_BENCHMARK_REDUCER_ID,
      reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
      projectionSchemaVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ModelReplayProjection>,
  };
  const bundle = await issueModelBenchmarkRunCertificate({
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: common.store,
    artifactBindings: artifacts.bindings,
    transitionReceipts: modelTransitionInputs(events, artifacts.bindings),
    replay,
    commonVerification: common.verification,
    certificationProfile: certificationProviders.inspect()[0]!,
    providers: certificationProviders,
    receiptSubstrate,
    issuer: 'model-benchmark-certificate-issuer',
    issuedAt: TIMESTAMP,
    verificationTime: VERIFICATION_TIME,
  });
  return {
    artifacts,
    bundle,
    common,
    events,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: common.store,
      replay,
      commonVerification: common.verification,
      providers: certificationProviders,
      verificationTime: VERIFICATION_TIME,
    },
  };
}

function verificationWithBundle(
  fixture: ModelScenario,
  bundle: ModelBenchmarkCertificateBundle,
  overrides: Partial<ModelBenchmarkOfflineVerificationInput<ModelReplayProjection>> = {},
): ModelBenchmarkOfflineVerificationInput<ModelReplayProjection> {
  return {
    ...fixture.verification,
    ...overrides,
    bundle,
  };
}

function bundleWithArtifactBinding(
  fixture: ModelScenario,
  artifactKind: ModelBenchmarkArtifactKind,
  binding: ModelBenchmarkSealedArtifactBinding,
): ModelBenchmarkCertificateBundle {
  const artifactClaims = fixture.bundle.certificate.body.artifactClaims.map((claim) => (
    claim.expectedArtifactKind === artifactKind
      ? {
        ...claim,
        binding,
        descriptorDigest: binding.reference.descriptor_digest,
        contentDigest: binding.reference.content_digest,
        canonicalizationVersion: binding.reference.canonicalization_version,
      }
      : claim
  ));
  return {
    ...fixture.bundle,
    certificate: {
      ...fixture.bundle.certificate,
      body: {
        ...fixture.bundle.certificate.body,
        artifactClaims,
      },
    },
  };
}

type OwnedReferenceField =
  | 'anchor.runReference'
  | 'diagnostic.runReference'
  | 'raw.inputReference'
  | 'run.cellReferences'
  | 'run.recipeReference'
  | 'scoring.rawObservationReferences'
  | 'scoring.runReference'
  | 'selection.anchorEvidenceReference'
  | 'selection.diagnosticEvidenceReference'
  | 'selection.matrixReference'
  | 'selection.validityEvidenceReferences'
  | 'selection.workloadEvidenceReferences'
  | 'workload.runReference';

interface OwnedReferenceCase {
  readonly field: OwnedReferenceField;
  readonly ownerKind: ModelBenchmarkArtifactKind;
  readonly expectedKind: ModelBenchmarkArtifactKind;
}

const ownedReferenceCases: readonly OwnedReferenceCase[] = Object.freeze([
  {
    field: 'run.recipeReference',
    ownerKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
    expectedKind: ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
  },
  {
    field: 'run.cellReferences',
    ownerKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
    expectedKind: ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
  },
  {
    field: 'raw.inputReference',
    ownerKind: ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
    expectedKind: ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
  },
  {
    field: 'scoring.runReference',
    ownerKind: ModelBenchmarkArtifactKinds.SCORING_MATRIX,
    expectedKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  },
  {
    field: 'scoring.rawObservationReferences',
    ownerKind: ModelBenchmarkArtifactKinds.SCORING_MATRIX,
    expectedKind: ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
  },
  {
    field: 'anchor.runReference',
    ownerKind: ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
    expectedKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  },
  {
    field: 'diagnostic.runReference',
    ownerKind: ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
    expectedKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  },
  {
    field: 'workload.runReference',
    ownerKind: ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  },
  {
    field: 'selection.matrixReference',
    ownerKind: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.SCORING_MATRIX,
  },
  {
    field: 'selection.validityEvidenceReferences',
    ownerKind: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
  },
  {
    field: 'selection.workloadEvidenceReferences',
    ownerKind: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  },
  {
    field: 'selection.anchorEvidenceReference',
    ownerKind: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
  },
  {
    field: 'selection.diagnosticEvidenceReference',
    ownerKind: ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
    expectedKind: ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  },
]);

function materialWithOwnedReference(
  material: ModelBenchmarkArtifactMaterial,
  field: OwnedReferenceField,
  reference: SealedArtifactReference,
  suffix: string,
): ModelBenchmarkArtifactMaterial {
  const base = {
    ...material,
    artifactId: `${material.artifactId}-${suffix}`,
  };
  switch (field) {
    case 'run.recipeReference':
      return { ...base, recipeReference: reference } as ModelBenchmarkArtifactMaterial;
    case 'run.cellReferences':
      return { ...base, cellReferences: [reference] } as ModelBenchmarkArtifactMaterial;
    case 'raw.inputReference':
      return { ...base, inputReference: reference } as ModelBenchmarkArtifactMaterial;
    case 'scoring.runReference':
    case 'anchor.runReference':
    case 'diagnostic.runReference':
    case 'workload.runReference':
      return { ...base, runReference: reference } as ModelBenchmarkArtifactMaterial;
    case 'scoring.rawObservationReferences':
      return {
        ...base,
        rawObservationReferences: [reference],
      } as ModelBenchmarkArtifactMaterial;
    case 'selection.matrixReference':
      return { ...base, matrixReference: reference } as ModelBenchmarkArtifactMaterial;
    case 'selection.validityEvidenceReferences':
      return {
        ...base,
        validityEvidenceReferences: [reference],
      } as ModelBenchmarkArtifactMaterial;
    case 'selection.workloadEvidenceReferences':
      return {
        ...base,
        workloadEvidenceReferences: [reference],
      } as ModelBenchmarkArtifactMaterial;
    case 'selection.anchorEvidenceReference':
      return {
        ...base,
        anchorEvidenceReference: reference,
      } as ModelBenchmarkArtifactMaterial;
    case 'selection.diagnosticEvidenceReference':
      return {
        ...base,
        diagnosticEvidenceReference: reference,
      } as ModelBenchmarkArtifactMaterial;
  }
}

async function verifyOwnedReferenceTamper(
  fixture: ModelScenario,
  testCase: OwnedReferenceCase,
  tamper: 'missing' | 'wrong-kind',
) {
  const ownerMaterial = fixture.artifacts.materials.get(testCase.ownerKind);
  if (!ownerMaterial) throw new Error(`Missing owner material ${testCase.ownerKind}`);
  let reference: SealedArtifactReference;
  if (tamper === 'wrong-kind') {
    const wrong = fixture.artifacts.bindings.find(
      (binding) => binding.artifactKind !== testCase.expectedKind,
    );
    if (!wrong) throw new Error(`Missing wrong-kind binding for ${testCase.field}`);
    reference = wrong.reference;
  } else {
    const expectedMaterial = fixture.artifacts.materials.get(testCase.expectedKind);
    if (!expectedMaterial) throw new Error(`Missing expected material ${testCase.expectedKind}`);
    reference = fixture.common.store.derive(testCase.expectedKind, {
      ...expectedMaterial,
      artifactId: `${expectedMaterial.artifactId}-never-sealed-${testCase.field}`,
    }, {
      canonicalizationVersion: fixture.artifacts.bindings.find(
        (binding) => binding.artifactKind === testCase.expectedKind,
      )?.reference.canonicalization_version,
    }).reference;
  }
  const alteredMaterial = materialWithOwnedReference(
    ownerMaterial,
    testCase.field,
    reference,
    `${tamper}-${testCase.field}`,
  );
  const alteredBinding = await sealModelBenchmarkArtifact(
    fixture.common.store,
    testCase.ownerKind,
    alteredMaterial,
  );
  const bundle = bundleWithArtifactBinding(
    fixture,
    testCase.ownerKind,
    alteredBinding,
  );
  return verifyModelBenchmarkCertificateOffline(
    verificationWithBundle(fixture, bundle),
  );
}

interface EffectHarness {
  readonly effectLedger: AppendOnlyLedger;
  readonly effectWriter: AuthorizedEvidenceWriter;
  readonly effectRegistry: ReturnType<typeof createEvidenceControlEventRegistry>;
}

interface SeededEffect {
  readonly intent: EffectIntentPayload;
  readonly intentEvent: VerifiedLedgerEvent;
  readonly streamId: string;
}

const RESUME_REQUEST_TIME = '2026-07-23T09:31:00.000Z';
const MODE_COMPONENTS = Object.freeze([
  'manifest',
  'recipe',
  'prompt',
  'workload',
  'matrix',
  'evaluator',
  'judge',
  'contamination',
  'validity',
  'projection-schema',
  'reducer',
  'scoring-policy',
  'adapter',
  'codec',
] as const satisfies readonly ModelBenchmarkResumeCompatibilityComponent[]);

function commonResumeFacts(): readonly ModelBenchmarkResumeComponentFact[] {
  return Object.freeze([
    Object.freeze({
      component: 'tool' as const,
      version: 'candidate-producer@1',
      digest: digest('tools'),
    }),
    Object.freeze({
      component: 'model' as const,
      version: 'candidate-producer@1',
      digest: digest('model'),
    }),
    Object.freeze({
      component: 'policy' as const,
      version: 'evaluator-producer@1',
      digest: digest('policy'),
    }),
    Object.freeze({
      component: 'target' as const,
      version: 'bounded-rewrite@1',
      digest: digest('target'),
    }),
    Object.freeze({
      component: 'schema' as const,
      version: 'deep-improvement-common-artifact@1',
      digest: digest('evaluator-schema'),
    }),
  ]);
}

function placeholderResumeFacts(): readonly ModelBenchmarkResumeComponentFact[] {
  return Object.freeze([
    ...commonResumeFacts(),
    ...MODE_COMPONENTS.map((component) => Object.freeze({
      component,
      version: 'placeholder@1',
      digest: digest('placeholder:' + component),
    })),
  ]);
}

function migrationRegistry(
  entries: ModelBenchmarkMigrationRegistry['entries'] = Object.freeze([]),
): ModelBenchmarkMigrationRegistry {
  const body = Object.freeze({
    registryVersion: 1 as const,
    entries: Object.freeze([...entries]),
  });
  return Object.freeze({
    ...body,
    registryDigest: modelBenchmarkMigrationRegistryDigest(body),
  });
}

function effectHarness(label: string): EffectHarness {
  const rootDirectory = temporaryRoot('resume-effects-' + label);
  const effectRegistry = createEvidenceControlEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'resume-effect-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['resume-effect-write'],
    evaluate: () => ({
      verdict: 'allow',
      reasonCode: 'allowed',
      matchedRuleIds: ['resume-effect-write'],
    }),
  }]);
  const effectLedger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'resume-effects-' + label,
    auditLedgerId: 'resume-effects-' + label + '-authorization',
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, effectRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'resume-effects-' + label + '-authorization',
    authorityProvider: () => FIXTURE_AUTHORITY,
    now: fixedNow,
  }, effectLedger, policies);
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    now: fixedNow,
  });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: effectLedger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'resume-effect-writer-' + label,
    correlationId: 'resume-effect-correlation-' + label,
    ttlMs: 3_600_000,
    acquireTimeoutMs: 5_000,
  });
  const effectWriter = new AuthorizedEvidenceWriter({
    ledger: effectLedger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => lease,
    },
    gateway,
    policies,
    registry: effectRegistry,
    authorizationContext: (event) => ({
      mode: 'model-benchmark',
      priorStateVersion: 'resume-effect-state@1',
      priorStateFingerprint: digest('resume-effect-state'),
      actorId: 'resume-effect-writer',
      capabilityId: 'resume-effect-write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'resume-effect-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  return Object.freeze({ effectLedger, effectWriter, effectRegistry });
}

function resumeAdapter(
  fixture: ModelScenario,
  effects: EffectHarness,
  trustedRegistryDigests: readonly string[],
): ModelBenchmarkResumeAdapter {
  const { bundle: ignored, ...verification } = fixture.verification;
  void ignored;
  return new ModelBenchmarkResumeAdapter({
    verification,
    effectLedger: effects.effectLedger,
    trustedMigrationRegistryDigests: trustedRegistryDigests,
  });
}

function resumeRequest(
  fixture: ModelScenario,
  currentInputs: readonly ModelBenchmarkResumeComponentFact[],
  registry: ModelBenchmarkMigrationRegistry,
  checkpoint: ModelBenchmarkProjectionCheckpoint | null = null,
): ModelBenchmarkResumeRequest {
  const body = fixture.bundle.certificate.body;
  return Object.freeze({
    runId: RUN_ID,
    idempotencyKey: 'model-benchmark-resume:' + digest({
      inputs: currentInputs,
      registry: registry.registryDigest,
      checkpoint,
    }),
    requestedAt: RESUME_REQUEST_TIME,
    resumeReason: 'recover the offline-verified Model Benchmark run',
    currentInputs,
    migrationRegistry: registry,
    lease: {
      runId: RUN_ID,
      leaseId: 'model-benchmark-resume-lease',
      lineageId: body.lineageId,
      generation: body.generation,
      deadlineAt: '2026-07-23T10:31:00.000Z',
      remainingMs: 3_600_000,
      certificateDigest: fixture.bundle.certificate.certificateDigest,
      replayFingerprint: body.replayFingerprint,
    },
    checkpoint,
    priorRunBundle: fixture.bundle,
  });
}

async function persistedResumeFacts(
  fixture: ModelScenario,
  effects: EffectHarness,
): Promise<readonly ModelBenchmarkResumeComponentFact[]> {
  const registry = migrationRegistry();
  const result = await resumeAdapter(
    fixture,
    effects,
    [registry.registryDigest],
  ).resume(resumeRequest(fixture, placeholderResumeFacts(), registry));
  const facts = result.decision.persistedFingerprint?.componentFacts;
  if (facts === undefined) {
    throw new Error('The real adapter did not derive persisted component facts');
  }
  return facts;
}

function changedFact(
  facts: readonly ModelBenchmarkResumeComponentFact[],
  component: ModelBenchmarkResumeCompatibilityComponent,
): readonly ModelBenchmarkResumeComponentFact[] {
  return Object.freeze(facts.map((fact) => (
    fact.component === component
      ? Object.freeze({
        ...fact,
        version: fact.version + '.next',
        digest: digest('changed:' + component),
      })
      : fact
  )));
}

function registryFor(
  prior: readonly ModelBenchmarkResumeComponentFact[],
  current: readonly ModelBenchmarkResumeComponentFact[],
  component: ModelBenchmarkResumeCompatibilityComponent,
  outcome: 'compatible' | 'migrate' | 'pin-old-runtime',
): ModelBenchmarkMigrationRegistry {
  const from = prior.find((fact) => fact.component === component);
  const to = current.find((fact) => fact.component === component);
  if (from === undefined || to === undefined) {
    throw new Error('Missing compatibility fact for ' + component);
  }
  return migrationRegistry([{
    component,
    fromVersion: from.version,
    fromDigest: from.digest,
    toVersion: to.version,
    toDigest: to.digest,
    outcome,
    revision: component + '-' + outcome + '@1',
  }]);
}

async function appendEffectEvent(
  harness: EffectHarness,
  eventType: string,
  eventId: string,
  streamId: string,
  streamSequence: number,
  idempotencyKey: string,
  payload: JsonObject,
  causationId: string | null,
): Promise<VerifiedLedgerEvent> {
  const prepared = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: streamId,
    stream_sequence: streamSequence,
    occurred_at: RESUME_REQUEST_TIME,
    recorded_at: RESUME_REQUEST_TIME,
    producer: { name: 'model-benchmark-resume-effect-fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: RUN_ID,
    causation_id: causationId,
    idempotency_key: idempotencyKey,
    payload,
  }, harness.effectRegistry);
  return (await harness.effectWriter.append(prepared)).verified;
}

async function seedEffectIntent(
  fixture: ModelScenario,
  harness: EffectHarness,
  effectKey: string,
): Promise<SeededEffect> {
  const intent: EffectIntentPayload = {
    effect_id: 'effect-' + digest(effectKey),
    run_id: RUN_ID,
    logical_effect_id: 'logical-' + effectKey,
    effect_type: 'subprocess',
    operation: 'persist-benchmark-result',
    target_identity: 'target-' + effectKey,
    input_digest: digest('input-' + effectKey),
    safe_metadata: {},
    secret_references: [],
    adapter: {
      adapter_id: 'adapter-' + effectKey,
      adapter_version: 'adapter-v1',
      effect_type: 'subprocess',
      replay_safe: false,
      idempotency_mode: 'postcondition',
      reconciliation: 'none',
    },
    idempotency_key: effectKey,
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: digest('postcondition-' + effectKey),
    replay_fingerprint:
      fixture.bundle.commonBundle.certificate.body.replayFingerprint,
    requested_at: RESUME_REQUEST_TIME,
  };
  const streamId = 'effect-' + RUN_ID + '-' + effectKey;
  const intentEvent = await appendEffectEvent(
    harness,
    EFFECT_INTENT_EVENT_TYPE,
    'effect-intent-' + digest(effectKey),
    streamId,
    1,
    effectKey,
    intent,
    null,
  );
  return Object.freeze({ intent, intentEvent, streamId });
}

function confirmationFor(
  seeded: SeededEffect,
  overrides: Partial<EffectConfirmationPayload> = {},
): EffectConfirmationPayload {
  return {
    confirmation_id:
      'effect-confirmation-' + digest(seeded.intent.idempotency_key),
    effect_id: seeded.intent.effect_id,
    intent_event_id: seeded.intentEvent.event.effective.envelope.event_id,
    intent_event_digest: seeded.intentEvent.event.stored.digest,
    idempotency_key: seeded.intent.idempotency_key,
    adapter: seeded.intent.adapter,
    external_receipt_digest: digest('external-receipt'),
    postcondition_digest: seeded.intent.expected_postcondition_digest,
    output_digest: digest('effect-output'),
    completion_class: 'executed',
    observed_at: RESUME_REQUEST_TIME,
    safe_result_metadata: {},
    ...overrides,
  };
}

function rewriteModelEvent(
  event: ModelBenchmarkLedgerEvent,
  overrides: {
    readonly streamId?: string;
    readonly streamSequence?: number;
    readonly causationId?: string | null;
  },
): ModelBenchmarkLedgerEvent {
  return prepareModelBenchmarkEvent({
    stem: event.payload.stem,
    scope: event.payload.scope,
    prevEventHash: event.payload.prevEventHash,
    replay: event.payload.replay,
    data: event.payload.data,
    eventId: event.event_id,
    streamId: overrides.streamId ?? event.stream_id,
    streamSequence: overrides.streamSequence ?? event.stream_sequence,
    occurredAt: event.occurred_at,
    recordedAt: event.recorded_at,
    producer: event.producer,
    authorityEpoch: event.authority_epoch,
    correlationId: event.correlation_id,
    causationId: overrides.causationId === undefined
      ? event.causation_id
      : overrides.causationId,
    idempotencyKey: event.idempotency_key,
  } as ModelBenchmarkEventInput<ModelBenchmarkEventStem>,
  createModelBenchmarkEventRegistry()).envelope;
}

function withAdapterLocalReplayCorruption(
  fixture: ModelScenario,
  corrupt: (
    events: readonly VerifiedLedgerEvent[],
    projectionEvents: ModelBenchmarkLedgerEvent[],
  ) => readonly VerifiedLedgerEvent[],
): ModelScenario {
  const realLedger = fixture.verification.replay.ledger;
  const projectionEvents = [...fixture.events];
  let readCount = 0;
  const ledger = new Proxy(realLedger, {
    get(target, property, receiver) {
      if (property === 'readVerifiedEvents') {
        return async () => {
          const events = await target.readVerifiedEvents();
          readCount += 1;
          return readCount <= 2
            ? events
            : corrupt(events, projectionEvents);
        };
      }
      const value = Reflect.get(target, property, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
  return Object.freeze({
    ...fixture,
    verification: {
      ...fixture.verification,
      projectionEvents,
      replay: {
        ...fixture.verification.replay,
        ledger,
      },
    },
  });
}

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('model benchmark resume adapter', () => {
  it.each([
    {
      label: 'exact-reuse',
      component: null,
      outcome: null,
      expected: 'exact-reuse',
    },
    {
      label: 'compatible',
      component: 'manifest',
      outcome: 'compatible',
      expected: 'compatible',
    },
    {
      label: 'migrate',
      component: 'prompt',
      outcome: 'migrate',
      expected: 'migrate',
    },
    {
      label: 'rebuild-required',
      component: 'workload',
      outcome: null,
      expected: 'rebuild-required',
    },
    {
      label: 'blocked',
      component: 'evaluator',
      outcome: 'pin-old-runtime',
      expected: 'blocked',
    },
  ] as const)(
    'derives the $label disposition from real prior facts',
    async ({ label, component, outcome, expected }) => {
      const fixture = await validModelScenario();
      const effects = effectHarness('matrix-' + label);
      const prior = await persistedResumeFacts(fixture, effects);
      const current = component === null
        ? prior
        : changedFact(prior, component);
      const registry = component !== null && outcome !== null
        ? registryFor(prior, current, component, outcome)
        : migrationRegistry();
      const result = await resumeAdapter(
        fixture,
        effects,
        [registry.registryDigest],
      ).resume(resumeRequest(fixture, current, registry));
      expect(result.offlineVerification.verdict).toBe('valid');
      expect(
        result.decision.disposition,
        result.decision.decisionReason,
      ).toBe(expected);
      expect(result.decision.authority).toBe('dark-evidence-only');
      expect(result.continuity?.currentStep).toBe('terminal-or-blocked');
    },
  );

  it('classifies real divergence and rejects caller and registry assertions', async () => {
    const fixture = await validModelScenario();
    const effects = effectHarness('caller-compatibility');
    const prior = await persistedResumeFacts(fixture, effects);
    const current = changedFact(prior, 'manifest');
    const asserted = registryFor(prior, current, 'manifest', 'compatible');
    expect(() => parseModelBenchmarkResumeRequest({
      ...resumeRequest(fixture, current, asserted),
      compatibilityOutcome: 'compatible',
    })).toThrow(/closed request shape/u);

    const classified = await resumeAdapter(
      fixture,
      effects,
      [migrationRegistry().registryDigest],
    ).resume(resumeRequest(fixture, current, migrationRegistry()));
    expect(classified.decision.disposition).toBe('rebuild-required');
    expect(classified.decision.compatibility.find(
      (entry) => entry.component === 'manifest',
    )?.outcome).toBe('incompatible');

    const unauthenticated = await resumeAdapter(
      fixture,
      effects,
      [],
    ).resume(resumeRequest(fixture, current, asserted));
    expect(unauthenticated.decision.compatibility.find(
      (entry) => entry.component === 'manifest',
    )?.outcome).toBe('compatible');
    expect(unauthenticated.decision.disposition).toBe('blocked');
    expect(unauthenticated.decision.decisionReason).toMatch(/not authenticated/u);
  });

  it.each([
    'tool',
    'model',
    'policy',
    'target',
    'schema',
  ] as const)(
    'recomputes the fingerprint when the real %s input changes',
    async (component) => {
      const fixture = await validModelScenario();
      const effects = effectHarness('fingerprint-' + component);
      const prior = await persistedResumeFacts(fixture, effects);
      const current = changedFact(prior, component);
      const registry = migrationRegistry();
      const result = await resumeAdapter(
        fixture,
        effects,
        [registry.registryDigest],
      ).resume(resumeRequest(fixture, current, registry));
      expect(result.decision.disposition).toBe('rebuild-required');
      expect(result.decision.persistedFingerprint?.finalDigest)
        .not.toBe(result.decision.currentFingerprint?.finalDigest);
      expect(result.decision.compatibility.find(
        (entry) => entry.component === component,
      )?.outcome).toBe('incompatible');
    },
  );

  it('commits reducer, adapter, schema, and codec versions to the fingerprint', async () => {
    const fixture = await validModelScenario();
    const effects = effectHarness('version-breadth');
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const result = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(fixture, prior, registry));
    const fingerprint = result.decision.currentFingerprint;
    if (fingerprint === null) throw new Error('Expected current fingerprint');
    expect(fingerprint.reducerVersion).toBe(MODEL_BENCHMARK_REDUCER_VERSION);
    expect(fingerprint.adapterVersion).toBe(MODEL_BENCHMARK_RESUME_ADAPTER_VERSION);
    expect(fingerprint.schemaVersion).toBe(MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION);
    expect(fingerprint.codecVersion).toBe('canonical-json@1');
    for (const field of [
      'reducerVersion',
      'adapterVersion',
      'schemaVersion',
      'codecVersion',
    ] as const) {
      expect(modelBenchmarkResumeFingerprintDigest({
        ...fingerprint,
        [field]: fingerprint[field] + '.changed',
      })).not.toBe(fingerprint.finalDigest);
    }
  });

  it.each([
    {
      label: 'intent event digest',
      override: { intent_event_digest: 'a'.repeat(64) },
    },
    {
      label: 'expected postcondition',
      override: { postcondition_digest: digest('different-postcondition') },
    },
    {
      label: 'adapter descriptor',
      override: {
        adapter: {
          adapter_id: 'different-adapter',
          adapter_version: 'adapter-v2',
          effect_type: 'subprocess',
          replay_safe: false,
          idempotency_mode: 'postcondition',
          reconciliation: 'none',
        },
      },
    },
  ] as const)(
    'does not reuse a confirmation with a mismatched $label',
    async ({ label, override }) => {
      const fixture = await validModelScenario();
      const effects = effectHarness(
        'effect-' + label.replaceAll(' ', '-'),
      );
      const seeded = await seedEffectIntent(
        fixture,
        effects,
        'effect-' + label.replaceAll(' ', '-'),
      );
      const confirmation = confirmationFor(seeded, override);
      expect(effectConfirmationBindsIntent(
        confirmation,
        seeded.intent,
        seeded.intentEvent.event.effective.envelope.event_id,
        seeded.intentEvent.event.stored.digest,
      )).toBe(false);
      await appendEffectEvent(
        effects,
        EFFECT_CONFIRMATION_EVENT_TYPE,
        confirmation.confirmation_id,
        seeded.streamId,
        2,
        seeded.intent.idempotency_key + ':confirmation',
        confirmation,
        confirmation.intent_event_id,
      );
      const prior = await persistedResumeFacts(fixture, effects);
      const registry = migrationRegistry();
      const result = await resumeAdapter(
        fixture,
        effects,
        [registry.registryDigest],
      ).resume(resumeRequest(fixture, prior, registry));
      expect(result.decision.sharedDecision).not.toBeNull();
      expect(result.decision.effects).toHaveLength(1);
      expect(result.decision.effects[0]).toMatchObject({
        applicationState: 'unknown',
        disposition: 'blocked',
      });
      expect(result.decision.effects[0]?.evidenceRefs)
        .not.toContain(confirmation.confirmation_id);
    },
  );

  it('reuses the exact shared compatibility and effect decision identities', async () => {
    const fixture = await validModelScenario();
    const effects = effectHarness('shared-identities');
    const seeded = await seedEffectIntent(fixture, effects, 'bound-effect');
    const confirmation = confirmationFor(seeded);
    expect(effectConfirmationBindsIntent(
      confirmation,
      seeded.intent,
      seeded.intentEvent.event.effective.envelope.event_id,
      seeded.intentEvent.event.stored.digest,
    )).toBe(true);
    await appendEffectEvent(
      effects,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      confirmation.confirmation_id,
      seeded.streamId,
      2,
      seeded.intent.idempotency_key + ':confirmation',
      confirmation,
      confirmation.intent_event_id,
    );
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const result = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(fixture, prior, registry));
    expect(result.decision.effects).toBe(result.decision.sharedDecision?.effects);
    expect(result.decision.compatibility.slice(0, 5))
      .toEqual(result.decision.sharedDecision?.compatibility);
    expect(result.decision.effects[0]).toMatchObject({
      applicationState: 'applied',
      disposition: 'reuse',
    });
  });

  it('rejects a self-consistent checkpoint with the wrong authenticated cursor', async () => {
    const fixture = await validModelScenario();
    const effects = effectHarness('checkpoint');
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const first = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(fixture, prior, registry));
    const checkpoint = first.checkpoint;
    if (checkpoint === null) throw new Error('Expected reducer checkpoint');
    const changedTail = checkpoint.sourceStreamTails.find(
      (tail) => tail.lastSequence >= 2,
    );
    if (changedTail === undefined) {
      throw new Error('Expected a non-empty Model Benchmark checkpoint tail');
    }
    const sourceStreamTails = checkpoint.sourceStreamTails.map((tail) => (
      tail.streamId === changedTail.streamId
        ? {
          streamId: tail.streamId,
          lastSequence: tail.lastSequence - 1,
        }
        : tail
    ));
    const forgedCheckpoint: ModelBenchmarkProjectionCheckpoint = {
      projection: checkpoint.projection,
      sourceStreamTails,
      integrityDigest: digest({
        projectionDigest:
          modelBenchmarkProjectionIntegrityDigest(checkpoint.projection),
        sourceStreamTails,
      }),
    };
    const result = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(fixture, prior, registry, forgedCheckpoint));
    expect(result.offlineVerification.verdict).toBe('valid');
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('checkpoint-digest-mismatch');
    expect(result.projection).toBeNull();
  });

  it('rejects a certificate frontier that differs from the real ledger tail', async () => {
    const fixture = await validModelScenario();
    const divergent = withAdapterLocalReplayCorruption(
      fixture,
      (events) => {
        const coveredIndex =
          fixture.verification.replay.rangeEndSequence - 1;
        const final = events[coveredIndex];
        if (final === undefined) throw new Error('Expected final verified event');
        return Object.freeze([
          ...events.slice(0, coveredIndex),
          Object.freeze({
            ...final,
            frame: Object.freeze({
              ...final.frame,
              record_hash: digest('corrupted-real-ledger-frontier'),
            }),
          }),
          ...events.slice(coveredIndex + 1),
        ]);
      },
    );
    const effects = effectHarness('frontier');
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const result = await resumeAdapter(
      divergent,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(divergent, prior, registry));
    expect(result.offlineVerification.verdict).toBe('valid');
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('frontier-mismatch');
    expect(result.authenticatedTail?.finalHeadHash)
      .not.toBe(fixture.bundle.certificate.body.finalHeadHash);
    expect(result.decision.persistedFingerprint).toBeNull();
  });

  it.each([
    {
      label: 'causal cursor gap',
      rewrite: (event: ModelBenchmarkLedgerEvent) => rewriteModelEvent(event, {
        streamSequence: event.stream_sequence + 1,
      }),
    },
    {
      label: 'stream split',
      rewrite: (event: ModelBenchmarkLedgerEvent) => rewriteModelEvent(event, {
        streamId: event.stream_id + '-split',
        streamSequence: 1,
        causationId: null,
      }),
    },
  ])(
    'fails closed on an authenticated-history $label',
    async ({ label, rewrite }) => {
      const fixture = await validModelScenario();
      const divergent = withAdapterLocalReplayCorruption(
        fixture,
        (verifiedEvents, projectionEvents) => {
          const finalIndex = projectionEvents.length - 1;
          const finalEvent = projectionEvents[finalIndex];
          const finalVerified = verifiedEvents[finalIndex];
          if (finalEvent === undefined || finalVerified === undefined) {
            throw new Error('Expected final authenticated event');
          }
          const corrupted = rewrite(finalEvent);
          projectionEvents[finalIndex] = corrupted;
          return Object.freeze([
            ...verifiedEvents.slice(0, finalIndex),
            Object.freeze({
              ...finalVerified,
              event: Object.freeze({
                ...finalVerified.event,
                effective: Object.freeze({
                  ...finalVerified.event.effective,
                  envelope: corrupted,
                }),
              }),
            }),
            ...verifiedEvents.slice(finalIndex + 1),
          ]);
        },
      );
      const effects = effectHarness(
        'history-' + label.replaceAll(' ', '-'),
      );
      const prior = await persistedResumeFacts(fixture, effects);
      const registry = migrationRegistry();
      const result = await resumeAdapter(
        divergent,
        effects,
        [registry.registryDigest],
      ).resume(resumeRequest(divergent, prior, registry));
      expect(result.offlineVerification.verdict).toBe('valid');
      expect(result.decision.disposition).toBe('rebuild-required');
      expect(result.reasonCodes).toContain('cursor-gap');
      expect(result.decision.decisionReason)
        .toMatch(/Authenticated replay integrity failed closed/u);
      expect(result.projection).toBeNull();
    },
  );

  it('blocks a mutated prior certificate before any reuse', async () => {
    const fixture = await validModelScenario();
    const effects = effectHarness('mutated-certificate');
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const request = resumeRequest(fixture, prior, registry);
    const result = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume({
      ...request,
      priorRunBundle: {
        ...request.priorRunBundle,
        certificate: {
          ...request.priorRunBundle.certificate,
          body: {
            ...request.priorRunBundle.certificate.body,
            registryDigest: digest('mutated-registry'),
          },
        },
      },
    });
    expect(result.offlineVerification.verdict).not.toBe('valid');
    expect(result.decision.disposition).toBe('blocked');
    expect(result.reasonCodes).toContain('certificate-unverified');
    expect(result.decision.persistedFingerprint).toBeNull();
  });

  it('exports the full continuity ladder and authenticated resume frontier', async () => {
    expect(MODEL_BENCHMARK_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'run-identity',
      'design-and-workload',
      'matrix-dispatch',
      'evidence-collection',
      'scoring-and-validity',
      'selection',
      'shared-status',
      'terminal-or-blocked',
    ]);
    const fixture = await validModelScenario();
    const effects = effectHarness('continuity');
    const prior = await persistedResumeFacts(fixture, effects);
    const registry = migrationRegistry();
    const result = await resumeAdapter(
      fixture,
      effects,
      [registry.registryDigest],
    ).resume(resumeRequest(fixture, prior, registry));
    expect(result.continuity?.seenEventIds).toHaveLength(fixture.events.length);
    expect(result.continuity?.streamFrontiers)
      .toEqual(result.checkpoint?.sourceStreamTails);
    expect(result.authenticatedTail?.eventCount).toBe(fixture.events.length);
    expect(result.reasonCodes).toEqual([]);
  });
});
