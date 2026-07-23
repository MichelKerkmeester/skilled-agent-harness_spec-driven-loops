// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepImprovementCommonEventStems,
} from './deep-improvement-common-ledger-types.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
} from './deep-improvement-common-ledger-schema.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepImprovementCommonCompatibilityDecision,
  DeepImprovementCommonEventStem,
  LegacyUpcastContext,
  LegacyUpcastResult,
} from './deep-improvement-common-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'deep-improvement-common.legacy-jsonl.upcaster@1',
));
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;

const LEGACY_EVENT_STEMS = Object.freeze({
  session_start: 'deep_improvement_common.run_started',
  session_initialized: 'deep_improvement_common.run_started',
  candidate_generated: 'deep_improvement_common.candidate_generated',
  candidate_scored: 'deep_improvement_common.evaluation_normalized',
  session_ended: 'deep_improvement_common.run_completed',
  session_end: 'deep_improvement_common.run_completed',
} as const satisfies Readonly<Record<string, DeepImprovementCommonEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'benchmark_completed',
  'blocked_stop',
  'gate_evaluation',
  'integration_scanned',
  'legal_stop_evaluated',
  'mutation_outcome',
  'mutation_proposed',
  'promotion_attempt',
  'promotion_attempted',
  'promotion_result',
  'rollback',
  'rollback_result',
  'score_execution_recorded',
  'trade_off_detected',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function sourceVersion(record: Record<string, unknown>): number | null {
  const candidate = record.eventVersion ?? record.schemaVersion ?? 1;
  return Number.isSafeInteger(candidate) ? candidate as number : null;
}

function decision(
  status: DeepImprovementCommonCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: DeepImprovementCommonEventStem | null,
  version: number | null,
): DeepImprovementCommonCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function details(record: Record<string, unknown>): Record<string, unknown> {
  return isObject(record.details) ? record.details : {};
}

function eventName(record: Record<string, unknown>): string | null {
  const candidate = record.eventType ?? record.event;
  return typeof candidate === 'string' ? candidate : null;
}

function hasStableRunIdentity(record: Record<string, unknown>): boolean {
  return isToken(record.runId ?? record.sessionId)
    && isToken(record.lineageId ?? record.parentSessionId ?? record.sessionId);
}

function hasStableCandidateIdentity(record: Record<string, unknown>): boolean {
  return hasStableRunIdentity(record)
    && isToken(record.candidateId ?? details(record).candidateId);
}

function recordTarget(
  record: Record<string, unknown>,
): DeepImprovementCommonEventStem | null {
  const name = eventName(record);
  return name
    ? LEGACY_EVENT_STEMS[name as keyof typeof LEGACY_EVENT_STEMS] ?? null
    : null;
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: DeepImprovementCommonEventStem,
): boolean {
  if (targetStem.startsWith('deep_improvement_common.candidate_')
    || targetStem.startsWith('deep_improvement_common.evaluation_')) {
    return hasStableCandidateIdentity(record);
  }
  return hasStableRunIdentity(record);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function tokenValue(value: unknown, fallback: string): string {
  return isToken(value) ? value : fallback;
}

function nonNegativeInteger(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value) && (value as number) >= 0
    ? value as number
    : fallback;
}

function scoreRatio(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
}

function currentStem(value: unknown): DeepImprovementCommonEventStem | null {
  return typeof value === 'string'
    && (DeepImprovementCommonEventStems as readonly string[]).includes(value)
    ? value as DeepImprovementCommonEventStem
    : null;
}

function hasCandidateScope(context: LegacyUpcastContext): boolean {
  return isToken(context.scope.candidateId);
}

function hasEvaluationScope(context: LegacyUpcastContext): boolean {
  return hasCandidateScope(context) && isToken(context.scope.evaluationEpochId);
}

function stopReason(value: unknown):
| 'blockedStop'
| 'converged'
| 'error'
| 'manualStop'
| 'maxIterationsReached'
| 'stuckRecovery' {
  return [
    'blockedStop',
    'converged',
    'error',
    'manualStop',
    'maxIterationsReached',
    'stuckRecovery',
  ].includes(String(value))
    ? value as ReturnType<typeof stopReason>
    : 'error';
}

function sessionOutcome(value: unknown):
| 'advisoryOnly'
| 'keptBaseline'
| 'promoted'
| 'rolledBack' {
  return ['advisoryOnly', 'keptBaseline', 'promoted', 'rolledBack'].includes(String(value))
    ? value as ReturnType<typeof sessionOutcome>
    : 'advisoryOnly';
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideDeepImprovementCommonCompatibility(
  input: unknown,
): DeepImprovementCommonCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'deep-improvement-common-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  if (input.type === 'progress') {
    return decision(
      'compatible',
      'legacy-liveness-record-is-non-authoritative',
      null,
      version,
    );
  }

  const name = eventName(input);
  if (name && PINNED_LEGACY_EVENTS.has(name)) {
    return decision(
      'pin-old-runtime',
      'legacy-event-has-no-lossless-common-event',
      null,
      version,
    );
  }

  const targetStem = recordTarget(input);
  if (!targetStem) return decision('blocked', 'unknown-legacy-record', null, version);
  if (!stableTargetIdentity(input, targetStem)) {
    return decision('pin-old-runtime', 'stable-identity-missing', targetStem, version);
  }
  return decision('migrate', 'registered-pure-upcaster', targetStem, version);
}

export function upcastLegacyDeepImprovementCommonRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideDeepImprovementCommonCompatibility(input);
  if (compatibility.status !== 'migrate'
    || !compatibility.targetStem
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const recordDigest = digestRecord(input);
  const legacyDetails = details(input);
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'deep_improvement_common.run_started':
      data = {
        generation: Math.max(1, nonNegativeInteger(input.generation, 1)),
        charterDigest: recordDigest,
        configDigest: recordDigest,
        operatorRef: tokenValue(
          input.operatorId ?? legacyDetails.operatorId,
          'legacy-improvement-orchestrator',
        ),
        serviceContractVersion: 'legacy-improvement-journal@1',
        replayFingerprint: context.replay.final_digest,
        maxIterations: nonNegativeInteger(
          input.maxIterations ?? legacyDetails.maxIterations,
          0,
        ),
      };
      warnings.push(
        'Legacy session start has one digest for charter and configuration evidence.',
      );
      break;
    case 'deep_improvement_common.candidate_generated':
      if (!hasCandidateScope(context)) {
        return Object.freeze({
          status: 'refused',
          decision: decision(
            'pin-old-runtime',
            'candidate-scope-missing',
            compatibility.targetStem,
            compatibility.sourceVersion,
          ),
        });
      }
      data = {
        proposalEventId: `legacy-jsonl:${recordDigest}:proposal`,
        proposalPayloadDigest: recordDigest,
        candidateArtifactRef: `legacy-jsonl:${recordDigest}:candidate`,
        candidateArtifactDigest: recordDigest,
        generationReceiptRef: `legacy-jsonl:${recordDigest}:generation`,
        mutationOperatorRef: tokenValue(
          legacyDetails.operatorRef,
          'legacy-mutation-operator',
        ),
        mutationOperatorVersion: 'legacy-improvement-journal@1',
      };
      warnings.push('Legacy candidate artifacts were represented by the source record digest.');
      break;
    case 'deep_improvement_common.evaluation_normalized': {
      if (!hasEvaluationScope(context)) {
        return Object.freeze({
          status: 'refused',
          decision: decision(
            'pin-old-runtime',
            'evaluation-scope-missing',
            compatibility.targetStem,
            compatibility.sourceVersion,
          ),
        });
      }
      const aggregateScore = scoreRatio(
        input.score ?? legacyDetails.score ?? legacyDetails.totalScore,
      );
      data = {
        observationEventIds: [`legacy-jsonl:${recordDigest}:observation`],
        observationSetDigest: recordDigest,
        scorePolicyVersion: tokenValue(
          legacyDetails.scorePolicyVersion,
          'legacy-improvement-score@1',
        ),
        scorerFingerprint: recordDigest,
        scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
        scoreVector: {
          components: [{
            dimensionCode: 'legacy-aggregate',
            rawScore: aggregateScore,
            normalizedScore: aggregateScore,
            weight: 1,
          }],
          aggregateScore,
          uncertainty: 1,
        },
        normalizationReceiptRef: `legacy-jsonl:${recordDigest}:score`,
      };
      warnings.push(
        'Legacy aggregate score has no independently addressable component evidence.',
      );
      break;
    }
    case 'deep_improvement_common.run_completed': {
      const resolvedStopReason = stopReason(
        legacyDetails.stopReason ?? input.stopReason,
      );
      data = {
        terminalOutcome: resolvedStopReason === 'converged'
          || resolvedStopReason === 'maxIterationsReached'
          ? 'completed'
          : resolvedStopReason === 'blockedStop' || resolvedStopReason === 'stuckRecovery'
            ? 'quarantined'
            : 'aborted',
        stopReason: resolvedStopReason,
        sessionOutcome: sessionOutcome(
          legacyDetails.sessionOutcome ?? input.sessionOutcome,
        ),
        finalLedgerTailHash: context.prevEventHash,
        counts: {
          candidates: nonNegativeInteger(legacyDetails.candidates, 0),
          evaluations: nonNegativeInteger(legacyDetails.evaluations, 0),
          observations: nonNegativeInteger(legacyDetails.observations, 0),
          canaryRuns: nonNegativeInteger(legacyDetails.canaryRuns, 0),
          promotions: nonNegativeInteger(legacyDetails.promotions, 0),
        },
        completionEvidenceRefs: [`legacy-jsonl:${recordDigest}:completion`],
      };
      break;
    }
    default:
      return Object.freeze({
        status: 'refused',
        decision: decision(
          'blocked',
          'upcaster-not-registered',
          compatibility.targetStem,
          compatibility.sourceVersion,
        ),
      });
  }

  return Object.freeze({
    status: 'migrated',
    targetStem: compatibility.targetStem,
    eventVersion: CURRENT_EVENT_VERSION,
    originalRecordDigest: recordDigest,
    upcasterFingerprint: LEGACY_UPCASTER_FINGERPRINT,
    warnings: Object.freeze(warnings),
    scope: context.scope,
    prevEventHash: context.prevEventHash,
    replay: context.replay,
    data,
  });
}
