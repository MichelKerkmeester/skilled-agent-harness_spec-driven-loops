---
title: "Tasks: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement"
description: "Task Format: T### [P?] Description (file path). All pending -- phase blocked on its predecessor."
trigger_phrases:
  - "tasks"
  - "council improvement behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement"
    last_updated_at: "2026-07-02T23:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; 30 runs scored, scorecard published"
    next_safe_action: "Phase 005: cross-skill scorecard + integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-004-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[x]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm predecessor gate passed (Phase 002 calibration retro); verify fixture restore for this phase's targets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author the seat/host delegation-evidence extensions in the framework reference (backward-compatible).
- [x] T003 [P] Author `deep-ai-council/behavior_benchmark/` (ACB-001..005; synthetic council topics; 25min budgets).
- [x] T004 [P] Author `deep-improvement/behavior_benchmark/` (IMB-001..005; dry-run-defaulted improvement targets; 25min budgets).
- [x] T005 Capture Claude baselines (10 runs); derive budgets.
- [x] T006 Run `gpt-fast-med` + `gpt-fast-high` legs for both packages (20 runs); score + classify each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Publish per-mode scorecards.
- [x] T008 `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[x]` remaining.
- [x] spec.md success criteria met with evidence.
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
