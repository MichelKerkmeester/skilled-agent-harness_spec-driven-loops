---
title: "Tasks: 016/002 Ollama backend + dim-tagged schema"
description: "Numbered checklist for the swap-mechanism phase."
trigger_phrases: ["016/002 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema"
    last_updated_at: "2026-05-17T06:50:50Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification"
    next_safe_action: "Commit + push, then Phase 016/003 can consume the adapter/schema APIs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/002 Ollama backend + dim-tagged schema

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed | `[ ]` = pending | `[~]` = partial


<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] T0.1: Confirm 016/001 EmbedderAdapter interface available on main
- [x] T0.2: Read `mcp_server/lib/search/vector-index-schema.ts` for current vec-table shape
- [x] T0.3: Confirm settings table exists; reused existing `vec_metadata` key/value table


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Ollama adapter
- [x] T1.1: Write `mcp_server/lib/embedders/adapters/ollama.ts` (preferred HTTP POST `/api/embed`, single-input fallback to `/api/embeddings`)
- [x] T1.2: Add prefix-token handling (`search_query: ` / `search_document: `)
- [x] T1.3: Implement `ready()` (GET `/api/tags`, check model present)
- [x] T1.4: Vitest with mocked HTTP — covers happy path + missing-model + prefix wiring

### Schema layer
- [x] T2.1: Write `mcp_server/lib/embedders/schema.ts` with `ensureVecTableForDim()`
- [x] T2.2: Add `active_embedder_name` + `active_embedder_dim` to existing `vec_metadata`
- [x] T2.3: Implement `getActiveEmbedder()` + `setActiveEmbedder()`
- [x] T2.4: Vitest with in-memory sqlite — covers idempotent create + read/write

### Integration
- [x] T3.1: Wire OllamaAdapter into registry via `getAdapter()`
- [x] T3.2: Sanity check: existing `vec_memories` baseline still works (`node dist/cli.js stats`)


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T4.1: vitest all new files pass (`embedder-ollama` 7 tests, `embedder-schema` 6 tests)
- [x] T4.2: `npm run build` clean
- [x] T4.3: Packet 008 read-only sample regression: `node dist/cli.js stats` succeeded against 12,928-memory llama-cpp 768-dim DB
- [x] T4.4: strict-validate 016/002 exit 0
- [x] T4.5: Commit + push: `feat(spec-kit/mcp_server): Ollama adapter + dim-tagged vec schema (016/002)`


<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- OllamaAdapter implements EmbedderAdapter end-to-end
- vec_768 / vec_1024 / vec_384 lazily creatable
- Active-embedder pointer readable + writable
- Existing 008 corpus untouched


<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Blocked by: 016/001 EmbedderAdapter interface
- Unblocks: 016/003 MCP tools + re-index orchestrator

<!-- /ANCHOR:cross-refs -->
