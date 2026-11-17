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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `SUITES` is `tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts`. Every `npx vitest run` runs from `RT`, as in `cd .skilled/skills/system-deep-loop/runtime && npx vitest run SUITES`; run from any other directory it finds no tests.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the green baseline of the three suites (`RT/tests/unit/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and its pass count is written in `scratch/baseline.txt`.
- [ ] T002 Read both focus chains and confirm the cited lines still hold (`deep-research/scripts/reduce-state.cjs`, `RT/scripts/reduce-state.cjs`). Verify: `rg -n "deriveNextFocusFromContinuity|buildCarriedForwardOpenQuestions\(|REQUIRED_DIMENSIONS.find" .skilled/skills/system-deep-loop --glob '!**/tests/**'` prints the research continuity call, the `buildRegistry` call at about :2587 and both review base picks (about :2185 and :2272).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the P0 cases before any code change: REQ-001 cases (a) answered text and (b) stale status sentence, REQ-002 and REQ-003 (`RT/tests/unit/deep-research-reduce-state.vitest.ts`, `continuity-thread.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: `cd RT && npx vitest run SUITES` reports exactly the new cases failing.
- [ ] T004 In `buildCarriedForwardOpenQuestions`, keep only question-shaped items (ending in `?` or equal to a registry question) and drop items whose key matches an answered or resolved question; pass that set from the `buildRegistry` call at :2587 (`RT/lib/deep-loop/continuity-thread.cjs`, `deep-research/scripts/reduce-state.cjs`). Verify: both REQ-001 cases pass, including their asserts on the registry `carriedForwardOpenQuestions` list, its metric and strategy section 11A.
- [ ] T005 Add the leaf-recommendation step ahead of the carried-forward step, skipping an answered recommendation (`RT/lib/deep-loop/continuity-thread.cjs`). Verify: a `continuity-thread` case for the step and the REQ-005 sentinel case pass.
- [ ] T006 Pass the latest leaf `nextFocus` and the resolved questions from `resolveNextFocus` into the continuity call (`deep-research/scripts/reduce-state.cjs`). Verify: `rg -n "\.nextFocus" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` shows a read outside the parser at line 1944, and the REQ-002 reducer case passes.
- [ ] T007 Let the first uncovered required dimension outrank a leaf `nextFocus` that names none, at the strategy base pick (:2183-2186) and the dashboard twin (:2271-2273) (`RT/scripts/reduce-state.cjs`). Verify: the REQ-003 case passes with both its strategy and dashboard asserts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the three suites from the final state (`RT/tests/unit/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and the pass count is the baseline plus the new cases.
- [ ] T009 Confirm pivot and blocked-stop cases are unchanged (`RT/tests/unit/deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: `git diff --stat` on those two files shows only added lines.
- [ ] T010 Write the default-focus change into the phase changelog note, naming both the Next Focus change and the filtered carried-forward list (`implementation-summary.md`). Verify: `rg -n "default" implementation-summary.md` prints the line that states Next Focus and the carried-forward list change on normal runs.
- [ ] T011 Write one playbook scenario per loop for the focus change through `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook`, then again with `--path .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` (category `iteration-execution-and-state-discipline/` in both). Verify: `rg -il "status sentence" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` and `rg -il "first uncovered" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` each list the new scenario; both print nothing before this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The three suites exit 0 with the P0 cases red before and green after
- [ ] Both playbook scenarios exist
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md` §5, §13 (D5), §18 item 3, §20 Slice D
<!-- /ANCHOR:cross-refs -->

---
