// ───────────────────────────────────────────────────────────────────
// MODULE: Content-Free Lifecycle Aggregation
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import {
  TelemetryReasonCodes,
} from '../contracts/evidence.js';
import { validateTelemetryEvent } from '../contracts/validate-evidence.js';
import { isRecord } from '../contracts/validator-utils.js';
import { RuntimeAdapterReasonCodes } from '../runtimes/types.js';

import type { RuntimeId } from '../contracts/common.js';
import type { TelemetryEvent } from '../contracts/evidence.js';
import type {
  PresentationTier,
  RuntimeTelemetryRecord,
} from '../runtimes/types.js';

/** Counters whose categories may overlap for one terminal event. */
export interface AggregationCounters {
  readonly accepted: number;
  readonly rejected: number;
  readonly timeout: number;
  readonly cancelled: number;
  readonly fallback: number;
  readonly degraded: number;
}

/** Per-event rates rounded to six decimal places. */
export interface AggregationRates extends AggregationCounters {}

/** One runtime-only aggregation bucket. */
export interface RuntimeAggregationBucket {
  readonly runtime: RuntimeId;
  readonly eventCount: number;
  readonly counters: AggregationCounters;
  readonly rates: AggregationRates;
}

/** One presentation-tier-only aggregation bucket. */
export interface PresentationTierAggregationBucket {
  readonly presentationTier: PresentationTier;
  readonly eventCount: number;
  readonly counters: AggregationCounters;
  readonly rates: AggregationRates;
}

/** One runtime and presentation-tier aggregation bucket. */
export interface RuntimeTierAggregationBucket
  extends RuntimeAggregationBucket, PresentationTierAggregationBucket {}

/** Deterministic aggregate containing no event identifiers or message content. */
export interface ObservabilityAggregate {
  readonly aggregationVersion: 'observability-aggregation/1.0.0';
  readonly eventCount: number;
  readonly ignoredEventCount: number;
  readonly counters: AggregationCounters;
  readonly rates: AggregationRates;
  readonly byRuntime: readonly RuntimeAggregationBucket[];
  readonly byPresentationTier: readonly PresentationTierAggregationBucket[];
  readonly byRuntimeAndPresentationTier: readonly RuntimeTierAggregationBucket[];
}

interface MutableCounters {
  accepted: number;
  rejected: number;
  timeout: number;
  cancelled: number;
  fallback: number;
  degraded: number;
}

interface ClassifiedEvent {
  readonly runtime: RuntimeId;
  readonly presentationTier: PresentationTier | null;
  readonly accepted: boolean;
  readonly rejected: boolean;
  readonly timeout: boolean;
  readonly cancelled: boolean;
  readonly fallback: boolean;
  readonly degraded: boolean;
}

const RUNTIME_TELEMETRY_KEYS = [
  'telemetryVersion',
  'eventName',
  'runtime',
  'pathId',
  'presentationTier',
  'status',
  'reasonCode',
] as const;
const PRESENTATION_TIERS = ['full-projection', 'safe-native'] as const;
const RUNTIME_TELEMETRY_STATUSES = [
  'degraded',
  'exact-original',
  'mapped',
  'projection',
] as const;
const SAFE_PATH_ID = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;

/** Aggregate only validated lifecycle evidence from the closed telemetry contracts. */
export function aggregateLifecycleEvents(
  inputs: readonly unknown[],
): ObservabilityAggregate {
  const total = emptyCounters();
  const runtimeBuckets = new Map<RuntimeId, MutableCounters & { eventCount: number }>();
  const tierBuckets = new Map<PresentationTier, MutableCounters & { eventCount: number }>();
  const runtimeTierBuckets = new Map<string, MutableCounters & { eventCount: number }>();
  let eventCount = 0;
  let ignoredEventCount = 0;

  for (const input of inputs) {
    const classified = classifyEvent(input);
    if (classified === null) {
      ignoredEventCount += 1;
      continue;
    }
    eventCount += 1;
    increment(total, classified);
    incrementBucket(runtimeBuckets, classified.runtime, classified);
    if (classified.presentationTier !== null) {
      incrementBucket(tierBuckets, classified.presentationTier, classified);
      incrementBucket(
        runtimeTierBuckets,
        `${classified.runtime}:${classified.presentationTier}`,
        classified,
      );
    }
  }

  return deepFreeze({
    aggregationVersion: 'observability-aggregation/1.0.0',
    eventCount,
    ignoredEventCount,
    counters: snapshotCounters(total),
    rates: rates(total, eventCount),
    byRuntime: runtimeRows(runtimeBuckets),
    byPresentationTier: tierRows(tierBuckets),
    byRuntimeAndPresentationTier: runtimeTierRows(runtimeTierBuckets),
  });
}

function classifyEvent(input: unknown): ClassifiedEvent | null {
  const telemetry = validateTelemetryEvent(input);
  if (telemetry.success) {
    return classifyCoreTelemetry(telemetry.value);
  }
  return isRuntimeTelemetry(input) ? classifyRuntimeTelemetry(input) : null;
}

function classifyCoreTelemetry(event: TelemetryEvent): ClassifiedEvent {
  return {
    runtime: event.runtime,
    presentationTier: null,
    accepted: event.outcome === 'accepted',
    rejected: event.outcome === 'rejected'
      || event.reasonCode === TelemetryReasonCodes.VALIDATION_REJECTED,
    timeout: event.reasonCode === TelemetryReasonCodes.TIMEOUT,
    cancelled: event.reasonCode === TelemetryReasonCodes.CANCELLED,
    fallback: event.outcome === 'exact-original',
    degraded: false,
  };
}

function classifyRuntimeTelemetry(event: RuntimeTelemetryRecord): ClassifiedEvent {
  return {
    runtime: event.runtime,
    presentationTier: event.presentationTier,
    accepted: event.status === 'mapped' || event.status === 'projection',
    rejected: event.reasonCode === RuntimeAdapterReasonCodes.PROJECTION_REJECTED
      || event.reasonCode === RuntimeAdapterReasonCodes.INVALID_EVENT,
    timeout: event.reasonCode === RuntimeAdapterReasonCodes.TIMEOUT,
    cancelled: event.reasonCode === RuntimeAdapterReasonCodes.CANCELLED,
    fallback: event.status === 'exact-original',
    degraded: event.status === 'degraded',
  };
}

function isRuntimeTelemetry(input: unknown): input is RuntimeTelemetryRecord {
  if (!isRecord(input)
    || Object.keys(input).some(
      (key) => !(RUNTIME_TELEMETRY_KEYS as readonly string[]).includes(key),
    )) {
    return false;
  }
  return input.telemetryVersion === 'runtime-telemetry/1.0.0'
    && input.eventName === 'runtime-adapter-terminal'
    && (Object.values(RuntimeIds) as readonly unknown[]).includes(input.runtime)
    && typeof input.pathId === 'string'
    && SAFE_PATH_ID.test(input.pathId)
    && (PRESENTATION_TIERS as readonly unknown[]).includes(input.presentationTier)
    && (RUNTIME_TELEMETRY_STATUSES as readonly unknown[]).includes(input.status)
    && (Object.values(RuntimeAdapterReasonCodes) as readonly unknown[])
      .includes(input.reasonCode);
}

function emptyCounters(): MutableCounters {
  return { accepted: 0, rejected: 0, timeout: 0, cancelled: 0, fallback: 0, degraded: 0 };
}

function increment(counters: MutableCounters, event: ClassifiedEvent): void {
  for (const key of Object.keys(counters) as (keyof MutableCounters)[]) {
    if (event[key]) {
      counters[key] += 1;
    }
  }
}

function incrementBucket<TKey>(
  buckets: Map<TKey, MutableCounters & { eventCount: number }>,
  key: TKey,
  event: ClassifiedEvent,
): void {
  const bucket = buckets.get(key) ?? { ...emptyCounters(), eventCount: 0 };
  bucket.eventCount += 1;
  increment(bucket, event);
  buckets.set(key, bucket);
}

function snapshotCounters(counters: MutableCounters): AggregationCounters {
  return { ...counters };
}

function rates(counters: MutableCounters, eventCount: number): AggregationRates {
  if (eventCount === 0) {
    return emptyCounters();
  }
  return Object.fromEntries(
    Object.entries(counters).map(([key, count]) => [
      key,
      Number((count / eventCount).toFixed(6)),
    ]),
  ) as unknown as AggregationRates;
}

function runtimeRows(
  buckets: ReadonlyMap<RuntimeId, MutableCounters & { eventCount: number }>,
): RuntimeAggregationBucket[] {
  return Object.values(RuntimeIds).flatMap((runtime) => {
    const bucket = buckets.get(runtime);
    return bucket === undefined ? [] : [{
      runtime,
      eventCount: bucket.eventCount,
      counters: snapshotCounters(bucket),
      rates: rates(bucket, bucket.eventCount),
    }];
  });
}

function tierRows(
  buckets: ReadonlyMap<PresentationTier, MutableCounters & { eventCount: number }>,
): PresentationTierAggregationBucket[] {
  return PRESENTATION_TIERS.flatMap((presentationTier) => {
    const bucket = buckets.get(presentationTier);
    return bucket === undefined ? [] : [{
      presentationTier,
      eventCount: bucket.eventCount,
      counters: snapshotCounters(bucket),
      rates: rates(bucket, bucket.eventCount),
    }];
  });
}

function runtimeTierRows(
  buckets: ReadonlyMap<string, MutableCounters & { eventCount: number }>,
): RuntimeTierAggregationBucket[] {
  return Object.values(RuntimeIds).flatMap((runtime) =>
    PRESENTATION_TIERS.flatMap((presentationTier) => {
      const bucket = buckets.get(`${runtime}:${presentationTier}`);
      return bucket === undefined ? [] : [{
        runtime,
        presentationTier,
        eventCount: bucket.eventCount,
        counters: snapshotCounters(bucket),
        rates: rates(bucket, bucket.eventCount),
      }];
    }));
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}
