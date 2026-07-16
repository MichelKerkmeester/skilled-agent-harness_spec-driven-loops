---
title: "Tasks — 005 Env Tests Integration"
description: "Task list for env documentation and integration closeout."
trigger_phrases:
  - "009 env tests tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration"
    last_updated_at: "2026-06-10T11:55:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed env docs and reducer integration tests"
    next_safe_action: "Parent closeout can review this child"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Tasks: Feedback Reducer Env and Integration Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm children 001-004 have landed. Evidence: shipped modules for aggregator, causal reducer, and retention reducer were read before imports.
- [x] T002 Inventory all reducer flags and defaults. Evidence: three reducer flags found; aggregator is read-only and flagless.
- [x] T003 Inventory required promotion evidence for each consumer. Evidence: causal requires its env gate; retention active requires shadow-evaluation evidence.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `ENV_REFERENCE.md`. Evidence: retention mode summary default changed from OFF to shadow; no rows added.
- [x] T005 Add default-off integration tests across consumers. Evidence: `tests/feedback-reducers-integration.vitest.ts` covers all flags unset.
- [x] T006 Add retention active-mode gate test. Evidence: active mode without shadow-evaluation evidence is blocked with no mutation.
- [x] T007 Add causal reducer active-mutation gate test. Evidence: causal flag-only path inserts one edge and leaves retention learning off.
- [x] T008 Add docs grep verification. Evidence: grep finds all three reducer env vars in `ENV_REFERENCE.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run integration tests. Evidence: Vitest integration plus canaries passed, 5 files and 90 tests.
- [x] T011 Run strict validation for this child. Evidence: `validate.sh --strict` passed with 0 errors and 0 warnings.
- [x] T012 Record closeout evidence for default-off, shadow mode, and active-mode gates. Evidence: implementation summary updated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All flags documented. Evidence: the three shipped reducer flags are documented with defaults.
- [x] Integration tests pass. Evidence: 5 Vitest files and 90 tests passed.
- [x] Child validates. Evidence: strict validation passed with 0 errors and 0 warnings.
- [x] Live mutation/ranking remains blocked without consumer-specific promotion evidence. Evidence: retention active without gate is audit-only; causal remains env-gated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
