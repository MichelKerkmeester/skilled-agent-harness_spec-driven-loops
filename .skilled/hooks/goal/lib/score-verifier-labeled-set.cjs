// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-verifier labeled-set scorer (offline and zero-call)     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Load a labeled verifier row set and run three zero-call arms on ║
// ║          every row: the OpenCode plugin heuristic on the ingested text,  ║
// ║          the same heuristic on the raw tail window, and goal-core        ║
// ║          parity. Print a confusion table per arm, the clamp and wrapper  ║
// ║          counts, and a stop or gate line. It spawns no model binary.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const core = require('./goal-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The OpenCode goal plugin reached through the .skilled/plugins link. Keeping
// that linked path intact is what needs --preserve-symlinks where
// .opencode/node_modules is absent, because the link is what keeps
// @opencode-ai/plugin resolvable from .skilled/node_modules.
const PLUGIN_PATH = path.join(__dirname, '..', '..', '..', 'plugins', 'opencode-goal.js');

// The plugin's evidence cap, and the tail window the raw-text arm keeps.
const TAIL_WINDOW_CHARS = 1200;

// Below this many labeled rows the report is too thin to read.
const MIN_ROWS = 30;

const UNLABELED = 'unlabeled';
const INVALID = 'invalid';

// Labels a human may write for a row, folded to the canonical spelling. The
// underscore and hyphen spellings of not_met both appear in the wild.
const LABEL_ALIASES = new Map([
  ['met', 'met'],
  ['not_met', 'not_met'],
  ['not-met', 'not_met'],
  ['blocked', 'blocked'],
]);

// Verdicts the verifier stack may answer: the OpenCode plugin answers not_met
// while goal-core answers not-met, so both fold to not_met. unclear is a
// distinct third state and keeps its own value rather than folding.
const VERDICT_ALIASES = new Map([
  ['met', 'met'],
  ['not_met', 'not_met'],
  ['not-met', 'not_met'],
  ['blocked', 'blocked'],
  ['unclear', 'unclear'],
]);

// Verifier reason strings as the verifier emits them, mapped to the scoring
// categories. An unrecognized reason falls to "other" rather than being
// guessed into a bucket.
const REASON_CATEGORIES = new Map([
  ['Evidence is too short to prove completion', 'too_short'],
  ['Evidence includes blocking or incomplete-work language', 'blocking'],
  ['Evidence appears truncated before it proves completion', 'truncated'],
  ['Evidence lacks an explicit completion signal', 'no_completion'],
  ['Evidence does not reference the goal objective specifically enough', 'weak_link'],
  ['Evidence gives an explicit completion signal tied to the goal objective', 'met'],
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fold a labeled-set label to its canonical form.
 *
 * A missing or blank label is "unlabeled" so the row still counts toward the
 * set while staying out of the labeled side; any other unrecognized value is
 * "invalid" and rejects the row.
 *
 * @param {*} value - Raw label from a JSONL row.
 * @returns {string} "met", "not_met", "blocked", "unlabeled" or "invalid".
 */
function normalizeLabel(value) {
  if (value === undefined || value === null) return UNLABELED;
  if (typeof value !== 'string') return INVALID;
  const text = value.trim().toLowerCase();
  if (text === '') return UNLABELED;
  return LABEL_ALIASES.get(text) || INVALID;
}

/**
 * Fold a verifier verdict to its canonical form.
 *
 * @param {*} value - Raw verdict from a verifier answer.
 * @returns {string} "met", "not_met", "blocked" or "unclear".
 * @throws {Error} When the value is not a known verdict.
 */
function normalizeVerdict(value) {
  const verdict = VERDICT_ALIASES.get(value);
  if (verdict === undefined) throw new Error(`unknown verdict: ${String(value)}`);
  return verdict;
}

/**
 * Map a verifier reason string to its scoring category.
 *
 * @param {*} reason - Verifier reason text.
 * @returns {string} The category key, or "other" for an unrecognized reason.
 */
function reasonCategory(reason) {
  return REASON_CATEGORIES.get(reason) || 'other';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LOADER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the labeled JSONL set into accepted rows with per-line error refs.
 *
 * Line numbers count from 1 over the raw split, so blank lines keep the
 * numbering of everything after them. A row drops at its first failing check,
 * and the error names it by id when a usable id exists and by line otherwise.
 * Only an accepted row reserves its id, so a row that never made it in does
 * not block a later row reusing that id.
 *
 * @param {string} text - JSONL text, one candidate row per line.
 * @returns {{total: number, labeled: object[], unlabeled: number,
 *   sources: {claude: number, pi: number}, errors: string[]}} Accepted rows
 *   and the per-line error refs.
 */
function loadRows(text) {
  const result = {
    total: 0,
    labeled: [],
    unlabeled: 0,
    sources: { claude: 0, pi: 0 },
    errors: [],
  };
  const seenIds = new Set();
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const lineNo = index + 1;
    const line = lines[index];
    if (line.trim() === '') continue;

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      result.errors.push(`line ${lineNo}: not JSON`);
      continue;
    }

    const row = parsed !== null && typeof parsed === 'object' ? parsed : null;
    const id = row === null ? undefined : row.id;
    const ref = typeof id === 'string' && id.trim() !== '' ? `row ${id}` : `line ${lineNo}`;

    let error = null;
    if (typeof id !== 'string' || id.trim() === '') error = 'id must be a non-empty string';
    else if (seenIds.has(id)) error = 'duplicate id';
    else if (row.source !== 'claude' && row.source !== 'pi') error = 'source must be claude or pi';
    else if (typeof row.objective !== 'string' || row.objective.trim() === '') error = 'objective must be a non-empty string';
    else if (typeof row.raw_text !== 'string') error = 'raw_text must be a string';
    else if (typeof row.ingested_text !== 'string') error = 'ingested_text must be a string';
    else if (!Number.isInteger(row.raw_length) || row.raw_length < 0) error = 'raw_length must be a non-negative integer';
    else if (normalizeLabel(row.label) === INVALID) {
      error = `label "${String(row.label).slice(0, 20)}" is not met, not_met, not-met or blocked`;
    }
    if (error !== null) {
      result.errors.push(`${ref}: ${error}`);
      continue;
    }

    const label = normalizeLabel(row.label);
    seenIds.add(id);
    result.total += 1;
    result.sources[row.source] += 1;
    if (label === UNLABELED) result.unlabeled += 1;
    else result.labeled.push({ ...row, label });
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ARMS
// ─────────────────────────────────────────────────────────────────────────────

// The arms answer each labeled row independently: the plugin heuristic
// verifier over the ingested evidence, the same verifier over the tail of the
// raw text at the plugin's evidence cap, and the runtime-neutral core
// heuristic over the raw text. The parity arm is what lets the two
// implementations be diffed row by row.
const ARM_NAMES = ['heuristic', 'tail_window'];

function armAnswer(result) {
  return { verdict: normalizeVerdict(result.verdict), category: reasonCategory(result.reason) };
}

/**
 * Score every labeled row through the three verifier arms.
 *
 * Each plugin arm gets its own session id inside one temp state dir, so the
 * arms cannot read each other's goals. A plugin that cannot be loaded throws
 * a PLUGIN_LOAD error naming the path and the symlink flag, because that
 * failure is an environment gap rather than a bad row.
 *
 * @param {object[]} rows - Labeled rows with objective, raw_text and
 *   ingested_text.
 * @returns {Promise<object[]>} Per-row { heuristic, tail_window, parity }
 *   answers, each { verdict, category }.
 */
async function runArms(rows) {
  let plugin;
  try {
    plugin = await import(pathToFileURL(PLUGIN_PATH).href);
  } catch (error) {
    const failure = new Error(`cannot load the goal plugin at ${PLUGIN_PATH}: ${error.code || error.message}. Where .opencode/node_modules is absent, run node with --preserve-symlinks`);
    failure.code = 'PLUGIN_LOAD';
    throw failure;
  }
  const helpers = plugin.default.__test;
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-verifier-score-'));
  try {
    const results = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const answers = {};
      for (const arm of ARM_NAMES) {
        const sessionID = `score-${arm}-${index}`;
        const evidence = arm === 'heuristic' ? row.ingested_text : row.raw_text.slice(-TAIL_WINDOW_CHARS);
        const goal = await helpers.setGoal(sessionID, row.objective, { stateDir, nowMs: 1000, goalIdFactory: () => `${sessionID}-goal` });
        await helpers.writeGoalAtomic({ ...goal, lastEvidence: evidence }, { stateDir, maxEvidenceChars: TAIL_WINDOW_CHARS });
        const result = await helpers.maybeVerifyGoal(sessionID, { stateDir, verifierMode: 'heuristic' });
        answers[arm] = armAnswer(result);
      }
      answers.parity = armAnswer(core.verifyGoalHeuristic({ goal: { objective: row.objective }, transcriptText: row.raw_text }));
      results.push(answers);
    }
    return results;
  } finally {
    fs.rmSync(stateDir, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPORT
// ─────────────────────────────────────────────────────────────────────────────

// Report arms and the verdict and error keys in print order. Fixed orders keep
// two runs diffable line by line.
const REPORT_ARMS = ['heuristic', 'tail_window', 'parity'];
const REPORT_VERDICTS = ['met', 'not_met', 'blocked', 'unclear'];
const ERROR_KEYS = ['too_short', 'blocking', 'truncated', 'no_completion', 'weak_link', 'other'];

/**
 * Score one arm against the labeled rows.
 *
 * falseMet is a met verdict on a row the human did not label met; falseNotMet
 * is the mirror, a met label the arm did not answer met, where not_met,
 * blocked and unclear all count against the arm. rate divides falseNotMet by
 * labeledMet and stays zero on a set with no met labels.
 *
 * @param {object[]} rows - Labeled rows, each with a canonical label.
 * @param {object[]} results - Per-row arm answers; each entry holds one
 *   { verdict, category } answer per arm.
 * @param {string} arm - "heuristic", "tail_window" or "parity".
 * @returns {{table: object, falseMet: number, falseNotMet: number,
 *   labeledMet: number, rate: number, errors: object}} Per-arm counts.
 */
function summarizeArm(rows, results, arm) {
  const table = {};
  for (const verdict of REPORT_VERDICTS) {
    table[verdict] = { met: 0, not_met: 0, blocked: 0 };
  }
  const errors = { too_short: 0, blocking: 0, truncated: 0, no_completion: 0, weak_link: 0, other: 0 };
  let falseMet = 0;
  let falseNotMet = 0;
  let labeledMet = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const label = rows[index].label;
    const answer = results[index][arm];
    table[answer.verdict][label] += 1;
    if (answer.verdict === 'met' && label !== 'met') falseMet += 1;
    if (label !== 'met') continue;
    labeledMet += 1;
    if (answer.verdict === 'met') continue;
    falseNotMet += 1;
    errors[ERROR_KEYS.includes(answer.category) ? answer.category : 'other'] += 1;
  }

  return {
    table,
    falseMet,
    falseNotMet,
    labeledMet,
    rate: labeledMet === 0 ? 0 : falseNotMet / labeledMet,
    errors,
  };
}

/**
 * Render the report lines over a labeled set.
 *
 * The three arm blocks come first in fixed order, then the set-wide lines:
 * rows the clamping step mishandled, rows the wrapper held back, and the one
 * verdict-folding finding that the arm rows above rest on.
 *
 * @param {object[]} rows - Labeled rows.
 * @param {object[]} results - Per-row arm answers.
 * @returns {string[]} Report lines in print order.
 */
function reportLines(rows, results) {
  const lines = [];
  for (const arm of REPORT_ARMS) {
    const summary = summarizeArm(rows, results, arm);
    lines.push(`arm: ${arm}`);
    for (const verdict of REPORT_VERDICTS) {
      const cells = summary.table[verdict];
      lines.push(`table: verdict=${verdict} label_met=${cells.met} label_not_met=${cells.not_met} label_blocked=${cells.blocked}`);
    }
    lines.push(`two_class: arm=${arm} false_met=${summary.falseMet} false_not_met=${summary.falseNotMet} labeled_met=${summary.labeledMet} false_not_met_rate=${summary.rate.toFixed(2)}`);
    lines.push(`errors: arm=${arm} too_short=${summary.errors.too_short} blocking=${summary.errors.blocking} truncated=${summary.errors.truncated} no_completion=${summary.errors.no_completion} weak_link=${summary.errors.weak_link} other=${summary.errors.other}`);
  }

  let clampDefects = 0;
  let wrapperHeld = 0;
  for (let index = 0; index < rows.length; index += 1) {
    const heuristic = results[index].heuristic;
    const tailWindow = results[index].tail_window;
    if (heuristic.category === 'truncated' && tailWindow.category !== 'truncated') clampDefects += 1;
    if (heuristic.category === 'too_short' || heuristic.category === 'blocking') wrapperHeld += 1;
  }
  lines.push(`clamp_defects: ${clampDefects}`);
  lines.push(`wrapper: held=${wrapperHeld}`);
  lines.push('finding: goal-core answers not-met and unclear where the plugin answers not_met, so not-met maps to not_met and unclear keeps its own row');
  return lines;
}

/**
 * Render the stop and gate decision lines over a labeled set.
 *
 * The better arm is picked on false met first and then on the false not met
 * rate, and a tie stays on the heuristic arm. A stop means the better arm
 * kept false met at zero and the rate at or under 0.10, so no gate line
 * follows it; the gate lines otherwise count the met rows the tail window
 * missed that the wrapper rule did not hold.
 *
 * @param {object[]} rows - Labeled rows.
 * @param {object[]} results - Per-row arm answers.
 * @returns {string[]} Decision lines in print order.
 */
function decisionLines(rows, results) {
  const h = summarizeArm(rows, results, 'heuristic');
  const t = summarizeArm(rows, results, 'tail_window');
  const betterName = t.falseMet < h.falseMet || (t.falseMet === h.falseMet && t.rate < h.rate) ? 'tail_window' : 'heuristic';
  const better = betterName === 'tail_window' ? t : h;
  const lines = [`better: arm=${betterName} false_met=${better.falseMet} false_not_met_rate=${better.rate.toFixed(2)}`];

  if (better.falseMet === 0 && better.rate <= 0.10) {
    let clampDefects = 0;
    for (let index = 0; index < rows.length; index += 1) {
      const heuristic = results[index].heuristic;
      const tailWindow = results[index].tail_window;
      if (heuristic.category === 'truncated' && tailWindow.category !== 'truncated') clampDefects += 1;
    }
    lines.push('stop: no headroom');
    lines.push(`finding: clamp fix for the plugin and goal-core owners: clampText appends "..." and the truncation check then reads the cut evidence as truncated, clamp_defects=${clampDefects}`);
    return lines;
  }

  let reachable = 0;
  for (let index = 0; index < rows.length; index += 1) {
    const label = rows[index].label;
    const heuristic = results[index].heuristic;
    const tailWindow = results[index].tail_window;
    if (label !== 'met') continue;
    if (tailWindow.verdict === 'met') continue;
    if (heuristic.category === 'too_short' || heuristic.category === 'blocking') continue;
    reachable += 1;
  }
  if (reachable === 0) {
    lines.push('stop: no reachable rows');
    return lines;
  }
  lines.push(`gate: tail_window leaves ${reachable} false not_met rows outside the wrapper rule`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the scorer CLI.
 *
 * --set names the labeled JSONL set and is required; --out optionally writes
 * the report as zero-call-report.txt under a directory. Exit codes: 0 scored,
 * 1 the set has errors, 2 a usage or plugin-load failure.
 *
 * @param {string[]} argv - Arguments after the script path.
 * @returns {Promise<number>} The process exit code.
 */
async function main(argv) {
  let setFile = null;
  let outDir = null;
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--set') {
      setFile = argv[index + 1];
      index += 1;
    } else if (flag === '--out') {
      outDir = argv[index + 1];
      index += 1;
    } else {
      process.stderr.write(`[score-verifier-labeled-set] error: unknown flag ${flag}\n`);
      return 2;
    }
  }
  if (!setFile) {
    process.stderr.write('[score-verifier-labeled-set] error: --set <file> is required\n');
    return 2;
  }

  let text;
  try {
    text = fs.readFileSync(setFile, 'utf8');
  } catch {
    process.stderr.write(`[score-verifier-labeled-set] error: cannot read ${setFile}\n`);
    return 2;
  }

  const loaded = loadRows(text);
  if (loaded.errors.length > 0) {
    for (const message of loaded.errors) process.stderr.write(`[score-verifier-labeled-set] error: ${message}\n`);
    return 1;
  }

  const lines = [`scorer: rows=${loaded.total} labeled=${loaded.labeled.length} unlabeled=${loaded.unlabeled} claude=${loaded.sources.claude} pi=${loaded.sources.pi}`];
  if (loaded.labeled.length < MIN_ROWS) {
    lines.push(`stop: fewer than ${MIN_ROWS} rows`);
  } else {
    try {
      const results = await runArms(loaded.labeled);
      lines.push(...reportLines(loaded.labeled, results));
      lines.push(...decisionLines(loaded.labeled, results));
    } catch (error) {
      process.stderr.write(`[score-verifier-labeled-set] error: ${error.message}\n`);
      return error.code === 'PLUGIN_LOAD' ? 2 : 1;
    }
  }

  for (const line of lines) process.stdout.write(`${line}\n`);
  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'zero-call-report.txt'), `${lines.join('\n')}\n`);
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { normalizeLabel, normalizeVerdict, reasonCategory, loadRows, summarizeArm, reportLines, decisionLines, runArms, main };

if (require.main === module) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
