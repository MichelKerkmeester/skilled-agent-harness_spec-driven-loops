// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Window Open, Evaluate, Monitor, Revert & Close
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  MonitoredSignalFamilies,
  ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS,
  ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { CertificationEnvelope, ReceiptCertificationProvider } from '../receipts-and-effect-recovery/index.js';
import type {
  MonitoredSignalEvaluationContext,
  MonitoredSignalFamily,
  MonitoredSignalReading,
  RollbackRevertSequenceRecord,
  RollbackRevertSequenceRequest,
  RollbackRevertSequenceResult,
  RollbackWindowClosureEvidence,
  RollbackWindowClosureFacts,
  RollbackWindowClosureRequest,
  RollbackWindowClosureResult,
  RollbackWindowEvaluation,
  RollbackWindowEvaluationInput,
  RollbackWindowOpenRequest,
  RollbackWindowRecord,
  RollbackWindowRejectionReasonCode,
  RollbackWindowSignalDecision,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const HEX_40 = /^[a-f0-9]{40}$/u;
const HEX_64 = /^[a-f0-9]{64}$/u;
const MILLISECONDS_PER_CALENDAR_DAY = 86_400_000;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function windowRejected(
  reasonCode: RollbackWindowRejectionReasonCode,
): Readonly<{ verdict: 'rejected'; reasonCode: RollbackWindowRejectionReasonCode }> {
  return Object.freeze({ verdict: 'rejected', reasonCode });
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function uniqueSortedDigests(values: readonly string[]): readonly string[] | null {
  if (values.some((value) => typeof value !== 'string' || value.length === 0)) return null;
  const sorted = [...values].sort();
  return new Set(sorted).size === sorted.length ? Object.freeze(sorted) : null;
}

// ───────────────────────────────────────────────────────────────────
// 2. OPEN
// ───────────────────────────────────────────────────────────────────

/** Open one mode's monitored reversible window at the moment its CAS succeeded. */
export function openRollbackWindow(
  request: Readonly<RollbackWindowOpenRequest>,
): RollbackWindowRecord {
  const {
    mode, cutoverCertificateDigest, candidateSha, rollbackAnchorDigest,
    retainedLegacyAssetDigests, openedAt, openingAuthorityEpoch,
  } = request;
  if (
    !isNonEmptyString(cutoverCertificateDigest)
    || !HEX_40.test(candidateSha)
    || !HEX_64.test(rollbackAnchorDigest)
    || !isIsoTimestamp(openedAt)
    || !isPositiveInteger(openingAuthorityEpoch)
  ) {
    throw new TypeError('Rollback window open request is malformed');
  }
  const retained = uniqueSortedDigests(retainedLegacyAssetDigests);
  if (retained === null) throw new TypeError('Retained legacy asset digests must be unique');

  const core = Object.freeze({
    mode,
    cutoverCertificateDigest,
    candidateSha,
    rollbackAnchorDigest,
    retainedLegacyAssetDigests: retained,
    openedAt,
    openingAuthorityEpoch,
    monitorCursor: '0',
  });
  return Object.freeze({ ...core, recordDigest: digest(core) });
}

// ───────────────────────────────────────────────────────────────────
// 3. EVALUATE (later-of 14-day / 5-run rule)
// ───────────────────────────────────────────────────────────────────

/**
 * Evaluate the later-of rule: the window may not close before both 14
 * calendar days and 5 successful authoritative executions are observed, so
 * a quiet mode cannot appear clean on elapsed time alone. Executions that
 * share an identity link (same execution id or same certificate digest as
 * another counted execution) are folded into one credit so a replayed or
 * resubmitted execution cannot double-count.
 */
export function evaluateRollbackWindow(
  record: Readonly<RollbackWindowRecord>,
  input: Readonly<RollbackWindowEvaluationInput>,
): RollbackWindowEvaluation {
  const openedAt = Date.parse(record.openedAt);
  const evaluatedAt = Date.parse(input.evaluatedAt);
  if (
    !Number.isFinite(openedAt)
    || !Number.isFinite(evaluatedAt)
    || evaluatedAt < openedAt
    || !isNonNegativeInteger(input.unresolvedEvidenceCount)
  ) {
    throw new TypeError('Rollback window evaluation input is malformed');
  }

  // Every execution must be verified as belonging to THIS exact window: its
  // own mode, window record digest (which itself transitively binds the
  // window's candidate SHA, cutover certificate, opening epoch, and open
  // time), the exact post-cutover authority epoch, and an observation time
  // that actually falls inside the monitored interval. A syntactically
  // well-formed execution from a different mode, window, candidate, or
  // authority epoch — or one dated before the window opened or after this
  // evaluation's own instant — is never counted.
  const validExecutions = input.executions.filter((entry) => {
    const observedAt = Date.parse(entry.observedAt);
    return isNonEmptyString(entry.executionId)
      && entry.mode === record.mode
      && entry.windowRecordDigest === record.recordDigest
      && entry.candidateSha === record.candidateSha
      && entry.authorityState === 'new_authoritative_reversible'
      && entry.authorityEpoch === record.openingAuthorityEpoch + 1
      && entry.result === 'trusted-completion'
      && HEX_64.test(entry.certificateDigest)
      && Number.isFinite(observedAt)
      && observedAt >= openedAt
      && observedAt <= evaluatedAt;
  });

  const executionIdsByCertificate = new Map<string, Set<string>>();
  const certificateDigestsByExecution = new Map<string, Set<string>>();
  for (const entry of validExecutions) {
    const executionIds = executionIdsByCertificate.get(entry.certificateDigest) ?? new Set<string>();
    executionIds.add(entry.executionId);
    executionIdsByCertificate.set(entry.certificateDigest, executionIds);
    const certificateDigests = certificateDigestsByExecution.get(entry.executionId) ?? new Set<string>();
    certificateDigests.add(entry.certificateDigest);
    certificateDigestsByExecution.set(entry.executionId, certificateDigests);
  }
  const visitedExecutionIds = new Set<string>();
  const visitedCertificateDigests = new Set<string>();
  let successful = 0;
  for (const entry of validExecutions) {
    if (
      visitedExecutionIds.has(entry.executionId)
      || visitedCertificateDigests.has(entry.certificateDigest)
    ) continue;
    successful += 1;
    const pendingExecutionIds = [entry.executionId];
    const pendingCertificateDigests = [entry.certificateDigest];
    while (pendingExecutionIds.length > 0 || pendingCertificateDigests.length > 0) {
      const executionId = pendingExecutionIds.pop();
      if (executionId !== undefined && !visitedExecutionIds.has(executionId)) {
        visitedExecutionIds.add(executionId);
        for (const certificateDigest of certificateDigestsByExecution.get(executionId) ?? []) {
          if (!visitedCertificateDigests.has(certificateDigest)) {
            pendingCertificateDigests.push(certificateDigest);
          }
        }
      }
      const certificateDigest = pendingCertificateDigests.pop();
      if (certificateDigest !== undefined && !visitedCertificateDigests.has(certificateDigest)) {
        visitedCertificateDigests.add(certificateDigest);
        for (const executionId2 of executionIdsByCertificate.get(certificateDigest) ?? []) {
          if (!visitedExecutionIds.has(executionId2)) pendingExecutionIds.push(executionId2);
        }
      }
    }
  }

  const elapsedCalendarDays = Math.floor((evaluatedAt - openedAt) / MILLISECONDS_PER_CALENDAR_DAY);
  const minimumsMet = elapsedCalendarDays >= ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS
    && successful >= ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS;
  const extended = input.lowTraffic || input.unresolvedEvidenceCount > 0;
  const core = Object.freeze({
    state: extended ? 'extended' as const : minimumsMet ? 'eligible_to_close' as const : 'open' as const,
    elapsedCalendarDays,
    successfulAuthoritativeExecutions: successful,
    minimumCalendarDays: ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS,
    minimumSuccessfulAuthoritativeExecutions: ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS,
    unresolvedEvidenceCount: input.unresolvedEvidenceCount,
    lowTraffic: input.lowTraffic,
  });
  return Object.freeze({
    ...core,
    evaluationDigest: digest({ evaluation: core, recordDigest: record.recordDigest, inputDigest: digest(input) }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. MONITORED SIGNALS
// ───────────────────────────────────────────────────────────────────

const SIGNAL_FAMILY_SET: ReadonlySet<string> = new Set(MonitoredSignalFamilies);
const SIGNAL_SEVERITIES = new Set(['clear', 'warning', 'revert']);

function signalStop(
  reasonCode: string,
  readings: readonly MonitoredSignalReading[],
  context: Readonly<MonitoredSignalEvaluationContext>,
): RollbackWindowSignalDecision {
  return Object.freeze({
    decision: 'operator_stop',
    triggeredBy: Object.freeze([]),
    reasonCodes: Object.freeze([reasonCode]),
    decisionDigest: digest({ readings, context }),
  });
}

/**
 * Fold every monitored-signal reading into one deterministic decision. A
 * single family reporting `revert` reverts the window; a family reporting
 * contradictory severities in the same batch cannot be resolved
 * automatically and stops for an operator instead of guessing; otherwise a
 * `warning` extends and a fully clear batch continues. Before any of that,
 * this requires a fresh, in-window, single-mode reading for every one of the
 * declared signal families: an empty batch, a missing family, a duplicate
 * evidence submission, a reading dated outside the window's own open
 * interval, or a reading bound to a different mode all stop for an operator
 * rather than silently reading as clean.
 */
export function evaluateMonitoredSignals(
  readings: readonly MonitoredSignalReading[],
  context: Readonly<MonitoredSignalEvaluationContext>,
): RollbackWindowSignalDecision {
  const windowOpenedAt = Date.parse(context.windowOpenedAt);
  const evaluatedAt = Date.parse(context.evaluatedAt);
  if (!Number.isFinite(windowOpenedAt) || !Number.isFinite(evaluatedAt) || evaluatedAt < windowOpenedAt) {
    throw new TypeError('Monitored signal evaluation context is malformed');
  }

  const wellFormed = readings.every((reading) => (
    SIGNAL_FAMILY_SET.has(reading.family)
    && SIGNAL_SEVERITIES.has(reading.severity)
    && isNonEmptyString(reading.evidenceDigest)
    && isIsoTimestamp(reading.observedAt)
  ));
  if (!wellFormed) return signalStop('SIGNAL_MALFORMED', readings, context);

  if (readings.some((reading) => reading.mode !== context.mode)) {
    return signalStop('SIGNAL_CROSS_MODE', readings, context);
  }

  const isStale = readings.some((reading) => {
    const observedAt = Date.parse(reading.observedAt);
    return observedAt < windowOpenedAt || observedAt > evaluatedAt;
  });
  if (isStale) return signalStop('SIGNAL_STALE', readings, context);

  const evidenceDigests = readings.map((reading) => reading.evidenceDigest);
  if (new Set(evidenceDigests).size !== evidenceDigests.length) {
    return signalStop('SIGNAL_DUPLICATE', readings, context);
  }

  const presentFamilies = new Set(readings.map((reading) => reading.family));
  const missingFamily = MonitoredSignalFamilies.some((family) => !presentFamilies.has(family));
  if (missingFamily) return signalStop('SIGNAL_INCOMPLETE_FAMILIES', readings, context);

  const severitiesByFamily = new Map<MonitoredSignalFamily, Set<string>>();
  const reasonsByFamily = new Map<MonitoredSignalFamily, Set<string>>();
  for (const reading of readings) {
    const severities = severitiesByFamily.get(reading.family) ?? new Set<string>();
    severities.add(reading.severity);
    severitiesByFamily.set(reading.family, severities);
    if (reading.reasonCode !== null) {
      const reasons = reasonsByFamily.get(reading.family) ?? new Set<string>();
      reasons.add(reading.reasonCode);
      reasonsByFamily.set(reading.family, reasons);
    }
  }

  const contradictory = [...severitiesByFamily.entries()]
    .filter(([, severities]) => severities.size > 1)
    .map(([family]) => family)
    .sort();
  if (contradictory.length > 0) {
    return Object.freeze({
      decision: 'operator_stop',
      triggeredBy: Object.freeze(contradictory),
      reasonCodes: Object.freeze(['SIGNAL_CONTRADICTORY']),
      decisionDigest: digest({ readings, context }),
    });
  }

  const familiesWithSeverity = (severity: string): readonly MonitoredSignalFamily[] => (
    Object.freeze([...severitiesByFamily.entries()]
      .filter(([, severities]) => severities.has(severity))
      .map(([family]) => family)
      .sort())
  );
  const reasonCodesFor = (families: readonly MonitoredSignalFamily[]): readonly string[] => (
    Object.freeze([...new Set(families.flatMap((family) => [...(reasonsByFamily.get(family) ?? [])]))].sort())
  );

  const revertFamilies = familiesWithSeverity('revert');
  if (revertFamilies.length > 0) {
    return Object.freeze({
      decision: 'revert',
      triggeredBy: revertFamilies,
      reasonCodes: reasonCodesFor(revertFamilies),
      decisionDigest: digest({ readings, context }),
    });
  }

  const warningFamilies = familiesWithSeverity('warning');
  if (warningFamilies.length > 0) {
    return Object.freeze({
      decision: 'extend',
      triggeredBy: warningFamilies,
      reasonCodes: reasonCodesFor(warningFamilies),
      decisionDigest: digest({ readings, context }),
    });
  }

  return Object.freeze({
    decision: 'continue',
    triggeredBy: Object.freeze([]),
    reasonCodes: Object.freeze([]),
    decisionDigest: digest({ readings, context }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. REVERT (decision + record; mechanics stay owned by the per-mode switch)
// ───────────────────────────────────────────────────────────────────

/**
 * Record the outcome of a revert this signal decision authorized. This does
 * not perform the freeze/fence/reconcile/restore mechanics itself — those
 * stay owned by the per-mode rollback switch — it binds and validates the
 * non-destructive invariants of whatever that switch already produced.
 */
export function buildRollbackRevertRecord(
  request: Readonly<RollbackRevertSequenceRequest>,
): RollbackRevertSequenceResult {
  const {
    windowRecord, triggerDecision, admissionsFrozenAt, spineFencedAt, reconciliationDigest,
    restoredAuthorityEpoch, retainedEventCountBefore, retainedEventCountAfter,
    retainedArtifactCountBefore, retainedArtifactCountAfter, rollbackCertificateDigest,
  } = request;

  if (triggerDecision.decision !== 'revert') return windowRejected('STALE_TRIGGER_DECISION');
  if (
    !isIsoTimestamp(admissionsFrozenAt)
    || !isIsoTimestamp(spineFencedAt)
    || Date.parse(admissionsFrozenAt) < Date.parse(windowRecord.openedAt)
    || Date.parse(spineFencedAt) < Date.parse(admissionsFrozenAt)
    || !HEX_64.test(reconciliationDigest)
    || !isNonEmptyString(rollbackCertificateDigest)
    || !isNonNegativeInteger(retainedEventCountBefore)
    || !isNonNegativeInteger(retainedEventCountAfter)
    || !isNonNegativeInteger(retainedArtifactCountBefore)
    || !isNonNegativeInteger(retainedArtifactCountAfter)
  ) return windowRejected('RECORD_MALFORMED');
  if (restoredAuthorityEpoch !== windowRecord.openingAuthorityEpoch + 1) {
    return windowRejected('RECORD_MALFORMED');
  }
  if (
    retainedEventCountAfter !== retainedEventCountBefore
    || retainedArtifactCountAfter !== retainedArtifactCountBefore
  ) return windowRejected('DESTRUCTIVE_ROLLBACK_REJECTED');

  const core = Object.freeze({
    mode: windowRecord.mode,
    windowRecordDigest: windowRecord.recordDigest,
    triggerDecision,
    admissionsFrozenAt,
    spineFencedAt,
    reconciliationDigest,
    restoredAuthorityState: 'legacy_authoritative' as const,
    restoredAuthorityEpoch,
    retainedEventCountBefore,
    retainedEventCountAfter,
    retainedArtifactCountBefore,
    retainedArtifactCountAfter,
    eventDeletionCount: 0 as const,
    artifactRewriteCount: 0 as const,
    rollbackCertificateDigest,
  });
  const record: RollbackRevertSequenceRecord = Object.freeze({ ...core, recordDigest: digest(core) });
  return Object.freeze({ verdict: 'recorded', record });
}

// ───────────────────────────────────────────────────────────────────
// 6. CLEAN CLOSURE
// ───────────────────────────────────────────────────────────────────

/**
 * Close a window only once it is eligible and no monitored signal is
 * unresolved, producing signed durable evidence a later retirement decision
 * can consume without inheriting a hidden shortcut. The evaluation and the
 * signal decision are always recomputed here from the raw executions and
 * signal readings the caller supplies — this never accepts a pre-built
 * `RollbackWindowEvaluation` or `RollbackWindowSignalDecision`, so a caller
 * cannot assert an eligibility the underlying evidence never earned.
 */
export async function closeRollbackWindow(
  request: Readonly<RollbackWindowClosureRequest>,
  provider: ReceiptCertificationProvider,
): Promise<RollbackWindowClosureResult> {
  const { windowRecord, executions, unresolvedEvidenceCount, lowTraffic, signalReadings, closureDecidedAt } = request;
  if (!isIsoTimestamp(closureDecidedAt)) return windowRejected('RECORD_MALFORMED');
  if (provider.profile.trust_scope !== 'durable-cross-resume') return windowRejected('RECORD_MALFORMED');

  let evaluation: RollbackWindowEvaluation;
  try {
    evaluation = evaluateRollbackWindow(windowRecord, {
      evaluatedAt: closureDecidedAt,
      executions,
      unresolvedEvidenceCount,
      lowTraffic,
    });
  } catch {
    return windowRejected('RECORD_MALFORMED');
  }
  if (evaluation.state !== 'eligible_to_close') return windowRejected('WINDOW_NOT_ELIGIBLE');

  let signalDecision: RollbackWindowSignalDecision;
  try {
    signalDecision = evaluateMonitoredSignals(signalReadings, {
      mode: windowRecord.mode,
      windowOpenedAt: windowRecord.openedAt,
      evaluatedAt: closureDecidedAt,
    });
  } catch {
    return windowRejected('RECORD_MALFORMED');
  }
  if (signalDecision.decision !== 'continue') return windowRejected('UNRESOLVED_SIGNAL');

  const facts: RollbackWindowClosureFacts = Object.freeze({
    mode: windowRecord.mode,
    windowRecordDigest: windowRecord.recordDigest,
    finalEvaluation: evaluation,
    successfulAuthoritativeExecutions: evaluation.successfulAuthoritativeExecutions,
    retainedAssetDigests: windowRecord.retainedLegacyAssetDigests,
    signalDecision,
    closureDecidedAt,
    handoffReady: true as const,
  });
  const profile = provider.profile;
  const signingBytes = Uint8Array.from(canonicalBytes({
    facts: facts as unknown as JsonObject,
    certification_profile: profile,
  }));
  const signature = await provider.sign(signingBytes);
  if (signature.length === 0) return windowRejected('RECORD_MALFORMED');
  const certification: CertificationEnvelope = Object.freeze({
    ...profile,
    signed_digest: sha256Bytes(signingBytes),
    signature_base64: Buffer.from(signature).toString('base64'),
  });
  const closure: RollbackWindowClosureEvidence = Object.freeze({
    facts,
    certification,
    closureDigest: digest({ facts, certification }),
  });
  return Object.freeze({ verdict: 'closed', closure });
}
