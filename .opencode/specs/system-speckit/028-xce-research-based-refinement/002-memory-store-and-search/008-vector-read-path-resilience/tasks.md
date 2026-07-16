---
title: "Tasks: Vector Read-Path Resilience & Performance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "013-vector-read-path-resilience tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/008-vector-read-path-resilience"
    last_updated_at: "2026-06-10T21:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed vector read-path resilience implementation"
    next_safe_action: "Rerun live-corpus KNN benchmark after live memory health recovers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-vector-read-path-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Vector Read-Path Resilience & Performance

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Corruption fixtures: malformed shard + missing vec table cases. Evidence: `tests/vector-shard-read-path-resilience.vitest.ts` corrupts a copied temp shard; `tests/vector-dimension-source.vitest.ts` covers absent/schema cases.
- [x] T002 Integrity probe at shard open/attach. Evidence: `vector-index-store.ts` probes `quick_check(1)` and required tables before attach and for already attached shards.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Quarantine (rename-aside) + auto-rebuild via reindex staging path. Evidence: fault-injection test observes detection, quarantine file, repair reindex, and rebuilt vector IDs `[1, 2]`.
- [x] T004 Degraded-vector health counters (additive; coordinate with 008). Evidence: `retrieval-observability.ts` adds counters under `recallDegradation.degradedVector`; existing observability suite passed 6 tests.
- [x] T005 Authoritative dimension source from embedder profile; demote regex fallback. Evidence: `tests/vector-dimension-source.vitest.ts` passes profile, warning fallback, and absent-schema cases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 KNN shape benchmark: scalar JOIN vs vec0 MATCH. Evidence: `tests/vector-knn-query-shape-benchmark.vitest.ts --reporter=verbose` recorded corpus 32, scalar JOIN 0.0201 ms, `MATCH` 0.0220 ms.
- [x] T007 Adopt winning shape if >20% gain (else record and keep current). Evidence: `MATCH` was slower in the isolated benchmark, so production search keeps scalar JOIN.
- [x] T008 Fault-injection end-to-end self-heal test. Evidence: 3 new test files passed, 5 tests; combined targeted + observability run passed 4 files, 11 tests.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: build and targeted vitest runs passed; spec validation pending final gate.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
