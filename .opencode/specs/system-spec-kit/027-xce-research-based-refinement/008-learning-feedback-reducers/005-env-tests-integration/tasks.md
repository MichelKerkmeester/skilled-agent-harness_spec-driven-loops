---
title: "Tasks — 005 Env Tests Integration"
description: "Task list for env documentation and integration closeout."
trigger_phrases:
  - "009 env tests tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/005-env-tests-integration"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
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

- [ ] T001 Confirm children 001-004 have landed.
- [ ] T002 Inventory all reducer flags and defaults.
- [ ] T003 Inventory required promotion evidence for each consumer: causal edge safety, and retention audit safety.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update `ENV_REFERENCE.md`.
- [ ] T005 Add default-off integration tests across consumers.
- [ ] T006 Add retention active-mode gate test.
- [ ] T007 Add causal reducer active-mutation gate test.
- [ ] T008 Add docs grep verification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run integration tests.
- [ ] T011 Run strict validation for parent and all children.
- [ ] T012 Record closeout evidence for default-off, shadow replay, and active-mode gates.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All flags documented.
- [ ] Integration tests pass.
- [ ] Parent and children validate.
- [ ] Live mutation/ranking remains blocked without consumer-specific promotion evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
