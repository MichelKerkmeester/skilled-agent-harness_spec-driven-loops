// ──────────────────────────────────────────────────────────────────
// MODULE: Next Focus Types
// ──────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type { PivotCandidate, PivotCandidateRejection } from '../deep-loop/pivot-candidates.js';
import type { CoverageGap } from '../coverage-graph/coverage-graph-query.js';
import type { DurableAppendReceipt } from '../authorized-ledger/index.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Region kinds eligible for the shadow next-focus frontier. */
export type NextFocusRegionKind =
  | 'coverage_gap'
  | 'open_contradiction'
  | 'under_covered_community';

export type NextFocusSignalName =
  | 'coverageGap'
  | 'contradictionUrgency'
  | 'noveltyDecay';

/** An observed signal that must carry snapshot evidence. */
export interface RequiredNextFocusSignal {
  readonly applicability: 'required';
  readonly bps: number;
  readonly evidenceIds: readonly string[];
}

/** An explicit adapter declaration that a signal does not apply. */
export interface NonApplicableNextFocusSignal {
  readonly applicability: 'not_applicable';
  readonly bps: 0;
  readonly evidenceIds: readonly [];
  readonly rationale: string;
}

export type NextFocusSignal = RequiredNextFocusSignal | NonApplicableNextFocusSignal;

/** The three scoring signals every candidate declares, each either evidenced or explicitly not applicable. */
export interface NextFocusSignals {
  readonly coverageGap: NextFocusSignal;
  readonly contradictionUrgency: NextFocusSignal;
  readonly noveltyDecay: NextFocusSignal;
}

/** One candidate tied to an immutable projection snapshot. */
export interface NextFocusCandidate extends PivotCandidate {
  readonly regionKind: NextFocusRegionKind;
  readonly regionId: string;
  readonly projectionWatermark: string;
  readonly projectionVersion: string;
  readonly snapshotEvidenceIds: readonly string[];
  readonly sourceFingerprint: string;
  readonly signals: NextFocusSignals;
}

export type NextFocusCandidateValidation =
  | { readonly valid: true; readonly candidate: NextFocusCandidate }
  | { readonly valid: false; readonly rejections: readonly PivotCandidateRejection[] };

/** Projection identity, sorted unique evidence ids and the fingerprint over them, shared by every candidate in one decision. */
export interface NextFocusSourceSnapshot {
  readonly projectionWatermark: string;
  readonly projectionVersion: string;
  readonly evidenceIds: readonly string[];
  readonly sourceFingerprint: string;
}

interface NextFocusRegionBase {
  readonly candidateId: string;
  readonly title: string;
  readonly focus: string;
  readonly relevanceRationale: string;
  readonly boundaryRationale: string;
  readonly seatProvenance: readonly string[];
  readonly noveltyDecay: RequiredNextFocusSignal;
}

/** Region input for a coverage-graph gap; it must carry required coverage-gap evidence. */
export interface CoverageGapRegionInput extends NextFocusRegionBase {
  readonly kind: 'coverage_gap';
  readonly gap: CoverageGap;
  readonly coverageGap: RequiredNextFocusSignal;
}

/** Region input for an open contradiction relationship; it must carry required contradiction-urgency evidence. */
export interface OpenContradictionRegionInput extends NextFocusRegionBase {
  readonly kind: 'open_contradiction';
  readonly relationshipId: string;
  readonly contradictionUrgency: RequiredNextFocusSignal;
}

/** Region input for an under-covered semantic community; it must carry required coverage-gap evidence. */
export interface UnderCoveredCommunityRegionInput extends NextFocusRegionBase {
  readonly kind: 'under_covered_community';
  readonly communityId: string;
  readonly coverageGap: RequiredNextFocusSignal;
}

export type NextFocusRegionInput =
  | CoverageGapRegionInput
  | OpenContradictionRegionInput
  | UnderCoveredCommunityRegionInput;

/** One projection snapshot and its regions, so every derived candidate shares the same watermark and version. */
export interface NextFocusDerivationSnapshot {
  readonly projectionWatermark: string;
  readonly projectionVersion: string;
  readonly evidenceIds: readonly string[];
  readonly regions: readonly NextFocusRegionInput[];
}

/** A ranked frontier entry: its 1-based rank, the per-signal basis-point components and the combined score. */
export interface ScoredNextFocusCandidate {
  readonly rank: number;
  readonly candidate: NextFocusCandidate;
  readonly coverageGapBps: number;
  readonly contradictionUrgencyBps: number;
  readonly noveltyDecayBps: number;
  readonly scoreBps: number;
}

export type NextFocusComparatorTier =
  | 'score'
  | 'contradiction_urgency'
  | 'coverage_gap'
  | 'novelty_decay'
  | 'candidate_id';

/** Records which comparator tier decided the order between the winner and one compared candidate. */
export interface NextFocusComparatorTraceEntry {
  readonly winnerCandidateId: string;
  readonly comparedCandidateId: string;
  readonly decisiveTier: NextFocusComparatorTier;
}

/** A candidate refused at validation, with its id and fingerprint when readable (otherwise null) and the reasons. */
export interface NextFocusRejectedCandidate {
  readonly candidateId: string | null;
  readonly candidateFingerprint: string | null;
  readonly rejections: readonly PivotCandidateRejection[];
}

/** The run, source iteration, projection watermark and policy version that identify one decision. */
export interface NextFocusDecisionIdentity {
  readonly runId: string;
  readonly sourceIteration: number;
  readonly projectionWatermark: string;
  readonly policyVersion: string;
}

/** Selection input; a source snapshot that does not match the expected watermark and version makes selection throw. */
export interface NextFocusSelectionRequest {
  readonly runId: string;
  readonly sourceIteration: number;
  readonly expectedProjectionWatermark: string;
  readonly expectedProjectionVersion: string;
  readonly sourceSnapshot: NextFocusSourceSnapshot;
  readonly candidates: readonly unknown[];
  readonly priorCandidates?: readonly unknown[];
  readonly previousFocus: string | null;
}

interface NextFocusDecisionBase {
  readonly decisionId: string;
  readonly identity: NextFocusDecisionIdentity;
  readonly policyVersion: string;
  readonly sourceSnapshot: NextFocusSourceSnapshot;
  readonly previousFocus: string | null;
  readonly rankedFrontier: readonly ScoredNextFocusCandidate[];
  readonly rejectedCandidates: readonly NextFocusRejectedCandidate[];
  readonly candidateSetFingerprint: string;
  readonly comparatorTrace: readonly NextFocusComparatorTraceEntry[];
}

/** A decision with a non-empty accepted frontier, carrying the selected candidate. */
export interface NextFocusSelectedDecision extends NextFocusDecisionBase {
  readonly outcome: 'next_focus_selected';
  readonly selectedCandidate: NextFocusCandidate;
}

/** A decision recorded when the accepted frontier is empty, so no focus is recommended. */
export interface NextFocusUnavailableDecision extends NextFocusDecisionBase {
  readonly outcome: 'next_focus_unavailable';
  readonly unavailableReason: 'empty_accepted_frontier';
}

export type NextFocusDecision = NextFocusSelectedDecision | NextFocusUnavailableDecision;

/** Observation only; the legacy focus remains authoritative. */
export interface NextFocusShadowComparison {
  readonly decisionId: string;
  readonly authoritativeFocus: string | null;
  readonly recommendedFocus: string | null;
  readonly matchesAuthority: boolean;
}

/** Ledger receipt for a recorded decision; idempotent is true when an identical event already existed and nothing was appended. */
export interface NextFocusRecordResult {
  readonly receipt: DurableAppendReceipt;
  readonly idempotent: boolean;
}

/** A decision restored from verified events, with the selected focus, or null when the decision was unavailable. */
export interface ReplayedNextFocusDecision {
  readonly decision: NextFocusDecision;
  readonly restoredFocus: string | null;
}
