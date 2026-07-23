// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Ledger Schema Tests
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
  AuthorizedLedgerErrorCodes,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepReviewEventStems,
  DeepReviewWireEventTypes,
  createDeepReviewEventRegistry,
  decideDeepReviewCompatibility,
  prepareDeepReviewEvent,
  upcastLegacyDeepReviewRecord,
} from '../../lib/deep-review-ledger-schema/index.js';
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
  DeepReviewEventInput,
  DeepReviewEventStem,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-review-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'deep-review-shadow';
const AUDIT_LEDGER_ID = 'deep-review-shadow-authorization';
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
  const root = mkdtempSync(join(tmpdir(), 'deep-review-ledger-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createDeepReviewEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-review-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-deep-review-event', 'shadow-capability'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-review.ledger.')
        && input.capabilityId === 'deep-review:append'
        ? 'allow'
        : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-review.ledger.')
        && input.capabilityId === 'deep-review:append'
        ? 'allowed'
        : 'policy_denied',
      matchedRuleIds: ['known-deep-review-event', 'shadow-capability'],
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

function replayMetadata(label: string): DeepReviewReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function targetReference(seed: string): JsonObject {
  return {
    targetId: `target-${seed}`,
    targetType: 'file',
    artifactRef: `artifact:${seed}`,
    sourceDigest: digest(`source:${seed}`),
    contentDigest: digest(`content:${seed}`),
  };
}

function semanticFingerprint(seed: string): SemanticFingerprintParts {
  return {
    algorithmVersion: 'semantic-fingerprint@1',
    semanticAnchorDigest: digest(`anchor:${seed}`),
    normalizedContextDigest: digest(`context:${seed}`),
    programSliceDigest: digest(`slice:${seed}`),
    renameMapVersion: 'rename-map@1',
    baselineState: 'present',
  };
}

function convergenceSignals(seed: string): JsonObject {
  return {
    noveltyRatio: 0.2,
    coverageRatio: 0.9,
    findingStabilityRatio: 0.8,
    evidenceDensityRatio: 0.7,
    hotspotSaturationRatio: 0.6,
    observationDigest: digest(`signals:${seed}`),
  };
}

function scopeFor<TStem extends DeepReviewEventStem>(
  stem: TStem,
): DeepReviewScopeMap[TStem] {
  const base = { runId: 'run-1', sessionId: 'session-1' };
  if (stem === 'deep_review.run_initialized'
    || stem === 'deep_review.run_resumed'
    || stem === 'deep_review.run_restarted') {
    return { ...base, generation: 1 } as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.protocol_plan_recorded') {
    return { ...base, protocolId: 'protocol-1' } as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.synthesis_started'
    || stem === 'deep_review.review_report_committed') {
    return { ...base, reportRevisionId: 'report-revision-1' } as DeepReviewScopeMap[TStem];
  }

  const iteration = { ...base, generation: 1, iterationId: 'iteration-1' };
  if (stem === 'deep_review.review_depth_recorded'
    || stem === 'deep_review.convergence_evaluated'
    || stem === 'deep_review.graph_convergence_evaluated'
    || stem === 'deep_review.blocked_stop_recorded'
    || stem === 'deep_review.pause_recorded') {
    return iteration as DeepReviewScopeMap[TStem];
  }

  const dimension = { ...iteration, dimensionId: 'correctness' };
  if (stem === 'deep_review.dimension_pass_started'
    || stem === 'deep_review.dimension_pass_completed'
    || stem === 'deep_review.recovery_started') {
    return dimension as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.finding_lineage_recorded'
    || stem === 'deep_review.finding_state_changed') {
    return { ...dimension, findingId: 'finding-1' } as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.claim_adjudication_recorded') {
    return {
      ...dimension,
      candidateId: 'candidate-1',
      findingId: 'finding-1',
    } as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.finding_candidate_emitted') {
    return { ...dimension, candidateId: 'candidate-1' } as DeepReviewScopeMap[TStem];
  }
  if (stem === 'deep_review.evidence_observed'
    || stem === 'deep_review.evidence_reconciled') {
    return {
      ...dimension,
      candidateId: 'candidate-1',
      evidenceId: 'evidence-1',
    } as DeepReviewScopeMap[TStem];
  }
  return base as DeepReviewScopeMap[TStem];
}

function evidenceData(seed: string): JsonObject {
  const hash = digest(seed);
  return {
    locator: {
      scheme: 'file',
      artifactRef: 'artifact:src/review.ts',
      locatorDigest: hash,
      selector: 'function:reviewCandidate',
      startLine: 20,
      endLine: 28,
      revision: 'revision-1',
    },
    observationKind: 'test-result',
    rawResultDigest: hash,
    sourceDigest: digest(`source:${seed}`),
    contentDigest: digest(`content:${seed}`),
    toolFingerprint: digest('tool'),
    analyzerFingerprint: digest('analyzer'),
    independentEvidenceClass: 'independent-runtime',
    causalProximityStatus: 'direct',
    stabilityStatus: 'stable',
    relevanceStatus: 'relevant',
  };
}

function dataFor<TStem extends DeepReviewEventStem>(
  stem: TStem,
): DeepReviewPayloadMap[TStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepReviewEventStem, JsonObject>> = {
    'deep_review.run_initialized': {
      target: targetReference('root'),
      lineageMode: 'fresh',
      maxIterations: 5,
      convergencePolicyVersion: 'convergence@1',
      reviewModeContractDigest: hash,
      initialReleaseReadinessState: 'not-assessed',
    },
    'deep_review.run_resumed': {
      priorTailDigest: hash,
      sourceSessionId: 'session-0',
      resumeReason: 'Resume after an operator-approved pause.',
      continuedFromRunId: 'run-0',
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-receipt-1',
    },
    'deep_review.run_restarted': {
      priorTailDigest: hash,
      archivedLineageId: 'lineage-0',
      restartReason: 'Restart after incompatible legacy state.',
      continuedFromRunId: 'run-0',
      compatibilityDecision: 'migrate',
      recoveryReceiptRef: 'recovery-receipt-2',
    },
    'deep_review.scope_resolved': {
      targetSetDigest: hash,
      scopeClass: 'targeted',
      selectedTargets: [targetReference('scope')],
      omittedHighRiskTargetRefs: ['target:generated'],
      discoveryMethodIds: ['changed-files', 'dependency-walk'],
      scopeEvidenceRefs: ['evidence:scope-1'],
    },
    'deep_review.dimension_ordered': {
      orderedDimensionIds: ['correctness', 'security', 'performance', 'maintainability'],
      riskRationale: 'Correctness and security lead because they carry the highest release risk.',
      scopeEvidenceRefs: ['evidence:scope-1'],
      orderingPolicyVersion: 'dimension-order@1',
    },
    'deep_review.protocol_plan_recorded': {
      coreProtocolIds: ['protocol:core'],
      overlayProtocolIds: ['protocol:security'],
      applicability: 'applicable',
      gateClass: 'required',
      contractVersion: 'review-contract@1',
      plannedEvidenceSourceRefs: ['source:test', 'source:inspection'],
      protocolPlanDigest: hash,
    },
    'deep_review.dimension_pass_started': {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: hash,
      passStatus: 'started',
      nextFocusRef: 'focus:candidate-adjudication',
    },
    'deep_review.dimension_pass_completed': {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: hash,
      passStatus: 'complete',
      rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
      nextFocusRef: 'focus:convergence',
    },
    'deep_review.finding_candidate_emitted': {
      targetRefs: ['target:src/review.ts'],
      evidenceRefs: ['evidence-1'],
      claimTextDigest: hash,
      findingClass: 'authorization-gap',
      impact: 0.9,
      rawConfidence: 0.4,
      rawCandidateScore: 0.7,
      actionability: 0.8,
      reachability: 0.6,
      exploitability: 0.5,
      evidenceType: 'test',
      evidenceScope: 'direct',
      rawObservationDigest: digest('raw-candidate-observation'),
      semanticFingerprint: semanticFingerprint('candidate'),
      sourcePassEventId: 'event-7',
    },
    'deep_review.evidence_observed': {
      ...evidenceData('observed'),
      supersedesEvidenceEventId: null,
    },
    'deep_review.evidence_reconciled': {
      ...evidenceData('reconciled'),
      supersedesEvidenceEventId: 'event-10',
      reconciliationOutcome: 'confirmed',
      evidenceSetDigest: hash,
    },
    'deep_review.claim_adjudication_recorded': {
      claimDigest: hash,
      evidenceRefs: ['evidence-1'],
      counterevidenceSoughtRefs: ['evidence:counter-1'],
      alternativeExplanationDigest: digest('alternative'),
      finalSeverity: 'P1',
      impact: 0.9,
      confidence: 0.8,
      downgradeTrigger: 'none',
      transition: 'candidate-to-finding',
      validatorFingerprint: digest('validator'),
      adjudicationOutcome: 'accepted',
      predecessorAdjudicationEventId: null,
    },
    'deep_review.finding_lineage_recorded': {
      priorFingerprint: semanticFingerprint('prior'),
      currentFingerprint: semanticFingerprint('current'),
      lineageRelation: 'updated',
      baselineStatus: 'present',
      evidenceSetDigest: hash,
      predecessorEventRef: 'event-12',
    },
    'deep_review.finding_state_changed': {
      priorFingerprint: semanticFingerprint('prior'),
      currentFingerprint: semanticFingerprint('current'),
      priorState: 'adjudicated',
      currentState: 'accepted',
      priorSeverity: 'none',
      currentSeverity: 'P1',
      adjudicationEventId: 'event-12',
      adjudicationPayloadDigest: digest('adjudication-payload'),
      changeReason: 'Independent evidence confirmed the candidate.',
      evidenceSetDigest: hash,
      predecessorEventRef: 'event-13',
    },
    'deep_review.review_depth_recorded': {
      reviewDepthSchemaVersion: 'review-depth@1',
      applicability: 'applicable',
      targetSelectionDigest: hash,
      requiredBugClasses: ['authorization', 'state-corruption'],
      coveredBugClasses: ['authorization'],
      ruledOutBugClasses: ['state-corruption'],
      deferredBugClasses: [],
      blockedBugClasses: [],
      searchLedgerRowDigests: [digest('search-row-1')],
      graphStatus: 'available',
      semanticSearchStatus: 'available',
    },
    'deep_review.convergence_evaluated': {
      rawSignals: convergenceSignals('raw'),
      weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: hash,
      protocolCoverageDigest: digest('protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 0.8,
      hotspotSaturation: 0.7,
      decision: 'converged',
      policyFingerprint: digest('convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
    },
    'deep_review.graph_convergence_evaluated': {
      rawSignals: convergenceSignals('graph-raw'),
      weightedSignals: convergenceSignals('graph-weighted'),
      dimensionCoverageDigest: hash,
      protocolCoverageDigest: digest('graph-protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 0.8,
      hotspotSaturation: 0.7,
      decision: 'converged',
      policyFingerprint: digest('graph-convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
      graphDecision: 'converged',
      graphDigest: digest('review-graph'),
    },
    'deep_review.blocked_stop_recorded': {
      blockedGateIds: ['gate:unresolved-p1'],
      gateResults: [{
        gateId: 'gate:unresolved-p1',
        status: 'fail',
        reasonCode: 'unresolved-p1',
        evidenceDigest: hash,
      }],
      activeFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
      recoveryStrategy: 'continue-correctness-pass',
      targetDimensionId: 'correctness',
      originatingConvergenceEventId: 'event-16',
      appendPosition: 18,
    },
    'deep_review.pause_recorded': {
      normalizedStopReason: 'operator-pause',
      sentinelCause: 'operator-request',
      fromIterationId: 'iteration-1',
      strategy: 'persist-and-pause',
      targetDimensionId: null,
      outcome: 'paused',
      lineageRef: 'lineage:pause-1',
      priorTailDigest: hash,
    },
    'deep_review.recovery_started': {
      normalizedStopReason: 'blocked-gate',
      recoveryCause: 'unresolved-p1',
      fromIterationId: 'iteration-1',
      strategy: 'targeted-reinspection',
      targetDimensionId: 'correctness',
      outcome: 'recovery-started',
      lineageRef: 'lineage:recovery-1',
      priorTailDigest: hash,
      originatingPauseEventId: 'event-19',
    },
    'deep_review.synthesis_started': {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-20' },
      findingRegistryInputDigest: hash,
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: ['finding-2'],
      deferredFindingIds: ['finding-3'],
    },
    'deep_review.review_report_committed': {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-21' },
      findingRegistryInputDigest: hash,
      deduplicationPolicyDigest: digest('dedup-policy'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: ['finding-2'],
      deferredFindingIds: ['finding-3'],
      reportDigest: digest('report'),
      sectionManifest: {
        sectionIds: ['findings', 'verification', 'residual-risk'],
        manifestDigest: digest('section-manifest'),
      },
      reportReceiptRef: 'report-receipt-1',
    },
    'deep_review.continuity_save_requested': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-22' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
    },
    'deep_review.continuity_save_completed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-23' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity'),
    },
    'deep_review.continuity_save_failed': {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: hash,
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-24' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      retryable: true,
      failureReasonCode: 'storage-unavailable',
    },
    'deep_review.run_completed': {
      terminalStatus: 'completed',
      convergenceEventId: 'event-16',
      synthesisEventId: 'event-21',
      reportEventId: 'event-22',
      continuityEventId: 'event-24',
      finalLedgerTailHash: hash,
      counts: { dimensions: 4, iterations: 1, candidates: 1, findings: 1, evidence: 1 },
      verdict: 'pass',
      completionReason: 'All required gates passed.',
      incompleteReason: null,
    },
  };
  return data[stem] as DeepReviewPayloadMap[TStem];
}

function eventInput<TStem extends DeepReviewEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): DeepReviewEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'deep-review-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-review-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `deep-review-event-${index}`,
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'deep-review:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('deep-review-shadow-write', 1);
  return {
    requestId,
    mode: 'review',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'deep-review-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'deep-review-runtime',
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
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION, REPLAY, AND CLOSED SHAPES
// ───────────────────────────────────────────────────────────────────

describe('deep-review typed ledger schema', () => {
  it('authorizes and appends every event stem through the real ledger', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of DeepReviewEventStems.entries()) {
      const index = offset + 1;
      const event = prepareDeepReviewEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(proof.decision.decision_id);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(DeepReviewEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type)).toEqual(
      DeepReviewEventStems.map((stem) => DeepReviewWireEventTypes[stem]),
    );
    for (const [index, entry] of verified.entries()) {
      const stem = DeepReviewEventStems[index];
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay).toEqual(replayMetadata(stem));
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('produces stable identity, payload digest, and replay metadata', () => {
    const registry = createDeepReviewEventRegistry();
    const input = eventInput('deep_review.run_initialized', 1, '0'.repeat(64));
    const first = prepareDeepReviewEvent(input, registry);
    const second = prepareDeepReviewEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(first.envelope.payload.payloadDigest);
    expect(second.envelope.payload.replay).toEqual(first.envelope.payload.replay);
  });

  it('rejects missing base and event-specific scope identities', () => {
    const registry = createDeepReviewEventRegistry();
    const candidate = eventInput(
      'deep_review.finding_candidate_emitted',
      9,
      '0'.repeat(64),
    );
    const missingRun = { ...candidate.scope } as Record<string, unknown>;
    delete missingRun.runId;
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      scope: missingRun as DeepReviewScopeMap['deep_review.finding_candidate_emitted'],
    }, registry)).toThrow();

    const missingCandidate = { ...candidate.scope } as Record<string, unknown>;
    delete missingCandidate.candidateId;
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      scope: missingCandidate as DeepReviewScopeMap['deep_review.finding_candidate_emitted'],
    }, registry)).toThrow();

    expect(() => prepareDeepReviewEvent({
      ...candidate,
      scope: {
        ...candidate.scope,
        authorizationRef: 'payload-must-not-own-authority',
      } as DeepReviewScopeMap['deep_review.finding_candidate_emitted'],
    }, registry)).toThrow();
  });

  it('rejects absent previous-event hashes and payload digest tampering', () => {
    const registry = createDeepReviewEventRegistry();
    const event = prepareDeepReviewEvent(
      eventInput('deep_review.run_initialized', 1, '0'.repeat(64)),
      registry,
    );
    const missingHash = { ...event.envelope.payload } as Record<string, unknown>;
    delete missingHash.prevEventHash;
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: missingHash as JsonObject,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: {
        ...event.envelope.payload,
        payloadDigest: 'f'.repeat(64),
      },
    }, registry)).toThrow();
  });

  it('rejects mutable source, evidence, and report bodies in load-bearing objects', async () => {
    const harness = createHarness();
    const evidence = eventInput('deep_review.evidence_observed', 10, '0'.repeat(64));
    expect(() => prepareDeepReviewEvent({
      ...evidence,
      data: {
        ...evidence.data,
        locator: {
          ...evidence.data.locator,
          sourceText: 'mutable source body',
        },
      },
    }, harness.registry)).toThrow();

    const candidate = eventInput(
      'deep_review.finding_candidate_emitted',
      9,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      data: {
        ...candidate.data,
        rawOutput: 'mutable analyzer output',
      },
    }, harness.registry)).toThrow();

    const report = eventInput('deep_review.review_report_committed', 22, '0'.repeat(64));
    expect(() => prepareDeepReviewEvent({
      ...report,
      data: {
        ...report.data,
        sectionManifest: {
          ...report.data.sectionManifest,
          reportBody: 'mutable report body',
        },
      },
    }, harness.registry)).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
  });

  it('rejects in-place finding and adjudication revisions', () => {
    const registry = createDeepReviewEventRegistry();
    const lineage = eventInput(
      'deep_review.finding_lineage_recorded',
      13,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...lineage,
      data: {
        ...lineage.data,
        currentFingerprint: lineage.data.priorFingerprint,
        lineageRelation: 'updated',
      },
    }, registry)).toThrow();

    const state = eventInput('deep_review.finding_state_changed', 14, '0'.repeat(64));
    expect(() => prepareDeepReviewEvent({
      ...state,
      data: {
        ...state.data,
        currentState: state.data.priorState,
        currentSeverity: state.data.priorSeverity,
      },
    }, registry)).toThrow();

    const adjudication = prepareDeepReviewEvent(
      eventInput('deep_review.claim_adjudication_recorded', 12, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...adjudication.envelope,
      event_type: 'deep-review.ledger.claim-adjudication-updated',
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before append', async () => {
    const harness = createHarness();
    const event = prepareDeepReviewEvent(
      eventInput('deep_review.run_initialized', 1, '0'.repeat(64)),
      harness.registry,
    );
    const denied = await harness.gateway.authorize(
      await authorizationRequest(harness, event, 'denied-request', 'read-only'),
    );
    expect(denied.verdict).toBe('deny');
    await expect(harness.ledger.appendAuthorized(
      event,
      undefined as unknown as GatewayAllowProof,
    )).rejects.toMatchObject({ code: AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. REVIEW-SPECIFIC SOUNDNESS
  // ─────────────────────────────────────────────────────────────────

  it('keeps candidates non-verdict-bearing until typed adjudication', async () => {
    const harness = createHarness();
    const candidate = eventInput(
      'deep_review.finding_candidate_emitted',
      9,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      data: {
        ...candidate.data,
        finalSeverity: 'P0',
      },
    }, harness.registry)).toThrow();

    const invalidAdjudication = eventInput(
      'deep_review.claim_adjudication_recorded',
      12,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...invalidAdjudication,
      data: {
        ...invalidAdjudication.data,
        finalSeverity: 'P1',
        adjudicationOutcome: 'deferred',
      },
    }, harness.registry)).toThrow();

    const stateChange = eventInput(
      'deep_review.finding_state_changed',
      14,
      '0'.repeat(64),
    );
    const missingAdjudicationDigest = {
      ...stateChange.data,
    } as Record<string, unknown>;
    delete missingAdjudicationDigest.adjudicationPayloadDigest;
    expect(() => prepareDeepReviewEvent({
      ...stateChange,
      data: missingAdjudicationDigest as DeepReviewPayloadMap['deep_review.finding_state_changed'],
    }, harness.registry)).toThrow();

    const event = prepareDeepReviewEvent(invalidAdjudication, harness.registry);
    const proof = await authorize(harness, event, 'adjudication-request');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toMatchObject({
      finalSeverity: 'P1',
      impact: 0.9,
      confidence: 0.8,
      adjudicationOutcome: 'accepted',
    });
  });

  it('preserves raw observations separately from derived severity and verdict', () => {
    const registry = createDeepReviewEventRegistry();
    const candidate = prepareDeepReviewEvent(
      eventInput('deep_review.finding_candidate_emitted', 9, '0'.repeat(64)),
      registry,
    );
    expect(candidate.envelope.payload.data).toMatchObject({
      impact: 0.9,
      rawConfidence: 0.4,
      rawCandidateScore: 0.7,
    });
    expect(candidate.envelope.payload.data).not.toHaveProperty('finalSeverity');

    const evidence = prepareDeepReviewEvent(
      eventInput('deep_review.evidence_observed', 10, '0'.repeat(64)),
      registry,
    );
    expect(evidence.envelope.payload.data).toHaveProperty('rawResultDigest');
    expect(evidence.envelope.payload.data).not.toHaveProperty('verdict');
  });

  it('requires blockers for blocked baseline graph-convergence decisions', () => {
    const registry = createDeepReviewEventRegistry();
    const input = eventInput(
      'deep_review.graph_convergence_evaluated',
      17,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...input,
      data: {
        ...input.data,
        decision: 'blocked',
        graphDecision: 'converged',
        blockerIds: [],
        stopCandidate: false,
      },
    }, registry)).toThrow();
    expect(() => prepareDeepReviewEvent({
      ...input,
      data: {
        ...input.data,
        decision: 'blocked',
        graphDecision: 'converged',
        blockerIds: ['gate:unresolved-p1'],
        stopCandidate: false,
      },
    }, registry)).not.toThrow();
  });

  it('validates the complete semantic-fingerprint lineage vocabulary', () => {
    const registry = createDeepReviewEventRegistry();
    for (const lineageRelation of [
      'absent',
      'disproved',
      'fixed',
      'introduced',
      'updated',
    ] as const) {
      const input = eventInput(
        'deep_review.finding_lineage_recorded',
        13,
        '0'.repeat(64),
      );
      expect(() => prepareDeepReviewEvent({
        ...input,
        data: { ...input.data, lineageRelation },
      }, registry)).not.toThrow();
    }
    for (const lineageRelation of ['unchanged', 'preexisting'] as const) {
      const input = eventInput(
        'deep_review.finding_lineage_recorded',
        13,
        '0'.repeat(64),
      );
      expect(() => prepareDeepReviewEvent({
        ...input,
        data: {
          ...input.data,
          currentFingerprint: input.data.priorFingerprint,
          lineageRelation,
        },
      }, registry)).not.toThrow();
    }
  });

  it('rejects prose smuggling in codes, references, digests, and selectors', () => {
    const registry = createDeepReviewEventRegistry();
    const candidate = eventInput(
      'deep_review.finding_candidate_emitted',
      9,
      '0'.repeat(64),
    );
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      data: { ...candidate.data, findingClass: 'free prose is not a code' },
    }, registry)).toThrow();
    expect(() => prepareDeepReviewEvent({
      ...candidate,
      data: { ...candidate.data, claimTextDigest: 'not-a-digest' },
    }, registry)).toThrow();

    const evidence = eventInput('deep_review.evidence_observed', 10, '0'.repeat(64));
    expect(() => prepareDeepReviewEvent({
      ...evidence,
      data: {
        ...evidence.data,
        locator: {
          ...evidence.data.locator,
          selector: 'A mutable passage with many words that belongs outside the ledger record and is not a structured file or symbol locator at all.',
        },
      },
    }, registry)).toThrow();
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. LEGACY COMPATIBILITY
  // ─────────────────────────────────────────────────────────────────

  it('covers every compatibility outcome and blocks unknown inputs', () => {
    expect(decideDeepReviewCompatibility({
      format: 'deep-review-ledger',
      stem: 'deep_review.run_initialized',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideDeepReviewCompatibility({ type: 'progress', schemaVersion: 1 }).status)
      .toBe('compatible');
    expect(decideDeepReviewCompatibility({
      type: 'iteration',
      schemaVersion: 1,
      runId: 'run-1',
      sessionId: 'session-1',
      run: 1,
      dimension: 'correctness',
    }).status).toBe('migrate');
    expect(decideDeepReviewCompatibility({
      type: 'event',
      event: 'severity_changed',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideDeepReviewCompatibility({ type: 'unknown', schemaVersion: 1 }).status)
      .toBe('blocked');
    expect(decideDeepReviewCompatibility({
      type: 'iteration',
      schemaVersion: 99,
      runId: 'run-1',
      sessionId: 'session-1',
      run: 1,
      dimension: 'correctness',
    }).status).toBe('blocked');
    expect(decideDeepReviewCompatibility({
      format: 'deep-review-ledger',
      stem: 'deep_review.unknown',
      eventVersion: 1,
    }).status).toBe('blocked');
  });

  it('upcasts registered legacy JSONL purely and drives the real append path', async () => {
    const record = {
      type: 'iteration',
      schemaVersion: 1,
      runId: 'run-1',
      sessionId: 'session-1',
      run: 1,
      dimension: 'correctness',
      status: 'complete',
      filesReviewed: ['src/review.ts'],
      findingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
    };
    const context = {
      scope: {
        runId: 'run-1',
        sessionId: 'session-1',
        generation: 1,
        iterationId: 'iteration-1',
        dimensionId: 'correctness',
      },
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-iteration'),
    };
    const first = upcastLegacyDeepReviewRecord(record, context);
    const second = upcastLegacyDeepReviewRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('deep_review.dimension_pass_completed');
    if (first.targetStem !== 'deep_review.dimension_pass_completed') {
      throw new Error(first.targetStem);
    }
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(first.replay.final_digest).toBe(context.replay.final_digest);
    expect(record.filesReviewed).toEqual(['src/review.ts']);

    const harness = createHarness();
    const event = prepareDeepReviewEvent({
      stem: first.targetStem,
      scope: first.scope as DeepReviewScopeMap['deep_review.dimension_pass_completed'],
      prevEventHash: first.prevEventHash,
      replay: first.replay,
      data: first.data as unknown as DeepReviewPayloadMap['deep_review.dimension_pass_completed'],
      eventId: 'legacy-event-1',
      streamId: 'deep-review-legacy-run-1',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-review-legacy-upcaster', version: '1' },
      authorityEpoch: 1,
      correlationId: 'run-1',
      causationId: null,
      idempotencyKey: 'deep-review-legacy-event-1',
    }, harness.registry);
    const proof = await authorize(harness, event, 'legacy-upcast-request');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(first.data);
  });

  it('rejects unregistered envelope and payload versions without guessing', () => {
    const registry = createDeepReviewEventRegistry();
    const event = prepareDeepReviewEvent(
      eventInput('deep_review.run_initialized', 1, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...event.envelope,
      event_version: 2,
    }, registry)).toThrow();
    expect(decideDeepReviewCompatibility({
      format: 'deep-review-ledger',
      stem: 'deep_review.run_initialized',
      eventVersion: 2,
    })).toMatchObject({
      status: 'blocked',
      reasonCode: 'unknown-event-version',
      targetStem: null,
    });
  });
});
