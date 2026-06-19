// ───────────────────────────────────────────────────────────────
// MODULE: Edge Vector Store
// ───────────────────────────────────────────────────────────────
// Stores relationship/fact embeddings for causal graph edges.

import { createHash } from 'node:crypto';
import type Database from 'better-sqlite3';

export interface EdgeVectorRecord {
  edgeId: number;
  embedding: readonly number[] | Float32Array;
  factText?: string | null;
  modelId?: string;
  profileKey?: string;
  inputKind?: 'edge';
}

export interface EdgeVectorStoredRecord {
  edgeId: number;
  embedding: Float32Array;
  factHash: string | null;
  modelId: string;
  profileKey: string;
  inputKind: 'edge';
  dimensions: number;
  status: 'pending' | 'ready' | 'failed';
  failureReason: string | null;
}

export interface EdgeVectorSearchOptions {
  limit: number;
  minScore?: number;
  modelId?: string;
  profileKey?: string;
}

export interface EdgeVectorSearchHit extends EdgeVectorStoredRecord {
  score: number;
}

const DEFAULT_PROFILE_KEY = 'default';
const DEFAULT_MODEL_ID = 'unknown';

const EDGE_VECTOR_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS edge_vector_embeddings (
    edge_id INTEGER NOT NULL,
    profile_key TEXT NOT NULL DEFAULT 'default',
    input_kind TEXT NOT NULL DEFAULT 'edge' CHECK(input_kind IN ('edge')),
    model_id TEXT NOT NULL,
    dimensions INTEGER NOT NULL,
    embedding BLOB,
    embedding_status TEXT NOT NULL DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'ready', 'failed')),
    failure_reason TEXT,
    fact_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (edge_id, profile_key, input_kind, model_id, dimensions),
    FOREIGN KEY(edge_id) REFERENCES causal_edges(id) ON DELETE CASCADE
  )
`;

export function ensureEdgeVectorStoreSchema(database: Database.Database): void {
  database.exec(EDGE_VECTOR_TABLE_SQL);
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_edge_vector_embeddings_status
    ON edge_vector_embeddings(embedding_status, updated_at)
  `);
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_edge_vector_embeddings_edge
    ON edge_vector_embeddings(edge_id)
  `);
}

function normalizeVector(embedding: readonly number[] | Float32Array): Float32Array {
  const vector = embedding instanceof Float32Array
    ? new Float32Array(embedding)
    : new Float32Array(embedding);
  if (vector.length === 0) {
    throw new Error('edge embedding must not be empty');
  }
  for (const value of vector) {
    if (!Number.isFinite(value)) {
      throw new Error('edge embedding must contain only finite numbers');
    }
  }
  return vector;
}

function embeddingToBuffer(embedding: Float32Array): Buffer {
  return Buffer.from(embedding.buffer.slice(
    embedding.byteOffset,
    embedding.byteOffset + embedding.byteLength,
  ));
}

function embeddingFromBuffer(buffer: Buffer | Uint8Array): Float32Array {
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  return new Float32Array(arrayBuffer);
}

function factHash(factText: string | null | undefined): string | null {
  const normalized = factText?.trim();
  if (!normalized) {
    return null;
  }
  return createHash('sha256').update(normalized).digest('hex');
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator > 0 ? dot / denominator : 0;
}

function rowToRecord(row: {
  edge_id: number;
  embedding: Buffer | Uint8Array | null;
  fact_hash: string | null;
  model_id: string;
  profile_key: string;
  input_kind: 'edge';
  dimensions: number;
  embedding_status: 'pending' | 'ready' | 'failed';
  failure_reason: string | null;
}): EdgeVectorStoredRecord | null {
  if (!row.embedding) {
    return null;
  }
  return {
    edgeId: row.edge_id,
    embedding: embeddingFromBuffer(row.embedding),
    factHash: row.fact_hash,
    modelId: row.model_id,
    profileKey: row.profile_key,
    inputKind: row.input_kind,
    dimensions: row.dimensions,
    status: row.embedding_status,
    failureReason: row.failure_reason,
  };
}

export function upsertEdgeVector(database: Database.Database, record: EdgeVectorRecord): void {
  ensureEdgeVectorStoreSchema(database);
  const embedding = normalizeVector(record.embedding);
  const modelId = record.modelId?.trim() || DEFAULT_MODEL_ID;
  const profileKey = record.profileKey?.trim() || DEFAULT_PROFILE_KEY;
  const inputKind = record.inputKind ?? 'edge';
  database.prepare(`
    INSERT INTO edge_vector_embeddings (
      edge_id, profile_key, input_kind, model_id, dimensions,
      embedding, embedding_status, failure_reason, fact_hash, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'ready', NULL, ?, datetime('now'))
    ON CONFLICT(edge_id, profile_key, input_kind, model_id, dimensions)
    DO UPDATE SET
      embedding = excluded.embedding,
      embedding_status = 'ready',
      failure_reason = NULL,
      fact_hash = excluded.fact_hash,
      updated_at = datetime('now')
  `).run(
    record.edgeId,
    profileKey,
    inputKind,
    modelId,
    embedding.length,
    embeddingToBuffer(embedding),
    factHash(record.factText),
  );
}

export function markEdgeVectorFailed(
  database: Database.Database,
  edgeId: number,
  reason: string,
  options: { modelId?: string; profileKey?: string; dimensions?: number } = {},
): void {
  ensureEdgeVectorStoreSchema(database);
  database.prepare(`
    INSERT INTO edge_vector_embeddings (
      edge_id, profile_key, input_kind, model_id, dimensions,
      embedding, embedding_status, failure_reason, updated_at
    ) VALUES (?, ?, 'edge', ?, ?, NULL, 'failed', ?, datetime('now'))
    ON CONFLICT(edge_id, profile_key, input_kind, model_id, dimensions)
    DO UPDATE SET
      embedding = NULL,
      embedding_status = 'failed',
      failure_reason = excluded.failure_reason,
      updated_at = datetime('now')
  `).run(
    edgeId,
    options.profileKey?.trim() || DEFAULT_PROFILE_KEY,
    options.modelId?.trim() || DEFAULT_MODEL_ID,
    options.dimensions ?? 0,
    reason,
  );
}

export function getEdgeVector(
  database: Database.Database,
  edgeId: number,
  options: { modelId?: string; profileKey?: string } = {},
): EdgeVectorStoredRecord | null {
  ensureEdgeVectorStoreSchema(database);
  const clauses = ['edge_id = ?', "input_kind = 'edge'"];
  const params: unknown[] = [edgeId];
  if (options.modelId) {
    clauses.push('model_id = ?');
    params.push(options.modelId);
  }
  if (options.profileKey) {
    clauses.push('profile_key = ?');
    params.push(options.profileKey);
  }
  const row = database.prepare(`
    SELECT edge_id, profile_key, input_kind, model_id, dimensions, embedding,
      embedding_status, failure_reason, fact_hash
    FROM edge_vector_embeddings
    WHERE ${clauses.join(' AND ')}
      AND embedding_status = 'ready'
    ORDER BY updated_at DESC
    LIMIT 1
  `).get(...params) as Parameters<typeof rowToRecord>[0] | undefined;
  return row ? rowToRecord(row) : null;
}

export function nearestEdgeVectors(
  database: Database.Database,
  queryEmbedding: readonly number[] | Float32Array,
  options: EdgeVectorSearchOptions,
): EdgeVectorSearchHit[] {
  ensureEdgeVectorStoreSchema(database);
  const query = normalizeVector(queryEmbedding);
  const limit = Math.max(0, Math.floor(options.limit));
  if (limit === 0) {
    return [];
  }
  const clauses = [
    "embedding_status = 'ready'",
    'embedding IS NOT NULL',
    'dimensions = ?',
    "input_kind = 'edge'",
  ];
  const params: unknown[] = [query.length];
  if (options.modelId) {
    clauses.push('model_id = ?');
    params.push(options.modelId);
  }
  if (options.profileKey) {
    clauses.push('profile_key = ?');
    params.push(options.profileKey);
  }
  const rows = database.prepare(`
    SELECT edge_id, profile_key, input_kind, model_id, dimensions, embedding,
      embedding_status, failure_reason, fact_hash
    FROM edge_vector_embeddings
    WHERE ${clauses.join(' AND ')}
    ORDER BY edge_id ASC
  `).all(...params) as Array<Parameters<typeof rowToRecord>[0]>;

  const minScore = options.minScore ?? -1;
  return rows
    .map((row) => rowToRecord(row))
    .filter((record): record is EdgeVectorStoredRecord => record !== null)
    .map((record) => ({
      ...record,
      score: cosineSimilarity(query, record.embedding),
    }))
    .filter((hit) => hit.score >= minScore)
    .sort((a, b) => b.score - a.score || a.edgeId - b.edgeId)
    .slice(0, limit);
}

export function deleteEdgeVector(database: Database.Database, edgeId: number): number {
  ensureEdgeVectorStoreSchema(database);
  const result = database.prepare('DELETE FROM edge_vector_embeddings WHERE edge_id = ?').run(edgeId);
  return result.changes;
}
