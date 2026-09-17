// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Progress Gate
// ───────────────────────────────────────────────────────────────────

import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import { resolveCycleDetectorPolicy } from './cycle-detection-policy.js';
import {
  CycleDetectionError,
  CycleDetectionErrorCodes,
  CycleProgressVerdicts,
} from './cycle-detection-types.js';
import { verifyCycleProgressVector } from './cycle-observation.js';

import type {
  CompleteCycleProgressVector,
  CycleObservation,
  CycleProgressAssessment,
} from './cycle-detection-types.js';

function notEvaluable(
  start: CycleObservation,
  end: CycleObservation,
  missingFields: readonly string[],
): CycleProgressAssessment {
  const policy = resolveCycleDetectorPolicy(start.detector_policy_version);
  return immutableJsonClone({
    gate_version: policy.progress_gate_version,
    verdict: CycleProgressVerdicts.NOT_EVALUABLE,
    basis: [...new Set(missingFields)].sort(),
    start_iteration: start.iteration,
    end_iteration: end.iteration,
    path_coverage_gain_bps: null,
    community_coverage_gain_bps: null,
  });
}

/** Evaluate only explicit typed progress recorded after the candidate start. */
export function assessCycleProgress(
  observations: readonly CycleObservation[],
  startIndex: number,
  endIndex: number,
): CycleProgressAssessment {
  if (
    !Number.isSafeInteger(startIndex)
    || !Number.isSafeInteger(endIndex)
    || startIndex < 0
    || endIndex < startIndex
    || endIndex >= observations.length
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Progress assessment requires a closed observation interval',
      { startIndex, endIndex, observationCount: observations.length },
    );
  }
  const start = observations[startIndex];
  const end = observations[endIndex];
  const policy = resolveCycleDetectorPolicy(start.detector_policy_version);
  const interval = observations.slice(startIndex, endIndex + 1);
  for (const observation of interval) verifyCycleProgressVector(observation.progress);
  const missing = interval.flatMap((observation) => (
    observation.progress.status === 'missing'
      ? observation.progress.missing_fields.map((field) => (
        `iteration-${observation.iteration}:${field}`
      ))
      : []
  ));
  if (missing.length > 0) return notEvaluable(start, end, missing);

  const complete = interval.map(
    (observation) => observation.progress as CompleteCycleProgressVector,
  );
  const later = complete.slice(1);
  const basis: string[] = [];
  if (later.some((progress) => progress.new_independent_evidence.length > 0)) {
    basis.push('new_independent_evidence');
  }
  if (later.some((progress) => progress.material_claim_changes.length > 0)) {
    basis.push('material_claim_transition');
  }
  if (later.some((progress) => progress.resolved_contradiction_ids.length > 0)) {
    basis.push('contradiction_resolution');
  }
  if (later.some((progress) => progress.resolved_blocker_ids.length > 0)) {
    basis.push('blocker_resolution');
  }

  const startProgress = complete[0];
  const endProgress = complete[complete.length - 1];
  const pathCoverageGain = Math.max(
    0,
    endProgress.path_coverage_bps - startProgress.path_coverage_bps,
  );
  const communityCoverageGain = Math.max(
    0,
    endProgress.community_coverage_bps - startProgress.community_coverage_bps,
  );
  if (pathCoverageGain >= policy.coverage_gain_floor_bps) {
    basis.push('path_coverage_gain');
  }
  if (communityCoverageGain >= policy.coverage_gain_floor_bps) {
    basis.push('community_coverage_gain');
  }
  return immutableJsonClone({
    gate_version: policy.progress_gate_version,
    verdict: basis.length > 0
      ? CycleProgressVerdicts.PROGRESS
      : CycleProgressVerdicts.NO_PROGRESS,
    basis,
    start_iteration: start.iteration,
    end_iteration: end.iteration,
    path_coverage_gain_bps: pathCoverageGain,
    community_coverage_gain_bps: communityCoverageGain,
  });
}
