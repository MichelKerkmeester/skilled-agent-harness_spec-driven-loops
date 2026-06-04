---
title: "Tasks — 004 Feedback Retention Reducer"
description: "Task list for learned retention and edge floor logic."
trigger_phrases:
  - "009 retention reducer tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/004-retention-reducer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Tasks: Feedback Retention Reducer

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

- [ ] T001 Confirm `001-aggregator` and Phase 002 retention row fields are available.
- [ ] T002 Define `RetentionDecision` types.
- [ ] T003 Define shadow replay output for protect, extend, delete, and no-op decisions.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `feedback-retention-reducer.ts`.
- [ ] T005 Implement protect/extend/delete rules.
- [ ] T006 Create `edge-tier-basement.ts`.
- [ ] T007 Implement dry-run behavior.
- [ ] T008 Add retention feature flags and active-mode gate.
- [ ] T009 Add shadow replay mode with audit payloads and no mutation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Test all retention decision classes.
- [ ] T011 Test edge-floor narrowness.
- [ ] T012 Test sweep integration audit behavior.
- [ ] T013 Test shadow replay emits protect/extend/delete/no-op decisions without mutation.
- [ ] T014 Run child strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Shadow mode works without writes.
- [ ] Active mode is blocked until ledger quality and shadow replay evidence pass.
- [ ] Tests pass.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
