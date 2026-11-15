---
title: "Tasks: Phase 27: ci-red-checks-after-council-retirement"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci red checks after council retirement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 27: ci-red-checks-after-council-retirement

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the failing test names in both CI runs and confirm they failed before this session's commits. Verify: run 43716064983 on `7e571f0f5cb` shows `not ok 110`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Dispatch `deep-review` in the Task guard case (`.skilled/hooks/shared/hook-stdin-deadline.test.mjs`). Verify: `node --test` on the file prints `fail 0`.
- [x] T003 Regenerate the derived history (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `node --test` on `agents-md-manifest.test.cjs` prints `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run the OpenCode Plugin Tests steps. Verify: hooks `fail 0`, plugins `fail 0`, installer exit 0.
- [x] T005 Run the doctor suites. Verify: `run-all.sh` prints `7 suite(s) passed, 0 failed`.
- [x] T006 Validate this phase and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
