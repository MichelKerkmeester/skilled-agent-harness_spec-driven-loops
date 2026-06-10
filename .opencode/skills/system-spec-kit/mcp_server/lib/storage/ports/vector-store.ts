// -------------------------------------------------------------------
// MODULE: Storage Ports - Vector Store
// -------------------------------------------------------------------

import type { Awaitable, StorageId } from './common.js';

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
