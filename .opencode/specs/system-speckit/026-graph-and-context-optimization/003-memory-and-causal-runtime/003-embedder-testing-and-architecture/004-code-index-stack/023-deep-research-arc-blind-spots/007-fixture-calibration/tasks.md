---
title: "Tasks: 023B Fixture Calibration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "023B tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed 023B task list"
    next_safe_action: "Run full expanded bench when scheduled"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000003"
      session_id: "023-deep-research-arc-blind-spots/007-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Read 023C implementation summary.
- [x] T002 Read existing corrected fixture and phase2 bench scripts.
- [x] T003 Confirm scoped write surfaces and existing dirty worktree.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create expanded fixture v2.
- [x] T005 Add calibration aggregation and taxonomy helper.
- [x] T006 Add long-run expanded bench script.
- [x] T007 Add calibration perturbation tests.
- [x] T008 Add gates, taxonomy, and recommendation evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate fixture schema.
- [x] T010 Run targeted pytest.
- [x] T011 Run package pytest and ruff.
- [x] T012 Run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual/live smoke and automated verification recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: See `evidence/`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:l3-execution -->
## L3 Execution Notes

The full n>=3 sweep is intentionally deferred because the harness documents about 60 minutes wall time. This does not block harness completion, but it does block any ROBUST release verdict.
<!-- /ANCHOR:l3-execution -->
