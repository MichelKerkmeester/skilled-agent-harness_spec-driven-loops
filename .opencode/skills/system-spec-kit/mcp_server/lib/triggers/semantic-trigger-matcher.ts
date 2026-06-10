// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Trigger Matcher
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';

import {
  computeContentHash,
  getActiveEmbeddingProfileKey,
} from '../cache/embedding-cache.js';
import { normalizeTriggerText } from '../parsing/trigger-matcher.js';
import * as embeddings from '../providers/embeddings.js';

type TriggerEmbeddingInputKind = 'document';
type QueryEmbeddingInputKind = 'query';

export interface SemanticTriggerCacheEntry {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
  phrase: string;
  phraseHash: string;
  embedding: Float32Array;
}

export interface SemanticMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
  matchedPhrases: string[];
  score: number;
  source: 'semantic-trigger-shadow';
}

export interface SemanticTriggerMatcherOptions {
  threshold?: number;
  margin?: number;
  max?: number;
}

export interface SemanticTriggerCacheOptions {
  ttlMs?: number;
  forceRefresh?: boolean;
  profileKey?: string;
  modelId?: string;
  dimensions?: number;
}

export interface SemanticTriggerShadowStats {
  enabled: boolean;
  status: 'disabled' | 'computed' | 'no_query_embedding' | 'no_trigger_embeddings' | 'failed';
  lexicalCount: number;
  semanticCount: number;
  overlapCount: number;
  topScore: number | null;
  latencyMs: number;
  error?: string;
}

interface TriggerEmbeddingRow {
  memory_id: number;
  spec_folder: string;
  file_path: string;
  title: string | null;
  trigger_phrases: string | null;
  importance_weight: number | null;
  phrase_hash: string;
  embedding: Buffer;
}

interface SemanticTriggerCacheState {
  loadedAt: number;
  profileKey: string;
  modelId: string;
  dimensions: number;
  rows: SemanticTriggerCacheEntry[];
}

const SEMANTIC_TRIGGER_FLAG = 'SPECKIT_SEMANTIC_TRIGGERS';
const DEFAULT_THRESHOLD = 0.84;
const DEFAULT_MARGIN = 0.04;
const DEFAULT_MAX = 10;
const DEFAULT_CACHE_TTL_MS = 60_000;
const ACTIVE_VECTOR_SCHEMA = 'active_vec';
const semanticTriggerCacheByDb = new Map<Database.Database, SemanticTriggerCacheState>();

function isTruthyOptIn(value: string | undefined): boolean {
  return ['true', '1', 'yes', 'on', 'enabled'].includes(value?.trim().toLowerCase() ?? '');
}

/** Returns whether semantic trigger shadow scoring is explicitly enabled. */
export function isSemanticTriggerShadowEnabled(): boolean {
  return isTruthyOptIn(process.env[SEMANTIC_TRIGGER_FLAG]);
}

function readPositiveNumberEnv(name: string, fallback: number): number {
  const parsed = Number.parseFloat(process.env[name] ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function resolveMatcherOptions(options: SemanticTriggerMatcherOptions = {}): Required<SemanticTriggerMatcherOptions> {
  return {
    threshold: options.threshold ?? readPositiveNumberEnv('SPECKIT_SEMANTIC_TRIGGER_THRESHOLD', DEFAULT_THRESHOLD),
    margin: options.margin ?? readPositiveNumberEnv('SPECKIT_SEMANTIC_TRIGGER_MARGIN', DEFAULT_MARGIN),
    max: Math.max(1, Math.floor(options.max ?? readPositiveIntegerEnv('SPECKIT_SEMANTIC_TRIGGER_MAX', DEFAULT_MAX))),
  };
}

function resolveCacheTtlMs(options: SemanticTriggerCacheOptions): number {
  return Math.max(
    1,
    Math.floor(options.ttlMs ?? readPositiveIntegerEnv('SPECKIT_SEMANTIC_TRIGGER_CACHE_TTL_MS', DEFAULT_CACHE_TTL_MS)),
  );
}

function bufferToFloat32(buffer: Buffer): Float32Array {
  const copy = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(copy);
  for (let index = 0; index < buffer.length; index += 1) {
    view[index] = buffer[index];
  }
  return new Float32Array(copy);
}

function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index += 1) {
    const valueA = a[index];
    const valueB = b[index];
    dotProduct += valueA * valueB;
    normA += valueA * valueA;
    normB += valueB * valueB;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

function parseTriggerPhraseByHash(raw: string | null): Map<string, string> {
  const phrases = new Map<string, string>();
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return phrases;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return phrases;
    }
    for (const value of parsed) {
      if (typeof value !== 'string') {
        continue;
      }
      const normalized = normalizeTriggerText(value);
      if (normalized) {
        phrases.set(computeContentHash(normalized), normalized);
      }
    }
  } catch {
    return phrases;
  }

  return phrases;
}

function hasAttachedActiveVectorSchema(database: Database.Database): boolean {
  return (database.prepare('PRAGMA database_list').all() as Array<{ name?: string }>)
    .some((entry) => entry.name === ACTIVE_VECTOR_SCHEMA);
}

function embeddingCacheTable(database: Database.Database): string {
  return hasAttachedActiveVectorSchema(database) ? `${ACTIVE_VECTOR_SCHEMA}.embedding_cache` : 'embedding_cache';
}

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(
    "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?",
  ).get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function resolveTriggerProfile(database: Database.Database, options: SemanticTriggerCacheOptions): {
  profileKey: string;
  modelId: string;
  dimensions: number;
} {
  if (options.profileKey && options.modelId && options.dimensions) {
    return {
      profileKey: options.profileKey,
      modelId: options.modelId,
      dimensions: options.dimensions,
    };
  }

  const profile = embeddings.getEmbeddingProfile() as { provider?: string; model?: string; dim?: number } | null;
  const modelId = options.modelId ?? profile?.model ?? embeddings.getModelName();
  const dimensions = options.dimensions ?? profile?.dim ?? embeddings.getEmbeddingDimension();
  const metadataProfileKey = getActiveEmbeddingProfileKey(database);
  const profileKey = options.profileKey
    ?? (metadataProfileKey || (profile?.provider && profile?.model && profile?.dim
      ? `${profile.provider}:${profile.model}:${profile.dim}`
      : getActiveEmbeddingProfileKey(database, modelId, dimensions)));

  return { profileKey, modelId, dimensions };
}

function loadTriggerRows(
  database: Database.Database,
  profileKey: string,
  modelId: string,
  dimensions: number,
): TriggerEmbeddingRow[] {
  if (!tableExists(database, 'memory_trigger_embeddings')) {
    return [];
  }

  return database.prepare(`
    SELECT
      te.memory_id,
      mi.spec_folder,
      mi.file_path,
      mi.title,
      mi.trigger_phrases,
      mi.importance_weight,
      te.phrase_hash,
      ec.embedding
    FROM memory_trigger_embeddings AS te
    JOIN memory_index AS mi ON mi.id = te.memory_id
    JOIN ${embeddingCacheTable(database)} AS ec
      ON ec.content_hash = te.phrase_hash
     AND ec.profile_key = te.profile_key
     AND ec.input_kind = te.input_kind
     AND ec.model_id = te.model_id
     AND ec.dimensions = te.dimensions
    WHERE te.profile_key = ?
      AND te.input_kind = ?
      AND te.model_id = ?
      AND te.dimensions = ?
      AND te.embedding_status = 'ready'
    ORDER BY te.memory_id ASC, te.phrase_hash ASC
  `).all(profileKey, 'document' satisfies TriggerEmbeddingInputKind, modelId, dimensions) as TriggerEmbeddingRow[];
}

/** Clears the semantic trigger embedding cache for one database or all databases. */
export function clearSemanticTriggerCache(database?: Database.Database): void {
  if (database) {
    semanticTriggerCacheByDb.delete(database);
    return;
  }
  semanticTriggerCacheByDb.clear();
}

/** Loads ready trigger embeddings from the existing derived table and embedding cache. */
export function loadSemanticTriggerCache(
  database: Database.Database,
  options: SemanticTriggerCacheOptions = {},
): SemanticTriggerCacheEntry[] {
  const { profileKey, modelId, dimensions } = resolveTriggerProfile(database, options);
  if (!profileKey || !modelId || !Number.isFinite(dimensions) || dimensions <= 0) {
    return [];
  }

  const now = Date.now();
  const cached = semanticTriggerCacheByDb.get(database);
  if (
    cached
    && !options.forceRefresh
    && cached.profileKey === profileKey
    && cached.modelId === modelId
    && cached.dimensions === dimensions
    && now - cached.loadedAt < resolveCacheTtlMs(options)
  ) {
    return cached.rows;
  }

  const rows = loadTriggerRows(database, profileKey, modelId, dimensions);
  const cacheRows: SemanticTriggerCacheEntry[] = [];
  for (const row of rows) {
    const phraseByHash = parseTriggerPhraseByHash(row.trigger_phrases);
    const phrase = phraseByHash.get(row.phrase_hash);
    if (!phrase) {
      continue;
    }
    cacheRows.push({
      memoryId: row.memory_id,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      title: row.title,
      importanceWeight: row.importance_weight ?? 0.5,
      phrase,
      phraseHash: row.phrase_hash,
      embedding: bufferToFloat32(row.embedding),
    });
  }

  semanticTriggerCacheByDb.set(database, {
    loadedAt: now,
    profileKey,
    modelId,
    dimensions,
    rows: cacheRows,
  });
  return cacheRows;
}

/** Reads a cached query embedding without generating or storing anything. */
export function lookupCachedQueryEmbedding(
  database: Database.Database,
  prompt: string,
  options: SemanticTriggerCacheOptions = {},
): Float32Array | null {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return null;
  }

  const { profileKey, modelId, dimensions } = resolveTriggerProfile(database, options);
  if (!profileKey || !modelId || !Number.isFinite(dimensions) || dimensions <= 0) {
    return null;
  }

  const row = database.prepare(`
    SELECT embedding
    FROM ${embeddingCacheTable(database)}
    WHERE content_hash = ?
      AND profile_key = ?
      AND input_kind = ?
      AND model_id = ?
      AND dimensions = ?
    LIMIT 1
  `).get(
    computeContentHash(trimmedPrompt),
    profileKey,
    'query' satisfies QueryEmbeddingInputKind,
    modelId,
    dimensions,
  ) as { embedding?: Buffer } | undefined;

  return row?.embedding ? bufferToFloat32(row.embedding) : null;
}

/** Matches a prompt embedding against cached trigger embeddings with deterministic gates. */
export function matchSemanticTriggers(
  promptEmbedding: Float32Array | number[],
  triggerCache: readonly SemanticTriggerCacheEntry[],
  options: SemanticTriggerMatcherOptions = {},
): SemanticMatch[] {
  const config = resolveMatcherOptions(options);
  const byMemory = new Map<number, SemanticMatch>();

  for (const entry of triggerCache) {
    const score = cosineSimilarity(promptEmbedding, entry.embedding);
    if (score < config.threshold) {
      continue;
    }

    const existing = byMemory.get(entry.memoryId);
    if (!existing || score > existing.score) {
      byMemory.set(entry.memoryId, {
        memoryId: entry.memoryId,
        specFolder: entry.specFolder,
        filePath: entry.filePath,
        title: entry.title,
        importanceWeight: entry.importanceWeight,
        matchedPhrases: [entry.phrase],
        score,
        source: 'semantic-trigger-shadow',
      });
      continue;
    }

    if (existing && score === existing.score) {
      existing.matchedPhrases.push(entry.phrase);
      existing.matchedPhrases.sort((left, right) => left.localeCompare(right));
    }
  }

  const sorted = [...byMemory.values()].sort((left, right) => {
    const scoreDiff = right.score - left.score;
    return scoreDiff !== 0 ? scoreDiff : left.memoryId - right.memoryId;
  });

  if (sorted.length > 1 && sorted[0].score - sorted[1].score < config.margin) {
    return [];
  }

  return sorted.slice(0, config.max);
}

/** Computes shadow-only semantic trigger stats without modifying lexical results. */
export function computeSemanticTriggerShadow(
  database: Database.Database,
  prompt: string,
  lexicalMemoryIds: readonly number[],
  options: SemanticTriggerMatcherOptions & SemanticTriggerCacheOptions = {},
): SemanticTriggerShadowStats {
  const startTime = Date.now();
  if (!isSemanticTriggerShadowEnabled()) {
    return {
      enabled: false,
      status: 'disabled',
      lexicalCount: lexicalMemoryIds.length,
      semanticCount: 0,
      overlapCount: 0,
      topScore: null,
      latencyMs: 0,
    };
  }

  try {
    const queryEmbedding = lookupCachedQueryEmbedding(database, prompt, options);
    if (!queryEmbedding) {
      return {
        enabled: true,
        status: 'no_query_embedding',
        lexicalCount: lexicalMemoryIds.length,
        semanticCount: 0,
        overlapCount: 0,
        topScore: null,
        latencyMs: Date.now() - startTime,
      };
    }

    const triggerCache = loadSemanticTriggerCache(database, options);
    if (triggerCache.length === 0) {
      return {
        enabled: true,
        status: 'no_trigger_embeddings',
        lexicalCount: lexicalMemoryIds.length,
        semanticCount: 0,
        overlapCount: 0,
        topScore: null,
        latencyMs: Date.now() - startTime,
      };
    }

    const matches = matchSemanticTriggers(queryEmbedding, triggerCache, options);
    const lexicalSet = new Set(lexicalMemoryIds);
    const overlapCount = matches.filter((match) => lexicalSet.has(match.memoryId)).length;
    return {
      enabled: true,
      status: 'computed',
      lexicalCount: lexicalMemoryIds.length,
      semanticCount: matches.length,
      overlapCount,
      topScore: matches[0]?.score ?? null,
      latencyMs: Date.now() - startTime,
    };
  } catch (error: unknown) {
    return {
      enabled: true,
      status: 'failed',
      lexicalCount: lexicalMemoryIds.length,
      semanticCount: 0,
      overlapCount: 0,
      topScore: null,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export const __testables = {
  bufferToFloat32,
  cosineSimilarity,
  parseTriggerPhraseByHash,
  resolveMatcherOptions,
};
