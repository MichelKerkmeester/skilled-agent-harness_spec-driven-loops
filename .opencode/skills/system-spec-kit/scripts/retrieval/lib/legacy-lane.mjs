// ───────────────────────────────────────────────────────────────
// MODULE: Legacy Trigger Lane Replay
// ───────────────────────────────────────────────────────────────
// Replays the substring trigger lane from
// mcp-server/lib/search/hybrid-search.ts against the sqlite index directly,
// with no daemon and no MCP transport in the path. The lane is the comparison
// target for the generated index, so every clause below mirrors the shipped
// query rather than an improved version of it: the candidate gate, the
// searchable-tier predicate, the expiry filter, the spec-folder LIKE with its
// escape, the pre-scoring candidate window and the post-scoring sort.
//
// The database is opened read-only and never written. Two clauses in the
// shipped query read a clock — the expiry filter reads sqlite's and the recency
// boost reads the process clock — so the recency clock is injectable, which is
// what lets one replay produce the same bytes twice.
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { normalizeTriggerText, scorePhrase } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));

/** The lane's own default result cap. */
export const LEGACY_DEFAULT_LIMIT = 20;

/** Candidate-gate token floor and cap applied by the lane's SQL entry point. */
export const LEGACY_MIN_TOKEN_LENGTH = 3;
export const LEGACY_MAX_TOKENS = 8;

/** Rows read before scoring are capped at this multiple of the result limit. */
export const LEGACY_CANDIDATE_MULTIPLIER = 3;

/** Importance weight substituted when the column is null or not finite. */
export const LEGACY_DEFAULT_IMPORTANCE = 0.5;

/** Score contributions layered on top of the phrase match score. */
const IMPORTANCE_WEIGHT = 0.03;
const RECENCY_WEIGHT = 0.04;

/** Recency half-life divisor, in days. */
const RECENCY_SCALE_DAYS = 30;

const MS_PER_DAY = 86_400_000;

/** Where better-sqlite3 is installed for this subsystem. */
const SQLITE_HOST_DIR = path.resolve(LIB_DIR, '..', '..', '..', 'mcp-server') + path.sep;

// ───────────────────────────────────────────────────────────────
// 2. SQL PREDICATE REPLICAS
// ───────────────────────────────────────────────────────────────

/**
 * Replica of the shipped feature-flag reader: a flag is on unless the
 * environment explicitly says `false` or `0`.
 *
 * @param {string} flagName Environment variable name.
 * @param {NodeJS.ProcessEnv} [env] Environment to read.
 * @returns {boolean} True when the feature is enabled.
 */
export function isFeatureEnabled(flagName, env = process.env) {
  const raw = env[flagName]?.toLowerCase?.()?.trim?.();
  return raw !== 'false' && raw !== '0';
}

/**
 * Replica of getSearchableTiersFilter. Cold rows are excluded only when the
 * caller asks for neither cold nor archived retrieval, which is why the
 * shipped default resolves to an unconditional predicate.
 *
 * @param {string} alias SQL table alias.
 * @param {{ includeArchived?: boolean, includeCold?: boolean }} [options] Tier options.
 * @returns {string} SQL predicate.
 */
export function searchableTiersFilter(alias, options = {}) {
  const column = `${alias}.importance_tier`;
  const excluded = [];
  if (!options.includeCold) {
    excluded.push('deprecated');
    if (!options.includeArchived) excluded.push('archived');
  }
  if (excluded.length === 0) return '1=1';
  const literals = excluded.map((tier) => `'${tier}'`).join(',');
  return `(${column} IS NULL OR lower(${column}) NOT IN (${literals}))`;
}

/**
 * Replica of ACTIVE_ROW_SQL: tombstone check plus the tier predicate.
 *
 * @param {string} alias SQL table alias.
 * @param {{ includeArchived?: boolean, includeCold?: boolean }} [options] Tier options.
 * @returns {string} SQL predicate.
 */
export function activeRowSql(alias, options = {}) {
  const includeCold = options.includeArchived === true || options.includeCold === true;
  return `${alias}.deleted_at IS NULL AND ${searchableTiersFilter(alias, {
    includeArchived: options.includeArchived,
    includeCold,
  })}`;
}

/**
 * Replica of escapeLikePattern.
 *
 * @param {string} value Raw value.
 * @returns {string} LIKE-safe value for use with `ESCAPE '\'`.
 */
export function escapeLikePattern(value) {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/**
 * Replica of specFolderLikePattern.
 *
 * @param {string} specFolder Folder prefix.
 * @returns {string} Escaped descendant pattern.
 */
export function specFolderLikePattern(specFolder) {
  return `${escapeLikePattern(specFolder)}/%`;
}

/**
 * Replica of parse_trigger_phrases: a stored value that is not a JSON array
 * yields no phrases rather than an error.
 *
 * @param {string | string[] | null | undefined} value Stored column value.
 * @returns {string[]} Phrases.
 */
export function parseTriggerPhrases(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Replica of timestampBoost. The clock is a parameter so a replay is
 * reproducible; the shipped lane reads the process clock here.
 *
 * @param {unknown} value Timestamp string.
 * @param {number} nowMs Reference instant in epoch milliseconds.
 * @returns {number} Boost in [0, 1].
 */
export function timestampBoost(value, nowMs) {
  if (typeof value !== 'string' || value.length === 0) return 0;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return 0;
  const ageDays = Math.max(0, (nowMs - parsed) / MS_PER_DAY);
  return 1 / (1 + ageDays / RECENCY_SCALE_DAYS);
}

/**
 * Replica of computeTriggerMatchScore, expressed through the shared scorer so
 * the two lanes cannot drift apart in the classes they recognize.
 *
 * @param {string} query Raw query text.
 * @param {string} phrase Raw phrase text.
 * @returns {{ matchClass: string, score: number }} Zero score means no match.
 */
export function legacyMatchScore(query, phrase) {
  const scored = scorePhrase(normalizeTriggerText(query), normalizeTriggerText(phrase));
  return scored ?? { matchClass: 'none', score: 0 };
}

/**
 * Replica of the lane's candidate-gate tokenizer: dedupe at the scoring floor,
 * then drop tokens below the SQL floor and keep the first few.
 *
 * @param {string} query Raw query text.
 * @returns {string[]} Tokens used to build the LIKE terms.
 */
export function legacyQueryTokens(query) {
  return Array.from(new Set(
    normalizeTriggerText(query).split(/\s+/).filter((token) => token.length >= 2),
  ))
    .filter((token) => token.length >= LEGACY_MIN_TOKEN_LENGTH)
    .slice(0, LEGACY_MAX_TOKENS);
}

// ───────────────────────────────────────────────────────────────
// 3. DATABASE ACCESS
// ───────────────────────────────────────────────────────────────

/**
 * Opens the index read-only. `fileMustExist` keeps a typo from creating an
 * empty database that would then report a confident zero.
 *
 * @param {string} databasePath Absolute path to the sqlite file.
 * @param {{ hostDir?: string }} [options] Where to resolve better-sqlite3 from.
 * @returns {import('better-sqlite3').Database} Open handle.
 */
export function openLegacyDatabase(databasePath, options = {}) {
  const require = createRequire(options.hostDir ?? SQLITE_HOST_DIR);
  const Database = require('better-sqlite3');
  return new Database(databasePath, { fileMustExist: true, readonly: true });
}

// ───────────────────────────────────────────────────────────────
// 4. SEARCH
// ───────────────────────────────────────────────────────────────

/**
 * Runs the replayed lane.
 *
 * `windowed: false` drops the pre-scoring LIMIT. That is not the shipped
 * behavior; it exists so a caller can tell a document the lane genuinely does
 * not match from one the candidate window cut off before scoring ever ran.
 *
 * @param {import('better-sqlite3').Database} db Open read-only handle.
 * @param {string} query Raw prompt text.
 * @param {{
 *   includeArchived?: boolean,
 *   limit?: number,
 *   nowMs?: number,
 *   specFolder?: string | null,
 *   windowed?: boolean
 * }} [options] Query options.
 * @returns {{
 *   candidateLimit: number | null,
 *   candidateRowCount: number,
 *   normalizedQuery: string,
 *   results: Array<{
 *     createdAt: string | null,
 *     id: number,
 *     importanceTier: string | null,
 *     importanceWeight: number,
 *     matchClass: string,
 *     matchScore: number,
 *     path: string,
 *     phrases: string[],
 *     score: number,
 *     specFolder: string | null,
 *     updatedAt: string | null
 *   }>,
 *   saturated: boolean,
 *   sql: { activeRow: string, candidateLimit: number | null },
 *   tokens: string[]
 * }} Replay result.
 */
export function legacySearch(db, query, options = {}) {
  const limit = options.limit ?? LEGACY_DEFAULT_LIMIT;
  const windowed = options.windowed !== false;
  const nowMs = options.nowMs ?? Date.now();
  const includeArchived = options.includeArchived === true;
  const tokens = legacyQueryTokens(query);
  const normalizedQuery = normalizeTriggerText(query);
  const activeRow = activeRowSql('m', {
    includeArchived,
    includeCold: includeArchived || isFeatureEnabled('SPECKIT_INCLUDE_ARCHIVED_DEFAULT'),
  });
  const candidateLimit = windowed
    ? Math.max(limit, limit * LEGACY_CANDIDATE_MULTIPLIER)
    : null;

  const empty = {
    candidateLimit,
    candidateRowCount: 0,
    normalizedQuery,
    results: [],
    saturated: false,
    sql: { activeRow, candidateLimit },
    tokens,
  };
  if (tokens.length === 0) return empty;

  const conditions = [
    'm.trigger_phrases IS NOT NULL',
    "m.trigger_phrases != ''",
    "m.trigger_phrases != '[]'",
    activeRow,
    "(m.expires_at IS NULL OR m.expires_at > datetime('now'))",
    `(${tokens.map(() => 'LOWER(m.trigger_phrases) LIKE ?').join(' OR ')})`,
  ];
  const params = tokens.map((token) => `%${token}%`);

  const specFolder = typeof options.specFolder === 'string' && options.specFolder.length > 0
    ? options.specFolder
    : null;
  if (specFolder) {
    conditions.push("(m.spec_folder = ? OR m.spec_folder LIKE ? ESCAPE '\\')");
    params.push(specFolder, specFolderLikePattern(specFolder));
  }

  const rows = db.prepare(`
      SELECT m.*
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        CASE WHEN LOWER(m.trigger_phrases) LIKE ? THEN 0 ELSE 1 END,
        COALESCE(m.updated_at, m.created_at, '') DESC,
        m.id ASC
      ${candidateLimit === null ? '' : `LIMIT ${candidateLimit}`}
    `).all(...params, `%${normalizedQuery}%`);

  const scored = rows
    .map((row) => {
      const phrases = parseTriggerPhrases(row.trigger_phrases);
      let best = { matchClass: 'none', score: 0 };
      for (const phrase of phrases) {
        const phraseScore = legacyMatchScore(query, phrase);
        if (phraseScore.score > best.score) best = phraseScore;
      }
      if (best.score <= 0) return null;

      const importanceWeight = typeof row.importance_weight === 'number'
        && Number.isFinite(row.importance_weight)
        ? Math.max(0, Math.min(1, row.importance_weight))
        : LEGACY_DEFAULT_IMPORTANCE;
      const recency = timestampBoost(row.updated_at ?? row.created_at, nowMs);

      return {
        createdAt: row.created_at ?? null,
        id: row.id,
        importanceTier: row.importance_tier ?? null,
        importanceWeight,
        matchClass: best.matchClass,
        matchScore: best.score,
        path: String(row.file_path ?? ''),
        phrases,
        score: Math.min(1, best.score + importanceWeight * IMPORTANCE_WEIGHT + recency * RECENCY_WEIGHT),
        specFolder: row.spec_folder ?? null,
        updatedAt: row.updated_at ?? null,
      };
    })
    .filter((row) => row !== null)
    .sort((a, b) => {
      const scoreDelta = b.score - a.score;
      if (scoreDelta !== 0) return scoreDelta;
      return (Date.parse(String(b.updatedAt ?? b.createdAt ?? '')) || 0)
        - (Date.parse(String(a.updatedAt ?? a.createdAt ?? '')) || 0);
    });

  // The shipped lane always slices. An unwindowed replay is a diagnostic pass
  // whose whole purpose is to see past the cut, so it keeps every scored row.
  return {
    candidateLimit,
    candidateRowCount: rows.length,
    normalizedQuery,
    results: windowed ? scored.slice(0, limit) : scored,
    saturated: candidateLimit !== null && rows.length >= candidateLimit,
    sql: { activeRow, candidateLimit },
    tokens,
  };
}
