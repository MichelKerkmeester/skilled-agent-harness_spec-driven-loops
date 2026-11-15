#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Run-Now Sentinel Check and Restore
// ───────────────────────────────────────────────────────────────────
//
// A one-shot sentinel lets an operator ask a running loop to start the next
// iteration immediately. The loop boundary checks for it before the pause and
// convergence gates; a later step records one recreated while an accepted
// dispatch is still in flight. Both subcommands stage canonical ledger events
// in a scratch directory and hand them to the append gateway: the state log is
// a projection the gateway rebuilds from the ledger, so a row written beside
// it is dropped by the next refresh.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const EXIT_USAGE = 64;
const MODE = 'research';

const USAGE = [
  'Usage: run-now-sentinel.cjs check|restore',
  '--sentinel <path> --state-log <path> --session-id <id>',
  '--generation <n> --run <n> [--pause-sentinel <path>]',
].join(' ');

const FLAG_KEYS = Object.freeze({
  '--sentinel': 'sentinel',
  '--pause-sentinel': 'pauseSentinel',
  '--state-log': 'stateLog',
  '--session-id': 'sessionId',
  '--generation': 'generation',
  '--run': 'run',
});

const FLAGS_BY_KEY = Object.freeze(
  Object.fromEntries(Object.entries(FLAG_KEYS).map(([flag, key]) => [key, flag])),
);

// Restore never reads the pause sentinel: it reports a sentinel that reappeared
// after an accepted dispatch, and pause precedence was already decided by the
// boundary check. A flag a subcommand does not read is rejected so the workflow
// cannot believe it passed a value that had no effect.
const SUBCOMMAND_FLAGS = Object.freeze({
  check: Object.freeze(['sentinel', 'pauseSentinel', 'stateLog', 'sessionId', 'generation', 'run']),
  restore: Object.freeze(['sentinel', 'stateLog', 'sessionId', 'generation', 'run']),
});

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * @param {unknown} error - Thrown value.
 * @returns {string} Human-readable message.
 */
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
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
 * @param {string[]} argv - Full argument list.
 * @returns {string} Subcommand name.
 */
function resolveSubcommand(argv) {
  const subcommand = argv[0];
  if (subcommand === undefined) throw new Error('missing subcommand: check or restore');
  if (!Object.prototype.hasOwnProperty.call(SUBCOMMAND_FLAGS, subcommand)) {
    throw new Error(`unknown subcommand: ${subcommand}`);
  }
  return subcommand;
}

/**
 * Rejects a flag the subcommand does not read or a required flag left out.
 *
 * @param {string} subcommand - `check` or `restore`.
 * @param {Record<string, string>} args - Parsed arguments.
 */
function assertArgs(subcommand, args) {
  const allowed = SUBCOMMAND_FLAGS[subcommand];
  for (const key of Object.keys(args)) {
    if (!allowed.includes(key)) {
      throw new Error(`flag not valid for ${subcommand}: ${FLAGS_BY_KEY[key]}`);
    }
  }
  for (const key of allowed) {
    if (args[key] === undefined) throw new Error(`missing required flag: ${FLAGS_BY_KEY[key]}`);
  }
}

/**
 * Creates the scratch directory the staged events are written to. The shell
 * wrapper used `${TMPDIR:-/tmp}`, so only TMPDIR is consulted here; os.tmpdir()
 * would also follow TMP and TEMP and move the stage somewhere the wrapper never
 * looked.
 *
 * @returns {string} Absolute path to the event directory.
 */
function createEventDir() {
  return mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'deep-research-run-now.'));
}

/**
 * Reads the ledger projection back to front for the current run and session.
 * The most recent run-now decision wins. A malformed line throws: a half-written
 * projection is not a row set to read a decision from.
 *
 * @param {{ stateLogPath: string, run: number, sessionId: string }} input - Lookup parameters.
 * @returns {boolean} True when the last decision was an accepted run-now.
 */
function hasAcceptedCurrentRun({ stateLogPath, run, sessionId }) {
  if (!existsSync(stateLogPath)) return false;
  const lines = readFileSync(stateLogPath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const record = JSON.parse(lines[index]);
    if (record.run !== run || record.sessionId !== sessionId) continue;
    if (record.event === 'run_now_accepted') return true;
    if (record.event === 'run_now_rejected') return false;
  }
  return false;
}

/**
 * Stages the boundary-check events. The loop boundary has no lineage identity
 * yet, so the session names both scope halves rather than inventing a second
 * identifier. A lost race on the sentinel rename is another consumer winning,
 * not a failure, so only ENOENT is swallowed.
 *
 * @param {{
 *   eventDir: string,
 *   sentinelPath: string,
 *   pauseSentinelPath: string,
 *   run: number,
 *   sessionId: string,
 *   generation: number,
 * }} input - Check parameters.
 */
function stageCheckEvents({
  eventDir,
  sentinelPath,
  pauseSentinelPath,
  run,
  sessionId,
  generation,
}) {
  const scope = { runId: sessionId, lineageId: sessionId };
  let sequence = 0;

  function record(event, fields) {
    sequence += 1;
    writeFileSync(
      path.join(eventDir, `${String(sequence).padStart(2, '0')}-${event}.json`),
      JSON.stringify({
        stem: `deep_research.${event}`,
        scope,
        data: { mode: MODE, run, sessionId, generation, ...fields },
      }),
      'utf8',
    );
  }

  if (!existsSync(sentinelPath)) return;

  record("run_now_requested", { sentinelPath });
  if (existsSync(pauseSentinelPath)) {
    record("run_now_rejected", {
      sentinelPath,
      reason: 'loop_paused',
      pauseSentinelPath,
    });
    return;
  }

  const claimPath = `${sentinelPath}.consuming.${process.pid}.${Date.now()}`;
  try {
    renameSync(sentinelPath, claimPath);
    unlinkSync(claimPath);
    record("run_now_accepted", {
      sentinelPath,
      dispatchEvent: 'iteration_start',
    });
  } catch (error) {
    if (!error || error.code !== 'ENOENT') throw error;
  }
}

/**
 * Stages the restored-sentinel row when an operator recreated the sentinel
 * after this run was accepted. The event is staged for the gateway rather than
 * appended beside the projection, which the next refresh would discard.
 *
 * @param {{
 *   eventDir: string,
 *   sentinelPath: string,
 *   stateLogPath: string,
 *   run: number,
 *   sessionId: string,
 *   generation: number,
 * }} input - Restore parameters.
 * @returns {boolean} True when an event was staged.
 */
function stageRestoreEvent({
  eventDir,
  sentinelPath,
  stateLogPath,
  run,
  sessionId,
  generation,
}) {
  if (!existsSync(sentinelPath) || !hasAcceptedCurrentRun({ stateLogPath, run, sessionId })) {
    return false;
  }

  writeFileSync(
    path.join(eventDir, '01-run_now_restored.json'),
    JSON.stringify({
      stem: 'deep_research.run_now_restored',
      scope: { runId: sessionId, lineageId: sessionId },
      data: { mode: MODE, run, sessionId, generation, sentinelPath },
    }),
    'utf8',
  );
  return true;
}

/**
 * The status a gateway child's death maps to. A child killed by a signal
 * reports 128 plus the signal number, the status the shell loop's `$?`
 * carried; a signal this runtime cannot name reports 1, as does a death with
 * no status and no nameable signal.
 *
 * @param {{ status: number | null, signal: string | null }} result - spawnSync result.
 * @returns {number} Non-zero status.
 */
function gatewayExitStatus(result) {
  if (result.status !== null) return result.status;
  const signalNumber = result.signal === null
    ? undefined
    : os.constants.signals[result.signal];
  return typeof signalNumber === 'number' ? 128 + signalNumber : 1;
}

/**
 * Hands every staged event to the gateway in filename order, then removes the
 * scratch directory. The first gateway failure is returned unchanged so the
 * caller can pass the status through; a signal death reports 128 plus the
 * signal number, as the shell loop's `$?` did. The name filter mirrors the
 * shell glob the body replaced: no dotfiles, and nothing that vanished between
 * the listing and the read.
 *
 * @param {{ eventDir: string, runDirectory: string, gatewayPath: string }} input - Drain parameters.
 * @returns {number} Drain status.
 */
function drainStagedEvents({ eventDir, runDirectory, gatewayPath }) {
  const names = existsSync(eventDir)
    ? readdirSync(eventDir)
      .filter((name) => !name.startsWith('.') && name.endsWith('.json'))
      .filter((name) => existsSync(path.join(eventDir, name)))
      .sort()
    : [];

  for (const name of names) {
    const result = spawnSync(
      process.execPath,
      [
        gatewayPath,
        '--mode', MODE,
        '--run-directory', runDirectory,
        '--event-json', path.join(eventDir, name),
      ],
      { stdio: 'inherit' },
    );
    const status = gatewayExitStatus(result);
    if (status !== 0) {
      rmSync(eventDir, { recursive: true, force: true });
      return status;
    }
  }

  rmSync(eventDir, { recursive: true, force: true });
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

/**
 * A throw from either body still drains anything it staged, so a partially
 * accepted request is not left in a scratch directory the next step never
 * reads. The failure then exits 1 unless the gateway already failed with a
 * status of its own, which wins because it came from the write itself.
 *
 * @param {string[]} argv - Arguments after the script path.
 */
function main(argv) {
  let subcommand;
  let args;
  try {
    subcommand = resolveSubcommand(argv);
    args = parseArgs(argv.slice(1));
    assertArgs(subcommand, args);
  } catch (error) {
    process.stderr.write(`${USAGE}\n${errorMessage(error)}\n`);
    process.exit(EXIT_USAGE);
  }

  const eventDir = createEventDir();
  const run = Number(args.run);
  const generation = Number(args.generation);

  let failed = false;
  try {
    if (subcommand === 'check') {
      stageCheckEvents({
        eventDir,
        sentinelPath: args.sentinel,
        pauseSentinelPath: args.pauseSentinel,
        stateLogPath: args.stateLog,
        run,
        sessionId: args.sessionId,
        generation,
      });
    } else {
      stageRestoreEvent({
        eventDir,
        sentinelPath: args.sentinel,
        stateLogPath: args.stateLog,
        run,
        sessionId: args.sessionId,
        generation,
      });
    }
  } catch (error) {
    failed = true;
    process.stderr.write(`${errorMessage(error)}\n`);
  }

  const status = drainStagedEvents({
    eventDir,
    runDirectory: path.dirname(args.stateLog),
    gatewayPath: path.join(__dirname, 'append-mode-event.cjs'),
  });

  if (failed) process.exit(status === 0 ? 1 : status);
  process.exit(status);
}

if (require.main === module) {
  main(process.argv.slice(2));
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  parseArgs,
  resolveSubcommand,
  assertArgs,
  createEventDir,
  hasAcceptedCurrentRun,
  stageCheckEvents,
  stageRestoreEvent,
  drainStagedEvents,
};
