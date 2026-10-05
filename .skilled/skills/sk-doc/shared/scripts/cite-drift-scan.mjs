#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Scan
// ───────────────────────────────────────────────────────────────────
// Measures whether a sentence's citation still points at the code window it
// claims. The default run prints the census and makes no model call, reads no
// credential and writes no file. --advise <doc>... checks only the citations
// in those documents, stays silent without a stored Jev credential and always
// exits 0.
//
// Usage:
//   node cite-drift-scan.mjs [--corpus <skills|specs|all>] [--draw --seed <n>] [--jev] [--out <dir>] [--labels <file>] | --advise <doc>... [--out <dir>]
//
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, refused before any call.
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import {
  BACKOFF_MS,
  CITATION_RE,
  INSTRUCTION,
  KEEP_RULE_LINE,
  WINDOW_RADIUS_LINES,
  jevGate,
  labelCounts,
  measurementIdentity,
  runAdvise,
  runJevArm,
  scoreComparators,
  sha256Hex,
} from './classifier-cite-drift-scan.mjs';

export {
  ADVISE_BUDGET_MS,
  ADVISE_MAX_CITATIONS,
  ADVISE_OPT_OUT_ENV,
  ADVISE_PREFIX,
  BACKOFF_MS,
  CITATION_RE,
  FLAG_THRESHOLD,
  INSTRUCTION,
  JEV_RERUNS,
  JEV_VERSION,
  KEEP_RULE_LINE,
  WINDOW_RADIUS_LINES,
  binomialTail,
  brierScore,
  decideVerdict,
  flagByIdentifierOverlap,
  identifierTokens,
  jevGate,
  labelCounts,
  nearestRank,
  runAdvise,
  runJevArm,
  scoreComparators,
  sha256Hex,
  spawnCall,
  verdictLine,
  which,
} from './classifier-cite-drift-scan.mjs';

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

/** Opening or closing line of a fenced block; fenced lines carry no prose. */
export const FENCE_RE = /^\s*(?:```|~~~)/;

/** Markdown paragraphs stop at blank lines, fences and headings. */
function paragraphBounds(lines, lineIndex) {
  const isBoundary = (line) => line.trim() === '' || FENCE_RE.test(line) || /^\s{0,3}#{1,6}(?:\s|$)/.test(line);
  let start = lineIndex;
  let end = lineIndex;
  while (start > 0 && !isBoundary(lines[start - 1])) start -= 1;
  while (end + 1 < lines.length && !isBoundary(lines[end + 1])) end += 1;
  return { start, end };
}

/** The full paragraph around one line, the unit a claim is read in. */
function paragraphClaim(lines, lineIndex) {
  const { start, end } = paragraphBounds(lines, lineIndex);
  return lines.slice(start, end + 1).join('\n').trim();
}

/** Evidence-only pointers have no proposition for a live draw to assess. */
function hasClaim(claim) {
  const text = claim
    .replace(CITATION_RE, ' ')
    .replace(/(?:\*\*)?(?:evidence|source|reference)(?:\*\*)?\s*[:：-]?/gi, ' ')
    .replace(/[`*_]/g, ' ')
    .trim();
  return /[\p{L}\p{N}]/u.test(text);
}

/** Usage line printed when an invocation misses an input. */
export const USAGE = 'usage: node cite-drift-scan.mjs [--corpus <skills|specs|all>] [--moved] [--draw --seed <n>] [--jev] [--out <dir>] [--labels <file>] | --advise <doc>... [--out <dir>]';

/** Prefix redirect table beside the script, derived from the git rename record. */
export const REDIRECTS_PATH = path.join(SCRIPT_DIR, 'cite-drift-redirects.json');

/** Doc families a census can cover; skills keeps the historical default. */
export const CORPORA = ['skills', 'specs', 'all'];

/** Every census status, in the order the report prints them. */
export const STATUSES = [
  'in_range', 'past_end', 'moved_in_range', 'moved_past_end', 'basename_only',
  'ambiguous', 'unresolved', 'refused', 'missing',
];

/** A rule needs this many agreeing rename records before it may move a citation. */
export const REDIRECT_MIN_RECORDS = 50;

/** Share of the records under a prefix that must agree on one destination. */
export const REDIRECT_MIN_AGREEMENT = 0.95;

// A path renamed in stages needs several rewrites; the cap stops a rule cycle.
const REDIRECT_MAX_HOPS = 8;

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

/** Rows carrying a verdict that the label gate needs before scoring. */
export const LABEL_GATE = 40;

/** Bounds one model call; a spawn past this is unmeasured, not an answer. */
export const CALL_TIMEOUT_MS = 90000;

/** The 10-point gain over the baseline that the keep rule requires. */
export const MARGIN_LINE = 'margin: 0.10';

// ───────────────────────────────────────────────────────────────────
// 2. CENSUS
// ───────────────────────────────────────────────────────────────────

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

// A path containing a space borrows the words before the match as part of its
// name; three words back is the cap, so ordinary prose cannot send the
// resolver chasing a whole sentence.
const LEAD_WORDS_RE = /([A-Za-z0-9_./-]+(?: +[A-Za-z0-9_./-]+)*) *$/;

/** The words a spaced path could have borrowed, nearest last, single-spaced. */
function citationLead(line, matchIndex) {
  const leadMatch = line.slice(0, matchIndex).match(LEAD_WORDS_RE);
  if (leadMatch === null) return '';
  return leadMatch[1].split(/ +/).slice(-3).join(' ');
}

/**
 * Citations in the prose of a document: every `path:line` or `path:line-end`
 * span outside a fenced block, one entry per occurrence in source order. The
 * sentence is the trimmed line that carries the citation; claim is its full
 * paragraph, which gives the reader the context the pointer depends on. The
 * lead is the run of at most three words before the match on the same line,
 * which a path containing spaces borrows to resolve as one name.
 * @param {string} text
 * @param {string} doc Repo-relative path of the citing document.
 * @returns {Array<{ doc: string, line: number, sentence: string, claim: string, target: string, targetLine: number, targetLineEnd: number|null, lead: string }>}
 */
export function extractCitations(text, doc) {
  const citations = [];
  const lines = text.split(/\r?\n/);
  let inFence = false;
  // One string per paragraph: a megabyte table paragraph holding thousands of
  // citations would otherwise be copied once per citation and exhaust the heap.
  let paragraph = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const match of line.matchAll(CITATION_RE)) {
      if (paragraph === null || index > paragraph.end) {
        const { start, end } = paragraphBounds(lines, index);
        paragraph = { end, claim: lines.slice(start, end + 1).join('\n').trim() };
      }
      citations.push({
        doc,
        line: index + 1,
        sentence: line.trim(),
        claim: paragraph.claim,
        target: match[1],
        targetLine: Number(match[2]),
        targetLineEnd: match[3] === undefined ? null : Number(match[3]),
        lead: citationLead(line, match.index),
      });
    }
  }
  return citations;
}

/**
 * Worktree line count of one tracked path, or null when the worktree lacks it.
 * A census cites the same target many times, so a shared cache reads it once.
 * @param {string} repoPath
 * @param {string} repoRoot
 * @param {Map<string, number|null>|null} lineCounts
 * @returns {number|null}
 */
function worktreeLineCount(repoPath, repoRoot, lineCounts) {
  if (lineCounts?.has(repoPath)) return lineCounts.get(repoPath);
  let lineCount = null;
  try {
    const text = fs.readFileSync(path.join(repoRoot, repoPath), 'utf8');
    const lines = text.split(/\r?\n/);
    lineCount = text === '' ? 0 : (text.endsWith('\n') ? lines.length - 1 : lines.length);
  } catch {
    lineCount = null;
  }
  lineCounts?.set(repoPath, lineCount);
  return lineCount;
}

/**
 * Status of a tracked target. The worktree copy decides missing, and its line
 * count decides whether the cited line or range fits.
 * @param {string} repoPath Repo-relative path that the index tracks.
 * @param {{ targetLine: number, targetLineEnd: number|null }} citation
 * @param {string} repoRoot
 * @param {Map<string, number|null>|null} [lineCounts]
 * @returns {{ status: 'in_range'|'past_end'|'missing', path: string, endLine: number|null }}
 */
function resolveTracked(repoPath, citation, repoRoot, lineCounts = null) {
  const endLine = citation.targetLineEnd ?? citation.targetLine;
  const lineCount = worktreeLineCount(repoPath, repoRoot, lineCounts);
  if (lineCount === null) return { status: 'missing', path: repoPath, endLine: null };
  if (citation.targetLine > lineCount || endLine > lineCount) {
    return { status: 'past_end', path: repoPath, endLine };
  }
  return { status: 'in_range', path: repoPath, endLine };
}

// Tracked sets are rebuilt per run, so the index lives exactly as long as its set.
const BASENAME_INDEXES = new WeakMap();

/** Tracked paths grouped by basename, built once per tracked set. */
function basenameIndex(tracked) {
  let index = BASENAME_INDEXES.get(tracked);
  if (index !== undefined) return index;
  index = new Map();
  for (const entry of tracked) {
    const base = path.posix.basename(entry);
    const group = index.get(base);
    if (group === undefined) index.set(base, [entry]); else group.push(entry);
  }
  BASENAME_INDEXES.set(tracked, index);
  return index;
}

const SORTED_REDIRECTS = new WeakMap();

/** The redirect table longest prefix first, so the first match is the most specific. */
function specificFirst(redirects) {
  let sorted = SORTED_REDIRECTS.get(redirects);
  if (sorted === undefined) {
    sorted = [...redirects].sort((left, right) => right.from.length - left.from.length
      || (left.from < right.from ? -1 : left.from > right.from ? 1 : 0));
    SORTED_REDIRECTS.set(redirects, sorted);
  }
  return sorted;
}

/**
 * Tracked path a redirect chain reaches from one candidate, or null. The most
 * specific rule rewrites each hop, and a path renamed in stages takes one hop
 * per stage until a tracked path appears.
 * @param {string} candidate
 * @param {Array<{ from: string, to: string }>} redirects Longest `from` first.
 * @param {Set<string>} tracked
 * @returns {string|null}
 */
function redirectTarget(candidate, redirects, tracked) {
  const seen = new Set([candidate]);
  let current = candidate;
  for (let hop = 0; hop < REDIRECT_MAX_HOPS; hop += 1) {
    const rule = redirects.find((entry) => current.startsWith(entry.from));
    if (rule === undefined) return null;
    const next = rule.to + current.slice(rule.from.length);
    if (tracked.has(next)) return next;
    if (seen.has(next)) return null;
    seen.add(next);
    current = next;
  }
  return null;
}

/**
 * Resolved location of one citation, tested in order: a lead's every suffix
 * joined to the target as one spaced path, then the target as written, each at
 * the citing document's own folder, the repository root and the citing
 * document's skill root; then each of those rewritten by the redirect table;
 * then a unique basename across the tracked set. Only a tracked path is read,
 * so an untracked copy is refused rather than opened. A spaced path counts
 * only when the whole joined name is tracked; it skips the table and the
 * basename match. A redirect or basename match is a different path from the
 * one written, so it never counts as in_range: moved_in_range and
 * moved_past_end name a rename the table vouches for, and basename_only names a
 * guess no rename record backs.
 * @param {{ doc: string, target: string, targetLine: number, targetLineEnd: number|null, lead?: string }} citation
 * @param {{ tracked: Set<string>, repoRoot: string, skillRoot?: string|null, redirects?: Array<{ from: string, to: string }>, lineCounts?: Map<string, number|null>|null }} context
 * @returns {{ status: 'in_range'|'past_end'|'moved_in_range'|'moved_past_end'|'basename_only'|'ambiguous'|'unresolved'|'refused'|'missing', path: string|null, endLine: number|null }}
 */
export function resolveCitation(citation, { tracked, repoRoot, skillRoot = null, redirects = [], lineCounts = null }) {
  const targetBase = path.posix.basename(citation.target);
  if (targetBase.startsWith('.env')) return { status: 'refused', path: null, endLine: null };

  const candidates = [
    path.posix.join(path.posix.dirname(citation.doc), citation.target),
    citation.target,
  ];
  if (typeof skillRoot === 'string' && skillRoot !== '') {
    candidates.push(path.posix.join(skillRoot, citation.target));
  }

  // 'REPO RULES.md:2' names one file, so a non-empty lead tries every suffix
  // of its words joined to the target, longest first, at the same bases.
  if (typeof citation.lead === 'string' && citation.lead !== '') {
    const leadWords = citation.lead.split(' ');
    for (let cut = 0; cut < leadWords.length; cut += 1) {
      const spaced = `${leadWords.slice(cut).join(' ')} ${citation.target}`;
      const spacedCandidates = [
        path.posix.join(path.posix.dirname(citation.doc), spaced),
        spaced,
      ];
      if (typeof skillRoot === 'string' && skillRoot !== '') {
        spacedCandidates.push(path.posix.join(skillRoot, spaced));
      }
      for (const candidate of spacedCandidates) {
        if (tracked.has(candidate)) return resolveTracked(candidate, citation, repoRoot, lineCounts);
      }
    }
  }

  for (const candidate of candidates) {
    if (tracked.has(candidate)) return resolveTracked(candidate, citation, repoRoot, lineCounts);
  }

  const rules = specificFirst(redirects);
  for (const candidate of candidates) {
    const moved = redirectTarget(candidate, rules, tracked);
    if (moved === null) continue;
    const resolved = resolveTracked(moved, citation, repoRoot, lineCounts);
    if (resolved.status === 'missing') return resolved;
    return { ...resolved, status: resolved.status === 'in_range' ? 'moved_in_range' : 'moved_past_end' };
  }

  const sameBase = basenameIndex(tracked).get(targetBase) ?? [];
  if (sameBase.length > 1) return { status: 'ambiguous', path: null, endLine: null };
  if (sameBase.length === 1) {
    return { status: 'basename_only', path: sameBase[0], endLine: citation.targetLineEnd ?? citation.targetLine };
  }

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(repoRoot, candidate))) {
      return { status: 'refused', path: null, endLine: null };
    }
  }
  return { status: 'unresolved', path: null, endLine: null };
}

/** Read one committed path once when census and draw share their cache. */
function readCommittedText(repoRoot, commit, filePath, readCache) {
  const cacheKey = `${commit}:${filePath}`;
  if (readCache?.has(cacheKey)) return readCache.get(cacheKey);
  const shown = spawnSync('git', ['-C', repoRoot, 'show', `${commit}:${filePath}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: GIT_MAX_BUFFER,
  });
  const text = shown.error || shown.status !== 0 ? null : (shown.stdout ?? '');
  readCache?.set(cacheKey, text);
  return text;
}

// A census reads every committed document once, so one `cat-file --batch` call
// per chunk pays a single git process where a `git show` per path paid one.
const PREFETCH_CHUNK_PATHS = 1000;

/**
 * Warm the read cache for many committed paths in bulk, storing exactly what
 * readCommittedText stores for each: the UTF-8 text under `${commit}:${path}`,
 * or null when the commit does not hold the path. Git names each requested
 * object on one stdin line and answers `<oid> <type> <size>`, the raw bytes
 * and a newline, or `<name> missing`. A path with a line feed would split into
 * two requests and shift every later reply onto the wrong path, so such a path
 * is left out of the batch and readCommittedText reads it on its own, where the
 * path travels as one argument. A failed chunk is fatal, never retried per
 * document.
 * @param {string} repoRoot
 * @param {string} commit
 * @param {string[]} filePaths Repo-relative paths to read at `commit`.
 * @param {Map<string, string|null>} readCache
 */
function prefetchCommitted(repoRoot, commit, filePaths, readCache) {
  const batchable = filePaths.filter((filePath) => !filePath.includes('\n'));
  for (let start = 0; start < batchable.length; start += PREFETCH_CHUNK_PATHS) {
    const chunk = batchable.slice(start, start + PREFETCH_CHUNK_PATHS);
    const result = spawnSync('git', ['-C', repoRoot, 'cat-file', '--batch'], {
      input: `${chunk.map((filePath) => `${commit}:${filePath}`).join('\n')}\n`,
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: GIT_MAX_BUFFER,
    });
    if (result.error || result.status !== 0 || result.stdout === null) {
      const reason = (result.stderr?.toString() ?? '').trim() || result.error?.message || `exit ${result.status}`;
      throw new Error(`git cat-file --batch failed at ${chunk[0]} in ${repoRoot}: ${reason}`);
    }
    const out = result.stdout;
    let offset = 0;
    for (const filePath of chunk) {
      const headerEnd = out.indexOf(0x0a, offset);
      if (headerEnd === -1) throw new Error(`git cat-file --batch truncated before ${filePath}`);
      const header = out.toString('utf8', offset, headerEnd);
      offset = headerEnd + 1;
      const cacheKey = `${commit}:${filePath}`;
      if (header.endsWith(' missing')) {
        readCache?.set(cacheKey, null);
        continue;
      }
      const sizeMatch = header.match(/^[0-9a-f]{40,64} \S+ (\d+)$/);
      if (sizeMatch === null) throw new Error(`git cat-file --batch malformed reply for ${filePath}`);
      const bodyEnd = offset + Number(sizeMatch[1]);
      if (bodyEnd >= out.length || out[bodyEnd] !== 0x0a) {
        throw new Error(`git cat-file --batch malformed reply for ${filePath}`);
      }
      readCache?.set(cacheKey, out.toString('utf8', offset, bodyEnd));
      offset = bodyEnd + 1;
    }
  }
}

/**
 * The redirect rules a census applies. A missing or malformed table is an
 * error, not an empty table, so a broken install cannot quietly drop every
 * moved citation into basename_only.
 * @param {string} [filePath] Default REDIRECTS_PATH.
 * @returns {Array<{ from: string, to: string, records: number }>}
 */
export function loadRedirects(filePath = REDIRECTS_PATH) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`redirect table ${filePath} unreadable: ${error instanceof Error ? error.message : String(error)}`);
  }
  const rules = parsed?.rules;
  const isRule = (rule) => typeof rule?.from === 'string' && rule.from.endsWith('/')
    && typeof rule.to === 'string' && (rule.to === '' || rule.to.endsWith('/'));
  if (!Array.isArray(rules) || !rules.every(isRule)) {
    throw new Error(`redirect table ${filePath} malformed: every rule needs a from and to directory prefix`);
  }
  return rules;
}

/**
 * Every old directory prefix that explains one rename by a prefix swap: the
 * shortest one, where the two paths stop sharing a tail, and each deeper one
 * along the shared tail. A changed basename is not a directory move, and an
 * empty old prefix would match every path in the tree, so both yield none.
 */
function renamePrefixes(from, to) {
  const oldParts = from.split('/');
  const newParts = to.split('/');
  let shared = 0;
  while (shared < oldParts.length && shared < newParts.length
    && oldParts[oldParts.length - 1 - shared] === newParts[newParts.length - 1 - shared]) {
    shared += 1;
  }
  const prefixes = [];
  for (let cut = oldParts.length - shared; cut < oldParts.length; cut += 1) {
    if (cut > 0) prefixes.push(`${oldParts.slice(0, cut).join('/')}/`);
  }
  return prefixes;
}

/** The destination prefix one record implies under a rule prefix, or null. */
function impliedDestination(record, prefix) {
  const rest = record.from.slice(prefix.length);
  if (!record.to.endsWith(rest)) return null;
  const cut = record.to.length - rest.length;
  if (cut > 0 && record.to[cut - 1] !== '/') return null;
  return record.to.slice(0, cut);
}

/**
 * Directory-prefix redirect rules from a `git log -M --diff-filter=R
 * --name-status --format=` listing. Every prefix that explains some rename is
 * a candidate. Its pool is the renames under it that moved at its level or
 * above, and the destination most of them imply is its proposed rewrite. A
 * rule survives with at least minRecords agreeing records and minAgreement of
 * its pool; a rule that only repeats its nearest accepted ancestor is dropped
 * as redundant, and one that differs stays as that ancestor's exception, since
 * the most specific prefix wins at resolution time.
 * @param {string} renameText
 * @param {{ minRecords?: number, minAgreement?: number }} [options]
 * @returns {{ records: number, rules: Array<{ from: string, to: string, records: number, agreement: number }> }}
 */
export function deriveRedirects(renameText, { minRecords = REDIRECT_MIN_RECORDS, minAgreement = REDIRECT_MIN_AGREEMENT } = {}) {
  const records = [];
  for (const line of renameText.split('\n')) {
    const fields = line.split('\t');
    if (fields.length !== 3 || !/^R\d*$/.test(fields[0])) continue;
    // Git C-quotes a path with unusual bytes; such a path never matches a citation.
    if (fields[1].startsWith('"') || fields[2].startsWith('"')) continue;
    records.push({ from: fields[1], to: fields[2] });
  }
  records.sort((left, right) => (left.from < right.from ? -1 : left.from > right.from ? 1 : 0));

  const prefixes = new Set();
  for (const record of records) {
    for (const prefix of renamePrefixes(record.from, record.to)) prefixes.add(prefix);
  }

  // Paths under one prefix are contiguous once sorted, so a binary search finds the pool.
  const firstAtOrAfter = (prefix) => {
    let low = 0;
    let high = records.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (records[middle].from < prefix) low = middle + 1; else high = middle;
    }
    return low;
  };

  const depth = (prefix) => prefix.split('/').length;
  const ordered = [...prefixes].sort((left, right) => depth(right) - depth(left)
    || (left < right ? -1 : left > right ? 1 : 0));
  // A rename whose shortest prefix sits deeper than a candidate moved something
  // inside that folder, which says nothing about where the folder itself went.
  const moveDepth = records.map((record) => renamePrefixes(record.from, record.to)[0]?.length ?? Infinity);
  // The deepest accepted rule covering each record, as resolution would pick it.
  const owner = new Array(records.length).fill(null);
  const repeats = (rule, prefix, destination) => rule.to === destination + rule.from.slice(prefix.length);
  const accepted = [];
  for (const prefix of ordered) {
    const start = firstAtOrAfter(prefix);
    let end = start;
    while (end < records.length && records[end].from.startsWith(prefix)) end += 1;
    if (end - start < minRecords) continue;

    const eligible = [];
    for (let index = start; index < end; index += 1) {
      if (moveDepth[index] <= prefix.length) eligible.push(index);
    }
    if (eligible.length < minRecords) continue;
    // Records a deeper rule already explains would vote for that rule's
    // destination, so the parent's proposal comes from the rest when any remain.
    const unowned = eligible.filter((index) => owner[index] === null);
    const votes = new Map();
    for (const index of unowned.length > 0 ? unowned : eligible) {
      const destination = impliedDestination(records[index], prefix);
      if (destination !== null) votes.set(destination, (votes.get(destination) ?? 0) + 1);
    }
    let best = null;
    for (const [destination, count] of votes) {
      if (best === null || count > best.count || (count === best.count && destination < best.destination)) {
        best = { destination, count };
      }
    }
    if (best === null) continue;

    // A deeper rule that sends its records elsewhere is an exception the
    // parent never applies to, so those records leave the parent's pool.
    const pool = eligible.filter((index) => owner[index] === null || repeats(owner[index], prefix, best.destination));
    const support = pool.filter((index) => impliedDestination(records[index], prefix) === best.destination).length;
    if (support < minRecords || support < minAgreement * pool.length) continue;
    const rule = { from: prefix, to: best.destination, support, pool: pool.length };
    accepted.push(rule);
    for (const index of pool) {
      if (owner[index] === null) owner[index] = rule;
    }
  }

  // Deepest first: a rule whose nearest surviving ancestor rewrites it the same
  // way adds nothing, while one that differs stays as that ancestor's exception.
  const byFrom = new Map(accepted.map((rule) => [rule.from, rule]));
  for (const rule of [...accepted].sort((left, right) => depth(right.from) - depth(left.from))) {
    const parts = rule.from.split('/').slice(0, -1);
    for (let cut = parts.length - 1; cut > 0; cut -= 1) {
      const parent = byFrom.get(`${parts.slice(0, cut).join('/')}/`);
      if (parent === undefined) continue;
      if (repeats(rule, parent.from, parent.to)) byFrom.delete(rule.from);
      break;
    }
  }

  const rules = [...byFrom.values()]
    .sort((left, right) => (left.from < right.from ? -1 : left.from > right.from ? 1 : 0))
    .map((rule) => ({
      from: rule.from,
      to: rule.to,
      records: rule.support,
      agreement: Math.floor((rule.support / rule.pool) * 10000) / 10000,
    }));
  return { records: records.length, rules };
}

/**
 * The tracked documents one corpus covers, each with the family and group the
 * report counts it under. Skills group by skill and resolve against their
 * skill root; specs group by track, and any path through a z_archive folder is
 * left out because archived packets are not maintained.
 * @param {Set<string>} tracked
 * @param {'skills'|'specs'|'all'} corpus
 * @returns {Array<{ doc: string, family: 'skills'|'specs', group: string, skillRoot: string|null }>}
 */
export function corpusDocs(tracked, corpus) {
  const docs = [];
  for (const entry of tracked) {
    if (!entry.endsWith('.md')) continue;
    const parts = entry.split('/');
    if (corpus !== 'specs' && entry.startsWith('.skilled/skills/')) {
      docs.push({ doc: entry, family: 'skills', group: parts[2], skillRoot: `.skilled/skills/${parts[2]}` });
    } else if (corpus !== 'skills' && parts[0] === 'specs' && !parts.includes('z_archive')) {
      docs.push({ doc: entry, family: 'specs', group: parts.length > 2 ? parts[1] : '(root)', skillRoot: null });
    }
  }
  return docs.sort((left, right) => (left.doc < right.doc ? -1 : left.doc > right.doc ? 1 : 0));
}

/**
 * Census over every tracked document in the corpus, read through the committed
 * tree. Reports citation counts by status per skill, per spec track, per doc
 * family and in total, the dead list (missing plus past_end) and the refused
 * count. Dead keeps its meaning across the new classes: a moved citation is
 * counted under its own class, never folded into dead.
 * @param {string} repoRoot
 * @param {Set<string>} tracked
 * @param {Map<string, string|null>} [readCache]
 * @param {{ corpus?: 'skills'|'specs'|'all', redirects?: Array<{ from: string, to: string }> }} [options]
 * @returns {{
 *   commit: string,
 *   corpus: string,
 *   perSkill: Array<{ skill: string, citations: number, dead: number }>,
 *   perTrack: Array<{ track: string, citations: number, dead: number }>,
 *   families: { skills?: object, specs?: object },
 *   total: { citations: number, dead: number },
 *   dead: Array<{ doc: string, line: number, target: string, targetLine: number }>,
 *   moved: Array<{ doc: string, family: string, line: number, target: string, targetLine: number, path: string, status: string }>,
 *   refused: number
 * }}
 */
export function buildCensus(repoRoot, tracked, readCache = new Map(), options = {}) {
  const corpus = options.corpus ?? 'skills';
  const redirects = options.redirects ?? loadRedirects();
  const commit = headCommit(repoRoot);
  const emptyCounts = () => Object.fromEntries([['citations', 0], ...STATUSES.map((status) => [status, 0])]);
  const groups = { skills: new Map(), specs: new Map() };
  const families = {};
  if (corpus !== 'specs') families.skills = emptyCounts();
  if (corpus !== 'skills') families.specs = emptyCounts();
  const totals = emptyCounts();
  const lineCounts = new Map();
  const dead = [];
  const moved = [];

  const docs = corpusDocs(tracked, corpus);
  prefetchCommitted(repoRoot, commit, docs.map((entry) => entry.doc), readCache);
  for (const { doc, family, group, skillRoot } of docs) {
    const text = readCommittedText(repoRoot, commit, doc, readCache);
    // A path the index tracks but HEAD does not hold has nothing committed to scan.
    if (text === null) continue;
    const counts = groups[family].get(group) ?? emptyCounts();
    for (const citation of extractCitations(text, doc)) {
      const { status, path: resolvedPath } = resolveCitation(citation, { tracked, repoRoot, skillRoot, redirects, lineCounts });
      for (const bucket of [counts, families[family], totals]) {
        bucket.citations += 1;
        bucket[status] += 1;
      }
      if (status === 'missing' || status === 'past_end') {
        dead.push({ doc, line: citation.line, target: citation.target, targetLine: citation.targetLine });
      } else if (status === 'moved_in_range' || status === 'moved_past_end') {
        moved.push({ doc, family, line: citation.line, target: citation.target, targetLine: citation.targetLine, path: resolvedPath, status });
      }
    }
    groups[family].set(group, counts);
  }

  const project = (counts) => ({
    citations: counts.citations,
    in_range: counts.in_range,
    past_end: counts.past_end,
    moved_in_range: counts.moved_in_range,
    moved_past_end: counts.moved_past_end,
    basename_only: counts.basename_only,
    ambiguous: counts.ambiguous,
    unresolved: counts.unresolved,
    refused: counts.refused,
    dead: counts.missing + counts.past_end,
  });
  const byName = (left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0);
  const byDocLine = (left, right) => {
    if (left.doc !== right.doc) return left.doc < right.doc ? -1 : 1;
    return left.line - right.line;
  };

  return {
    commit,
    corpus,
    perSkill: [...groups.skills.entries()].sort(byName).map(([skill, counts]) => ({ skill, ...project(counts) })),
    perTrack: [...groups.specs.entries()].sort(byName).map(([track, counts]) => ({ track, ...project(counts) })),
    families: Object.fromEntries(Object.entries(families).map(([family, counts]) => [family, project(counts)])),
    total: project(totals),
    dead: [...dead].sort(byDocLine),
    moved: [...moved].sort(byDocLine),
    refused: totals.refused,
  };
}

/** One census row's counts as the report prints them, refused only where asked. */
function countFields(counts, withRefused) {
  const fields = [
    `citations=${counts.citations}`, `in_range=${counts.in_range}`, `past_end=${counts.past_end}`,
    `moved_in_range=${counts.moved_in_range}`, `moved_past_end=${counts.moved_past_end}`,
    `basename_only=${counts.basename_only}`, `ambiguous=${counts.ambiguous}`, `unresolved=${counts.unresolved}`,
  ];
  if (withRefused) fields.push(`refused=${counts.refused}`);
  fields.push(`dead=${counts.dead}`);
  return fields.join(' ');
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
 * @param {Map<string, string|null>} [readCache]
 * @returns {string[]|null}
 */
function readCommittedLines(repoRoot, commit, filePath, readCache) {
  const text = readCommittedText(repoRoot, commit, filePath, readCache);
  if (text === null) return null;
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
 * @param {Map<string, string|null>} [readCache]
 * @returns {string[]}
 */
export function readWindow(repoRoot, commit, filePath, start, end, readCache) {
  const lines = readCommittedLines(repoRoot, commit, filePath, readCache);
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
 * through the recorded commit so a later edit cannot move a row. Only a path
 * that resolves as written qualifies: a moved or basename-only match points at
 * a file the sentence never named, so its window would not test the claim.
 * @param {{ perSkill: Array<{ skill: string }> }} census
 * @param {string} repoRoot
 * @param {string} commit
 * @param {Map<string, string|null>} readCache
 * @returns {Map<string, Array<object>>}
 */
function inRangePools(census, repoRoot, commit, readCache) {
  const tracked = listTrackedFiles(repoRoot);
  const pools = new Map(census.perSkill.map((entry) => [entry.skill, []]));
  const docs = [...tracked]
    .filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md'))
    .sort();
  for (const doc of docs) {
    const skill = doc.split('/')[2];
    const pool = pools.get(skill);
    if (pool === undefined) continue;
    const lines = readCommittedLines(repoRoot, commit, doc, readCache);
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
    claim_unit: 'paragraph',
    claim_sha12: sha256Hex(entry.claim).slice(0, 12),
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
 * @param {{ census: object, repoRoot: string, commit: string, seed: number, readCache?: Map<string, string|null> }} input
 * @returns {Array<object>}
 */
export function drawRows({ census, repoRoot, commit, seed, readCache = new Map() }) {
  const pools = inRangePools(census, repoRoot, commit, readCache);
  const random = mulberry32(seed);
  const lineCache = new Map();
  const linesOf = (filePath) => {
    if (!lineCache.has(filePath)) lineCache.set(filePath, readCommittedLines(repoRoot, commit, filePath, readCache));
    return lineCache.get(filePath);
  };

  const passes = (count, build, isEligible = () => true) => {
    const rows = [];
    let progressed = true;
    while (rows.length < count && progressed) {
      progressed = false;
      for (const pool of pools.values()) {
        if (rows.length >= count) break;
        if (pool.length === 0) continue;
        const entry = pool.splice(Math.floor(random() * pool.length), 1)[0];
        progressed = true;
        if (!isEligible(entry)) continue;
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
    const windowLines = readWindow(repoRoot, commit, entry.path, start, end, readCache);
    return drawRow(entry, 'live', start, end, windowLines, ordinal, commit);
  }, (entry) => hasClaim(entry.claim));
  if (live.length < LIVE_ROWS) throw new Error(`draw: ${live.length} live citations, need ${LIVE_ROWS}`);

  const constructed = passes(CONSTRUCTED_ROWS, (entry, ordinal) => {
    const lines = linesOf(entry.path);
    if (lines === null || lines.length < CONSTRUCT_MIN_FILE_LINES) return null;
    const centre = ((entry.targetLine + CONSTRUCT_OFFSET_LINES - 1) % lines.length) + 1;
    const direct = Math.abs(centre - entry.targetLine);
    if (Math.min(direct, lines.length - direct) < CONSTRUCT_MIN_GAP_LINES) return null;
    const start = Math.max(1, centre - WINDOW_RADIUS_LINES);
    const end = Math.min(lines.length, centre + WINDOW_RADIUS_LINES);
    const windowLines = readWindow(repoRoot, commit, entry.path, start, end, readCache);
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

// ───────────────────────────────────────────────────────────────────
// 4. COMPARATORS AND LABEL GATE
// ───────────────────────────────────────────────────────────────────

/**
 * Sentence, row-selected claim unit and window text of every labels row, read
 * at the recorded commit so a later edit cannot move the measured text.
 * @param {string} repoRoot
 * @param {Array<object>} rows
 * @param {Map<string, string|null>} [readCache]
 * @returns {Map<string, { sentence: string, claim: string, windowText: string }>}
 */
function buildWindows(repoRoot, rows, readCache = new Map()) {
  const docs = new Map();
  const windows = new Map();
  for (const row of rows) {
    const docKey = `${row.commit}:${row.doc}`;
    if (!docs.has(docKey)) docs.set(docKey, readCommittedLines(repoRoot, row.commit, row.doc, readCache));
    const lines = docs.get(docKey);
    const sentence = lines === null ? '' : (lines[row.doc_line - 1] ?? '').trim();
    const claimUnit = row.claim_unit === undefined ? 'line' : row.claim_unit;
    if (claimUnit !== 'line' && claimUnit !== 'paragraph') {
      throw new Error(`labels row ${row.id}: invalid claim unit`);
    }
    const claim = lines === null ? '' : claimUnit === 'paragraph'
      ? paragraphClaim(lines, row.doc_line - 1)
      : sentence;
    const windowText = readWindow(repoRoot, row.commit, row.target, row.window_start, row.window_end, readCache).join('\n');
    windows.set(row.id, { sentence, claim, windowText });
  }
  return windows;
}

/** Refuse stale label text before any comparator or model score is produced. */
function validateLabelHashes(rows, windows) {
  for (const row of rows) {
    const entry = windows.get(row.id);
    if (entry === undefined) throw new Error(`labels row ${row.id}: citation text unavailable`);
    if (row.claim_sha12 !== sha256Hex(entry.claim).slice(0, 12)) {
      throw new Error(`labels row ${row.id}: claim hash mismatch`);
    }
    if (row.window_sha12 !== sha256Hex(entry.windowText).slice(0, 12)) {
      throw new Error(`labels row ${row.id}: window hash mismatch`);
    }
  }
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
// 6. BACKEND PROCESS HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * One JSON-line record per model call under outDir. A missing or empty outDir
 * keeps no records, so nothing is created. The file is created empty on the
 * first append, and one line per call keeps a killed arm's earlier records
 * readable. An advisory log appends instead, so several documents validated
 * one at a time share one file.
 * @param {string|undefined} outDir Directory that holds calls.jsonl.
 * @param {{ truncate?: boolean }} [options] True writes the empty file on the
 *   first append; false appends to what the file already holds.
 * @returns {{ append: (record: object) => void }}
 */
export function createCallLog(outDir, { truncate = true } = {}) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        if (truncate) fs.writeFileSync(filePath, '');
        created = true;
      }
      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
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
 * @param {{ census: object, labels: { path: string, sha256: string, rows: number, labeled: number }, comparators: object, measurement?: object, columns?: object, stopped?: object, skipped?: object }} input
 * @returns {object}
 */
export function buildReport({ census, labels, comparators, measurement = {}, columns = {}, stopped = {}, skipped = {} }) {
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
    measurement,
    columns,
    stopped,
    skipped,
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
 * @param {Array<{ from: string, to: string }>} [deps.redirects] Redirect rules. Default the table at deps.redirectsPath.
 * @param {string} [deps.redirectsPath] Redirect table. Default REDIRECTS_PATH.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input; --advise returns 0 unless the invocation is bad.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[cite-drift-scan] ${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? BACKOFF_MS;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: true,
      options: {
        advise: { type: 'boolean' },
        draw: { type: 'boolean' },
        seed: { type: 'string' },
        jev: { type: 'boolean' },
        out: { type: 'string' },
        labels: { type: 'string' },
        corpus: { type: 'string' },
        moved: { type: 'boolean' },
        'rebuild-redirects': { type: 'string' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values, positionals } = parsed;

  if (values.advise === true) {
    if (positionals.length === 0 || values.draw === true || values.jev === true
      || values.labels !== undefined || values.seed !== undefined) {
      err(USAGE);
      return 2;
    }
    return runAdvise(positionals, {
      repoRoot,
      out,
      env,
      timeoutMs,
      extractCitations,
      resolveCitation,
      listTrackedFiles,
      callLog: createCallLog(values.out, { truncate: false }),
    });
  }
  if (positionals.length > 0) {
    err(USAGE);
    return 2;
  }

  const labelsPath = values.labels ?? LABELS_PATH;
  const corpus = values.corpus ?? 'skills';

  if (!CORPORA.includes(corpus)) {
    err(`--corpus needs one of ${CORPORA.join(', ')}`);
    return 2;
  }
  // Draw pools and the Jev payload are built from skill docs only.
  if (values.draw === true && corpus !== 'skills') {
    err('--draw reads the skills corpus only');
    return 2;
  }

  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    err('--jev needs --out <dir> so every call is recorded');
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

  // The rebuild writes the table from the rename record alone and returns
  // before any census input is read.
  if (values['rebuild-redirects'] !== undefined) {
    const renameLog = spawnSync('git', ['-C', repoRoot, 'log', '-M', '--diff-filter=R', '--name-status', '--format=', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: GIT_MAX_BUFFER,
    });
    if (renameLog.error || renameLog.status !== 0) {
      const reason = (renameLog.stderr ?? '').trim() || renameLog.error?.message || `exit ${renameLog.status}`;
      err(`git log failed in ${repoRoot}: ${reason}`);
      return 2;
    }
    try {
      const derived = deriveRedirects(renameLog.stdout ?? '', {
        minRecords: REDIRECT_MIN_RECORDS,
        minAgreement: REDIRECT_MIN_AGREEMENT,
      });
      const commit = headCommit(repoRoot);
      const table = {
        source: {
          command: 'git log -M --diff-filter=R --name-status --format= HEAD',
          commit,
          renameRecords: derived.records,
          minRecords: REDIRECT_MIN_RECORDS,
          minAgreement: REDIRECT_MIN_AGREEMENT,
          derivedBy: 'deriveRedirects in cite-drift-scan.mjs',
        },
        rules: derived.rules,
      };
      fs.writeFileSync(values['rebuild-redirects'], `${JSON.stringify(table, null, 2)}\n`);
      out(`redirects: path=${values['rebuild-redirects']} commit=${commit.slice(0, 12)} records=${derived.records} rules=${derived.rules.length}`);
      return 0;
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }

  let census;
  const readCache = new Map();
  try {
    const redirects = deps.redirects ?? loadRedirects(deps.redirectsPath ?? REDIRECTS_PATH);
    census = buildCensus(repoRoot, listTrackedFiles(repoRoot), readCache, { corpus, redirects });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  if (values.draw === true) {
    let rows;
    try {
      rows = drawRows({ census, repoRoot, commit: census.commit, seed, readCache });
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
    out(`skill ${entry.skill}: ${countFields(entry, false)}`);
  }
  for (const entry of census.perTrack) {
    out(`track ${entry.track}: ${countFields(entry, false)}`);
  }
  for (const [family, counts] of Object.entries(census.families)) {
    out(`family ${family}: ${countFields(counts, true)}`);
  }
  out(`${countFields(census.total, true)} corpus=${census.corpus} commit=${census.commit.slice(0, 12)}`);
  for (const entry of census.dead) {
    out(`cite dead: ${entry.doc}:${entry.line} -> ${entry.target}:${entry.targetLine}`);
  }
  // Opt-in, so the default census output and its recorded hash stay unchanged.
  if (values.moved === true) {
    for (const entry of census.moved) {
      out(`cite moved: ${entry.family} ${entry.doc}:${entry.line} -> ${entry.target}:${entry.targetLine} now ${entry.path} (${entry.status})`);
    }
  }
  let windows;
  try {
    windows = buildWindows(repoRoot, labelRows, readCache);
    validateLabelHashes(labelRows, windows);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const summary = summaryLines({ rows: labelRows, windows });
  for (const line of summary.lines) {
    out(line);
  }

  const armsRequested = values.jev === true;
  let callLog = null;
  let stored = null;
  if (armsRequested) {
    callLog = createCallLog(values.out);
    stored = readStoredReport(values.out);
  }

  const columns = {};
  const stopped = {};
  const skipped = {};
  let outcomes = [];

  // The Jev arm runs on its own gate; a failed check prints its skip line and
  // leaves every earlier line as it was.
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
        outcomes = result.outcomes;
      } else {
        stopped.jev = { line: result.stopped, partialRows: result.partialRows };
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
      measurement: {
        ...measurementIdentity(labelRows.filter((row) => row.verdict !== null && row.verdict !== undefined)),
        outcomes,
      },
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
