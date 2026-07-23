// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { DeepAiCouncilEventStems } from './deep-ai-council-ledger-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepAiCouncilCompatibilityDecision,
  DeepAiCouncilEventStem,
  DeepAiCouncilScope,
  LegacyDeepAiCouncilUpcastContext,
  LegacyDeepAiCouncilUpcastResult,
} from './deep-ai-council-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'deep-ai-council.legacy-jsonl.upcaster@1',
));

const LEGACY_EVENT_STEMS = Object.freeze({
  round_start: 'ai_council.round_started',
  seat_returned: 'ai_council.seat_returned',
  deliberation_synthesized: 'ai_council.deliberation_synthesized',
  round_end: 'ai_council.round_ended',
  council_complete: 'ai_council.council_complete',
  artifact_written: 'ai_council.artifact_committed',
  rollback: 'ai_council.rollback_recorded',
  artifact_superseded: 'ai_council.artifact_superseded',
} as const satisfies Readonly<Record<string, DeepAiCouncilEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'progress_record',
  'seat_started',
  'seat_retry',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 256;
}

function sourceVersion(record: Record<string, unknown>): number | null {
  const envelopeVersion = record.eventVersion ?? record.schemaVersion ?? 1;
  const payloadVersion = record.payloadVersion ?? envelopeVersion;
  if (!Number.isSafeInteger(envelopeVersion) || !Number.isSafeInteger(payloadVersion)) return null;
  return envelopeVersion === payloadVersion ? envelopeVersion as number : null;
}

function decision(
  status: DeepAiCouncilCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: DeepAiCouncilEventStem | null,
  version: number | null,
): DeepAiCouncilCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function recordTarget(record: Record<string, unknown>): DeepAiCouncilEventStem | null {
  if (!isNonEmptyString(record.event)) return null;
  return LEGACY_EVENT_STEMS[record.event as keyof typeof LEGACY_EVENT_STEMS] ?? null;
}

function hasStableIdentity(
  record: Record<string, unknown>,
  targetStem: DeepAiCouncilEventStem,
): boolean {
  if (!isNonEmptyString(record.runId) || !isNonEmptyString(record.roundId)) return false;
  if (targetStem === 'ai_council.seat_returned') {
    return isNonEmptyString(record.seatId) && isNonEmptyString(record.proposalId);
  }
  if (targetStem === 'ai_council.artifact_committed') {
    return isNonEmptyString(record.artifactId) && isNonEmptyString(record.safeRelativePath);
  }
  if (targetStem === 'ai_council.artifact_superseded') {
    return isNonEmptyString(record.artifactId)
      && isNonEmptyString(record.priorArtifactId)
      && isNonEmptyString(record.successorArtifactId)
      && record.priorArtifactId !== record.successorArtifactId
      && isNonEmptyString(record.safeRelativePath);
  }
  return true;
}

function currentStem(value: unknown): DeepAiCouncilEventStem | null {
  return typeof value === 'string'
    && (DeepAiCouncilEventStems as readonly string[]).includes(value)
    ? value as DeepAiCouncilEventStem
    : null;
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function token(value: unknown, fallback: string): string {
  return isNonEmptyString(value) ? value : fallback;
}

function uint32(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value) && (value as number) >= 0 ? value as number : fallback;
}

function ratio(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
}

function tokenArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(isNonEmptyString) : [];
}

function scopeFor(
  record: Record<string, unknown>,
  targetStem: DeepAiCouncilEventStem,
): DeepAiCouncilScope {
  const base = {
    runId: record.runId as string,
    roundId: record.roundId as string,
  };
  if (targetStem === 'ai_council.seat_returned') {
    return {
      ...base,
      seatId: record.seatId as string,
      proposalId: record.proposalId as string,
    };
  }
  if (targetStem === 'ai_council.artifact_committed'
    || targetStem === 'ai_council.artifact_superseded') {
    return { ...base, artifactId: record.artifactId as string };
  }
  return base;
}

function informationSurface(
  role: 'generator' | 'orchestrator' | 'scorer',
  digest: string,
): JsonObject {
  return {
    role,
    capabilityRefs: [`legacy-jsonl:${role}`],
    visibleDigests: [digest],
    generatorIdentityVisible: false,
    rationaleVisible: false,
    peerScoresVisible: false,
    voteCountsVisible: false,
    independentJudgmentsCommitted: false,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideDeepAiCouncilCompatibility(
  input: unknown,
): DeepAiCouncilCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }
  if (input.format === 'deep-ai-council-ledger') {
    const stem = currentStem(input.stem);
    return stem
      ? decision('exact', 'current-ledger-event', stem, version)
      : decision('blocked', 'unknown-event-stem', null, version);
  }
  if (input.type === 'audit' && input.event === 'artifact_verified') {
    return decision('compatible', 'legacy-audit-evidence-remains-non-authoritative', null, version);
  }
  if (isNonEmptyString(input.event) && PINNED_LEGACY_EVENTS.has(input.event)) {
    return decision('pin-old-runtime', 'shared-or-lossy-legacy-event', null, version);
  }
  const targetStem = recordTarget(input);
  if (!targetStem) return decision('blocked', 'unknown-legacy-record', null, version);
  if (!hasStableIdentity(input, targetStem)) {
    return decision('pin-old-runtime', 'stable-identity-missing', targetStem, version);
  }
  return decision('migrate', 'registered-pure-upcaster', targetStem, version);
}

export function upcastLegacyDeepAiCouncilRecord(
  input: unknown,
  context: LegacyDeepAiCouncilUpcastContext,
): LegacyDeepAiCouncilUpcastResult {
  const compatibility = decideDeepAiCouncilCompatibility(input);
  if (compatibility.status !== 'migrate' || !compatibility.targetStem || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  const originalRecordDigest = digestRecord(input);
  const legacyRef = `legacy-jsonl:${originalRecordDigest}`;
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'ai_council.round_started':
      data = {
        roundNumber: uint32(input.roundNumber ?? input.round, 1),
        executorBoundaryRef: token(input.executorBoundaryRef, `${legacyRef}:executor`),
        seatRosterDigest: originalRecordDigest,
        protocolVersion: token(input.protocolVersion, 'legacy-jsonl@1'),
        promptPackDigest: originalRecordDigest,
        budgetRef: token(input.budgetRef, `${legacyRef}:budget`),
        priorRoundRef: isNonEmptyString(input.priorRoundRef) ? input.priorRoundRef : null,
        exposurePolicyVersion: 'legacy-jsonl@1',
        informationSurface: informationSurface('orchestrator', originalRecordDigest),
      };
      warnings.push('Legacy round rows collapse roster, prompt-pack, and exposure evidence.');
      break;
    case 'ai_council.seat_returned':
      data = {
        targetVersion: token(input.targetVersion, 'legacy-jsonl@1'),
        responseStatus: ['failed', 'partial', 'returned', 'timeout'].includes(String(input.status))
          ? input.status as string
          : 'returned',
        proposalDigest: originalRecordDigest,
        artifactRef: token(input.artifactRef, `${legacyRef}:proposal`),
        artifactDigest: originalRecordDigest,
        rawScores: {
          quality: ratio(input.quality),
          feasibility: ratio(input.feasibility),
          novelty: ratio(input.novelty),
          risk: ratio(input.risk),
        },
        rawConfidence: ratio(input.confidence),
        usage: {
          receiptRef: token(input.usageReceiptRef, `${legacyRef}:usage`),
          inputTokens: uint32(input.inputTokens, 0),
          outputTokens: uint32(input.outputTokens, 0),
          costMicros: uint32(input.costMicros, 0),
        },
        evidenceRefs: tokenArray(input.evidenceRefs),
        outputSchemaVersion: token(input.outputSchemaVersion, 'legacy-jsonl@1'),
        observationDigest: originalRecordDigest,
        informationSurface: informationSurface('generator', originalRecordDigest),
        failureReason: isNonEmptyString(input.failureReason) ? input.failureReason : null,
        timeoutReason: isNonEmptyString(input.timeoutReason) ? input.timeoutReason : null,
      };
      warnings.push('Legacy seat returns do not independently address all raw score inputs.');
      break;
    case 'ai_council.deliberation_synthesized':
      data = {
        inputEventRange: {
          firstEventId: token(input.firstEventId, `${legacyRef}:first`),
          lastEventId: token(input.lastEventId, `${legacyRef}:last`),
        },
        candidateSetDigest: originalRecordDigest,
        planDisposition: input.unresolved === true ? 'unresolved' : 'selected',
        selectedPlanDigest: originalRecordDigest,
        disagreementRefs: tokenArray(input.disagreementRefs),
        minorityRefs: tokenArray(input.minorityRefs),
        synthesisPolicyFingerprint: originalRecordDigest,
        evaluatorFingerprint: originalRecordDigest,
        reportDraftRef: token(input.reportDraftRef, `${legacyRef}:report-draft`),
        synthesisReceiptRef: token(input.receiptRef, `${legacyRef}:receipt`),
      };
      warnings.push('Legacy synthesis rows retain one source digest for several evidence classes.');
      break;
    case 'ai_council.round_ended':
      data = {
        roundStatus: ['blocked', 'complete', 'incomplete', 'non-converged'].includes(
          String(input.status),
        ) ? input.status as string : 'incomplete',
        convergenceEventId: token(input.convergenceEventId, `${legacyRef}:convergence`),
        acceptedCandidateRefs: tokenArray(input.acceptedCandidateRefs),
        rejectedCandidateRefs: tokenArray(input.rejectedCandidateRefs),
        unresolvedCandidateRefs: tokenArray(input.unresolvedCandidateRefs),
        seatOutcomeCounts: {
          selected: uint32(input.selectedSeats, 0),
          dispatched: uint32(input.dispatchedSeats, 0),
          returned: uint32(input.returnedSeats, 0),
          failed: uint32(input.failedSeats, 0),
          timedOut: uint32(input.timedOutSeats, 0),
        },
        lateResultDisposition: 'retained-for-audit',
        finalRoundTailDigest: context.prevEventHash,
        continuationDecision: 'stop',
      };
      break;
    case 'ai_council.artifact_committed':
      data = {
        artifactKind: token(input.artifactKind, 'legacy-artifact'),
        safeRelativePath: input.safeRelativePath as string,
        schemaVersion: token(input.artifactSchemaVersion, 'legacy-jsonl@1'),
        byteDigest: originalRecordDigest,
        contentDigest: originalRecordDigest,
        requiredSectionResults: [],
        sourceEventRange: {
          firstEventId: token(input.firstEventId, `${legacyRef}:first`),
          lastEventId: token(input.lastEventId, `${legacyRef}:last`),
        },
        supersedesArtifactId: null,
        rollbackRef: null,
      };
      warnings.push('Legacy artifact rows lack independently addressable section results.');
      break;
    case 'ai_council.artifact_superseded':
      data = {
        artifactKind: token(input.artifactKind, 'legacy-artifact'),
        safeRelativePath: input.safeRelativePath as string,
        schemaVersion: token(input.artifactSchemaVersion, 'legacy-jsonl@1'),
        byteDigest: originalRecordDigest,
        contentDigest: originalRecordDigest,
        requiredSectionResults: [],
        sourceEventRange: {
          firstEventId: token(input.firstEventId, `${legacyRef}:first`),
          lastEventId: token(input.lastEventId, `${legacyRef}:last`),
        },
        priorArtifactId: input.priorArtifactId as string,
        successorArtifactId: input.successorArtifactId as string,
        supersessionReason: token(input.reason, 'legacy-artifact-supersession'),
        rollbackRef: isNonEmptyString(input.rollbackRef) ? input.rollbackRef : null,
      };
      break;
    case 'ai_council.rollback_recorded':
      data = {
        rollbackReason: token(input.reason, 'legacy-rollback'),
        supersededEventRefs: tokenArray(input.supersededEventRefs),
        supersededArtifactRefs: tokenArray(input.supersededArtifactRefs),
        failedGateRef: isNonEmptyString(input.failedGateRef) ? input.failedGateRef : null,
        recoveryReceiptRef: token(input.recoveryReceiptRef, `${legacyRef}:recovery`),
        restoredLegacyPathRef: token(input.restoredLegacyPathRef, `${legacyRef}:legacy-path`),
        authorizationRef: token(input.authorizationRef, `${legacyRef}:authorization`),
      };
      break;
    case 'ai_council.council_complete':
      data = {
        terminalStatus: ['completed', 'incomplete', 'non-converged'].includes(
          String(input.status),
        ) ? input.status as string : 'incomplete',
        convergenceEventId: token(input.convergenceEventId, `${legacyRef}:convergence`),
        finalDeliberationEventId: token(
          input.finalDeliberationEventId,
          `${legacyRef}:deliberation`,
        ),
        artifactManifestRef: token(input.artifactManifestRef, `${legacyRef}:manifest`),
        councilTestGateEventId: token(input.councilTestGateEventId, `${legacyRef}:gate`),
        finalLedgerTailDigest: context.prevEventHash,
        counts: {
          rounds: uint32(input.roundCount, 0),
          seats: uint32(input.seatCount, 0),
          proposals: uint32(input.proposalCount, 0),
          judgments: uint32(input.judgmentCount, 0),
        },
        recommendationOrUserDecisionRef: token(
          input.recommendationRef,
          `${legacyRef}:recommendation`,
        ),
        terminalReason: token(input.reason, 'legacy-council-complete'),
      };
      warnings.push('Legacy completion is retained as an observation, not an authority claim.');
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
    originalRecordDigest,
    upcasterFingerprint: LEGACY_UPCASTER_FINGERPRINT,
    warnings: Object.freeze(warnings),
    scope: scopeFor(input, compatibility.targetStem),
    prevEventHash: context.prevEventHash,
    replay: context.replay,
    data,
  });
}
