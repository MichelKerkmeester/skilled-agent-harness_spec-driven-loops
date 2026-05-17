---
title: "Tasks: 016/002 Ollama backend + dim-tagged schema"
description: "Numbered checklist for the swap-mechanism phase."
trigger_phrases: ["016/002 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/002-ollama-backend-and-multi-dim-schema"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks stub"
    next_safe_action: "After 016/001 ships, cli-codex picks T1.1"
    blockers: ["016/001"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-tasks"
      parent_session_id: null
    completion_pct: 5
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
- [ ] T0.1: Confirm 016/001 EmbedderAdapter interface available on main
- [ ] T0.2: Read `mcp_server/lib/search/vector-index-schema.ts` for current vec-table shape
- [ ] T0.3: Confirm settings table exists or design fresh `embedder_settings` row


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Ollama adapter
- [ ] T1.1: Write `mcp_server/lib/embedders/adapters/ollama.ts` (HTTP POST /api/embeddings)
- [ ] T1.2: Add prefix-token handling (search_query: / search_document:)
- [ ] T1.3: Implement `ready()` (GET /api/tags, check model present)
- [ ] T1.4: Vitest with mocked HTTP — covers happy path + missing-model + prefix wiring

### Schema layer
- [ ] T2.1: Write `mcp_server/lib/embedders/schema.ts` with `ensureVecTableForDim()`
- [ ] T2.2: Add `active_embedder_name` + `active_embedder_dim` to settings table
- [ ] T2.3: Implement `getActiveEmbedder()` + `setActiveEmbedder()`
- [ ] T2.4: Vitest with in-memory sqlite — covers idempotent create + read/write

### Integration
- [ ] T3.1: Wire OllamaAdapter into registry (replace 001's skeleton stub for ollama-backed entries)
- [ ] T3.2: Sanity check: existing memory_search against vec_768 still works (read-only verify)


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [ ] T4.1: vitest all new files pass
- [ ] T4.2: `npm run build` clean
- [ ] T4.3: Re-run packet 008 PASS sample (5-10 scenarios) — no regression
- [ ] T4.4: strict-validate 016/002 exit 0
- [ ] T4.5: Commit + push: `feat(spec-kit/mcp_server): Ollama adapter + dim-tagged vec schema (016/002)`


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

