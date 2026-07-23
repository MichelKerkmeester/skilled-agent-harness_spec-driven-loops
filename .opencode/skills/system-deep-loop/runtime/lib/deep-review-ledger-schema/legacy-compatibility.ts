// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { DeepReviewEventStems } from './deep-review-ledger-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepReviewCompatibilityDecision,
  DeepReviewEventStem,
  LegacyUpcastContext,
  LegacyUpcastResult,
} from './deep-review-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'deep-review.legacy-jsonl.upcaster@1',
));
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const MAX_PROSE_LENGTH = 4_096;

const LEGACY_EVENT_STEMS = Object.freeze({
  resumed: 'deep_review.run_resumed',
  restarted: 'deep_review.run_restarted',
  blocked_stop: 'deep_review.blocked_stop_recorded',
} as const satisfies Readonly<Record<string, DeepReviewEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'finding_updated',
  'finding_removed',
  'report_rewritten',
  'severity_changed',
  'verdict_changed',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function sourceVersion(record: Record<string, unknown>): number | null {
  const candidate = record.eventVersion ?? record.schemaVersion ?? 1;
  return Number.isSafeInteger(candidate) ? candidate as number : null;
}

function decision(
  status: DeepReviewCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: DeepReviewEventStem | null,
  version: number | null,
): DeepReviewCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function hasStableIdentity(record: Record<string, unknown>): boolean {
  return isNonEmptyString(record.runId ?? record.sessionId)
    && isNonEmptyString(record.sessionId);
}

function hasDimensionIdentity(record: Record<string, unknown>): boolean {
  const iteration = record.iteration ?? record.run;
  return hasStableIdentity(record)
    && Number.isSafeInteger(iteration)
    && (iteration as number) > 0
    && isNonEmptyString(record.dimension ?? record.dimensionId);
}

function recordTarget(record: Record<string, unknown>): DeepReviewEventStem | null {
  if (record.type === 'config') return 'deep_review.run_initialized';
  if (record.type === 'iteration') return 'deep_review.dimension_pass_completed';
  if (record.type !== 'event' || !isNonEmptyString(record.event)) return null;
  return LEGACY_EVENT_STEMS[record.event as keyof typeof LEGACY_EVENT_STEMS] ?? null;
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: DeepReviewEventStem,
): boolean {
  if (targetStem === 'deep_review.dimension_pass_completed'
    || targetStem === 'deep_review.blocked_stop_recorded') {
    return hasDimensionIdentity(record);
  }
  return hasStableIdentity(record);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function proseValue(value: unknown, fallback: string): string {
  return isNonEmptyString(value) && value.length <= MAX_PROSE_LENGTH
    ? value
    : fallback;
}

function codeValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && CODE_TOKEN_PATTERN.test(value)
    ? value
    : fallback;
}

function positiveInteger(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value) && (value as number) > 0
    ? value as number
    : fallback;
}

function nonNegativeInteger(value: unknown): number {
  return Number.isSafeInteger(value) && (value as number) >= 0
    ? value as number
    : 0;
}

function legacyRef(recordDigest: string, label: string, index?: number): string {
  return `legacy-jsonl:${recordDigest}:${label}${index === undefined ? '' : `:${index}`}`;
}

function currentStem(value: unknown): DeepReviewEventStem | null {
  return typeof value === 'string'
    && (DeepReviewEventStems as readonly string[]).includes(value)
    ? value as DeepReviewEventStem
    : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideDeepReviewCompatibility(
  input: unknown,
): DeepReviewCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'deep-review-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  if (input.type === 'progress') {
    return decision('compatible', 'legacy-liveness-record-is-non-authoritative', null, version);
  }

  if (input.type === 'event'
    && isNonEmptyString(input.event)
    && PINNED_LEGACY_EVENTS.has(input.event)) {
    return decision('pin-old-runtime', 'legacy-event-is-an-in-place-mutation', null, version);
  }

  const targetStem = recordTarget(input);
  if (!targetStem) return decision('blocked', 'unknown-legacy-record', null, version);
  if (!stableTargetIdentity(input, targetStem)) {
    return decision('pin-old-runtime', 'stable-identity-missing', targetStem, version);
  }
  return decision('migrate', 'registered-pure-upcaster', targetStem, version);
}

export function upcastLegacyDeepReviewRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideDeepReviewCompatibility(input);
  if (compatibility.status !== 'migrate'
    || !compatibility.targetStem
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const recordDigest = digestRecord(input);
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'deep_review.run_initialized':
      data = {
        target: {
          targetId: legacyRef(recordDigest, 'target'),
          targetType: 'repository',
          artifactRef: legacyRef(recordDigest, 'artifact'),
          sourceDigest: recordDigest,
          contentDigest: recordDigest,
        },
        lineageMode: 'fresh',
        maxIterations: positiveInteger(input.maxIterations, 1),
        convergencePolicyVersion: 'legacy-jsonl@1',
        reviewModeContractDigest: recordDigest,
        initialReleaseReadinessState: 'not-assessed',
      };
      warnings.push('Legacy configuration did not separate target source and content digests.');
      break;
    case 'deep_review.run_resumed':
      data = {
        priorTailDigest: context.prevEventHash,
        sourceSessionId: codeValue(input.sourceSessionId, context.scope.sessionId),
        resumeReason: proseValue(input.reason, 'Legacy resume record.'),
        continuedFromRunId: codeValue(input.runId, context.scope.runId),
        compatibilityDecision: 'migrate',
        recoveryReceiptRef: legacyRef(recordDigest, 'recovery-receipt'),
      };
      break;
    case 'deep_review.run_restarted':
      data = {
        priorTailDigest: context.prevEventHash,
        archivedLineageId: codeValue(
          input.archivedLineageId,
          legacyRef(recordDigest, 'archived-lineage'),
        ),
        restartReason: proseValue(input.reason, 'Legacy restart record.'),
        continuedFromRunId: codeValue(input.runId, context.scope.runId),
        compatibilityDecision: 'migrate',
        recoveryReceiptRef: legacyRef(recordDigest, 'recovery-receipt'),
      };
      break;
    case 'deep_review.dimension_pass_completed': {
      const counts = isObject(input.findingCounts) ? input.findingCounts : {};
      const fileCount = Array.isArray(input.filesReviewed) ? input.filesReviewed.length : 0;
      data = {
        passNumber: positiveInteger(input.passNumber ?? input.run, 1),
        targetRefs: [legacyRef(recordDigest, 'target')],
        filesReviewed: Array.from(
          { length: fileCount },
          (_, index) => legacyRef(recordDigest, 'file', index + 1),
        ),
        searchCoverageDigest: recordDigest,
        passStatus: ['blocked', 'complete', 'incomplete'].includes(String(input.status))
          ? String(input.status)
          : 'incomplete',
        rawFindingCounts: {
          candidates: nonNegativeInteger(counts.candidates),
          adjudicated: nonNegativeInteger(counts.adjudicated),
          p0: nonNegativeInteger(counts.p0),
          p1: nonNegativeInteger(counts.p1),
          p2: nonNegativeInteger(counts.p2),
        },
        nextFocusRef: legacyRef(recordDigest, 'next-focus'),
      };
      warnings.push('Legacy file paths were replaced by stable digest-derived references.');
      break;
    }
    case 'deep_review.blocked_stop_recorded': {
      const blockedBy = Array.isArray(input.blockedBy) && input.blockedBy.length > 0
        ? input.blockedBy
        : ['unknown-gate'];
      const gateIds = blockedBy.map(
        (_, index) => legacyRef(recordDigest, 'blocked-gate', index + 1),
      );
      data = {
        blockedGateIds: gateIds,
        gateResults: gateIds.map((gateId) => ({
          gateId,
          status: 'fail',
          reasonCode: 'legacy-blocked-stop',
          evidenceDigest: recordDigest,
        })),
        activeFindingCounts: {
          candidates: 0,
          adjudicated: 0,
          p0: nonNegativeInteger(input.p0Count),
          p1: nonNegativeInteger(input.p1Count),
          p2: nonNegativeInteger(input.p2Count),
        },
        recoveryStrategy: codeValue(input.recoveryStrategy, 'legacy-recovery'),
        targetDimensionId: codeValue(
          input.dimension ?? input.dimensionId,
          legacyRef(recordDigest, 'dimension'),
        ),
        originatingConvergenceEventId: legacyRef(recordDigest, 'convergence-event'),
        appendPosition: positiveInteger(input.appendPosition, 1),
      };
      warnings.push('Legacy gate results were reconstructed as explicit failed gates.');
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
