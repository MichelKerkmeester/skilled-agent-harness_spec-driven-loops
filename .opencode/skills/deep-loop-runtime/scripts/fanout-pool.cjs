// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out Worker Pool                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Concurrency-capped fan-out primitive for the opt-in multi-executor        ║
// ║ ("fan-out") layer above the single-executor deep-loop. Generalizes the    ║
// ║ council parallel dispatcher (lib/council/multi-seat-dispatch.cjs) by      ║
// ║ adding a concurrency cap so N executor lineages run with at most K in      ║
// ║ flight, plus a status-ledger writer following the proven                  ║
// ║ orchestration-status.log ledger pattern.                                   ║
// ║                                                                           ║
// ║ Design: pure pool primitive (worker is INJECTED) + ledger helpers, fully  ║
// ║ unit-tested. The real spawn worker and the CLI entry that wires it        ║
// ║ (arg parse, JSON-out, exit codes) live in fanout-run.cjs.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { classifyLineageFailure } = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeTimestamp(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  return new Date().toISOString();
}

function normalizeConcurrency(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.floor(n);
}

function labelFor(item, index) {
  if (isRecord(item) && typeof item.label === 'string' && item.label.trim() !== '') {
    return item.label;
  }
  return `item-${index}`;
}

function buildPoolGauges({ total, settled, pending, failed, oldestPendingLagMs }) {
  const gauges = {
    lag: Math.max(0, total - settled),
    pending: Math.max(0, pending),
    failed: Math.max(0, failed),
  };
  if (Number.isFinite(oldestPendingLagMs)) {
    gauges.oldest_pending_lag_ms = Math.max(0, Math.floor(oldestPendingLagMs));
  }
  return gauges;
}

function normalizeMaxRetries(value) {
  if (value === undefined || value === null) {
    return 0;
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return Math.floor(n);
}

function normalizeNonNegativeDuration(value) {
  if (value === undefined || value === null) {
    return 0;
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return Math.floor(n);
}

function normalizeRetryCountMap(value) {
  const counts = new Map();
  if (!isRecord(value)) {
    return counts;
  }
  for (const [label, count] of Object.entries(value)) {
    const n = Number(count);
    if (typeof label === 'string' && label && Number.isFinite(n) && n > 0) {
      counts.set(label, Math.floor(n));
    }
  }
  return counts;
}

function buildFailureClassRollup(results) {
  const rollup = {
    timeout: 0,
    exit: 0,
    salvage_miss: 0,
  };
  for (const result of results) {
    if (!result || result.status !== 'rejected') {
      continue;
    }
    const failureClass = result.error && typeof result.error.failure_class === 'string'
      ? result.error.failure_class
      : 'exit';
    if (Object.prototype.hasOwnProperty.call(rollup, failureClass)) {
      rollup[failureClass] += 1;
    }
  }
  return rollup;
}

function normalizeError(error) {
  const classification = classifyLineageFailure(error);
  return {
    name: error && error.name ? String(error.name) : 'Error',
    message: error && error.message ? String(error.message) : String(error),
    ...classification,
  };
}

function readLedgerRecords(ledgerPath) {
  if (!ledgerPath || !fs.existsSync(ledgerPath)) {
    return [];
  }

  let content;
  try {
    content = fs.readFileSync(ledgerPath, 'utf8');
  } catch {
    return [];
  }

  const records = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (isRecord(parsed)) {
        records.push(parsed);
      }
    } catch {
      // A malformed status row cannot safely create retry credit.
    }
  }
  return records;
}

function readRetryCountsFromLedger(ledgerPath) {
  const counts = {};
  for (const record of readLedgerRecords(ledgerPath)) {
    if (record.event !== 'retry_scheduled' || typeof record.label !== 'string') {
      continue;
    }
    counts[record.label] = (counts[record.label] || 0) + 1;
  }
  return counts;
}

function detectOrphanedLineages(records) {
  const open = new Map();
  for (const record of records) {
    if (!isRecord(record) || typeof record.label !== 'string' || !record.label) {
      continue;
    }
    if (record.event === 'started') {
      open.set(record.label, record);
    } else if (
      record.event === 'completed'
      || record.event === 'failed'
      || record.event === 'orphan_requeued'
    ) {
      open.delete(record.label);
    }
  }
  return Array.from(open.values()).map((record) => ({
    label: record.label,
    index: Number.isFinite(Number(record.index)) ? Number(record.index) : null,
    started_at_iso: typeof record.at === 'string' ? record.at : null,
  }));
}

function markOrphanedLineages(ledgerPath, options = {}) {
  const orphans = detectOrphanedLineages(readLedgerRecords(ledgerPath));
  if (!orphans.length) {
    return [];
  }
  const now = typeof options.now === 'function' ? options.now : () => new Date();
  for (const orphan of orphans) {
    appendStatusLedger(ledgerPath, {
      event: 'orphan_requeued',
      label: orphan.label,
      index: orphan.index,
      started_at_iso: orphan.started_at_iso,
      at: normalizeTimestamp(now()),
      status: 'requeued',
    });
  }
  return orphans;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a single pool item through the worker and capture its result or error.
 *
 * Never throws: a worker rejection is captured as a `rejected` result so one
 * failing lineage cannot sink the whole pool (mirrors council `settleSeat`).
 *
 * @param {Object} params - Settlement parameters.
 * @param {*} params.item - The work item (e.g. a lineage descriptor).
 * @param {number} params.index - Zero-based item index (preserves order).
 * @param {Function} params.worker - Async worker: (item, { index }) => output.
 * @param {Function} params.now - Callable returning a Date or ISO timestamp.
 * @param {Function} [params.onEvent] - Optional callback for ledger events.
 * @returns {Promise<Object>} Result with label, status, timing, output|error.
 */
async function settleItem({ item, index, worker, now, onEvent, attempt: rawAttempt, emitSettledEvent: shouldEmitSettledEvent }) {
  const attempt = Number.isFinite(Number(rawAttempt)) ? Number(rawAttempt) : 1;
  const emitSettledEvent = shouldEmitSettledEvent !== false;
  const label = labelFor(item, index);
  const startedAtIso = normalizeTimestamp(now());
  const startedAtMs = Date.now();

  if (typeof onEvent === 'function') {
    onEvent({ event: 'started', label, index, attempt, at: startedAtIso });
  }

  try {
    const output = await worker(item, { index });
    const completedAtIso = normalizeTimestamp(now());
    const durationMs = Math.max(0, Date.now() - startedAtMs);
    if (emitSettledEvent && typeof onEvent === 'function') {
      onEvent({ event: 'completed', label, index, attempt, at: completedAtIso, duration_ms: durationMs });
    }
    return {
      label,
      status: 'fulfilled',
      attempt,
      started_at_iso: startedAtIso,
      completed_at_iso: completedAtIso,
      duration_ms: durationMs,
      output,
    };
  } catch (error) {
    const completedAtIso = normalizeTimestamp(now());
    const durationMs = Math.max(0, Date.now() - startedAtMs);
    const normalizedError = normalizeError(error);
    if (emitSettledEvent && typeof onEvent === 'function') {
      onEvent({ event: 'failed', label, index, attempt, at: completedAtIso, duration_ms: durationMs, error: normalizedError });
    }
    return {
      label,
      status: 'rejected',
      attempt,
      started_at_iso: startedAtIso,
      completed_at_iso: completedAtIso,
      duration_ms: durationMs,
      error: normalizedError,
    };
  }
}

/**
 * Run items through a worker with at most `concurrency` in flight.
 *
 * This is the fan-out generalization of council `dispatchCouncilSeats`: same
 * never-throws per-item settlement and ordered results, plus a concurrency cap
 * so a large lineage set runs K-at-a-time (the proven `xargs -P K` shape).
 *
 * @param {Object} options - Pool configuration.
 * @param {Array} options.items - Work items (each ideally has a `label`).
 * @param {number} options.concurrency - Max items in flight (clamped to >= 1).
 * @param {Function} options.worker - Async worker: (item, { index }) => output.
 * @param {Function} [options.now] - Callable returning a Date/ISO timestamp.
 * @param {Function} [options.onEvent] - Optional ledger-event callback.
 * @returns {Promise<Object>} { results: [...ordered], summary: { total,
 *   succeeded, failed, all_failed } }.
 * @throws {TypeError} If items is not an array or worker is not a function.
 */
function runCappedPool(options) {
  if (!isRecord(options)) {
    throw new TypeError('runCappedPool options must be an object');
  }
  const { items, worker } = options;
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (typeof worker !== 'function') {
    throw new TypeError('worker must be a function');
  }

  const concurrency = normalizeConcurrency(options.concurrency);
  const now = typeof options.now === 'function' ? options.now : () => new Date();
  const onEvent = typeof options.onEvent === 'function' ? options.onEvent : undefined;
  const maxRetries = normalizeMaxRetries(options.maxRetries);
  const retryCounts = normalizeRetryCountMap(options.initialRetryCounts);
  const results = new Array(items.length);
  const queue = items.map((_item, index) => index);
  const queuedAtMs = new Map(queue.map((index) => [index, Date.now()]));
  const lagCeilingMs = normalizeNonNegativeDuration(options.lagCeilingMs ?? options.lag_ceiling_ms ?? options.lag_ceiling);
  let lagCeilingTimer = null;
  let lagCeilingExceeded = false;

  const oldestPendingLagMs = () => {
    if (lagCeilingMs <= 0 || queue.length === 0) return undefined;
    let oldestQueuedAt = Infinity;
    for (const index of queue) {
      oldestQueuedAt = Math.min(oldestQueuedAt, queuedAtMs.get(index) ?? Date.now());
    }
    return Number.isFinite(oldestQueuedAt) ? Date.now() - oldestQueuedAt : undefined;
  };

  const buildCurrentGauges = () => {
    const settled = results.filter(Boolean).length;
    const failed = results.filter((result) => result && result.status === 'rejected').length;
    return buildPoolGauges({
      total: items.length,
      settled,
      pending: queue.length,
      failed,
      oldestPendingLagMs: oldestPendingLagMs(),
    });
  };

  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve(buildPoolSummary(results));
      return;
    }

    let active = 0;
    let resolved = false;
    const clearLagCeilingTimer = () => {
      if (lagCeilingTimer) {
        clearTimeout(lagCeilingTimer);
        lagCeilingTimer = null;
      }
    };

    const emitLagCeilingWarning = () => {
      if (!onEvent || lagCeilingMs <= 0 || lagCeilingExceeded || queue.length === 0) return;
      const gauges = buildCurrentGauges();
      if ((gauges.oldest_pending_lag_ms ?? 0) < lagCeilingMs) return;
      lagCeilingExceeded = true;
      onEvent({
        event: 'lag_ceiling_exceeded',
        at: normalizeTimestamp(now()),
        severity: 'warning',
        lag_ceiling_ms: lagCeilingMs,
        oldest_pending_lag_ms: gauges.oldest_pending_lag_ms,
        gauges,
      });
    };

    const scheduleLagCeilingCheck = () => {
      clearLagCeilingTimer();
      if (!onEvent || lagCeilingMs <= 0 || lagCeilingExceeded || queue.length === 0) return;
      const lag = oldestPendingLagMs() ?? 0;
      const delayMs = Math.max(0, lagCeilingMs - lag);
      lagCeilingTimer = setTimeout(() => {
        lagCeilingTimer = null;
        emitLagCeilingWarning();
      }, delayMs);
      lagCeilingTimer.unref?.();
    };

    const emitEvent = onEvent
      ? (event) => {
          onEvent({
            ...event,
            gauges: buildCurrentGauges(),
          });
          emitLagCeilingWarning();
        }
      : undefined;

    const emitSettledResult = (result, isTerminal) => {
      if (!emitEvent) return;
      const baseEvent = {
        event: result.status === 'fulfilled' ? 'completed' : 'failed',
        label: result.label,
        index: result.index,
        attempt: result.attempt,
        at: result.completed_at_iso,
        duration_ms: result.duration_ms,
        terminal: isTerminal,
      };
      if (result.status === 'rejected') {
        emitEvent({ ...baseEvent, error: result.error });
      } else {
        emitEvent(baseEvent);
      }
    };

    const pump = () => {
      if (resolved) {
        return;
      }
      if (queue.length === 0 && active === 0) {
        resolved = true;
        clearLagCeilingTimer();
        resolve(buildPoolSummary(results));
        return;
      }
      while (active < concurrency && queue.length > 0) {
        const index = queue.shift();
        queuedAtMs.delete(index);
        const label = labelFor(items[index], index);
        const retryCount = retryCounts.get(label) || 0;
        const attempt = retryCount + 1;
        active += 1;
        settleItem({ item: items[index], index, worker, now, onEvent: emitEvent, attempt, emitSettledEvent: false })
          .then((result) => {
            result.index = index;
            if (result.status === 'fulfilled') {
              result.retry_attempts = retryCount;
              results[index] = result;
              emitSettledResult(result, true);
              return;
            }

            const canRetry = result.error.retryable === true && retryCount < maxRetries;
            if (canRetry) {
              const nextRetryCount = retryCount + 1;
              retryCounts.set(label, nextRetryCount);
              emitSettledResult(result, false);
              queuedAtMs.set(index, Date.now());
              queue.push(index);
              if (emitEvent) {
                emitEvent({
                  event: 'retry_scheduled',
                  label,
                  index,
                  at: normalizeTimestamp(now()),
                  retry_count: nextRetryCount,
                  next_attempt: nextRetryCount + 1,
                  max_retries: maxRetries,
                  failure_class: result.error.failure_class,
                  retry_verdict: result.error.retry_verdict,
                });
              }
              return;
            }

            result.retry_attempts = retryCount;
            result.retry_exhausted = result.error.retryable === true && retryCount >= maxRetries;
            results[index] = result;
            emitSettledResult(result, true);
          })
          .catch((error) => {
            // The item settler is meant to capture worker failures; this keeps
            // an unexpected bug in the settler from wedging the whole pool.
            results[index] = {
              label: labelFor(items[index], index),
              status: 'rejected',
              index,
              error: normalizeError({ name: 'PoolError', message: String(error) }),
            };
            emitSettledResult(results[index], true);
          })
          .finally(() => {
            active -= 1;
            scheduleLagCeilingCheck();
            pump();
          });
      }
      scheduleLagCeilingCheck();
    };

    pump();
  });
}

/**
 * Build the ordered-results + summary envelope for a completed pool run.
 *
 * @param {Array<Object>} results - Per-item settlement results (ordered).
 * @returns {Object} { results, summary: { total, succeeded, failed, all_failed } }.
 */
function buildPoolSummary(results) {
  const total = results.length;
  const succeeded = results.filter((result) => result && result.status === 'fulfilled').length;
  const failed = total - succeeded;
  const gauges = buildPoolGauges({ total, settled: total, pending: 0, failed });
  const failureClasses = buildFailureClassRollup(results);
  return {
    results,
    summary: {
      total,
      succeeded,
      failed,
      all_failed: total > 0 && failed === total,
      gauges,
      failure_classes: failureClasses,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATUS LEDGER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append one JSONL event to the orchestration status ledger.
 *
 * Follows the `orchestration-status.log` ledger pattern: one line per lineage
 * lifecycle event (started / completed / failed / salvaged / converged).
 *
 * @param {string} ledgerPath - Path to the JSONL ledger file.
 * @param {Object} entry - A serializable event object.
 */
function appendStatusLedger(ledgerPath, entry) {
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  fs.appendFileSync(ledgerPath, `${JSON.stringify(entry)}\n`);
}

/**
 * Write the orchestration summary JSON for a completed fan-out run.
 *
 * @param {string} summaryPath - Path to the summary JSON file.
 * @param {Object} summary - Summary payload (e.g. the pool summary plus
 *   salvage counts and per-lineage rollups).
 */
function writeOrchestrationSummary(summaryPath, summary) {
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  runCappedPool,
  settleItem,
  buildPoolSummary,
  buildPoolGauges,
  classifyLineageFailure,
  detectOrphanedLineages,
  markOrphanedLineages,
  readRetryCountsFromLedger,
  appendStatusLedger,
  writeOrchestrationSummary,
};
