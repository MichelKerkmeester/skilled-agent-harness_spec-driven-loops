#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Single-Loop Telemetry Heartbeat
// ───────────────────────────────────────────────────────────────────
//
// Writes the status-ledger row a single-loop telemetry step owns and mirrors
// it to the packet's observability stream. Both execution modes run this same
// body, so the producer name carries the mode that emitted the row.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const { existsSync, readFileSync } = require('node:fs');

// The telemetry bodies ran as ESM through tsx inside the workflow; this module
// is CommonJS, so the loader registers before the first TypeScript require.
require('tsx/cjs');

const { appendJsonlIfChangedAtomic } = require('../lib/deep-loop/atomic-state.ts');
const { appendObservabilityEvent } = require('../lib/deep-loop/observability-events.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const EXIT_USAGE = 64;
const LOOP_TYPE = 'research';
const LABEL = 'single';
const STREAM = 'single-loop-telemetry';
const EXECUTION_MODES = Object.freeze(['auto', 'confirm']);

const USAGE = [
  'Usage: loop-heartbeat.cjs --phase started|progress|terminal',
  '--status-ledger <path> --packet-dir <dir> --timestamp <iso> --session-id <id>',
  '--execution-mode auto|confirm',
  '[--config <path>] [--state-log <path>] [--generation <n>] [--run <n>] [--reason <stopReason>]',
].join(' ');

const FLAG_KEYS = Object.freeze({
  '--phase': 'phase',
  '--config': 'config',
  '--state-log': 'stateLog',
  '--status-ledger': 'statusLedger',
  '--packet-dir': 'packetDir',
  '--timestamp': 'timestamp',
  '--session-id': 'sessionId',
  '--generation': 'generation',
  '--run': 'run',
  '--reason': 'reason',
  '--execution-mode': 'executionMode',
});

const FLAGS_BY_KEY = Object.freeze(
  Object.fromEntries(Object.entries(FLAG_KEYS).map(([flag, key]) => [key, flag])),
);

// Every flag a phase accepts is also required for it. A flag a phase does not
// read is rejected, so the workflow stays honest about the values each
// heartbeat consumes.
const PHASE_FLAGS = Object.freeze({
  started: Object.freeze([
    'phase',
    'config',
    'statusLedger',
    'packetDir',
    'timestamp',
    'sessionId',
    'executionMode',
  ]),
  progress: Object.freeze([
    'phase',
    'stateLog',
    'statusLedger',
    'packetDir',
    'timestamp',
    'sessionId',
    'generation',
    'run',
    'executionMode',
  ]),
  terminal: Object.freeze([
    'phase',
    'config',
    'stateLog',
    'statusLedger',
    'packetDir',
    'timestamp',
    'sessionId',
    'generation',
    'reason',
    'executionMode',
  ]),
});

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Parses `--flag value` pairs. The token after a flag is always its value,
 * including an empty string, so a caller learns about a missing value from the
 * requirement check rather than from a silent default.
 *
 * @param {string[]} argv - Arguments after the script path.
 * @returns {Record<string, string>} Values keyed by camelCase flag name.
 */
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!Object.prototype.hasOwnProperty.call(FLAG_KEYS, token)) {
      throw new Error(token.startsWith('--') ? `unknown flag: ${token}` : `unknown argument: ${token}`);
    }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`missing value for flag: ${token}`);
    const key = FLAG_KEYS[token];
    if (Object.prototype.hasOwnProperty.call(args, key)) throw new Error(`repeated flag: ${token}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

/**
 * Rejects a phase-flag combination that cannot produce a faithful row: an
 * unknown phase, a flag the phase does not read, a missing flag, or an
 * execution mode outside the two the workflows emit.
 *
 * @param {Record<string, string>} args - Parsed arguments.
 */
function assertPhaseArgs(args) {
  if (args.phase === undefined) throw new Error('missing required flag: --phase');

  const allowed = Object.prototype.hasOwnProperty.call(PHASE_FLAGS, args.phase)
    ? PHASE_FLAGS[args.phase]
    : undefined;
  if (allowed === undefined) throw new Error(`unknown phase: ${args.phase}`);

  for (const key of Object.keys(args)) {
    if (!allowed.includes(key)) {
      throw new Error(`flag not valid for phase ${args.phase}: ${FLAGS_BY_KEY[key]}`);
    }
  }

  for (const key of allowed) {
    if (key === 'phase') continue;
    // A flag is missing only when it is absent. An empty value is one the caller
    // passed and the row must carry: an empty session id, a reason of '', and a
    // generation or run of Number('') all came from a workflow that meant them.
    if (args[key] === undefined) {
      throw new Error(`missing required flag: ${FLAGS_BY_KEY[key]}`);
    }
  }

  if (!EXECUTION_MODES.includes(args.executionMode)) {
    throw new Error(`unknown execution mode: ${args.executionMode}`);
  }
}

/**
 * Reads JSONL records. A missing log means the loop has written nothing yet.
 * A malformed line throws: a half-written ledger is not a row set to average
 * over.
 *
 * @param {string} stateLogPath - JSONL path.
 * @returns {Array<Record<string, unknown>>} Parsed records in file order.
 */
function readRecords(stateLogPath) {
  if (!existsSync(stateLogPath)) return [];
  return readFileSync(stateLogPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

/**
 * Milliseconds between a start mark and the heartbeat timestamp. An
 * unparseable mark yields zero so a telemetry row never carries NaN.
 *
 * @param {unknown} value - Start timestamp from a state record.
 * @param {string} timestamp - Heartbeat timestamp.
 * @returns {number} Non-negative elapsed milliseconds.
 */
function elapsedSince(value, timestamp) {
  const startedAtMs = Date.parse(String(value ?? ''));
  const nowMs = Date.parse(timestamp);
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(nowMs)) return 0;
  return Math.max(0, nowMs - startedAtMs);
}

/**
 * Maps a stop reason to the lifecycle event a terminal heartbeat reports.
 *
 * @param {string} stopReason - Reason the loop stopped.
 * @returns {'stopped'|'failed'|'completed'} Terminal event name.
 */
function terminalEvent(stopReason) {
  if (stopReason === 'manualStop' || stopReason === 'userPaused') return 'stopped';
  if (stopReason === 'error') return 'failed';
  return 'completed';
}

/**
 * Picks the point a run started from: an explicit creation mark wins over a
 * generic timestamp, and the heartbeat timestamp is the last resort.
 *
 * @param {Array<Record<string, unknown>>} records - State-log records.
 * @param {string} timestamp - Heartbeat timestamp.
 * @returns {unknown} Start mark.
 */
function startedAtFrom(records, timestamp) {
  return records.find((record) => typeof record.createdAt === 'string')?.createdAt
    ?? records.find((record) => typeof record.timestamp === 'string')?.timestamp
    ?? timestamp;
}

/**
 * @param {Array<Record<string, unknown>>} records - State-log records.
 * @returns {{ iterations: Array<Record<string, unknown>>, latest: Record<string, unknown> }} Iteration view.
 */
function iterationView(records) {
  const iterations = records.filter((record) => record.type === 'iteration');
  return { iterations, latest: iterations.at(-1) ?? {} };
}

/**
 * @param {Record<string, unknown>} latest - Last iteration record.
 * @returns {number} Last recorded new-information ratio, or zero.
 */
function scoreFrom(latest) {
  return Number.isFinite(Number(latest.newInfoRatio)) ? Number(latest.newInfoRatio) : 0;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Builds the started row. The session and generation come from the lineage
 * config when it has them, because the config is the durable owner of both.
 *
 * @param {Record<string, string>} args - Validated arguments.
 * @returns {{ row: Record<string, unknown>, diffData: Record<string, unknown>, subject: Record<string, unknown>, status: string }} Heartbeat parts.
 */
function buildStarted(args) {
  const config = JSON.parse(readFileSync(args.config, 'utf8'));
  const sessionId = String(config.lineage?.sessionId ?? args.sessionId);
  const generation = Number(config.lineage?.generation ?? 1);

  const row = {
    event: 'started',
    label: LABEL,
    at: args.timestamp,
    duration_ms: 0,
    loop_type: LOOP_TYPE,
    sessionId,
    generation,
    gauges: { iterations: 0, elapsed_ms: 0, score: 0 },
  };

  return {
    row,
    diffData: {
      event: row.event,
      label: row.label,
      sessionId,
      generation,
      gauges: { iterations: 0, score: 0 },
    },
    subject: { label: row.label, sessionId, generation },
    status: 'running',
  };
}

/**
 * Builds the progress row. The run the state log records wins over the caller's
 * iteration, because a resumed loop can be ahead of the workflow variable.
 *
 * @param {Record<string, string>} args - Validated arguments.
 * @returns {{ row: Record<string, unknown>, diffData: Record<string, unknown>, subject: Record<string, unknown>, status: string }} Heartbeat parts.
 */
function buildProgress(args) {
  const records = readRecords(args.stateLog);
  const { iterations, latest } = iterationView(records);
  const elapsedMs = elapsedSince(startedAtFrom(records, args.timestamp), args.timestamp);
  const score = scoreFrom(latest);
  const run = Number.isFinite(Number(latest.run)) ? Number(latest.run) : Number(args.run);
  const status = typeof latest.status === 'string' ? latest.status : 'unknown';

  const row = {
    event: 'progress',
    label: LABEL,
    at: args.timestamp,
    duration_ms: elapsedMs,
    loop_type: LOOP_TYPE,
    sessionId: args.sessionId,
    generation: Number(args.generation),
    run,
    status,
    gauges: { iterations: iterations.length, elapsed_ms: elapsedMs, score },
  };

  return {
    row,
    diffData: {
      event: row.event,
      label: row.label,
      sessionId: row.sessionId,
      generation: row.generation,
      run,
      status,
      gauges: { iterations: iterations.length, score },
    },
    subject: { label: row.label, sessionId: row.sessionId, generation: row.generation, run },
    status,
  };
}

/**
 * Builds the terminal row. The terminal flag lets a reader pick the closed
 * heartbeat out of the ledger without interpreting the event name.
 *
 * @param {Record<string, string>} args - Validated arguments.
 * @returns {{ row: Record<string, unknown>, diffData: Record<string, unknown>, subject: Record<string, unknown>, status: string }} Heartbeat parts.
 */
function buildTerminal(args) {
  const config = JSON.parse(readFileSync(args.config, 'utf8'));
  const records = readRecords(args.stateLog);
  const { iterations, latest } = iterationView(records);
  const elapsedMs = elapsedSince(startedAtFrom(records, args.timestamp), args.timestamp);
  const score = scoreFrom(latest);
  const sessionId = String(config.lineage?.sessionId ?? args.sessionId);
  const generation = Number(config.lineage?.generation ?? args.generation);
  const reason = args.reason;
  const event = terminalEvent(reason);

  const row = {
    event,
    label: LABEL,
    terminal: true,
    reason,
    at: args.timestamp,
    duration_ms: elapsedMs,
    loop_type: LOOP_TYPE,
    sessionId,
    generation,
    gauges: { iterations: iterations.length, elapsed_ms: elapsedMs, score },
  };

  return {
    row,
    diffData: {
      event,
      label: row.label,
      reason,
      sessionId,
      generation,
      gauges: { iterations: iterations.length, score },
    },
    subject: { label: row.label, sessionId, generation, reason },
    status: event,
  };
}

/**
 * @param {Record<string, string>} args - Validated arguments.
 * @returns {{ row: Record<string, unknown>, diffData: Record<string, unknown>, subject: Record<string, unknown>, status: string }} Heartbeat parts.
 */
function buildHeartbeat(args) {
  switch (args.phase) {
    case 'started': return buildStarted(args);
    case 'progress': return buildProgress(args);
    case 'terminal': return buildTerminal(args);
    default: throw new Error(`unknown phase: ${args.phase}`);
  }
}

/**
 * Appends the heartbeat row when its diff payload changed, then mirrors it to
 * the observability stream. The mirror is best effort: the status ledger is the
 * record of truth and a mirror failure must not fail the step that wrote it.
 *
 * @param {Record<string, string>} args - Validated arguments.
 * @returns {boolean} True when the status ledger gained a row.
 */
function emitHeartbeat(args) {
  const heartbeat = buildHeartbeat(args);

  const appended = appendJsonlIfChangedAtomic(args.statusLedger, heartbeat.row, {
    diffData: heartbeat.diffData,
    diffField: 'state_hash',
  });
  if (!appended) return false;

  try {
    appendObservabilityEvent(`${args.packetDir}/observability-events.jsonl`, heartbeat.row, {
      producer: `deep-research-${args.executionMode}`,
      stream: STREAM,
      subject: heartbeat.subject,
      event: heartbeat.row.event,
      status: heartbeat.status,
    });
  } catch {
    // Observability is a mirror, never the ledger of record.
  }

  return true;
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv - Arguments after the script path.
 */
function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
    assertPhaseArgs(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${USAGE}\n${message}\n`);
    process.exit(EXIT_USAGE);
  }

  emitHeartbeat(args);
}

if (require.main === module) {
  main(process.argv.slice(2));
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  parseArgs,
  assertPhaseArgs,
  readRecords,
  elapsedSince,
  terminalEvent,
  buildHeartbeat,
  emitHeartbeat,
};
