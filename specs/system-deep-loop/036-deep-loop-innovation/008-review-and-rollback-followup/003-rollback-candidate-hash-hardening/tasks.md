---
title: "Tasks: Rollback Candidate Hash Hardening"
description: "Task breakdown for enforcing promoted-candidate-only rollback authority, landed in commit c4fc339e83. All tasks complete with evidence re-verified during this documentation pass."
trigger_phrases:
  - "rollback candidate hash hardening tasks"
  - "assertRollbackHashGuard task"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Checked off all tasks with evidence from commit c4fc339e83 and a re-run vitest pass"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Rollback Candidate Hash Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> All tasks complete. Landed and verified in commit `c4fc339e83`; evidence below includes a fresh per-file vitest re-run from this documentation pass.

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

- [x] T001 Confirm `assertRollbackHashGuard`'s dual-hash acceptance path in current source before editing
  - **Evidence**: `git show c4fc339e83` diff confirms the pre-fix `expectedRollbackSourceHashes` helper accepted `preAcceptTargetHash` OR `candidateHash`.
- [x] T002 [P] Identify both test files exercising the guard
  - **Evidence**: `rollback-candidate-hash-guard.vitest.ts` and `promote-candidate-benchmark.vitest.ts`, both touched in commit `c4fc339e83`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete `expectedRollbackSourceHashes` and its two-hash acceptance list [REQ-001]
  - **Evidence**: `git show c4fc339e83` shows the helper function removed from `rollback-candidate.cjs`.
- [x] T004 Require `currentTargetHash === acceptedState.candidateHash` exclusively [REQ-001]
  - **Evidence**: `git show c4fc339e83` shows the new single-condition check with comment "Rollback must target the promoted candidate so a stale pre-acceptance target cannot authorize restoration over the wrong canonical state."
- [x] T005 Update the benchmark's pre-ship-rollback case to expect rejection [REQ-003]
  - **Evidence**: `promote-candidate-benchmark.vitest.ts` test renamed to "blocks rollback before ship and from unexpected target drift"; now asserts `status === 1` and stderr matches `/unexpected canonical target state/`.
- [x] T006 Add a negative test proving a receipt-valid pre-acceptance target is rejected [REQ-002]
  - **Evidence**: `rollback-candidate-hash-guard.vitest.ts` gained a new test case per commit `c4fc339e83`'s stat (49 lines added).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run per-file vitest for both touched test files, confirm green [REQ-004]
  - **Evidence**: Re-run during this documentation pass via `npx vitest run --config vitest.config.mjs shared/tests/rollback-candidate-hash-guard.vitest.ts shared/tests/promote-candidate-benchmark.vitest.ts` from `.opencode/skills/system-deep-loop/deep-improvement/scripts`: `Test Files 2 passed (2)`, `Tests 15 passed (15)`.
- [x] T008 Confirm the negative test is red-before/green-after per the commit message
  - **Evidence**: `git log -1 c4fc339e83` message states the new negative test was "watched red before, green after".
- [x] T009 Author host packet documentation (spec, plan, tasks, implementation-summary) to Level 1
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` created/completed in this documentation pass.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  - **Evidence**: T001-T009 above.
- [x] No `[B]` blocked tasks remaining
  - **Evidence**: No `[B]` markers present in this file.
- [x] Per-file vitest evidence recorded
  - **Evidence**: 15/15 passed, re-verified during this documentation pass.

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
