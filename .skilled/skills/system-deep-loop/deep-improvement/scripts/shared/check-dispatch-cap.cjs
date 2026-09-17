#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-dispatch-cap — cumulative dispatch-cost cap gate                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const { readJournal } = require('./improvement-journal.cjs');
const { parseArgs } = require('./parse-args.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Per-operation dispatch-cost accounting. Each entry names the config field
 * holding the cumulative cap (under `dispatchCaps` in
 * agent-improvement-config.json) and the journal eventType whose count IS the
 * cumulative usage for that operation:
 *  - candidateDispatch reuses `candidate_generated`, already emitted 1:1 after
 *    every successful @deep-improvement candidate dispatch.
 *  - benchmarkRun reuses `benchmark_completed`, already emitted 1:1 after
 *    every successful run-benchmark.cjs pass.
 *  - scoreExecution counts `score_execution_recorded`, a dedicated marker.
 *    score-candidate.cjs runs 3x per iteration (1 primary + 2 uncached
 *    replays for stability measurement) but only the primary emits the
 *    domain `candidate_scored` event, so a proxy event is the only way to
 *    count every individual execution instead of every iteration.
 */
const OPERATIONS = Object.freeze({
  candidateDispatch: Object.freeze({
    capField: 'maxCandidateDispatches',
    countEventType: 'candidate_generated',
    label: 'candidate dispatch',
  }),
  scoreExecution: Object.freeze({
    capField: 'maxScoreExecutions',
    countEventType: 'score_execution_recorded',
    label: 'score execution',
  }),
  benchmarkRun: Object.freeze({
    capField: 'maxBenchmarkRuns',
    countEventType: 'benchmark_completed',
    label: 'benchmark run',
  }),
});

// Defaults mirror the shipped improvement_config.json `dispatchCaps` block, so
// a config that predates this field (or carries a malformed override) still
// enforces a real ceiling instead of silently going unbounded.
const DEFAULT_CAPS = Object.freeze({
  candidateDispatch: 5,
  scoreExecution: 15,
  benchmarkRun: 5,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function toFiniteNonNegativeNumber(value) {
  const numeric = typeof value === 'string' ? Number(value) : value;
  return typeof numeric === 'number' && Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
}

/**
 * Resolve the effective cap for an operation: the configured
 * `dispatchCaps.<capField>` value when it is a finite non-negative number,
 * else the shipped schema default.
 *
 * @param {object} config - Parsed agent-improvement-config.json (or {})
 * @param {string} operation - One of candidateDispatch|scoreExecution|benchmarkRun
 * @returns {number}
 */
function resolveCap(config, operation) {
  const opDef = OPERATIONS[operation];
  const configured = toFiniteNonNegativeNumber(config && config.dispatchCaps && config.dispatchCaps[opDef.capField]);
  return configured !== null ? configured : DEFAULT_CAPS[operation];
}

/**
 * Count how many operations of the given type have already completed this
 * session, from the journal's own records (empty/missing journal counts as 0).
 *
 * @param {string} journalPath - Path to improvement-journal.jsonl
 * @param {string} operation - One of candidateDispatch|scoreExecution|benchmarkRun
 * @returns {number}
 */
function countOperationEvents(journalPath, operation) {
  const opDef = OPERATIONS[operation];
  const events = readJournal(journalPath);
  let count = 0;
  for (const event of events) {
    if (event && event.eventType === opDef.countEventType) {
      count += 1;
    }
  }
  return count;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether `requested` more operations of `operation` type are allowed
 * under the cumulative dispatch-cost cap, counted from journal records across
 * the whole session (never reset per-iteration).
 *
 * @param {object} input
 * @param {string} input.journalPath - Path to improvement-journal.jsonl
 * @param {object} input.config - Parsed agent-improvement-config.json (or {})
 * @param {string} input.operation - One of candidateDispatch|scoreExecution|benchmarkRun
 * @param {number} [input.requested] - How many more operations are about to run (default 1)
 * @returns {{
 *   allowed: boolean, operation: string, capField: string, countEventType: string,
 *   cap: number, currentCount: number, requested: number, projected: number, message: string
 * }}
 */
function checkDispatchCap({ journalPath, config, operation, requested = 1 }) {
  const opDef = OPERATIONS[operation];
  if (!opDef) {
    throw new Error(`Unknown dispatch-cap operation "${operation}". Valid operations: ${Object.keys(OPERATIONS).join(', ')}`);
  }

  const normalizedRequested = toFiniteNonNegativeNumber(requested) || 1;
  const cap = resolveCap(config, operation);
  const currentCount = countOperationEvents(journalPath, operation);
  const projected = currentCount + normalizedRequested;
  const allowed = projected <= cap;

  const message = allowed
    ? `OK: ${opDef.label} within cap — ${projected}/${cap} (dispatchCaps.${opDef.capField})`
    : `DISPATCH CAP EXCEEDED: ${opDef.label} cumulative cap reached — current=${currentCount} requested=${normalizedRequested} cap=${cap} (dispatchCaps.${opDef.capField}). `
      + `Halting the agent-improvement loop to enforce the cumulative dispatch-cost cap; raise dispatchCaps.${opDef.capField} in agent-improvement-config.json if this run legitimately needs more ${opDef.label}s.`;

  return {
    allowed,
    operation,
    capField: opDef.capField,
    countEventType: opDef.countEventType,
    cap,
    currentCount,
    requested: normalizedRequested,
    projected,
    message,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  OPERATIONS,
  DEFAULT_CAPS,
  resolveCap,
  countOperationEvents,
  checkDispatchCap,
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const journalPath = typeof args.journal === 'string' ? args.journal : undefined;
  const configPath = typeof args.config === 'string' ? args.config : undefined;
  const operation = typeof args.operation === 'string' ? args.operation : undefined;
  const requestedArg = args.requested;

  if (!journalPath || !configPath || !operation) {
    process.stderr.write(
      'Usage: node check-dispatch-cap.cjs --journal <path> --config <path> --operation <candidateDispatch|scoreExecution|benchmarkRun> [--requested <n>]\n'
    );
    process.exit(2);
  }

  if (!OPERATIONS[operation]) {
    process.stderr.write(`Unknown --operation "${operation}". Valid operations: ${Object.keys(OPERATIONS).join(', ')}\n`);
    process.exit(2);
  }

  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      process.stderr.write(`Failed to parse --config at ${configPath}: ${error.message}\n`);
      process.exit(2);
    }
  }

  const result = checkDispatchCap({
    journalPath,
    config,
    operation,
    requested: requestedArg !== undefined ? Number(requestedArg) : 1,
  });

  if (!result.allowed) {
    process.stderr.write(result.message + '\n');
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(result) + '\n');
}
