---
title: "Tasks: Packed In-Memory BM25 Engine with Field Weights [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "014-packed-bm25-field-weights tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights"
    last_updated_at: "2026-06-10T20:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "All implementation and verification tasks completed with measured packed BM25 evidence"
    next_safe_action: "Monitor packed fallback telemetry"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Packed In-Memory BM25 Engine with Field Weights

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

- [x] T001 Spike: packed postings layout, RSS measured at 1x/3x corpus. Evidence: current corpus fixture 10,245 docs, 69.2 MB indexed text, RSS spike 111,017,984 bytes, warmup 809.17 ms; 3x projection 30,735 docs, RSS spike 247,676,928 bytes, warmup 2,689 ms.
- [x] T002 Eval baseline: legacy engine + FTS5 channel on bm25-baseline harness. Evidence: packed MRR@5 1.0000, legacy MRR@5 0.9000, FTS5 MRR@5 1.0000 on the fixture-backed comparison.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Packed engine implementation in the reserved packed-inmemory slot. Evidence: `BM25Index` supports `packed-inmemory`, stores per-document lengths and term keys, and materializes typed-array postings via `finalizePackedPostings()`.
- [x] T004 BM25F per-field weighting from BM25_FIELD_WEIGHTS. Evidence: packed scoring consumes title, trigger phrase, path, and body weights with query-time overrides.
- [x] T005 Engine selection (legacy/packed/auto) explicit + logged. Evidence: toggle test asserts legacy, packed, and auto selection plus console selection logs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Scoring parity suite packed-vs-legacy on fixtures. Evidence: `npx vitest run tests/bm25-packed-inmemory.vitest.ts` passed 1 file, 4 tests.
- [x] T007 Budget gates: RSS/warmup measured and recorded. Evidence: current corpus fixture stayed below 150 MB RSS and 10 s.
- [x] T008 Eval comparison recorded; minisearch contingency decision row if budgets breached. Evidence: current corpus passed, so contingency is not triggered; 3x projection exceeds 150 MB and is recorded as a scale risk outside the current P0 gate.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: build, targeted vitest, fixture eval, comment hygiene, and strict spec validation run.
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
