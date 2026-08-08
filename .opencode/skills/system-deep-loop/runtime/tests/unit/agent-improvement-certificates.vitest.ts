// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Certificate Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

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
  AgentImprovementCertificateFailureCodes,
  AgentImprovementTransitionKinds,
  issueAgentImprovementRunCertificate,
  verifyAgentImprovementCertificateOffline,
} from '../../lib/agent-improvement-certificates/index.js';
import {
  AgentImprovementWireEventTypes,
  agentImprovementEventDefinitions,
  createAgentImprovementEventRegistry,
  prepareAgentImprovementEvent,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_ID,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
  createAgentImprovementProjectionState,
  reduceAgentImprovementVerifiedEvent,
} from '../../lib/agent-improvement-reducers/index.js';
import {
  AgentImprovementArtifactKinds,
  createAgentImprovementSealedArtifactStore,
  sealAgentImprovementArtifact,
} from '../../lib/agent-improvement-sealed-artifacts/index.js';
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
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
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
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerificationInput,
  AgentImprovementTransitionReceiptInput,
  AgentImprovementTransitionReceiptSubstrate,
} from '../../lib/agent-improvement-certificates/index.js';
import type {
  AgentImprovementEventEnvelope,
  AgentImprovementEventInput,
  AgentImprovementEventStem,
  AgentImprovementInputData,
  AgentImprovementLedgerEvent,
  AgentImprovementPayloadMap,
  AgentImprovementReplayMetadata,
  AgentImprovementScopeMap,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import type { AgentImprovementProjectionState } from '../../lib/agent-improvement-reducers/index.js';
import type {
  AgentImprovementAgentIrBundleMaterial,
  AgentImprovementArtifactDependency,
  AgentImprovementBehaviorCoverageMaterial,
  AgentImprovementCandidateProposalMaterial,
  AgentImprovementCausalAnalysisInputMaterial,
  AgentImprovementChangeContractBundleMaterial,
  AgentImprovementImproverLaneReferenceMaterial,
  AgentImprovementSealedArtifactBinding,
  AgentImprovementTrialTrajectoryMaterial,
} from '../../lib/agent-improvement-sealed-artifacts/index.js';
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
type AgentReplayProjection = AgentImprovementProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly store: ReturnType<typeof createAgentImprovementSealedArtifactStore>;
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
  const store = createAgentImprovementSealedArtifactStore({
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
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

const agentRegistry = createAgentImprovementEventRegistry();

function agentReplayMetadata(): AgentImprovementReplayMetadata {
  return replayMetadata();
}

function agentScope<TStem extends AgentImprovementEventStem>(
  stem: TStem,
): AgentImprovementScopeMap[TStem] {
  const base = { runId: RUN_ID, lineageId: LINEAGE_ID, variant: 'agent-improvement' as const };
  const candidate = { ...base, candidateId: CANDIDATE_ID };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
      fixtureId: 'fixture-1',
      observationId: 'observation-1',
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: CANARY_EPOCH_ID,
      canarySuiteId: CANARY_SUITE_ID,
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as AgentImprovementScopeMap[TStem];
  }
  switch (stem) {
    case 'agent_improvement.definition_snapshot_sealed':
      return { ...base, agentDefinitionId: 'agent-definition-1' } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.agent_ir_compiled':
      return {
        ...base,
        agentDefinitionId: 'agent-definition-1',
        agentIrId: 'agent-ir-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.change_contract_compiled':
    case 'agent_improvement.behavioral_change_classified':
      return { ...candidate, agentChangeId: 'agent-change-1' } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.mutation_proposed':
      return {
        ...candidate,
        agentChangeId: 'agent-change-1',
        mutationId: 'mutation-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.trace_sliced':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        behaviorFamilyId: 'behavior-family-1',
        traceId: 'trace-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.behavior_experiment_sealed':
      return { ...candidate, experimentId: 'experiment-1' } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.known_defect_injected':
      return {
        ...candidate,
        experimentId: 'experiment-1',
        interventionId: 'intervention-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.behavior_coverage_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        behaviorFamilyId: 'behavior-family-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.evaluation_manifest_sealed':
    case 'agent_improvement.fixture_exposure_recorded':
      return {
        ...base,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        manifestId: 'manifest-1',
        exposureEpochId: 'exposure-epoch-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.transfer_trial_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        trialId: 'trial-1',
      } as AgentImprovementScopeMap[TStem];
    default:
      return base as AgentImprovementScopeMap[TStem];
  }
}

function appendAgent<TStem extends AgentImprovementEventStem>(
  events: AgentImprovementLedgerEvent[],
  stem: TStem,
  data: AgentImprovementInputData<TStem>,
  eventId?: string,
): AgentImprovementEventEnvelope<TStem> {
  const previous = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const input: AgentImprovementEventInput<TStem> = {
    stem,
    scope: agentScope(stem),
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: agentReplayMetadata(),
    data,
    eventId: eventId ?? `agent-certificate-event-${String(sequence).padStart(3, '0')}`,
    streamId: 'agent-improvement-certificate-run-1',
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'agent-improvement-certificate-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `agent-certificate-event-${sequence}`,
  };
  const event = prepareAgentImprovementEvent(
    input,
    agentRegistry,
  ).envelope as AgentImprovementEventEnvelope<TStem>;
  events.push(event);
  return event;
}

function agentEvents(): AgentImprovementLedgerEvent[] {
  const events: AgentImprovementLedgerEvent[] = [];
  appendAgent(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:agent-improvement',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const commonProposal = appendAgent(events, 'deep_improvement_common.candidate_proposed', {
    proposalRef: 'proposal:candidate-1',
    proposalDigest: digest('proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null,
    targetRef: 'target:agent-1',
    targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  });
  appendAgent(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: commonProposal.event_id,
    proposalPayloadDigest: commonProposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const epoch = appendAgent(events, 'deep_improvement_common.evaluation_epoch_sealed', {
    evaluatorRef: 'evaluator:independent-1',
    evaluatorCapsuleDigest: digest('evaluator-capsule'),
    fixtureSetRef: 'profile:heldout-1',
    fixtureSetDigest: digest('fixture-set'),
    scorePolicyVersion: 'score-policy@1',
    evaluationBudgetRef: 'budget:evaluation-1',
  });
  const evaluationStarted = appendAgent(events, 'deep_improvement_common.evaluation_started', {
    epochSealedEventId: epoch.event_id,
    epochPayloadDigest: epoch.payload.payloadDigest,
    executionReceiptRef: 'receipt:evaluation-start-1',
    fixtureCount: 1,
    evaluatorFingerprint: digest('evaluator-fingerprint'),
  });
  const commonObservation = appendAgent(
    events,
    'deep_improvement_common.evaluation_observation_recorded',
    {
      evaluationStartedEventId: evaluationStarted.event_id,
      evaluatorRef: 'evaluator:independent-1',
      fixtureRef: 'fixture:heldout-1',
      rawObservationRef: 'observation:raw-1',
      rawObservationDigest: digest('raw-observation'),
      executionReceiptRef: 'receipt:observation-1',
      observationOutcome: 'pass',
    },
  );
  const commonNormalized = appendAgent(events, 'deep_improvement_common.evaluation_normalized', {
    observationEventIds: [commonObservation.event_id],
    observationSetDigest: digest('observation-set'),
    scorePolicyVersion: 'score-policy@1',
    scorerFingerprint: digest('scorer'),
    scoreVector: scoreVector(),
    normalizationReceiptRef: 'receipt:normalization-1',
  });
  const verificationRequested = appendAgent(
    events,
    'deep_improvement_common.evaluation_verification_requested',
    {
      normalizedEventId: commonNormalized.event_id,
      normalizedPayloadDigest: commonNormalized.payload.payloadDigest,
      verificationPolicyVersion: 'verification-policy@1',
      verifierRef: 'verifier:independent-1',
      reasonCode: 'promotion-bound-score',
    },
  );
  appendAgent(events, 'deep_improvement_common.evaluation_verification_recorded', {
    requestEventId: verificationRequested.event_id,
    verifierRef: 'verifier:independent-1',
    verificationOutcome: 'confirmed',
    verificationEvidenceRef: 'evidence:verification-1',
    verificationEvidenceDigest: digest('verification-evidence'),
    verificationReceiptRef: 'receipt:verification-1',
  });
  const canarySuite = appendAgent(events, 'deep_improvement_common.canary_suite_sealed', {
    suiteRef: 'canary-suite:sealed-1',
    suiteDigest: digest('canary-suite'),
    canaryPolicyVersion: 'canary-policy@1',
    fixtureCount: 2,
    protectedMaterialRef: 'protected:canary-1',
    protectedMaterialDigest: digest('protected-canary'),
  });
  const canaryExecution = appendAgent(events, 'deep_improvement_common.canary_executed', {
    suiteSealedEventId: canarySuite.event_id,
    suitePayloadDigest: canarySuite.payload.payloadDigest,
    executionReceiptRef: 'receipt:canary-execution-1',
    canaryObservationRef: 'canary-observation:1',
    canaryObservationDigest: digest('canary-observation'),
    outcome: 'pass',
  });
  appendAgent(events, 'deep_improvement_common.canary_gate_passed', {
    executionEventIds: [canaryExecution.event_id],
    evidenceSetDigest: digest('canary-evidence'),
    policyVersion: 'canary-gate@1',
    policyFingerprint: digest('canary-policy'),
    decisionReceiptRef: 'receipt:canary-pass-1',
  });
  const definition = appendAgent(events, 'agent_improvement.definition_snapshot_sealed', {
    definitionRef: 'artifact:agent-definition-one',
    definitionDigest: digest('definition'),
    definitionSchemaVersion: 'agent-definition@1',
    capabilityPolicyRef: 'policy:capability-one',
    capabilityPolicyDigest: digest('definition'),
    verifierPolicyRef: 'policy:verifier-one',
    verifierPolicyDigest: digest('definition'),
    toolPolicyRef: 'policy:tool-one',
    toolPolicyDigest: digest('definition'),
    routingPolicyRef: 'policy:routing-one',
    routingPolicyDigest: digest('definition'),
    memoryPolicyRef: 'policy:memory-one',
    memoryPolicyDigest: digest('definition'),
    sealingReceiptRef: 'receipt:definition-one',
  });
  const agentIr = appendAgent(events, 'agent_improvement.agent_ir_compiled', {
    definitionSnapshotEventId: definition.event_id,
    definitionSnapshotPayloadDigest: definition.payload.payloadDigest,
    agentIrRef: 'artifact:agent-ir-1',
    agentIrDigest: digest('agent-ir'),
    agentIrSchemaVersion: 'agent-ir@1',
    components: [{
      componentId: 'component-instructions',
      componentKind: 'instruction',
      componentRef: 'agent-ir:component:instructions',
      componentDigest: digest('component-instructions'),
    }, {
      componentId: 'component-tools',
      componentKind: 'tool-policy',
      componentRef: 'agent-ir:component:tools',
      componentDigest: digest('component-tools'),
    }],
    inheritanceEdges: [{
      edgeId: 'edge-instructions-tools',
      parentComponentId: 'component-instructions',
      childComponentId: 'component-tools',
      inheritanceKind: 'preserves',
      edgeDigest: digest('edge'),
    }],
    loci: [{
      locusId: 'locus-instruction-1',
      componentId: 'component-instructions',
      clauseId: 'clause-1',
      locusKind: 'instruction',
      mutability: 'mutable',
      locusRef: 'agent-ir:locus:instruction-1',
      locusDigest: digest('locus-instruction'),
    }, {
      locusId: 'locus-tool-policy-1',
      componentId: 'component-tools',
      clauseId: null,
      locusKind: 'tool-policy',
      mutability: 'immutable',
      locusRef: 'agent-ir:locus:tool-policy-1',
      locusDigest: digest('locus-tool'),
    }],
    compilerFingerprint: digest('compiler'),
    compilationReceiptRef: 'receipt:agent-ir-compilation-1',
  });
  const change = appendAgent(events, 'agent_improvement.change_contract_compiled', {
    agentIrEventId: agentIr.event_id,
    agentIrPayloadDigest: agentIr.payload.payloadDigest,
    baseDefinitionRef: 'artifact:agent-definition-base',
    baseDefinitionDigest: digest('base-definition'),
    candidateDefinitionRef: 'artifact:agent-definition-candidate',
    candidateDefinitionDigest: digest('candidate-definition'),
    changeContractRef: 'artifact:change-contract-1',
    changeContractDigest: digest('change-contract'),
    patchRef: 'artifact:patch-1',
    patchDigest: digest('patch'),
    intendedObligationIds: ['obligation:clarity'],
    preservedObligationIds: ['obligation:authority'],
    affectedBehaviorFamilyIds: ['behavior-family-1'],
    behavioralSemverIntent: 'patch',
    contractPolicyVersion: 'change-contract@1',
    compilationReceiptRef: 'receipt:change-contract-1',
  });
  appendAgent(events, 'agent_improvement.mutation_proposed', {
    changeContractEventId: change.event_id,
    changeContractPayloadDigest: change.payload.payloadDigest,
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    mutationProposalRef: 'proposal:mutation-1',
    mutationProposalDigest: digest('mutation'),
    targetLocusIds: ['locus-instruction-1'],
    parentCandidateId: null,
    diagnosticEvidenceRefs: ['diagnostic:failure-1'],
    diagnosticEvidenceSetDigest: digest('diagnostic-set'),
    proposalPolicyVersion: 'mutation-proposal@1',
  });
  const observation = events.find(
    (event) => event.payload.stem === 'deep_improvement_common.evaluation_observation_recorded',
  )!;
  const trace = appendAgent(events, 'agent_improvement.trace_sliced', {
    evaluationObservationEventId: observation.event_id,
    evaluationObservationPayloadDigest: observation.payload.payloadDigest,
    traceRef: 'trace:raw-1',
    traceDigest: digest('trace'),
    traceSliceRef: 'trace-slice:1',
    traceSliceDigest: digest('trace-slice'),
    failureRef: 'failure:behavior-1',
    failureDigest: digest('failure'),
    clauseIds: ['clause-1'],
    componentIds: ['component-instructions'],
    slicerFingerprint: digest('slicer'),
    attributionStatus: 'diagnostic',
    attributionUncertainty: 0.2,
    slicingReceiptRef: 'receipt:trace-slice-1',
  });
  const experiment = appendAgent(events, 'agent_improvement.behavior_experiment_sealed', {
    traceSliceEventId: trace.event_id,
    traceSlicePayloadDigest: trace.payload.payloadDigest,
    experimentPlanRef: 'experiment-plan:1',
    experimentPlanDigest: digest('experiment-plan'),
    behaviorFamilyId: 'behavior-family-1',
    scenarioSetRef: 'scenario-set:1',
    scenarioSetDigest: digest('scenario-set'),
    baselineExecutionRef: 'execution:baseline-1',
    baselineExecutionDigest: digest('baseline-execution'),
    candidateExecutionRef: 'execution:candidate-1',
    candidateExecutionDigest: digest('candidate-execution'),
    freshPairedExecutionReceiptRef: 'receipt:paired-execution-1',
    executorRef: 'executor:primary-1',
    executorFingerprint: digest('executor'),
    verifierRef: 'verifier:isolated-1',
    verifierFingerprint: digest('verifier'),
    interventionIds: ['intervention-1'],
    experimentPolicyVersion: 'behavior-experiment@1',
  });
  const defect = appendAgent(events, 'agent_improvement.known_defect_injected', {
    experimentEventId: experiment.event_id,
    experimentPayloadDigest: experiment.payload.payloadDigest,
    defectLocusId: 'locus-instruction-1',
    injectionRef: 'defect-injection:1',
    injectionDigest: digest('defect'),
    controlExecutionRef: 'execution:control-1',
    controlExecutionDigest: digest('control'),
    perturbedExecutionRef: 'execution:perturbed-1',
    perturbedExecutionDigest: digest('perturbed'),
    rawObservationRef: 'observation:defect-1',
    rawObservationDigest: digest('defect-observation'),
    outcome: 'detected',
    uncertainty: 0.1,
    injectionReceiptRef: 'receipt:defect-injection-1',
  });
  appendAgent(events, 'agent_improvement.behavior_coverage_recorded', {
    experimentEventIds: [experiment.event_id, defect.event_id],
    evidenceSetDigest: digest('coverage-evidence'),
    clauseIds: ['clause-1'],
    authorityConflictCaseIds: ['case:authority-1'],
    negativeCapabilityCaseIds: ['case:negative-capability-1'],
    sideEffectOracleIds: ['oracle:side-effect-1'],
    semanticVariantIds: ['variant:semantic-1'],
    rawCoverageRef: 'coverage:raw-1',
    rawCoverageDigest: digest('coverage'),
    coverageOutcome: 'covered',
    criticalInvariantOutcome: 'pass',
    coveragePolicyVersion: 'behavior-coverage@1',
  });
  const manifest = appendAgent(events, 'agent_improvement.evaluation_manifest_sealed', {
    manifestRef: 'manifest:evaluation-1',
    manifestDigest: digest('manifest'),
    manifestVersion: 'evaluation-manifest@1',
    rings: ['public', 'heldout', 'canary', 'transfer'].map((ring) => ({
      ring,
      fixtureSetRef: `fixture-set:${ring}-1`,
      fixtureSetDigest: digest(`fixture-set:${ring}`),
      fixtureCount: 2,
    })) as AgentImprovementPayloadMap['agent_improvement.evaluation_manifest_sealed']['rings'],
    evaluatorCapsuleRef: 'evaluator:capsule-1',
    evaluatorCapsuleDigest: digest('evaluator-capsule'),
    leakVetoPolicyVersion: 'leak-veto@1',
    sealingReceiptRef: 'receipt:manifest-seal-1',
  });
  appendAgent(events, 'agent_improvement.fixture_exposure_recorded', {
    manifestEventId: manifest.event_id,
    manifestPayloadDigest: manifest.payload.payloadDigest,
    exposureKind: 'activated',
    exposedRingCodes: ['public'],
    authorizedExposureRef: 'exposure-authorization:1',
    authorizedExposureDigest: digest('exposure'),
    exposureReceiptRef: 'receipt:exposure-1',
    occurredAt: TIMESTAMP,
  });
  appendAgent(events, 'agent_improvement.transfer_trial_recorded', {
    sourceExecutorRef: 'executor:primary-1',
    sourceExecutorFingerprint: digest('source-executor'),
    targetExecutorRef: 'executor:transfer-1',
    targetExecutorFingerprint: digest('target-executor'),
    verifierRef: 'verifier:isolated-1',
    verifierFingerprint: digest('transfer-verifier'),
    behaviorFamilyIds: ['behavior-family-1'],
    scenarioSetRef: 'scenario-set:transfer-1',
    scenarioSetDigest: digest('transfer-scenarios'),
    baselineExecutionRef: 'execution:transfer-baseline-1',
    baselineExecutionDigest: digest('transfer-baseline'),
    candidateExecutionRef: 'execution:transfer-candidate-1',
    candidateExecutionDigest: digest('transfer-candidate'),
    rawObservationRef: 'observation:transfer-1',
    rawObservationDigest: digest('transfer-observation'),
    transferOutcome: 'pass',
    uncertainty: 0.1,
    executionReceiptRef: 'receipt:transfer-1',
  });
  const normalized = events.find(
    (event) => event.payload.stem === 'deep_improvement_common.evaluation_normalized',
  )!;
  const verification = events.find(
    (event) => event.payload.stem === 'deep_improvement_common.evaluation_verification_recorded',
  )!;
  const canary = events.find(
    (event) => event.payload.stem === 'deep_improvement_common.canary_gate_passed',
  )!;
  appendAgent(events, 'agent_improvement.behavioral_change_classified', {
    changeContractEventId: change.event_id,
    changeContractPayloadDigest: change.payload.payloadDigest,
    normalizedEventId: normalized.event_id,
    normalizedPayloadDigest: normalized.payload.payloadDigest,
    verificationEventId: verification.event_id,
    verificationPayloadDigest: verification.payload.payloadDigest,
    canaryGateEventId: canary.event_id,
    canaryGatePayloadDigest: canary.payload.payloadDigest,
    classificationPolicyVersion: 'behavioral-semver@1',
    behavioralSemver: 'patch',
    affectedBehaviorFamilyIds: ['behavior-family-1'],
    regressedBehaviorFamilyIds: [],
    preservedObligationIds: ['obligation:authority'],
    classificationEvidenceRef: 'evidence:classification-1',
    classificationEvidenceDigest: digest('classification'),
    classificationReceiptRef: 'receipt:classification-1',
  });
  return events;
}

async function authorizedAgentLedger(events: readonly AgentImprovementLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(agentImprovementEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'agent-improvement-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-event'],
    evaluate: () => ({
      verdict: 'allow',
      reasonCode: 'allowed',
      matchedRuleIds: ['known-event'],
    }),
  }]);
  const rootDirectory = temporaryRoot('agent-ledger');
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
    const normalizedData = { ...event.payload.data } as Record<string, unknown>;
    delete normalizedData.scoreWriteBackendRef;
    const prepared = prepareAgentImprovementEvent({
      stem: event.payload.stem,
      scope: event.payload.scope,
      prevEventHash: event.payload.prevEventHash,
      replay: event.payload.replay,
      data: normalizedData,
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
    } as AgentImprovementEventInput<AgentImprovementEventStem>, registry);
    const policy = policies.resolve('agent-improvement-shadow-write', 1);
    const request = {
      requestId: `agent-certificate-request-${index + 1}`,
      mode: 'agent-improvement',
      event: prepared,
      priorHead: await ledger.getVerifiedHead(),
      priorStateVersion: 'agent-improvement-shadow@1',
      priorStateFingerprint: digest('prior-state'),
      actorId: 'agent-improvement-runtime',
      capabilityId: 'agent-improvement:append',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: digest('authorization-evidence'),
    } as const;
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new Error(`Expected agent fixture authorization at ${index}: ${JSON.stringify(authorization)}`);
    }
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({ rootDirectory, operationTimeoutMs: 5_000 });
  const lease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: 'agent-improvement-certificate-writer',
    correlationId: 'agent-improvement-certificate-writer',
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
      priorStateVersion: 'agent-improvement-certificate-state@1',
      priorStateFingerprint: digest('agent-improvement-certificate-state'),
      actorId: 'agent-improvement-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'agent-improvement-shadow-write',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: AgentImprovementTransitionReceiptSubstrate = {
    writer,
    registry,
    producer: { name: 'agent-improvement-certificate-tests', version: '1' },
  };
  return { ledger, registry, receiptSubstrate };
}

function agentReplayComponentRegistry(): ReplayComponentRegistry<AgentReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<AgentReplayProjection>(
    Object.values(AgentImprovementWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
      reduce: (state: Readonly<AgentReplayProjection>, event) => (
        reduceAgentImprovementVerifiedEvent(
          { event } as unknown as VerifiedLedgerEvent,
          state,
        ).state as AgentReplayProjection
      ),
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: AGENT_IMPROVEMENT_REDUCER_ID,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    projectionSchemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function agentOrigin(
  events: readonly AgentImprovementLedgerEvent[],
  stem: AgentImprovementEventStem,
) {
  const event = events.find((candidate) => candidate.payload.stem === stem);
  if (!event) throw new Error(`Missing agent origin ${stem}`);
  return { eventStem: stem, eventId: event.event_id, payloadDigest: event.payload.payloadDigest };
}

function agentDependency(
  purpose: string,
  reference: SealedArtifactReference,
): AgentImprovementArtifactDependency {
  return {
    artifactKind: reference.artifact_kind,
    purpose,
    reference,
  } as AgentImprovementArtifactDependency;
}

function agentLocator(label: string) {
  return {
    scheme: 'artifact' as const,
    locatorDigest: digest(`agent-locator:${label}`),
    selector: `artifact:${label}`,
    revision: 'revision-1',
  };
}

async function agentArtifacts(
  common: Scenario,
  events: readonly AgentImprovementLedgerEvent[],
): Promise<{
  readonly bindings: readonly AgentImprovementSealedArtifactBinding[];
  readonly wrongKindBinding: AgentImprovementSealedArtifactBinding;
}> {
  const store = common.store;
  const fixture = async (label: string) => (
    await store.seal(InitialArtifactKinds.FIXTURE, { fixture: `agent-${label}` })
  ).artifact.reference;
  const fixtures = await Promise.all(['a', 'b', 'c', 'd'].map(fixture));
  const configuration = (await store.seal(
    InitialArtifactKinds.CONFIGURATION,
    { configuration: 'agent-executor' },
  )).artifact.reference;
  const prior = (await store.seal(
    InitialArtifactKinds.PRIOR_RUN_OUTPUT,
    { observation: 'agent-raw' },
  )).artifact.reference;
  const commonBinding = (kind: DeepImprovementCommonSealedArtifactBinding['artifactKind']) => {
    const binding = common.bindings.find((candidate) => candidate.artifactKind === kind);
    if (!binding) throw new Error(`Missing common binding ${kind}`);
    return binding.reference;
  };
  const [a, b, c, d] = fixtures as [
    SealedArtifactReference,
    SealedArtifactReference,
    SealedArtifactReference,
    SealedArtifactReference,
  ];
  const base = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'base-agent-1',
      dependencyReferences: [agentDependency('source', a)],
      originEvent: agentOrigin(events, 'agent_improvement.agent_ir_compiled'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('base-agent'),
      agentDefinitionRef: 'agent-definition:1',
      agentDefinitionDigest: digest('definition'),
      agentIrRef: 'agent-ir:1',
      agentIrDigest: digest('agent-ir'),
      agentIrSchemaVersion: 'agent-ir@1',
      components: [{
        componentId: 'component-instruction',
        componentKind: 'instruction',
        componentRef: 'component:instruction',
        componentDigest: digest('component-instruction'),
      }],
      inheritanceEdges: [],
      loci: [],
      capabilityPolicyDigest: digest('capability'),
      authorityPolicyDigest: digest('authority'),
      toolConfigurationDigest: digest('tool'),
      routingConfigurationDigest: digest('routing'),
      memoryConfigurationDigest: digest('memory'),
      inferenceConfigurationDigest: digest('inference'),
      executorConfigurationDigest: digest('executor'),
      parentAgentReference: null,
    } satisfies AgentImprovementAgentIrBundleMaterial,
  );
  const change = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'change-contract-1',
      dependencyReferences: [agentDependency('agent-ir', base.reference)],
      originEvent: agentOrigin(events, 'agent_improvement.change_contract_compiled'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('change'),
      agentIrReference: base.reference,
      baseDefinitionRef: 'definition:base',
      baseDefinitionDigest: digest('base-definition'),
      candidateDefinitionRef: 'definition:candidate',
      candidateDefinitionDigest: digest('candidate-definition'),
      changeContractRef: 'change-contract:1',
      changeContractDigest: digest('change-contract'),
      patchRef: 'patch:1',
      patchDigest: digest('patch'),
      changedComponentIds: ['component-instructions'],
      changedClauseIds: ['clause-1'],
      inheritedClauseIds: [],
      intendedBehaviorDigest: digest('intended'),
      preservedBehaviorDigest: digest('preserved'),
      staticAssertionsDigest: digest('assertions'),
      tracePolicyDigest: digest('trace-policy'),
      scenarioSetDigest: digest('scenario-set'),
      behavioralSemverIntent: 'patch',
      operatorReference: 'operator:bounded-rewrite',
      parentLineageReference: null,
    } satisfies AgentImprovementChangeContractBundleMaterial,
  );
  const improver = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'improver-lane-1',
      dependencyReferences: [agentDependency('source', a)],
      originEvent: agentOrigin(events, 'agent_improvement.mutation_proposed'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('improver'),
      experimentLineageId: LINEAGE_ID,
      improverModelRef: 'model:improver',
      improverModelDigest: digest('improver'),
      improverBuildRef: 'build:improver',
      improverBuildDigest: digest('build'),
      promptPolicyDigest: digest('prompt'),
      trainingCorpusDigest: digest('training'),
      developmentCorpusDigest: digest('development'),
      sealedFailureCorpusDigest: digest('failures'),
      optimizerVersion: 'optimizer@1',
      mutationOperatorReference: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
      visibilityPolicy: {
        candidateVisibleEvidence: 'bounded-diagnostic',
        hiddenFixtures: 'withheld',
        exactTerminalScores: 'withheld',
        evaluatorInternals: 'withheld',
        terminalEvidence: 'withheld',
      },
      queryBudget: { maxQueries: 10, maxBytes: 1024, maxWallClockMs: 1000, maxCostMicros: 10 },
      parentCandidateReference: null,
    } satisfies AgentImprovementImproverLaneReferenceMaterial,
  );
  const causal = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'causal-1',
      dependencyReferences: [
        agentDependency('failure', prior),
        agentDependency('intervention', configuration),
      ],
      originEvent: agentOrigin(events, 'agent_improvement.trace_sliced'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('causal'),
      failureClusterReference: prior,
      failureClusterDigest: prior.content_digest,
      firstDivergentTraceReference: prior,
      firstDivergentTraceDigest: prior.content_digest,
      knownDefectLocusId: 'locus-instruction-1',
      knownDefectLocusDigest: digest('locus-instruction'),
      counterfactualInterventionReference: configuration,
      counterfactualInterventionDigest: configuration.content_digest,
      proposalVisibleEvidenceReference: prior,
      proposalVisibleEvidenceDigest: prior.content_digest,
      parentCandidateReference: null,
      evidenceExposurePolicy: 'bounded-diagnostic',
    } satisfies AgentImprovementCausalAnalysisInputMaterial,
  );
  const proposal = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'proposal-1',
      dependencyReferences: [
        agentDependency('parent', base.reference),
        agentDependency('change', change.reference),
        agentDependency('improver', improver.reference),
        agentDependency('causal', causal.reference),
      ],
      originEvent: agentOrigin(events, 'agent_improvement.mutation_proposed'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('proposal'),
      candidateId: CANDIDATE_ID,
      candidatePackageRef: 'package:candidate-1',
      candidatePackageDigest: digest('candidate-package'),
      candidateAgentIrRef: 'agent-ir:candidate-1',
      candidateAgentIrDigest: digest('candidate-agent-ir'),
      parentAgentReference: base.reference,
      changeContractReference: change.reference,
      improverLaneReference: improver.reference,
      causalAnalysisReference: causal.reference,
      atomicPatchLineageReference: change.reference,
      atomicPatchLineageDigest: change.reference.content_digest,
      proposalRationaleReference: causal.reference,
      proposalRationaleDigest: causal.reference.content_digest,
      mutationOperatorReference: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
      parentCandidateReference: null,
    } satisfies AgentImprovementCandidateProposalMaterial,
  );
  const canary = commonBinding(DeepImprovementCommonArtifactKinds.CANARY_EPOCH);
  const coverage = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'coverage-1',
      dependencyReferences: [
        agentDependency('canary', canary),
        ...fixtures.map((reference, index) => agentDependency(`fixture-${index}`, reference)),
      ],
      originEvent: agentOrigin(events, 'agent_improvement.behavior_coverage_recorded'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('coverage'),
      coverageId: 'coverage-1',
      evaluationEpochId: EVALUATION_EPOCH_ID,
      exposureEpochId: 'exposure-epoch-1',
      clauseDigests: [a.content_digest],
      behaviorFamilyIds: ['behavior-family-1'],
      authorityConflictCaseDigests: [b.content_digest],
      transitionCaseDigests: [c.content_digest],
      sideEffectOracleDigests: [d.content_digest],
      negativeCapabilityCaseDigests: [a.content_digest],
      perturbationDigests: [b.content_digest],
      untouchedFamilySentinelDigests: [c.content_digest],
      semanticVariantDigests: [d.content_digest],
      executorDigests: [configuration.content_digest],
      rotatingCanaryReference: canary,
      coverageManifestDigest: digest('coverage-manifest'),
      coverageOutcome: 'covered',
      criticalInvariantOutcome: 'pass',
    } satisfies AgentImprovementBehaviorCoverageMaterial,
  );
  const evaluator = commonBinding(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE);
  const raw = commonBinding(DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT);
  const trial = await sealAgentImprovementArtifact(
    store,
    AgentImprovementArtifactKinds.TRIAL_TRAJECTORY,
    {
      schemaVersion: 'agent-improvement-artifact@1',
      artifactId: 'trial-1',
      dependencyReferences: [
        agentDependency('proposal', proposal.reference),
        agentDependency('baseline', base.reference),
        agentDependency('evaluator', evaluator),
        agentDependency('raw', raw),
        agentDependency('fixture-a', a),
        agentDependency('fixture-b', b),
        agentDependency('fixture-c', c),
        agentDependency('fixture-d', d),
        agentDependency('executor', configuration),
        agentDependency('raw-observation', prior),
      ],
      originEvent: agentOrigin(events, 'agent_improvement.transfer_trial_recorded'),
      producerVersion: 'agent-producer@1',
      locator: agentLocator('trial'),
      trialId: 'trial-1',
      candidateProposalReference: proposal.reference,
      baselineAgentReference: base.reference,
      evaluatorCapsuleReference: evaluator,
      commonRawTrialReference: raw,
      evaluationEpochId: EVALUATION_EPOCH_ID,
      taskManifestReference: a,
      taskManifestDigest: a.content_digest,
      behaviorFamilyId: 'behavior-family-1',
      semanticVariantReference: b,
      semanticVariantDigest: b.content_digest,
      authorityConflictReference: c,
      authorityConflictDigest: c.content_digest,
      negativeCapabilityReference: d,
      negativeCapabilityDigest: d.content_digest,
      seed: 7,
      executorReference: configuration,
      executorFingerprint: digest('executor'),
      environmentReference: configuration,
      environmentDigest: configuration.content_digest,
      normalizedTraceReference: prior,
      normalizedTraceDigest: prior.content_digest,
      sideEffectObservationReference: prior,
      sideEffectObservationDigest: prior.content_digest,
      receiptPredicateReference: configuration,
      receiptPredicateDigest: configuration.content_digest,
      caseOutcomeVectorDigest: digest('case-vector'),
      integrityObservationReference: prior,
      integrityObservationDigest: prior.content_digest,
      normalizationVersion: 'normalization@1',
    } satisfies AgentImprovementTrialTrajectoryMaterial,
  );
  return Object.freeze({
    bindings: Object.freeze([proposal, coverage, trial]),
    wrongKindBinding: base,
  });
}

function agentTransitionInputs(
  events: readonly AgentImprovementLedgerEvent[],
  bindings: readonly AgentImprovementSealedArtifactBinding[],
): readonly AgentImprovementTransitionReceiptInput[] {
  const binding = (kind: string) => {
    const match = bindings.find((candidate) => candidate.artifactKind === kind);
    if (!match) throw new Error(`Missing agent binding ${kind}`);
    return match.reference.qualified_digest;
  };
  const event = (stem: AgentImprovementEventStem) => {
    const match = events.find((candidate) => candidate.payload.stem === stem);
    if (!match) throw new Error(`Missing agent event ${stem}`);
    return match.event_id;
  };
  const proposal = binding(AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL);
  const coverage = binding(AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE);
  const trial = binding(AgentImprovementArtifactKinds.TRIAL_TRAJECTORY);
  const make = (
    transitionKind: AgentImprovementTransitionReceiptInput['transitionKind'],
    resultEventId: string,
    inputs: readonly string[],
    output: string,
  ): AgentImprovementTransitionReceiptInput => ({
    transitionKind,
    logicalOperationId: `agent-logical:${transitionKind}`,
    effectIdempotencyKey: `agent-effect:${transitionKind}`,
    attemptNumber: 1,
    resultEventId,
    inputArtifactQualifiedDigests: inputs,
    outputArtifactQualifiedDigests: [output],
    evidenceArtifactQualifiedDigests: [],
  });
  return Object.freeze([
    make(
      AgentImprovementTransitionKinds.PROPOSAL_CREATED,
      event('agent_improvement.mutation_proposed'),
      [],
      proposal,
    ),
    make(
      AgentImprovementTransitionKinds.SCORE_REDUCED,
      event('agent_improvement.behavior_coverage_recorded'),
      [proposal],
      coverage,
    ),
    make(
      AgentImprovementTransitionKinds.BENCHMARK_EVIDENCE_RECORDED,
      event('agent_improvement.transfer_trial_recorded'),
      [proposal, coverage],
      trial,
    ),
  ]);
}

interface AgentScenario {
  readonly bundle: AgentImprovementCertificateBundle;
  readonly verification: AgentImprovementOfflineVerificationInput<AgentReplayProjection>;
  readonly common: Scenario;
  readonly wrongKindBinding: AgentImprovementSealedArtifactBinding;
}

async function buildAgentScenario(
  options: ScenarioOptions = {},
): Promise<AgentScenario> {
  const common = await scenario(options);
  const events = agentEvents();
  const { ledger, registry, receiptSubstrate } = await authorizedAgentLedger(events);
  const artifacts = await agentArtifacts(common, events);
  const bindings = artifacts.bindings;
  const initialState = createAgentImprovementProjectionState() as AgentReplayProjection;
  const replay: AgentImprovementOfflineVerificationInput<AgentReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: agentReplayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: AGENT_IMPROVEMENT_REDUCER_ID,
      reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
      projectionSchemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<AgentReplayProjection>,
  };
  const certificationProviders = providers();
  const bundle = await issueAgentImprovementRunCertificate({
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore: common.store,
    artifactBindings: bindings,
    transitionReceipts: agentTransitionInputs(events, bindings),
    replay,
    commonVerification: common.verification as DeepImprovementCommonOfflineVerificationInput<JsonObject>,
    certificationProfile: certificationProviders.inspect()[0]!,
    providers: certificationProviders,
    receiptSubstrate,
    issuer: 'agent-improvement-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    common,
    wrongKindBinding: artifacts.wrongKindBinding,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore: common.store,
      replay,
      commonVerification: common.verification as DeepImprovementCommonOfflineVerificationInput<JsonObject>,
      providers: certificationProviders,
    },
  };
}

let agentScenarioPromise: Promise<AgentScenario> | undefined;

function agentScenario(): Promise<AgentScenario> {
  agentScenarioPromise ??= buildAgentScenario();
  return agentScenarioPromise;
}

describe('agent improvement certificates', () => {
  it('issues a dark certificate and verifies the common plus mode-specific closure offline', async () => {
    const fixture = await agentScenario();
    expect(fixture.bundle.certificate.body.authority).toBe('dark-evidence-only');
    expect(fixture.bundle.certificate.body.namedDigestClosureRules).toEqual([]);
    expect(fixture.bundle.receipts).toHaveLength(3);
    expect(fixture.bundle.certificate.body.commonReceiptIdentities)
      .toEqual(fixture.common.bundle.certificate.body.receiptIdentities);
    expect(await verifyAgentImprovementCertificateOffline(fixture.verification))
      .toMatchObject({
        verdict: 'valid',
        verificationReceipt: {
          verifierVersion: 'agent-improvement-offline-verifier@1',
        },
      });
  });

  it('rejects a coherently certified non-passing common disposition', async () => {
    const fixture = await buildAgentScenario({ completeCommonRun: false });
    expect(fixture.common.bundle.certificate.body.verdict)
      .toBe('INSUFFICIENT_EVIDENCE');
    expect(fixture.bundle.certificate.body.disposition)
      .toBe('INSUFFICIENT_EVIDENCE');
    const result = await verifyAgentImprovementCertificateOffline(fixture.verification);
    expect(result).toMatchObject({
      verdict: 'incomplete',
      code: AgentImprovementCertificateFailureCodes.INCOMPLETE_RUN,
    });
  });

  it('returns unverifiable when a separate offline store lacks certified bytes', async () => {
    const fixture = await agentScenario();
    const prunedStore = createAgentImprovementSealedArtifactStore({
      rootDirectory: temporaryRoot('pruned-agent-store'),
    });
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      artifactStore: prunedStore,
    });
    expect(result).toMatchObject({
      verdict: 'unverifiable',
      code: AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING,
    });
  });

  it('rejects a forged wrong-kind artifact claim through the offline verifier', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    const proposal = bundle.certificate.body.artifactClaims.find(
      (claim) => claim.role === 'proposal',
    )!;
    proposal.binding = structuredClone(fixture.wrongKindBinding);
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.ARTIFACT_WRONG_KIND,
    });
  });

  it('returns unverifiable for a fabricated artifact binding through the offline verifier', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    const proposal = bundle.certificate.body.artifactClaims.find(
      (claim) => claim.role === 'proposal',
    )!;
    const fabricatedDigest = digest('fabricated-agent-artifact');
    proposal.binding.reference.content_digest = fabricatedDigest;
    proposal.binding.reference.qualified_digest = `sha256:${fabricatedDigest}`;
    proposal.binding.reference.descriptor_digest = digest('fabricated-agent-descriptor');
    proposal.binding.eventReference = `artifact:sha256:${fabricatedDigest}`;
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'unverifiable',
      code: AgentImprovementCertificateFailureCodes.ARTIFACT_MISSING,
    });
  });

  it('rejects a mutated artifact claim through the offline verifier', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    const proposal = bundle.certificate.body.artifactClaims.find(
      (claim) => claim.role === 'proposal',
    )!;
    proposal.contentDigest = digest('mutated-artifact-claim');
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.ARTIFACT_MUTATED,
    });
  });

  it('rejects stale evaluation-epoch artifact evidence through the offline verifier', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.certificate.body.evaluationEpochId = 'evaluation-epoch-stale';
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.EPOCH_MISMATCH,
    });
  });

  it('rejects a reordered receipt chain', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.receipts = [bundle.receipts[1]!, bundle.receipts[0]!, bundle.receipts[2]!];
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects a broken predecessor chain', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.receipts[1]!.facts.predecessorReceiptDigests[0] = digest('broken-predecessor');
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects a changed shared receipt identity', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.certificate.body.commonReceiptIdentities[0]!.digest = digest('forged-common-identity');
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.COMMON_VERIFICATION_INVALID,
    });
  });

  it('rejects a mutated projection event not present in the authorized ledger', async () => {
    const fixture = await agentScenario();
    const events = structuredClone(fixture.verification.projectionEvents);
    events[events.length - 1]!.payload.data.classificationEvidenceDigest = digest('mutated');
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      projectionEvents: events,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.PROJECTION_INVALID,
    });
  });

  it('rejects a replay with a different immutable input digest', async () => {
    const fixture = await agentScenario();
    const initialState = createAgentImprovementProjectionState() as AgentReplayProjection;
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      replay: {
        ...fixture.verification.replay,
        replay: {
          ...fixture.verification.replay.replay,
          replayInputDigests: { initial_state: digest({ changed: initialState }) },
        },
      },
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.FINGERPRINT_MISMATCH,
    });
  });

  it('rejects a certificate artifact set missing one role', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.certificate.body.artifactClaims.pop();
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'incomplete',
      code: AgentImprovementCertificateFailureCodes.MISSING_EVIDENCE,
    });
  });

  it('rejects an unauthorized result event reference', async () => {
    const fixture = await agentScenario();
    const bundle = structuredClone(fixture.bundle);
    bundle.receipts[0]!.facts.resultEventId = 'event-never-authorized';
    const result = await verifyAgentImprovementCertificateOffline({
      ...fixture.verification,
      bundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: AgentImprovementCertificateFailureCodes.TRANSITION_UNAUTHORIZED,
    });
  });
});
