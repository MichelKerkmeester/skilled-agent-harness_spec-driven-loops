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

import { compareCodeUnits, normalizeTriggerText } from './lib/normalize.mjs';
import { lookup } from './lookup-trigger-index.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Rows kept from one track after the hash order is applied. */
export const MAX_ROWS_PER_TRACK = 20;

/** Normalized tokens a description needs before it can be a question. */
export const MIN_QUESTION_TOKENS = 5;

/** Largest track list this measurement will score. */
export const MAX_TRACKS = 25;

/** Directory names left out of the track list and of the packet walk. */
export const SKIPPED_TREES = Object.freeze(['z_archive', 'scratch', 'research', 'context']);

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
