// ───────────────────────────────────────────────────────────────
// MODULE: Ripgrep Retrieval Lane
// ───────────────────────────────────────────────────────────────
// Executes the recipes written in references/retrieval/retrieval-conventions.md
// verbatim and applies the caller-side rank tuple that document specifies.
// Ripgrep produces evidence and never ranks it, so ordering is computed here
// from the parsed match, not read off ripgrep's output order.
//
// Three flags are load-bearing and are never dropped: `--no-config` closes the
// argument-injection path that an ambient RIPGREP_CONFIG_PATH otherwise opens,
// the two exclusion globs keep archived and vendored trees out of the result
// set, and `--` keeps a phrase starting with a hyphen from being read as a
// flag. Each output mode is its own invocation because ripgrep silently lets
// the last output-mode flag win rather than rejecting the combination.
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { compareCodeUnits, normalizeTriggerText, scorePhrase } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────

/**
 * Flags shared by every recipe. `--hidden` is part of the contract because the
 * default roots include `.opencode`, whose own subtrees hold dotted directories
 * with live documentation; without the flag ripgrep skips them silently, so a
 * miss reads as a clean no-match instead of an unsearched corpus.
 */
export const BASE_FLAGS = Object.freeze([
  '--no-config',
  '--hidden',
  '--fixed-strings',
  '--ignore-case',
]);

/** Glob set, positive first so the exclusions that follow it win. */
export const GLOBS = Object.freeze([
  '--glob', '*.md',
  '--glob', '!**/z_archive/**',
  '--glob', '!**/node_modules/**',
  '--glob', '!**/.git/**',
]);

/** Default search roots. */
export const DEFAULT_ROOTS = Object.freeze(['specs', '.opencode']);

/** Exit-status classes. Anything at or above the error floor is an execution fault. */
export const EXIT_MATCH = 0;
export const EXIT_NO_MATCH = 1;
export const EXIT_ERROR_FLOOR = 2;

/** Evidence fields, most specific first; the index doubles as the rank. */
export const EVIDENCE_FIELDS = Object.freeze([
  'trigger_phrases',
  'title-or-description',
  'anchor-marker',
  'body',
]);

/** Output cap. The capped recipe keeps a broad token well inside it. */
const MAX_STDOUT_BYTES = 128 * 1024 * 1024;

/**
 * Environment override for the ripgrep executable. Some shells expose `rg` only
 * as a function, which a spawned process cannot see, so a caller can name the
 * binary instead of the recipes being rewritten around the gap. The recorded
 * command line stays the documented `rg …` form either way.
 */
export const RIPGREP_BIN_ENV = 'SPECKIT_RG_BIN';

// ───────────────────────────────────────────────────────────────
// 2. RECIPE BUILDERS
// ───────────────────────────────────────────────────────────────

/**
 * @param {string} phrase Literal phrase.
 * @param {string[]} [roots] Search roots.
 * @returns {string[]} Argument vector for the structured JSONL recipe.
 */
export function structuredRecipe(phrase, roots = DEFAULT_ROOTS) {
  return [...BASE_FLAGS, '--json', ...GLOBS, '--', phrase, ...roots];
}

/**
 * The structured recipe with one line of evidence per file. A single common
 * token otherwise emits hundreds of megabytes of JSONL, which buys nothing: the
 * caller ranks by file and field, and the second match in a file never changes
 * that. `--max-count` is the same bound the path-only recipe already uses.
 *
 * @param {string} phrase Literal phrase.
 * @param {string[]} [roots] Search roots.
 * @returns {string[]} Argument vector.
 */
export function structuredCappedRecipe(phrase, roots = DEFAULT_ROOTS) {
  return [...BASE_FLAGS, '--json', '--max-count', '1', ...GLOBS, '--', phrase, ...roots];
}

/**
 * @param {string} phrase Literal phrase.
 * @param {string[]} [roots] Search roots.
 * @returns {string[]} Argument vector for the path-only recipe.
 */
export function pathOnlyRecipe(phrase, roots = DEFAULT_ROOTS) {
  return [...BASE_FLAGS, '--files-with-matches', '--max-count', '1', ...GLOBS, '--', phrase, ...roots];
}

/**
 * @param {string} phrase Literal phrase.
 * @param {string[]} [roots] Search roots.
 * @returns {string[]} Argument vector for the count recipe.
 */
export function countRecipe(phrase, roots = DEFAULT_ROOTS) {
  return [...BASE_FLAGS, '--count', ...GLOBS, '--', phrase, ...roots];
}

// ───────────────────────────────────────────────────────────────
// 3. EXECUTION
// ───────────────────────────────────────────────────────────────

/**
 * Runs one recipe and classifies its exit status. A missing search root and a
 * clean miss both produce empty stdout, so the status is the only thing that
 * separates them and it is never collapsed into a single failure class.
 *
 * @param {string[]} argv Ripgrep arguments.
 * @param {{ cwd: string }} options Working directory.
 * @returns {{
 *   argv: string[],
 *   command: string,
 *   exitCode: number,
 *   outcome: 'match' | 'no-match' | 'error',
 *   stderr: string,
 *   stdout: string
 * }} Execution record.
 */
export function runRecipe(argv, options) {
  const run = spawnSync(resolveRipgrep(), argv, {
    cwd: options.cwd,
    encoding: 'utf8',
    maxBuffer: MAX_STDOUT_BYTES,
  });

  if (run.error) {
    return {
      argv,
      command: formatCommand(argv),
      exitCode: EXIT_ERROR_FLOOR,
      outcome: 'error',
      stderr: run.error.message,
      stdout: '',
    };
  }

  const exitCode = run.status ?? EXIT_ERROR_FLOOR;
  let outcome = 'error';
  if (exitCode === EXIT_MATCH) outcome = 'match';
  else if (exitCode === EXIT_NO_MATCH) outcome = 'no-match';

  return {
    argv,
    command: formatCommand(argv),
    exitCode,
    outcome,
    stderr: run.stderr ?? '',
    stdout: run.stdout ?? '',
  };
}

/**
 * @param {string[]} argv Ripgrep arguments.
 * @returns {string} Copy-pasteable command line.
 */
export function formatCommand(argv) {
  return ['rg', ...argv.map(quoteArgument)].join(' ');
}

/**
 * @param {NodeJS.ProcessEnv} [env] Environment to read.
 * @returns {string} Executable to spawn.
 */
export function resolveRipgrep(env = process.env) {
  const override = env[RIPGREP_BIN_ENV];
  if (typeof override === 'string' && override.length > 0) return override;
  if (resolvedRipgrep === undefined) resolvedRipgrep = locateRipgrep(env);
  return resolvedRipgrep;
}

let resolvedRipgrep;

// A shell that exposes `rg` only as a function, or a machine with no system
// ripgrep at all, still often carries a binary vendored by another tool. Walk
// PATH first so an installed ripgrep always wins, then the vendored copies, and
// fall back to the bare name so the spawn error stays the documented one.
const VENDORED_RIPGREP = [
  '/opt/homebrew/bin/rg',
  '/usr/local/bin/rg',
  path.join(homeDirectory(), '.local', 'share', 'opencode', 'bin', 'rg'),
  path.join(homeDirectory(), '.cache', 'opencode', 'bin', 'rg'),
  '/opt/homebrew/lib/node_modules/@openai/codex/bin/rg',
];

function homeDirectory() {
  return process.env.HOME || process.env.USERPROFILE || '';
}

function isExecutableFile(candidate) {
  try {
    fs.accessSync(candidate, fs.constants.X_OK);
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

function locateRipgrep(env) {
  const pathDirs = String(env.PATH ?? '').split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    const candidate = path.join(dir, 'rg');
    if (isExecutableFile(candidate)) return candidate;
  }
  for (const candidate of VENDORED_RIPGREP) {
    if (isExecutableFile(candidate)) return candidate;
  }
  return 'rg';
}

/**
 * Reads the ripgrep build once so a report names the tool it measured.
 *
 * @returns {string} Version line, or a reason it could not be read.
 */
export function ripgrepVersion() {
  const run = spawnSync(resolveRipgrep(), ['--version'], { encoding: 'utf8' });
  if (run.error) return `unavailable: ${run.error.message}; set ${RIPGREP_BIN_ENV} to the binary`;
  return String(run.stdout ?? '').split('\n')[0] ?? '';
}

/**
 * @param {string} value Single argument.
 * @returns {string} Shell-safe rendering.
 */
function quoteArgument(value) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`;
}

// ───────────────────────────────────────────────────────────────
// 4. PARSING
// ───────────────────────────────────────────────────────────────

/**
 * Extracts match records from JSONL output. Non-match record types (begin,
 * end, summary, context) are ignored; a line that does not parse is reported
 * rather than dropped, because silent loss here reads as a clean miss.
 *
 * @param {string} stdout Raw JSONL text.
 * @returns {{
 *   matches: Array<{ line: number, path: string, text: string }>,
 *   unparsedLines: number
 * }} Parsed matches.
 */
export function parseJsonLines(stdout) {
  const matches = [];
  let unparsedLines = 0;

  for (const line of stdout.split('\n')) {
    if (line.length === 0) continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      unparsedLines += 1;
      continue;
    }
    if (!record || record.type !== 'match') continue;
    const data = record.data ?? {};
    matches.push({
      line: Number(data.line_number ?? 0),
      path: String(data.path?.text ?? ''),
      text: String(data.lines?.text ?? '').replace(/\r?\n$/, ''),
    });
  }

  return { matches, unparsedLines };
}

// ───────────────────────────────────────────────────────────────
// 5. EVIDENCE FIELD CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * Maps a document's leading frontmatter to the one-based line ranges that
 * decide a match's evidence field. Only the leading block counts: a `---`
 * further down the file is a horizontal rule, not a second frontmatter.
 *
 * @param {string} text Whole file text.
 * @returns {{
 *   descriptionLines: Set<number>,
 *   frontmatterEnd: number,
 *   triggerLines: Set<number>
 * }} Line ranges.
 */
export function frontmatterFieldLines(text) {
  const lines = text.split('\n');
  const triggerLines = new Set();
  const descriptionLines = new Set();
  if (lines[0]?.trim() !== '---') {
    return { descriptionLines, frontmatterEnd: 0, triggerLines };
  }

  let end = 0;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { end = i + 1; break; }
  }
  if (end === 0) return { descriptionLines, frontmatterEnd: 0, triggerLines };

  let inTriggerList = false;
  for (let i = 1; i < end - 1; i += 1) {
    const raw = lines[i];
    const oneBased = i + 1;
    if (/^(trigger_phrases|triggerPhrases)\s*:/.test(raw)) {
      inTriggerList = true;
      triggerLines.add(oneBased);
      continue;
    }
    if (inTriggerList && /^\s+/.test(raw)) {
      triggerLines.add(oneBased);
      continue;
    }
    inTriggerList = false;
    if (/^(title|description)\s*:/.test(raw)) descriptionLines.add(oneBased);
  }

  return { descriptionLines, frontmatterEnd: end, triggerLines };
}

/**
 * @param {string} lineText Matched line.
 * @returns {boolean} True when the line carries an anchor marker.
 */
export function isAnchorMarker(lineText) {
  return /<!--\s*\/?ANCHOR:[^>]*-->/.test(lineText);
}

// ───────────────────────────────────────────────────────────────
// 6. RANKING
// ───────────────────────────────────────────────────────────────

/**
 * Applies the caller-side rank tuple: evidence field, then normalized match
 * class, then relative path and one-based line. Every component comes from the
 * parsed match, so two runs over an unchanged corpus order identically.
 *
 * @param {Array<{ line: number, path: string, text: string }>} matches Parsed matches.
 * @param {{ cwd: string, normalizedQuery: string }} options Ranking context.
 * @returns {Array<{
 *   evidenceField: string,
 *   line: number,
 *   matchClass: string,
 *   packetPath: string,
 *   path: string,
 *   text: string
 * }>} Ranked evidence.
 */
export function rankMatches(matches, options) {
  /** @type {Map<string, ReturnType<typeof frontmatterFieldLines>>} */
  const fieldCache = new Map();

  const ranked = matches.map((match) => {
    let fields = fieldCache.get(match.path);
    if (!fields) {
      fields = readFieldLines(path.resolve(options.cwd, match.path));
      fieldCache.set(match.path, fields);
    }

    let evidenceField = 'body';
    if (fields.triggerLines.has(match.line)) evidenceField = 'trigger_phrases';
    else if (fields.descriptionLines.has(match.line)) evidenceField = 'title-or-description';
    else if (isAnchorMarker(match.text)) evidenceField = 'anchor-marker';

    const scored = scorePhrase(options.normalizedQuery, normalizeTriggerText(match.text));

    return {
      evidenceField,
      line: match.line,
      matchClass: scored?.matchClass ?? 'partial',
      packetPath: path.dirname(match.path),
      path: match.path,
      text: match.text,
    };
  });

  return ranked.sort((a, b) => (EVIDENCE_FIELDS.indexOf(a.evidenceField) - EVIDENCE_FIELDS.indexOf(b.evidenceField))
    || (matchClassOrder(a.matchClass) - matchClassOrder(b.matchClass))
    || compareCodeUnits(a.path, b.path)
    || (a.line - b.line));
}

/**
 * @param {string} filePath Absolute path.
 * @returns {ReturnType<typeof frontmatterFieldLines>} Field ranges, empty when unreadable.
 */
function readFieldLines(filePath) {
  try {
    return frontmatterFieldLines(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return { descriptionLines: new Set(), frontmatterEnd: 0, triggerLines: new Set() };
  }
}

/** Match-class order used by the rank tuple; the shared scorer names the classes. */
const MATCH_CLASS_ORDER = Object.freeze(['exact', 'phrase-containment', 'query-containment', 'token-overlap', 'partial']);

/**
 * @param {string} matchClass Class name.
 * @returns {number} Rank, unknown classes last.
 */
function matchClassOrder(matchClass) {
  const rank = MATCH_CLASS_ORDER.indexOf(matchClass);
  return rank === -1 ? MATCH_CLASS_ORDER.length : rank;
}
