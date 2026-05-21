// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — adapter interface
// ───────────────────────────────────────────────────────────────
// Packet 016/001: the EmbedderAdapter interface that every concrete
// backend adapter implements. Phases 016/002-004 wire real adapters.
//
// See: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/
//      016-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface/spec.md
// ───────────────────────────────────────────────────────────────

import type { BackendKind } from './types.js';

/**
 * The contract every embedder backend honors. The retrieval pipeline
 * (hybrid-search, memory_search, memory_context) calls `embed()` and
 * doesn't care which backend is underneath.
 *
 * Implementations live in `./adapters/<backend>.ts`. The factory in
 * `./registry.ts` returns the right adapter for a given name.
 *
 * Concrete implementations should:
 * - prepend `prefixQuery` to query text (caller signals query vs document
 *   via a separate code path; see phase 016/002 for the wiring)
 * - prepend `prefixDocument` to document text
 * - return `Float32Array` of exactly `dim` length per input text
 * - throw a typed error (TBD in phase 016/002) on backend unreachable,
 *   model-not-loaded, or quota issues
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
   * input, in the same order. Implementations choose their own batching
   * strategy under the hood (most backends have an optimal batch size).
   */
  embed(texts: ReadonlyArray<string>): Promise<Float32Array[]>;

  /**
   * Probe whether the backend is reachable and the model is loaded.
   * Returns `true` if `embed()` would currently succeed for a typical
   * input. Used by `embedder_list` MCP tool (phase 016/003).
   */
  ready(): Promise<boolean>;
}
