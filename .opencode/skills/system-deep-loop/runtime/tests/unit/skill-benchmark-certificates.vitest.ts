// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Certificate Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepImprovementCommonTransitionKinds,
  issueDeepImprovementCommonRunCertificate,
} from '../../lib/deep-improvement-common-certificates/index.js';
import {
  SkillBenchmarkCertificateFailureCodes,
  SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES,
  SkillBenchmarkTransitionKinds,
  issueSkillBenchmarkRunCertificate,
  verifySkillBenchmarkCertificateOffline,
} from '../../lib/skill-benchmark-certificates/index.js';
import {
  SkillBenchmarkArtifactKinds,
  createSkillBenchmarkSealedArtifactStore,
  sealSkillBenchmarkArtifact,
} from '../../lib/skill-benchmark-sealed-artifacts/index.js';
import {
  SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  SkillBenchmarkWireEventTypes,
  createSkillBenchmarkEventRegistry,
  skillBenchmarkEventDefinitions,
  prepareSkillBenchmarkEvent,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import {
  SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  SKILL_BENCHMARK_REDUCER_ID,
  SKILL_BENCHMARK_REDUCER_VERSION,
  createSkillBenchmarkProjectionState,
  reduceSkillBenchmarkVerifiedEvent,
} from '../../lib/skill-benchmark-reducers/index.js';
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
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  AuthorizedEvidenceWriter,
  CertificationProviderRegistry,
  certifyBoundaryReceipt,
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
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkOfflineVerificationInput,
  SkillBenchmarkTransitionReceiptInput,
  SkillBenchmarkTransitionReceiptSubstrate,
} from '../../lib/skill-benchmark-certificates/index.js';
import type { SkillBenchmarkProjectionState } from '../../lib/skill-benchmark-reducers/index.js';
import type {
  SkillBenchmarkEventEnvelope,
  SkillBenchmarkEventInput,
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerEvent,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkScopeMap,
  SkillBenchmarkSpecificEventStem,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkArtifactKind,
  SkillBenchmarkBenchmarkDesignMaterial,
  SkillBenchmarkCausalScoreObservationMaterial,
  SkillBenchmarkEffectCertificateInputMaterial,
  SkillBenchmarkExposureObservationMaterial,
  SkillBenchmarkRunAssignmentMaterial,
  SkillBenchmarkScenarioGoldManifestMaterial,
  SkillBenchmarkSealedArtifactBinding,
  SkillBenchmarkSkillBundleSnapshotMaterial,
  SkillBenchmarkTreatmentArm,
} from '../../lib/skill-benchmark-sealed-artifacts/index.js';
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
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

type ReplayProjection = DeepImprovementCommonProjectionState & JsonObject;
type SkillReplayProjection = SkillBenchmarkProjectionState & JsonObject;

interface CommonScenario {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly store: ReturnType<typeof createSkillBenchmarkSealedArtifactStore>;
  readonly bindings: readonly DeepImprovementCommonSealedArtifactBinding[];
  readonly events: readonly DeepImprovementCommonLedgerEvent[];
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
    variant: 'skill-benchmark' as const,
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
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
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
  });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'deep-improvement-certificate-writer',
    correlationId: 'deep-improvement-certificate-writer',
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
  const store = createSkillBenchmarkSealedArtifactStore({
    rootDirectory: temporaryRoot('artifacts'),
  });
  const fixtures = await Promise.all(
    Array.from({ length: 8 }, (_, index) => sealSkillBenchmarkArtifact(
      store,
      SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
      {
        schemaVersion: 'skill-benchmark-artifact@1',
        artifactId: `common-fixture-${index + 1}`,
        dependencyReferences: [],
        originEvent: {
          eventStem: 'skill_benchmark.run_planned',
          eventId: `common-fixture-origin-${index + 1}`,
          payloadDigest: digest(`common-fixture-origin-${index + 1}`),
        },
        producerVersion: 'skill-benchmark-certificate-tests@1',
        locator: locator(`common-fixture-${index + 1}`),
        randomizationSeed: index + 1,
        replicateCount: 1,
        blockingFactorCodes: ['fixture'],
        treatmentArms: ['control'],
        assignmentPolicyVersion: 'fixture-policy@1',
        registryDigest: digest(`common-fixture-registry-${index + 1}`),
        workloadDigest: digest(`common-fixture-workload-${index + 1}`),
        designCellDigests: [digest(`common-fixture-cell-${index + 1}`)],
      },
    )),
  );
  const fixture = (index: number): SealedArtifactReference => {
    const reference = fixtures[index]?.reference;
    if (reference === undefined) throw new Error(`Missing common fixture ${index}`);
    return reference;
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
    dependencyReferences: [],
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
    sourceArtifactReferences: [evaluator.reference],
    dependencyReferences: [
      dependency('evaluator', evaluator.reference),
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
    incumbentReference: evaluator.reference,
    profileScopeDigest: digest('profile'),
    modelConfigurationDigest: digest('baseline-model'),
    promptConfigurationDigest: digest('baseline-prompt'),
    toolConfigurationDigest: digest('baseline-tools'),
    selectedFixtureManifestDigest: digest('fixture-set'),
    seed: 7,
    sourceArtifactReferences: [evaluator.reference],
    dependencyReferences: [
      dependency('evaluator', evaluator.reference),
    ],
    originEvent: origin(events, 'deep_improvement_common.run_started'),
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
      outputReference: evaluator.reference,
      scoreVectorDigest: digest('score-vector'),
    }],
    rawScoreVector: scoreVector(),
    traceReferences: [evaluator.reference],
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
    freshnessWindowSeconds: options.staleCanary ? 3600 : 2_000_000_000,
    sealedAt: '2026-07-23T09:00:00.000Z',
    expiresAt: options.staleCanary
      ? '2026-07-23T09:15:00.000Z'
      : '2090-01-01T00:00:00.000Z',
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
    fixture(0),
    fixture(1),
    fixture(2),
    fixture(3),
    fixture(4),
    fixture(5),
    fixture(6),
    fixture(7),
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

async function scenario(options: ScenarioOptions = {}): Promise<CommonScenario> {
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
    events,
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

interface SkillIdentity {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly executionId: string;
  readonly observationId: string;
}

interface SkillModeEvents {
  readonly events: readonly SkillBenchmarkLedgerEvent[];
  readonly planned: SkillBenchmarkEventEnvelope<'skill_benchmark.run_planned'>;
  readonly assignments: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>[];
  readonly started: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>[];
  readonly discovered: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.skill_discovered'>[];
  readonly loaded: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.skill_loaded'>[];
  readonly exposed: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.resource_exposed'>[];
  readonly milestones: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.milestone_observed'>[];
  readonly finished: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_finished'>[];
  readonly outcomes: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.outcome_recorded'>[];
  readonly gold: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>[];
  readonly scores: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.score_observed'>[];
  readonly compatibility: readonly SkillBenchmarkEventEnvelope<'skill_benchmark.compatibility_observed'>[];
  readonly negativeTransfer: SkillBenchmarkEventEnvelope<'skill_benchmark.negative_transfer_observed'>;
  readonly security: SkillBenchmarkEventEnvelope<'skill_benchmark.security_probe_recorded'>;
  readonly runClosed: SkillBenchmarkEventEnvelope<'skill_benchmark.run_closed'>;
  readonly certificateIssued: SkillBenchmarkEventEnvelope<'skill_benchmark.effect_certificate_issued'>;
}

interface SkillScenario {
  readonly bundle: SkillBenchmarkCertificateBundle;
  readonly verification: SkillBenchmarkOfflineVerificationInput<SkillReplayProjection>;
  readonly store: ReturnType<typeof createSkillBenchmarkSealedArtifactStore>;
  readonly bindings: readonly SkillBenchmarkSealedArtifactBinding[];
  readonly events: readonly SkillBenchmarkLedgerEvent[];
}

const SKILL_STREAM_ID = 'skill-benchmark-certificate-run-1';
const SKILL_ARMS = Object.freeze([
  'no-skill',
  'auto-route',
  'forced-activation',
  'placebo',
  'component-ablation',
  'compatibility-boundary',
] as const satisfies readonly SkillBenchmarkTreatmentArm[]);

const SKILL_IDENTITIES = Object.freeze(SKILL_ARMS.map((_, index): SkillIdentity => ({
  scenarioId: `scenario-${index + 1}`,
  assignmentId: `assignment-${index + 1}`,
  executionId: `execution-${index + 1}`,
  observationId: `observation-${index + 1}`,
})));

function skillScope<TStem extends SkillBenchmarkSpecificEventStem>(
  stem: TStem,
  identity: SkillIdentity = SKILL_IDENTITIES[0] as SkillIdentity,
): SkillBenchmarkScopeMap[TStem] {
  const base = { runId: RUN_ID, lineageId: LINEAGE_ID, variant: 'skill-benchmark' as const };
  const design = { ...base, benchmarkDesignId: 'design-1' };
  const treatment = {
    ...design,
    scenarioId: identity.scenarioId,
    assignmentId: identity.assignmentId,
  };
  const scenarioScope = { ...treatment, executionId: identity.executionId };
  if (stem.startsWith('skill_benchmark.effect_certificate_')) {
    return { ...base, certificateId: 'skill-certificate-1' } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.run_planned' || stem === 'skill_benchmark.run_closed') {
    return design as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.treatment_assigned') {
    return treatment as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.resource_exposed') {
    return {
      ...scenarioScope,
      skillBundleId: `skill-bundle-${identity.scenarioId}`,
      resourceId: `resource-${identity.scenarioId}`,
    } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem.startsWith('skill_benchmark.skill_')) {
    return {
      ...scenarioScope,
      skillBundleId: `skill-bundle-${identity.scenarioId}`,
    } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.milestone_observed') {
    return {
      ...scenarioScope,
      milestoneId: `milestone-${identity.scenarioId}`,
    } as SkillBenchmarkScopeMap[TStem];
  }
  if ([
    'skill_benchmark.outcome_recorded',
    'skill_benchmark.score_observed',
    'skill_benchmark.gold_integrity_recorded',
    'skill_benchmark.compatibility_observed',
    'skill_benchmark.negative_transfer_observed',
    'skill_benchmark.security_probe_recorded',
  ].includes(stem)) {
    return { ...scenarioScope, observationId: identity.observationId } as SkillBenchmarkScopeMap[TStem];
  }
  return scenarioScope as SkillBenchmarkScopeMap[TStem];
}

function appendSkillEvent<TStem extends SkillBenchmarkSpecificEventStem>(
  events: SkillBenchmarkLedgerEvent[],
  stem: TStem,
  data: SkillBenchmarkPayloadMap[TStem],
  identity: SkillIdentity = SKILL_IDENTITIES[0] as SkillIdentity,
): SkillBenchmarkEventEnvelope<TStem> {
  const sequence = events.length + 1;
  const previous = events.at(-1);
  const prepared = prepareSkillBenchmarkEvent({
    stem,
    scope: skillScope(stem, identity),
    prevEventHash: previous === undefined ? ZERO_DIGEST : digest(previous),
    replay: replayMetadata(),
    data,
    eventId: `skill-certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: SKILL_STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-certificate-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `skill-certificate-event-${sequence}`,
  }, createSkillBenchmarkEventRegistry());
  const event = prepared.envelope as SkillBenchmarkEventEnvelope<TStem>;
  events.push(event);
  return event;
}

function buildSkillModeEvents(
  normalized: DeepImprovementCommonLedgerEvent,
  options: { readonly blockedGold?: boolean } = {},
): SkillModeEvents {
  const events: SkillBenchmarkLedgerEvent[] = [];
  const planned = appendSkillEvent(events, 'skill_benchmark.run_planned', {
    designRef: 'design:benchmark-1',
    designDigest: digest('skill-design'),
    taskSetRef: 'task-set:paired-1',
    taskSetDigest: digest('skill-task-set'),
    skillBundleRef: 'skill-bundle-1',
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('skill-registry'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('skill-executor'),
    environmentDigest: digest('skill-environment'),
    dependencyDigest: digest('skill-dependency'),
    workloadDigest: digest('skill-workload'),
    randomizationSeed: 42,
    replicateCount: SKILL_ARMS.length,
    designPolicyVersion: 'benchmark-design@1',
  });
  const assignments = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.treatment_assigned', {
      designEventId: planned.event_id,
      designPayloadDigest: planned.payload.payloadDigest,
      treatmentArm: SKILL_ARMS[index] as SkillBenchmarkTreatmentArm,
      randomizationSeed: 42,
      propensity: 1 / SKILL_ARMS.length,
      replicateIndex: index + 1,
      pairedReplicateId: `pair-${index + 1}`,
      designCellId: `cell-${index + 1}`,
      taskRef: `task:${index + 1}`,
      taskDigest: digest(`skill-task-${index + 1}`),
      skillBundleRef: 'skill-bundle-1',
      skillBundleDigest: digest('skill-bundle'),
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: digest('skill-executor'),
      environmentDigest: digest('skill-environment'),
      assignmentReceiptRef: `receipt:assignment-${index + 1}`,
    }, identity)
  ));
  const started = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.scenario_started', {
      assignmentEventId: (assignments[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>).event_id,
      assignmentPayloadDigest: (assignments[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>).payload.payloadDigest,
      taskRef: `task:${index + 1}`,
      taskDigest: digest(`skill-task-${index + 1}`),
      environmentRef: 'environment:snapshot-1',
      environmentDigest: digest('skill-environment'),
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: digest('skill-executor'),
      toolDigest: digest('skill-tool'),
      permissionDigest: digest('skill-permission'),
      dependencyDigest: digest('skill-dependency'),
      workloadDigest: digest('skill-workload'),
      executionReceiptRef: `receipt:execution-start-${index + 1}`,
      startedAt: TIMESTAMP,
    }, identity)
  ));
  const discovered = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.skill_discovered', {
      scenarioStartedEventId: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
      skillBundleRef: 'skill-bundle-1',
      skillBundleDigest: digest('skill-bundle'),
      registryDigest: digest('skill-registry'),
      discoveryMethod: index === 2 ? 'forced' : 'auto-route',
      availabilityStatus: 'available',
      discoveryEvidenceRef: `evidence:discovery-${index + 1}`,
      discoveryEvidenceDigest: digest(`skill-discovery-${index + 1}`),
    }, identity)
  ));
  const loaded = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.skill_loaded', {
      discoveredEventId: (discovered[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.skill_discovered'>).event_id,
      discoveredPayloadDigest: (discovered[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.skill_discovered'>).payload.payloadDigest,
      disclosureStage: 'instructions',
      skillBundleRef: 'skill-bundle-1',
      skillBundleDigest: digest('skill-bundle'),
      loadedResourceClasses: ['instructions'],
      loaderReceiptRef: `receipt:loader-${index + 1}`,
      loadStatus: 'loaded',
    }, identity)
  ));
  SKILL_IDENTITIES.forEach((identity, index) => {
    const loadedEvent = loaded[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.skill_loaded'>;
    appendSkillEvent(events, 'skill_benchmark.skill_invoked', {
      loadedEventId: loadedEvent.event_id,
      loadedPayloadDigest: loadedEvent.payload.payloadDigest,
      invocationMode: index === 2 ? 'forced' : 'auto',
      activationRef: `activation:skill-${index + 1}`,
      activationDigest: digest(`skill-activation-${index + 1}`),
      invocationReceiptRef: `receipt:invocation-${index + 1}`,
      invocationStatus: 'invoked',
      failureReasonCode: null,
    }, identity);
  });
  const exposed = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.resource_exposed', {
      skillLoadedEventId: (loaded[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.skill_loaded'>).event_id,
      resourceRef: `resource:skill-${index + 1}`,
      resourceDigest: digest(`skill-resource-${index + 1}`),
      resourceClass: 'instruction',
      exposureStage: 'instructions',
      canaryRef: `canary:resource-${index + 1}`,
      canaryDigest: digest(`resource-canary-${index + 1}`),
      exposureReceiptRef: `receipt:exposure-${index + 1}`,
      canaryStatus: 'clean',
    }, identity)
  ));
  const milestones = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.milestone_observed', {
      scenarioStartedEventId: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
      milestoneCode: 'validated-output',
      ordinal: 1,
      milestoneState: 'reached',
      observationRef: `observation:milestone-${index + 1}`,
      observationDigest: digest(`skill-milestone-${index + 1}`),
      complianceStatus: 'compliant',
    }, identity)
  ));
  SKILL_IDENTITIES.forEach((identity, index) => {
    appendSkillEvent(events, 'skill_benchmark.trajectory_recorded', {
      scenarioStartedEventId: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
      milestoneEventIds: [(milestones[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.milestone_observed'>).event_id],
      orderedKeyPointCodes: ['discover', 'load', 'invoke', 'validate'],
      intermediateStateDigest: digest(`skill-intermediate-${index + 1}`),
      traceRef: `trace:trajectory-${index + 1}`,
      traceDigest: digest(`skill-trajectory-${index + 1}`),
      complianceObservationRef: `observation:compliance-${index + 1}`,
      complianceObservationDigest: digest(`skill-compliance-${index + 1}`),
    }, identity);
  });
  const finished = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.scenario_finished', {
      startedEventId: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
      startedPayloadDigest: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).payload.payloadDigest,
      outcomeRef: `outcome:scenario-${index + 1}`,
      outcomeDigest: digest(`skill-outcome-${index + 1}`),
      finalStateDigest: digest(`skill-final-state-${index + 1}`),
      executionReceiptRef: `receipt:execution-finish-${index + 1}`,
      terminalOutcome: 'pass',
      finishedAt: TIMESTAMP,
    }, identity)
  ));
  const outcomes = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.outcome_recorded', {
      scenarioTerminalEventId: (finished[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_finished'>).event_id,
      finalStateRef: `state:final-${index + 1}`,
      finalStateDigest: digest(`skill-final-state-${index + 1}`),
      deterministicCheckSetRef: `checks:deterministic-${index + 1}`,
      deterministicCheckSetDigest: digest(`skill-deterministic-${index + 1}`),
      dynamicReferenceSetRef: `checks:dynamic-${index + 1}`,
      dynamicReferenceSetDigest: digest(`skill-dynamic-${index + 1}`),
      constraintCoverageRef: `coverage:constraints-${index + 1}`,
      constraintCoverageDigest: digest(`skill-coverage-${index + 1}`),
      outcomeStatus: 'pass',
    }, identity)
  ));
  const gold = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.gold_integrity_recorded', {
      goldRef: `gold:scenario-${index + 1}`,
      goldDigest: digest(`skill-gold-${index + 1}`),
      goldPolicy: options.blockedGold === true && index === 0 ? 'pending' : 'scored',
      provenanceRef: `provenance:gold-${index + 1}`,
      provenanceDigest: digest(`skill-gold-provenance-${index + 1}`),
      coverageRatio: options.blockedGold === true && index === 0 ? 0 : 1,
      integrityStatus: options.blockedGold === true && index === 0 ? 'pending' : 'accepted',
      reasonCode: options.blockedGold === true && index === 0 ? 'gold-pending' : 'gold-verified',
      evaluatorRef: 'evaluator:gold-integrity-1',
      evaluatorFingerprint: digest('skill-gold-evaluator'),
    }, identity)
  ));
  const scores = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.score_observed', {
      outcomeEventId: (outcomes[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.outcome_recorded'>).event_id,
      evaluatorRef: 'evaluator:skill-benchmark-1',
      evaluatorVersion: 'evaluator@1',
      evaluatorFingerprint: digest('skill-evaluator'),
      deterministicResultsRef: `results:deterministic-${index + 1}`,
      deterministicResultsDigest: digest(`skill-deterministic-results-${index + 1}`),
      dynamicReferenceResultsRef: `results:dynamic-${index + 1}`,
      dynamicReferenceResultsDigest: digest(`skill-dynamic-results-${index + 1}`),
      rawScoreAxes: [{
        dimensionCode: 'correctness',
        rawScore: 0.8,
        measurementRef: `measurement:correctness-${index + 1}`,
        measurementDigest: digest(`skill-correctness-${index + 1}`),
      }],
      constraintCoverageRef: `coverage:constraints-${index + 1}`,
      constraintCoverageDigest: digest(`skill-coverage-${index + 1}`),
      tokenCount: 500,
      latencyMs: 1_200,
      costMicrounits: 25,
      workloadDigest: digest('skill-workload'),
      goldIntegrityEventId: (gold[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>).event_id,
      goldIntegrityPayloadDigest: (gold[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>).payload.payloadDigest,
      goldPolicy: options.blockedGold === true && index === 0 ? 'pending' : 'scored',
      numeratorEligible: !(options.blockedGold === true && index === 0),
      scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
    }, identity)
  ));
  const compatibility = SKILL_IDENTITIES.map((identity, index) => (
    appendSkillEvent(events, 'skill_benchmark.compatibility_observed', {
      scenarioStartedEventId: (started[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
      taskDigest: digest(`skill-task-${index + 1}`),
      skillBundleDigest: digest('skill-bundle'),
      registryDigest: digest('skill-registry'),
      executorDigest: digest('skill-executor'),
      toolDigest: digest('skill-tool'),
      permissionDigest: digest('skill-permission'),
      environmentDigest: digest('skill-environment'),
      dependencyDigest: digest('skill-dependency'),
      workloadDigest: digest('skill-workload'),
      compatibilityStatus: 'compatible',
      evidenceRef: `evidence:compatibility-${index + 1}`,
      evidenceDigest: digest(`skill-compatibility-${index + 1}`),
    }, identity)
  ));
  const negativeTransfer = appendSkillEvent(events, 'skill_benchmark.negative_transfer_observed', {
    baselineAssignmentEventId: (assignments[0] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>).event_id,
    treatedAssignmentEventId: (assignments[1] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>).event_id,
    baselineOutcomeEventId: (outcomes[0] as SkillBenchmarkEventEnvelope<'skill_benchmark.outcome_recorded'>).event_id,
    treatedOutcomeEventId: (outcomes[1] as SkillBenchmarkEventEnvelope<'skill_benchmark.outcome_recorded'>).event_id,
    axisCode: 'correctness',
    rawDelta: 0.1,
    transferStatus: 'no-negative-transfer',
    evidenceRef: 'evidence:negative-transfer-1',
    evidenceDigest: digest('skill-negative-transfer'),
  }, SKILL_IDENTITIES[1] as SkillIdentity);
  const security = appendSkillEvent(events, 'skill_benchmark.security_probe_recorded', {
    scenarioStartedEventId: (started[1] as SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>).event_id,
    probeRef: 'probe:security-1',
    probeDigest: digest('skill-security-probe'),
    compositionPathDigest: digest('skill-composition-path'),
    probeOutcome: 'pass',
    evidenceRef: 'evidence:security-1',
    evidenceDigest: digest('skill-security-evidence'),
    refusalObserved: true,
    policyVersion: 'security-policy@1',
  }, SKILL_IDENTITIES[1] as SkillIdentity);
  const runClosed = appendSkillEvent(events, 'skill_benchmark.run_closed', {
    designEventId: planned.event_id,
    scenarioTerminalEventIds: finished.map((event) => event.event_id),
    terminalStatus: 'closed',
    accountingRef: 'accounting:skill-run-1',
    accountingDigest: digest('skill-accounting'),
    closedAt: TIMESTAMP,
  });
  const certificateIssued = appendSkillEvent(events, 'skill_benchmark.effect_certificate_issued', {
    normalizedScoreEventRef: `event:deep_improvement_common.evaluation_normalized:${normalized.event_id}`,
    normalizedScorePayloadDigest: normalized.payload.payloadDigest,
    goldIntegrityEventId: (gold[0] as SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>).event_id,
    evidenceEventIds: [
      ...scores.map((event) => event.event_id),
      ...compatibility.map((event) => event.event_id),
      negativeTransfer.event_id,
      security.event_id,
    ],
    evidenceSetDigest: digest('skill-evidence-set'),
    validityDomain: {
      taskSetDigest: digest('skill-task-set'),
      skillBundleDigest: digest('skill-bundle'),
      registryDigest: digest('skill-registry'),
      executorDigest: digest('skill-executor'),
      environmentDigest: digest('skill-environment'),
      dependencyDigest: digest('skill-dependency'),
      workloadDigest: digest('skill-workload'),
      validityPolicyVersion: 'validity-policy@1',
    },
    confidenceIntervalRef: 'artifact:confidence-interval-1',
    confidenceIntervalDigest: digest('skill-confidence-interval'),
    componentAblationEventIds: [
      (assignments[4] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>).event_id,
    ],
    compatibilityEventIds: compatibility.map((event) => event.event_id),
    issueReceiptRef: 'receipt:skill-certificate-1',
    issuedAt: TIMESTAMP,
    expiresAt: '2026-08-23T09:00:00.000Z',
  });
  return {
    events: Object.freeze(events),
    planned,
    assignments: Object.freeze(assignments),
    started: Object.freeze(started),
    discovered: Object.freeze(discovered),
    loaded: Object.freeze(loaded),
    exposed: Object.freeze(exposed),
    milestones: Object.freeze(milestones),
    finished: Object.freeze(finished),
    outcomes: Object.freeze(outcomes),
    gold: Object.freeze(gold),
    scores: Object.freeze(scores),
    compatibility: Object.freeze(compatibility),
    negativeTransfer,
    security,
    runClosed,
    certificateIssued,
  };
}

function skillOrigin<TStem extends SkillBenchmarkSpecificEventStem>(
  event: SkillBenchmarkEventEnvelope<TStem>,
) {
  return {
    eventStem: event.payload.stem,
    eventId: event.event_id,
    payloadDigest: event.payload.payloadDigest,
  };
}

function skillBase<TStem extends SkillBenchmarkSpecificEventStem>(
  artifactId: string,
  event: SkillBenchmarkEventEnvelope<TStem>,
) {
  return {
    schemaVersion: 'skill-benchmark-artifact@1',
    artifactId,
    dependencyReferences: [],
    originEvent: skillOrigin(event),
    producerVersion: 'skill-benchmark-certificate-tests@1',
    locator: locator(`skill-${artifactId}`),
  };
}

function commonReference(
  common: CommonScenario,
  kind: DeepImprovementCommonSealedArtifactBinding['artifactKind'],
): SealedArtifactReference {
  const match = common.bindings.find((binding) => binding.artifactKind === kind);
  if (match === undefined) throw new Error(`Missing common reference ${kind}`);
  return match.reference;
}

async function sealSkillEvidence(
  common: CommonScenario,
  mode: SkillModeEvents,
): Promise<readonly SkillBenchmarkSealedArtifactBinding[]> {
  const evaluator = commonReference(common, DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE);
  const canary = commonReference(common, DeepImprovementCommonArtifactKinds.CANARY_EPOCH);
  const promotion = commonReference(common, DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE);
  const designMaterial: SkillBenchmarkBenchmarkDesignMaterial = {
    ...skillBase('design-1', mode.planned),
    randomizationSeed: 42,
    replicateCount: SKILL_ARMS.length,
    blockingFactorCodes: ['task-family', 'executor'],
    treatmentArms: SKILL_ARMS,
    assignmentPolicyVersion: 'benchmark-design@1',
    registryDigest: digest('skill-registry'),
    workloadDigest: digest('skill-workload'),
    designCellDigests: SKILL_ARMS.map((arm) => digest(`skill-cell-${arm}`)),
  };
  const design = await sealSkillBenchmarkArtifact(
    common.store,
    SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    designMaterial,
  );
  const bundleMaterial: SkillBenchmarkSkillBundleSnapshotMaterial = {
    ...skillBase('skill-bundle-1', mode.discovered[0] as SkillBenchmarkEventEnvelope<'skill_benchmark.skill_discovered'>),
    bundleDigest: digest('skill-bundle'),
    skillTreeDigest: digest('skill-tree'),
    packageManifestDigest: digest('skill-package'),
    resourceManifestDigest: digest('skill-resources'),
    resourceDigests: [digest('skill-resource-1')],
    resourceClasses: ['instruction'],
    permissionDigest: digest('skill-permission'),
    dependencyCompatibilityDigest: digest('skill-dependency'),
    registryDigest: digest('skill-registry'),
    visibilityCommitmentDigest: digest('skill-visibility'),
  };
  const bundle = await sealSkillBenchmarkArtifact(
    common.store,
    SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
    bundleMaterial,
  );
  const assignments: SkillBenchmarkSealedArtifactBinding[] = [];
  const exposures: SkillBenchmarkSealedArtifactBinding[] = [];
  const goldBindings: SkillBenchmarkSealedArtifactBinding[] = [];
  const scoreBindings: SkillBenchmarkSealedArtifactBinding[] = [];
  for (const [index, identity] of SKILL_IDENTITIES.entries()) {
    const assignmentMaterial: SkillBenchmarkRunAssignmentMaterial = {
      ...skillBase(
        identity.assignmentId,
        mode.assignments[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>,
      ),
      designCellId: `cell-${index + 1}`,
      treatmentArm: SKILL_ARMS[index] as SkillBenchmarkTreatmentArm,
      randomizationSeed: 42,
      propensity: 1 / SKILL_ARMS.length,
      replicateIndex: index + 1,
      pairedReplicateId: `pair-${index + 1}`,
      taskRef: `task:${index + 1}`,
      taskDigest: digest(`skill-task-${index + 1}`),
      skillBundleRef: bundleMaterial.artifactId,
      skillBundleDigest: bundleMaterial.bundleDigest,
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: digest('skill-executor'),
      environmentRef: 'environment:snapshot-1',
      environmentDigest: digest('skill-environment'),
      toolDigest: digest('skill-tool'),
      permissionDigest: digest('skill-permission'),
      dependencyDigest: digest('skill-dependency'),
      registryDigest: digest('skill-registry'),
      workloadDigest: digest('skill-workload'),
      evaluatorEpochId: EVALUATION_EPOCH_ID,
      evaluatorCapsuleReference: evaluator,
    };
    assignments.push(await sealSkillBenchmarkArtifact(
      common.store,
      SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
      assignmentMaterial,
    ));
    const goldMaterial: SkillBenchmarkScenarioGoldManifestMaterial = {
      ...skillBase(
        `gold-${index + 1}`,
        mode.gold[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>,
      ),
      scenarioId: identity.scenarioId,
      taskRecipeDigest: digest(`skill-task-${index + 1}`),
      constraintSetDigest: digest(`skill-constraints-${index + 1}`),
      deterministicCheckSetDigest: digest(`skill-deterministic-${index + 1}`),
      dynamicReferenceSetDigest: digest(`skill-dynamic-${index + 1}`),
      negativeControlSetDigest: digest(`skill-negative-control-${index + 1}`),
      goldPolicy: 'scored',
      goldProvenanceRef: `provenance:gold-${index + 1}`,
      goldProvenanceDigest: digest(`skill-gold-provenance-${index + 1}`),
      expectedCoverageRatio: 1,
      mutationSensitivityRef: `mutation:gold-${index + 1}`,
      mutationSensitivityDigest: digest(`skill-mutation-${index + 1}`),
      hiddenOracleCommitmentDigest: digest(`skill-hidden-${index + 1}`),
      integrityStatus: 'accepted',
    };
    goldBindings.push(await sealSkillBenchmarkArtifact(
      common.store,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
      goldMaterial,
    ));
  }
  for (const [index, identity] of SKILL_IDENTITIES.entries()) {
    const assignment = assignments[index] as SkillBenchmarkSealedArtifactBinding;
    const exposureMaterial: SkillBenchmarkExposureObservationMaterial = {
      ...skillBase(
        `exposure-${index + 1}`,
        mode.exposed[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.resource_exposed'>,
      ),
      assignmentId: identity.assignmentId,
      assignmentDigest: assignment.reference.content_digest,
      bundleDigest: bundleMaterial.bundleDigest,
      evaluatorEpochId: EVALUATION_EPOCH_ID,
      discoveryEvidenceRef: `evidence:discovery-${index + 1}`,
      discoveryEvidenceDigest: digest(`skill-discovery-${index + 1}`),
      loadingEvidenceRef: `evidence:loading-${index + 1}`,
      loadingEvidenceDigest: digest(`skill-loading-${index + 1}`),
      invocationEvidenceRef: `evidence:invocation-${index + 1}`,
      invocationEvidenceDigest: digest(`skill-invocation-${index + 1}`),
      resourceCanaryRef: `canary:resource-${index + 1}`,
      resourceCanaryDigest: digest(`resource-canary-${index + 1}`),
      canaryStatus: 'clean',
      keyPointCoverageDigest: digest(`skill-key-points-${index + 1}`),
      keyPointOrderDigest: digest(`skill-key-order-${index + 1}`),
      milestoneEvidenceDigest: digest(`skill-milestone-${index + 1}`),
      finalArtifactRef: `artifact:final-${index + 1}`,
      finalArtifactDigest: digest(`skill-final-state-${index + 1}`),
      costMicrounits: 25,
      latencyMs: 1_200,
      tokenCount: 500,
      securityProbeDigest: digest('skill-security-evidence'),
      visibilityStatus: 'downstream',
      canaryEpochReference: canary,
    };
    exposures.push(await sealSkillBenchmarkArtifact(
      common.store,
      SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
      exposureMaterial,
    ));
    const scoreMaterial: SkillBenchmarkCausalScoreObservationMaterial = {
      ...skillBase(
        `score-${index + 1}`,
        mode.scores[index] as SkillBenchmarkEventEnvelope<'skill_benchmark.score_observed'>,
      ),
      assignmentId: identity.assignmentId,
      assignmentDigest: assignment.reference.content_digest,
      outcomeRef: `outcome:scenario-${index + 1}`,
      outcomeDigest: digest(`skill-outcome-${index + 1}`),
      scenarioGoldManifestReference: (goldBindings[index] as SkillBenchmarkSealedArtifactBinding).reference,
      evaluatorCapsuleReference: evaluator,
      canaryEpochReference: canary,
      rawOutputRef: `artifact:raw-${index + 1}`,
      rawOutputDigest: digest(`skill-raw-${index + 1}`),
      deterministicResultsRef: `results:deterministic-${index + 1}`,
      deterministicResultsDigest: digest(`skill-deterministic-results-${index + 1}`),
      dynamicReferenceResultsRef: `results:dynamic-${index + 1}`,
      dynamicReferenceResultsDigest: digest(`skill-dynamic-results-${index + 1}`),
      constraintCoverageRef: `coverage:constraints-${index + 1}`,
      constraintCoverageDigest: digest(`skill-coverage-${index + 1}`),
      rawScoreAxes: [{
        dimensionCode: 'correctness',
        rawScore: 0.8,
        measurementRef: `measurement:correctness-${index + 1}`,
        measurementDigest: digest(`skill-correctness-${index + 1}`),
      }],
      inputTokenCount: 300,
      outputTokenCount: 200,
      totalTokenCount: 500,
      latencyMs: 1_200,
      costMicrounits: 25,
      compatibilityStatus: 'compatible',
      negativeTransferEvidenceDigest: digest('skill-negative-transfer'),
      securityProbeEvidenceDigest: digest('skill-security-evidence'),
      goldPolicy: 'scored',
      goldIntegrityStatus: 'accepted',
      numeratorEligible: true,
      evaluatorEpochId: EVALUATION_EPOCH_ID,
    };
    scoreBindings.push(await sealSkillBenchmarkArtifact(
      common.store,
      SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      scoreMaterial,
    ));
  }
  const certificateMaterial: SkillBenchmarkEffectCertificateInputMaterial = {
    ...skillBase('certificate-input-1', mode.certificateIssued),
    evidenceSetDigest: digest('skill-evidence-set'),
    pairedDeltaDigests: [digest('skill-paired-delta')],
    confidenceIntervalRef: 'artifact:confidence-interval-1',
    confidenceIntervalDigest: digest('skill-confidence-interval'),
    componentAblationDigests: [digest('skill-component-ablation')],
    compatibilitySliceDigests: [digest('skill-compatibility-slice')],
    negativeTransferDigests: [digest('skill-negative-transfer')],
    costSecurityDeltaDigest: digest('skill-cost-security'),
    validityDomain: {
      taskSetDigest: digest('skill-task-set'),
      skillBundleDigest: digest('skill-bundle'),
      registryDigest: digest('skill-registry'),
      executorDigest: digest('skill-executor'),
      environmentDigest: digest('skill-environment'),
      dependencyDigest: digest('skill-dependency'),
      workloadDigest: digest('skill-workload'),
      validityPolicyVersion: 'validity-policy@1',
    },
    expiryTriggers: ['bundle-drift', 'evaluator-drift'],
    withheldEvidenceDigests: [],
    evaluatorEpochId: EVALUATION_EPOCH_ID,
    evaluatorCapsuleReference: evaluator,
    canaryEpochReference: canary,
    promotionEvidenceReference: promotion,
  };
  const certificateInput = await sealSkillBenchmarkArtifact(
    common.store,
    SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT,
    certificateMaterial,
  );
  return Object.freeze([
    design,
    bundle,
    ...assignments,
    ...exposures,
    ...goldBindings,
    ...scoreBindings,
    certificateInput,
  ]);
}

function skillReplayComponentRegistry(): ReplayComponentRegistry<SkillReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<SkillReplayProjection>(
    Object.values(SkillBenchmarkWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
      reduce: (state: Readonly<SkillReplayProjection>, event) => (
        reduceSkillBenchmarkVerifiedEvent(
          { event } as unknown as VerifiedLedgerEvent,
          state,
        ).state as SkillReplayProjection
      ),
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: SKILL_BENCHMARK_REDUCER_ID,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    projectionSchemaVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

async function authorizedSkillLedger(events: readonly SkillBenchmarkLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(skillBenchmarkEventDefinitions());
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('skill-ledger');
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
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareSkillBenchmarkEvent({
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
    } as SkillBenchmarkEventInput<SkillBenchmarkEventStem>, registry);
    const request = await createFixtureRequest(
      ledger,
      prepared,
      policies,
      `skill-certificate-request-${index + 1}`,
    );
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new Error(`Expected Skill Benchmark fixture authorization at ${index}`);
    }
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
    ownerId: 'skill-benchmark-certificate-writer',
    correlationId: 'skill-benchmark-certificate-writer',
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
    authorizationContext: (event) => ({
      mode: 'skill-benchmark',
      priorStateVersion: 'skill-benchmark-certificate-state@1',
      priorStateFingerprint: digest('skill-benchmark-certificate-state'),
      actorId: 'skill-benchmark-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: SkillBenchmarkTransitionReceiptSubstrate = {
    writer,
    registry,
    producer: { name: 'skill-benchmark-certificate-tests', version: '1' },
  };
  return { ledger, registry, receiptSubstrate };
}

function skillTransitionInputs(
  mode: SkillModeEvents,
  bindings: readonly SkillBenchmarkSealedArtifactBinding[],
): readonly SkillBenchmarkTransitionReceiptInput[] {
  const references = (kind: SkillBenchmarkArtifactKind) => bindings
    .filter((binding) => binding.artifactKind === kind)
    .map((binding) => binding.reference.qualified_digest);
  const design = references(SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN)[0] as string;
  const bundle = references(SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT)[0] as string;
  const assignments = references(SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT);
  const exposures = references(SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION);
  const gold = references(SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST);
  const scores = references(SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION);
  const certificateInput = references(SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT)[0] as string;
  const make = (
    transitionKind: SkillBenchmarkTransitionReceiptInput['transitionKind'],
    resultEventId: string,
    inputs: readonly string[],
    outputs: readonly string[],
    evidence: readonly string[] = [],
    suffix = '',
  ): SkillBenchmarkTransitionReceiptInput => ({
    transitionKind,
    logicalOperationId: `logical:${transitionKind}${suffix}`,
    effectIdempotencyKey: `effect:${transitionKind}${suffix}`,
    attemptNumber: 1,
    resultEventId,
    inputArtifactQualifiedDigests: inputs,
    outputArtifactQualifiedDigests: outputs,
    evidenceArtifactQualifiedDigests: evidence,
  });
  return Object.freeze([
    make(SkillBenchmarkTransitionKinds.DESIGN_PLANNED, mode.planned.event_id, [], [design]),
    ...mode.assignments.map((event, index) => make(
      SkillBenchmarkTransitionKinds.TREATMENT_ASSIGNED,
      event.event_id,
      [design, bundle],
      [assignments[index] as string],
      [],
      `:${index + 1}`,
    )),
    make(SkillBenchmarkTransitionKinds.SCENARIO_STARTED, mode.started[0]?.event_id as string, [assignments[0] as string], []),
    make(SkillBenchmarkTransitionKinds.SKILL_DISCOVERED, mode.discovered[0]?.event_id as string, [design], [bundle]),
    make(SkillBenchmarkTransitionKinds.SKILL_LOADED, mode.loaded[0]?.event_id as string, [bundle], []),
    make(SkillBenchmarkTransitionKinds.SKILL_INVOKED, mode.events.find(
      (event) => event.payload.stem === 'skill_benchmark.skill_invoked',
    )?.event_id as string, [bundle], []),
    ...mode.exposed.map((event, index) => make(
      SkillBenchmarkTransitionKinds.RESOURCE_EXPOSED,
      event.event_id,
      [assignments[index] as string, bundle],
      [exposures[index] as string],
      [],
      `:${index + 1}`,
    )),
    make(SkillBenchmarkTransitionKinds.MILESTONE_OBSERVED, mode.milestones[0]?.event_id as string, [exposures[0] as string], []),
    make(SkillBenchmarkTransitionKinds.TRAJECTORY_RECORDED, mode.events.find(
      (event) => event.payload.stem === 'skill_benchmark.trajectory_recorded',
    )?.event_id as string, [exposures[0] as string], []),
    make(SkillBenchmarkTransitionKinds.SCENARIO_FINISHED, mode.finished[0]?.event_id as string, [assignments[0] as string], []),
    make(SkillBenchmarkTransitionKinds.OUTCOME_RECORDED, mode.outcomes[0]?.event_id as string, [exposures[0] as string], []),
    ...mode.gold.map((event, index) => make(
      SkillBenchmarkTransitionKinds.GOLD_INTEGRITY_RECORDED,
      event.event_id,
      [assignments[index] as string],
      [gold[index] as string],
      [],
      `:${index + 1}`,
    )),
    ...mode.scores.map((event, index) => make(
      SkillBenchmarkTransitionKinds.SCORE_OBSERVED,
      event.event_id,
      [assignments[index] as string, exposures[index] as string, gold[index] as string],
      [scores[index] as string],
      [],
      `:${index + 1}`,
    )),
    make(SkillBenchmarkTransitionKinds.COMPATIBILITY_OBSERVED, mode.compatibility[0]?.event_id as string, [assignments[0] as string, exposures[0] as string], []),
    make(SkillBenchmarkTransitionKinds.NEGATIVE_TRANSFER_OBSERVED, mode.negativeTransfer.event_id, [scores[0] as string], []),
    make(SkillBenchmarkTransitionKinds.SECURITY_PROBE_RECORDED, mode.security.event_id, [exposures[0] as string], []),
    make(SkillBenchmarkTransitionKinds.RUN_CLOSED, mode.runClosed.event_id, [scores[0] as string], []),
    make(
      SkillBenchmarkTransitionKinds.CERTIFICATE_ISSUED,
      mode.certificateIssued.event_id,
      [scores[0] as string, gold[0] as string],
      [certificateInput],
      [design, bundle, assignments[0] as string, exposures[0] as string],
    ),
  ]);
}

async function skillScenario(
  options: { readonly blockedGold?: boolean } = {},
): Promise<SkillScenario> {
  const common = await scenario();
  const normalized = common.events.find(
    (event) => event.payload.stem === 'deep_improvement_common.evaluation_normalized',
  );
  if (normalized === undefined) throw new Error('Missing common normalized event');
  const mode = buildSkillModeEvents(normalized, options);
  const events = Object.freeze([
    ...common.events,
    ...mode.events,
  ] as SkillBenchmarkLedgerEvent[]);
  const { ledger, registry, receiptSubstrate } = await authorizedSkillLedger(events);
  const bindings = await sealSkillEvidence(common, mode);
  const initialState = createSkillBenchmarkProjectionState() as SkillReplayProjection;
  const replay: SkillBenchmarkOfflineVerificationInput<SkillReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: skillReplayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: SKILL_BENCHMARK_REDUCER_ID,
      reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
      projectionSchemaVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<SkillReplayProjection>,
  };
  const bundle = await issueSkillBenchmarkRunCertificate({
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: common.store,
    artifactBindings: bindings,
    transitionReceipts: skillTransitionInputs(mode, bindings),
    replay,
    commonVerification: common.verification as unknown as
      DeepImprovementCommonOfflineVerificationInput<JsonObject>,
    certificationProfile: common.verification.providers.inspect()[0]!,
    providers: common.verification.providers,
    receiptSubstrate,
    issuer: 'skill-benchmark-certificate-issuer',
    issuedAt: TIMESTAMP,
    verificationTime: VERIFICATION_TIME,
  });
  return {
    bundle,
    store: common.store,
    bindings,
    events,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: common.store,
      replay,
      commonVerification: common.verification as unknown as
        DeepImprovementCommonOfflineVerificationInput<JsonObject>,
      providers: common.verification.providers,
      verificationTime: VERIFICATION_TIME,
    },
  };
}

let validSkillFixture: Promise<SkillScenario> | null = null;

function validSkillScenario(): Promise<SkillScenario> {
  validSkillFixture ??= skillScenario();
  return validSkillFixture;
}

async function bundleWithDisposition(
  fixture: SkillScenario,
  disposition: 'ABORT' | 'FAIL' | 'INSUFFICIENT_EVIDENCE',
): Promise<SkillBenchmarkCertificateBundle> {
  const body = {
    ...fixture.bundle.certificate.body,
    disposition,
  } as const;
  const certificateDigest = digest(body);
  const currentReceipt = fixture.bundle.certificate.sharedCertificationReceipt;
  const { certification: _certification, ...currentUnsigned } = currentReceipt;
  const resultCode = disposition.toLowerCase().replaceAll('_', '-');
  const unsigned = {
    ...currentUnsigned,
    receipt_id: `skill-benchmark-certificate:${certificateDigest}`,
    boundary_id: `skill-benchmark-certificate-boundary:${certificateDigest}`,
    to_state: resultCode,
    result_event_id: `skill-benchmark-certificate-event:${certificateDigest}`,
    result_event_digest: certificateDigest,
    result_code: resultCode,
    evidence_digest: certificateDigest,
    idempotency_key: `skill-benchmark-certificate:v1:${certificateDigest}`,
  };
  const certification = await certifyBoundaryReceipt(
    unsigned,
    fixture.verification.providers.inspect()[0]!,
    fixture.verification.providers,
  );
  return {
    ...fixture.bundle,
    certificate: {
      body,
      certificateDigest,
      sharedCertificationReceipt: {
        ...unsigned,
        certification,
      },
    },
  };
}

function replaceCertificateClaims(
  scenarioValue: SkillScenario,
  claims: SkillBenchmarkCertificateBundle['certificate']['body']['artifactClaims'],
): SkillBenchmarkCertificateBundle {
  return {
    ...scenarioValue.bundle,
    certificate: {
      ...scenarioValue.bundle.certificate,
      body: {
        ...scenarioValue.bundle.certificate.body,
        artifactClaims: claims,
      },
    },
  };
}

async function materialForBinding(
  scenarioValue: SkillScenario,
  binding: SkillBenchmarkSealedArtifactBinding,
): Promise<Record<string, unknown>> {
  const verified = await scenarioValue.store.readVerified(
    binding.reference,
    binding.artifactKind,
  );
  const capsule = JSON.parse(
    new TextDecoder().decode(Uint8Array.from(verified.bytes)),
  ) as { readonly material: Record<string, unknown> };
  return { ...capsule.material };
}

async function bundleWithBrokenNamedClosure(
  scenarioValue: SkillScenario,
  ruleIndex: number,
  failure: 'fabricated' | 'wrong-kind',
): Promise<SkillBenchmarkCertificateBundle> {
  const rule = SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES[ruleIndex];
  if (rule === undefined) throw new Error(`Missing closure rule ${ruleIndex}`);
  const claims = scenarioValue.bundle.certificate.body.artifactClaims;
  const container = claims.find(
    (claim) => claim.expectedArtifactKind === rule.containingArtifactKind,
  );
  const wrongKind = claims.find(
    (claim) => claim.expectedArtifactKind === SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
  );
  if (container === undefined || wrongKind === undefined) {
    throw new Error('Missing named-closure test claim');
  }
  const material = await materialForBinding(scenarioValue, container.binding);
  material[rule.referenceField] = failure === 'fabricated'
    ? `never-sealed-${ruleIndex}`
    : 'design-1';
  material[rule.digestField] = failure === 'fabricated'
    ? digest(`never-sealed-${ruleIndex}`)
    : wrongKind.contentDigest;
  let replacement: SkillBenchmarkSealedArtifactBinding;
  if (rule.containingArtifactKind === SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION) {
    replacement = await sealSkillBenchmarkArtifact(
      scenarioValue.store,
      SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
      material as unknown as SkillBenchmarkExposureObservationMaterial,
    );
  } else if (
    rule.containingArtifactKind === SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION
  ) {
    replacement = await sealSkillBenchmarkArtifact(
      scenarioValue.store,
      SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
      material as unknown as SkillBenchmarkCausalScoreObservationMaterial,
    );
  } else {
    replacement = await sealSkillBenchmarkArtifact(
      scenarioValue.store,
      SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
      material as unknown as SkillBenchmarkRunAssignmentMaterial,
    );
  }
  const replacementBindings = new Map([
    [container.binding.reference.qualified_digest, replacement],
  ]);
  if (rule.containingArtifactKind === SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT) {
    const assignmentId = material.artifactId;
    for (const dependentKind of [
      SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
      SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
    ] as const) {
      let dependent: typeof claims[number] | undefined;
      let dependentMaterial: Record<string, unknown> | undefined;
      for (const candidate of claims.filter(
        (claim) => claim.expectedArtifactKind === dependentKind,
      )) {
        const candidateMaterial = await materialForBinding(
          scenarioValue,
          candidate.binding,
        );
        if (candidateMaterial.assignmentId === assignmentId) {
          dependent = candidate;
          dependentMaterial = candidateMaterial;
          break;
        }
      }
      if (dependent === undefined || dependentMaterial === undefined) {
        throw new Error(`Missing dependent ${dependentKind}`);
      }
      dependentMaterial.assignmentDigest = replacement.reference.content_digest;
      const dependentReplacement = dependentKind
        === SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION
        ? await sealSkillBenchmarkArtifact(
            scenarioValue.store,
            SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
            dependentMaterial as unknown as SkillBenchmarkExposureObservationMaterial,
          )
        : await sealSkillBenchmarkArtifact(
            scenarioValue.store,
            SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
            dependentMaterial as unknown as SkillBenchmarkCausalScoreObservationMaterial,
          );
      replacementBindings.set(
        dependent.binding.reference.qualified_digest,
        dependentReplacement,
      );
    }
  }
  return replaceCertificateClaims(
    scenarioValue,
    Object.freeze(claims.map((claim) => {
      const binding = replacementBindings.get(
        claim.binding.reference.qualified_digest,
      );
      return binding === undefined ? claim : { ...claim, binding };
    })),
  );
}

async function bundleWithUnauthorizedOrigin(
  scenarioValue: SkillScenario,
): Promise<SkillBenchmarkCertificateBundle> {
  const claims = scenarioValue.bundle.certificate.body.artifactClaims;
  const design = claims.find(
    (claim) => claim.expectedArtifactKind === SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
  );
  if (design === undefined) throw new Error('Missing design claim');
  const material = await materialForBinding(scenarioValue, design.binding);
  const originEvent = material.originEvent as Record<string, unknown>;
  material.originEvent = { ...originEvent, eventId: 'event-never-authorized' };
  const replacement = await sealSkillBenchmarkArtifact(
    scenarioValue.store,
    SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    material as unknown as SkillBenchmarkBenchmarkDesignMaterial,
  );
  return replaceCertificateClaims(
    scenarioValue,
    Object.freeze(claims.map((claim) => (
      claim === design ? { ...claim, binding: replacement } : claim
    ))),
  );
}

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('skill benchmark certificates', () => {
  it('publishes the complete deferred plain-digest closure map', () => {
    expect(SKILL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES).toEqual([
      {
        containingArtifactKind: SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
        referenceField: 'assignmentId',
        digestField: 'assignmentDigest',
        expectedArtifactKind: SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
      },
      {
        containingArtifactKind: SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION,
        referenceField: 'assignmentId',
        digestField: 'assignmentDigest',
        expectedArtifactKind: SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
      },
      {
        containingArtifactKind: SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT,
        referenceField: 'skillBundleRef',
        digestField: 'skillBundleDigest',
        expectedArtifactKind: SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT,
      },
    ]);
  });

  it('issues and independently verifies a complete additive-dark bundle', async () => {
    const fixture = await validSkillScenario();
    const result = await verifySkillBenchmarkCertificateOffline(fixture.verification);
    expect(result).toMatchObject({
      verdict: 'valid',
      certificateDigest: fixture.bundle.certificate.certificateDigest,
    });
  }, 240_000);

  it('rejects a non-terminal run with pending gold before trusted issuance', async () => {
    await expect(skillScenario({ blockedGold: true })).rejects.toMatchObject({
      code: SkillBenchmarkCertificateFailureCodes.LIFECYCLE_INVALID,
      evidenceLocation: 'certificate:lifecycle',
    });
  }, 240_000);

  it('rejects a coherently signed non-PASS disposition during offline verification', async () => {
    const fixture = await validSkillScenario();
    const bundle = await bundleWithDisposition(fixture, 'FAIL');
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'incomplete',
      code: SkillBenchmarkCertificateFailureCodes.INCOMPLETE_RUN,
      evidenceLocation: 'certificate:disposition',
    });
  });

  it('returns unverifiable when a separate offline store lacks referenced bytes', async () => {
    const fixture = await validSkillScenario();
    const prunedStore = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('pruned-skill-artifacts'),
    });
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      artifactStore: prunedStore,
    });
    expect(result).toMatchObject({
      verdict: 'unverifiable',
      code: SkillBenchmarkCertificateFailureCodes.ARTIFACT_MISSING,
    });
  });

  it('rejects sealed artifact evidence from a different evaluator epoch', async () => {
    const fixture = await validSkillScenario();
    const artifactKind = SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT;
    const claim = fixture.bundle.certificate.body.artifactClaims.find(
      (candidate) => candidate.expectedArtifactKind === artifactKind,
    );
    if (claim === undefined) throw new Error('Missing effect certificate input claim');
    const material = await materialForBinding(fixture, claim.binding);
    const mismatchedBinding = await sealSkillBenchmarkArtifact(
      fixture.store,
      artifactKind,
      {
        ...material,
        evaluatorEpochId: 'evaluation-epoch-stale',
      } as unknown as SkillBenchmarkEffectCertificateInputMaterial,
    );
    const bundle = replaceCertificateClaims(
      fixture,
      Object.freeze(fixture.bundle.certificate.body.artifactClaims.map((candidate) => (
        candidate === claim
          ? {
              ...candidate,
              binding: mismatchedBinding,
              descriptorDigest: mismatchedBinding.reference.descriptor_digest,
              contentDigest: mismatchedBinding.reference.content_digest,
              canonicalizationVersion: mismatchedBinding.reference.canonicalization_version,
            }
          : candidate
      ))),
    );
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.EPOCH_MISMATCH,
    });
  });

  it.each([
    [0, 'fabricated'],
    [0, 'wrong-kind'],
    [1, 'fabricated'],
    [1, 'wrong-kind'],
    [2, 'fabricated'],
    [2, 'wrong-kind'],
  ] as const)(
    'rejects closure rule %i with a %s sealed replacement through the offline verifier',
    async (ruleIndex, failure) => {
      const fixture = await validSkillScenario();
      const bundle = await bundleWithBrokenNamedClosure(fixture, ruleIndex, failure);
      const result = await verifySkillBenchmarkCertificateOffline({
        ...fixture.verification,
        bundle,
      });
      expect(result).toMatchObject({
        verdict: 'invalid',
        code: failure === 'wrong-kind'
          ? SkillBenchmarkCertificateFailureCodes.ARTIFACT_WRONG_KIND
          : SkillBenchmarkCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      });
    },
  );

  it('rejects a forged artifact-claim binding at verifier time', async () => {
    const fixture = await validSkillScenario();
    const claims = fixture.bundle.certificate.body.artifactClaims;
    const exposure = claims.find(
      (claim) => claim.expectedArtifactKind === SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION,
    );
    const design = claims.find(
      (claim) => claim.expectedArtifactKind === SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN,
    );
    if (exposure === undefined || design === undefined) throw new Error('Missing forged-binding fixture');
    const bundle = replaceCertificateClaims(
      fixture,
      Object.freeze(claims.map((claim) => (
        claim === exposure ? { ...claim, binding: design.binding } : claim
      ))),
    );
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result.verdict).toBe('invalid');
  });

  it('rejects an artifact whose sealed origin never entered the authorized ledger', async () => {
    const fixture = await validSkillScenario();
    const bundle = await bundleWithUnauthorizedOrigin(fixture);
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
    });
  });

  it('rejects reordered receipts through the verifier-owned transition guard', async () => {
    const fixture = await validSkillScenario();
    const receipts = [...fixture.bundle.receipts];
    const first = receipts[0];
    const second = receipts[1];
    if (first === undefined || second === undefined) throw new Error('Missing receipt fixture');
    receipts[0] = second;
    receipts[1] = first;
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle: { ...fixture.bundle, receipts },
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects a broken predecessor receipt chain', async () => {
    const fixture = await validSkillScenario();
    const receipts = fixture.bundle.receipts.map((receipt, index) => (
      index === 1
        ? {
            ...receipt,
            facts: {
              ...receipt.facts,
              predecessorReceiptDigests: [digest('forged-predecessor')],
            },
          }
        : receipt
    ));
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle: { ...fixture.bundle, receipts },
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects mutated certificate artifact claims before trusting their digest', async () => {
    const fixture = await validSkillScenario();
    const claims = fixture.bundle.certificate.body.artifactClaims.map((claim, index) => (
      index === 0 ? { ...claim, contentDigest: digest('mutated-claim') } : claim
    ));
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      bundle: replaceCertificateClaims(fixture, Object.freeze(claims)),
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.ARTIFACT_MUTATED,
    });
  });

  it('rejects stale borne canary evidence in mode-local sealed reads', async () => {
    const fixture = await validSkillScenario();
    const result = await verifySkillBenchmarkCertificateOffline({
      ...fixture.verification,
      verificationTime: '2091-01-01T00:00:00.000Z',
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.ARTIFACT_STALE,
    });
  });

  it('fails closed through the offline verifier for an unsupported bundle shape', async () => {
    const artifactStore = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('invalid-shape'),
    });
    const result = await verifySkillBenchmarkCertificateOffline({
      bundle: {
        bundleVersion: 1,
        certificate: {},
        receipts: [],
        commonBundle: {},
      },
      projectionEvents: [],
      artifactStore,
      replay: {} as SkillBenchmarkOfflineVerificationInput<SkillReplayProjection>['replay'],
      commonVerification: {} as DeepImprovementCommonOfflineVerificationInput<ReplayProjection>,
      providers: providers(),
      verificationTime: VERIFICATION_TIME,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: SkillBenchmarkCertificateFailureCodes.CERTIFICATE_INVALID,
    });
  });

  it('distinguishes an unsupported bundle version from invalid evidence', async () => {
    const artifactStore = createSkillBenchmarkSealedArtifactStore({
      rootDirectory: temporaryRoot('unsupported-version'),
    });
    const result = await verifySkillBenchmarkCertificateOffline({
      bundle: {
        bundleVersion: 2,
        certificate: {},
        receipts: [],
        commonBundle: {},
      },
      projectionEvents: [],
      artifactStore,
      replay: {} as SkillBenchmarkOfflineVerificationInput<SkillReplayProjection>['replay'],
      commonVerification: {} as DeepImprovementCommonOfflineVerificationInput<ReplayProjection>,
      providers: providers(),
      verificationTime: VERIFICATION_TIME,
    });
    expect(result).toMatchObject({
      verdict: 'unsupported',
      code: SkillBenchmarkCertificateFailureCodes.UNSUPPORTED_VERSION,
    });
  });
});
