#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Track Narrowing Measurement
// ───────────────────────────────────────────────────────────────────
// Measures offline whether one classifier choice that picks a spec track
// beats the ripgrep recipe and the trigger-index lookup at naming the right
// track. The default run makes no model call and writes no file. The script
// holds and reads no credential.
//
// Usage:
//   node score-track-narrowing.mjs [--jev] [--out <dir>] [--replay <calls.jsonl>]
//
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, --jev without --out, or --out that already
// holds a run, refused before any output or call.
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnClassifierCall } from '../../../../cli-classifier/shared/scripts/jev-transport.mjs';
import {
  beatsStrongestPolicy, binomialTailHalf, bootstrapLine, classFloor, classFloorLines,
  clusterBootstrapInterval as clusterBootstrapItems, decidedSubsetLine, marginSlack,
  marginSlackLine, outDirectoryHoldsRun, pinRowSet as pinRows, powerLine,
  probabilityAwarePick, strongestPolicyLine,
} from '../../../../cli-classifier/shared/scripts/scorer-report.mjs';

import { DEFAULT_REPO_ROOT } from './generate-trigger-index.mjs';
import { compareCodeUnits, normalizeTriggerText } from './lib/normalize.mjs';
import { pathOnlyRecipe, runRecipe } from './lib/rg-lane.mjs';
import { DEFAULT_INDEX_PATH, loadIndex, lookup } from './lookup-trigger-index.mjs';
import { isMainModule } from '../lib/esm-entry.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Paraphrase probe fixture beside this script. */
export const DEFAULT_PROBES_PATH = path.join(SCRIPT_DIR, 'fixtures', 'semantic-probes.json');

/** Rows kept from one track after the hash order is applied. */
export const MAX_ROWS_PER_TRACK = 20;

/** Normalized tokens a description needs before it can be a question. */
export const MIN_QUESTION_TOKENS = 5;

/** Largest track list this measurement will score. */
export const MAX_TRACKS = 25;

/** Directory names left out of the track list and of the packet walk. */
export const SKIPPED_TREES = Object.freeze(['z_archive', 'scratch', 'research', 'context']);

// These fix the call shape and the keep rule before any model call, so a change
// is an amendment, not a tuning.
export const CHOICE_INSTRUCTION = 'Which spec track is this text about?';
export const NONE_KEY = 'none';
export const NONE_DESCRIPTION = 'None of these tracks';
export const ORDERS = 3;
export const SHORTLIST_SIZE = 5;
export const MARGIN_LINE = 'margin: 0.10';
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, '
  + 'margin 10*(A-B) >= M, sign test p < 0.05, strongest policy A > S, class floor A_c >= B_c, '
  + 'flips 10*F <= 3*M';

// ───────────────────────────────────────────────────────────────────
// 2. TEST SET
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} name Directory name.
 * @returns {boolean} True when the walk and the track list must ignore it.
 */
function isSkippedName(name) {
  return name.startsWith('.') || SKIPPED_TREES.includes(name);
}

/**
 * @param {string} dirPath Directory to list.
 * @returns {string[]} Immediate child directory names, symlink entries excluded.
 */
function immediateDirectoryNames(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * @param {string} filePath description.json path.
 * @param {string} name Track directory name, used in the error.
 * @returns {string} Description text, unchanged.
 */
function readTrackDescription(filePath, name) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    throw new Error(`track ${name} has no description`);
  }
  const description = parsed && typeof parsed === 'object' ? parsed.description : undefined;
  if (typeof description !== 'string' || description.trim() === '') {
    throw new Error(`track ${name} has no description`);
  }
  return description;
}

/**
 * @param {string} dirPath Candidate directory.
 * @returns {boolean} True when description.json is a regular file.
 */
function holdsDescriptionFile(dirPath) {
  try {
    return fs.statSync(path.join(dirPath, 'description.json')).isFile();
  } catch {
    return false;
  }
}

/**
 * Parsed description, or null when the file does not parse.
 *
 * @param {string} filePath description.json path.
 * @returns {unknown} The description value, or null.
 */
function readCandidateDescription(filePath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  if (!Object.prototype.hasOwnProperty.call(parsed, 'description')) return null;
  return parsed.description;
}

/**
 * @param {string} folder Repo-relative folder path.
 * @returns {string} Lowercase hex SHA-256 of that path.
 */
function folderDigest(folder) {
  return createHash('sha256').update(folder).digest('hex');
}

/**
 * @param {string} text Raw or already normalized text.
 * @returns {string[]} Normalized tokens, empty pieces dropped.
 */
function questionTokens(text) {
  return normalizeTriggerText(text).split(' ').filter((token) => token !== '');
}

/**
 * Depth-first. Child directories are visited in code-unit order. The track
 * directory itself is not a candidate; its description labels the track.
 *
 * @param {string} absDir Absolute directory.
 * @param {string} relPosix Repo-relative path with forward slashes.
 * @param {boolean} isTrackRoot True only for the track directory.
 * @param {Array<{ basename: string, description: unknown, folder: string }>} candidates
 */
function collectCandidates(absDir, relPosix, isTrackRoot, candidates) {
  if (!isTrackRoot && holdsDescriptionFile(absDir)) {
    candidates.push({
      basename: path.posix.basename(relPosix),
      description: readCandidateDescription(path.join(absDir, 'description.json')),
      folder: relPosix,
    });
  }
  const children = immediateDirectoryNames(absDir)
    .filter((name) => !isSkippedName(name))
    .sort(compareCodeUnits);
  for (const name of children) {
    collectCandidates(path.join(absDir, name), `${relPosix}/${name}`, false, candidates);
  }
}

/**
 * Immediate spec tracks whose description is a non-empty string.
 *
 * @param {string} repoRoot Repository root.
 * @returns {Array<{ track: string, description: string }>} Track order is code-unit order.
 * @throws {Error} When a track has no description, or the list is over the cap.
 */
export function listTracks(repoRoot) {
  const names = immediateDirectoryNames(path.join(repoRoot, 'specs'))
    .filter((name) => !isSkippedName(name))
    .sort(compareCodeUnits);
  const tracks = names.map((name) => ({
    track: name,
    description: readTrackDescription(
      path.join(repoRoot, 'specs', name, 'description.json'),
      name,
    ),
  }));
  if (tracks.length > MAX_TRACKS) {
    throw new Error(`${tracks.length} tracks exceed the ${MAX_TRACKS}-track option cap`);
  }
  return tracks;
}

/**
 * Skill directories that contain a skill file. Missing root yields an empty list.
 *
 * @param {string} repoRoot Repository root.
 * @returns {string[]} Hub names in code-unit order.
 */
export function listHubNames(repoRoot) {
  const skillsDir = path.join(repoRoot, '.skilled', 'skills');
  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      try {
        return fs.statSync(path.join(skillsDir, entry.name, 'SKILL.md')).isFile();
      } catch {
        return false;
      }
    })
    .map((entry) => entry.name)
    .sort(compareCodeUnits);
}

/**
 * Normalized forms of hyphenated names. A name with no hyphen contributes nothing.
 *
 * @param {string[]} trackNames Track directory names.
 * @param {string[]} hubNames Skill directory names.
 * @returns {string[]} Unique phrases in code-unit order.
 */
export function leakPhrases(trackNames, hubNames) {
  const phrases = new Set();
  for (const name of [...trackNames, ...hubNames]) {
    if (typeof name !== 'string' || !name.includes('-')) continue;
    const phrase = normalizeTriggerText(name);
    if (phrase !== '') phrases.add(phrase);
  }
  return [...phrases].sort(compareCodeUnits);
}

/**
 * Placeholder first, then a phrase hit, otherwise kept.
 *
 * @param {unknown} description Description value from a candidate file.
 * @param {string} folderName Candidate directory name.
 * @param {string[]} phrases Phrases from leakPhrases.
 * @returns {'placeholder' | 'leak' | 'kept'}
 */
export function classifyDescription(description, folderName, phrases) {
  if (typeof description !== 'string') return 'placeholder';
  const trimmed = description.trim();
  if (trimmed === '') return 'placeholder';
  if (trimmed.startsWith('[')) return 'placeholder';
  if (/^Phase \d+:/.test(trimmed)) return 'placeholder';

  const normalized = normalizeTriggerText(description);
  const folderNormalized = normalizeTriggerText(folderName);
  const stripped = normalizeTriggerText(String(folderName).replace(/^\d+-/, ''));
  if (normalized === folderNormalized || normalized === stripped) return 'placeholder';
  if (questionTokens(description).length < MIN_QUESTION_TOKENS) return 'placeholder';

  const padded = ` ${normalized} `;
  for (const phrase of phrases) {
    if (padded.includes(` ${phrase} `)) return 'leak';
  }
  return 'kept';
}

/**
 * @typedef {Object} TrackCounts
 * @property {number} kept Rows after the per-track cap.
 * @property {number} usable Kept candidates before the cap.
 * @property {number} placeholder Descriptions rejected as unusable text.
 * @property {number} leak Descriptions that name a track or a hub.
 * @property {number} residual Kept rows whose tokens include the track's last hyphen segment.
 */

/**
 * Candidates that survive classification, capped per track in hash order.
 *
 * @param {string} repoRoot Repository root.
 * @param {{ hubNames?: string[], replayRowIds?: Set<string> }} [options]
 * @returns {{
 *   tracks: Array<{ track: string, description: string }>,
 *   rows: Array<{ id: string, folder: string, track: string, question: string }>,
 *   counts: Record<string, {
 *     kept: number,
 *     usable: number,
 *     placeholder: number,
 *     leak: number,
 *     residual: number
 *   }>
 * }}
 */
export function buildTestSet(repoRoot, options = {}) {
  const hubNames = options.hubNames ?? listHubNames(repoRoot);
  const replayRowIds = options.replayRowIds;
  const tracks = listTracks(repoRoot);
  const phrases = leakPhrases(tracks.map((entry) => entry.track), hubNames);
  const rows = [];
  /** @type {Record<string, TrackCounts>} */
  const counts = {};

  for (const entry of tracks) {
    /** @type {Array<{ basename: string, description: unknown, folder: string }>} */
    const candidates = [];
    collectCandidates(
      path.join(repoRoot, 'specs', entry.track),
      `specs/${entry.track}`,
      true,
      candidates,
    );

    let placeholder = 0;
    let leak = 0;
    const kept = [];
    for (const candidate of candidates) {
      const kind = classifyDescription(candidate.description, candidate.basename, phrases);
      if (kind === 'placeholder') {
        placeholder += 1;
      } else if (kind === 'leak') {
        leak += 1;
      } else if (typeof candidate.description === 'string') {
        kept.push({ description: candidate.description, folder: candidate.folder });
      }
    }

    kept.sort((left, right) => compareCodeUnits(
      folderDigest(left.folder),
      folderDigest(right.folder),
    ));
    // Replays must reach recorded candidates even when new rows push them past the live cap.
    const selected = replayRowIds
      ? kept.filter((candidate) => replayRowIds.has(candidate.folder))
      : kept.slice(0, MAX_ROWS_PER_TRACK);
    const segment = normalizeTriggerText(entry.track.split('-').at(-1) ?? '');
    let residual = 0;
    for (const candidate of selected) {
      const question = candidate.description.trim();
      if (segment !== '' && questionTokens(question).includes(segment)) residual += 1;
      rows.push({
        id: candidate.folder,
        folder: candidate.folder,
        track: entry.track,
        question,
      });
    }

    counts[entry.track] = {
      kept: selected.length,
      usable: kept.length,
      placeholder,
      leak,
      residual,
    };
  }

  return { tracks, rows, counts };
}

/**
 * One summary line, then one line per track in track order.
 *
 * @param {{
 *   tracks: Array<{ track: string }>,
 *   counts: Record<string, {
 *     kept: number,
 *     usable: number,
 *     placeholder: number,
 *     leak: number,
 *     residual: number
 *   }>
 * }} testSet
 * @returns {string[]}
 */
export function testSetLines(testSet) {
  const sum = {
    kept: 0,
    usable: 0,
    placeholder: 0,
    leak: 0,
    residual: 0,
  };
  for (const entry of testSet.tracks) {
    const count = testSet.counts[entry.track];
    sum.kept += count.kept;
    sum.usable += count.usable;
    sum.placeholder += count.placeholder;
    sum.leak += count.leak;
    sum.residual += count.residual;
  }

  const lines = [
    [
      `tracks=${testSet.tracks.length}`,
      `kept=${sum.kept}`,
      `usable=${sum.usable}`,
      `placeholder=${sum.placeholder}`,
      `leak=${sum.leak}`,
      `residual=${sum.residual}`,
    ].join(' '),
  ];
  lines[0] = `test set: ${lines[0]}`;

  for (const entry of testSet.tracks) {
    const count = testSet.counts[entry.track];
    lines.push([
      `track: ${entry.track}`,
      `kept=${count.kept}`,
      `usable=${count.usable}`,
      `placeholder=${count.placeholder}`,
      `leak=${count.leak}`,
      `residual=${count.residual}`,
    ].join(' '));
  }
  return lines;
}

// ───────────────────────────────────────────────────────────────────
// 3. BASELINES
// ───────────────────────────────────────────────────────────────────

/**
 * Second slash-separated segment of a spec document path.
 *
 * @param {string} repoPath Repo-relative path.
 * @returns {string | null} Track name when the path is `specs/<track>/...`, otherwise null.
 */
export function trackOf(repoPath) {
  if (!repoPath.startsWith('specs/')) return null;
  const segments = repoPath.split('/');
  if (segments.length < 3) return null;
  return segments[1];
}

/**
 * @param {string} repoPath Repo-relative path.
 * @param {string} folder Repo-relative folder.
 * @returns {boolean} True when the path is the folder or lies inside it.
 */
export function isInsideFolder(repoPath, folder) {
  return repoPath === folder || repoPath.startsWith(`${folder}/`);
}

/**
 * Track of the first scoring row outside the question's own folder.
 * Results stay in the lookup's own order. A row with no score, no track, or
 * a path inside that folder is skipped; the folder test is skipped when the
 * folder is null. When none remains, the pick abstains. The lookup and its
 * index are read only.
 *
 * @param {object} loaded Loaded trigger index.
 * @param {string} question Raw question text.
 * @param {string | null} ownFolder Folder whose rows are skipped, or null.
 * @returns {string | null} Track name, or null when the lookup abstains.
 */
export function lookupPick(loaded, question, ownFolder) {
  const answer = lookup(loaded, question, { limit: 0 });
  for (const result of answer.results) {
    if (!(result.score > 0)) continue;
    const track = trackOf(result.path);
    if (track === null) continue;
    if (ownFolder !== null && isInsideFolder(result.path, ownFolder)) continue;
    return track;
  }
  return null;
}

/**
 * Distinct normalized tokens at least three characters long, first time each
 * token appears.
 *
 * @param {string} question Raw question text.
 * @returns {string[]} Tokens in first-seen order.
 */
export function ripgrepTokens(question) {
  const tokens = [];
  const seen = new Set();
  for (const token of normalizeTriggerText(question).split(' ')) {
    if (token.length < 3 || seen.has(token)) continue;
    seen.add(token);
    tokens.push(token);
  }
  return tokens;
}

/**
 * One repo-relative path from a path-only ripgrep line.
 *
 * @param {string} line Raw stdout line.
 * @returns {string} Trimmed path with slashes normalized, or empty when blank.
 */
function ripgrepPath(line) {
  const trimmed = line.trim();
  if (trimmed === '') return '';
  return trimmed.replace(/\\/g, '/').replace(/^\.\//, '');
}

/**
 * Track whose files cover the most question tokens. Each token is searched
 * once and kept on the context cache. A file with no track, or one inside
 * the question's own folder, does not score; the folder test is skipped when
 * the folder is null. Files at the top score are counted per track. The track
 * with the most of those files wins, and a tie on that count takes the first
 * track name in code-unit order. When no file scores, the pick abstains.
 *
 * @param {string} question Raw question text.
 * @param {string | null} ownFolder Folder whose files are skipped, or null.
 * @param {{ repoRoot: string, cache: Map<string, string[]> }} context
 * @returns {string | null} Track name, or null when the search abstains.
 * @throws {Error} When ripgrep fails for a token.
 */
export function ripgrepPick(question, ownFolder, context) {
  const tokens = ripgrepTokens(question);
  for (const token of tokens) {
    if (context.cache.has(token)) continue;
    const run = runRecipe(pathOnlyRecipe(token, ['specs']), { cwd: context.repoRoot });
    if (run.outcome === 'error') {
      throw new Error(`ripgrep failed on ${token}: ${run.stderr.trim()}`);
    }
    if (run.outcome === 'no-match') {
      context.cache.set(token, []);
      continue;
    }
    const paths = [];
    for (const line of run.stdout.split('\n')) {
      const repoPath = ripgrepPath(line);
      if (repoPath === '') continue;
      paths.push(repoPath);
    }
    context.cache.set(token, paths);
  }

  /** @type {Map<string, number>} */
  const scores = new Map();
  for (const token of tokens) {
    const held = new Set(context.cache.get(token) ?? []);
    for (const file of held) {
      if (trackOf(file) === null) continue;
      if (ownFolder !== null && isInsideFolder(file, ownFolder)) continue;
      scores.set(file, (scores.get(file) ?? 0) + 1);
    }
  }
  if (scores.size === 0) return null;

  let topScore = 0;
  for (const score of scores.values()) {
    if (score > topScore) topScore = score;
  }

  /** @type {Map<string, number>} */
  const trackCounts = new Map();
  for (const [file, score] of scores) {
    if (score !== topScore) continue;
    const track = trackOf(file);
    if (track === null) continue;
    trackCounts.set(track, (trackCounts.get(track) ?? 0) + 1);
  }

  let winner = null;
  let winnerCount = 0;
  for (const [track, count] of trackCounts) {
    if (
      winner === null
      || count > winnerCount
      || (count === winnerCount && compareCodeUnits(track, winner) < 0)
    ) {
      winner = track;
      winnerCount = count;
    }
  }
  return winner;
}

// ───────────────────────────────────────────────────────────────────
// 4. OPTIONS AND SUMMARY
// ───────────────────────────────────────────────────────────────────

/**
 * Option pairs in the given track order, with none last, and the hash of
 * that list. A changed description changes the hash before any call.
 *
 * @param {Array<{ track: string, description: string }>} tracks
 * @returns {{ pairs: Array<[string, string]>, keys: string[], sha256: string }}
 */
export function buildOptions(tracks) {
  /** @type {Array<[string, string]>} */
  const pairs = tracks.map((entry) => [entry.track, entry.description]);
  pairs.push([NONE_KEY, NONE_DESCRIPTION]);
  const keys = pairs.map((pair) => pair[0]);
  const sha256 = createHash('sha256').update(JSON.stringify(pairs)).digest('hex');
  return { pairs, keys, sha256 };
}

/**
 * Left rotation of the option pairs. Order 0 leaves the list as given.
 *
 * @param {Array<[string, string]>} pairs
 * @param {number} order Places to rotate left.
 * @returns {Array<[string, string]>}
 */
export function rotateOptions(pairs, order) {
  return [...pairs.slice(order), ...pairs.slice(0, order)];
}

/**
 * Right-answer counts for both baselines on the same rows. The lookup wins
 * a tie. Headroom stays open until the winner is strictly above nine tenths.
 *
 * @param {Array<{ track: string }>} rows
 * @param {Array<{ lookup: string | null, ripgrep: string | null }>} picks
 * @returns {{
 *   K: number,
 *   lookupRight: number,
 *   ripgrepRight: number,
 *   method: 'lookup' | 'ripgrep',
 *   right: number,
 *   headroom: boolean
 * }}
 */
export function summarizeBaselines(rows, picks) {
  const K = rows.length;
  let lookupRight = 0;
  let ripgrepRight = 0;
  for (let index = 0; index < K; index += 1) {
    if (picks[index].lookup === rows[index].track) lookupRight += 1;
    if (picks[index].ripgrep === rows[index].track) ripgrepRight += 1;
  }
  const method = ripgrepRight > lookupRight ? 'ripgrep' : 'lookup';
  const right = method === 'ripgrep' ? ripgrepRight : lookupRight;
  const headroom = !(10 * right > 9 * K);
  return { K, lookupRight, ripgrepRight, method, right, headroom };
}

/**
 * Lookup rate, ripgrep rate, and the method that won. Each rate is four
 * digits. Zero rows print 0.0000.
 *
 * @param {{
 *   K: number,
 *   lookupRight: number,
 *   ripgrepRight: number,
 *   method: string,
 *   right: number
 * }} summary
 * @returns {string[]}
 */
export function baselineLines(summary) {
  const { K, lookupRight, ripgrepRight, method, right } = summary;
  const lookupRate = K === 0 ? '0.0000' : (lookupRight / K).toFixed(4);
  const ripgrepRate = K === 0 ? '0.0000' : (ripgrepRight / K).toFixed(4);
  return [
    `baseline lookup: ${lookupRight}/${K} right (${lookupRate})`,
    `baseline ripgrep: ${ripgrepRight}/${K} right (${ripgrepRate})`,
    `baseline method: ${method} ${right}/${K} right`,
  ];
}

/**
 * Margin, keep rule, instruction, option hash and the three orders.
 *
 * @param {{ pairs: Array<[string, string]>, sha256: string }} options
 * @returns {string[]}
 */
export function ruleLines(options) {
  return [
    MARGIN_LINE,
    KEEP_RULE_LINE,
    `instruction: -q "${CHOICE_INSTRUCTION}"`,
    `options: ${options.pairs.length} sha256=${options.sha256} none="${NONE_DESCRIPTION}"`,
    `orders: ${ORDERS}, name order with none last, then rotated left by 1 and by 2`,
  ];
}

/**
 * One line when the baseline is already above nine tenths. Otherwise the
 * gain that still fits, and how many calls that measurement would make.
 *
 * @param {{ headroom: boolean, right: number, K: number }} summary
 * @param {number} probeCount Probes scored beside the rows, in each order.
 * @returns {string[]}
 */
export function headroomLines(summary, probeCount) {
  const { headroom, right, K } = summary;
  if (!headroom) {
    return [
      `no headroom: the baseline method is right on ${right}/${K}, above 0.90`,
    ];
  }
  const calls = ORDERS * (K + probeCount);
  return [
    `headroom: a 10-point gain fits above ${right}/${K}`,
    `planned calls: ${calls} per arm, ${K} rows and ${probeCount} probes in ${ORDERS} orders each`,
  ];
}

// ───────────────────────────────────────────────────────────────────
// 5. PARAPHRASE PROBES
// ───────────────────────────────────────────────────────────────────

// Probes are reported for every method and never decide a verdict. Their gold
// comes from the exact query's scoring spec rows on the current index because
// the fixture's captured paths predate it.

/**
 * Latin paraphrase rows in file order, each paired with its exact query.
 *
 * @param {string} probesPath Probe fixture path.
 * @returns {Array<{
 *   id: string,
 *   caseId: string,
 *   question: string,
 *   exactQuery: string | null
 * }>}
 * @throws {Error} When the file has no paraphrase row array.
 */
export function loadProbes(probesPath) {
  const parsed = JSON.parse(fs.readFileSync(probesPath, 'utf8'));
  const rows = parsed && parsed.paraphrase ? parsed.paraphrase.rows : undefined;
  if (!Array.isArray(rows)) {
    throw new Error(`${probesPath} has no paraphrase rows`);
  }

  /** @type {Map<string, string>} */
  const exactByCase = new Map();
  for (const row of rows) {
    if (row.locale !== 'latin' || row.variant !== 'exact') continue;
    if (!exactByCase.has(row.caseId)) exactByCase.set(row.caseId, row.query);
  }

  const probes = [];
  for (const row of rows) {
    if (row.locale !== 'latin' || row.variant !== 'paraphrase') continue;
    probes.push({
      id: `probe:${row.caseId}`,
      caseId: row.caseId,
      question: row.query,
      exactQuery: exactByCase.has(row.caseId) ? exactByCase.get(row.caseId) : null,
    });
  }
  return probes;
}

/**
 * Distinct scoring tracks of each probe's exact query on this index. A probe
 * with no exact query gets an empty gold list.
 *
 * @param {object} loaded Loaded trigger index.
 * @param {Array<{ exactQuery: string | null }>} probes
 * @returns {Array<{ exactQuery: string | null, gold: string[] }>}
 */
export function probeGold(loaded, probes) {
  return probes.map((probe) => {
    if (probe.exactQuery === null) return { ...probe, gold: [] };
    /** @type {Set<string>} */
    const tracks = new Set();
    const answer = lookup(loaded, probe.exactQuery, { limit: 0 });
    for (const result of answer.results) {
      if (!(result.score > 0)) continue;
      const track = trackOf(result.path);
      if (track === null) continue;
      tracks.add(track);
    }
    return { ...probe, gold: [...tracks].sort(compareCodeUnits) };
  });
}

/**
 * Probes with a non-empty gold list whose pick is one of those tracks.
 *
 * @param {Array<{ id: string, gold: string[] }>} probes
 * @param {Map<string, string | null>} picks Probe id to a track, or null.
 * @returns {number}
 */
export function probeHits(probes, picks) {
  let hits = 0;
  for (const probe of probes) {
    if (probe.gold.length === 0) continue;
    if (probe.gold.includes(picks.get(probe.id))) hits += 1;
  }
  return hits;
}

/**
 * One report line. Gold-less probes stay in the total and leave the
 * denominator. Method pairs print in the given order.
 *
 * @param {Array<{ gold: string[] }>} probes
 * @param {Array<[string, number]>} methods Name and hit count, in print order.
 * @returns {string}
 */
export function probeLine(probes, methods) {
  const total = probes.length;
  let goldLess = 0;
  for (const probe of probes) {
    if (probe.gold.length === 0) goldLess += 1;
  }
  const P = total - goldLess;
  let line = `paraphrase probes: total=${total} gold-less=${goldLess}`;
  for (const [name, hits] of methods) {
    line += ` ${name}=${hits}/${P}`;
  }
  return line;
}

// ───────────────────────────────────────────────────────────────────
// 6. VERDICT
// ───────────────────────────────────────────────────────────────────

// The keep rule is fixed before any model call, so a change is an amendment,
// not a tuning. Counts stay integers and the sign test's p is exact (a BigInt
// tail sum over 2^n), so no rounding decides a verdict.

/**
 * One-sided sign test on backend-only wins against baseline-only losses.
 * The tail sum is built coefficient by coefficient in BigInt, and the
 * threshold test is exact: 20 * num < 2^n is p < 0.05 with no float
 * comparison. No disagreements give p 1.
 *
 * @param {number} wins Rows only the backend got right.
 * @param {number} losses Rows only the baseline got right.
 * @returns {{ p: number, below: boolean }}
 */
export function signTestP(wins, losses) {
  const n = wins + losses;
  if (n === 0) return { p: 1, below: false };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= wins) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { p: Number(num) / Number(den), below: 20n * num < den };
}

/**
 * The answer named at least twice, with its count. Three different answers
 * name no winner and keep the top count at 1, the unstable case.
 *
 * @param {string[]} answers Submitted keys in call order.
 * @returns {{ pick: string | null, top: number }}
 */
export function modalPick(answers) {
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const key of answers) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let pick = null;
  let top = 0;
  for (const [key, count] of counts) {
    if (count > top) {
      pick = key;
      top = count;
    }
  }
  if (top < 2) return { pick: null, top: 1 };
  return { pick, top };
}

/**
 * First failed condition decides, in this order: coverage, kill, margin, sign
 * test, strongest policy, class floor, flips. A strongest or floor result
 * that is absent skips its gate. Every outcome carries p, the sign test's
 * exact tail.
 *
 * @param {{
 *   K: number,
 *   M: number,
 *   A: number,
 *   B: number,
 *   W: number,
 *   L: number,
 *   F: number,
 *   strongest?: { pass: boolean, name: string | null, right: number } | null,
 *   floor?: { pass: boolean, classes: Array<object>, failing: string[] } | null
 * }} counts
 * @returns {{
 *   outcome: 'keep' | 'kill' | 'stop',
 *   reason: 'coverage' | 'margin' | 'sign test' | 'strongest policy' | 'class floor' | 'flips' | null,
 *   p: number
 * }}
 */
export function decideVerdict({ K, M, A, B, W, L, F, strongest = null, floor = null }) {
  const sign = signTestP(W, L);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
  const kill = binomialTailHalf(W + L, L);
  if (W + L > 0 && 20n * kill.num <= kill.den) return { outcome: 'kill', reason: null, p: sign.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
  if (!sign.below) return { outcome: 'stop', reason: 'sign test', p: sign.p };
  if (strongest !== null && !strongest.pass) {
    return { outcome: 'stop', reason: 'strongest policy', p: sign.p };
  }
  if (floor !== null && !floor.pass) return { outcome: 'stop', reason: 'class floor', p: sign.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
  return { outcome: 'keep', reason: null, p: sign.p };
}

/**
 * One verdict line: the outcome, the counts and the exact p, with the
 * caller's suffix appended when it has one.
 *
 * @param {string} backend Column name, printed on the line.
 * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts
 * @param {{ outcome: 'keep' | 'kill' | 'stop', reason: string | null, p: number }} verdict
 * @param {string} [suffix] Appended to the line when non-empty.
 * @returns {string} The verdict line.
 */
function verdictLine(backend, counts, verdict, suffix) {
  const label = verdict.outcome === 'stop' ? `stop (${verdict.reason})` : verdict.outcome;
  let line = `verdict ${backend}: ${label}`
    + ` K=${counts.K} M=${counts.M} A=${counts.A} B=${counts.B}`
    + ` W=${counts.W} L=${counts.L} F=${counts.F} p=${formatP(verdict.p)}`;
  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
  return line;
}

/**
 * @param {number} p Probability in [0, 1].
 * @returns {string} Four significant digits.
 */
export function formatP(p) {
  return p.toPrecision(4);
}

/**
 * One column's counts and verdict. A row is measured only when its record
 * holds exactly one answer per order and every answer is a string; every
 * other row stays unmeasured. An unstable or abstained pick is wrong for
 * the backend, and the votes a pick lacks add to the flip count. The simple
 * policies the strongest-policy gate compares against are counted on those
 * same measured rows with the row's own track as gold, so an unmeasured row
 * cannot raise the bar.
 *
 * @param {string} backend Backend name, printed on both lines.
 * @param {Array<{ id: string, track: string }>} rows Kept rows.
 * @param {Map<string, Array<string | null>>} records Row id to submitted keys in call order.
 * @param {Map<string, string | null>} baselinePicks Row id to the baseline pick.
 * @param {string} [suffix] Appended to the verdict line when non-empty.
 * @param {Map<string, { lookup: string | null, ripgrep: string | null }>} [rowPicks] Row id to that row's lookup and ripgrep picks; omitted skips the strongest-policy gate.
 * @returns {{
 *   backend: string,
 *   K: number,
 *   M: number,
 *   unmeasured: number,
 *   unstable: number,
 *   abstained: number,
 *   A: number,
 *   B: number,
 *   W: number,
 *   L: number,
 *   F: number,
 *   p: number,
 *   flipRate: number,
 *   outcome: 'keep' | 'kill' | 'stop',
 *   reason: 'coverage' | 'margin' | 'sign test' | 'strongest policy' | 'class floor' | 'flips' | null,
 *   strongest: { pass: boolean, name: string | null, right: number } | undefined,
 *   floor: { pass: boolean, classes: Array<{ cls: string, n: number, jev: number, baseline: number }>, failing: string[] },
 *   line: string
 * }}
 */
export function summarizeColumn(backend, rows, records, baselinePicks, suffix, rowPicks) {
  const K = rows.length;
  let M = 0;
  let unstable = 0;
  let abstained = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let lookupRight = 0;
  let ripgrepRight = 0;
  /** @type {Map<string, number>} */
  const goldCounts = new Map();
  /** @type {Array<{ cls: string, jevRight: boolean, baselineRight: boolean }>} */
  const classRows = [];
  for (const row of rows) {
    const answers = records.get(row.id);
    if (!Array.isArray(answers) || answers.length !== ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    M += 1;
    const { pick, top } = modalPick(answers);
    F += ORDERS - top;
    if (pick === null) unstable += 1;
    if (pick === NONE_KEY) abstained += 1;
    const backendRight = pick === row.track;
    const baselineRight = baselinePicks.get(row.id) === row.track;
    if (backendRight) A += 1;
    if (baselineRight) B += 1;
    if (backendRight && !baselineRight) W += 1;
    if (baselineRight && !backendRight) L += 1;
    const picks = rowPicks?.get(row.id);
    if (picks?.lookup === row.track) lookupRight += 1;
    if (picks?.ripgrep === row.track) ripgrepRight += 1;
    goldCounts.set(row.track, (goldCounts.get(row.track) ?? 0) + 1);
    classRows.push({ cls: row.track, jevRight: backendRight, baselineRight });
  }

  let majority = 0;
  for (const count of goldCounts.values()) {
    if (count > majority) majority = count;
  }
  const policies = {
    lookup: lookupRight,
    ripgrep: ripgrepRight,
    'always-none': goldCounts.get(NONE_KEY) ?? 0,
    majority,
  };
  const strongest = typeof rowPicks === 'undefined' ? undefined : beatsStrongestPolicy(A, policies);
  const floor = classFloor(classRows);
  const verdict = decideVerdict({ K, M, A, B, W, L, F, strongest, floor });
  const line = verdictLine(backend, { K, M, A, B, W, L, F }, verdict, suffix);

  return {
    backend,
    K,
    M,
    unmeasured: K - M,
    unstable,
    abstained,
    A,
    B,
    W,
    L,
    F,
    p: verdict.p,
    flipRate: M === 0 ? 0 : F / (ORDERS * M),
    outcome: verdict.outcome,
    reason: verdict.reason,
    strongest,
    floor,
    line,
  };
}

/**
 * Nearest-rank percentile. Empty lists have no rank.
 *
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number | null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

/**
 * One column line with both latency quantiles, each printed as `none`
 * when absent.
 *
 * @param {{
 *   backend: string,
 *   K: number,
 *   M: number,
 *   unmeasured: number,
 *   unstable: number,
 *   abstained: number,
 *   flipRate: number
 * }} summary
 * @param {{ p50: number | null, p95: number | null }} latency
 * @returns {string}
 */
export function columnLine(summary, latency) {
  const { backend, K, M, unmeasured, unstable, abstained, flipRate } = summary;
  return `column ${backend}: rows=${K} measured=${M} unmeasured=${unmeasured}`
    + ` unstable=${unstable} abstained=${abstained} flip_rate=${flipRate.toFixed(4)}`
    + ` latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`;
}

/**
 * A stable pin for the exact questions and option set scored by a run.
 *
 * @param {{ rows: Array<{ id: string, track: string, question: string }> }} testSet
 * @param {{ sha256: string }} options
 * @returns {{ rowSetSha256: string, rowCount: number, optionSetSha256: string, rows: Array<{ id: string, track: string, questionSha256: string }> }}
 */
export function pinRowSet(testSet, options) {
  const rows = testSet.rows.map((row) => ({
    id: row.id,
    track: row.track,
    questionSha256: createHash('sha256').update(row.question).digest('hex'),
  }));
  return pinRows(rows, { optionSetSha256: options.sha256 });
}

export { outDirectoryHoldsRun };

/**
 * Read recorded calls without invoking the Jev executable.
 *
 * @param {string} filePath JSON-lines call log.
 * @returns {Array<Record<string, unknown>>} Parsed calls.
 * @throws {Error} When the file is unreadable or a line is not valid JSON.
 */
export function readCallRecords(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter((line) => line.trim() !== '');
  return lines.map((line, index) => {
    try {
      const value = JSON.parse(line);
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('record must be an object');
      }
      return value;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`invalid call record on line ${index + 1}: ${message}`);
    }
  });
}

/**
 * Use the saved question pins to keep replay membership tied to the measured run.
 * Call logs from older runs can still identify their rows when no pin is available.
 *
 * @param {string} filePath JSON-lines call log.
 * @param {Array<Record<string, unknown>>} records Parsed call records.
 * @returns {Array<{ id: string, track?: string, questionSha256?: string }>} Recorded row pins.
 */
function readReplayRowPins(filePath, records) {
  const reportPath = path.join(path.dirname(filePath), 'report.json');
  let rows;
  let reportRowCount;
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    if (report && typeof report === 'object' && Object.hasOwn(report, 'dataPin')) {
      rows = report.dataPin?.rows;
      if (!Array.isArray(rows)) throw new Error('sibling report.json has an invalid row pin');
    } else if (Number.isInteger(report?.testSet?.K)) {
      reportRowCount = report.testSet.K;
    }
  }

  if (!rows) {
    const ids = new Set();
    for (const record of records) {
      if (
        record.backend === 'jev'
        && record.kind === 'test'
        && typeof record.rowId === 'string'
      ) ids.add(record.rowId);
    }
    rows = [...ids].map((id) => ({ id }));
  }

  const seenIds = new Set();
  for (const pin of rows) {
    if (!pin || typeof pin !== 'object' || typeof pin.id !== 'string') {
      throw new Error('recorded row pin has no row id');
    }
    if (seenIds.has(pin.id)) throw new Error(`duplicate recorded row pin: ${pin.id}`);
    seenIds.add(pin.id);
  }
  if (reportRowCount !== undefined && rows.length !== reportRowCount) {
    throw new Error(`sibling report records ${reportRowCount} rows but the call log identifies ${rows.length}`);
  }
  return rows;
}

/**
 * Match recorded pins against current baseline rows before scoring them.
 *
 * @param {ReturnType<typeof buildTestSet>} testSet Current candidate rows.
 * @param {Array<{ id: string, track?: string, questionSha256?: string }>} rowPins Recorded row pins.
 * @returns {{ testSet: ReturnType<typeof buildTestSet>, droppedRows: Array<{ id: string, reason: string }> }}
 */
function selectReplayRows(testSet, rowPins) {
  const currentRows = new Map(testSet.rows.map((row) => [row.id, row]));
  const rows = [];
  const droppedRows = [];

  for (const pin of rowPins) {
    const row = currentRows.get(pin.id);
    if (!row) {
      droppedRows.push({ id: pin.id, reason: 'missing from current corpus' });
      continue;
    }
    if (typeof pin.track === 'string' && pin.track !== row.track) {
      droppedRows.push({ id: pin.id, reason: 'track changed' });
      continue;
    }
    if (
      typeof pin.questionSha256 === 'string'
      && createHash('sha256').update(row.question).digest('hex') !== pin.questionSha256
    ) {
      droppedRows.push({ id: pin.id, reason: 'question changed' });
      continue;
    }
    rows.push(row);
  }

  const counts = Object.fromEntries(testSet.tracks.map(({ track }) => [
    track,
    { ...testSet.counts[track], kept: 0 },
  ]));
  for (const row of rows) counts[row.track].kept += 1;

  return {
    testSet: { ...testSet, rows, counts },
    droppedRows,
  };
}

/**
 * The model identity a scored call log prints. Measured judgment records win
 * over the others, because an auth probe names the model the CLI used to check
 * the credential rather than the one that answered a judgment; every usable
 * record is the fallback when no judgment measured. Version and provider must
 * each be single-valued, and the distinct answering model names are sorted and
 * joined so a log that mixed models still names each one.
 *
 * @param {Array<Record<string, unknown>>} records Recorded calls.
 * @returns {{ jevVersion: string, provider: string, model: string }}
 * @throws {Error} When the records do not identify exactly one Jev model tuple.
 */
export function modelTupleFromRecords(records) {
  const usable = records.filter((record) => record.backend === 'jev'
    && typeof record.jevVersion === 'string'
    && typeof record.provider === 'string'
    && typeof record.model === 'string');
  const measuredJudgments = usable.filter((record) => record.kind !== 'auth_test' && record.status === 'measured');
  const chosen = measuredJudgments.length > 0 ? measuredJudgments : usable;
  const jevVersions = new Set(chosen.map((record) => record.jevVersion));
  const providers = new Set(chosen.map((record) => record.provider));
  if (jevVersions.size !== 1 || providers.size !== 1) {
    throw new Error('call log must identify exactly one Jev model tuple');
  }
  const models = [...new Set(chosen.map((record) => record.model))].sort();
  return {
    jevVersion: [...jevVersions][0],
    provider: [...providers][0],
    model: models.join('+'),
  };
}

function recordsByRowAndOrder(records, kind) {
  const byRow = new Map();
  for (const record of records) {
    if (
      record.backend !== 'jev'
      || record.kind !== kind
      || typeof record.rowId !== 'string'
      || !Number.isInteger(record.order)
    ) continue;
    let byOrder = byRow.get(record.rowId);
    if (!byOrder) {
      byOrder = new Map();
      byRow.set(record.rowId, byOrder);
    }
    const prior = byOrder.get(record.order);
    if (!prior || Number(record.attempt ?? 1) >= Number(prior.attempt ?? 1)) {
      byOrder.set(record.order, record);
    }
  }
  return byRow;
}

function recordedPick(record) {
  return record?.status === 'measured' && typeof record.pick === 'string'
    ? record.pick
    : null;
}

function picksForRow(byRow, rowId, orderCount = ORDERS) {
  const byOrder = byRow.get(rowId);
  return Array.from({ length: orderCount }, (_, order) => recordedPick(byOrder?.get(order)));
}

function probabilityPick(records) {
  if (!Array.isArray(records) || records.length !== ORDERS) return null;
  return probabilityAwarePick(records.map((record) => ({ pick: recordedPick(record), pickProb: record?.pickProb, noneProb: record?.noneProb })), NONE_KEY);
}

/**
 * One alternative arm's counts and verdict, scored on the picks the arm
 * selects. A row counts only when the selected pick is a string and every
 * recorded answer is a string; flips count only when the arm sees all three
 * orders. The simple policies the strongest-policy gate compares against are
 * counted on those same rows with the row's own track as gold, so a row the
 * arm leaves out cannot raise the bar.
 *
 * @param {string} backend Arm name, printed on its verdict line.
 * @param {Array<{ id: string, track: string }>} rows Kept rows.
 * @param {Map<string, string | null>} selectedPicks Row id to the pick the arm selects.
 * @param {Map<string, string | null>} baselinePicks Row id to the baseline pick.
 * @param {Map<string, Map<number, Record<string, unknown>>>} byRow Recorded calls by row id and order.
 * @param {number} orderCount Orders the arm sees.
 * @param {Map<string, { lookup: string | null, ripgrep: string | null }>} [rowPicks] Row id to that row's lookup and ripgrep picks; omitted skips the strongest-policy gate.
 * @returns {object} Counts, the outcome and reason unions, the gates and the verdict line.
 */
function summarizePickArm(backend, rows, selectedPicks, baselinePicks, byRow, orderCount, rowPicks) {
  const K = rows.length;
  let M = 0;
  let unstable = 0;
  let abstained = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let decidedCount = 0;
  let decidedCorrect = 0;
  let lookupRight = 0;
  let ripgrepRight = 0;
  /** @type {Map<string, number>} */
  const goldCounts = new Map();
  /** @type {Array<{ cls: string, jevRight: boolean, baselineRight: boolean }>} */
  const classRows = [];
  for (const row of rows) {
    const pick = selectedPicks.get(row.id);
    if (typeof pick !== 'string') continue;
    const answers = picksForRow(byRow, row.id, orderCount);
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    M += 1;
    const { top } = modalPick(answers);
    if (orderCount === ORDERS) {
      F += ORDERS - top;
      if (top < 2) unstable += 1;
    }
    if (pick === NONE_KEY) abstained += 1;
    const backendRight = pick === row.track;
    const baselineRight = baselinePicks.get(row.id) === row.track;
    if (backendRight) A += 1;
    if (baselineRight) B += 1;
    if (backendRight && !baselineRight) W += 1;
    if (baselineRight && !backendRight) L += 1;
    const picks = rowPicks?.get(row.id);
    if (picks?.lookup === row.track) lookupRight += 1;
    if (picks?.ripgrep === row.track) ripgrepRight += 1;
    goldCounts.set(row.track, (goldCounts.get(row.track) ?? 0) + 1);
    classRows.push({ cls: row.track, jevRight: backendRight, baselineRight });
    if (pick !== NONE_KEY) {
      decidedCount += 1;
      if (backendRight) decidedCorrect += 1;
    }
  }

  let majority = 0;
  for (const count of goldCounts.values()) {
    if (count > majority) majority = count;
  }
  const policies = {
    lookup: lookupRight,
    ripgrep: ripgrepRight,
    'always-none': goldCounts.get(NONE_KEY) ?? 0,
    majority,
  };
  const strongest = typeof rowPicks === 'undefined' ? undefined : beatsStrongestPolicy(A, policies);
  const floor = classFloor(classRows);
  const verdict = decideVerdict({ K, M, A, B, W, L, F, strongest, floor });
  const line = verdictLine(backend, { K, M, A, B, W, L, F }, verdict);
  return {
    backend,
    K,
    M,
    unmeasured: K - M,
    unstable,
    abstained,
    A,
    B,
    W,
    L,
    F,
    p: verdict.p,
    flipRate: M === 0 ? 0 : F / (orderCount * M),
    outcome: verdict.outcome,
    reason: verdict.reason,
    strongest,
    floor,
    line,
    decidedCount,
    decidedCorrect,
    decidedAccuracy: decidedCount === 0 ? null : decidedCorrect / decidedCount,
    marginSlack: marginSlack({ A, B, M }),
  };
}

/**
 * Resample whole tracks so rows from the same track remain clustered.
 *
 * @param {Array<{ id: string, track: string }>} rows Scored rows.
 * @param {Map<string, string | null>} picks Model picks.
 * @param {Map<string, string | null>} baselinePicks Baseline picks.
 * @returns {{ clusterCount: number, replicates: number, estimate: number | null, lower: number | null, upper: number | null }}
 */
export function clusterBootstrapInterval(rows, picks, baselinePicks) {
  const items = [];
  for (const row of rows) {
    const pick = picks.get(row.id);
    if (typeof pick !== 'string') continue;
    items.push({
      cluster: row.track,
      delta: Number(pick === row.track) - Number(baselinePicks.get(row.id) === row.track),
    });
  }

  const seedText = rows.map((row) => `${row.id}\u0000${picks.get(row.id) ?? ''}`).join('\n');
  return clusterBootstrapItems(items, seedText);
}

/**
 * Derive alternative arms and diagnostics from recorded calls.
 *
 * @param {{ rows: Array<{ id: string, track: string }>, probes: Array<{ id: string }>, baselinePicks: Map<string, string | null>, options: { pairs: Array<[string, string]> }, rowPicks: Map<string, { lookup: string | null, ripgrep: string | null }> }} plan
 * @param {Array<Record<string, unknown>>} records Recorded calls.
 * @param {{ jevVersion: string, provider: string, model: string }} modelTuple
 * @returns {{ column: object, latency: { p50: number | null, p95: number | null }, probePicks: Map<string, string | null>, probabilityAware: object, oneCall: object, shortlist: object, perTrack: Record<string, object>, bootstrap: object, modelTuple: object }}
 */
export function analyzeRecordedCalls(plan, records, modelTuple) {
  const testByRow = recordsByRowAndOrder(records, 'test');
  const probeByRow = recordsByRowAndOrder(records, 'probe');
  const rowAnswers = new Map(plan.rows.map((row) => [row.id, picksForRow(testByRow, row.id)]));
  const suffix = `jev_version=${modelTuple.jevVersion.replace(/^jev /, '')}`
    + ` provider=${modelTuple.provider} model=${modelTuple.model}`;
  const column = summarizeColumn('jev', plan.rows, rowAnswers, plan.baselinePicks, suffix, plan.rowPicks);
  const wallTimes = records
    .map((record) => record.wallMs)
    .filter((value) => typeof value === 'number' && Number.isFinite(value));
  const latency = {
    p50: nearestRank(wallTimes, 0.5),
    p95: nearestRank(wallTimes, 0.95),
  };
  const probabilityPicks = new Map(plan.rows.map((row) => [
    row.id,
    probabilityPick(Array.from({ length: ORDERS }, (_, order) => testByRow.get(row.id)?.get(order))),
  ]));
  const oneCallPicks = new Map(plan.rows.map((row) => [row.id, recordedPick(testByRow.get(row.id)?.get(0))]));
  const probabilityAware = summarizePickArm(
    'probability-aware', plan.rows, probabilityPicks, plan.baselinePicks, testByRow, ORDERS,
    plan.rowPicks,
  );
  const oneCall = summarizePickArm(
    'one-call', plan.rows, oneCallPicks, plan.baselinePicks, testByRow, 1, plan.rowPicks,
  );
  const perTrack = {};
  for (const row of plan.rows) {
    if (!perTrack[row.track]) {
      perTrack[row.track] = { rows: 0, measured: 0, correct: 0, wrong: 0, abstained: 0, confusion: {} };
    }
    const bucket = perTrack[row.track];
    bucket.rows += 1;
    const answers = rowAnswers.get(row.id);
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    const pick = modalPick(answers).pick;
    if (pick === null) continue;
    bucket.measured += 1;
    bucket.confusion[pick] = (bucket.confusion[pick] ?? 0) + 1;
    if (pick === NONE_KEY) bucket.abstained += 1;
    else if (pick === row.track) bucket.correct += 1;
    else bucket.wrong += 1;
  }
  for (const bucket of Object.values(perTrack)) {
    bucket.confusion = Object.fromEntries(
      Object.entries(bucket.confusion).sort(([left], [right]) => compareCodeUnits(left, right)),
    );
  }
  const shortlist = {
    candidateTracks: Math.min(SHORTLIST_SIZE, Math.max(0, plan.options.pairs.length - 1)),
    callsPerRow: 1,
    measured: false,
    reason: 'the replay contains no responses to a five-track option list',
  };
  const bootstrap = clusterBootstrapInterval(plan.rows, probabilityPicks, plan.baselinePicks);
  const probePicks = new Map(plan.probes.map((probe) => {
    const answers = picksForRow(probeByRow, probe.id);
    return [probe.id, answers.every((answer) => typeof answer === 'string') ? modalPick(answers).pick : null];
  }));
  return {
    column, latency, probePicks, probabilityAware, oneCall, shortlist, perTrack, bootstrap, modelTuple,
  };
}

/**
 * One arm's verdict block: its verdict line, the strongest-policy line, the
 * class-floor lines and the sign-test power line over its decided pairs.
 *
 * @param {object} summary Column or alternative-arm summary.
 * @param {(line: string) => void} out Line writer.
 */
function armVerdictLines(summary, out) {
  out(summary.line);
  out(strongestPolicyLine(summary.backend, summary.A, summary.strongest));
  for (const line of classFloorLines(summary.backend, summary.floor)) out(line);
  const pairs = summary.W + summary.L;
  out(powerLine(summary.backend, { pairs, winRate: pairs === 0 ? null : summary.W / pairs }));
}

function recordedAnalysisLines(analysis, out) {
  out(columnLine(analysis.column, analysis.latency));
  armVerdictLines(analysis.column, out);
  armVerdictLines(analysis.probabilityAware, out);
  out(decidedSubsetLine('probability-aware', analysis.probabilityAware));
  out(marginSlackLine('probability-aware', analysis.probabilityAware.marginSlack));
  armVerdictLines(analysis.oneCall, out);
  out(`shortlist arm: candidates=${analysis.shortlist.candidateTracks}`
    + ` calls_per_row=${analysis.shortlist.callsPerRow} accuracy=not-measured reason=${analysis.shortlist.reason}`);
  for (const [track, bucket] of Object.entries(analysis.perTrack)) {
    out(`per-track jev: gold=${track} rows=${bucket.rows} measured=${bucket.measured}`
      + ` correct=${bucket.correct} wrong=${bucket.wrong} abstained=${bucket.abstained}`
      + ` confusion=${JSON.stringify(bucket.confusion)}`);
  }
  out(bootstrapLine('probability-aware', analysis.bootstrap));
}

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
function which(name, env) {
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
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF and exits 2 on an inherited
 * terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdinText Text written to stdin, then closed.
 * @param {Record<string, string | undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
 * @returns {Promise<{
 *   code: number | null,
 *   stdout: string,
 *   stderr: string,
 *   wallMs: number,
 *   timedOut: boolean
 * }>}
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
 *
 * @param {string | undefined} outDir Directory that holds calls.jsonl.
 * @returns {{ append: (record: object) => void }} Append-only call log.
 */
export function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const filePath = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(filePath, '', { flag: 'wx' });
        created = true;
      }
      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. JEV ARM
// ───────────────────────────────────────────────────────────────────

// The gate runs only behind --jev and only while the baseline keeps headroom.
// It reads no key and passes none: jev resolves its own credential, so a
// skipped arm still writes no file and a passing one keeps the report honest.

/** Pinned jev version the gate accepts. */
export const JEV_VERSION = 'jev 0.6.2';

/**
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 *
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number
 * }} ctx Line writer, environment and per-call timeout.
 * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed.
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
 * One auth test, then three choice calls per item, one per option order,
 * with one calls.jsonl record per spawn. Exit 4 gets one retry after the
 * backoff, because a dropped connection is not a judgment. A stop prints
 * the line and the items that finished, and leaves the column and verdict
 * unprinted.
 *
 * @param {{
 *   rows: Array<{ id: string, track: string, question: string }>,
 *   probes: Array<{ id: string, question: string }>,
 *   options: { pairs: Array<[string, string]>, keys: string[] },
 *   baselinePicks: Map<string, string | null>,
 *   rowPicks: Map<string, { lookup: string | null, ripgrep: string | null }>
 * }} plan Rows, gold-bearing probes, the option set, the baseline picks and
 *   the per-row lookup and ripgrep picks.
 * @param {{ path: string, provider: string }} gate Passing jevGate result.
 * @param {{
 *   out: (line: string) => void,
 *   env: Record<string, string | undefined>,
 *   timeoutMs: number,
 *   backoffMs: number,
 *   callLog: { append: (record: object) => void }
 * }} ctx Line writer, environment, per-call timeout, retry wait and call log.
 * @returns {Promise<
 *   { stopped: string, partialRows: number }
 *   | {
 *     column: {
 *       backend: string,
 *       K: number,
 *       M: number,
 *       unmeasured: number,
 *       unstable: number,
 *       abstained: number,
 *       A: number,
 *       B: number,
 *       W: number,
 *       L: number,
 *       F: number,
 *       p: number,
 *       flipRate: number,
 *       outcome: 'keep' | 'kill' | 'stop',
 *       reason: 'coverage' | 'margin' | 'sign test' | 'strongest policy' | 'class floor' | 'flips' | null,
 *       line: string,
 *       latency: { p50: number | null, p95: number | null },
 *       jevVersion: string,
 *       provider: string,
 *       model: string,
 *       requalify: string | null
 *     },
 *     probePicks: Map<string, string | null>
 *   }
 * >}
 */
export async function runJevArm(plan, gate, ctx) {
  const items = [
    ...plan.rows.map((row) => ({ kind: 'test', id: row.id, question: row.question })),
    ...plan.probes.map((probe) => ({ kind: 'probe', id: probe.id, question: probe.question })),
  ];
  let chars = 0;
  for (const item of items) {
    chars += item.question.length + CHOICE_INSTRUCTION.length;
    for (const [key, description] of plan.options.pairs) {
      chars += key.length + description.length + 1;
    }
  }
  chars *= ORDERS;
  ctx.out(`jev: payload: committed packet descriptions, fixture probe text and track descriptions; planned calls: ${ORDERS * items.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);

  const callRecords = [];
  let finished = 0;

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  const auth = await spawnCall(
    gate.path,
    ['auth', 'test', '--provider', gate.provider],
    '',
    ctx.env,
    ctx.timeoutMs,
  );
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
  const authRecord = {
    backend: 'jev',
    kind: 'auth_test',
    rowId: null,
    order: null,
    attempt: 1,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    pick: null,
    pickProb: null,
    noneProb: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion: JEV_VERSION,
    provider: gate.provider,
    model,
  };
  ctx.callLog.append(authRecord);
  callRecords.push(authRecord);
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  /**
   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
   * judgment, so its pick, probabilities and status stay empty.
   */
  function record(item, order, attempt, r, pick, pickProb, noneProb, status) {
    return {
      backend: 'jev',
      kind: item.kind,
      rowId: item.id,
      order,
      attempt,
      wallMs: r.wallMs,
      exitCode: r.code,
      transport: r.transport,
      pick,
      pickProb,
      noneProb,
      status,
      jevVersion: JEV_VERSION,
      provider: gate.provider,
      model: r.model ?? model,
    };
  }

  for (const item of items) {
    for (let order = 0; order < ORDERS; order += 1) {
      const args = ['choice', '--provider', gate.provider, '-q', CHOICE_INSTRUCTION];
      for (const [key, description] of rotateOptions(plan.options.pairs, order)) {
        args.push('-o', `${key}=${description}`);
      }
      let attempt = 1;
      let r = await spawnClassifierCall({
        file: gate.path,
        args,
        stdin: item.question,
        env: ctx.env,
        timeoutMs: ctx.timeoutMs,
        report: ctx.out,
      });

      if (!r.timedOut && r.code === 4) {
        const failedAttempt = record(item, order, attempt, r, null, null, null, 'unmeasured');
        ctx.callLog.append(failedAttempt);
        callRecords.push(failedAttempt);
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        attempt = 2;
        r = await spawnClassifierCall({
          file: gate.path,
          args,
          stdin: item.question,
          env: ctx.env,
          timeoutMs: ctx.timeoutMs,
          report: ctx.out,
        });
      }

      let pick = null;
      let pickProb = null;
      let noneProb = null;
      let status = 'unmeasured';
      let stopLine = null;
      if (r.timedOut) {
        status = 'unmeasured_timeout';
      } else if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch {
          // A body that does not parse is a missed measurement, not a crash.
        }
        const choice = parsed?.answers?.answer?.choice;
        if (typeof choice === 'string' && plan.options.keys.includes(choice)) {
          pick = choice;
          const probabilities = parsed.answers.answer.probabilities;
          pickProb = probabilities?.[pick] ?? null;
          noneProb = probabilities?.none ?? null;
          status = 'measured';
        }
      } else if (r.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (r.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (r.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      const callRecord = record(item, order, attempt, r, pick, pickProb, noneProb, status);
      ctx.callLog.append(callRecord);
      callRecords.push(callRecord);
      if (stopLine !== null) return stop(stopLine);
    }
    finished += 1;
  }

  // A live run and a replay of its own call log must print the same verdict line, so both read the records.
  const modelTuple = modelTupleFromRecords(callRecords);
  const analysis = analyzeRecordedCalls(plan, callRecords, modelTuple);
  recordedAnalysisLines(analysis, ctx.out);
  const column = {
    ...analysis.column,
    latency: analysis.latency,
    jevVersion: modelTuple.jevVersion,
    provider: modelTuple.provider,
    model: modelTuple.model,
  };

  return {
    column,
    probePicks: analysis.probePicks,
    analysis,
    modelTuple,
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. ENTRY POINT
// ───────────────────────────────────────────────────────────────────

/**
 * The report one run writes to report.json. The test set keeps its row count
 * and per-track counts, the baselines keep their summary, and the probes keep
 * their totals and per-method hits. Each arm entry, undefined or { skipped }
 * or { stopped, partialRows } or { column, requalify }, fills one bucket: a
 * finished column under columns, a stop under stopped and a skip under skipped.
 *
 * @param {{
 *   manifestHash: string,
 *   testSet: { rows: Array<object>, counts: Record<string, object> },
 *   summary: object,
 *   options: { pairs: Array<[string, string]>, sha256: string },
 *   probes: Array<{ gold: string[] }>,
 *   probeHitCounts: Record<string, number>,
 *   analysis?: object,
 *   jev?: object,
 *   replay?: { droppedRows: Array<{ id: string, reason: string }> }
 * }} parts
 * @returns {object} Report object ready for JSON.stringify.
 */
export function buildReport(parts) {
  const {
    manifestHash, testSet, summary, options, probes, probeHitCounts, analysis, jev, replay,
  } = parts;
  let goldLess = 0;
  for (const probe of probes) {
    if (probe.gold.length === 0) goldLess += 1;
  }

  const report = {
    manifestHash,
    testSet: { K: testSet.rows.length, counts: testSet.counts },
    dataPin: pinRowSet(testSet, options),
    baselines: summary,
    instruction: CHOICE_INSTRUCTION,
    options: options.pairs.length,
    optionSetSha256: options.sha256,
    modelTuple: jev?.modelTuple ?? null,
    probes: { total: probes.length, goldLess, hits: probeHitCounts },
    analysis: analysis ? {
      probabilityAware: analysis.probabilityAware,
      oneCall: analysis.oneCall,
      shortlist: analysis.shortlist,
      perTrack: analysis.perTrack,
      bootstrap: analysis.bootstrap,
    } : null,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };
  if (replay) report.replay = replay;

  for (const [backend, arm] of [['jev', jev]]) {
    if (!arm) continue;
    if (typeof arm.skipped === 'string') {
      report.skipped[backend] = arm.skipped;
      continue;
    }
    if (typeof arm.stopped === 'string') {
      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      continue;
    }
    if (!arm.column) continue;
    const { column } = arm;
    report.columns[backend] = {
      verdict: column.outcome,
      reason: column.reason,
      line: column.line,
      K: column.K,
      M: column.M,
      A: column.A,
      B: column.B,
      W: column.W,
      L: column.L,
      F: column.F,
      p: column.p,
      unmeasured: column.unmeasured,
      unstable: column.unstable,
      abstained: column.abstained,
      flipRate: column.flipRate,
      latency: column.latency,
    };

    if (backend === 'jev') {
      report.columns[backend].jevVersion = column.jevVersion;
      report.columns[backend].provider = column.provider;
      report.columns[backend].model = column.model;
    }
    report.requalify[backend] = null;
  }

  return report;
}

/**
 * Prints the zero-call report, or replays a recorded call log without a model
 * call. The default run writes no file and spawns no model binary.
 *
 * @param {string[]} argv - Arguments after the script path.
 * @param {Object} [deps] - Input, writer and model arm replacements.
 * @param {string} [deps.repoRoot] - Repository root. Default DEFAULT_REPO_ROOT.
 * @param {string} [deps.indexPath] - Trigger index path. Default DEFAULT_INDEX_PATH.
 * @param {string} [deps.probesPath] - Probe fixture path. Default DEFAULT_PROBES_PATH.
 * @param {string[]} [deps.hubNames] - Hub names passed to buildTestSet. Default: the repo's own list.
 * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
 * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
 * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
 * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
 * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
 * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? DEFAULT_REPO_ROOT;
  const indexPath = deps.indexPath ?? DEFAULT_INDEX_PATH;
  const probesPath = deps.probesPath ?? DEFAULT_PROBES_PATH;
  const hubNames = deps.hubNames;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? 90000;
  const backoffMs = deps.backoffMs ?? 2000;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        jev: { type: 'boolean' },
        out: { type: 'string' },
        replay: { type: 'string' },
      },
    });
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }
  const { values } = parsed;
  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    err('--jev needs --out <dir> so every call is recorded');
    return 2;
  }
  const hasReplay = values.replay !== undefined;
  if (hasReplay && (typeof values.replay !== 'string' || values.replay === '')) {
    err('--replay needs a calls.jsonl path');
    return 2;
  }
  if (values.jev === true && hasReplay) {
    err('--jev and --replay cannot be combined');
    return 2;
  }
  if (values.out !== undefined && values.out === '') {
    err('--out needs a directory');
    return 2;
  }
  if (outDirectoryHoldsRun(values.out)) {
    err('--out directory already holds a run');
    return 2;
  }

  const started = Date.now();
  let testSet;
  let loaded;
  let probes;
  let picks;
  let lookupProbe;
  let ripgrepProbe;
  let jevResult;
  let replayRecords;
  let replayTuple;
  let replayRowPins;
  let replayDroppedRows = [];
  try {
    if (hasReplay) {
      replayRecords = readCallRecords(values.replay);
      replayTuple = modelTupleFromRecords(replayRecords);
      replayRowPins = readReplayRowPins(values.replay, replayRecords);
    }
    const testSetOptions = hubNames ? { hubNames } : {};
    if (hasReplay) {
      testSetOptions.replayRowIds = new Set(replayRowPins.map((pin) => pin.id));
    }
    testSet = buildTestSet(repoRoot, testSetOptions);
    if (hasReplay) {
      const selected = selectReplayRows(testSet, replayRowPins);
      testSet = selected.testSet;
      replayDroppedRows = selected.droppedRows;
    }
    loaded = loadIndex(indexPath, { hashIndex: false });
    probes = probeGold(loaded, loadProbes(probesPath));
    const context = { repoRoot, cache: new Map() };
    picks = testSet.rows.map((row) => ({
      lookup: lookupPick(loaded, row.question, row.folder),
      ripgrep: ripgrepPick(row.question, row.folder, context),
    }));
    lookupProbe = new Map(probes.map((probe) => [
      probe.id,
      lookupPick(loaded, probe.question, null),
    ]));
    ripgrepProbe = new Map(probes.map((probe) => [
      probe.id,
      ripgrepPick(probe.question, null, context),
    ]));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const summary = summarizeBaselines(testSet.rows, picks);
  const options = buildOptions(testSet.tracks);
  const probeCount = probes.filter((probe) => probe.gold.length > 0).length;
  const baselinePicks = new Map(testSet.rows.map((row, index) => [
    row.id,
    picks[index][summary.method],
  ]));
  const rowPicks = new Map(testSet.rows.map((row, index) => [row.id, picks[index]]));
  const armPlan = {
    rows: testSet.rows,
    probes: probes.filter((probe) => probe.gold.length > 0),
    options,
    baselinePicks,
    rowPicks,
  };

  out(`index manifestHash: ${loaded.manifestHash}`);
  for (const dropped of replayDroppedRows) {
    out(`replay row dropped: ${dropped.id} reason=${dropped.reason}`);
  }
  for (const line of testSetLines(testSet)) out(line);
  for (const line of baselineLines(summary)) out(line);
  for (const line of ruleLines(options)) out(line);
  for (const line of headroomLines(summary, probeCount)) out(line);
  if (hasReplay) {
    const analysis = analyzeRecordedCalls(armPlan, replayRecords, replayTuple);
    recordedAnalysisLines(analysis, out);
    jevResult = {
      column: {
        ...analysis.column,
        latency: analysis.latency,
        ...analysis.modelTuple,
      },
      probePicks: analysis.probePicks,
      analysis,
      modelTuple: analysis.modelTuple,
    };
  } else if (values.jev === true) {
    if (!summary.headroom) {
      jevResult = { skipped: 'jev arm skipped: no headroom' };
      out(jevResult.skipped);
    } else {
      const jevCheck = jevGate({ out, env, timeoutMs });
      if (jevCheck.passed) {
        jevResult = await runJevArm(
          armPlan,
          jevCheck,
          { out, env, timeoutMs, backoffMs, callLog: createCallLog(values.out) },
        );
      } else {
        jevResult = { skipped: jevCheck.reason };
      }
    }
  }
  const probeMethods = [
    ['lookup', probeHits(probes, lookupProbe)],
    ['ripgrep', probeHits(probes, ripgrepProbe)],
  ];

  if (jevResult && jevResult.column) {
    probeMethods.push(['jev', probeHits(probes, jevResult.probePicks)]);
  }
  out(probeLine(probes, probeMethods));

  if (
    (values.jev === true || hasReplay)
    && typeof values.out === 'string'
    && values.out !== ''
  ) {
    const report = buildReport({
      manifestHash: loaded.manifestHash,
      testSet,
      summary,
      options,
      probes,
      probeHitCounts: Object.fromEntries(probeMethods),
      analysis: jevResult?.analysis,
      jev: jevResult,
      replay: hasReplay ? { droppedRows: replayDroppedRows } : undefined,
    });
    fs.mkdirSync(values.out, { recursive: true });
    if (hasReplay) fs.copyFileSync(values.replay, path.join(values.out, 'calls.jsonl'));
    fs.writeFileSync(
      path.join(values.out, 'report.json'),
      `${JSON.stringify(report, null, 2)}\n`,
      { flag: 'wx' },
    );
  }

  err(`wall time: ${((Date.now() - started) / 1000).toFixed(1)} s`);
  return 0;
}

if (isMainModule(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
