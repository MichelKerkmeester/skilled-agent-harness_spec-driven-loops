---
title: "Tasks: Stop free text hijacking Next Focus in research and review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "focus hijack fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Stop free text hijacking Next Focus in research and review

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `SUITES` is `deep-research-reduce-state continuity-thread deep-review-state-reducer`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the green baseline of the three suites (`RT/tests/unit/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and its pass count is written in `scratch/baseline.txt`.
- [ ] T002 Read both focus chains and confirm the cited lines still hold (`deep-research/scripts/reduce-state.cjs`, `RT/scripts/reduce-state.cjs`). Verify: `rg -n "deriveNextFocusFromContinuity|REQUIRED_DIMENSIONS.find" .skilled/skills/system-deep-loop` prints the research call site and the review base pick.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the three P0 cases before any code change (`RT/tests/unit/deep-research-reduce-state.vitest.ts`, `continuity-thread.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: `cd RT && npx vitest run SUITES` reports exactly the three new cases failing.
- [ ] T004 Drop carried-forward questions whose key matches an answered or resolved question (`RT/lib/deep-loop/continuity-thread.cjs`). Verify: the REQ-001 case passes.
- [ ] T005 Add the leaf-recommendation step ahead of the carried-forward step, skipping an answered recommendation (`RT/lib/deep-loop/continuity-thread.cjs`). Verify: a `continuity-thread` case for the step and the REQ-005 sentinel case pass.
- [ ] T006 Pass resolved questions and the latest leaf `nextFocus` from `resolveNextFocus` into the continuity call (`deep-research/scripts/reduce-state.cjs`). Verify: `rg -n "\.nextFocus" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` shows a read outside the parser at line 1944, and the REQ-002 reducer case passes.
- [ ] T007 Let the first uncovered required dimension outrank a leaf `nextFocus` that names none (`RT/scripts/reduce-state.cjs`). Verify: the REQ-003 case passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the three suites from the final state (`RT/tests/unit/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and the pass count is the baseline plus the new cases.
- [ ] T009 Confirm pivot and blocked-stop cases are unchanged (`RT/tests/unit/deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: `git diff --stat` on those two files shows only added lines.
- [ ] T010 Write the default-focus change into the phase changelog note (`implementation-summary.md`). Verify: `rg -n "default" implementation-summary.md` prints the line that states Next Focus changes on normal runs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The three suites exit 0 with the three P0 cases red before and green after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md` §5, §13 (D5), §18 item 3, §20 Slice D
<!-- /ANCHOR:cross-refs -->

---
