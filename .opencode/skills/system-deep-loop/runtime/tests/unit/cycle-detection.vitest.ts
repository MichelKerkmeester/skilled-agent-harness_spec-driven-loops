// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Detection Contract Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CONTINUITY_SCHEMA_VERSION,
  ClaimEpistemicStatuses,
  ClaimLifecycleStates,
  claimProjectionDigest,
} from '../../lib/claim-continuity/index.js';
import {
  CYCLE_BLOCKER_REDUCER_VERSION,
  CYCLE_CLEARED_EVENT_TYPE,
  CYCLE_CONFIRMED_EVENT_TYPE,
  CYCLE_COVERAGE_GAIN_FLOOR_BPS,
  CYCLE_COVERAGE_REDUCER_VERSION,
  CYCLE_DETECTOR_POLICY,
  CYCLE_DETECTOR_POLICY_VERSION,
  CYCLE_HISTORY_WINDOW,
  CYCLE_MAX_PERIOD,
  CYCLE_MINIMUM_TRAVERSALS,
  CYCLE_OCCURRENCE_THRESHOLD,
  CYCLE_REPETITION_WINDOW,
  CycleClaimChangeKinds,
  CycleDetectionError,
  CycleDetectionErrorCodes,
  CycleEvaluationStatuses,
  CycleSignatureKinds,
  applyCycleObservation,
  createCycleBlockerSnapshot,
  createCycleCoverageSnapshot,
  createCycleHealthEventPayload,
  createCycleHealthEventRegistry,
  createCycleHealthPolicyRegistry,
  createCycleHistoryProjection,
  createCycleProgressVector,
  createMissingCycleProgressVector,
  cycleHealthWriteContext,
  cycleStoppingClockInput,
  evaluateCycleHistory,
  observeCycleInShadow,
  prepareCycleHealthEvent,
  projectCycleObservation,
  recordCycleHealthEvent,
  replayCycleHistory,
  resolveCycleDetectorPolicy,
  restoreCycleHistory,
} from '../../lib/cycle-detection/index.js';
import {
  ContinuityIdentityKinds,
  continuityDigest,
  identityRefFromTokenDigest,
} from '../../lib/deep-loop/continuity-identity/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  createNextFocusSourceSnapshot,
  deriveNextFocusCandidates,
  selectNextFocus,
} from '../../lib/next-focus/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  ClaimContinuityFrontier,
  ClaimContinuityRecord,
  ClaimContinuityState,
} from '../../lib/claim-continuity/index.js';
import type {
  CompleteCycleProgressVector,
  CycleClaimChange,
  CycleEvidence,
  CycleHistoryProjection,
  CycleObservation,
  CycleProgressVector,
} from '../../lib/cycle-detection/index.js';
import type { ContinuityIdentityRef } from '../../lib/deep-loop/continuity-identity/index.js';
import type { EventWritePreflight, JsonObject } from '../../lib/event-envelope/index.js';
import type {
  NextFocusRegionInput,
  NextFocusSelectedDecision,
  RequiredNextFocusSignal,
} from '../../lib/next-focus/index.js';

const RUN_ID = 'run-cycle-detection';
const TIMESTAMP = '2026-07-21T12:00:00.000Z';
const HASH_ZERO = '0'.repeat(64);
const temporaryRoots: string[] = [];

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function claimRef(key: string): ContinuityIdentityRef {
  return identityRefFromTokenDigest(
    ContinuityIdentityKinds.CLAIM,
    digest({ claim_key: key }),
  );
}

function claimRecord(
  ref: ContinuityIdentityRef,
  alias: string,
  iteration: number,
): ClaimContinuityRecord {
  return {
    claim_ref: ref,
    namespace: 'cycle-fixture',
    mint_match_record_id: `match-${ref.id.slice(-12)}`,
    mint_identity_event_id: `identity-${ref.id.slice(-12)}`,
    mint_request_token_digest: digest({ ref: ref.id, kind: 'mint' }),
    provenance_digest: digest({ ref: ref.id, kind: 'provenance' }),
    lifecycle: ClaimLifecycleStates.ACTIVE,
    epistemic_status: ClaimEpistemicStatuses.SUPPORTED,
    aliases: [alias],
    normalized_fingerprints: [digest({ alias })],
    observations: [],
    evidence: [],
    active_relationship_ids: [],
    historical_relationship_ids: [],
    contributing_event_ids: [`claim-event-${iteration}-${ref.id.slice(-8)}`],
    corrected_event_ids: [],
    last_applied_ledger_sequence: iteration,
  };
}

function claimProjection(
  keys: readonly string[],
  iteration: number,
  reverseInsertion = false,
): { readonly state: ClaimContinuityState; readonly frontier: ClaimContinuityFrontier } {
  const refs = keys.map(claimRef);
  const insertion = reverseInsertion ? [...refs].reverse() : refs;
  const records = Object.fromEntries(insertion.map((ref) => [
    ref.id,
    claimRecord(ref, `Paraphrase ${iteration} for ${ref.id.slice(-8)}`, iteration),
  ]));
  const identityProjectionDigest = digest({
    typed_claim_refs: [...refs].map((ref) => ref.id).sort(),
  });
  const state: ClaimContinuityState = {
    schema_version: CLAIM_CONTINUITY_SCHEMA_VERSION,
    reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
    identity_projection_digest: identityProjectionDigest,
    records,
    match_records: {},
    relationships: {},
    unresolved_match_ids: [],
    event_journal: [],
    last_applied_ledger_sequence: iteration,
  };
  const projectionDigest = claimProjectionDigest(state);
  const core: Omit<ClaimContinuityFrontier, 'frontier_digest'> = {
    schema_version: CLAIM_CONTINUITY_SCHEMA_VERSION,
    continuity_identity_frontier_digest: digest({ refs: refs.map((ref) => ref.id) }),
    identity_projection_digest: identityProjectionDigest,
    active_claim_refs: reverseInsertion ? [...refs].reverse() : [...refs],
    unresolved_match_ids: [],
    claim_reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
    claim_projection_schema_version: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
    claim_ledger_cursor: {
      ledger_id: 'claim-ledger',
      sequence: iteration,
      record_hash: digest({ claim_cursor: iteration }),
    },
    claim_replay_fingerprint: {
      fingerprint_version: 1,
      run_id: RUN_ID,
      range_start_sequence: 1,
      range_end_sequence: iteration,
      event_registry_digest: digest({ registry: 'claims-v1' }),
      projection_digest: projectionDigest,
      final_digest: digest({ projectionDigest, iteration }),
    },
    claim_projection_digest: projectionDigest,
  };
  return {
    state,
    frontier: {
      ...core,
      frontier_digest: continuityDigest(core as JsonObject),
    },
  };
}

function signal(bps: number): RequiredNextFocusSignal {
  return { applicability: 'required', bps, evidenceIds: ['focus-evidence'] };
}

function focusDecision(
  key: string,
  iteration: number,
  watermark: string,
  fixedWording = false,
): NextFocusSelectedDecision {
  const displayIteration = fixedWording ? 0 : iteration;
  const region: NextFocusRegionInput = {
    kind: 'coverage_gap',
    candidateId: `candidate-${key}`,
    title: `Mutable title ${displayIteration}`,
    focus: `Mutable prompt-like focus text ${displayIteration}`,
    relevanceRationale: `Mutable relevance wording ${displayIteration}`,
    boundaryRationale: `Mutable boundary wording ${displayIteration}`,
    seatProvenance: ['cycle-fixture'],
    gap: {
      nodeId: `gap-${key}`,
      kind: 'QUESTION',
      name: `Mutable gap label ${displayIteration}`,
      reason: `Mutable gap reason ${displayIteration}`,
    },
    coverageGap: signal(7_000),
    noveltyDecay: signal(1_000),
  };
  const input = {
    projectionWatermark: watermark,
    projectionVersion: 'focus-projection-v1',
    evidenceIds: ['focus-evidence'],
    regions: [region],
  };
  const decision = selectNextFocus({
    runId: RUN_ID,
    sourceIteration: iteration,
    expectedProjectionWatermark: watermark,
    expectedProjectionVersion: input.projectionVersion,
    sourceSnapshot: createNextFocusSourceSnapshot(input),
    candidates: deriveNextFocusCandidates(input),
    previousFocus: `Mutable legacy display label ${iteration}`,
  });
  if (decision.outcome !== 'next_focus_selected') {
    throw new Error('Cycle fixture requires one selected focus');
  }
  return decision;
}

type ProgressKind =
  | 'none'
  | 'evidence'
  | 'claim_transition'
  | 'contradiction_resolution'
  | 'blocker_resolution'
  | 'coverage'
  | 'missing';

function progressVector(
  kind: ProgressKind,
  iteration: number,
  watermark: string,
  currentClaimRef: ContinuityIdentityRef,
  pathCoverageBps: number,
): CycleProgressVector {
  if (kind === 'missing') {
    return createMissingCycleProgressVector(watermark, ['coverage-signal']);
  }
  const materialClaimChanges: CycleClaimChange[] = kind === 'claim_transition'
    ? [{
        kind: CycleClaimChangeKinds.EPISTEMIC,
        claim_ref: currentClaimRef,
        lifecycle_before: ClaimLifecycleStates.ACTIVE,
        lifecycle_after: ClaimLifecycleStates.ACTIVE,
        epistemic_before: ClaimEpistemicStatuses.UNASSESSED,
        epistemic_after: ClaimEpistemicStatuses.SUPPORTED,
      }]
    : [];
  return createCycleProgressVector({
    projection_watermark: watermark,
    new_independent_evidence: kind === 'evidence'
      ? [{ evidence_ref: `new-evidence-${iteration}`, independence_key: `source-${iteration}` }]
      : [],
    material_claim_changes: materialClaimChanges,
    resolved_contradiction_ids: kind === 'contradiction_resolution'
      ? [`contradiction-${iteration}`]
      : [],
    resolved_blocker_ids: kind === 'blocker_resolution' ? [`blocker-${iteration}`] : [],
    path_coverage_bps: pathCoverageBps,
    community_coverage_bps: 1_000,
  });
}

interface ObservationOptions {
  readonly focusKey?: string;
  readonly claimKeys?: readonly string[];
  readonly blockerIds?: readonly string[];
  readonly coveragePathIds?: readonly string[];
  readonly progress?: ProgressKind;
  readonly reverseClaimInsertion?: boolean;
  readonly coverageWatermark?: string;
  readonly detectorPolicyVersion?: string;
  readonly fixedFocusWording?: boolean;
  readonly ledgerSequence?: number;
  readonly pathCoverageBps?: number;
  readonly unsafeClaimProjectionWatermark?: unknown;
}

function observation(
  iteration: number,
  stateKey: string,
  options: ObservationOptions = {},
): CycleObservation {
  const watermark = `committed-watermark-${iteration}`;
  const claimKeys = options.claimKeys ?? [`claim-${stateKey}`];
  const claims = claimProjection(
    claimKeys,
    iteration,
    options.reverseClaimInsertion,
  );
  const pathCoverageBps = options.pathCoverageBps
    ?? (options.progress === 'coverage'
      ? 1_000 + CYCLE_COVERAGE_GAIN_FLOOR_BPS
      : 1_000);
  const progress = progressVector(
    options.progress ?? 'none',
    iteration,
    watermark,
    claimRef(claimKeys[0]),
    pathCoverageBps,
  );
  return projectCycleObservation({
    boundary: {
      runLineageId: RUN_ID,
      iteration,
      ledgerCursor: {
        ledger_id: 'iteration-ledger',
        sequence: options.ledgerSequence ?? iteration,
        record_hash: digest({ iteration }),
      },
      projectionWatermark: watermark,
    },
    nextFocusDecision: focusDecision(
      options.focusKey ?? stateKey,
      iteration,
      watermark,
      options.fixedFocusWording,
    ),
    claimFrontier: claims.frontier,
    claimState: claims.state,
    claimProjectionWatermark: (
      options.unsafeClaimProjectionWatermark === undefined
        ? watermark
        : options.unsafeClaimProjectionWatermark
    ) as string,
    coverage: createCycleCoverageSnapshot({
      projection_watermark: options.coverageWatermark ?? watermark,
      reducer_version: CYCLE_COVERAGE_REDUCER_VERSION,
      path_coverage_bps: pathCoverageBps,
      community_coverage_bps: 1_000,
      covered_path_ids: options.coveragePathIds ?? ['path-baseline'],
      covered_community_ids: ['community-baseline'],
    }),
    blockers: createCycleBlockerSnapshot({
      projection_watermark: watermark,
      reducer_version: CYCLE_BLOCKER_REDUCER_VERSION,
      unresolved_blocker_ids: options.blockerIds ?? [],
    }),
    progress,
    detectorPolicyVersion: options.detectorPolicyVersion,
  });
}

function history(observations: readonly CycleObservation[]): CycleHistoryProjection {
  return replayCycleHistory(observations);
}

function repeated(period: number, count: number): CycleObservation[] {
  return Array.from({ length: count }, (_, index) => (
    observation(index + 1, String.fromCharCode(65 + (index % period)))
  ));
}

function confirmedEvidence(value: ReturnType<typeof evaluateCycleHistory>): CycleEvidence {
  expect(value.status).toBe(CycleEvaluationStatuses.CYCLE_CONFIRMED);
  if (value.status !== CycleEvaluationStatuses.CYCLE_CONFIRMED) {
    throw new Error(`Expected confirmed cycle, received ${value.status}`);
  }
  return value.evidence;
}

function reportedEvidence(
  value: ReturnType<typeof evaluateCycleHistory>,
): readonly CycleEvidence[] {
  if (
    value.status !== CycleEvaluationStatuses.CYCLE_SUSPECTED
    && value.status !== CycleEvaluationStatuses.CYCLE_CONFIRMED
    && value.status !== CycleEvaluationStatuses.CYCLE_CLEARED
  ) {
    return [];
  }
  return value.evidenceSet ?? [value.evidence];
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('canonical cycle observations', () => {
  it('uses typed focus and sorted claim identities while excluding mutable wording', () => {
    const left = observation(1, 'A', {
      claimKeys: ['claim-z', 'claim-a'],
      reverseClaimInsertion: false,
    });
    const right = observation(2, 'A', {
      claimKeys: ['claim-z', 'claim-a'],
      reverseClaimInsertion: true,
    });

    expect(left.focus_signature.fingerprint).toBe(right.focus_signature.fingerprint);
    expect(left.claim_frontier_signature.fingerprint).toBe(
      right.claim_frontier_signature.fingerprint,
    );
    expect(left.composite_state_signature.fingerprint).toBe(
      right.composite_state_signature.fingerprint,
    );
    expect(left.source_evidence.next_focus_source_fingerprint).not.toBe(
      right.source_evidence.next_focus_source_fingerprint,
    );
    expect(left.source_evidence.claim_projection_digest).not.toBe(
      right.source_evidence.claim_projection_digest,
    );
    expect(JSON.stringify(left.focus_signature.payload)).not.toContain('Mutable');
    expect(JSON.stringify(left.claim_frontier_signature.payload)).not.toContain('Paraphrase');
  });

  it('fails closed on mixed committed watermarks and unknown policy generations', () => {
    expect(() => observation(1, 'A', { coverageWatermark: 'stale-watermark' }))
      .toThrowError(CycleDetectionError);
    try {
      observation(1, 'A', { coverageWatermark: 'stale-watermark' });
    } catch (error: unknown) {
      expect((error as CycleDetectionError).code).toBe(CycleDetectionErrorCodes.MIXED_WATERMARK);
    }
    expect(() => observation(1, 'A', { detectorPolicyVersion: 'cycle-detector-policy-v2' }))
      .toThrowError(CycleDetectionError);
  });

  it('fails closed on null and mismatched required claim projection watermarks', () => {
    expect(() => observation(1, 'A', { unsafeClaimProjectionWatermark: null }))
      .toThrowError(CycleDetectionError);
    try {
      observation(1, 'A', { unsafeClaimProjectionWatermark: null });
    } catch (error: unknown) {
      expect((error as CycleDetectionError).code).toBe(CycleDetectionErrorCodes.INVALID_INPUT);
    }

    expect(() => observation(1, 'A', {
      unsafeClaimProjectionWatermark: 'stale-claim-watermark',
    })).toThrowError(CycleDetectionError);
    try {
      observation(1, 'A', { unsafeClaimProjectionWatermark: 'stale-claim-watermark' });
    } catch (error: unknown) {
      expect((error as CycleDetectionError).code).toBe(
        CycleDetectionErrorCodes.MIXED_WATERMARK,
      );
    }
  });

  it('does not treat repeated presentation wording as repeated typed state', () => {
    const observations = Array.from({ length: CYCLE_HISTORY_WINDOW }, (_, index) => (
      observation(index + 1, `unique-state-${index + 1}`, { fixedFocusWording: true })
    ));
    expect(evaluateCycleHistory(history(observations))).toMatchObject({
      status: CycleEvaluationStatuses.NO_CYCLE,
      evaluatedObservationCount: CYCLE_HISTORY_WINDOW,
    });
  });
});

describe('exact three-traversal detection', () => {
  it.each([1, 2, 3, 4])(
    'confirms a genuine period-%i sequence at exactly three complete traversals',
    (period) => {
      const required = period * CYCLE_MINIMUM_TRAVERSALS;
      const before = evaluateCycleHistory(history(repeated(period, required - 1)));
      expect(before.status).not.toBe(CycleEvaluationStatuses.CYCLE_CONFIRMED);

      const atBoundary = evaluateCycleHistory(history(repeated(period, required)));
      expect(atBoundary.status).toBe(CycleEvaluationStatuses.CYCLE_CONFIRMED);
      if (atBoundary.status === CycleEvaluationStatuses.CYCLE_CONFIRMED) {
        expect(atBoundary.evidence.period).toBe(period);
        expect(atBoundary.evidence.occurrence_count).toBe(CYCLE_MINIMUM_TRAVERSALS);
        expect(atBoundary.evidence.trace).toHaveLength(required);
        expect(atBoundary.evidence.end_iteration).toBe(required);
      }
    },
  );

  it.each([
    'evidence',
    'claim_transition',
    'contradiction_resolution',
    'blocker_resolution',
    'coverage',
  ] as const)('treats productive revisitation via %s as progress', (progress) => {
    const observations = [
      observation(1, 'A'),
      observation(2, 'A'),
      observation(3, 'A', { progress }),
    ];
    expect(evaluateCycleHistory(history(observations)).status).not.toBe(
      CycleEvaluationStatuses.CYCLE_CONFIRMED,
    );
  });

  it('does not treat a transient coverage blip that regresses as net progress', () => {
    const result = evaluateCycleHistory(history([
      observation(1, 'A', { pathCoverageBps: 1_000 }),
      observation(2, 'A', { pathCoverageBps: 1_000 + CYCLE_COVERAGE_GAIN_FLOOR_BPS }),
      observation(3, 'A', { pathCoverageBps: 1_000 }),
    ]));

    expect(result.status).toBe(CycleEvaluationStatuses.CYCLE_SUSPECTED);
    for (const evidence of reportedEvidence(result)) {
      expect(evidence.progress_assessment.path_coverage_gain_bps).toBe(0);
      expect(evidence.progress_assessment.basis).not.toContain('path_coverage_gain');
    }
  });

  it('clears a confirmed cycle when late independent progress arrives', () => {
    const firstThree = repeated(1, 3);
    const confirmed = evaluateCycleHistory(history(firstThree));
    const active = confirmedEvidence(confirmed);
    const withProgress = history([
      ...firstThree,
      observation(4, 'A', { progress: 'evidence' }),
    ]);
    const cleared = evaluateCycleHistory(withProgress, active);

    expect(cleared.status).toBe(CycleEvaluationStatuses.CYCLE_CLEARED);
    if (cleared.status === CycleEvaluationStatuses.CYCLE_CLEARED) {
      expect(cleared.evidence.progress_assessment.verdict).toBe('progress');
      expect(cleared.evidence.progress_assessment.basis).toContain('new_independent_evidence');
    }
  });

  it('returns not_evaluable when progress data is absent', () => {
    const result = evaluateCycleHistory(history([
      observation(1, 'A'),
      observation(2, 'A'),
      observation(3, 'A', { progress: 'missing' }),
    ]));
    expect(result).toMatchObject({
      status: CycleEvaluationStatuses.NOT_EVALUABLE,
      reason: 'PROGRESS_DATA_MISSING',
    });
  });
});

describe('independent repeated-signature suspicion', () => {
  it('suspects repeated focus despite full composite drift', () => {
    const observations = [1, 2, 3].map((iteration) => observation(iteration, `claim-${iteration}`, {
      focusKey: 'same-focus',
      claimKeys: [`different-claim-${iteration}`],
      blockerIds: [`different-blocker-${iteration}`],
    }));
    const result = evaluateCycleHistory(history(observations));

    expect(new Set(observations.map((entry) => entry.composite_state_signature.fingerprint)).size)
      .toBe(3);
    expect(result.status).toBe(CycleEvaluationStatuses.CYCLE_SUSPECTED);
    if (result.status === CycleEvaluationStatuses.CYCLE_SUSPECTED) {
      expect(result.evidence.signature_kind).toBe(CycleSignatureKinds.FOCUS);
      expect(result.evidence.occurrence_count).toBe(CYCLE_OCCURRENCE_THRESHOLD);
    }
  });

  it('suspects repeated claim frontier despite focus and composite drift', () => {
    const observations = [1, 2, 3].map((iteration) => observation(iteration, `focus-${iteration}`, {
      claimKeys: ['same-typed-claim'],
      blockerIds: [`different-blocker-${iteration}`],
    }));
    const result = evaluateCycleHistory(history(observations));

    expect(result.status).toBe(CycleEvaluationStatuses.CYCLE_SUSPECTED);
    if (result.status === CycleEvaluationStatuses.CYCLE_SUSPECTED) {
      expect(result.evidence.signature_kind).toBe(CycleSignatureKinds.CLAIM_FRONTIER);
    }
  });

  it('reports co-occurring focus and claim-frontier cycles before either leaves the window', () => {
    const observations = Array.from({ length: 9 }, (_, index) => {
      const iteration = index + 1;
      return observation(iteration, `state-${iteration}`, {
        focusKey: 'same-focus',
        claimKeys: iteration <= 3
          ? ['same-typed-claim']
          : [`different-claim-${iteration}`],
        blockerIds: [`different-blocker-${iteration}`],
      });
    });
    const reportedKinds = new Set<string>();
    let projection = createCycleHistoryProjection();
    for (const entry of observations) {
      projection = applyCycleObservation(projection, entry);
      for (const evidence of reportedEvidence(evaluateCycleHistory(projection))) {
        reportedKinds.add(evidence.signature_kind);
      }
    }

    const closing = evaluateCycleHistory(history(observations.slice(0, 3)));
    expect(reportedEvidence(closing).map((entry) => entry.signature_kind)).toEqual([
      CycleSignatureKinds.FOCUS,
      CycleSignatureKinds.CLAIM_FRONTIER,
    ]);
    const claimFingerprint = observations[0].claim_frontier_signature.fingerprint;
    expect(projection.observations.slice(-CYCLE_REPETITION_WINDOW).filter((entry) => (
      entry.claim_frontier_signature.fingerprint === claimFingerprint
    ))).toHaveLength(CYCLE_OCCURRENCE_THRESHOLD - 1);
    expect(reportedKinds).toEqual(new Set([
      CycleSignatureKinds.FOCUS,
      CycleSignatureKinds.CLAIM_FRONTIER,
    ]));
  });
});

describe('bounded replay and fail-closed restoration', () => {
  it('produces identical latest-window order, eviction boundary, and hash incrementally and by replay', () => {
    const observations = repeated(4, 16);
    const incremental = observations.reduce(
      (projection, entry) => applyCycleObservation(projection, entry),
      createCycleHistoryProjection(),
    );
    const replayed = replayCycleHistory(observations);

    expect(incremental.observations).toHaveLength(CYCLE_HISTORY_WINDOW);
    expect(incremental.observations.map((entry) => entry.iteration)).toEqual(
      replayed.observations.map((entry) => entry.iteration),
    );
    expect(incremental.evicted_through).toEqual(replayed.evicted_through);
    expect(incremental.eviction_chain_hash).toBe(replayed.eviction_chain_hash);
    expect(incremental.history_hash).toBe(replayed.history_hash);
    expect(incremental).toEqual(replayed);
    const incrementalEvaluation = evaluateCycleHistory(incremental);
    const replayEvaluation = evaluateCycleHistory(replayed);
    expect(incrementalEvaluation).toEqual(replayEvaluation);
    if (
      incrementalEvaluation.status === CycleEvaluationStatuses.CYCLE_CONFIRMED
      && replayEvaluation.status === CycleEvaluationStatuses.CYCLE_CONFIRMED
    ) {
      expect(createCycleHealthEventPayload(incrementalEvaluation, RUN_ID)).toEqual(
        createCycleHealthEventPayload(replayEvaluation, RUN_ID),
      );
    }
  });

  it('restores a replay projection with the identical history hash', () => {
    const original = replayCycleHistory(repeated(4, 16));
    const restored = restoreCycleHistory(JSON.parse(JSON.stringify(original)));
    expect(restored).toEqual(original);
    expect(restored.history_hash).toBe(original.history_hash);
  });

  it('rejects a history gap and evaluates reducer-version tampering as not_evaluable', () => {
    const first = applyCycleObservation(createCycleHistoryProjection(), observation(1, 'A'));
    expect(() => applyCycleObservation(first, observation(3, 'A'))).toThrowError(
      CycleDetectionError,
    );
    expect(() => applyCycleObservation(first, observation(2, 'A', { ledgerSequence: 1 })))
      .toThrowError(CycleDetectionError);

    const valid = history(repeated(1, 3));
    const changedReducer = {
      ...valid,
      reducer_version: 'cycle-history-reducer-v2',
    } as CycleHistoryProjection;
    const result = evaluateCycleHistory(changedReducer);
    expect(result).toMatchObject({
      status: CycleEvaluationStatuses.NOT_EVALUABLE,
      reason: CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
    });
  });

  it('rejects a conflicting stored fingerprint and keeps insufficient history unknown', () => {
    const original = observation(1, 'A');
    const conflicting = {
      ...original,
      focus_signature: {
        ...original.focus_signature,
        fingerprint: digest({ conflict: true }),
      },
    } as CycleObservation;
    expect(() => replayCycleHistory([conflicting])).toThrowError(CycleDetectionError);
    expect(evaluateCycleHistory(history([
      observation(1, 'A'),
      observation(2, 'B'),
    ]))).toMatchObject({
      status: CycleEvaluationStatuses.NOT_EVALUABLE,
      reason: 'INCOMPLETE_PERIOD_WINDOW',
    });
  });
});

describe('versioned sensitivity and evidence-only shadowing', () => {
  it('publishes one exact bounded policy generation and rejects reinterpretation', () => {
    expect(CYCLE_HISTORY_WINDOW).toBe(12);
    expect(CYCLE_MAX_PERIOD).toBe(4);
    expect(CYCLE_MINIMUM_TRAVERSALS).toBe(3);
    expect(CYCLE_REPETITION_WINDOW).toBe(8);
    expect(CYCLE_OCCURRENCE_THRESHOLD).toBe(3);
    expect(CYCLE_COVERAGE_GAIN_FLOOR_BPS).toBe(100);
    expect(resolveCycleDetectorPolicy()).toBe(CYCLE_DETECTOR_POLICY);
    expect(CYCLE_DETECTOR_POLICY.policy_version).toBe(CYCLE_DETECTOR_POLICY_VERSION);
    expect(() => resolveCycleDetectorPolicy('cycle-detector-policy-v2')).toThrowError(
      CycleDetectionError,
    );
  });

  it('returns the authoritative result by identity and exposes no stop decision', () => {
    const authoritative = Object.freeze({ decision: 'CONTINUE', source: 'legacy' });
    const firstTwo = history(repeated(1, 2));
    const shadow = observeCycleInShadow(authoritative, firstTwo, observation(3, 'A'));

    expect(shadow.authoritative_result).toBe(authoritative);
    expect(shadow.evaluation.status).toBe(CycleEvaluationStatuses.CYCLE_CONFIRMED);
    expect(shadow.stopping_clock_evidence).toMatchObject({
      authority: 'evidence_only',
      contributes_to_stopping_clock: true,
      stop_decision: null,
    });
    expect(JSON.stringify(shadow)).not.toContain('STOP_ALLOWED');
  });

  it('rejects active-cycle evidence from another run lineage', () => {
    const projection = history(repeated(1, 3));
    const active = confirmedEvidence(evaluateCycleHistory(projection));
    const mismatched = { ...active, run_lineage_id: 'another-run' } as CycleEvidence;
    expect(evaluateCycleHistory(projection, mismatched)).toMatchObject({
      status: CycleEvaluationStatuses.NOT_EVALUABLE,
      reason: 'ACTIVE_CYCLE_IDENTITY_MISMATCH',
    });
  });
});

describe('typed append-only health events', () => {
  it('authorizes and appends confirmed evidence once, then accepts an exact retry', async () => {
    const rootDirectory = mkdtempSync(join(tmpdir(), 'cycle-health-ledger-'));
    temporaryRoots.push(rootDirectory);
    const authority = Object.freeze({ state: 'legacy_authoritative' as const, epoch: 1 });
    const registry = createCycleHealthEventRegistry();
    const policies = createCycleHealthPolicyRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'cycle-health-domain',
      auditLedgerId: 'cycle-health-audit',
      authorityProvider: () => authority,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'cycle-health-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const evaluation = evaluateCycleHistory(history(repeated(1, 3)));
    confirmedEvidence(evaluation);
    const payload = createCycleHealthEventPayload(evaluation, RUN_ID);
    const event = prepareCycleHealthEvent(payload, {
      streamId: 'cycle-health-stream',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'cycle-detection-tests', version: '1' },
      authorityEpoch: authority.epoch,
      correlationId: 'cycle-health-correlation',
      causationId: null,
    }, registry);
    const context = cycleHealthWriteContext(payload, policies, 'cycle-detector');
    const request: TransitionAuthorizationRequest = {
      requestId: `authorize-${event.canonicalDigest}`,
      mode: context.mode,
      event,
      priorHead: await ledger.getVerifiedHead(),
      priorStateVersion: CYCLE_DETECTOR_POLICY_VERSION,
      priorStateFingerprint: digest({ state: 'shadow' }),
      actorId: context.actorId,
      capabilityId: context.capabilityId,
      authorityEpoch: authority.epoch,
      policy: context.policy,
      evidenceDigest: context.evidenceDigest,
    };
    const authorization = await gateway.authorize(request);
    expect(authorization.verdict).toBe('allow');
    if (authorization.verdict !== 'allow') {
      throw new Error(`Cycle health authorization denied: ${authorization.reasonCode}`);
    }

    const appended = await recordCycleHealthEvent(ledger, event, authorization.proof);
    const retried = await recordCycleHealthEvent(ledger, event, authorization.proof);
    const clockInput = cycleStoppingClockInput(payload);

    expect(appended.status).toBe('appended');
    expect(retried.status).toBe('idempotent');
    expect(retried.receipt.recordHash).toBe(appended.receipt.recordHash);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);
    expect(clockInput).toEqual({
      source: 'cycle_detection',
      authority: 'evidence_only',
      health_event_id: payload.health_event_id,
      health_state: 'cycle_confirmed',
      evidence_digest: payload.evidence_digest,
      contributes_to_stopping_clock: true,
      severity_bps: 10_000,
      stop_decision: null,
    });

    const conflictingEvent = {
      ...event,
      envelope: {
        ...event.envelope,
        event_type: CYCLE_CLEARED_EVENT_TYPE,
      },
    } as EventWritePreflight;
    await expect(recordCycleHealthEvent(
      ledger,
      conflictingEvent,
      authorization.proof,
    )).rejects.toMatchObject({ code: CycleDetectionErrorCodes.EVENT_CONFLICT });
  });

  it('emits distinct suspected, confirmed, and cleared health types', () => {
    const suspectedEvaluation = evaluateCycleHistory(history([
      observation(1, 'A', { focusKey: 'same', blockerIds: ['one'] }),
      observation(2, 'B', { focusKey: 'same', blockerIds: ['two'] }),
      observation(3, 'C', { focusKey: 'same', blockerIds: ['three'] }),
    ]));
    const confirmedEvaluation = evaluateCycleHistory(history(repeated(1, 3)));
    const active = confirmedEvidence(confirmedEvaluation);
    const clearedEvaluation = evaluateCycleHistory(history([
      ...repeated(1, 3),
      observation(4, 'A', { progress: 'evidence' }),
    ]), active);

    const payloads = [
      createCycleHealthEventPayload(suspectedEvaluation, RUN_ID),
      createCycleHealthEventPayload(confirmedEvaluation, RUN_ID),
      createCycleHealthEventPayload(clearedEvaluation, RUN_ID),
    ];
    expect(payloads.map((payload) => payload.health_state)).toEqual([
      'cycle_suspected',
      'cycle_confirmed',
      'cycle_cleared',
    ]);
    const registry = createCycleHealthEventRegistry();
    expect(payloads.map((payload, index) => prepareCycleHealthEvent(payload, {
      streamId: 'cycle-health-stream',
      streamSequence: index + 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'cycle-detection-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'cycle-health-correlation',
      causationId: null,
    }, registry).envelope.event_type)).toEqual([
      'deep-loop.cycle.suspected',
      'deep-loop.cycle.confirmed',
      CYCLE_CLEARED_EVENT_TYPE,
    ]);
    expect(() => createCycleHealthEventPayload(confirmedEvaluation, 'another-run'))
      .toThrowError(CycleDetectionError);

    const malformed = {
      ...payloads[1],
      start_cursor: { ...payloads[1].start_cursor, mutable_label: 'not-semantic' },
    } as unknown as JsonObject;
    expect(() => registry.validatePayload(
      CYCLE_CONFIRMED_EVENT_TYPE,
      1,
      malformed,
    )).toThrowError();
  });
});
