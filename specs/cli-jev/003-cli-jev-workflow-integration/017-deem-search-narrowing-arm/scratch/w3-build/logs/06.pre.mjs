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
//   node score-track-narrowing.mjs [--deem] [--jev] [--out <dir>]
//
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, or a model switch whose gate passed without
// --out.
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compareCodeUnits, normalizeTriggerText } from './lib/normalize.mjs';
import { pathOnlyRecipe, runRecipe } from './lib/rg-lane.mjs';
import { lookup } from './lookup-trigger-index.mjs';

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
export const MARGIN_LINE = 'margin: 0.10';
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, '
  + 'margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M';

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
 * @param {{ hubNames?: string[] }} [options]
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
    const selected = kept.slice(0, MAX_ROWS_PER_TRACK);
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
