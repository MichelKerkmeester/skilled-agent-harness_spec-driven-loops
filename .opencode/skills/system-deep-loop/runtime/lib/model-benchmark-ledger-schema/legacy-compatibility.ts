// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Legacy Compatibility
// ───────────────────────────────────────────────────────────────────

import {
  decideDeepImprovementCommonCompatibility,
  upcastLegacyDeepImprovementCommonRecord,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ModelBenchmarkEventStems,
} from './model-benchmark-ledger-types.js';

import type {
  DeepImprovementCommonCompatibilityDecision,
  DeepImprovementCommonEventStem,
  LegacyUpcastContext as CommonLegacyUpcastContext,
} from '../deep-improvement-common-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  LegacyUpcastContext,
  LegacyUpcastResult,
  ModelBenchmarkCompatibilityDecision,
  ModelBenchmarkEventStem,
  ModelBenchmarkTrialScope,
  TrialMatrixKey,
} from './model-benchmark-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. COMPATIBILITY TABLES
// ───────────────────────────────────────────────────────────────────

const CURRENT_EVENT_VERSION = 1 as const;
const LEGACY_UPCASTER_FINGERPRINT = sha256Bytes(canonicalBytes(
  'model-benchmark.legacy-jsonl.upcaster@1',
));
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

const LEGACY_EVENT_STEMS = Object.freeze({
  benchmark_declared: 'model_benchmark.run_declared',
  benchmark_started: 'model_benchmark.run_started',
  benchmark_closed: 'model_benchmark.run_closed',
  trial_result: 'model_benchmark.trial_completed',
} as const satisfies Readonly<Record<string, ModelBenchmarkEventStem>>);

const PINNED_LEGACY_EVENTS = new Set([
  'benchmark_completed',
  'model_promoted',
  'model_ranked',
  'score_observed',
  'selection_completed',
  'winner_selected',
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

function isCode(value: unknown): value is string {
  return typeof value === 'string' && CODE_TOKEN_PATTERN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function sourceVersion(record: Record<string, unknown>): number | null {
  const candidate = record.eventVersion ?? record.schemaVersion ?? 1;
  return Number.isSafeInteger(candidate) ? candidate as number : null;
}

function decision(
  status: ModelBenchmarkCompatibilityDecision['status'],
  reasonCode: string,
  targetStem: ModelBenchmarkEventStem | null,
  version: number | null,
): ModelBenchmarkCompatibilityDecision {
  return Object.freeze({
    status,
    reasonCode,
    targetStem,
    sourceVersion: version,
    targetVersion: CURRENT_EVENT_VERSION,
  });
}

function fromCommonDecision(
  common: DeepImprovementCommonCompatibilityDecision,
): ModelBenchmarkCompatibilityDecision {
  return decision(
    common.status,
    common.reasonCode,
    common.targetStem,
    common.sourceVersion,
  );
}

function eventName(record: Record<string, unknown>): string | null {
  const candidate = record.eventType ?? record.event;
  return typeof candidate === 'string' ? candidate : null;
}

function hasStableRunIdentity(record: Record<string, unknown>): boolean {
  return isToken(record.runId ?? record.sessionId)
    && isToken(record.lineageId ?? record.parentSessionId ?? record.sessionId);
}

function hasStableTrialIdentity(record: Record<string, unknown>): boolean {
  return hasStableRunIdentity(record)
    && isToken(record.trialId)
    && isToken(record.taskInstanceId)
    && isToken(record.taskFamilyId)
    && isToken(record.candidateId)
    && isDigest(record.modelFingerprint)
    && isCode(record.executionPath)
    && isToken(record.pairedBlockId)
    && isCode(record.protocolVariant)
    && Number.isSafeInteger(record.seed)
    && (record.seed as number) >= 0
    && isToken(record.perturbationId)
    && isToken(record.workloadProfileId);
}

function recordTarget(
  record: Record<string, unknown>,
): ModelBenchmarkEventStem | null {
  const name = eventName(record);
  return name
    ? LEGACY_EVENT_STEMS[name as keyof typeof LEGACY_EVENT_STEMS] ?? null
    : null;
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: ModelBenchmarkEventStem,
): boolean {
  return targetStem === 'model_benchmark.trial_completed'
    ? hasStableTrialIdentity(record)
    : hasStableRunIdentity(record);
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

function tokenValue(value: unknown, fallback: string): string {
  return isToken(value) ? value : fallback;
}

function codeValue(value: unknown, fallback: string): string {
  return isCode(value) ? value : fallback;
}

function digestValue(value: unknown, fallback: string): string {
  return isDigest(value) ? value : fallback;
}

function uint32Value(value: unknown, fallback: number): number {
  return Number.isSafeInteger(value)
    && (value as number) >= 0
    && (value as number) <= 0xffff_ffff
    ? value as number
    : fallback;
}

function timestampValue(value: unknown, fallback: string): string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime())
    ? value
    : fallback;
}

function currentStem(value: unknown): ModelBenchmarkEventStem | null {
  return typeof value === 'string'
    && (ModelBenchmarkEventStems as readonly string[]).includes(value)
    ? value as ModelBenchmarkEventStem
    : null;
}

function isTrialScope(
  scope: LegacyUpcastContext['scope'],
): scope is ModelBenchmarkTrialScope {
  return isToken(scope.trialId)
    && isToken(scope.taskInstanceId)
    && isToken(scope.taskFamilyId)
    && isToken(scope.candidateId)
    && isDigest(scope.modelFingerprint)
    && isCode(scope.executionPath)
    && isToken(scope.pairedBlockId);
}

function scopeMatchesRecord(
  scope: ModelBenchmarkTrialScope,
  record: Record<string, unknown>,
): boolean {
  return scope.runId === (record.runId ?? record.sessionId)
    && scope.lineageId === (
      record.lineageId ?? record.parentSessionId ?? record.sessionId
    )
    && scope.trialId === record.trialId
    && scope.taskInstanceId === record.taskInstanceId
    && scope.taskFamilyId === record.taskFamilyId
    && scope.candidateId === record.candidateId
    && scope.modelFingerprint === record.modelFingerprint
    && scope.executionPath === record.executionPath
    && scope.pairedBlockId === record.pairedBlockId;
}

function matrixKey(
  record: Record<string, unknown>,
  recordDigest: string,
): TrialMatrixKey {
  return {
    candidateId: record.candidateId as string,
    modelFingerprint: record.modelFingerprint as string,
    executionPath: record.executionPath as string,
    taskInstanceId: record.taskInstanceId as string,
    taskFamilyId: record.taskFamilyId as string,
    pairedBlockId: record.pairedBlockId as string,
    protocolVariant: record.protocolVariant as string,
    seed: record.seed as number,
    perturbationId: record.perturbationId as string,
    workloadProfileId: record.workloadProfileId as string,
    promptRecipeFingerprint: digestValue(
      record.promptRecipeFingerprint,
      recordDigest,
    ),
    routeFingerprint: digestValue(record.routeFingerprint, recordDigest),
    frameworkFingerprint: digestValue(record.frameworkFingerprint, recordDigest),
    toolRecipeFingerprint: digestValue(record.toolRecipeFingerprint, recordDigest),
    attempt: Math.max(1, uint32Value(record.attempt, 1)),
  };
}

function isCommonTarget(
  stem: ModelBenchmarkEventStem,
): stem is DeepImprovementCommonEventStem {
  return stem.startsWith('deep_improvement_common.');
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC COMPATIBILITY HOOKS
// ───────────────────────────────────────────────────────────────────

export function decideModelBenchmarkCompatibility(
  input: unknown,
): ModelBenchmarkCompatibilityDecision {
  if (!isObject(input)) return decision('blocked', 'invalid-record', null, null);
  const version = sourceVersion(input);
  if (version === null || version <= 0 || version > CURRENT_EVENT_VERSION) {
    return decision('blocked', 'unknown-event-version', null, version);
  }

  if (input.format === 'model-benchmark-ledger') {
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
      'legacy-event-has-no-lossless-model-benchmark-event',
      null,
      version,
    );
  }

  const targetStem = recordTarget(input);
  if (targetStem) {
    if (!stableTargetIdentity(input, targetStem)) {
      return decision(
        'pin-old-runtime',
        'stable-identity-missing',
        targetStem,
        version,
      );
    }
    return decision('migrate', 'registered-pure-upcaster', targetStem, version);
  }

  const common = decideDeepImprovementCommonCompatibility(input);
  return common.status === 'blocked'
    ? decision('blocked', 'unknown-legacy-record', null, version)
    : fromCommonDecision(common);
}

export function upcastLegacyModelBenchmarkRecord(
  input: unknown,
  context: LegacyUpcastContext,
): LegacyUpcastResult {
  const compatibility = decideModelBenchmarkCompatibility(input);
  if (compatibility.status !== 'migrate'
    || !compatibility.targetStem
    || !isObject(input)) {
    return Object.freeze({ status: 'refused', decision: compatibility });
  }

  if (isCommonTarget(compatibility.targetStem)) {
    if (context.scope.variant !== 'model-benchmark') {
      return Object.freeze({
        status: 'refused',
        decision: decision(
          'pin-old-runtime',
          'model-benchmark-common-scope-missing',
          compatibility.targetStem,
          compatibility.sourceVersion,
        ),
      });
    }
    return upcastLegacyDeepImprovementCommonRecord(
      input,
      context as unknown as CommonLegacyUpcastContext,
    ) as unknown as LegacyUpcastResult;
  }

  const recordDigest = digestRecord(input);
  const warnings: string[] = [];
  let data: JsonObject;

  switch (compatibility.targetStem) {
    case 'model_benchmark.run_declared':
      data = {
        generation: Math.max(1, uint32Value(input.generation, 1)),
        benchmarkRecipeRef: `legacy-jsonl:${recordDigest}:recipe`,
        benchmarkRecipeDigest: recordDigest,
        evaluatorServiceRef: tokenValue(
          input.evaluatorServiceRef,
          'service:legacy-model-benchmark-evaluator',
        ),
        canaryServiceRef: tokenValue(
          input.canaryServiceRef,
          'service:legacy-model-benchmark-canary',
        ),
        promotionServiceRef: tokenValue(
          input.promotionServiceRef,
          'service:legacy-deep-improvement-promotion',
        ),
        sharedServiceContractVersion: tokenValue(
          input.sharedServiceContractVersion,
          'legacy-model-benchmark@1',
        ),
        replayFingerprint: context.replay.final_digest,
      };
      warnings.push(
        'Legacy declaration uses the source record digest for sealed recipe evidence.',
      );
      break;
    case 'model_benchmark.run_started':
      data = {
        declarationEventId: `legacy-jsonl:${recordDigest}:declaration`,
        declarationPayloadDigest: recordDigest,
        capsuleEventId: `legacy-jsonl:${recordDigest}:capsule`,
        capsulePayloadDigest: recordDigest,
        workloadEventId: `legacy-jsonl:${recordDigest}:workload`,
        workloadPayloadDigest: recordDigest,
        executionReceiptRef: `legacy-jsonl:${recordDigest}:execution`,
        startedAt: timestampValue(input.startedAt, '1970-01-01T00:00:00.000Z'),
      };
      warnings.push(
        'Legacy start did not separate declaration, capsule, and workload digests.',
      );
      break;
    case 'model_benchmark.trial_completed':
      if (!isTrialScope(context.scope)
        || !scopeMatchesRecord(context.scope, input)) {
        return Object.freeze({
          status: 'refused',
          decision: decision(
            'pin-old-runtime',
            'trial-scope-missing-or-mismatched',
            compatibility.targetStem,
            compatibility.sourceVersion,
          ),
        });
      }
      data = {
        trialMatrixKey: matrixKey(input, recordDigest),
        dispatchedEventId: tokenValue(
          input.dispatchedEventId,
          `legacy-jsonl:${recordDigest}:dispatch`,
        ),
        dispatchedPayloadDigest: digestValue(
          input.dispatchedPayloadDigest,
          recordDigest,
        ),
        rawResultRef: tokenValue(
          input.rawResultRef,
          `legacy-jsonl:${recordDigest}:result`,
        ),
        rawResultDigest: digestValue(input.rawResultDigest, recordDigest),
        inputDigest: digestValue(input.inputDigest, recordDigest),
        outputDigest: digestValue(input.outputDigest, recordDigest),
        completionReceiptRef: tokenValue(
          input.completionReceiptRef,
          `legacy-jsonl:${recordDigest}:completion`,
        ),
        completedAt: timestampValue(
          input.completedAt,
          '1970-01-01T00:00:00.000Z',
        ),
      };
      warnings.push(
        'Missing legacy execution-stack fingerprints retain the source record digest.',
      );
      break;
    case 'model_benchmark.run_closed':
      data = {
        terminalOutcome: input.terminalOutcome === 'completed'
          ? 'completed'
          : input.terminalOutcome === 'quarantined'
            ? 'quarantined'
            : 'aborted',
        finalLedgerTailHash: context.prevEventHash,
        counts: {
          admittedTrials: uint32Value(input.admittedTrials, 0),
          completedTrials: uint32Value(input.completedTrials, 0),
          failedTrials: uint32Value(input.failedTrials, 0),
          unknownTrials: uint32Value(input.unknownTrials, 0),
          invalidatedTrials: uint32Value(input.invalidatedTrials, 0),
        },
        completionEvidenceRefs: [`legacy-jsonl:${recordDigest}:completion`],
        closedAt: timestampValue(input.closedAt, '1970-01-01T00:00:00.000Z'),
      };
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
