#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Reply Judge Agreement
// ───────────────────────────────────────────────────────────────────
// Measures offline whether a Jev score per rubric dimension agrees
// with the operator's grades of masked replies more often than the mechanical
// scores of score.mjs. The default run makes no model call and writes no file.
// The script holds and reads no credential.
//
// Usage:
//   node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--out <dir>] [--accept-payload]
//
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, refused before any call.
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Repository root five levels above this benchmark script. */
export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..');

/** Mechanical scorer beside this script, the arm a judge arm is measured against. */
export const SCORE_SCRIPT = path.join(SCRIPT_DIR, 'score.mjs');

/** Rubric the judge scores by, the same file the mechanical scorer applies. */
export const RUBRIC_PATH = path.join(SCRIPT_DIR, 'rubric.json');

/** Case ids every replies dir is scored over, the same file the mechanical scorer reads. */
export const CASES_PATH = path.join(SCRIPT_DIR, 'cases.json');

/** Levels a rubric dimension can take, weakest first. */
export const LEVELS = Object.freeze(['absent', 'partly met', 'fully met']);

/** Graded distinct replies the operator must supply before any model call. */
export const LABEL_GATE = 20;

// ───────────────────────────────────────────────────────────────────
// 2. CENSUS
// ───────────────────────────────────────────────────────────────────

/**
 * Lowercase hex SHA-256 of the UTF-8 text.
 * @param {string} text
 * @returns {string}
 */
export function sha256Hex(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Bare reply body under the `Reply <label>:` marker, or null when the file
 * carries no marker.
 * @param {string} text
 * @returns {string|null}
 */
export function readMaskedReply(text) {
  const match = /^Reply [AB]:[ \t]*\r?$/m.exec(text);
  if (match === null) return null;
  return text.slice(match.index + match[0].length).trim();
}

/**
 * Absolute paths of the markdown files directly in dir, sorted by file name.
 * @param {string} dir
 * @returns {string[]}
 */
export function listMarkdown(dir) {
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch {
    throw new Error(`not a directory: ${dir}`);
  }
  if (!stat.isDirectory()) throw new Error(`not a directory: ${dir}`);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()
    .map((name) => path.resolve(dir, name));
}

/**
 * Masks, replies, and the SHA match between them for one census pass.
 * @param {string[]} maskedDirs
 * @param {string[]} repliesDirs
 * @returns {{ maskedFiles: Array<{ file: string, text: string, sha: string }>, replyBySha: Map<string, { file: string, caseId: string }>, masked: number, distinct: number, matched: number, unmatched: number }}
 */
export function buildCensus(maskedDirs, repliesDirs) {
  const replyBySha = new Map();
  for (const dir of repliesDirs) {
    for (const file of listMarkdown(dir)) {
      const sha = sha256Hex(fs.readFileSync(file, 'utf8').trim());
      if (!replyBySha.has(sha)) replyBySha.set(sha, { file, caseId: path.basename(file, '.md') });
    }
  }

  const maskedFiles = [];
  for (const dir of maskedDirs) {
    for (const file of listMarkdown(dir)) {
      const text = fs.readFileSync(file, 'utf8');
      const reply = readMaskedReply(text);
      if (reply === null) throw new Error(`not a masked reply: ${file}`);
      maskedFiles.push({ file, text, sha: sha256Hex(reply) });
    }
  }

  const distinctShas = new Set(maskedFiles.map((entry) => entry.sha));
  const matched = [...distinctShas].filter((sha) => replyBySha.has(sha)).length;
  return {
    maskedFiles,
    replyBySha,
    masked: maskedFiles.length,
    distinct: distinctShas.size,
    matched,
    unmatched: distinctShas.size - matched,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. MECHANICAL BASELINE
// ───────────────────────────────────────────────────────────────────

// A score of 0 is absent, 1 is fully met and anything strictly between is partly met;
// the mapping is fixed before any model run.
/**
 * Rubric level of a mechanical score, or null when the value is no score.
 * @param {number} value
 * @returns {string|null}
 */
export function levelOfScore(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value === 0) return 'absent';
  if (value === 1) return 'fully met';
  if (value > 0 && value < 1) return 'partly met';
  return null;
}

/**
 * Mechanical dimension scores per absolute reply file path, one score.mjs run
 * per replies dir; an empty or missing reply file is stood in for so the rest
 * of its dir still scores and that reply keeps no entry; a run that fails
 * throws with the scorer's stderr.
 * @param {string[]} repliesDirs
 * @returns {Map<string, Record<string, number>>}
 */
export function runBaseline(repliesDirs) {
  const caseIds = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8')).map((c) => c.id);
  const scoresByReply = new Map();
  for (const dir of repliesDirs) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-'));
    try {
      fs.mkdirSync(path.join(tmp, 'replies'));
      const standIns = new Set();
      for (const id of caseIds) {
        const file = path.join(dir, `${id}.md`);
        const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        // A stand-in keeps score.mjs from refusing the directory, and its row is
        // dropped below, so no reply is ever scored without its own text.
        if (text.trim() !== '') {
          fs.writeFileSync(path.join(tmp, 'replies', `${id}.md`), text);
        } else {
          fs.writeFileSync(path.join(tmp, 'replies', `${id}.md`), 'placeholder for an empty or missing reply\n');
          standIns.add(id);
        }
        const meta = path.join(dir, `${id}.meta.json`);
        if (fs.existsSync(meta)) fs.copyFileSync(meta, path.join(tmp, 'replies', `${id}.meta.json`));
      }
      // No --prompts is passed, so the condition value only labels the output.
      const result = spawnSync(
        process.execPath,
        [SCORE_SCRIPT, '--condition', 'after', '--replies', path.join(tmp, 'replies'), '--out', path.join(tmp, 'scores.json')],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 },
      );
      if (result.status !== 0) {
        throw new Error(`score.mjs failed on ${dir}: ${String(result.stderr || result.error?.message || '').trim().slice(0, 300)}`);
      }
      const results = JSON.parse(fs.readFileSync(path.join(tmp, 'scores.json'), 'utf8'));
      for (const row of [...results.rows, ...results.noOps]) {
        const id = path.basename(row.replyFile, '.md');
        if (standIns.has(id)) continue;
        scoresByReply.set(path.resolve(dir, `${id}.md`), row.dimensionScores);
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
  return scoresByReply;
}

/**
 * Level of each named dimension, read from one reply's mechanical scores.
 * @param {Record<string, number>} dimensionScores
 * @param {string[]} dimensionIds
 * @returns {Record<string, string|null>}
 */
export function baselineLevels(dimensionScores, dimensionIds) {
  const levels = {};
  for (const id of dimensionIds) levels[id] = levelOfScore(dimensionScores[id]);
  return levels;
}

// ───────────────────────────────────────────────────────────────────
// 4. LABELS
// ───────────────────────────────────────────────────────────────────

/**
 * Rubric dimensions in file order, each with the guidance a judge reads.
 * @param {string} [rubricPath]
 * @returns {Array<{ id: string, judgeGuidance: string }>}
 */
export function loadRubric(rubricPath = RUBRIC_PATH) {
  let text;
  try {
    text = fs.readFileSync(rubricPath, 'utf8');
  } catch (error) {
    throw new Error(`${rubricPath}: cannot read: ${error.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${rubricPath}: not JSON`);
  }
  const dimensions = parsed?.dimensions;
  if (!Array.isArray(dimensions) || dimensions.length === 0) throw new Error(`${rubricPath}: dimensions must be a non-empty array`);
  const rubric = [];
  const seen = new Set();
  for (const dimension of dimensions) {
    const { id, judgeGuidance } = dimension ?? {};
    if (typeof id !== 'string' || id.trim() === '') throw new Error(`${rubricPath}: every dimension needs a non-empty id`);
    if (seen.has(id)) throw new Error(`${rubricPath}: duplicate dimension ${id}`);
    if (typeof judgeGuidance !== 'string' || judgeGuidance.trim() === '') throw new Error(`${rubricPath}: dimension ${id} needs a non-empty judgeGuidance`);
    seen.add(id);
    rubric.push({ id, judgeGuidance });
  }
  return rubric;
}

/**
 * Operator grades from the labels JSONL, each row numbered by its 1-based line.
 * @param {string} text
 * @param {string[]} dimensionIds
 * @returns {Array<{ row: number, masked: string, grades: Record<string, string> }>}
 */
export function parseLabels(text, dimensionIds) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '') continue;
    const n = index + 1;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      throw new Error(`labels row ${n}: not JSON`);
    }
    if (record === null || typeof record !== 'object' || Array.isArray(record)) throw new Error(`labels row ${n}: not JSON`);
    if (typeof record.masked !== 'string' || record.masked.trim() === '') throw new Error(`labels row ${n}: masked must be a non-empty path`);
    const grades = record.grades;
    if (grades === null || typeof grades !== 'object' || Array.isArray(grades)) throw new Error(`labels row ${n}: grades must be an object`);
    for (const id of dimensionIds) {
      if (!Object.hasOwn(grades, id)) throw new Error(`labels row ${n}: missing dimension ${id}`);
    }
    for (const key of Object.keys(grades)) {
      if (!dimensionIds.includes(key)) throw new Error(`labels row ${n}: unknown dimension ${key}`);
    }
    for (const id of dimensionIds) {
      if (!LEVELS.includes(grades[id])) throw new Error(`labels row ${n}: ${id} must be absent, partly met or fully met`);
    }
    rows.push({ row: n, masked: record.masked, grades });
  }
  return rows;
}

// The operator grades masked files, and two masked files can carry the same reply,
// so the join goes through the reply text's SHA.
/**
 * One entry per graded reply SHA, plus the count of graded rows whose source reply
 * changed after masking and the first grade disagreement between two rows on one reply.
 * An entry holds the winning labels row, the census masked file it names and that file's text.
 * @param {Array<{ row: number, masked: string, grades: Record<string, string> }>} rows
 * @param {{ maskedFiles: Array<{ file: string, text: string, sha: string }>, replyBySha: Map<string, { file: string, caseId: string }> }} census
 * @param {string} repoRoot
 * @returns {{ labeled: Map<string, { grades: Record<string, string>, maskedFile: string, text: string, row: { row: number, masked: string, grades: Record<string, string> } }>, unmatchedRows: number, conflict: string|null }}
 */
export function joinLabels(rows, census, repoRoot) {
  const labeled = new Map();
  let unmatchedRows = 0;
  for (const row of rows) {
    const target = path.resolve(repoRoot, row.masked);
    const maskedFile = census.maskedFiles.find((entry) => path.resolve(entry.file) === target);
    if (maskedFile === undefined) throw new Error(`labels row ${row.row}: masked file is not in the census: ${row.masked}`);
    if (!census.replyBySha.has(maskedFile.sha)) {
      unmatchedRows += 1;
      continue;
    }
    const first = labeled.get(maskedFile.sha)?.row;
    if (first === undefined) {
      labeled.set(maskedFile.sha, { grades: row.grades, maskedFile: maskedFile.file, text: maskedFile.text, row });
      continue;
    }
    if (Object.keys(first.grades).some((id) => first.grades[id] !== row.grades[id])) {
      return { labeled, unmatchedRows, conflict: `labels rows ${first.row} and ${row.row} grade the same reply differently` };
    }
  }
  return { labeled, unmatchedRows, conflict: null };
}

// ───────────────────────────────────────────────────────────────────
// 5. SUMMARY
// ───────────────────────────────────────────────────────────────────

/** The 10-point gain over the baseline that the keep rule requires. */
export const MARGIN_LINE = 'margin: 0.10';

/** Every keep-rule check in its order, restated for the report reader. */
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= 7*M, then sign test p_win < 0.05, then for jev flips 10*F <= 21*M';

/** Why one keep needs five wins and no loss. */
export const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05';

/**
 * SHA-256 of the question set a judge run was built from, so two runs can be
 * told apart by rubric text alone.
 * @param {Array<{ id: string, judgeGuidance: string }>} dimensions
 * @returns {string}
 */
export function questionSetSha(dimensions) {
  return sha256Hex(JSON.stringify({ questions: dimensions.map((d) => [d.id, d.judgeGuidance]), levels: LEVELS }));
}

/**
 * Per-dimension agreement between the operator's grades and the mechanical
 * levels, with the totals the headroom rule reads.
 * @param {Map<string, { grades: Record<string, string> }>} labeled
 * @param {Map<string, Record<string, string|null>>} baseline
 * @param {string[]} dimensionIds
 * @returns {{ cells: number, agree: number, perDimension: Record<string, { agree: number, cells: number }> }}
 */
export function agreementCounts(labeled, baseline, dimensionIds) {
  const perDimension = {};
  for (const id of dimensionIds) perDimension[id] = { agree: 0, cells: 0 };
  for (const [sha, entry] of labeled) {
    const levels = baseline.get(sha);
    for (const id of dimensionIds) {
      perDimension[id].cells += 1;
      if (levels[id] === entry.grades[id]) perDimension[id].agree += 1;
    }
  }
  let cells = 0;
  let agree = 0;
  for (const id of dimensionIds) {
    cells += perDimension[id].cells;
    agree += perDimension[id].agree;
  }
  return { cells, agree, perDimension };
}

/**
 * Report lines, the gate the label supply supports, and the agreement counts.
 * @param {{ census: { masked: number, distinct: number, matched: number, unmatched: number }, dimensionIds: string[], questionsSha: string, baseline: Map<string, Record<string, string|null>>, labelsInfo: { rows: number, sha256: string, unmatchedRows: number, noBaselineRows: number }|null, labeled: Map<string, { grades: Record<string, string> }>, noBaseline: number }} input
 * @returns {{ lines: string[], gate: 'stop'|'no headroom'|'planned', agreement: { cells: number, agree: number, perDimension: Record<string, { agree: number, cells: number }> } }}
 */
export function summaryLines({ census, dimensionIds, questionsSha, baseline, labelsInfo, labeled, noBaseline = 0 }) {
  const levelCounts = { absent: 0, 'partly met': 0, 'fully met': 0 };
  for (const levels of baseline.values()) {
    for (const level of Object.values(levels)) {
      if (level !== null) levelCounts[level] += 1;
    }
  }
  const k = labeled.size;
  const d = dimensionIds.length;
  const agreement = agreementCounts(labeled, baseline, dimensionIds);
  const lines = [
    `masked: ${census.masked}`,
    `distinct: ${census.distinct}`,
    `matched: ${census.matched}`,
    `unmatched: ${census.unmatched}`,
    `no baseline: ${noBaseline}`,
    `questions sha256: ${questionsSha}`,
    'baseline: score.mjs dimension scores, 0 = absent, 1 = fully met, between = partly met',
    `baseline levels: absent=${levelCounts.absent} partly met=${levelCounts['partly met']} fully met=${levelCounts['fully met']}`,
    labelsInfo === null ? 'labels: none' : `labels: rows=${labelsInfo.rows} sha256=${labelsInfo.sha256} unmatched=${labelsInfo.unmatchedRows} no_baseline=${labelsInfo.noBaselineRows ?? 0}`,
    `labeled: ${k}`,
  ];
  if (k === 0) {
    lines.push('baseline agreement: n/a');
  } else {
    lines.push(`baseline agreement: ${agreement.agree}/${agreement.cells} = ${(agreement.agree / agreement.cells).toFixed(4)}`);
    for (const id of dimensionIds) lines.push(`baseline agreement ${id}: ${agreement.perDimension[id].agree}/${agreement.perDimension[id].cells}`);
  }
  lines.push(MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE);
  // Above 90 percent baseline agreement a 10-point gain cannot fit, so no arm calls.
  if (k < LABEL_GATE) return { lines: [...lines, `stop: fewer than ${LABEL_GATE} labeled replies`], gate: 'stop', agreement };
  if (10 * agreement.agree > 9 * agreement.cells) return { lines: [...lines, 'no headroom'], gate: 'no headroom', agreement };
  return { lines: [...lines, `planned calls: jev=${3 * d * k + 1}`], gate: 'planned', agreement };
}

// ───────────────────────────────────────────────────────────────────
// 6. VERDICT
// ───────────────────────────────────────────────────────────────────

// The keep rule is fixed before any model run, counts stay integers and both
// tails are exact, so no rounding decides a verdict.

/**
 * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
 * by coefficient in BigInt. The threshold test is exact too: 20 * num < 2^n is
 * p < 0.05 with no float comparison. No trials give p 1.
 * @param {number} k Successes the tail starts at.
 * @param {number} n Trials.
 * @returns {{ p: number, below: boolean }}
 */
export function binomialTail(k, n) {
  if (n === 0) return { p: 1, below: false };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= k) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { p: Number(num) / Number(den), below: 20n * num < den };
}

/**
 * The level more than half the reruns name, with its count. One rerun is its
 * own level; three different levels name no winner and keep the top count at
 * 1, the unstable case.
 * @param {string[]} levels Levels one dimension took across the reruns.
 * @returns {{ level: string|null, top: number }}
 */
export function modalLevel(levels) {
  if (levels.length === 1) return { level: levels[0], top: 1 };
  const counts = new Map();
  for (const level of levels) counts.set(level, (counts.get(level) ?? 0) + 1);
  for (const [level, count] of counts) {
    if (2 * count > levels.length) return { level, top: count };
  }
  return { level: null, top: 1 };
}

/**
 * First failed check decides, in this order: coverage, kill, margin, sign
 * test, flips. Every outcome carries both exact tails.
 * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts
 * @returns {{ verdict: string, pWin: number, pLoss: number }}
 */
export function decideVerdict({ backend, K, M, A, B, W, L, F }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', pWin: win.p, pLoss: loss.p };
  if (loss.below) return { verdict: 'kill', pWin: win.p, pLoss: loss.p };
  if (!(10 * (A - B) >= 7 * M)) return { verdict: 'stop (margin)', pWin: win.p, pLoss: loss.p };
  if (!win.below) return { verdict: 'stop (sign test)', pWin: win.p, pLoss: loss.p };
  if (backend === 'jev' && !(10 * F <= 21 * M)) return { verdict: 'stop (flips)', pWin: win.p, pLoss: loss.p };
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
 * One backend column's counts and verdict. A reply is measured only when
 * every dimension holds exactly `reruns` levels and none is null; every other
 * reply stays unmeasured. A dimension whose reruns name no level is unstable
 * and counts as a miss, and the votes a level lacks add to the flip count.
 * @param {{ backend: string, labeled: Map<string, { grades: Record<string, string> }>, baseline: Map<string, Record<string, string|null>>, answers: Map<string, Record<string, Array<string|null>>>, dimensionIds: string[], reruns: number }} input
 * @returns {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, perDimension: Record<string, { column: number, baseline: number, cells: number }>, verdict: string, pWin: number, pLoss: number }}
 */
export function summarizeColumn({ backend, labeled, baseline, answers, dimensionIds, reruns }) {
  const K = labeled.size;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let unstable = 0;
  const perDimension = {};
  for (const id of dimensionIds) perDimension[id] = { column: 0, baseline: 0, cells: 0 };
  for (const sha of [...labeled.keys()].sort()) {
    const grades = labeled.get(sha).grades;
    const levels = answers.get(sha);
    const measured = dimensionIds.every((id) => Array.isArray(levels?.[id])
      && levels[id].length === reruns
      && levels[id].every((level) => level !== null));
    if (!measured) continue;
    M += 1;
    let column = 0;
    let base = 0;
    for (const id of dimensionIds) {
      const { level, top } = modalLevel(levels[id]);
      F += reruns - top;
      if (level === null) unstable += 1;
      perDimension[id].cells += 1;
      if (level === grades[id]) {
        column += 1;
        perDimension[id].column += 1;
      }
      if (baseline.get(sha)[id] === grades[id]) {
        base += 1;
        perDimension[id].baseline += 1;
      }
    }
    A += column;
    B += base;
    if (column > base) W += 1;
    if (column < base) L += 1;
  }
  const { verdict, pWin, pLoss } = decideVerdict({ backend, K, M, A, B, W, L, F });
  return { backend, K, M, A, B, W, L, F, unstable, perDimension, verdict, pWin, pLoss };
}

/**
 * The one-line verdict with both exact tails and the labels SHA.
 * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, pWin: number, pLoss: number }} summary
 * @param {string} labelsSha
 * @param {string} [suffix] Appended when a non-empty string.
 * @returns {string}
 */
export function verdictLine(summary, labelsSha, suffix) {
  const { backend, verdict, K, M, A, B, W, L, F, pWin, pLoss } = summary;
  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
    + ` F=${backend === 'jev' ? F : 'n/a'} p_win=${formatP(pWin)} p_loss=${formatP(pLoss)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
  return line;
}

// The per-dimension table is reported for the reader and never decides a verdict;
// the keep rule reads the column totals.
/**
 * One line per dimension with both hit counts over the measured cells.
 * @param {{ backend: string, perDimension: Record<string, { column: number, baseline: number, cells: number }> }} summary
 * @param {string[]} dimensionIds
 * @returns {string[]}
 */
export function dimensionLines(summary, dimensionIds) {
  return dimensionIds.map((id) => {
    const { column, baseline, cells } = summary.perDimension[id];
    return `dimension ${summary.backend} ${id}: column=${column}/${cells} baseline=${baseline}/${cells}`;
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. CALL HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Nearest-rank percentile. Empty lists have no rank.
 *
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number | null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF and exits 2 on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdinText Text written to stdin, then closed.
 * @param {Record<string, string | undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
 * @returns {Promise<{
 *   code: number | null,
 *   stdout: string,
 *   stderr: string,
 *   wallMs: number,
 *   timedOut: boolean
 * }>}
 */
export function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
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
    child.stdin.end(stdinText);

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
 * One JSON-line record per model call under outDir. A missing or empty outDir
 * keeps no records, so nothing is created. The file is created empty on the
 * first append, and one line per call keeps a killed arm's earlier records
 * readable.
 *
 * @param {string | undefined} outDir Directory that holds calls.jsonl.
 * @returns {{ append: (record: object) => void }} Append-only call log.
 */
export function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(filePath, '');
        created = true;
      }
      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
    },
  };
}

/**
 * Level position from one score answer. A backend may return a fractional
 * position, so it rounds to the nearest level, and a value outside 0 to 2
 * or a body that does not parse is an unmeasured call, not a crash.
 *
 * @param {string} stdout Raw stdout of one score call.
 * @returns {0 | 1 | 2 | null} Level position, or null when unmeasured.
 */
export function parseScoreAnswer(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const score = parsed?.answers?.answer?.score;
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 2) return null;
  return Math.round(score);
}

// ───────────────────────────────────────────────────────────────────
// 8. JEV ARM
// ───────────────────────────────────────────────────────────────────

// The gate runs only behind --jev, reads no key and passes none, because
// jev resolves its own credential.

/** Pinned jev version the gate accepts. */
export const JEV_VERSION = 'jev 0.6.2';

/**
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 *
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number
 * }} ctx Line writer, environment and per-call timeout.
 * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed.
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

/**
 * Git tracking class of the masked replies. An untracked masked file may hold
 * text never meant to leave this machine, so Jev needs --accept-payload for it.
 * @param {Array<{ file: string }>} maskedFiles
 * @returns {'untracked masked replies' | 'committed masked replies'}
 */
export function payloadClass(maskedFiles) {
  const trackedByDir = new Map();
  for (const entry of maskedFiles) {
    const dir = path.dirname(entry.file);
    if (trackedByDir.has(dir)) continue;
    const result = spawnSync('git', ['-C', dir, 'ls-files', '-z', '--', '.'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 10000,
    });
    trackedByDir.set(dir, result.status === 0 ? new Set(result.stdout.split('\0').filter(Boolean)) : new Set());
  }
  for (const entry of maskedFiles) {
    if (!trackedByDir.get(path.dirname(entry.file)).has(path.basename(entry.file))) return 'untracked masked replies';
  }
  return 'committed masked replies';
}

/**
 * One auth test, then three score calls per labeled reply and rubric dimension,
 * one per rerun, with one calls.jsonl record per spawn. Exit 4 gets one retry
 * after the backoff, because a dropped connection is not a judgment. A stop
 * prints the line and the replies that finished, and leaves the column and
 * verdict unprinted.
 *
 * @param {{
 *   labeled: Map<string, { grades: Record<string, string>, text: string }>,
 *   baseline: Map<string, Record<string, string | null>>,
 *   dimensions: Array<{ id: string, judgeGuidance: string }>,
 *   labelsSha: string,
 *   payload: string
 * }} plan Labeled replies, the mechanical baseline, the rubric, the labels SHA
 *   and the payload class.
 * @param {{ path: string, provider: string }} gate Passing jevGate result.
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   backoffMs: number,
 *   callLog: { append: (record: object) => void },
 *   stored: object | null
 * }} ctx Line writer, environment, per-call timeout, retry wait, the call log
 *   and an earlier run's report.
 * @returns {Promise<
 *   { stopped: string, partialReplies: number }
 *   | {
 *     column: {
 *       backend: string, K: number, M: number, A: number, B: number, W: number, L: number,
 *       F: number, unstable: number,
 *       perDimension: Record<string, { column: number, baseline: number, cells: number }>,
 *       verdict: string, pWin: number, pLoss: number, line: string,
 *       latency: { p50: number | null, p95: number | null },
 *       jevVersion: string, provider: string, model: string
 *     },
 *     requalify: string | null
 *   }
 * >}
 */
export async function runJevArm(plan, gate, ctx) {
  const reruns = 3;
  const dimensionIds = plan.dimensions.map((dimension) => dimension.id);
  const K = plan.labeled.size;
  let chars = 0;
  for (const entry of plan.labeled.values()) {
    for (const dimension of plan.dimensions) {
      chars += entry.text.length + dimension.judgeGuidance.length + LEVELS.join('').length;
    }
  }
  chars *= reruns;
  ctx.out(`jev: payload: ${plan.payload}; planned calls: ${reruns * dimensionIds.length * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const wallTimes = [];
  let finished = 0;

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial replies=${finished}`);
    return { stopped: line, partialReplies: finished };
  }

  const auth = await spawnCall(
    gate.path,
    ['auth', 'test', '--provider', gate.provider],
    '',
    ctx.env,
    ctx.timeoutMs,
  );
  wallTimes.push(auth.wallMs);
  let model = 'unknown';
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') model = parsed.model;
  }
  ctx.callLog.append({
    backend: 'jev',
    replySha: null,
    dimension: null,
    rerun: null,
    attempt: 1,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    position: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion: '0.6.2',
    provider: gate.provider,
    model,
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();

  /**
   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
   * judgment, so its position stays empty and its status is unmeasured.
   */
  function record(sha, dimension, rerun, attempt, r, position, status) {
    return {
      backend: 'jev',
      replySha: sha.slice(0, 12),
      dimension: dimension.id,
      rerun,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      position,
      status,
      jevVersion: '0.6.2',
      provider: gate.provider,
      model,
    };
  }

  for (const sha of [...plan.labeled.keys()].sort()) {
    const entry = plan.labeled.get(sha);
    const levels = {};
    for (const dimension of plan.dimensions) {
      const callArgs = ['score', '--provider', gate.provider, '-q', dimension.judgeGuidance, '-l', LEVELS[0], '-l', LEVELS[1], '-l', LEVELS[2]];
      const rerunLevels = [];
      for (let rerun = 0; rerun < reruns; rerun += 1) {
        let attempt = 1;
        let r = await spawnCall(gate.path, callArgs, entry.text, ctx.env, ctx.timeoutMs);
        wallTimes.push(r.wallMs);

        if (!r.timedOut && r.code === 4) {
          ctx.callLog.append(record(sha, dimension, rerun, attempt, r, null, 'unmeasured'));
          await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
          attempt = 2;
          r = await spawnCall(gate.path, callArgs, entry.text, ctx.env, ctx.timeoutMs);
          wallTimes.push(r.wallMs);
        }

        let position = null;
        let status = 'unmeasured';
        let stopLine = null;
        if (r.timedOut) {
          status = 'unmeasured_timeout';
        } else if (r.code === 0) {
          position = parseScoreAnswer(r.stdout);
          status = position === null ? 'unmeasured' : 'measured';
        } else if (r.code === 2) {
          stopLine = 'jev arm stopped: usage error';
        } else if (r.code === 3) {
          stopLine = 'jev arm stopped: key rejected';
        } else if (r.code === 130) {
          stopLine = 'jev arm stopped: interrupted';
        }

        ctx.callLog.append(record(sha, dimension, rerun, attempt, r, position, status));
        if (stopLine !== null) return stop(stopLine);
        rerunLevels.push(position === null ? null : LEVELS[position]);
      }
      levels[dimension.id] = rerunLevels;
    }
    answers.set(sha, levels);
    finished += 1;
  }

  const summary = summarizeColumn({ backend: 'jev', labeled: plan.labeled, baseline: plan.baseline, answers, dimensionIds, reruns });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column jev: replies=${K} measured=${summary.M} unmeasured=${K - summary.M} unstable=${summary.unstable} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  for (const line of dimensionLines(summary, dimensionIds)) ctx.out(line);
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  const line = verdictLine(summary, plan.labelsSha, `jev_version=0.6.2 provider=${gate.provider} model=${model}`);
  ctx.out(line);

  return {
    column: { ...summary, line, latency, jevVersion: '0.6.2', provider: gate.provider, model },
    requalify,
  };
}

// ───────────────────────────────────────────────────────────────────
// 9. ENTRY POINT
// ───────────────────────────────────────────────────────────────────

/** Usage line printed when an invocation misses an input. */
export const USAGE = 'usage: node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--out <dir>] [--accept-payload]';

/**
 * Parsed report.json written by an earlier run into the same out directory.
 *
 * @param {string | undefined} outDir Directory that may hold report.json.
 * @returns {object | null} The parsed report, or null when outDir is empty,
 *   the file is missing, or the file does not parse.
 */
export function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * The report.json body. An arm with no result is left out of every map; a
 * skipped arm records its line, a stopped arm its line and the replies that
 * finished, and a column arm its counts plus the requalify flag.
 *
 * @param {{
 *   census: { masked: number, distinct: number, matched: number, unmatched: number },
 *   questionsSha: string,
 *   labelsSha: string,
 *   K: number,
 *   agreement: { agree: number, cells: number },
 *   jev: object | undefined,
 * }} input Census counts, the two SHAs, the labeled count, the baseline agreement and one result per arm.
 * @returns {object} The report.json body.
 */
export function buildReport({ census, questionsSha, labelsSha, K, agreement, jev }) {
  const report = {
    census: { masked: census.masked, distinct: census.distinct, matched: census.matched, unmatched: census.unmatched },
    questionsSha256: questionsSha,
    labelsSha256: labelsSha,
    K,
    baselineAgreement: { agree: agreement.agree, cells: agreement.cells },
    keepRule: KEEP_RULE_LINE,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };
  for (const [backend, arm] of [['jev', jev]]) {
    if (arm === undefined) continue;
    if (arm.skipped !== undefined) report.skipped[backend] = arm.skipped;
    if (arm.stopped !== undefined) report.stopped[backend] = { line: arm.stopped, partialReplies: arm.partialReplies };
    if (arm.column !== undefined) {
      report.columns[backend] = arm.column;
      report.requalify[backend] = arm.requalify ?? null;
    }
  }
  return report;
}

/**
 * Prints the zero-call census report. The default run writes no file and
 * spawns no model binary, so its stdout is the same on every run.
 * @param {string[]} argv - Arguments after the script path.
 * @param {Object} [deps] - Input, writer and judge arm replacements.
 * @param {string} [deps.repoRoot] - Repository root. Default REPO_ROOT.
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
 * @param {Record<string, string | undefined>} [deps.env] - Judge arm environment. Default process.env.
 * @param {number} [deps.timeoutMs] - Judge arm call timeout. Default 90000.
 * @param {number} [deps.backoffMs] - Judge arm retry wait. Default 2000.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[judge-agreement] ${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? 90000;
  const backoffMs = deps.backoffMs ?? 2000;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        masked: { type: 'string', multiple: true },
        replies: { type: 'string', multiple: true },
        labels: { type: 'string' },
        jev: { type: 'boolean' },
        out: { type: 'string' },
        'accept-payload': { type: 'boolean' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values } = parsed;

  const masked = values.masked ?? [];
  const replies = values.replies ?? [];
  if (masked.length === 0 || replies.length === 0) {
    err(USAGE);
    return 2;
  }
  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    err('--jev needs --out <dir> so every call is recorded');
    return 2;
  }

  let dimensions;
  let ids;
  let census;
  let scores;
  let labelsText = null;
  let rows;
  let joined;
  try {
    dimensions = loadRubric();
    ids = dimensions.map((dimension) => dimension.id);
    census = buildCensus(masked, replies);
    scores = runBaseline(replies);
    labelsText = typeof values.labels === 'string' ? fs.readFileSync(values.labels, 'utf8') : null;
    rows = labelsText === null ? [] : parseLabels(labelsText, ids);
    joined = joinLabels(rows, census, repoRoot);
  } catch (error) {
    err(error.message);
    return 2;
  }

  if (joined.conflict !== null) {
    out('stop: label conflict');
    err(joined.conflict);
    return 2;
  }

  const baseline = new Map();
  let noBaseline = 0;
  for (const sha of new Set(census.maskedFiles.map((entry) => entry.sha))) {
    const reply = census.replyBySha.get(sha);
    if (reply === undefined) continue;
    const levels = scores.get(path.resolve(reply.file));
    if (levels === undefined) {
      noBaseline += 1;
      continue;
    }
    baseline.set(sha, baselineLevels(levels, ids));
  }

  const labeled = new Map();
  let noBaselineRows = 0;
  for (const [sha, entry] of joined.labeled) {
    if (!baseline.has(sha)) {
      noBaselineRows += 1;
      continue;
    }
    labeled.set(sha, entry);
  }

  const labelsInfo = labelsText === null
    ? null
    : { rows: rows.length, sha256: sha256Hex(labelsText), unmatchedRows: joined.unmatchedRows, noBaselineRows };
  const labelsSha = labelsInfo === null ? 'none' : labelsInfo.sha256;
  const summary = summaryLines({
    census,
    dimensionIds: ids,
    questionsSha: questionSetSha(dimensions),
    baseline,
    labelsInfo,
    labeled,
    noBaseline,
  });
  for (const line of summary.lines) out(line);

  const outDir = values.out;
  let callLog = null;
  let stored = null;
  if (values.jev === true) {
    callLog = createCallLog(outDir);
    stored = readStoredReport(outDir);
  }

  // The Jev arm runs only behind its switch and checks.
  let jevResult;
  if (values.jev === true) {
    const check = jevGate({ out, env, timeoutMs });
    if (!check.passed) {
      jevResult = { skipped: check.reason };
    } else {
      const payload = payloadClass(census.maskedFiles);
      if (payload === 'untracked masked replies' && values['accept-payload'] !== true) {
        out('jev arm skipped: payload not accepted');
        jevResult = { skipped: 'jev arm skipped: payload not accepted' };
      } else if (summary.gate !== 'planned') {
        const line = `jev arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
        out(line);
        jevResult = { skipped: line };
      } else {
        jevResult = await runJevArm({ labeled, baseline, dimensions, labelsSha, payload }, check, { out, env, timeoutMs, backoffMs, callLog, stored });
      }
    }
  }

  if (values.jev === true) {
    const report = buildReport({
      census,
      questionsSha: questionSetSha(dimensions),
      labelsSha,
      K: labeled.size,
      agreement: summary.agreement,
      jev: jevResult,
    });
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  return 0;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = await main(process.argv.slice(2));
}
