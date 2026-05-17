// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Rescue
// ───────────────────────────────────────────────────────────────
// Default-on candidate rescue layer for trigger-rich paraphrase queries.

import type Database from 'better-sqlite3';

import { resolveEffectiveScore } from '../pipeline/types.js';
import type { PipelineRow } from '../pipeline/types.js';

type RescueOptions = {
  db?: Database.Database | null;
  artifactClass?: string | null;
  maxSiblingsPerFolder?: number;
};

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

function envFlagExplicitFalse(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === 'false';
}

export function isRetrievalRescueEnabled(): boolean {
  return !envFlagExplicitFalse('SPECKIT_RERANK_LAYER');
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
  const docType = normalizeText(row.document_type);
  let score = 0;
  for (const hint of DOCUMENT_HINTS) {
    if (!hint.types.map(normalizeText).includes(docType)) continue;
    if (hint.terms.some((term) => tokens.includes(term))) {
      score = Math.max(score, hint.weight);
    }
  }
  if (artifactClass && normalizeText(artifactClass).includes('decision') && docType === 'decision record') {
    score = Math.max(score, 0.24);
  }
  return score;
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
      WHERE ${clauses.join(' OR ')}
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

function hydrateCandidateRows(db: Database.Database, rows: PipelineRow[]): PipelineRow[] {
  if (rows.length === 0) return rows;
  const stmt = db.prepare('SELECT *, content_text AS content FROM memory_index WHERE id = ?');
  return rows.map((row) => {
    try {
      const hydrated = stmt.get(row.id) as PipelineRow | undefined;
      return hydrated ? mergeRicherRow(row, hydrated) : row;
    } catch {
      return row;
    }
  });
}

function mergeSiblingCandidates(query: string, rows: PipelineRow[], options: RescueOptions): PipelineRow[] {
  if (!options.db) return rows;
  const hydratedRows = hydrateCandidateRows(options.db, rows);
  const maxSiblingsPerFolder = options.maxSiblingsPerFolder ?? 8;
  const backfill = fetchLexicalBackfillRows(options.db, query);
  const siblings = fetchSiblingRows(options.db, [...hydratedRows, ...backfill], maxSiblingsPerFolder);
  if (siblings.length === 0 && backfill.length === 0) return hydratedRows;

  const byId = new Map<number, PipelineRow>();
  for (const row of hydratedRows) byId.set(row.id, row);

  for (const candidate of [...backfill, ...siblings]) {
    const existing = byId.get(candidate.id);
    if (existing) {
      byId.set(candidate.id, mergeRicherRow(existing, candidate));
      continue;
    }
    const rescue = lexicalScore(query, candidate, options.artifactClass);
    if (rescue.score < 0.24) continue;
    byId.set(candidate.id, {
      ...candidate,
      retrievalRescueSibling: true,
    });
  }

  return Array.from(byId.values());
}

export function applyRetrievalRescueLayer(
  query: string,
  rows: PipelineRow[],
  options: RescueOptions = {},
): PipelineRow[] {
  if (!isRetrievalRescueEnabled() || rows.length === 0) return rows;

  const expanded = mergeSiblingCandidates(query, rows, options);
  const rescued = expanded.map((row): ScoredRow => {
    const baseScore = resolveEffectiveScore(row);
    const rescue = lexicalScore(query, row, options.artifactClass);
    const score = Math.min(0.82, Math.min(baseScore, 1) * 0.03 + rescue.score * 0.78);
    const boost = Math.max(0, score - baseScore);
    return {
      ...syncScore(row, score),
      retrievalRescueScore: rescue.score,
      retrievalRescueBoost: boost,
      retrievalRescueSignals: rescue.signals,
    };
  });

  return rescued.sort((a, b) => {
    const scoreDelta = resolveEffectiveScore(b) - resolveEffectiveScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    const aRescue = a.retrievalRescueScore ?? 0;
    const bRescue = b.retrievalRescueScore ?? 0;
    if (bRescue !== aRescue) return bRescue - aRescue;
    return a.id - b.id;
  });
}

export const __testables = {
  queryTokens,
  lexicalScore,
  parseTriggerPhrases,
  mergeSiblingCandidates,
};
