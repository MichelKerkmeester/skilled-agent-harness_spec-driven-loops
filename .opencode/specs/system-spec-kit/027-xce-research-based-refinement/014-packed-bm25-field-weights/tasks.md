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
    last_updated_at: "2026-06-10T19:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Task list scaffolded from revalidation findings"
    next_safe_action: "Start T001 when this phase is picked up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Spike: packed postings layout, RSS measured at 1x/3x corpus
- [ ] T002 Eval baseline: legacy engine + FTS5 channel on bm25-baseline harness
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Packed engine implementation in the reserved packed-inmemory slot
- [ ] T004 BM25F per-field weighting from BM25_FIELD_WEIGHTS
- [ ] T005 Engine selection (legacy/packed/auto) explicit + logged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Scoring parity suite packed-vs-legacy on fixtures
- [ ] T007 Budget gates: RSS/warmup measured and recorded
- [ ] T008 Eval comparison recorded; minisearch contingency decision row if budgets breached
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
