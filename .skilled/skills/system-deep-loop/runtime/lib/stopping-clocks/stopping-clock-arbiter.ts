// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Arbiter
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  STOPPING_CLOCK_CAUSES,
  STOPPING_CLOCK_TERMINATION_CLASSES,
} from './stopping-clock-adapters.js';
import {
  STOPPING_CLOCK_TIE_RANK,
  STOPPING_CLOCK_TIE_RANK_VERSION,
  stoppingClockProfiles,
  validateStoppingClockProfile,
} from './stopping-clock-profiles.js';
import { StoppingClockKinds, StoppingClockStates } from './stopping-clock-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  LoopTerminationCause,
  LoopTerminationDeclared,
  LoopTerminationDeclaredCore,
  LoopTerminationObservationTrace,
  StoppingClockArbitrationInput,
  StoppingClockArbitrationResult,
  StoppingClockComparatorTrace,
  StoppingClockKind,
  StoppingClockObservation,
  StoppingClockObservationCore,
} from './stopping-clock-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function tieRank(kind: StoppingClockKind): number {
  return STOPPING_CLOCK_TIE_RANK.indexOf(kind);
}

function causeMatchesClock(observation: Readonly<{
  clock_kind: StoppingClockKind;
  cause: StoppingClockObservation['cause'];
}>): boolean {
  return STOPPING_CLOCK_CAUSES[observation.clock_kind]?.includes(observation.cause) ?? false;
}

function observationCore(
  observation: StoppingClockObservation,
): StoppingClockObservationCore {
  const { observation_id: ignoredId, observation_hash: ignoredHash, ...core } = observation;
  return core;
}

function expectedObservationId(observation: StoppingClockObservation): string {
  return `stopping-clock-observation-${digest({
    run_lineage_id: observation.run_lineage_id,
    clock_kind: observation.clock_kind,
    profile_version: observation.profile_version,
    evaluation_boundary: observation.evaluation_boundary,
    ledger_cursor: observation.ledger_cursor,
    input_fingerprint: observation.input_fingerprint,
  })}`;
}

function observationFailures(
  input: StoppingClockArbitrationInput,
  observation: StoppingClockObservation,
): readonly string[] {
  const failures: string[] = [];
  if (!StoppingClockKinds.includes(observation.clock_kind)) {
    failures.push(`unknown_clock_kind:${observation.clock_kind}`);
    return Object.freeze(failures);
  }
  const binding = input.profile.adapters.find((entry) => (
    entry.clock_kind === observation.clock_kind
  ));
  if (observation.observation_hash !== digest(observationCore(observation))) {
    failures.push(`observation_hash_mismatch:${observation.clock_kind}`);
  }
  if (observation.observation_id !== expectedObservationId(observation)) {
    failures.push(`observation_identity_mismatch:${observation.clock_kind}`);
  }
  if (!binding || binding.adapter_version !== observation.adapter_version) {
    failures.push(`unknown_adapter_version:${observation.clock_kind}`);
  }
  if (!binding?.evaluation_boundaries.includes(observation.evaluation_boundary)) {
    failures.push(`invalid_evaluation_boundary:${observation.clock_kind}`);
  }
  if (observation.run_lineage_id !== input.observations[0]?.run_lineage_id) {
    failures.push(`mixed_run_lineage:${observation.clock_kind}`);
  }
  if (observation.profile_version !== input.profile.profile_version) {
    failures.push(`mixed_profile_version:${observation.clock_kind}`);
  }
  if (observation.projection_watermark !== input.projectionWatermark) {
    failures.push(`mixed_projection_watermark:${observation.clock_kind}`);
  }
  if (observation.replay_fingerprint !== input.replayFingerprint) {
    failures.push(`mixed_replay_fingerprint:${observation.clock_kind}`);
  }
  if (observation.ledger_cursor.ledger_id !== input.authorizedLedgerHead.ledger_id) {
    failures.push(`mixed_ledger:${observation.clock_kind}`);
  }
  if (observation.ledger_cursor.sequence > input.authorizedLedgerHead.sequence) {
    failures.push(`future_ledger_cursor:${observation.clock_kind}`);
  }
  if (
    observation.ledger_cursor.sequence === input.authorizedLedgerHead.sequence
    && observation.ledger_cursor.record_hash !== input.authorizedLedgerHead.record_hash
  ) {
    failures.push(`ledger_head_hash_mismatch:${observation.clock_kind}`);
  }
  if (
    !Number.isSafeInteger(observation.effective_elapsed_ms)
    || observation.effective_elapsed_ms < 0
  ) {
    failures.push(`invalid_elapsed_time:${observation.clock_kind}`);
  }
  if (observation.termination_class !== STOPPING_CLOCK_TERMINATION_CLASSES[observation.clock_kind]) {
    failures.push(`termination_class_relabelled:${observation.clock_kind}`);
  }
  if (!StoppingClockStates.includes(observation.state)) {
    failures.push(`unknown_clock_state:${observation.clock_kind}`);
  }
  if (!causeMatchesClock(observation)) {
    failures.push(`clock_cause_relabelled:${observation.clock_kind}`);
  }
  if (observation.condition_trace.length === 0) {
    failures.push(`missing_condition_trace:${observation.clock_kind}`);
  }
  if (!HASH_PATTERN.test(observation.input_fingerprint)) {
    failures.push(`invalid_input_fingerprint:${observation.clock_kind}`);
  }
  if (observation.state === 'not_evaluable') {
    failures.push(`clock_not_evaluable:${observation.clock_kind}`);
  }
  return Object.freeze(failures);
}

function validateArbitrationInput(input: StoppingClockArbitrationInput): readonly string[] {
  const failures: string[] = [];
  try {
    validateStoppingClockProfile(input.profile);
  } catch {
    failures.push('invalid_profile');
  }
  if (input.profile.tie_rank_version !== STOPPING_CLOCK_TIE_RANK_VERSION) {
    failures.push('unknown_tie_rank_version');
  }
  if (!HASH_PATTERN.test(input.replayFingerprint)) failures.push('invalid_replay_fingerprint');
  if (!HASH_PATTERN.test(input.authorizedLedgerHead.record_hash)) {
    failures.push('invalid_authorized_ledger_head');
  }
  const counts = new Map<StoppingClockKind, number>();
  for (const observation of input.observations) {
    counts.set(observation.clock_kind, (counts.get(observation.clock_kind) ?? 0) + 1);
    failures.push(...observationFailures(input, observation));
  }
  for (const kind of input.profile.required_clocks) {
    if ((counts.get(kind) ?? 0) !== 1) failures.push(`required_clock_count:${kind}`);
  }
  for (const [kind, count] of counts) {
    if (!input.profile.required_clocks.includes(kind) || count !== 1) {
      failures.push(`unexpected_clock_count:${kind}`);
    }
  }
  const receiptIds = input.inFlightEvidence.map((entry) => entry.dispatch_receipt_id);
  if (new Set(receiptIds).size !== receiptIds.length) failures.push('duplicate_in_flight_receipt');
  for (const evidence of input.inFlightEvidence) {
    if (
      evidence.dispatch_receipt_id.trim() === ''
      || evidence.dispatch_id.trim() === ''
      || evidence.evidence_event_ids.some((eventId) => eventId.trim() === '')
    ) {
      failures.push('invalid_in_flight_evidence');
    }
  }
  const coverage = input.observations.find((entry) => entry.clock_kind === 'coverage');
  if (
    coverage?.state === 'fired'
    && (input.finalCoverageGaps.length > 0 || input.unresolvedBlockers.length > 0)
  ) {
    failures.push('coverage_fired_with_unresolved_state');
  }
  return Object.freeze([...new Set(failures)].sort(compareText));
}

function compareFired(
  left: StoppingClockObservation,
  right: StoppingClockObservation,
): number {
  return left.effective_elapsed_ms - right.effective_elapsed_ms
    || left.ledger_cursor.sequence - right.ledger_cursor.sequence
    || tieRank(left.clock_kind) - tieRank(right.clock_kind)
    || compareText(left.observation_id, right.observation_id);
}

function cause(observation: StoppingClockObservation): LoopTerminationCause {
  return {
    observation_id: observation.observation_id,
    clock_kind: observation.clock_kind,
    cause: observation.cause,
    termination_class: observation.termination_class,
    effective_elapsed_ms: observation.effective_elapsed_ms,
    ledger_cursor: observation.ledger_cursor,
    source_event_ids: [...observation.source_event_ids],
  };
}

function traceCause(observation: LoopTerminationObservationTrace): LoopTerminationCause {
  return {
    observation_id: observation.observation_id,
    clock_kind: observation.clock_kind,
    cause: observation.cause,
    termination_class: observation.termination_class,
    effective_elapsed_ms: observation.effective_elapsed_ms,
    ledger_cursor: observation.ledger_cursor,
    source_event_ids: [...observation.source_event_ids],
  };
}

function comparatorTrace(
  fired: readonly (StoppingClockObservation | LoopTerminationObservationTrace)[],
): StoppingClockComparatorTrace[] {
  return fired.map((observation, index) => ({
    observation_id: observation.observation_id,
    clock_kind: observation.clock_kind,
    effective_elapsed_ms: observation.effective_elapsed_ms,
    ledger_sequence: observation.ledger_cursor.sequence,
    tie_rank: tieRank(observation.clock_kind),
    order: index + 1,
  }));
}

function sortedObservations(
  observations: readonly StoppingClockObservation[],
): StoppingClockObservation[] {
  return [...observations].sort((left, right) => (
    tieRank(left.clock_kind) - tieRank(right.clock_kind)
      || compareText(left.observation_id, right.observation_id)
  ));
}

function terminationObservationTrace(
  observation: StoppingClockObservation,
): LoopTerminationObservationTrace {
  return {
    observation_id: observation.observation_id,
    observation_hash: observation.observation_hash,
    clock_kind: observation.clock_kind,
    state: observation.state,
    cause: observation.cause,
    termination_class: observation.termination_class,
    effective_elapsed_ms: observation.effective_elapsed_ms,
    ledger_cursor: observation.ledger_cursor,
    source_event_ids: [...observation.source_event_ids],
    condition_trace_hash: digest(observation.condition_trace),
    failed_conditions: observation.condition_trace
      .filter((entry) => !entry.passed)
      .map((entry) => entry.condition),
  };
}

function terminationEvent(
  input: StoppingClockArbitrationInput,
  fired: readonly StoppingClockObservation[],
): LoopTerminationDeclared {
  const primary = fired[0];
  const sameBoundary = fired.filter((candidate) => (
    candidate.effective_elapsed_ms === primary.effective_elapsed_ms
    && candidate.ledger_cursor.sequence === primary.ledger_cursor.sequence
  ));
  const runLineageId = primary.run_lineage_id;
  const core: LoopTerminationDeclaredCore = {
    schema_version: 1,
    run_lineage_id: runLineageId,
    mode: input.profile.mode,
    profile_version: input.profile.profile_version,
    authority: input.profile.authority,
    tie_rank_version: input.profile.tie_rank_version,
    primary_cause: cause(primary),
    co_firing_causes: sameBoundary.slice(1).map(cause),
    termination_class: primary.termination_class,
    observations: sortedObservations(input.observations).map(terminationObservationTrace),
    comparator_trace: comparatorTrace(fired),
    authorized_ledger_head: input.authorizedLedgerHead,
    projection_watermark: input.projectionWatermark,
    replay_fingerprint: input.replayFingerprint,
    final_coverage_gaps: [...new Set(input.finalCoverageGaps)].sort(compareText),
    unresolved_blockers: [...new Set(input.unresolvedBlockers)].sort(compareText),
    last_authorized_work: input.lastAuthorizedWork,
    in_flight_evidence: [...input.inFlightEvidence].sort((left, right) => (
      compareText(left.dispatch_receipt_id, right.dispatch_receipt_id)
    )),
    admission: 'reject_new_dispatch',
  };
  const identity = {
    run_lineage_id: runLineageId,
    profile_version: input.profile.profile_version,
  };
  return immutableJsonClone({
    ...core,
    termination_event_id: `loop-termination-${digest(identity)}`,
    termination_event_hash: digest(core),
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Compose five independent observations without altering any adapter state. */
export function arbitrateStoppingClocks(
  input: StoppingClockArbitrationInput,
): StoppingClockArbitrationResult {
  const failures = validateArbitrationInput(input);
  if (failures.length > 0) {
    return Object.freeze({
      status: 'fail_closed',
      authority: input.profile.authority,
      admission: 'reject_new_dispatch',
      reasons: failures,
      observations: Object.freeze(sortedObservations(input.observations)),
    });
  }
  const fired = input.observations
    .filter((observation) => observation.state === 'fired')
    .sort(compareFired);
  if (fired.length === 0) {
    return Object.freeze({
      status: 'no_stop',
      authority: input.profile.authority,
      admission: 'allow',
      observations: Object.freeze(sortedObservations(input.observations)),
    });
  }
  return Object.freeze({
    status: 'termination_declared',
    authority: input.profile.authority,
    admission: 'reject_new_dispatch',
    event: terminationEvent(input, fired),
  });
}

/** Validate the complete self-hashed terminal payload at its ledger boundary. */
export function validateLoopTerminationDeclared(
  candidate: Readonly<JsonObject>,
): candidate is LoopTerminationDeclared {
  try {
    const event = candidate as unknown as LoopTerminationDeclared;
    if (
      event.schema_version !== 1
      || typeof event.termination_event_id !== 'string'
      || !event.termination_event_id.startsWith('loop-termination-')
      || typeof event.termination_event_hash !== 'string'
      || !HASH_PATTERN.test(event.termination_event_hash)
      || !Array.isArray(event.observations)
      || !Array.isArray(event.co_firing_causes)
      || !Array.isArray(event.comparator_trace)
      || event.admission !== 'reject_new_dispatch'
      || event.tie_rank_version !== STOPPING_CLOCK_TIE_RANK_VERSION
    ) {
      return false;
    }
    const profile = stoppingClockProfiles.resolve(event.mode, event.profile_version);
    if (event.authority !== profile.authority) return false;
    const { termination_event_id: ignoredId, termination_event_hash: ignoredHash, ...core } = event;
    if (digest(core) !== event.termination_event_hash) return false;
    if (event.termination_class !== event.primary_cause.termination_class) return false;
    if (
      event.termination_class
      !== STOPPING_CLOCK_TERMINATION_CLASSES[event.primary_cause.clock_kind]
    ) {
      return false;
    }
    const observations = new Map(event.observations.map((entry) => [entry.observation_id, entry]));
    const observedKinds = event.observations.map((entry) => entry.clock_kind);
    if (
      observations.size !== event.observations.length
      || event.observations.length !== StoppingClockKinds.length
      || new Set(observedKinds).size !== StoppingClockKinds.length
      || StoppingClockKinds.some((kind) => !observedKinds.includes(kind))
    ) {
      return false;
    }
    if (event.observations.some((entry) => (
      !StoppingClockKinds.includes(entry.clock_kind)
      || !StoppingClockStates.includes(entry.state)
      || !HASH_PATTERN.test(entry.observation_hash)
      || !HASH_PATTERN.test(entry.condition_trace_hash)
      || entry.termination_class !== STOPPING_CLOCK_TERMINATION_CLASSES[entry.clock_kind]
      || !causeMatchesClock(entry)
      || entry.ledger_cursor.ledger_id !== event.authorized_ledger_head.ledger_id
      || entry.ledger_cursor.sequence > event.authorized_ledger_head.sequence
      || (entry.ledger_cursor.sequence === event.authorized_ledger_head.sequence
        && entry.ledger_cursor.record_hash !== event.authorized_ledger_head.record_hash)
      || new Set(entry.source_event_ids).size !== entry.source_event_ids.length
      || entry.source_event_ids.some((sourceId) => sourceId.trim() === '')
      || new Set(entry.failed_conditions).size !== entry.failed_conditions.length
      || entry.failed_conditions.some((condition) => condition.trim() === '')
    ))) {
      return false;
    }
    const fired = event.observations
      .filter((entry) => entry.state === 'fired')
      .sort((left, right) => (
        left.effective_elapsed_ms - right.effective_elapsed_ms
          || left.ledger_cursor.sequence - right.ledger_cursor.sequence
          || tieRank(left.clock_kind) - tieRank(right.clock_kind)
          || compareText(left.observation_id, right.observation_id)
      ));
    if (fired.length === 0) return false;
    if (canonicalJson(event.primary_cause) !== canonicalJson(traceCause(fired[0]))) {
      return false;
    }
    const expectedEventId = `loop-termination-${digest({
      run_lineage_id: event.run_lineage_id,
      profile_version: event.profile_version,
    })}`;
    if (event.termination_event_id !== expectedEventId) return false;
    const primary = fired[0];
    const expectedCoFiring = fired.slice(1).filter((entry) => (
      entry.effective_elapsed_ms === primary.effective_elapsed_ms
      && entry.ledger_cursor.sequence === primary.ledger_cursor.sequence
    )).map(traceCause);
    return canonicalJson(expectedCoFiring) === canonicalJson(event.co_firing_causes)
      && canonicalJson(comparatorTrace(fired)) === canonicalJson(event.comparator_trace);
  } catch {
    return false;
  }
}
