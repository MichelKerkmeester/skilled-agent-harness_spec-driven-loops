// ───────────────────────────────────────────────────────────────────
// MODULE: Memory DB Fixture
// ───────────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

import { getIndex, resetIndex } from '../../lib/search/bm25-index.js';
import * as hybridSearch from '../../lib/search/hybrid-search.js';
import * as vectorIndex from '../../lib/search/vector-index.js';
import { init as initAccessTracker, dispose as disposeAccessTracker } from '../../lib/storage/access-tracker.js';

interface SeedMemoryRowInput {
  readonly id?: number;
  readonly specFolder?: string;
  readonly filePath?: string;
  readonly canonicalFilePath?: string;
  readonly anchorId?: string | null;
  readonly title?: string;
  readonly triggerPhrases?: string[];
  readonly contentText?: string;
  readonly importanceWeight?: number;
  readonly importanceTier?: string;
  readonly contextType?: string;
  readonly documentType?: string;
  readonly embedding?: Float32Array | number[];
  readonly embeddingStatus?: string;
  readonly qualityScore?: number;
  readonly stability?: number;
  readonly difficulty?: number;
  readonly reviewCount?: number;
  readonly accessCount?: number;
  readonly lastReview?: string | null;
  readonly lastAccessed?: number;
  readonly isArchived?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

interface SeedCausalEdgeInput {
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly sourceAnchor?: string | null;
  readonly targetAnchor?: string | null;
  readonly relation?: string;
  readonly strength?: number;
  readonly evidence?: string | null;
  readonly createdBy?: string;
}

interface SeededMemoryRow {
  readonly id: number;
  readonly specFolder: string;
  readonly filePath: string;
}

const DEFAULT_SPEC_FOLDER = '/tmp/specs/001-memory-fixture';
const DEFAULT_CREATED_AT = '2026-05-09T00:00:00.000Z';

function getEmbeddingDimension(): number {
  return vectorIndex.getEmbeddingDim();
}

function makeDefaultEmbedding(seed: number): Float32Array {
  const embedding = new Float32Array(getEmbeddingDimension());
  embedding[0] = 1;
  embedding[1] = seed;
  return embedding;
}

function normalizeEmbedding(embedding: Float32Array | number[]): Float32Array {
  return embedding instanceof Float32Array
    ? embedding
    : new Float32Array(embedding);
}

function upsertActiveProjection(
  db: Database.Database,
  memoryId: number,
  specFolder: string,
  canonicalFilePath: string,
  anchorId: string | null,
  updatedAt: string,
): void {
  const logicalKey = `${specFolder}:${canonicalFilePath}:${anchorId ?? ''}`;
  db.prepare(`
    INSERT OR REPLACE INTO memory_lineage (
      memory_id,
      logical_key,
      version_number,
      root_memory_id,
      predecessor_memory_id,
      superseded_by_memory_id,
      valid_from,
      valid_to,
      transition_event,
      actor,
      metadata,
      created_at
    ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, 'CREATE', 'vitest', '{}', ?)
  `).run(memoryId, logicalKey, memoryId, updatedAt, updatedAt);

  db.prepare(`
    INSERT OR REPLACE INTO active_memory_projection (
      logical_key,
      root_memory_id,
      active_memory_id,
      updated_at
    ) VALUES (?, ?, ?, ?)
  `).run(logicalKey, memoryId, memoryId, updatedAt);
}

function syncSearchAuxiliaryIndexes(
  db: Database.Database,
  memoryId: number,
  embedding: Float32Array | number[] | null,
): void {
  if (embedding) {
    db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
    db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)')
      .run(BigInt(memoryId), vectorIndex.to_embedding_buffer(normalizeEmbedding(embedding)));
  }

  getIndex().syncChangedRows(db, [memoryId]);
}

/** Create a fresh in-memory memory database using the production schema path. */
export function createMemoryDbFixture(): Database.Database {
  vectorIndex.closeDb();
  resetIndex();
  const db = vectorIndex.initializeDb(':memory:');
  hybridSearch.init(db, vectorIndex.vectorSearch);
  initAccessTracker(db);
  return db;
}

/** Close fixture state and clear process-level search caches used by production modules. */
export function disposeMemoryDbFixture(db: Database.Database): void {
  disposeAccessTracker();
  resetIndex();
  vectorIndex.closeDb();
  if (db.open) {
    try {
      db.close();
    } catch {
      // vectorIndex.closeDb owns the active handle; double-close is harmless here.
    }
  }
}

/** Seed a production-shaped memory_index row plus active projection/search indexes. */
export function seedMemoryRow(
  db: Database.Database,
  partial: SeedMemoryRowInput = {},
): SeededMemoryRow {
  const existingCount = db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number };
  const id = partial.id ?? existingCount.count + 1;
  const specFolder = partial.specFolder ?? DEFAULT_SPEC_FOLDER;
  const filePath = partial.filePath ?? `${specFolder}/memory-${id}.md`;
  const canonicalFilePath = partial.canonicalFilePath ?? filePath;
  const anchorId = partial.anchorId === undefined ? `anchor-${id}` : partial.anchorId;
  const title = partial.title ?? `Fixture memory ${id}`;
  const triggerPhrases = partial.triggerPhrases ?? [title.toLowerCase()];
  const contentText = partial.contentText ?? `${title} fixture content`;
  const createdAt = partial.createdAt ?? DEFAULT_CREATED_AT;
  const updatedAt = partial.updatedAt ?? createdAt;
  const embedding = partial.embedding ?? makeDefaultEmbedding(id / 10);

  db.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      anchor_id,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_status,
      base_importance,
      access_count,
      last_accessed,
      importance_tier,
      context_type,
      content_hash,
      stability,
      difficulty,
      last_review,
      review_count,
      is_archived,
      document_type,
      content_text,
      quality_score
    ) VALUES (
      @id,
      @specFolder,
      @filePath,
      @canonicalFilePath,
      @anchorId,
      @title,
      @triggerPhrases,
      @importanceWeight,
      @createdAt,
      @updatedAt,
      @embeddingStatus,
      @baseImportance,
      @accessCount,
      @lastAccessed,
      @importanceTier,
      @contextType,
      @contentHash,
      @stability,
      @difficulty,
      @lastReview,
      @reviewCount,
      @isArchived,
      @documentType,
      @contentText,
      @qualityScore
    )
  `).run({
    id,
    specFolder,
    filePath,
    canonicalFilePath,
    anchorId,
    title,
    triggerPhrases: JSON.stringify(triggerPhrases),
    importanceWeight: partial.importanceWeight ?? 0.7,
    createdAt,
    updatedAt,
    embeddingStatus: partial.embeddingStatus ?? 'success',
    baseImportance: partial.importanceWeight ?? 0.7,
    accessCount: partial.accessCount ?? 0,
    lastAccessed: partial.lastAccessed ?? 0,
    importanceTier: partial.importanceTier ?? 'important',
    contextType: partial.contextType ?? 'implementation',
    contentHash: `fixture-${id}`,
    stability: partial.stability ?? 1,
    difficulty: partial.difficulty ?? 5,
    lastReview: partial.lastReview ?? createdAt,
    reviewCount: partial.reviewCount ?? 0,
    isArchived: partial.isArchived ?? 0,
    documentType: partial.documentType ?? 'spec_doc',
    contentText,
    qualityScore: partial.qualityScore ?? 0.85,
  });

  upsertActiveProjection(db, id, specFolder, canonicalFilePath, anchorId, updatedAt);
  syncSearchAuxiliaryIndexes(db, id, embedding);

  return { id, specFolder, filePath };
}

/** Seed a causal edge using the production causal_edges shape. */
export function seedCausalEdge(
  db: Database.Database,
  partial: SeedCausalEdgeInput = {},
): number {
  const result = db.prepare(`
    INSERT INTO causal_edges (
      source_id,
      target_id,
      source_anchor,
      target_anchor,
      relation,
      strength,
      evidence,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    partial.sourceId ?? '1',
    partial.targetId ?? '2',
    partial.sourceAnchor ?? null,
    partial.targetAnchor ?? null,
    partial.relation ?? 'supports',
    partial.strength ?? 0.8,
    partial.evidence ?? 'fixture edge',
    partial.createdBy ?? 'vitest',
  );

  return Number(result.lastInsertRowid);
}

export function makeMemoryEmbedding(values: readonly number[]): Float32Array {
  const embedding = new Float32Array(getEmbeddingDimension());
  values.forEach((value, index) => {
    if (index < embedding.length) {
      embedding[index] = value;
    }
  });
  return embedding;
}
