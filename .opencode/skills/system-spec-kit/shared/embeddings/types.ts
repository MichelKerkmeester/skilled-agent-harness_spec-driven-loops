// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — types (shared contract surface)
// ───────────────────────────────────────────────────────────────
// Canonical BackendKind + EmbedderManifest shared by mk-spec-memory and
// skill-advisor. Both skills' local `mcp_server/lib/embedders/types.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/types.ts so both
// skills share the canonical surface.
// ───────────────────────────────────────────────────────────────

/**
 * Backend kinds supported by the embedder layer.
 * Each kind has its own concrete adapter under `./adapters/`.
 *
 * - `ollama`: HTTP API against a local ollama daemon (port 11434 by default)
 * - `api`: remote OpenAI-compatible embeddings API
 * - `sentence-transformers`: Python sidecar speaking sentence-transformers
 */
export type BackendKind = 'ollama' | 'api' | 'sentence-transformers';

/**
 * Static declaration of an embedder's properties. The registry holds an
 * array of these manifests; concrete adapters consume them at construction
 * time.
 *
 * Dimensions are part of the manifest because the vector store uses
 * dim-tagged tables (`vec_768`, `vec_1024`, etc.). The registry lazily
 * creates the table matching `dim` when a new embedder is selected.
 *
 * Prefix tokens are required by some models (notably `nomic-embed-text-v1.5`):
 * - `prefixQuery` is prepended to text being embedded for a query
 * - `prefixDocument` is prepended to text being embedded for indexed content
 * If a model does not require prefixes, leave both fields undefined.
 */
export interface EmbedderManifest {
  /**
   * Canonical name (e.g. "mxbai-embed-large-v1"). Used as the lookup key in
   * `EmbedderRegistry.get(name)` and as the persisted value of the active
   * embedder pointer.
   */
  readonly name: string;

  /** Vector dimension. Must match the model's output exactly. */
  readonly dim: number;

  /** Which backend kind produces this embedder's adapter. */
  readonly backend: BackendKind;

  /**
   * `ollama pull <name>` argument for `backend: 'ollama'`. Defaults to the
   * manifest's `name` if absent. Required when the ollama tag differs from
   * the canonical manifest name.
   */
  readonly ollamaName?: string;

  /** HTTP URL for `backend: 'api'` (e.g. OpenAI-compatible embeddings). */
  readonly apiUrl?: string;

  /** Prepended to query text. Required by nomic-embed (`"search_query: "`). */
  readonly prefixQuery?: string;

  /** Prepended to document text. Required by nomic-embed (`"search_document: "`). */
  readonly prefixDocument?: string;

  /**
   * Maximum input characters sent to the backend after any required prefix
   * is applied. Leave undefined when the backend/provider handles long
   * inputs.
   */
  readonly maxInputChars?: number;

  /** Free-form notes (chosen-because, known-quirks, etc.). */
  readonly notes?: string;
}
