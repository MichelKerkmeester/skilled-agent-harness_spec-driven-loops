// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Shadow Parity Tests
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

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepImprovementCommonCertificateFailureCodes,
  DeepImprovementCommonTransitionKinds,
  DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT,
  deriveDeepImprovementCommonReceiptIdentity,
  issueDeepImprovementCommonRunCertificate,
  verifyDeepImprovementCommonCertificateOffline,
} from '../../lib/deep-improvement-common-certificates/index.js';
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
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
  DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT,
  canonicalizeDeepImprovementCommonEventStream,
  compareDeepImprovementCommonEventStreams,
  compileDeepImprovementCommonParityManifest,
  createDeepImprovementCommonModeGateInput,
  createDeepImprovementCommonParityCaseDefinition,
  createDeepImprovementCommonParityExecutors,
  deepImprovementCommonParityInitialStateDigest,
  parseDeepImprovementCommonParityReceipt,
  runDeepImprovementCommonParityCase,
} from '../../lib/deep-improvement-common-shadow-parity/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonSealedArtifactStore,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  EventTypeRegistry,
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
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import { compileParityCaseManifest } from '../../lib/shadow-parity/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
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
import type {
  DeepImprovementCommonParityCaseRun,
  DeepImprovementCommonParityFaultKind,
  DeepImprovementCommonParityFixture,
  DeepImprovementCommonParityFixtureScenario,
  DeepImprovementCommonParityReceipt,
} from '../../lib/deep-improvement-common-shadow-parity/index.js';
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
import type { EventWritePreflight, JsonObject } from '../../lib/event-envelope/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type { ParityCaseCapsule, ParityCaseManifest } from '../../lib/shadow-parity/index.js';

type ReplayProjection = DeepImprovementCommonProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly store: ReturnType<typeof createDeepImprovementCommonSealedArtifactStore>;
}

interface ScenarioOptions {
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
    eventId: `certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-certificate-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
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
      `certificate-request-${index + 1}`,
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
  const events = happyEvents();
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

function bundleWithArtifactBindings(
  bundle: DeepImprovementCommonCertificateBundle,
  bindings: readonly DeepImprovementCommonSealedArtifactBinding[],
): DeepImprovementCommonCertificateBundle {
  return {
    ...bundle,
    certificate: {
      ...bundle.certificate,
      body: {
        ...bundle.certificate.body,
        artifactClaims: bundle.certificate.body.artifactClaims.map((claim) => {
          const binding = bindings.find((candidate) => (
            candidate.artifactKind === claim.binding.artifactKind
          ));
          if (!binding) throw new Error(`Missing replacement ${claim.binding.artifactKind}`);
          return { ...claim, binding };
        }),
      },
    },
  };
}

async function verifyNamedDigestFailure(
  fixture: Scenario,
  namedDigestField: NonNullable<ScenarioOptions['namedDigestField']>,
  namedDigest: NonNullable<ScenarioOptions['namedDigest']>,
) {
  const { store, bindings } = await sealedArtifacts(
    fixture.verification.projectionEvents,
    { namedDigest, namedDigestField },
  );
  return verifyDeepImprovementCommonCertificateOffline({
    ...fixture.verification,
    bundle: bundleWithArtifactBindings(fixture.bundle, bindings),
    artifactStore: store,
  });
}

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

interface ParityArtifactHarness {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

interface ParitySealedBoundary {
  readonly harness: ParityArtifactHarness;
  readonly referenceSet: ArtifactReferenceSet;
}

const PARITY_BASE_SHA = '0360360360360360360360360360360360360360';
const PARITY_AUTHORITY: AuthoritySnapshot =
  Object.freeze({ state: 'shadowing', epoch: 1 });

const FAULT_CASES = Object.freeze([
  { kind: 'drop-event', eventIndex: 5, expectedClass: 'missing' },
  { kind: 'extra-event', eventIndex: 5, expectedClass: 'extra' },
  { kind: 'duplicate-event', eventIndex: 5, expectedClass: 'duplicated' },
  { kind: 'reorder-event', eventIndex: 5, expectedClass: 'reordered' },
  { kind: 'causal-link', eventIndex: 5, expectedClass: 'causal-link' },
  { kind: 'payload', eventIndex: 5, expectedClass: 'payload' },
  { kind: 'receipt', eventIndex: 5, expectedClass: 'receipt' },
  { kind: 'artifact', eventIndex: 5, expectedClass: 'artifact' },
  { kind: 'projection', eventIndex: 5, expectedClass: 'projection' },
  { kind: 'terminal-decision', eventIndex: 15, expectedClass: 'terminal-decision' },
  { kind: 'authorization', eventIndex: 13, expectedClass: 'unauthorized' },
  { kind: 'malformed', eventIndex: 5, expectedClass: 'malformed' },
  { kind: 'unsupported-version', eventIndex: 5, expectedClass: 'unsupported-version' },
  { kind: 'stale', eventIndex: 5, expectedClass: 'stale' },
  { kind: 'reference-digest', eventIndex: 5, expectedClass: 'reference-digest' },
  { kind: 'evaluator-integrity', eventIndex: 8, expectedClass: 'evaluator-integrity' },
  { kind: 'canary', eventIndex: 10, expectedClass: 'canary' },
  { kind: 'promotion', eventIndex: 13, expectedClass: 'promotion' },
  { kind: 'telemetry-gap', eventIndex: 5, expectedClass: 'telemetry-gap' },
  { kind: 'nondeterministic', eventIndex: 5, expectedClass: 'nondeterministic' },
] as const satisfies readonly Readonly<{
  kind: DeepImprovementCommonParityFaultKind;
  eventIndex: number;
  expectedClass: string;
}>[]);

function evaluateParityArtifactPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

function createParityArtifactHarness(): ParityArtifactHarness {
  const rootDirectory = temporaryRoot('parity-sealed');
  const registry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: evaluateParityArtifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'deep-improvement-common-parity-artifacts',
    auditLedgerId: 'deep-improvement-common-parity-artifact-audit',
    authorityProvider: () => PARITY_AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'deep-improvement-common-parity-artifact-audit',
    authorityProvider: () => PARITY_AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'store'),
    now: () => new Date(TIMESTAMP),
  });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`,
      streamId: 'parity-artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-improvement-common-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${event.identity.eventId}`,
      mode: 'improvement',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'deep-improvement-common-parity-test',
      capabilityId: 'artifact-write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: digest({ event: event.canonicalDigest }),
    }),
  };
  return { ledger, store, recorder, registry, nextMetadata };
}

async function sealParityArtifact(
  harness: ParityArtifactHarness,
  artifactKind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    artifactKind,
  );
}

async function createParitySealedBoundary(): Promise<ParitySealedBoundary> {
  const harness = createParityArtifactHarness();
  const fixture = await sealParityArtifact(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'deep-improvement-common', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealParityArtifact(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-improvement-common', authority: 'legacy' },
    'configuration',
  );
  return {
    harness,
    referenceSet: bindVerifiedArtifactReferences([fixture, configuration]),
  };
}

function parityFixture(
  scenarioName: DeepImprovementCommonParityFixtureScenario = 'healthy-progress',
): DeepImprovementCommonParityFixture {
  const provisional: DeepImprovementCommonParityFixture = {
    fixtureId: `fixture-${scenarioName}`,
    scenario: scenarioName,
    variant: 'agent-improvement',
    frozenInput: {
      baseSha: PARITY_BASE_SHA,
      runManifestDigest: digest({ scenarioName, manifest: 1 }),
      evaluatorCapsuleDigest: digest('evaluator-capsule'),
      fixtureSetDigest: digest('fixture-set'),
      baselineDigest: digest('baseline'),
      policyDigest: digest('policy'),
      initialStateDigest: digest('pending-initial-state'),
      configurationDigest: digest({
        mode: 'deep-improvement-common',
        comparator: 1,
      }),
      budgetLease: {
        leaseId: 'lease-1',
        runId: RUN_ID,
        lineageId: LINEAGE_ID,
        generation: 1,
        maxIterations: 4,
        remainingIterations: 3,
        deadlineAt: '2026-07-24T09:00:00.000Z',
      },
    },
    events: happyEvents(),
    expectedTerminalDecision: 'shipped',
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest:
        deepImprovementCommonParityInitialStateDigest(provisional),
    }),
  });
}

function parityCapsule(
  fixture: DeepImprovementCommonParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: fixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: fixture.frozenInput.baseSha }),
    initialStateDigest: fixture.frozenInput.initialStateDigest,
    configurationDigest: fixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-improvement-common-event@1',
      comparator: 'deep-improvement-common-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-improvement-common-bounded-shadow',
  };
}

async function parityCaseRun(
  fixture: DeepImprovementCommonParityFixture,
  sealed: ParitySealedBoundary,
  certificateScenario: Scenario,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepImprovementCommonParityFaultKind;
    eventIndex: number;
  }>,
): Promise<DeepImprovementCommonParityCaseRun> {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: parityCapsule(fixture, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepImprovementCommonParityCaseDefinition(fixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture,
    executors: createDeepImprovementCommonParityExecutors(fixture, fault),
    modeCertificateVerification: {
      input: certificateScenario.verification,
    },
    shadowRootDirectory: join(
      temporaryRoot(`parity-execution-${fixture.fixtureId}`),
      'shadow',
    ),
    protectedRoots: [
      join(temporaryRoot(`parity-authority-${fixture.fixtureId}`), 'legacy-live'),
    ],
    deterministicRuns: 2,
  };
}

function targetedParityManifest(
  fixture: DeepImprovementCommonParityFixture,
): ParityCaseManifest {
  const definition = createDeepImprovementCommonParityCaseDefinition(fixture);
  return compileParityCaseManifest({
    baseSha: PARITY_BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

function independentTransportEvents(
  events: readonly DeepImprovementCommonLedgerEvent[],
  path: 'ledger' | 'legacy',
): readonly DeepImprovementCommonLedgerEvent[] {
  const ids = new Map(events.map(
    (event) => [event.event_id, `${path}-${event.event_id}`],
  ));
  return Object.freeze(events.map((event, index) => Object.freeze({
    ...event,
    event_id: ids.get(event.event_id) as string,
    causation_id: event.causation_id === null
      ? null
      : ids.get(event.causation_id) as string,
    occurred_at: path === 'legacy'
      ? '2026-07-23T09:01:00.000Z'
      : '2026-07-23T09:02:00.000Z',
    recorded_at: path === 'legacy'
      ? '2026-07-23T09:03:00.000Z'
      : '2026-07-23T09:04:00.000Z',
    correlation_id: `transport-${digest({ path, index }).slice(0, 16)}`,
  } as DeepImprovementCommonLedgerEvent)));
}

function receiptWithDigest(
  body: Omit<DeepImprovementCommonParityReceipt, 'receiptDigest'>,
): DeepImprovementCommonParityReceipt {
  return Object.freeze({ ...body, receiptDigest: digest(body) });
}

let sharedCertificateScenario: Scenario;

beforeAll(async () => {
  sharedCertificateScenario = await scenario();
}, 60_000);

describe('deep improvement common shadow parity', () => {
  it('honors only the closed volatility allowlist while pairing independent raw ids', () => {
    const events = happyEvents().slice(0, 7);
    const fingerprints = events.map((_, index) => digest({ projection: index }));
    const legacy = canonicalizeDeepImprovementCommonEventStream(
      independentTransportEvents(events, 'legacy'),
      fingerprints,
    );
    const ledger = canonicalizeDeepImprovementCommonEventStream(
      independentTransportEvents(events, 'ledger'),
      fingerprints,
    );

    expect(DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST.map(
      (entry) => entry.field,
    )).toEqual(['occurred_at', 'recorded_at', 'correlation_id']);
    expect(legacy.map((entry) => entry.eventId)).not.toEqual(
      ledger.map((entry) => entry.eventId),
    );
    expect(compareDeepImprovementCommonEventStreams(
      'fixture-independent-ids',
      legacy,
      ledger,
    )).toEqual([]);

    const semanticChange = ledger.map((entry, index) => (
      index === 5
        ? Object.freeze({ ...entry, stablePayloadDigest: digest('semantic-change') })
        : entry
    ));
    expect(compareDeepImprovementCommonEventStreams(
      'fixture-independent-ids',
      legacy,
      semanticChange,
    ).map((entry) => entry.class)).toEqual(['payload']);
  });

  it('runs distinct real legacy and typed implementations without vacuous self-comparison', () => {
    const executors = createDeepImprovementCommonParityExecutors(
      parityFixture(),
    );
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleImplementation).toBe('modeled-legacy-oracle');
    expect(executors.ledgerImplementation).toBe('typed-ledger-pipeline');
    expect(executors.substrateImportsReal).toBe(true);
  });

  it('compiles the exact shared scenario closure for unchanged downstream reuse', () => {
    expect(DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT).toMatchObject({
      owner: 'deep-improvement-common',
      consumers: [
        'deep-improvement-common',
        'agent-improvement',
        'model-benchmark',
        'skill-benchmark',
      ],
    });
    const fixtures = [
      'healthy-progress',
      'candidate-rejection',
      'score-policy-change',
      'evaluator-epoch-change',
      'canary-leak',
      'canary-drift',
      'promotion-veto',
      'inconclusive-evidence',
      'rollback-target-preservation',
      'crash-resume',
      'duplicate-delivery',
      'unsupported-version',
    ].map((entry) => parityFixture(
      entry as DeepImprovementCommonParityFixtureScenario,
    ));
    const manifest = compileDeepImprovementCommonParityManifest({
      baseSha: PARITY_BASE_SHA,
      fixtures,
    });
    expect(manifest.cases).toHaveLength(12);
    expect(new Set(manifest.cases.map((entry) => entry.contractDigest)).size)
      .toBe(12);
  });

  it('keeps a real zero-diff run green with a real offline-verified certificate', async () => {
    const fixture = parityFixture();
    const certificateScenario = sharedCertificateScenario;
    const sealed = await createParitySealedBoundary();
    const manifest = targetedParityManifest(fixture);
    const outcome = await runDeepImprovementCommonParityCase({
      manifest,
      caseRun: await parityCaseRun(
        fixture,
        sealed,
        certificateScenario,
      ),
    });

    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'green',
      diffDispositions: [],
      certificateStatus: 'issued',
      authorityState: 'legacy-authoritative',
      authorityMutation: false,
      cutoverCertificate: false,
    });
    expect(outcome.receipt.modeCertificateBinding?.certificateDigest).toBe(
      certificateScenario.bundle.certificate.certificateDigest,
    );
    expect(parseDeepImprovementCommonParityReceipt(
      outcome.receipt,
      manifest,
    )).toEqual(outcome.receipt);
    expect(createDeepImprovementCommonModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'pass',
      blockingReasonCode: null,
      zeroUnexplainedDiffs: true,
      cutoverAuthorized: false,
    });
  }, 60_000);

  it.each(FAULT_CASES)(
    'drives $kind through the real pipeline to exact $expectedClass evidence',
    async ({ kind, eventIndex, expectedClass }) => {
      const fixture = parityFixture();
      const certificateScenario = sharedCertificateScenario;
      const sealed = await createParitySealedBoundary();
      const manifest = targetedParityManifest(fixture);
      const outcome = await runDeepImprovementCommonParityCase({
        manifest,
        caseRun: await parityCaseRun(
          fixture,
          sealed,
          certificateScenario,
          { path: 'ledger', kind, eventIndex },
        ),
      });

      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.diffDispositions.map((entry) => entry.class))
        .toContain(expectedClass);
      expect(outcome.receipt.diffDispositions.every(
        (entry) => entry.disposition === 'unexplained',
      )).toBe(true);
      expect(createDeepImprovementCommonModeGateInput({
        manifest,
        expectedFixtureIds: [fixture.fixtureId],
        receipts: [outcome.receipt],
      }).exitStatus).toBe('blocked');
    },
    60_000,
  );

  it('rejects every attempt to launder an unexplained semantic diff', async () => {
    const fixture = parityFixture();
    const certificateScenario = sharedCertificateScenario;
    const sealed = await createParitySealedBoundary();
    const manifest = targetedParityManifest(fixture);
    const outcome = await runDeepImprovementCommonParityCase({
      manifest,
      caseRun: await parityCaseRun(
        fixture,
        sealed,
        certificateScenario,
        { path: 'ledger', kind: 'payload', eventIndex: 5 },
      ),
    });
    const { receiptDigest: _receiptDigest, ...body } = outcome.receipt;
    const launderedBody = {
      ...body,
      diffDispositions: outcome.receipt.diffDispositions.map((entry) => ({
        ...entry,
        disposition: 'tolerated-non-semantic',
      })),
    };
    const laundered = receiptWithDigest(
      launderedBody as unknown as Omit<
        DeepImprovementCommonParityReceipt,
        'receiptDigest'
      >,
    );

    expect(() => parseDeepImprovementCommonParityReceipt(
      laundered,
      manifest,
    )).toThrow(/disposition is not registered/);
  }, 60_000);

  it('fails closed on a tampered real certificate or mismatched manifest', async () => {
    const fixture = parityFixture();
    const certificateScenario = sharedCertificateScenario;
    const sealed = await createParitySealedBoundary();
    const manifest = targetedParityManifest(fixture);
    const outcome = await runDeepImprovementCommonParityCase({
      manifest,
      caseRun: await parityCaseRun(
        fixture,
        sealed,
        certificateScenario,
      ),
    });
    if (outcome.receipt.modeCertificateBinding === null) {
      throw new Error('Green receipt requires a mode certificate binding');
    }
    const { receiptDigest: _receiptDigest, ...body } = outcome.receipt;
    const tamperedBinding = {
      ...outcome.receipt.modeCertificateBinding,
      bundle: {
        ...outcome.receipt.modeCertificateBinding.bundle,
        certificate: {
          ...outcome.receipt.modeCertificateBinding.bundle.certificate,
          body: {
            ...outcome.receipt.modeCertificateBinding.bundle.certificate.body,
            baselineId: 'baseline-other',
          },
        },
      },
    };
    const tampered = receiptWithDigest({
      ...body,
      modeCertificateBinding:
        tamperedBinding as DeepImprovementCommonParityReceipt['modeCertificateBinding'],
    });
    expect(() => parseDeepImprovementCommonParityReceipt(
      tampered,
      manifest,
    )).toThrow();

    const otherDefinition = createDeepImprovementCommonParityCaseDefinition(fixture);
    const otherManifest = compileParityCaseManifest({
      baseSha: '1371371371371371371371371371371371371371',
      baselineRows: [{
        scenarioId: otherDefinition.scenarioId,
        mode: otherDefinition.mode,
        contractDigest: otherDefinition.contractDigest,
        disposition: 'protected',
      }],
      cases: [otherDefinition],
    });
    expect(() => parseDeepImprovementCommonParityReceipt(
      outcome.receipt,
      otherManifest,
    )).toThrow();
  }, 60_000);

  it('rejects undeclared fixture and resume-evidence keys before execution', async () => {
    const fixture = parityFixture();
    const certificateScenario = sharedCertificateScenario;
    const sealed = await createParitySealedBoundary();
    const withExtraKey = {
      ...fixture,
      cutoverAuthorized: true,
    } as unknown as DeepImprovementCommonParityFixture;
    await expect(runDeepImprovementCommonParityCase({
      manifest: targetedParityManifest(withExtraKey),
      caseRun: await parityCaseRun(
        withExtraKey,
        sealed,
        certificateScenario,
      ),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);
  }, 60_000);
});
