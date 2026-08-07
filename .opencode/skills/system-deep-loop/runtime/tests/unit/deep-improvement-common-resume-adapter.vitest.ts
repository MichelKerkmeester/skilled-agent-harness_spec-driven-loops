import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

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
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonEventRegistry,
  deepImprovementCommonEventDefinitions,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
  DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
  DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
  createDeepImprovementCommonProjectionState,
  deepImprovementCommonProjectionIntegrityDigest,
  reduceDeepImprovementCommonVerifiedEvent,
} from '../../lib/deep-improvement-common-reducers/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonSealedArtifactStore,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_CONTINUITY_LADDER,
  DEEP_IMPROVEMENT_COMMON_RESUME_ADAPTER_VERSION,
  DeepImprovementCommonResumeAdapter,
  deepImprovementCommonMigrationRegistryDigest,
  deepImprovementCommonResumeFingerprintDigest,
  parseDeepImprovementCommonResumeRequest,
} from '../../lib/deep-improvement-common-resume-adapter/index.js';
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
import type {
  DeepImprovementCommonMigrationRegistry,
  DeepImprovementCommonResumeComponentFact,
  DeepImprovementCommonResumeFingerprint,
  DeepImprovementCommonResumeRequest,
} from '../../lib/deep-improvement-common-resume-adapter/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type {
  CertificationTrustScope,
  EffectConfirmationPayload,
  EffectIntentPayload,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';

type ReplayProjection = DeepImprovementCommonProjectionState & JsonObject;

interface Scenario {
  readonly events: readonly DeepImprovementCommonLedgerEvent[];
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly effectLedger: AppendOnlyLedger;
  readonly effectWriter: AuthorizedEvidenceWriter;
  readonly effectRegistry: ReturnType<typeof createEvidenceControlEventRegistry>;
}

const TIMESTAMP = '2026-07-23T09:00:00.000Z';
const VERIFICATION_TIME = '2026-07-23T09:30:00.000Z';
const REQUEST_TIME = '2026-07-23T09:31:00.000Z';
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
const roots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-improvement-common-resume-${label}-`));
  roots.push(root);
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
    variant: 'agent-improvement' as const,
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
    eventId: `resume-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-resume-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `resume-event-${sequence}`,
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

function happyEvents(): readonly DeepImprovementCommonLedgerEvent[] {
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
      `resume-request-${index + 1}`,
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
    ownerId: 'deep-improvement-resume-writer',
    correlationId: 'deep-improvement-resume-writer',
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
      priorStateVersion: 'deep-improvement-resume-state@1',
      priorStateFingerprint: digest('deep-improvement-resume-state'),
      actorId: 'deep-improvement-resume-writer',
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
    producer: { name: 'deep-improvement-resume-tests', version: '1' },
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

function providers(
  trustScope: CertificationTrustScope = 'durable-cross-resume',
): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-improvement-test-provider',
      key_id: 'deep-improvement-test-key',
      verifier_version: 'verifier@1',
      trust_scope: trustScope,
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

function origin(
  events: readonly DeepImprovementCommonLedgerEvent[],
  stem: DeepImprovementCommonEventStem,
) {
  const event = events.find((candidate) => candidate.payload.stem === stem);
  if (!event) throw new Error(`Missing origin ${stem}`);
  return {
    eventStem: stem,
    eventId: event.event_id,
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
) {
  const store = createDeepImprovementCommonSealedArtifactStore({
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
    originEvent: origin(events, 'deep_improvement_common.evaluation_epoch_sealed'),
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
    sealedAt: TIMESTAMP,
    expiresAt: '2026-07-23T10:00:00.000Z',
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
    unresolvedEvidenceDigests: [],
    vetoEvidenceDigests: [],
    admissibility: 'eligible',
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

function effectHarness(label: string) {
  const rootDirectory = temporaryRoot(`effects-${label}`);
  const effectRegistry = createEvidenceControlEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'effect-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['effect-write'],
    evaluate: () => ({
      verdict: 'allow',
      reasonCode: 'allowed',
      matchedRuleIds: ['effect-write'],
    }),
  }]);
  const effectLedger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: `effects-${label}`,
    auditLedgerId: `effects-${label}-authorization`,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, effectRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: `effects-${label}-authorization`,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, effectLedger, policies);
  const coordinator = new FencedLeaseCoordinator({ rootDirectory });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: effectLedger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: `effect-writer-${label}`,
    correlationId: `effect-correlation-${label}`,
    ttlMs: 300_000,
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
      mode: 'improvement',
      priorStateVersion: 'effect-state@1',
      priorStateFingerprint: digest('effect-state'),
      actorId: 'effect-writer',
      capabilityId: 'effect-write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'effect-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  return { effectLedger, effectWriter, effectRegistry };
}

async function scenario(
  label: string,
  trustScope: CertificationTrustScope = 'durable-cross-resume',
): Promise<Scenario> {
  const events = happyEvents();
  const { ledger, registry, receiptSubstrate } = await authorizedLedger(events);
  const { store, bindings } = await sealedArtifacts(events);
  const certificationProviders = providers(trustScope);
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
    issuer: 'deep-improvement-resume-issuer',
    issuedAt: TIMESTAMP,
    verificationTime: VERIFICATION_TIME,
  });
  const effects = effectHarness(label);
  return {
    events,
    bundle,
    ...effects,
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

function persistedFacts(): readonly DeepImprovementCommonResumeComponentFact[] {
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

function migrationRegistry(
  entries: DeepImprovementCommonMigrationRegistry['entries'] = [],
): DeepImprovementCommonMigrationRegistry {
  const core = {
    registryVersion: 1 as const,
    entries: Object.freeze([...entries]),
  };
  return Object.freeze({
    ...core,
    registryDigest: deepImprovementCommonMigrationRegistryDigest(core),
  });
}

function changedFact(
  facts: readonly DeepImprovementCommonResumeComponentFact[],
  component: DeepImprovementCommonResumeComponentFact['component'],
): readonly DeepImprovementCommonResumeComponentFact[] {
  return Object.freeze(facts.map((fact) => (
    fact.component === component
      ? Object.freeze({
        ...fact,
        version: `${fact.version}.next`,
        digest: digest(`${component}-changed`),
      })
      : fact
  )));
}

function registryFor(
  component: DeepImprovementCommonResumeComponentFact['component'],
  outcome: 'compatible' | 'migrate' | 'pin-old-runtime',
): DeepImprovementCommonMigrationRegistry {
  const prior = persistedFacts().find((fact) => fact.component === component)!;
  const current = changedFact(persistedFacts(), component)
    .find((fact) => fact.component === component)!;
  return migrationRegistry([{
    component,
    fromVersion: prior.version,
    fromDigest: prior.digest,
    toVersion: current.version,
    toDigest: current.digest,
    outcome,
    revision: `${component}-${outcome}@1`,
  }]);
}

function resumeRequest(
  fixture: Scenario,
  currentInputs: readonly DeepImprovementCommonResumeComponentFact[],
  registry: DeepImprovementCommonMigrationRegistry,
): DeepImprovementCommonResumeRequest {
  return {
    runId: RUN_ID,
    idempotencyKey: `resume:${registry.registryDigest}`,
    requestedAt: REQUEST_TIME,
    resumeReason: 'recover the verified prior run',
    currentInputs,
    migrationRegistry: registry,
    lease: {
      runId: RUN_ID,
      leaseId: 'resume-lease-1',
      lineageId: LINEAGE_ID,
      generation: 1,
      deadlineAt: '2026-07-23T10:00:00.000Z',
      remainingMs: 1_740_000,
      certificateDigest: fixture.bundle.certificate.certificateDigest,
      replayFingerprint: fixture.bundle.certificate.body.replayFingerprint,
    },
    checkpoint: null,
    priorRunBundle: fixture.bundle,
  };
}

function adapter(
  fixture: Scenario,
  trustedRegistryDigests: readonly string[],
): DeepImprovementCommonResumeAdapter {
  const { bundle: _bundle, ...verification } = fixture.verification;
  return new DeepImprovementCommonResumeAdapter({
    verification,
    effectLedger: fixture.effectLedger,
    trustedMigrationRegistryDigests: trustedRegistryDigests,
  });
}

function rewriteEvent(
  event: DeepImprovementCommonLedgerEvent,
  overrides: {
    readonly streamId?: string;
    readonly streamSequence?: number;
    readonly causationId?: string | null;
  },
): DeepImprovementCommonLedgerEvent {
  return prepareDeepImprovementCommonEvent({
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
  }, createDeepImprovementCommonEventRegistry()).envelope;
}

async function withReplayEvents(
  fixture: Scenario,
  events: readonly DeepImprovementCommonLedgerEvent[],
): Promise<Scenario> {
  const { ledger, registry } = await authorizedLedger(events);
  return {
    ...fixture,
    events,
    verification: {
      ...fixture.verification,
      projectionEvents: events,
      replay: {
        ...fixture.verification.replay,
        ledger,
        eventRegistry: registry,
        rangeEndSequence: events.length,
      },
    },
  };
}

interface SeededEffect {
  readonly intent: EffectIntentPayload;
  readonly intentEvent: VerifiedLedgerEvent;
  readonly streamId: string;
}

async function appendEffectEvent(
  fixture: Scenario,
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
    occurred_at: REQUEST_TIME,
    recorded_at: REQUEST_TIME,
    producer: { name: 'effect-fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: RUN_ID,
    causation_id: causationId,
    idempotency_key: idempotencyKey,
    payload,
  }, fixture.effectRegistry);
  return (await fixture.effectWriter.append(prepared)).verified;
}

async function seedEffectIntent(
  fixture: Scenario,
  effectKey: string,
): Promise<SeededEffect> {
  const intent: EffectIntentPayload = {
    effect_id: `effect-${digest(effectKey)}`,
    run_id: RUN_ID,
    logical_effect_id: `logical-${effectKey}`,
    effect_type: 'subprocess',
    operation: 'persist-memory',
    target_identity: `target-${effectKey}`,
    input_digest: digest(`input-${effectKey}`),
    safe_metadata: {},
    secret_references: [],
    adapter: {
      adapter_id: `adapter-${effectKey}`,
      adapter_version: 'adapter-v1',
      effect_type: 'subprocess',
      replay_safe: false,
      idempotency_mode: 'postcondition',
      reconciliation: 'none',
    },
    idempotency_key: effectKey,
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: digest(`postcondition-${effectKey}`),
    replay_fingerprint: fixture.bundle.certificate.body.replayFingerprint,
    requested_at: REQUEST_TIME,
  };
  const streamId = `effect-${RUN_ID}-${effectKey}`;
  const intentEvent = await appendEffectEvent(
    fixture,
    EFFECT_INTENT_EVENT_TYPE,
    `effect-intent-${digest(effectKey)}`,
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
    confirmation_id: `effect-confirmation-${digest(seeded.intent.idempotency_key)}`,
    effect_id: seeded.intent.effect_id,
    intent_event_id: seeded.intentEvent.event.effective.envelope.event_id,
    intent_event_digest: seeded.intentEvent.event.stored.digest,
    idempotency_key: seeded.intent.idempotency_key,
    adapter: seeded.intent.adapter,
    external_receipt_digest: digest('external-receipt'),
    postcondition_digest: seeded.intent.expected_postcondition_digest,
    output_digest: digest('effect-output'),
    completion_class: 'executed',
    observed_at: REQUEST_TIME,
    safe_result_metadata: {},
    ...overrides,
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('deep improvement common resume adapter', () => {
  it.each([
    {
      label: 'exact-reuse',
      component: null,
      outcome: null,
      expected: 'exact-reuse',
    },
    {
      label: 'compatible',
      component: 'tool',
      outcome: 'compatible',
      expected: 'compatible',
    },
    {
      label: 'migrate',
      component: 'model',
      outcome: 'migrate',
      expected: 'migrate',
    },
    {
      label: 'rebuild-required',
      component: 'target',
      outcome: null,
      expected: 'rebuild-required',
    },
    {
      label: 'blocked',
      component: 'schema',
      outcome: 'pin-old-runtime',
      expected: 'blocked',
    },
  ] as const)(
    'derives the $label disposition from real prior facts',
    async ({ label, component, outcome, expected }) => {
      const fixture = await scenario(`matrix-${label}`);
      const facts = component === null
        ? persistedFacts()
        : changedFact(persistedFacts(), component);
      const registry = component !== null && outcome !== null
        ? registryFor(component, outcome)
        : migrationRegistry();
      const result = await adapter(fixture, [registry.registryDigest]).resume(
        resumeRequest(fixture, facts, registry),
      );
      expect(result.offlineVerification.verdict).toBe('valid');
      expect(result.decision.disposition).toBe(expected);
      expect(result.decision.authority).toBe('dark-evidence-only');
      expect(result.continuity?.currentStep).toBe('terminal-or-blocked');
    },
  );

  it('rejects caller-authored compatibility and an unauthenticated migration registry', async () => {
    const fixture = await scenario('caller-compatibility');
    const assertedRegistry = registryFor('policy', 'compatible');
    expect(() => parseDeepImprovementCommonResumeRequest({
      ...resumeRequest(
        fixture,
        changedFact(persistedFacts(), 'policy'),
        assertedRegistry,
      ),
      compatibilityOutcome: 'compatible',
    })).toThrow(/closed request shape/u);

    const noMigration = migrationRegistry();
    const classified = await adapter(
      fixture,
      [noMigration.registryDigest],
    ).resume(
      resumeRequest(
        fixture,
        changedFact(persistedFacts(), 'policy'),
        noMigration,
      ),
    );
    expect(classified.decision.disposition).toBe('rebuild-required');
    expect(classified.decision.compatibility.find(
      (entry) => entry.component === 'policy',
    )?.outcome).toBe('incompatible');

    const unauthenticated = await adapter(fixture, []).resume(
      resumeRequest(
        fixture,
        changedFact(persistedFacts(), 'policy'),
        assertedRegistry,
      ),
    );
    expect(unauthenticated.decision.disposition).toBe('blocked');
    expect(unauthenticated.decision.compatibility.find(
      (entry) => entry.component === 'policy',
    )?.outcome).toBe('compatible');
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
      const fixture = await scenario(`fingerprint-${component}`);
      const registry = migrationRegistry();
      const result = await adapter(fixture, [registry.registryDigest]).resume(
        resumeRequest(
          fixture,
          changedFact(persistedFacts(), component),
          registry,
        ),
      );
      expect(result.decision.disposition).toBe('rebuild-required');
      expect(result.decision.persistedFingerprint?.finalDigest)
        .not.toBe(result.decision.currentFingerprint?.finalDigest);
      expect(result.decision.compatibility.find(
        (entry) => entry.component === component,
      )?.outcome).toBe('incompatible');
    },
  );

  it('commits reducer, adapter, and codec versions into the resume fingerprint', async () => {
    const fixture = await scenario('fingerprint-version-breadth');
    const registry = migrationRegistry();
    const result = await adapter(fixture, [registry.registryDigest]).resume(
      resumeRequest(fixture, persistedFacts(), registry),
    );
    const fingerprint = result.decision.currentFingerprint;
    expect(fingerprint).not.toBeNull();
    if (fingerprint === null) throw new Error('Expected a current fingerprint');
    expect(fingerprint).toMatchObject({
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      adapterVersion: DEEP_IMPROVEMENT_COMMON_RESUME_ADAPTER_VERSION,
      codecVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
    });
    for (const field of [
      'reducerVersion',
      'adapterVersion',
      'codecVersion',
    ] as const) {
      const changed: DeepImprovementCommonResumeFingerprint = {
        ...fingerprint,
        [field]: `${fingerprint[field]}.changed`,
      };
      expect(deepImprovementCommonResumeFingerprintDigest(changed))
        .not.toBe(fingerprint.finalDigest);
    }
  });

  it.each([
    {
      label: 'intent event digest',
      override: { intent_event_digest: 'a'.repeat(64) },
    },
    {
      label: 'expected postcondition',
      override: { postcondition_digest: digest('forged-postcondition') },
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
      const fixture = await scenario(`forged-effect-${label.replaceAll(' ', '-')}`);
      const seeded = await seedEffectIntent(
        fixture,
        `forged-confirmation-${label.replaceAll(' ', '-')}`,
      );
      const forged = confirmationFor(seeded, override);
      expect(effectConfirmationBindsIntent(
        forged,
        seeded.intent,
        seeded.intentEvent.event.effective.envelope.event_id,
        seeded.intentEvent.event.stored.digest,
      )).toBe(false);
      await appendEffectEvent(
        fixture,
        EFFECT_CONFIRMATION_EVENT_TYPE,
        forged.confirmation_id,
        seeded.streamId,
        2,
        `${seeded.intent.idempotency_key}:confirmation`,
        forged,
        forged.intent_event_id,
      );
      const registry = migrationRegistry();
      const result = await adapter(fixture, [registry.registryDigest]).resume(
        resumeRequest(fixture, persistedFacts(), registry),
      );
      expect(result.decision.effects).toHaveLength(1);
      expect(result.decision.effects[0]).toMatchObject({
        applicationState: 'unknown',
        disposition: 'blocked',
      });
      expect(result.decision.effects[0]?.evidenceRefs)
        .not.toContain(forged.confirmation_id);
    },
  );

  it('reuses an effect only when the shared seven-fact binding succeeds', async () => {
    const fixture = await scenario('bound-effect');
    const seeded = await seedEffectIntent(fixture, 'bound-confirmation');
    const confirmation = confirmationFor(seeded);
    expect(effectConfirmationBindsIntent(
      confirmation,
      seeded.intent,
      seeded.intentEvent.event.effective.envelope.event_id,
      seeded.intentEvent.event.stored.digest,
    )).toBe(true);
    await appendEffectEvent(
      fixture,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      confirmation.confirmation_id,
      seeded.streamId,
      2,
      `${seeded.intent.idempotency_key}:confirmation`,
      confirmation,
      confirmation.intent_event_id,
    );
    const registry = migrationRegistry();
    const result = await adapter(fixture, [registry.registryDigest]).resume(
      resumeRequest(fixture, persistedFacts(), registry),
    );
    expect(result.decision.effects[0]).toMatchObject({
      applicationState: 'applied',
      disposition: 'reuse',
    });
  });

  it('rejects a self-consistent checkpoint whose cursor skips authenticated history', async () => {
    const fixture = await scenario('checkpoint-cursor');
    const registry = migrationRegistry();
    const request = resumeRequest(fixture, persistedFacts(), registry);
    const first = await adapter(fixture, [registry.registryDigest]).resume(request);
    const checkpoint = first.checkpoint;
    expect(checkpoint).not.toBeNull();
    if (checkpoint === null) throw new Error('Expected a reducer checkpoint');
    const forgedTail = checkpoint.sourceTailSequence - 1;
    const forgedCheckpoint = {
      projection: checkpoint.projection,
      sourceTailSequence: forgedTail,
      integrityDigest: digest({
        projectionDigest:
          deepImprovementCommonProjectionIntegrityDigest(checkpoint.projection),
        sourceTailSequence: forgedTail,
      }),
    };
    const result = await adapter(fixture, [registry.registryDigest]).resume({
      ...request,
      idempotencyKey: 'resume:forged-checkpoint-cursor',
      checkpoint: forgedCheckpoint,
    });
    expect(result.offlineVerification.verdict).toBe('valid');
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('checkpoint-digest-mismatch');
    expect(result.projection).toBeNull();
  });

  it('rejects a certificate frontier that differs from the real ledger tail', async () => {
    const fixture = await scenario('frontier-mismatch');
    const registry = migrationRegistry();
    const body = {
      ...fixture.bundle.certificate.body,
      finalHeadHash: digest('wrong-final-frontier'),
    };
    const certificateDigest = digest(body);
    const priorRunBundle = {
      ...fixture.bundle,
      certificate: {
        ...fixture.bundle.certificate,
        body,
        certificateDigest,
      },
    };
    const result = await adapter(fixture, [registry.registryDigest]).resume({
      ...resumeRequest(fixture, persistedFacts(), registry),
      lease: {
        ...resumeRequest(fixture, persistedFacts(), registry).lease,
        certificateDigest,
      },
      priorRunBundle,
    });
    expect(result.decision.disposition).toBe('rebuild-required');
    expect(result.reasonCodes).toContain('frontier-mismatch');
    expect(result.authenticatedTail?.finalHeadHash)
      .not.toBe(body.finalHeadHash);
  });

  it.each([
    {
      label: 'causal cursor gap',
      rewrite: (event: DeepImprovementCommonLedgerEvent) => rewriteEvent(event, {
        streamSequence: event.stream_sequence + 1,
      }),
    },
    {
      label: 'stream split',
      rewrite: (event: DeepImprovementCommonLedgerEvent) => rewriteEvent(event, {
        streamId: `${event.stream_id}-split`,
        streamSequence: 1,
        causationId: null,
      }),
    },
  ])(
    'fails closed on an authenticated-history $label',
    async ({ label, rewrite }) => {
      const fixture = await scenario(`history-${label.replaceAll(' ', '-')}`);
      const last = fixture.events.at(-1);
      if (last === undefined) throw new Error('Expected a final event');
      const events = Object.freeze([
        ...fixture.events.slice(0, -1),
        rewrite(last),
      ]);
      const divergent = await withReplayEvents(fixture, events);
      const registry = migrationRegistry();
      const result = await adapter(
        divergent,
        [registry.registryDigest],
      ).resume(
        resumeRequest(divergent, persistedFacts(), registry),
      );
      expect(result.decision.disposition).toBe('rebuild-required');
      expect(result.reasonCodes).toContain('cursor-gap');
      expect(result.projection).toBeNull();
    },
  );

  it('blocks completion evidence certified only for one process', async () => {
    const fixture = await scenario(
      'process-local-certificate',
      'process-local-advisory',
    );
    const registry = migrationRegistry();
    const result = await adapter(fixture, [registry.registryDigest]).resume(
      resumeRequest(fixture, persistedFacts(), registry),
    );
    expect(result.offlineVerification.verdict).not.toBe('valid');
    expect(result.decision.disposition).toBe('blocked');
    expect(result.decision.decisionReason).toMatch(/did not offline-verify/u);
  });

  it('exports the complete common continuity ladder and authenticated tail', async () => {
    expect(DEEP_IMPROVEMENT_COMMON_CONTINUITY_LADDER.map((row) => row.step))
      .toEqual([
        'run-identity',
        'candidate-generation',
        'evaluation',
        'scoring',
        'canary',
        'promotion',
        'terminal-or-blocked',
      ]);
    const fixture = await scenario('continuity-ladder');
    const registry = migrationRegistry();
    const result = await adapter(fixture, [registry.registryDigest]).resume(
      resumeRequest(fixture, persistedFacts(), registry),
    );
    expect(result.continuity?.lastAppliedSeq)
      .toBe(result.authenticatedTail?.streamSequence);
    expect(result.continuity?.seenEventIds)
      .toHaveLength(fixture.events.length);
    expect(result.checkpoint?.sourceTailSequence)
      .toBe(result.authenticatedTail?.streamSequence);
  });

  it('blocks a mutated prior certificate instead of reusing it', async () => {
    const fixture = await scenario('mutated-certificate');
    const registry = migrationRegistry();
    const request = resumeRequest(fixture, persistedFacts(), registry);
    const mutated = {
      ...request,
      priorRunBundle: {
        ...request.priorRunBundle,
        certificate: {
          ...request.priorRunBundle.certificate,
          body: {
            ...request.priorRunBundle.certificate.body,
            serviceVersion: 'forged-service@1',
          },
        },
      },
    };
    const result = await adapter(fixture, [registry.registryDigest]).resume(mutated);
    expect(result.offlineVerification.verdict).not.toBe('valid');
    expect(result.decision.disposition).toBe('blocked');
    expect(result.decision.persistedFingerprint).toBeNull();
  });
});
