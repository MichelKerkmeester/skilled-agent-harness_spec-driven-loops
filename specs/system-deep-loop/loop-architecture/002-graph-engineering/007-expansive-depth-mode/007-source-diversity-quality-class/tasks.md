---
title: "Tasks: Derive SOURCE quality_class at the graph upsert choke point"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "source diversity quality class tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Derive SOURCE quality_class at the graph upsert choke point

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `SUITES` is `tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts`. Every `npx vitest run` runs from `RT`, as in `cd .skilled/skills/system-deep-loop/runtime && npx vitest run SUITES`; run from any other directory it finds no tests.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the green baseline of the four suites (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and its pass count is written in `scratch/baseline.txt`.
- [ ] T002 List every fixture that sets `quality_class` (`RT/tests/`). Verify: `rg -n "quality_class" RT/tests` prints the nine fixture lines named in `spec.md` and no others.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the REQ-001 strip-and-path case and the REQ-002 derivation case before any code change (`RT/tests/integration/upsert-script.vitest.ts`). Verify: `cd RT && npx vitest run tests/integration/upsert-script.vitest.ts` reports the two new cases failing.
- [ ] T004 Export the frozen vocabulary beside `SAFE_METADATA_KEYS` (`RT/lib/coverage-graph/coverage-graph-query.ts`). Verify: `rg -n "Object.freeze" RT/lib/coverage-graph/coverage-graph-query.ts` prints one line within 20 lines of line 123.
- [ ] T005 Strip the leaf value and set the class derived from `path`, then `name`, then `id` for research SOURCE nodes (`RT/scripts/upsert.cjs`). Verify: the REQ-001 and REQ-002 cases pass and the REQ-005 pass-through case passes.
- [ ] T006 Add the leaf-value-dropped case on the research upsert path (`RT/tests/unit/deep-research-graph-upsert.vitest.ts`). Verify: `cd RT && npx vitest run tests/unit/deep-research-graph-upsert.vitest.ts` exits 0 with the new case listed.
- [ ] T007 Move the upsert-seeded fixtures to source paths that derive distinct classes, and add the REQ-004 code-only fixture (a `.cjs` file plus its `.vitest.ts` test) (`RT/tests/integration/convergence-script.vitest.ts`, `RT/tests/unit/coverage-graph-signals.vitest.ts`). Verify: `rg -n "quality_class: '(primary|secondary|tertiary)'" RT/tests` prints nothing, the REQ-004 cases report 2.0 and 1.0, and the code-only fixture reports 2.0 with no `source_diversity_guard` blocker.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the four suites from the final state (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and the pass count is the baseline plus the new cases.
- [ ] T009 Confirm the vocabulary has one copy (`RT/scripts/upsert.cjs`). Verify: `rg -n "'repo-code'" RT/scripts RT/lib` prints only the constant's line.
- [ ] T010 Write the signal change into the phase changelog note, including that a single-class question still blocks (`implementation-summary.md`). Verify: `rg -n "sourceDiversity" implementation-summary.md` prints the line that states the signal now carries values on normal runs.
- [ ] T011 Write one playbook scenario for the derived classes through `/create:manual-testing-playbook system-deep-loop update --path RT/manual-testing-playbook` (category `coverage-graph/`). Verify: `rg -l "quality_class" RT/manual-testing-playbook/coverage-graph` lists the new scenario.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The four suites exit 0, no stored research SOURCE class falls outside the vocabulary, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md` §13 (D1), §15 (gaming risk), §18 (D1 honest fix), §20 Slice G
<!-- /ANCHOR:cross-refs -->

---
