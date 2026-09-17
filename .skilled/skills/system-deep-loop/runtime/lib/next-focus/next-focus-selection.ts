// ───────────────────────────────────────────────────────────────────
// MODULE: Next Focus Selection
// ──────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD,
  deduplicatePivotCandidates,
} from '../deep-loop/pivot-candidates.js';
import {
  createNextFocusSourceSnapshot,
  validateNextFocusCandidate,
} from './next-focus-candidates.js';
import { NextFocusError, NextFocusErrorCodes } from './next-focus-errors.js';

import type { PivotCandidateRejection } from '../deep-loop/pivot-candidates.js';
import type {
  NextFocusCandidate,
  NextFocusComparatorTier,
  NextFocusComparatorTraceEntry,
  NextFocusDecision,
  NextFocusDecisionIdentity,
  NextFocusRejectedCandidate,
  NextFocusSelectionRequest,
  NextFocusShadowComparison,
  ScoredNextFocusCandidate,
} from './next-focus-types.js';

export const NEXT_FOCUS_SCORING_POLICY_VERSION = 'next-focus-equal-components-bps-v1';
export const NEXT_FOCUS_CANDIDATE_SIMILARITY_THRESHOLD =
  DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD;

const NOVELTY_COMPLEMENT_BPS = 10_000;

function compareCodeUnits(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function candidateId(input: unknown): string | null {
  return isRecord(input) && typeof input.id === 'string' && input.id.trim() !== ''
    ? input.id.trim()
    : null;
}

function candidateFingerprint(input: unknown): string | null {
  return isRecord(input)
    && typeof input.fingerprint === 'string'
    && input.fingerprint.trim() !== ''
    ? input.fingerprint.trim()
    : null;
}

function compareNullableCodeUnits(left: string | null, right: string | null): number {
  if (left === right) return 0;
  if (left === null) return -1;
  if (right === null) return 1;
  return compareCodeUnits(left, right);
}

function compareCanonicalValues(left: unknown, right: unknown): number {
  const leftBytes = canonicalBytes(left);
  const rightBytes = canonicalBytes(right);
  const sharedLength = Math.min(leftBytes.length, rightBytes.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (leftBytes[index] !== rightBytes[index]) return leftBytes[index] - rightBytes[index];
  }
  return leftBytes.length - rightBytes.length;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((entry, index) => entry === right[index]);
}

function signalBps(candidate: NextFocusCandidate, signal: keyof NextFocusCandidate['signals']): number {
  return candidate.signals[signal].bps;
}

function scoreCandidate(candidate: NextFocusCandidate): Omit<ScoredNextFocusCandidate, 'rank'> {
  const coverageGapBps = signalBps(candidate, 'coverageGap');
  const contradictionUrgencyBps = signalBps(candidate, 'contradictionUrgency');
  const noveltyDecayBps = signalBps(candidate, 'noveltyDecay');
  return Object.freeze({
    candidate,
    coverageGapBps,
    contradictionUrgencyBps,
    noveltyDecayBps,
    scoreBps: coverageGapBps
      + contradictionUrgencyBps
      + (NOVELTY_COMPLEMENT_BPS - noveltyDecayBps),
  });
}

function decisiveTier(
  left: ScoredNextFocusCandidate,
  right: ScoredNextFocusCandidate,
): NextFocusComparatorTier {
  if (left.scoreBps !== right.scoreBps) return 'score';
  if (left.contradictionUrgencyBps !== right.contradictionUrgencyBps) {
    return 'contradiction_urgency';
  }
  if (left.coverageGapBps !== right.coverageGapBps) return 'coverage_gap';
  if (left.noveltyDecayBps !== right.noveltyDecayBps) return 'novelty_decay';
  return 'candidate_id';
}

function normalizedRejections(
  rejections: readonly PivotCandidateRejection[],
): readonly PivotCandidateRejection[] {
  return Object.freeze(rejections
    .map((rejection) => Object.freeze({ ...rejection }))
    .sort(compareCanonicalValues));
}

/** Canonicalize rejected candidates before they affect event bytes or replay digests. */
export function canonicalizeNextFocusRejectedCandidates(
  rejectedCandidates: readonly NextFocusRejectedCandidate[],
): readonly NextFocusRejectedCandidate[] {
  const normalized = rejectedCandidates.map((entry) => Object.freeze({
    candidateId: entry.candidateId,
    candidateFingerprint: entry.candidateFingerprint,
    rejections: normalizedRejections(entry.rejections),
  }));
  return Object.freeze(normalized.sort((left, right) => {
    const idOrder = compareNullableCodeUnits(left.candidateId, right.candidateId);
    if (idOrder !== 0) return idOrder;
    const fingerprintOrder = compareNullableCodeUnits(
      left.candidateFingerprint,
      right.candidateFingerprint,
    );
    if (fingerprintOrder !== 0) return fingerprintOrder;
    return compareCanonicalValues(left.rejections, right.rejections);
  }));
}

function candidateSetFingerprint(frontier: readonly ScoredNextFocusCandidate[]): string {
  return sha256Bytes(canonicalBytes(frontier.map((entry) => ({
    rank: entry.rank,
    candidate: entry.candidate,
    coverageGapBps: entry.coverageGapBps,
    contradictionUrgencyBps: entry.contradictionUrgencyBps,
    noveltyDecayBps: entry.noveltyDecayBps,
    scoreBps: entry.scoreBps,
  }))));
}

function decisionIdentity(request: NextFocusSelectionRequest): NextFocusDecisionIdentity {
  if (
    typeof request.runId !== 'string'
    || request.runId.trim() === ''
    || !Number.isSafeInteger(request.sourceIteration)
    || request.sourceIteration < 0
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      'runId must be non-empty and sourceIteration must be a non-negative integer.',
    );
  }
  return Object.freeze({
    runId: request.runId.trim(),
    sourceIteration: request.sourceIteration,
    projectionWatermark: request.sourceSnapshot.projectionWatermark,
    policyVersion: NEXT_FOCUS_SCORING_POLICY_VERSION,
  });
}

function decisionId(identity: NextFocusDecisionIdentity): string {
  return `next-focus-${sha256Bytes(canonicalBytes(identity))}`;
}

function assertCandidateSnapshot(
  candidate: NextFocusCandidate,
  request: NextFocusSelectionRequest,
): void {
  const source = request.sourceSnapshot;
  if (
    candidate.projectionWatermark !== source.projectionWatermark
    || candidate.projectionVersion !== source.projectionVersion
    || candidate.sourceFingerprint !== source.sourceFingerprint
    || !sameStrings(candidate.snapshotEvidenceIds, source.evidenceIds)
    || !sameStrings(candidate.evidenceRefs, source.evidenceIds)
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.MIXED_SNAPSHOT,
      `Candidate "${candidate.id}" does not cite the decision's immutable source snapshot.`,
      { candidateId: candidate.id },
    );
  }
}

/** Compare scored entries with the complete deterministic total order. */
export function compareScoredNextFocusCandidates(
  left: ScoredNextFocusCandidate,
  right: ScoredNextFocusCandidate,
): number {
  if (left.scoreBps !== right.scoreBps) return right.scoreBps - left.scoreBps;
  if (left.contradictionUrgencyBps !== right.contradictionUrgencyBps) {
    return right.contradictionUrgencyBps - left.contradictionUrgencyBps;
  }
  if (left.coverageGapBps !== right.coverageGapBps) {
    return right.coverageGapBps - left.coverageGapBps;
  }
  if (left.noveltyDecayBps !== right.noveltyDecayBps) {
    return left.noveltyDecayBps - right.noveltyDecayBps;
  }
  return compareCodeUnits(left.candidate.id, right.candidate.id);
}

/** Select a shadow next focus without writing or changing runtime authority. */
export function selectNextFocus(request: NextFocusSelectionRequest): NextFocusDecision {
  if (!Array.isArray(request.candidates)) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      'candidates must be an array.',
      { field: 'candidates' },
    );
  }
  const verifiedSource = createNextFocusSourceSnapshot(request.sourceSnapshot);
  if (
    typeof request.expectedProjectionWatermark !== 'string'
    || request.expectedProjectionWatermark.trim() === ''
    || verifiedSource.projectionWatermark !== request.expectedProjectionWatermark.trim()
    || typeof request.expectedProjectionVersion !== 'string'
    || request.expectedProjectionVersion.trim() === ''
    || verifiedSource.projectionVersion !== request.expectedProjectionVersion.trim()
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.MIXED_SNAPSHOT,
      'The source projection watermark or version is stale relative to the caller snapshot.',
      {
        projectionWatermark: verifiedSource.projectionWatermark,
        projectionVersion: verifiedSource.projectionVersion,
      },
    );
  }
  if (
    verifiedSource.sourceFingerprint !== request.sourceSnapshot.sourceFingerprint
    || verifiedSource.projectionWatermark !== request.sourceSnapshot.projectionWatermark
    || verifiedSource.projectionVersion !== request.sourceSnapshot.projectionVersion
    || !sameStrings(verifiedSource.evidenceIds, request.sourceSnapshot.evidenceIds)
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.MIXED_SNAPSHOT,
      'The decision source fingerprint does not match its immutable projection snapshot.',
    );
  }
  const validCandidates: NextFocusCandidate[] = [];
  const rejectedCandidates: NextFocusRejectedCandidate[] = [];

  for (const input of request.candidates) {
    const validation = validateNextFocusCandidate(input);
    if (!validation.valid) {
      if (validation.rejections.some((rejection) => rejection.field === 'signals')) {
        throw new NextFocusError(
          NextFocusErrorCodes.INVALID_SIGNAL,
          `Candidate "${candidateId(input) ?? 'unknown'}" has missing or invalid required signal evidence.`,
          { candidateId: candidateId(input) },
        );
      }
      rejectedCandidates.push(Object.freeze({
        candidateId: candidateId(input),
        candidateFingerprint: candidateFingerprint(input),
        rejections: normalizedRejections(validation.rejections),
      }));
      continue;
    }
    assertCandidateSnapshot(validation.candidate, request);
    validCandidates.push(validation.candidate);
  }

  const orderedCandidates = [...validCandidates].sort((left, right) => {
    const idOrder = compareCodeUnits(left.id, right.id);
    return idOrder !== 0 ? idOrder : compareCodeUnits(left.fingerprint, right.fingerprint);
  });
  const firstCandidateById = new Map<string, NextFocusCandidate>();
  for (const candidate of orderedCandidates) {
    if (!firstCandidateById.has(candidate.id)) firstCandidateById.set(candidate.id, candidate);
  }
  const deduplication = deduplicatePivotCandidates(
    orderedCandidates,
    request.priorCandidates ?? [],
    { candidateSimilarityThreshold: NEXT_FOCUS_CANDIDATE_SIMILARITY_THRESHOLD },
  );
  for (const rejected of deduplication.rejected) {
    rejectedCandidates.push(Object.freeze({
      candidateId: rejected.candidate?.id ?? null,
      candidateFingerprint: rejected.candidate?.fingerprint ?? null,
      rejections: normalizedRejections(rejected.rejections),
    }));
  }

  const accepted = deduplication.accepted.map((candidate) => {
    const extended = firstCandidateById.get(candidate.id);
    if (extended === undefined) {
      throw new NextFocusError(
        NextFocusErrorCodes.INVALID_INPUT,
        'The shipped candidate gate returned an unknown accepted candidate.',
        { candidateId: candidate.id },
      );
    }
    return extended;
  });
  const sortedScores = accepted
    .map((candidate) => ({ ...scoreCandidate(candidate), rank: 0 }))
    .sort(compareScoredNextFocusCandidates);
  const rankedFrontier = Object.freeze(sortedScores.map((entry, index) => Object.freeze({
    ...entry,
    rank: index + 1,
  })));
  const identity = decisionIdentity(request);
  const common = Object.freeze({
    decisionId: decisionId(identity),
    identity,
    policyVersion: NEXT_FOCUS_SCORING_POLICY_VERSION,
    sourceSnapshot: request.sourceSnapshot,
    previousFocus: request.previousFocus,
    rankedFrontier,
    rejectedCandidates: canonicalizeNextFocusRejectedCandidates(rejectedCandidates),
    candidateSetFingerprint: candidateSetFingerprint(rankedFrontier),
  });

  if (rankedFrontier.length === 0) {
    return Object.freeze({
      ...common,
      outcome: 'next_focus_unavailable',
      unavailableReason: 'empty_accepted_frontier',
      comparatorTrace: Object.freeze([]),
    });
  }

  const winner = rankedFrontier[0];
  const comparatorTrace: readonly NextFocusComparatorTraceEntry[] = Object.freeze(
    rankedFrontier.slice(1).map((compared) => Object.freeze({
      winnerCandidateId: winner.candidate.id,
      comparedCandidateId: compared.candidate.id,
      decisiveTier: decisiveTier(winner, compared),
    })),
  );
  return Object.freeze({
    ...common,
    outcome: 'next_focus_selected',
    selectedCandidate: winner.candidate,
    comparatorTrace,
  });
}

/** Compare shadow output while leaving the supplied authoritative focus unchanged. */
export function compareNextFocusShadow(
  decision: NextFocusDecision,
  authoritativeFocus: string | null,
): NextFocusShadowComparison {
  const recommendedFocus = decision.outcome === 'next_focus_selected'
    ? decision.selectedCandidate.focus
    : null;
  return Object.freeze({
    decisionId: decision.decisionId,
    authoritativeFocus,
    recommendedFocus,
    matchesAuthority: authoritativeFocus === recommendedFocus,
  });
}
