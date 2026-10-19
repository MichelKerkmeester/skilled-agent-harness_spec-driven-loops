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
  DeepResearchScope,
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
  question_registered: 'deep_research.question_registered',
  spec_check_result: 'deep_research.spec_check_result',
  spec_seed_created: 'deep_research.spec_seed_created',
  spec_preinit_context_added: 'deep_research.spec_preinit_context_added',
  spec_preinit_context_deduped: 'deep_research.spec_preinit_context_deduped',
  spec_mutation: 'deep_research.spec_mutation',
  spec_mutation_conflict: 'deep_research.spec_mutation_conflict',
  spec_synthesis_deferred: 'deep_research.spec_synthesis_deferred',
  idea_observed: 'deep_research.idea_observed',
  ideaObserved: 'deep_research.idea_observed',
  idea_promoted: 'deep_research.idea_promoted',
  ideaPromoted: 'deep_research.idea_promoted',
  idea_rejected: 'deep_research.idea_rejected',
  ideaRejected: 'deep_research.idea_rejected',
  idea_rejected_removed: 'deep_research.idea_rejected_removed',
  ideaRejectedRemoved: 'deep_research.idea_rejected_removed',
  idea_rejected_reset: 'deep_research.idea_rejected_reset',
  ideaRejectedReset: 'deep_research.idea_rejected_reset',
  question_conflict: 'deep_research.question_conflict',
} as const satisfies Readonly<Record<string, DeepResearchEventStem>>);

const PINNED_LEGACY_TYPES = new Set([
  'iteration_start',
]);

const PINNED_LEGACY_EVENTS = new Set([
  'detached_scope_bound',
  'started',
  'run_now_requested',
  'run_now_rejected',
  'run_now_accepted',
  'run_now_restored',
  'config_warning',
  'graph_convergence',
  'synthesis_incomplete',
  'synthesis_complete',
  'lock_released',
  // Operational records have no lossless research-event target. Pinning
  // preserves their legacy address without inventing ledger semantics for
  // pivots or advisories.
  'stuckRecovery',
  'userPaused',
  'novelty_signal_inert',
  'trend_flatline',
  'pivot_started',
  'pivot_selected',
  'pivot_completed',
  'pivot_failed',
  'pivot_override_accepted',
  // Artifact-path migration bookkeeping and the convergence-floor guard outcome
  // have no lossless research-event target: the canonical stems describe run
  // lifecycle and research semantics, not those side effects. Pinning keeps the
  // records addressable without coercing them into a stem that means something else.
  'migration',
  'min_iterations_guard_pass',
]);

// The workflows write the spec-protocol rows without run or session identity, so
// their scope comes from the append context rather than the record. Their payload
// fields are checked in the upcaster, where a missing field becomes a named refusal.
const CONTEXT_SCOPE_STEMS = new Set<DeepResearchEventStem>([
  'deep_research.spec_check_result',
  'deep_research.spec_seed_created',
  'deep_research.spec_preinit_context_added',
  'deep_research.spec_preinit_context_deduped',
  'deep_research.spec_mutation',
  'deep_research.spec_mutation_conflict',
  'deep_research.spec_synthesis_deferred',
]);

// The rows the research reducer reads back: its own promotions and conflicts,
// and the idea rows the research agent and the operator record. Each travels
// under its stem field for field, so the projection can write the same row
// back: the payload keeps the row's own names, a field the row left out stays
// out, and the row's timestamp becomes the event's occurrence time. A row with
// a field outside its shape is refused rather than carried without it.
interface ReducerReadRowShape {
  readonly event: string;
  readonly required: readonly string[];
  // At least one of these must be present; empty when the row needs none.
  readonly anyOf: readonly string[];
  readonly optional: readonly string[];
}

const IDEA_REJECTION_FIELDS = Object.freeze([
  'mode', 'run', 'rejectedId', 'ideaId', 'idea', 'pattern', 'category', 'reason',
  'sessionId', 'generation',
]);

const REDUCER_READ_ROW_SHAPES: Readonly<
  Partial<Record<DeepResearchEventStem, ReducerReadRowShape>>
> = Object.freeze({
  'deep_research.idea_observed': Object.freeze({
    event: 'idea_observed',
    required: ['idea'],
    anyOf: [],
    optional: ['mode', 'run', 'ideaId', 'category', 'source', 'sessionId', 'generation'],
  }),
  'deep_research.idea_promoted': Object.freeze({
    event: 'idea_promoted',
    required: [
      'mode', 'run', 'ideaId', 'idea', 'category', 'observationCount', 'minIdeaObservations',
      'firstObservedRun', 'lastObservedRun',
    ],
    anyOf: [],
    optional: ['sessionId', 'generation'],
  }),
  'deep_research.idea_rejected': Object.freeze({
    event: 'idea_rejected',
    required: [],
    anyOf: ['idea', 'pattern'],
    optional: IDEA_REJECTION_FIELDS,
  }),
  'deep_research.idea_rejected_removed': Object.freeze({
    event: 'idea_rejected_removed',
    required: [],
    anyOf: ['rejectedId', 'ideaId', 'idea', 'pattern'],
    optional: IDEA_REJECTION_FIELDS,
  }),
  'deep_research.idea_rejected_reset': Object.freeze({
    event: 'idea_rejected_reset',
    required: [],
    anyOf: [],
    optional: ['mode', 'run', 'reason', 'sessionId', 'generation'],
  }),
  'deep_research.question_conflict': Object.freeze({
    event: 'question_conflict',
    required: [
      'mode', 'run', 'conflictId', 'questionId', 'inboxId', 'operatorDecision', 'inboxValue',
      'registryValue', 'source', 'origin', 'injectedAtIteration', 'sessionId', 'generation',
    ],
    anyOf: [],
    optional: [],
  }),
});

// The row's envelope bookkeeping: the record and event names select the stem,
// the version fields are checked by the compatibility decision and carried by
// the event's own version, and the timestamp becomes its occurrence time.
const LEGACY_ROW_ENVELOPE_FIELDS = new Set([
  'type', 'event', 'timestamp', 'schemaVersion', 'eventVersion',
]);

const UTC_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

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

function refusedUpcast(
  compatibility: DeepResearchCompatibilityDecision,
  reasonCode: string,
): LegacyUpcastResult {
  return Object.freeze({
    status: 'refused',
    decision: decision(
      'pin-old-runtime',
      reasonCode,
      compatibility.targetStem,
      compatibility.sourceVersion,
    ),
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
  // The workflows stamp the six mutation-family rows with a spec_mutation record
  // type, so for those rows the event name is the only key that names a stem.
  if ((record.type === 'event' || record.type === 'spec_mutation')
    && isNonEmptyString(record.event)) {
    return LEGACY_EVENT_STEMS[record.event as keyof typeof LEGACY_EVENT_STEMS] ?? null;
  }
  return null;
}

function stringArray(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every(isNonEmptyString)) return null;
  return [...value];
}

function requiredStringField(record: Record<string, unknown>, field: string): string | null {
  return isNonEmptyString(record[field]) ? record[field] : null;
}

// Absent reads as null; present must be a non-empty string, else undefined marks it invalid.
function optionalStringField(record: Record<string, unknown>, field: string): string | null | undefined {
  if (!(field in record)) return null;
  return isNonEmptyString(record[field]) ? record[field] : undefined;
}

function requiredStringArrayField(
  record: Record<string, unknown>,
  field: string,
): string[] | null {
  return stringArray(record[field]);
}

function hasQuestionRegistrationData(record: Record<string, unknown>): boolean {
  return hasStableIdentity(record)
    && isNonEmptyString(record.questionId)
    && isNonEmptyString(record.normalizedQuestionDigest)
    && stringArray(record.dependencyQuestionIds) !== null
    && stringArray(record.requiredSourceClasses) !== null
    && stringArray(record.disconfirmingQueryRecipeIds) !== null
    && isNonEmptyString(record.budgetRef);
}

function stableTargetIdentity(
  record: Record<string, unknown>,
  targetStem: DeepResearchEventStem,
): boolean {
  if (targetStem === 'deep_research.iteration_completed'
    || targetStem === 'deep_research.convergence_blocked') {
    return hasIterationIdentity(record);
  }
  if (targetStem === 'deep_research.question_registered') {
    return hasQuestionRegistrationData(record);
  }
  // The spec-protocol rows carry no run or session identity: the append context
  // supplies their scope and the upcaster validates their payload fields. The
  // rows the reducer reads back are scoped the same way.
  if (CONTEXT_SCOPE_STEMS.has(targetStem)) return true;
  if (REDUCER_READ_ROW_SHAPES[targetStem]) return true;
  return hasStableIdentity(record);
}

// The envelope accepts only a UTC instant, and the projection writes the
// occurrence time back as the row's timestamp, so anything else cannot travel.
function isUtcTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !UTC_TIMESTAMP_PATTERN.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 19) === value.slice(0, 19);
}

function reducerReadRowReason(stem: DeepResearchEventStem, problem: string): string {
  return `${stem.replace(/^deep_research\./, '').replace(/_/g, '-')}-fields-${problem}`;
}

function digestRecord(record: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(record as JsonObject));
}

// The longest topic the run-open event's prose rule accepts; a longer one is
// left out so the row still upcasts and the projection falls back to the run id.
const MAX_TOPIC_LENGTH = 4_096;

function legacyTopic(value: unknown): { readonly topic: string } | Record<string, never> {
  return isNonEmptyString(value) && value.length <= MAX_TOPIC_LENGTH
    ? { topic: value }
    : {};
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

  if (typeof input.type === 'string' && PINNED_LEGACY_TYPES.has(input.type)) {
    return decision('pin-old-runtime', 'legacy-record-has-no-lossless-mode-event', null, version);
  }

  if (input.type === 'event' && isNonEmptyString(input.event)
    && PINNED_LEGACY_EVENTS.has(input.event)) {
    return decision('pin-old-runtime', 'legacy-event-has-no-lossless-mode-event', null, version);
  }

  const targetStem = recordTarget(input);
  if (!targetStem) return decision('blocked', 'unknown-legacy-record', null, version);
  if (!stableTargetIdentity(input, targetStem)) {
    const reasonCode = targetStem === 'deep_research.question_registered'
      && hasStableIdentity(input)
      ? 'question-registration-fields-missing'
      : 'stable-identity-missing';
    return decision('pin-old-runtime', reasonCode, targetStem, version);
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
  let scope: DeepResearchScope = context.scope;
  let occurredAt: string | undefined;

  switch (compatibility.targetStem) {
    case 'deep_research.question_registered': {
      const dependencyQuestionIds = stringArray(input.dependencyQuestionIds);
      const requiredSourceClasses = stringArray(input.requiredSourceClasses);
      const disconfirmingQueryRecipeIds = stringArray(input.disconfirmingQueryRecipeIds);
      if (!hasQuestionRegistrationData(input)
        || dependencyQuestionIds === null
        || requiredSourceClasses === null
        || disconfirmingQueryRecipeIds === null) {
        return Object.freeze({
          status: 'refused',
          decision: decision(
            'pin-old-runtime',
            'question-registration-fields-missing',
            compatibility.targetStem,
            compatibility.sourceVersion,
          ),
        });
      }
      scope = { ...context.scope, questionId: input.questionId as string };
      data = {
        normalizedQuestionDigest: input.normalizedQuestionDigest as string,
        dependencyQuestionIds,
        requiredSourceClasses,
        disconfirmingQueryRecipeIds,
        budgetRef: input.budgetRef as string,
      };
      break;
    }
    case 'deep_research.run_initialized':
      data = {
        generation: positiveInteger(input.generation, 1),
        charterDigest: recordDigest,
        configDigest: recordDigest,
        executorFingerprint: sha256Bytes(canonicalBytes(stringValue(input.executor, 'legacy'))),
        replayFingerprint: context.replay.final_digest,
        maxIterations: positiveInteger(input.maxIterations, 0),
        convergencePolicyVersion: 'legacy-jsonl@1',
        ...legacyTopic(input.topic),
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
    case 'deep_research.spec_check_result': {
      const folderState = requiredStringField(input, 'folder_state');
      const normalizedTopic = requiredStringField(input, 'normalized_topic');
      const specPath = requiredStringField(input, 'specPath');
      const lockPath = requiredStringField(input, 'lockPath');
      if (folderState === null || normalizedTopic === null
        || specPath === null || lockPath === null) {
        return refusedUpcast(compatibility, 'spec-check-result-fields-missing');
      }
      data = { folderState, normalizedTopic, specPath, lockPath };
      break;
    }
    case 'deep_research.spec_seed_created': {
      const folderState = requiredStringField(input, 'folder_state');
      const anchorsTouched = requiredStringArrayField(input, 'anchors_touched');
      const diffSummary = requiredStringField(input, 'diff_summary');
      const seedMarkers = requiredStringArrayField(input, 'seed_markers');
      if (folderState === null || anchorsTouched === null
        || diffSummary === null || seedMarkers === null) {
        return refusedUpcast(compatibility, 'spec-seed-created-fields-missing');
      }
      data = { folderState, anchorsTouched, diffSummary, seedMarkers };
      break;
    }
    case 'deep_research.spec_preinit_context_added': {
      const folderState = requiredStringField(input, 'folder_state');
      const normalizedTopic = requiredStringField(input, 'normalized_topic');
      const specPath = requiredStringField(input, 'specPath');
      const anchorsTouched = requiredStringArrayField(input, 'anchors_touched');
      const diffSummary = requiredStringField(input, 'diff_summary');
      if (folderState === null || normalizedTopic === null || specPath === null
        || anchorsTouched === null || diffSummary === null) {
        return refusedUpcast(compatibility, 'spec-preinit-context-added-fields-missing');
      }
      data = { folderState, normalizedTopic, specPath, anchorsTouched, diffSummary };
      break;
    }
    case 'deep_research.spec_preinit_context_deduped': {
      const folderState = requiredStringField(input, 'folder_state');
      const normalizedTopic = requiredStringField(input, 'normalized_topic');
      const specPath = requiredStringField(input, 'specPath');
      const anchorsTouched = requiredStringArrayField(input, 'anchors_touched');
      const diffSummary = requiredStringField(input, 'diff_summary');
      if (folderState === null || normalizedTopic === null || specPath === null
        || anchorsTouched === null || diffSummary === null) {
        return refusedUpcast(compatibility, 'spec-preinit-context-deduped-fields-missing');
      }
      data = { folderState, normalizedTopic, specPath, anchorsTouched, diffSummary };
      break;
    }
    case 'deep_research.spec_mutation': {
      const phase = requiredStringField(input, 'phase');
      const anchorsTouched = requiredStringArrayField(input, 'anchors_touched');
      const diffSummary = requiredStringField(input, 'diff_summary');
      const generatedFence = requiredStringField(input, 'generatedFence');
      if (phase === null || anchorsTouched === null
        || diffSummary === null || generatedFence === null) {
        return refusedUpcast(compatibility, 'spec-mutation-fields-missing');
      }
      data = { phase, anchorsTouched, diffSummary, generatedFence };
      break;
    }
    case 'deep_research.spec_mutation_conflict': {
      const folderState = requiredStringField(input, 'folder_state');
      const reason = requiredStringField(input, 'reason');
      const specPath = requiredStringField(input, 'specPath');
      // The pre-init row carries neither field; the post-synthesis row carries both.
      const generatedFence = optionalStringField(input, 'generatedFence');
      const conflictKind = optionalStringField(input, 'conflictKind');
      if (folderState === null || reason === null || specPath === null
        || generatedFence === undefined || conflictKind === undefined) {
        return refusedUpcast(compatibility, 'spec-mutation-conflict-fields-missing');
      }
      data = { folderState, reason, specPath, generatedFence, conflictKind };
      break;
    }
    case 'deep_research.spec_synthesis_deferred': {
      const reason = requiredStringField(input, 'reason');
      const generatedFence = requiredStringField(input, 'generatedFence');
      if (reason === null || generatedFence === null) {
        return refusedUpcast(compatibility, 'spec-synthesis-deferred-fields-missing');
      }
      data = { reason, generatedFence };
      break;
    }
    case 'deep_research.idea_observed':
    case 'deep_research.idea_promoted':
    case 'deep_research.idea_rejected':
    case 'deep_research.idea_rejected_removed':
    case 'deep_research.idea_rejected_reset':
    case 'deep_research.question_conflict': {
      const targetStem = compatibility.targetStem;
      const shape = REDUCER_READ_ROW_SHAPES[targetStem] as ReducerReadRowShape;
      const fields = Object.keys(input).filter((field) => !LEGACY_ROW_ENVELOPE_FIELDS.has(field));
      const known = new Set([...shape.required, ...shape.anyOf, ...shape.optional]);
      // The projection writes these rows back as event rows, so any other record
      // type would come back changed.
      if (input.type !== 'event' || fields.some((field) => !known.has(field))) {
        return refusedUpcast(compatibility, reducerReadRowReason(targetStem, 'unrecognized'));
      }
      if (shape.required.some((field) => !fields.includes(field))
        || (shape.anyOf.length > 0 && !shape.anyOf.some((field) => fields.includes(field)))) {
        return refusedUpcast(compatibility, reducerReadRowReason(targetStem, 'missing'));
      }
      if (!isUtcTimestamp(input.timestamp)) {
        return refusedUpcast(compatibility, 'legacy-row-timestamp-invalid');
      }
      data = Object.fromEntries(fields.map((field) => [field, input[field]])) as JsonObject;
      if (input.event !== shape.event) data.eventAlias = input.event as string;
      if ('schemaVersion' in input || 'eventVersion' in input) {
        warnings.push('The row version is carried by the event version and left out of the projected row.');
      }
      scope = { runId: context.scope.runId, lineageId: context.scope.lineageId };
      occurredAt = input.timestamp;
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
    scope,
    prevEventHash: context.prevEventHash,
    replay: context.replay,
    data,
    ...(occurredAt === undefined ? {} : { occurredAt }),
  });
}
