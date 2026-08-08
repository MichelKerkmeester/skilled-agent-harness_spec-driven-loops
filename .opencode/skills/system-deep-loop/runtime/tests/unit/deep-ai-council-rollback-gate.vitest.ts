// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Rollback Gate Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
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
  DEEP_AI_COUNCIL_REDUCER_ID,
  DEEP_AI_COUNCIL_REDUCER_VERSION,
  createDeepAiCouncilProjectionState,
  reduceDeepAiCouncilVerifiedEvent,
} from '../../lib/deep-ai-council-reducers/index.js';
import {
  DeepAiCouncilModeMigrationGate,
  DeepAiCouncilRollbackSwitch,
  evaluateDeepAiCouncilRollbackWindow,
} from '../../lib/deep-ai-council-rollback-gate/index.js';
import {
  DEEP_AI_COUNCIL_COMPARATOR_VERSION,
  DEEP_AI_COUNCIL_LIFECYCLE_EVENT_MAP,
  DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST,
  createDeepAiCouncilModeGateInput,
} from '../../lib/deep-ai-council-shadow-parity/index.js';
import {
  DeepAiCouncilArtifactKinds,
  createDeepAiCouncilSealedArtifactStore,
  sealDeepAiCouncilArtifact,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
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
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
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
  DeepAiCouncilLifecycleEvidenceRow,
  DeepAiCouncilModeGateInput,
  DeepAiCouncilModeMigrationCertificate,
  DeepAiCouncilRollbackRequest,
  DeepAiCouncilVersionBindings,
} from '../../lib/deep-ai-council-rollback-gate/index.js';
import type {
  DeepAiCouncilParityCertificateEvidenceBinding,
  DeepAiCouncilParityReceipt,
  DeepAiCouncilResumeParityEvidence,
} from '../../lib/deep-ai-council-shadow-parity/index.js';
import type {
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilSealedArtifactBinding,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';
import type { ReplayExecutionInput } from '../../lib/replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../../lib/sealed-reference-artifacts/index.js';
import type { HealthAggregate } from '../../lib/health-degeneration-harness/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
  InflightClassificationManifest,
  StateBackendCensus,
  StateBackendCensusRow,
} from '../../lib/inflight-state-classification/index.js';
import type { ProtectedResourceIdentity } from '../../lib/locks-and-fencing/index.js';
import type {
  CertificationProfile,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type {
  DrillInputBindings,
  InflightClassificationManifest as RollbackClassificationManifest,
  Phase014RollbackEvidenceInput,
  RollbackDrillClock,
  RollbackDrillManifest,
  RollbackDrillOptions,
  RollbackLaneState,
} from '../../lib/rollback-drills/index.js';
import type {
  ParityCertificateBindings,
  ShadowParityCasePass,
} from '../../lib/shadow-parity/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

type ReplayProjection = DeepAiCouncilProjectionState & JsonObject;

interface Scenario {
  readonly bundle: DeepAiCouncilCertificateBundle;
  readonly verification: DeepAiCouncilOfflineVerificationInput<ReplayProjection>;
  readonly artifactStore: ReturnType<typeof createDeepAiCouncilSealedArtifactStore>;
  readonly artifactBindings: readonly DeepAiCouncilSealedArtifactBinding[];
}

interface ScenarioOptions {
  readonly fabricatedDependencyDigest?: boolean;
  readonly failedTestGate?: boolean;
  readonly conflictingLogicalOperation?: boolean;
  readonly missingRequiredTransition?: boolean;
  readonly orphanArtifact?: boolean;
  readonly reorderedTransitions?: boolean;
  readonly wrongKindDependency?: boolean;
}

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const ROUND_ID = 'round-1';
const STREAM_ID = 'deep-ai-council-certificate-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const TEST_PRODUCER = Object.freeze({ name: 'deep-ai-council-certificate-tests', version: '1' });
const temporaryRoots: string[] = [];
const registry = createDeepAiCouncilEventRegistry();
const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_BYTES = readFileSync(join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
));
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const BASE_SHA = '1'.repeat(40);
const ROLLBACK_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'deep-ai-council-rollback-gate-drill-provider',
  key_id: 'deep-ai-council-rollback-gate-drill-key',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const ROLLBACK_PROVIDER = createHmacCertificationProvider(
  ROLLBACK_PROFILE,
  'deep-ai-council-rollback-gate-drill-secret-more-than-thirty-two-bytes',
);

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-ai-council-certificate-${label}-`));
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
    initialReplayFingerprint: digest('initial-replay'),
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
  return { ledger, registry: evidenceRegistry, receiptSubstrate };
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
  const { ledger, registry, receiptSubstrate } = await authorizedLedger(events);
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

describe('deep AI council certificates', () => {
  it('covers every required transition kind in lifecycle order', () => {
    expect(DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER).toEqual([
      DeepAiCouncilTransitionKinds.INIT,
      DeepAiCouncilTransitionKinds.SEAT_SELECT_DISPATCH,
      DeepAiCouncilTransitionKinds.SEAT_RETURN,
      DeepAiCouncilTransitionKinds.CRITIQUE_ROUND,
      DeepAiCouncilTransitionKinds.CANDIDATE_BLIND_JUDGE,
      DeepAiCouncilTransitionKinds.SYNTHESIS,
      DeepAiCouncilTransitionKinds.CONVERGENCE,
      DeepAiCouncilTransitionKinds.ARTIFACT_COMMIT,
      DeepAiCouncilTransitionKinds.COUNCIL_TEST_GATE,
      DeepAiCouncilTransitionKinds.COMPLETE,
    ]);
  });

  it('issues and verifies a trusted-completion certificate through real substrates', async () => {
    const current = await scenario();
    expect(current.bundle.certificate.body.authority).toBe('dark-evidence-only');
    expect(current.bundle.certificate.body.lifecycleResult).toBe('trusted-completion');
    expect(current.bundle.receipts.length).toBeGreaterThanOrEqual(
      DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER.length,
    );

    const result = await verifyDeepAiCouncilCertificateOffline(current.verification);
    expect(result.verdict).toBe('valid');
    if (result.verdict !== 'valid') throw new Error(result.failureReason);
    expect(result.certificateDigest).toBe(current.bundle.certificate.certificateDigest);
  });

  it('rejects coherent incomplete lifecycle evidence as not trusted-completion', async () => {
    const current = await scenario({ failedTestGate: true });
    expect(current.bundle.certificate.body.lifecycleResult).toBe('incomplete');
    expect(current.bundle.certificate.body.testGateEvidence.verdict).toBe('fail');

    const result = await verifyDeepAiCouncilCertificateOffline(current.verification);
    expect(result).toMatchObject({
      verdict: 'incomplete',
      code: DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      evidenceLocation: 'certificate:lifecycle',
    });
  });

  it('rejects a sealed artifact with no authorized ledger-event correspondence', async () => {
    await expect(scenario({ orphanArtifact: true })).rejects.toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.AUTHORIZATION_INVALID,
    });
  });

  it('rejects a certificate whose replay fingerprint was tampered independently', async () => {
    const current = await scenario();
    const forgedBundle: DeepAiCouncilCertificateBundle = {
      ...current.bundle,
      certificate: {
        ...current.bundle.certificate,
        body: {
          ...current.bundle.certificate.body,
          replayFingerprint: digest('tampered-certificate-replay'),
        },
      },
    };
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      bundle: forgedBundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAiCouncilCertificateFailureCodes.REPLAY_INVALID,
      evidenceLocation: 'replay:fingerprint',
    });
  });

  it('rejects required transition receipts emitted out of lifecycle order', async () => {
    await expect(scenario({ reorderedTransitions: true })).rejects.toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects conflicting receipt facts that reuse one logical operation identity', async () => {
    await expect(scenario({ conflictingLogicalOperation: true })).rejects.toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
    });
  });

  it('rejects a receipt chain missing a required synthesis transition', async () => {
    await expect(scenario({ missingRequiredTransition: true })).rejects.toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING,
      evidenceLocation: 'receipt:synthesis',
    });
  });

  it('rejects a tampered shared certificate certification signature', async () => {
    const current = await scenario();
    const certification = current.bundle.certificate.sharedCertificationReceipt.certification;
    const firstCharacter = certification.signature_base64.startsWith('A') ? 'B' : 'A';
    const forgedBundle: DeepAiCouncilCertificateBundle = {
      ...current.bundle,
      certificate: {
        ...current.bundle.certificate,
        sharedCertificationReceipt: {
          ...current.bundle.certificate.sharedCertificationReceipt,
          certification: {
            ...certification,
            signature_base64: `${firstCharacter}${certification.signature_base64.slice(1)}`,
          },
        },
      },
    };
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      bundle: forgedBundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAiCouncilCertificateFailureCodes.CERTIFICATION_INVALID,
    });
  });

  it('rejects an extra field at the strict certificate-bundle schema boundary', async () => {
    const current = await scenario();
    let thrown: unknown;
    try {
      parseDeepAiCouncilCertificateBundle({
        ...structuredClone(current.bundle),
        unregisteredField: true,
      });
    } catch (error: unknown) {
      thrown = error;
    }
    expect(thrown).toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.CERTIFICATE_INVALID,
      evidenceLocation: 'bundle',
    });
  });

  it('returns unverifiable when offline verification lacks certified sealed bytes', async () => {
    const current = await scenario();
    const prunedStore = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('pruned-artifacts'),
    });
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      artifactStore: prunedStore,
    });
    expect(result).toMatchObject({
      verdict: 'unverifiable',
      code: DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
    });
    expect(result.verdict).not.toBe('invalid');
    expect(result.verdict).not.toBe('valid');
  });

  it('fails closed when dependency closure names a fabricated digest', async () => {
    await expect(scenario({ fabricatedDependencyDigest: true })).rejects.toMatchObject({
      code: DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
    });

    const current = await scenario();
    const bundle = structuredClone(current.bundle);
    const claim = bundle.certificate.body.artifactClaims.find((candidate) => (
      candidate.binding.artifactKind === DeepAiCouncilArtifactKinds.SYNTHESIS
    ));
    if (!claim) throw new Error('Expected synthesis claim');
    const material = JSON.parse(JSON.stringify(claim)) as {
      binding: DeepAiCouncilSealedArtifactBinding;
    };
    const verified = await sealDeepAiCouncilArtifact(
      current.artifactStore,
      DeepAiCouncilArtifactKinds.SYNTHESIS,
      {
        ...materialFor(
          DeepAiCouncilArtifactKinds.SYNTHESIS,
          'synthesis-forged-deps',
          eventByStem(current.verification.projectionEvents, 'ai_council.deliberation_synthesized'),
          digest('selected-plan'),
          [digest('fabricated-dependency')],
        ),
      },
    );
    const forgedClaimIndex = bundle.certificate.body.artifactClaims.findIndex((candidate) => (
      candidate.binding.artifactKind === DeepAiCouncilArtifactKinds.SYNTHESIS
    ));
    const forgedClaims = [...bundle.certificate.body.artifactClaims];
    forgedClaims[forgedClaimIndex] = {
      ...claim,
      binding: verified,
      descriptorDigest: verified.reference.descriptor_digest,
      contentDigest: verified.reference.content_digest,
    };
    const forgedBundle = {
      ...bundle,
      certificate: {
        ...bundle.certificate,
        body: {
          ...bundle.certificate.body,
          artifactClaims: forgedClaims,
        },
      },
    };
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      bundle: forgedBundle,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
    });
  });

  it('fails closed when replacement synthesis evidence breaks convergence correspondence', async () => {
    const current = await scenario();
    const synthesisClaim = current.bundle.certificate.body.artifactClaims.find((claim) => (
      claim.binding.artifactKind === DeepAiCouncilArtifactKinds.SYNTHESIS
    ));
    const targetClaim = current.bundle.certificate.body.artifactClaims.find((claim) => (
      claim.binding.artifactKind === DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT
    ));
    if (!synthesisClaim || !targetClaim) throw new Error('Missing wrong-kind fixture');

    const wrongKindBinding = await sealDeepAiCouncilArtifact(
      current.artifactStore,
      DeepAiCouncilArtifactKinds.SYNTHESIS,
      materialFor(
        DeepAiCouncilArtifactKinds.SYNTHESIS,
        'synthesis-wrong-kind-deps',
        eventByStem(current.verification.projectionEvents, 'ai_council.deliberation_synthesized'),
        digest('selected-plan'),
        [plainContentDigest(targetClaim.contentDigest)],
      ),
    );
    const forgedClaims = current.bundle.certificate.body.artifactClaims.map((claim) => (
      claim.binding.artifactKind === DeepAiCouncilArtifactKinds.SYNTHESIS
        ? {
            ...claim,
            binding: wrongKindBinding,
            descriptorDigest: wrongKindBinding.reference.descriptor_digest,
            contentDigest: wrongKindBinding.reference.content_digest,
          }
        : claim
    ));
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      bundle: {
        ...current.bundle,
        certificate: {
          ...current.bundle.certificate,
          body: {
            ...current.bundle.certificate.body,
            artifactClaims: forgedClaims,
          },
        },
      },
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
    });
  });

  it('fails closed when an artifact claim forges a wrong-kind binding', async () => {
    const current = await scenario();
    const forged = bundleWithForgedBinding(current.bundle, current.artifactBindings);
    const result = await verifyDeepAiCouncilCertificateOffline({
      ...current.verification,
      bundle: forged,
    });
    expect(result).toMatchObject({
      verdict: 'invalid',
      code: DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
    });
  });
});

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

function proofFor(rowId: string, disposition: keyof typeof InflightDisposition): DispositionProof {
  switch (disposition) {
    case InflightDisposition.UPCAST:
      return {
        kind: 'upcast', adjacentChainComplete: true, pure: true, deterministic: true,
        sideEffectFree: true, sourceBytesPreserved: true, immutableIdentityPreserved: true,
        replayEquivalent: true, sourceBytesDigest: digest(`${rowId}:source`),
        effectiveStateDigest: digest(`${rowId}:effective`), registryDigest: digest(`${rowId}:registry`),
        chainIdentitiesDigest: digest(`${rowId}:chain`),
      };
    case InflightDisposition.PIN:
      return {
        kind: 'pin', legacyWriterSoleAuthority: true, legacyCompletionAvailable: true,
        boundedCompletion: true, timedOut: false, terminalBoundary: 'legacy-terminal-receipt',
        terminalReceiptRequired: true,
      };
    case InflightDisposition.FORK:
      return {
        kind: 'fork', executionNamespace: `shadow-${rowId}`, effectNamespace: `effects-${rowId}`,
        shadowOnlySink: true, livePublicationEnabled: false, sourceStateUnchanged: true,
        authorityUnaffected: true, budgetsUnaffected: true,
      };
    case InflightDisposition.MIGRATE:
      return {
        kind: 'migrate', quiescentCheckpoint: true, transactionalSnapshot: true,
        atomicImport: true, reversible: true, identityPreserved: true, orderPreserved: true,
        idempotencyPreserved: true, budgetsPreserved: true, receiptsPreserved: true,
        pendingWorkPreserved: true, checkpointDigest: digest(`${rowId}:checkpoint`),
        restorationReceiptDigest: digest(`${rowId}:restoration`),
      };
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
    rowId: row.id,
    isPresent: !block,
    stateDigest: digest(`${row.id}:state`),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(`${row.id}:schema`),
    lifecyclePoint: row.lifecycle,
    authorityState: 'legacy_authoritative',
    authorityEpoch: 7,
    mutability: row.mutability,
    leaseState: pin ? 'active' : 'none',
    activeLeaseCount: pin ? 1 : 0,
    leaseSetDigest: digest(`${row.id}:leases`),
    pendingEffectsState: pin ? 'active-legacy' : 'none',
    pendingEffectSetDigest: digest(`${row.id}:effects`),
    identityCoverage: true,
    orderCoverage: true,
    idempotencyCoverage: true,
    budgetCoverage: true,
    receiptCoverage: true,
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: `anchor-${row.id}`,
      digest: digest(`${row.id}:anchor`),
      retained: true,
      restorable: true,
      minimumRetentionDays: 14,
      minimumSuccessfulRuns: 5,
    },
    verifier: {
      verified: true,
      receiptDigest: digest(`${row.id}:verifier`),
      replayFingerprintDigest: policy.disposition === InflightDisposition.UPCAST
        ? digest(`${row.id}:replay`)
        : null,
      rollbackScenarioDigest: digest(`${row.id}:rollback`),
      parityCaseDigest: policy.disposition === InflightDisposition.FORK
        ? digest(`${row.id}:parity`)
        : null,
    },
    proof: proofFor(row.id, policy.disposition),
  };
}

function classificationManifest(): InflightClassificationManifest {
  return createClassificationManifest({
    classificationId: 'deep-ai-council-rollback-classification',
    classifiedAt: '2026-07-22T12:00:00Z',
    classifierBuildId: 'deep-ai-council-rollback-gate-tests',
    censusBytes: CENSUS_BYTES,
    evidence: CENSUS.rows.map(evidenceFor),
  }).manifest;
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
    verifier: 'deep-ai-council-rollback-gate-verifier',
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
  const anchorId = 'deep-ai-council-rollback-anchor';
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
    drillId: 'deep-ai-council-rollback-gate-drill',
    mode: 'deep-ai-council',
    baseSha: digest('rollback-base-commit').slice(0, 40),
    candidateSha: digest('rollback-candidate-commit').slice(0, 40),
    policyVersion: 'rollback-policy@1',
    verifierIdentity: 'deep-ai-council-rollback-gate-verifier',
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
  currentClassificationDigest: string,
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
    currentMode: 'deep-ai-council',
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
    classificationManifest: currentClassificationDigest,
  });
  const facts = Object.freeze({
    ...result.certificate.facts,
    bindings: currentBindings,
    classificationDigest: currentClassificationDigest,
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
      expectedMode: 'deep-ai-council',
      currentBindings,
      certificationProvider: ROLLBACK_PROVIDER,
    },
    candidateSha: facts.candidateSha,
    verifierIdentity: facts.verifierIdentity,
    verifierVersion: certificate.certification.verifier_version,
    rollbackAnchorDigest: facts.bindings.rollbackAsset,
  };
}

async function gatewayHarness(
  authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 },
) {
  const rootDirectory = temporaryRoot('gateway');
  const eventRegistry = createFixtureEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'fixture-capability-policy',
    policyVersion: 1,
    evaluatorVersion: 'deep-ai-council-rollback-gate-tests@1',
    ruleIds: ['external-authority-required', 'externally-authorized-recovery'],
    evaluate: (input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult => {
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
  const authorityProvider = () => authority;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { rootDirectory, eventRegistry, policies, ledger, gateway };
}

function parityEvidenceBinding(
  fixtureId: string,
  streamDigest: string,
  caseEvidenceDigest: string,
  referenceSetDigest: string,
  attestationDigest: string,
): DeepAiCouncilParityCertificateEvidenceBinding {
  return {
    fixtureId,
    legacyStreamDigest: streamDigest,
    ledgerStreamDigest: streamDigest,
    legacyProjectionFingerprint: digest('parity-projection'),
    ledgerProjectionFingerprint: digest('parity-projection'),
    caseEvidenceDigest,
    referenceSetDigest,
    attestationFinalDigests: [attestationDigest],
  };
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_AI_COUNCIL_COMPARATOR_VERSION,
    lifecycleMap: DEEP_AI_COUNCIL_LIFECYCLE_EVENT_MAP,
    volatilityAllowlist: DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST,
    sealedArtifactKinds: DeepAiCouncilArtifactKinds,
    diffClasses: [
      'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision',
    ],
  });
}

function parityCertificateBindings(
  manifestDigest: string,
  evidence: readonly DeepAiCouncilParityCertificateEvidenceBinding[],
): ParityCertificateBindings {
  return {
    candidate_build_digest: digest({
      manifestDigest,
      schemaVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-ai-council-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-ai-council-resume-adapter',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: 'deep-ai-council:shadow-parity-fold',
      reducerVersion: 'deep-ai-council-shadow-parity-reducer@1',
      projectionVersion: 'deep-ai-council-parity-projection@1',
    }),
    reducer_digest: digest({ reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      adapterVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: DEEP_AI_COUNCIL_LIFECYCLE_EVENT_MAP,
      certificateEvidenceBindings: evidence,
    }),
    policy_version: 'deep-ai-council-shadow-only@1',
  };
}

async function parityFixture(authorized: boolean): Promise<Readonly<{
  manifest: ReturnType<typeof compileParityCaseManifest>;
  receipt: DeepAiCouncilParityReceipt;
  modeGateInput: ReturnType<typeof createDeepAiCouncilModeGateInput>;
  rootDirectory: string;
}>> {
  const harness = await gatewayHarness();
  const event = createFixtureEvent(harness.eventRegistry, 1);
  const attestationDigest = digest('parity-attestation');
  if (authorized) {
    const request = await createFixtureRequest(
      harness.ledger,
      event,
      harness.policies,
      'deep-ai-council-parity-anchor',
      { mode: 'deep-ai-council', evidenceDigest: attestationDigest },
    );
    expect((await harness.gateway.authorize(request)).verdict).toBe('allow');
  }
  const fixtureId = 'normal-completion';
  const contractDigest = digest('deep-ai-council-parity-contract');
  const manifest = compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: fixtureId,
      mode: 'deep-ai-council',
      contractDigest,
      disposition: 'protected',
    }],
    cases: [{
      caseId: fixtureId,
      scenarioId: fixtureId,
      mode: 'deep-ai-council',
      contractDigest,
      requiredObservations: ['ordered-transitions'],
      projectionIds: ['council'],
      timeoutMs: 1_000,
      terminationPolicy: 'bounded',
    }],
  });
  const pass: ShadowParityCasePass = {
    ok: true,
    caseId: fixtureId,
    mode: 'deep-ai-council',
    referenceSetDigest: digest('parity-reference'),
    capsuleDigest: digest('parity-capsule'),
    runs: [1, 2].map((runIndex) => ({
      runIndex,
      legacy: {
        finalDigest: attestationDigest,
        descriptorDigest: digest('parity-descriptor'),
        storedDigest: digest('parity-stored'),
        effectiveEventDigest: digest('parity-effective'),
        projectionDigest: digest('parity-projection'),
        replayContractDigest: digest('parity-replay-contract'),
        sealedInputDigest: digest('parity-sealed'),
        attestationSequence: runIndex,
        descriptor: {} as never,
      },
      dark: {
        finalDigest: attestationDigest,
        descriptorDigest: digest('parity-descriptor'),
        storedDigest: digest('parity-stored'),
        effectiveEventDigest: digest('parity-effective'),
        projectionDigest: digest('parity-projection'),
        replayContractDigest: digest('parity-replay-contract'),
        sealedInputDigest: digest('parity-sealed'),
        attestationSequence: runIndex,
        descriptor: {} as never,
      },
      observationDigest: digest('parity-observation'),
      legacyProjectionDigest: digest('parity-projection'),
      darkProjectionDigest: digest('parity-projection'),
      runEvidenceDigest: digest(`parity-run-${runIndex}`),
    })),
    evidenceDigest: digest('parity-case-evidence'),
    openDivergenceCount: 0,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  };
  const binding = parityEvidenceBinding(
    fixtureId,
    event.canonicalDigest,
    pass.evidenceDigest,
    pass.referenceSetDigest,
    attestationDigest,
  );
  const issued = issueParityCertificate({
    manifest,
    mode: 'deep-ai-council',
    caseResults: [pass],
    bindings: parityCertificateBindings(manifest.manifestDigest, [binding]),
  });
  if (!issued.ok) throw new Error(issued.refusal.message);
  const body = {
    schemaVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `receipt-${fixtureId}`,
    baseSha: BASE_SHA,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: 'deep-ai-council-event@1',
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    comparatorVersion: DEEP_AI_COUNCIL_COMPARATOR_VERSION,
    projectionVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId,
    legacyStreamDigest: event.canonicalDigest,
    ledgerStreamDigest: event.canonicalDigest,
    legacyProjectionFingerprint: digest('parity-projection'),
    ledgerProjectionFingerprint: digest('parity-projection'),
    exitStatus: 'green' as const,
    diffDispositions: [],
    parityCertificate: issued.certificate,
    certificateEvidenceBindings: [binding],
    parityCertificateDigest: issued.certificate.certificate_digest,
    certificateStatus: 'issued' as const,
    certificateRefusalCode: null,
    genericDivergenceId: null,
    genericDivergenceClass: null,
    authorityState: 'legacy-authoritative' as const,
    authorityMutation: false as const,
    cutoverCertificate: false as const,
    reproducibilityDigest: digest({
      baseSha: BASE_SHA,
      runManifestDigest: manifest.manifestDigest,
      fixtureId,
      legacyStreamDigest: event.canonicalDigest,
      ledgerStreamDigest: event.canonicalDigest,
      legacyProjectionFingerprint: digest('parity-projection'),
      ledgerProjectionFingerprint: digest('parity-projection'),
      diffDispositions: [],
    }),
  };
  const receipt: DeepAiCouncilParityReceipt = { ...body, receiptDigest: digest(body) };
  const modeGateInput = createDeepAiCouncilModeGateInput({
    manifest,
    expectedFixtureIds: [fixtureId],
    receipts: [receipt],
  });
  return { manifest, receipt, modeGateInput, rootDirectory: harness.rootDirectory };
}

function healthyAggregate(): HealthAggregate {
  return {
    schemaVersion: 1,
    aggregateId: 'deep-ai-council-rollback-gate-health',
    state: 'healthy',
    severity: 'info',
    observationId: 'deep-ai-council-rollback-gate-health-observation',
    activeSignalIds: [],
    policyVersion: 'health-policy@1',
    policyDigest: digest('health-policy'),
  };
}

function resumeEvidence(certificate: Scenario['bundle']): DeepAiCouncilResumeParityEvidence {
  const lease = {
    runId: RUN_ID,
    roundId: ROUND_ID,
    leaseId: 'lease-1',
    generation: 1,
    deadlineAt: '2026-07-23T12:00:00Z',
    remainingMs: 60_000,
    replayFingerprint: digest('resume-replay'),
  };
  const receiptDigests = certificate.receipts.map((entry) => entry.receiptDigest).sort();
  const verifiedArtifactDigests = certificate.certificate.body.artifactClaims
    .map((entry) => entry.binding.reference.qualified_digest)
    .sort();
  const decision = {
    decisionVersion: 1,
    decisionId: 'resume-decision-1',
    decisionDigest: digest('resume-decision-1'),
    authority: 'dark-evidence-only',
    legacyAuthority: 'unchanged',
    productionCompletion: false,
    disposition: 'exact-reuse',
    compatibilityOutcome: 'exact',
    manifestDisposition: 'original',
    compatibility: [],
    branches: [],
    effects: [],
    invalidation: {
      changedComponents: [],
      invalidatedLogicalBranchIds: [],
      invalidatedArtifactIds: [],
      convergenceReopened: false,
      testGateReopened: false,
    },
    lease,
    certificateDigest: certificate.certificate.certificateDigest,
    receiptDigests,
    verifiedArtifactDigests,
    persistedResumeFingerprint: digest('resume-fingerprint'),
    installedResumeFingerprint: digest('resume-fingerprint'),
    decisionReason: 'Verified council continuity evidence is reusable.',
  } as const;
  return {
    legacyDecision: decision,
    ledgerDecision: {
      ...decision,
      decisionId: 'resume-decision-2',
      decisionDigest: digest('resume-decision-2'),
    },
    legacyEventTailDigest: digest('resume-tail'),
    ledgerEventTailDigest: digest('resume-tail'),
    legacyFreshProjectionFingerprint: digest('resume-projection'),
    ledgerFreshProjectionFingerprint: digest('resume-projection'),
  };
}

function lifecycleRows(
  parityReceipt: DeepAiCouncilParityReceipt,
  current: Scenario,
): readonly DeepAiCouncilLifecycleEvidenceRow[] {
  const identities = [
    {
      fixtureId: parityReceipt.fixtureId,
      eventDigest: parityReceipt.ledgerStreamDigest,
      receiptDigest: parityReceipt.receiptDigest,
    },
    ...current.bundle.receipts.map((entry) => ({
      fixtureId: entry.facts.transitionId,
      eventDigest: entry.facts.resultEventDigest,
      receiptDigest: entry.receiptDigest,
    })),
    ...current.artifactBindings.map((entry) => ({
      fixtureId: entry.artifactKind,
      eventDigest: entry.reference.content_digest,
      receiptDigest: entry.reference.descriptor_digest,
    })),
  ];
  const kinds: readonly DeepAiCouncilLifecycleEvidenceRow['kind'][] = [
    'normal-completion',
    'multi-round-deliberation',
    'seat-timeout',
    'seat-error',
    'unresolved-contradiction',
    'max-round-non-convergence',
    'partial-artifact-persistence',
    'rollback',
    'resume-boundaries',
    'blinded-adjudication',
  ];
  return kinds.map((kind, index) => {
    const identity = identities[index];
    if (!identity) throw new Error('Lifecycle evidence fixture is incomplete');
    return { kind, ...identity, status: 'covered' };
  });
}

function successfulWindowExecutions(count = 5) {
  return Array.from({ length: count }, (_, index) => ({
    executionId: `successful-council-execution-${index + 1}`,
    authorityState: 'new_authoritative_reversible' as const,
    authorityEpoch: 2,
    result: 'trusted-completion' as const,
    certificateDigest: digest(`successful-council-certificate-${index + 1}`),
  }));
}

async function validModeGateInput(): Promise<DeepAiCouncilModeGateInput<ReplayProjection>> {
  const parity = await parityFixture(true);
  const current = await scenario();
  const classification = classificationManifest();
  const rollback = await phase014Evidence(classification.finalDigest);
  return {
    candidateSha: rollback.candidateSha,
    baseSha: BASE_SHA,
    sharedContractDigest: digest('shared-contract'),
    writeSetDigest: digest('write-set'),
    versions: {
      eventEnvelopeVersion: 1,
      eventSchemaVersion: 'deep-ai-council-event@1',
      reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
      projectionVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    },
    verifierIdentity: rollback.verifierIdentity,
    verifierVersion: rollback.verifierVersion,
    authority: { state: 'legacy_authoritative', epoch: 1 },
    parity: {
      manifest: parity.manifest,
      modeGateInput: parity.modeGateInput,
      receipts: [parity.receipt],
      authorizationAuditRootDirectory: parity.rootDirectory,
      authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    },
    sealedArtifacts: {
      store: current.artifactStore,
      bindings: current.artifactBindings,
    },
    certificates: { verificationInput: current.verification },
    resumeEvidence: resumeEvidence(current.bundle),
    lifecycle: lifecycleRows(parity.receipt, current),
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
    unresolvedRiskIds: [],
  };
}

async function genuineGateEvidence(): Promise<Readonly<{
  gateInput: DeepAiCouncilModeGateInput<ReplayProjection>;
  certificate: DeepAiCouncilModeMigrationCertificate;
}>> {
  const gateInput = await validModeGateInput();
  const result = await new DeepAiCouncilModeMigrationGate().evaluate(gateInput);
  if (!result.certificate) throw new Error(`Expected gate certificate, got ${JSON.stringify(result)}`);
  return { gateInput, certificate: result.certificate };
}

interface RollbackFixtureClaims {
  readonly staleFenceToken?: number;
  readonly rollbackAnchorDigest?: string;
  readonly transformLease?: (lease: NonNullable<DeepAiCouncilRollbackRequest['staleWriterLease']>) => unknown;
}

async function rollbackRequestFixture(
  capabilityId = 'externally-authorized-recovery',
  claims: RollbackFixtureClaims = {},
): Promise<Readonly<{
  input: DeepAiCouncilRollbackRequest;
  rollbackSwitch: DeepAiCouncilRollbackSwitch;
  coordinator: FencedLeaseCoordinator;
}>> {
  const authority: AuthoritySnapshot = { state: 'new_authoritative_reversible', epoch: 1 };
  const harness = await gatewayHarness(authority);
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory: temporaryRoot('rollback-fencing'),
    operationTimeoutMs: 1_000,
  });
  const writerResource = {
    kind: ProtectedResourceKinds.WRITER,
    components: { writerId: 'deep-ai-council-ledger-writer' },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  } as const;
  const issuedLease = await coordinator.acquire({
    resource: writerResource,
    ownerId: 'stale-deep-ai-council-writer',
    correlationId: 'stale-deep-ai-council-writer',
    ttlMs: 60_000,
    acquireTimeoutMs: 1_000,
  });
  await coordinator.release(issuedLease);
  const staleWriterLease = claims.transformLease
    ? claims.transformLease(issuedLease)
    : claims.staleFenceToken === undefined
      ? issuedLease
      : { ...issuedLease, fenceToken: claims.staleFenceToken };
  const gateEvidence = await genuineGateEvidence();
  const classification = classificationManifest();
  const resume = gateEvidence.gateInput.resumeEvidence!;
  const rollbackReason = 'Health evidence requires non-destructive legacy restoration.';
  const rollbackAnchorDigest = claims.rollbackAnchorDigest
    ?? gateEvidence.certificate.rollbackAnchorDigest;
  const retainedCounts = {
    retainedEventCountBefore: 9,
    retainedEventCountAfter: 9,
    retainedArtifactCountBefore: 12,
    retainedArtifactCountAfter: 12,
  };
  const evidenceDigest = digest({
    configurationVersion: 'rollback-policy@1',
    operation: 'rollback',
    rollbackReason,
    currentAuthorityState: authority.state,
    currentAuthorityEpoch: authority.epoch,
    gateCertificateDigest: gateEvidence.certificate.certificateDigest,
    classificationDigest: classification.finalDigest,
    resumeEvidenceDigest: digest(resume),
    writerResourceDigest: canonicalizeProtectedResource(writerResource).resourceDigest,
    staleWriterLeaseDigest: digest(staleWriterLease),
    rollbackAnchorDigest,
    ...retainedCounts,
  });
  const event = createFixtureEvent(harness.eventRegistry, 1);
  const authorizationRequest = await createFixtureRequest(
    harness.ledger,
    event,
    harness.policies,
    `deep-ai-council-rollback-${capabilityId}`,
    { mode: 'deep-ai-council', capabilityId, evidenceDigest },
  );
  const input = {
    configurationVersion: 'rollback-policy@1',
    operation: 'rollback',
    currentAuthority: authority,
    expectedAuthorityEpoch: authority.epoch,
    gateCertificate: gateEvidence.certificate,
    gateInput: gateEvidence.gateInput,
    authorizationRequest,
    rollbackReason,
    admissionState: 'frozen',
    classificationManifest: classification,
    resumeEvidence: resume,
    writerResource,
    staleWriterLease,
    destructiveIntent: 'none',
    ...retainedCounts,
    rollbackAnchorDigest,
  } as DeepAiCouncilRollbackRequest;
  return {
    input,
    rollbackSwitch: new DeepAiCouncilRollbackSwitch({ gateway: harness.gateway, fencingCoordinator: coordinator }),
    coordinator,
  };
}

describe('deep AI council rollback window', () => {
  it('requires minimum days and five distinct successful executions', () => {
    const early = evaluateDeepAiCouncilRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-14T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const sparse = evaluateDeepAiCouncilRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(4),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    const ready = evaluateDeepAiCouncilRollbackWindow({
      openedAt: '2026-07-01T00:00:00Z',
      evaluatedAt: '2026-07-15T00:00:00Z',
      executions: successfulWindowExecutions(),
      unresolvedEvidenceCount: 0,
      lowTraffic: false,
    });
    expect(early.state).toBe('open');
    expect(sparse.state).toBe('open');
    expect(ready).toMatchObject({
      state: 'eligible_to_close',
      elapsedCalendarDays: 14,
      successfulAuthoritativeExecutions: 5,
      windowClosed: false,
    });
  });

  it('deduplicates repeated execution and certificate identities transitively', () => {
    const repeated = successfulWindowExecutions().map((entry) => ({
      ...entry,
      executionId: 'one-execution',
    }));
    const sharedCertificate = successfulWindowExecutions().map((entry) => ({
      ...entry,
      certificateDigest: digest('one-certificate'),
    }));
    for (const executions of [repeated, sharedCertificate]) {
      expect(evaluateDeepAiCouncilRollbackWindow({
        openedAt: '2026-07-01T00:00:00Z',
        evaluatedAt: '2026-07-15T00:00:00Z',
        executions,
        unresolvedEvidenceCount: 0,
        lowTraffic: false,
      })).toMatchObject({ state: 'open', successfulAuthoritativeExecutions: 1 });
    }
  });
});

describe('deep AI council independent migration gate', () => {
  it('re-derives a passing verdict through real audit, replay, sealed store, and offline certificate verification', async () => {
    const input = await validModeGateInput();
    const result = await new DeepAiCouncilModeMigrationGate().evaluate(input);
    expect(result, JSON.stringify(result)).toMatchObject({ verdict: 'pass' });
    expect(result.certificate).toMatchObject({
      mode: 'deep-ai-council',
      authorityMutation: false,
      rollbackWindowClosed: false,
      cutoverCertificate: false,
      rollbackAnchorDigest: input.rollback!.rollbackAnchorDigest,
    });
    expect(result.certificate?.dispositions.every((entry) => entry.disposition === 'ready')).toBe(true);

    const reported = input.parity!.modeGateInput as Record<string, unknown>;
    const { gateInputDigest: ignoredGateInputDigest, ...reportedBody } = reported;
    void ignoredGateInputDigest;
    const blockedReportBody = {
      ...reportedBody,
      exitStatus: 'blocked',
      blockingReasonCode: 'FIXTURE_FAILURE',
    };
    const blockedReport = {
      ...blockedReportBody,
      gateInputDigest: digest(blockedReportBody),
    };
    const rederived = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      parity: { ...input.parity!, modeGateInput: blockedReport },
    });
    expect(rederived.verdict).toBe('pass');

    const changedAggregate = {
      ...input.rollback!.healthAggregate,
      severity: 'warning' as const,
      observationId: 'replacement-health-observation',
      policyDigest: digest('replacement-health-policy'),
    };
    const healthBound = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      rollback: { ...input.rollback!, healthAggregate: changedAggregate },
    });
    expect(healthBound.verdict).toBe('pass');
    expect(healthBound.certificate?.certificateDigest).not.toBe(result.certificate?.certificateDigest);
  }, 30_000);

  it('denies a green parity handoff when its authorization audit has no real gateway anchor', async () => {
    const input = await validModeGateInput();
    const parity = await parityFixture(false);
    const result = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      parity: {
        manifest: parity.manifest,
        modeGateInput: parity.modeGateInput,
        receipts: [parity.receipt],
        authorizationAuditRootDirectory: parity.rootDirectory,
        authorizationAuditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      },
    });
    expect(parity.receipt.exitStatus).toBe('green');
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'shadow_parity',
      reasonCode: 'AUTHORIZED_PARITY_EVIDENCE_MISSING',
    }));
  }, 30_000);

  it('denies a green parity handoff when deterministic certificate replay does not re-verify', async () => {
    const input = await validModeGateInput();
    const bundle = structuredClone(input.certificates!.verificationInput.bundle) as DeepAiCouncilCertificateBundle;
    bundle.certificate.body.replayFingerprint = digest('tampered-replay');
    const result = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      certificates: {
        verificationInput: {
          ...input.certificates!.verificationInput,
          bundle,
        },
      },
    });
    expect((input.parity!.receipts[0] as DeepAiCouncilParityReceipt).exitStatus).toBe('green');
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'certificates_receipts',
      reasonCode: 'CERTIFICATE_RECEIPT_INVALID',
    }));
  }, 30_000);

  it('rejects unknown top-level fields and a rollback anchor inconsistent with verified drill evidence', async () => {
    const input = await validModeGateInput();
    const unknownField = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      unboundAuthorityHint: 'approve',
    } as DeepAiCouncilModeGateInput<ReplayProjection>);
    const anchorMismatch = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      rollback: { ...input.rollback!, rollbackAnchorDigest: digest('different-anchor') },
    });
    expect(unknownField).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(anchorMismatch).toMatchObject({ verdict: 'rollback_required', certificate: null });
  }, 30_000);

  it('compares the complete Council resume structure rather than selected summary fields', async () => {
    const input = await validModeGateInput();
    const resume = input.resumeEvidence!;
    const result = await new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      resumeEvidence: {
        ...resume,
        ledgerDecision: {
          ...resume.ledgerDecision,
          invalidation: {
            ...resume.ledgerDecision.invalidation,
            invalidatedArtifactIds: ['ledger-only-artifact'],
            testGateReopened: true,
          },
        },
      },
    });
    expect(result).toMatchObject({ verdict: 'blocked', certificate: null });
    expect(result.dispositions).toContainEqual(expect.objectContaining({
      input: 'lifecycle_resume',
      reasonCode: 'RESUME_INVALID',
    }));
  }, 30_000);

  it.each([
    ['null input', null],
    ['non-finite input', {
      ...({} as DeepAiCouncilModeGateInput<ReplayProjection>),
      rollbackWindow: { evaluatedAt: Number.POSITIVE_INFINITY },
    }],
    ['forbidden prototype input', Object.create({ inheritedAuthority: true })],
  ])('never throws for malformed %s', async (_label, malformed) => {
    await expect(new DeepAiCouncilModeMigrationGate().evaluate(
      malformed as DeepAiCouncilModeGateInput<ReplayProjection>,
    )).resolves.toMatchObject({ certificate: null });
  });

  it('never throws when a circular rollback-window value reaches canonicalization', async () => {
    const input = await validModeGateInput();
    const circular = { ...input.rollbackWindow } as Record<string, unknown>;
    circular.self = circular;
    await expect(new DeepAiCouncilModeMigrationGate().evaluate({
      ...input,
      rollbackWindow: circular as unknown as typeof input.rollbackWindow,
    })).resolves.toMatchObject({ verdict: 'rollback_required', certificate: null });
  }, 30_000);
});

describe('deep AI council non-destructive rollback switch', () => {
  it('authorizes only the externally authorized canonical writer and mutates no authority state', async () => {
    const fixture = await rollbackRequestFixture();
    const result = await fixture.rollbackSwitch.requestRollback(fixture.input);
    expect(result).toMatchObject({
      disposition: 'authorized',
      authorityState: 'legacy_authoritative',
      ledgerAuthority: 'denied',
      certificate: expect.objectContaining({
        mode: 'deep-ai-council',
        admissionFrozen: true,
        staleWriterDenied: true,
        eventDeletionCount: 0,
        artifactRewriteCount: 0,
        authorityMutation: false,
        phase014RestorationRequired: true,
      }),
    });
  }, 30_000);

  it('denies a request field changed after authorization and rejects unknown request fields', async () => {
    const fixture = await rollbackRequestFixture();
    const changed = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      rollbackReason: 'Changed after external authorization.',
    });
    const unknown = await fixture.rollbackSwitch.requestRollback({
      ...fixture.input,
      unboundAuthorityHint: true,
    } as DeepAiCouncilRollbackRequest);
    expect(changed).toMatchObject({ disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE' });
    expect(unknown).toMatchObject({ disposition: 'denied', reasonCode: 'EVIDENCE_INCOMPLETE' });
  }, 30_000);

  it('denies a request anchor that differs from the reverified migration certificate', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery', {
      rollbackAnchorDigest: digest('request-only-anchor'),
    });
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'EVIDENCE_INCOMPLETE',
      certificate: null,
    });
  }, 30_000);

  it('requires strict stale-token supersession against the real coordinator high-water mark', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery', {
      staleFenceToken: 10_000,
    });
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  }, 30_000);

  it('rejects structurally invalid stale leases before fencing', async () => {
    const fixture = await rollbackRequestFixture('externally-authorized-recovery', {
      transformLease: (lease) => ({
        ...lease,
        leaseId: '',
        renewedAt: 'not-an-iso-timestamp',
      }),
    });
    await expect(fixture.rollbackSwitch.requestRollback(fixture.input)).resolves.toMatchObject({
      disposition: 'denied',
      reasonCode: 'WRITER_FENCE_FAILED',
      certificate: null,
    });
  }, 30_000);

  it('never throws for circular, non-finite, forbidden-prototype, or wrong-shape requests', async () => {
    const fixture = await rollbackRequestFixture();
    const circularResume = structuredClone(fixture.input.resumeEvidence!) as Record<string, unknown>;
    circularResume.self = circularResume;
    const nonFiniteLease = {
      ...fixture.input.staleWriterLease!,
      fenceToken: Number.POSITIVE_INFINITY,
    };
    const inheritedRequest = Object.assign(
      Object.create({ untrustedPrototype: true }),
      fixture.input,
    ) as DeepAiCouncilRollbackRequest;
    const requests = [
      { ...fixture.input, resumeEvidence: circularResume as never },
      { ...fixture.input, staleWriterLease: nonFiniteLease },
      inheritedRequest,
      null as unknown as DeepAiCouncilRollbackRequest,
    ];
    for (const request of requests) {
      await expect(fixture.rollbackSwitch.requestRollback(request)).resolves.toMatchObject({
        disposition: 'denied',
        certificate: null,
      });
    }
  }, 30_000);
});
