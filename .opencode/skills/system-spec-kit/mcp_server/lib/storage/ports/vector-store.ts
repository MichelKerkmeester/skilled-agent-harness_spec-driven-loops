// -------------------------------------------------------------------
// MODULE: Storage Ports - Vector Store
// -------------------------------------------------------------------

import { IVectorStore } from '../../interfaces/vector-store.js';
import {
  activeVectorSource,
  close_db,
  get_embedding_dim,
  initialize_db,
  sqlite_vec_available,
} from '../../search/vector-index-store.js';
import {
  VectorIndexError,
  VectorIndexErrorCode,
  type EmbeddingInput,
  type EnrichedSearchResult,
  type IndexMemoryParams,
  type MemoryRow,
  type VectorSearchOptions as LegacyVectorSearchOptions,
} from '../../search/vector-index-types.js';

import type { Awaitable, StorageId } from './common.js';
import type Database from 'better-sqlite3';

type JsonObject = Record<string, unknown>;

interface BetterSqliteVectorStoreOptions {
  readonly dbPath?: string;
}

type EnhancedSearchOptions = {
  specFolder?: string | null;
  minSimilarity?: number;
  diversityFactor?: number;
  noDiversity?: boolean;
};

let cachedQueries: Awaited<typeof import('../../search/vector-index-queries.js')> | null = null;
let cachedMutations: Awaited<typeof import('../../search/vector-index-mutations.js')> | null = null;
let cachedAliases: Awaited<typeof import('../../search/vector-index-aliases.js')> | null = null;

async function getQueriesModule(): Promise<Awaited<typeof import('../../search/vector-index-queries.js')>> {
  return cachedQueries ??= await import('../../search/vector-index-queries.js');
}

async function getMutationsModule(): Promise<Awaited<typeof import('../../search/vector-index-mutations.js')>> {
  return cachedMutations ??= await import('../../search/vector-index-mutations.js');
}

async function getAliasesModule(): Promise<Awaited<typeof import('../../search/vector-index-aliases.js')>> {
  return cachedAliases ??= await import('../../search/vector-index-aliases.js');
}

/** Metadata attached to a vector record. */
export type VectorMetadata = Readonly<Record<string, unknown>>;

/** Persisted vector entry. */
export interface VectorRecord<TMetadata extends VectorMetadata = VectorMetadata> {
  readonly id: StorageId;
  readonly embedding: readonly number[] | Float32Array;
  readonly metadata: TMetadata;
}

/** Ranked vector search hit. */
export interface VectorSearchResult<TMetadata extends VectorMetadata = VectorMetadata> {
  readonly id: StorageId;
  readonly score: number;
  readonly metadata: TMetadata;
}

/** Query options for vector nearest-neighbor retrieval. */
export interface VectorSearchOptions {
  readonly limit: number;
  readonly minScore?: number;
}

/** Port for vector persistence and similarity retrieval. */
export interface VectorStore<TMetadata extends VectorMetadata = VectorMetadata> {
  /** Insert or replace one vector record. */
  upsert(record: VectorRecord<TMetadata>): Awaitable<void>;

  /** Remove one vector record. */
  delete(id: StorageId): Awaitable<boolean>;

  /** Fetch one vector record by ID. */
  get(id: StorageId): Awaitable<VectorRecord<TMetadata> | null>;

  /** Return ranked vector matches for a query embedding. */
  search(
    embedding: readonly number[] | Float32Array,
    options: VectorSearchOptions,
  ): Awaitable<VectorSearchResult<TMetadata>[]>;

  /** Remove all vector records. */
  clear(): Awaitable<void>;
}

/** better-sqlite3-backed vector-store adapter. */
export class BetterSqliteVectorStore<TMetadata extends VectorMetadata = VectorMetadata>
  extends IVectorStore
  implements VectorStore<TMetadata> {
  dbPath: string | null;
  _initialized: boolean;

  constructor(options: BetterSqliteVectorStoreOptions = {}) {
    super();
    this.dbPath = options.dbPath || null;
    this._initialized = false;
  }

  _ensureInitialized(): void {
    if (!this._initialized) {
      this._getDatabase();
      this._initialized = true;
    }
  }

  _getDatabase(): Database.Database {
    return initialize_db(this.dbPath);
  }

  search(
    embedding: readonly number[] | Float32Array,
    options: VectorSearchOptions,
  ): Promise<VectorSearchResult<TMetadata>[]>;
  search(
    embedding: EmbeddingInput,
    topK: number,
    options?: LegacyVectorSearchOptions,
  ): Promise<MemoryRow[]>;
  async search(
    embedding: EmbeddingInput,
    optionsOrTopK: VectorSearchOptions | number,
    options: LegacyVectorSearchOptions = {},
  ): Promise<VectorSearchResult<TMetadata>[] | MemoryRow[]> {
    if (typeof optionsOrTopK !== 'number') {
      const rows = await this.search(embedding, optionsOrTopK.limit, {
        minSimilarity: optionsOrTopK.minScore === undefined ? 0 : optionsOrTopK.minScore * 100,
        includeConstitutional: false,
      });
      return rows.map((row) => ({
        id: String(row.id),
        score: typeof row.similarity === 'number' ? row.similarity / 100 : 0,
        metadata: row as unknown as TMetadata,
      }));
    }

    this._ensureInitialized();
    const database = this._getDatabase();

    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new VectorIndexError(
        `Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`,
        VectorIndexErrorCode.EMBEDDING_VALIDATION,
      );
    }

    const search_options = {
      limit: optionsOrTopK,
      specFolder: options.specFolder,
      minSimilarity: options.minSimilarity || 0,
      useDecay: options.useDecay !== false,
      tier: options.tier,
      contextType: options.contextType,
      includeConstitutional: options.includeConstitutional !== false,
      includeArchived: options.includeArchived === true
    };

    const { vector_search } = await getQueriesModule();
    return vector_search(embedding, search_options, database);
  }

  upsert(record: VectorRecord<TMetadata>): Promise<void>;
  upsert(id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number>;
  async upsert(
    recordOrId: VectorRecord<TMetadata> | string,
    embedding?: EmbeddingInput,
    metadata?: JsonObject,
  ): Promise<void | number> {
    if (typeof recordOrId !== 'string') {
      const recordEmbedding = recordOrId.embedding instanceof Float32Array
        ? recordOrId.embedding
        : Array.from(recordOrId.embedding);
      await this.upsert(String(recordOrId.id), recordEmbedding, recordOrId.metadata);
      return;
    }

    this._ensureInitialized();
    const database = this._getDatabase();

    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new VectorIndexError(
        `Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`,
        VectorIndexErrorCode.EMBEDDING_VALIDATION,
      );
    }

    const metadata_alias = (metadata ?? {}) as JsonObject & {
      spec_folder?: string;
      specFolder?: string;
      file_path?: string;
      filePath?: string;
      anchor_id?: string;
      anchorId?: string;
      title?: string;
      trigger_phrases?: string[];
      triggerPhrases?: string[];
      importance_weight?: number;
      importanceWeight?: number;
    };

    const params: IndexMemoryParams = {
      specFolder: metadata_alias.spec_folder || metadata_alias.specFolder || '',
      filePath: metadata_alias.file_path || metadata_alias.filePath || '',
      anchorId: metadata_alias.anchor_id || metadata_alias.anchorId || null,
      title: metadata_alias.title || null,
      triggerPhrases: metadata_alias.trigger_phrases || metadata_alias.triggerPhrases || [],
      importanceWeight: metadata_alias.importance_weight ?? metadata_alias.importanceWeight ?? 0.5,
      embedding: embedding
    };

    if (!params.specFolder || !params.filePath) {
      throw new VectorIndexError(
        'metadata must include spec_folder and file_path',
        VectorIndexErrorCode.STORE_ERROR,
      );
    }

    const { index_memory } = await getMutationsModule();
    return index_memory(params, database);
  }

  async delete(id: StorageId): Promise<boolean> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { delete_memory } = await getMutationsModule();
    return delete_memory(Number(id), database);
  }

  async get(id: StorageId): Promise<VectorRecord<TMetadata> | null>;
  async get(id: number): Promise<MemoryRow | null>;
  async get(id: StorageId): Promise<VectorRecord<TMetadata> | MemoryRow | null> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_memory } = await getQueriesModule();
    const row = get_memory(Number(id), database);
    if (!row) {
      return null;
    }
    if (typeof id === 'number') {
      return row;
    }
    const embedding = this.getEmbeddingForId(database, Number(row.id));
    return {
      id: row.id,
      embedding,
      metadata: row as unknown as TMetadata,
    };
  }

  async clear(): Promise<void> {
    this._ensureInitialized();
    const database = this._getDatabase();
    database.transaction(() => {
      database.prepare(`DELETE FROM ${activeVectorSource('vec_memories')}`).run();
      database.prepare('DELETE FROM active_memory_projection').run();
      database.prepare('DELETE FROM memory_index').run();
    })();
  }

  async getStats(): Promise<{ total: number; pending: number; success: number; failed: number; retry: number }> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_stats } = await getQueriesModule();
    return get_stats(database);
  }

  isAvailable(): boolean {
    return sqlite_vec_available();
  }

  getEmbeddingDimension(): number {
    return get_embedding_dim();
  }

  async close(): Promise<void> {
    if (this._initialized) {
      close_db();
      this._initialized = false;
    }
  }

  async deleteByPath(specFolder: string, filePath: string, anchorId: string | null = null): Promise<boolean> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { delete_memory_by_path } = await getMutationsModule();
    return delete_memory_by_path(specFolder, filePath, anchorId, database);
  }

  async getByFolder(specFolder: string): Promise<MemoryRow[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_memories_by_folder } = await getQueriesModule();
    return get_memories_by_folder(specFolder, database);
  }

  async searchEnriched(
    embedding: string,
    options: { specFolder?: string | null; minSimilarity?: number } = {},
  ): Promise<EnrichedSearchResult[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { vector_search_enriched } = await getQueriesModule();
    return vector_search_enriched(embedding, undefined, options, database);
  }

  async enhancedSearch(embedding: string, options: EnhancedSearchOptions = {}): Promise<EnrichedSearchResult[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { enhanced_search } = await getAliasesModule();
    return enhanced_search(embedding, undefined, options, database);
  }

  async getConstitutionalMemories(
    options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
  ): Promise<MemoryRow[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_constitutional_memories_public } = await getQueriesModule();
    return get_constitutional_memories_public(options, database);
  }

  async verifyIntegrity(
    options: { autoClean?: boolean; cleanFiles?: boolean } = {},
  ): Promise<{
    totalMemories: number;
    totalVectors: number;
    orphanedVectors: number;
    missingVectors: number;
    orphanedFiles: Array<{ id: number; file_path: string; reason: string }>;
    orphanedChunks: number;
    isConsistent: boolean;
    cleaned?: { vectors: number; chunks: number; files: number };
  }> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { verify_integrity } = await getQueriesModule();
    return verify_integrity(options, database);
  }

  private getEmbeddingForId(database: Database.Database, id: number): Float32Array {
    const row = database.prepare(`
      SELECT embedding
      FROM ${activeVectorSource('vec_memories')}
      WHERE rowid = ?
      LIMIT 1
    `).get(BigInt(id)) as { embedding?: Buffer | Uint8Array } | undefined;
    if (!row?.embedding) {
      return new Float32Array();
    }
    const buffer = row.embedding;
    return new Float32Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  }
}
