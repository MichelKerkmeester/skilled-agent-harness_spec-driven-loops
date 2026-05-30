---
title: "Tasks: Phase 1: benchmark-mode-remediation [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/004-fix-hardening-review-findings-for-benchmark-mode"
    last_updated_at: "2026-05-28T18:39:19Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-fix-hardening-review-findings-for-benchmark-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: benchmark-mode-remediation

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

- [x] T001 Map 122 findings → fixes; verify F-P2-4 (promote-candidate works as designed) + F-P2-11 (dedup) as non-defects
- [x] T002 Capture baseline (vitest 116 green) before edits
- [x] T003 [P] READ-FIRST each target file (dispatch-model, cwd-check, score-model-variant, harness, dispute, run-benchmark)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 F-P1-1: add cwd:dir to dispatch-model spawn (all 5 executors) + _spawn test seam
- [x] T005 F-P1-2: cwd-check isInside() separator-bounded prefix guard
- [x] T006 F-P1-3 + F-P1-4: criteria-exec env gate + grader clampScore01 [0,1]
- [x] T007 P2 fixes: Atomics sleep, delta doc, cache-raw gate, dispute DI, REQ-004 wording; F-P2-1/2/5 reconciled as accepted deferrals
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Regression tests (tests/remediation.vitest.ts: 12 tests — all P1s + deterministic scoring)
- [x] T009 Full vitest green (11 files / 128 tests) + alignment-drift PASS (0 findings) + model-benchmark smoke + TST-1 intact
- [x] T010 Reconcile specs/phases (004 + parent 121 + 003 REQ-004 wording)
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

