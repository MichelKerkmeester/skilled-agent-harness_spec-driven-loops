// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — adapter interface (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical EmbedderAdapter contract shared by mk-spec-memory and
// skill-advisor. Both skills' local `mcp_server/lib/embedders/adapter.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/adapter.ts in
// phase 003/006 (shared-embedder-logic-with-spec-memory). The shared
// interface adopts skill-advisor's wider surface (optional
// `options?: EmbedderOptions` parameter) because it is strictly
// backward-compatible with mk-spec-memory's narrower interface and
// preserves the query-vs-document hint at the type level.
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
 * (hybrid-search, memory_search, memory_context, semantic-shadow scoring)
 * calls `embed()` and doesn't care which backend is underneath.
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
   * input. Used by `embedder_list` MCP tool.
   */
  ready(): Promise<boolean>;
}
