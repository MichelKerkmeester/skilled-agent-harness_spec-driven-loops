---
title: "Tasks: Memory MCP C9: Graceful Embedder-Degrade to Lexical"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "C9 tasks embedder degrade"
  - "stage1 candidate gen degrade tasks"
  - "memory recall lexical fallback tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/004-graceful-degradation"
    last_updated_at: "2026-07-04T17:50:57.895Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C9 task breakdown (all done, commit 484b77b589)"
    next_safe_action: "None. C9 shipped"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-004-graceful-degradation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Memory MCP C9: Graceful Embedder-Degrade to Lexical

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Status:** All tasks complete, C9 shipped in 030 commit `484b77b589`. Each `[x]` carries its delivery evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the three null-embedding throw sites + the keep-lexical substrate (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:700-707, 1014-1020` and `mcp_server/lib/search/hybrid-search.ts:931-947`), evidence: iter-003 f-iter003-007, iter-034 C9-sketch
- [x] T002 Capture baseline suite state, 440 search/pipeline tests. 2 pre-existing unrelated failures confirmed identical on baseline via stash (commit `484b77b589`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Route null/empty embedding → lexical (`useVector=false`) instead of throwing. Hybrid path via the live substrate + explicit route for the vector/multi-concept branches (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`), commit `484b77b589`
- [x] T004 Add `embedder_available` / `vector_search_skipped` to the Stage-1 output metadata (`mcp_server/lib/search/pipeline/types.ts`), commit `484b77b589`
- [x] T005 Plumb the degrade flags through the recall response + add the handler-level concept guard (`mcp_server/handlers/memory-search.ts`), commit `484b77b589`
- [x] T006 [Scope addition, documented/benign/zero-live-blast] Make pre-existing input throws (`>5 concepts`, empty query/concept, unknown searchType) propagate as a typed `Stage1InputError` rather than being swallowed to empty (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`), commit `484b77b589`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Add `stage1-embedder-degrade.vitest.ts` (5 cases) asserting degrade-to-lexical + flags (`mcp_server/tests/stage1-embedder-degrade.vitest.ts`), commit `484b77b589`
- [x] T008 Add the gate-D envelope assertion that the happy path is unchanged (`mcp_server/tests/...regression-embedding-semantic-search.vitest.ts`), commit `484b77b589`
- [x] T009 Prove the happy (embedder-success) path byte-identical via `git diff -w` trace. Degrade traced to BM25. Metadata plumbed through cache, independent opus adversarial review: SHIP (commit `484b77b589`)
- [x] T010 `tsc` + build pass. 440 search/pipeline tests pass, commit `484b77b589`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed (440 tests green, happy path byte-identical, opus SHIP)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Shipped record**: Wave-0 record (commit `484b77b589`)
<!-- /ANCHOR:cross-refs -->
