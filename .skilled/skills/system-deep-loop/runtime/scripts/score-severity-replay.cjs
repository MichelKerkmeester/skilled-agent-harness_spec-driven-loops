#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Severity Replay Scoring
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Measure offline whether a Jev severity choice separates real P0
 * review findings from false ones better than the recorded severity. The
 * default run makes no model call and writes no file, and the script holds
 * and reads no credential.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The one severity question every arm asks; both columns ask exactly this.
const QUESTION_SEVERITY = 'Which severity does this review finding deserve?';
// The one funnel question beside a column; it reports and never decides.
const QUESTION_FUNNEL = 'Does the cited evidence show the defect this finding claims?';
// The four keys an arm picks from, in the first of the three call orders; the
// descriptions are the severity table's wording.
const OPTIONS = [
  { key: 'P0', description: 'Correctness failures, security vulnerabilities, spec contradictions' },
  { key: 'P1', description: 'Degraded behavior, incomplete implementation, missing validation' },
  { key: 'P2', description: 'Style, naming, minor improvements, documentation gaps' },
  { key: 'not_a_finding', description: 'The cited evidence does not show a defect' },
];
// The five rejected-P0 phrases the census counts in review iteration files.
const PHRASES = [
  'downgraded from P0',
  'from P0 to P1',
  'from P0 to P2',
  'retracted from P0',
  'P0 was retracted',
];
// The labeled-negative floor below which no arm opens.
const LABEL_GATE = 20;
// The number of option orders every row is called in.
const ORDERS = 3;
// The one jev client version the gate accepts.
const JEV_VERSION = 'jev 0.6.2';
// Every measured call is bounded so one hung spawn cannot hang the run.
const CALL_TIMEOUT_MS = 90000;
// The single backoff retry a transient jev failure gets.
const BACKOFF_MS = 2000;
// The margin the keep rule requires between a column and the baseline.
const MARGIN_LINE = 'margin: 0.10';
// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C';
// The power note fixed as one line: the five-win floor behind a keep.
const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
// The usage line printed whenever the run cannot start.
const USAGE = 'usage: score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--out <dir>]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one git command and return its raw result instead of throwing, so the
 * caller owns the failure decision. The tracked-file list runs past the 1 MiB
 * default output bound, so the buffer is raised.
 *
 * @param {string[]} args - Arguments after `git`
 * @param {Record<string, string | undefined>} [env] - Child environment; defaults to this process
 * @returns {{ status: number | null, stdout: string, stderr: string }} Exit status and captured output
 */
function runGit(args, env = process.env) {
  const result = spawnSync('git', args, {
    cwd: process.cwd(),
    env,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

/**
 * Resolve the repository root git reports for the current directory.
 *
 * @param {Function} git - Git runner returning { status, stdout, stderr }
 * @returns {string} Absolute repository root
 * @throws {Error} When the directory is not inside a git repository
 */
function repoRoot(git) {
  const result = git(['rev-parse', '--show-toplevel']);
  const root = result.stdout.trim();
  if (result.status !== 0 || root === '') {
    throw new Error('not a git repository');
  }
  return root;
}

/**
 * List every path git tracks under a repository root.
 *
 * @param {Function} git - Git runner returning { status, stdout, stderr }
 * @param {string} root - Repository root the listing reads from
 * @returns {string[]} Repo-relative tracked paths
 * @throws {Error} When the git listing fails
 */
function listTrackedFiles(git, root) {
  const result = git(['-C', root, 'ls-files', '-z']);
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr.trim()}`);
  }
  return result.stdout.split('\0').filter((entry) => entry !== '');
}

/**
 * Read every tracked review registry into a path-keyed map. Only files named
 * `deep-review-findings-registry.json` are registries, and one that cannot be
 * read or parsed stops the census rather than silently shrinking it.
 *
 * @param {string} root - Repository root the paths are relative to
 * @param {string[]} files - Repo-relative tracked paths
 * @returns {Map<string, object>} Registry path -> parsed registry
 * @throws {Error} When a registry file cannot be read or parsed
 */
function loadRegistries(root, files) {
  const registries = new Map();
  for (const file of files) {
    if (path.basename(file) !== 'deep-review-findings-registry.json') continue;
    let registry;
    try {
      registry = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    } catch {
      throw new Error(`cannot read registry ${file}`);
    }
    if (registry === null || typeof registry !== 'object' || Array.isArray(registry)) {
      throw new Error(`cannot read registry ${file}`);
    }
    registries.set(file, registry);
  }
  return registries;
}

/**
 * The stable identity of one finding row: its registry path and finding id.
 *
 * @param {string} registry - Repo-relative registry path
 * @param {string} findingId - Finding id from the registry
 * @returns {string} Row key shared by labels, answers and the call log
 */
function rowKey(registry, findingId) {
  return `${registry}#${findingId}`;
}

/**
 * The P0 rows of every registry, in registry and finding order. Both the open
 * and resolved lists count, a row repeated in one registry is kept once at its
 * first occurrence, and the id is `findingId ?? id`, since older registries
 * name it either way.
 *
 * @param {Map<string, object>} registries - Registry path -> parsed registry
 * @returns {Array<{ registry: string, findingId: string, title: string,
 *   dimension: string, evidenceRefs: string[], recommendation: string }>} Deduped P0 rows
 */
function p0RowsOf(registries) {
  const rows = [];
  const seen = new Set();
  for (const [registry, document] of registries) {
    const open = Array.isArray(document.openFindings) ? document.openFindings : [];
    const resolved = Array.isArray(document.resolvedFindings) ? document.resolvedFindings : [];
    for (const finding of [...open, ...resolved]) {
      if (finding === null || typeof finding !== 'object' || finding.severity !== 'P0') continue;
      const findingId = finding.findingId ?? finding.id;
      const key = rowKey(registry, findingId);
      if (seen.has(key)) continue;
      seen.add(key);
      const refs = finding.evidenceRefs ?? finding.evidence;
      rows.push({
        registry,
        findingId,
        title: typeof finding.title === 'string' ? finding.title : '',
        dimension: typeof finding.dimension === 'string' ? finding.dimension : '',
        evidenceRefs: Array.isArray(refs) ? refs : typeof refs === 'string' && refs !== '' ? [refs] : [],
        recommendation: typeof finding.recommendation === 'string' ? finding.recommendation : '',
      });
    }
  }
  return rows;
}

/**
 * Census the loaded registries: registry count, findings by severity, the
 * transition matrix, the deduped P0 rows and how those rows cluster by
 * registry.
 *
 * @param {Map<string, object>} registries - Registry path -> parsed registry
 * @returns {{
 *   registries: number,
 *   findings: number,
 *   bySeverity: { P0: number, P1: number, P2: number, other: number },
 *   transitions: Array<{ from: string | null, to: string | null, count: number }>,
 *   p0Rows: Array<object>,
 *   singleP0: number,
 *   multiP0: number
 * }} Census counts; transitions hold one entry per from/to pair, sorted by the
 *   printed `from` then `to`
 */
function censusFindings(registries) {
  const bySeverity = { P0: 0, P1: 0, P2: 0, other: 0 };
  const pairs = new Map();
  let findings = 0;
  for (const document of registries.values()) {
    const open = Array.isArray(document.openFindings) ? document.openFindings : [];
    const resolved = Array.isArray(document.resolvedFindings) ? document.resolvedFindings : [];
    for (const finding of [...open, ...resolved]) {
      if (finding === null || typeof finding !== 'object') continue;
      findings += 1;
      if (finding.severity === 'P0' || finding.severity === 'P1' || finding.severity === 'P2') {
        bySeverity[finding.severity] += 1;
      } else {
        bySeverity.other += 1;
      }
      const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
      for (const transition of transitions) {
        if (transition === null || typeof transition !== 'object') continue;
        const from = transition.from ?? null;
        const to = transition.to ?? null;
        const key = `${from ?? 'none'} -> ${to ?? 'none'}`;
        const pair = pairs.get(key) ?? { from, to, count: 0 };
        pair.count += 1;
        pairs.set(key, pair);
      }
    }
  }
  const p0Rows = p0RowsOf(registries);
  const perRegistry = new Map();
  for (const row of p0Rows) {
    perRegistry.set(row.registry, (perRegistry.get(row.registry) ?? 0) + 1);
  }
  let singleP0 = 0;
  let multiP0 = 0;
  for (const count of perRegistry.values()) {
    if (count === 1) singleP0 += 1;
    else multiP0 += 1;
  }
  const transitions = [...pairs.values()].sort((left, right) => {
    const leftFrom = left.from ?? 'none';
    const rightFrom = right.from ?? 'none';
    if (leftFrom !== rightFrom) return leftFrom < rightFrom ? -1 : 1;
    const leftTo = left.to ?? 'none';
    const rightTo = right.to ?? 'none';
    return leftTo < rightTo ? -1 : leftTo > rightTo ? 1 : 0;
  });
  return { registries: registries.size, findings, bySeverity, transitions, p0Rows, singleP0, multiP0 };
}

/**
 * Count how many tracked review iteration files hold each phrase. A file
 * counts once per phrase, and only files under a review `iterations` folder
 * named `iteration-*.md` are read.
 *
 * @param {string} root - Repository root the paths are relative to
 * @param {string[]} files - Repo-relative tracked paths
 * @param {string[]} phrases - Phrases to count, in print order
 * @returns {{ files: number, hits: number[] }} Iteration file count and one hit count per phrase
 * @throws {Error} When an iteration file cannot be read
 */
function countPhrases(root, files, phrases) {
  const iterationFiles = files.filter((file) => file.includes('/review/')
    && file.includes('/iterations/')
    && /^iteration-.*\.md$/.test(path.basename(file)));
  const hits = phrases.map(() => 0);
  for (const file of iterationFiles) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (let index = 0; index < phrases.length; index += 1) {
      if (text.includes(phrases[index])) hits[index] += 1;
    }
  }
  return { files: iterationFiles.length, hits };
}

/**
 * The census block's printed lines, in order: registry count, findings by
 * severity, one line per transition pair, P0 rows and their registry split,
 * the phrase counts, and the label need that ends the census.
 *
 * @param {object} census - Result from censusFindings
 * @param {{ files: number, hits: number[] }} phrases - Result from countPhrases
 * @returns {string[]} Printed census lines
 */
function censusLines(census, phrases) {
  const lines = [
    `registries: ${census.registries}`,
    `findings: ${census.findings} (P0 ${census.bySeverity.P0}, P1 ${census.bySeverity.P1}, P2 ${census.bySeverity.P2}, other ${census.bySeverity.other})`,
  ];
  for (const transition of census.transitions) {
    lines.push(`transitions: ${transition.from ?? 'none'} -> ${transition.to ?? 'none'} ${transition.count}`);
  }
  lines.push(`p0 rows: ${census.p0Rows.length} in ${census.singleP0 + census.multiP0} registries (one ${census.singleP0}, two or more ${census.multiP0})`);
  const counted = PHRASES.map((phrase, index) => `"${phrase}" ${phrases.hits[index] ?? 0}`);
  lines.push(`phrases: ${phrases.files} review iteration files; ${counted.join('; ')}`);
  lines.push(`labels needed: ${LABEL_GATE} P0 negatives among ${census.p0Rows.length} P0 rows`);
  return lines;
}

/**
 * The text a severity call reads for one row: its title, dimension, evidence
 * refs and recommendation.
 * The finding id never enters it, because an id begins with its severity,
 * the very thing the call is meant to judge.
 *
 * @param {{ title: string, dimension: string, evidenceRefs: string[],
 *   recommendation: string }} row - Row from p0RowsOf
 * @returns {string} Row state handed to the model
 */
function buildRowState(row) {
  const sections = [];
  if (row.title !== '') sections.push(`Title: ${row.title}`);
  if (row.dimension !== '') sections.push(`Dimension: ${row.dimension}`);
  if (row.evidenceRefs.length > 0) sections.push(`Evidence refs:\n${row.evidenceRefs.join('\n')}`);
  if (row.recommendation !== '') sections.push(`Recommendation: ${row.recommendation}`);
  return sections.join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LABELS AND GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The label sheet's lines: one compact JSON object per P0 row, with the
 * registry, finding id, title, dimension and evidence refs the operator reads
 * while labeling, and an empty label to fill in. The finding id belongs here
 * because the sheet is the operator's own file and never model input.
 *
 * @param {Array<{ registry: string, findingId: string, title: string,
 *   dimension: string, evidenceRefs: string[] }>} rows - Rows from p0RowsOf
 * @returns {string[]} One JSON line per row, in input order
 */
function buildLabelSheetLines(rows) {
  return rows.map((row) => JSON.stringify({
    registry: row.registry,
    finding_id: row.findingId,
    title: row.title,
    dimension: row.dimension,
    evidence_refs: row.evidenceRefs,
    label: '',
  }));
}

/**
 * Write the label sheet and create any missing parent directory. A target
 * that resolves inside the repository root is refused before anything is
 * created: the labels are the operator's gold, and the sheet must stay
 * outside the tree it is meant to judge.
 *
 * @param {string} target - Destination path for the sheet
 * @param {string[]} lines - Lines from buildLabelSheetLines
 * @param {string} root - Repository root the target must stay outside of
 * @returns {number} Rows written
 * @throws {Error} When the target resolves inside the repository root
 */
function writeLabelSheet(target, lines, root) {
  const resolved = path.resolve(target);
  const boundary = path.resolve(root);
  if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
    throw new Error('refusing to write the label sheet inside the repository');
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const body = lines.length === 0 ? '' : `${lines.join('\n')}\n`;
  fs.writeFileSync(resolved, body, 'utf8');
  return lines.length;
}

/**
 * Parse the operator's filled sheet into a row-keyed map. An empty label is
 * kept as `''` so the caller can count it as dropped, while any value outside
 * the four gold classes stops the run: a typo must shrink nothing quietly.
 *
 * @param {string} text - Filled sheet contents, one JSON object per line
 * @returns {Map<string, '' | 'real' | 'P1' | 'P2' | 'not_a_finding'>} Row key -> label
 * @throws {Error} When a row is not JSON, names no registry or finding id,
 *   carries an unknown label, or repeats a row
 */
function parseLabels(text) {
  const labels = new Map();
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const row = index + 1;
    if (lines[index].trim() === '') continue;
    let parsed;
    try {
      parsed = JSON.parse(lines[index]);
    } catch {
      throw new Error(`labels row ${row}: not JSON`);
    }
    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const registry = isPlainObject ? parsed.registry : undefined;
    const findingId = isPlainObject ? parsed.finding_id : undefined;
    if (typeof registry !== 'string' || registry.length === 0) {
      throw new Error(`labels row ${row}: registry must be a repo-relative path`);
    }
    if (typeof findingId !== 'string' || findingId.length === 0) {
      throw new Error(`labels row ${row}: finding_id must be a finding id`);
    }
    const value = parsed.label;
    if (value !== '' && value !== 'real' && value !== 'P1' && value !== 'P2' && value !== 'not_a_finding') {
      throw new Error(`labels row ${row}: label must be "", real, P1, P2 or not_a_finding, got ${JSON.stringify(value)}`);
    }
    const key = rowKey(registry, findingId);
    if (labels.has(key)) throw new Error(`labels row ${row}: duplicate row ${key}`);
    labels.set(key, value);
  }
  return labels;
}

/**
 * The label gate's state and the one line it prints. Fewer labeled negatives
 * than the floor keeps every arm closed, and a baseline already right on more
 * than nine rows in ten leaves no headroom for a column to show a gain.
 *
 * @param {number} K - Labeled rows
 * @param {number} negatives - Rows labeled other than real
 * @param {number} realRight - Rows labeled real
 * @returns {{ state: 'label' | 'headroom' | 'open', line: string }} Gate state and printed line
 */
function gateLine(K, negatives, realRight) {
  if (negatives < LABEL_GATE) {
    return { state: 'label', line: `stop: fewer than ${LABEL_GATE} labeled P0 negatives` };
  }
  if (10 * realRight > 9 * K) {
    return { state: 'headroom', line: 'no headroom' };
  }
  return { state: 'open', line: `gate: open K=${K} negatives=${negatives}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KEEP RULE AND COLUMN
// ─────────────────────────────────────────────────────────────────────────────

// Counts stay integers and the tails are exact (a BigInt sum over 2^trials),
// so no rounding decides a verdict.
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
  for (let index = 0; index <= trials; index += 1) {
    if (index > 0) coefficient = (coefficient * BigInt(trials - index + 1)) / BigInt(index);
    if (index >= successes) num += coefficient;
  }
  const den = 1n << BigInt(trials);
  return { num, den, p: Number(num) / Number(den) };
}

/**
 * The key most of a row's orders named. A key is modal only from two orders
 * up, so three different keys leave the row without a modal pick and mark it
 * unstable rather than quietly choosing one of them.
 *
 * @param {Array<{ pick: string | null }>} answers - One entry per call order
 * @returns {{ pick: string | null, top: number }} Modal key and how many orders
 *   named it, both empty when no key reached two orders
 */
function modalPick(answers) {
  const counts = new Map();
  for (const answer of answers) {
    const key = answer?.pick;
    if (typeof key !== 'string' || key === '') continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let pick = null;
  let top = 0;
  for (const [key, count] of counts) {
    if (count > top) {
      pick = key;
      top = count;
    }
  }
  if (top < ORDERS - 1) return { pick: null, top: 0 };
  return { pick, top };
}

/**
 * First failed check decides, in this order: coverage, kill, margin, sign
 * test, flips. The exact loss tail kills before the margin is read, the sign
 * test reads the win tail, and the flips check binds the backend because
 * every row is judged in three orders. A later check never softens an earlier
 * one.
 *
 * @param {{ backend: string, K: number, M: number, A: number, B: number,
 *   W: number, L: number, F: number }} counts - Column counts
 * @returns {{ outcome: 'keep' | 'kill' | 'stop',
 *   reason: 'coverage' | 'margin' | 'sign test' | 'flips' | null,
 *   p: number, pLoss: number }} Verdict with both exact tails
 */
function decideVerdict({ backend, K, M, A, B, W, L, F }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: win.p, pLoss: loss.p };
  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, p: win.p, pLoss: loss.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: win.p, pLoss: loss.p };
  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', p: win.p, pLoss: loss.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: win.p, pLoss: loss.p };
  return { outcome: 'keep', reason: null, p: win.p, pLoss: loss.p };
}

/**
 * @param {number} p - Probability in [0, 1]
 * @returns {string} Four significant digits
 */
function formatP(p) {
  return p.toPrecision(4);
}

/**
 * One column's counts and verdict over the labeled rows. A row is measured
 * only when its answer array holds one answer per order and every answer named
 * a submitted key; every other row stays unmeasured. The column is right on a
 * row when the modal pick is `P0` and the label is `real`, or the modal pick is
 * `P1`, `P2` or `not_a_finding` and the label is not `real`, and an unstable
 * row is always wrong. The baseline is the recorded severity, so it is right
 * exactly where the label is `real`. F sums each measured row's non-modal
 * picks, all three of them when no key is modal.
 *
 * @param {'jev'} backend - Backend name, printed on the verdict line
 * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
 * @param {Map<string, Array<{ pick: string | null }>>} answers - Row key (rowKey) -> one entry per order
 * @param {(row: object) => boolean} baselineRight - Whether the recorded severity is right on a row
 * @param {string} suffix - Identity text appended to the verdict line, empty for none
 * @returns {{ backend: string, K: number, M: number, unmeasured: number,
 *   A: number, B: number, W: number, L: number, F: number, p: number,
 *   pLoss: number, outcome: string, reason: string | null, line: string }} Column summary
 */
function summarizeColumn(backend, rows, answers, baselineRight, suffix) {
  const K = rows.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  for (const row of rows) {
    const values = answers.get(rowKey(row.registry, row.findingId));
    if (!Array.isArray(values) || values.length !== ORDERS) continue;
    if (!values.every((value) => OPTIONS.some((option) => option.key === value?.pick))) continue;
    M += 1;
    const { pick, top } = modalPick(values);
    F += pick === null ? ORDERS : ORDERS - top;
    const right = pick === 'P0' ? row.label === 'real' : pick !== null && row.label !== 'real';
    const baseRight = baselineRight(row) === true;
    if (right) A += 1;
    if (baseRight) B += 1;
    if (right && !baseRight) W += 1;
    if (baseRight && !right) L += 1;
  }
  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F });
  const outcome = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
  let line = `verdict ${backend}: ${outcome} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(verdict.p)}`;
  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
  return {
    backend,
    K,
    M,
    unmeasured: K - M,
    A,
    B,
    W,
    L,
    F,
    p: verdict.p,
    pLoss: verdict.pLoss,
    outcome: verdict.outcome,
    reason: verdict.reason,
    line,
  };
}

/**
 * The reread-order line: for each registry with two or more labeled rows, at
 * least one real row and at least one row carrying a P0 probability, the rank
 * of its first real row when rows sort by the column's mean P0 probability,
 * against the rank of the first real row in the registry's own order. Rows
 * without a P0 probability leave the sort, so the line says how near the top
 * the model put the rows the operator calls real. The ranks are means over the
 * qualifying registries, one decimal.
 *
 * @param {'jev'} backend - Backend name, printed on the line
 * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
 * @param {Map<string, Array<{ p0Probability?: number | null }>>} answers - Row key (rowKey) -> one entry per order
 * @returns {string | null} The order line, or null when no registry qualifies
 */
function orderLine(backend, rows, answers) {
  const meanP0 = (values) => {
    if (!Array.isArray(values)) return null;
    let sum = 0;
    let count = 0;
    for (const value of values) {
      if (Number.isFinite(value?.p0Probability)) {
        sum += value.p0Probability;
        count += 1;
      }
    }
    return count === 0 ? null : sum / count;
  };
  const byRegistry = new Map();
  for (const row of rows) {
    if (!byRegistry.has(row.registry)) byRegistry.set(row.registry, []);
    byRegistry.get(row.registry).push(row);
  }
  const firstRanks = [];
  const recordedRanks = [];
  for (const registryRows of byRegistry.values()) {
    if (registryRows.length < 2) continue;
    if (!registryRows.some((row) => row.label === 'real')) continue;
    const ranked = registryRows
      .map((row) => ({ row, p0: meanP0(answers.get(rowKey(row.registry, row.findingId))) }))
      .filter((entry) => entry.p0 !== null);
    if (!ranked.some((entry) => entry.row.label === 'real')) continue;
    const sorted = [...ranked].sort((left, right) => right.p0 - left.p0);
    firstRanks.push(sorted.findIndex((entry) => entry.row.label === 'real') + 1);
    recordedRanks.push(ranked.findIndex((entry) => entry.row.label === 'real') + 1);
  }
  if (firstRanks.length === 0) return null;
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  return `order ${backend}: registries=${firstRanks.length} first_real_rank=${mean(firstRanks).toFixed(1)} recorded=${mean(recordedRanks).toFixed(1)}`;
}

/**
 * The funnel line: how many asked rows returned a noul and how many of those
 * answered yes at 0.5 or more. The funnel is a report-only second view, so its
 * line never enters a verdict.
 *
 * @param {'jev'} backend - Backend name, printed on the line
 * @param {number} asked - Rows the funnel asked about
 * @param {Array<number | null>} values - One noul per asked row, null when unmeasured
 * @returns {string} The funnel line
 */
function funnelLine(backend, asked, values) {
  let measured = 0;
  let yes = 0;
  for (const value of values) {
    if (!Number.isFinite(value)) continue;
    measured += 1;
    if (value >= 0.5) yes += 1;
  }
  return `funnel ${backend}: asked=${asked} measured=${measured} yes=${yes} no=${measured - yes}`;
}

/**
 * The exact line: how many negatives the column put in their labeled class,
 * over the negatives that have a modal pick. A negative whose orders name
 * three different keys has no pick and cannot match.
 *
 * @param {'jev'} backend - Backend name, printed on the line
 * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
 * @param {Map<string, Array<{ pick: string | null }>>} answers - Row key (rowKey) -> one entry per order
 * @returns {string} The exact line
 */
function exactLine(backend, rows, answers) {
  let negatives = 0;
  let exact = 0;
  for (const row of rows) {
    if (row.label === 'real') continue;
    const values = answers.get(rowKey(row.registry, row.findingId));
    if (!Array.isArray(values) || values.length !== ORDERS) continue;
    const { pick } = modalPick(values);
    if (pick === null) continue;
    negatives += 1;
    if (pick === row.label) exact += 1;
  }
  return `exact ${backend}: ${exact} of ${negatives} negatives`;
}

/**
 * Nearest-rank percentile. An empty list has no rank.
 *
 * @param {number[]} values - Raw values
 * @param {number} q - Quantile in (0, 1]
 * @returns {number | null} The value at the nearest rank, or null for an empty list
 */
function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ARM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name - Executable file name
 * @param {{ PATH?: string }} env - Environment whose PATH is searched
 * @returns {string | null} First executable match, or null when none is executable
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
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF and exits 2 on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file - Executable to spawn
 * @param {string[]} args - Arguments after the executable
 * @param {string} stdinText - Text written to stdin, then closed
 * @param {Record<string, string | undefined>} env - Child environment
 * @param {number} timeoutMs - Kill and resolve after this many milliseconds
 * @returns {Promise<{ code: number | null, stdout: string, stderr: string,
 *   wallMs: number, timedOut: boolean }>} Call result
 */
function spawnCall(file, args, stdinText, env, timeoutMs) {
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
 * @param {string | undefined} outDir - Directory that holds calls.jsonl
 * @returns {{ append: (record: object) => void }} Append-only call log
 */
function createCallLog(outDir) {
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
 * Parsed report.json written by an earlier run into the same out directory.
 *
 * @param {string | undefined} outDir - Directory that may hold report.json
 * @returns {object | null} The parsed report, or null when outDir is empty, the
 *   file is missing, or the file does not parse
 */
function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * The row's call-log identity: a short digest of its registry and finding id,
 * so a line records which row a call read while the id itself never leaves.
 *
 * @param {{ registry: string, findingId: string }} row - Row from p0RowsOf
 * @returns {string} First 16 hex characters of sha256(registry#findingId)
 */
function rowDigest(row) {
  return crypto.createHash('sha256').update(rowKey(row.registry, row.findingId)).digest('hex').slice(0, 16);
}

/**
 * The option list rotated left by one position per order, so no key keeps the
 * first position across the three calls and a position carries no advantage.
 *
 * @param {Array<{ key: string, description: string }>} options - Option list
 * @param {number} order - Rotation index, 0 for the base order
 * @returns {Array<{ key: string, description: string }>} Rotated copy
 */
function rotateOptions(options, order) {
  return options.map((_, index) => options[(index + order) % options.length]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. JEV GATE AND ARM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether a registry path exists on the published branch. A registry that
 * is not at origin/main holds text the hosted backend must not receive, so
 * the arm withholds its rows rather than sending them.
 *
 * @param {Function} git - Git runner returning { status, stdout, stderr }
 * @param {string} root - Repository root the path is relative to
 * @param {string} registry - Repo-relative registry path
 * @returns {boolean} True when origin/main holds the registry
 */
function isPublished(git, root, registry) {
  const result = git(['-C', root, 'cat-file', '-e', `origin/main:${registry}`]);
  return result.status === 0;
}

/**
 * Identity line, then the pinned client version and a credential check under
 * the one provider every later call reuses. A miss prints a skip line and
 * leaves the census text already written; none of the checks sends a payload.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>,
 *   timeoutMs?: number }} ctx - Line writer, environment and per-call timeout
 * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs ?? CALL_TIMEOUT_MS,
  };
  const version = spawnSync(jevPath, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }
  return { passed: true, path: jevPath, provider };
}

/**
 * The Jev arm: one auth test under one provider, then three choice calls per
 * published row, one per option order, then one funnel noul per row whose
 * three severity calls each landed a submitted key. A row whose registry is
 * not at origin/main is withheld, gets no call and its lines read
 * `unmeasured_unpublished`. A severity call is measured when it exits 0 with
 * a submitted key; an exit-4 call waits once and retries, because a dropped
 * connection is not a judgment; the funnel never reruns, since it never
 * decides. A stop prints its line and the rows finished, and leaves the
 * column and verdict unprinted.
 *
 * @param {{ rows: Array<object>, baselineRight: (row: object) => boolean }} plan - Labeled rows and the baseline-right predicate
 * @param {{ path: string, provider: string }} gate - Passing jevGate result: client path and provider
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>,
 *   timeoutMs?: number, backoffMs?: number,
 *   callLog: { append: (record: object) => void }, stored: object | null,
 *   git: Function, root: string }} ctx - Line writer, environment, per-call
 *   timeout, retry wait, call log, stored report and the git runner behind
 *   the published check
 * @returns {Promise<{ column: object, requalify: string | null } |
 *   { stopped: string, partialRows: number }>} The finished column or the stop line with the rows finished
 */
async function runJevArm(plan, gate, ctx) {
  const jevVersion = JEV_VERSION.split(' ')[1];
  let chars = 0;
  for (const row of plan.rows) {
    const state = buildRowState(row);
    chars += (state.length + QUESTION_SEVERITY.length) * ORDERS;
    chars += state.length + QUESTION_FUNNEL.length;
  }
  ctx.out(`jev: payload: published review registry text; planned calls: ${(ORDERS + 1) * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const timeoutMs = ctx.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = ctx.backoffMs ?? BACKOFF_MS;
  const wallTimes = [];
  let finished = 0;

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, timeoutMs);
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
    call: 'auth_test',
    row: null,
    order: null,
    attempt: 1,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    pick: null,
    pickProbability: null,
    p0Probability: null,
    noul: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion,
    provider: gate.provider,
    model,
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: usage error');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();

  /**
   * One calls.jsonl record. A call that led to a stop or a retry carries no
   * judgment, so its outcome fields stay empty.
   */
  function record(row, call, order, attempt, r, outcome, status) {
    return {
      backend: 'jev',
      call,
      row: rowDigest(row),
      order,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      pick: outcome.pick ?? null,
      pickProbability: outcome.pickProbability ?? null,
      p0Probability: outcome.p0Probability ?? null,
      noul: outcome.noul ?? null,
      status,
      jevVersion,
      provider: gate.provider,
      model,
    };
  }

  // A severity answer counts only when it names a submitted key; the same
  // answer carries the probability of every option, P0 included.
  function severityOutcome(r) {
    let parsed;
    try {
      parsed = JSON.parse(r.stdout);
    } catch {
      // A body that does not parse is an unmeasured call, not a crash.
    }
    const answer = parsed?.answers?.answer;
    const choice = answer?.choice;
    if (typeof choice !== 'string' || !OPTIONS.some((option) => option.key === choice)) return null;
    const probability = answer?.probabilities?.[choice];
    const p0 = answer?.probabilities?.P0;
    return {
      pick: choice,
      pickProbability: Number.isFinite(probability) ? probability : null,
      p0Probability: Number.isFinite(p0) ? p0 : null,
    };
  }

  // A funnel answer counts only when it is a finite probability.
  function funnelNoul(r) {
    let parsed;
    try {
      parsed = JSON.parse(r.stdout);
    } catch {
      // A body that does not parse leaves the funnel row unmeasured.
    }
    const value = parsed?.answers?.answer?.noul;
    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
  }

  // One cat-file per registry keeps the published check from repeating for
  // every row a registry holds.
  const publishedByRegistry = new Map();
  function isRegistryPublished(registry) {
    if (!publishedByRegistry.has(registry)) {
      publishedByRegistry.set(registry, isPublished(ctx.git, ctx.root, registry));
    }
    return publishedByRegistry.get(registry);
  }

  for (const row of plan.rows) {
    if (!isRegistryPublished(row.registry)) {
      for (let order = 0; order < ORDERS; order += 1) {
        ctx.callLog.append(record(row, 'severity', order, 1, { code: null, wallMs: 0 }, {}, 'unmeasured_unpublished'));
      }
      finished += 1;
      continue;
    }

    const state = buildRowState(row);
    const picks = [];
    for (let order = 0; order < ORDERS; order += 1) {
      const args = ['choice', '--provider', gate.provider, '-q', QUESTION_SEVERITY];
      for (const option of rotateOptions(OPTIONS, order)) args.push('-o', `${option.key}=${option.description}`);
      let attempt = 1;
      let r = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
      wallTimes.push(r.wallMs);

      if (!r.timedOut && r.code === 4) {
        ctx.callLog.append(record(row, 'severity', order, attempt, r, {}, 'unmeasured'));
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        attempt = 2;
        r = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
        wallTimes.push(r.wallMs);
      }

      let outcome = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        outcome = severityOutcome(r);
        if (outcome !== null) status = 'measured';
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append(record(row, 'severity', order, attempt, r, outcome ?? {}, status));
      if (stopLine !== null) return stop(stopLine);
      picks.push({ pick: outcome?.pick ?? null, p0Probability: outcome?.p0Probability ?? null });
    }
    answers.set(rowKey(row.registry, row.findingId), picks);
    finished += 1;
  }

  const measuredRows = plan.rows.filter((row) => {
    const values = answers.get(rowKey(row.registry, row.findingId));
    return Array.isArray(values)
      && values.length === ORDERS
      && values.every((value) => OPTIONS.some((option) => option.key === value?.pick));
  });

  const funnelValues = [];
  for (const row of measuredRows) {
    const state = buildRowState(row);
    const callArgs = ['noul', '--provider', gate.provider, '-q', QUESTION_FUNNEL];
    const attempt = 1;
    const r = await spawnCall(gate.path, callArgs, state, ctx.env, timeoutMs);
    wallTimes.push(r.wallMs);

    let noul = null;
    let status = 'unmeasured';
    let stopLine = null;
    if (r.timedOut) {
      status = 'unmeasured_timeout';
    } else if (r.code === 0) {
      noul = funnelNoul(r);
      if (noul !== null) status = 'measured';
    } else if (r.code === 2) {
      stopLine = 'jev arm stopped: usage error';
    } else if (r.code === 3) {
      stopLine = 'jev arm stopped: key rejected';
    } else if (r.code === 130) {
      stopLine = 'jev arm stopped: interrupted';
    }

    ctx.callLog.append(record(row, 'funnel', null, attempt, r, noul === null ? {} : { noul }, status));
    if (stopLine !== null) return stop(stopLine);
    funnelValues.push(noul);
  }

  const column = summarizeColumn(
    'jev',
    plan.rows,
    answers,
    plan.baselineRight,
    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
  );
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column jev: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} p_loss=${formatP(column.pLoss)} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  const orderLineText = orderLine('jev', plan.rows, answers);
  if (orderLineText !== null) ctx.out(orderLineText);
  ctx.out(funnelLine('jev', measuredRows.length, funnelValues));
  ctx.out(exactLine('jev', plan.rows, answers));
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  ctx.out(column.line);

  return {
    column: {
      ...column,
      latency,
      jevVersion,
      provider: gate.provider,
      model,
    },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN AND REPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The report one run writes to report.json. The census keeps its counts, the
 * labels their digest and split, the baseline its summary, the gate its printed
 * line, and each requested arm fills exactly one bucket: a finished column
 * under columns, a stop under stopped, a skip under skipped. A finished column
 * also records the line that explains a re-run.
 *
 * @param {{ census: object, labels: { sha256: string | null, K: number,
 *   real: number, negatives: number, dropped: number },
 *   baseline: { right: number, of: number }, gate: string,
 *   jev?: object }} parts - Report inputs
 * @returns {object} Report object ready for JSON.stringify
 */
function buildReport(parts) {
  const { census, labels, baseline, gate, jev } = parts;
  const report = {
    census,
    labels,
    baseline,
    gate,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };

  for (const [backend, arm] of [['jev', jev]]) {
    if (!arm) continue;
    if (typeof arm.skipped === 'string') {
      report.skipped[backend] = arm.skipped;
      continue;
    }
    if (typeof arm.stopped === 'string') {
      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      continue;
    }
    if (!arm.column) continue;
    const { column } = arm;
    report.columns[backend] = {
      verdict: column.outcome,
      reason: column.reason,
      line: column.line,
      K: column.K,
      M: column.M,
      A: column.A,
      B: column.B,
      W: column.W,
      L: column.L,
      F: column.F,
      p: column.p,
      pLoss: column.pLoss,
      unmeasured: column.unmeasured,
      latency: column.latency,
    };
    report.columns[backend].jevVersion = column.jevVersion;
    report.columns[backend].provider = column.provider;
    report.columns[backend].model = column.model;
    report.requalify[backend] = arm.requalify ?? null;
  }

  return report;
}

/**
 * Parse the switches, census the tracked review registries, read the operator's
 * labels, print the census, the keep rule and the gate, run the requested
 * backend gates and arms in fixed order, and write report.json when an arm was
 * requested. The default run spawns git only and writes no file.
 *
 * @param {string[]} argv - Arguments after the node and script paths
 * @param {object} [deps] - Injected dependencies
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
 * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
 * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
 * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
 * @param {Function} [deps.git] - Git runner returning { status, stdout, stderr }. Default runGit.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input
 */
async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
  const git = deps.git ?? runGit;

  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        'write-label-sheet': { type: 'string' },
        labels: { type: 'string' },
        jev: { type: 'boolean' },
        out: { type: 'string' },
      },
    }));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  // A model call whose outcome is never recorded cannot be inspected later,
  // so an arm without an output directory is refused before anything runs.
  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    err('--jev needs --out <dir> so every call is recorded');
    return 2;
  }

  let root;
  try {
    root = repoRoot(git);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const sheetTarget = typeof values['write-label-sheet'] === 'string' && values['write-label-sheet'] !== ''
    ? values['write-label-sheet']
    : null;
  // The labels are the operator's gold and have to stay outside the tree they
  // judge, so a target inside it is refused before the census reads a file.
  if (sheetTarget !== null) {
    const resolved = path.resolve(sheetTarget);
    const boundary = path.resolve(root);
    if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
      err('refusing to write the label sheet inside the repository');
      return 2;
    }
  }

  let census;
  let phrases;
  let labels;
  let labelsSha = null;
  try {
    const files = listTrackedFiles(git, root);
    census = censusFindings(loadRegistries(root, files));
    phrases = countPhrases(root, files, PHRASES);
    if (typeof values.labels === 'string' && values.labels !== '') {
      const bytes = fs.readFileSync(values.labels);
      labels = parseLabels(bytes.toString('utf8'));
      labelsSha = crypto.createHash('sha256').update(bytes).digest('hex');
    } else {
      labels = new Map();
    }
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  for (const line of censusLines(census, phrases)) out(line);

  if (sheetTarget !== null) {
    try {
      const written = writeLabelSheet(sheetTarget, buildLabelSheetLines(census.p0Rows), root);
      out(`label sheet: ${sheetTarget} rows=${written}`);
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }

  const labeledRows = [];
  const labelCounts = { real: 0, P1: 0, P2: 0, not_a_finding: 0 };
  for (const row of census.p0Rows) {
    const label = labels.get(rowKey(row.registry, row.findingId));
    if (label === undefined || label === '') continue;
    labelCounts[label] += 1;
    labeledRows.push({ ...row, label });
  }
  const K = labeledRows.length;
  const negatives = K - labelCounts.real;
  const dropped = labels.size - K;

  out(labelsSha === null ? 'labels: none' : `labels: sha256=${labelsSha} rows=${labels.size}`);
  out(`labeled: ${K} (real ${labelCounts.real}, P1 ${labelCounts.P1}, P2 ${labelCounts.P2}, not_a_finding ${labelCounts.not_a_finding})`);
  out(`labels dropped: ${dropped}`);
  out(`baseline: right ${labelCounts.real} of ${K}`);
  out(`question: ${QUESTION_SEVERITY}`);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out(POWER_LINE);

  const gate = gateLine(K, negatives, labelCounts.real);
  out(gate.line);

  const armRequested = values.jev === true;
  const stored = armRequested ? readStoredReport(values.out) : null;
  const callLog = createCallLog(values.out);
  const plan = { rows: labeledRows, baselineRight: (row) => row.label === 'real' };

  let jevResult;
  if (values.jev === true) {
    if (gate.state !== 'open') {
      const line = gate.state === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
      out(line);
      jevResult = { skipped: line };
    } else {
      const jev = jevGate({ out, env, timeoutMs });
      jevResult = jev.passed
        ? await runJevArm(plan, jev, { out, env, timeoutMs, backoffMs, callLog, stored, git, root })
        : { skipped: jev.reason };
    }
  }

  if (armRequested) {
    const report = buildReport({
      census,
      labels: { sha256: labelsSha, K, real: labelCounts.real, negatives, dropped },
      baseline: { right: labelCounts.real, of: K },
      gate: gate.line,
      jev: jevResult,
    });
    fs.mkdirSync(values.out, { recursive: true });
    fs.writeFileSync(path.join(values.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  QUESTION_SEVERITY,
  QUESTION_FUNNEL,
  OPTIONS,
  PHRASES,
  LABEL_GATE,
  ORDERS,
  JEV_VERSION,
  CALL_TIMEOUT_MS,
  BACKOFF_MS,
  MARGIN_LINE,
  KEEP_RULE_LINE,
  POWER_LINE,
  USAGE,
  runGit,
  repoRoot,
  listTrackedFiles,
  loadRegistries,
  p0RowsOf,
  rowKey,
  censusFindings,
  countPhrases,
  censusLines,
  buildRowState,
  buildLabelSheetLines,
  writeLabelSheet,
  parseLabels,
  gateLine,
  binomialTail,
  modalPick,
  decideVerdict,
  formatP,
  summarizeColumn,
  orderLine,
  funnelLine,
  exactLine,
  nearestRank,
  which,
  spawnCall,
  createCallLog,
  readStoredReport,
  isPublished,
  jevGate,
  runJevArm,
  buildReport,
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
