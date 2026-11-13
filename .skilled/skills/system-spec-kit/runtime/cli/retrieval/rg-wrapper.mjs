#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Ripgrep Recipe Wrapper
// ───────────────────────────────────────────────────────────────────
// The three convention recipes behind one front door, with the caller-side rank
// applied and the exit status read on every invocation.
//
// Three things this wrapper refuses to do, each because the naive version is
// wrong in a way that reads as success:
//
// 1. It never combines output modes. `--json` is incompatible with
//    `--files-with-matches` and `--count`, and ripgrep resolves the conflict by
//    letting the last flag win rather than by failing, so a wrapper that bolted
//    a count onto the structured recipe would silently return a different shape
//    than it asked for. Each recipe is its own invocation.
// 2. It never treats ripgrep's output order as relevance. Ripgrep supplies
//    matches, paths and lines; the rank tuple — evidence field, then normalized
//    match class, then relative path and one-based line — is applied here.
// 3. It never collapses exit 1 into failure. A clean miss and a broken
//    invocation both produce empty stdout, and the status is the only thing
//    that separates them.
//
// The recipe builders below spell the flags in the order the convention
// document writes them, so a recipe can be compared against the document by
// eye. `assertRecipeParity` proves that ordering carries the same flag set as
// the shared retrieval lane, which is what keeps two spellings of one recipe
// from drifting into two different searches.
//
// Usage:
//   node rg-wrapper.mjs <structured|path|count> <phrase> [--root <dir>]
//                       [--search-root <dir>]... [--limit <n>] [--json]
//                       [--include-archive]
//
// --limit caps how many files a recipe reports (default 20); --limit 0 reports
// every file. The totals always cover every file, shown or not.
//
// Archived packets are left out by default and are searched only with
// --include-archive, which also marks each archived hit.
// That flag also searches the description.json and graph-metadata.json of
// archived packets, as its own invocation, because an output mode is never
// combined with another.
//
// Exit codes: 0 = match, 1 = no match, 2 = execution or configuration error.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import process from 'node:process';

import { stableStringify } from './lib/artifact.mjs';
import { normalizeTriggerText } from './lib/normalize.mjs';
import {
  countRecipe as laneCountRecipe,
  pathOnlyRecipe as lanePathRecipe,
  structuredRecipe as laneStructuredRecipe,
  DEFAULT_LIMIT,
  EXIT_ERROR_FLOOR,
  EXIT_MATCH,
  EXIT_NO_MATCH,
  formatCommand,
  parseJsonLines,
  rankMatches,
  runRecipe,
  shapeRankedMatches,
} from './lib/rg-lane.mjs';
import { isMainModule } from '../lib/esm-entry.mjs';
import { findSourceRoot } from '../../hooks/lib/workspace/repo-root.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/**
 * Report schema; bump when a consumer would have to change to read it.
 * Version 2 redefines `results` from every match to one row per file.
 * Version 3 bounds `paths` and `counts` to the file limit and sorts them.
 */
export const SCHEMA_VERSION = 3;

/** The recipe names this wrapper accepts. */
export const RECIPES = Object.freeze(['structured', 'path', 'count']);

/** Search roots the convention names. */
export const DEFAULT_SEARCH_ROOTS = Object.freeze(['specs', '.skilled']);

/**
 * The convention's roots, with the source root named the way this checkout
 * names it: a checkout that carries only `.opencode` is searched there, not in a
 * `.skilled` that does not exist.
 *
 * @param {string} cwd Repository root the search runs from.
 * @returns {string[]} Search roots.
 */
export function searchRootsFor(cwd) {
  const sourceRoot = findSourceRoot(cwd);
  return sourceRoot ? ['specs', path.basename(sourceRoot)] : [...DEFAULT_SEARCH_ROOTS];
}

/**
 * Glob set in the documented order: the positive glob first, then the
 * exclusions, because a later glob overrides an earlier one.
 */
const GLOBS = Object.freeze([
  '--glob', '*.md',
  '--glob', '!**/z_archive/**',
  '--glob', '!**/node_modules/**',
  '--glob', '!**/.git/**',
  '--glob', '!**/scratch/**',
]);

/**
 * Archive-inclusive variant of `GLOBS`: the same guards minus the archive
 * exclusion. Archived packets are searched only on request.
 */
const ARCHIVE_GLOBS = Object.freeze(
  GLOBS.filter((argument, index, all) => {
    const archived = '!**/z_archive/**';
    return argument !== archived && all[index + 1] !== archived;
  }),
);

/**
 * The flags every recipe opens with, in the convention document's order.
 * `--hidden` belongs here for the same reason it is in the shared lane: the
 * `.skilled` root holds dotted directories with live documentation, and
 * without it a miss there reads as a clean no-match.
 */
const HEAD_FLAGS = Object.freeze(['--no-config', '--hidden']);

export { EXIT_ERROR_FLOOR, EXIT_MATCH, EXIT_NO_MATCH };

// ───────────────────────────────────────────────────────────────────
// 2. RECIPE BUILDERS
// ───────────────────────────────────────────────────────────────────

/**
 * Structured search, for line-addressable evidence.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @param {{ includeArchive?: boolean }} [options] Include archived trees when true.
 * @returns {string[]} Argument vector.
 */
export function structuredRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS, options = {}) {
  const globs = options.includeArchive === true ? ARCHIVE_GLOBS : GLOBS;
  return [...HEAD_FLAGS, '--json', '--fixed-strings', '--ignore-case', ...globs, '--', phrase, ...roots];
}

/**
 * Path search, for a bounded candidate list.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @param {{ includeArchive?: boolean }} [options] Include archived trees when true.
 * @returns {string[]} Argument vector.
 */
export function pathRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS, options = {}) {
  const globs = options.includeArchive === true ? ARCHIVE_GLOBS : GLOBS;
  return [
    ...HEAD_FLAGS, '--fixed-strings', '--ignore-case',
    '--files-with-matches', '--max-count', '1',
    ...globs, '--', phrase, ...roots,
  ];
}

/**
 * Count, as its own recipe rather than a flag added to another.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @param {{ includeArchive?: boolean }} [options] Include archived trees when true.
 * @returns {string[]} Argument vector.
 */
export function countRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS, options = {}) {
  const globs = options.includeArchive === true ? ARCHIVE_GLOBS : GLOBS;
  return [...HEAD_FLAGS, '--fixed-strings', '--ignore-case', '--count', ...globs, '--', phrase, ...roots];
}

/**
 * Metadata lane for archived packets: the phrase is searched in the
 * description.json and graph-metadata.json beside each archived packet. It is
 * its own invocation because an output mode is never combined with another, and
 * it is deliberately not a recipe a caller names, so it stays out of RECIPES and
 * RECIPE_BUILDERS and `assertRecipeParity` never compares it.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @returns {string[]} Argument vector.
 */
export function jsonLaneRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS) {
  return [
    ...HEAD_FLAGS, '--fixed-strings', '--ignore-case',
    '--files-with-matches', '--max-count', '1',
    '--glob', '**/z_archive/**/description.json',
    '--glob', '**/z_archive/**/graph-metadata.json',
    '--glob', '!**/node_modules/**',
    '--glob', '!**/.git/**',
    '--glob', '!**/scratch/**',
    '--', phrase, ...roots,
  ];
}

/** Recipe name to builder. */
export const RECIPE_BUILDERS = Object.freeze({
  count: countRecipe,
  path: pathRecipe,
  structured: structuredRecipe,
});

/**
 * Proves this wrapper's spelling of a recipe carries the same flags, phrase and
 * roots as the shared retrieval lane's. Order differs by design — the wrapper
 * follows the convention document so the two can be compared by eye — and order
 * is not meaningful to ripgrep, but a divergence in the flag *set* would mean
 * the two lanes are running different searches under one name.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @param {{ includeArchive?: boolean }} [options] Archive mode passed to both spellings.
 * @returns {Array<{ lane: string[], recipe: string, wrapper: string[] }>} Divergences, empty when aligned.
 */
export function assertRecipeParity(phrase, roots = DEFAULT_SEARCH_ROOTS, options = {}) {
  const lanes = {
    count: laneCountRecipe(phrase, [...roots], options),
    path: lanePathRecipe(phrase, [...roots], options),
    structured: laneStructuredRecipe(phrase, [...roots], options),
  };

  const divergences = [];
  for (const recipe of RECIPES) {
    const wrapper = [...RECIPE_BUILDERS[recipe](phrase, roots, options)].sort();
    const lane = [...lanes[recipe]].sort();
    if (wrapper.join('\0') !== lane.join('\0')) {
      divergences.push({ lane: lanes[recipe], recipe, wrapper: RECIPE_BUILDERS[recipe](phrase, roots, options) });
    }
  }
  return divergences;
}

// ───────────────────────────────────────────────────────────────────
// 3. EXECUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Reports whether a path has a segment exactly equal to `z_archive`. Both `/`
 * and the platform separator are treated as separators.
 *
 * @param {string} candidate Path to inspect.
 * @returns {boolean} True when the path sits in an archive directory.
 */
export function isArchivedPath(candidate) {
  return candidate.split('/').some((segment) => segment.split(path.sep).includes('z_archive'));
}

/**
 * Runs one recipe and shapes its output for the recipe's own mode.
 *
 * @param {string} recipe One of RECIPES.
 * @param {string} phrase Literal phrase.
 * @param {{ cwd?: string, includeArchive?: boolean, limit?: number, roots?: ReadonlyArray<string> }} [options] Execution context.
 * @returns {{
 *   command: string,
 *   counts: Array<{ archived?: boolean, count: number, path: string }> | null,
 *   exitCode: number,
 *   fileCount: number | null,
 *   hidden: { files: number, matches: number | null } | null,
 *   includeArchive?: true,
 *   jsonLane?: {
 *     command: string,
 *     exitCode: number,
 *     outcome: 'match' | 'no-match' | 'error',
 *     paths: string[],
 *     stderr: string
 *   },
 *   limit: number | null,
 *   matchCount: number | null,
 *   outcome: 'match' | 'no-match' | 'error',
 *   paths: string[] | null,
 *   recipe: string,
 *   results: Array<Record<string, unknown>> | null,
 *   schemaVersion: number,
 *   stderr: string,
 *   truncated: boolean,
 *   unparsedLines: number
 * }} Execution record.
 */
export function search(recipe, phrase, options = {}) {
  const builder = RECIPE_BUILDERS[recipe];
  if (!builder) throw new Error(`unknown recipe: ${recipe}`);

  const includeArchive = options.includeArchive === true;
  const cwd = options.cwd ?? process.cwd();
  const roots = options.roots ?? searchRootsFor(cwd);
  const argv = builder(phrase, roots, { includeArchive });
  const run = runRecipe(argv, { cwd });

  const record = {
    command: formatCommand(argv),
    counts: null,
    exitCode: run.exitCode,
    fileCount: null,
    hidden: null,
    limit: null,
    matchCount: null,
    outcome: run.outcome,
    paths: null,
    recipe,
    results: null,
    schemaVersion: SCHEMA_VERSION,
    stderr: run.stderr,
    truncated: false,
    unparsedLines: 0,
  };
  if (includeArchive) record.includeArchive = true;

  // The archive metadata lane cannot ride on the main run: an output mode is
  // never combined with another, so it is a second invocation. It is attached
  // before any early return, including the main run's error return, because the
  // combined status below already folds its fault into the record.
  if (includeArchive) {
    const jsonArgv = jsonLaneRecipe(phrase, roots);
    const jsonRun = runRecipe(jsonArgv, { cwd });
    record.jsonLane = {
      command: formatCommand(jsonArgv),
      exitCode: jsonRun.exitCode,
      outcome: jsonRun.outcome,
      paths: jsonRun.stdout.split('\n').filter((line) => line.length > 0).sort(),
      stderr: jsonRun.stderr,
    };

    if (run.outcome === 'error' || jsonRun.outcome === 'error') {
      // The main run wins the tie: when both failed, its status and stderr are
      // the ones reported.
      const failing = run.outcome === 'error' ? run : jsonRun;
      record.exitCode = failing.exitCode;
      record.outcome = 'error';
      record.stderr = failing.stderr;
    } else if (run.outcome === 'no-match' && jsonRun.outcome === 'match') {
      // A main-run miss in .md files is still a match when an archived packet's
      // metadata carries the phrase; the main recipe's own fields stay shaped
      // exactly as a miss.
      record.exitCode = EXIT_MATCH;
      record.outcome = 'match';
    }
  }

  // An execution fault is surfaced with its stderr rather than parsed. Parsing
  // the empty stdout of a failed invocation would report a clean miss.
  if (run.outcome === 'error') return record;

  if (recipe === 'structured') {
    const parsed = parseJsonLines(run.stdout);
    const ranked = rankMatches(parsed.matches, { cwd, normalizedQuery: normalizeTriggerText(phrase) });
    // One row per file is a post-rank filter, not a second ranker: the first
    // row for a path is already that file's highest-ranked line.
    const shaped = shapeRankedMatches(ranked, { limit: options.limit ?? DEFAULT_LIMIT });
    record.results = includeArchive
      ? shaped.results.map((result) => ({ ...result, archived: isArchivedPath(result.path) }))
      : shaped.results;
    record.matchCount = shaped.matchCount;
    record.fileCount = shaped.fileCount;
    record.hidden = shaped.hidden;
    record.limit = shaped.limit;
    record.truncated = shaped.hidden.files > 0;
    record.unparsedLines = parsed.unparsedLines;
    return record;
  }

  // Ripgrep walks in parallel, so its line order changes between runs. Both
  // lists are sorted before the cut so a limit keeps the same files every time.
  const lines = run.stdout.split('\n').filter((line) => line.length > 0);
  const limit = options.limit ?? DEFAULT_LIMIT;
  const keep = limit === 0 ? lines.length : limit;
  record.limit = limit;
  record.fileCount = lines.length;

  if (recipe === 'path') {
    // The path recipe stops at one match per file, so it has no match total.
    record.paths = lines.sort().slice(0, keep);
    record.hidden = { files: lines.length - record.paths.length, matches: null };
    record.truncated = record.hidden.files > 0;
    return record;
  }

  const counts = lines
    .map((line) => {
      const separator = line.lastIndexOf(':');
      return { count: Number(line.slice(separator + 1)), path: line.slice(0, separator) };
    })
    .sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
  const sum = (entries) => entries.reduce((total, entry) => total + entry.count, 0);
  const kept = counts.slice(0, keep);
  record.counts = includeArchive
    ? kept.map((entry) => ({ ...entry, archived: isArchivedPath(entry.path) }))
    : kept;
  record.matchCount = sum(counts);
  record.hidden = { files: counts.length - record.counts.length, matches: sum(counts.slice(keep)) };
  record.truncated = record.hidden.files > 0;
  return record;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ includeArchive: boolean, json: boolean, limit: number, phrase: string, recipe: string, root: string | undefined, roots: string[] }} Parsed options.
 */
export function parseArgs(argv) {
  const positional = [];
  const roots = [];
  let includeArchive = false;
  let json = false;
  let limit = DEFAULT_LIMIT;
  let root;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--include-archive') { includeArchive = true; continue; }
    if (arg === '--json') { json = true; continue; }
    if (arg === '--root' || arg === '--search-root' || arg === '--limit') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--limit') {
        // parseInt would read `2junk` as 2 and `1.9` as 1 and silently truncate
        // the answer, so the raw text has to be a whole decimal number.
        // A run of digits longer than a safe integer parses to Infinity, which
        // the JSON record would then report as a null limit.
        const parsed = /^\d+$/.test(value) ? Number(value) : Number.NaN;
        if (!Number.isSafeInteger(parsed)) throw new Error('--limit requires a non-negative integer');
        limit = parsed;
      } else if (arg === '--root') root = value;
      else roots.push(value);
      i += 1;
      continue;
    }
    if (arg.startsWith('--')) throw new Error(`unknown argument: ${arg}`);
    positional.push(arg);
  }

  const [recipe, phrase, ...extra] = positional;
  if (!RECIPES.includes(recipe)) {
    throw new Error(`first argument must be one of ${RECIPES.join(', ')}`);
  }
  if (phrase === undefined) throw new Error('a phrase is required');
  // A third positional is almost always an unquoted multi-word phrase. Searching
  // the first word alone would return a plausible but wrong answer, so refuse.
  if (extra.length > 0) {
    throw new Error(`unexpected extra argument(s): ${extra.join(' ')}; quote a multi-word phrase`);
  }

  const parsed = { json, limit, phrase, recipe, root, roots: roots.length > 0 ? roots : undefined };
  // The mode is readable as a boolean either way, but it joins the default
  // parsed shape only when set, so a flag-off caller sees no new field.
  Object.defineProperty(parsed, 'includeArchive', { enumerable: includeArchive, value: includeArchive });
  return parsed;
}

/**
 * @param {Record<string, any>} record Execution record.
 * @returns {string} Human-readable summary.
 */
export function formatSummary(record) {
  const lines = [
    `recipe  : ${record.recipe}`,
    `command : ${record.command}`,
    `exit    : ${record.exitCode} (${record.outcome})`,
  ];

  if (record.outcome === 'error') {
    lines.push(`stderr  : ${record.stderr.trim() || '(empty)'}`);
    return `${lines.join('\n')}\n`;
  }

  const archivedSuffix = (candidate) => (
    record.includeArchive === true && isArchivedPath(candidate) ? '  [archived]' : ''
  );

  if (record.results) {
    const atLimit = record.limit === 0 ? 'limit 0 (uncapped)' : `limit ${record.limit}`;
    const unparsed = record.unparsedLines > 0 ? `, unparsed ${record.unparsedLines}` : '';
    lines.push(`ranked  : ${record.matchCount} match(es) in ${record.fileCount} file(s); showing ${record.results.length} file(s) at ${atLimit}${unparsed}`);
    // Shaping already bounded the rows to --limit files, so every shaped row is
    // printed; a second cut here would hide rows the tail line never counts.
    for (const result of record.results) {
      const moreInFile = result.moreInFile > 0 ? ` (+${result.moreInFile} more in this file)` : '';
      lines.push(`  ${result.evidenceField.padEnd(20)} ${result.path}:${result.line}${moreInFile}${archivedSuffix(result.path)}`);
    }
    if (record.hidden?.files > 0) {
      lines.push(`  +${record.hidden.files} more files with ${record.hidden.matches} matches`);
    }
  }
  if (record.paths) {
    lines.push(`paths   : ${record.fileCount}`);
    for (const found of record.paths) lines.push(`  ${found}${archivedSuffix(found)}`);
    if (record.hidden.files > 0) lines.push(`  +${record.hidden.files} more files`);
  }
  if (record.counts) {
    lines.push(`counts  : ${record.matchCount} across ${record.fileCount} path(s)`);
    for (const entry of record.counts) lines.push(`  ${String(entry.count).padStart(6)} ${entry.path}${archivedSuffix(entry.path)}`);
    if (record.hidden.files > 0) {
      lines.push(`  +${record.hidden.files} more files with ${record.hidden.matches} matches`);
    }
  }
  if (record.jsonLane) {
    // The metadata lane is its own invocation and is not bounded by --limit, so
    // every path it matched is printed.
    lines.push(`json    : ${record.jsonLane.paths.length} archived metadata file(s)`);
    for (const found of record.jsonLane.paths) lines.push(`  ${found}  [archived]`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {number} Process exit code, mapped from ripgrep's own.
 */
export function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return EXIT_ERROR_FLOOR;
  }

  const record = search(args.recipe, args.phrase, {
    cwd: args.root ? path.resolve(args.root) : process.cwd(),
    includeArchive: args.includeArchive,
    limit: args.limit,
    roots: args.roots,
  });

  if (record.outcome === 'error') {
    process.stderr.write(`${record.command}\n${record.stderr.trim() || 'ripgrep failed'}\n`);
    return record.exitCode >= EXIT_ERROR_FLOOR ? record.exitCode : EXIT_ERROR_FLOOR;
  }

  process.stdout.write(args.json ? `${stableStringify(record)}\n` : formatSummary(record));
  return record.exitCode;
}

if (isMainModule(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
