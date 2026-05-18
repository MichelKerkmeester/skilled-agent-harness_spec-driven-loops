---
title: "Tasks: 016/002/006 Ollama encode-path wiring"
description: "Task checklist for closing the Ollama/Jina query encode half-migration."
trigger_phrases: ["016/006 tasks", "ollama encode path tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring"
    last_updated_at: "2026-05-18T19:15:12Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks"
    next_safe_action: "Commit after main agent reviews git add handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts"
      - ".opencode/skills/system-spec-kit/shared/dist/embeddings/factory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-006-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/002/006 Ollama encode-path wiring

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed
- `[ ]` = pending
- `[~]` = partial

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] T1.1: Read `shared/embeddings/factory.ts` in full.
- [x] T1.2: Read `mcp_server/lib/embedders/adapters/ollama.ts` in full.
- [x] T1.3: Read `mcp_server/lib/embedders/registry.ts`.
- [x] T1.4: Read `shared/embeddings/profile.ts`.
- [x] T1.5: Inspect callers for `generateEmbedding`, `generateQueryEmbedding`, and provider metadata.
- [x] T1.6: Inspect llama-cpp availability behavior.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] T2.1: Add `shared/embeddings/providers/ollama.ts`.
- [x] T2.2: Add `ollama` to `SUPPORTED_PROVIDERS` and dimension maps.
- [x] T2.3: Add active `vec_metadata` auto-selection with `vec_<dim>` table row-count protection.
- [x] T2.4: Add explicit `EMBEDDINGS_PROVIDER=ollama` provider creation.
- [x] T2.5: Add `ollama` profile handling.
- [x] T2.6: Add regression tests to `mcp_server/tests/embedder-ollama.vitest.ts`.
- [x] T2.7: Update generated shared dist through the package build.
- [x] T2.8: Add embedder architecture documentation.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T3.1: Run MCP server typecheck.
- [x] T3.2: Run existing and new Ollama vitests.
- [x] T3.3: Run compiled-dist live Ollama probe.
- [x] T3.4: Build package outputs.
- [x] T3.5: Run strict spec validation.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- [x] Explicit Ollama provider returns 1024-dim Jina embeddings.
- [x] Auto mode resolves to `ollama` from the live active pointer.
- [x] Missing `vec_1024` protection falls back instead of crashing.
- [x] Non-Ollama providers remain in the supported provider set and typecheck.
- [x] Commit handoff includes exact `git add` paths.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Parent: `016-embedder-testing-and-architecture/002-spec-memory-stack`
- Predecessors: `001-adapter-interface`, `002-ollama-backend-and-multi-dim-schema`, `003-mcp-tools-and-reindex`, `004-spec-memory-embedder-bake-off`, `005-context-server-memory-reduction-research`
- Architecture doc: `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`

<!-- /ANCHOR:cross-refs -->
