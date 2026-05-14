# Embedding worker chronic failure diagnostic 2026-05-14

## Status

Proposed

## Context

- Memory MCP is configured for `llama-cpp`, `unsloth-embeddinggemma-300m-GGUF`, 768 dimensions, q8, with hundreds of queued/pending embeddings and historical failures.
- All observed `memory_save({ filePath, retentionPolicy: "ephemeral" })` attempts returned E081, while `memory_search` failed at query embedding generation.
- Fourteen stale Memory MCP processes and one stuck CocoIndex daemon were removed earlier; vector rows briefly increased from 2523 to 2632, then slowed to roughly 1-2/minute.
- The retry manager is hard-coded to 5 items every 5 minutes, and both the shared embedding layer and retry manager have independent circuit breakers.
- `memory_save` errors are overgeneralized: `memory_save` maps to E081 by default, while unmatched errors return the same generic "unexpected error" message.

## Considered Options

### H1 - Background-loop-bound drain ceiling

The retry manager's configured ceiling is too low for a queue in the 400s. `BACKGROUND_JOB_CONFIG` sets `intervalMs: 5 * 60 * 1000` and `batchSize: 5` in `mcp_server/lib/providers/retry-manager.ts:342-347`, which caps steady-state recovery near 60 rows/hour.

### H2 - Singleton runtime and multi-process contention

Each MCP daemon owns its own lazy embedding provider and llama-cpp runtime. Anchors: `shared/embeddings.ts:365-417` and `shared/embeddings/providers/llama-cpp.ts:71-73`, `:195-229`. Stale daemons can hold SQLite/WAL connections and GGUF mappings while the live daemon times out or trips circuit breakers.

### H3 - Provider/runtime incompatibility

`LlamaCppProvider.canLoad()` validates readability/import, not inference (`llama-cpp.ts:294-305`). `node-llama-cpp` is declared as `^3.15.1` in `mcp_server/package.json:63-65`, while the install hint references 3.17.1 at `llama-cpp.ts:162-164`. A native/runtime/GGUF mismatch could produce repeated inference failure independent of the queue.

### H4 - Error-envelope opacity

Generic E081 is masking distinct failure classes. `memory_save` defaults to `MEMORY_SAVE_FAILED` in `lib/errors/core.ts:52-58`, and unmatched messages collapse at `core.ts:180-198`.

## Decision

Adopt H2 as the likely trigger and H1 as the confirmed recovery limiter. Treat H3 as the first falsification target before any throughput patch. Treat H4 as a necessary diagnostic repair because current API-level evidence is too lossy.

## Consequences

If this decision is right, process cleanup plus a controlled retry-throughput increase should restore vector coverage without changing the embedding model or database profile. Search should recover as soon as query embedding stops returning `null` and the circuit remains closed.

If this decision is wrong, the single-process smoke test will fail or failed counts will spike after retry throughput increases. In that case, rollback the retry patch/env vars and investigate node-llama-cpp/GGUF compatibility before touching database contents.

## References

- `shared/embeddings.ts:47-99`
- `shared/embeddings.ts:365-417`
- `shared/embeddings.ts:643-670`
- `shared/embeddings.ts:699-724`
- `shared/embeddings/providers/llama-cpp.ts:31-32`
- `shared/embeddings/providers/llama-cpp.ts:71-73`
- `shared/embeddings/providers/llama-cpp.ts:195-229`
- `shared/embeddings/providers/llama-cpp.ts:294-305`
- `mcp_server/lib/providers/retry-manager.ts:342-399`
- `mcp_server/lib/providers/retry-manager.ts:556-679`
- `mcp_server/lib/providers/retry-manager.ts:776-903`
- `mcp_server/lib/search/vector-index-store.ts:800-805`
- `mcp_server/handlers/save/response-builder.ts:395-415`
- `mcp_server/handlers/save/response-builder.ts:708-712`
- `mcp_server/lib/errors/core.ts:52-58`
- `mcp_server/lib/errors/core.ts:180-198`
- `mcp_server/package.json:63-65`
