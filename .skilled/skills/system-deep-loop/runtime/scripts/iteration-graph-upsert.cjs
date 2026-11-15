#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Iteration Graph Upsert
// ───────────────────────────────────────────────────────────────────
//
// Persists the graph events an iteration declared. The delta file is the
// source when it exists: the state log is a gateway-refreshed projection that
// does not carry the iteration's graphEvents, so an upsert driven from the log
// alone never sees a node or an edge. A run with no graph events is a normal
// outcome, not a failure.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const EXIT_USAGE = 64;
const LOOP_TYPE = 'research';

const USAGE = [
  'Usage: iteration-graph-upsert.cjs',
  '--delta-dir <dir> --state-log <path> --iteration <n>',
  '--spec-folder <path> --session-id <id>',
].join(' ');

const FLAG_KEYS = Object.freeze({
  '--delta-dir': 'deltaDir',
  '--state-log': 'stateLog',
  '--iteration': 'iteration',
  '--spec-folder': 'specFolder',
  '--session-id': 'sessionId',
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
 * @param {Record<string, string>} args - Parsed arguments.
 */
function assertArgs(args) {
  for (const key of Object.keys(FLAG_KEYS)) {
    const camelKey = FLAG_KEYS[key];
    if (args[camelKey] === undefined) throw new Error(`missing required flag: ${key}`);
  }
}

/**
 * Parses JSONL text. A malformed line is reported and skipped rather than
 * aborting the iteration: one bad row must not hide the graph events the rest
 * of the file declares.
 *
 * @param {string} raw - File text.
 * @param {string} source - Path the text came from, for the diagnostic.
 * @returns {Array<unknown>} Parsed records in file order.
 */
function parseJsonLines(raw, source) {
  const records = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed));
    } catch (error) {
      process.stderr.write(`deep-research graph upsert: skipped malformed line in ${source}: ${errorMessage(error)}\n`);
    }
  }
  return records;
}

/**
 * @param {Array<unknown>} records - Records from the delta or state log.
 * @returns {Array<unknown>} Graph events of the last iteration record.
 */
function latestGraphEvents(records) {
  for (let index = records.length - 1; index >= 0; index -= 1) {
    const record = records[index];
    if (record && record.type === 'iteration') {
      return Array.isArray(record.graphEvents) ? record.graphEvents : [];
    }
  }
  return [];
}

/**
 * Normalizes the delta's graph events into the node and edge shapes the upsert
 * entrypoint accepts. The delta names an edge's endpoints and relation loosely,
 * so each alias is resolved here and the relation is uppercased to the
 * vocabulary the graph validates against.
 *
 * @param {Array<unknown>} events - Graph events.
 * @returns {{ nodes: Array<Record<string, unknown>>, edges: Array<Record<string, unknown>> }} Upsert inputs.
 */
function splitGraphEvents(events) {
  const nodes = [];
  const edges = [];
  for (const event of events) {
    if (!event || typeof event !== 'object') continue;
    if (event.type === 'node') {
      nodes.push({ ...event, name: event.label ?? event.name ?? event.id });
    } else if (event.type === 'edge') {
      edges.push({
        ...event,
        sourceId: event.sourceId ?? event.source,
        targetId: event.targetId ?? event.target,
        relation: String(event.relation ?? '').toUpperCase(),
      });
    }
  }
  return { nodes, edges };
}

/**
 * Picks this iteration's graph events. The delta file wins over the state log
 * whenever it exists, even when it carries no events: falling back to the log
 * there would replay an earlier iteration's graph.
 *
 * @param {{ deltaDir: string, stateLogPath: string, iteration: number }} input - Source selection.
 * @returns {Array<unknown>} Graph events.
 */
function readGraphEvents({ deltaDir, stateLogPath, iteration }) {
  const deltaPath = path.join(deltaDir, `iter-${String(iteration).padStart(3, '0')}.jsonl`);
  const sourcePath = existsSync(deltaPath) ? deltaPath : stateLogPath;
  const records = existsSync(sourcePath)
    ? parseJsonLines(readFileSync(sourcePath, 'utf8'), sourcePath)
    : [];
  return latestGraphEvents(records);
}

/**
 * Runs the upsert entrypoint. No `env` and no `cwd` are passed, so the child
 * inherits both: tests pin the coverage database through the environment, and
 * the entrypoint resolves its own TypeScript modules from its own directory.
 *
 * @param {{
 *   iteration: number,
 *   specFolder: string,
 *   sessionId: string,
 *   deltaDir: string,
 *   stateLogPath: string,
 * }} input - Upsert parameters.
 * @returns {number} Exit status for the step.
 */
function runUpsert({ iteration, specFolder, sessionId, deltaDir, stateLogPath }) {
  const { nodes, edges } = splitGraphEvents(readGraphEvents({ deltaDir, stateLogPath, iteration }));

  if (nodes.length === 0 && edges.length === 0) {
    process.stdout.write(`deep-research graph upsert: no graph events for iteration ${iteration}; skipping\n`);
    return 0;
  }

  const upsert = spawnSync(
    process.execPath,
    [
      path.join(__dirname, 'upsert.cjs'),
      '--spec-folder', specFolder,
      '--loop-type', LOOP_TYPE,
      '--session-id', sessionId,
      '--nodes', JSON.stringify(nodes),
      '--edges', JSON.stringify(edges),
    ],
    { encoding: 'utf8' },
  );
  if (upsert.error) {
    process.stderr.write(`deep-research graph upsert: failed to spawn upsert.cjs: ${upsert.error.message}\n`);
  }
  if (upsert.stdout) process.stdout.write(upsert.stdout);
  if (upsert.stderr) process.stderr.write(upsert.stderr);
  return upsert.status === null ? 1 : upsert.status;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv - Arguments after the script path.
 */
function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
    assertArgs(args);
  } catch (error) {
    process.stderr.write(`${USAGE}\n${errorMessage(error)}\n`);
    process.exit(EXIT_USAGE);
  }

  process.exit(runUpsert({
    iteration: Number(args.iteration),
    specFolder: args.specFolder,
    sessionId: args.sessionId,
    deltaDir: args.deltaDir,
    stateLogPath: args.stateLog,
  }));
}

if (require.main === module) {
  main(process.argv.slice(2));
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  parseArgs,
  assertArgs,
  parseJsonLines,
  latestGraphEvents,
  splitGraphEvents,
  readGraphEvents,
  runUpsert,
};
