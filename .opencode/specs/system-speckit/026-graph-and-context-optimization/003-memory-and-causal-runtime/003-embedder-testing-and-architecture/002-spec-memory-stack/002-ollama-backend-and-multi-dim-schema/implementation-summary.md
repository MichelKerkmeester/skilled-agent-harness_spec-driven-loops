---
title: "Summary: 016/002 Ollama backend + dim-tagged schema"
description: "Implemented OllamaAdapter, dim-tagged vec schema helpers, active embedder pointer, and registry factory."
trigger_phrases: ["016/002 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema"
    last_updated_at: "2026-05-17T06:50:50Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive adapter/schema layer"
    next_safe_action: "Phase 016/003 can add MCP tools and reindex orchestration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/002 Ollama backend + dim-tagged schema

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Implemented |
| Branch | main |
| Verification date | 2026-05-17 |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
- `lib/embedders/adapters/ollama.ts`: concrete `EmbedderAdapter` for Ollama. Uses Node `fetch`, defaults to `http://127.0.0.1:11434`, honors `OLLAMA_BASE_URL`, prefers `/api/embed`, falls back to `/api/embeddings` for single-input legacy responses, applies document/query prefixes, checks `/api/tags`, and throws typed errors for unreachable backend, missing model, and dimension mismatch.
- `lib/embedders/schema.ts`: additive schema helpers for `vec_<dim>` tables and active embedder pointer. The pointer reuses existing `vec_metadata` rows (`active_embedder_name`, `active_embedder_dim`) and defaults to `embeddinggemma-300m` / `768` when absent.
- `lib/embedders/registry.ts`: `getAdapter(name)` factory for Ollama manifests plus a baseline `llama-cpp` shim for `embeddinggemma-300m`; unimplemented backend families throw `NotImplementedError`.
- `lib/embedders/index.ts`: barrel exports for adapter, schema helpers, factory, and typed errors.
- `tests/embedder-ollama.vitest.ts` and `tests/embedder-schema.vitest.ts`: mocked HTTP and in-memory SQLite coverage.


<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
Delivered as an additive layer. Existing `providers/embeddings.ts`, retrieval pipeline callers, `vec_memories`, and Codex K search files were left untouched. Phase 003 can now consume `getAdapter()`, `ensureVecTableForDim()`, `getActiveEmbedder()`, and `setActiveEmbedder()` without changing current search behavior.


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- HTTP backend via Node fetch (no extra npm deps)
- Lazy table creation (don't pre-create all 3 dims)
- Active-embedder pointer uses existing `vec_metadata` key/value storage rather than a fresh table
- `vec_memories` legacy 768-dim table remains the active retrieval corpus until Phase 003/004
- Codex K commit `8ec4f1491` preserved: `bm25-index.ts`, `hybrid-search.ts`, `pipeline/stage3-rerank.ts`, and `sqlite-fts.ts` have no diff


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npx tsc --noEmit` | PASS |
| `npx vitest run tests/embedder-ollama.vitest.ts` | PASS — 7 tests |
| `npx vitest run tests/embedder-schema.vitest.ts` | PASS — 6 tests |
| `npx vitest run tests/embedder-registry.vitest.ts` | PASS — 10 tests |
| `node dist/cli.js stats` | PASS — read-only baseline reported 12,928 memories in the llama-cpp 768-dim DB |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../002-ollama-backend-and-multi-dim-schema --strict` | PASS — 0 errors, 0 warnings |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- Tests mock Ollama HTTP; no live Ollama daemon is required for CI.
- The new registry factory is available, but existing retrieval traffic still uses the old provider path until Phase 003 explicitly routes through it.
- `vec_<dim>` tables are ordinary BLOB tables for the additive schema layer; `vec_memories` remains the legacy sqlite-vec table for current search.

<!-- /ANCHOR:limitations -->
