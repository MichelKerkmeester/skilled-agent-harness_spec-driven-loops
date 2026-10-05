#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: CHECK-SOURCE-TAGS HELPER
// ───────────────────────────────────────────────────────────────
// Resolves the `path:line` citations inside `[SOURCE: ...]` tags in a packet's
// research and review artifacts. Resolution is sk-doc's citation scanner, so a
// tag and a bare citation get the same verdict and the same redirect table.
//
// Usage: node check-source-tags-helper.mjs <packet-folder>
// Output, one record per line, tab-separated:
//   SKIP    <reason>
//   WARN    <doc>:<line>    <citation>    <class>    <detail>
//   IGNORED <count>
//   CHECKED <count>
// Exit 0 after any of those; exit 2 when the repository or the redirect table
// cannot be read.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  CITATION_RE,
  FENCE_RE,
  listTrackedFiles,
  loadRedirects,
  resolveCitation,
} from '../../../../sk-doc/shared/scripts/cite-drift-scan.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

/** Packets created on or before this date keep their history unchecked. */
export const CUTOFF_DEFAULT = '2026-10-04';

const SOURCE_TAG_RE = /\[SOURCE:[^\]]*\]/g;

/** Artifact trees a deep-research or deep-review run writes into a packet. */
const ARTIFACT_DIRS = ['research', 'review'];

/** Dispatch prompts carry instructions and examples, not findings. */
const SKIPPED_DIRS = new Set(['prompts', 'node_modules']);

/** Verdicts where the written path is no tracked file, so .gitignore may hide it. */
const IGNORABLE_STATUSES = new Set(['unresolved', 'refused', 'basename_only', 'ambiguous']);

// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Whether a YYYY-MM-DD string names a real day; Date rolls 2026-02-30 into
 * March, so a round trip that changes any part means the day does not exist.
 * @param {string} candidate
 * @returns {boolean}
 */
function isCalendarDate(candidate) {
  const [year, month, day] = candidate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * Cutoff from SPECKIT_SOURCE_TAG_CUTOFF. A malformed value falls back to the
 * default instead of being compared as a string, which could skip every packet.
 * Date-shaped is not enough: `9999-99-99` matches the shape and would still
 * sort after every real date, so the value must also name a real calendar day.
 * @param {Record<string, string|undefined>} env
 * @returns {{ cutoff: string, note: string|null }}
 */
export function cutoffDate(env) {
  const raw = env.SPECKIT_SOURCE_TAG_CUTOFF;
  if (raw === undefined || raw === '') return { cutoff: CUTOFF_DEFAULT, note: null };
  const candidate = raw.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate) && isCalendarDate(candidate)) return { cutoff: candidate, note: null };
  return { cutoff: CUTOFF_DEFAULT, note: `SPECKIT_SOURCE_TAG_CUTOFF='${raw}' is not an ISO date; using ${CUTOFF_DEFAULT}` };
}

/**
 * Creation date from the spec.md metadata table, or null when it cannot be read.
 * @param {string} folder
 * @returns {string|null}
 */
export function createdDate(folder) {
  let text;
  try {
    text = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
  } catch {
    return null;
  }
  for (const line of text.split(/\r?\n/)) {
    if (!/\|\s*\*{0,2}created\*{0,2}\s*\|/i.test(line)) continue;
    const match = line.match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  return null;
}

/**
 * Untracked files git does not ignore, repo-relative.
 * @param {string} repoRoot
 * @returns {string[]}
 */
function untrackedFiles(repoRoot) {
  const result = spawnSync('git', ['-C', repoRoot, 'ls-files', '--others', '--exclude-standard', '-z'], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`git ls-files --others failed in ${repoRoot}: ${(result.stderr ?? '').trim() || result.error?.message}`);
  }
  return (result.stdout ?? '').split('\0').filter((entry) => entry !== '');
}

/**
 * Whether a verdict leaves room for a file .gitignore hides. A `.env` basename
 * keeps the resolver's credential refusal and stays out of the ignored check.
 * @param {{ target: string }} citation
 * @param {{ status: string }} resolved
 * @returns {boolean}
 */
function mayBeIgnored(citation, resolved) {
  return IGNORABLE_STATUSES.has(resolved.status)
    && !path.posix.basename(citation.target).startsWith('.env');
}

/**
 * Repo-relative candidates the resolver tries for one citation: the target and
 * each spaced form its lead words can build, at the citing document's folder,
 * the repository root and the packet root. A candidate escaping the repository
 * cannot be judged by check-ignore and is dropped.
 * @param {{ doc: string, target: string, lead?: string }} citation
 * @param {string} packetRoot
 * @returns {string[]}
 */
function resolutionCandidates(citation, packetRoot) {
  const forms = [citation.target];
  if (typeof citation.lead === 'string' && citation.lead !== '') {
    const leadWords = citation.lead.split(' ');
    for (let cut = 0; cut < leadWords.length; cut += 1) {
      forms.push(`${leadWords.slice(cut).join(' ')} ${citation.target}`);
    }
  }
  const candidates = [];
  for (const form of forms) {
    candidates.push(path.posix.join(path.posix.dirname(citation.doc), form), form);
    if (packetRoot !== '') candidates.push(path.posix.join(packetRoot, form));
  }
  return candidates.filter((candidate) => !candidate.startsWith('../') && !path.posix.isAbsolute(candidate));
}

/**
 * Whether a repo-relative candidate reaches the worktree through a symlinked
 * directory. git check-ignore refuses such a pathspec with a fatal error, so
 * the batch drops it and the citation counts as not ignored. Each parent
 * prefix is lstat'ed once and cached; the candidate itself is never stat'ed,
 * so an ignored file is still never opened. A prefix that cannot be stat'ed at
 * all, such as a file standing in for a directory, counts as no symlink and
 * lets git judge the path.
 * @param {string} repoRoot
 * @param {string} candidate
 * @param {Map<string, boolean>} cache
 * @returns {boolean}
 */
function hasSymlinkedParent(repoRoot, candidate, cache) {
  const segments = candidate.split('/');
  let prefix = '';
  for (let index = 0; index < segments.length - 1; index += 1) {
    prefix = prefix === '' ? segments[index] : `${prefix}/${segments[index]}`;
    let symlink = cache.get(prefix);
    if (symlink === undefined) {
      let stat;
      try {
        stat = fs.lstatSync(path.join(repoRoot, prefix), { throwIfNoEntry: false });
      } catch {
        stat = undefined;
      }
      symlink = stat?.isSymbolicLink() === true;
      cache.set(prefix, symlink);
    }
    if (symlink) return true;
  }
  return false;
}

/**
 * The candidates git ignores, from one batch `check-ignore` call. Exit 1 means
 * none matched, a normal answer rather than a failure.
 * @param {string} repoRoot
 * @param {string[]} candidates
 * @returns {Set<string>}
 */
function ignoredPaths(repoRoot, candidates) {
  const symlinkCache = new Map();
  const unique = [...new Set(candidates)];
  const judgeable = unique.filter((candidate) => !hasSymlinkedParent(repoRoot, candidate, symlinkCache));
  if (judgeable.length === 0) return new Set();
  const result = spawnSync('git', ['-C', repoRoot, 'check-ignore', '-z', '--stdin'], {
    input: `${judgeable.join('\0')}\0`,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.error || (result.status !== 0 && result.status !== 1)) {
    throw new Error(`git check-ignore failed in ${repoRoot}: ${(result.stderr ?? '').trim() || result.error?.message}`);
  }
  return new Set((result.stdout ?? '').split('\0').filter((entry) => entry !== ''));
}

/** Every markdown file under the packet's research and review trees. */
function artifactFiles(folder) {
  const files = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRS.has(entry.name)) walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(full);
      }
    }
  };
  for (const dir of ARTIFACT_DIRS) walk(path.join(folder, dir));
  return files.sort();
}

/**
 * The `path:line` citations inside `[SOURCE: ...]` tags, outside fenced blocks.
 * A tag holding a URL or prose names no line to check and yields nothing. The
 * tag body splits on commas and semicolons so a citation keeps the words
 * before it in its own piece as lead — cut after the last backtick, quote or
 * bracket — which the resolver joins back into a spaced path.
 * @param {string} text
 * @param {string} doc Repo-relative path of the artifact.
 */
export function sourceTagCitations(text, doc) {
  const citations = [];
  let inFence = false;
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const tag of line.matchAll(SOURCE_TAG_RE)) {
      for (const piece of tag[0].slice('[SOURCE:'.length, -1).split(/[,;]/)) {
        for (const match of piece.matchAll(CITATION_RE)) {
          citations.push({
            doc,
            line: index + 1,
            sentence: line.trim(),
            text: match[0],
            target: match[1],
            targetLine: Number(match[2]),
            targetLineEnd: match[3] === undefined ? null : Number(match[3]),
            lead: (piece.slice(0, match.index).split(/[`'"(\[]/).pop()?.match(/\S+/g) ?? []).join(' '),
          });
        }
      }
    }
  }
  return citations;
}

/**
 * The warning for one resolved citation, or null when it needs none. An
 * in-range citation passes; a refused one is an untracked or credential path,
 * which is not a stale tag.
 * @param {{ status: string, path: string|null }} resolved
 * @returns {{ cls: string, detail: string }|null}
 */
export function classify(resolved) {
  switch (resolved.status) {
    case 'in_range':
    case 'refused':
      return null;
    case 'past_end':
      return { cls: 'past end', detail: 'the file exists but is shorter than the cited line' };
    case 'moved_in_range':
      return { cls: 'moved', detail: `now at ${resolved.path}` };
    case 'moved_past_end':
      return { cls: 'moved', detail: `now at ${resolved.path}, and the cited line is past its end` };
    case 'basename_only':
      return { cls: 'guessed', detail: `no file at that path; only ${resolved.path} shares its name` };
    case 'ambiguous':
      return { cls: 'guessed', detail: 'no file at that path; several tracked files share its name' };
    default:
      return { cls: 'gone', detail: 'no tracked file at that path and no recorded rename' };
  }
}

// ───────────────────────────────────────────────────────────────
// 3. MAIN
// ───────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv
 * @param {{ env?: Record<string, string|undefined>, out?: (line: string) => void, err?: (line: string) => void }} [deps]
 * @returns {number}
 */
export function main(argv, deps = {}) {
  const env = deps.env ?? process.env;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const folder = argv[0];
  if (!folder || !fs.existsSync(folder)) {
    err('usage: node check-source-tags-helper.mjs <packet-folder>');
    return 2;
  }

  const { cutoff, note } = cutoffDate(env);
  if (note) err(note);
  const created = createdDate(folder);
  if (created === null) {
    out('SKIP\tno Created date in spec.md, so the packet counts as older than the cutoff');
    return 0;
  }
  if (created <= cutoff) {
    out(`SKIP\tcreated ${created}, on or before the cutoff ${cutoff}`);
    return 0;
  }

  const top = spawnSync('git', ['-C', folder, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (top.status !== 0) {
    err(`not inside a git repository: ${folder}`);
    return 2;
  }
  const repoRoot = top.stdout.trim();

  const citations = [];
  for (const file of artifactFiles(folder)) {
    const doc = path.relative(repoRoot, fs.realpathSync(file)).split(path.sep).join('/');
    citations.push(...sourceTagCitations(fs.readFileSync(file, 'utf8'), doc));
  }
  if (citations.length === 0) {
    out('CHECKED\t0');
    return 0;
  }

  let tracked;
  let redirects;
  try {
    // A packet is validated before it is committed, so its own new files count:
    // untracked files outside .gitignore join the set the resolver reads.
    tracked = listTrackedFiles(repoRoot);
    for (const entry of untrackedFiles(repoRoot)) tracked.add(entry);
    redirects = loadRedirects();
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  // Research iterations often cite packet files from the packet root, so the
  // packet folder joins the citing folder and the repository root as a base.
  const packetRoot = path.relative(repoRoot, fs.realpathSync(folder)).split(path.sep).join('/');
  const lineCounts = new Map();
  const resolved = citations.map((citation) => ({
    citation,
    result: resolveCitation(citation, { tracked, repoRoot, skillRoot: packetRoot, redirects, lineCounts }),
  }));
  // Gitignored material is present in the main checkout and absent in a
  // worktree, so one tag can read as refused there and unresolved here. Any
  // ignored candidate settles it as ignored either way, without a WARN and
  // without opening the path.
  const candidatesByCitation = new Map();
  const candidates = [];
  for (const entry of resolved) {
    if (!mayBeIgnored(entry.citation, entry.result)) continue;
    const own = resolutionCandidates(entry.citation, packetRoot);
    candidatesByCitation.set(entry.citation, own);
    candidates.push(...own);
  }
  let ignoredSet;
  try {
    ignoredSet = ignoredPaths(repoRoot, candidates);
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  let ignored = 0;
  for (const { citation, result } of resolved) {
    if (candidatesByCitation.get(citation)?.some((candidate) => ignoredSet.has(candidate))) {
      ignored += 1;
      continue;
    }
    const verdict = classify(result);
    if (verdict) out(`WARN\t${citation.doc}:${citation.line}\t${citation.text}\t${verdict.cls}\t${verdict.detail}`);
  }
  out(`IGNORED\t${ignored}`);
  out(`CHECKED\t${citations.length}`);
  return 0;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = main(process.argv.slice(2));
}
