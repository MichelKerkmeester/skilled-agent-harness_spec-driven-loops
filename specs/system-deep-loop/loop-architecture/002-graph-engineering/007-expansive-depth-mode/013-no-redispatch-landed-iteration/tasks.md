---
title: "Tasks: Stop redispatch_once from re-running an iteration that already landed"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "no redispatch landed iteration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Stop redispatch_once from re-running an iteration that already landed

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-deep-loop`. `C` is `.skilled/commands/deep/assets`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline of the two suites (`S/runtime/tests/unit/`). Verify: `cd S && npx vitest run runtime/tests/unit/verify-iteration.vitest.ts runtime/tests/unit/stop-policy-yaml-parity.vitest.ts` exits 0 and its pass count is written in `goal.md` §4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Write the reason-table case: an `executor_missing` fixture with each of narrative, state record and delta removed in turn (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: the case passes on the current script and asserts `iteration_file_missing`, `state_record_missing` and `delta_file_missing`.
- [ ] T003 Write the YAML assertion over both `redispatch_once` rules (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: it fails on the current YAMLs because neither rule names `executor_missing`.
- [ ] T004 Add the `executor_missing` exclusion to the research rule (`C/deep-research.yaml`). Verify: `grep -n 'redispatch_once:.*executor_missing' C/deep-research.yaml` prints one line.
- [ ] T005 Add the same exclusion, worded the same, to the review rule (`C/deep-review.yaml`). Verify: `grep -n 'redispatch_once:.*executor_missing' C/deep-review.yaml` prints one line and the T003 assertion passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun both suites from the final state (`S/runtime/tests/unit/`). Verify: the T001 command exits 0, its pass count equals the baseline plus the new cases, and the existing "append-only redispatch added a corrected one" case still passes.
- [ ] T007 Confirm both rules still cap the redispatch at one (`C/deep-research.yaml`). Verify: `grep -c 'Never re-dispatch a given iteration more than once' C/deep-research.yaml C/deep-review.yaml` prints 1 for each file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both YAML rules exclude `executor_missing` and the two suites pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D14 and §20 Slice M; `../scratch/opus-verification-log.md` F5
<!-- /ANCHOR:cross-refs -->

---
