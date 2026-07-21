// ───────────────────────────────────────────────────────────────────
// MODULE: Standard Stream-Fold Gauges
// ───────────────────────────────────────────────────────────────────

import { GaugeRegistry } from './gauge-registry.js';
import {
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from './stream-fold-gauge-errors.js';
import { GaugeFamilies } from './stream-fold-gauge-types.js';

import type { EventReadResult, JsonObject, JsonValue } from '../event-envelope/index.js';
import type { GaugeDefinition, GaugeRegistryEntry } from './stream-fold-gauge-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. SOURCE AND GAUGE IDENTITIES
// ───────────────────────────────────────────────────────────────────

/** Typed lifecycle input consumed by the progress gauge. */
export const PROGRESS_WORK_EVENT_TYPE = 'deep-loop.work.lifecycle-recorded';
/** Typed obligation input consumed by the progress gauge. */
export const PROGRESS_OBLIGATION_EVENT_TYPE = 'deep-loop.evidence.obligation-recorded';
/** Typed disposition input consumed by the novelty gauge. */
export const NOVELTY_DISPOSITION_EVENT_TYPE = 'deep-loop.novelty.disposition-recorded';
/** Typed usage input consumed by the cost gauge. */
export const COST_USAGE_EVENT_TYPE = 'deep-loop.budget.usage-recorded';
/** Typed health observation consumed by the health gauge. */
export const HEALTH_INPUT_EVENT_TYPE = 'deep-loop.health.input-recorded';

/** Stable identities for the standard deterministic gauges. */
export const StandardGaugeIds = {
  PROGRESS: 'deep-loop.progress.work',
  NOVELTY: 'deep-loop.novelty.dispositions',
  COST: 'deep-loop.cost.usage',
  HEALTH: 'deep-loop.health.inputs',
} as const;

const GAUGE_VERSION = '1.0.0';
const MAX_DECIMAL_DIGITS = 78;
const DECIMAL_PATTERN = /^(0|[1-9]\d*)$/;
const SIGNED_DECIMAL_PATTERN = /^(0|[1-9]\d*|-[1-9]\d*)$/;

const WORK_STATES = new Set(['open', 'completed', 'failed', 'cancelled']);
const OBLIGATION_STATES = new Set(['open', 'covered']);
const NOVELTY_DISPOSITIONS = Object.freeze([
  'novel',
  'reused',
  'contradicted',
  'superseded',
  'unknown',
] as const);
const COST_UNITS = Object.freeze([
  'tokens',
  'currency_minor',
  'duration_ms',
  'iterations',
  'tool_uses',
] as const);
const HEALTH_METRICS = Object.freeze([
  'lag_ms',
  'pending',
  'failed',
  'retried',
  'orphaned',
  'stalled',
  'integrity_refused',
] as const);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: JsonObject, fields: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  return actual.length === expected.length
    && actual.every((field, index) => field === expected[index]);
}

function payloadOf(event: Readonly<EventReadResult>, fields: readonly string[]): JsonObject {
  const payload = event.effective.envelope.payload;
  if (!hasExactFields(payload, fields)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_PAYLOAD,
      'reducer',
      'Gauge source payload does not match its exact field contract',
      { eventType: event.effective.envelope.event_type },
    );
  }
  return payload;
}

function requireIdentity(value: JsonValue | undefined, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_PAYLOAD,
      'reducer',
      'Gauge source identity must be a non-empty string',
      { field },
    );
  }
  return value;
}

function increment(value: number): number {
  if (!Number.isSafeInteger(value) || value >= Number.MAX_SAFE_INTEGER) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Gauge counter exceeds exact safe-integer arithmetic',
    );
  }
  return value + 1;
}

function requireUnsignedDecimal(value: JsonValue | undefined, field: string): string {
  if (
    typeof value !== 'string'
    || !DECIMAL_PATTERN.test(value)
    || value.length > MAX_DECIMAL_DIGITS
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Exact gauge units require bounded canonical decimal strings',
      { field },
    );
  }
  return value;
}

function addDecimal(left: string, right: string, direction: 'debit' | 'credit'): string {
  const signed = direction === 'debit' ? BigInt(right) : -BigInt(right);
  const total = BigInt(left) + signed;
  const encoded = total.toString(10);
  if (encoded.replace('-', '').length > MAX_DECIMAL_DIGITS) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Exact gauge total exceeds the declared decimal bound',
    );
  }
  return encoded;
}

function sumUnsignedDecimals(values: readonly string[]): string {
  let total = 0n;
  for (const value of values) total += BigInt(value);
  const encoded = total.toString(10);
  if (encoded.length > MAX_DECIMAL_DIGITS) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Health-input total exceeds the declared decimal bound',
    );
  }
  return encoded;
}

function isStringMap(value: unknown, allowed: ReadonlySet<string>): boolean {
  return isObject(value)
    && Object.values(value).every((entry) => typeof entry === 'string' && allowed.has(entry));
}

function isSafeCounter(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

// ───────────────────────────────────────────────────────────────────
// 3. PROGRESS GAUGE
// ───────────────────────────────────────────────────────────────────

interface ProgressAccumulator extends JsonObject {
  readonly workStates: JsonObject;
  readonly obligationStates: JsonObject;
  readonly acceptedEvents: number;
}

function validateProgressAccumulator(state: Readonly<JsonObject>): boolean {
  return hasExactFields(state as JsonObject, ['acceptedEvents', 'obligationStates', 'workStates'])
    && isStringMap(state.workStates, WORK_STATES)
    && isStringMap(state.obligationStates, OBLIGATION_STATES)
    && isSafeCounter(state.acceptedEvents);
}

function reduceProgress(
  state: Readonly<JsonObject>,
  event: Readonly<EventReadResult>,
): ProgressAccumulator {
  const current = state as ProgressAccumulator;
  const eventType = event.effective.envelope.event_type;
  if (eventType === PROGRESS_WORK_EVENT_TYPE) {
    const payload = payloadOf(event, ['state', 'work_id']);
    const workId = requireIdentity(payload.work_id, 'work_id');
    if (typeof payload.state !== 'string' || !WORK_STATES.has(payload.state)) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.INVALID_PAYLOAD,
        'reducer',
        'Work lifecycle state is unsupported',
        { state: typeof payload.state === 'string' ? payload.state : null },
      );
    }
    return {
      ...current,
      workStates: { ...current.workStates, [workId]: payload.state },
      acceptedEvents: increment(current.acceptedEvents),
    };
  }
  const payload = payloadOf(event, ['obligation_id', 'state']);
  const obligationId = requireIdentity(payload.obligation_id, 'obligation_id');
  if (typeof payload.state !== 'string' || !OBLIGATION_STATES.has(payload.state)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_PAYLOAD,
      'reducer',
      'Evidence-obligation state is unsupported',
      { state: typeof payload.state === 'string' ? payload.state : null },
    );
  }
  return {
    ...current,
    obligationStates: { ...current.obligationStates, [obligationId]: payload.state },
    acceptedEvents: increment(current.acceptedEvents),
  };
}

function finalizeProgress(state: Readonly<JsonObject>): JsonObject {
  const current = state as ProgressAccumulator;
  const workStates = Object.values(current.workStates);
  const obligationStates = Object.values(current.obligationStates);
  return {
    totalWork: workStates.length,
    openWork: workStates.filter((entry) => entry === 'open').length,
    completedWork: workStates.filter((entry) => entry === 'completed').length,
    failedWork: workStates.filter((entry) => entry === 'failed').length,
    cancelledWork: workStates.filter((entry) => entry === 'cancelled').length,
    totalObligations: obligationStates.length,
    openObligations: obligationStates.filter((entry) => entry === 'open').length,
    coveredObligations: obligationStates.filter((entry) => entry === 'covered').length,
    acceptedEvents: current.acceptedEvents,
  };
}

function validateProgressOutput(output: Readonly<JsonObject>): boolean {
  return hasExactFields(output as JsonObject, [
    'acceptedEvents',
    'cancelledWork',
    'completedWork',
    'coveredObligations',
    'failedWork',
    'openObligations',
    'openWork',
    'totalObligations',
    'totalWork',
  ]) && Object.values(output).every(isSafeCounter);
}

function progressDefinition(): GaugeDefinition {
  return {
    gaugeId: StandardGaugeIds.PROGRESS,
    gaugeVersion: GAUGE_VERSION,
    family: GaugeFamilies.PROGRESS,
    acceptedEvents: [
      { eventType: PROGRESS_WORK_EVENT_TYPE, effectiveVersions: [1] },
      { eventType: PROGRESS_OBLIGATION_EVENT_TYPE, effectiveVersions: [1] },
    ],
    reducerIdentity: 'progress-work-obligation-fold-v1',
    outputSchemaVersion: '1',
    configuration: {},
    numericPolicy: { representation: 'safe-integer-counts' },
    missingValueSemantics: 'Absent work and obligations contribute zero; latest explicit state wins.',
    downstreamOwner: 'progress and convergence consumers',
    unknownEventPolicy: 'ignore',
    dependencies: [],
    initialAccumulator: { workStates: {}, obligationStates: {}, acceptedEvents: 0 },
    reduce: reduceProgress,
    finalize: finalizeProgress,
    validateAccumulator: validateProgressAccumulator,
    validateOutput: validateProgressOutput,
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. NOVELTY GAUGE
// ───────────────────────────────────────────────────────────────────

interface NoveltyAccumulator extends JsonObject {
  readonly counts: JsonObject;
  readonly firstIncludedSequence: number | null;
  readonly lastIncludedSequence: number | null;
  readonly acceptedEvents: number;
}

function validateNoveltyAccumulator(state: Readonly<JsonObject>): boolean {
  if (!hasExactFields(state as JsonObject, [
    'acceptedEvents',
    'counts',
    'firstIncludedSequence',
    'lastIncludedSequence',
  ])) return false;
  const counts = state.counts;
  if (!isObject(counts)) return false;
  if (!NOVELTY_DISPOSITIONS.every((key) => isSafeCounter(counts[key]))) return false;
  return isSafeCounter(state.acceptedEvents)
    && (state.firstIncludedSequence === null || isSafeCounter(state.firstIncludedSequence))
    && (state.lastIncludedSequence === null || isSafeCounter(state.lastIncludedSequence));
}

function noveltyReducer(
  windowStartSequence: number,
  windowEndSequence: number | null,
): GaugeDefinition['reduce'] {
  return (state, event, ledgerSequence) => {
    const current = state as NoveltyAccumulator;
    if (
      ledgerSequence < windowStartSequence
      || (windowEndSequence !== null && ledgerSequence > windowEndSequence)
    ) return current;
    const payload = payloadOf(event, ['claim_id', 'disposition']);
    requireIdentity(payload.claim_id, 'claim_id');
    if (
      typeof payload.disposition !== 'string'
      || !(NOVELTY_DISPOSITIONS as readonly string[]).includes(payload.disposition)
    ) {
      throw new StreamFoldGaugeError(
        StreamFoldGaugeErrorCodes.INVALID_PAYLOAD,
        'reducer',
        'Novelty disposition is unsupported',
        { disposition: typeof payload.disposition === 'string' ? payload.disposition : null },
      );
    }
    const counts = { ...current.counts };
    counts[payload.disposition] = increment(Number(counts[payload.disposition]));
    return {
      counts,
      firstIncludedSequence: current.firstIncludedSequence ?? ledgerSequence,
      lastIncludedSequence: ledgerSequence,
      acceptedEvents: increment(current.acceptedEvents),
    };
  };
}

function finalizeNovelty(state: Readonly<JsonObject>): JsonObject {
  const current = state as NoveltyAccumulator;
  return {
    ...current.counts,
    acceptedEvents: current.acceptedEvents,
    firstIncludedSequence: current.firstIncludedSequence,
    lastIncludedSequence: current.lastIncludedSequence,
  };
}

function validateNoveltyOutput(output: Readonly<JsonObject>): boolean {
  const required = [
    ...NOVELTY_DISPOSITIONS,
    'acceptedEvents',
    'firstIncludedSequence',
    'lastIncludedSequence',
  ];
  return hasExactFields(output as JsonObject, required)
    && NOVELTY_DISPOSITIONS.every((key) => isSafeCounter(output[key]))
    && isSafeCounter(output.acceptedEvents)
    && (output.firstIncludedSequence === null || isSafeCounter(output.firstIncludedSequence))
    && (output.lastIncludedSequence === null || isSafeCounter(output.lastIncludedSequence));
}

function noveltyDefinition(
  windowStartSequence: number,
  windowEndSequence: number | null,
): GaugeDefinition {
  return {
    gaugeId: StandardGaugeIds.NOVELTY,
    gaugeVersion: GAUGE_VERSION,
    family: GaugeFamilies.NOVELTY,
    acceptedEvents: [{ eventType: NOVELTY_DISPOSITION_EVENT_TYPE, effectiveVersions: [1] }],
    reducerIdentity: 'novelty-disposition-sequence-window-fold-v1',
    outputSchemaVersion: '1',
    configuration: { windowStartSequence, windowEndSequence },
    numericPolicy: { representation: 'safe-integer-counts', windowAuthority: 'ledger-sequence' },
    missingValueSemantics: 'Absent dispositions contribute zero and no inferred novelty.',
    downstreamOwner: 'novelty and convergence consumers',
    unknownEventPolicy: 'ignore',
    dependencies: [],
    initialAccumulator: {
      counts: Object.fromEntries(NOVELTY_DISPOSITIONS.map((key) => [key, 0])),
      firstIncludedSequence: null,
      lastIncludedSequence: null,
      acceptedEvents: 0,
    },
    reduce: noveltyReducer(windowStartSequence, windowEndSequence),
    finalize: finalizeNovelty,
    validateAccumulator: validateNoveltyAccumulator,
    validateOutput: validateNoveltyOutput,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. COST GAUGE
// ───────────────────────────────────────────────────────────────────

interface CostAccumulator extends JsonObject {
  readonly totalsByScope: JsonObject;
  readonly acceptedEvents: number;
}

function validateCostAccumulator(state: Readonly<JsonObject>): boolean {
  if (!hasExactFields(state as JsonObject, ['acceptedEvents', 'totalsByScope'])) return false;
  if (!isSafeCounter(state.acceptedEvents) || !isObject(state.totalsByScope)) return false;
  return Object.values(state.totalsByScope).every((scope) =>
    isObject(scope)
    && Object.keys(scope).every((unit) => (COST_UNITS as readonly string[]).includes(unit))
    && Object.values(scope).every((value) =>
      typeof value === 'string'
      && SIGNED_DECIMAL_PATTERN.test(value)
      && value.replace('-', '').length <= MAX_DECIMAL_DIGITS));
}

function reduceCost(
  state: Readonly<JsonObject>,
  event: Readonly<EventReadResult>,
): CostAccumulator {
  const current = state as CostAccumulator;
  const payload = payloadOf(event, ['amount', 'direction', 'scope_id', 'unit']);
  const scopeId = requireIdentity(payload.scope_id, 'scope_id');
  if (
    typeof payload.unit !== 'string'
    || !(COST_UNITS as readonly string[]).includes(payload.unit)
    || (payload.direction !== 'debit' && payload.direction !== 'credit')
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Cost event unit or direction is unsupported',
      { unit: typeof payload.unit === 'string' ? payload.unit : null },
    );
  }
  const amount = requireUnsignedDecimal(payload.amount, 'amount');
  const scope = isObject(current.totalsByScope[scopeId])
    ? current.totalsByScope[scopeId] as JsonObject
    : {};
  const prior = typeof scope[payload.unit] === 'string' ? scope[payload.unit] as string : '0';
  return {
    totalsByScope: {
      ...current.totalsByScope,
      [scopeId]: {
        ...scope,
        [payload.unit]: addDecimal(prior, amount, payload.direction),
      },
    },
    acceptedEvents: increment(current.acceptedEvents),
  };
}

function finalizeCost(state: Readonly<JsonObject>): JsonObject {
  const current = state as CostAccumulator;
  return { totalsByScope: current.totalsByScope, acceptedEvents: current.acceptedEvents };
}

function validateCostOutput(output: Readonly<JsonObject>): boolean {
  return validateCostAccumulator(output);
}

function costDefinition(): GaugeDefinition {
  return {
    gaugeId: StandardGaugeIds.COST,
    gaugeVersion: GAUGE_VERSION,
    family: GaugeFamilies.COST,
    acceptedEvents: [{ eventType: COST_USAGE_EVENT_TYPE, effectiveVersions: [1] }],
    reducerIdentity: 'typed-decimal-cost-fold-v1',
    outputSchemaVersion: '1',
    configuration: { maximumDecimalDigits: MAX_DECIMAL_DIGITS },
    numericPolicy: {
      representation: 'canonical-decimal-string',
      units: [...COST_UNITS],
      direction: 'debit-adds-credit-subtracts',
    },
    missingValueSemantics: 'Absent scope and unit pairs contribute exact decimal zero.',
    downstreamOwner: 'hierarchical budget and cost consumers',
    unknownEventPolicy: 'ignore',
    dependencies: [],
    initialAccumulator: { totalsByScope: {}, acceptedEvents: 0 },
    reduce: reduceCost,
    finalize: finalizeCost,
    validateAccumulator: validateCostAccumulator,
    validateOutput: validateCostOutput,
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. HEALTH-INPUT GAUGE
// ───────────────────────────────────────────────────────────────────

interface HealthAccumulator extends JsonObject {
  readonly latestByQueue: JsonObject;
  readonly acceptedEvents: number;
}

function validateHealthEntry(value: unknown): boolean {
  return isObject(value)
    && hasExactFields(value, ['sequence', 'value'])
    && isSafeCounter(value.sequence)
    && typeof value.value === 'string'
    && DECIMAL_PATTERN.test(value.value)
    && value.value.length <= MAX_DECIMAL_DIGITS;
}

function validateHealthAccumulator(state: Readonly<JsonObject>): boolean {
  if (!hasExactFields(state as JsonObject, ['acceptedEvents', 'latestByQueue'])) return false;
  if (!isSafeCounter(state.acceptedEvents) || !isObject(state.latestByQueue)) return false;
  return Object.values(state.latestByQueue).every((queue) =>
    isObject(queue)
    && Object.keys(queue).every((metric) => (HEALTH_METRICS as readonly string[]).includes(metric))
    && Object.values(queue).every(validateHealthEntry));
}

function reduceHealth(
  state: Readonly<JsonObject>,
  event: Readonly<EventReadResult>,
  ledgerSequence: number,
): HealthAccumulator {
  const current = state as HealthAccumulator;
  const payload = payloadOf(event, ['metric', 'queue_id', 'value']);
  const queueId = requireIdentity(payload.queue_id, 'queue_id');
  if (
    typeof payload.metric !== 'string'
    || !(HEALTH_METRICS as readonly string[]).includes(payload.metric)
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_UNIT,
      'reducer',
      'Health input metric is unsupported',
      { metric: typeof payload.metric === 'string' ? payload.metric : null },
    );
  }
  const value = requireUnsignedDecimal(payload.value, 'value');
  const queue = isObject(current.latestByQueue[queueId])
    ? current.latestByQueue[queueId] as JsonObject
    : {};
  return {
    latestByQueue: {
      ...current.latestByQueue,
      [queueId]: {
        ...queue,
        [payload.metric]: { value, sequence: ledgerSequence },
      },
    },
    acceptedEvents: increment(current.acceptedEvents),
  };
}

function finalizeHealth(state: Readonly<JsonObject>): JsonObject {
  const current = state as HealthAccumulator;
  const totalsByMetric: JsonObject = {};
  for (const metric of HEALTH_METRICS) {
    const values: string[] = [];
    for (const queue of Object.values(current.latestByQueue)) {
      if (!isObject(queue) || !validateHealthEntry(queue[metric])) continue;
      values.push((queue[metric] as JsonObject).value as string);
    }
    totalsByMetric[metric] = sumUnsignedDecimals(values);
  }
  return {
    latestByQueue: current.latestByQueue,
    totalsByMetric,
    acceptedEvents: current.acceptedEvents,
  };
}

function validateHealthOutput(output: Readonly<JsonObject>): boolean {
  if (!hasExactFields(output as JsonObject, [
    'acceptedEvents',
    'latestByQueue',
    'totalsByMetric',
  ])) return false;
  if (!validateHealthAccumulator({
    acceptedEvents: output.acceptedEvents,
    latestByQueue: output.latestByQueue,
  })) return false;
  return isObject(output.totalsByMetric)
    && hasExactFields(output.totalsByMetric, HEALTH_METRICS)
    && Object.values(output.totalsByMetric).every((value) =>
      typeof value === 'string' && DECIMAL_PATTERN.test(value));
}

function healthDefinition(): GaugeDefinition {
  return {
    gaugeId: StandardGaugeIds.HEALTH,
    gaugeVersion: GAUGE_VERSION,
    family: GaugeFamilies.HEALTH,
    acceptedEvents: [{ eventType: HEALTH_INPUT_EVENT_TYPE, effectiveVersions: [1] }],
    reducerIdentity: 'latest-health-input-by-queue-fold-v1',
    outputSchemaVersion: '1',
    configuration: {},
    numericPolicy: {
      representation: 'canonical-unsigned-decimal-string',
      aggregation: 'latest-per-queue-then-exact-sum',
      metrics: [...HEALTH_METRICS],
    },
    missingValueSemantics: 'Absent queue metrics contribute exact decimal zero.',
    downstreamOwner: 'health policy consumers',
    unknownEventPolicy: 'ignore',
    dependencies: [],
    initialAccumulator: { latestByQueue: {}, acceptedEvents: 0 },
    reduce: reduceHealth,
    finalize: finalizeHealth,
    validateAccumulator: validateHealthAccumulator,
    validateOutput: validateHealthOutput,
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. STANDARD BUNDLE
// ───────────────────────────────────────────────────────────────────

/** Immutable configuration accepted by the standard gauge bundle. */
export interface StandardGaugeOptions {
  readonly noveltyWindowStartSequence?: number;
  readonly noveltyWindowEndSequence?: number | null;
}

/** Create the four standard gauge families with immutable sequence-window configuration. */
export function createStandardGaugeRegistry(options: StandardGaugeOptions = {}): GaugeRegistry {
  const windowStartSequence = options.noveltyWindowStartSequence ?? 1;
  const windowEndSequence = options.noveltyWindowEndSequence ?? null;
  if (
    !Number.isSafeInteger(windowStartSequence)
    || windowStartSequence < 1
    || (windowEndSequence !== null && (
      !Number.isSafeInteger(windowEndSequence)
      || windowEndSequence < windowStartSequence
    ))
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_INPUT,
      'registry',
      'Novelty window requires positive inclusive ledger-sequence bounds',
    );
  }
  return new GaugeRegistry([
    progressDefinition(),
    noveltyDefinition(windowStartSequence, windowEndSequence),
    costDefinition(),
    healthDefinition(),
  ]);
}

/** Function-free manifest of the default standard gauge bundle. */
export const STANDARD_GAUGE_MANIFEST: readonly GaugeRegistryEntry[] =
  createStandardGaugeRegistry().inspect();
