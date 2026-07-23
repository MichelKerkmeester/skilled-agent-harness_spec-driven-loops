// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Ledger Schema Tests
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
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAiCouncilEventInput,
  DeepAiCouncilEventStem,
  DeepAiCouncilPayloadMap,
  DeepAiCouncilReplayMetadata,
  DeepAiCouncilScopeMap,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'deep-ai-council-shadow';
const AUDIT_LEDGER_ID = 'deep-ai-council-shadow-authorization';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
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

function convergenceData(hash: string, decision: 'blocked' | 'continue'): JsonObject {
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
  const hash = digest(stem);
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
      const receipt = await harness.ledger.appendAuthorized(event, proof);
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
    await expect(harness.ledger.appendAuthorized(event, proof)).resolves.toMatchObject({
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
