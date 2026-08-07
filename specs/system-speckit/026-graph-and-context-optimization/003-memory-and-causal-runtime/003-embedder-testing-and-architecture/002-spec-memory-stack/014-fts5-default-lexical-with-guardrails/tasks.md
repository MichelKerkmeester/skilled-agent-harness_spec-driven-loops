---
title: "Tasks: FTS5 Default Lexical With Guardrails"
description: "Task ledger for implementing the FTS5 lexical default and golden-query guardrails."
trigger_phrases:
  - "fts5 lexical guardrail tasks"
  - "bm25 engine task ledger"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded implementation tasks"
    next_safe_action: "Mark verification tasks after command evidence"
    blockers: []
    key_files:
      - "tasks.md"
---
# Tasks: FTS5 Default Lexical With Guardrails

<!-- SPECKIT_LEVEL: 2 -->
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
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet 013 synthesis and iterations 003-005.
- [x] T002 Read BM25, FTS5, hybrid-search, context-server, health, and target tests.
- [x] T003 Confirm spec folder, frozen scope, and dirty-worktree constraints.
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `lib/search/lexical-normalizer.ts`.
- [x] T005 Update `bm25-index.ts` to import/re-export the normalizer and expose engine policy helpers.
- [x] T006 Update `sqlite-fts.ts` to import the shared normalizer.
- [x] T007 Update `hybrid-search.ts` so the BM25 lane uses FTS5 under `auto`/`sqlite`.
- [x] T008 Gate context-server BM25 warmup through `shouldWarmInMemoryBm25()`.
- [x] T009 Add `golden-queries.json` and `lexical-overlap-quality-gate.vitest.ts`.
- [x] T010 Pin BM25/hybrid singleton tests to `legacy-inmemory`.
- [x] T011 Extend `memory_health` full report with lexical engine and warm status.
- [x] T012 Update `ENV_REFERENCE.md` and `embedder_architecture.md`.
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run strict spec validation.
- [x] T014 Run MCP server typecheck.
- [x] T015 Run lexical overlap quality gate.
- [x] T016 Run BM25, hybrid-search, and sqlite-fts Vitest suites.
- [x] T017 Run MCP server build.
- [x] T018 Run integration probe for `auto` and `legacy-inmemory` warmup behavior.
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 checklist items verified.
- [x] Verification evidence recorded in `implementation-summary.md`.
- [x] Commit handoff contains source-only `git add` paths.
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Predecessor**: `../013-bm25-fts5-rag-fusion-investigation/research/research.md`
<!-- /ANCHOR:cross-refs -->
