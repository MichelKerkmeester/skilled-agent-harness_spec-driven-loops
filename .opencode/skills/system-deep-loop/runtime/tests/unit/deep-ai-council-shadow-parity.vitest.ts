// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Ledger Schema Tests
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';
import { FencedLedgerWriter } from '../../lib/locks-and-fencing/index.js';

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepAiCouncilEventStems,
  DeepAiCouncilWireEventTypes,
  createDeepAiCouncilEventRegistry,
  decideDeepAiCouncilCompatibility,
  prepareDeepAiCouncilEvent,
  upcastLegacyDeepAiCouncilRecord,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import {
  canonicalBytes,
  EventTypeRegistry,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST,
  canonicalizeDeepAiCouncilEventStream,
  compareDeepAiCouncilEventStreams,
  createDeepAiCouncilModeGateInput,
  createDeepAiCouncilParityCaseDefinition,
  createDeepAiCouncilParityExecutors,
  deepAiCouncilParityInitialStateDigest,
  parseDeepAiCouncilParityReceipt,
  runDeepAiCouncilParityCase,
  verifyDeepAiCouncilLifecycleEventMap,
} from '../../lib/deep-ai-council-shadow-parity/index.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
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

import type {
  AuthoritySnapshot,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAiCouncilEventInput,
  DeepAiCouncilLedgerEvent,
  DeepAiCouncilEventStem,
  DeepAiCouncilPayloadMap,
  DeepAiCouncilReplayMetadata,
  DeepAiCouncilScopeMap,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilParityCaseRun,
  DeepAiCouncilParityFaultKind,
  DeepAiCouncilParityFixture,
  DeepAiCouncilParityReceipt,
} from '../../lib/deep-ai-council-shadow-parity/index.js';
import type {
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ParityCaseCapsule,
  ParityCaseManifest,
} from '../../lib/shadow-parity/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const PARITY_BASE_SHA = '0360360360360360360360360360360360360360';
const OTHER_BASE_SHA = '1371371371371371371371371371371371371371';
const LEDGER_ID = 'deep-ai-council-shadow';
const AUDIT_LEDGER_ID = 'deep-ai-council-shadow-authorization';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const temporaryRoots: string[] = [];
const PARITY_FAULT_CASES = Object.freeze([
  { kind: 'drop-event', eventIndex: 12, expectedClass: 'missing' },
  { kind: 'reorder-event', eventIndex: 4, expectedClass: 'reordered' },
  { kind: 'extra-event', eventIndex: 4, expectedClass: 'extra' },
  { kind: 'duplicate-event', eventIndex: 4, expectedClass: 'duplicated' },
  { kind: 'causal-link', eventIndex: 4, expectedClass: 'causal-link' },
  { kind: 'payload', eventIndex: 4, expectedClass: 'payload' },
  { kind: 'receipt', eventIndex: 8, expectedClass: 'receipt' },
  { kind: 'artifact', eventIndex: 4, expectedClass: 'artifact' },
  { kind: 'terminal-decision', eventIndex: 12, expectedClass: 'terminal-decision' },
  { kind: 'projection', eventIndex: 4, expectedClass: 'projection' },
] as const);

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

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

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'deep-ai-council-ledger-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createDeepAiCouncilEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-ai-council-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-council-event', 'shadow-capability'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-ai-council.ledger.')
        && input.capabilityId === 'deep-ai-council:append'
        ? 'allow'
        : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-ai-council.ledger.')
        && input.capabilityId === 'deep-ai-council:append'
        ? 'allowed'
        : 'policy_denied',
      matchedRuleIds: ['known-council-event', 'shadow-capability'],
    }),
  }]);
  const authorityProvider = (): typeof AUTHORITY => AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { registry, policies, ledger, gateway };
}

function evaluateParityArtifactPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

function createParityArtifactHarness(): ParityArtifactHarness {
  const rootDirectory = temporaryRoot();
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
    ledgerId: 'deep-ai-council-parity-artifacts',
    auditLedgerId: 'deep-ai-council-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'deep-ai-council-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
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
      streamId: 'deep-ai-council-parity-artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-ai-council-parity-tests', version: '1' },
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
      mode: 'deep-ai-council',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'deep-ai-council-parity-test',
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
    { mode: 'deep-ai-council', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealParityArtifact(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-ai-council', authority: 'legacy' },
    'configuration',
  );
  return {
    harness,
    referenceSet: bindVerifiedArtifactReferences([fixture, configuration]),
  };
}

function replayMetadata(label: string): DeepAiCouncilReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function informationSurface(
  role: 'detector' | 'generator' | 'orchestrator' | 'scorer' | 'test-gate',
): JsonObject {
  return {
    role,
    capabilityRefs: [`capability-${role}`],
    visibleDigests: [digest(`visible:${role}`)],
    generatorIdentityVisible: role === 'generator' || role === 'orchestrator',
    rationaleVisible: role === 'generator' || role === 'orchestrator',
    peerScoresVisible: role === 'orchestrator',
    voteCountsVisible: role === 'orchestrator',
    independentJudgmentsCommitted: role === 'orchestrator',
  };
}

function rawScores(): JsonObject {
  return { quality: 0.8, feasibility: 0.7, novelty: 0.6, risk: 0.2 };
}

function independence(): JsonObject {
  return {
    snapshotRef: 'independence-1',
    inputDigest: digest('independence-input'),
    calibrationRef: 'calibration-1',
    effectiveSeatCount: 2.4,
    dependenceMeasure: 0.2,
    marginalGain: 0.7,
  };
}

function scopeFor<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
): DeepAiCouncilScopeMap[TStem] {
  const base = { runId: 'run-1', roundId: 'round-1' };
  if (stem === 'ai_council.run_resumed' || stem === 'ai_council.run_restarted') {
    return { ...base, generation: 2 } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.proposal_observed' || stem === 'ai_council.seat_returned') {
    return {
      ...base,
      seatId: 'seat-1',
      proposalId: 'proposal-1',
    } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.seat_selected' || stem === 'ai_council.seat_dispatched') {
    return { ...base, seatId: 'seat-1' } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.critique_round_started'
    || stem === 'ai_council.critique_recorded') {
    return {
      ...base,
      seatId: 'seat-2',
      critiqueRoundId: 'critique-round-1',
    } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.candidate_blinded') {
    return { ...base, candidateId: 'candidate-1' } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.pairwise_judgment_recorded'
    || stem === 'ai_council.bias_audit_recorded') {
    return { ...base, judgmentId: 'judgment-1' } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.stance_recorded' || stem === 'ai_council.stance_flipped') {
    return {
      ...base,
      candidateId: 'candidate-1',
      seatId: 'seat-1',
    } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.artifact_committed'
    || stem === 'ai_council.artifact_superseded') {
    return { ...base, artifactId: 'artifact-2' } as DeepAiCouncilScopeMap[TStem];
  }
  if (stem === 'ai_council.council_test_gate_evaluated') {
    return { ...base, gateId: 'gate-1' } as DeepAiCouncilScopeMap[TStem];
  }
  return base as DeepAiCouncilScopeMap[TStem];
}

function proposalData(hash: string): JsonObject {
  return {
    targetVersion: 'target@1',
    responseStatus: 'returned',
    proposalDigest: hash,
    artifactRef: 'artifact-proposal-1',
    artifactDigest: hash,
    rawScores: rawScores(),
    rawConfidence: 0.8,
    usage: {
      receiptRef: 'usage-1',
      inputTokens: 100,
      outputTokens: 200,
      costMicros: 300,
    },
    evidenceRefs: ['evidence-1'],
    outputSchemaVersion: 'proposal@1',
    observationDigest: hash,
    informationSurface: informationSurface('generator'),
  };
}

function convergenceData(
  hash: string,
  decision: 'blocked' | 'continue' | 'converged',
): JsonObject {
  return {
    decision,
    rawAgreement: 0.8,
    rawStability: 0.7,
    calibratedSupport: 0.6,
    effectiveSeatCount: 2.4,
    independence: independence(),
    judgeProfileRefs: ['judge-profile-1'],
    qualityWitnessRefs: ['quality-witness-1'],
    invarianceWitnessRefs: ['invariance-witness-1'],
    minorityRefs: ['minority-1'],
    contradictionRefs: ['contradiction-1'],
    vetoFindingRefs: decision === 'blocked' ? ['veto-1'] : [],
    requiredGateResultRefs: ['gate-result-1'],
    budgetStateRef: 'budget-state-1',
    coverageStateRef: 'coverage-state-1',
    blockerIds: decision === 'blocked' ? ['low-independence'] : [],
    recoveryOrEscalationReason: decision === 'blocked' ? 'debate-escalation' : null,
  };
}

function artifactData(hash: string): JsonObject {
  return {
    artifactKind: 'council-report',
    safeRelativePath: 'ai-council/report.md',
    schemaVersion: 'artifact@1',
    byteDigest: hash,
    contentDigest: hash,
    requiredSectionResults: [{
      sectionId: 'recommendation',
      status: 'pass',
      evidenceDigest: hash,
    }],
    sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
    supersedesArtifactId: null,
    rollbackRef: null,
  };
}

function dataFor<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
): DeepAiCouncilPayloadMap[TStem] {
  const hash = stem === 'ai_council.proposal_observed'
    || stem === 'ai_council.seat_returned'
    ? digest('proposal-1')
    : digest(stem);
  const data: Readonly<Record<DeepAiCouncilEventStem, JsonObject>> = {
    'ai_council.run_initialized': {
      target: {
        targetId: 'target-1',
        targetType: 'repository',
        artifactRef: 'target-artifact-1',
        targetVersion: 'target@1',
        contentDigest: hash,
      },
      targetDigest: hash,
      taskClass: 'architecture',
      configDigest: hash,
      strategyDigest: hash,
      convergencePolicyDigest: hash,
      testGatePolicyDigest: hash,
      maxRounds: 4,
      minSeatCount: 2,
      maxSeatCount: 5,
      planningOnly: true,
      initialReplayFingerprint: hash,
    },
    'ai_council.run_resumed': {
      priorTailDigest: hash,
      sourceRunId: 'run-0',
      resumeReason: 'continue-after-pause',
      generation: 2,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-1',
      continuationScopeRef: 'scope-1',
    },
    'ai_council.run_restarted': {
      priorTailDigest: hash,
      archivedLineageRef: 'lineage-0',
      restartReason: 'restart-after-incompatible-state',
      generation: 2,
      compatibilityDecision: 'migrate',
      recoveryReceiptRef: 'recovery-2',
      continuationScopeRef: 'scope-2',
    },
    'ai_council.round_started': {
      roundNumber: 1,
      executorBoundaryRef: 'executor-boundary-1',
      seatRosterDigest: hash,
      protocolVersion: 'protocol@1',
      promptPackDigest: hash,
      budgetRef: 'budget-1',
      priorRoundRef: null,
      exposurePolicyVersion: 'exposure@1',
      informationSurface: informationSurface('orchestrator'),
    },
    'ai_council.seat_selected': {
      strategyLens: 'security',
      mandateDigest: hash,
      vantageFingerprint: hash,
      modelFingerprint: hash,
      independenceGroup: 'independence-group-1',
      capabilityDigest: hash,
      promptDigest: hash,
      selectionUtility: 0.8,
      selectionPolicyVersion: 'seat-selection@1',
    },
    'ai_council.seat_dispatched': {
      dispatchReceiptRef: 'dispatch-1',
      logicalBranchRef: 'branch-1',
      attempt: 1,
      budgetLeaseRef: 'lease-1',
      capabilityDigest: hash,
      promptDigest: hash,
      informationSurface: informationSurface('generator'),
    },
    'ai_council.proposal_observed': proposalData(hash),
    'ai_council.seat_returned': {
      ...proposalData(hash),
      failureReason: null,
      timeoutReason: null,
    },
    'ai_council.critique_round_started': {
      sourceProposalIds: ['proposal-1', 'proposal-2'],
      visibleInformationPolicyVersion: 'critique-exposure@1',
      inputDigest: hash,
      informationSurface: informationSurface('detector'),
    },
    'ai_council.critique_recorded': {
      sourceProposalIds: ['proposal-1'],
      critiqueArtifactRef: 'critique-artifact-1',
      critiqueArtifactDigest: hash,
      referencedClaimRefs: ['claim-1'],
      rawSeverity: 0.7,
      rawConfidence: 0.8,
      challengeDisposition: 'contested',
      causalProposalRefs: ['proposal-1'],
      informationSurface: informationSurface('detector'),
    },
    'ai_council.candidate_blinded': {
      sourceProposalIds: ['proposal-1'],
      candidateAliasDigest: hash,
      shuffleSeedDigest: hash,
      visibleCandidateDigest: hash,
      artifactRef: 'candidate-artifact-1',
      artifactDigest: hash,
      targetVersion: 'target@1',
      redactionPolicyVersion: 'redaction@1',
      informationSurface: informationSurface('scorer'),
    },
    'ai_council.pairwise_judgment_recorded': {
      candidateAId: 'candidate-1',
      candidateBId: 'candidate-2',
      orderToken: 'a-first',
      judgeProfileFingerprint: hash,
      rawPreference: { candidateA: 0.7, candidateB: 0.2, abstain: 0.1 },
      rawConfidence: 0.8,
      judgmentStatus: 'consistent',
      inputDigest: hash,
      calibrationRef: 'calibration-1',
      informationSurface: informationSurface('scorer'),
      supersedesJudgmentId: null,
    },
    'ai_council.bias_audit_recorded': {
      candidateAId: 'candidate-1',
      candidateBId: 'candidate-2',
      pairedJudgmentIds: ['judgment-1', 'judgment-2'],
      biasFeatureCodes: ['order-effect'],
      detectorResult: 'passed',
      inconsistencyStatus: 'consistent',
      rawBiasScore: 0.1,
      inputDigest: hash,
      detectorFingerprint: hash,
    },
    'ai_council.adjudication_decision': {
      candidateSetDigest: hash,
      protocolVersion: 'adjudication@1',
      rubricVersion: 'rubric@1',
      rawScores: rawScores(),
      calibratedScores: rawScores(),
      supportMass: 0.7,
      oppositionMass: 0.3,
      independence: independence(),
      minorityRefs: ['minority-1'],
      contradictionRefs: ['contradiction-1'],
      vetoFindingRefs: [],
      disposition: 'selected',
      selectedCandidateId: 'candidate-1',
      evaluatorReceiptRef: 'evaluator-1',
      sourceJudgmentIds: ['judgment-1', 'judgment-2'],
    },
    'ai_council.stance_recorded': {
      candidateOrPlanRef: 'candidate-1',
      priorStanceEventId: null,
      currentStance: 'uncertain',
      rawRationaleDigest: hash,
      evidenceRef: 'evidence-1',
      influenceObservationDigest: hash,
    },
    'ai_council.stance_flipped': {
      candidateOrPlanRef: 'candidate-1',
      priorStanceEventId: 'event-15',
      priorStance: 'uncertain',
      currentStance: 'support',
      flipDirection: 'toward-support',
      rawRationaleDigest: hash,
      evidenceRef: 'evidence-2',
      influenceObservationDigest: hash,
    },
    'ai_council.deliberation_synthesized': {
      inputEventRange: { firstEventId: 'event-1', lastEventId: 'event-16' },
      candidateSetDigest: hash,
      planDisposition: 'selected',
      selectedPlanDigest: hash,
      disagreementRefs: ['disagreement-1'],
      minorityRefs: ['minority-1'],
      synthesisPolicyFingerprint: hash,
      evaluatorFingerprint: hash,
      reportDraftRef: 'report-draft-1',
      synthesisReceiptRef: 'synthesis-1',
    },
    'ai_council.convergence_evaluated': convergenceData(hash, 'continue'),
    'ai_council.convergence_blocked': convergenceData(hash, 'blocked'),
    'ai_council.round_ended': {
      roundStatus: 'complete',
      convergenceEventId: 'event-18',
      acceptedCandidateRefs: ['candidate-1'],
      rejectedCandidateRefs: ['candidate-2'],
      unresolvedCandidateRefs: [],
      seatOutcomeCounts: {
        selected: 3,
        dispatched: 3,
        returned: 3,
        failed: 0,
        timedOut: 0,
      },
      lateResultDisposition: 'none',
      finalRoundTailDigest: hash,
      continuationDecision: 'continue',
    },
    'ai_council.artifact_committed': artifactData(hash),
    'ai_council.artifact_superseded': {
      artifactKind: 'council-report',
      safeRelativePath: 'ai-council/report.md',
      schemaVersion: 'artifact@1',
      byteDigest: hash,
      contentDigest: hash,
      requiredSectionResults: [{
        sectionId: 'recommendation',
        status: 'pass',
        evidenceDigest: hash,
      }],
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
      priorArtifactId: 'artifact-1',
      successorArtifactId: 'artifact-2',
      supersessionReason: 'new-council-round',
      rollbackRef: null,
    },
    'ai_council.council_test_gate_evaluated': {
      testSuiteDigest: hash,
      fixtureManifestDigest: hash,
      baselineFingerprint: hash,
      candidateFingerprint: hash,
      requiredCheckResults: [{
        checkId: 'required-sections',
        status: 'pass',
        resultDigest: hash,
      }],
      criticalFailureRefs: [],
      metamorphicCheckDigest: hash,
      biasCheckDigest: hash,
      artifactCompleteness: 'complete',
      verdict: 'pass',
      gateReceiptRef: 'gate-receipt-1',
      informationSurface: informationSurface('test-gate'),
    },
    'ai_council.rollback_recorded': {
      rollbackReason: 'test-gate-failed',
      supersededEventRefs: ['event-21'],
      supersededArtifactRefs: ['artifact-1'],
      failedGateRef: 'gate-1',
      recoveryReceiptRef: 'recovery-3',
      restoredLegacyPathRef: 'legacy-path-1',
      authorizationRef: 'authorization-1',
    },
    'ai_council.council_complete': {
      terminalStatus: 'completed',
      convergenceEventId: 'event-18',
      finalDeliberationEventId: 'event-17',
      artifactManifestRef: 'artifact-manifest-1',
      councilTestGateEventId: 'event-23',
      finalLedgerTailDigest: hash,
      counts: { rounds: 1, seats: 3, proposals: 3, judgments: 2 },
      recommendationOrUserDecisionRef: 'recommendation-1',
      terminalReason: 'converged-and-gate-passed',
    },
  };
  return data[stem] as DeepAiCouncilPayloadMap[TStem];
}

function eventInput<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
  index: number,
  prevEventHash = '0'.repeat(64),
): DeepAiCouncilEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'deep-ai-council-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-ai-council-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `deep-ai-council-event-${index}`,
  };
}

function withData<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
  data: JsonObject,
): DeepAiCouncilEventInput<TStem> {
  return { ...eventInput(stem, 1), data: data as DeepAiCouncilPayloadMap[TStem] };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'deep-ai-council:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('deep-ai-council-shadow-write', 1);
  return {
    requestId,
    mode: 'ai-council',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'deep-ai-council-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'deep-ai-council-runtime',
    capabilityId,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest('authorization-evidence'),
  };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(
    await authorizationRequest(harness, event, requestId),
  );
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION, APPEND, AND REPLAY
// ───────────────────────────────────────────────────────────────────

describe('deep-ai-council typed ledger schema', () => {
  it('authorizes and appends every event stem through the real ledger', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of DeepAiCouncilEventStems.entries()) {
      const index = offset + 1;
      const event = prepareDeepAiCouncilEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await appendAuthorizedForTest(harness.ledger, event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(proof.decision.decision_id);
      priorHash = receipt.recordHash;
    }
    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(DeepAiCouncilEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type)).toEqual(
      DeepAiCouncilEventStems.map((stem) => DeepAiCouncilWireEventTypes[stem]),
    );
    expect(verified.every((entry) => entry.frame.authorization_ref.decision_id !== '')).toBe(true);
  });

  it('produces stable identity, payload digest, and replay metadata', () => {
    const registry = createDeepAiCouncilEventRegistry();
    const input = eventInput('ai_council.run_initialized', 1);
    const first = prepareDeepAiCouncilEvent(input, registry);
    const second = prepareDeepAiCouncilEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(first.envelope.payload.payloadDigest);
    expect(second.envelope.payload.replay).toEqual(first.envelope.payload.replay);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. FAIL-CLOSED SHAPES AND APPEND-ONLY RULES
  // ─────────────────────────────────────────────────────────────────

  it('rejects missing scope identities and absent previous-event hashes', () => {
    const registry = createDeepAiCouncilEventRegistry();
    const missingSeat = eventInput('ai_council.seat_selected', 1);
    expect(() => prepareDeepAiCouncilEvent({
      ...missingSeat,
      scope: { runId: 'run-1', roundId: 'round-1' },
    } as typeof missingSeat, registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent({
      ...eventInput('ai_council.run_initialized', 1),
      prevEventHash: '',
    }, registry)).toThrow();
  });

  it('rejects mutable proposal, evidence, and artifact bodies', () => {
    const registry = createDeepAiCouncilEventRegistry();
    const proposal = dataFor('ai_council.proposal_observed') as JsonObject;
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.proposal_observed', {
      ...proposal,
      proposalBody: 'mutable proposal text',
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.proposal_observed', {
      ...dataFor('ai_council.proposal_observed'),
      evidenceRefs: ['evidence-1'],
    }), registry)).not.toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.proposal_observed', {
      ...dataFor('ai_council.proposal_observed'),
      evidenceRefs: ['This is a mutable evidence passage with spaces'],
    }), registry)).toThrowError('Payload validator rejected the event');
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.artifact_committed', {
      ...dataFor('ai_council.artifact_committed'),
      reportBody: 'mutable report text',
    }), registry)).toThrow();
  });

  it('rejects in-place judgment, stance, and artifact revisions', () => {
    const registry = createDeepAiCouncilEventRegistry();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.pairwise_judgment_recorded', {
      ...dataFor('ai_council.pairwise_judgment_recorded'),
      supersedesJudgmentId: 'judgment-0',
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.stance_flipped', {
      ...dataFor('ai_council.stance_flipped'),
      priorStance: 'support',
      currentStance: 'support',
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.artifact_superseded', {
      ...dataFor('ai_council.artifact_superseded'),
      priorArtifactId: 'artifact-2',
      successorArtifactId: 'artifact-2',
    }), registry)).toThrow();
  });

  it('denies unauthorized transitions before append', async () => {
    const harness = createHarness();
    const event = prepareDeepAiCouncilEvent(
      eventInput('ai_council.run_initialized', 1),
      harness.registry,
    );
    const before = await harness.ledger.getVerifiedHead();
    const result = await harness.gateway.authorize(
      await authorizationRequest(harness, event, 'denied-request', 'wrong:capability'),
    );
    expect(result.verdict).toBe('deny');
    expect(await harness.ledger.getVerifiedHead()).toEqual(before);
    expect(await harness.ledger.readVerifiedEvents()).toHaveLength(0);
  });

  it('keeps proposals non-verdict-bearing until typed adjudication', () => {
    const registry = createDeepAiCouncilEventRegistry();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.proposal_observed', {
      ...dataFor('ai_council.proposal_observed'),
      disposition: 'selected',
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.adjudication_decision', {
      ...dataFor('ai_council.adjudication_decision'),
      sourceJudgmentIds: [],
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(
      eventInput('ai_council.adjudication_decision', 1),
      registry,
    )).not.toThrow();
  });

  it('enforces blinded scorer information surfaces before judgments commit', () => {
    const registry = createDeepAiCouncilEventRegistry();
    const candidate = dataFor('ai_council.candidate_blinded') as JsonObject;
    const surface = candidate.informationSurface as JsonObject;
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.candidate_blinded', {
      ...candidate,
      informationSurface: { ...surface, generatorIdentityVisible: true },
    }), registry)).toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.pairwise_judgment_recorded', {
      ...dataFor('ai_council.pairwise_judgment_recorded'),
      informationSurface: { ...surface, peerScoresVisible: true },
    }), registry)).toThrow();
  });

  it('retains inconsistent and abstaining pairwise observations without selecting a plan', () => {
    const registry = createDeepAiCouncilEventRegistry();
    for (const status of ['abstained', 'inconsistent'] as const) {
      expect(() => prepareDeepAiCouncilEvent(withData(
        'ai_council.pairwise_judgment_recorded',
        {
          ...dataFor('ai_council.pairwise_judgment_recorded'),
          judgmentStatus: status,
          rawPreference: { candidateA: 0.2, candidateB: 0.2, abstain: 0.6 },
        },
      ), registry)).not.toThrow();
    }
    expect(() => prepareDeepAiCouncilEvent(withData(
      'ai_council.pairwise_judgment_recorded',
      {
        ...dataFor('ai_council.pairwise_judgment_recorded'),
        selectedCandidateId: 'candidate-1',
      },
    ), registry)).toThrowError('Payload validator rejected the event');
  });

  it('keeps raw observations distinct from adjudication and convergence decisions', () => {
    const registry = createDeepAiCouncilEventRegistry();
    expect(() => prepareDeepAiCouncilEvent(
      eventInput('ai_council.convergence_evaluated', 1),
      registry,
    )).not.toThrow();
    expect(() => prepareDeepAiCouncilEvent(withData('ai_council.convergence_evaluated', {
      ...dataFor('ai_council.convergence_evaluated'),
      disposition: 'selected',
    }), registry)).toThrowError('Payload validator rejected the event');
  });

  it('rejects unsafe artifact paths and mutable path-shaped prose', () => {
    const registry = createDeepAiCouncilEventRegistry();
    for (const path of ['/absolute/report.md', '../secret.md', 'report path with prose.md']) {
      expect(() => prepareDeepAiCouncilEvent(withData('ai_council.artifact_committed', {
        ...dataFor('ai_council.artifact_committed'),
        safeRelativePath: path,
      }), registry)).toThrow();
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. COMPATIBILITY AND LEGACY UPCASTING
  // ─────────────────────────────────────────────────────────────────

  it('covers every compatibility outcome and blocks unknown inputs', () => {
    expect(decideDeepAiCouncilCompatibility({
      format: 'deep-ai-council-ledger',
      stem: 'ai_council.round_started',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideDeepAiCouncilCompatibility({
      type: 'audit',
      event: 'artifact_verified',
      schemaVersion: 1,
    }).status).toBe('compatible');
    expect(decideDeepAiCouncilCompatibility({
      event: 'round_start',
      runId: 'run-1',
      roundId: 'round-1',
      schemaVersion: 1,
    }).status).toBe('migrate');
    expect(decideDeepAiCouncilCompatibility({
      event: 'seat_returned',
      runId: 'run-1',
      roundId: 'round-1',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideDeepAiCouncilCompatibility({
      event: 'unknown_event',
      runId: 'run-1',
      roundId: 'round-1',
      schemaVersion: 1,
    }).status).toBe('blocked');
    expect(decideDeepAiCouncilCompatibility({
      event: 'round_start',
      runId: 'run-1',
      roundId: 'round-1',
      schemaVersion: 99,
    }).status).toBe('blocked');
    expect(decideDeepAiCouncilCompatibility({
      format: 'deep-ai-council-ledger',
      stem: 'ai_council.round_started',
      eventVersion: 1,
      payloadVersion: 2,
    }).status).toBe('blocked');
  });

  it('upcasts registered legacy rows with source and upcaster digests retained', async () => {
    const legacy = {
      event: 'round_start',
      runId: 'run-1',
      roundId: 'round-1',
      roundNumber: 1,
      schemaVersion: 1,
    };
    const context = {
      scope: { runId: 'run-1', roundId: 'round-1' },
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-round'),
    };
    const first = upcastLegacyDeepAiCouncilRecord(legacy, context);
    const second = upcastLegacyDeepAiCouncilRecord(legacy, context);
    expect(first.status).toBe('migrated');
    expect(second).toEqual(first);
    if (first.status !== 'migrated') throw new Error('legacy upcast refused');
    expect(first.originalRecordDigest).toBe(digest(legacy));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);

    const harness = createHarness();
    const event = prepareDeepAiCouncilEvent({
      ...eventInput('ai_council.round_started', 1),
      scope: first.scope,
      prevEventHash: first.prevEventHash,
      replay: first.replay,
      data: first.data,
    } as DeepAiCouncilEventInput<'ai_council.round_started'>, harness.registry);
    const proof = await authorize(harness, event, 'legacy-request');
    await expect(appendAuthorizedForTest(harness.ledger, event, proof)).resolves.toMatchObject({
      event_id: 'event-1',
    });
  });

  it('rejects unregistered envelope and payload versions without guessing', () => {
    const registry = createDeepAiCouncilEventRegistry();
    const prepared = prepareDeepAiCouncilEvent(
      eventInput('ai_council.run_initialized', 1),
      registry,
    );
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      event_version: 2,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      payload: { ...prepared.envelope.payload, eventVersion: 2 },
    }, registry)).toThrow();
  });
});

// ───────────────────────────────────────────────────────────────────
// 8. SHADOW-PARITY SOUNDNESS
// ───────────────────────────────────────────────────────────────────

function parityEvent<TStem extends DeepAiCouncilEventStem>(
  stem: TStem,
  index: number,
  path: 'dark' | 'legacy',
  volatilityOffset = 0,
  prevEventHash = '0'.repeat(64),
  overrides: Readonly<{
    scope?: DeepAiCouncilScopeMap[TStem];
    data?: DeepAiCouncilPayloadMap[TStem];
  }> = {},
) {
  const registry = createDeepAiCouncilEventRegistry();
  const input = eventInput(stem, index, prevEventHash);
  return prepareDeepAiCouncilEvent({
    ...input,
    scope: overrides.scope ?? input.scope,
    data: overrides.data ?? input.data,
    eventId: `${path}-event-${index}`,
    streamId: `${path}-stream`,
    occurredAt: `2026-07-23T10:00:0${volatilityOffset}.000Z`,
    recordedAt: `2026-07-23T10:00:0${volatilityOffset}.500Z`,
    correlationId: `transport-${path === 'dark' ? 'a' : 'b'}000000000000000`,
    causationId: index === 1 ? null : `${path}-event-${index - 1}`,
    idempotencyKey: `${path}-parity-${index}`,
  }, registry).envelope;
}

function parityObservations(path: 'dark' | 'legacy', volatilityOffset = 0) {
  const events = [
    parityEvent('ai_council.run_initialized', 1, path, volatilityOffset),
    parityEvent('ai_council.round_started', 2, path, volatilityOffset),
    parityEvent('ai_council.council_complete', 3, path, volatilityOffset),
  ];
  return canonicalizeDeepAiCouncilEventStream(
    events,
    events.map((_, index) => digest(`projection-${index}`)),
  );
}

function changed<T extends object>(value: T, patch: Partial<T>): T {
  return Object.freeze({ ...value, ...patch });
}

function parityFixture(): DeepAiCouncilParityFixture {
  const events: DeepAiCouncilLedgerEvent[] = [];
  let tailDigest = '0'.repeat(64);
  const push = <TStem extends DeepAiCouncilEventStem>(
    stem: TStem,
    scope = scopeFor(stem),
    data = dataFor(stem),
  ) => {
    const event = parityEvent(stem, events.length + 1, 'dark', 0, tailDigest, {
      scope,
      data,
    });
    events.push(event as DeepAiCouncilLedgerEvent);
    tailDigest = digest(event as DeepAiCouncilLedgerEvent);
    return event;
  };

  push('ai_council.run_initialized', scopeFor('ai_council.run_initialized'), {
    ...dataFor('ai_council.run_initialized'),
    minSeatCount: 1,
  });
  push('ai_council.round_started');
  for (const seatNumber of [1]) {
    const seatId = `seat-${seatNumber}`;
    const proposalId = `proposal-${seatNumber}`;
    push('ai_council.seat_selected', { runId: 'run-1', roundId: 'round-1', seatId }, {
      ...dataFor('ai_council.seat_selected'),
      strategyLens: seatNumber === 1 ? 'security' : 'maintainability',
      mandateDigest: digest(`mandate:${seatId}`),
      vantageFingerprint: digest(`vantage:${seatId}`),
      modelFingerprint: digest(`model:${seatId}`),
      independenceGroup: `independence-${seatNumber}`,
      capabilityDigest: digest(`capability:${seatId}`),
      promptDigest: digest(`prompt:${seatId}`),
    });
    push(
      'ai_council.proposal_observed',
      { runId: 'run-1', roundId: 'round-1', seatId, proposalId },
      proposalData(digest(`proposal-${seatNumber}`)) as DeepAiCouncilPayloadMap[
        'ai_council.proposal_observed'
      ],
    );
  }
  for (const candidateNumber of [1, 2]) {
    const candidateId = `candidate-${candidateNumber}`;
    push('ai_council.candidate_blinded', {
      runId: 'run-1',
      roundId: 'round-1',
      candidateId,
    }, {
      ...dataFor('ai_council.candidate_blinded'),
      sourceProposalIds: ['proposal-1'],
      candidateAliasDigest: digest(`alias:${candidateNumber}`),
      shuffleSeedDigest: digest(`shuffle:${candidateNumber}`),
      visibleCandidateDigest: digest(`visible:${candidateNumber}`),
      artifactRef: `candidate-artifact-${candidateNumber}`,
      artifactDigest: digest(`candidate-artifact:${candidateNumber}`),
    });
  }
  for (const judgmentNumber of [1]) {
    const judgmentId = `judgment-${judgmentNumber}`;
    push('ai_council.pairwise_judgment_recorded', {
      runId: 'run-1',
      roundId: 'round-1',
      judgmentId,
    }, {
      ...dataFor('ai_council.pairwise_judgment_recorded'),
      orderToken: judgmentNumber === 1 ? 'a-first' : 'b-first',
      judgeProfileFingerprint: digest(`judge:${judgmentNumber}`),
      inputDigest: digest(`judgment-input:${judgmentNumber}`),
      calibrationRef: `calibration-${judgmentNumber}`,
    });
  }
  const adjudication = push(
    'ai_council.adjudication_decision',
    scopeFor('ai_council.adjudication_decision'),
    {
      ...dataFor('ai_council.adjudication_decision'),
      sourceJudgmentIds: ['judgment-1'],
    },
  );
  const deliberation = push('ai_council.deliberation_synthesized', scopeFor(
    'ai_council.deliberation_synthesized',
  ), {
    ...dataFor('ai_council.deliberation_synthesized'),
    inputEventRange: {
      firstEventId: events[0].event_id,
      lastEventId: adjudication.event_id,
    },
  });
  const convergence = push('ai_council.convergence_evaluated', scopeFor(
    'ai_council.convergence_evaluated',
  ), convergenceData(
    digest('ai_council.convergence_evaluated'),
    'converged',
  ) as DeepAiCouncilPayloadMap['ai_council.convergence_evaluated']);
  push('ai_council.artifact_committed', {
    runId: 'run-1',
    roundId: 'round-1',
    artifactId: 'artifact-manifest-1',
  }, {
    ...dataFor('ai_council.artifact_committed'),
    artifactKind: 'council-manifest',
    safeRelativePath: 'ai-council/manifest.json',
    sourceEventRange: {
      firstEventId: events[0].event_id,
      lastEventId: convergence.event_id,
    },
  });
  const gate = push('ai_council.council_test_gate_evaluated');
  const finalLedgerTailDigest = tailDigest;
  push('ai_council.council_complete', scopeFor('ai_council.council_complete'), {
    ...dataFor('ai_council.council_complete'),
    convergenceEventId: convergence.event_id,
    finalDeliberationEventId: deliberation.event_id,
    artifactManifestRef: 'artifact-manifest-1',
    councilTestGateEventId: gate.event_id,
    finalLedgerTailDigest,
    counts: { rounds: 1, seats: 1, proposals: 1, judgments: 1 },
  });
  const provisional: DeepAiCouncilParityFixture = {
    fixtureId: 'fixture-normal-completion',
    scenario: 'normal-completion',
    frozenInput: {
      baseSha: PARITY_BASE_SHA,
      runManifestDigest: digest('run-manifest'),
      sourceSnapshotDigest: digest('source-snapshot'),
      promptFingerprint: digest('prompt'),
      modelFingerprint: digest('model'),
      toolFingerprint: digest('tools'),
      initialStateDigest: digest('pending-initial-state'),
      configurationDigest: digest({ mode: 'deep-ai-council', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1',
        runId: 'run-1',
        roundId: 'round-1',
        generation: 1,
        remainingMs: 30_000,
        replayFingerprint: digest('council-parity-replay'),
        deadlineAt: TIMESTAMP,
      },
    },
    events,
    expectedTerminalDecision: 'completed',
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepAiCouncilParityInitialStateDigest(provisional),
    }),
  });
}

function parityCapsule(
  fixture: DeepAiCouncilParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: fixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: fixture.frozenInput.baseSha }),
    initialStateDigest: fixture.frozenInput.initialStateDigest,
    configurationDigest: fixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-ai-council-event@1',
      comparator: 'deep-ai-council-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-ai-council-bounded-shadow',
  };
}

async function parityCaseRun(
  fixture: DeepAiCouncilParityFixture,
  sealed: ParitySealedBoundary,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepAiCouncilParityFaultKind;
    eventIndex: number;
  }>,
): Promise<DeepAiCouncilParityCaseRun> {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: parityCapsule(fixture, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepAiCouncilParityCaseDefinition(fixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture,
    executors: createDeepAiCouncilParityExecutors(fixture, fault),
    shadowRootDirectory: join(temporaryRoot(), 'shadow'),
    protectedRoots: [join(temporaryRoot(), 'legacy-live')],
    deterministicRuns: 2,
  };
}

function targetedParityManifest(
  fixture: DeepAiCouncilParityFixture,
  baseSha = PARITY_BASE_SHA,
): ParityCaseManifest {
  const definition = createDeepAiCouncilParityCaseDefinition(fixture);
  return compileParityCaseManifest({
    baseSha,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

function bindParityReceiptDigest(
  body: Omit<DeepAiCouncilParityReceipt, 'receiptDigest'>,
): DeepAiCouncilParityReceipt {
  return Object.freeze({ ...body, receiptDigest: digest(body) });
}

describe('deep-ai-council shadow parity', () => {
  it('closes the lifecycle map over every real council event and freezes volatility', () => {
    expect(() => verifyDeepAiCouncilLifecycleEventMap()).not.toThrow();
    expect(DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at',
      'recorded_at',
      'correlation_id',
    ]);
  });

  it('pairs independently emitted streams by logical identity while honoring volatility', () => {
    const legacy = parityObservations('legacy', 0);
    const dark = parityObservations('dark', 1);
    expect(legacy.map((entry) => entry.eventId)).not.toEqual(
      dark.map((entry) => entry.eventId),
    );
    expect(compareDeepAiCouncilEventStreams('green-case', legacy, dark)).toEqual([]);
  });

  it.each([
    ['payload', 'payload'],
    ['projection', 'projection'],
    ['receipt', 'receipt'],
    ['artifact', 'artifact'],
    ['terminal-decision', 'terminal-decision'],
    ['causal-link', 'causal-link'],
  ] as const)('classifies an injected %s divergence end-to-end as %s', (field, expected) => {
    const legacy = parityObservations('legacy');
    const dark = [...parityObservations('dark')];
    const eventIndex = field === 'terminal-decision' ? 2 : 1;
    const target = dark[eventIndex];
    const patch = field === 'payload'
      ? { stablePayloadDigest: digest('changed-payload') }
      : field === 'projection'
        ? { projectionFingerprint: digest('changed-projection') }
        : field === 'receipt'
          ? { receiptRefs: ['changed-receipt'] }
          : field === 'artifact'
            ? { artifactRefs: ['changed-artifact'] }
            : field === 'terminal-decision'
              ? { terminalDecision: 'blocked' as const }
              : { causalEventIds: [digest('changed-cause')] };
    dark[eventIndex] = changed(target, patch);
    const diffs = compareDeepAiCouncilEventStreams('fault-case', legacy, dark);
    expect(diffs.map((entry) => entry.class)).toContain(expected);
    expect(diffs.every((entry) => entry.disposition === 'unexplained')).toBe(true);
  });

  it('classifies missing, extra, duplicate, and reordered transitions exactly', () => {
    const legacy = parityObservations('legacy');
    const dark = parityObservations('dark');
    expect(compareDeepAiCouncilEventStreams(
      'missing-case',
      legacy,
      dark.slice(0, 2),
    ).map((entry) => entry.class)).toEqual(['missing']);
    expect(compareDeepAiCouncilEventStreams(
      'extra-case',
      legacy.slice(0, 2),
      dark,
    ).map((entry) => entry.class)).toEqual(['extra']);
    expect(compareDeepAiCouncilEventStreams(
      'duplicate-case',
      legacy,
      [...dark, dark[1]],
    ).map((entry) => entry.class)).toContain('duplicated');
    expect(compareDeepAiCouncilEventStreams(
      'reorder-case',
      legacy,
      [dark[0], dark[2], dark[1]],
    ).map((entry) => entry.class)).toContain('reordered');
  });

  it('fails every unexplained semantic difference without a laundering disposition', () => {
    const legacy = parityObservations('legacy');
    const dark = [...parityObservations('dark')];
    dark[1] = changed(dark[1], { stablePayloadDigest: digest('unexplained') });
    const [diff] = compareDeepAiCouncilEventStreams('closed-diff-case', legacy, dark);
    expect(diff.class).toBe('payload');
    expect(diff.disposition).toBe('unexplained');
    expect(Object.keys(diff)).not.toContain('tolerated');
  });

  it('keeps the legacy oracle structurally distinct from the dark executor', () => {
    const fixture = {
      fixtureId: 'vacuity-case',
      scenario: 'fresh-run',
      frozenInput: {},
      events: [parityEvent('ai_council.run_initialized', 1, 'dark')],
      expectedTerminalDecision: 'active',
      resumeEvidence: null,
    } as never;
    const executors = createDeepAiCouncilParityExecutors(fixture);
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleKind).toBe('independent-legacy-model');
    expect(executors.substrateImportsReal).toBe(true);
  });

  it('rejects malformed volatility before comparison', () => {
    const event = parityEvent('ai_council.run_initialized', 1, 'dark');
    expect(() => canonicalizeDeepAiCouncilEventStream(
      [{ ...event, correlation_id: 'semantic-run-id' }],
      [digest('projection')],
    )).toThrow(/correlation_id/);
  });

  it('drives distinct real paths through replay, certificate issuance, and mode-gate evidence', async () => {
    const fixture = parityFixture();
    const sealed = await createParitySealedBoundary();
    const appendSpy = vi.spyOn(FencedLedgerWriter.prototype, 'append');
    const caseRun = await parityCaseRun(fixture, sealed);
    const manifest = targetedParityManifest(fixture);
    const outcome = await runDeepAiCouncilParityCase({ manifest, caseRun });

    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'green',
      diffDispositions: [],
      certificateStatus: 'issued',
      authorityState: 'legacy-authoritative',
      authorityMutation: false,
      cutoverCertificate: false,
    });
    expect(outcome.receipt.parityCertificateDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(parseDeepAiCouncilParityReceipt(outcome.receipt, manifest)).toEqual(outcome.receipt);
    expect(createDeepAiCouncilModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'pass',
      blockingReasonCode: null,
      zeroUnexplainedDiffs: true,
      authorityMutation: false,
      rollbackReadinessAuthorized: false,
      cutoverAuthorized: false,
    });

    const appendedTypes = appendSpy.mock.calls.map(([request]) => request.event.identity.eventType);
    const evidence = caseRun.executors.evidence();
    expect(caseRun.executors.legacy).not.toBe(caseRun.executors.ledger);
    expect(caseRun.executors.legacyOracleKind).toBe('independent-legacy-model');
    expect(fixture.events.every((event) => appendedTypes.includes(event.event_type))).toBe(true);
    expect(appendedTypes).toContain(REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE);
    expect(evidence).toHaveLength(4);
    expect(evidence.every((entry) => (
      entry.observations.length === fixture.events.length
      && /^[a-f0-9]{64}$/.test(entry.streamDigest)
      && /^[a-f0-9]{64}$/.test(entry.projectionFingerprint)
    ))).toBe(true);
  }, 30_000);

  it.each(PARITY_FAULT_CASES)(
    'classifies $kind through append, replay, comparison, certificate refusal, and gate evidence',
    async ({ kind, eventIndex, expectedClass }) => {
      const fixture = parityFixture();
      const sealed = await createParitySealedBoundary();
      const manifest = targetedParityManifest(fixture);
      const outcome = await runDeepAiCouncilParityCase({
        manifest,
        caseRun: await parityCaseRun(fixture, sealed, {
          path: 'ledger',
          kind,
          eventIndex,
        }),
      });
      expect(outcome.result.ok).toBe(false);
      expect(outcome.receipt).toMatchObject({
        exitStatus: 'blocked',
        certificateStatus: 'refused',
        authorityState: 'legacy-authoritative',
        authorityMutation: false,
      });
      expect(outcome.receipt.diffDispositions.some(
        (entry) => entry.class === expectedClass && entry.disposition === 'unexplained',
      ), JSON.stringify(outcome.receipt)).toBe(true);
      expect(createDeepAiCouncilModeGateInput({
        manifest,
        expectedFixtureIds: [fixture.fixtureId],
        receipts: [outcome.receipt],
      })).toMatchObject({
        exitStatus: 'blocked',
        zeroUnexplainedDiffs: false,
        cutoverAuthorized: false,
      });
    },
    30_000,
  );

  it('rejects a fabricated certificate and a genuine certificate bound to another manifest', async () => {
    const fixture = parityFixture();
    const sealed = await createParitySealedBoundary();
    const manifest = targetedParityManifest(fixture);
    const outcome = await runDeepAiCouncilParityCase({
      manifest,
      caseRun: await parityCaseRun(fixture, sealed),
    });
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(outcome.receipt.certificateEvidenceBindings).toHaveLength(1);

    const { receiptDigest: ignoredReceiptDigest, ...realBody } = outcome.receipt;
    void ignoredReceiptDigest;
    const fabricated = bindParityReceiptDigest({
      ...realBody,
      parityCertificate: null,
      certificateEvidenceBindings: Object.freeze([]),
      parityCertificateDigest: digest('self-chosen-fabricated-certificate'),
      certificateStatus: 'issued',
      certificateRefusalCode: null,
    });
    expect(() => parseDeepAiCouncilParityReceipt(fabricated, manifest)).toThrow(
      /certificate evidence contradicts its status/,
    );
    expect(createDeepAiCouncilModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [fabricated],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'RECEIPT_MALFORMED',
    });

    const differentManifest = targetedParityManifest(fixture, OTHER_BASE_SHA);
    expect(() => parseDeepAiCouncilParityReceipt(
      outcome.receipt,
      differentManifest,
    )).toThrow(/certificate verification failed/);
    expect(createDeepAiCouncilModeGateInput({
      manifest: differentManifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'RECEIPT_STALE',
    });
  }, 30_000);

  it('rejects open fixture and frozen-input shapes before parity evidence can pass', async () => {
    const fixture = parityFixture();
    const sealed = await createParitySealedBoundary();
    const openFixture = Object.freeze({
      ...fixture,
      cutoverAuthorized: true,
    }) as unknown as DeepAiCouncilParityFixture;
    await expect(runDeepAiCouncilParityCase({
      manifest: targetedParityManifest(openFixture),
      caseRun: await parityCaseRun(openFixture, sealed),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);

    const openFrozenInput = Object.freeze({
      ...fixture.frozenInput,
      cutoverAuthorized: true,
    }) as unknown as DeepAiCouncilParityFixture['frozenInput'];
    const fixtureWithOpenInput = Object.freeze({ ...fixture, frozenInput: openFrozenInput });
    const outcome = await runDeepAiCouncilParityCase({
      manifest: targetedParityManifest(fixtureWithOpenInput),
      caseRun: await parityCaseRun(fixtureWithOpenInput, sealed),
    });
    expect(outcome.result).toMatchObject({
      ok: false,
      divergence: {
        class: 'execution-outcome',
        message: expect.stringMatching(/frozenInput must use the closed allowed-key set/),
      },
    });
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'blocked',
      certificateStatus: 'refused',
    });
  }, 30_000);
});
