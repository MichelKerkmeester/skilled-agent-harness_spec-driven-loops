// ───────────────────────────────────────────────────────────────────
// MODULE: Telemetry Export Controls
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import { isRecord } from '../contracts/validator-utils.js';
import {
  REDACTION_CANARIES,
  scanForRedactionCanaries,
} from './redaction.js';

import type {
  AggregationCounters,
  AggregationRates,
  ObservabilityAggregate,
  PresentationTierAggregationBucket,
  RuntimeAggregationBucket,
  RuntimeTierAggregationBucket,
} from './aggregation.js';
import type { RuntimeId } from '../contracts/common.js';
import type { PresentationTier } from '../runtimes/types.js';

/** Explicit opt-in required before aggregate telemetry can leave the process. */
export interface TelemetryExportOptions {
  readonly enabled?: boolean;
}

/** Disabled export result with an empty payload. */
export interface DisabledTelemetryExport {
  readonly status: 'disabled';
  readonly exportVersion: 'telemetry-export/1.0.0';
  readonly recordCount: 0;
  readonly records: readonly [];
}

/** Enabled export containing only allowlisted aggregate fields. */
export interface EnabledTelemetryExport {
  readonly status: 'exported';
  readonly exportVersion: 'telemetry-export/1.0.0';
  readonly recordCount: number;
  readonly records: readonly ObservabilityAggregate[];
}

/** Export result returned by the default-off control. */
export type TelemetryExportResult = DisabledTelemetryExport | EnabledTelemetryExport;

/** Content-free export inspection finding. */
export interface TelemetryExportFinding {
  readonly path: string;
  readonly code: 'forbidden-field' | 'redaction-canary';
  readonly canaryId?: string;
}

/** Result of scanning one export for content-shaped fields and canaries. */
export interface TelemetryExportInspection {
  readonly safe: boolean;
  readonly findings: readonly TelemetryExportFinding[];
}

const COUNTER_KEYS = [
  'accepted',
  'rejected',
  'timeout',
  'cancelled',
  'fallback',
  'degraded',
] as const;
const PRESENTATION_TIERS = ['full-projection', 'safe-native'] as const;
const FORBIDDEN_CONTENT_FIELDS = new Set([
  'bytesbase64',
  'candidate',
  'candidatetext',
  'content',
  'messagecontent',
  'projectiontext',
  'prompt',
  'protectedspan',
  'protectedspans',
  'rawprompt',
  'requestbody',
  'responsebody',
  'sourcetext',
  'systeminstruction',
  'transcript',
]);

/** Export aggregates only after explicit opt-in and field-by-field filtering. */
export function createTelemetryExport(
  records: readonly unknown[],
  options: TelemetryExportOptions = {},
): TelemetryExportResult {
  if (options.enabled !== true) {
    return deepFreeze({
      status: 'disabled',
      exportVersion: 'telemetry-export/1.0.0',
      recordCount: 0,
      records: [],
    });
  }
  const filtered = records.flatMap((record) => {
    const aggregate = filterAggregate(record);
    return aggregate === null ? [] : [aggregate];
  });
  return deepFreeze({
    status: 'exported',
    exportVersion: 'telemetry-export/1.0.0',
    recordCount: filtered.length,
    records: filtered,
  });
}

/** Inspect any proposed export without reflecting leaked values in findings. */
export function inspectTelemetryExport(input: unknown): TelemetryExportInspection {
  const findings: TelemetryExportFinding[] = scanForRedactionCanaries(input)
    .map((finding) => ({
      path: finding.path,
      code: finding.code,
      canaryId: finding.canaryId,
    }));
  findForbiddenFields(input, '$', findings, new WeakSet<object>());
  return deepFreeze({ safe: findings.length === 0, findings });
}

function filterAggregate(input: unknown): ObservabilityAggregate | null {
  if (!isRecord(input)
    || input.aggregationVersion !== 'observability-aggregation/1.0.0') {
    return null;
  }
  const eventCount = nonNegativeInteger(input.eventCount);
  const ignoredEventCount = nonNegativeInteger(input.ignoredEventCount);
  const counters = filterCounters(input.counters, false);
  const rates = filterCounters(input.rates, true);
  if (eventCount === null || ignoredEventCount === null || counters === null || rates === null) {
    return null;
  }
  return {
    aggregationVersion: 'observability-aggregation/1.0.0',
    eventCount,
    ignoredEventCount,
    counters,
    rates,
    byRuntime: filterRuntimeBuckets(input.byRuntime),
    byPresentationTier: filterTierBuckets(input.byPresentationTier),
    byRuntimeAndPresentationTier: filterRuntimeTierBuckets(
      input.byRuntimeAndPresentationTier,
    ),
  };
}

function filterCounters(input: unknown, isRate: false): AggregationCounters | null;
function filterCounters(input: unknown, isRate: true): AggregationRates | null;
function filterCounters(
  input: unknown,
  isRate: boolean,
): AggregationCounters | AggregationRates | null {
  if (!isRecord(input)) {
    return null;
  }
  const values = COUNTER_KEYS.map((key) => finiteNumber(input[key], isRate ? 1 : undefined));
  if (values.some((value) => value === null)) {
    return null;
  }
  return Object.fromEntries(
    COUNTER_KEYS.map((key, index) => [key, values[index]]),
  ) as unknown as AggregationCounters;
}

function filterRuntimeBuckets(input: unknown): RuntimeAggregationBucket[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.flatMap((value) => {
    if (!isRecord(value)
      || !isRuntimeId(value.runtime)) {
      return [];
    }
    const common = filterBucketCommon(value);
    return common === null ? [] : [{ runtime: value.runtime, ...common }];
  });
}

function filterTierBuckets(input: unknown): PresentationTierAggregationBucket[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.flatMap((value) => {
    if (!isRecord(value)
      || !isPresentationTier(value.presentationTier)) {
      return [];
    }
    const common = filterBucketCommon(value);
    return common === null ? [] : [{ presentationTier: value.presentationTier, ...common }];
  });
}

function filterRuntimeTierBuckets(input: unknown): RuntimeTierAggregationBucket[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.flatMap((value) => {
    if (!isRecord(value)
      || !isRuntimeId(value.runtime)
      || !isPresentationTier(value.presentationTier)) {
      return [];
    }
    const common = filterBucketCommon(value);
    return common === null ? [] : [{
      runtime: value.runtime,
      presentationTier: value.presentationTier,
      ...common,
    }];
  });
}

function filterBucketCommon(input: Record<string, unknown>): {
  readonly eventCount: number;
  readonly counters: AggregationCounters;
  readonly rates: AggregationRates;
} | null {
  const eventCount = nonNegativeInteger(input.eventCount);
  const counters = filterCounters(input.counters, false);
  const rates = filterCounters(input.rates, true);
  return eventCount === null || counters === null || rates === null
    ? null
    : { eventCount, counters, rates };
}

function findForbiddenFields(
  input: unknown,
  path: string,
  findings: TelemetryExportFinding[],
  visited: WeakSet<object>,
): void {
  if (typeof input !== 'object' || input === null || visited.has(input)) {
    return;
  }
  visited.add(input);
  if (Array.isArray(input)) {
    input.forEach((entry, index) =>
      findForbiddenFields(entry, `${path}[${index}]`, findings, visited));
    return;
  }
  for (const [key, value] of Object.entries(input)) {
    const childPath = appendInspectionPath(path, key);
    if (FORBIDDEN_CONTENT_FIELDS.has(key.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
      findings.push({ path: childPath, code: 'forbidden-field' });
    }
    findForbiddenFields(value, childPath, findings, visited);
  }
}

function appendInspectionPath(path: string, key: string): string {
  const isSafe = /^[A-Za-z_$][A-Za-z0-9_$-]{0,63}$/.test(key)
    && !REDACTION_CANARIES.some((canary) => key.includes(canary.value));
  return isSafe ? `${path}.${key}` : `${path}.<redacted-key>`;
}

function nonNegativeInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

function isRuntimeId(value: unknown): value is RuntimeId {
  return (Object.values(RuntimeIds) as readonly unknown[]).includes(value);
}

function isPresentationTier(value: unknown): value is PresentationTier {
  return (PRESENTATION_TIERS as readonly unknown[]).includes(value);
}

function finiteNumber(value: unknown, maximum?: number): number | null {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && (maximum === undefined || value <= maximum)
    ? value
    : null;
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
