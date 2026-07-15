---
title: "016/002: Ollama backend adapter + dim-tagged vec schema"
description: "Phase 2 of 016. Implement Ollama HTTP-API adapter + lazy vec_<dim> table creation + active-embedder pointer. The two-layer swap mechanism."
trigger_phrases:
  - "016/002 ollama backend"
  - "lazy vec_dim schema"
  - "active embedder pointer"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema"
    last_updated_at: "2026-05-17T06:50:50Z"
    last_updated_by: "codex"
    recent_action: "Implemented Ollama adapter, dim-tagged vec schema helpers, registry factory, and tests"
    next_safe_action: "Phase 016/003 can route MCP tools through getAdapter() + schema helpers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/002: Ollama backend adapter + dim-tagged vec schema

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | Implemented |
| Branch | main |
| Runtime | **cli-codex** (gpt-5.5 `model_reasoning_effort=high`, `service_tier=fast`) |
| Blocked by | None — 016/001 landed in `3d9e89d1f` |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
Implement the two pieces that make swapping actually work:
1. **OllamaAdapter** — HTTP client against `http://localhost:11434/api/embeddings` honoring prefix tokens
2. **Dim-tagged schema** — `vec_<dim>` tables (vec_768, vec_1024, vec_384) lazily created on first reference; settings row tracks `active_embedder_dim`


<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/lib/embedders/adapters/ollama.ts` — concrete OllamaAdapter implementing EmbedderAdapter
- `mcp_server/lib/embedders/schema.ts` — `ensureVecTableForDim(dim)` + `getActiveEmbedderDim()` + `setActiveEmbedderDim(dim)`
- `mcp_server/lib/search/vector-index-schema.ts` — update vec-table CREATE to accept dim parameter; preserve existing vec_768 (don't break current 008 corpus)
- Settings table row: `active_embedder_name` + `active_embedder_dim`
- vitest: OllamaAdapter (mock HTTP) + schema lazy-create

### Out of Scope
- MCP tools (phase 003)
- Re-index orchestrator (phase 003)
- Actual model swap (phase 004)
- Other adapters (llama-cpp, api, sentence-transformers) — leave registry stubs unimplemented


<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | OllamaAdapter.embed() against running ollama returns Float32Array[] | vitest with HTTP mock |
| REQ-002 | OllamaAdapter prepends prefixQuery/prefixDocument when configured | vitest covers nomic-embed manifest |
| REQ-003 | `ensureVecTableForDim(1024)` creates `vec_1024` if absent; idempotent | vitest covers both branches |
| REQ-004 | Active-embedder pointer in settings table | vitest read/write |
| REQ-005 | Existing vec_768 + 008 corpus NOT broken | re-run packet 008 PASS sample |

### P1
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-006 | Strict-validate 016/002 packet | exit 0 |
| REQ-007 | npm run build clean | exit 0 |
| REQ-008 | Codex K commit `8ec4f1491` SQL+trigger+rerank preserved | grep confirms untouched files |


<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- A future MCP tool can call `ensureVecTableForDim(1024)` + `setActiveEmbedderDim(1024)` without errors
- Vector store at vec_768 remains intact + queryable
- Phase 003 can build MCP tools against the schema layer


<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Risk: vec_table CREATE changes break existing 008 corpus → mitigate by additive-only changes; keep vec_768 column shape unchanged
- Risk: Ollama not installed on dev machine → mitigate via mock HTTP in vitest; document `brew install ollama` for users
- Dep: 016/001 must ship first (interface)

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Defer to phase parent (`013-embedder-testing-and-architecture/spec.md`) for orchestration-level open questions.
<!-- /ANCHOR:questions -->
