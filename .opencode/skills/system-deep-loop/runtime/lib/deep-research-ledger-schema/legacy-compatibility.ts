// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepResearchEventStems,
} from './deep-research-ledger-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepResearchCompatibilityDecision,
  DeepResearchEventStem,
  LegacyUpcastContext,
  LegacyUpcastResult,
} from './deep-research-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'deep-research.legacy-jsonl.upcaster@1',
));

const LEGACY_EVENT_STEMS = Object.freeze({
  resumed: 'deep_research.run_resumed',
  restarted: 'deep_research.run_restarted',
  blocked_stop: 'deep_research.convergence_blocked',
} as const satisfies Readonly<Record<string, DeepResearchEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'idea_observed',
  'idea_promoted',
  'idea_rejected',
  'ideaRejectedRemoved',
  'ideaRejectedReset',
  'stuckRecovery',
  'userPaused',
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
  status: DeepResearchCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: DeepResearchEventStem | null,
  version: number | null,
): DeepResearchCompatibilityDecision {
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
    && isNonEmptyString(record.lineageId ?? record.parentSessionId ?? record.sessionId);
}

function hasIterationIdentity(record: Record<string, unknown>): boolean {
  const iteration = record.iteration ?? record.run;
  return hasStableIdentity(record)
    && Number.isSafeInteger(iteration)
    && (iteration as number) > 0;
}

function recordTarget(record: Record<string, unknown>): DeepResearchEventStem | null {
  if (record.type === 'config') return 'deep_research.run_initialized';
  if (record.type === 'iteration') return 'deep_research.iteration_completed';
  if (record.type !== 'event' || !isNonEmptyString(record.event)) return null;
  return LEGACY_EVENT_STEMS[record.event as keyof typeof LEGACY_EVENT_STEMS] ?? null;
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: DeepResearchEventStem,
): boolean {
  if (targetStem === 'deep_research.iteration_completed'
    || targetStem === 'deep_research.convergence_blocked') {
    return hasIterationIdentity(record);
  }
  return hasStableIdentity(record);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function stringValue(value: unknown, fallback: string): string {
  return isNonEmptyString(value) ? value : fallback;
}

function positiveInteger(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value) && (value as number) >= 0 ? value as number : fallback;
}

function ratio(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
}

function iterationFromContext(context: LegacyUpcastContext): number | null {
  const candidate = context.scope.iteration;
  return typeof candidate === 'number' && candidate > 0 ? candidate : null;
}

function currentStem(value: unknown): DeepResearchEventStem | null {
  return typeof value === 'string'
    && (DeepResearchEventStems as readonly string[]).includes(value)
    ? value as DeepResearchEventStem
    : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideDeepResearchCompatibility(
  input: unknown,
): DeepResearchCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'deep-research-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }

  if (input.type === 'progress') {
    return decision('compatible', 'legacy-liveness-record-is-non-authoritative', null, version);
  }

  if (input.type === 'event' && isNonEmptyString(input.event)
    && PINNED_LEGACY_EVENTS.has(input.event)) {
    return decision('pin-old-runtime', 'legacy-event-has-no-lossless-mode-event', null, version);
  }

  const targetStem = recordTarget(input);
  if (!targetStem) return decision('blocked', 'unknown-legacy-record', null, version);
  if (!stableTargetIdentity(input, targetStem)) {
    return decision('pin-old-runtime', 'stable-identity-missing', targetStem, version);
  }
  return decision('migrate', 'registered-pure-upcaster', targetStem, version);
}

export function upcastLegacyDeepResearchRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideDeepResearchCompatibility(input);
  if (compatibility.status !== 'migrate' || !compatibility.targetStem || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const recordDigest = digestRecord(input);
  const iteration = iterationFromContext(context);
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'deep_research.run_initialized':
      data = {
        generation: positiveInteger(input.generation, 1),
        charterDigest: recordDigest,
        configDigest: recordDigest,
        executorFingerprint: sha256Bytes(canonicalBytes(stringValue(input.executor, 'legacy'))),
        replayFingerprint: context.replay.final_digest,
        maxIterations: positiveInteger(input.maxIterations, 0),
        convergencePolicyVersion: 'legacy-jsonl@1',
      };
      warnings.push('Legacy config has one digest for both charter and configuration evidence.');
      break;
    case 'deep_research.run_resumed':
      data = {
        priorTailDigest: context.prevEventHash,
        sourceLineageId: stringValue(input.parentSessionId, context.scope.lineageId),
        resumeReason: stringValue(input.reason, 'legacy-resume'),
        generation: positiveInteger(input.generation, 1),
        compatibilityDecision: 'migrate',
        recoveryReceiptRef: `legacy-jsonl:${recordDigest}`,
      };
      break;
    case 'deep_research.run_restarted':
      data = {
        priorTailDigest: context.prevEventHash,
        archivedLineageId: stringValue(input.parentSessionId, context.scope.lineageId),
        restartReason: stringValue(input.reason, 'legacy-restart'),
        generation: positiveInteger(input.generation, 1),
        compatibilityDecision: 'migrate',
        recoveryReceiptRef: `legacy-jsonl:${recordDigest}`,
      };
      break;
    case 'deep_research.iteration_completed':
      if (iteration === null) return Object.freeze({
        status: 'refused',
        decision: decision(
          'pin-old-runtime',
          'iteration-scope-missing',
          compatibility.targetStem,
          compatibility.sourceVersion,
        ),
      });
      data = {
        status: stringValue(input.status, 'error'),
        rawNewInfoRatio: ratio(input.newInfoRatio),
        trustedEvidenceYield: 0,
        outputDigest: recordDigest,
        ruledOutApproachRefs: Array.isArray(input.ruledOut)
          ? input.ruledOut.map((_, index) => `legacy-jsonl:${recordDigest}:ruled-out:${index + 1}`)
          : [],
        nextFocusCausationId: `legacy-jsonl:${recordDigest}:next-focus`,
      };
      warnings.push('Trusted evidence yield was absent and remains explicitly zero.');
      break;
    case 'deep_research.convergence_blocked':
      if (iteration === null) return Object.freeze({
        status: 'refused',
        decision: decision(
          'pin-old-runtime',
          'iteration-scope-missing',
          compatibility.targetStem,
          compatibility.sourceVersion,
        ),
      });
      data = {
        decision: 'blocked',
        rawSignals: {
          newInfoRatio: 0,
          contradictionRisk: 0,
          citationDrift: 0,
          observationDigest: recordDigest,
        },
        trustedSignals: {
          evidenceYield: 0,
          independentSourceRatio: 0,
          supportedClaimRatio: 0,
          assessmentDigest: recordDigest,
        },
        qualityGateResults: {
          sourceDiversity: 'unknown',
          contradictionResolution: 'unknown',
          citationIntegrity: 'unknown',
          policyVersion: 'legacy-jsonl@1',
          resultDigest: recordDigest,
        },
        blockerIds: Array.isArray(input.blockedBy)
          ? input.blockedBy.filter(isNonEmptyString)
          : [],
        policyFingerprint: recordDigest,
        evaluatorFingerprint: recordDigest,
        evidenceTailHash: context.prevEventHash,
        incompleteReason: stringValue(input.stopReason, 'legacy-blocked-stop'),
        recoveryReason: stringValue(input.recoveryStrategy, 'legacy-recovery-unspecified'),
      };
      warnings.push('Legacy convergence signals were not independently addressable.');
      break;
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
