// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Timestamp Window Guard
// ───────────────────────────────────────────────────────────────────

export type TimestampAnomalyReason = 'before_window' | 'after_window' | 'unparseable';

export type TimestampWindowInput = {
  readonly windowStart: string | Date;
  readonly windowEnd: string | Date;
  readonly toleranceMs?: number;
  readonly sampleLimit?: number;
};

export type TimestampOffenderSample = {
  readonly index: number;
  readonly reason: TimestampAnomalyReason;
  readonly timestamp?: unknown;
  readonly deltaMs?: number;
};

export type TimestampWindowCheckResult = {
  readonly anomalous: number;
  readonly untimestamped: number;
  readonly unparseable: number;
  readonly total: number;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly toleranceMs: number;
  readonly sample: TimestampOffenderSample[];
};

export const DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS = 2 * 60 * 1000;
const DEFAULT_TIMESTAMP_OFFENDER_SAMPLE_LIMIT = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeToleranceMs(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS;
  return Math.max(0, Math.floor(Number(value)));
}

function normalizeSampleLimit(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_TIMESTAMP_OFFENDER_SAMPLE_LIMIT;
  return Math.max(0, Math.floor(Number(value)));
}

function parseIsoBoundary(value: string | Date, field: string): { iso: string; ms: number } {
  const ms = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(ms)) {
    throw new TypeError(`${field} must be a parseable ISO-8601 timestamp`);
  }
  return { iso: new Date(ms).toISOString(), ms };
}

function parseRecordTimestamp(value: unknown): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function addSample(
  sample: TimestampOffenderSample[],
  limit: number,
  offender: TimestampOffenderSample,
): void {
  if (sample.length < limit) {
    sample.push(offender);
  }
}

/**
 * Classify lineage JSONL timestamps against an externally supplied wall-clock window.
 *
 * A small symmetric tolerance absorbs clock skew and delayed writes near slot edges;
 * the supplied bounds remain inclusive after that tolerance is applied.
 */
export function checkLineageTimestampWindow(
  records: readonly unknown[],
  input: TimestampWindowInput,
): TimestampWindowCheckResult {
  const toleranceMs = normalizeToleranceMs(input.toleranceMs);
  const sampleLimit = normalizeSampleLimit(input.sampleLimit);
  const windowStart = parseIsoBoundary(input.windowStart, 'windowStart');
  const windowEnd = parseIsoBoundary(input.windowEnd, 'windowEnd');
  const lowerBoundMs = windowStart.ms - toleranceMs;
  const upperBoundMs = windowEnd.ms + toleranceMs;
  const sample: TimestampOffenderSample[] = [];
  let anomalous = 0;
  let untimestamped = 0;
  let unparseable = 0;

  records.forEach((record, index) => {
    if (!isRecord(record) || !Object.prototype.hasOwnProperty.call(record, 'timestamp')) {
      untimestamped += 1;
      return;
    }

    const timestamp = record.timestamp;
    const timestampMs = parseRecordTimestamp(timestamp);
    if (timestampMs === null) {
      anomalous += 1;
      unparseable += 1;
      addSample(sample, sampleLimit, { index, reason: 'unparseable', timestamp });
      return;
    }

    if (timestampMs < lowerBoundMs) {
      anomalous += 1;
      addSample(sample, sampleLimit, {
        index,
        reason: 'before_window',
        timestamp,
        deltaMs: lowerBoundMs - timestampMs,
      });
      return;
    }

    if (timestampMs > upperBoundMs) {
      anomalous += 1;
      addSample(sample, sampleLimit, {
        index,
        reason: 'after_window',
        timestamp,
        deltaMs: timestampMs - upperBoundMs,
      });
    }
  });

  return {
    anomalous,
    untimestamped,
    unparseable,
    total: records.length,
    windowStart: windowStart.iso,
    windowEnd: windowEnd.iso,
    toleranceMs,
    sample,
  };
}
