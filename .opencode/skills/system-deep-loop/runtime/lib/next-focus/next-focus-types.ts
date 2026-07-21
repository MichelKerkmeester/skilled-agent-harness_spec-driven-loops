// ──────────────────────────────────────────────────────────────────
// MODULE: Next Focus Types
// ──────────────────────────────────────────────────────────────────

import type { PivotCandidate, PivotCandidateRejection } from '../deep-loop/pivot-candidates.js';
import type { CoverageGap } from '../coverage-graph/coverage-graph-query.js';
import type { DurableAppendReceipt } from '../authorized-ledger/index.js';

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

export interface CoverageGapRegionInput extends NextFocusRegionBase {
  readonly kind: 'coverage_gap';
  readonly gap: CoverageGap;
  readonly coverageGap: RequiredNextFocusSignal;
}

export interface OpenContradictionRegionInput extends NextFocusRegionBase {
  readonly kind: 'open_contradiction';
  readonly relationshipId: string;
  readonly contradictionUrgency: RequiredNextFocusSignal;
}

export interface UnderCoveredCommunityRegionInput extends NextFocusRegionBase {
  readonly kind: 'under_covered_community';
  readonly communityId: string;
  readonly coverageGap: RequiredNextFocusSignal;
}

export type NextFocusRegionInput =
  | CoverageGapRegionInput
  | OpenContradictionRegionInput
  | UnderCoveredCommunityRegionInput;

export interface NextFocusDerivationSnapshot {
  readonly projectionWatermark: string;
  readonly projectionVersion: string;
  readonly evidenceIds: readonly string[];
  readonly regions: readonly NextFocusRegionInput[];
}

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

export interface NextFocusComparatorTraceEntry {
  readonly winnerCandidateId: string;
  readonly comparedCandidateId: string;
  readonly decisiveTier: NextFocusComparatorTier;
}

export interface NextFocusRejectedCandidate {
  readonly candidateId: string | null;
  readonly candidateFingerprint: string | null;
  readonly rejections: readonly PivotCandidateRejection[];
}

export interface NextFocusDecisionIdentity {
  readonly runId: string;
  readonly sourceIteration: number;
  readonly projectionWatermark: string;
  readonly policyVersion: string;
}

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

export interface NextFocusSelectedDecision extends NextFocusDecisionBase {
  readonly outcome: 'next_focus_selected';
  readonly selectedCandidate: NextFocusCandidate;
}

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

export interface NextFocusRecordResult {
  readonly receipt: DurableAppendReceipt;
  readonly idempotent: boolean;
}

export interface ReplayedNextFocusDecision {
  readonly decision: NextFocusDecision;
  readonly restoredFocus: string | null;
}
