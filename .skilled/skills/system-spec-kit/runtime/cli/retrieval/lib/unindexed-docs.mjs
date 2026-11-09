// ───────────────────────────────────────────────────────────────────
// MODULE: Unindexed Spec Doc Fallback
// ───────────────────────────────────────────────────────────────────
// The committed index is generated before a packet's documents land, so a fresh
// lookup can miss a spec doc that already declares a matching phrase. When the
// index returns no scored candidate, this walk scores the declarations of the
// spec docs the index does not list, inside the lookup's latency budget.
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { isExcludedDirectory, isExcludedResearchPath } from './corpus.mjs';
import { readTriggerPhrases } from './frontmatter.mjs';
import { compareCodeUnits, matchClassRank, scorePhrase } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────────

/**
 * Document names a packet can carry. A fallback walk only pays to open files
 * whose name is one of these; the list is the packet document set rather than
 * every markdown file, because a packet's context and lineage transcripts are
 * working material and do not declare triggers of their own.
 */
export const SPEC_DOC_NAMES = Object.freeze(new Set([
  'acceptance-criteria.md',
  'checklist.md',
  'decision-record.md',
  'goal.md',
  'handover.md',
  'implementation-summary.md',
  'plan.md',
  'research.md',
  'resource-map.md',
  'spec.md',
  'tasks.md',
  'timeline.md',
]));

/**
 * Cap on the documents the fallback opens. The lookup holds a hard latency
 * budget, and a repository can carry far more unindexed spec docs than a single
 * prompt can afford to read; the cap keeps the walk bounded and reports when it
 * cut the candidate list short.
 */
export const MAX_FALLBACK_FILES = 500;

// ───────────────────────────────────────────────────────────────────
// 2. WALK
// ───────────────────────────────────────────────────────────────────

/**
 * Lists the spec docs under the walk start that the index does not list.
 *
 * The start is the spec tree as a whole, or the requested packet folder when it
 * sits inside that tree. A folder outside it is refused rather than walked: the
 * fallback exists to recover packet documents, and an arbitrary directory would
 * both cost the latency budget and score documents the index never covers.
 *
 * @param {string} repoRoot Absolute repository root.
 * @param {ReadonlySet<string>} indexedPaths Repo-relative POSIX paths the index lists.
 * @param {{ specFolder?: string | null }} [options] Packet folder to narrow the walk to.
 * @returns {Promise<string[]>} Kept repo-relative POSIX paths, sorted.
 */
export async function listUnindexedDocs(repoRoot, indexedPaths, options = {}) {
  const start = await resolveWalkStart(repoRoot, options.specFolder ?? null);
  if (start === null) return [];

  const kept = [];
  await walkSpecDocs(path.join(repoRoot, start), start, path.basename(start), indexedPaths, kept);
  return kept.sort(compareCodeUnits);
}

/**
 * The repo-relative folder a walk may start from, or null when the requested
 * scope leaves the spec tree.
 *
 * A prefix test alone is not containment: `specs/../.skilled` starts with
 * `specs/` and resolves outside it, and a linked folder inside the tree can
 * point anywhere. The scope is normalized first, then its real path is held to
 * the real path of the spec tree, so neither route reads documents the index
 * never covers.
 *
 * @param {string} repoRoot Absolute repository root.
 * @param {unknown} requested Scope argument, or null for the whole spec tree.
 * @returns {Promise<string | null>} Normalized repo-relative start, or null.
 */
async function resolveWalkStart(repoRoot, requested) {
  let start = 'specs';
  if (requested !== null) {
    if (typeof requested !== 'string') return null;
    start = path.posix.normalize(requested);
    if (start !== 'specs' && !start.startsWith('specs/')) return null;
  }

  let treeReal;
  let startReal;
  try {
    treeReal = await fs.promises.realpath(path.join(repoRoot, 'specs'));
    startReal = await fs.promises.realpath(path.join(repoRoot, start));
  } catch {
    return null;
  }
  return startReal === treeReal || startReal.startsWith(treeReal + path.sep) ? start : null;
}

/**
 * Recursive half of the walk. Directories are visited in parallel because the
 * spec tree is wide and a serial descent would spend the lookup's whole budget
 * in readdir alone. An unreadable directory contributes nothing rather than
 * failing the lookup, and links are never followed, matching the corpus walker.
 *
 * @param {string} directory Absolute directory being walked.
 * @param {string} relativeDirectory Repo-relative POSIX path of the directory.
 * @param {string} parentName Name of the directory above it.
 * @param {ReadonlySet<string>} indexedPaths Repo-relative POSIX paths the index lists.
 * @param {string[]} kept Accumulator for documents the index does not list.
 * @returns {Promise<void>}
 */
async function walkSpecDocs(directory, relativeDirectory, parentName, indexedPaths, kept) {
  let entries;
  try {
    entries = await fs.promises.readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  const pending = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const relativePath = `${relativeDirectory}/${entry.name}`;

    if (entry.isDirectory()) {
      if (!isExcludedDirectory(entry.name, parentName, relativePath)) {
        pending.push({ absolute: path.join(directory, entry.name), name: entry.name, relativePath });
      }
      continue;
    }

    if (entry.isFile()
      && SPEC_DOC_NAMES.has(entry.name)
      && !isExcludedResearchPath(relativePath)
      && !indexedPaths.has(relativePath)) {
      kept.push(relativePath);
    }
  }

  await Promise.all(pending.map((child) => walkSpecDocs(child.absolute, child.relativePath, child.name, indexedPaths, kept)));
}

// ───────────────────────────────────────────────────────────────────
// 3. SCORING
// ───────────────────────────────────────────────────────────────────

/**
 * Scores the declared phrases of every unindexed spec doc against the prompt.
 *
 * A document enters the result when at least one declared phrase shares a token
 * with the prompt and scores above zero. Sharing a token first is what keeps the
 * read cheap: scoring is only run on phrases that could plausibly match, and a
 * document with no such phrase is dropped before it can contribute noise. When
 * several phrases tie for the best score, the better match class wins so the
 * document is described by its strongest kind of match.
 *
 * @param {{
 *   repoRoot: string,
 *   indexedPaths: ReadonlySet<string>,
 *   normalizedQuery: string,
 *   tokens: readonly string[],
 *   specFolder?: string | null,
 *   maxFiles?: number,
 * }} options Prompt, index membership and walk bounds.
 * @returns {Promise<{
 *   results: Array<{ matchClass: string, path: string, phrases: string[], score: number }>,
 *   staleFallback: { available: true, files: number, matches: number, paths: string[], truncated: boolean },
 * }>} Matched documents ranked best first, plus what the fallback did.
 */
export async function findStaleFallback({
  repoRoot,
  indexedPaths,
  normalizedQuery,
  tokens,
  specFolder = null,
  maxFiles = MAX_FALLBACK_FILES,
}) {
  const candidates = await listUnindexedDocs(repoRoot, indexedPaths, { specFolder });
  const truncated = candidates.length > maxFiles;
  const read = candidates.slice(0, maxFiles);

  const loaded = await Promise.all(read.map(async (relativePath) => {
    try {
      return { relativePath, text: await fs.promises.readFile(path.join(repoRoot, relativePath), 'utf8') };
    } catch {
      return null;
    }
  }));

  const results = [];
  for (const document of loaded) {
    if (document === null) continue;

    const matched = [];
    let bestScore = 0;
    let bestClass = null;
    for (const phrase of readTriggerPhrases(document.text).phrases) {
      const normalized = phrase.normalized;
      if (!tokens.some((token) => normalized.includes(token))) continue;
      const scored = scorePhrase(normalizedQuery, normalized);
      if (scored === null || scored.score <= 0) continue;

      matched.push(normalized);
      if (scored.score > bestScore
        || (scored.score === bestScore && matchClassRank(scored.matchClass) < matchClassRank(bestClass))) {
        bestScore = scored.score;
        bestClass = scored.matchClass;
      }
    }

    if (matched.length === 0) continue;
    results.push({
      matchClass: bestClass,
      path: document.relativePath,
      // A document may declare one phrase twice; the index lists it once.
      phrases: Array.from(new Set(matched)).sort(compareCodeUnits),
      score: bestScore,
    });
  }

  results.sort((a, b) => b.score - a.score
    || matchClassRank(a.matchClass) - matchClassRank(b.matchClass)
    || compareCodeUnits(a.path, b.path));

  return {
    results,
    staleFallback: {
      available: true,
      files: read.length,
      matches: results.length,
      paths: results.map((result) => result.path).sort(compareCodeUnits),
      truncated,
    },
  };
}
