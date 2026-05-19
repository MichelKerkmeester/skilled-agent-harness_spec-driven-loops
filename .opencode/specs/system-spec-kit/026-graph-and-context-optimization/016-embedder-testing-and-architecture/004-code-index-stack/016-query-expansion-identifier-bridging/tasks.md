---
title: "Tasks: 016 Query Expansion Identifier Bridging"
description: "Level 2 task ledger for CocoIndex query expansion, tests, bench evidence, docs, and validation."
trigger_phrases:
  - "016 query expansion tasks"
  - "identifier bridging tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging"
    last_updated_at: "2026-05-19T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Task ledger updated"
    next_safe_action: "Resolve bench gate"
---
# Tasks: 016 Query Expansion Identifier Bridging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read binding spec and query/config entrypoints (`spec.md`, `query.py`, `config.py`) [20m]
- [x] T002 Invoke sequential-thinking MCP five times before edits (tool returned cancellation) [5m]
- [x] T003 Create `ExpandedQuery` dataclass (`query_expansion.py`) [5m]
- [x] T004 Implement `split_compound_identifier()` (`query_expansion.py`) [15m]
- [x] T005 Implement `generate_identifier_variants()` (`query_expansion.py`) [15m]
- [x] T006 Implement `apply_synonyms()` with cap (`query_expansion.py`) [15m]
- [x] T007 Implement `expand_query()` and FTS5 clause builder (`query_expansion.py`) [20m]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Add query expansion defaults and env fields (`config.py`) [15m]
- [x] T009 Add synonym JSON parser with fallback warnings (`config.py`) [15m]
- [x] T010 Add optional prebuilt FTS5 match clause (`fts_index.py`) [10m]
- [x] T011 Integrate expansion payload in `query_codebase()` (`query.py`) [20m]
- [x] T012 Implement dense fanout merge by `(file_path, chunk_id)` (`query.py`) [20m]
- [x] T013 Add JSONL query-expansion trace when rerank logging is enabled (`query.py`) [10m]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Add pure helper tests (`tests/test_query_expansion.py`) [25m]
- [x] T015 Add config default/override/fallback tests (`tests/test_config.py`) [20m]
- [x] T016 Add FTS5 expanded clause test (`tests/test_fts_index.py`) [10m]
- [x] T017 Add hybrid dense fanout integration test (`tests/test_fts_index.py`) [20m]
- [x] T018 Run targeted pytest for changed behavior [10m]
- [x] T019 Run ruff over changed Python files [5m]
- [x] T020 Run full MCP server pytest [15m]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Bench Evidence

- [x] T021 Stop/restart `ccc` daemon to pick up env defaults [5m]
- [x] T022 Run corrected Phase 2 smoke bench with `OUTPUT_TAG=-016-query-expansion` [30m]
- [x] T023 Save `evidence/phase2-comparison-016-query-expansion.md` [5m]
- [x] T024 Write `evidence/phase2-comparison-015-vs-016-delta.md` [15m]
- [x] T025 Inspect probes 1, 5, 12, 15 for miss-to-hit flips [15m]

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Docs And Validation

- [x] T026 Update `cocoindex_code/README.md` [15m]
- [x] T027 Append ADR-019 (`decision-record.md`) [15m]
- [x] T028 Create Level 2 packet docs (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) [30m]
- [x] T029 Create/refresh `description.json` and `graph-metadata.json` [10m]
- [x] T030 Run strict spec validation [10m]
- [x] T031 Finalize implementation summary and checklist evidence [15m]

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Targeted and full pytest passing.
- [ ] Bench hit rate is at least post-015 baseline.
- [x] Strict validation passed.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
