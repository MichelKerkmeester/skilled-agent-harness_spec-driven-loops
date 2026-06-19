import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { SCHEMA_VERSION, validateBackwardCompatibility } from '../lib/search/vector-index-schema';

describe('Vector index schema compatibility validator', () => {
  it('reports missing core tables on an empty database', () => {
    const db = new Database(':memory:');
    try {
      const report = validateBackwardCompatibility(db);
      expect(report.compatible).toBe(false);
      expect(report.missingTables).toEqual([
        'memory_index',
        'schema_version',
        'causal_edge_tombstones',
        'memory_trigger_embeddings',
        'memory_idempotency_receipts',
        'edge_vector_embeddings',
      ]);
      expect(report.missingColumns.memory_index).toContain('spec_folder');
      expect(report.missingColumns.causal_edges).toContain('fact_text');
      expect(report.missingColumns.causal_edge_tombstones).toContain('restore_metadata');
      expect(report.missingColumns.memory_trigger_embeddings).toContain('phrase_hash');
      expect(report.missingColumns.memory_idempotency_receipts).toContain('receipt_key');
      expect(report.missingColumns.edge_vector_embeddings).toContain('edge_id');
    } finally {
      db.close();
    }
  });

  it('accepts a minimally compatible schema footprint', () => {
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE schema_version (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          version INTEGER NOT NULL,
          updated_at TEXT
        );
        INSERT INTO schema_version (id, version, updated_at) VALUES (1, ${SCHEMA_VERSION}, datetime('now'));

        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT,
          file_path TEXT,
          importance_tier TEXT CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
          context_type TEXT,
          session_id TEXT,
          source_kind TEXT,
          content_hash TEXT,
          embedding_status TEXT,
          tenant_id TEXT,
          user_id TEXT,
          agent_id TEXT,
          parent_id INTEGER,
          canonical_file_path TEXT,
          anchor_id TEXT,
          created_at TEXT,
          updated_at TEXT,
          post_insert_enrichment_status TEXT,
          post_insert_enrichment_state TEXT,
          post_insert_enrichment_completed_at TEXT,
          post_insert_enrichment_version INTEGER,
          near_duplicate_of TEXT,
          last_dedup_checked_at TEXT,
          delete_after TEXT,
          deleted_at TEXT,
          stability REAL,
          difficulty REAL,
          last_review TEXT,
          document_type TEXT,
          quality_score REAL,
          retention_trust_score REAL,
          chunk_id TEXT,
          chunk_fingerprint TEXT,
          chunk_kind TEXT,
          chunk_start_line INTEGER,
          chunk_end_line INTEGER
        );
        CREATE INDEX idx_stability ON memory_index(stability DESC);
        CREATE INDEX idx_last_review ON memory_index(last_review);
        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
        CREATE INDEX idx_document_type ON memory_index(document_type);
        CREATE INDEX idx_doc_type_folder ON memory_index(document_type, spec_folder);
        CREATE INDEX idx_quality_score ON memory_index(quality_score);
        CREATE INDEX idx_post_insert_enrichment_incomplete
          ON memory_index(post_insert_enrichment_status, id)
          WHERE post_insert_enrichment_status != 'complete';
        CREATE INDEX idx_save_parent_content_hash_scope
          ON memory_index(
            spec_folder,
            content_hash,
            embedding_status,
            tenant_id,
            user_id,
            agent_id,
            session_id,
            id DESC
          )
          WHERE parent_id IS NULL;
        CREATE INDEX idx_save_parent_canonical_path
          ON memory_index(spec_folder, canonical_file_path, id DESC)
          WHERE parent_id IS NULL;
        CREATE UNIQUE INDEX idx_memory_logical_key_active_unique
          ON memory_index (
            spec_folder,
            COALESCE(NULLIF(canonical_file_path, ''), file_path),
            COALESCE(NULLIF(TRIM(anchor_id), ''), '_'),
            COALESCE(tenant_id, ''),
            COALESCE(user_id, ''),
            COALESCE(agent_id, ''),
            COALESCE(session_id, '')
          )
          WHERE COALESCE(importance_tier, 'normal') NOT IN ('constitutional', 'deprecated');
        CREATE INDEX idx_memory_chunk_identity
          ON memory_index(file_path, chunk_id)
          WHERE chunk_id IS NOT NULL;
        CREATE INDEX idx_memory_chunk_fingerprint
          ON memory_index(chunk_fingerprint)
          WHERE chunk_fingerprint IS NOT NULL;
        CREATE INDEX idx_memory_active_recall
          ON memory_index(spec_folder, document_type, updated_at DESC, id DESC)
          WHERE deleted_at IS NULL;
        CREATE INDEX idx_memory_purgeable_retention
          ON memory_index(delete_after, deleted_at, id)
          WHERE deleted_at IS NOT NULL;

        CREATE TABLE memory_history (
          id INTEGER PRIMARY KEY,
          memory_id INTEGER,
          timestamp TEXT
        );

        CREATE TABLE checkpoints (
          id INTEGER PRIMARY KEY,
          name TEXT,
          created_at TEXT
        );

        CREATE TABLE memory_conflicts (
          id INTEGER PRIMARY KEY,
          timestamp TEXT,
          action TEXT,
          new_memory_hash TEXT,
          new_memory_id INTEGER,
          existing_memory_id INTEGER,
          similarity REAL,
          reason TEXT,
          new_content_preview TEXT,
          existing_content_preview TEXT,
          contradiction_detected INTEGER,
          contradiction_type TEXT,
          spec_folder TEXT,
          created_at TEXT
        );
        CREATE INDEX idx_conflicts_memory ON memory_conflicts(existing_memory_id);
        CREATE INDEX idx_conflicts_timestamp ON memory_conflicts(timestamp DESC);

        CREATE TABLE causal_edges (
          id INTEGER PRIMARY KEY,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          source_anchor TEXT,
          target_anchor TEXT,
          relation TEXT NOT NULL,
          strength REAL DEFAULT 1.0,
          evidence TEXT,
          extracted_at TEXT DEFAULT (datetime('now')),
          created_by TEXT DEFAULT 'manual',
          confidence REAL DEFAULT 1.0,
          extraction_method TEXT DEFAULT 'manual',
          derived_id TEXT,
          fact_text TEXT,
          last_accessed TEXT,
          UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
        );
        CREATE UNIQUE INDEX idx_causal_edges_derived_id
          ON causal_edges(derived_id)
          WHERE derived_id IS NOT NULL;
        CREATE INDEX idx_causal_edges_retention_incoming
          ON causal_edges(target_id, relation, source_id);

        CREATE TABLE edge_vector_embeddings (
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
          PRIMARY KEY (edge_id, profile_key, input_kind, model_id, dimensions)
        );
        CREATE INDEX idx_edge_vector_embeddings_status
          ON edge_vector_embeddings(embedding_status, updated_at);
        CREATE INDEX idx_edge_vector_embeddings_edge
          ON edge_vector_embeddings(edge_id);

        CREATE TABLE causal_edge_tombstones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          relation TEXT NOT NULL,
          tombstoned_at TEXT NOT NULL,
          reason TEXT NOT NULL,
          lifecycle_generation INTEGER NOT NULL,
          restore_metadata TEXT NOT NULL
        );
        CREATE INDEX idx_causal_edge_tombstones_identity
          ON causal_edge_tombstones(source_id, target_id, relation, lifecycle_generation DESC);
        CREATE INDEX idx_causal_edge_tombstones_tombstoned_at
          ON causal_edge_tombstones(tombstoned_at DESC);
        CREATE INDEX idx_causal_edge_tombstones_reason
          ON causal_edge_tombstones(reason);

        CREATE TABLE memory_trigger_embeddings (
          memory_id INTEGER NOT NULL,
          phrase_hash TEXT NOT NULL,
          profile_key TEXT NOT NULL,
          input_kind TEXT NOT NULL DEFAULT 'document' CHECK(input_kind IN ('document', 'query')),
          model_id TEXT NOT NULL,
          dimensions INTEGER NOT NULL,
          embedding_status TEXT NOT NULL DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'ready', 'failed')),
          failure_reason TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          PRIMARY KEY (memory_id, phrase_hash, profile_key, input_kind)
        );
        CREATE INDEX idx_memory_trigger_embeddings_status
          ON memory_trigger_embeddings(embedding_status, updated_at);

        CREATE TABLE memory_idempotency_receipts (
          receipt_key TEXT PRIMARY KEY,
          operation TEXT NOT NULL,
          content_hash TEXT,
          request_fingerprint TEXT NOT NULL,
          payload_hash TEXT NOT NULL,
          response_payload TEXT NOT NULL,
          memory_id INTEGER,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX idx_memory_idempotency_receipts_operation
          ON memory_idempotency_receipts(operation, created_at DESC);
      `);

      const report = validateBackwardCompatibility(db);
      expect(report.compatible).toBe(true);
      expect(report.schemaVersion).toBe(SCHEMA_VERSION);
      expect(report.missingTables).toEqual([]);
      expect(report.missingColumns).toEqual({});
      expect(report.missingIndexes).toEqual([]);
      expect(report.constraintMismatches).toEqual([]);
      expect(report.warnings).toEqual([]);
    } finally {
      db.close();
    }
  });
});
