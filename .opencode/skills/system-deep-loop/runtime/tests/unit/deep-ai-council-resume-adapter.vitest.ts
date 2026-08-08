// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Resume Adapter Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TypedReducerRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepAiCouncilCertificateFailureCodes,
  DeepAiCouncilTransitionKinds,
  DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER,
  issueDeepAiCouncilRunCertificate,
  parseDeepAiCouncilCertificateBundle,
  verifyDeepAiCouncilCertificateOffline,
} from '../../lib/deep-ai-council-certificates/index.js';
import {
  DeepAiCouncilWireEventTypes,
  createDeepAiCouncilEventRegistry,
  deepAiCouncilEventDefinitions,
  prepareDeepAiCouncilEvent,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import {
  DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
  DEEP_AI_COUNCIL_REDUCER_ID,
  DEEP_AI_COUNCIL_REDUCER_VERSION,
  createDeepAiCouncilProjectionState,
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
  reduceDeepAiCouncilVerifiedEvent,
} from '../../lib/deep-ai-council-reducers/index.js';
import {
  DEEP_AI_COUNCIL_CONTINUITY_LADDER,
  DEEP_AI_COUNCIL_RESUME_ADAPTER_VERSION,
  DeepAiCouncilResumeAdapter,
  deepAiCouncilMigrationRegistryDigest,
  deepAiCouncilResumeFingerprintDigest,
  parseDeepAiCouncilResumeRequest,
} from '../../lib/deep-ai-council-resume-adapter/index.js';
import {
  DeepAiCouncilArtifactKinds,
  createDeepAiCouncilSealedArtifactStore,
  sealDeepAiCouncilArtifact,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
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
  AuthorizedEvidenceWriter,
  CertificationProviderRegistry,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
  effectConfirmationBindsIntent,
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
  DeepAiCouncilCertificateBundle,
  DeepAiCouncilOfflineVerificationInput,
  DeepAiCouncilTransitionReceiptInput,
  DeepAiCouncilTransitionReceiptSubstrate,
} from '../../lib/deep-ai-council-certificates/index.js';
import type {
  DeepAiCouncilEventEnvelope,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerEvent,
  DeepAiCouncilPayloadMap,
  DeepAiCouncilReplayMetadata,
  DeepAiCouncilScopeMap,
  IndependenceSnapshot,
  InformationSurface,
  RawScoreVector,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import type { DeepAiCouncilProjectionState } from '../../lib/deep-ai-council-reducers/index.js';
import type {
  DeepAiCouncilAuthenticatedMigrationRegistry,
  DeepAiCouncilResumeAdapterResult,
  DeepAiCouncilResumeFingerprint,
  DeepAiCouncilResumeRequest,
} from '../../lib/deep-ai-council-resume-adapter/index.js';
import type {
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilSealedArtifactBinding,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type {
  EffectConfirmationPayload,
  EffectIntentPayload,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

type ReplayProjection = DeepAiCouncilProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepAiCouncilCertificateBundle;
  readonly verification: DeepAiCouncilOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepAiCouncilSealedArtifactStore>;
  readonly artifactBindings: readonly DeepAiCouncilSealedArtifactBinding[];
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: ReturnType<typeof createFixturePolicyRegistry>;
  readonly registry: ReturnType<typeof createEvidenceControlEventRegistry>;
  readonly events: readonly DeepAiCouncilLedgerEvent[];
}

interface ScenarioOptions {
  readonly fabricatedDependencyDigest?: boolean;
  readonly failedTestGate?: boolean;
  readonly conflictingLogicalOperation?: boolean;
  readonly missingRequiredTransition?: boolean;
  readonly orphanArtifact?: boolean;
  readonly reorderedTransitions?: boolean;
  readonly wrongKindDependency?: boolean;
  readonly initialReplayFingerprint?: string;
}

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const ROUND_ID = 'round-1';
const STREAM_ID = 'deep-ai-council-certificate-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const TEST_PRODUCER = Object.freeze({ name: 'deep-ai-council-certificate-tests', version: '1' });
const temporaryRoots: string[] = [];
const registry = createDeepAiCouncilEventRegistry();

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-ai-council-resume-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function plainContentDigest(qualifiedDigest: string): string {
  const separator = qualifiedDigest.indexOf(':');
  return separator === -1 ? qualifiedDigest : qualifiedDigest.slice(separator + 1);
}

function replayMetadata(label: string): DeepAiCouncilReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function informationSurface(role: InformationSurface['role']): InformationSurface {
  const isGenerator = role === 'generator';
  const isOrchestrator = role === 'orchestrator';
  return {
    role,
    capabilityRefs: [`capability-${role}`],
    visibleDigests: [digest(`visible:${role}`)],
    generatorIdentityVisible: isGenerator || isOrchestrator,
    rationaleVisible: isGenerator || isOrchestrator,
    peerScoresVisible: isOrchestrator,
    voteCountsVisible: isOrchestrator,
    independentJudgmentsCommitted: role === 'scorer' || isOrchestrator,
  };
}

function rawScores(): RawScoreVector {
  return { quality: 0.8, feasibility: 0.7, novelty: 0.6, risk: 0.2 };
}

function independence(): IndependenceSnapshot {
  return {
    snapshotRef: 'independence-1',
    inputDigest: digest('independence-input'),
    calibrationRef: 'calibration-1',
    effectiveSeatCount: 2,
    dependenceMeasure: 0.2,
    marginalGain: 0.7,
  };
}

function visibilityFor(kind: DeepAiCouncilArtifactKind):
  'public' | 'private-seat' | 'blinded' | 'judge' | 'test-gate' {
  switch (kind) {
    case DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY:
    case DeepAiCouncilArtifactKinds.SEAT_ROSTER:
    case DeepAiCouncilArtifactKinds.REASONING_METHOD:
    case DeepAiCouncilArtifactKinds.SEAT_PROPOSAL:
    case DeepAiCouncilArtifactKinds.CRITIQUE_RECORD:
    case DeepAiCouncilArtifactKinds.STANCE_EVIDENCE:
      return 'private-seat';
    case DeepAiCouncilArtifactKinds.BLINDED_CANDIDATE:
      return 'blinded';
    case DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT:
    case DeepAiCouncilArtifactKinds.BIAS_PROBE:
    case DeepAiCouncilArtifactKinds.COUNTERFACTUAL_PROBE:
      return 'judge';
    case DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE:
      return 'test-gate';
    default:
      return 'public';
  }
}

function proposalData(label: string, evidenceRef: string): DeepAiCouncilPayloadMap[
  'ai_council.proposal_observed'
] {
  const hash = digest(`proposal:${label}`);
  return {
    targetVersion: 'target@1',
    responseStatus: 'returned',
    proposalDigest: hash,
    artifactRef: `proposal-artifact-${label}`,
    artifactDigest: hash,
    rawScores: rawScores(),
    rawConfidence: 0.8,
    usage: {
      receiptRef: `usage-${label}`,
      inputTokens: 100,
      outputTokens: 200,
      costMicros: 300,
    },
    evidenceRefs: [evidenceRef],
    outputSchemaVersion: 'proposal@1',
    observationDigest: hash,
    informationSurface: informationSurface('generator'),
  };
}

function buildMainEvents(options: ScenarioOptions = {}): DeepAiCouncilLedgerEvent[] {
  const events: DeepAiCouncilLedgerEvent[] = [];
  let tailDigest = ZERO_DIGEST;
  const push = <TStem extends DeepAiCouncilEventStem>(
    stem: TStem,
    scope: DeepAiCouncilScopeMap[TStem],
    data: DeepAiCouncilPayloadMap[TStem],
  ): DeepAiCouncilEventEnvelope<TStem> => {
    const sequence = events.length + 1;
    const prepared = prepareDeepAiCouncilEvent({
      stem,
      scope,
      prevEventHash: tailDigest,
      replay: replayMetadata(`${stem}:${sequence}`),
      data,
      eventId: `event-${String(sequence).padStart(3, '0')}`,
      streamId: STREAM_ID,
      streamSequence: sequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: TEST_PRODUCER,
      authorityEpoch: 1,
      correlationId: RUN_ID,
      causationId: sequence === 1
        ? null
        : `event-${String(sequence - 1).padStart(3, '0')}`,
      idempotencyKey: `council-${sequence}`,
    }, registry);
    const event = prepared.envelope as DeepAiCouncilEventEnvelope<TStem>;
    events.push(event);
    tailDigest = digest(event);
    return event;
  };

  const base = { runId: RUN_ID, roundId: ROUND_ID };
  push('ai_council.run_initialized', base, {
    target: {
      targetId: 'target-1',
      targetType: 'repository',
      artifactRef: 'target-artifact-1',
      targetVersion: 'target@1',
      contentDigest: digest('target'),
    },
    targetDigest: digest('target'),
    taskClass: 'architecture',
    configDigest: digest('config'),
    strategyDigest: digest('strategy'),
    convergencePolicyDigest: digest('convergence-policy'),
    testGatePolicyDigest: digest('test-gate-policy'),
    maxRounds: 3,
    minSeatCount: 2,
    maxSeatCount: 4,
    planningOnly: true,
    initialReplayFingerprint:
      options.initialReplayFingerprint ?? digest('initial-replay'),
  });
  push('ai_council.round_started', base, {
    roundNumber: 1,
    executorBoundaryRef: 'executor-boundary-1',
    seatRosterDigest: digest('seat-roster'),
    protocolVersion: 'protocol@1',
    promptPackDigest: digest('prompt-pack'),
    budgetRef: 'budget-1',
    priorRoundRef: null,
    exposurePolicyVersion: 'exposure@1',
    informationSurface: informationSurface('orchestrator'),
  });
  for (const seatNumber of [1, 2]) {
    const seatId = `seat-${seatNumber}`;
    const proposalId = `proposal-${seatNumber}`;
    push('ai_council.seat_selected', { ...base, seatId }, {
      strategyLens: seatNumber === 1 ? 'security' : 'maintainability',
      mandateDigest: digest(`mandate:${seatId}`),
      vantageFingerprint: digest(`vantage:${seatId}`),
      modelFingerprint: digest(`model:${seatId}`),
      independenceGroup: `independence-${seatNumber}`,
      capabilityDigest: digest(`capability:${seatId}`),
      promptDigest: digest(`prompt:${seatId}`),
      selectionUtility: 0.8,
      selectionPolicyVersion: 'seat-selection@1',
    });
    push('ai_council.seat_dispatched', { ...base, seatId }, {
      dispatchReceiptRef: `dispatch-${seatNumber}`,
      logicalBranchRef: `branch-${seatNumber}`,
      attempt: 1,
      budgetLeaseRef: `lease-${seatNumber}`,
      capabilityDigest: digest(`capability:${seatId}`),
      promptDigest: digest(`prompt:${seatId}`),
      informationSurface: informationSurface('generator'),
    });
    push(
      'ai_council.proposal_observed',
      { ...base, seatId, proposalId },
      proposalData(String(seatNumber), `evidence-${seatNumber}`),
    );
  }
  push('ai_council.critique_round_started', {
    ...base,
    seatId: 'seat-2',
    critiqueRoundId: 'critique-1',
  }, {
    sourceProposalIds: ['proposal-1', 'proposal-2'],
    visibleInformationPolicyVersion: 'critique@1',
    inputDigest: digest('critique-input'),
    informationSurface: informationSurface('detector'),
  });
  push('ai_council.critique_recorded', {
    ...base,
    seatId: 'seat-2',
    critiqueRoundId: 'critique-1',
  }, {
    sourceProposalIds: ['proposal-1'],
    critiqueArtifactRef: 'critique-artifact-1',
    critiqueArtifactDigest: digest('critique-artifact'),
    referencedClaimRefs: ['claim-1'],
    rawSeverity: 0.6,
    rawConfidence: 0.8,
    challengeDisposition: 'accepted',
    causalProposalRefs: ['proposal-1'],
    informationSurface: informationSurface('detector'),
  });
  for (const candidateNumber of [1, 2]) {
    push('ai_council.candidate_blinded', {
      ...base,
      candidateId: `candidate-${candidateNumber}`,
    }, {
      sourceProposalIds: [`proposal-${candidateNumber}`],
      candidateAliasDigest: digest(`alias:${candidateNumber}`),
      shuffleSeedDigest: digest(`shuffle:${candidateNumber}`),
      visibleCandidateDigest: digest(`visible:${candidateNumber}`),
      artifactRef: `candidate-artifact-${candidateNumber}`,
      artifactDigest: digest(`candidate-artifact:${candidateNumber}`),
      targetVersion: 'target@1',
      redactionPolicyVersion: 'redaction@1',
      informationSurface: informationSurface('scorer'),
    });
  }
  for (const judgmentNumber of [1, 2]) {
    push('ai_council.pairwise_judgment_recorded', {
      ...base,
      judgmentId: `judgment-${judgmentNumber}`,
    }, {
      candidateAId: 'candidate-1',
      candidateBId: 'candidate-2',
      orderToken: judgmentNumber === 1 ? 'a-first' : 'b-first',
      judgeProfileFingerprint: digest(`judge:${judgmentNumber}`),
      rawPreference: { candidateA: 0.7, candidateB: 0.2, abstain: 0.1 },
      rawConfidence: 0.8,
      judgmentStatus: 'consistent',
      inputDigest: digest(`judgment-input:${judgmentNumber}`),
      calibrationRef: `calibration-${judgmentNumber}`,
      informationSurface: informationSurface('scorer'),
      supersedesJudgmentId: null,
    });
  }
  push('ai_council.adjudication_decision', base, {
    candidateSetDigest: digest('candidate-set'),
    protocolVersion: 'adjudication@1',
    rubricVersion: 'rubric@1',
    rawScores: rawScores(),
    calibratedScores: rawScores(),
    supportMass: 0.7,
    oppositionMass: 0.3,
    independence: independence(),
    minorityRefs: ['minority-1'],
    contradictionRefs: [],
    vetoFindingRefs: [],
    disposition: 'selected',
    selectedCandidateId: 'candidate-1',
    evaluatorReceiptRef: 'evaluator-1',
    sourceJudgmentIds: ['judgment-1', 'judgment-2'],
  });
  push('ai_council.stance_recorded', {
    ...base,
    candidateId: 'candidate-1',
    seatId: 'seat-1',
  }, {
    candidateOrPlanRef: 'candidate-1',
    priorStanceEventId: null,
    currentStance: 'support',
    rawRationaleDigest: digest('stance'),
    evidenceRef: 'evidence-1',
    influenceObservationDigest: digest('influence'),
  });
  const deliberation = push('ai_council.deliberation_synthesized', base, {
    inputEventRange: {
      firstEventId: 'event-001',
      lastEventId: `event-${String(events.length).padStart(3, '0')}`,
    },
    candidateSetDigest: digest('candidate-set'),
    planDisposition: 'selected',
    selectedPlanDigest: digest('selected-plan'),
    disagreementRefs: [],
    minorityRefs: ['minority-1'],
    synthesisPolicyFingerprint: digest('synthesis-policy'),
    evaluatorFingerprint: digest('synthesis-evaluator'),
    reportDraftRef: 'report-draft-1',
    synthesisReceiptRef: 'synthesis-1',
  });
  const convergence = push('ai_council.convergence_evaluated', base, {
    decision: 'converged',
    rawAgreement: 0.95,
    rawStability: 0.9,
    calibratedSupport: 0.8,
    effectiveSeatCount: 2,
    independence: independence(),
    judgeProfileRefs: ['judge-1', 'judge-2'],
    qualityWitnessRefs: ['quality-1'],
    invarianceWitnessRefs: ['invariance-1'],
    minorityRefs: ['minority-1'],
    contradictionRefs: [],
    vetoFindingRefs: [],
    requiredGateResultRefs: ['required-gate-1'],
    budgetStateRef: 'budget-state-1',
    coverageStateRef: 'coverage-state-1',
    blockerIds: [],
    recoveryOrEscalationReason: null,
  });
  push('ai_council.artifact_committed', {
    ...base,
    artifactId: 'artifact-manifest-1',
  }, {
    artifactKind: 'council-manifest',
    safeRelativePath: 'ai-council/manifest.json',
    schemaVersion: 'manifest@1',
    byteDigest: digest('manifest-bytes'),
    contentDigest: digest('manifest-content'),
    requiredSectionResults: [{
      sectionId: 'recommendation',
      status: 'pass',
      evidenceDigest: digest('recommendation-section'),
    }],
    sourceEventRange: {
      firstEventId: 'event-001',
      lastEventId: convergence.event_id,
    },
    supersedesArtifactId: null,
    rollbackRef: null,
  });
  const gate = push('ai_council.council_test_gate_evaluated', {
    ...base,
    gateId: 'gate-1',
  }, {
    testSuiteDigest: digest('test-suite'),
    fixtureManifestDigest: digest('fixture-manifest'),
    baselineFingerprint: digest('baseline'),
    candidateFingerprint: digest('candidate'),
    requiredCheckResults: [{
      checkId: 'required-sections',
      status: options.failedTestGate ? 'fail' : 'pass',
      resultDigest: digest('required-sections'),
    }],
    criticalFailureRefs: options.failedTestGate ? ['critical-failure-1'] : [],
    metamorphicCheckDigest: digest('metamorphic'),
    biasCheckDigest: digest('bias'),
    artifactCompleteness: 'complete',
    verdict: options.failedTestGate ? 'fail' : 'pass',
    gateReceiptRef: 'gate-receipt-1',
    informationSurface: informationSurface('test-gate'),
  });
  const finalTailDigest = tailDigest;
  push('ai_council.council_complete', base, {
    terminalStatus: options.failedTestGate ? 'incomplete' : 'completed',
    convergenceEventId: convergence.event_id,
    finalDeliberationEventId: deliberation.event_id,
    artifactManifestRef: 'artifact-manifest-1',
    councilTestGateEventId: gate.event_id,
    finalLedgerTailDigest: finalTailDigest,
    counts: { rounds: 1, seats: 2, proposals: 2, judgments: 2 },
    recommendationOrUserDecisionRef: 'recommendation-1',
    terminalReason: options.failedTestGate
      ? 'council-test-gate-failed'
      : 'eligible-convergence-and-gate-pass',
  });
  return events;
}

function eventByStem(
  events: readonly DeepAiCouncilLedgerEvent[],
  stem: DeepAiCouncilEventStem,
  index = 0,
): DeepAiCouncilLedgerEvent {
  const matches = events.filter((event) => event.payload.stem === stem);
  const event = matches[index];
  if (!event) throw new Error(`Missing ${stem} event at index ${index}`);
  return event;
}

function materialFor(
  kind: DeepAiCouncilArtifactKind,
  artifactId: string,
  event: DeepAiCouncilLedgerEvent,
  materialDigest: string,
  dependencyDigests: readonly string[] = [],
): DeepAiCouncilArtifactMaterial {
  return {
    artifactId,
    materialDigest,
    materialRef: `artifact:${artifactId}`,
    scope: { runId: RUN_ID, roundId: ROUND_ID, artifactId },
    sourceEventRange: {
      firstEventId: event.event_id,
      lastEventId: event.event_id,
      firstStem: event.payload.stem,
      lastStem: event.payload.stem,
    },
    schemaVersion: 'schema@1',
    policyVersion: 'policy@1',
    replayFingerprint: digest('initial-replay'),
    authorityEpoch: 1,
    dependencyDigests,
    visibility: visibilityFor(kind),
    supersedesArtifactDigest: null,
    locator: {
      scheme: 'artifact',
      locatorDigest: digest(`locator:${artifactId}`),
      selector: `artifact:${artifactId}`,
      revision: 'revision-1',
    },
    producerVersion: 'producer@1',
  };
}

async function authorizedLedger(events: readonly DeepAiCouncilLedgerEvent[]) {
  const evidenceRegistry = createEvidenceControlEventRegistry(
    deepAiCouncilEventDefinitions(),
  );
  const policies = createFixturePolicyRegistry();
  const rootDirectory = temporaryRoot('ledger');
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, evidenceRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, ledger, policies);
  for (const [index, event] of events.entries()) {
    const prepared = prepareDeepAiCouncilEvent({
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
    }, evidenceRegistry);
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
    ownerId: 'deep-ai-council-certificate-writer',
    correlationId: 'deep-ai-council-certificate-writer',
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
    registry: evidenceRegistry,
    authorizationContext: (event) => ({
      mode: 'council',
      priorStateVersion: 'deep-ai-council-certificate-state@1',
      priorStateFingerprint: digest('deep-ai-council-certificate-state'),
      actorId: 'deep-ai-council-certificate-writer',
      capabilityId: 'write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'fixture-capability-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const receiptSubstrate: DeepAiCouncilTransitionReceiptSubstrate = Object.freeze({
    writer,
    registry: evidenceRegistry,
    producer: TEST_PRODUCER,
  });
  return {
    ledger,
    gateway,
    policies,
    registry: evidenceRegistry,
    receiptSubstrate,
  };
}

function replayComponentRegistry(): ReplayComponentRegistry<ReplayProjection> {
  const reducerRegistry = new TypedReducerRegistry<ReplayProjection>(
    Object.values(DeepAiCouncilWireEventTypes).map((eventType) => ({
      eventType,
      reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
      reduce: (state: Readonly<ReplayProjection>, event) => {
        const verified = { event } as unknown as VerifiedLedgerEvent;
        return reduceDeepAiCouncilVerifiedEvent(verified, state).state as ReplayProjection;
      },
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DEEP_AI_COUNCIL_REDUCER_ID,
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function certificationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider({
      scheme: 'hmac-sha256',
      provider_id: 'deep-ai-council-test-provider',
      key_id: 'deep-ai-council-test-key',
      verifier_version: 'verifier@1',
      trust_scope: 'durable-cross-resume',
    }, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  ]);
}

async function sealedBindings(
  events: readonly DeepAiCouncilLedgerEvent[],
  options: ScenarioOptions = {},
) {
  const artifactStore = createDeepAiCouncilSealedArtifactStore({
    rootDirectory: temporaryRoot('artifacts'),
  });
  const bindings: DeepAiCouncilSealedArtifactBinding[] = [];
  const contentByKey = new Map<string, string>();

  const seal = async (
    kind: DeepAiCouncilArtifactKind,
    artifactId: string,
    event: DeepAiCouncilLedgerEvent,
    materialDigest: string,
    dependencyKeys: readonly string[] = [],
  ): Promise<DeepAiCouncilSealedArtifactBinding> => {
    const dependencyDigests = dependencyKeys.map((key) => {
      const value = contentByKey.get(key);
      if (!value) throw new Error(`Missing dependency ${key}`);
      return value;
    });
    let deps = dependencyDigests;
    if (options.fabricatedDependencyDigest) {
      deps = [...dependencyDigests, digest('never-sealed-fabricated')];
    } else if (options.wrongKindDependency && dependencyKeys.length > 0) {
      const wrongKey = dependencyKeys[0] as string;
      const wrongBinding = bindings.find((candidate) => (
        candidate.reference.qualified_digest.includes(contentByKey.get(wrongKey) ?? 'missing')
      ));
      const substitute = bindings.find((candidate) => (
        candidate.artifactKind !== kind
        && candidate !== wrongBinding
      ));
      if (substitute) {
        deps = [plainContentDigest(substitute.reference.qualified_digest), ...dependencyDigests.slice(1)];
      }
    }
    const binding = await sealDeepAiCouncilArtifact(
      artifactStore,
      kind,
      materialFor(kind, artifactId, event, materialDigest, deps),
    );
    contentByKey.set(artifactId, plainContentDigest(binding.reference.qualified_digest));
    bindings.push(binding);
    return binding;
  };

  const initEvent = eventByStem(events, 'ai_council.run_initialized');
  const seatSelected1 = eventByStem(events, 'ai_council.seat_selected', 0);
  const seatDispatched2 = eventByStem(events, 'ai_council.seat_dispatched', 1);
  const proposal1Event = eventByStem(events, 'ai_council.proposal_observed', 0);
  const proposal2Event = eventByStem(events, 'ai_council.proposal_observed', 1);
  const critiqueEvent = eventByStem(events, 'ai_council.critique_recorded');
  const judgmentEvent = eventByStem(events, 'ai_council.pairwise_judgment_recorded', 1);
  const synthesisEvent = eventByStem(events, 'ai_council.deliberation_synthesized');
  const convergenceEvent = eventByStem(events, 'ai_council.convergence_evaluated');
  const artifactEvent = eventByStem(events, 'ai_council.artifact_committed');
  const gateEvent = eventByStem(events, 'ai_council.council_test_gate_evaluated');
  const completeEvent = eventByStem(events, 'ai_council.council_complete');

  const initData = initEvent.payload.data as DeepAiCouncilPayloadMap['ai_council.run_initialized'];
  const proposal1Data = proposal1Event.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.proposal_observed'
  ];
  const proposal2Data = proposal2Event.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.proposal_observed'
  ];
  const critiqueData = critiqueEvent.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.critique_recorded'
  ];
  const judgmentData = judgmentEvent.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.pairwise_judgment_recorded'
  ];
  const synthesisData = synthesisEvent.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.deliberation_synthesized'
  ];
  const artifactData = artifactEvent.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.artifact_committed'
  ];
  const gateData = gateEvent.payload.data as DeepAiCouncilPayloadMap[
    'ai_council.council_test_gate_evaluated'
  ];

  await seal(
    DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT,
    'target-snapshot-1',
    options.orphanArtifact
      ? eventByStem(events, 'ai_council.round_started')
      : initEvent,
    initData.targetDigest,
  );
  await seal(
    DeepAiCouncilArtifactKinds.SEAT_ROSTER,
    'seat-roster-1',
    seatSelected1,
    digest('seat-roster'),
    ['target-snapshot-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.REASONING_METHOD,
    'reasoning-method-1',
    seatDispatched2,
    digest('reasoning-method'),
    ['target-snapshot-1', 'seat-roster-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.SEAT_PROPOSAL,
    'seat-proposal-1',
    proposal1Event,
    proposal1Data.artifactDigest,
    ['target-snapshot-1', 'seat-roster-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.SEAT_PROPOSAL,
    'seat-proposal-2',
    proposal2Event,
    proposal2Data.artifactDigest,
    ['target-snapshot-1', 'seat-proposal-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.CRITIQUE_RECORD,
    'critique-record-1',
    critiqueEvent,
    critiqueData.critiqueArtifactDigest,
    ['target-snapshot-1', 'seat-proposal-1', 'seat-proposal-2'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT,
    'pairwise-judgment-1',
    judgmentEvent,
    judgmentData.inputDigest,
    ['target-snapshot-1', 'seat-proposal-1', 'seat-proposal-2', 'critique-record-1'],
  );

  const synthesisInputKeys = [
    'seat-proposal-1',
    'seat-proposal-2',
    'critique-record-1',
    'pairwise-judgment-1',
  ] as const;
  await seal(
    DeepAiCouncilArtifactKinds.SYNTHESIS,
    'synthesis-1',
    synthesisEvent,
    synthesisData.selectedPlanDigest,
    synthesisInputKeys.slice(),
  );

  const convergenceInputKeys = [
    ...synthesisInputKeys,
    'synthesis-1',
  ] as const;
  await seal(
    DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE,
    'convergence-evidence-1',
    convergenceEvent,
    digest('convergence-evidence'),
    [...convergenceInputKeys],
  );
  await seal(
    DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT,
    'council-artifact-1',
    artifactEvent,
    artifactData.contentDigest,
    [...convergenceInputKeys, 'convergence-evidence-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE,
    'test-gate-evidence-1',
    gateEvent,
    gateData.testSuiteDigest,
    [...convergenceInputKeys, 'convergence-evidence-1', 'council-artifact-1'],
  );
  await seal(
    DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE,
    'convergence-evidence-complete-1',
    completeEvent,
    digest('convergence-complete'),
    [...convergenceInputKeys, 'convergence-evidence-1', 'council-artifact-1', 'test-gate-evidence-1'],
  );

  return { artifactStore, bindings: Object.freeze(bindings) };
}

function qualified(
  bindings: readonly DeepAiCouncilSealedArtifactBinding[],
  artifactId: string,
): string {
  const byKind = (kind: DeepAiCouncilArtifactKind, index = 0): string => {
    const candidates = bindings.filter((binding) => binding.artifactKind === kind);
    const candidate = candidates[index];
    if (!candidate) throw new Error(`Missing binding ${kind} at ${index}`);
    return candidate.reference.qualified_digest;
  };
  switch (artifactId) {
    case 'target-snapshot-1':
      return byKind(DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT);
    case 'seat-roster-1':
      return byKind(DeepAiCouncilArtifactKinds.SEAT_ROSTER);
    case 'reasoning-method-1':
      return byKind(DeepAiCouncilArtifactKinds.REASONING_METHOD);
    case 'seat-proposal-1':
      return byKind(DeepAiCouncilArtifactKinds.SEAT_PROPOSAL, 0);
    case 'seat-proposal-2':
      return byKind(DeepAiCouncilArtifactKinds.SEAT_PROPOSAL, 1);
    case 'critique-record-1':
      return byKind(DeepAiCouncilArtifactKinds.CRITIQUE_RECORD);
    case 'pairwise-judgment-1':
      return byKind(DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT);
    case 'synthesis-1':
      return byKind(DeepAiCouncilArtifactKinds.SYNTHESIS);
    case 'convergence-evidence-1':
      return byKind(DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE, 0);
    case 'council-artifact-1':
      return byKind(DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT);
    case 'test-gate-evidence-1':
      return byKind(DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE);
    case 'convergence-evidence-complete-1':
      return byKind(DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE, 1);
    default:
      throw new Error(`Unknown artifact id ${artifactId}`);
  }
}

function transitionInputs(
  events: readonly DeepAiCouncilLedgerEvent[],
  bindings: readonly DeepAiCouncilSealedArtifactBinding[],
): readonly DeepAiCouncilTransitionReceiptInput[] {
  const target = qualified(bindings, 'target-snapshot-1');
  const roster = qualified(bindings, 'seat-roster-1');
  const reasoning = qualified(bindings, 'reasoning-method-1');
  const proposal1 = qualified(bindings, 'seat-proposal-1');
  const proposal2 = qualified(bindings, 'seat-proposal-2');
  const critique = qualified(bindings, 'critique-record-1');
  const judgment = qualified(bindings, 'pairwise-judgment-1');
  const synthesis = qualified(bindings, 'synthesis-1');
  const convergence = qualified(bindings, 'convergence-evidence-1');
  const councilArtifact = qualified(bindings, 'council-artifact-1');
  const testGate = qualified(bindings, 'test-gate-evidence-1');
  const completeConvergence = qualified(bindings, 'convergence-evidence-complete-1');
  const preCouncilInputs = Object.freeze([
    target,
    roster,
    reasoning,
    proposal1,
    proposal2,
    critique,
    judgment,
    synthesis,
    convergence,
  ]);
  const preGateInputs = Object.freeze([...preCouncilInputs, councilArtifact]);
  const preCompleteInputs = Object.freeze([...preGateInputs, testGate]);

  const make = (
    transitionKind: DeepAiCouncilTransitionReceiptInput['transitionKind'],
    logicalOperationId: string,
    resultEventId: string,
    inputs: readonly string[],
    outputs: readonly string[],
  ): DeepAiCouncilTransitionReceiptInput => ({
    transitionKind,
    logicalOperationId,
    attemptIds: [`attempt:${logicalOperationId}`],
    resultEventId,
    inputArtifactQualifiedDigests: inputs,
    outputArtifactQualifiedDigests: outputs,
  });

  return Object.freeze([
    make(
      DeepAiCouncilTransitionKinds.INIT,
      'logical:init',
      eventByStem(events, 'ai_council.run_initialized').event_id,
      [],
      [target],
    ),
    make(
      DeepAiCouncilTransitionKinds.SEAT_SELECT_DISPATCH,
      'logical:seat-select-dispatch-1',
      eventByStem(events, 'ai_council.seat_selected', 0).event_id,
      [target],
      [roster],
    ),
    make(
      DeepAiCouncilTransitionKinds.SEAT_SELECT_DISPATCH,
      'logical:seat-select-dispatch-2',
      eventByStem(events, 'ai_council.seat_dispatched', 1).event_id,
      [target, roster],
      [reasoning],
    ),
    make(
      DeepAiCouncilTransitionKinds.SEAT_RETURN,
      'logical:seat-return-1',
      eventByStem(events, 'ai_council.proposal_observed', 0).event_id,
      [target, roster],
      [proposal1],
    ),
    make(
      DeepAiCouncilTransitionKinds.SEAT_RETURN,
      'logical:seat-return-2',
      eventByStem(events, 'ai_council.proposal_observed', 1).event_id,
      [target, proposal1],
      [proposal2],
    ),
    make(
      DeepAiCouncilTransitionKinds.CRITIQUE_ROUND,
      'logical:critique-round',
      eventByStem(events, 'ai_council.critique_recorded').event_id,
      [target, proposal1, proposal2],
      [critique],
    ),
    make(
      DeepAiCouncilTransitionKinds.CANDIDATE_BLIND_JUDGE,
      'logical:candidate-blind-judge',
      eventByStem(events, 'ai_council.pairwise_judgment_recorded', 1).event_id,
      [target, proposal1, proposal2, critique],
      [judgment],
    ),
    make(
      DeepAiCouncilTransitionKinds.SYNTHESIS,
      'logical:synthesis',
      eventByStem(events, 'ai_council.deliberation_synthesized').event_id,
      [proposal1, proposal2, critique, judgment],
      [synthesis],
    ),
    make(
      DeepAiCouncilTransitionKinds.CONVERGENCE,
      'logical:convergence',
      eventByStem(events, 'ai_council.convergence_evaluated').event_id,
      [synthesis, proposal1, proposal2, critique, judgment],
      [convergence],
    ),
    make(
      DeepAiCouncilTransitionKinds.ARTIFACT_COMMIT,
      'logical:artifact-commit',
      eventByStem(events, 'ai_council.artifact_committed').event_id,
      preCouncilInputs,
      [councilArtifact],
    ),
    make(
      DeepAiCouncilTransitionKinds.COUNCIL_TEST_GATE,
      'logical:council-test-gate',
      eventByStem(events, 'ai_council.council_test_gate_evaluated').event_id,
      preGateInputs,
      [testGate],
    ),
    make(
      DeepAiCouncilTransitionKinds.COMPLETE,
      'logical:complete',
      eventByStem(events, 'ai_council.council_complete').event_id,
      preCompleteInputs,
      [completeConvergence],
    ),
  ]);
}

async function scenario(options: ScenarioOptions = {}): Promise<Scenario> {
  const events = buildMainEvents(options);
  const {
    ledger,
    gateway,
    policies,
    registry,
    receiptSubstrate,
  } = await authorizedLedger(events);
  const { artifactStore, bindings } = await sealedBindings(events, options);
  const providers = certificationProviders();
  const initialState = createDeepAiCouncilProjectionState() as ReplayProjection;
  const replay: DeepAiCouncilOfflineVerificationInput<ReplayProjection>['replay'] = {
    ledger,
    eventRegistry: registry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry: replayComponentRegistry(),
    runId: RUN_ID,
    rangeStartSequence: 1,
    rangeEndSequence: events.length,
    replay: {
      reducerId: DEEP_AI_COUNCIL_REDUCER_ID,
      reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
      projectionSchemaVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
      initialState,
      replayInputDigests: { initial_state: digest(initialState) },
    } satisfies ReplayExecutionInput<ReplayProjection>,
  };
  let receiptInputs = [...transitionInputs(events, bindings)];
  if (options.reorderedTransitions) {
    const synthesisIndex = receiptInputs.findIndex((input) => (
      input.transitionKind === DeepAiCouncilTransitionKinds.SYNTHESIS
    ));
    const convergenceIndex = receiptInputs.findIndex((input) => (
      input.transitionKind === DeepAiCouncilTransitionKinds.CONVERGENCE
    ));
    if (synthesisIndex === -1 || convergenceIndex === -1) {
      throw new Error('Missing receipt-order fixture');
    }
    [receiptInputs[synthesisIndex], receiptInputs[convergenceIndex]] = [
      receiptInputs[convergenceIndex]!,
      receiptInputs[synthesisIndex]!,
    ];
  }
  if (options.conflictingLogicalOperation) {
    receiptInputs[1] = {
      ...receiptInputs[1]!,
      logicalOperationId: receiptInputs[0]!.logicalOperationId,
    };
  }
  if (options.missingRequiredTransition) {
    receiptInputs = receiptInputs.filter((input) => (
      input.transitionKind !== DeepAiCouncilTransitionKinds.SYNTHESIS
    ));
  }
  const bundle = await issueDeepAiCouncilRunCertificate({
    runId: RUN_ID,
    roundId: ROUND_ID,
    generation: 1,
    projectionEvents: events,
    artifactStore,
    artifactBindings: bindings,
    transitionReceipts: receiptInputs,
    replay,
    certificationProfile: providers.inspect()[0]!,
    providers,
    receiptSubstrate,
    issuer: 'deep-ai-council-certificate-issuer',
    issuedAt: TIMESTAMP,
  });
  return {
    bundle,
    artifactStore,
    artifactBindings: bindings,
    ledger,
    gateway,
    policies,
    registry,
    events,
    verification: {
      bundle,
      projectionEvents: events,
      artifactStore,
      replay,
      providers,
    },
  };
}

function bundleWithForgedBinding(
  bundle: DeepAiCouncilCertificateBundle,
  bindings: readonly DeepAiCouncilSealedArtifactBinding[],
): DeepAiCouncilCertificateBundle {
  const claims = bundle.certificate.body.artifactClaims;
  const councilClaim = claims.find((claim) => (
    claim.binding.artifactKind === DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT
  ));
  const targetClaim = claims.find((claim) => (
    claim.binding.artifactKind === DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT
  ));
  if (!councilClaim || !targetClaim) throw new Error('Missing forged-binding fixture');
  const forgedReference: SealedArtifactReference = {
    ...targetClaim.binding.reference,
    artifact_kind: councilClaim.binding.artifactKind,
  };
  const forgedCouncilBinding: DeepAiCouncilSealedArtifactBinding = {
    ...councilClaim.binding,
    eventReference: `artifact:${forgedReference.qualified_digest}`,
    reference: forgedReference,
  };
  return {
    ...bundle,
    certificate: {
      ...bundle.certificate,
      body: {
        ...bundle.certificate.body,
        artifactClaims: claims.map((claim) => (
          claim.binding.artifactKind === DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT
            ? {
                ...claim,
                binding: forgedCouncilBinding,
                descriptorDigest: forgedReference.descriptor_digest,
              }
            : claim
        )),
      },
    },
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. RESUME HARNESS
// ───────────────────────────────────────────────────────────────────

function resumeFingerprint(
  overrides: Partial<Omit<DeepAiCouncilResumeFingerprint, 'finalDigest'>> = {},
): DeepAiCouncilResumeFingerprint {
  const core = {
    fingerprintVersion: 1,
    manifestRevision: 'manifest@1',
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    adapterVersion: DEEP_AI_COUNCIL_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
    policyVersion: 'fixture-capability-policy@1',
    targetDigest: digest('target'),
    toolFingerprint: digest('config'),
    modelFingerprint: digest([
      digest('model:seat-1'),
      digest('model:seat-2'),
    ].sort()),
    judgeFingerprint: digest([
      digest('judge:1'),
      digest('judge:2'),
    ].sort()),
    ...overrides,
  };
  return Object.freeze({
    ...core,
    finalDigest: deepAiCouncilResumeFingerprintDigest(core),
  });
}

function migrationRegistry(
  rules: DeepAiCouncilAuthenticatedMigrationRegistry['rules'] = [],
): DeepAiCouncilAuthenticatedMigrationRegistry {
  const core = Object.freeze({
    registryVersion: 1 as const,
    revision: 'migration-registry@1',
    rules: Object.freeze([...rules]),
  });
  return Object.freeze({
    ...core,
    registryDigest: deepAiCouncilMigrationRegistryDigest(core),
  });
}

interface ResumeHarness {
  readonly scenario: Scenario;
  readonly adapter: DeepAiCouncilResumeAdapter;
  readonly effectLedger: AppendOnlyLedger;
  readonly effectGateway: TransitionAuthorizationGateway;
  readonly effectPolicies: ReturnType<typeof createFixturePolicyRegistry>;
  readonly effectRegistry: ReturnType<typeof createEvidenceControlEventRegistry>;
  readonly persisted: DeepAiCouncilResumeFingerprint;
  readonly installed: DeepAiCouncilResumeFingerprint;
  readonly registry: DeepAiCouncilAuthenticatedMigrationRegistry;
}

async function resumeHarness(
  label: string,
  options: {
    readonly persisted?: DeepAiCouncilResumeFingerprint;
    readonly installed?: DeepAiCouncilResumeFingerprint;
    readonly migrationRegistry?: DeepAiCouncilAuthenticatedMigrationRegistry;
    readonly trustRegistry?: boolean;
    readonly scenario?: ScenarioOptions;
  } = {},
): Promise<ResumeHarness> {
  const persisted = options.persisted ?? resumeFingerprint();
  const installed = options.installed ?? persisted;
  const selectedRegistry = options.migrationRegistry ?? migrationRegistry();
  const councilScenario = await scenario({
    ...options.scenario,
    initialReplayFingerprint: persisted.finalDigest,
  });
  const effectRoot = temporaryRoot(`effect-${label}`);
  const effectRegistry = createEvidenceControlEventRegistry();
  const effectPolicies = createFixturePolicyRegistry();
  const effectLedger = new AppendOnlyLedger({
    rootDirectory: effectRoot,
    ledgerId: `effect-ledger-${label}`,
    auditLedgerId: `effect-audit-${label}`,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, effectRegistry);
  const effectGateway = new TransitionAuthorizationGateway({
    rootDirectory: effectRoot,
    auditLedgerId: `effect-audit-${label}`,
    authorityProvider: () => FIXTURE_AUTHORITY,
  }, effectLedger, effectPolicies);
  const replay = councilScenario.verification.replay;
  const adapter = new DeepAiCouncilResumeAdapter({
    ledger: councilScenario.ledger,
    effectLedger,
    gateway: councilScenario.gateway,
    policies: councilScenario.policies,
    eventRegistry: councilScenario.registry,
    fingerprintVersions: replay.versionRegistry,
    artifactStore: councilScenario.artifactStore,
    certificateVerification: {
      eventRegistry: replay.eventRegistry,
      versionRegistry: replay.versionRegistry,
      componentRegistry: replay.componentRegistry,
      replay: replay.replay,
      providers: councilScenario.verification.providers,
    },
    trustedMigrationRegistryDigests: options.trustRegistry === false
      ? []
      : [selectedRegistry.registryDigest],
    producer: { name: 'deep-ai-council-resume-tests', version: '1' },
    policyId: 'fixture-capability-policy',
    policyVersion: 1,
    actorId: 'deep-ai-council-resume-adapter',
    capabilityId: 'write',
    authorityEpoch: 1,
    priorStateVersion: 'deep-ai-council-resume@1',
    packetPointer: 'deep-ai-council/005-resume-adapter',
  });
  return {
    scenario: councilScenario,
    adapter,
    effectLedger,
    effectGateway,
    effectPolicies,
    effectRegistry,
    persisted,
    installed,
    registry: selectedRegistry,
  };
}

function resumeRequest(
  harness: ResumeHarness,
  overrides: Partial<DeepAiCouncilResumeRequest> = {},
): DeepAiCouncilResumeRequest {
  return {
    runId: RUN_ID,
    roundId: ROUND_ID,
    manifestRevision: harness.installed.manifestRevision,
    idempotencyKey: 'resume-request-1',
    requestedAt: '2026-07-23T11:00:00.000Z',
    resumeReason: 'Resume from offline-verified council evidence.',
    persistedFingerprint: harness.persisted,
    installedFingerprint: harness.installed,
    migrationRegistry: harness.registry,
    lease: {
      runId: RUN_ID,
      roundId: ROUND_ID,
      leaseId: 'lease-1',
      generation: 1,
      deadlineAt: '2026-07-24T11:00:00.000Z',
      remainingMs: 86_400_000,
      replayFingerprint: harness.scenario.bundle.certificate.body.replayFingerprint,
    },
    checkpoint: null,
    certificateBundle: harness.scenario.bundle,
    ...overrides,
  };
}

function resumed(result: DeepAiCouncilResumeAdapterResult) {
  expect(result.status).not.toBe('rebuild_required');
  if (result.status === 'rebuild_required') {
    throw new Error(result.reasonCodes.join(','));
  }
  return result;
}

async function appendEffectEvent(
  harness: ResumeHarness,
  eventType: string,
  eventId: string,
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
    stream_id: 'effect-stream-1',
    stream_sequence: streamSequence,
    occurred_at: '2026-07-23T10:30:00.000Z',
    recorded_at: '2026-07-23T10:30:00.000Z',
    producer: { name: 'deep-ai-council-effect-fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: RUN_ID,
    causation_id: causationId,
    idempotency_key: idempotencyKey,
    payload,
  }, harness.effectRegistry);
  const request = await createFixtureRequest(
    harness.effectLedger,
    prepared,
    harness.effectPolicies,
    `effect-request-${streamSequence}`,
  );
  const authorization = await harness.effectGateway.authorize(request);
  if (authorization.verdict !== 'allow') throw new Error('Effect fixture denied');
  await appendAuthorizedForTest(harness.effectLedger, 
    prepared,
    authorization.proof,
  );
  const verified = (await harness.effectLedger.readVerifiedEvents()).at(-1);
  if (verified === undefined) throw new Error('Effect append was not durable');
  return verified;
}

async function appendCouncilHistoryProbe(
  harness: ResumeHarness,
  cursor: Readonly<{
    streamId: string;
    streamSequence: number;
    causationId: string | null;
  }>,
): Promise<void> {
  const verifiedEvents = await harness.scenario.ledger.readVerifiedEvents();
  const last = verifiedEvents.at(-1);
  if (last === undefined) throw new Error('Council history probe requires a durable tail');
  const lastEvent = last.event.effective.envelope as unknown as DeepAiCouncilLedgerEvent;
  const prepared = prepareDeepAiCouncilEvent({
    stem: 'ai_council.run_resumed',
    scope: { runId: RUN_ID, roundId: ROUND_ID, generation: 1 },
    prevEventHash: digest(lastEvent),
    replay: replayMetadata('authenticated-history-probe'),
    data: {
      priorTailDigest: last.frame.record_hash,
      sourceRunId: RUN_ID,
      resumeReason: 'Exercise authenticated cursor continuity.',
      generation: 1,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'resume-history-probe',
      continuationScopeRef: 'lease-history-probe',
    },
    eventId: 'event-history-probe',
    streamId: cursor.streamId,
    streamSequence: cursor.streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: TEST_PRODUCER,
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: cursor.causationId,
    idempotencyKey: 'council-history-probe',
  }, harness.scenario.registry);
  const request = await createFixtureRequest(
    harness.scenario.ledger,
    prepared,
    harness.scenario.policies,
    'council-history-probe-request',
  );
  const authorization = await harness.scenario.gateway.authorize(request);
  if (authorization.verdict !== 'allow') {
    throw new Error('Council history probe authorization was denied');
  }
  await appendAuthorizedForTest(harness.scenario.ledger, prepared, authorization.proof);
}

async function appendForgedConfirmation(
  harness: ResumeHarness,
): Promise<{
  readonly intent: EffectIntentPayload;
  readonly confirmation: EffectConfirmationPayload;
  readonly intentEventDigest: string;
}> {
  const intent: EffectIntentPayload = {
    effect_id: `effect-${digest('effect-key-1')}`,
    run_id: RUN_ID,
    logical_effect_id: 'logical-effect-1',
    effect_type: 'subprocess',
    operation: 'persist-council-artifact',
    target_identity: 'council-artifact-target',
    input_digest: digest('effect-input'),
    safe_metadata: {},
    secret_references: [],
    adapter: {
      adapter_id: 'council-effect-adapter',
      adapter_version: 'adapter@1',
      effect_type: 'subprocess',
      replay_safe: false,
      idempotency_mode: 'postcondition',
      reconciliation: 'none',
    },
    idempotency_key: 'effect-key-1',
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: digest('expected-postcondition'),
    replay_fingerprint: harness.persisted.finalDigest,
    requested_at: '2026-07-23T10:30:00.000Z',
  };
  const intentEventId = `effect-intent-${digest(intent.idempotency_key)}`;
  const intentEvent = await appendEffectEvent(
    harness,
    EFFECT_INTENT_EVENT_TYPE,
    intentEventId,
    1,
    intent.idempotency_key,
    intent,
    null,
  );
  const confirmation: EffectConfirmationPayload = {
    confirmation_id: `effect-confirmation-${digest(intent.idempotency_key)}`,
    effect_id: intent.effect_id,
    intent_event_id: intentEvent.event.effective.envelope.event_id,
    intent_event_digest: digest('forged-intent-event'),
    idempotency_key: intent.idempotency_key,
    adapter: {
      ...intent.adapter,
      adapter_version: 'adapter@forged',
    },
    external_receipt_digest: digest('external-receipt'),
    postcondition_digest: digest('forged-postcondition'),
    output_digest: digest('effect-output'),
    completion_class: 'executed',
    observed_at: '2026-07-23T10:31:00.000Z',
    safe_result_metadata: {},
  };
  await appendEffectEvent(
    harness,
    EFFECT_CONFIRMATION_EVENT_TYPE,
    'effect-confirmation-1',
    2,
    'effect-key-1-confirmation',
    confirmation,
    intentEvent.event.effective.envelope.event_id,
  );
  return {
    intent,
    confirmation,
    intentEventDigest: intentEvent.event.stored.digest,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. ADVERSARIAL RESUME TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep AI council resume adapter', { timeout: 180_000 }, () => {
  it('drives every typed resume disposition from verified prior evidence', async () => {
    const exact = await resumeHarness('matrix-exact');
    expect(resumed(await exact.adapter.resume(resumeRequest(exact))).decision.disposition)
      .toBe('exact-reuse');

    const compatibleInstalled = resumeFingerprint({
      targetDigest: digest('target-v2'),
    });
    const compatibleRegistry = migrationRegistry([{
      component: 'target',
      fromVersion: exact.persisted.targetDigest,
      toVersion: compatibleInstalled.targetDigest,
      outcome: 'compatible',
      revision: 'target-compatibility@1',
    }]);
    const compatible = await resumeHarness('matrix-compatible', {
      installed: compatibleInstalled,
      migrationRegistry: compatibleRegistry,
    });
    expect(resumed(
      await compatible.adapter.resume(resumeRequest(compatible)),
    ).decision.disposition).toBe('compatible');

    const migratedInstalled = resumeFingerprint({
      manifestRevision: 'manifest@2',
    });
    const migrateRegistry = migrationRegistry([{
      component: 'manifest',
      fromVersion: 'manifest@1',
      toVersion: 'manifest@2',
      outcome: 'migrate',
      revision: 'manifest-migration@2',
    }]);
    const migrate = await resumeHarness('matrix-migrate', {
      installed: migratedInstalled,
      migrationRegistry: migrateRegistry,
    });
    expect(resumed(
      await migrate.adapter.resume(resumeRequest(migrate)),
    ).decision.disposition).toBe('migrate');

    const blocked = await resumeHarness('matrix-blocked', {
      installed: resumeFingerprint({ modelFingerprint: digest('model-v2') }),
    });
    expect(resumed(
      await blocked.adapter.resume(resumeRequest(blocked)),
    ).decision.disposition).toBe('blocked');

    const rebuild = await resumeHarness('matrix-rebuild');
    const tamperedBundle = {
      ...rebuild.scenario.bundle,
      certificate: {
        ...rebuild.scenario.bundle.certificate,
        certificateDigest: digest('tampered-certificate'),
      },
    };
    const rebuildResult = await rebuild.adapter.resume(resumeRequest(rebuild, {
      certificateBundle: tamperedBundle,
    }));
    expect(rebuildResult.status).toBe('rebuild_required');
  });

  it('rejects caller-compatible drift unless a trusted registry authenticates it', async () => {
    const installed = resumeFingerprint({ toolFingerprint: digest('tool-v2') });
    const assertedCompatible = migrationRegistry([{
      component: 'tool',
      fromVersion: digest('config'),
      toVersion: installed.toolFingerprint,
      outcome: 'compatible',
      revision: 'caller-asserted-compatible@1',
    }]);
    const untrusted = await resumeHarness('untrusted-compatible', {
      installed,
      migrationRegistry: assertedCompatible,
      trustRegistry: false,
    });
    const blocked = resumed(
      await untrusted.adapter.resume(resumeRequest(untrusted)),
    );
    expect(blocked.decision.disposition).toBe('blocked');
    expect(blocked.decision.compatibility.find(
      (decision) => decision.component === 'tool',
    )?.outcome).toBe('blocked');

    const authenticatedMigration = migrationRegistry([{
      ...assertedCompatible.rules[0]!,
      outcome: 'migrate',
      revision: 'authenticated-tool-migration@1',
    }]);
    const trusted = await resumeHarness('trusted-migrate', {
      installed,
      migrationRegistry: authenticatedMigration,
    });
    expect(resumed(
      await trusted.adapter.resume(resumeRequest(trusted)),
    ).decision.disposition).toBe('migrate');
  });

  it('recomputes changed-input fingerprints and never silently reuses stale digests', async () => {
    const base = resumeFingerprint();
    const changed = resumeFingerprint({
      schemaVersion: 'schema@2',
      policyVersion: 'fixture-capability-policy@2',
      targetDigest: digest('target-v2'),
      toolFingerprint: digest('tool-v2'),
      modelFingerprint: digest('model-v2'),
      judgeFingerprint: digest('judge-v2'),
    });
    expect(changed.finalDigest).not.toBe(base.finalDigest);
    const harness = await resumeHarness('changed-inputs', { installed: changed });
    expect(resumed(
      await harness.adapter.resume(resumeRequest(harness)),
    ).decision.disposition).toBe('blocked');

    const staleInstalled = { ...changed, finalDigest: base.finalDigest };
    expect(() => parseDeepAiCouncilResumeRequest({
      ...resumeRequest(harness),
      installedFingerprint: staleInstalled,
    })).toThrow(/ordered inputs/);
  });

  it('cross-checks every loaded reducer, adapter, schema, and codec version', async () => {
    const fields = [
      ['reducerVersion', 'deep-ai-council-reducer@forged', 'reducer'],
      ['adapterVersion', 'deep-ai-council-resume-adapter@forged', 'adapter'],
      ['schemaVersion', 'deep-ai-council-projection@forged', 'schema'],
      ['codecVersion', 'deep-ai-council-codec@forged', 'codec'],
    ] as const;
    for (const [field, version, label] of fields) {
      const forged = resumeFingerprint({ [field]: version });
      const harness = await resumeHarness(`runtime-${label}`, {
        persisted: forged,
        installed: forged,
      });
      const result = resumed(await harness.adapter.resume(resumeRequest(harness)));
      expect(
        result.decision.compatibility.every((entry) => entry.outcome === 'exact'),
      ).toBe(true);
      expect(result.decision.disposition).toBe('blocked');
      expect(result.decision.decisionReason).toMatch(/loaded runtime contracts/);
    }
  });

  it('fails closed on a forged effect confirmation with only a matching effect id', async () => {
    const harness = await resumeHarness('forged-effect');
    const forged = await appendForgedConfirmation(harness);
    expect(forged.confirmation.effect_id).toBe(forged.intent.effect_id);
    expect(forged.confirmation.intent_event_id).toBe(
      `effect-intent-${digest(forged.intent.idempotency_key)}`,
    );
    expect(forged.confirmation.idempotency_key).toBe(forged.intent.idempotency_key);
    expect(forged.confirmation.intent_event_digest).not.toBe(forged.intentEventDigest);
    expect(digest(forged.confirmation.adapter)).not.toBe(digest(forged.intent.adapter));
    expect(forged.confirmation.postcondition_digest).not.toBe(
      forged.intent.expected_postcondition_digest,
    );
    expect(effectConfirmationBindsIntent(
      forged.confirmation,
      forged.intent,
      `effect-intent-${digest(forged.intent.idempotency_key)}`,
      forged.intentEventDigest,
    )).toBe(false);
    const result = resumed(await harness.adapter.resume(resumeRequest(harness)));
    expect(result.decision.effects).toHaveLength(1);
    expect(result.decision.effects[0]?.disposition).toBe('blocked');
    expect(result.decision.effects[0]?.attemptRefs).not.toContain(
      forged.confirmation.confirmation_id,
    );
  });

  it('refuses mutated and non-trusted-completion certificates', async () => {
    const mutated = await resumeHarness('mutated-certificate');
    const mutatedResult = await mutated.adapter.resume(resumeRequest(mutated, {
      certificateBundle: {
        ...mutated.scenario.bundle,
        certificate: {
          ...mutated.scenario.bundle.certificate,
          certificateDigest: digest('mutated'),
        },
      },
    }));
    expect(mutatedResult.status).toBe('rebuild_required');

    const incomplete = await resumeHarness('incomplete-certificate', {
      scenario: { failedTestGate: true },
    });
    const incompleteResult = await incomplete.adapter.resume(
      resumeRequest(incomplete),
    );
    expect(incompleteResult.status).toBe('rebuild_required');
    if (incompleteResult.status === 'rebuild_required') {
      expect(incompleteResult.reasonCodes).toContain(
        'certificate-lifecycle-untrusted',
      );
    }
  });

  it('rejects a self-consistent forged checkpoint cursor without appending', async () => {
    const harness = await resumeHarness('forged-checkpoint');
    const folded = foldDeepAiCouncilEvents(harness.scenario.events);
    if (folded.outcome === 'rebuild_required') {
      throw new Error(`Checkpoint fixture failed: ${folded.reasonCodes.join(',')}`);
    }
    const forgedTail = folded.checkpoint.sourceTailSequence + 1;
    const forgedCheckpoint = {
      projection: folded.checkpoint.projection,
      sourceTailSequence: forgedTail,
      sourceTailDigest: folded.checkpoint.sourceTailDigest,
      integrityDigest: digest({
        projectionDigest: deepAiCouncilProjectionIntegrityDigest(
          folded.checkpoint.projection,
        ),
        sourceTailSequence: forgedTail,
        sourceTailDigest: folded.checkpoint.sourceTailDigest,
      }),
    };
    const headBefore = await harness.scenario.ledger.getVerifiedHead();
    const result = await harness.adapter.resume(resumeRequest(harness, {
      idempotencyKey: 'resume-request-forged-checkpoint',
      checkpoint: forgedCheckpoint,
    }));
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') {
      throw new Error('Expected checkpoint rebuild');
    }
    expect(result.reasonCodes).toContain('cursor-gap');
    expect(await harness.scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('rejects a certificate frontier that disagrees with the replayed ledger tail', async () => {
    const harness = await resumeHarness('certificate-frontier');
    const events = await harness.scenario.ledger.readVerifiedEvents();
    const councilEvents = events.filter((event) => {
      const stem = event.event.effective.envelope.payload.stem;
      return typeof stem === 'string' && stem.startsWith('ai_council.');
    });
    const realTail = councilEvents.at(-1);
    const priorTail = councilEvents.at(-2);
    if (realTail === undefined || priorTail === undefined) {
      throw new Error('Certificate frontier fixture requires two ledger events');
    }
    const mismatchedBundle: DeepAiCouncilCertificateBundle = {
      ...harness.scenario.bundle,
      certificate: {
        ...harness.scenario.bundle.certificate,
        body: {
          ...harness.scenario.bundle.certificate.body,
          finalHead: {
            ledger_id: realTail.frame.ledger_id,
            sequence: realTail.frame.sequence,
            record_hash: priorTail.frame.record_hash,
          },
        },
      },
    };
    const headBefore = await harness.scenario.ledger.getVerifiedHead();
    const result = await harness.adapter.resume(resumeRequest(harness, {
      certificateBundle: mismatchedBundle,
    }));
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') {
      throw new Error('Expected certificate frontier rebuild');
    }
    expect(result.reasonCodes).toContain('certificate-head-mismatch');
    expect(result.authenticatedTail.recordHash).toBe(realTail.frame.record_hash);
    expect(await harness.scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('rejects an authenticated history with a cursor gap and split stream', async () => {
    const harness = await resumeHarness('authenticated-stream-split');
    await appendCouncilHistoryProbe(harness, {
      streamId: `${STREAM_ID}-split`,
      streamSequence: harness.scenario.events.length + 2,
      causationId: 'event-001',
    });
    const headBefore = await harness.scenario.ledger.getVerifiedHead();
    await expect(
      harness.adapter.resume(resumeRequest(harness)),
    ).rejects.toThrow(/cursor gap or split/);
    expect(await harness.scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('is idempotent and exports the complete council continuity ladder', async () => {
    const harness = await resumeHarness('idempotent');
    const request = resumeRequest(harness);
    const first = resumed(await harness.adapter.resume(request));
    const second = resumed(await harness.adapter.resume(request));
    expect(first.status).toBe('appended');
    expect(second.status).toBe('idempotent');
    expect(second.decision.decisionDigest).toBe(first.decision.decisionDigest);
    expect(DEEP_AI_COUNCIL_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'init',
      'deliberation',
      'critique',
      'convergence',
      'artifacts',
      'council-test-gate',
      'complete',
    ]);
    expect(second.dispatchedBranches).toBe(0);
  });
});
