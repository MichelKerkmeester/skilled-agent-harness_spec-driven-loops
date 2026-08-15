// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepImprovementCommonTransitionKinds,
  issueDeepImprovementCommonRunCertificate,
  parseDeepImprovementCommonCertificateBundle,
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
  DeepImprovementCommonModeMigrationGate,
  DeepImprovementCommonRollbackSwitch,
  evaluateDeepImprovementCommonRollbackWindow,
} from '../../lib/deep-improvement-common-rollback-gate/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonSealedArtifactStore,
  readDeepImprovementCommonArtifact,
  readDeepImprovementPromotionEvidence,
  sealDeepImprovementCommonArtifact,
} from '../../lib/deep-improvement-common-sealed-artifacts/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP,
  DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
  DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
  createDeepImprovementCommonModeGateInput,
  parseDeepImprovementCommonParityReceipt,
} from '../../lib/deep-improvement-common-shadow-parity/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  FROZEN_CENSUS_ROW_POLICIES,
  InflightDisposition,
  createClassificationManifest,
} from '../../lib/inflight-state-classification/index.js';
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
import { InitialArtifactKinds } from '../../lib/sealed-reference-artifacts/index.js';
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
import type { DeepImprovementCommonProjectionState } from '../../lib/deep-improvement-common-reducers/index.js';
import type { DeepImprovementCommonResumeDecision } from '../../lib/deep-improvement-common-resume-adapter/index.js';
import type {
  DeepImprovementCommonLifecycleEvidenceRow,
  DeepImprovementCommonModeGateInput,
  DeepImprovementCommonModeMigrationCertificate,
  DeepImprovementCommonRollbackRequest,
} from '../../lib/deep-improvement-common-rollback-gate/index.js';
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
  DeepImprovementCommonModeCertificateBinding,
  DeepImprovementCommonParityCertificateEvidenceBinding,
  DeepImprovementCommonParityReceipt,
  DeepImprovementCommonResumeParityEvidence,
} from '../../lib/deep-improvement-common-shadow-parity/index.js';
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
import type { CertificationProfile } from '../../lib/receipts-and-effect-recovery/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type {
  DrillInputBindings,
  InflightClassificationManifest as RollbackClassificationManifest,
  Phase014RollbackEvidenceInput,
  RollbackDrillClock,
  RollbackDrillManifest,
  RollbackDrillOptions,
  RollbackLaneState,
} from '../../lib/rollback-drills/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ParityCertificateBindings,
  ShadowParityCasePass,
} from '../../lib/shadow-parity/index.js';

type ReplayProjection = DeepImprovementCommonProjectionState & JsonObject;

interface CertificateScenario {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly verification: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>;
  readonly bindings: readonly DeepImprovementCommonSealedArtifactBinding[];
}

interface GateFixture {
  readonly input: DeepImprovementCommonModeGateInput<ReplayProjection>;
  readonly certificate: DeepImprovementCommonModeMigrationCertificate;
}

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const TIMESTAMP = '2026-07-23T09:00:00.000Z';
const VERIFICATION_TIME = '2026-07-23T09:30:00.000Z';
const BASE_SHA = '0360360360360360360360360360360360360360';
const RUN_ID = 'rollback-gate-run-1';
const LINEAGE_ID = 'rollback-gate-lineage-1';
const CANDIDATE_ID = 'candidate-1';
const EVALUATION_EPOCH_ID = 'evaluation-epoch-1';
const CANARY_EPOCH_ID = 'canary-epoch-1';
const CANARY_SUITE_ID = 'canary-suite-1';
const PROMOTION_ID = 'promotion-1';
const BASELINE_ID = 'baseline-1';
const STREAM_ID = 'deep-improvement-common-rollback-gate-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];
const ROLLBACK_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'deep-improvement-common-rollback-provider',
  key_id: 'deep-improvement-common-rollback-key',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const ROLLBACK_PROVIDER = createHmacCertificationProvider(
  ROLLBACK_PROFILE,
  'deep-improvement-common-rollback-secret-more-than-thirty-two-bytes',
);

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-improvement-common-rollback-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function hash(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
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
  const base = { runId: RUN_ID, lineageId: LINEAGE_ID, variant: 'agent-improvement' as const };
  const candidate = { ...base, candidateId: CANDIDATE_ID };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return { ...candidate, evaluationEpochId: EVALUATION_EPOCH_ID,
      fixtureId: 'fixture-1', observationId: 'observation-1' } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return { ...candidate, evaluationEpochId: EVALUATION_EPOCH_ID } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return { ...candidate, canaryEpochId: CANARY_EPOCH_ID,
      canarySuiteId: CANARY_SUITE_ID } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return { ...candidate, promotionId: PROMOTION_ID,
      baselineId: BASELINE_ID } as DeepImprovementCommonScopeMap[TStem];
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
  return prepareDeepImprovementCommonEvent({
    stem,
    scope: scopeFor(stem),
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: replayMetadata(),
    data,
    eventId: `rollback-gate-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-common-rollback-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `rollback-gate-event-${sequence}`,
  }, createDeepImprovementCommonEventRegistry()).envelope as DeepImprovementCommonEventEnvelope<TStem>;
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
  return { components: [{ dimensionCode: 'quality', rawScore: 0.91,
    normalizedScore: 0.91, weight: 1 }], aggregateScore: 0.91, uncertainty: 0.05 };
}

function happyEvents(): readonly DeepImprovementCommonLedgerEvent[] {
  const events: DeepImprovementCommonLedgerEvent[] = [];
  append(events, 'deep_improvement_common.run_started', {
    generation: 1, charterDigest: digest('charter'), configDigest: digest('config'),
    operatorRef: 'operator:deep-improvement', serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'), maxIterations: 4,
  });
  const proposal = append(events, 'deep_improvement_common.candidate_proposed', {
    proposalRef: 'proposal:candidate-1', proposalDigest: digest('proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite', mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null, targetRef: 'target:agent-1', targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  });
  append(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: proposal.event_id, proposalPayloadDigest: proposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1', candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1', mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const epoch = append(events, 'deep_improvement_common.evaluation_epoch_sealed', {
    evaluatorRef: 'evaluator:independent-1', evaluatorCapsuleDigest: digest('evaluator-capsule'),
    fixtureSetRef: 'profile:heldout-1', fixtureSetDigest: digest('fixture-set'),
    scorePolicyVersion: 'score-policy@1',
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    evaluationBudgetRef: 'budget:evaluation-1',
  });
  const started = append(events, 'deep_improvement_common.evaluation_started', {
    epochSealedEventId: epoch.event_id, epochPayloadDigest: epoch.payload.payloadDigest,
    executionReceiptRef: 'receipt:evaluation-start-1', fixtureCount: 1,
    evaluatorFingerprint: digest('evaluator-fingerprint'),
  });
  const observation = append(events, 'deep_improvement_common.evaluation_observation_recorded', {
    evaluationStartedEventId: started.event_id, evaluatorRef: 'evaluator:independent-1',
    fixtureRef: 'fixture:heldout-1', rawObservationRef: 'observation:raw-1',
    rawObservationDigest: digest('raw-observation'), executionReceiptRef: 'receipt:observation-1',
    observationOutcome: 'pass',
  });
  const normalized = append(events, 'deep_improvement_common.evaluation_normalized', {
    observationEventIds: [observation.event_id], observationSetDigest: digest('observation-set'),
    scorePolicyVersion: 'score-policy@1', scorerFingerprint: digest('scorer'),
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    scoreVector: scoreVector(), normalizationReceiptRef: 'receipt:normalization-1',
  });
  const requested = append(events, 'deep_improvement_common.evaluation_verification_requested', {
    normalizedEventId: normalized.event_id, normalizedPayloadDigest: normalized.payload.payloadDigest,
    verificationPolicyVersion: 'verification-policy@1', verifierRef: 'verifier:independent-1',
    reasonCode: 'promotion-bound-score',
  });
  append(events, 'deep_improvement_common.evaluation_verification_recorded', {
    requestEventId: requested.event_id, verifierRef: 'verifier:independent-1',
    verificationOutcome: 'confirmed', verificationEvidenceRef: 'evidence:verification-1',
    verificationEvidenceDigest: digest('verification-evidence'),
    verificationReceiptRef: 'receipt:verification-1',
  });
  const suite = append(events, 'deep_improvement_common.canary_suite_sealed', {
    suiteRef: 'canary-suite:sealed-1', suiteDigest: digest('canary-suite'),
    canaryPolicyVersion: 'canary-policy@1', fixtureCount: 2,
    protectedMaterialRef: 'protected:canary-1', protectedMaterialDigest: digest('protected-canary'),
  });
  const canary = append(events, 'deep_improvement_common.canary_executed', {
    suiteSealedEventId: suite.event_id, suitePayloadDigest: suite.payload.payloadDigest,
    executionReceiptRef: 'receipt:canary-execution-1', canaryObservationRef: 'canary-observation:1',
    canaryObservationDigest: digest('canary-observation'), outcome: 'pass',
  });
  const canaryGate = append(events, 'deep_improvement_common.canary_gate_passed', {
    executionEventIds: [canary.event_id], evidenceSetDigest: digest('canary-evidence'),
    policyVersion: 'canary-gate@1', policyFingerprint: digest('canary-policy'),
    decisionReceiptRef: 'receipt:canary-pass-1',
  });
  const promotion = append(events, 'deep_improvement_common.promotion_proposed', {
    normalizedEventId: normalized.event_id, normalizedPayloadDigest: normalized.payload.payloadDigest,
    canaryGateEventId: canaryGate.event_id, canaryGatePayloadDigest: canaryGate.payload.payloadDigest,
    proposalPolicyVersion: 'promotion-proposal@1', requestedRollout: 'shadow',
    evidenceSetDigest: digest('promotion-evidence'),
  });
  const authorization = append(events, 'deep_improvement_common.promotion_authorized', {
    proposalEventId: promotion.event_id, proposalPayloadDigest: promotion.payload.payloadDigest,
    externalAuthorizationRef: 'transition-authorization:decision-1',
    externalAuthorizationDigest: digest('authorization'),
    authorizationPolicyVersion: 'promotion-authorization@1',
    authorizationReceiptRef: 'receipt:promotion-authorization-1',
  });
  const rollout = append(events, 'deep_improvement_common.promotion_shadow_started', {
    authorizationEventId: authorization.event_id,
    authorizationPayloadDigest: authorization.payload.payloadDigest,
    rolloutRef: 'rollout:shadow-1', rolloutDigest: digest('rollout'), startedAt: TIMESTAMP,
  });
  append(events, 'deep_improvement_common.promotion_completed', {
    authorizationEventId: authorization.event_id, rolloutEventIds: [rollout.event_id],
    evidenceSetDigest: digest('promotion-completion-evidence'),
    completionReceiptRef: 'receipt:promotion-completion-1', completedAt: TIMESTAMP,
  });
  append(events, 'deep_improvement_common.run_completed', {
    terminalOutcome: 'completed', stopReason: 'converged', sessionOutcome: 'promoted',
    finalLedgerTailHash: digest(events.at(-1)), counts: { candidates: 1, evaluations: 1,
      observations: 1, canaryRuns: 1, promotions: 1 },
    completionEvidenceRefs: ['evidence:completion-1'],
  });
  return Object.freeze(events);
}

async function authorizedCertificateLedger(events: readonly DeepImprovementCommonLedgerEvent[]) {
  const registry = createEvidenceControlEventRegistry(deepImprovementCommonEventDefinitions());
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('certificate-ledger');
  const ledger = new AppendOnlyLedger({ rootDirectory, ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => FIXTURE_AUTHORITY }, registry);
  const gateway = new TransitionAuthorizationGateway({ rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => FIXTURE_AUTHORITY,
      identityResolver: ({ evaluationInput }) => ({
        actorId: evaluationInput.actorId,
        capabilityId: evaluationInput.capabilityId,
        evidenceDigest: evaluationInput.evidenceDigest,
      }),
    }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepImprovementCommonEvent({
      stem: event.payload.stem, scope: event.payload.scope,
      prevEventHash: event.payload.prevEventHash, replay: event.payload.replay,
      data: event.payload.data, eventId: event.event_id, streamId: event.stream_id,
      streamSequence: event.stream_sequence, occurredAt: event.occurred_at,
      recordedAt: event.recorded_at, producer: event.producer,
      authorityEpoch: event.authority_epoch, correlationId: event.correlation_id,
      causationId: event.causation_id, idempotencyKey: event.idempotency_key,
    }, registry);
    const request = await createFixtureRequest(ledger, prepared, policies, `certificate-request-${index + 1}`);
    const authorization = await gateway.authorize(request);
    if (authorization.verdict !== 'allow') throw new Error('Expected certificate authorization');
    await appendAuthorizedForTest(ledger, prepared, authorization.proof);
  }
  const coordinator = new FencedLeaseCoordinator({ rootDirectory, operationTimeoutMs: 5_000 });
  const lease = await coordinator.acquire({ resource: { kind: ProtectedResourceKinds.LEDGER,
    components: { ledgerId: ledger.ledgerId }, atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM },
  ownerId: 'certificate-writer', correlationId: 'certificate-writer', ttlMs: 300_000,
  acquireTimeoutMs: 5_000 });
  const writer = new AuthorizedEvidenceWriter({ ledger,
    ledgerFence: { writer: new FencedLedgerWriter(coordinator), currentLease: () => lease },
    gateway, policies, registry, authorizationContext: (event) => ({ mode: 'improvement',
      priorStateVersion: 'certificate-state@1', priorStateFingerprint: digest('certificate-state'),
      actorId: 'certificate-writer', capabilityId: 'write', authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy', policyVersion: 1, evidenceDigest: event.canonicalDigest }) });
  const receiptSubstrate: DeepImprovementCommonTransitionReceiptSubstrate = {
    writer, registry, producer: { name: 'rollback-gate-tests', version: '1' },
  };
  return { ledger, registry, receiptSubstrate };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepImprovementCommonWireEventTypes).map((eventType) => ({
      eventType, reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepImprovementCommonVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{ reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'], reducerRegistry }]);
}

function providers(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([createHmacCertificationProvider({
    scheme: 'hmac-sha256', provider_id: 'deep-improvement-test-provider',
    key_id: 'deep-improvement-test-key', verifier_version: 'verifier@1',
    trust_scope: 'durable-cross-resume',
  }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')]);
}

function origin(events: readonly DeepImprovementCommonLedgerEvent[], stem: DeepImprovementCommonEventStem) {
  const event = events.find((entry) => entry.payload.stem === stem);
  if (!event) throw new Error(`Missing origin ${stem}`);
  return { eventStem: stem, eventId: event.event_id, payloadDigest: event.payload.payloadDigest };
}

function locator(label: string) {
  return { scheme: 'artifact' as const, locatorDigest: digest(`locator:${label}`),
    selector: `artifact:${label}`, revision: 'revision-1' };
}

function dependency(purpose: string, reference: SealedArtifactReference) {
  return { purpose, reference };
}

async function certificateArtifacts(events: readonly DeepImprovementCommonLedgerEvent[]) {
  const store = createDeepImprovementCommonSealedArtifactStore({
    rootDirectory: temporaryRoot('certificate-artifacts'),
    now: () => new Date(VERIFICATION_TIME),
  });
  const fixtures = await Promise.all(Array.from({ length: 12 }, (_, index) => (
    store.seal(InitialArtifactKinds.FIXTURE, { fixture: index + 1 })
  )));
  const fixture = (index: number): SealedArtifactReference => {
    const reference = fixtures[index]?.artifact.reference;
    if (!reference) throw new Error(`Missing fixture ${index}`);
    return reference;
  };
  const evaluatorMaterial: DeepImprovementEvaluatorCapsuleMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'evaluator-capsule-1',
    evaluatorEpochId: EVALUATION_EPOCH_ID, evaluatorImplementationDigest: digest('evaluator-capsule'),
    evaluatorSchemaDigest: digest('evaluator-schema'), rubricDigest: digest('rubric'),
    policyDigest: digest('policy'), fixtureManifestDigest: digest('fixture-set'),
    hiddenAnchorCommitmentDigest: digest('hidden-anchor'), calibrationDigest: digest('calibration'),
    normalizationDigest: digest('normalization'), environmentDigest: digest('environment'),
    capabilityDigest: digest('capability'), visibilityPolicy: { candidateView: 'verdict-band',
      hiddenFixtures: 'withheld', exactScores: 'withheld', evaluatorInternals: 'withheld',
      terminalEvidence: 'withheld' }, budgetPolicy: { maxQueries: 20, maxBytes: 4096,
      maxWallClockMs: 1000, maxCostMicros: 5000 },
    dependencyReferences: [dependency('fixture', fixture(0))],
    originEvent: origin(events, 'deep_improvement_common.evaluation_epoch_sealed'),
    producerVersion: 'evaluator-producer@1', locator: locator('evaluator'),
  };
  const evaluator = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, evaluatorMaterial,
  );
  const candidateMaterial: DeepImprovementCandidateInputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'candidate-input-1',
    candidateId: CANDIDATE_ID, lineageId: LINEAGE_ID, evaluatorEpochId: EVALUATION_EPOCH_ID,
    parentCandidateReference: null, mutationOperatorReference: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1', profileScopeDigest: digest('profile'),
    modelConfigurationDigest: digest('model'), promptConfigurationDigest: digest('prompt'),
    toolConfigurationDigest: digest('tools'), selectedFixtureManifestDigest: digest('fixture-set'),
    seed: 7, sourceArtifactReferences: [fixture(1)],
    dependencyReferences: [dependency('evaluator', evaluator.reference), dependency('source', fixture(1))],
    originEvent: origin(events, 'deep_improvement_common.candidate_generated'),
    producerVersion: 'candidate-producer@1', locator: locator('candidate'),
  };
  const candidate = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT, candidateMaterial,
  );
  const baselineMaterial: DeepImprovementBaselineInputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'baseline-input-1',
    baselineId: BASELINE_ID, lineageId: LINEAGE_ID, evaluatorEpochId: EVALUATION_EPOCH_ID,
    incumbentReference: fixture(2), profileScopeDigest: digest('profile'),
    modelConfigurationDigest: digest('baseline-model'), promptConfigurationDigest: digest('baseline-prompt'),
    toolConfigurationDigest: digest('baseline-tools'), selectedFixtureManifestDigest: digest('fixture-set'),
    seed: 7, sourceArtifactReferences: [fixture(2)],
    dependencyReferences: [dependency('evaluator', evaluator.reference), dependency('incumbent', fixture(2))],
    originEvent: origin(events, 'deep_improvement_common.run_started'),
    producerVersion: 'baseline-producer@1', locator: locator('baseline'),
  };
  const baseline = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.BASELINE_INPUT, baselineMaterial,
  );
  const rawMaterial: DeepImprovementRawTrialOutputMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'raw-trial-output-1',
    trialId: 'trial-1', candidateInputReference: candidate.reference,
    baselineInputReference: baseline.reference, evaluatorCapsuleReference: evaluator.reference,
    evaluationEpochId: EVALUATION_EPOCH_ID, fixtureId: 'fixture:heldout-1',
    caseObservations: [{ caseId: 'case-1', outputDigest: digest('case-output'),
      outputReference: fixture(3), scoreVectorDigest: digest('score-vector') }],
    rawScoreVector: scoreVector(), traceReferences: [fixture(4)], usage: { inputTokens: 10,
      outputTokens: 5, totalTokens: 15, costMicros: 30, latencyMs: 50 },
    executionEnvironmentDigest: digest('execution-environment'), integrityObservations: [{
      status: 'confirmed', detectorDigest: digest('integrity-detector'),
      evidenceDigest: digest('integrity-evidence') }], normalizationVersion: 'normalization@1',
    dependencyReferences: [dependency('candidate', candidate.reference),
      dependency('baseline', baseline.reference), dependency('evaluator', evaluator.reference),
      dependency('output', fixture(3)), dependency('trace', fixture(4))],
    originEvent: origin(events, 'deep_improvement_common.evaluation_observation_recorded'),
    producerVersion: 'trial-producer@1', locator: locator('raw-trial'),
  };
  const raw = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT, rawMaterial,
  );
  const canaryMaterial: DeepImprovementCanaryEpochMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'canary-epoch-1',
    canaryEpochId: CANARY_EPOCH_ID, evaluatorEpochId: EVALUATION_EPOCH_ID,
    suiteId: CANARY_SUITE_ID, lifecycle: 'active', suiteManifestDigest: digest('canary-suite'),
    hiddenAnchorCommitmentDigest: digest('hidden-anchor'), adversarialSuiteDigest: digest('adversarial'),
    metamorphicSuiteDigest: digest('metamorphic'), crossDomainSuiteDigest: digest('cross-domain'),
    leakagePolicy: { literalLeakDetection: 'required', semanticLeakDetection: 'required',
      candidateVisibleContent: 'withheld' }, freshnessWindowSeconds: 3600,
    sealedAt: TIMESTAMP, expiresAt: '2026-07-23T10:00:00.000Z', supersedesReference: null,
    dependencyReferences: [dependency('evaluator', evaluator.reference)],
    originEvent: origin(events, 'deep_improvement_common.canary_suite_sealed'),
    producerVersion: 'canary-producer@1', locator: locator('canary'),
  };
  const canary = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.CANARY_EPOCH, canaryMaterial,
  );
  const refs = [candidate.reference, baseline.reference, evaluator.reference, canary.reference,
    fixture(5), fixture(6), fixture(7), fixture(8), fixture(9), fixture(10), fixture(11), fixture(0)] as const;
  const promotionMaterial: DeepImprovementPromotionEvidenceMaterial = {
    schemaVersion: 'deep-improvement-common-artifact@1', artifactId: 'promotion-evidence-1',
    promotionId: PROMOTION_ID, evaluatorEpochId: EVALUATION_EPOCH_ID,
    candidateInputReference: refs[0], baselineInputReference: refs[1], evaluatorCapsuleReference: refs[2],
    canaryEpochReference: refs[3], targetRepairEvidenceReference: refs[4],
    baselinePreservationEvidenceReference: refs[5], criticalDimensionEvidenceReference: refs[6],
    evaluatorIntegrityEvidenceReference: refs[7], canaryOutcomeEvidenceReference: refs[8],
    uncertaintyEvidenceReference: refs[9], costEvidenceReference: refs[10], rollbackTargetReference: refs[11],
    targetRepair: 'pass', baselinePreservation: 'pass', criticalDimensions: 'pass',
    evaluatorIntegrity: 'pass', canaryOutcome: 'pass', uncertaintyLowerBound: 0.8,
    uncertaintyThreshold: 0.7, costMicros: 30, costLimitMicros: 100,
    unresolvedEvidenceDigests: [], vetoEvidenceDigests: [], admissibility: 'eligible',
    dependencyReferences: refs.map((reference, index) => dependency(`promotion-${index}`, reference)),
    originEvent: origin(events, 'deep_improvement_common.promotion_proposed'),
    producerVersion: 'promotion-producer@1', locator: locator('promotion'),
  };
  const promotion = await sealDeepImprovementCommonArtifact(
    store, DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE, promotionMaterial,
  );
  return { store, bindings: Object.freeze([candidate, baseline, evaluator, raw, canary, promotion]) };
}

function transitionInputs(
  events: readonly DeepImprovementCommonLedgerEvent[],
  bindings: readonly DeepImprovementCommonSealedArtifactBinding[],
): readonly DeepImprovementCommonTransitionReceiptInput[] {
  const reference = (kind: DeepImprovementCommonSealedArtifactBinding['artifactKind']): string => {
    const match = bindings.find((entry) => entry.artifactKind === kind);
    if (!match) throw new Error(`Missing binding ${kind}`);
    return match.reference.qualified_digest;
  };
  const eventId = (stem: DeepImprovementCommonEventStem): string => {
    const match = events.find((entry) => entry.payload.stem === stem);
    if (!match) throw new Error(`Missing event ${stem}`);
    return match.event_id;
  };
  const candidate = reference(DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT);
  const baseline = reference(DeepImprovementCommonArtifactKinds.BASELINE_INPUT);
  const evaluator = reference(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE);
  const raw = reference(DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT);
  const canary = reference(DeepImprovementCommonArtifactKinds.CANARY_EPOCH);
  const promotion = reference(DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE);
  const make = (transitionKind: DeepImprovementCommonTransitionReceiptInput['transitionKind'],
    stem: DeepImprovementCommonEventStem, inputs: readonly string[], outputs: readonly string[]) => ({
    transitionKind, logicalOperationId: `logical:${transitionKind}`,
    effectIdempotencyKey: `effect:${transitionKind}`, attemptNumber: 1, resultEventId: eventId(stem),
    inputArtifactQualifiedDigests: inputs, outputArtifactQualifiedDigests: outputs,
    evidenceArtifactQualifiedDigests: [],
  });
  return Object.freeze([
    make(DeepImprovementCommonTransitionKinds.CANDIDATE_GENERATED,
      'deep_improvement_common.candidate_generated', [], [candidate, baseline]),
    make(DeepImprovementCommonTransitionKinds.EVALUATOR_EPOCH_ESTABLISHED,
      'deep_improvement_common.evaluation_epoch_sealed', [candidate], [evaluator]),
    make(DeepImprovementCommonTransitionKinds.EVALUATION_STARTED,
      'deep_improvement_common.evaluation_started', [candidate, evaluator], []),
    make(DeepImprovementCommonTransitionKinds.CANDIDATE_SCORED,
      'deep_improvement_common.evaluation_normalized', [candidate, baseline, evaluator], [raw]),
    make(DeepImprovementCommonTransitionKinds.CANARY_CHECKED,
      'deep_improvement_common.canary_gate_passed', [raw, evaluator], [canary]),
    make(DeepImprovementCommonTransitionKinds.PROMOTION_PROPOSED,
      'deep_improvement_common.promotion_proposed', [candidate, baseline, raw, canary], [promotion]),
    make(DeepImprovementCommonTransitionKinds.PROMOTION_AUTHORIZED,
      'deep_improvement_common.promotion_authorized', [promotion], []),
    make(DeepImprovementCommonTransitionKinds.GUARDED_PROMOTION,
      'deep_improvement_common.promotion_completed', [promotion], []),
  ]);
}

async function certificateScenario(): Promise<CertificateScenario> {
  const events = happyEvents();
  const { ledger, registry, receiptSubstrate } = await authorizedCertificateLedger(events);
  const { store, bindings } = await certificateArtifacts(events);
  const certificationProviders = providers();
  const initialState = createDeepImprovementCommonProjectionState() as ReplayProjection;
  const replay: DeepImprovementCommonOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger, eventRegistry: registry, versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(), runId: RUN_ID, rangeStartSequence: 1,
    rangeEndSequence: events.length, replay: { reducerId: DEEP_IMPROVEMENT_COMMON_REDUCER_ID,
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
      initialState, replayInputDigests: { initial_state: digest(initialState) } } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  const bundle = await issueDeepImprovementCommonRunCertificate({
    runId: RUN_ID, lineageId: LINEAGE_ID, generation: 1, projectionEvents: events,
    artifactStore: store, artifactBindings: bindings, transitionReceipts: transitionInputs(events, bindings),
    replay, certificationProfile: certificationProviders.inspect()[0]!, providers: certificationProviders,
    receiptSubstrate, serviceVersion: 'deep-improvement-common-certificates@1',
    issuer: 'rollback-gate-certificate-issuer', issuedAt: TIMESTAMP,
    verificationTime: VERIFICATION_TIME,
  });
  return { bundle, bindings, verification: { bundle, projectionEvents: events,
    artifactStore: store, replay, providers: certificationProviders, verificationTime: VERIFICATION_TIME } };
}

const DIFF_CLASSES = ['artifact', 'causal-link', 'canary', 'duplicated', 'evaluator-integrity',
  'extra', 'malformed', 'missing', 'nondeterministic', 'payload', 'projection', 'promotion',
  'receipt', 'reference-digest', 'reordered', 'stale', 'telemetry-gap', 'terminal-decision',
  'unauthorized', 'unsupported-version'] as const;

function comparatorConfigDigest(): string {
  return digest({ comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    lifecycleMap: DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP,
    volatilityAllowlist: DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
    diffClasses: DIFF_CLASSES, logicalIdentityFields: ['eventStem', 'runId', 'lineageId', 'variant',
      'candidateId', 'evaluationEpochId', 'fixtureId', 'observationId', 'canaryEpochId',
      'canarySuiteId', 'promotionId', 'baselineId', 'producerSequence'] });
}

function parityCertificateBindings(
  manifestDigest: string,
  evidence: readonly DeepImprovementCommonParityCertificateEvidenceBinding[],
  modeBinding: DeepImprovementCommonModeCertificateBinding,
): ParityCertificateBindings {
  return {
    candidate_build_digest: digest({ manifestDigest,
      schemaVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
      modeCertificateDigest: modeBinding.certificateDigest }),
    harness_digest: digest({ legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-improvement-common-reducers', shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-improvement-common-resume-adapter',
      certificate: 'runtime/lib/deep-improvement-common-certificates' }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({ reducerId: 'deep-improvement-common:shadow-parity-fold',
      reducerVersion: 'deep-improvement-common-shadow-parity-reducer@1',
      projectionVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION }),
    reducer_digest: digest({ reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({ adapterVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP,
      certificateEvidenceBindings: evidence,
      modeCertificateBindingDigest: modeBinding.bindingDigest }),
    policy_version: 'deep-improvement-common-shadow-only@1',
  };
}

async function parityEvidence(certificate: CertificateScenario, authorized = true) {
  const rootDirectory = temporaryRoot('parity-audit');
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
  const ledger = new AppendOnlyLedger({ rootDirectory, ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => authority }, registry);
  const gateway = new TransitionAuthorizationGateway({ rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => authority,
      identityResolver: ({ evaluationInput }) => ({
        actorId: evaluationInput.actorId,
        capabilityId: evaluationInput.capabilityId,
        evidenceDigest: evaluationInput.evidenceDigest,
      }),
    }, ledger, policies);
  const event = createFixtureEvent(registry, 1);
  const attestationDigest = hash('common-parity-attestation');
  if (authorized) {
    const request = await createFixtureRequest(ledger, event, policies, 'common-parity-anchor', {
      mode: 'deep-improvement-common', evidenceDigest: attestationDigest,
    });
    expect((await gateway.authorize(request)).verdict).toBe('allow');
  }
  const fixtureId = 'fixture-authenticated-common';
  const contractDigest = hash('common-contract');
  const manifest = compileParityCaseManifest({ baseSha: BASE_SHA,
    baselineRows: [{ scenarioId: fixtureId, mode: 'deep-improvement-common', contractDigest,
      disposition: 'protected' }], cases: [{ caseId: fixtureId, scenarioId: fixtureId,
      mode: 'deep-improvement-common', contractDigest, requiredObservations: ['ordered-transitions'],
      projectionIds: ['common'], timeoutMs: 1000, terminationPolicy: 'bounded' }] });
  const verification = await verifyDeepImprovementCommonCertificateOffline(certificate.verification);
  if (verification.verdict !== 'valid') throw new Error('Expected valid common certificate');
  const modeBody = { bundle: certificate.bundle,
    certificateDigest: certificate.bundle.certificate.certificateDigest,
    verificationReceipt: verification.verificationReceipt,
    manifestDigest: manifest.manifestDigest,
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    caseSetDigest: digest([fixtureId]) };
  const modeBinding: DeepImprovementCommonModeCertificateBinding = Object.freeze({
    ...modeBody, bindingDigest: digest(modeBody),
  });
  const projectionDigest = hash('common-parity-projection');
  const evidenceBinding: DeepImprovementCommonParityCertificateEvidenceBinding = Object.freeze({
    fixtureId, legacyStreamDigest: event.canonicalDigest, ledgerStreamDigest: event.canonicalDigest,
    legacyProjectionFingerprint: projectionDigest, ledgerProjectionFingerprint: projectionDigest,
    caseEvidenceDigest: hash('common-case-evidence'), referenceSetDigest: hash('common-reference-set'),
    attestationFinalDigests: [attestationDigest],
  });
  const pass: ShadowParityCasePass = { ok: true, caseId: fixtureId,
    mode: 'deep-improvement-common', referenceSetDigest: evidenceBinding.referenceSetDigest,
    capsuleDigest: hash('common-capsule'), runs: [1, 2].map((runIndex) => ({ runIndex,
      legacy: { finalDigest: attestationDigest, descriptorDigest: hash('descriptor'),
        storedDigest: hash('stored'), effectiveEventDigest: hash('effective'),
        projectionDigest, replayContractDigest: hash('replay-contract'),
        sealedInputDigest: hash('sealed'), attestationSequence: runIndex,
        descriptor: { upcaster_registry_digest: hash('upcaster-registry'),
          ordered_chain_identities: [] } as never },
      dark: { finalDigest: attestationDigest, descriptorDigest: hash('descriptor'),
        storedDigest: hash('stored'), effectiveEventDigest: hash('effective'),
        projectionDigest, replayContractDigest: hash('replay-contract'),
        sealedInputDigest: hash('sealed'), attestationSequence: runIndex,
        descriptor: { upcaster_registry_digest: hash('upcaster-registry'),
          ordered_chain_identities: [] } as never },
      observationDigest: hash('observation'), legacyProjectionDigest: projectionDigest,
      darkProjectionDigest: projectionDigest, runEvidenceDigest: hash(`common-run-${runIndex}`) })),
    evidenceDigest: evidenceBinding.caseEvidenceDigest, openDivergenceCount: 0,
    authorityState: 'legacy_authoritative', authorityMutation: false };
  const bindings = parityCertificateBindings(manifest.manifestDigest, [evidenceBinding], modeBinding);
  const issued = issueParityCertificate({ manifest, mode: 'deep-improvement-common',
    caseResults: [pass], bindings });
  if (!issued.ok) throw new Error(issued.refusal.message);
  const body = { schemaVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `receipt-${fixtureId}`, baseSha: BASE_SHA, runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: 'deep-improvement-common-event@1',
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    projectionVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(), fixtureId,
    legacyStreamDigest: event.canonicalDigest, ledgerStreamDigest: event.canonicalDigest,
    legacyProjectionFingerprint: projectionDigest, ledgerProjectionFingerprint: projectionDigest,
    exitStatus: 'green' as const, diffDispositions: [], parityCertificate: issued.certificate,
    certificateEvidenceBindings: [evidenceBinding],
    parityCertificateDigest: issued.certificate.certificate_digest,
    modeCertificateBinding: modeBinding, certificateStatus: 'issued' as const,
    certificateRefusalCode: null, genericDivergenceId: null, genericDivergenceClass: null,
    authorityState: 'legacy-authoritative' as const, authorityMutation: false as const,
    cutoverCertificate: false as const,
    reproducibilityDigest: digest({ baseSha: BASE_SHA, runManifestDigest: manifest.manifestDigest,
      fixtureId, legacyStreamDigest: event.canonicalDigest, ledgerStreamDigest: event.canonicalDigest,
      legacyProjectionFingerprint: projectionDigest, ledgerProjectionFingerprint: projectionDigest,
      diffDispositions: [], modeCertificateBindingDigest: modeBinding.bindingDigest }) };
  const receipt = parseDeepImprovementCommonParityReceipt({ ...body, receiptDigest: digest(body) }, manifest);
  return { rootDirectory, manifest, receipt,
    modeGateInput: createDeepImprovementCommonModeGateInput({ manifest,
      expectedFixtureIds: [fixtureId], receipts: [receipt] }) };
}

class RollbackGateClock implements RollbackDrillClock {
  #instant = Date.parse('2026-07-10T00:00:00.000Z');
  public now(): Date { return new Date(this.#instant); }
  public advance(milliseconds: number): void { this.#instant += milliseconds; }
}

function rollbackDrillClassification(): RollbackClassificationManifest {
  const rows = CENSUS.rows.map((row) => ({ rowId: row.id,
    stateDigest: digest(`rollback-state:${row.id}`), shapeVersion: 'census-v1',
    lifecyclePoint: row.lifecycle, authorityEpoch: 7, mutability: row.mutability,
    activeLeaseIds: [], pendingEffectIds: [], identityCoverageComplete: true,
    orderCoverageComplete: true, rollbackAnchorDigest: digest(`rollback-anchor:${row.id}`),
    disposition: 'UPCAST' as const, reasonCode: 'sandbox-upcast-covered',
    verifier: 'rollback-gate-drill-verifier', terminalReceiptId: null, isQuiescent: true }));
  return { expectedRowIds: rows.map((row) => row.rowId), rows };
}

function rollbackDrillManifest(clock: RollbackGateClock): RollbackDrillManifest {
  const classification = rollbackDrillClassification();
  const anchorState: RollbackLaneState = { facts: ['sealed-anchor-fact'],
    artifacts: { seed: 'stable' }, completedSteps: 1 };
  const anchorId = 'deep-improvement-common-rollback-anchor';
  const anchorDigest = rollbackAnchorDigest(anchorId, anchorState);
  const bindings: DrillInputBindings = { adapterRegistry: digest('rollback-adapter-registry'),
    base: digest('rollback-base'), candidate: digest('rollback-candidate'),
    classificationManifest: classificationManifestDigest(classification),
    contractDefectLedger: digest('rollback-contract-defect-ledger'),
    eventSchemaCensus: digest('rollback-event-schema-census'),
    fingerprintContract: digest('rollback-fingerprint-contract'), modeRegistry: digest('rollback-mode-registry'),
    parityCertificate: digest('rollback-parity-certificate'), phaseTree: digest('rollback-phase-tree'),
    policy: digest('rollback-policy'), projectionContract: digest('rollback-projection-contract'),
    receiptContract: digest('rollback-receipt-contract'), rollbackAsset: anchorDigest };
  const now = clock.now().getTime();
  return { schemaVersion: ROLLBACK_DRILL_SCHEMA_VERSION,
    drillId: 'deep-improvement-common-rollback-gate-drill', mode: 'deep-improvement-common',
    baseSha: digest('rollback-base-commit').slice(0, 40),
    candidateSha: digest('rollback-candidate-commit').slice(0, 40),
    policyVersion: 'rollback-policy@1', verifierIdentity: 'rollback-gate-drill-verifier',
    startingAuthorityEpoch: 7, legacyWriterId: 'legacy-writer', spineWriterId: 'spine-writer',
    bindings, parityUnresolvedDivergences: 0, classification,
    rollbackAnchor: { anchorId, state: anchorState, digest: anchorDigest },
    workload: { factIds: ['continued-fact-a'], artifactName: 'result.json',
      artifactContent: '{"status":"complete"}' },
    rollbackWindow: { openedAt: new Date(now - 9 * 86_400_000).toISOString(),
      successfulAuthoritativeRuns: 5, minimumCalendarDays: 14, minimumSuccessfulRuns: 5,
      stricterDeadlineAt: new Date(now + 3_600_000).toISOString() },
    fault: { fixture: RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH,
      expectedDetector: DetectorByFaultFixture[RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH],
      cutPoint: 'after-durable-spine-work', timeoutMs: 100 } };
}

async function phase014Evidence(classificationDigest: string) {
  const clock = new RollbackGateClock();
  const manifest = rollbackDrillManifest(clock);
  const sandboxRoot = mkdtempSync(join(tmpdir(), 'deep-loop-rollback-drill-'));
  temporaryRoots.push(sandboxRoot);
  const protectedRoot = temporaryRoot('rollback-protected');
  const protectedFile = join(protectedRoot, 'live-authority.json');
  writeFileSync(protectedFile, '{"state":"legacy_authoritative","epoch":41}\n', { mode: 0o600 });
  const options: RollbackDrillOptions = { manifest, currentMode: 'deep-improvement-common',
    currentBindings: manifest.bindings, sandboxRoot,
    protectedPaths: [{ id: 'live-authority', path: protectedFile }],
    certificationProvider: ROLLBACK_PROVIDER, certificationProfile: ROLLBACK_PROFILE, clock };
  const result = await runRollbackDrill(options);
  const currentBindings = Object.freeze({ ...result.certificate.facts.bindings,
    classificationManifest: classificationDigest });
  const facts = Object.freeze({ ...result.certificate.facts, bindings: currentBindings,
    classificationDigest });
  const certificate = await createRollbackDrillCertificate(facts, ROLLBACK_PROVIDER, ROLLBACK_PROFILE);
  const certificatePath = writeImmutableRollbackCertificate(
    temporaryRoot('rollback-certificate'), 'rollback-certificate.json', certificate,
  );
  const evidence: Phase014RollbackEvidenceInput = { certificatePath,
    expectedMode: 'deep-improvement-common', currentBindings,
    certificationProvider: ROLLBACK_PROVIDER };
  return { evidence, candidateSha: facts.candidateSha, verifierIdentity: facts.verifierIdentity,
    verifierVersion: certificate.certification.verifier_version,
    rollbackAnchorDigest: facts.bindings.rollbackAsset };
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
        effectNamespace: `effects-${rowId}`, shadowOnlySink: true, livePublicationEnabled: false,
        sourceStateUnchanged: true, authorityUnaffected: true, budgetsUnaffected: true };
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
  const policy = FROZEN_CENSUS_ROW_POLICIES[row.id as keyof typeof FROZEN_CENSUS_ROW_POLICIES];
  const pin = policy.disposition === InflightDisposition.PIN;
  const block = policy.disposition === InflightDisposition.BLOCK;
  return { rowId: row.id, isPresent: !block, stateDigest: hash(`${row.id}:state`),
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
        ? hash(`${row.id}:parity`) : null }, proof: proofFor(row.id, policy.disposition) };
}

function classificationManifest(): InflightClassificationManifest {
  return createClassificationManifest({ classificationId: 'deep-improvement-common-rollback-classification',
    classifiedAt: '2026-07-22T12:00:00Z', classifierBuildId: 'rollback-gate-tests',
    censusBytes: CENSUS_BYTES, evidence: CENSUS.rows.map(evidenceFor) }).manifest;
}

function resumeDecision(label: string, certificate: CertificateScenario) {
  const body = { decisionVersion: 1 as const, decisionId: `decision-${label}`,
    idempotencyKey: 'resume-common-1', requestDigest: hash('resume-request'),
    authority: 'dark-evidence-only' as const, legacyAuthority: 'unchanged' as const,
    productionCompletion: false as const, disposition: 'exact-reuse' as const,
    compatibilityOutcome: 'exact' as const, priorCertificateVerdict: 'PASS',
    offlineVerificationVerdict: 'valid' as const, persistedFingerprint: null,
    currentFingerprint: null, compatibility: [], branches: [], effects: [],
    invalidation: { changedComponents: [], invalidatedOperationIds: [],
      recoveryRequiredEffectIds: [], rebuildRequired: false },
    lease: { runId: RUN_ID, leaseId: 'resume-lease-1', lineageId: LINEAGE_ID,
      generation: 1, deadlineAt: '2026-07-23T10:00:00.000Z', remainingMs: 1_800_000,
      certificateDigest: certificate.bundle.certificate.certificateDigest,
      replayFingerprint: certificate.bundle.certificate.body.replayFingerprint },
    decisionReason: 'Verified common-service evidence is reusable.' };
  return Object.freeze({ ...body, decisionDigest: digest(body) });
}

function changeResumeDecision(
  decision: DeepImprovementCommonResumeDecision,
  overrides: Partial<DeepImprovementCommonResumeDecision>,
): DeepImprovementCommonResumeDecision {
  const { decisionDigest: _ignored, ...body } = decision;
  const changed = { ...body, ...overrides };
  return Object.freeze({ ...changed, decisionDigest: digest(changed) });
}

function resumeEvidence(certificate: CertificateScenario): DeepImprovementCommonResumeParityEvidence {
  return { legacyDecision: resumeDecision('legacy', certificate),
    ledgerDecision: resumeDecision('ledger', certificate),
    legacyEventTailDigest: hash('resume-tail'), ledgerEventTailDigest: hash('resume-tail'),
    legacyFreshProjectionFingerprint: hash('resume-projection'),
    ledgerFreshProjectionFingerprint: hash('resume-projection') };
}

function healthyAggregate(): HealthAggregate {
  return { schemaVersion: 1, aggregateId: 'common-health-aggregate', state: 'healthy',
    severity: 'info', observationId: 'common-health-observation', activeSignalIds: [],
    policyVersion: 'health-policy@1', policyDigest: hash('health-policy') };
}

function successfulExecutions(count = 5) {
  return Array.from({ length: count }, (_, index) => ({ executionId: `execution-${index + 1}`,
    authorityState: 'new_authoritative_reversible' as const, authorityEpoch: 2,
    result: 'trusted-completion' as const, certificateDigest: hash(`execution-certificate-${index + 1}`) }));
}

function lifecycleRows(
  parityReceipt: DeepImprovementCommonParityReceipt,
  certificate: CertificateScenario,
): readonly DeepImprovementCommonLifecycleEvidenceRow[] {
  const bundle = parseDeepImprovementCommonCertificateBundle(certificate.bundle);
  const identities = [{ fixtureId: parityReceipt.fixtureId,
    eventDigest: parityReceipt.ledgerStreamDigest, receiptDigest: parityReceipt.receiptDigest },
  ...bundle.receipts.map((entry) => ({ fixtureId: entry.facts.logicalOperationId,
    eventDigest: entry.facts.resultEventDigest, receiptDigest: entry.receiptDigest })),
  ...certificate.bindings.map((entry) => ({ fixtureId: entry.artifactKind,
    eventDigest: entry.reference.content_digest, receiptDigest: entry.reference.descriptor_digest }))];
  const kinds: readonly DeepImprovementCommonLifecycleEvidenceRow['kind'][] = [
    'evaluator-epoch', 'candidate-lineage', 'raw-evaluation', 'score-normalization',
    'canary-execution', 'guarded-promotion', 'abort', 'restore', 'replay', 'resume',
    'duplicate-delivery', 'unknown-effect', 'incomplete-evidence',
  ];
  return kinds.map((kind, index) => {
    const identity = identities[index];
    if (!identity) throw new Error('Lifecycle fixture is incomplete');
    return { kind, ...identity, status: 'covered' };
  });
}

async function validGateFixture(): Promise<GateFixture> {
  const certificate = await certificateScenario();
  const parity = await parityEvidence(certificate, true);
  const classification = classificationManifest();
  const rollback = await phase014Evidence(classification.finalDigest);
  const input: DeepImprovementCommonModeGateInput<ReplayProjection> = {
    candidateSha: rollback.candidateSha, baseSha: BASE_SHA,
    sharedContractDigest: hash('shared-contract'), writeSetDigest: hash('write-set'),
    versions: { eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-improvement-common-event@1',
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
      projectionVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION },
    verifierIdentity: rollback.verifierIdentity, verifierVersion: rollback.verifierVersion,
    authority: { state: 'legacy_authoritative', epoch: 1 },
    parity: { manifest: parity.manifest, modeGateInput: parity.modeGateInput,
      receipts: [parity.receipt], authorizationAuditRootDirectory: parity.rootDirectory,
      authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID },
    sealedArtifacts: { store: certificate.verification.artifactStore, bindings: certificate.bindings },
    certificates: { verificationInput: certificate.verification },
    resumeEvidence: resumeEvidence(certificate), lifecycle: lifecycleRows(parity.receipt, certificate),
    rollback: { phase014Evidence: rollback.evidence, classificationManifest: classification,
      healthAggregate: healthyAggregate(), rollbackAnchorDigest: rollback.rollbackAnchorDigest },
    rollbackWindow: { openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z', executions: successfulExecutions(),
      unresolvedEvidenceCount: 0, lowTraffic: false }, unresolvedRiskIds: [],
  };
  const result = await new DeepImprovementCommonModeMigrationGate().evaluate(input);
  if (result.certificate === null) {
    throw new Error(`Expected valid gate fixture: ${JSON.stringify(result.dispositions)}`);
  }
  return { input, certificate: result.certificate };
}

let sharedFixture: GateFixture;

beforeAll(async () => {
  sharedFixture = await validGateFixture();
}, 120_000);

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('deep improvement common rollback window', () => {
  it('requires fourteen days and five distinct authoritative executions without closing authority', () => {
    const belowCount = evaluateDeepImprovementCommonRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulExecutions(4), unresolvedEvidenceCount: 0, lowTraffic: false,
    });
    const belowDays = evaluateDeepImprovementCommonRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-14T23:59:59Z',
      executions: successfulExecutions(), unresolvedEvidenceCount: 0, lowTraffic: false,
    });
    const eligible = evaluateDeepImprovementCommonRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulExecutions(), unresolvedEvidenceCount: 0, lowTraffic: false,
    });
    expect(belowCount.state).toBe('open');
    expect(belowDays.state).toBe('open');
    expect(eligible).toMatchObject({ state: 'eligible_to_close',
      successfulAuthoritativeExecutions: 5, windowClosed: false });
  });

  it('deduplicates connected execution and certificate identities', () => {
    const entries = successfulExecutions().map((entry, index) => ({ ...entry,
      executionId: index < 3 ? 'shared-execution' : entry.executionId,
      certificateDigest: index > 1 ? hash('shared-certificate') : entry.certificateDigest }));
    const result = evaluateDeepImprovementCommonRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
      executions: entries, unresolvedEvidenceCount: 0, lowTraffic: false,
    });
    expect(result.successfulAuthoritativeExecutions).toBe(1);
    expect(result.state).toBe('open');
  });

  it.each([{ lowTraffic: true, unresolvedEvidenceCount: 0 },
    { lowTraffic: false, unresolvedEvidenceCount: 1 }])(
    'extends a nominally eligible window for unresolved or low-traffic evidence', (extension) => {
      expect(evaluateDeepImprovementCommonRollbackWindow({
        openedAt: '2026-07-01T00:00:00Z', evaluatedAt: '2026-07-15T00:00:00Z',
        executions: successfulExecutions(), ...extension,
      })).toMatchObject({ state: 'extended', windowClosed: false });
    },
  );
});

describe('deep improvement common independent mode gate', () => {
  it('passes only reverified common evidence and emits additive-dark exact bindings', async () => {
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate(sharedFixture.input);
    expect(result).toMatchObject({ verdict: 'pass', certificate: {
      mode: 'deep-improvement-common', runId: RUN_ID, lineageId: LINEAGE_ID,
      evaluatorEpochId: EVALUATION_EPOCH_ID, candidateId: CANDIDATE_ID,
      baselineId: BASELINE_ID, canaryEpochId: CANARY_EPOCH_ID,
      authorityMutation: false, rollbackWindowClosed: false, cutoverCertificate: false,
    } });
    expect(result.dispositions.every((entry) => entry.disposition === 'ready')).toBe(true);
  });

  it('rejects a token-valid version tuple that does not name the installed common contract', async () => {
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      versions: {
        ...sharedFixture.input.versions,
        eventSchemaVersion: 'deep-research-event@1',
      },
    });

    expect(result.certificate).toBeNull();
    expect(result.dispositions.every((entry) => entry.reasonCode === 'EVIDENCE_MALFORMED'))
      .toBe(true);
  });

  it('does not adopt a parsed parity handoff exitStatus', async () => {
    const reported = sharedFixture.input.parity!.modeGateInput as Record<string, unknown>;
    const { gateInputDigest: _ignored, ...body } = reported;
    const blockedBody = { ...body, exitStatus: 'blocked' };
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      parity: { ...sharedFixture.input.parity!,
        modeGateInput: { ...blockedBody, gateInputDigest: digest(blockedBody) } },
    });
    expect(result.verdict).toBe('pass');
  });

  it('denies a claimed green receipt when the real offline certificate or replay is changed', async () => {
    const verification = sharedFixture.input.certificates!.verificationInput;
    const tampered = structuredClone(verification.bundle) as DeepImprovementCommonCertificateBundle;
    tampered.certificate.body.baselineId = 'baseline-other';
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      certificates: { verificationInput: { ...verification, bundle: tampered } },
    });
    expect(result.certificate).toBeNull();
    expect(result.dispositions).toEqual(expect.arrayContaining([
      expect.objectContaining({ input: 'certificates_receipts', disposition: 'blocked' }),
      expect.objectContaining({ input: 'shadow_parity', disposition: 'blocked' }),
    ]));
  });

  it('denies an otherwise green receipt when authorization audit evidence is absent', async () => {
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      parity: { ...sharedFixture.input.parity!,
        authorizationAuditRootDirectory: temporaryRoot('missing-audit') },
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity', reasonCode: 'AUTHORIZED_PARITY_EVIDENCE_MISSING',
    }));
  });

  it('rejects unknown version bindings, lifecycle identity reuse, and resume semantic drift', async () => {
    const extraVersion = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      versions: { ...sharedFixture.input.versions, authorityOverride: 'cutover' } as never,
    });
    const identity = sharedFixture.input.lifecycle[0]!;
    const duplicatedLifecycle = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      lifecycle: sharedFixture.input.lifecycle.map((entry) => ({ ...identity, kind: entry.kind })),
    });
    const resume = sharedFixture.input.resumeEvidence!;
    const driftedResume = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      resumeEvidence: { ...resume,
        ledgerFreshProjectionFingerprint: hash('different-resume-projection') },
    });
    expect(extraVersion.certificate).toBeNull();
    expect(duplicatedLifecycle.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume', reasonCode: 'LIFECYCLE_INCOMPLETE',
    }));
    expect(driftedResume.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume', reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects resume decisions authenticated for different requests or leases', async () => {
    const resume = sharedFixture.input.resumeEvidence!;
    const requestDrift = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      resumeEvidence: {
        ...resume,
        ledgerDecision: changeResumeDecision(resume.ledgerDecision, {
          requestDigest: hash('different-resume-request'),
        }),
      },
    });
    const leaseDrift = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      resumeEvidence: {
        ...resume,
        ledgerDecision: changeResumeDecision(resume.ledgerDecision, {
          lease: { ...resume.ledgerDecision.lease, remainingMs: 60_000 },
        }),
      },
    });
    expect(requestDrift.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume', reasonCode: 'RESUME_INVALID',
    }));
    expect(leaseDrift.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume', reasonCode: 'RESUME_INVALID',
    }));
  });

  it('rejects an incomplete common sealed-artifact closure', async () => {
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      sealedArtifacts: {
        ...sharedFixture.input.sealedArtifacts!,
        bindings: sharedFixture.input.sealedArtifacts!.bindings.slice(1),
      },
    });
    expect(result.certificate).toBeNull();
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'sealed_artifacts', reasonCode: 'SEALED_ARTIFACT_INVALID',
    }));
  });

  it('rejects validly sealed replacement identities for every common artifact kind', async () => {
    const replacements = [
      [DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, 'evaluatorEpochId'],
      [DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT, 'candidateId'],
      [DeepImprovementCommonArtifactKinds.BASELINE_INPUT, 'baselineId'],
      [DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT, null],
      [DeepImprovementCommonArtifactKinds.CANARY_EPOCH, 'canaryEpochId'],
      [DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE, 'evaluatorEpochId'],
    ] as const;
    const store = sharedFixture.input.sealedArtifacts!.store;
    for (const [kind, identityField] of replacements) {
      const original = sharedFixture.input.sealedArtifacts!.bindings.find(
        (entry) => entry.artifactKind === kind,
      );
      if (!original) throw new Error(`Missing ${kind} binding`);
      const verified = kind === DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
        ? await readDeepImprovementPromotionEvidence(store, original, {
            now: new Date(VERIFICATION_TIME),
          })
        : await readDeepImprovementCommonArtifact(store, original, {
            accessRole: 'evaluator',
            now: new Date(VERIFICATION_TIME),
          });
      const material = {
        ...verified.material,
        artifactId: `${verified.material.artifactId}-replacement`,
        ...(identityField === null ? {} : { [identityField]: `${identityField}-replacement` }),
      };
      const replacement = await sealDeepImprovementCommonArtifact(
        store,
        kind,
        material as never,
      );
      const result = await new DeepImprovementCommonModeMigrationGate().evaluate({
        ...sharedFixture.input,
        sealedArtifacts: {
          store,
          bindings: sharedFixture.input.sealedArtifacts!.bindings.map((entry) => (
            entry.artifactKind === kind ? replacement : entry
          )),
        },
      });
      expect(result.certificate, kind).toBeNull();
      expect(result.dispositions, kind).toContainEqual(expect.objectContaining({
        input: 'sealed_artifacts',
      }));
    }
  });

  it('snapshots a consequential accessor before asynchronous verification', async () => {
    let reads = 0;
    const input = { ...sharedFixture.input } as DeepImprovementCommonModeGateInput<ReplayProjection>;
    Object.defineProperty(input, 'candidateSha', {
      enumerable: true,
      get: () => {
        reads += 1;
        return reads === 1 ? sharedFixture.input.candidateSha : 'f'.repeat(40);
      },
    });
    const result = await new DeepImprovementCommonModeMigrationGate().evaluate(input);
    expect(result).toMatchObject({
      verdict: 'pass',
      certificate: { candidateSha: sharedFixture.input.candidateSha },
    });
    expect(reads).toBe(1);
  });

  it('fails closed on nested circular evidence instead of throwing', async () => {
    const health = { ...sharedFixture.input.rollback!.healthAggregate } as Record<string, unknown>;
    health.circular = health;
    await expect(new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      rollback: { ...sharedFixture.input.rollback!, healthAggregate: health as HealthAggregate },
    })).resolves.toMatchObject({ certificate: null });
  });

  it('cross-checks the rollback anchor and binds the complete health aggregate', async () => {
    const anchorMismatch = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      rollback: { ...sharedFixture.input.rollback!, rollbackAnchorDigest: hash('other-anchor') },
    });
    const changedHealth = await new DeepImprovementCommonModeMigrationGate().evaluate({
      ...sharedFixture.input,
      rollback: { ...sharedFixture.input.rollback!, healthAggregate: {
        ...sharedFixture.input.rollback!.healthAggregate,
        observationId: 'changed-observation', policyDigest: hash('changed-health-policy'),
      } },
    });
    const original = await new DeepImprovementCommonModeMigrationGate().evaluate(sharedFixture.input);
    expect(anchorMismatch.dispositions).toContainEqual(expect.objectContaining({
      input: 'rollback_readiness', reasonCode: 'EVIDENCE_STALE',
    }));
    expect(changedHealth.verdict).toBe('pass');
    expect(changedHealth.certificate?.certificateDigest)
      .not.toBe(original.certificate?.certificateDigest);
  });

  it.each(['circular', 'non-finite', 'forbidden-key', 'non-plain', 'wrong-shape'] as const)(
    'never throws for %s gate input', async (kind) => {
      let malformed: unknown;
      if (kind === 'circular') {
        const value = { ...sharedFixture.input } as Record<string, unknown>;
        value.circular = value;
        malformed = value;
      } else if (kind === 'non-finite') {
        malformed = { ...sharedFixture.input, versions: {
          ...sharedFixture.input.versions, eventEnvelopeVersion: Number.POSITIVE_INFINITY } };
      } else if (kind === 'forbidden-key') {
        const value = { ...sharedFixture.input } as Record<string, unknown>;
        Object.defineProperty(value, '__proto__', { value: { elevated: true }, enumerable: true });
        malformed = value;
      } else if (kind === 'non-plain') {
        malformed = Object.assign(Object.create({ inherited: true }), sharedFixture.input);
      } else malformed = null;
      await expect(new DeepImprovementCommonModeMigrationGate().evaluate(malformed as never))
        .resolves.toMatchObject({ certificate: null });
    },
  );
});

interface RollbackRequestFixture {
  readonly input: DeepImprovementCommonRollbackRequest;
  readonly rollbackSwitch: DeepImprovementCommonRollbackSwitch;
  readonly coordinator: FencedLeaseCoordinator;
}

async function rollbackGatewayHarness(
  authority: AuthoritySnapshot = { state: 'new_authoritative_reversible', epoch: 1 },
) {
  const rootDirectory = temporaryRoot('rollback-gateway');
  const registry = createFixtureEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'fixture-capability-policy', policyVersion: 1,
    evaluatorVersion: 'rollback-gate-tests@1',
    ruleIds: ['external-authority-required', 'externally-authorized-recovery'],
    evaluate: (input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult => (
      input.capabilityId === 'externally-authorized-recovery'
        ? { verdict: 'allow', reasonCode: 'allowed',
            matchedRuleIds: ['externally-authorized-recovery'] }
        : { verdict: 'deny', reasonCode: 'policy_denied',
            matchedRuleIds: ['external-authority-required'] }
    ),
  }]);
  const ledger = new AppendOnlyLedger({ rootDirectory, ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => authority }, registry);
  const gateway = new TransitionAuthorizationGateway({ rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID, authorityProvider: () => authority,
      identityResolver: ({ evaluationInput }) => ({
        actorId: evaluationInput.actorId,
        capabilityId: evaluationInput.capabilityId,
        evidenceDigest: evaluationInput.evidenceDigest,
      }),
    }, ledger, policies);
  return { registry, policies, ledger, gateway };
}

async function rollbackRequestFixture(
  staleToken?: number,
  transformLease?: (lease: DeepImprovementCommonRollbackRequest['staleWriterLease']) => unknown,
): Promise<RollbackRequestFixture> {
  const harness = await rollbackGatewayHarness();
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: temporaryRoot('rollback-fencing'),
    operationTimeoutMs: 1_000 });
  const writerResource = { kind: ProtectedResourceKinds.WRITER,
    components: { writerId: 'deep-improvement-common-ledger-writer' },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM } as const;
  const issuedLease = await coordinator.acquire({ resource: writerResource,
    ownerId: 'stale-common-writer', correlationId: 'stale-common-writer',
    ttlMs: 60_000, acquireTimeoutMs: 1_000 });
  await coordinator.release(issuedLease);
  const { acquisition: _acquisition, ...issuedStaleLease } = issuedLease;
  const staleWriterLease = transformLease
    ? transformLease(issuedStaleLease)
    : staleToken === undefined ? issuedStaleLease : { ...issuedStaleLease, fenceToken: staleToken };
  const classification = sharedFixture.input.rollback!.classificationManifest;
  const resume = sharedFixture.input.resumeEvidence!;
  const rollbackReason = 'Health degeneration requires non-destructive restoration evidence.';
  const counts = { retainedEventCountBefore: 9, retainedEventCountAfter: 9,
    retainedArtifactCountBefore: 6, retainedArtifactCountAfter: 6 };
  const evidenceDigest = digest({ configurationVersion: 'rollback-policy@1', operation: 'rollback',
    rollbackReason, currentAuthorityState: 'new_authoritative_reversible', currentAuthorityEpoch: 1,
    gateCertificateDigest: sharedFixture.certificate.certificateDigest,
    classificationDigest: classification.finalDigest, resumeEvidenceDigest: digest(resume),
    writerResourceDigest: canonicalizeProtectedResource(writerResource).resourceDigest,
    staleWriterLeaseDigest: digest(staleWriterLease),
    rollbackAnchorDigest: sharedFixture.certificate.rollbackAnchorDigest, ...counts });
  const event = createFixtureEvent(harness.registry, 1);
  const authorizationRequest = await createFixtureRequest(harness.ledger, event, harness.policies,
    'common-rollback', { mode: 'deep-improvement-common',
      capabilityId: 'externally-authorized-recovery', evidenceDigest });
  const input = { configurationVersion: 'rollback-policy@1', operation: 'rollback' as const,
    currentAuthority: { state: 'new_authoritative_reversible' as const, epoch: 1 },
    expectedAuthorityEpoch: 1, gateCertificate: sharedFixture.certificate,
    gateInput: sharedFixture.input, authorizationRequest, rollbackReason,
    admissionState: 'frozen' as const, classificationManifest: classification,
    resumeEvidence: resume, writerResource,
    staleWriterLease: staleWriterLease as DeepImprovementCommonRollbackRequest['staleWriterLease'],
    destructiveIntent: 'none' as const, ...counts,
    rollbackAnchorDigest: sharedFixture.certificate.rollbackAnchorDigest };
  return { input, coordinator,
    rollbackSwitch: new DeepImprovementCommonRollbackSwitch({ gateway: harness.gateway,
      fencingCoordinator: coordinator }) };
}

describe('deep improvement common non-destructive rollback switch', () => {
  it('authorizes only evidence emission and leaves authority mutation dark', async () => {
    const fixture = await rollbackRequestFixture();
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({ disposition: 'authorized', authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied', certificate: { mode: 'deep-improvement-common',
        authorityMutation: false, eventDeletionCount: 0, artifactRewriteCount: 0,
        phase014RestorationRequired: true, staleWriterDenied: true } });
    expect(result.certificate!.writerFenceToken)
      .toBeGreaterThan(fixture.input.staleWriterLease!.fenceToken);
  });

  it('denies a request anchor that differs from the reverified migration certificate', async () => {
    const fixture = await rollbackRequestFixture();
    const anchor = hash('request-only-anchor');
    const altered = { ...fixture.input, rollbackAnchorDigest: anchor };
    await expect(fixture.rollbackSwitch.requestRollback(altered)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE', certificate: null,
    });
  });

  it('denies a stale token not strictly superseded by the real durable coordinator token', async () => {
    const fixture = await rollbackRequestFixture(10_000);
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'WRITER_FENCE_FAILED', certificate: null,
    });
  });

  it('requires the real coordinator high-water mark to equal the issued rollback token', async () => {
    const fixture = await rollbackRequestFixture();
    const inspect = fixture.coordinator.inspect.bind(fixture.coordinator);
    Object.defineProperty(fixture.coordinator, 'inspect', {
      configurable: true,
      value: async (resource: ProtectedResourceIdentity) => {
        const snapshot = await inspect(resource);
        return Object.freeze({ ...snapshot, lastFenceToken: snapshot.lastFenceToken + 1 });
      },
    });
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'WRITER_FENCE_FAILED', certificate: null,
    });
  });

  it.each([
    ['wrong identity types', (lease: NonNullable<DeepImprovementCommonRollbackRequest['staleWriterLease']>) =>
      ({ ...lease, leaseId: 7, ownerId: {}, correlationId: [] })],
    ['non-monotonic timestamps', (lease: NonNullable<DeepImprovementCommonRollbackRequest['staleWriterLease']>) =>
      ({ ...lease, acquiredAt: '2026-07-23T12:00:00Z',
        renewedAt: '2026-07-23T11:00:00Z', expiresAt: '2026-07-23T13:00:00Z' })],
    ['wrong lease shape', (lease: NonNullable<DeepImprovementCommonRollbackRequest['staleWriterLease']>) =>
      ({ ...lease, authorityOverride: true })],
  ] as const)('denies malformed lease structure: %s', async (_label, transform) => {
    const fixture = await rollbackRequestFixture(undefined, (lease) => transform(lease!));
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'WRITER_FENCE_FAILED', certificate: null,
    });
  });

  it('rejects unknown request fields and destructive intent before authorization', async () => {
    const fixture = await rollbackRequestFixture();
    const unknown = { ...fixture.input, selfIssuedAuthorization: { trusted: true } };
    const destructive = { ...fixture.input, destructiveIntent: 'truncate-ledger' as const };
    await expect(fixture.rollbackSwitch.requestRollback(unknown as never)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE', certificate: null,
    });
    await expect(fixture.rollbackSwitch.requestRollback(destructive)).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'DESTRUCTIVE_ROLLBACK_REJECTED', certificate: null,
    });
  });

  it('rejects an authorization request that changes while being snapshotted', async () => {
    const fixture = await rollbackRequestFixture();
    const authorizationRequest = fixture.input.authorizationRequest!;
    let reads = 0;
    const changingRequest = { ...authorizationRequest };
    Object.defineProperty(changingRequest, 'evidenceDigest', {
      enumerable: true,
      get: () => {
        reads += 1;
        return reads === 1 ? authorizationRequest.evidenceDigest : hash('changed-authorization-evidence');
      },
    });
    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      authorizationRequest: changingRequest,
    })).resolves.toMatchObject({
      disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE', certificate: null,
    });
    expect(reads).toBeGreaterThan(1);
  });

  it('fails closed on nested circular rollback evidence instead of throwing', async () => {
    const fixture = await rollbackRequestFixture();
    const resume = { ...fixture.input.resumeEvidence! } as Record<string, unknown>;
    resume.circular = resume;
    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      resumeEvidence: resume as DeepImprovementCommonResumeParityEvidence,
    })).resolves.toMatchObject({ disposition: 'denied', certificate: null });
  });

  it.each(['circular', 'non-finite', 'forbidden-key', 'non-plain', 'wrong-shape'] as const)(
    'never throws for %s rollback input', async (kind) => {
      const fixture = await rollbackRequestFixture();
      let malformed: unknown;
      if (kind === 'circular') {
        const value = { ...fixture.input } as Record<string, unknown>;
        value.circular = value;
        malformed = value;
      } else if (kind === 'non-finite') {
        malformed = { ...fixture.input, retainedEventCountAfter: Number.POSITIVE_INFINITY };
      } else if (kind === 'forbidden-key') {
        const value = { ...fixture.input } as Record<string, unknown>;
        Object.defineProperty(value, '__proto__', { value: { elevated: true }, enumerable: true });
        malformed = value;
      } else if (kind === 'non-plain') {
        malformed = Object.assign(Object.create({ inherited: true }), fixture.input);
      } else malformed = null;
      await expect(fixture.rollbackSwitch.requestRollback(malformed as never)).resolves.toMatchObject({
        disposition: 'denied', certificate: null,
      });
    },
  );

  it('keeps the fixed common writer resource boundary', async () => {
    const fixture = await rollbackRequestFixture();
    const other: ProtectedResourceIdentity = { kind: ProtectedResourceKinds.WRITER,
      components: { writerId: 'another-ledger-writer' },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM };
    await expect(fixture.rollbackSwitch.requestRollback({
      ...fixture.input, writerResource: other,
    })).resolves.toMatchObject({ disposition: 'denied', certificate: null });
  });
});
