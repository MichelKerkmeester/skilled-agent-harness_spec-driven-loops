---
title: "Tasks: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "Task Format: T### [P?] Description (file path). All pending -- phase blocked on its predecessor."
trigger_phrases:
  - "tasks"
  - "research context behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task list authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phase 002 calibration retro must land first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Rollout Behavioral Benchmarks -- deep-research + deep-context

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

- [B] T001 Confirm predecessor gate passed (Phase 002 calibration retro); verify fixture restore for this phase's targets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Author `deep-research/behavior_benchmark/` (RSB-001..008; self-contained research topics; iteration caps 1-2).
- [ ] T003 [P] Author `deep-context/behavior_benchmark/` (CXB-001..006; fixture targets).
- [ ] T004 Capture Claude baselines for both packages (14 runs); derive budgets.
- [ ] T005 Run `gpt-fast-med` + `gpt-fast-high` legs for both packages (28 runs); score + classify each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Publish per-mode scorecards; adjudicate the cross-mode ambiguity scenario.
- [ ] T007 `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`, no `[B]` remaining.
- [ ] spec.md success criteria met with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Framework**: `../001-framework-and-harness/`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
