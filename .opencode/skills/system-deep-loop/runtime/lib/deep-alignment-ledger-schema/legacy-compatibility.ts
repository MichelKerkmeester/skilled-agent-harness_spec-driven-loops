// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { DeepAlignmentEventStems } from './deep-alignment-ledger-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepAlignmentCompatibilityDecision,
  DeepAlignmentEventStem,
  LegacyUpcastContext,
  LegacyUpcastResult,
} from './deep-alignment-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'deep-alignment.legacy-jsonl.upcaster@1',
));
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const MAX_PROSE_LENGTH = 4_096;

const LEGACY_EVENT_STEMS = Object.freeze({
  resumed: 'deep_alignment.run_resumed',
  restarted: 'deep_alignment.run_restarted',
  blocked_stop: 'deep_alignment.blocked_stop_recorded',
} as const satisfies Readonly<Record<string, DeepAlignmentEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'authority_rewritten',
  'finding_removed',
  'finding_updated',
  'observation_replaced',
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
  status: DeepAlignmentCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: DeepAlignmentEventStem | null,
  version: number | null,
): DeepAlignmentCompatibilityDecision {
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
    && isNonEmptyString(record.sessionId)
    && isNonEmptyString(record.authorityEpochId);
}

function hasLaneIdentity(record: Record<string, unknown>): boolean {
  const iteration = record.iteration ?? record.run;
  return hasStableIdentity(record)
    && Number.isSafeInteger(iteration)
    && (iteration as number) > 0
    && isNonEmptyString(record.lane ?? record.laneId);
}

function recordTarget(record: Record<string, unknown>): DeepAlignmentEventStem | null {
  if (record.type === 'config') return 'deep_alignment.run_initialized';
  if (record.type === 'iteration') return 'deep_alignment.lane_completed';
  if (record.type !== 'event' || !isNonEmptyString(record.event)) return null;
  return LEGACY_EVENT_STEMS[record.event as keyof typeof LEGACY_EVENT_STEMS] ?? null;
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: DeepAlignmentEventStem,
): boolean {
  if (targetStem === 'deep_alignment.lane_completed') return hasLaneIdentity(record);
  if (targetStem === 'deep_alignment.blocked_stop_recorded') {
    const iteration = record.iteration ?? record.run;
    return hasStableIdentity(record)
      && Number.isSafeInteger(iteration)
      && (iteration as number) > 0;
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

function currentStem(value: unknown): DeepAlignmentEventStem | null {
  return typeof value === 'string'
    && (DeepAlignmentEventStems as readonly string[]).includes(value)
    ? value as DeepAlignmentEventStem
    : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideDeepAlignmentCompatibility(
  input: unknown,
): DeepAlignmentCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }
  if (input.ambiguous === true) {
    return decision('blocked', 'ambiguous-conversion', null, version);
  }
  if (input.lossy === true) {
    return decision('blocked', 'lossy-conversion', null, version);
  }
  if (input.expired === true) {
    return decision('blocked', 'expired-authority-input', null, version);
  }
  if (input.rolledBack === true) {
    return decision('blocked', 'rolled-back-authority-input', null, version);
  }
  if (input.mixedAuthority === true) {
    return decision('blocked', 'mixed-authority-input', null, version);
  }

  if (input.format === 'deep-alignment-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  if (input.type === 'progress') {
    return decision('compatible', 'legacy-liveness-record-is-non-authoritative', null, version);
  }
  if (input.type === 'partial-observation') {
    return decision('degraded', 'legacy-observation-lacks-proof-bindings', null, version);
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

export function upcastLegacyDeepAlignmentRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideDeepAlignmentCompatibility(input);
  if (compatibility.status !== 'migrate'
    || !compatibility.targetStem
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const recordDigest = digestRecord(input);
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'deep_alignment.run_initialized':
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
    case 'deep_alignment.run_resumed':
      data = {
        priorTailDigest: context.prevEventHash,
        sourceSessionId: codeValue(input.sourceSessionId, context.scope.sessionId),
        resumeReason: proseValue(input.reason, 'Legacy resume record.'),
        continuedFromRunId: codeValue(input.runId, context.scope.runId),
        compatibilityDecision: 'migrate',
        recoveryReceiptRef: legacyRef(recordDigest, 'recovery-receipt'),
      };
      break;
    case 'deep_alignment.run_restarted':
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
    case 'deep_alignment.lane_completed': {
      const counts = isObject(input.counts) ? input.counts : {};
      data = {
        lanePlanEventId: legacyRef(recordDigest, 'lane-plan'),
        subjectSnapshotRef: legacyRef(recordDigest, 'subject-snapshot'),
        subjectSnapshotDigest: recordDigest,
        authorityValidationEventId: legacyRef(recordDigest, 'authority-validation'),
        applicabilityDecisionRefs: [legacyRef(recordDigest, 'applicability')],
        observationRefs: Array.isArray(input.observations)
          ? input.observations.map(
            (_, index) => legacyRef(recordDigest, 'observation', index + 1),
          )
          : [],
        verificationRefs: Array.isArray(input.verifications)
          ? input.verifications.map(
            (_, index) => legacyRef(recordDigest, 'verification', index + 1),
          )
          : [],
        status: ['blocked', 'complete', 'incomplete'].includes(String(input.status))
          ? String(input.status)
          : 'incomplete',
        counts: {
          applicable: nonNegativeInteger(counts.applicable),
          notApplicable: nonNegativeInteger(counts.notApplicable),
          unresolved: nonNegativeInteger(counts.unresolved),
          untested: nonNegativeInteger(counts.untested),
          blocked: nonNegativeInteger(counts.blocked),
          nonConformant: nonNegativeInteger(counts.nonConformant),
        },
        completionDigest: recordDigest,
        blockedReasonCode: input.status === 'complete'
          ? null
          : codeValue(input.reasonCode, 'legacy-incomplete'),
      };
      warnings.push('Legacy lane rows lack independently addressable authority and subject receipts.');
      break;
    }
    case 'deep_alignment.blocked_stop_recorded': {
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
          candidates: nonNegativeInteger(input.candidateCount),
          adjudicated: nonNegativeInteger(input.adjudicatedCount),
          p0: nonNegativeInteger(input.p0Count),
          p1: nonNegativeInteger(input.p1Count),
          p2: nonNegativeInteger(input.p2Count),
        },
        recoveryStrategy: codeValue(input.recoveryStrategy, 'legacy-recovery'),
        targetDimensionId: codeValue(input.dimensionId, 'alignment'),
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
