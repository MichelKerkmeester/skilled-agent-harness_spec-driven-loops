// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — adapter interface (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical EmbedderAdapter contract for the shared embedding stack owned by
// the skill advisor. A consumer's local `mcp-server/lib/embedders/adapter.ts`
// re-exports from here instead of keeping its own copy of the interface, so the
// contract cannot drift per consumer.
//
// The interface carries the wider surface (an optional `options?:
// EmbedderOptions` parameter) so the query-versus-document hint survives at the
// type level rather than being reconstructed by each caller.
// ───────────────────────────────────────────────────────────────

import type { BackendKind } from './types.js';

/** What kind of input is being embedded. */
export type EmbedderInputType = 'document' | 'query';

/** Optional per-call hints for adapters that accept input-type. */
export interface EmbedderOptions {
  readonly inputType?: EmbedderInputType;
}

/**
 * The contract every embedder backend honors. The retrieval pipeline
 * (hybrid search and semantic-shadow scoring) calls `embed()` and doesn't care
 * which backend is underneath.
 *
 * Implementations live in `./adapters/<backend>.ts`. The factory in
 * `./registry.ts` returns the right adapter for a given name.
 *
 * Concrete implementations should:
 * - prepend `prefixQuery` to query text (caller signals query vs document
 *   via the optional `options.inputType` parameter)
 * - prepend `prefixDocument` to document text
 * - return `Float32Array` of exactly `dim` length per input text
 * - throw a typed error on backend unreachable, model-not-loaded or quota
 */
export interface EmbedderAdapter {
  /** Canonical name (matches manifest). */
  readonly name: string;

  /** Vector dimension. */
  readonly dim: number;

  /** Backend kind (matches manifest). */
  readonly backend: BackendKind;

  /** Optional query prefix (e.g. "search_query: " for nomic-embed). */
  readonly prefixQuery?: string;

  /** Optional document prefix (e.g. "search_document: " for nomic-embed). */
  readonly prefixDocument?: string;

  /**
   * Embed a batch of texts. Returns one `Float32Array` of `dim` length per
   * input, in the same order. The optional `options.inputType` selects
   * query vs document prefix when the adapter supports them. Implementations
   * choose their own batching strategy under the hood (most backends have
   * an optimal batch size).
   */
  embed(texts: ReadonlyArray<string>, options?: EmbedderOptions): Promise<Float32Array[]>;

  /**
   * Probe whether the backend is reachable and the model is loaded.
   * Returns `true` if `embed()` would currently succeed for a typical
   * input, so a caller can report or skip an unavailable backend instead of
   * discovering it mid-batch.
   */
  ready(): Promise<boolean>;
}
