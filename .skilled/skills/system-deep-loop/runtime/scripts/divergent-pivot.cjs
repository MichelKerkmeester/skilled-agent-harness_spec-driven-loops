#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot Transaction
// ───────────────────────────────────────────────────────────────────
//
// One pivot transaction split across process boundaries. prepare persists
// everything up through "which seats are still missing" and returns;
// record-seat durably records one externally-obtained seat result per native
// dispatch step; finalize re-derives all context from disk and completes the
// transaction. A workflow interpreter cannot hand the library an in-process
// dispatchSeat callback. Only the running agent can natively dispatch a
// Council seat, so these three subcommands are the workflow-facing seam.
//
// Only prepare is mode-owned: it derives its input from the research or the
// review state and renders that mode's seat prompts. record-seat and finalize
// act on the persisted transaction alone, so neither takes a loop type.

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

require('tsx/cjs');

const {
  preparePivotTransaction,
  recordPivotSeatResult,
  finalizePivotTransaction,
} = require('../lib/deep-loop/divergent-pivot.ts');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const EXIT_USAGE = 64;

const USAGE = [
  'Usage: divergent-pivot.cjs prepare|record-seat|finalize',
  '[prepare: --loop-type research|review --artifact-root <dir> --config <path>',
  '--state-log <path> --strategy <path> --registry <path>',
  '--current-iteration <n> --max-iterations <n> --trigger-reason <reason>]',
  '[record-seat: JSON envelope on stdin]',
  '[finalize: --paths-json <json> --pivot-id <id> --resumed true|false]',
].join(' ');

const FLAG_KEYS = Object.freeze({
  '--loop-type': 'loopType',
  '--artifact-root': 'artifactRoot',
  '--config': 'config',
  '--state-log': 'stateLog',
  '--strategy': 'strategy',
  '--registry': 'registry',
  '--current-iteration': 'currentIteration',
  '--max-iterations': 'maxIterations',
  '--trigger-reason': 'triggerReason',
  '--paths-json': 'pathsJson',
  '--pivot-id': 'pivotId',
  '--resumed': 'resumed',
});

const FLAGS_BY_KEY = Object.freeze(
  Object.fromEntries(Object.entries(FLAG_KEYS).map(([flag, key]) => [key, flag])),
);

// Every flag a subcommand lists is required, and a flag it does not read is
// rejected. A silently ignored flag would let the workflow believe it passed a
// value that never reached the transaction, and no path flag may fall back to
// a default. record-seat reads no flags at all: its whole payload is the stdin
// envelope.
const SUBCOMMAND_FLAGS = Object.freeze({
  prepare: Object.freeze([
    'loopType',
    'artifactRoot',
    'config',
    'stateLog',
    'strategy',
    'registry',
    'currentIteration',
    'maxIterations',
    'triggerReason',
  ]),
  'record-seat': Object.freeze([]),
  finalize: Object.freeze(['pathsJson', 'pivotId', 'resumed']),
});

// The two mode libraries export the same shape under mode-owned names. Keeping
// the module path and both function names in one table means prepare has a
// single code path and a new mode is one entry, not a third branch.
const MODE_ADAPTERS = Object.freeze({
  research: Object.freeze({
    modulePath: ['..', '..', 'deep-research', 'scripts', 'divergent-research-pivot.ts'],
    buildInputName: 'buildResearchPivotPreparationInput',
    renderSeatPromptName: 'renderResearchPivotSeatPrompt',
  }),
  review: Object.freeze({
    modulePath: ['..', '..', 'deep-review', 'scripts', 'divergent-review-pivot.ts'],
    buildInputName: 'buildReviewPivotPreparationInput',
    renderSeatPromptName: 'renderReviewPivotSeatPrompt',
  }),
});

const STDIN_ENVELOPE_ERROR = 'record-seat expects one JSON object on stdin';

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

// A caller-contract failure exits 64, distinct from a transaction failure,
// which exits 1. The workflow uses the difference to tell "the command was
// malformed" from "the transaction could not complete".
class UsageError extends Error {}

/**
 * @param {unknown} error - Thrown value.
 * @returns {string} Human-readable message.
 */
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {unknown} value - Parsed stdin payload.
 * @returns {boolean} True for a non-array object.
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parses `--flag value` pairs. The token after a flag is always its value,
 * including an empty string, so a caller learns about a missing value from the
 * requirement check rather than from a silent default.
 *
 * @param {string[]} argv - Arguments after the subcommand.
 * @returns {Record<string, string>} Values keyed by camelCase flag name.
 */
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!Object.prototype.hasOwnProperty.call(FLAG_KEYS, token)) {
      throw new UsageError(token.startsWith('--') ? `unknown flag: ${token}` : `unknown argument: ${token}`);
    }
    const value = argv[index + 1];
    if (value === undefined) throw new UsageError(`missing value for flag: ${token}`);
    const key = FLAG_KEYS[token];
    if (Object.prototype.hasOwnProperty.call(args, key)) throw new UsageError(`repeated flag: ${token}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

/**
 * @param {string[]} argv - Full argument list.
 * @returns {string} Subcommand name.
 */
function resolveSubcommand(argv) {
  const subcommand = argv[0];
  if (subcommand === undefined) {
    throw new UsageError('missing subcommand: prepare, record-seat or finalize');
  }
  if (!Object.prototype.hasOwnProperty.call(SUBCOMMAND_FLAGS, subcommand)) {
    throw new UsageError(`unknown subcommand: ${subcommand}`);
  }
  return subcommand;
}

/**
 * Rejects a flag the subcommand does not read or a required flag left out.
 *
 * @param {string} subcommand - Resolved subcommand.
 * @param {Record<string, string>} args - Parsed arguments.
 */
function assertArgs(subcommand, args) {
  const allowed = SUBCOMMAND_FLAGS[subcommand];
  for (const key of Object.keys(args)) {
    if (!allowed.includes(key)) {
      throw new UsageError(`flag not valid for ${subcommand}: ${FLAGS_BY_KEY[key]}`);
    }
  }
  for (const key of allowed) {
    if (args[key] === undefined) throw new UsageError(`missing required flag: ${FLAGS_BY_KEY[key]}`);
  }
}

/**
 * Loads the mode-owned library lazily so a broken or absent module in one mode
 * leaves the other subcommands and the other mode usable.
 *
 * @param {string} loopType - `research` or `review`.
 * @returns {{
 *   buildInput: (options: Record<string, unknown>) => Record<string, any>,
 *   renderSeatPrompt: (seat: Record<string, any>, dispatchContext: Record<string, any>) => string,
 * }} Mode adapter bound to its library functions.
 */
function loadModeAdapter(loopType) {
  if (!Object.prototype.hasOwnProperty.call(MODE_ADAPTERS, loopType)) {
    throw new UsageError(`--loop-type must be research or review, got "${loopType}"`);
  }
  const adapter = MODE_ADAPTERS[loopType];
  const library = require(path.join(__dirname, ...adapter.modulePath));
  return {
    buildInput: library[adapter.buildInputName],
    renderSeatPrompt: library[adapter.renderSeatPromptName],
  };
}

/**
 * Reads the whole stdin envelope. Empty or unparsable input is a caller
 * contract failure, never an empty transaction: recording a seat from a
 * payload the workflow failed to bind would persist a wrong outcome.
 *
 * @returns {Record<string, any>} Parsed envelope.
 */
function readStdinEnvelope() {
  let raw;
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch {
    throw new UsageError(STDIN_ENVELOPE_ERROR);
  }
  if (raw.trim() === '') throw new UsageError(STDIN_ENVELOPE_ERROR);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new UsageError(STDIN_ENVELOPE_ERROR);
  }
  if (!isRecord(parsed)) throw new UsageError(STDIN_ENVELOPE_ERROR);
  return parsed;
}

/**
 * Maps the envelope onto the library's dispatch outcome. The rejected arm
 * discards any output the envelope carried: a rejected dispatch has no report
 * to parse, and only its error is durable evidence.
 *
 * @param {Record<string, any>} envelope - Parsed stdin envelope.
 * @returns {Record<string, unknown>} Outcome for recordPivotSeatResult.
 */
function buildSeatOutcome(envelope) {
  return envelope.status === 'fulfilled'
    ? {
      status: envelope.status,
      output: envelope.output,
      startedAtIso: envelope.startedAtIso,
      completedAtIso: envelope.completedAtIso,
      durationMs: Number(envelope.durationMs),
    }
    : {
      status: 'rejected',
      error: envelope.error,
      startedAtIso: envelope.startedAtIso,
      completedAtIso: envelope.completedAtIso,
      durationMs: Number(envelope.durationMs),
    };
}

/**
 * @param {string} value - Raw `--paths-json` value.
 * @returns {Record<string, unknown>} Parsed council paths.
 */
function parsePathsJson(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new UsageError('--paths-json must be valid JSON');
  }
  if (!isRecord(parsed)) throw new UsageError('--paths-json must be a JSON object');
  return parsed;
}

/**
 * @param {string} value - Raw `--resumed` value.
 * @returns {boolean} Resume flag for finalizePivotTransaction.
 */
function parseResumed(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new UsageError(`--resumed must be true or false, got "${value}"`);
}

/**
 * Writes the one JSON line a later workflow key binds from.
 *
 * @param {unknown} value - Value to serialize.
 */
function writeJsonLine(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

/**
 * @param {Record<string, string>} args - Parsed prepare arguments.
 */
async function runPrepare(args) {
  const adapter = loadModeAdapter(args.loopType);
  const input = adapter.buildInput({
    artifactRoot: args.artifactRoot,
    configPath: args.config,
    stateLogPath: args.stateLog,
    strategyPath: args.strategy,
    registryPath: args.registry,
    currentIteration: Number(args.currentIteration),
    maxIterations: Number(args.maxIterations),
    triggerReason: args.triggerReason,
  });
  const prepared = await preparePivotTransaction(input);
  const seatPrompts = prepared.status === 'pending'
    ? Object.fromEntries(prepared.missingSeats.map((seat) => [
      seat.id,
      adapter.renderSeatPrompt(seat, prepared.dispatchContext),
    ]))
    : {};
  writeJsonLine({
    ...prepared,
    seatPrompts,
    boundaryRejections: input.boundaryRejections,
  });
}

function runRecordSeat() {
  const envelope = readStdinEnvelope();
  writeJsonLine(recordPivotSeatResult({
    paths: envelope.paths,
    pivotId: envelope.pivotId,
    seat: envelope.seat,
    outcome: buildSeatOutcome(envelope),
  }));
}

/**
 * @param {Record<string, string>} args - Parsed finalize arguments.
 */
function runFinalize(args) {
  writeJsonLine(finalizePivotTransaction({
    paths: parsePathsJson(args.pathsJson),
    pivotId: args.pivotId,
    resumed: parseResumed(args.resumed),
  }));
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

/**
 * A usage failure resolves to 64 with the usage line; any other throw rejects
 * so the wrapper can report it and exit 1. CommonJS has no top-level await, so
 * prepare's promise is awaited here and the caller exits with the returned
 * status.
 *
 * @param {string[]} argv - Arguments after the script path.
 * @returns {Promise<number>} Process status.
 */
async function main(argv) {
  try {
    const subcommand = resolveSubcommand(argv);
    const args = parseArgs(argv.slice(1));
    assertArgs(subcommand, args);
    if (subcommand === 'prepare') {
      await runPrepare(args);
    } else if (subcommand === 'record-seat') {
      runRecordSeat();
    } else {
      runFinalize(args);
    }
    return 0;
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    process.stderr.write(`${USAGE}\n${errorMessage(error)}\n`);
    return EXIT_USAGE;
  }
}

// A success path leaves exactly one JSON line on stdout, and process.exit would
// cut a piped write off at the pipe buffer size. The status is set instead and
// the process ends by itself once stdout drains. A usage failure wrote nothing
// to stdout, and a thrown error is reported on stderr, so both may exit directly.
if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => {
      if (code === EXIT_USAGE) {
        process.exit(code);
      }
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`${errorMessage(error)}\n`);
      process.exit(1);
    },
  );
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  parseArgs,
  resolveSubcommand,
  assertArgs,
  buildSeatOutcome,
  readStdinEnvelope,
  parsePathsJson,
  parseResumed,
};
