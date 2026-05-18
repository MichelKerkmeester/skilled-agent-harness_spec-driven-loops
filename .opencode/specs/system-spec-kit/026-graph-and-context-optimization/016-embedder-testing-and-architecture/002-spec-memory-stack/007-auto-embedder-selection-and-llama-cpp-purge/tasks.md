---
title: "Tasks: 016/002/007 Auto-Embedder Selection + llama-cpp Purge"
description: "Task list per plan.md phases"
trigger_phrases: ["016/002/007 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T19:46:36Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "Codex executes T001"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007-tasks"
      parent_session_id: "016-002-007"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/002/007 Auto-Embedder Selection + llama-cpp Purge

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [ ] T001 - Inventory llama-cpp surface via grep + document in scratch/llama-cpp-surface-inventory.md
- [ ] T002 - Identify legacy DB path + size for operator-confirmed deletion handoff
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [ ] T003 - Add `shared/embeddings/auto-select.ts` with precedence chain
- [ ] T004 - Wire `autoSelectActiveEmbedder()` into `schema.ts` `getActiveEmbedder()`
- [ ] T005 - Persist auto-detection result to `vec_metadata` (with file-lock for race safety)
- [ ] T006 - Remove `LlamaCppProvider` from factory.ts
- [ ] T007 - Delete `shared/embeddings/llama-cpp-availability.ts` + remove `node-llama-cpp` from package.json
- [ ] T008 - Remove `embeddinggemma-300m` from manifest registry
- [ ] T009 - Update `DEFAULT_ACTIVE_EMBEDDER` to a sentinel that triggers auto-select
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [ ] T010 - Author `embedder-auto-selection.vitest.ts` covering 4 branches + fail-fast
- [ ] T011 - Update existing tests that assumed embeddinggemma default
- [ ] T012 - Update `embedder_architecture.md` + `INSTALL_GUIDE.md` with new precedence chain
- [ ] T013 - Update CHANGELOG with purge + migration note
- [ ] T014 - npm typecheck + vitest --run
- [ ] T015 - strict-validate on packet folder
- [ ] T016 - Live smoke (fresh DB + Ollama running → active = jina-v3 without operator action)
- [ ] T017 - Emit Commit Handoff with exact `git add` path list in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- All P0 requirements per spec.md §4
- llama-cpp surface verified gone via grep
- Fresh-DB smoke picks jina-v3 automatically
- strict-validate PASSED
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Predecessor: `../006-ollama-encode-path-wiring/`
- Production decision: `../004-spec-memory-embedder-bake-off/decision-record.md` ADR-012
<!-- /ANCHOR:cross-refs -->
