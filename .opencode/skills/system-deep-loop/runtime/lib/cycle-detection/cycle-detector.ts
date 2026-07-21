// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Cycle Detector
// ───────────────────────────────────────────────────────────────────

import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import { resolveCycleDetectorPolicy } from './cycle-detection-policy.js';
import {
  CycleEvaluationStatuses,
  CycleProgressVerdicts,
  CycleSignatureKinds,
} from './cycle-detection-types.js';
import { verifyCycleHistoryProjection } from './cycle-history.js';
import { assessCycleProgress } from './cycle-progress-gate.js';

import type {
  CycleEvidence,
  CycleEvaluationResult,
  CycleHistoryProjection,
  CycleObservation,
  CycleProgressAssessment,
  CycleSignatureKind,
} from './cycle-detection-types.js';

interface IndexedObservation {
  readonly index: number;
  readonly observation: CycleObservation;
}

interface RepetitionCandidate {
  readonly signatureKind: CycleSignatureKind;
  readonly fingerprint: string;
  readonly matches: readonly IndexedObservation[];
}

function notEvaluable(
  history: Readonly<CycleHistoryProjection>,
  reason: string,
): CycleEvaluationResult {
  return Object.freeze({
    status: CycleEvaluationStatuses.NOT_EVALUABLE,
    reason,
    detectorPolicyVersion: history.detector_policy_version,
  });
}

function signatureFingerprint(
  observation: CycleObservation,
  kind: CycleSignatureKind,
): string {
  if (kind === CycleSignatureKinds.FOCUS) {
    return observation.focus_signature.fingerprint;
  }
  if (kind === CycleSignatureKinds.CLAIM_FRONTIER) {
    return observation.claim_frontier_signature.fingerprint;
  }
  return observation.composite_state_signature.fingerprint;
}

function evidenceFor(
  policyVersion: string,
  kind: CycleSignatureKind,
  period: number,
  occurrenceCount: number,
  matches: readonly IndexedObservation[],
  progress: CycleProgressAssessment,
): CycleEvidence {
  const first = matches[0].observation;
  const last = matches[matches.length - 1].observation;
  const fingerprints = matches.map(({ observation }) => (
    signatureFingerprint(observation, kind)
  ));
  return immutableJsonClone({
    run_lineage_id: first.run_lineage_id,
    detector_policy_version: policyVersion,
    signature_kind: kind,
    period,
    occurrence_count: occurrenceCount,
    start_iteration: first.iteration,
    end_iteration: last.iteration,
    start_cursor: first.ledger_cursor,
    end_cursor: last.ledger_cursor,
    source_fingerprints: [...new Set(fingerprints)],
    trace: matches.map(({ observation }) => ({
      iteration: observation.iteration,
      ledger_cursor: observation.ledger_cursor,
      fingerprint: signatureFingerprint(observation, kind),
    })),
    progress_assessment: progress,
  });
}

function compositeCandidate(
  observations: readonly CycleObservation[],
  period: number,
  traversals: number,
): readonly IndexedObservation[] | null {
  const required = period * traversals;
  if (observations.length < required) return null;
  const start = observations.length - required;
  const matches = observations.slice(start).map((observation, offset) => ({
    index: start + offset,
    observation,
  }));
  const pattern = matches.slice(0, period).map(({ observation }) => (
    observation.composite_state_signature.fingerprint
  ));
  const repeats = matches.every(({ observation }, index) => (
    observation.composite_state_signature.fingerprint === pattern[index % period]
  ));
  return repeats ? matches : null;
}

function repetitionCandidates(
  observations: readonly CycleObservation[],
  window: number,
  threshold: number,
): readonly RepetitionCandidate[] {
  const start = Math.max(0, observations.length - window);
  const indexed = observations.slice(start).map((observation, offset) => ({
    index: start + offset,
    observation,
  }));
  const candidates: RepetitionCandidate[] = [];
  for (const signatureKind of [
    CycleSignatureKinds.FOCUS,
    CycleSignatureKinds.CLAIM_FRONTIER,
  ] as const) {
    const byFingerprint = new Map<string, IndexedObservation[]>();
    for (const entry of indexed) {
      const value = signatureFingerprint(entry.observation, signatureKind);
      const matches = byFingerprint.get(value) ?? [];
      matches.push(entry);
      byFingerprint.set(value, matches);
    }
    for (const [value, matches] of byFingerprint) {
      if (matches.length < threshold) continue;
      candidates.push({
        signatureKind,
        fingerprint: value,
        matches: matches.slice(-threshold),
      });
    }
  }
  return candidates.sort((left, right) => {
    const leftEnd = left.matches.at(-1)?.observation.iteration ?? 0;
    const rightEnd = right.matches.at(-1)?.observation.iteration ?? 0;
    if (leftEnd !== rightEnd) return rightEnd - leftEnd;
    if (left.signatureKind !== right.signatureKind) {
      return left.signatureKind === CycleSignatureKinds.FOCUS ? -1 : 1;
    }
    return left.fingerprint < right.fingerprint ? -1 : left.fingerprint > right.fingerprint ? 1 : 0;
  });
}

function clearedEvidence(
  observations: readonly CycleObservation[],
  active: CycleEvidence,
  progress: CycleProgressAssessment,
): CycleEvidence {
  const latest = observations[observations.length - 1];
  return immutableJsonClone({
    ...active,
    end_iteration: latest.iteration,
    end_cursor: latest.ledger_cursor,
    source_fingerprints: [
      ...new Set([
        ...active.source_fingerprints,
        signatureFingerprint(latest, active.signature_kind),
      ]),
    ],
    trace: [
      ...active.trace,
      {
        iteration: latest.iteration,
        ledger_cursor: latest.ledger_cursor,
        fingerprint: signatureFingerprint(latest, active.signature_kind),
      },
    ],
    progress_assessment: progress,
  });
}

function activeCycleProgress(
  observations: readonly CycleObservation[],
  active: CycleEvidence,
): CycleProgressAssessment | null {
  const startIndex = observations.findIndex(
    (observation) => observation.iteration === active.end_iteration,
  );
  if (startIndex < 0 || startIndex === observations.length - 1) return null;
  return assessCycleProgress(observations, startIndex, observations.length - 1);
}

/** Evaluate the latest bounded suffix while keeping stop authority outside this module. */
export function evaluateCycleHistory(
  history: Readonly<CycleHistoryProjection>,
  activeCycle: CycleEvidence | null = null,
): CycleEvaluationResult {
  try {
    verifyCycleHistoryProjection(history);
  } catch (error: unknown) {
    const reason = error instanceof Error && 'code' in error
      ? String(error.code)
      : 'HISTORY_INVALID';
    return notEvaluable(history, reason);
  }
  const policy = resolveCycleDetectorPolicy(history.detector_policy_version);
  const observations = history.observations;
  if (observations.length === 0) return notEvaluable(history, 'INSUFFICIENT_HISTORY');
  if (
    history.evicted_through !== null
    && history.evicted_through.iteration + 1 !== observations[0].iteration
  ) {
    return notEvaluable(history, 'HISTORY_GAP');
  }
  if (
    history.evicted_count === 0
    && observations[0].iteration !== 1
  ) {
    return notEvaluable(history, 'HISTORY_GAP');
  }

  if (activeCycle !== null) {
    if (
      activeCycle.run_lineage_id !== history.run_lineage_id
      || activeCycle.detector_policy_version !== policy.policy_version
    ) {
      return notEvaluable(history, 'ACTIVE_CYCLE_IDENTITY_MISMATCH');
    }
    const clearingProgress = activeCycleProgress(observations, activeCycle);
    if (clearingProgress?.verdict === CycleProgressVerdicts.PROGRESS) {
      return Object.freeze({
        status: CycleEvaluationStatuses.CYCLE_CLEARED,
        detectorPolicyVersion: policy.policy_version,
        evidence: clearedEvidence(observations, activeCycle, clearingProgress),
      });
    }
    if (clearingProgress?.verdict === CycleProgressVerdicts.NOT_EVALUABLE) {
      return notEvaluable(history, 'PROGRESS_DATA_MISSING');
    }
    if (
      activeCycle.end_iteration < observations[0].iteration
      && observations.at(-1)?.iteration !== activeCycle.end_iteration
    ) {
      return notEvaluable(history, 'ACTIVE_CYCLE_OUTSIDE_WINDOW');
    }
  }

  let compositeMissingProgress = false;
  for (let period = 1; period <= policy.max_period; period += 1) {
    const matches = compositeCandidate(
      observations,
      period,
      policy.minimum_traversals,
    );
    if (matches === null) continue;
    const progress = assessCycleProgress(
      observations,
      matches[0].index,
      matches[matches.length - 1].index,
    );
    if (progress.verdict === CycleProgressVerdicts.NO_PROGRESS) {
      return Object.freeze({
        status: CycleEvaluationStatuses.CYCLE_CONFIRMED,
        detectorPolicyVersion: policy.policy_version,
        evidence: evidenceFor(
          policy.policy_version,
          CycleSignatureKinds.COMPOSITE_STATE,
          period,
          policy.minimum_traversals,
          matches,
          progress,
        ),
      });
    }
    if (progress.verdict === CycleProgressVerdicts.NOT_EVALUABLE) {
      compositeMissingProgress = true;
    }
  }

  let repetitionMissingProgress = false;
  const repetitionEvidence: CycleEvidence[] = [];
  for (const candidate of repetitionCandidates(
    observations,
    policy.repetition_window,
    policy.occurrence_threshold,
  )) {
    const progress = assessCycleProgress(
      observations,
      candidate.matches[0].index,
      candidate.matches[candidate.matches.length - 1].index,
    );
    if (progress.verdict === CycleProgressVerdicts.NO_PROGRESS) {
      repetitionEvidence.push(evidenceFor(
        policy.policy_version,
        candidate.signatureKind,
        0,
        candidate.matches.length,
        candidate.matches,
        progress,
      ));
    }
    if (progress.verdict === CycleProgressVerdicts.NOT_EVALUABLE) {
      repetitionMissingProgress = true;
    }
  }
  if (repetitionEvidence.length > 0) {
    return Object.freeze({
      status: CycleEvaluationStatuses.CYCLE_SUSPECTED,
      detectorPolicyVersion: policy.policy_version,
      evidence: repetitionEvidence[0],
      evidenceSet: Object.freeze([...repetitionEvidence]),
    });
  }

  if (compositeMissingProgress || repetitionMissingProgress) {
    return notEvaluable(history, 'PROGRESS_DATA_MISSING');
  }
  if (observations.some((observation) => observation.progress.status === 'missing')) {
    return notEvaluable(history, 'PROGRESS_DATA_MISSING');
  }
  if (observations.length < policy.history_window) {
    return notEvaluable(history, 'INCOMPLETE_PERIOD_WINDOW');
  }
  return Object.freeze({
    status: CycleEvaluationStatuses.NO_CYCLE,
    detectorPolicyVersion: policy.policy_version,
    evaluatedObservationCount: observations.length,
  });
}
