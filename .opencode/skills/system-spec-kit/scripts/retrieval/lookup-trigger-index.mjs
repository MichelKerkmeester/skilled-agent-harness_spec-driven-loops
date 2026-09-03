#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPT: Trigger Index Lookup
// ───────────────────────────────────────────────────────────────
// Resolves a prompt against the committed trigger index using the same
// candidate gate, score classes and scope filter as the substring trigger lane
// in mcp-server/lib/search/hybrid-search.ts, so results from the two can be
// diffed directly.
//
// Everything here is synchronous and the import list is deliberately short:
// the whole point is a single answer from a cold Node process, and every extra
// module is paid for on every lookup. Parsing the artifact dominates that cost,
// which is why the partial-substring candidates are scanned out of the phrase
// keys rather than read from a stored posting list: scanning tens of thousands
// of short keys costs single-digit milliseconds, while the postings that would
// answer the same question cost far more to parse on every single lookup.
//
// Usage:
//   node lookup-trigger-index.mjs "<prompt>" [--index <path>] [--spec-folder <scope>]
//                                 [--limit <n>] [--no-index-hash] [--json]
//
// Exit codes: 0 = candidates found, 1 = no candidates, 2 = bad invocation or unreadable index.
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
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

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_INDEX_PATH = path.resolve(SCRIPT_DIR, '..', '..', 'data', 'trigger-index.json');

/** Mirrors the trigger lane's result cap. */
export const DEFAULT_LIMIT = 20;

/** Class given to a candidate the SQL substring gate admits but the score function rejects. */
export const PARTIAL_CLASS = 'partial';

// ───────────────────────────────────────────────────────────────
// 2. LOADING
// ───────────────────────────────────────────────────────────────

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

  if (!index || typeof index !== 'object') throw new Error(`index is not an object: ${indexPath}`);
  if (!index.phrases || typeof index.phrases !== 'object') {
    throw new Error(`index is missing its phrases map: ${indexPath}`);
  }
  if (!Array.isArray(index.paths)) {
    throw new Error(`index is missing its path table: ${indexPath}`);
  }

  return {
    index,
    indexHash: options.hashIndex === false ? null : createHash('sha256').update(text).digest('hex'),
    indexPath,
    manifestHash: typeof index.manifestHash === 'string' ? index.manifestHash : '',
    schemaVersion: typeof index.schemaVersion === 'number' ? index.schemaVersion : 0,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. LOOKUP
// ───────────────────────────────────────────────────────────────

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
 * Resolves a prompt against a loaded index.
 *
 * @param {ReturnType<typeof loadIndex>} loaded Result of loadIndex.
 * @param {string} prompt Raw prompt text.
 * @param {{ specFolder?: string | null, limit?: number }} [options] Query options.
 * @returns {{
 *   normalizedQuery: string,
 *   tokens: string[],
 *   discardedTokens: Array<{ reason: string, token: string }>,
 *   specFolder: string | null,
 *   indexHash: string | null,
 *   manifestHash: string,
 *   schemaVersion: number,
 *   candidatePhraseCount: number,
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
    if (!Array.isArray(posting)) continue;

    const scored = scorePhrase(normalizedQuery, phrase) ?? { matchClass: PARTIAL_CLASS, score: 0 };
    for (const pathId of posting) {
      const documentPath = index.paths[pathId];
      if (documentPath === undefined) continue;
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

  const ordered = Array.from(byPath, ([documentPath, value]) => ({
    matchClass: value.matchClass,
    path: documentPath,
    phrases: Array.from(value.phrases).sort(compareCodeUnits),
    score: value.score,
  })).sort((a, b) => (b.score - a.score)
    || (matchClassRank(a.matchClass) - matchClassRank(b.matchClass))
    || compareCodeUnits(a.path, b.path));

  answer.truncated = limit > 0 && ordered.length > limit;
  answer.results = limit > 0 ? ordered.slice(0, limit) : ordered;
  return answer;
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

// ───────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────

/**
 * Everything after a bare `--` is prompt text, so a prompt beginning with a
 * dash is never read as a flag.
 *
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ prompt: string, indexPath: string | undefined, specFolder: string | null, limit: number, json: boolean, hashIndex: boolean }} Parsed invocation.
 */
function parseArgs(argv) {
  const prompts = [];
  let indexPath;
  let specFolder = null;
  let limit = DEFAULT_LIMIT;
  let json = false;
  let hashIndex = true;
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
    if (arg === '--index' || arg === '--spec-folder' || arg === '--limit') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${arg} requires a value`);
      if (arg === '--index') indexPath = value;
      if (arg === '--spec-folder') specFolder = value;
      if (arg === '--limit') {
        limit = Number.parseInt(value, 10);
        if (!Number.isFinite(limit) || limit < 0) throw new Error('--limit requires a non-negative integer');
      }
      i += 1;
      continue;
    }
    if (arg.startsWith('--')) throw new Error(`unknown argument: ${arg}`);
    prompts.push(arg);
  }

  if (prompts.length === 0) throw new Error('a prompt is required');
  return { hashIndex, indexPath, json, limit, prompt: prompts.join(' '), specFolder };
}

/**
 * @param {ReturnType<typeof lookup>} answer Lookup answer.
 * @returns {string} Human-readable summary.
 */
function formatAnswer(answer) {
  const lines = [
    `query      : ${answer.normalizedQuery}`,
    `tokens     : ${answer.tokens.join(' ') || '(none)'}`,
    `discarded  : ${answer.discardedTokens.map((d) => `${d.token} (${d.reason})`).join(', ') || '(none)'}`,
    `scope      : ${answer.specFolder ?? '(unscoped)'}`,
    `index      : ${answer.indexHash ?? '(hash skipped)'}`,
    `manifest   : ${answer.manifestHash || '(none)'}`,
    `candidates : ${answer.results.length}${answer.truncated ? ' (truncated)' : ''} from ${answer.candidatePhraseCount} phrase(s)`,
  ];
  for (const result of answer.results) {
    lines.push(`  ${result.score.toFixed(3)}  ${result.matchClass.padEnd(18)} ${result.path}`);
  }
  return `${lines.join('\n')}\n`;
}

/**
 * @returns {number} Process exit code.
 */
function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  let loaded;
  try {
    loaded = loadIndex(args.indexPath, { hashIndex: args.hashIndex });
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const answer = lookup(loaded, args.prompt, { limit: args.limit, specFolder: args.specFolder });
  process.stdout.write(args.json ? `${JSON.stringify(answer, null, 2)}\n` : formatAnswer(answer));
  return answer.results.length > 0 ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
