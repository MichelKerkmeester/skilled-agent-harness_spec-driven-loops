#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Index Lookup
// ───────────────────────────────────────────────────────────────────
// Resolves a prompt against the committed trigger index using the same
// candidate gate, score classes and scope filter the retired substring trigger
// lane used, so its recorded results still diff against this lookup.
//
// Everything on the index path is synchronous and the import list is
// deliberately short: the whole point is a single answer from a cold Node
// process, and every extra module is paid for on every lookup. Parsing the
// artifact dominates that cost, which is why the partial-substring candidates
// are scanned out of the phrase keys rather than read from a stored posting
// list: scanning tens of thousands of short keys costs single-digit
// milliseconds, while the postings that would answer the same question cost far
// more to parse on every single lookup. The zero-hit fallback is the one
// asynchronous path, and it awaits a lazily imported scanner only after the
// index has failed to score anything.
//
// Usage:
//   node lookup-trigger-index.mjs "<prompt>" [--index <path>] [--spec-folder <scope>]
//                                 [--limit <n>] [--no-index-hash] [--scoring-only]
//                                 [--no-stale-fallback] [--json]
//
// --limit 0 lifts the cap and returns every candidate; the default is 20.
// --scoring-only drops score-0 partial candidates before the cap. Without it
// the output keeps them, matching the retired lane's recorded results.
//
// On a zero-hit the lookup also scores the declared trigger_phrases of spec
// docs under specs/ that the index does not list yet (a packet written since
// the last rebuild); exit 1 then means neither source matched.
// --no-stale-fallback or an explicit --index keeps the answer index-only.
//
// With no --index, an index the caller's own repository carries at
// <root>/.speckit-index/trigger-index.json, or in the `indexDir` its
// .skilled-host.json names, is read instead of the packaged one.
// A host repository that vendors Skilled keeps its packets there, and the
// packaged index describes the framework's documents only.
//
// A project repository that links both `.skilled` and `specs` into such a host
// reads the host's index, and because that index spells its paths relative to
// the host, an unscoped lookup would answer from every track the host holds. The
// linked folder therefore becomes the default scope. `--spec-folder ""` says the
// caller wants the whole index anyway, and any explicit `--spec-folder` wins.
//
// Exit codes: 0 = at least one candidate scores above 0, 1 = no candidate
// scores above 0, 2 = bad invocation or unreadable index.
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { assertTriggerIndexShape } from './lib/artifact.mjs';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  compareCodeUnits,
  matchClassRank,
  normalizeTriggerText,
  queryTokens,
  scorePhrase,
} from './lib/normalize.mjs';
import { callerRepoRoot, disownedDefaultIndex, hostIndexDir, hostIndexPath, isFile, owningHostRoot } from './lib/host-index.mjs';
import { isMainModule } from '../lib/esm-entry.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_INDEX_PATH = path.resolve(SCRIPT_DIR, '..', '..', 'data', 'trigger-index.json');

/**
 * The index a bare lookup reads, and the scope that goes with it.
 *
 * A host repository that vendors Skilled keeps an index over its own packets
 * at `<root>/.speckit-index/trigger-index.json`, or under the `indexDir` its
 * `.skilled-host.json` names. Reading the packaged artifact
 * there answers every question from the framework's documents instead of the
 * host's, so an existing host index wins and the packaged default stays the
 * fallback.
 *
 * A project repository that links both `.skilled` and `specs` into a host owns
 * neither the index nor the corpus, so the index to read belongs to the host.
 * Its paths are spelled relative to that host, which is why the scope follows
 * from the same place: the folder the project's `specs` entry links to. That
 * scope applies only when the index read is the host's own; a project reading
 * anything else gets no default.
 *
 * An explicit `--index` is never overridden — it does not reach here.
 *
 * @param {string} [cwd] Directory the caller works in.
 * @returns {{ indexPath: string, ownerRoot: string | null, specFolder: string | null }} Index to read, the host it belongs to, and the scope it implies.
 */
export function defaultIndexSelection(cwd = process.cwd()) {
  const root = callerRepoRoot(cwd);
  if (root === null) return { indexPath: DEFAULT_INDEX_PATH, ownerRoot: null, specFolder: null };

  const ownIndex = hostIndexPath(root);
  if (isFile(ownIndex)) return { indexPath: ownIndex, ownerRoot: null, specFolder: null };

  const owner = owningHostRoot(root);
  if (owner === null) return { indexPath: DEFAULT_INDEX_PATH, ownerRoot: null, specFolder: null };

  return {
    indexPath: hostIndexPath(owner),
    ownerRoot: owner,
    specFolder: linkedSpecFolder(root, owner),
  };
}

/**
 * @param {string} [cwd] Directory the caller works in.
 * @returns {string} Absolute index path.
 */
export function defaultIndexPath(cwd = process.cwd()) {
  return defaultIndexSelection(cwd).indexPath;
}

/**
 * Names the folder a project's `specs` entry links to inside its host.
 *
 * The host's index spells every document path relative to the host, so the scope
 * filter needs the same spelling; anything else would silently match nothing. A
 * `specs` entry that is a real directory is the project's own corpus and needs no
 * scope, and a link that escapes the host is not described by that index at all,
 * so neither yields a default.
 *
 * @param {string} root Project repository root.
 * @param {string} ownerRoot Host repository root holding the linked tree.
 * @returns {string | null} Folder relative to the host, or null.
 */
function linkedSpecFolder(root, ownerRoot) {
  const entry = path.join(root, 'specs');
  try {
    if (!fs.lstatSync(entry).isSymbolicLink()) return null;
  } catch {
    return null;
  }

  let target;
  try {
    target = fs.realpathSync(entry);
  } catch {
    return null;
  }

  const relative = path.relative(ownerRoot, target);
  const [head] = relative.split(path.sep);
  if (head === undefined || head === '' || head === '..') return null;
  return relative.split(path.sep).join('/');
}

/** Mirrors the trigger lane's result cap. */
export const DEFAULT_LIMIT = 20;

/** Class given to a candidate the SQL substring gate admits but the score function rejects. */
export const PARTIAL_CLASS = 'partial';

// ───────────────────────────────────────────────────────────────────
// 2. LOADING
// ───────────────────────────────────────────────────────────────────

/**
 * Reads and parses the artifact once. Hashing the file bytes is the dominant
 * cost on a large index, so a caller that only needs candidates can turn it off.
 *
 * @param {string} [indexPath] Artifact location.
 * @param {{ hashIndex?: boolean }} [options] Load options.
 * @returns {{
 *   index: Record<string, any>,
 *   indexHash: string | null,
 *   indexPath: string,
 *   manifestHash: string,
 *   schemaVersion: number
 * }} Loaded index and its identity.
 */
export function loadIndex(indexPath = DEFAULT_INDEX_PATH, options = {}) {
  const text = fs.readFileSync(indexPath, 'utf8');
  const index = JSON.parse(text);

  // Fail closed on a parseable but malformed artifact: the same invariant the
  // generator enforces at publish time, so a truncated or hand-edited index is
  // refused here instead of silently returning fewer results than it holds.
  assertTriggerIndexShape(index, `index ${indexPath}`);

  return {
    index,
    indexHash: options.hashIndex === false ? null : createHash('sha256').update(text).digest('hex'),
    indexPath,
    manifestHash: typeof index.manifestHash === 'string' ? index.manifestHash : '',
    schemaVersion: typeof index.schemaVersion === 'number' ? index.schemaVersion : 0,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. LOOKUP
// ───────────────────────────────────────────────────────────────────

/**
 * Reproduces the SQL scope filter: a document is in scope when its own folder
 * is the requested folder or a descendant of it.
 *
 * @param {string} documentPath Repo-relative document path.
 * @param {string} specFolder Repo-relative folder, no trailing slash.
 * @returns {boolean} True when the document is in scope.
 */
export function specFolderMatches(documentPath, specFolder) {
  const cut = documentPath.lastIndexOf('/');
  const folder = cut === -1 ? '' : documentPath.slice(0, cut);
  return folder === specFolder || folder.startsWith(`${specFolder}/`);
}

/**
 * Orders candidates best score first, then better match class, then path. The
 * path tiebreak is what keeps the answer stable across runs, since the phrase
 * scan visits keys in object order.
 *
 * @param {{ matchClass: string, path: string, score: number }} a First candidate.
 * @param {{ matchClass: string, path: string, score: number }} b Second candidate.
 * @returns {number} Sort comparator result.
 */
function compareRanked(a, b) {
  return (b.score - a.score)
    || (matchClassRank(a.matchClass) - matchClassRank(b.matchClass))
    || compareCodeUnits(a.path, b.path);
}

/**
 * Resolves a prompt against a loaded index.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Result of loadIndex.
 * @param {string} prompt Raw prompt text.
 * @param {{ specFolder?: string | null, limit?: number, scoringOnly?: boolean }} [options] Query options.
 * @returns {{
 *   normalizedQuery: string,
 *   tokens: string[],
 *   discardedTokens: Array<{ reason: string, token: string }>,
 *   specFolder: string | null,
 *   indexHash: string | null,
 *   manifestHash: string,
 *   schemaVersion: number,
 *   candidatePhraseCount: number,
 *   totalCandidates: number,
 *   truncated: boolean,
 *   results: Array<{ matchClass: string, path: string, phrases: string[], score: number }>
 * }} Candidates ordered best class first, ties broken by path.
 */
export function lookup(loaded, prompt, options = {}) {
  const { index } = loaded;
  const normalizedQuery = normalizeTriggerText(prompt);
  const { discardedTokens, tokens } = queryTokens(prompt);
  const specFolder = normalizeSpecFolder(options.specFolder);
  const limit = options.limit === undefined ? DEFAULT_LIMIT : options.limit;

  const answer = {
    candidatePhraseCount: 0,
    discardedTokens,
    indexHash: loaded.indexHash,
    manifestHash: loaded.manifestHash,
    normalizedQuery,
    results: [],
    schemaVersion: loaded.schemaVersion,
    specFolder,
    tokens,
    totalCandidates: 0,
    truncated: false,
  };

  // The lane returns nothing when no query token clears the candidate floor.
  if (tokens.length === 0) return answer;

  // The SQL substring gate admits a phrase whose text contains a query token
  // anywhere, mid-token included. Testing every key with includes() reproduces
  // that set exactly, and the order it produces does not matter: a document
  // keeps the best score among its phrases, and ties fall to the better class,
  // so the answer is the same whichever key is visited first.
  const candidatePhrases = [];
  for (const phrase of Object.keys(index.phrases)) {
    for (const token of tokens) {
      if (phrase.includes(token)) {
        candidatePhrases.push(phrase);
        break;
      }
    }
  }
  answer.candidatePhraseCount = candidatePhrases.length;

  /** @type {Map<string, { matchClass: string, phrases: Set<string>, score: number }>} */
  const byPath = new Map();
  for (const phrase of candidatePhrases) {
    const posting = index.phrases[phrase];

    const scored = scorePhrase(normalizedQuery, phrase) ?? { matchClass: PARTIAL_CLASS, score: 0 };
    for (const pathId of posting) {
      const documentPath = index.paths[pathId];
      if (specFolder !== null && !specFolderMatches(documentPath, specFolder)) continue;

      let current = byPath.get(documentPath);
      if (!current) {
        current = { matchClass: scored.matchClass, phrases: new Set(), score: scored.score };
        byPath.set(documentPath, current);
      }
      current.phrases.add(phrase);
      // The lane scores a document by the best of its phrases.
      if (scored.score > current.score
        || (scored.score === current.score
          && matchClassRank(scored.matchClass) < matchClassRank(current.matchClass))) {
        current.matchClass = scored.matchClass;
        current.score = scored.score;
      }
    }
  }

  const ranked = Array.from(byPath, ([documentPath, value]) => ({
    matchClass: value.matchClass,
    path: documentPath,
    phrases: Array.from(value.phrases).sort(compareCodeUnits),
    score: value.score,
  }));
  // Filtered before the cap so score-0 rows never take a slot and then vanish.
  const ordered = (options.scoringOnly ? ranked.filter((result) => result.score > 0) : ranked)
    .sort(compareRanked);

  answer.totalCandidates = ordered.length;
  answer.truncated = limit > 0 && ordered.length > limit;
  answer.results = limit > 0 ? ordered.slice(0, limit) : ordered;
  return answer;
}

/**
 * Resolves a prompt against the loaded index, then, only when that finds no
 * scored candidate, against spec documents the index does not list yet.
 *
 * A packet written since the last index rebuild is invisible to the committed
 * artifact, so a fresh document reads as a clean miss. The fallback is the
 * answer to that gap, and it stays off the hot path: a hit never imports the
 * scanner, and a caller that wants index-only behaviour keeps `lookup()`.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Result of loadIndex.
 * @param {string} prompt Raw prompt text.
 * @param {{
 *   specFolder?: string | null,
 *   limit?: number,
 *   scoringOnly?: boolean,
 *   staleFallback?: boolean,
 *   cwd?: string,
 *   repoRoot?: string,
 *   indexPath?: string
 * }} [options] Query options; `staleFallback` enables the unindexed scan,
 *   `cwd` names the directory whose repository root is searched and `repoRoot`
 *   names that root directly, for an index whose paths belong to another tree.
 *   `indexPath` names the artifact `loaded` came from; the scan is skipped when
 *   that file lies outside the root it would walk.
 * @returns {Promise<{
 *   normalizedQuery: string,
 *   tokens: string[],
 *   discardedTokens: Array<{ reason: string, token: string }>,
 *   specFolder: string | null,
 *   indexHash: string | null,
 *   manifestHash: string,
 *   schemaVersion: number,
 *   candidatePhraseCount: number,
 *   totalCandidates: number,
 *   truncated: boolean,
 *   results: Array<{ matchClass: string, path: string, phrases: string[], score: number }>,
 *   staleFallback?: { available: boolean, files: number, matches: number, paths: string[], truncated: boolean }
 * }>} The plain lookup answer when the fallback does not apply, otherwise that
 *   answer with unindexed matches merged in and `staleFallback` describing the scan.
 */
export async function lookupWithFallback(loaded, prompt, options = {}) {
  const answer = lookup(loaded, prompt, options);
  if (options.staleFallback !== true) return answer;
  if (answer.tokens.length === 0) return answer;
  if (answer.results.some((result) => result.score > 0)) return answer;

  const repoRoot = options.repoRoot ?? callerRepoRoot(options.cwd ?? process.cwd());
  if (repoRoot === null) {
    answer.staleFallback = { available: false, files: 0, matches: 0, paths: [], truncated: false };
    return answer;
  }

  // An index spells its paths against the tree it lives in. One read from
  // outside the walked root, such as the packaged index of a linked install,
  // describes other documents, and every packet of the walked tree would pass
  // for unindexed.
  if (options.indexPath !== undefined && !isInsideRoot(options.indexPath, repoRoot)) return answer;

  // Re-run uncapped: the merged set has to be ranked and capped as a whole, or
  // a fallback row could displace nothing and the cap would be applied twice.
  const full = lookup(loaded, prompt, { ...options, limit: 0 });
  const { findStaleFallback } = await import('./lib/unindexed-docs.mjs');
  const fallback = await findStaleFallback({
    repoRoot,
    indexedPaths: new Set(loaded.index.paths),
    normalizedQuery: full.normalizedQuery,
    tokens: full.tokens,
    specFolder: full.specFolder,
  });

  const merged = new Map(full.results.map((result) => [result.path, result]));
  for (const result of fallback.results) merged.set(result.path, result);
  const ranked = Array.from(merged.values()).sort(compareRanked);

  const limit = options.limit === undefined ? DEFAULT_LIMIT : options.limit;
  full.totalCandidates = ranked.length;
  full.truncated = limit > 0 && ranked.length > limit;
  full.results = limit > 0 ? ranked.slice(0, limit) : ranked;
  full.staleFallback = fallback.staleFallback;
  return full;
}

/**
 * @param {string} filePath File to place.
 * @param {string} root Directory it should sit under.
 * @returns {boolean} Whether the file resolves inside the root, links followed.
 */
function isInsideRoot(filePath, root) {
  let realFile;
  let realRoot;
  try {
    realFile = fs.realpathSync(filePath);
    realRoot = fs.realpathSync(root);
  } catch {
    return false;
  }
  const relative = path.relative(realRoot, realFile);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

/**
 * @param {string | null | undefined} specFolder Raw scope argument.
 * @returns {string | null} Folder without a trailing slash, or null when unscoped.
 */
function normalizeSpecFolder(specFolder) {
  if (typeof specFolder !== 'string') return null;
  const trimmed = specFolder.trim().replace(/\/+$/, '');
  return trimmed.length > 0 ? trimmed : null;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * Everything after a bare `--` is prompt text, so a prompt beginning with a
 * dash is never read as a flag.
 *
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ prompt: string, indexPath: string | undefined, specFolder: string | null | undefined, limit: number, json: boolean, hashIndex: boolean, scoringOnly: boolean, staleFallback: boolean }} Parsed invocation.
 */
export function parseArgs(argv) {
  const prompts = [];
  let indexPath;
  /** @type {string | null | undefined} */
  let specFolder;
  let limit = DEFAULT_LIMIT;
  let json = false;
  let hashIndex = true;
  let scoringOnly = false;
  let staleFallback = true;
  let literal = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (literal) {
      prompts.push(arg);
      continue;
    }
    if (arg === '--') {
      literal = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--no-index-hash') {
      hashIndex = false;
      continue;
    }
    if (arg === '--scoring-only') {
      scoringOnly = true;
      continue;
    }
    if (arg === '--no-stale-fallback') {
      staleFallback = false;
      continue;
    }
    if (arg === '--index' || arg === '--spec-folder' || arg === '--limit') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--index') indexPath = value;
      // An empty value is a real choice — it asks for the whole index — so it is
      // kept as given rather than collapsed into "not given", which is what the
      // default scope for a project linked into a host hangs on.
      if (arg === '--spec-folder') specFolder = value;
      if (arg === '--limit') {
        // parseInt would read `2junk` as 2 and `1.9` as 1 and silently truncate
        // the answer, so the raw text has to be a whole decimal number.
        if (!/^\d+$/.test(value)) throw new Error('--limit requires a non-negative integer');
        limit = Number.parseInt(value, 10);
      }
      i += 1;
      continue;
    }
    if (arg.startsWith('--')) throw new Error(`unknown argument: ${arg}`);
    prompts.push(arg);
  }

  if (prompts.length === 0) throw new Error('a prompt is required');
  return { hashIndex, indexPath, json, limit, prompt: prompts.join(' '), scoringOnly, specFolder, staleFallback };
}

/**
 * @param {Awaited<ReturnType<typeof lookupWithFallback>>} answer Lookup answer.
 * @param {string} indexPath Artifact the answer was read from.
 * @param {string | null} ownerRoot Host the artifact belongs to, or null.
 * @returns {string} Human-readable summary.
 */
function formatAnswer(answer, indexPath, ownerRoot) {
  const lines = [
    `query      : ${answer.normalizedQuery}`,
    `tokens     : ${answer.tokens.join(' ') || '(none)'}`,
    `discarded  : ${answer.discardedTokens.map((d) => `${d.token} (${d.reason})`).join(', ') || '(none)'}`,
    `scope      : ${answer.specFolder ?? '(unscoped)'}`,
    `source     : ${displayIndexPath(indexPath)}`,
    // The paths below name files in the host, not in the caller, so a reader
    // comparing them against their own checkout needs that root to resolve them.
    ...(ownerRoot === null ? [] : [`paths      : relative to ${displayIndexPath(ownerRoot)}`]),
    `index      : ${answer.indexHash ?? '(hash skipped)'}`,
    `manifest   : ${answer.manifestHash || '(none)'}`,
    `candidates : ${answer.results.length}${answer.truncated ? ` of ${answer.totalCandidates} (truncated)` : ''} from ${answer.candidatePhraseCount} phrase(s)`,
  ];
  const fallback = answer.staleFallback;
  if (fallback) {
    lines.push(fallback.available
      ? `fallback   : ${fallback.files} unindexed doc(s) read, ${fallback.matches} match(es)${fallback.truncated ? ` (capped at the first ${fallback.files} by path)` : ''}`
      : 'fallback   : unavailable (not a git work tree)');
  }
  for (const result of answer.results) {
    lines.push(`  ${result.score.toFixed(3)}  ${result.matchClass.padEnd(18)} ${result.path}`);
  }
  return `${lines.join('\n')}\n`;
}

/**
 * A path the caller can compare against the argument it passed, or against its
 * own working directory when it passed none.
 *
 * @param {string} indexPath Absolute index path.
 * @returns {string} Path relative to the working directory.
 */
function displayIndexPath(indexPath) {
  return path.relative(process.cwd(), indexPath) || '.';
}

/**
 * Explains a bare lookup that fell back while the caller's repository still
 * holds an index its setting no longer names.
 *
 * @param {string} [cwd] Directory the caller works in.
 * @returns {string|null} One stderr line, or null when nothing was left behind.
 */
export function disownedIndexHint(cwd = process.cwd()) {
  const root = callerRepoRoot(cwd);
  if (root === null) return null;
  const leftover = disownedDefaultIndex(root);
  if (leftover === null) return null;
  return `lookup-trigger-index: ${path.relative(root, leftover)} is not read, because the host names`
    + ` ${hostIndexDir(root)}/ and holds no index there; regenerate the index from ${root}\n`;
}

/**
 * @returns {Promise<number>} Process exit code.
 */
async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  // An explicit --index is the caller's own choice of artifact, so no host is
  // named and no default scope is inferred from one. A host setting that cannot
  // be honored exits 2, because exit 1 means a clean no-hit to every caller.
  let selection;
  try {
    selection = args.indexPath === undefined
      ? defaultIndexSelection()
      : { indexPath: args.indexPath, ownerRoot: null, specFolder: null };
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  // A fallback is silent by design, so the one case where the caller's own
  // repository explains it is said out loud. Only stderr: stdout stays the answer.
  if (args.indexPath === undefined && selection.indexPath === DEFAULT_INDEX_PATH) {
    const hint = disownedIndexHint();
    if (hint !== null) process.stderr.write(hint);
  }

  let loaded;
  try {
    loaded = loadIndex(selection.indexPath, { hashIndex: args.hashIndex });
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  // An explicit --index pins a specific artifact, so the answer describes that
  // artifact alone and the unindexed scan would contradict the pin.
  const answer = await lookupWithFallback(loaded, args.prompt, {
    limit: args.limit,
    scoringOnly: args.scoringOnly,
    specFolder: args.specFolder === undefined ? selection.specFolder : args.specFolder,
    staleFallback: args.staleFallback && args.indexPath === undefined,
    // A host's index spells its paths relative to the host, so the unindexed
    // scan has to walk that same tree for its paths to be comparable.
    repoRoot: selection.ownerRoot ?? undefined,
    indexPath: selection.indexPath,
  });
  const displayed = args.json
    ? `${JSON.stringify(answer, null, 2)}\n`
    : formatAnswer(answer, selection.indexPath, selection.ownerRoot);
  process.stdout.write(displayed);
  return answer.results.some((result) => result.score > 0) ? 0 : 1;
}

if (isMainModule(import.meta.url)) {
  main().then((code) => {
    process.exitCode = code;
  });
}
