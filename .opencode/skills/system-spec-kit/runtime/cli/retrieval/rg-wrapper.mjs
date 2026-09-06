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
//                       [--search-root <dir>]... [--json]
//
// Exit codes: 0 = match, 1 = no match, 2 = execution or configuration error.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { stableStringify } from './lib/artifact.mjs';
import { normalizeTriggerText } from './lib/normalize.mjs';
import {
  countRecipe as laneCountRecipe,
  pathOnlyRecipe as lanePathRecipe,
  structuredRecipe as laneStructuredRecipe,
  EXIT_ERROR_FLOOR,
  EXIT_MATCH,
  EXIT_NO_MATCH,
  formatCommand,
  parseJsonLines,
  rankMatches,
  runRecipe,
} from './lib/rg-lane.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Report schema; bump when a consumer would have to change to read it. */
export const SCHEMA_VERSION = 1;

/** The recipe names this wrapper accepts. */
export const RECIPES = Object.freeze(['structured', 'path', 'count']);

/** Search roots the convention names. */
export const DEFAULT_SEARCH_ROOTS = Object.freeze(['specs', '.opencode']);

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
 * The flags every recipe opens with, in the convention document's order.
 * `--hidden` belongs here for the same reason it is in the shared lane: the
 * `.opencode` root holds dotted directories with live documentation, and
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
 * @returns {string[]} Argument vector.
 */
export function structuredRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS) {
  return [...HEAD_FLAGS, '--json', '--fixed-strings', '--ignore-case', ...GLOBS, '--', phrase, ...roots];
}

/**
 * Path search, for a bounded candidate list.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @returns {string[]} Argument vector.
 */
export function pathRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS) {
  return [
    ...HEAD_FLAGS, '--fixed-strings', '--ignore-case',
    '--files-with-matches', '--max-count', '1',
    ...GLOBS, '--', phrase, ...roots,
  ];
}

/**
 * Count, as its own recipe rather than a flag added to another.
 *
 * @param {string} phrase Literal phrase.
 * @param {ReadonlyArray<string>} [roots] Search roots.
 * @returns {string[]} Argument vector.
 */
export function countRecipe(phrase, roots = DEFAULT_SEARCH_ROOTS) {
  return [...HEAD_FLAGS, '--fixed-strings', '--ignore-case', '--count', ...GLOBS, '--', phrase, ...roots];
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
 * @returns {Array<{ lane: string[], recipe: string, wrapper: string[] }>} Divergences, empty when aligned.
 */
export function assertRecipeParity(phrase, roots = DEFAULT_SEARCH_ROOTS) {
  const lanes = {
    count: laneCountRecipe(phrase, [...roots]),
    path: lanePathRecipe(phrase, [...roots]),
    structured: laneStructuredRecipe(phrase, [...roots]),
  };

  const divergences = [];
  for (const recipe of RECIPES) {
    const wrapper = [...RECIPE_BUILDERS[recipe](phrase, roots)].sort();
    const lane = [...lanes[recipe]].sort();
    if (wrapper.join('\0') !== lane.join('\0')) {
      divergences.push({ lane: lanes[recipe], recipe, wrapper: RECIPE_BUILDERS[recipe](phrase, roots) });
    }
  }
  return divergences;
}

// ───────────────────────────────────────────────────────────────────
// 3. EXECUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Runs one recipe and shapes its output for the recipe's own mode.
 *
 * @param {string} recipe One of RECIPES.
 * @param {string} phrase Literal phrase.
 * @param {{ cwd?: string, roots?: ReadonlyArray<string> }} [options] Execution context.
 * @returns {{
 *   command: string,
 *   counts: Array<{ count: number, path: string }> | null,
 *   exitCode: number,
 *   outcome: 'match' | 'no-match' | 'error',
 *   paths: string[] | null,
 *   recipe: string,
 *   results: Array<Record<string, unknown>> | null,
 *   schemaVersion: number,
 *   stderr: string,
 *   unparsedLines: number
 * }} Execution record.
 */
export function search(recipe, phrase, options = {}) {
  const builder = RECIPE_BUILDERS[recipe];
  if (!builder) throw new Error(`unknown recipe: ${recipe}`);

  const cwd = options.cwd ?? process.cwd();
  const roots = options.roots ?? DEFAULT_SEARCH_ROOTS;
  const argv = builder(phrase, roots);
  const run = runRecipe(argv, { cwd });

  const record = {
    command: formatCommand(argv),
    counts: null,
    exitCode: run.exitCode,
    outcome: run.outcome,
    paths: null,
    recipe,
    results: null,
    schemaVersion: SCHEMA_VERSION,
    stderr: run.stderr,
    unparsedLines: 0,
  };

  // An execution fault is surfaced with its stderr rather than parsed. Parsing
  // the empty stdout of a failed invocation would report a clean miss.
  if (run.outcome === 'error') return record;

  if (recipe === 'structured') {
    const parsed = parseJsonLines(run.stdout);
    record.results = rankMatches(parsed.matches, { cwd, normalizedQuery: normalizeTriggerText(phrase) });
    record.unparsedLines = parsed.unparsedLines;
    return record;
  }

  if (recipe === 'path') {
    record.paths = run.stdout.split('\n').filter((line) => line.length > 0);
    return record;
  }

  record.counts = run.stdout
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      const separator = line.lastIndexOf(':');
      return { count: Number(line.slice(separator + 1)), path: line.slice(0, separator) };
    });
  return record;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ json: boolean, phrase: string, recipe: string, root: string | undefined, roots: string[] }} Parsed options.
 */
export function parseArgs(argv) {
  const positional = [];
  const roots = [];
  let json = false;
  let root;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') { json = true; continue; }
    if (arg === '--root' || arg === '--search-root') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--root') root = value; else roots.push(value);
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

  return { json, phrase, recipe, root, roots: roots.length > 0 ? roots : [...DEFAULT_SEARCH_ROOTS] };
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

  if (record.results) {
    lines.push(`ranked  : ${record.results.length} match(es), unparsed ${record.unparsedLines}`);
    for (const result of record.results.slice(0, 20)) {
      lines.push(`  ${result.evidenceField.padEnd(20)} ${result.path}:${result.line}`);
    }
  }
  if (record.paths) {
    lines.push(`paths   : ${record.paths.length}`);
    for (const found of record.paths.slice(0, 20)) lines.push(`  ${found}`);
  }
  if (record.counts) {
    const total = record.counts.reduce((sum, entry) => sum + entry.count, 0);
    lines.push(`counts  : ${total} across ${record.counts.length} path(s)`);
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
    roots: args.roots,
  });

  if (record.outcome === 'error') {
    process.stderr.write(`${record.command}\n${record.stderr.trim() || 'ripgrep failed'}\n`);
    return record.exitCode >= EXIT_ERROR_FLOOR ? record.exitCode : EXIT_ERROR_FLOOR;
  }

  process.stdout.write(args.json ? `${stableStringify(record)}\n` : formatSummary(record));
  return record.exitCode;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
