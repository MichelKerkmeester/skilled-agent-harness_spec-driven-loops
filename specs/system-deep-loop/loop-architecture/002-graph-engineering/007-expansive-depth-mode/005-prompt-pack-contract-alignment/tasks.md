---
title: "Tasks: Align the research prompt pack with the agent definition"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "prompt pack contract alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align the research prompt pack with the agent definition

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `PACK` is `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`. `SUITES` is `tests/unit/prompt-pack.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-research-deltas-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/check-documentation-drift.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts`. Every `npx vitest run` runs from `RT`, as in `cd .skilled/skills/system-deep-loop/runtime && npx vitest run SUITES`; run from any other directory it finds no tests. `COMPILED` is `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the green baseline of the seven suites (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and its pass count is written in `scratch/baseline.txt`.
- [ ] T002 Confirm no test asserts the old `Next Focus` narrative heading of the research pack (`RT/tests/`). Verify: `rg -n "Questions Remaining, Next Focus" .skilled/skills/system-deep-loop/runtime/tests` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the lockstep case, the rendered-pack case and the REQ-007 lineage render case before editing the template (`RT/tests/unit/prompt-pack.vitest.ts`). Verify: `cd RT && npx vitest run tests/unit/prompt-pack.vitest.ts` reports the new cases failing and every existing case passing.
- [ ] T004 Add the conditional entry for the `research.md` beside the `iterations/` directory of `{state_paths_iteration_pattern}` to the ALLOWED WRITE PATHS list, as static text naming `progressiveSynthesis` (`PACK`). Verify: `rg -n "research\.md.*progressiveSynthesis" PACK` prints one line between line 42 and the next list item, that line has no `research/research.md` literal, and the REQ-007 lineage case passes.
- [ ] T005 Rename the narrative heading `Next Focus` to `Recommended Next Focus` (`PACK`). Verify: `rg -n "Questions Remaining, Recommended Next Focus" PACK` prints one line.
- [ ] T006 Regenerate the research compiled contract for the new template digest as the last implementation step, and again after any merge that changes a digested source; never hand-resolve digest lines (`COMPILED`). Verify: `node RT/scripts/compile-command-contracts.cjs --command deep/research --write` prints the `COMPILED` path, and `shasum -a 256 PACK` matches the digest on the template's entry in `COMPILED`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the seven suites from the final state (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and the pass count is the baseline plus the new cases.
- [ ] T008 Prove the lockstep case catches drift (`scratch/`). Verify: a scratch copy of `PACK` with the T004 line removed, pointed at by the case's path override, makes the case fail; the scratch copy is then deleted.
- [ ] T009 Write one playbook scenario for the changed pack rule through `/create:manual-testing-playbook system-deep-loop update --path RT/manual-testing-playbook` (category `prompt-rendering/`). Verify: `rg -l "progressiveSynthesis" RT/manual-testing-playbook/prompt-rendering` lists the new scenario.
- [ ] T010 Confirm the change stayed on the research pack (`git diff --stat`). Verify: the stat lists only `PACK`, `COMPILED`, `RT/tests/unit/prompt-pack.vitest.ts` and files under `RT/manual-testing-playbook/`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The seven suites exit 0, the lockstep case fails on a drifted copy, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md` §10 (prompt-pack row), §13 (D6, D13), §20 Slice E
<!-- /ANCHOR:cross-refs -->

---
