// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
  DEEP_REVIEW_REDUCER_SURFACE,
  DeepReviewReducerError,
  assertDeepReviewProjectionState,
  createDeepReviewProjectionState,
  foldDeepReviewEvents,
  isDeepFrozenProjection,
  projectDeepReviewLegacyView,
  reduceDeepReviewVerifiedEvent,
  verifyDeepReviewReducerSurface,
} from '../../lib/deep-review-reducers/index.js';
import {
  createDeepReviewEventRegistry,
  prepareDeepReviewEvent,
} from '../../lib/deep-review-ledger-schema/index.js';
import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  DeepReviewEventInput,
  DeepReviewEventStem,
  DeepReviewLedgerEvent,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-review-ledger-schema/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. REAL TYPED-EVENT FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_STREAM_ID = 'deep-review-run-1';
const registry = createDeepReviewEventRegistry();

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function logicalArtifactId(
  kind: string,
  owner: Readonly<Record<string, string>>,
  identity: {
    readonly runId?: string;
    readonly sessionId?: string;
    readonly streamId?: string;
  } = {},
): string {
  const entityOwner = kind === 'finding'
    ? { candidateId: owner.candidateId }
    : kind === 'evidence'
      ? { evidenceId: owner.evidenceId }
      : kind === 'adjudication'
        ? { findingId: owner.findingId }
        : null;
  return `${kind}:${digest(entityOwner ?? {
    runId: identity.runId ?? 'run-1',
    sessionId: identity.sessionId ?? 'session-1',
    streamId: identity.streamId ?? RUN_STREAM_ID,
    owner,
  })}`;
}

function replayMetadata(label: string): DeepReviewReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
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

function convergenceSignals(seed: string): DeepReviewPayloadMap[
  'deep_review.convergence_evaluated'
]['rawSignals'] {
  return {
    noveltyRatio: 0.1,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(`signals:${seed}`),
  };
}

function event<TStem extends DeepReviewEventStem>(
  stem: TStem,
  index: number,
  scope: DeepReviewScopeMap[TStem],
  data: DeepReviewPayloadMap[TStem],
  previousHash = digest(`ledger-tail:${index - 1}`),
  identity: EventIdentityOptions = {},
): DeepReviewLedgerEvent {
  const eventId = identity.eventId ?? `event-${index}`;
  const streamSequence = identity.streamSequence ?? index;
  const input: DeepReviewEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: previousHash,
    replay: replayMetadata(stem),
    data,
    eventId,
    streamId: identity.streamId ?? RUN_STREAM_ID,
    streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-review-shadow-reducer', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: streamSequence === 1 ? null : `event-${streamSequence - 1}`,
    idempotencyKey: `deep-review-reducer-${eventId}`,
  };
  return prepareDeepReviewEvent(input, registry).envelope as DeepReviewLedgerEvent;
}

function runInitialized(index = 1): DeepReviewLedgerEvent {
  return event(
    'deep_review.run_initialized',
    index,
    { runId: 'run-1', sessionId: 'session-1', generation: 1 },
    {
      target: {
        targetId: 'target-root',
        targetType: 'repository',
        artifactRef: 'artifact:repository',
        sourceDigest: digest('target-source'),
        contentDigest: digest('target-content'),
      },
      lineageMode: 'fresh',
      maxIterations: 4,
      convergencePolicyVersion: 'review-convergence@1',
      reviewModeContractDigest: digest('review-contract'),
      initialReleaseReadinessState: 'not-assessed',
    },
  );
}

function scopeResolved(index = 2): DeepReviewLedgerEvent {
  return event(
    'deep_review.scope_resolved',
    index,
    { runId: 'run-1', sessionId: 'session-1' },
    {
      targetSetDigest: digest('target-set'),
      scopeClass: 'targeted',
      selectedTargets: [{
        targetId: 'target-file',
        targetType: 'file',
        artifactRef: 'artifact:src/review.ts',
        sourceDigest: digest('review-source'),
        contentDigest: digest('review-content'),
      }],
      omittedHighRiskTargetRefs: [],
      discoveryMethodIds: ['changed-files'],
      scopeEvidenceRefs: ['scope-evidence-1'],
    },
  );
}

function dimensionOrdered(index = 3): DeepReviewLedgerEvent {
  return event(
    'deep_review.dimension_ordered',
    index,
    { runId: 'run-1', sessionId: 'session-1' },
    {
      orderedDimensionIds: ['correctness'],
      riskRationale: 'Correctness is the only required fixture dimension.',
      scopeEvidenceRefs: ['scope-evidence-1'],
      orderingPolicyVersion: 'dimension-order@1',
    },
  );
}

function passStarted(index = 4): DeepReviewLedgerEvent {
  return event(
    'deep_review.dimension_pass_started',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
    },
    {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: digest('pass-started'),
      passStatus: 'started',
      nextFocusRef: 'focus:evidence',
    },
  );
}

function passCompleted(index = 5): DeepReviewLedgerEvent {
  return event(
    'deep_review.dimension_pass_completed',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
    },
    {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: digest('pass-complete'),
      passStatus: 'complete',
      rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 1, p2: 0 },
      nextFocusRef: 'focus:convergence',
    },
  );
}

interface CandidateOptions {
  readonly candidateId?: string;
  readonly evidenceId?: string;
  readonly evidenceRefs?: string[];
  readonly findingClass?: string;
  readonly sourcePassEventId?: string;
}

interface EvidenceOptions {
  readonly candidateId?: string;
  readonly evidenceId?: string;
}

interface EvidenceReconciliationOptions extends EvidenceOptions {
  readonly supersedesEvidenceEventId?: string;
}

interface AdjudicationOptions extends EvidenceOptions {
  readonly adjudicationOutcome?: DeepReviewPayloadMap[
    'deep_review.claim_adjudication_recorded'
  ]['adjudicationOutcome'];
  readonly confidence?: number;
  readonly finalSeverity?: DeepReviewPayloadMap[
    'deep_review.claim_adjudication_recorded'
  ]['finalSeverity'];
  readonly findingId?: string;
  readonly impact?: number;
  readonly predecessorAdjudicationEventId?: string | null;
  readonly transition?: DeepReviewPayloadMap[
    'deep_review.claim_adjudication_recorded'
  ]['transition'];
}

interface FindingLineageOptions {
  readonly findingId?: string;
  readonly predecessorEventRef?: string;
}

interface FindingStateOptions {
  readonly adjudicationEventId?: string;
  readonly findingId?: string;
  readonly priorSeverity?: DeepReviewPayloadMap[
    'deep_review.finding_state_changed'
  ]['priorSeverity'];
  readonly priorState?: DeepReviewPayloadMap[
    'deep_review.finding_state_changed'
  ]['priorState'];
}

interface ReviewDepthOptions {
  readonly blockedBugClasses?: string[];
  readonly coveredBugClasses?: string[];
  readonly deferredBugClasses?: string[];
  readonly requiredBugClasses?: string[];
  readonly ruledOutBugClasses?: string[];
}

interface ConvergenceOptions {
  readonly blockerIds?: DeepReviewPayloadMap[
    'deep_review.convergence_evaluated'
  ]['blockerIds'];
  readonly decision?: DeepReviewPayloadMap[
    'deep_review.convergence_evaluated'
  ]['decision'];
  readonly stopCandidate?: boolean;
}

interface RunCompletedOptions {
  readonly continuityEventId?: string;
  readonly convergenceEventId?: string;
  readonly reportEventId?: string;
  readonly synthesisEventId?: string;
  readonly terminalStatus?: DeepReviewPayloadMap[
    'deep_review.run_completed'
  ]['terminalStatus'];
  readonly verdict?: DeepReviewPayloadMap['deep_review.run_completed']['verdict'];
}

interface EventIdentityOptions {
  readonly eventId?: string;
  readonly streamId?: string;
  readonly streamSequence?: number;
}

function findingCandidate(
  index = 6,
  options: CandidateOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.finding_candidate_emitted',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      candidateId: options.candidateId ?? 'candidate-1',
    },
    {
      targetRefs: ['target:src/review.ts'],
      evidenceRefs: options.evidenceRefs ?? [options.evidenceId ?? 'evidence-1'],
      claimTextDigest: digest('candidate-claim'),
      findingClass: options.findingClass ?? 'correctness-defect',
      impact: 0.9,
      rawConfidence: 0.7,
      rawCandidateScore: 0.8,
      actionability: 0.8,
      reachability: 0.8,
      exploitability: 0.5,
      evidenceType: 'test',
      evidenceScope: 'direct',
      rawObservationDigest: digest('candidate-observation'),
      semanticFingerprint: semanticFingerprint('candidate'),
      sourcePassEventId: options.sourcePassEventId ?? 'event-5',
    },
  );
}

function evidenceObserved(
  index = 7,
  options: EvidenceOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.evidence_observed',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      candidateId: options.candidateId ?? 'candidate-1',
      evidenceId: options.evidenceId ?? 'evidence-1',
    },
    {
      locator: {
        scheme: 'file',
        artifactRef: 'artifact:src/review.ts',
        locatorDigest: digest('locator'),
        selector: 'function:reviewCandidate',
        startLine: 20,
        endLine: 28,
        revision: 'revision-1',
      },
      observationKind: 'test-result',
      rawResultDigest: digest('test-result'),
      sourceDigest: digest('evidence-source'),
      contentDigest: digest('evidence-content'),
      toolFingerprint: digest('test-tool'),
      analyzerFingerprint: digest('test-analyzer'),
      independentEvidenceClass: 'independent-test',
      causalProximityStatus: 'direct',
      stabilityStatus: 'stable',
      relevanceStatus: 'relevant',
      supersedesEvidenceEventId: null,
    },
  );
}

function evidenceReconciled(
  index = 8,
  options: EvidenceReconciliationOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.evidence_reconciled',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      candidateId: options.candidateId ?? 'candidate-1',
      evidenceId: options.evidenceId ?? 'evidence-1',
    },
    {
      ...evidenceObserved().payload.data,
      contentDigest: digest(`reconciled:${options.evidenceId ?? 'evidence-1'}`),
      supersedesEvidenceEventId: options.supersedesEvidenceEventId ?? 'event-7',
      reconciliationOutcome: 'confirmed',
      evidenceSetDigest: digest(`evidence-set:${options.evidenceId ?? 'evidence-1'}`),
    },
  );
}

function adjudication(
  index = 8,
  options: AdjudicationOptions = {},
): DeepReviewLedgerEvent {
  const adjudicationOutcome = options.adjudicationOutcome ?? 'accepted';
  return event(
    'deep_review.claim_adjudication_recorded',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      candidateId: options.candidateId ?? 'candidate-1',
      findingId: options.findingId ?? 'finding-1',
    },
    {
      claimDigest: digest('adjudicated-claim'),
      evidenceRefs: [options.evidenceId ?? 'evidence-1'],
      counterevidenceSoughtRefs: ['counterevidence-1'],
      alternativeExplanationDigest: digest('alternative'),
      finalSeverity: options.finalSeverity
        ?? (adjudicationOutcome === 'accepted' ? 'P2' : 'none'),
      impact: options.impact ?? 0.5,
      confidence: options.confidence ?? 0.8,
      downgradeTrigger: 'none',
      transition: options.transition ?? 'candidate-to-finding',
      validatorFingerprint: digest('validator'),
      adjudicationOutcome,
      predecessorAdjudicationEventId: options.predecessorAdjudicationEventId ?? null,
    },
  );
}

function findingLineage(
  index = 9,
  options: FindingLineageOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.finding_lineage_recorded',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      findingId: options.findingId ?? 'finding-1',
    },
    {
      priorFingerprint: semanticFingerprint('candidate'),
      currentFingerprint: semanticFingerprint('lineage'),
      lineageRelation: 'updated',
      baselineStatus: 'present',
      evidenceSetDigest: digest('lineage-evidence'),
      predecessorEventRef: options.predecessorEventRef ?? 'event-8',
    },
  );
}

function reviewDepth(
  index = 9,
  options: ReviewDepthOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.review_depth_recorded',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
    },
    {
      reviewDepthSchemaVersion: 'review-depth@1',
      applicability: 'applicable',
      targetSelectionDigest: digest('depth-targets'),
      requiredBugClasses: options.requiredBugClasses ?? ['state-corruption'],
      coveredBugClasses: options.coveredBugClasses ?? ['state-corruption'],
      ruledOutBugClasses: options.ruledOutBugClasses ?? [],
      deferredBugClasses: options.deferredBugClasses ?? [],
      blockedBugClasses: options.blockedBugClasses ?? [],
      searchLedgerRowDigests: [digest('search-row')],
      graphStatus: 'available',
      semanticSearchStatus: 'available',
    },
  );
}

function convergence(
  index = 10,
  options: ConvergenceOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.convergence_evaluated',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
    },
    {
      rawSignals: convergenceSignals('raw'),
      weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: digest('dimension-coverage'),
      protocolCoverageDigest: digest('protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 1,
      hotspotSaturation: 1,
      decision: options.decision ?? 'converged',
      policyFingerprint: digest('convergence-policy'),
      blockerIds: options.blockerIds ?? [],
      stopCandidate: options.stopCandidate ?? true,
    },
  );
}

function synthesisStarted(index = 11): DeepReviewLedgerEvent {
  return event(
    'deep_review.synthesis_started',
    index,
    { runId: 'run-1', sessionId: 'session-1', reportRevisionId: 'report-1' },
    {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-10' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
    },
  );
}

function reportCommitted(index = 12): DeepReviewLedgerEvent {
  return event(
    'deep_review.review_report_committed',
    index,
    { runId: 'run-1', sessionId: 'session-1', reportRevisionId: 'report-1' },
    {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-11' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
      reportDigest: digest('report'),
      sectionManifest: {
        sectionIds: ['findings', 'verification'],
        manifestDigest: digest('report-sections'),
      },
      reportReceiptRef: 'report-receipt-1',
    },
  );
}

function continuityRequested(index = 13): DeepReviewLedgerEvent {
  return event(
    'deep_review.continuity_save_requested',
    index,
    { runId: 'run-1', sessionId: 'session-1' },
    {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-12' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
    },
  );
}

function continuityCompleted(index = 14): DeepReviewLedgerEvent {
  return event(
    'deep_review.continuity_save_completed',
    index,
    { runId: 'run-1', sessionId: 'session-1' },
    {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-13' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    },
  );
}

function runCompleted(
  index = 15,
  options: RunCompletedOptions = {},
): DeepReviewLedgerEvent {
  const previousHash = digest(`ledger-tail:${index - 1}`);
  const terminalStatus = options.terminalStatus ?? 'completed';
  return event(
    'deep_review.run_completed',
    index,
    { runId: 'run-1', sessionId: 'session-1' },
    {
      terminalStatus,
      convergenceEventId: options.convergenceEventId ?? 'event-10',
      synthesisEventId: options.synthesisEventId ?? 'event-11',
      reportEventId: options.reportEventId ?? 'event-12',
      continuityEventId: options.continuityEventId ?? 'event-14',
      finalLedgerTailHash: previousHash,
      counts: { dimensions: 1, iterations: 1, candidates: 1, findings: 1, evidence: 1 },
      verdict: options.verdict ?? 'pass',
      completionReason: terminalStatus === 'completed'
        ? 'All required typed gates passed.'
        : null,
      incompleteReason: terminalStatus === 'completed'
        ? null
        : 'The run ended with unresolved review state.',
    },
    previousHash,
  );
}

function terminalEvents(
  startIndex: number,
  convergenceEventId: string,
  options: RunCompletedOptions = {},
): DeepReviewLedgerEvent[] {
  const synthesisIndex = startIndex;
  const reportIndex = startIndex + 1;
  const continuityRequestIndex = startIndex + 2;
  const continuityIndex = startIndex + 3;
  const completionIndex = startIndex + 4;
  return [
    synthesisStarted(synthesisIndex),
    reportCommitted(reportIndex),
    continuityRequested(continuityRequestIndex),
    continuityCompleted(continuityIndex),
    runCompleted(completionIndex, {
      ...options,
      convergenceEventId,
      synthesisEventId: `event-${synthesisIndex}`,
      reportEventId: `event-${reportIndex}`,
      continuityEventId: `event-${continuityIndex}`,
    }),
  ];
}

function pauseRecorded(index = 2): DeepReviewLedgerEvent {
  return event(
    'deep_review.pause_recorded',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
    },
    {
      normalizedStopReason: 'operator-pause',
      sentinelCause: 'operator-request',
      fromIterationId: 'iteration-1',
      strategy: 'persist-and-pause',
      targetDimensionId: null,
      outcome: 'paused',
      lineageRef: 'lineage:pause-1',
      priorTailDigest: digest('pause-tail'),
    },
  );
}

function findingFixed(
  index = 9,
  options: FindingStateOptions = {},
): DeepReviewLedgerEvent {
  return event(
    'deep_review.finding_state_changed',
    index,
    {
      runId: 'run-1',
      sessionId: 'session-1',
      generation: 1,
      iterationId: 'iteration-1',
      dimensionId: 'correctness',
      findingId: options.findingId ?? 'finding-1',
    },
    {
      priorFingerprint: semanticFingerprint('candidate'),
      currentFingerprint: semanticFingerprint('fixed'),
      priorState: options.priorState ?? 'accepted',
      currentState: 'fixed',
      priorSeverity: options.priorSeverity ?? 'P0',
      currentSeverity: 'none',
      adjudicationEventId: options.adjudicationEventId ?? 'event-8',
      adjudicationPayloadDigest: digest('adjudicated-claim'),
      changeReason: 'The typed resolution records that the finding was fixed.',
      evidenceSetDigest: digest('resolved-evidence'),
      predecessorEventRef: 'event-8',
    },
  );
}

function verifiedEvent(typedEvent: DeepReviewLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(typedEvent), registry);
  const hash = digest(typedEvent.event_id);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'deep-review-shadow',
    sequence: typedEvent.stream_sequence,
    prev_record_hash: digest(`previous-frame:${typedEvent.stream_sequence}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'deep-review-shadow-authorization',
      audit_sequence: typedEvent.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision-${typedEvent.event_id}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'deep-review-shadow',
      sequence: typedEvent.stream_sequence,
      event_id: typedEvent.event_id,
      event_type: typedEvent.event_type,
      event_version: typedEvent.event_version,
      stream_id: typedEvent.stream_id,
      stream_sequence: typedEvent.stream_sequence,
      committed_at: TIMESTAMP,
    },
    canonical_event_bytes: Buffer.from(read.effective.canonicalBytes).toString('base64'),
    record_hash: hash,
  };
  return Object.freeze({ frame: Object.freeze(frame), event: read });
}

function twoStreamCheckpointEvents(): DeepReviewLedgerEvent[] {
  return [
    event(
      'deep_review.run_initialized',
      1,
      { runId: 'run-1', sessionId: 'session-1', generation: 1 },
      runInitialized().payload.data,
      undefined,
      { eventId: 'stream-a-event-1', streamId: 'stream-a', streamSequence: 1 },
    ),
    event(
      'deep_review.scope_resolved',
      2,
      { runId: 'run-1', sessionId: 'session-1' },
      scopeResolved().payload.data,
      undefined,
      { eventId: 'stream-a-event-2', streamId: 'stream-a', streamSequence: 2 },
    ),
    event(
      'deep_review.dimension_ordered',
      1,
      { runId: 'run-1', sessionId: 'session-1' },
      dimensionOrdered().payload.data,
      undefined,
      { eventId: 'stream-z-event-1', streamId: 'stream-z', streamSequence: 1 },
    ),
    event(
      'deep_review.dimension_pass_started',
      2,
      passStarted().payload.scope,
      passStarted().payload.data,
      undefined,
      { eventId: 'stream-z-event-2', streamId: 'stream-z', streamSequence: 2 },
    ),
    event(
      'deep_review.dimension_pass_completed',
      3,
      passCompleted().payload.scope,
      passCompleted().payload.data,
      undefined,
      { eventId: 'stream-z-event-3', streamId: 'stream-z', streamSequence: 3 },
    ),
    event(
      'deep_review.finding_candidate_emitted',
      4,
      findingCandidate().payload.scope,
      { ...findingCandidate().payload.data, sourcePassEventId: 'stream-z-event-3' },
      undefined,
      { eventId: 'stream-z-event-4', streamId: 'stream-z', streamSequence: 4 },
    ),
    event(
      'deep_review.evidence_observed',
      5,
      evidenceObserved().payload.scope,
      evidenceObserved().payload.data,
      undefined,
      { eventId: 'stream-z-event-5', streamId: 'stream-z', streamSequence: 5 },
    ),
  ];
}

function successfulEvents(candidateOptions: CandidateOptions = {}): DeepReviewLedgerEvent[] {
  return [
    runInitialized(),
    scopeResolved(),
    dimensionOrdered(),
    passStarted(),
    passCompleted(),
    findingCandidate(6, candidateOptions),
    evidenceObserved(),
    adjudication(),
    reviewDepth(),
    convergence(),
    synthesisStarted(),
    reportCommitted(),
    continuityRequested(),
    continuityCompleted(),
    runCompleted(),
  ];
}

function artifactPrefixEvents(): DeepReviewLedgerEvent[] {
  return [
    runInitialized(),
    scopeResolved(),
    dimensionOrdered(),
    passStarted(),
    passCompleted(),
    convergence(6),
    synthesisStarted(7),
    reportCommitted(8),
    continuityRequested(9),
    continuityCompleted(10),
  ];
}

// ───────────────────────────────────────────────────────────────────
// 2. PURE FOLD AND FAIL-CLOSED REPLAY
// ───────────────────────────────────────────────────────────────────

describe('deep-review reducers and projections', () => {
  it('replays identical real typed events to identical frozen projections and fingerprints', () => {
    const events = successfulEvents();
    const first = foldDeepReviewEvents(events);
    const second = foldDeepReviewEvents(events);

    expect(first.outcome).toBe('projected');
    expect(second.outcome).toBe('projected');
    expect(second).toEqual(first);
    if (first.outcome !== 'projected' || second.outcome !== 'projected') return;
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(first.projection.status.state).toBe('complete');
    expect(first.projection.reviewLoop.terminalDecision).toBe('pass');
    expect(isDeepFrozenProjection(first)).toBe(true);
  });

  it('rejects a pass completion when an accepted P1 arrives after convergence', () => {
    const convergedPrefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
    ];
    const stalePass = foldDeepReviewEvents(convergedPrefix);
    expect(stalePass.outcome).toBe('projected');
    if (stalePass.outcome !== 'projected') return;
    expect(stalePass.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      blockerIds: [],
    });

    expect(() => foldDeepReviewEvents([
      ...convergedPrefix,
      findingCandidate(7),
      evidenceObserved(8),
      adjudication(9, {
        finalSeverity: 'P1',
        impact: 0.9,
        confidence: 0.8,
      }),
      ...terminalEvents(10, 'event-6'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
    }));
  });

  it('rejects a pass completion when an accepted hard veto arrives after convergence', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      findingCandidate(7, { findingClass: 'security' }),
      evidenceObserved(8),
      adjudication(9, {
        finalSeverity: 'P0',
        impact: 0.9,
        confidence: 0.8,
      }),
      ...terminalEvents(10, 'event-6'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));
  });

  it('rejects a pass completion when a required obligation arrives after convergence', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      reviewDepth(7, {
        requiredBugClasses: ['late-obligation'],
        coveredBugClasses: [],
        deferredBugClasses: ['late-obligation'],
      }),
      ...terminalEvents(8, 'event-6'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));
  });

  it('accepts pass completion after a blocker is resolved and convergence is current', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      adjudication(8, {
        finalSeverity: 'P1',
        impact: 0.9,
        confidence: 0.8,
      }),
      findingFixed(9, { priorSeverity: 'P1' }),
      convergence(),
      ...terminalEvents(11, 'event-10'),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.status.state).toBe('complete');
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      terminalDecision: 'pass',
      blockerIds: [],
    });
    expect(result.projection.findingLedger.activeFindingIds).toEqual([]);
  });

  it('rejects a completed terminal that cites a superseded converged evaluation', () => {
    const events = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      convergence(7, {
        decision: 'continue',
        stopCandidate: false,
      }),
    ];
    const latest = foldDeepReviewEvents(events);
    expect(latest.outcome).toBe('projected');
    if (latest.outcome !== 'projected') return;
    expect(latest.projection.reviewLoop).toMatchObject({
      eligibility: 'CONTINUE',
      outcome: 'active',
    });

    expect(() => foldDeepReviewEvents([
      ...events,
      ...terminalEvents(8, 'event-6'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));
  });

  it('rejects a completed terminal when the cited latest evaluation says continue', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      convergence(7, {
        decision: 'continue',
        stopCandidate: false,
      }),
      ...terminalEvents(8, 'event-7'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));
  });

  it('accepts a completed terminal that cites the latest clean converged evaluation', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6, {
        decision: 'continue',
        stopCandidate: false,
      }),
      convergence(7),
      ...terminalEvents(8, 'event-7'),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.status.state).toBe('complete');
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      terminalDecision: 'pass',
      blockerIds: [],
    });
  });

  it('rejects auxiliary-stream completion and accepts the same narrative on the run stream', () => {
    const mainStream = 'stream-a';
    const auxiliaryStream = 'stream-z';
    const mainEvents = [
      event(
        'deep_review.run_initialized',
        1,
        runInitialized().payload.scope,
        runInitialized().payload.data,
        undefined,
        { eventId: 'main-1', streamId: mainStream, streamSequence: 1 },
      ),
      event(
        'deep_review.scope_resolved',
        2,
        scopeResolved().payload.scope,
        scopeResolved().payload.data,
        undefined,
        { eventId: 'main-2', streamId: mainStream, streamSequence: 2 },
      ),
      event(
        'deep_review.dimension_ordered',
        3,
        dimensionOrdered().payload.scope,
        dimensionOrdered().payload.data,
        undefined,
        { eventId: 'main-3', streamId: mainStream, streamSequence: 3 },
      ),
      event(
        'deep_review.dimension_pass_started',
        4,
        passStarted().payload.scope,
        passStarted().payload.data,
        undefined,
        { eventId: 'main-4', streamId: mainStream, streamSequence: 4 },
      ),
      event(
        'deep_review.dimension_pass_completed',
        5,
        passCompleted().payload.scope,
        passCompleted().payload.data,
        undefined,
        { eventId: 'main-5', streamId: mainStream, streamSequence: 5 },
      ),
      event(
        'deep_review.convergence_evaluated',
        6,
        convergence().payload.scope,
        convergence(6, { decision: 'continue', stopCandidate: false }).payload.data,
        undefined,
        { eventId: 'main-6', streamId: mainStream, streamSequence: 6 },
      ),
    ];
    const auxiliaryTailHash = digest('auxiliary-tail');
    const auxiliaryEvents = [
      event(
        'deep_review.convergence_evaluated',
        1,
        convergence().payload.scope,
        convergence().payload.data,
        undefined,
        { eventId: 'aux-1', streamId: auxiliaryStream, streamSequence: 1 },
      ),
      event(
        'deep_review.synthesis_started',
        2,
        synthesisStarted().payload.scope,
        synthesisStarted().payload.data,
        undefined,
        { eventId: 'aux-2', streamId: auxiliaryStream, streamSequence: 2 },
      ),
      event(
        'deep_review.review_report_committed',
        3,
        reportCommitted().payload.scope,
        reportCommitted().payload.data,
        undefined,
        { eventId: 'aux-3', streamId: auxiliaryStream, streamSequence: 3 },
      ),
      event(
        'deep_review.continuity_save_requested',
        4,
        continuityRequested().payload.scope,
        continuityRequested().payload.data,
        undefined,
        { eventId: 'aux-4', streamId: auxiliaryStream, streamSequence: 4 },
      ),
      event(
        'deep_review.continuity_save_completed',
        5,
        continuityCompleted().payload.scope,
        continuityCompleted().payload.data,
        undefined,
        { eventId: 'aux-5', streamId: auxiliaryStream, streamSequence: 5 },
      ),
      event(
        'deep_review.run_completed',
        6,
        runCompleted().payload.scope,
        {
          ...runCompleted().payload.data,
          convergenceEventId: 'aux-1',
          synthesisEventId: 'aux-2',
          reportEventId: 'aux-3',
          continuityEventId: 'aux-5',
          finalLedgerTailHash: auxiliaryTailHash,
        },
        auxiliaryTailHash,
        { eventId: 'aux-6', streamId: auxiliaryStream, streamSequence: 6 },
      ),
    ];

    expect(() => foldDeepReviewEvents([
      ...mainEvents,
      ...auxiliaryEvents,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'reviewLoop.terminalDecision',
    }));

    const ownStreamControl = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6, { decision: 'continue', stopCandidate: false }),
      convergence(7),
      ...terminalEvents(8, 'event-7'),
    ]);
    expect(ownStreamControl.outcome).toBe('projected');
    if (ownStreamControl.outcome !== 'projected') return;
    expect(ownStreamControl.projection.status.state).toBe('complete');
  });

  it('rejects an original convergence citation after blocked and reset evaluations', () => {
    const events = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      convergence(7, {
        blockerIds: ['explicit-blocker'],
        decision: 'blocked',
        stopCandidate: false,
      }),
      convergence(8),
    ];
    expect(() => foldDeepReviewEvents([
      ...events,
      ...terminalEvents(9, 'event-6'),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'status',
    }));

    const latest = foldDeepReviewEvents([
      ...events,
      ...terminalEvents(9, 'event-8'),
    ]);
    expect(latest.outcome).toBe('projected');
    if (latest.outcome !== 'projected') return;
    expect(latest.projection.status.state).toBe('complete');
    expect(latest.projection.reviewLoop.terminalDecision).toBe('pass');
  });

  it.each([
    ['incomplete', 'incomplete'],
    ['blocked', 'failed'],
  ] as const)(
    'accepts %s terminal lifecycle when the latest evaluation says continue',
    (terminalStatus, expectedState) => {
      const result = foldDeepReviewEvents([
        runInitialized(),
        scopeResolved(),
        dimensionOrdered(),
        passStarted(),
        passCompleted(),
        convergence(6),
        convergence(7, {
          decision: 'continue',
          stopCandidate: false,
        }),
        ...terminalEvents(8, 'event-7', {
          terminalStatus,
          verdict: terminalStatus,
        }),
      ]);

      expect(result.outcome).toBe('projected');
      if (result.outcome !== 'projected') return;
      expect(result.projection.status).toMatchObject({
        state: expectedState,
        terminal: true,
      });
    },
  );

  it.each(['fail', 'blocked', 'incomplete'] as const)(
    'rejects %s completion when an accepted P1 arrives after convergence',
    (verdict) => {
      expect(() => foldDeepReviewEvents([
        runInitialized(),
        scopeResolved(),
        dimensionOrdered(),
        passStarted(),
        passCompleted(),
        convergence(6),
        findingCandidate(7),
        evidenceObserved(8),
        adjudication(9, {
          finalSeverity: 'P1',
          impact: 0.9,
          confidence: 0.8,
        }),
        ...terminalEvents(10, 'event-6', { verdict }),
      ])).toThrowError(expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }));
    },
  );

  it.each(['fail', 'blocked', 'incomplete'] as const)(
    'rejects %s completion when a required obligation arrives after convergence',
    (verdict) => {
      expect(() => foldDeepReviewEvents([
        runInitialized(),
        scopeResolved(),
        dimensionOrdered(),
        passStarted(),
        passCompleted(),
        convergence(6),
        reviewDepth(7, {
          requiredBugClasses: ['late-obligation'],
          coveredBugClasses: [],
          deferredBugClasses: ['late-obligation'],
        }),
        ...terminalEvents(8, 'event-6', { verdict }),
      ])).toThrowError(expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }));
    },
  );

  it('rejects fail completion when an accepted hard veto arrives after convergence', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      findingCandidate(7, { findingClass: 'security' }),
      evidenceObserved(8),
      adjudication(9, {
        finalSeverity: 'P0',
        impact: 0.9,
        confidence: 0.8,
      }),
      ...terminalEvents(10, 'event-6', { verdict: 'fail' }),
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
    }));
  });

  it.each(['pass', 'fail', 'blocked', 'incomplete'] as const)(
    'accepts clean completed terminal state with %s verdict',
    (verdict) => {
      const result = foldDeepReviewEvents([
        runInitialized(),
        scopeResolved(),
        dimensionOrdered(),
        passStarted(),
        passCompleted(),
        findingCandidate(),
        evidenceObserved(),
        adjudication(8, {
          finalSeverity: 'P1',
          impact: 0.9,
          confidence: 0.8,
        }),
        findingFixed(9, { priorSeverity: 'P1' }),
        convergence(),
        ...terminalEvents(11, 'event-10', { verdict }),
      ]);

      expect(result.outcome).toBe('projected');
      if (result.outcome !== 'projected') return;
      expect(result.projection.status).toMatchObject({
        state: 'complete',
        terminal: true,
      });
      expect(result.projection.reviewLoop).toMatchObject({
        eligibility: 'STOP_ELIGIBLE',
        blockerIds: [],
        terminalDecision: verdict,
      });
    },
  );

  it.each([
    ['incomplete', 'incomplete'],
    ['blocked', 'failed'],
  ] as const)(
    'accepts %s terminal lifecycle with an open finding',
    (terminalStatus, expectedState) => {
      const result = foldDeepReviewEvents([
        runInitialized(),
        scopeResolved(),
        dimensionOrdered(),
        passStarted(),
        passCompleted(),
        convergence(6),
        findingCandidate(7),
        evidenceObserved(8),
        adjudication(9, {
          finalSeverity: 'P1',
          impact: 0.9,
          confidence: 0.8,
        }),
        ...terminalEvents(10, 'event-6', {
          terminalStatus,
          verdict: terminalStatus,
        }),
      ]);

      expect(result.outcome).toBe('projected');
      if (result.outcome !== 'projected') return;
      expect(result.projection.status).toMatchObject({
        state: expectedState,
        terminal: true,
      });
      expect(result.projection.findingLedger.activeFindingIds).toEqual(['finding-1']);
    },
  );

  it('fails closed when the real typed stream has a sequence gap', () => {
    const result = foldDeepReviewEvents([runInitialized(), scopeResolved(3)]);

    expect(result).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('fails closed when a never-seen stream starts beyond its first position', () => {
    const prefix = foldDeepReviewEvents(twoStreamCheckpointEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;
    expect(prefix.checkpoint.sourceTailSequence).toBe(7);

    const firstNewStreamEvent = event(
      'deep_review.review_depth_recorded',
      6,
      reviewDepth().payload.scope,
      reviewDepth().payload.data,
      undefined,
      { eventId: 'new-stream-event-6', streamId: 'new-stream', streamSequence: 6 },
    );

    expect(foldDeepReviewEvents([firstNewStreamEvent], {
      checkpoint: prefix.checkpoint,
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('advances two checkpointed streams from their own last-seen positions', () => {
    const prefix = foldDeepReviewEvents(twoStreamCheckpointEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const streamAContinuation = event(
      'deep_review.review_depth_recorded',
      3,
      reviewDepth().payload.scope,
      reviewDepth().payload.data,
      undefined,
      { eventId: 'stream-a-event-3', streamId: 'stream-a', streamSequence: 3 },
    );
    const streamZContinuation = event(
      'deep_review.claim_adjudication_recorded',
      6,
      adjudication().payload.scope,
      adjudication().payload.data,
      undefined,
      { eventId: 'stream-z-event-6', streamId: 'stream-z', streamSequence: 6 },
    );
    const result = foldDeepReviewEvents(
      [streamZContinuation, streamAContinuation],
      { checkpoint: prefix.checkpoint },
    );

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.seenEvents.filter(
      (seen) => seen.streamId === 'stream-a',
    ).map((seen) => seen.streamSequence)).toEqual([1, 2, 3]);
    expect(result.projection.seenEvents.filter(
      (seen) => seen.streamId === 'stream-z',
    ).map((seen) => seen.streamSequence)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('orders colliding status sequences by causal input position', () => {
    const events = [
      event(
        'deep_review.run_initialized',
        1,
        runInitialized().payload.scope,
        runInitialized().payload.data,
        undefined,
        { eventId: 'z-initialized', streamId: 'stream-a', streamSequence: 1 },
      ),
      event(
        'deep_review.scope_resolved',
        2,
        scopeResolved().payload.scope,
        scopeResolved().payload.data,
        undefined,
        { eventId: 'z-active', streamId: 'stream-a', streamSequence: 2 },
      ),
      event(
        'deep_review.pause_recorded',
        1,
        pauseRecorded().payload.scope,
        pauseRecorded().payload.data,
        undefined,
        { eventId: 'a-paused', streamId: 'stream-z', streamSequence: 1 },
      ),
    ];

    const result = foldDeepReviewEvents(events);
    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.status.state).toBe('paused');
    expect(result.projection.status.provenance.map(
      (transition) => transition.producerEventId,
    )).toEqual(['z-initialized', 'z-active', 'a-paused']);
  });

  it('fails closed when a stream-label swap would conceal a per-stream gap', () => {
    const prefix = foldDeepReviewEvents(twoStreamCheckpointEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const relabeledContinuation = event(
      'deep_review.claim_adjudication_recorded',
      6,
      adjudication().payload.scope,
      adjudication().payload.data,
      undefined,
      { eventId: 'relabeled-event-6', streamId: 'stream-a', streamSequence: 6 },
    );

    expect(foldDeepReviewEvents([relabeledContinuation], {
      checkpoint: prefix.checkpoint,
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('treats an exact duplicate typed event as idempotent', () => {
    const initialized = runInitialized();
    const once = foldDeepReviewEvents([initialized]);
    const duplicated = foldDeepReviewEvents([initialized, initialized]);

    expect(duplicated).toEqual(once);
  });

  it('rejects a finding whose source pass was never captured', () => {
    const phantom = findingCandidate(2, { sourcePassEventId: 'event-phantom-pass' });

    expect(() => foldDeepReviewEvents([runInitialized(), phantom])).toThrowError(
      expect.objectContaining({
        code: 'referential-integrity',
        field: 'findingLedger.findings.sourcePassEventId',
      }),
    );
  });

  it('rejects a forged checkpoint tail through the real fold export', () => {
    const projected = foldDeepReviewEvents([runInitialized()]);
    expect(projected.outcome).toBe('projected');
    if (projected.outcome !== 'projected') return;

    const forged = {
      ...projected.checkpoint,
      sourceTailSequence: projected.checkpoint.sourceTailSequence + 1,
    };
    expect(foldDeepReviewEvents([], { checkpoint: forged })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('rejects an impossible status transition instead of guessing', () => {
    expect(() => foldDeepReviewEvents([runInitialized(), pauseRecorded()])).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status.provenance',
      }),
    );
  });

  it('fails closed on projection-version and typed-event fingerprint mismatches', () => {
    expect(foldDeepReviewEvents([runInitialized()], {
      expectedSchemaVersion: 'deep-review-projection@999',
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['projection-schema-mismatch'],
    });

    const valid = runInitialized();
    const tampered = {
      ...valid,
      payload: { ...valid.payload, payloadDigest: 'f'.repeat(64) },
    } as DeepReviewLedgerEvent;
    expect(() => foldDeepReviewEvents([tampered])).toThrowError(
      expect.objectContaining({ code: 'event-schema-invalid' }),
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. REVIEW-SPECIFIC PROJECTIONS
  // ─────────────────────────────────────────────────────────────────

  it.each([
    'security_issue',
    'security.critical',
    'security:high',
    'security/high',
    'security-critical',
  ])('blocks the legal hard-veto class spelling %s', (findingClass) => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass }),
      convergence(7),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]?.hardVeto).toBe(true);
    expect(result.projection.findingLedger.hardVetoFindingIds).toEqual([
      'candidate:candidate-1',
    ]);
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
    });
  });

  it.each([
    'build',
    'regression',
    'schema',
    'security',
  ])('blocks the exact hard-veto root %s', (findingClass) => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass }),
      convergence(7),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]?.hardVeto).toBe(true);
    expect(result.projection.reviewLoop.eligibility).toBe('INDETERMINATE');
  });

  it.each([
    'securityfoo',
    'insecurity',
  ])('does not false-match the non-separated class %s', (findingClass) => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass }),
      convergence(7),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]?.hardVeto).toBe(false);
    expect(result.projection.findingLedger.hardVetoFindingIds).toEqual([]);
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
    });
  });

  it('keeps a hard security veto blocking despite perfect weighted signals', () => {
    const result = foldDeepReviewEvents(successfulEvents({ findingClass: 'security' }).slice(0, 10));
    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;

    const [finding] = result.projection.findingLedger.findings;
    expect(finding).toMatchObject({
      impact: 0.5,
      confidence: 0.8,
      reachability: 0.8,
      exploitability: 0.5,
      evidenceStrength: 1,
      evidenceScope: 'direct',
      lifecycle: 'accepted',
      hardVeto: true,
      presentationSeverity: 'P0',
    });
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
    });
    expect(result.projection.reviewLoop.blockerIds).toContain('hard-veto:finding-1');
  });

  it('rejects adjudication evidence borrowed from another candidate without clearing the veto', () => {
    const prefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-normal',
        evidenceId: 'evidence-normal',
      }),
      findingCandidate(7, {
        candidateId: 'candidate-security',
        evidenceId: 'evidence-security',
        findingClass: 'security',
      }),
      evidenceObserved(8, {
        candidateId: 'candidate-normal',
        evidenceId: 'evidence-normal',
      }),
    ];
    const borrowedEvidence = adjudication(9, {
      candidateId: 'candidate-security',
      evidenceId: 'evidence-normal',
      findingId: 'finding-security',
    });

    expect(() => foldDeepReviewEvents([
      ...prefix,
      borrowedEvidence,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.evidenceRefs',
    }));

    const blocked = foldDeepReviewEvents([...prefix, convergence(9)]);
    expect(blocked.outcome).toBe('projected');
    if (blocked.outcome !== 'projected') return;
    expect(blocked.projection.findingLedger.hardVetoFindingIds).toEqual([
      'candidate:candidate-security',
    ]);
    expect(blocked.projection.reviewLoop.eligibility).toBe('INDETERMINATE');
  });

  it('rejects an adjudication predecessor borrowed from another finding', () => {
    const prefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      adjudication(8, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingId: 'finding-a',
      }),
      findingCandidate(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      adjudication(11, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-b',
      }),
    ];

    expect(() => foldDeepReviewEvents([
      ...prefix,
      adjudication(12, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-b',
        predecessorAdjudicationEventId: 'event-8',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.predecessorEventId',
    }));
  });

  it('rejects two candidates that claim the same finding identity without cross-linking artifacts', () => {
    const prefix = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingClass: 'security',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      adjudication(8, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingId: 'finding-collide',
      }),
      findingCandidate(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
    ]);
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const firstAdjudication = prefix.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('adjudication', {
        candidateId: 'candidate-a',
        findingId: 'finding-collide',
      }),
    );
    expect(firstAdjudication).toMatchObject({
      availability: 'available',
      reviewedInputIdentity: 'candidate-a',
      supersededByArtifactIds: [],
      supersedesArtifactIds: [],
    });

    expect(() => foldDeepReviewEvents([
      adjudication(11, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-collide',
      }),
    ], { checkpoint: prefix.checkpoint })).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.findingId',
    }));
    expect(firstAdjudication?.availability).toBe('available');
    expect(firstAdjudication?.supersededByArtifactIds).toEqual([]);
  });

  it('rejects a re-adjudication that renames the candidate finding identity', () => {
    expect(() => foldDeepReviewEvents([
      ...successfulEvents().slice(0, 8),
      adjudication(9, {
        findingId: 'finding-renamed',
        predecessorAdjudicationEventId: 'event-8',
        transition: 'finding-reaffirmed',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.findingId',
    }));
  });

  it('accepts own-candidate evidence and a stable own-finding adjudication identity', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      adjudication(),
      adjudication(9, { predecessorAdjudicationEventId: 'event-8' }),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]).toMatchObject({
      candidateId: 'candidate-1',
      findingId: 'finding-1',
      evidenceRefs: ['evidence-1'],
      adjudicationEventId: 'event-9',
      predecessorEventId: 'event-8',
    });
    const adjudicationArtifacts = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('adjudication', {
        candidateId: 'candidate-1',
        findingId: 'finding-1',
      }),
    );
    expect(adjudicationArtifacts).toHaveLength(2);
    expect(adjudicationArtifacts[0]).toMatchObject({
      availability: 'superseded',
      supersededByArtifactIds: [adjudicationArtifacts[1]?.artifactId],
    });
    expect(adjudicationArtifacts[1]).toMatchObject({
      availability: 'available',
      supersedesArtifactIds: [adjudicationArtifacts[0]?.artifactId],
    });
  });

  it('accepts distinct finding identities and rejects a corrupt many-to-one projection', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingClass: 'security',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      adjudication(8, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingId: 'finding-a',
      }),
      findingCandidate(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      adjudication(11, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-b',
      }),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings.map(
      (finding) => [finding.candidateId, finding.findingId],
    )).toEqual([
      ['candidate-a', 'finding-a'],
      ['candidate-b', 'finding-b'],
    ]);
    const adjudicationArtifacts = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.artifactKind === 'adjudication',
    );
    expect(adjudicationArtifacts).toEqual([
      expect.objectContaining({
        logicalArtifactId: logicalArtifactId('adjudication', {
          candidateId: 'candidate-a',
          findingId: 'finding-a',
        }),
        availability: 'available',
        reviewedInputIdentity: 'candidate-a',
        supersededByArtifactIds: [],
        supersedesArtifactIds: [],
      }),
      expect.objectContaining({
        logicalArtifactId: logicalArtifactId('adjudication', {
          candidateId: 'candidate-b',
          findingId: 'finding-b',
        }),
        availability: 'available',
        reviewedInputIdentity: 'candidate-b',
        supersededByArtifactIds: [],
        supersedesArtifactIds: [],
      }),
    ]);

    const corruptFindingIdentity = {
      ...result.projection,
      findingLedger: {
        ...result.projection.findingLedger,
        findings: result.projection.findingLedger.findings.map((finding) => (
          finding.candidateId === 'candidate-b'
            ? { ...finding, findingId: 'finding-a' }
            : finding
        )),
      },
    };
    expect(() => assertDeepReviewProjectionState(corruptFindingIdentity)).toThrowError(
      expect.objectContaining({
        code: 'referential-integrity',
        field: 'findingLedger.findings.findingId',
      }),
    );

    const corruptEvidenceIdentity = {
      ...result.projection,
      findingLedger: {
        ...result.projection.findingLedger,
        evidence: result.projection.findingLedger.evidence.map((evidence) => (
          evidence.candidateId === 'candidate-b'
            ? { ...evidence, evidenceId: 'evidence-a' }
            : evidence
        )),
      },
    };
    expect(() => assertDeepReviewProjectionState(corruptEvidenceIdentity)).toThrowError(
      expect.objectContaining({
        code: 'referential-integrity',
        field: 'findingLedger.evidence.evidenceId',
      }),
    );
  });

  it('rejects a null predecessor on re-adjudication without clearing the hard veto', () => {
    const acceptedVeto = successfulEvents({ findingClass: 'security' }).slice(0, 8);

    expect(() => foldDeepReviewEvents([
      ...acceptedVeto,
      adjudication(9, {
        adjudicationOutcome: 'disproved',
        predecessorAdjudicationEventId: null,
        transition: 'finding-reaffirmed',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.predecessorEventId',
    }));

    const blocked = foldDeepReviewEvents([...acceptedVeto, convergence(9)]);
    expect(blocked.outcome).toBe('projected');
    if (blocked.outcome !== 'projected') return;
    expect(blocked.projection.findingLedger.hardVetoFindingIds).toEqual(['finding-1']);
    expect(blocked.projection.reviewLoop).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
    });
    expect(blocked.projection.reviewLoop.blockerIds).toContain('hard-veto:finding-1');
  });

  it('rejects a wrong non-null predecessor on re-adjudication', () => {
    const acceptedVeto = successfulEvents({ findingClass: 'security' }).slice(0, 8);

    expect(() => foldDeepReviewEvents([
      ...acceptedVeto,
      adjudication(9, {
        adjudicationOutcome: 'disproved',
        predecessorAdjudicationEventId: 'event-7',
        transition: 'finding-reaffirmed',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.predecessorEventId',
    }));
  });

  it('accepts re-adjudication chained to the current adjudication', () => {
    const result = foldDeepReviewEvents([
      ...successfulEvents({ findingClass: 'security' }).slice(0, 8),
      adjudication(9, {
        adjudicationOutcome: 'disproved',
        predecessorAdjudicationEventId: 'event-8',
        transition: 'finding-reaffirmed',
      }),
      convergence(10),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]).toMatchObject({
      adjudicationEventId: 'event-9',
      predecessorEventId: 'event-8',
      adjudicationOutcome: 'disproved',
      lifecycle: 'dismissed',
    });
    expect(result.projection.findingLedger.hardVetoFindingIds).toEqual([]);
    expect(result.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
    });
  });

  it('accepts a null predecessor for the first adjudication', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass: 'security' }),
      evidenceObserved(),
      adjudication(8, { predecessorAdjudicationEventId: null }),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]).toMatchObject({
      adjudicationEventId: 'event-8',
      predecessorEventId: null,
      lifecycle: 'accepted',
    });
  });

  it('rejects a source pass borrowed from another iteration', () => {
    const otherIterationPass = event(
      'deep_review.dimension_pass_completed',
      6,
      {
        ...passCompleted().payload.scope,
        iterationId: 'iteration-2',
      },
      passCompleted().payload.data,
    );

    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      otherIterationPass,
      findingCandidate(7, { sourcePassEventId: 'event-6' }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.sourcePassEventId',
    }));
  });

  it('rejects evidence supersession borrowed from another candidate', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      findingCandidate(8, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceReconciled(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        supersedesEvidenceEventId: 'event-7',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.evidence.supersedesEvidenceEventId',
    }));
  });

  it('accepts evidence supersession owned by the same candidate', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      evidenceReconciled(),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.evidence).toHaveLength(2);
    expect(result.projection.findingLedger.evidence[1]).toMatchObject({
      candidateId: 'candidate-1',
      evidenceId: 'evidence-1',
      supersedesEvidenceEventId: 'event-7',
    });
    const evidenceArtifacts = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('evidence', {
        candidateId: 'candidate-1',
        evidenceId: 'evidence-1',
      }),
    );
    expect(evidenceArtifacts).toHaveLength(2);
    expect(evidenceArtifacts[0]).toMatchObject({
      producerEventId: 'event-7',
      availability: 'superseded',
      supersededByArtifactIds: [evidenceArtifacts[1]?.artifactId],
    });
    expect(evidenceArtifacts[1]).toMatchObject({
      producerEventId: 'event-8',
      availability: 'available',
      supersedesArtifactIds: [evidenceArtifacts[0]?.artifactId],
    });
  });

  it.each([
    'aaaa-evidence',
    'zzzzz-evidence',
  ])('preserves cross-stream evidence reconciliation lineage from %s', (streamId) => {
    const auxiliaryReconciliation = event(
      'deep_review.evidence_reconciled',
      1,
      evidenceReconciled().payload.scope,
      evidenceReconciled().payload.data,
      undefined,
      {
        eventId: 'auxiliary-evidence-1',
        streamId,
        streamSequence: 1,
      },
    );
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      auxiliaryReconciliation,
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.evidence).toEqual([
      expect.objectContaining({
        producerEventId: 'event-7',
        supersedesEvidenceEventId: null,
      }),
      expect.objectContaining({
        producerEventId: 'auxiliary-evidence-1',
        supersedesEvidenceEventId: 'event-7',
      }),
    ]);
    const revisions = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('evidence', {
        evidenceId: 'evidence-1',
      }),
    );
    expect(revisions).toHaveLength(2);
    expect(revisions[0]).toMatchObject({
      producerEventId: 'event-7',
      availability: 'superseded',
      supersededByArtifactIds: [revisions[1]?.artifactId],
    });
    expect(revisions[1]).toMatchObject({
      producerEventId: 'auxiliary-evidence-1',
      availability: 'available',
      supersedesArtifactIds: [revisions[0]?.artifactId],
    });
  });

  it.each([
    'aaaa-adjudication',
    'zzzzz-adjudication',
  ])('preserves cross-stream re-adjudication lineage from %s', (streamId) => {
    const auxiliaryReadjudication = event(
      'deep_review.claim_adjudication_recorded',
      1,
      adjudication().payload.scope,
      adjudication(9, {
        predecessorAdjudicationEventId: 'event-8',
        transition: 'finding-reaffirmed',
      }).payload.data,
      undefined,
      {
        eventId: 'auxiliary-adjudication-1',
        streamId,
        streamSequence: 1,
      },
    );
    const result = foldDeepReviewEvents([
      ...successfulEvents().slice(0, 8),
      auxiliaryReadjudication,
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.findings[0]).toMatchObject({
      adjudicationEventId: 'auxiliary-adjudication-1',
      predecessorEventId: 'event-8',
    });
    const revisions = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('adjudication', {
        findingId: 'finding-1',
      }),
    );
    expect(revisions).toHaveLength(2);
    expect(revisions[0]).toMatchObject({
      producerEventId: 'event-8',
      availability: 'superseded',
      supersededByArtifactIds: [revisions[1]?.artifactId],
    });
    expect(revisions[1]).toMatchObject({
      producerEventId: 'auxiliary-adjudication-1',
      availability: 'available',
      supersedesArtifactIds: [revisions[0]?.artifactId],
    });
  });

  it('replays a full valid genesis history with an earlier-sorting auxiliary stream', () => {
    const events = successfulEvents();
    const auxiliaryReadjudication = event(
      'deep_review.claim_adjudication_recorded',
      1,
      adjudication().payload.scope,
      adjudication(9, {
        predecessorAdjudicationEventId: 'event-8',
        transition: 'finding-reaffirmed',
      }).payload.data,
      undefined,
      {
        eventId: 'auxiliary-adjudication-1',
        streamId: 'aaaa-adjudication',
        streamSequence: 1,
      },
    );
    const result = foldDeepReviewEvents([
      ...events.slice(0, 8),
      auxiliaryReadjudication,
      ...events.slice(8),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.run.initializationEventId).toBe('event-1');
    expect(result.projection.seenEvents[0]).toMatchObject({
      eventId: 'event-1',
      stem: 'deep_review.run_initialized',
    });
    expect(result.projection.status.state).toBe('complete');
  });

  it('retains same-stream reconciliation lineage after later projection events', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      evidenceReconciled(),
      reviewDepth(9),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    const revisions = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('evidence', {
        evidenceId: 'evidence-1',
      }),
    );
    expect(revisions).toHaveLength(2);
    expect(revisions[0]?.supersededByArtifactIds).toEqual([revisions[1]?.artifactId]);
    expect(revisions[1]?.supersedesArtifactIds).toEqual([revisions[0]?.artifactId]);
  });

  it('keeps run-level report and continuity identities scoped to the established stream', () => {
    const result = foldDeepReviewEvents(artifactPrefixEvents());

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    const report = result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-8',
    );
    const continuity = result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-10',
    );
    expect(report?.logicalArtifactId).toBe(logicalArtifactId('review-report', {}));
    expect(continuity?.logicalArtifactId).toBe(logicalArtifactId('continuity-save', {
      targetPacket: 'system-deep-loop/target',
    }));
  });

  it('never groups unrelated evidence entities', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        evidenceRefs: ['evidence-1', 'evidence-2'],
      }),
      evidenceObserved(),
      evidenceObserved(8, { evidenceId: 'evidence-2' }),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    const first = result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-7',
    );
    const second = result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-8',
    );
    expect(first?.logicalArtifactId).toBe(logicalArtifactId('evidence', {
      evidenceId: 'evidence-1',
    }));
    expect(second?.logicalArtifactId).toBe(logicalArtifactId('evidence', {
      evidenceId: 'evidence-2',
    }));
    expect(second?.logicalArtifactId).not.toBe(first?.logicalArtifactId);
    expect(first?.supersededByArtifactIds).toEqual([]);
    expect(second?.supersedesArtifactIds).toEqual([]);
  });

  it('does not let an auxiliary-stream report supersede the run report', () => {
    const prefix = foldDeepReviewEvents(artifactPrefixEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const auxiliaryReport = event(
      'deep_review.review_report_committed',
      1,
      reportCommitted().payload.scope,
      {
        ...reportCommitted().payload.data,
        reportDigest: digest('auxiliary-report'),
      },
      undefined,
      {
        eventId: 'auxiliary-report-1',
        streamId: 'zzzzz-auxiliary',
        streamSequence: 1,
      },
    );
    const injected = foldDeepReviewEvents([auxiliaryReport], {
      checkpoint: prefix.checkpoint,
    });

    expect(injected.outcome).toBe('projected');
    if (injected.outcome !== 'projected') return;
    expect(injected.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-8',
    )).toMatchObject({
      logicalArtifactId: logicalArtifactId('review-report', {}),
      availability: 'available',
      supersededByArtifactIds: [],
    });
    expect(injected.projection.artifactIndex.artifacts.some(
      (artifact) => artifact.producerEventId === 'auxiliary-report-1',
    )).toBe(false);
  });

  it('accepts honest completion after an auxiliary-stream report is ignored', () => {
    const prefix = foldDeepReviewEvents(artifactPrefixEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const auxiliaryReport = event(
      'deep_review.review_report_committed',
      1,
      reportCommitted().payload.scope,
      {
        ...reportCommitted().payload.data,
        reportDigest: digest('auxiliary-report'),
      },
      undefined,
      {
        eventId: 'auxiliary-report-1',
        streamId: 'zzzzz-auxiliary',
        streamSequence: 1,
      },
    );
    const injected = foldDeepReviewEvents([auxiliaryReport], {
      checkpoint: prefix.checkpoint,
    });
    expect(injected.outcome).toBe('projected');
    if (injected.outcome !== 'projected') return;

    const completed = foldDeepReviewEvents([
      runCompleted(11, {
        convergenceEventId: 'event-6',
        synthesisEventId: 'event-7',
        reportEventId: 'event-8',
        continuityEventId: 'event-10',
      }),
    ], { checkpoint: injected.checkpoint });

    expect(completed.outcome).toBe('projected');
    if (completed.outcome !== 'projected') return;
    expect(completed.projection.status.state).toBe('complete');
    expect(completed.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-8',
    )?.availability).toBe('available');
  });

  it('does not let auxiliary-stream continuity supersede run continuity', () => {
    const prefix = foldDeepReviewEvents(artifactPrefixEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const auxiliaryContinuity = event(
      'deep_review.continuity_save_completed',
      1,
      continuityCompleted().payload.scope,
      {
        ...continuityCompleted().payload.data,
        continuityFingerprint: digest('auxiliary-continuity'),
      },
      undefined,
      {
        eventId: 'auxiliary-continuity-1',
        streamId: 'zzzzz-auxiliary',
        streamSequence: 1,
      },
    );
    const injected = foldDeepReviewEvents([auxiliaryContinuity], {
      checkpoint: prefix.checkpoint,
    });

    expect(injected.outcome).toBe('projected');
    if (injected.outcome !== 'projected') return;
    expect(injected.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-10',
    )).toMatchObject({
      logicalArtifactId: logicalArtifactId('continuity-save', {
        targetPacket: 'system-deep-loop/target',
      }),
      availability: 'available',
      supersededByArtifactIds: [],
    });
    expect(injected.projection.artifactIndex.artifacts.some(
      (artifact) => artifact.producerEventId === 'auxiliary-continuity-1',
    )).toBe(false);
  });

  it('supersedes an earlier report with a genuine established-stream revision', () => {
    const prefix = foldDeepReviewEvents(artifactPrefixEvents());
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const laterReport = event(
      'deep_review.review_report_committed',
      11,
      {
        ...reportCommitted().payload.scope,
        reportRevisionId: 'report-2',
      },
      {
        ...reportCommitted().payload.data,
        reportDigest: digest('report-revision-2'),
      },
    );
    const revised = foldDeepReviewEvents([laterReport], {
      checkpoint: prefix.checkpoint,
    });

    expect(revised.outcome).toBe('projected');
    if (revised.outcome !== 'projected') return;
    const reports = revised.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('review-report', {}),
    );
    expect(reports).toHaveLength(2);
    expect(reports[0]).toMatchObject({
      producerEventId: 'event-8',
      availability: 'superseded',
      supersededByArtifactIds: [reports[1]?.artifactId],
    });
    expect(reports[1]).toMatchObject({
      producerEventId: 'event-11',
      availability: 'available',
      supersedesArtifactIds: [reports[0]?.artifactId],
    });
  });

  it('never groups report artifacts from different runs', () => {
    const reportData = reportCommitted().payload.data;
    const first = foldDeepReviewEvents([
      event(
        'deep_review.run_initialized',
        1,
        { runId: 'run-a', sessionId: 'session-a', generation: 1 },
        runInitialized().payload.data,
        undefined,
        { eventId: 'run-a-1', streamId: 'shared-stream', streamSequence: 1 },
      ),
      event(
        'deep_review.review_report_committed',
        2,
        { runId: 'run-a', sessionId: 'session-a', reportRevisionId: 'report-1' },
        reportData,
        undefined,
        { eventId: 'run-a-2', streamId: 'shared-stream', streamSequence: 2 },
      ),
    ]);
    const second = foldDeepReviewEvents([
      event(
        'deep_review.run_initialized',
        1,
        { runId: 'run-b', sessionId: 'session-b', generation: 1 },
        runInitialized().payload.data,
        undefined,
        { eventId: 'run-b-1', streamId: 'shared-stream', streamSequence: 1 },
      ),
      event(
        'deep_review.review_report_committed',
        2,
        { runId: 'run-b', sessionId: 'session-b', reportRevisionId: 'report-1' },
        reportData,
        undefined,
        { eventId: 'run-b-2', streamId: 'shared-stream', streamSequence: 2 },
      ),
    ]);

    expect(first.outcome).toBe('projected');
    expect(second.outcome).toBe('projected');
    if (first.outcome !== 'projected' || second.outcome !== 'projected') return;
    const firstReport = first.projection.artifactIndex.artifacts[0];
    const secondReport = second.projection.artifactIndex.artifacts[0];
    expect(firstReport?.logicalArtifactId).toBe(logicalArtifactId(
      'review-report',
      {},
      { runId: 'run-a', sessionId: 'session-a', streamId: 'shared-stream' },
    ));
    expect(secondReport?.logicalArtifactId).toBe(logicalArtifactId(
      'review-report',
      {},
      { runId: 'run-b', sessionId: 'session-b', streamId: 'shared-stream' },
    ));
    expect(secondReport?.logicalArtifactId).not.toBe(firstReport?.logicalArtifactId);
  });

  it('keeps digit-boundary artifact supersession canonical and idempotent', () => {
    const prefixEvents = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      synthesisStarted(7),
      reportCommitted(8),
      continuityRequested(9),
      continuityCompleted(10),
    ];
    const prefix = foldDeepReviewEvents(prefixEvents);
    expect(prefix.outcome).toBe('projected');
    if (prefix.outcome !== 'projected') return;

    const continuityBefore = prefix.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('continuity-save', {
        targetPacket: 'system-deep-loop/target',
      }),
    );
    const requested = continuityBefore.find(
      (artifact) => artifact.producerEventId === 'event-9',
    );
    const completed = continuityBefore.find(
      (artifact) => artifact.producerEventId === 'event-10',
    );
    expect(requested).toMatchObject({
      availability: 'superseded',
      supersededByArtifactIds: [completed?.artifactId],
    });
    expect(completed).toMatchObject({
      availability: 'available',
      supersedesArtifactIds: [requested?.artifactId],
    });

    const unrelated = event(
      'deep_review.continuity_save_requested',
      11,
      continuityRequested().payload.scope,
      {
        ...continuityRequested().payload.data,
        targetPacket: 'system-deep-loop/unrelated',
        continuityPayloadDigest: digest('unrelated-continuity'),
      },
    );
    const incremental = foldDeepReviewEvents([unrelated], {
      checkpoint: prefix.checkpoint,
    });
    const fullReplay = foldDeepReviewEvents([...prefixEvents, unrelated]);
    const repeatedReplay = foldDeepReviewEvents([...prefixEvents, unrelated]);
    expect(incremental.outcome).toBe('projected');
    expect(fullReplay.outcome).toBe('projected');
    expect(repeatedReplay.outcome).toBe('projected');
    if (incremental.outcome !== 'projected'
      || fullReplay.outcome !== 'projected'
      || repeatedReplay.outcome !== 'projected') return;

    const continuityAfter = incremental.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.logicalArtifactId === logicalArtifactId('continuity-save', {
        targetPacket: 'system-deep-loop/target',
      }),
    );
    expect(continuityAfter).toEqual(continuityBefore);
    expect(fullReplay.projection.artifactIndex).toEqual(
      incremental.projection.artifactIndex,
    );
    expect(canonicalBytes(repeatedReplay.projection.artifactIndex as JsonObject)).toEqual(
      canonicalBytes(fullReplay.projection.artifactIndex as JsonObject),
    );
  });

  it('accepts completion backed by the event-9 to event-10 continuity revision', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      convergence(6),
      synthesisStarted(7),
      reportCommitted(8),
      continuityRequested(9),
      continuityCompleted(10),
      runCompleted(11, {
        convergenceEventId: 'event-6',
        synthesisEventId: 'event-7',
        reportEventId: 'event-8',
        continuityEventId: 'event-10',
      }),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.status.state).toBe('complete');
    expect(result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-10',
    )?.availability).toBe('available');
  });

  it('rejects an evidence identity collision across candidates', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceRefs: ['evidence-declared-a'],
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      findingCandidate(8, {
        candidateId: 'candidate-b',
        evidenceRefs: ['evidence-declared-b'],
      }),
      evidenceObserved(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-a',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.evidence.evidenceId',
    }));
  });

  it('rejects an evidence reconciliation that renames its logical identity', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      evidenceReconciled(8, {
        evidenceId: 'evidence-renamed',
        supersedesEvidenceEventId: 'event-7',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.evidence.evidenceId',
    }));
  });

  it('rejects finding lineage that borrows another finding\'s predecessor', () => {
    const prefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      adjudication(8, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingId: 'finding-a',
      }),
      findingCandidate(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      adjudication(11, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-b',
      }),
    ];

    expect(() => foldDeepReviewEvents([
      ...prefix,
      findingLineage(12, {
        findingId: 'finding-b',
        predecessorEventRef: 'event-8',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.lineage.predecessorEventId',
    }));
  });

  it('accepts finding lineage backed by the same finding\'s predecessor', () => {
    const result = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      adjudication(),
      findingLineage(),
    ]);

    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.findingLedger.lineage).toEqual([
      expect.objectContaining({
        findingId: 'finding-1',
        predecessorEventId: 'event-8',
      }),
    ]);
  });

  it('rejects a borrowed adjudication without clearing the target hard veto', () => {
    const prefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-normal',
        evidenceId: 'evidence-normal',
      }),
      findingCandidate(7, {
        candidateId: 'candidate-security',
        evidenceId: 'evidence-security',
        findingClass: 'security',
      }),
      evidenceObserved(8, {
        candidateId: 'candidate-normal',
        evidenceId: 'evidence-normal',
      }),
      evidenceObserved(9, {
        candidateId: 'candidate-security',
        evidenceId: 'evidence-security',
      }),
      adjudication(10, {
        candidateId: 'candidate-normal',
        evidenceId: 'evidence-normal',
        findingId: 'finding-normal',
      }),
    ];
    const borrowedResolution = findingFixed(11, {
      findingId: 'candidate:candidate-security',
      adjudicationEventId: 'event-10',
      priorState: 'candidate',
    });

    expect(() => foldDeepReviewEvents([
      ...prefix,
      borrowedResolution,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.adjudicationEventId',
    }));

    const blocked = foldDeepReviewEvents([...prefix, convergence(11)]);
    expect(blocked.outcome).toBe('projected');
    if (blocked.outcome !== 'projected') return;
    expect(blocked.projection.findingLedger.hardVetoFindingIds).toEqual([
      'candidate:candidate-security',
    ]);
    expect(blocked.projection.reviewLoop).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
    });
    expect(blocked.projection.reviewLoop.blockerIds).toContain(
      'hard-veto:candidate:candidate-security',
    );
  });

  it('rejects a state predecessor borrowed from another finding', () => {
    const prefix = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      evidenceObserved(7, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
      }),
      adjudication(8, {
        candidateId: 'candidate-a',
        evidenceId: 'evidence-a',
        findingId: 'finding-a',
      }),
      findingCandidate(9, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      evidenceObserved(10, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
      }),
      adjudication(11, {
        candidateId: 'candidate-b',
        evidenceId: 'evidence-b',
        findingId: 'finding-b',
      }),
    ];

    expect(() => foldDeepReviewEvents([
      ...prefix,
      findingFixed(12, {
        findingId: 'finding-b',
        adjudicationEventId: 'event-11',
      }),
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'findingLedger.findings.predecessorEventId',
    }));
  });

  it('accepts a hard-veto resolution backed by that finding\'s own adjudication', () => {
    const resolved = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass: 'security' }),
      evidenceObserved(),
      adjudication(),
      findingFixed(),
      convergence(),
    ]);

    expect(resolved.outcome).toBe('projected');
    if (resolved.outcome !== 'projected') return;
    expect(resolved.projection.findingLedger.hardVetoFindingIds).toEqual([]);
    expect(resolved.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      blockerIds: [],
    });
  });

  it('rejects a finding transition whose prior state differs from the projection', () => {
    expect(() => foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass: 'security' }),
      evidenceObserved(),
      adjudication(),
      findingFixed(9, { priorState: 'candidate' }),
    ])).toThrowError(expect.objectContaining({
      code: 'projection-field-invalid',
      field: 'findingLedger.findings.lifecycle',
    }));
  });

  it('rejects terminal evidence that exists globally but belongs to another candidate', () => {
    const result = foldDeepReviewEvents(successfulEvents());
    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    const borrowedEvidence = {
      ...result.projection,
      findingLedger: {
        ...result.projection.findingLedger,
        evidence: result.projection.findingLedger.evidence.map((evidence) => ({
          ...evidence,
          candidateId: 'candidate-other',
        })),
      },
    };

    expect(() => assertDeepReviewProjectionState(borrowedEvidence)).toThrowError(
      expect.objectContaining({
        code: 'referential-integrity',
        field: 'findingLedger.findings.evidenceRefs',
      }),
    );
  });

  it('blocks an unadjudicated hard-veto candidate until a typed resolution closes it', () => {
    const unresolved = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass: 'security' }),
      convergence(7),
    ]);
    expect(unresolved.outcome).toBe('projected');
    if (unresolved.outcome !== 'projected') return;
    expect(unresolved.projection.findingLedger.hardVetoFindingIds).toEqual([
      'candidate:candidate-1',
    ]);
    expect(unresolved.projection.reviewLoop).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
    });
    expect(unresolved.projection.reviewLoop.blockerIds).toContain(
      'hard-veto:candidate:candidate-1',
    );

    const resolved = foldDeepReviewEvents([
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(6, { findingClass: 'security' }),
      evidenceObserved(),
      adjudication(),
      findingFixed(),
      convergence(),
    ]);
    expect(resolved.outcome).toBe('projected');
    if (resolved.outcome !== 'projected') return;
    expect(resolved.projection.findingLedger.hardVetoFindingIds).toEqual([]);
    expect(resolved.projection.reviewLoop).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      blockerIds: [],
    });
  });

  it('drives the verified-event reducer surface to the pure-fold oracle', () => {
    const events = successfulEvents();
    const initial = createDeepReviewProjectionState();
    const verified = verifiedEvent(events[0]);

    expect(() => verifyDeepReviewReducerSurface(
      DEEP_REVIEW_REDUCER_SURFACE,
      verified,
      initial,
    )).not.toThrow();
    expect(reduceDeepReviewVerifiedEvent(verified, initial)).toEqual(
      DEEP_REVIEW_REDUCER_SURFACE.reduce(verified, initial),
    );

    let reduced = initial;
    for (const typedEvent of events) {
      reduced = reduceDeepReviewVerifiedEvent(
        verifiedEvent(typedEvent),
        reduced,
      ).state;
    }
    const oracle = foldDeepReviewEvents(events);
    expect(oracle.outcome).toBe('projected');
    if (oracle.outcome !== 'projected') return;
    expect(reduced).toEqual(oracle.projection);
  });

  it('is deterministic for one causal multi-stream sequence and rejects invalid reordering', () => {
    const auxiliaryReconciliation = event(
      'deep_review.evidence_reconciled',
      1,
      evidenceReconciled().payload.scope,
      evidenceReconciled().payload.data,
      undefined,
      {
        eventId: 'auxiliary-evidence-1',
        streamId: 'aaaa-evidence',
        streamSequence: 1,
      },
    );
    const events = [
      runInitialized(),
      scopeResolved(),
      dimensionOrdered(),
      passStarted(),
      passCompleted(),
      findingCandidate(),
      evidenceObserved(),
      auxiliaryReconciliation,
    ];
    const first = foldDeepReviewEvents(events);
    const repeated = foldDeepReviewEvents(events);
    const reordered = foldDeepReviewEvents([...events].reverse());

    expect(first.outcome).toBe('projected');
    expect(repeated.outcome).toBe('projected');
    if (first.outcome !== 'projected' || repeated.outcome !== 'projected') return;
    expect(canonicalBytes(repeated.projection as JsonObject)).toEqual(
      canonicalBytes(first.projection as JsonObject),
    );
    expect(repeated.integrityDigest).toBe(first.integrityDigest);
    expect(reordered).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('rejects an otherwise valid event submitted before run initialization', () => {
    const auxiliaryScope = event(
      'deep_review.scope_resolved',
      1,
      scopeResolved().payload.scope,
      scopeResolved().payload.data,
      undefined,
      {
        eventId: 'auxiliary-scope-1',
        streamId: 'aaaa-scope',
        streamSequence: 1,
      },
    );

    expect(() => foldDeepReviewEvents([
      auxiliaryScope,
      runInitialized(),
    ])).toThrowError(expect.objectContaining({
      code: 'run-not-initialized',
      field: 'run',
    }));
  });

  it('projects the complete canonical legacy comparison fixture field by field', () => {
    const result = foldDeepReviewEvents(successfulEvents().slice(0, 10));
    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;

    const view = projectDeepReviewLegacyView(result.projection);
    expect(view).toMatchInlineSnapshot(`
      {
        "artifacts": [
          {
            "artifactId": "adjudication:a9de014717459f1801650531fcd1c79c752dd3d59d5ab03f4e2c7b26e4d39b6a:90efd2e2bdfbef28ad278591745bf1d2fa690f31ea79fb9f2907da341fdd5cd4",
            "artifactKind": "adjudication",
            "availability": "available",
            "contentDigest": "90efd2e2bdfbef28ad278591745bf1d2fa690f31ea79fb9f2907da341fdd5cd4",
            "logicalArtifactId": "adjudication:2df4fa83376f9d44289a613dfb0ee32ad43d79e1e13421e7f1205fd015f24a95",
            "producerEventId": "event-8",
            "reviewedInputIdentity": "candidate-1",
            "supersededByArtifactIds": [],
            "supersedesArtifactIds": [],
          },
          {
            "artifactId": "evidence:49760e9a2f28bc07e6847e0191c8008577a9b35da8b2e49d8256615abf3acba1:a87e68ffbd5e5c954a0838546bcdd66606963a89cc25dbd9648a6885b4b10de3",
            "artifactKind": "verification-output",
            "availability": "available",
            "contentDigest": "a87e68ffbd5e5c954a0838546bcdd66606963a89cc25dbd9648a6885b4b10de3",
            "logicalArtifactId": "evidence:c6672ef352d87bcf6a9742a7d326add19b595903b930a4d58e44c097a778e5e0",
            "producerEventId": "event-7",
            "reviewedInputIdentity": "revision-1",
            "supersededByArtifactIds": [],
            "supersedesArtifactIds": [],
          },
          {
            "artifactId": "finding:6a405679947d1a391cd4a838966fd73f552e0cfff87308840871660ed87a9cc9:e847633fb86bae1aa88967ca07d1f1418b60097d5385bd844d79f6f6bd803a90",
            "artifactKind": "raw-finding",
            "availability": "available",
            "contentDigest": "e847633fb86bae1aa88967ca07d1f1418b60097d5385bd844d79f6f6bd803a90",
            "logicalArtifactId": "finding:cacf8059bbf5bfcbdd398af2942e76d333add7afa45b44cff87a398a5ab3af6d",
            "producerEventId": "event-6",
            "reviewedInputIdentity": "event-5",
            "supersededByArtifactIds": [],
            "supersedesArtifactIds": [],
          },
        ],
        "authority": "shadow-only",
        "coverage": [
          {
            "dimensionId": "correctness",
            "iterationId": "iteration-1",
            "passNumber": 1,
            "producerEventId": "event-5",
            "required": true,
            "searchCoverageDigest": "3471c4f6a003beb737096159d6d6b09e3bc83b0522a4210265e7cdf8a37312ea",
            "status": "complete",
          },
        ],
        "findings": [
          {
            "adjudicationEventId": "event-8",
            "adjudicationOutcome": "accepted",
            "candidateEventId": "event-6",
            "candidateId": "candidate-1",
            "claimDigest": "90efd2e2bdfbef28ad278591745bf1d2fa690f31ea79fb9f2907da341fdd5cd4",
            "confidence": 0.8,
            "dimensionId": "correctness",
            "evidenceRefs": [
              "evidence-1",
            ],
            "evidenceScope": "direct",
            "evidenceStrength": 1,
            "evidenceType": "test",
            "exploitability": 0.5,
            "findingClass": "correctness-defect",
            "findingId": "finding-1",
            "hardVeto": false,
            "impact": 0.5,
            "lifecycle": "accepted",
            "predecessorEventId": null,
            "presentationSeverity": "P2",
            "reachability": 0.8,
            "semanticFingerprint": {
              "algorithmVersion": "semantic-fingerprint@1",
              "baselineState": "present",
              "normalizedContextDigest": "bfa622f7f14540190770e0dfa64bc567c816641a0d00cb73b86345eca17d4d12",
              "programSliceDigest": "9f4360fdcf086f613d00e4c910e1023628063512e3259ab5a2655d8ad4413af3",
              "renameMapVersion": "rename-map@1",
              "semanticAnchorDigest": "b93a33c1d2efb92cfb86b246e2729a747f569f364a02caba72c1ef2e3d657d0b",
            },
            "sourcePassEventId": "event-5",
          },
        ],
        "iteration": "iteration-1",
        "legacyAuthority": "unchanged",
        "parityFingerprint": "070eb6a608c419dd99d046b9ac49f007cb5bea7e6f79263773f63ba866fa0a7e",
        "projectionHealth": "healthy",
        "status": "active",
        "terminalDecision": null,
      }
    `);
    expect(Object.isFrozen(view)).toBe(true);
    expect(view.authority).toBe('shadow-only');
    expect(view.legacyAuthority).toBe('unchanged');
  });

  it('exposes the expected projection schema version through a real projected result', () => {
    const result = foldDeepReviewEvents([runInitialized()]);
    expect(result.outcome).toBe('projected');
    if (result.outcome !== 'projected') return;
    expect(result.projection.schemaVersion).toBe(DEEP_REVIEW_PROJECTION_SCHEMA_VERSION);
    expect(() => {
      throw new DeepReviewReducerError('event-schema-invalid', 'fixture');
    }).toThrowError(DeepReviewReducerError);
  });
});
