// ──────────────────────────────────────────────────────────────────
// MODULE: Next Focus Public API
// ──────────────────────────────────────────────────────────────────

export {
  createNextFocusSourceSnapshot,
  deriveNextFocusCandidates,
  validateNextFocusCandidate,
} from './next-focus-candidates.js';
export {
  NEXT_FOCUS_CANDIDATE_SIMILARITY_THRESHOLD,
  NEXT_FOCUS_SCORING_POLICY_VERSION,
  compareNextFocusShadow,
  compareScoredNextFocusCandidates,
  selectNextFocus,
} from './next-focus-selection.js';
export {
  NEXT_FOCUS_EVENT_VERSION,
  NEXT_FOCUS_SELECTED_EVENT_TYPE,
  NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE,
  createNextFocusEventRegistry,
  nextFocusEventDefinitions,
  prepareNextFocusEvent,
  recordNextFocusDecision,
} from './next-focus-events.js';
export { replayNextFocusDecision } from './next-focus-replay.js';
export { NextFocusError, NextFocusErrorCodes } from './next-focus-errors.js';

export type {
  CoverageGapRegionInput,
  NextFocusCandidate,
  NextFocusCandidateValidation,
  NextFocusComparatorTier,
  NextFocusComparatorTraceEntry,
  NextFocusDecision,
  NextFocusDecisionIdentity,
  NextFocusDerivationSnapshot,
  NextFocusRecordResult,
  NextFocusRegionInput,
  NextFocusRegionKind,
  NextFocusRejectedCandidate,
  NextFocusSelectedDecision,
  NextFocusSelectionRequest,
  NextFocusShadowComparison,
  NextFocusSignal,
  NextFocusSignalName,
  NextFocusSignals,
  NextFocusSourceSnapshot,
  NextFocusUnavailableDecision,
  NonApplicableNextFocusSignal,
  OpenContradictionRegionInput,
  ReplayedNextFocusDecision,
  RequiredNextFocusSignal,
  ScoredNextFocusCandidate,
  UnderCoveredCommunityRegionInput,
} from './next-focus-types.js';
export type { NextFocusErrorCode } from './next-focus-errors.js';
export type { NextFocusEventInput } from './next-focus-events.js';
