// ───────────────────────────────────────────────────────────────────
// MODULE: Next Focus Replay
// ──────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { validateNextFocusCandidate } from './next-focus-candidates.js';
import {
  NEXT_FOCUS_SCORING_POLICY_VERSION,
  canonicalizeNextFocusRejectedCandidates,
  compareScoredNextFocusCandidates,
} from './next-focus-selection.js';
import {
  NEXT_FOCUS_SELECTED_EVENT_TYPE,
  NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE,
} from './next-focus-events.js';
import { NextFocusError, NextFocusErrorCodes } from './next-focus-errors.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  NextFocusCandidate,
  NextFocusComparatorTier,
  NextFocusComparatorTraceEntry,
  NextFocusDecision,
  NextFocusDecisionIdentity,
  NextFocusRejectedCandidate,
  NextFocusSourceSnapshot,
  ReplayedNextFocusDecision,
  ScoredNextFocusCandidate,
} from './next-focus-types.js';

const NOVELTY_COMPLEMENT_BPS = 10_000;

function integrity(message: string, decisionId?: string): NextFocusError {
  return new NextFocusError(
    NextFocusErrorCodes.REPLAY_INTEGRITY,
    message,
    decisionId === undefined ? {} : { decisionId },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw integrity(`Stored ${field} must be a non-empty string.`);
  }
  return value;
}

function requireNullableString(value: unknown, field: string): string | null {
  if (value === null) return null;
  return requireString(value, field);
}

function requireInteger(value: unknown, field: string, minimum = 0): number {
  if (!Number.isSafeInteger(value) || (value as number) < minimum) {
    throw integrity(`Stored ${field} must be an integer greater than or equal to ${minimum}.`);
  }
  return value as number;
}

function requireStringArray(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw integrity(`Stored ${field} must contain non-empty strings.`);
  }
  const strings = value.map((entry) => requireString(entry, field));
  return Object.freeze(strings);
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return sha256Bytes(canonicalBytes(left)) === sha256Bytes(canonicalBytes(right));
}

function sourceFrom(payload: Readonly<JsonObject>): NextFocusSourceSnapshot {
  const evidenceIds = requireStringArray(payload.source_evidence_ids, 'source_evidence_ids');
  const snapshot = Object.freeze({
    projectionWatermark: requireString(
      payload.source_projection_watermark,
      'source_projection_watermark',
    ),
    projectionVersion: requireString(
      payload.source_projection_version,
      'source_projection_version',
    ),
    evidenceIds,
    sourceFingerprint: requireString(payload.source_fingerprint, 'source_fingerprint'),
  });
  const expected = sha256Bytes(canonicalBytes({
    projectionWatermark: snapshot.projectionWatermark,
    projectionVersion: snapshot.projectionVersion,
    evidenceIds: snapshot.evidenceIds,
  }));
  if (snapshot.sourceFingerprint !== expected) {
    throw integrity('Stored source fingerprint does not match its projection snapshot.');
  }
  return snapshot;
}

function identityFrom(value: unknown): NextFocusDecisionIdentity {
  if (!isRecord(value)) throw integrity('Stored decision_identity must be an object.');
  const policyVersion = requireString(value.policyVersion, 'decision_identity.policyVersion');
  if (policyVersion !== NEXT_FOCUS_SCORING_POLICY_VERSION) {
    throw integrity('Stored decision identity uses an unsupported scoring policy.');
  }
  return Object.freeze({
    runId: requireString(value.runId, 'decision_identity.runId'),
    sourceIteration: requireInteger(
      value.sourceIteration,
      'decision_identity.sourceIteration',
    ),
    projectionWatermark: requireString(
      value.projectionWatermark,
      'decision_identity.projectionWatermark',
    ),
    policyVersion,
  });
}

function candidateFrom(value: unknown, source: NextFocusSourceSnapshot): NextFocusCandidate {
  const validation = validateNextFocusCandidate(value);
  if (!validation.valid) throw integrity('Stored frontier contains an invalid next-focus candidate.');
  const candidate = validation.candidate;
  if (
    candidate.projectionWatermark !== source.projectionWatermark
    || candidate.projectionVersion !== source.projectionVersion
    || candidate.sourceFingerprint !== source.sourceFingerprint
    || !sameCanonical(candidate.snapshotEvidenceIds, source.evidenceIds)
    || !sameCanonical(candidate.evidenceRefs, source.evidenceIds)
  ) {
    throw integrity(`Stored candidate "${candidate.id}" cites a different projection snapshot.`);
  }
  if (!sameCanonical(value, candidate)) {
    throw integrity(`Stored candidate "${candidate.id}" is not in canonical validated form.`);
  }
  return candidate;
}

function scoredFrom(value: unknown, source: NextFocusSourceSnapshot): ScoredNextFocusCandidate {
  if (!isRecord(value)) throw integrity('Stored ranked frontier entry must be an object.');
  const candidate = candidateFrom(value.candidate, source);
  const entry = Object.freeze({
    rank: requireInteger(value.rank, 'rank', 1),
    candidate,
    coverageGapBps: requireInteger(value.coverageGapBps, 'coverageGapBps'),
    contradictionUrgencyBps: requireInteger(
      value.contradictionUrgencyBps,
      'contradictionUrgencyBps',
    ),
    noveltyDecayBps: requireInteger(value.noveltyDecayBps, 'noveltyDecayBps'),
    scoreBps: requireInteger(value.scoreBps, 'scoreBps'),
  });
  if (
    entry.coverageGapBps !== candidate.signals.coverageGap.bps
    || entry.contradictionUrgencyBps !== candidate.signals.contradictionUrgency.bps
    || entry.noveltyDecayBps !== candidate.signals.noveltyDecay.bps
    || entry.scoreBps !== entry.coverageGapBps
      + entry.contradictionUrgencyBps
      + (NOVELTY_COMPLEMENT_BPS - entry.noveltyDecayBps)
  ) {
    throw integrity(`Stored score for candidate "${candidate.id}" is inconsistent.`);
  }
  return entry;
}

function decisiveTier(
  winner: ScoredNextFocusCandidate,
  compared: ScoredNextFocusCandidate,
): NextFocusComparatorTier {
  if (winner.scoreBps !== compared.scoreBps) return 'score';
  if (winner.contradictionUrgencyBps !== compared.contradictionUrgencyBps) {
    return 'contradiction_urgency';
  }
  if (winner.coverageGapBps !== compared.coverageGapBps) return 'coverage_gap';
  if (winner.noveltyDecayBps !== compared.noveltyDecayBps) return 'novelty_decay';
  return 'candidate_id';
}

function traceFrom(
  value: unknown,
  frontier: readonly ScoredNextFocusCandidate[],
): readonly NextFocusComparatorTraceEntry[] {
  if (!Array.isArray(value)) throw integrity('Stored comparator_trace must be an array.');
  if (frontier.length === 0) {
    if (value.length !== 0) throw integrity('Unavailable decisions cannot contain comparator trace entries.');
    return Object.freeze([]);
  }
  const winner = frontier[0];
  const expected = frontier.slice(1).map((compared) => ({
    winnerCandidateId: winner.candidate.id,
    comparedCandidateId: compared.candidate.id,
    decisiveTier: decisiveTier(winner, compared),
  }));
  if (!sameCanonical(value, expected)) {
    throw integrity('Stored comparator trace does not match the ranked frontier.');
  }
  return Object.freeze(expected.map((entry) => Object.freeze(entry)));
}

function rejectedFrom(value: unknown): readonly NextFocusRejectedCandidate[] {
  if (!Array.isArray(value)) throw integrity('Stored rejected_candidates must be an array.');
  const rejectedCandidates = value.map((entry) => {
    if (!isRecord(entry) || !Array.isArray(entry.rejections)) {
      throw integrity('Stored rejected candidate entry is malformed.');
    }
    const rejected: NextFocusRejectedCandidate = {
      candidateId: entry.candidateId === null
        ? null
        : requireString(entry.candidateId, 'rejected candidate id'),
      candidateFingerprint: entry.candidateFingerprint === null
        ? null
        : requireString(entry.candidateFingerprint, 'rejected candidate fingerprint'),
      rejections: entry.rejections as NextFocusRejectedCandidate['rejections'],
    };
    return Object.freeze(rejected);
  });
  const canonical = canonicalizeNextFocusRejectedCandidates(rejectedCandidates);
  if (!sameCanonical(value, canonical)) {
    throw integrity('Stored rejected candidates violate the canonical rejection order.');
  }
  return canonical;
}

function candidateFingerprint(frontier: readonly ScoredNextFocusCandidate[]): string {
  return sha256Bytes(canonicalBytes(frontier.map((entry) => ({
    rank: entry.rank,
    candidate: entry.candidate,
    coverageGapBps: entry.coverageGapBps,
    contradictionUrgencyBps: entry.contradictionUrgencyBps,
    noveltyDecayBps: entry.noveltyDecayBps,
    scoreBps: entry.scoreBps,
  }))));
}

function parseDecision(payload: Readonly<JsonObject>, eventType: string): NextFocusDecision {
  const decisionId = requireString(payload.decision_id, 'decision_id');
  const identity = identityFrom(payload.decision_identity);
  const sourceSnapshot = sourceFrom(payload);
  if (identity.projectionWatermark !== sourceSnapshot.projectionWatermark) {
    throw integrity('Decision identity and source snapshot use different watermarks.', decisionId);
  }
  const expectedDecisionId = `next-focus-${sha256Bytes(canonicalBytes(identity))}`;
  if (decisionId !== expectedDecisionId) {
    throw integrity('Stored decision id does not match its immutable identity.', decisionId);
  }
  if (payload.policy_version !== NEXT_FOCUS_SCORING_POLICY_VERSION) {
    throw integrity('Stored decision uses an unsupported scoring policy.', decisionId);
  }
  if (!Array.isArray(payload.ranked_frontier)) {
    throw integrity('Stored ranked_frontier must be an array.', decisionId);
  }
  const rankedFrontier = Object.freeze(payload.ranked_frontier.map((entry, index) => {
    const scored = scoredFrom(entry, sourceSnapshot);
    if (scored.rank !== index + 1) {
      throw integrity('Stored frontier ranks must be contiguous and one-based.', decisionId);
    }
    return scored;
  }));
  const sorted = [...rankedFrontier].sort(compareScoredNextFocusCandidates);
  if (!sameCanonical(rankedFrontier, sorted)) {
    throw integrity('Stored frontier violates the deterministic total order.', decisionId);
  }
  const storedFingerprint = requireString(
    payload.candidate_set_fingerprint,
    'candidate_set_fingerprint',
  );
  if (storedFingerprint !== candidateFingerprint(rankedFrontier)) {
    throw integrity('Stored candidate-set fingerprint does not match the frontier.', decisionId);
  }
  const comparatorTrace = traceFrom(payload.comparator_trace, rankedFrontier);
  const common = {
    decisionId,
    identity,
    policyVersion: NEXT_FOCUS_SCORING_POLICY_VERSION,
    sourceSnapshot,
    previousFocus: requireNullableString(payload.previous_focus, 'previous_focus'),
    rankedFrontier,
    rejectedCandidates: rejectedFrom(payload.rejected_candidates),
    candidateSetFingerprint: storedFingerprint,
    comparatorTrace,
  };

  if (payload.outcome === 'next_focus_selected' && eventType === NEXT_FOCUS_SELECTED_EVENT_TYPE) {
    if (rankedFrontier.length === 0) throw integrity('Selected decision has an empty frontier.');
    const selectedCandidate = candidateFrom(payload.selected_candidate, sourceSnapshot);
    if (!sameCanonical(selectedCandidate, rankedFrontier[0].candidate)) {
      throw integrity('Stored selected candidate is not the ranked winner.', decisionId);
    }
    return Object.freeze({ ...common, outcome: 'next_focus_selected', selectedCandidate });
  }
  if (
    payload.outcome === 'next_focus_unavailable'
    && eventType === NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE
    && payload.unavailable_reason === 'empty_accepted_frontier'
  ) {
    if (rankedFrontier.length !== 0) throw integrity('Unavailable decision has a non-empty frontier.');
    return Object.freeze({
      ...common,
      outcome: 'next_focus_unavailable',
      unavailableReason: 'empty_accepted_frontier',
    });
  }
  throw integrity('Stored event type and next-focus outcome are inconsistent.', decisionId);
}

/** Restore the recorded recommendation from verified events without deriving a new ranking. */
export function replayNextFocusDecision(
  events: readonly VerifiedLedgerEvent[],
  decisionId: string,
): ReplayedNextFocusDecision {
  const matches = events.filter(
    (entry) => entry.event.effective.envelope.event_id === decisionId,
  );
  if (matches.length === 0) {
    throw integrity(`No verified next-focus event exists for "${decisionId}".`, decisionId);
  }
  const first = matches[0].event.effective.envelope;
  const firstDigest = sha256Bytes(canonicalBytes(first.payload));
  for (const match of matches.slice(1)) {
    const envelope = match.event.effective.envelope;
    if (
      envelope.event_type !== first.event_type
      || sha256Bytes(canonicalBytes(envelope.payload)) !== firstDigest
    ) {
      throw new NextFocusError(
        NextFocusErrorCodes.CONFLICTING_REPLAY,
        `Verified events reuse decision identity "${decisionId}" with different semantics.`,
        { decisionId },
      );
    }
  }
  const decision = parseDecision(first.payload, first.event_type);
  return Object.freeze({
    decision,
    restoredFocus: decision.outcome === 'next_focus_selected'
      ? decision.selectedCandidate.focus
      : null,
  });
}
