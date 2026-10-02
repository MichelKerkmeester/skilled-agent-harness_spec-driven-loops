#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: score-stop-hint
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Replay a stop-rater report offline and score whether its recorded stops
 * would have made good confirm-mode hints. A default run reads one report,
 * makes no model call, and writes no file unless `--out` asks for one.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseArgs } = require('node:util');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The file a rater report lives under in its directory.
const REPORT_FILE = 'report.json';
// The line a run prints when the rater never confirmed the report's gold.
const NO_GOLD_LINE = 'stop: rater report has no confirmed gold';
// The suffix every skipped column's line carries.
const SKIP_SUFFIX = 'column skipped: rater report has none';
// The line a run prints when a stored report measured a different rater identity.
const REQUALIFY_LINE = 'requalify: rater changed';
// The two zero-call columns every report carries.
const DEFAULT_COLUMNS = ['legacy', 'sources'];
// The one model column a run adds on request.
const MODEL_COLUMNS = ['jev'];
// The leading hex characters of a report digest printed on a verdict line.
const SHA_CHARS = 12;
// The coverage floor: measured lineages as a share of the census.
const COVERAGE_FLOOR = 0.9;
// The loss tail a kill needs, and the win tail a keep needs.
const KILL_ALPHA = 0.05;
const SIGN_ALPHA = 0.05;
// The right-hint floor over measured hints.
const PRECISION_FLOOR = 0.9;
// The win floor over measured lineages needed for a keep.
const SAVINGS_FLOOR = 0.2;
// The rerun flips allowed per ten measured jev calls.
const FLIP_CEILING = 0.10;
// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)';
// The stored hint line: <column> is substituted, and <t> stays literal for the
// live gate to fill with the iteration it is shown at.
const KEEP_HINT_TEMPLATE = '**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>';
// The usage line for the one supported invocation.
const USAGE = 'node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--out <dir>]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. RATER REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lowercase SHA-256 hex digest of a file's bytes.
 *
 * @param {string} file - Path to hash
 * @returns {string} 64 hexadecimal characters
 */
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/**
 * Read and validate one stop-rater report. The digest is taken over the same
 * buffer the report is parsed from, so a later verdict line names exactly the
 * bytes its numbers came from.
 *
 * @param {string} dir - Directory holding the rater's report file
 * @returns {{ report: object, path: string, sha256: string }} Parsed report, its path, and its digest
 * @throws {Error} When the file is missing, is not JSON, or is not shaped like a rater report
 */
function readRaterReport(dir) {
  const file = path.join(dir, REPORT_FILE);
  let bytes;
  try {
    bytes = fs.readFileSync(file);
  } catch {
    throw new Error(`rater report not found: ${file}`);
  }
  let report;
  try {
    report = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error(`rater report is not JSON: ${file}`);
  }
  if (report === null || typeof report !== 'object' || !Array.isArray(report.lineages)) {
    throw new Error(`rater report has no lineage list: ${file}`);
  }
  for (let index = 0; index < report.lineages.length; index += 1) {
    const entry = report.lineages[index];
    const measured = entry !== null && typeof entry === 'object'
      && typeof entry.gold === 'number' && typeof entry.lastIteration === 'number';
    if (!measured) {
      throw new Error(`rater report lineage ${index} is missing gold or lastIteration`);
    }
  }
  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
  return { report, path: file, sha256: digest };
}

/**
 * The stop line for a report whose gold the rater never confirmed. A missing,
 * null or false label all read the same way: with no confirmed gold no replayed
 * stop can be scored against it.
 *
 * @param {object} report - Parsed rater report
 * @returns {string|null} The stop line, or null when the label gate passed
 */
function gateStopLine(report) {
  return report?.gate?.label?.passed === true ? null : NO_GOLD_LINE;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HINT COUNTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score one lineage's recorded stop as a confirm-mode hint. A stop only says
 * where the loop could have stopped early when it lands strictly before the
 * recorded last iteration: a stop at or past the last iteration would have
 * saved nothing, so it raises no hint. A hint at or after gold kept the last
 * source; one before gold cut the source off. Only a right hint saves the
 * iterations between where it lands and the record's last.
 *
 * @param {{ gold: number, lastIteration: number }} lineage - Lineage with the iteration its last source arrived and the iteration its record ends
 * @param {number|null|undefined} stop - This column's recorded stop for the lineage, null or absent when unmeasured
 * @returns {{ hint: number|null, right: boolean, wrong: boolean, saved: number }} The hint iteration, how it scored, and the iterations a right hint saves
 */
function hintFor(lineage, stop) {
  if (typeof stop !== 'number' || !(stop < lineage.lastIteration)) {
    return { hint: null, right: false, wrong: false, saved: 0 };
  }
  const right = lineage.gold <= stop;
  return { hint: stop, right, wrong: !right, saved: right ? lineage.lastIteration - stop : 0 };
}

/**
 * One column's hint counts over the census. Measured counts only the lineages
 * the column replayed to a stop: a null stop is a missing measurement, not
 * evidence against the column, and it lowers the share of the census the
 * column can be judged on. Hints, right, wrong and saved read over the
 * measured set alone.
 *
 * @param {Array<{ gold: number, lastIteration: number, stops?: object }>} lineages - Census lineages in report order
 * @param {string} column - Column name, the key its stops are recorded under
 * @returns {{ column: string, K: number, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} The column's counts
 */
function countColumn(lineages, column) {
  const K = lineages.length;
  let M = 0;
  let W = 0;
  let L = 0;
  let saved = 0;
  for (const lineage of lineages) {
    const stop = lineage.stops?.[column];
    if (typeof stop === 'number') M += 1;
    const scored = hintFor(lineage, stop);
    if (scored.right) W += 1;
    if (scored.wrong) L += 1;
    saved += scored.saved;
  }
  const hints = W + L;
  return { column, K, M, hints, W, L, noHint: M - hints, saved };
}

/**
 * The column line: how much of the census the column measured, how many of
 * those stops became hints, how many read right and wrong, how many measured
 * stops raised no hint at all, and the iterations the right hints would have
 * saved.
 *
 * @param {{ column: string, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} counts - Counts from countColumn
 * @returns {string} Column line for stdout and the report column
 */
function columnLine(counts) {
  return `column ${counts.column}: measured ${counts.M} hints ${counts.hints} right ${counts.W} wrong ${counts.L} no hint ${counts.noHint} saved ${counts.saved}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COLUMN SELECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The columns one run prints, in print order: the two zero-call columns first,
 * then a requested model column. A model column is available only when the
 * rater recorded a finished column for it. A column the rater skipped or
 * stopped carries no replay stops, so it prints one skip line in its place
 * rather than letting a missing column read as a column of zero hints.
 *
 * @param {object} report - Parsed rater report
 * @param {{ jev?: boolean }} [options] - Model columns the run asked for
 * @returns {Array<{ column: string, skip: boolean, skipLine: string|null }>} Columns in print order, each with its skip verdict
 */
function selectColumns(report, options = {}) {
  const selected = DEFAULT_COLUMNS.map((column) => ({ column, skip: false, skipLine: null }));
  for (const column of MODEL_COLUMNS) {
    if (options?.[column] !== true) continue;
    const recorded = report?.columns?.[column] !== undefined;
    const withheld = report?.stopped?.[column] !== undefined || report?.skipped?.[column] !== undefined;
    const skip = !recorded || withheld;
    selected.push({ column, skip, skipLine: skip ? `${column} ${SKIP_SUFFIX}` : null });
  }
  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VERDICT AND REQUALIFY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exact one-sided chance of `successes` or more in `trials` fair coin flips.
 * The tail sum is built coefficient by coefficient in BigInt, and the below
 * 0.05 test stays exact as 20 * num < den, never a float comparison.
 *
 * @param {number} successes - Outcomes whose tail is summed
 * @param {number} trials - Total flips
 * @returns {{ num: bigint, den: bigint, p: number }} Tail numerator over 2^trials
 */
function binomialTail(successes, trials) {
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= trials; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(trials - i + 1)) / BigInt(i);
    if (i >= successes) num += coefficient;
  }
  const den = 1n << BigInt(trials);
  return { num, den, p: Number(num) / Number(den) };
}

/**
 * First failed check decides, in the order the printed rule states: coverage,
 * kill, precision, savings, sign test, then flips for the rerun-sampled jev
 * column alone. A clean loss tail kills before precision is read, and the
 * flips check binds only the column whose calls were rerun, since a single
 * call cannot flip.
 *
 * @param {{ column: string, K: number, M: number, W: number, L: number, F?: number, C?: number }} counts - Column counts and the jev flip pair
 * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'precision'|'savings'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
 */
function decideVerdict({ column, K, M, W, L, F, C }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
  if (!(10 * W >= 9 * (W + L))) return { outcome: 'stop', reason: 'precision', pWin: win.p, pLoss: loss.p };
  if (!(5 * W >= M)) return { outcome: 'stop', reason: 'savings', pWin: win.p, pLoss: loss.p };
  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
  if (column === 'jev' && !(10 * F <= C)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
  return { outcome: 'keep', reason: null, pWin: win.p, pLoss: loss.p };
}

/**
 * @param {number} p - Probability in [0, 1]
 * @returns {string} Four significant digits
 */
function formatP(p) {
  return p.toPrecision(4);
}

/**
 * The rater identity a model column's verdict holds for. The two zero-call
 * columns name no rater, and a column the report does not carry reads the
 * same way, so a caller appends the result only when it is non-empty.
 *
 * @param {object} report - Parsed rater report
 * @param {string} column - Column name
 * @returns {string} Identity fields in print order, or '' when the column carries none
 */
function raterSuffix(report, column) {
  const recorded = report?.columns?.[column];
  if (recorded === null || typeof recorded !== 'object') return '';
  if (column === 'jev') {
    return `jev_version=${recorded.jevVersion} provider=${recorded.provider} model=${recorded.model}`;
  }
  return '';
}

/**
 * The verdict line: one outcome, the counts it was read from, the exact tail
 * the decision turned on, the digest of the report those numbers came from
 * and, for a model column, the rater identity the verdict holds for. A kill
 * prints its loss tail; every other outcome prints its win tail.
 *
 * @param {object} summary - Column counts with the verdict and the report digest
 * @param {string} [raterSuffix] - Rater identity, appended when non-empty
 * @returns {string} Verdict line for stdout and the report column
 */
function verdictLine(summary, raterSuffix) {
  const outcomeText = summary.reason === null ? summary.outcome : `stop (${summary.reason})`;
  const p = summary.outcome === 'kill' ? summary.pLoss : summary.pWin;
  let line = `verdict ${summary.column}: ${outcomeText} K=${summary.K} M=${summary.M} W=${summary.W} L=${summary.L} saved=${summary.saved} p=${formatP(p)} report=${summary.report}`;
  if (typeof raterSuffix === 'string' && raterSuffix.length > 0) line += ` ${raterSuffix}`;
  return line;
}

/**
 * Parsed report.json an earlier run wrote into the same output directory. A
 * later run reads it to requalify a model column whose rater identity changed,
 * before printing its own verdict for that column.
 *
 * @param {string|undefined|null} outDir - Directory that may hold report.json
 * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse
 */
function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, REPORT_FILE), 'utf8'));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The stop hint a kept column stores for the live gate to show. The iteration
 * stays a literal placeholder because only the gate knows the iteration it is
 * shown at, and the stored line must stay the same across replays.
 *
 * @param {string} column - Column name the hint belongs to
 * @returns {string} Hint line with the column substituted
 */
function hintLine(column) {
  return KEEP_HINT_TEMPLATE.replace('<column>', column);
}

/**
 * The report one run writes to report.json: every printed verdict with the
 * counts it came from, a kept column's stop hint, a skipped column's line,
 * and the digest of the rater report the run scored. The digest names the
 * exact bytes the counts came from, so a later run can tell when a model
 * column was measured on a different rater.
 *
 * @param {object} parts - Report inputs
 * @param {string} parts.generated - Run timestamp, ISO 8601
 * @param {{ path: string, sha256: string }} parts.rater - Rater report path and digest
 * @param {{ passed: boolean, line: string|null }} parts.gate - Gate read from the rater report
 * @param {object} parts.columns - Finished column records by column name
 * @param {object} parts.skipped - Skip lines by column name
 * @param {object} parts.requalify - Requalify lines by model column name, null when unchanged
 * @returns {object} Report object ready for JSON.stringify
 */
function buildReport(parts) {
  const { generated, rater, gate, columns, skipped, requalify } = parts;
  return {
    generated,
    rater: { path: rater.path, sha256: rater.sha256 },
    gate: { passed: gate.passed, line: gate.line },
    columns: { ...columns },
    skipped: { ...skipped },
    requalify: { ...requalify },
  };
}

/**
 * Write the run report into `report.json` under the output directory. A run
 * without a directory writes nothing, and the file is written whole on every
 * run, so an earlier report never merges into a later one.
 *
 * @param {string|undefined|null} outDir - Output directory, absent when the run requested none
 * @param {object} report - Report object from buildReport
 * @returns {string|null} Written path, or null when no directory was requested
 */
function writeReport(outDir, report) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, REPORT_FILE);
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the switches, read the rater report, and close with the stop line when
 * the rater never confirmed its gold. A passed gate opens the column output
 * the remaining sections print and, when `--out` names a directory, stores it
 * in report.json.
 *
 * @param {string[]} argv - Command-line switches, without the node and script parts
 * @param {object} [deps] - Injected seams: out, err, env
 * @returns {Promise<number>} The exit code: 0 on a read report or gate stop, 2 on a parse, refusal, or read failure
 */
async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;

  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        'rater-report': { type: 'string' },
        jev: { type: 'boolean' },
        out: { type: 'string' },
      },
    }));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const raterDir = values['rater-report'];
  if (typeof raterDir !== 'string' || raterDir === '') {
    err('--rater-report <dir> is required');
    return 2;
  }

  // A run that wrote its report over the report it read would destroy the only
  // record of what the rater measured, so the collision is refused up front.
  const outDir = typeof values.out === 'string' && values.out !== '' ? values.out : null;
  if (outDir !== null && path.resolve(outDir, REPORT_FILE) === path.resolve(raterDir, REPORT_FILE)) {
    err(`--out <dir> would overwrite the rater report: ${path.resolve(outDir, REPORT_FILE)}`);
    return 2;
  }

  let loaded;
  try {
    loaded = readRaterReport(raterDir);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const stopLine = gateStopLine(loaded.report);
  if (stopLine !== null) {
    out(stopLine);
    return 0;
  }

  // The keep rule prints before the columns, so every verdict below can be
  // rechecked by hand against the rule it was read from.
  out(KEEP_RULE_LINE);

  // A stored report is the only record of what an earlier run measured on, so
  // this run can requalify a model column whose rater identity changed since.
  const stored = readStoredReport(outDir);
  const reportColumns = {};
  const reportSkipped = {};
  const reportRequalify = {};

  for (const selection of selectColumns(loaded.report, { jev: values.jev === true })) {
    if (selection.skip) {
      out(selection.skipLine);
      reportSkipped[selection.column] = selection.skipLine;
      continue;
    }
    const counts = countColumn(loaded.report.lineages, selection.column);
    const jevRecord = selection.column === 'jev' ? loaded.report.columns?.jev : undefined;
    const verdict = decideVerdict({
      column: selection.column,
      K: counts.K,
      M: counts.M,
      W: counts.W,
      L: counts.L,
      F: jevRecord?.F,
      C: jevRecord?.C,
    });
    const identity = raterSuffix(loaded.report, selection.column);
    out(columnLine(counts));
    const prior = stored?.columns?.[selection.column];
    const requalified = prior !== null && typeof prior === 'object' && (typeof prior.rater === 'string' ? prior.rater : '') !== identity;
    if (requalified) {
      out(REQUALIFY_LINE);
    }
    const line = verdictLine({ ...counts, ...verdict, report: loaded.sha256.slice(0, SHA_CHARS) }, identity);
    out(line);
    const record = {
      K: counts.K,
      M: counts.M,
      hints: counts.hints,
      W: counts.W,
      L: counts.L,
      noHint: counts.noHint,
      saved: counts.saved,
      outcome: verdict.outcome,
      reason: verdict.reason,
      p: verdict.outcome === 'kill' ? verdict.pLoss : verdict.pWin,
      verdict: line,
    };
    if (verdict.outcome === 'keep') record.hintLine = hintLine(selection.column);
    if (identity.length > 0) record.rater = identity;
    if (requalified) record.requalify = REQUALIFY_LINE;
    reportColumns[selection.column] = record;
    if (MODEL_COLUMNS.includes(selection.column)) {
      reportRequalify[selection.column] = requalified ? REQUALIFY_LINE : null;
    }
  }

  // `--out` keeps the printed output on disk; the gate stop above returned first.
  if (outDir !== null) {
    writeReport(outDir, buildReport({
      generated: new Date().toISOString(),
      rater: { path: loaded.path, sha256: loaded.sha256 },
      gate: { passed: true, line: null },
      columns: reportColumns,
      skipped: reportSkipped,
      requalify: reportRequalify,
    }));
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  REPORT_FILE,
  NO_GOLD_LINE,
  SKIP_SUFFIX,
  REQUALIFY_LINE,
  DEFAULT_COLUMNS,
  MODEL_COLUMNS,
  SHA_CHARS,
  COVERAGE_FLOOR,
  KILL_ALPHA,
  PRECISION_FLOOR,
  SAVINGS_FLOOR,
  SIGN_ALPHA,
  FLIP_CEILING,
  KEEP_RULE_LINE,
  KEEP_HINT_TEMPLATE,
  USAGE,
  sha256,
  readRaterReport,
  gateStopLine,
  hintFor,
  countColumn,
  columnLine,
  selectColumns,
  binomialTail,
  formatP,
  decideVerdict,
  raterSuffix,
  verdictLine,
  readStoredReport,
  hintLine,
  buildReport,
  writeReport,
  main,
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
