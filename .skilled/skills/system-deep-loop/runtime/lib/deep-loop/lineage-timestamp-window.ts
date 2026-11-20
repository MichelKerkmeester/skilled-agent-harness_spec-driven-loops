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

function hasZoneDesignator(value: unknown): boolean {
  return typeof value === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/i.test(value.trim());
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

export type LineageCompletionFailure =
  | 'no_iteration_records'
  | 'no_terminal_event'
  | 'stale_terminal_event'
  | 'iteration_after_terminal'
  | 'stamped_after_completion'
  | 'missing_stop_reason'
  | 'unknown_stop_reason'
  | 'max_iterations_unproven';

export type LineageCompletionInput = {
  readonly terminalEvents: readonly string[];
  readonly windowStart: string | Date;
  readonly windowEnd: string | Date;
  // When set, the terminal row must carry one of these stop reasons. A loop that records no
  // separate stop-check row carries its stop on the terminal row, so this is its stop evidence.
  readonly stopReasons?: readonly string[];
  // The lineage's iteration cap, which a maxIterationsReached stop must have reached.
  readonly iterationCap?: number | null;
};

const MAX_ITERATIONS_STOP_REASON = 'maxIterationsReached';

// The integer iteration counts first and a numeric run is the fallback, as the state reader
// counts them, because a leaf may write its session id string in run on every iteration.
function distinctIterationCount(iterations: readonly Record<string, unknown>[]): number {
  const runs = new Set(iterations
    .map((record) => (Number.isInteger(record.iteration) ? Number(record.iteration) : Number(record.run)))
    .filter((run) => Number.isInteger(run)));
  return runs.size;
}

function stopReasonFailure(
  terminal: Record<string, unknown>,
  iterations: readonly Record<string, unknown>[],
  input: LineageCompletionInput,
): LineageCompletionVerdict | null {
  if (!input.stopReasons) return null;
  const stopReason = terminal.stopReason;
  if (typeof stopReason !== 'string' || stopReason === '') {
    return { complete: false, failure: 'missing_stop_reason', detail: `the terminal stop row ${String(terminal.event)} names no stopReason` };
  }
  if (!input.stopReasons.includes(stopReason)) {
    return {
      complete: false,
      failure: 'unknown_stop_reason',
      detail: `the terminal stop row's stopReason ${stopReason} is not one the workflow writes (${input.stopReasons.join(', ')})`,
    };
  }
  if (stopReason !== MAX_ITERATIONS_STOP_REASON) return null;
  const cap = input.iterationCap;
  if (typeof cap !== 'number' || !Number.isInteger(cap) || cap <= 0) {
    return {
      complete: false,
      failure: 'max_iterations_unproven',
      detail: `the lineage stopped on ${MAX_ITERATIONS_STOP_REASON} but its config holds no iteration cap to check it against`,
    };
  }
  const recorded = distinctIterationCount(iterations);
  if (recorded < cap) {
    return {
      complete: false,
      failure: 'max_iterations_unproven',
      detail: `the lineage stopped on ${MAX_ITERATIONS_STOP_REASON} after ${recorded} of its ${cap} iterations`,
    };
  }
  return null;
}

export type LineageCompletionVerdict =
  | { readonly complete: true }
  | { readonly complete: false; readonly failure: LineageCompletionFailure; readonly detail: string };

function describeRecord(record: Record<string, unknown>, index: number): string {
  const name = record.type === 'iteration' ? `iteration ${String(record.iteration)}` : `${String(record.event ?? record.type)} row`;
  return `${name} (line ${index + 1}, ${String(record.timestamp)})`;
}

/**
 * Decide whether a lineage's state log proves it finished the loop in this attempt.
 *
 * It needs at least one iteration row and a terminal stop row written in this attempt,
 * with every iteration row before that terminal row in the file. Iteration stamps are
 * written by the model, so order is judged by file position, never by comparing them
 * with the terminal row's stamp. Two stamp checks remain: the terminal row's own stamp,
 * which the host writes, must not predate this attempt's start, so a resume that recorded
 * nothing new fails; and no stamp carrying an explicit zone may land after the process
 * ended by more than the default tolerance. A stamp without a zone designator cannot be
 * placed on the host clock and is not judged. Rows from an earlier attempt sit before
 * the window and stay legal, so a resumed lineage passes once this attempt records its
 * own terminal row. When the caller names the stop reasons its loop writes, the terminal
 * row must carry one of them, and a maxIterationsReached stop must have recorded as many
 * distinct iterations as the lineage's cap.
 */
export function checkLineageCompletion(
  records: readonly unknown[],
  input: LineageCompletionInput,
): LineageCompletionVerdict {
  const windowStart = parseIsoBoundary(input.windowStart, 'windowStart');
  const windowEnd = parseIsoBoundary(input.windowEnd, 'windowEnd');
  const terminalEvents = new Set(input.terminalEvents);
  const rows = records.filter(isRecord);
  const iterations = rows.filter((record) => record.type === 'iteration');
  if (iterations.length === 0) {
    return { complete: false, failure: 'no_iteration_records', detail: 'the state log holds no iteration record' };
  }

  let terminalIndex = -1;
  rows.forEach((record, index) => {
    if (record.type === 'event' && typeof record.event === 'string' && terminalEvents.has(record.event)) {
      terminalIndex = index;
    }
  });
  if (terminalIndex === -1) {
    return {
      complete: false,
      failure: 'no_terminal_event',
      detail: `the state log holds no terminal stop row (${[...terminalEvents].join(' or ')})`,
    };
  }

  const terminal = rows[terminalIndex];
  const terminalMs = parseRecordTimestamp(terminal.timestamp);
  if (terminalMs === null || terminalMs < windowStart.ms) {
    return {
      complete: false,
      failure: 'stale_terminal_event',
      detail: `the last terminal stop row, ${describeRecord(terminal, terminalIndex)}, predates this attempt's start at ${windowStart.iso}`,
    };
  }

  const latestAllowedMs = windowEnd.ms + DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS;
  for (let index = 0; index < rows.length; index += 1) {
    const record = rows[index];
    const timestampMs = hasZoneDesignator(record.timestamp) ? parseRecordTimestamp(record.timestamp) : null;
    if (timestampMs !== null && timestampMs > latestAllowedMs) {
      return {
        complete: false,
        failure: 'stamped_after_completion',
        detail: `${describeRecord(record, index)} is stamped after the lineage process ended at ${windowEnd.iso}`,
      };
    }
    if (record.type !== 'iteration') continue;
    if (index > terminalIndex) {
      return {
        complete: false,
        failure: 'iteration_after_terminal',
        detail: `${describeRecord(record, index)} comes after the terminal stop row ${describeRecord(terminal, terminalIndex)}`,
      };
    }
  }
  return stopReasonFailure(terminal, iterations, input) ?? { complete: true };
}
