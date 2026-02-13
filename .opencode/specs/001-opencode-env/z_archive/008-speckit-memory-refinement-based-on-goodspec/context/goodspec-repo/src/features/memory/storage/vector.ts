/**
 * Vector Storage for Semantic Search
 * Uses sqlite-vec for embedding storage and similarity search
 * @module features/memory/storage/vector
 */

import { Database } from "bun:sqlite";
import * as sqliteVec from "sqlite-vec";
import type { VectorSearchRow } from "../types.js";

type NamedBindings = Record<string, string | bigint | NodeJS.TypedArray | number | boolean | null>;

/**
 * Vector storage using sqlite-vec for semantic search
 */
export class VectorStorage {
  private db: Database;
  private initialized: boolean = false;
  private dimensions: number;

  constructor(db: Database, dimensions: number = 384) {
    this.db = db;
    this.dimensions = dimensions;
    this.initialize();
  }

  /**
   * Initialize vector storage
   */
  private initialize(): void {
    if (this.initialized) return;

    try {
      // Load sqlite-vec extension
      sqliteVec.load(this.db);

      // Verify extension loaded
      const version = this.db
        .query("SELECT vec_version() as version")
        .get() as { version: string } | null;

      if (version) {
        console.log(`[Memory] sqlite-vec loaded: v${version.version}`);
      }

      // Create vector table
      this.db.run(`
        CREATE VIRTUAL TABLE IF NOT EXISTS memory_vectors USING vec0(
          memory_id INTEGER PRIMARY KEY,
          embedding FLOAT[${this.dimensions}]
        )
      `);

      this.initialized = true;
    } catch (error) {
      console.error("[Memory] Failed to initialize vector storage:", error);
      // Continue without vector support - FTS5 will still work
      this.initialized = false;
    }
  }

  /**
   * Check if vector storage is available
   */
  isAvailable(): boolean {
    return this.initialized;
  }

  /**
   * Store an embedding for a memory
   */
  storeEmbedding(memoryId: number, embedding: Float32Array): void {
    if (!this.initialized) {
      console.warn("[Memory] Vector storage not initialized, skipping embedding");
      return;
    }

    if (embedding.length !== this.dimensions) {
      throw new Error(
        `Embedding dimension mismatch: expected ${this.dimensions}, got ${embedding.length}`
      );
    }

    try {
      // Delete existing embedding if any
      this.db
        .query<unknown, NamedBindings>("DELETE FROM memory_vectors WHERE memory_id = $id")
        .run({ $id: memoryId });

      // Insert new embedding
      this.db
        .query<unknown, NamedBindings>(
          "INSERT INTO memory_vectors (memory_id, embedding) VALUES ($id, $embedding)"
        )
        .run({
          $id: memoryId,
          $embedding: embedding,
        });
    } catch (error) {
      console.error(`[Memory] Failed to store embedding for memory ${memoryId}:`, error);
    }
  }

  /**
   * Search for similar embeddings using cosine similarity
   */
  searchSimilar(
    queryEmbedding: Float32Array,
    k: number = 10
  ): VectorSearchRow[] {
    if (!this.initialized) {
      return [];
    }

    if (queryEmbedding.length !== this.dimensions) {
      throw new Error(
        `Query embedding dimension mismatch: expected ${this.dimensions}, got ${queryEmbedding.length}`
      );
    }

    try {
      const results = this.db
        .query<VectorSearchRow, NamedBindings>(
          `
          SELECT
            memory_id,
            distance
          FROM memory_vectors
          WHERE embedding MATCH $embedding
            AND k = $k
          ORDER BY distance
        `
        )
        .all({
          $embedding: queryEmbedding,
          $k: k,
        }) as VectorSearchRow[];

      return results;
    } catch (error) {
      console.error("[Memory] Vector search failed:", error);
      return [];
    }
  }

  /**
   * Get embedding for a memory
   */
  getEmbedding(memoryId: number): Float32Array | null {
    if (!this.initialized) return null;

    try {
      const row = this.db
        .query<{ embedding: ArrayBuffer }, NamedBindings>(
          "SELECT embedding FROM memory_vectors WHERE memory_id = $id"
        )
        .get({ $id: memoryId }) as { embedding: ArrayBuffer } | null;

      if (!row) return null;
      return new Float32Array(row.embedding);
    } catch (error) {
      console.error(`[Memory] Failed to get embedding for memory ${memoryId}:`, error);
      return null;
    }
  }

  /**
   * Delete embedding for a memory
   */
  deleteEmbedding(memoryId: number): void {
    if (!this.initialized) return;

    try {
      this.db
        .query<unknown, NamedBindings>("DELETE FROM memory_vectors WHERE memory_id = $id")
        .run({ $id: memoryId });
    } catch (error) {
      console.error(`[Memory] Failed to delete embedding for memory ${memoryId}:`, error);
    }
  }

  /**
   * Check if an embedding exists for a memory
   */
  hasEmbedding(memoryId: number): boolean {
    if (!this.initialized) return false;

    const row = this.db
      .query<{ 1: number }, NamedBindings>(
        "SELECT 1 FROM memory_vectors WHERE memory_id = $id"
      )
      .get({ $id: memoryId });

    return row !== null;
  }

  /**
   * Count total embeddings
   */
  count(): number {
    if (!this.initialized) return 0;

    const row = this.db
      .query("SELECT COUNT(*) as count FROM memory_vectors")
      .get() as { count: number };

    return row.count;
  }

  /**
   * Delete embeddings for memories that no longer exist
   */
  cleanOrphans(): number {
    if (!this.initialized) return 0;

    const result = this.db.run(`
      DELETE FROM memory_vectors
      WHERE memory_id NOT IN (SELECT id FROM memories)
    `);

    return result.changes;
  }

  /**
   * Batch store embeddings
   */
  storeBatch(items: Array<{ memoryId: number; embedding: Float32Array }>): void {
    if (!this.initialized) return;

    const tx = this.db.transaction((batch: typeof items) => {
      for (const { memoryId, embedding } of batch) {
        this.storeEmbedding(memoryId, embedding);
      }
    });

    tx(items);
  }

  /**
   * Find memories without embeddings
   */
  findMissingEmbeddings(limit: number = 100): number[] {
    if (!this.initialized) return [];

    const rows = this.db
      .query<{ id: number }, NamedBindings>(
        `
        SELECT m.id FROM memories m
        LEFT JOIN memory_vectors v ON m.id = v.memory_id
        WHERE v.memory_id IS NULL
        LIMIT $limit
      `
      )
      .all({ $limit: limit }) as Array<{ id: number }>;

    return rows.map((r) => r.id);
  }
}
