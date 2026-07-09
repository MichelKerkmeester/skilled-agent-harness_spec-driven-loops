// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Rescue
// ───────────────────────────────────────────────────────────────
// Default-on candidate rescue layer for trigger-rich paraphrase queries.

import type Database from 'better-sqlite3';

import { resolveEffectiveScore } from '../pipeline/types.js';
import type { PipelineRow } from '../pipeline/types.js';
import { createScopeFilterPredicate } from '../../governance/scope-governance.js';
import type { ScopeContext } from '../../governance/scope-governance.js';
import { createLogger } from '../../utils/logger.js';
import { ACTIVE_ROW_SQL, isActiveRow } from '../active-row-predicate.js';
import { fts5Bm25Search, isFts5Available } from '../sqlite-fts.js';
import { parseFlagTristate } from '../search-flags.js';

type RescueOptions = {
  db?: Database.Database | null;
  artifactClass?: string | null;
  maxSiblingsPerFolder?: number;
  // Scope/folder boundary for newly-injected rescue rows. Stage-1 already
  // scoped the inbound rows, but the lexical-backfill and sibling fetches below
  // re-query the index and would otherwise smuggle cross-scope rows back in.
  scopeFilter?: ScopeContext;
  specFolder?: string;
  tier?: string;
  contextType?: string;
  qualityThreshold?: number;
};

type RescueRankingMode = 'overwrite' | 'additive' | 'floor';
type BackfillRoute = 'fts' | 'like' | 'none';

type ScoredRow = PipelineRow & {
  retrievalRescueScore?: number;
  retrievalRescueBoost?: number;
  retrievalRescueSignals?: string[];
};

const STOPWORDS = new Set([
  'about', 'after', 'against', 'and', 'are', 'but', 'for', 'from', 'into',
  'that', 'the', 'their', 'then', 'this', 'with', 'without', 'across', 'under',
  'over', 'instead', 'covering', 'covers',
]);

const GENERIC_TRIGGER_TOKENS = new Set([
  'checklist',
  'decision',
  'feature',
  'implementation',
  'plan',
  'record',
  'research',
  'spec',
  'specification',
  'summary',
  'task',
  'tasks',
  'verification',
]);

const DOCUMENT_HINTS: Array<{ terms: string[]; types: string[]; weight: number }> = [
  { terms: ['adr', 'decision', 'decisions', 'rationale'], types: ['decision_record'], weight: 0.22 },
  { terms: ['task', 'tasks', 'todo'], types: ['tasks'], weight: 0.18 },
  { terms: ['checklist', 'verification'], types: ['checklist'], weight: 0.18 },
  { terms: ['implementation', 'summary', 'implemented'], types: ['implementation_summary'], weight: 0.18 },
  { terms: ['research', 'packet', 'spec', 'specification'], types: ['spec', 'research'], weight: 0.16 },
  { terms: ['plan', 'planner', 'planning'], types: ['plan'], weight: 0.14 },
];

const SIBLING_DOCUMENT_TYPES = [
  'spec',
  'decision_record',
  'implementation_summary',
  'tasks',
  'checklist',
  'plan',
  'research',
];

const RESCUE_SCORE_CAP = 1.0;
const RESCUE_TOP_K = 10;
const RESCUE_ADDITIVE_WEIGHT = 0.12;
const RESCUE_FLOOR_BASE_THRESHOLD = 0.24;
const RESCUE_SOFT_GATE_PENALTY = 0.7;
const RESCUE_HYDRATION_CHUNK_SIZE = 500;
const RESCUE_BACKFILL_MIN_CANDIDATES = 5;
const RESCUE_BACKFILL_MIN_LEXICAL_SCORE = 0.24;
const logger = createLogger('retrieval-rescue');

const telemetryCounters = {
  rescueRuns: 0,
  rescueTopKHits: 0,
};

function envFlagExplicitFalse(name: string): boolean {
  // defaultValue=true means this only returns false when the raw value is a
  // recognized opt-out member, so the negation below is true only for that case.
  return !parseFlagTristate(name, true);
}

function hasQueryableDb(db: Database.Database | null | undefined): db is Database.Database {
  return Boolean(db && typeof (db as { prepare?: unknown }).prepare === 'function');
}

/**
 * Reports whether the retrieval-rescue layer should run for the current process.
 * @returns True unless the rescue layer is explicitly disabled by environment.
 */
export function isRetrievalRescueEnabled(): boolean {
  return !envFlagExplicitFalse('SPECKIT_RERANK_LAYER');
}

function resolveRescueRankingMode(): RescueRankingMode {
  const raw = process.env.SPECKIT_RETRIEVAL_RESCUE_MODE?.trim().toLowerCase();
  if (raw === 'additive' || raw === 'floor' || raw === 'overwrite') return raw;
  return 'overwrite';
}

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function queryTokens(query: string): string[] {
  const compactRawTokens = Array.from(query.toLowerCase().matchAll(/[a-z]+[-_/]\d+|[a-z0-9]+(?:[-_/][a-z0-9]+)+/g))
    .map((match) => match[0].replace(/[^a-z0-9]+/g, ''))
    .filter((token) => token.length >= 4);
  return Array.from(new Set([
    ...normalizeText(query)
      .split(' ')
      .filter((token) => token.length >= 3 && !STOPWORDS.has(token)),
    ...compactRawTokens,
  ]));
}

function importantTokens(tokens: string[]): string[] {
  return tokens.filter((token) => token.length >= 5 || /\d/.test(token));
}

function parseTriggerPhrases(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value !== 'string' || value.trim().length === 0) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // Fall through to legacy comma/newline parsing.
  }
  return value
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function rowText(row: PipelineRow): string {
  const content = typeof row.content === 'string'
    ? row.content
    : typeof row.content_text === 'string'
      ? row.content_text
      : typeof row.precomputedContent === 'string'
        ? row.precomputedContent
        : '';
  return [
    row.title,
    row.file_path,
    row.spec_folder,
    row.document_type,
    row.context_type ?? row.contextType,
    parseTriggerPhrases(row.trigger_phrases ?? row.triggerPhrases).join(' '),
    content.slice(0, 4000),
  ].filter(Boolean).join(' ');
}

function phraseScore(query: string, phrases: string[]): number {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery || phrases.length === 0) return 0;

  let best = 0;
  const queryTokenSet = new Set(queryTokens(query));
  for (const phrase of phrases) {
    const normalizedPhrase = normalizeText(phrase);
    if (!normalizedPhrase) continue;
    const phraseTokens = new Set(
      queryTokens(normalizedPhrase)
        .filter((token) => !GENERIC_TRIGGER_TOKENS.has(token) || /\d/.test(token))
    );
    if (phraseTokens.size === 0) continue;
    if (normalizedPhrase === normalizedQuery) {
      best = Math.max(best, 1);
      continue;
    }
    if (normalizedQuery.includes(normalizedPhrase)) {
      best = Math.max(best, phraseTokens.size === 1 ? 0.35 : 0.92);
      continue;
    }
    if (normalizedPhrase.includes(normalizedQuery)) {
      best = Math.max(best, phraseTokens.size === 1 ? 0.32 : 0.86);
      continue;
    }
    const overlap = Array.from(phraseTokens).filter((token) => queryTokenSet.has(token)).length;
    const coverage = overlap / Math.max(1, phraseTokens.size);
    best = Math.max(best, coverage);
  }
  return best;
}

function documentHintScore(tokens: string[], row: PipelineRow, artifactClass?: string | null): number {
  const docType = String(row.document_type ?? '').toLowerCase().trim();
  const searchableDocType = normalizeText(row.document_type);
  let score = 0;
  for (const hint of DOCUMENT_HINTS) {
    if (!hint.types.some((type) => type === docType || normalizeText(type) === searchableDocType)) continue;
    if (hint.terms.some((term) => tokens.includes(term))) {
      score = Math.max(score, hint.weight);
    }
  }
  if (artifactClass && normalizeText(artifactClass).includes('decision') && docType === 'decision_record') {
    score = Math.max(score, 0.24);
  }
  return score;
}

function computeRescueLayerScore(
  baseScore: number,
  rescueScore: number,
  mode: RescueRankingMode = resolveRescueRankingMode(),
): number {
  const normalizedBase = Math.min(baseScore, 1);
  if (mode === 'additive') {
    return Math.min(RESCUE_SCORE_CAP, normalizedBase + rescueScore * RESCUE_ADDITIVE_WEIGHT);
  }

  if (mode === 'floor' && normalizedBase >= RESCUE_FLOOR_BASE_THRESHOLD) {
    return normalizedBase;
  }

  // Keep RESCUE_SCORE_CAP clamp as defense-in-depth even though the
  // formula ceiling (0.03 + 0.78 = 0.81) is below the 1.0 cap with rescueScore
  // bounded to [0,1] at the lexicalScore site. The cap exists in case the
  // formula or input bounds change in the future.
  const uncapped = normalizedBase * 0.03 + rescueScore * 0.78;
  return Math.min(RESCUE_SCORE_CAP, uncapped);
}

function lexicalScore(query: string, row: PipelineRow, artifactClass?: string | null): { score: number; signals: string[] } {
  const tokens = queryTokens(query);
  const focused = importantTokens(tokens);
  const text = normalizeText(rowText(row));
  const compactText = text.replace(/\s+/g, '');
  const textTokenSet = new Set(text.split(' ').filter(Boolean));
  const matched = focused.filter((token) => textTokenSet.has(token) || text.includes(token) || compactText.includes(token));
  const tokenCoverage = focused.length > 0 ? matched.length / focused.length : 0;
  const triggerCoverage = phraseScore(query, parseTriggerPhrases(row.trigger_phrases ?? row.triggerPhrases));
  const docHint = documentHintScore(tokens, row, artifactClass);
  const titlePath = normalizeText(`${row.title ?? ''} ${row.file_path ?? ''} ${row.spec_folder ?? ''}`);
  const titlePathMatches = focused.filter((token) => titlePath.includes(token)).length;
  const titleOrPathHit = Math.min(0.16, titlePathMatches * 0.04);
  const qualityPenalty = row.importance_tier === 'deprecated' ? -0.08 : 0;
  const archivePenalty = !tokens.includes('archive') && /\bz_archive\b/.test(String(row.file_path ?? row.spec_folder ?? ''))
    ? -0.16
    : 0;
  const score = Math.max(0, Math.min(1, tokenCoverage * 0.58 + triggerCoverage * 0.22 + docHint + titleOrPathHit + qualityPenalty + archivePenalty));
  const signals = [
    tokenCoverage >= 0.25 ? `token:${tokenCoverage.toFixed(2)}` : null,
    triggerCoverage >= 0.25 ? `trigger:${triggerCoverage.toFixed(2)}` : null,
    docHint > 0 ? `doc:${docHint.toFixed(2)}` : null,
    titleOrPathHit > 0 ? `title-path:${titleOrPathHit.toFixed(2)}` : null,
  ].filter((signal): signal is string => Boolean(signal));
  return { score, signals };
}

function mergeRicherRow(existing: PipelineRow, candidate: PipelineRow): PipelineRow {
  const firstString = (...values: unknown[]): string | undefined =>
    values.find((value): value is string => typeof value === 'string');
  return {
    ...candidate,
    ...existing,
    content: firstString(existing.content, candidate.content, candidate.content_text),
    content_text: firstString(existing.content_text, candidate.content_text, candidate.content),
    precomputedContent: firstString(existing.precomputedContent, candidate.precomputedContent),
    trigger_phrases: firstString(existing.trigger_phrases, candidate.trigger_phrases),
    triggerPhrases: firstString(existing.triggerPhrases, candidate.triggerPhrases),
    document_type: firstString(existing.document_type, candidate.document_type),
    spec_folder: firstString(existing.spec_folder, candidate.spec_folder),
    file_path: firstString(existing.file_path, candidate.file_path),
    title: firstString(existing.title, candidate.title),
  };
}

function syncScore(row: PipelineRow, score: number): ScoredRow {
  return {
    ...row,
    score,
    rrfScore: score,
    intentAdjustedScore: score,
  };
}

function resolveContextType(row: PipelineRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) return row.contextType;
  if (typeof row.context_type === 'string' && row.context_type.length > 0) return row.context_type;
  return undefined;
}

function isExpired(row: PipelineRow): boolean {
  const raw = row.expires_at ?? row.delete_after;
  if (typeof raw !== 'string' || raw.trim().length === 0) return false;
  const timestamp = new Date(raw).getTime();
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function computeResidualGatePenalty(row: PipelineRow, options: RescueOptions): number {
  let penalty = 1;
  if (options.tier && row.importance_tier !== options.tier) penalty *= RESCUE_SOFT_GATE_PENALTY;
  if (options.contextType && resolveContextType(row) !== options.contextType) penalty *= RESCUE_SOFT_GATE_PENALTY;
  if (typeof options.qualityThreshold === 'number' && Number.isFinite(options.qualityThreshold)) {
    const quality = typeof row.quality_score === 'number' && Number.isFinite(row.quality_score)
      ? row.quality_score
      : 0;
    if (quality < options.qualityThreshold) penalty *= RESCUE_SOFT_GATE_PENALTY;
  }
  if (isExpired(row)) penalty *= RESCUE_SOFT_GATE_PENALTY;
  if (typeof row.embedding_status === 'string' && row.embedding_status !== 'success') {
    penalty *= RESCUE_SOFT_GATE_PENALTY;
  }
  return penalty;
}

function fetchSiblingRows(db: Database.Database, rows: PipelineRow[], maxPerFolder: number): PipelineRow[] {
  const folders = Array.from(new Set(
    rows
      .map((row) => row.spec_folder)
      .filter((folder): folder is string => typeof folder === 'string' && folder.length > 0)
  ));
  if (folders.length === 0) return [];

  const siblings: PipelineRow[] = [];
  const stmt = db.prepare(`
    SELECT *
    FROM memory_index
    WHERE spec_folder = ?
      AND ${ACTIVE_ROW_SQL('memory_index')}
      AND document_type IN (${SIBLING_DOCUMENT_TYPES.map(() => '?').join(',')})
    ORDER BY
      CASE document_type
        WHEN 'spec' THEN 0
        WHEN 'decision_record' THEN 1
        WHEN 'implementation_summary' THEN 2
        WHEN 'tasks' THEN 3
        WHEN 'checklist' THEN 4
        WHEN 'plan' THEN 5
        ELSE 6
      END,
      id ASC
    LIMIT ?
  `);

  for (const folder of folders) {
    const rowsForFolder = stmt.all(folder, ...SIBLING_DOCUMENT_TYPES, maxPerFolder) as PipelineRow[];
    siblings.push(...rowsForFolder);
  }
  return siblings;
}

function fetchLexicalBackfillRows(db: Database.Database, query: string): PipelineRow[] {
  const route = resolveLexicalBackfillRoute(db, query);
  if (route === 'none') return [];
  if (route === 'fts') {
    const ftsRows = fetchFtsLexicalBackfillRows(db, query);
    if (ftsRows.length > 0) return ftsRows;
  }

  return fetchLikeLexicalBackfillRows(db, query);
}

function resolveLexicalBackfillRoute(db: Database.Database, query: string): BackfillRoute {
  const tokens = importantTokens(queryTokens(query)).slice(0, 10);
  if (tokens.length === 0) return 'none';
  if (!canUseFtsBackfillRoute(query, tokens)) return 'like';
  return isFts5Available(db) ? 'fts' : 'like';
}

function canUseFtsBackfillRoute(query: string, tokens: string[]): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;
  if (!/^[\x00-\x7F]*$/.test(trimmed)) return false;
  if (/['"()^*:]/.test(trimmed)) return false;
  if (/\b(?:NEAR|OR|AND|NOT)\b/i.test(trimmed)) return false;
  if (/(^|\s)-\S/.test(trimmed)) return false;
  return tokens.length > 0 && tokens.every((token) => /^[a-z0-9_]+$/.test(token));
}

function fetchFtsLexicalBackfillRows(db: Database.Database, query: string): PipelineRow[] {
  try {
    const ftsRows = fts5Bm25Search(db, query, { limit: 250 });
    const ids = ftsRows
      .map((row) => row.id)
      .filter((id): id is number => Number.isInteger(id));
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    return db.prepare(`
      SELECT *, content_text AS content
      FROM memory_index
      WHERE id IN (${placeholders})
        AND ${ACTIVE_ROW_SQL('memory_index')}
      ORDER BY
        CASE document_type
          WHEN 'decision_record' THEN 0
          WHEN 'implementation_summary' THEN 1
          WHEN 'tasks' THEN 2
          WHEN 'spec' THEN 3
          WHEN 'checklist' THEN 4
          WHEN 'plan' THEN 5
          ELSE 6
        END,
        quality_score DESC,
        id ASC
      LIMIT 250
    `).all(...ids) as PipelineRow[];
  } catch {
    return [];
  }
}

function fetchLikeLexicalBackfillRows(db: Database.Database, query: string): PipelineRow[] {
  const tokens = importantTokens(queryTokens(query)).slice(0, 10);
  if (tokens.length === 0) return [];

  const clauses = tokens.map(() => `
    LOWER(COALESCE(title, '') || ' ' || COALESCE(trigger_phrases, '') || ' ' || COALESCE(file_path, '') || ' ' || COALESCE(content_text, '')) LIKE ?
  `);
  const params = tokens.map((token) => `%${token}%`);

  try {
    return db.prepare(`
      SELECT *, content_text AS content
      FROM memory_index
      WHERE (${clauses.join(' OR ')})
        AND ${ACTIVE_ROW_SQL('memory_index')}
      ORDER BY
        CASE document_type
          WHEN 'decision_record' THEN 0
          WHEN 'implementation_summary' THEN 1
          WHEN 'tasks' THEN 2
          WHEN 'spec' THEN 3
          WHEN 'checklist' THEN 4
          WHEN 'plan' THEN 5
          ELSE 6
        END,
        quality_score DESC,
        id ASC
      LIMIT 250
    `).all(...params) as PipelineRow[];
  } catch {
    return [];
  }
}

function shouldRunLexicalBackfill(query: string, rows: PipelineRow[], artifactClass?: string | null): boolean {
  if (importantTokens(queryTokens(query)).length === 0) return false;
  if (rows.length < RESCUE_BACKFILL_MIN_CANDIDATES) return true;
  const bestLexicalScore = rows.reduce((best, row) => {
    const rescue = lexicalScore(query, row, artifactClass);
    return Math.max(best, rescue.score);
  }, 0);
  return bestLexicalScore < RESCUE_BACKFILL_MIN_LEXICAL_SCORE;
}

function hydrateCandidateRows(db: Database.Database, rows: PipelineRow[]): PipelineRow[] {
  if (rows.length === 0) return rows;
  const uniqueIds = Array.from(new Set(
    rows
      .map((row) => row.id)
      .filter((id): id is number => Number.isInteger(id))
  ));
  if (uniqueIds.length === 0) return rows.filter((row) => isActiveRow(row));

  const hydratedById = new Map<number, PipelineRow>();
  try {
    for (let index = 0; index < uniqueIds.length; index += RESCUE_HYDRATION_CHUNK_SIZE) {
      const chunk = uniqueIds.slice(index, index + RESCUE_HYDRATION_CHUNK_SIZE);
      const placeholders = chunk.map(() => '?').join(',');
      const fetched = db.prepare(`
        SELECT *, content_text AS content
        FROM memory_index
        WHERE id IN (${placeholders})
          AND ${ACTIVE_ROW_SQL('memory_index')}
      `).all(...chunk) as PipelineRow[];
      for (const hydrated of fetched) {
        hydratedById.set(hydrated.id, hydrated);
      }
    }
  } catch {
    return rows;
  }

  return rows.map((row) => {
    const hydrated = hydratedById.get(row.id);
    if (hydrated) return mergeRicherRow(row, hydrated);
    return isActiveRow(row) ? row : null;
  }).filter((row): row is PipelineRow => row !== null);
}

// Build a boundary gate for NEWLY-injected rescue rows, mirroring the
// scope/folder re-application that constitutional injection and the
// community fallback perform after their own re-queries. Returns null when
// no scope or folder constraint is in force (nothing to enforce).
function buildInjectionBoundary(options: RescueOptions): ((row: PipelineRow) => boolean) | null {
  const scopeFilter = options.scopeFilter;
  const hasScope = Boolean(scopeFilter && (scopeFilter.tenantId || scopeFilter.userId || scopeFilter.agentId));
  const scopePredicate = hasScope ? createScopeFilterPredicate<PipelineRow>(scopeFilter as ScopeContext) : null;
  const specFolder = options.specFolder;
  if (!scopePredicate && !specFolder) return null;

  return (row: PipelineRow): boolean => {
    if (scopePredicate && !scopePredicate(row)) return false;
    if (specFolder) {
      const folder = typeof row.spec_folder === 'string' ? row.spec_folder : '';
      // Same prefix rule the BM25 lane uses (hybrid-search.ts): exact folder
      // or a descendant path under it.
      if (folder !== specFolder && !folder.startsWith(specFolder + '/')) return false;
    }
    return true;
  };
}

function mergeSiblingCandidates(query: string, rows: PipelineRow[], options: RescueOptions): PipelineRow[] {
  if (!options.db) return rows;
  const hydratedRows = hydrateCandidateRows(options.db, rows);
  const maxSiblingsPerFolder = options.maxSiblingsPerFolder ?? 8;
  const backfill = shouldRunLexicalBackfill(query, hydratedRows, options.artifactClass)
    ? fetchLexicalBackfillRows(options.db, query)
    : [];
  const siblings = fetchSiblingRows(options.db, [...hydratedRows, ...backfill], maxSiblingsPerFolder);
  if (siblings.length === 0 && backfill.length === 0) return hydratedRows;

  const byId = new Map<number, PipelineRow>();
  for (const row of hydratedRows) byId.set(row.id, row);

  // Newly-injected backfill/sibling rows bypass the Stage-1 scope gate, so
  // re-apply scope/folder boundaries to them only. Existing-id merges already
  // passed Stage-1 scoping and are left untouched.
  const passesBoundary = buildInjectionBoundary(options);

  for (const candidate of [...backfill, ...siblings]) {
    const existing = byId.get(candidate.id);
    if (existing) {
      byId.set(candidate.id, mergeRicherRow(existing, candidate));
      continue;
    }
    if (passesBoundary && !passesBoundary(candidate)) continue;
    const rescue = lexicalScore(query, candidate, options.artifactClass);
    if (rescue.score < 0.24) continue;
    byId.set(candidate.id, {
      ...candidate,
      retrievalRescueSibling: true,
    });
  }

  return Array.from(byId.values());
}

/**
 * Applies lexical trigger and sibling-document rescue scoring to candidate rows.
 * @returns Rows sorted by effective score after rescue metadata is attached.
 */
export function applyRetrievalRescueLayer(
  query: string,
  rows: PipelineRow[],
  options: RescueOptions = {},
): PipelineRow[] {
  if (!isRetrievalRescueEnabled() || rows.length === 0) return rows;
  if (options.db && !hasQueryableDb(options.db)) return rows;

  const mode = resolveRescueRankingMode();
  const expanded = mergeSiblingCandidates(query, rows, options);
  const rescued = expanded.map((row): ScoredRow => {
    const baseScore = resolveEffectiveScore(row);
    const rescue = lexicalScore(query, row, options.artifactClass);
    // Rescue candidates should compete after the outer normalization
    // clamp, not be held below original-lane candidates by a local 0.82 cap.
    const score = computeRescueLayerScore(baseScore, rescue.score, mode);
    const penalty = row.retrievalRescueSibling === true
      ? computeResidualGatePenalty(row, options)
      : 1;
    const gatedScore = Math.max(0, Math.min(1, score * penalty));
    const boost = Math.max(0, gatedScore - baseScore);
    return {
      ...syncScore(row, gatedScore),
      retrievalRescueScore: rescue.score,
      retrievalRescueBoost: boost,
      retrievalRescueSignals: rescue.signals,
      ...(penalty < 1 ? { retrievalRescueSoftGatePenalty: penalty } : {}),
    };
  });

  const sorted = rescued.sort((a, b) => {
    const scoreDelta = resolveEffectiveScore(b) - resolveEffectiveScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    const aRescue = a.retrievalRescueScore ?? 0;
    const bRescue = b.retrievalRescueScore ?? 0;
    if (bRescue !== aRescue) return bRescue - aRescue;
    return a.id - b.id;
  });

  telemetryCounters.rescueRuns += 1;
  const topKHits = sorted
    .slice(0, RESCUE_TOP_K)
    .filter((row) => (row.retrievalRescueBoost ?? 0) > 0).length;
  telemetryCounters.rescueTopKHits += topKHits;
  logger.debug('retrieval rescue summary', {
    event: 'retrieval_rescue_hit_rate',
    topK: RESCUE_TOP_K,
    topKHits,
    hitRate: topKHits / Math.max(1, Math.min(RESCUE_TOP_K, sorted.length)),
    cumulativeRuns: telemetryCounters.rescueRuns,
    cumulativeTopKHits: telemetryCounters.rescueTopKHits,
  });

  return sorted;
}

export const __testables = {
  queryTokens,
  lexicalScore,
  computeRescueLayerScore,
  resolveRescueRankingMode,
  telemetryCounters,
  resetTelemetryCounters: () => {
    telemetryCounters.rescueRuns = 0;
    telemetryCounters.rescueTopKHits = 0;
  },
  parseTriggerPhrases,
  mergeSiblingCandidates,
  buildInjectionBoundary,
  fetchLexicalBackfillRows,
  fetchFtsLexicalBackfillRows,
  fetchLikeLexicalBackfillRows,
  resolveLexicalBackfillRoute,
  canUseFtsBackfillRoute,
  hydrateCandidateRows,
  shouldRunLexicalBackfill,
  hasQueryableDb,
};
