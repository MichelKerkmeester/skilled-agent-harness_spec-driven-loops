// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Adapters
// ───────────────────────────────────────────────────────────────────

import {
  createCycleHealthEventPayload,
  CycleProgressVerdicts,
  cycleStoppingClockInput,
} from '../cycle-detection/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  BudgetReasonCodes,
  compareBudgetValues,
} from '../hierarchical-budgets/index.js';
import {
  isCoverageCertificateCurrent,
  validateCoverageUniverse,
} from '../path-coverage-termination/index.js';
import {
  STOPPING_CLOCK_ADAPTER_VERSIONS,
  validateStoppingClockProfile,
} from './stopping-clock-profiles.js';

import type { CycleEvaluationResult } from '../cycle-detection/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  BudgetClockDimension,
  BudgetClockInput,
  CoverageClockInput,
  CycleClockInput,
  LoopTerminationClass,
  NoveltyDecayClockInput,
  NoveltyYieldSample,
  StoppingClockCause,
  StoppingClockConditionTrace,
  StoppingClockEvaluationContext,
  StoppingClockKind,
  StoppingClockObservation,
  StoppingClockObservationCore,
  StoppingClockProfile,
  StoppingClockState,
  WallTimeClockInput,
} from './stopping-clock-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND VALIDATION
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const BASIS_POINTS = 10_000;

export const STOPPING_CLOCK_TERMINATION_CLASSES: Readonly<
  Record<StoppingClockKind, LoopTerminationClass>
> = Object.freeze({
  budget: 'incomplete',
  novelty_decay: 'diminishing_returns',
  coverage: 'converged',
  wall_time: 'incomplete',
  cycle: 'cycle_detected',
});

/** Closed cause vocabulary prevents adapters and replay payloads from relabeling clocks. */
export const STOPPING_CLOCK_CAUSES: Readonly<
  Record<StoppingClockKind, readonly StoppingClockCause[]>
> = Object.freeze({
  budget: Object.freeze([
    'budget_exhausted:tokens',
    'budget_exhausted:cost',
    'budget_exhausted:iterations',
    'budget_exhausted:wall_time',
  ] as const),
  novelty_decay: Object.freeze(['novelty_decay'] as const),
  coverage: Object.freeze(['coverage_complete'] as const),
  wall_time: Object.freeze(['wall_time_deadline'] as const),
  cycle: Object.freeze(['cycle_confirmed'] as const),
});

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function isIdentity(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 4_096;
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function trace(
  condition: string,
  passed: boolean,
  observed: JsonValue,
  expected: JsonValue,
): StoppingClockConditionTrace {
  return { condition, passed, observed, expected };
}

function validateContext(
  context: StoppingClockEvaluationContext,
  profile: StoppingClockProfile,
  kind: StoppingClockKind,
): readonly string[] {
  const binding = profile.adapters.find((entry) => entry.clock_kind === kind);
  const failures: string[] = [];
  if (!isIdentity(context.runLineageId)) failures.push('invalid_run_lineage');
  if (context.profileVersion !== profile.profile_version) failures.push('profile_version_mismatch');
  if (!binding) failures.push('missing_adapter_binding');
  if (binding && !binding.evaluation_boundaries.includes(context.evaluationBoundary)) {
    failures.push('invalid_evaluation_boundary');
  }
  if (!isIdentity(context.ledgerCursor.ledger_id)) failures.push('invalid_ledger_id');
  if (!isNonNegativeInteger(context.ledgerCursor.sequence)) failures.push('invalid_ledger_sequence');
  if (!HASH_PATTERN.test(context.ledgerCursor.record_hash)) failures.push('invalid_ledger_hash');
  if (!isNonNegativeInteger(context.effectiveElapsedMs)) failures.push('invalid_elapsed_time');
  if (!isIdentity(context.projectionWatermark)) failures.push('invalid_projection_watermark');
  if (!HASH_PATTERN.test(context.replayFingerprint)) failures.push('invalid_replay_fingerprint');
  return Object.freeze(failures);
}

function observation(
  context: StoppingClockEvaluationContext,
  kind: StoppingClockKind,
  adapterVersion: string,
  sourcePolicyVersion: string,
  state: StoppingClockState,
  cause: StoppingClockCause,
  sourceEventIds: readonly string[],
  conditionTrace: readonly StoppingClockConditionTrace[],
  detail: JsonObject,
  sourceInput: unknown,
): StoppingClockObservation {
  const inputFingerprint = digest(sourceInput);
  const core: StoppingClockObservationCore = {
    schema_version: 1,
    run_lineage_id: context.runLineageId,
    clock_kind: kind,
    adapter_version: adapterVersion,
    source_policy_version: sourcePolicyVersion,
    profile_version: context.profileVersion,
    evaluation_boundary: context.evaluationBoundary,
    ledger_cursor: context.ledgerCursor,
    effective_elapsed_ms: context.effectiveElapsedMs,
    projection_watermark: context.projectionWatermark,
    replay_fingerprint: context.replayFingerprint,
    input_fingerprint: inputFingerprint,
    state,
    cause,
    termination_class: STOPPING_CLOCK_TERMINATION_CLASSES[kind],
    source_event_ids: [...new Set(sourceEventIds)].sort(),
    condition_trace: [...conditionTrace],
    detail,
  };
  const identity = {
    run_lineage_id: core.run_lineage_id,
    clock_kind: core.clock_kind,
    profile_version: core.profile_version,
    evaluation_boundary: core.evaluation_boundary,
    ledger_cursor: core.ledger_cursor,
    input_fingerprint: core.input_fingerprint,
  };
  return immutableJsonClone({
    ...core,
    observation_id: `stopping-clock-observation-${digest(identity)}`,
    observation_hash: digest(core),
  });
}

function notEvaluable(
  context: StoppingClockEvaluationContext,
  kind: StoppingClockKind,
  sourcePolicyVersion: string,
  cause: StoppingClockCause,
  sourceEventIds: readonly string[],
  failures: readonly string[],
  sourceInput: unknown,
): StoppingClockObservation {
  return observation(
    context,
    kind,
    STOPPING_CLOCK_ADAPTER_VERSIONS[kind],
    sourcePolicyVersion,
    'not_evaluable',
    cause,
    sourceEventIds,
    failures.map((failure) => trace(failure, false, failure, 'valid')),
    { failures: [...failures] },
    sourceInput,
  );
}

function profileFor(profile: StoppingClockProfile): StoppingClockProfile {
  return validateStoppingClockProfile(profile);
}

function budgetCause(dimension: BudgetClockDimension): StoppingClockCause {
  return `budget_exhausted:${dimension}` as StoppingClockCause;
}

function budgetValueDimension(value: BudgetClockInput['requested']): BudgetClockDimension {
  return value.kind === 'wall-time' ? 'wall_time' : value.kind;
}

// ───────────────────────────────────────────────────────────────────
// 2. BUDGET CLOCK
// ───────────────────────────────────────────────────────────────────

/** Translate an authoritative typed budget decision without recalculating budget policy. */
export function observeBudgetClock(
  input: BudgetClockInput,
  candidateProfile: StoppingClockProfile,
): StoppingClockObservation {
  const profile = profileFor(candidateProfile);
  const cause = budgetCause(input.exhaustedDimension);
  const source = {
    decision: input.decision,
    budget_policy_version: input.budgetPolicyVersion,
    scope_path: input.scopePath,
    governing_scope_id: input.governingScopeId,
    exhausted_dimension: input.exhaustedDimension,
    requested: input.requested,
    remaining: input.remaining,
    reconciliation_state: input.reconciliationState,
    source_event_id: input.sourceEventId,
  };
  const failures = [...validateContext(input.context, profile, 'budget')];
  if (input.budgetPolicyVersion !== profile.budget_policy_version) {
    failures.push('unknown_budget_policy_version');
  }
  if (!isIdentity(input.sourceEventId)) failures.push('invalid_source_event_id');
  if (
    input.scopePath.length === 0
    || input.scopePath.some((scopeId) => !isIdentity(scopeId))
    || !input.scopePath.includes(input.governingScopeId)
  ) {
    failures.push('invalid_governing_scope_path');
  }
  if (
    budgetValueDimension(input.requested) !== input.exhaustedDimension
    || budgetValueDimension(input.remaining) !== input.exhaustedDimension
  ) {
    failures.push('budget_dimension_mismatch');
  }
  let requestExceedsRemaining = false;
  try {
    requestExceedsRemaining = compareBudgetValues(input.requested, input.remaining) > 0;
  } catch {
    failures.push('budget_unit_mismatch');
  }
  if (input.reconciliationState === 'unreconciled') failures.push('unreconciled_budget_state');
  if (failures.length > 0) {
    return notEvaluable(
      input.context,
      'budget',
      input.budgetPolicyVersion,
      cause,
      [input.sourceEventId],
      failures,
      source,
    );
  }

  const isExhaustion = input.decision.status === 'denied'
    && (
      input.decision.reasonCode === BudgetReasonCodes.BUDGET_EXHAUSTED
      || input.decision.reasonCode === BudgetReasonCodes.DEADLINE_EXHAUSTED
    );
  const hasExactDeadlineDimension = input.decision.reasonCode !== BudgetReasonCodes.DEADLINE_EXHAUSTED
    || input.exhaustedDimension === 'wall_time';
  const isConsistent = input.decision.reasonCode === BudgetReasonCodes.DEADLINE_EXHAUSTED
    ? hasExactDeadlineDimension
    : !isExhaustion || requestExceedsRemaining;
  const conditions = [
    trace('typed_exhaustion_or_deadline_denial', isExhaustion, input.decision.reasonCode,
      [BudgetReasonCodes.BUDGET_EXHAUSTED, BudgetReasonCodes.DEADLINE_EXHAUSTED]),
    trace('exact_exhausted_dimension', isConsistent, input.exhaustedDimension,
      budgetValueDimension(input.requested)),
    trace('budget_reconciled', true, input.reconciliationState, ['not_required', 'reconciled']),
  ];
  const state: StoppingClockState = isExhaustion && isConsistent
    ? 'fired'
    : input.decision.status === 'granted' || input.decision.reasonCode === BudgetReasonCodes.ALLOWED
      ? 'armed'
      : 'not_evaluable';
  return observation(
    input.context,
    'budget',
    STOPPING_CLOCK_ADAPTER_VERSIONS.budget,
    input.budgetPolicyVersion,
    state,
    cause,
    [input.sourceEventId],
    conditions,
    {
      governing_scope_id: input.governingScopeId,
      scope_path: [...input.scopePath],
      exhausted_dimension: input.exhaustedDimension,
      requested: input.requested as unknown as JsonObject,
      remaining: input.remaining as unknown as JsonObject,
      reason_code: input.decision.reasonCode,
      reconciliation_state: input.reconciliationState,
    },
    source,
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. NOVELTY-DECAY CLOCK
// ───────────────────────────────────────────────────────────────────

interface NoveltyTailPoint extends JsonObject {
  readonly iteration: number;
  readonly concept_tail_bps: number;
  readonly evidence_tail_bps: number;
}

function sampleYields(sample: NoveltyYieldSample): readonly [number, number] | null {
  const conceptConsistent = (
    sample.novelty.concept === 'new_community'
      ? sample.novelty.concept_novelty_increment === 1
      : sample.novelty.concept_novelty_increment === 0
  );
  const evidenceConsistent = (
    sample.novelty.evidence === 'new_evidence'
      ? sample.novelty.evidence_novelty_increment > 0
      : sample.novelty.evidence_novelty_increment === 0
  );
  if (!conceptConsistent || !evidenceConsistent) return null;
  return [
    sample.novelty.concept === 'new_community' ? BASIS_POINTS : 0,
    sample.novelty.evidence === 'new_evidence' ? BASIS_POINTS : 0,
  ];
}

function foldTail(previous: number, current: number, decayFactorBps: number): number {
  return Math.floor(
    (previous * decayFactorBps + current * (BASIS_POINTS - decayFactorBps))
      / BASIS_POINTS,
  );
}

/** Fold owner-projected concept and evidence novelty into a replay-stable decay tail. */
export function observeNoveltyDecayClock(
  input: NoveltyDecayClockInput,
  candidateProfile: StoppingClockProfile,
): StoppingClockObservation {
  const profile = profileFor(candidateProfile);
  const policy = profile.novelty_decay;
  const source = {
    novelty_policy_version: input.noveltyPolicyVersion,
    samples: input.samples,
  };
  const sourceEventIds = input.samples.map((sample) => sample.sourceEventId);
  const failures = [...validateContext(input.context, profile, 'novelty_decay')];
  if (input.noveltyPolicyVersion !== policy.policy_version) {
    failures.push('unknown_novelty_policy_version');
  }
  if (input.samples.length === 0) failures.push('missing_novelty_samples');
  if (input.samples.length > policy.observation_window) failures.push('novelty_window_exceeded');
  if (new Set(sourceEventIds).size !== sourceEventIds.length) {
    failures.push('duplicate_novelty_source_event');
  }
  for (const [index, sample] of input.samples.entries()) {
    if (!isIdentity(sample.sourceEventId)) failures.push('invalid_novelty_source_event');
    if (!isIdentity(sample.projectionWatermark)) failures.push('invalid_novelty_watermark');
    if (!Number.isSafeInteger(sample.iteration) || sample.iteration <= 0) {
      failures.push('invalid_novelty_iteration');
    }
    if (!Number.isSafeInteger(sample.ledgerSequence) || sample.ledgerSequence <= 0) {
      failures.push('invalid_novelty_ledger_sequence');
    }
    if (index > 0 && (
      sample.iteration <= input.samples[index - 1].iteration
      || sample.ledgerSequence <= input.samples[index - 1].ledgerSequence
    )) {
      failures.push('non_monotonic_novelty_history');
    }
    if (sampleYields(sample) === null) failures.push('inconsistent_novelty_projection');
  }
  const latest = input.samples.at(-1);
  if (
    latest
    && (
      latest.projectionWatermark !== input.context.projectionWatermark
      || latest.ledgerSequence > input.context.ledgerCursor.sequence
    )
  ) {
    failures.push('stale_or_future_novelty_projection');
  }
  if (failures.length > 0) {
    return notEvaluable(
      input.context,
      'novelty_decay',
      input.noveltyPolicyVersion,
      'novelty_decay',
      sourceEventIds,
      [...new Set(failures)],
      source,
    );
  }

  let conceptTailBps = BASIS_POINTS;
  let evidenceTailBps = BASIS_POINTS;
  const tail: NoveltyTailPoint[] = [];
  for (const sample of input.samples) {
    const [conceptYieldBps, evidenceYieldBps] = sampleYields(sample) as readonly [number, number];
    conceptTailBps = foldTail(conceptTailBps, conceptYieldBps, policy.decay_factor_bps);
    evidenceTailBps = foldTail(evidenceTailBps, evidenceYieldBps, policy.decay_factor_bps);
    tail.push({
      iteration: sample.iteration,
      concept_tail_bps: conceptTailBps,
      evidence_tail_bps: evidenceTailBps,
    });
  }
  const patientTail = tail.slice(-policy.patience);
  const warm = input.samples.length >= policy.warm_up_observations;
  const windowComplete = input.samples.length === policy.observation_window;
  const hasPatience = patientTail.length === policy.patience;
  const belowFloors = hasPatience && patientTail.every((point) => (
    point.concept_tail_bps < policy.concept_floor_bps
    && point.evidence_tail_bps < policy.independent_evidence_floor_bps
  ));
  const fired = warm && windowComplete && belowFloors;
  return observation(
    input.context,
    'novelty_decay',
    STOPPING_CLOCK_ADAPTER_VERSIONS.novelty_decay,
    input.noveltyPolicyVersion,
    fired ? 'fired' : 'armed',
    'novelty_decay',
    sourceEventIds,
    [
      trace('warm_up_complete', warm, input.samples.length, policy.warm_up_observations),
      trace('observation_window_complete', windowComplete, input.samples.length,
        policy.observation_window),
      trace('patience_window_complete', hasPatience, patientTail.length, policy.patience),
      trace('concept_tail_below_floor', hasPatience && patientTail.every((point) => (
        point.concept_tail_bps < policy.concept_floor_bps
      )), patientTail.map((point) => point.concept_tail_bps), policy.concept_floor_bps),
      trace('evidence_tail_below_floor', hasPatience && patientTail.every((point) => (
        point.evidence_tail_bps < policy.independent_evidence_floor_bps
      )), patientTail.map((point) => point.evidence_tail_bps),
      policy.independent_evidence_floor_bps),
    ],
    {
      decay_factor_bps: policy.decay_factor_bps,
      concept_floor_bps: policy.concept_floor_bps,
      independent_evidence_floor_bps: policy.independent_evidence_floor_bps,
      tail,
    },
    source,
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. COVERAGE CLOCK
// ───────────────────────────────────────────────────────────────────

function coverageHashIsValid(input: CoverageClockInput): boolean {
  const { certificateHash, ...core } = input.certificate;
  return digest(core) === certificateHash;
}

function coverageCertificateClosesUniverse(input: CoverageClockInput): boolean {
  const certificatePaths = new Map(input.certificate.paths.map((path) => [path.pathId, path]));
  const majorRegions = new Set(input.activeUniverse.paths.map((path) => path.regionId));
  return certificatePaths.size === input.activeUniverse.paths.length
    && input.certificate.denominator === input.activeUniverse.paths.length
    && input.certificate.closedPathCount === input.activeUniverse.paths.length
    && input.certificate.totalMajorRegions === majorRegions.size
    && input.certificate.addressedMajorRegions === majorRegions.size
    && input.activeUniverse.paths.every((path) => {
      const certificatePath = certificatePaths.get(path.pathId);
      if (!certificatePath) return false;
      const evidenceClasses = new Set(certificatePath.evidence.map((entry) => entry.evidenceClass));
      return certificatePath.regionId === path.regionId
        && certificatePath.mandatory === path.mandatory
        && certificatePath.major === path.major
        && certificatePath.weight === path.weight
        && canonicalJson(certificatePath.requiredEvidenceClasses)
          === canonicalJson(path.requiredEvidenceClasses)
        && (certificatePath.state === 'addressed' || certificatePath.state === 'excluded')
        && certificatePath.blockerIds.length === 0
        && (certificatePath.state === 'addressed'
          ? certificatePath.exclusion === null
          : certificatePath.exclusion !== null)
        && path.requiredEvidenceClasses.every((evidenceClass) => (
          evidenceClasses.has(evidenceClass)
        ));
    });
}

/** Accept only the coverage owner's complete, current, zero-gap certificate. */
export function observeCoverageClock(
  input: CoverageClockInput,
  candidateProfile: StoppingClockProfile,
): StoppingClockObservation {
  const profile = profileFor(candidateProfile);
  const source = {
    certificate: input.certificate,
    active_universe_id: input.activeUniverse.universeId,
    source_event_id: input.sourceEventId,
  };
  const failures = [...validateContext(input.context, profile, 'coverage')];
  if (!isIdentity(input.sourceEventId)) failures.push('invalid_coverage_source_event');
  if (input.certificate.profileVersion !== profile.coverage_profile_version) {
    failures.push('unknown_coverage_profile_version');
  }
  if (!coverageHashIsValid(input)) failures.push('coverage_certificate_hash_mismatch');
  for (const failure of validateCoverageUniverse(input.activeUniverse)) {
    failures.push(`invalid_coverage_universe:${failure}`);
  }
  if (!isCoverageCertificateCurrent(input.certificate, input.activeUniverse)) {
    failures.push('stale_coverage_certificate');
  }
  if (input.certificate.runId !== input.context.runLineageId) {
    failures.push('coverage_run_lineage_mismatch');
  }
  if (input.certificate.replayFingerprint !== input.context.replayFingerprint) {
    failures.push('coverage_replay_fingerprint_mismatch');
  }
  if (
    input.activeUniverse.runId !== input.context.runLineageId
    || input.activeUniverse.mode !== profile.mode
    || input.activeUniverse.profileVersion !== profile.coverage_profile_version
  ) {
    failures.push('coverage_universe_identity_mismatch');
  }
  if (
    input.certificate.mode !== profile.mode
    || input.certificate.inputFingerprint !== input.activeUniverse.inputFingerprint
    || input.certificate.replayFingerprint !== input.activeUniverse.replayFingerprint
    || input.certificate.communityProjectionVersion
      !== input.activeUniverse.communityProjectionVersion
    || input.certificate.relationshipProjectionVersion
      !== input.activeUniverse.relationshipProjectionVersion
  ) {
    failures.push('coverage_certificate_universe_mismatch');
  }
  if (!input.certificate.projectionFresh) failures.push('stale_coverage_projection');
  if (failures.length > 0) {
    return notEvaluable(
      input.context,
      'coverage',
      input.certificate.profileVersion,
      'coverage_complete',
      [input.sourceEventId],
      failures,
      source,
    );
  }

  const validStop = input.certificate.decision === 'STOP_ALLOWED'
    && input.certificate.projectionFresh
    && input.certificate.denominator > 0
    && input.certificate.closedPathCount === input.certificate.denominator
    && input.certificate.addressedMajorRegions === input.certificate.totalMajorRegions
    && input.certificate.openPathIds.length === 0
    && input.certificate.blockerIds.length === 0
    && input.certificate.unresolvedContradictionIds.length === 0
    && input.certificate.ambiguousMajorCommunityIds.length === 0
    && input.certificate.triggeredLimit === null
    && coverageCertificateClosesUniverse(input);
  return observation(
    input.context,
    'coverage',
    STOPPING_CLOCK_ADAPTER_VERSIONS.coverage,
    input.certificate.profileVersion,
    validStop ? 'fired' : 'armed',
    'coverage_complete',
    [input.sourceEventId],
    [
      trace('coverage_decision_stop_allowed', input.certificate.decision === 'STOP_ALLOWED',
        input.certificate.decision, 'STOP_ALLOWED'),
      trace('coverage_projection_fresh', input.certificate.projectionFresh,
        input.certificate.projectionFresh, true),
      trace('coverage_zero_gaps', input.certificate.openPathIds.length === 0,
        [...input.certificate.openPathIds], []),
      trace('coverage_zero_blockers', input.certificate.blockerIds.length === 0,
        [...input.certificate.blockerIds], []),
      trace('coverage_zero_critical_contradictions',
        input.certificate.unresolvedContradictionIds.length === 0,
        [...input.certificate.unresolvedContradictionIds], []),
      trace('coverage_certificate_closes_universe', coverageCertificateClosesUniverse(input),
        input.certificate.closedPathCount, input.activeUniverse.paths.length),
    ],
    {
      certificate_hash: input.certificate.certificateHash,
      decision: input.certificate.decision,
      universe_id: input.certificate.universeId,
      universe_version: input.certificate.universeVersion,
      open_path_ids: [...input.certificate.openPathIds],
      blocker_ids: [...input.certificate.blockerIds],
      unresolved_contradiction_ids: [...input.certificate.unresolvedContradictionIds],
    },
    source,
  );
}

// ───────────────────────────────────────────────────────────────────
// 5. WALL-TIME CLOCK
// ───────────────────────────────────────────────────────────────────

/** Evaluate an explicit monotonic deadline independently from budgeted wall time. */
export function observeWallTimeClock(
  input: WallTimeClockInput,
  candidateProfile: StoppingClockProfile,
): StoppingClockObservation {
  const profile = profileFor(candidateProfile);
  const source = {
    monotonic_clock_version: input.monotonicClockVersion,
    current_elapsed_ms: input.context.effectiveElapsedMs,
    previous_elapsed_ms: input.previousElapsedMs,
    hard_deadline_ms: profile.hard_deadline_ms,
  };
  const failures = [...validateContext(input.context, profile, 'wall_time')];
  if (input.monotonicClockVersion !== profile.monotonic_clock_version) {
    failures.push('unknown_monotonic_clock_version');
  }
  if (
    input.previousElapsedMs !== null
    && (
      !isNonNegativeInteger(input.previousElapsedMs)
      || input.context.effectiveElapsedMs < input.previousElapsedMs
    )
  ) {
    failures.push('non_monotonic_elapsed_time');
  }
  if (failures.length > 0) {
    return notEvaluable(
      input.context,
      'wall_time',
      input.monotonicClockVersion,
      'wall_time_deadline',
      [],
      failures,
      source,
    );
  }
  const fired = input.context.effectiveElapsedMs >= profile.hard_deadline_ms;
  return observation(
    input.context,
    'wall_time',
    STOPPING_CLOCK_ADAPTER_VERSIONS.wall_time,
    input.monotonicClockVersion,
    fired ? 'fired' : 'armed',
    'wall_time_deadline',
    [],
    [trace('hard_deadline_reached', fired, input.context.effectiveElapsedMs,
      profile.hard_deadline_ms)],
    {
      monotonic_clock_version: input.monotonicClockVersion,
      previous_elapsed_ms: input.previousElapsedMs,
      hard_deadline_ms: profile.hard_deadline_ms,
    },
    source,
  );
}

// ───────────────────────────────────────────────────────────────────
// 6. CYCLE CLOCK
// ───────────────────────────────────────────────────────────────────

/** Translate confirmed detector evidence without performing any cycle comparison. */
export function observeCycleClock(
  input: CycleClockInput,
  candidateProfile: StoppingClockProfile,
): StoppingClockObservation {
  const profile = profileFor(candidateProfile);
  const policy = profile.cycle;
  let expectedClockInput: CycleClockInput['clockInput'] | null = null;
  const source = {
    health_event: input.healthEvent,
    clock_input: input.clockInput,
    health_event_ledger_cursor: input.healthEventLedgerCursor,
  };
  const failures = [...validateContext(input.context, profile, 'cycle')];
  try {
    const evaluation: CycleEvaluationResult = {
      status: input.healthEvent.health_state,
      detectorPolicyVersion: input.healthEvent.detector_policy_version,
      evidence: {
        run_lineage_id: input.healthEvent.run_lineage_id,
        detector_policy_version: input.healthEvent.detector_policy_version,
        signature_kind: input.healthEvent.signature_kind,
        period: input.healthEvent.period,
        occurrence_count: input.healthEvent.occurrence_count,
        start_iteration: input.healthEvent.start_iteration,
        end_iteration: input.healthEvent.end_iteration,
        start_cursor: input.healthEvent.start_cursor,
        end_cursor: input.healthEvent.end_cursor,
        source_fingerprints: input.healthEvent.source_fingerprints,
        trace: input.healthEvent.trace,
        progress_assessment: input.healthEvent.progress_assessment,
      },
    };
    const reminted = createCycleHealthEventPayload(evaluation, input.healthEvent.run_lineage_id);
    if (canonicalJson(reminted) !== canonicalJson(input.healthEvent)) {
      failures.push('invalid_cycle_health_event');
    }
    expectedClockInput = cycleStoppingClockInput(reminted);
  } catch {
    failures.push('invalid_cycle_health_event');
  }
  if (input.healthEvent.detector_policy_version !== policy.detector_policy_version) {
    failures.push('unknown_cycle_detector_policy');
  }
  if (
    expectedClockInput === null
    || canonicalJson(input.clockInput) !== canonicalJson(expectedClockInput)
  ) {
    failures.push('forged_cycle_clock_input');
  }
  if (input.healthEvent.run_lineage_id !== input.context.runLineageId) {
    failures.push('cycle_run_lineage_mismatch');
  }
  if (
    input.healthEventLedgerCursor.ledger_id !== input.context.ledgerCursor.ledger_id
    || input.healthEventLedgerCursor.sequence > input.context.ledgerCursor.sequence
    || input.context.ledgerCursor.sequence - input.healthEventLedgerCursor.sequence
      > policy.maximum_source_lag_events
    || !HASH_PATTERN.test(input.healthEventLedgerCursor.record_hash)
  ) {
    failures.push('stale_or_future_cycle_event');
  }
  if (failures.length > 0) {
    return notEvaluable(
      input.context,
      'cycle',
      input.healthEvent.detector_policy_version,
      'cycle_confirmed',
      [input.healthEvent.health_event_id],
      failures,
      source,
    );
  }

  const confirmed = input.healthEvent.health_state === 'cycle_confirmed';
  const severityMet = input.clockInput.severity_bps >= policy.minimum_severity_bps;
  const persistenceMet = input.healthEvent.occurrence_count >= policy.minimum_occurrences;
  const noProgress = input.healthEvent.progress_assessment.verdict
    === CycleProgressVerdicts.NO_PROGRESS;
  const fired = confirmed
    && input.clockInput.contributes_to_stopping_clock
    && severityMet
    && persistenceMet
    && noProgress;
  const state: StoppingClockState = fired
    ? 'fired'
    : input.healthEvent.health_state === 'cycle_cleared'
      ? 'cleared'
      : 'armed';
  return observation(
    input.context,
    'cycle',
    STOPPING_CLOCK_ADAPTER_VERSIONS.cycle,
    input.healthEvent.detector_policy_version,
    state,
    'cycle_confirmed',
    [input.healthEvent.health_event_id],
    [
      trace('detector_event_confirmed', confirmed, input.healthEvent.health_state,
        'cycle_confirmed'),
      trace('severity_threshold_met', severityMet, input.clockInput.severity_bps,
        policy.minimum_severity_bps),
      trace('persistence_threshold_met', persistenceMet, input.healthEvent.occurrence_count,
        policy.minimum_occurrences),
      trace('detector_reports_no_progress', noProgress,
        input.healthEvent.progress_assessment.verdict, CycleProgressVerdicts.NO_PROGRESS),
    ],
    {
      health_event_id: input.healthEvent.health_event_id,
      health_state: input.healthEvent.health_state,
      severity_bps: input.clockInput.severity_bps,
      signature_kind: input.healthEvent.signature_kind,
      period: input.healthEvent.period,
      occurrence_count: input.healthEvent.occurrence_count,
      progress_verdict: input.healthEvent.progress_assessment.verdict,
    },
    source,
  );
}
