---
title: "Tasks: 005 Post-Benchmark Improvement Research [template:level_2/tasks.md]"
description: "The research task list for the 10-angle read-only improvement study, all tasks done. Covers setup, the ten angle seats, the cross-model verification pass and the synthesis into research.md. No calibration or scorer or command or lever code modified."
trigger_phrases:
  - "005 improvement research tasks"
  - "post-benchmark research task list"
  - "10-angle read-only research tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research"
    last_updated_at: "2026-07-04T17:12:05.502Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all research tasks done across the 10 angles"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-tasks-030-vague-query-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 005 Post-Benchmark Improvement Research

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

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the research question and the read-only scope (`spec.md`)
- [x] T002 Confirm the 029 benchmark off-corpus case as the research seed (`spec.md`)
- [x] T003 Scope the ten angles across calibration, levers, scorer, command, and the two un-measured jobs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Angle seats (10)
- [x] T004 [P] Research the calibration false-relevance angle, the verdict and citation path (`research/deltas/`)
- [x] T005 [P] Research the weak-versus-gap boundary angle (`research/deltas/`)
- [x] T006 [P] Research the envelope-fidelity enforcement angle (`research/deltas/`)
- [x] T007 [P] Research the citation-grounding angle, the lexical floor (`research/deltas/`)
- [x] T008 [P] Research the red-team eval-set angle, the off-corpus class (`research/deltas/`)
- [x] T009 [P] Research the absolute-relevance re-fit angle, the noise floor (`research/deltas/`)
- [x] T010 [P] Research the un-built lever re-prioritization angle (`research/deltas/`)
- [x] T011 [P] Research the write-time quality-loop scorer angle (`research/deltas/`)
- [x] T012 [P] Research the adherence and logic-reading jobs angle (`research/deltas/`)
- [x] T013 [P] Research the model-driver defaulting angle (`research/deltas/`)

### Synthesis (1)
- [x] T014 Dedupe the 38 raw proposals and merge overlapping angles (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Group the load-bearing claims into eval-harness, scoring-logic, and grounding-envelope sets
- [x] T016 Cross-model verify each group with gpt-5.5-fast reading the live code
- [x] T017 Refine rank 4 (corroboration must gate the qualityRatio-on-a-lone-hit path)
- [x] T018 Drop any unevidenced proposal from the synthesis
- [x] T019 Rank the 12 entries by priority and benefit over effort into `research/research.md`
- [x] T020 Confirm no calibration, scorer, command, or lever code was modified
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Ranked improvement-proposal set written to research/research.md
- [x] Load-bearing claims verified by an independent model
- [x] checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
