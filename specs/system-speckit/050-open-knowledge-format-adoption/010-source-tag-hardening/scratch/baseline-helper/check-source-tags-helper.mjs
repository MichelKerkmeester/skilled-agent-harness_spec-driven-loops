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
} from '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/086-okf-adoption-research/specs/system-speckit/050-open-knowledge-format-adoption/009-census-hardening/scratch/baseline-scanner/cite-drift-scan.mjs';

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

// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Cutoff from SPECKIT_SOURCE_TAG_CUTOFF. A malformed value falls back to the
 * default instead of being compared as a string, which could skip every packet.
 * @param {Record<string, string|undefined>} env
 * @returns {{ cutoff: string, note: string|null }}
 */
export function cutoffDate(env) {
  const raw = env.SPECKIT_SOURCE_TAG_CUTOFF;
  if (raw === undefined || raw === '') return { cutoff: CUTOFF_DEFAULT, note: null };
  const candidate = raw.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return { cutoff: candidate, note: null };
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
 * A tag holding a URL or prose names no line to check and yields nothing.
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
      for (const match of tag[0].matchAll(CITATION_RE)) {
        citations.push({
          doc,
          line: index + 1,
          sentence: line.trim(),
          text: match[0],
          target: match[1],
          targetLine: Number(match[2]),
          targetLineEnd: match[3] === undefined ? null : Number(match[3]),
        });
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
  for (const citation of citations) {
    const verdict = classify(resolveCitation(citation, { tracked, repoRoot, skillRoot: packetRoot, redirects, lineCounts }));
    if (verdict) out(`WARN\t${citation.doc}:${citation.line}\t${citation.text}\t${verdict.cls}\t${verdict.detail}`);
  }
  out(`CHECKED\t${citations.length}`);
  return 0;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = main(process.argv.slice(2));
}
