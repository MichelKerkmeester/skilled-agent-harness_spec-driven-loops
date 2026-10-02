#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Completion Claim Audit
// ───────────────────────────────────────────────────────────────────
// Scores the completion-claim detector against operator-labeled turns, with zero model calls by default.
// Only ids, counts and hashes leave the census; row text never reaches stdout or the report.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  accessSync,
  appendFileSync,
  constants,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, delimiter, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

/** Repository root six levels above this script; `--out` must resolve outside it. */
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..', '..', '..', '..', '..');

const require = createRequire(import.meta.url);
// Loaded from the sentinel itself so the census can never drift from the Stop hooks' own detector.
const { COMPLETION_CLAIM_PATTERN, detectCompletionClaim } = require('../../hooks/lib/completion-evidence-sentinel.cjs');

// The census scans the same trailing slice the detector does; both lengths must move together
// or a row can fire while holding no claim word in the slice.
export const TAIL_CHARS = 400;

/** Labeled rows needed before any arm can run; below this the run stops at the gate. */
export const LABEL_GATE = 30;

/** Labeled rows needed in each class, so the sign test reads both sides. */
export const CLASS_GATE = 5;

/** The Deem arm's keep threshold: a score at or above 0.5 is a yes call. */
export const YES_THRESHOLD = 0.5;

/** One Jev judgment takes three reruns, so a binary call always has a majority. */
export const JEV_RERUNS = 3;

/** The 10-point gain over the regex baseline that the keep rule requires. */
export const MARGIN_LINE = 'margin: 0.10';

/** Every keep-rule check in its order, restated for the report reader. */
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= M, then sign test p_win < 0.05, then for jev flips 10*F <= 3*M';

/** Why one keep needs five wins and no loss. */
export const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05';

/** The question put to every judged turn, fixed so every run answers the same one. */
export const QUESTION = 'Does this turn end by claiming the work is complete?';

/** Pinned Deem model name the health check accepts. */
export const DEEM_MODEL = 'deem-0.8-v1';

/** Deem noul p50 in milliseconds, from deem-local.md, used for the wall-time estimate. */
export const DEEM_P50_MS = 60.5;

/** Pinned jev version the gate accepts; another version would move the answers it gives. */
export const JEV_VERSION = 'jev 0.6.2';

/** The pinned version alone, for the record and verdict fields that name it without the binary. */
const JEV_VERSION_VALUE = JEV_VERSION.replace(/^jev /, '');

/** Bounds the health spawn; the CLI bounds its own health request at 2,000 ms. */
export const HEALTH_TIMEOUT_MS = 10000;

/** Bounds one judgment spawn; a call past this is unmeasured, not a crash. */
export const CALL_TIMEOUT_MS = 90000;

/** Wait before the one retry after a dropped connection, so a busy server is not hit twice at once. */
export const BACKOFF_MS = 2000;

/** The ten claim words in the detector pattern's own order, parsed from it so no second copy can drift. */
const CLAIM_WORDS = COMPLETION_CLAIM_PATTERN.source
  .replace(/^\\b\(/, '')
  .replace(/\)\\b$/, '')
  .split('|');

/** Usage line for an invocation that misses an input. */
export const USAGE = 'node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> [--labels <file>] [--deem] [--jev] [--out <dir>] [--accept-payload]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROWS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a JSONL file of turns: one row per turn with a non-empty string `id` and a string `raw_text`.
 * Blank lines are skipped so a trailing newline stays harmless.
 * @param {string} text File contents.
 * @returns {{ id: string, raw_text: string }[]} Rows in file order.
 * @throws {Error} `rows row <n>: ...` for the first line that is not JSON or misses a field.
 */
export function parseRows(text) {
  const rows = [];
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (line.trim() === '') return;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`rows row ${index + 1}: not JSON`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`rows row ${index + 1}: not a JSON object`);
    }
    if (typeof parsed.id !== 'string' || parsed.id === '') {
      throw new Error(`rows row ${index + 1}: id must be a non-empty string`);
    }
    if (typeof parsed.raw_text !== 'string') {
      throw new Error(`rows row ${index + 1}: raw_text must be a string`);
    }
    rows.push({ id: parsed.id, raw_text: parsed.raw_text });
  });
  return rows;
}

/**
 * The trailing slice the detector reads, and the one slice the census and the arms both scan.
 * @param {string} rawText Turn text.
 * @returns {string} The trimmed text, capped at its last {@link TAIL_CHARS} characters.
 */
export function detectTail(rawText) {
  return rawText.trim().slice(-TAIL_CHARS);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Counts fired turns and attributes each fire to the first claim word in its tail.
 * Reads the detector and its pattern from the sentinel, never a copy, so both agree by construction.
 * @param {{ id: string, raw_text: string }[]} rows Parsed rows.
 * @returns {{ rows: number, fires: number, words: Record<string, number>, firedIds: string[] }} Counts; `words` holds every claim word, zeros included.
 */
export function runCensus(rows) {
  const words = Object.fromEntries(CLAIM_WORDS.map((word) => [word, 0]));
  const firedIds = [];
  for (const row of rows) {
    if (!detectCompletionClaim(row.raw_text)) continue;
    firedIds.push(row.id);
    // The detector just matched this same slice, so the first alternative is the word to count.
    const match = COMPLETION_CLAIM_PATTERN.exec(detectTail(row.raw_text));
    words[match[1].toLowerCase()] += 1;
  }
  return { rows: rows.length, fires: firedIds.length, words, firedIds };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LABELS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a JSONL file of operator labels: one row `{ id, claim }` with `claim` exactly `yes` or `no`.
 * Blank lines are skipped as in the rows parser.
 * @param {string} text File contents.
 * @param {Set<string>} rowIds Ids the rows file holds; a label for any other id cannot be scored.
 * @returns {Map<string, 'yes'|'no'>} Label by row id, in file order.
 * @throws {Error} `labels row <n>: ...` for the first line that is not JSON, holds another claim value, or names an unknown id.
 */
export function parseLabels(text, rowIds) {
  const labels = new Map();
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (line.trim() === '') return;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`labels row ${index + 1}: not JSON`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`labels row ${index + 1}: not a JSON object`);
    }
    if (parsed.claim !== 'yes' && parsed.claim !== 'no') {
      throw new Error(`labels row ${index + 1}: claim must be yes or no, got ${JSON.stringify(parsed.claim)}`);
    }
    if (!rowIds.has(parsed.id)) {
      throw new Error(`labels row ${index + 1}: unknown id ${parsed.id}`);
    }
    labels.set(parsed.id, parsed.claim);
  });
  return labels;
}

/**
 * Lowercase hex SHA-256 of the UTF-8 text, so a label set is named by its content alone.
 * @param {string} value Text to hash.
 * @returns {string} 64 lowercase hex characters.
 */
export function sha256Hex(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Counts labeled rows by class; the gate needs a floor on each side.
 * @param {Map<string, 'yes'|'no'>} labels Label by row id.
 * @returns {{ yes: number, no: number }} Class counts.
 */
export function classCounts(labels) {
  const counts = { yes: 0, no: 0 };
  for (const claim of labels.values()) counts[claim] += 1;
  return counts;
}

/**
 * The claim word a tail holds first by position, pattern order breaking a tie. A silent
 * turn labeled a claim often holds no word at all, and then it is counted without one.
 * @param {string} tail Trailing slice of one turn's text.
 * @returns {string|null} Lowercase claim word, or null when the tail holds none.
 */
function firstClaimWord(tail) {
  const lower = tail.toLowerCase();
  let found = null;
  let foundAt = -1;
  for (const word of CLAIM_WORDS) {
    const at = lower.indexOf(word);
    if (at === -1) continue;
    if (found === null || at < foundAt) {
      found = word;
      foundAt = at;
    }
  }
  return found;
}

/**
 * Scores the regex against the operator's labels over the labeled rows alone: a false
 * fire is a fired turn labeled `no`, a missed claim is a silent turn labeled `yes`, and
 * `B` counts the rows where the two agree. Each error is attributed to the first claim
 * word its tail holds, so the by-word line reads the way the census counted that turn.
 * @param {Map<string, 'yes'|'no'>} labeled Label by row id.
 * @param {Map<string, { id: string, raw_text: string }>} rowsById Rows the labels name.
 * @returns {{ B: number, falseFires: number, missedClaims: number, byWord: { falseFires: Record<string, number>, missedClaims: Record<string, number> } }} Counts.
 */
export function regexErrors(labeled, rowsById) {
  const byWord = { falseFires: {}, missedClaims: {} };
  let falseFires = 0;
  let missedClaims = 0;
  for (const [id, claim] of labeled) {
    const row = rowsById.get(id);
    const tail = detectTail(row.raw_text);
    const fired = detectCompletionClaim(row.raw_text);
    if (fired && claim === 'no') {
      falseFires += 1;
      // A fired row carries the detector's own match, so this line names the census's word.
      const word = COMPLETION_CLAIM_PATTERN.exec(tail)[1].toLowerCase();
      byWord.falseFires[word] = (byWord.falseFires[word] ?? 0) + 1;
    } else if (!fired && claim === 'yes') {
      missedClaims += 1;
      const word = firstClaimWord(tail);
      if (word !== null) byWord.missedClaims[word] = (byWord.missedClaims[word] ?? 0) + 1;
    }
  }
  // Every labeled row either agrees, false-fires or is missed, so B falls out of the two counts.
  return { B: labeled.size - falseFires - missedClaims, falseFires, missedClaims, byWord };
}

/**
 * One by-word count list for a scoring line, in pattern order, or `none` when empty.
 * @param {Record<string, number>} counts Word-to-count map.
 * @returns {string} `word=count word=count`, or `none`.
 */
function byWordList(counts) {
  const parts = CLAIM_WORDS.filter((word) => counts[word] > 0).map((word) => `${word}=${counts[word]}`);
  return parts.length === 0 ? 'none' : parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The one line the label supply supports, first failed check deciding: the row floor,
 * then each class floor, then the regex headroom a 10-point gain needs. Only the
 * `planned` gate opens an arm.
 * @param {{ k: number, counts: { yes: number, no: number }, b: number }} input Labeled rows, class counts and correct regex calls.
 * @returns {{ line: string, gate: 'stop'|'no headroom'|'planned' }} Line to print and the gate that produced it.
 */
export function gateLine({ k, counts, b }) {
  if (k < LABEL_GATE) return { line: `stop: fewer than ${LABEL_GATE} labeled rows`, gate: 'stop' };
  if (counts.yes < CLASS_GATE) return { line: `stop: fewer than ${CLASS_GATE} labeled yes rows`, gate: 'stop' };
  if (counts.no < CLASS_GATE) return { line: `stop: fewer than ${CLASS_GATE} labeled no rows`, gate: 'stop' };
  // Above 90 percent regex accuracy a 10-point gain cannot fit, so no arm calls.
  if (10 * b > 9 * k) return { line: 'no headroom', gate: 'no headroom' };
  return { line: `planned calls: deem=${k} jev=${3 * k + 1}`, gate: 'planned' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. OUTPUT GUARD
// ─────────────────────────────────────────────────────────────────────────────

/** Fixed strings the census can print beyond this run's row ids and digests. */
const OUTPUT_LABELS = new Set(CLAIM_WORDS);

/** Lowercase hex digest shape; a hash field holding anything else is free text. */
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

/**
 * Every string nested in an object or array, keys excluded, in walk order.
 * @param {unknown} value Value to walk.
 * @returns {string[]} The nested strings.
 */
export function stringLeaves(value) {
  const leaves = [];
  const walk = (node) => {
    if (typeof node === 'string') {
      leaves.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === 'object' && node !== null) {
      for (const item of Object.values(node)) walk(item);
    }
  };
  walk(value);
  return leaves;
}

/**
 * Whether one output string falls outside the classes the census can account for:
 * fixed labels, this run's row ids, and lowercase hex digests.
 * @param {string} text String value from the run's output.
 * @param {Set<string>} ids Row ids the run read.
 * @returns {boolean} True when the string is free text.
 */
function isAllowedOutputString(text, ids) {
  return OUTPUT_LABELS.has(text) || ids.has(text) || SHA256_PATTERN.test(text);
}

/**
 * Whether any string value of the run's output (keys excluded) is free text, so the
 * census stops before printing or writing anything.
 * @param {unknown} output Complete output object.
 * @param {{ ids: Set<string> }} allowed This run's row ids.
 * @returns {boolean} True when a string value is not allowed.
 */
export function hasFreeText(output, { ids }) {
  return stringLeaves(output).some((text) => !isAllowedOutputString(text, ids));
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. OUTPUT DIRECTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The longest existing prefix of a path resolved through the filesystem, with
 * the missing tail kept as written. A symlinked parent can point a report
 * outside the repository while the written path still reads as inside it.
 * @param {string} inputPath Path to canonicalize.
 * @returns {string} The canonical path.
 */
function canonicalizeExistingPrefix(inputPath) {
  const missing = [];
  let current = resolve(inputPath);
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) break;
    missing.unshift(basename(current));
    current = parent;
  }
  return resolve(realpathSync(current), ...missing);
}

/**
 * Whether a target resolves to the root itself or a path below it.
 * @param {string} rootDir Root to test against.
 * @param {string} targetPath Path to test.
 * @returns {boolean} True when the target stays inside the root.
 */
function isPathInsideRoot(rootDir, targetPath) {
  const rel = relative(
    canonicalizeExistingPrefix(rootDir),
    canonicalizeExistingPrefix(targetPath),
  );
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/**
 * One JSON-line record per model call under outDir, so a killed arm's finished
 * calls stay readable. A missing or empty outDir keeps no records; the file is
 * created empty on the first append.
 * @param {string | undefined} outDir Directory that holds calls.jsonl.
 * @returns {{ append: (record: object) => void }} Append-only call log.
 */
export function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = join(outDir, 'calls.jsonl');
      if (!created) {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(filePath, '');
        created = true;
      }
      appendFileSync(filePath, `${JSON.stringify(record)}\n`);
    },
  };
}

/**
 * Parsed report.json written by an earlier run into the same out directory.
 * @param {string | undefined} outDir Directory that may hold report.json.
 * @returns {object | null} The parsed report, or null when outDir is empty,
 *   the file is missing, or the file does not parse.
 */
export function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. VERDICT
// ─────────────────────────────────────────────────────────────────────────────

// The keep rule is fixed before any model run, the counts stay integers and
// both tails are exact, so no rounding decides a verdict.

/**
 * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
 * by coefficient in BigInt, so no float comparison decides p < 0.05. No trials
 * give p 1.
 * @param {number} k Successes the tail starts at.
 * @param {number} n Trials.
 * @returns {{ num: bigint, den: bigint, p: number, below: boolean }} Exact numerator and denominator, the float value, and whether p is below 0.05.
 */
export function binomialTail(k, n) {
  if (n === 0) return { num: 1n, den: 1n, p: 1, below: false };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= k) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { num, den, p: Number(num) / Number(den), below: 20n * num < den };
}

/**
 * The call a rerun set names: a score at or above the threshold is `yes`, and
 * the call with the majority wins. The count is the call's votes, so reruns
 * short of it are flips.
 * @param {number[]} values One row's scores.
 * @returns {{ call: 'yes'|'no'|null, top: number }} Modal call and its count; null when no call has the majority.
 */
function modalCall(values) {
  let yes = 0;
  let no = 0;
  for (const value of values) (value >= YES_THRESHOLD ? (yes += 1) : (no += 1));
  if (yes > no && 2 * yes > values.length) return { call: 'yes', top: yes };
  if (no > yes && 2 * no > values.length) return { call: 'no', top: no };
  return { call: null, top: Math.max(yes, no) };
}

/**
 * First failed check decides, in this order: coverage, kill, margin, sign
 * test, flips on the jev backend alone. Every outcome carries both exact tails.
 * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts Column counts.
 * @returns {{ verdict: string, pWin: number, pLoss: number }} The verdict and both tails.
 */
export function decideVerdict({ backend, K, M, A, B, W, L, F }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', pWin: win.p, pLoss: loss.p };
  if (loss.below) return { verdict: 'kill', pWin: win.p, pLoss: loss.p };
  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', pWin: win.p, pLoss: loss.p };
  if (!win.below) return { verdict: 'stop (sign test)', pWin: win.p, pLoss: loss.p };
  if (backend === 'jev' && !(10 * F <= 3 * M)) return { verdict: 'stop (flips)', pWin: win.p, pLoss: loss.p };
  return { verdict: 'keep', pWin: win.p, pLoss: loss.p };
}

/**
 * @param {number} p Probability in [0, 1].
 * @returns {string} Four significant digits.
 */
export function formatP(p) {
  return p.toPrecision(4);
}

/**
 * One backend column's counts and verdict over the measured rows. A row is
 * measured only when every rerun holds a score in [0, 1]; the column's call
 * is `yes` at the threshold or above, the Jev row's call the modal one, and
 * every rerun short of the modal count counts as a flip. The regex's own call
 * is the mechanical baseline the margin is measured against.
 * @param {{ backend: string, K: number, labeled: Map<string, { claim: 'yes'|'no', fired: boolean }>, answers: Map<string, number | number[] | null> }} input Labels with the regex's call, and the backend's answers by row id.
 * @returns {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, verdict: string, pWin: number, pLoss: number }} Column counts and verdict.
 */
export function summarizeColumn({ backend, K, labeled, answers }) {
  const reruns = backend === 'jev' ? JEV_RERUNS : 1;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  for (const [id, entry] of labeled) {
    const raw = answers.get(id);
    const values = Array.isArray(raw) ? raw : [raw];
    if (values.length !== reruns) continue;
    if (!values.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1)) continue;
    M += 1;
    const { call, top } = modalCall(values);
    F += reruns - top;
    const baseline = entry.fired ? 'yes' : 'no';
    if (call === entry.claim) A += 1;
    if (baseline === entry.claim) B += 1;
    if (call === entry.claim && baseline !== entry.claim) W += 1;
    if (call !== entry.claim && baseline === entry.claim) L += 1;
  }
  const { verdict, pWin, pLoss } = decideVerdict({ backend, K, M, A, B, W, L, F });
  return { backend, K, M, A, B, W, L, F, verdict, pWin, pLoss };
}

/**
 * The one-line verdict with both exact tails, the label set hash and any
 * backend identity suffix.
 * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, pWin: number, pLoss: number }} summary Column summary.
 * @param {string} labelsSha Lowercase hex SHA-256 of the label file.
 * @param {string} [suffix] Appended when a non-empty string.
 * @returns {string} The verdict line.
 */
export function verdictLine(summary, labelsSha, suffix) {
  const { backend, verdict, K, M, A, B, W, L, F, pWin, pLoss } = summary;
  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
    + ` F=${backend === 'jev' ? F : 'n/a'} p_win=${formatP(pWin)} p_loss=${formatP(pLoss)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
  return line;
}

/**
 * Nearest-rank percentile; an empty list has no rank.
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number | null} The rank value rounded to whole milliseconds, or null for an empty list.
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. DEEM GATE
// ─────────────────────────────────────────────────────────────────────────────

// The gate runs only behind --deem: it reads the local model's health once, passes
// no key and never starts the server; a miss prints a skip line and leaves the census.

/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
const REPO_CLI_DEEM = join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs');

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
export function which(name, env) {
  for (const dir of (env.PATH ?? '').split(delimiter)) {
    if (dir.length === 0) continue;
    const candidate = join(dir, name);
    try {
      if (statSync(candidate).isFile()) {
        accessSync(candidate, constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string[]} Command and leading arguments for one call.
 */
export function deemCommand(env) {
  const onPath = which('cli-deem', env);
  if (onPath !== null) return [onPath];
  return [process.execPath, REPO_CLI_DEEM];
}

/**
 * One health check. An unreachable binary, a stub backend, or a wrong model is a
 * failed check the caller prints as a skip.
 * @param {string[]} cmd Command from deemCommand.
 * @param {Record<string, string | undefined>} env Environment for the call.
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }} Health or the failed check.
 */
export function readDeemHealth(cmd, env) {
  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: HEALTH_TIMEOUT_MS,
  });
  let errorText = (result.stderr ?? '').trim();
  try {
    errorText = JSON.parse(errorText).error;
  } catch {
    // Leave the trimmed stderr when it is not JSON.
  }

  if (result.error || result.status === 4) {
    return { ok: false, reason: 'not reachable', found: errorText };
  }
  if (result.status === 3) {
    let reason = 'bad health response';
    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
    return { ok: false, reason, found: errorText };
  }
  if (result.status === 0) {
    const stdoutText = (result.stdout ?? '').trim();
    let body;
    try {
      body = JSON.parse(stdoutText);
    } catch {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    const backend = body?.backend;
    if (typeof backend === 'string' && backend.includes('stub')) {
      return { ok: false, reason: 'stub backend', found: backend };
    }
    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
      return { ok: false, reason: 'bad health response', found: String(backend) };
    }
    const model = body?.model;
    if (model !== DEEM_MODEL) {
      return { ok: false, reason: 'model', found: String(model) };
    }
    const modelCommit = body?.model_commit;
    const sourceCommit = body?.source_commit;
    if (
      body?.ok !== true
      || typeof modelCommit !== 'string'
      || modelCommit === ''
      || typeof sourceCommit !== 'string'
      || sourceCommit === ''
    ) {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    return { ok: true, backend, model, modelCommit, sourceCommit };
  }
  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
}

/**
 * Prints the health line, or a skip line when the check fails.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx Line writer and environment.
 * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
 */
export function deemGate(ctx) {
  const cmd = deemCommand(ctx.env);
  const health = readDeemHealth(cmd, ctx.env);
  if (health.ok) {
    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
    return { passed: true, cmd, ...health };
  }
  const skipLine = `deem arm skipped: ${health.reason}`;
  ctx.out(skipLine);
  if (health.reason === 'model' || health.reason === 'bad health response') {
    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
  }
  return { passed: false, cmd, reason: skipLine };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. DEEM ARM
// ─────────────────────────────────────────────────────────────────────────────

// The arm runs only behind --deem and a passing gate: every row is judged
// locally, the question is fixed, and only ids, counts and hashes leave it.

/**
 * The noul score from one judgment call: the answer sits under `answers.answer`.
 * A body that does not parse, a missing noul, or a number outside [0, 1] is an
 * unmeasured call, not a crash.
 * @param {string} stdout Raw stdout of one call.
 * @returns {number | null} Score in [0, 1], or null when unmeasured.
 */
function parseNoul(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const noul = parsed?.answers?.answer?.noul;
  if (typeof noul !== 'number' || !Number.isFinite(noul) || noul < 0 || noul > 1) return null;
  return noul;
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is written then
 * closed because the CLI reads stdin to EOF and exits on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 * @param {string} cmd Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdin Text written to stdin, then closed.
 * @param {Record<string, string | undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
 * @returns {Promise<{ code: number | null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} Call outcome.
 */
export function spawnCall(cmd, args, stdin, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(cmd, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdin);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * One `noul` call per labeled row, with one calls.jsonl record per spawn. Exit
 * 4 gets one retry behind a fresh health check, because a dropped connection
 * is not a judgment. Exit 1 and unparseable or out-of-range answers leave the
 * row unmeasured and keep the run going; a stop prints the line and the rows
 * that finished, and leaves the column and verdict unprinted.
 * @param {{ labeled: Map<string, 'yes'|'no'>, rowsById: Map<string, { id: string, raw_text: string }>, labelsSha: string }} plan The labeled rows, the rows they name, and the label set hash.
 * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate Passing deemGate result.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number, callLog: { append: (record: object) => void }, stored: object | null }} ctx Line writer, environment, per-call timeout, the call log and an earlier run's report.
 * @returns {Promise<{ stopped: string, partialRows: number } | { column: object, requalify: string | null }>} The stop report, or the column summary with its line and the requalify line.
 */
export async function runDeemArm(plan, gate, ctx) {
  const K = plan.labeled.size;
  ctx.out(`deem: nothing leaves the machine; planned calls: ${K}; estimated wall time: ${(K * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the noul p50 from deem-local.md`);

  const labeled = new Map();
  for (const [id, claim] of plan.labeled) {
    const row = plan.rowsById.get(id);
    labeled.set(id, { claim, fired: detectCompletionClaim(row.raw_text), tail: detectTail(row.raw_text) });
  }

  const answers = new Map();
  const wallTimes = [];
  let finished = 0;

  /** One calls.jsonl record; a row still carries its id when the call failed. */
  function record(rowId, attempt, r, noul, status) {
    return {
      backend: 'deem',
      rowId,
      pass: 0,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      noul,
      status,
      modelId: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
    };
  }

  function stop(line) {
    ctx.out(line);
    ctx.out(`deem: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  for (const id of [...plan.labeled.keys()].sort()) {
    const entry = labeled.get(id);
    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', QUESTION];
    let attempt = 1;
    let r = await spawnCall(gate.cmd[0], callArgs, entry.tail, ctx.env, ctx.timeoutMs);
    wallTimes.push(r.wallMs);

    if (!r.timedOut && r.code === 4) {
      ctx.callLog.append(record(id, attempt, r, null, 'unmeasured'));
      const health = readDeemHealth(gate.cmd, ctx.env);
      if (!health.ok) return stop('deem arm stopped: server gone');
      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
        return stop('deem arm stopped: model commit changed mid-run');
      }
      attempt = 2;
      r = await spawnCall(gate.cmd[0], callArgs, entry.tail, ctx.env, ctx.timeoutMs);
      wallTimes.push(r.wallMs);
    }

    let noul = null;
    let status = 'unmeasured';
    let stopLine = null;
    if (r.timedOut) {
      status = 'unmeasured_timeout';
    } else if (r.code === 0) {
      noul = parseNoul(r.stdout);
      status = noul === null ? 'unmeasured' : 'measured';
    } else if (r.code === 2) {
      stopLine = 'deem arm stopped: usage error';
    } else if (r.code === 3) {
      stopLine = 'deem arm stopped: backend refused';
    } else if (r.code === 130) {
      stopLine = 'deem arm stopped: interrupted';
    }

    ctx.callLog.append(record(id, attempt, r, noul, status));
    if (stopLine !== null) return stop(stopLine);
    answers.set(id, noul);
    finished += 1;
  }

  const summary = summarizeColumn({ backend: 'deem', K, labeled, answers });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column deem: rows=${K} measured=${summary.M} unmeasured=${K - summary.M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  ctx.out('flips: n/a (commit pair)');
  const stored = ctx.stored?.columns?.deem;
  let requalify = null;
  if (stored && (stored.modelCommit !== gate.modelCommit || stored.sourceCommit !== gate.sourceCommit)) {
    requalify = 'requalify: model commit changed';
    ctx.out(requalify);
  }
  const line = verdictLine(summary, plan.labelsSha, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`);
  ctx.out(line);
  return {
    column: { ...summary, line, latency, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. JEV GATE
// ─────────────────────────────────────────────────────────────────────────────

// The gate runs only behind --jev: it resolves the version and the credential itself,
// reads no key and passes none, and a miss prints a skip line and leaves the census.

/**
 * Identity line, then the pinned version and a credential check. A miss prints a
 * skip line and leaves every census line already written as it was.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number }} ctx Line writer, environment and per-call timeout.
 * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }} True when the gate passed; a failed gate carries the skip line it printed.
 */
export function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider, reason: skipLine };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
  }
  return { passed: true, path, provider };
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. JEV ARM
// ─────────────────────────────────────────────────────────────────────────────

// The arm runs only behind --jev, an accepted payload and a passing gate: every row
// is judged three times, the row's call is the modal one, and only ids, counts and
// hashes leave it. The payload line warns what leaves the machine and what it costs.

/**
 * The noul score from one jev judgment call: the answer sits under `answers.answer`.
 * A body that does not parse, a missing noul, or a number outside [0, 1] is unmeasured.
 * @param {string} stdout Raw stdout of one call.
 * @returns {number | null} Score in [0, 1], or null when unmeasured.
 */
function parseJevNoul(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const noul = parsed?.answers?.answer?.noul;
  if (typeof noul !== 'number' || !Number.isFinite(noul) || noul < 0 || noul > 1) return null;
  return noul;
}

/**
 * One auth test, then three noul calls per labeled row with no answer cache, and one
 * calls.jsonl record per spawn. Exit 4 gets one retry after the backoff, because a
 * dropped connection is not a judgment. Exit 1 and unparseable or out-of-range answers
 * leave the row unmeasured and keep the run going; a stop prints the line and the rows
 * that finished, and leaves the column and verdict unprinted.
 * @param {{ labeled: Map<string, 'yes'|'no'>, rowsById: Map<string, { id: string, raw_text: string }>, labelsSha: string }} plan The labeled rows, the rows they name, and the label set hash.
 * @param {{ path: string, provider: string }} gate Passing jevGate result.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number, backoffMs: number, callLog: { append: (record: object) => void }, stored: object | null }} ctx Line writer, environment, per-call timeout, retry wait, the call log and an earlier run's report.
 * @returns {Promise<{ stopped: string, partialRows: number } | { column: object, requalify: string | null }>} The stop report, or the column summary with its line and the requalify line.
 */
export async function runJevArm(plan, gate, ctx) {
  const K = plan.labeled.size;
  let chars = 0;
  for (const id of plan.labeled.keys()) {
    chars += detectTail(plan.rowsById.get(id).raw_text).length + QUESTION.length;
  }
  chars *= JEV_RERUNS;
  ctx.out(`jev: payload: the operator's session text, secrets stripped by the operator; planned calls: ${JEV_RERUNS * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const labeled = new Map();
  for (const [id, claim] of plan.labeled) {
    const row = plan.rowsById.get(id);
    labeled.set(id, { claim, fired: detectCompletionClaim(row.raw_text), tail: detectTail(row.raw_text) });
  }

  const answers = new Map();
  const wallTimes = [];
  let finished = 0;
  let model = 'unknown';

  /** One calls.jsonl record; a row still carries its id when the call failed. */
  function record(rowId, pass, attempt, r, noul, status) {
    return {
      backend: 'jev',
      rowId,
      pass,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      noul,
      status,
      jevVersion: JEV_VERSION_VALUE,
      provider: gate.provider,
      model,
    };
  }

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
  wallTimes.push(auth.wallMs);
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') model = parsed.model;
  }
  ctx.callLog.append(record(null, null, 1, auth, null, auth.code === 0 ? 'measured' : 'unmeasured'));
  if (auth.code === 3) return stop('jev arm stopped: key rejected');
  if (auth.code === 130) return stop('jev arm stopped: interrupted');
  if (auth.code !== 0) return stop('jev arm stopped: auth test failed');
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  for (const id of [...plan.labeled.keys()].sort()) {
    const entry = labeled.get(id);
    const callArgs = ['noul', '--provider', gate.provider, '-q', QUESTION];
    const values = [];
    for (let pass = 0; pass < JEV_RERUNS; pass += 1) {
      let attempt = 1;
      let r = await spawnCall(gate.path, callArgs, entry.tail, ctx.env, ctx.timeoutMs);
      wallTimes.push(r.wallMs);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(id, pass, attempt, r, null, 'unmeasured'));
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        attempt = 2;
        r = await spawnCall(gate.path, callArgs, entry.tail, ctx.env, ctx.timeoutMs);
        wallTimes.push(r.wallMs);
      }

      let noul = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        noul = parseJevNoul(r.stdout);
        status = noul === null ? 'unmeasured' : 'measured';
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append(record(id, pass, attempt, r, noul, status));
      if (stopLine !== null) return stop(stopLine);
      values.push(noul);
    }
    answers.set(id, values);
    finished += 1;
  }

  const summary = summarizeColumn({ backend: 'jev', K, labeled, answers });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column jev: rows=${K} measured=${summary.M} unmeasured=${K - summary.M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  ctx.out(`flips: ${summary.F}`);
  const stored = ctx.stored?.columns?.jev;
  let requalify = null;
  if (stored && (stored.provider !== gate.provider || stored.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  const line = verdictLine(summary, plan.labelsSha, `jev_version=${JEV_VERSION_VALUE} provider=${gate.provider} model=${model}`);
  ctx.out(line);
  return {
    column: { ...summary, line, latency, jevVersion: JEV_VERSION_VALUE, provider: gate.provider, model },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the census end to end and returns the process exit code.
 * @param {string[]} argv Raw arguments after the script name.
 * @param {{ repoRoot?: string, out?: (line: string) => void, err?: (line: string) => void, env?: Record<string, string | undefined>, timeoutMs?: number, backoffMs?: number }} [deps] Repository root, line-writer seams, environment, per-call timeout and retry wait for tests.
 * @returns {Promise<number>} 0 when the census printed or the output guard voided it, 2 for a refused command line, unreadable rows or labels, or a report directory inside the repository.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;

  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        rows: { type: 'string' },
        labels: { type: 'string' },
        deem: { type: 'boolean' },
        jev: { type: 'boolean' },
        out: { type: 'string' },
        'accept-payload': { type: 'boolean' },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  if (typeof values.rows !== 'string' || values.rows === '') {
    err('no rows named');
    return 2;
  }

  const outDir = typeof values.out === 'string' && values.out !== '' ? values.out : undefined;
  // Both --out rules run before any input is read and before any call, so a
  // refused command line cannot create a report directory or spawn a backend.
  if ((values.deem === true || values.jev === true) && outDir === undefined) {
    err(values.deem === true
      ? '--deem needs --out <dir> so every call is recorded'
      : '--jev needs --out <dir> so every call is recorded');
    return 2;
  }
  if (outDir !== undefined && isPathInsideRoot(repoRoot, outDir)) {
    err('refused: report directory inside the repository');
    return 2;
  }

  let text;
  try {
    text = readFileSync(values.rows, 'utf8');
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  let rows;
  try {
    rows = parseRows(text);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const rowsById = new Map(rows.map((row) => [row.id, row]));

  // Labels are read before any line prints, so a bad label file refuses the run whole.
  let labels = null;
  let labelsInfo = null;
  if (values.labels !== undefined) {
    let labelsText;
    try {
      labelsText = readFileSync(values.labels, 'utf8');
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
    try {
      labels = parseLabels(labelsText, new Set(rowsById.keys()));
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
    labelsInfo = { rows: labels.size, sha256: sha256Hex(labelsText) };
  }

  const census = runCensus(rows);
  // The census is built before any line prints, so it is checked whole first: a string
  // it cannot account for means row text reached it.
  if (hasFreeText(census, { ids: new Set(rows.map((row) => row.id)) })) {
    out('stop: census void (free text in output)');
    return 0;
  }
  out(`rows: ${census.rows} fires: ${census.fires}`);
  out(`words: ${CLAIM_WORDS.map((word) => `${word}=${census.words[word]}`).join(' ')}`);

  const k = labels === null ? 0 : labels.size;
  const counts = labels === null ? { yes: 0, no: 0 } : classCounts(labels);
  const errors = regexErrors(labels ?? new Map(), rowsById);
  out(labelsInfo === null ? 'labels: none' : `labels: rows=${labelsInfo.rows} sha256=${labelsInfo.sha256}`);
  out(`labeled: ${k} (yes ${counts.yes}, no ${counts.no})`);
  out(k === 0
    ? 'regex accuracy: n/a (no labels)'
    : `regex accuracy: ${errors.B} of ${k} = ${(errors.B / k).toFixed(4)}`);
  out(`regex false fires: ${errors.falseFires} (by word: ${byWordList(errors.byWord.falseFires)})`);
  out(`regex missed claims: ${errors.missedClaims} (by word: ${byWordList(errors.byWord.missedClaims)})`);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out(POWER_LINE);
  const gate = gateLine({ k, counts, b: errors.B });
  out(gate.line);

  // Both arms share one call log and one stored report, so a run that opens both
  // appends to a single calls.jsonl instead of truncating the first arm's records.
  const callLog = createCallLog(outDir);
  const stored = readStoredReport(outDir);

  // Jev goes first, then Deem: each arm runs only on its own switch and checks, and a
  // failed check prints its own skip line without starting the other backend in its
  // place. The accepted payload is what lets the operator's own rows leave the machine.
  let jevResult;
  if (values.jev === true) {
    const check = jevGate({ out, env, timeoutMs });
    if (!check.passed) {
      jevResult = { skipped: check.reason };
    } else if (values['accept-payload'] !== true) {
      const line = 'jev arm skipped: payload not accepted';
      out(line);
      jevResult = { skipped: line };
    } else if (gate.gate !== 'planned') {
      const line = `jev arm skipped: ${gate.gate === 'stop' ? 'label gate' : 'no headroom'}`;
      out(line);
      jevResult = { skipped: line };
    } else {
      jevResult = await runJevArm(
        { labeled: labels, rowsById, labelsSha: labelsInfo.sha256 },
        check,
        { out, env, timeoutMs, backoffMs, callLog, stored },
      );
    }
  }

  // The Deem arm opens only behind --deem: the health check runs first, then the
  // label gate; a failed check prints its own skip line and leaves every census
  // line already written as it was. A stopped arm reports its finished rows and
  // prints no column or verdict.
  let deemResult;
  if (values.deem === true) {
    const check = deemGate({ out, env });
    if (!check.passed) {
      deemResult = { skipped: check.reason };
    } else if (gate.gate !== 'planned') {
      const line = `deem arm skipped: ${gate.gate === 'stop' ? 'label gate' : 'no headroom'}`;
      out(line);
      deemResult = { skipped: line };
    } else {
      deemResult = await runDeemArm(
        { labeled: labels, rowsById, labelsSha: labelsInfo.sha256 },
        check,
        { out, env, timeoutMs, callLog, stored },
      );
    }
  }

  // The report is the run's record under --out: the census and regex counts, the
  // gate that decided, and one entry per arm, so a later run over the same
  // directory can compare what it measured against what the stored columns held.
  if (outDir !== undefined && (values.jev === true || values.deem === true)) {
    const report = {
      rowsSha256: sha256Hex(text),
      labelsSha256: labelsInfo === null ? 'none' : labelsInfo.sha256,
      K: k,
      census: { rows: census.rows, fires: census.fires, words: census.words },
      regex: {
        B: errors.B,
        falseFires: errors.falseFires,
        missedClaims: errors.missedClaims,
        byWord: errors.byWord,
      },
      gate: gate.gate,
      margin: MARGIN_LINE,
      keepRule: KEEP_RULE_LINE,
      columns: {},
      stopped: {},
      skipped: {},
      requalify: {},
    };
    for (const [backend, arm] of [['jev', jevResult], ['deem', deemResult]]) {
      if (arm === undefined) continue;
      if (arm.skipped !== undefined) report.skipped[backend] = arm.skipped;
      if (arm.stopped !== undefined) report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      if (arm.column !== undefined) {
        report.columns[backend] = arm.column;
        report.requalify[backend] = arm.requalify ?? null;
      }
    }
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  return 0;
}

// Node sets import.meta.url from the real path while argv keeps the typed path, so a
// script started through a symlink matches only once both sides are resolved.
function isEntryPoint() {
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  process.exitCode = await main(process.argv.slice(2));
}
