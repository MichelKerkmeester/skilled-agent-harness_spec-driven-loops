// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Detection Policy
// ───────────────────────────────────────────────────────────────────

import {
  CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CONTINUITY_SCHEMA_VERSION,
} from '../claim-continuity/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { NEXT_FOCUS_SCORING_POLICY_VERSION } from '../next-focus/index.js';
import {
  CycleDetectionError,
  CycleDetectionErrorCodes,
} from './cycle-detection-types.js';

import type {
  CycleDetectorPolicy,
  CycleDetectorSourceVersions,
} from './cycle-detection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION IDENTITIES
// ───────────────────────────────────────────────────────────────────

export const CYCLE_OBSERVATION_SCHEMA_VERSION = 1;
export const CYCLE_HISTORY_SCHEMA_VERSION = 1;
export const CYCLE_HISTORY_REDUCER_VERSION = 'cycle-history-reducer-v1';
export const CYCLE_PROGRESS_GATE_VERSION = 'cycle-progress-gate-v1';
export const CYCLE_PROGRESS_SIGNAL_VERSION = 'cycle-progress-signal-v1';
export const CYCLE_COVERAGE_REDUCER_VERSION = 'cycle-coverage-summary-v1';
export const CYCLE_BLOCKER_REDUCER_VERSION = 'cycle-blocker-summary-v1';
export const CYCLE_DETECTOR_POLICY_VERSION = 'cycle-detector-policy-v1';

export const CYCLE_HISTORY_WINDOW = 12;
export const CYCLE_MAX_PERIOD = 4;
export const CYCLE_MINIMUM_TRAVERSALS = 3;
export const CYCLE_REPETITION_WINDOW = 8;
export const CYCLE_OCCURRENCE_THRESHOLD = 3;
export const CYCLE_COVERAGE_GAIN_FLOOR_BPS = 100;

const SOURCE_VERSIONS: CycleDetectorSourceVersions = Object.freeze({
  claim_continuity_schema_version: CLAIM_CONTINUITY_SCHEMA_VERSION,
  claim_reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
  claim_projection_schema_version: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  next_focus_policy_version: NEXT_FOCUS_SCORING_POLICY_VERSION,
  coverage_reducer_version: CYCLE_COVERAGE_REDUCER_VERSION,
  blocker_reducer_version: CYCLE_BLOCKER_REDUCER_VERSION,
  progress_signal_version: CYCLE_PROGRESS_SIGNAL_VERSION,
  event_envelope_version: CURRENT_ENVELOPE_VERSION,
  replay_fingerprint_version: 1,
});

const POLICY_CORE = Object.freeze({
  policy_version: CYCLE_DETECTOR_POLICY_VERSION,
  observation_schema_version: CYCLE_OBSERVATION_SCHEMA_VERSION,
  history_schema_version: CYCLE_HISTORY_SCHEMA_VERSION,
  history_reducer_version: CYCLE_HISTORY_REDUCER_VERSION,
  progress_gate_version: CYCLE_PROGRESS_GATE_VERSION,
  history_window: CYCLE_HISTORY_WINDOW,
  max_period: CYCLE_MAX_PERIOD,
  minimum_traversals: CYCLE_MINIMUM_TRAVERSALS,
  repetition_window: CYCLE_REPETITION_WINDOW,
  occurrence_threshold: CYCLE_OCCURRENCE_THRESHOLD,
  coverage_gain_floor_bps: CYCLE_COVERAGE_GAIN_FLOOR_BPS,
  source_versions: SOURCE_VERSIONS,
});

/** Initial policy is immutable; changed sensitivity requires another identity. */
export const CYCLE_DETECTOR_POLICY: CycleDetectorPolicy = Object.freeze({
  ...POLICY_CORE,
  policy_digest: sha256Bytes(canonicalBytes(POLICY_CORE)),
});

// ───────────────────────────────────────────────────────────────────
// 2. POLICY RESOLUTION
// ───────────────────────────────────────────────────────────────────

/** Resolve one exact detector policy without reinterpreting stored history. */
export function resolveCycleDetectorPolicy(
  policyVersion = CYCLE_DETECTOR_POLICY_VERSION,
): CycleDetectorPolicy {
  if (policyVersion !== CYCLE_DETECTOR_POLICY_VERSION) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Cycle detector policy version is not registered',
      { policyVersion },
    );
  }
  return CYCLE_DETECTOR_POLICY;
}

/** Reject policy bytes that reuse a version identity with changed sensitivity. */
export function assertCycleDetectorPolicy(
  policyVersion: string,
  policyDigest: string,
): CycleDetectorPolicy {
  const policy = resolveCycleDetectorPolicy(policyVersion);
  if (policy.policy_digest !== policyDigest) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Cycle detector policy digest does not match its registered version',
      { policyVersion, policyDigest },
    );
  }
  return policy;
}
