// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Types
// ───────────────────────────────────────────────────────────────────

import type {
  CycleHealthEventPayload,
  CycleStoppingClockInput,
} from '../cycle-detection/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  BudgetDecision,
  BudgetDimensionValue,
} from '../hierarchical-budgets/index.js';
import type { CoverageCertificate, CoverageUniverse } from '../path-coverage-termination/index.js';
import type { SemanticNoveltyResult } from '../semantic-communities/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const StoppingClockKinds = Object.freeze([
  'budget',
  'novelty_decay',
  'coverage',
  'wall_time',
  'cycle',
] as const);

export type StoppingClockKind = typeof StoppingClockKinds[number];

export const StoppingClockStates = Object.freeze([
  'armed',
  'fired',
  'cleared',
  'not_evaluable',
] as const);

export type StoppingClockState = typeof StoppingClockStates[number];

export type LoopTerminationClass =
  | 'converged'
  | 'cycle_detected'
  | 'diminishing_returns'
  | 'incomplete';

export type StoppingClockEvaluationBoundary =
  | 'pre_dispatch'
  | 'committed_iteration'
  | 'post_receipt';

export type StoppingClockCause =
  | 'budget_exhausted:tokens'
  | 'budget_exhausted:cost'
  | 'budget_exhausted:iterations'
  | 'budget_exhausted:wall_time'
  | 'novelty_decay'
  | 'coverage_complete'
  | 'wall_time_deadline'
  | 'cycle_confirmed';

export type BudgetClockDimension = 'tokens' | 'cost' | 'iterations' | 'wall_time';

export type StoppingClockMode =
  | 'research'
  | 'review'
  | 'context'
  | 'alignment'
  | 'council'
  | 'improvement'
  | 'benchmark';

// ───────────────────────────────────────────────────────────────────
// 2. COMMON OBSERVATION CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Authorized-ledger position against which one clock was evaluated. */
export interface StoppingClockLedgerCursor extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

/** Shared immutable inputs supplied to every source-specific adapter. */
export interface StoppingClockEvaluationContext {
  readonly runLineageId: string;
  readonly profileVersion: string;
  readonly evaluationBoundary: StoppingClockEvaluationBoundary;
  readonly ledgerCursor: StoppingClockLedgerCursor;
  readonly effectiveElapsedMs: number;
  readonly projectionWatermark: string;
  readonly replayFingerprint: string;
}

/** One replayable predicate result contributing to a clock state. */
export interface StoppingClockConditionTrace extends JsonObject {
  readonly condition: string;
  readonly passed: boolean;
  readonly observed: JsonValue;
  readonly expected: JsonValue;
}

/** Canonical observation bytes before the deterministic identity and hash. */
export interface StoppingClockObservationCore extends JsonObject {
  readonly schema_version: 1;
  readonly run_lineage_id: string;
  readonly clock_kind: StoppingClockKind;
  readonly adapter_version: string;
  readonly source_policy_version: string;
  readonly profile_version: string;
  readonly evaluation_boundary: StoppingClockEvaluationBoundary;
  readonly ledger_cursor: StoppingClockLedgerCursor;
  readonly effective_elapsed_ms: number;
  readonly projection_watermark: string;
  readonly replay_fingerprint: string;
  readonly input_fingerprint: string;
  readonly state: StoppingClockState;
  readonly cause: StoppingClockCause;
  readonly termination_class: LoopTerminationClass;
  readonly source_event_ids: string[];
  readonly condition_trace: StoppingClockConditionTrace[];
  readonly detail: JsonObject;
}

/** Independently hashed state emitted by exactly one stopping-clock adapter. */
export interface StoppingClockObservation extends StoppingClockObservationCore {
  readonly observation_id: string;
  readonly observation_hash: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. MODE PROFILE CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Versioned adapter and evaluation-boundary binding for one clock. */
export interface StoppingClockAdapterBinding extends JsonObject {
  readonly clock_kind: StoppingClockKind;
  readonly adapter_version: string;
  readonly evaluation_boundaries: StoppingClockEvaluationBoundary[];
  readonly authority: 'shadow' | 'authoritative';
}

/** Fixed-point novelty-tail thresholds for one mode profile. */
export interface NoveltyDecayClockProfile extends JsonObject {
  readonly policy_version: string;
  readonly warm_up_observations: number;
  readonly observation_window: number;
  readonly patience: number;
  readonly decay_factor_bps: number;
  readonly concept_floor_bps: number;
  readonly independent_evidence_floor_bps: number;
}

/** Owner-policy and freshness thresholds applied to cycle evidence. */
export interface CycleClockProfile extends JsonObject {
  readonly detector_policy_version: string;
  readonly minimum_severity_bps: number;
  readonly minimum_occurrences: number;
  readonly maximum_source_lag_events: number;
}

/** Complete, immutable five-clock contract for one deep-loop mode. */
export interface StoppingClockProfile extends JsonObject {
  readonly mode: StoppingClockMode;
  readonly profile_version: string;
  readonly authority: 'shadow' | 'authoritative';
  readonly required_clocks: StoppingClockKind[];
  readonly adapters: StoppingClockAdapterBinding[];
  readonly budget_policy_version: string;
  readonly novelty_decay: NoveltyDecayClockProfile;
  readonly coverage_profile_version: string;
  readonly cycle: CycleClockProfile;
  readonly monotonic_clock_version: string;
  readonly hard_deadline_ms: number;
  readonly tie_rank_version: string;
  readonly unknown_input_behavior: 'fail_closed';
}

// ───────────────────────────────────────────────────────────────────
// 4. SOURCE ADAPTER INPUTS
// ───────────────────────────────────────────────────────────────────

/** Typed budget denial plus its exact governing unit and scope. */
export interface BudgetClockInput {
  readonly context: StoppingClockEvaluationContext;
  readonly decision: BudgetDecision;
  readonly budgetPolicyVersion: string;
  readonly sourceEventId: string;
  readonly scopePath: readonly string[];
  readonly governingScopeId: string;
  readonly exhaustedDimension: BudgetClockDimension;
  readonly requested: BudgetDimensionValue;
  readonly remaining: BudgetDimensionValue;
  readonly reconciliationState: 'not_required' | 'reconciled' | 'unreconciled';
}

/** One ordered novelty projection included in the deterministic tail fold. */
export interface NoveltyYieldSample {
  readonly iteration: number;
  readonly ledgerSequence: number;
  readonly projectionWatermark: string;
  readonly sourceEventId: string;
  readonly novelty: SemanticNoveltyResult;
}

/** Versioned novelty history evaluated at one committed projection boundary. */
export interface NoveltyDecayClockInput {
  readonly context: StoppingClockEvaluationContext;
  readonly noveltyPolicyVersion: string;
  readonly samples: readonly NoveltyYieldSample[];
}

/** Owner-issued coverage certificate and its active frozen denominator. */
export interface CoverageClockInput {
  readonly context: StoppingClockEvaluationContext;
  readonly certificate: CoverageCertificate;
  readonly activeUniverse: CoverageUniverse;
  readonly sourceEventId: string;
}

/** Monotonic hard-deadline inputs independent from budget accounting. */
export interface WallTimeClockInput {
  readonly context: StoppingClockEvaluationContext;
  readonly monotonicClockVersion: string;
  readonly previousElapsedMs: number | null;
}

/** Owner-issued cycle health evidence and evidence-only clock handoff. */
export interface CycleClockInput {
  readonly context: StoppingClockEvaluationContext;
  readonly healthEvent: CycleHealthEventPayload;
  readonly clockInput: CycleStoppingClockInput;
  readonly healthEventLedgerCursor: StoppingClockLedgerCursor;
}

// ───────────────────────────────────────────────────────────────────
// 5. ARBITRATION AND TERMINATION OUTPUTS
// ───────────────────────────────────────────────────────────────────

/** Durable link retaining the disposition and evidence of work already started. */
export interface InFlightEvidenceLink extends JsonObject {
  readonly dispatch_receipt_id: string;
  readonly dispatch_id: string;
  readonly disposition: 'settle' | 'salvage' | 'cancel';
  readonly status: 'pending' | 'settled' | 'salvaged' | 'cancelled';
  readonly evidence_event_ids: string[];
}

/** Last iteration and dispatch admitted before termination. */
export interface LastAuthorizedWork extends JsonObject {
  readonly iteration_id: string | null;
  readonly dispatch_id: string | null;
  readonly dispatch_receipt_id: string | null;
}

/** Replay-visible ordering decision for one fired observation. */
export interface StoppingClockComparatorTrace extends JsonObject {
  readonly observation_id: string;
  readonly clock_kind: StoppingClockKind;
  readonly effective_elapsed_ms: number;
  readonly ledger_sequence: number;
  readonly tie_rank: number;
  readonly order: number;
}

/** Stable terminal cause derived without relabeling its source clock. */
export interface LoopTerminationCause extends JsonObject {
  readonly observation_id: string;
  readonly clock_kind: StoppingClockKind;
  readonly cause: StoppingClockCause;
  readonly termination_class: LoopTerminationClass;
  readonly effective_elapsed_ms: number;
  readonly ledger_cursor: StoppingClockLedgerCursor;
  readonly source_event_ids: string[];
}

/** Compact ledger trace committing to one complete runtime observation. */
export interface LoopTerminationObservationTrace extends JsonObject {
  readonly observation_id: string;
  readonly observation_hash: string;
  readonly clock_kind: StoppingClockKind;
  readonly state: StoppingClockState;
  readonly cause: StoppingClockCause;
  readonly termination_class: LoopTerminationClass;
  readonly effective_elapsed_ms: number;
  readonly ledger_cursor: StoppingClockLedgerCursor;
  readonly source_event_ids: string[];
  readonly condition_trace_hash: string;
  readonly failed_conditions: string[];
}

/** Self-hash input for a terminal declaration. */
export interface LoopTerminationDeclaredCore extends JsonObject {
  readonly schema_version: 1;
  readonly run_lineage_id: string;
  readonly mode: StoppingClockMode;
  readonly profile_version: string;
  readonly authority: 'shadow' | 'authoritative';
  readonly tie_rank_version: string;
  readonly primary_cause: LoopTerminationCause;
  readonly co_firing_causes: LoopTerminationCause[];
  readonly termination_class: LoopTerminationClass;
  readonly observations: LoopTerminationObservationTrace[];
  readonly comparator_trace: StoppingClockComparatorTrace[];
  readonly authorized_ledger_head: StoppingClockLedgerCursor;
  readonly projection_watermark: string;
  readonly replay_fingerprint: string;
  readonly final_coverage_gaps: string[];
  readonly unresolved_blockers: string[];
  readonly last_authorized_work: LastAuthorizedWork;
  readonly in_flight_evidence: InFlightEvidenceLink[];
  readonly admission: 'reject_new_dispatch';
}

/** Idempotent terminal event payload containing all clock states and co-causes. */
export interface LoopTerminationDeclared extends LoopTerminationDeclaredCore {
  readonly termination_event_id: string;
  readonly termination_event_hash: string;
}

/** Five-clock snapshot and durable evidence supplied to the arbiter. */
export interface StoppingClockArbitrationInput {
  readonly profile: StoppingClockProfile;
  readonly observations: readonly StoppingClockObservation[];
  readonly authorizedLedgerHead: StoppingClockLedgerCursor;
  readonly projectionWatermark: string;
  readonly replayFingerprint: string;
  readonly finalCoverageGaps: readonly string[];
  readonly unresolvedBlockers: readonly string[];
  readonly lastAuthorizedWork: LastAuthorizedWork;
  readonly inFlightEvidence: readonly InFlightEvidenceLink[];
}

export type StoppingClockArbitrationResult =
  | {
      readonly status: 'no_stop';
      readonly authority: 'shadow' | 'authoritative';
      readonly admission: 'allow';
      readonly observations: readonly StoppingClockObservation[];
    }
  | {
      readonly status: 'termination_declared';
      readonly authority: 'shadow' | 'authoritative';
      readonly admission: 'reject_new_dispatch';
      readonly event: LoopTerminationDeclared;
    }
  | {
      readonly status: 'fail_closed';
      readonly authority: 'shadow' | 'authoritative';
      readonly admission: 'reject_new_dispatch';
      readonly reasons: readonly string[];
      readonly observations: readonly StoppingClockObservation[];
    };

/** Additive-dark pairing that preserves the legacy result by identity. */
export interface LegacyConvergenceShadowResult<TLegacy> {
  readonly authority: 'legacy-convergence';
  readonly authoritative: TLegacy;
  readonly stopping_clocks_shadow: StoppingClockArbitrationResult;
}
