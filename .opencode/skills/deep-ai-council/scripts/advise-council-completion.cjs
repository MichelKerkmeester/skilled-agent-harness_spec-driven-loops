// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ advise-council-completion (CLI)                                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Council completion advisory: state, seats, council_complete checks       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { parseStateLog } = require('./persist-artifacts.cjs');

// ────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ────────────────────────────────────────────────────────────────────────────

function usage() {
  return 'Usage: node advise-council-completion.cjs <packet-spec-folder> [--json] [--quiet]';
}

function parseArgs(argv) {
  const args = { packetSpecFolder: null, json: false, quiet: false };
  const rest = [...argv];
  args.packetSpecFolder = rest.shift() || null;
  for (const flag of rest) {
    if (flag === '--json') args.json = true;
    else if (flag === '--quiet') args.quiet = true;
    else args.unknown = flag;
  }
  return args;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readStateEvents(statePath) {
  if (!fs.existsSync(statePath)) return null;
  try {
    return parseStateLog(fs.readFileSync(statePath, 'utf8'));
  } catch (error) {
    console.warn(`[ai-council] State log parse failed: ${error.message}`);
    return [];
  }
}

function listRoundDirectories(seatsRoot) {
  if (!fs.existsSync(seatsRoot)) return [];
  return fs.readdirSync(seatsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^round-\d{3}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function countSeatFiles(roundPath) {
  if (!fs.existsSync(roundPath)) return 0;
  return fs.readdirSync(roundPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .length;
}

function expectedSeatCount(config) {
  if (!config || typeof config !== 'object') return null;
  if (Array.isArray(config.seats)) return config.seats.length;
  if (Number.isInteger(config.seats_per_round)) return config.seats_per_round;
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ────────────────────────────────────────────────────────────────────────────

/**
 * Collect missing-artifact and incomplete-state advisories for a packet.
 *
 * @param {string} packetSpecFolder - Packet spec folder to inspect
 * @returns {string[]} Advisory messages
 */
function collectAdvisories(packetSpecFolder) {
  const packetPath = path.resolve(packetSpecFolder);
  const councilRoot = path.join(packetPath, 'ai-council');
  const advisories = [];

  if (!fs.existsSync(councilRoot)) {
    advisories.push(`no council artifacts at ${councilRoot}`);
    return advisories;
  }

  const seatsRoot = path.join(councilRoot, 'seats');
  const roundDirectories = listRoundDirectories(seatsRoot);
  const reportPath = path.join(councilRoot, 'council-report.md');
  if (roundDirectories.length > 0 && !fs.existsSync(reportPath)) {
    advisories.push(`council-report.md missing despite seats present in ${roundDirectories[0]}`);
  }

  const statePath = path.join(councilRoot, 'ai-council-state.jsonl');
  const stateEvents = readStateEvents(statePath);
  if (stateEvents && !stateEvents.some((event) => event.event === 'council_complete')) {
    advisories.push('state.jsonl missing council_complete event');
  }

  const config = readJsonIfExists(path.join(councilRoot, 'ai-council-config.json'));
  const expected = expectedSeatCount(config);
  if (expected !== null) {
    for (const round of roundDirectories) {
      const actual = countSeatFiles(path.join(seatsRoot, round));
      if (actual < expected) {
        advisories.push(`${round} has ${actual} seat files but config expects ${expected}`);
      }
    }
  }

  return advisories;
}

/**
 * Collect council state event counts for completion reporting.
 *
 * @param {string} packetSpecFolder - Packet spec folder to inspect
 * @returns {Object} Summary counts keyed by event type
 */
function collectSummary(packetSpecFolder) {
  const packetPath = path.resolve(packetSpecFolder);
  const statePath = path.join(packetPath, 'ai-council', 'ai-council-state.jsonl');
  const stateEvents = readStateEvents(statePath) || [];
  return {
    artifact_written: stateEvents.filter((event) => event.event === 'artifact_written').length,
    rollback: stateEvents.filter((event) => event.event === 'rollback').length,
    artifact_superseded: stateEvents.filter((event) => event.event === 'artifact_superseded').length,
  };
}

function renderHuman(packetSpecFolder, advisories, summary = null) {
  const lines = [`Council completion advisory for ${path.resolve(packetSpecFolder)}`];
  const body = advisories.length ? advisories.map((advisory) => `- ${advisory}`) : ['No advisories.'];
  if (summary) {
    body.push(`Artifact writes recorded: ${summary.artifact_written}`);
    body.push(`Rollback events recorded: ${summary.rollback}`);
  }
  return `${lines.concat(body).join('\n')}\n`;
}

/**
 * Run the council completion advisory CLI.
 *
 * @param {string[]} [argv=process.argv.slice(2)] - CLI arguments
 * @returns {number} Process exit code
 */
function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const packet = args.packetSpecFolder || '<missing-packet-spec-folder>';
  const advisories = args.packetSpecFolder && !args.unknown
    ? collectAdvisories(args.packetSpecFolder)
    : [args.unknown ? `unknown argument: ${args.unknown}` : usage()];
  const summary = args.packetSpecFolder && !args.unknown ? collectSummary(args.packetSpecFolder) : null;

  if (!args.quiet) {
    if (args.json) {
      process.stdout.write(`${JSON.stringify({ packet: path.resolve(packet), advisories, summary })}\n`);
    } else {
      process.stdout.write(renderHuman(packet, advisories, summary));
    }
  }

  return 0;
}

// ────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ────────────────────────────────────────────────────────────────────────────

module.exports = {
  collectAdvisories,
  collectSummary,
  main,
};

if (require.main === module) {
  process.exitCode = main();
}
