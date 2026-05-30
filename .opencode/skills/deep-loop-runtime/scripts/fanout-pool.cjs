// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out Worker Pool                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Concurrency-capped fan-out primitive for the opt-in multi-executor        ║
// ║ ("fan-out") layer above the single-executor deep-loop. Generalizes the    ║
// ║ council parallel dispatcher (lib/council/multi-seat-dispatch.cjs) by      ║
// ║ adding a concurrency cap so N executor lineages run with at most K in      ║
// ║ flight, plus a status-ledger writer mirroring the proven packet-122       ║
// ║ orchestration-status.log.                                                  ║
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
async function settleItem({ item, index, worker, now, onEvent }) {
  const label = labelFor(item, index);
  const startedAtIso = normalizeTimestamp(now());
  const startedAtMs = Date.now();

  if (typeof onEvent === 'function') {
    onEvent({ event: 'started', label, index, at: startedAtIso });
  }

  try {
    const output = await worker(item, { index });
    const completedAtIso = normalizeTimestamp(now());
    const durationMs = Math.max(0, Date.now() - startedAtMs);
    if (typeof onEvent === 'function') {
      onEvent({ event: 'completed', label, index, at: completedAtIso, duration_ms: durationMs });
    }
    return {
      label,
      status: 'fulfilled',
      started_at_iso: startedAtIso,
      completed_at_iso: completedAtIso,
      duration_ms: durationMs,
      output,
    };
  } catch (error) {
    const completedAtIso = normalizeTimestamp(now());
    const durationMs = Math.max(0, Date.now() - startedAtMs);
    const normalizedError = {
      name: error && error.name ? String(error.name) : 'Error',
      message: error && error.message ? String(error.message) : String(error),
    };
    if (typeof onEvent === 'function') {
      onEvent({ event: 'failed', label, index, at: completedAtIso, duration_ms: durationMs, error: normalizedError });
    }
    return {
      label,
      status: 'rejected',
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
  const results = new Array(items.length);

  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve(buildPoolSummary(results));
      return;
    }

    let nextIndex = 0;
    let active = 0;
    let resolved = false;

    const pump = () => {
      if (resolved) {
        return;
      }
      if (nextIndex >= items.length && active === 0) {
        resolved = true;
        resolve(buildPoolSummary(results));
        return;
      }
      while (active < concurrency && nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        active += 1;
        settleItem({ item: items[index], index, worker, now, onEvent })
          .then((result) => {
            results[index] = result;
          })
          .catch((error) => {
            // settleItem never throws, but stay defensive so the pump never wedges.
            results[index] = {
              label: labelFor(items[index], index),
              status: 'rejected',
              error: { name: 'PoolError', message: String(error) },
            };
          })
          .finally(() => {
            active -= 1;
            pump();
          });
      }
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
  return {
    results,
    summary: {
      total,
      succeeded,
      failed,
      all_failed: total > 0 && failed === total,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATUS LEDGER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append one JSONL event to the orchestration status ledger.
 *
 * Generalizes the packet-122 `orchestration-status.log`: one line per lineage
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
  appendStatusLedger,
  writeOrchestrationSummary,
};
