
# YOUR NARROW FOCUS — iteration 008 of 10: Embedding provider abstraction + graceful degradation
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/providers/` — the embedding-provider interface + openai/gemini/ollama/cohere/openrouter implementations
- `packages/openltm-core/src/dao/embeddings.ts`, `packages/openltm-core/src/embeddings.ts`, `packages/openltm-core/src/janitor/embeddings.ts`
- `packages/openltm-core/src/vec/`
- `migrations/010_memory_embeddings_split.sql`, `migrations/003_embedding_index.sql`
- `docs/04-configuration.md` — provider configuration
Focus on: the pluggable provider interface, degrade-to-FTS5 when no provider is configured, and the SPLIT `memory_embeddings` table (to avoid MCP response bloat). Contrast with our ollama-nomic-768d embedder. We will NOT swap the model — so teachings must rescope TO ollama-nomic (e.g. provider abstraction layer, degradation posture, split-table schema), never replace it.
