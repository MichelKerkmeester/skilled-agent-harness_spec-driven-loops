#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Scan
// ───────────────────────────────────────────────────────────────────
// Measures whether a sentence's citation still points at the code window it
// claims. The default run prints the census and makes no model call, reads no
// credential and writes no file.
//
// Usage:
//   node cite-drift-scan.mjs [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]
//
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, refused before any call.
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Repository root five levels above this shared script. */
export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..');

/** This skill's root, two levels above the script. */
export const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

/** Default labels file beside the script; only --draw writes it. */
export const LABELS_PATH = path.join(SCRIPT_DIR, 'cite-drift-labels.jsonl');

/** Tracked-file citation with an optional inclusive line range. */
export const CITATION_RE = /(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g;

/** Opening or closing line of a fenced block; fenced lines carry no prose. */
export const FENCE_RE = /^\s*(?:```|~~~)/;

/** Usage line printed when an invocation misses an input. */
export const USAGE = 'usage: node cite-drift-scan.mjs [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]';

// A large tree's `git ls-files -z` output runs far past Node's 1 MB default.
const GIT_MAX_BUFFER = 268435456;

/** Live rows an operator labels; the rest of the draw is construction-labeled. */
export const LIVE_ROWS = 20;

/** Constructed rows, each a citation whose window moved down its own file. */
export const CONSTRUCTED_ROWS = 20;

/** Lines a constructed window moves past the cited line. */
export const CONSTRUCT_OFFSET_LINES = 60;

/** Minimum distance between a constructed window's centre and the cited line. */
export const CONSTRUCT_MIN_GAP_LINES = 20;

/** A target shorter than this cannot hold a clearly separate window. */
export const CONSTRUCT_MIN_FILE_LINES = 80;

/** Half-width, in lines, of the window a row records. */
export const WINDOW_RADIUS_LINES = 10;

/** Rows carrying a verdict that the label gate needs before scoring. */
export const LABEL_GATE = 40;

/** A yes probability below this reads as a flagged, drifted window. */
export const FLAG_THRESHOLD = 0.5;

/** Bounds one model call; a spawn past this is unmeasured, not an answer. */
export const CALL_TIMEOUT_MS = 90000;

/** The 10-point gain over the baseline that the keep rule requires. */
export const MARGIN_LINE = 'margin: 0.10';

/** Every keep-rule check in its order, restated for the report reader. */
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M';

/** The fixed `-q` text every model call carries, printed before the first call. */
export const INSTRUCTION = 'Does the cited code window still show what the citing sentence claims?';

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
 * Full commit id of the repository's HEAD.
 * @param {string} repoRoot
 * @returns {string} 40 hex characters.
 */
export function headCommit(repoRoot) {
  const result = spawnSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: GIT_MAX_BUFFER,
  });
  const commit = (result.stdout ?? '').trim();
  if (result.error || result.status !== 0 || !/^[0-9a-f]{40}$/.test(commit)) {
    const reason = (result.stderr ?? '').trim() || result.error?.message || `exit ${result.status}`;
    throw new Error(`git rev-parse HEAD failed in ${repoRoot}: ${reason}`);
  }
  return commit;
}

/**
 * Repo-relative paths the index tracks, as `git ls-files -z` reports them.
 * @param {string} repoRoot
 * @returns {Set<string>}
 */
export function listTrackedFiles(repoRoot) {
  const result = spawnSync('git', ['-C', repoRoot, 'ls-files', '-z'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: GIT_MAX_BUFFER,
  });
  if (result.error || result.status !== 0) {
    const reason = (result.stderr ?? '').trim() || result.error?.message || `exit ${result.status}`;
    throw new Error(`git ls-files failed in ${repoRoot}: ${reason}`);
  }
  return new Set((result.stdout ?? '').split('\0').filter((entry) => entry !== ''));
}

/**
 * Citations in the prose of a document: every `path:line` or `path:line-end`
 * span outside a fenced block, one entry per occurrence in source order. The
 * sentence is the trimmed line that carries the citation.
 * @param {string} text
 * @param {string} doc Repo-relative path of the citing document.
 * @returns {Array<{ doc: string, line: number, sentence: string, target: string, targetLine: number, targetLineEnd: number|null }>}
 */
export function extractCitations(text, doc) {
  const citations = [];
  const lines = text.split(/\r?\n/);
  let inFence = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const match of line.matchAll(CITATION_RE)) {
      citations.push({
        doc,
        line: index + 1,
        sentence: line.trim(),
        target: match[1],
        targetLine: Number(match[2]),
        targetLineEnd: match[3] === undefined ? null : Number(match[3]),
      });
    }
  }
  return citations;
}

/**
 * Status of a tracked target. The worktree copy decides missing, and its line
 * count decides whether the cited line or range fits.
 * @param {string} repoPath Repo-relative path that the index tracks.
 * @param {{ targetLine: number, targetLineEnd: number|null }} citation
 * @param {string} repoRoot
 * @returns {{ status: 'in_range'|'past_end'|'missing', path: string, endLine: number|null }}
 */
function resolveTracked(repoPath, citation, repoRoot) {
  const endLine = citation.targetLineEnd ?? citation.targetLine;
  let text;
  try {
    text = fs.readFileSync(path.join(repoRoot, repoPath), 'utf8');
  } catch {
    return { status: 'missing', path: repoPath, endLine: null };
  }
  const lines = text.split(/\r?\n/);
  const lineCount = text === '' ? 0 : (text.endsWith('\n') ? lines.length - 1 : lines.length);
  if (citation.targetLine > lineCount || endLine > lineCount) {
    return { status: 'past_end', path: repoPath, endLine };
  }
  return { status: 'in_range', path: repoPath, endLine };
}

/**
 * Resolved location of one citation, tested in order: the citing document's own
 * folder, the repository root, the citing document's skill root, then a unique
 * basename across the tracked set. Only a tracked path is read, so an untracked
 * copy is refused rather than opened.
 * @param {{ doc: string, target: string, targetLine: number, targetLineEnd: number|null }} citation
 * @param {{ tracked: Set<string>, repoRoot: string, skillRoot?: string|null }} context
 * @returns {{ status: 'in_range'|'past_end'|'ambiguous'|'unresolved'|'refused'|'missing', path: string|null, endLine: number|null }}
 */
export function resolveCitation(citation, { tracked, repoRoot, skillRoot = null }) {
  const targetBase = path.posix.basename(citation.target);
  if (targetBase.startsWith('.env')) return { status: 'refused', path: null, endLine: null };

  const candidates = [
    path.posix.join(path.posix.dirname(citation.doc), citation.target),
    citation.target,
  ];
  if (typeof skillRoot === 'string' && skillRoot !== '') {
    candidates.push(path.posix.join(skillRoot, citation.target));
  }

  for (const candidate of candidates) {
    if (tracked.has(candidate)) return resolveTracked(candidate, citation, repoRoot);
  }

  const sameBase = [...tracked].filter((entry) => path.posix.basename(entry) === targetBase);
  if (sameBase.length > 1) return { status: 'ambiguous', path: null, endLine: null };
  if (sameBase.length === 1) return resolveTracked(sameBase[0], citation, repoRoot);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(repoRoot, candidate))) {
      return { status: 'refused', path: null, endLine: null };
    }
  }
  return { status: 'unresolved', path: null, endLine: null };
}

/**
 * Per-skill census over every tracked skill markdown document, read through the
 * committed tree. Reports citation counts by status, the dead list (missing
 * plus past_end) and the refused count.
 * @param {string} repoRoot
 * @param {Set<string>} tracked
 * @returns {{
 *   commit: string,
 *   perSkill: Array<{ skill: string, citations: number, in_range: number, past_end: number, ambiguous: number, unresolved: number, dead: number }>,
 *   total: { citations: number, in_range: number, past_end: number, ambiguous: number, unresolved: number, dead: number },
 *   dead: Array<{ doc: string, line: number, target: string, targetLine: number }>,
 *   refused: number
 * }}
 */
export function buildCensus(repoRoot, tracked) {
  const commit = headCommit(repoRoot);
  const perSkill = new Map();
  const totals = { citations: 0, in_range: 0, past_end: 0, ambiguous: 0, unresolved: 0, refused: 0, missing: 0 };
  const dead = [];

  const docs = [...tracked]
    .filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md'))
    .sort();
  for (const doc of docs) {
    const shown = spawnSync('git', ['-C', repoRoot, 'show', `HEAD:${doc}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: GIT_MAX_BUFFER,
    });
    // A path the index tracks but HEAD does not hold has nothing committed to scan.
    if (shown.error || shown.status !== 0) continue;
    const skill = doc.split('/')[2];
    const counts = perSkill.get(skill)
      ?? { citations: 0, in_range: 0, past_end: 0, ambiguous: 0, unresolved: 0, refused: 0, missing: 0 };
    const skillRoot = `.skilled/skills/${skill}`;
    for (const citation of extractCitations(shown.stdout, doc)) {
      const { status } = resolveCitation(citation, { tracked, repoRoot, skillRoot });
      counts.citations += 1;
      counts[status] += 1;
      totals.citations += 1;
      totals[status] += 1;
      if (status === 'missing' || status === 'past_end') {
        dead.push({ doc, line: citation.line, target: citation.target, targetLine: citation.targetLine });
      }
    }
    perSkill.set(skill, counts);
  }

  const project = (counts) => ({
    citations: counts.citations,
    in_range: counts.in_range,
    past_end: counts.past_end,
    ambiguous: counts.ambiguous,
    unresolved: counts.unresolved,
    dead: counts.missing + counts.past_end,
  });

  return {
    commit,
    perSkill: [...perSkill.entries()]
      .map(([skill, counts]) => ({ skill, ...project(counts) }))
      .sort((left, right) => (left.skill < right.skill ? -1 : left.skill > right.skill ? 1 : 0)),
    total: project(totals),
    dead: [...dead].sort((left, right) => {
      if (left.doc !== right.doc) return left.doc < right.doc ? -1 : 1;
      return left.line - right.line;
    }),
    refused: totals.refused,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. DRAW
// ───────────────────────────────────────────────────────────────────

/**
 * Every line of one file as the recorded commit holds it, split the way
 * extractCitations reads documents. Null when the commit does not hold it.
 * @param {string} repoRoot
 * @param {string} commit
 * @param {string} filePath Repo-relative tracked path.
 * @returns {string[]|null}
 */
function readCommittedLines(repoRoot, commit, filePath) {
  const shown = spawnSync('git', ['-C', repoRoot, 'show', `${commit}:${filePath}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: GIT_MAX_BUFFER,
  });
  if (shown.error || shown.status !== 0) return null;
  const text = shown.stdout ?? '';
  if (text === '') return [];
  const lines = text.split(/\r?\n/);
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Committed lines `start` to `end`, both inclusive and 1-based, of one file. A
 * range past the file end yields only the lines that exist.
 * @param {string} repoRoot
 * @param {string} commit
 * @param {string} filePath Repo-relative tracked path.
 * @param {number} start First line, 1-based.
 * @param {number} end Last line, inclusive.
 * @returns {string[]}
 */
export function readWindow(repoRoot, commit, filePath, start, end) {
  const lines = readCommittedLines(repoRoot, commit, filePath);
  if (lines === null) return [];
  const first = Math.max(1, start);
  const last = Math.min(lines.length, end);
  return first > last ? [] : lines.slice(first - 1, last);
}

/**
 * A small seeded PRNG (mulberry32). The same seed replays the same picks, so a
 * draw can be reproduced without carrying any other state.
 * @param {number} seed
 * @returns {() => number} Successive values in [0, 1).
 */
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * In-range citations of every scanned skill document, grouped by skill, read
 * through the recorded commit so a later edit cannot move a row.
 * @param {{ perSkill: Array<{ skill: string }> }} census
 * @param {string} repoRoot
 * @param {string} commit
 * @returns {Map<string, Array<object>>}
 */
function inRangePools(census, repoRoot, commit) {
  const tracked = listTrackedFiles(repoRoot);
  const pools = new Map(census.perSkill.map((entry) => [entry.skill, []]));
  const docs = [...tracked]
    .filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md'))
    .sort();
  for (const doc of docs) {
    const skill = doc.split('/')[2];
    const pool = pools.get(skill);
    if (pool === undefined) continue;
    const lines = readCommittedLines(repoRoot, commit, doc);
    if (lines === null) continue;
    const skillRoot = `.skilled/skills/${skill}`;
    for (const citation of extractCitations(lines.join('\n'), doc)) {
      const { status, path: resolved } = resolveCitation(citation, { tracked, repoRoot, skillRoot });
      if (status === 'in_range' && resolved !== null) pool.push({ ...citation, path: resolved });
    }
  }
  return pools;
}

/**
 * One labels row. It carries no window text, only what locates the window and
 * lets a later read check that the window still shows the same lines.
 * @param {object} entry Resolved citation.
 * @param {'live'|'constructed'} kind
 * @param {number} windowStart
 * @param {number} windowEnd
 * @param {string[]} windowLines
 * @param {number} ordinal 1-based position within the kind.
 * @param {string} commit
 * @returns {object}
 */
function drawRow(entry, kind, windowStart, windowEnd, windowLines, ordinal, commit) {
  return {
    id: `${kind}-${String(ordinal).padStart(2, '0')}`,
    doc: entry.doc,
    doc_line: entry.line,
    target: entry.path,
    target_line: entry.targetLine,
    window_start: windowStart,
    window_end: windowEnd,
    commit,
    claim_sha12: sha256Hex(entry.sentence).slice(0, 12),
    window_sha12: sha256Hex(windowLines.join('\n')).slice(0, 12),
    kind,
    verdict: kind === 'constructed' ? 'contradicts' : null,
    labeler: kind === 'constructed' ? 'construction' : null,
  };
}

/**
 * The labels rows for one seed: live in-range citations plus the same number of
 * constructed rows whose window moved down the same file, so a labelled set
 * holds known-drifted windows beside citations that may still hold. One pick
 * per skill per pass keeps a large skill from crowding out a smaller one.
 * @param {{ census: object, repoRoot: string, commit: string, seed: number }} input
 * @returns {Array<object>}
 */
export function drawRows({ census, repoRoot, commit, seed }) {
  const pools = inRangePools(census, repoRoot, commit);
  const random = mulberry32(seed);
  const lineCache = new Map();
  const linesOf = (filePath) => {
    if (!lineCache.has(filePath)) lineCache.set(filePath, readCommittedLines(repoRoot, commit, filePath));
    return lineCache.get(filePath);
  };

  const passes = (count, build) => {
    const rows = [];
    let progressed = true;
    while (rows.length < count && progressed) {
      progressed = false;
      for (const pool of pools.values()) {
        if (rows.length >= count) break;
        if (pool.length === 0) continue;
        const entry = pool.splice(Math.floor(random() * pool.length), 1)[0];
        progressed = true;
        const row = build(entry, rows.length + 1);
        if (row !== null) rows.push(row);
      }
    }
    return rows;
  };

  const live = passes(LIVE_ROWS, (entry, ordinal) => {
    const lines = linesOf(entry.path);
    if (lines === null) return null;
    const start = Math.max(1, entry.targetLine - WINDOW_RADIUS_LINES);
    const end = Math.min(lines.length, entry.targetLine + WINDOW_RADIUS_LINES);
    const windowLines = readWindow(repoRoot, commit, entry.path, start, end);
    return drawRow(entry, 'live', start, end, windowLines, ordinal, commit);
  });
  if (live.length < LIVE_ROWS) throw new Error(`draw: ${live.length} live citations, need ${LIVE_ROWS}`);

  const constructed = passes(CONSTRUCTED_ROWS, (entry, ordinal) => {
    const lines = linesOf(entry.path);
    if (lines === null || lines.length < CONSTRUCT_MIN_FILE_LINES) return null;
    const centre = ((entry.targetLine + CONSTRUCT_OFFSET_LINES - 1) % lines.length) + 1;
    const direct = Math.abs(centre - entry.targetLine);
    if (Math.min(direct, lines.length - direct) < CONSTRUCT_MIN_GAP_LINES) return null;
    const start = Math.max(1, centre - WINDOW_RADIUS_LINES);
    const end = Math.min(lines.length, centre + WINDOW_RADIUS_LINES);
    const windowLines = readWindow(repoRoot, commit, entry.path, start, end);
    return drawRow(entry, 'constructed', start, end, windowLines, ordinal, commit);
  });
  if (constructed.length < CONSTRUCTED_ROWS) throw new Error(`draw: ${constructed.length} constructed citations, need ${CONSTRUCTED_ROWS}`);

  return [...live, ...constructed];
}

/**
 * Rows from a JSONL labels file. Blank lines are skipped; a malformed row names
 * its 1-based line so the file can be repaired.
 * @param {string} text
 * @returns {Array<object>}
 */
export function parseLabels(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      throw new Error(`labels row ${index + 1}: not JSON`);
    }
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`labels row ${index + 1}: not JSON`);
    }
    rows.push(record);
  }
  return rows;
}

/**
 * Counts the label gate reads: rows carrying a verdict, and the two draw kinds.
 * Constructed rows carry a verdict from the start, so a fresh draw is halfway to
 * the gate and the operator's live labels complete it.
 * @param {Array<{ kind?: string, verdict?: string|null }>} rows
 * @returns {{ labeled: number, live: number, constructed: number }}
 */
export function labelCounts(rows) {
  let labeled = 0;
  let live = 0;
  let constructed = 0;
  for (const row of rows) {
    if (row.verdict !== null && row.verdict !== undefined) labeled += 1;
    if (row.kind === 'live') live += 1;
    if (row.kind === 'constructed') constructed += 1;
  }
  return { labeled, live, constructed };
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPARATORS AND LABEL GATE
// ───────────────────────────────────────────────────────────────────

/**
 * Code-shaped tokens of a citing sentence: every backticked span split on
 * non-identifier characters, dropped to two characters or more, with the
 * target's own basename removed. These are the tokens the identifier-overlap
 * comparator looks for in the target's window.
 * @param {string} sentence
 * @param {string} target Repo-relative target path.
 * @returns {string[]} Unique tokens in sentence order.
 */
export function identifierTokens(sentence, target) {
  const targetBase = path.posix.basename(target);
  const tokens = [];
  for (const match of sentence.matchAll(/`([^`]+)`/g)) {
    for (const token of match[1].split(/[^A-Za-z0-9_]+/)) {
      if (token.length < 2 || token === targetBase || tokens.includes(token)) continue;
      tokens.push(token);
    }
  }
  return tokens;
}

/**
 * True when the sentence names at least one code token and the window text
 * shows none of them, so the window no longer carries an identifier the
 * sentence cites. A sentence with no such token is never flagged.
 * @param {string} sentence
 * @param {string} windowText The target's cited line -10..+10, clamped.
 * @param {string} target Repo-relative target path.
 * @returns {boolean}
 */
export function flagByIdentifierOverlap(sentence, windowText, target) {
  const tokens = identifierTokens(sentence, target);
  return tokens.length > 0 && !tokens.some((token) => windowText.includes(token));
}

/**
 * Sentence and window text of every labels row, read at the commit the row
 * recorded so a later edit cannot move a window. A row whose document or target
 * the commit does not hold contributes empty text and is never flagged.
 * @param {string} repoRoot
 * @param {Array<object>} rows
 * @returns {Map<string, { sentence: string, windowText: string }>}
 */
function buildWindows(repoRoot, rows) {
  const docs = new Map();
  const windows = new Map();
  for (const row of rows) {
    const docKey = `${row.commit}:${row.doc}`;
    if (!docs.has(docKey)) docs.set(docKey, readCommittedLines(repoRoot, row.commit, row.doc));
    const lines = docs.get(docKey);
    const sentence = lines === null ? '' : lines[row.doc_line - 1] ?? '';
    const windowText = readWindow(repoRoot, row.commit, row.target, row.window_start, row.window_end).join('\n');
    windows.set(row.id, { sentence, windowText });
  }
  return windows;
}

/**
 * Accuracy of the two mechanical comparators on identical labeled rows.
 * Flag-nothing never flags; identifier overlap flags when the sentence's code
 * tokens vanish from the window. Labels map supports to clean and anything
 * else to drifted. The baseline is the comparator right on more rows, with
 * flag-nothing winning a tie, so winnable rows are those it gets wrong.
 * @param {Array<{ id?: string, target?: string, verdict?: string|null }>} rows
 * @param {Map<string, { sentence: string, windowText: string }>} windows Keyed by row id.
 * @returns {{
 *   K: number,
 *   flagNothing: { right: number, K: number, ratio: number },
 *   identifierOverlap: { right: number, K: number, ratio: number },
 *   baselineMethod: 'flag-nothing'|'identifier-overlap',
 *   baselineRight: number,
 *   baselineRatio: number,
 *   headroom: boolean,
 *   winnable: number
 * }}
 */
export function scoreComparators(rows, windows) {
  const labeled = rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
  const K = labeled.length;
  let flagNothingRight = 0;
  let identifierOverlapRight = 0;
  for (const row of labeled) {
    const drifted = row.verdict !== 'supports';
    if (!drifted) flagNothingRight += 1;
    const entry = windows.get(row.id);
    const flagged = flagByIdentifierOverlap(entry?.sentence ?? '', entry?.windowText ?? '', row.target ?? '');
    if (flagged === drifted) identifierOverlapRight += 1;
  }
  const baselineMethod = identifierOverlapRight > flagNothingRight ? 'identifier-overlap' : 'flag-nothing';
  const baselineRight = Math.max(flagNothingRight, identifierOverlapRight);
  return {
    K,
    flagNothing: { right: flagNothingRight, K, ratio: K === 0 ? 0 : flagNothingRight / K },
    identifierOverlap: { right: identifierOverlapRight, K, ratio: K === 0 ? 0 : identifierOverlapRight / K },
    baselineMethod,
    baselineRight,
    baselineRatio: K === 0 ? 0 : baselineRight / K,
    // Above 90 percent baseline accuracy a 10-point gain cannot fit.
    headroom: 10 * baselineRight <= 9 * K,
    winnable: K - baselineRight,
  };
}

/**
 * The label-gate lines and the gate they support. Fewer rows than the gate
 * needs stops before any scoring; otherwise both comparators score and the run
 * stops when the baseline leaves no headroom or too few winnable rows. Only the
 * planned gate prints the fixed instruction, so its text and hash sit on stdout
 * before the first call.
 * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }> }} input
 * @returns {{ lines: string[], gate: 'stop'|'no headroom'|'underpowered'|'planned' }}
 */
export function summaryLines({ rows, windows }) {
  const lines = [MARGIN_LINE, KEEP_RULE_LINE];
  const { labeled } = labelCounts(rows);
  if (labeled < LABEL_GATE) {
    return { lines: [...lines, `stop: fewer than ${LABEL_GATE} labeled rows`], gate: 'stop' };
  }
  const comparators = scoreComparators(rows, windows);
  lines.push(
    `comparator flag-nothing: ${comparators.flagNothing.right}/${comparators.K} = ${comparators.flagNothing.ratio.toFixed(4)}`,
    `comparator identifier-overlap: ${comparators.identifierOverlap.right}/${comparators.K} = ${comparators.identifierOverlap.ratio.toFixed(4)}`,
    `baseline method: ${comparators.baselineMethod}`,
  );
  if (!comparators.headroom) {
    return { lines: [...lines, 'no headroom'], gate: 'no headroom' };
  }
  lines.push(`headroom: baseline=${comparators.baselineRatio.toFixed(4)} margin=0.10`);
  if (comparators.winnable < 5) {
    return { lines: [...lines, `underpowered: winnable=${comparators.winnable}`], gate: 'underpowered' };
  }
  lines.push(`instruction: "${INSTRUCTION}" sha256=${sha256Hex(INSTRUCTION)}`);
  return { lines, gate: 'planned' };
}

// ───────────────────────────────────────────────────────────────────
// 5. VERDICT
// ───────────────────────────────────────────────────────────────────

// The keep rule is fixed before any model run, counts stay integers and the
// sign test's tail is exact, so no rounding decides a verdict.

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
 * A column's verdict, the first failed keep-rule check deciding, in this
 * order: coverage, precision, margin, the sign test, then flips for a Jev
 * column. The sign test's p rides on every outcome.
 * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number }} counts
 * @returns {{ verdict: 'keep'|'kill (precision)'|'stop (coverage)'|'stop (margin)'|'stop (sign test)'|'stop (flips)', p: number }}
 */
export function decideVerdict({ backend, K, M, A, B, W, L, TP, FP, F }) {
  const sign = binomialTail(W, W + L);
  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', p: sign.p };
  if (!(TP + FP >= 1 && 5 * TP >= 4 * (TP + FP))) return { verdict: 'kill (precision)', p: sign.p };
  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', p: sign.p };
  if (!sign.below) return { verdict: 'stop (sign test)', p: sign.p };
  if (backend === 'jev' && !(10 * F <= 3 * M)) return { verdict: 'stop (flips)', p: sign.p };
  return { verdict: 'keep', p: sign.p };
}

/**
 * The notice a column prints before its verdict when the report an earlier run
 * left behind names another identity: a changed Deem commit pair, or a changed
 * Jev provider or model. Null when no earlier column exists or it matches the
 * identity this run used.
 * @param {string} backend
 * @param {object|null} stored Parsed report from an earlier run.
 * @param {{ modelCommit?: string, sourceCommit?: string, provider?: string, model?: string }} identity
 * @returns {string|null}
 */
function requalifyNotice(backend, stored, identity) {
  const prior = stored?.columns?.[backend];
  if (prior === undefined || prior === null) return null;
  if (backend === 'deem' && (prior.modelCommit !== identity.modelCommit || prior.sourceCommit !== identity.sourceCommit)) {
    return 'requalify: model commit changed';
  }
  if (backend === 'jev' && (prior.provider !== identity.provider || prior.model !== identity.model)) {
    return 'requalify: model changed';
  }
  return null;
}

/**
 * One column's verdict line: the verdict, every count, the sign test's p at
 * four significant digits, the labels hash and the column's identity suffix.
 * The flips count belongs to a Jev column, so a Deem column prints n/a. A
 * stored report that names another identity puts its requalify notice on the
 * line ahead of the verdict.
 * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number, p: number, stored?: object|null, model?: string, modelCommit?: string, sourceCommit?: string, provider?: string }} summary
 * @param {string} labelsSha Truncated hash of the labels the column measured.
 * @param {string} [suffix] Column identity text, appended when non-empty.
 * @returns {string}
 */
export function verdictLine(summary, labelsSha, suffix = '') {
  const { backend, verdict, K, M, A, B, W, L, TP, FP, F, p } = summary;
  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
    + ` TP=${TP} FP=${FP} F=${backend === 'jev' ? F : 'n/a'} p=${p.toPrecision(4)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
  const notice = requalifyNotice(backend, summary.stored, summary);
  return notice === null ? line : `${notice}\n${line}`;
}

/**
 * Mean squared error of a column's probabilities against the outcomes: the
 * Brier score. Each entry pairs the probability the backend gave a row with
 * the row's outcome, 1 for a window that still shows the claim and 0 for a
 * drifted one, since the probability is the model's yes. Entries
 * without a finite probability in [0, 1] are skipped, and nothing counted has
 * no score.
 * @param {Array<{ probability: number, actual: number|boolean }>} probabilities
 * @returns {number|null}
 */
export function brierScore(probabilities) {
  let sum = 0;
  let counted = 0;
  for (const entry of probabilities) {
    const probability = entry.probability;
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) continue;
    sum += (probability - (entry.actual ? 1 : 0)) ** 2;
    counted += 1;
  }
  return counted === 0 ? null : sum / counted;
}

/**
 * Nearest-rank percentile. Empty lists have no rank.
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number|null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

// ───────────────────────────────────────────────────────────────────
// 6. DEEM ARM
// ───────────────────────────────────────────────────────────────────

// The gate reads the local model's health once and passes no key; a failed
// check skips the arm, and one noul call per row is all the arm sends.

/** Pinned Deem model name the health check accepts. */
export const DEEM_MODEL = 'deem-0.8-v1';

/** Deem noul p50 in milliseconds, from deem-local.md, used for the wall-time estimate. */
export const DEEM_P50_MS = 60.5;

/** Bounds the health spawn; cli-deem bounds its own HTTP health request. */
export const HEALTH_TIMEOUT_MS = 10000;

/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
const REPO_CLI_DEEM = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs');

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped, and a missing path, a directory or a file
 * that cannot be executed is not a match.
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string|null}
 */
export function which(name, env) {
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
 * One health check. An unreachable binary, a stub backend or a wrong model is
 * a failed check the caller prints as a skip.
 * @param {string[]} cmd Command from deemCommand.
 * @param {Record<string, string|undefined>} env Environment for the call.
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
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
 * Prints the health line, or a skip line when the check fails. A refused model
 * or a body that does not fit prints the response it read beside the skip.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined> }} ctx Line writer and environment.
 * @returns {{ passed: boolean, cmd: string[], reason?: string }}
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

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF. A spawn error is code 127 with the
 * message as stderr.
 * @param {string} file Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdinText Text written to stdin, then closed.
 * @param {Record<string, string|undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
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
 * @param {string|undefined} outDir Directory that holds calls.jsonl.
 * @returns {{ append: (record: object) => void }}
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
 * Probability of one noul answer. A body that does not parse, or a noul that
 * is not a finite number in [0, 1], is an unmeasured call, not a crash.
 * @param {string} stdout Raw stdout of one noul call.
 * @returns {number|null}
 */
function parseNoul(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const value = parsed?.answers?.answer?.noul;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) return null;
  return value;
}

/**
 * One noul call per labeled row whose sentence and window the recorded commit
 * still holds, with one calls.jsonl record per spawn and one retry behind a
 * fresh health check when a call exits 4. A stop prints the line and the rows
 * that finished, and leaves the column and verdict unprinted.
 * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }>, labelsSha: string }} plan
 * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate Passing deemGate result.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, callLog: { append: (record: object) => void }, stored: object|null }} ctx Line writer, environment, timeout, call log and an earlier run's report.
 * @returns {Promise<{ column: object } | { stopped: string, partialRows: number }>}
 */
export async function runDeemArm(plan, gate, ctx) {
  const labeled = plan.rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
  const ready = [];
  for (const row of labeled) {
    const entry = plan.windows.get(row.id);
    // A row whose document or target the recorded commit does not hold has no
    // state to send, so it stays unmeasured and costs no call.
    if (entry === undefined || entry.sentence === '' || entry.windowText === '') continue;
    ready.push({ row, entry });
  }
  const K = labeled.length;
  ctx.out(`deem: nothing leaves the machine; planned calls: ${ready.length}; estimated wall time: ${(ready.length * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the noul p50 in deem-local.md`);

  const results = new Map();
  const wallTimes = [];
  let finished = 0;

  const stop = (line) => {
    ctx.out(line);
    ctx.out(`deem: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  };

  for (const { row, entry } of ready) {
    const state = JSON.stringify({ sentence: entry.sentence, target: row.target, window: entry.windowText });
    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', INSTRUCTION];

    let call = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, ctx.timeoutMs);
    wallTimes.push(call.wallMs);

    if (!call.timedOut && call.code === 4) {
      ctx.callLog.append({
        rowId: row.id,
        rerun: 0,
        wallMs: call.wallMs,
        exitCode: call.code,
        backend: 'deem',
        probability: null,
        flag: null,
        status: 'unmeasured',
        modelId: gate.model,
        modelCommit: gate.modelCommit,
        sourceCommit: gate.sourceCommit,
      });
      const health = readDeemHealth(gate.cmd, ctx.env);
      if (!health.ok) return stop('deem arm stopped: server gone');
      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
        return stop('deem arm stopped: model commit changed mid-run');
      }

      call = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, ctx.timeoutMs);
      wallTimes.push(call.wallMs);
    }

    let probability = null;
    let flag = null;
    let status = 'unmeasured';
    let stopLine = null;
    if (call.timedOut) {
      status = 'unmeasured_timeout';
    } else if (call.code === 0) {
      probability = parseNoul(call.stdout);
      if (probability === null) {
        status = 'unmeasured';
      } else {
        status = 'measured';
        flag = probability < FLAG_THRESHOLD;
      }
    } else if (call.code === 2) {
      stopLine = 'deem arm stopped: usage error';
    } else if (call.code === 3) {
      stopLine = 'deem arm stopped: backend refused';
    } else if (call.code === 130) {
      stopLine = 'deem arm stopped: interrupted';
    }

    ctx.callLog.append({
      rowId: row.id,
      rerun: 0,
      wallMs: call.wallMs,
      exitCode: call.code,
      backend: 'deem',
      probability,
      flag,
      status,
      modelId: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
    });
    if (stopLine !== null) return stop(stopLine);
    results.set(row.id, { probability, flag, status });
    finished += 1;
  }

  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let TP = 0;
  let FP = 0;
  const scored = [];
  for (const { row, entry } of ready) {
    const result = results.get(row.id);
    if (result === undefined || result.status !== 'measured') continue;
    M += 1;
    const drifted = row.verdict !== 'supports';
    const flagged = result.flag === true;
    if (flagged && drifted) TP += 1;
    if (flagged && !drifted) FP += 1;
    const modelRight = flagged === drifted;
    if (modelRight) A += 1;
    const comparatorRight = flagByIdentifierOverlap(entry.sentence, entry.windowText, row.target) === drifted;
    if (comparatorRight) B += 1;
    if (modelRight && !comparatorRight) W += 1;
    if (!modelRight && comparatorRight) L += 1;
    scored.push({ probability: result.probability, actual: drifted ? 0 : 1 });
  }

  const { verdict, p } = decideVerdict({ backend: 'deem', K, M, A, B, W, L, TP, FP, F: 0 });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column deem: rows=${K} measured=${M} unmeasured=${K - M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  const brier = brierScore(scored);
  ctx.out(`brier deem: ${brier === null ? 'none' : brier.toFixed(4)}`);
  ctx.out('flips: not applicable (deem noul)');

  const line = verdictLine(
    { backend: 'deem', verdict, K, M, A, B, W, L, TP, FP, F: 0, p, stored: ctx.stored, model: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
    plan.labelsSha,
    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
  );
  for (const text of line.split('\n')) ctx.out(text);

  return {
    column: {
      backend: 'deem',
      verdict,
      K,
      M,
      A,
      B,
      W,
      L,
      TP,
      FP,
      F: 0,
      p,
      latency,
      model: gate.model,
      modelCommit: gate.modelCommit,
      sourceCommit: gate.sourceCommit,
      line,
    },
  };
}

/**
 * Parsed report.json written by an earlier run into the same out directory.
 * @param {string|undefined} outDir Directory that may hold report.json.
 * @returns {object|null} The parsed report, or null when outDir is empty, the
 *   file is missing, or the file does not parse.
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
 * The report.json body: the census totals, the label set, the comparator
 * scores that gated the run, one entry per backend in columns, stopped and
 * skipped, and the keep rule the columns were measured against.
 * @param {{ census: object, labels: { path: string, sha256: string, rows: number, labeled: number }, comparators: object, columns?: object, stopped?: object, skipped?: object }} input
 * @returns {object}
 */
export function buildReport({ census, labels, comparators, columns = {}, stopped = {}, skipped = {} }) {
  return {
    census: census.total,
    commit: census.commit,
    labels: {
      path: labels.path,
      sha256: labels.sha256,
      rows: labels.rows,
      labeled: labels.labeled,
    },
    comparators: {
      K: comparators.K,
      flagNothing: comparators.flagNothing,
      identifierOverlap: comparators.identifierOverlap,
    },
    baselineMethod: comparators.baselineMethod,
    headroom: comparators.headroom,
    winnable: comparators.winnable,
    keepRule: KEEP_RULE_LINE,
    margin: MARGIN_LINE,
    columns,
    stopped,
    skipped,
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. JEV ARM
// ───────────────────────────────────────────────────────────────────

// The gate reads the pinned version and the credential the binary resolves
// itself; the arm asks every row three times so a flip rate can be read from
// the repeated answers, and every call carries the same provider.

/** Pinned jev version the gate accepts. */
export const JEV_VERSION = 'jev 0.6.2';

/** Calls per row, so a repeated answer can be told from a flip. */
export const JEV_RERUNS = 3;

/** Wait behind the one retry an exit 4 earns. */
export const BACKOFF_MS = 2000;

/**
 * Identity line, then the pinned version and a credential check. A miss prints
 * a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number }} ctx Line writer, environment and per-call timeout.
 * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }} True when the gate passed; a failed gate carries the skip line it printed.
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
 * One auth test, then three noul calls per labeled row whose sentence and
 * window the recorded commit still holds, with one calls.jsonl record per
 * spawn and one backoff retry when a call exits 4. A row is measured only
 * when every rerun returned a probability, its flag is the modal flag over
 * those reruns, and the votes the modal flag lacks count as flips. A stop
 * prints the line and the rows that finished, and leaves the column and
 * verdict unprinted.
 * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, windowText: string }>, labelsSha: string }} plan
 * @param {{ path: string, provider: string }} gate Passing jevGate result.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, backoffMs: number, callLog: { append: (record: object) => void }, stored: object|null }} ctx Line writer, environment, timeout, retry wait, the call log and an earlier run's report.
 * @returns {Promise<{ column: object } | { stopped: string, partialRows: number }>}
 */
export async function runJevArm(plan, gate, ctx) {
  const labeled = plan.rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
  const ready = [];
  let chars = 0;
  for (const row of labeled) {
    const entry = plan.windows.get(row.id);
    // A row whose document or target the recorded commit does not hold has no
    // state to send, so it stays unmeasured and costs no call.
    if (entry === undefined || entry.sentence === '' || entry.windowText === '') continue;
    const state = JSON.stringify({ sentence: entry.sentence, target: row.target, window: entry.windowText });
    ready.push({ row, entry, state });
    chars += state.length + INSTRUCTION.length;
  }
  const K = labeled.length;
  chars *= JEV_RERUNS;
  ctx.out(`jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: ${JEV_RERUNS * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const wallTimes = [];
  let finished = 0;

  const stop = (line) => {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  };

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
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
    rowId: null,
    rerun: null,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    backend: 'jev',
    probability: null,
    flag: null,
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
  for (const { row, entry, state } of ready) {
    const callArgs = ['noul', '--provider', gate.provider, '-q', INSTRUCTION];
    const reruns = [];
    let stopLine = null;

    for (let rerun = 0; rerun < JEV_RERUNS; rerun += 1) {
      let call = await spawnCall(gate.path, callArgs, state, ctx.env, ctx.timeoutMs);
      wallTimes.push(call.wallMs);

      if (!call.timedOut && call.code === 4) {
        ctx.callLog.append({
          rowId: row.id,
          rerun,
          wallMs: call.wallMs,
          exitCode: call.code,
          backend: 'jev',
          probability: null,
          flag: null,
          status: 'unmeasured',
          jevVersion: '0.6.2',
          provider: gate.provider,
          model,
        });
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        call = await spawnCall(gate.path, callArgs, state, ctx.env, ctx.timeoutMs);
        wallTimes.push(call.wallMs);
      }

      let probability = null;
      let flag = null;
      let status = 'unmeasured';
      if (call.timedOut) {
        status = 'unmeasured_timeout';
      } else if (call.code === 0) {
        probability = parseNoul(call.stdout);
        if (probability !== null) {
          flag = probability < FLAG_THRESHOLD;
          status = 'measured';
        }
      } else if (call.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (call.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (call.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append({
        rowId: row.id,
        rerun,
        wallMs: call.wallMs,
        exitCode: call.code,
        backend: 'jev',
        probability,
        flag,
        status,
        jevVersion: '0.6.2',
        provider: gate.provider,
        model,
      });
      if (stopLine !== null) return stop(stopLine);
      reruns.push({ probability, flag, measured: status === 'measured' });
    }

    answers.set(row.id, reruns);
    finished += 1;
  }

  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let TP = 0;
  let FP = 0;
  let F = 0;
  const scored = [];
  for (const { row, entry } of ready) {
    const reruns = answers.get(row.id);
    if (reruns === undefined || !reruns.every((rerun) => rerun.measured)) continue;
    M += 1;
    const votes = reruns.filter((rerun) => rerun.flag === true).length;
    const top = Math.max(votes, JEV_RERUNS - votes);
    F += JEV_RERUNS - top;
    const flagged = 2 * votes > JEV_RERUNS;
    const drifted = row.verdict !== 'supports';
    if (flagged && drifted) TP += 1;
    if (flagged && !drifted) FP += 1;
    const modelRight = flagged === drifted;
    if (modelRight) A += 1;
    const comparatorRight = flagByIdentifierOverlap(entry.sentence, entry.windowText, row.target) === drifted;
    if (comparatorRight) B += 1;
    if (modelRight && !comparatorRight) W += 1;
    if (!modelRight && comparatorRight) L += 1;
    for (const rerun of reruns) scored.push({ probability: rerun.probability, actual: drifted ? 0 : 1 });
  }

  const { verdict, p } = decideVerdict({ backend: 'jev', K, M, A, B, W, L, TP, FP, F });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column jev: rows=${K} measured=${M} unmeasured=${K - M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  const brier = brierScore(scored);
  ctx.out(`brier jev: ${brier === null ? 'none' : brier.toFixed(4)}`);

  const line = verdictLine(
    { backend: 'jev', verdict, K, M, A, B, W, L, TP, FP, F, p, stored: ctx.stored, provider: gate.provider, model },
    plan.labelsSha,
    `jev_version=0.6.2 provider=${gate.provider} model=${model}`,
  );
  for (const text of line.split('\n')) ctx.out(text);

  return {
    column: {
      backend: 'jev',
      verdict,
      K,
      M,
      A,
      B,
      W,
      L,
      TP,
      FP,
      F,
      p,
      latency,
      jevVersion: '0.6.2',
      provider: gate.provider,
      model,
      line,
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// ENTRY POINT
// ───────────────────────────────────────────────────────────────────

/**
 * Prints the census, the dead citations and the label-gate summary, then the
 * arm each switch names. The default run spawns no model binary, writes no
 * file and reads no credential beyond the labels file; --draw writes the
 * labels file instead of printing.
 * @param {string[]} argv Arguments after the script path.
 * @param {Object} [deps]
 * @param {string} [deps.repoRoot] Repository root. Default REPO_ROOT.
 * @param {(line: string) => void} [deps.out] Line writer. Default writes the line plus '\n' to stdout.
 * @param {(line: string) => void} [deps.err] Line writer. Default writes the line plus '\n' to stderr.
 * @param {Record<string, string|undefined>} [deps.env] Arm environment. Default process.env.
 * @param {number} [deps.timeoutMs] Per-call timeout. Default CALL_TIMEOUT_MS.
 * @param {number} [deps.backoffMs] Retry wait behind an exit 4. Default BACKOFF_MS.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        draw: { type: 'boolean' },
        seed: { type: 'string' },
        jev: { type: 'boolean' },
        deem: { type: 'boolean' },
        out: { type: 'string' },
        labels: { type: 'string' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values } = parsed;
  const labelsPath = values.labels ?? LABELS_PATH;

  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
    err('--deem and --jev need --out <dir> so every call is recorded');
    return 2;
  }

  let seed = null;
  if (values.draw === true) {
    const seedText = typeof values.seed === 'string' ? values.seed.trim() : '';
    seed = seedText === '' ? Number.NaN : Number(seedText);
    if (!Number.isInteger(seed)) {
      err('--draw needs an integer --seed <n>');
      return 2;
    }
    if (fs.existsSync(labelsPath)) {
      let existing;
      try {
        existing = parseLabels(fs.readFileSync(labelsPath, 'utf8'));
      } catch (error) {
        err(error instanceof Error ? error.message : String(error));
        return 2;
      }
      if (existing.some((row) => row.labeler !== null && row.labeler !== undefined)) {
        err(`draw: refusing to overwrite ${labelsPath}, operator labels present`);
        return 2;
      }
    }
  }

  let census;
  try {
    census = buildCensus(repoRoot, listTrackedFiles(repoRoot));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  if (values.draw === true) {
    let rows;
    try {
      rows = drawRows({ census, repoRoot, commit: census.commit, seed });
      fs.writeFileSync(labelsPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
    const counts = labelCounts(rows);
    out(`draw: path=${labelsPath} seed=${seed} commit=${census.commit.slice(0, 12)} rows=${rows.length} live=${counts.live} constructed=${counts.constructed}`);
    return 0;
  }

  let labelRows = [];
  let labelsText = null;
  if (fs.existsSync(labelsPath)) {
    try {
      labelsText = fs.readFileSync(labelsPath, 'utf8');
      labelRows = parseLabels(labelsText);
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }

  for (const entry of census.perSkill) {
    out(`skill ${entry.skill}: citations=${entry.citations} in_range=${entry.in_range} past_end=${entry.past_end} ambiguous=${entry.ambiguous} unresolved=${entry.unresolved} dead=${entry.dead}`);
  }
  out(`citations=${census.total.citations} in_range=${census.total.in_range} past_end=${census.total.past_end} ambiguous=${census.total.ambiguous} unresolved=${census.total.unresolved} refused=${census.refused} dead=${census.total.dead} commit=${census.commit.slice(0, 12)}`);
  for (const entry of census.dead) {
    out(`cite dead: ${entry.doc}:${entry.line} -> ${entry.target}:${entry.targetLine}`);
  }
  const windows = buildWindows(repoRoot, labelRows);
  const summary = summaryLines({ rows: labelRows, windows });
  for (const line of summary.lines) {
    out(line);
  }

  const armsRequested = values.jev === true || values.deem === true;
  let callLog = null;
  let stored = null;
  if (armsRequested) {
    callLog = createCallLog(values.out);
    stored = readStoredReport(values.out);
  }

  const columns = {};
  const stopped = {};
  const skipped = {};

  // The Jev arm runs first, on its own gate; a failed check never starts the
  // other backend.
  if (values.jev === true) {
    const check = jevGate({ out, env, timeoutMs });
    if (!check.passed) {
      skipped.jev = check.reason;
    } else if (summary.gate !== 'planned') {
      const line = `jev arm skipped: ${summary.gate === 'stop' ? 'label gate' : summary.gate}`;
      out(line);
      skipped.jev = line;
    } else {
      const labelsSha = labelsText === null ? 'none' : sha256Hex(labelsText).slice(0, 12);
      const result = await runJevArm(
        { rows: labelRows, windows, labelsSha },
        check,
        { out, env, timeoutMs, backoffMs, callLog, stored },
      );
      if (result.stopped === undefined) {
        columns.jev = result.column;
      } else {
        stopped.jev = { line: result.stopped, partialRows: result.partialRows };
      }
    }
  }

  // A switch runs its gate whenever it is set; a failed check prints its skip
  // line and leaves every earlier line as it was.
  if (values.deem === true) {
    const check = deemGate({ out, env });
    if (!check.passed) {
      skipped.deem = check.reason;
    } else if (summary.gate !== 'planned') {
      const line = `deem arm skipped: ${summary.gate === 'stop' ? 'label gate' : summary.gate}`;
      out(line);
      skipped.deem = line;
    } else {
      const labelsSha = labelsText === null ? 'none' : sha256Hex(labelsText).slice(0, 12);
      const result = await runDeemArm(
        { rows: labelRows, windows, labelsSha },
        check,
        { out, env, timeoutMs, callLog, stored },
      );
      if (result.stopped === undefined) {
        columns.deem = result.column;
      } else {
        stopped.deem = { line: result.stopped, partialRows: result.partialRows };
      }
    }
  }

  // The report follows the arms; a gate that stopped before them wrote nothing.
  if (armsRequested && summary.gate === 'planned') {
    const comparators = scoreComparators(labelRows, windows);
    const report = buildReport({
      census,
      labels: {
        path: labelsPath,
        sha256: labelsText === null ? '' : sha256Hex(labelsText),
        rows: labelRows.length,
        labeled: labelCounts(labelRows).labeled,
      },
      comparators,
      columns,
      stopped,
      skipped,
    });
    fs.mkdirSync(values.out, { recursive: true });
    fs.writeFileSync(path.join(values.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }

  return 0;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = await main(process.argv.slice(2));
}
