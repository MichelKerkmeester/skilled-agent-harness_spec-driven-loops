// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Cycle History Projection
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  CYCLE_DETECTOR_POLICY_VERSION,
  assertCycleDetectorPolicy,
  resolveCycleDetectorPolicy,
} from './cycle-detection-policy.js';
import {
  CycleDetectionError,
  CycleDetectionErrorCodes,
} from './cycle-detection-types.js';
import { verifyCycleObservation } from './cycle-observation.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  CycleHistoryEvictionBoundary,
  CycleHistoryProjection,
  CycleObservation,
} from './cycle-detection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HISTORY HASHING
// ───────────────────────────────────────────────────────────────────

const EMPTY_EVICTION_CHAIN_HASH = sha256Bytes(canonicalBytes({
  domain: 'deep-loop-cycle-history-eviction-v1',
  state: 'empty',
}));

function historyCore(
  history: CycleHistoryProjection,
): Omit<CycleHistoryProjection, 'history_hash'> {
  const { history_hash: ignored, ...core } = history;
  void ignored;
  return core;
}

function historyHash(history: Omit<CycleHistoryProjection, 'history_hash'>): string {
  return sha256Bytes(canonicalBytes(history));
}

function evictionBoundary(observation: CycleObservation): CycleHistoryEvictionBoundary {
  return {
    iteration: observation.iteration,
    ledger_cursor: observation.ledger_cursor,
    observation_id: observation.observation_id,
    observation_fingerprint: observation.observation_fingerprint,
  };
}

function nextEvictionChain(
  priorChainHash: string,
  evicted: CycleObservation,
): string {
  return sha256Bytes(canonicalBytes({
    domain: 'deep-loop-cycle-history-eviction-v1',
    prior_chain_hash: priorChainHash,
    evicted: evictionBoundary(evicted),
  }));
}

// ───────────────────────────────────────────────────────────────────
// 2. PROJECTION REDUCER
// ───────────────────────────────────────────────────────────────────

/** Create the empty projection for one exact detector policy generation. */
export function createCycleHistoryProjection(
  policyVersion = CYCLE_DETECTOR_POLICY_VERSION,
): CycleHistoryProjection {
  const policy = resolveCycleDetectorPolicy(policyVersion);
  const core: Omit<CycleHistoryProjection, 'history_hash'> = {
    schema_version: policy.history_schema_version,
    reducer_version: policy.history_reducer_version,
    detector_policy_version: policy.policy_version,
    detector_policy_digest: policy.policy_digest,
    run_lineage_id: null,
    observations: [],
    evicted_count: 0,
    evicted_through: null,
    eviction_chain_hash: EMPTY_EVICTION_CHAIN_HASH,
  };
  return immutableJsonClone({
    ...core,
    history_hash: historyHash(core),
  } as CycleHistoryProjection);
}

function assertObservationOrder(
  previous: CycleObservation,
  next: CycleObservation,
): void {
  if (next.iteration !== previous.iteration + 1) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_GAP,
      'Cycle history requires contiguous completed iteration numbers',
      { previousIteration: previous.iteration, nextIteration: next.iteration },
    );
  }
  if (
    next.ledger_cursor.ledger_id !== previous.ledger_cursor.ledger_id
    || next.ledger_cursor.sequence <= previous.ledger_cursor.sequence
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_GAP,
      'Cycle history requires a stable ledger identity and monotonic cursor',
      {
        previousSequence: previous.ledger_cursor.sequence,
        nextSequence: next.ledger_cursor.sequence,
      },
    );
  }
}

/** Apply one new immutable observation and retain exactly the latest policy window. */
export function applyCycleObservation(
  history: Readonly<CycleHistoryProjection>,
  observation: Readonly<CycleObservation>,
): CycleHistoryProjection {
  verifyCycleHistoryProjection(history);
  verifyCycleObservation(observation);
  const policy = assertCycleDetectorPolicy(
    history.detector_policy_version,
    history.detector_policy_digest,
  );
  if (
    observation.detector_policy_version !== policy.policy_version
    || observation.detector_policy_digest !== policy.policy_digest
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Observation and history use different detector policy generations',
    );
  }
  if (
    history.run_lineage_id !== null
    && history.run_lineage_id !== observation.run_lineage_id
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_CONFLICT,
      'Cycle history cannot combine different run lineages',
      {
        historyRunLineageId: history.run_lineage_id,
        observationRunLineageId: observation.run_lineage_id,
      },
    );
  }
  const last = history.observations.at(-1);
  if (last) {
    assertObservationOrder(last, observation);
  } else if (observation.iteration !== 1) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_GAP,
      'Cycle history must begin at the first completed run iteration',
      { firstIteration: observation.iteration },
    );
  }
  if (history.observations.some((entry) => (
    entry.observation_id === observation.observation_id
    || entry.iteration === observation.iteration
  ))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_CONFLICT,
      'Cycle history observation identity or iteration is already present',
      { observationId: observation.observation_id, iteration: observation.iteration },
    );
  }

  const observations = [
    ...history.observations,
    immutableJsonClone(observation),
  ];
  let evictedCount = history.evicted_count;
  let evictedThrough = history.evicted_through;
  let evictionChainHash = history.eviction_chain_hash;
  if (observations.length > policy.history_window) {
    const evicted = observations.shift();
    if (!evicted) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.HISTORY_CONFLICT,
        'Cycle history eviction did not identify an oldest observation',
      );
    }
    evictionChainHash = nextEvictionChain(evictionChainHash, evicted);
    evictedCount += 1;
    evictedThrough = evictionBoundary(evicted);
  }
  const core: Omit<CycleHistoryProjection, 'history_hash'> = {
    schema_version: policy.history_schema_version,
    reducer_version: policy.history_reducer_version,
    detector_policy_version: policy.policy_version,
    detector_policy_digest: policy.policy_digest,
    run_lineage_id: history.run_lineage_id ?? observation.run_lineage_id,
    observations,
    evicted_count: evictedCount,
    evicted_through: evictedThrough,
    eviction_chain_hash: evictionChainHash,
  };
  return immutableJsonClone({
    ...core,
    history_hash: historyHash(core),
  } as CycleHistoryProjection);
}

/** Full replay deliberately uses the same single-observation reducer as incremental work. */
export function replayCycleHistory(
  observations: readonly CycleObservation[],
  policyVersion = CYCLE_DETECTOR_POLICY_VERSION,
): CycleHistoryProjection {
  return observations.reduce(
    (history, observation) => applyCycleObservation(history, observation),
    createCycleHistoryProjection(policyVersion),
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. RESTORE AND INTEGRITY
// ───────────────────────────────────────────────────────────────────

/** Verify the closed bounded projection before resume or cycle comparison. */
export function verifyCycleHistoryProjection(
  history: Readonly<CycleHistoryProjection>,
): void {
  const policy = assertCycleDetectorPolicy(
    history.detector_policy_version,
    history.detector_policy_digest,
  );
  if (
    history.schema_version !== policy.history_schema_version
    || history.reducer_version !== policy.history_reducer_version
    || history.observations.length > policy.history_window
    || !Number.isSafeInteger(history.evicted_count)
    || history.evicted_count < 0
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Cycle history shape or reducer version is not registered',
    );
  }
  if (
    (history.evicted_count === 0) !== (history.evicted_through === null)
    || (history.evicted_count === 0
      && history.eviction_chain_hash !== EMPTY_EVICTION_CHAIN_HASH)
    || (history.evicted_count > 0
      && history.eviction_chain_hash === EMPTY_EVICTION_CHAIN_HASH)
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_CONFLICT,
      'Cycle history eviction count, boundary, and chain hash disagree',
    );
  }
  for (const [index, observation] of history.observations.entries()) {
    verifyCycleObservation(observation);
    if (
      history.run_lineage_id !== observation.run_lineage_id
      || observation.detector_policy_version !== policy.policy_version
      || observation.detector_policy_digest !== policy.policy_digest
    ) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.HISTORY_CONFLICT,
        'Cycle history observation is bound to another lineage or policy',
      );
    }
    if (index > 0) assertObservationOrder(history.observations[index - 1], observation);
  }
  if (history.evicted_count > 0) {
    const boundary = history.evicted_through;
    const first = history.observations[0];
    if (
      boundary === null
      || first === undefined
      || boundary.iteration !== history.evicted_count
      || first.iteration !== boundary.iteration + 1
      || boundary.ledger_cursor.ledger_id !== first.ledger_cursor.ledger_id
      || boundary.ledger_cursor.sequence >= first.ledger_cursor.sequence
    ) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.HISTORY_GAP,
        'Cycle history eviction boundary is not contiguous with the retained window',
      );
    }
  } else if (
    history.observations.length > 0
    && history.observations[0].iteration !== 1
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_GAP,
      'Unevicted cycle history must begin at the first run iteration',
    );
  }
  if (history.observations.length === 0 && history.run_lineage_id !== null) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_CONFLICT,
      'Empty cycle history cannot claim a run lineage',
    );
  }
  const calculated = historyHash(historyCore(history));
  if (calculated !== history.history_hash) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.HISTORY_CONFLICT,
      'Cycle history hash does not match its canonical projection bytes',
      { expectedHash: history.history_hash, actualHash: calculated },
    );
  }
}

/** Restore a JSON-safe history only after its complete integrity contract passes. */
export function restoreCycleHistory(
  input: unknown,
): CycleHistoryProjection {
  let candidate: CycleHistoryProjection;
  try {
    candidate = immutableJsonClone(input as JsonValue) as CycleHistoryProjection;
  } catch {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Cycle history resume input is not canonical JSON',
    );
  }
  verifyCycleHistoryProjection(candidate);
  return candidate;
}

/** Stable empty eviction identity exported for replay fixtures and audits. */
export function cycleEmptyEvictionChainHash(): string {
  return EMPTY_EVICTION_CHAIN_HASH;
}
